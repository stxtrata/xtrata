var kw = Object.defineProperty;
var $w = (t, e, n) => e in t ? kw(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var po = (t, e, n) => $w(t, typeof e != "symbol" ? e + "" : e, n);
var wn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function H0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function kc(t) {
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
      typeof wn < "u" && wn || {}, r = {
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
        var L = {
          next: function() {
            var b = $.shift();
            return { done: b === void 0, value: b };
          }
        };
        return r.iterable && (L[Symbol.iterator] = function() {
          return L;
        }), L;
      }
      function f($) {
        this.map = {}, $ instanceof f ? $.forEach(function(L, b) {
          this.append(b, L);
        }, this) : Array.isArray($) ? $.forEach(function(L) {
          if (L.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + L.length);
          this.append(L[0], L[1]);
        }, this) : $ && Object.getOwnPropertyNames($).forEach(function(L) {
          this.append(L, $[L]);
        }, this);
      }
      f.prototype.append = function($, L) {
        $ = a($), L = c(L);
        var b = this.map[$];
        this.map[$] = b ? b + ", " + L : L;
      }, f.prototype.delete = function($) {
        delete this.map[a($)];
      }, f.prototype.get = function($) {
        return $ = a($), this.has($) ? this.map[$] : null;
      }, f.prototype.has = function($) {
        return this.map.hasOwnProperty(a($));
      }, f.prototype.set = function($, L) {
        this.map[a($)] = c(L);
      }, f.prototype.forEach = function($, L) {
        for (var b in this.map)
          this.map.hasOwnProperty(b) && $.call(L, this.map[b], b, this);
      }, f.prototype.keys = function() {
        var $ = [];
        return this.forEach(function(L, b) {
          $.push(b);
        }), u($);
      }, f.prototype.values = function() {
        var $ = [];
        return this.forEach(function(L) {
          $.push(L);
        }), u($);
      }, f.prototype.entries = function() {
        var $ = [];
        return this.forEach(function(L, b) {
          $.push([b, L]);
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
        return new Promise(function(L, b) {
          $.onload = function() {
            L($.result);
          }, $.onerror = function() {
            b($.error);
          };
        });
      }
      function p($) {
        var L = new FileReader(), b = w(L);
        return L.readAsArrayBuffer($), b;
      }
      function x($) {
        var L = new FileReader(), b = w(L), T = /charset=([A-Za-z0-9_-]+)/.exec($.type), D = T ? T[1] : "utf-8";
        return L.readAsText($, D), b;
      }
      function S($) {
        for (var L = new Uint8Array($), b = new Array(L.length), T = 0; T < L.length; T++)
          b[T] = String.fromCharCode(L[T]);
        return b.join("");
      }
      function M($) {
        if ($.slice)
          return $.slice(0);
        var L = new Uint8Array($.byteLength);
        return L.set(new Uint8Array($)), L.buffer;
      }
      function G() {
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
      var K = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function E($) {
        var L = $.toUpperCase();
        return K.indexOf(L) > -1 ? L : $;
      }
      function U($, L) {
        if (!(this instanceof U))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        L = L || {};
        var b = L.body;
        if ($ instanceof U) {
          if ($.bodyUsed)
            throw new TypeError("Already read");
          this.url = $.url, this.credentials = $.credentials, L.headers || (this.headers = new f($.headers)), this.method = $.method, this.mode = $.mode, this.signal = $.signal, !b && $._bodyInit != null && (b = $._bodyInit, $.bodyUsed = !0);
        } else
          this.url = String($);
        if (this.credentials = L.credentials || this.credentials || "same-origin", (L.headers || !this.headers) && (this.headers = new f(L.headers)), this.method = E(L.method || this.method || "GET"), this.mode = L.mode || this.mode || null, this.signal = L.signal || this.signal || function() {
          if ("AbortController" in n) {
            var C = new AbortController();
            return C.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && b)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(b), (this.method === "GET" || this.method === "HEAD") && (L.cache === "no-store" || L.cache === "no-cache")) {
          var T = /([?&])_=[^&]*/;
          if (T.test(this.url))
            this.url = this.url.replace(T, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var D = /\?/;
            this.url += (D.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      U.prototype.clone = function() {
        return new U(this, { body: this._bodyInit });
      };
      function _($) {
        var L = new FormData();
        return $.trim().split("&").forEach(function(b) {
          if (b) {
            var T = b.split("="), D = T.shift().replace(/\+/g, " "), C = T.join("=").replace(/\+/g, " ");
            L.append(decodeURIComponent(D), decodeURIComponent(C));
          }
        }), L;
      }
      function Q($) {
        var L = new f(), b = $.replace(/\r?\n[\t ]+/g, " ");
        return b.split("\r").map(function(T) {
          return T.indexOf(`
`) === 0 ? T.substr(1, T.length) : T;
        }).forEach(function(T) {
          var D = T.split(":"), C = D.shift().trim();
          if (C) {
            var it = D.join(":").trim();
            try {
              L.append(C, it);
            } catch (W) {
              console.warn("Response " + W.message);
            }
          }
        }), L;
      }
      G.call(U.prototype);
      function et($, L) {
        if (!(this instanceof et))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (L || (L = {}), this.type = "default", this.status = L.status === void 0 ? 200 : L.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = L.statusText === void 0 ? "" : "" + L.statusText, this.headers = new f(L.headers), this.url = L.url || "", this._initBody($);
      }
      G.call(et.prototype), et.prototype.clone = function() {
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
      var z = [301, 302, 303, 307, 308];
      et.redirect = function($, L) {
        if (z.indexOf(L) === -1)
          throw new RangeError("Invalid status code");
        return new et(null, { status: L, headers: { location: $ } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(L, b) {
          this.message = L, this.name = b;
          var T = Error(L);
          this.stack = T.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function q($, L) {
        return new Promise(function(b, T) {
          var D = new U($, L);
          if (D.signal && D.signal.aborted)
            return T(new e.DOMException("Aborted", "AbortError"));
          var C = new XMLHttpRequest();
          function it() {
            C.abort();
          }
          C.onload = function() {
            var k = {
              statusText: C.statusText,
              headers: Q(C.getAllResponseHeaders() || "")
            };
            D.url.indexOf("file://") === 0 && (C.status < 200 || C.status > 599) ? k.status = 200 : k.status = C.status, k.url = "responseURL" in C ? C.responseURL : k.headers.get("X-Request-URL");
            var H = "response" in C ? C.response : C.responseText;
            setTimeout(function() {
              b(new et(H, k));
            }, 0);
          }, C.onerror = function() {
            setTimeout(function() {
              T(new TypeError("Network request failed"));
            }, 0);
          }, C.ontimeout = function() {
            setTimeout(function() {
              T(new TypeError("Network request timed out"));
            }, 0);
          }, C.onabort = function() {
            setTimeout(function() {
              T(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function W(k) {
            try {
              return k === "" && n.location.href ? n.location.href : k;
            } catch {
              return k;
            }
          }
          if (C.open(D.method, W(D.url), !0), D.credentials === "include" ? C.withCredentials = !0 : D.credentials === "omit" && (C.withCredentials = !1), "responseType" in C && (r.blob ? C.responseType = "blob" : r.arrayBuffer && (C.responseType = "arraybuffer")), L && typeof L.headers == "object" && !(L.headers instanceof f || n.Headers && L.headers instanceof n.Headers)) {
            var Et = [];
            Object.getOwnPropertyNames(L.headers).forEach(function(k) {
              Et.push(a(k)), C.setRequestHeader(k, c(L.headers[k]));
            }), D.headers.forEach(function(k, H) {
              Et.indexOf(H) === -1 && C.setRequestHeader(H, k);
            });
          } else
            D.headers.forEach(function(k, H) {
              C.setRequestHeader(H, k);
            });
          D.signal && (D.signal.addEventListener("abort", it), C.onreadystatechange = function() {
            C.readyState === 4 && D.signal.removeEventListener("abort", it);
          }), C.send(typeof D._bodyInit > "u" ? null : D._bodyInit);
        });
      }
      return q.polyfill = !0, n.fetch || (n.fetch = q, n.Headers = f, n.Request = U, n.Response = et), e.Headers = f, e.Request = U, e.Response = et, e.fetch = q, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : wn);
})();
const Iw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Lw(t, e) {
  const n = {};
  return Object.assign(n, Iw, e), await fetch(t, n);
}
function Cw(t) {
  let e = Lw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Tw(...t) {
  const { fetchLib: e, middlewares: n } = Cw(t);
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
var Di;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Di || (Di = {}));
var Fs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Fs || (Fs = {}));
var ed;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ed || (ed = {}));
const Bw = "https://api.mainnet.hiro.so", Mw = "https://api.testnet.hiro.so", Nw = "http://localhost:3999", Pw = ["mainnet", "testnet", "devnet", "mocknet"];
let Fi = class {
  constructor(e) {
    this.version = Fs.Mainnet, this.chainId = Di.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Fs.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Tw();
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
Fi.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Pl();
    case "testnet":
      return new _w();
    case "devnet":
      return new Uw();
    case "mocknet":
      return new O0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Pw.join(", ")}`);
  }
};
Fi.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Fi.fromName(t);
let Pl = class extends Fi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Bw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Fs.Mainnet, this.chainId = Di.Mainnet;
  }
}, _w = class extends Fi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Mw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Fs.Testnet, this.chainId = Di.Testnet;
  }
}, O0 = class extends Fi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Nw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Fs.Testnet, this.chainId = Di.Testnet;
  }
};
const Uw = O0, D0 = "xtrata.wallet.bridge.v1", Hw = (t) => typeof t == "object" && t !== null && t.protocol === D0, Ow = (t) => Hw(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", Dw = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class go extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const nd = 12e4;
class Fw {
  constructor(e) {
    po(this, "pending", /* @__PURE__ */ new Map());
    po(this, "listenTarget");
    po(this, "closed", !1);
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
    po(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !Ow(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new go("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new go("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new go("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = Dw(), i = { protocol: D0, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new go(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? nd}ms.`
          )
        );
      }, this.options.timeoutMs ?? nd);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new go("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const jw = ["SP", "SM"], Rw = ["ST", "SN"], zw = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return jw.includes(n) ? "mainnet" : Rw.includes(n) ? "testnet" : null;
}, Gw = () => {
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
}, Kw = () => typeof window > "u" || !window.localStorage ? Gw() : window.localStorage, tl = "xtrata.v15.1.wallet.session", rd = "mainnet", Ya = { isConnected: !1 }, Vw = (t) => t.address ? zw(t.address) ?? t.network : t.network, F0 = (t) => !t.isConnected || !t.address ? { ...Ya } : Vw(t) !== rd ? { ...Ya } : {
  isConnected: !0,
  address: t.address,
  network: rd,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, qw = (t) => {
  if (!t)
    return { ...Ya };
  try {
    const e = JSON.parse(t);
    return F0(e);
  } catch {
    return { ...Ya };
  }
}, Yw = (t) => {
  const e = F0(t);
  return JSON.stringify(e);
}, Ww = (t) => {
  const e = Kw();
  return {
    load: () => qw(e.getItem(tl)),
    save: (n) => {
      e.setItem(tl, Yw(n));
    },
    clear: () => {
      e.removeItem(tl);
    }
  };
}, Xw = "https://browser.blockstack.org/auth", Zw = {
  "@type": "Person",
  "@context": "http://schema.org"
}, j0 = ["store_write"], Qw = "blockstack-session", Jw = {
  logLevel: "debug"
}, ri = {
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
Object.freeze(ri);
class ro extends Error {
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
class tb extends ro {
  constructor(e, n = "") {
    super({ code: ri.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class sd extends ro {
  constructor(e = "") {
    super({ code: ri.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class oa extends ro {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: ri.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class id extends ro {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: ri.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class _l extends ro {
  constructor(e) {
    super({ code: ri.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class R0 extends ro {
  constructor(e) {
    super({ code: ri.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const od = ["debug", "info", "warn", "error", "none"], Ul = {};
for (let t = 0; t < od.length; t++) {
  const e = od[t];
  Ul[e] = t;
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
    return Ul[Jw.logLevel] <= Ul[e];
  }
}
function eb() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function nb() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function el(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function rb() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function sb() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function ib(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function zu(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = sb(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    Bi.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = ib(s, t.toString(), n);
    throw Bi.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Ss(t, e) {
  return Gu(cn(t), e);
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
  if (kn(t, Uint8Array))
    return BigInt(`0x${yt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function ob(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function ad(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Ro(t, e = 8) {
  return (typeof t == "bigint" ? t : cn(t)).toString(16).padStart(e * 2, "0");
}
function $c(t) {
  return parseInt(t, 16);
}
function Gu(t, e = 16) {
  const n = Ro(t, e);
  return Wt(n);
}
function ab(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function cb(t, e) {
  return t & BigInt(1) << e;
}
function Hl(t) {
  return lb(BigInt(`0x${yt(t)}`), BigInt(t.byteLength * 8));
}
function lb(t, e) {
  return cb(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const ub = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function yt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += ub[n];
  return e;
}
function Wt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = ob(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function si(t) {
  return new TextEncoder().encode(t);
}
function zo(t) {
  return new TextDecoder().decode(t);
}
function fb(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function db(t) {
  return String.fromCharCode.apply(null, t);
}
function hb(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function cd(t) {
  if (t.some(hb))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function br(...t) {
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
  return br(...t.map((e) => typeof e == "number" ? cd([e]) : e instanceof Array ? cd(e) : e));
}
function kn(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const z0 = "https://api.mainnet.hiro.so", G0 = "https://api.testnet.hiro.so", K0 = "http://localhost:3999", pb = "https://hub.blockstack.org", gb = 33, nl = 32;
function yb(t) {
  if (t.length < nl * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + nl * 2), r = t.slice(2 + nl * 2);
  return {
    recoveryId: $c(e),
    r: n,
    s: r
  };
}
function Ku(t) {
  const e = typeof t == "string" ? Wt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function wb(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function bb(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function mb(t, e) {
  return t[e];
}
function xb(t, e, n = 0) {
  return t[n] = e, t;
}
function Sb(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function js(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Eb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Ab(t, e) {
  const n = {};
  return Object.assign(n, Eb, e), await fetch(t, n);
}
function vb(t) {
  let e = Ab, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function kb(...t) {
  const { fetchLib: e, middlewares: n } = vb(t);
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
class V0 {
  constructor(e = j0.slice(), n = ((a) => (a = zu("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = Xw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Ol(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function $b(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function q0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Ib(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ol(t.outputLen), Ol(t.blockLen);
}
function Lb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Cb(t, e) {
  q0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Cs = {
  number: Ol,
  bool: $b,
  bytes: q0,
  hash: Ib,
  exists: Lb,
  output: Cb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const rl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), ir = (t, e) => t << 32 - e | t >>> e, Tb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Tb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Bb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Vu(t) {
  if (typeof t == "string" && (t = Bb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Y0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ii(t) {
  const e = (r) => t().update(Vu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let W0 = class extends Y0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Cs.hash(e);
    const r = Vu(n);
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
    return Cs.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Cs.exists(this), Cs.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Ic = (t, e, n) => new W0(t, e).update(n).digest();
Ic.create = (t, e) => new W0(t, e);
function Mb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let qu = class extends Y0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = rl(this.buffer);
  }
  update(e) {
    Cs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Vu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = rl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Cs.exists(this), Cs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Mb(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = rl(e), c = this.outputLen;
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
const Nb = (t, e, n) => t & e ^ ~t & n, Pb = (t, e, n) => t & e ^ t & n ^ e & n, _b = new Uint32Array([
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
let X0 = class extends qu {
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
      const w = Kr[l - 15], p = Kr[l - 2], x = ir(w, 7) ^ ir(w, 18) ^ w >>> 3, S = ir(p, 17) ^ ir(p, 19) ^ p >>> 10;
      Kr[l] = S + Kr[l - 7] + x + Kr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const w = ir(a, 6) ^ ir(a, 11) ^ ir(a, 25), p = f + w + Nb(a, c, u) + _b[l] + Kr[l] | 0, S = (ir(r, 2) ^ ir(r, 13) ^ ir(r, 22)) + Pb(r, s, i) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    Kr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Ub = class extends X0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const ji = ii(() => new X0());
ii(() => new Ub());
const Hb = {}, Z0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Hb
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const qt = BigInt(0), me = BigInt(1), ys = BigInt(2), vo = BigInt(3), ld = BigInt(8), oe = Object.freeze({
  a: qt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: me,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), ud = (t, e) => (t + e / ys) / e, aa = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = oe, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -me * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = ud(i * t, e), c = ud(-r * t, e);
    let u = nt(t - a * n - c * s, e), f = nt(-a * r - c * i, e);
    const l = u > o, w = f > o;
    if (l && (u = e - u), w && (f = e - f), u > o || f > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: w, k2: f };
  }
}, nr = 32, Rs = 32, Q0 = 32, Wa = nr + 1, Xa = 2 * nr + 1;
function fd(t) {
  const { a: e, b: n } = oe, r = nt(t * t), s = nt(r * t);
  return nt(s + e * t + n);
}
const ca = oe.a === qt;
class Yu extends Error {
  constructor(e) {
    super(e);
  }
}
function dd(t) {
  if (!(t instanceof Jt))
    throw new TypeError("JacobianPoint expected");
}
class Jt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Ft))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Ft.ZERO) ? Jt.ZERO : new Jt(e.x, e.y, me);
  }
  static toAffineBatch(e) {
    const n = Rb(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return Jt.toAffineBatch(e).map(Jt.fromAffine);
  }
  equals(e) {
    dd(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = nt(s * s), u = nt(a * a), f = nt(n * u), l = nt(i * c), w = nt(nt(r * a) * u), p = nt(nt(o * s) * c);
    return f === l && w === p;
  }
  negate() {
    return new Jt(this.x, nt(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = nt(e * e), i = nt(n * n), o = nt(i * i), a = e + i, c = nt(ys * (nt(a * a) - s - o)), u = nt(vo * s), f = nt(u * u), l = nt(f - ys * c), w = nt(u * (c - l) - ld * o), p = nt(ys * n * r);
    return new Jt(l, w, p);
  }
  add(e) {
    dd(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === qt || o === qt)
      return this;
    if (n === qt || r === qt)
      return e;
    const c = nt(s * s), u = nt(a * a), f = nt(n * u), l = nt(i * c), w = nt(nt(r * a) * u), p = nt(nt(o * s) * c), x = nt(l - f), S = nt(p - w);
    if (x === qt)
      return S === qt ? this.double() : Jt.ZERO;
    const M = nt(x * x), G = nt(x * M), K = nt(f * M), E = nt(S * S - G - ys * K), U = nt(S * (K - E) - w * G), _ = nt(s * a * x);
    return new Jt(E, U, _);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Jt.ZERO;
    if (typeof e == "bigint" && e === qt)
      return n;
    let r = gd(e);
    if (r === me)
      return this;
    if (!ca) {
      let l = n, w = this;
      for (; r > qt; )
        r & me && (l = l.add(w)), w = w.double(), r >>= me;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = aa.splitScalar(r), c = n, u = n, f = this;
    for (; i > qt || a > qt; )
      i & me && (c = c.add(f)), a & me && (u = u.add(f)), f = f.double(), i >>= me, a >>= me;
    return s && (c = c.negate()), o && (u = u.negate()), u = new Jt(nt(u.x * aa.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = ca ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(Jt.BASE) && (n = Ft.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Dl.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = Jt.normalizeZ(s), Dl.set(n, s)));
    let i = Jt.ZERO, o = Jt.BASE;
    const a = 1 + (ca ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), f = 2 ** r, l = BigInt(r);
    for (let w = 0; w < a; w++) {
      const p = w * c;
      let x = Number(e & u);
      e >>= l, x > c && (x -= f, e += me);
      const S = p, M = p + Math.abs(x) - 1, G = w % 2 !== 0, K = x < 0;
      x === 0 ? o = o.add(la(G, s[S])) : i = i.add(la(K, s[M]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = gd(e), s, i;
    if (ca) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = aa.splitScalar(r);
      let { p: f, f: l } = this.wNAF(a, n), { p: w, f: p } = this.wNAF(u, n);
      f = la(o, f), w = la(c, w), w = new Jt(nt(w.x * aa.beta), w.y, w.z), s = f.add(w), i = l.add(p);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return Jt.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(Jt.ZERO);
    e == null && (e = i ? ld : so(s));
    const o = e, a = nt(o * o), c = nt(a * o), u = nt(n * a), f = nt(r * c), l = nt(s * o);
    if (i)
      return Ft.ZERO;
    if (l !== me)
      throw new Error("invZ was invalid");
    return new Ft(u, f);
  }
}
Jt.BASE = new Jt(oe.Gx, oe.Gy, me);
Jt.ZERO = new Jt(qt, me, qt);
function la(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Dl = /* @__PURE__ */ new WeakMap();
class Ft {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Dl.delete(this);
  }
  hasEvenY() {
    return this.y % ys === qt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Hn(n ? e : e.subarray(1));
    if (!Da(r))
      throw new Error("Point is not on curve");
    const s = fd(r);
    let i = jb(s);
    const o = (i & me) === me;
    n ? o && (i = nt(-i)) : (e[0] & 1) === 1 !== o && (i = nt(-i));
    const a = new Ft(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Hn(e.subarray(1, nr + 1)), r = Hn(e.subarray(nr + 1, nr * 2 + 1)), s = new Ft(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = mr(e), r = n.length, s = n[0];
    if (r === nr)
      return this.fromCompressedHex(n);
    if (r === Wa && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Xa && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Wa} compressed bytes or ${Xa} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Ft.BASE.multiply(zs(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = ep(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Wu(mr(e)), { n: a } = oe, c = r === 2 || r === 3 ? s + a : s, u = so(c, a), f = nt(-o * u, a), l = nt(i * u, a), w = r & 1 ? "03" : "02", p = Ft.fromHex(w + ws(c)), x = Ft.BASE.multiplyAndAddUnsafe(p, f, l);
    if (!x)
      throw new Error("Cannot recover signature: point at infinify");
    return x.assertValidity(), x;
  }
  toRawBytes(e = !1) {
    return bs(this.toHex(e));
  }
  toHex(e = !1) {
    const n = ws(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${ws(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Da(n) || !Da(r))
      throw new Error(e);
    const s = nt(r * r), i = fd(n);
    if (nt(s - i) !== qt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Ft(this.x, nt(-this.y));
  }
  double() {
    return Jt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return Jt.fromAffine(this).add(Jt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return Jt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = Jt.fromAffine(this), i = n === qt || n === me || this !== Ft.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = Jt.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(Jt.ZERO) ? void 0 : a.toAffine();
  }
}
Ft.BASE = new Ft(oe.Gx, oe.Gy);
Ft.ZERO = new Ft(qt, qt);
function hd(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function pd(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Ri(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Hn(n), left: t.subarray(e + 2) };
}
function Ob(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Ri(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = pd(t.subarray(2)), { data: r, left: s } = pd(n);
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
    return new Un(Za(s.slice(0, 64)), Za(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Ob(n ? e : bs(e));
    return new Un(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Gi(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Gi(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = oe.n >> me;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Un(this.r, nt(-this.s, oe.n)) : this;
  }
  toDERRawBytes() {
    return bs(this.toDERHex());
  }
  toDERHex() {
    const e = hd(yo(this.s)), n = hd(yo(this.r)), r = e.length / 2, s = n.length / 2, i = yo(r), o = yo(s);
    return `30${yo(s + r + 4)}02${o}${n}02${i}${e}`;
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
    return ws(this.r) + ws(this.s);
  }
}
function ps(...t) {
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
const Db = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ri(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Db[t[n]];
  return e;
}
const Fb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function ws(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(qt <= t && t < Fb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function zi(t) {
  const e = bs(ws(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function yo(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Za(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function bs(t) {
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
  return Za(Ri(t));
}
function mr(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : bs(t);
}
function gd(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Gi(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function nt(t, e = oe.P) {
  const n = t % e;
  return n >= qt ? n : e + n;
}
function zn(t, e) {
  const { P: n } = oe;
  let r = t;
  for (; e-- > qt; )
    r *= r, r %= n;
  return r;
}
function jb(t) {
  const { P: e } = oe, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, f = zn(u, vo) * u % e, l = zn(f, vo) * u % e, w = zn(l, ys) * c % e, p = zn(w, r) * w % e, x = zn(p, s) * p % e, S = zn(x, o) * x % e, M = zn(S, a) * S % e, G = zn(M, o) * x % e, K = zn(G, vo) * u % e, E = zn(K, i) * p % e, U = zn(E, n) * c % e, _ = zn(U, ys);
  if (_ * _ % e !== t)
    throw new Error("Cannot find square root");
  return _;
}
function so(t, e = oe.P) {
  if (t === qt || e <= qt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = nt(t, e), r = e, s = qt, i = me;
  for (; n !== qt; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== me)
    throw new Error("invert: does not exist");
  return nt(s, e);
}
function Rb(t, e = oe.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === qt ? i : (n[a] = i, nt(i * o, e)), me), s = so(r, e);
  return t.reduceRight((i, o, a) => o === qt ? i : (n[a] = nt(i * n[a], e), nt(i * o, e)), s), n;
}
function zb(t) {
  const e = t.length * 8 - Rs * 8, n = Hn(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Wu(t, e = !1) {
  const n = zb(t);
  if (e)
    return n;
  const { n: r } = oe;
  return n >= r ? n - r : n;
}
let Hi, ko;
class J0 {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Me.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return ko(this.k, ...e);
  }
  checkSync() {
    if (typeof ko != "function")
      throw new Yu("hmacSha256Sync needs to be set");
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
    return ps(...n);
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
    return ps(...n);
  }
}
function Gi(t) {
  return qt < t && t < oe.n;
}
function Da(t) {
  return qt < t && t < oe.P;
}
function tp(t, e, n, r = !0) {
  const { n: s } = oe, i = Wu(t, !0);
  if (!Gi(i))
    return;
  const o = so(i, s), a = Ft.BASE.multiply(i), c = nt(a.x, s);
  if (c === qt)
    return;
  const u = nt(o * nt(e + n * c, s), s);
  if (u === qt)
    return;
  let f = new Un(c, u), l = (a.x === f.r ? 0 : 2) | Number(a.y & me);
  return r && f.hasHighS() && (f = f.normalizeS(), l ^= 1), { sig: f, recovery: l };
}
function zs(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Rs)
      throw new Error("Expected 32 bytes of private key");
    e = Za(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Rs)
      throw new Error("Expected 32 bytes of private key");
    e = Hn(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Gi(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Xu(t) {
  return t instanceof Ft ? (t.assertValidity(), t) : Ft.fromHex(t);
}
function ep(t) {
  if (t instanceof Un)
    return t.assertValidity(), t;
  try {
    return Un.fromDER(t);
  } catch {
    return Un.fromCompact(t);
  }
}
function Go(t, e = !1) {
  return Ft.fromPrivateKey(t).toRawBytes(e);
}
function Gb(t, e, n, r = !1) {
  return Ft.fromSignature(t, e, n).toRawBytes(r);
}
function yd(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Wa || r === Xa : n ? r === Wa * 2 || r === Xa * 2 : t instanceof Ft;
}
function Zu(t, e, n = !1) {
  if (yd(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!yd(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Xu(e);
  return r.assertValidity(), r.multiply(zs(t)).toRawBytes(n);
}
function np(t) {
  const e = t.length > nr ? t.slice(0, nr) : t;
  return Hn(e);
}
function Kb(t) {
  const e = np(t), n = nt(e, oe.n);
  return rp(n < qt ? e : n);
}
function rp(t) {
  return zi(t);
}
function sp(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = mr(t), s = zs(e), i = [rp(s), Kb(r)];
  if (n != null) {
    n === !0 && (n = Me.randomBytes(nr));
    const c = mr(n);
    if (c.length !== nr)
      throw new Error(`sign: Expected ${nr} bytes of extra data`);
    i.push(c);
  }
  const o = ps(...i), a = np(r);
  return { seed: o, m: a, d: s };
}
function ip(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function Vb(t, e, n = {}) {
  const { seed: r, m: s, d: i } = sp(t, e, n.extraEntropy), o = new J0(Q0, Rs);
  await o.reseed(r);
  let a;
  for (; !(a = tp(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return ip(a, n);
}
function Lc(t, e, n = {}) {
  const { seed: r, m: s, d: i } = sp(t, e, n.extraEntropy), o = new J0(Q0, Rs);
  o.reseedSync(r);
  let a;
  for (; !(a = tp(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return ip(a, n);
}
const qb = { strict: !0 };
function Yb(t, e, n, r = qb) {
  let s;
  try {
    s = ep(t), e = mr(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Wu(e);
  let c;
  try {
    c = Xu(n);
  } catch {
    return !1;
  }
  const { n: u } = oe, f = so(o, u), l = nt(a * f, u), w = nt(i * f, u), p = Ft.BASE.multiplyAndAddUnsafe(c, l, w);
  return p ? nt(p.x, u) === i : !1;
}
function Qa(t) {
  return nt(Hn(t), oe.n);
}
class Ki {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = mr(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Hn(n.subarray(0, 32)), s = Hn(n.subarray(32, 64));
    return new Ki(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Da(e) || !Gi(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return ws(this.r) + ws(this.s);
  }
  toRawBytes() {
    return bs(this.toHex());
  }
}
function Wb(t) {
  return Ft.fromPrivateKey(t).toRawX();
}
class op {
  constructor(e, n, r = Me.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = mr(e);
    const { x: s, scalar: i } = this.getScalar(zs(n));
    if (this.px = s, this.d = i, this.rand = mr(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Ft.fromPrivateKey(e), r = n.hasEvenY() ? e : oe.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return zi(e ^ Hn(n));
  }
  finalizeNonce(e) {
    const n = nt(Hn(e), oe.n);
    if (n === qt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new Ki(e.x, nt(n + r * s, oe.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Me.taggedHash, o = this.initNonce(n, await i(hs.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(hs.nonce, o, r, e)), f = Qa(await i(hs.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return await lp(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Me.taggedHashSync, o = this.initNonce(n, i(hs.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(hs.nonce, o, r, e)), f = Qa(i(hs.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return up(l, e, r) || this.error(), l;
  }
}
async function Xb(t, e, n) {
  return new op(t, e, n).calc();
}
function Zb(t, e, n) {
  return new op(t, e, n).calcSync();
}
function ap(t, e, n) {
  const r = t instanceof Ki, s = r ? t : Ki.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: mr(e),
    P: Xu(n)
  };
}
function cp(t, e, n, r) {
  const s = Ft.BASE.multiplyAndAddUnsafe(e, zs(n), nt(-r, oe.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function lp(t, e, n) {
  try {
    const { r, s, m: i, P: o } = ap(t, e, n), a = Qa(await Me.taggedHash(hs.challenge, zi(r), o.toRawX(), i));
    return cp(r, o, s, a);
  } catch {
    return !1;
  }
}
function up(t, e, n) {
  try {
    const { r, s, m: i, P: o } = ap(t, e, n), a = Qa(Me.taggedHashSync(hs.challenge, zi(r), o.toRawX(), i));
    return cp(r, o, s, a);
  } catch (r) {
    if (r instanceof Yu)
      throw r;
    return !1;
  }
}
const Qb = {
  Signature: Ki,
  getPublicKey: Wb,
  sign: Xb,
  verify: lp,
  signSync: Zb,
  verifySync: up
};
Ft.BASE._setWindowSize(8);
const Tn = {
  node: Z0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, hs = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, ua = {}, Me = {
  bytesToHex: Ri,
  hexToBytes: bs,
  concatBytes: ps,
  mod: nt,
  invert: so,
  isValidPrivateKey(t) {
    try {
      return zs(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: zi,
  _normalizePrivateKey: zs,
  hashToPrivateKey: (t) => {
    t = mr(t);
    const e = Rs + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = nt(Hn(t), oe.n - me) + me;
    return zi(n);
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
  randomPrivateKey: () => Me.hashToPrivateKey(Me.randomBytes(Rs + 8)),
  precompute(t = 8, e = Ft.BASE) {
    const n = e === Ft.BASE ? e : new Ft(e.x, e.y);
    return n._setWindowSize(t), n.multiply(vo), n;
  },
  sha256: async (...t) => {
    if (Tn.web) {
      const e = await Tn.web.subtle.digest("SHA-256", ps(...t));
      return new Uint8Array(e);
    } else if (Tn.node) {
      const { createHash: e } = Tn.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Tn.web) {
      const n = await Tn.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = ps(...e), s = await Tn.web.subtle.sign("HMAC", n, r);
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
    let n = ua[t];
    if (n === void 0) {
      const r = await Me.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = ps(r, r), ua[t] = n;
    }
    return Me.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Hi != "function")
      throw new Yu("sha256Sync is undefined, you need to set it");
    let n = ua[t];
    if (n === void 0) {
      const r = Hi(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = ps(r, r), ua[t] = n;
    }
    return Hi(n, ...e);
  },
  _JacobianPoint: Jt
};
Object.defineProperties(Me, {
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
      return ko;
    },
    set(t) {
      ko || (ko = t);
    }
  }
});
const Jb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: oe,
  Point: Ft,
  Signature: Un,
  getPublicKey: Go,
  getSharedSecret: Zu,
  recoverPublicKey: Gb,
  schnorr: Qb,
  sign: Vb,
  signSync: Lc,
  utils: Me,
  verify: Yb
}, Symbol.toStringTag, { value: "Module" }));
var Ko = {};
Ko.byteLength = sm;
var tm = Ko.toByteArray = om, em = Ko.fromByteArray = lm, fr = [], Vn = [], nm = typeof Uint8Array < "u" ? Uint8Array : Array, sl = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var vi = 0, rm = sl.length; vi < rm; ++vi)
  fr[vi] = sl[vi], Vn[sl.charCodeAt(vi)] = vi;
Vn[45] = 62;
Vn[95] = 63;
function fp(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function sm(t) {
  var e = fp(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function im(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function om(t) {
  var e, n = fp(t), r = n[0], s = n[1], i = new nm(im(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = Vn[t.charCodeAt(c)] << 18 | Vn[t.charCodeAt(c + 1)] << 12 | Vn[t.charCodeAt(c + 2)] << 6 | Vn[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = Vn[t.charCodeAt(c)] << 2 | Vn[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = Vn[t.charCodeAt(c)] << 10 | Vn[t.charCodeAt(c + 1)] << 4 | Vn[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function am(t) {
  return fr[t >> 18 & 63] + fr[t >> 12 & 63] + fr[t >> 6 & 63] + fr[t & 63];
}
function cm(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(am(r));
  return s.join("");
}
function lm(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(cm(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    fr[e >> 2] + fr[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    fr[e >> 10] + fr[e >> 4 & 63] + fr[e << 2 & 63] + "="
  )), s.join("");
}
function um() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const fm = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function dm() {
  if (um())
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
    throw new Error(fm);
  }
}
class hm {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(br(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(br(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class pm {
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
async function dp() {
  const t = await dm();
  return t.name === "subtleCrypto" ? new pm(t.lib) : new hm(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function gm(t) {
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
    for (var x = 0, S = 0, M = 0, G = p.length; M !== G && p[M] === 0; )
      M++, x++;
    for (var K = (G - M) * u + 1 >>> 0, E = new Uint8Array(K); M !== G; ) {
      for (var U = p[M], _ = 0, Q = K - 1; (U !== 0 || _ < S) && Q !== -1; Q--, _++)
        U += 256 * E[Q] >>> 0, E[Q] = U % o >>> 0, U = U / o >>> 0;
      if (U !== 0)
        throw new Error("Non-zero carry");
      S = _, M++;
    }
    for (var et = K - S; et !== K && E[et] === 0; )
      et++;
    for (var z = a.repeat(x); et < K; ++et)
      z += t.charAt(E[et]);
    return z;
  }
  function l(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var x = 0, S = 0, M = 0; p[x] === a; )
      S++, x++;
    for (var G = (p.length - x) * c + 1 >>> 0, K = new Uint8Array(G); p[x]; ) {
      var E = p.charCodeAt(x);
      if (E > 255)
        return;
      var U = e[E];
      if (U === 255)
        return;
      for (var _ = 0, Q = G - 1; (U !== 0 || _ < M) && Q !== -1; Q--, _++)
        U += o * K[Q] >>> 0, K[Q] = U % 256 >>> 0, U = U / 256 >>> 0;
      if (U !== 0)
        throw new Error("Non-zero carry");
      M = _, x++;
    }
    for (var et = G - M; et !== G && K[et] === 0; )
      et++;
    for (var z = new Uint8Array(S + (G - et)), q = S; et !== G; )
      z[q++] = K[et++];
    return z;
  }
  function w(p) {
    var x = l(p);
    if (x)
      return x;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: f,
    decodeUnsafe: l,
    decode: w
  };
}
var hp = gm;
const ym = hp, wm = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var bm = ym(wm);
const mm = /* @__PURE__ */ H0(bm), xm = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), pp = Uint8Array.from({ length: 16 }, (t, e) => e), Sm = pp.map((t) => (9 * t + 5) % 16);
let Qu = [pp], Ju = [Sm];
for (let t = 0; t < 4; t++)
  for (let e of [Qu, Ju])
    e.push(e[t].map((n) => xm[n]));
const gp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Em = Qu.map((t, e) => t.map((n) => gp[e][n])), Am = Ju.map((t, e) => t.map((n) => gp[e][n])), vm = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), km = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), fa = (t, e) => t << e | t >>> 32 - e;
function wd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const da = new Uint32Array(16);
let $m = class extends qu {
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
      const x = 4 - p, S = vm[p], M = km[p], G = Qu[p], K = Ju[p], E = Em[p], U = Am[p];
      for (let _ = 0; _ < 16; _++) {
        const Q = fa(r + wd(p, i, a, u) + da[G[_]] + S, E[_]) + l | 0;
        r = l, l = u, u = fa(a, 10) | 0, a = i, i = Q;
      }
      for (let _ = 0; _ < 16; _++) {
        const Q = fa(s + wd(x, o, c, f) + da[K[_]] + M, U[_]) + w | 0;
        s = w, w = f, f = fa(c, 10) | 0, c = o, o = Q;
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
const Im = ii(() => new $m());
function Lm(t) {
  return Im(t);
}
const ha = BigInt(2 ** 32 - 1), Fl = BigInt(32);
function yp(t, e = !1) {
  return e ? { h: Number(t & ha), l: Number(t >> Fl & ha) } : { h: Number(t >> Fl & ha) | 0, l: Number(t & ha) | 0 };
}
function Cm(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = yp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Tm = (t, e) => BigInt(t >>> 0) << Fl | BigInt(e >>> 0), Bm = (t, e, n) => t >>> n, Mm = (t, e, n) => t << 32 - n | e >>> n, Nm = (t, e, n) => t >>> n | e << 32 - n, Pm = (t, e, n) => t << 32 - n | e >>> n, _m = (t, e, n) => t << 64 - n | e >>> n - 32, Um = (t, e, n) => t >>> n - 32 | e << 64 - n, Hm = (t, e) => e, Om = (t, e) => t, Dm = (t, e, n) => t << n | e >>> 32 - n, Fm = (t, e, n) => e << n | t >>> 32 - n, jm = (t, e, n) => e << n - 32 | t >>> 64 - n, Rm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function zm(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Gm = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Km = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Vm = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), qm = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Ym = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Wm = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Nt = {
  fromBig: yp,
  split: Cm,
  toBig: Tm,
  shrSH: Bm,
  shrSL: Mm,
  rotrSH: Nm,
  rotrSL: Pm,
  rotrBH: _m,
  rotrBL: Um,
  rotr32H: Hm,
  rotr32L: Om,
  rotlSH: Dm,
  rotlSL: Fm,
  rotlBH: jm,
  rotlBL: Rm,
  add: zm,
  add3L: Gm,
  add3H: Km,
  add4L: Vm,
  add4H: qm,
  add5H: Wm,
  add5L: Ym
}, [Xm, Zm] = Nt.split([
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
let Cc = class extends qu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: w, Gh: p, Gl: x, Hh: S, Hl: M } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, w, p, x, S, M];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, w, p, x, S, M) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = w | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = M | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Vr[E] = e.getUint32(n), qr[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const U = Vr[E - 15] | 0, _ = qr[E - 15] | 0, Q = Nt.rotrSH(U, _, 1) ^ Nt.rotrSH(U, _, 8) ^ Nt.shrSH(U, _, 7), et = Nt.rotrSL(U, _, 1) ^ Nt.rotrSL(U, _, 8) ^ Nt.shrSL(U, _, 7), z = Vr[E - 2] | 0, q = qr[E - 2] | 0, $ = Nt.rotrSH(z, q, 19) ^ Nt.rotrBH(z, q, 61) ^ Nt.shrSH(z, q, 6), L = Nt.rotrSL(z, q, 19) ^ Nt.rotrBL(z, q, 61) ^ Nt.shrSL(z, q, 6), b = Nt.add4L(et, L, qr[E - 7], qr[E - 16]), T = Nt.add4H(b, Q, $, Vr[E - 7], Vr[E - 16]);
      Vr[E] = T | 0, qr[E] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: w, Fh: p, Fl: x, Gh: S, Gl: M, Hh: G, Hl: K } = this;
    for (let E = 0; E < 80; E++) {
      const U = Nt.rotrSH(l, w, 14) ^ Nt.rotrSH(l, w, 18) ^ Nt.rotrBH(l, w, 41), _ = Nt.rotrSL(l, w, 14) ^ Nt.rotrSL(l, w, 18) ^ Nt.rotrBL(l, w, 41), Q = l & p ^ ~l & S, et = w & x ^ ~w & M, z = Nt.add5L(K, _, et, Zm[E], qr[E]), q = Nt.add5H(z, G, U, Q, Xm[E], Vr[E]), $ = z | 0, L = Nt.rotrSH(r, s, 28) ^ Nt.rotrBH(r, s, 34) ^ Nt.rotrBH(r, s, 39), b = Nt.rotrSL(r, s, 28) ^ Nt.rotrBL(r, s, 34) ^ Nt.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, D = s & o ^ s & c ^ o & c;
      G = S | 0, K = M | 0, S = p | 0, M = x | 0, p = l | 0, x = w | 0, { h: l, l: w } = Nt.add(u | 0, f | 0, q | 0, $ | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const C = Nt.add3L($, b, D);
      r = Nt.add3H(C, q, L, T), s = C | 0;
    }
    ({ h: r, l: s } = Nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Nt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Nt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: w } = Nt.add(this.Eh | 0, this.El | 0, l | 0, w | 0), { h: p, l: x } = Nt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: M } = Nt.add(this.Gh | 0, this.Gl | 0, S | 0, M | 0), { h: G, l: K } = Nt.add(this.Hh | 0, this.Hl | 0, G | 0, K | 0), this.set(r, s, i, o, a, c, u, f, l, w, p, x, S, M, G, K);
  }
  roundClean() {
    Vr.fill(0), qr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Qm = class extends Cc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Jm = class extends Cc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, t1 = class extends Cc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const e1 = ii(() => new Cc());
ii(() => new Qm());
ii(() => new Jm());
ii(() => new t1());
function wp(t) {
  return ji(t);
}
function n1(t) {
  return e1(t);
}
const r1 = 0;
Me.hmacSha256Sync = (t, ...e) => {
  const n = Ic.create(ji, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function s1() {
  return yt(Me.randomPrivateKey());
}
function i1(t) {
  const e = ji(ji(t));
  return mm.encode(br(t, e).slice(0, t.length + 4));
}
function o1(t, e) {
  return i1(br(new Uint8Array([t]), e.slice(0, 20)));
}
function bp(t, e = r1) {
  const n = typeof t == "string" ? Wt(t) : t, r = Lm(wp(n));
  return o1(e, r);
}
function mp(t) {
  const e = Ku(t);
  return yt(Go(e.slice(0, 32), !0));
}
Me.hmacSha256Sync = (t, ...e) => {
  const n = Ic.create(ji, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Ja;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Ja || (Ja = {}));
async function a1(t, e, n) {
  return await (await dp()).encrypt("aes-256-cbc", e, t, n);
}
async function c1(t, e, n) {
  return await (await dp()).decrypt("aes-256-cbc", e, t, n);
}
function xp(t, e) {
  return Ic(ji, t, e);
}
function l1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function Sp(t) {
  const e = n1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function u1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function f1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Ja.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Ja.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !u1(t))
    return e;
  try {
    return Ft.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function d1(t, e, n, r) {
  const s = f1(t);
  if (!s.result)
    throw s;
  const i = Me.randomPrivateKey(), o = Go(i, !0);
  let a = Zu(i, t, !0);
  a = a.slice(1);
  const c = Sp(a), u = Me.randomBytes(16), f = await a1(u, c.encryptionKey, e), l = br(u, o, f), w = xp(c.hmacKey, l);
  let p;
  if (!r || r === "hex")
    p = yt(f);
  else if (r === "base64")
    p = em(f);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const x = {
    iv: yt(u),
    ephemeralPK: yt(o),
    cipherText: p,
    mac: yt(w),
    wasString: n
  };
  return r && r !== "hex" && (x.cipherTextEncoding = r), x;
}
async function Ep(t, e) {
  if (!e.ephemeralPK)
    throw new id("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Zu(t, n, !0);
  r = r.slice(1);
  const s = Sp(r), i = Wt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Wt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = tm(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = br(i, Wt(n), o), c = xp(s.hmacKey, a), u = Wt(e.mac);
  if (!l1(u, c))
    throw new id("Decryption failed: failure in MAC check");
  const f = await c1(i, s.encryptionKey, o);
  return e.wasString ? zo(f) : f;
}
function h1(t, e) {
  const n = typeof e == "string" ? si(e) : e, r = mp(t), s = wp(n), i = Lc(s, t);
  return {
    signature: yt(i),
    publicKey: r
  };
}
async function p1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = mp(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? si(t) : t, o = await d1(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = h1(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function g1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return Ep(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Je = {}, Vi = {}, gn = {};
Object.defineProperty(gn, "__esModule", { value: !0 });
gn.decode = gn.encode = gn.unescape = gn.escape = gn.pad = void 0;
const Ap = Ko;
function tf(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
gn.pad = tf;
function vp(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
gn.escape = vp;
function kp(t) {
  return tf(t).replace(/-/g, "+").replace(/_/g, "/");
}
gn.unescape = kp;
function y1(t) {
  return vp((0, Ap.fromByteArray)(new TextEncoder().encode(t)));
}
gn.encode = y1;
function w1(t) {
  return new TextDecoder().decode((0, Ap.toByteArray)(tf(kp(t))));
}
gn.decode = w1;
var Tc = {}, Bc = {}, $p = {}, Ip = {}, Mc = {};
Object.defineProperty(Mc, "__esModule", { value: !0 });
Mc.crypto = void 0;
Mc.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = f, t.createView = l, t.rotr = w, t.rotl = p, t.byteSwap = x, t.byteSwap32 = S, t.bytesToHex = K, t.hexToBytes = _, t.asyncLoop = et, t.utf8ToBytes = z, t.bytesToUtf8 = q, t.toBytes = $, t.kdfInputToBytes = L, t.concatBytes = b, t.checkOpts = T, t.createHasher = C, t.createOptHasher = it, t.createXOFer = W, t.randomBytes = Et;
  const e = Mc;
  function n(k) {
    return k instanceof Uint8Array || ArrayBuffer.isView(k) && k.constructor.name === "Uint8Array";
  }
  function r(k) {
    if (!Number.isSafeInteger(k) || k < 0)
      throw new Error("positive integer expected, got " + k);
  }
  function s(k, ...H) {
    if (!n(k))
      throw new Error("Uint8Array expected");
    if (H.length > 0 && !H.includes(k.length))
      throw new Error("Uint8Array expected of length " + H + ", got length=" + k.length);
  }
  function i(k) {
    if (typeof k != "function" || typeof k.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(k.outputLen), r(k.blockLen);
  }
  function o(k, H = !0) {
    if (k.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (H && k.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(k, H) {
    s(k);
    const at = H.outputLen;
    if (k.length < at)
      throw new Error("digestInto() expects output buffer of length at least " + at);
  }
  function c(k) {
    return new Uint8Array(k.buffer, k.byteOffset, k.byteLength);
  }
  function u(k) {
    return new Uint32Array(k.buffer, k.byteOffset, Math.floor(k.byteLength / 4));
  }
  function f(...k) {
    for (let H = 0; H < k.length; H++)
      k[H].fill(0);
  }
  function l(k) {
    return new DataView(k.buffer, k.byteOffset, k.byteLength);
  }
  function w(k, H) {
    return k << 32 - H | k >>> H;
  }
  function p(k, H) {
    return k << H | k >>> 32 - H >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function x(k) {
    return k << 24 & 4278190080 | k << 8 & 16711680 | k >>> 8 & 65280 | k >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (k) => k : (k) => x(k), t.byteSwapIfBE = t.swap8IfBE;
  function S(k) {
    for (let H = 0; H < k.length; H++)
      k[H] = x(k[H]);
    return k;
  }
  t.swap32IfBE = t.isLE ? (k) => k : S;
  const M = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", G = /* @__PURE__ */ Array.from({ length: 256 }, (k, H) => H.toString(16).padStart(2, "0"));
  function K(k) {
    if (s(k), M)
      return k.toHex();
    let H = "";
    for (let at = 0; at < k.length; at++)
      H += G[k[at]];
    return H;
  }
  const E = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function U(k) {
    if (k >= E._0 && k <= E._9)
      return k - E._0;
    if (k >= E.A && k <= E.F)
      return k - (E.A - 10);
    if (k >= E.a && k <= E.f)
      return k - (E.a - 10);
  }
  function _(k) {
    if (typeof k != "string")
      throw new Error("hex string expected, got " + typeof k);
    if (M)
      return Uint8Array.fromHex(k);
    const H = k.length, at = H / 2;
    if (H % 2)
      throw new Error("hex string expected, got unpadded hex of length " + H);
    const ct = new Uint8Array(at);
    for (let ut = 0, kt = 0; ut < at; ut++, kt += 2) {
      const ge = U(k.charCodeAt(kt)), It = U(k.charCodeAt(kt + 1));
      if (ge === void 0 || It === void 0) {
        const Xt = k[kt] + k[kt + 1];
        throw new Error('hex string expected, got non-hex character "' + Xt + '" at index ' + kt);
      }
      ct[ut] = ge * 16 + It;
    }
    return ct;
  }
  const Q = async () => {
  };
  t.nextTick = Q;
  async function et(k, H, at) {
    let ct = Date.now();
    for (let ut = 0; ut < k; ut++) {
      at(ut);
      const kt = Date.now() - ct;
      kt >= 0 && kt < H || (await (0, t.nextTick)(), ct += kt);
    }
  }
  function z(k) {
    if (typeof k != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(k));
  }
  function q(k) {
    return new TextDecoder().decode(k);
  }
  function $(k) {
    return typeof k == "string" && (k = z(k)), s(k), k;
  }
  function L(k) {
    return typeof k == "string" && (k = z(k)), s(k), k;
  }
  function b(...k) {
    let H = 0;
    for (let ct = 0; ct < k.length; ct++) {
      const ut = k[ct];
      s(ut), H += ut.length;
    }
    const at = new Uint8Array(H);
    for (let ct = 0, ut = 0; ct < k.length; ct++) {
      const kt = k[ct];
      at.set(kt, ut), ut += kt.length;
    }
    return at;
  }
  function T(k, H) {
    if (H !== void 0 && {}.toString.call(H) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(k, H);
  }
  class D {
  }
  t.Hash = D;
  function C(k) {
    const H = (ct) => k().update($(ct)).digest(), at = k();
    return H.outputLen = at.outputLen, H.blockLen = at.blockLen, H.create = () => k(), H;
  }
  function it(k) {
    const H = (ct, ut) => k(ut).update($(ct)).digest(), at = k({});
    return H.outputLen = at.outputLen, H.blockLen = at.blockLen, H.create = (ct) => k(ct), H;
  }
  function W(k) {
    const H = (ct, ut) => k(ut).update($(ct)).digest(), at = k({});
    return H.outputLen = at.outputLen, H.blockLen = at.blockLen, H.create = (ct) => k(ct), H;
  }
  t.wrapConstructor = C, t.wrapConstructorWithOpts = it, t.wrapXOFConstructorWithOpts = W;
  function Et(k = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(k));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(k));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Ip);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = Ip;
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
})($p);
const ki = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Lp(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function jl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function oi(t, ...e) {
  if (!Lp(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function b1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  jl(t.outputLen), jl(t.blockLen);
}
function Rl(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Cp(t, e) {
  oi(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function m1(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function x1(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function tc(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Fa(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Zn(t, e) {
  return t << 32 - e | t >>> e;
}
function S1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const ef = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function nf(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const Tp = ef ? (t) => t : (t) => nf(t), E1 = Tp;
function Bp(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = nf(t[e]);
  return t;
}
const A1 = ef ? (t) => t : Bp, Mp = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", v1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Np(t) {
  if (oi(t), Mp)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += v1[t[n]];
  return e;
}
const $r = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function bd(t) {
  if (t >= $r._0 && t <= $r._9)
    return t - $r._0;
  if (t >= $r.A && t <= $r.F)
    return t - ($r.A - 10);
  if (t >= $r.a && t <= $r.f)
    return t - ($r.a - 10);
}
function k1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Mp)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = bd(t.charCodeAt(i)), a = bd(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const Pp = async () => {
};
async function $1(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await Pp(), r += i);
  }
}
function rf(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function I1(t) {
  return new TextDecoder().decode(t);
}
function Vo(t) {
  return typeof t == "string" && (t = rf(t)), oi(t), t;
}
function L1(t) {
  return typeof t == "string" && (t = rf(t)), oi(t), t;
}
function C1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    oi(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function T1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let _p = class {
};
function Nc(t) {
  const e = (r) => t().update(Vo(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Up(t) {
  const e = (r, s) => t(s).update(Vo(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Hp(t) {
  const e = (r, s) => t(s).update(Vo(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const B1 = Nc, M1 = Up, N1 = Hp;
function P1(t = 32) {
  if (ki && typeof ki.getRandomValues == "function")
    return ki.getRandomValues(new Uint8Array(t));
  if (ki && typeof ki.randomBytes == "function")
    return Uint8Array.from(ki.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const _1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: _p,
  abytes: oi,
  aexists: Rl,
  ahash: b1,
  anumber: jl,
  aoutput: Cp,
  asyncLoop: $1,
  byteSwap: nf,
  byteSwap32: Bp,
  byteSwapIfBE: E1,
  bytesToHex: Np,
  bytesToUtf8: I1,
  checkOpts: T1,
  clean: tc,
  concatBytes: C1,
  createHasher: Nc,
  createOptHasher: Up,
  createView: Fa,
  createXOFer: Hp,
  hexToBytes: k1,
  isBytes: Lp,
  isLE: ef,
  kdfInputToBytes: L1,
  nextTick: Pp,
  randomBytes: P1,
  rotl: S1,
  rotr: Zn,
  swap32IfBE: A1,
  swap8IfBE: Tp,
  toBytes: Vo,
  u32: x1,
  u8: m1,
  utf8ToBytes: rf,
  wrapConstructor: B1,
  wrapConstructorWithOpts: M1,
  wrapXOFConstructorWithOpts: N1
}, Symbol.toStringTag, { value: "Module" }));
function U1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function H1(t, e, n) {
  return t & e ^ ~t & n;
}
function O1(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class D1 extends _p {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = Fa(this.buffer);
  }
  update(e) {
    Rl(this), e = Vo(e), oi(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Fa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Rl(this), Cp(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, tc(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    U1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Fa(e), c = this.outputLen;
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
const Yr = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Wr = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), F1 = /* @__PURE__ */ Uint32Array.from([
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
]), Xr = /* @__PURE__ */ new Uint32Array(64);
let sf = class extends D1 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Yr[0] | 0, this.B = Yr[1] | 0, this.C = Yr[2] | 0, this.D = Yr[3] | 0, this.E = Yr[4] | 0, this.F = Yr[5] | 0, this.G = Yr[6] | 0, this.H = Yr[7] | 0;
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
      const w = Xr[l - 15], p = Xr[l - 2], x = Zn(w, 7) ^ Zn(w, 18) ^ w >>> 3, S = Zn(p, 17) ^ Zn(p, 19) ^ p >>> 10;
      Xr[l] = S + Xr[l - 7] + x + Xr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const w = Zn(a, 6) ^ Zn(a, 11) ^ Zn(a, 25), p = f + w + H1(a, c, u) + F1[l] + Xr[l] | 0, S = (Zn(r, 2) ^ Zn(r, 13) ^ Zn(r, 22)) + O1(r, s, i) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    tc(Xr);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), tc(this.buffer);
  }
}, Op = class extends sf {
  constructor() {
    super(28), this.A = Wr[0] | 0, this.B = Wr[1] | 0, this.C = Wr[2] | 0, this.D = Wr[3] | 0, this.E = Wr[4] | 0, this.F = Wr[5] | 0, this.G = Wr[6] | 0, this.H = Wr[7] | 0;
  }
};
const j1 = /* @__PURE__ */ Nc(() => new sf()), R1 = /* @__PURE__ */ Nc(() => new Op()), z1 = sf, Dp = j1, G1 = Op, K1 = R1, V1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: G1,
  SHA256: z1,
  sha224: K1,
  sha256: Dp
}, Symbol.toStringTag, { value: "Module" })), Pc = /* @__PURE__ */ kc(V1), q1 = /* @__PURE__ */ kc(Jb);
var qi = {};
Object.defineProperty(qi, "__esModule", { value: !0 });
qi.joseToDer = qi.derToJose = void 0;
const Fp = Ko, jp = gn;
function il(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const Y1 = {
  ES256: il(256),
  ES384: il(384),
  ES512: il(521)
};
function Rp(t) {
  const e = Y1[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const ec = 128, zp = 0, W1 = 32, X1 = 16, Z1 = 2, Gp = X1 | W1 | zp << 6, nc = Z1 | zp << 6;
function Kp(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Fp.toByteArray)((0, jp.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Q1(t, e) {
  const n = Kp(t), r = Rp(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Gp)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (ec | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== nc)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== nc)
    throw new Error('Could not find expected "int" for "s"');
  const f = n[o++];
  if (i - o !== f)
    throw new Error(`"s" specified length of "${f}", expected "${i - o}"`);
  if (s < f)
    throw new Error(`"s" specified length of "${f}", max of "${s}" is acceptable`);
  const l = o;
  if (o += f, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const w = r - c, p = r - f, x = new Uint8Array(w + c + p + f);
  for (o = 0; o < w; ++o)
    x[o] = 0;
  x.set(n.subarray(u + Math.max(-w, 0), u + c), o), o = r;
  for (const S = o; o < S + p; ++o)
    x[o] = 0;
  return x.set(n.subarray(l + Math.max(-p, 0), l + f), o), (0, jp.escape)((0, Fp.fromByteArray)(x));
}
qi.derToJose = Q1;
function md(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= ec && --r, r;
}
function J1(t, e) {
  t = Kp(t);
  const n = Rp(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = md(t, 0, n), i = md(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < ec, f = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return f[l++] = Gp, u ? f[l++] = c : (f[l++] = ec | 1, f[l++] = c & 255), f[l++] = nc, f[l++] = o, s < 0 ? (f[l++] = 0, f.set(t.subarray(0, n), l), l += n) : (f.set(t.subarray(s, n), l), l += n - s), f[l++] = nc, f[l++] = a, i < 0 ? (f[l++] = 0, f.set(t.subarray(n), l)) : f.set(t.subarray(n + i), l), f;
}
qi.joseToDer = J1;
var _r = {};
Object.defineProperty(_r, "__esModule", { value: !0 });
_r.InvalidTokenError = _r.MissingParametersError = void 0;
class t2 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
_r.MissingParametersError = t2;
class e2 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
_r.InvalidTokenError = e2;
const qo = /* @__PURE__ */ kc(_1);
Object.defineProperty(Bc, "__esModule", { value: !0 });
Bc.SECP256K1Client = void 0;
const n2 = $p, r2 = Pc, ja = q1, xd = qi, Sd = _r, Ed = qo;
ja.utils.hmacSha256Sync = (t, ...e) => {
  const n = n2.hmac.create(r2.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Vp {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Ed.bytesToHex)(ja.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Sd.MissingParametersError("a signing input hash and private key are all required");
    const s = ja.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Ed.bytesToHex)(s);
    if (r === "jose")
      return (0, xd.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, xd.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Sd.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return ja.verify(n, e, r, { strict: !1 });
  }
}
Bc.SECP256K1Client = Vp;
Vp.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Bc;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Tc);
var Gs = {};
const s2 = /* @__PURE__ */ kc(Z0);
var i2 = wn && wn.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Gs, "__esModule", { value: !0 });
Gs.hashSha256Async = Gs.hashSha256 = void 0;
const o2 = Pc;
function qp(t) {
  return (0, o2.sha256)(t);
}
Gs.hashSha256 = qp;
function a2(t) {
  return i2(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = s2;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(qp(t));
    }
  });
}
Gs.hashSha256Async = a2;
var c2 = wn && wn.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Vi, "__esModule", { value: !0 });
Vi.TokenSigner = Vi.createUnsecuredToken = void 0;
const zl = gn, Ad = Tc, l2 = _r, vd = Gs;
function Gl(t, e) {
  const n = [], r = zl.encode(JSON.stringify(e));
  n.push(r);
  const s = zl.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function u2(t) {
  return Gl(t, { typ: "JWT", alg: "none" }) + ".";
}
Vi.createUnsecuredToken = u2;
class f2 {
  constructor(e, n) {
    if (!(e && n))
      throw new l2.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Ad.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Ad.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = Gl(e, s), o = (0, vd.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return c2(this, void 0, void 0, function* () {
      const s = this.header(r), i = Gl(e, s), o = yield (0, vd.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [zl.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Vi.TokenSigner = f2;
var _c = {};
Object.defineProperty(_c, "__esModule", { value: !0 });
_c.TokenVerifier = void 0;
const d2 = gn, kd = Tc, h2 = _r, pa = Gs;
class p2 {
  constructor(e, n) {
    if (!(e && n))
      throw new h2.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !kd.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = kd.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, pa.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, pa.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), d2.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, pa.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, pa.hashSha256)(r);
      return i(o);
    }
  }
}
_c.TokenVerifier = p2;
var Uc = {};
Object.defineProperty(Uc, "__esModule", { value: !0 });
Uc.decodeToken = void 0;
const ga = gn;
function g2(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(ga.decode(e[0])), r = JSON.parse(ga.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = ga.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(ga.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Uc.decodeToken = g2;
(function(t) {
  var e = wn && wn.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = wn && wn.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Vi, t), n(_c, t), n(Uc, t), n(_r, t), n(Tc, t);
})(Je);
function y2(t) {
  return `did:btc-addr:${t}`;
}
function w2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new sd("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new sd('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Yp(t) {
  if (t)
    return w2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const b2 = "1.4.0";
function m2() {
  return s1();
}
function x2(t, e, n, r = j0.slice(), s, i = eb().getTime(), o = {}) {
  const a = (p) => {
    const x = zu("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return x == null ? void 0 : x.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: rb(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: b2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = Je.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const f = bp(u);
  return c.iss = y2(f), new Je.TokenSigner("ES256k", t).sign(c);
}
async function $d(t, e) {
  const n = zo(Wt(e)), r = JSON.parse(n), s = await Ep(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function S2(t) {
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
function E2(t) {
  const e = Je.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Yp(e.iss);
  if (n.length === 1) {
    if (bp(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function A2(t) {
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
function v2(t) {
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
function k2(t) {
  const e = [
    v2(t),
    A2(t),
    S2(t),
    E2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Id = "1.0.0";
class ms {
  constructor(e) {
    this.version = Id, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Id)
      throw new _l(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new ms(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Wp {
  constructor(e) {
    if (e) {
      const n = new ms(e);
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
class Ld extends Wp {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new ms({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new R0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new ms({})), !0;
  }
}
class Cd extends Wp {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Qw, !localStorage.getItem(this.key)) {
      const r = new ms({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new R0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return ms.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new ms({})), !0;
  }
}
var Bo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Bo || (Bo = {}));
var rc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(rc || (rc = {}));
Bo.Mainnet;
var Mr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Mr || (Mr = {}));
var pr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(pr || (pr = {}));
Mr.Mainnet;
const Xp = {
  chainId: Bo.Mainnet,
  transactionVersion: Mr.Mainnet,
  peerNetworkId: rc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: pr.MainnetSingleSig,
    multiSig: pr.MainnetMultiSig
  },
  client: { baseUrl: z0 }
}, Kl = {
  chainId: Bo.Testnet,
  transactionVersion: Mr.Testnet,
  peerNetworkId: rc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: pr.TestnetSingleSig,
    multiSig: pr.TestnetMultiSig
  },
  client: { baseUrl: G0 }
}, Ra = {
  ...Kl,
  addressVersion: { ...Kl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: K0 }
}, $2 = {
  ...Ra,
  addressVersion: { ...Ra.addressVersion },
  client: { ...Ra.client }
};
function I2(t) {
  switch (t) {
    case "mainnet":
      return Xp;
    case "testnet":
      return Kl;
    case "devnet":
      return Ra;
    case "mocknet":
      return $2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Zp(t) {
  return typeof t == "string" ? I2(t) : t;
}
var Td;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Td || (Td = {}));
var Bd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Bd || (Bd = {}));
var Qn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Qn || (Qn = {}));
const ol = ["onChainOnly", "offChainOnly", "any"];
ol[0] + "", Qn.OnChainOnly, ol[1] + "", Qn.OffChainOnly, ol[2] + "", Qn.Any, Qn.OnChainOnly + "", Qn.OnChainOnly, Qn.OffChainOnly + "", Qn.OffChainOnly, Qn.Any + "", Qn.Any;
var Md;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Md || (Md = {}));
var Nd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Nd || (Nd = {}));
var Pd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Pd || (Pd = {}));
var Br;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Br || (Br = {}));
var _d;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(_d || (_d = {}));
var Ud;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ud || (Ud = {}));
var Hd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Hd || (Hd = {}));
var Od;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Od || (Od = {}));
var Dd;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Dd || (Dd = {}));
var Fd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Fd || (Fd = {}));
var jd;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(jd || (jd = {}));
var Rd;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Rd || (Rd = {}));
var zd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(zd || (zd = {}));
function Vl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function L2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Qp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function C2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Vl(t.outputLen), Vl(t.blockLen);
}
function T2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function B2(t, e) {
  Qp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ts = {
  number: Vl,
  bool: L2,
  bytes: Qp,
  hash: C2,
  exists: T2,
  output: B2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const al = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), or = (t, e) => t << 32 - e | t >>> e, M2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!M2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function N2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function of(t) {
  if (typeof t == "string" && (t = N2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Jp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ai(t) {
  const e = (r) => t().update(of(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let tg = class extends Jp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ts.hash(e);
    const r = of(n);
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
    return Ts.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ts.exists(this), Ts.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const eg = (t, e, n) => new tg(t, e).update(n).digest();
eg.create = (t, e) => new tg(t, e);
function P2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let af = class extends Jp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = al(this.buffer);
  }
  update(e) {
    Ts.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = of(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = al(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ts.exists(this), Ts.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    P2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = al(e), c = this.outputLen;
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
const _2 = (t, e, n) => t & e ^ ~t & n, U2 = (t, e, n) => t & e ^ t & n ^ e & n, H2 = new Uint32Array([
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
]), Zr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Qr = new Uint32Array(64);
let ng = class extends af {
  constructor() {
    super(64, 32, 8, !1), this.A = Zr[0] | 0, this.B = Zr[1] | 0, this.C = Zr[2] | 0, this.D = Zr[3] | 0, this.E = Zr[4] | 0, this.F = Zr[5] | 0, this.G = Zr[6] | 0, this.H = Zr[7] | 0;
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
      Qr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const w = Qr[l - 15], p = Qr[l - 2], x = or(w, 7) ^ or(w, 18) ^ w >>> 3, S = or(p, 17) ^ or(p, 19) ^ p >>> 10;
      Qr[l] = S + Qr[l - 7] + x + Qr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const w = or(a, 6) ^ or(a, 11) ^ or(a, 25), p = f + w + _2(a, c, u) + H2[l] + Qr[l] | 0, S = (or(r, 2) ^ or(r, 13) ^ or(r, 22)) + U2(r, s, i) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    Qr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, O2 = class extends ng {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const rg = ai(() => new ng());
ai(() => new O2());
var ci = {}, cf = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = qo;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let p = o.length - 1; p >= 0; p--)
      if (u < 4) {
        const x = n.indexOf(o[p]) >> u;
        let S = 0;
        p !== 0 && (S = n.indexOf(o[p - 1]));
        const M = 1 + u, G = S % (1 << M) << 5 - M, K = t.c32[x + G];
        u = M, c.unshift(K);
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
      for (let x = 0; x < p; x++)
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
      const G = (t.c32.indexOf(o[S]) << w) + l, K = n[G % 16];
      if (w += 1, l = G >> 4, l > 1 << w)
        throw new Error("Panic error in decoding.");
      f.unshift(K);
    }
    f.unshift(n[l]), f.length % 2 === 1 && f.unshift("0");
    let p = 0;
    for (let S = 0; S < f.length && f[S] === "0"; S++)
      p++;
    f = f.slice(p - p % 2);
    let x = f.join("");
    for (let S = 0; S < u; S++)
      x = `00${x}`;
    if (a) {
      const S = a * 2 - x.length;
      for (let M = 0; M < S; M += 2)
        x = `00${x}`;
    }
    return x;
  }
  t.c32decode = i;
})(cf);
var Ks = {};
Object.defineProperty(Ks, "__esModule", { value: !0 });
Ks.c32checkDecode = Ks.c32checkEncode = void 0;
const Gd = Pc, Kd = qo, $o = cf;
function sg(t) {
  const e = (0, Gd.sha256)((0, Gd.sha256)((0, Kd.hexToBytes)(t)));
  return (0, Kd.bytesToHex)(e.slice(0, 4));
}
function D2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = sg(`${n}${e}`), s = (0, $o.c32encode)(`${e}${r}`);
  return `${$o.c32[t]}${s}`;
}
Ks.c32checkEncode = D2;
function F2(t) {
  t = (0, $o.c32normalize)(t);
  const e = (0, $o.c32decode)(t.slice(1)), n = t[0], r = $o.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), sg(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Ks.c32checkDecode = F2;
var ig = {}, Yi = {};
Object.defineProperty(Yi, "__esModule", { value: !0 });
Yi.decode = Yi.encode = void 0;
const sc = Pc, Vd = qo, og = hp, ag = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function j2(t, e = "00") {
  const n = typeof t == "string" ? (0, Vd.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Vd.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, sc.sha256)((0, sc.sha256)(new Uint8Array([...r, ...n])));
  return og(ag).encode([...r, ...n, ...s.slice(0, 4)]);
}
Yi.encode = j2;
function R2(t) {
  const e = og(ag).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, sc.sha256)((0, sc.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Yi.decode = R2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Ks, n = Yi, r = qo;
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
    const w = n.decode(f), p = (0, r.bytesToHex)(w.data), x = parseInt((0, r.bytesToHex)(w.prefix), 16);
    let S;
    return l < 0 ? (S = x, s[x] !== void 0 && (S = s[x])) : S = l, o(S, p);
  }
  t.b58ToC32 = c;
  function u(f, l = -1) {
    const w = a(f), p = w[0], x = w[1];
    let S;
    l < 0 ? (S = p, i[p] !== void 0 && (S = i[p])) : S = l;
    let M = S.toString(16);
    return M.length === 1 && (M = `0${M}`), n.encode(x, M);
  }
  t.c32ToB58 = u;
})(ig);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = cf;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Ks;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = ig;
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
})(ci);
function z2(t, e) {
  switch (e = Zp(e ?? Xp), t) {
    case Br.P2PKH:
      switch (e.transactionVersion) {
        case Mr.Mainnet:
          return pr.MainnetSingleSig;
        case Mr.Testnet:
          return pr.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Br.P2SH:
    case Br.P2SHNonSequential:
    case Br.P2WPKH:
    case Br.P2WSH:
    case Br.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Mr.Mainnet:
          return pr.MainnetMultiSig;
        case Mr.Testnet:
          return pr.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const G2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), cg = Uint8Array.from({ length: 16 }, (t, e) => e), K2 = cg.map((t) => (9 * t + 5) % 16);
let lf = [cg], uf = [K2];
for (let t = 0; t < 4; t++)
  for (let e of [lf, uf])
    e.push(e[t].map((n) => G2[n]));
const lg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), V2 = lf.map((t, e) => t.map((n) => lg[e][n])), q2 = uf.map((t, e) => t.map((n) => lg[e][n])), Y2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), W2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ya = (t, e) => t << e | t >>> 32 - e;
function qd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const wa = new Uint32Array(16);
let X2 = class extends af {
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
      wa[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, w = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, S = Y2[p], M = W2[p], G = lf[p], K = uf[p], E = V2[p], U = q2[p];
      for (let _ = 0; _ < 16; _++) {
        const Q = ya(r + qd(p, i, a, u) + wa[G[_]] + S, E[_]) + l | 0;
        r = l, l = u, u = ya(a, 10) | 0, a = i, i = Q;
      }
      for (let _ = 0; _ < 16; _++) {
        const Q = ya(s + qd(x, o, c, f) + wa[K[_]] + M, U[_]) + w | 0;
        s = w, w = f, f = ya(c, 10) | 0, c = o, o = Q;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + w | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    wa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Z2 = ai(() => new X2()), ba = BigInt(2 ** 32 - 1), ql = BigInt(32);
function ug(t, e = !1) {
  return e ? { h: Number(t & ba), l: Number(t >> ql & ba) } : { h: Number(t >> ql & ba) | 0, l: Number(t & ba) | 0 };
}
function Q2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = ug(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const J2 = (t, e) => BigInt(t >>> 0) << ql | BigInt(e >>> 0), tx = (t, e, n) => t >>> n, ex = (t, e, n) => t << 32 - n | e >>> n, nx = (t, e, n) => t >>> n | e << 32 - n, rx = (t, e, n) => t << 32 - n | e >>> n, sx = (t, e, n) => t << 64 - n | e >>> n - 32, ix = (t, e, n) => t >>> n - 32 | e << 64 - n, ox = (t, e) => e, ax = (t, e) => t, cx = (t, e, n) => t << n | e >>> 32 - n, lx = (t, e, n) => e << n | t >>> 32 - n, ux = (t, e, n) => e << n - 32 | t >>> 64 - n, fx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function dx(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const hx = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), px = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, gx = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), yx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, wx = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), bx = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Pt = {
  fromBig: ug,
  split: Q2,
  toBig: J2,
  shrSH: tx,
  shrSL: ex,
  rotrSH: nx,
  rotrSL: rx,
  rotrBH: sx,
  rotrBL: ix,
  rotr32H: ox,
  rotr32L: ax,
  rotlSH: cx,
  rotlSL: lx,
  rotlBH: ux,
  rotlBL: fx,
  add: dx,
  add3L: hx,
  add3H: px,
  add4L: gx,
  add4H: yx,
  add5H: bx,
  add5L: wx
}, [mx, xx] = Pt.split([
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
].map((t) => BigInt(t))), Jr = new Uint32Array(80), ts = new Uint32Array(80);
let Hc = class extends af {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: w, Gh: p, Gl: x, Hh: S, Hl: M } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, w, p, x, S, M];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, w, p, x, S, M) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = w | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = M | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Jr[E] = e.getUint32(n), ts[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const U = Jr[E - 15] | 0, _ = ts[E - 15] | 0, Q = Pt.rotrSH(U, _, 1) ^ Pt.rotrSH(U, _, 8) ^ Pt.shrSH(U, _, 7), et = Pt.rotrSL(U, _, 1) ^ Pt.rotrSL(U, _, 8) ^ Pt.shrSL(U, _, 7), z = Jr[E - 2] | 0, q = ts[E - 2] | 0, $ = Pt.rotrSH(z, q, 19) ^ Pt.rotrBH(z, q, 61) ^ Pt.shrSH(z, q, 6), L = Pt.rotrSL(z, q, 19) ^ Pt.rotrBL(z, q, 61) ^ Pt.shrSL(z, q, 6), b = Pt.add4L(et, L, ts[E - 7], ts[E - 16]), T = Pt.add4H(b, Q, $, Jr[E - 7], Jr[E - 16]);
      Jr[E] = T | 0, ts[E] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: w, Fh: p, Fl: x, Gh: S, Gl: M, Hh: G, Hl: K } = this;
    for (let E = 0; E < 80; E++) {
      const U = Pt.rotrSH(l, w, 14) ^ Pt.rotrSH(l, w, 18) ^ Pt.rotrBH(l, w, 41), _ = Pt.rotrSL(l, w, 14) ^ Pt.rotrSL(l, w, 18) ^ Pt.rotrBL(l, w, 41), Q = l & p ^ ~l & S, et = w & x ^ ~w & M, z = Pt.add5L(K, _, et, xx[E], ts[E]), q = Pt.add5H(z, G, U, Q, mx[E], Jr[E]), $ = z | 0, L = Pt.rotrSH(r, s, 28) ^ Pt.rotrBH(r, s, 34) ^ Pt.rotrBH(r, s, 39), b = Pt.rotrSL(r, s, 28) ^ Pt.rotrBL(r, s, 34) ^ Pt.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, D = s & o ^ s & c ^ o & c;
      G = S | 0, K = M | 0, S = p | 0, M = x | 0, p = l | 0, x = w | 0, { h: l, l: w } = Pt.add(u | 0, f | 0, q | 0, $ | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const C = Pt.add3L($, b, D);
      r = Pt.add3H(C, q, L, T), s = C | 0;
    }
    ({ h: r, l: s } = Pt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Pt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Pt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Pt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: w } = Pt.add(this.Eh | 0, this.El | 0, l | 0, w | 0), { h: p, l: x } = Pt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: M } = Pt.add(this.Gh | 0, this.Gl | 0, S | 0, M | 0), { h: G, l: K } = Pt.add(this.Hh | 0, this.Hl | 0, G | 0, K | 0), this.set(r, s, i, o, a, c, u, f, l, w, p, x, S, M, G, K);
  }
  roundClean() {
    Jr.fill(0), ts.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Sx = class extends Hc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Ex = class extends Hc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Ax = class extends Hc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ai(() => new Hc());
ai(() => new Sx());
ai(() => new Ex());
ai(() => new Ax());
var ic = { exports: {} };
ic.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", f = "[object Function]", l = "[object GeneratorFunction]", w = "[object Map]", p = "[object Number]", x = "[object Object]", S = "[object Promise]", M = "[object RegExp]", G = "[object Set]", K = "[object String]", E = "[object Symbol]", U = "[object WeakMap]", _ = "[object ArrayBuffer]", Q = "[object DataView]", et = "[object Float32Array]", z = "[object Float64Array]", q = "[object Int8Array]", $ = "[object Int16Array]", L = "[object Int32Array]", b = "[object Uint8Array]", T = "[object Uint8ClampedArray]", D = "[object Uint16Array]", C = "[object Uint32Array]", it = /[\\^$.*+?()[\]{}|]/g, W = /\w*$/, Et = /^\[object .+?Constructor\]$/, k = /^(?:0|[1-9]\d*)$/, H = {};
  H[i] = H[o] = H[_] = H[Q] = H[a] = H[c] = H[et] = H[z] = H[q] = H[$] = H[L] = H[w] = H[p] = H[x] = H[M] = H[G] = H[K] = H[E] = H[b] = H[T] = H[D] = H[C] = !0, H[u] = H[f] = H[U] = !1;
  var at = typeof wn == "object" && wn && wn.Object === Object && wn, ct = typeof self == "object" && self && self.Object === Object && self, ut = at || ct || Function("return this")(), kt = e && !e.nodeType && e, ge = kt && !0 && t && !t.nodeType && t, It = ge && ge.exports === kt;
  function Xt(y, B) {
    return y.set(B[0], B[1]), y;
  }
  function Lt(y, B) {
    return y.add(B), y;
  }
  function N(y, B) {
    for (var O = -1, P = y ? y.length : 0; ++O < P && B(y[O], O, y) !== !1; )
      ;
    return y;
  }
  function lt(y, B) {
    for (var O = -1, P = B.length, J = y.length; ++O < P; )
      y[J + O] = B[O];
    return y;
  }
  function Ct(y, B, O, P) {
    for (var J = -1, pt = y ? y.length : 0; ++J < pt; )
      O = B(O, y[J], J, y);
    return O;
  }
  function tn(y, B) {
    for (var O = -1, P = Array(y); ++O < y; )
      P[O] = B(O);
    return P;
  }
  function ae(y, B) {
    return y == null ? void 0 : y[B];
  }
  function Oe(y) {
    var B = !1;
    if (y != null && typeof y.toString != "function")
      try {
        B = !!(y + "");
      } catch {
      }
    return B;
  }
  function en(y) {
    var B = -1, O = Array(y.size);
    return y.forEach(function(P, J) {
      O[++B] = [J, P];
    }), O;
  }
  function Le(y, B) {
    return function(O) {
      return y(B(O));
    };
  }
  function nn(y) {
    var B = -1, O = Array(y.size);
    return y.forEach(function(P) {
      O[++B] = P;
    }), O;
  }
  var Ue = Array.prototype, At = Function.prototype, Se = Object.prototype, ue = ut["__core-js_shared__"], Dn = function() {
    var y = /[^.]+$/.exec(ue && ue.keys && ue.keys.IE_PROTO || "");
    return y ? "Symbol(src)_1." + y : "";
  }(), Fn = At.toString, De = Se.hasOwnProperty, Ee = Se.toString, v = RegExp(
    "^" + Fn.call(De).replace(it, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), F = It ? ut.Buffer : void 0, j = ut.Symbol, V = ut.Uint8Array, ft = Le(Object.getPrototypeOf, Object), ot = Object.create, se = Se.propertyIsEnumerable, Kt = Ue.splice, ie = Object.getOwnPropertySymbols, de = F ? F.isBuffer : void 0, Ae = Le(Object.keys, Object), ye = Cn(ut, "DataView"), Mt = Cn(ut, "Map"), $t = Cn(ut, "Promise"), Tt = Cn(ut, "Set"), te = Cn(ut, "WeakMap"), ve = Cn(Object, "create"), he = Ot(ye), jn = Ot(Mt), mn = Ot($t), Ar = Ot(Tt), pi = Ot(te), gi = j ? j.prototype : void 0, vs = gi ? gi.valueOf : void 0;
  function Xn(y) {
    var B = -1, O = y ? y.length : 0;
    for (this.clear(); ++B < O; ) {
      var P = y[B];
      this.set(P[0], P[1]);
    }
  }
  function xn() {
    this.__data__ = ve ? ve(null) : {};
  }
  function yi(y) {
    return this.has(y) && delete this.__data__[y];
  }
  function uo(y) {
    var B = this.__data__;
    if (ve) {
      var O = B[y];
      return O === r ? void 0 : O;
    }
    return De.call(B, y) ? B[y] : void 0;
  }
  function Zt(y) {
    var B = this.__data__;
    return ve ? B[y] !== void 0 : De.call(B, y);
  }
  function We(y, B) {
    var O = this.__data__;
    return O[y] = ve && B === void 0 ? r : B, this;
  }
  Xn.prototype.clear = xn, Xn.prototype.delete = yi, Xn.prototype.get = uo, Xn.prototype.has = Zt, Xn.prototype.set = We;
  function ln(y) {
    var B = -1, O = y ? y.length : 0;
    for (this.clear(); ++B < O; ) {
      var P = y[B];
      this.set(P[0], P[1]);
    }
  }
  function Or() {
    this.__data__ = [];
  }
  function wi(y) {
    var B = this.__data__, O = He(B, y);
    if (O < 0)
      return !1;
    var P = B.length - 1;
    return O == P ? B.pop() : Kt.call(B, O, 1), !0;
  }
  function we(y) {
    var B = this.__data__, O = He(B, y);
    return O < 0 ? void 0 : B[O][1];
  }
  function Dr(y) {
    return He(this.__data__, y) > -1;
  }
  function $n(y, B) {
    var O = this.__data__, P = He(O, y);
    return P < 0 ? O.push([y, B]) : O[P][1] = B, this;
  }
  ln.prototype.clear = Or, ln.prototype.delete = wi, ln.prototype.get = we, ln.prototype.has = Dr, ln.prototype.set = $n;
  function In(y) {
    var B = -1, O = y ? y.length : 0;
    for (this.clear(); ++B < O; ) {
      var P = y[B];
      this.set(P[0], P[1]);
    }
  }
  function Fr() {
    this.__data__ = {
      hash: new Xn(),
      map: new (Mt || ln)(),
      string: new Xn()
    };
  }
  function bi(y) {
    return En(this, y).delete(y);
  }
  function mi(y) {
    return En(this, y).get(y);
  }
  function d(y) {
    return En(this, y).has(y);
  }
  function m(y, B) {
    return En(this, y).set(y, B), this;
  }
  In.prototype.clear = Fr, In.prototype.delete = bi, In.prototype.get = mi, In.prototype.has = d, In.prototype.set = m;
  function A(y) {
    this.__data__ = new ln(y);
  }
  function h() {
    this.__data__ = new ln();
  }
  function rt(y) {
    return this.__data__.delete(y);
  }
  function vt(y) {
    return this.__data__.get(y);
  }
  function xt(y) {
    return this.__data__.has(y);
  }
  function zt(y, B) {
    var O = this.__data__;
    if (O instanceof ln) {
      var P = O.__data__;
      if (!Mt || P.length < n - 1)
        return P.push([y, B]), this;
      O = this.__data__ = new In(P);
    }
    return O.set(y, B), this;
  }
  A.prototype.clear = h, A.prototype.delete = rt, A.prototype.get = vt, A.prototype.has = xt, A.prototype.set = zt;
  function ke(y, B) {
    var O = dn(y) || Ve(y) ? tn(y.length, String) : [], P = O.length, J = !!P;
    for (var pt in y)
      De.call(y, pt) && !(J && (pt == "length" || R(pt, P))) && O.push(pt);
    return O;
  }
  function Ke(y, B, O) {
    var P = y[B];
    (!(De.call(y, B) && rn(P, O)) || O === void 0 && !(B in y)) && (y[B] = O);
  }
  function He(y, B) {
    for (var O = y.length; O--; )
      if (rn(y[O][0], B))
        return O;
    return -1;
  }
  function Rt(y, B) {
    return y && kr(B, Ai(B), y);
  }
  function pe(y, B, O, P, J, pt, ne) {
    var qe;
    if (P && (qe = pt ? P(y, J, pt, ne) : P(y)), qe !== void 0)
      return qe;
    if (!ks(y))
      return y;
    var Rr = dn(y);
    if (Rr) {
      if (qe = Y(y), !B)
        return fn(y, qe);
    } else {
      var Re = I(y), ho = Re == f || Re == l;
      if (Qo(y))
        return Ln(y, B);
      if (Re == x || Re == i || ho && !pt) {
        if (Oe(y))
          return pt ? y : {};
        if (qe = tt(ho ? {} : y), !B)
          return Si(y, Rt(qe, y));
      } else {
        if (!H[Re])
          return pt ? y : {};
        qe = bt(y, Re, pe, B);
      }
    }
    ne || (ne = new A());
    var ra = ne.get(y);
    if (ra)
      return ra;
    if (ne.set(y, qe), !Rr)
      var sa = O ? Ei(y) : Ai(y);
    return N(sa || y, function(zr, ia) {
      sa && (ia = zr, zr = y[ia]), Ke(qe, ia, pe(zr, B, O, P, ia, y, ne));
    }), qe;
  }
  function Yt(y) {
    return ks(y) ? ot(y) : {};
  }
  function un(y, B, O) {
    var P = B(y);
    return dn(y) ? P : lt(P, O(y));
  }
  function Xe(y) {
    return Ee.call(y);
  }
  function Fe(y) {
    if (!ks(y) || mt(y))
      return !1;
    var B = fo(y) || Oe(y) ? v : Et;
    return B.test(Ot(y));
  }
  function Rn(y) {
    if (!wt(y))
      return Ae(y);
    var B = [];
    for (var O in Object(y))
      De.call(y, O) && O != "constructor" && B.push(O);
    return B;
  }
  function Ln(y, B) {
    if (B)
      return y.slice();
    var O = new y.constructor(y.length);
    return y.copy(O), O;
  }
  function Sn(y) {
    var B = new y.constructor(y.byteLength);
    return new V(B).set(new V(y)), B;
  }
  function Qt(y, B) {
    var O = B ? Sn(y.buffer) : y.buffer;
    return new y.constructor(O, y.byteOffset, y.byteLength);
  }
  function xi(y, B, O) {
    var P = B ? O(en(y), !0) : en(y);
    return Ct(P, Xt, new y.constructor());
  }
  function vr(y) {
    var B = new y.constructor(y.source, W.exec(y));
    return B.lastIndex = y.lastIndex, B;
  }
  function ht(y, B, O) {
    var P = B ? O(nn(y), !0) : nn(y);
    return Ct(P, Lt, new y.constructor());
  }
  function Vt(y) {
    return vs ? Object(vs.call(y)) : {};
  }
  function ee(y, B) {
    var O = B ? Sn(y.buffer) : y.buffer;
    return new y.constructor(O, y.byteOffset, y.length);
  }
  function fn(y, B) {
    var O = -1, P = y.length;
    for (B || (B = Array(P)); ++O < P; )
      B[O] = y[O];
    return B;
  }
  function kr(y, B, O, P) {
    O || (O = {});
    for (var J = -1, pt = B.length; ++J < pt; ) {
      var ne = B[J], qe = void 0;
      Ke(O, ne, qe === void 0 ? y[ne] : qe);
    }
    return O;
  }
  function Si(y, B) {
    return kr(y, g(y), B);
  }
  function Ei(y) {
    return un(y, Ai, g);
  }
  function En(y, B) {
    var O = y.__data__;
    return gt(B) ? O[typeof B == "string" ? "string" : "hash"] : O.map;
  }
  function Cn(y, B) {
    var O = ae(y, B);
    return Fe(O) ? O : void 0;
  }
  var g = ie ? Le(ie, Object) : ea, I = Xe;
  (ye && I(new ye(new ArrayBuffer(1))) != Q || Mt && I(new Mt()) != w || $t && I($t.resolve()) != S || Tt && I(new Tt()) != G || te && I(new te()) != U) && (I = function(y) {
    var B = Ee.call(y), O = B == x ? y.constructor : void 0, P = O ? Ot(O) : void 0;
    if (P)
      switch (P) {
        case he:
          return Q;
        case jn:
          return w;
        case mn:
          return S;
        case Ar:
          return G;
        case pi:
          return U;
      }
    return B;
  });
  function Y(y) {
    var B = y.length, O = y.constructor(B);
    return B && typeof y[0] == "string" && De.call(y, "index") && (O.index = y.index, O.input = y.input), O;
  }
  function tt(y) {
    return typeof y.constructor == "function" && !wt(y) ? Yt(ft(y)) : {};
  }
  function bt(y, B, O, P) {
    var J = y.constructor;
    switch (B) {
      case _:
        return Sn(y);
      case a:
      case c:
        return new J(+y);
      case Q:
        return Qt(y, P);
      case et:
      case z:
      case q:
      case $:
      case L:
      case b:
      case T:
      case D:
      case C:
        return ee(y, P);
      case w:
        return xi(y, P, O);
      case p:
      case K:
        return new J(y);
      case M:
        return vr(y);
      case G:
        return ht(y, P, O);
      case E:
        return Vt(y);
    }
  }
  function R(y, B) {
    return B = B ?? s, !!B && (typeof y == "number" || k.test(y)) && y > -1 && y % 1 == 0 && y < B;
  }
  function gt(y) {
    var B = typeof y;
    return B == "string" || B == "number" || B == "symbol" || B == "boolean" ? y !== "__proto__" : y === null;
  }
  function mt(y) {
    return !!Dn && Dn in y;
  }
  function wt(y) {
    var B = y && y.constructor, O = typeof B == "function" && B.prototype || Se;
    return y === O;
  }
  function Ot(y) {
    if (y != null) {
      try {
        return Fn.call(y);
      } catch {
      }
      try {
        return y + "";
      } catch {
      }
    }
    return "";
  }
  function je(y) {
    return pe(y, !0, !0);
  }
  function rn(y, B) {
    return y === B || y !== y && B !== B;
  }
  function Ve(y) {
    return Zo(y) && De.call(y, "callee") && (!se.call(y, "callee") || Ee.call(y) == i);
  }
  var dn = Array.isArray;
  function jr(y) {
    return y != null && Jo(y.length) && !fo(y);
  }
  function Zo(y) {
    return ta(y) && jr(y);
  }
  var Qo = de || na;
  function fo(y) {
    var B = ks(y) ? Ee.call(y) : "";
    return B == f || B == l;
  }
  function Jo(y) {
    return typeof y == "number" && y > -1 && y % 1 == 0 && y <= s;
  }
  function ks(y) {
    var B = typeof y;
    return !!y && (B == "object" || B == "function");
  }
  function ta(y) {
    return !!y && typeof y == "object";
  }
  function Ai(y) {
    return jr(y) ? ke(y) : Rn(y);
  }
  function ea() {
    return [];
  }
  function na() {
    return !1;
  }
  t.exports = je;
})(ic, ic.exports);
var vx = ic.exports;
const fg = /* @__PURE__ */ H0(vx);
var Yl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Yl || (Yl = {}));
function kx(t, e) {
  return { type: Yl.Address, version: t, hash160: e };
}
function $x(t) {
  return ci.c32address(t.version, t.hash160);
}
const Ix = (t) => Z2(rg(t)), Lx = (t) => yt(Ix(t));
Me.hmacSha256Sync = (t, ...e) => {
  const n = eg.create(rg, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Cx(t, e = "mainnet") {
  e = Zp(e), t = typeof t == "string" ? Wt(t) : t;
  const n = z2(Br.P2PKH, e), r = kx(n, Lx(t));
  return $x(r);
}
function Tx(t, e) {
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
  const s = r.issuer.publicKey, i = Cx(s);
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
function Bx(t, e = null) {
  let n;
  e ? n = Tx(t, e) : n = Je.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Yd = "_blockstackDidCheckEchoReply", Mx = "echoReply", Nx = "authContinuation";
function Px(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function _x() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Yd];
  if (typeof e == "boolean")
    return e;
  const n = Px(t.location.search), r = n[Mx];
  if (r) {
    t[Yd] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[Nx];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class Wl {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new V0();
    else
      throw new tb("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Cd(e.sessionOptions) : this.store = new Cd() : e ? this.store = new Ld(e.sessionOptions) : this.store = new Ld();
  }
  makeAuthRequestToken(e, n, r, s, i, o = nb().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new _l("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, x2(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = m2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = zu("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (_x())
        return Bi.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Bi.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = kb()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new oa("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = Je.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await k2(e))
      throw new oa("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (el(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await $d(s, i.private_key);
          } catch {
            if (Bi.warn("Failed decryption of appPrivateKey, will try to use as given"), !Me.isValidPrivateKey(i.private_key))
              throw new oa("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await $d(s, c);
          } catch {
            Bi.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new oa("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = pb, f;
    el(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), el(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (f = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: Yp(i.iss),
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
        l.profile = Object.assign({}, Zw);
      else {
        const x = await p.text(), S = JSON.parse(x);
        l.profile = Bx(S[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new _l("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), p1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), g1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Wl.prototype.makeAuthRequest = Wl.prototype.makeAuthRequestToken;
const Ux = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Hx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = Ux(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!Oc(r.id));
  return e.concat(n);
}, Oc = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), dg = "STX_PROVIDER", Vs = () => typeof window > "u" ? null : window.localStorage.getItem(dg), Ox = (t) => {
  typeof window < "u" && window.localStorage.setItem(dg, t);
}, Dx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Fx(t, e) {
  const n = {};
  return Object.assign(n, Dx, e), await fetch(t, n);
}
function jx(t) {
  let e = Fx, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Rx(...t) {
  const { fetchLib: e, middlewares: n } = jx(t);
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
var Wi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Wi || (Wi = {}));
var qs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(qs || (qs = {}));
var Wd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Wd || (Wd = {}));
const zx = "https://api.mainnet.hiro.so", Gx = "https://api.testnet.hiro.so", Kx = "http://localhost:3999", Vx = ["mainnet", "testnet", "devnet", "mocknet"];
class Ys {
  constructor(e) {
    this.version = qs.Mainnet, this.chainId = Wi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === qs.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Rx();
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
Ys.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Xl();
    case "testnet":
      return new Zl();
    case "devnet":
      return new qx();
    case "mocknet":
      return new hg();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Vx.join(", ")}`);
  }
};
Ys.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Ys.fromName(t);
class Xl extends Ys {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? zx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = qs.Mainnet, this.chainId = Wi.Mainnet;
  }
}
class Zl extends Ys {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Gx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = qs.Testnet, this.chainId = Wi.Testnet;
  }
}
class hg extends Ys {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Kx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = qs.Testnet, this.chainId = Wi.Testnet;
  }
}
const qx = hg;
var Ws;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Ws || (Ws = {}));
var oc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(oc || (oc = {}));
Ws.Mainnet;
var Xs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Xs || (Xs = {}));
var Zs;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Zs || (Zs = {}));
Xs.Mainnet;
const Yx = {
  chainId: Ws.Mainnet,
  transactionVersion: Xs.Mainnet,
  peerNetworkId: oc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Zs.MainnetSingleSig,
    multiSig: Zs.MainnetMultiSig
  },
  client: { baseUrl: z0 }
}, Ql = {
  chainId: Ws.Testnet,
  transactionVersion: Xs.Testnet,
  peerNetworkId: oc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Zs.TestnetSingleSig,
    multiSig: Zs.TestnetMultiSig
  },
  client: { baseUrl: G0 }
}, za = {
  ...Ql,
  addressVersion: { ...Ql.addressVersion },
  magicBytes: "id",
  client: { baseUrl: K0 }
}, Wx = {
  ...za,
  addressVersion: { ...za.addressVersion },
  client: { ...za.client }
};
function Xx(t) {
  switch (t) {
    case "mainnet":
      return Yx;
    case "testnet":
      return Ql;
    case "devnet":
      return za;
    case "mocknet":
      return Wx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Zx(t) {
  return typeof t == "string" ? Xx(t) : t;
}
function Qx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Xd = /* @__PURE__ */ new Map();
function pg(t, e) {
  const n = Xd.get(t);
  if (n !== void 0)
    return n(e);
  const r = Qx(t);
  return Xd.set(t, r), pg(t, e);
}
let fe = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Wt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Sb(this.readBytes(4), 0);
  }
  readUInt8() {
    return mb(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return wb(this.readBytes(2), 0);
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
    if (pg(e, r))
      return r;
    throw n(r);
  }
};
const Jx = 128, tS = 128, gg = 16, Us = 32, Jl = 80, Dc = 65, eS = 32, nS = 64, ac = 34, rS = 1 + 16 * 1024 * 1024, sS = 165, iS = 16, oS = 16, aS = 20, cS = oS + 2 + aS, lS = cS + 4, uS = rS + (sS + iS * lS);
var re;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(re || (re = {}));
var tu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(tu || (tu = {}));
var Bn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Bn || (Bn = {}));
const cl = ["onChainOnly", "offChainOnly", "any"];
cl[0] + "", Bn.OnChainOnly, cl[1] + "", Bn.OffChainOnly, cl[2] + "", Bn.Any, Bn.OnChainOnly + "", Bn.OnChainOnly, Bn.OffChainOnly + "", Bn.OffChainOnly, Bn.Any + "", Bn.Any;
var cc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(cc || (cc = {}));
var be;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(be || (be = {}));
var Te;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Te || (Te = {}));
var ce;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ce || (ce = {}));
var $e;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})($e || ($e = {}));
var Io;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Io || (Io = {}));
var eu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(eu || (eu = {}));
var nu;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(nu || (nu = {}));
var yn;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(yn || (yn = {}));
var Zd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Zd || (Zd = {}));
var ru;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(ru || (ru = {}));
var tr;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(tr || (tr = {}));
var Qd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Qd || (Qd = {}));
let Fc = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Mi = class extends Fc {
  constructor(e) {
    super(e);
  }
}, pn = class extends Fc {
  constructor(e) {
    super(e);
  }
}, lc = class extends Fc {
  constructor(e) {
    super(e);
  }
}, Bs = class extends Fc {
  constructor(e) {
    super(e);
  }
};
function su(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function fS(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function yg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function dS(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  su(t.outputLen), su(t.blockLen);
}
function hS(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function pS(t, e) {
  yg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ms = {
  number: su,
  bool: fS,
  bytes: yg,
  hash: dS,
  exists: hS,
  output: pS
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ll = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), ar = (t, e) => t << 32 - e | t >>> e, gS = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!gS)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function yS(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function ff(t) {
  if (typeof t == "string" && (t = yS(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let wg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function li(t) {
  const e = (r) => t().update(ff(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let bg = class extends wg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ms.hash(e);
    const r = ff(n);
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
    return Ms.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ms.exists(this), Ms.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const mg = (t, e, n) => new bg(t, e).update(n).digest();
mg.create = (t, e) => new bg(t, e);
function wS(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let df = class extends wg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ll(this.buffer);
  }
  update(e) {
    Ms.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = ff(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ll(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ms.exists(this), Ms.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    wS(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ll(e), c = this.outputLen;
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
const bS = (t, e, n) => t & e ^ ~t & n, mS = (t, e, n) => t & e ^ t & n ^ e & n, xS = new Uint32Array([
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
let xg = class extends df {
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
      const w = ns[l - 15], p = ns[l - 2], x = ar(w, 7) ^ ar(w, 18) ^ w >>> 3, S = ar(p, 17) ^ ar(p, 19) ^ p >>> 10;
      ns[l] = S + ns[l - 7] + x + ns[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const w = ar(a, 6) ^ ar(a, 11) ^ ar(a, 25), p = f + w + bS(a, c, u) + xS[l] + ns[l] | 0, S = (ar(r, 2) ^ ar(r, 13) ^ ar(r, 22)) + mS(r, s, i) | 0;
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
}, SS = class extends xg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const hf = li(() => new xg());
li(() => new SS());
const ES = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Sg = Uint8Array.from({ length: 16 }, (t, e) => e), AS = Sg.map((t) => (9 * t + 5) % 16);
let pf = [Sg], gf = [AS];
for (let t = 0; t < 4; t++)
  for (let e of [pf, gf])
    e.push(e[t].map((n) => ES[n]));
const Eg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), vS = pf.map((t, e) => t.map((n) => Eg[e][n])), kS = gf.map((t, e) => t.map((n) => Eg[e][n])), $S = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), IS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ma = (t, e) => t << e | t >>> 32 - e;
function Jd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const xa = new Uint32Array(16);
let LS = class extends df {
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
      const x = 4 - p, S = $S[p], M = IS[p], G = pf[p], K = gf[p], E = vS[p], U = kS[p];
      for (let _ = 0; _ < 16; _++) {
        const Q = ma(r + Jd(p, i, a, u) + xa[G[_]] + S, E[_]) + l | 0;
        r = l, l = u, u = ma(a, 10) | 0, a = i, i = Q;
      }
      for (let _ = 0; _ < 16; _++) {
        const Q = ma(s + Jd(x, o, c, f) + xa[K[_]] + M, U[_]) + w | 0;
        s = w, w = f, f = ma(c, 10) | 0, c = o, o = Q;
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
const CS = li(() => new LS()), Sa = BigInt(2 ** 32 - 1), iu = BigInt(32);
function Ag(t, e = !1) {
  return e ? { h: Number(t & Sa), l: Number(t >> iu & Sa) } : { h: Number(t >> iu & Sa) | 0, l: Number(t & Sa) | 0 };
}
function TS(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Ag(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const BS = (t, e) => BigInt(t >>> 0) << iu | BigInt(e >>> 0), MS = (t, e, n) => t >>> n, NS = (t, e, n) => t << 32 - n | e >>> n, PS = (t, e, n) => t >>> n | e << 32 - n, _S = (t, e, n) => t << 32 - n | e >>> n, US = (t, e, n) => t << 64 - n | e >>> n - 32, HS = (t, e, n) => t >>> n - 32 | e << 64 - n, OS = (t, e) => e, DS = (t, e) => t, FS = (t, e, n) => t << n | e >>> 32 - n, jS = (t, e, n) => e << n | t >>> 32 - n, RS = (t, e, n) => e << n - 32 | t >>> 64 - n, zS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function GS(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const KS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), VS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, qS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), YS = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, WS = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), XS = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, _t = {
  fromBig: Ag,
  split: TS,
  toBig: BS,
  shrSH: MS,
  shrSL: NS,
  rotrSH: PS,
  rotrSL: _S,
  rotrBH: US,
  rotrBL: HS,
  rotr32H: OS,
  rotr32L: DS,
  rotlSH: FS,
  rotlSL: jS,
  rotlBH: RS,
  rotlBL: zS,
  add: GS,
  add3L: KS,
  add3H: VS,
  add4L: qS,
  add4H: YS,
  add5H: XS,
  add5L: WS
}, [ZS, QS] = _t.split([
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
let jc = class extends df {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: w, Gh: p, Gl: x, Hh: S, Hl: M } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, w, p, x, S, M];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, w, p, x, S, M) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = w | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = M | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      rs[E] = e.getUint32(n), ss[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const U = rs[E - 15] | 0, _ = ss[E - 15] | 0, Q = _t.rotrSH(U, _, 1) ^ _t.rotrSH(U, _, 8) ^ _t.shrSH(U, _, 7), et = _t.rotrSL(U, _, 1) ^ _t.rotrSL(U, _, 8) ^ _t.shrSL(U, _, 7), z = rs[E - 2] | 0, q = ss[E - 2] | 0, $ = _t.rotrSH(z, q, 19) ^ _t.rotrBH(z, q, 61) ^ _t.shrSH(z, q, 6), L = _t.rotrSL(z, q, 19) ^ _t.rotrBL(z, q, 61) ^ _t.shrSL(z, q, 6), b = _t.add4L(et, L, ss[E - 7], ss[E - 16]), T = _t.add4H(b, Q, $, rs[E - 7], rs[E - 16]);
      rs[E] = T | 0, ss[E] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: w, Fh: p, Fl: x, Gh: S, Gl: M, Hh: G, Hl: K } = this;
    for (let E = 0; E < 80; E++) {
      const U = _t.rotrSH(l, w, 14) ^ _t.rotrSH(l, w, 18) ^ _t.rotrBH(l, w, 41), _ = _t.rotrSL(l, w, 14) ^ _t.rotrSL(l, w, 18) ^ _t.rotrBL(l, w, 41), Q = l & p ^ ~l & S, et = w & x ^ ~w & M, z = _t.add5L(K, _, et, QS[E], ss[E]), q = _t.add5H(z, G, U, Q, ZS[E], rs[E]), $ = z | 0, L = _t.rotrSH(r, s, 28) ^ _t.rotrBH(r, s, 34) ^ _t.rotrBH(r, s, 39), b = _t.rotrSL(r, s, 28) ^ _t.rotrBL(r, s, 34) ^ _t.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, D = s & o ^ s & c ^ o & c;
      G = S | 0, K = M | 0, S = p | 0, M = x | 0, p = l | 0, x = w | 0, { h: l, l: w } = _t.add(u | 0, f | 0, q | 0, $ | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const C = _t.add3L($, b, D);
      r = _t.add3H(C, q, L, T), s = C | 0;
    }
    ({ h: r, l: s } = _t.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = _t.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = _t.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = _t.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: w } = _t.add(this.Eh | 0, this.El | 0, l | 0, w | 0), { h: p, l: x } = _t.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: M } = _t.add(this.Gh | 0, this.Gl | 0, S | 0, M | 0), { h: G, l: K } = _t.add(this.Hh | 0, this.Hl | 0, G | 0, K | 0), this.set(r, s, i, o, a, c, u, f, l, w, p, x, S, M, G, K);
  }
  roundClean() {
    rs.fill(0), ss.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, JS = class extends jc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, tE = class extends jc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, eE = class extends jc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
li(() => new jc());
li(() => new JS());
const nE = li(() => new tE());
li(() => new eE());
var Gt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Gt || (Gt = {}));
var ze;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(ze || (ze = {}));
function yf(t) {
  return ze[t];
}
const rE = () => ({ type: Gt.BoolTrue }), sE = () => ({ type: Gt.BoolFalse }), iE = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Gt.Buffer, value: yt(t) };
}, th = BigInt("0xffffffffffffffffffffffffffffffff"), oE = BigInt(0), eh = BigInt("0x7fffffffffffffffffffffffffffffff"), nh = BigInt("-170141183460469231731687303715884105728"), aE = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = Hl(Wt(t))), kn(t, Uint8Array) && (t = Hl(t));
  const e = cn(t);
  if (e > eh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${eh}`);
  if (e < nh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${nh}`);
  return { type: Gt.Int, value: e };
}, cE = (t) => {
  const e = cn(t);
  if (e < oE)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > th)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${th}`);
  return { type: Gt.UInt, value: e };
};
function lE(t) {
  return { type: Gt.List, value: t };
}
function vg() {
  return { type: Gt.OptionalNone };
}
function kg(t) {
  return { type: Gt.OptionalSome, value: t };
}
var st;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(st || (st = {}));
function uE() {
  return {
    type: st.Address,
    version: Zs.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function rh(t) {
  if (t && Pg(t, ac))
    throw new Error(`Memo exceeds maximum length of ${ac} bytes`);
  return { type: st.MemoString, content: t };
}
function wf(t, e) {
  return {
    type: st.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function ou(t) {
  if (Wt(t).byteLength != Dc)
    throw Error("Invalid signature");
  return {
    type: st.MessageSignature,
    data: t
  };
}
function fE(t, e, n) {
  return typeof t == "string" && (t = IE(t)), typeof n == "string" && (n = rh(n)), {
    type: st.Payload,
    payloadType: re.TokenTransfer,
    recipient: t,
    amount: cn(e),
    memo: n ?? rh("")
  };
}
function dE(t, e, n, r) {
  return typeof e == "string" && (e = rr(e)), typeof n == "string" && (n = rr(n)), {
    type: st.Payload,
    payloadType: re.ContractCall,
    contractAddress: typeof t == "string" ? As(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function hE(t) {
  return rr(t, 4, 1e5);
}
function sh(t, e, n) {
  return typeof t == "string" && (t = rr(t)), typeof e == "string" && (e = hE(e)), typeof n == "number" ? {
    type: st.Payload,
    payloadType: re.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: st.Payload,
    payloadType: re.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function pE() {
  return { type: st.Payload, payloadType: re.PoisonMicroblock };
}
function ih(t, e) {
  if (t.byteLength != Us)
    throw Error(`Coinbase buffer size must be ${Us} bytes`);
  return e != null ? {
    type: st.Payload,
    payloadType: re.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: st.Payload,
    payloadType: re.Coinbase,
    coinbaseBytes: t
  };
}
function gE(t, e, n) {
  if (t.byteLength != Us)
    throw Error(`Coinbase buffer size must be ${Us} bytes`);
  if (n.byteLength != Jl)
    throw Error(`VRF proof buffer size must be ${Jl} bytes`);
  return {
    type: st.Payload,
    payloadType: re.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Gt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function yE(t, e, n, r, s, i, o) {
  return {
    type: st.Payload,
    payloadType: re.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function rr(t, e, n) {
  const r = e || 1, s = n || Jx;
  if (Pg(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: st.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function wE(t, e, n) {
  return {
    type: st.Asset,
    address: As(t),
    contractName: rr(e),
    assetName: rr(n)
  };
}
function As(t) {
  const e = ci.c32addressDecode(t);
  return {
    type: st.Address,
    version: e[0],
    hash160: e[1]
  };
}
function bE(t, e) {
  const n = As(t), r = rr(e);
  return {
    type: st.Principal,
    prefix: yn.Contract,
    address: n,
    contractName: r
  };
}
function mE(t) {
  const e = As(t);
  return {
    type: st.Principal,
    prefix: yn.Standard,
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
function Cr(t) {
  switch (t.type) {
    case st.Address:
      return Yo(t);
    case st.Principal:
      return $g(t);
    case st.LengthPrefixedString:
      return Zi(t);
    case st.MemoString:
      return SE(t);
    case st.Asset:
      return Lg(t);
    case st.PostCondition:
      return Tg(t);
    case st.PublicKey:
      return lu(t);
    case st.LengthPrefixedList:
      return bf(t);
    case st.Payload:
      return Bg(t);
    case st.TransactionAuthField:
      return $E(t);
    case st.MessageSignature:
      return mf(t);
  }
}
function Yo(t) {
  const e = [];
  return e.push(Wt(Ro(t.version, 1))), e.push(Wt(t.hash160)), Pe(e);
}
function Xi(t) {
  const e = kn(t, fe) ? t : new fe(t), n = $c(yt(e.readBytes(1))), r = yt(e.readBytes(20));
  return { type: st.Address, version: n, hash160: r };
}
function $g(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === yn.Standard || t.prefix === yn.Contract) && e.push(Yo(t.address)), t.prefix === yn.Contract && e.push(Zi(t.contractName)), Pe(e);
}
function xE(t) {
  const e = kn(t, fe) ? t : new fe(t), n = e.readUInt8Enum(yn, (i) => {
    throw new pn(`Unexpected Principal payload type: ${i}`);
  });
  if (n === yn.Origin)
    return { type: st.Principal, prefix: n };
  const r = Xi(e);
  if (n === yn.Standard)
    return { type: st.Principal, prefix: n, address: r };
  const s = qn(e);
  return {
    type: st.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Zi(t) {
  const e = [], n = si(t.content), r = n.byteLength;
  return e.push(Wt(Ro(r, t.lengthPrefixBytes))), e.push(n), Pe(e);
}
function qn(t, e, n) {
  e = e || 1;
  const r = kn(t, fe) ? t : new fe(t), s = $c(yt(r.readBytes(e))), i = zo(r.readBytes(s));
  return rr(i, e, n ?? 128);
}
function SE(t) {
  const e = [], n = si(t.content), r = WE(yt(n), ac * 2);
  return e.push(Wt(r)), Pe(e);
}
function Ig(t) {
  const e = kn(t, fe) ? t : new fe(t);
  let n = zo(e.readBytes(ac));
  return n = n.replace(/\u0000*$/, ""), { type: st.MemoString, content: n };
}
function Lg(t) {
  const e = [];
  return e.push(Yo(t.address)), e.push(Zi(t.contractName)), e.push(Zi(t.assetName)), Pe(e);
}
function au(t) {
  const e = kn(t, fe) ? t : new fe(t);
  return {
    type: st.Asset,
    address: Xi(e),
    contractName: qn(e),
    assetName: qn(e)
  };
}
function bf(t) {
  const e = t.values, n = [];
  n.push(Wt(Ro(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Cr(r));
  return Pe(n);
}
function Cg(t, e, n) {
  const r = kn(t, fe) ? t : new fe(t), s = $c(yt(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case st.Address:
        i.push(Xi(r));
        break;
      case st.LengthPrefixedString:
        i.push(qn(r));
        break;
      case st.MemoString:
        i.push(Ig(r));
        break;
      case st.Asset:
        i.push(au(r));
        break;
      case st.PostCondition:
        i.push(AE(r));
        break;
      case st.PublicKey:
        i.push(uu(r));
        break;
      case st.TransactionAuthField:
        i.push(kE(r));
        break;
    }
  return wf(i, n);
}
function EE(t) {
  return yt(Tg(t));
}
function Tg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push($g(t.principal)), (t.conditionType === be.Fungible || t.conditionType === be.NonFungible) && e.push(Lg(t.asset)), t.conditionType === be.NonFungible && e.push(gr(t.assetName)), e.push(t.conditionCode), t.conditionType === be.STX || t.conditionType === be.Fungible || t.conditionType === be.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Mi("The post-condition amount may not be larger than 8 bytes");
    e.push(Ss(t.amount, 8));
  }
  return Pe(e);
}
function AE(t) {
  const e = kn(t, fe) ? t : new fe(t), n = e.readUInt8Enum(be, (a) => {
    throw new pn(`Could not read ${a} as PostConditionType`);
  }), r = xE(e);
  let s, i, o;
  switch (n) {
    case be.STX:
      return s = e.readUInt8Enum(Io, (c) => {
        throw new pn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${yt(e.readBytes(8))}`), {
        type: st.PostCondition,
        conditionType: be.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case be.Fungible:
      return i = au(e), s = e.readUInt8Enum(Io, (c) => {
        throw new pn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${yt(e.readBytes(8))}`), {
        type: st.PostCondition,
        conditionType: be.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case be.NonFungible:
      i = au(e);
      const a = dr(e);
      return s = e.readUInt8Enum(eu, (c) => {
        throw new pn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: st.PostCondition,
        conditionType: be.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case be.Staking:
      return s = e.readUInt8Enum(Io, (c) => {
        throw new pn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${yt(e.readBytes(8))}`), {
        type: st.PostCondition,
        conditionType: be.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case be.PoX: {
      const c = e.readUInt8Enum(nu, (u) => {
        throw new pn(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: st.PostCondition,
        conditionType: be.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function Bg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case re.TokenTransfer:
      e.push(gr(t.recipient)), e.push(Ss(t.amount, 8)), e.push(Cr(t.memo));
      break;
    case re.ContractCall:
      e.push(Cr(t.contractAddress)), e.push(Cr(t.contractName)), e.push(Cr(t.functionName));
      const n = new Uint8Array(4);
      js(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(gr(r));
      });
      break;
    case re.SmartContract:
      e.push(Cr(t.contractName)), e.push(Cr(t.codeBody));
      break;
    case re.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Cr(t.contractName)), e.push(Cr(t.codeBody));
      break;
    case re.PoisonMicroblock:
      break;
    case re.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case re.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(gr(t.recipient));
      break;
    case re.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(gr(t.recipient ? kg(t.recipient) : vg())), e.push(t.vrfProof);
      break;
    case re.TenureChange:
      e.push(Wt(t.tenureHash)), e.push(Wt(t.previousTenureHash)), e.push(Wt(t.burnViewHash)), e.push(Wt(t.previousTenureEnd)), e.push(js(new Uint8Array(4), t.previousTenureBlocks)), e.push(xb(new Uint8Array(1), t.cause)), e.push(Wt(t.publicKeyHash));
      break;
  }
  return Pe(e);
}
function vE(t) {
  const e = kn(t, fe) ? t : new fe(t);
  switch (e.readUInt8Enum(re, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case re.TokenTransfer:
      const r = dr(e), s = cn(e.readBytes(8)), i = Ig(e);
      return fE(r, s, i);
    case re.ContractCall:
      const o = Xi(e), a = qn(e), c = qn(e), u = [], f = e.readUInt32BE();
      for (let U = 0; U < f; U++) {
        const _ = dr(e);
        u.push(_);
      }
      return dE(o, a, c, u);
    case re.SmartContract:
      const l = qn(e), w = qn(e, 4, 1e5);
      return sh(l, w);
    case re.VersionedSmartContract: {
      const U = e.readUInt8Enum(tu, (et) => {
        throw new Error(`Cannot recognize ClarityVersion: ${et}`);
      }), _ = qn(e), Q = qn(e, 4, uS);
      return sh(_, Q, U);
    }
    case re.PoisonMicroblock:
      return pE();
    case re.Coinbase: {
      const U = e.readBytes(Us);
      return ih(U);
    }
    case re.CoinbaseToAltRecipient: {
      const U = e.readBytes(Us), _ = dr(e);
      return ih(U, _);
    }
    case re.NakamotoCoinbase: {
      const U = e.readBytes(Us), _ = dr(e), Q = e.readBytes(Jl);
      return gE(U, _, Q);
    }
    case re.TenureChange:
      const p = yt(e.readBytes(20)), x = yt(e.readBytes(20)), S = yt(e.readBytes(20)), M = yt(e.readBytes(32)), G = e.readUInt32BE(), K = e.readUInt8Enum(ru, (U) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${U}`);
      }), E = yt(e.readBytes(20));
      return yE(p, x, S, M, G, K, E);
  }
}
function cu(t) {
  const e = kn(t, fe) ? t : new fe(t);
  return ou(yt(e.readBytes(Dc)));
}
function kE(t) {
  const e = kn(t, fe) ? t : new fe(t), n = e.readUInt8Enum(tr, (r) => {
    throw new pn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case tr.PublicKeyCompressed:
      return Ni($e.Compressed, uu(e));
    case tr.PublicKeyUncompressed:
      return Ni($e.Uncompressed, io(oA(uu(e).data)));
    case tr.SignatureCompressed:
      return Ni($e.Compressed, cu(e));
    case tr.SignatureUncompressed:
      return Ni($e.Uncompressed, cu(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function mf(t) {
  return Wt(t.data);
}
function $E(t) {
  const e = [];
  switch (t.contents.type) {
    case st.PublicKey:
      e.push(t.pubKeyEncoding === $e.Compressed ? tr.PublicKeyCompressed : tr.PublicKeyUncompressed), e.push(Wt(iA(t.contents.data)));
      break;
    case st.MessageSignature:
      e.push(t.pubKeyEncoding === $e.Compressed ? tr.SignatureCompressed : tr.SignatureUncompressed), e.push(mf(t.contents));
      break;
  }
  return Pe(e);
}
function lu(t) {
  return t.data.slice();
}
function uu(t) {
  const e = kn(t, fe) ? t : new fe(t), n = e.readUInt8(), r = n === 4 ? nS : eS;
  return io(Pe([n, e.readBytes(r)]));
}
function xf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ce.P2PKH || e === ce.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ce.P2WPKH || e === ce.P2WSH || e === ce.P2WSHNonSequential) && !r.map((s) => s.data).every(oo))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ce.P2PKH:
      return Ea(t, XE(r[0].data));
    case ce.P2WPKH:
      return Ea(t, ZE(r[0].data));
    case ce.P2SH:
    case ce.P2SHNonSequential:
      return Ea(t, QE(n, r.map(lu)));
    case ce.P2WSH:
    case ce.P2WSHNonSequential:
      return Ea(t, JE(n, r.map(lu)));
  }
}
function Ea(t, e) {
  return { type: st.Address, version: t, hash160: e };
}
function Sf(t) {
  return ci.c32address(t.version, t.hash160);
}
function oh(t) {
  const [e, n, r] = t.split(/\.|::/);
  return wE(e, n, r);
}
function wo(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return bE(e, n);
  } else
    return mE(t);
}
function IE(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return TE(e, n);
  } else
    return LE(t);
}
function LE(t) {
  const e = As(t);
  return { type: Gt.PrincipalStandard, value: Sf(e) };
}
function CE(t) {
  return { type: Gt.PrincipalStandard, value: Sf(t) };
}
function TE(t, e) {
  const n = As(t), r = rr(e);
  return Mg(n, r);
}
function Mg(t, e) {
  if (si(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Gt.PrincipalContract,
    value: `${Sf(t)}.${e.content}`
  };
}
function BE(t) {
  return { type: Gt.ResponseErr, value: t };
}
function ME(t) {
  return { type: Gt.ResponseOk, value: t };
}
const NE = (t) => ({ type: Gt.StringASCII, value: t }), PE = (t) => ({ type: Gt.StringUTF8, value: t });
function _E(t) {
  for (const e in t)
    if (!tA(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Gt.Tuple, value: t };
}
function dr(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new fe(Wt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new fe(t) : e = t;
  switch (e.readUInt8Enum(ze, (r) => {
    throw new pn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case ze.int:
      return aE(Hl(e.readBytes(16)));
    case ze.uint:
      return cE(e.readBytes(16));
    case ze.buffer:
      const r = e.readUInt32BE();
      return iE(e.readBytes(r));
    case ze.true:
      return rE();
    case ze.false:
      return sE();
    case ze.address:
      const s = Xi(e);
      return CE(s);
    case ze.contract:
      const i = Xi(e), o = qn(e);
      return Mg(i, o);
    case ze.ok:
      return ME(dr(e));
    case ze.err:
      return BE(dr(e));
    case ze.none:
      return vg();
    case ze.some:
      return kg(dr(e));
    case ze.list:
      const a = e.readUInt32BE(), c = [];
      for (let S = 0; S < a; S++)
        c.push(dr(e));
      return lE(c);
    case ze.tuple:
      const u = e.readUInt32BE(), f = {};
      for (let S = 0; S < u; S++) {
        const M = qn(e).content;
        if (M === void 0)
          throw new pn('"content" is undefined');
        f[M] = dr(e);
      }
      return _E(f);
    case ze.ascii:
      const l = e.readUInt32BE(), w = db(e.readBytes(l));
      return NE(w);
    case ze.utf8:
      const p = e.readUInt32BE(), x = zo(e.readBytes(p));
      return PE(x);
    default:
      throw new pn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function xr(t, e) {
  return Pe([yf(t), e]);
}
function UE(t) {
  return new Uint8Array([yf(t.type)]);
}
function HE(t) {
  return t.type === Gt.OptionalNone ? new Uint8Array([yf(t.type)]) : xr(t.type, gr(t.value));
}
function OE(t) {
  const e = new Uint8Array(4);
  return js(e, Math.ceil(t.value.length / 2), 0), xr(t.type, br(e, Wt(t.value)));
}
function DE(t) {
  const e = Gu(ab(BigInt(t.value), BigInt(tS)), gg);
  return xr(t.type, e);
}
function FE(t) {
  const e = Gu(BigInt(t.value), gg);
  return xr(t.type, e);
}
function jE(t) {
  return xr(t.type, Yo(As(t.value)));
}
function RE(t) {
  const [e, n] = eA(t.value);
  return xr(t.type, br(Yo(As(e)), Zi(rr(n))));
}
function zE(t) {
  return xr(t.type, gr(t.value));
}
function GE(t) {
  const e = [], n = new Uint8Array(4);
  js(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = gr(r);
    e.push(s);
  }
  return xr(t.type, Pe(e));
}
function KE(t) {
  const e = [], n = new Uint8Array(4);
  js(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = rr(s);
    e.push(Zi(i));
    const o = gr(t.value[s]);
    e.push(o);
  }
  return xr(t.type, Pe(e));
}
function Ng(t, e) {
  const n = [], r = e == "ascii" ? fb(t.value) : si(t.value), s = new Uint8Array(4);
  return js(s, r.length, 0), n.push(s), n.push(r), xr(t.type, Pe(n));
}
function VE(t) {
  return Ng(t, "ascii");
}
function qE(t) {
  return Ng(t, "utf8");
}
function ah(t) {
  return yt(gr(t));
}
function gr(t) {
  switch (t.type) {
    case Gt.BoolTrue:
    case Gt.BoolFalse:
      return UE(t);
    case Gt.OptionalNone:
    case Gt.OptionalSome:
      return HE(t);
    case Gt.Buffer:
      return OE(t);
    case Gt.UInt:
      return FE(t);
    case Gt.Int:
      return DE(t);
    case Gt.PrincipalStandard:
      return jE(t);
    case Gt.PrincipalContract:
      return RE(t);
    case Gt.ResponseOk:
    case Gt.ResponseErr:
      return zE(t);
    case Gt.List:
      return GE(t);
    case Gt.Tuple:
      return KE(t);
    case Gt.StringASCII:
      return VE(t);
    case Gt.StringUTF8:
      return qE(t);
    default:
      throw new Mi("Unable to serialize. Invalid Clarity Value.");
  }
}
const YE = (t) => t.length % 2 ? `0${t}` : t, WE = (t, e) => t.padEnd(e, "0"), Pg = (t, e) => t ? si(t).length > e : !1;
function fu(t) {
  return fg(t);
}
const Mo = (t) => CS(hf(t)), Ef = (t) => yt(nE(t)), XE = (t) => yt(Mo(t)), ZE = (t) => {
  const e = Mo(t), n = br(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Mo(n);
  return yt(r);
}, QE = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Pe(n), s = Mo(r);
  return yt(s);
}, JE = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Pe(n), s = hf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Pe(i), a = Mo(o);
  return yt(a);
};
function tA(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function eA(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Me.hmacSha256Sync = (t, ...e) => {
  const n = mg.create(hf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function io(t) {
  return t = typeof t == "string" ? Wt(t) : t, {
    type: st.PublicKey,
    data: t
  };
}
function nA(t, e, n = $e.Compressed) {
  const r = yb(e), s = new Un(ad(r.r), ad(r.s)), i = Ft.fromSignature(t, s, r.recoveryId), o = n === $e.Compressed;
  return i.toHex(o);
}
function rA(t) {
  return typeof t == "string" ? t : yt(t);
}
const Af = rA;
function _g(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === gb;
}
function oo(t) {
  return !Af(t).startsWith("04");
}
function sA(t) {
  t = Ku(t);
  const e = _g(t);
  return yt(Go(t.slice(0, 32), e));
}
function iA(t) {
  return Ft.fromHex(Af(t)).toHex(!0);
}
function oA(t) {
  return Ft.fromHex(Af(t)).toHex(!1);
}
function aA(t, e) {
  t = Ku(t);
  const [n, r] = Lc(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Ro(r, 1) + Un.fromHex(n).toCompactHex();
}
function vf() {
  return {
    type: st.MessageSignature,
    data: yt(new Uint8Array(Dc))
  };
}
function Ug(t, e, n, r) {
  const s = xf(0, t, 1, [io(e)]).hash160, i = oo(e) ? $e.Compressed : $e.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: cn(n),
    fee: cn(r),
    keyEncoding: i,
    signature: vf()
  };
}
function No(t) {
  return "signature" in t;
}
function ch(t) {
  return t === ce.P2SH || t === ce.P2WSH;
}
function cA(t) {
  return t === ce.P2SHNonSequential || t === ce.P2WSHNonSequential;
}
function lh(t) {
  const e = fu(t);
  return e.nonce = 0, e.fee = 0, No(e) ? e.signature = vf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function lA(t) {
  const e = [
    t.hashMode,
    Wt(t.signer),
    Ss(t.nonce, 8),
    Ss(t.fee, 8),
    t.keyEncoding,
    mf(t.signature)
  ];
  return Pe(e);
}
function uA(t) {
  const e = [
    t.hashMode,
    Wt(t.signer),
    Ss(t.nonce, 8),
    Ss(t.fee, 8)
  ], n = wf(t.fields);
  e.push(bf(n));
  const r = new Uint8Array(2);
  return bb(r, t.signaturesRequired, 0), e.push(r), Pe(e);
}
function fA(t, e) {
  const n = yt(e.readBytes(20)), r = BigInt(`0x${yt(e.readBytes(8))}`), s = BigInt(`0x${yt(e.readBytes(8))}`), i = e.readUInt8Enum($e, (a) => {
    throw new pn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ce.P2WPKH && i != $e.Compressed)
    throw new pn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = cu(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function dA(t, e) {
  const n = yt(e.readBytes(20)), r = BigInt("0x" + yt(e.readBytes(8))), s = BigInt("0x" + yt(e.readBytes(8))), i = Cg(e, st.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case st.PublicKey:
        oo(u.contents.data) || (o = !0);
        break;
      case st.MessageSignature:
        if (u.pubKeyEncoding === $e.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Bs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ce.P2WSH || t === ce.P2WSHNonSequential))
    throw new Bs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function ul(t) {
  return No(t) ? lA(t) : uA(t);
}
function fl(t) {
  const e = t.readUInt8Enum(ce, (n) => {
    throw new pn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ce.P2PKH || e === ce.P2WPKH ? fA(e, t) : dA(e, t);
}
function Hg(t, e, n, r) {
  const i = t + yt(new Uint8Array([e])) + yt(Ss(n, 8)) + yt(Ss(r, 8));
  if (Wt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Ef(Wt(i));
}
function Og(t, e, n) {
  const r = 33 + Dc, s = oo(e.data) ? $e.Compressed : $e.Uncompressed, i = t + YE(s.toString(16)) + n, o = Wt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Ef(o);
}
function hA(t, e, n, r, s) {
  const i = Hg(t, e, n, r), o = aA(s, i), a = io(sA(s)), c = Og(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Dg(t, e, n, r, s, i) {
  const o = Hg(t, e, n, r), a = io(nA(o, i, s)), c = Og(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function pA() {
  const t = Ug(ce.P2PKH, "", 0, 0);
  return t.signer = uE().hash160, t.keyEncoding = $e.Compressed, t.signature = vf(), t;
}
function uh(t, e, n) {
  return No(t) ? gA(t, e, n) : yA(t, e, n);
}
function gA(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Dg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = xf(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Bs(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function yA(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case st.PublicKey:
        oo(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case st.MessageSignature:
        c.pubKeyEncoding === $e.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: f } = Dg(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (ch(t.hashMode) && (s = f), r.push(u), o += 1, o === 65536)
          throw new Bs("Too many signatures");
        break;
    }
  if (ch(t.hashMode) && o !== t.signaturesRequired || cA(t.hashMode) && o < t.signaturesRequired)
    throw new Bs("Incorrect number of signatures");
  if (i && (t.hashMode === ce.P2WSH || t.hashMode === ce.P2WSHNonSequential))
    throw new Bs("Uncompressed keys are not allowed in this hash mode");
  const a = xf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Bs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Fg(t) {
  return {
    authType: Te.Standard,
    spendingCondition: t
  };
}
function jg(t, e) {
  return {
    authType: Te.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Ug(ce.P2PKH, "0".repeat(66), 0, 0)
  };
}
function fh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Te.Standard:
        return Fg(lh(t.spendingCondition));
      case Te.Sponsored:
        return jg(lh(t.spendingCondition), pA());
      default:
        throw new lc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function wA(t, e) {
  switch (t.authType) {
    case Te.Standard:
      return uh(t.spendingCondition, e, Te.Standard);
    case Te.Sponsored:
      return uh(t.spendingCondition, e, Te.Standard);
    default:
      throw new lc("Invalid origin auth type");
  }
}
function bA(t, e) {
  switch (t.authType) {
    case Te.Standard:
      const n = {
        ...t.spendingCondition,
        fee: cn(e)
      };
      return { ...t, spendingCondition: n };
    case Te.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: cn(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function mA(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: cn(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function xA(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: cn(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function SA(t, e) {
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
function EA(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Te.Standard:
      e.push(ul(t.spendingCondition));
      break;
    case Te.Sponsored:
      e.push(ul(t.spendingCondition)), e.push(ul(t.sponsorSpendingCondition));
      break;
  }
  return Pe(e);
}
function AA(t) {
  const e = t.readUInt8Enum(Te, (r) => {
    throw new pn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Te.Standard:
      return n = fl(t), Fg(n);
    case Te.Sponsored:
      n = fl(t);
      const r = fl(t);
      return jg(n, r);
  }
}
class vA {
  constructor({ auth: e, payload: n, postConditions: r = wf([]), postConditionMode: s = cc.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = Zx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: cn(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Bn.Any;
  }
  signBegin() {
    const e = fu(this);
    return e.auth = fh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = fu(this);
    return e.auth = fh(e.auth), e.txid();
  }
  verifyOrigin() {
    return wA(this.auth, this.verifyBegin());
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
    const n = typeof e == "object" && "type" in e ? e : io(e), r = this.auth.spendingCondition;
    if (r && !No(r)) {
      const s = oo(n.data);
      r.fields.push(Ni(s ? $e.Compressed : $e.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = hA(n, r, e.fee, e.nonce, s);
    if (No(e))
      e.signature = ou(i);
    else {
      const a = _g(s);
      e.fields.push(Ni(a ? $e.Compressed : $e.Uncompressed, ou(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return Ef(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Te.Sponsored)
      throw new lc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = SA(this.auth, e);
  }
  setFee(e) {
    this.auth = bA(this.auth, e);
  }
  setNonce(e) {
    this.auth = mA(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Te.Sponsored)
      throw new lc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = xA(this.auth, e);
  }
  serialize() {
    return yt(this.serializeBytes());
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
    return js(n, this.chainId, 0), e.push(n), e.push(EA(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(bf(this.postConditions)), e.push(Bg(this.payload)), Pe(e);
  }
}
function kA(t) {
  const e = kn(t, fe) ? t : new fe(t), n = e.readUInt8Enum(Xs, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = AA(e), i = e.readUInt8Enum(Bn, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(cc, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = Cg(e, st.PostCondition), c = vE(e), u = new vA({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const dh = BigInt("18446744073709551615");
function dl(t) {
  const e = cn(t);
  if (e < 0n || e > dh)
    throw new RangeError(`Post-condition amount must be between 0 and ${dh} (u64 max), received: ${e}`);
  return e;
}
var du;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(du || (du = {}));
var hu;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(hu || (hu = {}));
function $A(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: st.PostCondition,
        conditionType: be.STX,
        principal: t.address === "origin" ? { type: st.Principal, prefix: yn.Origin } : wo(t.address),
        conditionCode: Aa(t.condition),
        amount: dl(t.amount)
      };
    case "ft-postcondition":
      return {
        type: st.PostCondition,
        conditionType: be.Fungible,
        principal: t.address === "origin" ? { type: st.Principal, prefix: yn.Origin } : wo(t.address),
        conditionCode: Aa(t.condition),
        amount: dl(t.amount),
        asset: oh(t.asset)
      };
    case "nft-postcondition":
      return {
        type: st.PostCondition,
        conditionType: be.NonFungible,
        principal: t.address === "origin" ? { type: st.Principal, prefix: yn.Origin } : wo(t.address),
        conditionCode: Aa(t.condition),
        asset: oh(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: st.PostCondition,
        conditionType: be.Staking,
        principal: t.address === "origin" ? { type: st.Principal, prefix: yn.Origin } : wo(t.address),
        conditionCode: Aa(t.condition),
        amount: dl(t.amount)
      };
    case "pox-postcondition":
      return {
        type: st.PostCondition,
        conditionType: be.PoX,
        principal: t.address === "origin" ? { type: st.Principal, prefix: yn.Origin } : wo(t.address),
        conditionCode: IA(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Aa(t) {
  return du[t];
}
function IA(t) {
  return hu[t];
}
function Rg(t) {
  const e = $A(t);
  return EE(e);
}
function LA(t, e, n) {
  return $f(zg(t), n);
}
function zg(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Po(r);
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
    return BigInt(`0x${BA(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function kf(t, e = 8) {
  return (typeof t == "bigint" ? t : zg(t)).toString(16).padStart(e * 2, "0");
}
function $f(t, e = 16) {
  const n = kf(t, e);
  return Po(n);
}
function CA(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const TA = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function BA(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += TA[n];
  return e;
}
function Po(t) {
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
function If(t) {
  return new TextEncoder().encode(t);
}
function MA(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function NA(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function hh(t) {
  if (t.some(NA))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Lf(...t) {
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
function Hr(t) {
  return Lf(...t.map((e) => typeof e == "number" ? hh([e]) : e instanceof Array ? hh(e) : e));
}
function Rc(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var pu;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(pu || (pu = {}));
pu.Mainnet;
const PA = 128, _A = 128, Gg = 16;
var gu;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(gu || (gu = {}));
var ph;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ph || (ph = {}));
var gh;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(gh || (gh = {}));
var Jn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Jn || (Jn = {}));
const hl = ["onChainOnly", "offChainOnly", "any"];
hl[0] + "", Jn.OnChainOnly, hl[1] + "", Jn.OffChainOnly, hl[2] + "", Jn.Any, Jn.OnChainOnly + "", Jn.OnChainOnly, Jn.OffChainOnly + "", Jn.OffChainOnly, Jn.Any + "", Jn.Any;
var yu;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(yu || (yu = {}));
yu.Mainnet;
var yh;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(yh || (yh = {}));
var Is;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Is || (Is = {}));
var wh;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(wh || (wh = {}));
var bh;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(bh || (bh = {}));
var mh;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(mh || (mh = {}));
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
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Eh || (Eh = {}));
var wu;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(wu || (wu = {}));
var Ah;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ah || (Ah = {}));
var vh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(vh || (vh = {}));
function bu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function UA(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Kg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function HA(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  bu(t.outputLen), bu(t.blockLen);
}
function OA(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function DA(t, e) {
  Kg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const pl = {
  number: bu,
  bool: UA,
  bytes: Kg,
  hash: HA,
  exists: OA,
  output: DA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const gl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), cr = (t, e) => t << 32 - e | t >>> e, FA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!FA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function jA(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Vg(t) {
  if (typeof t == "string" && (t = jA(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let RA = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ui(t) {
  const e = (r) => t().update(Vg(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function zA(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Cf = class extends RA {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = gl(this.buffer);
  }
  update(e) {
    pl.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Vg(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = gl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    pl.exists(this), pl.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    zA(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = gl(e), c = this.outputLen;
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
const GA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), qg = Uint8Array.from({ length: 16 }, (t, e) => e), KA = qg.map((t) => (9 * t + 5) % 16);
let Tf = [qg], Bf = [KA];
for (let t = 0; t < 4; t++)
  for (let e of [Tf, Bf])
    e.push(e[t].map((n) => GA[n]));
const Yg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), VA = Tf.map((t, e) => t.map((n) => Yg[e][n])), qA = Bf.map((t, e) => t.map((n) => Yg[e][n])), YA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), WA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), va = (t, e) => t << e | t >>> 32 - e;
function kh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ka = new Uint32Array(16);
let XA = class extends Cf {
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
      const x = 4 - p, S = YA[p], M = WA[p], G = Tf[p], K = Bf[p], E = VA[p], U = qA[p];
      for (let _ = 0; _ < 16; _++) {
        const Q = va(r + kh(p, i, a, u) + ka[G[_]] + S, E[_]) + l | 0;
        r = l, l = u, u = va(a, 10) | 0, a = i, i = Q;
      }
      for (let _ = 0; _ < 16; _++) {
        const Q = va(s + kh(x, o, c, f) + ka[K[_]] + M, U[_]) + w | 0;
        s = w, w = f, f = va(c, 10) | 0, c = o, o = Q;
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
};
ui(() => new XA());
const ZA = (t, e, n) => t & e ^ ~t & n, QA = (t, e, n) => t & e ^ t & n ^ e & n, JA = new Uint32Array([
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
let Wg = class extends Cf {
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
      const w = os[l - 15], p = os[l - 2], x = cr(w, 7) ^ cr(w, 18) ^ w >>> 3, S = cr(p, 17) ^ cr(p, 19) ^ p >>> 10;
      os[l] = S + os[l - 7] + x + os[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const w = cr(a, 6) ^ cr(a, 11) ^ cr(a, 25), p = f + w + ZA(a, c, u) + JA[l] + os[l] | 0, S = (cr(r, 2) ^ cr(r, 13) ^ cr(r, 22)) + QA(r, s, i) | 0;
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
}, t3 = class extends Wg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
ui(() => new Wg());
ui(() => new t3());
const $a = BigInt(2 ** 32 - 1), mu = BigInt(32);
function Xg(t, e = !1) {
  return e ? { h: Number(t & $a), l: Number(t >> mu & $a) } : { h: Number(t >> mu & $a) | 0, l: Number(t & $a) | 0 };
}
function e3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Xg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const n3 = (t, e) => BigInt(t >>> 0) << mu | BigInt(e >>> 0), r3 = (t, e, n) => t >>> n, s3 = (t, e, n) => t << 32 - n | e >>> n, i3 = (t, e, n) => t >>> n | e << 32 - n, o3 = (t, e, n) => t << 32 - n | e >>> n, a3 = (t, e, n) => t << 64 - n | e >>> n - 32, c3 = (t, e, n) => t >>> n - 32 | e << 64 - n, l3 = (t, e) => e, u3 = (t, e) => t, f3 = (t, e, n) => t << n | e >>> 32 - n, d3 = (t, e, n) => e << n | t >>> 32 - n, h3 = (t, e, n) => e << n - 32 | t >>> 64 - n, p3 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function g3(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const y3 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), w3 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, b3 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), m3 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, x3 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), S3 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Ut = {
  fromBig: Xg,
  split: e3,
  toBig: n3,
  shrSH: r3,
  shrSL: s3,
  rotrSH: i3,
  rotrSL: o3,
  rotrBH: a3,
  rotrBL: c3,
  rotr32H: l3,
  rotr32L: u3,
  rotlSH: f3,
  rotlSL: d3,
  rotlBH: h3,
  rotlBL: p3,
  add: g3,
  add3L: y3,
  add3H: w3,
  add4L: b3,
  add4H: m3,
  add5H: S3,
  add5L: x3
}, [E3, A3] = Ut.split([
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
let zc = class extends Cf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: w, Gh: p, Gl: x, Hh: S, Hl: M } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, w, p, x, S, M];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, w, p, x, S, M) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = w | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = M | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      as[E] = e.getUint32(n), cs[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const U = as[E - 15] | 0, _ = cs[E - 15] | 0, Q = Ut.rotrSH(U, _, 1) ^ Ut.rotrSH(U, _, 8) ^ Ut.shrSH(U, _, 7), et = Ut.rotrSL(U, _, 1) ^ Ut.rotrSL(U, _, 8) ^ Ut.shrSL(U, _, 7), z = as[E - 2] | 0, q = cs[E - 2] | 0, $ = Ut.rotrSH(z, q, 19) ^ Ut.rotrBH(z, q, 61) ^ Ut.shrSH(z, q, 6), L = Ut.rotrSL(z, q, 19) ^ Ut.rotrBL(z, q, 61) ^ Ut.shrSL(z, q, 6), b = Ut.add4L(et, L, cs[E - 7], cs[E - 16]), T = Ut.add4H(b, Q, $, as[E - 7], as[E - 16]);
      as[E] = T | 0, cs[E] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: w, Fh: p, Fl: x, Gh: S, Gl: M, Hh: G, Hl: K } = this;
    for (let E = 0; E < 80; E++) {
      const U = Ut.rotrSH(l, w, 14) ^ Ut.rotrSH(l, w, 18) ^ Ut.rotrBH(l, w, 41), _ = Ut.rotrSL(l, w, 14) ^ Ut.rotrSL(l, w, 18) ^ Ut.rotrBL(l, w, 41), Q = l & p ^ ~l & S, et = w & x ^ ~w & M, z = Ut.add5L(K, _, et, A3[E], cs[E]), q = Ut.add5H(z, G, U, Q, E3[E], as[E]), $ = z | 0, L = Ut.rotrSH(r, s, 28) ^ Ut.rotrBH(r, s, 34) ^ Ut.rotrBH(r, s, 39), b = Ut.rotrSL(r, s, 28) ^ Ut.rotrBL(r, s, 34) ^ Ut.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, D = s & o ^ s & c ^ o & c;
      G = S | 0, K = M | 0, S = p | 0, M = x | 0, p = l | 0, x = w | 0, { h: l, l: w } = Ut.add(u | 0, f | 0, q | 0, $ | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const C = Ut.add3L($, b, D);
      r = Ut.add3H(C, q, L, T), s = C | 0;
    }
    ({ h: r, l: s } = Ut.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ut.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ut.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Ut.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: w } = Ut.add(this.Eh | 0, this.El | 0, l | 0, w | 0), { h: p, l: x } = Ut.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: M } = Ut.add(this.Gh | 0, this.Gl | 0, S | 0, M | 0), { h: G, l: K } = Ut.add(this.Hh | 0, this.Hl | 0, G | 0, K | 0), this.set(r, s, i, o, a, c, u, f, l, w, p, x, S, M, G, K);
  }
  roundClean() {
    as.fill(0), cs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, v3 = class extends zc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, k3 = class extends zc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, $3 = class extends zc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ui(() => new zc());
ui(() => new v3());
ui(() => new k3());
ui(() => new $3());
function I3(t, e, n) {
  const s = PA;
  if (z3(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: gu.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Ye;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Ye || (Ye = {}));
let L3 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Zg = class extends L3 {
  constructor(e) {
    super(e);
  }
};
function Gc(t) {
  const e = [];
  return e.push(Po(kf(t.version, 1))), e.push(Po(t.hash160)), Hr(e);
}
function C3(t) {
  const e = [];
  return e.push(t.prefix), e.push(Gc(t.address)), t.prefix === wu.Contract && e.push(_o(t.contractName)), Hr(e);
}
function _o(t) {
  const e = [], n = If(t.content), r = n.byteLength;
  return e.push(Po(kf(r, t.lengthPrefixBytes))), e.push(n), Hr(e);
}
function T3(t) {
  const e = [];
  return e.push(Gc(t.address)), e.push(_o(t.contractName)), e.push(_o(t.assetName)), Hr(e);
}
function Qg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(C3(t.principal)), (t.conditionType === Is.Fungible || t.conditionType === Is.NonFungible) && e.push(T3(t.assetInfo)), t.conditionType === Is.NonFungible && e.push(Qs(t.assetName)), e.push(t.conditionCode), t.conditionType === Is.STX || t.conditionType === Is.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Zg("The post-condition amount may not be larger than 8 bytes");
    e.push(LA(t.amount, !1, 8));
  }
  return Hr(e);
}
function Sr(t, e) {
  return Hr([t, e]);
}
function B3(t) {
  return new Uint8Array([t.type]);
}
function M3(t) {
  return t.type === Ye.OptionalNone ? new Uint8Array([t.type]) : Sr(t.type, Qs(t.value));
}
function N3(t) {
  const e = new Uint8Array(4);
  return Rc(e, t.buffer.length, 0), Sr(t.type, Lf(e, t.buffer));
}
function P3(t) {
  const e = $f(CA(t.value, BigInt(_A)), Gg);
  return Sr(t.type, e);
}
function _3(t) {
  const e = $f(t.value, Gg);
  return Sr(t.type, e);
}
function U3(t) {
  return Sr(t.type, Gc(t.address));
}
function H3(t) {
  return Sr(t.type, Lf(Gc(t.address), _o(t.contractName)));
}
function O3(t) {
  return Sr(t.type, Qs(t.value));
}
function D3(t) {
  const e = [], n = new Uint8Array(4);
  Rc(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Qs(r);
    e.push(s);
  }
  return Sr(t.type, Hr(e));
}
function F3(t) {
  const e = [], n = new Uint8Array(4);
  Rc(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = I3(s);
    e.push(_o(i));
    const o = Qs(t.data[s]);
    e.push(o);
  }
  return Sr(t.type, Hr(e));
}
function Jg(t, e) {
  const n = [], r = e == "ascii" ? MA(t.data) : If(t.data), s = new Uint8Array(4);
  return Rc(s, r.length, 0), n.push(s), n.push(r), Sr(t.type, Hr(n));
}
function j3(t) {
  return Jg(t, "ascii");
}
function R3(t) {
  return Jg(t, "utf8");
}
function Qs(t) {
  switch (t.type) {
    case Ye.BoolTrue:
    case Ye.BoolFalse:
      return B3(t);
    case Ye.OptionalNone:
    case Ye.OptionalSome:
      return M3(t);
    case Ye.Buffer:
      return N3(t);
    case Ye.UInt:
      return _3(t);
    case Ye.Int:
      return P3(t);
    case Ye.PrincipalStandard:
      return U3(t);
    case Ye.PrincipalContract:
      return H3(t);
    case Ye.ResponseOk:
    case Ye.ResponseErr:
      return O3(t);
    case Ye.List:
      return D3(t);
    case Ye.Tuple:
      return F3(t);
    case Ye.StringASCII:
      return j3(t);
    case Ye.StringUTF8:
      return R3(t);
    default:
      throw new Zg("Unable to serialize. Invalid Clarity Value.");
  }
}
const z3 = (t, e) => t ? If(t).length > e : !1, G3 = "connect-ui";
let Ga, ty, Mn = !1, xu = !1;
const Ur = (t, e = "") => () => {
}, K3 = (t, e) => () => {
}, V3 = "{visibility:hidden}.hydrated{visibility:inherit}", $h = {}, q3 = "http://www.w3.org/2000/svg", Y3 = "http://www.w3.org/1999/xhtml", W3 = (t) => t != null, Mf = (t) => (t = typeof t, t === "object" || t === "function");
function ey(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Bt = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let f = 0; f < u.length; f++)
      r = u[f], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !Mf(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Su(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((f) => u[f]).join(" "));
  }
  const c = Su(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Su = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, X3 = {}, Z3 = (t) => t && t.$tag$ === X3, Q3 = (t, e) => t != null && !Mf(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, J3 = (t) => ao(t).$hostElement$, t4 = (t, e, n) => {
  const r = an.ce(e, n);
  return t.dispatchEvent(r), r;
}, Ih = /* @__PURE__ */ new WeakMap(), e4 = (t, e, n) => {
  let r = uc.get(t);
  S4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, uc.set(t, r);
}, n4 = (t, e, n, r) => {
  var s;
  let i = ny(e);
  const o = uc.get(i);
  if (t = t.nodeType === 11 ? t : yr, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Ih.get(t), c;
      if (a || Ih.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = yr.createElement("style"), c.innerHTML = o;
          const u = (s = an.$nonce$) !== null && s !== void 0 ? s : ey(yr);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, r4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Ur("attachStyles", e.$tagName$), i = n4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, ny = (t, e) => "sc-" + t.$tagName$, Lh = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = Th(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = Ch(n), f = Ch(r);
      c.remove(...u.filter((l) => l && !f.includes(l))), c.add(...f.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Th(Kc, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && an.rel(t, e, n, !1), r && an.ael(t, e, r, !1);
    else {
      const c = Mf(r);
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
}, s4 = /\s/, Ch = (t) => t ? t.split(s4) : [], ry = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || $h, o = e.$attrs$ || $h;
  for (r in i)
    r in o || Lh(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    Lh(s, r, i[r], o[r], n, e.$flags$);
}, Nf = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = yr.createTextNode(s.$text$);
  else {
    if (Mn || (Mn = s.$tag$ === "svg"), o = s.$elm$ = yr.createElementNS(Mn ? q3 : Y3, s.$tag$), Mn && s.$tag$ === "foreignObject" && (Mn = !1), ry(null, s, Mn), W3(Ga) && o["s-si"] !== Ga && o.classList.add(o["s-si"] = Ga), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = Nf(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Mn = !1 : o.tagName === "foreignObject" && (Mn = !0);
  }
  return o;
}, sy = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === ty && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = Nf(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, iy = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, i4 = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, f = r[0], l = r[u], w;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : f == null ? f = r[++i] : l == null ? l = r[--u] : Ia(a, f) ? (Eo(a, f), a = e[++s], f = r[++i]) : Ia(c, l) ? (Eo(c, l), c = e[--o], l = r[--u]) : Ia(a, l) ? (Eo(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : Ia(c, f) ? (Eo(c, f), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], f = r[++i]) : (w = Nf(e && e[i], n, i), f = r[++i], w && a.$elm$.parentNode.insertBefore(w, a.$elm$));
  s > o ? sy(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && iy(e, s, o);
}, Ia = (t, e) => t.$tag$ === e.$tag$, Eo = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (Mn = i === "svg" ? !0 : i === "foreignObject" ? !1 : Mn, ry(t, e, Mn), r !== null && s !== null ? i4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), sy(n, null, e, s, 0, s.length - 1)) : r !== null && iy(r, 0, r.length - 1), Mn && i === "svg" && (Mn = !1)) : t.$text$ !== o && (n.data = o);
}, o4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Su(null, null), s = Z3(e) ? e : Bt(null, null, e);
  ty = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, Ga = n["s-sc"], Eo(r, s);
}, oy = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Pf = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return oy(t, t.$ancestorComponent$), A4(() => a4(t, e));
}, a4 = (t, e) => {
  const n = Ur("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), f4(s, () => c4(t, r, e));
}, c4 = async (t, e, n) => {
  const r = t.$hostElement$, s = Ur("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && r4(t);
  const o = Ur("render", t.$cmpMeta$.$tagName$);
  l4(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => u4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, l4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, o4(t, e);
  } catch (r) {
    Uo(r, t.$hostElement$);
  }
  return null;
}, u4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Ur("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, cy(n), r(), t.$onReadyResolve$(n), s || ay()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Uf(() => Pf(t, !1)), t.$flags$ &= -517;
}, ay = (t) => {
  cy(yr.documentElement), Uf(() => t4(Kc, "appload", { detail: { namespace: G3 } }));
}, f4 = (t, e) => t && t.then ? t.then(e) : e(), cy = (t) => t.classList.add("hydrated"), d4 = (t, e) => ao(t).$instanceValues$.get(e), h4 = (t, e, n, r) => {
  const s = ao(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = Q3(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && Pf(s, !1));
}, ly = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return d4(this, i);
        },
        set(a) {
          h4(this, i, a, e);
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
}, p4 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = x4(n), s.then) {
        const c = K3();
        s = await s, c();
      }
      s.isProxied || (ly(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Ur("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        Uo(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = ny(n);
      if (!uc.has(c)) {
        const u = Ur("registerStyles", n.$tagName$);
        e4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => Pf(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, g4 = (t) => {
  if (!(an.$flags$ & 1)) {
    const e = ao(t), n = e.$cmpMeta$, r = Ur("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            oy(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), p4(t, e, n);
    }
    r();
  }
}, y4 = (t) => {
  an.$flags$ & 1 || ao(t);
}, w4 = (t, e = {}) => {
  var n;
  const r = Ur(), s = [], i = e.exclude || [], o = Kc.customElements, a = yr.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ yr.createElement("style"), f = [];
  let l, w = !0;
  Object.assign(an, e), an.$resourcesUrl$ = new URL(e.resourcesUrl || "./", yr.baseURI).href, t.map((p) => {
    p[1].map((x) => {
      const S = {
        $flags$: x[0],
        $tagName$: x[1],
        $members$: x[2],
        $listeners$: x[3]
      };
      S.$members$ = x[2];
      const M = S.$tagName$, G = class extends HTMLElement {
        // StencilLazyHost
        constructor(K) {
          super(K), K = this, m4(K, S), S.$flags$ & 1 && K.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), w ? f.push(this) : an.jmp(() => g4(this));
        }
        disconnectedCallback() {
          an.jmp(() => y4(this));
        }
        componentOnReady() {
          return ao(this).$onReadyPromise$;
        }
      };
      S.$lazyBundleId$ = p[0], !i.includes(M) && !o.get(M) && (s.push(M), o.define(M, ly(
        G,
        S,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + V3, u.setAttribute("data-styles", "");
    const p = (n = an.$nonce$) !== null && n !== void 0 ? n : ey(yr);
    p != null && u.setAttribute("nonce", p), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  w = !1, f.length ? f.map((p) => p.connectedCallback()) : an.jmp(() => l = setTimeout(ay, 30)), r();
}, _f = /* @__PURE__ */ new WeakMap(), ao = (t) => _f.get(t), b4 = (t, e) => _f.set(e.$lazyInstance$ = t, e), m4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], _f.set(t, n);
}, Th = (t, e) => e in t, Uo = (t, e) => (0, console.error)(t, e), yl = /* @__PURE__ */ new Map(), x4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = yl.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (yl.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => c$).then(o, Uo);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (yl.set(s, o), o[r]), Uo);
}, uc = /* @__PURE__ */ new Map(), Kc = typeof window < "u" ? window : {}, yr = Kc.document || { head: {} }, an = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, uy = (t) => Promise.resolve(t), S4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Bh = [], fy = [], E4 = (t, e) => (n) => {
  t.push(n), xu || (xu = !0, an.$flags$ & 4 ? Uf(Eu) : an.raf(Eu));
}, Mh = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Uo(n);
    }
  t.length = 0;
}, Eu = () => {
  Mh(Bh), Mh(fy), (xu = Bh.length > 0) && an.raf(Eu);
}, Uf = (t) => uy().then(t), A4 = /* @__PURE__ */ E4(fy), v4 = () => uy(), k4 = (t, e) => typeof window > "u" ? Promise.resolve() : v4().then(() => w4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var $4 = Object.defineProperty, I4 = Object.defineProperties, L4 = Object.getOwnPropertyDescriptors, fc = Object.getOwnPropertySymbols, dy = Object.prototype.hasOwnProperty, hy = Object.prototype.propertyIsEnumerable, Nh = (t, e, n) => e in t ? $4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, On = (t, e) => {
  for (var n in e || (e = {})) dy.call(e, n) && Nh(t, n, e[n]);
  if (fc) for (var n of fc(e)) hy.call(e, n) && Nh(t, n, e[n]);
  return t;
}, sr = (t, e) => I4(t, L4(e)), py = (t, e) => {
  var n = {};
  for (var r in t) dy.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && fc) for (var r of fc(t)) e.indexOf(r) < 0 && hy.call(t, r) && (n[r] = t[r]);
  return n;
};
function gy() {
  return Oc(Vs()) || window.StacksProvider || window.BlockstackProvider;
}
function Vc(t) {
  return t ? typeof t == "string" ? Ys.fromName(t) : "version" in t ? t : "url" in t ? new Xl({ url: t.url }) : t.transactionVersion === Xs.Mainnet ? new Xl({ url: t.client.baseUrl }) : new Zl({ url: t.client.baseUrl }) : new Zl();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var C4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(C4 || {}), T4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(T4 || {}), Hf = (t) => {
  let e = t;
  if (!e) {
    let n = new V0(["store_write"], document.location.href);
    e = new Wl({ appConfig: n });
  }
  return e;
};
function yy(t) {
  try {
    return Hf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var wy = (t) => {
  let e = Hf(t).loadUserData().appPrivateKey, n = Je.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function B4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [Ws.Mainnet]: "mainnet", [Ws.Testnet]: "testnet" }, a = Vc(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function M4(t) {
  let e = Vc(t.network), n = Hf(t.userSession), r = sr(On({}, t), { network: e, userSession: n });
  return On({ stxAddress: B4(r) }, r);
}
async function N4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Rg) : n = n.map((r) => yt(Qg(r)))), new Je.TokenSigner("ES256k", e).signAsync(sr(On({}, t), { postConditions: n }));
}
function P4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(Rg) : e = e.map((n) => yt(Qg(n)))), Je.createUnsecuredToken(sr(On({}, t), { postConditions: e }));
}
var _4 = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Wt(a.replace(/^0x/, "")), u = kA(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, sr(On({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, sr(On({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, U4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = py(e, ["amount", "appDetails", "userSession"]);
  if (yy(s)) {
    let { privateKey: a, publicKey: c } = wy(s), u = sr(On({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), N4(u, a);
  }
  let o = sr(On({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), P4(o);
};
async function H4(t, e, n) {
  let r = await e(sr(On(On({}, M4(t)), t), { network: Vc(t.network) }));
  return _4({ token: r, options: t }, n);
}
function O4(t, e = gy()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return H4(t, U4, e);
}
function by(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? sr(On({}, t), { message: ah(e), domain: ah(n) }) : sr(On({}, t), { message: yt(Qs(e)), domain: yt(Qs(n)) });
}
async function D4(t, e) {
  return new Je.TokenSigner("ES256k", e).signAsync(by(t));
}
async function F4(t) {
  let e = t, { userSession: n } = e, r = py(e, ["userSession"]);
  if (yy(n)) {
    let { privateKey: s, publicKey: i } = wy(n), o = sr(On({}, r), { publicKey: i });
    return D4(o, s);
  }
  return Je.createUnsecuredToken(by(t));
}
var j4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(j4 || {}), my = "asigna-stx", Ph = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === my && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(z4(t, e), "*");
}), R4 = { authenticationRequest: async (t) => Ph(t, "authenticationRequest"), transactionRequest: async (t) => Ph(t, "transactionRequest") }, z4 = (t, e) => ({ source: my, [e]: t }), G4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = R4);
};
G4();
var K4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function V4(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = Vs(), o = gy();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    k4();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : K4, c = Hx(a), u = document.createElement("connect-modal");
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
var La = V4(O4);
function Es(t, e, n) {
  return Of(bn(t, e), n);
}
function bn(t, e) {
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
      const r = W4(BigInt(`0x${jt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${jt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function _h(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Wo(t, e = 8) {
  return (typeof t == "bigint" ? t : bn(t, !1)).toString(16).padStart(e * 2, "0");
}
function qc(t) {
  return parseInt(t, 16);
}
function Of(t, e = 16) {
  const n = Wo(t, e);
  return xe(n);
}
function q4(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Y4(t, e) {
  return t & BigInt(1) << e;
}
function W4(t, e) {
  return Y4(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const X4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function jt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += X4[n];
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
function co(t) {
  return new TextEncoder().encode(t);
}
function Df(t) {
  return new TextDecoder().decode(t);
}
function xy(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Z4(t) {
  return String.fromCharCode.apply(null, t);
}
function Q4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Uh(t) {
  if (t.some(Q4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Yc(...t) {
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
  return Yc(...t.map((e) => typeof e == "number" ? Uh([e]) : e instanceof Array ? Uh(e) : e));
}
var Hh;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Hh || (Hh = {}));
var Oh;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Oh || (Oh = {}));
var Dh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Dh || (Dh = {}));
const Sy = 33, wl = 32;
function J4(t) {
  if (t.length < wl * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + wl * 2), r = t.slice(2 + wl * 2);
  return {
    recoveryId: qc(e),
    r: n,
    s: r
  };
}
function tv(t) {
  const e = typeof t == "string" ? xe(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function ev(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function nv(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function rv(t, e) {
  return t[e];
}
function sv(t, e, n = 0) {
  return t[n] = e, t;
}
function iv(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Js(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Au;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Au || (Au = {}));
const ov = Au.Mainnet, av = 128, cv = 128, Ey = 16, Hs = 32, vu = 80, Wc = 65, lv = 32, uv = 64, dc = 34;
var dt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(dt || (dt = {}));
var Dt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Dt || (Dt = {}));
var ku;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(ku || (ku = {}));
var An;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(An || (An = {}));
const Ka = ["onChainOnly", "offChainOnly", "any"], Fh = {
  [Ka[0]]: An.OnChainOnly,
  [Ka[1]]: An.OffChainOnly,
  [Ka[2]]: An.Any,
  [An.OnChainOnly]: An.OnChainOnly,
  [An.OffChainOnly]: An.OffChainOnly,
  [An.Any]: An.Any
};
function fv(t) {
  if (t in Fh)
    return Fh[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${Ka.join(", ")}`);
}
var hc;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(hc || (hc = {}));
hc.Mainnet;
var Qi;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Qi || (Qi = {}));
var vn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(vn || (vn = {}));
var Be;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Be || (Be = {}));
var le;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(le || (le = {}));
var pc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(pc || (pc = {}));
var Ie;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ie || (Ie = {}));
var Ho;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ho || (Ho = {}));
var $u;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})($u || ($u = {}));
var Oo;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Oo || (Oo = {}));
var jh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(jh || (jh = {}));
var Rh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Rh || (Rh = {}));
function Iu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function dv(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Ay(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function hv(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Iu(t.outputLen), Iu(t.blockLen);
}
function pv(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function gv(t, e) {
  Ay(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ns = {
  number: Iu,
  bool: dv,
  bytes: Ay,
  hash: hv,
  exists: pv,
  output: gv
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const bl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), lr = (t, e) => t << 32 - e | t >>> e, yv = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!yv)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function wv(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ff(t) {
  if (typeof t == "string" && (t = wv(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class vy {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function fi(t) {
  const e = (r) => t().update(Ff(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function bv(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class jf extends vy {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = bl(this.buffer);
  }
  update(e) {
    Ns.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ff(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = bl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ns.exists(this), Ns.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    bv(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = bl(e), c = this.outputLen;
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
const mv = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ky = Uint8Array.from({ length: 16 }, (t, e) => e), xv = ky.map((t) => (9 * t + 5) % 16);
let Rf = [ky], zf = [xv];
for (let t = 0; t < 4; t++)
  for (let e of [Rf, zf])
    e.push(e[t].map((n) => mv[n]));
const $y = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Sv = Rf.map((t, e) => t.map((n) => $y[e][n])), Ev = zf.map((t, e) => t.map((n) => $y[e][n])), Av = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), vv = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ca = (t, e) => t << e | t >>> 32 - e;
function zh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ta = new Uint32Array(16);
class kv extends jf {
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
      Ta[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, w = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, S = Av[p], M = vv[p], G = Rf[p], K = zf[p], E = Sv[p], U = Ev[p];
      for (let _ = 0; _ < 16; _++) {
        const Q = Ca(r + zh(p, i, a, u) + Ta[G[_]] + S, E[_]) + l | 0;
        r = l, l = u, u = Ca(a, 10) | 0, a = i, i = Q;
      }
      for (let _ = 0; _ < 16; _++) {
        const Q = Ca(s + zh(x, o, c, f) + Ta[K[_]] + M, U[_]) + w | 0;
        s = w, w = f, f = Ca(c, 10) | 0, c = o, o = Q;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + w | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ta.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const $v = fi(() => new kv()), Iv = (t, e, n) => t & e ^ ~t & n, Lv = (t, e, n) => t & e ^ t & n ^ e & n, Cv = new Uint32Array([
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
class Iy extends jf {
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
      const w = us[l - 15], p = us[l - 2], x = lr(w, 7) ^ lr(w, 18) ^ w >>> 3, S = lr(p, 17) ^ lr(p, 19) ^ p >>> 10;
      us[l] = S + us[l - 7] + x + us[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const w = lr(a, 6) ^ lr(a, 11) ^ lr(a, 25), p = f + w + Iv(a, c, u) + Cv[l] + us[l] | 0, S = (lr(r, 2) ^ lr(r, 13) ^ lr(r, 22)) + Lv(r, s, i) | 0;
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
}
class Tv extends Iy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Gf = fi(() => new Iy());
fi(() => new Tv());
const Ba = BigInt(2 ** 32 - 1), Lu = BigInt(32);
function Ly(t, e = !1) {
  return e ? { h: Number(t & Ba), l: Number(t >> Lu & Ba) } : { h: Number(t >> Lu & Ba) | 0, l: Number(t & Ba) | 0 };
}
function Bv(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Ly(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Mv = (t, e) => BigInt(t >>> 0) << Lu | BigInt(e >>> 0), Nv = (t, e, n) => t >>> n, Pv = (t, e, n) => t << 32 - n | e >>> n, _v = (t, e, n) => t >>> n | e << 32 - n, Uv = (t, e, n) => t << 32 - n | e >>> n, Hv = (t, e, n) => t << 64 - n | e >>> n - 32, Ov = (t, e, n) => t >>> n - 32 | e << 64 - n, Dv = (t, e) => e, Fv = (t, e) => t, jv = (t, e, n) => t << n | e >>> 32 - n, Rv = (t, e, n) => e << n | t >>> 32 - n, zv = (t, e, n) => e << n - 32 | t >>> 64 - n, Gv = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Kv(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Vv = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), qv = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Yv = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Wv = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Xv = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Zv = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Ht = {
  fromBig: Ly,
  split: Bv,
  toBig: Mv,
  shrSH: Nv,
  shrSL: Pv,
  rotrSH: _v,
  rotrSL: Uv,
  rotrBH: Hv,
  rotrBL: Ov,
  rotr32H: Dv,
  rotr32L: Fv,
  rotlSH: jv,
  rotlSL: Rv,
  rotlBH: zv,
  rotlBL: Gv,
  add: Kv,
  add3L: Vv,
  add3H: qv,
  add4L: Yv,
  add4H: Wv,
  add5H: Zv,
  add5L: Xv
}, [Qv, Jv] = Ht.split([
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
class Xc extends jf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: w, Gh: p, Gl: x, Hh: S, Hl: M } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, w, p, x, S, M];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, w, p, x, S, M) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = w | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = M | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      fs[E] = e.getUint32(n), ds[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const U = fs[E - 15] | 0, _ = ds[E - 15] | 0, Q = Ht.rotrSH(U, _, 1) ^ Ht.rotrSH(U, _, 8) ^ Ht.shrSH(U, _, 7), et = Ht.rotrSL(U, _, 1) ^ Ht.rotrSL(U, _, 8) ^ Ht.shrSL(U, _, 7), z = fs[E - 2] | 0, q = ds[E - 2] | 0, $ = Ht.rotrSH(z, q, 19) ^ Ht.rotrBH(z, q, 61) ^ Ht.shrSH(z, q, 6), L = Ht.rotrSL(z, q, 19) ^ Ht.rotrBL(z, q, 61) ^ Ht.shrSL(z, q, 6), b = Ht.add4L(et, L, ds[E - 7], ds[E - 16]), T = Ht.add4H(b, Q, $, fs[E - 7], fs[E - 16]);
      fs[E] = T | 0, ds[E] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: w, Fh: p, Fl: x, Gh: S, Gl: M, Hh: G, Hl: K } = this;
    for (let E = 0; E < 80; E++) {
      const U = Ht.rotrSH(l, w, 14) ^ Ht.rotrSH(l, w, 18) ^ Ht.rotrBH(l, w, 41), _ = Ht.rotrSL(l, w, 14) ^ Ht.rotrSL(l, w, 18) ^ Ht.rotrBL(l, w, 41), Q = l & p ^ ~l & S, et = w & x ^ ~w & M, z = Ht.add5L(K, _, et, Jv[E], ds[E]), q = Ht.add5H(z, G, U, Q, Qv[E], fs[E]), $ = z | 0, L = Ht.rotrSH(r, s, 28) ^ Ht.rotrBH(r, s, 34) ^ Ht.rotrBH(r, s, 39), b = Ht.rotrSL(r, s, 28) ^ Ht.rotrBL(r, s, 34) ^ Ht.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, D = s & o ^ s & c ^ o & c;
      G = S | 0, K = M | 0, S = p | 0, M = x | 0, p = l | 0, x = w | 0, { h: l, l: w } = Ht.add(u | 0, f | 0, q | 0, $ | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const C = Ht.add3L($, b, D);
      r = Ht.add3H(C, q, L, T), s = C | 0;
    }
    ({ h: r, l: s } = Ht.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ht.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ht.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Ht.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: w } = Ht.add(this.Eh | 0, this.El | 0, l | 0, w | 0), { h: p, l: x } = Ht.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: M } = Ht.add(this.Gh | 0, this.Gl | 0, S | 0, M | 0), { h: G, l: K } = Ht.add(this.Hh | 0, this.Hl | 0, G | 0, K | 0), this.set(r, s, i, o, a, c, u, f, l, w, p, x, S, M, G, K);
  }
  roundClean() {
    fs.fill(0), ds.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class t8 extends Xc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class e8 extends Xc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class n8 extends Xc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
fi(() => new Xc());
fi(() => new t8());
const r8 = fi(() => new e8());
fi(() => new n8());
function Cy(t) {
  if (xe(t).byteLength != Wc)
    throw Error("Invalid signature");
  return {
    type: dt.MessageSignature,
    data: t
  };
}
function Ao(t, e) {
  return { type: dt.Address, version: t, hash160: e };
}
function Pi(t) {
  return ci.c32address(t.version, t.hash160);
}
function ti(t, e, n) {
  const r = e || 1, s = n || av;
  if (Vy(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: dt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Kf(t) {
  const e = ci.c32addressDecode(t);
  return {
    type: dt.Address,
    version: e[0],
    hash160: e[1]
  };
}
var X;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(X || (X = {}));
function s8(t) {
  if (t.type === X.PrincipalStandard)
    return Pi(t.address);
  if (t.type === X.PrincipalContract)
    return `${Pi(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Ty(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return a8(e, n);
  } else
    return i8(t);
}
function i8(t) {
  const e = Kf(t);
  return { type: X.PrincipalStandard, address: e };
}
function o8(t) {
  return { type: X.PrincipalStandard, address: t };
}
function a8(t, e) {
  const n = Kf(t), r = ti(e);
  return By(n, r);
}
function By(t, e) {
  if (co(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: X.PrincipalContract, address: t, contractName: e };
}
function ml(t, e = !1) {
  switch (t.type) {
    case X.BoolTrue:
      return !0;
    case X.BoolFalse:
      return !1;
    case X.Int:
    case X.UInt:
      return e ? t.value.toString() : t.value;
    case X.Buffer:
      return `0x${jt(t.buffer)}`;
    case X.OptionalNone:
      return null;
    case X.OptionalSome:
      return hr(t.value);
    case X.ResponseErr:
      return hr(t.value);
    case X.ResponseOk:
      return hr(t.value);
    case X.PrincipalStandard:
    case X.PrincipalContract:
      return s8(t);
    case X.List:
      return t.list.map((r) => hr(r));
    case X.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = hr(t.data[r]);
      }), n;
    case X.StringASCII:
      return t.data;
    case X.StringUTF8:
      return t.data;
  }
}
function hr(t) {
  switch (t.type) {
    case X.ResponseErr:
      return { type: gs(t), value: ml(t, !0), success: !1 };
    case X.ResponseOk:
      return { type: gs(t), value: ml(t, !0), success: !0 };
    default:
      return { type: gs(t), value: ml(t, !0) };
  }
}
function gs(t) {
  switch (t.type) {
    case X.BoolTrue:
    case X.BoolFalse:
      return "bool";
    case X.Int:
      return "int";
    case X.UInt:
      return "uint";
    case X.Buffer:
      return `(buff ${t.buffer.length})`;
    case X.OptionalNone:
      return "(optional none)";
    case X.OptionalSome:
      return `(optional ${gs(t.value)})`;
    case X.ResponseErr:
      return `(response UnknownType ${gs(t.value)})`;
    case X.ResponseOk:
      return `(response ${gs(t.value)} UnknownType)`;
    case X.PrincipalStandard:
    case X.PrincipalContract:
      return "principal";
    case X.List:
      return `(list ${t.list.length} ${t.list.length ? gs(t.list[0]) : "UnknownType"})`;
    case X.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${gs(t.data[e])})`).join(" ")})`;
    case X.StringASCII:
      return `(string-ascii ${xy(t.data).length})`;
    case X.StringUTF8:
      return `(string-utf8 ${co(t.data).length})`;
  }
}
const My = () => ({ type: X.BoolTrue }), Ny = () => ({ type: X.BoolFalse }), c8 = (t) => t ? My() : Ny(), Gh = BigInt("0xffffffffffffffffffffffffffffffff"), l8 = BigInt(0), Kh = BigInt("0x7fffffffffffffffffffffffffffffff"), Vh = BigInt("-170141183460469231731687303715884105728"), u8 = (t) => {
  const e = bn(t, !0);
  if (e > Kh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Kh}`);
  if (e < Vh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Vh}`);
  return { type: X.Int, value: e };
}, wr = (t) => {
  const e = bn(t, !1);
  if (e < l8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Gh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Gh}`);
  return { type: X.UInt, value: e };
}, Py = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: X.Buffer, buffer: t };
};
function _y() {
  return { type: X.OptionalNone };
}
function Uy(t) {
  return { type: X.OptionalSome, value: t };
}
function f8(t) {
  return { type: X.ResponseErr, value: t };
}
function d8(t) {
  return { type: X.ResponseOk, value: t };
}
function h8(t) {
  return { type: X.List, list: t };
}
function ei(t) {
  for (const e in t)
    if (!nk(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: X.Tuple, data: t };
}
const Qe = (t) => ({ type: X.StringASCII, data: t }), p8 = (t) => ({ type: X.StringUTF8, data: t });
class Hy extends vy {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ns.hash(e);
    const r = Ff(n);
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
    return Ns.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ns.exists(this), Ns.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Oy = (t, e, n) => new Hy(t, e).update(n).digest();
Oy.create = (t, e) => new Hy(t, e);
Me.hmacSha256Sync = (t, ...e) => {
  const n = Oy.create(Gf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Ji(t) {
  return {
    type: dt.PublicKey,
    data: xe(t)
  };
}
function g8(t, e, n = Ie.Compressed) {
  const r = J4(e.data), s = new Un(_h(r.r), _h(r.s)), i = Ft.fromSignature(t, s, r.recoveryId), o = n === Ie.Compressed;
  return i.toHex(o);
}
function y8(t) {
  return { type: dt.PublicKey, data: t };
}
function lo(t) {
  return !jt(t.data).startsWith("04");
}
function gc(t) {
  return t.data.slice();
}
function w8(t) {
  const e = x8(t), n = Go(e.data.slice(0, 32), e.compressed);
  return Ji(jt(n));
}
function b8(t) {
  const e = typeof t == "string" ? t : jt(t), n = Ft.fromHex(e).toHex(!0);
  return Ji(n);
}
function m8(t) {
  const e = typeof t == "string" ? t : jt(t), n = Ft.fromHex(e).toHex(!1);
  return Ji(n);
}
function Cu(t) {
  const e = t.readUInt8(), n = e === 4 ? uv : lv;
  return y8(_e([e, t.readBytes(n)]));
}
function x8(t) {
  const e = tv(t), n = e.length == Sy;
  return { data: e, compressed: n };
}
function S8(t, e) {
  const [n, r] = Lc(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Wo(r, 1) + Un.fromHex(n).toCompactHex();
  return Cy(i);
}
function E8(t) {
  return w8(t.data);
}
function A8(t, e, n) {
  return typeof t == "string" && (t = Ty(t)), typeof n == "string" && (n = Wh(n)), {
    type: dt.Payload,
    payloadType: Dt.TokenTransfer,
    recipient: t,
    amount: bn(e, !1),
    memo: n ?? Wh("")
  };
}
function v8(t, e, n, r) {
  return typeof t == "string" && (t = Kf(t)), typeof e == "string" && (e = ti(e)), typeof n == "string" && (n = ti(n)), {
    type: dt.Payload,
    payloadType: Dt.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function qh(t, e, n) {
  return typeof t == "string" && (t = ti(t)), typeof e == "string" && (e = N8(e)), typeof n == "number" ? {
    type: dt.Payload,
    payloadType: Dt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: dt.Payload,
    payloadType: Dt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function k8() {
  return { type: dt.Payload, payloadType: Dt.PoisonMicroblock };
}
function Yh(t, e) {
  if (t.byteLength != Hs)
    throw Error(`Coinbase buffer size must be ${Hs} bytes`);
  return e != null ? {
    type: dt.Payload,
    payloadType: Dt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: dt.Payload,
    payloadType: Dt.Coinbase,
    coinbaseBytes: t
  };
}
function $8(t, e, n) {
  if (t.byteLength != Hs)
    throw Error(`Coinbase buffer size must be ${Hs} bytes`);
  if (n.byteLength != vu)
    throw Error(`VRF proof buffer size must be ${vu} bytes`);
  return {
    type: dt.Payload,
    payloadType: Dt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === X.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Tu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Tu || (Tu = {}));
function I8(t, e, n, r, s, i, o) {
  return {
    type: dt.Payload,
    payloadType: Dt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Dy(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Dt.TokenTransfer:
      e.push(Ne(t.recipient)), e.push(Es(t.amount, !1, 8)), e.push(Tr(t.memo));
      break;
    case Dt.ContractCall:
      e.push(Tr(t.contractAddress)), e.push(Tr(t.contractName)), e.push(Tr(t.functionName));
      const n = new Uint8Array(4);
      Js(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Ne(r));
      });
      break;
    case Dt.SmartContract:
      e.push(Tr(t.contractName)), e.push(Tr(t.codeBody));
      break;
    case Dt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Tr(t.contractName)), e.push(Tr(t.codeBody));
      break;
    case Dt.PoisonMicroblock:
      break;
    case Dt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Dt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Ne(t.recipient));
      break;
    case Dt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Ne(t.recipient ? Uy(t.recipient) : _y())), e.push(t.vrfProof);
      break;
    case Dt.TenureChange:
      e.push(xe(t.tenureHash)), e.push(xe(t.previousTenureHash)), e.push(xe(t.burnViewHash)), e.push(xe(t.previousTenureEnd)), e.push(Js(new Uint8Array(4), t.previousTenureBlocks)), e.push(sv(new Uint8Array(1), t.cause)), e.push(xe(t.publicKeyHash));
      break;
  }
  return _e(e);
}
function L8(t) {
  switch (t.readUInt8Enum(Dt, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Dt.TokenTransfer:
      const n = Wn(t), r = bn(t.readBytes(8), !1), s = jy(t);
      return A8(n, r, s);
    case Dt.ContractCall:
      const i = to(t), o = Yn(t), a = Yn(t), c = [], u = t.readUInt32BE();
      for (let E = 0; E < u; E++) {
        const U = Wn(t);
        c.push(U);
      }
      return v8(i, o, a, c);
    case Dt.SmartContract:
      const f = Yn(t), l = Yn(t, 4, 1e5);
      return qh(f, l);
    case Dt.VersionedSmartContract: {
      const E = t.readUInt8Enum(ku, (Q) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Q}`);
      }), U = Yn(t), _ = Yn(t, 4, 1e5);
      return qh(U, _, E);
    }
    case Dt.PoisonMicroblock:
      return k8();
    case Dt.Coinbase: {
      const E = t.readBytes(Hs);
      return Yh(E);
    }
    case Dt.CoinbaseToAltRecipient: {
      const E = t.readBytes(Hs), U = Wn(t);
      return Yh(E, U);
    }
    case Dt.NakamotoCoinbase: {
      const E = t.readBytes(Hs), U = Wn(t), _ = t.readBytes(vu);
      return $8(E, U, _);
    }
    case Dt.TenureChange:
      const w = jt(t.readBytes(20)), p = jt(t.readBytes(20)), x = jt(t.readBytes(20)), S = jt(t.readBytes(32)), M = t.readUInt32BE(), G = t.readUInt8Enum(Tu, (E) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${E}`);
      }), K = jt(t.readBytes(20));
      return I8(w, p, x, S, M, G, K);
  }
}
class Zc extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Ls extends Zc {
  constructor(e) {
    super(e);
  }
}
class _n extends Zc {
  constructor(e) {
    super(e);
  }
}
class yc extends Zc {
  constructor(e) {
    super(e);
  }
}
class Ps extends Zc {
  constructor(e) {
    super(e);
  }
}
var er;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(er || (er = {}));
function Bu(t) {
  return Cy(jt(t.readBytes(Wc)));
}
function _i(t, e) {
  return {
    pubKeyEncoding: t,
    type: dt.TransactionAuthField,
    contents: e
  };
}
function C8(t) {
  const e = t.readUInt8Enum(er, (n) => {
    throw new _n(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case er.PublicKeyCompressed:
      return _i(Ie.Compressed, Cu(t));
    case er.PublicKeyUncompressed:
      return _i(Ie.Uncompressed, m8(Cu(t).data));
    case er.SignatureCompressed:
      return _i(Ie.Compressed, Bu(t));
    case er.SignatureUncompressed:
      return _i(Ie.Uncompressed, Bu(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function Vf(t) {
  return xe(t.data);
}
function T8(t) {
  const e = [];
  switch (t.contents.type) {
    case dt.PublicKey:
      e.push(t.pubKeyEncoding === Ie.Compressed ? er.PublicKeyCompressed : er.PublicKeyUncompressed), e.push(gc(b8(t.contents.data)));
      break;
    case dt.MessageSignature:
      e.push(t.pubKeyEncoding === Ie.Compressed ? er.SignatureCompressed : er.SignatureUncompressed), e.push(Vf(t.contents));
      break;
  }
  return _e(e);
}
function Tr(t) {
  switch (t.type) {
    case dt.Address:
      return Xo(t);
    case dt.Principal:
      return Fy(t);
    case dt.LengthPrefixedString:
      return eo(t);
    case dt.MemoString:
      return P8(t);
    case dt.AssetInfo:
      return Ry(t);
    case dt.PostCondition:
      return _8(t);
    case dt.PublicKey:
      return gc(t);
    case dt.LengthPrefixedList:
      return Wf(t);
    case dt.Payload:
      return Dy(t);
    case dt.TransactionAuthField:
      return T8(t);
    case dt.MessageSignature:
      return Vf(t);
  }
}
function B8() {
  return {
    type: dt.Address,
    version: pc.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function qf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === le.SerializeP2PKH || e === le.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === le.SerializeP2WPKH || e === le.SerializeP2WSH || e === le.SerializeP2WSHNonSequential) && !r.every(lo))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case le.SerializeP2PKH:
      return Ao(t, Q8(r[0].data));
    case le.SerializeP2WPKH:
      return Ao(t, J8(r[0].data));
    case le.SerializeP2SH:
    case le.SerializeP2SHNonSequential:
      return Ao(t, tk(n, r.map(gc)));
    case le.SerializeP2WSH:
    case le.SerializeP2WSHNonSequential:
      return Ao(t, ek(n, r.map(gc)));
  }
}
function Xo(t) {
  const e = [];
  return e.push(xe(Wo(t.version, 1))), e.push(xe(t.hash160)), _e(e);
}
function to(t) {
  const e = qc(jt(t.readBytes(1))), n = jt(t.readBytes(20));
  return { type: dt.Address, version: e, hash160: n };
}
function Fy(t) {
  const e = [];
  return e.push(t.prefix), e.push(Xo(t.address)), t.prefix === Oo.Contract && e.push(eo(t.contractName)), _e(e);
}
function M8(t) {
  const e = t.readUInt8Enum(Oo, (s) => {
    throw new _n(`Unexpected Principal payload type: ${s}`);
  }), n = to(t);
  if (e === Oo.Standard)
    return { type: dt.Principal, prefix: e, address: n };
  const r = Yn(t);
  return {
    type: dt.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function eo(t) {
  const e = [], n = co(t.content), r = n.byteLength;
  return e.push(xe(Wo(r, t.lengthPrefixBytes))), e.push(n), _e(e);
}
function Yn(t, e, n) {
  e = e || 1;
  const r = qc(jt(t.readBytes(e))), s = Df(t.readBytes(r));
  return ti(s, e, n ?? 128);
}
function N8(t) {
  return ti(t, 4, 1e5);
}
function Wh(t) {
  if (t && Vy(t, dc))
    throw new Error(`Memo exceeds maximum length of ${dc} bytes`);
  return { type: dt.MemoString, content: t };
}
function P8(t) {
  const e = [], n = co(t.content), r = Z8(jt(n), dc * 2);
  return e.push(xe(r)), _e(e);
}
function jy(t) {
  let e = Df(t.readBytes(dc));
  return e = e.replace(/\u0000*$/, ""), { type: dt.MemoString, content: e };
}
function Ry(t) {
  const e = [];
  return e.push(Xo(t.address)), e.push(eo(t.contractName)), e.push(eo(t.assetName)), _e(e);
}
function Mu(t) {
  return {
    type: dt.AssetInfo,
    address: to(t),
    contractName: Yn(t),
    assetName: Yn(t)
  };
}
function Yf(t, e) {
  return {
    type: dt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Wf(t) {
  const e = t.values, n = [];
  n.push(xe(Wo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Tr(r));
  return _e(n);
}
function zy(t, e, n) {
  const r = qc(jt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case dt.Address:
        s.push(to(t));
        break;
      case dt.LengthPrefixedString:
        s.push(Yn(t));
        break;
      case dt.MemoString:
        s.push(jy(t));
        break;
      case dt.AssetInfo:
        s.push(Mu(t));
        break;
      case dt.PostCondition:
        s.push(U8(t));
        break;
      case dt.PublicKey:
        s.push(Cu(t));
        break;
      case dt.TransactionAuthField:
        s.push(C8(t));
        break;
    }
  return Yf(s, n);
}
function _8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Fy(t.principal)), (t.conditionType === vn.Fungible || t.conditionType === vn.NonFungible) && e.push(Ry(t.assetInfo)), t.conditionType === vn.NonFungible && e.push(Ne(t.assetName)), e.push(t.conditionCode), t.conditionType === vn.STX || t.conditionType === vn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ls("The post-condition amount may not be larger than 8 bytes");
    e.push(Es(t.amount, !1, 8));
  }
  return _e(e);
}
function U8(t) {
  const e = t.readUInt8Enum(vn, (o) => {
    throw new _n(`Could not read ${o} as PostConditionType`);
  }), n = M8(t);
  let r, s, i;
  switch (e) {
    case vn.STX:
      return r = t.readUInt8Enum(Ho, (a) => {
        throw new _n(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${jt(t.readBytes(8))}`), {
        type: dt.PostCondition,
        conditionType: vn.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case vn.Fungible:
      return s = Mu(t), r = t.readUInt8Enum(Ho, (a) => {
        throw new _n(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${jt(t.readBytes(8))}`), {
        type: dt.PostCondition,
        conditionType: vn.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case vn.NonFungible:
      s = Mu(t);
      const o = Wn(t);
      return r = t.readUInt8Enum($u, (a) => {
        throw new _n(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: dt.PostCondition,
        conditionType: vn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Er(t, e) {
  return _e([t, e]);
}
function H8(t) {
  return new Uint8Array([t.type]);
}
function O8(t) {
  return t.type === X.OptionalNone ? new Uint8Array([t.type]) : Er(t.type, Ne(t.value));
}
function D8(t) {
  const e = new Uint8Array(4);
  return Js(e, t.buffer.length, 0), Er(t.type, Yc(e, t.buffer));
}
function F8(t) {
  const e = Of(q4(t.value, BigInt(cv)), Ey);
  return Er(t.type, e);
}
function j8(t) {
  const e = Of(t.value, Ey);
  return Er(t.type, e);
}
function R8(t) {
  return Er(t.type, Xo(t.address));
}
function z8(t) {
  return Er(t.type, Yc(Xo(t.address), eo(t.contractName)));
}
function G8(t) {
  return Er(t.type, Ne(t.value));
}
function K8(t) {
  const e = [], n = new Uint8Array(4);
  Js(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Ne(r);
    e.push(s);
  }
  return Er(t.type, _e(e));
}
function V8(t) {
  const e = [], n = new Uint8Array(4);
  Js(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = ti(s);
    e.push(eo(i));
    const o = Ne(t.data[s]);
    e.push(o);
  }
  return Er(t.type, _e(e));
}
function Gy(t, e) {
  const n = [], r = e == "ascii" ? xy(t.data) : co(t.data), s = new Uint8Array(4);
  return Js(s, r.length, 0), n.push(s), n.push(r), Er(t.type, _e(n));
}
function q8(t) {
  return Gy(t, "ascii");
}
function Y8(t) {
  return Gy(t, "utf8");
}
function Ne(t) {
  switch (t.type) {
    case X.BoolTrue:
    case X.BoolFalse:
      return H8(t);
    case X.OptionalNone:
    case X.OptionalSome:
      return O8(t);
    case X.Buffer:
      return D8(t);
    case X.UInt:
      return j8(t);
    case X.Int:
      return F8(t);
    case X.PrincipalStandard:
      return R8(t);
    case X.PrincipalContract:
      return z8(t);
    case X.ResponseOk:
    case X.ResponseErr:
      return G8(t);
    case X.List:
      return K8(t);
    case X.Tuple:
      return V8(t);
    case X.StringASCII:
      return q8(t);
    case X.StringUTF8:
      return Y8(t);
    default:
      throw new Ls("Unable to serialize. Invalid Clarity Value.");
  }
}
function W8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Xh = /* @__PURE__ */ new Map();
function Ky(t, e) {
  const n = Xh.get(t);
  if (n !== void 0)
    return n(e);
  const r = W8(t);
  return Xh.set(t, r), Ky(t, e);
}
class Lo {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return iv(this.readBytes(4), 0);
  }
  readUInt8() {
    return rv(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return ev(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = jt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = jt(n);
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
    if (Ky(e, r))
      return r;
    throw n(r);
  }
}
function Wn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Lo(xe(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Lo(t) : e = t;
  switch (e.readUInt8Enum(X, (r) => {
    throw new _n(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case X.Int:
      return u8(e.readBytes(16));
    case X.UInt:
      return wr(e.readBytes(16));
    case X.Buffer:
      const r = e.readUInt32BE();
      return Py(e.readBytes(r));
    case X.BoolTrue:
      return My();
    case X.BoolFalse:
      return Ny();
    case X.PrincipalStandard:
      const s = to(e);
      return o8(s);
    case X.PrincipalContract:
      const i = to(e), o = Yn(e);
      return By(i, o);
    case X.ResponseOk:
      return d8(Wn(e));
    case X.ResponseErr:
      return f8(Wn(e));
    case X.OptionalNone:
      return _y();
    case X.OptionalSome:
      return Uy(Wn(e));
    case X.List:
      const a = e.readUInt32BE(), c = [];
      for (let S = 0; S < a; S++)
        c.push(Wn(e));
      return h8(c);
    case X.Tuple:
      const u = e.readUInt32BE(), f = {};
      for (let S = 0; S < u; S++) {
        const M = Yn(e).content;
        if (M === void 0)
          throw new _n('"content" is undefined');
        f[M] = Wn(e);
      }
      return ei(f);
    case X.StringASCII:
      const l = e.readUInt32BE(), w = Z4(e.readBytes(l));
      return Qe(w);
    case X.StringUTF8:
      const p = e.readUInt32BE(), x = Df(e.readBytes(p));
      return p8(x);
    default:
      throw new _n("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const X8 = (t) => t.length % 2 == 0 ? t : `0${t}`, Z8 = (t, e) => t.padEnd(e, "0"), Vy = (t, e) => t ? co(t).length > e : !1;
function Nu(t) {
  return fg(t);
}
const Do = (t) => $v(Gf(t)), Xf = (t) => jt(r8(t)), Q8 = (t) => jt(Do(t)), J8 = (t) => {
  const e = Do(t), n = Yc(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Do(n);
  return jt(r);
}, tk = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = _e(n), s = Do(r);
  return jt(s);
}, ek = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = _e(n), s = Gf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = _e(i), a = Do(o);
  return jt(a);
};
function nk(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function qy(t) {
  const e = Ne(t);
  return `0x${jt(e)}`;
}
function rk(t) {
  return Wn(t);
}
const Oi = (t) => {
  try {
    return ci.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Zf() {
  return {
    type: dt.MessageSignature,
    data: jt(new Uint8Array(Wc))
  };
}
function Yy(t, e, n, r) {
  const s = qf(0, t, 1, [Ji(e)]).hash160, i = lo(Ji(e)) ? Ie.Compressed : Ie.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: bn(n, !1),
    fee: bn(r, !1),
    keyEncoding: i,
    signature: Zf()
  };
}
function Fo(t) {
  return "signature" in t;
}
function Zh(t) {
  return t === le.SerializeP2SH || t === le.SerializeP2WSH;
}
function sk(t) {
  return t === le.SerializeP2SHNonSequential || t === le.SerializeP2WSHNonSequential;
}
function Qh(t) {
  const e = Nu(t);
  return e.nonce = 0, e.fee = 0, Fo(e) ? e.signature = Zf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function ik(t) {
  const e = [
    t.hashMode,
    xe(t.signer),
    Es(t.nonce, !1, 8),
    Es(t.fee, !1, 8),
    t.keyEncoding,
    Vf(t.signature)
  ];
  return _e(e);
}
function ok(t) {
  const e = [
    t.hashMode,
    xe(t.signer),
    Es(t.nonce, !1, 8),
    Es(t.fee, !1, 8)
  ], n = Yf(t.fields);
  e.push(Wf(n));
  const r = new Uint8Array(2);
  return nv(r, t.signaturesRequired, 0), e.push(r), _e(e);
}
function ak(t, e) {
  const n = jt(e.readBytes(20)), r = BigInt(`0x${jt(e.readBytes(8))}`), s = BigInt(`0x${jt(e.readBytes(8))}`), i = e.readUInt8Enum(Ie, (a) => {
    throw new _n(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === le.SerializeP2WPKH && i != Ie.Compressed)
    throw new _n("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Bu(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function ck(t, e) {
  const n = jt(e.readBytes(20)), r = BigInt("0x" + jt(e.readBytes(8))), s = BigInt("0x" + jt(e.readBytes(8))), i = zy(e, dt.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case dt.PublicKey:
        lo(u.contents) || (o = !0);
        break;
      case dt.MessageSignature:
        if (u.pubKeyEncoding === Ie.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Ps("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === le.SerializeP2WSH || t === le.SerializeP2WSHNonSequential))
    throw new Ps("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function xl(t) {
  return Fo(t) ? ik(t) : ok(t);
}
function Sl(t) {
  const e = t.readUInt8Enum(le, (n) => {
    throw new _n(`Could not parse ${n} as AddressHashMode`);
  });
  return e === le.SerializeP2PKH || e === le.SerializeP2WPKH ? ak(e, t) : ck(e, t);
}
function Wy(t, e, n, r) {
  const i = t + jt(new Uint8Array([e])) + jt(Es(n, !1, 8)) + jt(Es(r, !1, 8));
  if (xe(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Xf(xe(i));
}
function Xy(t, e, n) {
  const r = 33 + Wc, s = lo(e) ? Ie.Compressed : Ie.Uncompressed, i = t + X8(s.toString(16)) + n.data, o = xe(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Xf(o);
}
function lk(t, e, n, r, s) {
  const i = Wy(t, e, n, r), o = S8(s, i), a = E8(s), c = Xy(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Zy(t, e, n, r, s, i) {
  const o = Wy(t, e, n, r), a = Ji(g8(o, i, s)), c = Xy(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function uk() {
  const t = Yy(le.SerializeP2PKH, "", 0, 0);
  return t.signer = B8().hash160, t.keyEncoding = Ie.Compressed, t.signature = Zf(), t;
}
function Jh(t, e, n) {
  return Fo(t) ? fk(t, e, n) : dk(t, e, n);
}
function fk(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Zy(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = qf(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Ps(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function dk(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case dt.PublicKey:
        lo(c.contents) || (i = !0), r.push(c.contents);
        break;
      case dt.MessageSignature:
        c.pubKeyEncoding === Ie.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: f } = Zy(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Zh(t.hashMode) && (s = f), r.push(u), o += 1, o === 65536)
          throw new Ps("Too many signatures");
        break;
    }
  if (Zh(t.hashMode) && o !== t.signaturesRequired || sk(t.hashMode) && o < t.signaturesRequired)
    throw new Ps("Incorrect number of signatures");
  if (i && (t.hashMode === le.SerializeP2WSH || t.hashMode === le.SerializeP2WSHNonSequential))
    throw new Ps("Uncompressed keys are not allowed in this hash mode");
  const a = qf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Ps(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Qy(t) {
  return {
    authType: Be.Standard,
    spendingCondition: t
  };
}
function Jy(t, e) {
  return {
    authType: Be.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Yy(le.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function t0(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Be.Standard:
        return Qy(Qh(t.spendingCondition));
      case Be.Sponsored:
        return Jy(Qh(t.spendingCondition), uk());
      default:
        throw new yc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function hk(t, e) {
  switch (t.authType) {
    case Be.Standard:
      return Jh(t.spendingCondition, e, Be.Standard);
    case Be.Sponsored:
      return Jh(t.spendingCondition, e, Be.Standard);
    default:
      throw new yc("Invalid origin auth type");
  }
}
function pk(t, e) {
  switch (t.authType) {
    case Be.Standard:
      const n = {
        ...t.spendingCondition,
        fee: bn(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Be.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: bn(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function gk(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: bn(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function yk(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: bn(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function wk(t, e) {
  const n = {
    ...e,
    nonce: bn(e.nonce, !1),
    fee: bn(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function bk(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Be.Standard:
      e.push(xl(t.spendingCondition));
      break;
    case Be.Sponsored:
      e.push(xl(t.spendingCondition)), e.push(xl(t.sponsorSpendingCondition));
      break;
  }
  return _e(e);
}
function mk(t) {
  const e = t.readUInt8Enum(Be, (r) => {
    throw new _n(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Be.Standard:
      return n = Sl(t), Qy(n);
    case Be.Sponsored:
      n = Sl(t);
      const r = Sl(t);
      return Jy(n, r);
  }
}
class xk {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: bn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? ov, this.postConditionMode = i ?? Qi.Deny, this.postConditions = s ?? Yf([]), o)
      this.anchorMode = fv(o);
    else
      switch (r.payloadType) {
        case Dt.Coinbase:
        case Dt.CoinbaseToAltRecipient:
        case Dt.NakamotoCoinbase:
        case Dt.PoisonMicroblock:
        case Dt.TenureChange:
          this.anchorMode = An.OnChainOnly;
          break;
        case Dt.ContractCall:
        case Dt.SmartContract:
        case Dt.VersionedSmartContract:
        case Dt.TokenTransfer:
          this.anchorMode = An.Any;
          break;
      }
  }
  signBegin() {
    const e = Nu(this);
    return e.auth = t0(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Nu(this);
    return e.auth = t0(e.auth), e.txid();
  }
  verifyOrigin() {
    return hk(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Be.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Be.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Be.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !Fo(n)) {
      const r = lo(e);
      n.fields.push(_i(r ? Ie.Compressed : Ie.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = lk(n, r, e.fee, e.nonce, s);
    return Fo(e) ? e.signature = i : e.fields.push(_i(s.data.byteLength === Sy ? Ie.Compressed : Ie.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return Xf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Be.Sponsored)
      throw new yc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = wk(this.auth, e);
  }
  setFee(e) {
    this.auth = pk(this.auth, e);
  }
  setNonce(e) {
    this.auth = gk(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Be.Sponsored)
      throw new yc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = yk(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Ls('"version" is undefined');
    if (this.chainId === void 0)
      throw new Ls('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ls('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Ls('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Ls('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return Js(n, this.chainId, 0), e.push(n), e.push(bk(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Wf(this.postConditions)), e.push(Dy(this.payload)), _e(e);
  }
}
function wc(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Lo(xe(t.slice(2))) : e = new Lo(xe(t)) : t instanceof Uint8Array ? e = new Lo(t) : e = t;
  const n = e.readUInt8Enum(hc, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = mk(e), i = e.readUInt8Enum(An, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(Qi, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = zy(e, dt.PostCondition), c = L8(e);
  return new xk(n, s, c, a, o, i, r);
}
const Sk = c8, Co = wr, Ek = Py;
const Ak = /* @__PURE__ */ new Set([4001, -31001]), vk = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], kk = ["result", "data", "payload", "response", "params"], e0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Qc = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), di = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Pr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, $k = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), tw = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => $k(i, r)) === s
  );
}, ew = (t) => t ? tw(di()).some(
  (e) => {
    var n;
    return e.id === t && (Qc(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, nw = () => {
  if (typeof window > "u")
    return;
  const t = di(), e = tw(t).filter(
    (n) => {
      var r;
      return Qc(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Pr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of vk) {
    const r = Pr(t, n) ?? (t === window ? void 0 : Pr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, Ik = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = di(), n = Pr(e, t) ?? (e === window ? void 0 : Pr(window, t)) ?? Oc(t);
  if (n)
    return n;
  if (Qc(t) || ew(t))
    return nw();
}, Ma = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, Lk = ["blockstack-session", "blockstack"], Ck = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of Lk) {
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
Ck();
const rw = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Nn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, Tk = (t) => {
  const e = Nn(t);
  if (!e)
    return null;
  const n = rw(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, Bk = (t) => {
  const e = Nn(t);
  if (!e)
    return null;
  const n = rw(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Pu = (t, e = "mainnet") => {
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
      return Pu(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Pu(r, e);
  }
  return e;
}, Os = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, jo = (t, e = 0) => {
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
      const i = jo(s, e + 1);
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
    const i = jo(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && Oi(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Oi(n.testnet) ? n.testnet.trim() : null;
}, n0 = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, sw = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && Ak.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, ni = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Nn(n == null ? void 0 : n.message) ?? Nn(e.message) ?? Nn(e.error) ?? Nn(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, no = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw ni(e);
    if (e.status === "error")
      throw ni(e.result ?? e);
  }
  return t;
}, r0 = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return no(r);
  } catch (r) {
    throw ni(r);
  }
}, iw = () => nw(), Qf = () => {
  if (typeof window > "u")
    return;
  const t = di();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Pr(t, e) ?? (t === window ? void 0 : Pr(window, e));
    if (n)
      return n;
  }
}, s0 = () => {
  if (typeof window > "u")
    return;
  const t = Qf();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = di();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Pr(e, n) ?? (e === window ? void 0 : Pr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Va = (t) => {
  var r, s;
  const e = Vs();
  if (Qc(e) || ew(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = di() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === iw();
}, El = (t) => {
  const e = Bk(t);
  if (!e)
    return null;
  try {
    const n = wc(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, bc = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = El(t), r = Tk(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Nn(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = bc(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of e0)
    if (El(s[a])) {
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
  for (const a of e0) {
    const c = El(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Nn(s[a]) ?? void 0
      };
  }
  for (const a of kk) {
    const c = s[a], u = bc(c, e + 1);
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
}, Al = (t) => {
  const e = bc(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, Mk = (t) => {
  const e = bc(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, Nk = (t) => ({
  ...t,
  fee: Os(t.fee),
  nonce: Os(t.nonce),
  sponsored: t.sponsored === !0
}), i0 = (t) => ({
  recipient: t.recipient,
  amount: Os(t.amount) ?? "0",
  memo: t.memo,
  network: Pu(t.network),
  address: t.stxAddress,
  fee: Os(t.fee),
  nonce: Os(t.nonce),
  sponsored: t.sponsored ?? !1
}), ow = "WALLET_ADDRESS_MISMATCH", Pk = 45e3;
let To = null;
const _u = (t) => {
  t && (To = { address: t, at: Date.now() });
}, _k = () => {
  To = null;
}, Uk = () => To && Date.now() - To.at <= Pk ? To.address : null, Hk = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, Ok = async (t) => {
  _k();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = no(await t.request("wallet_connect")), n = jo(e);
  return _u(n), n;
}, Dk = async (t, e, n, r) => {
  try {
    return no(await t.request(e, n));
  } catch (s) {
    const i = ni(s);
    if (!Hk(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await Ok(t);
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
        { code: o ? ow : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return no(await t.request(e, n));
    } catch (a) {
      throw ni(a);
    }
  }
};
let o0 = 3e4;
const Fk = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${o0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, o0);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, jk = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: ow }
      );
    return c;
  }, s = Uk();
  if (s)
    return Ma(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  Ma(n, "account-read");
  try {
    const c = no(
      await Fk(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = jo(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (sw(c))
      throw ni(c);
    Ma(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return _u(i), r(i, "wallet_getAccount");
  let o;
  Ma(n, "account-reconnect");
  try {
    o = no(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), ni(c);
  }
  const a = jo(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return _u(a), r(a, "wallet_connect");
}, Rk = async (t, e) => {
  if (!Va(t)) {
    const i = await r0(
      t,
      "stx_transferStx",
      i0(e)
    );
    return Al(i);
  }
  const n = Qf();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await r0(
      n,
      "stx_transferStx",
      i0(e)
    );
    return Al(i);
  }
  const r = iw();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await jk(r, e.stxAddress);
  const s = await Dk(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: Os(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: Os(e.fee) } : {}
    },
    e.stxAddress
  );
  return Al(s);
}, zk = () => Vs(), aw = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Vs(), e = t ? Ik(t) : void 0;
  if (e)
    return e;
  const n = di() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, a0 = (t, e) => {
  const n = aw(), r = Nk({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, Mk(s));
    }
  });
  if (!n || typeof n.request != "function")
    return La(r, e);
  if (Va(n) && !Qf()) {
    const s = s0();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Vs(),
        route: "legacy-transaction-request"
      }), La(r, s);
  }
  return void Rk(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (n0(s) && Va(n)) {
      const a = s0();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Vs(),
          route: "legacy-transaction-request"
        }), La(r, a);
        return;
      }
    }
    if (n0(s) && !Va(n)) {
      La(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), sw(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Gk = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), c0 = (t) => qy(t).replace(/^0x/, ""), l0 = "This wallet cannot sign messages. Try Xverse or Leather.", u0 = (t) => typeof (t == null ? void 0 : t.request) == "function", f0 = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", Kk = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, Vk = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function qk(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: c0(e.message),
    domain: c0(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Yk(t, e) {
  const n = await F4({
    domain: e.domain,
    message: e.message,
    network: Vc(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? Gk()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function d0(t) {
  var s, i;
  const e = zk() || "", n = /xverse/i.test(e);
  let r = aw();
  if (n && !f0(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (f0(r))
    try {
      return await Yk(r, t);
    } catch (o) {
      if (n || !u0(r) || !Vk(o)) throw o;
    }
  if (!n && u0(r))
    try {
      return await qk(r, t);
    } catch (o) {
      throw Kk(o) ? new Error(l0) : o;
    }
  throw new Error(l0);
}
const h0 = 1000000n, _s = 1000000n, mc = 50n, Ge = 3000n, hi = 300n, bo = 3000n, Wk = 50000n, vl = 200n, Jc = 15000n, Pn = (t) => t + mc;
function ur(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / h0}.${(n % h0).toString().padStart(6, "0")}`;
}
function p0(t, e = hi) {
  return t <= Ge ? 0 : Number((t - Ge) / Pn(e));
}
function kl(t, e = 0n) {
  const n = _s - t - e;
  return n > 0n ? n : 0n;
}
function Xk(t, e = hi) {
  return t > _s ? "over" : t < Ge + Pn(e) ? "empty" : t < Wk ? "low" : "ok";
}
const Zk = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", Qk = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", Jk = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function t5(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || Jk.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== Zk + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const cw = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", $l = 3, e5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [Uu, lw] = cw.split("."), Kn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function Hu(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function n5(t) {
  return Kn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function xs(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function uw(t, e = []) {
  const n = await xs(`/v2/contracts/call-read/${Uu}/${lw}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Uu, arguments: e.map((r) => "0x" + Kn(Ne(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return hr(Wn(n.result));
}
async function r5() {
  const t = await xs(`/v2/contracts/source/${Uu}/${lw}?proof=0`);
  if (typeof t.source != "string" || await n5(t.source) !== Qk) throw Error("Deployed source does not match the tested helper.");
  if (t5(await uw("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function fw(t) {
  return t.startsWith("SP") && Oi(t) && !t.includes(".");
}
async function s5(t) {
  var r;
  if (!fw(t)) throw Error("Invalid mainnet wallet address.");
  const e = await xs(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await xs(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function i5(t) {
  const e = await xs(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function o5(t, e) {
  var s, i;
  const n = await uw("get-owner", [Co(t), Co(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !fw(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function a5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Hu(t), signal: AbortSignal.timeout(15e3) });
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
async function c5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function l5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = wc(Hu(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || Pi(Ao(pc.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || Pi(r.contractAddress) + "." + r.contractName.content !== cw || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Kn(Ne(r.functionArgs[0])) !== Kn(Ne(Co(t.core))) || Kn(Ne(r.functionArgs[1])) !== Kn(Ne(Co(t.song))) || Kn(Ne(r.functionArgs[2])) !== Kn(Ne(Ek(Hu(t.id)))) || t.amount !== "50" || e.postConditionMode !== Qi.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== Ho.Equal || i.principal.prefix !== 2 || Pi(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || Pi(r.contractAddress) + "." + r.contractName.content !== e5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Kn(Ne(r.functionArgs[0])) !== Kn(Ne(Co(t.song))) || typeof t.liked != "boolean" || Kn(Ne(r.functionArgs[1])) !== Kn(Ne(Sk(t.liked))) || t.amount !== "0" || e.postConditionMode !== Qi.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || hr(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const u5 = "xtrata.xyz/radio/listening-wallet", f5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Nr = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && Oi(t), d5 = (t) => ({
  domain: ei({ name: Qe(u5), version: Qe("1"), "chain-id": wr(1) }),
  message: ei({
    purpose: Qe(f5),
    main: Qe(t.main),
    listening: Qe(t.listening),
    issued: wr(t.issued)
  })
}), dw = 100000n, h5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function p5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Nr(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= dw).sort(h5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const Na = 50;
function xc(t) {
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
async function g5(t, e, n = 4) {
  if (!Nr(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${Na}&offset=${o}`, s = xc(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - Na);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= Na ? s : xc(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = p5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - Na);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const Ir = 50, y5 = 6, w5 = 20, g0 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function y0(t, e) {
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
async function b5(t, e, n) {
  if (!Nr(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = xc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Ir}&offset=0`));
    if (!s || s.total > y5 * Ir) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = Ir; o < s.total; o += Ir) {
      const a = xc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Ir}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${Ir}&offset=${u}`, a = y0(await e(o(0)), t);
      if (!a || a.total > w5 * Ir) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) i.set(u.txId, u);
      for (let u = Ir; u < a.total; u += Ir) {
        const f = y0(await e(o(u)), t);
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
function m5(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(g0).map((l, w) => {
    const p = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: p, kind: "gift", to: r.payer, at: w } : Nr(l.sender) && p >= dw ? { sender: l.sender, left: p, kind: "deposit", to: l.sender, at: w } : { sender: l.sender, left: p, kind: "dust", to: null, at: w };
  }), i = s.reduce((l, w) => l + w.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && Nr(l.recipient) && l.amount > 0n).sort(g0), a = o.reduce((l, w) => l + w.amount, 0n), c = i - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (l, w) => {
    let p = w;
    for (const x of l) {
      if (p <= 0n) break;
      const S = x.left < p ? x.left : p;
      x.left -= S, p -= S;
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
function x5(t, e) {
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
function w0(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const qa = [100, 250, 500], S5 = (t, e) => BigInt(t) * Pn(e), mo = ["prepared", "signed", "unknown", "pending"], E5 = 30 * 6e4, Sc = 6e4, $i = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, A5 = 3e3, Ec = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", Il = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function v5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = null, f = !1, l = !1, w = !1, p = null, x = !1, S = "", M = "", G = 0, K, E = null, U, _ = [], Q, et = -1 / 0;
  const z = /* @__PURE__ */ new Set();
  let q = null, $ = !1, L = 0, b = null, T = null, D = !1, C = null, it = !1, W = null, Et = !1, k = !1, H = !1, at = !1, ct = !1, ut = 0, kt = null, ge = Promise.resolve();
  const It = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? hi.toString()), Xt = (g) => !!i && !(i.features ?? []).includes(g), Lt = (g, I) => `xtrata.ppp.v1.${g}:${I}`, N = "xtrata.ppp.v1.as-main", lt = () => {
    if (t.main()) return;
    const g = t.store.get(N);
    return g && Nr(g) ? g : void 0;
  }, Ct = () => t.main() ?? lt(), tn = (g = i == null ? void 0 : i.address) => {
    if (!g) return [];
    try {
      const I = JSON.parse(t.store.get(Lt("entries", g)) || "[]");
      return Array.isArray(I) ? I : [];
    } catch {
      return [];
    }
  }, ae = (g) => {
    const I = [g, ...tn(g.address).filter((Y) => !(Y.txid === g.txid && Y.kind === g.kind))].slice(0, 200);
    t.store.set(Lt("entries", g.address), JSON.stringify(I));
  }, Oe = (g = i == null ? void 0 : i.address) => !!g && t.store.get(Lt("on", g)) !== "0", en = (g) => {
    i != null && i.address && t.store.set(Lt("on", i.address), g ? "1" : "0");
  }, Le = () => tn().filter((g) => mo.includes(g.status)), nn = () => v() ? [...Le(), ...tn(Ee()).filter((g) => mo.includes(g.status))] : Le(), Ue = () => At(i == null ? void 0 : i.address), At = (g) => {
    if (!g) return null;
    try {
      return JSON.parse(t.store.get(Lt("deposit", g)) || "null");
    } catch {
      return null;
    }
  }, Se = (g, I = i == null ? void 0 : i.address) => {
    I && t.store.set(Lt("deposit", I), JSON.stringify(g));
  };
  let ue = null;
  const Dn = (g = Sc) => {
    const I = t.now();
    ue = { since: ue && I < ue.until ? ue.since : I, until: Math.max((ue == null ? void 0 : ue.until) ?? 0, I + g) };
  }, Fn = () => !!ue && t.now() < ue.until && (o === void 0 || o < Ge + Pn(It())), De = () => !!Ue() || Fn(), Ee = () => Xt("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), v = () => !!(i != null && i.address) && Ee() !== i.address, F = () => v() ? c && c.for === Ee() ? c.value : void 0 : o, j = (g) => g !== void 0 && g < Ge + vl, V = () => Le().filter((g) => t.now() - g.created > E5 && z.has(g.txid)), ft = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!Ct() || r === Ct() && !e.allowed), ot = () => ft() && !(i != null && i.linked), se = () => {
    const g = Ct();
    return !ot() && !!g && !!(i != null && i.linked) && i.linked !== g;
  }, Kt = (g) => Lt("return-to", g), ie = (g = i == null ? void 0 : i.address) => {
    if (!g) return;
    const I = t.store.get(Kt(g));
    return I && Nr(I) && I !== g ? I : void 0;
  }, de = (g = i == null ? void 0 : i.address) => q && q.for === g ? q.res : null;
  function Ae() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const g = ie();
    if (g) return { to: g, kind: "chosen" };
    const I = de();
    if (I != null && I.ok && I.funder) return { to: I.funder, kind: "funder" };
  }
  const ye = (g) => Lt("gift", g);
  function Mt() {
    const g = i == null ? void 0 : i.address;
    if (!g) return null;
    if ((C == null ? void 0 : C.for) === g) return C.info;
    try {
      const I = JSON.parse(t.store.get(ye(g)) || "null");
      return I && typeof I.returnTo == "string" && typeof I.treasury == "string" ? I : null;
    } catch {
      return null;
    }
  }
  async function $t() {
    var bt;
    const g = i == null ? void 0 : i.address;
    if (!g || !t.giftInfo || !((bt = e == null ? void 0 : e.gifts) != null && bt.enabled) || it) return;
    const I = (C == null ? void 0 : C.for) === g ? C : null, Y = I ? I.ok ? I.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (I && t.now() - I.at < Y) return;
    it = !0;
    const tt = Mt();
    try {
      const R = await t.giftInfo(g);
      C = { for: g, info: R, ok: !0, at: t.now() }, t.store.set(ye(g), JSON.stringify(R));
    } catch {
      C = { for: g, info: tt, ok: !1, at: t.now() };
    } finally {
      it = !1;
    }
  }
  const Tt = () => tn().reduce((g, I) => mo.includes(I.status) ? g + BigInt(I.amount || "0") + BigInt(I.fee || "0") : g, 0n);
  function te() {
    if (o === void 0) return 0;
    const g = o - Tt() - BigInt(Qt.length) * Pn(It());
    return g > 0n ? p0(g, It()) : 0;
  }
  const ve = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", he = "EMPTY — ADD STX TO PLAY";
  function jn() {
    if (!(e != null && e.here)) return null;
    const g = (I, Y) => ({ reason: I, text: Y });
    switch (xn()) {
      case "connect":
      case "wrong-wallet":
        return g("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "intro":
        return g("setup", "SET UP YOUR PLAYER TO LISTEN");
      case "loading":
        return g("checking", "CHECKING YOUR LISTENING WALLET");
      case "unsupported":
        return g("unavailable", "OPEN IN A BROWSER THAT SUPPORTS PASSKEYS");
      case "not-invited":
      case "off":
        return g("unavailable", "PAID RADIO IS UNAVAILABLE");
      case "locked":
        return g("locked", "UNLOCK TO LISTEN");
      case "link":
        return g("link", "FINISH SETUP TO LISTEN");
      case "over":
        return g("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return De() ? g("arriving", "YOUR PLAYS ARE ARRIVING") : g("out", v() ? ve : he);
      case "ready":
        return !Oe() || !(i != null && i.session) || i.session.playsLeft < 1 || i.session.expires <= t.now() ? g("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : H ? te() < 1 ? g("out", v() ? ve : he) : null : g("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const mn = () => {
    var g;
    return !!(i != null && i.address) && v() && !!((g = Mt()) != null && g.player);
  };
  function Ar() {
    return mn() ? { locked: !0, known: !0 } : null;
  }
  const pi = 3 * 6e4, gi = () => !!Mt() && !!t.history && !(i != null && i.linked);
  async function vs() {
    const g = i.address, I = Mt(), { balance: Y, nonce: tt } = await t.chain.account(g), bt = await t.history(g, !0);
    if (!bt.ok) return null;
    const R = m5({ self: g, balance: Y, inbound: bt.inbound, outgoing: bt.outgoing, gift: { sender: I.treasury, payer: I.returnTo } });
    if (!R.ok) return null;
    const gt = x5(R.parts, bo);
    return { balance: Y, nonce: tt, parts: R.parts, steps: gt.steps, tooSmall: gt.tooSmall.length };
  }
  const Xn = () => Et ? { state: "unavailable" } : !W || t.now() - W.at > pi || o !== void 0 && o !== W.balance ? { state: "none" } : W.plan;
  function xn() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const g = Ct();
    if (!ot()) {
      if (!g) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : se() ? "wrong-wallet" : i.state === "known" ? "locked" : !ot() && i.linked !== g ? "link" : o === void 0 ? "loading" : o > _s ? "over" : o < Ge + Pn(It()) ? "fund" : "ready" : "loading";
  }
  const yi = () => {
    var g, I, Y, tt, bt;
    return {
      step: xn(),
      busy: u,
      message: S,
      error: M,
      notice: uo(),
      gate: e,
      main: Ct(),
      mainConnected: !!t.main(),
      standIn: lt(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : Xk(o, It()),
      playsLeft: o === void 0 ? 0 : p0(o, It()),
      allowance: o === void 0 ? _s : kl(o, BigInt(((g = Ue()) == null ? void 0 : g.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: Oe(),
      entries: tn(),
      depositTxid: ((I = Ue()) == null ? void 0 : I.txid) ?? K,
      depositPending: De(),
      arrival: De() ? { since: ((Y = Ue()) == null ? void 0 : Y.at) ?? (ue == null ? void 0 : ue.since) ?? t.now(), graceMs: Sc } : null,
      walletOutdated: Xt("like"),
      linkedListening: Q && Q === Ct() ? _.map((R) => R.listening) : [],
      serverLinked: !!E && U === `${Ct()}:${i == null ? void 0 : i.address}`,
      stuck: V().length,
      armed: at,
      queued: Qt.length,
      solo: ot(),
      returnTo: (tt = Ae()) == null ? void 0 : tt.to,
      returnToKind: (bt = Ae()) == null ? void 0 : bt.kind,
      funderState: (() => {
        const R = de();
        return R ? R.ok ? R.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const R = de();
        return !!R && R.ok && R.distinct > 1;
      })(),
      walletCannotSolo: ot() && Xt("standalone"),
      walletCannotMulti: Xt("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((R) => R !== Ct() && R !== (i == null ? void 0 : i.linked)),
      creditedTo: ot() && (i != null && i.address) && (b == null ? void 0 : b.for) === i.address && b.main ? b.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(Lt("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (T == null ? void 0 : T.for) === i.address && T.unused,
      gift: (() => {
        const R = Mt();
        return R ? { player: R.player, from: R.from, source: R.source, amount: R.amount } : null;
      })(),
      giftPlays: Mt() ? te() : 0,
      playCost: Pn(It()),
      giftStop: jn(),
      albumLock: Ar(),
      returnPlan: Xn(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: Xt("slots"),
      likeFunds: (() => {
        var mt;
        const R = Ee();
        if (!R || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const gt = F();
        return { address: R, balance: gt, low: j(gt), album: v(), pending: !!At(R), txid: (mt = At(R)) == null ? void 0 : mt.txid, main: Ct() };
      })()
    };
  }, uo = () => G ? G < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", Zt = (g, I = "") => {
    S = g, M = I, t.changed();
  };
  async function We(g, I) {
    if (!u) {
      u = g, M = "", t.changed();
      try {
        await I();
      } catch (Y) {
        const tt = Y instanceof Error ? Y.message : String(Y);
        M = /Cancelled in the listening wallet/.test(tt) ? "" : tt, M || (S = "Not now. Nothing was signed.", ct = !0);
      } finally {
        u = null, await h(!0);
      }
    }
  }
  const ln = () => !!(e != null && e.enabled) && e.here && (ot() || !!Ct() && e.allowed), Or = () => ln() && !se(), wi = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", we = () => {
    if (se()) throw new Error(wi());
  };
  async function Dr() {
    if (!ln()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const $n = (g) => {
    const I = Ct();
    return g.request("listening.status", I ? { main: I } : void 0);
  };
  async function In(g = !1) {
    i != null && i.address && (!g && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now(), await Fr(g)));
  }
  async function Fr(g = !1) {
    const I = Ee();
    if (!(!v() || !I || (i == null ? void 0 : i.state) !== "unlocked") && !(!g && (c == null ? void 0 : c.for) === I && t.now() - c.at < 3e4))
      try {
        c = { for: I, value: await t.chain.balance(I), at: t.now() };
      } catch {
      }
  }
  async function bi(g) {
    if ((Q !== g || t.now() - et >= 6e4) && (_ = await t.links(g), Q = g, et = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === g) return;
    const I = `${g}:${i.address}`;
    U === I && E || (E = _.find((Y) => Y.listening === i.address) ?? null, U = I);
  }
  async function mi() {
    const g = i == null ? void 0 : i.address;
    if (!ot() || !g || i != null && i.linked || !t.funder || $ || !o || o <= 0n) return;
    const I = de(g);
    if (I != null && I.ok && I.funder) return;
    const Y = I != null && I.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, L - 1), 30 * 6e4);
    if (!(q && q.for === g && t.now() - q.at < Y)) {
      $ = !0;
      try {
        q = { for: g, res: await t.funder(g), at: t.now() };
      } catch {
        q = { for: g, res: { ok: !1 }, at: t.now() };
      } finally {
        $ = !1;
      }
      L = q.res.ok ? 0 : L + 1;
    }
  }
  async function d() {
    const g = i == null ? void 0 : i.address;
    if (!(!ot() || !g || i != null && i.linked || !t.mainOf || D) && !(b && b.for === g && (b.ok || t.now() - b.at < 6e4))) {
      D = !0;
      try {
        b = { for: g, main: await t.mainOf(g), ok: !0, at: t.now() };
      } catch {
        b = { for: g, main: null, ok: !1, at: t.now() };
      } finally {
        D = !1;
      }
    }
  }
  async function m() {
    const g = i == null ? void 0 : i.address;
    if (!(!g || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (T == null ? void 0 : T.for) === g) && t.store.get(Lt("created", g)) !== "1")
      try {
        T = { for: g, unused: await t.chain.confirmedNonce(g) === 0n };
      } catch {
      }
  }
  async function A() {
    var bt;
    const g = i == null ? void 0 : i.address;
    if (!g) return !1;
    let I, Y = !1;
    const tt = /* @__PURE__ */ new Map();
    for (const R of nn())
      try {
        const gt = await t.chain.transaction(R.txid);
        if (!gt) {
          if (z.add(R.txid), t.now() - R.created > 15 * 6e4 && !tt.has(R.address) && tt.set(R.address, await t.chain.confirmedNonce(R.address)), I = tt.get(R.address), I !== void 0 && I > BigInt(R.nonce)) {
            ae({ ...R, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((R.status === "unknown" || R.status === "signed") && R.raw)
            try {
              await t.chain.broadcast(R.raw, R.txid), ae({ ...R, status: "pending" });
            } catch (wt) {
              $i(wt) && ae({ ...R, status: "failed", note: wt.message, raw: void 0 });
            }
          continue;
        }
        z.delete(R.txid);
        const mt = String(gt.tx_status);
        if (mt === "success" && gt.canonical !== !1 && gt.is_unanchored === !1) {
          if (ae({ ...R, status: "confirmed", confirmedAt: t.now(), actualFee: String(gt.fee_rate ?? R.fee), raw: void 0 }), Y = !0, R.kind === "like" && (x = !0, R.status !== "confirmed" && typeof R.liked == "boolean"))
            try {
              (bt = t.likeConfirmed) == null || bt.call(t, R.song, R.liked);
            } catch {
            }
        } else mt.startsWith("abort_") || mt.startsWith("dropped_") ? ae({ ...R, status: "failed", note: mt, raw: void 0 }) : R.status !== "pending" && ae({ ...R, status: "pending" });
      } catch {
      }
    for (const R of v() ? [g, Ee()] : [g]) {
      const gt = At(R);
      if (gt)
        try {
          const mt = await t.chain.transaction(gt.txid), wt = String((mt == null ? void 0 : mt.tx_status) ?? "");
          (wt === "success" && mt.is_unanchored === !1 || wt.startsWith("abort_") || wt.startsWith("dropped_") || !mt && t.now() - gt.at > 2 * 36e5) && (Se(null, R), wt === "success" && Dn(2e4), a = -1 / 0, c = null, /on its way/i.test(S) && (S = ""));
        } catch {
        }
    }
    return Y;
  }
  async function h(g = !1) {
    var I;
    try {
      const Y = Ct();
      if ((g || !e || r !== Y || t.now() - n > 3e5) && (e = await t.config(Y), n = t.now(), r = Y), !e.enabled || !e.here || !ot() && (!Y || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), at && zt(), t.changed();
        return;
      }
      await Dr(), i = await $n(s), se() && i.state === "unlocked" && (ee(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await $n(s)), Y && e.allowed && await bi(Y), await In(g), await mi(), await d(), await m(), await $t(), await A() && await In(!0), await Fr(), await Rn(), G = 0;
    } catch {
      G++;
    }
    if (xn() === "locked" ? xt() : at && zt(), x) {
      x = !1;
      try {
        (I = t.likesChanged) == null || I.call(t);
      } catch {
      }
    }
    t.changed(), Qt.length && !ht && kr();
  }
  async function rt(g) {
    const I = i == null ? void 0 : i.root;
    if (!I || i != null && i.slot || !(i != null && i.address) || Xt("slots")) return;
    const Y = Number(t.store.get(Lt("slot", I)));
    if (!(!Number.isSafeInteger(Y) || Y < 1))
      try {
        const { balance: tt } = await t.chain.account(i.address);
        if (tt >= Ge + Pn(It())) return;
        await g.request("listening.openSlot", { slot: Y }), i = await $n(g), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function vt(g, I) {
    var R;
    we();
    const Y = !(i != null && i.address) || Oe(i.address), tt = i != null && i.linked ? (R = t.nameOf) == null ? void 0 : R.call(t, i.linked) : void 0;
    await g.request("listening.unlock", { mode: "unlock", terms: Y ? ke() : void 0, anyPasskey: I, ...Ct() ? { main: Ct() } : {}, ...tt ? { label: tt } : {} }), i = await $n(g), Y && (Oe(i.address) ? await Ke() : await g.request("listening.stop")), await rt(g), Zt(Y ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const bt = p;
    p = null, bt && t.now() - bt.at < 12e4 && setTimeout(() => void h(!0).then(() => En(bt)), 0);
  }
  function xt() {
    at || u || ct || ut >= 3 || !s || !(i != null && i.address) || (at = !0, ge = (async () => {
      try {
        await vt(s, !1), ut = 0;
      } catch (g) {
        const I = g instanceof Error ? g.message : String(g);
        /Cancelled in the listening wallet/.test(I) ? kt || (ct = !0, Zt("Not now. Nothing was signed.")) : /did not answer/.test(I) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (ut++, M = I);
      } finally {
        at = !1;
        const g = kt;
        kt = null, g ? await g() : await h(!0);
      }
    })());
  }
  async function zt(g) {
    at && (kt = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await ge), g && await g(), t.changed();
  }
  const ke = () => ({
    fee: It().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: _s.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function Ke() {
    if (!(i != null && i.address)) return !1;
    if (H || (H = await t.tabLock(i.address)), !H)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function He(g, I) {
    const Y = i.address, { balance: tt, nonce: bt } = I ?? await t.chain.account(Y);
    o = tt;
    const R = await s.request("listening.prepareReturn", {
      mode: g.mode,
      balance: tt.toString(),
      nonce: bt.toString(),
      fee: bo.toString(),
      ...g.amount !== void 0 ? { amount: g.amount.toString() } : {},
      ...g.linked ? {} : { destination: g.to }
    });
    if (R.recipient !== g.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const gt = g.mode === "amount" ? g.amount : g.mode === "all" ? tt - bo : tt - _s - bo, mt = wc(R.raw);
    if (hr(mt.payload.recipient).value !== g.to || String(mt.payload.amount) !== R.amount || gt !== void 0 && R.amount !== gt.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const wt = {
      id: Il(),
      address: Y,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: R.recipient,
      amount: R.amount,
      fee: R.fee,
      nonce: bt.toString(),
      created: t.now(),
      status: "signed",
      raw: R.raw,
      txid: R.txid
    };
    t.validate(wt), ae(wt);
    try {
      await t.chain.broadcast(R.raw, R.txid), ae({ ...wt, status: "pending" });
    } catch (Ot) {
      throw ae({ ...wt, status: "unknown", note: Ot.message }), Ot;
    }
    return R;
  }
  const Rt = Jc, pe = bo;
  async function Yt(g, I, Y) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || !i.address) throw new Error("Unlock the listening wallet first.");
    if (Xt("slots") || Xt("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const tt = i.slot ?? 0;
    if (g === I || ![g, I].includes(tt) || ![g, I].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const bt = i.root ?? i.address, R = g === 0 ? bt : i.address, gt = I === 0 ? bt : i.address, { balance: mt, nonce: wt } = await t.chain.account(R);
    if (mt < Y + pe + Ge) throw new Error(g === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const Ot = await s.request("listening.signMove", { from: g, to: I, amount: Y.toString(), fee: pe.toString(), nonce: wt.toString(), balance: mt.toString() }), je = wc(Ot.raw);
    if (Ot.from !== R || Ot.to !== gt || Ot.amount !== Y.toString() || hr(je.payload.recipient).value !== gt || String(je.payload.amount) !== Y.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const rn = {
      id: Il(),
      address: R,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: gt,
      amount: Ot.amount,
      fee: Ot.fee,
      nonce: wt.toString(),
      created: t.now(),
      status: "signed",
      raw: Ot.raw,
      txid: Ot.txid
    };
    t.validate(rn), ae(rn);
    try {
      await t.chain.broadcast(Ot.raw, Ot.txid), ae({ ...rn, status: "pending" });
    } catch (Ve) {
      throw ae({ ...rn, status: "unknown", note: Ve.message }), Ve;
    }
    return Se({ txid: Ot.txid, amount: Ot.amount, at: t.now() }, gt), gt === bt && bt !== i.address ? c = null : a = -1 / 0, Ot;
  }
  let un = !1;
  const Xe = /* @__PURE__ */ new Map(), Fe = (g) => Lt("float", g);
  async function Rn() {
    if (un || (i == null ? void 0 : i.state) !== "unlocked" || !v() || Xt("move") || Xt("rootLike") || !i.address) return;
    const g = i.address;
    if (t.store.get(Fe(g)) === "1") return;
    const I = Mt();
    if (!(I != null && I.player) || I.state !== "arrived") return;
    const Y = F();
    if (Y === void 0 || o === void 0) return;
    if (!j(Y)) {
      t.store.set(Fe(g), "1");
      return;
    }
    if (At(Ee()) || Vt() || nn().length || o < Rt * 4n + Ge + pe) return;
    const tt = Xe.get(g);
    if (!(tt && (tt.n >= 3 || t.now() - tt.at < 5 * 6e4))) {
      un = !0, Xe.set(g, { n: ((tt == null ? void 0 : tt.n) ?? 0) + 1, at: t.now() });
      try {
        await Yt(i.slot ?? 0, 0, Rt), t.store.set(Fe(g), "1");
      } catch (bt) {
        console.warn("[radio] likes float not sent yet", bt);
      } finally {
        un = !1;
      }
    }
  }
  async function Ln(g) {
    if (Le().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Xt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const I = await vs().catch(() => null);
    if (!I)
      throw W = null, Et = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Et = !1, o = I.balance;
    const Y = { balance: I.balance, nonce: I.nonce };
    if (g === "excess") {
      const mt = w0(I.parts) ?? ie();
      if (!mt) throw new Error("Choose where to send the excess first.");
      await He({ mode: "excess", to: mt, linked: !1 }, Y), W = null, Zt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const tt = I.steps;
    if (!tt.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!W && W.balance === I.balance && t.now() - W.at <= pi && W.steps.length === tt.length && W.steps.every((mt, wt) => mt.to === tt[wt].to && mt.mode === tt[wt].mode && mt.send === tt[wt].send))) {
      W = {
        at: t.now(),
        balance: I.balance,
        steps: tt,
        parts: I.parts,
        plan: { state: "ready", steps: tt.map((mt) => ({ to: mt.to, kind: mt.kind, send: mt.send.toString() })), kept: I.tooSmall, excess: w0(I.parts) }
      }, Zt(tt.length > 1 ? `This goes back in ${tt.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const R = tt[0], gt = R.to ?? ie();
    if (!gt) throw new Error("Choose where to send the rest first.");
    if (R.mode === "amount" && Xt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await He({ mode: R.mode, to: gt, linked: !1, ...R.mode === "amount" ? { amount: R.send } : {} }, Y), W = null, tt.length === 1 ? (en(!1), Zt("Returned ✓ Paying is off.")) : Zt(`Returned ✓ ${tt.length - 1} more ${tt.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const Sn = {
    forceRefresh: () => h(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (g) => {
      if (!t.main() && !(g !== null && !Nr(g))) {
        if (g === lt()) return h(!0);
        t.store.set(N, g ?? ""), M = "", S = "", o = void 0, a = -1 / 0, c = null, await h(!0);
      }
    },
    create: () => We("Waiting for your passkey…", async () => {
      const g = await Dr();
      await g.request("listening.unlock", { mode: "create", terms: ke(), ...t.main() ? { main: t.main() } : {} }), i = await $n(g), i.address && t.store.set(Lt("created", i.address), "1"), en(!0), Zt(ot() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Ke();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (g) => {
      g ? Dn() : ue = null, t.changed();
    },
    giftSent: (g, I) => {
      !(i != null && i.address) || Ue() || (Se({ txid: g, amount: I.toString(), at: t.now() }), a = -1 / 0, C = null, Zt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (g) => {
      if (we(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Xt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await Dr()).request("listening.bindSlot", { slot: g, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (g, I, Y, tt) => {
      Se({ txid: Y, amount: tt.toString(), at: t.now() }, I), C = null, await Sn.openAlbum(g), Zt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (g) => We("Opening…", async () => {
      if (we(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Xt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (f || l || w) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === g) return;
      ee(), await s.request("listening.openSlot", { slot: g }), i = await $n(s), o = void 0, a = -1 / 0, W = null, Et = !1;
      const I = i.root;
      I && g > 0 && t.store.set(Lt("slot", I), String(g)), Zt(g === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (g = !1) => {
      const I = () => We("Waiting for your passkey…", async () => vt(await Dr(), g));
      return at ? g ? Xt("cancel") ? (Zt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : zt(async () => {
        (xn() === "locked" || xn() === "intro") && await I();
      }) : ge : I();
    },
    link: () => We("Sign in your wallet…", async () => {
      we();
      const g = t.main();
      if (!g || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const I = (await t.links(g)).find((Y) => Y.listening === i.address);
      if (I)
        await s.request("listening.link", { main: g, issued: I.issued, mainSignature: I.mainSignature });
      else {
        const Y = { main: g, listening: i.address, issued: t.now() }, tt = await t.signWithMain(g, d5(Y)), bt = await s.request("listening.link", { main: g, issued: Y.issued, mainSignature: tt });
        await t.saveLink({ ...Y, mainSignature: tt, listeningSignature: bt.listeningSignature }), et = -1 / 0;
      }
      Zt("Linked ✓");
    }),
    deposit: () => We("Approve the deposit in your wallet…", async () => {
      we();
      const g = t.main();
      if (!g || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (Ue()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (Fn()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await In(!0);
      const I = kl(o ?? 0n);
      if (I <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      K = await t.deposit(g, i.address, I), K && Se({ txid: K, amount: I.toString(), at: t.now() }), Zt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => We("Approve the top-up in your wallet…", async () => {
      we();
      const g = t.main(), I = Ee();
      if (!g || !I) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (At(I)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const Y = await t.chain.balance(I);
      v() ? c = { for: I, value: Y, at: t.now() } : (o = Y, a = t.now());
      const tt = kl(Y);
      if (tt <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const bt = await t.deposit(g, I, tt);
      bt && Se({ txid: bt, amount: tt.toString(), at: t.now() }, I), Zt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (g) => We("Adding plays…", async () => {
      if (we(), !v()) throw new Error("Open the album you want to add plays to first.");
      if (!qa.includes(g)) throw new Error("Choose one of the amounts offered.");
      const I = S5(g, It());
      if (f || l || w) throw new Error("Still sending a payment. Try again in a moment.");
      if (nn().length || Ue()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Yt(0, i.slot ?? 0, I), Zt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => We("Confirm in the listening wallet…", async () => {
      if (!Or()) throw new Error("Connect your wallet first.");
      await Ke(), await s.request("listening.approveSession", ke()), en(!0), Zt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => We("Clearing…", async () => {
      for (const g of V())
        await t.chain.transaction(g.txid) || ae({ ...g, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Zt("Cleared ✓");
    }),
    switchOff: () => We("Switching off…", async () => {
      ee(), await (s == null ? void 0 : s.request("listening.stop")), en(!1), Zt("Music support is off. Playback is paused.");
    }),
    lock: () => We("Locking…", async () => {
      ee(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, Zt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (g) => {
      const I = String(g ?? "").trim();
      if (!(i != null && i.address)) return Zt("", "Unlock the listening wallet first.");
      if (!Nr(I)) return Zt("", "Enter a standard mainnet address (it starts with SP).");
      if (I === i.address) return Zt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(Kt(i.address), I), Zt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(Kt(i.address), ""), t.changed();
    },
    returnFunds: (g) => We("Check the return in the listening wallet…", async () => {
      if (!Or()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (gi()) return Ln(g);
      const I = Ae();
      if (!I) throw new Error(ot() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (I.kind !== "linked" && Xt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Le().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await He({ mode: g, to: I.to, linked: I.kind === "linked" }), g === "all" && en(!1), Zt(g === "all" ? I.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Qt = [], xi = 10, vr = 30 * 6e4;
  let ht = !1;
  const Vt = () => f || !!u || l || w, ee = () => {
    Qt.length && (Qt.length = 0, t.changed());
  };
  async function fn(g) {
    if (!Qt.some((I) => I.id === g.id) && !tn().some((I) => I.id === g.id) && (Qt.push({ ...g, at: t.now() }), Qt.length > xi && Qt.shift()), Vt() || Le().length) {
      const I = Qt.length;
      S = `Queued ${I === 1 ? "this song" : I + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await kr();
  }
  async function kr() {
    if (!ht) {
      ht = !0;
      try {
        for (; Qt.length; ) {
          for (; Qt.length && t.now() - Qt[0].at > vr; ) Qt.shift();
          if (!Qt.length || Vt() || await Si(Qt[0]) === "wait") return;
          Qt.shift();
        }
      } finally {
        ht = !1, t.changed();
      }
    }
  }
  async function Si(g) {
    var I;
    f = !0;
    try {
      await h();
      const Y = xn();
      if (Y === "loading") return "wait";
      if (Y !== "ready" || !Oe() || !(i != null && i.session) || i.session.playsLeft < 1 || !H) return "done";
      if (Le().length) return "wait";
      k || (await t.chain.verify(), k = !0);
      const tt = i.address, { balance: bt, nonce: R } = await t.chain.account(tt);
      o = bt, a = t.now();
      const gt = await t.chain.owner($l, g.song);
      if (gt === tt || gt === Ct()) return "done";
      const mt = await s.request("listening.signPlay", {
        core: $l,
        song: g.song,
        receipt: g.id,
        fee: It().toString(),
        nonce: R.toString(),
        balance: bt.toString()
      }), wt = {
        id: g.id,
        address: tt,
        kind: "play",
        core: $l,
        song: g.song,
        recipient: gt,
        amount: "50",
        fee: It().toString(),
        nonce: R.toString(),
        created: t.now(),
        status: "signed",
        raw: mt.raw,
        txid: mt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...g.title ? { title: String(g.title).slice(0, 120) } : {},
        ...g.artist ? { artist: String(g.artist).slice(0, 120) } : {}
      };
      t.validate(wt), ae(wt);
      const Ot = g.title ? `“${g.title}”${g.artist ? ` by ${g.artist}` : ""}` : `song #${g.song}`;
      try {
        await t.chain.broadcast(mt.raw, mt.txid), ae({ ...wt, status: "pending" }), S = `♪ Paid ${Ot}`, M = "";
      } catch (je) {
        ae({ ...wt, status: $i(je) ? "failed" : "unknown", note: je.message, ...$i(je) ? { raw: void 0 } : {} }), M = je.message;
      }
      return i = await $n(s), "done";
    } catch (Y) {
      const tt = Y instanceof Error ? Y.message : "payment unavailable";
      return (I = Mt()) != null && I.player ? (S = "Payment is taking a moment: " + tt, "wait") : (S = "This song played free: " + tt, "done");
    } finally {
      f = !1, t.changed();
    }
  }
  function Ei(g) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(xn()) || Xt("like") ? !1 : (En(g), !0);
  }
  async function En(g) {
    const I = g.title ? `“${g.title}”` : `song #${g.song}`, Y = (dn) => {
      var jr;
      M = dn, S = "";
      try {
        (jr = t.likeFailed) == null || jr.call(t, g.song);
      } catch {
      }
      t.changed();
    }, tt = v(), bt = xn(), R = Ct(), gt = tt && (bt === "fund" || bt === "over") ? "ready" : bt, mt = ot() ? Ee() : R;
    if (gt === "locked") {
      p = { ...g, at: t.now() }, Zt(`Unlock to like ${I}. It sends straight after.`);
      return;
    }
    if (gt === "wrong-wallet") return Y(wi());
    if (gt === "link") return Y("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (ot() && Xt("standalone")) return Y("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (gt === "fund") return Y("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (gt === "over") return Y("Return the excess first: the listening wallet holds more than 1 STX.");
    if (tt) {
      await Fr(!0);
      const dn = F();
      if (j(dn))
        return t.changed(), Y(Ec);
    }
    if (gt !== "ready" || !mt) return Y("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return Y("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!H) return Y("Pay-per-play is running in another tab. Like from that tab.");
    const wt = tn(Ee()).find((dn) => dn.kind === "like" && dn.song === g.song);
    if (wt && mo.includes(wt.status))
      return Y(`Your last like for ${I} is still on its way. It can change again once it confirms.`);
    if (l) return Y("One like at a time: your last one is still being sent.");
    if ((wt == null ? void 0 : wt.status) === "confirmed" && t.now() - (wt.confirmedAt ?? 0) < A5)
      return Y(`Your like for ${I} has only just confirmed. Try again in a moment.`);
    let Ot;
    w = !0;
    try {
      Ot = t.likeState ? (await t.likeState(mt, g.song)).by : g.likedBy ?? [];
    } catch {
      Ot = g.likedBy;
    } finally {
      w = !1;
    }
    if (!Ot) return Y(`Could not check ${I} right now. Try the heart again.`);
    const je = Ee(), Ve = ((wt == null ? void 0 : wt.status) === "confirmed" && typeof wt.liked == "boolean" && t.now() - (wt.confirmedAt ?? wt.created) < 5 * 6e4 ? wt.liked : void 0) ?? Ot.includes(je);
    if (!Ve && Ot.some((dn) => dn !== je)) return Y(ot() ? `${I} was liked from another wallet of yours. Unlike it there.` : `${I} was liked from your main wallet${Ot.includes(R) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await Cn({ song: g.song, liked: !Ve, title: g.title, artist: g.artist });
  }
  async function Cn(g) {
    var tt, bt, R;
    if (l) {
      Zt("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const I = g.title ? `“${g.title}”${g.artist ? ` by ${g.artist}` : ""}` : `song #${g.song}`, Y = t.wait ?? ((gt) => new Promise((mt) => setTimeout(mt, gt)));
    try {
      Zt(`${g.liked ? "Liking" : "Unliking"} ${I}…`);
      const gt = t.now() + 12e4;
      for (; f || (v() ? tn(Ee()).some((Ve) => mo.includes(Ve.status)) : Le().length); ) {
        if (t.now() > gt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await Y(5e3), await h(!0);
      }
      if (!v() && xn() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const mt = Ee(), { balance: wt, nonce: Ot } = await t.chain.account(mt);
      if (v() ? c = { for: mt, value: wt, at: t.now() } : (o = wt, a = t.now()), j(wt)) throw new Error(Ec);
      const je = await s.request("listening.signLike", {
        song: g.song,
        liked: g.liked,
        fee: vl.toString(),
        nonce: Ot.toString(),
        balance: wt.toString()
      }), rn = {
        id: Il(),
        address: mt,
        kind: "like",
        core: 0,
        song: g.song,
        liked: g.liked,
        recipient: "",
        amount: "0",
        fee: vl.toString(),
        nonce: Ot.toString(),
        created: t.now(),
        status: "signed",
        raw: je.raw,
        txid: je.txid,
        ...g.title ? { title: String(g.title).slice(0, 120) } : {},
        ...g.artist ? { artist: String(g.artist).slice(0, 120) } : {}
      };
      t.validate(rn), ae(rn);
      try {
        await t.chain.broadcast(je.raw, je.txid), ae({ ...rn, status: "pending" }), S = `${g.liked ? "♥ Liked" : "Unliked"} ${I}`, M = "";
        try {
          (tt = t.likeSent) == null || tt.call(t, g.song, g.liked);
        } catch {
        }
      } catch (Ve) {
        if (ae({ ...rn, status: $i(Ve) ? "failed" : "unknown", note: Ve.message, ...$i(Ve) ? { raw: void 0 } : {} }), M = Ve.message, $i(Ve)) try {
          (bt = t.likeFailed) == null || bt.call(t, g.song);
        } catch {
        }
      }
      i = await $n(s);
    } catch (gt) {
      M = "Like not sent: " + (gt instanceof Error ? gt.message : "the listening wallet is unavailable");
      try {
        (R = t.likeFailed) == null || R.call(t, g.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), kr();
    }
  }
  return { snapshot: yi, refresh: h, onListened: fn, heart: Ei, toggleLike: En, ...Sn };
}
const hw = ["Connect", "Passkey", "Link & fund", "Listen"], pw = ["Passkey", "Add 1 STX", "Listen"], Ou = (t) => t ? pw : hw;
function k5(t) {
  if (t.solo) return $5(t);
  const e = hw.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function $5(t) {
  const e = pw.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function I5(t, e) {
  return !e || e.at >= Ou(!!t.solo).length || t.heard || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const L5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function C5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !L5(r.id)));
}
const T5 = {}, B5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, M5 = (t) => {
  const e = T5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, N5 = (t) => `/hiro/${t}`, P5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, _5 = (t) => {
  const e = M5(t);
  if (e)
    return [P5(e)];
  const n = B5[t];
  return typeof window < "u" ? [`${window.location.origin}${N5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, U5 = {}, b0 = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, H5 = "xtrata.log.enabled", O5 = "xtrata.log.level", D5 = "xtrata.log.tags", F5 = "xtrata.log.dedupe", Pa = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, j5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, R5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, z5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, G5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, K5 = () => {
  const t = U5 ?? {}, e = Pa(H5) ?? t.VITE_LOG_ENABLED, n = Pa(O5) ?? t.VITE_LOG_LEVEL, r = Pa(D5) ?? t.VITE_LOG_TAGS, s = Pa(F5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: j5(e),
    level: R5(n) ?? "warn",
    tags: G5(r),
    dedupe: z5(s)
  };
}, V5 = (t, e, n) => !t.enabled || b0[n] < b0[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), q5 = (t, e, n, r) => {
  const s = K5();
  if (!V5(s, e, t) || W5(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, Y5 = /* @__PURE__ */ new Set();
let m0 = null;
const W5 = (t, e, n, r, s) => (m0 !== t && (Y5.clear(), m0 = t), !1), X5 = (t, e, n) => q5("debug", t, e, n), Z5 = {}, Q5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, J5 = (t) => {
  const e = Z5, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : Q5[t];
}, t6 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, e6 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return t6.test(n) ? n : null;
}, n6 = (t) => t.replace(/\/+$/, ""), r6 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), x0 = (t) => {
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
}, Ii = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, s6 = (t) => {
  var c, u;
  let e;
  try {
    e = hr(rk(t));
  } catch {
    return null;
  }
  const n = Ii(e);
  if (!n || n.success === !1)
    return null;
  const r = Ii(n.value), s = Ii(r == null ? void 0 : r.value), i = Ii(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = x0((c = Ii(i.name)) == null ? void 0 : c.value), a = x0((u = Ii(i.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : e6(`${o}.${a}`);
}, i6 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${n6(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [qy(Ty(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : s6(i.result);
}, o6 = async (t) => {
  const e = t.address.trim();
  if (!Oi(e))
    return null;
  const n = J5(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of _5(t.network))
    try {
      return await i6({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return X5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: r6(r)
  }), null;
};
function a6(t, e, n = {}) {
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
const S0 = Object.freeze({
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
}), E0 = Object.freeze({ 139: "melophonic" });
function c6(t, e = "") {
  const n = String(t);
  return Object.hasOwn(S0, n) ? S0[n] : Object.hasOwn(E0, n) ? E0[n] : e;
}
const A0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function l6(t, e = "") {
  return Object.hasOwn(A0, String(t)) ? A0[String(t)] : e;
}
const gw = 10000n, Jf = 1000000n, Ac = 3000n, u6 = (t, e) => `${t}#gift=${e}`, f6 = 100, _a = (t, e = hi) => t <= Ge ? 0 : Number((t - Ge) / Pn(e)), v0 = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), yw = "xtrata.xyz/radio/gifts", Ll = f6, d6 = "Create a prefunded Xtrata radio gift batch", h6 = (t) => ({
  domain: ei({ name: Qe(yw), version: Qe("1"), "chain-id": wr(1) }),
  message: ei({
    purpose: Qe(d6),
    creator: Qe(t.creator),
    count: wr(t.count),
    amount: wr(BigInt(t.amount)),
    label: Qe(t.label),
    issued: wr(t.issued),
    ...t.player ? { player: Qe(t.player) } : {}
  })
}), p6 = (t, e, n = hi) => Ge + BigInt(t) * Pn(n) + (e ? Jc : 0n), g6 = (t, e = hi) => Number((Jf - Ge - (t ? Jc : 0n)) / Pn(e)), y6 = (t, e) => BigInt(t) * (e + Ac);
function w6(t, e, n, r = hi) {
  const s = n ? Jc : 0n, i = e > Ge + s ? e - Ge - s : 0n, o = Number(i / Pn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * mc,
    fees: BigInt(o) * r,
    reserve: Ge,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: Ac,
    perCopy: e + Ac,
    total: y6(t, e)
  };
}
const b6 = (t) => t >= gw && t <= Jf, k0 = 40, m6 = "Create an Xtrata radio gift player", x6 = /^[^\u0000-\u001f\u007f<>]+$/u;
function $0(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && x6.test(t) : !n;
}
function S6(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!$0(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!$0(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > k0) throw new Error(`A player holds 1 to ${k0} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const E6 = (t) => Np(Dp(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), A6 = (t) => ({
  domain: ei({ name: Qe(yw), version: Qe("1"), "chain-id": wr(1) }),
  message: ei({
    purpose: Qe(m6),
    admin: Qe(t.admin),
    player: Qe(t.hash),
    issued: wr(t.issued)
  })
}), Ds = (t) => t.tracks.filter((e) => !e.hidden), v6 = (t) => t.tracks.find((e) => e.hidden) ?? null, k6 = [300, 500, 1e3], I0 = 1800, Cl = /* @__PURE__ */ new Map();
async function $6(t) {
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
function I6(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = Cl.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      Cl.set(t, { ...a, until: Date.now() + I0 });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Cl.delete(t), s();
      }, I0 + 50);
    }
  }, i;
}
const Ui = (t, e, n, r, s) => I6(t, e, async () => await $6(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), $s = "xtrata.radio.gift.incoming.v1", L0 = (t) => "xtrata.radio.gift.mine.v1:" + t, C0 = (t) => "xtrata.radio.gift.batches.v1:" + t, St = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Lr = (t, e, n = "") => {
  const r = St("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, Ua = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, Gn = (t) => ur(t).replace(/\.?0+$/, "");
function L6(t) {
  let e = null;
  const n = (v) => [5e3, 1e4, 2e4, 3e4][v] ?? 6e4, r = (() => {
    try {
      const v = new URL(location.href), F = new URLSearchParams(v.hash.slice(1)).get("gift") ?? v.searchParams.get("gift");
      return F !== null && (v.searchParams.delete("gift"), history.replaceState(null, "", v.pathname + (v.search || ""))), v0(F) ? F : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const v = JSON.parse(t.store.get($s) || "null");
      return v0(v == null ? void 0 : v.code) ? v.code : null;
    } catch {
      return null;
    }
  })(), i = r ?? s;
  if (i) {
    e = { code: i }, t.store.set($s, JSON.stringify({ code: i, at: t.now() }));
    let v = 0;
    const F = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (j) => {
      const V = await j.json().catch(() => ({}));
      if (j.status === 404) {
        t.store.set($s, null), e = { ...e, error: (V == null ? void 0 : V.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!j.ok) throw new Error("busy");
      const ft = V;
      e = { ...e, view: ft, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(ft.status) && t.store.set($s, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void F(), n(v++)));
    });
    F();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    const v = e == null ? void 0 : e.view;
    return !(v != null && v.player) || !o() ? null : { player: v.player, from: u(v), plays: _a(BigInt(v.amount)) };
  }, c = () => {
    e = null, t.store.set($s, null), t.changed();
  }, u = (v) => v.from ? t.who(v.from) : v.label ? `Xtrata Radio · ${v.label}` : "Xtrata Radio";
  let f = {};
  const l = (v) => {
    if (f.box) return f.box;
    const F = St("div", "", "ppp-gift-check");
    f.box = F;
    const j = () => {
      const V = window.turnstile;
      !V || f.rendered || (f.rendered = !0, V.render(F, { sitekey: v, callback: (ft) => {
        f.token = ft, t.changed();
      }, "expired-callback": () => {
        f.token = void 0;
      } }));
    };
    if (window.turnstile) j();
    else {
      const V = document.createElement("script");
      V.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", V.async = !0, V.onload = j, document.head.append(V);
    }
    return F;
  }, w = (v) => {
    queueMicrotask(() => void v());
  };
  let p;
  async function x(v) {
    var V, ft, ot, se, Kt, ie, de, Ae, ye;
    if (!e || e.claiming || !v.listening) return;
    const F = !!((V = e.view) != null && V.player);
    if (F && !v.root) return;
    e.claiming = !0, e.error = void 0, (ft = t.claiming) == null || ft.call(t, !0), t.changed();
    const j = async (Mt) => {
      const $t = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: f.token, ...Mt })
      });
      return { res: $t, r: await $t.json().catch(() => ({})) };
    };
    try {
      let Mt = 0, $t = v.listening, Tt;
      if (F) {
        const he = Number((ot = await t.json("/radio/gift/slots?root=" + encodeURIComponent(v.root))) == null ? void 0 : ot.next);
        if (!Number.isSafeInteger(he) || he < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Mt = he;
        for (let jn = 0; ; jn++) {
          const mn = await t.album.bind(Mt);
          if ($t = mn.address, Tt = await j({ wallet: $t, binding: mn }), Tt.res.status === 409 && /just taken/.test(((se = Tt.r) == null ? void 0 : se.error) || "") && jn < 5) {
            Mt += 1;
            continue;
          }
          break;
        }
      } else Tt = await j({ wallet: $t });
      const { res: te, r: ve } = Tt;
      if (te.status === 503 && /sending another gift/.test((ve == null ? void 0 : ve.error) || "")) {
        e.waiting = !0, (Kt = t.claiming) == null || Kt.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!te.ok) {
        const he = String((ve == null ? void 0 : ve.error) || "");
        if (te.status === 404 || te.status === 410 || te.status === 409 && /already had a gift|brand-new|already have this album/.test(he))
          throw t.store.set($s, null), new Error(he || "This gift cannot be opened.");
        if (te.status === 429 || te.status === 403 || te.status === 400 && !/wallet number/i.test(he)) throw new Error(he || `Could not open the gift (${te.status}).`);
        const mn = /topping up/.test(he) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(he) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(he) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(mn), { retry: !0, slow: /topping up|not paid for yet/.test(he) });
      }
      e.done = !0, t.store.set($s, null), F ? await t.album.arrived(Mt, $t, ve.txid, BigInt(ve.amount)) : t.giftSent(ve.txid, BigInt(ve.amount));
    } catch (Mt) {
      const $t = Mt, Tt = $t.name === "TypeError" || $t.name === "AbortError" || $t.name === "TimeoutError" || /wallet number/i.test($t.message);
      if ($t.retry || Tt) {
        const te = e.tries ?? 0;
        e.tries = te + 1, e.retry = { text: $t.retry ? $t.message : "Still sending your gift… the network is slow, trying again." }, (ie = t.claiming) == null || ie.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, $t.slow ? 6e4 : n(te));
      } else
        e.error = $t.message, (de = t.claiming) == null || de.call(t, !1);
      f.token = void 0;
      try {
        (ye = (Ae = window.turnstile) == null ? void 0 : Ae.reset) == null || ye.call(Ae, f.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let S = null;
  function M(v) {
    if (!v.listening || !v.depositPending || v.step !== "fund")
      return S = null, [];
    if (!S || S.wallet !== v.listening || t.now() - S.at > 3e4) {
      const j = v.listening;
      S = { ...(S == null ? void 0 : S.wallet) === j ? S : {}, wallet: j, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(j)).then((V) => {
        var ft, ot;
        (S == null ? void 0 : S.wallet) === j && (S.state = (ft = V == null ? void 0 : V.gift) == null ? void 0 : ft.state, S.problem = ((ot = V == null ? void 0 : V.gift) == null ? void 0 : ot.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(S.state === "sending" && S.problem)) return [];
    const F = St("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return F.title = `Network reply: ${S.problem}`, [F];
  }
  function G(v, F, j = !1) {
    var ie, de;
    const V = F.player, ft = BigInt(F.amount), ot = j ? [] : [St("p", `🎁 ${u(F)} sent you “${V.title}”${V.subtitle ? ` by ${V.subtitle}` : ""}: ${Ds(V).length} ${Ds(V).length === 1 ? "song" : "songs"} and ${_a(ft).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!v.root && ["fund", "ready", "over", "link"].includes(v.step))) {
      if (j) return ot;
      if (ot.push(St("p", v.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : v.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), v.step === "intro") {
        const Ae = document.createElement("details");
        Ae.className = "ppp-how";
        const ye = document.createElement("summary");
        ye.textContent = "How does this work?", Ae.append(ye, St("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), ot.push(Ae);
      }
      return ot;
    }
    if (v.walletCannotAlbums)
      return ot.push(St("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), ot;
    const Kt = (de = (ie = v.gate) == null ? void 0 : ie.gifts) == null ? void 0 : de.turnstileSiteKey;
    return Kt && !f.token ? ot.push(St("p", "One quick check and it is yours:", "ppp-mute"), l(Kt)) : !e.claiming && !e.error && !e.waiting && !e.retry && w(() => x(v)), ot.push(...K(v, "Sending your album…")), ot;
  }
  function K(v, F) {
    const j = [];
    return e.claiming || e.waiting ? j.push(St("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : F, "ppp-cyan")) : e.retry && j.push(St("p", e.retry.text, "ppp-warn"), Lr("Try now", () => {
      clearTimeout(p), e.retry = void 0, x(v);
    }, "quiet")), e.error && j.push(St("p", e.error, "ppp-bad"), Lr("Try again", () => {
      e.error = void 0, x(v);
    })), j;
  }
  const E = (v) => {
    var F;
    return !!e && !e.done && !e.error && o() && !!v.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !v.linked && !v.creditedTo && (v.createdHere || v.brandNew || !!((F = e.view) != null && F.player)) && (v.balance ?? 0n) === 0n && !v.entries.length);
  };
  function U(v, F = {}) {
    var ye, Mt;
    const j = M(v);
    if (!e || ["off", "elsewhere"].includes(v.step)) return j;
    const V = e.view;
    if (e.error && !V) return [St("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!V) return [St("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return j;
    if (V.status === "claimed" || V.status === "claiming") return [St("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(V.status)) return [St("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (V.status === "pending-deposit") return [St("p", `🎁 ${u(V)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (V.player) return [...G(v, V, !!F.bare), ...j];
    if (!!v.listening && (!(v.createdHere || v.brandNew) || !!v.linked || !!v.creditedTo || (v.balance ?? 0n) > 0n || v.entries.length > 0))
      return [St("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), Lr("Forget this gift link here", c, "quiet")];
    const ot = BigInt(V.amount), se = _a(ot).toLocaleString(), ie = [St(
      "p",
      `🎁 ${u(V)} sent you ${Gn(ot)} STX of on-chain music: about ${se} paid plays.`,
      "ppp-gift"
    )], de = !!v.listening && (v.createdHere || v.brandNew) && !v.linked && !v.creditedTo && v.step === "fund" && (v.balance ?? 1n) === 0n && !v.depositPending && !v.entries.length, Ae = (Mt = (ye = v.gate) == null ? void 0 : ye.gifts) == null ? void 0 : Mt.turnstileSiteKey;
    return de ? (Ae && !f.token ? ie.push(St("p", "One quick check and it is yours:", "ppp-mute"), l(Ae)) : !e.claiming && !e.error && !e.waiting && !e.retry && w(() => x(v)), ie.push(...K(v, "Sending your gift…"))) : v.step === "intro" ? ie.push(St("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : v.listening && v.linked ? ie.push(St("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), Lr("Forget this gift link here", c, "quiet")) : v.listening && (v.balance ?? 0n) > 0n && ie.push(St("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), Lr("Forget this gift link here", c, "quiet")), ie;
  }
  async function _(v, F, j) {
    var V;
    try {
      const ft = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(v));
      if ((V = ft == null ? void 0 : ft.gift) != null && V.returnTo) return { ok: !0, funder: ft.gift.returnTo, txId: ft.gift.txid ?? void 0, amount: ft.gift.amount, distinct: 1 };
    } catch {
      if (j) return { ok: !1 };
    }
    return F();
  }
  const Q = St("div", "", "ppp-gift-fold");
  let et = 250000n, z = "", q = "";
  const $ = (v) => {
    try {
      const F = JSON.parse(t.store.get(L0(v)) || "[]");
      return Array.isArray(F) ? F : [];
    } catch {
      return [];
    }
  }, L = (v, F) => t.store.set(L0(v), JSON.stringify(F.slice(0, 50)));
  async function b(v) {
    const F = $(v);
    for (const j of F)
      if (!(j.view && ["claimed", "refunded", "expired"].includes(j.view.status)))
        try {
          j.view = !j.view || j.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: j.id, ...j.txid ? { txid: j.txid } : {} }) }) : await t.json("/radio/gift?id=" + j.id), j.error = void 0;
        } catch (V) {
          j.error = V.message;
        }
    L(v, F), t.changed();
  }
  async function T(v) {
    if (z) return;
    z = "Starting your gift…", q = "", t.changed();
    let F = null;
    try {
      F = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: v, amount: et.toString() }) });
      const j = $(v);
      j.unshift({ id: F.id, code: F.code, amount: et.toString(), at: t.now() }), L(v, j), z = "Approve the gift in your wallet…", t.changed();
      const V = await t.pay(v, F.depositTo, BigInt(F.deposit), F.memo), ft = $(v), ot = ft.find((se) => se.id === F.id);
      ot && (ot.txid = V, ot.view = { status: "pending-deposit", amount: et.toString(), source: "friend", from: v, label: "", expires: 0 }), L(v, ft), q = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", b(v);
    } catch (j) {
      q = j.message || "Not sent.";
    } finally {
      z = "", t.changed();
    }
  }
  const D = (v) => "xtrata.radio.gift.players.v1:" + v, C = (v) => {
    try {
      const F = JSON.parse(t.store.get(D(v)) || "[]");
      return Array.isArray(F) ? F.filter((j) => j && /^[0-9a-f]{16}$/.test(j.id)) : [];
    } catch {
      return [];
    }
  };
  async function it(v, F) {
    var j;
    if (!z) {
      z = "Checking the player…", q = "", t.changed();
      try {
        const V = F.tracks.split(/[\s,]+/).filter(Boolean).map((de) => Number(de.replace(/^#/, ""))), ft = S6({ title: F.title.trim(), subtitle: F.subtitle.trim(), tracks: V, cover: (j = F.cover) != null && j.trim() ? Number(F.cover.trim().replace(/^#/, "")) : null });
        z = "Sign in your wallet…", t.changed();
        const ot = { admin: v, hash: E6(ft), issued: t.now() }, se = await t.sign(v, A6(ot));
        z = "Making the player…", t.changed();
        const Kt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: ft, request: ot, signature: se }) }), ie = C(v).filter((de) => de.id !== Kt.id);
        ie.unshift({ id: Kt.id, title: Kt.title, tracks: Kt.tracks }), t.store.set(D(v), JSON.stringify(ie.slice(0, 30))), q = `${Kt.existing ? "That player already exists" : "Player made"} ✓ “${Kt.title}” · ${Kt.tracks} songs. Pick it below for a batch.`;
      } catch (V) {
        q = V.message || "Not made.";
      } finally {
        z = "", t.changed();
      }
    }
  }
  const W = (v, F) => u6(v || location.origin + "/radio.html", F), Et = (v) => {
    try {
      const F = JSON.parse(t.store.get(C0(v)) || "[]");
      return Array.isArray(F) ? F.filter((j) => j && /^[0-9a-f]{16}$/.test(j.id) && Array.isArray(j.codes)) : [];
    } catch {
      return [];
    }
  }, k = (v, F) => t.store.set(C0(v), JSON.stringify(F.slice(0, 20))), H = (v) => !!v.view && v.view.status === "live" && v.view.copies.waiting + v.view.copies.claiming + v.view.copies.refunding === 0, at = (v, F) => t.json(v, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(F) });
  let ct = 0;
  async function ut(v) {
    const F = Et(v);
    for (const j of F)
      if (!H(j))
        try {
          j.view = !j.view || j.view.status === "pending-deposit" ? await at("/radio/gift/batch/confirm", { id: j.id, ...j.txid ? { txid: j.txid } : {} }) : await t.json("/radio/gift/batch?id=" + j.id), j.error = void 0;
        } catch (V) {
          j.error = V.message;
        }
    try {
      const j = await t.json("/radio/gift/batches?creator=" + encodeURIComponent(v));
      for (const V of (j == null ? void 0 : j.batches) ?? []) {
        const ft = F.find((ot) => ot.id === V.id);
        if (ft) {
          ft.error || (ft.view = V);
          continue;
        }
        F.push({ id: V.id, codes: [], count: V.count, amount: V.amount, label: V.label, player: V.player, depositTo: "", deposit: V.deposit, memo: V.memo, at: 0, view: V });
      }
    } catch {
    }
    k(v, F), t.changed();
  }
  async function kt(v, F) {
    const j = Et(v).find((V) => V.id === F);
    if (!(!j || !j.depositTo || z)) {
      z = "Approve the payment in your wallet…", q = "", t.changed();
      try {
        const V = await t.pay(v, j.depositTo, BigInt(j.deposit), j.memo), ft = Et(v), ot = ft.find((se) => se.id === F);
        ot && (ot.txid = V), k(v, ft), q = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", z = "", ut(v);
      } catch (V) {
        q = `${/cancel/i.test(V.message) ? "Payment cancelled." : V.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        z = "", t.changed();
      }
    }
  }
  async function ge(v, F, j, V) {
    if (z) return;
    if (!F.ok) {
      q = F.reason, t.changed();
      return;
    }
    z = "Sign in your wallet…", q = "", t.changed();
    let ft = null;
    try {
      const ot = { creator: v, count: F.count, amount: F.amount.toString(), label: j, issued: t.now(), ...V ? { player: V } : {} }, se = await t.sign(v, h6(ot));
      z = "Making your links…", t.changed(), ft = await at("/radio/gift/batch", { request: ot, signature: se });
      const Kt = Et(v);
      Kt.unshift({ id: ft.id, codes: ft.codes, count: F.count, amount: ft.amount, label: j, player: V ?? null, depositTo: ft.depositTo, deposit: ft.deposit, memo: ft.memo, at: t.now() }), k(v, Kt);
    } catch (ot) {
      q = ot.message || "Not made.", z = "", t.changed();
      return;
    }
    z = "", t.changed(), await kt(v, ft.id);
  }
  function It() {
    const v = !!Ue.value, F = At.value === "max" ? g6(v) : Number(At.value), j = p6(F, v), V = Number(Se.value);
    return !Number.isInteger(V) || V < 1 || V > Ll ? { ok: !1, reason: `Make 1 to ${Ll} copies at a time.`, album: v, plays: F, amount: j, count: V } : b6(j) ? { ok: !0, reason: "", album: v, plays: F, amount: j, count: V, bill: w6(V, j, v) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: v, plays: F, amount: j, count: V };
  }
  const Xt = () => {
    const v = It();
    if (!v.ok) return v.reason;
    const F = v.bill;
    return `Each copy: ${v.plays.toLocaleString()} paid plays (${Gn(F.holders)} to song holders, ${Gn(F.fees)} network fees)${v.album ? `, ${Gn(F.float)} for the album’s likes` : ""}, ${Gn(F.reserve)} kept so a listener can return what is left, + ${Gn(F.sendFee)} to send it = ${Gn(F.perCopy)} STX. ${v.count} copies = ${Gn(F.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Lt = (v, F) => F.codes.map((j) => W(v, j)), N = St("input");
  N.type = "range", N.min = String(gw), N.max = String(Jf), N.step = "10000", N.value = String(et), N.setAttribute("aria-label", "Gift amount");
  const lt = St("p", "", "ppp-gift-amount"), Ct = Lr("", () => {
    const v = t.main();
    v && T(v);
  }, "primary"), tn = () => {
    lt.textContent = ae(), Ct.textContent = `Gift ${Gn(et)} STX`;
  };
  N.oninput = () => {
    et = BigInt(N.value), tn();
  };
  const ae = () => `${Gn(et)} STX · about ${_a(et).toLocaleString()} paid plays · you pay ${Gn(et + Ac)} STX with the network fee`;
  tn();
  const Oe = St("input");
  Oe.maxLength = 60, Oe.placeholder = "Title, e.g. Proof of Sound", Oe.setAttribute("aria-label", "Player title");
  const en = St("input");
  en.maxLength = 80, en.placeholder = "Artist (optional)", en.setAttribute("aria-label", "Player subtitle");
  const Le = St("textarea");
  Le.rows = 3, Le.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Le.setAttribute("aria-label", "Songs");
  const nn = St("input");
  nn.inputMode = "numeric", nn.placeholder = "Cover inscription number (optional), shown when the album loads", nn.setAttribute("aria-label", "Cover inscription");
  const Ue = St("select");
  Ue.setAttribute("aria-label", "Batch album");
  const At = St("select");
  At.setAttribute("aria-label", "Plays per copy");
  for (const v of k6) At.append(Ua(`${v.toLocaleString()} plays`, String(v)));
  At.append(Ua("Max (1 STX)", "max"));
  const Se = St("input");
  Se.type = "number", Se.min = "1", Se.max = String(Ll), Se.value = "10", Se.setAttribute("aria-label", "Copies");
  const ue = St("input");
  ue.maxLength = 40, ue.placeholder = "Label, e.g. Opera launch", ue.setAttribute("aria-label", "Batch label");
  const Dn = St("p", "", "ppp-mute"), Fn = () => {
    Dn.textContent = Xt();
  };
  for (const v of [Ue, At, Se])
    v.oninput = Fn, v.onchange = Fn;
  Fn();
  function De(v) {
    var ft, ot;
    const F = (ft = v.gate) == null ? void 0 : ft.gifts;
    if (!(F != null && F.enabled) || !F.admin || ["off", "elsewhere", "unsupported"].includes(v.step)) return null;
    const j = t.main(), V = [St("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!j)
      V.push(St("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (F.admin) {
      const se = St("div", "", "ppp-gift-admin"), Kt = (Mt, $t) => {
        const Tt = St("label", Mt);
        return Tt.append($t), Tt;
      }, ie = C(j);
      se.append(
        St("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        Oe,
        en,
        Le,
        nn,
        Lr("Sign and make player", () => void it(j, { title: Oe.value, subtitle: en.value, tracks: Le.value, cover: nn.value }))
      );
      const de = Lr("Sign, pay and make links", () => {
        ge(j, It(), ue.value.trim(), Ue.value || void 0);
      });
      de.disabled = !!z;
      const Ae = Ue.value;
      Ue.replaceChildren(Ua("No album (starter copies)", ""), ...ie.map((Mt) => Ua(`${Mt.title} · ${Mt.tracks} songs`, Mt.id))), ie.some((Mt) => Mt.id === Ae) && (Ue.value = Ae), Fn(), se.append(
        St("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        Kt("Album ", Ue),
        Kt("Plays each ", At),
        Kt("Copies ", Se),
        ue,
        Dn,
        de
      ), t.now() - ct > 3e4 && (ct = t.now(), ut(j));
      const ye = Et(j);
      if (ye.length) {
        const Mt = St("ul", "", "ppp-gift-list");
        for (const $t of ye.slice(0, 10)) {
          const Tt = $t.view, te = Tt == null ? void 0 : Tt.copies, ve = $t.error ? $t.error : !Tt || Tt.status === "pending-deposit" ? $t.txid ? "payment confirming…" : "waiting for your payment" : `${te.claimed} of ${Tt.count} claimed${te.refunding + te.refunded ? ` · ${te.refunded} refunded${te.refunding ? `, ${te.refunding} on their way` : ""}` : ""}`, he = St("li");
          if (he.append(St("span", `${$t.label || "Batch"} · ${$t.count} × ${Gn(BigInt($t.amount))} STX`, "t"), St("span", ve, "ppp-mute")), !$t.txid && $t.depositTo && (!Tt || Tt.status === "pending-deposit") && he.append(Lr("Pay now", () => void kt(j, $t.id), "tiny")), $t.codes.length && (Tt == null ? void 0 : Tt.status) === "live") {
            const jn = Lt(((ot = v.gate) == null ? void 0 : ot.radioUrl) ?? null, $t);
            he.append(
              Ui("batch-copy:" + $t.id, "Copy all links", () => jn.join(`
`), "tiny", t.changed),
              Ui("batch-csv:" + $t.id, "Copy as CSV", () => ["copy,link", ...jn.map((mn, Ar) => `${Ar + 1},${mn}`)].join(`
`), "tiny", t.changed)
            );
          } else $t.codes.length || he.append(St("span", "links were made on another device", "ppp-mute"));
          Mt.append(he);
        }
        se.append(Mt);
      }
      V.push(se);
    }
    return z && V.push(St("p", z, "ppp-cyan")), q && V.push(St("p", q, /✓/.test(q) ? "ppp-ok" : "ppp-warn")), Q.replaceChildren(...V), Q;
  }
  return { banner: U, funder: _, renderFold: De, liveGift: o, incomingAlbum: a, setAside: c, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: E };
}
const C6 = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function T6(t) {
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
const B6 = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function M6(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((i) => (!e.pinnedOnly || e.pins.has(i.slot)) && (() => {
    const o = B6(i);
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
function N6(t, e = 100) {
  const n = Object.entries(t).sort((r, s) => s[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const Du = /* @__PURE__ */ new Set(), ww = (t) => (Du.add(t), () => {
  Du.delete(t);
}), Fu = () => {
  for (const t of [...Du])
    try {
      t();
    } catch {
    }
}, T0 = "xtrata:al-thumb:v1:", bw = "-", xo = 96, P6 = 24 * 1024 * 1024, hn = /* @__PURE__ */ new Map(), B0 = /* @__PURE__ */ new Set(), ju = [];
let Tl = !1, Bl;
const vc = (t, e) => {
  try {
    if (e === void 0) return window.localStorage.getItem(T0 + t);
    window.localStorage.setItem(T0 + t, e);
  } catch {
  }
  return null;
};
function td(t) {
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
          r.width = r.height = xo, s.fillStyle = "#143a40", s.fillRect(0, 0, xo, xo), s.drawImage(i, (i.naturalWidth - a) / 2, (i.naturalHeight - a) / 2, a, a, 0, 0, xo, xo), e(r.toDataURL("image/jpeg", 0.82));
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
async function _6(t) {
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
    let x = 0;
    for (; ; ) {
      const S = r.slice(x).search(/<img\b/i);
      if (S < 0)
        return r = p ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const M = x + S, G = r.indexOf(">", M);
      if (G < 0)
        return r = r.slice(M), null;
      const K = r.slice(M, G + 1), E = K.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (E) return E[1].replace(/&amp;/g, "&");
      const U = K.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (U) return "/inscription/" + U[1];
      x = G + 1;
    }
  }, o = (w = (l = e.body) == null ? void 0 : l.getReader) == null ? void 0 : w.call(l);
  if (!o)
    return r = await e.text(), i(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: p, value: x } = await o.read();
    if (p) break;
    s += x.byteLength, r += a.decode(x, { stream: !0 });
    const S = i(!1);
    if (S)
      return await o.cancel(), S;
    if (s > P6)
      return await o.cancel(), null;
  }
  return r += a.decode(), i(!0) ?? "";
}
async function U6() {
  if (!Tl) {
    Tl = !0;
    try {
      for (; ju.length; ) {
        const t = ju.shift();
        if (!hn.has(t))
          try {
            const e = await _6(t);
            if (e === null) continue;
            if (!e) {
              hn.set(t, ""), vc(t, bw), Fu();
              continue;
            }
            const n = await td(e);
            hn.set(t, n), n.startsWith("data:image/jpeg") && vc(t, n), Fu();
          } catch {
          }
      }
    } finally {
      Tl = !1;
    }
  }
}
function mw(t, e) {
  if (e && !hn.get(t) ? (hn.set(t, e), td(e).then((r) => {
    r !== e && (hn.set(t, r), r.startsWith("data:image/jpeg") && vc(t, r), Fu());
  })) : e === "" && !hn.has(t) && hn.set(t, ""), hn.has(t)) return hn.get(t);
  const n = vc(t);
  if (n != null) {
    const r = n === bw ? "" : n;
    return hn.set(t, r), r;
  }
  return B0.has(t) || (B0.add(t), ju.push(t), Bl || (Bl = setTimeout(() => {
    Bl = void 0, U6();
  }, 1200))), "";
}
const Li = 12, H6 = 5e3, on = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Ci = (t, e, n = "") => {
  const r = on("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function O6(t) {
  let e, n = [], r = 0, s = !1, i = !1, o = -1 / 0, a = "", c = "recent", u = !1, f = Li;
  const l = on("div", "", "ppp-shelf-box");
  ww(() => t.changed());
  const w = (b) => "xtrata.radio.shelf.pins.v1:" + b, p = (b) => "xtrata.radio.shelf.recent.v1:" + b, x = (b, T) => {
    try {
      return JSON.parse(t.store.get(b) || "null") ?? T;
    } catch {
      return T;
    }
  }, S = (b) => new Set(x(w(b), []).filter((T) => Number.isSafeInteger(T))), M = (b) => {
    const T = x(p(b), {}), D = {};
    for (const [C, it] of Object.entries(T)) Number.isSafeInteger(Number(C)) && typeof it == "number" && (D[Number(C)] = it);
    return D;
  };
  async function G(b) {
    if (!s) {
      s = !0, i = !1;
      try {
        const T = [];
        let D = 0, C = 0;
        for (let it = 0; it < H6 / 100 + 1; it++) {
          const W = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(b)}&after=${D}&limit=100`);
          if (T.push(...T6(W == null ? void 0 : W.shelf)), C = Number(W == null ? void 0 : W.total) || T.length, !(W != null && W.next) || !Number.isSafeInteger(W.next)) break;
          D = W.next;
        }
        b === e && (n = T, r = C, o = t.now());
      } catch {
        i = !0;
      } finally {
        s = !1, t.changed();
      }
    }
  }
  const K = () => {
    o = -1 / 0;
  }, E = on("input");
  E.type = "search", E.placeholder = "Search title, artist or #", E.setAttribute("aria-label", "Search your albums"), E.oninput = () => {
    a = E.value, f = Li, t.changed();
  };
  const U = on("select");
  U.setAttribute("aria-label", "Sort albums");
  for (const b of C6) {
    const T = document.createElement("option");
    T.value = b.value, T.textContent = b.label, U.append(T);
  }
  U.onchange = () => {
    c = U.value, f = Li, t.changed();
  };
  const _ = Ci("", () => {
    u = !u, f = Li, t.changed();
  }, "tiny"), Q = on("div", "", "ppp-shelf-tools");
  Q.append(E, U, _);
  const et = on("div"), z = on("div");
  function q(b) {
    const T = b.step === "off" || b.step === "elsewhere" ? void 0 : b.root;
    if (T !== e && (e = T, n = [], r = 0, o = -1 / 0, f = Li), !T || b.walletCannotAlbums) return null;
    if (!s && t.now() - o > 5 * 6e4 && G(T), !n.length)
      return i ? (z.replaceChildren(on("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Ci("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(z), l) : null;
    const D = S(T), C = M(T), it = M6(n, { query: a, sort: c, pinnedOnly: u, pins: D, recents: C });
    E.value !== a && (E.value = a), U.value = c, _.textContent = u ? "★ Pinned only" : "☆ Pinned only", _.setAttribute("aria-pressed", String(u));
    const W = [];
    if (b.slot > 0 && W.push(Ci("← My player", () => t.open(0), "quiet")), !it.length) W.push(on("p", "No album matches that.", "ppp-mute"));
    else {
      const Et = on("ul", "", "ppp-shelf-list");
      for (const k of it.slice(0, f)) {
        const H = on("li", "", k.slot === b.slot ? "now" : ""), at = D.has(k.slot), ct = Ci(at ? "★" : "☆", () => {
          const Ct = new Set(D);
          at ? Ct.delete(k.slot) : Ct.add(k.slot), t.store.set(w(T), JSON.stringify([...Ct])), t.changed();
        }, "tiny");
        ct.setAttribute("aria-label", at ? `Unpin ${k.player.title}` : `Pin ${k.player.title}`);
        const ut = [k.player.subtitle, `${Ds(k.player).length} ${Ds(k.player).length === 1 ? "song" : "songs"}`, k.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), kt = k.slot === b.slot, ge = Ci(kt ? "Playing" : "Select", () => {
          t.store.set(p(T), JSON.stringify(N6({ ...C, [k.slot]: t.now() }))), t.open(k.slot);
        }, kt ? "tiny ppp-pick" : "tiny primary ppp-pick");
        ge.disabled = kt;
        const It = Ds(k.player)[0], Xt = k.player.cover ?? (It == null ? void 0 : It.id), Lt = Xt ? mw(String(Xt)) : "", N = on("span", "", "ppp-shelf-art");
        if (Lt) {
          const Ct = document.createElement("img");
          Ct.src = Lt, Ct.alt = "", Ct.decoding = "async", N.append(Ct);
        } else N.textContent = "💿";
        const lt = on("span", "", "ppp-shelf-txt");
        lt.append(on("span", k.player.title, "t"), on("span", ut, "ppp-mute")), H.append(ct, N, lt, ge), Et.append(H);
      }
      W.push(Et), it.length > f && W.push(Ci(`Show more (${it.length - f} left)`, () => {
        f += Li, t.changed();
      }, "quiet"));
    }
    return i && W.push(on("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), et.replaceChildren(...W), l.firstChild !== Q && l.replaceChildren(Q, et), l;
  }
  return { render: q, invalidate: K, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const b = M(e), T = [...n].filter((D) => D.player).sort((D, C) => (b[C.slot] ?? 0) - (b[D.slot] ?? 0) || C.slot - D.slot)[0];
    return T ? { slot: T.slot, title: T.player.title } : null;
  } };
}
const D6 = 20, Ze = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, Ce = {
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
function Z(t, e = {}, ...n) {
  const r = document.createElement(t);
  for (const [s, i] of Object.entries(e))
    i == null || i === !1 || (s === "class" ? r.className = String(i) : s === "html" ? r.innerHTML = String(i) : s.startsWith("on") && typeof i == "function" ? r[s.toLowerCase()] = i : s === "disabled" ? r.disabled = !!i : r.setAttribute(s, i === !0 ? "" : String(i)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const sn = (t, ...e) => Z("button", { type: "button", ...t }, ...e), Ha = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, So = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, F6 = { music: "My music", device: "This device", gifts: "Albums (admin)" }, j6 = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function M0(t, e, n = {}) {
  const r = !!n.list;
  let s = null, i = "", o = !1;
  const a = document.documentElement, c = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set();
  function f(b) {
    var D, C, it;
    if (!b || !Number.isSafeInteger(b)) return "";
    const T = (it = (C = (D = e.radio()) == null ? void 0 : D.getState) == null ? void 0 : C.call(D)) == null ? void 0 : it.albumCover;
    return T != null && T.url && Number(T.tokenId) === b ? T.url : c.has(b) ? c.get(b) : (u.has(b) || (u.add(b), fetch("/inscription/" + b, { signal: AbortSignal.timeout(2e4) }).then(async (W) => {
      var k, H, at, ct;
      const Et = (W.headers.get("content-type") || "").toLowerCase();
      if (!W.ok)
        throw await ((k = W.body) == null ? void 0 : k.cancel()), new Error("no cover");
      return Et.startsWith("image/") ? (await ((H = W.body) == null ? void 0 : H.cancel()), "/inscription/" + b) : Et.includes("text/html") ? (((at = (await W.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : at[1]) ?? "").replace(/&amp;/g, "&") : (await ((ct = W.body) == null ? void 0 : ct.cancel()), "");
    }).then((W) => {
      c.set(b, W), L();
    }).catch(() => {
      u.delete(b);
    })), "");
  }
  ww(() => L());
  function l(b) {
    var D;
    i = b, b ? a.dataset.sheet = b : delete a.dataset.sheet;
    const T = document.querySelector(".side");
    if (b && b !== "more") {
      for (const W of j6[b]) {
        const Et = T == null ? void 0 : T.querySelector(W);
        Et && (Et.open = !0);
      }
      const C = document.getElementById("sheetTitle");
      C && (C.textContent = F6[b]);
      const it = document.getElementById("sheetExtra");
      it && it.replaceChildren(...b === "music" ? [p()] : []), (D = T == null ? void 0 : T.scrollTo) == null || D.call(T, { top: 0 });
    }
    L();
  }
  const w = r ? null : document.getElementById("sheetClose");
  w && (w.onclick = () => l("")), r || document.addEventListener("keydown", (b) => {
    b.key === "Escape" && i && a.dataset.view === "album" && l("");
  });
  const p = () => sn(
    { class: "al-row", onClick: () => {
      l(""), e.openPlayer();
    } },
    Z("span", { class: "al-row-i", html: Ce.radio }),
    Z("span", { class: "al-row-t" }, Z("b", {}, "Xtrata Radio"), Z("small", {}, "Every song on-chain · FM, liked, all")),
    Z("span", { class: "al-row-go", html: Ce.right })
  );
  let x = null, S = !1;
  const M = () => {
    var T;
    const b = e.radio();
    S || !(b != null && b.subscribe) || (S = !0, b.subscribe((D) => {
      x = D, (s == null ? void 0 : s.mode) === "open" && L();
    }), x = ((T = b.getState) == null ? void 0 : T.call(b)) ?? null);
  };
  r || setInterval(() => {
    var C, it;
    if ((s == null ? void 0 : s.mode) !== "open" || !(x != null && x.playing)) return;
    const b = (it = (C = e.radio()) == null ? void 0 : C.getPosition) == null ? void 0 : it.call(C), T = t.querySelector(".al-bar > i"), D = t.querySelectorAll(".al-times span");
    !b || !T || (T.style.width = b.duration ? `${Math.min(100, b.current / b.duration * 100)}%` : "0%", D.length === 2 && (D[0].textContent = Ha(b.current || 0), D[1].textContent = b.duration ? Ha(b.duration) : "–:––"));
  }, 500);
  let G = "", K = null;
  function E(b, T, D = {}) {
    const C = D.song || f(b.cover), W = [C ? Z("img", { src: C, alt: D.song ? "Song artwork" : `${b.title} cover` }) : Z("div", { class: "al-cover-fallback" }, Z("b", {}, b.title), b.subtitle ? Z("span", {}, b.subtitle) : null), D.paused ? Z("span", { class: "al-paused" }, Z("i", { html: Ce.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], Et = "al-cover" + (T ? "" : " al-cover--small") + (D.paused ? " is-paused" : "");
    return D.flip ? (W.push(Z("span", { class: "al-flip", "aria-hidden": "true", html: Ce.flip })), sn({ class: Et + " is-flippable", "aria-label": D.flipped ? "Show this song’s artwork" : `Show the ${b.title} cover`, onClick: D.flip }, ...W)) : Z("div", { class: Et }, ...W);
  }
  function U(b) {
    return b.plays === null || b.plays === void 0 ? Z("span", { class: "al-chip al-chip--quiet" }, b.playsComing ? "Plays on their way…" : "…") : b.plays === 0 ? Z("span", { class: "al-chip al-chip--out" }, b.playsComing ? "Plays on their way…" : "No plays left") : Z("span", { class: "al-chip" + (b.plays <= D6 ? " al-chip--low" : "") }, `${So(b.plays, "play", "plays")} left`);
  }
  function _(b) {
    const T = b.player, D = T.tracks.filter((it) => !it.hidden), C = [];
    return b.mode === "arrive" && b.from && C.push(Z("p", { class: "al-from" }, Z("span", { html: Ce.gift }), Z("span", {}, Z("b", {}, b.from), " sent you an album"))), C.push(E(T, !0)), C.push(Z(
      "div",
      { class: "al-intro" },
      Z("h1", {}, T.title),
      T.subtitle ? Z("p", { class: "al-artist" }, T.subtitle) : null,
      D.length ? Z("p", { class: "al-songline" }, D.map((it) => it.title || `#${it.id}`).join(" · ")) : null,
      Z("span", { class: "al-chip" }, [So(D.length, "song", "songs"), b.offered ? So(b.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), b.status.length && C.push(Z("div", { class: "al-status", role: "status" }, ...b.status)), C.push(Z("div", { class: "al-grow" })), b.asking ? C.push(Z("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : b.primary && C.push(sn({ class: "al-primary", onClick: b.primary.run, disabled: b.busy }, Z("span", { html: Ce.playSmall }), b.primary.label)), b.hint && !b.asking && C.push(Z("p", { class: "al-hint" }, b.hint)), b.secondary && !b.asking && C.push(sn({ class: "al-link", onClick: b.secondary.run, disabled: b.busy }, b.secondary.label)), C;
  }
  function Q(b, T) {
    const { songs: D, current: C, started: it, own: W, out: Et, waiting: k } = T, H = b.player, at = e.radio(), ct = [];
    ct.push(Z("div", { class: "al-listhead" }, Z("span", {}, Z("b", {}, H.title), ` · ${So(D.length, "song", "songs")}`), U(b)));
    const ut = f(H.cover), kt = "album:" + H.cover;
    ut && !hn.has(kt) && (hn.set(kt, ut), td(ut).then((It) => {
      It !== ut && (hn.set(kt, It), L());
    }));
    const ge = ut ? hn.get(kt) || ut : "";
    return ct.push(Z("ol", { class: "al-tracks" }, ...D.map((It, Xt) => {
      const Lt = String(It.id) === C, N = mw(String(It.id), Lt && it ? W : void 0);
      return Z("li", {}, sn(
        { class: "al-track" + (Lt ? " is-on" : ""), "aria-label": `Play ${It.title || "#" + It.id}`, "aria-current": Lt ? "true" : void 0, disabled: Et || k, onClick: () => {
          var lt;
          return (lt = at == null ? void 0 : at.playToken) == null ? void 0 : lt.call(at, It.id);
        } },
        Z(
          "span",
          { class: "al-th" + (N ? "" : " is-blank") },
          N ? Z("img", { src: N, alt: "", decoding: "async" }) : ge ? Z("img", { src: ge, alt: "", decoding: "async" }) : null,
          N ? null : Z("span", { class: "al-n" }, String(Xt + 1)),
          Lt ? Z("span", { class: "al-eq", html: Ce.eq }) : null
        ),
        Z("span", { class: "al-tt" }, It.title || `#${It.id}`)
      ));
    }))), ct;
  }
  function et(b) {
    var N;
    const T = b.player, D = T.tracks.filter((lt) => !lt.hidden), C = e.radio(), it = x == null ? void 0 : x.nowPlaying, W = it && T.tracks.some((lt) => String(lt.id) === String(it.tokenId)) ? String(it.tokenId) : null, Et = W ? T.tracks.find((lt) => String(lt.id) === W) : null, k = b.plays === 0 && !b.playsComing, H = !!b.playsComing && !b.plays, at = !!(x != null && x.playing) && !!W, ct = x == null ? void 0 : x.heart, ut = W ? (N = C == null ? void 0 : C.getPosition) == null ? void 0 : N.call(C) : null;
    W && (at || ((ut == null ? void 0 : ut.current) ?? 0) > 0.5) && (G = T.id);
    const kt = !!W && G === T.id;
    K && K !== W && (K = null);
    const ge = kt ? String((it == null ? void 0 : it.cover) || "") : "", It = !!ge && K === W, Lt = [E(T, !k, { song: It ? "" : ge, paused: kt && !at, flip: ge ? () => {
      K = K === W ? null : W, L();
    } : void 0, flipped: It })];
    if (Lt.push(Z(
      "div",
      { class: "al-now" },
      Z(
        "div",
        { class: "al-now-t" },
        Z("div", { class: "al-song" }, Et ? Et.title || (it == null ? void 0 : it.title) || `#${Et.id}` : T.title),
        Z("div", { class: "al-artist" }, Et ? Et.artist || (it == null ? void 0 : it.artist) || T.subtitle : T.subtitle || "Press play")
      ),
      W ? sn({ class: "al-icon" + (ct != null && ct.liked ? " is-on" : ""), "aria-label": ct != null && ct.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(ct != null && ct.liked)), disabled: !!(ct != null && ct.pending) || !!(ct != null && ct.locked) || H, onClick: () => {
        var lt;
        return (lt = C == null ? void 0 : C.toggleLike) == null ? void 0 : lt.call(C);
      }, html: ct != null && ct.liked ? Ce.heartOn : Ce.heart }) : null
    )), k)
      Lt.push(Z(
        "div",
        { class: "al-out" },
        Z("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        Z("p", { class: "al-out-t" }, "You've played this album out"),
        Z("p", { class: "al-out-s" }, "Add plays to keep listening."),
        z(b, !0)
      ));
    else {
      const lt = ut != null && ut.duration ? Math.min(100, ut.current / ut.duration * 100) : 0;
      Lt.push(Z(
        "div",
        { class: "al-prog" },
        Z("div", { class: "al-bar" }, Z("i", { style: `width: ${lt}%` })),
        Z("div", { class: "al-times" }, Z("span", {}, Ha((ut == null ? void 0 : ut.current) || 0)), Z("span", {}, ut != null && ut.duration ? Ha(ut.duration) : "–:––"))
      ));
    }
    return Lt.push(Z(
      "div",
      { class: "al-ctl" + (k || H ? " is-off" : "") },
      sn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: k || H, onClick: () => {
        var lt;
        return (lt = C == null ? void 0 : C.prev) == null ? void 0 : lt.call(C);
      }, html: Ce.prev }),
      sn({ class: "al-play", "aria-label": at ? "Pause" : "Play", disabled: k || H, onClick: () => {
        var lt;
        return (lt = C == null ? void 0 : C.playPause) == null ? void 0 : lt.call(C);
      }, html: at ? Ce.pause : Ce.play }),
      sn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: k || H, onClick: () => {
        var lt;
        return (lt = C == null ? void 0 : C.next) == null ? void 0 : lt.call(C);
      }, html: Ce.next })
    )), b.status.length && Lt.push(Z("div", { class: "al-status", role: "status" }, ...b.status)), Lt.push(...Q(b, { songs: D, current: W, started: kt, own: ge, out: k, waiting: H })), Lt.push(Z("div", { class: "al-grow" })), Lt.push(sn(
      { class: "al-more", "aria-expanded": String(i === "more"), onClick: () => l(i === "more" ? "" : "more") },
      Z("span", {}, "More ", Z("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      Z("span", { html: Ce.down })
    )), Lt;
  }
  function z(b, T) {
    const D = Z("div", { class: "al-topups" + (T ? " al-topups--primary" : "") }), C = T ? [b.topUps[1] ?? b.topUps[0]] : [...b.topUps];
    for (const it of C) {
      const W = b.myPlays !== void 0 && b.myPlays >= it && !b.playsComing && !b.busy;
      D.append(sn({ class: "al-topup", disabled: !W, onClick: () => e.topUp(it) }, T ? `Add ${it.toLocaleString()} plays` : `+${it.toLocaleString()}`));
    }
    return T && D.append(sn({ class: "al-link", onClick: () => l("more") }, "Other amounts")), D;
  }
  function q(b) {
    const T = b.myPlays !== void 0 && b.myPlays >= (b.topUps[0] ?? 0), D = Z(
      "div",
      { class: "al-card" },
      Z("div", { class: "al-card-h" }, Z("b", {}, `Add plays to ${b.player.title}`), Z("span", { class: "al-mono" }, b.plays === null || b.plays === void 0 ? "" : `${b.plays.toLocaleString()} left`)),
      z(b, !1),
      Z("p", { class: "al-mute al-small" }, b.playsComing ? "Plays are on their way. Add more once they arrive." : b.myPlays === void 0 ? "Checking My player…" : T ? `Moved from My player · ${So(b.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !T && !b.playsComing && b.myPlays !== void 0 ? sn({ class: "al-link", onClick: () => {
        l(""), e.openPlayer();
      } }, "Open My player") : null
    ), C = (W, Et, k, H) => sn(
      { class: "al-row", onClick: H },
      Z("span", { class: "al-row-i", html: W }),
      Z("span", { class: "al-row-t" }, Z("b", {}, Et), Z("small", {}, k)),
      Z("span", { class: "al-row-go", html: Ce.right })
    ), it = Z(
      "div",
      { class: "al-how" + (o ? " is-open" : "") },
      C(Ce.info, "How plays work", "Every play counts for the song’s owner", () => {
        o = !o, L();
      }),
      o ? Z("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return Z(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      Z("div", { class: "al-sheet-h" }, Z("b", {}, "More"), sn({ class: "al-icon", "aria-label": "Close", onClick: () => l(""), html: Ce.close })),
      b.mode === "open" ? D : null,
      Z(
        "div",
        { class: "al-rows" },
        C(Ce.grid, "My music", "Your albums and the radio", () => l("music")),
        C(Ce.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          l(""), e.openPlayer();
        }),
        b.canMake ? C(Ce.gift, "Albums (admin)", "Make an album and fund copies", () => l("gifts")) : null,
        C(Ce.device, "This device", "Backup, history, Stacks wallet, returns", () => l("device")),
        it
      )
    );
  }
  function $(b) {
    var k, H;
    const T = b.player, D = x == null ? void 0 : x.nowPlaying, C = D && T.tracks.some((at) => String(at.id) === String(D.tokenId)) ? String(D.tokenId) : null, it = !!(x != null && x.playing) && !!C, W = C ? (H = (k = e.radio()) == null ? void 0 : k.getPosition) == null ? void 0 : H.call(k) : null;
    C && (it || ((W == null ? void 0 : W.current) ?? 0) > 0.5) && (G = T.id);
    const Et = !!C && G === T.id;
    return Q(b, {
      songs: T.tracks.filter((at) => !at.hidden),
      current: C,
      started: Et,
      own: Et ? String((D == null ? void 0 : D.cover) || "") : "",
      out: b.plays === 0 && !b.playsComing,
      waiting: !!b.playsComing && !b.plays
    });
  }
  function L() {
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
    const T = Z(
      "header",
      { class: "al-top" },
      Z("a", { class: "al-brand", href: "/radio" }, "Xtrata ", Z("b", {}, "Music")),
      b.mode === "open" ? sn({ class: "al-icon", "aria-label": "My music", onClick: () => l("music"), html: Ce.grid }) : null
    ), D = Z("div", { class: "al-body al-body--" + b.mode }, ...b.mode === "open" ? et(b) : _(b));
    t.replaceChildren(T, D, ...i === "more" ? [Z("div", { class: "al-scrim", onClick: () => l("") }), q(b)] : []);
  }
  return {
    render(b) {
      if (r) {
        s = b, L();
        return;
      }
      const T = !!s;
      s = b, !b && (T || i) && (i = "", delete a.dataset.sheet), b ? a.dataset.view = "album" : delete a.dataset.view, b != null && b.asking ? a.dataset.asking = "1" : delete a.dataset.asking, L();
    },
    sheet: () => i,
    setSheet: l
  };
}
const R6 = [
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
function z6(t) {
  for (const [e, n] of R6) if (n.test(t)) return e;
  return null;
}
const xw = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), Sw = (t) => /Android/.test(t);
function G6(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : xw(e) ? "x-safari-" + n.href : Sw(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const K6 = (t) => xw(t) ? "Safari" : Sw(t) ? "Chrome" : "your browser", Ti = "Xtrata Music Wallet", V6 = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function N0(t, e = (n) => n) {
  var i, o, a;
  if (t.mainConnected ?? !!t.main) return [];
  if (t.step === "off" || t.step === "elsewhere") return [];
  if (t.gate && (t.gate.enabled === !1 || t.gate.here === !1)) return [];
  if (t.step === "unsupported")
    return ((i = t.gate) == null ? void 0 : i.passkeyOnly) || t.linked || ((o = t.others) == null ? void 0 : o.length) ? [{ action: null, label: Ti, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([t.standIn, t.linked, ...t.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const u = t.standIn === c && V6.has(t.step);
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
const Ml = "xtrata.radio.novice", Ew = "xtrata.radio.novice.previewed.v1", P0 = 6 * 6e4;
function q6(t, e) {
  let n = null;
  try {
    const r = new URLSearchParams(t).get("novice");
    if (r === "1" || r === "preview")
      e.set(Ml, r), n = r;
    else {
      if (r === "0")
        return e.set(Ml, null), { on: !1, preview: !1 };
      n = e.get(Ml);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const Y6 = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, _0 = (t) => Y6.test(t ?? ""), W6 = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, X6 = {
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
}, Z6 = (t, e) => X6[t] ?? e;
function Q6(t, e) {
  switch (t) {
    case "fund":
      return e.arriving ? [] : [
        e.played ? "Out of plays." : "No plays yet.",
        "Plays come with music someone shares with you. Paying by card is on its way; other ways to add plays are under “This device”."
      ];
    case "over":
      return ["Your player is holding more than it should, so plays are paused. Open “This device” below to send the extra back."];
    default:
      return [];
  }
}
const J6 = "Make your player once, with Face ID or your fingerprint, and the music starts.", t$ = "Checking your player…", Ru = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function Aw(t) {
  try {
    const e = JSON.parse(t.get(Ew) || "[]");
    return Array.isArray(e) ? e.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function e$(t, e) {
  const n = Aw(t).filter((r) => r !== e);
  n.push(e), t.set(Ew, JSON.stringify(n.slice(-50)));
}
function Nl(t, e) {
  switch (e.kind) {
    case "offer":
      return t.album === e.album && t.phase !== "idle" ? t : { ...Ru(), album: e.album, phase: e.already ? "done" : "open" };
    case "withdraw":
      return t.phase === "idle" ? t : Ru();
    case "now":
      return t.phase === "open" && e.playing && e.track ? { ...t, phase: "playing", track: e.track, since: e.at } : t.phase === "playing" && e.track && e.track !== t.track ? { ...t, phase: "done" } : t.phase === "playing" && e.at - t.since > P0 ? { ...t, phase: "done" } : t;
    case "listened":
      return t.phase !== "playing" ? t : t.heard >= 1 ? { ...t, phase: "done" } : { ...t, heard: t.heard + 1 };
    case "tick":
      return t.phase === "playing" && e.at - t.since > P0 ? { ...t, phase: "done" } : t;
  }
}
const Oa = (t) => t.phase === "open" || t.phase === "playing", U0 = document.getElementById("ppp");
U0 && n$(U0);
function n$(t) {
  var mi;
  const e = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = Ww(), s = (d) => t.querySelector(d), i = s(".ppp-frame");
  let o = null;
  const a = async (d, m) => {
    const A = await fetch(d, { cache: "no-store", ...m, signal: AbortSignal.timeout(15e3) }), h = await A.json().catch(() => ({}));
    if (!A.ok) throw new Error((h == null ? void 0 : h.error) || `Request failed (${A.status}).`);
    return h;
  }, c = v5({
    now: Date.now,
    main: () => {
      const d = r.load();
      return d.isConnected && d.network === "mainnet" ? d.address : void 0;
    },
    config: (d) => a("/radio/listening-wallet/config?main=" + encodeURIComponent(d || "")),
    links: async (d) => (await a("/radio/listening-wallet/link?main=" + encodeURIComponent(d))).links ?? [],
    mainOf: async (d) => {
      var A;
      const m = (await a("/radio/listening-wallet/link?listening=" + encodeURIComponent(d))).links;
      return ((A = m == null ? void 0 : m.find((h) => h.listening === d)) == null ? void 0 : A.main) ?? null;
    },
    saveLink: async (d) => {
      await a("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(d) });
    },
    bridge: async (d) => {
      o = document.createElement("iframe"), o.title = "Xtrata listening wallet", o.setAttribute("allow", `publickey-credentials-get ${d}; publickey-credentials-create ${d}`), o.referrerPolicy = "no-referrer";
      const m = new Promise((vt, xt) => {
        o.addEventListener("load", () => vt(), { once: !0 }), setTimeout(() => xt(new Error("The listening wallet did not load.")), 15e3);
      });
      o.src = d + "/", i.replaceChildren(o), await m;
      const A = new Fw({ walletOrigin: d, frame: o, timeoutMs: 30 * 6e4 }), h = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), rt = (vt, xt) => h.has(vt) ? A.request(vt, xt) : Promise.race([
        A.request(vt, xt),
        new Promise((zt, ke) => setTimeout(() => ke(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await rt("listening.status"), { request: rt };
    },
    chain: {
      verify: r5,
      balance: i5,
      account: s5,
      owner: o5,
      broadcast: a5,
      transaction: c5,
      confirmedNonce: async (d) => {
        const m = await xs(`/v2/accounts/${d}?proof=0`);
        if (!Number.isSafeInteger(m == null ? void 0 : m.nonce) || m.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(m.nonce);
      }
    },
    signWithMain: (d, m) => d0({ ...m, network: "mainnet", stxAddress: d }),
    deposit: (d, m, A) => new Promise((h, rt) => a0({
      recipient: m,
      amount: A.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: d,
      network: new Pl(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (vt) => h(vt.txId || ""),
      onCancel: () => rt(new Error("Deposit cancelled. Nothing was sent.")),
      onError: rt
    })),
    validate: l5,
    tabLock: (d) => new Promise((m) => {
      const A = navigator.locks;
      if (!(A != null && A.request)) {
        m(!0);
        return;
      }
      A.request("xtrata-ppp:" + d, { ifAvailable: !0 }, async (h) => {
        m(!!h), h && await new Promise(() => {
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
      set: (d, m) => {
        try {
          localStorage.setItem(d, m);
        } catch {
        }
      }
    },
    changed: () => we(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (d) => {
      var m, A;
      return u.funder(d, () => g5(d, xs), !!((A = (m = c.snapshot().gate) == null ? void 0 : m.gifts) != null && A.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (d) => {
      const m = await a("/radio/gift/for?wallet=" + encodeURIComponent(d)), A = m == null ? void 0 : m.gift;
      if (!A) return null;
      if (typeof A.returnTo != "string" || typeof A.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: A.returnTo, from: typeof A.from == "string" ? A.from : null, source: String(A.source ?? ""), amount: String(A.amount ?? "0"), treasury: A.treasury, state: A.state === "sending" ? "sending" : "arrived", player: A.player ?? null };
    },
    history: (d, m) => b5(d, (A) => xs(A), m),
    likesChanged: () => {
      var d, m;
      (m = (d = window.XtrataRadio) == null ? void 0 : d.refreshLikes) == null || m.call(d);
    },
    likeState: async (d, m) => {
      const A = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: d, ids: String(m) })), h = Array.isArray(A == null ? void 0 : A.rows) ? A.rows.find((rt) => (rt == null ? void 0 : rt.id) === m) : null;
      if (!h || typeof h.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: h.liked, by: Array.isArray(h.by) ? h.by.filter((rt) => typeof rt == "string") : h.liked ? [d] : [] };
    },
    likeSent: (d, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: d, liked: m } })),
    nameOf: (d) => Le(d) ?? void 0,
    likeConfirmed: (d, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: d, liked: m } })),
    likeFailed: (d) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: d } }))
  }), u = L6({
    json: a,
    main: () => {
      const d = r.load();
      return d.isConnected && d.network === "mainnet" ? d.address : void 0;
    },
    pay: (d, m, A, h) => new Promise((rt, vt) => a0({
      recipient: m,
      amount: A.toString(),
      memo: h,
      stxAddress: d,
      network: new Pl(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (xt) => rt(xt.txId || ""),
      onCancel: () => vt(new Error("Gift cancelled. Nothing was sent.")),
      onError: vt
    })),
    sign: (d, m) => d0({ ...m, network: "mainnet", stxAddress: d }),
    giftSent: (d, m) => c.giftSent(d, m),
    claiming: (d) => c.giftClaiming(d),
    album: { bind: (d) => c.bindAlbum(d), arrived: async (d, m, A, h) => {
      f.invalidate(), await c.albumArriving(d, m, A, h);
    } },
    who: (d) => At(d),
    changed: () => we(c.snapshot()),
    store: {
      get: (d) => {
        try {
          return localStorage.getItem(d);
        } catch {
          return null;
        }
      },
      set: (d, m) => {
        try {
          m === null ? localStorage.removeItem(d) : localStorage.setItem(d, m);
        } catch {
        }
      }
    },
    now: Date.now
  }), f = O6({
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
      set: (d, m) => {
        try {
          m === null ? localStorage.removeItem(d) : localStorage.setItem(d, m);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => we(c.snapshot())
  }), l = {
    get: (d) => {
      try {
        return localStorage.getItem(d);
      } catch {
        return null;
      }
    },
    set: (d, m) => {
      try {
        m === null ? localStorage.removeItem(d) : localStorage.setItem(d, m);
      } catch {
      }
    }
  }, w = q6(location.search, l);
  w.on && (document.documentElement.dataset.novice = w.preview ? "preview" : "1");
  const p = (d) => w.on && d.solo, x = w.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), S = x ? document.getElementById("album") : null, M = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (d) => void c.topUpAlbum(d),
    openPlayer: () => void c.openAlbum(0)
  }, G = S ? M0(S, M) : null, K = document.getElementById("albumList"), E = K ? M0(K, M, { list: !0 }) : null, U = "xtrata.radio.album.last.v1", _ = () => {
    try {
      const d = JSON.parse(localStorage.getItem(U) || "null");
      return d && typeof d.root == "string" && Number.isSafeInteger(d.slot) && d.slot > 0 && d.player && Array.isArray(d.player.tracks) ? d : null;
    } catch {
      return null;
    }
  };
  let Q = "";
  const et = (d) => {
    const m = JSON.stringify(d);
    if (m !== Q) {
      Q = m;
      try {
        localStorage.setItem(U, m);
      } catch {
      }
    }
  };
  let z = null;
  window.XtrataRadioLikeHandler = (d) => {
    var A;
    if (!d || !Number.isSafeInteger(d.song) || d.song < 0) return !1;
    (A = c.snapshot().likeFunds) != null && A.album && (H = !0), De();
    const m = Ee(d.song, { title: d.title, artist: d.artist });
    return c.heart({ song: d.song, title: m.title || void 0, artist: m.artist || void 0, likedBy: Array.isArray(d.likedBy) ? d.likedBy : void 0 });
  };
  let q;
  window.XtrataRadioListeningIdentity = () => {
    const d = c.snapshot();
    return d.solo && d.step !== "off" && d.step !== "elsewhere" ? d.listening : void 0;
  };
  const $ = (d) => {
    var A, h;
    const m = window.XtrataRadioListeningIdentity();
    m !== q && (q = m, (h = (A = window.XtrataRadio) == null ? void 0 : A.refreshLikes) == null || h.call(A));
  };
  let L = Ru(), b = null;
  const T = (d) => {
    const m = w.preview && !nn && d.step === "intro" ? u.incomingAlbum() : null;
    return m ? (L = Nl(L, { kind: "offer", album: m.player.id, already: Aw(l).includes(m.player.id) }), Oa(L) ? m.player : null) : (L = Nl(L, { kind: "withdraw" }), null);
  }, D = (d) => {
    const m = L.phase;
    L = Nl(L, d), L.phase !== m && (L.album && (L.phase === "playing" || L.phase === "done") && e$(l, L.album), we(c.snapshot()));
  };
  setInterval(() => {
    L.phase === "playing" && D({ kind: "tick", at: Date.now() });
  }, 5e3);
  let C = "", it, W = !1, Et = !1;
  const k = (d, m) => {
    var Rt, pe, Yt, un, Xe, Fe, Rn, Ln;
    const A = window.XtrataRadio;
    if (!(A != null && A.setGiftPlayer) || !(A != null && A.setGiftStop)) return;
    const h = m.depositPending && d.step === "fund" && ((Rt = d.giftStop) == null ? void 0 : Rt.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : d.giftStop, rt = b, vt = h ? p(d) ? Z6(h.reason, h.text) : h.text : null, xt = rt ? null : vt ?? (e && (!((pe = d.gate) != null && pe.here) || d.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    xt && xt !== it && (A.setGiftStop(xt), it = xt);
    const zt = d.step === "off" || d.step === "elsewhere" ? null : ((Yt = d.gift) == null ? void 0 : Yt.player) ?? rt ?? null, ke = zt ? zt.id + ":" + zt.cover + ":" + zt.tracks.map((Sn) => Sn.id).join(",") : "";
    ke !== C && (A.setGiftPlayer(zt ? { id: zt.id, title: zt.title, subtitle: zt.subtitle, tracks: Ds(zt).map((Sn) => Sn.id), hidden: ((un = v6(zt)) == null ? void 0 : un.id) ?? null, cover: zt.cover } : null), C = ke), xt !== it && (A.setGiftStop(xt), it = xt);
    const Ke = (h == null ? void 0 : h.reason) === "arriving";
    Ke !== Et && ((Xe = A.setGiftWait) == null || Xe.call(A, Ke), Et = Ke);
    const He = !!zt && (!!rt || !!((Fe = d.albumLock) != null && Fe.locked));
    He !== W && ((Rn = A.setGiftLock) == null || Rn.call(A, He), W = He), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(d.step) && ((Ln = A.forgetWallets) == null || Ln.call(A));
  };
  let H = !1;
  const at = /* @__PURE__ */ new Map(), ct = (d) => {
    if (!(d.step === "fund" && !d.depositPending && !!d.gift && !!d.listening && d.balance === 0n && !d.entries.some((h) => h.kind === "play") && (d.brandNew || d.createdHere))) return null;
    let A = at.get(d.listening);
    return A === void 0 && (A = Date.now(), at.set(d.listening, A)), Date.now() - A < Sc ? A : null;
  }, ut = (d) => d.step === "fund" && !d.depositPending && !!d.gift && d.balance === 0n && !d.entries.some((m) => m.kind === "play") && !!d.listening && at.has(d.listening), kt = (d) => d ? d.slice(0, 6) + "…" + d.slice(-4) : "", ge = (d) => {
    const m = c.snapshot().playCost || 350n;
    return d > Ge ? Number((d - Ge) / m) : 0;
  }, It = (d) => (Number(d) / 1e6).toFixed(d < 1000n ? 6 : 4), Xt = (d) => {
    const m = Math.round((Date.now() - d) / 6e4);
    return m < 1 ? "now" : m < 60 ? `${m}m` : m < 1440 ? `${Math.round(m / 60)}h` : `${Math.round(m / 1440)}d`;
  }, Lt = (d) => `https://explorer.hiro.so/txid/${d}?chain=mainnet`, N = (d, m = "", A = "") => {
    const h = document.createElement(d);
    return m && (h.textContent = m), A && (h.className = A), h;
  }, lt = (d, m, A = "") => {
    const h = N("button", d, A);
    return h.type = "button", h.onclick = m, h;
  }, Ct = (d, m) => {
    const A = N("a", d);
    return A.href = m, A.target = "_blank", A.rel = "noopener", A;
  };
  let tn = null, ae = location.hash === "#give";
  ae && history.replaceState(null, "", location.pathname + location.search);
  let Oe = !1;
  const en = a6((d) => o6({ address: d, network: "mainnet" }), () => we(c.snapshot())), Le = (d) => en.get(d), nn = z6(navigator.userAgent), Ue = (d, m) => {
    const A = navigator.userAgent, h = K6(A), rt = `${location.origin}${location.pathname}${m ? `#gift=${m}` : ""}`, vt = [N("p", `You are in ${d}'s built-in browser, where passkeys often do not work. Open this page in ${h} to make your listening wallet${m ? " and claim your gift" : ""}.`, "ppp-warn")], xt = N("div", "", "ppp-open-row"), zt = G6(rt, A);
    if (zt) {
      const ke = N("a", `Open in ${h}`, "primary ppp-open-in");
      ke.href = zt, ke.dataset.homeAction = "radio:open-in-browser", xt.append(ke);
    }
    return xt.append(Ui("copy-page-link", "Copy link", () => rt, zt ? "" : "primary", () => we(c.snapshot()))), vt.push(xt, N("p", `If that does not open ${h}, use ${d}'s menu (••• or ⋮) and choose "Open in ${h === "your browser" ? "browser" : h}", or paste the copied link there.`, "ppp-mute")), vt;
  }, At = (d) => Le(d) ?? kt(d), Se = (d) => d.slice(0, 2).map(At).join(" and ") + (d.length > 2 ? ` and ${d.length - 2} more` : ""), ue = /* @__PURE__ */ new Map();
  let Dn = !1;
  const Fn = (d) => !d || /^(?:Inscription )?#\d+$/.test(d.trim()), De = () => {
    Dn || (Dn = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((d) => d.ok ? d.json() : null).then((d) => {
      for (const m of Array.isArray(d == null ? void 0 : d.tracks) ? d.tracks : []) {
        const A = Number(m == null ? void 0 : m.id);
        Number.isSafeInteger(A) && ue.set(A, { title: typeof m.title == "string" ? m.title : void 0, artist: typeof m.artist == "string" ? m.artist : void 0 });
      }
      we(c.snapshot());
    }).catch(() => {
      Dn = !1;
    }));
  }, Ee = (d, m) => {
    const A = ue.get(d), h = l6(d, [A == null ? void 0 : A.title, m == null ? void 0 : m.title].find((vt) => !Fn(vt)) || ""), rt = c6(d, (A == null ? void 0 : A.artist) || (m == null ? void 0 : m.artist) || "");
    return { title: h, artist: rt };
  }, v = (d) => {
    const { title: m, artist: A } = Ee(d.song, d);
    return m ? `“${m}”${A ? ` — ${A}` : ""}` : `Song #${d.song}${A ? ` — ${A}` : ""}`;
  }, F = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, j = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function V(d) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(d.step) ? ["", ""] : d.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : d.step === "over" ? ["TOO MUCH", "bad"] : d.step === "locked" ? ["LOCKED", "mute"] : d.step === "intro" || d.step === "link" ? ["", ""] : d.step === "fund" ? d.depositPending ? ["ON ITS WAY", "warn"] : d.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : d.payingOn && d.session && d.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function ft(d, m, A = "", h) {
    const rt = N("dt", d), vt = N("dd", m, A);
    return h && vt.append(" ", h), [rt, vt];
  }
  const ot = document.getElementById("ppp-top"), se = () => {
    (i.hidden || i.classList.contains("ppp-frame--rest") ? t : i).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Kt = () => {
    var m;
    const d = window.XtrataRadioConnectStacks;
    d ? d() : (m = document.getElementById("radio-wallet-connect")) == null || m.click();
  }, ie = () => {
    var m, A;
    const d = c.snapshot();
    if (d.step === "connect" || d.step === "wrong-wallet") {
      Kt();
      return;
    }
    if (d.step === "elsewhere" && ((m = d.gate) != null && m.radioUrl)) {
      location.href = d.gate.radioUrl;
      return;
    }
    d.step === "locked" && !d.armed && !d.busy && c.unlock(), d.step === "ready" && ((A = d.giftStop) == null ? void 0 : A.reason) === "off" && !d.busy && c.switchOn(), se();
  };
  ot && (ot.onclick = ie);
  const de = (d, m, A, h = "") => d.standIn && !d.mainConnected ? lt(`Connect ${At(d.standIn)} to add STX`, Kt, h) : lt(m, A, h), Ae = (d) => {
    c.useLinked(d).then(() => se());
  };
  let ye = null;
  const Mt = () => {
    const d = N0(c.snapshot(), At);
    return d.length ? ye || (ye = new Promise((m) => {
      var He;
      const A = N("dialog", "", "ppp-connect");
      A.setAttribute("aria-labelledby", "ppp-connect-title");
      let h = null;
      const rt = (Rt) => {
        h = Rt, A.close();
      };
      A.addEventListener("close", () => {
        A.remove(), ye = null, m(h);
      }), A.addEventListener("click", (Rt) => {
        Rt.target === A && rt(null);
      });
      const vt = (Rt, pe, Yt, un, Xe = !1) => {
        const Fe = N("button", "", "ppp-connect__opt " + Yt);
        return Fe.type = "button", Fe.disabled = Xe, Fe.onclick = un, Fe.append(N("b", Rt), N("span", pe)), Fe;
      }, xt = N("h2", "Connect", "ppp-connect__title");
      xt.id = "ppp-connect-title";
      const zt = d.map((Rt) => vt(Rt.label, Rt.detail, "is-music", () => {
        if (rt("music"), Rt.action === "linked" && Rt.main) {
          Ae(Rt.main);
          return;
        }
        const pe = N0(c.snapshot(), At).find((Yt) => Yt.action !== "linked");
        (pe == null ? void 0 : pe.action) === "create" ? c.create() : (pe == null ? void 0 : pe.action) === "unlock" && c.unlock(), se();
      }, !!Rt.disabled)), ke = vt("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => rt("stacks")), Ke = lt("Cancel", () => rt(null), "quiet ppp-connect__cancel");
      A.append(xt, ...zt, ke, Ke), document.body.appendChild(A), A.showModal(), (He = zt.find((Rt) => !Rt.disabled)) == null || He.focus();
    }), ye) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = Mt;
  function $t(d) {
    if (!ot) return;
    const m = (h, rt, vt) => {
      ot.hidden = !1, ot.className = "ppp-top" + (rt ? " is-" + rt : ""), ot.replaceChildren(N("span", "", "dot"), document.createTextNode(h)), ot.title = vt;
    }, A = d.session ? Math.min(d.session.playsLeft, d.playsLeft) : 0;
    switch (d.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        ot.hidden = !0;
        return;
      case "elsewhere":
        return m("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        ot.hidden = !0;
        return;
      case "intro":
        return m("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return m(`Connect ${At(d.linked)}`, "warn", `This device's listening wallet belongs to ${At(d.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return m("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return m("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return d.depositPending ? m("Plays on their way", "quiet", "Plays start by themselves when they land") : m(d.entries.some((h) => h.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return m("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return m("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return d.payingOn && A > 0 && !d.giftStop ? m(`${A.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : m("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const Tt = document.getElementById("pppNudge"), te = document.getElementById("onair");
  (mi = Tt == null ? void 0 : Tt.querySelector("button")) == null || mi.addEventListener("click", () => ie());
  const ve = {
    connect: "Connect your wallet to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, he = {
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
  function jn(d) {
    if (d.step === "loading") return;
    const m = d.session ? Math.min(d.session.playsLeft, d.playsLeft) : 0, A = d.step === "ready" && d.payingOn && m > 0 && !d.giftStop, h = d.step === "fund" && d.depositPending, rt = d.step === "elsewhere" && !e, vt = A || h || rt ? "" : ve[d.step] ?? "", xt = A ? "on" : rt ? "free" : vt ? "off" : "";
    xt ? document.documentElement.dataset.ppp = xt : delete document.documentElement.dataset.ppp, te && (te.hidden = !xt || xt === "free", te.querySelector(".onair-sub").textContent = A ? `${m.toLocaleString()} plays left` : "Plays off"), Tt && (Tt.hidden = xt !== "off" && xt !== "free", Tt.classList.toggle("is-free", xt === "free"), xt === "free" ? (Tt.querySelector(".nudge-t").textContent = "You’re on the free player", Tt.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", Tt.querySelector("button").textContent = "Get a player") : xt === "off" && (Tt.querySelector(".nudge-t").textContent = vt, Tt.querySelector(".nudge-s").textContent = p(d) ? d.step === "intro" ? J6 : "" : "This radio requires a funded listening wallet with music support on.", Tt.querySelector("button").textContent = he[d.step] ?? "Start"));
  }
  let mn = "";
  function Ar(d) {
    const m = N("div", "", "ppp-pick");
    d.funderMultiple && d.returnToKind === "funder" && m.append(N("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), d.returnToKind === "funder" && m.append(N("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const A = N("input");
    A.type = "text", A.placeholder = "SP… address to send returns to", A.autocomplete = "off", A.spellcheck = !1, A.setAttribute("aria-label", "Address to return funds to"), A.value = mn, A.oninput = () => {
      mn = A.value;
    };
    const h = lt(d.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(A.value), mn = "";
    }, "tiny");
    return m.append(A, " ", h), d.returnToKind === "chosen" && m.append(" ", lt("Back to the funder", () => c.clearReturnAddress(), "tiny")), m;
  }
  const pi = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function gi() {
    const d = N("p", pi + " ", "ppp-mute");
    return d.append(Ct("Xverse", "https://www.xverse.app/download"), " · ", Ct("Leather", "https://leather.io/install-extension")), d;
  }
  let vs = "";
  const Xn = (d) => {
    const m = document.documentElement, A = d.solo && !d.main ? d.listening ? kt(d.listening) : "new" : "", h = C5() ? "1" : "", rt = d.standIn && !d.mainConnected ? At(d.standIn) : "";
    `${A}|${h}|${rt}` !== vs && (vs = `${A}|${h}|${rt}`, A ? m.dataset.pppSolo = A : delete m.dataset.pppSolo, rt ? m.dataset.pppAs = rt : delete m.dataset.pppAs, h ? m.dataset.pppWalletInstalled = h : delete m.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const d of [1500, 4e3, 9e3]) setTimeout(() => we(c.snapshot()), d);
  function xn(d, m = "") {
    const A = N("div", "", "ppp-topup"), h = yi(d);
    A.append(N("span", "Add plays from My player: ", "ppp-mute"));
    for (const rt of qa) {
      const vt = lt(`+${rt.toLocaleString()}`, () => void c.topUpAlbum(rt), m);
      vt.disabled = h === void 0 || h < rt || d.depositPending || !!d.busy, A.append(vt);
    }
    return h !== void 0 && h < qa[0] && A.append(N("p", "My player needs plays first (switch to My player above).", "ppp-mute")), A;
  }
  const yi = (d) => {
    var h;
    const m = (h = d.likeFunds) == null ? void 0 : h.balance;
    if (m === void 0 || !d.playCost) return;
    const A = m - Ge - 6000n;
    return A > 0n ? Number(A / d.playCost) : 0;
  };
  function uo(d) {
    const m = d.likeFunds;
    if (!m || !m.album || !m.low && !m.pending) return [];
    if (m.low || (H = !1), m.low && !H) return [];
    const A = N("div", "", "ppp-pick ppp-lowbox");
    if (!m.low) {
      if (!m.txid) return [];
      const rt = N("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return m.txid && rt.append(Ct("View", Lt(m.txid))), A.append(rt), [A];
    }
    A.append(N("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), A.append(N("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), A.append(N("p", m.address, "ppp-addr-full"));
    const h = N("div", "", "ppp-open-row");
    if (h.append(Ui("copy-likes-address", "Copy address", () => m.address, "primary", () => we(c.snapshot()))), m.main && !d.solo) {
      const rt = _s - (m.balance ?? 0n);
      rt > 0n && h.append(de(d, `Pay ${ur(rt)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return A.append(h), A.append(N("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [A];
  }
  const Zt = (d) => {
    const m = N("div", "", "ppp-wait");
    m.dataset.since = String(d.since), m.dataset.grace = String(d.graceMs), m.setAttribute("role", "progressbar"), m.setAttribute("aria-label", "Your plays are arriving");
    const A = N("p", "", "ppp-wait-t"), h = N("div", "", "ppp-wait-track");
    return h.append(N("div", "", "ppp-wait-fill")), m.append(A, h), We(m), m;
  };
  function We(d) {
    const m = Number(d.dataset.since), A = Number(d.dataset.grace) || 6e4, h = Math.max(0, Date.now() - m), rt = d.querySelector(".ppp-wait-fill"), vt = d.querySelector(".ppp-wait-t");
    if (h < A) {
      const xt = Math.ceil((A - h) / 1e3);
      rt.style.width = Math.max(4, Math.min(95, h / A * 100)).toFixed(0) + "%", vt.textContent = `Your plays are arriving… usually about a minute · ${xt}s`, d.classList.remove("is-long"), d.setAttribute("aria-valuenow", String(Math.round(h / A * 100)));
    } else
      rt.style.width = "", vt.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", d.classList.add("is-long"), d.removeAttribute("aria-valuenow");
  }
  let ln = 0;
  setInterval(() => {
    const d = document.querySelectorAll(".ppp-wait");
    if (!d.length) {
      ln = 0;
      return;
    }
    d.forEach(We), ++ln % 10 === 0 && we(c.snapshot());
  }, 1e3);
  let Or = null;
  function wi(d) {
    if (d.step === "loading" && Or !== null) return;
    const A = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(d.step) || !!d.busy || d.armed || !!u.pendingCode() && !["ready", "fund", "over"].includes(d.step);
    A !== Or && (Or = A, A ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function we(d) {
    var Ve, dn, jr, Zo, Qo, fo, Jo, ks, ta, Ai, ea, na, y, B, O;
    if (z && ["ready", "fund", "over"].includes(d.step) && !d.busy) {
      const P = z;
      z = null, d.root === P.root && d.slot !== P.slot && c.openAlbum(P.slot);
    }
    const m = u.inProgress(d), A = ct(d), h = m && d.step === "fund" ? { ...d, depositPending: !0 } : A !== null ? { ...d, depositPending: !0, arrival: { since: A, graceMs: Sc } } : d, rt = h.error === Ec;
    if ($(), b = T(d), k(d, h), wi(h), Xn(h), !m && u.inProgress(d) || ($t(h), jn(h), e && n && (n.hidden = !["off", "elsewhere", "loading"].includes(h.step), n.textContent = h.step === "loading" || !h.gate ? w.on ? t$ : "Checking your listening wallet…" : w.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), t.hidden = h.step === "off", t.hidden)) return;
    const [vt, xt] = V(h), zt = s(".ppp-state");
    zt.textContent = vt, zt.className = "ppp-state" + (xt ? " ppp-state--" + xt : ""), zt.hidden = !vt;
    const ke = !!h.busy || h.armed, Ke = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(h.step) && (ke || !["intro", "loading"].includes(h.step));
    i.hidden = !Ke, i.classList.toggle("ppp-frame--rest", !ke && !Oe);
    const He = s(".ppp-frame-label");
    He.hidden = !0;
    const Rt = k5(h) ?? tn;
    tn = Rt;
    const pe = "xtrata.radio.ppp.heard.v1", Yt = (() => {
      try {
        return localStorage.getItem(pe) === "1";
      } catch {
        return !1;
      }
    })();
    if (!Yt && h.entries.some((P) => P.kind === "play"))
      try {
        localStorage.setItem(pe, "1");
      } catch {
      }
    const un = Yt || h.slot > 0 && ((((Ve = h.likeFunds) == null ? void 0 : Ve.balance) ?? 0n) > 0n || f.count() > 1), Xe = p(h), Fe = !Xe && I5({ ...h, heard: un }, Rt);
    s(".ppp-badge").hidden = !Fe;
    const Rn = s(".ppp-steps"), Ln = s(".ppp-stage");
    Rn.hidden = Ln.hidden = !Fe, Rt && Fe && (Rn.replaceChildren(...Ou(h.solo).map((P, J) => {
      const pt = N("li", "", J < Rt.at ? "done" : J === Rt.at ? Rt.blocked ? "now blocked" : "now" : "");
      return pt.append(N("span", J < Rt.at ? "✓" : String(J + 1), "n"), P), J === Rt.at && pt.setAttribute("aria-current", "step"), pt;
    })), Ln.textContent = Rt.caption, Ln.className = "ppp-stage " + (Rt.at >= Ou(h.solo).length ? "ppp-ok" : Rt.blocked ? "ppp-bad" : "ppp-cyan"));
    const Sn = s(".ppp-facts"), Qt = [];
    h.main && ((dn = h.gate) != null && dn.here) && !h.solo && Qt.push(...ft("Your wallet", At(h.main), "ppp-addr-short"));
    const xi = () => {
      if (!h.listening) return;
      const P = Ui("copy-listening", "Copy", () => h.listening || "", "tiny", () => we(c.snapshot()));
      Qt.push(...ft(h.slot > 0 ? "Album wallet" : h.linked ? "My player (technical)" : "My player wallet", kt(h.listening), "ppp-addr-short", P));
    };
    if (h.linked || xi(), h.listening && h.step !== "intro")
      if (h.linked)
        Qt.push(...ft("Credited to", `${At(h.linked)} · plays, likes and returns`, h.linked === h.main || h.solo ? "ppp-ok" : "ppp-warn")), xi();
      else if (h.solo) {
        h.creditedTo && Qt.push(...ft("Credited to", `${At(h.creditedTo)} · plays and likes`, "ppp-ok"));
        const P = h.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : h.returnTo ? `${At(h.returnTo)} · ${h.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : h.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Qt.push(...ft("Returns go to", h.gift ? P : h.returnTo && !Le(h.returnTo) ? P.replace(kt(h.returnTo), h.returnTo) : P, h.returnTo && !h.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Qt.push(...ft("Linked to", "not linked yet", "ppp-warn"));
    if (h.linkedListening.length && ((jr = h.gate) != null && jr.here)) {
      const P = h.linkedListening.map((J) => kt(J) + (J === h.listening ? " (this one)" : "")).join(", ");
      Qt.push(...ft(h.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", P, "ppp-addr-short"));
    }
    if (h.balance !== void 0 && ["fund", "ready", "over"].includes(h.step)) {
      const P = h.step === "fund" && h.depositPending ? "ppp-mute" : h.balanceState === "ok" ? "ppp-ok" : h.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Qt.push(...ft("Balance", `${ur(h.balance)} STX · about ${h.playsLeft.toLocaleString()} plays`, P));
    }
    const vr = h.entries.find((P) => P.kind === "play");
    vr && De(), vr && Qt.push(...ft("Last paid song", `${v(vr)} → ${At(vr.recipient)}`, F[vr.status] || "")), Sn.replaceChildren(...Qt), Sn.hidden = !Qt.length;
    const ht = [], Vt = [], ee = [], fn = [], kr = Pn(BigInt(((Zo = h.gate) == null ? void 0 : Zo.limits.playFee) ?? "300")), Si = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${ur(mc)} STX to the song holder, plus a ${ur(kr - mc)} STX network fee.`, Ei = !!h.busy;
    switch (h.step) {
      case "elsewhere": {
        if (ht.push(N("p", "Pay artists as you listen.")), (Qo = h.gate) != null && Qo.radioUrl) {
          const J = N("p");
          J.append(Ct("Open the pay-per-play radio →", h.gate.radioUrl)), ht.push(J);
        }
        Vt.push(N("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (h.linked) {
          const J = [h.linked, ...h.others];
          ht.push(N("p", J.length > 1 ? `This device has listening wallets for ${Se(J)}.` : `This device has a listening wallet for ${At(h.linked)}.`)), Vt.push(N("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), J.slice(0, 3).forEach((pt, ne) => ee.push(lt(`Open ${At(pt)}`, () => Ae(pt), ne === 0 ? "primary" : "")));
        } else
          ht.push(N("p", "Connect your wallet to pay artists as you listen.")), Vt.push(N("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        ht.push(N("p", `This device's listening wallet belongs to ${At(h.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Vt.push(N("p", `You are connected as ${At(h.main)}. Switch to the linked wallet to continue listening.`)), Vt.push(N("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), ee.push(lt("Switch wallet", Kt, "primary"));
        break;
      case "not-invited":
        ht.push(N("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        ht.push(N("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        ht.push(N("p", "Every play counts for the song’s owner, on-chain.")), Vt.push(N("p", Si)), Vt.push(N("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), Vt.push(N("p", h.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !h.solo && h.main && h.others.length ? (ht.push(N("p", `This device already has a listening wallet for ${Se(h.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Vt.push(N("p", `Otherwise, set up a new listening wallet for ${At(h.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !h.solo && h.main && Vt.push(N("p", `This is the listening wallet for ${At(h.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), h.solo && Vt.push(N("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const P = u.liveGift();
        ee.push(lt(P ? "Claim my gift · no wallet needed" : h.solo ? "Start listening · no wallet needed" : h.others.length && h.main ? `Set up for ${At(h.main)}` : "Start listening", () => void c.create(), "primary")), !P && !h.solo && h.main && h.others.length && ee.push(lt("Switch wallet", Kt)), !P && h.solo && ee.push(lt("I have a Stacks wallet", Kt)), ee.push(lt("I already have a listening wallet", () => void c.unlock(!0))), P && ee.push(lt("Not now", () => u.setAside(), "quiet"));
        break;
      case "locked":
        h.armed || (ht.push(N("p", "Locked.", "ppp-mute")), ee.push(lt("Unlock", () => void c.unlock(), "primary"))), h.standIn ? fn.push(lt("Use a different listening wallet", () => void Mt().then((J) => {
          J === "stacks" && Kt();
        }), "quiet")) : fn.push(lt("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        ht.push(N("p", `Link to ${At(h.main)} · free`)), Vt.push(N("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Vt.push(N("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), ee.push(lt(h.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        ht.push(N("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (h.depositPending ? h.arrival && ht.push(Zt(h.arrival)) : ut(h) ? ht.push(N("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (fo = h.gift) != null && fo.player ? ht.push(N("p", "Out of plays · add more to keep listening", "ppp-bad")) : h.entries.length ? ht.push(N("p", "No plays left · add plays to keep counting", "ppp-bad")) : ht.push(N("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / kr)).toLocaleString()} plays`)), h.entries.length && Vt.push(N("p", "Playback is paused until your top-up confirms.")), h.payingOn && !h.entries.length && Vt.push(N("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), m ? Vt.push(N("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : h.depositPending ? Vt.push(N("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : h.solo ? (Vt.push(N("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Vt.push(N("p", h.listening || "", "ppp-addr-full")), h.listening && !h.depositPending && ee.push(Ui("copy-address", "Copy my address", () => h.listening || "", "primary", () => we(c.snapshot())))) : Vt.push(N("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), h.depositPending && h.depositTxid) {
          const J = N("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          J.append(Ct("View", Lt(h.depositTxid))), ht.push(J);
        } else h.allowance > 0n && !h.solo && !h.depositPending && ee.push(de(h, `Deposit ${ur(h.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        ht.push(N("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), h.solo && !h.returnTo && (ht.push(N("p", h.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), ht.push(Ar(h))), (!h.solo || h.returnTo) && ee.push(lt("Return excess", () => void c.returnFunds("excess"), "primary"), lt("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (h.payingOn && h.session && h.session.playsLeft > 0 && ((Jo = h.giftStop) == null ? void 0 : Jo.reason) !== "off") {
          const J = Math.min(h.session.playsLeft, h.playsLeft);
          ht.push(N("p", `${J.toLocaleString()} plays left`, "ppp-ok")), Vt.push(N("p", Si + " The heart likes or unlikes from this wallet for 0.0002 STX.")), ee.push(lt("Switch off", () => void c.switchOff()));
        } else
          ht.push(N("p", "Switch on music support to listen.", "ppp-mute")), ee.push(lt("Switch plays on", () => void c.switchOn(), "primary"));
        h.queued && ht.push(N("p", h.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${h.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), h.balanceState === "low" && ht.push(N("p", "Running low on plays", "ppp-warn")), h.depositPending ? ht.push(N("p", "Plays on their way…", "ppp-warn")) : h.allowance > 0n && h.balanceState !== "ok" && !h.solo && ee.push(de(h, `Top up ${ur(h.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (h.solo && h.walletCannotSolo && Vt.push(N("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), h.solo && ["fund", "ready"].includes(h.step) && ((h.balance ?? 0n) > 0n && h.slot === 0 && Vt.push(Ar(h)), Vt.push(gi()), h.slot === 0 && h.step === "ready" && h.entries.some((P) => P.kind === "play" && P.status === "confirmed"))) {
      const P = N("p", "New to Stacks? ", "ppp-mute");
      P.append(Ct("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), ht.push(P);
    }
    if (h.walletOutdated && Vt.push(N("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), h.stuck && (ht.push(N("p", h.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${h.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), ee.push(lt("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(h.step) && (h.returnTo || h.gift) && (h.balance ?? 0n) > 0n && fn.push(lt(h.linked ? "Return all to my wallet" : h.gift ? "Return what is left…" : `Return all to ${At(h.returnTo)}`, () => void c.returnFunds("all"), "quiet")), h.slot > 0 && ((ks = h.gift) != null && ks.player) && ["ready", "fund"].includes(h.step) && h.giftPlays > 20 && fn.push(xn(h, "quiet")), ["ready", "fund", "link", "over"].includes(h.step) && fn.push(lt("Lock", () => void c.lock(), "quiet")), Ke && !ke && fn.push(lt(Oe ? "Hide listening wallet box" : "Show listening wallet box", () => {
      Oe = !Oe, we(c.snapshot());
    }, "quiet")), [...ee, ...fn].forEach((P) => P.disabled = Ei), Ei && (ee.length = 0), !Xe && h.balance !== void 0 && ["fund", "ready", "over"].includes(h.step) && !(h.step === "fund" && h.depositPending && h.balance === 0n) && !((ta = h.gift) != null && ta.player)) {
      const P = h.balanceState === "ok" ? "ppp-ok" : h.balanceState === "low" ? "ppp-warn" : "ppp-bad", J = ht.at(0);
      h.step === "ready" && J ? J.append(N("span", ` · ${It(h.balance)} STX`, P)) : ht.push(N("p", `Balance ${It(h.balance)} STX`, P));
    }
    if (Xe) {
      for (const pt of [...ee, ...fn]) {
        const ne = W6[pt.textContent ?? ""];
        ne && (pt.textContent = ne);
      }
      for (let pt = ht.length - 1; pt >= 0; pt--) _0(ht[pt].textContent) && Vt.unshift(...ht.splice(pt, 1));
      for (let pt = ee.length - 1; pt >= 0; pt--) _0(ee[pt].textContent) && fn.unshift(...ee.splice(pt, 1));
      const P = h.entries.some((pt) => pt.kind === "play"), J = Q6(h.step, { played: P, arriving: h.depositPending });
      J.length && ht.length && J.shift(), ht.push(...J.map((pt) => N("p", pt, "ppp-mute")));
    }
    if ((Ai = h.gift) != null && Ai.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(h.step)) {
      const P = N("p", "", "ppp-gift");
      P.append(`💿 Album · ${h.gift.player.title}`), h.gift.player.subtitle && P.append(" · ", h.gift.player.subtitle);
      const J = ["ready", "fund", "over"].includes(h.step) && h.balance !== void 0 ? h.giftPlays === 0 && h.depositPending ? N("span", " · plays on their way", "ppp-warn") : N("span", h.giftPlays === 0 ? " · no plays left" : ` · ${h.giftPlays.toLocaleString()} ${h.giftPlays === 1 ? "play" : "plays"} left`, h.giftPlays === 0 ? "ppp-bad" : h.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      J && P.append(J);
      const pt = (ea = ht.at(0)) == null ? void 0 : ea.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (h.step === "ready" && pt && /STX/.test(pt.textContent ?? "") && pt.remove(), ht.unshift(P), h.giftPlays <= 20 && ["ready", "fund"].includes(h.step) && !h.depositPending)
        if (h.slot > 0)
          ht.splice(1, 0, N("p", h.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), xn(h, "primary"));
        else {
          const ne = N("p", h.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          ne.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), ne.append(Ct("Xverse", "https://www.xverse.app/download"), " and ", Ct("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), ht.splice(1, 0, ne);
        }
    }
    if (h.gift && !h.linked && ["fund", "ready", "over"].includes(h.step) && h.returnPlan.state === "ready") {
      const P = h.returnPlan, J = N("div", "", "ppp-pick");
      J.append(N("p", P.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const pt = N("ul", "", "ppp-gift-list");
      P.steps.forEach((ne, qe) => {
        const Rr = ne.kind === "gift" ? "the unused gift" : ne.kind === "deposit" ? "what was added to it" : "the rest", Re = N("li");
        Re.append(N("span", `${qe + 1}. ${ur(BigInt(ne.send))} STX · ${Rr}`, "t"), N("span", ne.to ? ` → ${At(ne.to)}` : " → choose an address below", ne.to ? "ppp-mute" : "ppp-warn")), pt.append(Re);
      }), J.append(pt), P.kept && J.append(N("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), P.steps.some((ne) => !ne.to) && J.append(Ar(h)), J.append(lt(P.steps.length > 1 ? `Confirm part 1 of ${P.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), ht.push(J);
    }
    const En = Dr(h), Cn = x ? En : null, g = u.banner(d, { bare: !!Cn }), I = nn && (u.pendingCode() || ["intro", "locked", "unsupported"].includes(h.step)) ? Ue(nn, u.pendingCode()) : [];
    Cn || (ht.unshift(...g), ht.push(...uo(h)), ht.unshift(...I)), h.solo && h.creditedTo && h.listening && !["intro", "off", "elsewhere", "loading"].includes(h.step) && ht.unshift(N("p", `This is ${At(h.creditedTo)}'s listening wallet. Plays and likes count for ${At(h.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...ht);
    const Y = document.querySelector(".ppp-switch");
    if (Y) {
      const P = f.latest(), J = h.slot > 0, pt = ["fund", "ready", "over"].includes(h.step) && (J || !!P);
      if (Y.hidden = !pt, pt) {
        const ne = (Re, ho, ra, sa) => {
          const zr = lt("", sa, "ppp-tab");
          return zr.setAttribute("aria-pressed", String(ra)), zr.append(N("span", Re, "tt"), N("span", ho === void 0 ? "…" : `${ge(ho).toLocaleString()} plays`, "ts")), zr.disabled = !!h.busy, zr;
        }, qe = J ? ((y = (na = h.gift) == null ? void 0 : na.player) == null ? void 0 : y.title) ?? "Album" : P.title, Rr = lt("View all albums" + (f.count() > 1 ? ` (${f.count()})` : ""), () => {
          const Re = document.querySelector(".ppp-shelf");
          Re && (Re.hidden = !1, Re.open = !Re.open, Rr.setAttribute("aria-expanded", String(Re.open)), Re.open && requestAnimationFrame(() => Re.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        Rr.setAttribute("aria-expanded", String(!!((B = document.querySelector(".ppp-shelf")) != null && B.open))), Y.replaceChildren(
          ne("🎧 My player", J ? (O = h.likeFunds) == null ? void 0 : O.balance : h.balance, !J, () => {
            J && c.openAlbum(0);
          }),
          ne("💿 " + qe, J ? h.balance : void 0, J, () => {
            !J && P && c.openAlbum(P.slot);
          }),
          Rr
        );
      }
    }
    const tt = f.render(h), bt = document.querySelector(".ppp-shelf");
    if (bt) {
      bt.hidden = !tt;
      const P = bt.querySelector("summary");
      P && (P.textContent = f.count() > 0 ? `♪ My albums (${f.count()})` : "♪ My albums");
      const J = bt.querySelector(".ppp-shelf-body");
      tt && J && !J.contains(tt) && J.replaceChildren(tt);
    }
    const R = u.renderFold(d);
    if (s(".ppp-gifts").hidden = !R, R && !s(".ppp-gift-body").contains(R) && s(".ppp-gift-body").replaceChildren(R), R && ae) {
      ae = !1;
      const P = s(".ppp-gifts");
      P.open = !0, requestAnimationFrame(() => P.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    s(".ppp-body").replaceChildren(...Vt), s(".ppp-actions").replaceChildren(...ee), s(".ppp-actions2").replaceChildren(...fn);
    const gt = h.busy || h.message || "", mt = s(".ppp-msg"), wt = gt && ht.some((P) => (P.textContent ?? "").startsWith(gt.replace(/[.✓\s]+$/, ""))) ? "" : gt, Ot = !wt && !h.error ? h.notice : rt && !wt ? h.error : "";
    mt.textContent = wt || Ot, mt.classList.toggle("is-warn", !!Ot), s(".ppp-err").textContent = rt ? "" : h.error;
    const je = h.entries.filter((P) => P.kind === "play");
    s(".ppp-recent").hidden = !h.entries.length, s(".ppp-recent-list").replaceChildren(...je.slice(0, 5).map((P) => {
      const J = N("li"), pt = P.status === "confirmed" ? "ok" : P.status === "failed" ? "bad" : "warn";
      return J.append(N("span", "", "d " + pt), N("span", v(P), "t"), N("span", Xt(P.created), "ppp-mute")), P.txid && J.append(Ct("tx", Lt(P.txid))), J;
    })), s(".ppp-wallets").hidden = !(Sn.childElementCount || fn.length), s(".ppp-more").hidden = !Vt.length;
    const rn = s(".ppp-history");
    rn.hidden = !h.entries.length, h.entries.length && De(), rn.replaceChildren(N("summary", `All activity (${h.entries.length})`), ...h.entries.slice(0, 20).map((P) => {
      const J = N("div", "", "ppp-row"), pt = P.kind === "play" ? [N("span", v(P), "ppp-song"), N("span", ` · ${ur(BigInt(P.amount))} STX to ${At(P.recipient)}`, "ppp-mute")] : P.kind === "like" ? [N("span", `${P.liked ? "♥ Liked" : "Unliked"} ${v(P)}`, "ppp-song"), N("span", ` · for ${h.linked ? At(h.linked) : "this listening wallet"}`, "ppp-mute")] : [N("span", `Returned ${ur(BigInt(P.amount))} STX`, "ppp-song"), N("span", ` to ${At(P.recipient)}`, "ppp-mute")];
      return J.append(
        N("span", j[P.status] || P.status, "ppp-status " + (F[P.status] || "")),
        ...pt,
        N("span", ` · ${new Date(P.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), P.txid && J.append(Ct("tx ↗", Lt(P.txid))), J;
    })), G == null || G.render(Cn ? $n(h, Cn, [...I, ...g]) : null), E == null || E.render((En == null ? void 0 : En.mode) === "open" ? $n(h, En, []) : null);
  }
  function Dr(d) {
    var h;
    if (["off", "elsewhere", "not-invited"].includes(d.step)) return null;
    if (d.slot > 0 && ((h = d.gift) != null && h.player) && ["fund", "ready", "over", "link", "loading"].includes(d.step))
      return d.root && et({ root: d.root, slot: d.slot, player: d.gift.player }), { mode: "open", player: d.gift.player };
    const m = u.incomingAlbum();
    if (m) return { mode: "arrive", player: m.player, from: m.from, offered: m.plays };
    const A = _();
    return A && (d.step === "locked" || z && d.step === "loading") ? { mode: "locked", player: A.player } : null;
  }
  function $n(d, m, A) {
    var ke, Ke, He, Rt, pe;
    const h = !!d.busy || d.armed, rt = [...A];
    d.depositPending && d.arrival && rt.push(Zt(d.arrival)), d.error ? rt.push(N("p", d.error, d.error === Ec ? "ppp-warn" : "ppp-bad")) : d.message && !h ? rt.push(N("p", d.message, "ppp-cyan")) : d.notice && rt.push(N("p", d.notice, "ppp-warn")), m.mode === "open" && H && ((ke = d.likeFunds) != null && ke.album) && d.likeFunds.low && !d.likeFunds.pending && rt.push(N("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let vt = "Kept on this device with Face ID or your passkey. No app or account needed.", xt = null, zt = null;
    if (m.mode === "locked")
      xt = { label: "Continue listening", run: () => {
        z = _(), c.unlock();
      } }, zt = { label: "Use a different passkey", run: () => {
        z = null, c.unlock(!0);
      } };
    else if (m.mode === "arrive")
      if (d.step === "intro" && Oa(L) && L.album === m.player.id) {
        const Yt = window.XtrataRadio, un = Ds(m.player)[0], Xe = L.phase === "playing";
        xt = { label: Xe && !!((He = (Ke = Yt == null ? void 0 : Yt.getState) == null ? void 0 : Ke.call(Yt)) != null && He.playing) ? "Pause" : Xe ? "Carry on" : "Play the first song", run: () => {
          var Rn, Ln;
          Xe ? (Rn = Yt == null ? void 0 : Yt.playPause) == null || Rn.call(Yt) : un && ((Ln = Yt == null ? void 0 : Yt.playToken) == null || Ln.call(Yt, un.id));
        } }, zt = { label: "Make my player and hear it all", run: () => void c.create() }, vt = "The first song is free. Nothing to set up yet.";
      } else if (d.step === "intro") {
        const Yt = L.phase === "done" && L.album === m.player.id;
        Yt && !rt.length && rt.push(N("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), xt = { label: Yt ? "Keep listening" : "Open album", run: () => void c.create() }, zt = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else d.step === "locked" ? (xt = { label: "Open album", run: () => void c.unlock() }, zt = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : d.step === "unsupported" ? rt.push(N("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : rt.length || rt.push(N("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: m.mode,
      player: m.player,
      from: m.from,
      offered: m.offered,
      plays: m.mode === "open" ? d.balance === void 0 ? null : d.giftPlays : void 0,
      playsComing: d.depositPending,
      status: rt,
      primary: xt,
      secondary: zt,
      hint: xt ? vt : void 0,
      asking: h,
      busy: !!d.busy,
      myPlays: yi(d),
      topUps: qa,
      canMake: !!((pe = (Rt = d.gate) == null ? void 0 : Rt.gifts) != null && pe.admin)
    };
  }
  const In = /* @__PURE__ */ new Map();
  let Fr = !1;
  const bi = () => {
    const d = window.XtrataRadio;
    return d != null && d.subscribe ? (d.subscribe((m) => {
      const A = m == null ? void 0 : m.nowPlaying;
      if (A && Number.isSafeInteger(Number(A.tokenId)) && In.set(Number(A.tokenId), { title: A.title || void 0, artist: A.artist || void 0 }), Oa(L)) {
        const h = !!(m != null && m.playing);
        D({ kind: "now", track: A && A.tokenId != null ? String(A.tokenId) : null, playing: h, at: Date.now() }), h !== Fr && (Fr = h, we(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!bi()) {
    const d = setInterval(() => {
      bi() && clearInterval(d);
    }, 500);
    setTimeout(() => clearInterval(d), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (d) => {
    const m = d.detail;
    if (Oa(L) && D({ kind: "listened", at: Date.now() }), m && Number.isSafeInteger(m.song) && typeof m.id == "string" && /^[0-9a-f]{32}$/.test(m.id)) {
      De();
      const A = Ee(m.song, In.get(m.song));
      c.onListened({ song: m.song, id: m.id, title: A.title || void 0, artist: A.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (e || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const r$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", s$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, i$ = () => s$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, o$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, a$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', vw = class {
  constructor(t) {
    b4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && Ox(t), this.callback(Oc(t));
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
    const t = i$(), e = o$(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return Bt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Bt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Bt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Bt("div", { class: "flex flex-col space-y-[10px]" }, Bt("div", { class: "flex items-center" }, Bt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Bt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Bt("span", { class: "sr-only" }, "Close popup"), Bt("img", { src: r$ }))), r ? Bt("p", null, "Select the wallet you want to connect to.") : Bt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && Bt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Bt("div", { class: "mt-6" }, Bt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Bt("ul", { class: "space-y-3" }, this.installedProviders.map((i) => Bt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Bt("div", { class: "aspect-square basis-9 overflow-hidden" }, Bt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Bt("div", { class: "flex-1" }, Bt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Bt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), Bt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && Bt("div", { class: "mt-6" }, r ? Bt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Bt("div", { class: "mb-5 flex justify-between" }, Bt("p", { class: "text-sm font-medium" }, "Recommended wallets"), Bt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Bt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Bt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Bt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Bt("p", null, "What is a wallet? ", Bt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Bt("ul", { class: "space-y-3" }, n.map((i) => Bt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Bt("div", { class: "aspect-square basis-9 overflow-hidden" }, Bt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Bt("div", { class: "flex-1" }, Bt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Bt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && Bt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return J3(this);
  }
};
vw.style = a$;
const c$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: vw
}, Symbol.toStringTag, { value: "Module" }));
