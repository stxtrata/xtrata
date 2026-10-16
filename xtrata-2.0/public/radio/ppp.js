var ww = Object.defineProperty;
var bw = (t, e, n) => e in t ? ww(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var to = (t, e, n) => bw(t, typeof e != "symbol" ? e + "" : e, n);
var Ye = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function c0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function l0(t) {
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
      typeof Ye < "u" && Ye || {}, r = {
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
      function s(A) {
        return A && DataView.prototype.isPrototypeOf(A);
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
        ], o = ArrayBuffer.isView || function(A) {
          return A && i.indexOf(Object.prototype.toString.call(A)) > -1;
        };
      function a(A) {
        if (typeof A != "string" && (A = String(A)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(A) || A === "")
          throw new TypeError('Invalid character in header field name: "' + A + '"');
        return A.toLowerCase();
      }
      function c(A) {
        return typeof A != "string" && (A = String(A)), A;
      }
      function f(A) {
        var B = {
          next: function() {
            var _ = A.shift();
            return { done: _ === void 0, value: _ };
          }
        };
        return r.iterable && (B[Symbol.iterator] = function() {
          return B;
        }), B;
      }
      function h(A) {
        this.map = {}, A instanceof h ? A.forEach(function(B, _) {
          this.append(_, B);
        }, this) : Array.isArray(A) ? A.forEach(function(B) {
          if (B.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + B.length);
          this.append(B[0], B[1]);
        }, this) : A && Object.getOwnPropertyNames(A).forEach(function(B) {
          this.append(B, A[B]);
        }, this);
      }
      h.prototype.append = function(A, B) {
        A = a(A), B = c(B);
        var _ = this.map[A];
        this.map[A] = _ ? _ + ", " + B : B;
      }, h.prototype.delete = function(A) {
        delete this.map[a(A)];
      }, h.prototype.get = function(A) {
        return A = a(A), this.has(A) ? this.map[A] : null;
      }, h.prototype.has = function(A) {
        return this.map.hasOwnProperty(a(A));
      }, h.prototype.set = function(A, B) {
        this.map[a(A)] = c(B);
      }, h.prototype.forEach = function(A, B) {
        for (var _ in this.map)
          this.map.hasOwnProperty(_) && A.call(B, this.map[_], _, this);
      }, h.prototype.keys = function() {
        var A = [];
        return this.forEach(function(B, _) {
          A.push(_);
        }), f(A);
      }, h.prototype.values = function() {
        var A = [];
        return this.forEach(function(B) {
          A.push(B);
        }), f(A);
      }, h.prototype.entries = function() {
        var A = [];
        return this.forEach(function(B, _) {
          A.push([_, B]);
        }), f(A);
      }, r.iterable && (h.prototype[Symbol.iterator] = h.prototype.entries);
      function l(A) {
        if (!A._noBody) {
          if (A.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          A.bodyUsed = !0;
        }
      }
      function y(A) {
        return new Promise(function(B, _) {
          A.onload = function() {
            B(A.result);
          }, A.onerror = function() {
            _(A.error);
          };
        });
      }
      function p(A) {
        var B = new FileReader(), _ = y(B);
        return B.readAsArrayBuffer(A), _;
      }
      function S(A) {
        var B = new FileReader(), _ = y(B), T = /charset=([A-Za-z0-9_-]+)/.exec(A.type), J = T ? T[1] : "utf-8";
        return B.readAsText(A, J), _;
      }
      function x(A) {
        for (var B = new Uint8Array(A), _ = new Array(B.length), T = 0; T < B.length; T++)
          _[T] = String.fromCharCode(B[T]);
        return _.join("");
      }
      function L(A) {
        if (A.slice)
          return A.slice(0);
        var B = new Uint8Array(A.byteLength);
        return B.set(new Uint8Array(A)), B.buffer;
      }
      function O() {
        return this.bodyUsed = !1, this._initBody = function(A) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = A, A ? typeof A == "string" ? this._bodyText = A : r.blob && Blob.prototype.isPrototypeOf(A) ? this._bodyBlob = A : r.formData && FormData.prototype.isPrototypeOf(A) ? this._bodyFormData = A : r.searchParams && URLSearchParams.prototype.isPrototypeOf(A) ? this._bodyText = A.toString() : r.arrayBuffer && r.blob && s(A) ? (this._bodyArrayBuffer = L(A.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(A) || o(A)) ? this._bodyArrayBuffer = L(A) : this._bodyText = A = Object.prototype.toString.call(A) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof A == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(A) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var A = l(this);
          if (A)
            return A;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var A = l(this);
            return A || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var A = l(this);
          if (A)
            return A;
          if (this._bodyBlob)
            return S(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(x(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then($);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var P = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function g(A) {
        var B = A.toUpperCase();
        return P.indexOf(B) > -1 ? B : A;
      }
      function I(A, B) {
        if (!(this instanceof I))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        B = B || {};
        var _ = B.body;
        if (A instanceof I) {
          if (A.bodyUsed)
            throw new TypeError("Already read");
          this.url = A.url, this.credentials = A.credentials, B.headers || (this.headers = new h(A.headers)), this.method = A.method, this.mode = A.mode, this.signal = A.signal, !_ && A._bodyInit != null && (_ = A._bodyInit, A.bodyUsed = !0);
        } else
          this.url = String(A);
        if (this.credentials = B.credentials || this.credentials || "same-origin", (B.headers || !this.headers) && (this.headers = new h(B.headers)), this.method = g(B.method || this.method || "GET"), this.mode = B.mode || this.mode || null, this.signal = B.signal || this.signal || function() {
          if ("AbortController" in n) {
            var z = new AbortController();
            return z.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && _)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(_), (this.method === "GET" || this.method === "HEAD") && (B.cache === "no-store" || B.cache === "no-cache")) {
          var T = /([?&])_=[^&]*/;
          if (T.test(this.url))
            this.url = this.url.replace(T, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var J = /\?/;
            this.url += (J.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      I.prototype.clone = function() {
        return new I(this, { body: this._bodyInit });
      };
      function $(A) {
        var B = new FormData();
        return A.trim().split("&").forEach(function(_) {
          if (_) {
            var T = _.split("="), J = T.shift().replace(/\+/g, " "), z = T.join("=").replace(/\+/g, " ");
            B.append(decodeURIComponent(J), decodeURIComponent(z));
          }
        }), B;
      }
      function N(A) {
        var B = new h(), _ = A.replace(/\r?\n[\t ]+/g, " ");
        return _.split("\r").map(function(T) {
          return T.indexOf(`
`) === 0 ? T.substr(1, T.length) : T;
        }).forEach(function(T) {
          var J = T.split(":"), z = J.shift().trim();
          if (z) {
            var Ot = J.join(":").trim();
            try {
              B.append(z, Ot);
            } catch (ft) {
              console.warn("Response " + ft.message);
            }
          }
        }), B;
      }
      O.call(I.prototype);
      function V(A, B) {
        if (!(this instanceof V))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (B || (B = {}), this.type = "default", this.status = B.status === void 0 ? 200 : B.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = B.statusText === void 0 ? "" : "" + B.statusText, this.headers = new h(B.headers), this.url = B.url || "", this._initBody(A);
      }
      O.call(V.prototype), V.prototype.clone = function() {
        return new V(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, V.error = function() {
        var A = new V(null, { status: 200, statusText: "" });
        return A.ok = !1, A.status = 0, A.type = "error", A;
      };
      var D = [301, 302, 303, 307, 308];
      V.redirect = function(A, B) {
        if (D.indexOf(B) === -1)
          throw new RangeError("Invalid status code");
        return new V(null, { status: B, headers: { location: A } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(B, _) {
          this.message = B, this.name = _;
          var T = Error(B);
          this.stack = T.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function j(A, B) {
        return new Promise(function(_, T) {
          var J = new I(A, B);
          if (J.signal && J.signal.aborted)
            return T(new e.DOMException("Aborted", "AbortError"));
          var z = new XMLHttpRequest();
          function Ot() {
            z.abort();
          }
          z.onload = function() {
            var E = {
              statusText: z.statusText,
              headers: N(z.getAllResponseHeaders() || "")
            };
            J.url.indexOf("file://") === 0 && (z.status < 200 || z.status > 599) ? E.status = 200 : E.status = z.status, E.url = "responseURL" in z ? z.responseURL : E.headers.get("X-Request-URL");
            var M = "response" in z ? z.response : z.responseText;
            setTimeout(function() {
              _(new V(M, E));
            }, 0);
          }, z.onerror = function() {
            setTimeout(function() {
              T(new TypeError("Network request failed"));
            }, 0);
          }, z.ontimeout = function() {
            setTimeout(function() {
              T(new TypeError("Network request timed out"));
            }, 0);
          }, z.onabort = function() {
            setTimeout(function() {
              T(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function ft(E) {
            try {
              return E === "" && n.location.href ? n.location.href : E;
            } catch {
              return E;
            }
          }
          if (z.open(J.method, ft(J.url), !0), J.credentials === "include" ? z.withCredentials = !0 : J.credentials === "omit" && (z.withCredentials = !1), "responseType" in z && (r.blob ? z.responseType = "blob" : r.arrayBuffer && (z.responseType = "arraybuffer")), B && typeof B.headers == "object" && !(B.headers instanceof h || n.Headers && B.headers instanceof n.Headers)) {
            var te = [];
            Object.getOwnPropertyNames(B.headers).forEach(function(E) {
              te.push(a(E)), z.setRequestHeader(E, c(B.headers[E]));
            }), J.headers.forEach(function(E, M) {
              te.indexOf(M) === -1 && z.setRequestHeader(M, E);
            });
          } else
            J.headers.forEach(function(E, M) {
              z.setRequestHeader(M, E);
            });
          J.signal && (J.signal.addEventListener("abort", Ot), z.onreadystatechange = function() {
            z.readyState === 4 && J.signal.removeEventListener("abort", Ot);
          }), z.send(typeof J._bodyInit > "u" ? null : J._bodyInit);
        });
      }
      return j.polyfill = !0, n.fetch || (n.fetch = j, n.Headers = h, n.Request = I, n.Response = V), e.Headers = h, e.Request = I, e.Response = V, e.fetch = j, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : Ye);
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
function Aw(...t) {
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
var Ai;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ai || (Ai = {}));
var Ls;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ls || (Ls = {}));
var Tf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Tf || (Tf = {}));
const Ew = "https://api.mainnet.hiro.so", vw = "https://api.testnet.hiro.so", $w = "http://localhost:3999", Iw = ["mainnet", "testnet", "devnet", "mocknet"];
let Ei = class {
  constructor(e) {
    this.version = Ls.Mainnet, this.chainId = Ai.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ls.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Aw();
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
Ei.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new cl();
    case "testnet":
      return new kw();
    case "devnet":
      return new Lw();
    case "mocknet":
      return new u0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Iw.join(", ")}`);
  }
};
Ei.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Ei.fromName(t);
let cl = class extends Ei {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ew,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ls.Mainnet, this.chainId = Ai.Mainnet;
  }
}, kw = class extends Ei {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? vw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ls.Testnet, this.chainId = Ai.Testnet;
  }
}, u0 = class extends Ei {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? $w,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ls.Testnet, this.chainId = Ai.Testnet;
  }
};
const Lw = u0, f0 = "xtrata.wallet.bridge.v1", Cw = (t) => typeof t == "object" && t !== null && t.protocol === f0, Bw = (t) => Cw(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", Tw = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class eo extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const _f = 12e4;
class _w {
  constructor(e) {
    to(this, "pending", /* @__PURE__ */ new Map());
    to(this, "listenTarget");
    to(this, "closed", !1);
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
    to(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !Bw(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new eo("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new eo("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new eo("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = Tw(), i = { protocol: f0, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new eo(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? _f}ms.`
          )
        );
      }, this.options.timeoutMs ?? _f);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new eo("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const Hw = ["SP", "SM"], Mw = ["ST", "SN"], Nw = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return Hw.includes(n) ? "mainnet" : Mw.includes(n) ? "testnet" : null;
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
}, Pw = () => typeof window > "u" || !window.localStorage ? Uw() : window.localStorage, Bc = "xtrata.v15.1.wallet.session", Hf = "mainnet", Ea = { isConnected: !1 }, Ow = (t) => t.address ? Nw(t.address) ?? t.network : t.network, d0 = (t) => !t.isConnected || !t.address ? { ...Ea } : Ow(t) !== Hf ? { ...Ea } : {
  isConnected: !0,
  address: t.address,
  network: Hf,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Dw = (t) => {
  if (!t)
    return { ...Ea };
  try {
    const e = JSON.parse(t);
    return d0(e);
  } catch {
    return { ...Ea };
  }
}, Fw = (t) => {
  const e = d0(t);
  return JSON.stringify(e);
}, jw = (t) => {
  const e = Pw();
  return {
    load: () => Dw(e.getItem(Bc)),
    save: (n) => {
      e.setItem(Bc, Fw(n));
    },
    clear: () => {
      e.removeItem(Bc);
    }
  };
}, zw = "https://browser.blockstack.org/auth", Rw = {
  "@type": "Person",
  "@context": "http://schema.org"
}, h0 = ["store_write"], Gw = "blockstack-session", Vw = {
  logLevel: "debug"
}, Ks = {
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
Object.freeze(Ks);
class Fi extends Error {
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
class Kw extends Fi {
  constructor(e, n = "") {
    super({ code: Ks.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Mf extends Fi {
  constructor(e = "") {
    super({ code: Ks.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Do extends Fi {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Ks.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Nf extends Fi {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Ks.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class ll extends Fi {
  constructor(e) {
    super({ code: Ks.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class p0 extends Fi {
  constructor(e) {
    super({ code: Ks.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Uf = ["debug", "info", "warn", "error", "none"], ul = {};
for (let t = 0; t < Uf.length; t++) {
  const e = Uf[t];
  ul[e] = t;
}
class gi {
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
    return ul[Vw.logLevel] <= ul[e];
  }
}
function Ww() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function qw() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Tc(t, e) {
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
function pu(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Yw(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    gi.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = Zw(s, t.toString(), n);
    throw gi.error(i), new Error(i);
  }
  if (r)
    return {};
}
function os(t, e) {
  return gu(Re(t), e);
}
function Re(t) {
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
    return BigInt(`0x${ot(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Qw(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Pf(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Lo(t, e = 8) {
  return (typeof t == "bigint" ? t : Re(t)).toString(16).padStart(e * 2, "0");
}
function Ya(t) {
  return parseInt(t, 16);
}
function gu(t, e = 16) {
  const n = Lo(t, e);
  return Pt(n);
}
function Jw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function tb(t, e) {
  return t & BigInt(1) << e;
}
function fl(t) {
  return eb(BigInt(`0x${ot(t)}`), BigInt(t.byteLength * 8));
}
function eb(t, e) {
  return tb(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const nb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ot(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += nb[n];
  return e;
}
function Pt(t) {
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
function Ws(t) {
  return new TextEncoder().encode(t);
}
function Co(t) {
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
function Of(t) {
  if (t.some(ib))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ir(...t) {
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
function we(t) {
  return ir(...t.map((e) => typeof e == "number" ? Of([e]) : e instanceof Array ? Of(e) : e));
}
function cn(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const g0 = "https://api.mainnet.hiro.so", y0 = "https://api.testnet.hiro.so", w0 = "http://localhost:3999", ob = "https://hub.blockstack.org", ab = 33, _c = 32;
function cb(t) {
  if (t.length < _c * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + _c * 2), r = t.slice(2 + _c * 2);
  return {
    recoveryId: Ya(e),
    r: n,
    s: r
  };
}
function yu(t) {
  const e = typeof t == "string" ? Pt(t) : t;
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
function Cs(t, e, n = 0) {
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
class b0 {
  constructor(e = h0.slice(), n = ((a) => (a = pu("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = zw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function dl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function bb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function m0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function mb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  dl(t.outputLen), dl(t.blockLen);
}
function xb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Sb(t, e) {
  m0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ws = {
  number: dl,
  bool: bb,
  bytes: m0,
  hash: mb,
  exists: xb,
  output: Sb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Hc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Vn = (t, e) => t << 32 - e | t >>> e, Ab = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Ab)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Eb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function wu(t) {
  if (typeof t == "string" && (t = Eb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let x0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function qs(t) {
  const e = (r) => t().update(wu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let S0 = class extends x0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ws.hash(e);
    const r = wu(n);
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
    return ws.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ws.exists(this), ws.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Za = (t, e, n) => new S0(t, e).update(n).digest();
Za.create = (t, e) => new S0(t, e);
function vb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let bu = class extends x0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Hc(this.buffer);
  }
  update(e) {
    ws.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = wu(e);
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
    ws.exists(this), ws.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    vb(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Hc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
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
const $b = (t, e, n) => t & e ^ ~t & n, Ib = (t, e, n) => t & e ^ t & n ^ e & n, kb = new Uint32Array([
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
]), kr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Lr = new Uint32Array(64);
let A0 = class extends bu {
  constructor() {
    super(64, 32, 8, !1), this.A = kr[0] | 0, this.B = kr[1] | 0, this.C = kr[2] | 0, this.D = kr[3] | 0, this.E = kr[4] | 0, this.F = kr[5] | 0, this.G = kr[6] | 0, this.H = kr[7] | 0;
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
      Lr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Lr[l - 15], p = Lr[l - 2], S = Vn(y, 7) ^ Vn(y, 18) ^ y >>> 3, x = Vn(p, 17) ^ Vn(p, 19) ^ p >>> 10;
      Lr[l] = x + Lr[l - 7] + S + Lr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = Vn(a, 6) ^ Vn(a, 11) ^ Vn(a, 25), p = h + y + $b(a, c, f) + kb[l] + Lr[l] | 0, x = (Vn(r, 2) ^ Vn(r, 13) ^ Vn(r, 22)) + Ib(r, s, i) | 0;
      h = f, f = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, f, h);
  }
  roundClean() {
    Lr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Lb = class extends A0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const vi = qs(() => new A0());
qs(() => new Lb());
const Cb = {}, E0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Cb
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Ut = BigInt(0), oe = BigInt(1), es = BigInt(2), co = BigInt(3), Df = BigInt(8), Vt = Object.freeze({
  a: Ut,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: oe,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Ff = (t, e) => (t + e / es) / e, Fo = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = Vt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -oe * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = Ff(i * t, e), c = Ff(-r * t, e);
    let f = q(t - a * n - c * s, e), h = q(-a * r - c * i, e);
    const l = f > o, y = h > o;
    if (l && (f = e - f), y && (h = e - h), f > o || h > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: f, k2neg: y, k2: h };
  }
}, Dn = 32, Bs = 32, v0 = 32, va = Dn + 1, $a = 2 * Dn + 1;
function jf(t) {
  const { a: e, b: n } = Vt, r = q(t * t), s = q(r * t);
  return q(s + e * t + n);
}
const jo = Vt.a === Ut;
class mu extends Error {
  constructor(e) {
    super(e);
  }
}
function zf(t) {
  if (!(t instanceof Dt))
    throw new TypeError("JacobianPoint expected");
}
class Dt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof $t))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals($t.ZERO) ? Dt.ZERO : new Dt(e.x, e.y, oe);
  }
  static toAffineBatch(e) {
    const n = Mb(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return Dt.toAffineBatch(e).map(Dt.fromAffine);
  }
  equals(e) {
    zf(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = q(s * s), f = q(a * a), h = q(n * f), l = q(i * c), y = q(q(r * a) * f), p = q(q(o * s) * c);
    return h === l && y === p;
  }
  negate() {
    return new Dt(this.x, q(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = q(e * e), i = q(n * n), o = q(i * i), a = e + i, c = q(es * (q(a * a) - s - o)), f = q(co * s), h = q(f * f), l = q(h - es * c), y = q(f * (c - l) - Df * o), p = q(es * n * r);
    return new Dt(l, y, p);
  }
  add(e) {
    zf(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === Ut || o === Ut)
      return this;
    if (n === Ut || r === Ut)
      return e;
    const c = q(s * s), f = q(a * a), h = q(n * f), l = q(i * c), y = q(q(r * a) * f), p = q(q(o * s) * c), S = q(l - h), x = q(p - y);
    if (S === Ut)
      return x === Ut ? this.double() : Dt.ZERO;
    const L = q(S * S), O = q(S * L), P = q(h * L), g = q(x * x - O - es * P), I = q(x * (P - g) - y * O), $ = q(s * a * S);
    return new Dt(g, I, $);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Dt.ZERO;
    if (typeof e == "bigint" && e === Ut)
      return n;
    let r = Vf(e);
    if (r === oe)
      return this;
    if (!jo) {
      let l = n, y = this;
      for (; r > Ut; )
        r & oe && (l = l.add(y)), y = y.double(), r >>= oe;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = Fo.splitScalar(r), c = n, f = n, h = this;
    for (; i > Ut || a > Ut; )
      i & oe && (c = c.add(h)), a & oe && (f = f.add(h)), h = h.double(), i >>= oe, a >>= oe;
    return s && (c = c.negate()), o && (f = f.negate()), f = new Dt(q(f.x * Fo.beta), f.y, f.z), c.add(f);
  }
  precomputeWindow(e) {
    const n = jo ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(Dt.BASE) && (n = $t.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && hl.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = Dt.normalizeZ(s), hl.set(n, s)));
    let i = Dt.ZERO, o = Dt.BASE;
    const a = 1 + (jo ? 128 / r : 256 / r), c = 2 ** (r - 1), f = BigInt(2 ** r - 1), h = 2 ** r, l = BigInt(r);
    for (let y = 0; y < a; y++) {
      const p = y * c;
      let S = Number(e & f);
      e >>= l, S > c && (S -= h, e += oe);
      const x = p, L = p + Math.abs(S) - 1, O = y % 2 !== 0, P = S < 0;
      S === 0 ? o = o.add(zo(O, s[x])) : i = i.add(zo(P, s[L]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = Vf(e), s, i;
    if (jo) {
      const { k1neg: o, k1: a, k2neg: c, k2: f } = Fo.splitScalar(r);
      let { p: h, f: l } = this.wNAF(a, n), { p: y, f: p } = this.wNAF(f, n);
      h = zo(o, h), y = zo(c, y), y = new Dt(q(y.x * Fo.beta), y.y, y.z), s = h.add(y), i = l.add(p);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return Dt.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(Dt.ZERO);
    e == null && (e = i ? Df : ji(s));
    const o = e, a = q(o * o), c = q(a * o), f = q(n * a), h = q(r * c), l = q(s * o);
    if (i)
      return $t.ZERO;
    if (l !== oe)
      throw new Error("invZ was invalid");
    return new $t(f, h);
  }
}
Dt.BASE = new Dt(Vt.Gx, Vt.Gy, oe);
Dt.ZERO = new Dt(Ut, oe, Ut);
function zo(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const hl = /* @__PURE__ */ new WeakMap();
class $t {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, hl.delete(this);
  }
  hasEvenY() {
    return this.y % es === Ut;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = mn(n ? e : e.subarray(1));
    if (!ya(r))
      throw new Error("Point is not on curve");
    const s = jf(r);
    let i = Hb(s);
    const o = (i & oe) === oe;
    n ? o && (i = q(-i)) : (e[0] & 1) === 1 !== o && (i = q(-i));
    const a = new $t(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = mn(e.subarray(1, Dn + 1)), r = mn(e.subarray(Dn + 1, Dn * 2 + 1)), s = new $t(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = or(e), r = n.length, s = n[0];
    if (r === Dn)
      return this.fromCompressedHex(n);
    if (r === va && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === $a && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${va} compressed bytes or ${$a} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return $t.BASE.multiply(Ts(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = k0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = xu(or(e)), { n: a } = Vt, c = r === 2 || r === 3 ? s + a : s, f = ji(c, a), h = q(-o * f, a), l = q(i * f, a), y = r & 1 ? "03" : "02", p = $t.fromHex(y + ns(c)), S = $t.BASE.multiplyAndAddUnsafe(p, h, l);
    if (!S)
      throw new Error("Cannot recover signature: point at infinify");
    return S.assertValidity(), S;
  }
  toRawBytes(e = !1) {
    return rs(this.toHex(e));
  }
  toHex(e = !1) {
    const n = ns(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${ns(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!ya(n) || !ya(r))
      throw new Error(e);
    const s = q(r * r), i = jf(n);
    if (q(s - i) !== Ut)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new $t(this.x, q(-this.y));
  }
  double() {
    return Dt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return Dt.fromAffine(this).add(Dt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return Dt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = Dt.fromAffine(this), i = n === Ut || n === oe || this !== $t.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = Dt.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(Dt.ZERO) ? void 0 : a.toAffine();
  }
}
$t.BASE = new $t(Vt.Gx, Vt.Gy);
$t.ZERO = new $t(Ut, Ut);
function Rf(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Gf(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${$i(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: mn(n), left: t.subarray(e + 2) };
}
function Bb(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${$i(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Gf(t.subarray(2)), { data: r, left: s } = Gf(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${$i(s)}`);
  return { r: e, s: r };
}
class bn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? $i(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new bn(Ia(s.slice(0, 64)), Ia(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Bb(n ? e : rs(e));
    return new bn(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ki(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!ki(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = Vt.n >> oe;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new bn(this.r, q(-this.s, Vt.n)) : this;
  }
  toDERRawBytes() {
    return rs(this.toDERHex());
  }
  toDERHex() {
    const e = Rf(no(this.s)), n = Rf(no(this.r)), r = e.length / 2, s = n.length / 2, i = no(r), o = no(s);
    return `30${no(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return rs(this.toCompactHex());
  }
  toCompactHex() {
    return ns(this.r) + ns(this.s);
  }
}
function Jr(...t) {
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
const Tb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function $i(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Tb[t[n]];
  return e;
}
const _b = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function ns(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Ut <= t && t < _b))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Ii(t) {
  const e = rs(ns(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function no(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Ia(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function rs(t) {
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
function mn(t) {
  return Ia($i(t));
}
function or(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : rs(t);
}
function Vf(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && ki(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function q(t, e = Vt.P) {
  const n = t % e;
  return n >= Ut ? n : e + n;
}
function $n(t, e) {
  const { P: n } = Vt;
  let r = t;
  for (; e-- > Ut; )
    r *= r, r %= n;
  return r;
}
function Hb(t) {
  const { P: e } = Vt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, f = c * c * t % e, h = $n(f, co) * f % e, l = $n(h, co) * f % e, y = $n(l, es) * c % e, p = $n(y, r) * y % e, S = $n(p, s) * p % e, x = $n(S, o) * S % e, L = $n(x, a) * x % e, O = $n(L, o) * S % e, P = $n(O, co) * f % e, g = $n(P, i) * p % e, I = $n(g, n) * c % e, $ = $n(I, es);
  if ($ * $ % e !== t)
    throw new Error("Cannot find square root");
  return $;
}
function ji(t, e = Vt.P) {
  if (t === Ut || e <= Ut)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = q(t, e), r = e, s = Ut, i = oe;
  for (; n !== Ut; ) {
    const a = r / n, c = r % n, f = s - i * a;
    r = n, n = c, s = i, i = f;
  }
  if (r !== oe)
    throw new Error("invert: does not exist");
  return q(s, e);
}
function Mb(t, e = Vt.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === Ut ? i : (n[a] = i, q(i * o, e)), oe), s = ji(r, e);
  return t.reduceRight((i, o, a) => o === Ut ? i : (n[a] = q(i * n[a], e), q(i * o, e)), s), n;
}
function Nb(t) {
  const e = t.length * 8 - Bs * 8, n = mn(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function xu(t, e = !1) {
  const n = Nb(t);
  if (e)
    return n;
  const { n: r } = Vt;
  return n >= r ? n - r : n;
}
let xi, lo;
class $0 {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return ge.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return lo(this.k, ...e);
  }
  checkSync() {
    if (typeof lo != "function")
      throw new mu("hmacSha256Sync needs to be set");
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
    return Jr(...n);
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
    return Jr(...n);
  }
}
function ki(t) {
  return Ut < t && t < Vt.n;
}
function ya(t) {
  return Ut < t && t < Vt.P;
}
function I0(t, e, n, r = !0) {
  const { n: s } = Vt, i = xu(t, !0);
  if (!ki(i))
    return;
  const o = ji(i, s), a = $t.BASE.multiply(i), c = q(a.x, s);
  if (c === Ut)
    return;
  const f = q(o * q(e + n * c, s), s);
  if (f === Ut)
    return;
  let h = new bn(c, f), l = (a.x === h.r ? 0 : 2) | Number(a.y & oe);
  return r && h.hasHighS() && (h = h.normalizeS(), l ^= 1), { sig: h, recovery: l };
}
function Ts(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Bs)
      throw new Error("Expected 32 bytes of private key");
    e = Ia(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Bs)
      throw new Error("Expected 32 bytes of private key");
    e = mn(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!ki(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Su(t) {
  return t instanceof $t ? (t.assertValidity(), t) : $t.fromHex(t);
}
function k0(t) {
  if (t instanceof bn)
    return t.assertValidity(), t;
  try {
    return bn.fromDER(t);
  } catch {
    return bn.fromCompact(t);
  }
}
function Bo(t, e = !1) {
  return $t.fromPrivateKey(t).toRawBytes(e);
}
function Ub(t, e, n, r = !1) {
  return $t.fromSignature(t, e, n).toRawBytes(r);
}
function Kf(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === va || r === $a : n ? r === va * 2 || r === $a * 2 : t instanceof $t;
}
function Au(t, e, n = !1) {
  if (Kf(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Kf(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Su(e);
  return r.assertValidity(), r.multiply(Ts(t)).toRawBytes(n);
}
function L0(t) {
  const e = t.length > Dn ? t.slice(0, Dn) : t;
  return mn(e);
}
function Pb(t) {
  const e = L0(t), n = q(e, Vt.n);
  return C0(n < Ut ? e : n);
}
function C0(t) {
  return Ii(t);
}
function B0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = or(t), s = Ts(e), i = [C0(s), Pb(r)];
  if (n != null) {
    n === !0 && (n = ge.randomBytes(Dn));
    const c = or(n);
    if (c.length !== Dn)
      throw new Error(`sign: Expected ${Dn} bytes of extra data`);
    i.push(c);
  }
  const o = Jr(...i), a = L0(r);
  return { seed: o, m: a, d: s };
}
function T0(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function Ob(t, e, n = {}) {
  const { seed: r, m: s, d: i } = B0(t, e, n.extraEntropy), o = new $0(v0, Bs);
  await o.reseed(r);
  let a;
  for (; !(a = I0(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return T0(a, n);
}
function Qa(t, e, n = {}) {
  const { seed: r, m: s, d: i } = B0(t, e, n.extraEntropy), o = new $0(v0, Bs);
  o.reseedSync(r);
  let a;
  for (; !(a = I0(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return T0(a, n);
}
const Db = { strict: !0 };
function Fb(t, e, n, r = Db) {
  let s;
  try {
    s = k0(t), e = or(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = xu(e);
  let c;
  try {
    c = Su(n);
  } catch {
    return !1;
  }
  const { n: f } = Vt, h = ji(o, f), l = q(a * h, f), y = q(i * h, f), p = $t.BASE.multiplyAndAddUnsafe(c, l, y);
  return p ? q(p.x, f) === i : !1;
}
function ka(t) {
  return q(mn(t), Vt.n);
}
class Li {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = or(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = mn(n.subarray(0, 32)), s = mn(n.subarray(32, 64));
    return new Li(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ya(e) || !ki(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return ns(this.r) + ns(this.s);
  }
  toRawBytes() {
    return rs(this.toHex());
  }
}
function jb(t) {
  return $t.fromPrivateKey(t).toRawX();
}
class _0 {
  constructor(e, n, r = ge.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = or(e);
    const { x: s, scalar: i } = this.getScalar(Ts(n));
    if (this.px = s, this.d = i, this.rand = or(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = $t.fromPrivateKey(e), r = n.hasEvenY() ? e : Vt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Ii(e ^ mn(n));
  }
  finalizeNonce(e) {
    const n = q(mn(e), Vt.n);
    if (n === Ut)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new Li(e.x, q(n + r * s, Vt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = ge.taggedHash, o = this.initNonce(n, await i(Qr.aux, s)), { R: a, rx: c, k: f } = this.finalizeNonce(await i(Qr.nonce, o, r, e)), h = ka(await i(Qr.challenge, c, r, e)), l = this.finalizeSig(a, f, h, n);
    return await N0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = ge.taggedHashSync, o = this.initNonce(n, i(Qr.aux, s)), { R: a, rx: c, k: f } = this.finalizeNonce(i(Qr.nonce, o, r, e)), h = ka(i(Qr.challenge, c, r, e)), l = this.finalizeSig(a, f, h, n);
    return U0(l, e, r) || this.error(), l;
  }
}
async function zb(t, e, n) {
  return new _0(t, e, n).calc();
}
function Rb(t, e, n) {
  return new _0(t, e, n).calcSync();
}
function H0(t, e, n) {
  const r = t instanceof Li, s = r ? t : Li.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: or(e),
    P: Su(n)
  };
}
function M0(t, e, n, r) {
  const s = $t.BASE.multiplyAndAddUnsafe(e, Ts(n), q(-r, Vt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function N0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = H0(t, e, n), a = ka(await ge.taggedHash(Qr.challenge, Ii(r), o.toRawX(), i));
    return M0(r, o, s, a);
  } catch {
    return !1;
  }
}
function U0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = H0(t, e, n), a = ka(ge.taggedHashSync(Qr.challenge, Ii(r), o.toRawX(), i));
    return M0(r, o, s, a);
  } catch (r) {
    if (r instanceof mu)
      throw r;
    return !1;
  }
}
const Gb = {
  Signature: Li,
  getPublicKey: jb,
  sign: zb,
  verify: N0,
  signSync: Rb,
  verifySync: U0
};
$t.BASE._setWindowSize(8);
const fn = {
  node: E0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Qr = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Ro = {}, ge = {
  bytesToHex: $i,
  hexToBytes: rs,
  concatBytes: Jr,
  mod: q,
  invert: ji,
  isValidPrivateKey(t) {
    try {
      return Ts(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Ii,
  _normalizePrivateKey: Ts,
  hashToPrivateKey: (t) => {
    t = or(t);
    const e = Bs + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = q(mn(t), Vt.n - oe) + oe;
    return Ii(n);
  },
  randomBytes: (t = 32) => {
    if (fn.web)
      return fn.web.getRandomValues(new Uint8Array(t));
    if (fn.node) {
      const { randomBytes: e } = fn.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => ge.hashToPrivateKey(ge.randomBytes(Bs + 8)),
  precompute(t = 8, e = $t.BASE) {
    const n = e === $t.BASE ? e : new $t(e.x, e.y);
    return n._setWindowSize(t), n.multiply(co), n;
  },
  sha256: async (...t) => {
    if (fn.web) {
      const e = await fn.web.subtle.digest("SHA-256", Jr(...t));
      return new Uint8Array(e);
    } else if (fn.node) {
      const { createHash: e } = fn.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (fn.web) {
      const n = await fn.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Jr(...e), s = await fn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (fn.node) {
      const { createHmac: n } = fn.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Ro[t];
    if (n === void 0) {
      const r = await ge.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Jr(r, r), Ro[t] = n;
    }
    return ge.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof xi != "function")
      throw new mu("sha256Sync is undefined, you need to set it");
    let n = Ro[t];
    if (n === void 0) {
      const r = xi(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Jr(r, r), Ro[t] = n;
    }
    return xi(n, ...e);
  },
  _JacobianPoint: Dt
};
Object.defineProperties(ge, {
  sha256Sync: {
    configurable: !1,
    get() {
      return xi;
    },
    set(t) {
      xi || (xi = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return lo;
    },
    set(t) {
      lo || (lo = t);
    }
  }
});
const Vb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Vt,
  Point: $t,
  Signature: bn,
  getPublicKey: Bo,
  getSharedSecret: Au,
  recoverPublicKey: Ub,
  schnorr: Gb,
  sign: Ob,
  signSync: Qa,
  utils: ge,
  verify: Fb
}, Symbol.toStringTag, { value: "Module" }));
var To = {};
To.byteLength = Yb;
var Kb = To.toByteArray = Qb, Wb = To.fromByteArray = e1, Qn = [], kn = [], qb = typeof Uint8Array < "u" ? Uint8Array : Array, Mc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var ui = 0, Xb = Mc.length; ui < Xb; ++ui)
  Qn[ui] = Mc[ui], kn[Mc.charCodeAt(ui)] = ui;
kn[45] = 62;
kn[95] = 63;
function P0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Yb(t) {
  var e = P0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Zb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Qb(t) {
  var e, n = P0(t), r = n[0], s = n[1], i = new qb(Zb(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = kn[t.charCodeAt(c)] << 18 | kn[t.charCodeAt(c + 1)] << 12 | kn[t.charCodeAt(c + 2)] << 6 | kn[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = kn[t.charCodeAt(c)] << 2 | kn[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = kn[t.charCodeAt(c)] << 10 | kn[t.charCodeAt(c + 1)] << 4 | kn[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function Jb(t) {
  return Qn[t >> 18 & 63] + Qn[t >> 12 & 63] + Qn[t >> 6 & 63] + Qn[t & 63];
}
function t1(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(Jb(r));
  return s.join("");
}
function e1(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(t1(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    Qn[e >> 2] + Qn[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Qn[e >> 10] + Qn[e >> 4 & 63] + Qn[e << 2 & 63] + "="
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
    const i = this.createCipher(e, n, r), o = new Uint8Array(ir(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(ir(i.update(s), i.final()));
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
async function O0() {
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
  var o = t.length, a = t.charAt(0), c = Math.log(o) / Math.log(256), f = Math.log(256) / Math.log(o);
  function h(p) {
    if (p instanceof Uint8Array || (ArrayBuffer.isView(p) ? p = new Uint8Array(p.buffer, p.byteOffset, p.byteLength) : Array.isArray(p) && (p = Uint8Array.from(p))), !(p instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (p.length === 0)
      return "";
    for (var S = 0, x = 0, L = 0, O = p.length; L !== O && p[L] === 0; )
      L++, S++;
    for (var P = (O - L) * f + 1 >>> 0, g = new Uint8Array(P); L !== O; ) {
      for (var I = p[L], $ = 0, N = P - 1; (I !== 0 || $ < x) && N !== -1; N--, $++)
        I += 256 * g[N] >>> 0, g[N] = I % o >>> 0, I = I / o >>> 0;
      if (I !== 0)
        throw new Error("Non-zero carry");
      x = $, L++;
    }
    for (var V = P - x; V !== P && g[V] === 0; )
      V++;
    for (var D = a.repeat(S); V < P; ++V)
      D += t.charAt(g[V]);
    return D;
  }
  function l(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var S = 0, x = 0, L = 0; p[S] === a; )
      x++, S++;
    for (var O = (p.length - S) * c + 1 >>> 0, P = new Uint8Array(O); p[S]; ) {
      var g = p.charCodeAt(S);
      if (g > 255)
        return;
      var I = e[g];
      if (I === 255)
        return;
      for (var $ = 0, N = O - 1; (I !== 0 || $ < L) && N !== -1; N--, $++)
        I += o * P[N] >>> 0, P[N] = I % 256 >>> 0, I = I / 256 >>> 0;
      if (I !== 0)
        throw new Error("Non-zero carry");
      L = $, S++;
    }
    for (var V = O - L; V !== O && P[V] === 0; )
      V++;
    for (var D = new Uint8Array(x + (O - V)), j = x; V !== O; )
      D[j++] = P[V++];
    return D;
  }
  function y(p) {
    var S = l(p);
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
var D0 = a1;
const c1 = D0, l1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var u1 = c1(l1);
const f1 = /* @__PURE__ */ c0(u1), d1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), F0 = Uint8Array.from({ length: 16 }, (t, e) => e), h1 = F0.map((t) => (9 * t + 5) % 16);
let Eu = [F0], vu = [h1];
for (let t = 0; t < 4; t++)
  for (let e of [Eu, vu])
    e.push(e[t].map((n) => d1[n]));
const j0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), p1 = Eu.map((t, e) => t.map((n) => j0[e][n])), g1 = vu.map((t, e) => t.map((n) => j0[e][n])), y1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), w1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Go = (t, e) => t << e | t >>> 32 - e;
function Wf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Vo = new Uint32Array(16);
let b1 = class extends bu {
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
      Vo[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, h = f, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const S = 4 - p, x = y1[p], L = w1[p], O = Eu[p], P = vu[p], g = p1[p], I = g1[p];
      for (let $ = 0; $ < 16; $++) {
        const N = Go(r + Wf(p, i, a, f) + Vo[O[$]] + x, g[$]) + l | 0;
        r = l, l = f, f = Go(a, 10) | 0, a = i, i = N;
      }
      for (let $ = 0; $ < 16; $++) {
        const N = Go(s + Wf(S, o, c, h) + Vo[P[$]] + L, I[$]) + y | 0;
        s = y, y = h, h = Go(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + f + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Vo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const m1 = qs(() => new b1());
function x1(t) {
  return m1(t);
}
const Ko = BigInt(2 ** 32 - 1), pl = BigInt(32);
function z0(t, e = !1) {
  return e ? { h: Number(t & Ko), l: Number(t >> pl & Ko) } : { h: Number(t >> pl & Ko) | 0, l: Number(t & Ko) | 0 };
}
function S1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = z0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const A1 = (t, e) => BigInt(t >>> 0) << pl | BigInt(e >>> 0), E1 = (t, e, n) => t >>> n, v1 = (t, e, n) => t << 32 - n | e >>> n, $1 = (t, e, n) => t >>> n | e << 32 - n, I1 = (t, e, n) => t << 32 - n | e >>> n, k1 = (t, e, n) => t << 64 - n | e >>> n - 32, L1 = (t, e, n) => t >>> n - 32 | e << 64 - n, C1 = (t, e) => e, B1 = (t, e) => t, T1 = (t, e, n) => t << n | e >>> 32 - n, _1 = (t, e, n) => e << n | t >>> 32 - n, H1 = (t, e, n) => e << n - 32 | t >>> 64 - n, M1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function N1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const U1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), P1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, O1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), D1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, F1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), j1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, bt = {
  fromBig: z0,
  split: S1,
  toBig: A1,
  shrSH: E1,
  shrSL: v1,
  rotrSH: $1,
  rotrSL: I1,
  rotrBH: k1,
  rotrBL: L1,
  rotr32H: C1,
  rotr32L: B1,
  rotlSH: T1,
  rotlSL: _1,
  rotlBH: H1,
  rotlBL: M1,
  add: N1,
  add3L: U1,
  add3H: P1,
  add4L: O1,
  add4H: D1,
  add5H: j1,
  add5L: F1
}, [z1, R1] = bt.split([
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
].map((t) => BigInt(t))), Cr = new Uint32Array(80), Br = new Uint32Array(80);
let Ja = class extends bu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: h, Fh: l, Fl: y, Gh: p, Gl: S, Hh: x, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, f, h, l, y, p, S, x, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, h, l, y, p, S, x, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let g = 0; g < 16; g++, n += 4)
      Cr[g] = e.getUint32(n), Br[g] = e.getUint32(n += 4);
    for (let g = 16; g < 80; g++) {
      const I = Cr[g - 15] | 0, $ = Br[g - 15] | 0, N = bt.rotrSH(I, $, 1) ^ bt.rotrSH(I, $, 8) ^ bt.shrSH(I, $, 7), V = bt.rotrSL(I, $, 1) ^ bt.rotrSL(I, $, 8) ^ bt.shrSL(I, $, 7), D = Cr[g - 2] | 0, j = Br[g - 2] | 0, A = bt.rotrSH(D, j, 19) ^ bt.rotrBH(D, j, 61) ^ bt.shrSH(D, j, 6), B = bt.rotrSL(D, j, 19) ^ bt.rotrBL(D, j, 61) ^ bt.shrSL(D, j, 6), _ = bt.add4L(V, B, Br[g - 7], Br[g - 16]), T = bt.add4H(_, N, A, Cr[g - 7], Cr[g - 16]);
      Cr[g] = T | 0, Br[g] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: h, Eh: l, El: y, Fh: p, Fl: S, Gh: x, Gl: L, Hh: O, Hl: P } = this;
    for (let g = 0; g < 80; g++) {
      const I = bt.rotrSH(l, y, 14) ^ bt.rotrSH(l, y, 18) ^ bt.rotrBH(l, y, 41), $ = bt.rotrSL(l, y, 14) ^ bt.rotrSL(l, y, 18) ^ bt.rotrBL(l, y, 41), N = l & p ^ ~l & x, V = y & S ^ ~y & L, D = bt.add5L(P, $, V, R1[g], Br[g]), j = bt.add5H(D, O, I, N, z1[g], Cr[g]), A = D | 0, B = bt.rotrSH(r, s, 28) ^ bt.rotrBH(r, s, 34) ^ bt.rotrBH(r, s, 39), _ = bt.rotrSL(r, s, 28) ^ bt.rotrBL(r, s, 34) ^ bt.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, J = s & o ^ s & c ^ o & c;
      O = x | 0, P = L | 0, x = p | 0, L = S | 0, p = l | 0, S = y | 0, { h: l, l: y } = bt.add(f | 0, h | 0, j | 0, A | 0), f = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = bt.add3L(A, _, J);
      r = bt.add3H(z, j, B, T), s = z | 0;
    }
    ({ h: r, l: s } = bt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = bt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = bt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: h } = bt.add(this.Dh | 0, this.Dl | 0, f | 0, h | 0), { h: l, l: y } = bt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: S } = bt.add(this.Fh | 0, this.Fl | 0, p | 0, S | 0), { h: x, l: L } = bt.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: O, l: P } = bt.add(this.Hh | 0, this.Hl | 0, O | 0, P | 0), this.set(r, s, i, o, a, c, f, h, l, y, p, S, x, L, O, P);
  }
  roundClean() {
    Cr.fill(0), Br.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, G1 = class extends Ja {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, V1 = class extends Ja {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, K1 = class extends Ja {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const W1 = qs(() => new Ja());
qs(() => new G1());
qs(() => new V1());
qs(() => new K1());
function R0(t) {
  return vi(t);
}
function q1(t) {
  return W1(t);
}
const X1 = 0;
ge.hmacSha256Sync = (t, ...e) => {
  const n = Za.create(vi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Y1() {
  return ot(ge.randomPrivateKey());
}
function Z1(t) {
  const e = vi(vi(t));
  return f1.encode(ir(t, e).slice(0, t.length + 4));
}
function Q1(t, e) {
  return Z1(ir(new Uint8Array([t]), e.slice(0, 20)));
}
function G0(t, e = X1) {
  const n = typeof t == "string" ? Pt(t) : t, r = x1(R0(n));
  return Q1(e, r);
}
function V0(t) {
  const e = yu(t);
  return ot(Bo(e.slice(0, 32), !0));
}
ge.hmacSha256Sync = (t, ...e) => {
  const n = Za.create(vi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var La;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(La || (La = {}));
async function J1(t, e, n) {
  return await (await O0()).encrypt("aes-256-cbc", e, t, n);
}
async function t2(t, e, n) {
  return await (await O0()).decrypt("aes-256-cbc", e, t, n);
}
function K0(t, e) {
  return Za(vi, t, e);
}
function e2(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function W0(t) {
  const e = q1(t);
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
    reason: La.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: La.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !n2(t))
    return e;
  try {
    return $t.fromHex(t).assertValidity(), {
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
  const i = ge.randomPrivateKey(), o = Bo(i, !0);
  let a = Au(i, t, !0);
  a = a.slice(1);
  const c = W0(a), f = ge.randomBytes(16), h = await J1(f, c.encryptionKey, e), l = ir(f, o, h), y = K0(c.hmacKey, l);
  let p;
  if (!r || r === "hex")
    p = ot(h);
  else if (r === "base64")
    p = Wb(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const S = {
    iv: ot(f),
    ephemeralPK: ot(o),
    cipherText: p,
    mac: ot(y),
    wasString: n
  };
  return r && r !== "hex" && (S.cipherTextEncoding = r), S;
}
async function q0(t, e) {
  if (!e.ephemeralPK)
    throw new Nf("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Au(t, n, !0);
  r = r.slice(1);
  const s = W0(r), i = Pt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Pt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Kb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = ir(i, Pt(n), o), c = K0(s.hmacKey, a), f = Pt(e.mac);
  if (!e2(f, c))
    throw new Nf("Decryption failed: failure in MAC check");
  const h = await t2(i, s.encryptionKey, o);
  return e.wasString ? Co(h) : h;
}
function i2(t, e) {
  const n = typeof e == "string" ? Ws(e) : e, r = V0(t), s = R0(n), i = Qa(s, t);
  return {
    signature: ot(i),
    publicKey: r
  };
}
async function o2(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = V0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Ws(t) : t, o = await s2(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = i2(r, a), f = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(f);
  }
  return a;
}
function a2(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return q0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Ne = {}, Ci = {}, Ke = {};
Object.defineProperty(Ke, "__esModule", { value: !0 });
Ke.decode = Ke.encode = Ke.unescape = Ke.escape = Ke.pad = void 0;
const X0 = To;
function $u(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
Ke.pad = $u;
function Y0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Ke.escape = Y0;
function Z0(t) {
  return $u(t).replace(/-/g, "+").replace(/_/g, "/");
}
Ke.unescape = Z0;
function c2(t) {
  return Y0((0, X0.fromByteArray)(new TextEncoder().encode(t)));
}
Ke.encode = c2;
function l2(t) {
  return new TextDecoder().decode((0, X0.toByteArray)($u(Z0(t))));
}
Ke.decode = l2;
var tc = {}, ec = {}, Q0 = {}, xr = {}, nc = {};
Object.defineProperty(nc, "__esModule", { value: !0 });
nc.crypto = void 0;
nc.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = f, t.clean = h, t.createView = l, t.rotr = y, t.rotl = p, t.byteSwap = S, t.byteSwap32 = x, t.bytesToHex = P, t.hexToBytes = $, t.asyncLoop = V, t.utf8ToBytes = D, t.bytesToUtf8 = j, t.toBytes = A, t.kdfInputToBytes = B, t.concatBytes = _, t.checkOpts = T, t.createHasher = z, t.createOptHasher = Ot, t.createXOFer = ft, t.randomBytes = te;
  const e = nc;
  function n(E) {
    return E instanceof Uint8Array || ArrayBuffer.isView(E) && E.constructor.name === "Uint8Array";
  }
  function r(E) {
    if (!Number.isSafeInteger(E) || E < 0)
      throw new Error("positive integer expected, got " + E);
  }
  function s(E, ...M) {
    if (!n(E))
      throw new Error("Uint8Array expected");
    if (M.length > 0 && !M.includes(E.length))
      throw new Error("Uint8Array expected of length " + M + ", got length=" + E.length);
  }
  function i(E) {
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
    s(E);
    const dt = M.outputLen;
    if (E.length < dt)
      throw new Error("digestInto() expects output buffer of length at least " + dt);
  }
  function c(E) {
    return new Uint8Array(E.buffer, E.byteOffset, E.byteLength);
  }
  function f(E) {
    return new Uint32Array(E.buffer, E.byteOffset, Math.floor(E.byteLength / 4));
  }
  function h(...E) {
    for (let M = 0; M < E.length; M++)
      E[M].fill(0);
  }
  function l(E) {
    return new DataView(E.buffer, E.byteOffset, E.byteLength);
  }
  function y(E, M) {
    return E << 32 - M | E >>> M;
  }
  function p(E, M) {
    return E << M | E >>> 32 - M >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function S(E) {
    return E << 24 & 4278190080 | E << 8 & 16711680 | E >>> 8 & 65280 | E >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (E) => E : (E) => S(E), t.byteSwapIfBE = t.swap8IfBE;
  function x(E) {
    for (let M = 0; M < E.length; M++)
      E[M] = S(E[M]);
    return E;
  }
  t.swap32IfBE = t.isLE ? (E) => E : x;
  const L = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", O = /* @__PURE__ */ Array.from({ length: 256 }, (E, M) => M.toString(16).padStart(2, "0"));
  function P(E) {
    if (s(E), L)
      return E.toHex();
    let M = "";
    for (let dt = 0; dt < E.length; dt++)
      M += O[E[dt]];
    return M;
  }
  const g = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function I(E) {
    if (E >= g._0 && E <= g._9)
      return E - g._0;
    if (E >= g.A && E <= g.F)
      return E - (g.A - 10);
    if (E >= g.a && E <= g.f)
      return E - (g.a - 10);
  }
  function $(E) {
    if (typeof E != "string")
      throw new Error("hex string expected, got " + typeof E);
    if (L)
      return Uint8Array.fromHex(E);
    const M = E.length, dt = M / 2;
    if (M % 2)
      throw new Error("hex string expected, got unpadded hex of length " + M);
    const Ct = new Uint8Array(dt);
    for (let It = 0, kt = 0; It < dt; It++, kt += 2) {
      const re = I(E.charCodeAt(kt)), ce = I(E.charCodeAt(kt + 1));
      if (re === void 0 || ce === void 0) {
        const Kt = E[kt] + E[kt + 1];
        throw new Error('hex string expected, got non-hex character "' + Kt + '" at index ' + kt);
      }
      Ct[It] = re * 16 + ce;
    }
    return Ct;
  }
  const N = async () => {
  };
  t.nextTick = N;
  async function V(E, M, dt) {
    let Ct = Date.now();
    for (let It = 0; It < E; It++) {
      dt(It);
      const kt = Date.now() - Ct;
      kt >= 0 && kt < M || (await (0, t.nextTick)(), Ct += kt);
    }
  }
  function D(E) {
    if (typeof E != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(E));
  }
  function j(E) {
    return new TextDecoder().decode(E);
  }
  function A(E) {
    return typeof E == "string" && (E = D(E)), s(E), E;
  }
  function B(E) {
    return typeof E == "string" && (E = D(E)), s(E), E;
  }
  function _(...E) {
    let M = 0;
    for (let Ct = 0; Ct < E.length; Ct++) {
      const It = E[Ct];
      s(It), M += It.length;
    }
    const dt = new Uint8Array(M);
    for (let Ct = 0, It = 0; Ct < E.length; Ct++) {
      const kt = E[Ct];
      dt.set(kt, It), It += kt.length;
    }
    return dt;
  }
  function T(E, M) {
    if (M !== void 0 && {}.toString.call(M) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(E, M);
  }
  class J {
  }
  t.Hash = J;
  function z(E) {
    const M = (Ct) => E().update(A(Ct)).digest(), dt = E();
    return M.outputLen = dt.outputLen, M.blockLen = dt.blockLen, M.create = () => E(), M;
  }
  function Ot(E) {
    const M = (Ct, It) => E(It).update(A(Ct)).digest(), dt = E({});
    return M.outputLen = dt.outputLen, M.blockLen = dt.blockLen, M.create = (Ct) => E(Ct), M;
  }
  function ft(E) {
    const M = (Ct, It) => E(It).update(A(Ct)).digest(), dt = E({});
    return M.outputLen = dt.outputLen, M.blockLen = dt.blockLen, M.create = (Ct) => E(Ct), M;
  }
  t.wrapConstructor = z, t.wrapConstructorWithOpts = Ot, t.wrapXOFConstructorWithOpts = ft;
  function te(E = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(E));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(E));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(xr);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = xr;
  class n extends e.Hash {
    constructor(i, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(i);
      const a = (0, e.toBytes)(o);
      if (this.iHash = i.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, f = new Uint8Array(c);
      f.set(a.length > c ? i.create().update(a).digest() : a);
      for (let h = 0; h < f.length; h++)
        f[h] ^= 54;
      this.iHash.update(f), this.oHash = i.create();
      for (let h = 0; h < f.length; h++)
        f[h] ^= 106;
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
      const { oHash: o, iHash: a, finished: c, destroyed: f, blockLen: h, outputLen: l } = this;
      return i = i, i.finished = c, i.destroyed = f, i.blockLen = h, i.outputLen = l, i.oHash = o._cloneInto(i.oHash), i.iHash = a._cloneInto(i.iHash), i;
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
})(Q0);
var yn = {}, Qt = {}, We = {};
Object.defineProperty(We, "__esModule", { value: !0 });
We.SHA512_IV = We.SHA384_IV = We.SHA224_IV = We.SHA256_IV = We.HashMD = void 0;
We.setBigUint64 = J0;
We.Chi = u2;
We.Maj = f2;
const Kn = xr;
function J0(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
function u2(t, e, n) {
  return t & e ^ ~t & n;
}
function f2(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
let d2 = class extends Kn.Hash {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = (0, Kn.createView)(this.buffer);
  }
  update(e) {
    (0, Kn.aexists)(this), e = (0, Kn.toBytes)(e), (0, Kn.abytes)(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = (0, Kn.createView)(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    (0, Kn.aexists)(this), (0, Kn.aoutput)(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, (0, Kn.clean)(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    J0(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = (0, Kn.createView)(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
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
};
We.HashMD = d2;
We.SHA256_IV = Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
We.SHA224_IV = Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]);
We.SHA384_IV = Uint32Array.from([
  3418070365,
  3238371032,
  1654270250,
  914150663,
  2438529370,
  812702999,
  355462360,
  4144912697,
  1731405415,
  4290775857,
  2394180231,
  1750603025,
  3675008525,
  1694076839,
  1203062813,
  3204075428
]);
We.SHA512_IV = Uint32Array.from([
  1779033703,
  4089235720,
  3144134277,
  2227873595,
  1013904242,
  4271175723,
  2773480762,
  1595750129,
  1359893119,
  2917565137,
  2600822924,
  725511199,
  528734635,
  4215389547,
  1541459225,
  327033209
]);
var pt = {};
Object.defineProperty(pt, "__esModule", { value: !0 });
pt.toBig = pt.shrSL = pt.shrSH = pt.rotrSL = pt.rotrSH = pt.rotrBL = pt.rotrBH = pt.rotr32L = pt.rotr32H = pt.rotlSL = pt.rotlSH = pt.rotlBL = pt.rotlBH = pt.add5L = pt.add5H = pt.add4L = pt.add4H = pt.add3L = pt.add3H = void 0;
pt.add = pp;
pt.fromBig = Iu;
pt.split = tp;
const Wo = /* @__PURE__ */ BigInt(2 ** 32 - 1), gl = /* @__PURE__ */ BigInt(32);
function Iu(t, e = !1) {
  return e ? { h: Number(t & Wo), l: Number(t >> gl & Wo) } : { h: Number(t >> gl & Wo) | 0, l: Number(t & Wo) | 0 };
}
function tp(t, e = !1) {
  const n = t.length;
  let r = new Uint32Array(n), s = new Uint32Array(n);
  for (let i = 0; i < n; i++) {
    const { h: o, l: a } = Iu(t[i], e);
    [r[i], s[i]] = [o, a];
  }
  return [r, s];
}
const ep = (t, e) => BigInt(t >>> 0) << gl | BigInt(e >>> 0);
pt.toBig = ep;
const np = (t, e, n) => t >>> n;
pt.shrSH = np;
const rp = (t, e, n) => t << 32 - n | e >>> n;
pt.shrSL = rp;
const sp = (t, e, n) => t >>> n | e << 32 - n;
pt.rotrSH = sp;
const ip = (t, e, n) => t << 32 - n | e >>> n;
pt.rotrSL = ip;
const op = (t, e, n) => t << 64 - n | e >>> n - 32;
pt.rotrBH = op;
const ap = (t, e, n) => t >>> n - 32 | e << 64 - n;
pt.rotrBL = ap;
const cp = (t, e) => e;
pt.rotr32H = cp;
const lp = (t, e) => t;
pt.rotr32L = lp;
const up = (t, e, n) => t << n | e >>> 32 - n;
pt.rotlSH = up;
const fp = (t, e, n) => e << n | t >>> 32 - n;
pt.rotlSL = fp;
const dp = (t, e, n) => e << n - 32 | t >>> 64 - n;
pt.rotlBH = dp;
const hp = (t, e, n) => t << n - 32 | e >>> 64 - n;
pt.rotlBL = hp;
function pp(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const gp = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0);
pt.add3L = gp;
const yp = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0;
pt.add3H = yp;
const wp = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0);
pt.add4L = wp;
const bp = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0;
pt.add4H = bp;
const mp = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0);
pt.add5L = mp;
const xp = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0;
pt.add5H = xp;
const h2 = {
  fromBig: Iu,
  split: tp,
  toBig: ep,
  shrSH: np,
  shrSL: rp,
  rotrSH: sp,
  rotrSL: ip,
  rotrBH: op,
  rotrBL: ap,
  rotr32H: cp,
  rotr32L: lp,
  rotlSH: up,
  rotlSL: fp,
  rotlBH: dp,
  rotlBL: hp,
  add: pp,
  add3L: gp,
  add3H: yp,
  add4L: wp,
  add4H: bp,
  add5H: xp,
  add5L: mp
};
pt.default = h2;
Object.defineProperty(Qt, "__esModule", { value: !0 });
Qt.sha512_224 = Qt.sha512_256 = Qt.sha384 = Qt.sha512 = Qt.sha224 = Qt.sha256 = Qt.SHA512_256 = Qt.SHA512_224 = Qt.SHA384 = Qt.SHA512 = Qt.SHA224 = Qt.SHA256 = void 0;
const it = We, mt = pt, ve = xr, p2 = /* @__PURE__ */ Uint32Array.from([
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
]), Tr = /* @__PURE__ */ new Uint32Array(64);
let ku = class extends it.HashMD {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = it.SHA256_IV[0] | 0, this.B = it.SHA256_IV[1] | 0, this.C = it.SHA256_IV[2] | 0, this.D = it.SHA256_IV[3] | 0, this.E = it.SHA256_IV[4] | 0, this.F = it.SHA256_IV[5] | 0, this.G = it.SHA256_IV[6] | 0, this.H = it.SHA256_IV[7] | 0;
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
      Tr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Tr[l - 15], p = Tr[l - 2], S = (0, ve.rotr)(y, 7) ^ (0, ve.rotr)(y, 18) ^ y >>> 3, x = (0, ve.rotr)(p, 17) ^ (0, ve.rotr)(p, 19) ^ p >>> 10;
      Tr[l] = x + Tr[l - 7] + S + Tr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = (0, ve.rotr)(a, 6) ^ (0, ve.rotr)(a, 11) ^ (0, ve.rotr)(a, 25), p = h + y + (0, it.Chi)(a, c, f) + p2[l] + Tr[l] | 0, x = ((0, ve.rotr)(r, 2) ^ (0, ve.rotr)(r, 13) ^ (0, ve.rotr)(r, 22)) + (0, it.Maj)(r, s, i) | 0;
      h = f, f = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, f, h);
  }
  roundClean() {
    (0, ve.clean)(Tr);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), (0, ve.clean)(this.buffer);
  }
};
Qt.SHA256 = ku;
let Sp = class extends ku {
  constructor() {
    super(28), this.A = it.SHA224_IV[0] | 0, this.B = it.SHA224_IV[1] | 0, this.C = it.SHA224_IV[2] | 0, this.D = it.SHA224_IV[3] | 0, this.E = it.SHA224_IV[4] | 0, this.F = it.SHA224_IV[5] | 0, this.G = it.SHA224_IV[6] | 0, this.H = it.SHA224_IV[7] | 0;
  }
};
Qt.SHA224 = Sp;
const Ap = mt.split([
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
].map((t) => BigInt(t))), g2 = Ap[0], y2 = Ap[1], _r = /* @__PURE__ */ new Uint32Array(80), Hr = /* @__PURE__ */ new Uint32Array(80);
let _o = class extends it.HashMD {
  constructor(e = 64) {
    super(128, e, 16, !1), this.Ah = it.SHA512_IV[0] | 0, this.Al = it.SHA512_IV[1] | 0, this.Bh = it.SHA512_IV[2] | 0, this.Bl = it.SHA512_IV[3] | 0, this.Ch = it.SHA512_IV[4] | 0, this.Cl = it.SHA512_IV[5] | 0, this.Dh = it.SHA512_IV[6] | 0, this.Dl = it.SHA512_IV[7] | 0, this.Eh = it.SHA512_IV[8] | 0, this.El = it.SHA512_IV[9] | 0, this.Fh = it.SHA512_IV[10] | 0, this.Fl = it.SHA512_IV[11] | 0, this.Gh = it.SHA512_IV[12] | 0, this.Gl = it.SHA512_IV[13] | 0, this.Hh = it.SHA512_IV[14] | 0, this.Hl = it.SHA512_IV[15] | 0;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: h, Fh: l, Fl: y, Gh: p, Gl: S, Hh: x, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, f, h, l, y, p, S, x, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, h, l, y, p, S, x, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let g = 0; g < 16; g++, n += 4)
      _r[g] = e.getUint32(n), Hr[g] = e.getUint32(n += 4);
    for (let g = 16; g < 80; g++) {
      const I = _r[g - 15] | 0, $ = Hr[g - 15] | 0, N = mt.rotrSH(I, $, 1) ^ mt.rotrSH(I, $, 8) ^ mt.shrSH(I, $, 7), V = mt.rotrSL(I, $, 1) ^ mt.rotrSL(I, $, 8) ^ mt.shrSL(I, $, 7), D = _r[g - 2] | 0, j = Hr[g - 2] | 0, A = mt.rotrSH(D, j, 19) ^ mt.rotrBH(D, j, 61) ^ mt.shrSH(D, j, 6), B = mt.rotrSL(D, j, 19) ^ mt.rotrBL(D, j, 61) ^ mt.shrSL(D, j, 6), _ = mt.add4L(V, B, Hr[g - 7], Hr[g - 16]), T = mt.add4H(_, N, A, _r[g - 7], _r[g - 16]);
      _r[g] = T | 0, Hr[g] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: h, Eh: l, El: y, Fh: p, Fl: S, Gh: x, Gl: L, Hh: O, Hl: P } = this;
    for (let g = 0; g < 80; g++) {
      const I = mt.rotrSH(l, y, 14) ^ mt.rotrSH(l, y, 18) ^ mt.rotrBH(l, y, 41), $ = mt.rotrSL(l, y, 14) ^ mt.rotrSL(l, y, 18) ^ mt.rotrBL(l, y, 41), N = l & p ^ ~l & x, V = y & S ^ ~y & L, D = mt.add5L(P, $, V, y2[g], Hr[g]), j = mt.add5H(D, O, I, N, g2[g], _r[g]), A = D | 0, B = mt.rotrSH(r, s, 28) ^ mt.rotrBH(r, s, 34) ^ mt.rotrBH(r, s, 39), _ = mt.rotrSL(r, s, 28) ^ mt.rotrBL(r, s, 34) ^ mt.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, J = s & o ^ s & c ^ o & c;
      O = x | 0, P = L | 0, x = p | 0, L = S | 0, p = l | 0, S = y | 0, { h: l, l: y } = mt.add(f | 0, h | 0, j | 0, A | 0), f = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = mt.add3L(A, _, J);
      r = mt.add3H(z, j, B, T), s = z | 0;
    }
    ({ h: r, l: s } = mt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = mt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = mt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: h } = mt.add(this.Dh | 0, this.Dl | 0, f | 0, h | 0), { h: l, l: y } = mt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: S } = mt.add(this.Fh | 0, this.Fl | 0, p | 0, S | 0), { h: x, l: L } = mt.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: O, l: P } = mt.add(this.Hh | 0, this.Hl | 0, O | 0, P | 0), this.set(r, s, i, o, a, c, f, h, l, y, p, S, x, L, O, P);
  }
  roundClean() {
    (0, ve.clean)(_r, Hr);
  }
  destroy() {
    (0, ve.clean)(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
Qt.SHA512 = _o;
let Ep = class extends _o {
  constructor() {
    super(48), this.Ah = it.SHA384_IV[0] | 0, this.Al = it.SHA384_IV[1] | 0, this.Bh = it.SHA384_IV[2] | 0, this.Bl = it.SHA384_IV[3] | 0, this.Ch = it.SHA384_IV[4] | 0, this.Cl = it.SHA384_IV[5] | 0, this.Dh = it.SHA384_IV[6] | 0, this.Dl = it.SHA384_IV[7] | 0, this.Eh = it.SHA384_IV[8] | 0, this.El = it.SHA384_IV[9] | 0, this.Fh = it.SHA384_IV[10] | 0, this.Fl = it.SHA384_IV[11] | 0, this.Gh = it.SHA384_IV[12] | 0, this.Gl = it.SHA384_IV[13] | 0, this.Hh = it.SHA384_IV[14] | 0, this.Hl = it.SHA384_IV[15] | 0;
  }
};
Qt.SHA384 = Ep;
const Fe = /* @__PURE__ */ Uint32Array.from([
  2352822216,
  424955298,
  1944164710,
  2312950998,
  502970286,
  855612546,
  1738396948,
  1479516111,
  258812777,
  2077511080,
  2011393907,
  79989058,
  1067287976,
  1780299464,
  286451373,
  2446758561
]), je = /* @__PURE__ */ Uint32Array.from([
  573645204,
  4230739756,
  2673172387,
  3360449730,
  596883563,
  1867755857,
  2520282905,
  1497426621,
  2519219938,
  2827943907,
  3193839141,
  1401305490,
  721525244,
  746961066,
  246885852,
  2177182882
]);
let vp = class extends _o {
  constructor() {
    super(28), this.Ah = Fe[0] | 0, this.Al = Fe[1] | 0, this.Bh = Fe[2] | 0, this.Bl = Fe[3] | 0, this.Ch = Fe[4] | 0, this.Cl = Fe[5] | 0, this.Dh = Fe[6] | 0, this.Dl = Fe[7] | 0, this.Eh = Fe[8] | 0, this.El = Fe[9] | 0, this.Fh = Fe[10] | 0, this.Fl = Fe[11] | 0, this.Gh = Fe[12] | 0, this.Gl = Fe[13] | 0, this.Hh = Fe[14] | 0, this.Hl = Fe[15] | 0;
  }
};
Qt.SHA512_224 = vp;
let $p = class extends _o {
  constructor() {
    super(32), this.Ah = je[0] | 0, this.Al = je[1] | 0, this.Bh = je[2] | 0, this.Bl = je[3] | 0, this.Ch = je[4] | 0, this.Cl = je[5] | 0, this.Dh = je[6] | 0, this.Dl = je[7] | 0, this.Eh = je[8] | 0, this.El = je[9] | 0, this.Fh = je[10] | 0, this.Fl = je[11] | 0, this.Gh = je[12] | 0, this.Gl = je[13] | 0, this.Hh = je[14] | 0, this.Hl = je[15] | 0;
  }
};
Qt.SHA512_256 = $p;
Qt.sha256 = (0, ve.createHasher)(() => new ku());
Qt.sha224 = (0, ve.createHasher)(() => new Sp());
Qt.sha512 = (0, ve.createHasher)(() => new _o());
Qt.sha384 = (0, ve.createHasher)(() => new Ep());
Qt.sha512_256 = (0, ve.createHasher)(() => new $p());
Qt.sha512_224 = (0, ve.createHasher)(() => new vp());
Object.defineProperty(yn, "__esModule", { value: !0 });
yn.sha224 = yn.SHA224 = yn.sha256 = yn.SHA256 = void 0;
const rc = Qt;
yn.SHA256 = rc.SHA256;
yn.sha256 = rc.sha256;
yn.SHA224 = rc.SHA224;
yn.sha224 = rc.sha224;
const w2 = /* @__PURE__ */ l0(Vb);
var Bi = {};
Object.defineProperty(Bi, "__esModule", { value: !0 });
Bi.joseToDer = Bi.derToJose = void 0;
const Ip = To, kp = Ke;
function Nc(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const b2 = {
  ES256: Nc(256),
  ES384: Nc(384),
  ES512: Nc(521)
};
function Lp(t) {
  const e = b2[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Ca = 128, Cp = 0, m2 = 32, x2 = 16, S2 = 2, Bp = x2 | m2 | Cp << 6, Ba = S2 | Cp << 6;
function Tp(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Ip.toByteArray)((0, kp.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function A2(t, e) {
  const n = Tp(t), r = Lp(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Bp)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Ca | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== Ba)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const f = o;
  if (o += c, n[o++] !== Ba)
    throw new Error('Could not find expected "int" for "s"');
  const h = n[o++];
  if (i - o !== h)
    throw new Error(`"s" specified length of "${h}", expected "${i - o}"`);
  if (s < h)
    throw new Error(`"s" specified length of "${h}", max of "${s}" is acceptable`);
  const l = o;
  if (o += h, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const y = r - c, p = r - h, S = new Uint8Array(y + c + p + h);
  for (o = 0; o < y; ++o)
    S[o] = 0;
  S.set(n.subarray(f + Math.max(-y, 0), f + c), o), o = r;
  for (const x = o; o < x + p; ++o)
    S[o] = 0;
  return S.set(n.subarray(l + Math.max(-p, 0), l + h), o), (0, kp.escape)((0, Ip.fromByteArray)(S));
}
Bi.derToJose = A2;
function qf(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Ca && --r, r;
}
function E2(t, e) {
  t = Tp(t);
  const n = Lp(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = qf(t, 0, n), i = qf(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, f = c < Ca, h = new Uint8Array((f ? 2 : 3) + c);
  let l = 0;
  return h[l++] = Bp, f ? h[l++] = c : (h[l++] = Ca | 1, h[l++] = c & 255), h[l++] = Ba, h[l++] = o, s < 0 ? (h[l++] = 0, h.set(t.subarray(0, n), l), l += n) : (h.set(t.subarray(s, n), l), l += n - s), h[l++] = Ba, h[l++] = a, i < 0 ? (h[l++] = 0, h.set(t.subarray(n), l)) : h.set(t.subarray(n + i), l), h;
}
Bi.joseToDer = E2;
var br = {};
Object.defineProperty(br, "__esModule", { value: !0 });
br.InvalidTokenError = br.MissingParametersError = void 0;
class v2 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
br.MissingParametersError = v2;
class $2 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
br.InvalidTokenError = $2;
Object.defineProperty(ec, "__esModule", { value: !0 });
ec.SECP256K1Client = void 0;
const I2 = Q0, k2 = yn, wa = w2, Xf = Bi, Yf = br, Zf = xr;
wa.utils.hmacSha256Sync = (t, ...e) => {
  const n = I2.hmac.create(k2.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class _p {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Zf.bytesToHex)(wa.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Yf.MissingParametersError("a signing input hash and private key are all required");
    const s = wa.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Zf.bytesToHex)(s);
    if (r === "jose")
      return (0, Xf.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Xf.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Yf.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return wa.verify(n, e, r, { strict: !1 });
  }
}
ec.SECP256K1Client = _p;
_p.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = ec;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(tc);
var _s = {};
const L2 = /* @__PURE__ */ l0(E0);
var C2 = Ye && Ye.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(h) {
      try {
        f(r.next(h));
      } catch (l) {
        o(l);
      }
    }
    function c(h) {
      try {
        f(r.throw(h));
      } catch (l) {
        o(l);
      }
    }
    function f(h) {
      h.done ? i(h.value) : s(h.value).then(a, c);
    }
    f((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(_s, "__esModule", { value: !0 });
_s.hashSha256Async = _s.hashSha256 = void 0;
const B2 = yn;
function Hp(t) {
  return (0, B2.sha256)(t);
}
_s.hashSha256 = Hp;
function T2(t) {
  return C2(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = L2;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Hp(t));
    }
  });
}
_s.hashSha256Async = T2;
var _2 = Ye && Ye.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(h) {
      try {
        f(r.next(h));
      } catch (l) {
        o(l);
      }
    }
    function c(h) {
      try {
        f(r.throw(h));
      } catch (l) {
        o(l);
      }
    }
    function f(h) {
      h.done ? i(h.value) : s(h.value).then(a, c);
    }
    f((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Ci, "__esModule", { value: !0 });
Ci.TokenSigner = Ci.createUnsecuredToken = void 0;
const yl = Ke, Qf = tc, H2 = br, Jf = _s;
function wl(t, e) {
  const n = [], r = yl.encode(JSON.stringify(e));
  n.push(r);
  const s = yl.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function M2(t) {
  return wl(t, { typ: "JWT", alg: "none" }) + ".";
}
Ci.createUnsecuredToken = M2;
class N2 {
  constructor(e, n) {
    if (!(e && n))
      throw new H2.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Qf.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Qf.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = wl(e, s), o = (0, Jf.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return _2(this, void 0, void 0, function* () {
      const s = this.header(r), i = wl(e, s), o = yield (0, Jf.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [yl.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Ci.TokenSigner = N2;
var sc = {};
Object.defineProperty(sc, "__esModule", { value: !0 });
sc.TokenVerifier = void 0;
const U2 = Ke, td = tc, P2 = br, qo = _s;
class O2 {
  constructor(e, n) {
    if (!(e && n))
      throw new P2.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !td.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = td.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, qo.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, qo.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), U2.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, qo.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, qo.hashSha256)(r);
      return i(o);
    }
  }
}
sc.TokenVerifier = O2;
var ic = {};
Object.defineProperty(ic, "__esModule", { value: !0 });
ic.decodeToken = void 0;
const Xo = Ke;
function D2(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Xo.decode(e[0])), r = JSON.parse(Xo.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Xo.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Xo.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
ic.decodeToken = D2;
(function(t) {
  var e = Ye && Ye.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = Ye && Ye.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Ci, t), n(sc, t), n(ic, t), n(br, t), n(tc, t);
})(Ne);
function F2(t) {
  return `did:btc-addr:${t}`;
}
function j2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Mf("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Mf('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Mp(t) {
  if (t)
    return j2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const z2 = "1.4.0";
function R2() {
  return Y1();
}
function G2(t, e, n, r = h0.slice(), s, i = Ww().getTime(), o = {}) {
  const a = (p) => {
    const S = pu("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return S == null ? void 0 : S.origin;
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
    version: z2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), f = Ne.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [f];
  const h = G0(f);
  return c.iss = F2(h), new Ne.TokenSigner("ES256k", t).sign(c);
}
async function ed(t, e) {
  const n = Co(Pt(e)), r = JSON.parse(n), s = await q0(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function V2(t) {
  const e = Ne.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Ne.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function K2(t) {
  const e = Ne.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Mp(e.iss);
  if (n.length === 1) {
    if (G0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function W2(t) {
  const e = Ne.decodeToken(t).payload;
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
function q2(t) {
  const e = Ne.decodeToken(t).payload;
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
function X2(t) {
  const e = [
    q2(t),
    W2(t),
    V2(t),
    K2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const nd = "1.0.0";
class ss {
  constructor(e) {
    this.version = nd, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== nd)
      throw new ll(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new ss(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Np {
  constructor(e) {
    if (e) {
      const n = new ss(e);
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
class rd extends Np {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new ss({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new p0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new ss({})), !0;
  }
}
class sd extends Np {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Gw, !localStorage.getItem(this.key)) {
      const r = new ss({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new p0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return ss.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new ss({})), !0;
  }
}
var yo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(yo || (yo = {}));
var Ta;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ta || (Ta = {}));
yo.Mainnet;
var yr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(yr || (yr = {}));
var er;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(er || (er = {}));
yr.Mainnet;
const Up = {
  chainId: yo.Mainnet,
  transactionVersion: yr.Mainnet,
  peerNetworkId: Ta.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: er.MainnetSingleSig,
    multiSig: er.MainnetMultiSig
  },
  client: { baseUrl: g0 }
}, bl = {
  chainId: yo.Testnet,
  transactionVersion: yr.Testnet,
  peerNetworkId: Ta.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: er.TestnetSingleSig,
    multiSig: er.TestnetMultiSig
  },
  client: { baseUrl: y0 }
}, ba = {
  ...bl,
  addressVersion: { ...bl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: w0 }
}, Y2 = {
  ...ba,
  addressVersion: { ...ba.addressVersion },
  client: { ...ba.client }
};
function Z2(t) {
  switch (t) {
    case "mainnet":
      return Up;
    case "testnet":
      return bl;
    case "devnet":
      return ba;
    case "mocknet":
      return Y2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Pp(t) {
  return typeof t == "string" ? Z2(t) : t;
}
var id;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(id || (id = {}));
var od;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(od || (od = {}));
var Nn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Nn || (Nn = {}));
const Uc = ["onChainOnly", "offChainOnly", "any"];
Uc[0] + "", Nn.OnChainOnly, Uc[1] + "", Nn.OffChainOnly, Uc[2] + "", Nn.Any, Nn.OnChainOnly + "", Nn.OnChainOnly, Nn.OffChainOnly + "", Nn.OffChainOnly, Nn.Any + "", Nn.Any;
var ad;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(ad || (ad = {}));
var cd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(cd || (cd = {}));
var ld;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ld || (ld = {}));
var gr;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(gr || (gr = {}));
var ud;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ud || (ud = {}));
var fd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(fd || (fd = {}));
var dd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(dd || (dd = {}));
var hd;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(hd || (hd = {}));
var pd;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(pd || (pd = {}));
var gd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(gd || (gd = {}));
var yd;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(yd || (yd = {}));
var wd;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(wd || (wd = {}));
var bd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(bd || (bd = {}));
function ml(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Q2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Op(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function J2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ml(t.outputLen), ml(t.blockLen);
}
function tm(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function em(t, e) {
  Op(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const bs = {
  number: ml,
  bool: Q2,
  bytes: Op,
  hash: J2,
  exists: tm,
  output: em
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Pc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Wn = (t, e) => t << 32 - e | t >>> e, nm = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!nm)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function rm(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Lu(t) {
  if (typeof t == "string" && (t = rm(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Dp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Xs(t) {
  const e = (r) => t().update(Lu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Fp = class extends Dp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, bs.hash(e);
    const r = Lu(n);
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
    return bs.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    bs.exists(this), bs.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const jp = (t, e, n) => new Fp(t, e).update(n).digest();
jp.create = (t, e) => new Fp(t, e);
function sm(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let Cu = class extends Dp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Pc(this.buffer);
  }
  update(e) {
    bs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Lu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Pc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    bs.exists(this), bs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    sm(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Pc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
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
const im = (t, e, n) => t & e ^ ~t & n, om = (t, e, n) => t & e ^ t & n ^ e & n, am = new Uint32Array([
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
]), Mr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Nr = new Uint32Array(64);
let zp = class extends Cu {
  constructor() {
    super(64, 32, 8, !1), this.A = Mr[0] | 0, this.B = Mr[1] | 0, this.C = Mr[2] | 0, this.D = Mr[3] | 0, this.E = Mr[4] | 0, this.F = Mr[5] | 0, this.G = Mr[6] | 0, this.H = Mr[7] | 0;
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
      Nr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Nr[l - 15], p = Nr[l - 2], S = Wn(y, 7) ^ Wn(y, 18) ^ y >>> 3, x = Wn(p, 17) ^ Wn(p, 19) ^ p >>> 10;
      Nr[l] = x + Nr[l - 7] + S + Nr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = Wn(a, 6) ^ Wn(a, 11) ^ Wn(a, 25), p = h + y + im(a, c, f) + am[l] + Nr[l] | 0, x = (Wn(r, 2) ^ Wn(r, 13) ^ Wn(r, 22)) + om(r, s, i) | 0;
      h = f, f = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, f, h);
  }
  roundClean() {
    Nr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, cm = class extends zp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Rp = Xs(() => new zp());
Xs(() => new cm());
var Ys = {}, Bu = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = xr;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], f = 0;
    for (let p = o.length - 1; p >= 0; p--)
      if (f < 4) {
        const S = n.indexOf(o[p]) >> f;
        let x = 0;
        p !== 0 && (x = n.indexOf(o[p - 1]));
        const L = 1 + f, O = x % (1 << L) << 5 - L, P = t.c32[S + O];
        f = L, c.unshift(P);
      } else
        f = 0;
    let h = 0;
    for (let p = 0; p < c.length && c[p] === "0"; p++)
      h++;
    c = c.slice(h);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), y = l ? l[0].length : 0;
    for (let p = 0; p < y; p++)
      c.unshift(t.c32[0]);
    if (a) {
      const p = a - c.length;
      for (let S = 0; S < p; S++)
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
    let h = [], l = 0, y = 0;
    for (let x = o.length - 1; x >= 0; x--) {
      y === 4 && (h.unshift(n[l]), y = 0, l = 0);
      const O = (t.c32.indexOf(o[x]) << y) + l, P = n[O % 16];
      if (y += 1, l = O >> 4, l > 1 << y)
        throw new Error("Panic error in decoding.");
      h.unshift(P);
    }
    h.unshift(n[l]), h.length % 2 === 1 && h.unshift("0");
    let p = 0;
    for (let x = 0; x < h.length && h[x] === "0"; x++)
      p++;
    h = h.slice(p - p % 2);
    let S = h.join("");
    for (let x = 0; x < f; x++)
      S = `00${S}`;
    if (a) {
      const x = a * 2 - S.length;
      for (let L = 0; L < x; L += 2)
        S = `00${S}`;
    }
    return S;
  }
  t.c32decode = i;
})(Bu);
var Hs = {};
Object.defineProperty(Hs, "__esModule", { value: !0 });
Hs.c32checkDecode = Hs.c32checkEncode = void 0;
const md = yn, xd = xr, uo = Bu;
function Gp(t) {
  const e = (0, md.sha256)((0, md.sha256)((0, xd.hexToBytes)(t)));
  return (0, xd.bytesToHex)(e.slice(0, 4));
}
function lm(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Gp(`${n}${e}`), s = (0, uo.c32encode)(`${e}${r}`);
  return `${uo.c32[t]}${s}`;
}
Hs.c32checkEncode = lm;
function um(t) {
  t = (0, uo.c32normalize)(t);
  const e = (0, uo.c32decode)(t.slice(1)), n = t[0], r = uo.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Gp(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Hs.c32checkDecode = um;
var Vp = {}, Ti = {};
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.decode = Ti.encode = void 0;
const _a = yn, Sd = xr, Kp = D0, Wp = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function fm(t, e = "00") {
  const n = typeof t == "string" ? (0, Sd.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Sd.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, _a.sha256)((0, _a.sha256)(new Uint8Array([...r, ...n])));
  return Kp(Wp).encode([...r, ...n, ...s.slice(0, 4)]);
}
Ti.encode = fm;
function dm(t) {
  const e = Kp(Wp).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, _a.sha256)((0, _a.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Ti.decode = dm;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Hs, n = Ti, r = xr;
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
    const y = n.decode(h), p = (0, r.bytesToHex)(y.data), S = parseInt((0, r.bytesToHex)(y.prefix), 16);
    let x;
    return l < 0 ? (x = S, s[S] !== void 0 && (x = s[S])) : x = l, o(x, p);
  }
  t.b58ToC32 = c;
  function f(h, l = -1) {
    const y = a(h), p = y[0], S = y[1];
    let x;
    l < 0 ? (x = p, i[p] !== void 0 && (x = i[p])) : x = l;
    let L = x.toString(16);
    return L.length === 1 && (L = `0${L}`), n.encode(S, L);
  }
  t.c32ToB58 = f;
})(Vp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Bu;
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
  const r = Vp;
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
})(Ys);
function hm(t, e) {
  switch (e = Pp(e ?? Up), t) {
    case gr.P2PKH:
      switch (e.transactionVersion) {
        case yr.Mainnet:
          return er.MainnetSingleSig;
        case yr.Testnet:
          return er.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case gr.P2SH:
    case gr.P2SHNonSequential:
    case gr.P2WPKH:
    case gr.P2WSH:
    case gr.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case yr.Mainnet:
          return er.MainnetMultiSig;
        case yr.Testnet:
          return er.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const pm = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), qp = Uint8Array.from({ length: 16 }, (t, e) => e), gm = qp.map((t) => (9 * t + 5) % 16);
let Tu = [qp], _u = [gm];
for (let t = 0; t < 4; t++)
  for (let e of [Tu, _u])
    e.push(e[t].map((n) => pm[n]));
const Xp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), ym = Tu.map((t, e) => t.map((n) => Xp[e][n])), wm = _u.map((t, e) => t.map((n) => Xp[e][n])), bm = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), mm = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Yo = (t, e) => t << e | t >>> 32 - e;
function Ad(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Zo = new Uint32Array(16);
let xm = class extends Cu {
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
      Zo[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, h = f, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const S = 4 - p, x = bm[p], L = mm[p], O = Tu[p], P = _u[p], g = ym[p], I = wm[p];
      for (let $ = 0; $ < 16; $++) {
        const N = Yo(r + Ad(p, i, a, f) + Zo[O[$]] + x, g[$]) + l | 0;
        r = l, l = f, f = Yo(a, 10) | 0, a = i, i = N;
      }
      for (let $ = 0; $ < 16; $++) {
        const N = Yo(s + Ad(S, o, c, h) + Zo[P[$]] + L, I[$]) + y | 0;
        s = y, y = h, h = Yo(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + f + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Zo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Sm = Xs(() => new xm()), Qo = BigInt(2 ** 32 - 1), xl = BigInt(32);
function Yp(t, e = !1) {
  return e ? { h: Number(t & Qo), l: Number(t >> xl & Qo) } : { h: Number(t >> xl & Qo) | 0, l: Number(t & Qo) | 0 };
}
function Am(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Yp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Em = (t, e) => BigInt(t >>> 0) << xl | BigInt(e >>> 0), vm = (t, e, n) => t >>> n, $m = (t, e, n) => t << 32 - n | e >>> n, Im = (t, e, n) => t >>> n | e << 32 - n, km = (t, e, n) => t << 32 - n | e >>> n, Lm = (t, e, n) => t << 64 - n | e >>> n - 32, Cm = (t, e, n) => t >>> n - 32 | e << 64 - n, Bm = (t, e) => e, Tm = (t, e) => t, _m = (t, e, n) => t << n | e >>> 32 - n, Hm = (t, e, n) => e << n | t >>> 32 - n, Mm = (t, e, n) => e << n - 32 | t >>> 64 - n, Nm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Um(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Pm = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Om = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Dm = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Fm = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, jm = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), zm = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, xt = {
  fromBig: Yp,
  split: Am,
  toBig: Em,
  shrSH: vm,
  shrSL: $m,
  rotrSH: Im,
  rotrSL: km,
  rotrBH: Lm,
  rotrBL: Cm,
  rotr32H: Bm,
  rotr32L: Tm,
  rotlSH: _m,
  rotlSL: Hm,
  rotlBH: Mm,
  rotlBL: Nm,
  add: Um,
  add3L: Pm,
  add3H: Om,
  add4L: Dm,
  add4H: Fm,
  add5H: zm,
  add5L: jm
}, [Rm, Gm] = xt.split([
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
let oc = class extends Cu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: h, Fh: l, Fl: y, Gh: p, Gl: S, Hh: x, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, f, h, l, y, p, S, x, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, h, l, y, p, S, x, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let g = 0; g < 16; g++, n += 4)
      Ur[g] = e.getUint32(n), Pr[g] = e.getUint32(n += 4);
    for (let g = 16; g < 80; g++) {
      const I = Ur[g - 15] | 0, $ = Pr[g - 15] | 0, N = xt.rotrSH(I, $, 1) ^ xt.rotrSH(I, $, 8) ^ xt.shrSH(I, $, 7), V = xt.rotrSL(I, $, 1) ^ xt.rotrSL(I, $, 8) ^ xt.shrSL(I, $, 7), D = Ur[g - 2] | 0, j = Pr[g - 2] | 0, A = xt.rotrSH(D, j, 19) ^ xt.rotrBH(D, j, 61) ^ xt.shrSH(D, j, 6), B = xt.rotrSL(D, j, 19) ^ xt.rotrBL(D, j, 61) ^ xt.shrSL(D, j, 6), _ = xt.add4L(V, B, Pr[g - 7], Pr[g - 16]), T = xt.add4H(_, N, A, Ur[g - 7], Ur[g - 16]);
      Ur[g] = T | 0, Pr[g] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: h, Eh: l, El: y, Fh: p, Fl: S, Gh: x, Gl: L, Hh: O, Hl: P } = this;
    for (let g = 0; g < 80; g++) {
      const I = xt.rotrSH(l, y, 14) ^ xt.rotrSH(l, y, 18) ^ xt.rotrBH(l, y, 41), $ = xt.rotrSL(l, y, 14) ^ xt.rotrSL(l, y, 18) ^ xt.rotrBL(l, y, 41), N = l & p ^ ~l & x, V = y & S ^ ~y & L, D = xt.add5L(P, $, V, Gm[g], Pr[g]), j = xt.add5H(D, O, I, N, Rm[g], Ur[g]), A = D | 0, B = xt.rotrSH(r, s, 28) ^ xt.rotrBH(r, s, 34) ^ xt.rotrBH(r, s, 39), _ = xt.rotrSL(r, s, 28) ^ xt.rotrBL(r, s, 34) ^ xt.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, J = s & o ^ s & c ^ o & c;
      O = x | 0, P = L | 0, x = p | 0, L = S | 0, p = l | 0, S = y | 0, { h: l, l: y } = xt.add(f | 0, h | 0, j | 0, A | 0), f = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = xt.add3L(A, _, J);
      r = xt.add3H(z, j, B, T), s = z | 0;
    }
    ({ h: r, l: s } = xt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = xt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = xt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: h } = xt.add(this.Dh | 0, this.Dl | 0, f | 0, h | 0), { h: l, l: y } = xt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: S } = xt.add(this.Fh | 0, this.Fl | 0, p | 0, S | 0), { h: x, l: L } = xt.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: O, l: P } = xt.add(this.Hh | 0, this.Hl | 0, O | 0, P | 0), this.set(r, s, i, o, a, c, f, h, l, y, p, S, x, L, O, P);
  }
  roundClean() {
    Ur.fill(0), Pr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Vm = class extends oc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Km = class extends oc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Wm = class extends oc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Xs(() => new oc());
Xs(() => new Vm());
Xs(() => new Km());
Xs(() => new Wm());
var Ha = { exports: {} };
Ha.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", f = "[object Error]", h = "[object Function]", l = "[object GeneratorFunction]", y = "[object Map]", p = "[object Number]", S = "[object Object]", x = "[object Promise]", L = "[object RegExp]", O = "[object Set]", P = "[object String]", g = "[object Symbol]", I = "[object WeakMap]", $ = "[object ArrayBuffer]", N = "[object DataView]", V = "[object Float32Array]", D = "[object Float64Array]", j = "[object Int8Array]", A = "[object Int16Array]", B = "[object Int32Array]", _ = "[object Uint8Array]", T = "[object Uint8ClampedArray]", J = "[object Uint16Array]", z = "[object Uint32Array]", Ot = /[\\^$.*+?()[\]{}|]/g, ft = /\w*$/, te = /^\[object .+?Constructor\]$/, E = /^(?:0|[1-9]\d*)$/, M = {};
  M[i] = M[o] = M[$] = M[N] = M[a] = M[c] = M[V] = M[D] = M[j] = M[A] = M[B] = M[y] = M[p] = M[S] = M[L] = M[O] = M[P] = M[g] = M[_] = M[T] = M[J] = M[z] = !0, M[f] = M[h] = M[I] = !1;
  var dt = typeof Ye == "object" && Ye && Ye.Object === Object && Ye, Ct = typeof self == "object" && self && self.Object === Object && self, It = dt || Ct || Function("return this")(), kt = e && !e.nodeType && e, re = kt && !0 && t && !t.nodeType && t, ce = re && re.exports === kt;
  function Kt(w, C) {
    return w.set(C[0], C[1]), w;
  }
  function me(w, C) {
    return w.add(C), w;
  }
  function zt(w, C) {
    for (var H = -1, tt = w ? w.length : 0; ++H < tt && C(w[H], H, w) !== !1; )
      ;
    return w;
  }
  function Gt(w, C) {
    for (var H = -1, tt = C.length, He = w.length; ++H < tt; )
      w[He + H] = C[H];
    return w;
  }
  function Qe(w, C, H, tt) {
    for (var He = -1, nn = w ? w.length : 0; ++He < nn; )
      H = C(H, w[He], He, w);
    return H;
  }
  function Sn(w, C) {
    for (var H = -1, tt = Array(w); ++H < w; )
      tt[H] = C(H);
    return tt;
  }
  function Je(w, C) {
    return w == null ? void 0 : w[C];
  }
  function Ue(w) {
    var C = !1;
    if (w != null && typeof w.toString != "function")
      try {
        C = !!(w + "");
      } catch {
      }
    return C;
  }
  function xe(w) {
    var C = -1, H = Array(w.size);
    return w.forEach(function(tt, He) {
      H[++C] = [He, tt];
    }), H;
  }
  function Le(w, C) {
    return function(H) {
      return w(C(H));
    };
  }
  function Be(w) {
    var C = -1, H = Array(w.size);
    return w.forEach(function(tt) {
      H[++C] = tt;
    }), H;
  }
  var Wt = Array.prototype, qt = Function.prototype, Se = Object.prototype, Pe = It["__core-js_shared__"], Ae = function() {
    var w = /[^.]+$/.exec(Pe && Pe.keys && Pe.keys.IE_PROTO || "");
    return w ? "Symbol(src)_1." + w : "";
  }(), An = qt.toString, Rt = Se.hasOwnProperty, ln = Se.toString, d = RegExp(
    "^" + An.call(Rt).replace(Ot, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), b = ce ? It.Buffer : void 0, u = It.Symbol, k = It.Uint8Array, U = Le(Object.getPrototypeOf, Object), W = Object.create, lt = Se.propertyIsEnumerable, gt = Wt.splice, Tt = Object.getOwnPropertySymbols, ut = b ? b.isBuffer : void 0, ee = Le(Object.keys, Object), _t = st(It, "DataView"), yt = st(It, "Map"), Nt = st(It, "Promise"), Xt = st(It, "Set"), Ee = st(It, "WeakMap"), $e = st(Object, "create"), rt = hs(_t), et = hs(yt), Bt = hs(Nt), Ie = hs(Xt), Ht = hs(Ee), le = u ? u.prototype : void 0, Tn = le ? le.valueOf : void 0;
  function Oe(w) {
    var C = -1, H = w ? w.length : 0;
    for (this.clear(); ++C < H; ) {
      var tt = w[C];
      this.set(tt[0], tt[1]);
    }
  }
  function _n() {
    this.__data__ = $e ? $e(null) : {};
  }
  function tn(w) {
    return this.has(w) && delete this.__data__[w];
  }
  function En(w) {
    var C = this.__data__;
    if ($e) {
      var H = C[w];
      return H === r ? void 0 : H;
    }
    return Rt.call(C, w) ? C[w] : void 0;
  }
  function en(w) {
    var C = this.__data__;
    return $e ? C[w] !== void 0 : Rt.call(C, w);
  }
  function Ar(w, C) {
    var H = this.__data__;
    return H[w] = $e && C === void 0 ? r : C, this;
  }
  Oe.prototype.clear = _n, Oe.prototype.delete = tn, Oe.prototype.get = En, Oe.prototype.has = en, Oe.prototype.set = Ar;
  function De(w) {
    var C = -1, H = w ? w.length : 0;
    for (this.clear(); ++C < H; ) {
      var tt = w[C];
      this.set(tt[0], tt[1]);
    }
  }
  function ni() {
    this.__data__ = [];
  }
  function Wi(w) {
    var C = this.__data__, H = de(C, w);
    if (H < 0)
      return !1;
    var tt = C.length - 1;
    return H == tt ? C.pop() : gt.call(C, H, 1), !0;
  }
  function ri(w) {
    var C = this.__data__, H = de(C, w);
    return H < 0 ? void 0 : C[H][1];
  }
  function si(w) {
    return de(this.__data__, w) > -1;
  }
  function ii(w, C) {
    var H = this.__data__, tt = de(H, w);
    return tt < 0 ? H.push([w, C]) : H[tt][1] = C, this;
  }
  De.prototype.clear = ni, De.prototype.delete = Wi, De.prototype.get = ri, De.prototype.has = si, De.prototype.set = ii;
  function Te(w) {
    var C = -1, H = w ? w.length : 0;
    for (this.clear(); ++C < H; ) {
      var tt = w[C];
      this.set(tt[0], tt[1]);
    }
  }
  function oi() {
    this.__data__ = {
      hash: new Oe(),
      map: new (yt || De)(),
      string: new Oe()
    };
  }
  function ls(w) {
    return K(this, w).delete(w);
  }
  function ai(w) {
    return K(this, w).get(w);
  }
  function Er(w) {
    return K(this, w).has(w);
  }
  function vr(w, C) {
    return K(this, w).set(w, C), this;
  }
  Te.prototype.clear = oi, Te.prototype.delete = ls, Te.prototype.get = ai, Te.prototype.has = Er, Te.prototype.set = vr;
  function un(w) {
    this.__data__ = new De(w);
  }
  function $r() {
    this.__data__ = new De();
  }
  function us(w) {
    return this.__data__.delete(w);
  }
  function Ir(w) {
    return this.__data__.get(w);
  }
  function fs(w) {
    return this.__data__.has(w);
  }
  function R(w, C) {
    var H = this.__data__;
    if (H instanceof De) {
      var tt = H.__data__;
      if (!yt || tt.length < n - 1)
        return tt.push([w, C]), this;
      H = this.__data__ = new Te(tt);
    }
    return H.set(w, C), this;
  }
  un.prototype.clear = $r, un.prototype.delete = us, un.prototype.get = Ir, un.prototype.has = fs, un.prototype.set = R;
  function Z(w, C) {
    var H = kc(w) || uw(w) ? Sn(w.length, String) : [], tt = H.length, He = !!tt;
    for (var nn in w)
      Rt.call(w, nn) && !(He && (nn == "length" || Ge(nn, tt))) && H.push(nn);
    return H;
  }
  function se(w, C, H) {
    var tt = w[C];
    (!(Rt.call(w, C) && vf(tt, H)) || H === void 0 && !(C in w)) && (w[C] = H);
  }
  function de(w, C) {
    for (var H = w.length; H--; )
      if (vf(w[H][0], C))
        return H;
    return -1;
  }
  function ds(w, C) {
    return w && F(C, Lc(C), w);
  }
  function Rn(w, C, H, tt, He, nn, ur) {
    var rn;
    if (tt && (rn = nn ? tt(w, He, nn, ur) : tt(w)), rn !== void 0)
      return rn;
    if (!Po(w))
      return w;
    var kf = kc(w);
    if (kf) {
      if (rn = Ft(w), !C)
        return v(w, rn);
    } else {
      var li = at(w), Lf = li == h || li == l;
      if (dw(w))
        return ci(w, C);
      if (li == S || li == i || Lf && !nn) {
        if (Ue(w))
          return nn ? w : {};
        if (rn = _e(Lf ? {} : w), !C)
          return X(w, ds(rn, w));
      } else {
        if (!M[li])
          return nn ? w : {};
        rn = vn(w, li, Rn, C);
      }
    }
    ur || (ur = new un());
    var Cf = ur.get(w);
    if (Cf)
      return Cf;
    if (ur.set(w, rn), !kf)
      var Bf = H ? Q(w) : Lc(w);
    return zt(Bf || w, function(Cc, Oo) {
      Bf && (Oo = Cc, Cc = w[Oo]), se(rn, Oo, Rn(Cc, C, H, tt, Oo, w, ur));
    }), rn;
  }
  function ne(w) {
    return Po(w) ? W(w) : {};
  }
  function qi(w, C, H) {
    var tt = C(w);
    return kc(w) ? tt : Gt(tt, H(w));
  }
  function Xi(w) {
    return ln.call(w);
  }
  function Hn(w) {
    if (!Po(w) || Uo(w))
      return !1;
    var C = If(w) || Ue(w) ? d : te;
    return C.test(hs(w));
  }
  function Yi(w) {
    if (!Ef(w))
      return ee(w);
    var C = [];
    for (var H in Object(w))
      Rt.call(w, H) && H != "constructor" && C.push(H);
    return C;
  }
  function ci(w, C) {
    if (C)
      return w.slice();
    var H = new w.constructor(w.length);
    return w.copy(H), H;
  }
  function Zi(w) {
    var C = new w.constructor(w.byteLength);
    return new k(C).set(new k(w)), C;
  }
  function Qi(w, C) {
    var H = C ? Zi(w.buffer) : w.buffer;
    return new w.constructor(H, w.byteOffset, w.byteLength);
  }
  function vc(w, C, H) {
    var tt = C ? H(xe(w), !0) : xe(w);
    return Qe(tt, Kt, new w.constructor());
  }
  function $c(w) {
    var C = new w.constructor(w.source, ft.exec(w));
    return C.lastIndex = w.lastIndex, C;
  }
  function Ji(w, C, H) {
    var tt = C ? H(Be(w), !0) : Be(w);
    return Qe(tt, me, new w.constructor());
  }
  function Ic(w) {
    return Tn ? Object(Tn.call(w)) : {};
  }
  function m(w, C) {
    var H = C ? Zi(w.buffer) : w.buffer;
    return new w.constructor(H, w.byteOffset, w.length);
  }
  function v(w, C) {
    var H = -1, tt = w.length;
    for (C || (C = Array(tt)); ++H < tt; )
      C[H] = w[H];
    return C;
  }
  function F(w, C, H, tt) {
    H || (H = {});
    for (var He = -1, nn = C.length; ++He < nn; ) {
      var ur = C[He], rn = void 0;
      se(H, ur, rn === void 0 ? w[ur] : rn);
    }
    return H;
  }
  function X(w, C) {
    return F(w, ht(w), C);
  }
  function Q(w) {
    return qi(w, Lc, ht);
  }
  function K(w, C) {
    var H = w.__data__;
    return Gn(C) ? H[typeof C == "string" ? "string" : "hash"] : H.map;
  }
  function st(w, C) {
    var H = Je(w, C);
    return Hn(H) ? H : void 0;
  }
  var ht = Tt ? Le(Tt, Object) : gw, at = Xi;
  (_t && at(new _t(new ArrayBuffer(1))) != N || yt && at(new yt()) != y || Nt && at(Nt.resolve()) != x || Xt && at(new Xt()) != O || Ee && at(new Ee()) != I) && (at = function(w) {
    var C = ln.call(w), H = C == S ? w.constructor : void 0, tt = H ? hs(H) : void 0;
    if (tt)
      switch (tt) {
        case rt:
          return N;
        case et:
          return y;
        case Bt:
          return x;
        case Ie:
          return O;
        case Ht:
          return I;
      }
    return C;
  });
  function Ft(w) {
    var C = w.length, H = w.constructor(C);
    return C && typeof w[0] == "string" && Rt.call(w, "index") && (H.index = w.index, H.input = w.input), H;
  }
  function _e(w) {
    return typeof w.constructor == "function" && !Ef(w) ? ne(U(w)) : {};
  }
  function vn(w, C, H, tt) {
    var He = w.constructor;
    switch (C) {
      case $:
        return Zi(w);
      case a:
      case c:
        return new He(+w);
      case N:
        return Qi(w, tt);
      case V:
      case D:
      case j:
      case A:
      case B:
      case _:
      case T:
      case J:
      case z:
        return m(w, tt);
      case y:
        return vc(w, tt, H);
      case p:
      case P:
        return new He(w);
      case L:
        return $c(w);
      case O:
        return Ji(w, tt, H);
      case g:
        return Ic(w);
    }
  }
  function Ge(w, C) {
    return C = C ?? s, !!C && (typeof w == "number" || E.test(w)) && w > -1 && w % 1 == 0 && w < C;
  }
  function Gn(w) {
    var C = typeof w;
    return C == "string" || C == "number" || C == "symbol" || C == "boolean" ? w !== "__proto__" : w === null;
  }
  function Uo(w) {
    return !!Ae && Ae in w;
  }
  function Ef(w) {
    var C = w && w.constructor, H = typeof C == "function" && C.prototype || Se;
    return w === H;
  }
  function hs(w) {
    if (w != null) {
      try {
        return An.call(w);
      } catch {
      }
      try {
        return w + "";
      } catch {
      }
    }
    return "";
  }
  function lw(w) {
    return Rn(w, !0, !0);
  }
  function vf(w, C) {
    return w === C || w !== w && C !== C;
  }
  function uw(w) {
    return fw(w) && Rt.call(w, "callee") && (!lt.call(w, "callee") || ln.call(w) == i);
  }
  var kc = Array.isArray;
  function $f(w) {
    return w != null && hw(w.length) && !If(w);
  }
  function fw(w) {
    return pw(w) && $f(w);
  }
  var dw = ut || yw;
  function If(w) {
    var C = Po(w) ? ln.call(w) : "";
    return C == h || C == l;
  }
  function hw(w) {
    return typeof w == "number" && w > -1 && w % 1 == 0 && w <= s;
  }
  function Po(w) {
    var C = typeof w;
    return !!w && (C == "object" || C == "function");
  }
  function pw(w) {
    return !!w && typeof w == "object";
  }
  function Lc(w) {
    return $f(w) ? Z(w) : Yi(w);
  }
  function gw() {
    return [];
  }
  function yw() {
    return !1;
  }
  t.exports = lw;
})(Ha, Ha.exports);
var qm = Ha.exports;
const Zp = /* @__PURE__ */ c0(qm);
var Sl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Sl || (Sl = {}));
function Xm(t, e) {
  return { type: Sl.Address, version: t, hash160: e };
}
function Ym(t) {
  return Ys.c32address(t.version, t.hash160);
}
const Zm = (t) => Sm(Rp(t)), Qm = (t) => ot(Zm(t));
ge.hmacSha256Sync = (t, ...e) => {
  const n = jp.create(Rp, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Jm(t, e = "mainnet") {
  e = Pp(e), t = typeof t == "string" ? Pt(t) : t;
  const n = hm(gr.P2PKH, e), r = Xm(n, Qm(t));
  return Ym(r);
}
function tx(t, e) {
  const n = Ne.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = Jm(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new Ne.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function ex(t, e = null) {
  let n;
  e ? n = tx(t, e) : n = Ne.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Ed = "_blockstackDidCheckEchoReply", nx = "echoReply", rx = "authContinuation";
function sx(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function ix() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Ed];
  if (typeof e == "boolean")
    return e;
  const n = sx(t.location.search), r = n[nx];
  if (r) {
    t[Ed] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[rx];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class Al {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new b0();
    else
      throw new Kw("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new sd(e.sessionOptions) : this.store = new sd() : e ? this.store = new rd(e.sessionOptions) : this.store = new rd();
  }
  makeAuthRequestToken(e, n, r, s, i, o = qw().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new ll("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, G2(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = R2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = pu("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (ix())
        return gi.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      gi.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = wb()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Do("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = Ne.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await X2(e))
      throw new Do("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (Tc(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await ed(s, i.private_key);
          } catch {
            if (gi.warn("Failed decryption of appPrivateKey, will try to use as given"), !ge.isValidPrivateKey(i.private_key))
              throw new Do("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await ed(s, c);
          } catch {
            gi.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Do("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let f = ob, h;
    Tc(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (f = i.hubUrl), Tc(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (h = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: Mp(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: f,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: h
    }, y = i.profile_url;
    if (!l.profile && y) {
      const p = await n(y);
      if (!p.ok)
        l.profile = Object.assign({}, Rw);
      else {
        const S = await p.text(), x = JSON.parse(S);
        l.profile = ex(x[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new ll("No user data found. Did the user sign in?");
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
Al.prototype.makeAuthRequest = Al.prototype.makeAuthRequestToken;
const ox = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], ax = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = ox(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!ac(r.id));
  return e.concat(n);
}, ac = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Qp = "STX_PROVIDER", Ms = () => typeof window > "u" ? null : window.localStorage.getItem(Qp), cx = (t) => {
  typeof window < "u" && window.localStorage.setItem(Qp, t);
}, lx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function ux(t, e) {
  const n = {};
  return Object.assign(n, lx, e), await fetch(t, n);
}
function fx(t) {
  let e = ux, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function dx(...t) {
  const { fetchLib: e, middlewares: n } = fx(t);
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
var _i;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(_i || (_i = {}));
var Ns;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ns || (Ns = {}));
var vd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(vd || (vd = {}));
const hx = "https://api.mainnet.hiro.so", px = "https://api.testnet.hiro.so", gx = "http://localhost:3999", yx = ["mainnet", "testnet", "devnet", "mocknet"];
class Us {
  constructor(e) {
    this.version = Ns.Mainnet, this.chainId = _i.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ns.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? dx();
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
Us.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new El();
    case "testnet":
      return new vl();
    case "devnet":
      return new wx();
    case "mocknet":
      return new Jp();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${yx.join(", ")}`);
  }
};
Us.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Us.fromName(t);
class El extends Us {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? hx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ns.Mainnet, this.chainId = _i.Mainnet;
  }
}
class vl extends Us {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? px,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ns.Testnet, this.chainId = _i.Testnet;
  }
}
class Jp extends Us {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? gx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ns.Testnet, this.chainId = _i.Testnet;
  }
}
const wx = Jp;
var Ps;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Ps || (Ps = {}));
var Ma;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ma || (Ma = {}));
Ps.Mainnet;
var Os;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Os || (Os = {}));
var Ds;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ds || (Ds = {}));
Os.Mainnet;
const bx = {
  chainId: Ps.Mainnet,
  transactionVersion: Os.Mainnet,
  peerNetworkId: Ma.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Ds.MainnetSingleSig,
    multiSig: Ds.MainnetMultiSig
  },
  client: { baseUrl: g0 }
}, $l = {
  chainId: Ps.Testnet,
  transactionVersion: Os.Testnet,
  peerNetworkId: Ma.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Ds.TestnetSingleSig,
    multiSig: Ds.TestnetMultiSig
  },
  client: { baseUrl: y0 }
}, ma = {
  ...$l,
  addressVersion: { ...$l.addressVersion },
  magicBytes: "id",
  client: { baseUrl: w0 }
}, mx = {
  ...ma,
  addressVersion: { ...ma.addressVersion },
  client: { ...ma.client }
};
function xx(t) {
  switch (t) {
    case "mainnet":
      return bx;
    case "testnet":
      return $l;
    case "devnet":
      return ma;
    case "mocknet":
      return mx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Sx(t) {
  return typeof t == "string" ? xx(t) : t;
}
function Ax(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const $d = /* @__PURE__ */ new Map();
function tg(t, e) {
  const n = $d.get(t);
  if (n !== void 0)
    return n(e);
  const r = Ax(t);
  return $d.set(t, r), tg(t, e);
}
let Jt = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Pt(e) : e;
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
    const n = this.readBytes(e).slice().reverse(), r = ot(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = ot(n);
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
    if (tg(e, r))
      return r;
    throw n(r);
  }
};
const Ex = 128, vx = 128, eg = 16, $s = 32, Il = 80, cc = 65, $x = 32, Ix = 64, Na = 34, kx = 1 + 16 * 1024 * 1024, Lx = 165, Cx = 16, Bx = 16, Tx = 20, _x = Bx + 2 + Tx, Hx = _x + 4, Mx = kx + (Lx + Cx * Hx);
var jt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(jt || (jt = {}));
var kl;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(kl || (kl = {}));
var hn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(hn || (hn = {}));
const Oc = ["onChainOnly", "offChainOnly", "any"];
Oc[0] + "", hn.OnChainOnly, Oc[1] + "", hn.OffChainOnly, Oc[2] + "", hn.Any, hn.OnChainOnly + "", hn.OnChainOnly, hn.OffChainOnly + "", hn.OffChainOnly, hn.Any + "", hn.Any;
var Ua;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Ua || (Ua = {}));
var ie;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ie || (ie = {}));
var he;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(he || (he = {}));
var Yt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Yt || (Yt = {}));
var ue;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ue || (ue = {}));
var fo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(fo || (fo = {}));
var Ll;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Ll || (Ll = {}));
var Cl;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Cl || (Cl = {}));
var qe;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(qe || (qe = {}));
var Id;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Id || (Id = {}));
var Bl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Bl || (Bl = {}));
var Pn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Pn || (Pn = {}));
var kd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(kd || (kd = {}));
let lc = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, yi = class extends lc {
  constructor(e) {
    super(e);
  }
}, Ve = class extends lc {
  constructor(e) {
    super(e);
  }
}, Pa = class extends lc {
  constructor(e) {
    super(e);
  }
}, ms = class extends lc {
  constructor(e) {
    super(e);
  }
};
function Tl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Nx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function ng(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Ux(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Tl(t.outputLen), Tl(t.blockLen);
}
function Px(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ox(t, e) {
  ng(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const xs = {
  number: Tl,
  bool: Nx,
  bytes: ng,
  hash: Ux,
  exists: Px,
  output: Ox
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Dc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), qn = (t, e) => t << 32 - e | t >>> e, Dx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Dx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Fx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Hu(t) {
  if (typeof t == "string" && (t = Fx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let rg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Zs(t) {
  const e = (r) => t().update(Hu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let sg = class extends rg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, xs.hash(e);
    const r = Hu(n);
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
    return xs.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    xs.exists(this), xs.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const ig = (t, e, n) => new sg(t, e).update(n).digest();
ig.create = (t, e) => new sg(t, e);
function jx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let Mu = class extends rg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Dc(this.buffer);
  }
  update(e) {
    xs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Hu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Dc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    xs.exists(this), xs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    jx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Dc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
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
const zx = (t, e, n) => t & e ^ ~t & n, Rx = (t, e, n) => t & e ^ t & n ^ e & n, Gx = new Uint32Array([
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
]), Or = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Dr = new Uint32Array(64);
let og = class extends Mu {
  constructor() {
    super(64, 32, 8, !1), this.A = Or[0] | 0, this.B = Or[1] | 0, this.C = Or[2] | 0, this.D = Or[3] | 0, this.E = Or[4] | 0, this.F = Or[5] | 0, this.G = Or[6] | 0, this.H = Or[7] | 0;
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
      Dr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Dr[l - 15], p = Dr[l - 2], S = qn(y, 7) ^ qn(y, 18) ^ y >>> 3, x = qn(p, 17) ^ qn(p, 19) ^ p >>> 10;
      Dr[l] = x + Dr[l - 7] + S + Dr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = qn(a, 6) ^ qn(a, 11) ^ qn(a, 25), p = h + y + zx(a, c, f) + Gx[l] + Dr[l] | 0, x = (qn(r, 2) ^ qn(r, 13) ^ qn(r, 22)) + Rx(r, s, i) | 0;
      h = f, f = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, f, h);
  }
  roundClean() {
    Dr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Vx = class extends og {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Nu = Zs(() => new og());
Zs(() => new Vx());
const Kx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ag = Uint8Array.from({ length: 16 }, (t, e) => e), Wx = ag.map((t) => (9 * t + 5) % 16);
let Uu = [ag], Pu = [Wx];
for (let t = 0; t < 4; t++)
  for (let e of [Uu, Pu])
    e.push(e[t].map((n) => Kx[n]));
const cg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), qx = Uu.map((t, e) => t.map((n) => cg[e][n])), Xx = Pu.map((t, e) => t.map((n) => cg[e][n])), Yx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Zx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Jo = (t, e) => t << e | t >>> 32 - e;
function Ld(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ta = new Uint32Array(16);
let Qx = class extends Mu {
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
      ta[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, h = f, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const S = 4 - p, x = Yx[p], L = Zx[p], O = Uu[p], P = Pu[p], g = qx[p], I = Xx[p];
      for (let $ = 0; $ < 16; $++) {
        const N = Jo(r + Ld(p, i, a, f) + ta[O[$]] + x, g[$]) + l | 0;
        r = l, l = f, f = Jo(a, 10) | 0, a = i, i = N;
      }
      for (let $ = 0; $ < 16; $++) {
        const N = Jo(s + Ld(S, o, c, h) + ta[P[$]] + L, I[$]) + y | 0;
        s = y, y = h, h = Jo(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + f + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    ta.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Jx = Zs(() => new Qx()), ea = BigInt(2 ** 32 - 1), _l = BigInt(32);
function lg(t, e = !1) {
  return e ? { h: Number(t & ea), l: Number(t >> _l & ea) } : { h: Number(t >> _l & ea) | 0, l: Number(t & ea) | 0 };
}
function tS(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = lg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const eS = (t, e) => BigInt(t >>> 0) << _l | BigInt(e >>> 0), nS = (t, e, n) => t >>> n, rS = (t, e, n) => t << 32 - n | e >>> n, sS = (t, e, n) => t >>> n | e << 32 - n, iS = (t, e, n) => t << 32 - n | e >>> n, oS = (t, e, n) => t << 64 - n | e >>> n - 32, aS = (t, e, n) => t >>> n - 32 | e << 64 - n, cS = (t, e) => e, lS = (t, e) => t, uS = (t, e, n) => t << n | e >>> 32 - n, fS = (t, e, n) => e << n | t >>> 32 - n, dS = (t, e, n) => e << n - 32 | t >>> 64 - n, hS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function pS(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const gS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), yS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, wS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), bS = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, mS = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), xS = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, St = {
  fromBig: lg,
  split: tS,
  toBig: eS,
  shrSH: nS,
  shrSL: rS,
  rotrSH: sS,
  rotrSL: iS,
  rotrBH: oS,
  rotrBL: aS,
  rotr32H: cS,
  rotr32L: lS,
  rotlSH: uS,
  rotlSL: fS,
  rotlBH: dS,
  rotlBL: hS,
  add: pS,
  add3L: gS,
  add3H: yS,
  add4L: wS,
  add4H: bS,
  add5H: xS,
  add5L: mS
}, [SS, AS] = St.split([
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
].map((t) => BigInt(t))), Fr = new Uint32Array(80), jr = new Uint32Array(80);
let uc = class extends Mu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: h, Fh: l, Fl: y, Gh: p, Gl: S, Hh: x, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, f, h, l, y, p, S, x, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, h, l, y, p, S, x, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let g = 0; g < 16; g++, n += 4)
      Fr[g] = e.getUint32(n), jr[g] = e.getUint32(n += 4);
    for (let g = 16; g < 80; g++) {
      const I = Fr[g - 15] | 0, $ = jr[g - 15] | 0, N = St.rotrSH(I, $, 1) ^ St.rotrSH(I, $, 8) ^ St.shrSH(I, $, 7), V = St.rotrSL(I, $, 1) ^ St.rotrSL(I, $, 8) ^ St.shrSL(I, $, 7), D = Fr[g - 2] | 0, j = jr[g - 2] | 0, A = St.rotrSH(D, j, 19) ^ St.rotrBH(D, j, 61) ^ St.shrSH(D, j, 6), B = St.rotrSL(D, j, 19) ^ St.rotrBL(D, j, 61) ^ St.shrSL(D, j, 6), _ = St.add4L(V, B, jr[g - 7], jr[g - 16]), T = St.add4H(_, N, A, Fr[g - 7], Fr[g - 16]);
      Fr[g] = T | 0, jr[g] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: h, Eh: l, El: y, Fh: p, Fl: S, Gh: x, Gl: L, Hh: O, Hl: P } = this;
    for (let g = 0; g < 80; g++) {
      const I = St.rotrSH(l, y, 14) ^ St.rotrSH(l, y, 18) ^ St.rotrBH(l, y, 41), $ = St.rotrSL(l, y, 14) ^ St.rotrSL(l, y, 18) ^ St.rotrBL(l, y, 41), N = l & p ^ ~l & x, V = y & S ^ ~y & L, D = St.add5L(P, $, V, AS[g], jr[g]), j = St.add5H(D, O, I, N, SS[g], Fr[g]), A = D | 0, B = St.rotrSH(r, s, 28) ^ St.rotrBH(r, s, 34) ^ St.rotrBH(r, s, 39), _ = St.rotrSL(r, s, 28) ^ St.rotrBL(r, s, 34) ^ St.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, J = s & o ^ s & c ^ o & c;
      O = x | 0, P = L | 0, x = p | 0, L = S | 0, p = l | 0, S = y | 0, { h: l, l: y } = St.add(f | 0, h | 0, j | 0, A | 0), f = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = St.add3L(A, _, J);
      r = St.add3H(z, j, B, T), s = z | 0;
    }
    ({ h: r, l: s } = St.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = St.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = St.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: h } = St.add(this.Dh | 0, this.Dl | 0, f | 0, h | 0), { h: l, l: y } = St.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: S } = St.add(this.Fh | 0, this.Fl | 0, p | 0, S | 0), { h: x, l: L } = St.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: O, l: P } = St.add(this.Hh | 0, this.Hl | 0, O | 0, P | 0), this.set(r, s, i, o, a, c, f, h, l, y, p, S, x, L, O, P);
  }
  roundClean() {
    Fr.fill(0), jr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, ES = class extends uc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, vS = class extends uc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, $S = class extends uc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Zs(() => new uc());
Zs(() => new ES());
const IS = Zs(() => new vS());
Zs(() => new $S());
var Mt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Mt || (Mt = {}));
var ke;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(ke || (ke = {}));
function Ou(t) {
  return ke[t];
}
const kS = () => ({ type: Mt.BoolTrue }), LS = () => ({ type: Mt.BoolFalse }), CS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Mt.Buffer, value: ot(t) };
}, Cd = BigInt("0xffffffffffffffffffffffffffffffff"), BS = BigInt(0), Bd = BigInt("0x7fffffffffffffffffffffffffffffff"), Td = BigInt("-170141183460469231731687303715884105728"), TS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = fl(Pt(t))), cn(t, Uint8Array) && (t = fl(t));
  const e = Re(t);
  if (e > Bd)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Bd}`);
  if (e < Td)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Td}`);
  return { type: Mt.Int, value: e };
}, _S = (t) => {
  const e = Re(t);
  if (e < BS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Cd)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Cd}`);
  return { type: Mt.UInt, value: e };
};
function HS(t) {
  return { type: Mt.List, value: t };
}
function ug() {
  return { type: Mt.OptionalNone };
}
function fg(t) {
  return { type: Mt.OptionalSome, value: t };
}
var Y;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Y || (Y = {}));
function MS() {
  return {
    type: Y.Address,
    version: Ds.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function _d(t) {
  if (t && xg(t, Na))
    throw new Error(`Memo exceeds maximum length of ${Na} bytes`);
  return { type: Y.MemoString, content: t };
}
function Du(t, e) {
  return {
    type: Y.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Hl(t) {
  if (Pt(t).byteLength != cc)
    throw Error("Invalid signature");
  return {
    type: Y.MessageSignature,
    data: t
  };
}
function NS(t, e, n) {
  return typeof t == "string" && (t = ZS(t)), typeof n == "string" && (n = _d(n)), {
    type: Y.Payload,
    payloadType: jt.TokenTransfer,
    recipient: t,
    amount: Re(e),
    memo: n ?? _d("")
  };
}
function US(t, e, n, r) {
  return typeof e == "string" && (e = jn(e)), typeof n == "string" && (n = jn(n)), {
    type: Y.Payload,
    payloadType: jt.ContractCall,
    contractAddress: typeof t == "string" ? cs(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function PS(t) {
  return jn(t, 4, 1e5);
}
function Hd(t, e, n) {
  return typeof t == "string" && (t = jn(t)), typeof e == "string" && (e = PS(e)), typeof n == "number" ? {
    type: Y.Payload,
    payloadType: jt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: Y.Payload,
    payloadType: jt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function OS() {
  return { type: Y.Payload, payloadType: jt.PoisonMicroblock };
}
function Md(t, e) {
  if (t.byteLength != $s)
    throw Error(`Coinbase buffer size must be ${$s} bytes`);
  return e != null ? {
    type: Y.Payload,
    payloadType: jt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: Y.Payload,
    payloadType: jt.Coinbase,
    coinbaseBytes: t
  };
}
function DS(t, e, n) {
  if (t.byteLength != $s)
    throw Error(`Coinbase buffer size must be ${$s} bytes`);
  if (n.byteLength != Il)
    throw Error(`VRF proof buffer size must be ${Il} bytes`);
  return {
    type: Y.Payload,
    payloadType: jt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Mt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function FS(t, e, n, r, s, i, o) {
  return {
    type: Y.Payload,
    payloadType: jt.TenureChange,
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
  const r = e || 1, s = n || Ex;
  if (xg(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Y.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function jS(t, e, n) {
  return {
    type: Y.Asset,
    address: cs(t),
    contractName: jn(e),
    assetName: jn(n)
  };
}
function cs(t) {
  const e = Ys.c32addressDecode(t);
  return {
    type: Y.Address,
    version: e[0],
    hash160: e[1]
  };
}
function zS(t, e) {
  const n = cs(t), r = jn(e);
  return {
    type: Y.Principal,
    prefix: qe.Contract,
    address: n,
    contractName: r
  };
}
function RS(t) {
  const e = cs(t);
  return {
    type: Y.Principal,
    prefix: qe.Standard,
    address: e
  };
}
function wi(t, e) {
  return {
    pubKeyEncoding: t,
    type: Y.TransactionAuthField,
    contents: e
  };
}
function hr(t) {
  switch (t.type) {
    case Y.Address:
      return Ho(t);
    case Y.Principal:
      return dg(t);
    case Y.LengthPrefixedString:
      return Mi(t);
    case Y.MemoString:
      return VS(t);
    case Y.Asset:
      return pg(t);
    case Y.PostCondition:
      return yg(t);
    case Y.PublicKey:
      return Ul(t);
    case Y.LengthPrefixedList:
      return Fu(t);
    case Y.Payload:
      return wg(t);
    case Y.TransactionAuthField:
      return YS(t);
    case Y.MessageSignature:
      return ju(t);
  }
}
function Ho(t) {
  const e = [];
  return e.push(Pt(Lo(t.version, 1))), e.push(Pt(t.hash160)), we(e);
}
function Hi(t) {
  const e = cn(t, Jt) ? t : new Jt(t), n = Ya(ot(e.readBytes(1))), r = ot(e.readBytes(20));
  return { type: Y.Address, version: n, hash160: r };
}
function dg(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === qe.Standard || t.prefix === qe.Contract) && e.push(Ho(t.address)), t.prefix === qe.Contract && e.push(Mi(t.contractName)), we(e);
}
function GS(t) {
  const e = cn(t, Jt) ? t : new Jt(t), n = e.readUInt8Enum(qe, (i) => {
    throw new Ve(`Unexpected Principal payload type: ${i}`);
  });
  if (n === qe.Origin)
    return { type: Y.Principal, prefix: n };
  const r = Hi(e);
  if (n === qe.Standard)
    return { type: Y.Principal, prefix: n, address: r };
  const s = Ln(e);
  return {
    type: Y.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Mi(t) {
  const e = [], n = Ws(t.content), r = n.byteLength;
  return e.push(Pt(Lo(r, t.lengthPrefixBytes))), e.push(n), we(e);
}
function Ln(t, e, n) {
  e = e || 1;
  const r = cn(t, Jt) ? t : new Jt(t), s = Ya(ot(r.readBytes(e))), i = Co(r.readBytes(s));
  return jn(i, e, n ?? 128);
}
function VS(t) {
  const e = [], n = Ws(t.content), r = m3(ot(n), Na * 2);
  return e.push(Pt(r)), we(e);
}
function hg(t) {
  const e = cn(t, Jt) ? t : new Jt(t);
  let n = Co(e.readBytes(Na));
  return n = n.replace(/\u0000*$/, ""), { type: Y.MemoString, content: n };
}
function pg(t) {
  const e = [];
  return e.push(Ho(t.address)), e.push(Mi(t.contractName)), e.push(Mi(t.assetName)), we(e);
}
function Ml(t) {
  const e = cn(t, Jt) ? t : new Jt(t);
  return {
    type: Y.Asset,
    address: Hi(e),
    contractName: Ln(e),
    assetName: Ln(e)
  };
}
function Fu(t) {
  const e = t.values, n = [];
  n.push(Pt(Lo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(hr(r));
  return we(n);
}
function gg(t, e, n) {
  const r = cn(t, Jt) ? t : new Jt(t), s = Ya(ot(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case Y.Address:
        i.push(Hi(r));
        break;
      case Y.LengthPrefixedString:
        i.push(Ln(r));
        break;
      case Y.MemoString:
        i.push(hg(r));
        break;
      case Y.Asset:
        i.push(Ml(r));
        break;
      case Y.PostCondition:
        i.push(WS(r));
        break;
      case Y.PublicKey:
        i.push(Pl(r));
        break;
      case Y.TransactionAuthField:
        i.push(XS(r));
        break;
    }
  return Du(i, n);
}
function KS(t) {
  return ot(yg(t));
}
function yg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(dg(t.principal)), (t.conditionType === ie.Fungible || t.conditionType === ie.NonFungible) && e.push(pg(t.asset)), t.conditionType === ie.NonFungible && e.push(nr(t.assetName)), e.push(t.conditionCode), t.conditionType === ie.STX || t.conditionType === ie.Fungible || t.conditionType === ie.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new yi("The post-condition amount may not be larger than 8 bytes");
    e.push(os(t.amount, 8));
  }
  return we(e);
}
function WS(t) {
  const e = cn(t, Jt) ? t : new Jt(t), n = e.readUInt8Enum(ie, (a) => {
    throw new Ve(`Could not read ${a} as PostConditionType`);
  }), r = GS(e);
  let s, i, o;
  switch (n) {
    case ie.STX:
      return s = e.readUInt8Enum(fo, (c) => {
        throw new Ve(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${ot(e.readBytes(8))}`), {
        type: Y.PostCondition,
        conditionType: ie.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case ie.Fungible:
      return i = Ml(e), s = e.readUInt8Enum(fo, (c) => {
        throw new Ve(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${ot(e.readBytes(8))}`), {
        type: Y.PostCondition,
        conditionType: ie.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case ie.NonFungible:
      i = Ml(e);
      const a = Jn(e);
      return s = e.readUInt8Enum(Ll, (c) => {
        throw new Ve(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: Y.PostCondition,
        conditionType: ie.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case ie.Staking:
      return s = e.readUInt8Enum(fo, (c) => {
        throw new Ve(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${ot(e.readBytes(8))}`), {
        type: Y.PostCondition,
        conditionType: ie.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case ie.PoX: {
      const c = e.readUInt8Enum(Cl, (f) => {
        throw new Ve(`Could not read ${f} as PoxConditionCode`);
      });
      return {
        type: Y.PostCondition,
        conditionType: ie.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function wg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case jt.TokenTransfer:
      e.push(nr(t.recipient)), e.push(os(t.amount, 8)), e.push(hr(t.memo));
      break;
    case jt.ContractCall:
      e.push(hr(t.contractAddress)), e.push(hr(t.contractName)), e.push(hr(t.functionName));
      const n = new Uint8Array(4);
      Cs(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(nr(r));
      });
      break;
    case jt.SmartContract:
      e.push(hr(t.contractName)), e.push(hr(t.codeBody));
      break;
    case jt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(hr(t.contractName)), e.push(hr(t.codeBody));
      break;
    case jt.PoisonMicroblock:
      break;
    case jt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case jt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(nr(t.recipient));
      break;
    case jt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(nr(t.recipient ? fg(t.recipient) : ug())), e.push(t.vrfProof);
      break;
    case jt.TenureChange:
      e.push(Pt(t.tenureHash)), e.push(Pt(t.previousTenureHash)), e.push(Pt(t.burnViewHash)), e.push(Pt(t.previousTenureEnd)), e.push(Cs(new Uint8Array(4), t.previousTenureBlocks)), e.push(db(new Uint8Array(1), t.cause)), e.push(Pt(t.publicKeyHash));
      break;
  }
  return we(e);
}
function qS(t) {
  const e = cn(t, Jt) ? t : new Jt(t);
  switch (e.readUInt8Enum(jt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case jt.TokenTransfer:
      const r = Jn(e), s = Re(e.readBytes(8)), i = hg(e);
      return NS(r, s, i);
    case jt.ContractCall:
      const o = Hi(e), a = Ln(e), c = Ln(e), f = [], h = e.readUInt32BE();
      for (let I = 0; I < h; I++) {
        const $ = Jn(e);
        f.push($);
      }
      return US(o, a, c, f);
    case jt.SmartContract:
      const l = Ln(e), y = Ln(e, 4, 1e5);
      return Hd(l, y);
    case jt.VersionedSmartContract: {
      const I = e.readUInt8Enum(kl, (V) => {
        throw new Error(`Cannot recognize ClarityVersion: ${V}`);
      }), $ = Ln(e), N = Ln(e, 4, Mx);
      return Hd($, N, I);
    }
    case jt.PoisonMicroblock:
      return OS();
    case jt.Coinbase: {
      const I = e.readBytes($s);
      return Md(I);
    }
    case jt.CoinbaseToAltRecipient: {
      const I = e.readBytes($s), $ = Jn(e);
      return Md(I, $);
    }
    case jt.NakamotoCoinbase: {
      const I = e.readBytes($s), $ = Jn(e), N = e.readBytes(Il);
      return DS(I, $, N);
    }
    case jt.TenureChange:
      const p = ot(e.readBytes(20)), S = ot(e.readBytes(20)), x = ot(e.readBytes(20)), L = ot(e.readBytes(32)), O = e.readUInt32BE(), P = e.readUInt8Enum(Bl, (I) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${I}`);
      }), g = ot(e.readBytes(20));
      return FS(p, S, x, L, O, P, g);
  }
}
function Nl(t) {
  const e = cn(t, Jt) ? t : new Jt(t);
  return Hl(ot(e.readBytes(cc)));
}
function XS(t) {
  const e = cn(t, Jt) ? t : new Jt(t), n = e.readUInt8Enum(Pn, (r) => {
    throw new Ve(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Pn.PublicKeyCompressed:
      return wi(ue.Compressed, Pl(e));
    case Pn.PublicKeyUncompressed:
      return wi(ue.Uncompressed, zi(B3(Pl(e).data)));
    case Pn.SignatureCompressed:
      return wi(ue.Compressed, Nl(e));
    case Pn.SignatureUncompressed:
      return wi(ue.Uncompressed, Nl(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function ju(t) {
  return Pt(t.data);
}
function YS(t) {
  const e = [];
  switch (t.contents.type) {
    case Y.PublicKey:
      e.push(t.pubKeyEncoding === ue.Compressed ? Pn.PublicKeyCompressed : Pn.PublicKeyUncompressed), e.push(Pt(C3(t.contents.data)));
      break;
    case Y.MessageSignature:
      e.push(t.pubKeyEncoding === ue.Compressed ? Pn.SignatureCompressed : Pn.SignatureUncompressed), e.push(ju(t.contents));
      break;
  }
  return we(e);
}
function Ul(t) {
  return t.data.slice();
}
function Pl(t) {
  const e = cn(t, Jt) ? t : new Jt(t), n = e.readUInt8(), r = n === 4 ? Ix : $x;
  return zi(we([n, e.readBytes(r)]));
}
function zu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Yt.P2PKH || e === Yt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Yt.P2WPKH || e === Yt.P2WSH || e === Yt.P2WSHNonSequential) && !r.map((s) => s.data).every(Ri))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Yt.P2PKH:
      return na(t, x3(r[0].data));
    case Yt.P2WPKH:
      return na(t, S3(r[0].data));
    case Yt.P2SH:
    case Yt.P2SHNonSequential:
      return na(t, A3(n, r.map(Ul)));
    case Yt.P2WSH:
    case Yt.P2WSHNonSequential:
      return na(t, E3(n, r.map(Ul)));
  }
}
function na(t, e) {
  return { type: Y.Address, version: t, hash160: e };
}
function Ru(t) {
  return Ys.c32address(t.version, t.hash160);
}
function Nd(t) {
  const [e, n, r] = t.split(/\.|::/);
  return jS(e, n, r);
}
function ro(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return zS(e, n);
  } else
    return RS(t);
}
function ZS(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return t3(e, n);
  } else
    return QS(t);
}
function QS(t) {
  const e = cs(t);
  return { type: Mt.PrincipalStandard, value: Ru(e) };
}
function JS(t) {
  return { type: Mt.PrincipalStandard, value: Ru(t) };
}
function t3(t, e) {
  const n = cs(t), r = jn(e);
  return bg(n, r);
}
function bg(t, e) {
  if (Ws(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Mt.PrincipalContract,
    value: `${Ru(t)}.${e.content}`
  };
}
function e3(t) {
  return { type: Mt.ResponseErr, value: t };
}
function n3(t) {
  return { type: Mt.ResponseOk, value: t };
}
const r3 = (t) => ({ type: Mt.StringASCII, value: t }), s3 = (t) => ({ type: Mt.StringUTF8, value: t });
function i3(t) {
  for (const e in t)
    if (!v3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Mt.Tuple, value: t };
}
function Jn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Jt(Pt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Jt(t) : e = t;
  switch (e.readUInt8Enum(ke, (r) => {
    throw new Ve(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case ke.int:
      return TS(fl(e.readBytes(16)));
    case ke.uint:
      return _S(e.readBytes(16));
    case ke.buffer:
      const r = e.readUInt32BE();
      return CS(e.readBytes(r));
    case ke.true:
      return kS();
    case ke.false:
      return LS();
    case ke.address:
      const s = Hi(e);
      return JS(s);
    case ke.contract:
      const i = Hi(e), o = Ln(e);
      return bg(i, o);
    case ke.ok:
      return n3(Jn(e));
    case ke.err:
      return e3(Jn(e));
    case ke.none:
      return ug();
    case ke.some:
      return fg(Jn(e));
    case ke.list:
      const a = e.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(Jn(e));
      return HS(c);
    case ke.tuple:
      const f = e.readUInt32BE(), h = {};
      for (let x = 0; x < f; x++) {
        const L = Ln(e).content;
        if (L === void 0)
          throw new Ve('"content" is undefined');
        h[L] = Jn(e);
      }
      return i3(h);
    case ke.ascii:
      const l = e.readUInt32BE(), y = sb(e.readBytes(l));
      return r3(y);
    case ke.utf8:
      const p = e.readUInt32BE(), S = Co(e.readBytes(p));
      return s3(S);
    default:
      throw new Ve("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function ar(t, e) {
  return we([Ou(t), e]);
}
function o3(t) {
  return new Uint8Array([Ou(t.type)]);
}
function a3(t) {
  return t.type === Mt.OptionalNone ? new Uint8Array([Ou(t.type)]) : ar(t.type, nr(t.value));
}
function c3(t) {
  const e = new Uint8Array(4);
  return Cs(e, Math.ceil(t.value.length / 2), 0), ar(t.type, ir(e, Pt(t.value)));
}
function l3(t) {
  const e = gu(Jw(BigInt(t.value), BigInt(vx)), eg);
  return ar(t.type, e);
}
function u3(t) {
  const e = gu(BigInt(t.value), eg);
  return ar(t.type, e);
}
function f3(t) {
  return ar(t.type, Ho(cs(t.value)));
}
function d3(t) {
  const [e, n] = $3(t.value);
  return ar(t.type, ir(Ho(cs(e)), Mi(jn(n))));
}
function h3(t) {
  return ar(t.type, nr(t.value));
}
function p3(t) {
  const e = [], n = new Uint8Array(4);
  Cs(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = nr(r);
    e.push(s);
  }
  return ar(t.type, we(e));
}
function g3(t) {
  const e = [], n = new Uint8Array(4);
  Cs(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = jn(s);
    e.push(Mi(i));
    const o = nr(t.value[s]);
    e.push(o);
  }
  return ar(t.type, we(e));
}
function mg(t, e) {
  const n = [], r = e == "ascii" ? rb(t.value) : Ws(t.value), s = new Uint8Array(4);
  return Cs(s, r.length, 0), n.push(s), n.push(r), ar(t.type, we(n));
}
function y3(t) {
  return mg(t, "ascii");
}
function w3(t) {
  return mg(t, "utf8");
}
function Ud(t) {
  return ot(nr(t));
}
function nr(t) {
  switch (t.type) {
    case Mt.BoolTrue:
    case Mt.BoolFalse:
      return o3(t);
    case Mt.OptionalNone:
    case Mt.OptionalSome:
      return a3(t);
    case Mt.Buffer:
      return c3(t);
    case Mt.UInt:
      return u3(t);
    case Mt.Int:
      return l3(t);
    case Mt.PrincipalStandard:
      return f3(t);
    case Mt.PrincipalContract:
      return d3(t);
    case Mt.ResponseOk:
    case Mt.ResponseErr:
      return h3(t);
    case Mt.List:
      return p3(t);
    case Mt.Tuple:
      return g3(t);
    case Mt.StringASCII:
      return y3(t);
    case Mt.StringUTF8:
      return w3(t);
    default:
      throw new yi("Unable to serialize. Invalid Clarity Value.");
  }
}
const b3 = (t) => t.length % 2 ? `0${t}` : t, m3 = (t, e) => t.padEnd(e, "0"), xg = (t, e) => t ? Ws(t).length > e : !1;
function Ol(t) {
  return Zp(t);
}
const wo = (t) => Jx(Nu(t)), Gu = (t) => ot(IS(t)), x3 = (t) => ot(wo(t)), S3 = (t) => {
  const e = wo(t), n = ir(new Uint8Array([0]), new Uint8Array([e.length]), e), r = wo(n);
  return ot(r);
}, A3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = we(n), s = wo(r);
  return ot(s);
}, E3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = we(n), s = Nu(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = we(i), a = wo(o);
  return ot(a);
};
function v3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function $3(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
ge.hmacSha256Sync = (t, ...e) => {
  const n = ig.create(Nu, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function zi(t) {
  return t = typeof t == "string" ? Pt(t) : t, {
    type: Y.PublicKey,
    data: t
  };
}
function I3(t, e, n = ue.Compressed) {
  const r = cb(e), s = new bn(Pf(r.r), Pf(r.s)), i = $t.fromSignature(t, s, r.recoveryId), o = n === ue.Compressed;
  return i.toHex(o);
}
function k3(t) {
  return typeof t == "string" ? t : ot(t);
}
const Vu = k3;
function Sg(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === ab;
}
function Ri(t) {
  return !Vu(t).startsWith("04");
}
function L3(t) {
  t = yu(t);
  const e = Sg(t);
  return ot(Bo(t.slice(0, 32), e));
}
function C3(t) {
  return $t.fromHex(Vu(t)).toHex(!0);
}
function B3(t) {
  return $t.fromHex(Vu(t)).toHex(!1);
}
function T3(t, e) {
  t = yu(t);
  const [n, r] = Qa(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Lo(r, 1) + bn.fromHex(n).toCompactHex();
}
function Ku() {
  return {
    type: Y.MessageSignature,
    data: ot(new Uint8Array(cc))
  };
}
function Ag(t, e, n, r) {
  const s = zu(0, t, 1, [zi(e)]).hash160, i = Ri(e) ? ue.Compressed : ue.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Re(n),
    fee: Re(r),
    keyEncoding: i,
    signature: Ku()
  };
}
function bo(t) {
  return "signature" in t;
}
function Pd(t) {
  return t === Yt.P2SH || t === Yt.P2WSH;
}
function _3(t) {
  return t === Yt.P2SHNonSequential || t === Yt.P2WSHNonSequential;
}
function Od(t) {
  const e = Ol(t);
  return e.nonce = 0, e.fee = 0, bo(e) ? e.signature = Ku() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function H3(t) {
  const e = [
    t.hashMode,
    Pt(t.signer),
    os(t.nonce, 8),
    os(t.fee, 8),
    t.keyEncoding,
    ju(t.signature)
  ];
  return we(e);
}
function M3(t) {
  const e = [
    t.hashMode,
    Pt(t.signer),
    os(t.nonce, 8),
    os(t.fee, 8)
  ], n = Du(t.fields);
  e.push(Fu(n));
  const r = new Uint8Array(2);
  return ub(r, t.signaturesRequired, 0), e.push(r), we(e);
}
function N3(t, e) {
  const n = ot(e.readBytes(20)), r = BigInt(`0x${ot(e.readBytes(8))}`), s = BigInt(`0x${ot(e.readBytes(8))}`), i = e.readUInt8Enum(ue, (a) => {
    throw new Ve(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Yt.P2WPKH && i != ue.Compressed)
    throw new Ve("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Nl(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function U3(t, e) {
  const n = ot(e.readBytes(20)), r = BigInt("0x" + ot(e.readBytes(8))), s = BigInt("0x" + ot(e.readBytes(8))), i = gg(e, Y.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const f of i)
    switch (f.contents.type) {
      case Y.PublicKey:
        Ri(f.contents.data) || (o = !0);
        break;
      case Y.MessageSignature:
        if (f.pubKeyEncoding === ue.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new ms("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Yt.P2WSH || t === Yt.P2WSHNonSequential))
    throw new ms("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Fc(t) {
  return bo(t) ? H3(t) : M3(t);
}
function jc(t) {
  const e = t.readUInt8Enum(Yt, (n) => {
    throw new Ve(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Yt.P2PKH || e === Yt.P2WPKH ? N3(e, t) : U3(e, t);
}
function Eg(t, e, n, r) {
  const i = t + ot(new Uint8Array([e])) + ot(os(n, 8)) + ot(os(r, 8));
  if (Pt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Gu(Pt(i));
}
function vg(t, e, n) {
  const r = 33 + cc, s = Ri(e.data) ? ue.Compressed : ue.Uncompressed, i = t + b3(s.toString(16)) + n, o = Pt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Gu(o);
}
function P3(t, e, n, r, s) {
  const i = Eg(t, e, n, r), o = T3(s, i), a = zi(L3(s)), c = vg(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function $g(t, e, n, r, s, i) {
  const o = Eg(t, e, n, r), a = zi(I3(o, i, s)), c = vg(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function O3() {
  const t = Ag(Yt.P2PKH, "", 0, 0);
  return t.signer = MS().hash160, t.keyEncoding = ue.Compressed, t.signature = Ku(), t;
}
function Dd(t, e, n) {
  return bo(t) ? D3(t, e, n) : F3(t, e, n);
}
function D3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = $g(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = zu(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new ms(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function F3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case Y.PublicKey:
        Ri(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case Y.MessageSignature:
        c.pubKeyEncoding === ue.Uncompressed && (i = !0);
        const { pubKey: f, nextSigHash: h } = $g(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Pd(t.hashMode) && (s = h), r.push(f), o += 1, o === 65536)
          throw new ms("Too many signatures");
        break;
    }
  if (Pd(t.hashMode) && o !== t.signaturesRequired || _3(t.hashMode) && o < t.signaturesRequired)
    throw new ms("Incorrect number of signatures");
  if (i && (t.hashMode === Yt.P2WSH || t.hashMode === Yt.P2WSHNonSequential))
    throw new ms("Uncompressed keys are not allowed in this hash mode");
  const a = zu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new ms(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Ig(t) {
  return {
    authType: he.Standard,
    spendingCondition: t
  };
}
function kg(t, e) {
  return {
    authType: he.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Ag(Yt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Fd(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case he.Standard:
        return Ig(Od(t.spendingCondition));
      case he.Sponsored:
        return kg(Od(t.spendingCondition), O3());
      default:
        throw new Pa("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function j3(t, e) {
  switch (t.authType) {
    case he.Standard:
      return Dd(t.spendingCondition, e, he.Standard);
    case he.Sponsored:
      return Dd(t.spendingCondition, e, he.Standard);
    default:
      throw new Pa("Invalid origin auth type");
  }
}
function z3(t, e) {
  switch (t.authType) {
    case he.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Re(e)
      };
      return { ...t, spendingCondition: n };
    case he.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Re(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function R3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Re(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function G3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Re(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function V3(t, e) {
  const n = {
    ...e,
    nonce: Re(e.nonce),
    fee: Re(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function K3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case he.Standard:
      e.push(Fc(t.spendingCondition));
      break;
    case he.Sponsored:
      e.push(Fc(t.spendingCondition)), e.push(Fc(t.sponsorSpendingCondition));
      break;
  }
  return we(e);
}
function W3(t) {
  const e = t.readUInt8Enum(he, (r) => {
    throw new Ve(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case he.Standard:
      return n = jc(t), Ig(n);
    case he.Sponsored:
      n = jc(t);
      const r = jc(t);
      return kg(n, r);
  }
}
class q3 {
  constructor({ auth: e, payload: n, postConditions: r = Du([]), postConditionMode: s = Ua.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = Sx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Re(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = hn.Any;
  }
  signBegin() {
    const e = Ol(this);
    return e.auth = Fd(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Ol(this);
    return e.auth = Fd(e.auth), e.txid();
  }
  verifyOrigin() {
    return j3(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, he.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === he.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, he.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : zi(e), r = this.auth.spendingCondition;
    if (r && !bo(r)) {
      const s = Ri(n.data);
      r.fields.push(wi(s ? ue.Compressed : ue.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = P3(n, r, e.fee, e.nonce, s);
    if (bo(e))
      e.signature = Hl(i);
    else {
      const a = Sg(s);
      e.fields.push(wi(a ? ue.Compressed : ue.Uncompressed, Hl(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return Gu(e);
  }
  setSponsor(e) {
    if (this.auth.authType != he.Sponsored)
      throw new Pa("Cannot sponsor sign a non-sponsored transaction");
    this.auth = V3(this.auth, e);
  }
  setFee(e) {
    this.auth = z3(this.auth, e);
  }
  setNonce(e) {
    this.auth = R3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != he.Sponsored)
      throw new Pa("Cannot sponsor sign a non-sponsored transaction");
    this.auth = G3(this.auth, e);
  }
  serialize() {
    return ot(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new yi('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new yi('"chainId" is undefined');
    if (this.auth === void 0)
      throw new yi('"auth" is undefined');
    if (this.payload === void 0)
      throw new yi('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Cs(n, this.chainId, 0), e.push(n), e.push(K3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Fu(this.postConditions)), e.push(wg(this.payload)), we(e);
  }
}
function X3(t) {
  const e = cn(t, Jt) ? t : new Jt(t), n = e.readUInt8Enum(Os, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = W3(e), i = e.readUInt8Enum(hn, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), o = e.readUInt8Enum(Ua, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = gg(e, Y.PostCondition), c = qS(e), f = new q3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return f.anchorMode = i, f;
}
const jd = BigInt("18446744073709551615");
function zc(t) {
  const e = Re(t);
  if (e < 0n || e > jd)
    throw new RangeError(`Post-condition amount must be between 0 and ${jd} (u64 max), received: ${e}`);
  return e;
}
var Dl;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Dl || (Dl = {}));
var Fl;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Fl || (Fl = {}));
function Y3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: Y.PostCondition,
        conditionType: ie.STX,
        principal: t.address === "origin" ? { type: Y.Principal, prefix: qe.Origin } : ro(t.address),
        conditionCode: ra(t.condition),
        amount: zc(t.amount)
      };
    case "ft-postcondition":
      return {
        type: Y.PostCondition,
        conditionType: ie.Fungible,
        principal: t.address === "origin" ? { type: Y.Principal, prefix: qe.Origin } : ro(t.address),
        conditionCode: ra(t.condition),
        amount: zc(t.amount),
        asset: Nd(t.asset)
      };
    case "nft-postcondition":
      return {
        type: Y.PostCondition,
        conditionType: ie.NonFungible,
        principal: t.address === "origin" ? { type: Y.Principal, prefix: qe.Origin } : ro(t.address),
        conditionCode: ra(t.condition),
        asset: Nd(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: Y.PostCondition,
        conditionType: ie.Staking,
        principal: t.address === "origin" ? { type: Y.Principal, prefix: qe.Origin } : ro(t.address),
        conditionCode: ra(t.condition),
        amount: zc(t.amount)
      };
    case "pox-postcondition":
      return {
        type: Y.PostCondition,
        conditionType: ie.PoX,
        principal: t.address === "origin" ? { type: Y.Principal, prefix: qe.Origin } : ro(t.address),
        conditionCode: Z3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function ra(t) {
  return Dl[t];
}
function Z3(t) {
  return Fl[t];
}
function Lg(t) {
  const e = Y3(t);
  return KS(e);
}
function Q3(t, e, n) {
  return qu(Cg(t), n);
}
function Cg(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = mo(r);
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
    return BigInt(`0x${e4(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Wu(t, e = 8) {
  return (typeof t == "bigint" ? t : Cg(t)).toString(16).padStart(e * 2, "0");
}
function qu(t, e = 16) {
  const n = Wu(t, e);
  return mo(n);
}
function J3(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const t4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function e4(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += t4[n];
  return e;
}
function mo(t) {
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
function Xu(t) {
  return new TextEncoder().encode(t);
}
function n4(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function r4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function zd(t) {
  if (t.some(r4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Yu(...t) {
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
function Sr(t) {
  return Yu(...t.map((e) => typeof e == "number" ? zd([e]) : e instanceof Array ? zd(e) : e));
}
function fc(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var jl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(jl || (jl = {}));
jl.Mainnet;
const s4 = 128, i4 = 128, Bg = 16;
var zl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(zl || (zl = {}));
var Rd;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Rd || (Rd = {}));
var Gd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Gd || (Gd = {}));
var Un;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Un || (Un = {}));
const Rc = ["onChainOnly", "offChainOnly", "any"];
Rc[0] + "", Un.OnChainOnly, Rc[1] + "", Un.OffChainOnly, Rc[2] + "", Un.Any, Un.OnChainOnly + "", Un.OnChainOnly, Un.OffChainOnly + "", Un.OffChainOnly, Un.Any + "", Un.Any;
var Rl;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Rl || (Rl = {}));
Rl.Mainnet;
var Vd;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Vd || (Vd = {}));
var gs;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(gs || (gs = {}));
var Kd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Kd || (Kd = {}));
var Wd;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Wd || (Wd = {}));
var qd;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(qd || (qd = {}));
var Xd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Xd || (Xd = {}));
var Yd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Yd || (Yd = {}));
var Zd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Zd || (Zd = {}));
var Gl;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Gl || (Gl = {}));
var Qd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Qd || (Qd = {}));
var Jd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Jd || (Jd = {}));
function Vl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function o4(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Tg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function a4(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Vl(t.outputLen), Vl(t.blockLen);
}
function c4(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function l4(t, e) {
  Tg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Gc = {
  number: Vl,
  bool: o4,
  bytes: Tg,
  hash: a4,
  exists: c4,
  output: l4
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Vc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Xn = (t, e) => t << 32 - e | t >>> e, u4 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!u4)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function f4(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function _g(t) {
  if (typeof t == "string" && (t = f4(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let d4 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Qs(t) {
  const e = (r) => t().update(_g(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function h4(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let Zu = class extends d4 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Vc(this.buffer);
  }
  update(e) {
    Gc.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = _g(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Vc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Gc.exists(this), Gc.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    h4(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Vc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
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
const p4 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Hg = Uint8Array.from({ length: 16 }, (t, e) => e), g4 = Hg.map((t) => (9 * t + 5) % 16);
let Qu = [Hg], Ju = [g4];
for (let t = 0; t < 4; t++)
  for (let e of [Qu, Ju])
    e.push(e[t].map((n) => p4[n]));
const Mg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), y4 = Qu.map((t, e) => t.map((n) => Mg[e][n])), w4 = Ju.map((t, e) => t.map((n) => Mg[e][n])), b4 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), m4 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), sa = (t, e) => t << e | t >>> 32 - e;
function th(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ia = new Uint32Array(16);
let x4 = class extends Zu {
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
      ia[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, h = f, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const S = 4 - p, x = b4[p], L = m4[p], O = Qu[p], P = Ju[p], g = y4[p], I = w4[p];
      for (let $ = 0; $ < 16; $++) {
        const N = sa(r + th(p, i, a, f) + ia[O[$]] + x, g[$]) + l | 0;
        r = l, l = f, f = sa(a, 10) | 0, a = i, i = N;
      }
      for (let $ = 0; $ < 16; $++) {
        const N = sa(s + th(S, o, c, h) + ia[P[$]] + L, I[$]) + y | 0;
        s = y, y = h, h = sa(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + f + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    ia.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Qs(() => new x4());
const S4 = (t, e, n) => t & e ^ ~t & n, A4 = (t, e, n) => t & e ^ t & n ^ e & n, E4 = new Uint32Array([
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
]), zr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Rr = new Uint32Array(64);
let Ng = class extends Zu {
  constructor() {
    super(64, 32, 8, !1), this.A = zr[0] | 0, this.B = zr[1] | 0, this.C = zr[2] | 0, this.D = zr[3] | 0, this.E = zr[4] | 0, this.F = zr[5] | 0, this.G = zr[6] | 0, this.H = zr[7] | 0;
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
      const y = Rr[l - 15], p = Rr[l - 2], S = Xn(y, 7) ^ Xn(y, 18) ^ y >>> 3, x = Xn(p, 17) ^ Xn(p, 19) ^ p >>> 10;
      Rr[l] = x + Rr[l - 7] + S + Rr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = Xn(a, 6) ^ Xn(a, 11) ^ Xn(a, 25), p = h + y + S4(a, c, f) + E4[l] + Rr[l] | 0, x = (Xn(r, 2) ^ Xn(r, 13) ^ Xn(r, 22)) + A4(r, s, i) | 0;
      h = f, f = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, f, h);
  }
  roundClean() {
    Rr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, v4 = class extends Ng {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Qs(() => new Ng());
Qs(() => new v4());
const oa = BigInt(2 ** 32 - 1), Kl = BigInt(32);
function Ug(t, e = !1) {
  return e ? { h: Number(t & oa), l: Number(t >> Kl & oa) } : { h: Number(t >> Kl & oa) | 0, l: Number(t & oa) | 0 };
}
function $4(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Ug(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const I4 = (t, e) => BigInt(t >>> 0) << Kl | BigInt(e >>> 0), k4 = (t, e, n) => t >>> n, L4 = (t, e, n) => t << 32 - n | e >>> n, C4 = (t, e, n) => t >>> n | e << 32 - n, B4 = (t, e, n) => t << 32 - n | e >>> n, T4 = (t, e, n) => t << 64 - n | e >>> n - 32, _4 = (t, e, n) => t >>> n - 32 | e << 64 - n, H4 = (t, e) => e, M4 = (t, e) => t, N4 = (t, e, n) => t << n | e >>> 32 - n, U4 = (t, e, n) => e << n | t >>> 32 - n, P4 = (t, e, n) => e << n - 32 | t >>> 64 - n, O4 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function D4(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const F4 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), j4 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, z4 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), R4 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, G4 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), V4 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, At = {
  fromBig: Ug,
  split: $4,
  toBig: I4,
  shrSH: k4,
  shrSL: L4,
  rotrSH: C4,
  rotrSL: B4,
  rotrBH: T4,
  rotrBL: _4,
  rotr32H: H4,
  rotr32L: M4,
  rotlSH: N4,
  rotlSL: U4,
  rotlBH: P4,
  rotlBL: O4,
  add: D4,
  add3L: F4,
  add3H: j4,
  add4L: z4,
  add4H: R4,
  add5H: V4,
  add5L: G4
}, [K4, W4] = At.split([
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
].map((t) => BigInt(t))), Gr = new Uint32Array(80), Vr = new Uint32Array(80);
let dc = class extends Zu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: h, Fh: l, Fl: y, Gh: p, Gl: S, Hh: x, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, f, h, l, y, p, S, x, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, h, l, y, p, S, x, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let g = 0; g < 16; g++, n += 4)
      Gr[g] = e.getUint32(n), Vr[g] = e.getUint32(n += 4);
    for (let g = 16; g < 80; g++) {
      const I = Gr[g - 15] | 0, $ = Vr[g - 15] | 0, N = At.rotrSH(I, $, 1) ^ At.rotrSH(I, $, 8) ^ At.shrSH(I, $, 7), V = At.rotrSL(I, $, 1) ^ At.rotrSL(I, $, 8) ^ At.shrSL(I, $, 7), D = Gr[g - 2] | 0, j = Vr[g - 2] | 0, A = At.rotrSH(D, j, 19) ^ At.rotrBH(D, j, 61) ^ At.shrSH(D, j, 6), B = At.rotrSL(D, j, 19) ^ At.rotrBL(D, j, 61) ^ At.shrSL(D, j, 6), _ = At.add4L(V, B, Vr[g - 7], Vr[g - 16]), T = At.add4H(_, N, A, Gr[g - 7], Gr[g - 16]);
      Gr[g] = T | 0, Vr[g] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: h, Eh: l, El: y, Fh: p, Fl: S, Gh: x, Gl: L, Hh: O, Hl: P } = this;
    for (let g = 0; g < 80; g++) {
      const I = At.rotrSH(l, y, 14) ^ At.rotrSH(l, y, 18) ^ At.rotrBH(l, y, 41), $ = At.rotrSL(l, y, 14) ^ At.rotrSL(l, y, 18) ^ At.rotrBL(l, y, 41), N = l & p ^ ~l & x, V = y & S ^ ~y & L, D = At.add5L(P, $, V, W4[g], Vr[g]), j = At.add5H(D, O, I, N, K4[g], Gr[g]), A = D | 0, B = At.rotrSH(r, s, 28) ^ At.rotrBH(r, s, 34) ^ At.rotrBH(r, s, 39), _ = At.rotrSL(r, s, 28) ^ At.rotrBL(r, s, 34) ^ At.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, J = s & o ^ s & c ^ o & c;
      O = x | 0, P = L | 0, x = p | 0, L = S | 0, p = l | 0, S = y | 0, { h: l, l: y } = At.add(f | 0, h | 0, j | 0, A | 0), f = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = At.add3L(A, _, J);
      r = At.add3H(z, j, B, T), s = z | 0;
    }
    ({ h: r, l: s } = At.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = At.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = At.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: h } = At.add(this.Dh | 0, this.Dl | 0, f | 0, h | 0), { h: l, l: y } = At.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: S } = At.add(this.Fh | 0, this.Fl | 0, p | 0, S | 0), { h: x, l: L } = At.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: O, l: P } = At.add(this.Hh | 0, this.Hl | 0, O | 0, P | 0), this.set(r, s, i, o, a, c, f, h, l, y, p, S, x, L, O, P);
  }
  roundClean() {
    Gr.fill(0), Vr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, q4 = class extends dc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, X4 = class extends dc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Y4 = class extends dc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Qs(() => new dc());
Qs(() => new q4());
Qs(() => new X4());
Qs(() => new Y4());
function Z4(t, e, n) {
  const s = s4;
  if (hA(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: zl.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Ce;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Ce || (Ce = {}));
let Q4 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Pg = class extends Q4 {
  constructor(e) {
    super(e);
  }
};
function hc(t) {
  const e = [];
  return e.push(mo(Wu(t.version, 1))), e.push(mo(t.hash160)), Sr(e);
}
function J4(t) {
  const e = [];
  return e.push(t.prefix), e.push(hc(t.address)), t.prefix === Gl.Contract && e.push(xo(t.contractName)), Sr(e);
}
function xo(t) {
  const e = [], n = Xu(t.content), r = n.byteLength;
  return e.push(mo(Wu(r, t.lengthPrefixBytes))), e.push(n), Sr(e);
}
function tA(t) {
  const e = [];
  return e.push(hc(t.address)), e.push(xo(t.contractName)), e.push(xo(t.assetName)), Sr(e);
}
function Og(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(J4(t.principal)), (t.conditionType === gs.Fungible || t.conditionType === gs.NonFungible) && e.push(tA(t.assetInfo)), t.conditionType === gs.NonFungible && e.push(Fs(t.assetName)), e.push(t.conditionCode), t.conditionType === gs.STX || t.conditionType === gs.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Pg("The post-condition amount may not be larger than 8 bytes");
    e.push(Q3(t.amount, !1, 8));
  }
  return Sr(e);
}
function cr(t, e) {
  return Sr([t, e]);
}
function eA(t) {
  return new Uint8Array([t.type]);
}
function nA(t) {
  return t.type === Ce.OptionalNone ? new Uint8Array([t.type]) : cr(t.type, Fs(t.value));
}
function rA(t) {
  const e = new Uint8Array(4);
  return fc(e, t.buffer.length, 0), cr(t.type, Yu(e, t.buffer));
}
function sA(t) {
  const e = qu(J3(t.value, BigInt(i4)), Bg);
  return cr(t.type, e);
}
function iA(t) {
  const e = qu(t.value, Bg);
  return cr(t.type, e);
}
function oA(t) {
  return cr(t.type, hc(t.address));
}
function aA(t) {
  return cr(t.type, Yu(hc(t.address), xo(t.contractName)));
}
function cA(t) {
  return cr(t.type, Fs(t.value));
}
function lA(t) {
  const e = [], n = new Uint8Array(4);
  fc(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Fs(r);
    e.push(s);
  }
  return cr(t.type, Sr(e));
}
function uA(t) {
  const e = [], n = new Uint8Array(4);
  fc(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Z4(s);
    e.push(xo(i));
    const o = Fs(t.data[s]);
    e.push(o);
  }
  return cr(t.type, Sr(e));
}
function Dg(t, e) {
  const n = [], r = e == "ascii" ? n4(t.data) : Xu(t.data), s = new Uint8Array(4);
  return fc(s, r.length, 0), n.push(s), n.push(r), cr(t.type, Sr(n));
}
function fA(t) {
  return Dg(t, "ascii");
}
function dA(t) {
  return Dg(t, "utf8");
}
function Fs(t) {
  switch (t.type) {
    case Ce.BoolTrue:
    case Ce.BoolFalse:
      return eA(t);
    case Ce.OptionalNone:
    case Ce.OptionalSome:
      return nA(t);
    case Ce.Buffer:
      return rA(t);
    case Ce.UInt:
      return iA(t);
    case Ce.Int:
      return sA(t);
    case Ce.PrincipalStandard:
      return oA(t);
    case Ce.PrincipalContract:
      return aA(t);
    case Ce.ResponseOk:
    case Ce.ResponseErr:
      return cA(t);
    case Ce.List:
      return lA(t);
    case Ce.Tuple:
      return uA(t);
    case Ce.StringASCII:
      return fA(t);
    case Ce.StringUTF8:
      return dA(t);
    default:
      throw new Pg("Unable to serialize. Invalid Clarity Value.");
  }
}
const hA = (t, e) => t ? Xu(t).length > e : !1, pA = "connect-ui";
let xa, Fg, pn = !1, Wl = !1;
const mr = (t, e = "") => () => {
}, gA = (t, e) => () => {
}, yA = "{visibility:hidden}.hydrated{visibility:inherit}", eh = {}, wA = "http://www.w3.org/2000/svg", bA = "http://www.w3.org/1999/xhtml", mA = (t) => t != null, tf = (t) => (t = typeof t, t === "object" || t === "function");
function jg(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const wt = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (f) => {
    for (let h = 0; h < f.length; h++)
      r = f[h], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !tf(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? ql(null, r) : r), i = s);
  };
  if (a(n), e) {
    const f = e.className || e.class;
    f && (e.class = typeof f != "object" ? f : Object.keys(f).filter((h) => f[h]).join(" "));
  }
  const c = ql(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, ql = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, xA = {}, SA = (t) => t && t.$tag$ === xA, AA = (t, e) => t != null && !tf(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, EA = (t) => Gi(t).$hostElement$, vA = (t, e, n) => {
  const r = ze.ce(e, n);
  return t.dispatchEvent(r), r;
}, nh = /* @__PURE__ */ new WeakMap(), $A = (t, e, n) => {
  let r = Oa.get(t);
  VA && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Oa.set(t, r);
}, IA = (t, e, n, r) => {
  var s;
  let i = zg(e);
  const o = Oa.get(i);
  if (t = t.nodeType === 11 ? t : rr, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = nh.get(t), c;
      if (a || nh.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = rr.createElement("style"), c.innerHTML = o;
          const f = (s = ze.$nonce$) !== null && s !== void 0 ? s : jg(rr);
          f != null && c.setAttribute("nonce", f), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, kA = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = mr("attachStyles", e.$tagName$), i = IA(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, zg = (t, e) => "sc-" + t.$tagName$, rh = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = ih(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, f = sh(n), h = sh(r);
      c.remove(...f.filter((l) => l && !h.includes(l))), c.add(...h.filter((l) => l && !f.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : ih(pc, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && ze.rel(t, e, n, !1), r && ze.ael(t, e, r, !1);
    else {
      const c = tf(r);
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
}, LA = /\s/, sh = (t) => t ? t.split(LA) : [], Rg = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || eh, o = e.$attrs$ || eh;
  for (r in i)
    r in o || rh(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    rh(s, r, i[r], o[r], n, e.$flags$);
}, ef = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = rr.createTextNode(s.$text$);
  else {
    if (pn || (pn = s.$tag$ === "svg"), o = s.$elm$ = rr.createElementNS(pn ? wA : bA, s.$tag$), pn && s.$tag$ === "foreignObject" && (pn = !1), Rg(null, s, pn), mA(xa) && o["s-si"] !== xa && o.classList.add(o["s-si"] = xa), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = ef(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? pn = !1 : o.tagName === "foreignObject" && (pn = !0);
  }
  return o;
}, Gg = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Fg && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = ef(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, Vg = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, CA = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], f = r.length - 1, h = r[0], l = r[f], y;
  for (; s <= o && i <= f; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : h == null ? h = r[++i] : l == null ? l = r[--f] : aa(a, h) ? (oo(a, h), a = e[++s], h = r[++i]) : aa(c, l) ? (oo(c, l), c = e[--o], l = r[--f]) : aa(a, l) ? (oo(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--f]) : aa(c, h) ? (oo(c, h), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], h = r[++i]) : (y = ef(e && e[i], n, i), h = r[++i], y && a.$elm$.parentNode.insertBefore(y, a.$elm$));
  s > o ? Gg(t, r[f + 1] == null ? null : r[f + 1].$elm$, n, r, i, f) : i > f && Vg(e, s, o);
}, aa = (t, e) => t.$tag$ === e.$tag$, oo = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (pn = i === "svg" ? !0 : i === "foreignObject" ? !1 : pn, Rg(t, e, pn), r !== null && s !== null ? CA(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), Gg(n, null, e, s, 0, s.length - 1)) : r !== null && Vg(r, 0, r.length - 1), pn && i === "svg" && (pn = !1)) : t.$text$ !== o && (n.data = o);
}, BA = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || ql(null, null), s = SA(e) ? e : wt(null, null, e);
  Fg = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, xa = n["s-sc"], oo(r, s);
}, Kg = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, nf = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Kg(t, t.$ancestorComponent$), WA(() => TA(t, e));
}, TA = (t, e) => {
  const n = mr("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), NA(s, () => _A(t, r, e));
}, _A = async (t, e, n) => {
  const r = t.$hostElement$, s = mr("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && kA(t);
  const o = mr("render", t.$cmpMeta$.$tagName$);
  HA(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => MA(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, HA = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, BA(t, e);
  } catch (r) {
    So(r, t.$hostElement$);
  }
  return null;
}, MA = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = mr("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, qg(n), r(), t.$onReadyResolve$(n), s || Wg()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && sf(() => nf(t, !1)), t.$flags$ &= -517;
}, Wg = (t) => {
  qg(rr.documentElement), sf(() => vA(pc, "appload", { detail: { namespace: pA } }));
}, NA = (t, e) => t && t.then ? t.then(e) : e(), qg = (t) => t.classList.add("hydrated"), UA = (t, e) => Gi(t).$instanceValues$.get(e), PA = (t, e, n, r) => {
  const s = Gi(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = AA(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), f = n !== i && !c;
  (!(o & 8) || i === void 0) && f && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && nf(s, !1));
}, Xg = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return UA(this, i);
        },
        set(a) {
          PA(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        ze.jmp(() => {
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
}, OA = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = GA(n), s.then) {
        const c = gA();
        s = await s, c();
      }
      s.isProxied || (Xg(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = mr("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        So(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = zg(n);
      if (!Oa.has(c)) {
        const f = mr("registerStyles", n.$tagName$);
        $A(c, a, !!(n.$flags$ & 1)), f();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => nf(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, DA = (t) => {
  if (!(ze.$flags$ & 1)) {
    const e = Gi(t), n = e.$cmpMeta$, r = mr("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Kg(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), OA(t, e, n);
    }
    r();
  }
}, FA = (t) => {
  ze.$flags$ & 1 || Gi(t);
}, jA = (t, e = {}) => {
  var n;
  const r = mr(), s = [], i = e.exclude || [], o = pc.customElements, a = rr.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), f = /* @__PURE__ */ rr.createElement("style"), h = [];
  let l, y = !0;
  Object.assign(ze, e), ze.$resourcesUrl$ = new URL(e.resourcesUrl || "./", rr.baseURI).href, t.map((p) => {
    p[1].map((S) => {
      const x = {
        $flags$: S[0],
        $tagName$: S[1],
        $members$: S[2],
        $listeners$: S[3]
      };
      x.$members$ = S[2];
      const L = x.$tagName$, O = class extends HTMLElement {
        // StencilLazyHost
        constructor(P) {
          super(P), P = this, RA(P, x), x.$flags$ & 1 && P.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), y ? h.push(this) : ze.jmp(() => DA(this));
        }
        disconnectedCallback() {
          ze.jmp(() => FA(this));
        }
        componentOnReady() {
          return Gi(this).$onReadyPromise$;
        }
      };
      x.$lazyBundleId$ = p[0], !i.includes(L) && !o.get(L) && (s.push(L), o.define(L, Xg(
        O,
        x,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    f.innerHTML = s + yA, f.setAttribute("data-styles", "");
    const p = (n = ze.$nonce$) !== null && n !== void 0 ? n : jg(rr);
    p != null && f.setAttribute("nonce", p), a.insertBefore(f, c ? c.nextSibling : a.firstChild);
  }
  y = !1, h.length ? h.map((p) => p.connectedCallback()) : ze.jmp(() => l = setTimeout(Wg, 30)), r();
}, rf = /* @__PURE__ */ new WeakMap(), Gi = (t) => rf.get(t), zA = (t, e) => rf.set(e.$lazyInstance$ = t, e), RA = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], rf.set(t, n);
}, ih = (t, e) => e in t, So = (t, e) => (0, console.error)(t, e), Kc = /* @__PURE__ */ new Map(), GA = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Kc.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (Kc.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => C$).then(o, So);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Kc.set(s, o), o[r]), So);
}, Oa = /* @__PURE__ */ new Map(), pc = typeof window < "u" ? window : {}, rr = pc.document || { head: {} }, ze = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Yg = (t) => Promise.resolve(t), VA = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), oh = [], Zg = [], KA = (t, e) => (n) => {
  t.push(n), Wl || (Wl = !0, ze.$flags$ & 4 ? sf(Xl) : ze.raf(Xl));
}, ah = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      So(n);
    }
  t.length = 0;
}, Xl = () => {
  ah(oh), ah(Zg), (Wl = oh.length > 0) && ze.raf(Xl);
}, sf = (t) => Yg().then(t), WA = /* @__PURE__ */ KA(Zg), qA = () => Yg(), XA = (t, e) => typeof window > "u" ? Promise.resolve() : qA().then(() => jA([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var YA = Object.defineProperty, ZA = Object.defineProperties, QA = Object.getOwnPropertyDescriptors, Da = Object.getOwnPropertySymbols, Qg = Object.prototype.hasOwnProperty, Jg = Object.prototype.propertyIsEnumerable, ch = (t, e, n) => e in t ? YA(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, xn = (t, e) => {
  for (var n in e || (e = {})) Qg.call(e, n) && ch(t, n, e[n]);
  if (Da) for (var n of Da(e)) Jg.call(e, n) && ch(t, n, e[n]);
  return t;
}, zn = (t, e) => ZA(t, QA(e)), ty = (t, e) => {
  var n = {};
  for (var r in t) Qg.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Da) for (var r of Da(t)) e.indexOf(r) < 0 && Jg.call(t, r) && (n[r] = t[r]);
  return n;
};
function ey() {
  return ac(Ms()) || window.StacksProvider || window.BlockstackProvider;
}
function gc(t) {
  return t ? typeof t == "string" ? Us.fromName(t) : "version" in t ? t : "url" in t ? new El({ url: t.url }) : t.transactionVersion === Os.Mainnet ? new El({ url: t.client.baseUrl }) : new vl({ url: t.client.baseUrl }) : new vl();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var JA = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(JA || {}), tE = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(tE || {}), of = (t) => {
  let e = t;
  if (!e) {
    let n = new b0(["store_write"], document.location.href);
    e = new Al({ appConfig: n });
  }
  return e;
};
function ny(t) {
  try {
    return of(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var ry = (t) => {
  let e = of(t).loadUserData().appPrivateKey, n = Ne.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function eE(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [Ps.Mainnet]: "mainnet", [Ps.Testnet]: "testnet" }, a = gc(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function nE(t) {
  let e = gc(t.network), n = of(t.userSession), r = zn(xn({}, t), { network: e, userSession: n });
  return xn({ stxAddress: eE(r) }, r);
}
async function rE(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Lg) : n = n.map((r) => ot(Og(r)))), new Ne.TokenSigner("ES256k", e).signAsync(zn(xn({}, t), { postConditions: n }));
}
function sE(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(Lg) : e = e.map((n) => ot(Og(n)))), Ne.createUnsecuredToken(zn(xn({}, t), { postConditions: e }));
}
var iE = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Pt(a.replace(/^0x/, "")), f = X3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, zn(xn({}, o), { stacksTransaction: f }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, zn(xn({}, o), { stacksTransaction: f }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, oE = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = ty(e, ["amount", "appDetails", "userSession"]);
  if (ny(s)) {
    let { privateKey: a, publicKey: c } = ry(s), f = zn(xn({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (f.appDetails = r), rE(f, a);
  }
  let o = zn(xn({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), sE(o);
};
async function aE(t, e, n) {
  let r = await e(zn(xn(xn({}, nE(t)), t), { network: gc(t.network) }));
  return iE({ token: r, options: t }, n);
}
function cE(t, e = ey()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return aE(t, oE, e);
}
function sy(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? zn(xn({}, t), { message: Ud(e), domain: Ud(n) }) : zn(xn({}, t), { message: ot(Fs(e)), domain: ot(Fs(n)) });
}
async function lE(t, e) {
  return new Ne.TokenSigner("ES256k", e).signAsync(sy(t));
}
async function uE(t) {
  let e = t, { userSession: n } = e, r = ty(e, ["userSession"]);
  if (ny(n)) {
    let { privateKey: s, publicKey: i } = ry(n), o = zn(xn({}, r), { publicKey: i });
    return lE(o, s);
  }
  return Ne.createUnsecuredToken(sy(t));
}
var fE = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(fE || {}), iy = "asigna-stx", lh = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === iy && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(hE(t, e), "*");
}), dE = { authenticationRequest: async (t) => lh(t, "authenticationRequest"), transactionRequest: async (t) => lh(t, "transactionRequest") }, hE = (t, e) => ({ source: iy, [e]: t }), pE = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = dE);
};
pE();
var gE = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function yE(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = Ms(), o = ey();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    XA();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : gE, c = ax(a), f = document.createElement("connect-modal");
    f.defaultProviders = a, f.installedProviders = c, f.persistSelection = e;
    let h = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      f.remove(), document.body.style.overflow = h;
    };
    f.callback = (p) => {
      l(), t(n, p);
    }, f.cancelCallback = () => {
      var p;
      l(), (p = n.onCancel) == null || p.call(n);
    }, document.body.appendChild(f);
    let y = (p) => {
      p.key === "Escape" && (document.removeEventListener("keydown", y), f.remove());
    };
    document.addEventListener("keydown", y);
  };
}
var ca = yE(cE);
function as(t, e, n) {
  return af(Ze(t, e), n);
}
function Ze(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = ae(r);
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
      const r = mE(BigInt(`0x${Lt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Lt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function uh(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Mo(t, e = 8) {
  return (typeof t == "bigint" ? t : Ze(t, !1)).toString(16).padStart(e * 2, "0");
}
function yc(t) {
  return parseInt(t, 16);
}
function af(t, e = 16) {
  const n = Mo(t, e);
  return ae(n);
}
function wE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function bE(t, e) {
  return t & BigInt(1) << e;
}
function mE(t, e) {
  return bE(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const xE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Lt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += xE[n];
  return e;
}
function ae(t) {
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
function Vi(t) {
  return new TextEncoder().encode(t);
}
function cf(t) {
  return new TextDecoder().decode(t);
}
function oy(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function SE(t) {
  return String.fromCharCode.apply(null, t);
}
function AE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function fh(t) {
  if (t.some(AE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function wc(...t) {
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
function be(t) {
  return wc(...t.map((e) => typeof e == "number" ? fh([e]) : e instanceof Array ? fh(e) : e));
}
var dh;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(dh || (dh = {}));
var hh;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(hh || (hh = {}));
var ph;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ph || (ph = {}));
const ay = 33, Wc = 32;
function EE(t) {
  if (t.length < Wc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Wc * 2), r = t.slice(2 + Wc * 2);
  return {
    recoveryId: yc(e),
    r: n,
    s: r
  };
}
function vE(t) {
  const e = typeof t == "string" ? ae(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function $E(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function IE(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function kE(t, e) {
  return t[e];
}
function LE(t, e, n = 0) {
  return t[n] = e, t;
}
function CE(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function js(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Yl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Yl || (Yl = {}));
const BE = Yl.Mainnet, TE = 128, _E = 128, cy = 16, Is = 32, Zl = 80, bc = 65, HE = 32, ME = 64, Fa = 34;
var nt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(nt || (nt = {}));
var vt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(vt || (vt = {}));
var Ql;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Ql || (Ql = {}));
var on;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(on || (on = {}));
const Sa = ["onChainOnly", "offChainOnly", "any"], gh = {
  [Sa[0]]: on.OnChainOnly,
  [Sa[1]]: on.OffChainOnly,
  [Sa[2]]: on.Any,
  [on.OnChainOnly]: on.OnChainOnly,
  [on.OffChainOnly]: on.OffChainOnly,
  [on.Any]: on.Any
};
function NE(t) {
  if (t in gh)
    return gh[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${Sa.join(", ")}`);
}
var ja;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ja || (ja = {}));
ja.Mainnet;
var Ni;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Ni || (Ni = {}));
var an;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(an || (an = {}));
var pe;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(pe || (pe = {}));
var Zt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Zt || (Zt = {}));
var za;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(za || (za = {}));
var fe;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(fe || (fe = {}));
var Ao;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ao || (Ao = {}));
var Jl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Jl || (Jl = {}));
var Eo;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Eo || (Eo = {}));
var yh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(yh || (yh = {}));
var wh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(wh || (wh = {}));
function tu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function UE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function ly(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function PE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  tu(t.outputLen), tu(t.blockLen);
}
function OE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function DE(t, e) {
  ly(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ss = {
  number: tu,
  bool: UE,
  bytes: ly,
  hash: PE,
  exists: OE,
  output: DE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const qc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Yn = (t, e) => t << 32 - e | t >>> e, FE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!FE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function jE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function lf(t) {
  if (typeof t == "string" && (t = jE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let uy = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Js(t) {
  const e = (r) => t().update(lf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function zE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
class uf extends uy {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = qc(this.buffer);
  }
  update(e) {
    Ss.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = lf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = qc(e);
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
    zE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = qc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
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
const RE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), fy = Uint8Array.from({ length: 16 }, (t, e) => e), GE = fy.map((t) => (9 * t + 5) % 16);
let ff = [fy], df = [GE];
for (let t = 0; t < 4; t++)
  for (let e of [ff, df])
    e.push(e[t].map((n) => RE[n]));
const dy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), VE = ff.map((t, e) => t.map((n) => dy[e][n])), KE = df.map((t, e) => t.map((n) => dy[e][n])), WE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), qE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), la = (t, e) => t << e | t >>> 32 - e;
function bh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ua = new Uint32Array(16);
class XE extends uf {
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
      ua[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, h = f, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const S = 4 - p, x = WE[p], L = qE[p], O = ff[p], P = df[p], g = VE[p], I = KE[p];
      for (let $ = 0; $ < 16; $++) {
        const N = la(r + bh(p, i, a, f) + ua[O[$]] + x, g[$]) + l | 0;
        r = l, l = f, f = la(a, 10) | 0, a = i, i = N;
      }
      for (let $ = 0; $ < 16; $++) {
        const N = la(s + bh(S, o, c, h) + ua[P[$]] + L, I[$]) + y | 0;
        s = y, y = h, h = la(c, 10) | 0, c = o, o = N;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + f + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    ua.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const YE = Js(() => new XE()), ZE = (t, e, n) => t & e ^ ~t & n, QE = (t, e, n) => t & e ^ t & n ^ e & n, JE = new Uint32Array([
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
]), Kr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Wr = new Uint32Array(64);
let hy = class extends uf {
  constructor() {
    super(64, 32, 8, !1), this.A = Kr[0] | 0, this.B = Kr[1] | 0, this.C = Kr[2] | 0, this.D = Kr[3] | 0, this.E = Kr[4] | 0, this.F = Kr[5] | 0, this.G = Kr[6] | 0, this.H = Kr[7] | 0;
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
      Wr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Wr[l - 15], p = Wr[l - 2], S = Yn(y, 7) ^ Yn(y, 18) ^ y >>> 3, x = Yn(p, 17) ^ Yn(p, 19) ^ p >>> 10;
      Wr[l] = x + Wr[l - 7] + S + Wr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = Yn(a, 6) ^ Yn(a, 11) ^ Yn(a, 25), p = h + y + ZE(a, c, f) + JE[l] + Wr[l] | 0, x = (Yn(r, 2) ^ Yn(r, 13) ^ Yn(r, 22)) + QE(r, s, i) | 0;
      h = f, f = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, f, h);
  }
  roundClean() {
    Wr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
};
class t8 extends hy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const hf = Js(() => new hy());
Js(() => new t8());
const fa = BigInt(2 ** 32 - 1), eu = BigInt(32);
function py(t, e = !1) {
  return e ? { h: Number(t & fa), l: Number(t >> eu & fa) } : { h: Number(t >> eu & fa) | 0, l: Number(t & fa) | 0 };
}
function e8(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = py(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const n8 = (t, e) => BigInt(t >>> 0) << eu | BigInt(e >>> 0), r8 = (t, e, n) => t >>> n, s8 = (t, e, n) => t << 32 - n | e >>> n, i8 = (t, e, n) => t >>> n | e << 32 - n, o8 = (t, e, n) => t << 32 - n | e >>> n, a8 = (t, e, n) => t << 64 - n | e >>> n - 32, c8 = (t, e, n) => t >>> n - 32 | e << 64 - n, l8 = (t, e) => e, u8 = (t, e) => t, f8 = (t, e, n) => t << n | e >>> 32 - n, d8 = (t, e, n) => e << n | t >>> 32 - n, h8 = (t, e, n) => e << n - 32 | t >>> 64 - n, p8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function g8(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const y8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), w8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, b8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), m8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, x8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), S8 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Et = {
  fromBig: py,
  split: e8,
  toBig: n8,
  shrSH: r8,
  shrSL: s8,
  rotrSH: i8,
  rotrSL: o8,
  rotrBH: a8,
  rotrBL: c8,
  rotr32H: l8,
  rotr32L: u8,
  rotlSH: f8,
  rotlSL: d8,
  rotlBH: h8,
  rotlBL: p8,
  add: g8,
  add3L: y8,
  add3H: w8,
  add4L: b8,
  add4H: m8,
  add5H: S8,
  add5L: x8
}, [A8, E8] = Et.split([
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
].map((t) => BigInt(t))), qr = new Uint32Array(80), Xr = new Uint32Array(80);
class mc extends uf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: h, Fh: l, Fl: y, Gh: p, Gl: S, Hh: x, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, f, h, l, y, p, S, x, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, h, l, y, p, S, x, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let g = 0; g < 16; g++, n += 4)
      qr[g] = e.getUint32(n), Xr[g] = e.getUint32(n += 4);
    for (let g = 16; g < 80; g++) {
      const I = qr[g - 15] | 0, $ = Xr[g - 15] | 0, N = Et.rotrSH(I, $, 1) ^ Et.rotrSH(I, $, 8) ^ Et.shrSH(I, $, 7), V = Et.rotrSL(I, $, 1) ^ Et.rotrSL(I, $, 8) ^ Et.shrSL(I, $, 7), D = qr[g - 2] | 0, j = Xr[g - 2] | 0, A = Et.rotrSH(D, j, 19) ^ Et.rotrBH(D, j, 61) ^ Et.shrSH(D, j, 6), B = Et.rotrSL(D, j, 19) ^ Et.rotrBL(D, j, 61) ^ Et.shrSL(D, j, 6), _ = Et.add4L(V, B, Xr[g - 7], Xr[g - 16]), T = Et.add4H(_, N, A, qr[g - 7], qr[g - 16]);
      qr[g] = T | 0, Xr[g] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: h, Eh: l, El: y, Fh: p, Fl: S, Gh: x, Gl: L, Hh: O, Hl: P } = this;
    for (let g = 0; g < 80; g++) {
      const I = Et.rotrSH(l, y, 14) ^ Et.rotrSH(l, y, 18) ^ Et.rotrBH(l, y, 41), $ = Et.rotrSL(l, y, 14) ^ Et.rotrSL(l, y, 18) ^ Et.rotrBL(l, y, 41), N = l & p ^ ~l & x, V = y & S ^ ~y & L, D = Et.add5L(P, $, V, E8[g], Xr[g]), j = Et.add5H(D, O, I, N, A8[g], qr[g]), A = D | 0, B = Et.rotrSH(r, s, 28) ^ Et.rotrBH(r, s, 34) ^ Et.rotrBH(r, s, 39), _ = Et.rotrSL(r, s, 28) ^ Et.rotrBL(r, s, 34) ^ Et.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, J = s & o ^ s & c ^ o & c;
      O = x | 0, P = L | 0, x = p | 0, L = S | 0, p = l | 0, S = y | 0, { h: l, l: y } = Et.add(f | 0, h | 0, j | 0, A | 0), f = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const z = Et.add3L(A, _, J);
      r = Et.add3H(z, j, B, T), s = z | 0;
    }
    ({ h: r, l: s } = Et.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Et.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: h } = Et.add(this.Dh | 0, this.Dl | 0, f | 0, h | 0), { h: l, l: y } = Et.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: S } = Et.add(this.Fh | 0, this.Fl | 0, p | 0, S | 0), { h: x, l: L } = Et.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: O, l: P } = Et.add(this.Hh | 0, this.Hl | 0, O | 0, P | 0), this.set(r, s, i, o, a, c, f, h, l, y, p, S, x, L, O, P);
  }
  roundClean() {
    qr.fill(0), Xr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class v8 extends mc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class $8 extends mc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class I8 extends mc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Js(() => new mc());
Js(() => new v8());
const k8 = Js(() => new $8());
Js(() => new I8());
function gy(t) {
  if (ae(t).byteLength != bc)
    throw Error("Invalid signature");
  return {
    type: nt.MessageSignature,
    data: t
  };
}
function ao(t, e) {
  return { type: nt.Address, version: t, hash160: e };
}
function bi(t) {
  return Ys.c32address(t.version, t.hash160);
}
function zs(t, e, n) {
  const r = e || 1, s = n || TE;
  if (_y(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: nt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function pf(t) {
  const e = Ys.c32addressDecode(t);
  return {
    type: nt.Address,
    version: e[0],
    hash160: e[1]
  };
}
var G;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(G || (G = {}));
function L8(t) {
  if (t.type === G.PrincipalStandard)
    return bi(t.address);
  if (t.type === G.PrincipalContract)
    return `${bi(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function yy(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return T8(e, n);
  } else
    return C8(t);
}
function C8(t) {
  const e = pf(t);
  return { type: G.PrincipalStandard, address: e };
}
function B8(t) {
  return { type: G.PrincipalStandard, address: t };
}
function T8(t, e) {
  const n = pf(t), r = zs(e);
  return wy(n, r);
}
function wy(t, e) {
  if (Vi(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: G.PrincipalContract, address: t, contractName: e };
}
function Xc(t, e = !1) {
  switch (t.type) {
    case G.BoolTrue:
      return !0;
    case G.BoolFalse:
      return !1;
    case G.Int:
    case G.UInt:
      return e ? t.value.toString() : t.value;
    case G.Buffer:
      return `0x${Lt(t.buffer)}`;
    case G.OptionalNone:
      return null;
    case G.OptionalSome:
      return tr(t.value);
    case G.ResponseErr:
      return tr(t.value);
    case G.ResponseOk:
      return tr(t.value);
    case G.PrincipalStandard:
    case G.PrincipalContract:
      return L8(t);
    case G.List:
      return t.list.map((r) => tr(r));
    case G.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = tr(t.data[r]);
      }), n;
    case G.StringASCII:
      return t.data;
    case G.StringUTF8:
      return t.data;
  }
}
function tr(t) {
  switch (t.type) {
    case G.ResponseErr:
      return { type: ts(t), value: Xc(t, !0), success: !1 };
    case G.ResponseOk:
      return { type: ts(t), value: Xc(t, !0), success: !0 };
    default:
      return { type: ts(t), value: Xc(t, !0) };
  }
}
function ts(t) {
  switch (t.type) {
    case G.BoolTrue:
    case G.BoolFalse:
      return "bool";
    case G.Int:
      return "int";
    case G.UInt:
      return "uint";
    case G.Buffer:
      return `(buff ${t.buffer.length})`;
    case G.OptionalNone:
      return "(optional none)";
    case G.OptionalSome:
      return `(optional ${ts(t.value)})`;
    case G.ResponseErr:
      return `(response UnknownType ${ts(t.value)})`;
    case G.ResponseOk:
      return `(response ${ts(t.value)} UnknownType)`;
    case G.PrincipalStandard:
    case G.PrincipalContract:
      return "principal";
    case G.List:
      return `(list ${t.list.length} ${t.list.length ? ts(t.list[0]) : "UnknownType"})`;
    case G.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${ts(t.data[e])})`).join(" ")})`;
    case G.StringASCII:
      return `(string-ascii ${oy(t.data).length})`;
    case G.StringUTF8:
      return `(string-utf8 ${Vi(t.data).length})`;
  }
}
const by = () => ({ type: G.BoolTrue }), my = () => ({ type: G.BoolFalse }), _8 = (t) => t ? by() : my(), mh = BigInt("0xffffffffffffffffffffffffffffffff"), H8 = BigInt(0), xh = BigInt("0x7fffffffffffffffffffffffffffffff"), Sh = BigInt("-170141183460469231731687303715884105728"), M8 = (t) => {
  const e = Ze(t, !0);
  if (e > xh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${xh}`);
  if (e < Sh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Sh}`);
  return { type: G.Int, value: e };
}, sr = (t) => {
  const e = Ze(t, !1);
  if (e < H8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > mh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${mh}`);
  return { type: G.UInt, value: e };
}, xy = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: G.Buffer, buffer: t };
};
function Sy() {
  return { type: G.OptionalNone };
}
function Ay(t) {
  return { type: G.OptionalSome, value: t };
}
function N8(t) {
  return { type: G.ResponseErr, value: t };
}
function U8(t) {
  return { type: G.ResponseOk, value: t };
}
function P8(t) {
  return { type: G.List, list: t };
}
function Rs(t) {
  for (const e in t)
    if (!I5(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: G.Tuple, data: t };
}
const Me = (t) => ({ type: G.StringASCII, data: t }), O8 = (t) => ({ type: G.StringUTF8, data: t });
class Ey extends uy {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ss.hash(e);
    const r = lf(n);
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
}
const vy = (t, e, n) => new Ey(t, e).update(n).digest();
vy.create = (t, e) => new Ey(t, e);
ge.hmacSha256Sync = (t, ...e) => {
  const n = vy.create(hf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Ui(t) {
  return {
    type: nt.PublicKey,
    data: ae(t)
  };
}
function D8(t, e, n = fe.Compressed) {
  const r = EE(e.data), s = new bn(uh(r.r), uh(r.s)), i = $t.fromSignature(t, s, r.recoveryId), o = n === fe.Compressed;
  return i.toHex(o);
}
function F8(t) {
  return { type: nt.PublicKey, data: t };
}
function Ki(t) {
  return !Lt(t.data).startsWith("04");
}
function Ra(t) {
  return t.data.slice();
}
function j8(t) {
  const e = G8(t), n = Bo(e.data.slice(0, 32), e.compressed);
  return Ui(Lt(n));
}
function z8(t) {
  const e = typeof t == "string" ? t : Lt(t), n = $t.fromHex(e).toHex(!0);
  return Ui(n);
}
function R8(t) {
  const e = typeof t == "string" ? t : Lt(t), n = $t.fromHex(e).toHex(!1);
  return Ui(n);
}
function nu(t) {
  const e = t.readUInt8(), n = e === 4 ? ME : HE;
  return F8(be([e, t.readBytes(n)]));
}
function G8(t) {
  const e = vE(t), n = e.length == ay;
  return { data: e, compressed: n };
}
function V8(t, e) {
  const [n, r] = Qa(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Mo(r, 1) + bn.fromHex(n).toCompactHex();
  return gy(i);
}
function K8(t) {
  return j8(t.data);
}
function W8(t, e, n) {
  return typeof t == "string" && (t = yy(t)), typeof n == "string" && (n = vh(n)), {
    type: nt.Payload,
    payloadType: vt.TokenTransfer,
    recipient: t,
    amount: Ze(e, !1),
    memo: n ?? vh("")
  };
}
function q8(t, e, n, r) {
  return typeof t == "string" && (t = pf(t)), typeof e == "string" && (e = zs(e)), typeof n == "string" && (n = zs(n)), {
    type: nt.Payload,
    payloadType: vt.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Ah(t, e, n) {
  return typeof t == "string" && (t = zs(t)), typeof e == "string" && (e = r5(e)), typeof n == "number" ? {
    type: nt.Payload,
    payloadType: vt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: nt.Payload,
    payloadType: vt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function X8() {
  return { type: nt.Payload, payloadType: vt.PoisonMicroblock };
}
function Eh(t, e) {
  if (t.byteLength != Is)
    throw Error(`Coinbase buffer size must be ${Is} bytes`);
  return e != null ? {
    type: nt.Payload,
    payloadType: vt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: nt.Payload,
    payloadType: vt.Coinbase,
    coinbaseBytes: t
  };
}
function Y8(t, e, n) {
  if (t.byteLength != Is)
    throw Error(`Coinbase buffer size must be ${Is} bytes`);
  if (n.byteLength != Zl)
    throw Error(`VRF proof buffer size must be ${Zl} bytes`);
  return {
    type: nt.Payload,
    payloadType: vt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === G.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var ru;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(ru || (ru = {}));
function Z8(t, e, n, r, s, i, o) {
  return {
    type: nt.Payload,
    payloadType: vt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function $y(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case vt.TokenTransfer:
      e.push(ye(t.recipient)), e.push(as(t.amount, !1, 8)), e.push(pr(t.memo));
      break;
    case vt.ContractCall:
      e.push(pr(t.contractAddress)), e.push(pr(t.contractName)), e.push(pr(t.functionName));
      const n = new Uint8Array(4);
      js(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(ye(r));
      });
      break;
    case vt.SmartContract:
      e.push(pr(t.contractName)), e.push(pr(t.codeBody));
      break;
    case vt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(pr(t.contractName)), e.push(pr(t.codeBody));
      break;
    case vt.PoisonMicroblock:
      break;
    case vt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case vt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(ye(t.recipient));
      break;
    case vt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(ye(t.recipient ? Ay(t.recipient) : Sy())), e.push(t.vrfProof);
      break;
    case vt.TenureChange:
      e.push(ae(t.tenureHash)), e.push(ae(t.previousTenureHash)), e.push(ae(t.burnViewHash)), e.push(ae(t.previousTenureEnd)), e.push(js(new Uint8Array(4), t.previousTenureBlocks)), e.push(LE(new Uint8Array(1), t.cause)), e.push(ae(t.publicKeyHash));
      break;
  }
  return be(e);
}
function Q8(t) {
  switch (t.readUInt8Enum(vt, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case vt.TokenTransfer:
      const n = Bn(t), r = Ze(t.readBytes(8), !1), s = ky(t);
      return W8(n, r, s);
    case vt.ContractCall:
      const i = Pi(t), o = Cn(t), a = Cn(t), c = [], f = t.readUInt32BE();
      for (let g = 0; g < f; g++) {
        const I = Bn(t);
        c.push(I);
      }
      return q8(i, o, a, c);
    case vt.SmartContract:
      const h = Cn(t), l = Cn(t, 4, 1e5);
      return Ah(h, l);
    case vt.VersionedSmartContract: {
      const g = t.readUInt8Enum(Ql, (N) => {
        throw new Error(`Cannot recognize ClarityVersion: ${N}`);
      }), I = Cn(t), $ = Cn(t, 4, 1e5);
      return Ah(I, $, g);
    }
    case vt.PoisonMicroblock:
      return X8();
    case vt.Coinbase: {
      const g = t.readBytes(Is);
      return Eh(g);
    }
    case vt.CoinbaseToAltRecipient: {
      const g = t.readBytes(Is), I = Bn(t);
      return Eh(g, I);
    }
    case vt.NakamotoCoinbase: {
      const g = t.readBytes(Is), I = Bn(t), $ = t.readBytes(Zl);
      return Y8(g, I, $);
    }
    case vt.TenureChange:
      const y = Lt(t.readBytes(20)), p = Lt(t.readBytes(20)), S = Lt(t.readBytes(20)), x = Lt(t.readBytes(32)), L = t.readUInt32BE(), O = t.readUInt8Enum(ru, (g) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${g}`);
      }), P = Lt(t.readBytes(20));
      return Z8(y, p, S, x, L, O, P);
  }
}
class xc extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class ys extends xc {
  constructor(e) {
    super(e);
  }
}
class wn extends xc {
  constructor(e) {
    super(e);
  }
}
class Ga extends xc {
  constructor(e) {
    super(e);
  }
}
class As extends xc {
  constructor(e) {
    super(e);
  }
}
var On;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(On || (On = {}));
function su(t) {
  return gy(Lt(t.readBytes(bc)));
}
function mi(t, e) {
  return {
    pubKeyEncoding: t,
    type: nt.TransactionAuthField,
    contents: e
  };
}
function J8(t) {
  const e = t.readUInt8Enum(On, (n) => {
    throw new wn(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case On.PublicKeyCompressed:
      return mi(fe.Compressed, nu(t));
    case On.PublicKeyUncompressed:
      return mi(fe.Uncompressed, R8(nu(t).data));
    case On.SignatureCompressed:
      return mi(fe.Compressed, su(t));
    case On.SignatureUncompressed:
      return mi(fe.Uncompressed, su(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function gf(t) {
  return ae(t.data);
}
function t5(t) {
  const e = [];
  switch (t.contents.type) {
    case nt.PublicKey:
      e.push(t.pubKeyEncoding === fe.Compressed ? On.PublicKeyCompressed : On.PublicKeyUncompressed), e.push(Ra(z8(t.contents.data)));
      break;
    case nt.MessageSignature:
      e.push(t.pubKeyEncoding === fe.Compressed ? On.SignatureCompressed : On.SignatureUncompressed), e.push(gf(t.contents));
      break;
  }
  return be(e);
}
function pr(t) {
  switch (t.type) {
    case nt.Address:
      return No(t);
    case nt.Principal:
      return Iy(t);
    case nt.LengthPrefixedString:
      return Oi(t);
    case nt.MemoString:
      return s5(t);
    case nt.AssetInfo:
      return Ly(t);
    case nt.PostCondition:
      return i5(t);
    case nt.PublicKey:
      return Ra(t);
    case nt.LengthPrefixedList:
      return bf(t);
    case nt.Payload:
      return $y(t);
    case nt.TransactionAuthField:
      return t5(t);
    case nt.MessageSignature:
      return gf(t);
  }
}
function e5() {
  return {
    type: nt.Address,
    version: za.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function yf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Zt.SerializeP2PKH || e === Zt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Zt.SerializeP2WPKH || e === Zt.SerializeP2WSH || e === Zt.SerializeP2WSHNonSequential) && !r.every(Ki))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Zt.SerializeP2PKH:
      return ao(t, A5(r[0].data));
    case Zt.SerializeP2WPKH:
      return ao(t, E5(r[0].data));
    case Zt.SerializeP2SH:
    case Zt.SerializeP2SHNonSequential:
      return ao(t, v5(n, r.map(Ra)));
    case Zt.SerializeP2WSH:
    case Zt.SerializeP2WSHNonSequential:
      return ao(t, $5(n, r.map(Ra)));
  }
}
function No(t) {
  const e = [];
  return e.push(ae(Mo(t.version, 1))), e.push(ae(t.hash160)), be(e);
}
function Pi(t) {
  const e = yc(Lt(t.readBytes(1))), n = Lt(t.readBytes(20));
  return { type: nt.Address, version: e, hash160: n };
}
function Iy(t) {
  const e = [];
  return e.push(t.prefix), e.push(No(t.address)), t.prefix === Eo.Contract && e.push(Oi(t.contractName)), be(e);
}
function n5(t) {
  const e = t.readUInt8Enum(Eo, (s) => {
    throw new wn(`Unexpected Principal payload type: ${s}`);
  }), n = Pi(t);
  if (e === Eo.Standard)
    return { type: nt.Principal, prefix: e, address: n };
  const r = Cn(t);
  return {
    type: nt.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Oi(t) {
  const e = [], n = Vi(t.content), r = n.byteLength;
  return e.push(ae(Mo(r, t.lengthPrefixBytes))), e.push(n), be(e);
}
function Cn(t, e, n) {
  e = e || 1;
  const r = yc(Lt(t.readBytes(e))), s = cf(t.readBytes(r));
  return zs(s, e, n ?? 128);
}
function r5(t) {
  return zs(t, 4, 1e5);
}
function vh(t) {
  if (t && _y(t, Fa))
    throw new Error(`Memo exceeds maximum length of ${Fa} bytes`);
  return { type: nt.MemoString, content: t };
}
function s5(t) {
  const e = [], n = Vi(t.content), r = S5(Lt(n), Fa * 2);
  return e.push(ae(r)), be(e);
}
function ky(t) {
  let e = cf(t.readBytes(Fa));
  return e = e.replace(/\u0000*$/, ""), { type: nt.MemoString, content: e };
}
function Ly(t) {
  const e = [];
  return e.push(No(t.address)), e.push(Oi(t.contractName)), e.push(Oi(t.assetName)), be(e);
}
function iu(t) {
  return {
    type: nt.AssetInfo,
    address: Pi(t),
    contractName: Cn(t),
    assetName: Cn(t)
  };
}
function wf(t, e) {
  return {
    type: nt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function bf(t) {
  const e = t.values, n = [];
  n.push(ae(Mo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(pr(r));
  return be(n);
}
function Cy(t, e, n) {
  const r = yc(Lt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case nt.Address:
        s.push(Pi(t));
        break;
      case nt.LengthPrefixedString:
        s.push(Cn(t));
        break;
      case nt.MemoString:
        s.push(ky(t));
        break;
      case nt.AssetInfo:
        s.push(iu(t));
        break;
      case nt.PostCondition:
        s.push(o5(t));
        break;
      case nt.PublicKey:
        s.push(nu(t));
        break;
      case nt.TransactionAuthField:
        s.push(J8(t));
        break;
    }
  return wf(s, n);
}
function i5(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Iy(t.principal)), (t.conditionType === an.Fungible || t.conditionType === an.NonFungible) && e.push(Ly(t.assetInfo)), t.conditionType === an.NonFungible && e.push(ye(t.assetName)), e.push(t.conditionCode), t.conditionType === an.STX || t.conditionType === an.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new ys("The post-condition amount may not be larger than 8 bytes");
    e.push(as(t.amount, !1, 8));
  }
  return be(e);
}
function o5(t) {
  const e = t.readUInt8Enum(an, (o) => {
    throw new wn(`Could not read ${o} as PostConditionType`);
  }), n = n5(t);
  let r, s, i;
  switch (e) {
    case an.STX:
      return r = t.readUInt8Enum(Ao, (a) => {
        throw new wn(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Lt(t.readBytes(8))}`), {
        type: nt.PostCondition,
        conditionType: an.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case an.Fungible:
      return s = iu(t), r = t.readUInt8Enum(Ao, (a) => {
        throw new wn(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Lt(t.readBytes(8))}`), {
        type: nt.PostCondition,
        conditionType: an.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case an.NonFungible:
      s = iu(t);
      const o = Bn(t);
      return r = t.readUInt8Enum(Jl, (a) => {
        throw new wn(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: nt.PostCondition,
        conditionType: an.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function lr(t, e) {
  return be([t, e]);
}
function a5(t) {
  return new Uint8Array([t.type]);
}
function c5(t) {
  return t.type === G.OptionalNone ? new Uint8Array([t.type]) : lr(t.type, ye(t.value));
}
function l5(t) {
  const e = new Uint8Array(4);
  return js(e, t.buffer.length, 0), lr(t.type, wc(e, t.buffer));
}
function u5(t) {
  const e = af(wE(t.value, BigInt(_E)), cy);
  return lr(t.type, e);
}
function f5(t) {
  const e = af(t.value, cy);
  return lr(t.type, e);
}
function d5(t) {
  return lr(t.type, No(t.address));
}
function h5(t) {
  return lr(t.type, wc(No(t.address), Oi(t.contractName)));
}
function p5(t) {
  return lr(t.type, ye(t.value));
}
function g5(t) {
  const e = [], n = new Uint8Array(4);
  js(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = ye(r);
    e.push(s);
  }
  return lr(t.type, be(e));
}
function y5(t) {
  const e = [], n = new Uint8Array(4);
  js(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = zs(s);
    e.push(Oi(i));
    const o = ye(t.data[s]);
    e.push(o);
  }
  return lr(t.type, be(e));
}
function By(t, e) {
  const n = [], r = e == "ascii" ? oy(t.data) : Vi(t.data), s = new Uint8Array(4);
  return js(s, r.length, 0), n.push(s), n.push(r), lr(t.type, be(n));
}
function w5(t) {
  return By(t, "ascii");
}
function b5(t) {
  return By(t, "utf8");
}
function ye(t) {
  switch (t.type) {
    case G.BoolTrue:
    case G.BoolFalse:
      return a5(t);
    case G.OptionalNone:
    case G.OptionalSome:
      return c5(t);
    case G.Buffer:
      return l5(t);
    case G.UInt:
      return f5(t);
    case G.Int:
      return u5(t);
    case G.PrincipalStandard:
      return d5(t);
    case G.PrincipalContract:
      return h5(t);
    case G.ResponseOk:
    case G.ResponseErr:
      return p5(t);
    case G.List:
      return g5(t);
    case G.Tuple:
      return y5(t);
    case G.StringASCII:
      return w5(t);
    case G.StringUTF8:
      return b5(t);
    default:
      throw new ys("Unable to serialize. Invalid Clarity Value.");
  }
}
function m5(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const $h = /* @__PURE__ */ new Map();
function Ty(t, e) {
  const n = $h.get(t);
  if (n !== void 0)
    return n(e);
  const r = m5(t);
  return $h.set(t, r), Ty(t, e);
}
class ho {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return CE(this.readBytes(4), 0);
  }
  readUInt8() {
    return kE(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return $E(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = Lt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Lt(n);
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
    if (Ty(e, r))
      return r;
    throw n(r);
  }
}
function Bn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ho(ae(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ho(t) : e = t;
  switch (e.readUInt8Enum(G, (r) => {
    throw new wn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case G.Int:
      return M8(e.readBytes(16));
    case G.UInt:
      return sr(e.readBytes(16));
    case G.Buffer:
      const r = e.readUInt32BE();
      return xy(e.readBytes(r));
    case G.BoolTrue:
      return by();
    case G.BoolFalse:
      return my();
    case G.PrincipalStandard:
      const s = Pi(e);
      return B8(s);
    case G.PrincipalContract:
      const i = Pi(e), o = Cn(e);
      return wy(i, o);
    case G.ResponseOk:
      return U8(Bn(e));
    case G.ResponseErr:
      return N8(Bn(e));
    case G.OptionalNone:
      return Sy();
    case G.OptionalSome:
      return Ay(Bn(e));
    case G.List:
      const a = e.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(Bn(e));
      return P8(c);
    case G.Tuple:
      const f = e.readUInt32BE(), h = {};
      for (let x = 0; x < f; x++) {
        const L = Cn(e).content;
        if (L === void 0)
          throw new wn('"content" is undefined');
        h[L] = Bn(e);
      }
      return Rs(h);
    case G.StringASCII:
      const l = e.readUInt32BE(), y = SE(e.readBytes(l));
      return Me(y);
    case G.StringUTF8:
      const p = e.readUInt32BE(), S = cf(e.readBytes(p));
      return O8(S);
    default:
      throw new wn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const x5 = (t) => t.length % 2 == 0 ? t : `0${t}`, S5 = (t, e) => t.padEnd(e, "0"), _y = (t, e) => t ? Vi(t).length > e : !1;
function ou(t) {
  return Zp(t);
}
const vo = (t) => YE(hf(t)), mf = (t) => Lt(k8(t)), A5 = (t) => Lt(vo(t)), E5 = (t) => {
  const e = vo(t), n = wc(new Uint8Array([0]), new Uint8Array([e.length]), e), r = vo(n);
  return Lt(r);
}, v5 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = be(n), s = vo(r);
  return Lt(s);
}, $5 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = be(n), s = hf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = be(i), a = vo(o);
  return Lt(a);
};
function I5(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Hy(t) {
  const e = ye(t);
  return `0x${Lt(e)}`;
}
function k5(t) {
  return Bn(t);
}
const Si = (t) => {
  try {
    return Ys.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function xf() {
  return {
    type: nt.MessageSignature,
    data: Lt(new Uint8Array(bc))
  };
}
function My(t, e, n, r) {
  const s = yf(0, t, 1, [Ui(e)]).hash160, i = Ki(Ui(e)) ? fe.Compressed : fe.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Ze(n, !1),
    fee: Ze(r, !1),
    keyEncoding: i,
    signature: xf()
  };
}
function $o(t) {
  return "signature" in t;
}
function Ih(t) {
  return t === Zt.SerializeP2SH || t === Zt.SerializeP2WSH;
}
function L5(t) {
  return t === Zt.SerializeP2SHNonSequential || t === Zt.SerializeP2WSHNonSequential;
}
function kh(t) {
  const e = ou(t);
  return e.nonce = 0, e.fee = 0, $o(e) ? e.signature = xf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function C5(t) {
  const e = [
    t.hashMode,
    ae(t.signer),
    as(t.nonce, !1, 8),
    as(t.fee, !1, 8),
    t.keyEncoding,
    gf(t.signature)
  ];
  return be(e);
}
function B5(t) {
  const e = [
    t.hashMode,
    ae(t.signer),
    as(t.nonce, !1, 8),
    as(t.fee, !1, 8)
  ], n = wf(t.fields);
  e.push(bf(n));
  const r = new Uint8Array(2);
  return IE(r, t.signaturesRequired, 0), e.push(r), be(e);
}
function T5(t, e) {
  const n = Lt(e.readBytes(20)), r = BigInt(`0x${Lt(e.readBytes(8))}`), s = BigInt(`0x${Lt(e.readBytes(8))}`), i = e.readUInt8Enum(fe, (a) => {
    throw new wn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Zt.SerializeP2WPKH && i != fe.Compressed)
    throw new wn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = su(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function _5(t, e) {
  const n = Lt(e.readBytes(20)), r = BigInt("0x" + Lt(e.readBytes(8))), s = BigInt("0x" + Lt(e.readBytes(8))), i = Cy(e, nt.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const f of i)
    switch (f.contents.type) {
      case nt.PublicKey:
        Ki(f.contents) || (o = !0);
        break;
      case nt.MessageSignature:
        if (f.pubKeyEncoding === fe.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new As("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Zt.SerializeP2WSH || t === Zt.SerializeP2WSHNonSequential))
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
function Yc(t) {
  return $o(t) ? C5(t) : B5(t);
}
function Zc(t) {
  const e = t.readUInt8Enum(Zt, (n) => {
    throw new wn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Zt.SerializeP2PKH || e === Zt.SerializeP2WPKH ? T5(e, t) : _5(e, t);
}
function Ny(t, e, n, r) {
  const i = t + Lt(new Uint8Array([e])) + Lt(as(n, !1, 8)) + Lt(as(r, !1, 8));
  if (ae(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return mf(ae(i));
}
function Uy(t, e, n) {
  const r = 33 + bc, s = Ki(e) ? fe.Compressed : fe.Uncompressed, i = t + x5(s.toString(16)) + n.data, o = ae(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return mf(o);
}
function H5(t, e, n, r, s) {
  const i = Ny(t, e, n, r), o = V8(s, i), a = K8(s), c = Uy(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Py(t, e, n, r, s, i) {
  const o = Ny(t, e, n, r), a = Ui(D8(o, i, s)), c = Uy(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function M5() {
  const t = My(Zt.SerializeP2PKH, "", 0, 0);
  return t.signer = e5().hash160, t.keyEncoding = fe.Compressed, t.signature = xf(), t;
}
function Lh(t, e, n) {
  return $o(t) ? N5(t, e, n) : U5(t, e, n);
}
function N5(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Py(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = yf(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new As(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function U5(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case nt.PublicKey:
        Ki(c.contents) || (i = !0), r.push(c.contents);
        break;
      case nt.MessageSignature:
        c.pubKeyEncoding === fe.Uncompressed && (i = !0);
        const { pubKey: f, nextSigHash: h } = Py(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Ih(t.hashMode) && (s = h), r.push(f), o += 1, o === 65536)
          throw new As("Too many signatures");
        break;
    }
  if (Ih(t.hashMode) && o !== t.signaturesRequired || L5(t.hashMode) && o < t.signaturesRequired)
    throw new As("Incorrect number of signatures");
  if (i && (t.hashMode === Zt.SerializeP2WSH || t.hashMode === Zt.SerializeP2WSHNonSequential))
    throw new As("Uncompressed keys are not allowed in this hash mode");
  const a = yf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new As(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Oy(t) {
  return {
    authType: pe.Standard,
    spendingCondition: t
  };
}
function Dy(t, e) {
  return {
    authType: pe.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || My(Zt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Ch(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case pe.Standard:
        return Oy(kh(t.spendingCondition));
      case pe.Sponsored:
        return Dy(kh(t.spendingCondition), M5());
      default:
        throw new Ga("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function P5(t, e) {
  switch (t.authType) {
    case pe.Standard:
      return Lh(t.spendingCondition, e, pe.Standard);
    case pe.Sponsored:
      return Lh(t.spendingCondition, e, pe.Standard);
    default:
      throw new Ga("Invalid origin auth type");
  }
}
function O5(t, e) {
  switch (t.authType) {
    case pe.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Ze(e, !1)
      };
      return { ...t, spendingCondition: n };
    case pe.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Ze(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function D5(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Ze(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function F5(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Ze(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function j5(t, e) {
  const n = {
    ...e,
    nonce: Ze(e.nonce, !1),
    fee: Ze(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function z5(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case pe.Standard:
      e.push(Yc(t.spendingCondition));
      break;
    case pe.Sponsored:
      e.push(Yc(t.spendingCondition)), e.push(Yc(t.sponsorSpendingCondition));
      break;
  }
  return be(e);
}
function R5(t) {
  const e = t.readUInt8Enum(pe, (r) => {
    throw new wn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case pe.Standard:
      return n = Zc(t), Oy(n);
    case pe.Sponsored:
      n = Zc(t);
      const r = Zc(t);
      return Dy(n, r);
  }
}
class G5 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Ze(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? BE, this.postConditionMode = i ?? Ni.Deny, this.postConditions = s ?? wf([]), o)
      this.anchorMode = NE(o);
    else
      switch (r.payloadType) {
        case vt.Coinbase:
        case vt.CoinbaseToAltRecipient:
        case vt.NakamotoCoinbase:
        case vt.PoisonMicroblock:
        case vt.TenureChange:
          this.anchorMode = on.OnChainOnly;
          break;
        case vt.ContractCall:
        case vt.SmartContract:
        case vt.VersionedSmartContract:
        case vt.TokenTransfer:
          this.anchorMode = on.Any;
          break;
      }
  }
  signBegin() {
    const e = ou(this);
    return e.auth = Ch(e.auth), e.txid();
  }
  verifyBegin() {
    const e = ou(this);
    return e.auth = Ch(e.auth), e.txid();
  }
  verifyOrigin() {
    return P5(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, pe.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === pe.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, pe.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !$o(n)) {
      const r = Ki(e);
      n.fields.push(mi(r ? fe.Compressed : fe.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = H5(n, r, e.fee, e.nonce, s);
    return $o(e) ? e.signature = i : e.fields.push(mi(s.data.byteLength === ay ? fe.Compressed : fe.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return mf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != pe.Sponsored)
      throw new Ga("Cannot sponsor sign a non-sponsored transaction");
    this.auth = j5(this.auth, e);
  }
  setFee(e) {
    this.auth = O5(this.auth, e);
  }
  setNonce(e) {
    this.auth = D5(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != pe.Sponsored)
      throw new Ga("Cannot sponsor sign a non-sponsored transaction");
    this.auth = F5(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new ys('"version" is undefined');
    if (this.chainId === void 0)
      throw new ys('"chainId" is undefined');
    if (this.auth === void 0)
      throw new ys('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new ys('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new ys('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return js(n, this.chainId, 0), e.push(n), e.push(z5(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(bf(this.postConditions)), e.push($y(this.payload)), be(e);
  }
}
function Va(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new ho(ae(t.slice(2))) : e = new ho(ae(t)) : t instanceof Uint8Array ? e = new ho(t) : e = t;
  const n = e.readUInt8Enum(ja, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = R5(e), i = e.readUInt8Enum(on, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(Ni, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = Cy(e, nt.PostCondition), c = Q8(e);
  return new G5(n, s, c, a, o, i, r);
}
const V5 = _8, po = sr, K5 = xy;
const W5 = /* @__PURE__ */ new Set([4001, -31001]), q5 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], X5 = ["result", "data", "payload", "response", "params"], Bh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Sc = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), ti = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, wr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, Y5 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Fy = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => Y5(i, r)) === s
  );
}, jy = (t) => t ? Fy(ti()).some(
  (e) => {
    var n;
    return e.id === t && (Sc(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, zy = () => {
  if (typeof window > "u")
    return;
  const t = ti(), e = Fy(t).filter(
    (n) => {
      var r;
      return Sc(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = wr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of q5) {
    const r = wr(t, n) ?? (t === window ? void 0 : wr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, Z5 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = ti(), n = wr(e, t) ?? (e === window ? void 0 : wr(window, t)) ?? ac(t);
  if (n)
    return n;
  if (Sc(t) || jy(t))
    return zy();
}, da = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, Q5 = ["blockstack-session", "blockstack"], J5 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of Q5) {
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
J5();
const Ry = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, gn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, t6 = (t) => {
  const e = gn(t);
  if (!e)
    return null;
  const n = Ry(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, e6 = (t) => {
  const e = gn(t);
  if (!e)
    return null;
  const n = Ry(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, au = (t, e = "mainnet") => {
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
      return au(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return au(r, e);
  }
  return e;
}, ks = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, Io = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return Si(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = Io(s, e + 1);
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
    const i = Io(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && Si(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Si(n.testnet) ? n.testnet.trim() : null;
}, Th = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Gy = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && W5.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Gs = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = gn(n == null ? void 0 : n.message) ?? gn(e.message) ?? gn(e.error) ?? gn(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, Di = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Gs(e);
    if (e.status === "error")
      throw Gs(e.result ?? e);
  }
  return t;
}, _h = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Di(r);
  } catch (r) {
    throw Gs(r);
  }
}, Vy = () => zy(), Sf = () => {
  if (typeof window > "u")
    return;
  const t = ti();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = wr(t, e) ?? (t === window ? void 0 : wr(window, e));
    if (n)
      return n;
  }
}, Hh = () => {
  if (typeof window > "u")
    return;
  const t = Sf();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = ti();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = wr(e, n) ?? (e === window ? void 0 : wr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Aa = (t) => {
  var r, s;
  const e = Ms();
  if (Sc(e) || jy(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = ti() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Vy();
}, Qc = (t) => {
  const e = e6(t);
  if (!e)
    return null;
  try {
    const n = Va(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Ka = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = Qc(t), r = t6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? gn(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Ka(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of Bh)
    if (Qc(s[a])) {
      i = gn(s[a]);
      break;
    }
  const o = gn(s.txId) || gn(s.txid) || gn(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? gn(s.txRaw) ?? void 0
    };
  for (const a of Bh) {
    const c = Qc(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: gn(s[a]) ?? void 0
      };
  }
  for (const a of X5) {
    const c = s[a], f = Ka(c, e + 1);
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
}, Jc = (t) => {
  const e = Ka(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, n6 = (t) => {
  const e = Ka(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, r6 = (t) => ({
  ...t,
  fee: ks(t.fee),
  nonce: ks(t.nonce),
  sponsored: t.sponsored === !0
}), Mh = (t) => ({
  recipient: t.recipient,
  amount: ks(t.amount) ?? "0",
  memo: t.memo,
  network: au(t.network),
  address: t.stxAddress,
  fee: ks(t.fee),
  nonce: ks(t.nonce),
  sponsored: t.sponsored ?? !1
}), Ky = "WALLET_ADDRESS_MISMATCH", s6 = 45e3;
let go = null;
const cu = (t) => {
  t && (go = { address: t, at: Date.now() });
}, i6 = () => {
  go = null;
}, o6 = () => go && Date.now() - go.at <= s6 ? go.address : null, a6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, c6 = async (t) => {
  i6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = Di(await t.request("wallet_connect")), n = Io(e);
  return cu(n), n;
}, l6 = async (t, e, n, r) => {
  try {
    return Di(await t.request(e, n));
  } catch (s) {
    const i = Gs(s);
    if (!a6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await c6(t);
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
        { code: o ? Ky : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return Di(await t.request(e, n));
    } catch (a) {
      throw Gs(a);
    }
  }
};
let Nh = 3e4;
const u6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${Nh / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Nh);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, f6 = async (t, e, n) => {
  const r = (c, f) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${f}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Ky }
      );
    return c;
  }, s = o6();
  if (s)
    return da(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  da(n, "account-read");
  try {
    const c = Di(
      await u6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = Io(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Gy(c))
      throw Gs(c);
    da(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return cu(i), r(i, "wallet_getAccount");
  let o;
  da(n, "account-reconnect");
  try {
    o = Di(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Gs(c);
  }
  const a = Io(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return cu(a), r(a, "wallet_connect");
}, d6 = async (t, e) => {
  if (!Aa(t)) {
    const i = await _h(
      t,
      "stx_transferStx",
      Mh(e)
    );
    return Jc(i);
  }
  const n = Sf();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await _h(
      n,
      "stx_transferStx",
      Mh(e)
    );
    return Jc(i);
  }
  const r = Vy();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await f6(r, e.stxAddress);
  const s = await l6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: ks(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: ks(e.fee) } : {}
    },
    e.stxAddress
  );
  return Jc(s);
}, h6 = () => Ms(), Wy = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Ms(), e = t ? Z5(t) : void 0;
  if (e)
    return e;
  const n = ti() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Uh = (t, e) => {
  const n = Wy(), r = r6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, n6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return ca(r, e);
  if (Aa(n) && !Sf()) {
    const s = Hh();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Ms(),
        route: "legacy-transaction-request"
      }), ca(r, s);
  }
  return void d6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (Th(s) && Aa(n)) {
      const a = Hh();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Ms(),
          route: "legacy-transaction-request"
        }), ca(r, a);
        return;
      }
    }
    if (Th(s) && !Aa(n)) {
      ca(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Gy(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Ph = (t) => Hy(t).replace(/^0x/, ""), Oh = "This wallet cannot sign messages. Try Xverse or Leather.", Dh = (t) => typeof (t == null ? void 0 : t.request) == "function", Fh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", p6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, g6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function y6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Ph(e.message),
    domain: Ph(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function w6(t, e) {
  const n = await uE({
    domain: e.domain,
    message: e.message,
    network: gc(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function jh(t) {
  var s, i;
  const e = h6() || "", n = /xverse/i.test(e);
  let r = Wy();
  if (n && !Fh(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (Fh(r))
    try {
      return await w6(r, t);
    } catch (o) {
      if (n || !Dh(r) || !g6(o)) throw o;
    }
  if (!n && Dh(r))
    try {
      return await y6(r, t);
    } catch (o) {
      throw p6(o) ? new Error(Oh) : o;
    }
  throw new Error(Oh);
}
const zh = 1000000n, Es = 1000000n, Wa = 50n, Xe = 3000n, ei = 300n, so = 3000n, b6 = 50000n, tl = 200n, Ac = 15000n, Fn = (t) => t + Wa;
function Mn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / zh}.${(n % zh).toString().padStart(6, "0")}`;
}
function Rh(t, e = ei) {
  return t <= Xe ? 0 : Number((t - Xe) / Fn(e));
}
function el(t, e = 0n) {
  const n = Es - t - e;
  return n > 0n ? n : 0n;
}
function m6(t, e = ei) {
  return t > Es ? "over" : t < Xe + Fn(e) ? "empty" : t < b6 ? "low" : "ok";
}
const x6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", S6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", A6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function E6(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || A6.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== x6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const qy = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", nl = 3, v6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [lu, Xy] = qy.split("."), In = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function uu(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function $6(t) {
  return In(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function is(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Yy(t, e = []) {
  const n = await is(`/v2/contracts/call-read/${lu}/${Xy}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: lu, arguments: e.map((r) => "0x" + In(ye(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return tr(Bn(n.result));
}
async function I6() {
  const t = await is(`/v2/contracts/source/${lu}/${Xy}?proof=0`);
  if (typeof t.source != "string" || await $6(t.source) !== S6) throw Error("Deployed source does not match the tested helper.");
  if (E6(await Yy("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Zy(t) {
  return t.startsWith("SP") && Si(t) && !t.includes(".");
}
async function k6(t) {
  var r;
  if (!Zy(t)) throw Error("Invalid mainnet wallet address.");
  const e = await is(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await is(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function L6(t) {
  const e = await is(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function C6(t, e) {
  var s, i;
  const n = await Yy("get-owner", [po(t), po(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !Zy(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function B6(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: uu(t), signal: AbortSignal.timeout(15e3) });
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
async function T6(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function _6(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Va(uu(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || bi(ao(za.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || bi(r.contractAddress) + "." + r.contractName.content !== qy || r.functionName.content !== "play" || r.functionArgs.length !== 3 || In(ye(r.functionArgs[0])) !== In(ye(po(t.core))) || In(ye(r.functionArgs[1])) !== In(ye(po(t.song))) || In(ye(r.functionArgs[2])) !== In(ye(K5(uu(t.id)))) || t.amount !== "50" || e.postConditionMode !== Ni.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== Ao.Equal || i.principal.prefix !== 2 || bi(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || bi(r.contractAddress) + "." + r.contractName.content !== v6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || In(ye(r.functionArgs[0])) !== In(ye(po(t.song))) || typeof t.liked != "boolean" || In(ye(r.functionArgs[1])) !== In(ye(V5(t.liked))) || t.amount !== "0" || e.postConditionMode !== Ni.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || tr(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function H6(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Ec(t, ...e) {
  if (!H6(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function Gh(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function M6(t, e) {
  Ec(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function fu(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function rl(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Zn(t, e) {
  return t << 32 - e | t >>> e;
}
const N6 = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", U6 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function P6(t) {
  if (Ec(t), N6)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += U6[t[n]];
  return e;
}
function O6(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function Qy(t) {
  return typeof t == "string" && (t = O6(t)), Ec(t), t;
}
class D6 {
}
function F6(t) {
  const e = (r) => t().update(Qy(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function j6(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
function z6(t, e, n) {
  return t & e ^ ~t & n;
}
function R6(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class G6 extends D6 {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = rl(this.buffer);
  }
  update(e) {
    Gh(this), e = Qy(e), Ec(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
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
    Gh(this), M6(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, fu(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    j6(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = rl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
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
const Yr = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), V6 = /* @__PURE__ */ Uint32Array.from([
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
]), Zr = /* @__PURE__ */ new Uint32Array(64);
class K6 extends G6 {
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
      Zr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Zr[l - 15], p = Zr[l - 2], S = Zn(y, 7) ^ Zn(y, 18) ^ y >>> 3, x = Zn(p, 17) ^ Zn(p, 19) ^ p >>> 10;
      Zr[l] = x + Zr[l - 7] + S + Zr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = Zn(a, 6) ^ Zn(a, 11) ^ Zn(a, 25), p = h + y + z6(a, c, f) + V6[l] + Zr[l] | 0, x = (Zn(r, 2) ^ Zn(r, 13) ^ Zn(r, 22)) + R6(r, s, i) | 0;
      h = f, f = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, f, h);
  }
  roundClean() {
    fu(Zr);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), fu(this.buffer);
  }
}
const W6 = /* @__PURE__ */ F6(() => new K6()), q6 = W6, X6 = "xtrata.xyz/radio/listening-wallet", Y6 = "Link a temporary listening wallet for pay-per-play; no spending permission", Vs = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && Si(t), Z6 = (t) => ({
  domain: Rs({ name: Me(X6), version: Me("1"), "chain-id": sr(1) }),
  message: Rs({
    purpose: Me(Y6),
    main: Me(t.main),
    listening: Me(t.listening),
    issued: sr(t.issued)
  })
}), Jy = 100000n, Q6 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function J6(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Vs(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= Jy).sort(Q6);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const ha = 50;
function qa(t) {
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
async function tv(t, e, n = 4) {
  if (!Vs(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${ha}&offset=${o}`, s = qa(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - ha);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= ha ? s : qa(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = J6(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - ha);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const fr = 50, ev = 6, nv = 20, Vh = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function Kh(t, e) {
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
async function rv(t, e, n) {
  if (!Vs(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = qa(await e(`/extended/v1/address/${t}/stx_inbound?limit=${fr}&offset=0`));
    if (!s || s.total > ev * fr) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = fr; o < s.total; o += fr) {
      const a = qa(await e(`/extended/v1/address/${t}/stx_inbound?limit=${fr}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (f) => `/extended/v1/address/${t}/transactions?limit=${fr}&offset=${f}`, a = Kh(await e(o(0)), t);
      if (!a || a.total > nv * fr) return { ok: !1 };
      const c = new Set(a.rows);
      for (const f of a.sent) i.set(f.txId, f);
      for (let f = fr; f < a.total; f += fr) {
        const h = Kh(await e(o(f)), t);
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
function sv(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(Vh).map((l, y) => {
    const p = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: p, kind: "gift", to: r.payer, at: y } : Vs(l.sender) && p >= Jy ? { sender: l.sender, left: p, kind: "deposit", to: l.sender, at: y } : { sender: l.sender, left: p, kind: "dust", to: null, at: y };
  }), i = s.reduce((l, y) => l + y.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && Vs(l.recipient) && l.amount > 0n).sort(Vh), a = o.reduce((l, y) => l + y.amount, 0n), c = i - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const f = (l, y) => {
    let p = y;
    for (const S of l) {
      if (p <= 0n) break;
      const x = S.left < p ? S.left : p;
      S.left -= x, p -= x;
    }
    return p;
  };
  for (const l of o) {
    const y = f(s.filter((p) => p.to === l.recipient), l.amount);
    y > 0n && f(s, y);
  }
  if (f(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((l, y) => l + y.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const h = /* @__PURE__ */ new Map();
  for (const l of s) {
    if (l.left <= 0n) continue;
    const y = `${l.kind}:${l.to ?? ""}`, p = h.get(y);
    p ? (p.amount += l.left, p.newest = Math.max(p.newest, l.at)) : h.set(y, { to: l.to, kind: l.kind, amount: l.left, newest: l.at });
  }
  return {
    ok: !0,
    parts: [...h.values()].sort((l, y) => l.newest - y.newest),
    hasTopUp: s.some((l) => l.kind === "deposit")
  };
}
function iv(t, e) {
  const n = t.filter((f) => f.kind === "deposit").sort((f, h) => f.newest - h.newest), r = t.find((f) => f.kind === "gift"), s = t.filter((f) => f.kind === "dust"), i = ((r == null ? void 0 : r.amount) ?? 0n) + s.reduce((f, h) => f + h.amount, 0n), o = [], a = [], c = i > e;
  return n.forEach((f, h) => {
    if (f.amount <= e) {
      a.push(f);
      return;
    }
    const l = h === n.length - 1 && !c;
    o.push({ to: f.to, kind: "deposit", mode: l ? "all" : "amount", send: f.amount - e });
  }), c ? o.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: i - e }) : (r && a.push(r), a.push(...s)), { steps: o, tooSmall: a };
}
function Wh(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const du = [50000n, 100000n, 250000n], io = ["prepared", "signed", "unknown", "pending"], ov = 30 * 6e4, fi = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, av = 3e3, qh = "Your main listener wallet is out of funds, so likes are paused. Top it up (it only needs a little) and your likes carry on.", sl = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function cv(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, f = null, h = !1, l = !1, y = !1, p = null, S = !1, x = "", L = "", O = 0, P, g = null, I, $ = [], N, V = -1 / 0;
  const D = /* @__PURE__ */ new Set();
  let j = null, A = !1, B = 0, _ = null, T = null, J = !1, z = null, Ot = !1, ft = null, te = !1, E = !1, M = !1, dt = !1, Ct = !1, It = 0, kt = null, re = Promise.resolve();
  const ce = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? ei.toString()), Kt = (m) => !!i && !(i.features ?? []).includes(m), me = (m, v) => `xtrata.ppp.v1.${m}:${v}`, zt = (m = i == null ? void 0 : i.address) => {
    if (!m) return [];
    try {
      const v = JSON.parse(t.store.get(me("entries", m)) || "[]");
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  }, Gt = (m) => {
    const v = [m, ...zt(m.address).filter((F) => !(F.txid === m.txid && F.kind === m.kind))].slice(0, 200);
    t.store.set(me("entries", m.address), JSON.stringify(v));
  }, Qe = (m = i == null ? void 0 : i.address) => !!m && t.store.get(me("on", m)) !== "0", Sn = (m) => {
    i != null && i.address && t.store.set(me("on", i.address), m ? "1" : "0");
  }, Je = () => zt().filter((m) => io.includes(m.status)), Ue = () => qt() ? [...Je(), ...zt(Wt()).filter((m) => io.includes(m.status))] : Je(), xe = () => Le(i == null ? void 0 : i.address), Le = (m) => {
    if (!m) return null;
    try {
      return JSON.parse(t.store.get(me("deposit", m)) || "null");
    } catch {
      return null;
    }
  }, Be = (m, v = i == null ? void 0 : i.address) => {
    v && t.store.set(me("deposit", v), JSON.stringify(m));
  }, Wt = () => Kt("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), qt = () => !!(i != null && i.address) && Wt() !== i.address, Se = () => qt() ? c && c.for === Wt() ? c.value : void 0 : o, Pe = (m) => m !== void 0 && m < Xe + tl, Ae = () => Je().filter((m) => t.now() - m.created > ov && D.has(m.txid)), An = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), Rt = () => An() && !(i != null && i.linked), ln = () => {
    const m = t.main();
    return !Rt() && !!m && !!(i != null && i.linked) && i.linked !== m;
  }, d = (m) => me("return-to", m), b = (m = i == null ? void 0 : i.address) => {
    if (!m) return;
    const v = t.store.get(d(m));
    return v && Vs(v) && v !== m ? v : void 0;
  }, u = (m = i == null ? void 0 : i.address) => j && j.for === m ? j.res : null;
  function k() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const m = b();
    if (m) return { to: m, kind: "chosen" };
    const v = u();
    if (v != null && v.ok && v.funder) return { to: v.funder, kind: "funder" };
  }
  const U = (m) => me("gift", m);
  function W() {
    const m = i == null ? void 0 : i.address;
    if (!m) return null;
    if ((z == null ? void 0 : z.for) === m) return z.info;
    try {
      const v = JSON.parse(t.store.get(U(m)) || "null");
      return v && typeof v.returnTo == "string" && typeof v.treasury == "string" ? v : null;
    } catch {
      return null;
    }
  }
  async function lt() {
    var Q;
    const m = i == null ? void 0 : i.address;
    if (!m || !t.giftInfo || !((Q = e == null ? void 0 : e.gifts) != null && Q.enabled) || Ot) return;
    const v = (z == null ? void 0 : z.for) === m ? z : null, F = v ? v.ok ? v.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (v && t.now() - v.at < F) return;
    Ot = !0;
    const X = W();
    try {
      const K = await t.giftInfo(m);
      z = { for: m, info: K, ok: !0, at: t.now() }, t.store.set(U(m), JSON.stringify(K));
    } catch {
      z = { for: m, info: X, ok: !1, at: t.now() };
    } finally {
      Ot = !1;
    }
  }
  const gt = () => zt().reduce((m, v) => io.includes(v.status) ? m + BigInt(v.amount || "0") + BigInt(v.fee || "0") : m, 0n);
  function Tt() {
    if (o === void 0) return 0;
    const m = o - gt() - BigInt(ne.length) * Fn(ce());
    return m > 0n ? Rh(m, ce()) : 0;
  }
  const ut = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", ee = "EMPTY — ADD STX TO PLAY";
  function _t() {
    var F;
    const m = (i == null ? void 0 : i.state) === "known" || (i == null ? void 0 : i.state) === "unlocked";
    if (!((F = W()) != null && F.player) && !m) return null;
    const v = (X, Q) => ({ reason: X, text: Q });
    switch (et()) {
      case "connect":
      case "wrong-wallet":
        return v("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "locked":
        return v("locked", "UNLOCK TO LISTEN");
      case "link":
        return v("link", "FINISH SETUP TO LISTEN");
      case "over":
        return v("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return xe() ? v("arriving", "YOUR PLAYS ARE ARRIVING") : v("out", qt() ? ut : ee);
      case "ready":
        return !Qe() || !(i != null && i.session) || i.session.playsLeft < 1 ? v("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : M ? Tt() < 1 ? v("out", qt() ? ut : ee) : null : v("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const yt = () => {
    var m;
    return !!(i != null && i.address) && qt() && !!((m = W()) != null && m.player);
  };
  function Nt() {
    return yt() ? { locked: !0, known: !0 } : null;
  }
  const Xt = 3 * 6e4, Ee = () => !!W() && !!t.history && !(i != null && i.linked);
  async function $e() {
    const m = i.address, v = W(), { balance: F, nonce: X } = await t.chain.account(m), Q = await t.history(m, !0);
    if (!Q.ok) return null;
    const K = sv({ self: m, balance: F, inbound: Q.inbound, outgoing: Q.outgoing, gift: { sender: v.treasury, payer: v.returnTo } });
    if (!K.ok) return null;
    const st = iv(K.parts, so);
    return { balance: F, nonce: X, parts: K.parts, steps: st.steps, tooSmall: st.tooSmall.length };
  }
  const rt = () => te ? { state: "unavailable" } : !ft || t.now() - ft.at > Xt || o !== void 0 && o !== ft.balance ? { state: "none" } : ft.plan;
  function et() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const m = t.main();
    if (!Rt()) {
      if (!m) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : ln() ? "wrong-wallet" : i.state === "known" ? "locked" : !Rt() && i.linked !== m ? "link" : o === void 0 ? "loading" : o > Es ? "over" : o < Xe + Fn(ce()) ? "fund" : "ready" : "loading";
  }
  const Bt = () => {
    var m, v, F, X;
    return {
      step: et(),
      busy: f,
      message: x,
      error: L,
      notice: Ie(),
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : m6(o, ce()),
      playsLeft: o === void 0 ? 0 : Rh(o, ce()),
      allowance: o === void 0 ? Es : el(o, BigInt(((m = xe()) == null ? void 0 : m.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: Qe(),
      entries: zt(),
      depositTxid: ((v = xe()) == null ? void 0 : v.txid) ?? P,
      depositPending: !!xe(),
      walletOutdated: Kt("like"),
      linkedListening: N && N === t.main() ? $.map((Q) => Q.listening) : [],
      serverLinked: !!g && I === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: Ae().length,
      armed: dt,
      queued: ne.length,
      solo: Rt(),
      returnTo: (F = k()) == null ? void 0 : F.to,
      returnToKind: (X = k()) == null ? void 0 : X.kind,
      funderState: (() => {
        const Q = u();
        return Q ? Q.ok ? Q.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const Q = u();
        return !!Q && Q.ok && Q.distinct > 1;
      })(),
      walletCannotSolo: Rt() && Kt("standalone"),
      walletCannotMulti: Kt("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((Q) => Q !== t.main() && Q !== (i == null ? void 0 : i.linked)),
      creditedTo: Rt() && (i != null && i.address) && (_ == null ? void 0 : _.for) === i.address && _.main ? _.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(me("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (T == null ? void 0 : T.for) === i.address && T.unused,
      gift: (() => {
        const Q = W();
        return Q ? { player: Q.player, from: Q.from, source: Q.source, amount: Q.amount } : null;
      })(),
      giftPlays: W() ? Tt() : 0,
      giftStop: _t(),
      albumLock: Nt(),
      returnPlan: rt(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: Kt("slots"),
      likeFunds: (() => {
        var st;
        const Q = Wt();
        if (!Q || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const K = Se();
        return { address: Q, balance: K, low: Pe(K), album: qt(), pending: !!Le(Q), txid: (st = Le(Q)) == null ? void 0 : st.txid, main: t.main() };
      })()
    };
  }, Ie = () => O ? O < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", Ht = (m, v = "") => {
    x = m, L = v, t.changed();
  };
  async function le(m, v) {
    if (!f) {
      f = m, L = "", t.changed();
      try {
        await v();
      } catch (F) {
        const X = F instanceof Error ? F.message : String(F);
        L = /Cancelled in the listening wallet/.test(X) ? "" : X, L || (x = "Not now. Nothing was signed.", Ct = !0);
      } finally {
        f = null, await Te(!0);
      }
    }
  }
  const Tn = () => !!(e != null && e.enabled) && e.here && (Rt() || !!t.main() && e.allowed), Oe = () => Tn() && !ln(), _n = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", tn = () => {
    if (ln()) throw new Error(_n());
  };
  async function En() {
    if (!Tn()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const en = (m) => {
    const v = t.main();
    return m.request("listening.status", v ? { main: v } : void 0);
  };
  async function Ar(m = !1) {
    i != null && i.address && (!m && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now(), await De(m)));
  }
  async function De(m = !1) {
    const v = Wt();
    if (!(!qt() || !v || (i == null ? void 0 : i.state) !== "unlocked") && !(!m && (c == null ? void 0 : c.for) === v && t.now() - c.at < 3e4))
      try {
        c = { for: v, value: await t.chain.balance(v), at: t.now() };
      } catch {
      }
  }
  async function ni(m) {
    if ((N !== m || t.now() - V >= 6e4) && ($ = await t.links(m), N = m, V = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === m) return;
    const v = `${m}:${i.address}`;
    I === v && g || (g = $.find((F) => F.listening === i.address) ?? null, I = v);
  }
  async function Wi() {
    const m = i == null ? void 0 : i.address;
    if (!Rt() || !m || i != null && i.linked || !t.funder || A || !o || o <= 0n) return;
    const v = u(m);
    if (v != null && v.ok && v.funder) return;
    const F = v != null && v.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, B - 1), 30 * 6e4);
    if (!(j && j.for === m && t.now() - j.at < F)) {
      A = !0;
      try {
        j = { for: m, res: await t.funder(m), at: t.now() };
      } catch {
        j = { for: m, res: { ok: !1 }, at: t.now() };
      } finally {
        A = !1;
      }
      B = j.res.ok ? 0 : B + 1;
    }
  }
  async function ri() {
    const m = i == null ? void 0 : i.address;
    if (!(!Rt() || !m || i != null && i.linked || !t.mainOf || J) && !(_ && _.for === m && (_.ok || t.now() - _.at < 6e4))) {
      J = !0;
      try {
        _ = { for: m, main: await t.mainOf(m), ok: !0, at: t.now() };
      } catch {
        _ = { for: m, main: null, ok: !1, at: t.now() };
      } finally {
        J = !1;
      }
    }
  }
  async function si() {
    const m = i == null ? void 0 : i.address;
    if (!(!m || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (T == null ? void 0 : T.for) === m) && t.store.get(me("created", m)) !== "1")
      try {
        T = { for: m, unused: await t.chain.confirmedNonce(m) === 0n };
      } catch {
      }
  }
  async function ii() {
    var Q;
    const m = i == null ? void 0 : i.address;
    if (!m) return !1;
    let v, F = !1;
    const X = /* @__PURE__ */ new Map();
    for (const K of Ue())
      try {
        const st = await t.chain.transaction(K.txid);
        if (!st) {
          if (D.add(K.txid), t.now() - K.created > 15 * 6e4 && !X.has(K.address) && X.set(K.address, await t.chain.confirmedNonce(K.address)), v = X.get(K.address), v !== void 0 && v > BigInt(K.nonce)) {
            Gt({ ...K, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((K.status === "unknown" || K.status === "signed") && K.raw)
            try {
              await t.chain.broadcast(K.raw, K.txid), Gt({ ...K, status: "pending" });
            } catch (at) {
              fi(at) && Gt({ ...K, status: "failed", note: at.message, raw: void 0 });
            }
          continue;
        }
        D.delete(K.txid);
        const ht = String(st.tx_status);
        if (ht === "success" && st.canonical !== !1 && st.is_unanchored === !1) {
          if (Gt({ ...K, status: "confirmed", confirmedAt: t.now(), actualFee: String(st.fee_rate ?? K.fee), raw: void 0 }), F = !0, K.kind === "like" && (S = !0, K.status !== "confirmed" && typeof K.liked == "boolean"))
            try {
              (Q = t.likeConfirmed) == null || Q.call(t, K.song, K.liked);
            } catch {
            }
        } else ht.startsWith("abort_") || ht.startsWith("dropped_") ? Gt({ ...K, status: "failed", note: ht, raw: void 0 }) : K.status !== "pending" && Gt({ ...K, status: "pending" });
      } catch {
      }
    for (const K of qt() ? [m, Wt()] : [m]) {
      const st = Le(K);
      if (st)
        try {
          const ht = await t.chain.transaction(st.txid), at = String((ht == null ? void 0 : ht.tx_status) ?? "");
          (at === "success" && ht.is_unanchored === !1 || at.startsWith("abort_") || at.startsWith("dropped_") || !ht && t.now() - st.at > 2 * 36e5) && (Be(null, K), a = -1 / 0, c = null, /on its way/i.test(x) && (x = ""));
        } catch {
        }
    }
    return F;
  }
  async function Te(m = !1) {
    var v;
    try {
      const F = t.main();
      if ((m || !e || r !== F || t.now() - n > 3e5) && (e = await t.config(F), n = t.now(), r = F), !e.enabled || !e.here || !Rt() && (!F || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), dt && Er(), t.changed();
        return;
      }
      await En(), i = await en(s), ln() && i.state === "unlocked" && (ci(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await en(s)), F && e.allowed && await ni(F), await Ar(m), await Wi(), await ri(), await si(), await lt(), await ii() && await Ar(!0), await De(), await de(), O = 0;
    } catch {
      O++;
    }
    if (et() === "locked" ? ai() : dt && Er(), S) {
      S = !1;
      try {
        (v = t.likesChanged) == null || v.call(t);
      } catch {
      }
    }
    t.changed(), ne.length && !Hn && Qi();
  }
  async function oi(m) {
    const v = i == null ? void 0 : i.root;
    if (!v || i != null && i.slot || !(i != null && i.address) || Kt("slots")) return;
    const F = Number(t.store.get(me("slot", v)));
    if (!(!Number.isSafeInteger(F) || F < 1))
      try {
        const { balance: X } = await t.chain.account(i.address);
        if (X >= Xe + Fn(ce())) return;
        await m.request("listening.openSlot", { slot: F }), i = await en(m), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function ls(m, v) {
    var K;
    tn();
    const F = !(i != null && i.address) || Qe(i.address), X = i != null && i.linked ? (K = t.nameOf) == null ? void 0 : K.call(t, i.linked) : void 0;
    await m.request("listening.unlock", { mode: "unlock", terms: F ? vr() : void 0, anyPasskey: v, ...t.main() ? { main: t.main() } : {}, ...X ? { label: X } : {} }), i = await en(m), F && (Qe(i.address) ? await un() : await m.request("listening.stop")), await oi(m), Ht(F ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const Q = p;
    p = null, Q && t.now() - Q.at < 12e4 && setTimeout(() => void Te(!0).then(() => Ji(Q)), 0);
  }
  function ai() {
    dt || f || Ct || It >= 3 || !s || !(i != null && i.address) || (dt = !0, re = (async () => {
      try {
        await ls(s, !1), It = 0;
      } catch (m) {
        const v = m instanceof Error ? m.message : String(m);
        /Cancelled in the listening wallet/.test(v) ? kt || (Ct = !0, Ht("Not now. Nothing was signed.")) : /did not answer/.test(v) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (It++, L = v);
      } finally {
        dt = !1;
        const m = kt;
        kt = null, m ? await m() : await Te(!0);
      }
    })());
  }
  async function Er(m) {
    dt && (kt = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await re), m && await m(), t.changed();
  }
  const vr = () => ({
    fee: ce().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Es.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function un() {
    if (!(i != null && i.address)) return !1;
    if (M || (M = await t.tabLock(i.address)), !M)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function $r(m, v) {
    const F = i.address, { balance: X, nonce: Q } = v ?? await t.chain.account(F);
    o = X;
    const K = await s.request("listening.prepareReturn", {
      mode: m.mode,
      balance: X.toString(),
      nonce: Q.toString(),
      fee: so.toString(),
      ...m.amount !== void 0 ? { amount: m.amount.toString() } : {},
      ...m.linked ? {} : { destination: m.to }
    });
    if (K.recipient !== m.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const st = m.mode === "amount" ? m.amount : m.mode === "all" ? X - so : X - Es - so, ht = Va(K.raw);
    if (tr(ht.payload.recipient).value !== m.to || String(ht.payload.amount) !== K.amount || st !== void 0 && K.amount !== st.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const at = {
      id: sl(),
      address: F,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: K.recipient,
      amount: K.amount,
      fee: K.fee,
      nonce: Q.toString(),
      created: t.now(),
      status: "signed",
      raw: K.raw,
      txid: K.txid
    };
    t.validate(at), Gt(at);
    try {
      await t.chain.broadcast(K.raw, K.txid), Gt({ ...at, status: "pending" });
    } catch (Ft) {
      throw Gt({ ...at, status: "unknown", note: Ft.message }), Ft;
    }
    return K;
  }
  const us = Ac, Ir = so;
  async function fs(m, v, F) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || !i.address) throw new Error("Unlock the listening wallet first.");
    if (Kt("slots") || Kt("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const X = i.slot ?? 0;
    if (m === v || ![m, v].includes(X) || ![m, v].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const Q = i.root ?? i.address, K = m === 0 ? Q : i.address, st = v === 0 ? Q : i.address, { balance: ht, nonce: at } = await t.chain.account(K);
    if (ht < F + Ir + Xe) throw new Error(m === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const Ft = await s.request("listening.signMove", { from: m, to: v, amount: F.toString(), fee: Ir.toString(), nonce: at.toString(), balance: ht.toString() }), _e = Va(Ft.raw);
    if (Ft.from !== K || Ft.to !== st || Ft.amount !== F.toString() || tr(_e.payload.recipient).value !== st || String(_e.payload.amount) !== F.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const vn = {
      id: sl(),
      address: K,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: st,
      amount: Ft.amount,
      fee: Ft.fee,
      nonce: at.toString(),
      created: t.now(),
      status: "signed",
      raw: Ft.raw,
      txid: Ft.txid
    };
    t.validate(vn), Gt(vn);
    try {
      await t.chain.broadcast(Ft.raw, Ft.txid), Gt({ ...vn, status: "pending" });
    } catch (Ge) {
      throw Gt({ ...vn, status: "unknown", note: Ge.message }), Ge;
    }
    return Be({ txid: Ft.txid, amount: Ft.amount, at: t.now() }, st), st === Q && Q !== i.address ? c = null : a = -1 / 0, Ft;
  }
  let R = !1;
  const Z = /* @__PURE__ */ new Map(), se = (m) => me("float", m);
  async function de() {
    if (R || (i == null ? void 0 : i.state) !== "unlocked" || !qt() || Kt("move") || Kt("rootLike") || !i.address) return;
    const m = i.address;
    if (t.store.get(se(m)) === "1") return;
    const v = W();
    if (!(v != null && v.player) || v.state !== "arrived") return;
    const F = Se();
    if (F === void 0 || o === void 0) return;
    if (!Pe(F)) {
      t.store.set(se(m), "1");
      return;
    }
    if (Le(Wt()) || Yi() || Ue().length || o < us * 4n + Xe + Ir) return;
    const X = Z.get(m);
    if (!(X && (X.n >= 3 || t.now() - X.at < 5 * 6e4))) {
      R = !0, Z.set(m, { n: ((X == null ? void 0 : X.n) ?? 0) + 1, at: t.now() });
      try {
        await fs(i.slot ?? 0, 0, us), t.store.set(se(m), "1");
      } catch (Q) {
        console.warn("[radio] likes float not sent yet", Q);
      } finally {
        R = !1;
      }
    }
  }
  async function ds(m) {
    if (Je().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Kt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const v = await $e().catch(() => null);
    if (!v)
      throw ft = null, te = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    te = !1, o = v.balance;
    const F = { balance: v.balance, nonce: v.nonce };
    if (m === "excess") {
      const ht = Wh(v.parts) ?? b();
      if (!ht) throw new Error("Choose where to send the excess first.");
      await $r({ mode: "excess", to: ht, linked: !1 }, F), ft = null, Ht("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const X = v.steps;
    if (!X.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!ft && ft.balance === v.balance && t.now() - ft.at <= Xt && ft.steps.length === X.length && ft.steps.every((ht, at) => ht.to === X[at].to && ht.mode === X[at].mode && ht.send === X[at].send))) {
      ft = {
        at: t.now(),
        balance: v.balance,
        steps: X,
        parts: v.parts,
        plan: { state: "ready", steps: X.map((ht) => ({ to: ht.to, kind: ht.kind, send: ht.send.toString() })), kept: v.tooSmall, excess: Wh(v.parts) }
      }, Ht(X.length > 1 ? `This goes back in ${X.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const K = X[0], st = K.to ?? b();
    if (!st) throw new Error("Choose where to send the rest first.");
    if (K.mode === "amount" && Kt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await $r({ mode: K.mode, to: st, linked: !1, ...K.mode === "amount" ? { amount: K.send } : {} }, F), ft = null, X.length === 1 ? (Sn(!1), Ht("Returned ✓ Paying is off.")) : Ht(`Returned ✓ ${X.length - 1} more ${X.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const Rn = {
    forceRefresh: () => Te(!0),
    create: () => le("Waiting for your passkey…", async () => {
      const m = await En();
      await m.request("listening.unlock", { mode: "create", terms: vr(), ...t.main() ? { main: t.main() } : {} }), i = await en(m), i.address && t.store.set(me("created", i.address), "1"), Sn(!0), Ht(Rt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await un();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    giftSent: (m, v) => {
      !(i != null && i.address) || xe() || (Be({ txid: m, amount: v.toString(), at: t.now() }), a = -1 / 0, z = null, Ht("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (m) => {
      if (tn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Kt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await En()).request("listening.bindSlot", { slot: m, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (m, v, F, X) => {
      Be({ txid: F, amount: X.toString(), at: t.now() }, v), z = null, await Rn.openAlbum(m), Ht("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (m) => le("Opening…", async () => {
      if (tn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Kt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (h || l || y) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === m) return;
      ci(), await s.request("listening.openSlot", { slot: m }), i = await en(s), o = void 0, a = -1 / 0, ft = null, te = !1;
      const v = i.root;
      v && m > 0 && t.store.set(me("slot", v), String(m)), Ht(m === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (m = !1) => {
      const v = () => le("Waiting for your passkey…", async () => ls(await En(), m));
      return dt ? m ? Kt("cancel") ? (Ht("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Er(async () => {
        (et() === "locked" || et() === "intro") && await v();
      }) : re : v();
    },
    link: () => le("Sign in your wallet…", async () => {
      tn();
      const m = t.main();
      if (!m || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const v = (await t.links(m)).find((F) => F.listening === i.address);
      if (v)
        await s.request("listening.link", { main: m, issued: v.issued, mainSignature: v.mainSignature });
      else {
        const F = { main: m, listening: i.address, issued: t.now() }, X = await t.signWithMain(m, Z6(F)), Q = await s.request("listening.link", { main: m, issued: F.issued, mainSignature: X });
        await t.saveLink({ ...F, mainSignature: X, listeningSignature: Q.listeningSignature }), V = -1 / 0;
      }
      Ht("Linked ✓");
    }),
    deposit: () => le("Approve the deposit in your wallet…", async () => {
      tn();
      const m = t.main();
      if (!m || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (xe()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Ar(!0);
      const v = el(o ?? 0n);
      if (v <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      P = await t.deposit(m, i.address, v), P && Be({ txid: P, amount: v.toString(), at: t.now() }), Ht("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => le("Approve the top-up in your wallet…", async () => {
      tn();
      const m = t.main(), v = Wt();
      if (!m || !v) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (Le(v)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const F = await t.chain.balance(v);
      qt() ? c = { for: v, value: F, at: t.now() } : (o = F, a = t.now());
      const X = el(F);
      if (X <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const Q = await t.deposit(m, v, X);
      Q && Be({ txid: Q, amount: X.toString(), at: t.now() }, v), Ht("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_CHOICES`. */
    topUpAlbum: (m) => le("Adding plays…", async () => {
      if (tn(), !qt()) throw new Error("Open the album you want to add plays to first.");
      if (!du.includes(m)) throw new Error("Choose one of the amounts offered.");
      if (h || l || y) throw new Error("Still sending a payment. Try again in a moment.");
      if (Ue().length || xe()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await fs(0, i.slot ?? 0, m), Ht("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => le("Confirm in the listening wallet…", async () => {
      if (!Oe()) throw new Error("Connect your wallet first.");
      await un(), await s.request("listening.approveSession", vr()), Sn(!0), Ht("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => le("Clearing…", async () => {
      for (const m of Ae())
        await t.chain.transaction(m.txid) || Gt({ ...m, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Ht("Cleared ✓");
    }),
    switchOff: () => le("Switching off…", async () => {
      ci(), await (s == null ? void 0 : s.request("listening.stop")), Sn(!1), Ht("Paying is off. Music stays free.");
    }),
    lock: () => le("Locking…", async () => {
      ci(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, Ht("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (m) => {
      const v = String(m ?? "").trim();
      if (!(i != null && i.address)) return Ht("", "Unlock the listening wallet first.");
      if (!Vs(v)) return Ht("", "Enter a standard mainnet address (it starts with SP).");
      if (v === i.address) return Ht("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(d(i.address), v), Ht("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(d(i.address), ""), t.changed();
    },
    returnFunds: (m) => le("Check the return in the listening wallet…", async () => {
      if (!Oe()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (Ee()) return ds(m);
      const v = k();
      if (!v) throw new Error(Rt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (v.kind !== "linked" && Kt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Je().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await $r({ mode: m, to: v.to, linked: v.kind === "linked" }), m === "all" && Sn(!1), Ht(m === "all" ? v.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, ne = [], qi = 10, Xi = 30 * 6e4;
  let Hn = !1;
  const Yi = () => h || !!f || l || y, ci = () => {
    ne.length && (ne.length = 0, t.changed());
  };
  async function Zi(m) {
    if (!ne.some((v) => v.id === m.id) && !zt().some((v) => v.id === m.id) && (ne.push({ ...m, at: t.now() }), ne.length > qi && ne.shift()), Yi() || Je().length) {
      const v = ne.length;
      x = `Queued ${v === 1 ? "this song" : v + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Qi();
  }
  async function Qi() {
    if (!Hn) {
      Hn = !0;
      try {
        for (; ne.length; ) {
          for (; ne.length && t.now() - ne[0].at > Xi; ) ne.shift();
          if (!ne.length || Yi() || await vc(ne[0]) === "wait") return;
          ne.shift();
        }
      } finally {
        Hn = !1, t.changed();
      }
    }
  }
  async function vc(m) {
    var v;
    h = !0;
    try {
      await Te();
      const F = et();
      if (F === "loading") return "wait";
      if (F !== "ready" || !Qe() || !(i != null && i.session) || i.session.playsLeft < 1 || !M) return "done";
      if (Je().length) return "wait";
      E || (await t.chain.verify(), E = !0);
      const X = i.address, { balance: Q, nonce: K } = await t.chain.account(X);
      o = Q, a = t.now();
      const st = await t.chain.owner(nl, m.song);
      if (st === X || st === t.main()) return "done";
      const ht = await s.request("listening.signPlay", {
        core: nl,
        song: m.song,
        receipt: m.id,
        fee: ce().toString(),
        nonce: K.toString(),
        balance: Q.toString()
      }), at = {
        id: m.id,
        address: X,
        kind: "play",
        core: nl,
        song: m.song,
        recipient: st,
        amount: "50",
        fee: ce().toString(),
        nonce: K.toString(),
        created: t.now(),
        status: "signed",
        raw: ht.raw,
        txid: ht.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...m.title ? { title: String(m.title).slice(0, 120) } : {},
        ...m.artist ? { artist: String(m.artist).slice(0, 120) } : {}
      };
      t.validate(at), Gt(at);
      const Ft = m.title ? `“${m.title}”${m.artist ? ` by ${m.artist}` : ""}` : `song #${m.song}`;
      try {
        await t.chain.broadcast(ht.raw, ht.txid), Gt({ ...at, status: "pending" }), x = `♪ Paid ${Ft}`, L = "";
      } catch (_e) {
        Gt({ ...at, status: fi(_e) ? "failed" : "unknown", note: _e.message, ...fi(_e) ? { raw: void 0 } : {} }), L = _e.message;
      }
      return i = await en(s), "done";
    } catch (F) {
      const X = F instanceof Error ? F.message : "payment unavailable";
      return (v = W()) != null && v.player ? (x = "Payment is taking a moment: " + X, "wait") : (x = "This song played free: " + X, "done");
    } finally {
      h = !1, t.changed();
    }
  }
  function $c(m) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(et()) || Kt("like") ? !1 : (Ji(m), !0);
  }
  async function Ji(m) {
    const v = m.title ? `“${m.title}”` : `song #${m.song}`, F = (Gn) => {
      var Uo;
      L = Gn, x = "";
      try {
        (Uo = t.likeFailed) == null || Uo.call(t, m.song);
      } catch {
      }
      t.changed();
    }, X = qt(), Q = et(), K = t.main(), st = X && (Q === "fund" || Q === "over") ? "ready" : Q, ht = Rt() ? Wt() : K;
    if (st === "locked") {
      p = { ...m, at: t.now() }, Ht(`Unlock to like ${v}. It sends straight after.`);
      return;
    }
    if (st === "wrong-wallet") return F(_n());
    if (st === "link") return F("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (Rt() && Kt("standalone")) return F("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (st === "fund") return F("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (st === "over") return F("Return the excess first: the listening wallet holds more than 1 STX.");
    if (X) {
      await De(!0);
      const Gn = Se();
      if (Pe(Gn))
        return t.changed(), F(qh);
    }
    if (st !== "ready" || !ht) return F("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return F("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!M) return F("Pay-per-play is running in another tab. Like from that tab.");
    const at = zt(Wt()).find((Gn) => Gn.kind === "like" && Gn.song === m.song);
    if (at && io.includes(at.status))
      return F(`Your last like for ${v} is still on its way. It can change again once it confirms.`);
    if (l) return F("One like at a time: your last one is still being sent.");
    if ((at == null ? void 0 : at.status) === "confirmed" && t.now() - (at.confirmedAt ?? 0) < av)
      return F(`Your like for ${v} has only just confirmed. Try again in a moment.`);
    let Ft;
    y = !0;
    try {
      Ft = t.likeState ? (await t.likeState(ht, m.song)).by : m.likedBy ?? [];
    } catch {
      Ft = m.likedBy;
    } finally {
      y = !1;
    }
    if (!Ft) return F(`Could not check ${v} right now. Try the heart again.`);
    const _e = Wt(), Ge = ((at == null ? void 0 : at.status) === "confirmed" && typeof at.liked == "boolean" && t.now() - (at.confirmedAt ?? at.created) < 5 * 6e4 ? at.liked : void 0) ?? Ft.includes(_e);
    if (!Ge && Ft.some((Gn) => Gn !== _e)) return F(Rt() ? `${v} was liked from another wallet of yours. Unlike it there.` : `${v} was liked from your main wallet${Ft.includes(K) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await Ic({ song: m.song, liked: !Ge, title: m.title, artist: m.artist });
  }
  async function Ic(m) {
    var X, Q, K;
    if (l) {
      Ht("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const v = m.title ? `“${m.title}”${m.artist ? ` by ${m.artist}` : ""}` : `song #${m.song}`, F = t.wait ?? ((st) => new Promise((ht) => setTimeout(ht, st)));
    try {
      Ht(`${m.liked ? "Liking" : "Unliking"} ${v}…`);
      const st = t.now() + 12e4;
      for (; h || (qt() ? zt(Wt()).some((Ge) => io.includes(Ge.status)) : Je().length); ) {
        if (t.now() > st) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await F(5e3), await Te(!0);
      }
      if (!qt() && et() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const ht = Wt(), { balance: at, nonce: Ft } = await t.chain.account(ht);
      if (qt() ? c = { for: ht, value: at, at: t.now() } : (o = at, a = t.now()), Pe(at)) throw new Error(qh);
      const _e = await s.request("listening.signLike", {
        song: m.song,
        liked: m.liked,
        fee: tl.toString(),
        nonce: Ft.toString(),
        balance: at.toString()
      }), vn = {
        id: sl(),
        address: ht,
        kind: "like",
        core: 0,
        song: m.song,
        liked: m.liked,
        recipient: "",
        amount: "0",
        fee: tl.toString(),
        nonce: Ft.toString(),
        created: t.now(),
        status: "signed",
        raw: _e.raw,
        txid: _e.txid,
        ...m.title ? { title: String(m.title).slice(0, 120) } : {},
        ...m.artist ? { artist: String(m.artist).slice(0, 120) } : {}
      };
      t.validate(vn), Gt(vn);
      try {
        await t.chain.broadcast(_e.raw, _e.txid), Gt({ ...vn, status: "pending" }), x = `${m.liked ? "♥ Liked" : "Unliked"} ${v}`, L = "";
        try {
          (X = t.likeSent) == null || X.call(t, m.song, m.liked);
        } catch {
        }
      } catch (Ge) {
        if (Gt({ ...vn, status: fi(Ge) ? "failed" : "unknown", note: Ge.message, ...fi(Ge) ? { raw: void 0 } : {} }), L = Ge.message, fi(Ge)) try {
          (Q = t.likeFailed) == null || Q.call(t, m.song);
        } catch {
        }
      }
      i = await en(s);
    } catch (st) {
      L = "Like not sent: " + (st instanceof Error ? st.message : "the listening wallet is unavailable");
      try {
        (K = t.likeFailed) == null || K.call(t, m.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), Qi();
    }
  }
  return { snapshot: Bt, refresh: Te, onListened: Zi, heart: $c, toggleLike: Ji, ...Rn };
}
const tw = ["Connect", "Passkey", "Link & fund", "Listen"], ew = ["Passkey", "Add 1 STX", "Listen"], hu = (t) => t ? ew : tw;
function lv(t) {
  if (t.solo) return uv(t);
  const e = tw.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function uv(t) {
  const e = ew.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function fv(t, e) {
  return !e || e.at >= hu(!!t.solo).length || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const dv = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function hv(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !dv(r.id)));
}
const pv = {}, gv = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, yv = (t) => {
  const e = pv;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, wv = (t) => `/hiro/${t}`, bv = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, mv = (t) => {
  const e = yv(t);
  if (e)
    return [bv(e)];
  const n = gv[t];
  return typeof window < "u" ? [`${window.location.origin}${wv(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, xv = {}, Xh = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, Sv = "xtrata.log.enabled", Av = "xtrata.log.level", Ev = "xtrata.log.tags", vv = "xtrata.log.dedupe", pa = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, $v = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, Iv = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, kv = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, Lv = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, Cv = () => {
  const t = xv ?? {}, e = pa(Sv) ?? t.VITE_LOG_ENABLED, n = pa(Av) ?? t.VITE_LOG_LEVEL, r = pa(Ev) ?? t.VITE_LOG_TAGS, s = pa(vv) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: $v(e),
    level: Iv(n) ?? "warn",
    tags: Lv(r),
    dedupe: kv(s)
  };
}, Bv = (t, e, n) => !t.enabled || Xh[n] < Xh[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), Tv = (t, e, n, r) => {
  const s = Cv();
  if (!Bv(s, e, t) || Hv(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, _v = /* @__PURE__ */ new Set();
let Yh = null;
const Hv = (t, e, n, r, s) => (Yh !== t && (_v.clear(), Yh = t), !1), Mv = (t, e, n) => Tv("debug", t, e, n), Nv = {}, Uv = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, Pv = (t) => {
  const e = Nv, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : Uv[t];
}, Ov = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, Dv = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return Ov.test(n) ? n : null;
}, Fv = (t) => t.replace(/\/+$/, ""), jv = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Zh = (t) => {
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
}, di = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, zv = (t) => {
  var c, f;
  let e;
  try {
    e = tr(k5(t));
  } catch {
    return null;
  }
  const n = di(e);
  if (!n || n.success === !1)
    return null;
  const r = di(n.value), s = di(r == null ? void 0 : r.value), i = di(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = Zh((c = di(i.name)) == null ? void 0 : c.value), a = Zh((f = di(i.namespace)) == null ? void 0 : f.value);
  return !o || !a ? null : Dv(`${o}.${a}`);
}, Rv = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${Fv(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [Hy(yy(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : zv(i.result);
}, Gv = async (t) => {
  const e = t.address.trim();
  if (!Si(e))
    return null;
  const n = Pv(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of mv(t.network))
    try {
      return await Rv({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return Mv("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: jv(r)
  }), null;
};
function Vv(t, e, n = {}) {
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
const Qh = Object.freeze({
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
}), Jh = Object.freeze({ 139: "melophonic" });
function Kv(t, e = "") {
  const n = String(t);
  return Object.hasOwn(Qh, n) ? Qh[n] : Object.hasOwn(Jh, n) ? Jh[n] : e;
}
const t0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function Wv(t, e = "") {
  return Object.hasOwn(t0, String(t)) ? t0[String(t)] : e;
}
const nw = 100000n, Af = 1000000n, Xa = 3000n, qv = (t, e) => `${t}#gift=${e}`, Xv = 100, il = (t, e = ei) => t <= Xe ? 0 : Number((t - Xe) / Fn(e)), e0 = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), rw = "xtrata.xyz/radio/gifts", ol = Xv, Yv = "Create a prefunded Xtrata radio gift batch", Zv = (t) => ({
  domain: Rs({ name: Me(rw), version: Me("1"), "chain-id": sr(1) }),
  message: Rs({
    purpose: Me(Yv),
    creator: Me(t.creator),
    count: sr(t.count),
    amount: sr(BigInt(t.amount)),
    label: Me(t.label),
    issued: sr(t.issued),
    ...t.player ? { player: Me(t.player) } : {}
  })
}), Qv = (t, e, n = ei) => Xe + BigInt(t) * Fn(n) + (e ? Ac : 0n), Jv = (t, e = ei) => Number((Af - Xe - (t ? Ac : 0n)) / Fn(e)), t$ = (t, e) => BigInt(t) * (e + Xa);
function e$(t, e, n, r = ei) {
  const s = n ? Ac : 0n, i = e > Xe + s ? e - Xe - s : 0n, o = Number(i / Fn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * Wa,
    fees: BigInt(o) * r,
    reserve: Xe,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: Xa,
    perCopy: e + Xa,
    total: t$(t, e)
  };
}
const n$ = (t) => t >= nw && t <= Af, n0 = 40, r$ = "Create an Xtrata radio gift player", s$ = /^[^\u0000-\u001f\u007f<>]+$/u;
function r0(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && s$.test(t) : !n;
}
function i$(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!r0(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!r0(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > n0) throw new Error(`A player holds 1 to ${n0} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const o$ = (t) => P6(q6(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), a$ = (t) => ({
  domain: Rs({ name: Me(rw), version: Me("1"), "chain-id": sr(1) }),
  message: Rs({
    purpose: Me(r$),
    admin: Me(t.admin),
    player: Me(t.hash),
    issued: sr(t.issued)
  })
}), ko = (t) => t.tracks.filter((e) => !e.hidden), c$ = (t) => t.tracks.find((e) => e.hidden) ?? null, l$ = [300, 500, 1e3], s0 = 1800, al = /* @__PURE__ */ new Map();
async function sw(t) {
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
async function u$(t) {
  const e = navigator;
  if (e.share)
    try {
      return await e.share(t), { label: "Shared ✓", ok: !0 };
    } catch (n) {
      if ((n == null ? void 0 : n.name) === "AbortError") return null;
    }
  return await sw(t.url) ? { label: "Link copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 };
}
function iw(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = al.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      al.set(t, { ...a, until: Date.now() + s0 });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        al.delete(t), s();
      }, s0 + 50);
    }
  }, i;
}
const vs = (t, e, n, r, s) => iw(t, e, async () => await sw(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), ps = "xtrata.radio.gift.incoming.v1", i0 = (t) => "xtrata.radio.gift.mine.v1:" + t, o0 = (t) => "xtrata.radio.gift.batches.v1:" + t, ct = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, dr = (t, e, n = "") => {
  const r = ct("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, ga = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, dn = (t) => Mn(t).replace(/\.?0+$/, "");
function f$(t) {
  let e = null;
  const n = (d) => [5e3, 1e4, 2e4, 3e4][d] ?? 6e4, r = (() => {
    try {
      const d = new URL(location.href), b = new URLSearchParams(d.hash.slice(1)).get("gift") ?? d.searchParams.get("gift");
      return b !== null && (d.searchParams.delete("gift"), history.replaceState(null, "", d.pathname + (d.search || ""))), e0(b) ? b : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const d = JSON.parse(t.store.get(ps) || "null");
      return e0(d == null ? void 0 : d.code) ? d.code : null;
    } catch {
      return null;
    }
  })(), i = r ?? s;
  if (i) {
    e = { code: i }, t.store.set(ps, JSON.stringify({ code: i, at: t.now() }));
    let d = 0;
    const b = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (u) => {
      const k = await u.json().catch(() => ({}));
      if (u.status === 404) {
        t.store.set(ps, null), e = { ...e, error: (k == null ? void 0 : k.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!u.ok) throw new Error("busy");
      const U = k;
      e = { ...e, view: U, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(U.status) && t.store.set(ps, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void b(), n(d++)));
    });
    b();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    e = null, t.store.set(ps, null), t.changed();
  }, c = (d) => d.from ? t.who(d.from) : d.label ? `Xtrata Radio · ${d.label}` : "Xtrata Radio";
  let f = {};
  const h = (d) => {
    if (f.box) return f.box;
    const b = ct("div", "", "ppp-gift-check");
    f.box = b;
    const u = () => {
      const k = window.turnstile;
      !k || f.rendered || (f.rendered = !0, k.render(b, { sitekey: d, callback: (U) => {
        f.token = U, t.changed();
      }, "expired-callback": () => {
        f.token = void 0;
      } }));
    };
    if (window.turnstile) u();
    else {
      const k = document.createElement("script");
      k.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", k.async = !0, k.onload = u, document.head.append(k);
    }
    return b;
  };
  let l;
  async function y(d) {
    var k, U, W, lt, gt;
    if (!e || e.claiming || !d.listening) return;
    const b = !!((k = e.view) != null && k.player);
    if (b && !d.root) return;
    e.claiming = !0, e.error = void 0, t.changed();
    const u = async (Tt) => {
      const ut = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: f.token, ...Tt })
      });
      return { res: ut, r: await ut.json().catch(() => ({})) };
    };
    try {
      let Tt = 0, ut = d.listening, ee;
      if (b) {
        const Nt = Number((U = await t.json("/radio/gift/slots?root=" + encodeURIComponent(d.root))) == null ? void 0 : U.next);
        if (!Number.isSafeInteger(Nt) || Nt < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Tt = Nt;
        for (let Xt = 0; ; Xt++) {
          const Ee = await t.album.bind(Tt);
          if (ut = Ee.address, ee = await u({ wallet: ut, binding: Ee }), ee.res.status === 409 && /just taken/.test(((W = ee.r) == null ? void 0 : W.error) || "") && Xt < 5) {
            Tt += 1;
            continue;
          }
          break;
        }
      } else ee = await u({ wallet: ut });
      const { res: _t, r: yt } = ee;
      if (_t.status === 503 && /sending another gift/.test((yt == null ? void 0 : yt.error) || "")) {
        e.waiting = !0, clearTimeout(l), l = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!_t.ok) {
        const Nt = String((yt == null ? void 0 : yt.error) || "");
        if (_t.status === 404 || _t.status === 410 || _t.status === 409 && /already had a gift|brand-new/.test(Nt))
          throw t.store.set(ps, null), new Error(Nt || "This gift cannot be opened.");
        if (_t.status === 429 || _t.status === 403 || _t.status === 400 && !/wallet number/i.test(Nt)) throw new Error(Nt || `Could not open the gift (${_t.status}).`);
        const Ee = /topping up/.test(Nt) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(Nt) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(Nt) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Ee), { retry: !0, slow: /topping up|not paid for yet/.test(Nt) });
      }
      e.done = !0, t.store.set(ps, null), b ? await t.album.arrived(Tt, ut, yt.txid, BigInt(yt.amount)) : t.giftSent(yt.txid, BigInt(yt.amount));
    } catch (Tt) {
      const ut = Tt, ee = ut.name === "TypeError" || ut.name === "AbortError" || ut.name === "TimeoutError" || /wallet number/i.test(ut.message);
      if (ut.retry || ee) {
        const _t = e.tries ?? 0;
        e.tries = _t + 1, e.retry = { text: ut.retry ? ut.message : "Still sending your gift… the network is slow, trying again." }, clearTimeout(l), l = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, ut.slow ? 6e4 : n(_t));
      } else e.error = ut.message;
      f.token = void 0;
      try {
        (gt = (lt = window.turnstile) == null ? void 0 : lt.reset) == null || gt.call(lt, f.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let p = null;
  function S(d) {
    if (!d.listening || !d.depositPending || d.step !== "fund")
      return p = null, [];
    if (!p || p.wallet !== d.listening || t.now() - p.at > 3e4) {
      const u = d.listening;
      p = { ...(p == null ? void 0 : p.wallet) === u ? p : {}, wallet: u, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(u)).then((k) => {
        var U, W;
        (p == null ? void 0 : p.wallet) === u && (p.state = (U = k == null ? void 0 : k.gift) == null ? void 0 : U.state, p.problem = ((W = k == null ? void 0 : k.gift) == null ? void 0 : W.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(p.state === "sending" && p.problem)) return [];
    const b = ct("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return b.title = `Network reply: ${p.problem}`, [b];
  }
  function x(d, b) {
    var gt, Tt;
    const u = b.player, k = BigInt(b.amount), U = [ct("p", `🎁 ${c(b)} sent you “${u.title}”${u.subtitle ? ` by ${u.subtitle}` : ""}: ${ko(u).length} ${ko(u).length === 1 ? "song" : "songs"} and ${il(k).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!d.root && ["fund", "ready", "over", "link"].includes(d.step)))
      return U.push(ct("p", d.step === "intro" ? "Tap below: your passkey makes a listening wallet, and the album arrives in its own wallet. You can keep as many albums as you like." : d.step === "locked" ? "Unlock your listening wallet and the album arrives in its own wallet." : "Open your listening wallet and the album arrives in its own wallet.", "ppp-mute")), U;
    if (d.walletCannotAlbums)
      return U.push(ct("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), U;
    const lt = (Tt = (gt = d.gate) == null ? void 0 : gt.gifts) == null ? void 0 : Tt.turnstileSiteKey;
    return lt && !f.token ? U.push(ct("p", "One quick check and it is yours:", "ppp-mute"), h(lt)) : !e.claiming && !e.error && !e.waiting && !e.retry && y(d), U.push(...L(d, "Sending your album…")), U;
  }
  function L(d, b) {
    const u = [];
    return e.claiming || e.waiting ? u.push(ct("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : b, "ppp-cyan")) : e.retry && u.push(ct("p", e.retry.text, "ppp-warn"), dr("Try now", () => {
      clearTimeout(l), e.retry = void 0, y(d);
    }, "quiet")), e.error && u.push(ct("p", e.error, "ppp-bad"), dr("Try again", () => {
      e.error = void 0, y(d);
    })), u;
  }
  const O = (d) => {
    var b;
    return !!e && !e.done && !e.error && o() && !!d.listening && !d.linked && !d.creditedTo && (d.createdHere || d.brandNew || !!((b = e.view) != null && b.player)) && (d.balance ?? 0n) === 0n && !d.entries.length;
  };
  function P(d) {
    var ee, _t;
    const b = S(d);
    if (!e || ["off", "elsewhere"].includes(d.step)) return b;
    const u = e.view;
    if (e.error && !u) return [ct("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!u) return [ct("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return b;
    if (u.status === "claimed" || u.status === "claiming") return [ct("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(u.status)) return [ct("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (u.status === "pending-deposit") return [ct("p", `🎁 ${c(u)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (u.player) return [...x(d, u), ...b];
    if (!!d.listening && (!(d.createdHere || d.brandNew) || !!d.linked || !!d.creditedTo || (d.balance ?? 0n) > 0n || d.entries.length > 0))
      return [ct("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), dr("Forget this gift link here", a, "quiet")];
    const U = BigInt(u.amount), W = il(U).toLocaleString(), gt = [ct(
      "p",
      `🎁 ${c(u)} sent you ${dn(U)} STX of on-chain music: about ${W} paid plays.`,
      "ppp-gift"
    )], Tt = !!d.listening && (d.createdHere || d.brandNew) && !d.linked && !d.creditedTo && d.step === "fund" && (d.balance ?? 1n) === 0n && !d.depositPending && !d.entries.length, ut = (_t = (ee = d.gate) == null ? void 0 : ee.gifts) == null ? void 0 : _t.turnstileSiteKey;
    return Tt ? (ut && !f.token ? gt.push(ct("p", "One quick check and it is yours:", "ppp-mute"), h(ut)) : !e.claiming && !e.error && !e.waiting && !e.retry && y(d), gt.push(...L(d, "Sending your gift…"))) : d.step === "intro" ? gt.push(ct("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : d.listening && d.linked ? gt.push(ct("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), dr("Forget this gift link here", a, "quiet")) : d.listening && (d.balance ?? 0n) > 0n && gt.push(ct("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), dr("Forget this gift link here", a, "quiet")), gt;
  }
  async function g(d, b, u) {
    var k;
    try {
      const U = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(d));
      if ((k = U == null ? void 0 : U.gift) != null && k.returnTo) return { ok: !0, funder: U.gift.returnTo, txId: U.gift.txid ?? void 0, amount: U.gift.amount, distinct: 1 };
    } catch {
      if (u) return { ok: !1 };
    }
    return b();
  }
  const I = ct("div", "", "ppp-gift-fold");
  let $ = 250000n, N = "", V = "";
  const D = (d) => {
    try {
      const b = JSON.parse(t.store.get(i0(d)) || "[]");
      return Array.isArray(b) ? b : [];
    } catch {
      return [];
    }
  }, j = (d, b) => t.store.set(i0(d), JSON.stringify(b.slice(0, 50)));
  let A = 0;
  async function B(d) {
    const b = D(d);
    for (const u of b)
      if (!(u.view && ["claimed", "refunded", "expired"].includes(u.view.status)))
        try {
          u.view = !u.view || u.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: u.id, ...u.txid ? { txid: u.txid } : {} }) }) : await t.json("/radio/gift?id=" + u.id), u.error = void 0;
        } catch (k) {
          u.error = k.message;
        }
    j(d, b), t.changed();
  }
  async function _(d) {
    if (N) return;
    N = "Starting your gift…", V = "", t.changed();
    let b = null;
    try {
      b = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: d, amount: $.toString() }) });
      const u = D(d);
      u.unshift({ id: b.id, code: b.code, amount: $.toString(), at: t.now() }), j(d, u), N = "Approve the gift in your wallet…", t.changed();
      const k = await t.pay(d, b.depositTo, BigInt(b.deposit), b.memo), U = D(d), W = U.find((lt) => lt.id === b.id);
      W && (W.txid = k, W.view = { status: "pending-deposit", amount: $.toString(), source: "friend", from: d, label: "", expires: 0 }), j(d, U), V = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", B(d);
    } catch (u) {
      V = u.message || "Not sent.";
    } finally {
      N = "", t.changed();
    }
  }
  const T = (d) => "xtrata.radio.gift.players.v1:" + d, J = (d) => {
    try {
      const b = JSON.parse(t.store.get(T(d)) || "[]");
      return Array.isArray(b) ? b.filter((u) => u && /^[0-9a-f]{16}$/.test(u.id)) : [];
    } catch {
      return [];
    }
  };
  async function z(d, b) {
    var u;
    if (!N) {
      N = "Checking the player…", V = "", t.changed();
      try {
        const k = b.tracks.split(/[\s,]+/).filter(Boolean).map((ut) => Number(ut.replace(/^#/, ""))), U = i$({ title: b.title.trim(), subtitle: b.subtitle.trim(), tracks: k, cover: (u = b.cover) != null && u.trim() ? Number(b.cover.trim().replace(/^#/, "")) : null });
        N = "Sign in your wallet…", t.changed();
        const W = { admin: d, hash: o$(U), issued: t.now() }, lt = await t.sign(d, a$(W));
        N = "Making the player…", t.changed();
        const gt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: U, request: W, signature: lt }) }), Tt = J(d).filter((ut) => ut.id !== gt.id);
        Tt.unshift({ id: gt.id, title: gt.title, tracks: gt.tracks }), t.store.set(T(d), JSON.stringify(Tt.slice(0, 30))), V = `${gt.existing ? "That player already exists" : "Player made"} ✓ “${gt.title}” · ${gt.tracks} songs. Pick it below for a batch.`;
      } catch (k) {
        V = k.message || "Not made.";
      } finally {
        N = "", t.changed();
      }
    }
  }
  const Ot = (d, b) => qv(d || location.origin + "/radio.html", b), ft = (d) => u$({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: d }), te = (d) => {
    try {
      const b = JSON.parse(t.store.get(o0(d)) || "[]");
      return Array.isArray(b) ? b.filter((u) => u && /^[0-9a-f]{16}$/.test(u.id) && Array.isArray(u.codes)) : [];
    } catch {
      return [];
    }
  }, E = (d, b) => t.store.set(o0(d), JSON.stringify(b.slice(0, 20))), M = (d) => !!d.view && d.view.status === "live" && d.view.copies.waiting + d.view.copies.claiming + d.view.copies.refunding === 0, dt = (d, b) => t.json(d, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b) });
  let Ct = 0;
  async function It(d) {
    const b = te(d);
    for (const u of b)
      if (!M(u))
        try {
          u.view = !u.view || u.view.status === "pending-deposit" ? await dt("/radio/gift/batch/confirm", { id: u.id, ...u.txid ? { txid: u.txid } : {} }) : await t.json("/radio/gift/batch?id=" + u.id), u.error = void 0;
        } catch (k) {
          u.error = k.message;
        }
    try {
      const u = await t.json("/radio/gift/batches?creator=" + encodeURIComponent(d));
      for (const k of (u == null ? void 0 : u.batches) ?? []) {
        const U = b.find((W) => W.id === k.id);
        if (U) {
          U.error || (U.view = k);
          continue;
        }
        b.push({ id: k.id, codes: [], count: k.count, amount: k.amount, label: k.label, player: k.player, depositTo: "", deposit: k.deposit, memo: k.memo, at: 0, view: k });
      }
    } catch {
    }
    E(d, b), t.changed();
  }
  async function kt(d, b) {
    const u = te(d).find((k) => k.id === b);
    if (!(!u || !u.depositTo || N)) {
      N = "Approve the payment in your wallet…", V = "", t.changed();
      try {
        const k = await t.pay(d, u.depositTo, BigInt(u.deposit), u.memo), U = te(d), W = U.find((lt) => lt.id === b);
        W && (W.txid = k), E(d, U), V = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", N = "", It(d);
      } catch (k) {
        V = `${/cancel/i.test(k.message) ? "Payment cancelled." : k.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        N = "", t.changed();
      }
    }
  }
  async function re(d, b, u, k) {
    if (N) return;
    if (!b.ok) {
      V = b.reason, t.changed();
      return;
    }
    N = "Sign in your wallet…", V = "", t.changed();
    let U = null;
    try {
      const W = { creator: d, count: b.count, amount: b.amount.toString(), label: u, issued: t.now(), ...k ? { player: k } : {} }, lt = await t.sign(d, Zv(W));
      N = "Making your links…", t.changed(), U = await dt("/radio/gift/batch", { request: W, signature: lt });
      const gt = te(d);
      gt.unshift({ id: U.id, codes: U.codes, count: b.count, amount: U.amount, label: u, player: k ?? null, depositTo: U.depositTo, deposit: U.deposit, memo: U.memo, at: t.now() }), E(d, gt);
    } catch (W) {
      V = W.message || "Not made.", N = "", t.changed();
      return;
    }
    N = "", t.changed(), await kt(d, U.id);
  }
  function ce() {
    const d = !!Wt.value, b = qt.value === "max" ? Jv(d) : Number(qt.value), u = Qv(b, d), k = Number(Se.value);
    return !Number.isInteger(k) || k < 1 || k > ol ? { ok: !1, reason: `Make 1 to ${ol} copies at a time.`, album: d, plays: b, amount: u, count: k } : n$(u) ? { ok: !0, reason: "", album: d, plays: b, amount: u, count: k, bill: e$(k, u, d) } : { ok: !1, reason: "Each copy must be 0.1 to 1 STX.", album: d, plays: b, amount: u, count: k };
  }
  const Kt = () => {
    const d = ce();
    if (!d.ok) return d.reason;
    const b = d.bill;
    return `Each copy: ${d.plays.toLocaleString()} paid plays (${dn(b.holders)} to song holders, ${dn(b.fees)} network fees)${d.album ? `, ${dn(b.float)} for the album’s likes` : ""}, ${dn(b.reserve)} kept so a listener can return what is left, + ${dn(b.sendFee)} to send it = ${dn(b.perCopy)} STX. ${d.count} copies = ${dn(b.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, me = (d, b) => b.codes.map((u) => Ot(d, u)), zt = ct("input");
  zt.type = "range", zt.min = String(nw), zt.max = String(Af), zt.step = "50000", zt.value = String($), zt.setAttribute("aria-label", "Gift amount");
  const Gt = ct("p", "", "ppp-gift-amount"), Qe = dr("", () => {
    const d = t.main();
    d && _(d);
  }, "primary"), Sn = () => {
    Gt.textContent = Je(), Qe.textContent = `Gift ${dn($)} STX`;
  };
  zt.oninput = () => {
    $ = BigInt(zt.value), Sn();
  };
  const Je = () => `${dn($)} STX · about ${il($).toLocaleString()} paid plays · you pay ${dn($ + Xa)} STX with the network fee`;
  Sn();
  const Ue = ct("input");
  Ue.maxLength = 60, Ue.placeholder = "Title, e.g. Proof of Sound", Ue.setAttribute("aria-label", "Player title");
  const xe = ct("input");
  xe.maxLength = 80, xe.placeholder = "Artist (optional)", xe.setAttribute("aria-label", "Player subtitle");
  const Le = ct("textarea");
  Le.rows = 3, Le.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Le.setAttribute("aria-label", "Songs");
  const Be = ct("input");
  Be.inputMode = "numeric", Be.placeholder = "Cover inscription number (optional), shown when the album loads", Be.setAttribute("aria-label", "Cover inscription");
  const Wt = ct("select");
  Wt.setAttribute("aria-label", "Batch album");
  const qt = ct("select");
  qt.setAttribute("aria-label", "Plays per copy");
  for (const d of l$) qt.append(ga(`${d.toLocaleString()} plays`, String(d)));
  qt.append(ga("Max (1 STX)", "max"));
  const Se = ct("input");
  Se.type = "number", Se.min = "1", Se.max = String(ol), Se.value = "10", Se.setAttribute("aria-label", "Copies");
  const Pe = ct("input");
  Pe.maxLength = 40, Pe.placeholder = "Label, e.g. Opera launch", Pe.setAttribute("aria-label", "Batch label");
  const Ae = ct("p", "", "ppp-mute"), An = () => {
    Ae.textContent = Kt();
  };
  for (const d of [Wt, qt, Se])
    d.oninput = An, d.onchange = An;
  An();
  function Rt(d) {
    var U, W, lt, gt, Tt, ut;
    const b = (U = d.gate) == null ? void 0 : U.gifts;
    if (!(b != null && b.enabled) || ["off", "elsewhere", "unsupported"].includes(d.step)) return null;
    const u = t.main(), k = [ct("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!u)
      k.push(ct("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      Qe.disabled = !!N, k.push(zt, Gt, Qe), t.now() - A > 3e4 && (A = t.now(), B(u));
      const ee = D(u);
      if (ee.length) {
        const _t = ct("ul", "", "ppp-gift-list");
        for (const yt of ee.slice(0, 10)) {
          const Nt = (W = yt.view) == null ? void 0 : W.status, Xt = yt.error ? yt.error : !Nt || Nt === "pending-deposit" ? yt.txid ? "payment confirming…" : "waiting for your payment" : Nt === "live" ? "ready to share" : Nt === "claiming" || Nt === "claimed" ? "claimed ✓" : Nt === "refunding" ? "expired · refund on its way" : Nt === "refunded" ? "expired · refunded to you" : Nt, Ee = ct("li");
          if (Ee.append(ct("span", `${dn(BigInt(yt.amount))} STX`, "t"), ct("span", Xt, ((lt = yt.view) == null ? void 0 : lt.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((gt = yt.view) == null ? void 0 : gt.status) === "live") {
            const $e = Ot(((Tt = d.gate) == null ? void 0 : Tt.radioUrl) ?? null, yt.code);
            Ee.append(vs("gift-copy:" + yt.id, "Copy link", () => $e, "tiny", t.changed), iw("gift-share:" + yt.id, "Share", () => ft($e), "tiny", t.changed));
          }
          _t.append(Ee);
        }
        k.push(_t);
      }
      if (b.admin) {
        const _t = ct("div", "", "ppp-gift-admin"), yt = (rt, et) => {
          const Bt = ct("label", rt);
          return Bt.append(et), Bt;
        }, Nt = J(u);
        _t.append(
          ct("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
          Ue,
          xe,
          Le,
          Be,
          dr("Sign and make player", () => void z(u, { title: Ue.value, subtitle: xe.value, tracks: Le.value, cover: Be.value }))
        );
        const Xt = dr("Sign, pay and make links", () => {
          re(u, ce(), Pe.value.trim(), Wt.value || void 0);
        });
        Xt.disabled = !!N;
        const Ee = Wt.value;
        Wt.replaceChildren(ga("No album (starter copies)", ""), ...Nt.map((rt) => ga(`${rt.title} · ${rt.tracks} songs`, rt.id))), Nt.some((rt) => rt.id === Ee) && (Wt.value = Ee), An(), _t.append(
          ct("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
          yt("Album ", Wt),
          yt("Plays each ", qt),
          yt("Copies ", Se),
          Pe,
          Ae,
          Xt
        ), t.now() - Ct > 3e4 && (Ct = t.now(), It(u));
        const $e = te(u);
        if ($e.length) {
          const rt = ct("ul", "", "ppp-gift-list");
          for (const et of $e.slice(0, 10)) {
            const Bt = et.view, Ie = Bt == null ? void 0 : Bt.copies, Ht = et.error ? et.error : !Bt || Bt.status === "pending-deposit" ? et.txid ? "payment confirming…" : "waiting for your payment" : `${Ie.claimed} of ${Bt.count} claimed${Ie.refunding + Ie.refunded ? ` · ${Ie.refunded} refunded${Ie.refunding ? `, ${Ie.refunding} on their way` : ""}` : ""}`, le = ct("li");
            if (le.append(ct("span", `${et.label || "Batch"} · ${et.count} × ${dn(BigInt(et.amount))} STX`, "t"), ct("span", Ht, "ppp-mute")), !et.txid && et.depositTo && (!Bt || Bt.status === "pending-deposit") && le.append(dr("Pay now", () => void kt(u, et.id), "tiny")), et.codes.length && (Bt == null ? void 0 : Bt.status) === "live") {
              const Tn = me(((ut = d.gate) == null ? void 0 : ut.radioUrl) ?? null, et);
              le.append(
                vs("batch-copy:" + et.id, "Copy all links", () => Tn.join(`
`), "tiny", t.changed),
                vs("batch-csv:" + et.id, "Copy as CSV", () => ["copy,link", ...Tn.map((Oe, _n) => `${_n + 1},${Oe}`)].join(`
`), "tiny", t.changed)
              );
            } else et.codes.length || le.append(ct("span", "links were made on another device", "ppp-mute"));
            rt.append(le);
          }
          _t.append(rt);
        }
        k.push(_t);
      }
    }
    return N && k.push(ct("p", N, "ppp-cyan")), V && k.push(ct("p", V, /✓/.test(V) ? "ppp-ok" : "ppp-warn")), I.replaceChildren(...k), I;
  }
  return { banner: P, funder: g, renderFold: Rt, liveGift: o, setAside: a, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: O };
}
const d$ = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function h$(t) {
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
const p$ = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function g$(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((i) => (!e.pinnedOnly || e.pins.has(i.slot)) && (() => {
    const o = p$(i);
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
function y$(t, e = 100) {
  const n = Object.entries(t).sort((r, s) => s[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const hi = 12, w$ = 5e3, sn = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, pi = (t, e, n = "") => {
  const r = sn("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function b$(t) {
  let e, n = [], r = 0, s = !1, i = !1, o = -1 / 0, a = "", c = "recent", f = !1, h = hi;
  const l = sn("div", "", "ppp-shelf-box"), y = (_) => "xtrata.radio.shelf.pins.v1:" + _, p = (_) => "xtrata.radio.shelf.recent.v1:" + _, S = (_, T) => {
    try {
      return JSON.parse(t.store.get(_) || "null") ?? T;
    } catch {
      return T;
    }
  }, x = (_) => new Set(S(y(_), []).filter((T) => Number.isSafeInteger(T))), L = (_) => {
    const T = S(p(_), {}), J = {};
    for (const [z, Ot] of Object.entries(T)) Number.isSafeInteger(Number(z)) && typeof Ot == "number" && (J[Number(z)] = Ot);
    return J;
  };
  async function O(_) {
    if (!s) {
      s = !0, i = !1;
      try {
        const T = [];
        let J = 0, z = 0;
        for (let Ot = 0; Ot < w$ / 100 + 1; Ot++) {
          const ft = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(_)}&after=${J}&limit=100`);
          if (T.push(...h$(ft == null ? void 0 : ft.shelf)), z = Number(ft == null ? void 0 : ft.total) || T.length, !(ft != null && ft.next) || !Number.isSafeInteger(ft.next)) break;
          J = ft.next;
        }
        _ === e && (n = T, r = z, o = t.now());
      } catch {
        i = !0;
      } finally {
        s = !1, t.changed();
      }
    }
  }
  const P = () => {
    o = -1 / 0;
  }, g = sn("input");
  g.type = "search", g.placeholder = "Search title, artist or #", g.setAttribute("aria-label", "Search your albums"), g.oninput = () => {
    a = g.value, h = hi, t.changed();
  };
  const I = sn("select");
  I.setAttribute("aria-label", "Sort albums");
  for (const _ of d$) {
    const T = document.createElement("option");
    T.value = _.value, T.textContent = _.label, I.append(T);
  }
  I.onchange = () => {
    c = I.value, h = hi, t.changed();
  };
  const $ = pi("", () => {
    f = !f, h = hi, t.changed();
  }, "tiny"), N = sn("div", "", "ppp-shelf-tools");
  N.append(g, I, $);
  const V = sn("div"), D = sn("div");
  function j(_) {
    const T = _.step === "off" || _.step === "elsewhere" ? void 0 : _.root;
    if (T !== e && (e = T, n = [], r = 0, o = -1 / 0, h = hi), !T || _.walletCannotAlbums) return null;
    if (!s && t.now() - o > 5 * 6e4 && O(T), !n.length)
      return i ? (D.replaceChildren(sn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), pi("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(D), l) : null;
    const J = x(T), z = L(T), Ot = g$(n, { query: a, sort: c, pinnedOnly: f, pins: J, recents: z });
    g.value !== a && (g.value = a), I.value = c, $.textContent = f ? "★ Pinned only" : "☆ Pinned only", $.setAttribute("aria-pressed", String(f));
    const ft = [];
    if (_.slot > 0 && ft.push(pi("← My player", () => t.open(0), "quiet")), !Ot.length) ft.push(sn("p", "No album matches that.", "ppp-mute"));
    else {
      const te = sn("ul", "", "ppp-shelf-list");
      for (const E of Ot.slice(0, h)) {
        const M = sn("li", "", E.slot === _.slot ? "now" : ""), dt = J.has(E.slot), Ct = pi(dt ? "★" : "☆", () => {
          const ce = new Set(J);
          dt ? ce.delete(E.slot) : ce.add(E.slot), t.store.set(y(T), JSON.stringify([...ce])), t.changed();
        }, "tiny");
        Ct.setAttribute("aria-label", dt ? `Unpin ${E.player.title}` : `Pin ${E.player.title}`);
        const It = [E.player.subtitle, `${ko(E.player).length} ${ko(E.player).length === 1 ? "song" : "songs"}`, E.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), kt = E.slot === _.slot, re = pi(kt ? "Playing" : "Play", () => {
          t.store.set(p(T), JSON.stringify(y$({ ...z, [E.slot]: t.now() }))), t.open(E.slot);
        }, kt ? "tiny" : "tiny primary");
        re.disabled = kt, M.append(Ct, sn("span", E.player.title, "t"), sn("span", " " + It, "ppp-mute"), re), te.append(M);
      }
      ft.push(te), Ot.length > h && ft.push(pi(`Show more (${Ot.length - h} left)`, () => {
        h += hi, t.changed();
      }, "quiet"));
    }
    return i && ft.push(sn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), V.replaceChildren(...ft), l.firstChild !== N && l.replaceChildren(N, V), l;
  }
  return { render: j, invalidate: P, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const _ = L(e), T = [...n].filter((J) => J.player).sort((J, z) => (_[z.slot] ?? 0) - (_[J.slot] ?? 0) || z.slot - J.slot)[0];
    return T ? { slot: T.slot, title: T.player.title } : null;
  } };
}
const m$ = [
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
function x$(t) {
  for (const [e, n] of m$) if (n.test(t)) return e;
  return null;
}
const ow = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), aw = (t) => /Android/.test(t);
function S$(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : ow(e) ? "x-safari-" + n.href : aw(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const A$ = (t) => ow(t) ? "Safari" : aw(t) ? "Chrome" : "your browser", a0 = document.getElementById("ppp");
a0 && E$(a0);
function E$(t) {
  var ln;
  const e = jw(), n = (d) => t.querySelector(d), r = n(".ppp-frame");
  let s = null;
  const i = async (d, b) => {
    const u = await fetch(d, { cache: "no-store", ...b, signal: AbortSignal.timeout(15e3) }), k = await u.json().catch(() => ({}));
    if (!u.ok) throw new Error((k == null ? void 0 : k.error) || `Request failed (${u.status}).`);
    return k;
  }, o = cv({
    now: Date.now,
    main: () => {
      const d = e.load();
      return d.isConnected && d.network === "mainnet" ? d.address : void 0;
    },
    config: (d) => i("/radio/listening-wallet/config?main=" + encodeURIComponent(d || "")),
    links: async (d) => (await i("/radio/listening-wallet/link?main=" + encodeURIComponent(d))).links ?? [],
    mainOf: async (d) => {
      var u;
      const b = (await i("/radio/listening-wallet/link?listening=" + encodeURIComponent(d))).links;
      return ((u = b == null ? void 0 : b.find((k) => k.listening === d)) == null ? void 0 : u.main) ?? null;
    },
    saveLink: async (d) => {
      await i("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(d) });
    },
    bridge: async (d) => {
      s = document.createElement("iframe"), s.title = "Xtrata listening wallet", s.setAttribute("allow", `publickey-credentials-get ${d}; publickey-credentials-create ${d}`), s.referrerPolicy = "no-referrer";
      const b = new Promise((W, lt) => {
        s.addEventListener("load", () => W(), { once: !0 }), setTimeout(() => lt(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = d + "/", r.replaceChildren(s), await b;
      const u = new _w({ walletOrigin: d, frame: s, timeoutMs: 30 * 6e4 }), k = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), U = (W, lt) => k.has(W) ? u.request(W, lt) : Promise.race([
        u.request(W, lt),
        new Promise((gt, Tt) => setTimeout(() => Tt(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await U("listening.status"), { request: U };
    },
    chain: {
      verify: I6,
      balance: L6,
      account: k6,
      owner: C6,
      broadcast: B6,
      transaction: T6,
      confirmedNonce: async (d) => {
        const b = await is(`/v2/accounts/${d}?proof=0`);
        if (!Number.isSafeInteger(b == null ? void 0 : b.nonce) || b.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(b.nonce);
      }
    },
    signWithMain: (d, b) => jh({ ...b, network: "mainnet", stxAddress: d }),
    deposit: (d, b, u) => new Promise((k, U) => Uh({
      recipient: b,
      amount: u.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: d,
      network: new cl(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (W) => k(W.txId || ""),
      onCancel: () => U(new Error("Deposit cancelled. Nothing was sent.")),
      onError: U
    })),
    validate: _6,
    tabLock: (d) => new Promise((b) => {
      const u = navigator.locks;
      if (!(u != null && u.request)) {
        b(!0);
        return;
      }
      u.request("xtrata-ppp:" + d, { ifAvailable: !0 }, async (k) => {
        b(!!k), k && await new Promise(() => {
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
      set: (d, b) => {
        try {
          localStorage.setItem(d, b);
        } catch {
        }
      }
    },
    changed: () => Ae(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (d) => {
      var b, u;
      return a.funder(d, () => tv(d, is), !!((u = (b = o.snapshot().gate) == null ? void 0 : b.gifts) != null && u.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (d) => {
      const b = await i("/radio/gift/for?wallet=" + encodeURIComponent(d)), u = b == null ? void 0 : b.gift;
      if (!u) return null;
      if (typeof u.returnTo != "string" || typeof u.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: u.returnTo, from: typeof u.from == "string" ? u.from : null, source: String(u.source ?? ""), amount: String(u.amount ?? "0"), treasury: u.treasury, state: u.state === "sending" ? "sending" : "arrived", player: u.player ?? null };
    },
    history: (d, b) => rv(d, (u) => is(u), b),
    likesChanged: () => {
      var d, b;
      (b = (d = window.XtrataRadio) == null ? void 0 : d.refreshLikes) == null || b.call(d);
    },
    likeState: async (d, b) => {
      const u = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: d, ids: String(b) })), k = Array.isArray(u == null ? void 0 : u.rows) ? u.rows.find((U) => (U == null ? void 0 : U.id) === b) : null;
      if (!k || typeof k.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: k.liked, by: Array.isArray(k.by) ? k.by.filter((U) => typeof U == "string") : k.liked ? [d] : [] };
    },
    likeSent: (d, b) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: d, liked: b } })),
    nameOf: (d) => A(d) ?? void 0,
    likeConfirmed: (d, b) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: d, liked: b } })),
    likeFailed: (d) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: d } }))
  }), a = f$({
    json: i,
    main: () => {
      const d = e.load();
      return d.isConnected && d.network === "mainnet" ? d.address : void 0;
    },
    pay: (d, b, u, k) => new Promise((U, W) => Uh({
      recipient: b,
      amount: u.toString(),
      memo: k,
      stxAddress: d,
      network: new cl(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (lt) => U(lt.txId || ""),
      onCancel: () => W(new Error("Gift cancelled. Nothing was sent.")),
      onError: W
    })),
    sign: (d, b) => jh({ ...b, network: "mainnet", stxAddress: d }),
    giftSent: (d, b) => o.giftSent(d, b),
    album: { bind: (d) => o.bindAlbum(d), arrived: async (d, b, u, k) => {
      c.invalidate(), await o.albumArriving(d, b, u, k);
    } },
    who: (d) => T(d),
    changed: () => Ae(o.snapshot()),
    store: {
      get: (d) => {
        try {
          return localStorage.getItem(d);
        } catch {
          return null;
        }
      },
      set: (d, b) => {
        try {
          b === null ? localStorage.removeItem(d) : localStorage.setItem(d, b);
        } catch {
        }
      }
    },
    now: Date.now
  }), c = b$({
    json: i,
    open: (d) => {
      o.openAlbum(d);
    },
    store: {
      get: (d) => {
        try {
          return localStorage.getItem(d);
        } catch {
          return null;
        }
      },
      set: (d, b) => {
        try {
          b === null ? localStorage.removeItem(d) : localStorage.setItem(d, b);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => Ae(o.snapshot())
  });
  window.XtrataRadioLikeHandler = (d) => {
    if (!d || !Number.isSafeInteger(d.song) || d.song < 0) return !1;
    te();
    const b = E(d.song, { title: d.title, artist: d.artist });
    return o.heart({ song: d.song, title: b.title || void 0, artist: b.artist || void 0, likedBy: Array.isArray(d.likedBy) ? d.likedBy : void 0 });
  };
  let f;
  window.XtrataRadioListeningIdentity = () => {
    const d = o.snapshot();
    return d.solo && d.step !== "off" && d.step !== "elsewhere" ? d.listening : void 0;
  };
  const h = (d) => {
    var u, k;
    const b = window.XtrataRadioListeningIdentity();
    b !== f && (f = b, (k = (u = window.XtrataRadio) == null ? void 0 : u.refreshLikes) == null || k.call(u));
  };
  let l = "", y = null, p = !1;
  const S = (d) => {
    var lt, gt, Tt, ut, ee, _t;
    const b = window.XtrataRadio;
    if (!(b != null && b.setGiftPlayer) || !(b != null && b.setGiftStop)) return;
    const u = d.step === "off" || d.step === "elsewhere" ? null : ((lt = d.gift) == null ? void 0 : lt.player) ?? null, k = u ? u.id + ":" + u.cover + ":" + u.tracks.map((yt) => yt.id).join(",") : "";
    k !== l && (b.setGiftPlayer(u ? { id: u.id, title: u.title, subtitle: u.subtitle, tracks: ko(u).map((yt) => yt.id), hidden: ((gt = c$(u)) == null ? void 0 : gt.id) ?? null, cover: u.cover } : null), l = k);
    const U = ((Tt = d.giftStop) == null ? void 0 : Tt.text) ?? null;
    U !== y && (b.setGiftStop(U), y = U);
    const W = !!u && !!((ut = d.albumLock) != null && ut.locked);
    W !== p && ((ee = b.setGiftLock) == null || ee.call(b, W), p = W), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(d.step) && ((_t = b.forgetWallets) == null || _t.call(b));
  }, x = (d) => d ? d.slice(0, 6) + "…" + d.slice(-4) : "", L = (d) => (Number(d) / 1e6).toFixed(d < 1000n ? 6 : 4), O = (d) => {
    const b = Math.round((Date.now() - d) / 6e4);
    return b < 1 ? "now" : b < 60 ? `${b}m` : b < 1440 ? `${Math.round(b / 60)}h` : `${Math.round(b / 1440)}d`;
  }, P = (d) => `https://explorer.hiro.so/txid/${d}?chain=mainnet`, g = (d, b = "", u = "") => {
    const k = document.createElement(d);
    return b && (k.textContent = b), u && (k.className = u), k;
  }, I = (d, b, u = "") => {
    const k = g("button", d, u);
    return k.type = "button", k.onclick = b, k;
  }, $ = (d, b) => {
    const u = g("a", d);
    return u.href = b, u.target = "_blank", u.rel = "noopener", u;
  };
  let N = null, V = location.hash === "#give";
  V && history.replaceState(null, "", location.pathname + location.search);
  let D = !1;
  const j = Vv((d) => Gv({ address: d, network: "mainnet" }), () => Ae(o.snapshot())), A = (d) => j.get(d), B = x$(navigator.userAgent), _ = (d, b) => {
    const u = navigator.userAgent, k = A$(u), U = `${location.origin}${location.pathname}${b ? `#gift=${b}` : ""}`, W = [g("p", `You are in ${d}'s built-in browser, where passkeys often do not work. Open this page in ${k} to make your listening wallet${b ? " and claim your gift" : ""}.`, "ppp-warn")], lt = g("div", "", "ppp-open-row"), gt = S$(U, u);
    if (gt) {
      const Tt = g("a", `Open in ${k}`, "primary ppp-open-in");
      Tt.href = gt, Tt.dataset.homeAction = "radio:open-in-browser", lt.append(Tt);
    }
    return lt.append(vs("copy-page-link", "Copy link", () => U, gt ? "" : "primary", () => Ae(o.snapshot()))), W.push(lt, g("p", `If that does not open ${k}, use ${d}'s menu (••• or ⋮) and choose "Open in ${k === "your browser" ? "browser" : k}", or paste the copied link there.`, "ppp-mute")), W;
  }, T = (d) => A(d) ?? x(d), J = (d) => d.slice(0, 2).map(T).join(" and ") + (d.length > 2 ? ` and ${d.length - 2} more` : ""), z = /* @__PURE__ */ new Map();
  let Ot = !1;
  const ft = (d) => !d || /^(?:Inscription )?#\d+$/.test(d.trim()), te = () => {
    Ot || (Ot = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((d) => d.ok ? d.json() : null).then((d) => {
      for (const b of Array.isArray(d == null ? void 0 : d.tracks) ? d.tracks : []) {
        const u = Number(b == null ? void 0 : b.id);
        Number.isSafeInteger(u) && z.set(u, { title: typeof b.title == "string" ? b.title : void 0, artist: typeof b.artist == "string" ? b.artist : void 0 });
      }
      Ae(o.snapshot());
    }).catch(() => {
      Ot = !1;
    }));
  }, E = (d, b) => {
    const u = z.get(d), k = Wv(d, [u == null ? void 0 : u.title, b == null ? void 0 : b.title].find((W) => !ft(W)) || ""), U = Kv(d, (u == null ? void 0 : u.artist) || (b == null ? void 0 : b.artist) || "");
    return { title: k, artist: U };
  }, M = (d) => {
    const { title: b, artist: u } = E(d.song, d);
    return b ? `“${b}”${u ? ` — ${u}` : ""}` : `Song #${d.song}${u ? ` — ${u}` : ""}`;
  }, dt = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Ct = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function It(d) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(d.step) ? ["", ""] : d.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : d.step === "over" ? ["OVER 1 STX", "bad"] : d.step === "locked" ? ["LOCKED", "mute"] : d.step === "intro" || d.step === "link" ? ["", ""] : d.step === "fund" ? d.depositPending ? ["ON ITS WAY", "warn"] : d.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : d.payingOn && d.session && d.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function kt(d, b, u = "", k) {
    const U = g("dt", d), W = g("dd", b, u);
    return k && W.append(" ", k), [U, W];
  }
  const re = document.getElementById("ppp-top"), ce = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Kt = () => {
    var b, u;
    const d = o.snapshot();
    if (d.step === "connect" || d.step === "wrong-wallet") {
      (b = document.getElementById("radio-wallet-connect")) == null || b.click();
      return;
    }
    if (d.step === "elsewhere" && ((u = d.gate) != null && u.radioUrl)) {
      location.href = d.gate.radioUrl;
      return;
    }
    d.step === "locked" && !d.armed && !d.busy && o.unlock(), d.step === "ready" && !d.payingOn && !d.busy && o.switchOn(), ce();
  };
  re && (re.onclick = Kt);
  function me(d) {
    if (!re) return;
    const b = (k, U, W) => {
      re.hidden = !1, re.className = "ppp-top" + (U ? " is-" + U : ""), re.replaceChildren(g("span", "", "dot"), document.createTextNode(k)), re.title = W;
    }, u = d.session ? Math.min(d.session.playsLeft, d.playsLeft) : 0;
    switch (d.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        re.hidden = !0;
        return;
      case "elsewhere":
        return b("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        re.hidden = !0;
        return;
      case "intro":
        return b("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "wrong-wallet":
        return b(`Connect ${T(d.linked)}`, "warn", `This device's listening wallet belongs to ${T(d.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return b(d.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return b("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return d.depositPending ? b("Funds on their way", "quiet", "Paying starts by itself when they land") : b(d.entries.some((k) => k.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return b("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return b("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return d.payingOn && u > 0 ? b(`On · ${u.toLocaleString()} plays left`, "on", "Paying artists as you listen") : b("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  const zt = document.getElementById("pppNudge"), Gt = document.getElementById("onair");
  (ln = zt == null ? void 0 : zt.querySelector("button")) == null || ln.addEventListener("click", () => Kt());
  const Qe = {
    elsewhere: "Listening free · artists get nothing",
    connect: "Not paying artists",
    intro: "Not paying artists",
    locked: "Locked · not paying artists",
    "wrong-wallet": "Wrong wallet connected · not paying artists",
    link: "Not paying artists yet",
    fund: "No funds yet · artists unpaid",
    over: "Paused · artists unpaid",
    ready: "Paying is off · artists get nothing"
  }, Sn = {
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
  function Je(d) {
    var lt;
    if (d.step === "loading") return;
    const b = d.session ? Math.min(d.session.playsLeft, d.playsLeft) : 0, u = d.step === "ready" && d.payingOn && b > 0, k = d.step === "fund" && d.depositPending, U = u || k ? "" : Qe[d.step] ?? "", W = u ? "on" : U ? "off" : "";
    if (W ? document.documentElement.dataset.ppp = W : delete document.documentElement.dataset.ppp, Gt && (Gt.hidden = !W, Gt.querySelector(".onair-sub").textContent = u ? `Paying artists · ${b.toLocaleString()} plays left` : "Not paying"), zt && (zt.hidden = W !== "off", W === "off")) {
      const gt = Math.floor(Number(1000000n / Fn(BigInt(((lt = d.gate) == null ? void 0 : lt.limits.playFee) ?? "300"))));
      zt.querySelector(".nudge-t").textContent = "⚠ " + U, zt.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${gt.toLocaleString()} plays, on-chain, straight to the artists.`, zt.querySelector("button").textContent = Sn[d.step] ?? "Start paying";
    }
  }
  let Ue = "";
  function xe(d) {
    const b = g("div", "", "ppp-pick");
    d.funderMultiple && d.returnToKind === "funder" && b.append(g("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), d.returnToKind === "funder" && b.append(g("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const u = g("input");
    u.type = "text", u.placeholder = "SP… address to send returns to", u.autocomplete = "off", u.spellcheck = !1, u.setAttribute("aria-label", "Address to return funds to"), u.value = Ue, u.oninput = () => {
      Ue = u.value;
    };
    const k = I(d.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(u.value), Ue = "";
    }, "tiny");
    return b.append(u, " ", k), d.returnToKind === "chosen" && b.append(" ", I("Back to the funder", () => o.clearReturnAddress(), "tiny")), b;
  }
  const Le = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Be() {
    const d = g("p", Le + " ", "ppp-mute");
    return d.append($("Xverse", "https://www.xverse.app/download"), " · ", $("Leather", "https://leather.io/install-extension")), d;
  }
  let Wt = "";
  const qt = (d) => {
    const b = document.documentElement, u = d.solo && !d.main ? d.listening ? x(d.listening) : "new" : "", k = hv() ? "1" : "";
    `${u}|${k}` !== Wt && (Wt = `${u}|${k}`, u ? b.dataset.pppSolo = u : delete b.dataset.pppSolo, k ? b.dataset.pppWalletInstalled = k : delete b.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const d of [1500, 4e3, 9e3]) setTimeout(() => Ae(o.snapshot()), d);
  function Se(d, b = "") {
    var U;
    const u = g("div", "", "ppp-topup"), k = (U = d.likeFunds) == null ? void 0 : U.balance;
    u.append(g("span", "Add plays from My player: ", "ppp-mute"));
    for (const W of du) {
      const lt = I(`+${(Number(W) / 1e6).toFixed(2)} STX`, () => void o.topUpAlbum(W), b);
      lt.disabled = k === void 0 || k < W + 6000n || d.depositPending || !!d.busy, u.append(lt);
    }
    return k !== void 0 && k < du[0] + 6000n && u.append(g("p", "My player is nearly empty: add STX to it first (switch to My player above).", "ppp-mute")), u;
  }
  function Pe(d) {
    const b = d.likeFunds;
    if (!b || !b.album || !b.low && !b.pending) return [];
    const u = g("div", "", "ppp-pick ppp-lowbox");
    if (!b.low) {
      const U = g("p", "Top-up for your main listener wallet is on its way. ", "ppp-warn");
      return b.txid && U.append($("View", P(b.txid))), u.append(U), [u];
    }
    u.append(g("p", "⚠ YOUR MAIN LISTENER WALLET IS OUT OF FUNDS", "ppp-bad ppp-lowtitle")), u.append(g("p", "It signs every like for all your albums, so they all count for you. Likes are paused until it has a little STX. 0.1 STX is hundreds of likes.")), u.append(g("p", b.address, "ppp-addr-full"));
    const k = g("div", "", "ppp-open-row");
    if (k.append(vs("copy-likes-address", "Copy address", () => b.address, "primary", () => Ae(o.snapshot()))), b.main && !d.solo) {
      const U = Es - (b.balance ?? 0n);
      U > 0n && k.append(I(`Pay ${Mn(U)} STX from my wallet`, () => void o.topUpLikes(), "primary"));
    }
    return u.append(k), u.append(g("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [u];
  }
  function Ae(d) {
    var si, ii, Te, oi, ls, ai, Er, vr, un, $r, us, Ir, fs;
    const b = a.inProgress(d), u = b && d.step === "fund" ? { ...d, depositPending: !0 } : d;
    if (h(), S(d), qt(u), me(u), Je(u), t.hidden = u.step === "off", t.hidden) return;
    const [k, U] = It(u), W = n(".ppp-state");
    W.textContent = k, W.className = "ppp-state" + (U ? " ppp-state--" + U : ""), W.hidden = !k;
    const lt = !!u.busy || u.armed, gt = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(u.step) && (lt || !["intro", "loading"].includes(u.step));
    r.hidden = !gt, r.classList.toggle("ppp-frame--rest", !lt && !D);
    const Tt = n(".ppp-frame-label");
    Tt.hidden = !0;
    const ut = lv(u) ?? N;
    N = ut;
    const ee = fv(u, ut);
    n(".ppp-badge").hidden = !ee;
    const _t = n(".ppp-steps"), yt = n(".ppp-stage");
    _t.hidden = yt.hidden = !ee, ut && ee && (_t.replaceChildren(...hu(u.solo).map((R, Z) => {
      const se = g("li", "", Z < ut.at ? "done" : Z === ut.at ? ut.blocked ? "now blocked" : "now" : "");
      return se.append(g("span", Z < ut.at ? "✓" : String(Z + 1), "n"), R), Z === ut.at && se.setAttribute("aria-current", "step"), se;
    })), yt.textContent = ut.caption, yt.className = "ppp-stage " + (ut.at >= hu(u.solo).length ? "ppp-ok" : ut.blocked ? "ppp-bad" : "ppp-cyan"));
    const Nt = n(".ppp-facts"), Xt = [];
    u.main && ((si = u.gate) != null && si.here) && !u.solo && Xt.push(...kt("Your wallet", T(u.main), "ppp-addr-short"));
    const Ee = () => {
      if (!u.listening) return;
      const R = vs("copy-listening", "Copy", () => u.listening || "", "tiny", () => Ae(o.snapshot()));
      Xt.push(...kt(u.slot > 0 ? "Album wallet" : u.linked ? "My player (technical)" : "My player wallet", x(u.listening), "ppp-addr-short", R));
    };
    if (u.linked || Ee(), u.listening && u.step !== "intro")
      if (u.linked)
        Xt.push(...kt("Credited to", `${T(u.linked)} · plays, likes and returns`, u.linked === u.main || u.solo ? "ppp-ok" : "ppp-warn")), Ee();
      else if (u.solo) {
        u.creditedTo && Xt.push(...kt("Credited to", `${T(u.creditedTo)} · plays and likes`, "ppp-ok"));
        const R = u.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : u.returnTo ? `${T(u.returnTo)} · ${u.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : u.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Xt.push(...kt("Returns go to", u.gift ? R : u.returnTo && !A(u.returnTo) ? R.replace(x(u.returnTo), u.returnTo) : R, u.returnTo && !u.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Xt.push(...kt("Linked to", "not linked yet", "ppp-warn"));
    if (u.linkedListening.length && ((ii = u.gate) != null && ii.here)) {
      const R = u.linkedListening.map((Z) => x(Z) + (Z === u.listening ? " (this one)" : "")).join(", ");
      Xt.push(...kt(u.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", R, "ppp-addr-short"));
    }
    if (u.balance !== void 0 && ["fund", "ready", "over"].includes(u.step)) {
      const R = u.step === "fund" && u.depositPending ? "ppp-mute" : u.balanceState === "ok" ? "ppp-ok" : u.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Xt.push(...kt("Balance", `${Mn(u.balance)} STX · about ${u.playsLeft.toLocaleString()} plays`, R));
    }
    const $e = u.entries.find((R) => R.kind === "play");
    $e && te(), $e && Xt.push(...kt("Last paid song", `${M($e)} → ${T($e.recipient)}`, dt[$e.status] || "")), Nt.replaceChildren(...Xt), Nt.hidden = !Xt.length;
    const rt = [], et = [], Bt = [], Ie = [], Ht = Fn(BigInt(((Te = u.gate) == null ? void 0 : Te.limits.playFee) ?? "300")), le = `Each song you listen to for 30 seconds sends ${Mn(Wa)} STX to whoever holds it, plus a ${Mn(Ht - Wa)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, Tn = !!u.busy;
    switch (u.step) {
      case "elsewhere": {
        if (rt.push(g("p", "Pay artists as you listen.")), (oi = u.gate) != null && oi.radioUrl) {
          const Z = g("p");
          Z.append($("Open the pay-per-play radio →", u.gate.radioUrl)), rt.push(Z);
        }
        et.push(g("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (u.linked) {
          const Z = [u.linked, ...u.others];
          rt.push(g("p", Z.length > 1 ? `This device has listening wallets for ${J(Z)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${T(u.linked)}. Connect that wallet to keep paying artists.`)), et.push(g("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          rt.push(g("p", "Connect your wallet to pay artists as you listen.")), et.push(g("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        rt.push(g("p", `This device's listening wallet belongs to ${T(u.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), et.push(g("p", `You are connected as ${T(u.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), et.push(g("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Bt.push(I("Switch wallet", () => {
          var Z;
          return (Z = document.getElementById("radio-wallet-connect")) == null ? void 0 : Z.click();
        }, "primary"));
        break;
      case "not-invited":
        rt.push(g("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        rt.push(g("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        rt.push(g("p", `Pay artists ${Mn(Ht)} STX a song as you listen.`)), et.push(g("p", le)), et.push(g("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), et.push(g("p", u.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !u.solo && u.main && u.others.length ? (rt.push(g("p", `This device already has a listening wallet for ${J(u.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), et.push(g("p", `Otherwise, set up a new listening wallet for ${T(u.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !u.solo && u.main && et.push(g("p", `This is the listening wallet for ${T(u.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), u.solo && et.push(g("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const R = a.liveGift();
        Bt.push(I(R ? "Claim my gift · no wallet needed" : u.solo ? "Turn on pay-per-play · no wallet needed" : u.others.length && u.main ? `Set up for ${T(u.main)}` : "Turn on pay-per-play", () => void o.create(), "primary")), !R && !u.solo && u.main && u.others.length && Bt.push(I("Switch wallet", () => {
          var Z;
          return (Z = document.getElementById("radio-wallet-connect")) == null ? void 0 : Z.click();
        })), !R && u.solo && Bt.push(I("I have a Stacks wallet", () => {
          var Z;
          return (Z = document.getElementById("radio-wallet-connect")) == null ? void 0 : Z.click();
        })), Bt.push(I("I already have a listening wallet", () => void o.unlock(!0))), R && Bt.push(I("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        u.armed || (rt.push(g("p", "Locked.", "ppp-mute")), Bt.push(I(u.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), Ie.push(I("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        rt.push(g("p", `Link to ${T(u.main)} · free`)), et.push(g("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), et.push(g("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Bt.push(I(u.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        rt.push(g("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (u.depositPending || ((ls = u.gift) != null && ls.player ? rt.push(g("p", "Out of plays · add more to keep listening", "ppp-bad")) : u.entries.length ? rt.push(g("p", "Out of funds · top up to keep paying", "ppp-bad")) : rt.push(g("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / Ht)).toLocaleString()} songs`))), (ai = u.gift) != null && ai.player ? et.push(g("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : u.entries.length && et.push(g("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), u.payingOn && !u.entries.length && et.push(g("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), b || (u.solo ? (et.push(g("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), et.push(g("p", u.listening || "", "ppp-addr-full")), u.listening && !u.depositPending && Bt.push(vs("copy-address", "Copy my address", () => u.listening || "", "primary", () => Ae(o.snapshot())))) : et.push(g("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute"))), u.depositPending && u.depositTxid) {
          const Z = g("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          Z.append($("View", P(u.depositTxid))), rt.push(Z);
        } else u.allowance > 0n && !u.solo && Bt.push(I(`Deposit ${Mn(u.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        rt.push(g("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), u.solo && !u.returnTo && (rt.push(g("p", u.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), rt.push(xe(u))), (!u.solo || u.returnTo) && Bt.push(I("Return excess", () => void o.returnFunds("excess"), "primary"), I("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (u.payingOn && u.session && u.session.playsLeft > 0) {
          const Z = Math.min(u.session.playsLeft, u.playsLeft);
          rt.push(g("p", `Paying as you listen · up to ${Z.toLocaleString()} plays left`, "ppp-ok")), et.push(g("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), Bt.push(I("Switch off", () => void o.switchOff()));
        } else
          rt.push(g("p", "Paying is off. Music stays free.", "ppp-mute")), Bt.push(I("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        u.queued && rt.push(g("p", u.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${u.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), u.balanceState === "low" && rt.push(g("p", "Running low · top up", "ppp-warn")), u.depositPending ? rt.push(g("p", "Top-up on its way…", "ppp-warn")) : u.allowance > 0n && u.balanceState !== "ok" && !u.solo && Bt.push(I(`Top up ${Mn(u.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (u.solo && u.walletCannotSolo && et.push(g("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), u.solo && ["fund", "ready"].includes(u.step) && ((u.balance ?? 0n) > 0n && u.slot === 0 && et.push(xe(u)), et.push(Be()), u.slot === 0 && u.step === "ready" && u.entries.some((R) => R.kind === "play" && R.status === "confirmed"))) {
      const R = g("p", "New to Stacks? ", "ppp-mute");
      R.append($("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), rt.push(R);
    }
    if (u.walletOutdated && et.push(g("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), u.stuck && (rt.push(g("p", u.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${u.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Bt.push(I("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(u.step) && (u.returnTo || u.gift) && (u.balance ?? 0n) > 0n && Ie.push(I(u.linked ? "Return all to my wallet" : u.gift ? "Return what is left…" : `Return all to ${T(u.returnTo)}`, () => void o.returnFunds("all"), "quiet")), u.slot > 0 && ((Er = u.gift) != null && Er.player) && ["ready", "fund"].includes(u.step) && u.giftPlays > 20 && Ie.push(Se(u, "quiet")), ["ready", "fund", "link", "over"].includes(u.step) && Ie.push(I("Lock", () => void o.lock(), "quiet")), gt && !lt && Ie.push(I(D ? "Hide listening wallet box" : "Show listening wallet box", () => {
      D = !D, Ae(o.snapshot());
    }, "quiet")), [...Bt, ...Ie].forEach((R) => R.disabled = Tn), Tn && (Bt.length = 0), u.balance !== void 0 && ["fund", "ready", "over"].includes(u.step) && !(u.step === "fund" && u.depositPending && u.balance === 0n) && !((vr = u.gift) != null && vr.player)) {
      const R = u.balanceState === "ok" ? "ppp-ok" : u.balanceState === "low" ? "ppp-warn" : "ppp-bad", Z = rt.at(0);
      u.step === "ready" && Z ? Z.append(g("span", ` · ${L(u.balance)} STX`, R)) : rt.push(g("p", `Balance ${L(u.balance)} STX`, R));
    }
    if ((un = u.gift) != null && un.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(u.step)) {
      const R = g("p", "", "ppp-gift");
      R.append(`💿 Album · ${u.gift.player.title}`), u.gift.player.subtitle && R.append(" · ", u.gift.player.subtitle);
      const Z = ["ready", "fund", "over"].includes(u.step) && u.balance !== void 0 ? u.giftPlays === 0 && u.depositPending ? g("span", " · plays on their way", "ppp-warn") : g("span", u.giftPlays === 0 ? " · no plays left" : ` · ${u.giftPlays.toLocaleString()} ${u.giftPlays === 1 ? "play" : "plays"} left`, u.giftPlays === 0 ? "ppp-bad" : u.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      Z && R.append(Z);
      const se = ($r = rt.at(0)) == null ? void 0 : $r.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (u.step === "ready" && se && /STX/.test(se.textContent ?? "") && se.remove(), rt.unshift(R), u.giftPlays <= 20 && ["ready", "fund"].includes(u.step) && !u.depositPending)
        if (u.slot > 0)
          rt.splice(1, 0, g("p", u.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), Se(u, "primary"));
        else {
          const de = g("p", u.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          de.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), de.append($("Xverse", "https://www.xverse.app/download"), " and ", $("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), rt.splice(1, 0, de);
        }
    }
    if (u.gift && !u.linked && ["fund", "ready", "over"].includes(u.step) && u.returnPlan.state === "ready") {
      const R = u.returnPlan, Z = g("div", "", "ppp-pick");
      Z.append(g("p", R.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const se = g("ul", "", "ppp-gift-list");
      R.steps.forEach((de, ds) => {
        const Rn = de.kind === "gift" ? "the unused gift" : de.kind === "deposit" ? "what was added to it" : "the rest", ne = g("li");
        ne.append(g("span", `${ds + 1}. ${Mn(BigInt(de.send))} STX · ${Rn}`, "t"), g("span", de.to ? ` → ${T(de.to)}` : " → choose an address below", de.to ? "ppp-mute" : "ppp-warn")), se.append(ne);
      }), Z.append(se), R.kept && Z.append(g("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), R.steps.some((de) => !de.to) && Z.append(xe(u)), Z.append(I(R.steps.length > 1 ? `Confirm part 1 of ${R.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), rt.push(Z);
    }
    rt.unshift(...a.banner(d)), rt.unshift(...Pe(u)), B && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(u.step)) && rt.unshift(..._(B, a.pendingCode())), u.solo && u.creditedTo && u.listening && !["intro", "off", "elsewhere", "loading"].includes(u.step) && rt.unshift(g("p", `This is ${T(u.creditedTo)}'s listening wallet. Plays and likes count for ${T(u.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...rt);
    const Oe = document.querySelector(".ppp-switch");
    if (Oe) {
      const R = c.latest(), Z = u.slot > 0, se = ["fund", "ready", "over"].includes(u.step) && (Z || !!R);
      if (Oe.hidden = !se, se) {
        const de = (Rn, ne, qi, Xi) => {
          const Hn = I("", Xi, "ppp-tab");
          return Hn.setAttribute("aria-pressed", String(qi)), Hn.append(g("span", Rn, "tt"), g("span", ne === void 0 ? "…" : `${L(ne)} STX`, "ts")), Hn.disabled = !!u.busy, Hn;
        }, ds = Z ? ((Ir = (us = u.gift) == null ? void 0 : us.player) == null ? void 0 : Ir.title) ?? "Album" : R.title;
        Oe.replaceChildren(
          de("🎧 My player", Z ? (fs = u.likeFunds) == null ? void 0 : fs.balance : u.balance, !Z, () => {
            Z && o.openAlbum(0);
          }),
          de("💿 " + ds, Z ? u.balance : void 0, Z, () => {
            !Z && R && o.openAlbum(R.slot);
          })
        );
      }
    }
    const _n = c.render(u), tn = document.querySelector(".ppp-shelf");
    if (tn) {
      tn.hidden = !_n;
      const R = tn.querySelector("summary");
      R && (R.textContent = c.count() > 0 ? `♪ My albums (${c.count()})` : "♪ My albums");
      const Z = tn.querySelector(".ppp-shelf-body");
      _n && Z && !Z.contains(_n) && Z.replaceChildren(_n);
    }
    const En = a.renderFold(d);
    if (n(".ppp-gifts").hidden = !En, En && !n(".ppp-gift-body").contains(En) && n(".ppp-gift-body").replaceChildren(En), En && V) {
      V = !1;
      const R = n(".ppp-gifts");
      R.open = !0, requestAnimationFrame(() => R.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...et), n(".ppp-actions").replaceChildren(...Bt), n(".ppp-actions2").replaceChildren(...Ie);
    const en = u.busy || u.message || "", Ar = n(".ppp-msg"), De = en && rt.some((R) => (R.textContent ?? "").startsWith(en.replace(/[.✓\s]+$/, ""))) ? "" : en, ni = !De && !u.error ? u.notice : "";
    Ar.textContent = De || ni, Ar.classList.toggle("is-warn", !!ni), n(".ppp-err").textContent = u.error;
    const Wi = u.entries.filter((R) => R.kind === "play");
    n(".ppp-recent").hidden = !u.entries.length, n(".ppp-recent-list").replaceChildren(...Wi.slice(0, 5).map((R) => {
      const Z = g("li"), se = R.status === "confirmed" ? "ok" : R.status === "failed" ? "bad" : "warn";
      return Z.append(g("span", "", "d " + se), g("span", M(R), "t"), g("span", O(R.created), "ppp-mute")), R.txid && Z.append($("tx", P(R.txid))), Z;
    })), n(".ppp-wallets").hidden = !(Nt.childElementCount || Ie.length), n(".ppp-more").hidden = !et.length;
    const ri = n(".ppp-history");
    ri.hidden = !u.entries.length, u.entries.length && te(), ri.replaceChildren(g("summary", `All activity (${u.entries.length})`), ...u.entries.slice(0, 20).map((R) => {
      const Z = g("div", "", "ppp-row"), se = R.kind === "play" ? [g("span", M(R), "ppp-song"), g("span", ` · ${Mn(BigInt(R.amount))} STX to ${T(R.recipient)}`, "ppp-mute")] : R.kind === "like" ? [g("span", `${R.liked ? "♥ Liked" : "Unliked"} ${M(R)}`, "ppp-song"), g("span", ` · for ${u.linked ? T(u.linked) : "this listening wallet"}`, "ppp-mute")] : [g("span", `Returned ${Mn(BigInt(R.amount))} STX`, "ppp-song"), g("span", ` to ${T(R.recipient)}`, "ppp-mute")];
      return Z.append(
        g("span", Ct[R.status] || R.status, "ppp-status " + (dt[R.status] || "")),
        ...se,
        g("span", ` · ${new Date(R.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), R.txid && Z.append($("tx ↗", P(R.txid))), Z;
    }));
  }
  const An = /* @__PURE__ */ new Map(), Rt = () => {
    const d = window.XtrataRadio;
    return d != null && d.subscribe ? (d.subscribe((b) => {
      const u = b == null ? void 0 : b.nowPlaying;
      u && Number.isSafeInteger(Number(u.tokenId)) && An.set(Number(u.tokenId), { title: u.title || void 0, artist: u.artist || void 0 });
    }), !0) : !1;
  };
  if (!Rt()) {
    const d = setInterval(() => {
      Rt() && clearInterval(d);
    }, 500);
    setTimeout(() => clearInterval(d), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (d) => {
    const b = d.detail;
    if (b && Number.isSafeInteger(b.song) && typeof b.id == "string" && /^[0-9a-f]{32}$/.test(b.id)) {
      te();
      const u = E(b.song, An.get(b.song));
      o.onListened({ song: b.song, id: b.id, title: u.title || void 0, artist: u.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const v$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", $$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, I$ = () => $$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, k$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, L$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', cw = class {
  constructor(t) {
    zA(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && cx(t), this.callback(ac(t));
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
    var r, s, i, o, a, c, f, h, l, y;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (h = (f = t.googlePlayStoreUrl) !== null && f !== void 0 ? f : this.getBrowserUrl(t)) !== null && h !== void 0 ? h : t.webUrl : (y = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && y !== void 0 ? y : this.getMobileUrl(t);
  }
  render() {
    const t = I$(), e = k$(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return wt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, wt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), wt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, wt("div", { class: "flex flex-col space-y-[10px]" }, wt("div", { class: "flex items-center" }, wt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), wt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, wt("span", { class: "sr-only" }, "Close popup"), wt("img", { src: v$ }))), r ? wt("p", null, "Select the wallet you want to connect to.") : wt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && wt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && wt("div", { class: "mt-6" }, wt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), wt("ul", { class: "space-y-3" }, this.installedProviders.map((i) => wt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, wt("div", { class: "aspect-square basis-9 overflow-hidden" }, wt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), wt("div", { class: "flex-1" }, wt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && wt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), wt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && wt("div", { class: "mt-6" }, r ? wt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : wt("div", { class: "mb-5 flex justify-between" }, wt("p", { class: "text-sm font-medium" }, "Recommended wallets"), wt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, wt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, wt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), wt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), wt("p", null, "What is a wallet? ", wt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), wt("ul", { class: "space-y-3" }, n.map((i) => wt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, wt("div", { class: "aspect-square basis-9 overflow-hidden" }, wt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), wt("div", { class: "flex-1" }, wt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && wt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && wt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return EA(this);
  }
};
cw.style = L$;
const C$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: cw
}, Symbol.toStringTag, { value: "Module" }));
