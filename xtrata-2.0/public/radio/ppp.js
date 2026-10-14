var Gy = Object.defineProperty;
var Ky = (t, e, n) => e in t ? Gy(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Fs = (t, e, n) => Ky(t, typeof e != "symbol" ? e + "" : e, n);
var _e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Yh(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Pa(t) {
  if (t.__esModule) return t;
  var e = t.default;
  if (typeof e == "function") {
    var n = function r() {
      return this instanceof r ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    n.prototype = e.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(t).forEach(function(r) {
    var i = Object.getOwnPropertyDescriptor(t, r);
    Object.defineProperty(n, r, i.get ? i : {
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
      typeof _e < "u" && _e || {}, r = {
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
      function i(S) {
        return S && DataView.prototype.isPrototypeOf(S);
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
        ], o = ArrayBuffer.isView || function(S) {
          return S && s.indexOf(Object.prototype.toString.call(S)) > -1;
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
        var C = {
          next: function() {
            var _ = S.shift();
            return { done: _ === void 0, value: _ };
          }
        };
        return r.iterable && (C[Symbol.iterator] = function() {
          return C;
        }), C;
      }
      function d(S) {
        this.map = {}, S instanceof d ? S.forEach(function(C, _) {
          this.append(_, C);
        }, this) : Array.isArray(S) ? S.forEach(function(C) {
          if (C.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + C.length);
          this.append(C[0], C[1]);
        }, this) : S && Object.getOwnPropertyNames(S).forEach(function(C) {
          this.append(C, S[C]);
        }, this);
      }
      d.prototype.append = function(S, C) {
        S = a(S), C = c(C);
        var _ = this.map[S];
        this.map[S] = _ ? _ + ", " + C : C;
      }, d.prototype.delete = function(S) {
        delete this.map[a(S)];
      }, d.prototype.get = function(S) {
        return S = a(S), this.has(S) ? this.map[S] : null;
      }, d.prototype.has = function(S) {
        return this.map.hasOwnProperty(a(S));
      }, d.prototype.set = function(S, C) {
        this.map[a(S)] = c(C);
      }, d.prototype.forEach = function(S, C) {
        for (var _ in this.map)
          this.map.hasOwnProperty(_) && S.call(C, this.map[_], _, this);
      }, d.prototype.keys = function() {
        var S = [];
        return this.forEach(function(C, _) {
          S.push(_);
        }), f(S);
      }, d.prototype.values = function() {
        var S = [];
        return this.forEach(function(C) {
          S.push(C);
        }), f(S);
      }, d.prototype.entries = function() {
        var S = [];
        return this.forEach(function(C, _) {
          S.push([_, C]);
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
        return new Promise(function(C, _) {
          S.onload = function() {
            C(S.result);
          }, S.onerror = function() {
            _(S.error);
          };
        });
      }
      function h(S) {
        var C = new FileReader(), _ = g(C);
        return C.readAsArrayBuffer(S), _;
      }
      function x(S) {
        var C = new FileReader(), _ = g(C), B = /charset=([A-Za-z0-9_-]+)/.exec(S.type), X = B ? B[1] : "utf-8";
        return C.readAsText(S, X), _;
      }
      function b(S) {
        for (var C = new Uint8Array(S), _ = new Array(C.length), B = 0; B < C.length; B++)
          _[B] = String.fromCharCode(C[B]);
        return _.join("");
      }
      function L(S) {
        if (S.slice)
          return S.slice(0);
        var C = new Uint8Array(S.byteLength);
        return C.set(new Uint8Array(S)), C.buffer;
      }
      function H() {
        return this.bodyUsed = !1, this._initBody = function(S) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = S, S ? typeof S == "string" ? this._bodyText = S : r.blob && Blob.prototype.isPrototypeOf(S) ? this._bodyBlob = S : r.formData && FormData.prototype.isPrototypeOf(S) ? this._bodyFormData = S : r.searchParams && URLSearchParams.prototype.isPrototypeOf(S) ? this._bodyText = S.toString() : r.arrayBuffer && r.blob && i(S) ? (this._bodyArrayBuffer = L(S.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(S) || o(S)) ? this._bodyArrayBuffer = L(S) : this._bodyText = S = Object.prototype.toString.call(S) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof S == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(S) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
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
            return Promise.resolve(b(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(I);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var U = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function p(S) {
        var C = S.toUpperCase();
        return U.indexOf(C) > -1 ? C : S;
      }
      function $(S, C) {
        if (!(this instanceof $))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        C = C || {};
        var _ = C.body;
        if (S instanceof $) {
          if (S.bodyUsed)
            throw new TypeError("Already read");
          this.url = S.url, this.credentials = S.credentials, C.headers || (this.headers = new d(S.headers)), this.method = S.method, this.mode = S.mode, this.signal = S.signal, !_ && S._bodyInit != null && (_ = S._bodyInit, S.bodyUsed = !0);
        } else
          this.url = String(S);
        if (this.credentials = C.credentials || this.credentials || "same-origin", (C.headers || !this.headers) && (this.headers = new d(C.headers)), this.method = p(C.method || this.method || "GET"), this.mode = C.mode || this.mode || null, this.signal = C.signal || this.signal || function() {
          if ("AbortController" in n) {
            var K = new AbortController();
            return K.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && _)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(_), (this.method === "GET" || this.method === "HEAD") && (C.cache === "no-store" || C.cache === "no-cache")) {
          var B = /([?&])_=[^&]*/;
          if (B.test(this.url))
            this.url = this.url.replace(B, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var X = /\?/;
            this.url += (X.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      $.prototype.clone = function() {
        return new $(this, { body: this._bodyInit });
      };
      function I(S) {
        var C = new FormData();
        return S.trim().split("&").forEach(function(_) {
          if (_) {
            var B = _.split("="), X = B.shift().replace(/\+/g, " "), K = B.join("=").replace(/\+/g, " ");
            C.append(decodeURIComponent(X), decodeURIComponent(K));
          }
        }), C;
      }
      function z(S) {
        var C = new d(), _ = S.replace(/\r?\n[\t ]+/g, " ");
        return _.split("\r").map(function(B) {
          return B.indexOf(`
`) === 0 ? B.substr(1, B.length) : B;
        }).forEach(function(B) {
          var X = B.split(":"), K = X.shift().trim();
          if (K) {
            var gt = X.join(":").trim();
            try {
              C.append(K, gt);
            } catch (ht) {
              console.warn("Response " + ht.message);
            }
          }
        }), C;
      }
      H.call($.prototype);
      function tt(S, C) {
        if (!(this instanceof tt))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (C || (C = {}), this.type = "default", this.status = C.status === void 0 ? 200 : C.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = C.statusText === void 0 ? "" : "" + C.statusText, this.headers = new d(C.headers), this.url = C.url || "", this._initBody(S);
      }
      H.call(tt.prototype), tt.prototype.clone = function() {
        return new tt(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, tt.error = function() {
        var S = new tt(null, { status: 200, statusText: "" });
        return S.ok = !1, S.status = 0, S.type = "error", S;
      };
      var F = [301, 302, 303, 307, 308];
      tt.redirect = function(S, C) {
        if (F.indexOf(C) === -1)
          throw new RangeError("Invalid status code");
        return new tt(null, { status: C, headers: { location: S } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(C, _) {
          this.message = C, this.name = _;
          var B = Error(C);
          this.stack = B.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function Y(S, C) {
        return new Promise(function(_, B) {
          var X = new $(S, C);
          if (X.signal && X.signal.aborted)
            return B(new e.DOMException("Aborted", "AbortError"));
          var K = new XMLHttpRequest();
          function gt() {
            K.abort();
          }
          K.onload = function() {
            var E = {
              statusText: K.statusText,
              headers: z(K.getAllResponseHeaders() || "")
            };
            X.url.indexOf("file://") === 0 && (K.status < 200 || K.status > 599) ? E.status = 200 : E.status = K.status, E.url = "responseURL" in K ? K.responseURL : E.headers.get("X-Request-URL");
            var M = "response" in K ? K.response : K.responseText;
            setTimeout(function() {
              _(new tt(M, E));
            }, 0);
          }, K.onerror = function() {
            setTimeout(function() {
              B(new TypeError("Network request failed"));
            }, 0);
          }, K.ontimeout = function() {
            setTimeout(function() {
              B(new TypeError("Network request timed out"));
            }, 0);
          }, K.onabort = function() {
            setTimeout(function() {
              B(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function ht(E) {
            try {
              return E === "" && n.location.href ? n.location.href : E;
            } catch {
              return E;
            }
          }
          if (K.open(X.method, ht(X.url), !0), X.credentials === "include" ? K.withCredentials = !0 : X.credentials === "omit" && (K.withCredentials = !1), "responseType" in K && (r.blob ? K.responseType = "blob" : r.arrayBuffer && (K.responseType = "arraybuffer")), C && typeof C.headers == "object" && !(C.headers instanceof d || n.Headers && C.headers instanceof n.Headers)) {
            var ye = [];
            Object.getOwnPropertyNames(C.headers).forEach(function(E) {
              ye.push(a(E)), K.setRequestHeader(E, c(C.headers[E]));
            }), X.headers.forEach(function(E, M) {
              ye.indexOf(M) === -1 && K.setRequestHeader(M, E);
            });
          } else
            X.headers.forEach(function(E, M) {
              K.setRequestHeader(M, E);
            });
          X.signal && (X.signal.addEventListener("abort", gt), K.onreadystatechange = function() {
            K.readyState === 4 && X.signal.removeEventListener("abort", gt);
          }), K.send(typeof X._bodyInit > "u" ? null : X._bodyInit);
        });
      }
      return Y.polyfill = !0, n.fetch || (n.fetch = Y, n.Headers = d, n.Request = $, n.Response = tt), e.Headers = d, e.Request = $, e.Response = tt, e.fetch = Y, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : _e);
})();
const Vy = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function qy(t, e) {
  const n = {};
  return Object.assign(n, Vy, e), await fetch(t, n);
}
function Xy(t) {
  let e = qy, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Wy(...t) {
  const { fetchLib: e, middlewares: n } = Xy(t);
  return async (i, s) => {
    let o = { url: i, init: s ?? {} };
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
var us;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(us || (us = {}));
var fi;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(fi || (fi = {}));
var bf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(bf || (bf = {}));
const Yy = "https://api.mainnet.hiro.so", Zy = "https://api.testnet.hiro.so", Qy = "http://localhost:3999", Jy = ["mainnet", "testnet", "devnet", "mocknet"];
let fs = class {
  constructor(e) {
    this.version = fi.Mainnet, this.chainId = us.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === fi.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, i) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${i}?proof=0`, this.getMapEntryUrl = (n, r, i) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${i}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Wy();
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
fs.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new qc();
    case "testnet":
      return new tw();
    case "devnet":
      return new ew();
    case "mocknet":
      return new Zh();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Jy.join(", ")}`);
  }
};
fs.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : fs.fromName(t);
let qc = class extends fs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Yy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = fi.Mainnet, this.chainId = us.Mainnet;
  }
}, tw = class extends fs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Zy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = fi.Testnet, this.chainId = us.Testnet;
  }
}, Zh = class extends fs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Qy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = fi.Testnet, this.chainId = us.Testnet;
  }
};
const ew = Zh, Qh = "xtrata.wallet.bridge.v1", nw = (t) => typeof t == "object" && t !== null && t.protocol === Qh, rw = (t) => nw(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", iw = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class js extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const mf = 12e4;
class sw {
  constructor(e) {
    Fs(this, "pending", /* @__PURE__ */ new Map());
    Fs(this, "listenTarget");
    Fs(this, "closed", !1);
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
    Fs(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !rw(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new js("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new js("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new js("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const i = iw(), s = { protocol: Qh, kind: "request", id: i, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(i), a(
          new js(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? mf}ms.`
          )
        );
      }, this.options.timeoutMs ?? mf);
      this.pending.set(i, { resolve: o, reject: a, timer: c }), r.postMessage(s, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new js("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const ow = ["SP", "SM"], aw = ["ST", "SN"], cw = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return ow.includes(n) ? "mainnet" : aw.includes(n) ? "testnet" : null;
}, lw = () => {
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
}, uw = () => typeof window > "u" || !window.localStorage ? lw() : window.localStorage, wc = "xtrata.v15.1.wallet.session", xf = "mainnet", ua = { isConnected: !1 }, fw = (t) => t.address ? cw(t.address) ?? t.network : t.network, Jh = (t) => !t.isConnected || !t.address ? { ...ua } : fw(t) !== xf ? { ...ua } : {
  isConnected: !0,
  address: t.address,
  network: xf,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, dw = (t) => {
  if (!t)
    return { ...ua };
  try {
    const e = JSON.parse(t);
    return Jh(e);
  } catch {
    return { ...ua };
  }
}, hw = (t) => {
  const e = Jh(t);
  return JSON.stringify(e);
}, pw = (t) => {
  const e = uw();
  return {
    load: () => dw(e.getItem(wc)),
    save: (n) => {
      e.setItem(wc, hw(n));
    },
    clear: () => {
      e.removeItem(wc);
    }
  };
}, gw = "https://browser.blockstack.org/auth", yw = {
  "@type": "Person",
  "@context": "http://schema.org"
}, t0 = ["store_write"], ww = "blockstack-session", bw = {
  logLevel: "debug"
}, Ci = {
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
Object.freeze(Ci);
class Ls extends Error {
  constructor(e) {
    super();
    let n = e.message, r = `Error Code: ${e.code}`, i = this.stack;
    if (i)
      r += `Stack Trace:
${i}`;
    else
      try {
        throw new Error();
      } catch (s) {
        i = s.stack;
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
class mw extends Ls {
  constructor(e, n = "") {
    super({ code: Ci.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Sf extends Ls {
  constructor(e = "") {
    super({ code: Ci.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class ko extends Ls {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Ci.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Ef extends Ls {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Ci.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Xc extends Ls {
  constructor(e) {
    super({ code: Ci.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class e0 extends Ls {
  constructor(e) {
    super({ code: Ci.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Af = ["debug", "info", "warn", "error", "none"], Wc = {};
for (let t = 0; t < Af.length; t++) {
  const e = Af[t];
  Wc[e] = t;
}
class ns {
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
    return Wc[bw.logLevel] <= Wc[e];
  }
}
function xw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Sw() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function bc(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((i) => parseInt(i, 10)), r = e.split(".").map((i) => parseInt(i, 10));
  for (let i = 0; i < e.length; i++)
    if (i >= t.length && r.push(0), n[i] < r[i])
      return !1;
  return !0;
}
function Ew() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Aw() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function vw(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function tu(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let i;
  try {
    if (i = Aw(), i) {
      const s = i[t];
      if (s)
        return s;
    }
  } catch (s) {
    ns.error(`Error getting object '${t}' from global scope '${i}': ${s}`);
  }
  if (e) {
    const s = vw(i, t.toString(), n);
    throw ns.error(s), new Error(s);
  }
  if (r)
    return {};
}
function Vr(t, e) {
  return eu(Ce(t), e);
}
function Ce(t) {
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
  if (Re(t, Uint8Array))
    return BigInt(`0x${st(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function $w(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function vf(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function po(t, e = 8) {
  return (typeof t == "bigint" ? t : Ce(t)).toString(16).padStart(e * 2, "0");
}
function Ha(t) {
  return parseInt(t, 16);
}
function eu(t, e = 16) {
  const n = po(t, e);
  return jt(n);
}
function Iw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function kw(t, e) {
  return t & BigInt(1) << e;
}
function Yc(t) {
  return Lw(BigInt(`0x${st(t)}`), BigInt(t.byteLength * 8));
}
function Lw(t, e) {
  return kw(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Cw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function st(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Cw[n];
  return e;
}
function jt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = $w(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, i = t.slice(r, r + 2), s = Number.parseInt(i, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    e[n] = s;
  }
  return e;
}
function Ti(t) {
  return new TextEncoder().encode(t);
}
function go(t) {
  return new TextDecoder().decode(t);
}
function Tw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Bw(t) {
  return String.fromCharCode.apply(null, t);
}
function Mw(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function $f(t) {
  if (t.some(Mw))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Fn(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, i) => r + i.length, 0), n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function pe(t) {
  return Fn(...t.map((e) => typeof e == "number" ? $f([e]) : e instanceof Array ? $f(e) : e));
}
function Re(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const n0 = "https://api.mainnet.hiro.so", r0 = "https://api.testnet.hiro.so", i0 = "http://localhost:3999", Nw = "https://hub.blockstack.org", _w = 33, mc = 32;
function Uw(t) {
  if (t.length < mc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + mc * 2), r = t.slice(2 + mc * 2);
  return {
    recoveryId: Ha(e),
    r: n,
    s: r
  };
}
function nu(t) {
  const e = typeof t == "string" ? jt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Pw(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Hw(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Ow(t, e) {
  return t[e];
}
function Dw(t, e, n = 0) {
  return t[n] = e, t;
}
function Fw(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function di(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const jw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function zw(t, e) {
  const n = {};
  return Object.assign(n, jw, e), await fetch(t, n);
}
function Rw(t) {
  let e = zw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Gw(...t) {
  const { fetchLib: e, middlewares: n } = Rw(t);
  return async (i, s) => {
    let o = { url: i, init: s ?? {} };
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
class s0 {
  constructor(e = t0.slice(), n = ((a) => (a = tu("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", i = "/manifest.json", s = void 0, o = gw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = i, this.coreNode = s, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Zc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Kw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function o0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Vw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Zc(t.outputLen), Zc(t.blockLen);
}
function qw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Xw(t, e) {
  o0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ei = {
  number: Zc,
  bool: Kw,
  bytes: o0,
  hash: Vw,
  exists: qw,
  output: Xw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const xc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ln = (t, e) => t << 32 - e | t >>> e, Ww = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Ww)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Yw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function ru(t) {
  if (typeof t == "string" && (t = Yw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let a0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Bi(t) {
  const e = (r) => t().update(ru(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let c0 = class extends a0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ei.hash(e);
    const r = ru(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, s = new Uint8Array(i);
    s.set(r.length > i ? e.create().update(r).digest() : r);
    for (let o = 0; o < s.length; o++)
      s[o] ^= 54;
    this.iHash.update(s), this.oHash = e.create();
    for (let o = 0; o < s.length; o++)
      s[o] ^= 106;
    this.oHash.update(s), s.fill(0);
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
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Oa = (t, e, n) => new c0(t, e).update(n).digest();
Oa.create = (t, e) => new c0(t, e);
function Zw(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let iu = class extends a0 {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = xc(this.buffer);
  }
  update(e) {
    ei.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = ru(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = xc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ei.exists(this), ei.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    Zw(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = xc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      a.setUint32(4 * l, d[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.length = i, e.pos = a, e.finished = s, e.destroyed = o, i % n && e.buffer.set(r), e;
  }
};
const Qw = (t, e, n) => t & e ^ ~t & n, Jw = (t, e, n) => t & e ^ t & n ^ e & n, tb = new Uint32Array([
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
]), pr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), gr = new Uint32Array(64);
let l0 = class extends iu {
  constructor() {
    super(64, 32, 8, !1), this.A = pr[0] | 0, this.B = pr[1] | 0, this.C = pr[2] | 0, this.D = pr[3] | 0, this.E = pr[4] | 0, this.F = pr[5] | 0, this.G = pr[6] | 0, this.H = pr[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      gr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = gr[l - 15], h = gr[l - 2], x = Ln(g, 7) ^ Ln(g, 18) ^ g >>> 3, b = Ln(h, 17) ^ Ln(h, 19) ^ h >>> 10;
      gr[l] = b + gr[l - 7] + x + gr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Ln(a, 6) ^ Ln(a, 11) ^ Ln(a, 25), h = d + g + Qw(a, c, f) + tb[l] + gr[l] | 0, b = (Ln(r, 2) ^ Ln(r, 13) ^ Ln(r, 22)) + Jw(r, i, s) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = s, s = i, i = r, r = h + b | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, f, d);
  }
  roundClean() {
    gr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, eb = class extends l0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const ds = Bi(() => new l0());
Bi(() => new eb());
const nb = {}, u0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: nb
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Dt = BigInt(0), re = BigInt(1), jr = BigInt(2), Ws = BigInt(3), If = BigInt(8), qt = Object.freeze({
  a: Dt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: re,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), kf = (t, e) => (t + e / jr) / e, Lo = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = qt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -re * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), i = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), s = n, o = BigInt("0x100000000000000000000000000000000"), a = kf(s * t, e), c = kf(-r * t, e);
    let f = q(t - a * n - c * i, e), d = q(-a * r - c * s, e);
    const l = f > o, g = d > o;
    if (l && (f = e - f), g && (d = e - d), f > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: f, k2neg: g, k2: d };
  }
}, Sn = 32, hi = 32, f0 = 32, fa = Sn + 1, da = 2 * Sn + 1;
function Lf(t) {
  const { a: e, b: n } = qt, r = q(t * t), i = q(r * t);
  return q(i + e * t + n);
}
const Co = qt.a === Dt;
class su extends Error {
  constructor(e) {
    super(e);
  }
}
function Cf(t) {
  if (!(t instanceof Rt))
    throw new TypeError("JacobianPoint expected");
}
class Rt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Tt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Tt.ZERO) ? Rt.ZERO : new Rt(e.x, e.y, re);
  }
  static toAffineBatch(e) {
    const n = ab(e.map((r) => r.z));
    return e.map((r, i) => r.toAffine(n[i]));
  }
  static normalizeZ(e) {
    return Rt.toAffineBatch(e).map(Rt.fromAffine);
  }
  equals(e) {
    Cf(e);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = e, c = q(i * i), f = q(a * a), d = q(n * f), l = q(s * c), g = q(q(r * a) * f), h = q(q(o * i) * c);
    return d === l && g === h;
  }
  negate() {
    return new Rt(this.x, q(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, i = q(e * e), s = q(n * n), o = q(s * s), a = e + s, c = q(jr * (q(a * a) - i - o)), f = q(Ws * i), d = q(f * f), l = q(d - jr * c), g = q(f * (c - l) - If * o), h = q(jr * n * r);
    return new Rt(l, g, h);
  }
  add(e) {
    Cf(e);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = e;
    if (s === Dt || o === Dt)
      return this;
    if (n === Dt || r === Dt)
      return e;
    const c = q(i * i), f = q(a * a), d = q(n * f), l = q(s * c), g = q(q(r * a) * f), h = q(q(o * i) * c), x = q(l - d), b = q(h - g);
    if (x === Dt)
      return b === Dt ? this.double() : Rt.ZERO;
    const L = q(x * x), H = q(x * L), U = q(d * L), p = q(b * b - H - jr * U), $ = q(b * (U - p) - g * H), I = q(i * a * x);
    return new Rt(p, $, I);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Rt.ZERO;
    if (typeof e == "bigint" && e === Dt)
      return n;
    let r = Mf(e);
    if (r === re)
      return this;
    if (!Co) {
      let l = n, g = this;
      for (; r > Dt; )
        r & re && (l = l.add(g)), g = g.double(), r >>= re;
      return l;
    }
    let { k1neg: i, k1: s, k2neg: o, k2: a } = Lo.splitScalar(r), c = n, f = n, d = this;
    for (; s > Dt || a > Dt; )
      s & re && (c = c.add(d)), a & re && (f = f.add(d)), d = d.double(), s >>= re, a >>= re;
    return i && (c = c.negate()), o && (f = f.negate()), f = new Rt(q(f.x * Lo.beta), f.y, f.z), c.add(f);
  }
  precomputeWindow(e) {
    const n = Co ? 128 / e + 1 : 256 / e + 1, r = [];
    let i = this, s = i;
    for (let o = 0; o < n; o++) {
      s = i, r.push(s);
      for (let a = 1; a < 2 ** (e - 1); a++)
        s = s.add(i), r.push(s);
      i = s.double();
    }
    return r;
  }
  wNAF(e, n) {
    !n && this.equals(Rt.BASE) && (n = Tt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let i = n && Qc.get(n);
    i || (i = this.precomputeWindow(r), n && r !== 1 && (i = Rt.normalizeZ(i), Qc.set(n, i)));
    let s = Rt.ZERO, o = Rt.BASE;
    const a = 1 + (Co ? 128 / r : 256 / r), c = 2 ** (r - 1), f = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let g = 0; g < a; g++) {
      const h = g * c;
      let x = Number(e & f);
      e >>= l, x > c && (x -= d, e += re);
      const b = h, L = h + Math.abs(x) - 1, H = g % 2 !== 0, U = x < 0;
      x === 0 ? o = o.add(To(H, i[b])) : s = s.add(To(U, i[L]));
    }
    return { p: s, f: o };
  }
  multiply(e, n) {
    let r = Mf(e), i, s;
    if (Co) {
      const { k1neg: o, k1: a, k2neg: c, k2: f } = Lo.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: g, f: h } = this.wNAF(f, n);
      d = To(o, d), g = To(c, g), g = new Rt(q(g.x * Lo.beta), g.y, g.z), i = d.add(g), s = l.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      i = o, s = a;
    }
    return Rt.normalizeZ([i, s])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: i } = this, s = this.equals(Rt.ZERO);
    e == null && (e = s ? If : Cs(i));
    const o = e, a = q(o * o), c = q(a * o), f = q(n * a), d = q(r * c), l = q(i * o);
    if (s)
      return Tt.ZERO;
    if (l !== re)
      throw new Error("invZ was invalid");
    return new Tt(f, d);
  }
}
Rt.BASE = new Rt(qt.Gx, qt.Gy, re);
Rt.ZERO = new Rt(Dt, re, Dt);
function To(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Qc = /* @__PURE__ */ new WeakMap();
class Tt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Qc.delete(this);
  }
  hasEvenY() {
    return this.y % jr === Dt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Qe(n ? e : e.subarray(1));
    if (!na(r))
      throw new Error("Point is not on curve");
    const i = Lf(r);
    let s = ob(i);
    const o = (s & re) === re;
    n ? o && (s = q(-s)) : (e[0] & 1) === 1 !== o && (s = q(-s));
    const a = new Tt(r, s);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Qe(e.subarray(1, Sn + 1)), r = Qe(e.subarray(Sn + 1, Sn * 2 + 1)), i = new Tt(n, r);
    return i.assertValidity(), i;
  }
  static fromHex(e) {
    const n = jn(e), r = n.length, i = n[0];
    if (r === Sn)
      return this.fromCompressedHex(n);
    if (r === fa && (i === 2 || i === 3))
      return this.fromCompressedHex(n);
    if (r === da && i === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${fa} compressed bytes or ${da} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Tt.BASE.multiply(pi(e));
  }
  static fromSignature(e, n, r) {
    const { r: i, s } = p0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = ou(jn(e)), { n: a } = qt, c = r === 2 || r === 3 ? i + a : i, f = Cs(c, a), d = q(-o * f, a), l = q(s * f, a), g = r & 1 ? "03" : "02", h = Tt.fromHex(g + zr(c)), x = Tt.BASE.multiplyAndAddUnsafe(h, d, l);
    if (!x)
      throw new Error("Cannot recover signature: point at infinify");
    return x.assertValidity(), x;
  }
  toRawBytes(e = !1) {
    return Rr(this.toHex(e));
  }
  toHex(e = !1) {
    const n = zr(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${zr(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!na(n) || !na(r))
      throw new Error(e);
    const i = q(r * r), s = Lf(n);
    if (q(i - s) !== Dt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Tt(this.x, q(-this.y));
  }
  double() {
    return Rt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return Rt.fromAffine(this).add(Rt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return Rt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const i = Rt.fromAffine(this), s = n === Dt || n === re || this !== Tt.BASE ? i.multiplyUnsafe(n) : i.multiply(n), o = Rt.fromAffine(e).multiplyUnsafe(r), a = s.add(o);
    return a.equals(Rt.ZERO) ? void 0 : a.toAffine();
  }
}
Tt.BASE = new Tt(qt.Gx, qt.Gy);
Tt.ZERO = new Tt(Dt, Dt);
function Tf(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Bf(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${hs(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Qe(n), left: t.subarray(e + 2) };
}
function rb(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${hs(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Bf(t.subarray(2)), { data: r, left: i } = Bf(n);
  if (i.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${hs(i)}`);
  return { r: e, s: r };
}
class Ze {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const i = n ? hs(e) : e;
    if (i.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Ze(ha(i.slice(0, 64)), ha(i.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s: i } = rb(n ? e : Rr(e));
    return new Ze(r, i);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!gs(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!gs(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = qt.n >> re;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Ze(this.r, q(-this.s, qt.n)) : this;
  }
  toDERRawBytes() {
    return Rr(this.toDERHex());
  }
  toDERHex() {
    const e = Tf(zs(this.s)), n = Tf(zs(this.r)), r = e.length / 2, i = n.length / 2, s = zs(r), o = zs(i);
    return `30${zs(i + r + 4)}02${o}${n}02${s}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Rr(this.toCompactHex());
  }
  toCompactHex() {
    return zr(this.r) + zr(this.s);
  }
}
function Dr(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, i) => r + i.length, 0), n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
const ib = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function hs(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += ib[t[n]];
  return e;
}
const sb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function zr(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Dt <= t && t < sb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function ps(t) {
  const e = Rr(zr(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function zs(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function ha(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Rr(t) {
  if (typeof t != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof t);
  if (t.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + t.length);
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, i = t.slice(r, r + 2), s = Number.parseInt(i, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    e[n] = s;
  }
  return e;
}
function Qe(t) {
  return ha(hs(t));
}
function jn(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Rr(t);
}
function Mf(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && gs(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function q(t, e = qt.P) {
  const n = t % e;
  return n >= Dt ? n : e + n;
}
function an(t, e) {
  const { P: n } = qt;
  let r = t;
  for (; e-- > Dt; )
    r *= r, r %= n;
  return r;
}
function ob(t) {
  const { P: e } = qt, n = BigInt(6), r = BigInt(11), i = BigInt(22), s = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, f = c * c * t % e, d = an(f, Ws) * f % e, l = an(d, Ws) * f % e, g = an(l, jr) * c % e, h = an(g, r) * g % e, x = an(h, i) * h % e, b = an(x, o) * x % e, L = an(b, a) * b % e, H = an(L, o) * x % e, U = an(H, Ws) * f % e, p = an(U, s) * h % e, $ = an(p, n) * c % e, I = an($, jr);
  if (I * I % e !== t)
    throw new Error("Cannot find square root");
  return I;
}
function Cs(t, e = qt.P) {
  if (t === Dt || e <= Dt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = q(t, e), r = e, i = Dt, s = re;
  for (; n !== Dt; ) {
    const a = r / n, c = r % n, f = i - s * a;
    r = n, n = c, i = s, s = f;
  }
  if (r !== re)
    throw new Error("invert: does not exist");
  return q(i, e);
}
function ab(t, e = qt.P) {
  const n = new Array(t.length), r = t.reduce((s, o, a) => o === Dt ? s : (n[a] = s, q(s * o, e)), re), i = Cs(r, e);
  return t.reduceRight((s, o, a) => o === Dt ? s : (n[a] = q(s * n[a], e), q(s * o, e)), i), n;
}
function cb(t) {
  const e = t.length * 8 - hi * 8, n = Qe(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function ou(t, e = !1) {
  const n = cb(t);
  if (e)
    return n;
  const { n: r } = qt;
  return n >= r ? n - r : n;
}
let cs, Ys;
class d0 {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return fe.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return Ys(this.k, ...e);
  }
  checkSync() {
    if (typeof Ys != "function")
      throw new su("hmacSha256Sync needs to be set");
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
    return Dr(...n);
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
    return Dr(...n);
  }
}
function gs(t) {
  return Dt < t && t < qt.n;
}
function na(t) {
  return Dt < t && t < qt.P;
}
function h0(t, e, n, r = !0) {
  const { n: i } = qt, s = ou(t, !0);
  if (!gs(s))
    return;
  const o = Cs(s, i), a = Tt.BASE.multiply(s), c = q(a.x, i);
  if (c === Dt)
    return;
  const f = q(o * q(e + n * c, i), i);
  if (f === Dt)
    return;
  let d = new Ze(c, f), l = (a.x === d.r ? 0 : 2) | Number(a.y & re);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function pi(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * hi)
      throw new Error("Expected 32 bytes of private key");
    e = ha(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== hi)
      throw new Error("Expected 32 bytes of private key");
    e = Qe(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!gs(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function au(t) {
  return t instanceof Tt ? (t.assertValidity(), t) : Tt.fromHex(t);
}
function p0(t) {
  if (t instanceof Ze)
    return t.assertValidity(), t;
  try {
    return Ze.fromDER(t);
  } catch {
    return Ze.fromCompact(t);
  }
}
function yo(t, e = !1) {
  return Tt.fromPrivateKey(t).toRawBytes(e);
}
function lb(t, e, n, r = !1) {
  return Tt.fromSignature(t, e, n).toRawBytes(r);
}
function Nf(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === fa || r === da : n ? r === fa * 2 || r === da * 2 : t instanceof Tt;
}
function cu(t, e, n = !1) {
  if (Nf(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Nf(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = au(e);
  return r.assertValidity(), r.multiply(pi(t)).toRawBytes(n);
}
function g0(t) {
  const e = t.length > Sn ? t.slice(0, Sn) : t;
  return Qe(e);
}
function ub(t) {
  const e = g0(t), n = q(e, qt.n);
  return y0(n < Dt ? e : n);
}
function y0(t) {
  return ps(t);
}
function w0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = jn(t), i = pi(e), s = [y0(i), ub(r)];
  if (n != null) {
    n === !0 && (n = fe.randomBytes(Sn));
    const c = jn(n);
    if (c.length !== Sn)
      throw new Error(`sign: Expected ${Sn} bytes of extra data`);
    s.push(c);
  }
  const o = Dr(...s), a = g0(r);
  return { seed: o, m: a, d: i };
}
function b0(t, e) {
  const { sig: n, recovery: r } = t, { der: i, recovered: s } = Object.assign({ canonical: !0, der: !0 }, e), o = i ? n.toDERRawBytes() : n.toCompactRawBytes();
  return s ? [o, r] : o;
}
async function fb(t, e, n = {}) {
  const { seed: r, m: i, d: s } = w0(t, e, n.extraEntropy), o = new d0(f0, hi);
  await o.reseed(r);
  let a;
  for (; !(a = h0(await o.generate(), i, s, n.canonical)); )
    await o.reseed();
  return b0(a, n);
}
function Da(t, e, n = {}) {
  const { seed: r, m: i, d: s } = w0(t, e, n.extraEntropy), o = new d0(f0, hi);
  o.reseedSync(r);
  let a;
  for (; !(a = h0(o.generateSync(), i, s, n.canonical)); )
    o.reseedSync();
  return b0(a, n);
}
const db = { strict: !0 };
function hb(t, e, n, r = db) {
  let i;
  try {
    i = p0(t), e = jn(e);
  } catch {
    return !1;
  }
  const { r: s, s: o } = i;
  if (r.strict && i.hasHighS())
    return !1;
  const a = ou(e);
  let c;
  try {
    c = au(n);
  } catch {
    return !1;
  }
  const { n: f } = qt, d = Cs(o, f), l = q(a * d, f), g = q(s * d, f), h = Tt.BASE.multiplyAndAddUnsafe(c, l, g);
  return h ? q(h.x, f) === s : !1;
}
function pa(t) {
  return q(Qe(t), qt.n);
}
class ys {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = jn(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Qe(n.subarray(0, 32)), i = Qe(n.subarray(32, 64));
    return new ys(r, i);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!na(e) || !gs(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return zr(this.r) + zr(this.s);
  }
  toRawBytes() {
    return Rr(this.toHex());
  }
}
function pb(t) {
  return Tt.fromPrivateKey(t).toRawX();
}
class m0 {
  constructor(e, n, r = fe.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = jn(e);
    const { x: i, scalar: s } = this.getScalar(pi(n));
    if (this.px = i, this.d = s, this.rand = jn(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Tt.fromPrivateKey(e), r = n.hasEvenY() ? e : qt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return ps(e ^ Qe(n));
  }
  finalizeNonce(e) {
    const n = q(Qe(e), qt.n);
    if (n === Dt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: i, scalar: s } = this.getScalar(n);
    return { R: r, rx: i, k: s };
  }
  finalizeSig(e, n, r, i) {
    return new ys(e.x, q(n + r * i, qt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: i } = this, s = fe.taggedHash, o = this.initNonce(n, await s(Or.aux, i)), { R: a, rx: c, k: f } = this.finalizeNonce(await s(Or.nonce, o, r, e)), d = pa(await s(Or.challenge, c, r, e)), l = this.finalizeSig(a, f, d, n);
    return await E0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: i } = this, s = fe.taggedHashSync, o = this.initNonce(n, s(Or.aux, i)), { R: a, rx: c, k: f } = this.finalizeNonce(s(Or.nonce, o, r, e)), d = pa(s(Or.challenge, c, r, e)), l = this.finalizeSig(a, f, d, n);
    return A0(l, e, r) || this.error(), l;
  }
}
async function gb(t, e, n) {
  return new m0(t, e, n).calc();
}
function yb(t, e, n) {
  return new m0(t, e, n).calcSync();
}
function x0(t, e, n) {
  const r = t instanceof ys, i = r ? t : ys.fromHex(t);
  return r && i.assertValidity(), {
    ...i,
    m: jn(e),
    P: au(n)
  };
}
function S0(t, e, n, r) {
  const i = Tt.BASE.multiplyAndAddUnsafe(e, pi(n), q(-r, qt.n));
  return !(!i || !i.hasEvenY() || i.x !== t);
}
async function E0(t, e, n) {
  try {
    const { r, s: i, m: s, P: o } = x0(t, e, n), a = pa(await fe.taggedHash(Or.challenge, ps(r), o.toRawX(), s));
    return S0(r, o, i, a);
  } catch {
    return !1;
  }
}
function A0(t, e, n) {
  try {
    const { r, s: i, m: s, P: o } = x0(t, e, n), a = pa(fe.taggedHashSync(Or.challenge, ps(r), o.toRawX(), s));
    return S0(r, o, i, a);
  } catch (r) {
    if (r instanceof su)
      throw r;
    return !1;
  }
}
const wb = {
  Signature: ys,
  getPublicKey: pb,
  sign: gb,
  verify: E0,
  signSync: yb,
  verifySync: A0
};
Tt.BASE._setWindowSize(8);
const Ve = {
  node: u0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Or = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Bo = {}, fe = {
  bytesToHex: hs,
  hexToBytes: Rr,
  concatBytes: Dr,
  mod: q,
  invert: Cs,
  isValidPrivateKey(t) {
    try {
      return pi(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: ps,
  _normalizePrivateKey: pi,
  hashToPrivateKey: (t) => {
    t = jn(t);
    const e = hi + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = q(Qe(t), qt.n - re) + re;
    return ps(n);
  },
  randomBytes: (t = 32) => {
    if (Ve.web)
      return Ve.web.getRandomValues(new Uint8Array(t));
    if (Ve.node) {
      const { randomBytes: e } = Ve.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => fe.hashToPrivateKey(fe.randomBytes(hi + 8)),
  precompute(t = 8, e = Tt.BASE) {
    const n = e === Tt.BASE ? e : new Tt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Ws), n;
  },
  sha256: async (...t) => {
    if (Ve.web) {
      const e = await Ve.web.subtle.digest("SHA-256", Dr(...t));
      return new Uint8Array(e);
    } else if (Ve.node) {
      const { createHash: e } = Ve.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Ve.web) {
      const n = await Ve.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Dr(...e), i = await Ve.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(i);
    } else if (Ve.node) {
      const { createHmac: n } = Ve.node, r = n("sha256", t);
      return e.forEach((i) => r.update(i)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Bo[t];
    if (n === void 0) {
      const r = await fe.sha256(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      n = Dr(r, r), Bo[t] = n;
    }
    return fe.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof cs != "function")
      throw new su("sha256Sync is undefined, you need to set it");
    let n = Bo[t];
    if (n === void 0) {
      const r = cs(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      n = Dr(r, r), Bo[t] = n;
    }
    return cs(n, ...e);
  },
  _JacobianPoint: Rt
};
Object.defineProperties(fe, {
  sha256Sync: {
    configurable: !1,
    get() {
      return cs;
    },
    set(t) {
      cs || (cs = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Ys;
    },
    set(t) {
      Ys || (Ys = t);
    }
  }
});
const bb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: qt,
  Point: Tt,
  Signature: Ze,
  getPublicKey: yo,
  getSharedSecret: cu,
  recoverPublicKey: lb,
  schnorr: wb,
  sign: fb,
  signSync: Da,
  utils: fe,
  verify: hb
}, Symbol.toStringTag, { value: "Module" }));
var wo = {};
wo.byteLength = Ab;
var mb = wo.toByteArray = $b, xb = wo.fromByteArray = Lb, Nn = [], ln = [], Sb = typeof Uint8Array < "u" ? Uint8Array : Array, Sc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Wi = 0, Eb = Sc.length; Wi < Eb; ++Wi)
  Nn[Wi] = Sc[Wi], ln[Sc.charCodeAt(Wi)] = Wi;
ln[45] = 62;
ln[95] = 63;
function v0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Ab(t) {
  var e = v0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function vb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function $b(t) {
  var e, n = v0(t), r = n[0], i = n[1], s = new Sb(vb(t, r, i)), o = 0, a = i > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = ln[t.charCodeAt(c)] << 18 | ln[t.charCodeAt(c + 1)] << 12 | ln[t.charCodeAt(c + 2)] << 6 | ln[t.charCodeAt(c + 3)], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
  return i === 2 && (e = ln[t.charCodeAt(c)] << 2 | ln[t.charCodeAt(c + 1)] >> 4, s[o++] = e & 255), i === 1 && (e = ln[t.charCodeAt(c)] << 10 | ln[t.charCodeAt(c + 1)] << 4 | ln[t.charCodeAt(c + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
}
function Ib(t) {
  return Nn[t >> 18 & 63] + Nn[t >> 12 & 63] + Nn[t >> 6 & 63] + Nn[t & 63];
}
function kb(t, e, n) {
  for (var r, i = [], s = e; s < n; s += 3)
    r = (t[s] << 16 & 16711680) + (t[s + 1] << 8 & 65280) + (t[s + 2] & 255), i.push(Ib(r));
  return i.join("");
}
function Lb(t) {
  for (var e, n = t.length, r = n % 3, i = [], s = 16383, o = 0, a = n - r; o < a; o += s)
    i.push(kb(t, o, o + s > a ? a : o + s));
  return r === 1 ? (e = t[n - 1], i.push(
    Nn[e >> 2] + Nn[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], i.push(
    Nn[e >> 10] + Nn[e >> 4 & 63] + Nn[e << 2 & 63] + "="
  )), i.join("");
}
function Cb() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Tb = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Bb() {
  if (Cb())
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
    throw new Error(Tb);
  }
}
class Mb {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, i) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createCipher(e, n, r), o = new Uint8Array(Fn(s.update(i), s.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, i) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createDecipher(e, n, r), o = new Uint8Array(Fn(s.update(i), s.final()));
    return Promise.resolve(o);
  }
}
class Nb {
  constructor(e) {
    this.subtleCrypto = e;
  }
  async encrypt(e, n, r, i) {
    let s, o;
    if (e === "aes-128-cbc")
      s = "AES-CBC", o = 128;
    else if (e === "aes-256-cbc")
      s = "AES-CBC", o = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: s, length: o }, !1, ["encrypt"]), c = await this.subtleCrypto.encrypt({ name: s, iv: r }, a, i);
    return new Uint8Array(c);
  }
  async decrypt(e, n, r, i) {
    let s, o;
    if (e === "aes-128-cbc")
      s = "AES-CBC", o = 128;
    else if (e === "aes-256-cbc")
      s = "AES-CBC", o = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: s, length: o }, !1, ["decrypt"]), c = await this.subtleCrypto.decrypt({ name: s, iv: r }, a, i);
    return new Uint8Array(c);
  }
}
async function $0() {
  const t = await Bb();
  return t.name === "subtleCrypto" ? new Nb(t.lib) : new Mb(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function _b(t) {
  if (t.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var e = new Uint8Array(256), n = 0; n < e.length; n++)
    e[n] = 255;
  for (var r = 0; r < t.length; r++) {
    var i = t.charAt(r), s = i.charCodeAt(0);
    if (e[s] !== 255)
      throw new TypeError(i + " is ambiguous");
    e[s] = r;
  }
  var o = t.length, a = t.charAt(0), c = Math.log(o) / Math.log(256), f = Math.log(256) / Math.log(o);
  function d(h) {
    if (h instanceof Uint8Array || (ArrayBuffer.isView(h) ? h = new Uint8Array(h.buffer, h.byteOffset, h.byteLength) : Array.isArray(h) && (h = Uint8Array.from(h))), !(h instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (h.length === 0)
      return "";
    for (var x = 0, b = 0, L = 0, H = h.length; L !== H && h[L] === 0; )
      L++, x++;
    for (var U = (H - L) * f + 1 >>> 0, p = new Uint8Array(U); L !== H; ) {
      for (var $ = h[L], I = 0, z = U - 1; ($ !== 0 || I < b) && z !== -1; z--, I++)
        $ += 256 * p[z] >>> 0, p[z] = $ % o >>> 0, $ = $ / o >>> 0;
      if ($ !== 0)
        throw new Error("Non-zero carry");
      b = I, L++;
    }
    for (var tt = U - b; tt !== U && p[tt] === 0; )
      tt++;
    for (var F = a.repeat(x); tt < U; ++tt)
      F += t.charAt(p[tt]);
    return F;
  }
  function l(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var x = 0, b = 0, L = 0; h[x] === a; )
      b++, x++;
    for (var H = (h.length - x) * c + 1 >>> 0, U = new Uint8Array(H); h[x]; ) {
      var p = h.charCodeAt(x);
      if (p > 255)
        return;
      var $ = e[p];
      if ($ === 255)
        return;
      for (var I = 0, z = H - 1; ($ !== 0 || I < L) && z !== -1; z--, I++)
        $ += o * U[z] >>> 0, U[z] = $ % 256 >>> 0, $ = $ / 256 >>> 0;
      if ($ !== 0)
        throw new Error("Non-zero carry");
      L = I, x++;
    }
    for (var tt = H - L; tt !== H && U[tt] === 0; )
      tt++;
    for (var F = new Uint8Array(b + (H - tt)), Y = b; tt !== H; )
      F[Y++] = U[tt++];
    return F;
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
var I0 = _b;
const Ub = I0, Pb = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Hb = Ub(Pb);
const Ob = /* @__PURE__ */ Yh(Hb), Db = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), k0 = Uint8Array.from({ length: 16 }, (t, e) => e), Fb = k0.map((t) => (9 * t + 5) % 16);
let lu = [k0], uu = [Fb];
for (let t = 0; t < 4; t++)
  for (let e of [lu, uu])
    e.push(e[t].map((n) => Db[n]));
const L0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), jb = lu.map((t, e) => t.map((n) => L0[e][n])), zb = uu.map((t, e) => t.map((n) => L0[e][n])), Rb = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Gb = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Mo = (t, e) => t << e | t >>> 32 - e;
function _f(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const No = new Uint32Array(16);
let Kb = class extends iu {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: i, h4: s } = this;
    return [e, n, r, i, s];
  }
  set(e, n, r, i, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let h = 0; h < 16; h++, n += 4)
      No[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, b = Rb[h], L = Gb[h], H = lu[h], U = uu[h], p = jb[h], $ = zb[h];
      for (let I = 0; I < 16; I++) {
        const z = Mo(r + _f(h, s, a, f) + No[H[I]] + b, p[I]) + l | 0;
        r = l, l = f, f = Mo(a, 10) | 0, a = s, s = z;
      }
      for (let I = 0; I < 16; I++) {
        const z = Mo(i + _f(x, o, c, d) + No[U[I]] + L, $[I]) + g | 0;
        i = g, g = d, d = Mo(c, 10) | 0, c = o, o = z;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    No.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Vb = Bi(() => new Kb());
function qb(t) {
  return Vb(t);
}
const _o = BigInt(2 ** 32 - 1), Jc = BigInt(32);
function C0(t, e = !1) {
  return e ? { h: Number(t & _o), l: Number(t >> Jc & _o) } : { h: Number(t >> Jc & _o) | 0, l: Number(t & _o) | 0 };
}
function Xb(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = C0(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const Wb = (t, e) => BigInt(t >>> 0) << Jc | BigInt(e >>> 0), Yb = (t, e, n) => t >>> n, Zb = (t, e, n) => t << 32 - n | e >>> n, Qb = (t, e, n) => t >>> n | e << 32 - n, Jb = (t, e, n) => t << 32 - n | e >>> n, t1 = (t, e, n) => t << 64 - n | e >>> n - 32, e1 = (t, e, n) => t >>> n - 32 | e << 64 - n, n1 = (t, e) => e, r1 = (t, e) => t, i1 = (t, e, n) => t << n | e >>> 32 - n, s1 = (t, e, n) => e << n | t >>> 32 - n, o1 = (t, e, n) => e << n - 32 | t >>> 64 - n, a1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function c1(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const l1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), u1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, f1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), d1 = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, h1 = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), p1 = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Et = {
  fromBig: C0,
  split: Xb,
  toBig: Wb,
  shrSH: Yb,
  shrSL: Zb,
  rotrSH: Qb,
  rotrSL: Jb,
  rotrBH: t1,
  rotrBL: e1,
  rotr32H: n1,
  rotr32L: r1,
  rotlSH: i1,
  rotlSL: s1,
  rotlBH: o1,
  rotlBL: a1,
  add: c1,
  add3L: l1,
  add3H: u1,
  add4L: f1,
  add4H: d1,
  add5H: p1,
  add5L: h1
}, [g1, y1] = Et.split([
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
].map((t) => BigInt(t))), yr = new Uint32Array(80), wr = new Uint32Array(80);
let Fa = class extends iu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: x, Hh: b, Hl: L } = this;
    return [e, n, r, i, s, o, a, c, f, d, l, g, h, x, b, L];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, f, d, l, g, h, x, b, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = b | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      yr[p] = e.getUint32(n), wr[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const $ = yr[p - 15] | 0, I = wr[p - 15] | 0, z = Et.rotrSH($, I, 1) ^ Et.rotrSH($, I, 8) ^ Et.shrSH($, I, 7), tt = Et.rotrSL($, I, 1) ^ Et.rotrSL($, I, 8) ^ Et.shrSL($, I, 7), F = yr[p - 2] | 0, Y = wr[p - 2] | 0, S = Et.rotrSH(F, Y, 19) ^ Et.rotrBH(F, Y, 61) ^ Et.shrSH(F, Y, 6), C = Et.rotrSL(F, Y, 19) ^ Et.rotrBL(F, Y, 61) ^ Et.shrSL(F, Y, 6), _ = Et.add4L(tt, C, wr[p - 7], wr[p - 16]), B = Et.add4H(_, z, S, yr[p - 7], yr[p - 16]);
      yr[p] = B | 0, wr[p] = _ | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: x, Gh: b, Gl: L, Hh: H, Hl: U } = this;
    for (let p = 0; p < 80; p++) {
      const $ = Et.rotrSH(l, g, 14) ^ Et.rotrSH(l, g, 18) ^ Et.rotrBH(l, g, 41), I = Et.rotrSL(l, g, 14) ^ Et.rotrSL(l, g, 18) ^ Et.rotrBL(l, g, 41), z = l & h ^ ~l & b, tt = g & x ^ ~g & L, F = Et.add5L(U, I, tt, y1[p], wr[p]), Y = Et.add5H(F, H, $, z, g1[p], yr[p]), S = F | 0, C = Et.rotrSH(r, i, 28) ^ Et.rotrBH(r, i, 34) ^ Et.rotrBH(r, i, 39), _ = Et.rotrSL(r, i, 28) ^ Et.rotrBL(r, i, 34) ^ Et.rotrBL(r, i, 39), B = r & s ^ r & a ^ s & a, X = i & o ^ i & c ^ o & c;
      H = b | 0, U = L | 0, b = h | 0, L = x | 0, h = l | 0, x = g | 0, { h: l, l: g } = Et.add(f | 0, d | 0, Y | 0, S | 0), f = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const K = Et.add3L(S, _, X);
      r = Et.add3H(K, Y, C, B), i = K | 0;
    }
    ({ h: r, l: i } = Et.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Et.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = Et.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = Et.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: x } = Et.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: b, l: L } = Et.add(this.Gh | 0, this.Gl | 0, b | 0, L | 0), { h: H, l: U } = Et.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, i, s, o, a, c, f, d, l, g, h, x, b, L, H, U);
  }
  roundClean() {
    yr.fill(0), wr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, w1 = class extends Fa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, b1 = class extends Fa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, m1 = class extends Fa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const x1 = Bi(() => new Fa());
Bi(() => new w1());
Bi(() => new b1());
Bi(() => new m1());
function T0(t) {
  return ds(t);
}
function S1(t) {
  return x1(t);
}
const E1 = 0;
fe.hmacSha256Sync = (t, ...e) => {
  const n = Oa.create(ds, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function A1() {
  return st(fe.randomPrivateKey());
}
function v1(t) {
  const e = ds(ds(t));
  return Ob.encode(Fn(t, e).slice(0, t.length + 4));
}
function $1(t, e) {
  return v1(Fn(new Uint8Array([t]), e.slice(0, 20)));
}
function B0(t, e = E1) {
  const n = typeof t == "string" ? jt(t) : t, r = qb(T0(n));
  return $1(e, r);
}
function M0(t) {
  const e = nu(t);
  return st(yo(e.slice(0, 32), !0));
}
fe.hmacSha256Sync = (t, ...e) => {
  const n = Oa.create(ds, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var ga;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(ga || (ga = {}));
async function I1(t, e, n) {
  return await (await $0()).encrypt("aes-256-cbc", e, t, n);
}
async function k1(t, e, n) {
  return await (await $0()).decrypt("aes-256-cbc", e, t, n);
}
function N0(t, e) {
  return Oa(ds, t, e);
}
function L1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function _0(t) {
  const e = S1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function C1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function T1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: ga.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: ga.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !C1(t))
    return e;
  try {
    return Tt.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function B1(t, e, n, r) {
  const i = T1(t);
  if (!i.result)
    throw i;
  const s = fe.randomPrivateKey(), o = yo(s, !0);
  let a = cu(s, t, !0);
  a = a.slice(1);
  const c = _0(a), f = fe.randomBytes(16), d = await I1(f, c.encryptionKey, e), l = Fn(f, o, d), g = N0(c.hmacKey, l);
  let h;
  if (!r || r === "hex")
    h = st(d);
  else if (r === "base64")
    h = xb(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const x = {
    iv: st(f),
    ephemeralPK: st(o),
    cipherText: h,
    mac: st(g),
    wasString: n
  };
  return r && r !== "hex" && (x.cipherTextEncoding = r), x;
}
async function U0(t, e) {
  if (!e.ephemeralPK)
    throw new Ef("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = cu(t, n, !0);
  r = r.slice(1);
  const i = _0(r), s = jt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = jt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = mb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = Fn(s, jt(n), o), c = N0(i.hmacKey, a), f = jt(e.mac);
  if (!L1(f, c))
    throw new Ef("Decryption failed: failure in MAC check");
  const d = await k1(s, i.encryptionKey, o);
  return e.wasString ? go(d) : d;
}
function M1(t, e) {
  const n = typeof e == "string" ? Ti(e) : e, r = M0(t), i = T0(n), s = Da(i, t);
  return {
    signature: st(s),
    publicKey: r
  };
}
async function N1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = M0(n.privateKey);
  }
  const i = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", s = typeof t == "string" ? Ti(t) : t, o = await B1(n.publicKey, s, i, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = M1(r, a), f = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(f);
  }
  return a;
}
function _1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return U0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Ie = {}, ws = {}, Me = {};
Object.defineProperty(Me, "__esModule", { value: !0 });
Me.decode = Me.encode = Me.unescape = Me.escape = Me.pad = void 0;
const P0 = wo;
function fu(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
Me.pad = fu;
function H0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Me.escape = H0;
function O0(t) {
  return fu(t).replace(/-/g, "+").replace(/_/g, "/");
}
Me.unescape = O0;
function U1(t) {
  return H0((0, P0.fromByteArray)(new TextEncoder().encode(t)));
}
Me.encode = U1;
function P1(t) {
  return new TextDecoder().decode((0, P0.toByteArray)(fu(O0(t))));
}
Me.decode = P1;
var ja = {}, za = {}, D0 = {}, F0 = {}, Ra = {};
Object.defineProperty(Ra, "__esModule", { value: !0 });
Ra.crypto = void 0;
Ra.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = i, t.ahash = s, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = f, t.clean = d, t.createView = l, t.rotr = g, t.rotl = h, t.byteSwap = x, t.byteSwap32 = b, t.bytesToHex = U, t.hexToBytes = I, t.asyncLoop = tt, t.utf8ToBytes = F, t.bytesToUtf8 = Y, t.toBytes = S, t.kdfInputToBytes = C, t.concatBytes = _, t.checkOpts = B, t.createHasher = K, t.createOptHasher = gt, t.createXOFer = ht, t.randomBytes = ye;
  const e = Ra;
  function n(E) {
    return E instanceof Uint8Array || ArrayBuffer.isView(E) && E.constructor.name === "Uint8Array";
  }
  function r(E) {
    if (!Number.isSafeInteger(E) || E < 0)
      throw new Error("positive integer expected, got " + E);
  }
  function i(E, ...M) {
    if (!n(E))
      throw new Error("Uint8Array expected");
    if (M.length > 0 && !M.includes(E.length))
      throw new Error("Uint8Array expected of length " + M + ", got length=" + E.length);
  }
  function s(E) {
    if (typeof E != "function" || typeof E.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(E.outputLen), r(E.blockLen);
  }
  function o(E, M = !0) {
    if (E.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (M && E.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(E, M) {
    i(E);
    const kt = M.outputLen;
    if (E.length < kt)
      throw new Error("digestInto() expects output buffer of length at least " + kt);
  }
  function c(E) {
    return new Uint8Array(E.buffer, E.byteOffset, E.byteLength);
  }
  function f(E) {
    return new Uint32Array(E.buffer, E.byteOffset, Math.floor(E.byteLength / 4));
  }
  function d(...E) {
    for (let M = 0; M < E.length; M++)
      E[M].fill(0);
  }
  function l(E) {
    return new DataView(E.buffer, E.byteOffset, E.byteLength);
  }
  function g(E, M) {
    return E << 32 - M | E >>> M;
  }
  function h(E, M) {
    return E << M | E >>> 32 - M >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function x(E) {
    return E << 24 & 4278190080 | E << 8 & 16711680 | E >>> 8 & 65280 | E >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (E) => E : (E) => x(E), t.byteSwapIfBE = t.swap8IfBE;
  function b(E) {
    for (let M = 0; M < E.length; M++)
      E[M] = x(E[M]);
    return E;
  }
  t.swap32IfBE = t.isLE ? (E) => E : b;
  const L = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", H = /* @__PURE__ */ Array.from({ length: 256 }, (E, M) => M.toString(16).padStart(2, "0"));
  function U(E) {
    if (i(E), L)
      return E.toHex();
    let M = "";
    for (let kt = 0; kt < E.length; kt++)
      M += H[E[kt]];
    return M;
  }
  const p = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function $(E) {
    if (E >= p._0 && E <= p._9)
      return E - p._0;
    if (E >= p.A && E <= p.F)
      return E - (p.A - 10);
    if (E >= p.a && E <= p.f)
      return E - (p.a - 10);
  }
  function I(E) {
    if (typeof E != "string")
      throw new Error("hex string expected, got " + typeof E);
    if (L)
      return Uint8Array.fromHex(E);
    const M = E.length, kt = M / 2;
    if (M % 2)
      throw new Error("hex string expected, got unpadded hex of length " + M);
    const pt = new Uint8Array(kt);
    for (let ut = 0, xt = 0; ut < kt; ut++, xt += 2) {
      const Pt = $(E.charCodeAt(xt)), Nt = $(E.charCodeAt(xt + 1));
      if (Pt === void 0 || Nt === void 0) {
        const Xt = E[xt] + E[xt + 1];
        throw new Error('hex string expected, got non-hex character "' + Xt + '" at index ' + xt);
      }
      pt[ut] = Pt * 16 + Nt;
    }
    return pt;
  }
  const z = async () => {
  };
  t.nextTick = z;
  async function tt(E, M, kt) {
    let pt = Date.now();
    for (let ut = 0; ut < E; ut++) {
      kt(ut);
      const xt = Date.now() - pt;
      xt >= 0 && xt < M || (await (0, t.nextTick)(), pt += xt);
    }
  }
  function F(E) {
    if (typeof E != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(E));
  }
  function Y(E) {
    return new TextDecoder().decode(E);
  }
  function S(E) {
    return typeof E == "string" && (E = F(E)), i(E), E;
  }
  function C(E) {
    return typeof E == "string" && (E = F(E)), i(E), E;
  }
  function _(...E) {
    let M = 0;
    for (let pt = 0; pt < E.length; pt++) {
      const ut = E[pt];
      i(ut), M += ut.length;
    }
    const kt = new Uint8Array(M);
    for (let pt = 0, ut = 0; pt < E.length; pt++) {
      const xt = E[pt];
      kt.set(xt, ut), ut += xt.length;
    }
    return kt;
  }
  function B(E, M) {
    if (M !== void 0 && {}.toString.call(M) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(E, M);
  }
  class X {
  }
  t.Hash = X;
  function K(E) {
    const M = (pt) => E().update(S(pt)).digest(), kt = E();
    return M.outputLen = kt.outputLen, M.blockLen = kt.blockLen, M.create = () => E(), M;
  }
  function gt(E) {
    const M = (pt, ut) => E(ut).update(S(pt)).digest(), kt = E({});
    return M.outputLen = kt.outputLen, M.blockLen = kt.blockLen, M.create = (pt) => E(pt), M;
  }
  function ht(E) {
    const M = (pt, ut) => E(ut).update(S(pt)).digest(), kt = E({});
    return M.outputLen = kt.outputLen, M.blockLen = kt.blockLen, M.create = (pt) => E(pt), M;
  }
  t.wrapConstructor = K, t.wrapConstructorWithOpts = gt, t.wrapXOFConstructorWithOpts = ht;
  function ye(E = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(E));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(E));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(F0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = F0;
  class n extends e.Hash {
    constructor(s, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(s);
      const a = (0, e.toBytes)(o);
      if (this.iHash = s.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, f = new Uint8Array(c);
      f.set(a.length > c ? s.create().update(a).digest() : a);
      for (let d = 0; d < f.length; d++)
        f[d] ^= 54;
      this.iHash.update(f), this.oHash = s.create();
      for (let d = 0; d < f.length; d++)
        f[d] ^= 106;
      this.oHash.update(f), (0, e.clean)(f);
    }
    update(s) {
      return (0, e.aexists)(this), this.iHash.update(s), this;
    }
    digestInto(s) {
      (0, e.aexists)(this), (0, e.abytes)(s, this.outputLen), this.finished = !0, this.iHash.digestInto(s), this.oHash.update(s), this.oHash.digestInto(s), this.destroy();
    }
    digest() {
      const s = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(s), s;
    }
    _cloneInto(s) {
      s || (s = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: o, iHash: a, finished: c, destroyed: f, blockLen: d, outputLen: l } = this;
      return s = s, s.finished = c, s.destroyed = f, s.blockLen = d, s.outputLen = l, s.oHash = o._cloneInto(s.oHash), s.iHash = a._cloneInto(s.iHash), s;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  t.HMAC = n;
  const r = (i, s, o) => new n(i, s).update(o).digest();
  t.hmac = r, t.hmac.create = (i, s) => new n(i, s);
})(D0);
const Yi = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function j0(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function tl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Mi(t, ...e) {
  if (!j0(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function H1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  tl(t.outputLen), tl(t.blockLen);
}
function el(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function z0(t, e) {
  Mi(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function O1(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function D1(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function ya(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function ra(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function pn(t, e) {
  return t << 32 - e | t >>> e;
}
function F1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const du = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function hu(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const R0 = du ? (t) => t : (t) => hu(t), j1 = R0;
function G0(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = hu(t[e]);
  return t;
}
const z1 = du ? (t) => t : G0, K0 = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", R1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function V0(t) {
  if (Mi(t), K0)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += R1[t[n]];
  return e;
}
const Zn = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Uf(t) {
  if (t >= Zn._0 && t <= Zn._9)
    return t - Zn._0;
  if (t >= Zn.A && t <= Zn.F)
    return t - (Zn.A - 10);
  if (t >= Zn.a && t <= Zn.f)
    return t - (Zn.a - 10);
}
function G1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (K0)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let i = 0, s = 0; i < n; i++, s += 2) {
    const o = Uf(t.charCodeAt(s)), a = Uf(t.charCodeAt(s + 1));
    if (o === void 0 || a === void 0) {
      const c = t[s] + t[s + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + s);
    }
    r[i] = o * 16 + a;
  }
  return r;
}
const q0 = async () => {
};
async function K1(t, e, n) {
  let r = Date.now();
  for (let i = 0; i < t; i++) {
    n(i);
    const s = Date.now() - r;
    s >= 0 && s < e || (await q0(), r += s);
  }
}
function pu(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function V1(t) {
  return new TextDecoder().decode(t);
}
function bo(t) {
  return typeof t == "string" && (t = pu(t)), Mi(t), t;
}
function q1(t) {
  return typeof t == "string" && (t = pu(t)), Mi(t), t;
}
function X1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const i = t[r];
    Mi(i), e += i.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function W1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let X0 = class {
};
function Ga(t) {
  const e = (r) => t().update(bo(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function W0(t) {
  const e = (r, i) => t(i).update(bo(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Y0(t) {
  const e = (r, i) => t(i).update(bo(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const Y1 = Ga, Z1 = W0, Q1 = Y0;
function J1(t = 32) {
  if (Yi && typeof Yi.getRandomValues == "function")
    return Yi.getRandomValues(new Uint8Array(t));
  if (Yi && typeof Yi.randomBytes == "function")
    return Uint8Array.from(Yi.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const tm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: X0,
  abytes: Mi,
  aexists: el,
  ahash: H1,
  anumber: tl,
  aoutput: z0,
  asyncLoop: K1,
  byteSwap: hu,
  byteSwap32: G0,
  byteSwapIfBE: j1,
  bytesToHex: V0,
  bytesToUtf8: V1,
  checkOpts: W1,
  clean: ya,
  concatBytes: X1,
  createHasher: Ga,
  createOptHasher: W0,
  createView: ra,
  createXOFer: Y0,
  hexToBytes: G1,
  isBytes: j0,
  isLE: du,
  kdfInputToBytes: q1,
  nextTick: q0,
  randomBytes: J1,
  rotl: F1,
  rotr: pn,
  swap32IfBE: z1,
  swap8IfBE: R0,
  toBytes: bo,
  u32: D1,
  u8: O1,
  utf8ToBytes: pu,
  wrapConstructor: Y1,
  wrapConstructorWithOpts: Z1,
  wrapXOFConstructorWithOpts: Q1
}, Symbol.toStringTag, { value: "Module" }));
function em(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
function nm(t, e, n) {
  return t & e ^ ~t & n;
}
function rm(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class im extends X0 {
  constructor(e, n, r, i) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.buffer = new Uint8Array(e), this.view = ra(this.buffer);
  }
  update(e) {
    el(this), e = bo(e), Mi(e);
    const { view: n, buffer: r, blockLen: i } = this, s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = ra(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    el(this), z0(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, ya(this.buffer.subarray(o)), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    em(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = ra(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      a.setUint32(4 * l, d[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.destroyed = o, e.finished = s, e.length = i, e.pos = a, i % n && e.buffer.set(r), e;
  }
  clone() {
    return this._cloneInto();
  }
}
const br = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), mr = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), sm = /* @__PURE__ */ Uint32Array.from([
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
]), xr = /* @__PURE__ */ new Uint32Array(64);
let gu = class extends im {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = br[0] | 0, this.B = br[1] | 0, this.C = br[2] | 0, this.D = br[3] | 0, this.E = br[4] | 0, this.F = br[5] | 0, this.G = br[6] | 0, this.H = br[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      xr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = xr[l - 15], h = xr[l - 2], x = pn(g, 7) ^ pn(g, 18) ^ g >>> 3, b = pn(h, 17) ^ pn(h, 19) ^ h >>> 10;
      xr[l] = b + xr[l - 7] + x + xr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = pn(a, 6) ^ pn(a, 11) ^ pn(a, 25), h = d + g + nm(a, c, f) + sm[l] + xr[l] | 0, b = (pn(r, 2) ^ pn(r, 13) ^ pn(r, 22)) + rm(r, i, s) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = s, s = i, i = r, r = h + b | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, f, d);
  }
  roundClean() {
    ya(xr);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), ya(this.buffer);
  }
}, Z0 = class extends gu {
  constructor() {
    super(28), this.A = mr[0] | 0, this.B = mr[1] | 0, this.C = mr[2] | 0, this.D = mr[3] | 0, this.E = mr[4] | 0, this.F = mr[5] | 0, this.G = mr[6] | 0, this.H = mr[7] | 0;
  }
};
const om = /* @__PURE__ */ Ga(() => new gu()), am = /* @__PURE__ */ Ga(() => new Z0()), cm = gu, Q0 = om, lm = Z0, um = am, fm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: lm,
  SHA256: cm,
  sha224: um,
  sha256: Q0
}, Symbol.toStringTag, { value: "Module" })), Ka = /* @__PURE__ */ Pa(fm), dm = /* @__PURE__ */ Pa(bb);
var bs = {};
Object.defineProperty(bs, "__esModule", { value: !0 });
bs.joseToDer = bs.derToJose = void 0;
const J0 = wo, tp = Me;
function Ec(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const hm = {
  ES256: Ec(256),
  ES384: Ec(384),
  ES512: Ec(521)
};
function ep(t) {
  const e = hm[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const wa = 128, np = 0, pm = 32, gm = 16, ym = 2, rp = gm | pm | np << 6, ba = ym | np << 6;
function ip(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, J0.toByteArray)((0, tp.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function wm(t, e) {
  const n = ip(t), r = ep(e), i = r + 1, s = n.length;
  let o = 0;
  if (n[o++] !== rp)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (wa | 1) && (a = n[o++]), s - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${s - o}" remaining`);
  if (n[o++] !== ba)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (s - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${s - o - 2}" available`);
  if (i < c)
    throw new Error(`"r" specified length of "${c}", max of "${i}" is acceptable`);
  const f = o;
  if (o += c, n[o++] !== ba)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[o++];
  if (s - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${s - o}"`);
  if (i < d)
    throw new Error(`"s" specified length of "${d}", max of "${i}" is acceptable`);
  const l = o;
  if (o += d, o !== s)
    throw new Error(`Expected to consume entire array, but "${s - o}" bytes remain`);
  const g = r - c, h = r - d, x = new Uint8Array(g + c + h + d);
  for (o = 0; o < g; ++o)
    x[o] = 0;
  x.set(n.subarray(f + Math.max(-g, 0), f + c), o), o = r;
  for (const b = o; o < b + h; ++o)
    x[o] = 0;
  return x.set(n.subarray(l + Math.max(-h, 0), l + d), o), (0, tp.escape)((0, J0.fromByteArray)(x));
}
bs.derToJose = wm;
function Pf(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= wa && --r, r;
}
function bm(t, e) {
  t = ip(t);
  const n = ep(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const i = Pf(t, 0, n), s = Pf(t, n, t.length), o = n - i, a = n - s, c = 2 + o + 1 + 1 + a, f = c < wa, d = new Uint8Array((f ? 2 : 3) + c);
  let l = 0;
  return d[l++] = rp, f ? d[l++] = c : (d[l++] = wa | 1, d[l++] = c & 255), d[l++] = ba, d[l++] = o, i < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(i, n), l), l += n - i), d[l++] = ba, d[l++] = a, s < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + s), l), d;
}
bs.joseToDer = bm;
var sr = {};
Object.defineProperty(sr, "__esModule", { value: !0 });
sr.InvalidTokenError = sr.MissingParametersError = void 0;
class mm extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
sr.MissingParametersError = mm;
class xm extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
sr.InvalidTokenError = xm;
const mo = /* @__PURE__ */ Pa(tm);
Object.defineProperty(za, "__esModule", { value: !0 });
za.SECP256K1Client = void 0;
const Sm = D0, Em = Ka, ia = dm, Hf = bs, Of = sr, Df = mo;
ia.utils.hmacSha256Sync = (t, ...e) => {
  const n = Sm.hmac.create(Em.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class sp {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Df.bytesToHex)(ia.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Of.MissingParametersError("a signing input hash and private key are all required");
    const i = ia.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Df.bytesToHex)(i);
    if (r === "jose")
      return (0, Hf.derToJose)(i, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Hf.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Of.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return ia.verify(n, e, r, { strict: !1 });
  }
}
za.SECP256K1Client = sp;
sp.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = za;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(ja);
var gi = {};
const Am = /* @__PURE__ */ Pa(u0);
var vm = _e && _e.__awaiter || function(t, e, n, r) {
  function i(s) {
    return s instanceof n ? s : new n(function(o) {
      o(s);
    });
  }
  return new (n || (n = Promise))(function(s, o) {
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
      d.done ? s(d.value) : i(d.value).then(a, c);
    }
    f((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(gi, "__esModule", { value: !0 });
gi.hashSha256Async = gi.hashSha256 = void 0;
const $m = Ka;
function op(t) {
  return (0, $m.sha256)(t);
}
gi.hashSha256 = op;
function Im(t) {
  return vm(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Am;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(op(t));
    }
  });
}
gi.hashSha256Async = Im;
var km = _e && _e.__awaiter || function(t, e, n, r) {
  function i(s) {
    return s instanceof n ? s : new n(function(o) {
      o(s);
    });
  }
  return new (n || (n = Promise))(function(s, o) {
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
      d.done ? s(d.value) : i(d.value).then(a, c);
    }
    f((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(ws, "__esModule", { value: !0 });
ws.TokenSigner = ws.createUnsecuredToken = void 0;
const nl = Me, Ff = ja, Lm = sr, jf = gi;
function rl(t, e) {
  const n = [], r = nl.encode(JSON.stringify(e));
  n.push(r);
  const i = nl.encode(JSON.stringify(t));
  return n.push(i), n.join(".");
}
function Cm(t) {
  return rl(t, { typ: "JWT", alg: "none" }) + ".";
}
ws.createUnsecuredToken = Cm;
class Tm {
  constructor(e, n) {
    if (!(e && n))
      throw new Lm.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Ff.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Ff.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const i = this.header(r), s = rl(e, i), o = (0, jf.hashSha256)(s);
    return this.createWithSignedHash(e, n, i, s, o);
  }
  signAsync(e, n = !1, r = {}) {
    return km(this, void 0, void 0, function* () {
      const i = this.header(r), s = rl(e, i), o = yield (0, jf.hashSha256Async)(s);
      return this.createWithSignedHash(e, n, i, s, o);
    });
  }
  createWithSignedHash(e, n, r, i, s) {
    const o = this.cryptoClient.signHash(s, this.rawPrivateKey);
    return n ? {
      header: [nl.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [i, o].join(".");
  }
}
ws.TokenSigner = Tm;
var Va = {};
Object.defineProperty(Va, "__esModule", { value: !0 });
Va.TokenVerifier = void 0;
const Bm = Me, zf = ja, Mm = sr, Uo = gi;
class Nm {
  constructor(e, n) {
    if (!(e && n))
      throw new Mm.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !zf.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = zf.cryptoClients[e], this.rawPublicKey = n;
  }
  verify(e) {
    return typeof e == "string" ? this.verifyCompact(e, !1) : typeof e == "object" ? this.verifyExpanded(e, !1) : !1;
  }
  verifyAsync(e) {
    return typeof e == "string" ? this.verifyCompact(e, !0) : typeof e == "object" ? this.verifyExpanded(e, !0) : Promise.resolve(!1);
  }
  verifyCompact(e, n) {
    const r = e.split("."), i = r[0] + "." + r[1], s = (o) => {
      const a = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(o, a, this.rawPublicKey);
    };
    if (n)
      return (0, Uo.hashSha256Async)(i).then((o) => s(o));
    {
      const o = (0, Uo.hashSha256)(i);
      return s(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Bm.encode(e.payload)].join(".");
    let i = !0;
    const s = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (i = !1);
    }), i);
    if (n)
      return (0, Uo.hashSha256Async)(r).then((o) => s(o));
    {
      const o = (0, Uo.hashSha256)(r);
      return s(o);
    }
  }
}
Va.TokenVerifier = Nm;
var qa = {};
Object.defineProperty(qa, "__esModule", { value: !0 });
qa.decodeToken = void 0;
const Po = Me;
function _m(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Po.decode(e[0])), r = JSON.parse(Po.decode(e[1])), i = e[2];
    return {
      header: n,
      payload: r,
      signature: i
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Po.decode(e));
    const n = [];
    return t.header.map((r) => {
      const i = JSON.parse(Po.decode(r));
      n.push(i);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
qa.decodeToken = _m;
(function(t) {
  var e = _e && _e.__createBinding || (Object.create ? function(r, i, s, o) {
    o === void 0 && (o = s);
    var a = Object.getOwnPropertyDescriptor(i, s);
    (!a || ("get" in a ? !i.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return i[s];
    } }), Object.defineProperty(r, o, a);
  } : function(r, i, s, o) {
    o === void 0 && (o = s), r[o] = i[s];
  }), n = _e && _e.__exportStar || function(r, i) {
    for (var s in r) s !== "default" && !Object.prototype.hasOwnProperty.call(i, s) && e(i, r, s);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(ws, t), n(Va, t), n(qa, t), n(sr, t), n(ja, t);
})(Ie);
function Um(t) {
  return `did:btc-addr:${t}`;
}
function Pm(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Sf("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Sf('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function ap(t) {
  if (t)
    return Pm(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Hm = "1.4.0";
function Om() {
  return A1();
}
function Dm(t, e, n, r = t0.slice(), i, s = xw().getTime(), o = {}) {
  const a = (h) => {
    const x = tu("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return x == null ? void 0 : x.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), i || (i = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Ew(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(s / 1e3),
    iss: null,
    public_keys: [],
    domain_name: i,
    manifest_uri: n,
    redirect_uri: e,
    version: Hm,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), f = Ie.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [f];
  const d = B0(f);
  return c.iss = Um(d), new Ie.TokenSigner("ES256k", t).sign(c);
}
async function Rf(t, e) {
  const n = go(jt(e)), r = JSON.parse(n), i = await U0(t, r);
  if (typeof i != "string")
    throw new Error("Unable to correctly decrypt private key");
  return i;
}
function Fm(t) {
  const e = Ie.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Ie.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function jm(t) {
  const e = Ie.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = ap(e.iss);
  if (n.length === 1) {
    if (B0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function zm(t) {
  const e = Ie.decodeToken(t).payload;
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
function Rm(t) {
  const e = Ie.decodeToken(t).payload;
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
function Gm(t) {
  const e = [
    Rm(t),
    zm(t),
    Fm(t),
    jm(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Gf = "1.0.0";
class Gr {
  constructor(e) {
    this.version = Gf, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Gf)
      throw new Xc(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Gr(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class cp {
  constructor(e) {
    if (e) {
      const n = new Gr(e);
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
class Kf extends cp {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Gr({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new e0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Gr({})), !0;
  }
}
class Vf extends cp {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = ww, !localStorage.getItem(this.key)) {
      const r = new Gr({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new e0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Gr.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Gr({})), !0;
  }
}
var no;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(no || (no = {}));
var ma;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ma || (ma = {}));
no.Mainnet;
var nr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(nr || (nr = {}));
var Pn;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Pn || (Pn = {}));
nr.Mainnet;
const lp = {
  chainId: no.Mainnet,
  transactionVersion: nr.Mainnet,
  peerNetworkId: ma.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Pn.MainnetSingleSig,
    multiSig: Pn.MainnetMultiSig
  },
  client: { baseUrl: n0 }
}, il = {
  chainId: no.Testnet,
  transactionVersion: nr.Testnet,
  peerNetworkId: ma.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Pn.TestnetSingleSig,
    multiSig: Pn.TestnetMultiSig
  },
  client: { baseUrl: r0 }
}, sa = {
  ...il,
  addressVersion: { ...il.addressVersion },
  magicBytes: "id",
  client: { baseUrl: i0 }
}, Km = {
  ...sa,
  addressVersion: { ...sa.addressVersion },
  client: { ...sa.client }
};
function Vm(t) {
  switch (t) {
    case "mainnet":
      return lp;
    case "testnet":
      return il;
    case "devnet":
      return sa;
    case "mocknet":
      return Km;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function up(t) {
  return typeof t == "string" ? Vm(t) : t;
}
var qf;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(qf || (qf = {}));
var Xf;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Xf || (Xf = {}));
var yn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(yn || (yn = {}));
const Ac = ["onChainOnly", "offChainOnly", "any"];
Ac[0] + "", yn.OnChainOnly, Ac[1] + "", yn.OffChainOnly, Ac[2] + "", yn.Any, yn.OnChainOnly + "", yn.OnChainOnly, yn.OffChainOnly + "", yn.OffChainOnly, yn.Any + "", yn.Any;
var Wf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Wf || (Wf = {}));
var Yf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Yf || (Yf = {}));
var Zf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Zf || (Zf = {}));
var er;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(er || (er = {}));
var Qf;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Qf || (Qf = {}));
var Jf;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Jf || (Jf = {}));
var td;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(td || (td = {}));
var ed;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(ed || (ed = {}));
var nd;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(nd || (nd = {}));
var rd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(rd || (rd = {}));
var id;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(id || (id = {}));
var sd;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(sd || (sd = {}));
var od;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(od || (od = {}));
function sl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function qm(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function fp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Xm(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  sl(t.outputLen), sl(t.blockLen);
}
function Wm(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ym(t, e) {
  fp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ni = {
  number: sl,
  bool: qm,
  bytes: fp,
  hash: Xm,
  exists: Wm,
  output: Ym
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const vc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Cn = (t, e) => t << 32 - e | t >>> e, Zm = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Zm)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Qm(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function yu(t) {
  if (typeof t == "string" && (t = Qm(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let dp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ni(t) {
  const e = (r) => t().update(yu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let hp = class extends dp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ni.hash(e);
    const r = yu(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, s = new Uint8Array(i);
    s.set(r.length > i ? e.create().update(r).digest() : r);
    for (let o = 0; o < s.length; o++)
      s[o] ^= 54;
    this.iHash.update(s), this.oHash = e.create();
    for (let o = 0; o < s.length; o++)
      s[o] ^= 106;
    this.oHash.update(s), s.fill(0);
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
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const pp = (t, e, n) => new hp(t, e).update(n).digest();
pp.create = (t, e) => new hp(t, e);
function Jm(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let wu = class extends dp {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = vc(this.buffer);
  }
  update(e) {
    ni.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = yu(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = vc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ni.exists(this), ni.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    Jm(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = vc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      a.setUint32(4 * l, d[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.length = i, e.pos = a, e.finished = s, e.destroyed = o, i % n && e.buffer.set(r), e;
  }
};
const t2 = (t, e, n) => t & e ^ ~t & n, e2 = (t, e, n) => t & e ^ t & n ^ e & n, n2 = new Uint32Array([
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
]), Sr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Er = new Uint32Array(64);
let gp = class extends wu {
  constructor() {
    super(64, 32, 8, !1), this.A = Sr[0] | 0, this.B = Sr[1] | 0, this.C = Sr[2] | 0, this.D = Sr[3] | 0, this.E = Sr[4] | 0, this.F = Sr[5] | 0, this.G = Sr[6] | 0, this.H = Sr[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Er[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Er[l - 15], h = Er[l - 2], x = Cn(g, 7) ^ Cn(g, 18) ^ g >>> 3, b = Cn(h, 17) ^ Cn(h, 19) ^ h >>> 10;
      Er[l] = b + Er[l - 7] + x + Er[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Cn(a, 6) ^ Cn(a, 11) ^ Cn(a, 25), h = d + g + t2(a, c, f) + n2[l] + Er[l] | 0, b = (Cn(r, 2) ^ Cn(r, 13) ^ Cn(r, 22)) + e2(r, i, s) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = s, s = i, i = r, r = h + b | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, f, d);
  }
  roundClean() {
    Er.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, r2 = class extends gp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const yp = Ni(() => new gp());
Ni(() => new r2());
var _i = {}, bu = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = mo;
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
        let b = 0;
        h !== 0 && (b = n.indexOf(o[h - 1]));
        const L = 1 + f, H = b % (1 << L) << 5 - L, U = t.c32[x + H];
        f = L, c.unshift(U);
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
  function i(o) {
    return o.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  t.c32normalize = i;
  function s(o, a) {
    if (o = i(o), !o.match(`^[${t.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const c = o.match(`^${t.c32[0]}*`), f = c ? c[0].length : 0;
    let d = [], l = 0, g = 0;
    for (let b = o.length - 1; b >= 0; b--) {
      g === 4 && (d.unshift(n[l]), g = 0, l = 0);
      const H = (t.c32.indexOf(o[b]) << g) + l, U = n[H % 16];
      if (g += 1, l = H >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      d.unshift(U);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let h = 0;
    for (let b = 0; b < d.length && d[b] === "0"; b++)
      h++;
    d = d.slice(h - h % 2);
    let x = d.join("");
    for (let b = 0; b < f; b++)
      x = `00${x}`;
    if (a) {
      const b = a * 2 - x.length;
      for (let L = 0; L < b; L += 2)
        x = `00${x}`;
    }
    return x;
  }
  t.c32decode = s;
})(bu);
var yi = {};
Object.defineProperty(yi, "__esModule", { value: !0 });
yi.c32checkDecode = yi.c32checkEncode = void 0;
const ad = Ka, cd = mo, Zs = bu;
function wp(t) {
  const e = (0, ad.sha256)((0, ad.sha256)((0, cd.hexToBytes)(t)));
  return (0, cd.bytesToHex)(e.slice(0, 4));
}
function i2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = wp(`${n}${e}`), i = (0, Zs.c32encode)(`${e}${r}`);
  return `${Zs.c32[t]}${i}`;
}
yi.c32checkEncode = i2;
function s2(t) {
  t = (0, Zs.c32normalize)(t);
  const e = (0, Zs.c32decode)(t.slice(1)), n = t[0], r = Zs.c32.indexOf(n), i = e.slice(-8);
  let s = r.toString(16);
  if (s.length === 1 && (s = `0${s}`), wp(`${s}${e.substring(0, e.length - 8)}`) !== i)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
yi.c32checkDecode = s2;
var bp = {}, ms = {};
Object.defineProperty(ms, "__esModule", { value: !0 });
ms.decode = ms.encode = void 0;
const xa = Ka, ld = mo, mp = I0, xp = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function o2(t, e = "00") {
  const n = typeof t == "string" ? (0, ld.hexToBytes)(t) : t, r = typeof e == "string" ? (0, ld.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const i = (0, xa.sha256)((0, xa.sha256)(new Uint8Array([...r, ...n])));
  return mp(xp).encode([...r, ...n, ...i.slice(0, 4)]);
}
ms.encode = o2;
function a2(t) {
  const e = mp(xp).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), i = (0, xa.sha256)((0, xa.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((s, o) => {
    if (s !== i[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
ms.decode = a2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = yi, n = ms, r = mo;
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
  const i = {};
  i[0] = t.versions.mainnet.p2pkh, i[5] = t.versions.mainnet.p2sh, i[111] = t.versions.testnet.p2pkh, i[196] = t.versions.testnet.p2sh;
  const s = {};
  s[t.versions.mainnet.p2pkh] = 0, s[t.versions.mainnet.p2sh] = 5, s[t.versions.testnet.p2pkh] = 111, s[t.versions.testnet.p2sh] = 196;
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
    let b;
    return l < 0 ? (b = x, i[x] !== void 0 && (b = i[x])) : b = l, o(b, h);
  }
  t.b58ToC32 = c;
  function f(d, l = -1) {
    const g = a(d), h = g[0], x = g[1];
    let b;
    l < 0 ? (b = h, s[h] !== void 0 && (b = s[h])) : b = l;
    let L = b.toString(16);
    return L.length === 1 && (L = `0${L}`), n.encode(x, L);
  }
  t.c32ToB58 = f;
})(bp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = bu;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = yi;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = bp;
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
})(_i);
function c2(t, e) {
  switch (e = up(e ?? lp), t) {
    case er.P2PKH:
      switch (e.transactionVersion) {
        case nr.Mainnet:
          return Pn.MainnetSingleSig;
        case nr.Testnet:
          return Pn.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case er.P2SH:
    case er.P2SHNonSequential:
    case er.P2WPKH:
    case er.P2WSH:
    case er.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case nr.Mainnet:
          return Pn.MainnetMultiSig;
        case nr.Testnet:
          return Pn.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const l2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Sp = Uint8Array.from({ length: 16 }, (t, e) => e), u2 = Sp.map((t) => (9 * t + 5) % 16);
let mu = [Sp], xu = [u2];
for (let t = 0; t < 4; t++)
  for (let e of [mu, xu])
    e.push(e[t].map((n) => l2[n]));
const Ep = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), f2 = mu.map((t, e) => t.map((n) => Ep[e][n])), d2 = xu.map((t, e) => t.map((n) => Ep[e][n])), h2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), p2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ho = (t, e) => t << e | t >>> 32 - e;
function ud(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Oo = new Uint32Array(16);
let g2 = class extends wu {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: i, h4: s } = this;
    return [e, n, r, i, s];
  }
  set(e, n, r, i, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let h = 0; h < 16; h++, n += 4)
      Oo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, b = h2[h], L = p2[h], H = mu[h], U = xu[h], p = f2[h], $ = d2[h];
      for (let I = 0; I < 16; I++) {
        const z = Ho(r + ud(h, s, a, f) + Oo[H[I]] + b, p[I]) + l | 0;
        r = l, l = f, f = Ho(a, 10) | 0, a = s, s = z;
      }
      for (let I = 0; I < 16; I++) {
        const z = Ho(i + ud(x, o, c, d) + Oo[U[I]] + L, $[I]) + g | 0;
        i = g, g = d, d = Ho(c, 10) | 0, c = o, o = z;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Oo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const y2 = Ni(() => new g2()), Do = BigInt(2 ** 32 - 1), ol = BigInt(32);
function Ap(t, e = !1) {
  return e ? { h: Number(t & Do), l: Number(t >> ol & Do) } : { h: Number(t >> ol & Do) | 0, l: Number(t & Do) | 0 };
}
function w2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Ap(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const b2 = (t, e) => BigInt(t >>> 0) << ol | BigInt(e >>> 0), m2 = (t, e, n) => t >>> n, x2 = (t, e, n) => t << 32 - n | e >>> n, S2 = (t, e, n) => t >>> n | e << 32 - n, E2 = (t, e, n) => t << 32 - n | e >>> n, A2 = (t, e, n) => t << 64 - n | e >>> n - 32, v2 = (t, e, n) => t >>> n - 32 | e << 64 - n, $2 = (t, e) => e, I2 = (t, e) => t, k2 = (t, e, n) => t << n | e >>> 32 - n, L2 = (t, e, n) => e << n | t >>> 32 - n, C2 = (t, e, n) => e << n - 32 | t >>> 64 - n, T2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function B2(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const M2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), N2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, _2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), U2 = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, P2 = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), H2 = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, At = {
  fromBig: Ap,
  split: w2,
  toBig: b2,
  shrSH: m2,
  shrSL: x2,
  rotrSH: S2,
  rotrSL: E2,
  rotrBH: A2,
  rotrBL: v2,
  rotr32H: $2,
  rotr32L: I2,
  rotlSH: k2,
  rotlSL: L2,
  rotlBH: C2,
  rotlBL: T2,
  add: B2,
  add3L: M2,
  add3H: N2,
  add4L: _2,
  add4H: U2,
  add5H: H2,
  add5L: P2
}, [O2, D2] = At.split([
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
].map((t) => BigInt(t))), Ar = new Uint32Array(80), vr = new Uint32Array(80);
let Xa = class extends wu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: x, Hh: b, Hl: L } = this;
    return [e, n, r, i, s, o, a, c, f, d, l, g, h, x, b, L];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, f, d, l, g, h, x, b, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = b | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Ar[p] = e.getUint32(n), vr[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const $ = Ar[p - 15] | 0, I = vr[p - 15] | 0, z = At.rotrSH($, I, 1) ^ At.rotrSH($, I, 8) ^ At.shrSH($, I, 7), tt = At.rotrSL($, I, 1) ^ At.rotrSL($, I, 8) ^ At.shrSL($, I, 7), F = Ar[p - 2] | 0, Y = vr[p - 2] | 0, S = At.rotrSH(F, Y, 19) ^ At.rotrBH(F, Y, 61) ^ At.shrSH(F, Y, 6), C = At.rotrSL(F, Y, 19) ^ At.rotrBL(F, Y, 61) ^ At.shrSL(F, Y, 6), _ = At.add4L(tt, C, vr[p - 7], vr[p - 16]), B = At.add4H(_, z, S, Ar[p - 7], Ar[p - 16]);
      Ar[p] = B | 0, vr[p] = _ | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: x, Gh: b, Gl: L, Hh: H, Hl: U } = this;
    for (let p = 0; p < 80; p++) {
      const $ = At.rotrSH(l, g, 14) ^ At.rotrSH(l, g, 18) ^ At.rotrBH(l, g, 41), I = At.rotrSL(l, g, 14) ^ At.rotrSL(l, g, 18) ^ At.rotrBL(l, g, 41), z = l & h ^ ~l & b, tt = g & x ^ ~g & L, F = At.add5L(U, I, tt, D2[p], vr[p]), Y = At.add5H(F, H, $, z, O2[p], Ar[p]), S = F | 0, C = At.rotrSH(r, i, 28) ^ At.rotrBH(r, i, 34) ^ At.rotrBH(r, i, 39), _ = At.rotrSL(r, i, 28) ^ At.rotrBL(r, i, 34) ^ At.rotrBL(r, i, 39), B = r & s ^ r & a ^ s & a, X = i & o ^ i & c ^ o & c;
      H = b | 0, U = L | 0, b = h | 0, L = x | 0, h = l | 0, x = g | 0, { h: l, l: g } = At.add(f | 0, d | 0, Y | 0, S | 0), f = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const K = At.add3L(S, _, X);
      r = At.add3H(K, Y, C, B), i = K | 0;
    }
    ({ h: r, l: i } = At.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = At.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = At.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = At.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = At.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: x } = At.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: b, l: L } = At.add(this.Gh | 0, this.Gl | 0, b | 0, L | 0), { h: H, l: U } = At.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, i, s, o, a, c, f, d, l, g, h, x, b, L, H, U);
  }
  roundClean() {
    Ar.fill(0), vr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, F2 = class extends Xa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, j2 = class extends Xa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, z2 = class extends Xa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ni(() => new Xa());
Ni(() => new F2());
Ni(() => new j2());
Ni(() => new z2());
var Sa = { exports: {} };
Sa.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", i = 9007199254740991, s = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", f = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", h = "[object Number]", x = "[object Object]", b = "[object Promise]", L = "[object RegExp]", H = "[object Set]", U = "[object String]", p = "[object Symbol]", $ = "[object WeakMap]", I = "[object ArrayBuffer]", z = "[object DataView]", tt = "[object Float32Array]", F = "[object Float64Array]", Y = "[object Int8Array]", S = "[object Int16Array]", C = "[object Int32Array]", _ = "[object Uint8Array]", B = "[object Uint8ClampedArray]", X = "[object Uint16Array]", K = "[object Uint32Array]", gt = /[\\^$.*+?()[\]{}|]/g, ht = /\w*$/, ye = /^\[object .+?Constructor\]$/, E = /^(?:0|[1-9]\d*)$/, M = {};
  M[s] = M[o] = M[I] = M[z] = M[a] = M[c] = M[tt] = M[F] = M[Y] = M[S] = M[C] = M[g] = M[h] = M[x] = M[L] = M[H] = M[U] = M[p] = M[_] = M[B] = M[X] = M[K] = !0, M[f] = M[d] = M[$] = !1;
  var kt = typeof _e == "object" && _e && _e.Object === Object && _e, pt = typeof self == "object" && self && self.Object === Object && self, ut = kt || pt || Function("return this")(), xt = e && !e.nodeType && e, Pt = xt && !0 && t && !t.nodeType && t, Nt = Pt && Pt.exports === xt;
  function Xt(y, k) {
    return y.set(k[0], k[1]), y;
  }
  function be(y, k) {
    return y.add(k), y;
  }
  function Bt(y, k) {
    for (var N = -1, nt = y ? y.length : 0; ++N < nt && k(y[N], N, y) !== !1; )
      ;
    return y;
  }
  function Ae(y, k) {
    for (var N = -1, nt = k.length, ve = y.length; ++N < nt; )
      y[ve + N] = k[N];
    return y;
  }
  function tn(y, k, N, nt) {
    for (var ve = -1, Oe = y ? y.length : 0; ++ve < Oe; )
      N = k(N, y[ve], ve, y);
    return N;
  }
  function Ge(y, k) {
    for (var N = -1, nt = Array(y); ++N < y; )
      nt[N] = k(N);
    return nt;
  }
  function T(y, k) {
    return y == null ? void 0 : y[k];
  }
  function G(y) {
    var k = !1;
    if (y != null && typeof y.toString != "function")
      try {
        k = !!(y + "");
      } catch {
      }
    return k;
  }
  function R(y) {
    var k = -1, N = Array(y.size);
    return y.forEach(function(nt, ve) {
      N[++k] = [ve, nt];
    }), N;
  }
  function ot(y, k) {
    return function(N) {
      return y(k(N));
    };
  }
  function rt(y) {
    var k = -1, N = Array(y.size);
    return y.forEach(function(nt) {
      N[++k] = nt;
    }), N;
  }
  var yt = Array.prototype, Qt = Function.prototype, St = Object.prototype, Vt = ut["__core-js_shared__"], Ht = function() {
    var y = /[^.]+$/.exec(Vt && Vt.keys && Vt.keys.IE_PROTO || "");
    return y ? "Symbol(src)_1." + y : "";
  }(), _t = Qt.toString, wt = St.hasOwnProperty, Lt = St.toString, u = RegExp(
    "^" + _t.call(wt).replace(gt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), m = Nt ? ut.Buffer : void 0, v = ut.Symbol, O = ut.Uint8Array, et = ot(Object.getPrototypeOf, Object), bt = Object.create, Jt = St.propertyIsEnumerable, te = yt.splice, Se = Object.getOwnPropertySymbols, vn = m ? m.isBuffer : void 0, $n = ot(Object.keys, Object), Ke = at(ut, "DataView"), me = at(ut, "Map"), Kn = at(ut, "Promise"), hn = at(ut, "Set"), dt = at(ut, "WeakMap"), Ot = at(Object, "create"), Gt = Zr(Ke), en = Zr(me), Ft = Zr(Kn), ke = Zr(hn), Wr = Zr(dt), Vn = v ? v.prototype : void 0, In = Vn ? Vn.valueOf : void 0;
  function we(y) {
    var k = -1, N = y ? y.length : 0;
    for (this.clear(); ++k < N; ) {
      var nt = y[k];
      this.set(nt[0], nt[1]);
    }
  }
  function nn() {
    this.__data__ = Ot ? Ot(null) : {};
  }
  function Pe(y) {
    return this.has(y) && delete this.__data__[y];
  }
  function Yr(y) {
    var k = this.__data__;
    if (Ot) {
      var N = k[y];
      return N === r ? void 0 : N;
    }
    return wt.call(k, y) ? k[y] : void 0;
  }
  function cr(y) {
    var k = this.__data__;
    return Ot ? k[y] !== void 0 : wt.call(k, y);
  }
  function Di(y, k) {
    var N = this.__data__;
    return N[y] = Ot && k === void 0 ? r : k, this;
  }
  we.prototype.clear = nn, we.prototype.delete = Pe, we.prototype.get = Yr, we.prototype.has = cr, we.prototype.set = Di;
  function He(y) {
    var k = -1, N = y ? y.length : 0;
    for (this.clear(); ++k < N; ) {
      var nt = y[k];
      this.set(nt[0], nt[1]);
    }
  }
  function Fi() {
    this.__data__ = [];
  }
  function ji(y) {
    var k = this.__data__, N = Wn(k, y);
    if (N < 0)
      return !1;
    var nt = k.length - 1;
    return N == nt ? k.pop() : te.call(k, N, 1), !0;
  }
  function zi(y) {
    var k = this.__data__, N = Wn(k, y);
    return N < 0 ? void 0 : k[N][1];
  }
  function rn(y) {
    return Wn(this.__data__, y) > -1;
  }
  function Ri(y, k) {
    var N = this.__data__, nt = Wn(N, y);
    return nt < 0 ? N.push([y, k]) : N[nt][1] = k, this;
  }
  He.prototype.clear = Fi, He.prototype.delete = ji, He.prototype.get = zi, He.prototype.has = rn, He.prototype.set = Ri;
  function sn(y) {
    var k = -1, N = y ? y.length : 0;
    for (this.clear(); ++k < N; ) {
      var nt = y[k];
      this.set(nt[0], nt[1]);
    }
  }
  function Gi() {
    this.__data__ = {
      hash: new we(),
      map: new (me || He)(),
      string: new we()
    };
  }
  function lr(y) {
    return ft(this, y).delete(y);
  }
  function ur(y) {
    return ft(this, y).get(y);
  }
  function fr(y) {
    return ft(this, y).has(y);
  }
  function dr(y, k) {
    return ft(this, y).set(y, k), this;
  }
  sn.prototype.clear = Gi, sn.prototype.delete = lr, sn.prototype.get = ur, sn.prototype.has = fr, sn.prototype.set = dr;
  function D(y) {
    this.__data__ = new He(y);
  }
  function Q() {
    this.__data__ = new He();
  }
  function ce(y) {
    return this.__data__.delete(y);
  }
  function de(y) {
    return this.__data__.get(y);
  }
  function hr(y) {
    return this.__data__.has(y);
  }
  function qn(y, k) {
    var N = this.__data__;
    if (N instanceof He) {
      var nt = N.__data__;
      if (!me || nt.length < n - 1)
        return nt.push([y, k]), this;
      N = this.__data__ = new sn(nt);
    }
    return N.set(y, k), this;
  }
  D.prototype.clear = Q, D.prototype.delete = ce, D.prototype.get = de, D.prototype.has = hr, D.prototype.set = qn;
  function Xn(y, k) {
    var N = pc(y) || Hy(y) ? Ge(y.length, String) : [], nt = N.length, ve = !!nt;
    for (var Oe in y)
      wt.call(y, Oe) && !(ve && (Oe == "length" || vo(Oe, nt))) && N.push(Oe);
    return N;
  }
  function Ki(y, k, N) {
    var nt = y[k];
    (!(wt.call(y, k) && ff(nt, N)) || N === void 0 && !(k in y)) && (y[k] = N);
  }
  function Wn(y, k) {
    for (var N = y.length; N--; )
      if (ff(y[N][0], k))
        return N;
    return -1;
  }
  function ee(y, k) {
    return y && J(k, gc(k), y);
  }
  function Us(y, k, N, nt, ve, Oe, Yn) {
    var De;
    if (nt && (De = Oe ? nt(y, ve, Oe, Yn) : nt(y)), De !== void 0)
      return De;
    if (!$o(y))
      return y;
    var pf = pc(y);
    if (pf) {
      if (De = on(y), !k)
        return W(y, De);
    } else {
      var Xi = se(y), gf = Xi == d || Xi == l;
      if (Dy(y))
        return Hs(y, k);
      if (Xi == x || Xi == s || gf && !Oe) {
        if (G(y))
          return Oe ? y : {};
        if (De = Te(gf ? {} : y), !k)
          return V(y, ee(De, y));
      } else {
        if (!M[Xi])
          return Oe ? y : {};
        De = kn(y, Xi, Us, k);
      }
    }
    Yn || (Yn = new D());
    var yf = Yn.get(y);
    if (yf)
      return yf;
    if (Yn.set(y, De), !pf)
      var wf = N ? lt(y) : gc(y);
    return Bt(wf || y, function(yc, Io) {
      wf && (Io = yc, yc = y[Io]), Ki(De, Io, Us(yc, k, N, nt, Io, y, Yn));
    }), De;
  }
  function uc(y) {
    return $o(y) ? bt(y) : {};
  }
  function Vi(y, k, N) {
    var nt = k(y);
    return pc(y) ? nt : Ae(nt, N(y));
  }
  function Ps(y) {
    return Lt.call(y);
  }
  function qi(y) {
    if (!$o(y) || Uy(y))
      return !1;
    var k = hf(y) || G(y) ? u : ye;
    return k.test(Zr(y));
  }
  function fc(y) {
    if (!uf(y))
      return $n(y);
    var k = [];
    for (var N in Object(y))
      wt.call(y, N) && N != "constructor" && k.push(N);
    return k;
  }
  function Hs(y, k) {
    if (k)
      return y.slice();
    var N = new y.constructor(y.length);
    return y.copy(N), N;
  }
  function Os(y) {
    var k = new y.constructor(y.byteLength);
    return new O(k).set(new O(y)), k;
  }
  function dc(y, k) {
    var N = k ? Os(y.buffer) : y.buffer;
    return new y.constructor(N, y.byteOffset, y.byteLength);
  }
  function Ds(y, k, N) {
    var nt = k ? N(R(y), !0) : R(y);
    return tn(nt, Xt, new y.constructor());
  }
  function hc(y) {
    var k = new y.constructor(y.source, ht.exec(y));
    return k.lastIndex = y.lastIndex, k;
  }
  function w(y, k, N) {
    var nt = k ? N(rt(y), !0) : rt(y);
    return tn(nt, be, new y.constructor());
  }
  function A(y) {
    return In ? Object(In.call(y)) : {};
  }
  function P(y, k) {
    var N = k ? Os(y.buffer) : y.buffer;
    return new y.constructor(N, y.byteOffset, y.length);
  }
  function W(y, k) {
    var N = -1, nt = y.length;
    for (k || (k = Array(nt)); ++N < nt; )
      k[N] = y[N];
    return k;
  }
  function J(y, k, N, nt) {
    N || (N = {});
    for (var ve = -1, Oe = k.length; ++ve < Oe; ) {
      var Yn = k[ve], De = void 0;
      Ki(N, Yn, De === void 0 ? y[Yn] : De);
    }
    return N;
  }
  function V(y, k) {
    return J(y, zt(y), k);
  }
  function lt(y) {
    return Vi(y, gc, zt);
  }
  function ft(y, k) {
    var N = y.__data__;
    return _y(k) ? N[typeof k == "string" ? "string" : "hash"] : N.map;
  }
  function at(y, k) {
    var N = T(y, k);
    return qi(N) ? N : void 0;
  }
  var zt = Se ? ot(Se, Object) : zy, se = Ps;
  (Ke && se(new Ke(new ArrayBuffer(1))) != z || me && se(new me()) != g || Kn && se(Kn.resolve()) != b || hn && se(new hn()) != H || dt && se(new dt()) != $) && (se = function(y) {
    var k = Lt.call(y), N = k == x ? y.constructor : void 0, nt = N ? Zr(N) : void 0;
    if (nt)
      switch (nt) {
        case Gt:
          return z;
        case en:
          return g;
        case Ft:
          return b;
        case ke:
          return H;
        case Wr:
          return $;
      }
    return k;
  });
  function on(y) {
    var k = y.length, N = y.constructor(k);
    return k && typeof y[0] == "string" && wt.call(y, "index") && (N.index = y.index, N.input = y.input), N;
  }
  function Te(y) {
    return typeof y.constructor == "function" && !uf(y) ? uc(et(y)) : {};
  }
  function kn(y, k, N, nt) {
    var ve = y.constructor;
    switch (k) {
      case I:
        return Os(y);
      case a:
      case c:
        return new ve(+y);
      case z:
        return dc(y, nt);
      case tt:
      case F:
      case Y:
      case S:
      case C:
      case _:
      case B:
      case X:
      case K:
        return P(y, nt);
      case g:
        return Ds(y, nt, N);
      case h:
      case U:
        return new ve(y);
      case L:
        return hc(y);
      case H:
        return w(y, nt, N);
      case p:
        return A(y);
    }
  }
  function vo(y, k) {
    return k = k ?? i, !!k && (typeof y == "number" || E.test(y)) && y > -1 && y % 1 == 0 && y < k;
  }
  function _y(y) {
    var k = typeof y;
    return k == "string" || k == "number" || k == "symbol" || k == "boolean" ? y !== "__proto__" : y === null;
  }
  function Uy(y) {
    return !!Ht && Ht in y;
  }
  function uf(y) {
    var k = y && y.constructor, N = typeof k == "function" && k.prototype || St;
    return y === N;
  }
  function Zr(y) {
    if (y != null) {
      try {
        return _t.call(y);
      } catch {
      }
      try {
        return y + "";
      } catch {
      }
    }
    return "";
  }
  function Py(y) {
    return Us(y, !0, !0);
  }
  function ff(y, k) {
    return y === k || y !== y && k !== k;
  }
  function Hy(y) {
    return Oy(y) && wt.call(y, "callee") && (!Jt.call(y, "callee") || Lt.call(y) == s);
  }
  var pc = Array.isArray;
  function df(y) {
    return y != null && Fy(y.length) && !hf(y);
  }
  function Oy(y) {
    return jy(y) && df(y);
  }
  var Dy = vn || Ry;
  function hf(y) {
    var k = $o(y) ? Lt.call(y) : "";
    return k == d || k == l;
  }
  function Fy(y) {
    return typeof y == "number" && y > -1 && y % 1 == 0 && y <= i;
  }
  function $o(y) {
    var k = typeof y;
    return !!y && (k == "object" || k == "function");
  }
  function jy(y) {
    return !!y && typeof y == "object";
  }
  function gc(y) {
    return df(y) ? Xn(y) : fc(y);
  }
  function zy() {
    return [];
  }
  function Ry() {
    return !1;
  }
  t.exports = Py;
})(Sa, Sa.exports);
var R2 = Sa.exports;
const vp = /* @__PURE__ */ Yh(R2);
var al;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(al || (al = {}));
function G2(t, e) {
  return { type: al.Address, version: t, hash160: e };
}
function K2(t) {
  return _i.c32address(t.version, t.hash160);
}
const V2 = (t) => y2(yp(t)), q2 = (t) => st(V2(t));
fe.hmacSha256Sync = (t, ...e) => {
  const n = pp.create(yp, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function X2(t, e = "mainnet") {
  e = up(e), t = typeof t == "string" ? jt(t) : t;
  const n = c2(er.P2PKH, e), r = G2(n, q2(t));
  return K2(r);
}
function W2(t, e) {
  const n = Ie.decodeToken(t), r = n.payload;
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
  const i = r.issuer.publicKey, s = X2(i);
  if (e !== i) {
    if (e !== s) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new Ie.TokenVerifier(n.header.alg, i);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function Y2(t, e = null) {
  let n;
  e ? n = W2(t, e) : n = Ie.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const i = n.payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    i.hasOwnProperty("claim") && (r = i.claim);
  }
  return r;
}
const fd = "_blockstackDidCheckEchoReply", Z2 = "echoReply", Q2 = "authContinuation";
function J2(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [i, s] = r.split("=");
    return n[i] = s ? decodeURIComponent(s.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function tx() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[fd];
  if (typeof e == "boolean")
    return e;
  const n = J2(t.location.search), r = n[Z2];
  if (r) {
    t[fd] = !0;
    const i = `echo-reply-${r}`;
    return t.localStorage.setItem(i, "success"), t.setTimeout(() => {
      const s = n[Q2];
      t.location.href = s;
    }, 10), !0;
  }
  return !1;
}
class cl {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new s0();
    else
      throw new mw("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Vf(e.sessionOptions) : this.store = new Vf() : e ? this.store = new Kf(e.sessionOptions) : this.store = new Kf();
  }
  makeAuthRequestToken(e, n, r, i, s, o = Sw().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Xc("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), i = i || c.scopes, s = s || c.appDomain, Dm(e, n, r, i, s, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Om();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = tu("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (tx())
        return ns.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      ns.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Gw()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new ko("Existing user session found.");
    const i = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const s = Ie.decodeToken(e).payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Gm(e))
      throw new ko("Invalid authentication response.");
    let a = s.private_key, c = s.core_token;
    if (bc(s.version, "1.1.0"))
      if (i !== void 0 && i != null) {
        if (s.private_key !== void 0 && s.private_key !== null)
          try {
            a = await Rf(i, s.private_key);
          } catch {
            if (ns.warn("Failed decryption of appPrivateKey, will try to use as given"), !fe.isValidPrivateKey(s.private_key))
              throw new ko("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Rf(i, c);
          } catch {
            ns.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new ko("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let f = Nw, d;
    bc(s.version, "1.2.0") && s.hubUrl !== null && s.hubUrl !== void 0 && (f = s.hubUrl), bc(s.version, "1.3.0") && s.associationToken !== null && s.associationToken !== void 0 && (d = s.associationToken);
    const l = {
      profile: s.profile,
      email: s.email,
      decentralizedID: s.iss,
      identityAddress: ap(s.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: f,
      appPrivateKeyFromWalletSalt: s.appPrivateKeyFromWalletSalt,
      coreNode: s.blockstackAPIUrl,
      gaiaAssociationToken: d
    }, g = s.profile_url;
    if (!l.profile && g) {
      const h = await n(g);
      if (!h.ok)
        l.profile = Object.assign({}, yw);
      else {
        const x = await h.text(), b = JSON.parse(x);
        l.profile = Y2(b[0].token);
      }
    } else
      l.profile = s.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Xc("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), N1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), _1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
cl.prototype.makeAuthRequest = cl.prototype.makeAuthRequestToken;
const ex = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], nx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = ex(), n = t.filter((r) => e.find((s) => s.id === r.id) ? !1 : !!Wa(r.id));
  return e.concat(n);
}, Wa = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), $p = "STX_PROVIDER", wi = () => typeof window > "u" ? null : window.localStorage.getItem($p), rx = (t) => {
  typeof window < "u" && window.localStorage.setItem($p, t);
}, ix = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function sx(t, e) {
  const n = {};
  return Object.assign(n, ix, e), await fetch(t, n);
}
function ox(t) {
  let e = sx, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function ax(...t) {
  const { fetchLib: e, middlewares: n } = ox(t);
  return async (i, s) => {
    let o = { url: i, init: s ?? {} };
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
var xs;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(xs || (xs = {}));
var bi;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(bi || (bi = {}));
var dd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(dd || (dd = {}));
const cx = "https://api.mainnet.hiro.so", lx = "https://api.testnet.hiro.so", ux = "http://localhost:3999", fx = ["mainnet", "testnet", "devnet", "mocknet"];
class mi {
  constructor(e) {
    this.version = bi.Mainnet, this.chainId = xs.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === bi.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, i) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${i}?proof=0`, this.getMapEntryUrl = (n, r, i) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${i}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? ax();
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
mi.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new ll();
    case "testnet":
      return new ul();
    case "devnet":
      return new dx();
    case "mocknet":
      return new Ip();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${fx.join(", ")}`);
  }
};
mi.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : mi.fromName(t);
class ll extends mi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? cx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = bi.Mainnet, this.chainId = xs.Mainnet;
  }
}
class ul extends mi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? lx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = bi.Testnet, this.chainId = xs.Testnet;
  }
}
class Ip extends mi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ux,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = bi.Testnet, this.chainId = xs.Testnet;
  }
}
const dx = Ip;
var xi;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(xi || (xi = {}));
var Ea;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ea || (Ea = {}));
xi.Mainnet;
var Si;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Si || (Si = {}));
var Ei;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ei || (Ei = {}));
Si.Mainnet;
const hx = {
  chainId: xi.Mainnet,
  transactionVersion: Si.Mainnet,
  peerNetworkId: Ea.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Ei.MainnetSingleSig,
    multiSig: Ei.MainnetMultiSig
  },
  client: { baseUrl: n0 }
}, fl = {
  chainId: xi.Testnet,
  transactionVersion: Si.Testnet,
  peerNetworkId: Ea.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Ei.TestnetSingleSig,
    multiSig: Ei.TestnetMultiSig
  },
  client: { baseUrl: r0 }
}, oa = {
  ...fl,
  addressVersion: { ...fl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: i0 }
}, px = {
  ...oa,
  addressVersion: { ...oa.addressVersion },
  client: { ...oa.client }
};
function gx(t) {
  switch (t) {
    case "mainnet":
      return hx;
    case "testnet":
      return fl;
    case "devnet":
      return oa;
    case "mocknet":
      return px;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function yx(t) {
  return typeof t == "string" ? gx(t) : t;
}
function wx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const hd = /* @__PURE__ */ new Map();
function kp(t, e) {
  const n = hd.get(t);
  if (n !== void 0)
    return n(e);
  const r = wx(t);
  return hd.set(t, r), kp(t, e);
}
let Zt = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? jt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Fw(this.readBytes(4), 0);
  }
  readUInt8() {
    return Ow(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Pw(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = st(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = st(n);
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
    if (kp(e, r))
      return r;
    throw n(r);
  }
};
const bx = 128, mx = 128, Lp = 16, ci = 32, dl = 80, Ya = 65, xx = 32, Sx = 64, Aa = 34, Ex = 1 + 16 * 1024 * 1024, Ax = 165, vx = 16, $x = 16, Ix = 20, kx = $x + 2 + Ix, Lx = kx + 4, Cx = Ex + (Ax + vx * Lx);
var Kt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Kt || (Kt = {}));
var hl;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(hl || (hl = {}));
var qe;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(qe || (qe = {}));
const $c = ["onChainOnly", "offChainOnly", "any"];
$c[0] + "", qe.OnChainOnly, $c[1] + "", qe.OffChainOnly, $c[2] + "", qe.Any, qe.OnChainOnly + "", qe.OnChainOnly, qe.OffChainOnly + "", qe.OffChainOnly, qe.Any + "", qe.Any;
var va;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(va || (va = {}));
var ne;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ne || (ne = {}));
var le;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(le || (le = {}));
var Wt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Wt || (Wt = {}));
var oe;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(oe || (oe = {}));
var Qs;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Qs || (Qs = {}));
var pl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(pl || (pl = {}));
var gl;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(gl || (gl = {}));
var Ne;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ne || (Ne = {}));
var pd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(pd || (pd = {}));
var yl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(yl || (yl = {}));
var bn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(bn || (bn = {}));
var gd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(gd || (gd = {}));
let Za = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, rs = class extends Za {
  constructor(e) {
    super(e);
  }
}, Be = class extends Za {
  constructor(e) {
    super(e);
  }
}, $a = class extends Za {
  constructor(e) {
    super(e);
  }
}, ri = class extends Za {
  constructor(e) {
    super(e);
  }
};
function wl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Tx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Cp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Bx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  wl(t.outputLen), wl(t.blockLen);
}
function Mx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Nx(t, e) {
  Cp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ii = {
  number: wl,
  bool: Tx,
  bytes: Cp,
  hash: Bx,
  exists: Mx,
  output: Nx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ic = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Tn = (t, e) => t << 32 - e | t >>> e, _x = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!_x)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ux(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Su(t) {
  if (typeof t == "string" && (t = Ux(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Tp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ui(t) {
  const e = (r) => t().update(Su(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Bp = class extends Tp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ii.hash(e);
    const r = Su(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, s = new Uint8Array(i);
    s.set(r.length > i ? e.create().update(r).digest() : r);
    for (let o = 0; o < s.length; o++)
      s[o] ^= 54;
    this.iHash.update(s), this.oHash = e.create();
    for (let o = 0; o < s.length; o++)
      s[o] ^= 106;
    this.oHash.update(s), s.fill(0);
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
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Mp = (t, e, n) => new Bp(t, e).update(n).digest();
Mp.create = (t, e) => new Bp(t, e);
function Px(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let Eu = class extends Tp {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ic(this.buffer);
  }
  update(e) {
    ii.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Su(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Ic(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ii.exists(this), ii.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    Px(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Ic(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      a.setUint32(4 * l, d[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.length = i, e.pos = a, e.finished = s, e.destroyed = o, i % n && e.buffer.set(r), e;
  }
};
const Hx = (t, e, n) => t & e ^ ~t & n, Ox = (t, e, n) => t & e ^ t & n ^ e & n, Dx = new Uint32Array([
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
]), $r = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ir = new Uint32Array(64);
let Np = class extends Eu {
  constructor() {
    super(64, 32, 8, !1), this.A = $r[0] | 0, this.B = $r[1] | 0, this.C = $r[2] | 0, this.D = $r[3] | 0, this.E = $r[4] | 0, this.F = $r[5] | 0, this.G = $r[6] | 0, this.H = $r[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Ir[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Ir[l - 15], h = Ir[l - 2], x = Tn(g, 7) ^ Tn(g, 18) ^ g >>> 3, b = Tn(h, 17) ^ Tn(h, 19) ^ h >>> 10;
      Ir[l] = b + Ir[l - 7] + x + Ir[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Tn(a, 6) ^ Tn(a, 11) ^ Tn(a, 25), h = d + g + Hx(a, c, f) + Dx[l] + Ir[l] | 0, b = (Tn(r, 2) ^ Tn(r, 13) ^ Tn(r, 22)) + Ox(r, i, s) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = s, s = i, i = r, r = h + b | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, f, d);
  }
  roundClean() {
    Ir.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Fx = class extends Np {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Au = Ui(() => new Np());
Ui(() => new Fx());
const jx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), _p = Uint8Array.from({ length: 16 }, (t, e) => e), zx = _p.map((t) => (9 * t + 5) % 16);
let vu = [_p], $u = [zx];
for (let t = 0; t < 4; t++)
  for (let e of [vu, $u])
    e.push(e[t].map((n) => jx[n]));
const Up = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Rx = vu.map((t, e) => t.map((n) => Up[e][n])), Gx = $u.map((t, e) => t.map((n) => Up[e][n])), Kx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Vx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Fo = (t, e) => t << e | t >>> 32 - e;
function yd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const jo = new Uint32Array(16);
let qx = class extends Eu {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: i, h4: s } = this;
    return [e, n, r, i, s];
  }
  set(e, n, r, i, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let h = 0; h < 16; h++, n += 4)
      jo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, b = Kx[h], L = Vx[h], H = vu[h], U = $u[h], p = Rx[h], $ = Gx[h];
      for (let I = 0; I < 16; I++) {
        const z = Fo(r + yd(h, s, a, f) + jo[H[I]] + b, p[I]) + l | 0;
        r = l, l = f, f = Fo(a, 10) | 0, a = s, s = z;
      }
      for (let I = 0; I < 16; I++) {
        const z = Fo(i + yd(x, o, c, d) + jo[U[I]] + L, $[I]) + g | 0;
        i = g, g = d, d = Fo(c, 10) | 0, c = o, o = z;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    jo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Xx = Ui(() => new qx()), zo = BigInt(2 ** 32 - 1), bl = BigInt(32);
function Pp(t, e = !1) {
  return e ? { h: Number(t & zo), l: Number(t >> bl & zo) } : { h: Number(t >> bl & zo) | 0, l: Number(t & zo) | 0 };
}
function Wx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Pp(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const Yx = (t, e) => BigInt(t >>> 0) << bl | BigInt(e >>> 0), Zx = (t, e, n) => t >>> n, Qx = (t, e, n) => t << 32 - n | e >>> n, Jx = (t, e, n) => t >>> n | e << 32 - n, tS = (t, e, n) => t << 32 - n | e >>> n, eS = (t, e, n) => t << 64 - n | e >>> n - 32, nS = (t, e, n) => t >>> n - 32 | e << 64 - n, rS = (t, e) => e, iS = (t, e) => t, sS = (t, e, n) => t << n | e >>> 32 - n, oS = (t, e, n) => e << n | t >>> 32 - n, aS = (t, e, n) => e << n - 32 | t >>> 64 - n, cS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function lS(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const uS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), fS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, dS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), hS = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, pS = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), gS = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, vt = {
  fromBig: Pp,
  split: Wx,
  toBig: Yx,
  shrSH: Zx,
  shrSL: Qx,
  rotrSH: Jx,
  rotrSL: tS,
  rotrBH: eS,
  rotrBL: nS,
  rotr32H: rS,
  rotr32L: iS,
  rotlSH: sS,
  rotlSL: oS,
  rotlBH: aS,
  rotlBL: cS,
  add: lS,
  add3L: uS,
  add3H: fS,
  add4L: dS,
  add4H: hS,
  add5H: gS,
  add5L: pS
}, [yS, wS] = vt.split([
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
].map((t) => BigInt(t))), kr = new Uint32Array(80), Lr = new Uint32Array(80);
let Qa = class extends Eu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: x, Hh: b, Hl: L } = this;
    return [e, n, r, i, s, o, a, c, f, d, l, g, h, x, b, L];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, f, d, l, g, h, x, b, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = b | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      kr[p] = e.getUint32(n), Lr[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const $ = kr[p - 15] | 0, I = Lr[p - 15] | 0, z = vt.rotrSH($, I, 1) ^ vt.rotrSH($, I, 8) ^ vt.shrSH($, I, 7), tt = vt.rotrSL($, I, 1) ^ vt.rotrSL($, I, 8) ^ vt.shrSL($, I, 7), F = kr[p - 2] | 0, Y = Lr[p - 2] | 0, S = vt.rotrSH(F, Y, 19) ^ vt.rotrBH(F, Y, 61) ^ vt.shrSH(F, Y, 6), C = vt.rotrSL(F, Y, 19) ^ vt.rotrBL(F, Y, 61) ^ vt.shrSL(F, Y, 6), _ = vt.add4L(tt, C, Lr[p - 7], Lr[p - 16]), B = vt.add4H(_, z, S, kr[p - 7], kr[p - 16]);
      kr[p] = B | 0, Lr[p] = _ | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: x, Gh: b, Gl: L, Hh: H, Hl: U } = this;
    for (let p = 0; p < 80; p++) {
      const $ = vt.rotrSH(l, g, 14) ^ vt.rotrSH(l, g, 18) ^ vt.rotrBH(l, g, 41), I = vt.rotrSL(l, g, 14) ^ vt.rotrSL(l, g, 18) ^ vt.rotrBL(l, g, 41), z = l & h ^ ~l & b, tt = g & x ^ ~g & L, F = vt.add5L(U, I, tt, wS[p], Lr[p]), Y = vt.add5H(F, H, $, z, yS[p], kr[p]), S = F | 0, C = vt.rotrSH(r, i, 28) ^ vt.rotrBH(r, i, 34) ^ vt.rotrBH(r, i, 39), _ = vt.rotrSL(r, i, 28) ^ vt.rotrBL(r, i, 34) ^ vt.rotrBL(r, i, 39), B = r & s ^ r & a ^ s & a, X = i & o ^ i & c ^ o & c;
      H = b | 0, U = L | 0, b = h | 0, L = x | 0, h = l | 0, x = g | 0, { h: l, l: g } = vt.add(f | 0, d | 0, Y | 0, S | 0), f = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const K = vt.add3L(S, _, X);
      r = vt.add3H(K, Y, C, B), i = K | 0;
    }
    ({ h: r, l: i } = vt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = vt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = vt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = vt.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = vt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: x } = vt.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: b, l: L } = vt.add(this.Gh | 0, this.Gl | 0, b | 0, L | 0), { h: H, l: U } = vt.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, i, s, o, a, c, f, d, l, g, h, x, b, L, H, U);
  }
  roundClean() {
    kr.fill(0), Lr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, bS = class extends Qa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, mS = class extends Qa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, xS = class extends Qa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ui(() => new Qa());
Ui(() => new bS());
const SS = Ui(() => new mS());
Ui(() => new xS());
var Ut;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Ut || (Ut = {}));
var xe;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(xe || (xe = {}));
function Iu(t) {
  return xe[t];
}
const ES = () => ({ type: Ut.BoolTrue }), AS = () => ({ type: Ut.BoolFalse }), vS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Ut.Buffer, value: st(t) };
}, wd = BigInt("0xffffffffffffffffffffffffffffffff"), $S = BigInt(0), bd = BigInt("0x7fffffffffffffffffffffffffffffff"), md = BigInt("-170141183460469231731687303715884105728"), IS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = Yc(jt(t))), Re(t, Uint8Array) && (t = Yc(t));
  const e = Ce(t);
  if (e > bd)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${bd}`);
  if (e < md)
    throw new RangeError(`Cannot construct clarity integer form value less than ${md}`);
  return { type: Ut.Int, value: e };
}, kS = (t) => {
  const e = Ce(t);
  if (e < $S)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > wd)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${wd}`);
  return { type: Ut.UInt, value: e };
};
function LS(t) {
  return { type: Ut.List, value: t };
}
function Hp() {
  return { type: Ut.OptionalNone };
}
function Op(t) {
  return { type: Ut.OptionalSome, value: t };
}
var Z;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Z || (Z = {}));
function CS() {
  return {
    type: Z.Address,
    version: Ei.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function xd(t) {
  if (t && qp(t, Aa))
    throw new Error(`Memo exceeds maximum length of ${Aa} bytes`);
  return { type: Z.MemoString, content: t };
}
function ku(t, e) {
  return {
    type: Z.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function ml(t) {
  if (jt(t).byteLength != Ya)
    throw Error("Invalid signature");
  return {
    type: Z.MessageSignature,
    data: t
  };
}
function TS(t, e, n) {
  return typeof t == "string" && (t = VS(t)), typeof n == "string" && (n = xd(n)), {
    type: Z.Payload,
    payloadType: Kt.TokenTransfer,
    recipient: t,
    amount: Ce(e),
    memo: n ?? xd("")
  };
}
function BS(t, e, n, r) {
  return typeof e == "string" && (e = En(e)), typeof n == "string" && (n = En(n)), {
    type: Z.Payload,
    payloadType: Kt.ContractCall,
    contractAddress: typeof t == "string" ? Xr(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function MS(t) {
  return En(t, 4, 1e5);
}
function Sd(t, e, n) {
  return typeof t == "string" && (t = En(t)), typeof e == "string" && (e = MS(e)), typeof n == "number" ? {
    type: Z.Payload,
    payloadType: Kt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: Z.Payload,
    payloadType: Kt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function NS() {
  return { type: Z.Payload, payloadType: Kt.PoisonMicroblock };
}
function Ed(t, e) {
  if (t.byteLength != ci)
    throw Error(`Coinbase buffer size must be ${ci} bytes`);
  return e != null ? {
    type: Z.Payload,
    payloadType: Kt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: Z.Payload,
    payloadType: Kt.Coinbase,
    coinbaseBytes: t
  };
}
function _S(t, e, n) {
  if (t.byteLength != ci)
    throw Error(`Coinbase buffer size must be ${ci} bytes`);
  if (n.byteLength != dl)
    throw Error(`VRF proof buffer size must be ${dl} bytes`);
  return {
    type: Z.Payload,
    payloadType: Kt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Ut.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function US(t, e, n, r, i, s, o) {
  return {
    type: Z.Payload,
    payloadType: Kt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: i,
    cause: s,
    publicKeyHash: o
  };
}
function En(t, e, n) {
  const r = e || 1, i = n || bx;
  if (qp(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: Z.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function PS(t, e, n) {
  return {
    type: Z.Asset,
    address: Xr(t),
    contractName: En(e),
    assetName: En(n)
  };
}
function Xr(t) {
  const e = _i.c32addressDecode(t);
  return {
    type: Z.Address,
    version: e[0],
    hash160: e[1]
  };
}
function HS(t, e) {
  const n = Xr(t), r = En(e);
  return {
    type: Z.Principal,
    prefix: Ne.Contract,
    address: n,
    contractName: r
  };
}
function OS(t) {
  const e = Xr(t);
  return {
    type: Z.Principal,
    prefix: Ne.Standard,
    address: e
  };
}
function is(t, e) {
  return {
    pubKeyEncoding: t,
    type: Z.TransactionAuthField,
    contents: e
  };
}
function Jn(t) {
  switch (t.type) {
    case Z.Address:
      return xo(t);
    case Z.Principal:
      return Dp(t);
    case Z.LengthPrefixedString:
      return Es(t);
    case Z.MemoString:
      return FS(t);
    case Z.Asset:
      return jp(t);
    case Z.PostCondition:
      return Rp(t);
    case Z.PublicKey:
      return El(t);
    case Z.LengthPrefixedList:
      return Lu(t);
    case Z.Payload:
      return Gp(t);
    case Z.TransactionAuthField:
      return KS(t);
    case Z.MessageSignature:
      return Cu(t);
  }
}
function xo(t) {
  const e = [];
  return e.push(jt(po(t.version, 1))), e.push(jt(t.hash160)), pe(e);
}
function Ss(t) {
  const e = Re(t, Zt) ? t : new Zt(t), n = Ha(st(e.readBytes(1))), r = st(e.readBytes(20));
  return { type: Z.Address, version: n, hash160: r };
}
function Dp(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === Ne.Standard || t.prefix === Ne.Contract) && e.push(xo(t.address)), t.prefix === Ne.Contract && e.push(Es(t.contractName)), pe(e);
}
function DS(t) {
  const e = Re(t, Zt) ? t : new Zt(t), n = e.readUInt8Enum(Ne, (s) => {
    throw new Be(`Unexpected Principal payload type: ${s}`);
  });
  if (n === Ne.Origin)
    return { type: Z.Principal, prefix: n };
  const r = Ss(e);
  if (n === Ne.Standard)
    return { type: Z.Principal, prefix: n, address: r };
  const i = un(e);
  return {
    type: Z.Principal,
    prefix: n,
    address: r,
    contractName: i
  };
}
function Es(t) {
  const e = [], n = Ti(t.content), r = n.byteLength;
  return e.push(jt(po(r, t.lengthPrefixBytes))), e.push(n), pe(e);
}
function un(t, e, n) {
  e = e || 1;
  const r = Re(t, Zt) ? t : new Zt(t), i = Ha(st(r.readBytes(e))), s = go(r.readBytes(i));
  return En(s, e, n ?? 128);
}
function FS(t) {
  const e = [], n = Ti(t.content), r = p3(st(n), Aa * 2);
  return e.push(jt(r)), pe(e);
}
function Fp(t) {
  const e = Re(t, Zt) ? t : new Zt(t);
  let n = go(e.readBytes(Aa));
  return n = n.replace(/\u0000*$/, ""), { type: Z.MemoString, content: n };
}
function jp(t) {
  const e = [];
  return e.push(xo(t.address)), e.push(Es(t.contractName)), e.push(Es(t.assetName)), pe(e);
}
function xl(t) {
  const e = Re(t, Zt) ? t : new Zt(t);
  return {
    type: Z.Asset,
    address: Ss(e),
    contractName: un(e),
    assetName: un(e)
  };
}
function Lu(t) {
  const e = t.values, n = [];
  n.push(jt(po(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Jn(r));
  return pe(n);
}
function zp(t, e, n) {
  const r = Re(t, Zt) ? t : new Zt(t), i = Ha(st(r.readBytes(4))), s = [];
  for (let o = 0; o < i; o++)
    switch (e) {
      case Z.Address:
        s.push(Ss(r));
        break;
      case Z.LengthPrefixedString:
        s.push(un(r));
        break;
      case Z.MemoString:
        s.push(Fp(r));
        break;
      case Z.Asset:
        s.push(xl(r));
        break;
      case Z.PostCondition:
        s.push(zS(r));
        break;
      case Z.PublicKey:
        s.push(Al(r));
        break;
      case Z.TransactionAuthField:
        s.push(GS(r));
        break;
    }
  return ku(s, n);
}
function jS(t) {
  return st(Rp(t));
}
function Rp(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Dp(t.principal)), (t.conditionType === ne.Fungible || t.conditionType === ne.NonFungible) && e.push(jp(t.asset)), t.conditionType === ne.NonFungible && e.push(Hn(t.assetName)), e.push(t.conditionCode), t.conditionType === ne.STX || t.conditionType === ne.Fungible || t.conditionType === ne.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new rs("The post-condition amount may not be larger than 8 bytes");
    e.push(Vr(t.amount, 8));
  }
  return pe(e);
}
function zS(t) {
  const e = Re(t, Zt) ? t : new Zt(t), n = e.readUInt8Enum(ne, (a) => {
    throw new Be(`Could not read ${a} as PostConditionType`);
  }), r = DS(e);
  let i, s, o;
  switch (n) {
    case ne.STX:
      return i = e.readUInt8Enum(Qs, (c) => {
        throw new Be(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${st(e.readBytes(8))}`), {
        type: Z.PostCondition,
        conditionType: ne.STX,
        principal: r,
        conditionCode: i,
        amount: o
      };
    case ne.Fungible:
      return s = xl(e), i = e.readUInt8Enum(Qs, (c) => {
        throw new Be(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${st(e.readBytes(8))}`), {
        type: Z.PostCondition,
        conditionType: ne.Fungible,
        principal: r,
        conditionCode: i,
        amount: o,
        asset: s
      };
    case ne.NonFungible:
      s = xl(e);
      const a = _n(e);
      return i = e.readUInt8Enum(pl, (c) => {
        throw new Be(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: Z.PostCondition,
        conditionType: ne.NonFungible,
        principal: r,
        conditionCode: i,
        asset: s,
        assetName: a
      };
    case ne.Staking:
      return i = e.readUInt8Enum(Qs, (c) => {
        throw new Be(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${st(e.readBytes(8))}`), {
        type: Z.PostCondition,
        conditionType: ne.Staking,
        principal: r,
        conditionCode: i,
        amount: o
      };
    case ne.PoX: {
      const c = e.readUInt8Enum(gl, (f) => {
        throw new Be(`Could not read ${f} as PoxConditionCode`);
      });
      return {
        type: Z.PostCondition,
        conditionType: ne.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function Gp(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Kt.TokenTransfer:
      e.push(Hn(t.recipient)), e.push(Vr(t.amount, 8)), e.push(Jn(t.memo));
      break;
    case Kt.ContractCall:
      e.push(Jn(t.contractAddress)), e.push(Jn(t.contractName)), e.push(Jn(t.functionName));
      const n = new Uint8Array(4);
      di(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Hn(r));
      });
      break;
    case Kt.SmartContract:
      e.push(Jn(t.contractName)), e.push(Jn(t.codeBody));
      break;
    case Kt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Jn(t.contractName)), e.push(Jn(t.codeBody));
      break;
    case Kt.PoisonMicroblock:
      break;
    case Kt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Kt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Hn(t.recipient));
      break;
    case Kt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Hn(t.recipient ? Op(t.recipient) : Hp())), e.push(t.vrfProof);
      break;
    case Kt.TenureChange:
      e.push(jt(t.tenureHash)), e.push(jt(t.previousTenureHash)), e.push(jt(t.burnViewHash)), e.push(jt(t.previousTenureEnd)), e.push(di(new Uint8Array(4), t.previousTenureBlocks)), e.push(Dw(new Uint8Array(1), t.cause)), e.push(jt(t.publicKeyHash));
      break;
  }
  return pe(e);
}
function RS(t) {
  const e = Re(t, Zt) ? t : new Zt(t);
  switch (e.readUInt8Enum(Kt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Kt.TokenTransfer:
      const r = _n(e), i = Ce(e.readBytes(8)), s = Fp(e);
      return TS(r, i, s);
    case Kt.ContractCall:
      const o = Ss(e), a = un(e), c = un(e), f = [], d = e.readUInt32BE();
      for (let $ = 0; $ < d; $++) {
        const I = _n(e);
        f.push(I);
      }
      return BS(o, a, c, f);
    case Kt.SmartContract:
      const l = un(e), g = un(e, 4, 1e5);
      return Sd(l, g);
    case Kt.VersionedSmartContract: {
      const $ = e.readUInt8Enum(hl, (tt) => {
        throw new Error(`Cannot recognize ClarityVersion: ${tt}`);
      }), I = un(e), z = un(e, 4, Cx);
      return Sd(I, z, $);
    }
    case Kt.PoisonMicroblock:
      return NS();
    case Kt.Coinbase: {
      const $ = e.readBytes(ci);
      return Ed($);
    }
    case Kt.CoinbaseToAltRecipient: {
      const $ = e.readBytes(ci), I = _n(e);
      return Ed($, I);
    }
    case Kt.NakamotoCoinbase: {
      const $ = e.readBytes(ci), I = _n(e), z = e.readBytes(dl);
      return _S($, I, z);
    }
    case Kt.TenureChange:
      const h = st(e.readBytes(20)), x = st(e.readBytes(20)), b = st(e.readBytes(20)), L = st(e.readBytes(32)), H = e.readUInt32BE(), U = e.readUInt8Enum(yl, ($) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${$}`);
      }), p = st(e.readBytes(20));
      return US(h, x, b, L, H, U, p);
  }
}
function Sl(t) {
  const e = Re(t, Zt) ? t : new Zt(t);
  return ml(st(e.readBytes(Ya)));
}
function GS(t) {
  const e = Re(t, Zt) ? t : new Zt(t), n = e.readUInt8Enum(bn, (r) => {
    throw new Be(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case bn.PublicKeyCompressed:
      return is(oe.Compressed, Al(e));
    case bn.PublicKeyUncompressed:
      return is(oe.Uncompressed, Ts($3(Al(e).data)));
    case bn.SignatureCompressed:
      return is(oe.Compressed, Sl(e));
    case bn.SignatureUncompressed:
      return is(oe.Uncompressed, Sl(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Cu(t) {
  return jt(t.data);
}
function KS(t) {
  const e = [];
  switch (t.contents.type) {
    case Z.PublicKey:
      e.push(t.pubKeyEncoding === oe.Compressed ? bn.PublicKeyCompressed : bn.PublicKeyUncompressed), e.push(jt(v3(t.contents.data)));
      break;
    case Z.MessageSignature:
      e.push(t.pubKeyEncoding === oe.Compressed ? bn.SignatureCompressed : bn.SignatureUncompressed), e.push(Cu(t.contents));
      break;
  }
  return pe(e);
}
function El(t) {
  return t.data.slice();
}
function Al(t) {
  const e = Re(t, Zt) ? t : new Zt(t), n = e.readUInt8(), r = n === 4 ? Sx : xx;
  return Ts(pe([n, e.readBytes(r)]));
}
function Tu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Wt.P2PKH || e === Wt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Wt.P2WPKH || e === Wt.P2WSH || e === Wt.P2WSHNonSequential) && !r.map((i) => i.data).every(Bs))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Wt.P2PKH:
      return Ro(t, g3(r[0].data));
    case Wt.P2WPKH:
      return Ro(t, y3(r[0].data));
    case Wt.P2SH:
    case Wt.P2SHNonSequential:
      return Ro(t, w3(n, r.map(El)));
    case Wt.P2WSH:
    case Wt.P2WSHNonSequential:
      return Ro(t, b3(n, r.map(El)));
  }
}
function Ro(t, e) {
  return { type: Z.Address, version: t, hash160: e };
}
function Bu(t) {
  return _i.c32address(t.version, t.hash160);
}
function Ad(t) {
  const [e, n, r] = t.split(/\.|::/);
  return PS(e, n, r);
}
function Rs(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return HS(e, n);
  } else
    return OS(t);
}
function VS(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return WS(e, n);
  } else
    return qS(t);
}
function qS(t) {
  const e = Xr(t);
  return { type: Ut.PrincipalStandard, value: Bu(e) };
}
function XS(t) {
  return { type: Ut.PrincipalStandard, value: Bu(t) };
}
function WS(t, e) {
  const n = Xr(t), r = En(e);
  return Kp(n, r);
}
function Kp(t, e) {
  if (Ti(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Ut.PrincipalContract,
    value: `${Bu(t)}.${e.content}`
  };
}
function YS(t) {
  return { type: Ut.ResponseErr, value: t };
}
function ZS(t) {
  return { type: Ut.ResponseOk, value: t };
}
const QS = (t) => ({ type: Ut.StringASCII, value: t }), JS = (t) => ({ type: Ut.StringUTF8, value: t });
function t3(t) {
  for (const e in t)
    if (!m3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Ut.Tuple, value: t };
}
function _n(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Zt(jt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Zt(t) : e = t;
  switch (e.readUInt8Enum(xe, (r) => {
    throw new Be(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case xe.int:
      return IS(Yc(e.readBytes(16)));
    case xe.uint:
      return kS(e.readBytes(16));
    case xe.buffer:
      const r = e.readUInt32BE();
      return vS(e.readBytes(r));
    case xe.true:
      return ES();
    case xe.false:
      return AS();
    case xe.address:
      const i = Ss(e);
      return XS(i);
    case xe.contract:
      const s = Ss(e), o = un(e);
      return Kp(s, o);
    case xe.ok:
      return ZS(_n(e));
    case xe.err:
      return YS(_n(e));
    case xe.none:
      return Hp();
    case xe.some:
      return Op(_n(e));
    case xe.list:
      const a = e.readUInt32BE(), c = [];
      for (let b = 0; b < a; b++)
        c.push(_n(e));
      return LS(c);
    case xe.tuple:
      const f = e.readUInt32BE(), d = {};
      for (let b = 0; b < f; b++) {
        const L = un(e).content;
        if (L === void 0)
          throw new Be('"content" is undefined');
        d[L] = _n(e);
      }
      return t3(d);
    case xe.ascii:
      const l = e.readUInt32BE(), g = Bw(e.readBytes(l));
      return QS(g);
    case xe.utf8:
      const h = e.readUInt32BE(), x = go(e.readBytes(h));
      return JS(x);
    default:
      throw new Be("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function zn(t, e) {
  return pe([Iu(t), e]);
}
function e3(t) {
  return new Uint8Array([Iu(t.type)]);
}
function n3(t) {
  return t.type === Ut.OptionalNone ? new Uint8Array([Iu(t.type)]) : zn(t.type, Hn(t.value));
}
function r3(t) {
  const e = new Uint8Array(4);
  return di(e, Math.ceil(t.value.length / 2), 0), zn(t.type, Fn(e, jt(t.value)));
}
function i3(t) {
  const e = eu(Iw(BigInt(t.value), BigInt(mx)), Lp);
  return zn(t.type, e);
}
function s3(t) {
  const e = eu(BigInt(t.value), Lp);
  return zn(t.type, e);
}
function o3(t) {
  return zn(t.type, xo(Xr(t.value)));
}
function a3(t) {
  const [e, n] = x3(t.value);
  return zn(t.type, Fn(xo(Xr(e)), Es(En(n))));
}
function c3(t) {
  return zn(t.type, Hn(t.value));
}
function l3(t) {
  const e = [], n = new Uint8Array(4);
  di(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const i = Hn(r);
    e.push(i);
  }
  return zn(t.type, pe(e));
}
function u3(t) {
  const e = [], n = new Uint8Array(4);
  di(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = En(i);
    e.push(Es(s));
    const o = Hn(t.value[i]);
    e.push(o);
  }
  return zn(t.type, pe(e));
}
function Vp(t, e) {
  const n = [], r = e == "ascii" ? Tw(t.value) : Ti(t.value), i = new Uint8Array(4);
  return di(i, r.length, 0), n.push(i), n.push(r), zn(t.type, pe(n));
}
function f3(t) {
  return Vp(t, "ascii");
}
function d3(t) {
  return Vp(t, "utf8");
}
function vd(t) {
  return st(Hn(t));
}
function Hn(t) {
  switch (t.type) {
    case Ut.BoolTrue:
    case Ut.BoolFalse:
      return e3(t);
    case Ut.OptionalNone:
    case Ut.OptionalSome:
      return n3(t);
    case Ut.Buffer:
      return r3(t);
    case Ut.UInt:
      return s3(t);
    case Ut.Int:
      return i3(t);
    case Ut.PrincipalStandard:
      return o3(t);
    case Ut.PrincipalContract:
      return a3(t);
    case Ut.ResponseOk:
    case Ut.ResponseErr:
      return c3(t);
    case Ut.List:
      return l3(t);
    case Ut.Tuple:
      return u3(t);
    case Ut.StringASCII:
      return f3(t);
    case Ut.StringUTF8:
      return d3(t);
    default:
      throw new rs("Unable to serialize. Invalid Clarity Value.");
  }
}
const h3 = (t) => t.length % 2 ? `0${t}` : t, p3 = (t, e) => t.padEnd(e, "0"), qp = (t, e) => t ? Ti(t).length > e : !1;
function vl(t) {
  return vp(t);
}
const ro = (t) => Xx(Au(t)), Mu = (t) => st(SS(t)), g3 = (t) => st(ro(t)), y3 = (t) => {
  const e = ro(t), n = Fn(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ro(n);
  return st(r);
}, w3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + e.length), n.push(174);
  const r = pe(n), i = ro(r);
  return st(i);
}, b3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = pe(n), i = Au(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = pe(s), a = ro(o);
  return st(a);
};
function m3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function x3(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
fe.hmacSha256Sync = (t, ...e) => {
  const n = Mp.create(Au, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Ts(t) {
  return t = typeof t == "string" ? jt(t) : t, {
    type: Z.PublicKey,
    data: t
  };
}
function S3(t, e, n = oe.Compressed) {
  const r = Uw(e), i = new Ze(vf(r.r), vf(r.s)), s = Tt.fromSignature(t, i, r.recoveryId), o = n === oe.Compressed;
  return s.toHex(o);
}
function E3(t) {
  return typeof t == "string" ? t : st(t);
}
const Nu = E3;
function Xp(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === _w;
}
function Bs(t) {
  return !Nu(t).startsWith("04");
}
function A3(t) {
  t = nu(t);
  const e = Xp(t);
  return st(yo(t.slice(0, 32), e));
}
function v3(t) {
  return Tt.fromHex(Nu(t)).toHex(!0);
}
function $3(t) {
  return Tt.fromHex(Nu(t)).toHex(!1);
}
function I3(t, e) {
  t = nu(t);
  const [n, r] = Da(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return po(r, 1) + Ze.fromHex(n).toCompactHex();
}
function _u() {
  return {
    type: Z.MessageSignature,
    data: st(new Uint8Array(Ya))
  };
}
function Wp(t, e, n, r) {
  const i = Tu(0, t, 1, [Ts(e)]).hash160, s = Bs(e) ? oe.Compressed : oe.Uncompressed;
  return {
    hashMode: t,
    signer: i,
    nonce: Ce(n),
    fee: Ce(r),
    keyEncoding: s,
    signature: _u()
  };
}
function io(t) {
  return "signature" in t;
}
function $d(t) {
  return t === Wt.P2SH || t === Wt.P2WSH;
}
function k3(t) {
  return t === Wt.P2SHNonSequential || t === Wt.P2WSHNonSequential;
}
function Id(t) {
  const e = vl(t);
  return e.nonce = 0, e.fee = 0, io(e) ? e.signature = _u() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function L3(t) {
  const e = [
    t.hashMode,
    jt(t.signer),
    Vr(t.nonce, 8),
    Vr(t.fee, 8),
    t.keyEncoding,
    Cu(t.signature)
  ];
  return pe(e);
}
function C3(t) {
  const e = [
    t.hashMode,
    jt(t.signer),
    Vr(t.nonce, 8),
    Vr(t.fee, 8)
  ], n = ku(t.fields);
  e.push(Lu(n));
  const r = new Uint8Array(2);
  return Hw(r, t.signaturesRequired, 0), e.push(r), pe(e);
}
function T3(t, e) {
  const n = st(e.readBytes(20)), r = BigInt(`0x${st(e.readBytes(8))}`), i = BigInt(`0x${st(e.readBytes(8))}`), s = e.readUInt8Enum(oe, (a) => {
    throw new Be(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Wt.P2WPKH && s != oe.Compressed)
    throw new Be("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Sl(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    keyEncoding: s,
    signature: o
  };
}
function B3(t, e) {
  const n = st(e.readBytes(20)), r = BigInt("0x" + st(e.readBytes(8))), i = BigInt("0x" + st(e.readBytes(8))), s = zp(e, Z.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const f of s)
    switch (f.contents.type) {
      case Z.PublicKey:
        Bs(f.contents.data) || (o = !0);
        break;
      case Z.MessageSignature:
        if (f.pubKeyEncoding === oe.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new ri("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Wt.P2WSH || t === Wt.P2WSHNonSequential))
    throw new ri("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: c
  };
}
function kc(t) {
  return io(t) ? L3(t) : C3(t);
}
function Lc(t) {
  const e = t.readUInt8Enum(Wt, (n) => {
    throw new Be(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Wt.P2PKH || e === Wt.P2WPKH ? T3(e, t) : B3(e, t);
}
function Yp(t, e, n, r) {
  const s = t + st(new Uint8Array([e])) + st(Vr(n, 8)) + st(Vr(r, 8));
  if (jt(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Mu(jt(s));
}
function Zp(t, e, n) {
  const r = 33 + Ya, i = Bs(e.data) ? oe.Compressed : oe.Uncompressed, s = t + h3(i.toString(16)) + n, o = jt(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Mu(o);
}
function M3(t, e, n, r, i) {
  const s = Yp(t, e, n, r), o = I3(i, s), a = Ts(A3(i)), c = Zp(s, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Qp(t, e, n, r, i, s) {
  const o = Yp(t, e, n, r), a = Ts(S3(o, s, i)), c = Zp(o, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function N3() {
  const t = Wp(Wt.P2PKH, "", 0, 0);
  return t.signer = CS().hash160, t.keyEncoding = oe.Compressed, t.signature = _u(), t;
}
function kd(t, e, n) {
  return io(t) ? _3(t, e, n) : U3(t, e, n);
}
function _3(t, e, n) {
  const { pubKey: r, nextSigHash: i } = Qp(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), s = Tu(0, t.hashMode, 1, [r]).hash160;
  if (s !== t.signer)
    throw new ri(`Signer hash does not equal hash of public key(s): ${s} != ${t.signer}`);
  return i;
}
function U3(t, e, n) {
  const r = [];
  let i = e, s = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case Z.PublicKey:
        Bs(c.contents.data) || (s = !0), r.push(c.contents);
        break;
      case Z.MessageSignature:
        c.pubKeyEncoding === oe.Uncompressed && (s = !0);
        const { pubKey: f, nextSigHash: d } = Qp(i, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if ($d(t.hashMode) && (i = d), r.push(f), o += 1, o === 65536)
          throw new ri("Too many signatures");
        break;
    }
  if ($d(t.hashMode) && o !== t.signaturesRequired || k3(t.hashMode) && o < t.signaturesRequired)
    throw new ri("Incorrect number of signatures");
  if (s && (t.hashMode === Wt.P2WSH || t.hashMode === Wt.P2WSHNonSequential))
    throw new ri("Uncompressed keys are not allowed in this hash mode");
  const a = Tu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new ri(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return i;
}
function Jp(t) {
  return {
    authType: le.Standard,
    spendingCondition: t
  };
}
function tg(t, e) {
  return {
    authType: le.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Wp(Wt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Ld(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case le.Standard:
        return Jp(Id(t.spendingCondition));
      case le.Sponsored:
        return tg(Id(t.spendingCondition), N3());
      default:
        throw new $a("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function P3(t, e) {
  switch (t.authType) {
    case le.Standard:
      return kd(t.spendingCondition, e, le.Standard);
    case le.Sponsored:
      return kd(t.spendingCondition, e, le.Standard);
    default:
      throw new $a("Invalid origin auth type");
  }
}
function H3(t, e) {
  switch (t.authType) {
    case le.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Ce(e)
      };
      return { ...t, spendingCondition: n };
    case le.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Ce(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function O3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Ce(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function D3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Ce(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function F3(t, e) {
  const n = {
    ...e,
    nonce: Ce(e.nonce),
    fee: Ce(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function j3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case le.Standard:
      e.push(kc(t.spendingCondition));
      break;
    case le.Sponsored:
      e.push(kc(t.spendingCondition)), e.push(kc(t.sponsorSpendingCondition));
      break;
  }
  return pe(e);
}
function z3(t) {
  const e = t.readUInt8Enum(le, (r) => {
    throw new Be(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case le.Standard:
      return n = Lc(t), Jp(n);
    case le.Sponsored:
      n = Lc(t);
      const r = Lc(t);
      return tg(n, r);
  }
}
class R3 {
  constructor({ auth: e, payload: n, postConditions: r = ku([]), postConditionMode: i = va.Deny, transactionVersion: s, chainId: o, network: a = "mainnet" }) {
    a = yx(a), this.transactionVersion = s ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Ce(n.amount)
    } : this.payload = n, this.postConditionMode = i, this.postConditions = r, this.anchorMode = qe.Any;
  }
  signBegin() {
    const e = vl(this);
    return e.auth = Ld(e.auth), e.txid();
  }
  verifyBegin() {
    const e = vl(this);
    return e.auth = Ld(e.auth), e.txid();
  }
  verifyOrigin() {
    return P3(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, le.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === le.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, le.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : Ts(e), r = this.auth.spendingCondition;
    if (r && !io(r)) {
      const i = Bs(n.data);
      r.fields.push(is(i ? oe.Compressed : oe.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, i) {
    const { nextSig: s, nextSigHash: o } = M3(n, r, e.fee, e.nonce, i);
    if (io(e))
      e.signature = ml(s);
    else {
      const a = Xp(i);
      e.fields.push(is(a ? oe.Compressed : oe.Uncompressed, ml(s)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return Mu(e);
  }
  setSponsor(e) {
    if (this.auth.authType != le.Sponsored)
      throw new $a("Cannot sponsor sign a non-sponsored transaction");
    this.auth = F3(this.auth, e);
  }
  setFee(e) {
    this.auth = H3(this.auth, e);
  }
  setNonce(e) {
    this.auth = O3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != le.Sponsored)
      throw new $a("Cannot sponsor sign a non-sponsored transaction");
    this.auth = D3(this.auth, e);
  }
  serialize() {
    return st(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new rs('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new rs('"chainId" is undefined');
    if (this.auth === void 0)
      throw new rs('"auth" is undefined');
    if (this.payload === void 0)
      throw new rs('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return di(n, this.chainId, 0), e.push(n), e.push(j3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Lu(this.postConditions)), e.push(Gp(this.payload)), pe(e);
  }
}
function G3(t) {
  const e = Re(t, Zt) ? t : new Zt(t), n = e.readUInt8Enum(Si, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), i = z3(e), s = e.readUInt8Enum(qe, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(va, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = zp(e, Z.PostCondition), c = RS(e), f = new R3({
    transactionVersion: n,
    chainId: r,
    auth: i,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return f.anchorMode = s, f;
}
const Cd = BigInt("18446744073709551615");
function Cc(t) {
  const e = Ce(t);
  if (e < 0n || e > Cd)
    throw new RangeError(`Post-condition amount must be between 0 and ${Cd} (u64 max), received: ${e}`);
  return e;
}
var $l;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})($l || ($l = {}));
var Il;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Il || (Il = {}));
function K3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: Z.PostCondition,
        conditionType: ne.STX,
        principal: t.address === "origin" ? { type: Z.Principal, prefix: Ne.Origin } : Rs(t.address),
        conditionCode: Go(t.condition),
        amount: Cc(t.amount)
      };
    case "ft-postcondition":
      return {
        type: Z.PostCondition,
        conditionType: ne.Fungible,
        principal: t.address === "origin" ? { type: Z.Principal, prefix: Ne.Origin } : Rs(t.address),
        conditionCode: Go(t.condition),
        amount: Cc(t.amount),
        asset: Ad(t.asset)
      };
    case "nft-postcondition":
      return {
        type: Z.PostCondition,
        conditionType: ne.NonFungible,
        principal: t.address === "origin" ? { type: Z.Principal, prefix: Ne.Origin } : Rs(t.address),
        conditionCode: Go(t.condition),
        asset: Ad(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: Z.PostCondition,
        conditionType: ne.Staking,
        principal: t.address === "origin" ? { type: Z.Principal, prefix: Ne.Origin } : Rs(t.address),
        conditionCode: Go(t.condition),
        amount: Cc(t.amount)
      };
    case "pox-postcondition":
      return {
        type: Z.PostCondition,
        conditionType: ne.PoX,
        principal: t.address === "origin" ? { type: Z.Principal, prefix: Ne.Origin } : Rs(t.address),
        conditionCode: V3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Go(t) {
  return $l[t];
}
function V3(t) {
  return Il[t];
}
function eg(t) {
  const e = K3(t);
  return jS(e);
}
function q3(t, e, n) {
  return Pu(ng(t), n);
}
function ng(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = so(r);
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
    return BigInt(`0x${Y3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Uu(t, e = 8) {
  return (typeof t == "bigint" ? t : ng(t)).toString(16).padStart(e * 2, "0");
}
function Pu(t, e = 16) {
  const n = Uu(t, e);
  return so(n);
}
function X3(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const W3 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Y3(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += W3[n];
  return e;
}
function so(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t;
  const e = t.length % 2 ? `0${t}` : t, n = new Uint8Array(e.length / 2);
  for (let r = 0; r < n.length; r++) {
    const i = r * 2, s = e.slice(i, i + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    n[r] = o;
  }
  return n;
}
function Hu(t) {
  return new TextEncoder().encode(t);
}
function Z3(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Q3(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Td(t) {
  if (t.some(Q3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Ou(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, i) => r + i.length, 0), n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function ar(t) {
  return Ou(...t.map((e) => typeof e == "number" ? Td([e]) : e instanceof Array ? Td(e) : e));
}
function Ja(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var kl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(kl || (kl = {}));
kl.Mainnet;
const J3 = 128, tE = 128, rg = 16;
var Ll;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Ll || (Ll = {}));
var Bd;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Bd || (Bd = {}));
var Md;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Md || (Md = {}));
var wn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(wn || (wn = {}));
const Tc = ["onChainOnly", "offChainOnly", "any"];
Tc[0] + "", wn.OnChainOnly, Tc[1] + "", wn.OffChainOnly, Tc[2] + "", wn.Any, wn.OnChainOnly + "", wn.OnChainOnly, wn.OffChainOnly + "", wn.OffChainOnly, wn.Any + "", wn.Any;
var Cl;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Cl || (Cl = {}));
Cl.Mainnet;
var Nd;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Nd || (Nd = {}));
var Jr;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Jr || (Jr = {}));
var _d;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(_d || (_d = {}));
var Ud;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Ud || (Ud = {}));
var Pd;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Pd || (Pd = {}));
var Hd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Hd || (Hd = {}));
var Od;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Od || (Od = {}));
var Dd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Dd || (Dd = {}));
var Tl;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Tl || (Tl = {}));
var Fd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Fd || (Fd = {}));
var jd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(jd || (jd = {}));
function Bl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function eE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function ig(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function nE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Bl(t.outputLen), Bl(t.blockLen);
}
function rE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function iE(t, e) {
  ig(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Bc = {
  number: Bl,
  bool: eE,
  bytes: ig,
  hash: nE,
  exists: rE,
  output: iE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Mc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Bn = (t, e) => t << 32 - e | t >>> e, sE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!sE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function oE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function sg(t) {
  if (typeof t == "string" && (t = oE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let aE = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Pi(t) {
  const e = (r) => t().update(sg(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function cE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let Du = class extends aE {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Mc(this.buffer);
  }
  update(e) {
    Bc.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = sg(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Mc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Bc.exists(this), Bc.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    cE(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Mc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      a.setUint32(4 * l, d[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.length = i, e.pos = a, e.finished = s, e.destroyed = o, i % n && e.buffer.set(r), e;
  }
};
const lE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), og = Uint8Array.from({ length: 16 }, (t, e) => e), uE = og.map((t) => (9 * t + 5) % 16);
let Fu = [og], ju = [uE];
for (let t = 0; t < 4; t++)
  for (let e of [Fu, ju])
    e.push(e[t].map((n) => lE[n]));
const ag = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), fE = Fu.map((t, e) => t.map((n) => ag[e][n])), dE = ju.map((t, e) => t.map((n) => ag[e][n])), hE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), pE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ko = (t, e) => t << e | t >>> 32 - e;
function zd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Vo = new Uint32Array(16);
let gE = class extends Du {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: i, h4: s } = this;
    return [e, n, r, i, s];
  }
  set(e, n, r, i, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let h = 0; h < 16; h++, n += 4)
      Vo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, b = hE[h], L = pE[h], H = Fu[h], U = ju[h], p = fE[h], $ = dE[h];
      for (let I = 0; I < 16; I++) {
        const z = Ko(r + zd(h, s, a, f) + Vo[H[I]] + b, p[I]) + l | 0;
        r = l, l = f, f = Ko(a, 10) | 0, a = s, s = z;
      }
      for (let I = 0; I < 16; I++) {
        const z = Ko(i + zd(x, o, c, d) + Vo[U[I]] + L, $[I]) + g | 0;
        i = g, g = d, d = Ko(c, 10) | 0, c = o, o = z;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Vo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Pi(() => new gE());
const yE = (t, e, n) => t & e ^ ~t & n, wE = (t, e, n) => t & e ^ t & n ^ e & n, bE = new Uint32Array([
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
]), Cr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Tr = new Uint32Array(64);
let cg = class extends Du {
  constructor() {
    super(64, 32, 8, !1), this.A = Cr[0] | 0, this.B = Cr[1] | 0, this.C = Cr[2] | 0, this.D = Cr[3] | 0, this.E = Cr[4] | 0, this.F = Cr[5] | 0, this.G = Cr[6] | 0, this.H = Cr[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      Tr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Tr[l - 15], h = Tr[l - 2], x = Bn(g, 7) ^ Bn(g, 18) ^ g >>> 3, b = Bn(h, 17) ^ Bn(h, 19) ^ h >>> 10;
      Tr[l] = b + Tr[l - 7] + x + Tr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Bn(a, 6) ^ Bn(a, 11) ^ Bn(a, 25), h = d + g + yE(a, c, f) + bE[l] + Tr[l] | 0, b = (Bn(r, 2) ^ Bn(r, 13) ^ Bn(r, 22)) + wE(r, i, s) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = s, s = i, i = r, r = h + b | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, f, d);
  }
  roundClean() {
    Tr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, mE = class extends cg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Pi(() => new cg());
Pi(() => new mE());
const qo = BigInt(2 ** 32 - 1), Ml = BigInt(32);
function lg(t, e = !1) {
  return e ? { h: Number(t & qo), l: Number(t >> Ml & qo) } : { h: Number(t >> Ml & qo) | 0, l: Number(t & qo) | 0 };
}
function xE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = lg(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const SE = (t, e) => BigInt(t >>> 0) << Ml | BigInt(e >>> 0), EE = (t, e, n) => t >>> n, AE = (t, e, n) => t << 32 - n | e >>> n, vE = (t, e, n) => t >>> n | e << 32 - n, $E = (t, e, n) => t << 32 - n | e >>> n, IE = (t, e, n) => t << 64 - n | e >>> n - 32, kE = (t, e, n) => t >>> n - 32 | e << 64 - n, LE = (t, e) => e, CE = (t, e) => t, TE = (t, e, n) => t << n | e >>> 32 - n, BE = (t, e, n) => e << n | t >>> 32 - n, ME = (t, e, n) => e << n - 32 | t >>> 64 - n, NE = (t, e, n) => t << n - 32 | e >>> 64 - n;
function _E(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const UE = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), PE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, HE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), OE = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, DE = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), FE = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, $t = {
  fromBig: lg,
  split: xE,
  toBig: SE,
  shrSH: EE,
  shrSL: AE,
  rotrSH: vE,
  rotrSL: $E,
  rotrBH: IE,
  rotrBL: kE,
  rotr32H: LE,
  rotr32L: CE,
  rotlSH: TE,
  rotlSL: BE,
  rotlBH: ME,
  rotlBL: NE,
  add: _E,
  add3L: UE,
  add3H: PE,
  add4L: HE,
  add4H: OE,
  add5H: FE,
  add5L: DE
}, [jE, zE] = $t.split([
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
].map((t) => BigInt(t))), Br = new Uint32Array(80), Mr = new Uint32Array(80);
let tc = class extends Du {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: x, Hh: b, Hl: L } = this;
    return [e, n, r, i, s, o, a, c, f, d, l, g, h, x, b, L];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, f, d, l, g, h, x, b, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = b | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Br[p] = e.getUint32(n), Mr[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const $ = Br[p - 15] | 0, I = Mr[p - 15] | 0, z = $t.rotrSH($, I, 1) ^ $t.rotrSH($, I, 8) ^ $t.shrSH($, I, 7), tt = $t.rotrSL($, I, 1) ^ $t.rotrSL($, I, 8) ^ $t.shrSL($, I, 7), F = Br[p - 2] | 0, Y = Mr[p - 2] | 0, S = $t.rotrSH(F, Y, 19) ^ $t.rotrBH(F, Y, 61) ^ $t.shrSH(F, Y, 6), C = $t.rotrSL(F, Y, 19) ^ $t.rotrBL(F, Y, 61) ^ $t.shrSL(F, Y, 6), _ = $t.add4L(tt, C, Mr[p - 7], Mr[p - 16]), B = $t.add4H(_, z, S, Br[p - 7], Br[p - 16]);
      Br[p] = B | 0, Mr[p] = _ | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: x, Gh: b, Gl: L, Hh: H, Hl: U } = this;
    for (let p = 0; p < 80; p++) {
      const $ = $t.rotrSH(l, g, 14) ^ $t.rotrSH(l, g, 18) ^ $t.rotrBH(l, g, 41), I = $t.rotrSL(l, g, 14) ^ $t.rotrSL(l, g, 18) ^ $t.rotrBL(l, g, 41), z = l & h ^ ~l & b, tt = g & x ^ ~g & L, F = $t.add5L(U, I, tt, zE[p], Mr[p]), Y = $t.add5H(F, H, $, z, jE[p], Br[p]), S = F | 0, C = $t.rotrSH(r, i, 28) ^ $t.rotrBH(r, i, 34) ^ $t.rotrBH(r, i, 39), _ = $t.rotrSL(r, i, 28) ^ $t.rotrBL(r, i, 34) ^ $t.rotrBL(r, i, 39), B = r & s ^ r & a ^ s & a, X = i & o ^ i & c ^ o & c;
      H = b | 0, U = L | 0, b = h | 0, L = x | 0, h = l | 0, x = g | 0, { h: l, l: g } = $t.add(f | 0, d | 0, Y | 0, S | 0), f = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const K = $t.add3L(S, _, X);
      r = $t.add3H(K, Y, C, B), i = K | 0;
    }
    ({ h: r, l: i } = $t.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = $t.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = $t.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = $t.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = $t.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: x } = $t.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: b, l: L } = $t.add(this.Gh | 0, this.Gl | 0, b | 0, L | 0), { h: H, l: U } = $t.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, i, s, o, a, c, f, d, l, g, h, x, b, L, H, U);
  }
  roundClean() {
    Br.fill(0), Mr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, RE = class extends tc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, GE = class extends tc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, KE = class extends tc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Pi(() => new tc());
Pi(() => new RE());
Pi(() => new GE());
Pi(() => new KE());
function VE(t, e, n) {
  const i = J3;
  if (cA(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: Ll.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: i
  };
}
var Ee;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Ee || (Ee = {}));
let qE = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, ug = class extends qE {
  constructor(e) {
    super(e);
  }
};
function ec(t) {
  const e = [];
  return e.push(so(Uu(t.version, 1))), e.push(so(t.hash160)), ar(e);
}
function XE(t) {
  const e = [];
  return e.push(t.prefix), e.push(ec(t.address)), t.prefix === Tl.Contract && e.push(oo(t.contractName)), ar(e);
}
function oo(t) {
  const e = [], n = Hu(t.content), r = n.byteLength;
  return e.push(so(Uu(r, t.lengthPrefixBytes))), e.push(n), ar(e);
}
function WE(t) {
  const e = [];
  return e.push(ec(t.address)), e.push(oo(t.contractName)), e.push(oo(t.assetName)), ar(e);
}
function fg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(XE(t.principal)), (t.conditionType === Jr.Fungible || t.conditionType === Jr.NonFungible) && e.push(WE(t.assetInfo)), t.conditionType === Jr.NonFungible && e.push(Ai(t.assetName)), e.push(t.conditionCode), t.conditionType === Jr.STX || t.conditionType === Jr.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new ug("The post-condition amount may not be larger than 8 bytes");
    e.push(q3(t.amount, !1, 8));
  }
  return ar(e);
}
function Rn(t, e) {
  return ar([t, e]);
}
function YE(t) {
  return new Uint8Array([t.type]);
}
function ZE(t) {
  return t.type === Ee.OptionalNone ? new Uint8Array([t.type]) : Rn(t.type, Ai(t.value));
}
function QE(t) {
  const e = new Uint8Array(4);
  return Ja(e, t.buffer.length, 0), Rn(t.type, Ou(e, t.buffer));
}
function JE(t) {
  const e = Pu(X3(t.value, BigInt(tE)), rg);
  return Rn(t.type, e);
}
function tA(t) {
  const e = Pu(t.value, rg);
  return Rn(t.type, e);
}
function eA(t) {
  return Rn(t.type, ec(t.address));
}
function nA(t) {
  return Rn(t.type, Ou(ec(t.address), oo(t.contractName)));
}
function rA(t) {
  return Rn(t.type, Ai(t.value));
}
function iA(t) {
  const e = [], n = new Uint8Array(4);
  Ja(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const i = Ai(r);
    e.push(i);
  }
  return Rn(t.type, ar(e));
}
function sA(t) {
  const e = [], n = new Uint8Array(4);
  Ja(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = VE(i);
    e.push(oo(s));
    const o = Ai(t.data[i]);
    e.push(o);
  }
  return Rn(t.type, ar(e));
}
function dg(t, e) {
  const n = [], r = e == "ascii" ? Z3(t.data) : Hu(t.data), i = new Uint8Array(4);
  return Ja(i, r.length, 0), n.push(i), n.push(r), Rn(t.type, ar(n));
}
function oA(t) {
  return dg(t, "ascii");
}
function aA(t) {
  return dg(t, "utf8");
}
function Ai(t) {
  switch (t.type) {
    case Ee.BoolTrue:
    case Ee.BoolFalse:
      return YE(t);
    case Ee.OptionalNone:
    case Ee.OptionalSome:
      return ZE(t);
    case Ee.Buffer:
      return QE(t);
    case Ee.UInt:
      return tA(t);
    case Ee.Int:
      return JE(t);
    case Ee.PrincipalStandard:
      return eA(t);
    case Ee.PrincipalContract:
      return nA(t);
    case Ee.ResponseOk:
    case Ee.ResponseErr:
      return rA(t);
    case Ee.List:
      return iA(t);
    case Ee.Tuple:
      return sA(t);
    case Ee.StringASCII:
      return oA(t);
    case Ee.StringUTF8:
      return aA(t);
    default:
      throw new ug("Unable to serialize. Invalid Clarity Value.");
  }
}
const cA = (t, e) => t ? Hu(t).length > e : !1, lA = "connect-ui";
let aa, hg, Xe = !1, Nl = !1;
const or = (t, e = "") => () => {
}, uA = (t, e) => () => {
}, fA = "{visibility:hidden}.hydrated{visibility:inherit}", Rd = {}, dA = "http://www.w3.org/2000/svg", hA = "http://www.w3.org/1999/xhtml", pA = (t) => t != null, zu = (t) => (t = typeof t, t === "object" || t === "function");
function pg(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const mt = (t, e, ...n) => {
  let r = null, i = !1, s = !1;
  const o = [], a = (f) => {
    for (let d = 0; d < f.length; d++)
      r = f[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((i = typeof t != "function" && !zu(r)) && (r = String(r)), i && s ? o[o.length - 1].$text$ += r : o.push(i ? _l(null, r) : r), s = i);
  };
  if (a(n), e) {
    const f = e.className || e.class;
    f && (e.class = typeof f != "object" ? f : Object.keys(f).filter((d) => f[d]).join(" "));
  }
  const c = _l(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, _l = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, gA = {}, yA = (t) => t && t.$tag$ === gA, wA = (t, e) => t != null && !zu(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, bA = (t) => Ms(t).$hostElement$, mA = (t, e, n) => {
  const r = Le.ce(e, n);
  return t.dispatchEvent(r), r;
}, Gd = /* @__PURE__ */ new WeakMap(), xA = (t, e, n) => {
  let r = Ia.get(t);
  FA && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Ia.set(t, r);
}, SA = (t, e, n, r) => {
  var i;
  let s = gg(e);
  const o = Ia.get(s);
  if (t = t.nodeType === 11 ? t : On, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Gd.get(t), c;
      if (a || Gd.set(t, a = /* @__PURE__ */ new Set()), !a.has(s)) {
        {
          c = On.createElement("style"), c.innerHTML = o;
          const f = (i = Le.$nonce$) !== null && i !== void 0 ? i : pg(On);
          f != null && c.setAttribute("nonce", f), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(s);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return s;
}, EA = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, i = or("attachStyles", e.$tagName$), s = SA(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = s, n.classList.add(s + "-h")), i();
}, gg = (t, e) => "sc-" + t.$tagName$, Kd = (t, e, n, r, i, s) => {
  if (n !== r) {
    let o = qd(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, f = Vd(n), d = Vd(r);
      c.remove(...f.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !f.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : qd(nc, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Le.rel(t, e, n, !1), r && Le.ael(t, e, r, !1);
    else {
      const c = zu(r);
      if ((o || c && r !== null) && !i)
        try {
          if (t.tagName.includes("-"))
            t[e] = r;
          else {
            const f = r ?? "";
            e === "list" ? o = !1 : (n == null || t[e] != f) && (t[e] = f);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || t.getAttribute(e) === "") && t.removeAttribute(e) : (!o || s & 4 || i) && !c && (r = r === !0 ? "" : r, t.setAttribute(e, r));
    }
  }
}, AA = /\s/, Vd = (t) => t ? t.split(AA) : [], yg = (t, e, n, r) => {
  const i = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, s = t && t.$attrs$ || Rd, o = e.$attrs$ || Rd;
  for (r in s)
    r in o || Kd(i, r, s[r], void 0, n, e.$flags$);
  for (r in o)
    Kd(i, r, s[r], o[r], n, e.$flags$);
}, Ru = (t, e, n, r) => {
  const i = e.$children$[n];
  let s = 0, o, a;
  if (i.$text$ !== null)
    o = i.$elm$ = On.createTextNode(i.$text$);
  else {
    if (Xe || (Xe = i.$tag$ === "svg"), o = i.$elm$ = On.createElementNS(Xe ? dA : hA, i.$tag$), Xe && i.$tag$ === "foreignObject" && (Xe = !1), yg(null, i, Xe), pA(aa) && o["s-si"] !== aa && o.classList.add(o["s-si"] = aa), i.$children$)
      for (s = 0; s < i.$children$.length; ++s)
        a = Ru(t, i, s), a && o.appendChild(a);
    i.$tag$ === "svg" ? Xe = !1 : o.tagName === "foreignObject" && (Xe = !0);
  }
  return o;
}, wg = (t, e, n, r, i, s) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === hg && (o = o.shadowRoot); i <= s; ++i)
    r[i] && (a = Ru(null, n, i), a && (r[i].$elm$ = a, o.insertBefore(a, e)));
}, bg = (t, e, n, r, i) => {
  for (; e <= n; ++e)
    (r = t[e]) && (i = r.$elm$, i.remove());
}, vA = (t, e, n, r) => {
  let i = 0, s = 0, o = e.length - 1, a = e[0], c = e[o], f = r.length - 1, d = r[0], l = r[f], g;
  for (; i <= o && s <= f; )
    a == null ? a = e[++i] : c == null ? c = e[--o] : d == null ? d = r[++s] : l == null ? l = r[--f] : Xo(a, d) ? (qs(a, d), a = e[++i], d = r[++s]) : Xo(c, l) ? (qs(c, l), c = e[--o], l = r[--f]) : Xo(a, l) ? (qs(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++i], l = r[--f]) : Xo(c, d) ? (qs(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++s]) : (g = Ru(e && e[s], n, s), d = r[++s], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  i > o ? wg(t, r[f + 1] == null ? null : r[f + 1].$elm$, n, r, s, f) : s > f && bg(e, i, o);
}, Xo = (t, e) => t.$tag$ === e.$tag$, qs = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, i = e.$children$, s = e.$tag$, o = e.$text$;
  o === null ? (Xe = s === "svg" ? !0 : s === "foreignObject" ? !1 : Xe, yg(t, e, Xe), r !== null && i !== null ? vA(n, r, e, i) : i !== null ? (t.$text$ !== null && (n.textContent = ""), wg(n, null, e, i, 0, i.length - 1)) : r !== null && bg(r, 0, r.length - 1), Xe && s === "svg" && (Xe = !1)) : t.$text$ !== o && (n.data = o);
}, $A = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || _l(null, null), i = yA(e) ? e : mt(null, null, e);
  hg = n.tagName, i.$tag$ = null, i.$flags$ |= 4, t.$vnode$ = i, i.$elm$ = r.$elm$ = n.shadowRoot || n, aa = n["s-sc"], qs(r, i);
}, mg = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Gu = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return mg(t, t.$ancestorComponent$), zA(() => IA(t, e));
}, IA = (t, e) => {
  const n = or("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let i;
  return n(), TA(i, () => kA(t, r, e));
}, kA = async (t, e, n) => {
  const r = t.$hostElement$, i = or("update", t.$cmpMeta$.$tagName$), s = r["s-rc"];
  n && EA(t);
  const o = or("render", t.$cmpMeta$.$tagName$);
  LA(t, e), s && (s.map((a) => a()), r["s-rc"] = void 0), o(), i();
  {
    const a = r["s-p"], c = () => CA(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, LA = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, $A(t, e);
  } catch (r) {
    ao(r, t.$hostElement$);
  }
  return null;
}, CA = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = or("postUpdate", e), i = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Sg(n), r(), t.$onReadyResolve$(n), i || xg()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Vu(() => Gu(t, !1)), t.$flags$ &= -517;
}, xg = (t) => {
  Sg(On.documentElement), Vu(() => mA(nc, "appload", { detail: { namespace: lA } }));
}, TA = (t, e) => t && t.then ? t.then(e) : e(), Sg = (t) => t.classList.add("hydrated"), BA = (t, e) => Ms(t).$instanceValues$.get(e), MA = (t, e, n, r) => {
  const i = Ms(t), s = i.$instanceValues$.get(e), o = i.$flags$, a = i.$lazyInstance$;
  n = wA(n, r.$members$[e][0]);
  const c = Number.isNaN(s) && Number.isNaN(n), f = n !== s && !c;
  (!(o & 8) || s === void 0) && f && (i.$instanceValues$.set(e, n), a && (o & 18) === 2 && Gu(i, !1));
}, Eg = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), i = t.prototype;
    if (r.map(([s, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(i, s, {
        get() {
          return BA(this, s);
        },
        set(a) {
          MA(this, s, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const s = /* @__PURE__ */ new Map();
      i.attributeChangedCallback = function(o, a, c) {
        Le.jmp(() => {
          const f = s.get(o);
          if (this.hasOwnProperty(f))
            c = this[f], delete this[f];
          else if (i.hasOwnProperty(f) && typeof this[f] == "number" && this[f] == c)
            return;
          this[f] = c === null && typeof this[f] == "boolean" ? !1 : c;
        });
      }, t.observedAttributes = r.filter(
        ([o, a]) => a[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([o, a]) => {
        const c = a[1] || o;
        return s.set(c, o), c;
      });
    }
  }
  return t;
}, NA = async (t, e, n, r, i) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, i = DA(n), i.then) {
        const c = uA();
        i = await i, c();
      }
      i.isProxied || (Eg(
        i,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), i.isProxied = !0);
      const a = or("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new i(e);
      } catch (c) {
        ao(c);
      }
      e.$flags$ &= -9, a();
    }
    if (i.style) {
      let a = i.style;
      const c = gg(n);
      if (!Ia.has(c)) {
        const f = or("registerStyles", n.$tagName$);
        xA(c, a, !!(n.$flags$ & 1)), f();
      }
    }
  }
  const s = e.$ancestorComponent$, o = () => Gu(e, !0);
  s && s["s-rc"] ? s["s-rc"].push(o) : o();
}, _A = (t) => {
  if (!(Le.$flags$ & 1)) {
    const e = Ms(t), n = e.$cmpMeta$, r = or("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let i = t;
        for (; i = i.parentNode || i.host; )
          if (i["s-p"]) {
            mg(e, e.$ancestorComponent$ = i);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([i, [s]]) => {
        if (s & 31 && t.hasOwnProperty(i)) {
          const o = t[i];
          delete t[i], t[i] = o;
        }
      }), NA(t, e, n);
    }
    r();
  }
}, UA = (t) => {
  Le.$flags$ & 1 || Ms(t);
}, PA = (t, e = {}) => {
  var n;
  const r = or(), i = [], s = e.exclude || [], o = nc.customElements, a = On.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), f = /* @__PURE__ */ On.createElement("style"), d = [];
  let l, g = !0;
  Object.assign(Le, e), Le.$resourcesUrl$ = new URL(e.resourcesUrl || "./", On.baseURI).href, t.map((h) => {
    h[1].map((x) => {
      const b = {
        $flags$: x[0],
        $tagName$: x[1],
        $members$: x[2],
        $listeners$: x[3]
      };
      b.$members$ = x[2];
      const L = b.$tagName$, H = class extends HTMLElement {
        // StencilLazyHost
        constructor(U) {
          super(U), U = this, OA(U, b), b.$flags$ & 1 && U.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? d.push(this) : Le.jmp(() => _A(this));
        }
        disconnectedCallback() {
          Le.jmp(() => UA(this));
        }
        componentOnReady() {
          return Ms(this).$onReadyPromise$;
        }
      };
      b.$lazyBundleId$ = h[0], !s.includes(L) && !o.get(L) && (i.push(L), o.define(L, Eg(
        H,
        b,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    f.innerHTML = i + fA, f.setAttribute("data-styles", "");
    const h = (n = Le.$nonce$) !== null && n !== void 0 ? n : pg(On);
    h != null && f.setAttribute("nonce", h), a.insertBefore(f, c ? c.nextSibling : a.firstChild);
  }
  g = !1, d.length ? d.map((h) => h.connectedCallback()) : Le.jmp(() => l = setTimeout(xg, 30)), r();
}, Ku = /* @__PURE__ */ new WeakMap(), Ms = (t) => Ku.get(t), HA = (t, e) => Ku.set(e.$lazyInstance$ = t, e), OA = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], Ku.set(t, n);
}, qd = (t, e) => e in t, ao = (t, e) => (0, console.error)(t, e), Nc = /* @__PURE__ */ new Map(), DA = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), i = t.$lazyBundleId$, s = Nc.get(i);
  if (s)
    return s[r];
  {
    const o = (a) => (Nc.set(i, a), a[r]);
    switch (i) {
      case "connect-modal":
        return Promise.resolve().then(() => r$).then(o, ao);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${i}.entry.js`
  ).then((o) => (Nc.set(i, o), o[r]), ao);
}, Ia = /* @__PURE__ */ new Map(), nc = typeof window < "u" ? window : {}, On = nc.document || { head: {} }, Le = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Ag = (t) => Promise.resolve(t), FA = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Xd = [], vg = [], jA = (t, e) => (n) => {
  t.push(n), Nl || (Nl = !0, Le.$flags$ & 4 ? Vu(Ul) : Le.raf(Ul));
}, Wd = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      ao(n);
    }
  t.length = 0;
}, Ul = () => {
  Wd(Xd), Wd(vg), (Nl = Xd.length > 0) && Le.raf(Ul);
}, Vu = (t) => Ag().then(t), zA = /* @__PURE__ */ jA(vg), RA = () => Ag(), GA = (t, e) => typeof window > "u" ? Promise.resolve() : RA().then(() => PA([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var KA = Object.defineProperty, VA = Object.defineProperties, qA = Object.getOwnPropertyDescriptors, ka = Object.getOwnPropertySymbols, $g = Object.prototype.hasOwnProperty, Ig = Object.prototype.propertyIsEnumerable, Yd = (t, e, n) => e in t ? KA(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Je = (t, e) => {
  for (var n in e || (e = {})) $g.call(e, n) && Yd(t, n, e[n]);
  if (ka) for (var n of ka(e)) Ig.call(e, n) && Yd(t, n, e[n]);
  return t;
}, An = (t, e) => VA(t, qA(e)), kg = (t, e) => {
  var n = {};
  for (var r in t) $g.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && ka) for (var r of ka(t)) e.indexOf(r) < 0 && Ig.call(t, r) && (n[r] = t[r]);
  return n;
};
function Lg() {
  return Wa(wi()) || window.StacksProvider || window.BlockstackProvider;
}
function rc(t) {
  return t ? typeof t == "string" ? mi.fromName(t) : "version" in t ? t : "url" in t ? new ll({ url: t.url }) : t.transactionVersion === Si.Mainnet ? new ll({ url: t.client.baseUrl }) : new ul({ url: t.client.baseUrl }) : new ul();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var XA = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(XA || {}), WA = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(WA || {}), qu = (t) => {
  let e = t;
  if (!e) {
    let n = new s0(["store_write"], document.location.href);
    e = new cl({ appConfig: n });
  }
  return e;
};
function Cg(t) {
  try {
    return qu(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Tg = (t) => {
  let e = qu(t).loadUserData().appPrivateKey, n = Ie.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function YA(t) {
  var e;
  let { stxAddress: n, userSession: r, network: i } = t;
  if (n) return n;
  if (!r || !i) return;
  let s = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [xi.Mainnet]: "mainnet", [xi.Testnet]: "testnet" }, a = rc(i);
  return s == null ? void 0 : s[o[a.chainId]];
}
function ZA(t) {
  let e = rc(t.network), n = qu(t.userSession), r = An(Je({}, t), { network: e, userSession: n });
  return Je({ stxAddress: YA(r) }, r);
}
async function QA(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(eg) : n = n.map((r) => st(fg(r)))), new Ie.TokenSigner("ES256k", e).signAsync(An(Je({}, t), { postConditions: n }));
}
function JA(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(eg) : e = e.map((n) => st(fg(n)))), Ie.createUnsecuredToken(An(Je({}, t), { postConditions: e }));
}
var t4 = async ({ token: t, options: e }, n) => {
  var r, i, s;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = jt(a.replace(/^0x/, "")), f = G3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, An(Je({}, o), { stacksTransaction: f }));
      return;
    }
    (i = e.onFinish) == null || i.call(e, An(Je({}, o), { stacksTransaction: f }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (s = e.onCancel) == null || s.call(e);
  }
}, e4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: i } = e, s = kg(e, ["amount", "appDetails", "userSession"]);
  if (Cg(i)) {
    let { privateKey: a, publicKey: c } = Tg(i), f = An(Je({}, s), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (f.appDetails = r), QA(f, a);
  }
  let o = An(Je({}, s), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), JA(o);
};
async function n4(t, e, n) {
  let r = await e(An(Je(Je({}, ZA(t)), t), { network: rc(t.network) }));
  return t4({ token: r, options: t }, n);
}
function r4(t, e = Lg()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return n4(t, e4, e);
}
function Bg(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? An(Je({}, t), { message: vd(e), domain: vd(n) }) : An(Je({}, t), { message: st(Ai(e)), domain: st(Ai(n)) });
}
async function i4(t, e) {
  return new Ie.TokenSigner("ES256k", e).signAsync(Bg(t));
}
async function s4(t) {
  let e = t, { userSession: n } = e, r = kg(e, ["userSession"]);
  if (Cg(n)) {
    let { privateKey: i, publicKey: s } = Tg(n), o = An(Je({}, r), { publicKey: s });
    return i4(o, i);
  }
  return Ie.createUnsecuredToken(Bg(t));
}
var o4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(o4 || {}), Mg = "asigna-stx", Zd = (t, e) => new Promise((n) => {
  function r(i) {
    i.data.source === Mg && i.data[e] && (n(i.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(c4(t, e), "*");
}), a4 = { authenticationRequest: async (t) => Zd(t, "authenticationRequest"), transactionRequest: async (t) => Zd(t, "transactionRequest") }, c4 = (t, e) => ({ source: Mg, [e]: t }), l4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = a4);
};
l4();
var u4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function f4(t, e = !0) {
  return function(n, r) {
    var i;
    if (r) return t(n, r);
    let s = wi(), o = Lg();
    if (s && o) return t(n, o);
    if (typeof window > "u") return;
    GA();
    let a = (i = n == null ? void 0 : n.defaultProviders) != null ? i : u4, c = nx(a), f = document.createElement("connect-modal");
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
var Wo = f4(r4);
function qr(t, e, n) {
  return Xu(Ue(t, e), n);
}
function Ue(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = ie(r);
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
      const r = p4(BigInt(`0x${Mt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Mt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Qd(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function So(t, e = 8) {
  return (typeof t == "bigint" ? t : Ue(t, !1)).toString(16).padStart(e * 2, "0");
}
function ic(t) {
  return parseInt(t, 16);
}
function Xu(t, e = 16) {
  const n = So(t, e);
  return ie(n);
}
function d4(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function h4(t, e) {
  return t & BigInt(1) << e;
}
function p4(t, e) {
  return h4(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const g4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Mt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += g4[n];
  return e;
}
function ie(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t;
  const e = t.length % 2 ? `0${t}` : t, n = new Uint8Array(e.length / 2);
  for (let r = 0; r < n.length; r++) {
    const i = r * 2, s = e.slice(i, i + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    n[r] = o;
  }
  return n;
}
function Ns(t) {
  return new TextEncoder().encode(t);
}
function Wu(t) {
  return new TextDecoder().decode(t);
}
function Ng(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function y4(t) {
  return String.fromCharCode.apply(null, t);
}
function w4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Jd(t) {
  if (t.some(w4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function sc(...t) {
  if (!t.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (t.length === 1)
    return t[0];
  const e = t.reduce((r, i) => r + i.length, 0), n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function ge(t) {
  return sc(...t.map((e) => typeof e == "number" ? Jd([e]) : e instanceof Array ? Jd(e) : e));
}
var th;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(th || (th = {}));
var eh;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(eh || (eh = {}));
var nh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(nh || (nh = {}));
const _g = 33, _c = 32;
function b4(t) {
  if (t.length < _c * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + _c * 2), r = t.slice(2 + _c * 2);
  return {
    recoveryId: ic(e),
    r: n,
    s: r
  };
}
function m4(t) {
  const e = typeof t == "string" ? ie(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function x4(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function S4(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function E4(t, e) {
  return t[e];
}
function A4(t, e, n = 0) {
  return t[n] = e, t;
}
function v4(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function vi(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Pl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Pl || (Pl = {}));
const $4 = Pl.Mainnet, I4 = 128, k4 = 128, Ug = 16, li = 32, Hl = 80, oc = 65, L4 = 32, C4 = 64, La = 34;
var it;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(it || (it = {}));
var Ct;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ct || (Ct = {}));
var Ol;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Ol || (Ol = {}));
var je;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(je || (je = {}));
const ca = ["onChainOnly", "offChainOnly", "any"], rh = {
  [ca[0]]: je.OnChainOnly,
  [ca[1]]: je.OffChainOnly,
  [ca[2]]: je.Any,
  [je.OnChainOnly]: je.OnChainOnly,
  [je.OffChainOnly]: je.OffChainOnly,
  [je.Any]: je.Any
};
function T4(t) {
  if (t in rh)
    return rh[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${ca.join(", ")}`);
}
var Ca;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ca || (Ca = {}));
Ca.Mainnet;
var As;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(As || (As = {}));
var ze;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ze || (ze = {}));
var ue;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ue || (ue = {}));
var Yt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Yt || (Yt = {}));
var Ta;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ta || (Ta = {}));
var ae;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ae || (ae = {}));
var co;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(co || (co = {}));
var Dl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Dl || (Dl = {}));
var lo;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(lo || (lo = {}));
var ih;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ih || (ih = {}));
var sh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(sh || (sh = {}));
function Fl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function B4(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Pg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function M4(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Fl(t.outputLen), Fl(t.blockLen);
}
function N4(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function _4(t, e) {
  Pg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const si = {
  number: Fl,
  bool: B4,
  bytes: Pg,
  hash: M4,
  exists: N4,
  output: _4
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Uc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Mn = (t, e) => t << 32 - e | t >>> e, U4 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!U4)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function P4(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Yu(t) {
  if (typeof t == "string" && (t = P4(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Hg {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Hi(t) {
  const e = (r) => t().update(Yu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function H4(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
class Zu extends Hg {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Uc(this.buffer);
  }
  update(e) {
    si.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Yu(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Uc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    si.exists(this), si.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    H4(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Uc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, d = this.get();
    if (f > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      a.setUint32(4 * l, d[l], s);
  }
  digest() {
    const { buffer: e, outputLen: n } = this;
    this.digestInto(e);
    const r = e.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: n, buffer: r, length: i, finished: s, destroyed: o, pos: a } = this;
    return e.length = i, e.pos = a, e.finished = s, e.destroyed = o, i % n && e.buffer.set(r), e;
  }
}
const O4 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Og = Uint8Array.from({ length: 16 }, (t, e) => e), D4 = Og.map((t) => (9 * t + 5) % 16);
let Qu = [Og], Ju = [D4];
for (let t = 0; t < 4; t++)
  for (let e of [Qu, Ju])
    e.push(e[t].map((n) => O4[n]));
const Dg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), F4 = Qu.map((t, e) => t.map((n) => Dg[e][n])), j4 = Ju.map((t, e) => t.map((n) => Dg[e][n])), z4 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), R4 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Yo = (t, e) => t << e | t >>> 32 - e;
function oh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Zo = new Uint32Array(16);
class G4 extends Zu {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: n, h2: r, h3: i, h4: s } = this;
    return [e, n, r, i, s];
  }
  set(e, n, r, i, s) {
    this.h0 = e | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = i | 0, this.h4 = s | 0;
  }
  process(e, n) {
    for (let h = 0; h < 16; h++, n += 4)
      Zo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, b = z4[h], L = R4[h], H = Qu[h], U = Ju[h], p = F4[h], $ = j4[h];
      for (let I = 0; I < 16; I++) {
        const z = Yo(r + oh(h, s, a, f) + Zo[H[I]] + b, p[I]) + l | 0;
        r = l, l = f, f = Yo(a, 10) | 0, a = s, s = z;
      }
      for (let I = 0; I < 16; I++) {
        const z = Yo(i + oh(x, o, c, d) + Zo[U[I]] + L, $[I]) + g | 0;
        i = g, g = d, d = Yo(c, 10) | 0, c = o, o = z;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Zo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const K4 = Hi(() => new G4()), V4 = (t, e, n) => t & e ^ ~t & n, q4 = (t, e, n) => t & e ^ t & n ^ e & n, X4 = new Uint32Array([
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
]), Nr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), _r = new Uint32Array(64);
class Fg extends Zu {
  constructor() {
    super(64, 32, 8, !1), this.A = Nr[0] | 0, this.B = Nr[1] | 0, this.C = Nr[2] | 0, this.D = Nr[3] | 0, this.E = Nr[4] | 0, this.F = Nr[5] | 0, this.G = Nr[6] | 0, this.H = Nr[7] | 0;
  }
  get() {
    const { A: e, B: n, C: r, D: i, E: s, F: o, G: a, H: c } = this;
    return [e, n, r, i, s, o, a, c];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c) {
    this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = i | 0, this.E = s | 0, this.F = o | 0, this.G = a | 0, this.H = c | 0;
  }
  process(e, n) {
    for (let l = 0; l < 16; l++, n += 4)
      _r[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = _r[l - 15], h = _r[l - 2], x = Mn(g, 7) ^ Mn(g, 18) ^ g >>> 3, b = Mn(h, 17) ^ Mn(h, 19) ^ h >>> 10;
      _r[l] = b + _r[l - 7] + x + _r[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Mn(a, 6) ^ Mn(a, 11) ^ Mn(a, 25), h = d + g + V4(a, c, f) + X4[l] + _r[l] | 0, b = (Mn(r, 2) ^ Mn(r, 13) ^ Mn(r, 22)) + q4(r, i, s) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = s, s = i, i = r, r = h + b | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, f, d);
  }
  roundClean() {
    _r.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class W4 extends Fg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const tf = Hi(() => new Fg());
Hi(() => new W4());
const Qo = BigInt(2 ** 32 - 1), jl = BigInt(32);
function jg(t, e = !1) {
  return e ? { h: Number(t & Qo), l: Number(t >> jl & Qo) } : { h: Number(t >> jl & Qo) | 0, l: Number(t & Qo) | 0 };
}
function Y4(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = jg(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const Z4 = (t, e) => BigInt(t >>> 0) << jl | BigInt(e >>> 0), Q4 = (t, e, n) => t >>> n, J4 = (t, e, n) => t << 32 - n | e >>> n, t8 = (t, e, n) => t >>> n | e << 32 - n, e8 = (t, e, n) => t << 32 - n | e >>> n, n8 = (t, e, n) => t << 64 - n | e >>> n - 32, r8 = (t, e, n) => t >>> n - 32 | e << 64 - n, i8 = (t, e) => e, s8 = (t, e) => t, o8 = (t, e, n) => t << n | e >>> 32 - n, a8 = (t, e, n) => e << n | t >>> 32 - n, c8 = (t, e, n) => e << n - 32 | t >>> 64 - n, l8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function u8(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const f8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), d8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, h8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), p8 = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, g8 = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), y8 = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, It = {
  fromBig: jg,
  split: Y4,
  toBig: Z4,
  shrSH: Q4,
  shrSL: J4,
  rotrSH: t8,
  rotrSL: e8,
  rotrBH: n8,
  rotrBL: r8,
  rotr32H: i8,
  rotr32L: s8,
  rotlSH: o8,
  rotlSL: a8,
  rotlBH: c8,
  rotlBL: l8,
  add: u8,
  add3L: f8,
  add3H: d8,
  add4L: h8,
  add4H: p8,
  add5H: y8,
  add5L: g8
}, [w8, b8] = It.split([
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
].map((t) => BigInt(t))), Ur = new Uint32Array(80), Pr = new Uint32Array(80);
class ac extends Zu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: x, Hh: b, Hl: L } = this;
    return [e, n, r, i, s, o, a, c, f, d, l, g, h, x, b, L];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, f, d, l, g, h, x, b, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = b | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Ur[p] = e.getUint32(n), Pr[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const $ = Ur[p - 15] | 0, I = Pr[p - 15] | 0, z = It.rotrSH($, I, 1) ^ It.rotrSH($, I, 8) ^ It.shrSH($, I, 7), tt = It.rotrSL($, I, 1) ^ It.rotrSL($, I, 8) ^ It.shrSL($, I, 7), F = Ur[p - 2] | 0, Y = Pr[p - 2] | 0, S = It.rotrSH(F, Y, 19) ^ It.rotrBH(F, Y, 61) ^ It.shrSH(F, Y, 6), C = It.rotrSL(F, Y, 19) ^ It.rotrBL(F, Y, 61) ^ It.shrSL(F, Y, 6), _ = It.add4L(tt, C, Pr[p - 7], Pr[p - 16]), B = It.add4H(_, z, S, Ur[p - 7], Ur[p - 16]);
      Ur[p] = B | 0, Pr[p] = _ | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: x, Gh: b, Gl: L, Hh: H, Hl: U } = this;
    for (let p = 0; p < 80; p++) {
      const $ = It.rotrSH(l, g, 14) ^ It.rotrSH(l, g, 18) ^ It.rotrBH(l, g, 41), I = It.rotrSL(l, g, 14) ^ It.rotrSL(l, g, 18) ^ It.rotrBL(l, g, 41), z = l & h ^ ~l & b, tt = g & x ^ ~g & L, F = It.add5L(U, I, tt, b8[p], Pr[p]), Y = It.add5H(F, H, $, z, w8[p], Ur[p]), S = F | 0, C = It.rotrSH(r, i, 28) ^ It.rotrBH(r, i, 34) ^ It.rotrBH(r, i, 39), _ = It.rotrSL(r, i, 28) ^ It.rotrBL(r, i, 34) ^ It.rotrBL(r, i, 39), B = r & s ^ r & a ^ s & a, X = i & o ^ i & c ^ o & c;
      H = b | 0, U = L | 0, b = h | 0, L = x | 0, h = l | 0, x = g | 0, { h: l, l: g } = It.add(f | 0, d | 0, Y | 0, S | 0), f = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const K = It.add3L(S, _, X);
      r = It.add3H(K, Y, C, B), i = K | 0;
    }
    ({ h: r, l: i } = It.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = It.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = It.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = It.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = It.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: x } = It.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: b, l: L } = It.add(this.Gh | 0, this.Gl | 0, b | 0, L | 0), { h: H, l: U } = It.add(this.Hh | 0, this.Hl | 0, H | 0, U | 0), this.set(r, i, s, o, a, c, f, d, l, g, h, x, b, L, H, U);
  }
  roundClean() {
    Ur.fill(0), Pr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class m8 extends ac {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class x8 extends ac {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class S8 extends ac {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Hi(() => new ac());
Hi(() => new m8());
const E8 = Hi(() => new x8());
Hi(() => new S8());
function zg(t) {
  if (ie(t).byteLength != oc)
    throw Error("Invalid signature");
  return {
    type: it.MessageSignature,
    data: t
  };
}
function Xs(t, e) {
  return { type: it.Address, version: t, hash160: e };
}
function ss(t) {
  return _i.c32address(t.version, t.hash160);
}
function $i(t, e, n) {
  const r = e || 1, i = n || I4;
  if (sy(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: it.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function ef(t) {
  const e = _i.c32addressDecode(t);
  return {
    type: it.Address,
    version: e[0],
    hash160: e[1]
  };
}
var j;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(j || (j = {}));
function A8(t) {
  if (t.type === j.PrincipalStandard)
    return ss(t.address);
  if (t.type === j.PrincipalContract)
    return `${ss(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Rg(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return I8(e, n);
  } else
    return v8(t);
}
function v8(t) {
  const e = ef(t);
  return { type: j.PrincipalStandard, address: e };
}
function $8(t) {
  return { type: j.PrincipalStandard, address: t };
}
function I8(t, e) {
  const n = ef(t), r = $i(e);
  return Gg(n, r);
}
function Gg(t, e) {
  if (Ns(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: j.PrincipalContract, address: t, contractName: e };
}
function Pc(t, e = !1) {
  switch (t.type) {
    case j.BoolTrue:
      return !0;
    case j.BoolFalse:
      return !1;
    case j.Int:
    case j.UInt:
      return e ? t.value.toString() : t.value;
    case j.Buffer:
      return `0x${Mt(t.buffer)}`;
    case j.OptionalNone:
      return null;
    case j.OptionalSome:
      return Un(t.value);
    case j.ResponseErr:
      return Un(t.value);
    case j.ResponseOk:
      return Un(t.value);
    case j.PrincipalStandard:
    case j.PrincipalContract:
      return A8(t);
    case j.List:
      return t.list.map((r) => Un(r));
    case j.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Un(t.data[r]);
      }), n;
    case j.StringASCII:
      return t.data;
    case j.StringUTF8:
      return t.data;
  }
}
function Un(t) {
  switch (t.type) {
    case j.ResponseErr:
      return { type: Fr(t), value: Pc(t, !0), success: !1 };
    case j.ResponseOk:
      return { type: Fr(t), value: Pc(t, !0), success: !0 };
    default:
      return { type: Fr(t), value: Pc(t, !0) };
  }
}
function Fr(t) {
  switch (t.type) {
    case j.BoolTrue:
    case j.BoolFalse:
      return "bool";
    case j.Int:
      return "int";
    case j.UInt:
      return "uint";
    case j.Buffer:
      return `(buff ${t.buffer.length})`;
    case j.OptionalNone:
      return "(optional none)";
    case j.OptionalSome:
      return `(optional ${Fr(t.value)})`;
    case j.ResponseErr:
      return `(response UnknownType ${Fr(t.value)})`;
    case j.ResponseOk:
      return `(response ${Fr(t.value)} UnknownType)`;
    case j.PrincipalStandard:
    case j.PrincipalContract:
      return "principal";
    case j.List:
      return `(list ${t.list.length} ${t.list.length ? Fr(t.list[0]) : "UnknownType"})`;
    case j.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${Fr(t.data[e])})`).join(" ")})`;
    case j.StringASCII:
      return `(string-ascii ${Ng(t.data).length})`;
    case j.StringUTF8:
      return `(string-utf8 ${Ns(t.data).length})`;
  }
}
const Kg = () => ({ type: j.BoolTrue }), Vg = () => ({ type: j.BoolFalse }), k8 = (t) => t ? Kg() : Vg(), ah = BigInt("0xffffffffffffffffffffffffffffffff"), L8 = BigInt(0), ch = BigInt("0x7fffffffffffffffffffffffffffffff"), lh = BigInt("-170141183460469231731687303715884105728"), C8 = (t) => {
  const e = Ue(t, !0);
  if (e > ch)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${ch}`);
  if (e < lh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${lh}`);
  return { type: j.Int, value: e };
}, Dn = (t) => {
  const e = Ue(t, !1);
  if (e < L8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > ah)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${ah}`);
  return { type: j.UInt, value: e };
}, qg = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: j.Buffer, buffer: t };
};
function Xg() {
  return { type: j.OptionalNone };
}
function Wg(t) {
  return { type: j.OptionalSome, value: t };
}
function T8(t) {
  return { type: j.ResponseErr, value: t };
}
function B8(t) {
  return { type: j.ResponseOk, value: t };
}
function M8(t) {
  return { type: j.List, list: t };
}
function Ii(t) {
  for (const e in t)
    if (!Sv(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: j.Tuple, data: t };
}
const $e = (t) => ({ type: j.StringASCII, data: t }), N8 = (t) => ({ type: j.StringUTF8, data: t });
class Yg extends Hg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, si.hash(e);
    const r = Yu(n);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const i = this.blockLen, s = new Uint8Array(i);
    s.set(r.length > i ? e.create().update(r).digest() : r);
    for (let o = 0; o < s.length; o++)
      s[o] ^= 54;
    this.iHash.update(s), this.oHash = e.create();
    for (let o = 0; o < s.length; o++)
      s[o] ^= 106;
    this.oHash.update(s), s.fill(0);
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
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const Zg = (t, e, n) => new Yg(t, e).update(n).digest();
Zg.create = (t, e) => new Yg(t, e);
fe.hmacSha256Sync = (t, ...e) => {
  const n = Zg.create(tf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function vs(t) {
  return {
    type: it.PublicKey,
    data: ie(t)
  };
}
function _8(t, e, n = ae.Compressed) {
  const r = b4(e.data), i = new Ze(Qd(r.r), Qd(r.s)), s = Tt.fromSignature(t, i, r.recoveryId), o = n === ae.Compressed;
  return s.toHex(o);
}
function U8(t) {
  return { type: it.PublicKey, data: t };
}
function _s(t) {
  return !Mt(t.data).startsWith("04");
}
function Ba(t) {
  return t.data.slice();
}
function P8(t) {
  const e = D8(t), n = yo(e.data.slice(0, 32), e.compressed);
  return vs(Mt(n));
}
function H8(t) {
  const e = typeof t == "string" ? t : Mt(t), n = Tt.fromHex(e).toHex(!0);
  return vs(n);
}
function O8(t) {
  const e = typeof t == "string" ? t : Mt(t), n = Tt.fromHex(e).toHex(!1);
  return vs(n);
}
function zl(t) {
  const e = t.readUInt8(), n = e === 4 ? C4 : L4;
  return U8(ge([e, t.readBytes(n)]));
}
function D8(t) {
  const e = m4(t), n = e.length == _g;
  return { data: e, compressed: n };
}
function F8(t, e) {
  const [n, r] = Da(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const s = So(r, 1) + Ze.fromHex(n).toCompactHex();
  return zg(s);
}
function j8(t) {
  return P8(t.data);
}
function z8(t, e, n) {
  return typeof t == "string" && (t = Rg(t)), typeof n == "string" && (n = dh(n)), {
    type: it.Payload,
    payloadType: Ct.TokenTransfer,
    recipient: t,
    amount: Ue(e, !1),
    memo: n ?? dh("")
  };
}
function R8(t, e, n, r) {
  return typeof t == "string" && (t = ef(t)), typeof e == "string" && (e = $i(e)), typeof n == "string" && (n = $i(n)), {
    type: it.Payload,
    payloadType: Ct.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function uh(t, e, n) {
  return typeof t == "string" && (t = $i(t)), typeof e == "string" && (e = Q8(e)), typeof n == "number" ? {
    type: it.Payload,
    payloadType: Ct.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: it.Payload,
    payloadType: Ct.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function G8() {
  return { type: it.Payload, payloadType: Ct.PoisonMicroblock };
}
function fh(t, e) {
  if (t.byteLength != li)
    throw Error(`Coinbase buffer size must be ${li} bytes`);
  return e != null ? {
    type: it.Payload,
    payloadType: Ct.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: it.Payload,
    payloadType: Ct.Coinbase,
    coinbaseBytes: t
  };
}
function K8(t, e, n) {
  if (t.byteLength != li)
    throw Error(`Coinbase buffer size must be ${li} bytes`);
  if (n.byteLength != Hl)
    throw Error(`VRF proof buffer size must be ${Hl} bytes`);
  return {
    type: it.Payload,
    payloadType: Ct.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === j.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Rl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Rl || (Rl = {}));
function V8(t, e, n, r, i, s, o) {
  return {
    type: it.Payload,
    payloadType: Ct.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: i,
    cause: s,
    publicKeyHash: o
  };
}
function Qg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Ct.TokenTransfer:
      e.push(he(t.recipient)), e.push(qr(t.amount, !1, 8)), e.push(tr(t.memo));
      break;
    case Ct.ContractCall:
      e.push(tr(t.contractAddress)), e.push(tr(t.contractName)), e.push(tr(t.functionName));
      const n = new Uint8Array(4);
      vi(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(he(r));
      });
      break;
    case Ct.SmartContract:
      e.push(tr(t.contractName)), e.push(tr(t.codeBody));
      break;
    case Ct.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(tr(t.contractName)), e.push(tr(t.codeBody));
      break;
    case Ct.PoisonMicroblock:
      break;
    case Ct.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Ct.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(he(t.recipient));
      break;
    case Ct.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(he(t.recipient ? Wg(t.recipient) : Xg())), e.push(t.vrfProof);
      break;
    case Ct.TenureChange:
      e.push(ie(t.tenureHash)), e.push(ie(t.previousTenureHash)), e.push(ie(t.burnViewHash)), e.push(ie(t.previousTenureEnd)), e.push(vi(new Uint8Array(4), t.previousTenureBlocks)), e.push(A4(new Uint8Array(1), t.cause)), e.push(ie(t.publicKeyHash));
      break;
  }
  return ge(e);
}
function q8(t) {
  switch (t.readUInt8Enum(Ct, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Ct.TokenTransfer:
      const n = dn(t), r = Ue(t.readBytes(8), !1), i = ty(t);
      return z8(n, r, i);
    case Ct.ContractCall:
      const s = $s(t), o = fn(t), a = fn(t), c = [], f = t.readUInt32BE();
      for (let p = 0; p < f; p++) {
        const $ = dn(t);
        c.push($);
      }
      return R8(s, o, a, c);
    case Ct.SmartContract:
      const d = fn(t), l = fn(t, 4, 1e5);
      return uh(d, l);
    case Ct.VersionedSmartContract: {
      const p = t.readUInt8Enum(Ol, (z) => {
        throw new Error(`Cannot recognize ClarityVersion: ${z}`);
      }), $ = fn(t), I = fn(t, 4, 1e5);
      return uh($, I, p);
    }
    case Ct.PoisonMicroblock:
      return G8();
    case Ct.Coinbase: {
      const p = t.readBytes(li);
      return fh(p);
    }
    case Ct.CoinbaseToAltRecipient: {
      const p = t.readBytes(li), $ = dn(t);
      return fh(p, $);
    }
    case Ct.NakamotoCoinbase: {
      const p = t.readBytes(li), $ = dn(t), I = t.readBytes(Hl);
      return K8(p, $, I);
    }
    case Ct.TenureChange:
      const g = Mt(t.readBytes(20)), h = Mt(t.readBytes(20)), x = Mt(t.readBytes(20)), b = Mt(t.readBytes(32)), L = t.readUInt32BE(), H = t.readUInt8Enum(Rl, (p) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${p}`);
      }), U = Mt(t.readBytes(20));
      return V8(g, h, x, b, L, H, U);
  }
}
class cc extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class ti extends cc {
  constructor(e) {
    super(e);
  }
}
class Ye extends cc {
  constructor(e) {
    super(e);
  }
}
class Ma extends cc {
  constructor(e) {
    super(e);
  }
}
class oi extends cc {
  constructor(e) {
    super(e);
  }
}
var mn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(mn || (mn = {}));
function Gl(t) {
  return zg(Mt(t.readBytes(oc)));
}
function os(t, e) {
  return {
    pubKeyEncoding: t,
    type: it.TransactionAuthField,
    contents: e
  };
}
function X8(t) {
  const e = t.readUInt8Enum(mn, (n) => {
    throw new Ye(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case mn.PublicKeyCompressed:
      return os(ae.Compressed, zl(t));
    case mn.PublicKeyUncompressed:
      return os(ae.Uncompressed, O8(zl(t).data));
    case mn.SignatureCompressed:
      return os(ae.Compressed, Gl(t));
    case mn.SignatureUncompressed:
      return os(ae.Uncompressed, Gl(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function nf(t) {
  return ie(t.data);
}
function W8(t) {
  const e = [];
  switch (t.contents.type) {
    case it.PublicKey:
      e.push(t.pubKeyEncoding === ae.Compressed ? mn.PublicKeyCompressed : mn.PublicKeyUncompressed), e.push(Ba(H8(t.contents.data)));
      break;
    case it.MessageSignature:
      e.push(t.pubKeyEncoding === ae.Compressed ? mn.SignatureCompressed : mn.SignatureUncompressed), e.push(nf(t.contents));
      break;
  }
  return ge(e);
}
function tr(t) {
  switch (t.type) {
    case it.Address:
      return Eo(t);
    case it.Principal:
      return Jg(t);
    case it.LengthPrefixedString:
      return Is(t);
    case it.MemoString:
      return J8(t);
    case it.AssetInfo:
      return ey(t);
    case it.PostCondition:
      return tv(t);
    case it.PublicKey:
      return Ba(t);
    case it.LengthPrefixedList:
      return of(t);
    case it.Payload:
      return Qg(t);
    case it.TransactionAuthField:
      return W8(t);
    case it.MessageSignature:
      return nf(t);
  }
}
function Y8() {
  return {
    type: it.Address,
    version: Ta.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function rf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Yt.SerializeP2PKH || e === Yt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Yt.SerializeP2WPKH || e === Yt.SerializeP2WSH || e === Yt.SerializeP2WSHNonSequential) && !r.every(_s))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Yt.SerializeP2PKH:
      return Xs(t, wv(r[0].data));
    case Yt.SerializeP2WPKH:
      return Xs(t, bv(r[0].data));
    case Yt.SerializeP2SH:
    case Yt.SerializeP2SHNonSequential:
      return Xs(t, mv(n, r.map(Ba)));
    case Yt.SerializeP2WSH:
    case Yt.SerializeP2WSHNonSequential:
      return Xs(t, xv(n, r.map(Ba)));
  }
}
function Eo(t) {
  const e = [];
  return e.push(ie(So(t.version, 1))), e.push(ie(t.hash160)), ge(e);
}
function $s(t) {
  const e = ic(Mt(t.readBytes(1))), n = Mt(t.readBytes(20));
  return { type: it.Address, version: e, hash160: n };
}
function Jg(t) {
  const e = [];
  return e.push(t.prefix), e.push(Eo(t.address)), t.prefix === lo.Contract && e.push(Is(t.contractName)), ge(e);
}
function Z8(t) {
  const e = t.readUInt8Enum(lo, (i) => {
    throw new Ye(`Unexpected Principal payload type: ${i}`);
  }), n = $s(t);
  if (e === lo.Standard)
    return { type: it.Principal, prefix: e, address: n };
  const r = fn(t);
  return {
    type: it.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Is(t) {
  const e = [], n = Ns(t.content), r = n.byteLength;
  return e.push(ie(So(r, t.lengthPrefixBytes))), e.push(n), ge(e);
}
function fn(t, e, n) {
  e = e || 1;
  const r = ic(Mt(t.readBytes(e))), i = Wu(t.readBytes(r));
  return $i(i, e, n ?? 128);
}
function Q8(t) {
  return $i(t, 4, 1e5);
}
function dh(t) {
  if (t && sy(t, La))
    throw new Error(`Memo exceeds maximum length of ${La} bytes`);
  return { type: it.MemoString, content: t };
}
function J8(t) {
  const e = [], n = Ns(t.content), r = yv(Mt(n), La * 2);
  return e.push(ie(r)), ge(e);
}
function ty(t) {
  let e = Wu(t.readBytes(La));
  return e = e.replace(/\u0000*$/, ""), { type: it.MemoString, content: e };
}
function ey(t) {
  const e = [];
  return e.push(Eo(t.address)), e.push(Is(t.contractName)), e.push(Is(t.assetName)), ge(e);
}
function Kl(t) {
  return {
    type: it.AssetInfo,
    address: $s(t),
    contractName: fn(t),
    assetName: fn(t)
  };
}
function sf(t, e) {
  return {
    type: it.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function of(t) {
  const e = t.values, n = [];
  n.push(ie(So(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(tr(r));
  return ge(n);
}
function ny(t, e, n) {
  const r = ic(Mt(t.readBytes(4))), i = [];
  for (let s = 0; s < r; s++)
    switch (e) {
      case it.Address:
        i.push($s(t));
        break;
      case it.LengthPrefixedString:
        i.push(fn(t));
        break;
      case it.MemoString:
        i.push(ty(t));
        break;
      case it.AssetInfo:
        i.push(Kl(t));
        break;
      case it.PostCondition:
        i.push(ev(t));
        break;
      case it.PublicKey:
        i.push(zl(t));
        break;
      case it.TransactionAuthField:
        i.push(X8(t));
        break;
    }
  return sf(i, n);
}
function tv(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Jg(t.principal)), (t.conditionType === ze.Fungible || t.conditionType === ze.NonFungible) && e.push(ey(t.assetInfo)), t.conditionType === ze.NonFungible && e.push(he(t.assetName)), e.push(t.conditionCode), t.conditionType === ze.STX || t.conditionType === ze.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new ti("The post-condition amount may not be larger than 8 bytes");
    e.push(qr(t.amount, !1, 8));
  }
  return ge(e);
}
function ev(t) {
  const e = t.readUInt8Enum(ze, (o) => {
    throw new Ye(`Could not read ${o} as PostConditionType`);
  }), n = Z8(t);
  let r, i, s;
  switch (e) {
    case ze.STX:
      return r = t.readUInt8Enum(co, (a) => {
        throw new Ye(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${Mt(t.readBytes(8))}`), {
        type: it.PostCondition,
        conditionType: ze.STX,
        principal: n,
        conditionCode: r,
        amount: s
      };
    case ze.Fungible:
      return i = Kl(t), r = t.readUInt8Enum(co, (a) => {
        throw new Ye(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${Mt(t.readBytes(8))}`), {
        type: it.PostCondition,
        conditionType: ze.Fungible,
        principal: n,
        conditionCode: r,
        amount: s,
        assetInfo: i
      };
    case ze.NonFungible:
      i = Kl(t);
      const o = dn(t);
      return r = t.readUInt8Enum(Dl, (a) => {
        throw new Ye(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: it.PostCondition,
        conditionType: ze.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: i,
        assetName: o
      };
  }
}
function Gn(t, e) {
  return ge([t, e]);
}
function nv(t) {
  return new Uint8Array([t.type]);
}
function rv(t) {
  return t.type === j.OptionalNone ? new Uint8Array([t.type]) : Gn(t.type, he(t.value));
}
function iv(t) {
  const e = new Uint8Array(4);
  return vi(e, t.buffer.length, 0), Gn(t.type, sc(e, t.buffer));
}
function sv(t) {
  const e = Xu(d4(t.value, BigInt(k4)), Ug);
  return Gn(t.type, e);
}
function ov(t) {
  const e = Xu(t.value, Ug);
  return Gn(t.type, e);
}
function av(t) {
  return Gn(t.type, Eo(t.address));
}
function cv(t) {
  return Gn(t.type, sc(Eo(t.address), Is(t.contractName)));
}
function lv(t) {
  return Gn(t.type, he(t.value));
}
function uv(t) {
  const e = [], n = new Uint8Array(4);
  vi(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const i = he(r);
    e.push(i);
  }
  return Gn(t.type, ge(e));
}
function fv(t) {
  const e = [], n = new Uint8Array(4);
  vi(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = $i(i);
    e.push(Is(s));
    const o = he(t.data[i]);
    e.push(o);
  }
  return Gn(t.type, ge(e));
}
function ry(t, e) {
  const n = [], r = e == "ascii" ? Ng(t.data) : Ns(t.data), i = new Uint8Array(4);
  return vi(i, r.length, 0), n.push(i), n.push(r), Gn(t.type, ge(n));
}
function dv(t) {
  return ry(t, "ascii");
}
function hv(t) {
  return ry(t, "utf8");
}
function he(t) {
  switch (t.type) {
    case j.BoolTrue:
    case j.BoolFalse:
      return nv(t);
    case j.OptionalNone:
    case j.OptionalSome:
      return rv(t);
    case j.Buffer:
      return iv(t);
    case j.UInt:
      return ov(t);
    case j.Int:
      return sv(t);
    case j.PrincipalStandard:
      return av(t);
    case j.PrincipalContract:
      return cv(t);
    case j.ResponseOk:
    case j.ResponseErr:
      return lv(t);
    case j.List:
      return uv(t);
    case j.Tuple:
      return fv(t);
    case j.StringASCII:
      return dv(t);
    case j.StringUTF8:
      return hv(t);
    default:
      throw new ti("Unable to serialize. Invalid Clarity Value.");
  }
}
function pv(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const hh = /* @__PURE__ */ new Map();
function iy(t, e) {
  const n = hh.get(t);
  if (n !== void 0)
    return n(e);
  const r = pv(t);
  return hh.set(t, r), iy(t, e);
}
class Js {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return v4(this.readBytes(4), 0);
  }
  readUInt8() {
    return E4(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return x4(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = Mt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Mt(n);
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
    if (iy(e, r))
      return r;
    throw n(r);
  }
}
function dn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Js(ie(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Js(t) : e = t;
  switch (e.readUInt8Enum(j, (r) => {
    throw new Ye(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case j.Int:
      return C8(e.readBytes(16));
    case j.UInt:
      return Dn(e.readBytes(16));
    case j.Buffer:
      const r = e.readUInt32BE();
      return qg(e.readBytes(r));
    case j.BoolTrue:
      return Kg();
    case j.BoolFalse:
      return Vg();
    case j.PrincipalStandard:
      const i = $s(e);
      return $8(i);
    case j.PrincipalContract:
      const s = $s(e), o = fn(e);
      return Gg(s, o);
    case j.ResponseOk:
      return B8(dn(e));
    case j.ResponseErr:
      return T8(dn(e));
    case j.OptionalNone:
      return Xg();
    case j.OptionalSome:
      return Wg(dn(e));
    case j.List:
      const a = e.readUInt32BE(), c = [];
      for (let b = 0; b < a; b++)
        c.push(dn(e));
      return M8(c);
    case j.Tuple:
      const f = e.readUInt32BE(), d = {};
      for (let b = 0; b < f; b++) {
        const L = fn(e).content;
        if (L === void 0)
          throw new Ye('"content" is undefined');
        d[L] = dn(e);
      }
      return Ii(d);
    case j.StringASCII:
      const l = e.readUInt32BE(), g = y4(e.readBytes(l));
      return $e(g);
    case j.StringUTF8:
      const h = e.readUInt32BE(), x = Wu(e.readBytes(h));
      return N8(x);
    default:
      throw new Ye("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const gv = (t) => t.length % 2 == 0 ? t : `0${t}`, yv = (t, e) => t.padEnd(e, "0"), sy = (t, e) => t ? Ns(t).length > e : !1;
function Vl(t) {
  return vp(t);
}
const uo = (t) => K4(tf(t)), af = (t) => Mt(E8(t)), wv = (t) => Mt(uo(t)), bv = (t) => {
  const e = uo(t), n = sc(new Uint8Array([0]), new Uint8Array([e.length]), e), r = uo(n);
  return Mt(r);
}, mv = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + e.length), n.push(174);
  const r = ge(n), i = uo(r);
  return Mt(i);
}, xv = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = ge(n), i = tf(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = ge(s), a = uo(o);
  return Mt(a);
};
function Sv(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function oy(t) {
  const e = he(t);
  return `0x${Mt(e)}`;
}
function Ev(t) {
  return dn(t);
}
const ls = (t) => {
  try {
    return _i.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function cf() {
  return {
    type: it.MessageSignature,
    data: Mt(new Uint8Array(oc))
  };
}
function ay(t, e, n, r) {
  const i = rf(0, t, 1, [vs(e)]).hash160, s = _s(vs(e)) ? ae.Compressed : ae.Uncompressed;
  return {
    hashMode: t,
    signer: i,
    nonce: Ue(n, !1),
    fee: Ue(r, !1),
    keyEncoding: s,
    signature: cf()
  };
}
function fo(t) {
  return "signature" in t;
}
function ph(t) {
  return t === Yt.SerializeP2SH || t === Yt.SerializeP2WSH;
}
function Av(t) {
  return t === Yt.SerializeP2SHNonSequential || t === Yt.SerializeP2WSHNonSequential;
}
function gh(t) {
  const e = Vl(t);
  return e.nonce = 0, e.fee = 0, fo(e) ? e.signature = cf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function vv(t) {
  const e = [
    t.hashMode,
    ie(t.signer),
    qr(t.nonce, !1, 8),
    qr(t.fee, !1, 8),
    t.keyEncoding,
    nf(t.signature)
  ];
  return ge(e);
}
function $v(t) {
  const e = [
    t.hashMode,
    ie(t.signer),
    qr(t.nonce, !1, 8),
    qr(t.fee, !1, 8)
  ], n = sf(t.fields);
  e.push(of(n));
  const r = new Uint8Array(2);
  return S4(r, t.signaturesRequired, 0), e.push(r), ge(e);
}
function Iv(t, e) {
  const n = Mt(e.readBytes(20)), r = BigInt(`0x${Mt(e.readBytes(8))}`), i = BigInt(`0x${Mt(e.readBytes(8))}`), s = e.readUInt8Enum(ae, (a) => {
    throw new Ye(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Yt.SerializeP2WPKH && s != ae.Compressed)
    throw new Ye("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Gl(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    keyEncoding: s,
    signature: o
  };
}
function kv(t, e) {
  const n = Mt(e.readBytes(20)), r = BigInt("0x" + Mt(e.readBytes(8))), i = BigInt("0x" + Mt(e.readBytes(8))), s = ny(e, it.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const f of s)
    switch (f.contents.type) {
      case it.PublicKey:
        _s(f.contents) || (o = !0);
        break;
      case it.MessageSignature:
        if (f.pubKeyEncoding === ae.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new oi("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Yt.SerializeP2WSH || t === Yt.SerializeP2WSHNonSequential))
    throw new oi("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: c
  };
}
function Hc(t) {
  return fo(t) ? vv(t) : $v(t);
}
function Oc(t) {
  const e = t.readUInt8Enum(Yt, (n) => {
    throw new Ye(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Yt.SerializeP2PKH || e === Yt.SerializeP2WPKH ? Iv(e, t) : kv(e, t);
}
function cy(t, e, n, r) {
  const s = t + Mt(new Uint8Array([e])) + Mt(qr(n, !1, 8)) + Mt(qr(r, !1, 8));
  if (ie(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return af(ie(s));
}
function ly(t, e, n) {
  const r = 33 + oc, i = _s(e) ? ae.Compressed : ae.Uncompressed, s = t + gv(i.toString(16)) + n.data, o = ie(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return af(o);
}
function Lv(t, e, n, r, i) {
  const s = cy(t, e, n, r), o = F8(i, s), a = j8(i), c = ly(s, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function uy(t, e, n, r, i, s) {
  const o = cy(t, e, n, r), a = vs(_8(o, s, i)), c = ly(o, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function Cv() {
  const t = ay(Yt.SerializeP2PKH, "", 0, 0);
  return t.signer = Y8().hash160, t.keyEncoding = ae.Compressed, t.signature = cf(), t;
}
function yh(t, e, n) {
  return fo(t) ? Tv(t, e, n) : Bv(t, e, n);
}
function Tv(t, e, n) {
  const { pubKey: r, nextSigHash: i } = uy(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), s = rf(0, t.hashMode, 1, [r]).hash160;
  if (s !== t.signer)
    throw new oi(`Signer hash does not equal hash of public key(s): ${s} != ${t.signer}`);
  return i;
}
function Bv(t, e, n) {
  const r = [];
  let i = e, s = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case it.PublicKey:
        _s(c.contents) || (s = !0), r.push(c.contents);
        break;
      case it.MessageSignature:
        c.pubKeyEncoding === ae.Uncompressed && (s = !0);
        const { pubKey: f, nextSigHash: d } = uy(i, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (ph(t.hashMode) && (i = d), r.push(f), o += 1, o === 65536)
          throw new oi("Too many signatures");
        break;
    }
  if (ph(t.hashMode) && o !== t.signaturesRequired || Av(t.hashMode) && o < t.signaturesRequired)
    throw new oi("Incorrect number of signatures");
  if (s && (t.hashMode === Yt.SerializeP2WSH || t.hashMode === Yt.SerializeP2WSHNonSequential))
    throw new oi("Uncompressed keys are not allowed in this hash mode");
  const a = rf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new oi(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return i;
}
function fy(t) {
  return {
    authType: ue.Standard,
    spendingCondition: t
  };
}
function dy(t, e) {
  return {
    authType: ue.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || ay(Yt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function wh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case ue.Standard:
        return fy(gh(t.spendingCondition));
      case ue.Sponsored:
        return dy(gh(t.spendingCondition), Cv());
      default:
        throw new Ma("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Mv(t, e) {
  switch (t.authType) {
    case ue.Standard:
      return yh(t.spendingCondition, e, ue.Standard);
    case ue.Sponsored:
      return yh(t.spendingCondition, e, ue.Standard);
    default:
      throw new Ma("Invalid origin auth type");
  }
}
function Nv(t, e) {
  switch (t.authType) {
    case ue.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Ue(e, !1)
      };
      return { ...t, spendingCondition: n };
    case ue.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Ue(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function _v(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Ue(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function Uv(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Ue(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Pv(t, e) {
  const n = {
    ...e,
    nonce: Ue(e.nonce, !1),
    fee: Ue(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Hv(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case ue.Standard:
      e.push(Hc(t.spendingCondition));
      break;
    case ue.Sponsored:
      e.push(Hc(t.spendingCondition)), e.push(Hc(t.sponsorSpendingCondition));
      break;
  }
  return ge(e);
}
function Ov(t) {
  const e = t.readUInt8Enum(ue, (r) => {
    throw new Ye(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case ue.Standard:
      return n = Oc(t), fy(n);
    case ue.Sponsored:
      n = Oc(t);
      const r = Oc(t);
      return dy(n, r);
  }
}
class Dv {
  constructor(e, n, r, i, s, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Ue(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? $4, this.postConditionMode = s ?? As.Deny, this.postConditions = i ?? sf([]), o)
      this.anchorMode = T4(o);
    else
      switch (r.payloadType) {
        case Ct.Coinbase:
        case Ct.CoinbaseToAltRecipient:
        case Ct.NakamotoCoinbase:
        case Ct.PoisonMicroblock:
        case Ct.TenureChange:
          this.anchorMode = je.OnChainOnly;
          break;
        case Ct.ContractCall:
        case Ct.SmartContract:
        case Ct.VersionedSmartContract:
        case Ct.TokenTransfer:
          this.anchorMode = je.Any;
          break;
      }
  }
  signBegin() {
    const e = Vl(this);
    return e.auth = wh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Vl(this);
    return e.auth = wh(e.auth), e.txid();
  }
  verifyOrigin() {
    return Mv(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, ue.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === ue.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, ue.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !fo(n)) {
      const r = _s(e);
      n.fields.push(os(r ? ae.Compressed : ae.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, i) {
    const { nextSig: s, nextSigHash: o } = Lv(n, r, e.fee, e.nonce, i);
    return fo(e) ? e.signature = s : e.fields.push(os(i.data.byteLength === _g ? ae.Compressed : ae.Uncompressed, s)), o;
  }
  txid() {
    const e = this.serialize();
    return af(e);
  }
  setSponsor(e) {
    if (this.auth.authType != ue.Sponsored)
      throw new Ma("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Pv(this.auth, e);
  }
  setFee(e) {
    this.auth = Nv(this.auth, e);
  }
  setNonce(e) {
    this.auth = _v(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != ue.Sponsored)
      throw new Ma("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Uv(this.auth, e);
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
    return vi(n, this.chainId, 0), e.push(n), e.push(Hv(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(of(this.postConditions)), e.push(Qg(this.payload)), ge(e);
  }
}
function Na(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Js(ie(t.slice(2))) : e = new Js(ie(t)) : t instanceof Uint8Array ? e = new Js(t) : e = t;
  const n = e.readUInt8Enum(Ca, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), i = Ov(e), s = e.readUInt8Enum(je, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(As, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = ny(e, it.PostCondition), c = q8(e);
  return new Dv(n, i, c, a, o, s, r);
}
const Fv = k8, to = Dn, jv = qg;
const zv = /* @__PURE__ */ new Set([4001, -31001]), Rv = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], Gv = ["result", "data", "payload", "response", "params"], bh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], lc = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Oi = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, rr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, Kv = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), hy = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, i) => !!(r != null && r.id) && n.findIndex((s) => Kv(s, r)) === i
  );
}, py = (t) => t ? hy(Oi()).some(
  (e) => {
    var n;
    return e.id === t && (lc(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, gy = () => {
  if (typeof window > "u")
    return;
  const t = Oi(), e = hy(t).filter(
    (n) => {
      var r;
      return lc(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = rr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of Rv) {
    const r = rr(t, n) ?? (t === window ? void 0 : rr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, Vv = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Oi(), n = rr(e, t) ?? (e === window ? void 0 : rr(window, t)) ?? Wa(t);
  if (n)
    return n;
  if (lc(t) || py(t))
    return gy();
}, Jo = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, qv = ["blockstack-session", "blockstack"], Xv = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of qv) {
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
Xv();
const yy = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, We = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, Wv = (t) => {
  const e = We(t);
  if (!e)
    return null;
  const n = yy(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, Yv = (t) => {
  const e = We(t);
  if (!e)
    return null;
  const n = yy(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, ql = (t, e = "mainnet") => {
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
      return ql(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return ql(r, e);
  }
  return e;
}, ui = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, ho = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const i = t.trim();
    return ls(i) ? i : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const i of t) {
      const s = ho(i, e + 1);
      if (s)
        return s;
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
  for (const i of r) {
    if (!(i in n))
      continue;
    const s = ho(n[i], e + 1);
    if (s)
      return s;
  }
  return typeof n.mainnet == "string" && ls(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && ls(n.testnet) ? n.testnet.trim() : null;
}, mh = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, wy = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && zv.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, ki = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = We(n == null ? void 0 : n.message) ?? We(e.message) ?? We(e.error) ?? We(t) ?? "Wallet provider request failed.", i = new Error(r);
  return i.code = (n == null ? void 0 : n.code) ?? e.code, i.data = (n == null ? void 0 : n.data) ?? e.data, i;
}, ks = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw ki(e);
    if (e.status === "error")
      throw ki(e.result ?? e);
  }
  return t;
}, xh = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return ks(r);
  } catch (r) {
    throw ki(r);
  }
}, by = () => gy(), lf = () => {
  if (typeof window > "u")
    return;
  const t = Oi();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = rr(t, e) ?? (t === window ? void 0 : rr(window, e));
    if (n)
      return n;
  }
}, Sh = () => {
  if (typeof window > "u")
    return;
  const t = lf();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Oi();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = rr(e, n) ?? (e === window ? void 0 : rr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, la = (t) => {
  var r, i;
  const e = wi();
  if (lc(e) || py(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Oi() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((i = n.xverseProviders) == null ? void 0 : i.StacksProvider) || t === by();
}, Dc = (t) => {
  const e = Yv(t);
  if (!e)
    return null;
  try {
    const n = Na(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, _a = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = Dc(t), r = Wv(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? We(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = _a(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const i = t;
  let s = null;
  for (const a of bh)
    if (Dc(i[a])) {
      s = We(i[a]);
      break;
    }
  const o = We(i.txId) || We(i.txid) || We(i.transactionId);
  if (o)
    return {
      ...i,
      txId: o,
      txid: o,
      txRaw: s ?? We(i.txRaw) ?? void 0
    };
  for (const a of bh) {
    const c = Dc(i[a]);
    if (c)
      return {
        ...i,
        txId: c,
        txid: c,
        txRaw: We(i[a]) ?? void 0
      };
  }
  for (const a of Gv) {
    const c = i[a], f = _a(c, e + 1);
    if (f)
      return {
        ...i,
        ...c && typeof c == "object" ? c : {},
        ...f,
        txId: f.txId,
        txid: f.txid ?? f.txId
      };
  }
  return null;
}, Fc = (t) => {
  const e = _a(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, Zv = (t) => {
  const e = _a(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, Qv = (t) => ({
  ...t,
  fee: ui(t.fee),
  nonce: ui(t.nonce),
  sponsored: t.sponsored === !0
}), Eh = (t) => ({
  recipient: t.recipient,
  amount: ui(t.amount) ?? "0",
  memo: t.memo,
  network: ql(t.network),
  address: t.stxAddress,
  fee: ui(t.fee),
  nonce: ui(t.nonce),
  sponsored: t.sponsored ?? !1
}), my = "WALLET_ADDRESS_MISMATCH", Jv = 45e3;
let eo = null;
const Xl = (t) => {
  t && (eo = { address: t, at: Date.now() });
}, t6 = () => {
  eo = null;
}, e6 = () => eo && Date.now() - eo.at <= Jv ? eo.address : null, n6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, r6 = async (t) => {
  t6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = ks(await t.request("wallet_connect")), n = ho(e);
  return Xl(n), n;
}, i6 = async (t, e, n, r) => {
  try {
    return ks(await t.request(e, n));
  } catch (i) {
    const s = ki(i);
    if (!n6(s))
      throw s;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: s.message
    });
    let o = null;
    try {
      o = await r6(t);
    } catch (a) {
      throw console.info("[wallet:xverse-preflight]", {
        stage: "RECOVERY_RECONNECT_FAILED",
        message: a instanceof Error ? a.message : String(a)
      }), s;
    }
    if (!o || r && o !== r)
      throw Object.assign(
        new Error(
          o ? `Xverse reconnected as ${o}, not the expected ${r}. Switch back to that account and retry.` : s.message
        ),
        { code: o ? my : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return ks(await t.request(e, n));
    } catch (a) {
      throw ki(a);
    }
  }
};
let Ah = 3e4;
const s6 = (t, e) => {
  let n;
  const r = new Promise((i, s) => {
    n = setTimeout(() => {
      s(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${Ah / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Ah);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, o6 = async (t, e, n) => {
  const r = (c, f) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${f}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: my }
      );
    return c;
  }, i = e6();
  if (i)
    return Jo(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: i }), r(i, "cached-session");
  let s = null;
  Jo(n, "account-read");
  try {
    const c = ks(
      await s6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    s = ho(c), console.info("[wallet:xverse-preflight]", {
      stage: s ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: s
    });
  } catch (c) {
    if (wy(c))
      throw ki(c);
    Jo(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (s)
    return Xl(s), r(s, "wallet_getAccount");
  let o;
  Jo(n, "account-reconnect");
  try {
    o = ks(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), ki(c);
  }
  const a = ho(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Xl(a), r(a, "wallet_connect");
}, a6 = async (t, e) => {
  if (!la(t)) {
    const s = await xh(
      t,
      "stx_transferStx",
      Eh(e)
    );
    return Fc(s);
  }
  const n = lf();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const s = await xh(
      n,
      "stx_transferStx",
      Eh(e)
    );
    return Fc(s);
  }
  const r = by();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await o6(r, e.stxAddress);
  const i = await i6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: ui(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: ui(e.fee) } : {}
    },
    e.stxAddress
  );
  return Fc(i);
}, c6 = () => wi(), xy = () => {
  var r, i;
  if (typeof window > "u")
    return;
  const t = wi(), e = t ? Vv(t) : void 0;
  if (e)
    return e;
  const n = Oi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((i = n.xverseProviders) == null ? void 0 : i.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, vh = (t, e) => {
  const n = xy(), r = Qv({
    ...t,
    onFinish: (i) => {
      var s;
      (s = t.onFinish) == null || s.call(t, Zv(i));
    }
  });
  if (!n || typeof n.request != "function")
    return Wo(r, e);
  if (la(n) && !lf()) {
    const i = Sh();
    if (i)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: wi(),
        route: "legacy-transaction-request"
      }), Wo(r, i);
  }
  return void a6(n, t).then((i) => {
    var s;
    (s = t.onFinish) == null || s.call(t, i);
  }).catch((i) => {
    var s, o;
    if (mh(i) && la(n)) {
      const a = Sh();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: wi(),
          route: "legacy-transaction-request"
        }), Wo(r, a);
        return;
      }
    }
    if (mh(i) && !la(n)) {
      Wo(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", i), wy(i)) {
      (s = t.onCancel) == null || s.call(t);
      return;
    }
    if (t.onError) {
      t.onError(i);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, $h = (t) => oy(t).replace(/^0x/, ""), Ih = "This wallet cannot sign messages. Try Xverse or Leather.", kh = (t) => typeof (t == null ? void 0 : t.request) == "function", Lh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", l6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, u6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function f6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: $h(e.message),
    domain: $h(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function d6(t, e) {
  const n = await s4({
    domain: e.domain,
    message: e.message,
    network: rc(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Ch(t) {
  var i, s;
  const e = c6() || "", n = /xverse/i.test(e);
  let r = xy();
  if (n && !Lh(r)) {
    const o = window;
    r = ((i = o.XverseProviders) == null ? void 0 : i.StacksProvider) ?? ((s = o.xverseProviders) == null ? void 0 : s.StacksProvider);
  }
  if (Lh(r))
    try {
      return await d6(r, t);
    } catch (o) {
      if (n || !kh(r) || !u6(o)) throw o;
    }
  if (!n && kh(r))
    try {
      return await f6(r, t);
    } catch (o) {
      throw l6(o) ? new Error(Ih) : o;
    }
  throw new Error(Ih);
}
const Th = 1000000n, ai = 1000000n, Wl = 50n, xn = 3000n, Ao = 300n, Gs = 3000n, h6 = 50000n, jc = 200n, ir = (t) => t + Wl;
function gn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / Th}.${(n % Th).toString().padStart(6, "0")}`;
}
function Bh(t, e = Ao) {
  return t <= xn ? 0 : Number((t - xn) / ir(e));
}
function zc(t, e = 0n) {
  const n = ai - t - e;
  return n > 0n ? n : 0n;
}
function p6(t, e = Ao) {
  return t > ai ? "over" : t < xn + ir(e) ? "empty" : t < h6 ? "low" : "ok";
}
const g6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", y6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", w6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function b6(t) {
  var n, r, i, s;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((i = e["holder-payment"]) == null ? void 0 : i.value) !== "50" || ((s = e["receipt-bytes"]) == null ? void 0 : s.value) !== "16" || w6.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== g6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Sy = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Rc = 3, m6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [Yl, Ey] = Sy.split("."), cn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function Zl(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function x6(t) {
  return cn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Kr(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Ay(t, e = []) {
  const n = await Kr(`/v2/contracts/call-read/${Yl}/${Ey}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Yl, arguments: e.map((r) => "0x" + cn(he(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Un(dn(n.result));
}
async function S6() {
  const t = await Kr(`/v2/contracts/source/${Yl}/${Ey}?proof=0`);
  if (typeof t.source != "string" || await x6(t.source) !== y6) throw Error("Deployed source does not match the tested helper.");
  if (b6(await Ay("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function vy(t) {
  return t.startsWith("SP") && ls(t) && !t.includes(".");
}
async function E6(t) {
  var r;
  if (!vy(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Kr(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Kr(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function A6(t) {
  const e = await Kr(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function v6(t, e) {
  var i, s;
  const n = await Ay("get-owner", [to(t), to(e)]), r = (n == null ? void 0 : n.success) === !0 ? (s = (i = n.value) == null ? void 0 : i.value) == null ? void 0 : s.value : null;
  if (typeof r != "string" || !vy(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function $6(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Zl(t), signal: AbortSignal.timeout(15e3) });
  } catch {
    throw Error("Submission outcome unknown. Reconcile the saved transaction before doing anything else.");
  }
  const r = await n.json();
  if (n.status === 400 && (r == null ? void 0 : r.reason) === "FeeTooLow") {
    const i = new Error("Node rejected the fee as too low. No automatic increase. Preview a new test with another fee.");
    throw Object.assign(i, { feeRejected: !0 }), i;
  }
  if (!n.ok || typeof r != "string" || r.replace(/^0x/, "") !== e.replace(/^0x/, "")) throw Error(`Submission unconfirmed (${n.status}). Reconcile or resend the same saved transaction; do not create a replacement.`);
  return r;
}
async function I6(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function k6(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Na(Zl(t.raw)), n = e.auth, r = e.payload, i = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || i.hashMode !== 0 || ss(Xs(Ta.MainnetSingleSig, i.signer)) !== t.address || i.fee !== BigInt(t.fee) || i.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const s = e.postConditions.values[0];
    if (r.payloadType !== 2 || ss(r.contractAddress) + "." + r.contractName.content !== Sy || r.functionName.content !== "play" || r.functionArgs.length !== 3 || cn(he(r.functionArgs[0])) !== cn(he(to(t.core))) || cn(he(r.functionArgs[1])) !== cn(he(to(t.song))) || cn(he(r.functionArgs[2])) !== cn(he(jv(Zl(t.id)))) || t.amount !== "50" || e.postConditionMode !== As.Deny || e.postConditions.values.length !== 1 || s.conditionType !== 0 || s.amount !== 50n || s.conditionCode !== co.Equal || s.principal.prefix !== 2 || ss(s.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || ss(r.contractAddress) + "." + r.contractName.content !== m6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || cn(he(r.functionArgs[0])) !== cn(he(to(t.song))) || typeof t.liked != "boolean" || cn(he(r.functionArgs[1])) !== cn(he(Fv(t.liked))) || t.amount !== "0" || e.postConditionMode !== As.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Un(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const L6 = "xtrata.xyz/radio/listening-wallet", C6 = "Link a temporary listening wallet for pay-per-play; no spending permission", Li = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && ls(t), T6 = (t) => ({
  domain: Ii({ name: $e(L6), version: $e("1"), "chain-id": Dn(1) }),
  message: Ii({
    purpose: $e(C6),
    main: $e(t.main),
    listening: $e(t.listening),
    issued: Dn(t.issued)
  })
}), $y = 100000n, B6 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function M6(t, e) {
  const n = t.filter((i) => !i || typeof i.sender != "string" || i.sender === e || !Li(i.sender) || !/^\d+$/.test(i.amount) ? !1 : BigInt(i.amount) >= $y).sort(B6);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((i) => i.sender)).size };
}
const ta = 50;
function Ua(t) {
  const e = t;
  if (!e || typeof e.total != "number" || !Number.isSafeInteger(e.total) || e.total < 0 || !Array.isArray(e.results)) return null;
  const n = [];
  for (const r of e.results) {
    if (typeof (r == null ? void 0 : r.sender) != "string" || typeof r.amount != "string" || typeof r.tx_id != "string") return null;
    const i = Number(r.block_height), s = Number(r.tx_index ?? 0);
    if (!Number.isSafeInteger(i) || !Number.isSafeInteger(s)) return null;
    n.push({ sender: r.sender, amount: r.amount, txId: r.tx_id, blockHeight: i, txIndex: s });
  }
  return { total: e.total, transfers: n };
}
async function N6(t, e, n = 4) {
  if (!Li(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${ta}&offset=${o}`, i = Ua(await e(r(0)));
    if (!i || i.total > 0 && !i.transfers.length) return { ok: !1 };
    if (i.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let s = Math.max(0, i.total - ta);
    for (let o = 0; o < n; o++) {
      const a = s === 0 && i.total <= ta ? i : Ua(await e(r(s)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = M6(a.transfers, t);
      if (c.ok && c.funder) return s > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (s === 0) return c;
      s = Math.max(0, s - ta);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const Qn = 50, _6 = 6, U6 = 20, Mh = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function Nh(t, e) {
  const n = t;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], i = [];
  for (const s of n.results) {
    const o = s && typeof s == "object" && s.tx && typeof s.tx == "object" ? s.tx : s;
    if (!o || typeof o.tx_id != "string" || typeof o.tx_type != "string") return null;
    if (i.push(o.tx_id), o.tx_type !== "token_transfer" || o.sender_address !== e || o.tx_status !== "success") continue;
    const a = o.token_transfer;
    if (!a || typeof a.recipient_address != "string" || typeof a.amount != "string" || !/^\d+$/.test(a.amount)) return null;
    const c = Number(o.block_height), f = Number(o.tx_index ?? 0);
    if (!Number.isSafeInteger(c) || !Number.isSafeInteger(f)) return null;
    r.push({ recipient: a.recipient_address, amount: BigInt(a.amount), txId: o.tx_id, blockHeight: c, txIndex: f });
  }
  return { total: n.total, sent: r, rows: i };
}
async function P6(t, e, n) {
  if (!Li(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), i = Ua(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Qn}&offset=0`));
    if (!i || i.total > _6 * Qn) return { ok: !1 };
    for (const o of i.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = Qn; o < i.total; o += Qn) {
      const a = Ua(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Qn}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== i.total) return { ok: !1 };
    const s = /* @__PURE__ */ new Map();
    if (n) {
      const o = (f) => `/extended/v1/address/${t}/transactions?limit=${Qn}&offset=${f}`, a = Nh(await e(o(0)), t);
      if (!a || a.total > U6 * Qn) return { ok: !1 };
      const c = new Set(a.rows);
      for (const f of a.sent) s.set(f.txId, f);
      for (let f = Qn; f < a.total; f += Qn) {
        const d = Nh(await e(o(f)), t);
        if (!d || !d.rows.length) return { ok: !1 };
        for (const l of d.rows) c.add(l);
        for (const l of d.sent) s.set(l.txId, l);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...s.values()] };
  } catch {
    return { ok: !1 };
  }
}
function H6(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const i = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(Mh).map((l, g) => {
    const h = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: h, kind: "gift", to: r.payer, at: g } : Li(l.sender) && h >= $y ? { sender: l.sender, left: h, kind: "deposit", to: l.sender, at: g } : { sender: l.sender, left: h, kind: "dust", to: null, at: g };
  }), s = i.reduce((l, g) => l + g.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && Li(l.recipient) && l.amount > 0n).sort(Mh), a = o.reduce((l, g) => l + g.amount, 0n), c = s - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const f = (l, g) => {
    let h = g;
    for (const x of l) {
      if (h <= 0n) break;
      const b = x.left < h ? x.left : h;
      x.left -= b, h -= b;
    }
    return h;
  };
  for (const l of o) {
    const g = f(i.filter((h) => h.to === l.recipient), l.amount);
    g > 0n && f(i, g);
  }
  if (f(i, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (i.reduce((l, g) => l + g.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const d = /* @__PURE__ */ new Map();
  for (const l of i) {
    if (l.left <= 0n) continue;
    const g = `${l.kind}:${l.to ?? ""}`, h = d.get(g);
    h ? (h.amount += l.left, h.newest = Math.max(h.newest, l.at)) : d.set(g, { to: l.to, kind: l.kind, amount: l.left, newest: l.at });
  }
  return {
    ok: !0,
    parts: [...d.values()].sort((l, g) => l.newest - g.newest),
    hasTopUp: i.some((l) => l.kind === "deposit")
  };
}
function O6(t, e) {
  const n = t.filter((f) => f.kind === "deposit").sort((f, d) => f.newest - d.newest), r = t.find((f) => f.kind === "gift"), i = t.filter((f) => f.kind === "dust"), s = ((r == null ? void 0 : r.amount) ?? 0n) + i.reduce((f, d) => f + d.amount, 0n), o = [], a = [], c = s > e;
  return n.forEach((f, d) => {
    if (f.amount <= e) {
      a.push(f);
      return;
    }
    const l = d === n.length - 1 && !c;
    o.push({ to: f.to, kind: "deposit", mode: l ? "all" : "amount", send: f.amount - e });
  }), c ? o.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: s - e }) : (r && a.push(r), a.push(...i)), { steps: o, tooSmall: a };
}
function _h(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const Ql = [50000n, 100000n, 250000n], Ks = ["prepared", "signed", "unknown", "pending"], D6 = 30 * 6e4, Zi = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, F6 = 3e3, Uh = "Your main listener wallet is out of funds, so likes are paused. Top it up (it only needs a little) and your likes carry on.", Gc = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function j6(t) {
  let e = null, n = -1 / 0, r, i = null, s = null, o, a = -1 / 0, c = null, f = null, d = !1, l = !1, g = !1, h = null, x = !1, b = "", L = "", H, U = null, p, $ = [], I, z = -1 / 0;
  const tt = /* @__PURE__ */ new Set();
  let F = null, Y = !1, S = 0, C = null, _ = null, B = !1, X = null, K = !1, gt = null, ht = !1, ye = !1, E = !1, M = !1, kt = !1, pt = 0, ut = null, xt = Promise.resolve();
  const Pt = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? Ao.toString()), Nt = (w) => !!s && !(s.features ?? []).includes(w), Xt = (w, A) => `xtrata.ppp.v1.${w}:${A}`, be = (w = s == null ? void 0 : s.address) => {
    if (!w) return [];
    try {
      const A = JSON.parse(t.store.get(Xt("entries", w)) || "[]");
      return Array.isArray(A) ? A : [];
    } catch {
      return [];
    }
  }, Bt = (w) => {
    const A = [w, ...be(w.address).filter((P) => !(P.txid === w.txid && P.kind === w.kind))].slice(0, 200);
    t.store.set(Xt("entries", w.address), JSON.stringify(A));
  }, Ae = (w = s == null ? void 0 : s.address) => !!w && t.store.get(Xt("on", w)) !== "0", tn = (w) => {
    s != null && s.address && t.store.set(Xt("on", s.address), w ? "1" : "0");
  }, Ge = () => be().filter((w) => Ks.includes(w.status)), T = () => yt() ? [...Ge(), ...be(rt()).filter((w) => Ks.includes(w.status))] : Ge(), G = () => R(s == null ? void 0 : s.address), R = (w) => {
    if (!w) return null;
    try {
      return JSON.parse(t.store.get(Xt("deposit", w)) || "null");
    } catch {
      return null;
    }
  }, ot = (w, A = s == null ? void 0 : s.address) => {
    A && t.store.set(Xt("deposit", A), JSON.stringify(w));
  }, rt = () => Nt("rootLike") ? s == null ? void 0 : s.address : (s == null ? void 0 : s.root) ?? (s == null ? void 0 : s.address), yt = () => !!(s != null && s.address) && rt() !== s.address, Qt = () => yt() ? c && c.for === rt() ? c.value : void 0 : o, St = (w) => w !== void 0 && w < xn + jc, Vt = () => Ge().filter((w) => t.now() - w.created > D6 && tt.has(w.txid)), Ht = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), _t = () => Ht() && !(s != null && s.linked), wt = () => {
    const w = t.main();
    return !_t() && !!w && !!(s != null && s.linked) && s.linked !== w;
  }, Lt = (w) => Xt("return-to", w), u = (w = s == null ? void 0 : s.address) => {
    if (!w) return;
    const A = t.store.get(Lt(w));
    return A && Li(A) && A !== w ? A : void 0;
  }, m = (w = s == null ? void 0 : s.address) => F && F.for === w ? F.res : null;
  function v() {
    if (!(s != null && s.address)) return;
    if (s.linked) return { to: s.linked, kind: "linked" };
    const w = u();
    if (w) return { to: w, kind: "chosen" };
    const A = m();
    if (A != null && A.ok && A.funder) return { to: A.funder, kind: "funder" };
  }
  const O = (w) => Xt("gift", w);
  function et() {
    const w = s == null ? void 0 : s.address;
    if (!w) return null;
    if ((X == null ? void 0 : X.for) === w) return X.info;
    try {
      const A = JSON.parse(t.store.get(O(w)) || "null");
      return A && typeof A.returnTo == "string" && typeof A.treasury == "string" ? A : null;
    } catch {
      return null;
    }
  }
  async function bt() {
    var J;
    const w = s == null ? void 0 : s.address;
    if (!w || !t.giftInfo || !((J = e == null ? void 0 : e.gifts) != null && J.enabled) || K) return;
    const A = (X == null ? void 0 : X.for) === w ? X : null, P = A ? A.ok ? A.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (A && t.now() - A.at < P) return;
    K = !0;
    const W = et();
    try {
      const V = await t.giftInfo(w);
      X = { for: w, info: V, ok: !0, at: t.now() }, t.store.set(O(w), JSON.stringify(V));
    } catch {
      X = { for: w, info: W, ok: !1, at: t.now() };
    } finally {
      K = !1;
    }
  }
  const Jt = () => be().reduce((w, A) => Ks.includes(A.status) ? w + BigInt(A.amount || "0") + BigInt(A.fee || "0") : w, 0n);
  function te() {
    if (o === void 0) return 0;
    const w = o - Jt() - BigInt(ee.length) * ir(Pt());
    return w > 0n ? Bh(w, Pt()) : 0;
  }
  const Se = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", vn = "EMPTY — ADD STX TO PLAY";
  function $n() {
    var P;
    const w = (s == null ? void 0 : s.state) === "known" || (s == null ? void 0 : s.state) === "unlocked";
    if (!((P = et()) != null && P.player) && !w) return null;
    const A = (W, J) => ({ reason: W, text: J });
    switch (Gt()) {
      case "connect":
      case "wrong-wallet":
        return A("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "locked":
        return A("locked", "UNLOCK TO LISTEN");
      case "link":
        return A("link", "FINISH SETUP TO LISTEN");
      case "over":
        return A("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return G() ? A("arriving", "YOUR PLAYS ARE ARRIVING") : A("out", yt() ? Se : vn);
      case "ready":
        return !Ae() || !(s != null && s.session) || s.session.playsLeft < 1 ? A("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : E ? te() < 1 ? A("out", yt() ? Se : vn) : null : A("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const Ke = () => {
    var w;
    return !!(s != null && s.address) && yt() && !!((w = et()) != null && w.player);
  };
  function me() {
    return Ke() ? { locked: !0, known: !0 } : null;
  }
  const Kn = 3 * 6e4, hn = () => !!et() && !!t.history && !(s != null && s.linked);
  async function dt() {
    const w = s.address, A = et(), { balance: P, nonce: W } = await t.chain.account(w), J = await t.history(w, !0);
    if (!J.ok) return null;
    const V = H6({ self: w, balance: P, inbound: J.inbound, outgoing: J.outgoing, gift: { sender: A.treasury, payer: A.returnTo } });
    if (!V.ok) return null;
    const lt = O6(V.parts, Gs);
    return { balance: P, nonce: W, parts: V.parts, steps: lt.steps, tooSmall: lt.tooSmall.length };
  }
  const Ot = () => ht ? { state: "unavailable" } : !gt || t.now() - gt.at > Kn || o !== void 0 && o !== gt.balance ? { state: "none" } : gt.plan;
  function Gt() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const w = t.main();
    if (!_t()) {
      if (!w) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return s ? s.state === "unsupported" ? "unsupported" : s.state === "none" ? "intro" : wt() ? "wrong-wallet" : s.state === "known" ? "locked" : !_t() && s.linked !== w ? "link" : o === void 0 ? "loading" : o > ai ? "over" : o < xn + ir(Pt()) ? "fund" : "ready" : "loading";
  }
  const en = () => {
    var w, A, P, W;
    return {
      step: Gt(),
      busy: f,
      message: b,
      error: L,
      gate: e,
      main: t.main(),
      listening: s == null ? void 0 : s.address,
      linked: s == null ? void 0 : s.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : p6(o, Pt()),
      playsLeft: o === void 0 ? 0 : Bh(o, Pt()),
      allowance: o === void 0 ? ai : zc(o, BigInt(((w = G()) == null ? void 0 : w.amount) ?? "0")),
      session: (s == null ? void 0 : s.session) ?? null,
      payingOn: Ae(),
      entries: be(),
      depositTxid: ((A = G()) == null ? void 0 : A.txid) ?? H,
      depositPending: !!G(),
      walletOutdated: Nt("like"),
      linkedListening: I && I === t.main() ? $.map((J) => J.listening) : [],
      serverLinked: !!U && p === `${t.main()}:${s == null ? void 0 : s.address}`,
      stuck: Vt().length,
      armed: M,
      queued: ee.length,
      solo: _t(),
      returnTo: (P = v()) == null ? void 0 : P.to,
      returnToKind: (W = v()) == null ? void 0 : W.kind,
      funderState: (() => {
        const J = m();
        return J ? J.ok ? J.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const J = m();
        return !!J && J.ok && J.distinct > 1;
      })(),
      walletCannotSolo: _t() && Nt("standalone"),
      walletCannotMulti: Nt("multi"),
      others: ((s == null ? void 0 : s.others) ?? []).filter((J) => J !== t.main() && J !== (s == null ? void 0 : s.linked)),
      creditedTo: _t() && (s != null && s.address) && (C == null ? void 0 : C.for) === s.address && C.main ? C.main : void 0,
      createdHere: !!(s != null && s.address) && t.store.get(Xt("created", s.address)) === "1",
      brandNew: !!(s != null && s.address) && o === 0n && (_ == null ? void 0 : _.for) === s.address && _.unused,
      gift: (() => {
        const J = et();
        return J ? { player: J.player, from: J.from, source: J.source, amount: J.amount } : null;
      })(),
      giftPlays: et() ? te() : 0,
      giftStop: $n(),
      albumLock: me(),
      returnPlan: Ot(),
      slot: (s == null ? void 0 : s.state) === "unlocked" ? s.slot ?? 0 : 0,
      root: (s == null ? void 0 : s.state) === "unlocked" ? s.root ?? s.address : void 0,
      walletCannotAlbums: Nt("slots"),
      likeFunds: (() => {
        var lt;
        const J = rt();
        if (!J || (s == null ? void 0 : s.state) !== "unlocked") return null;
        const V = Qt();
        return { address: J, balance: V, low: St(V), album: yt(), pending: !!R(J), txid: (lt = R(J)) == null ? void 0 : lt.txid, main: t.main() };
      })()
    };
  }, Ft = (w, A = "") => {
    b = w, L = A, t.changed();
  };
  async function ke(w, A) {
    if (!f) {
      f = w, L = "", t.changed();
      try {
        await A();
      } catch (P) {
        const W = P instanceof Error ? P.message : String(P);
        L = /Cancelled in the listening wallet/.test(W) ? "" : W, L || (b = "Not now. Nothing was signed.", kt = !0);
      } finally {
        f = null, await rn(!0);
      }
    }
  }
  const Wr = () => !!(e != null && e.enabled) && e.here && (_t() || !!t.main() && e.allowed), Vn = () => Wr() && !wt(), In = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", we = () => {
    if (wt()) throw new Error(In());
  };
  async function nn() {
    if (!Wr()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return i ?? (i = await t.bridge(e.walletOrigin)), i;
  }
  const Pe = (w) => {
    const A = t.main();
    return w.request("listening.status", A ? { main: A } : void 0);
  };
  async function Yr(w = !1) {
    s != null && s.address && (!w && t.now() - a < 3e4 || (o = await t.chain.balance(s.address), a = t.now(), await cr(w)));
  }
  async function cr(w = !1) {
    const A = rt();
    if (!(!yt() || !A || (s == null ? void 0 : s.state) !== "unlocked") && !(!w && (c == null ? void 0 : c.for) === A && t.now() - c.at < 3e4))
      try {
        c = { for: A, value: await t.chain.balance(A), at: t.now() };
      } catch {
      }
  }
  async function Di(w) {
    if ((I !== w || t.now() - z >= 6e4) && ($ = await t.links(w), I = w, z = t.now()), (s == null ? void 0 : s.state) !== "unlocked" || s.linked === w) return;
    const A = `${w}:${s.address}`;
    p === A && U || (U = $.find((P) => P.listening === s.address) ?? null, p = A);
  }
  async function He() {
    const w = s == null ? void 0 : s.address;
    if (!_t() || !w || s != null && s.linked || !t.funder || Y || !o || o <= 0n) return;
    const A = m(w);
    if (A != null && A.ok && A.funder) return;
    const P = A != null && A.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, S - 1), 30 * 6e4);
    if (!(F && F.for === w && t.now() - F.at < P)) {
      Y = !0;
      try {
        F = { for: w, res: await t.funder(w), at: t.now() };
      } catch {
        F = { for: w, res: { ok: !1 }, at: t.now() };
      } finally {
        Y = !1;
      }
      S = F.res.ok ? 0 : S + 1;
    }
  }
  async function Fi() {
    const w = s == null ? void 0 : s.address;
    if (!(!_t() || !w || s != null && s.linked || !t.mainOf || B) && !(C && C.for === w && (C.ok || t.now() - C.at < 6e4))) {
      B = !0;
      try {
        C = { for: w, main: await t.mainOf(w), ok: !0, at: t.now() };
      } catch {
        C = { for: w, main: null, ok: !1, at: t.now() };
      } finally {
        B = !1;
      }
    }
  }
  async function ji() {
    const w = s == null ? void 0 : s.address;
    if (!(!w || (s == null ? void 0 : s.state) !== "unlocked" || o !== 0n || (_ == null ? void 0 : _.for) === w) && t.store.get(Xt("created", w)) !== "1")
      try {
        _ = { for: w, unused: await t.chain.confirmedNonce(w) === 0n };
      } catch {
      }
  }
  async function zi() {
    var J;
    const w = s == null ? void 0 : s.address;
    if (!w) return !1;
    let A, P = !1;
    const W = /* @__PURE__ */ new Map();
    for (const V of T())
      try {
        const lt = await t.chain.transaction(V.txid);
        if (!lt) {
          if (tt.add(V.txid), t.now() - V.created > 15 * 6e4 && !W.has(V.address) && W.set(V.address, await t.chain.confirmedNonce(V.address)), A = W.get(V.address), A !== void 0 && A > BigInt(V.nonce)) {
            Bt({ ...V, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((V.status === "unknown" || V.status === "signed") && V.raw)
            try {
              await t.chain.broadcast(V.raw, V.txid), Bt({ ...V, status: "pending" });
            } catch (at) {
              Zi(at) && Bt({ ...V, status: "failed", note: at.message, raw: void 0 });
            }
          continue;
        }
        tt.delete(V.txid);
        const ft = String(lt.tx_status);
        if (ft === "success" && lt.canonical !== !1 && lt.is_unanchored === !1) {
          if (Bt({ ...V, status: "confirmed", confirmedAt: t.now(), actualFee: String(lt.fee_rate ?? V.fee), raw: void 0 }), P = !0, V.kind === "like" && (x = !0, V.status !== "confirmed" && typeof V.liked == "boolean"))
            try {
              (J = t.likeConfirmed) == null || J.call(t, V.song, V.liked);
            } catch {
            }
        } else ft.startsWith("abort_") || ft.startsWith("dropped_") ? Bt({ ...V, status: "failed", note: ft, raw: void 0 }) : V.status !== "pending" && Bt({ ...V, status: "pending" });
      } catch {
      }
    for (const V of yt() ? [w, rt()] : [w]) {
      const lt = R(V);
      if (lt)
        try {
          const ft = await t.chain.transaction(lt.txid), at = String((ft == null ? void 0 : ft.tx_status) ?? "");
          (at === "success" && ft.is_unanchored === !1 || at.startsWith("abort_") || at.startsWith("dropped_") || !ft && t.now() - lt.at > 2 * 36e5) && (ot(null, V), a = -1 / 0, c = null, /on its way/i.test(b) && (b = ""));
        } catch {
        }
    }
    return P;
  }
  async function rn(w = !1) {
    var A;
    try {
      const P = t.main();
      if ((w || !e || r !== P || t.now() - n > 3e5) && (e = await t.config(P), n = t.now(), r = P), !e.enabled || !e.here || !_t() && (!P || !e.allowed)) {
        i && (s != null && s.session) && await i.request("listening.stop").catch(() => {
        }), M && lr(), t.changed();
        return;
      }
      await nn(), s = await Pe(i), wt() && s.state === "unlocked" && (qi(), await i.request("listening.lock").catch(() => {
      }), o = void 0, s = await Pe(i)), P && e.allowed && await Di(P), await Yr(w), await He(), await Fi(), await ji(), await bt(), await zi() && await Yr(!0), await cr(), await Xn();
    } catch (P) {
      L = P instanceof Error ? P.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    if (Gt() === "locked" ? Gi() : M && lr(), x) {
      x = !1;
      try {
        (A = t.likesChanged) == null || A.call(t);
      } catch {
      }
    }
    t.changed(), ee.length && !Vi && Hs();
  }
  async function Ri(w) {
    const A = s == null ? void 0 : s.root;
    if (!A || s != null && s.slot || !(s != null && s.address) || Nt("slots")) return;
    const P = Number(t.store.get(Xt("slot", A)));
    if (!(!Number.isSafeInteger(P) || P < 1))
      try {
        const { balance: W } = await t.chain.account(s.address);
        if (W >= xn + ir(Pt())) return;
        await w.request("listening.openSlot", { slot: P }), s = await Pe(w), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function sn(w, A) {
    var V;
    we();
    const P = !(s != null && s.address) || Ae(s.address), W = s != null && s.linked ? (V = t.nameOf) == null ? void 0 : V.call(t, s.linked) : void 0;
    await w.request("listening.unlock", { mode: "unlock", terms: P ? ur() : void 0, anyPasskey: A, ...t.main() ? { main: t.main() } : {}, ...W ? { label: W } : {} }), s = await Pe(w), P && (Ae(s.address) ? await fr() : await w.request("listening.stop")), await Ri(w), Ft(P ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const J = h;
    h = null, J && t.now() - J.at < 12e4 && setTimeout(() => void rn(!0).then(() => Ds(J)), 0);
  }
  function Gi() {
    M || f || kt || pt >= 3 || !i || !(s != null && s.address) || (M = !0, xt = (async () => {
      try {
        await sn(i, !1), pt = 0;
      } catch (w) {
        const A = w instanceof Error ? w.message : String(w);
        /Cancelled in the listening wallet/.test(A) ? ut || (kt = !0, Ft("Not now. Nothing was signed.")) : /did not answer/.test(A) ? await (i == null ? void 0 : i.request("listening.cancel").catch(() => {
        })) : (pt++, L = A);
      } finally {
        M = !1;
        const w = ut;
        ut = null, w ? await w() : await rn(!0);
      }
    })());
  }
  async function lr(w) {
    M && (ut = async () => {
    }, await (i == null ? void 0 : i.request("listening.cancel").catch(() => {
    })), await xt), w && await w(), t.changed();
  }
  const ur = () => ({
    fee: Pt().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: ai.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function fr() {
    if (!(s != null && s.address)) return !1;
    if (E || (E = await t.tabLock(s.address)), !E)
      throw await (i == null ? void 0 : i.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function dr(w, A) {
    const P = s.address, { balance: W, nonce: J } = A ?? await t.chain.account(P);
    o = W;
    const V = await i.request("listening.prepareReturn", {
      mode: w.mode,
      balance: W.toString(),
      nonce: J.toString(),
      fee: Gs.toString(),
      ...w.amount !== void 0 ? { amount: w.amount.toString() } : {},
      ...w.linked ? {} : { destination: w.to }
    });
    if (V.recipient !== w.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const lt = w.mode === "amount" ? w.amount : w.mode === "all" ? W - Gs : W - ai - Gs, ft = Na(V.raw);
    if (Un(ft.payload.recipient).value !== w.to || String(ft.payload.amount) !== V.amount || lt !== void 0 && V.amount !== lt.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const at = {
      id: Gc(),
      address: P,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: V.recipient,
      amount: V.amount,
      fee: V.fee,
      nonce: J.toString(),
      created: t.now(),
      status: "signed",
      raw: V.raw,
      txid: V.txid
    };
    t.validate(at), Bt(at);
    try {
      await t.chain.broadcast(V.raw, V.txid), Bt({ ...at, status: "pending" });
    } catch (zt) {
      throw Bt({ ...at, status: "unknown", note: zt.message }), zt;
    }
    return V;
  }
  const D = 15000n, Q = Gs;
  async function ce(w, A, P) {
    if ((s == null ? void 0 : s.state) !== "unlocked" || !s.address) throw new Error("Unlock the listening wallet first.");
    if (Nt("slots") || Nt("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const W = s.slot ?? 0;
    if (w === A || ![w, A].includes(W) || ![w, A].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const J = s.root ?? s.address, V = w === 0 ? J : s.address, lt = A === 0 ? J : s.address, { balance: ft, nonce: at } = await t.chain.account(V);
    if (ft < P + Q + xn) throw new Error(w === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const zt = await i.request("listening.signMove", { from: w, to: A, amount: P.toString(), fee: Q.toString(), nonce: at.toString(), balance: ft.toString() }), se = Na(zt.raw);
    if (zt.from !== V || zt.to !== lt || zt.amount !== P.toString() || Un(se.payload.recipient).value !== lt || String(se.payload.amount) !== P.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const on = {
      id: Gc(),
      address: V,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: lt,
      amount: zt.amount,
      fee: zt.fee,
      nonce: at.toString(),
      created: t.now(),
      status: "signed",
      raw: zt.raw,
      txid: zt.txid
    };
    t.validate(on), Bt(on);
    try {
      await t.chain.broadcast(zt.raw, zt.txid), Bt({ ...on, status: "pending" });
    } catch (Te) {
      throw Bt({ ...on, status: "unknown", note: Te.message }), Te;
    }
    return ot({ txid: zt.txid, amount: zt.amount, at: t.now() }, lt), lt === J && J !== s.address ? c = null : a = -1 / 0, zt;
  }
  let de = !1;
  const hr = /* @__PURE__ */ new Map(), qn = (w) => Xt("float", w);
  async function Xn() {
    if (de || (s == null ? void 0 : s.state) !== "unlocked" || !yt() || Nt("move") || Nt("rootLike") || !s.address) return;
    const w = s.address;
    if (t.store.get(qn(w)) === "1") return;
    const A = et();
    if (!(A != null && A.player) || A.state !== "arrived") return;
    const P = Qt();
    if (P === void 0 || o === void 0) return;
    if (!St(P)) {
      t.store.set(qn(w), "1");
      return;
    }
    if (R(rt()) || Ps() || T().length || o < D * 4n + xn + Q) return;
    const W = hr.get(w);
    if (!(W && (W.n >= 3 || t.now() - W.at < 5 * 6e4))) {
      de = !0, hr.set(w, { n: ((W == null ? void 0 : W.n) ?? 0) + 1, at: t.now() });
      try {
        await ce(s.slot ?? 0, 0, D), t.store.set(qn(w), "1");
      } catch (J) {
        console.warn("[radio] likes float not sent yet", J);
      } finally {
        de = !1;
      }
    }
  }
  async function Ki(w) {
    if (Ge().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Nt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const A = await dt().catch(() => null);
    if (!A)
      throw gt = null, ht = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    ht = !1, o = A.balance;
    const P = { balance: A.balance, nonce: A.nonce };
    if (w === "excess") {
      const ft = _h(A.parts) ?? u();
      if (!ft) throw new Error("Choose where to send the excess first.");
      await dr({ mode: "excess", to: ft, linked: !1 }, P), gt = null, Ft("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const W = A.steps;
    if (!W.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!gt && gt.balance === A.balance && t.now() - gt.at <= Kn && gt.steps.length === W.length && gt.steps.every((ft, at) => ft.to === W[at].to && ft.mode === W[at].mode && ft.send === W[at].send))) {
      gt = {
        at: t.now(),
        balance: A.balance,
        steps: W,
        parts: A.parts,
        plan: { state: "ready", steps: W.map((ft) => ({ to: ft.to, kind: ft.kind, send: ft.send.toString() })), kept: A.tooSmall, excess: _h(A.parts) }
      }, Ft(W.length > 1 ? `This goes back in ${W.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const V = W[0], lt = V.to ?? u();
    if (!lt) throw new Error("Choose where to send the rest first.");
    if (V.mode === "amount" && Nt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await dr({ mode: V.mode, to: lt, linked: !1, ...V.mode === "amount" ? { amount: V.send } : {} }, P), gt = null, W.length === 1 ? (tn(!1), Ft("Returned ✓ Paying is off.")) : Ft(`Returned ✓ ${W.length - 1} more ${W.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const Wn = {
    forceRefresh: () => rn(!0),
    create: () => ke("Waiting for your passkey…", async () => {
      const w = await nn();
      await w.request("listening.unlock", { mode: "create", terms: ur(), ...t.main() ? { main: t.main() } : {} }), s = await Pe(w), s.address && t.store.set(Xt("created", s.address), "1"), tn(!0), Ft(_t() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await fr();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    giftSent: (w, A) => {
      !(s != null && s.address) || G() || (ot({ txid: w, amount: A.toString(), at: t.now() }), a = -1 / 0, X = null, Ft("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (w) => {
      if (we(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Nt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await nn()).request("listening.bindSlot", { slot: w, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (w, A, P, W) => {
      ot({ txid: P, amount: W.toString(), at: t.now() }, A), X = null, await Wn.openAlbum(w), Ft("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (w) => ke("Opening…", async () => {
      if (we(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Nt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (d || l || g) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((s.slot ?? 0) === w) return;
      qi(), await i.request("listening.openSlot", { slot: w }), s = await Pe(i), o = void 0, a = -1 / 0, gt = null, ht = !1;
      const A = s.root;
      A && w > 0 && t.store.set(Xt("slot", A), String(w)), Ft(w === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (w = !1) => {
      const A = () => ke("Waiting for your passkey…", async () => sn(await nn(), w));
      return M ? w ? Nt("cancel") ? (Ft("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : lr(async () => {
        (Gt() === "locked" || Gt() === "intro") && await A();
      }) : xt : A();
    },
    link: () => ke("Sign in your wallet…", async () => {
      we();
      const w = t.main();
      if (!w || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      const A = (await t.links(w)).find((P) => P.listening === s.address);
      if (A)
        await i.request("listening.link", { main: w, issued: A.issued, mainSignature: A.mainSignature });
      else {
        const P = { main: w, listening: s.address, issued: t.now() }, W = await t.signWithMain(w, T6(P)), J = await i.request("listening.link", { main: w, issued: P.issued, mainSignature: W });
        await t.saveLink({ ...P, mainSignature: W, listeningSignature: J.listeningSignature }), z = -1 / 0;
      }
      Ft("Linked ✓");
    }),
    deposit: () => ke("Approve the deposit in your wallet…", async () => {
      we();
      const w = t.main();
      if (!w || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      if (G()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Yr(!0);
      const A = zc(o ?? 0n);
      if (A <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      H = await t.deposit(w, s.address, A), H && ot({ txid: H, amount: A.toString(), at: t.now() }), Ft("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => ke("Approve the top-up in your wallet…", async () => {
      we();
      const w = t.main(), A = rt();
      if (!w || !A) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (R(A)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const P = await t.chain.balance(A);
      yt() ? c = { for: A, value: P, at: t.now() } : (o = P, a = t.now());
      const W = zc(P);
      if (W <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const J = await t.deposit(w, A, W);
      J && ot({ txid: J, amount: W.toString(), at: t.now() }, A), Ft("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_CHOICES`. */
    topUpAlbum: (w) => ke("Adding plays…", async () => {
      if (we(), !yt()) throw new Error("Open the album you want to add plays to first.");
      if (!Ql.includes(w)) throw new Error("Choose one of the amounts offered.");
      if (d || l || g) throw new Error("Still sending a payment. Try again in a moment.");
      if (T().length || G()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await ce(0, s.slot ?? 0, w), Ft("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => ke("Confirm in the listening wallet…", async () => {
      if (!Vn()) throw new Error("Connect your wallet first.");
      await fr(), await i.request("listening.approveSession", ur()), tn(!0), Ft("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => ke("Clearing…", async () => {
      for (const w of Vt())
        await t.chain.transaction(w.txid) || Bt({ ...w, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Ft("Cleared ✓");
    }),
    switchOff: () => ke("Switching off…", async () => {
      qi(), await (i == null ? void 0 : i.request("listening.stop")), tn(!1), Ft("Paying is off. Music stays free.");
    }),
    lock: () => ke("Locking…", async () => {
      qi(), await (i == null ? void 0 : i.request("listening.lock")), o = void 0, Ft("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (w) => {
      const A = String(w ?? "").trim();
      if (!(s != null && s.address)) return Ft("", "Unlock the listening wallet first.");
      if (!Li(A)) return Ft("", "Enter a standard mainnet address (it starts with SP).");
      if (A === s.address) return Ft("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(Lt(s.address), A), Ft("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      s != null && s.address && t.store.set(Lt(s.address), ""), t.changed();
    },
    returnFunds: (w) => ke("Check the return in the listening wallet…", async () => {
      if (!Vn()) throw new Error("Connect your wallet first.");
      if (!(s != null && s.address)) throw new Error("Unlock the listening wallet first.");
      if (hn()) return Ki(w);
      const A = v();
      if (!A) throw new Error(_t() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (A.kind !== "linked" && Nt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Ge().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await dr({ mode: w, to: A.to, linked: A.kind === "linked" }), w === "all" && tn(!1), Ft(w === "all" ? A.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, ee = [], Us = 10, uc = 30 * 6e4;
  let Vi = !1;
  const Ps = () => d || !!f || l || g, qi = () => {
    ee.length && (ee.length = 0, t.changed());
  };
  async function fc(w) {
    if (!ee.some((A) => A.id === w.id) && !be().some((A) => A.id === w.id) && (ee.push({ ...w, at: t.now() }), ee.length > Us && ee.shift()), Ps() || Ge().length) {
      const A = ee.length;
      b = `Queued ${A === 1 ? "this song" : A + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Hs();
  }
  async function Hs() {
    if (!Vi) {
      Vi = !0;
      try {
        for (; ee.length; ) {
          for (; ee.length && t.now() - ee[0].at > uc; ) ee.shift();
          if (!ee.length || Ps() || await Os(ee[0]) === "wait") return;
          ee.shift();
        }
      } finally {
        Vi = !1, t.changed();
      }
    }
  }
  async function Os(w) {
    var A;
    d = !0;
    try {
      await rn();
      const P = Gt();
      if (P === "loading") return "wait";
      if (P !== "ready" || !Ae() || !(s != null && s.session) || s.session.playsLeft < 1 || !E) return "done";
      if (Ge().length) return "wait";
      ye || (await t.chain.verify(), ye = !0);
      const W = s.address, { balance: J, nonce: V } = await t.chain.account(W);
      o = J, a = t.now();
      const lt = await t.chain.owner(Rc, w.song);
      if (lt === W || lt === t.main()) return "done";
      const ft = await i.request("listening.signPlay", {
        core: Rc,
        song: w.song,
        receipt: w.id,
        fee: Pt().toString(),
        nonce: V.toString(),
        balance: J.toString()
      }), at = {
        id: w.id,
        address: W,
        kind: "play",
        core: Rc,
        song: w.song,
        recipient: lt,
        amount: "50",
        fee: Pt().toString(),
        nonce: V.toString(),
        created: t.now(),
        status: "signed",
        raw: ft.raw,
        txid: ft.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(at), Bt(at);
      const zt = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`;
      try {
        await t.chain.broadcast(ft.raw, ft.txid), Bt({ ...at, status: "pending" }), b = `♪ Paid ${zt}`, L = "";
      } catch (se) {
        Bt({ ...at, status: Zi(se) ? "failed" : "unknown", note: se.message, ...Zi(se) ? { raw: void 0 } : {} }), L = se.message;
      }
      return s = await Pe(i), "done";
    } catch (P) {
      const W = P instanceof Error ? P.message : "payment unavailable";
      return (A = et()) != null && A.player ? (b = "Payment is taking a moment: " + W, "wait") : (b = "This song played free: " + W, "done");
    } finally {
      d = !1, t.changed();
    }
  }
  function dc(w) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Gt()) || Nt("like") ? !1 : (Ds(w), !0);
  }
  async function Ds(w) {
    const A = w.title ? `“${w.title}”` : `song #${w.song}`, P = (kn) => {
      var vo;
      L = kn, b = "";
      try {
        (vo = t.likeFailed) == null || vo.call(t, w.song);
      } catch {
      }
      t.changed();
    }, W = yt(), J = Gt(), V = t.main(), lt = W && (J === "fund" || J === "over") ? "ready" : J, ft = _t() ? rt() : V;
    if (lt === "locked") {
      h = { ...w, at: t.now() }, Ft(`Unlock to like ${A}. It sends straight after.`);
      return;
    }
    if (lt === "wrong-wallet") return P(In());
    if (lt === "link") return P("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (_t() && Nt("standalone")) return P("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (lt === "fund") return P("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (lt === "over") return P("Return the excess first: the listening wallet holds more than 1 STX.");
    if (W) {
      await cr(!0);
      const kn = Qt();
      if (St(kn))
        return t.changed(), P(Uh);
    }
    if (lt !== "ready" || !ft) return P("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(s != null && s.session)) return P("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!E) return P("Pay-per-play is running in another tab. Like from that tab.");
    const at = be(rt()).find((kn) => kn.kind === "like" && kn.song === w.song);
    if (at && Ks.includes(at.status))
      return P(`Your last like for ${A} is still on its way. It can change again once it confirms.`);
    if (l) return P("One like at a time: your last one is still being sent.");
    if ((at == null ? void 0 : at.status) === "confirmed" && t.now() - (at.confirmedAt ?? 0) < F6)
      return P(`Your like for ${A} has only just confirmed. Try again in a moment.`);
    let zt;
    g = !0;
    try {
      zt = t.likeState ? (await t.likeState(ft, w.song)).by : w.likedBy ?? [];
    } catch {
      zt = w.likedBy;
    } finally {
      g = !1;
    }
    if (!zt) return P(`Could not check ${A} right now. Try the heart again.`);
    const se = rt(), Te = ((at == null ? void 0 : at.status) === "confirmed" && typeof at.liked == "boolean" && t.now() - (at.confirmedAt ?? at.created) < 5 * 6e4 ? at.liked : void 0) ?? zt.includes(se);
    if (!Te && zt.some((kn) => kn !== se)) return P(_t() ? `${A} was liked from another wallet of yours. Unlike it there.` : `${A} was liked from your main wallet${zt.includes(V) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await hc({ song: w.song, liked: !Te, title: w.title, artist: w.artist });
  }
  async function hc(w) {
    var W, J, V;
    if (l) {
      Ft("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const A = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`, P = t.wait ?? ((lt) => new Promise((ft) => setTimeout(ft, lt)));
    try {
      Ft(`${w.liked ? "Liking" : "Unliking"} ${A}…`);
      const lt = t.now() + 12e4;
      for (; d || (yt() ? be(rt()).some((Te) => Ks.includes(Te.status)) : Ge().length); ) {
        if (t.now() > lt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await P(5e3), await rn(!0);
      }
      if (!yt() && Gt() !== "ready" || (s == null ? void 0 : s.state) !== "unlocked" || !s.session) throw new Error("Paying stopped before the like was sent.");
      const ft = rt(), { balance: at, nonce: zt } = await t.chain.account(ft);
      if (yt() ? c = { for: ft, value: at, at: t.now() } : (o = at, a = t.now()), St(at)) throw new Error(Uh);
      const se = await i.request("listening.signLike", {
        song: w.song,
        liked: w.liked,
        fee: jc.toString(),
        nonce: zt.toString(),
        balance: at.toString()
      }), on = {
        id: Gc(),
        address: ft,
        kind: "like",
        core: 0,
        song: w.song,
        liked: w.liked,
        recipient: "",
        amount: "0",
        fee: jc.toString(),
        nonce: zt.toString(),
        created: t.now(),
        status: "signed",
        raw: se.raw,
        txid: se.txid,
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(on), Bt(on);
      try {
        await t.chain.broadcast(se.raw, se.txid), Bt({ ...on, status: "pending" }), b = `${w.liked ? "♥ Liked" : "Unliked"} ${A}`, L = "";
        try {
          (W = t.likeSent) == null || W.call(t, w.song, w.liked);
        } catch {
        }
      } catch (Te) {
        if (Bt({ ...on, status: Zi(Te) ? "failed" : "unknown", note: Te.message, ...Zi(Te) ? { raw: void 0 } : {} }), L = Te.message, Zi(Te)) try {
          (J = t.likeFailed) == null || J.call(t, w.song);
        } catch {
        }
      }
      s = await Pe(i);
    } catch (lt) {
      L = "Like not sent: " + (lt instanceof Error ? lt.message : "the listening wallet is unavailable");
      try {
        (V = t.likeFailed) == null || V.call(t, w.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), Hs();
    }
  }
  return { snapshot: en, refresh: rn, onListened: fc, heart: dc, toggleLike: Ds, ...Wn };
}
const Iy = ["Connect", "Passkey", "Link & fund", "Listen"], ky = ["Passkey", "Add 1 STX", "Listen"], Jl = (t) => t ? ky : Iy;
function z6(t) {
  if (t.solo) return R6(t);
  const e = Iy.length, n = (r, i, s = !1) => ({ at: r, blocked: s, caption: r >= e ? i : `Step ${r + 1} of ${e} · ${i}` });
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
      const r = t.entries.filter((i) => i.kind === "play");
      return r.some((i) => i.status === "confirmed") ? n(e, "Paid plays are taking place") : r.some((i) => ["signed", "pending", "unknown"].includes(i.status)) ? n(3, "first paid play sent, confirming") : n(3, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function R6(t) {
  const e = ky.length, n = (r, i, s = !1) => ({ at: r, blocked: s, caption: r >= e ? i : `Step ${r + 1} of ${e} · ${i}` });
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
      const r = t.entries.filter((i) => i.kind === "play");
      return r.some((i) => i.status === "confirmed") ? n(e, "Paid plays are taking place") : r.some((i) => ["signed", "pending", "unknown"].includes(i.status)) ? n(2, "first paid play sent, confirming") : n(2, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function G6(t, e) {
  return !e || e.at >= Jl(!!t.solo).length || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const K6 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function V6(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !K6(r.id)));
}
const q6 = {}, X6 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, W6 = (t) => {
  const e = q6;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, Y6 = (t) => `/hiro/${t}`, Z6 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, Q6 = (t) => {
  const e = W6(t);
  if (e)
    return [Z6(e)];
  const n = X6[t];
  return typeof window < "u" ? [`${window.location.origin}${Y6(t)}`, ...n.filter((i) => !i.includes("hiro.so"))] : n;
}, J6 = {}, Ph = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, t5 = "xtrata.log.enabled", e5 = "xtrata.log.level", n5 = "xtrata.log.tags", r5 = "xtrata.log.dedupe", ea = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, i5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, s5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, o5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, a5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, c5 = () => {
  const t = J6 ?? {}, e = ea(t5) ?? t.VITE_LOG_ENABLED, n = ea(e5) ?? t.VITE_LOG_LEVEL, r = ea(n5) ?? t.VITE_LOG_TAGS, i = ea(r5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: i5(e),
    level: s5(n) ?? "warn",
    tags: a5(r),
    dedupe: o5(i)
  };
}, l5 = (t, e, n) => !t.enabled || Ph[n] < Ph[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), u5 = (t, e, n, r) => {
  const i = c5();
  if (!l5(i, e, t) || d5(i.dedupe))
    return;
  const s = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(s, r) : o(s);
}, f5 = /* @__PURE__ */ new Set();
let Hh = null;
const d5 = (t, e, n, r, i) => (Hh !== t && (f5.clear(), Hh = t), !1), h5 = (t, e, n) => u5("debug", t, e, n), p5 = {}, g5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, y5 = (t) => {
  const e = p5, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : g5[t];
}, w5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, b5 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return w5.test(n) ? n : null;
}, m5 = (t) => t.replace(/\/+$/, ""), x5 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Oh = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.startsWith("0x") ? t.slice(2) : t;
  if (!e || e.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(e))
    return null;
  let n = "";
  for (let r = 0; r < e.length; r += 2) {
    const i = Number.parseInt(e.slice(r, r + 2), 16);
    if (i < 32 || i > 126)
      return null;
    n += String.fromCharCode(i);
  }
  return n;
}, Qi = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, S5 = (t) => {
  var c, f;
  let e;
  try {
    e = Un(Ev(t));
  } catch {
    return null;
  }
  const n = Qi(e);
  if (!n || n.success === !1)
    return null;
  const r = Qi(n.value), i = Qi(r == null ? void 0 : r.value), s = Qi(i == null ? void 0 : i.value);
  if (!s)
    return null;
  const o = Oh((c = Qi(s.name)) == null ? void 0 : c.value), a = Oh((f = Qi(s.namespace)) == null ? void 0 : f.value);
  return !o || !a ? null : b5(`${o}.${a}`);
}, E5 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${m5(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, i = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [oy(Rg(t.address))]
    }),
    signal: t.signal
  });
  if (!i.ok)
    throw new Error(`BNS primary lookup failed (${i.status})`);
  const s = await i.json();
  return !(s != null && s.okay) || typeof s.result != "string" ? null : S5(s.result);
}, A5 = async (t) => {
  const e = t.address.trim();
  if (!ls(e))
    return null;
  const n = y5(t.network);
  if (!n)
    return null;
  let r = null;
  for (const i of Q6(t.network))
    try {
      return await E5({
        baseUrl: i,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (s) {
      r = s;
    }
  return h5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: x5(r)
  }), null;
};
function v5(t, e, n = {}) {
  const r = n.retryAfterMs ?? 3e4, i = n.now ?? Date.now, s = /* @__PURE__ */ new Map(), o = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => t(a)).then((f) => {
      c.pending = !1, f && (c.name = f, e());
    }).catch(() => {
      c.pending = !1, c.failedAt = i();
    });
  };
  return {
    get(a) {
      if (!a) return null;
      let c = s.get(a);
      return c ? !c.pending && c.name === null && c.failedAt !== void 0 && i() - c.failedAt >= r && o(a, c) : (c = { name: null, pending: !1 }, s.set(a, c), o(a, c)), c.name;
    }
  };
}
const Dh = Object.freeze({
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
function $5(t, e = "") {
  return Object.hasOwn(Dh, String(t)) ? Dh[String(t)] : e;
}
const Fh = Object.freeze({ 312: "Smalltalk", 315: "Entertainment" });
function I5(t, e = "") {
  return Object.hasOwn(Fh, String(t)) ? Fh[String(t)] : e;
}
const k5 = 100000n, jh = 1000000n, L5 = 3000n, C5 = (t, e) => `${t}#gift=${e}`, T5 = 100, Kc = (t, e = Ao) => t <= xn ? 0 : Number((t - xn) / ir(e)), zh = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), Ly = "xtrata.xyz/radio/gifts", B5 = "Create Xtrata radio gift links paid from the gift treasury", M5 = (t) => ({
  domain: Ii({ name: $e(Ly), version: $e("1"), "chain-id": Dn(1) }),
  message: Ii({
    purpose: $e(B5),
    admin: $e(t.admin),
    count: Dn(t.count),
    amount: Dn(BigInt(t.amount)),
    label: $e(t.label),
    issued: Dn(t.issued),
    ...t.player ? { player: $e(t.player) } : {}
  })
}), Rh = 40, N5 = "Create an Xtrata radio gift player", _5 = /^[^\u0000-\u001f\u007f<>]+$/u;
function Gh(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && _5.test(t) : !n;
}
function U5(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!Gh(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!Gh(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > Rh) throw new Error(`A player holds 1 to ${Rh} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const P5 = (t) => V0(Q0(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), H5 = (t) => ({
  domain: Ii({ name: $e(Ly), version: $e("1"), "chain-id": Dn(1) }),
  message: Ii({
    purpose: $e(N5),
    admin: $e(t.admin),
    player: $e(t.hash),
    issued: Dn(t.issued)
  })
}), Kh = (t, e = Ao) => xn + BigInt(t) * ir(e), Vh = [300, 500, 1e3], qh = 1800, Vc = /* @__PURE__ */ new Map();
async function Cy(t) {
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
async function O5(t) {
  const e = navigator;
  if (e.share)
    try {
      return await e.share(t), { label: "Shared ✓", ok: !0 };
    } catch (n) {
      if ((n == null ? void 0 : n.name) === "AbortError") return null;
    }
  return await Cy(t.url) ? { label: "Link copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 };
}
function Ty(t, e, n, r, i) {
  const s = document.createElement("button");
  return s.type = "button", s.className = r, s.dataset.feedback = t, (() => {
    const a = Vc.get(t), c = !!a && a.until > Date.now();
    s.textContent = c ? a.label : e, s.classList.toggle("is-done", c && a.ok), s.classList.toggle("is-failed", c && !a.ok);
  })(), s.onclick = async () => {
    const a = await n();
    if (a) {
      Vc.set(t, { ...a, until: Date.now() + qh });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Vc.delete(t), i();
      }, qh + 50);
    }
  }, s;
}
const as = (t, e, n, r, i) => Ty(t, e, async () => await Cy(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, i), Qr = "xtrata.radio.gift.incoming.v1", Xh = (t) => "xtrata.radio.gift.mine.v1:" + t, ct = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Hr = (t, e, n = "") => {
  const r = ct("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, Vs = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, Ji = (t) => gn(t).replace(/\.?0+$/, "");
function D5(t) {
  let e = null;
  const n = (() => {
    try {
      const T = new URL(location.href), G = new URLSearchParams(T.hash.slice(1)).get("gift") ?? T.searchParams.get("gift");
      return G !== null && (T.searchParams.delete("gift"), history.replaceState(null, "", T.pathname + (T.search || ""))), zh(G) ? G : null;
    } catch {
      return null;
    }
  })(), r = (() => {
    try {
      const T = JSON.parse(t.store.get(Qr) || "null");
      return zh(T == null ? void 0 : T.code) ? T.code : null;
    } catch {
      return null;
    }
  })(), i = n ?? r;
  i && (e = { code: i }, t.store.set(Qr, JSON.stringify({ code: i, at: t.now() })), fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (T) => {
    const G = await T.json().catch(() => ({}));
    if (!T.ok)
      throw T.status === 404 && t.store.set(Qr, null), new Error((G == null ? void 0 : G.error) || "Could not check your gift right now. Reload to try again.");
    const R = G;
    e = { ...e, view: R }, ["claimed", "expired", "refunding", "refunded"].includes(R.status) && t.store.set(Qr, null), t.changed();
  }).catch((T) => {
    e = { ...e, error: T.message }, t.changed();
  }));
  const s = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, o = () => {
    e = null, t.store.set(Qr, null), t.changed();
  }, a = (T) => T.from ? t.who(T.from) : T.label ? `Xtrata Radio · ${T.label}` : "Xtrata Radio";
  let c = {};
  const f = (T) => {
    if (c.box) return c.box;
    const G = ct("div", "", "ppp-gift-check");
    c.box = G;
    const R = () => {
      const ot = window.turnstile;
      !ot || c.rendered || (c.rendered = !0, ot.render(G, { sitekey: T, callback: (rt) => {
        c.token = rt, t.changed();
      }, "expired-callback": () => {
        c.token = void 0;
      } }));
    };
    if (window.turnstile) R();
    else {
      const ot = document.createElement("script");
      ot.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", ot.async = !0, ot.onload = R, document.head.append(ot);
    }
    return G;
  };
  let d;
  async function l(T) {
    var ot, rt, yt, Qt, St;
    if (!e || e.claiming || !T.listening) return;
    const G = !!((ot = e.view) != null && ot.player);
    if (G && !T.root) return;
    e.claiming = !0, e.error = void 0, t.changed();
    const R = async (Vt) => {
      const Ht = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: c.token, ...Vt })
      });
      return { res: Ht, r: await Ht.json().catch(() => ({})) };
    };
    try {
      let Vt = 0, Ht = T.listening, _t;
      if (G) {
        const u = Number((rt = await t.json("/radio/gift/slots?root=" + encodeURIComponent(T.root))) == null ? void 0 : rt.next);
        if (!Number.isSafeInteger(u) || u < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Vt = u;
        for (let m = 0; ; m++) {
          const v = await t.album.bind(Vt);
          if (Ht = v.address, _t = await R({ wallet: Ht, binding: v }), _t.res.status === 409 && /just taken/.test(((yt = _t.r) == null ? void 0 : yt.error) || "") && m < 5) {
            Vt += 1;
            continue;
          }
          break;
        }
      } else _t = await R({ wallet: Ht });
      const { res: wt, r: Lt } = _t;
      if (wt.status === 503 && /sending another gift/.test((Lt == null ? void 0 : Lt.error) || "")) {
        e.waiting = !0, clearTimeout(d), d = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!wt.ok)
        throw (wt.status === 404 || wt.status === 410 || wt.status === 409 && /already had a gift|brand-new/.test((Lt == null ? void 0 : Lt.error) || "")) && t.store.set(Qr, null), new Error((Lt == null ? void 0 : Lt.error) || `Could not claim the gift (${wt.status}).`);
      e.done = !0, t.store.set(Qr, null), G ? await t.album.arrived(Vt, Ht, Lt.txid, BigInt(Lt.amount)) : t.giftSent(Lt.txid, BigInt(Lt.amount));
    } catch (Vt) {
      e.error = Vt.message, c.token = void 0;
      try {
        (St = (Qt = window.turnstile) == null ? void 0 : Qt.reset) == null || St.call(Qt, c.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let g = null;
  function h(T) {
    if (!T.listening || !T.depositPending || T.step !== "fund")
      return g = null, [];
    if (!g || g.wallet !== T.listening || t.now() - g.at > 3e4) {
      const G = T.listening;
      g = { ...(g == null ? void 0 : g.wallet) === G ? g : {}, wallet: G, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(G)).then((R) => {
        var ot, rt;
        (g == null ? void 0 : g.wallet) === G && (g.state = (ot = R == null ? void 0 : R.gift) == null ? void 0 : ot.state, g.problem = ((rt = R == null ? void 0 : R.gift) == null ? void 0 : rt.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    return g.state === "sending" && g.problem ? [ct("p", `🎁 Your gift is waiting to go out (${g.problem}). It is retried automatically.`, "ppp-warn")] : [];
  }
  function x(T, G) {
    var St, Vt;
    const R = G.player, ot = BigInt(G.amount), rt = [ct("p", `🎁 ${a(G)} sent you “${R.title}”${R.subtitle ? ` by ${R.subtitle}` : ""}: ${R.tracks.length} ${R.tracks.length === 1 ? "song" : "songs"} and ${Kc(ot).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!T.root && ["fund", "ready", "over", "link"].includes(T.step)))
      return rt.push(ct("p", T.step === "intro" ? "Tap below: your passkey makes a listening wallet, and the album arrives in its own wallet. You can keep as many albums as you like." : T.step === "locked" ? "Unlock your listening wallet and the album arrives in its own wallet." : "Open your listening wallet and the album arrives in its own wallet.", "ppp-mute")), rt;
    if (T.walletCannotAlbums)
      return rt.push(ct("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), rt;
    const Qt = (Vt = (St = T.gate) == null ? void 0 : St.gifts) == null ? void 0 : Vt.turnstileSiteKey;
    return Qt && !c.token ? rt.push(ct("p", "One quick check and it is yours:", "ppp-mute"), f(Qt)) : !e.claiming && !e.error && !e.waiting && l(T), (e.claiming || e.waiting) && rt.push(ct("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : "Sending your album…", "ppp-cyan")), e.error && rt.push(ct("p", e.error, "ppp-bad"), Hr("Try again", () => {
      e.error = void 0, l(T);
    })), rt;
  }
  function b(T) {
    var _t, wt;
    const G = h(T);
    if (!e || ["off", "elsewhere"].includes(T.step)) return G;
    const R = e.view;
    if (e.error && !R) return [ct("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!R) return [ct("p", "🎁 Checking your gift…", "ppp-mute")];
    if (e.done) return G;
    if (R.status === "claimed" || R.status === "claiming") return [ct("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(R.status)) return [ct("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (R.status === "pending-deposit") return [ct("p", `🎁 ${a(R)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (R.player) return [...x(T, R), ...G];
    if (!!T.listening && (!(T.createdHere || T.brandNew) || !!T.linked || !!T.creditedTo || (T.balance ?? 0n) > 0n || T.entries.length > 0))
      return [ct("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), Hr("Forget this gift link here", o, "quiet")];
    const rt = BigInt(R.amount), yt = Kc(rt).toLocaleString(), St = [ct(
      "p",
      `🎁 ${a(R)} sent you ${Ji(rt)} STX of on-chain music: about ${yt} paid plays.`,
      "ppp-gift"
    )], Vt = !!T.listening && (T.createdHere || T.brandNew) && !T.linked && !T.creditedTo && T.step === "fund" && (T.balance ?? 1n) === 0n && !T.depositPending && !T.entries.length, Ht = (wt = (_t = T.gate) == null ? void 0 : _t.gifts) == null ? void 0 : wt.turnstileSiteKey;
    return Vt ? (Ht && !c.token ? St.push(ct("p", "One quick check and it is yours:", "ppp-mute"), f(Ht)) : !e.claiming && !e.error && !e.waiting && l(T), (e.claiming || e.waiting) && St.push(ct("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : "Sending your gift…", "ppp-cyan")), e.error && St.push(ct("p", e.error, "ppp-bad"), Hr("Try again", () => {
      e.error = void 0, l(T);
    }))) : T.step === "intro" ? St.push(ct("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : T.listening && T.linked ? St.push(ct("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), Hr("Forget this gift link here", o, "quiet")) : T.listening && (T.balance ?? 0n) > 0n && St.push(ct("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), Hr("Forget this gift link here", o, "quiet")), St;
  }
  async function L(T, G, R) {
    var ot;
    try {
      const rt = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(T));
      if ((ot = rt == null ? void 0 : rt.gift) != null && ot.returnTo) return { ok: !0, funder: rt.gift.returnTo, txId: rt.gift.txid ?? void 0, amount: rt.gift.amount, distinct: 1 };
    } catch {
      if (R) return { ok: !1 };
    }
    return G();
  }
  const H = ct("div", "", "ppp-gift-fold");
  let U = 250000n, p = "", $ = "", I = null;
  const z = (T) => {
    try {
      const G = JSON.parse(t.store.get(Xh(T)) || "[]");
      return Array.isArray(G) ? G : [];
    } catch {
      return [];
    }
  }, tt = (T, G) => t.store.set(Xh(T), JSON.stringify(G.slice(0, 50)));
  let F = 0;
  async function Y(T) {
    const G = z(T);
    for (const R of G)
      if (!(R.view && ["claimed", "refunded", "expired"].includes(R.view.status)))
        try {
          R.view = !R.view || R.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: R.id, ...R.txid ? { txid: R.txid } : {} }) }) : await t.json("/radio/gift?id=" + R.id), R.error = void 0;
        } catch (ot) {
          R.error = ot.message;
        }
    tt(T, G), t.changed();
  }
  async function S(T) {
    if (p) return;
    p = "Starting your gift…", $ = "", t.changed();
    let G = null;
    try {
      G = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: T, amount: U.toString() }) });
      const R = z(T);
      R.unshift({ id: G.id, code: G.code, amount: U.toString(), at: t.now() }), tt(T, R), p = "Approve the gift in your wallet…", t.changed();
      const ot = await t.pay(T, G.depositTo, BigInt(G.deposit), G.memo), rt = z(T), yt = rt.find((Qt) => Qt.id === G.id);
      yt && (yt.txid = ot, yt.view = { status: "pending-deposit", amount: U.toString(), source: "friend", from: T, label: "", expires: 0 }), tt(T, rt), $ = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", Y(T);
    } catch (R) {
      $ = R.message || "Not sent.";
    } finally {
      p = "", t.changed();
    }
  }
  const C = (T) => "xtrata.radio.gift.players.v1:" + T, _ = (T) => {
    try {
      const G = JSON.parse(t.store.get(C(T)) || "[]");
      return Array.isArray(G) ? G.filter((R) => R && /^[0-9a-f]{16}$/.test(R.id)) : [];
    } catch {
      return [];
    }
  };
  async function B(T, G) {
    var R;
    if (!p) {
      p = "Checking the player…", $ = "", t.changed();
      try {
        const ot = G.tracks.split(/[\s,]+/).filter(Boolean).map((Ht) => Number(Ht.replace(/^#/, ""))), rt = U5({ title: G.title.trim(), subtitle: G.subtitle.trim(), tracks: ot, cover: (R = G.cover) != null && R.trim() ? Number(G.cover.trim().replace(/^#/, "")) : null });
        p = "Sign in your wallet…", t.changed();
        const yt = { admin: T, hash: P5(rt), issued: t.now() }, Qt = await t.sign(T, H5(yt));
        p = "Making the player…", t.changed();
        const St = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: rt, request: yt, signature: Qt }) }), Vt = _(T).filter((Ht) => Ht.id !== St.id);
        Vt.unshift({ id: St.id, title: St.title, tracks: St.tracks }), t.store.set(C(T), JSON.stringify(Vt.slice(0, 30))), $ = `${St.existing ? "That player already exists" : "Player made"} ✓ “${St.title}” · ${St.tracks} songs. Pick it below for a campaign.`;
      } catch (ot) {
        $ = ot.message || "Not made.";
      } finally {
        p = "", t.changed();
      }
    }
  }
  async function X(T, G, R, ot, rt) {
    if (!p) {
      p = "Sign in your wallet…", $ = "", I = null, t.changed();
      try {
        const yt = { admin: T, count: G, amount: R.toString(), label: ot, issued: t.now(), ...rt ? { player: rt } : {} }, Qt = await t.sign(T, M5(yt));
        p = "Making links…", t.changed();
        const St = await t.json("/radio/gift/campaign", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ request: yt, signature: Qt }) });
        I = { codes: St.codes, amount: St.amount };
      } catch (yt) {
        $ = yt.message || "Not made.";
      } finally {
        p = "", t.changed();
      }
    }
  }
  const K = (T, G) => C5(T || location.origin + "/radio.html", G), gt = (T) => O5({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: T }), ht = ct("input");
  ht.type = "range", ht.min = String(k5), ht.max = String(jh), ht.step = "50000", ht.value = String(U), ht.setAttribute("aria-label", "Gift amount");
  const ye = ct("p", "", "ppp-gift-amount"), E = Hr("", () => {
    const T = t.main();
    T && S(T);
  }, "primary"), M = () => {
    ye.textContent = kt(), E.textContent = `Gift ${Ji(U)} STX`;
  };
  ht.oninput = () => {
    U = BigInt(ht.value), M();
  };
  const kt = () => `${Ji(U)} STX · about ${Kc(U).toLocaleString()} paid plays · you pay ${Ji(U + L5)} STX with the network fee`;
  M();
  const pt = ct("input");
  pt.type = "number", pt.min = "1", pt.max = String(T5), pt.value = "10", pt.setAttribute("aria-label", "How many links");
  const ut = ct("input");
  ut.type = "number", ut.min = "0.1", ut.max = "1", ut.step = "0.05", ut.value = String(Number(Kh(Vh[0])) / 1e6), ut.setAttribute("aria-label", "STX per link");
  const xt = ct("input");
  xt.maxLength = 60, xt.placeholder = "Title, e.g. Proof of Sound", xt.setAttribute("aria-label", "Player title");
  const Pt = ct("input");
  Pt.maxLength = 80, Pt.placeholder = "Artist (optional)", Pt.setAttribute("aria-label", "Player subtitle");
  const Nt = ct("textarea");
  Nt.rows = 3, Nt.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Nt.setAttribute("aria-label", "Songs");
  const Xt = ct("input");
  Xt.inputMode = "numeric", Xt.placeholder = "Cover inscription number (optional), shown when the album loads", Xt.setAttribute("aria-label", "Cover inscription");
  const be = ct("select");
  be.setAttribute("aria-label", "Gift player");
  const Bt = ct("select");
  Bt.setAttribute("aria-label", "Plays per link");
  for (const T of Vh) Bt.append(Vs(`${T.toLocaleString()} plays`, String(Kh(T))));
  Bt.append(Vs("Max (1 STX)", String(jh)), Vs("Custom STX", "")), Bt.onchange = () => {
    Bt.value && (ut.value = String(Number(Bt.value) / 1e6));
  };
  const Ae = ct("input");
  Ae.maxLength = 40, Ae.placeholder = "Label, e.g. Launch week", Ae.setAttribute("aria-label", "Campaign label");
  function tn(T) {
    var rt, yt, Qt, St, Vt;
    const G = (rt = T.gate) == null ? void 0 : rt.gifts;
    if (!(G != null && G.enabled) || ["off", "elsewhere", "unsupported"].includes(T.step)) return null;
    const R = t.main(), ot = [ct("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!R)
      ot.push(ct("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      E.disabled = !!p, ot.push(ht, ye, E), t.now() - F > 3e4 && (F = t.now(), Y(R));
      const Ht = z(R);
      if (Ht.length) {
        const _t = ct("ul", "", "ppp-gift-list");
        for (const wt of Ht.slice(0, 10)) {
          const Lt = (yt = wt.view) == null ? void 0 : yt.status, u = wt.error ? wt.error : !Lt || Lt === "pending-deposit" ? wt.txid ? "payment confirming…" : "waiting for your payment" : Lt === "live" ? "ready to share" : Lt === "claiming" || Lt === "claimed" ? "claimed ✓" : Lt === "refunding" ? "expired · refund on its way" : Lt === "refunded" ? "expired · refunded to you" : Lt, m = ct("li");
          if (m.append(ct("span", `${Ji(BigInt(wt.amount))} STX`, "t"), ct("span", u, ((Qt = wt.view) == null ? void 0 : Qt.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((St = wt.view) == null ? void 0 : St.status) === "live") {
            const v = K(((Vt = T.gate) == null ? void 0 : Vt.radioUrl) ?? null, wt.code);
            m.append(as("gift-copy:" + wt.id, "Copy link", () => v, "tiny", t.changed), Ty("gift-share:" + wt.id, "Share", () => gt(v), "tiny", t.changed));
          }
          _t.append(m);
        }
        ot.push(_t);
      }
      if (G.admin) {
        const _t = Hr("Sign and make links", () => {
          const v = BigInt(Math.round(Number(ut.value) * 1e6));
          X(R, Number(pt.value), v, Ae.value.trim(), be.value || void 0);
        }), wt = ct("div", "", "ppp-gift-admin"), Lt = (v, O) => {
          const et = ct("label", v);
          return et.append(O), et;
        }, u = _(R), m = be.value;
        if (be.replaceChildren(Vs("No player (plain gift)", ""), ...u.map((v) => Vs(`${v.title} · ${v.tracks} songs`, v.id))), u.some((v) => v.id === m) && (be.value = m), wt.append(
          ct("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
          xt,
          Pt,
          Nt,
          Xt,
          Hr("Sign and make player", () => void B(R, { title: xt.value, subtitle: Pt.value, tracks: Nt.value, cover: Xt.value })),
          ct("p", "Campaign links (admin) · paid from the gift treasury", "ppp-cyan"),
          Lt("Player ", be),
          Lt("Plays each ", Bt),
          Lt("Links ", pt),
          Lt("STX each ", ut),
          Ae,
          _t
        ), I) {
          const v = I.codes.map((et) => {
            var bt;
            return K(((bt = T.gate) == null ? void 0 : bt.radioUrl) ?? null, et);
          }).join(`
`), O = ct("textarea");
          O.readOnly = !0, O.value = v, O.rows = Math.min(8, I.codes.length), wt.append(ct("p", `${I.codes.length} links, ${Ji(BigInt(I.amount))} STX each. Copy them now: they are not shown again.`, "ppp-warn"), O, as("campaign-copy", "Copy all", () => v, "tiny", t.changed));
        }
        ot.push(wt);
      }
    }
    return p && ot.push(ct("p", p, "ppp-cyan")), $ && ot.push(ct("p", $, /✓/.test($) ? "ppp-ok" : "ppp-warn")), H.replaceChildren(...ot), H;
  }
  return { banner: b, funder: L, renderFold: tn, liveGift: s, setAside: o, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null };
}
const F5 = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function j5(t) {
  if (!Array.isArray(t)) return [];
  const e = [];
  for (const n of t) {
    if (!n || !Number.isSafeInteger(n.slot) || n.slot < 1 || typeof n.address != "string") continue;
    const r = n.player, i = r && typeof r.id == "string" && typeof r.title == "string" && Array.isArray(r.tracks) ? r : null;
    i && e.push({
      slot: n.slot,
      address: n.address,
      state: n.state === "arrived" ? "arrived" : "sending",
      amount: String(n.amount ?? "0"),
      label: typeof n.label == "string" ? n.label : "",
      from: typeof n.from == "string" ? n.from : null,
      source: String(n.source ?? ""),
      player: i
    });
  }
  return e;
}
const z5 = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).flatMap((i) => [i.title, i.artist])].filter(Boolean).join(" ").toLowerCase();
};
function R5(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((s) => (!e.pinnedOnly || e.pins.has(s.slot)) && (() => {
    const o = z5(s);
    return n.every((a) => o.includes(a));
  })()), i = {
    recent: (s, o) => (e.recents[o.slot] ?? 0) - (e.recents[s.slot] ?? 0) || o.slot - s.slot,
    newest: (s, o) => o.slot - s.slot,
    oldest: (s, o) => s.slot - o.slot,
    title: (s, o) => {
      var a, c;
      return (((a = s.player) == null ? void 0 : a.title) ?? "").localeCompare(((c = o.player) == null ? void 0 : c.title) ?? "") || s.slot - o.slot;
    }
  };
  return r.sort((s, o) => Number(e.pins.has(o.slot)) - Number(e.pins.has(s.slot)) || i[e.sort](s, o));
}
function G5(t, e = 100) {
  const n = Object.entries(t).sort((r, i) => i[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, i]) => [Number(r), i]));
}
const ts = 12, K5 = 5e3, Fe = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, es = (t, e, n = "") => {
  const r = Fe("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function V5(t) {
  let e, n = [], r = 0, i = !1, s = !1, o = -1 / 0, a = "", c = "recent", f = !1, d = ts;
  const l = Fe("div", "", "ppp-shelf-box"), g = (_) => "xtrata.radio.shelf.pins.v1:" + _, h = (_) => "xtrata.radio.shelf.recent.v1:" + _, x = (_, B) => {
    try {
      return JSON.parse(t.store.get(_) || "null") ?? B;
    } catch {
      return B;
    }
  }, b = (_) => new Set(x(g(_), []).filter((B) => Number.isSafeInteger(B))), L = (_) => {
    const B = x(h(_), {}), X = {};
    for (const [K, gt] of Object.entries(B)) Number.isSafeInteger(Number(K)) && typeof gt == "number" && (X[Number(K)] = gt);
    return X;
  };
  async function H(_) {
    if (!i) {
      i = !0, s = !1;
      try {
        const B = [];
        let X = 0, K = 0;
        for (let gt = 0; gt < K5 / 100 + 1; gt++) {
          const ht = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(_)}&after=${X}&limit=100`);
          if (B.push(...j5(ht == null ? void 0 : ht.shelf)), K = Number(ht == null ? void 0 : ht.total) || B.length, !(ht != null && ht.next) || !Number.isSafeInteger(ht.next)) break;
          X = ht.next;
        }
        _ === e && (n = B, r = K, o = t.now());
      } catch {
        s = !0;
      } finally {
        i = !1, t.changed();
      }
    }
  }
  const U = () => {
    o = -1 / 0;
  }, p = Fe("input");
  p.type = "search", p.placeholder = "Search title, artist or #", p.setAttribute("aria-label", "Search your albums"), p.oninput = () => {
    a = p.value, d = ts, t.changed();
  };
  const $ = Fe("select");
  $.setAttribute("aria-label", "Sort albums");
  for (const _ of F5) {
    const B = document.createElement("option");
    B.value = _.value, B.textContent = _.label, $.append(B);
  }
  $.onchange = () => {
    c = $.value, d = ts, t.changed();
  };
  const I = es("", () => {
    f = !f, d = ts, t.changed();
  }, "tiny"), z = Fe("div", "", "ppp-shelf-tools");
  z.append(p, $, I);
  const tt = Fe("div"), F = Fe("div");
  function Y(_) {
    const B = _.step === "off" || _.step === "elsewhere" ? void 0 : _.root;
    if (B !== e && (e = B, n = [], r = 0, o = -1 / 0, d = ts), !B || _.walletCannotAlbums) return null;
    if (!i && t.now() - o > 5 * 6e4 && H(B), !n.length)
      return s ? (F.replaceChildren(Fe("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), es("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(F), l) : null;
    const X = b(B), K = L(B), gt = R5(n, { query: a, sort: c, pinnedOnly: f, pins: X, recents: K });
    p.value !== a && (p.value = a), $.value = c, I.textContent = f ? "★ Pinned only" : "☆ Pinned only", I.setAttribute("aria-pressed", String(f));
    const ht = [];
    if (_.slot > 0 && ht.push(es("← My player", () => t.open(0), "quiet")), !gt.length) ht.push(Fe("p", "No album matches that.", "ppp-mute"));
    else {
      const ye = Fe("ul", "", "ppp-shelf-list");
      for (const E of gt.slice(0, d)) {
        const M = Fe("li", "", E.slot === _.slot ? "now" : ""), kt = X.has(E.slot), pt = es(kt ? "★" : "☆", () => {
          const Nt = new Set(X);
          kt ? Nt.delete(E.slot) : Nt.add(E.slot), t.store.set(g(B), JSON.stringify([...Nt])), t.changed();
        }, "tiny");
        pt.setAttribute("aria-label", kt ? `Unpin ${E.player.title}` : `Pin ${E.player.title}`);
        const ut = [E.player.subtitle, `${E.player.tracks.length} ${E.player.tracks.length === 1 ? "song" : "songs"}`, E.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), xt = E.slot === _.slot, Pt = es(xt ? "Playing" : "Play", () => {
          t.store.set(h(B), JSON.stringify(G5({ ...K, [E.slot]: t.now() }))), t.open(E.slot);
        }, xt ? "tiny" : "tiny primary");
        Pt.disabled = xt, M.append(pt, Fe("span", E.player.title, "t"), Fe("span", " " + ut, "ppp-mute"), Pt), ye.append(M);
      }
      ht.push(ye), gt.length > d && ht.push(es(`Show more (${gt.length - d} left)`, () => {
        d += ts, t.changed();
      }, "quiet"));
    }
    return s && ht.push(Fe("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), tt.replaceChildren(...ht), l.firstChild !== z && l.replaceChildren(z, tt), l;
  }
  return { render: Y, invalidate: U, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const _ = L(e), B = [...n].filter((X) => X.player).sort((X, K) => (_[K.slot] ?? 0) - (_[X.slot] ?? 0) || K.slot - X.slot)[0];
    return B ? { slot: B.slot, title: B.player.title } : null;
  } };
}
const q5 = [
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
function X5(t) {
  for (const [e, n] of q5) if (n.test(t)) return e;
  return null;
}
const By = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), My = (t) => /Android/.test(t);
function W5(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : By(e) ? "x-safari-" + n.href : My(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const Y5 = (t) => By(t) ? "Safari" : My(t) ? "Chrome" : "your browser", Wh = document.getElementById("ppp");
Wh && Z5(Wh);
function Z5(t) {
  var Lt;
  const e = pw(), n = (u) => t.querySelector(u), r = n(".ppp-frame");
  let i = null;
  const s = async (u, m) => {
    const v = await fetch(u, { cache: "no-store", ...m, signal: AbortSignal.timeout(15e3) }), O = await v.json().catch(() => ({}));
    if (!v.ok) throw new Error((O == null ? void 0 : O.error) || `Request failed (${v.status}).`);
    return O;
  }, o = j6({
    now: Date.now,
    main: () => {
      const u = e.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    config: (u) => s("/radio/listening-wallet/config?main=" + encodeURIComponent(u || "")),
    links: async (u) => (await s("/radio/listening-wallet/link?main=" + encodeURIComponent(u))).links ?? [],
    mainOf: async (u) => {
      var v;
      const m = (await s("/radio/listening-wallet/link?listening=" + encodeURIComponent(u))).links;
      return ((v = m == null ? void 0 : m.find((O) => O.listening === u)) == null ? void 0 : v.main) ?? null;
    },
    saveLink: async (u) => {
      await s("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(u) });
    },
    bridge: async (u) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${u}; publickey-credentials-create ${u}`), i.referrerPolicy = "no-referrer";
      const m = new Promise((bt, Jt) => {
        i.addEventListener("load", () => bt(), { once: !0 }), setTimeout(() => Jt(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      i.src = u + "/", r.replaceChildren(i), await m;
      const v = new sw({ walletOrigin: u, frame: i, timeoutMs: 30 * 6e4 }), O = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), et = (bt, Jt) => O.has(bt) ? v.request(bt, Jt) : Promise.race([
        v.request(bt, Jt),
        new Promise((te, Se) => setTimeout(() => Se(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await et("listening.status"), { request: et };
    },
    chain: {
      verify: S6,
      balance: A6,
      account: E6,
      owner: v6,
      broadcast: $6,
      transaction: I6,
      confirmedNonce: async (u) => {
        const m = await Kr(`/v2/accounts/${u}?proof=0`);
        if (!Number.isSafeInteger(m == null ? void 0 : m.nonce) || m.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(m.nonce);
      }
    },
    signWithMain: (u, m) => Ch({ ...m, network: "mainnet", stxAddress: u }),
    deposit: (u, m, v) => new Promise((O, et) => vh({
      recipient: m,
      amount: v.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: u,
      network: new qc(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (bt) => O(bt.txId || ""),
      onCancel: () => et(new Error("Deposit cancelled. Nothing was sent.")),
      onError: et
    })),
    validate: k6,
    tabLock: (u) => new Promise((m) => {
      const v = navigator.locks;
      if (!(v != null && v.request)) {
        m(!0);
        return;
      }
      v.request("xtrata-ppp:" + u, { ifAvailable: !0 }, async (O) => {
        m(!!O), O && await new Promise(() => {
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
      set: (u, m) => {
        try {
          localStorage.setItem(u, m);
        } catch {
        }
      }
    },
    changed: () => Ht(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (u) => {
      var m, v;
      return a.funder(u, () => N6(u, Kr), !!((v = (m = o.snapshot().gate) == null ? void 0 : m.gifts) != null && v.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (u) => {
      const m = await s("/radio/gift/for?wallet=" + encodeURIComponent(u)), v = m == null ? void 0 : m.gift;
      if (!v) return null;
      if (typeof v.returnTo != "string" || typeof v.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: v.returnTo, from: typeof v.from == "string" ? v.from : null, source: String(v.source ?? ""), amount: String(v.amount ?? "0"), treasury: v.treasury, state: v.state === "sending" ? "sending" : "arrived", player: v.player ?? null };
    },
    history: (u, m) => P6(u, (v) => Kr(v), m),
    likesChanged: () => {
      var u, m;
      (m = (u = window.XtrataRadio) == null ? void 0 : u.refreshLikes) == null || m.call(u);
    },
    likeState: async (u, m) => {
      const v = await s("/radio/chain-likes?" + new URLSearchParams({ wallet: u, ids: String(m) })), O = Array.isArray(v == null ? void 0 : v.rows) ? v.rows.find((et) => (et == null ? void 0 : et.id) === m) : null;
      if (!O || typeof O.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: O.liked, by: Array.isArray(O.by) ? O.by.filter((et) => typeof et == "string") : O.liked ? [u] : [] };
    },
    likeSent: (u, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: u, liked: m } })),
    nameOf: (u) => S(u) ?? void 0,
    likeConfirmed: (u, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: u, liked: m } })),
    likeFailed: (u) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: u } }))
  }), a = D5({
    json: s,
    main: () => {
      const u = e.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    pay: (u, m, v, O) => new Promise((et, bt) => vh({
      recipient: m,
      amount: v.toString(),
      memo: O,
      stxAddress: u,
      network: new qc(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (Jt) => et(Jt.txId || ""),
      onCancel: () => bt(new Error("Gift cancelled. Nothing was sent.")),
      onError: bt
    })),
    sign: (u, m) => Ch({ ...m, network: "mainnet", stxAddress: u }),
    giftSent: (u, m) => o.giftSent(u, m),
    album: { bind: (u) => o.bindAlbum(u), arrived: async (u, m, v, O) => {
      c.invalidate(), await o.albumArriving(u, m, v, O);
    } },
    who: (u) => B(u),
    changed: () => Ht(o.snapshot()),
    store: {
      get: (u) => {
        try {
          return localStorage.getItem(u);
        } catch {
          return null;
        }
      },
      set: (u, m) => {
        try {
          m === null ? localStorage.removeItem(u) : localStorage.setItem(u, m);
        } catch {
        }
      }
    },
    now: Date.now
  }), c = V5({
    json: s,
    open: (u) => {
      o.openAlbum(u);
    },
    store: {
      get: (u) => {
        try {
          return localStorage.getItem(u);
        } catch {
          return null;
        }
      },
      set: (u, m) => {
        try {
          m === null ? localStorage.removeItem(u) : localStorage.setItem(u, m);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => Ht(o.snapshot())
  });
  window.XtrataRadioLikeHandler = (u) => {
    if (!u || !Number.isSafeInteger(u.song) || u.song < 0) return !1;
    ye();
    const m = E(u.song, { title: u.title, artist: u.artist });
    return o.heart({ song: u.song, title: m.title || void 0, artist: m.artist || void 0, likedBy: Array.isArray(u.likedBy) ? u.likedBy : void 0 });
  };
  let f;
  window.XtrataRadioListeningIdentity = () => {
    const u = o.snapshot();
    return u.solo && u.step !== "off" && u.step !== "elsewhere" ? u.listening : void 0;
  };
  const d = (u) => {
    var v, O;
    const m = window.XtrataRadioListeningIdentity();
    m !== f && (f = m, (O = (v = window.XtrataRadio) == null ? void 0 : v.refreshLikes) == null || O.call(v));
  };
  let l = "", g = null, h = !1;
  const x = (u) => {
    var Jt, te, Se, vn, $n;
    const m = window.XtrataRadio;
    if (!(m != null && m.setGiftPlayer) || !(m != null && m.setGiftStop)) return;
    const v = u.step === "off" || u.step === "elsewhere" ? null : ((Jt = u.gift) == null ? void 0 : Jt.player) ?? null, O = v ? v.id + ":" + v.cover + ":" + v.tracks.map((Ke) => Ke.id).join(",") : "";
    O !== l && (m.setGiftPlayer(v ? { id: v.id, title: v.title, subtitle: v.subtitle, tracks: v.tracks.map((Ke) => Ke.id), cover: v.cover } : null), l = O);
    const et = ((te = u.giftStop) == null ? void 0 : te.text) ?? null;
    et !== g && (m.setGiftStop(et), g = et);
    const bt = !!v && !!((Se = u.albumLock) != null && Se.locked);
    bt !== h && ((vn = m.setGiftLock) == null || vn.call(m, bt), h = bt), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(u.step) && (($n = m.forgetWallets) == null || $n.call(m));
  }, b = (u) => u ? u.slice(0, 6) + "…" + u.slice(-4) : "", L = (u) => (Number(u) / 1e6).toFixed(u < 1000n ? 6 : 4), H = (u) => {
    const m = Math.round((Date.now() - u) / 6e4);
    return m < 1 ? "now" : m < 60 ? `${m}m` : m < 1440 ? `${Math.round(m / 60)}h` : `${Math.round(m / 1440)}d`;
  }, U = (u) => `https://explorer.hiro.so/txid/${u}?chain=mainnet`, p = (u, m = "", v = "") => {
    const O = document.createElement(u);
    return m && (O.textContent = m), v && (O.className = v), O;
  }, $ = (u, m, v = "") => {
    const O = p("button", u, v);
    return O.type = "button", O.onclick = m, O;
  }, I = (u, m) => {
    const v = p("a", u);
    return v.href = m, v.target = "_blank", v.rel = "noopener", v;
  };
  let z = null, tt = location.hash === "#give";
  tt && history.replaceState(null, "", location.pathname + location.search);
  let F = !1;
  const Y = v5((u) => A5({ address: u, network: "mainnet" }), () => Ht(o.snapshot())), S = (u) => Y.get(u), C = X5(navigator.userAgent), _ = (u, m) => {
    const v = navigator.userAgent, O = Y5(v), et = `${location.origin}${location.pathname}${m ? `#gift=${m}` : ""}`, bt = [p("p", `You are in ${u}'s built-in browser, where passkeys often do not work. Open this page in ${O} to make your listening wallet${m ? " and claim your gift" : ""}.`, "ppp-warn")], Jt = p("div", "", "ppp-open-row"), te = W5(et, v);
    if (te) {
      const Se = p("a", `Open in ${O}`, "primary ppp-open-in");
      Se.href = te, Se.dataset.homeAction = "radio:open-in-browser", Jt.append(Se);
    }
    return Jt.append(as("copy-page-link", "Copy link", () => et, te ? "" : "primary", () => Ht(o.snapshot()))), bt.push(Jt, p("p", `If that does not open ${O}, use ${u}'s menu (••• or ⋮) and choose "Open in ${O === "your browser" ? "browser" : O}", or paste the copied link there.`, "ppp-mute")), bt;
  }, B = (u) => S(u) ?? b(u), X = (u) => u.slice(0, 2).map(B).join(" and ") + (u.length > 2 ? ` and ${u.length - 2} more` : ""), K = /* @__PURE__ */ new Map();
  let gt = !1;
  const ht = (u) => !u || /^(?:Inscription )?#\d+$/.test(u.trim()), ye = () => {
    gt || (gt = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((u) => u.ok ? u.json() : null).then((u) => {
      for (const m of Array.isArray(u == null ? void 0 : u.tracks) ? u.tracks : []) {
        const v = Number(m == null ? void 0 : m.id);
        Number.isSafeInteger(v) && K.set(v, { title: typeof m.title == "string" ? m.title : void 0, artist: typeof m.artist == "string" ? m.artist : void 0 });
      }
      Ht(o.snapshot());
    }).catch(() => {
      gt = !1;
    }));
  }, E = (u, m) => {
    const v = K.get(u), O = I5(u, [v == null ? void 0 : v.title, m == null ? void 0 : m.title].find((bt) => !ht(bt)) || ""), et = $5(u, (v == null ? void 0 : v.artist) || (m == null ? void 0 : m.artist) || "");
    return { title: O, artist: et };
  }, M = (u) => {
    const { title: m, artist: v } = E(u.song, u);
    return m ? `“${m}”${v ? ` — ${v}` : ""}` : `Song #${u.song}${v ? ` — ${v}` : ""}`;
  }, kt = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, pt = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function ut(u) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(u.step) ? ["", ""] : u.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : u.step === "over" ? ["OVER 1 STX", "bad"] : u.step === "locked" ? ["LOCKED", "mute"] : u.step === "intro" || u.step === "link" ? ["", ""] : u.step === "fund" ? u.depositPending ? ["ON ITS WAY", "warn"] : u.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : u.payingOn && u.session && u.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function xt(u, m, v = "", O) {
    const et = p("dt", u), bt = p("dd", m, v);
    return O && bt.append(" ", O), [et, bt];
  }
  const Pt = document.getElementById("ppp-top"), Nt = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Xt = () => {
    var m, v;
    const u = o.snapshot();
    if (u.step === "connect" || u.step === "wrong-wallet") {
      (m = document.getElementById("radio-wallet-connect")) == null || m.click();
      return;
    }
    if (u.step === "elsewhere" && ((v = u.gate) != null && v.radioUrl)) {
      location.href = u.gate.radioUrl;
      return;
    }
    u.step === "locked" && !u.armed && !u.busy && o.unlock(), u.step === "ready" && !u.payingOn && !u.busy && o.switchOn(), Nt();
  };
  Pt && (Pt.onclick = Xt);
  function be(u) {
    if (!Pt) return;
    const m = (O, et, bt) => {
      Pt.hidden = !1, Pt.className = "ppp-top" + (et ? " is-" + et : ""), Pt.replaceChildren(p("span", "", "dot"), document.createTextNode(O)), Pt.title = bt;
    }, v = u.session ? Math.min(u.session.playsLeft, u.playsLeft) : 0;
    switch (u.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Pt.hidden = !0;
        return;
      case "elsewhere":
        return m("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        Pt.hidden = !0;
        return;
      case "intro":
        return m("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "wrong-wallet":
        return m(`Connect ${B(u.linked)}`, "warn", `This device's listening wallet belongs to ${B(u.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return m(u.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return m("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return u.depositPending ? m("Funds on their way", "quiet", "Paying starts by itself when they land") : m(u.entries.some((O) => O.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return m("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return m("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return u.payingOn && v > 0 ? m(`On · ${v.toLocaleString()} plays left`, "on", "Paying artists as you listen") : m("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  const Bt = document.getElementById("pppNudge"), Ae = document.getElementById("onair");
  (Lt = Bt == null ? void 0 : Bt.querySelector("button")) == null || Lt.addEventListener("click", () => Xt());
  const tn = {
    elsewhere: "Listening free · artists get nothing",
    connect: "Not paying artists",
    intro: "Not paying artists",
    locked: "Locked · not paying artists",
    "wrong-wallet": "Wrong wallet connected · not paying artists",
    link: "Not paying artists yet",
    fund: "No funds yet · artists unpaid",
    over: "Paused · artists unpaid",
    ready: "Paying is off · artists get nothing"
  }, Ge = {
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
  function T(u) {
    var bt;
    if (u.step === "loading") return;
    const m = u.session ? Math.min(u.session.playsLeft, u.playsLeft) : 0, v = u.step === "ready" && u.payingOn && m > 0, O = v ? "" : tn[u.step] ?? "", et = v ? "on" : O ? "off" : "";
    if (et ? document.documentElement.dataset.ppp = et : delete document.documentElement.dataset.ppp, Ae && (Ae.hidden = !et, Ae.querySelector(".onair-sub").textContent = v ? `Paying artists · ${m.toLocaleString()} plays left` : "Not paying"), Bt && (Bt.hidden = et !== "off" || u.step === "fund" && u.depositPending, et === "off")) {
      const Jt = Math.floor(Number(1000000n / ir(BigInt(((bt = u.gate) == null ? void 0 : bt.limits.playFee) ?? "300"))));
      Bt.querySelector(".nudge-t").textContent = "⚠ " + O, Bt.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${Jt.toLocaleString()} plays, on-chain, straight to the artists.`, Bt.querySelector("button").textContent = Ge[u.step] ?? "Start paying";
    }
  }
  let G = "";
  function R(u) {
    const m = p("div", "", "ppp-pick");
    u.funderMultiple && u.returnToKind === "funder" && m.append(p("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), u.returnToKind === "funder" && m.append(p("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const v = p("input");
    v.type = "text", v.placeholder = "SP… address to send returns to", v.autocomplete = "off", v.spellcheck = !1, v.setAttribute("aria-label", "Address to return funds to"), v.value = G, v.oninput = () => {
      G = v.value;
    };
    const O = $(u.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(v.value), G = "";
    }, "tiny");
    return m.append(v, " ", O), u.returnToKind === "chosen" && m.append(" ", $("Back to the funder", () => o.clearReturnAddress(), "tiny")), m;
  }
  const ot = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function rt() {
    const u = p("p", ot + " ", "ppp-mute");
    return u.append(I("Xverse", "https://www.xverse.app/download"), " · ", I("Leather", "https://leather.io/install-extension")), u;
  }
  let yt = "";
  const Qt = (u) => {
    const m = document.documentElement, v = u.solo && !u.main ? u.listening ? b(u.listening) : "new" : "", O = V6() ? "1" : "";
    `${v}|${O}` !== yt && (yt = `${v}|${O}`, v ? m.dataset.pppSolo = v : delete m.dataset.pppSolo, O ? m.dataset.pppWalletInstalled = O : delete m.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const u of [1500, 4e3, 9e3]) setTimeout(() => Ht(o.snapshot()), u);
  function St(u, m = "") {
    var et;
    const v = p("div", "", "ppp-topup"), O = (et = u.likeFunds) == null ? void 0 : et.balance;
    v.append(p("span", "Add plays from My player: ", "ppp-mute"));
    for (const bt of Ql) {
      const Jt = $(`+${(Number(bt) / 1e6).toFixed(2)} STX`, () => void o.topUpAlbum(bt), m);
      Jt.disabled = O === void 0 || O < bt + 6000n || u.depositPending || !!u.busy, v.append(Jt);
    }
    return O !== void 0 && O < Ql[0] + 6000n && v.append(p("p", "My player is nearly empty: add STX to it first (switch to My player above).", "ppp-mute")), v;
  }
  function Vt(u) {
    const m = u.likeFunds;
    if (!m || !m.album || !m.low && !m.pending) return [];
    const v = p("div", "", "ppp-pick ppp-lowbox");
    if (!m.low) {
      const et = p("p", "Top-up for your main listener wallet is on its way. ", "ppp-warn");
      return m.txid && et.append(I("View", U(m.txid))), v.append(et), [v];
    }
    v.append(p("p", "⚠ YOUR MAIN LISTENER WALLET IS OUT OF FUNDS", "ppp-bad ppp-lowtitle")), v.append(p("p", "It signs every like for all your albums, so they all count for you. Likes are paused until it has a little STX. 0.1 STX is hundreds of likes.")), v.append(p("p", m.address, "ppp-addr-full"));
    const O = p("div", "", "ppp-open-row");
    if (O.append(as("copy-likes-address", "Copy address", () => m.address, "primary", () => Ht(o.snapshot()))), m.main && !u.solo) {
      const et = ai - (m.balance ?? 0n);
      et > 0n && O.append($(`Pay ${gn(et)} STX from my wallet`, () => void o.topUpLikes(), "primary"));
    }
    return v.append(O), v.append(p("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [v];
  }
  function Ht(u) {
    var Di, He, Fi, ji, zi, rn, Ri, sn, Gi, lr, ur, fr, dr;
    if (d(), x(u), Qt(u), be(u), T(u), t.hidden = u.step === "off", t.hidden) return;
    const [m, v] = ut(u), O = n(".ppp-state");
    O.textContent = m, O.className = "ppp-state" + (v ? " ppp-state--" + v : ""), O.hidden = !m;
    const et = !!u.busy || u.armed, bt = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(u.step) && (et || !["intro", "loading"].includes(u.step));
    r.hidden = !bt, r.classList.toggle("ppp-frame--rest", !et && !F);
    const Jt = n(".ppp-frame-label");
    Jt.hidden = !0;
    const te = z6(u) ?? z;
    z = te;
    const Se = G6(u, te);
    n(".ppp-badge").hidden = !Se;
    const vn = n(".ppp-steps"), $n = n(".ppp-stage");
    vn.hidden = $n.hidden = !Se, te && Se && (vn.replaceChildren(...Jl(u.solo).map((D, Q) => {
      const ce = p("li", "", Q < te.at ? "done" : Q === te.at ? te.blocked ? "now blocked" : "now" : "");
      return ce.append(p("span", Q < te.at ? "✓" : String(Q + 1), "n"), D), Q === te.at && ce.setAttribute("aria-current", "step"), ce;
    })), $n.textContent = te.caption, $n.className = "ppp-stage " + (te.at >= Jl(u.solo).length ? "ppp-ok" : te.blocked ? "ppp-bad" : "ppp-cyan"));
    const Ke = n(".ppp-facts"), me = [];
    u.main && ((Di = u.gate) != null && Di.here) && !u.solo && me.push(...xt("Your wallet", B(u.main), "ppp-addr-short"));
    const Kn = () => {
      if (!u.listening) return;
      const D = as("copy-listening", "Copy", () => u.listening || "", "tiny", () => Ht(o.snapshot()));
      me.push(...xt(u.slot > 0 ? "Album wallet" : u.linked ? "My player (technical)" : "My player wallet", b(u.listening), "ppp-addr-short", D));
    };
    if (u.linked || Kn(), u.listening && u.step !== "intro")
      if (u.linked)
        me.push(...xt("Credited to", `${B(u.linked)} · plays, likes and returns`, u.linked === u.main || u.solo ? "ppp-ok" : "ppp-warn")), Kn();
      else if (u.solo) {
        u.creditedTo && me.push(...xt("Credited to", `${B(u.creditedTo)} · plays and likes`, "ppp-ok"));
        const D = u.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : u.returnTo ? `${B(u.returnTo)} · ${u.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : u.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        me.push(...xt("Returns go to", u.gift ? D : u.returnTo && !S(u.returnTo) ? D.replace(b(u.returnTo), u.returnTo) : D, u.returnTo && !u.gift ? "ppp-addr-full" : "ppp-mute"));
      } else me.push(...xt("Linked to", "not linked yet", "ppp-warn"));
    if (u.linkedListening.length && ((He = u.gate) != null && He.here)) {
      const D = u.linkedListening.map((Q) => b(Q) + (Q === u.listening ? " (this one)" : "")).join(", ");
      me.push(...xt(u.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", D, "ppp-addr-short"));
    }
    if (u.balance !== void 0 && ["fund", "ready", "over"].includes(u.step)) {
      const D = u.balanceState === "ok" ? "ppp-ok" : u.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      me.push(...xt("Balance", `${gn(u.balance)} STX · about ${u.playsLeft.toLocaleString()} plays`, D));
    }
    const hn = u.entries.find((D) => D.kind === "play");
    hn && ye(), hn && me.push(...xt("Last paid song", `${M(hn)} → ${B(hn.recipient)}`, kt[hn.status] || "")), Ke.replaceChildren(...me), Ke.hidden = !me.length;
    const dt = [], Ot = [], Gt = [], en = [], Ft = ir(BigInt(((Fi = u.gate) == null ? void 0 : Fi.limits.playFee) ?? "300")), ke = `Each song you listen to for 30 seconds sends ${gn(Wl)} STX to whoever holds it, plus a ${gn(Ft - Wl)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, Wr = !!u.busy;
    switch (u.step) {
      case "elsewhere": {
        if (dt.push(p("p", "Pay artists as you listen.")), (ji = u.gate) != null && ji.radioUrl) {
          const Q = p("p");
          Q.append(I("Open the pay-per-play radio →", u.gate.radioUrl)), dt.push(Q);
        }
        Ot.push(p("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (u.linked) {
          const Q = [u.linked, ...u.others];
          dt.push(p("p", Q.length > 1 ? `This device has listening wallets for ${X(Q)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${B(u.linked)}. Connect that wallet to keep paying artists.`)), Ot.push(p("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          dt.push(p("p", "Connect your wallet to pay artists as you listen.")), Ot.push(p("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        dt.push(p("p", `This device's listening wallet belongs to ${B(u.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Ot.push(p("p", `You are connected as ${B(u.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), Ot.push(p("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Gt.push($("Switch wallet", () => {
          var Q;
          return (Q = document.getElementById("radio-wallet-connect")) == null ? void 0 : Q.click();
        }, "primary"));
        break;
      case "not-invited":
        dt.push(p("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        dt.push(p("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        dt.push(p("p", `Pay artists ${gn(Ft)} STX a song as you listen.`)), Ot.push(p("p", ke)), Ot.push(p("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), Ot.push(p("p", u.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !u.solo && u.main && u.others.length ? (dt.push(p("p", `This device already has a listening wallet for ${X(u.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Ot.push(p("p", `Otherwise, set up a new listening wallet for ${B(u.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !u.solo && u.main && Ot.push(p("p", `This is the listening wallet for ${B(u.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), u.solo && Ot.push(p("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const D = a.liveGift();
        Gt.push($(D ? "Claim my gift · no wallet needed" : u.solo ? "Turn on pay-per-play · no wallet needed" : u.others.length && u.main ? `Set up for ${B(u.main)}` : "Turn on pay-per-play", () => void o.create(), "primary")), !D && !u.solo && u.main && u.others.length && Gt.push($("Switch wallet", () => {
          var Q;
          return (Q = document.getElementById("radio-wallet-connect")) == null ? void 0 : Q.click();
        })), !D && u.solo && Gt.push($("I have a Stacks wallet", () => {
          var Q;
          return (Q = document.getElementById("radio-wallet-connect")) == null ? void 0 : Q.click();
        })), Gt.push($("I already have a listening wallet", () => void o.unlock(!0))), D && Gt.push($("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        u.armed || (dt.push(p("p", "Locked.", "ppp-mute")), Gt.push($(u.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), en.push($("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        dt.push(p("p", `Link to ${B(u.main)} · free`)), Ot.push(p("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Ot.push(p("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Gt.push($(u.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        dt.push(p("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (u.depositPending || ((zi = u.gift) != null && zi.player ? dt.push(p("p", "Out of plays · add more to keep listening", "ppp-bad")) : u.entries.length ? dt.push(p("p", "Out of funds · top up to keep paying", "ppp-bad")) : dt.push(p("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / Ft)).toLocaleString()} songs`))), (rn = u.gift) != null && rn.player ? Ot.push(p("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : u.entries.length && Ot.push(p("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), u.payingOn && !u.entries.length && Ot.push(p("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), u.solo ? (Ot.push(p("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Ot.push(p("p", u.listening || "", "ppp-addr-full")), u.listening && !u.depositPending && Gt.push(as("copy-address", "Copy my address", () => u.listening || "", "primary", () => Ht(o.snapshot())))) : Ot.push(p("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), u.depositPending && u.depositTxid) {
          const Q = p("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          Q.append(I("View", U(u.depositTxid))), dt.push(Q);
        } else u.allowance > 0n && !u.solo && Gt.push($(`Deposit ${gn(u.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        dt.push(p("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), u.solo && !u.returnTo && (dt.push(p("p", u.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), dt.push(R(u))), (!u.solo || u.returnTo) && Gt.push($("Return excess", () => void o.returnFunds("excess"), "primary"), $("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (u.payingOn && u.session && u.session.playsLeft > 0) {
          const Q = Math.min(u.session.playsLeft, u.playsLeft);
          dt.push(p("p", `Paying as you listen · up to ${Q.toLocaleString()} plays left`, "ppp-ok")), Ot.push(p("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), Gt.push($("Switch off", () => void o.switchOff()));
        } else
          dt.push(p("p", "Paying is off. Music stays free.", "ppp-mute")), Gt.push($("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        u.queued && dt.push(p("p", u.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${u.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), u.balanceState === "low" && dt.push(p("p", "Running low · top up", "ppp-warn")), u.depositPending ? dt.push(p("p", "Top-up on its way…", "ppp-warn")) : u.allowance > 0n && u.balanceState !== "ok" && !u.solo && Gt.push($(`Top up ${gn(u.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (u.solo && u.walletCannotSolo && Ot.push(p("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), u.solo && ["fund", "ready"].includes(u.step) && ((u.balance ?? 0n) > 0n && u.slot === 0 && Ot.push(R(u)), Ot.push(rt()), u.slot === 0 && u.step === "ready" && u.entries.some((D) => D.kind === "play" && D.status === "confirmed"))) {
      const D = p("p", "New to Stacks? ", "ppp-mute");
      D.append(I("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), dt.push(D);
    }
    if (u.walletOutdated && Ot.push(p("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), u.stuck && (dt.push(p("p", u.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${u.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Gt.push($("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(u.step) && (u.returnTo || u.gift) && (u.balance ?? 0n) > 0n && en.push($(u.linked ? "Return all to my wallet" : u.gift ? "Return what is left…" : `Return all to ${B(u.returnTo)}`, () => void o.returnFunds("all"), "quiet")), u.slot > 0 && ((Ri = u.gift) != null && Ri.player) && ["ready", "fund"].includes(u.step) && u.giftPlays > 20 && en.push(St(u, "quiet")), ["ready", "fund", "link", "over"].includes(u.step) && en.push($("Lock", () => void o.lock(), "quiet")), bt && !et && en.push($(F ? "Hide listening wallet box" : "Show listening wallet box", () => {
      F = !F, Ht(o.snapshot());
    }, "quiet")), [...Gt, ...en].forEach((D) => D.disabled = Wr), Wr && (Gt.length = 0), u.balance !== void 0 && ["fund", "ready", "over"].includes(u.step) && !(u.step === "fund" && u.depositPending && u.balance === 0n) && !((sn = u.gift) != null && sn.player)) {
      const D = u.balanceState === "ok" ? "ppp-ok" : u.balanceState === "low" ? "ppp-warn" : "ppp-bad", Q = dt.at(0);
      u.step === "ready" && Q ? Q.append(p("span", ` · ${L(u.balance)} STX`, D)) : dt.push(p("p", `Balance ${L(u.balance)} STX`, D));
    }
    if ((Gi = u.gift) != null && Gi.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(u.step)) {
      const D = p("p", "", "ppp-gift");
      D.append(`💿 Album · ${u.gift.player.title}`), u.gift.player.subtitle && D.append(" · ", u.gift.player.subtitle);
      const Q = ["ready", "fund", "over"].includes(u.step) && u.balance !== void 0 ? p("span", u.giftPlays === 0 ? " · no plays left" : ` · ${u.giftPlays.toLocaleString()} ${u.giftPlays === 1 ? "play" : "plays"} left`, u.giftPlays === 0 ? "ppp-bad" : u.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      Q && D.append(Q);
      const ce = (lr = dt.at(0)) == null ? void 0 : lr.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (u.step === "ready" && ce && /STX/.test(ce.textContent ?? "") && ce.remove(), dt.unshift(D), u.giftPlays <= 20 && ["ready", "fund"].includes(u.step) && !u.depositPending)
        if (u.slot > 0)
          dt.splice(1, 0, p("p", u.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), St(u, "primary"));
        else {
          const de = p("p", u.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          de.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), de.append(I("Xverse", "https://www.xverse.app/download"), " and ", I("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), dt.splice(1, 0, de);
        }
    }
    if (u.gift && !u.linked && ["fund", "ready", "over"].includes(u.step) && u.returnPlan.state === "ready") {
      const D = u.returnPlan, Q = p("div", "", "ppp-pick");
      Q.append(p("p", D.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const ce = p("ul", "", "ppp-gift-list");
      D.steps.forEach((de, hr) => {
        const qn = de.kind === "gift" ? "the unused gift" : de.kind === "deposit" ? "what was added to it" : "the rest", Xn = p("li");
        Xn.append(p("span", `${hr + 1}. ${gn(BigInt(de.send))} STX · ${qn}`, "t"), p("span", de.to ? ` → ${B(de.to)}` : " → choose an address below", de.to ? "ppp-mute" : "ppp-warn")), ce.append(Xn);
      }), Q.append(ce), D.kept && Q.append(p("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), D.steps.some((de) => !de.to) && Q.append(R(u)), Q.append($(D.steps.length > 1 ? `Confirm part 1 of ${D.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), dt.push(Q);
    }
    dt.unshift(...a.banner(u)), dt.unshift(...Vt(u)), C && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(u.step)) && dt.unshift(..._(C, a.pendingCode())), u.solo && u.creditedTo && u.listening && !["intro", "off", "elsewhere", "loading"].includes(u.step) && dt.unshift(p("p", `This is ${B(u.creditedTo)}'s listening wallet. Plays and likes count for ${B(u.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...dt);
    const Vn = document.querySelector(".ppp-switch");
    if (Vn) {
      const D = c.latest(), Q = u.slot > 0, ce = ["fund", "ready", "over"].includes(u.step) && (Q || !!D);
      if (Vn.hidden = !ce, ce) {
        const de = (qn, Xn, Ki, Wn) => {
          const ee = $("", Wn, "ppp-tab");
          return ee.setAttribute("aria-pressed", String(Ki)), ee.append(p("span", qn, "tt"), p("span", Xn === void 0 ? "…" : `${L(Xn)} STX`, "ts")), ee.disabled = !!u.busy, ee;
        }, hr = Q ? ((fr = (ur = u.gift) == null ? void 0 : ur.player) == null ? void 0 : fr.title) ?? "Album" : D.title;
        Vn.replaceChildren(
          de("🎧 My player", Q ? (dr = u.likeFunds) == null ? void 0 : dr.balance : u.balance, !Q, () => {
            Q && o.openAlbum(0);
          }),
          de("💿 " + hr, Q ? u.balance : void 0, Q, () => {
            !Q && D && o.openAlbum(D.slot);
          })
        );
      }
    }
    const In = c.render(u), we = document.querySelector(".ppp-shelf");
    if (we) {
      we.hidden = !In;
      const D = we.querySelector("summary");
      D && (D.textContent = c.count() > 0 ? `♪ My albums (${c.count()})` : "♪ My albums");
      const Q = we.querySelector(".ppp-shelf-body");
      In && Q && !Q.contains(In) && Q.replaceChildren(In);
    }
    const nn = a.renderFold(u);
    if (n(".ppp-gifts").hidden = !nn, nn && !n(".ppp-gift-body").contains(nn) && n(".ppp-gift-body").replaceChildren(nn), nn && tt) {
      tt = !1;
      const D = n(".ppp-gifts");
      D.open = !0, requestAnimationFrame(() => D.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...Ot), n(".ppp-actions").replaceChildren(...Gt), n(".ppp-actions2").replaceChildren(...en);
    const Pe = u.busy || u.message || "";
    n(".ppp-msg").textContent = Pe && dt.some((D) => (D.textContent ?? "").startsWith(Pe.replace(/[.✓\s]+$/, ""))) ? "" : Pe, n(".ppp-err").textContent = u.error;
    const Yr = u.entries.filter((D) => D.kind === "play");
    n(".ppp-recent").hidden = !u.entries.length, n(".ppp-recent-list").replaceChildren(...Yr.slice(0, 5).map((D) => {
      const Q = p("li"), ce = D.status === "confirmed" ? "ok" : D.status === "failed" ? "bad" : "warn";
      return Q.append(p("span", "", "d " + ce), p("span", M(D), "t"), p("span", H(D.created), "ppp-mute")), D.txid && Q.append(I("tx", U(D.txid))), Q;
    })), n(".ppp-wallets").hidden = !(Ke.childElementCount || en.length), n(".ppp-more").hidden = !Ot.length;
    const cr = n(".ppp-history");
    cr.hidden = !u.entries.length, u.entries.length && ye(), cr.replaceChildren(p("summary", `All activity (${u.entries.length})`), ...u.entries.slice(0, 20).map((D) => {
      const Q = p("div", "", "ppp-row"), ce = D.kind === "play" ? [p("span", M(D), "ppp-song"), p("span", ` · ${gn(BigInt(D.amount))} STX to ${B(D.recipient)}`, "ppp-mute")] : D.kind === "like" ? [p("span", `${D.liked ? "♥ Liked" : "Unliked"} ${M(D)}`, "ppp-song"), p("span", ` · for ${u.linked ? B(u.linked) : "this listening wallet"}`, "ppp-mute")] : [p("span", `Returned ${gn(BigInt(D.amount))} STX`, "ppp-song"), p("span", ` to ${B(D.recipient)}`, "ppp-mute")];
      return Q.append(
        p("span", pt[D.status] || D.status, "ppp-status " + (kt[D.status] || "")),
        ...ce,
        p("span", ` · ${new Date(D.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), D.txid && Q.append(I("tx ↗", U(D.txid))), Q;
    }));
  }
  const _t = /* @__PURE__ */ new Map(), wt = () => {
    const u = window.XtrataRadio;
    return u != null && u.subscribe ? (u.subscribe((m) => {
      const v = m == null ? void 0 : m.nowPlaying;
      v && Number.isSafeInteger(Number(v.tokenId)) && _t.set(Number(v.tokenId), { title: v.title || void 0, artist: v.artist || void 0 });
    }), !0) : !1;
  };
  if (!wt()) {
    const u = setInterval(() => {
      wt() && clearInterval(u);
    }, 500);
    setTimeout(() => clearInterval(u), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (u) => {
    const m = u.detail;
    if (m && Number.isSafeInteger(m.song) && typeof m.id == "string" && /^[0-9a-f]{32}$/.test(m.id)) {
      ye();
      const v = E(m.song, _t.get(m.song));
      o.onListened({ song: m.song, id: m.id, title: v.title || void 0, artist: v.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const Q5 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", J5 = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", i = e.userAgent.includes("Edge"), s = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return s ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && i === !1 && o === !1;
}, t$ = () => J5() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, e$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, n$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Ny = class {
  constructor(t) {
    HA(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && rx(t), this.callback(Wa(t));
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
    var r, i, s, o, a, c, f, d, l, g;
    return n === "IOS" ? (i = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && i !== void 0 ? i : t.webUrl : e === "Chrome" ? (o = (s = t.chromeWebStoreUrl) !== null && s !== void 0 ? s : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (d = (f = t.googlePlayStoreUrl) !== null && f !== void 0 ? f : this.getBrowserUrl(t)) !== null && d !== void 0 ? d : t.webUrl : (g = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && g !== void 0 ? g : this.getMobileUrl(t);
  }
  render() {
    const t = t$(), e = e$(), n = this.defaultProviders.filter(
      (s) => this.installedProviders.findIndex((o) => o.id === s.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, i = n.length > 0;
    return mt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, mt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), mt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, mt("div", { class: "flex flex-col space-y-[10px]" }, mt("div", { class: "flex items-center" }, mt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), mt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, mt("span", { class: "sr-only" }, "Close popup"), mt("img", { src: Q5 }))), r ? mt("p", null, "Select the wallet you want to connect to.") : mt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && mt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && mt("div", { class: "mt-6" }, mt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), mt("ul", { class: "space-y-3" }, this.installedProviders.map((s) => mt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, mt("div", { class: "aspect-square basis-9 overflow-hidden" }, mt("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), mt("div", { class: "flex-1" }, mt("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && mt("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), mt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(s.id) }, "Connect"))))), i && mt("div", { class: "mt-6" }, r ? mt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : mt("div", { class: "mb-5 flex justify-between" }, mt("p", { class: "text-sm font-medium" }, "Recommended wallets"), mt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, mt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, mt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), mt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), mt("p", null, "What is a wallet? ", mt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), mt("ul", { class: "space-y-3" }, n.map((s) => mt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, mt("div", { class: "aspect-square basis-9 overflow-hidden" }, mt("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), mt("div", { class: "flex-1" }, mt("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && mt("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), this.getInstallUrl(s, t, e) && mt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(s, t, e), rel: "noopener noreferrer", target: "_blank" }, s.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return bA(this);
  }
};
Ny.style = n$;
const r$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Ny
}, Symbol.toStringTag, { value: "Module" }));
