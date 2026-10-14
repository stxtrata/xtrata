var Fy = Object.defineProperty;
var jy = (t, e, n) => e in t ? Fy(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var vi = (t, e, n) => jy(t, typeof e != "symbol" ? e + "" : e, n);
var ke = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Fh(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Aa(t) {
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
      typeof ke < "u" && ke || {}, r = {
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
      function s(S) {
        return S && DataView.prototype.isPrototypeOf(S);
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
        ], o = ArrayBuffer.isView || function(S) {
          return S && i.indexOf(Object.prototype.toString.call(S)) > -1;
        };
      function a(S) {
        if (typeof S != "string" && (S = String(S)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(S) || S === "")
          throw new TypeError('Invalid character in header field name: "' + S + '"');
        return S.toLowerCase();
      }
      function c(S) {
        return typeof S != "string" && (S = String(S)), S;
      }
      function f(S) {
        var $ = {
          next: function() {
            var H = S.shift();
            return { done: H === void 0, value: H };
          }
        };
        return r.iterable && ($[Symbol.iterator] = function() {
          return $;
        }), $;
      }
      function d(S) {
        this.map = {}, S instanceof d ? S.forEach(function($, H) {
          this.append(H, $);
        }, this) : Array.isArray(S) ? S.forEach(function($) {
          if ($.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + $.length);
          this.append($[0], $[1]);
        }, this) : S && Object.getOwnPropertyNames(S).forEach(function($) {
          this.append($, S[$]);
        }, this);
      }
      d.prototype.append = function(S, $) {
        S = a(S), $ = c($);
        var H = this.map[S];
        this.map[S] = H ? H + ", " + $ : $;
      }, d.prototype.delete = function(S) {
        delete this.map[a(S)];
      }, d.prototype.get = function(S) {
        return S = a(S), this.has(S) ? this.map[S] : null;
      }, d.prototype.has = function(S) {
        return this.map.hasOwnProperty(a(S));
      }, d.prototype.set = function(S, $) {
        this.map[a(S)] = c($);
      }, d.prototype.forEach = function(S, $) {
        for (var H in this.map)
          this.map.hasOwnProperty(H) && S.call($, this.map[H], H, this);
      }, d.prototype.keys = function() {
        var S = [];
        return this.forEach(function($, H) {
          S.push(H);
        }), f(S);
      }, d.prototype.values = function() {
        var S = [];
        return this.forEach(function($) {
          S.push($);
        }), f(S);
      }, d.prototype.entries = function() {
        var S = [];
        return this.forEach(function($, H) {
          S.push([H, $]);
        }), f(S);
      }, r.iterable && (d.prototype[Symbol.iterator] = d.prototype.entries);
      function l(S) {
        if (!S._noBody) {
          if (S.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          S.bodyUsed = !0;
        }
      }
      function g(S) {
        return new Promise(function($, H) {
          S.onload = function() {
            $(S.result);
          }, S.onerror = function() {
            H(S.error);
          };
        });
      }
      function h(S) {
        var $ = new FileReader(), H = g($);
        return $.readAsArrayBuffer(S), H;
      }
      function x(S) {
        var $ = new FileReader(), H = g($), Y = /charset=([A-Za-z0-9_-]+)/.exec(S.type), et = Y ? Y[1] : "utf-8";
        return $.readAsText(S, et), H;
      }
      function m(S) {
        for (var $ = new Uint8Array(S), H = new Array($.length), Y = 0; Y < $.length; Y++)
          H[Y] = String.fromCharCode($[Y]);
        return H.join("");
      }
      function L(S) {
        if (S.slice)
          return S.slice(0);
        var $ = new Uint8Array(S.byteLength);
        return $.set(new Uint8Array(S)), $.buffer;
      }
      function b() {
        return this.bodyUsed = !1, this._initBody = function(S) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = S, S ? typeof S == "string" ? this._bodyText = S : r.blob && Blob.prototype.isPrototypeOf(S) ? this._bodyBlob = S : r.formData && FormData.prototype.isPrototypeOf(S) ? this._bodyFormData = S : r.searchParams && URLSearchParams.prototype.isPrototypeOf(S) ? this._bodyText = S.toString() : r.arrayBuffer && r.blob && s(S) ? (this._bodyArrayBuffer = L(S.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(S) || o(S)) ? this._bodyArrayBuffer = L(S) : this._bodyText = S = Object.prototype.toString.call(S) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof S == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(S) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var S = l(this);
          if (S)
            return S;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var S = l(this);
            return S || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            ) : Promise.resolve(this._bodyArrayBuffer));
          } else {
            if (r.blob)
              return this.blob().then(h);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var S = l(this);
          if (S)
            return S;
          if (this._bodyBlob)
            return x(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(m(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(C);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var T = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function w(S) {
        var $ = S.toUpperCase();
        return T.indexOf($) > -1 ? $ : S;
      }
      function B(S, $) {
        if (!(this instanceof B))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        $ = $ || {};
        var H = $.body;
        if (S instanceof B) {
          if (S.bodyUsed)
            throw new TypeError("Already read");
          this.url = S.url, this.credentials = S.credentials, $.headers || (this.headers = new d(S.headers)), this.method = S.method, this.mode = S.mode, this.signal = S.signal, !H && S._bodyInit != null && (H = S._bodyInit, S.bodyUsed = !0);
        } else
          this.url = String(S);
        if (this.credentials = $.credentials || this.credentials || "same-origin", ($.headers || !this.headers) && (this.headers = new d($.headers)), this.method = w($.method || this.method || "GET"), this.mode = $.mode || this.mode || null, this.signal = $.signal || this.signal || function() {
          if ("AbortController" in n) {
            var X = new AbortController();
            return X.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && H)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(H), (this.method === "GET" || this.method === "HEAD") && ($.cache === "no-store" || $.cache === "no-cache")) {
          var Y = /([?&])_=[^&]*/;
          if (Y.test(this.url))
            this.url = this.url.replace(Y, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var et = /\?/;
            this.url += (et.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      B.prototype.clone = function() {
        return new B(this, { body: this._bodyInit });
      };
      function C(S) {
        var $ = new FormData();
        return S.trim().split("&").forEach(function(H) {
          if (H) {
            var Y = H.split("="), et = Y.shift().replace(/\+/g, " "), X = Y.join("=").replace(/\+/g, " ");
            $.append(decodeURIComponent(et), decodeURIComponent(X));
          }
        }), $;
      }
      function D(S) {
        var $ = new d(), H = S.replace(/\r?\n[\t ]+/g, " ");
        return H.split("\r").map(function(Y) {
          return Y.indexOf(`
`) === 0 ? Y.substr(1, Y.length) : Y;
        }).forEach(function(Y) {
          var et = Y.split(":"), X = et.shift().trim();
          if (X) {
            var $t = et.join(":").trim();
            try {
              $.append(X, $t);
            } catch (le) {
              console.warn("Response " + le.message);
            }
          }
        }), $;
      }
      b.call(B.prototype);
      function q(S, $) {
        if (!(this instanceof q))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if ($ || ($ = {}), this.type = "default", this.status = $.status === void 0 ? 200 : $.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = $.statusText === void 0 ? "" : "" + $.statusText, this.headers = new d($.headers), this.url = $.url || "", this._initBody(S);
      }
      b.call(q.prototype), q.prototype.clone = function() {
        return new q(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, q.error = function() {
        var S = new q(null, { status: 200, statusText: "" });
        return S.ok = !1, S.status = 0, S.type = "error", S;
      };
      var O = [301, 302, 303, 307, 308];
      q.redirect = function(S, $) {
        if (O.indexOf($) === -1)
          throw new RangeError("Invalid status code");
        return new q(null, { status: $, headers: { location: S } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function($, H) {
          this.message = $, this.name = H;
          var Y = Error($);
          this.stack = Y.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function W(S, $) {
        return new Promise(function(H, Y) {
          var et = new B(S, $);
          if (et.signal && et.signal.aborted)
            return Y(new e.DOMException("Aborted", "AbortError"));
          var X = new XMLHttpRequest();
          function $t() {
            X.abort();
          }
          X.onload = function() {
            var A = {
              statusText: X.statusText,
              headers: D(X.getAllResponseHeaders() || "")
            };
            et.url.indexOf("file://") === 0 && (X.status < 200 || X.status > 599) ? A.status = 200 : A.status = X.status, A.url = "responseURL" in X ? X.responseURL : A.headers.get("X-Request-URL");
            var N = "response" in X ? X.response : X.responseText;
            setTimeout(function() {
              H(new q(N, A));
            }, 0);
          }, X.onerror = function() {
            setTimeout(function() {
              Y(new TypeError("Network request failed"));
            }, 0);
          }, X.ontimeout = function() {
            setTimeout(function() {
              Y(new TypeError("Network request timed out"));
            }, 0);
          }, X.onabort = function() {
            setTimeout(function() {
              Y(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function le(A) {
            try {
              return A === "" && n.location.href ? n.location.href : A;
            } catch {
              return A;
            }
          }
          if (X.open(et.method, le(et.url), !0), et.credentials === "include" ? X.withCredentials = !0 : et.credentials === "omit" && (X.withCredentials = !1), "responseType" in X && (r.blob ? X.responseType = "blob" : r.arrayBuffer && (X.responseType = "arraybuffer")), $ && typeof $.headers == "object" && !($.headers instanceof d || n.Headers && $.headers instanceof n.Headers)) {
            var de = [];
            Object.getOwnPropertyNames($.headers).forEach(function(A) {
              de.push(a(A)), X.setRequestHeader(A, c($.headers[A]));
            }), et.headers.forEach(function(A, N) {
              de.indexOf(N) === -1 && X.setRequestHeader(N, A);
            });
          } else
            et.headers.forEach(function(A, N) {
              X.setRequestHeader(N, A);
            });
          et.signal && (et.signal.addEventListener("abort", $t), X.onreadystatechange = function() {
            X.readyState === 4 && et.signal.removeEventListener("abort", $t);
          }), X.send(typeof et._bodyInit > "u" ? null : et._bodyInit);
        });
      }
      return W.polyfill = !0, n.fetch || (n.fetch = W, n.Headers = d, n.Request = B, n.Response = q), e.Headers = d, e.Request = B, e.Response = q, e.fetch = W, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : ke);
})();
const zy = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Ry(t, e) {
  const n = {};
  return Object.assign(n, zy, e), await fetch(t, n);
}
function Gy(t) {
  let e = Ry, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Ky(...t) {
  const { fetchLib: e, middlewares: n } = Gy(t);
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
var Qs;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Qs || (Qs = {}));
var ns;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ns || (ns = {}));
var of;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(of || (of = {}));
const Vy = "https://api.mainnet.hiro.so", Wy = "https://api.testnet.hiro.so", Xy = "http://localhost:3999", qy = ["mainnet", "testnet", "devnet", "mocknet"];
let Js = class {
  constructor(e) {
    this.version = ns.Mainnet, this.chainId = Qs.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === ns.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Ky();
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
Js.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new _c();
    case "testnet":
      return new Yy();
    case "devnet":
      return new Zy();
    case "mocknet":
      return new jh();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${qy.join(", ")}`);
  }
};
Js.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Js.fromName(t);
let _c = class extends Js {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Vy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ns.Mainnet, this.chainId = Qs.Mainnet;
  }
}, Yy = class extends Js {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Wy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ns.Testnet, this.chainId = Qs.Testnet;
  }
}, jh = class extends Js {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Xy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ns.Testnet, this.chainId = Qs.Testnet;
  }
};
const Zy = jh, zh = "xtrata.wallet.bridge.v1", Qy = (t) => typeof t == "object" && t !== null && t.protocol === zh, Jy = (t) => Qy(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", tw = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class Ii extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const af = 12e4;
class ew {
  constructor(e) {
    vi(this, "pending", /* @__PURE__ */ new Map());
    vi(this, "listenTarget");
    vi(this, "closed", !1);
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
    vi(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !Jy(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new Ii("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new Ii("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Ii("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = tw(), i = { protocol: zh, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new Ii(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? af}ms.`
          )
        );
      }, this.options.timeoutMs ?? af);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new Ii("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const nw = ["SP", "SM"], rw = ["ST", "SN"], sw = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return nw.includes(n) ? "mainnet" : rw.includes(n) ? "testnet" : null;
}, iw = () => {
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
}, ow = () => typeof window > "u" || !window.localStorage ? iw() : window.localStorage, ic = "xtrata.v15.1.wallet.session", cf = "mainnet", Qo = { isConnected: !1 }, aw = (t) => t.address ? sw(t.address) ?? t.network : t.network, Rh = (t) => !t.isConnected || !t.address ? { ...Qo } : aw(t) !== cf ? { ...Qo } : {
  isConnected: !0,
  address: t.address,
  network: cf,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, cw = (t) => {
  if (!t)
    return { ...Qo };
  try {
    const e = JSON.parse(t);
    return Rh(e);
  } catch {
    return { ...Qo };
  }
}, lw = (t) => {
  const e = Rh(t);
  return JSON.stringify(e);
}, uw = (t) => {
  const e = ow();
  return {
    load: () => cw(e.getItem(ic)),
    save: (n) => {
      e.setItem(ic, lw(n));
    },
    clear: () => {
      e.removeItem(ic);
    }
  };
}, fw = "https://browser.blockstack.org/auth", dw = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Gh = ["store_write"], hw = "blockstack-session", pw = {
  logLevel: "debug"
}, xs = {
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
Object.freeze(xs);
class yi extends Error {
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
class gw extends yi {
  constructor(e, n = "") {
    super({ code: xs.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class lf extends yi {
  constructor(e = "") {
    super({ code: xs.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class po extends yi {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: xs.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class uf extends yi {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: xs.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Nc extends yi {
  constructor(e) {
    super({ code: xs.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Kh extends yi {
  constructor(e) {
    super({ code: xs.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const ff = ["debug", "info", "warn", "error", "none"], Uc = {};
for (let t = 0; t < ff.length; t++) {
  const e = ff[t];
  Uc[e] = t;
}
class Gs {
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
    return Uc[pw.logLevel] <= Uc[e];
  }
}
function yw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function ww() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function oc(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function bw() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function mw() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function xw(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function Dl(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = mw(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    Gs.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = xw(s, t.toString(), n);
    throw Gs.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Tr(t, e) {
  return Fl(Ee(t), e);
}
function Ee(t) {
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
  if (He(t, Uint8Array))
    return BigInt(`0x${it(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Sw(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function df(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Zi(t, e = 8) {
  return (typeof t == "bigint" ? t : Ee(t)).toString(16).padStart(e * 2, "0");
}
function $a(t) {
  return parseInt(t, 16);
}
function Fl(t, e = 16) {
  const n = Zi(t, e);
  return Bt(n);
}
function Ew(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Aw(t, e) {
  return t & BigInt(1) << e;
}
function Pc(t) {
  return $w(BigInt(`0x${it(t)}`), BigInt(t.byteLength * 8));
}
function $w(t, e) {
  return Aw(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const vw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function it(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += vw[n];
  return e;
}
function Bt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Sw(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function Ss(t) {
  return new TextEncoder().encode(t);
}
function Qi(t) {
  return new TextDecoder().decode(t);
}
function Iw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function kw(t) {
  return String.fromCharCode.apply(null, t);
}
function Lw(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function hf(t) {
  if (t.some(Lw))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Cn(...t) {
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
function ie(t) {
  return Cn(...t.map((e) => typeof e == "number" ? hf([e]) : e instanceof Array ? hf(e) : e));
}
function He(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Vh = "https://api.mainnet.hiro.so", Wh = "https://api.testnet.hiro.so", Xh = "http://localhost:3999", Cw = "https://hub.blockstack.org", Bw = 33, ac = 32;
function Tw(t) {
  if (t.length < ac * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + ac * 2), r = t.slice(2 + ac * 2);
  return {
    recoveryId: $a(e),
    r: n,
    s: r
  };
}
function jl(t) {
  const e = typeof t == "string" ? Bt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Mw(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function _w(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Nw(t, e) {
  return t[e];
}
function Uw(t, e, n = 0) {
  return t[n] = e, t;
}
function Pw(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function rs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Hw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Ow(t, e) {
  const n = {};
  return Object.assign(n, Hw, e), await fetch(t, n);
}
function Dw(t) {
  let e = Ow, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Fw(...t) {
  const { fetchLib: e, middlewares: n } = Dw(t);
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
class qh {
  constructor(e = Gh.slice(), n = ((a) => (a = Dl("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = fw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Hc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function jw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Yh(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function zw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Hc(t.outputLen), Hc(t.blockLen);
}
function Rw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Gw(t, e) {
  Yh(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Vr = {
  number: Hc,
  bool: jw,
  bytes: Yh,
  hash: zw,
  exists: Rw,
  output: Gw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const cc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), bn = (t, e) => t << 32 - e | t >>> e, Kw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Kw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Vw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function zl(t) {
  if (typeof t == "string" && (t = Vw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Zh = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Es(t) {
  const e = (r) => t().update(zl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Qh = class extends Zh {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Vr.hash(e);
    const r = zl(n);
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
    return Vr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Vr.exists(this), Vr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const va = (t, e, n) => new Qh(t, e).update(n).digest();
va.create = (t, e) => new Qh(t, e);
function Ww(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let Rl = class extends Zh {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = cc(this.buffer);
  }
  update(e) {
    Vr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = zl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = cc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Vr.exists(this), Vr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Ww(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = cc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
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
const Xw = (t, e, n) => t & e ^ ~t & n, qw = (t, e, n) => t & e ^ t & n ^ e & n, Yw = new Uint32Array([
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
]), tr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), er = new Uint32Array(64);
let Jh = class extends Rl {
  constructor() {
    super(64, 32, 8, !1), this.A = tr[0] | 0, this.B = tr[1] | 0, this.C = tr[2] | 0, this.D = tr[3] | 0, this.E = tr[4] | 0, this.F = tr[5] | 0, this.G = tr[6] | 0, this.H = tr[7] | 0;
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
      er[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = er[l - 15], h = er[l - 2], x = bn(g, 7) ^ bn(g, 18) ^ g >>> 3, m = bn(h, 17) ^ bn(h, 19) ^ h >>> 10;
      er[l] = m + er[l - 7] + x + er[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = bn(a, 6) ^ bn(a, 11) ^ bn(a, 25), h = d + g + Xw(a, c, f) + Yw[l] + er[l] | 0, m = (bn(r, 2) ^ bn(r, 13) ^ bn(r, 22)) + qw(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    er.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Zw = class extends Jh {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const ti = Es(() => new Jh());
Es(() => new Zw());
const Qw = {}, t0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Qw
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Lt = BigInt(0), qt = BigInt(1), Ir = BigInt(2), _i = BigInt(3), pf = BigInt(8), Ft = Object.freeze({
  a: Lt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: qt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), gf = (t, e) => (t + e / Ir) / e, go = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = Ft, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -qt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = gf(i * t, e), c = gf(-r * t, e);
    let f = K(t - a * n - c * s, e), d = K(-a * r - c * i, e);
    const l = f > o, g = d > o;
    if (l && (f = e - f), g && (d = e - d), f > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: f, k2neg: g, k2: d };
  }
}, dn = 32, ss = 32, e0 = 32, Jo = dn + 1, ta = 2 * dn + 1;
function yf(t) {
  const { a: e, b: n } = Ft, r = K(t * t), s = K(r * t);
  return K(s + e * t + n);
}
const yo = Ft.a === Lt;
class Gl extends Error {
  constructor(e) {
    super(e);
  }
}
function wf(t) {
  if (!(t instanceof Ut))
    throw new TypeError("JacobianPoint expected");
}
class Ut {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof At))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(At.ZERO) ? Ut.ZERO : new Ut(e.x, e.y, qt);
  }
  static toAffineBatch(e) {
    const n = rb(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return Ut.toAffineBatch(e).map(Ut.fromAffine);
  }
  equals(e) {
    wf(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = K(s * s), f = K(a * a), d = K(n * f), l = K(i * c), g = K(K(r * a) * f), h = K(K(o * s) * c);
    return d === l && g === h;
  }
  negate() {
    return new Ut(this.x, K(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = K(e * e), i = K(n * n), o = K(i * i), a = e + i, c = K(Ir * (K(a * a) - s - o)), f = K(_i * s), d = K(f * f), l = K(d - Ir * c), g = K(f * (c - l) - pf * o), h = K(Ir * n * r);
    return new Ut(l, g, h);
  }
  add(e) {
    wf(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === Lt || o === Lt)
      return this;
    if (n === Lt || r === Lt)
      return e;
    const c = K(s * s), f = K(a * a), d = K(n * f), l = K(i * c), g = K(K(r * a) * f), h = K(K(o * s) * c), x = K(l - d), m = K(h - g);
    if (x === Lt)
      return m === Lt ? this.double() : Ut.ZERO;
    const L = K(x * x), b = K(x * L), T = K(d * L), w = K(m * m - b - Ir * T), B = K(m * (T - w) - g * b), C = K(s * a * x);
    return new Ut(w, B, C);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Ut.ZERO;
    if (typeof e == "bigint" && e === Lt)
      return n;
    let r = xf(e);
    if (r === qt)
      return this;
    if (!yo) {
      let l = n, g = this;
      for (; r > Lt; )
        r & qt && (l = l.add(g)), g = g.double(), r >>= qt;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = go.splitScalar(r), c = n, f = n, d = this;
    for (; i > Lt || a > Lt; )
      i & qt && (c = c.add(d)), a & qt && (f = f.add(d)), d = d.double(), i >>= qt, a >>= qt;
    return s && (c = c.negate()), o && (f = f.negate()), f = new Ut(K(f.x * go.beta), f.y, f.z), c.add(f);
  }
  precomputeWindow(e) {
    const n = yo ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(Ut.BASE) && (n = At.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Oc.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = Ut.normalizeZ(s), Oc.set(n, s)));
    let i = Ut.ZERO, o = Ut.BASE;
    const a = 1 + (yo ? 128 / r : 256 / r), c = 2 ** (r - 1), f = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let g = 0; g < a; g++) {
      const h = g * c;
      let x = Number(e & f);
      e >>= l, x > c && (x -= d, e += qt);
      const m = h, L = h + Math.abs(x) - 1, b = g % 2 !== 0, T = x < 0;
      x === 0 ? o = o.add(wo(b, s[m])) : i = i.add(wo(T, s[L]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = xf(e), s, i;
    if (yo) {
      const { k1neg: o, k1: a, k2neg: c, k2: f } = go.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: g, f: h } = this.wNAF(f, n);
      d = wo(o, d), g = wo(c, g), g = new Ut(K(g.x * go.beta), g.y, g.z), s = d.add(g), i = l.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return Ut.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(Ut.ZERO);
    e == null && (e = i ? pf : wi(s));
    const o = e, a = K(o * o), c = K(a * o), f = K(n * a), d = K(r * c), l = K(s * o);
    if (i)
      return At.ZERO;
    if (l !== qt)
      throw new Error("invZ was invalid");
    return new At(f, d);
  }
}
Ut.BASE = new Ut(Ft.Gx, Ft.Gy, qt);
Ut.ZERO = new Ut(Lt, qt, Lt);
function wo(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Oc = /* @__PURE__ */ new WeakMap();
class At {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Oc.delete(this);
  }
  hasEvenY() {
    return this.y % Ir === Lt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Ve(n ? e : e.subarray(1));
    if (!Go(r))
      throw new Error("Point is not on curve");
    const s = yf(r);
    let i = nb(s);
    const o = (i & qt) === qt;
    n ? o && (i = K(-i)) : (e[0] & 1) === 1 !== o && (i = K(-i));
    const a = new At(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Ve(e.subarray(1, dn + 1)), r = Ve(e.subarray(dn + 1, dn * 2 + 1)), s = new At(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Bn(e), r = n.length, s = n[0];
    if (r === dn)
      return this.fromCompressedHex(n);
    if (r === Jo && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === ta && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Jo} compressed bytes or ${ta} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return At.BASE.multiply(is(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = s0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Kl(Bn(e)), { n: a } = Ft, c = r === 2 || r === 3 ? s + a : s, f = wi(c, a), d = K(-o * f, a), l = K(i * f, a), g = r & 1 ? "03" : "02", h = At.fromHex(g + kr(c)), x = At.BASE.multiplyAndAddUnsafe(h, d, l);
    if (!x)
      throw new Error("Cannot recover signature: point at infinify");
    return x.assertValidity(), x;
  }
  toRawBytes(e = !1) {
    return Lr(this.toHex(e));
  }
  toHex(e = !1) {
    const n = kr(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${kr(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Go(n) || !Go(r))
      throw new Error(e);
    const s = K(r * r), i = yf(n);
    if (K(s - i) !== Lt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new At(this.x, K(-this.y));
  }
  double() {
    return Ut.fromAffine(this).double().toAffine();
  }
  add(e) {
    return Ut.fromAffine(this).add(Ut.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return Ut.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = Ut.fromAffine(this), i = n === Lt || n === qt || this !== At.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = Ut.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(Ut.ZERO) ? void 0 : a.toAffine();
  }
}
At.BASE = new At(Ft.Gx, Ft.Gy);
At.ZERO = new At(Lt, Lt);
function bf(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function mf(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${ei(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Ve(n), left: t.subarray(e + 2) };
}
function Jw(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${ei(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = mf(t.subarray(2)), { data: r, left: s } = mf(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${ei(s)}`);
  return { r: e, s: r };
}
class Ke {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? ei(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Ke(ea(s.slice(0, 64)), ea(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Jw(n ? e : Lr(e));
    return new Ke(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ri(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!ri(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = Ft.n >> qt;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Ke(this.r, K(-this.s, Ft.n)) : this;
  }
  toDERRawBytes() {
    return Lr(this.toDERHex());
  }
  toDERHex() {
    const e = bf(ki(this.s)), n = bf(ki(this.r)), r = e.length / 2, s = n.length / 2, i = ki(r), o = ki(s);
    return `30${ki(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Lr(this.toCompactHex());
  }
  toCompactHex() {
    return kr(this.r) + kr(this.s);
  }
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
const tb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ei(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += tb[t[n]];
  return e;
}
const eb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function kr(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Lt <= t && t < eb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function ni(t) {
  const e = Lr(kr(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function ki(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function ea(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Lr(t) {
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
function Ve(t) {
  return ea(ei(t));
}
function Bn(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Lr(t);
}
function xf(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && ri(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function K(t, e = Ft.P) {
  const n = t % e;
  return n >= Lt ? n : e + n;
}
function Qe(t, e) {
  const { P: n } = Ft;
  let r = t;
  for (; e-- > Lt; )
    r *= r, r %= n;
  return r;
}
function nb(t) {
  const { P: e } = Ft, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, f = c * c * t % e, d = Qe(f, _i) * f % e, l = Qe(d, _i) * f % e, g = Qe(l, Ir) * c % e, h = Qe(g, r) * g % e, x = Qe(h, s) * h % e, m = Qe(x, o) * x % e, L = Qe(m, a) * m % e, b = Qe(L, o) * x % e, T = Qe(b, _i) * f % e, w = Qe(T, i) * h % e, B = Qe(w, n) * c % e, C = Qe(B, Ir);
  if (C * C % e !== t)
    throw new Error("Cannot find square root");
  return C;
}
function wi(t, e = Ft.P) {
  if (t === Lt || e <= Lt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = K(t, e), r = e, s = Lt, i = qt;
  for (; n !== Lt; ) {
    const a = r / n, c = r % n, f = s - i * a;
    r = n, n = c, s = i, i = f;
  }
  if (r !== qt)
    throw new Error("invert: does not exist");
  return K(s, e);
}
function rb(t, e = Ft.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === Lt ? i : (n[a] = i, K(i * o, e)), qt), s = wi(r, e);
  return t.reduceRight((i, o, a) => o === Lt ? i : (n[a] = K(i * n[a], e), K(i * o, e)), s), n;
}
function sb(t) {
  const e = t.length * 8 - ss * 8, n = Ve(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Kl(t, e = !1) {
  const n = sb(t);
  if (e)
    return n;
  const { n: r } = Ft;
  return n >= r ? n - r : n;
}
let Ys, Ni;
class n0 {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return re.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return Ni(this.k, ...e);
  }
  checkSync() {
    if (typeof Ni != "function")
      throw new Gl("hmacSha256Sync needs to be set");
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
    return $r(...n);
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
    return $r(...n);
  }
}
function ri(t) {
  return Lt < t && t < Ft.n;
}
function Go(t) {
  return Lt < t && t < Ft.P;
}
function r0(t, e, n, r = !0) {
  const { n: s } = Ft, i = Kl(t, !0);
  if (!ri(i))
    return;
  const o = wi(i, s), a = At.BASE.multiply(i), c = K(a.x, s);
  if (c === Lt)
    return;
  const f = K(o * K(e + n * c, s), s);
  if (f === Lt)
    return;
  let d = new Ke(c, f), l = (a.x === d.r ? 0 : 2) | Number(a.y & qt);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function is(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * ss)
      throw new Error("Expected 32 bytes of private key");
    e = ea(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== ss)
      throw new Error("Expected 32 bytes of private key");
    e = Ve(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!ri(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Vl(t) {
  return t instanceof At ? (t.assertValidity(), t) : At.fromHex(t);
}
function s0(t) {
  if (t instanceof Ke)
    return t.assertValidity(), t;
  try {
    return Ke.fromDER(t);
  } catch {
    return Ke.fromCompact(t);
  }
}
function Ji(t, e = !1) {
  return At.fromPrivateKey(t).toRawBytes(e);
}
function ib(t, e, n, r = !1) {
  return At.fromSignature(t, e, n).toRawBytes(r);
}
function Sf(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Jo || r === ta : n ? r === Jo * 2 || r === ta * 2 : t instanceof At;
}
function Wl(t, e, n = !1) {
  if (Sf(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Sf(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Vl(e);
  return r.assertValidity(), r.multiply(is(t)).toRawBytes(n);
}
function i0(t) {
  const e = t.length > dn ? t.slice(0, dn) : t;
  return Ve(e);
}
function ob(t) {
  const e = i0(t), n = K(e, Ft.n);
  return o0(n < Lt ? e : n);
}
function o0(t) {
  return ni(t);
}
function a0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Bn(t), s = is(e), i = [o0(s), ob(r)];
  if (n != null) {
    n === !0 && (n = re.randomBytes(dn));
    const c = Bn(n);
    if (c.length !== dn)
      throw new Error(`sign: Expected ${dn} bytes of extra data`);
    i.push(c);
  }
  const o = $r(...i), a = i0(r);
  return { seed: o, m: a, d: s };
}
function c0(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function ab(t, e, n = {}) {
  const { seed: r, m: s, d: i } = a0(t, e, n.extraEntropy), o = new n0(e0, ss);
  await o.reseed(r);
  let a;
  for (; !(a = r0(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return c0(a, n);
}
function Ia(t, e, n = {}) {
  const { seed: r, m: s, d: i } = a0(t, e, n.extraEntropy), o = new n0(e0, ss);
  o.reseedSync(r);
  let a;
  for (; !(a = r0(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return c0(a, n);
}
const cb = { strict: !0 };
function lb(t, e, n, r = cb) {
  let s;
  try {
    s = s0(t), e = Bn(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Kl(e);
  let c;
  try {
    c = Vl(n);
  } catch {
    return !1;
  }
  const { n: f } = Ft, d = wi(o, f), l = K(a * d, f), g = K(i * d, f), h = At.BASE.multiplyAndAddUnsafe(c, l, g);
  return h ? K(h.x, f) === i : !1;
}
function na(t) {
  return K(Ve(t), Ft.n);
}
class si {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Bn(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Ve(n.subarray(0, 32)), s = Ve(n.subarray(32, 64));
    return new si(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Go(e) || !ri(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return kr(this.r) + kr(this.s);
  }
  toRawBytes() {
    return Lr(this.toHex());
  }
}
function ub(t) {
  return At.fromPrivateKey(t).toRawX();
}
class l0 {
  constructor(e, n, r = re.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Bn(e);
    const { x: s, scalar: i } = this.getScalar(is(n));
    if (this.px = s, this.d = i, this.rand = Bn(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = At.fromPrivateKey(e), r = n.hasEvenY() ? e : Ft.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return ni(e ^ Ve(n));
  }
  finalizeNonce(e) {
    const n = K(Ve(e), Ft.n);
    if (n === Lt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new si(e.x, K(n + r * s, Ft.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = re.taggedHash, o = this.initNonce(n, await i(Ar.aux, s)), { R: a, rx: c, k: f } = this.finalizeNonce(await i(Ar.nonce, o, r, e)), d = na(await i(Ar.challenge, c, r, e)), l = this.finalizeSig(a, f, d, n);
    return await d0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = re.taggedHashSync, o = this.initNonce(n, i(Ar.aux, s)), { R: a, rx: c, k: f } = this.finalizeNonce(i(Ar.nonce, o, r, e)), d = na(i(Ar.challenge, c, r, e)), l = this.finalizeSig(a, f, d, n);
    return h0(l, e, r) || this.error(), l;
  }
}
async function fb(t, e, n) {
  return new l0(t, e, n).calc();
}
function db(t, e, n) {
  return new l0(t, e, n).calcSync();
}
function u0(t, e, n) {
  const r = t instanceof si, s = r ? t : si.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Bn(e),
    P: Vl(n)
  };
}
function f0(t, e, n, r) {
  const s = At.BASE.multiplyAndAddUnsafe(e, is(n), K(-r, Ft.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function d0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = u0(t, e, n), a = na(await re.taggedHash(Ar.challenge, ni(r), o.toRawX(), i));
    return f0(r, o, s, a);
  } catch {
    return !1;
  }
}
function h0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = u0(t, e, n), a = na(re.taggedHashSync(Ar.challenge, ni(r), o.toRawX(), i));
    return f0(r, o, s, a);
  } catch (r) {
    if (r instanceof Gl)
      throw r;
    return !1;
  }
}
const hb = {
  Signature: si,
  getPublicKey: ub,
  sign: fb,
  verify: d0,
  signSync: db,
  verifySync: h0
};
At.BASE._setWindowSize(8);
const Fe = {
  node: t0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Ar = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, bo = {}, re = {
  bytesToHex: ei,
  hexToBytes: Lr,
  concatBytes: $r,
  mod: K,
  invert: wi,
  isValidPrivateKey(t) {
    try {
      return is(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: ni,
  _normalizePrivateKey: is,
  hashToPrivateKey: (t) => {
    t = Bn(t);
    const e = ss + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = K(Ve(t), Ft.n - qt) + qt;
    return ni(n);
  },
  randomBytes: (t = 32) => {
    if (Fe.web)
      return Fe.web.getRandomValues(new Uint8Array(t));
    if (Fe.node) {
      const { randomBytes: e } = Fe.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => re.hashToPrivateKey(re.randomBytes(ss + 8)),
  precompute(t = 8, e = At.BASE) {
    const n = e === At.BASE ? e : new At(e.x, e.y);
    return n._setWindowSize(t), n.multiply(_i), n;
  },
  sha256: async (...t) => {
    if (Fe.web) {
      const e = await Fe.web.subtle.digest("SHA-256", $r(...t));
      return new Uint8Array(e);
    } else if (Fe.node) {
      const { createHash: e } = Fe.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Fe.web) {
      const n = await Fe.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = $r(...e), s = await Fe.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Fe.node) {
      const { createHmac: n } = Fe.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = bo[t];
    if (n === void 0) {
      const r = await re.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = $r(r, r), bo[t] = n;
    }
    return re.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Ys != "function")
      throw new Gl("sha256Sync is undefined, you need to set it");
    let n = bo[t];
    if (n === void 0) {
      const r = Ys(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = $r(r, r), bo[t] = n;
    }
    return Ys(n, ...e);
  },
  _JacobianPoint: Ut
};
Object.defineProperties(re, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Ys;
    },
    set(t) {
      Ys || (Ys = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Ni;
    },
    set(t) {
      Ni || (Ni = t);
    }
  }
});
const pb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Ft,
  Point: At,
  Signature: Ke,
  getPublicKey: Ji,
  getSharedSecret: Wl,
  recoverPublicKey: ib,
  schnorr: hb,
  sign: ab,
  signSync: Ia,
  utils: re,
  verify: lb
}, Symbol.toStringTag, { value: "Module" }));
var to = {};
to.byteLength = mb;
var gb = to.toByteArray = Sb, yb = to.fromByteArray = $b, An = [], tn = [], wb = typeof Uint8Array < "u" ? Uint8Array : Array, lc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Ds = 0, bb = lc.length; Ds < bb; ++Ds)
  An[Ds] = lc[Ds], tn[lc.charCodeAt(Ds)] = Ds;
tn[45] = 62;
tn[95] = 63;
function p0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function mb(t) {
  var e = p0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function xb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Sb(t) {
  var e, n = p0(t), r = n[0], s = n[1], i = new wb(xb(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = tn[t.charCodeAt(c)] << 18 | tn[t.charCodeAt(c + 1)] << 12 | tn[t.charCodeAt(c + 2)] << 6 | tn[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = tn[t.charCodeAt(c)] << 2 | tn[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = tn[t.charCodeAt(c)] << 10 | tn[t.charCodeAt(c + 1)] << 4 | tn[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function Eb(t) {
  return An[t >> 18 & 63] + An[t >> 12 & 63] + An[t >> 6 & 63] + An[t & 63];
}
function Ab(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(Eb(r));
  return s.join("");
}
function $b(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(Ab(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    An[e >> 2] + An[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    An[e >> 10] + An[e >> 4 & 63] + An[e << 2 & 63] + "="
  )), s.join("");
}
function vb() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Ib = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function kb() {
  if (vb())
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
    throw new Error(Ib);
  }
}
class Lb {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(Cn(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(Cn(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class Cb {
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
async function g0() {
  const t = await kb();
  return t.name === "subtleCrypto" ? new Cb(t.lib) : new Lb(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Bb(t) {
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
  var o = t.length, a = t.charAt(0), c = Math.log(o) / Math.log(256), f = Math.log(256) / Math.log(o);
  function d(h) {
    if (h instanceof Uint8Array || (ArrayBuffer.isView(h) ? h = new Uint8Array(h.buffer, h.byteOffset, h.byteLength) : Array.isArray(h) && (h = Uint8Array.from(h))), !(h instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (h.length === 0)
      return "";
    for (var x = 0, m = 0, L = 0, b = h.length; L !== b && h[L] === 0; )
      L++, x++;
    for (var T = (b - L) * f + 1 >>> 0, w = new Uint8Array(T); L !== b; ) {
      for (var B = h[L], C = 0, D = T - 1; (B !== 0 || C < m) && D !== -1; D--, C++)
        B += 256 * w[D] >>> 0, w[D] = B % o >>> 0, B = B / o >>> 0;
      if (B !== 0)
        throw new Error("Non-zero carry");
      m = C, L++;
    }
    for (var q = T - m; q !== T && w[q] === 0; )
      q++;
    for (var O = a.repeat(x); q < T; ++q)
      O += t.charAt(w[q]);
    return O;
  }
  function l(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var x = 0, m = 0, L = 0; h[x] === a; )
      m++, x++;
    for (var b = (h.length - x) * c + 1 >>> 0, T = new Uint8Array(b); h[x]; ) {
      var w = h.charCodeAt(x);
      if (w > 255)
        return;
      var B = e[w];
      if (B === 255)
        return;
      for (var C = 0, D = b - 1; (B !== 0 || C < L) && D !== -1; D--, C++)
        B += o * T[D] >>> 0, T[D] = B % 256 >>> 0, B = B / 256 >>> 0;
      if (B !== 0)
        throw new Error("Non-zero carry");
      L = C, x++;
    }
    for (var q = b - L; q !== b && T[q] === 0; )
      q++;
    for (var O = new Uint8Array(m + (b - q)), W = m; q !== b; )
      O[W++] = T[q++];
    return O;
  }
  function g(h) {
    var x = l(h);
    if (x)
      return x;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: d,
    decodeUnsafe: l,
    decode: g
  };
}
var y0 = Bb;
const Tb = y0, Mb = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var _b = Tb(Mb);
const Nb = /* @__PURE__ */ Fh(_b), Ub = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), w0 = Uint8Array.from({ length: 16 }, (t, e) => e), Pb = w0.map((t) => (9 * t + 5) % 16);
let Xl = [w0], ql = [Pb];
for (let t = 0; t < 4; t++)
  for (let e of [Xl, ql])
    e.push(e[t].map((n) => Ub[n]));
const b0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Hb = Xl.map((t, e) => t.map((n) => b0[e][n])), Ob = ql.map((t, e) => t.map((n) => b0[e][n])), Db = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Fb = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), mo = (t, e) => t << e | t >>> 32 - e;
function Ef(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const xo = new Uint32Array(16);
let jb = class extends Rl {
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
    for (let h = 0; h < 16; h++, n += 4)
      xo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, m = Db[h], L = Fb[h], b = Xl[h], T = ql[h], w = Hb[h], B = Ob[h];
      for (let C = 0; C < 16; C++) {
        const D = mo(r + Ef(h, i, a, f) + xo[b[C]] + m, w[C]) + l | 0;
        r = l, l = f, f = mo(a, 10) | 0, a = i, i = D;
      }
      for (let C = 0; C < 16; C++) {
        const D = mo(s + Ef(x, o, c, d) + xo[T[C]] + L, B[C]) + g | 0;
        s = g, g = d, d = mo(c, 10) | 0, c = o, o = D;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    xo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const zb = Es(() => new jb());
function Rb(t) {
  return zb(t);
}
const So = BigInt(2 ** 32 - 1), Dc = BigInt(32);
function m0(t, e = !1) {
  return e ? { h: Number(t & So), l: Number(t >> Dc & So) } : { h: Number(t >> Dc & So) | 0, l: Number(t & So) | 0 };
}
function Gb(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = m0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Kb = (t, e) => BigInt(t >>> 0) << Dc | BigInt(e >>> 0), Vb = (t, e, n) => t >>> n, Wb = (t, e, n) => t << 32 - n | e >>> n, Xb = (t, e, n) => t >>> n | e << 32 - n, qb = (t, e, n) => t << 32 - n | e >>> n, Yb = (t, e, n) => t << 64 - n | e >>> n - 32, Zb = (t, e, n) => t >>> n - 32 | e << 64 - n, Qb = (t, e) => e, Jb = (t, e) => t, t1 = (t, e, n) => t << n | e >>> 32 - n, e1 = (t, e, n) => e << n | t >>> 32 - n, n1 = (t, e, n) => e << n - 32 | t >>> 64 - n, r1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function s1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const i1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), o1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, a1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), c1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, l1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), u1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, wt = {
  fromBig: m0,
  split: Gb,
  toBig: Kb,
  shrSH: Vb,
  shrSL: Wb,
  rotrSH: Xb,
  rotrSL: qb,
  rotrBH: Yb,
  rotrBL: Zb,
  rotr32H: Qb,
  rotr32L: Jb,
  rotlSH: t1,
  rotlSL: e1,
  rotlBH: n1,
  rotlBL: r1,
  add: s1,
  add3L: i1,
  add3H: o1,
  add4L: a1,
  add4H: c1,
  add5H: u1,
  add5L: l1
}, [f1, d1] = wt.split([
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
].map((t) => BigInt(t))), nr = new Uint32Array(80), rr = new Uint32Array(80);
let ka = class extends Rl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: x, Hh: m, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, x, m, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, x, m, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = m | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let w = 0; w < 16; w++, n += 4)
      nr[w] = e.getUint32(n), rr[w] = e.getUint32(n += 4);
    for (let w = 16; w < 80; w++) {
      const B = nr[w - 15] | 0, C = rr[w - 15] | 0, D = wt.rotrSH(B, C, 1) ^ wt.rotrSH(B, C, 8) ^ wt.shrSH(B, C, 7), q = wt.rotrSL(B, C, 1) ^ wt.rotrSL(B, C, 8) ^ wt.shrSL(B, C, 7), O = nr[w - 2] | 0, W = rr[w - 2] | 0, S = wt.rotrSH(O, W, 19) ^ wt.rotrBH(O, W, 61) ^ wt.shrSH(O, W, 6), $ = wt.rotrSL(O, W, 19) ^ wt.rotrBL(O, W, 61) ^ wt.shrSL(O, W, 6), H = wt.add4L(q, $, rr[w - 7], rr[w - 16]), Y = wt.add4H(H, D, S, nr[w - 7], nr[w - 16]);
      nr[w] = Y | 0, rr[w] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: x, Gh: m, Gl: L, Hh: b, Hl: T } = this;
    for (let w = 0; w < 80; w++) {
      const B = wt.rotrSH(l, g, 14) ^ wt.rotrSH(l, g, 18) ^ wt.rotrBH(l, g, 41), C = wt.rotrSL(l, g, 14) ^ wt.rotrSL(l, g, 18) ^ wt.rotrBL(l, g, 41), D = l & h ^ ~l & m, q = g & x ^ ~g & L, O = wt.add5L(T, C, q, d1[w], rr[w]), W = wt.add5H(O, b, B, D, f1[w], nr[w]), S = O | 0, $ = wt.rotrSH(r, s, 28) ^ wt.rotrBH(r, s, 34) ^ wt.rotrBH(r, s, 39), H = wt.rotrSL(r, s, 28) ^ wt.rotrBL(r, s, 34) ^ wt.rotrBL(r, s, 39), Y = r & i ^ r & a ^ i & a, et = s & o ^ s & c ^ o & c;
      b = m | 0, T = L | 0, m = h | 0, L = x | 0, h = l | 0, x = g | 0, { h: l, l: g } = wt.add(f | 0, d | 0, W | 0, S | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const X = wt.add3L(S, H, et);
      r = wt.add3H(X, W, $, Y), s = X | 0;
    }
    ({ h: r, l: s } = wt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = wt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = wt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = wt.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = wt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: x } = wt.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: m, l: L } = wt.add(this.Gh | 0, this.Gl | 0, m | 0, L | 0), { h: b, l: T } = wt.add(this.Hh | 0, this.Hl | 0, b | 0, T | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, x, m, L, b, T);
  }
  roundClean() {
    nr.fill(0), rr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, h1 = class extends ka {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, p1 = class extends ka {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, g1 = class extends ka {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const y1 = Es(() => new ka());
Es(() => new h1());
Es(() => new p1());
Es(() => new g1());
function x0(t) {
  return ti(t);
}
function w1(t) {
  return y1(t);
}
const b1 = 0;
re.hmacSha256Sync = (t, ...e) => {
  const n = va.create(ti, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function m1() {
  return it(re.randomPrivateKey());
}
function x1(t) {
  const e = ti(ti(t));
  return Nb.encode(Cn(t, e).slice(0, t.length + 4));
}
function S1(t, e) {
  return x1(Cn(new Uint8Array([t]), e.slice(0, 20)));
}
function S0(t, e = b1) {
  const n = typeof t == "string" ? Bt(t) : t, r = Rb(x0(n));
  return S1(e, r);
}
function E0(t) {
  const e = jl(t);
  return it(Ji(e.slice(0, 32), !0));
}
re.hmacSha256Sync = (t, ...e) => {
  const n = va.create(ti, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var ra;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(ra || (ra = {}));
async function E1(t, e, n) {
  return await (await g0()).encrypt("aes-256-cbc", e, t, n);
}
async function A1(t, e, n) {
  return await (await g0()).decrypt("aes-256-cbc", e, t, n);
}
function A0(t, e) {
  return va(ti, t, e);
}
function $1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function $0(t) {
  const e = w1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function v1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function I1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: ra.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: ra.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !v1(t))
    return e;
  try {
    return At.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function k1(t, e, n, r) {
  const s = I1(t);
  if (!s.result)
    throw s;
  const i = re.randomPrivateKey(), o = Ji(i, !0);
  let a = Wl(i, t, !0);
  a = a.slice(1);
  const c = $0(a), f = re.randomBytes(16), d = await E1(f, c.encryptionKey, e), l = Cn(f, o, d), g = A0(c.hmacKey, l);
  let h;
  if (!r || r === "hex")
    h = it(d);
  else if (r === "base64")
    h = yb(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const x = {
    iv: it(f),
    ephemeralPK: it(o),
    cipherText: h,
    mac: it(g),
    wasString: n
  };
  return r && r !== "hex" && (x.cipherTextEncoding = r), x;
}
async function v0(t, e) {
  if (!e.ephemeralPK)
    throw new uf("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Wl(t, n, !0);
  r = r.slice(1);
  const s = $0(r), i = Bt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Bt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = gb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = Cn(i, Bt(n), o), c = A0(s.hmacKey, a), f = Bt(e.mac);
  if (!$1(f, c))
    throw new uf("Decryption failed: failure in MAC check");
  const d = await A1(i, s.encryptionKey, o);
  return e.wasString ? Qi(d) : d;
}
function L1(t, e) {
  const n = typeof e == "string" ? Ss(e) : e, r = E0(t), s = x0(n), i = Ia(s, t);
  return {
    signature: it(i),
    publicKey: r
  };
}
async function C1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = E0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Ss(t) : t, o = await k1(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = L1(r, a), f = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(f);
  }
  return a;
}
function B1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return v0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var me = {}, ii = {}, ve = {};
Object.defineProperty(ve, "__esModule", { value: !0 });
ve.decode = ve.encode = ve.unescape = ve.escape = ve.pad = void 0;
const I0 = to;
function Yl(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
ve.pad = Yl;
function k0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
ve.escape = k0;
function L0(t) {
  return Yl(t).replace(/-/g, "+").replace(/_/g, "/");
}
ve.unescape = L0;
function T1(t) {
  return k0((0, I0.fromByteArray)(new TextEncoder().encode(t)));
}
ve.encode = T1;
function M1(t) {
  return new TextDecoder().decode((0, I0.toByteArray)(Yl(L0(t))));
}
ve.decode = M1;
var La = {}, Ca = {}, C0 = {}, B0 = {}, Ba = {};
Object.defineProperty(Ba, "__esModule", { value: !0 });
Ba.crypto = void 0;
Ba.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = f, t.clean = d, t.createView = l, t.rotr = g, t.rotl = h, t.byteSwap = x, t.byteSwap32 = m, t.bytesToHex = T, t.hexToBytes = C, t.asyncLoop = q, t.utf8ToBytes = O, t.bytesToUtf8 = W, t.toBytes = S, t.kdfInputToBytes = $, t.concatBytes = H, t.checkOpts = Y, t.createHasher = X, t.createOptHasher = $t, t.createXOFer = le, t.randomBytes = de;
  const e = Ba;
  function n(A) {
    return A instanceof Uint8Array || ArrayBuffer.isView(A) && A.constructor.name === "Uint8Array";
  }
  function r(A) {
    if (!Number.isSafeInteger(A) || A < 0)
      throw new Error("positive integer expected, got " + A);
  }
  function s(A, ...N) {
    if (!n(A))
      throw new Error("Uint8Array expected");
    if (N.length > 0 && !N.includes(A.length))
      throw new Error("Uint8Array expected of length " + N + ", got length=" + A.length);
  }
  function i(A) {
    if (typeof A != "function" || typeof A.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(A.outputLen), r(A.blockLen);
  }
  function o(A, N = !0) {
    if (A.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (N && A.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(A, N) {
    s(A);
    const yt = N.outputLen;
    if (A.length < yt)
      throw new Error("digestInto() expects output buffer of length at least " + yt);
  }
  function c(A) {
    return new Uint8Array(A.buffer, A.byteOffset, A.byteLength);
  }
  function f(A) {
    return new Uint32Array(A.buffer, A.byteOffset, Math.floor(A.byteLength / 4));
  }
  function d(...A) {
    for (let N = 0; N < A.length; N++)
      A[N].fill(0);
  }
  function l(A) {
    return new DataView(A.buffer, A.byteOffset, A.byteLength);
  }
  function g(A, N) {
    return A << 32 - N | A >>> N;
  }
  function h(A, N) {
    return A << N | A >>> 32 - N >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function x(A) {
    return A << 24 & 4278190080 | A << 8 & 16711680 | A >>> 8 & 65280 | A >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (A) => A : (A) => x(A), t.byteSwapIfBE = t.swap8IfBE;
  function m(A) {
    for (let N = 0; N < A.length; N++)
      A[N] = x(A[N]);
    return A;
  }
  t.swap32IfBE = t.isLE ? (A) => A : m;
  const L = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", b = /* @__PURE__ */ Array.from({ length: 256 }, (A, N) => N.toString(16).padStart(2, "0"));
  function T(A) {
    if (s(A), L)
      return A.toHex();
    let N = "";
    for (let yt = 0; yt < A.length; yt++)
      N += b[A[yt]];
    return N;
  }
  const w = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function B(A) {
    if (A >= w._0 && A <= w._9)
      return A - w._0;
    if (A >= w.A && A <= w.F)
      return A - (w.A - 10);
    if (A >= w.a && A <= w.f)
      return A - (w.a - 10);
  }
  function C(A) {
    if (typeof A != "string")
      throw new Error("hex string expected, got " + typeof A);
    if (L)
      return Uint8Array.fromHex(A);
    const N = A.length, yt = N / 2;
    if (N % 2)
      throw new Error("hex string expected, got unpadded hex of length " + N);
    const ot = new Uint8Array(yt);
    for (let ct = 0, Dt = 0; ct < yt; ct++, Dt += 2) {
      const Zt = B(A.charCodeAt(Dt)), Vt = B(A.charCodeAt(Dt + 1));
      if (Zt === void 0 || Vt === void 0) {
        const Tt = A[Dt] + A[Dt + 1];
        throw new Error('hex string expected, got non-hex character "' + Tt + '" at index ' + Dt);
      }
      ot[ct] = Zt * 16 + Vt;
    }
    return ot;
  }
  const D = async () => {
  };
  t.nextTick = D;
  async function q(A, N, yt) {
    let ot = Date.now();
    for (let ct = 0; ct < A; ct++) {
      yt(ct);
      const Dt = Date.now() - ot;
      Dt >= 0 && Dt < N || (await (0, t.nextTick)(), ot += Dt);
    }
  }
  function O(A) {
    if (typeof A != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(A));
  }
  function W(A) {
    return new TextDecoder().decode(A);
  }
  function S(A) {
    return typeof A == "string" && (A = O(A)), s(A), A;
  }
  function $(A) {
    return typeof A == "string" && (A = O(A)), s(A), A;
  }
  function H(...A) {
    let N = 0;
    for (let ot = 0; ot < A.length; ot++) {
      const ct = A[ot];
      s(ct), N += ct.length;
    }
    const yt = new Uint8Array(N);
    for (let ot = 0, ct = 0; ot < A.length; ot++) {
      const Dt = A[ot];
      yt.set(Dt, ct), ct += Dt.length;
    }
    return yt;
  }
  function Y(A, N) {
    if (N !== void 0 && {}.toString.call(N) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(A, N);
  }
  class et {
  }
  t.Hash = et;
  function X(A) {
    const N = (ot) => A().update(S(ot)).digest(), yt = A();
    return N.outputLen = yt.outputLen, N.blockLen = yt.blockLen, N.create = () => A(), N;
  }
  function $t(A) {
    const N = (ot, ct) => A(ct).update(S(ot)).digest(), yt = A({});
    return N.outputLen = yt.outputLen, N.blockLen = yt.blockLen, N.create = (ot) => A(ot), N;
  }
  function le(A) {
    const N = (ot, ct) => A(ct).update(S(ot)).digest(), yt = A({});
    return N.outputLen = yt.outputLen, N.blockLen = yt.blockLen, N.create = (ot) => A(ot), N;
  }
  t.wrapConstructor = X, t.wrapConstructorWithOpts = $t, t.wrapXOFConstructorWithOpts = le;
  function de(A = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(A));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(A));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(B0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = B0;
  class n extends e.Hash {
    constructor(i, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(i);
      const a = (0, e.toBytes)(o);
      if (this.iHash = i.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, f = new Uint8Array(c);
      f.set(a.length > c ? i.create().update(a).digest() : a);
      for (let d = 0; d < f.length; d++)
        f[d] ^= 54;
      this.iHash.update(f), this.oHash = i.create();
      for (let d = 0; d < f.length; d++)
        f[d] ^= 106;
      this.oHash.update(f), (0, e.clean)(f);
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
      const { oHash: o, iHash: a, finished: c, destroyed: f, blockLen: d, outputLen: l } = this;
      return i = i, i.finished = c, i.destroyed = f, i.blockLen = d, i.outputLen = l, i.oHash = o._cloneInto(i.oHash), i.iHash = a._cloneInto(i.iHash), i;
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
})(C0);
const Fs = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function T0(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Fc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function As(t, ...e) {
  if (!T0(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function _1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Fc(t.outputLen), Fc(t.blockLen);
}
function jc(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function M0(t, e) {
  As(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function N1(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function U1(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function sa(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Ko(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function on(t, e) {
  return t << 32 - e | t >>> e;
}
function P1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Zl = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Ql(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const _0 = Zl ? (t) => t : (t) => Ql(t), H1 = _0;
function N0(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Ql(t[e]);
  return t;
}
const O1 = Zl ? (t) => t : N0, U0 = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", D1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function P0(t) {
  if (As(t), U0)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += D1[t[n]];
  return e;
}
const Hn = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Af(t) {
  if (t >= Hn._0 && t <= Hn._9)
    return t - Hn._0;
  if (t >= Hn.A && t <= Hn.F)
    return t - (Hn.A - 10);
  if (t >= Hn.a && t <= Hn.f)
    return t - (Hn.a - 10);
}
function F1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (U0)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = Af(t.charCodeAt(i)), a = Af(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const H0 = async () => {
};
async function j1(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await H0(), r += i);
  }
}
function Jl(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function z1(t) {
  return new TextDecoder().decode(t);
}
function eo(t) {
  return typeof t == "string" && (t = Jl(t)), As(t), t;
}
function R1(t) {
  return typeof t == "string" && (t = Jl(t)), As(t), t;
}
function G1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    As(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function K1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let O0 = class {
};
function Ta(t) {
  const e = (r) => t().update(eo(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function D0(t) {
  const e = (r, s) => t(s).update(eo(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function F0(t) {
  const e = (r, s) => t(s).update(eo(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const V1 = Ta, W1 = D0, X1 = F0;
function q1(t = 32) {
  if (Fs && typeof Fs.getRandomValues == "function")
    return Fs.getRandomValues(new Uint8Array(t));
  if (Fs && typeof Fs.randomBytes == "function")
    return Uint8Array.from(Fs.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const Y1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: O0,
  abytes: As,
  aexists: jc,
  ahash: _1,
  anumber: Fc,
  aoutput: M0,
  asyncLoop: j1,
  byteSwap: Ql,
  byteSwap32: N0,
  byteSwapIfBE: H1,
  bytesToHex: P0,
  bytesToUtf8: z1,
  checkOpts: K1,
  clean: sa,
  concatBytes: G1,
  createHasher: Ta,
  createOptHasher: D0,
  createView: Ko,
  createXOFer: F0,
  hexToBytes: F1,
  isBytes: T0,
  isLE: Zl,
  kdfInputToBytes: R1,
  nextTick: H0,
  randomBytes: q1,
  rotl: P1,
  rotr: on,
  swap32IfBE: O1,
  swap8IfBE: _0,
  toBytes: eo,
  u32: U1,
  u8: N1,
  utf8ToBytes: Jl,
  wrapConstructor: V1,
  wrapConstructorWithOpts: W1,
  wrapXOFConstructorWithOpts: X1
}, Symbol.toStringTag, { value: "Module" }));
function Z1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
function Q1(t, e, n) {
  return t & e ^ ~t & n;
}
function J1(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class tm extends O0 {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = Ko(this.buffer);
  }
  update(e) {
    jc(this), e = eo(e), As(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Ko(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    jc(this), M0(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, sa(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Z1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ko(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
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
const sr = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ir = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), em = /* @__PURE__ */ Uint32Array.from([
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
]), or = /* @__PURE__ */ new Uint32Array(64);
let tu = class extends tm {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = sr[0] | 0, this.B = sr[1] | 0, this.C = sr[2] | 0, this.D = sr[3] | 0, this.E = sr[4] | 0, this.F = sr[5] | 0, this.G = sr[6] | 0, this.H = sr[7] | 0;
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
      or[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = or[l - 15], h = or[l - 2], x = on(g, 7) ^ on(g, 18) ^ g >>> 3, m = on(h, 17) ^ on(h, 19) ^ h >>> 10;
      or[l] = m + or[l - 7] + x + or[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = on(a, 6) ^ on(a, 11) ^ on(a, 25), h = d + g + Q1(a, c, f) + em[l] + or[l] | 0, m = (on(r, 2) ^ on(r, 13) ^ on(r, 22)) + J1(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    sa(or);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), sa(this.buffer);
  }
}, j0 = class extends tu {
  constructor() {
    super(28), this.A = ir[0] | 0, this.B = ir[1] | 0, this.C = ir[2] | 0, this.D = ir[3] | 0, this.E = ir[4] | 0, this.F = ir[5] | 0, this.G = ir[6] | 0, this.H = ir[7] | 0;
  }
};
const nm = /* @__PURE__ */ Ta(() => new tu()), rm = /* @__PURE__ */ Ta(() => new j0()), sm = tu, z0 = nm, im = j0, om = rm, am = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: im,
  SHA256: sm,
  sha224: om,
  sha256: z0
}, Symbol.toStringTag, { value: "Module" })), Ma = /* @__PURE__ */ Aa(am), cm = /* @__PURE__ */ Aa(pb);
var oi = {};
Object.defineProperty(oi, "__esModule", { value: !0 });
oi.joseToDer = oi.derToJose = void 0;
const R0 = to, G0 = ve;
function uc(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const lm = {
  ES256: uc(256),
  ES384: uc(384),
  ES512: uc(521)
};
function K0(t) {
  const e = lm[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const ia = 128, V0 = 0, um = 32, fm = 16, dm = 2, W0 = fm | um | V0 << 6, oa = dm | V0 << 6;
function X0(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, R0.toByteArray)((0, G0.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function hm(t, e) {
  const n = X0(t), r = K0(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== W0)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (ia | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== oa)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const f = o;
  if (o += c, n[o++] !== oa)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[o++];
  if (i - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${i - o}"`);
  if (s < d)
    throw new Error(`"s" specified length of "${d}", max of "${s}" is acceptable`);
  const l = o;
  if (o += d, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const g = r - c, h = r - d, x = new Uint8Array(g + c + h + d);
  for (o = 0; o < g; ++o)
    x[o] = 0;
  x.set(n.subarray(f + Math.max(-g, 0), f + c), o), o = r;
  for (const m = o; o < m + h; ++o)
    x[o] = 0;
  return x.set(n.subarray(l + Math.max(-h, 0), l + d), o), (0, G0.escape)((0, R0.fromByteArray)(x));
}
oi.derToJose = hm;
function $f(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= ia && --r, r;
}
function pm(t, e) {
  t = X0(t);
  const n = K0(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = $f(t, 0, n), i = $f(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, f = c < ia, d = new Uint8Array((f ? 2 : 3) + c);
  let l = 0;
  return d[l++] = W0, f ? d[l++] = c : (d[l++] = ia | 1, d[l++] = c & 255), d[l++] = oa, d[l++] = o, s < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(s, n), l), l += n - s), d[l++] = oa, d[l++] = a, i < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + i), l), d;
}
oi.joseToDer = pm;
var Kn = {};
Object.defineProperty(Kn, "__esModule", { value: !0 });
Kn.InvalidTokenError = Kn.MissingParametersError = void 0;
class gm extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Kn.MissingParametersError = gm;
class ym extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Kn.InvalidTokenError = ym;
const no = /* @__PURE__ */ Aa(Y1);
Object.defineProperty(Ca, "__esModule", { value: !0 });
Ca.SECP256K1Client = void 0;
const wm = C0, bm = Ma, Vo = cm, vf = oi, If = Kn, kf = no;
Vo.utils.hmacSha256Sync = (t, ...e) => {
  const n = wm.hmac.create(bm.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class q0 {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, kf.bytesToHex)(Vo.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new If.MissingParametersError("a signing input hash and private key are all required");
    const s = Vo.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, kf.bytesToHex)(s);
    if (r === "jose")
      return (0, vf.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, vf.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new If.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Vo.verify(n, e, r, { strict: !1 });
  }
}
Ca.SECP256K1Client = q0;
q0.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Ca;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(La);
var os = {};
const mm = /* @__PURE__ */ Aa(t0);
var xm = ke && ke.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(d) {
      try {
        f(r.next(d));
      } catch (l) {
        o(l);
      }
    }
    function c(d) {
      try {
        f(r.throw(d));
      } catch (l) {
        o(l);
      }
    }
    function f(d) {
      d.done ? i(d.value) : s(d.value).then(a, c);
    }
    f((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(os, "__esModule", { value: !0 });
os.hashSha256Async = os.hashSha256 = void 0;
const Sm = Ma;
function Y0(t) {
  return (0, Sm.sha256)(t);
}
os.hashSha256 = Y0;
function Em(t) {
  return xm(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = mm;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Y0(t));
    }
  });
}
os.hashSha256Async = Em;
var Am = ke && ke.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(d) {
      try {
        f(r.next(d));
      } catch (l) {
        o(l);
      }
    }
    function c(d) {
      try {
        f(r.throw(d));
      } catch (l) {
        o(l);
      }
    }
    function f(d) {
      d.done ? i(d.value) : s(d.value).then(a, c);
    }
    f((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(ii, "__esModule", { value: !0 });
ii.TokenSigner = ii.createUnsecuredToken = void 0;
const zc = ve, Lf = La, $m = Kn, Cf = os;
function Rc(t, e) {
  const n = [], r = zc.encode(JSON.stringify(e));
  n.push(r);
  const s = zc.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function vm(t) {
  return Rc(t, { typ: "JWT", alg: "none" }) + ".";
}
ii.createUnsecuredToken = vm;
class Im {
  constructor(e, n) {
    if (!(e && n))
      throw new $m.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Lf.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Lf.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = Rc(e, s), o = (0, Cf.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return Am(this, void 0, void 0, function* () {
      const s = this.header(r), i = Rc(e, s), o = yield (0, Cf.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [zc.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
ii.TokenSigner = Im;
var _a = {};
Object.defineProperty(_a, "__esModule", { value: !0 });
_a.TokenVerifier = void 0;
const km = ve, Bf = La, Lm = Kn, Eo = os;
class Cm {
  constructor(e, n) {
    if (!(e && n))
      throw new Lm.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Bf.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Bf.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Eo.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, Eo.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), km.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Eo.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, Eo.hashSha256)(r);
      return i(o);
    }
  }
}
_a.TokenVerifier = Cm;
var Na = {};
Object.defineProperty(Na, "__esModule", { value: !0 });
Na.decodeToken = void 0;
const Ao = ve;
function Bm(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Ao.decode(e[0])), r = JSON.parse(Ao.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Ao.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Ao.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Na.decodeToken = Bm;
(function(t) {
  var e = ke && ke.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = ke && ke.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(ii, t), n(_a, t), n(Na, t), n(Kn, t), n(La, t);
})(me);
function Tm(t) {
  return `did:btc-addr:${t}`;
}
function Mm(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new lf("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new lf('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Z0(t) {
  if (t)
    return Mm(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const _m = "1.4.0";
function Nm() {
  return m1();
}
function Um(t, e, n, r = Gh.slice(), s, i = yw().getTime(), o = {}) {
  const a = (h) => {
    const x = Dl("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return x == null ? void 0 : x.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: bw(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: _m,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), f = me.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [f];
  const d = S0(f);
  return c.iss = Tm(d), new me.TokenSigner("ES256k", t).sign(c);
}
async function Tf(t, e) {
  const n = Qi(Bt(e)), r = JSON.parse(n), s = await v0(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function Pm(t) {
  const e = me.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new me.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function Hm(t) {
  const e = me.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Z0(e.iss);
  if (n.length === 1) {
    if (S0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function Om(t) {
  const e = me.decodeToken(t).payload;
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
function Dm(t) {
  const e = me.decodeToken(t).payload;
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
function Fm(t) {
  const e = [
    Dm(t),
    Om(t),
    Pm(t),
    Hm(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Mf = "1.0.0";
class Cr {
  constructor(e) {
    this.version = Mf, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Mf)
      throw new Nc(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Cr(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Q0 {
  constructor(e) {
    if (e) {
      const n = new Cr(e);
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
class _f extends Q0 {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Cr({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Kh("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Cr({})), !0;
  }
}
class Nf extends Q0 {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = hw, !localStorage.getItem(this.key)) {
      const r = new Cr({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Kh("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Cr.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Cr({})), !0;
  }
}
var Fi;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Fi || (Fi = {}));
var aa;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(aa || (aa = {}));
Fi.Mainnet;
var Rn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Rn || (Rn = {}));
var vn;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(vn || (vn = {}));
Rn.Mainnet;
const J0 = {
  chainId: Fi.Mainnet,
  transactionVersion: Rn.Mainnet,
  peerNetworkId: aa.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: vn.MainnetSingleSig,
    multiSig: vn.MainnetMultiSig
  },
  client: { baseUrl: Vh }
}, Gc = {
  chainId: Fi.Testnet,
  transactionVersion: Rn.Testnet,
  peerNetworkId: aa.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: vn.TestnetSingleSig,
    multiSig: vn.TestnetMultiSig
  },
  client: { baseUrl: Wh }
}, Wo = {
  ...Gc,
  addressVersion: { ...Gc.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Xh }
}, jm = {
  ...Wo,
  addressVersion: { ...Wo.addressVersion },
  client: { ...Wo.client }
};
function zm(t) {
  switch (t) {
    case "mainnet":
      return J0;
    case "testnet":
      return Gc;
    case "devnet":
      return Wo;
    case "mocknet":
      return jm;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function tp(t) {
  return typeof t == "string" ? zm(t) : t;
}
var Uf;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Uf || (Uf = {}));
var Pf;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Pf || (Pf = {}));
var cn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(cn || (cn = {}));
const fc = ["onChainOnly", "offChainOnly", "any"];
fc[0] + "", cn.OnChainOnly, fc[1] + "", cn.OffChainOnly, fc[2] + "", cn.Any, cn.OnChainOnly + "", cn.OnChainOnly, cn.OffChainOnly + "", cn.OffChainOnly, cn.Any + "", cn.Any;
var Hf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Hf || (Hf = {}));
var Of;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Of || (Of = {}));
var Df;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Df || (Df = {}));
var jn;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(jn || (jn = {}));
var Ff;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ff || (Ff = {}));
var jf;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(jf || (jf = {}));
var zf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(zf || (zf = {}));
var Rf;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Rf || (Rf = {}));
var Gf;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Gf || (Gf = {}));
var Kf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Kf || (Kf = {}));
var Vf;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Vf || (Vf = {}));
var Wf;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Wf || (Wf = {}));
var Xf;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Xf || (Xf = {}));
function Kc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Rm(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function ep(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Gm(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Kc(t.outputLen), Kc(t.blockLen);
}
function Km(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Vm(t, e) {
  ep(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Wr = {
  number: Kc,
  bool: Rm,
  bytes: ep,
  hash: Gm,
  exists: Km,
  output: Vm
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const dc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), mn = (t, e) => t << 32 - e | t >>> e, Wm = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Wm)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Xm(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function eu(t) {
  if (typeof t == "string" && (t = Xm(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let np = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function $s(t) {
  const e = (r) => t().update(eu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let rp = class extends np {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Wr.hash(e);
    const r = eu(n);
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
    return Wr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Wr.exists(this), Wr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const sp = (t, e, n) => new rp(t, e).update(n).digest();
sp.create = (t, e) => new rp(t, e);
function qm(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let nu = class extends np {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = dc(this.buffer);
  }
  update(e) {
    Wr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = eu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = dc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Wr.exists(this), Wr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    qm(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = dc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
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
const Ym = (t, e, n) => t & e ^ ~t & n, Zm = (t, e, n) => t & e ^ t & n ^ e & n, Qm = new Uint32Array([
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
]), ar = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), cr = new Uint32Array(64);
let ip = class extends nu {
  constructor() {
    super(64, 32, 8, !1), this.A = ar[0] | 0, this.B = ar[1] | 0, this.C = ar[2] | 0, this.D = ar[3] | 0, this.E = ar[4] | 0, this.F = ar[5] | 0, this.G = ar[6] | 0, this.H = ar[7] | 0;
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
      cr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = cr[l - 15], h = cr[l - 2], x = mn(g, 7) ^ mn(g, 18) ^ g >>> 3, m = mn(h, 17) ^ mn(h, 19) ^ h >>> 10;
      cr[l] = m + cr[l - 7] + x + cr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = mn(a, 6) ^ mn(a, 11) ^ mn(a, 25), h = d + g + Ym(a, c, f) + Qm[l] + cr[l] | 0, m = (mn(r, 2) ^ mn(r, 13) ^ mn(r, 22)) + Zm(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    cr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Jm = class extends ip {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const op = $s(() => new ip());
$s(() => new Jm());
var vs = {}, ru = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = no;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], f = 0;
    for (let h = o.length - 1; h >= 0; h--)
      if (f < 4) {
        const x = n.indexOf(o[h]) >> f;
        let m = 0;
        h !== 0 && (m = n.indexOf(o[h - 1]));
        const L = 1 + f, b = m % (1 << L) << 5 - L, T = t.c32[x + b];
        f = L, c.unshift(T);
      } else
        f = 0;
    let d = 0;
    for (let h = 0; h < c.length && c[h] === "0"; h++)
      d++;
    c = c.slice(d);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), g = l ? l[0].length : 0;
    for (let h = 0; h < g; h++)
      c.unshift(t.c32[0]);
    if (a) {
      const h = a - c.length;
      for (let x = 0; x < h; x++)
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
    const c = o.match(`^${t.c32[0]}*`), f = c ? c[0].length : 0;
    let d = [], l = 0, g = 0;
    for (let m = o.length - 1; m >= 0; m--) {
      g === 4 && (d.unshift(n[l]), g = 0, l = 0);
      const b = (t.c32.indexOf(o[m]) << g) + l, T = n[b % 16];
      if (g += 1, l = b >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      d.unshift(T);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let h = 0;
    for (let m = 0; m < d.length && d[m] === "0"; m++)
      h++;
    d = d.slice(h - h % 2);
    let x = d.join("");
    for (let m = 0; m < f; m++)
      x = `00${x}`;
    if (a) {
      const m = a * 2 - x.length;
      for (let L = 0; L < m; L += 2)
        x = `00${x}`;
    }
    return x;
  }
  t.c32decode = i;
})(ru);
var as = {};
Object.defineProperty(as, "__esModule", { value: !0 });
as.c32checkDecode = as.c32checkEncode = void 0;
const qf = Ma, Yf = no, Ui = ru;
function ap(t) {
  const e = (0, qf.sha256)((0, qf.sha256)((0, Yf.hexToBytes)(t)));
  return (0, Yf.bytesToHex)(e.slice(0, 4));
}
function t2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = ap(`${n}${e}`), s = (0, Ui.c32encode)(`${e}${r}`);
  return `${Ui.c32[t]}${s}`;
}
as.c32checkEncode = t2;
function e2(t) {
  t = (0, Ui.c32normalize)(t);
  const e = (0, Ui.c32decode)(t.slice(1)), n = t[0], r = Ui.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), ap(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
as.c32checkDecode = e2;
var cp = {}, ai = {};
Object.defineProperty(ai, "__esModule", { value: !0 });
ai.decode = ai.encode = void 0;
const ca = Ma, Zf = no, lp = y0, up = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function n2(t, e = "00") {
  const n = typeof t == "string" ? (0, Zf.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Zf.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, ca.sha256)((0, ca.sha256)(new Uint8Array([...r, ...n])));
  return lp(up).encode([...r, ...n, ...s.slice(0, 4)]);
}
ai.encode = n2;
function r2(t) {
  const e = lp(up).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, ca.sha256)((0, ca.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
ai.decode = r2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = as, n = ai, r = no;
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
    const g = n.decode(d), h = (0, r.bytesToHex)(g.data), x = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let m;
    return l < 0 ? (m = x, s[x] !== void 0 && (m = s[x])) : m = l, o(m, h);
  }
  t.b58ToC32 = c;
  function f(d, l = -1) {
    const g = a(d), h = g[0], x = g[1];
    let m;
    l < 0 ? (m = h, i[h] !== void 0 && (m = i[h])) : m = l;
    let L = m.toString(16);
    return L.length === 1 && (L = `0${L}`), n.encode(x, L);
  }
  t.c32ToB58 = f;
})(cp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = ru;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = as;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = cp;
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
})(vs);
function s2(t, e) {
  switch (e = tp(e ?? J0), t) {
    case jn.P2PKH:
      switch (e.transactionVersion) {
        case Rn.Mainnet:
          return vn.MainnetSingleSig;
        case Rn.Testnet:
          return vn.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case jn.P2SH:
    case jn.P2SHNonSequential:
    case jn.P2WPKH:
    case jn.P2WSH:
    case jn.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Rn.Mainnet:
          return vn.MainnetMultiSig;
        case Rn.Testnet:
          return vn.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const i2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), fp = Uint8Array.from({ length: 16 }, (t, e) => e), o2 = fp.map((t) => (9 * t + 5) % 16);
let su = [fp], iu = [o2];
for (let t = 0; t < 4; t++)
  for (let e of [su, iu])
    e.push(e[t].map((n) => i2[n]));
const dp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), a2 = su.map((t, e) => t.map((n) => dp[e][n])), c2 = iu.map((t, e) => t.map((n) => dp[e][n])), l2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), u2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), $o = (t, e) => t << e | t >>> 32 - e;
function Qf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const vo = new Uint32Array(16);
let f2 = class extends nu {
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
    for (let h = 0; h < 16; h++, n += 4)
      vo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, m = l2[h], L = u2[h], b = su[h], T = iu[h], w = a2[h], B = c2[h];
      for (let C = 0; C < 16; C++) {
        const D = $o(r + Qf(h, i, a, f) + vo[b[C]] + m, w[C]) + l | 0;
        r = l, l = f, f = $o(a, 10) | 0, a = i, i = D;
      }
      for (let C = 0; C < 16; C++) {
        const D = $o(s + Qf(x, o, c, d) + vo[T[C]] + L, B[C]) + g | 0;
        s = g, g = d, d = $o(c, 10) | 0, c = o, o = D;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    vo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const d2 = $s(() => new f2()), Io = BigInt(2 ** 32 - 1), Vc = BigInt(32);
function hp(t, e = !1) {
  return e ? { h: Number(t & Io), l: Number(t >> Vc & Io) } : { h: Number(t >> Vc & Io) | 0, l: Number(t & Io) | 0 };
}
function h2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = hp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const p2 = (t, e) => BigInt(t >>> 0) << Vc | BigInt(e >>> 0), g2 = (t, e, n) => t >>> n, y2 = (t, e, n) => t << 32 - n | e >>> n, w2 = (t, e, n) => t >>> n | e << 32 - n, b2 = (t, e, n) => t << 32 - n | e >>> n, m2 = (t, e, n) => t << 64 - n | e >>> n - 32, x2 = (t, e, n) => t >>> n - 32 | e << 64 - n, S2 = (t, e) => e, E2 = (t, e) => t, A2 = (t, e, n) => t << n | e >>> 32 - n, $2 = (t, e, n) => e << n | t >>> 32 - n, v2 = (t, e, n) => e << n - 32 | t >>> 64 - n, I2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function k2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const L2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), C2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, B2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), T2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, M2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), _2 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, bt = {
  fromBig: hp,
  split: h2,
  toBig: p2,
  shrSH: g2,
  shrSL: y2,
  rotrSH: w2,
  rotrSL: b2,
  rotrBH: m2,
  rotrBL: x2,
  rotr32H: S2,
  rotr32L: E2,
  rotlSH: A2,
  rotlSL: $2,
  rotlBH: v2,
  rotlBL: I2,
  add: k2,
  add3L: L2,
  add3H: C2,
  add4L: B2,
  add4H: T2,
  add5H: _2,
  add5L: M2
}, [N2, U2] = bt.split([
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
].map((t) => BigInt(t))), lr = new Uint32Array(80), ur = new Uint32Array(80);
let Ua = class extends nu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: x, Hh: m, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, x, m, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, x, m, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = m | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let w = 0; w < 16; w++, n += 4)
      lr[w] = e.getUint32(n), ur[w] = e.getUint32(n += 4);
    for (let w = 16; w < 80; w++) {
      const B = lr[w - 15] | 0, C = ur[w - 15] | 0, D = bt.rotrSH(B, C, 1) ^ bt.rotrSH(B, C, 8) ^ bt.shrSH(B, C, 7), q = bt.rotrSL(B, C, 1) ^ bt.rotrSL(B, C, 8) ^ bt.shrSL(B, C, 7), O = lr[w - 2] | 0, W = ur[w - 2] | 0, S = bt.rotrSH(O, W, 19) ^ bt.rotrBH(O, W, 61) ^ bt.shrSH(O, W, 6), $ = bt.rotrSL(O, W, 19) ^ bt.rotrBL(O, W, 61) ^ bt.shrSL(O, W, 6), H = bt.add4L(q, $, ur[w - 7], ur[w - 16]), Y = bt.add4H(H, D, S, lr[w - 7], lr[w - 16]);
      lr[w] = Y | 0, ur[w] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: x, Gh: m, Gl: L, Hh: b, Hl: T } = this;
    for (let w = 0; w < 80; w++) {
      const B = bt.rotrSH(l, g, 14) ^ bt.rotrSH(l, g, 18) ^ bt.rotrBH(l, g, 41), C = bt.rotrSL(l, g, 14) ^ bt.rotrSL(l, g, 18) ^ bt.rotrBL(l, g, 41), D = l & h ^ ~l & m, q = g & x ^ ~g & L, O = bt.add5L(T, C, q, U2[w], ur[w]), W = bt.add5H(O, b, B, D, N2[w], lr[w]), S = O | 0, $ = bt.rotrSH(r, s, 28) ^ bt.rotrBH(r, s, 34) ^ bt.rotrBH(r, s, 39), H = bt.rotrSL(r, s, 28) ^ bt.rotrBL(r, s, 34) ^ bt.rotrBL(r, s, 39), Y = r & i ^ r & a ^ i & a, et = s & o ^ s & c ^ o & c;
      b = m | 0, T = L | 0, m = h | 0, L = x | 0, h = l | 0, x = g | 0, { h: l, l: g } = bt.add(f | 0, d | 0, W | 0, S | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const X = bt.add3L(S, H, et);
      r = bt.add3H(X, W, $, Y), s = X | 0;
    }
    ({ h: r, l: s } = bt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = bt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = bt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = bt.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = bt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: x } = bt.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: m, l: L } = bt.add(this.Gh | 0, this.Gl | 0, m | 0, L | 0), { h: b, l: T } = bt.add(this.Hh | 0, this.Hl | 0, b | 0, T | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, x, m, L, b, T);
  }
  roundClean() {
    lr.fill(0), ur.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, P2 = class extends Ua {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, H2 = class extends Ua {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, O2 = class extends Ua {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
$s(() => new Ua());
$s(() => new P2());
$s(() => new H2());
$s(() => new O2());
var la = { exports: {} };
la.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", f = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", h = "[object Number]", x = "[object Object]", m = "[object Promise]", L = "[object RegExp]", b = "[object Set]", T = "[object String]", w = "[object Symbol]", B = "[object WeakMap]", C = "[object ArrayBuffer]", D = "[object DataView]", q = "[object Float32Array]", O = "[object Float64Array]", W = "[object Int8Array]", S = "[object Int16Array]", $ = "[object Int32Array]", H = "[object Uint8Array]", Y = "[object Uint8ClampedArray]", et = "[object Uint16Array]", X = "[object Uint32Array]", $t = /[\\^$.*+?()[\]{}|]/g, le = /\w*$/, de = /^\[object .+?Constructor\]$/, A = /^(?:0|[1-9]\d*)$/, N = {};
  N[i] = N[o] = N[C] = N[D] = N[a] = N[c] = N[q] = N[O] = N[W] = N[S] = N[$] = N[g] = N[h] = N[x] = N[L] = N[b] = N[T] = N[w] = N[H] = N[Y] = N[et] = N[X] = !0, N[f] = N[d] = N[B] = !1;
  var yt = typeof ke == "object" && ke && ke.Object === Object && ke, ot = typeof self == "object" && self && self.Object === Object && self, ct = yt || ot || Function("return this")(), Dt = e && !e.nodeType && e, Zt = Dt && !0 && t && !t.nodeType && t, Vt = Zt && Zt.exports === Dt;
  function Tt(p, I) {
    return p.set(I[0], I[1]), p;
  }
  function ae(p, I) {
    return p.add(I), p;
  }
  function te(p, I) {
    for (var _ = -1, tt = p ? p.length : 0; ++_ < tt && I(p[_], _, p) !== !1; )
      ;
    return p;
  }
  function gn(p, I) {
    for (var _ = -1, tt = I.length, we = p.length; ++_ < tt; )
      p[we + _] = I[_];
    return p;
  }
  function M(p, I, _, tt) {
    for (var we = -1, _e = p ? p.length : 0; ++we < _e; )
      _ = I(_, p[we], we, p);
    return _;
  }
  function R(p, I) {
    for (var _ = -1, tt = Array(p); ++_ < p; )
      tt[_] = I(_);
    return tt;
  }
  function z(p, I) {
    return p == null ? void 0 : p[I];
  }
  function rt(p) {
    var I = !1;
    if (p != null && typeof p.toString != "function")
      try {
        I = !!(p + "");
      } catch {
      }
    return I;
  }
  function at(p) {
    var I = -1, _ = Array(p.size);
    return p.forEach(function(tt, we) {
      _[++I] = [we, tt];
    }), _;
  }
  function Ot(p, I) {
    return function(_) {
      return p(I(_));
    };
  }
  function Ct(p) {
    var I = -1, _ = Array(p.size);
    return p.forEach(function(tt) {
      _[++I] = tt;
    }), _;
  }
  var Nt = Array.prototype, Wt = Function.prototype, ge = Object.prototype, ye = ct["__core-js_shared__"], Kt = function() {
    var p = /[^.]+$/.exec(ye && ye.keys && ye.keys.IE_PROTO || "");
    return p ? "Symbol(src)_1." + p : "";
  }(), u = Wt.toString, E = ge.hasOwnProperty, v = ge.toString, U = RegExp(
    "^" + u.call(E).replace($t, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Q = Vt ? ct.Buffer : void 0, ft = ct.Symbol, Rt = ct.Uint8Array, Pt = Ot(Object.getPrototypeOf, Object), Oe = Object.create, Bs = ge.propertyIsEnumerable, Xn = Nt.splice, Nn = Object.getOwnPropertySymbols, Ae = Q ? Q.isBuffer : void 0, Pr = Ot(Object.keys, Object), sn = Hs(ct, "DataView"), lt = Hs(ct, "Map"), Mt = Hs(ct, "Promise"), _t = Hs(ct, "Set"), De = Hs(ct, "WeakMap"), kt = Hs(Object, "create"), Ce = jr(sn), Hr = jr(lt), yn = jr(Mt), qn = jr(_t), Yn = jr(De), Un = ft ? ft.prototype : void 0, Xe = Un ? Un.valueOf : void 0;
  function Be(p) {
    var I = -1, _ = p ? p.length : 0;
    for (this.clear(); ++I < _; ) {
      var tt = p[I];
      this.set(tt[0], tt[1]);
    }
  }
  function Zn() {
    this.__data__ = kt ? kt(null) : {};
  }
  function Ts(p) {
    return this.has(p) && delete this.__data__[p];
  }
  function Ms(p) {
    var I = this.__data__;
    if (kt) {
      var _ = I[p];
      return _ === r ? void 0 : _;
    }
    return E.call(I, p) ? I[p] : void 0;
  }
  function _s(p) {
    var I = this.__data__;
    return kt ? I[p] !== void 0 : E.call(I, p);
  }
  function Ns(p, I) {
    var _ = this.__data__;
    return _[p] = kt && I === void 0 ? r : I, this;
  }
  Be.prototype.clear = Zn, Be.prototype.delete = Ts, Be.prototype.get = Ms, Be.prototype.has = _s, Be.prototype.set = Ns;
  function Te(p) {
    var I = -1, _ = p ? p.length : 0;
    for (this.clear(); ++I < _; ) {
      var tt = p[I];
      this.set(tt[0], tt[1]);
    }
  }
  function qe() {
    this.__data__ = [];
  }
  function j(p) {
    var I = this.__data__, _ = Jn(I, p);
    if (_ < 0)
      return !1;
    var tt = I.length - 1;
    return _ == tt ? I.pop() : Xn.call(I, _, 1), !0;
  }
  function st(p) {
    var I = this.__data__, _ = Jn(I, p);
    return _ < 0 ? void 0 : I[_][1];
  }
  function ce(p) {
    return Jn(this.__data__, p) > -1;
  }
  function he(p, I) {
    var _ = this.__data__, tt = Jn(_, p);
    return tt < 0 ? _.push([p, I]) : _[tt][1] = I, this;
  }
  Te.prototype.clear = qe, Te.prototype.delete = j, Te.prototype.get = st, Te.prototype.has = ce, Te.prototype.set = he;
  function Ye(p) {
    var I = -1, _ = p ? p.length : 0;
    for (this.clear(); ++I < _; ) {
      var tt = p[I];
      this.set(tt[0], tt[1]);
    }
  }
  function Or() {
    this.__data__ = {
      hash: new Be(),
      map: new (lt || Te)(),
      string: new Be()
    };
  }
  function Us(p) {
    return uo(this, p).delete(p);
  }
  function Za(p) {
    return uo(this, p).get(p);
  }
  function ue(p) {
    return uo(this, p).has(p);
  }
  function Qa(p, I) {
    return uo(this, p).set(p, I), this;
  }
  Ye.prototype.clear = Or, Ye.prototype.delete = Us, Ye.prototype.get = Za, Ye.prototype.has = ue, Ye.prototype.set = Qa;
  function Qn(p) {
    this.__data__ = new Te(p);
  }
  function Ps() {
    this.__data__ = new Te();
  }
  function ao(p) {
    return this.__data__.delete(p);
  }
  function Ai(p) {
    return this.__data__.get(p);
  }
  function Ja(p) {
    return this.__data__.has(p);
  }
  function $i(p, I) {
    var _ = this.__data__;
    if (_ instanceof Te) {
      var tt = _.__data__;
      if (!lt || tt.length < n - 1)
        return tt.push([p, I]), this;
      _ = this.__data__ = new Ye(tt);
    }
    return _.set(p, I), this;
  }
  Qn.prototype.clear = Ps, Qn.prototype.delete = ao, Qn.prototype.get = Ai, Qn.prototype.has = Ja, Qn.prototype.set = $i;
  function tc(p, I) {
    var _ = nc(p) || _y(p) ? R(p.length, String) : [], tt = _.length, we = !!tt;
    for (var _e in p)
      E.call(p, _e) && !(we && (_e == "length" || Cy(_e, tt))) && _.push(_e);
    return _;
  }
  function co(p, I, _) {
    var tt = p[I];
    (!(E.call(p, I) && Qu(tt, _)) || _ === void 0 && !(I in p)) && (p[I] = _);
  }
  function Jn(p, I) {
    for (var _ = p.length; _--; )
      if (Qu(p[_][0], I))
        return _;
    return -1;
  }
  function ec(p, I) {
    return p && qu(I, rc(I), p);
  }
  function y(p, I, _, tt, we, _e, Pn) {
    var Ne;
    if (tt && (Ne = _e ? tt(p, we, _e, Pn) : tt(p)), Ne !== void 0)
      return Ne;
    if (!fo(p))
      return p;
    var ef = nc(p);
    if (ef) {
      if (Ne = Iy(p), !I)
        return lo(p, Ne);
    } else {
      var Os = Fr(p), nf = Os == d || Os == l;
      if (Uy(p))
        return dt(p, I);
      if (Os == x || Os == i || nf && !_e) {
        if (rt(p))
          return _e ? p : {};
        if (Ne = ky(nf ? {} : p), !I)
          return $y(p, ec(Ne, p));
      } else {
        if (!N[Os])
          return _e ? p : {};
        Ne = Ly(p, Os, y, I);
      }
    }
    Pn || (Pn = new Qn());
    var rf = Pn.get(p);
    if (rf)
      return rf;
    if (Pn.set(p, Ne), !ef)
      var sf = _ ? vy(p) : rc(p);
    return te(sf || p, function(sc, ho) {
      sf && (ho = sc, sc = p[ho]), co(Ne, ho, y(sc, I, _, tt, ho, p, Pn));
    }), Ne;
  }
  function k(p) {
    return fo(p) ? Oe(p) : {};
  }
  function F(p, I, _) {
    var tt = I(p);
    return nc(p) ? tt : gn(tt, _(p));
  }
  function Z(p) {
    return v.call(p);
  }
  function J(p) {
    if (!fo(p) || Ty(p))
      return !1;
    var I = tf(p) || rt(p) ? U : de;
    return I.test(jr(p));
  }
  function G(p) {
    if (!Zu(p))
      return Pr(p);
    var I = [];
    for (var _ in Object(p))
      E.call(p, _) && _ != "constructor" && I.push(_);
    return I;
  }
  function dt(p, I) {
    if (I)
      return p.slice();
    var _ = new p.constructor(p.length);
    return p.copy(_), _;
  }
  function ut(p) {
    var I = new p.constructor(p.byteLength);
    return new Rt(I).set(new Rt(p)), I;
  }
  function ht(p, I) {
    var _ = I ? ut(p.buffer) : p.buffer;
    return new p.constructor(_, p.byteOffset, p.byteLength);
  }
  function xe(p, I, _) {
    var tt = I ? _(at(p), !0) : at(p);
    return M(tt, Tt, new p.constructor());
  }
  function Me(p) {
    var I = new p.constructor(p.source, le.exec(p));
    return I.lastIndex = p.lastIndex, I;
  }
  function Dr(p, I, _) {
    var tt = I ? _(Ct(p), !0) : Ct(p);
    return M(tt, ae, new p.constructor());
  }
  function Ze(p) {
    return Xe ? Object(Xe.call(p)) : {};
  }
  function wn(p, I) {
    var _ = I ? ut(p.buffer) : p.buffer;
    return new p.constructor(_, p.byteOffset, p.length);
  }
  function lo(p, I) {
    var _ = -1, tt = p.length;
    for (I || (I = Array(tt)); ++_ < tt; )
      I[_] = p[_];
    return I;
  }
  function qu(p, I, _, tt) {
    _ || (_ = {});
    for (var we = -1, _e = I.length; ++we < _e; ) {
      var Pn = I[we], Ne = void 0;
      co(_, Pn, Ne === void 0 ? p[Pn] : Ne);
    }
    return _;
  }
  function $y(p, I) {
    return qu(p, Yu(p), I);
  }
  function vy(p) {
    return F(p, rc, Yu);
  }
  function uo(p, I) {
    var _ = p.__data__;
    return By(I) ? _[typeof I == "string" ? "string" : "hash"] : _.map;
  }
  function Hs(p, I) {
    var _ = z(p, I);
    return J(_) ? _ : void 0;
  }
  var Yu = Nn ? Ot(Nn, Object) : Oy, Fr = Z;
  (sn && Fr(new sn(new ArrayBuffer(1))) != D || lt && Fr(new lt()) != g || Mt && Fr(Mt.resolve()) != m || _t && Fr(new _t()) != b || De && Fr(new De()) != B) && (Fr = function(p) {
    var I = v.call(p), _ = I == x ? p.constructor : void 0, tt = _ ? jr(_) : void 0;
    if (tt)
      switch (tt) {
        case Ce:
          return D;
        case Hr:
          return g;
        case yn:
          return m;
        case qn:
          return b;
        case Yn:
          return B;
      }
    return I;
  });
  function Iy(p) {
    var I = p.length, _ = p.constructor(I);
    return I && typeof p[0] == "string" && E.call(p, "index") && (_.index = p.index, _.input = p.input), _;
  }
  function ky(p) {
    return typeof p.constructor == "function" && !Zu(p) ? k(Pt(p)) : {};
  }
  function Ly(p, I, _, tt) {
    var we = p.constructor;
    switch (I) {
      case C:
        return ut(p);
      case a:
      case c:
        return new we(+p);
      case D:
        return ht(p, tt);
      case q:
      case O:
      case W:
      case S:
      case $:
      case H:
      case Y:
      case et:
      case X:
        return wn(p, tt);
      case g:
        return xe(p, tt, _);
      case h:
      case T:
        return new we(p);
      case L:
        return Me(p);
      case b:
        return Dr(p, tt, _);
      case w:
        return Ze(p);
    }
  }
  function Cy(p, I) {
    return I = I ?? s, !!I && (typeof p == "number" || A.test(p)) && p > -1 && p % 1 == 0 && p < I;
  }
  function By(p) {
    var I = typeof p;
    return I == "string" || I == "number" || I == "symbol" || I == "boolean" ? p !== "__proto__" : p === null;
  }
  function Ty(p) {
    return !!Kt && Kt in p;
  }
  function Zu(p) {
    var I = p && p.constructor, _ = typeof I == "function" && I.prototype || ge;
    return p === _;
  }
  function jr(p) {
    if (p != null) {
      try {
        return u.call(p);
      } catch {
      }
      try {
        return p + "";
      } catch {
      }
    }
    return "";
  }
  function My(p) {
    return y(p, !0, !0);
  }
  function Qu(p, I) {
    return p === I || p !== p && I !== I;
  }
  function _y(p) {
    return Ny(p) && E.call(p, "callee") && (!Bs.call(p, "callee") || v.call(p) == i);
  }
  var nc = Array.isArray;
  function Ju(p) {
    return p != null && Py(p.length) && !tf(p);
  }
  function Ny(p) {
    return Hy(p) && Ju(p);
  }
  var Uy = Ae || Dy;
  function tf(p) {
    var I = fo(p) ? v.call(p) : "";
    return I == d || I == l;
  }
  function Py(p) {
    return typeof p == "number" && p > -1 && p % 1 == 0 && p <= s;
  }
  function fo(p) {
    var I = typeof p;
    return !!p && (I == "object" || I == "function");
  }
  function Hy(p) {
    return !!p && typeof p == "object";
  }
  function rc(p) {
    return Ju(p) ? tc(p) : G(p);
  }
  function Oy() {
    return [];
  }
  function Dy() {
    return !1;
  }
  t.exports = My;
})(la, la.exports);
var D2 = la.exports;
const pp = /* @__PURE__ */ Fh(D2);
var Wc;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Wc || (Wc = {}));
function F2(t, e) {
  return { type: Wc.Address, version: t, hash160: e };
}
function j2(t) {
  return vs.c32address(t.version, t.hash160);
}
const z2 = (t) => d2(op(t)), R2 = (t) => it(z2(t));
re.hmacSha256Sync = (t, ...e) => {
  const n = sp.create(op, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function G2(t, e = "mainnet") {
  e = tp(e), t = typeof t == "string" ? Bt(t) : t;
  const n = s2(jn.P2PKH, e), r = F2(n, R2(t));
  return j2(r);
}
function K2(t, e) {
  const n = me.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = G2(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new me.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function V2(t, e = null) {
  let n;
  e ? n = K2(t, e) : n = me.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Jf = "_blockstackDidCheckEchoReply", W2 = "echoReply", X2 = "authContinuation";
function q2(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Y2() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Jf];
  if (typeof e == "boolean")
    return e;
  const n = q2(t.location.search), r = n[W2];
  if (r) {
    t[Jf] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[X2];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class Xc {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new qh();
    else
      throw new gw("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Nf(e.sessionOptions) : this.store = new Nf() : e ? this.store = new _f(e.sessionOptions) : this.store = new _f();
  }
  makeAuthRequestToken(e, n, r, s, i, o = ww().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Nc("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, Um(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Nm();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Dl("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Y2())
        return Gs.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Gs.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Fw()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new po("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = me.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Fm(e))
      throw new po("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (oc(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Tf(s, i.private_key);
          } catch {
            if (Gs.warn("Failed decryption of appPrivateKey, will try to use as given"), !re.isValidPrivateKey(i.private_key))
              throw new po("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Tf(s, c);
          } catch {
            Gs.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new po("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let f = Cw, d;
    oc(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (f = i.hubUrl), oc(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (d = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: Z0(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: f,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: d
    }, g = i.profile_url;
    if (!l.profile && g) {
      const h = await n(g);
      if (!h.ok)
        l.profile = Object.assign({}, dw);
      else {
        const x = await h.text(), m = JSON.parse(x);
        l.profile = V2(m[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Nc("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), C1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), B1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Xc.prototype.makeAuthRequest = Xc.prototype.makeAuthRequestToken;
const Z2 = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Q2 = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = Z2(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!Pa(r.id));
  return e.concat(n);
}, Pa = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), gp = "STX_PROVIDER", cs = () => typeof window > "u" ? null : window.localStorage.getItem(gp), J2 = (t) => {
  typeof window < "u" && window.localStorage.setItem(gp, t);
}, tx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function ex(t, e) {
  const n = {};
  return Object.assign(n, tx, e), await fetch(t, n);
}
function nx(t) {
  let e = ex, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function rx(...t) {
  const { fetchLib: e, middlewares: n } = nx(t);
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
var ci;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ci || (ci = {}));
var ls;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ls || (ls = {}));
var td;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(td || (td = {}));
const sx = "https://api.mainnet.hiro.so", ix = "https://api.testnet.hiro.so", ox = "http://localhost:3999", ax = ["mainnet", "testnet", "devnet", "mocknet"];
class us {
  constructor(e) {
    this.version = ls.Mainnet, this.chainId = ci.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === ls.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? rx();
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
us.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new qc();
    case "testnet":
      return new Yc();
    case "devnet":
      return new cx();
    case "mocknet":
      return new yp();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${ax.join(", ")}`);
  }
};
us.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : us.fromName(t);
class qc extends us {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? sx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ls.Mainnet, this.chainId = ci.Mainnet;
  }
}
class Yc extends us {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ix,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ls.Testnet, this.chainId = ci.Testnet;
  }
}
class yp extends us {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ox,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ls.Testnet, this.chainId = ci.Testnet;
  }
}
const cx = yp;
var fs;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(fs || (fs = {}));
var ua;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ua || (ua = {}));
fs.Mainnet;
var ds;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ds || (ds = {}));
var hs;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(hs || (hs = {}));
ds.Mainnet;
const lx = {
  chainId: fs.Mainnet,
  transactionVersion: ds.Mainnet,
  peerNetworkId: ua.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: hs.MainnetSingleSig,
    multiSig: hs.MainnetMultiSig
  },
  client: { baseUrl: Vh }
}, Zc = {
  chainId: fs.Testnet,
  transactionVersion: ds.Testnet,
  peerNetworkId: ua.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: hs.TestnetSingleSig,
    multiSig: hs.TestnetMultiSig
  },
  client: { baseUrl: Wh }
}, Xo = {
  ...Zc,
  addressVersion: { ...Zc.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Xh }
}, ux = {
  ...Xo,
  addressVersion: { ...Xo.addressVersion },
  client: { ...Xo.client }
};
function fx(t) {
  switch (t) {
    case "mainnet":
      return lx;
    case "testnet":
      return Zc;
    case "devnet":
      return Xo;
    case "mocknet":
      return ux;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function dx(t) {
  return typeof t == "string" ? fx(t) : t;
}
function hx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const ed = /* @__PURE__ */ new Map();
function wp(t, e) {
  const n = ed.get(t);
  if (n !== void 0)
    return n(e);
  const r = hx(t);
  return ed.set(t, r), wp(t, e);
}
let Gt = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Bt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Pw(this.readBytes(4), 0);
  }
  readUInt8() {
    return Nw(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Mw(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = it(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = it(n);
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
    if (wp(e, r))
      return r;
    throw n(r);
  }
};
const px = 128, gx = 128, bp = 16, Jr = 32, Qc = 80, Ha = 65, yx = 32, wx = 64, fa = 34, bx = 1 + 16 * 1024 * 1024, mx = 165, xx = 16, Sx = 16, Ex = 20, Ax = Sx + 2 + Ex, $x = Ax + 4, vx = bx + (mx + xx * $x);
var Ht;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ht || (Ht = {}));
var Jc;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Jc || (Jc = {}));
var je;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(je || (je = {}));
const hc = ["onChainOnly", "offChainOnly", "any"];
hc[0] + "", je.OnChainOnly, hc[1] + "", je.OffChainOnly, hc[2] + "", je.Any, je.OnChainOnly + "", je.OnChainOnly, je.OffChainOnly + "", je.OffChainOnly, je.Any + "", je.Any;
var da;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(da || (da = {}));
var Xt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Xt || (Xt = {}));
var ee;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ee || (ee = {}));
var jt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(jt || (jt = {}));
var Qt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Qt || (Qt = {}));
var Pi;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Pi || (Pi = {}));
var tl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(tl || (tl = {}));
var el;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(el || (el = {}));
var Ie;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ie || (Ie = {}));
var nd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(nd || (nd = {}));
var nl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(nl || (nl = {}));
var un;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(un || (un = {}));
var rd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(rd || (rd = {}));
let Oa = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ks = class extends Oa {
  constructor(e) {
    super(e);
  }
}, $e = class extends Oa {
  constructor(e) {
    super(e);
  }
}, ha = class extends Oa {
  constructor(e) {
    super(e);
  }
}, Xr = class extends Oa {
  constructor(e) {
    super(e);
  }
};
function rl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Ix(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function mp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function kx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  rl(t.outputLen), rl(t.blockLen);
}
function Lx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Cx(t, e) {
  mp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const qr = {
  number: rl,
  bool: Ix,
  bytes: mp,
  hash: kx,
  exists: Lx,
  output: Cx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const pc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), xn = (t, e) => t << 32 - e | t >>> e, Bx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Bx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Tx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function ou(t) {
  if (typeof t == "string" && (t = Tx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let xp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Is(t) {
  const e = (r) => t().update(ou(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Sp = class extends xp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, qr.hash(e);
    const r = ou(n);
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
    return qr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    qr.exists(this), qr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Ep = (t, e, n) => new Sp(t, e).update(n).digest();
Ep.create = (t, e) => new Sp(t, e);
function Mx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let au = class extends xp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = pc(this.buffer);
  }
  update(e) {
    qr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = ou(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = pc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    qr.exists(this), qr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Mx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = pc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
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
const _x = (t, e, n) => t & e ^ ~t & n, Nx = (t, e, n) => t & e ^ t & n ^ e & n, Ux = new Uint32Array([
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
]), fr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), dr = new Uint32Array(64);
let Ap = class extends au {
  constructor() {
    super(64, 32, 8, !1), this.A = fr[0] | 0, this.B = fr[1] | 0, this.C = fr[2] | 0, this.D = fr[3] | 0, this.E = fr[4] | 0, this.F = fr[5] | 0, this.G = fr[6] | 0, this.H = fr[7] | 0;
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
      dr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = dr[l - 15], h = dr[l - 2], x = xn(g, 7) ^ xn(g, 18) ^ g >>> 3, m = xn(h, 17) ^ xn(h, 19) ^ h >>> 10;
      dr[l] = m + dr[l - 7] + x + dr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = xn(a, 6) ^ xn(a, 11) ^ xn(a, 25), h = d + g + _x(a, c, f) + Ux[l] + dr[l] | 0, m = (xn(r, 2) ^ xn(r, 13) ^ xn(r, 22)) + Nx(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    dr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Px = class extends Ap {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const cu = Is(() => new Ap());
Is(() => new Px());
const Hx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), $p = Uint8Array.from({ length: 16 }, (t, e) => e), Ox = $p.map((t) => (9 * t + 5) % 16);
let lu = [$p], uu = [Ox];
for (let t = 0; t < 4; t++)
  for (let e of [lu, uu])
    e.push(e[t].map((n) => Hx[n]));
const vp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Dx = lu.map((t, e) => t.map((n) => vp[e][n])), Fx = uu.map((t, e) => t.map((n) => vp[e][n])), jx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), zx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ko = (t, e) => t << e | t >>> 32 - e;
function sd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Lo = new Uint32Array(16);
let Rx = class extends au {
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
    for (let h = 0; h < 16; h++, n += 4)
      Lo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, m = jx[h], L = zx[h], b = lu[h], T = uu[h], w = Dx[h], B = Fx[h];
      for (let C = 0; C < 16; C++) {
        const D = ko(r + sd(h, i, a, f) + Lo[b[C]] + m, w[C]) + l | 0;
        r = l, l = f, f = ko(a, 10) | 0, a = i, i = D;
      }
      for (let C = 0; C < 16; C++) {
        const D = ko(s + sd(x, o, c, d) + Lo[T[C]] + L, B[C]) + g | 0;
        s = g, g = d, d = ko(c, 10) | 0, c = o, o = D;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Lo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Gx = Is(() => new Rx()), Co = BigInt(2 ** 32 - 1), sl = BigInt(32);
function Ip(t, e = !1) {
  return e ? { h: Number(t & Co), l: Number(t >> sl & Co) } : { h: Number(t >> sl & Co) | 0, l: Number(t & Co) | 0 };
}
function Kx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Ip(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Vx = (t, e) => BigInt(t >>> 0) << sl | BigInt(e >>> 0), Wx = (t, e, n) => t >>> n, Xx = (t, e, n) => t << 32 - n | e >>> n, qx = (t, e, n) => t >>> n | e << 32 - n, Yx = (t, e, n) => t << 32 - n | e >>> n, Zx = (t, e, n) => t << 64 - n | e >>> n - 32, Qx = (t, e, n) => t >>> n - 32 | e << 64 - n, Jx = (t, e) => e, tS = (t, e) => t, eS = (t, e, n) => t << n | e >>> 32 - n, nS = (t, e, n) => e << n | t >>> 32 - n, rS = (t, e, n) => e << n - 32 | t >>> 64 - n, sS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function iS(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const oS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), aS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, cS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), lS = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, uS = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), fS = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, mt = {
  fromBig: Ip,
  split: Kx,
  toBig: Vx,
  shrSH: Wx,
  shrSL: Xx,
  rotrSH: qx,
  rotrSL: Yx,
  rotrBH: Zx,
  rotrBL: Qx,
  rotr32H: Jx,
  rotr32L: tS,
  rotlSH: eS,
  rotlSL: nS,
  rotlBH: rS,
  rotlBL: sS,
  add: iS,
  add3L: oS,
  add3H: aS,
  add4L: cS,
  add4H: lS,
  add5H: fS,
  add5L: uS
}, [dS, hS] = mt.split([
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
].map((t) => BigInt(t))), hr = new Uint32Array(80), pr = new Uint32Array(80);
let Da = class extends au {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: x, Hh: m, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, x, m, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, x, m, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = m | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let w = 0; w < 16; w++, n += 4)
      hr[w] = e.getUint32(n), pr[w] = e.getUint32(n += 4);
    for (let w = 16; w < 80; w++) {
      const B = hr[w - 15] | 0, C = pr[w - 15] | 0, D = mt.rotrSH(B, C, 1) ^ mt.rotrSH(B, C, 8) ^ mt.shrSH(B, C, 7), q = mt.rotrSL(B, C, 1) ^ mt.rotrSL(B, C, 8) ^ mt.shrSL(B, C, 7), O = hr[w - 2] | 0, W = pr[w - 2] | 0, S = mt.rotrSH(O, W, 19) ^ mt.rotrBH(O, W, 61) ^ mt.shrSH(O, W, 6), $ = mt.rotrSL(O, W, 19) ^ mt.rotrBL(O, W, 61) ^ mt.shrSL(O, W, 6), H = mt.add4L(q, $, pr[w - 7], pr[w - 16]), Y = mt.add4H(H, D, S, hr[w - 7], hr[w - 16]);
      hr[w] = Y | 0, pr[w] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: x, Gh: m, Gl: L, Hh: b, Hl: T } = this;
    for (let w = 0; w < 80; w++) {
      const B = mt.rotrSH(l, g, 14) ^ mt.rotrSH(l, g, 18) ^ mt.rotrBH(l, g, 41), C = mt.rotrSL(l, g, 14) ^ mt.rotrSL(l, g, 18) ^ mt.rotrBL(l, g, 41), D = l & h ^ ~l & m, q = g & x ^ ~g & L, O = mt.add5L(T, C, q, hS[w], pr[w]), W = mt.add5H(O, b, B, D, dS[w], hr[w]), S = O | 0, $ = mt.rotrSH(r, s, 28) ^ mt.rotrBH(r, s, 34) ^ mt.rotrBH(r, s, 39), H = mt.rotrSL(r, s, 28) ^ mt.rotrBL(r, s, 34) ^ mt.rotrBL(r, s, 39), Y = r & i ^ r & a ^ i & a, et = s & o ^ s & c ^ o & c;
      b = m | 0, T = L | 0, m = h | 0, L = x | 0, h = l | 0, x = g | 0, { h: l, l: g } = mt.add(f | 0, d | 0, W | 0, S | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const X = mt.add3L(S, H, et);
      r = mt.add3H(X, W, $, Y), s = X | 0;
    }
    ({ h: r, l: s } = mt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = mt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = mt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = mt.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = mt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: x } = mt.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: m, l: L } = mt.add(this.Gh | 0, this.Gl | 0, m | 0, L | 0), { h: b, l: T } = mt.add(this.Hh | 0, this.Hl | 0, b | 0, T | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, x, m, L, b, T);
  }
  roundClean() {
    hr.fill(0), pr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, pS = class extends Da {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, gS = class extends Da {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, yS = class extends Da {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Is(() => new Da());
Is(() => new pS());
const wS = Is(() => new gS());
Is(() => new yS());
var It;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(It || (It = {}));
var fe;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(fe || (fe = {}));
function fu(t) {
  return fe[t];
}
const bS = () => ({ type: It.BoolTrue }), mS = () => ({ type: It.BoolFalse }), xS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: It.Buffer, value: it(t) };
}, id = BigInt("0xffffffffffffffffffffffffffffffff"), SS = BigInt(0), od = BigInt("0x7fffffffffffffffffffffffffffffff"), ad = BigInt("-170141183460469231731687303715884105728"), ES = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = Pc(Bt(t))), He(t, Uint8Array) && (t = Pc(t));
  const e = Ee(t);
  if (e > od)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${od}`);
  if (e < ad)
    throw new RangeError(`Cannot construct clarity integer form value less than ${ad}`);
  return { type: It.Int, value: e };
}, AS = (t) => {
  const e = Ee(t);
  if (e < SS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > id)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${id}`);
  return { type: It.UInt, value: e };
};
function $S(t) {
  return { type: It.List, value: t };
}
function kp() {
  return { type: It.OptionalNone };
}
function Lp(t) {
  return { type: It.OptionalSome, value: t };
}
var V;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(V || (V = {}));
function vS() {
  return {
    type: V.Address,
    version: hs.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function cd(t) {
  if (t && Hp(t, fa))
    throw new Error(`Memo exceeds maximum length of ${fa} bytes`);
  return { type: V.MemoString, content: t };
}
function du(t, e) {
  return {
    type: V.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function il(t) {
  if (Bt(t).byteLength != Ha)
    throw Error("Invalid signature");
  return {
    type: V.MessageSignature,
    data: t
  };
}
function IS(t, e, n) {
  return typeof t == "string" && (t = zS(t)), typeof n == "string" && (n = cd(n)), {
    type: V.Payload,
    payloadType: Ht.TokenTransfer,
    recipient: t,
    amount: Ee(e),
    memo: n ?? cd("")
  };
}
function kS(t, e, n, r) {
  return typeof e == "string" && (e = hn(e)), typeof n == "string" && (n = hn(n)), {
    type: V.Payload,
    payloadType: Ht.ContractCall,
    contractAddress: typeof t == "string" ? Ur(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function LS(t) {
  return hn(t, 4, 1e5);
}
function ld(t, e, n) {
  return typeof t == "string" && (t = hn(t)), typeof e == "string" && (e = LS(e)), typeof n == "number" ? {
    type: V.Payload,
    payloadType: Ht.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: V.Payload,
    payloadType: Ht.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function CS() {
  return { type: V.Payload, payloadType: Ht.PoisonMicroblock };
}
function ud(t, e) {
  if (t.byteLength != Jr)
    throw Error(`Coinbase buffer size must be ${Jr} bytes`);
  return e != null ? {
    type: V.Payload,
    payloadType: Ht.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: V.Payload,
    payloadType: Ht.Coinbase,
    coinbaseBytes: t
  };
}
function BS(t, e, n) {
  if (t.byteLength != Jr)
    throw Error(`Coinbase buffer size must be ${Jr} bytes`);
  if (n.byteLength != Qc)
    throw Error(`VRF proof buffer size must be ${Qc} bytes`);
  return {
    type: V.Payload,
    payloadType: Ht.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === It.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function TS(t, e, n, r, s, i, o) {
  return {
    type: V.Payload,
    payloadType: Ht.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function hn(t, e, n) {
  const r = e || 1, s = n || px;
  if (Hp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: V.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function MS(t, e, n) {
  return {
    type: V.Asset,
    address: Ur(t),
    contractName: hn(e),
    assetName: hn(n)
  };
}
function Ur(t) {
  const e = vs.c32addressDecode(t);
  return {
    type: V.Address,
    version: e[0],
    hash160: e[1]
  };
}
function _S(t, e) {
  const n = Ur(t), r = hn(e);
  return {
    type: V.Principal,
    prefix: Ie.Contract,
    address: n,
    contractName: r
  };
}
function NS(t) {
  const e = Ur(t);
  return {
    type: V.Principal,
    prefix: Ie.Standard,
    address: e
  };
}
function Vs(t, e) {
  return {
    pubKeyEncoding: t,
    type: V.TransactionAuthField,
    contents: e
  };
}
function Dn(t) {
  switch (t.type) {
    case V.Address:
      return ro(t);
    case V.Principal:
      return Cp(t);
    case V.LengthPrefixedString:
      return ui(t);
    case V.MemoString:
      return PS(t);
    case V.Asset:
      return Tp(t);
    case V.PostCondition:
      return _p(t);
    case V.PublicKey:
      return cl(t);
    case V.LengthPrefixedList:
      return hu(t);
    case V.Payload:
      return Np(t);
    case V.TransactionAuthField:
      return jS(t);
    case V.MessageSignature:
      return pu(t);
  }
}
function ro(t) {
  const e = [];
  return e.push(Bt(Zi(t.version, 1))), e.push(Bt(t.hash160)), ie(e);
}
function li(t) {
  const e = He(t, Gt) ? t : new Gt(t), n = $a(it(e.readBytes(1))), r = it(e.readBytes(20));
  return { type: V.Address, version: n, hash160: r };
}
function Cp(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === Ie.Standard || t.prefix === Ie.Contract) && e.push(ro(t.address)), t.prefix === Ie.Contract && e.push(ui(t.contractName)), ie(e);
}
function US(t) {
  const e = He(t, Gt) ? t : new Gt(t), n = e.readUInt8Enum(Ie, (i) => {
    throw new $e(`Unexpected Principal payload type: ${i}`);
  });
  if (n === Ie.Origin)
    return { type: V.Principal, prefix: n };
  const r = li(e);
  if (n === Ie.Standard)
    return { type: V.Principal, prefix: n, address: r };
  const s = en(e);
  return {
    type: V.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function ui(t) {
  const e = [], n = Ss(t.content), r = n.byteLength;
  return e.push(Bt(Zi(r, t.lengthPrefixBytes))), e.push(n), ie(e);
}
function en(t, e, n) {
  e = e || 1;
  const r = He(t, Gt) ? t : new Gt(t), s = $a(it(r.readBytes(e))), i = Qi(r.readBytes(s));
  return hn(i, e, n ?? 128);
}
function PS(t) {
  const e = [], n = Ss(t.content), r = u3(it(n), fa * 2);
  return e.push(Bt(r)), ie(e);
}
function Bp(t) {
  const e = He(t, Gt) ? t : new Gt(t);
  let n = Qi(e.readBytes(fa));
  return n = n.replace(/\u0000*$/, ""), { type: V.MemoString, content: n };
}
function Tp(t) {
  const e = [];
  return e.push(ro(t.address)), e.push(ui(t.contractName)), e.push(ui(t.assetName)), ie(e);
}
function ol(t) {
  const e = He(t, Gt) ? t : new Gt(t);
  return {
    type: V.Asset,
    address: li(e),
    contractName: en(e),
    assetName: en(e)
  };
}
function hu(t) {
  const e = t.values, n = [];
  n.push(Bt(Zi(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Dn(r));
  return ie(n);
}
function Mp(t, e, n) {
  const r = He(t, Gt) ? t : new Gt(t), s = $a(it(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case V.Address:
        i.push(li(r));
        break;
      case V.LengthPrefixedString:
        i.push(en(r));
        break;
      case V.MemoString:
        i.push(Bp(r));
        break;
      case V.Asset:
        i.push(ol(r));
        break;
      case V.PostCondition:
        i.push(OS(r));
        break;
      case V.PublicKey:
        i.push(ll(r));
        break;
      case V.TransactionAuthField:
        i.push(FS(r));
        break;
    }
  return du(i, n);
}
function HS(t) {
  return it(_p(t));
}
function _p(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Cp(t.principal)), (t.conditionType === Xt.Fungible || t.conditionType === Xt.NonFungible) && e.push(Tp(t.asset)), t.conditionType === Xt.NonFungible && e.push(In(t.assetName)), e.push(t.conditionCode), t.conditionType === Xt.STX || t.conditionType === Xt.Fungible || t.conditionType === Xt.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ks("The post-condition amount may not be larger than 8 bytes");
    e.push(Tr(t.amount, 8));
  }
  return ie(e);
}
function OS(t) {
  const e = He(t, Gt) ? t : new Gt(t), n = e.readUInt8Enum(Xt, (a) => {
    throw new $e(`Could not read ${a} as PostConditionType`);
  }), r = US(e);
  let s, i, o;
  switch (n) {
    case Xt.STX:
      return s = e.readUInt8Enum(Pi, (c) => {
        throw new $e(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${it(e.readBytes(8))}`), {
        type: V.PostCondition,
        conditionType: Xt.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Xt.Fungible:
      return i = ol(e), s = e.readUInt8Enum(Pi, (c) => {
        throw new $e(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${it(e.readBytes(8))}`), {
        type: V.PostCondition,
        conditionType: Xt.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case Xt.NonFungible:
      i = ol(e);
      const a = $n(e);
      return s = e.readUInt8Enum(tl, (c) => {
        throw new $e(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: V.PostCondition,
        conditionType: Xt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case Xt.Staking:
      return s = e.readUInt8Enum(Pi, (c) => {
        throw new $e(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${it(e.readBytes(8))}`), {
        type: V.PostCondition,
        conditionType: Xt.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Xt.PoX: {
      const c = e.readUInt8Enum(el, (f) => {
        throw new $e(`Could not read ${f} as PoxConditionCode`);
      });
      return {
        type: V.PostCondition,
        conditionType: Xt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function Np(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Ht.TokenTransfer:
      e.push(In(t.recipient)), e.push(Tr(t.amount, 8)), e.push(Dn(t.memo));
      break;
    case Ht.ContractCall:
      e.push(Dn(t.contractAddress)), e.push(Dn(t.contractName)), e.push(Dn(t.functionName));
      const n = new Uint8Array(4);
      rs(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(In(r));
      });
      break;
    case Ht.SmartContract:
      e.push(Dn(t.contractName)), e.push(Dn(t.codeBody));
      break;
    case Ht.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Dn(t.contractName)), e.push(Dn(t.codeBody));
      break;
    case Ht.PoisonMicroblock:
      break;
    case Ht.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Ht.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(In(t.recipient));
      break;
    case Ht.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(In(t.recipient ? Lp(t.recipient) : kp())), e.push(t.vrfProof);
      break;
    case Ht.TenureChange:
      e.push(Bt(t.tenureHash)), e.push(Bt(t.previousTenureHash)), e.push(Bt(t.burnViewHash)), e.push(Bt(t.previousTenureEnd)), e.push(rs(new Uint8Array(4), t.previousTenureBlocks)), e.push(Uw(new Uint8Array(1), t.cause)), e.push(Bt(t.publicKeyHash));
      break;
  }
  return ie(e);
}
function DS(t) {
  const e = He(t, Gt) ? t : new Gt(t);
  switch (e.readUInt8Enum(Ht, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Ht.TokenTransfer:
      const r = $n(e), s = Ee(e.readBytes(8)), i = Bp(e);
      return IS(r, s, i);
    case Ht.ContractCall:
      const o = li(e), a = en(e), c = en(e), f = [], d = e.readUInt32BE();
      for (let B = 0; B < d; B++) {
        const C = $n(e);
        f.push(C);
      }
      return kS(o, a, c, f);
    case Ht.SmartContract:
      const l = en(e), g = en(e, 4, 1e5);
      return ld(l, g);
    case Ht.VersionedSmartContract: {
      const B = e.readUInt8Enum(Jc, (q) => {
        throw new Error(`Cannot recognize ClarityVersion: ${q}`);
      }), C = en(e), D = en(e, 4, vx);
      return ld(C, D, B);
    }
    case Ht.PoisonMicroblock:
      return CS();
    case Ht.Coinbase: {
      const B = e.readBytes(Jr);
      return ud(B);
    }
    case Ht.CoinbaseToAltRecipient: {
      const B = e.readBytes(Jr), C = $n(e);
      return ud(B, C);
    }
    case Ht.NakamotoCoinbase: {
      const B = e.readBytes(Jr), C = $n(e), D = e.readBytes(Qc);
      return BS(B, C, D);
    }
    case Ht.TenureChange:
      const h = it(e.readBytes(20)), x = it(e.readBytes(20)), m = it(e.readBytes(20)), L = it(e.readBytes(32)), b = e.readUInt32BE(), T = e.readUInt8Enum(nl, (B) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${B}`);
      }), w = it(e.readBytes(20));
      return TS(h, x, m, L, b, T, w);
  }
}
function al(t) {
  const e = He(t, Gt) ? t : new Gt(t);
  return il(it(e.readBytes(Ha)));
}
function FS(t) {
  const e = He(t, Gt) ? t : new Gt(t), n = e.readUInt8Enum(un, (r) => {
    throw new $e(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case un.PublicKeyCompressed:
      return Vs(Qt.Compressed, ll(e));
    case un.PublicKeyUncompressed:
      return Vs(Qt.Uncompressed, bi(S3(ll(e).data)));
    case un.SignatureCompressed:
      return Vs(Qt.Compressed, al(e));
    case un.SignatureUncompressed:
      return Vs(Qt.Uncompressed, al(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function pu(t) {
  return Bt(t.data);
}
function jS(t) {
  const e = [];
  switch (t.contents.type) {
    case V.PublicKey:
      e.push(t.pubKeyEncoding === Qt.Compressed ? un.PublicKeyCompressed : un.PublicKeyUncompressed), e.push(Bt(x3(t.contents.data)));
      break;
    case V.MessageSignature:
      e.push(t.pubKeyEncoding === Qt.Compressed ? un.SignatureCompressed : un.SignatureUncompressed), e.push(pu(t.contents));
      break;
  }
  return ie(e);
}
function cl(t) {
  return t.data.slice();
}
function ll(t) {
  const e = He(t, Gt) ? t : new Gt(t), n = e.readUInt8(), r = n === 4 ? wx : yx;
  return bi(ie([n, e.readBytes(r)]));
}
function gu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === jt.P2PKH || e === jt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === jt.P2WPKH || e === jt.P2WSH || e === jt.P2WSHNonSequential) && !r.map((s) => s.data).every(mi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case jt.P2PKH:
      return Bo(t, f3(r[0].data));
    case jt.P2WPKH:
      return Bo(t, d3(r[0].data));
    case jt.P2SH:
    case jt.P2SHNonSequential:
      return Bo(t, h3(n, r.map(cl)));
    case jt.P2WSH:
    case jt.P2WSHNonSequential:
      return Bo(t, p3(n, r.map(cl)));
  }
}
function Bo(t, e) {
  return { type: V.Address, version: t, hash160: e };
}
function yu(t) {
  return vs.c32address(t.version, t.hash160);
}
function fd(t) {
  const [e, n, r] = t.split(/\.|::/);
  return MS(e, n, r);
}
function Li(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return _S(e, n);
  } else
    return NS(t);
}
function zS(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return KS(e, n);
  } else
    return RS(t);
}
function RS(t) {
  const e = Ur(t);
  return { type: It.PrincipalStandard, value: yu(e) };
}
function GS(t) {
  return { type: It.PrincipalStandard, value: yu(t) };
}
function KS(t, e) {
  const n = Ur(t), r = hn(e);
  return Up(n, r);
}
function Up(t, e) {
  if (Ss(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: It.PrincipalContract,
    value: `${yu(t)}.${e.content}`
  };
}
function VS(t) {
  return { type: It.ResponseErr, value: t };
}
function WS(t) {
  return { type: It.ResponseOk, value: t };
}
const XS = (t) => ({ type: It.StringASCII, value: t }), qS = (t) => ({ type: It.StringUTF8, value: t });
function YS(t) {
  for (const e in t)
    if (!g3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: It.Tuple, value: t };
}
function $n(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Gt(Bt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Gt(t) : e = t;
  switch (e.readUInt8Enum(fe, (r) => {
    throw new $e(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case fe.int:
      return ES(Pc(e.readBytes(16)));
    case fe.uint:
      return AS(e.readBytes(16));
    case fe.buffer:
      const r = e.readUInt32BE();
      return xS(e.readBytes(r));
    case fe.true:
      return bS();
    case fe.false:
      return mS();
    case fe.address:
      const s = li(e);
      return GS(s);
    case fe.contract:
      const i = li(e), o = en(e);
      return Up(i, o);
    case fe.ok:
      return WS($n(e));
    case fe.err:
      return VS($n(e));
    case fe.none:
      return kp();
    case fe.some:
      return Lp($n(e));
    case fe.list:
      const a = e.readUInt32BE(), c = [];
      for (let m = 0; m < a; m++)
        c.push($n(e));
      return $S(c);
    case fe.tuple:
      const f = e.readUInt32BE(), d = {};
      for (let m = 0; m < f; m++) {
        const L = en(e).content;
        if (L === void 0)
          throw new $e('"content" is undefined');
        d[L] = $n(e);
      }
      return YS(d);
    case fe.ascii:
      const l = e.readUInt32BE(), g = kw(e.readBytes(l));
      return XS(g);
    case fe.utf8:
      const h = e.readUInt32BE(), x = Qi(e.readBytes(h));
      return qS(x);
    default:
      throw new $e("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Tn(t, e) {
  return ie([fu(t), e]);
}
function ZS(t) {
  return new Uint8Array([fu(t.type)]);
}
function QS(t) {
  return t.type === It.OptionalNone ? new Uint8Array([fu(t.type)]) : Tn(t.type, In(t.value));
}
function JS(t) {
  const e = new Uint8Array(4);
  return rs(e, Math.ceil(t.value.length / 2), 0), Tn(t.type, Cn(e, Bt(t.value)));
}
function t3(t) {
  const e = Fl(Ew(BigInt(t.value), BigInt(gx)), bp);
  return Tn(t.type, e);
}
function e3(t) {
  const e = Fl(BigInt(t.value), bp);
  return Tn(t.type, e);
}
function n3(t) {
  return Tn(t.type, ro(Ur(t.value)));
}
function r3(t) {
  const [e, n] = y3(t.value);
  return Tn(t.type, Cn(ro(Ur(e)), ui(hn(n))));
}
function s3(t) {
  return Tn(t.type, In(t.value));
}
function i3(t) {
  const e = [], n = new Uint8Array(4);
  rs(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = In(r);
    e.push(s);
  }
  return Tn(t.type, ie(e));
}
function o3(t) {
  const e = [], n = new Uint8Array(4);
  rs(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = hn(s);
    e.push(ui(i));
    const o = In(t.value[s]);
    e.push(o);
  }
  return Tn(t.type, ie(e));
}
function Pp(t, e) {
  const n = [], r = e == "ascii" ? Iw(t.value) : Ss(t.value), s = new Uint8Array(4);
  return rs(s, r.length, 0), n.push(s), n.push(r), Tn(t.type, ie(n));
}
function a3(t) {
  return Pp(t, "ascii");
}
function c3(t) {
  return Pp(t, "utf8");
}
function dd(t) {
  return it(In(t));
}
function In(t) {
  switch (t.type) {
    case It.BoolTrue:
    case It.BoolFalse:
      return ZS(t);
    case It.OptionalNone:
    case It.OptionalSome:
      return QS(t);
    case It.Buffer:
      return JS(t);
    case It.UInt:
      return e3(t);
    case It.Int:
      return t3(t);
    case It.PrincipalStandard:
      return n3(t);
    case It.PrincipalContract:
      return r3(t);
    case It.ResponseOk:
    case It.ResponseErr:
      return s3(t);
    case It.List:
      return i3(t);
    case It.Tuple:
      return o3(t);
    case It.StringASCII:
      return a3(t);
    case It.StringUTF8:
      return c3(t);
    default:
      throw new Ks("Unable to serialize. Invalid Clarity Value.");
  }
}
const l3 = (t) => t.length % 2 ? `0${t}` : t, u3 = (t, e) => t.padEnd(e, "0"), Hp = (t, e) => t ? Ss(t).length > e : !1;
function ul(t) {
  return pp(t);
}
const ji = (t) => Gx(cu(t)), wu = (t) => it(wS(t)), f3 = (t) => it(ji(t)), d3 = (t) => {
  const e = ji(t), n = Cn(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ji(n);
  return it(r);
}, h3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = ie(n), s = ji(r);
  return it(s);
}, p3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = ie(n), s = cu(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = ie(i), a = ji(o);
  return it(a);
};
function g3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function y3(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
re.hmacSha256Sync = (t, ...e) => {
  const n = Ep.create(cu, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function bi(t) {
  return t = typeof t == "string" ? Bt(t) : t, {
    type: V.PublicKey,
    data: t
  };
}
function w3(t, e, n = Qt.Compressed) {
  const r = Tw(e), s = new Ke(df(r.r), df(r.s)), i = At.fromSignature(t, s, r.recoveryId), o = n === Qt.Compressed;
  return i.toHex(o);
}
function b3(t) {
  return typeof t == "string" ? t : it(t);
}
const bu = b3;
function Op(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Bw;
}
function mi(t) {
  return !bu(t).startsWith("04");
}
function m3(t) {
  t = jl(t);
  const e = Op(t);
  return it(Ji(t.slice(0, 32), e));
}
function x3(t) {
  return At.fromHex(bu(t)).toHex(!0);
}
function S3(t) {
  return At.fromHex(bu(t)).toHex(!1);
}
function E3(t, e) {
  t = jl(t);
  const [n, r] = Ia(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Zi(r, 1) + Ke.fromHex(n).toCompactHex();
}
function mu() {
  return {
    type: V.MessageSignature,
    data: it(new Uint8Array(Ha))
  };
}
function Dp(t, e, n, r) {
  const s = gu(0, t, 1, [bi(e)]).hash160, i = mi(e) ? Qt.Compressed : Qt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Ee(n),
    fee: Ee(r),
    keyEncoding: i,
    signature: mu()
  };
}
function zi(t) {
  return "signature" in t;
}
function hd(t) {
  return t === jt.P2SH || t === jt.P2WSH;
}
function A3(t) {
  return t === jt.P2SHNonSequential || t === jt.P2WSHNonSequential;
}
function pd(t) {
  const e = ul(t);
  return e.nonce = 0, e.fee = 0, zi(e) ? e.signature = mu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function $3(t) {
  const e = [
    t.hashMode,
    Bt(t.signer),
    Tr(t.nonce, 8),
    Tr(t.fee, 8),
    t.keyEncoding,
    pu(t.signature)
  ];
  return ie(e);
}
function v3(t) {
  const e = [
    t.hashMode,
    Bt(t.signer),
    Tr(t.nonce, 8),
    Tr(t.fee, 8)
  ], n = du(t.fields);
  e.push(hu(n));
  const r = new Uint8Array(2);
  return _w(r, t.signaturesRequired, 0), e.push(r), ie(e);
}
function I3(t, e) {
  const n = it(e.readBytes(20)), r = BigInt(`0x${it(e.readBytes(8))}`), s = BigInt(`0x${it(e.readBytes(8))}`), i = e.readUInt8Enum(Qt, (a) => {
    throw new $e(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === jt.P2WPKH && i != Qt.Compressed)
    throw new $e("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = al(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function k3(t, e) {
  const n = it(e.readBytes(20)), r = BigInt("0x" + it(e.readBytes(8))), s = BigInt("0x" + it(e.readBytes(8))), i = Mp(e, V.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const f of i)
    switch (f.contents.type) {
      case V.PublicKey:
        mi(f.contents.data) || (o = !0);
        break;
      case V.MessageSignature:
        if (f.pubKeyEncoding === Qt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Xr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === jt.P2WSH || t === jt.P2WSHNonSequential))
    throw new Xr("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function gc(t) {
  return zi(t) ? $3(t) : v3(t);
}
function yc(t) {
  const e = t.readUInt8Enum(jt, (n) => {
    throw new $e(`Could not parse ${n} as AddressHashMode`);
  });
  return e === jt.P2PKH || e === jt.P2WPKH ? I3(e, t) : k3(e, t);
}
function Fp(t, e, n, r) {
  const i = t + it(new Uint8Array([e])) + it(Tr(n, 8)) + it(Tr(r, 8));
  if (Bt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return wu(Bt(i));
}
function jp(t, e, n) {
  const r = 33 + Ha, s = mi(e.data) ? Qt.Compressed : Qt.Uncompressed, i = t + l3(s.toString(16)) + n, o = Bt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return wu(o);
}
function L3(t, e, n, r, s) {
  const i = Fp(t, e, n, r), o = E3(s, i), a = bi(m3(s)), c = jp(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function zp(t, e, n, r, s, i) {
  const o = Fp(t, e, n, r), a = bi(w3(o, i, s)), c = jp(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function C3() {
  const t = Dp(jt.P2PKH, "", 0, 0);
  return t.signer = vS().hash160, t.keyEncoding = Qt.Compressed, t.signature = mu(), t;
}
function gd(t, e, n) {
  return zi(t) ? B3(t, e, n) : T3(t, e, n);
}
function B3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = zp(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = gu(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Xr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function T3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case V.PublicKey:
        mi(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case V.MessageSignature:
        c.pubKeyEncoding === Qt.Uncompressed && (i = !0);
        const { pubKey: f, nextSigHash: d } = zp(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (hd(t.hashMode) && (s = d), r.push(f), o += 1, o === 65536)
          throw new Xr("Too many signatures");
        break;
    }
  if (hd(t.hashMode) && o !== t.signaturesRequired || A3(t.hashMode) && o < t.signaturesRequired)
    throw new Xr("Incorrect number of signatures");
  if (i && (t.hashMode === jt.P2WSH || t.hashMode === jt.P2WSHNonSequential))
    throw new Xr("Uncompressed keys are not allowed in this hash mode");
  const a = gu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Xr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Rp(t) {
  return {
    authType: ee.Standard,
    spendingCondition: t
  };
}
function Gp(t, e) {
  return {
    authType: ee.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Dp(jt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function yd(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case ee.Standard:
        return Rp(pd(t.spendingCondition));
      case ee.Sponsored:
        return Gp(pd(t.spendingCondition), C3());
      default:
        throw new ha("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function M3(t, e) {
  switch (t.authType) {
    case ee.Standard:
      return gd(t.spendingCondition, e, ee.Standard);
    case ee.Sponsored:
      return gd(t.spendingCondition, e, ee.Standard);
    default:
      throw new ha("Invalid origin auth type");
  }
}
function _3(t, e) {
  switch (t.authType) {
    case ee.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Ee(e)
      };
      return { ...t, spendingCondition: n };
    case ee.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Ee(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function N3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Ee(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function U3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Ee(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function P3(t, e) {
  const n = {
    ...e,
    nonce: Ee(e.nonce),
    fee: Ee(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function H3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case ee.Standard:
      e.push(gc(t.spendingCondition));
      break;
    case ee.Sponsored:
      e.push(gc(t.spendingCondition)), e.push(gc(t.sponsorSpendingCondition));
      break;
  }
  return ie(e);
}
function O3(t) {
  const e = t.readUInt8Enum(ee, (r) => {
    throw new $e(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case ee.Standard:
      return n = yc(t), Rp(n);
    case ee.Sponsored:
      n = yc(t);
      const r = yc(t);
      return Gp(n, r);
  }
}
class D3 {
  constructor({ auth: e, payload: n, postConditions: r = du([]), postConditionMode: s = da.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = dx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Ee(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = je.Any;
  }
  signBegin() {
    const e = ul(this);
    return e.auth = yd(e.auth), e.txid();
  }
  verifyBegin() {
    const e = ul(this);
    return e.auth = yd(e.auth), e.txid();
  }
  verifyOrigin() {
    return M3(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, ee.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === ee.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, ee.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : bi(e), r = this.auth.spendingCondition;
    if (r && !zi(r)) {
      const s = mi(n.data);
      r.fields.push(Vs(s ? Qt.Compressed : Qt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = L3(n, r, e.fee, e.nonce, s);
    if (zi(e))
      e.signature = il(i);
    else {
      const a = Op(s);
      e.fields.push(Vs(a ? Qt.Compressed : Qt.Uncompressed, il(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return wu(e);
  }
  setSponsor(e) {
    if (this.auth.authType != ee.Sponsored)
      throw new ha("Cannot sponsor sign a non-sponsored transaction");
    this.auth = P3(this.auth, e);
  }
  setFee(e) {
    this.auth = _3(this.auth, e);
  }
  setNonce(e) {
    this.auth = N3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != ee.Sponsored)
      throw new ha("Cannot sponsor sign a non-sponsored transaction");
    this.auth = U3(this.auth, e);
  }
  serialize() {
    return it(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Ks('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Ks('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ks('"auth" is undefined');
    if (this.payload === void 0)
      throw new Ks('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return rs(n, this.chainId, 0), e.push(n), e.push(H3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(hu(this.postConditions)), e.push(Np(this.payload)), ie(e);
  }
}
function F3(t) {
  const e = He(t, Gt) ? t : new Gt(t), n = e.readUInt8Enum(ds, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = O3(e), i = e.readUInt8Enum(je, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(da, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = Mp(e, V.PostCondition), c = DS(e), f = new D3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return f.anchorMode = i, f;
}
const wd = BigInt("18446744073709551615");
function wc(t) {
  const e = Ee(t);
  if (e < 0n || e > wd)
    throw new RangeError(`Post-condition amount must be between 0 and ${wd} (u64 max), received: ${e}`);
  return e;
}
var fl;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(fl || (fl = {}));
var dl;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(dl || (dl = {}));
function j3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: V.PostCondition,
        conditionType: Xt.STX,
        principal: t.address === "origin" ? { type: V.Principal, prefix: Ie.Origin } : Li(t.address),
        conditionCode: To(t.condition),
        amount: wc(t.amount)
      };
    case "ft-postcondition":
      return {
        type: V.PostCondition,
        conditionType: Xt.Fungible,
        principal: t.address === "origin" ? { type: V.Principal, prefix: Ie.Origin } : Li(t.address),
        conditionCode: To(t.condition),
        amount: wc(t.amount),
        asset: fd(t.asset)
      };
    case "nft-postcondition":
      return {
        type: V.PostCondition,
        conditionType: Xt.NonFungible,
        principal: t.address === "origin" ? { type: V.Principal, prefix: Ie.Origin } : Li(t.address),
        conditionCode: To(t.condition),
        asset: fd(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: V.PostCondition,
        conditionType: Xt.Staking,
        principal: t.address === "origin" ? { type: V.Principal, prefix: Ie.Origin } : Li(t.address),
        conditionCode: To(t.condition),
        amount: wc(t.amount)
      };
    case "pox-postcondition":
      return {
        type: V.PostCondition,
        conditionType: Xt.PoX,
        principal: t.address === "origin" ? { type: V.Principal, prefix: Ie.Origin } : Li(t.address),
        conditionCode: z3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function To(t) {
  return fl[t];
}
function z3(t) {
  return dl[t];
}
function Kp(t) {
  const e = j3(t);
  return HS(e);
}
function R3(t, e, n) {
  return Su(Vp(t), n);
}
function Vp(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Ri(r);
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
    return BigInt(`0x${V3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function xu(t, e = 8) {
  return (typeof t == "bigint" ? t : Vp(t)).toString(16).padStart(e * 2, "0");
}
function Su(t, e = 16) {
  const n = xu(t, e);
  return Ri(n);
}
function G3(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const K3 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function V3(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += K3[n];
  return e;
}
function Ri(t) {
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
function Eu(t) {
  return new TextEncoder().encode(t);
}
function W3(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function X3(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function bd(t) {
  if (t.some(X3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Au(...t) {
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
function Wn(t) {
  return Au(...t.map((e) => typeof e == "number" ? bd([e]) : e instanceof Array ? bd(e) : e));
}
function Fa(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var hl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(hl || (hl = {}));
hl.Mainnet;
const q3 = 128, Y3 = 128, Wp = 16;
var pl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(pl || (pl = {}));
var md;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(md || (md = {}));
var xd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(xd || (xd = {}));
var ln;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(ln || (ln = {}));
const bc = ["onChainOnly", "offChainOnly", "any"];
bc[0] + "", ln.OnChainOnly, bc[1] + "", ln.OffChainOnly, bc[2] + "", ln.Any, ln.OnChainOnly + "", ln.OnChainOnly, ln.OffChainOnly + "", ln.OffChainOnly, ln.Any + "", ln.Any;
var gl;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(gl || (gl = {}));
gl.Mainnet;
var Sd;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Sd || (Sd = {}));
var Gr;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Gr || (Gr = {}));
var Ed;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ed || (Ed = {}));
var Ad;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Ad || (Ad = {}));
var $d;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})($d || ($d = {}));
var vd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(vd || (vd = {}));
var Id;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Id || (Id = {}));
var kd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(kd || (kd = {}));
var yl;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(yl || (yl = {}));
var Ld;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ld || (Ld = {}));
var Cd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Cd || (Cd = {}));
function wl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Z3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Xp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Q3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  wl(t.outputLen), wl(t.blockLen);
}
function J3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function tE(t, e) {
  Xp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const mc = {
  number: wl,
  bool: Z3,
  bytes: Xp,
  hash: Q3,
  exists: J3,
  output: tE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const xc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Sn = (t, e) => t << 32 - e | t >>> e, eE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!eE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function nE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function qp(t) {
  if (typeof t == "string" && (t = nE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let rE = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ks(t) {
  const e = (r) => t().update(qp(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function sE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let $u = class extends rE {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = xc(this.buffer);
  }
  update(e) {
    mc.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = qp(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = xc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    mc.exists(this), mc.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    sE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = xc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
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
const iE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Yp = Uint8Array.from({ length: 16 }, (t, e) => e), oE = Yp.map((t) => (9 * t + 5) % 16);
let vu = [Yp], Iu = [oE];
for (let t = 0; t < 4; t++)
  for (let e of [vu, Iu])
    e.push(e[t].map((n) => iE[n]));
const Zp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), aE = vu.map((t, e) => t.map((n) => Zp[e][n])), cE = Iu.map((t, e) => t.map((n) => Zp[e][n])), lE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), uE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Mo = (t, e) => t << e | t >>> 32 - e;
function Bd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const _o = new Uint32Array(16);
let fE = class extends $u {
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
    for (let h = 0; h < 16; h++, n += 4)
      _o[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, m = lE[h], L = uE[h], b = vu[h], T = Iu[h], w = aE[h], B = cE[h];
      for (let C = 0; C < 16; C++) {
        const D = Mo(r + Bd(h, i, a, f) + _o[b[C]] + m, w[C]) + l | 0;
        r = l, l = f, f = Mo(a, 10) | 0, a = i, i = D;
      }
      for (let C = 0; C < 16; C++) {
        const D = Mo(s + Bd(x, o, c, d) + _o[T[C]] + L, B[C]) + g | 0;
        s = g, g = d, d = Mo(c, 10) | 0, c = o, o = D;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    _o.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
ks(() => new fE());
const dE = (t, e, n) => t & e ^ ~t & n, hE = (t, e, n) => t & e ^ t & n ^ e & n, pE = new Uint32Array([
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
]), gr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), yr = new Uint32Array(64);
let Qp = class extends $u {
  constructor() {
    super(64, 32, 8, !1), this.A = gr[0] | 0, this.B = gr[1] | 0, this.C = gr[2] | 0, this.D = gr[3] | 0, this.E = gr[4] | 0, this.F = gr[5] | 0, this.G = gr[6] | 0, this.H = gr[7] | 0;
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
      yr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = yr[l - 15], h = yr[l - 2], x = Sn(g, 7) ^ Sn(g, 18) ^ g >>> 3, m = Sn(h, 17) ^ Sn(h, 19) ^ h >>> 10;
      yr[l] = m + yr[l - 7] + x + yr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Sn(a, 6) ^ Sn(a, 11) ^ Sn(a, 25), h = d + g + dE(a, c, f) + pE[l] + yr[l] | 0, m = (Sn(r, 2) ^ Sn(r, 13) ^ Sn(r, 22)) + hE(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    yr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, gE = class extends Qp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
ks(() => new Qp());
ks(() => new gE());
const No = BigInt(2 ** 32 - 1), bl = BigInt(32);
function Jp(t, e = !1) {
  return e ? { h: Number(t & No), l: Number(t >> bl & No) } : { h: Number(t >> bl & No) | 0, l: Number(t & No) | 0 };
}
function yE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Jp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const wE = (t, e) => BigInt(t >>> 0) << bl | BigInt(e >>> 0), bE = (t, e, n) => t >>> n, mE = (t, e, n) => t << 32 - n | e >>> n, xE = (t, e, n) => t >>> n | e << 32 - n, SE = (t, e, n) => t << 32 - n | e >>> n, EE = (t, e, n) => t << 64 - n | e >>> n - 32, AE = (t, e, n) => t >>> n - 32 | e << 64 - n, $E = (t, e) => e, vE = (t, e) => t, IE = (t, e, n) => t << n | e >>> 32 - n, kE = (t, e, n) => e << n | t >>> 32 - n, LE = (t, e, n) => e << n - 32 | t >>> 64 - n, CE = (t, e, n) => t << n - 32 | e >>> 64 - n;
function BE(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const TE = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), ME = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, _E = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), NE = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, UE = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), PE = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, xt = {
  fromBig: Jp,
  split: yE,
  toBig: wE,
  shrSH: bE,
  shrSL: mE,
  rotrSH: xE,
  rotrSL: SE,
  rotrBH: EE,
  rotrBL: AE,
  rotr32H: $E,
  rotr32L: vE,
  rotlSH: IE,
  rotlSL: kE,
  rotlBH: LE,
  rotlBL: CE,
  add: BE,
  add3L: TE,
  add3H: ME,
  add4L: _E,
  add4H: NE,
  add5H: PE,
  add5L: UE
}, [HE, OE] = xt.split([
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
].map((t) => BigInt(t))), wr = new Uint32Array(80), br = new Uint32Array(80);
let ja = class extends $u {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: x, Hh: m, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, x, m, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, x, m, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = m | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let w = 0; w < 16; w++, n += 4)
      wr[w] = e.getUint32(n), br[w] = e.getUint32(n += 4);
    for (let w = 16; w < 80; w++) {
      const B = wr[w - 15] | 0, C = br[w - 15] | 0, D = xt.rotrSH(B, C, 1) ^ xt.rotrSH(B, C, 8) ^ xt.shrSH(B, C, 7), q = xt.rotrSL(B, C, 1) ^ xt.rotrSL(B, C, 8) ^ xt.shrSL(B, C, 7), O = wr[w - 2] | 0, W = br[w - 2] | 0, S = xt.rotrSH(O, W, 19) ^ xt.rotrBH(O, W, 61) ^ xt.shrSH(O, W, 6), $ = xt.rotrSL(O, W, 19) ^ xt.rotrBL(O, W, 61) ^ xt.shrSL(O, W, 6), H = xt.add4L(q, $, br[w - 7], br[w - 16]), Y = xt.add4H(H, D, S, wr[w - 7], wr[w - 16]);
      wr[w] = Y | 0, br[w] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: x, Gh: m, Gl: L, Hh: b, Hl: T } = this;
    for (let w = 0; w < 80; w++) {
      const B = xt.rotrSH(l, g, 14) ^ xt.rotrSH(l, g, 18) ^ xt.rotrBH(l, g, 41), C = xt.rotrSL(l, g, 14) ^ xt.rotrSL(l, g, 18) ^ xt.rotrBL(l, g, 41), D = l & h ^ ~l & m, q = g & x ^ ~g & L, O = xt.add5L(T, C, q, OE[w], br[w]), W = xt.add5H(O, b, B, D, HE[w], wr[w]), S = O | 0, $ = xt.rotrSH(r, s, 28) ^ xt.rotrBH(r, s, 34) ^ xt.rotrBH(r, s, 39), H = xt.rotrSL(r, s, 28) ^ xt.rotrBL(r, s, 34) ^ xt.rotrBL(r, s, 39), Y = r & i ^ r & a ^ i & a, et = s & o ^ s & c ^ o & c;
      b = m | 0, T = L | 0, m = h | 0, L = x | 0, h = l | 0, x = g | 0, { h: l, l: g } = xt.add(f | 0, d | 0, W | 0, S | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const X = xt.add3L(S, H, et);
      r = xt.add3H(X, W, $, Y), s = X | 0;
    }
    ({ h: r, l: s } = xt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = xt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = xt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = xt.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = xt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: x } = xt.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: m, l: L } = xt.add(this.Gh | 0, this.Gl | 0, m | 0, L | 0), { h: b, l: T } = xt.add(this.Hh | 0, this.Hl | 0, b | 0, T | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, x, m, L, b, T);
  }
  roundClean() {
    wr.fill(0), br.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, DE = class extends ja {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, FE = class extends ja {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, jE = class extends ja {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ks(() => new ja());
ks(() => new DE());
ks(() => new FE());
ks(() => new jE());
function zE(t, e, n) {
  const s = q3;
  if (s4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: pl.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var pe;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(pe || (pe = {}));
let RE = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, tg = class extends RE {
  constructor(e) {
    super(e);
  }
};
function za(t) {
  const e = [];
  return e.push(Ri(xu(t.version, 1))), e.push(Ri(t.hash160)), Wn(e);
}
function GE(t) {
  const e = [];
  return e.push(t.prefix), e.push(za(t.address)), t.prefix === yl.Contract && e.push(Gi(t.contractName)), Wn(e);
}
function Gi(t) {
  const e = [], n = Eu(t.content), r = n.byteLength;
  return e.push(Ri(xu(r, t.lengthPrefixBytes))), e.push(n), Wn(e);
}
function KE(t) {
  const e = [];
  return e.push(za(t.address)), e.push(Gi(t.contractName)), e.push(Gi(t.assetName)), Wn(e);
}
function eg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(GE(t.principal)), (t.conditionType === Gr.Fungible || t.conditionType === Gr.NonFungible) && e.push(KE(t.assetInfo)), t.conditionType === Gr.NonFungible && e.push(ps(t.assetName)), e.push(t.conditionCode), t.conditionType === Gr.STX || t.conditionType === Gr.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new tg("The post-condition amount may not be larger than 8 bytes");
    e.push(R3(t.amount, !1, 8));
  }
  return Wn(e);
}
function Mn(t, e) {
  return Wn([t, e]);
}
function VE(t) {
  return new Uint8Array([t.type]);
}
function WE(t) {
  return t.type === pe.OptionalNone ? new Uint8Array([t.type]) : Mn(t.type, ps(t.value));
}
function XE(t) {
  const e = new Uint8Array(4);
  return Fa(e, t.buffer.length, 0), Mn(t.type, Au(e, t.buffer));
}
function qE(t) {
  const e = Su(G3(t.value, BigInt(Y3)), Wp);
  return Mn(t.type, e);
}
function YE(t) {
  const e = Su(t.value, Wp);
  return Mn(t.type, e);
}
function ZE(t) {
  return Mn(t.type, za(t.address));
}
function QE(t) {
  return Mn(t.type, Au(za(t.address), Gi(t.contractName)));
}
function JE(t) {
  return Mn(t.type, ps(t.value));
}
function t4(t) {
  const e = [], n = new Uint8Array(4);
  Fa(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = ps(r);
    e.push(s);
  }
  return Mn(t.type, Wn(e));
}
function e4(t) {
  const e = [], n = new Uint8Array(4);
  Fa(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = zE(s);
    e.push(Gi(i));
    const o = ps(t.data[s]);
    e.push(o);
  }
  return Mn(t.type, Wn(e));
}
function ng(t, e) {
  const n = [], r = e == "ascii" ? W3(t.data) : Eu(t.data), s = new Uint8Array(4);
  return Fa(s, r.length, 0), n.push(s), n.push(r), Mn(t.type, Wn(n));
}
function n4(t) {
  return ng(t, "ascii");
}
function r4(t) {
  return ng(t, "utf8");
}
function ps(t) {
  switch (t.type) {
    case pe.BoolTrue:
    case pe.BoolFalse:
      return VE(t);
    case pe.OptionalNone:
    case pe.OptionalSome:
      return WE(t);
    case pe.Buffer:
      return XE(t);
    case pe.UInt:
      return YE(t);
    case pe.Int:
      return qE(t);
    case pe.PrincipalStandard:
      return ZE(t);
    case pe.PrincipalContract:
      return QE(t);
    case pe.ResponseOk:
    case pe.ResponseErr:
      return JE(t);
    case pe.List:
      return t4(t);
    case pe.Tuple:
      return e4(t);
    case pe.StringASCII:
      return n4(t);
    case pe.StringUTF8:
      return r4(t);
    default:
      throw new tg("Unable to serialize. Invalid Clarity Value.");
  }
}
const s4 = (t, e) => t ? Eu(t).length > e : !1, i4 = "connect-ui";
let qo, rg, ze = !1, ml = !1;
const Vn = (t, e = "") => () => {
}, o4 = (t, e) => () => {
}, a4 = "{visibility:hidden}.hydrated{visibility:inherit}", Td = {}, c4 = "http://www.w3.org/2000/svg", l4 = "http://www.w3.org/1999/xhtml", u4 = (t) => t != null, ku = (t) => (t = typeof t, t === "object" || t === "function");
function sg(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const pt = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (f) => {
    for (let d = 0; d < f.length; d++)
      r = f[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !ku(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? xl(null, r) : r), i = s);
  };
  if (a(n), e) {
    const f = e.className || e.class;
    f && (e.class = typeof f != "object" ? f : Object.keys(f).filter((d) => f[d]).join(" "));
  }
  const c = xl(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, xl = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, f4 = {}, d4 = (t) => t && t.$tag$ === f4, h4 = (t, e) => t != null && !ku(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, p4 = (t) => xi(t).$hostElement$, g4 = (t, e, n) => {
  const r = Se.ce(e, n);
  return t.dispatchEvent(r), r;
}, Md = /* @__PURE__ */ new WeakMap(), y4 = (t, e, n) => {
  let r = pa.get(t);
  P4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, pa.set(t, r);
}, w4 = (t, e, n, r) => {
  var s;
  let i = ig(e);
  const o = pa.get(i);
  if (t = t.nodeType === 11 ? t : kn, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Md.get(t), c;
      if (a || Md.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = kn.createElement("style"), c.innerHTML = o;
          const f = (s = Se.$nonce$) !== null && s !== void 0 ? s : sg(kn);
          f != null && c.setAttribute("nonce", f), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, b4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Vn("attachStyles", e.$tagName$), i = w4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, ig = (t, e) => "sc-" + t.$tagName$, _d = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = Ud(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, f = Nd(n), d = Nd(r);
      c.remove(...f.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !f.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Ud(Ra, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Se.rel(t, e, n, !1), r && Se.ael(t, e, r, !1);
    else {
      const c = ku(r);
      if ((o || c && r !== null) && !s)
        try {
          if (t.tagName.includes("-"))
            t[e] = r;
          else {
            const f = r ?? "";
            e === "list" ? o = !1 : (n == null || t[e] != f) && (t[e] = f);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || t.getAttribute(e) === "") && t.removeAttribute(e) : (!o || i & 4 || s) && !c && (r = r === !0 ? "" : r, t.setAttribute(e, r));
    }
  }
}, m4 = /\s/, Nd = (t) => t ? t.split(m4) : [], og = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || Td, o = e.$attrs$ || Td;
  for (r in i)
    r in o || _d(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    _d(s, r, i[r], o[r], n, e.$flags$);
}, Lu = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = kn.createTextNode(s.$text$);
  else {
    if (ze || (ze = s.$tag$ === "svg"), o = s.$elm$ = kn.createElementNS(ze ? c4 : l4, s.$tag$), ze && s.$tag$ === "foreignObject" && (ze = !1), og(null, s, ze), u4(qo) && o["s-si"] !== qo && o.classList.add(o["s-si"] = qo), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = Lu(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? ze = !1 : o.tagName === "foreignObject" && (ze = !0);
  }
  return o;
}, ag = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === rg && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = Lu(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, cg = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, x4 = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], f = r.length - 1, d = r[0], l = r[f], g;
  for (; s <= o && i <= f; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : d == null ? d = r[++i] : l == null ? l = r[--f] : Uo(a, d) ? (Ti(a, d), a = e[++s], d = r[++i]) : Uo(c, l) ? (Ti(c, l), c = e[--o], l = r[--f]) : Uo(a, l) ? (Ti(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--f]) : Uo(c, d) ? (Ti(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++i]) : (g = Lu(e && e[i], n, i), d = r[++i], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  s > o ? ag(t, r[f + 1] == null ? null : r[f + 1].$elm$, n, r, i, f) : i > f && cg(e, s, o);
}, Uo = (t, e) => t.$tag$ === e.$tag$, Ti = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (ze = i === "svg" ? !0 : i === "foreignObject" ? !1 : ze, og(t, e, ze), r !== null && s !== null ? x4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), ag(n, null, e, s, 0, s.length - 1)) : r !== null && cg(r, 0, r.length - 1), ze && i === "svg" && (ze = !1)) : t.$text$ !== o && (n.data = o);
}, S4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || xl(null, null), s = d4(e) ? e : pt(null, null, e);
  rg = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, qo = n["s-sc"], Ti(r, s);
}, lg = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Cu = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return lg(t, t.$ancestorComponent$), O4(() => E4(t, e));
}, E4 = (t, e) => {
  const n = Vn("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), I4(s, () => A4(t, r, e));
}, A4 = async (t, e, n) => {
  const r = t.$hostElement$, s = Vn("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && b4(t);
  const o = Vn("render", t.$cmpMeta$.$tagName$);
  $4(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => v4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, $4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, S4(t, e);
  } catch (r) {
    Ki(r, t.$hostElement$);
  }
  return null;
}, v4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Vn("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, fg(n), r(), t.$onReadyResolve$(n), s || ug()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Tu(() => Cu(t, !1)), t.$flags$ &= -517;
}, ug = (t) => {
  fg(kn.documentElement), Tu(() => g4(Ra, "appload", { detail: { namespace: i4 } }));
}, I4 = (t, e) => t && t.then ? t.then(e) : e(), fg = (t) => t.classList.add("hydrated"), k4 = (t, e) => xi(t).$instanceValues$.get(e), L4 = (t, e, n, r) => {
  const s = xi(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = h4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), f = n !== i && !c;
  (!(o & 8) || i === void 0) && f && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && Cu(s, !1));
}, dg = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return k4(this, i);
        },
        set(a) {
          L4(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        Se.jmp(() => {
          const f = i.get(o);
          if (this.hasOwnProperty(f))
            c = this[f], delete this[f];
          else if (s.hasOwnProperty(f) && typeof this[f] == "number" && this[f] == c)
            return;
          this[f] = c === null && typeof this[f] == "boolean" ? !1 : c;
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
}, C4 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = U4(n), s.then) {
        const c = o4();
        s = await s, c();
      }
      s.isProxied || (dg(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Vn("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        Ki(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = ig(n);
      if (!pa.has(c)) {
        const f = Vn("registerStyles", n.$tagName$);
        y4(c, a, !!(n.$flags$ & 1)), f();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => Cu(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, B4 = (t) => {
  if (!(Se.$flags$ & 1)) {
    const e = xi(t), n = e.$cmpMeta$, r = Vn("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            lg(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), C4(t, e, n);
    }
    r();
  }
}, T4 = (t) => {
  Se.$flags$ & 1 || xi(t);
}, M4 = (t, e = {}) => {
  var n;
  const r = Vn(), s = [], i = e.exclude || [], o = Ra.customElements, a = kn.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), f = /* @__PURE__ */ kn.createElement("style"), d = [];
  let l, g = !0;
  Object.assign(Se, e), Se.$resourcesUrl$ = new URL(e.resourcesUrl || "./", kn.baseURI).href, t.map((h) => {
    h[1].map((x) => {
      const m = {
        $flags$: x[0],
        $tagName$: x[1],
        $members$: x[2],
        $listeners$: x[3]
      };
      m.$members$ = x[2];
      const L = m.$tagName$, b = class extends HTMLElement {
        // StencilLazyHost
        constructor(T) {
          super(T), T = this, N4(T, m), m.$flags$ & 1 && T.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? d.push(this) : Se.jmp(() => B4(this));
        }
        disconnectedCallback() {
          Se.jmp(() => T4(this));
        }
        componentOnReady() {
          return xi(this).$onReadyPromise$;
        }
      };
      m.$lazyBundleId$ = h[0], !i.includes(L) && !o.get(L) && (s.push(L), o.define(L, dg(
        b,
        m,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    f.innerHTML = s + a4, f.setAttribute("data-styles", "");
    const h = (n = Se.$nonce$) !== null && n !== void 0 ? n : sg(kn);
    h != null && f.setAttribute("nonce", h), a.insertBefore(f, c ? c.nextSibling : a.firstChild);
  }
  g = !1, d.length ? d.map((h) => h.connectedCallback()) : Se.jmp(() => l = setTimeout(ug, 30)), r();
}, Bu = /* @__PURE__ */ new WeakMap(), xi = (t) => Bu.get(t), _4 = (t, e) => Bu.set(e.$lazyInstance$ = t, e), N4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], Bu.set(t, n);
}, Ud = (t, e) => e in t, Ki = (t, e) => (0, console.error)(t, e), Sc = /* @__PURE__ */ new Map(), U4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Sc.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (Sc.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => V$).then(o, Ki);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Sc.set(s, o), o[r]), Ki);
}, pa = /* @__PURE__ */ new Map(), Ra = typeof window < "u" ? window : {}, kn = Ra.document || { head: {} }, Se = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, hg = (t) => Promise.resolve(t), P4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Pd = [], pg = [], H4 = (t, e) => (n) => {
  t.push(n), ml || (ml = !0, Se.$flags$ & 4 ? Tu(Sl) : Se.raf(Sl));
}, Hd = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Ki(n);
    }
  t.length = 0;
}, Sl = () => {
  Hd(Pd), Hd(pg), (ml = Pd.length > 0) && Se.raf(Sl);
}, Tu = (t) => hg().then(t), O4 = /* @__PURE__ */ H4(pg), D4 = () => hg(), F4 = (t, e) => typeof window > "u" ? Promise.resolve() : D4().then(() => M4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var j4 = Object.defineProperty, z4 = Object.defineProperties, R4 = Object.getOwnPropertyDescriptors, ga = Object.getOwnPropertySymbols, gg = Object.prototype.hasOwnProperty, yg = Object.prototype.propertyIsEnumerable, Od = (t, e, n) => e in t ? j4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, We = (t, e) => {
  for (var n in e || (e = {})) gg.call(e, n) && Od(t, n, e[n]);
  if (ga) for (var n of ga(e)) yg.call(e, n) && Od(t, n, e[n]);
  return t;
}, pn = (t, e) => z4(t, R4(e)), wg = (t, e) => {
  var n = {};
  for (var r in t) gg.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && ga) for (var r of ga(t)) e.indexOf(r) < 0 && yg.call(t, r) && (n[r] = t[r]);
  return n;
};
function bg() {
  return Pa(cs()) || window.StacksProvider || window.BlockstackProvider;
}
function Ga(t) {
  return t ? typeof t == "string" ? us.fromName(t) : "version" in t ? t : "url" in t ? new qc({ url: t.url }) : t.transactionVersion === ds.Mainnet ? new qc({ url: t.client.baseUrl }) : new Yc({ url: t.client.baseUrl }) : new Yc();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var G4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(G4 || {}), K4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(K4 || {}), Mu = (t) => {
  let e = t;
  if (!e) {
    let n = new qh(["store_write"], document.location.href);
    e = new Xc({ appConfig: n });
  }
  return e;
};
function mg(t) {
  try {
    return Mu(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var xg = (t) => {
  let e = Mu(t).loadUserData().appPrivateKey, n = me.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function V4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [fs.Mainnet]: "mainnet", [fs.Testnet]: "testnet" }, a = Ga(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function W4(t) {
  let e = Ga(t.network), n = Mu(t.userSession), r = pn(We({}, t), { network: e, userSession: n });
  return We({ stxAddress: V4(r) }, r);
}
async function X4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Kp) : n = n.map((r) => it(eg(r)))), new me.TokenSigner("ES256k", e).signAsync(pn(We({}, t), { postConditions: n }));
}
function q4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(Kp) : e = e.map((n) => it(eg(n)))), me.createUnsecuredToken(pn(We({}, t), { postConditions: e }));
}
var Y4 = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Bt(a.replace(/^0x/, "")), f = F3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, pn(We({}, o), { stacksTransaction: f }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, pn(We({}, o), { stacksTransaction: f }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, Z4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = wg(e, ["amount", "appDetails", "userSession"]);
  if (mg(s)) {
    let { privateKey: a, publicKey: c } = xg(s), f = pn(We({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (f.appDetails = r), X4(f, a);
  }
  let o = pn(We({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), q4(o);
};
async function Q4(t, e, n) {
  let r = await e(pn(We(We({}, W4(t)), t), { network: Ga(t.network) }));
  return Y4({ token: r, options: t }, n);
}
function J4(t, e = bg()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return Q4(t, Z4, e);
}
function Sg(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? pn(We({}, t), { message: dd(e), domain: dd(n) }) : pn(We({}, t), { message: it(ps(e)), domain: it(ps(n)) });
}
async function tA(t, e) {
  return new me.TokenSigner("ES256k", e).signAsync(Sg(t));
}
async function eA(t) {
  let e = t, { userSession: n } = e, r = wg(e, ["userSession"]);
  if (mg(n)) {
    let { privateKey: s, publicKey: i } = xg(n), o = pn(We({}, r), { publicKey: i });
    return tA(o, s);
  }
  return me.createUnsecuredToken(Sg(t));
}
var nA = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(nA || {}), Eg = "asigna-stx", Dd = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Eg && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(sA(t, e), "*");
}), rA = { authenticationRequest: async (t) => Dd(t, "authenticationRequest"), transactionRequest: async (t) => Dd(t, "transactionRequest") }, sA = (t, e) => ({ source: Eg, [e]: t }), iA = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = rA);
};
iA();
var oA = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function aA(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = cs(), o = bg();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    F4();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : oA, c = Q2(a), f = document.createElement("connect-modal");
    f.defaultProviders = a, f.installedProviders = c, f.persistSelection = e;
    let d = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      f.remove(), document.body.style.overflow = d;
    };
    f.callback = (h) => {
      l(), t(n, h);
    }, f.cancelCallback = () => {
      var h;
      l(), (h = n.onCancel) == null || h.call(n);
    }, document.body.appendChild(f);
    let g = (h) => {
      h.key === "Escape" && (document.removeEventListener("keydown", g), f.remove());
    };
    document.addEventListener("keydown", g);
  };
}
var Po = aA(J4);
function Mr(t, e, n) {
  return _u(Le(t, e), n);
}
function Le(t, e) {
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
    if (e) {
      const r = uA(BigInt(`0x${vt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${vt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Fd(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function so(t, e = 8) {
  return (typeof t == "bigint" ? t : Le(t, !1)).toString(16).padStart(e * 2, "0");
}
function Ka(t) {
  return parseInt(t, 16);
}
function _u(t, e = 16) {
  const n = so(t, e);
  return Yt(n);
}
function cA(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function lA(t, e) {
  return t & BigInt(1) << e;
}
function uA(t, e) {
  return lA(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const fA = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function vt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += fA[n];
  return e;
}
function Yt(t) {
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
function Si(t) {
  return new TextEncoder().encode(t);
}
function Nu(t) {
  return new TextDecoder().decode(t);
}
function Ag(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function dA(t) {
  return String.fromCharCode.apply(null, t);
}
function hA(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function jd(t) {
  if (t.some(hA))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Va(...t) {
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
function oe(t) {
  return Va(...t.map((e) => typeof e == "number" ? jd([e]) : e instanceof Array ? jd(e) : e));
}
var zd;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(zd || (zd = {}));
var Rd;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Rd || (Rd = {}));
var Gd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Gd || (Gd = {}));
const $g = 33, Ec = 32;
function pA(t) {
  if (t.length < Ec * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Ec * 2), r = t.slice(2 + Ec * 2);
  return {
    recoveryId: Ka(e),
    r: n,
    s: r
  };
}
function gA(t) {
  const e = typeof t == "string" ? Yt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function yA(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function wA(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function bA(t, e) {
  return t[e];
}
function mA(t, e, n = 0) {
  return t[n] = e, t;
}
function xA(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function gs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var El;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(El || (El = {}));
const SA = El.Mainnet, EA = 128, AA = 128, vg = 16, ts = 32, Al = 80, Wa = 65, $A = 32, vA = 64, ya = 34;
var nt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(nt || (nt = {}));
var Et;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Et || (Et = {}));
var $l;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})($l || ($l = {}));
var Ue;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ue || (Ue = {}));
const Yo = ["onChainOnly", "offChainOnly", "any"], Kd = {
  [Yo[0]]: Ue.OnChainOnly,
  [Yo[1]]: Ue.OffChainOnly,
  [Yo[2]]: Ue.Any,
  [Ue.OnChainOnly]: Ue.OnChainOnly,
  [Ue.OffChainOnly]: Ue.OffChainOnly,
  [Ue.Any]: Ue.Any
};
function IA(t) {
  if (t in Kd)
    return Kd[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${Yo.join(", ")}`);
}
var wa;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(wa || (wa = {}));
wa.Mainnet;
var fi;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(fi || (fi = {}));
var Pe;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Pe || (Pe = {}));
var ne;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ne || (ne = {}));
var zt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(zt || (zt = {}));
var ba;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ba || (ba = {}));
var Jt;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Jt || (Jt = {}));
var Vi;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Vi || (Vi = {}));
var vl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(vl || (vl = {}));
var Wi;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Wi || (Wi = {}));
var Vd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Vd || (Vd = {}));
var Wd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Wd || (Wd = {}));
function Il(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function kA(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Ig(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function LA(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Il(t.outputLen), Il(t.blockLen);
}
function CA(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function BA(t, e) {
  Ig(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Yr = {
  number: Il,
  bool: kA,
  bytes: Ig,
  hash: LA,
  exists: CA,
  output: BA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ac = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), En = (t, e) => t << 32 - e | t >>> e, TA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!TA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function MA(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Uu(t) {
  if (typeof t == "string" && (t = MA(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class kg {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Ls(t) {
  const e = (r) => t().update(Uu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function _A(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
class Pu extends kg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ac(this.buffer);
  }
  update(e) {
    Yr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Uu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Ac(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Yr.exists(this), Yr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    _A(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ac(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
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
const NA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Lg = Uint8Array.from({ length: 16 }, (t, e) => e), UA = Lg.map((t) => (9 * t + 5) % 16);
let Hu = [Lg], Ou = [UA];
for (let t = 0; t < 4; t++)
  for (let e of [Hu, Ou])
    e.push(e[t].map((n) => NA[n]));
const Cg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), PA = Hu.map((t, e) => t.map((n) => Cg[e][n])), HA = Ou.map((t, e) => t.map((n) => Cg[e][n])), OA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), DA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ho = (t, e) => t << e | t >>> 32 - e;
function Xd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Oo = new Uint32Array(16);
class FA extends Pu {
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
    for (let h = 0; h < 16; h++, n += 4)
      Oo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, m = OA[h], L = DA[h], b = Hu[h], T = Ou[h], w = PA[h], B = HA[h];
      for (let C = 0; C < 16; C++) {
        const D = Ho(r + Xd(h, i, a, f) + Oo[b[C]] + m, w[C]) + l | 0;
        r = l, l = f, f = Ho(a, 10) | 0, a = i, i = D;
      }
      for (let C = 0; C < 16; C++) {
        const D = Ho(s + Xd(x, o, c, d) + Oo[T[C]] + L, B[C]) + g | 0;
        s = g, g = d, d = Ho(c, 10) | 0, c = o, o = D;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Oo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const jA = Ls(() => new FA()), zA = (t, e, n) => t & e ^ ~t & n, RA = (t, e, n) => t & e ^ t & n ^ e & n, GA = new Uint32Array([
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
]), mr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), xr = new Uint32Array(64);
class Bg extends Pu {
  constructor() {
    super(64, 32, 8, !1), this.A = mr[0] | 0, this.B = mr[1] | 0, this.C = mr[2] | 0, this.D = mr[3] | 0, this.E = mr[4] | 0, this.F = mr[5] | 0, this.G = mr[6] | 0, this.H = mr[7] | 0;
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
      xr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = xr[l - 15], h = xr[l - 2], x = En(g, 7) ^ En(g, 18) ^ g >>> 3, m = En(h, 17) ^ En(h, 19) ^ h >>> 10;
      xr[l] = m + xr[l - 7] + x + xr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = En(a, 6) ^ En(a, 11) ^ En(a, 25), h = d + g + zA(a, c, f) + GA[l] + xr[l] | 0, m = (En(r, 2) ^ En(r, 13) ^ En(r, 22)) + RA(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    xr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class KA extends Bg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Du = Ls(() => new Bg());
Ls(() => new KA());
const Do = BigInt(2 ** 32 - 1), kl = BigInt(32);
function Tg(t, e = !1) {
  return e ? { h: Number(t & Do), l: Number(t >> kl & Do) } : { h: Number(t >> kl & Do) | 0, l: Number(t & Do) | 0 };
}
function VA(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Tg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const WA = (t, e) => BigInt(t >>> 0) << kl | BigInt(e >>> 0), XA = (t, e, n) => t >>> n, qA = (t, e, n) => t << 32 - n | e >>> n, YA = (t, e, n) => t >>> n | e << 32 - n, ZA = (t, e, n) => t << 32 - n | e >>> n, QA = (t, e, n) => t << 64 - n | e >>> n - 32, JA = (t, e, n) => t >>> n - 32 | e << 64 - n, t8 = (t, e) => e, e8 = (t, e) => t, n8 = (t, e, n) => t << n | e >>> 32 - n, r8 = (t, e, n) => e << n | t >>> 32 - n, s8 = (t, e, n) => e << n - 32 | t >>> 64 - n, i8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function o8(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const a8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), c8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, l8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), u8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, f8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), d8 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, St = {
  fromBig: Tg,
  split: VA,
  toBig: WA,
  shrSH: XA,
  shrSL: qA,
  rotrSH: YA,
  rotrSL: ZA,
  rotrBH: QA,
  rotrBL: JA,
  rotr32H: t8,
  rotr32L: e8,
  rotlSH: n8,
  rotlSL: r8,
  rotlBH: s8,
  rotlBL: i8,
  add: o8,
  add3L: a8,
  add3H: c8,
  add4L: l8,
  add4H: u8,
  add5H: d8,
  add5L: f8
}, [h8, p8] = St.split([
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
].map((t) => BigInt(t))), Sr = new Uint32Array(80), Er = new Uint32Array(80);
class Xa extends Pu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: x, Hh: m, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, x, m, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, x, m, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = m | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let w = 0; w < 16; w++, n += 4)
      Sr[w] = e.getUint32(n), Er[w] = e.getUint32(n += 4);
    for (let w = 16; w < 80; w++) {
      const B = Sr[w - 15] | 0, C = Er[w - 15] | 0, D = St.rotrSH(B, C, 1) ^ St.rotrSH(B, C, 8) ^ St.shrSH(B, C, 7), q = St.rotrSL(B, C, 1) ^ St.rotrSL(B, C, 8) ^ St.shrSL(B, C, 7), O = Sr[w - 2] | 0, W = Er[w - 2] | 0, S = St.rotrSH(O, W, 19) ^ St.rotrBH(O, W, 61) ^ St.shrSH(O, W, 6), $ = St.rotrSL(O, W, 19) ^ St.rotrBL(O, W, 61) ^ St.shrSL(O, W, 6), H = St.add4L(q, $, Er[w - 7], Er[w - 16]), Y = St.add4H(H, D, S, Sr[w - 7], Sr[w - 16]);
      Sr[w] = Y | 0, Er[w] = H | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: x, Gh: m, Gl: L, Hh: b, Hl: T } = this;
    for (let w = 0; w < 80; w++) {
      const B = St.rotrSH(l, g, 14) ^ St.rotrSH(l, g, 18) ^ St.rotrBH(l, g, 41), C = St.rotrSL(l, g, 14) ^ St.rotrSL(l, g, 18) ^ St.rotrBL(l, g, 41), D = l & h ^ ~l & m, q = g & x ^ ~g & L, O = St.add5L(T, C, q, p8[w], Er[w]), W = St.add5H(O, b, B, D, h8[w], Sr[w]), S = O | 0, $ = St.rotrSH(r, s, 28) ^ St.rotrBH(r, s, 34) ^ St.rotrBH(r, s, 39), H = St.rotrSL(r, s, 28) ^ St.rotrBL(r, s, 34) ^ St.rotrBL(r, s, 39), Y = r & i ^ r & a ^ i & a, et = s & o ^ s & c ^ o & c;
      b = m | 0, T = L | 0, m = h | 0, L = x | 0, h = l | 0, x = g | 0, { h: l, l: g } = St.add(f | 0, d | 0, W | 0, S | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const X = St.add3L(S, H, et);
      r = St.add3H(X, W, $, Y), s = X | 0;
    }
    ({ h: r, l: s } = St.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = St.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = St.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = St.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = St.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: x } = St.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: m, l: L } = St.add(this.Gh | 0, this.Gl | 0, m | 0, L | 0), { h: b, l: T } = St.add(this.Hh | 0, this.Hl | 0, b | 0, T | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, x, m, L, b, T);
  }
  roundClean() {
    Sr.fill(0), Er.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class g8 extends Xa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class y8 extends Xa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class w8 extends Xa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Ls(() => new Xa());
Ls(() => new g8());
const b8 = Ls(() => new y8());
Ls(() => new w8());
function Mg(t) {
  if (Yt(t).byteLength != Wa)
    throw Error("Invalid signature");
  return {
    type: nt.MessageSignature,
    data: t
  };
}
function Mi(t, e) {
  return { type: nt.Address, version: t, hash160: e };
}
function Ws(t) {
  return vs.c32address(t.version, t.hash160);
}
function ys(t, e, n) {
  const r = e || 1, s = n || EA;
  if (qg(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: nt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Fu(t) {
  const e = vs.c32addressDecode(t);
  return {
    type: nt.Address,
    version: e[0],
    hash160: e[1]
  };
}
var P;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(P || (P = {}));
function m8(t) {
  if (t.type === P.PrincipalStandard)
    return Ws(t.address);
  if (t.type === P.PrincipalContract)
    return `${Ws(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function _g(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return E8(e, n);
  } else
    return x8(t);
}
function x8(t) {
  const e = Fu(t);
  return { type: P.PrincipalStandard, address: e };
}
function S8(t) {
  return { type: P.PrincipalStandard, address: t };
}
function E8(t, e) {
  const n = Fu(t), r = ys(e);
  return Ng(n, r);
}
function Ng(t, e) {
  if (Si(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: P.PrincipalContract, address: t, contractName: e };
}
function $c(t, e = !1) {
  switch (t.type) {
    case P.BoolTrue:
      return !0;
    case P.BoolFalse:
      return !1;
    case P.Int:
    case P.UInt:
      return e ? t.value.toString() : t.value;
    case P.Buffer:
      return `0x${vt(t.buffer)}`;
    case P.OptionalNone:
      return null;
    case P.OptionalSome:
      return zn(t.value);
    case P.ResponseErr:
      return zn(t.value);
    case P.ResponseOk:
      return zn(t.value);
    case P.PrincipalStandard:
    case P.PrincipalContract:
      return m8(t);
    case P.List:
      return t.list.map((r) => zn(r));
    case P.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = zn(t.data[r]);
      }), n;
    case P.StringASCII:
      return t.data;
    case P.StringUTF8:
      return t.data;
  }
}
function zn(t) {
  switch (t.type) {
    case P.ResponseErr:
      return { type: vr(t), value: $c(t, !0), success: !1 };
    case P.ResponseOk:
      return { type: vr(t), value: $c(t, !0), success: !0 };
    default:
      return { type: vr(t), value: $c(t, !0) };
  }
}
function vr(t) {
  switch (t.type) {
    case P.BoolTrue:
    case P.BoolFalse:
      return "bool";
    case P.Int:
      return "int";
    case P.UInt:
      return "uint";
    case P.Buffer:
      return `(buff ${t.buffer.length})`;
    case P.OptionalNone:
      return "(optional none)";
    case P.OptionalSome:
      return `(optional ${vr(t.value)})`;
    case P.ResponseErr:
      return `(response UnknownType ${vr(t.value)})`;
    case P.ResponseOk:
      return `(response ${vr(t.value)} UnknownType)`;
    case P.PrincipalStandard:
    case P.PrincipalContract:
      return "principal";
    case P.List:
      return `(list ${t.list.length} ${t.list.length ? vr(t.list[0]) : "UnknownType"})`;
    case P.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${vr(t.data[e])})`).join(" ")})`;
    case P.StringASCII:
      return `(string-ascii ${Ag(t.data).length})`;
    case P.StringUTF8:
      return `(string-utf8 ${Si(t.data).length})`;
  }
}
const Ug = () => ({ type: P.BoolTrue }), Pg = () => ({ type: P.BoolFalse }), A8 = (t) => t ? Ug() : Pg(), qd = BigInt("0xffffffffffffffffffffffffffffffff"), $8 = BigInt(0), Yd = BigInt("0x7fffffffffffffffffffffffffffffff"), Zd = BigInt("-170141183460469231731687303715884105728"), v8 = (t) => {
  const e = Le(t, !0);
  if (e > Yd)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Yd}`);
  if (e < Zd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Zd}`);
  return { type: P.Int, value: e };
}, Ln = (t) => {
  const e = Le(t, !1);
  if (e < $8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > qd)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${qd}`);
  return { type: P.UInt, value: e };
}, Hg = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: P.Buffer, buffer: t };
};
function Og() {
  return { type: P.OptionalNone };
}
function Dg(t) {
  return { type: P.OptionalSome, value: t };
}
function I8(t) {
  return { type: P.ResponseErr, value: t };
}
function k8(t) {
  return { type: P.ResponseOk, value: t };
}
function L8(t) {
  return { type: P.List, list: t };
}
function ws(t) {
  for (const e in t)
    if (!w6(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: P.Tuple, data: t };
}
const be = (t) => ({ type: P.StringASCII, data: t }), C8 = (t) => ({ type: P.StringUTF8, data: t });
class Fg extends kg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Yr.hash(e);
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
    return Yr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Yr.exists(this), Yr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const jg = (t, e, n) => new Fg(t, e).update(n).digest();
jg.create = (t, e) => new Fg(t, e);
re.hmacSha256Sync = (t, ...e) => {
  const n = jg.create(Du, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function di(t) {
  return {
    type: nt.PublicKey,
    data: Yt(t)
  };
}
function B8(t, e, n = Jt.Compressed) {
  const r = pA(e.data), s = new Ke(Fd(r.r), Fd(r.s)), i = At.fromSignature(t, s, r.recoveryId), o = n === Jt.Compressed;
  return i.toHex(o);
}
function T8(t) {
  return { type: nt.PublicKey, data: t };
}
function Ei(t) {
  return !vt(t.data).startsWith("04");
}
function ma(t) {
  return t.data.slice();
}
function M8(t) {
  const e = U8(t), n = Ji(e.data.slice(0, 32), e.compressed);
  return di(vt(n));
}
function _8(t) {
  const e = typeof t == "string" ? t : vt(t), n = At.fromHex(e).toHex(!0);
  return di(n);
}
function N8(t) {
  const e = typeof t == "string" ? t : vt(t), n = At.fromHex(e).toHex(!1);
  return di(n);
}
function Ll(t) {
  const e = t.readUInt8(), n = e === 4 ? vA : $A;
  return T8(oe([e, t.readBytes(n)]));
}
function U8(t) {
  const e = gA(t), n = e.length == $g;
  return { data: e, compressed: n };
}
function P8(t, e) {
  const [n, r] = Ia(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = so(r, 1) + Ke.fromHex(n).toCompactHex();
  return Mg(i);
}
function H8(t) {
  return M8(t.data);
}
function O8(t, e, n) {
  return typeof t == "string" && (t = _g(t)), typeof n == "string" && (n = th(n)), {
    type: nt.Payload,
    payloadType: Et.TokenTransfer,
    recipient: t,
    amount: Le(e, !1),
    memo: n ?? th("")
  };
}
function D8(t, e, n, r) {
  return typeof t == "string" && (t = Fu(t)), typeof e == "string" && (e = ys(e)), typeof n == "string" && (n = ys(n)), {
    type: nt.Payload,
    payloadType: Et.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Qd(t, e, n) {
  return typeof t == "string" && (t = ys(t)), typeof e == "string" && (e = X8(e)), typeof n == "number" ? {
    type: nt.Payload,
    payloadType: Et.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: nt.Payload,
    payloadType: Et.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function F8() {
  return { type: nt.Payload, payloadType: Et.PoisonMicroblock };
}
function Jd(t, e) {
  if (t.byteLength != ts)
    throw Error(`Coinbase buffer size must be ${ts} bytes`);
  return e != null ? {
    type: nt.Payload,
    payloadType: Et.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: nt.Payload,
    payloadType: Et.Coinbase,
    coinbaseBytes: t
  };
}
function j8(t, e, n) {
  if (t.byteLength != ts)
    throw Error(`Coinbase buffer size must be ${ts} bytes`);
  if (n.byteLength != Al)
    throw Error(`VRF proof buffer size must be ${Al} bytes`);
  return {
    type: nt.Payload,
    payloadType: Et.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === P.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Cl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Cl || (Cl = {}));
function z8(t, e, n, r, s, i, o) {
  return {
    type: nt.Payload,
    payloadType: Et.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function zg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Et.TokenTransfer:
      e.push(se(t.recipient)), e.push(Mr(t.amount, !1, 8)), e.push(Fn(t.memo));
      break;
    case Et.ContractCall:
      e.push(Fn(t.contractAddress)), e.push(Fn(t.contractName)), e.push(Fn(t.functionName));
      const n = new Uint8Array(4);
      gs(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(se(r));
      });
      break;
    case Et.SmartContract:
      e.push(Fn(t.contractName)), e.push(Fn(t.codeBody));
      break;
    case Et.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Fn(t.contractName)), e.push(Fn(t.codeBody));
      break;
    case Et.PoisonMicroblock:
      break;
    case Et.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Et.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(se(t.recipient));
      break;
    case Et.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(se(t.recipient ? Dg(t.recipient) : Og())), e.push(t.vrfProof);
      break;
    case Et.TenureChange:
      e.push(Yt(t.tenureHash)), e.push(Yt(t.previousTenureHash)), e.push(Yt(t.burnViewHash)), e.push(Yt(t.previousTenureEnd)), e.push(gs(new Uint8Array(4), t.previousTenureBlocks)), e.push(mA(new Uint8Array(1), t.cause)), e.push(Yt(t.publicKeyHash));
      break;
  }
  return oe(e);
}
function R8(t) {
  switch (t.readUInt8Enum(Et, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Et.TokenTransfer:
      const n = rn(t), r = Le(t.readBytes(8), !1), s = Gg(t);
      return O8(n, r, s);
    case Et.ContractCall:
      const i = hi(t), o = nn(t), a = nn(t), c = [], f = t.readUInt32BE();
      for (let w = 0; w < f; w++) {
        const B = rn(t);
        c.push(B);
      }
      return D8(i, o, a, c);
    case Et.SmartContract:
      const d = nn(t), l = nn(t, 4, 1e5);
      return Qd(d, l);
    case Et.VersionedSmartContract: {
      const w = t.readUInt8Enum($l, (D) => {
        throw new Error(`Cannot recognize ClarityVersion: ${D}`);
      }), B = nn(t), C = nn(t, 4, 1e5);
      return Qd(B, C, w);
    }
    case Et.PoisonMicroblock:
      return F8();
    case Et.Coinbase: {
      const w = t.readBytes(ts);
      return Jd(w);
    }
    case Et.CoinbaseToAltRecipient: {
      const w = t.readBytes(ts), B = rn(t);
      return Jd(w, B);
    }
    case Et.NakamotoCoinbase: {
      const w = t.readBytes(ts), B = rn(t), C = t.readBytes(Al);
      return j8(w, B, C);
    }
    case Et.TenureChange:
      const g = vt(t.readBytes(20)), h = vt(t.readBytes(20)), x = vt(t.readBytes(20)), m = vt(t.readBytes(32)), L = t.readUInt32BE(), b = t.readUInt8Enum(Cl, (w) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${w}`);
      }), T = vt(t.readBytes(20));
      return z8(g, h, x, m, L, b, T);
  }
}
class qa extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Kr extends qa {
  constructor(e) {
    super(e);
  }
}
class Ge extends qa {
  constructor(e) {
    super(e);
  }
}
class xa extends qa {
  constructor(e) {
    super(e);
  }
}
class Zr extends qa {
  constructor(e) {
    super(e);
  }
}
var fn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(fn || (fn = {}));
function Bl(t) {
  return Mg(vt(t.readBytes(Wa)));
}
function Xs(t, e) {
  return {
    pubKeyEncoding: t,
    type: nt.TransactionAuthField,
    contents: e
  };
}
function G8(t) {
  const e = t.readUInt8Enum(fn, (n) => {
    throw new Ge(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case fn.PublicKeyCompressed:
      return Xs(Jt.Compressed, Ll(t));
    case fn.PublicKeyUncompressed:
      return Xs(Jt.Uncompressed, N8(Ll(t).data));
    case fn.SignatureCompressed:
      return Xs(Jt.Compressed, Bl(t));
    case fn.SignatureUncompressed:
      return Xs(Jt.Uncompressed, Bl(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function ju(t) {
  return Yt(t.data);
}
function K8(t) {
  const e = [];
  switch (t.contents.type) {
    case nt.PublicKey:
      e.push(t.pubKeyEncoding === Jt.Compressed ? fn.PublicKeyCompressed : fn.PublicKeyUncompressed), e.push(ma(_8(t.contents.data)));
      break;
    case nt.MessageSignature:
      e.push(t.pubKeyEncoding === Jt.Compressed ? fn.SignatureCompressed : fn.SignatureUncompressed), e.push(ju(t.contents));
      break;
  }
  return oe(e);
}
function Fn(t) {
  switch (t.type) {
    case nt.Address:
      return io(t);
    case nt.Principal:
      return Rg(t);
    case nt.LengthPrefixedString:
      return pi(t);
    case nt.MemoString:
      return q8(t);
    case nt.AssetInfo:
      return Kg(t);
    case nt.PostCondition:
      return Y8(t);
    case nt.PublicKey:
      return ma(t);
    case nt.LengthPrefixedList:
      return Gu(t);
    case nt.Payload:
      return zg(t);
    case nt.TransactionAuthField:
      return K8(t);
    case nt.MessageSignature:
      return ju(t);
  }
}
function V8() {
  return {
    type: nt.Address,
    version: ba.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function zu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === zt.SerializeP2PKH || e === zt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === zt.SerializeP2WPKH || e === zt.SerializeP2WSH || e === zt.SerializeP2WSHNonSequential) && !r.every(Ei))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case zt.SerializeP2PKH:
      return Mi(t, h6(r[0].data));
    case zt.SerializeP2WPKH:
      return Mi(t, p6(r[0].data));
    case zt.SerializeP2SH:
    case zt.SerializeP2SHNonSequential:
      return Mi(t, g6(n, r.map(ma)));
    case zt.SerializeP2WSH:
    case zt.SerializeP2WSHNonSequential:
      return Mi(t, y6(n, r.map(ma)));
  }
}
function io(t) {
  const e = [];
  return e.push(Yt(so(t.version, 1))), e.push(Yt(t.hash160)), oe(e);
}
function hi(t) {
  const e = Ka(vt(t.readBytes(1))), n = vt(t.readBytes(20));
  return { type: nt.Address, version: e, hash160: n };
}
function Rg(t) {
  const e = [];
  return e.push(t.prefix), e.push(io(t.address)), t.prefix === Wi.Contract && e.push(pi(t.contractName)), oe(e);
}
function W8(t) {
  const e = t.readUInt8Enum(Wi, (s) => {
    throw new Ge(`Unexpected Principal payload type: ${s}`);
  }), n = hi(t);
  if (e === Wi.Standard)
    return { type: nt.Principal, prefix: e, address: n };
  const r = nn(t);
  return {
    type: nt.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function pi(t) {
  const e = [], n = Si(t.content), r = n.byteLength;
  return e.push(Yt(so(r, t.lengthPrefixBytes))), e.push(n), oe(e);
}
function nn(t, e, n) {
  e = e || 1;
  const r = Ka(vt(t.readBytes(e))), s = Nu(t.readBytes(r));
  return ys(s, e, n ?? 128);
}
function X8(t) {
  return ys(t, 4, 1e5);
}
function th(t) {
  if (t && qg(t, ya))
    throw new Error(`Memo exceeds maximum length of ${ya} bytes`);
  return { type: nt.MemoString, content: t };
}
function q8(t) {
  const e = [], n = Si(t.content), r = d6(vt(n), ya * 2);
  return e.push(Yt(r)), oe(e);
}
function Gg(t) {
  let e = Nu(t.readBytes(ya));
  return e = e.replace(/\u0000*$/, ""), { type: nt.MemoString, content: e };
}
function Kg(t) {
  const e = [];
  return e.push(io(t.address)), e.push(pi(t.contractName)), e.push(pi(t.assetName)), oe(e);
}
function Tl(t) {
  return {
    type: nt.AssetInfo,
    address: hi(t),
    contractName: nn(t),
    assetName: nn(t)
  };
}
function Ru(t, e) {
  return {
    type: nt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Gu(t) {
  const e = t.values, n = [];
  n.push(Yt(so(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Fn(r));
  return oe(n);
}
function Vg(t, e, n) {
  const r = Ka(vt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case nt.Address:
        s.push(hi(t));
        break;
      case nt.LengthPrefixedString:
        s.push(nn(t));
        break;
      case nt.MemoString:
        s.push(Gg(t));
        break;
      case nt.AssetInfo:
        s.push(Tl(t));
        break;
      case nt.PostCondition:
        s.push(Z8(t));
        break;
      case nt.PublicKey:
        s.push(Ll(t));
        break;
      case nt.TransactionAuthField:
        s.push(G8(t));
        break;
    }
  return Ru(s, n);
}
function Y8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Rg(t.principal)), (t.conditionType === Pe.Fungible || t.conditionType === Pe.NonFungible) && e.push(Kg(t.assetInfo)), t.conditionType === Pe.NonFungible && e.push(se(t.assetName)), e.push(t.conditionCode), t.conditionType === Pe.STX || t.conditionType === Pe.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Kr("The post-condition amount may not be larger than 8 bytes");
    e.push(Mr(t.amount, !1, 8));
  }
  return oe(e);
}
function Z8(t) {
  const e = t.readUInt8Enum(Pe, (o) => {
    throw new Ge(`Could not read ${o} as PostConditionType`);
  }), n = W8(t);
  let r, s, i;
  switch (e) {
    case Pe.STX:
      return r = t.readUInt8Enum(Vi, (a) => {
        throw new Ge(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${vt(t.readBytes(8))}`), {
        type: nt.PostCondition,
        conditionType: Pe.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case Pe.Fungible:
      return s = Tl(t), r = t.readUInt8Enum(Vi, (a) => {
        throw new Ge(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${vt(t.readBytes(8))}`), {
        type: nt.PostCondition,
        conditionType: Pe.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case Pe.NonFungible:
      s = Tl(t);
      const o = rn(t);
      return r = t.readUInt8Enum(vl, (a) => {
        throw new Ge(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: nt.PostCondition,
        conditionType: Pe.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function _n(t, e) {
  return oe([t, e]);
}
function Q8(t) {
  return new Uint8Array([t.type]);
}
function J8(t) {
  return t.type === P.OptionalNone ? new Uint8Array([t.type]) : _n(t.type, se(t.value));
}
function t6(t) {
  const e = new Uint8Array(4);
  return gs(e, t.buffer.length, 0), _n(t.type, Va(e, t.buffer));
}
function e6(t) {
  const e = _u(cA(t.value, BigInt(AA)), vg);
  return _n(t.type, e);
}
function n6(t) {
  const e = _u(t.value, vg);
  return _n(t.type, e);
}
function r6(t) {
  return _n(t.type, io(t.address));
}
function s6(t) {
  return _n(t.type, Va(io(t.address), pi(t.contractName)));
}
function i6(t) {
  return _n(t.type, se(t.value));
}
function o6(t) {
  const e = [], n = new Uint8Array(4);
  gs(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = se(r);
    e.push(s);
  }
  return _n(t.type, oe(e));
}
function a6(t) {
  const e = [], n = new Uint8Array(4);
  gs(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = ys(s);
    e.push(pi(i));
    const o = se(t.data[s]);
    e.push(o);
  }
  return _n(t.type, oe(e));
}
function Wg(t, e) {
  const n = [], r = e == "ascii" ? Ag(t.data) : Si(t.data), s = new Uint8Array(4);
  return gs(s, r.length, 0), n.push(s), n.push(r), _n(t.type, oe(n));
}
function c6(t) {
  return Wg(t, "ascii");
}
function l6(t) {
  return Wg(t, "utf8");
}
function se(t) {
  switch (t.type) {
    case P.BoolTrue:
    case P.BoolFalse:
      return Q8(t);
    case P.OptionalNone:
    case P.OptionalSome:
      return J8(t);
    case P.Buffer:
      return t6(t);
    case P.UInt:
      return n6(t);
    case P.Int:
      return e6(t);
    case P.PrincipalStandard:
      return r6(t);
    case P.PrincipalContract:
      return s6(t);
    case P.ResponseOk:
    case P.ResponseErr:
      return i6(t);
    case P.List:
      return o6(t);
    case P.Tuple:
      return a6(t);
    case P.StringASCII:
      return c6(t);
    case P.StringUTF8:
      return l6(t);
    default:
      throw new Kr("Unable to serialize. Invalid Clarity Value.");
  }
}
function u6(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const eh = /* @__PURE__ */ new Map();
function Xg(t, e) {
  const n = eh.get(t);
  if (n !== void 0)
    return n(e);
  const r = u6(t);
  return eh.set(t, r), Xg(t, e);
}
class Hi {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return xA(this.readBytes(4), 0);
  }
  readUInt8() {
    return bA(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return yA(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = vt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = vt(n);
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
    if (Xg(e, r))
      return r;
    throw n(r);
  }
}
function rn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Hi(Yt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Hi(t) : e = t;
  switch (e.readUInt8Enum(P, (r) => {
    throw new Ge(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case P.Int:
      return v8(e.readBytes(16));
    case P.UInt:
      return Ln(e.readBytes(16));
    case P.Buffer:
      const r = e.readUInt32BE();
      return Hg(e.readBytes(r));
    case P.BoolTrue:
      return Ug();
    case P.BoolFalse:
      return Pg();
    case P.PrincipalStandard:
      const s = hi(e);
      return S8(s);
    case P.PrincipalContract:
      const i = hi(e), o = nn(e);
      return Ng(i, o);
    case P.ResponseOk:
      return k8(rn(e));
    case P.ResponseErr:
      return I8(rn(e));
    case P.OptionalNone:
      return Og();
    case P.OptionalSome:
      return Dg(rn(e));
    case P.List:
      const a = e.readUInt32BE(), c = [];
      for (let m = 0; m < a; m++)
        c.push(rn(e));
      return L8(c);
    case P.Tuple:
      const f = e.readUInt32BE(), d = {};
      for (let m = 0; m < f; m++) {
        const L = nn(e).content;
        if (L === void 0)
          throw new Ge('"content" is undefined');
        d[L] = rn(e);
      }
      return ws(d);
    case P.StringASCII:
      const l = e.readUInt32BE(), g = dA(e.readBytes(l));
      return be(g);
    case P.StringUTF8:
      const h = e.readUInt32BE(), x = Nu(e.readBytes(h));
      return C8(x);
    default:
      throw new Ge("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const f6 = (t) => t.length % 2 == 0 ? t : `0${t}`, d6 = (t, e) => t.padEnd(e, "0"), qg = (t, e) => t ? Si(t).length > e : !1;
function Ml(t) {
  return pp(t);
}
const Xi = (t) => jA(Du(t)), Ku = (t) => vt(b8(t)), h6 = (t) => vt(Xi(t)), p6 = (t) => {
  const e = Xi(t), n = Va(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Xi(n);
  return vt(r);
}, g6 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = oe(n), s = Xi(r);
  return vt(s);
}, y6 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = oe(n), s = Du(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = oe(i), a = Xi(o);
  return vt(a);
};
function w6(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Yg(t) {
  const e = se(t);
  return `0x${vt(e)}`;
}
function b6(t) {
  return rn(t);
}
const Zs = (t) => {
  try {
    return vs.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Vu() {
  return {
    type: nt.MessageSignature,
    data: vt(new Uint8Array(Wa))
  };
}
function Zg(t, e, n, r) {
  const s = zu(0, t, 1, [di(e)]).hash160, i = Ei(di(e)) ? Jt.Compressed : Jt.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Le(n, !1),
    fee: Le(r, !1),
    keyEncoding: i,
    signature: Vu()
  };
}
function qi(t) {
  return "signature" in t;
}
function nh(t) {
  return t === zt.SerializeP2SH || t === zt.SerializeP2WSH;
}
function m6(t) {
  return t === zt.SerializeP2SHNonSequential || t === zt.SerializeP2WSHNonSequential;
}
function rh(t) {
  const e = Ml(t);
  return e.nonce = 0, e.fee = 0, qi(e) ? e.signature = Vu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function x6(t) {
  const e = [
    t.hashMode,
    Yt(t.signer),
    Mr(t.nonce, !1, 8),
    Mr(t.fee, !1, 8),
    t.keyEncoding,
    ju(t.signature)
  ];
  return oe(e);
}
function S6(t) {
  const e = [
    t.hashMode,
    Yt(t.signer),
    Mr(t.nonce, !1, 8),
    Mr(t.fee, !1, 8)
  ], n = Ru(t.fields);
  e.push(Gu(n));
  const r = new Uint8Array(2);
  return wA(r, t.signaturesRequired, 0), e.push(r), oe(e);
}
function E6(t, e) {
  const n = vt(e.readBytes(20)), r = BigInt(`0x${vt(e.readBytes(8))}`), s = BigInt(`0x${vt(e.readBytes(8))}`), i = e.readUInt8Enum(Jt, (a) => {
    throw new Ge(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === zt.SerializeP2WPKH && i != Jt.Compressed)
    throw new Ge("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Bl(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function A6(t, e) {
  const n = vt(e.readBytes(20)), r = BigInt("0x" + vt(e.readBytes(8))), s = BigInt("0x" + vt(e.readBytes(8))), i = Vg(e, nt.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const f of i)
    switch (f.contents.type) {
      case nt.PublicKey:
        Ei(f.contents) || (o = !0);
        break;
      case nt.MessageSignature:
        if (f.pubKeyEncoding === Jt.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Zr("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === zt.SerializeP2WSH || t === zt.SerializeP2WSHNonSequential))
    throw new Zr("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function vc(t) {
  return qi(t) ? x6(t) : S6(t);
}
function Ic(t) {
  const e = t.readUInt8Enum(zt, (n) => {
    throw new Ge(`Could not parse ${n} as AddressHashMode`);
  });
  return e === zt.SerializeP2PKH || e === zt.SerializeP2WPKH ? E6(e, t) : A6(e, t);
}
function Qg(t, e, n, r) {
  const i = t + vt(new Uint8Array([e])) + vt(Mr(n, !1, 8)) + vt(Mr(r, !1, 8));
  if (Yt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Ku(Yt(i));
}
function Jg(t, e, n) {
  const r = 33 + Wa, s = Ei(e) ? Jt.Compressed : Jt.Uncompressed, i = t + f6(s.toString(16)) + n.data, o = Yt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Ku(o);
}
function $6(t, e, n, r, s) {
  const i = Qg(t, e, n, r), o = P8(s, i), a = H8(s), c = Jg(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function ty(t, e, n, r, s, i) {
  const o = Qg(t, e, n, r), a = di(B8(o, i, s)), c = Jg(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function v6() {
  const t = Zg(zt.SerializeP2PKH, "", 0, 0);
  return t.signer = V8().hash160, t.keyEncoding = Jt.Compressed, t.signature = Vu(), t;
}
function sh(t, e, n) {
  return qi(t) ? I6(t, e, n) : k6(t, e, n);
}
function I6(t, e, n) {
  const { pubKey: r, nextSigHash: s } = ty(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = zu(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Zr(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function k6(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case nt.PublicKey:
        Ei(c.contents) || (i = !0), r.push(c.contents);
        break;
      case nt.MessageSignature:
        c.pubKeyEncoding === Jt.Uncompressed && (i = !0);
        const { pubKey: f, nextSigHash: d } = ty(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (nh(t.hashMode) && (s = d), r.push(f), o += 1, o === 65536)
          throw new Zr("Too many signatures");
        break;
    }
  if (nh(t.hashMode) && o !== t.signaturesRequired || m6(t.hashMode) && o < t.signaturesRequired)
    throw new Zr("Incorrect number of signatures");
  if (i && (t.hashMode === zt.SerializeP2WSH || t.hashMode === zt.SerializeP2WSHNonSequential))
    throw new Zr("Uncompressed keys are not allowed in this hash mode");
  const a = zu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Zr(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function ey(t) {
  return {
    authType: ne.Standard,
    spendingCondition: t
  };
}
function ny(t, e) {
  return {
    authType: ne.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Zg(zt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function ih(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case ne.Standard:
        return ey(rh(t.spendingCondition));
      case ne.Sponsored:
        return ny(rh(t.spendingCondition), v6());
      default:
        throw new xa("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function L6(t, e) {
  switch (t.authType) {
    case ne.Standard:
      return sh(t.spendingCondition, e, ne.Standard);
    case ne.Sponsored:
      return sh(t.spendingCondition, e, ne.Standard);
    default:
      throw new xa("Invalid origin auth type");
  }
}
function C6(t, e) {
  switch (t.authType) {
    case ne.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Le(e, !1)
      };
      return { ...t, spendingCondition: n };
    case ne.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Le(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function B6(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Le(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function T6(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Le(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function M6(t, e) {
  const n = {
    ...e,
    nonce: Le(e.nonce, !1),
    fee: Le(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function _6(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case ne.Standard:
      e.push(vc(t.spendingCondition));
      break;
    case ne.Sponsored:
      e.push(vc(t.spendingCondition)), e.push(vc(t.sponsorSpendingCondition));
      break;
  }
  return oe(e);
}
function N6(t) {
  const e = t.readUInt8Enum(ne, (r) => {
    throw new Ge(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case ne.Standard:
      return n = Ic(t), ey(n);
    case ne.Sponsored:
      n = Ic(t);
      const r = Ic(t);
      return ny(n, r);
  }
}
class U6 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Le(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? SA, this.postConditionMode = i ?? fi.Deny, this.postConditions = s ?? Ru([]), o)
      this.anchorMode = IA(o);
    else
      switch (r.payloadType) {
        case Et.Coinbase:
        case Et.CoinbaseToAltRecipient:
        case Et.NakamotoCoinbase:
        case Et.PoisonMicroblock:
        case Et.TenureChange:
          this.anchorMode = Ue.OnChainOnly;
          break;
        case Et.ContractCall:
        case Et.SmartContract:
        case Et.VersionedSmartContract:
        case Et.TokenTransfer:
          this.anchorMode = Ue.Any;
          break;
      }
  }
  signBegin() {
    const e = Ml(this);
    return e.auth = ih(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Ml(this);
    return e.auth = ih(e.auth), e.txid();
  }
  verifyOrigin() {
    return L6(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, ne.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === ne.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, ne.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !qi(n)) {
      const r = Ei(e);
      n.fields.push(Xs(r ? Jt.Compressed : Jt.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = $6(n, r, e.fee, e.nonce, s);
    return qi(e) ? e.signature = i : e.fields.push(Xs(s.data.byteLength === $g ? Jt.Compressed : Jt.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return Ku(e);
  }
  setSponsor(e) {
    if (this.auth.authType != ne.Sponsored)
      throw new xa("Cannot sponsor sign a non-sponsored transaction");
    this.auth = M6(this.auth, e);
  }
  setFee(e) {
    this.auth = C6(this.auth, e);
  }
  setNonce(e) {
    this.auth = B6(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != ne.Sponsored)
      throw new xa("Cannot sponsor sign a non-sponsored transaction");
    this.auth = T6(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Kr('"version" is undefined');
    if (this.chainId === void 0)
      throw new Kr('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Kr('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Kr('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Kr('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return gs(n, this.chainId, 0), e.push(n), e.push(_6(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Gu(this.postConditions)), e.push(zg(this.payload)), oe(e);
  }
}
function Wu(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Hi(Yt(t.slice(2))) : e = new Hi(Yt(t)) : t instanceof Uint8Array ? e = new Hi(t) : e = t;
  const n = e.readUInt8Enum(wa, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = N6(e), i = e.readUInt8Enum(Ue, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(fi, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = Vg(e, nt.PostCondition), c = R8(e);
  return new U6(n, s, c, a, o, i, r);
}
const P6 = A8, Oi = Ln, H6 = Hg;
const O6 = /* @__PURE__ */ new Set([4001, -31001]), D6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], F6 = ["result", "data", "payload", "response", "params"], oh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Ya = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Cs = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Gn = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, j6 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), ry = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => j6(i, r)) === s
  );
}, sy = (t) => t ? ry(Cs()).some(
  (e) => {
    var n;
    return e.id === t && (Ya(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, iy = () => {
  if (typeof window > "u")
    return;
  const t = Cs(), e = ry(t).filter(
    (n) => {
      var r;
      return Ya(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Gn(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of D6) {
    const r = Gn(t, n) ?? (t === window ? void 0 : Gn(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, z6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Cs(), n = Gn(e, t) ?? (e === window ? void 0 : Gn(window, t)) ?? Pa(t);
  if (n)
    return n;
  if (Ya(t) || sy(t))
    return iy();
}, Fo = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, R6 = ["blockstack-session", "blockstack"], G6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of R6) {
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
G6();
const oy = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Re = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, K6 = (t) => {
  const e = Re(t);
  if (!e)
    return null;
  const n = oy(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, V6 = (t) => {
  const e = Re(t);
  if (!e)
    return null;
  const n = oy(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, _l = (t, e = "mainnet") => {
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
      return _l(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return _l(r, e);
  }
  return e;
}, es = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, Yi = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return Zs(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = Yi(s, e + 1);
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
    const i = Yi(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && Zs(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Zs(n.testnet) ? n.testnet.trim() : null;
}, ah = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, ay = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && O6.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, bs = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Re(n == null ? void 0 : n.message) ?? Re(e.message) ?? Re(e.error) ?? Re(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, gi = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw bs(e);
    if (e.status === "error")
      throw bs(e.result ?? e);
  }
  return t;
}, ch = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return gi(r);
  } catch (r) {
    throw bs(r);
  }
}, cy = () => iy(), Xu = () => {
  if (typeof window > "u")
    return;
  const t = Cs();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Gn(t, e) ?? (t === window ? void 0 : Gn(window, e));
    if (n)
      return n;
  }
}, lh = () => {
  if (typeof window > "u")
    return;
  const t = Xu();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Cs();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Gn(e, n) ?? (e === window ? void 0 : Gn(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Zo = (t) => {
  var r, s;
  const e = cs();
  if (Ya(e) || sy(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Cs() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === cy();
}, kc = (t) => {
  const e = V6(t);
  if (!e)
    return null;
  try {
    const n = Wu(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Sa = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = kc(t), r = K6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Re(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Sa(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of oh)
    if (kc(s[a])) {
      i = Re(s[a]);
      break;
    }
  const o = Re(s.txId) || Re(s.txid) || Re(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? Re(s.txRaw) ?? void 0
    };
  for (const a of oh) {
    const c = kc(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Re(s[a]) ?? void 0
      };
  }
  for (const a of F6) {
    const c = s[a], f = Sa(c, e + 1);
    if (f)
      return {
        ...s,
        ...c && typeof c == "object" ? c : {},
        ...f,
        txId: f.txId,
        txid: f.txid ?? f.txId
      };
  }
  return null;
}, Lc = (t) => {
  const e = Sa(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, W6 = (t) => {
  const e = Sa(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, X6 = (t) => ({
  ...t,
  fee: es(t.fee),
  nonce: es(t.nonce),
  sponsored: t.sponsored === !0
}), uh = (t) => ({
  recipient: t.recipient,
  amount: es(t.amount) ?? "0",
  memo: t.memo,
  network: _l(t.network),
  address: t.stxAddress,
  fee: es(t.fee),
  nonce: es(t.nonce),
  sponsored: t.sponsored ?? !1
}), ly = "WALLET_ADDRESS_MISMATCH", q6 = 45e3;
let Di = null;
const Nl = (t) => {
  t && (Di = { address: t, at: Date.now() });
}, Y6 = () => {
  Di = null;
}, Z6 = () => Di && Date.now() - Di.at <= q6 ? Di.address : null, Q6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, J6 = async (t) => {
  Y6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = gi(await t.request("wallet_connect")), n = Yi(e);
  return Nl(n), n;
}, t5 = async (t, e, n, r) => {
  try {
    return gi(await t.request(e, n));
  } catch (s) {
    const i = bs(s);
    if (!Q6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await J6(t);
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
        { code: o ? ly : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return gi(await t.request(e, n));
    } catch (a) {
      throw bs(a);
    }
  }
};
let fh = 3e4;
const e5 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${fh / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, fh);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, n5 = async (t, e, n) => {
  const r = (c, f) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${f}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: ly }
      );
    return c;
  }, s = Z6();
  if (s)
    return Fo(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  Fo(n, "account-read");
  try {
    const c = gi(
      await e5(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = Yi(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (ay(c))
      throw bs(c);
    Fo(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return Nl(i), r(i, "wallet_getAccount");
  let o;
  Fo(n, "account-reconnect");
  try {
    o = gi(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), bs(c);
  }
  const a = Yi(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Nl(a), r(a, "wallet_connect");
}, r5 = async (t, e) => {
  if (!Zo(t)) {
    const i = await ch(
      t,
      "stx_transferStx",
      uh(e)
    );
    return Lc(i);
  }
  const n = Xu();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await ch(
      n,
      "stx_transferStx",
      uh(e)
    );
    return Lc(i);
  }
  const r = cy();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await n5(r, e.stxAddress);
  const s = await t5(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: es(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: es(e.fee) } : {}
    },
    e.stxAddress
  );
  return Lc(s);
}, s5 = () => cs(), uy = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = cs(), e = t ? z6(t) : void 0;
  if (e)
    return e;
  const n = Cs() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, dh = (t, e) => {
  const n = uy(), r = X6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, W6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return Po(r, e);
  if (Zo(n) && !Xu()) {
    const s = lh();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: cs(),
        route: "legacy-transaction-request"
      }), Po(r, s);
  }
  return void r5(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (ah(s) && Zo(n)) {
      const a = lh();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: cs(),
          route: "legacy-transaction-request"
        }), Po(r, a);
        return;
      }
    }
    if (ah(s) && !Zo(n)) {
      Po(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), ay(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, hh = (t) => Yg(t).replace(/^0x/, ""), ph = "This wallet cannot sign messages. Try Xverse or Leather.", gh = (t) => typeof (t == null ? void 0 : t.request) == "function", yh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", i5 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, o5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function a5(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: hh(e.message),
    domain: hh(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function c5(t, e) {
  const n = await eA({
    domain: e.domain,
    message: e.message,
    network: Ga(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function wh(t) {
  var s, i;
  const e = s5() || "", n = /xverse/i.test(e);
  let r = uy();
  if (n && !yh(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (yh(r))
    try {
      return await c5(r, t);
    } catch (o) {
      if (n || !gh(r) || !o5(o)) throw o;
    }
  if (!n && gh(r))
    try {
      return await a5(r, t);
    } catch (o) {
      throw i5(o) ? new Error(ph) : o;
    }
  throw new Error(ph);
}
const bh = 1000000n, Qr = 1000000n, Ul = 50n, _r = 3000n, oo = 300n, jo = 3000n, l5 = 50000n, Cc = 200n, Nr = (t) => t + Ul;
function an(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / bh}.${(n % bh).toString().padStart(6, "0")}`;
}
function mh(t, e = oo) {
  return t <= _r ? 0 : Number((t - _r) / Nr(e));
}
function Bc(t, e = 0n) {
  const n = Qr - t - e;
  return n > 0n ? n : 0n;
}
function u5(t, e = oo) {
  return t > Qr ? "over" : t < _r + Nr(e) ? "empty" : t < l5 ? "low" : "ok";
}
const f5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", d5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", h5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function p5(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || h5.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== f5 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const fy = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Tc = 3, g5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [Pl, dy] = fy.split("."), Je = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function Hl(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function y5(t) {
  return Je(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Br(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function hy(t, e = []) {
  const n = await Br(`/v2/contracts/call-read/${Pl}/${dy}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Pl, arguments: e.map((r) => "0x" + Je(se(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return zn(rn(n.result));
}
async function w5() {
  const t = await Br(`/v2/contracts/source/${Pl}/${dy}?proof=0`);
  if (typeof t.source != "string" || await y5(t.source) !== d5) throw Error("Deployed source does not match the tested helper.");
  if (p5(await hy("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function py(t) {
  return t.startsWith("SP") && Zs(t) && !t.includes(".");
}
async function b5(t) {
  var r;
  if (!py(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Br(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Br(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function m5(t) {
  const e = await Br(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function x5(t, e) {
  var s, i;
  const n = await hy("get-owner", [Oi(t), Oi(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !py(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function S5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Hl(t), signal: AbortSignal.timeout(15e3) });
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
async function E5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function A5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Wu(Hl(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || Ws(Mi(ba.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || Ws(r.contractAddress) + "." + r.contractName.content !== fy || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Je(se(r.functionArgs[0])) !== Je(se(Oi(t.core))) || Je(se(r.functionArgs[1])) !== Je(se(Oi(t.song))) || Je(se(r.functionArgs[2])) !== Je(se(H6(Hl(t.id)))) || t.amount !== "50" || e.postConditionMode !== fi.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== Vi.Equal || i.principal.prefix !== 2 || Ws(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || Ws(r.contractAddress) + "." + r.contractName.content !== g5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Je(se(r.functionArgs[0])) !== Je(se(Oi(t.song))) || typeof t.liked != "boolean" || Je(se(r.functionArgs[1])) !== Je(se(P6(t.liked))) || t.amount !== "0" || e.postConditionMode !== fi.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || zn(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const $5 = "xtrata.xyz/radio/listening-wallet", v5 = "Link a temporary listening wallet for pay-per-play; no spending permission", ms = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && Zs(t), I5 = (t) => ({
  domain: ws({ name: be($5), version: be("1"), "chain-id": Ln(1) }),
  message: ws({
    purpose: be(v5),
    main: be(t.main),
    listening: be(t.listening),
    issued: Ln(t.issued)
  })
}), gy = 100000n, k5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function L5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !ms(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= gy).sort(k5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const zo = 50;
function Ea(t) {
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
async function C5(t, e, n = 4) {
  if (!ms(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${zo}&offset=${o}`, s = Ea(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - zo);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= zo ? s : Ea(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = L5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - zo);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const On = 50, B5 = 6, T5 = 20, xh = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function Sh(t, e) {
  const n = t;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], s = [];
  for (const i of n.results) {
    const o = i && typeof i == "object" && i.tx && typeof i.tx == "object" ? i.tx : i;
    if (!o || typeof o.tx_id != "string" || typeof o.tx_type != "string") return null;
    if (s.push(o.tx_id), o.tx_type !== "token_transfer" || o.sender_address !== e || o.tx_status !== "success") continue;
    const a = o.token_transfer;
    if (!a || typeof a.recipient_address != "string" || typeof a.amount != "string" || !/^\d+$/.test(a.amount)) return null;
    const c = Number(o.block_height), f = Number(o.tx_index ?? 0);
    if (!Number.isSafeInteger(c) || !Number.isSafeInteger(f)) return null;
    r.push({ recipient: a.recipient_address, amount: BigInt(a.amount), txId: o.tx_id, blockHeight: c, txIndex: f });
  }
  return { total: n.total, sent: r, rows: s };
}
async function M5(t, e, n) {
  if (!ms(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = Ea(await e(`/extended/v1/address/${t}/stx_inbound?limit=${On}&offset=0`));
    if (!s || s.total > B5 * On) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = On; o < s.total; o += On) {
      const a = Ea(await e(`/extended/v1/address/${t}/stx_inbound?limit=${On}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (f) => `/extended/v1/address/${t}/transactions?limit=${On}&offset=${f}`, a = Sh(await e(o(0)), t);
      if (!a || a.total > T5 * On) return { ok: !1 };
      const c = new Set(a.rows);
      for (const f of a.sent) i.set(f.txId, f);
      for (let f = On; f < a.total; f += On) {
        const d = Sh(await e(o(f)), t);
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
function _5(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(xh).map((l, g) => {
    const h = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: h, kind: "gift", to: r.payer, at: g } : ms(l.sender) && h >= gy ? { sender: l.sender, left: h, kind: "deposit", to: l.sender, at: g } : { sender: l.sender, left: h, kind: "dust", to: null, at: g };
  }), i = s.reduce((l, g) => l + g.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && ms(l.recipient) && l.amount > 0n).sort(xh), a = o.reduce((l, g) => l + g.amount, 0n), c = i - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const f = (l, g) => {
    let h = g;
    for (const x of l) {
      if (h <= 0n) break;
      const m = x.left < h ? x.left : h;
      x.left -= m, h -= m;
    }
    return h;
  };
  for (const l of o) {
    const g = f(s.filter((h) => h.to === l.recipient), l.amount);
    g > 0n && f(s, g);
  }
  if (f(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((l, g) => l + g.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const d = /* @__PURE__ */ new Map();
  for (const l of s) {
    if (l.left <= 0n) continue;
    const g = `${l.kind}:${l.to ?? ""}`, h = d.get(g);
    h ? (h.amount += l.left, h.newest = Math.max(h.newest, l.at)) : d.set(g, { to: l.to, kind: l.kind, amount: l.left, newest: l.at });
  }
  return {
    ok: !0,
    parts: [...d.values()].sort((l, g) => l.newest - g.newest),
    hasTopUp: s.some((l) => l.kind === "deposit")
  };
}
function N5(t, e) {
  const n = t.filter((f) => f.kind === "deposit").sort((f, d) => f.newest - d.newest), r = t.find((f) => f.kind === "gift"), s = t.filter((f) => f.kind === "dust"), i = ((r == null ? void 0 : r.amount) ?? 0n) + s.reduce((f, d) => f + d.amount, 0n), o = [], a = [], c = i > e;
  return n.forEach((f, d) => {
    if (f.amount <= e) {
      a.push(f);
      return;
    }
    const l = d === n.length - 1 && !c;
    o.push({ to: f.to, kind: "deposit", mode: l ? "all" : "amount", send: f.amount - e });
  }), c ? o.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: i - e }) : (r && a.push(r), a.push(...s)), { steps: o, tooSmall: a };
}
function Eh(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const Ci = ["prepared", "signed", "unknown", "pending"], U5 = 30 * 6e4, js = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, P5 = 3e3, Ah = "Your main listener wallet is out of funds, so likes are paused. Top it up (it only needs a little) and your likes carry on.", $h = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function H5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, f = null, d = !1, l = !1, g = !1, h = null, x = !1, m = "", L = "", b, T = null, w, B = [], C, D = -1 / 0;
  const q = /* @__PURE__ */ new Set();
  let O = null, W = !1, S = 0, $ = null, H = null, Y = !1, et = null, X = !1, $t = null, le = !1, de = !1, A = !1, N = !1, yt = !1, ot = 0, ct = null, Dt = Promise.resolve();
  const Zt = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? oo.toString()), Vt = (y) => !!i && !(i.features ?? []).includes(y), Tt = (y, k) => `xtrata.ppp.v1.${y}:${k}`, ae = (y = i == null ? void 0 : i.address) => {
    if (!y) return [];
    try {
      const k = JSON.parse(t.store.get(Tt("entries", y)) || "[]");
      return Array.isArray(k) ? k : [];
    } catch {
      return [];
    }
  }, te = (y) => {
    const k = [y, ...ae(y.address).filter((F) => !(F.txid === y.txid && F.kind === y.kind))].slice(0, 200);
    t.store.set(Tt("entries", y.address), JSON.stringify(k));
  }, gn = (y = i == null ? void 0 : i.address) => !!y && t.store.get(Tt("on", y)) !== "0", M = (y) => {
    i != null && i.address && t.store.set(Tt("on", i.address), y ? "1" : "0");
  }, R = () => ae().filter((y) => Ci.includes(y.status)), z = () => Nt() ? [...R(), ...ae(Ct()).filter((y) => Ci.includes(y.status))] : R(), rt = () => at(i == null ? void 0 : i.address), at = (y) => {
    if (!y) return null;
    try {
      return JSON.parse(t.store.get(Tt("deposit", y)) || "null");
    } catch {
      return null;
    }
  }, Ot = (y, k = i == null ? void 0 : i.address) => {
    k && t.store.set(Tt("deposit", k), JSON.stringify(y));
  }, Ct = () => Vt("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), Nt = () => !!(i != null && i.address) && Ct() !== i.address, Wt = () => Nt() ? c && c.for === Ct() ? c.value : void 0 : o, ge = (y) => y !== void 0 && y < _r + Cc, ye = () => R().filter((y) => t.now() - y.created > U5 && q.has(y.txid)), Kt = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), u = () => Kt() && !(i != null && i.linked), E = () => {
    const y = t.main();
    return !u() && !!y && !!(i != null && i.linked) && i.linked !== y;
  }, v = (y) => Tt("return-to", y), U = (y = i == null ? void 0 : i.address) => {
    if (!y) return;
    const k = t.store.get(v(y));
    return k && ms(k) && k !== y ? k : void 0;
  }, Q = (y = i == null ? void 0 : i.address) => O && O.for === y ? O.res : null;
  function ft() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const y = U();
    if (y) return { to: y, kind: "chosen" };
    const k = Q();
    if (k != null && k.ok && k.funder) return { to: k.funder, kind: "funder" };
  }
  const Rt = (y) => Tt("gift", y);
  function Pt() {
    const y = i == null ? void 0 : i.address;
    if (!y) return null;
    if ((et == null ? void 0 : et.for) === y) return et.info;
    try {
      const k = JSON.parse(t.store.get(Rt(y)) || "null");
      return k && typeof k.returnTo == "string" && typeof k.treasury == "string" ? k : null;
    } catch {
      return null;
    }
  }
  async function Oe() {
    var J;
    const y = i == null ? void 0 : i.address;
    if (!y || !t.giftInfo || !((J = e == null ? void 0 : e.gifts) != null && J.enabled) || X) return;
    const k = (et == null ? void 0 : et.for) === y ? et : null, F = k ? k.ok ? k.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (k && t.now() - k.at < F) return;
    X = !0;
    const Z = Pt();
    try {
      const G = await t.giftInfo(y);
      et = { for: y, info: G, ok: !0, at: t.now() }, t.store.set(Rt(y), JSON.stringify(G));
    } catch {
      et = { for: y, info: Z, ok: !1, at: t.now() };
    } finally {
      X = !1;
    }
  }
  const Bs = () => ae().reduce((y, k) => Ci.includes(k.status) ? y + BigInt(k.amount || "0") + BigInt(k.fee || "0") : y, 0n);
  function Xn() {
    if (o === void 0) return 0;
    const y = o - Bs() - BigInt(ue.length) * Nr(Zt());
    return y > 0n ? mh(y, Zt()) : 0;
  }
  const Nn = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING";
  function Ae() {
    var k;
    if (!((k = Pt()) != null && k.player)) return null;
    const y = (F, Z) => ({ reason: F, text: Z });
    switch (_t()) {
      case "connect":
      case "wrong-wallet":
        return y("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "locked":
        return y("locked", "UNLOCK TO LISTEN");
      case "link":
        return y("link", "FINISH SETUP TO LISTEN");
      case "over":
        return y("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return rt() ? y("arriving", "YOUR PLAYS ARE ARRIVING") : y("out", Nn);
      case "ready":
        return !gn() || !(i != null && i.session) || i.session.playsLeft < 1 ? y("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : A ? Xn() < 1 ? y("out", Nn) : null : y("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const Pr = 3 * 6e4, sn = () => !!Pt() && !!t.history && !(i != null && i.linked);
  async function lt() {
    const y = i.address, k = Pt(), { balance: F, nonce: Z } = await t.chain.account(y), J = await t.history(y, !0);
    if (!J.ok) return null;
    const G = _5({ self: y, balance: F, inbound: J.inbound, outgoing: J.outgoing, gift: { sender: k.treasury, payer: k.returnTo } });
    if (!G.ok) return null;
    const dt = N5(G.parts, jo);
    return { balance: F, nonce: Z, parts: G.parts, steps: dt.steps, tooSmall: dt.tooSmall.length };
  }
  const Mt = () => le ? { state: "unavailable" } : !$t || t.now() - $t.at > Pr || o !== void 0 && o !== $t.balance ? { state: "none" } : $t.plan;
  function _t() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const y = t.main();
    if (!u()) {
      if (!y) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : E() ? "wrong-wallet" : i.state === "known" ? "locked" : !u() && i.linked !== y ? "link" : o === void 0 ? "loading" : o > Qr ? "over" : o < _r + Nr(Zt()) ? "fund" : "ready" : "loading";
  }
  const De = () => {
    var y, k, F, Z;
    return {
      step: _t(),
      busy: f,
      message: m,
      error: L,
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : u5(o, Zt()),
      playsLeft: o === void 0 ? 0 : mh(o, Zt()),
      allowance: o === void 0 ? Qr : Bc(o, BigInt(((y = rt()) == null ? void 0 : y.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: gn(),
      entries: ae(),
      depositTxid: ((k = rt()) == null ? void 0 : k.txid) ?? b,
      depositPending: !!rt(),
      walletOutdated: Vt("like"),
      linkedListening: C && C === t.main() ? B.map((J) => J.listening) : [],
      serverLinked: !!T && w === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: ye().length,
      armed: N,
      queued: ue.length,
      solo: u(),
      returnTo: (F = ft()) == null ? void 0 : F.to,
      returnToKind: (Z = ft()) == null ? void 0 : Z.kind,
      funderState: (() => {
        const J = Q();
        return J ? J.ok ? J.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const J = Q();
        return !!J && J.ok && J.distinct > 1;
      })(),
      walletCannotSolo: u() && Vt("standalone"),
      walletCannotMulti: Vt("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((J) => J !== t.main() && J !== (i == null ? void 0 : i.linked)),
      creditedTo: u() && (i != null && i.address) && ($ == null ? void 0 : $.for) === i.address && $.main ? $.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(Tt("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (H == null ? void 0 : H.for) === i.address && H.unused,
      gift: (() => {
        const J = Pt();
        return J ? { player: J.player, from: J.from, source: J.source, amount: J.amount } : null;
      })(),
      giftPlays: Pt() ? Xn() : 0,
      giftStop: Ae(),
      returnPlan: Mt(),
      likeFunds: (() => {
        var dt;
        const J = Ct();
        if (!J || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const G = Wt();
        return { address: J, balance: G, low: ge(G), album: Nt(), pending: !!at(J), txid: (dt = at(J)) == null ? void 0 : dt.txid, main: t.main() };
      })()
    };
  }, kt = (y, k = "") => {
    m = y, L = k, t.changed();
  };
  async function Ce(y, k) {
    if (!f) {
      f = y, L = "", t.changed();
      try {
        await k();
      } catch (F) {
        const Z = F instanceof Error ? F.message : String(F);
        L = /Cancelled in the listening wallet/.test(Z) ? "" : Z, L || (m = "Not now. Nothing was signed.", yt = !0);
      } finally {
        f = null, await qe(!0);
      }
    }
  }
  const Hr = () => !!(e != null && e.enabled) && e.here && (u() || !!t.main() && e.allowed), yn = () => Hr() && !E(), qn = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Yn = () => {
    if (E()) throw new Error(qn());
  };
  async function Un() {
    if (!Hr()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const Xe = (y) => {
    const k = t.main();
    return y.request("listening.status", k ? { main: k } : void 0);
  };
  async function Be(y = !1) {
    i != null && i.address && (!y && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now(), await Zn(y)));
  }
  async function Zn(y = !1) {
    const k = Ct();
    if (!(!Nt() || !k || (i == null ? void 0 : i.state) !== "unlocked") && !(!y && (c == null ? void 0 : c.for) === k && t.now() - c.at < 3e4))
      try {
        c = { for: k, value: await t.chain.balance(k), at: t.now() };
      } catch {
      }
  }
  async function Ts(y) {
    if ((C !== y || t.now() - D >= 6e4) && (B = await t.links(y), C = y, D = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === y) return;
    const k = `${y}:${i.address}`;
    w === k && T || (T = B.find((F) => F.listening === i.address) ?? null, w = k);
  }
  async function Ms() {
    const y = i == null ? void 0 : i.address;
    if (!u() || !y || i != null && i.linked || !t.funder || W || !o || o <= 0n) return;
    const k = Q(y);
    if (k != null && k.ok && k.funder) return;
    const F = k != null && k.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, S - 1), 30 * 6e4);
    if (!(O && O.for === y && t.now() - O.at < F)) {
      W = !0;
      try {
        O = { for: y, res: await t.funder(y), at: t.now() };
      } catch {
        O = { for: y, res: { ok: !1 }, at: t.now() };
      } finally {
        W = !1;
      }
      S = O.res.ok ? 0 : S + 1;
    }
  }
  async function _s() {
    const y = i == null ? void 0 : i.address;
    if (!(!u() || !y || i != null && i.linked || !t.mainOf || Y) && !($ && $.for === y && ($.ok || t.now() - $.at < 6e4))) {
      Y = !0;
      try {
        $ = { for: y, main: await t.mainOf(y), ok: !0, at: t.now() };
      } catch {
        $ = { for: y, main: null, ok: !1, at: t.now() };
      } finally {
        Y = !1;
      }
    }
  }
  async function Ns() {
    const y = i == null ? void 0 : i.address;
    if (!(!y || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (H == null ? void 0 : H.for) === y) && t.store.get(Tt("created", y)) !== "1")
      try {
        H = { for: y, unused: await t.chain.confirmedNonce(y) === 0n };
      } catch {
      }
  }
  async function Te() {
    var J;
    const y = i == null ? void 0 : i.address;
    if (!y) return !1;
    let k, F = !1;
    const Z = /* @__PURE__ */ new Map();
    for (const G of z())
      try {
        const dt = await t.chain.transaction(G.txid);
        if (!dt) {
          if (q.add(G.txid), t.now() - G.created > 15 * 6e4 && !Z.has(G.address) && Z.set(G.address, await t.chain.confirmedNonce(G.address)), k = Z.get(G.address), k !== void 0 && k > BigInt(G.nonce)) {
            te({ ...G, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((G.status === "unknown" || G.status === "signed") && G.raw)
            try {
              await t.chain.broadcast(G.raw, G.txid), te({ ...G, status: "pending" });
            } catch (ht) {
              js(ht) && te({ ...G, status: "failed", note: ht.message, raw: void 0 });
            }
          continue;
        }
        q.delete(G.txid);
        const ut = String(dt.tx_status);
        if (ut === "success" && dt.canonical !== !1 && dt.is_unanchored === !1) {
          if (te({ ...G, status: "confirmed", confirmedAt: t.now(), actualFee: String(dt.fee_rate ?? G.fee), raw: void 0 }), F = !0, G.kind === "like" && (x = !0, G.status !== "confirmed" && typeof G.liked == "boolean"))
            try {
              (J = t.likeConfirmed) == null || J.call(t, G.song, G.liked);
            } catch {
            }
        } else ut.startsWith("abort_") || ut.startsWith("dropped_") ? te({ ...G, status: "failed", note: ut, raw: void 0 }) : G.status !== "pending" && te({ ...G, status: "pending" });
      } catch {
      }
    for (const G of Nt() ? [y, Ct()] : [y]) {
      const dt = at(G);
      if (dt)
        try {
          const ut = await t.chain.transaction(dt.txid), ht = String((ut == null ? void 0 : ut.tx_status) ?? "");
          (ht === "success" && ut.is_unanchored === !1 || ht.startsWith("abort_") || ht.startsWith("dropped_") || !ut && t.now() - dt.at > 2 * 36e5) && (Ot(null, G), a = -1 / 0, c = null, /on its way/i.test(m) && (m = ""));
        } catch {
        }
    }
    return F;
  }
  async function qe(y = !1) {
    var k;
    try {
      const F = t.main();
      if ((y || !e || r !== F || t.now() - n > 3e5) && (e = await t.config(F), n = t.now(), r = F), !e.enabled || !e.here || !u() && (!F || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), N && ce(), t.changed();
        return;
      }
      await Un(), i = await Xe(s), E() && i.state === "unlocked" && (Ai(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await Xe(s)), F && e.allowed && await Ts(F), await Be(y), await Ms(), await _s(), await Ns(), await Oe(), await Te() && await Be(!0), await Zn();
    } catch (F) {
      L = F instanceof Error ? F.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    if (_t() === "locked" ? st() : N && ce(), x) {
      x = !1;
      try {
        (k = t.likesChanged) == null || k.call(t);
      } catch {
      }
    }
    t.changed(), ue.length && !Ps && $i();
  }
  async function j(y, k) {
    var G;
    Yn();
    const F = !(i != null && i.address) || gn(i.address), Z = i != null && i.linked ? (G = t.nameOf) == null ? void 0 : G.call(t, i.linked) : void 0;
    await y.request("listening.unlock", { mode: "unlock", terms: F ? he() : void 0, anyPasskey: k, ...t.main() ? { main: t.main() } : {}, ...Z ? { label: Z } : {} }), i = await Xe(y), F && (gn(i.address) ? await Ye() : await y.request("listening.stop")), kt(F ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const J = h;
    h = null, J && t.now() - J.at < 12e4 && setTimeout(() => void qe(!0).then(() => Jn(J)), 0);
  }
  function st() {
    N || f || yt || ot >= 3 || !s || !(i != null && i.address) || (N = !0, Dt = (async () => {
      try {
        await j(s, !1), ot = 0;
      } catch (y) {
        const k = y instanceof Error ? y.message : String(y);
        /Cancelled in the listening wallet/.test(k) ? ct || (yt = !0, kt("Not now. Nothing was signed.")) : /did not answer/.test(k) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (ot++, L = k);
      } finally {
        N = !1;
        const y = ct;
        ct = null, y ? await y() : await qe(!0);
      }
    })());
  }
  async function ce(y) {
    N && (ct = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await Dt), y && await y(), t.changed();
  }
  const he = () => ({
    fee: Zt().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Qr.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function Ye() {
    if (!(i != null && i.address)) return !1;
    if (A || (A = await t.tabLock(i.address)), !A)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function Or(y, k) {
    const F = i.address, { balance: Z, nonce: J } = k ?? await t.chain.account(F);
    o = Z;
    const G = await s.request("listening.prepareReturn", {
      mode: y.mode,
      balance: Z.toString(),
      nonce: J.toString(),
      fee: jo.toString(),
      ...y.amount !== void 0 ? { amount: y.amount.toString() } : {},
      ...y.linked ? {} : { destination: y.to }
    });
    if (G.recipient !== y.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const dt = y.mode === "amount" ? y.amount : y.mode === "all" ? Z - jo : Z - Qr - jo, ut = Wu(G.raw);
    if (zn(ut.payload.recipient).value !== y.to || String(ut.payload.amount) !== G.amount || dt !== void 0 && G.amount !== dt.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const ht = {
      id: $h(),
      address: F,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: G.recipient,
      amount: G.amount,
      fee: G.fee,
      nonce: J.toString(),
      created: t.now(),
      status: "signed",
      raw: G.raw,
      txid: G.txid
    };
    t.validate(ht), te(ht);
    try {
      await t.chain.broadcast(G.raw, G.txid), te({ ...ht, status: "pending" });
    } catch (xe) {
      throw te({ ...ht, status: "unknown", note: xe.message }), xe;
    }
    return G;
  }
  async function Us(y) {
    if (R().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Vt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const k = await lt().catch(() => null);
    if (!k)
      throw $t = null, le = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    le = !1, o = k.balance;
    const F = { balance: k.balance, nonce: k.nonce };
    if (y === "excess") {
      const ut = Eh(k.parts) ?? U();
      if (!ut) throw new Error("Choose where to send the excess first.");
      await Or({ mode: "excess", to: ut, linked: !1 }, F), $t = null, kt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const Z = k.steps;
    if (!Z.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!$t && $t.balance === k.balance && t.now() - $t.at <= Pr && $t.steps.length === Z.length && $t.steps.every((ut, ht) => ut.to === Z[ht].to && ut.mode === Z[ht].mode && ut.send === Z[ht].send))) {
      $t = {
        at: t.now(),
        balance: k.balance,
        steps: Z,
        parts: k.parts,
        plan: { state: "ready", steps: Z.map((ut) => ({ to: ut.to, kind: ut.kind, send: ut.send.toString() })), kept: k.tooSmall, excess: Eh(k.parts) }
      }, kt(Z.length > 1 ? `This goes back in ${Z.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const G = Z[0], dt = G.to ?? U();
    if (!dt) throw new Error("Choose where to send the rest first.");
    if (G.mode === "amount" && Vt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await Or({ mode: G.mode, to: dt, linked: !1, ...G.mode === "amount" ? { amount: G.send } : {} }, F), $t = null, Z.length === 1 ? (M(!1), kt("Returned ✓ Paying is off.")) : kt(`Returned ✓ ${Z.length - 1} more ${Z.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const Za = {
    forceRefresh: () => qe(!0),
    create: () => Ce("Waiting for your passkey…", async () => {
      const y = await Un();
      await y.request("listening.unlock", { mode: "create", terms: he(), ...t.main() ? { main: t.main() } : {} }), i = await Xe(y), i.address && t.store.set(Tt("created", i.address), "1"), M(!0), kt(u() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Ye();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    giftSent: (y, k) => {
      !(i != null && i.address) || rt() || (Ot({ txid: y, amount: k.toString(), at: t.now() }), a = -1 / 0, et = null, kt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    unlock: (y = !1) => {
      const k = () => Ce("Waiting for your passkey…", async () => j(await Un(), y));
      return N ? y ? Vt("cancel") ? (kt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : ce(async () => {
        (_t() === "locked" || _t() === "intro") && await k();
      }) : Dt : k();
    },
    link: () => Ce("Sign in your wallet…", async () => {
      Yn();
      const y = t.main();
      if (!y || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const k = (await t.links(y)).find((F) => F.listening === i.address);
      if (k)
        await s.request("listening.link", { main: y, issued: k.issued, mainSignature: k.mainSignature });
      else {
        const F = { main: y, listening: i.address, issued: t.now() }, Z = await t.signWithMain(y, I5(F)), J = await s.request("listening.link", { main: y, issued: F.issued, mainSignature: Z });
        await t.saveLink({ ...F, mainSignature: Z, listeningSignature: J.listeningSignature }), D = -1 / 0;
      }
      kt("Linked ✓");
    }),
    deposit: () => Ce("Approve the deposit in your wallet…", async () => {
      Yn();
      const y = t.main();
      if (!y || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (rt()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Be(!0);
      const k = Bc(o ?? 0n);
      if (k <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      b = await t.deposit(y, i.address, k), b && Ot({ txid: b, amount: k.toString(), at: t.now() }), kt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Ce("Approve the top-up in your wallet…", async () => {
      Yn();
      const y = t.main(), k = Ct();
      if (!y || !k) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (at(k)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const F = await t.chain.balance(k);
      Nt() ? c = { for: k, value: F, at: t.now() } : (o = F, a = t.now());
      const Z = Bc(F);
      if (Z <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const J = await t.deposit(y, k, Z);
      J && Ot({ txid: J, amount: Z.toString(), at: t.now() }, k), kt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    switchOn: () => Ce("Confirm in the listening wallet…", async () => {
      if (!yn()) throw new Error("Connect your wallet first.");
      await Ye(), await s.request("listening.approveSession", he()), M(!0), kt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Ce("Clearing…", async () => {
      for (const y of ye())
        await t.chain.transaction(y.txid) || te({ ...y, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      kt("Cleared ✓");
    }),
    switchOff: () => Ce("Switching off…", async () => {
      Ai(), await (s == null ? void 0 : s.request("listening.stop")), M(!1), kt("Paying is off. Music stays free.");
    }),
    lock: () => Ce("Locking…", async () => {
      Ai(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, kt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (y) => {
      const k = String(y ?? "").trim();
      if (!(i != null && i.address)) return kt("", "Unlock the listening wallet first.");
      if (!ms(k)) return kt("", "Enter a standard mainnet address (it starts with SP).");
      if (k === i.address) return kt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(v(i.address), k), kt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(v(i.address), ""), t.changed();
    },
    returnFunds: (y) => Ce("Check the return in the listening wallet…", async () => {
      if (!yn()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (sn()) return Us(y);
      const k = ft();
      if (!k) throw new Error(u() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (k.kind !== "linked" && Vt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (R().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await Or({ mode: y, to: k.to, linked: k.kind === "linked" }), y === "all" && M(!1), kt(y === "all" ? k.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, ue = [], Qa = 10, Qn = 30 * 6e4;
  let Ps = !1;
  const ao = () => d || !!f || l || g, Ai = () => {
    ue.length && (ue.length = 0, t.changed());
  };
  async function Ja(y) {
    if (!ue.some((k) => k.id === y.id) && !ae().some((k) => k.id === y.id) && (ue.push({ ...y, at: t.now() }), ue.length > Qa && ue.shift()), ao() || R().length) {
      const k = ue.length;
      m = `Queued ${k === 1 ? "this song" : k + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await $i();
  }
  async function $i() {
    if (!Ps) {
      Ps = !0;
      try {
        for (; ue.length; ) {
          for (; ue.length && t.now() - ue[0].at > Qn; ) ue.shift();
          if (!ue.length || ao() || await tc(ue[0]) === "wait") return;
          ue.shift();
        }
      } finally {
        Ps = !1, t.changed();
      }
    }
  }
  async function tc(y) {
    var k;
    d = !0;
    try {
      await qe();
      const F = _t();
      if (F === "loading") return "wait";
      if (F !== "ready" || !gn() || !(i != null && i.session) || i.session.playsLeft < 1 || !A) return "done";
      if (R().length) return "wait";
      de || (await t.chain.verify(), de = !0);
      const Z = i.address, { balance: J, nonce: G } = await t.chain.account(Z);
      o = J, a = t.now();
      const dt = await t.chain.owner(Tc, y.song);
      if (dt === Z || dt === t.main()) return "done";
      const ut = await s.request("listening.signPlay", {
        core: Tc,
        song: y.song,
        receipt: y.id,
        fee: Zt().toString(),
        nonce: G.toString(),
        balance: J.toString()
      }), ht = {
        id: y.id,
        address: Z,
        kind: "play",
        core: Tc,
        song: y.song,
        recipient: dt,
        amount: "50",
        fee: Zt().toString(),
        nonce: G.toString(),
        created: t.now(),
        status: "signed",
        raw: ut.raw,
        txid: ut.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...y.title ? { title: String(y.title).slice(0, 120) } : {},
        ...y.artist ? { artist: String(y.artist).slice(0, 120) } : {}
      };
      t.validate(ht), te(ht);
      const xe = y.title ? `“${y.title}”${y.artist ? ` by ${y.artist}` : ""}` : `song #${y.song}`;
      try {
        await t.chain.broadcast(ut.raw, ut.txid), te({ ...ht, status: "pending" }), m = `♪ Paid ${xe}`, L = "";
      } catch (Me) {
        te({ ...ht, status: js(Me) ? "failed" : "unknown", note: Me.message, ...js(Me) ? { raw: void 0 } : {} }), L = Me.message;
      }
      return i = await Xe(s), "done";
    } catch (F) {
      const Z = F instanceof Error ? F.message : "payment unavailable";
      return (k = Pt()) != null && k.player ? (m = "Payment is taking a moment: " + Z, "wait") : (m = "This song played free: " + Z, "done");
    } finally {
      d = !1, t.changed();
    }
  }
  function co(y) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(_t()) || Vt("like") ? !1 : (Jn(y), !0);
  }
  async function Jn(y) {
    const k = y.title ? `“${y.title}”` : `song #${y.song}`, F = (wn) => {
      var lo;
      L = wn, m = "";
      try {
        (lo = t.likeFailed) == null || lo.call(t, y.song);
      } catch {
      }
      t.changed();
    }, Z = Nt(), J = _t(), G = t.main(), dt = Z && (J === "fund" || J === "over") ? "ready" : J, ut = u() ? Ct() : G;
    if (dt === "locked") {
      h = { ...y, at: t.now() }, kt(`Unlock to like ${k}. It sends straight after.`);
      return;
    }
    if (dt === "wrong-wallet") return F(qn());
    if (dt === "link") return F("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (u() && Vt("standalone")) return F("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (dt === "fund") return F("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (dt === "over") return F("Return the excess first: the listening wallet holds more than 1 STX.");
    if (Z) {
      await Zn(!0);
      const wn = Wt();
      if (ge(wn))
        return t.changed(), F(Ah);
    }
    if (dt !== "ready" || !ut) return F("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return F("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!A) return F("Pay-per-play is running in another tab. Like from that tab.");
    const ht = ae(Ct()).find((wn) => wn.kind === "like" && wn.song === y.song);
    if (ht && Ci.includes(ht.status))
      return F(`Your last like for ${k} is still on its way. It can change again once it confirms.`);
    if (l) return F("One like at a time: your last one is still being sent.");
    if ((ht == null ? void 0 : ht.status) === "confirmed" && t.now() - (ht.confirmedAt ?? 0) < P5)
      return F(`Your like for ${k} has only just confirmed. Try again in a moment.`);
    let xe;
    g = !0;
    try {
      xe = t.likeState ? (await t.likeState(ut, y.song)).by : y.likedBy ?? [];
    } catch {
      xe = y.likedBy;
    } finally {
      g = !1;
    }
    if (!xe) return F(`Could not check ${k} right now. Try the heart again.`);
    const Me = Ct(), Ze = ((ht == null ? void 0 : ht.status) === "confirmed" && typeof ht.liked == "boolean" && t.now() - (ht.confirmedAt ?? ht.created) < 5 * 6e4 ? ht.liked : void 0) ?? xe.includes(Me);
    if (!Ze && xe.some((wn) => wn !== Me)) return F(u() ? `${k} was liked from another wallet of yours. Unlike it there.` : `${k} was liked from your main wallet${xe.includes(G) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await ec({ song: y.song, liked: !Ze, title: y.title, artist: y.artist });
  }
  async function ec(y) {
    var Z, J, G;
    if (l) {
      kt("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const k = y.title ? `“${y.title}”${y.artist ? ` by ${y.artist}` : ""}` : `song #${y.song}`, F = t.wait ?? ((dt) => new Promise((ut) => setTimeout(ut, dt)));
    try {
      kt(`${y.liked ? "Liking" : "Unliking"} ${k}…`);
      const dt = t.now() + 12e4;
      for (; d || (Nt() ? ae(Ct()).some((Ze) => Ci.includes(Ze.status)) : R().length); ) {
        if (t.now() > dt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await F(5e3), await qe(!0);
      }
      if (!Nt() && _t() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const ut = Ct(), { balance: ht, nonce: xe } = await t.chain.account(ut);
      if (Nt() ? c = { for: ut, value: ht, at: t.now() } : (o = ht, a = t.now()), ge(ht)) throw new Error(Ah);
      const Me = await s.request("listening.signLike", {
        song: y.song,
        liked: y.liked,
        fee: Cc.toString(),
        nonce: xe.toString(),
        balance: ht.toString()
      }), Dr = {
        id: $h(),
        address: ut,
        kind: "like",
        core: 0,
        song: y.song,
        liked: y.liked,
        recipient: "",
        amount: "0",
        fee: Cc.toString(),
        nonce: xe.toString(),
        created: t.now(),
        status: "signed",
        raw: Me.raw,
        txid: Me.txid,
        ...y.title ? { title: String(y.title).slice(0, 120) } : {},
        ...y.artist ? { artist: String(y.artist).slice(0, 120) } : {}
      };
      t.validate(Dr), te(Dr);
      try {
        await t.chain.broadcast(Me.raw, Me.txid), te({ ...Dr, status: "pending" }), m = `${y.liked ? "♥ Liked" : "Unliked"} ${k}`, L = "";
        try {
          (Z = t.likeSent) == null || Z.call(t, y.song, y.liked);
        } catch {
        }
      } catch (Ze) {
        if (te({ ...Dr, status: js(Ze) ? "failed" : "unknown", note: Ze.message, ...js(Ze) ? { raw: void 0 } : {} }), L = Ze.message, js(Ze)) try {
          (J = t.likeFailed) == null || J.call(t, y.song);
        } catch {
        }
      }
      i = await Xe(s);
    } catch (dt) {
      L = "Like not sent: " + (dt instanceof Error ? dt.message : "the listening wallet is unavailable");
      try {
        (G = t.likeFailed) == null || G.call(t, y.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), $i();
    }
  }
  return { snapshot: De, refresh: qe, onListened: Ja, heart: co, toggleLike: Jn, ...Za };
}
const yy = ["Connect", "Passkey", "Link & fund", "Listen"], wy = ["Passkey", "Add 1 STX", "Listen"], Ol = (t) => t ? wy : yy;
function O5(t) {
  if (t.solo) return D5(t);
  const e = yy.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
      return n(2, "add up to 1 STX");
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
function D5(t) {
  const e = wy.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
      return n(1, "add 1 STX: anyone can send it to your address");
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
function F5(t, e) {
  return !e || e.at >= Ol(!!t.solo).length || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const j5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function z5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !j5(r.id)));
}
const R5 = {}, G5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, K5 = (t) => {
  const e = R5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, V5 = (t) => `/hiro/${t}`, W5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, X5 = (t) => {
  const e = K5(t);
  if (e)
    return [W5(e)];
  const n = G5[t];
  return typeof window < "u" ? [`${window.location.origin}${V5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, q5 = {}, vh = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, Y5 = "xtrata.log.enabled", Z5 = "xtrata.log.level", Q5 = "xtrata.log.tags", J5 = "xtrata.log.dedupe", Ro = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, t$ = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, e$ = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, n$ = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, r$ = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, s$ = () => {
  const t = q5 ?? {}, e = Ro(Y5) ?? t.VITE_LOG_ENABLED, n = Ro(Z5) ?? t.VITE_LOG_LEVEL, r = Ro(Q5) ?? t.VITE_LOG_TAGS, s = Ro(J5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: t$(e),
    level: e$(n) ?? "warn",
    tags: r$(r),
    dedupe: n$(s)
  };
}, i$ = (t, e, n) => !t.enabled || vh[n] < vh[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), o$ = (t, e, n, r) => {
  const s = s$();
  if (!i$(s, e, t) || c$(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, a$ = /* @__PURE__ */ new Set();
let Ih = null;
const c$ = (t, e, n, r, s) => (Ih !== t && (a$.clear(), Ih = t), !1), l$ = (t, e, n) => o$("debug", t, e, n), u$ = {}, f$ = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, d$ = (t) => {
  const e = u$, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : f$[t];
}, h$ = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, p$ = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return h$.test(n) ? n : null;
}, g$ = (t) => t.replace(/\/+$/, ""), y$ = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), kh = (t) => {
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
}, zs = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, w$ = (t) => {
  var c, f;
  let e;
  try {
    e = zn(b6(t));
  } catch {
    return null;
  }
  const n = zs(e);
  if (!n || n.success === !1)
    return null;
  const r = zs(n.value), s = zs(r == null ? void 0 : r.value), i = zs(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = kh((c = zs(i.name)) == null ? void 0 : c.value), a = kh((f = zs(i.namespace)) == null ? void 0 : f.value);
  return !o || !a ? null : p$(`${o}.${a}`);
}, b$ = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${g$(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [Yg(_g(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : w$(i.result);
}, m$ = async (t) => {
  const e = t.address.trim();
  if (!Zs(e))
    return null;
  const n = d$(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of X5(t.network))
    try {
      return await b$({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return l$("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: y$(r)
  }), null;
};
function x$(t, e, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, i = /* @__PURE__ */ new Map(), o = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => t(a)).then((f) => {
      c.pending = !1, f && (c.name = f, e());
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
const Lh = Object.freeze({
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
});
function S$(t, e = "") {
  return Object.hasOwn(Lh, String(t)) ? Lh[String(t)] : e;
}
const Ch = Object.freeze({ 312: "Smalltalk", 315: "Entertainment" });
function E$(t, e = "") {
  return Object.hasOwn(Ch, String(t)) ? Ch[String(t)] : e;
}
const A$ = 100000n, Bh = 1000000n, $$ = 3000n, v$ = (t, e) => `${t}#gift=${e}`, I$ = 100, Th = (t, e = oo) => t <= _r ? 0 : Number((t - _r) / Nr(e)), Mh = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), by = "xtrata.xyz/radio/gifts", k$ = "Create Xtrata radio gift links paid from the gift treasury", L$ = (t) => ({
  domain: ws({ name: be(by), version: be("1"), "chain-id": Ln(1) }),
  message: ws({
    purpose: be(k$),
    admin: be(t.admin),
    count: Ln(t.count),
    amount: Ln(BigInt(t.amount)),
    label: be(t.label),
    issued: Ln(t.issued),
    ...t.player ? { player: be(t.player) } : {}
  })
}), _h = 40, C$ = "Create an Xtrata radio gift player", B$ = /^[^\u0000-\u001f\u007f<>]+$/u;
function Nh(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && B$.test(t) : !n;
}
function T$(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!Nh(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!Nh(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > _h) throw new Error(`A player holds 1 to ${_h} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: null };
}
const M$ = (t) => P0(z0(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), _$ = (t) => ({
  domain: ws({ name: be(by), version: be("1"), "chain-id": Ln(1) }),
  message: ws({
    purpose: be(C$),
    admin: be(t.admin),
    player: be(t.hash),
    issued: Ln(t.issued)
  })
}), Uh = (t, e = oo) => _r + BigInt(t) * Nr(e), Ph = [300, 500, 1e3], Hh = 1800, Mc = /* @__PURE__ */ new Map();
async function my(t) {
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
async function N$(t) {
  const e = navigator;
  if (e.share)
    try {
      return await e.share(t), { label: "Shared ✓", ok: !0 };
    } catch (n) {
      if ((n == null ? void 0 : n.name) === "AbortError") return null;
    }
  return await my(t.url) ? { label: "Link copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 };
}
function xy(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = Mc.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      Mc.set(t, { ...a, until: Date.now() + Hh });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Mc.delete(t), s();
      }, Hh + 50);
    }
  }, i;
}
const qs = (t, e, n, r, s) => xy(t, e, async () => await my(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), zr = "xtrata.radio.gift.incoming.v1", Oh = (t) => "xtrata.radio.gift.mine.v1:" + t, gt = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Rr = (t, e, n = "") => {
  const r = gt("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, Bi = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, Rs = (t) => an(t).replace(/\.?0+$/, "");
function U$(t) {
  let e = null;
  const n = (() => {
    try {
      const M = new URL(location.href), R = new URLSearchParams(M.hash.slice(1)).get("gift") ?? M.searchParams.get("gift");
      return R !== null && (M.searchParams.delete("gift"), history.replaceState(null, "", M.pathname + (M.search || ""))), Mh(R) ? R : null;
    } catch {
      return null;
    }
  })(), r = (() => {
    try {
      const M = JSON.parse(t.store.get(zr) || "null");
      return Mh(M == null ? void 0 : M.code) ? M.code : null;
    } catch {
      return null;
    }
  })(), s = n ?? r;
  s && (e = { code: s }, t.store.set(zr, JSON.stringify({ code: s, at: t.now() })), fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (M) => {
    const R = await M.json().catch(() => ({}));
    if (!M.ok)
      throw M.status === 404 && t.store.set(zr, null), new Error((R == null ? void 0 : R.error) || "Could not check your gift right now. Reload to try again.");
    const z = R;
    e = { ...e, view: z }, ["claimed", "expired", "refunding", "refunded"].includes(z.status) && t.store.set(zr, null), t.changed();
  }).catch((M) => {
    e = { ...e, error: M.message }, t.changed();
  }));
  const i = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, o = () => {
    e = null, t.store.set(zr, null), t.changed();
  }, a = (M) => M.from ? t.who(M.from) : M.label ? `Xtrata Radio · ${M.label}` : "Xtrata Radio";
  let c = {};
  const f = (M) => {
    if (c.box) return c.box;
    const R = gt("div", "", "ppp-gift-check");
    c.box = R;
    const z = () => {
      const rt = window.turnstile;
      !rt || c.rendered || (c.rendered = !0, rt.render(R, { sitekey: M, callback: (at) => {
        c.token = at, t.changed();
      }, "expired-callback": () => {
        c.token = void 0;
      } }));
    };
    if (window.turnstile) z();
    else {
      const rt = document.createElement("script");
      rt.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", rt.async = !0, rt.onload = z, document.head.append(rt);
    }
    return R;
  };
  let d;
  async function l(M) {
    var R, z;
    if (!(!e || e.claiming || !M.listening)) {
      e.claiming = !0, e.error = void 0, t.changed();
      try {
        const rt = await fetch("/radio/gift/claim", {
          method: "POST",
          headers: { "content-type": "application/json" },
          cache: "no-store",
          signal: AbortSignal.timeout(3e4),
          body: JSON.stringify({ code: e.code, wallet: M.listening, turnstile: c.token })
        }), at = await rt.json().catch(() => ({}));
        if (rt.status === 503 && /sending another gift/.test((at == null ? void 0 : at.error) || "")) {
          e.waiting = !0, clearTimeout(d), d = setTimeout(() => {
            e && (e.waiting = !1, t.changed());
          }, 12e3);
          return;
        }
        if (!rt.ok)
          throw (rt.status === 404 || rt.status === 410 || rt.status === 409 && /already had a gift|brand-new/.test((at == null ? void 0 : at.error) || "")) && t.store.set(zr, null), new Error((at == null ? void 0 : at.error) || `Could not claim the gift (${rt.status}).`);
        e.done = !0, t.store.set(zr, null), t.giftSent(at.txid, BigInt(at.amount));
      } catch (rt) {
        e.error = rt.message, c.token = void 0;
        try {
          (z = (R = window.turnstile) == null ? void 0 : R.reset) == null || z.call(R, c.box);
        } catch {
        }
      } finally {
        e.claiming = !1, t.changed();
      }
    }
  }
  let g = null;
  function h(M) {
    if (!M.listening || !M.depositPending || M.step !== "fund")
      return g = null, [];
    if (!g || g.wallet !== M.listening || t.now() - g.at > 3e4) {
      const R = M.listening;
      g = { ...(g == null ? void 0 : g.wallet) === R ? g : {}, wallet: R, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(R)).then((z) => {
        var rt, at;
        (g == null ? void 0 : g.wallet) === R && (g.state = (rt = z == null ? void 0 : z.gift) == null ? void 0 : rt.state, g.problem = ((at = z == null ? void 0 : z.gift) == null ? void 0 : at.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    return g.state === "sending" && g.problem ? [gt("p", `🎁 Your gift is waiting to go out (${g.problem}). It is retried automatically.`, "ppp-warn")] : [];
  }
  function x(M) {
    var ye, Kt;
    const R = h(M);
    if (!e || ["off", "elsewhere"].includes(M.step)) return R;
    const z = e.view;
    if (e.error && !z) return [gt("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!z) return [gt("p", "🎁 Checking your gift…", "ppp-mute")];
    if (e.done) return R;
    if (z.status === "claimed" || z.status === "claiming") return [gt("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(z.status)) return [gt("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (z.status === "pending-deposit") return [gt("p", `🎁 ${a(z)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (!!M.listening && (!(M.createdHere || M.brandNew) || !!M.linked || !!M.creditedTo || (M.balance ?? 0n) > 0n || M.entries.length > 0))
      return [gt("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), Rr("Forget this gift link here", o, "quiet")];
    const at = BigInt(z.amount), Ot = Th(at).toLocaleString(), Nt = [gt("p", z.player ? `🎁 ${a(z)} sent you “${z.player.title}”${z.player.subtitle ? ` by ${z.player.subtitle}` : ""}: ${z.player.tracks.length} ${z.player.tracks.length === 1 ? "song" : "songs"} and ${Ot} plays of on-chain music.` : `🎁 ${a(z)} sent you ${Rs(at)} STX of on-chain music: about ${Ot} paid plays.`, "ppp-gift")], Wt = !!M.listening && (M.createdHere || M.brandNew) && !M.linked && !M.creditedTo && M.step === "fund" && (M.balance ?? 1n) === 0n && !M.depositPending && !M.entries.length, ge = (Kt = (ye = M.gate) == null ? void 0 : ye.gifts) == null ? void 0 : Kt.turnstileSiteKey;
    return Wt ? (ge && !c.token ? Nt.push(gt("p", "One quick check and it is yours:", "ppp-mute"), f(ge)) : !e.claiming && !e.error && !e.waiting && l(M), (e.claiming || e.waiting) && Nt.push(gt("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : "Sending your gift…", "ppp-cyan")), e.error && Nt.push(gt("p", e.error, "ppp-bad"), Rr("Try again", () => {
      e.error = void 0, l(M);
    }))) : M.step === "intro" ? Nt.push(gt("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : M.listening && M.linked ? Nt.push(gt("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), Rr("Forget this gift link here", o, "quiet")) : M.listening && (M.balance ?? 0n) > 0n && Nt.push(gt("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), Rr("Forget this gift link here", o, "quiet")), Nt;
  }
  async function m(M, R, z) {
    var rt;
    try {
      const at = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(M));
      if ((rt = at == null ? void 0 : at.gift) != null && rt.returnTo) return { ok: !0, funder: at.gift.returnTo, txId: at.gift.txid ?? void 0, amount: at.gift.amount, distinct: 1 };
    } catch {
      if (z) return { ok: !1 };
    }
    return R();
  }
  const L = gt("div", "", "ppp-gift-fold");
  let b = 250000n, T = "", w = "", B = null;
  const C = (M) => {
    try {
      const R = JSON.parse(t.store.get(Oh(M)) || "[]");
      return Array.isArray(R) ? R : [];
    } catch {
      return [];
    }
  }, D = (M, R) => t.store.set(Oh(M), JSON.stringify(R.slice(0, 50)));
  let q = 0;
  async function O(M) {
    const R = C(M);
    for (const z of R)
      if (!(z.view && ["claimed", "refunded", "expired"].includes(z.view.status)))
        try {
          z.view = !z.view || z.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: z.id, ...z.txid ? { txid: z.txid } : {} }) }) : await t.json("/radio/gift?id=" + z.id), z.error = void 0;
        } catch (rt) {
          z.error = rt.message;
        }
    D(M, R), t.changed();
  }
  async function W(M) {
    if (T) return;
    T = "Starting your gift…", w = "", t.changed();
    let R = null;
    try {
      R = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: M, amount: b.toString() }) });
      const z = C(M);
      z.unshift({ id: R.id, code: R.code, amount: b.toString(), at: t.now() }), D(M, z), T = "Approve the gift in your wallet…", t.changed();
      const rt = await t.pay(M, R.depositTo, BigInt(R.deposit), R.memo), at = C(M), Ot = at.find((Ct) => Ct.id === R.id);
      Ot && (Ot.txid = rt, Ot.view = { status: "pending-deposit", amount: b.toString(), source: "friend", from: M, label: "", expires: 0 }), D(M, at), w = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", O(M);
    } catch (z) {
      w = z.message || "Not sent.";
    } finally {
      T = "", t.changed();
    }
  }
  const S = (M) => "xtrata.radio.gift.players.v1:" + M, $ = (M) => {
    try {
      const R = JSON.parse(t.store.get(S(M)) || "[]");
      return Array.isArray(R) ? R.filter((z) => z && /^[0-9a-f]{16}$/.test(z.id)) : [];
    } catch {
      return [];
    }
  };
  async function H(M, R) {
    if (!T) {
      T = "Checking the player…", w = "", t.changed();
      try {
        const z = R.tracks.split(/[\s,]+/).filter(Boolean).map((Wt) => Number(Wt.replace(/^#/, ""))), rt = T$({ title: R.title.trim(), subtitle: R.subtitle.trim(), tracks: z, cover: null });
        T = "Sign in your wallet…", t.changed();
        const at = { admin: M, hash: M$(rt), issued: t.now() }, Ot = await t.sign(M, _$(at));
        T = "Making the player…", t.changed();
        const Ct = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: rt, request: at, signature: Ot }) }), Nt = $(M).filter((Wt) => Wt.id !== Ct.id);
        Nt.unshift({ id: Ct.id, title: Ct.title, tracks: Ct.tracks }), t.store.set(S(M), JSON.stringify(Nt.slice(0, 30))), w = `${Ct.existing ? "That player already exists" : "Player made"} ✓ “${Ct.title}” · ${Ct.tracks} songs. Pick it below for a campaign.`;
      } catch (z) {
        w = z.message || "Not made.";
      } finally {
        T = "", t.changed();
      }
    }
  }
  async function Y(M, R, z, rt, at) {
    if (!T) {
      T = "Sign in your wallet…", w = "", B = null, t.changed();
      try {
        const Ot = { admin: M, count: R, amount: z.toString(), label: rt, issued: t.now(), ...at ? { player: at } : {} }, Ct = await t.sign(M, L$(Ot));
        T = "Making links…", t.changed();
        const Nt = await t.json("/radio/gift/campaign", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ request: Ot, signature: Ct }) });
        B = { codes: Nt.codes, amount: Nt.amount };
      } catch (Ot) {
        w = Ot.message || "Not made.";
      } finally {
        T = "", t.changed();
      }
    }
  }
  const et = (M, R) => v$(M || location.origin + "/radio.html", R), X = (M) => N$({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: M }), $t = gt("input");
  $t.type = "range", $t.min = String(A$), $t.max = String(Bh), $t.step = "50000", $t.value = String(b), $t.setAttribute("aria-label", "Gift amount");
  const le = gt("p", "", "ppp-gift-amount"), de = Rr("", () => {
    const M = t.main();
    M && W(M);
  }, "primary"), A = () => {
    le.textContent = N(), de.textContent = `Gift ${Rs(b)} STX`;
  };
  $t.oninput = () => {
    b = BigInt($t.value), A();
  };
  const N = () => `${Rs(b)} STX · about ${Th(b).toLocaleString()} paid plays · you pay ${Rs(b + $$)} STX with the network fee`;
  A();
  const yt = gt("input");
  yt.type = "number", yt.min = "1", yt.max = String(I$), yt.value = "10", yt.setAttribute("aria-label", "How many links");
  const ot = gt("input");
  ot.type = "number", ot.min = "0.1", ot.max = "1", ot.step = "0.05", ot.value = String(Number(Uh(Ph[0])) / 1e6), ot.setAttribute("aria-label", "STX per link");
  const ct = gt("input");
  ct.maxLength = 60, ct.placeholder = "Title, e.g. Proof of Sound", ct.setAttribute("aria-label", "Player title");
  const Dt = gt("input");
  Dt.maxLength = 80, Dt.placeholder = "Artist (optional)", Dt.setAttribute("aria-label", "Player subtitle");
  const Zt = gt("textarea");
  Zt.rows = 3, Zt.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Zt.setAttribute("aria-label", "Songs");
  const Vt = gt("select");
  Vt.setAttribute("aria-label", "Gift player");
  const Tt = gt("select");
  Tt.setAttribute("aria-label", "Plays per link");
  for (const M of Ph) Tt.append(Bi(`${M.toLocaleString()} plays`, String(Uh(M))));
  Tt.append(Bi("Max (1 STX)", String(Bh)), Bi("Custom STX", "")), Tt.onchange = () => {
    Tt.value && (ot.value = String(Number(Tt.value) / 1e6));
  };
  const ae = gt("input");
  ae.maxLength = 40, ae.placeholder = "Label, e.g. Launch week", ae.setAttribute("aria-label", "Campaign label");
  function te(M) {
    var at, Ot, Ct, Nt, Wt;
    const R = (at = M.gate) == null ? void 0 : at.gifts;
    if (!(R != null && R.enabled) || ["off", "elsewhere", "unsupported"].includes(M.step)) return null;
    const z = t.main(), rt = [gt("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!z)
      rt.push(gt("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      de.disabled = !!T, rt.push($t, le, de), t.now() - q > 3e4 && (q = t.now(), O(z));
      const ge = C(z);
      if (ge.length) {
        const ye = gt("ul", "", "ppp-gift-list");
        for (const Kt of ge.slice(0, 10)) {
          const u = (Ot = Kt.view) == null ? void 0 : Ot.status, E = Kt.error ? Kt.error : !u || u === "pending-deposit" ? Kt.txid ? "payment confirming…" : "waiting for your payment" : u === "live" ? "ready to share" : u === "claiming" || u === "claimed" ? "claimed ✓" : u === "refunding" ? "expired · refund on its way" : u === "refunded" ? "expired · refunded to you" : u, v = gt("li");
          if (v.append(gt("span", `${Rs(BigInt(Kt.amount))} STX`, "t"), gt("span", E, ((Ct = Kt.view) == null ? void 0 : Ct.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((Nt = Kt.view) == null ? void 0 : Nt.status) === "live") {
            const U = et(((Wt = M.gate) == null ? void 0 : Wt.radioUrl) ?? null, Kt.code);
            v.append(qs("gift-copy:" + Kt.id, "Copy link", () => U, "tiny", t.changed), xy("gift-share:" + Kt.id, "Share", () => X(U), "tiny", t.changed));
          }
          ye.append(v);
        }
        rt.push(ye);
      }
      if (R.admin) {
        const ye = Rr("Sign and make links", () => {
          const U = BigInt(Math.round(Number(ot.value) * 1e6));
          Y(z, Number(yt.value), U, ae.value.trim(), Vt.value || void 0);
        }), Kt = gt("div", "", "ppp-gift-admin"), u = (U, Q) => {
          const ft = gt("label", U);
          return ft.append(Q), ft;
        }, E = $(z), v = Vt.value;
        if (Vt.replaceChildren(Bi("No player (plain gift)", ""), ...E.map((U) => Bi(`${U.title} · ${U.tracks} songs`, U.id))), E.some((U) => U.id === v) && (Vt.value = v), Kt.append(
          gt("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
          ct,
          Dt,
          Zt,
          Rr("Sign and make player", () => void H(z, { title: ct.value, subtitle: Dt.value, tracks: Zt.value })),
          gt("p", "Campaign links (admin) · paid from the gift treasury", "ppp-cyan"),
          u("Player ", Vt),
          u("Plays each ", Tt),
          u("Links ", yt),
          u("STX each ", ot),
          ae,
          ye
        ), B) {
          const U = B.codes.map((ft) => {
            var Rt;
            return et(((Rt = M.gate) == null ? void 0 : Rt.radioUrl) ?? null, ft);
          }).join(`
`), Q = gt("textarea");
          Q.readOnly = !0, Q.value = U, Q.rows = Math.min(8, B.codes.length), Kt.append(gt("p", `${B.codes.length} links, ${Rs(BigInt(B.amount))} STX each. Copy them now: they are not shown again.`, "ppp-warn"), Q, qs("campaign-copy", "Copy all", () => U, "tiny", t.changed));
        }
        rt.push(Kt);
      }
    }
    return T && rt.push(gt("p", T, "ppp-cyan")), w && rt.push(gt("p", w, /✓/.test(w) ? "ppp-ok" : "ppp-warn")), L.replaceChildren(...rt), L;
  }
  return { banner: x, funder: m, renderFold: te, liveGift: i, setAside: o, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null };
}
const P$ = [
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
function H$(t) {
  for (const [e, n] of P$) if (n.test(t)) return e;
  return null;
}
const Sy = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), Ey = (t) => /Android/.test(t);
function O$(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : Sy(e) ? "x-safari-" + n.href : Ey(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const D$ = (t) => Sy(t) ? "Safari" : Ey(t) ? "Chrome" : "your browser", Dh = document.getElementById("ppp");
Dh && F$(Dh);
function F$(t) {
  var Kt;
  const e = uw(), n = (u) => t.querySelector(u), r = n(".ppp-frame");
  let s = null;
  const i = async (u, E) => {
    const v = await fetch(u, { cache: "no-store", ...E, signal: AbortSignal.timeout(15e3) }), U = await v.json().catch(() => ({}));
    if (!v.ok) throw new Error((U == null ? void 0 : U.error) || `Request failed (${v.status}).`);
    return U;
  }, o = H5({
    now: Date.now,
    main: () => {
      const u = e.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    config: (u) => i("/radio/listening-wallet/config?main=" + encodeURIComponent(u || "")),
    links: async (u) => (await i("/radio/listening-wallet/link?main=" + encodeURIComponent(u))).links ?? [],
    mainOf: async (u) => {
      var v;
      const E = (await i("/radio/listening-wallet/link?listening=" + encodeURIComponent(u))).links;
      return ((v = E == null ? void 0 : E.find((U) => U.listening === u)) == null ? void 0 : v.main) ?? null;
    },
    saveLink: async (u) => {
      await i("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(u) });
    },
    bridge: async (u) => {
      s = document.createElement("iframe"), s.title = "Xtrata listening wallet", s.setAttribute("allow", `publickey-credentials-get ${u}; publickey-credentials-create ${u}`), s.referrerPolicy = "no-referrer";
      const E = new Promise((ft, Rt) => {
        s.addEventListener("load", () => ft(), { once: !0 }), setTimeout(() => Rt(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = u + "/", r.replaceChildren(s), await E;
      const v = new ew({ walletOrigin: u, frame: s, timeoutMs: 30 * 6e4 }), U = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), Q = (ft, Rt) => U.has(ft) ? v.request(ft, Rt) : Promise.race([
        v.request(ft, Rt),
        new Promise((Pt, Oe) => setTimeout(() => Oe(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await Q("listening.status"), { request: Q };
    },
    chain: {
      verify: w5,
      balance: m5,
      account: b5,
      owner: x5,
      broadcast: S5,
      transaction: E5,
      confirmedNonce: async (u) => {
        const E = await Br(`/v2/accounts/${u}?proof=0`);
        if (!Number.isSafeInteger(E == null ? void 0 : E.nonce) || E.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(E.nonce);
      }
    },
    signWithMain: (u, E) => wh({ ...E, network: "mainnet", stxAddress: u }),
    deposit: (u, E, v) => new Promise((U, Q) => dh({
      recipient: E,
      amount: v.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: u,
      network: new _c(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (ft) => U(ft.txId || ""),
      onCancel: () => Q(new Error("Deposit cancelled. Nothing was sent.")),
      onError: Q
    })),
    validate: A5,
    tabLock: (u) => new Promise((E) => {
      const v = navigator.locks;
      if (!(v != null && v.request)) {
        E(!0);
        return;
      }
      v.request("xtrata-ppp:" + u, { ifAvailable: !0 }, async (U) => {
        E(!!U), U && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (u) => {
        try {
          return localStorage.getItem(u);
        } catch {
          return null;
        }
      },
      set: (u, E) => {
        try {
          localStorage.setItem(u, E);
        } catch {
        }
      }
    },
    changed: () => Wt(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (u) => {
      var E, v;
      return a.funder(u, () => C5(u, Br), !!((v = (E = o.snapshot().gate) == null ? void 0 : E.gifts) != null && v.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (u) => {
      const E = await i("/radio/gift/for?wallet=" + encodeURIComponent(u)), v = E == null ? void 0 : E.gift;
      if (!v) return null;
      if (typeof v.returnTo != "string" || typeof v.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: v.returnTo, from: typeof v.from == "string" ? v.from : null, source: String(v.source ?? ""), amount: String(v.amount ?? "0"), treasury: v.treasury, state: v.state === "sending" ? "sending" : "arrived", player: v.player ?? null };
    },
    history: (u, E) => M5(u, (v) => Br(v), E),
    likesChanged: () => {
      var u, E;
      (E = (u = window.XtrataRadio) == null ? void 0 : u.refreshLikes) == null || E.call(u);
    },
    likeState: async (u, E) => {
      const v = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: u, ids: String(E) })), U = Array.isArray(v == null ? void 0 : v.rows) ? v.rows.find((Q) => (Q == null ? void 0 : Q.id) === E) : null;
      if (!U || typeof U.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: U.liked, by: Array.isArray(U.by) ? U.by.filter((Q) => typeof Q == "string") : U.liked ? [u] : [] };
    },
    likeSent: (u, E) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: u, liked: E } })),
    nameOf: (u) => O(u) ?? void 0,
    likeConfirmed: (u, E) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: u, liked: E } })),
    likeFailed: (u) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: u } }))
  }), a = U$({
    json: i,
    main: () => {
      const u = e.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    pay: (u, E, v, U) => new Promise((Q, ft) => dh({
      recipient: E,
      amount: v.toString(),
      memo: U,
      stxAddress: u,
      network: new _c(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (Rt) => Q(Rt.txId || ""),
      onCancel: () => ft(new Error("Gift cancelled. Nothing was sent.")),
      onError: ft
    })),
    sign: (u, E) => wh({ ...E, network: "mainnet", stxAddress: u }),
    giftSent: (u, E) => o.giftSent(u, E),
    who: (u) => $(u),
    changed: () => Wt(o.snapshot()),
    store: {
      get: (u) => {
        try {
          return localStorage.getItem(u);
        } catch {
          return null;
        }
      },
      set: (u, E) => {
        try {
          E === null ? localStorage.removeItem(u) : localStorage.setItem(u, E);
        } catch {
        }
      }
    },
    now: Date.now
  });
  window.XtrataRadioLikeHandler = (u) => {
    if (!u || !Number.isSafeInteger(u.song) || u.song < 0) return !1;
    $t();
    const E = le(u.song, { title: u.title, artist: u.artist });
    return o.heart({ song: u.song, title: E.title || void 0, artist: E.artist || void 0, likedBy: Array.isArray(u.likedBy) ? u.likedBy : void 0 });
  };
  let c;
  window.XtrataRadioListeningIdentity = () => {
    const u = o.snapshot();
    return u.solo && u.step !== "off" && u.step !== "elsewhere" ? u.listening : void 0;
  };
  const f = (u) => {
    var v, U;
    const E = window.XtrataRadioListeningIdentity();
    E !== c && (c = E, (U = (v = window.XtrataRadio) == null ? void 0 : v.refreshLikes) == null || U.call(v));
  };
  let d = "", l = null;
  const g = (u) => {
    var ft, Rt;
    const E = window.XtrataRadio;
    if (!(E != null && E.setGiftPlayer) || !(E != null && E.setGiftStop)) return;
    const v = u.step === "off" || u.step === "elsewhere" ? null : ((ft = u.gift) == null ? void 0 : ft.player) ?? null, U = v ? v.id + ":" + v.tracks.map((Pt) => Pt.id).join(",") : "";
    U !== d && (E.setGiftPlayer(v ? { id: v.id, title: v.title, subtitle: v.subtitle, tracks: v.tracks.map((Pt) => Pt.id) } : null), d = U);
    const Q = v ? ((Rt = u.giftStop) == null ? void 0 : Rt.text) ?? null : null;
    Q !== l && (E.setGiftStop(Q), l = Q);
  }, h = (u) => u ? u.slice(0, 6) + "…" + u.slice(-4) : "", x = (u) => (Number(u) / 1e6).toFixed(u < 1000n ? 6 : 4), m = (u) => {
    const E = Math.round((Date.now() - u) / 6e4);
    return E < 1 ? "now" : E < 60 ? `${E}m` : E < 1440 ? `${Math.round(E / 60)}h` : `${Math.round(E / 1440)}d`;
  }, L = (u) => `https://explorer.hiro.so/txid/${u}?chain=mainnet`, b = (u, E = "", v = "") => {
    const U = document.createElement(u);
    return E && (U.textContent = E), v && (U.className = v), U;
  }, T = (u, E, v = "") => {
    const U = b("button", u, v);
    return U.type = "button", U.onclick = E, U;
  }, w = (u, E) => {
    const v = b("a", u);
    return v.href = E, v.target = "_blank", v.rel = "noopener", v;
  };
  let B = null, C = location.hash === "#give";
  C && history.replaceState(null, "", location.pathname + location.search);
  let D = !1;
  const q = x$((u) => m$({ address: u, network: "mainnet" }), () => Wt(o.snapshot())), O = (u) => q.get(u), W = H$(navigator.userAgent), S = (u, E) => {
    const v = navigator.userAgent, U = D$(v), Q = `${location.origin}${location.pathname}${E ? `#gift=${E}` : ""}`, ft = [b("p", `You are in ${u}'s built-in browser, where passkeys often do not work. Open this page in ${U} to make your listening wallet${E ? " and claim your gift" : ""}.`, "ppp-warn")], Rt = b("div", "", "ppp-open-row"), Pt = O$(Q, v);
    if (Pt) {
      const Oe = b("a", `Open in ${U}`, "primary ppp-open-in");
      Oe.href = Pt, Oe.dataset.homeAction = "radio:open-in-browser", Rt.append(Oe);
    }
    return Rt.append(qs("copy-page-link", "Copy link", () => Q, Pt ? "" : "primary", () => Wt(o.snapshot()))), ft.push(Rt, b("p", `If that does not open ${U}, use ${u}'s menu (••• or ⋮) and choose "Open in ${U === "your browser" ? "browser" : U}", or paste the copied link there.`, "ppp-mute")), ft;
  }, $ = (u) => O(u) ?? h(u), H = (u) => u.slice(0, 2).map($).join(" and ") + (u.length > 2 ? ` and ${u.length - 2} more` : ""), Y = /* @__PURE__ */ new Map();
  let et = !1;
  const X = (u) => !u || /^(?:Inscription )?#\d+$/.test(u.trim()), $t = () => {
    et || (et = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((u) => u.ok ? u.json() : null).then((u) => {
      for (const E of Array.isArray(u == null ? void 0 : u.tracks) ? u.tracks : []) {
        const v = Number(E == null ? void 0 : E.id);
        Number.isSafeInteger(v) && Y.set(v, { title: typeof E.title == "string" ? E.title : void 0, artist: typeof E.artist == "string" ? E.artist : void 0 });
      }
      Wt(o.snapshot());
    }).catch(() => {
      et = !1;
    }));
  }, le = (u, E) => {
    const v = Y.get(u), U = E$(u, [v == null ? void 0 : v.title, E == null ? void 0 : E.title].find((ft) => !X(ft)) || ""), Q = S$(u, (v == null ? void 0 : v.artist) || (E == null ? void 0 : E.artist) || "");
    return { title: U, artist: Q };
  }, de = (u) => {
    const { title: E, artist: v } = le(u.song, u);
    return E ? `“${E}”${v ? ` — ${v}` : ""}` : `Song #${u.song}${v ? ` — ${v}` : ""}`;
  }, A = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, N = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function yt(u) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(u.step) ? ["", ""] : u.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : u.step === "over" ? ["OVER 1 STX", "bad"] : u.step === "locked" ? ["LOCKED", "mute"] : u.step === "intro" || u.step === "link" ? ["", ""] : u.step === "fund" ? u.depositPending ? ["ON ITS WAY", "warn"] : u.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : u.payingOn && u.session && u.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function ot(u, E, v = "", U) {
    const Q = b("dt", u), ft = b("dd", E, v);
    return U && ft.append(" ", U), [Q, ft];
  }
  const ct = document.getElementById("ppp-top"), Dt = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Zt = () => {
    var E, v;
    const u = o.snapshot();
    if (u.step === "connect" || u.step === "wrong-wallet") {
      (E = document.getElementById("radio-wallet-connect")) == null || E.click();
      return;
    }
    if (u.step === "elsewhere" && ((v = u.gate) != null && v.radioUrl)) {
      location.href = u.gate.radioUrl;
      return;
    }
    u.step === "locked" && !u.armed && !u.busy && o.unlock(), u.step === "ready" && !u.payingOn && !u.busy && o.switchOn(), Dt();
  };
  ct && (ct.onclick = Zt);
  function Vt(u) {
    if (!ct) return;
    const E = (U, Q, ft) => {
      ct.hidden = !1, ct.className = "ppp-top" + (Q ? " is-" + Q : ""), ct.replaceChildren(b("span", "", "dot"), document.createTextNode(U)), ct.title = ft;
    }, v = u.session ? Math.min(u.session.playsLeft, u.playsLeft) : 0;
    switch (u.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        ct.hidden = !0;
        return;
      case "elsewhere":
        return E("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        ct.hidden = !0;
        return;
      case "intro":
        return E("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "wrong-wallet":
        return E(`Connect ${$(u.linked)}`, "warn", `This device's listening wallet belongs to ${$(u.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return E(u.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return E("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return u.depositPending ? E("Funds on their way", "quiet", "Paying starts by itself when they land") : E(u.entries.some((U) => U.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return E("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return E("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return u.payingOn && v > 0 ? E(`On · ${v.toLocaleString()} plays left`, "on", "Paying artists as you listen") : E("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  const Tt = document.getElementById("pppNudge"), ae = document.getElementById("onair");
  (Kt = Tt == null ? void 0 : Tt.querySelector("button")) == null || Kt.addEventListener("click", () => Zt());
  const te = {
    elsewhere: "Listening free · artists get nothing",
    connect: "Not paying artists",
    intro: "Not paying artists",
    locked: "Locked · not paying artists",
    "wrong-wallet": "Wrong wallet connected · not paying artists",
    link: "Not paying artists yet",
    fund: "No funds yet · artists unpaid",
    over: "Paused · artists unpaid",
    ready: "Paying is off · artists get nothing"
  }, gn = {
    elsewhere: "Pay as I listen",
    connect: "Connect",
    "wrong-wallet": "Switch wallet",
    intro: "Set up",
    locked: "Unlock",
    link: "Finish setup",
    fund: "Top up",
    over: "Fix it",
    ready: "Switch on"
  };
  function M(u) {
    var ft;
    if (u.step === "loading") return;
    const E = u.session ? Math.min(u.session.playsLeft, u.playsLeft) : 0, v = u.step === "ready" && u.payingOn && E > 0, U = v ? "" : te[u.step] ?? "", Q = v ? "on" : U ? "off" : "";
    if (Q ? document.documentElement.dataset.ppp = Q : delete document.documentElement.dataset.ppp, ae && (ae.hidden = !Q, ae.querySelector(".onair-sub").textContent = v ? `Paying artists · ${E.toLocaleString()} plays left` : "Not paying"), Tt && (Tt.hidden = Q !== "off" || u.step === "fund" && u.depositPending, Q === "off")) {
      const Rt = Math.floor(Number(1000000n / Nr(BigInt(((ft = u.gate) == null ? void 0 : ft.limits.playFee) ?? "300"))));
      Tt.querySelector(".nudge-t").textContent = "⚠ " + U, Tt.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${Rt.toLocaleString()} plays, on-chain, straight to the artists.`, Tt.querySelector("button").textContent = gn[u.step] ?? "Start paying";
    }
  }
  let R = "";
  function z(u) {
    const E = b("div", "", "ppp-pick");
    u.funderMultiple && u.returnToKind === "funder" && E.append(b("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), u.returnToKind === "funder" && E.append(b("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const v = b("input");
    v.type = "text", v.placeholder = "SP… address to send returns to", v.autocomplete = "off", v.spellcheck = !1, v.setAttribute("aria-label", "Address to return funds to"), v.value = R, v.oninput = () => {
      R = v.value;
    };
    const U = T(u.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(v.value), R = "";
    }, "tiny");
    return E.append(v, " ", U), u.returnToKind === "chosen" && E.append(" ", T("Back to the funder", () => o.clearReturnAddress(), "tiny")), E;
  }
  const rt = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function at() {
    const u = b("p", rt + " ", "ppp-mute");
    return u.append(w("Xverse", "https://www.xverse.app/download"), " · ", w("Leather", "https://leather.io/install-extension")), u;
  }
  let Ot = "";
  const Ct = (u) => {
    const E = document.documentElement, v = u.solo && !u.main ? u.listening ? h(u.listening) : "new" : "", U = z5() ? "1" : "";
    `${v}|${U}` !== Ot && (Ot = `${v}|${U}`, v ? E.dataset.pppSolo = v : delete E.dataset.pppSolo, U ? E.dataset.pppWalletInstalled = U : delete E.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const u of [1500, 4e3, 9e3]) setTimeout(() => Wt(o.snapshot()), u);
  function Nt(u) {
    const E = u.likeFunds;
    if (!E || !E.album || !E.low && !E.pending) return [];
    const v = b("div", "", "ppp-pick ppp-lowbox");
    if (!E.low) {
      const Q = b("p", "Top-up for your main listener wallet is on its way. ", "ppp-warn");
      return E.txid && Q.append(w("View", L(E.txid))), v.append(Q), [v];
    }
    v.append(b("p", "⚠ YOUR MAIN LISTENER WALLET IS OUT OF FUNDS", "ppp-bad ppp-lowtitle")), v.append(b("p", "It signs every like for all your albums, so they all count for you. Likes are paused until it has a little STX. 0.1 STX is hundreds of likes.")), v.append(b("p", E.address, "ppp-addr-full"));
    const U = b("div", "", "ppp-open-row");
    if (U.append(qs("copy-likes-address", "Copy address", () => E.address, "primary", () => Wt(o.snapshot()))), E.main && !u.solo) {
      const Q = Qr - (E.balance ?? 0n);
      Q > 0n && U.append(T(`Pay ${an(Q)} STX from my wallet`, () => void o.topUpLikes(), "primary"));
    }
    return v.append(U), v.append(b("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [v];
  }
  function Wt(u) {
    var Xe, Be, Zn, Ts, Ms, _s, Ns, Te, qe;
    if (f(), g(u), Ct(u), Vt(u), M(u), t.hidden = u.step === "off", t.hidden) return;
    const [E, v] = yt(u), U = n(".ppp-state");
    U.textContent = E, U.className = "ppp-state" + (v ? " ppp-state--" + v : ""), U.hidden = !E;
    const Q = !!u.busy || u.armed, ft = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(u.step) && (Q || !["intro", "loading"].includes(u.step));
    r.hidden = !ft, r.classList.toggle("ppp-frame--rest", !Q && !D);
    const Rt = n(".ppp-frame-label");
    Rt.hidden = !0;
    const Pt = O5(u) ?? B;
    B = Pt;
    const Oe = F5(u, Pt);
    n(".ppp-badge").hidden = !Oe;
    const Bs = n(".ppp-steps"), Xn = n(".ppp-stage");
    Bs.hidden = Xn.hidden = !Oe, Pt && Oe && (Bs.replaceChildren(...Ol(u.solo).map((j, st) => {
      const ce = b("li", "", st < Pt.at ? "done" : st === Pt.at ? Pt.blocked ? "now blocked" : "now" : "");
      return ce.append(b("span", st < Pt.at ? "✓" : String(st + 1), "n"), j), st === Pt.at && ce.setAttribute("aria-current", "step"), ce;
    })), Xn.textContent = Pt.caption, Xn.className = "ppp-stage " + (Pt.at >= Ol(u.solo).length ? "ppp-ok" : Pt.blocked ? "ppp-bad" : "ppp-cyan"));
    const Nn = n(".ppp-facts"), Ae = [];
    u.main && ((Xe = u.gate) != null && Xe.here) && !u.solo && Ae.push(...ot("Your wallet", $(u.main), "ppp-addr-short"));
    const Pr = () => {
      if (!u.listening) return;
      const j = qs("copy-listening", "Copy", () => u.listening || "", "tiny", () => Wt(o.snapshot()));
      Ae.push(...ot(u.linked ? "Listening wallet (technical)" : "Listening wallet", h(u.listening), "ppp-addr-short", j));
    };
    if (u.linked || Pr(), u.listening && u.step !== "intro")
      if (u.linked)
        Ae.push(...ot("Credited to", `${$(u.linked)} · plays, likes and returns`, u.linked === u.main || u.solo ? "ppp-ok" : "ppp-warn")), Pr();
      else if (u.solo) {
        u.creditedTo && Ae.push(...ot("Credited to", `${$(u.creditedTo)} · plays and likes`, "ppp-ok"));
        const j = u.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : u.returnTo ? `${$(u.returnTo)} · ${u.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : u.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Ae.push(...ot("Returns go to", u.gift ? j : u.returnTo && !O(u.returnTo) ? j.replace(h(u.returnTo), u.returnTo) : j, u.returnTo && !u.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Ae.push(...ot("Linked to", "not linked yet", "ppp-warn"));
    if (u.linkedListening.length && ((Be = u.gate) != null && Be.here)) {
      const j = u.linkedListening.map((st) => h(st) + (st === u.listening ? " (this one)" : "")).join(", ");
      Ae.push(...ot(u.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", j, "ppp-addr-short"));
    }
    if (u.balance !== void 0 && ["fund", "ready", "over"].includes(u.step)) {
      const j = u.balanceState === "ok" ? "ppp-ok" : u.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Ae.push(...ot("Balance", `${an(u.balance)} STX · about ${u.playsLeft.toLocaleString()} plays`, j));
    }
    const sn = u.entries.find((j) => j.kind === "play");
    sn && $t(), sn && Ae.push(...ot("Last paid song", `${de(sn)} → ${$(sn.recipient)}`, A[sn.status] || "")), Nn.replaceChildren(...Ae), Nn.hidden = !Ae.length;
    const lt = [], Mt = [], _t = [], De = [], kt = Nr(BigInt(((Zn = u.gate) == null ? void 0 : Zn.limits.playFee) ?? "300")), Ce = `Each song you listen to for 30 seconds sends ${an(Ul)} STX to whoever holds it, plus a ${an(kt - Ul)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, Hr = !!u.busy;
    switch (u.step) {
      case "elsewhere": {
        if (lt.push(b("p", "Pay artists as you listen.")), (Ts = u.gate) != null && Ts.radioUrl) {
          const st = b("p");
          st.append(w("Open the pay-per-play radio →", u.gate.radioUrl)), lt.push(st);
        }
        Mt.push(b("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (u.linked) {
          const st = [u.linked, ...u.others];
          lt.push(b("p", st.length > 1 ? `This device has listening wallets for ${H(st)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${$(u.linked)}. Connect that wallet to keep paying artists.`)), Mt.push(b("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          lt.push(b("p", "Connect your wallet to pay artists as you listen.")), Mt.push(b("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        lt.push(b("p", `This device's listening wallet belongs to ${$(u.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Mt.push(b("p", `You are connected as ${$(u.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), Mt.push(b("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), _t.push(T("Switch wallet", () => {
          var st;
          return (st = document.getElementById("radio-wallet-connect")) == null ? void 0 : st.click();
        }, "primary"));
        break;
      case "not-invited":
        lt.push(b("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        lt.push(b("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        lt.push(b("p", `Pay artists ${an(kt)} STX a song as you listen.`)), Mt.push(b("p", Ce)), Mt.push(b("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), Mt.push(b("p", u.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !u.solo && u.main && u.others.length ? (lt.push(b("p", `This device already has a listening wallet for ${H(u.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Mt.push(b("p", `Otherwise, set up a new listening wallet for ${$(u.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !u.solo && u.main && Mt.push(b("p", `This is the listening wallet for ${$(u.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), u.solo && Mt.push(b("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const j = a.liveGift();
        _t.push(T(j ? "Claim my gift · no wallet needed" : u.solo ? "Turn on pay-per-play · no wallet needed" : u.others.length && u.main ? `Set up for ${$(u.main)}` : "Turn on pay-per-play", () => void o.create(), "primary")), !j && !u.solo && u.main && u.others.length && _t.push(T("Switch wallet", () => {
          var st;
          return (st = document.getElementById("radio-wallet-connect")) == null ? void 0 : st.click();
        })), !j && u.solo && _t.push(T("I have a Stacks wallet", () => {
          var st;
          return (st = document.getElementById("radio-wallet-connect")) == null ? void 0 : st.click();
        })), _t.push(T("I already have a listening wallet", () => void o.unlock(!0))), j && _t.push(T("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        u.armed || (lt.push(b("p", "Locked.", "ppp-mute")), _t.push(T(u.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), De.push(T("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        lt.push(b("p", `Link to ${$(u.main)} · free`)), Mt.push(b("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Mt.push(b("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), _t.push(T(u.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        lt.push(b("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (u.depositPending || ((Ms = u.gift) != null && Ms.player ? lt.push(b("p", "Out of plays · add more to keep listening", "ppp-bad")) : u.entries.length ? lt.push(b("p", "Out of funds · top up to keep paying", "ppp-bad")) : lt.push(b("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / kt)).toLocaleString()} songs`))), (_s = u.gift) != null && _s.player ? Mt.push(b("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : u.entries.length && Mt.push(b("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), u.payingOn && !u.entries.length && Mt.push(b("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), u.solo ? (Mt.push(b("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Mt.push(b("p", u.listening || "", "ppp-addr-full")), u.listening && !u.depositPending && _t.push(qs("copy-address", "Copy my address", () => u.listening || "", "primary", () => Wt(o.snapshot())))) : Mt.push(b("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), u.depositPending && u.depositTxid) {
          const st = b("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          st.append(w("View", L(u.depositTxid))), lt.push(st);
        } else u.allowance > 0n && !u.solo && _t.push(T(`Deposit ${an(u.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        lt.push(b("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), u.solo && !u.returnTo && (lt.push(b("p", u.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), lt.push(z(u))), (!u.solo || u.returnTo) && _t.push(T("Return excess", () => void o.returnFunds("excess"), "primary"), T("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (u.payingOn && u.session && u.session.playsLeft > 0) {
          const st = Math.min(u.session.playsLeft, u.playsLeft);
          lt.push(b("p", `Paying as you listen · up to ${st.toLocaleString()} plays left`, "ppp-ok")), Mt.push(b("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), _t.push(T("Switch off", () => void o.switchOff()));
        } else
          lt.push(b("p", "Paying is off. Music stays free.", "ppp-mute")), _t.push(T("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        u.queued && lt.push(b("p", u.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${u.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), u.balanceState === "low" && lt.push(b("p", "Running low · top up", "ppp-warn")), u.depositPending ? lt.push(b("p", "Top-up on its way…", "ppp-warn")) : u.allowance > 0n && u.balanceState !== "ok" && !u.solo && _t.push(T(`Top up ${an(u.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (u.solo && u.walletCannotSolo && Mt.push(b("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), u.solo && ["fund", "ready"].includes(u.step) && ((u.balance ?? 0n) > 0n && Mt.push(z(u)), Mt.push(at()), u.step === "ready" && u.entries.some((j) => j.kind === "play" && j.status === "confirmed"))) {
      const j = b("p", "New to Stacks? ", "ppp-mute");
      j.append(w("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), lt.push(j);
    }
    if (u.walletOutdated && Mt.push(b("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), u.stuck && (lt.push(b("p", u.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${u.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), _t.push(T("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(u.step) && (u.returnTo || u.gift) && (u.balance ?? 0n) > 0n && De.push(T(u.linked ? "Return all to my wallet" : u.gift ? "Return what is left…" : `Return all to ${$(u.returnTo)}`, () => void o.returnFunds("all"), "quiet")), ["ready", "fund", "link", "over"].includes(u.step) && De.push(T("Lock", () => void o.lock(), "quiet")), ft && !Q && De.push(T(D ? "Hide listening wallet box" : "Show listening wallet box", () => {
      D = !D, Wt(o.snapshot());
    }, "quiet")), [..._t, ...De].forEach((j) => j.disabled = Hr), Hr && (_t.length = 0), u.balance !== void 0 && ["fund", "ready", "over"].includes(u.step) && !(u.step === "fund" && u.depositPending && u.balance === 0n) && !((Ns = u.gift) != null && Ns.player)) {
      const j = u.balanceState === "ok" ? "ppp-ok" : u.balanceState === "low" ? "ppp-warn" : "ppp-bad", st = lt.at(0);
      u.step === "ready" && st ? st.append(b("span", ` · ${x(u.balance)} STX`, j)) : lt.push(b("p", `Balance ${x(u.balance)} STX`, j));
    }
    if ((Te = u.gift) != null && Te.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(u.step)) {
      const j = b("p", "", "ppp-gift");
      j.append(`🎁 Gift Edition · ${u.gift.player.title}`), u.gift.player.subtitle && j.append(" · ", u.gift.player.subtitle);
      const st = ["ready", "fund", "over"].includes(u.step) && u.balance !== void 0 ? b("span", u.giftPlays === 0 ? " · no plays left" : ` · ${u.giftPlays.toLocaleString()} ${u.giftPlays === 1 ? "play" : "plays"} left`, u.giftPlays === 0 ? "ppp-bad" : u.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      st && j.append(st);
      const ce = (qe = lt.at(0)) == null ? void 0 : qe.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (u.step === "ready" && ce && /STX/.test(ce.textContent ?? "") && ce.remove(), lt.unshift(j), u.giftPlays <= 20 && ["ready", "fund"].includes(u.step) && !u.depositPending) {
        const he = b("p", u.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
        he.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), he.append(w("Xverse", "https://www.xverse.app/download"), " and ", w("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), lt.splice(1, 0, he);
      }
    }
    if (u.gift && !u.linked && ["fund", "ready", "over"].includes(u.step) && u.returnPlan.state === "ready") {
      const j = u.returnPlan, st = b("div", "", "ppp-pick");
      st.append(b("p", j.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const ce = b("ul", "", "ppp-gift-list");
      j.steps.forEach((he, Ye) => {
        const Or = he.kind === "gift" ? "the unused gift" : he.kind === "deposit" ? "what was added to it" : "the rest", Us = b("li");
        Us.append(b("span", `${Ye + 1}. ${an(BigInt(he.send))} STX · ${Or}`, "t"), b("span", he.to ? ` → ${$(he.to)}` : " → choose an address below", he.to ? "ppp-mute" : "ppp-warn")), ce.append(Us);
      }), st.append(ce), j.kept && st.append(b("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), j.steps.some((he) => !he.to) && st.append(z(u)), st.append(T(j.steps.length > 1 ? `Confirm part 1 of ${j.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), lt.push(st);
    }
    lt.unshift(...a.banner(u)), lt.unshift(...Nt(u)), W && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(u.step)) && lt.unshift(...S(W, a.pendingCode())), u.solo && u.creditedTo && u.listening && !["intro", "off", "elsewhere", "loading"].includes(u.step) && lt.unshift(b("p", `This is ${$(u.creditedTo)}'s listening wallet. Plays and likes count for ${$(u.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...lt);
    const yn = a.renderFold(u);
    if (n(".ppp-gifts").hidden = !yn, yn && !n(".ppp-gift-body").contains(yn) && n(".ppp-gift-body").replaceChildren(yn), yn && C) {
      C = !1;
      const j = n(".ppp-gifts");
      j.open = !0, requestAnimationFrame(() => j.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...Mt), n(".ppp-actions").replaceChildren(..._t), n(".ppp-actions2").replaceChildren(...De);
    const qn = u.busy || u.message || "";
    n(".ppp-msg").textContent = qn && lt.some((j) => (j.textContent ?? "").startsWith(qn.replace(/[.✓\s]+$/, ""))) ? "" : qn, n(".ppp-err").textContent = u.error;
    const Yn = u.entries.filter((j) => j.kind === "play");
    n(".ppp-recent").hidden = !u.entries.length, n(".ppp-recent-list").replaceChildren(...Yn.slice(0, 5).map((j) => {
      const st = b("li"), ce = j.status === "confirmed" ? "ok" : j.status === "failed" ? "bad" : "warn";
      return st.append(b("span", "", "d " + ce), b("span", de(j), "t"), b("span", m(j.created), "ppp-mute")), j.txid && st.append(w("tx", L(j.txid))), st;
    })), n(".ppp-wallets").hidden = !(Nn.childElementCount || De.length), n(".ppp-more").hidden = !Mt.length;
    const Un = n(".ppp-history");
    Un.hidden = !u.entries.length, u.entries.length && $t(), Un.replaceChildren(b("summary", `All activity (${u.entries.length})`), ...u.entries.slice(0, 20).map((j) => {
      const st = b("div", "", "ppp-row"), ce = j.kind === "play" ? [b("span", de(j), "ppp-song"), b("span", ` · ${an(BigInt(j.amount))} STX to ${$(j.recipient)}`, "ppp-mute")] : j.kind === "like" ? [b("span", `${j.liked ? "♥ Liked" : "Unliked"} ${de(j)}`, "ppp-song"), b("span", ` · for ${u.linked ? $(u.linked) : "this listening wallet"}`, "ppp-mute")] : [b("span", `Returned ${an(BigInt(j.amount))} STX`, "ppp-song"), b("span", ` to ${$(j.recipient)}`, "ppp-mute")];
      return st.append(
        b("span", N[j.status] || j.status, "ppp-status " + (A[j.status] || "")),
        ...ce,
        b("span", ` · ${new Date(j.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), j.txid && st.append(w("tx ↗", L(j.txid))), st;
    }));
  }
  const ge = /* @__PURE__ */ new Map(), ye = () => {
    const u = window.XtrataRadio;
    return u != null && u.subscribe ? (u.subscribe((E) => {
      const v = E == null ? void 0 : E.nowPlaying;
      v && Number.isSafeInteger(Number(v.tokenId)) && ge.set(Number(v.tokenId), { title: v.title || void 0, artist: v.artist || void 0 });
    }), !0) : !1;
  };
  if (!ye()) {
    const u = setInterval(() => {
      ye() && clearInterval(u);
    }, 500);
    setTimeout(() => clearInterval(u), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (u) => {
    const E = u.detail;
    if (E && Number.isSafeInteger(E.song) && typeof E.id == "string" && /^[0-9a-f]{32}$/.test(E.id)) {
      $t();
      const v = le(E.song, ge.get(E.song));
      o.onListened({ song: E.song, id: E.id, title: v.title || void 0, artist: v.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const j$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", z$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, R$ = () => z$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, G$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, K$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Ay = class {
  constructor(t) {
    _4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && J2(t), this.callback(Pa(t));
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
    var r, s, i, o, a, c, f, d, l, g;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (d = (f = t.googlePlayStoreUrl) !== null && f !== void 0 ? f : this.getBrowserUrl(t)) !== null && d !== void 0 ? d : t.webUrl : (g = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && g !== void 0 ? g : this.getMobileUrl(t);
  }
  render() {
    const t = R$(), e = G$(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return pt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, pt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), pt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, pt("div", { class: "flex flex-col space-y-[10px]" }, pt("div", { class: "flex items-center" }, pt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), pt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, pt("span", { class: "sr-only" }, "Close popup"), pt("img", { src: j$ }))), r ? pt("p", null, "Select the wallet you want to connect to.") : pt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && pt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && pt("div", { class: "mt-6" }, pt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), pt("ul", { class: "space-y-3" }, this.installedProviders.map((i) => pt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, pt("div", { class: "aspect-square basis-9 overflow-hidden" }, pt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), pt("div", { class: "flex-1" }, pt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && pt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), pt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && pt("div", { class: "mt-6" }, r ? pt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : pt("div", { class: "mb-5 flex justify-between" }, pt("p", { class: "text-sm font-medium" }, "Recommended wallets"), pt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, pt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, pt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), pt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), pt("p", null, "What is a wallet? ", pt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), pt("ul", { class: "space-y-3" }, n.map((i) => pt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, pt("div", { class: "aspect-square basis-9 overflow-hidden" }, pt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), pt("div", { class: "flex-1" }, pt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && pt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && pt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return p4(this);
  }
};
Ay.style = K$;
const V$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Ay
}, Symbol.toStringTag, { value: "Module" }));
