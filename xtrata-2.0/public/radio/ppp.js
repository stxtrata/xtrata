var qy = Object.defineProperty;
var Xy = (t, e, n) => e in t ? qy(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Gi = (t, e, n) => Xy(t, typeof e != "symbol" ? e + "" : e, n);
var ze = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function t0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function ja(t) {
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
      typeof ze < "u" && ze || {}, r = {
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
      function i(E) {
        return E && DataView.prototype.isPrototypeOf(E);
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
        ], o = ArrayBuffer.isView || function(E) {
          return E && s.indexOf(Object.prototype.toString.call(E)) > -1;
        };
      function a(E) {
        if (typeof E != "string" && (E = String(E)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(E) || E === "")
          throw new TypeError('Invalid character in header field name: "' + E + '"');
        return E.toLowerCase();
      }
      function c(E) {
        return typeof E != "string" && (E = String(E)), E;
      }
      function f(E) {
        var T = {
          next: function() {
            var M = E.shift();
            return { done: M === void 0, value: M };
          }
        };
        return r.iterable && (T[Symbol.iterator] = function() {
          return T;
        }), T;
      }
      function h(E) {
        this.map = {}, E instanceof h ? E.forEach(function(T, M) {
          this.append(M, T);
        }, this) : Array.isArray(E) ? E.forEach(function(T) {
          if (T.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + T.length);
          this.append(T[0], T[1]);
        }, this) : E && Object.getOwnPropertyNames(E).forEach(function(T) {
          this.append(T, E[T]);
        }, this);
      }
      h.prototype.append = function(E, T) {
        E = a(E), T = c(T);
        var M = this.map[E];
        this.map[E] = M ? M + ", " + T : T;
      }, h.prototype.delete = function(E) {
        delete this.map[a(E)];
      }, h.prototype.get = function(E) {
        return E = a(E), this.has(E) ? this.map[E] : null;
      }, h.prototype.has = function(E) {
        return this.map.hasOwnProperty(a(E));
      }, h.prototype.set = function(E, T) {
        this.map[a(E)] = c(T);
      }, h.prototype.forEach = function(E, T) {
        for (var M in this.map)
          this.map.hasOwnProperty(M) && E.call(T, this.map[M], M, this);
      }, h.prototype.keys = function() {
        var E = [];
        return this.forEach(function(T, M) {
          E.push(M);
        }), f(E);
      }, h.prototype.values = function() {
        var E = [];
        return this.forEach(function(T) {
          E.push(T);
        }), f(E);
      }, h.prototype.entries = function() {
        var E = [];
        return this.forEach(function(T, M) {
          E.push([M, T]);
        }), f(E);
      }, r.iterable && (h.prototype[Symbol.iterator] = h.prototype.entries);
      function l(E) {
        if (!E._noBody) {
          if (E.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          E.bodyUsed = !0;
        }
      }
      function b(E) {
        return new Promise(function(T, M) {
          E.onload = function() {
            T(E.result);
          }, E.onerror = function() {
            M(E.error);
          };
        });
      }
      function p(E) {
        var T = new FileReader(), M = b(T);
        return T.readAsArrayBuffer(E), M;
      }
      function S(E) {
        var T = new FileReader(), M = b(T), B = /charset=([A-Za-z0-9_-]+)/.exec(E.type), J = B ? B[1] : "utf-8";
        return T.readAsText(E, J), M;
      }
      function x(E) {
        for (var T = new Uint8Array(E), M = new Array(T.length), B = 0; B < T.length; B++)
          M[B] = String.fromCharCode(T[B]);
        return M.join("");
      }
      function C(E) {
        if (E.slice)
          return E.slice(0);
        var T = new Uint8Array(E.byteLength);
        return T.set(new Uint8Array(E)), T.buffer;
      }
      function D() {
        return this.bodyUsed = !1, this._initBody = function(E) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = E, E ? typeof E == "string" ? this._bodyText = E : r.blob && Blob.prototype.isPrototypeOf(E) ? this._bodyBlob = E : r.formData && FormData.prototype.isPrototypeOf(E) ? this._bodyFormData = E : r.searchParams && URLSearchParams.prototype.isPrototypeOf(E) ? this._bodyText = E.toString() : r.arrayBuffer && r.blob && i(E) ? (this._bodyArrayBuffer = C(E.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(E) || o(E)) ? this._bodyArrayBuffer = C(E) : this._bodyText = E = Object.prototype.toString.call(E) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof E == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(E) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var E = l(this);
          if (E)
            return E;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var E = l(this);
            return E || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var E = l(this);
          if (E)
            return E;
          if (this._bodyBlob)
            return S(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(x(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(I);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var H = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function g(E) {
        var T = E.toUpperCase();
        return H.indexOf(T) > -1 ? T : E;
      }
      function k(E, T) {
        if (!(this instanceof k))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        T = T || {};
        var M = T.body;
        if (E instanceof k) {
          if (E.bodyUsed)
            throw new TypeError("Already read");
          this.url = E.url, this.credentials = E.credentials, T.headers || (this.headers = new h(E.headers)), this.method = E.method, this.mode = E.mode, this.signal = E.signal, !M && E._bodyInit != null && (M = E._bodyInit, E.bodyUsed = !0);
        } else
          this.url = String(E);
        if (this.credentials = T.credentials || this.credentials || "same-origin", (T.headers || !this.headers) && (this.headers = new h(T.headers)), this.method = g(T.method || this.method || "GET"), this.mode = T.mode || this.mode || null, this.signal = T.signal || this.signal || function() {
          if ("AbortController" in n) {
            var F = new AbortController();
            return F.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && M)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(M), (this.method === "GET" || this.method === "HEAD") && (T.cache === "no-store" || T.cache === "no-cache")) {
          var B = /([?&])_=[^&]*/;
          if (B.test(this.url))
            this.url = this.url.replace(B, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var J = /\?/;
            this.url += (J.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      k.prototype.clone = function() {
        return new k(this, { body: this._bodyInit });
      };
      function I(E) {
        var T = new FormData();
        return E.trim().split("&").forEach(function(M) {
          if (M) {
            var B = M.split("="), J = B.shift().replace(/\+/g, " "), F = B.join("=").replace(/\+/g, " ");
            T.append(decodeURIComponent(J), decodeURIComponent(F));
          }
        }), T;
      }
      function U(E) {
        var T = new h(), M = E.replace(/\r?\n[\t ]+/g, " ");
        return M.split("\r").map(function(B) {
          return B.indexOf(`
`) === 0 ? B.substr(1, B.length) : B;
        }).forEach(function(B) {
          var J = B.split(":"), F = J.shift().trim();
          if (F) {
            var Pt = J.join(":").trim();
            try {
              T.append(F, Pt);
            } catch (ut) {
              console.warn("Response " + ut.message);
            }
          }
        }), T;
      }
      D.call(k.prototype);
      function K(E, T) {
        if (!(this instanceof K))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (T || (T = {}), this.type = "default", this.status = T.status === void 0 ? 200 : T.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = T.statusText === void 0 ? "" : "" + T.statusText, this.headers = new h(T.headers), this.url = T.url || "", this._initBody(E);
      }
      D.call(K.prototype), K.prototype.clone = function() {
        return new K(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, K.error = function() {
        var E = new K(null, { status: 200, statusText: "" });
        return E.ok = !1, E.status = 0, E.type = "error", E;
      };
      var R = [301, 302, 303, 307, 308];
      K.redirect = function(E, T) {
        if (R.indexOf(T) === -1)
          throw new RangeError("Invalid status code");
        return new K(null, { status: T, headers: { location: E } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(T, M) {
          this.message = T, this.name = M;
          var B = Error(T);
          this.stack = B.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function q(E, T) {
        return new Promise(function(M, B) {
          var J = new k(E, T);
          if (J.signal && J.signal.aborted)
            return B(new e.DOMException("Aborted", "AbortError"));
          var F = new XMLHttpRequest();
          function Pt() {
            F.abort();
          }
          F.onload = function() {
            var A = {
              statusText: F.statusText,
              headers: U(F.getAllResponseHeaders() || "")
            };
            J.url.indexOf("file://") === 0 && (F.status < 200 || F.status > 599) ? A.status = 200 : A.status = F.status, A.url = "responseURL" in F ? F.responseURL : A.headers.get("X-Request-URL");
            var _ = "response" in F ? F.response : F.responseText;
            setTimeout(function() {
              M(new K(_, A));
            }, 0);
          }, F.onerror = function() {
            setTimeout(function() {
              B(new TypeError("Network request failed"));
            }, 0);
          }, F.ontimeout = function() {
            setTimeout(function() {
              B(new TypeError("Network request timed out"));
            }, 0);
          }, F.onabort = function() {
            setTimeout(function() {
              B(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function ut(A) {
            try {
              return A === "" && n.location.href ? n.location.href : A;
            } catch {
              return A;
            }
          }
          if (F.open(J.method, ut(J.url), !0), J.credentials === "include" ? F.withCredentials = !0 : J.credentials === "omit" && (F.withCredentials = !1), "responseType" in F && (r.blob ? F.responseType = "blob" : r.arrayBuffer && (F.responseType = "arraybuffer")), T && typeof T.headers == "object" && !(T.headers instanceof h || n.Headers && T.headers instanceof n.Headers)) {
            var Yt = [];
            Object.getOwnPropertyNames(T.headers).forEach(function(A) {
              Yt.push(a(A)), F.setRequestHeader(A, c(T.headers[A]));
            }), J.headers.forEach(function(A, _) {
              Yt.indexOf(_) === -1 && F.setRequestHeader(_, A);
            });
          } else
            J.headers.forEach(function(A, _) {
              F.setRequestHeader(_, A);
            });
          J.signal && (J.signal.addEventListener("abort", Pt), F.onreadystatechange = function() {
            F.readyState === 4 && J.signal.removeEventListener("abort", Pt);
          }), F.send(typeof J._bodyInit > "u" ? null : J._bodyInit);
        });
      }
      return q.polyfill = !0, n.fetch || (n.fetch = q, n.Headers = h, n.Request = k, n.Response = K), e.Headers = h, e.Request = k, e.Response = K, e.fetch = q, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : ze);
})();
const Wy = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Yy(t, e) {
  const n = {};
  return Object.assign(n, Wy, e), await fetch(t, n);
}
function Zy(t) {
  let e = Yy, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Qy(...t) {
  const { fetchLib: e, middlewares: n } = Zy(t);
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
var di;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(di || (di = {}));
var ys;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ys || (ys = {}));
var vf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(vf || (vf = {}));
const Jy = "https://api.mainnet.hiro.so", tw = "https://api.testnet.hiro.so", ew = "http://localhost:3999", nw = ["mainnet", "testnet", "devnet", "mocknet"];
let hi = class {
  constructor(e) {
    this.version = ys.Mainnet, this.chainId = di.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === ys.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, i) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${i}?proof=0`, this.getMapEntryUrl = (n, r, i) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${i}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Qy();
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
hi.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Jc();
    case "testnet":
      return new rw();
    case "devnet":
      return new sw();
    case "mocknet":
      return new e0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${nw.join(", ")}`);
  }
};
hi.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : hi.fromName(t);
let Jc = class extends hi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Jy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ys.Mainnet, this.chainId = di.Mainnet;
  }
}, rw = class extends hi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? tw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ys.Testnet, this.chainId = di.Testnet;
  }
}, e0 = class extends hi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ew,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ys.Testnet, this.chainId = di.Testnet;
  }
};
const sw = e0, n0 = "xtrata.wallet.bridge.v1", iw = (t) => typeof t == "object" && t !== null && t.protocol === n0, ow = (t) => iw(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", aw = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class Ki extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const $f = 12e4;
class cw {
  constructor(e) {
    Gi(this, "pending", /* @__PURE__ */ new Map());
    Gi(this, "listenTarget");
    Gi(this, "closed", !1);
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
    Gi(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !ow(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new Ki("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new Ki("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Ki("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const i = aw(), s = { protocol: n0, kind: "request", id: i, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(i), a(
          new Ki(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? $f}ms.`
          )
        );
      }, this.options.timeoutMs ?? $f);
      this.pending.set(i, { resolve: o, reject: a, timer: c }), r.postMessage(s, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new Ki("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const lw = ["SP", "SM"], uw = ["ST", "SN"], fw = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return lw.includes(n) ? "mainnet" : uw.includes(n) ? "testnet" : null;
}, dw = () => {
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
}, hw = () => typeof window > "u" || !window.localStorage ? dw() : window.localStorage, Ec = "xtrata.v15.1.wallet.session", If = "mainnet", ha = { isConnected: !1 }, pw = (t) => t.address ? fw(t.address) ?? t.network : t.network, r0 = (t) => !t.isConnected || !t.address ? { ...ha } : pw(t) !== If ? { ...ha } : {
  isConnected: !0,
  address: t.address,
  network: If,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, gw = (t) => {
  if (!t)
    return { ...ha };
  try {
    const e = JSON.parse(t);
    return r0(e);
  } catch {
    return { ...ha };
  }
}, yw = (t) => {
  const e = r0(t);
  return JSON.stringify(e);
}, ww = (t) => {
  const e = hw();
  return {
    load: () => gw(e.getItem(Ec)),
    save: (n) => {
      e.setItem(Ec, yw(n));
    },
    clear: () => {
      e.removeItem(Ec);
    }
  };
}, bw = "https://browser.blockstack.org/auth", mw = {
  "@type": "Person",
  "@context": "http://schema.org"
}, s0 = ["store_write"], xw = "blockstack-session", Sw = {
  logLevel: "debug"
}, _s = {
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
Object.freeze(_s);
class Ti extends Error {
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
class Ew extends Ti {
  constructor(e, n = "") {
    super({ code: _s.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class kf extends Ti {
  constructor(e = "") {
    super({ code: _s.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Co extends Ti {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: _s.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Lf extends Ti {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: _s.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class tl extends Ti {
  constructor(e) {
    super({ code: _s.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class i0 extends Ti {
  constructor(e) {
    super({ code: _s.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Cf = ["debug", "info", "warn", "error", "none"], el = {};
for (let t = 0; t < Cf.length; t++) {
  const e = Cf[t];
  el[e] = t;
}
class ii {
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
    return el[Sw.logLevel] <= el[e];
  }
}
function Aw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function vw() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Ac(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((i) => parseInt(i, 10)), r = e.split(".").map((i) => parseInt(i, 10));
  for (let i = 0; i < e.length; i++)
    if (i >= t.length && r.push(0), n[i] < r[i])
      return !1;
  return !0;
}
function $w() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Iw() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function kw(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function iu(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let i;
  try {
    if (i = Iw(), i) {
      const s = i[t];
      if (s)
        return s;
    }
  } catch (s) {
    ii.error(`Error getting object '${t}' from global scope '${i}': ${s}`);
  }
  if (e) {
    const s = kw(i, t.toString(), n);
    throw ii.error(s), new Error(s);
  }
  if (r)
    return {};
}
function Xr(t, e) {
  return ou(Ue(t), e);
}
function Ue(t) {
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
  if (Je(t, Uint8Array))
    return BigInt(`0x${it(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Lw(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Tf(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function wo(t, e = 8) {
  return (typeof t == "bigint" ? t : Ue(t)).toString(16).padStart(e * 2, "0");
}
function za(t) {
  return parseInt(t, 16);
}
function ou(t, e = 16) {
  const n = wo(t, e);
  return _t(n);
}
function Cw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Tw(t, e) {
  return t & BigInt(1) << e;
}
function nl(t) {
  return Bw(BigInt(`0x${it(t)}`), BigInt(t.byteLength * 8));
}
function Bw(t, e) {
  return Tw(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Mw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function it(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Mw[n];
  return e;
}
function _t(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Lw(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, i = t.slice(r, r + 2), s = Number.parseInt(i, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    e[n] = s;
  }
  return e;
}
function Ps(t) {
  return new TextEncoder().encode(t);
}
function bo(t) {
  return new TextDecoder().decode(t);
}
function Nw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function _w(t) {
  return String.fromCharCode.apply(null, t);
}
function Pw(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Bf(t) {
  if (t.some(Pw))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Wn(...t) {
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
function he(t) {
  return Wn(...t.map((e) => typeof e == "number" ? Bf([e]) : e instanceof Array ? Bf(e) : e));
}
function Je(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const o0 = "https://api.mainnet.hiro.so", a0 = "https://api.testnet.hiro.so", c0 = "http://localhost:3999", Uw = "https://hub.blockstack.org", Hw = 33, vc = 32;
function Ow(t) {
  if (t.length < vc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + vc * 2), r = t.slice(2 + vc * 2);
  return {
    recoveryId: za(e),
    r: n,
    s: r
  };
}
function au(t) {
  const e = typeof t == "string" ? _t(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Dw(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Fw(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function jw(t, e) {
  return t[e];
}
function zw(t, e, n = 0) {
  return t[n] = e, t;
}
function Rw(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function ws(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Gw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Kw(t, e) {
  const n = {};
  return Object.assign(n, Gw, e), await fetch(t, n);
}
function Vw(t) {
  let e = Kw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function qw(...t) {
  const { fetchLib: e, middlewares: n } = Vw(t);
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
class l0 {
  constructor(e = s0.slice(), n = ((a) => (a = iu("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", i = "/manifest.json", s = void 0, o = bw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = i, this.coreNode = s, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function rl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Xw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function u0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Ww(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  rl(t.outputLen), rl(t.blockLen);
}
function Yw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Zw(t, e) {
  u0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const is = {
  number: rl,
  bool: Xw,
  bytes: u0,
  hash: Ww,
  exists: Yw,
  output: Zw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const $c = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Hn = (t, e) => t << 32 - e | t >>> e, Qw = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Qw)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Jw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function cu(t) {
  if (typeof t == "string" && (t = Jw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let f0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Us(t) {
  const e = (r) => t().update(cu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let d0 = class extends f0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, is.hash(e);
    const r = cu(n);
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
    return is.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    is.exists(this), is.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Ra = (t, e, n) => new d0(t, e).update(n).digest();
Ra.create = (t, e) => new d0(t, e);
function tb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let lu = class extends f0 {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = $c(this.buffer);
  }
  update(e) {
    is.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = cu(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = $c(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    is.exists(this), is.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    tb(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = $c(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      a.setUint32(4 * l, h[l], s);
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
const eb = (t, e, n) => t & e ^ ~t & n, nb = (t, e, n) => t & e ^ t & n ^ e & n, rb = new Uint32Array([
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
]), wr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), br = new Uint32Array(64);
let h0 = class extends lu {
  constructor() {
    super(64, 32, 8, !1), this.A = wr[0] | 0, this.B = wr[1] | 0, this.C = wr[2] | 0, this.D = wr[3] | 0, this.E = wr[4] | 0, this.F = wr[5] | 0, this.G = wr[6] | 0, this.H = wr[7] | 0;
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
      br[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = br[l - 15], p = br[l - 2], S = Hn(b, 7) ^ Hn(b, 18) ^ b >>> 3, x = Hn(p, 17) ^ Hn(p, 19) ^ p >>> 10;
      br[l] = x + br[l - 7] + S + br[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: f, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const b = Hn(a, 6) ^ Hn(a, 11) ^ Hn(a, 25), p = h + b + eb(a, c, f) + rb[l] + br[l] | 0, x = (Hn(r, 2) ^ Hn(r, 13) ^ Hn(r, 22)) + nb(r, i, s) | 0;
      h = f, f = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, i, s, o, a, c, f, h);
  }
  roundClean() {
    br.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, sb = class extends h0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const pi = Us(() => new h0());
Us(() => new sb());
const ib = {}, p0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ib
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Nt = BigInt(0), ne = BigInt(1), Rr = BigInt(2), Qi = BigInt(3), Mf = BigInt(8), zt = Object.freeze({
  a: Nt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: ne,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Nf = (t, e) => (t + e / Rr) / e, To = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = zt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -ne * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), i = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), s = n, o = BigInt("0x100000000000000000000000000000000"), a = Nf(s * t, e), c = Nf(-r * t, e);
    let f = X(t - a * n - c * i, e), h = X(-a * r - c * s, e);
    const l = f > o, b = h > o;
    if (l && (f = e - f), b && (h = e - h), f > o || h > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: f, k2neg: b, k2: h };
  }
}, Bn = 32, bs = 32, g0 = 32, pa = Bn + 1, ga = 2 * Bn + 1;
function _f(t) {
  const { a: e, b: n } = zt, r = X(t * t), i = X(r * t);
  return X(i + e * t + n);
}
const Bo = zt.a === Nt;
class uu extends Error {
  constructor(e) {
    super(e);
  }
}
function Pf(t) {
  if (!(t instanceof Ut))
    throw new TypeError("JacobianPoint expected");
}
class Ut {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof St))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(St.ZERO) ? Ut.ZERO : new Ut(e.x, e.y, ne);
  }
  static toAffineBatch(e) {
    const n = ub(e.map((r) => r.z));
    return e.map((r, i) => r.toAffine(n[i]));
  }
  static normalizeZ(e) {
    return Ut.toAffineBatch(e).map(Ut.fromAffine);
  }
  equals(e) {
    Pf(e);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = e, c = X(i * i), f = X(a * a), h = X(n * f), l = X(s * c), b = X(X(r * a) * f), p = X(X(o * i) * c);
    return h === l && b === p;
  }
  negate() {
    return new Ut(this.x, X(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, i = X(e * e), s = X(n * n), o = X(s * s), a = e + s, c = X(Rr * (X(a * a) - i - o)), f = X(Qi * i), h = X(f * f), l = X(h - Rr * c), b = X(f * (c - l) - Mf * o), p = X(Rr * n * r);
    return new Ut(l, b, p);
  }
  add(e) {
    Pf(e);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = e;
    if (s === Nt || o === Nt)
      return this;
    if (n === Nt || r === Nt)
      return e;
    const c = X(i * i), f = X(a * a), h = X(n * f), l = X(s * c), b = X(X(r * a) * f), p = X(X(o * i) * c), S = X(l - h), x = X(p - b);
    if (S === Nt)
      return x === Nt ? this.double() : Ut.ZERO;
    const C = X(S * S), D = X(S * C), H = X(h * C), g = X(x * x - D - Rr * H), k = X(x * (H - g) - b * D), I = X(i * a * S);
    return new Ut(g, k, I);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Ut.ZERO;
    if (typeof e == "bigint" && e === Nt)
      return n;
    let r = Of(e);
    if (r === ne)
      return this;
    if (!Bo) {
      let l = n, b = this;
      for (; r > Nt; )
        r & ne && (l = l.add(b)), b = b.double(), r >>= ne;
      return l;
    }
    let { k1neg: i, k1: s, k2neg: o, k2: a } = To.splitScalar(r), c = n, f = n, h = this;
    for (; s > Nt || a > Nt; )
      s & ne && (c = c.add(h)), a & ne && (f = f.add(h)), h = h.double(), s >>= ne, a >>= ne;
    return i && (c = c.negate()), o && (f = f.negate()), f = new Ut(X(f.x * To.beta), f.y, f.z), c.add(f);
  }
  precomputeWindow(e) {
    const n = Bo ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(Ut.BASE) && (n = St.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let i = n && sl.get(n);
    i || (i = this.precomputeWindow(r), n && r !== 1 && (i = Ut.normalizeZ(i), sl.set(n, i)));
    let s = Ut.ZERO, o = Ut.BASE;
    const a = 1 + (Bo ? 128 / r : 256 / r), c = 2 ** (r - 1), f = BigInt(2 ** r - 1), h = 2 ** r, l = BigInt(r);
    for (let b = 0; b < a; b++) {
      const p = b * c;
      let S = Number(e & f);
      e >>= l, S > c && (S -= h, e += ne);
      const x = p, C = p + Math.abs(S) - 1, D = b % 2 !== 0, H = S < 0;
      S === 0 ? o = o.add(Mo(D, i[x])) : s = s.add(Mo(H, i[C]));
    }
    return { p: s, f: o };
  }
  multiply(e, n) {
    let r = Of(e), i, s;
    if (Bo) {
      const { k1neg: o, k1: a, k2neg: c, k2: f } = To.splitScalar(r);
      let { p: h, f: l } = this.wNAF(a, n), { p: b, f: p } = this.wNAF(f, n);
      h = Mo(o, h), b = Mo(c, b), b = new Ut(X(b.x * To.beta), b.y, b.z), i = h.add(b), s = l.add(p);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      i = o, s = a;
    }
    return Ut.normalizeZ([i, s])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: i } = this, s = this.equals(Ut.ZERO);
    e == null && (e = s ? Mf : Bi(i));
    const o = e, a = X(o * o), c = X(a * o), f = X(n * a), h = X(r * c), l = X(i * o);
    if (s)
      return St.ZERO;
    if (l !== ne)
      throw new Error("invZ was invalid");
    return new St(f, h);
  }
}
Ut.BASE = new Ut(zt.Gx, zt.Gy, ne);
Ut.ZERO = new Ut(Nt, ne, Nt);
function Mo(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const sl = /* @__PURE__ */ new WeakMap();
class St {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, sl.delete(this);
  }
  hasEvenY() {
    return this.y % Rr === Nt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = un(n ? e : e.subarray(1));
    if (!ia(r))
      throw new Error("Point is not on curve");
    const i = _f(r);
    let s = lb(i);
    const o = (s & ne) === ne;
    n ? o && (s = X(-s)) : (e[0] & 1) === 1 !== o && (s = X(-s));
    const a = new St(r, s);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = un(e.subarray(1, Bn + 1)), r = un(e.subarray(Bn + 1, Bn * 2 + 1)), i = new St(n, r);
    return i.assertValidity(), i;
  }
  static fromHex(e) {
    const n = Yn(e), r = n.length, i = n[0];
    if (r === Bn)
      return this.fromCompressedHex(n);
    if (r === pa && (i === 2 || i === 3))
      return this.fromCompressedHex(n);
    if (r === ga && i === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${pa} compressed bytes or ${ga} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return St.BASE.multiply(ms(e));
  }
  static fromSignature(e, n, r) {
    const { r: i, s } = b0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = fu(Yn(e)), { n: a } = zt, c = r === 2 || r === 3 ? i + a : i, f = Bi(c, a), h = X(-o * f, a), l = X(s * f, a), b = r & 1 ? "03" : "02", p = St.fromHex(b + Gr(c)), S = St.BASE.multiplyAndAddUnsafe(p, h, l);
    if (!S)
      throw new Error("Cannot recover signature: point at infinify");
    return S.assertValidity(), S;
  }
  toRawBytes(e = !1) {
    return Kr(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Gr(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Gr(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!ia(n) || !ia(r))
      throw new Error(e);
    const i = X(r * r), s = _f(n);
    if (X(i - s) !== Nt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new St(this.x, X(-this.y));
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
    const i = Ut.fromAffine(this), s = n === Nt || n === ne || this !== St.BASE ? i.multiplyUnsafe(n) : i.multiply(n), o = Ut.fromAffine(e).multiplyUnsafe(r), a = s.add(o);
    return a.equals(Ut.ZERO) ? void 0 : a.toAffine();
  }
}
St.BASE = new St(zt.Gx, zt.Gy);
St.ZERO = new St(Nt, Nt);
function Uf(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Hf(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${gi(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: un(n), left: t.subarray(e + 2) };
}
function ob(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${gi(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Hf(t.subarray(2)), { data: r, left: i } = Hf(n);
  if (i.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${gi(i)}`);
  return { r: e, s: r };
}
class ln {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const i = n ? gi(e) : e;
    if (i.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new ln(ya(i.slice(0, 64)), ya(i.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s: i } = ob(n ? e : Kr(e));
    return new ln(r, i);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!wi(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!wi(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = zt.n >> ne;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new ln(this.r, X(-this.s, zt.n)) : this;
  }
  toDERRawBytes() {
    return Kr(this.toDERHex());
  }
  toDERHex() {
    const e = Uf(Vi(this.s)), n = Uf(Vi(this.r)), r = e.length / 2, i = n.length / 2, s = Vi(r), o = Vi(i);
    return `30${Vi(i + r + 4)}02${o}${n}02${s}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Kr(this.toCompactHex());
  }
  toCompactHex() {
    return Gr(this.r) + Gr(this.s);
  }
}
function jr(...t) {
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
const ab = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function gi(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += ab[t[n]];
  return e;
}
const cb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Gr(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Nt <= t && t < cb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function yi(t) {
  const e = Kr(Gr(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Vi(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function ya(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Kr(t) {
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
function un(t) {
  return ya(gi(t));
}
function Yn(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Kr(t);
}
function Of(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && wi(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function X(t, e = zt.P) {
  const n = t % e;
  return n >= Nt ? n : e + n;
}
function yn(t, e) {
  const { P: n } = zt;
  let r = t;
  for (; e-- > Nt; )
    r *= r, r %= n;
  return r;
}
function lb(t) {
  const { P: e } = zt, n = BigInt(6), r = BigInt(11), i = BigInt(22), s = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, f = c * c * t % e, h = yn(f, Qi) * f % e, l = yn(h, Qi) * f % e, b = yn(l, Rr) * c % e, p = yn(b, r) * b % e, S = yn(p, i) * p % e, x = yn(S, o) * S % e, C = yn(x, a) * x % e, D = yn(C, o) * S % e, H = yn(D, Qi) * f % e, g = yn(H, s) * p % e, k = yn(g, n) * c % e, I = yn(k, Rr);
  if (I * I % e !== t)
    throw new Error("Cannot find square root");
  return I;
}
function Bi(t, e = zt.P) {
  if (t === Nt || e <= Nt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = X(t, e), r = e, i = Nt, s = ne;
  for (; n !== Nt; ) {
    const a = r / n, c = r % n, f = i - s * a;
    r = n, n = c, i = s, s = f;
  }
  if (r !== ne)
    throw new Error("invert: does not exist");
  return X(i, e);
}
function ub(t, e = zt.P) {
  const n = new Array(t.length), r = t.reduce((s, o, a) => o === Nt ? s : (n[a] = s, X(s * o, e)), ne), i = Bi(r, e);
  return t.reduceRight((s, o, a) => o === Nt ? s : (n[a] = X(s * n[a], e), X(s * o, e)), i), n;
}
function fb(t) {
  const e = t.length * 8 - bs * 8, n = un(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function fu(t, e = !1) {
  const n = fb(t);
  if (e)
    return n;
  const { n: r } = zt;
  return n >= r ? n - r : n;
}
let ui, Ji;
class y0 {
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
    return Ji(this.k, ...e);
  }
  checkSync() {
    if (typeof Ji != "function")
      throw new uu("hmacSha256Sync needs to be set");
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
    return jr(...n);
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
    return jr(...n);
  }
}
function wi(t) {
  return Nt < t && t < zt.n;
}
function ia(t) {
  return Nt < t && t < zt.P;
}
function w0(t, e, n, r = !0) {
  const { n: i } = zt, s = fu(t, !0);
  if (!wi(s))
    return;
  const o = Bi(s, i), a = St.BASE.multiply(s), c = X(a.x, i);
  if (c === Nt)
    return;
  const f = X(o * X(e + n * c, i), i);
  if (f === Nt)
    return;
  let h = new ln(c, f), l = (a.x === h.r ? 0 : 2) | Number(a.y & ne);
  return r && h.hasHighS() && (h = h.normalizeS(), l ^= 1), { sig: h, recovery: l };
}
function ms(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * bs)
      throw new Error("Expected 32 bytes of private key");
    e = ya(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== bs)
      throw new Error("Expected 32 bytes of private key");
    e = un(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!wi(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function du(t) {
  return t instanceof St ? (t.assertValidity(), t) : St.fromHex(t);
}
function b0(t) {
  if (t instanceof ln)
    return t.assertValidity(), t;
  try {
    return ln.fromDER(t);
  } catch {
    return ln.fromCompact(t);
  }
}
function mo(t, e = !1) {
  return St.fromPrivateKey(t).toRawBytes(e);
}
function db(t, e, n, r = !1) {
  return St.fromSignature(t, e, n).toRawBytes(r);
}
function Df(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === pa || r === ga : n ? r === pa * 2 || r === ga * 2 : t instanceof St;
}
function hu(t, e, n = !1) {
  if (Df(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Df(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = du(e);
  return r.assertValidity(), r.multiply(ms(t)).toRawBytes(n);
}
function m0(t) {
  const e = t.length > Bn ? t.slice(0, Bn) : t;
  return un(e);
}
function hb(t) {
  const e = m0(t), n = X(e, zt.n);
  return x0(n < Nt ? e : n);
}
function x0(t) {
  return yi(t);
}
function S0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Yn(t), i = ms(e), s = [x0(i), hb(r)];
  if (n != null) {
    n === !0 && (n = fe.randomBytes(Bn));
    const c = Yn(n);
    if (c.length !== Bn)
      throw new Error(`sign: Expected ${Bn} bytes of extra data`);
    s.push(c);
  }
  const o = jr(...s), a = m0(r);
  return { seed: o, m: a, d: i };
}
function E0(t, e) {
  const { sig: n, recovery: r } = t, { der: i, recovered: s } = Object.assign({ canonical: !0, der: !0 }, e), o = i ? n.toDERRawBytes() : n.toCompactRawBytes();
  return s ? [o, r] : o;
}
async function pb(t, e, n = {}) {
  const { seed: r, m: i, d: s } = S0(t, e, n.extraEntropy), o = new y0(g0, bs);
  await o.reseed(r);
  let a;
  for (; !(a = w0(await o.generate(), i, s, n.canonical)); )
    await o.reseed();
  return E0(a, n);
}
function Ga(t, e, n = {}) {
  const { seed: r, m: i, d: s } = S0(t, e, n.extraEntropy), o = new y0(g0, bs);
  o.reseedSync(r);
  let a;
  for (; !(a = w0(o.generateSync(), i, s, n.canonical)); )
    o.reseedSync();
  return E0(a, n);
}
const gb = { strict: !0 };
function yb(t, e, n, r = gb) {
  let i;
  try {
    i = b0(t), e = Yn(e);
  } catch {
    return !1;
  }
  const { r: s, s: o } = i;
  if (r.strict && i.hasHighS())
    return !1;
  const a = fu(e);
  let c;
  try {
    c = du(n);
  } catch {
    return !1;
  }
  const { n: f } = zt, h = Bi(o, f), l = X(a * h, f), b = X(s * h, f), p = St.BASE.multiplyAndAddUnsafe(c, l, b);
  return p ? X(p.x, f) === s : !1;
}
function wa(t) {
  return X(un(t), zt.n);
}
class bi {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Yn(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = un(n.subarray(0, 32)), i = un(n.subarray(32, 64));
    return new bi(r, i);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ia(e) || !wi(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Gr(this.r) + Gr(this.s);
  }
  toRawBytes() {
    return Kr(this.toHex());
  }
}
function wb(t) {
  return St.fromPrivateKey(t).toRawX();
}
class A0 {
  constructor(e, n, r = fe.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Yn(e);
    const { x: i, scalar: s } = this.getScalar(ms(n));
    if (this.px = i, this.d = s, this.rand = Yn(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = St.fromPrivateKey(e), r = n.hasEvenY() ? e : zt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return yi(e ^ un(n));
  }
  finalizeNonce(e) {
    const n = X(un(e), zt.n);
    if (n === Nt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: i, scalar: s } = this.getScalar(n);
    return { R: r, rx: i, k: s };
  }
  finalizeSig(e, n, r, i) {
    return new bi(e.x, X(n + r * i, zt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: i } = this, s = fe.taggedHash, o = this.initNonce(n, await s(Fr.aux, i)), { R: a, rx: c, k: f } = this.finalizeNonce(await s(Fr.nonce, o, r, e)), h = wa(await s(Fr.challenge, c, r, e)), l = this.finalizeSig(a, f, h, n);
    return await I0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: i } = this, s = fe.taggedHashSync, o = this.initNonce(n, s(Fr.aux, i)), { R: a, rx: c, k: f } = this.finalizeNonce(s(Fr.nonce, o, r, e)), h = wa(s(Fr.challenge, c, r, e)), l = this.finalizeSig(a, f, h, n);
    return k0(l, e, r) || this.error(), l;
  }
}
async function bb(t, e, n) {
  return new A0(t, e, n).calc();
}
function mb(t, e, n) {
  return new A0(t, e, n).calcSync();
}
function v0(t, e, n) {
  const r = t instanceof bi, i = r ? t : bi.fromHex(t);
  return r && i.assertValidity(), {
    ...i,
    m: Yn(e),
    P: du(n)
  };
}
function $0(t, e, n, r) {
  const i = St.BASE.multiplyAndAddUnsafe(e, ms(n), X(-r, zt.n));
  return !(!i || !i.hasEvenY() || i.x !== t);
}
async function I0(t, e, n) {
  try {
    const { r, s: i, m: s, P: o } = v0(t, e, n), a = wa(await fe.taggedHash(Fr.challenge, yi(r), o.toRawX(), s));
    return $0(r, o, i, a);
  } catch {
    return !1;
  }
}
function k0(t, e, n) {
  try {
    const { r, s: i, m: s, P: o } = v0(t, e, n), a = wa(fe.taggedHashSync(Fr.challenge, yi(r), o.toRawX(), s));
    return $0(r, o, i, a);
  } catch (r) {
    if (r instanceof uu)
      throw r;
    return !1;
  }
}
const xb = {
  Signature: bi,
  getPublicKey: wb,
  sign: bb,
  verify: I0,
  signSync: mb,
  verifySync: k0
};
St.BASE._setWindowSize(8);
const nn = {
  node: p0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Fr = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, No = {}, fe = {
  bytesToHex: gi,
  hexToBytes: Kr,
  concatBytes: jr,
  mod: X,
  invert: Bi,
  isValidPrivateKey(t) {
    try {
      return ms(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: yi,
  _normalizePrivateKey: ms,
  hashToPrivateKey: (t) => {
    t = Yn(t);
    const e = bs + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = X(un(t), zt.n - ne) + ne;
    return yi(n);
  },
  randomBytes: (t = 32) => {
    if (nn.web)
      return nn.web.getRandomValues(new Uint8Array(t));
    if (nn.node) {
      const { randomBytes: e } = nn.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => fe.hashToPrivateKey(fe.randomBytes(bs + 8)),
  precompute(t = 8, e = St.BASE) {
    const n = e === St.BASE ? e : new St(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Qi), n;
  },
  sha256: async (...t) => {
    if (nn.web) {
      const e = await nn.web.subtle.digest("SHA-256", jr(...t));
      return new Uint8Array(e);
    } else if (nn.node) {
      const { createHash: e } = nn.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (nn.web) {
      const n = await nn.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = jr(...e), i = await nn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(i);
    } else if (nn.node) {
      const { createHmac: n } = nn.node, r = n("sha256", t);
      return e.forEach((i) => r.update(i)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = No[t];
    if (n === void 0) {
      const r = await fe.sha256(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      n = jr(r, r), No[t] = n;
    }
    return fe.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof ui != "function")
      throw new uu("sha256Sync is undefined, you need to set it");
    let n = No[t];
    if (n === void 0) {
      const r = ui(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      n = jr(r, r), No[t] = n;
    }
    return ui(n, ...e);
  },
  _JacobianPoint: Ut
};
Object.defineProperties(fe, {
  sha256Sync: {
    configurable: !1,
    get() {
      return ui;
    },
    set(t) {
      ui || (ui = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Ji;
    },
    set(t) {
      Ji || (Ji = t);
    }
  }
});
const Sb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: zt,
  Point: St,
  Signature: ln,
  getPublicKey: mo,
  getSharedSecret: hu,
  recoverPublicKey: db,
  schnorr: xb,
  sign: pb,
  signSync: Ga,
  utils: fe,
  verify: yb
}, Symbol.toStringTag, { value: "Module" }));
var xo = {};
xo.byteLength = Ib;
var Eb = xo.toByteArray = Lb, Ab = xo.fromByteArray = Bb, zn = [], bn = [], vb = typeof Uint8Array < "u" ? Uint8Array : Array, Ic = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Js = 0, $b = Ic.length; Js < $b; ++Js)
  zn[Js] = Ic[Js], bn[Ic.charCodeAt(Js)] = Js;
bn[45] = 62;
bn[95] = 63;
function L0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Ib(t) {
  var e = L0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function kb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Lb(t) {
  var e, n = L0(t), r = n[0], i = n[1], s = new vb(kb(t, r, i)), o = 0, a = i > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = bn[t.charCodeAt(c)] << 18 | bn[t.charCodeAt(c + 1)] << 12 | bn[t.charCodeAt(c + 2)] << 6 | bn[t.charCodeAt(c + 3)], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
  return i === 2 && (e = bn[t.charCodeAt(c)] << 2 | bn[t.charCodeAt(c + 1)] >> 4, s[o++] = e & 255), i === 1 && (e = bn[t.charCodeAt(c)] << 10 | bn[t.charCodeAt(c + 1)] << 4 | bn[t.charCodeAt(c + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
}
function Cb(t) {
  return zn[t >> 18 & 63] + zn[t >> 12 & 63] + zn[t >> 6 & 63] + zn[t & 63];
}
function Tb(t, e, n) {
  for (var r, i = [], s = e; s < n; s += 3)
    r = (t[s] << 16 & 16711680) + (t[s + 1] << 8 & 65280) + (t[s + 2] & 255), i.push(Cb(r));
  return i.join("");
}
function Bb(t) {
  for (var e, n = t.length, r = n % 3, i = [], s = 16383, o = 0, a = n - r; o < a; o += s)
    i.push(Tb(t, o, o + s > a ? a : o + s));
  return r === 1 ? (e = t[n - 1], i.push(
    zn[e >> 2] + zn[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], i.push(
    zn[e >> 10] + zn[e >> 4 & 63] + zn[e << 2 & 63] + "="
  )), i.join("");
}
function Mb() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Nb = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function _b() {
  if (Mb())
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
    throw new Error(Nb);
  }
}
class Pb {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, i) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createCipher(e, n, r), o = new Uint8Array(Wn(s.update(i), s.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, i) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createDecipher(e, n, r), o = new Uint8Array(Wn(s.update(i), s.final()));
    return Promise.resolve(o);
  }
}
class Ub {
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
async function C0() {
  const t = await _b();
  return t.name === "subtleCrypto" ? new Ub(t.lib) : new Pb(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Hb(t) {
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
  function h(p) {
    if (p instanceof Uint8Array || (ArrayBuffer.isView(p) ? p = new Uint8Array(p.buffer, p.byteOffset, p.byteLength) : Array.isArray(p) && (p = Uint8Array.from(p))), !(p instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (p.length === 0)
      return "";
    for (var S = 0, x = 0, C = 0, D = p.length; C !== D && p[C] === 0; )
      C++, S++;
    for (var H = (D - C) * f + 1 >>> 0, g = new Uint8Array(H); C !== D; ) {
      for (var k = p[C], I = 0, U = H - 1; (k !== 0 || I < x) && U !== -1; U--, I++)
        k += 256 * g[U] >>> 0, g[U] = k % o >>> 0, k = k / o >>> 0;
      if (k !== 0)
        throw new Error("Non-zero carry");
      x = I, C++;
    }
    for (var K = H - x; K !== H && g[K] === 0; )
      K++;
    for (var R = a.repeat(S); K < H; ++K)
      R += t.charAt(g[K]);
    return R;
  }
  function l(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var S = 0, x = 0, C = 0; p[S] === a; )
      x++, S++;
    for (var D = (p.length - S) * c + 1 >>> 0, H = new Uint8Array(D); p[S]; ) {
      var g = p.charCodeAt(S);
      if (g > 255)
        return;
      var k = e[g];
      if (k === 255)
        return;
      for (var I = 0, U = D - 1; (k !== 0 || I < C) && U !== -1; U--, I++)
        k += o * H[U] >>> 0, H[U] = k % 256 >>> 0, k = k / 256 >>> 0;
      if (k !== 0)
        throw new Error("Non-zero carry");
      C = I, S++;
    }
    for (var K = D - C; K !== D && H[K] === 0; )
      K++;
    for (var R = new Uint8Array(x + (D - K)), q = x; K !== D; )
      R[q++] = H[K++];
    return R;
  }
  function b(p) {
    var S = l(p);
    if (S)
      return S;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: h,
    decodeUnsafe: l,
    decode: b
  };
}
var T0 = Hb;
const Ob = T0, Db = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Fb = Ob(Db);
const jb = /* @__PURE__ */ t0(Fb), zb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), B0 = Uint8Array.from({ length: 16 }, (t, e) => e), Rb = B0.map((t) => (9 * t + 5) % 16);
let pu = [B0], gu = [Rb];
for (let t = 0; t < 4; t++)
  for (let e of [pu, gu])
    e.push(e[t].map((n) => zb[n]));
const M0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Gb = pu.map((t, e) => t.map((n) => M0[e][n])), Kb = gu.map((t, e) => t.map((n) => M0[e][n])), Vb = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), qb = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), _o = (t, e) => t << e | t >>> 32 - e;
function Ff(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Po = new Uint32Array(16);
let Xb = class extends lu {
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
    for (let p = 0; p < 16; p++, n += 4)
      Po[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, f = this.h3 | 0, h = f, l = this.h4 | 0, b = l;
    for (let p = 0; p < 5; p++) {
      const S = 4 - p, x = Vb[p], C = qb[p], D = pu[p], H = gu[p], g = Gb[p], k = Kb[p];
      for (let I = 0; I < 16; I++) {
        const U = _o(r + Ff(p, s, a, f) + Po[D[I]] + x, g[I]) + l | 0;
        r = l, l = f, f = _o(a, 10) | 0, a = s, s = U;
      }
      for (let I = 0; I < 16; I++) {
        const U = _o(i + Ff(S, o, c, h) + Po[H[I]] + C, k[I]) + b | 0;
        i = b, b = h, h = _o(c, 10) | 0, c = o, o = U;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + f + b | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Po.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Wb = Us(() => new Xb());
function Yb(t) {
  return Wb(t);
}
const Uo = BigInt(2 ** 32 - 1), il = BigInt(32);
function N0(t, e = !1) {
  return e ? { h: Number(t & Uo), l: Number(t >> il & Uo) } : { h: Number(t >> il & Uo) | 0, l: Number(t & Uo) | 0 };
}
function Zb(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = N0(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const Qb = (t, e) => BigInt(t >>> 0) << il | BigInt(e >>> 0), Jb = (t, e, n) => t >>> n, t1 = (t, e, n) => t << 32 - n | e >>> n, e1 = (t, e, n) => t >>> n | e << 32 - n, n1 = (t, e, n) => t << 32 - n | e >>> n, r1 = (t, e, n) => t << 64 - n | e >>> n - 32, s1 = (t, e, n) => t >>> n - 32 | e << 64 - n, i1 = (t, e) => e, o1 = (t, e) => t, a1 = (t, e, n) => t << n | e >>> 32 - n, c1 = (t, e, n) => e << n | t >>> 32 - n, l1 = (t, e, n) => e << n - 32 | t >>> 64 - n, u1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function f1(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const d1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), h1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, p1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), g1 = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, y1 = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), w1 = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, gt = {
  fromBig: N0,
  split: Zb,
  toBig: Qb,
  shrSH: Jb,
  shrSL: t1,
  rotrSH: e1,
  rotrSL: n1,
  rotrBH: r1,
  rotrBL: s1,
  rotr32H: i1,
  rotr32L: o1,
  rotlSH: a1,
  rotlSL: c1,
  rotlBH: l1,
  rotlBL: u1,
  add: f1,
  add3L: d1,
  add3H: h1,
  add4L: p1,
  add4H: g1,
  add5H: w1,
  add5L: y1
}, [b1, m1] = gt.split([
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
].map((t) => BigInt(t))), mr = new Uint32Array(80), xr = new Uint32Array(80);
let Ka = class extends lu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: f, El: h, Fh: l, Fl: b, Gh: p, Gl: S, Hh: x, Hl: C } = this;
    return [e, n, r, i, s, o, a, c, f, h, l, b, p, S, x, C];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, f, h, l, b, p, S, x, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = p | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let g = 0; g < 16; g++, n += 4)
      mr[g] = e.getUint32(n), xr[g] = e.getUint32(n += 4);
    for (let g = 16; g < 80; g++) {
      const k = mr[g - 15] | 0, I = xr[g - 15] | 0, U = gt.rotrSH(k, I, 1) ^ gt.rotrSH(k, I, 8) ^ gt.shrSH(k, I, 7), K = gt.rotrSL(k, I, 1) ^ gt.rotrSL(k, I, 8) ^ gt.shrSL(k, I, 7), R = mr[g - 2] | 0, q = xr[g - 2] | 0, E = gt.rotrSH(R, q, 19) ^ gt.rotrBH(R, q, 61) ^ gt.shrSH(R, q, 6), T = gt.rotrSL(R, q, 19) ^ gt.rotrBL(R, q, 61) ^ gt.shrSL(R, q, 6), M = gt.add4L(K, T, xr[g - 7], xr[g - 16]), B = gt.add4H(M, U, E, mr[g - 7], mr[g - 16]);
      mr[g] = B | 0, xr[g] = M | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: f, Dl: h, Eh: l, El: b, Fh: p, Fl: S, Gh: x, Gl: C, Hh: D, Hl: H } = this;
    for (let g = 0; g < 80; g++) {
      const k = gt.rotrSH(l, b, 14) ^ gt.rotrSH(l, b, 18) ^ gt.rotrBH(l, b, 41), I = gt.rotrSL(l, b, 14) ^ gt.rotrSL(l, b, 18) ^ gt.rotrBL(l, b, 41), U = l & p ^ ~l & x, K = b & S ^ ~b & C, R = gt.add5L(H, I, K, m1[g], xr[g]), q = gt.add5H(R, D, k, U, b1[g], mr[g]), E = R | 0, T = gt.rotrSH(r, i, 28) ^ gt.rotrBH(r, i, 34) ^ gt.rotrBH(r, i, 39), M = gt.rotrSL(r, i, 28) ^ gt.rotrBL(r, i, 34) ^ gt.rotrBL(r, i, 39), B = r & s ^ r & a ^ s & a, J = i & o ^ i & c ^ o & c;
      D = x | 0, H = C | 0, x = p | 0, C = S | 0, p = l | 0, S = b | 0, { h: l, l: b } = gt.add(f | 0, h | 0, q | 0, E | 0), f = a | 0, h = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const F = gt.add3L(E, M, J);
      r = gt.add3H(F, q, T, B), i = F | 0;
    }
    ({ h: r, l: i } = gt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = gt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = gt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: h } = gt.add(this.Dh | 0, this.Dl | 0, f | 0, h | 0), { h: l, l: b } = gt.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: p, l: S } = gt.add(this.Fh | 0, this.Fl | 0, p | 0, S | 0), { h: x, l: C } = gt.add(this.Gh | 0, this.Gl | 0, x | 0, C | 0), { h: D, l: H } = gt.add(this.Hh | 0, this.Hl | 0, D | 0, H | 0), this.set(r, i, s, o, a, c, f, h, l, b, p, S, x, C, D, H);
  }
  roundClean() {
    mr.fill(0), xr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, x1 = class extends Ka {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, S1 = class extends Ka {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, E1 = class extends Ka {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const A1 = Us(() => new Ka());
Us(() => new x1());
Us(() => new S1());
Us(() => new E1());
function _0(t) {
  return pi(t);
}
function v1(t) {
  return A1(t);
}
const $1 = 0;
fe.hmacSha256Sync = (t, ...e) => {
  const n = Ra.create(pi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function I1() {
  return it(fe.randomPrivateKey());
}
function k1(t) {
  const e = pi(pi(t));
  return jb.encode(Wn(t, e).slice(0, t.length + 4));
}
function L1(t, e) {
  return k1(Wn(new Uint8Array([t]), e.slice(0, 20)));
}
function P0(t, e = $1) {
  const n = typeof t == "string" ? _t(t) : t, r = Yb(_0(n));
  return L1(e, r);
}
function U0(t) {
  const e = au(t);
  return it(mo(e.slice(0, 32), !0));
}
fe.hmacSha256Sync = (t, ...e) => {
  const n = Ra.create(pi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var ba;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(ba || (ba = {}));
async function C1(t, e, n) {
  return await (await C0()).encrypt("aes-256-cbc", e, t, n);
}
async function T1(t, e, n) {
  return await (await C0()).decrypt("aes-256-cbc", e, t, n);
}
function H0(t, e) {
  return Ra(pi, t, e);
}
function B1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function O0(t) {
  const e = v1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function M1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function N1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: ba.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: ba.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !M1(t))
    return e;
  try {
    return St.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function _1(t, e, n, r) {
  const i = N1(t);
  if (!i.result)
    throw i;
  const s = fe.randomPrivateKey(), o = mo(s, !0);
  let a = hu(s, t, !0);
  a = a.slice(1);
  const c = O0(a), f = fe.randomBytes(16), h = await C1(f, c.encryptionKey, e), l = Wn(f, o, h), b = H0(c.hmacKey, l);
  let p;
  if (!r || r === "hex")
    p = it(h);
  else if (r === "base64")
    p = Ab(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const S = {
    iv: it(f),
    ephemeralPK: it(o),
    cipherText: p,
    mac: it(b),
    wasString: n
  };
  return r && r !== "hex" && (S.cipherTextEncoding = r), S;
}
async function D0(t, e) {
  if (!e.ephemeralPK)
    throw new Lf("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = hu(t, n, !0);
  r = r.slice(1);
  const i = O0(r), s = _t(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = _t(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Eb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = Wn(s, _t(n), o), c = H0(i.hmacKey, a), f = _t(e.mac);
  if (!B1(f, c))
    throw new Lf("Decryption failed: failure in MAC check");
  const h = await T1(s, i.encryptionKey, o);
  return e.wasString ? bo(h) : h;
}
function P1(t, e) {
  const n = typeof e == "string" ? Ps(e) : e, r = U0(t), i = _0(n), s = Ga(i, t);
  return {
    signature: it(s),
    publicKey: r
  };
}
async function U1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = U0(n.privateKey);
  }
  const i = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", s = typeof t == "string" ? Ps(t) : t, o = await _1(n.publicKey, s, i, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = P1(r, a), f = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(f);
  }
  return a;
}
function H1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return D0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Te = {}, mi = {}, De = {};
Object.defineProperty(De, "__esModule", { value: !0 });
De.decode = De.encode = De.unescape = De.escape = De.pad = void 0;
const F0 = xo;
function yu(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
De.pad = yu;
function j0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
De.escape = j0;
function z0(t) {
  return yu(t).replace(/-/g, "+").replace(/_/g, "/");
}
De.unescape = z0;
function O1(t) {
  return j0((0, F0.fromByteArray)(new TextEncoder().encode(t)));
}
De.encode = O1;
function D1(t) {
  return new TextDecoder().decode((0, F0.toByteArray)(yu(z0(t))));
}
De.decode = D1;
var Va = {}, qa = {}, R0 = {}, G0 = {}, Xa = {};
Object.defineProperty(Xa, "__esModule", { value: !0 });
Xa.crypto = void 0;
Xa.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = i, t.ahash = s, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = f, t.clean = h, t.createView = l, t.rotr = b, t.rotl = p, t.byteSwap = S, t.byteSwap32 = x, t.bytesToHex = H, t.hexToBytes = I, t.asyncLoop = K, t.utf8ToBytes = R, t.bytesToUtf8 = q, t.toBytes = E, t.kdfInputToBytes = T, t.concatBytes = M, t.checkOpts = B, t.createHasher = F, t.createOptHasher = Pt, t.createXOFer = ut, t.randomBytes = Yt;
  const e = Xa;
  function n(A) {
    return A instanceof Uint8Array || ArrayBuffer.isView(A) && A.constructor.name === "Uint8Array";
  }
  function r(A) {
    if (!Number.isSafeInteger(A) || A < 0)
      throw new Error("positive integer expected, got " + A);
  }
  function i(A, ..._) {
    if (!n(A))
      throw new Error("Uint8Array expected");
    if (_.length > 0 && !_.includes(A.length))
      throw new Error("Uint8Array expected of length " + _ + ", got length=" + A.length);
  }
  function s(A) {
    if (typeof A != "function" || typeof A.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(A.outputLen), r(A.blockLen);
  }
  function o(A, _ = !0) {
    if (A.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (_ && A.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(A, _) {
    i(A);
    const ft = _.outputLen;
    if (A.length < ft)
      throw new Error("digestInto() expects output buffer of length at least " + ft);
  }
  function c(A) {
    return new Uint8Array(A.buffer, A.byteOffset, A.byteLength);
  }
  function f(A) {
    return new Uint32Array(A.buffer, A.byteOffset, Math.floor(A.byteLength / 4));
  }
  function h(...A) {
    for (let _ = 0; _ < A.length; _++)
      A[_].fill(0);
  }
  function l(A) {
    return new DataView(A.buffer, A.byteOffset, A.byteLength);
  }
  function b(A, _) {
    return A << 32 - _ | A >>> _;
  }
  function p(A, _) {
    return A << _ | A >>> 32 - _ >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function S(A) {
    return A << 24 & 4278190080 | A << 8 & 16711680 | A >>> 8 & 65280 | A >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (A) => A : (A) => S(A), t.byteSwapIfBE = t.swap8IfBE;
  function x(A) {
    for (let _ = 0; _ < A.length; _++)
      A[_] = S(A[_]);
    return A;
  }
  t.swap32IfBE = t.isLE ? (A) => A : x;
  const C = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", D = /* @__PURE__ */ Array.from({ length: 256 }, (A, _) => _.toString(16).padStart(2, "0"));
  function H(A) {
    if (i(A), C)
      return A.toHex();
    let _ = "";
    for (let ft = 0; ft < A.length; ft++)
      _ += D[A[ft]];
    return _;
  }
  const g = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function k(A) {
    if (A >= g._0 && A <= g._9)
      return A - g._0;
    if (A >= g.A && A <= g.F)
      return A - (g.A - 10);
    if (A >= g.a && A <= g.f)
      return A - (g.a - 10);
  }
  function I(A) {
    if (typeof A != "string")
      throw new Error("hex string expected, got " + typeof A);
    if (C)
      return Uint8Array.fromHex(A);
    const _ = A.length, ft = _ / 2;
    if (_ % 2)
      throw new Error("hex string expected, got unpadded hex of length " + _);
    const $t = new Uint8Array(ft);
    for (let Et = 0, At = 0; Et < ft; Et++, At += 2) {
      const Jt = k(A.charCodeAt(At)), se = k(A.charCodeAt(At + 1));
      if (Jt === void 0 || se === void 0) {
        const Rt = A[At] + A[At + 1];
        throw new Error('hex string expected, got non-hex character "' + Rt + '" at index ' + At);
      }
      $t[Et] = Jt * 16 + se;
    }
    return $t;
  }
  const U = async () => {
  };
  t.nextTick = U;
  async function K(A, _, ft) {
    let $t = Date.now();
    for (let Et = 0; Et < A; Et++) {
      ft(Et);
      const At = Date.now() - $t;
      At >= 0 && At < _ || (await (0, t.nextTick)(), $t += At);
    }
  }
  function R(A) {
    if (typeof A != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(A));
  }
  function q(A) {
    return new TextDecoder().decode(A);
  }
  function E(A) {
    return typeof A == "string" && (A = R(A)), i(A), A;
  }
  function T(A) {
    return typeof A == "string" && (A = R(A)), i(A), A;
  }
  function M(...A) {
    let _ = 0;
    for (let $t = 0; $t < A.length; $t++) {
      const Et = A[$t];
      i(Et), _ += Et.length;
    }
    const ft = new Uint8Array(_);
    for (let $t = 0, Et = 0; $t < A.length; $t++) {
      const At = A[$t];
      ft.set(At, Et), Et += At.length;
    }
    return ft;
  }
  function B(A, _) {
    if (_ !== void 0 && {}.toString.call(_) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(A, _);
  }
  class J {
  }
  t.Hash = J;
  function F(A) {
    const _ = ($t) => A().update(E($t)).digest(), ft = A();
    return _.outputLen = ft.outputLen, _.blockLen = ft.blockLen, _.create = () => A(), _;
  }
  function Pt(A) {
    const _ = ($t, Et) => A(Et).update(E($t)).digest(), ft = A({});
    return _.outputLen = ft.outputLen, _.blockLen = ft.blockLen, _.create = ($t) => A($t), _;
  }
  function ut(A) {
    const _ = ($t, Et) => A(Et).update(E($t)).digest(), ft = A({});
    return _.outputLen = ft.outputLen, _.blockLen = ft.blockLen, _.create = ($t) => A($t), _;
  }
  t.wrapConstructor = F, t.wrapConstructorWithOpts = Pt, t.wrapXOFConstructorWithOpts = ut;
  function Yt(A = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(A));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(A));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(G0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = G0;
  class n extends e.Hash {
    constructor(s, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(s);
      const a = (0, e.toBytes)(o);
      if (this.iHash = s.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, f = new Uint8Array(c);
      f.set(a.length > c ? s.create().update(a).digest() : a);
      for (let h = 0; h < f.length; h++)
        f[h] ^= 54;
      this.iHash.update(f), this.oHash = s.create();
      for (let h = 0; h < f.length; h++)
        f[h] ^= 106;
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
      const { oHash: o, iHash: a, finished: c, destroyed: f, blockLen: h, outputLen: l } = this;
      return s = s, s.finished = c, s.destroyed = f, s.blockLen = h, s.outputLen = l, s.oHash = o._cloneInto(s.oHash), s.iHash = a._cloneInto(s.iHash), s;
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
})(R0);
const ti = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function K0(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function ol(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Hs(t, ...e) {
  if (!K0(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function F1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  ol(t.outputLen), ol(t.blockLen);
}
function al(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function V0(t, e) {
  Hs(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function j1(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function z1(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function ma(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function oa(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function $n(t, e) {
  return t << 32 - e | t >>> e;
}
function R1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const wu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function bu(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const q0 = wu ? (t) => t : (t) => bu(t), G1 = q0;
function X0(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = bu(t[e]);
  return t;
}
const K1 = wu ? (t) => t : X0, W0 = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", V1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Y0(t) {
  if (Hs(t), W0)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += V1[t[n]];
  return e;
}
const er = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function jf(t) {
  if (t >= er._0 && t <= er._9)
    return t - er._0;
  if (t >= er.A && t <= er.F)
    return t - (er.A - 10);
  if (t >= er.a && t <= er.f)
    return t - (er.a - 10);
}
function q1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (W0)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let i = 0, s = 0; i < n; i++, s += 2) {
    const o = jf(t.charCodeAt(s)), a = jf(t.charCodeAt(s + 1));
    if (o === void 0 || a === void 0) {
      const c = t[s] + t[s + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + s);
    }
    r[i] = o * 16 + a;
  }
  return r;
}
const Z0 = async () => {
};
async function X1(t, e, n) {
  let r = Date.now();
  for (let i = 0; i < t; i++) {
    n(i);
    const s = Date.now() - r;
    s >= 0 && s < e || (await Z0(), r += s);
  }
}
function mu(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function W1(t) {
  return new TextDecoder().decode(t);
}
function So(t) {
  return typeof t == "string" && (t = mu(t)), Hs(t), t;
}
function Y1(t) {
  return typeof t == "string" && (t = mu(t)), Hs(t), t;
}
function Z1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const i = t[r];
    Hs(i), e += i.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function Q1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let Q0 = class {
};
function Wa(t) {
  const e = (r) => t().update(So(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function J0(t) {
  const e = (r, i) => t(i).update(So(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function tp(t) {
  const e = (r, i) => t(i).update(So(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const J1 = Wa, tm = J0, em = tp;
function nm(t = 32) {
  if (ti && typeof ti.getRandomValues == "function")
    return ti.getRandomValues(new Uint8Array(t));
  if (ti && typeof ti.randomBytes == "function")
    return Uint8Array.from(ti.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const rm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Q0,
  abytes: Hs,
  aexists: al,
  ahash: F1,
  anumber: ol,
  aoutput: V0,
  asyncLoop: X1,
  byteSwap: bu,
  byteSwap32: X0,
  byteSwapIfBE: G1,
  bytesToHex: Y0,
  bytesToUtf8: W1,
  checkOpts: Q1,
  clean: ma,
  concatBytes: Z1,
  createHasher: Wa,
  createOptHasher: J0,
  createView: oa,
  createXOFer: tp,
  hexToBytes: q1,
  isBytes: K0,
  isLE: wu,
  kdfInputToBytes: Y1,
  nextTick: Z0,
  randomBytes: nm,
  rotl: R1,
  rotr: $n,
  swap32IfBE: K1,
  swap8IfBE: q0,
  toBytes: So,
  u32: z1,
  u8: j1,
  utf8ToBytes: mu,
  wrapConstructor: J1,
  wrapConstructorWithOpts: tm,
  wrapXOFConstructorWithOpts: em
}, Symbol.toStringTag, { value: "Module" }));
function sm(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
function im(t, e, n) {
  return t & e ^ ~t & n;
}
function om(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class am extends Q0 {
  constructor(e, n, r, i) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.buffer = new Uint8Array(e), this.view = oa(this.buffer);
  }
  update(e) {
    al(this), e = So(e), Hs(e);
    const { view: n, buffer: r, blockLen: i } = this, s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = oa(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    al(this), V0(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, ma(this.buffer.subarray(o)), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    sm(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = oa(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      a.setUint32(4 * l, h[l], s);
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
const Sr = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Er = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), cm = /* @__PURE__ */ Uint32Array.from([
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
]), Ar = /* @__PURE__ */ new Uint32Array(64);
let xu = class extends am {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Sr[0] | 0, this.B = Sr[1] | 0, this.C = Sr[2] | 0, this.D = Sr[3] | 0, this.E = Sr[4] | 0, this.F = Sr[5] | 0, this.G = Sr[6] | 0, this.H = Sr[7] | 0;
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
      Ar[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = Ar[l - 15], p = Ar[l - 2], S = $n(b, 7) ^ $n(b, 18) ^ b >>> 3, x = $n(p, 17) ^ $n(p, 19) ^ p >>> 10;
      Ar[l] = x + Ar[l - 7] + S + Ar[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: f, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const b = $n(a, 6) ^ $n(a, 11) ^ $n(a, 25), p = h + b + im(a, c, f) + cm[l] + Ar[l] | 0, x = ($n(r, 2) ^ $n(r, 13) ^ $n(r, 22)) + om(r, i, s) | 0;
      h = f, f = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, i, s, o, a, c, f, h);
  }
  roundClean() {
    ma(Ar);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), ma(this.buffer);
  }
}, ep = class extends xu {
  constructor() {
    super(28), this.A = Er[0] | 0, this.B = Er[1] | 0, this.C = Er[2] | 0, this.D = Er[3] | 0, this.E = Er[4] | 0, this.F = Er[5] | 0, this.G = Er[6] | 0, this.H = Er[7] | 0;
  }
};
const lm = /* @__PURE__ */ Wa(() => new xu()), um = /* @__PURE__ */ Wa(() => new ep()), fm = xu, np = lm, dm = ep, hm = um, pm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: dm,
  SHA256: fm,
  sha224: hm,
  sha256: np
}, Symbol.toStringTag, { value: "Module" })), Ya = /* @__PURE__ */ ja(pm), gm = /* @__PURE__ */ ja(Sb);
var xi = {};
Object.defineProperty(xi, "__esModule", { value: !0 });
xi.joseToDer = xi.derToJose = void 0;
const rp = xo, sp = De;
function kc(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const ym = {
  ES256: kc(256),
  ES384: kc(384),
  ES512: kc(521)
};
function ip(t) {
  const e = ym[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const xa = 128, op = 0, wm = 32, bm = 16, mm = 2, ap = bm | wm | op << 6, Sa = mm | op << 6;
function cp(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, rp.toByteArray)((0, sp.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function xm(t, e) {
  const n = cp(t), r = ip(e), i = r + 1, s = n.length;
  let o = 0;
  if (n[o++] !== ap)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (xa | 1) && (a = n[o++]), s - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${s - o}" remaining`);
  if (n[o++] !== Sa)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (s - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${s - o - 2}" available`);
  if (i < c)
    throw new Error(`"r" specified length of "${c}", max of "${i}" is acceptable`);
  const f = o;
  if (o += c, n[o++] !== Sa)
    throw new Error('Could not find expected "int" for "s"');
  const h = n[o++];
  if (s - o !== h)
    throw new Error(`"s" specified length of "${h}", expected "${s - o}"`);
  if (i < h)
    throw new Error(`"s" specified length of "${h}", max of "${i}" is acceptable`);
  const l = o;
  if (o += h, o !== s)
    throw new Error(`Expected to consume entire array, but "${s - o}" bytes remain`);
  const b = r - c, p = r - h, S = new Uint8Array(b + c + p + h);
  for (o = 0; o < b; ++o)
    S[o] = 0;
  S.set(n.subarray(f + Math.max(-b, 0), f + c), o), o = r;
  for (const x = o; o < x + p; ++o)
    S[o] = 0;
  return S.set(n.subarray(l + Math.max(-p, 0), l + h), o), (0, sp.escape)((0, rp.fromByteArray)(S));
}
xi.derToJose = xm;
function zf(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= xa && --r, r;
}
function Sm(t, e) {
  t = cp(t);
  const n = ip(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const i = zf(t, 0, n), s = zf(t, n, t.length), o = n - i, a = n - s, c = 2 + o + 1 + 1 + a, f = c < xa, h = new Uint8Array((f ? 2 : 3) + c);
  let l = 0;
  return h[l++] = ap, f ? h[l++] = c : (h[l++] = xa | 1, h[l++] = c & 255), h[l++] = Sa, h[l++] = o, i < 0 ? (h[l++] = 0, h.set(t.subarray(0, n), l), l += n) : (h.set(t.subarray(i, n), l), l += n - i), h[l++] = Sa, h[l++] = a, s < 0 ? (h[l++] = 0, h.set(t.subarray(n), l)) : h.set(t.subarray(n + s), l), h;
}
xi.joseToDer = Sm;
var lr = {};
Object.defineProperty(lr, "__esModule", { value: !0 });
lr.InvalidTokenError = lr.MissingParametersError = void 0;
class Em extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
lr.MissingParametersError = Em;
class Am extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
lr.InvalidTokenError = Am;
const Eo = /* @__PURE__ */ ja(rm);
Object.defineProperty(qa, "__esModule", { value: !0 });
qa.SECP256K1Client = void 0;
const vm = R0, $m = Ya, aa = gm, Rf = xi, Gf = lr, Kf = Eo;
aa.utils.hmacSha256Sync = (t, ...e) => {
  const n = vm.hmac.create($m.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class lp {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Kf.bytesToHex)(aa.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Gf.MissingParametersError("a signing input hash and private key are all required");
    const i = aa.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Kf.bytesToHex)(i);
    if (r === "jose")
      return (0, Rf.derToJose)(i, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Rf.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Gf.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return aa.verify(n, e, r, { strict: !1 });
  }
}
qa.SECP256K1Client = lp;
lp.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = qa;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Va);
var xs = {};
const Im = /* @__PURE__ */ ja(p0);
var km = ze && ze.__awaiter || function(t, e, n, r) {
  function i(s) {
    return s instanceof n ? s : new n(function(o) {
      o(s);
    });
  }
  return new (n || (n = Promise))(function(s, o) {
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
      h.done ? s(h.value) : i(h.value).then(a, c);
    }
    f((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(xs, "__esModule", { value: !0 });
xs.hashSha256Async = xs.hashSha256 = void 0;
const Lm = Ya;
function up(t) {
  return (0, Lm.sha256)(t);
}
xs.hashSha256 = up;
function Cm(t) {
  return km(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Im;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(up(t));
    }
  });
}
xs.hashSha256Async = Cm;
var Tm = ze && ze.__awaiter || function(t, e, n, r) {
  function i(s) {
    return s instanceof n ? s : new n(function(o) {
      o(s);
    });
  }
  return new (n || (n = Promise))(function(s, o) {
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
      h.done ? s(h.value) : i(h.value).then(a, c);
    }
    f((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(mi, "__esModule", { value: !0 });
mi.TokenSigner = mi.createUnsecuredToken = void 0;
const cl = De, Vf = Va, Bm = lr, qf = xs;
function ll(t, e) {
  const n = [], r = cl.encode(JSON.stringify(e));
  n.push(r);
  const i = cl.encode(JSON.stringify(t));
  return n.push(i), n.join(".");
}
function Mm(t) {
  return ll(t, { typ: "JWT", alg: "none" }) + ".";
}
mi.createUnsecuredToken = Mm;
class Nm {
  constructor(e, n) {
    if (!(e && n))
      throw new Bm.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Vf.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Vf.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const i = this.header(r), s = ll(e, i), o = (0, qf.hashSha256)(s);
    return this.createWithSignedHash(e, n, i, s, o);
  }
  signAsync(e, n = !1, r = {}) {
    return Tm(this, void 0, void 0, function* () {
      const i = this.header(r), s = ll(e, i), o = yield (0, qf.hashSha256Async)(s);
      return this.createWithSignedHash(e, n, i, s, o);
    });
  }
  createWithSignedHash(e, n, r, i, s) {
    const o = this.cryptoClient.signHash(s, this.rawPrivateKey);
    return n ? {
      header: [cl.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [i, o].join(".");
  }
}
mi.TokenSigner = Nm;
var Za = {};
Object.defineProperty(Za, "__esModule", { value: !0 });
Za.TokenVerifier = void 0;
const _m = De, Xf = Va, Pm = lr, Ho = xs;
class Um {
  constructor(e, n) {
    if (!(e && n))
      throw new Pm.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Xf.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Xf.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Ho.hashSha256Async)(i).then((o) => s(o));
    {
      const o = (0, Ho.hashSha256)(i);
      return s(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), _m.encode(e.payload)].join(".");
    let i = !0;
    const s = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (i = !1);
    }), i);
    if (n)
      return (0, Ho.hashSha256Async)(r).then((o) => s(o));
    {
      const o = (0, Ho.hashSha256)(r);
      return s(o);
    }
  }
}
Za.TokenVerifier = Um;
var Qa = {};
Object.defineProperty(Qa, "__esModule", { value: !0 });
Qa.decodeToken = void 0;
const Oo = De;
function Hm(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Oo.decode(e[0])), r = JSON.parse(Oo.decode(e[1])), i = e[2];
    return {
      header: n,
      payload: r,
      signature: i
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Oo.decode(e));
    const n = [];
    return t.header.map((r) => {
      const i = JSON.parse(Oo.decode(r));
      n.push(i);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Qa.decodeToken = Hm;
(function(t) {
  var e = ze && ze.__createBinding || (Object.create ? function(r, i, s, o) {
    o === void 0 && (o = s);
    var a = Object.getOwnPropertyDescriptor(i, s);
    (!a || ("get" in a ? !i.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return i[s];
    } }), Object.defineProperty(r, o, a);
  } : function(r, i, s, o) {
    o === void 0 && (o = s), r[o] = i[s];
  }), n = ze && ze.__exportStar || function(r, i) {
    for (var s in r) s !== "default" && !Object.prototype.hasOwnProperty.call(i, s) && e(i, r, s);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(mi, t), n(Za, t), n(Qa, t), n(lr, t), n(Va, t);
})(Te);
function Om(t) {
  return `did:btc-addr:${t}`;
}
function Dm(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new kf("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new kf('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function fp(t) {
  if (t)
    return Dm(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Fm = "1.4.0";
function jm() {
  return I1();
}
function zm(t, e, n, r = s0.slice(), i, s = Aw().getTime(), o = {}) {
  const a = (p) => {
    const S = iu("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return S == null ? void 0 : S.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), i || (i = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: $w(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(s / 1e3),
    iss: null,
    public_keys: [],
    domain_name: i,
    manifest_uri: n,
    redirect_uri: e,
    version: Fm,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), f = Te.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [f];
  const h = P0(f);
  return c.iss = Om(h), new Te.TokenSigner("ES256k", t).sign(c);
}
async function Wf(t, e) {
  const n = bo(_t(e)), r = JSON.parse(n), i = await D0(t, r);
  if (typeof i != "string")
    throw new Error("Unable to correctly decrypt private key");
  return i;
}
function Rm(t) {
  const e = Te.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Te.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function Gm(t) {
  const e = Te.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = fp(e.iss);
  if (n.length === 1) {
    if (P0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function Km(t) {
  const e = Te.decodeToken(t).payload;
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
function Vm(t) {
  const e = Te.decodeToken(t).payload;
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
function qm(t) {
  const e = [
    Vm(t),
    Km(t),
    Rm(t),
    Gm(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Yf = "1.0.0";
class Vr {
  constructor(e) {
    this.version = Yf, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Yf)
      throw new tl(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Vr(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class dp {
  constructor(e) {
    if (e) {
      const n = new Vr(e);
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
class Zf extends dp {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Vr({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new i0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Vr({})), !0;
  }
}
class Qf extends dp {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = xw, !localStorage.getItem(this.key)) {
      const r = new Vr({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new i0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Vr.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Vr({})), !0;
  }
}
var io;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(io || (io = {}));
var Ea;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ea || (Ea = {}));
io.Mainnet;
var ar;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ar || (ar = {}));
var Kn;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Kn || (Kn = {}));
ar.Mainnet;
const hp = {
  chainId: io.Mainnet,
  transactionVersion: ar.Mainnet,
  peerNetworkId: Ea.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Kn.MainnetSingleSig,
    multiSig: Kn.MainnetMultiSig
  },
  client: { baseUrl: o0 }
}, ul = {
  chainId: io.Testnet,
  transactionVersion: ar.Testnet,
  peerNetworkId: Ea.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Kn.TestnetSingleSig,
    multiSig: Kn.TestnetMultiSig
  },
  client: { baseUrl: a0 }
}, ca = {
  ...ul,
  addressVersion: { ...ul.addressVersion },
  magicBytes: "id",
  client: { baseUrl: c0 }
}, Xm = {
  ...ca,
  addressVersion: { ...ca.addressVersion },
  client: { ...ca.client }
};
function Wm(t) {
  switch (t) {
    case "mainnet":
      return hp;
    case "testnet":
      return ul;
    case "devnet":
      return ca;
    case "mocknet":
      return Xm;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function pp(t) {
  return typeof t == "string" ? Wm(t) : t;
}
var Jf;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Jf || (Jf = {}));
var td;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(td || (td = {}));
var kn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(kn || (kn = {}));
const Lc = ["onChainOnly", "offChainOnly", "any"];
Lc[0] + "", kn.OnChainOnly, Lc[1] + "", kn.OffChainOnly, Lc[2] + "", kn.Any, kn.OnChainOnly + "", kn.OnChainOnly, kn.OffChainOnly + "", kn.OffChainOnly, kn.Any + "", kn.Any;
var ed;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(ed || (ed = {}));
var nd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(nd || (nd = {}));
var rd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(rd || (rd = {}));
var or;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(or || (or = {}));
var sd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(sd || (sd = {}));
var id;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(id || (id = {}));
var od;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(od || (od = {}));
var ad;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(ad || (ad = {}));
var cd;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(cd || (cd = {}));
var ld;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ld || (ld = {}));
var ud;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(ud || (ud = {}));
var fd;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(fd || (fd = {}));
var dd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(dd || (dd = {}));
function fl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Ym(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function gp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Zm(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  fl(t.outputLen), fl(t.blockLen);
}
function Qm(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Jm(t, e) {
  gp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const os = {
  number: fl,
  bool: Ym,
  bytes: gp,
  hash: Zm,
  exists: Qm,
  output: Jm
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Cc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), On = (t, e) => t << 32 - e | t >>> e, t2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!t2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function e2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Su(t) {
  if (typeof t == "string" && (t = e2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let yp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Os(t) {
  const e = (r) => t().update(Su(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let wp = class extends yp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, os.hash(e);
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
    return os.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    os.exists(this), os.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const bp = (t, e, n) => new wp(t, e).update(n).digest();
bp.create = (t, e) => new wp(t, e);
function n2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let Eu = class extends yp {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Cc(this.buffer);
  }
  update(e) {
    os.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Su(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Cc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    os.exists(this), os.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    n2(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Cc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      a.setUint32(4 * l, h[l], s);
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
const r2 = (t, e, n) => t & e ^ ~t & n, s2 = (t, e, n) => t & e ^ t & n ^ e & n, i2 = new Uint32Array([
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
]), vr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), $r = new Uint32Array(64);
let mp = class extends Eu {
  constructor() {
    super(64, 32, 8, !1), this.A = vr[0] | 0, this.B = vr[1] | 0, this.C = vr[2] | 0, this.D = vr[3] | 0, this.E = vr[4] | 0, this.F = vr[5] | 0, this.G = vr[6] | 0, this.H = vr[7] | 0;
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
      $r[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = $r[l - 15], p = $r[l - 2], S = On(b, 7) ^ On(b, 18) ^ b >>> 3, x = On(p, 17) ^ On(p, 19) ^ p >>> 10;
      $r[l] = x + $r[l - 7] + S + $r[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: f, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const b = On(a, 6) ^ On(a, 11) ^ On(a, 25), p = h + b + r2(a, c, f) + i2[l] + $r[l] | 0, x = (On(r, 2) ^ On(r, 13) ^ On(r, 22)) + s2(r, i, s) | 0;
      h = f, f = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, i, s, o, a, c, f, h);
  }
  roundClean() {
    $r.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, o2 = class extends mp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const xp = Os(() => new mp());
Os(() => new o2());
var Ds = {}, Au = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Eo;
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
        const C = 1 + f, D = x % (1 << C) << 5 - C, H = t.c32[S + D];
        f = C, c.unshift(H);
      } else
        f = 0;
    let h = 0;
    for (let p = 0; p < c.length && c[p] === "0"; p++)
      h++;
    c = c.slice(h);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), b = l ? l[0].length : 0;
    for (let p = 0; p < b; p++)
      c.unshift(t.c32[0]);
    if (a) {
      const p = a - c.length;
      for (let S = 0; S < p; S++)
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
    let h = [], l = 0, b = 0;
    for (let x = o.length - 1; x >= 0; x--) {
      b === 4 && (h.unshift(n[l]), b = 0, l = 0);
      const D = (t.c32.indexOf(o[x]) << b) + l, H = n[D % 16];
      if (b += 1, l = D >> 4, l > 1 << b)
        throw new Error("Panic error in decoding.");
      h.unshift(H);
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
      for (let C = 0; C < x; C += 2)
        S = `00${S}`;
    }
    return S;
  }
  t.c32decode = s;
})(Au);
var Ss = {};
Object.defineProperty(Ss, "__esModule", { value: !0 });
Ss.c32checkDecode = Ss.c32checkEncode = void 0;
const hd = Ya, pd = Eo, to = Au;
function Sp(t) {
  const e = (0, hd.sha256)((0, hd.sha256)((0, pd.hexToBytes)(t)));
  return (0, pd.bytesToHex)(e.slice(0, 4));
}
function a2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Sp(`${n}${e}`), i = (0, to.c32encode)(`${e}${r}`);
  return `${to.c32[t]}${i}`;
}
Ss.c32checkEncode = a2;
function c2(t) {
  t = (0, to.c32normalize)(t);
  const e = (0, to.c32decode)(t.slice(1)), n = t[0], r = to.c32.indexOf(n), i = e.slice(-8);
  let s = r.toString(16);
  if (s.length === 1 && (s = `0${s}`), Sp(`${s}${e.substring(0, e.length - 8)}`) !== i)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Ss.c32checkDecode = c2;
var Ep = {}, Si = {};
Object.defineProperty(Si, "__esModule", { value: !0 });
Si.decode = Si.encode = void 0;
const Aa = Ya, gd = Eo, Ap = T0, vp = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function l2(t, e = "00") {
  const n = typeof t == "string" ? (0, gd.hexToBytes)(t) : t, r = typeof e == "string" ? (0, gd.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const i = (0, Aa.sha256)((0, Aa.sha256)(new Uint8Array([...r, ...n])));
  return Ap(vp).encode([...r, ...n, ...i.slice(0, 4)]);
}
Si.encode = l2;
function u2(t) {
  const e = Ap(vp).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), i = (0, Aa.sha256)((0, Aa.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((s, o) => {
    if (s !== i[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Si.decode = u2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Ss, n = Si, r = Eo;
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
    const b = n.decode(h), p = (0, r.bytesToHex)(b.data), S = parseInt((0, r.bytesToHex)(b.prefix), 16);
    let x;
    return l < 0 ? (x = S, i[S] !== void 0 && (x = i[S])) : x = l, o(x, p);
  }
  t.b58ToC32 = c;
  function f(h, l = -1) {
    const b = a(h), p = b[0], S = b[1];
    let x;
    l < 0 ? (x = p, s[p] !== void 0 && (x = s[p])) : x = l;
    let C = x.toString(16);
    return C.length === 1 && (C = `0${C}`), n.encode(S, C);
  }
  t.c32ToB58 = f;
})(Ep);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Au;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Ss;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Ep;
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
})(Ds);
function f2(t, e) {
  switch (e = pp(e ?? hp), t) {
    case or.P2PKH:
      switch (e.transactionVersion) {
        case ar.Mainnet:
          return Kn.MainnetSingleSig;
        case ar.Testnet:
          return Kn.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case or.P2SH:
    case or.P2SHNonSequential:
    case or.P2WPKH:
    case or.P2WSH:
    case or.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case ar.Mainnet:
          return Kn.MainnetMultiSig;
        case ar.Testnet:
          return Kn.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const d2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), $p = Uint8Array.from({ length: 16 }, (t, e) => e), h2 = $p.map((t) => (9 * t + 5) % 16);
let vu = [$p], $u = [h2];
for (let t = 0; t < 4; t++)
  for (let e of [vu, $u])
    e.push(e[t].map((n) => d2[n]));
const Ip = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), p2 = vu.map((t, e) => t.map((n) => Ip[e][n])), g2 = $u.map((t, e) => t.map((n) => Ip[e][n])), y2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), w2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Do = (t, e) => t << e | t >>> 32 - e;
function yd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Fo = new Uint32Array(16);
let b2 = class extends Eu {
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
    for (let p = 0; p < 16; p++, n += 4)
      Fo[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, f = this.h3 | 0, h = f, l = this.h4 | 0, b = l;
    for (let p = 0; p < 5; p++) {
      const S = 4 - p, x = y2[p], C = w2[p], D = vu[p], H = $u[p], g = p2[p], k = g2[p];
      for (let I = 0; I < 16; I++) {
        const U = Do(r + yd(p, s, a, f) + Fo[D[I]] + x, g[I]) + l | 0;
        r = l, l = f, f = Do(a, 10) | 0, a = s, s = U;
      }
      for (let I = 0; I < 16; I++) {
        const U = Do(i + yd(S, o, c, h) + Fo[H[I]] + C, k[I]) + b | 0;
        i = b, b = h, h = Do(c, 10) | 0, c = o, o = U;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + f + b | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Fo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const m2 = Os(() => new b2()), jo = BigInt(2 ** 32 - 1), dl = BigInt(32);
function kp(t, e = !1) {
  return e ? { h: Number(t & jo), l: Number(t >> dl & jo) } : { h: Number(t >> dl & jo) | 0, l: Number(t & jo) | 0 };
}
function x2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = kp(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const S2 = (t, e) => BigInt(t >>> 0) << dl | BigInt(e >>> 0), E2 = (t, e, n) => t >>> n, A2 = (t, e, n) => t << 32 - n | e >>> n, v2 = (t, e, n) => t >>> n | e << 32 - n, $2 = (t, e, n) => t << 32 - n | e >>> n, I2 = (t, e, n) => t << 64 - n | e >>> n - 32, k2 = (t, e, n) => t >>> n - 32 | e << 64 - n, L2 = (t, e) => e, C2 = (t, e) => t, T2 = (t, e, n) => t << n | e >>> 32 - n, B2 = (t, e, n) => e << n | t >>> 32 - n, M2 = (t, e, n) => e << n - 32 | t >>> 64 - n, N2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function _2(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const P2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), U2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, H2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), O2 = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, D2 = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), F2 = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, yt = {
  fromBig: kp,
  split: x2,
  toBig: S2,
  shrSH: E2,
  shrSL: A2,
  rotrSH: v2,
  rotrSL: $2,
  rotrBH: I2,
  rotrBL: k2,
  rotr32H: L2,
  rotr32L: C2,
  rotlSH: T2,
  rotlSL: B2,
  rotlBH: M2,
  rotlBL: N2,
  add: _2,
  add3L: P2,
  add3H: U2,
  add4L: H2,
  add4H: O2,
  add5H: F2,
  add5L: D2
}, [j2, z2] = yt.split([
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
].map((t) => BigInt(t))), Ir = new Uint32Array(80), kr = new Uint32Array(80);
let Ja = class extends Eu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: f, El: h, Fh: l, Fl: b, Gh: p, Gl: S, Hh: x, Hl: C } = this;
    return [e, n, r, i, s, o, a, c, f, h, l, b, p, S, x, C];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, f, h, l, b, p, S, x, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = p | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let g = 0; g < 16; g++, n += 4)
      Ir[g] = e.getUint32(n), kr[g] = e.getUint32(n += 4);
    for (let g = 16; g < 80; g++) {
      const k = Ir[g - 15] | 0, I = kr[g - 15] | 0, U = yt.rotrSH(k, I, 1) ^ yt.rotrSH(k, I, 8) ^ yt.shrSH(k, I, 7), K = yt.rotrSL(k, I, 1) ^ yt.rotrSL(k, I, 8) ^ yt.shrSL(k, I, 7), R = Ir[g - 2] | 0, q = kr[g - 2] | 0, E = yt.rotrSH(R, q, 19) ^ yt.rotrBH(R, q, 61) ^ yt.shrSH(R, q, 6), T = yt.rotrSL(R, q, 19) ^ yt.rotrBL(R, q, 61) ^ yt.shrSL(R, q, 6), M = yt.add4L(K, T, kr[g - 7], kr[g - 16]), B = yt.add4H(M, U, E, Ir[g - 7], Ir[g - 16]);
      Ir[g] = B | 0, kr[g] = M | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: f, Dl: h, Eh: l, El: b, Fh: p, Fl: S, Gh: x, Gl: C, Hh: D, Hl: H } = this;
    for (let g = 0; g < 80; g++) {
      const k = yt.rotrSH(l, b, 14) ^ yt.rotrSH(l, b, 18) ^ yt.rotrBH(l, b, 41), I = yt.rotrSL(l, b, 14) ^ yt.rotrSL(l, b, 18) ^ yt.rotrBL(l, b, 41), U = l & p ^ ~l & x, K = b & S ^ ~b & C, R = yt.add5L(H, I, K, z2[g], kr[g]), q = yt.add5H(R, D, k, U, j2[g], Ir[g]), E = R | 0, T = yt.rotrSH(r, i, 28) ^ yt.rotrBH(r, i, 34) ^ yt.rotrBH(r, i, 39), M = yt.rotrSL(r, i, 28) ^ yt.rotrBL(r, i, 34) ^ yt.rotrBL(r, i, 39), B = r & s ^ r & a ^ s & a, J = i & o ^ i & c ^ o & c;
      D = x | 0, H = C | 0, x = p | 0, C = S | 0, p = l | 0, S = b | 0, { h: l, l: b } = yt.add(f | 0, h | 0, q | 0, E | 0), f = a | 0, h = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const F = yt.add3L(E, M, J);
      r = yt.add3H(F, q, T, B), i = F | 0;
    }
    ({ h: r, l: i } = yt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = yt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = yt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: h } = yt.add(this.Dh | 0, this.Dl | 0, f | 0, h | 0), { h: l, l: b } = yt.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: p, l: S } = yt.add(this.Fh | 0, this.Fl | 0, p | 0, S | 0), { h: x, l: C } = yt.add(this.Gh | 0, this.Gl | 0, x | 0, C | 0), { h: D, l: H } = yt.add(this.Hh | 0, this.Hl | 0, D | 0, H | 0), this.set(r, i, s, o, a, c, f, h, l, b, p, S, x, C, D, H);
  }
  roundClean() {
    Ir.fill(0), kr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, R2 = class extends Ja {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, G2 = class extends Ja {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, K2 = class extends Ja {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Os(() => new Ja());
Os(() => new R2());
Os(() => new G2());
Os(() => new K2());
var va = { exports: {} };
va.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", i = 9007199254740991, s = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", f = "[object Error]", h = "[object Function]", l = "[object GeneratorFunction]", b = "[object Map]", p = "[object Number]", S = "[object Object]", x = "[object Promise]", C = "[object RegExp]", D = "[object Set]", H = "[object String]", g = "[object Symbol]", k = "[object WeakMap]", I = "[object ArrayBuffer]", U = "[object DataView]", K = "[object Float32Array]", R = "[object Float64Array]", q = "[object Int8Array]", E = "[object Int16Array]", T = "[object Int32Array]", M = "[object Uint8Array]", B = "[object Uint8ClampedArray]", J = "[object Uint16Array]", F = "[object Uint32Array]", Pt = /[\\^$.*+?()[\]{}|]/g, ut = /\w*$/, Yt = /^\[object .+?Constructor\]$/, A = /^(?:0|[1-9]\d*)$/, _ = {};
  _[s] = _[o] = _[I] = _[U] = _[a] = _[c] = _[K] = _[R] = _[q] = _[E] = _[T] = _[b] = _[p] = _[S] = _[C] = _[D] = _[H] = _[g] = _[M] = _[B] = _[J] = _[F] = !0, _[f] = _[h] = _[k] = !1;
  var ft = typeof ze == "object" && ze && ze.Object === Object && ze, $t = typeof self == "object" && self && self.Object === Object && self, Et = ft || $t || Function("return this")(), At = e && !e.nodeType && e, Jt = At && !0 && t && !t.nodeType && t, se = Jt && Jt.exports === At;
  function Rt(y, L) {
    return y.set(L[0], L[1]), y;
  }
  function ge(y, L) {
    return y.add(L), y;
  }
  function Dt(y, L) {
    for (var N = -1, tt = y ? y.length : 0; ++N < tt && L(y[N], N, y) !== !1; )
      ;
    return y;
  }
  function jt(y, L) {
    for (var N = -1, tt = L.length, Le = y.length; ++N < tt; )
      y[Le + N] = L[N];
    return y;
  }
  function Ge(y, L, N, tt) {
    for (var Le = -1, Xe = y ? y.length : 0; ++Le < Xe; )
      N = L(N, y[Le], Le, y);
    return N;
  }
  function dn(y, L) {
    for (var N = -1, tt = Array(y); ++N < y; )
      tt[N] = L(N);
    return tt;
  }
  function Ke(y, L) {
    return y == null ? void 0 : y[L];
  }
  function Be(y) {
    var L = !1;
    if (y != null && typeof y.toString != "function")
      try {
        L = !!(y + "");
      } catch {
      }
    return L;
  }
  function ye(y) {
    var L = -1, N = Array(y.size);
    return y.forEach(function(tt, Le) {
      N[++L] = [Le, tt];
    }), N;
  }
  function Ae(y, L) {
    return function(N) {
      return y(L(N));
    };
  }
  function $e(y) {
    var L = -1, N = Array(y.size);
    return y.forEach(function(tt) {
      N[++L] = tt;
    }), N;
  }
  var Gt = Array.prototype, Kt = Function.prototype, we = Object.prototype, Me = Et["__core-js_shared__"], be = function() {
    var y = /[^.]+$/.exec(Me && Me.keys && Me.keys.IE_PROTO || "");
    return y ? "Symbol(src)_1." + y : "";
  }(), hn = Kt.toString, Ft = we.hasOwnProperty, tn = we.toString, d = RegExp(
    "^" + hn.call(Ft).replace(Pt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), w = se ? Et.Buffer : void 0, u = Et.Symbol, $ = Et.Uint8Array, P = Ae(Object.getPrototypeOf, Object), V = Object.create, ct = we.propertyIsEnumerable, ht = Gt.splice, Lt = Object.getOwnPropertySymbols, lt = w ? w.isBuffer : void 0, Zt = Ae(Object.keys, Object), Ct = st(Et, "DataView"), It = st(Et, "Map"), Mt = st(Et, "Promise"), Vt = st(Et, "Set"), me = st(Et, "WeakMap"), xe = st(Object, "create"), rt = es(Ct), et = es(It), kt = es(Mt), Se = es(Vt), Tt = es(me), ie = u ? u.prototype : void 0, En = ie ? ie.valueOf : void 0;
  function Ne(y) {
    var L = -1, N = y ? y.length : 0;
    for (this.clear(); ++L < N; ) {
      var tt = y[L];
      this.set(tt[0], tt[1]);
    }
  }
  function An() {
    this.__data__ = xe ? xe(null) : {};
  }
  function Ve(y) {
    return this.has(y) && delete this.__data__[y];
  }
  function pn(y) {
    var L = this.__data__;
    if (xe) {
      var N = L[y];
      return N === r ? void 0 : N;
    }
    return Ft.call(L, y) ? L[y] : void 0;
  }
  function qe(y) {
    var L = this.__data__;
    return xe ? L[y] !== void 0 : Ft.call(L, y);
  }
  function dr(y, L) {
    var N = this.__data__;
    return N[y] = xe && L === void 0 ? r : L, this;
  }
  Ne.prototype.clear = An, Ne.prototype.delete = Ve, Ne.prototype.get = pn, Ne.prototype.has = qe, Ne.prototype.set = dr;
  function _e(y) {
    var L = -1, N = y ? y.length : 0;
    for (this.clear(); ++L < N; ) {
      var tt = y[L];
      this.set(tt[0], tt[1]);
    }
  }
  function Ks() {
    this.__data__ = [];
  }
  function Hi(y) {
    var L = this.__data__, N = ce(L, y);
    if (N < 0)
      return !1;
    var tt = L.length - 1;
    return N == tt ? L.pop() : ht.call(L, N, 1), !0;
  }
  function Vs(y) {
    var L = this.__data__, N = ce(L, y);
    return N < 0 ? void 0 : L[N][1];
  }
  function qs(y) {
    return ce(this.__data__, y) > -1;
  }
  function Xs(y, L) {
    var N = this.__data__, tt = ce(N, y);
    return tt < 0 ? N.push([y, L]) : N[tt][1] = L, this;
  }
  _e.prototype.clear = Ks, _e.prototype.delete = Hi, _e.prototype.get = Vs, _e.prototype.has = qs, _e.prototype.set = Xs;
  function Ie(y) {
    var L = -1, N = y ? y.length : 0;
    for (this.clear(); ++L < N; ) {
      var tt = y[L];
      this.set(tt[0], tt[1]);
    }
  }
  function Ws() {
    this.__data__ = {
      hash: new Ne(),
      map: new (It || _e)(),
      string: new Ne()
    };
  }
  function Zr(y) {
    return G(this, y).delete(y);
  }
  function Ys(y) {
    return G(this, y).get(y);
  }
  function hr(y) {
    return G(this, y).has(y);
  }
  function pr(y, L) {
    return G(this, y).set(y, L), this;
  }
  Ie.prototype.clear = Ws, Ie.prototype.delete = Zr, Ie.prototype.get = Ys, Ie.prototype.has = hr, Ie.prototype.set = pr;
  function en(y) {
    this.__data__ = new _e(y);
  }
  function gr() {
    this.__data__ = new _e();
  }
  function Qr(y) {
    return this.__data__.delete(y);
  }
  function yr(y) {
    return this.__data__.get(y);
  }
  function Jr(y) {
    return this.__data__.has(y);
  }
  function j(y, L) {
    var N = this.__data__;
    if (N instanceof _e) {
      var tt = N.__data__;
      if (!It || tt.length < n - 1)
        return tt.push([y, L]), this;
      N = this.__data__ = new Ie(tt);
    }
    return N.set(y, L), this;
  }
  en.prototype.clear = gr, en.prototype.delete = Qr, en.prototype.get = yr, en.prototype.has = Jr, en.prototype.set = j;
  function Z(y, L) {
    var N = mc(y) || Fy(y) ? dn(y.length, String) : [], tt = N.length, Le = !!tt;
    for (var Xe in y)
      Ft.call(y, Xe) && !(Le && (Xe == "length" || He(Xe, tt))) && N.push(Xe);
    return N;
  }
  function te(y, L, N) {
    var tt = y[L];
    (!(Ft.call(y, L) && wf(tt, N)) || N === void 0 && !(L in y)) && (y[L] = N);
  }
  function ce(y, L) {
    for (var N = y.length; N--; )
      if (wf(y[N][0], L))
        return N;
    return -1;
  }
  function ts(y, L) {
    return y && O(L, xc(L), y);
  }
  function Pn(y, L, N, tt, Le, Xe, tr) {
    var We;
    if (tt && (We = Xe ? tt(y, Le, Xe, tr) : tt(y)), We !== void 0)
      return We;
    if (!ko(y))
      return y;
    var xf = mc(y);
    if (xf) {
      if (We = Ht(y), !L)
        return v(y, We);
    } else {
      var Qs = ot(y), Sf = Qs == h || Qs == l;
      if (zy(y))
        return Zs(y, L);
      if (Qs == S || Qs == s || Sf && !Xe) {
        if (Be(y))
          return Xe ? y : {};
        if (We = ke(Sf ? {} : y), !L)
          return W(y, ts(We, y));
      } else {
        if (!_[Qs])
          return Xe ? y : {};
        We = gn(y, Qs, Pn, L);
      }
    }
    tr || (tr = new en());
    var Ef = tr.get(y);
    if (Ef)
      return Ef;
    if (tr.set(y, We), !xf)
      var Af = N ? Q(y) : xc(y);
    return Dt(Af || y, function(Sc, Lo) {
      Af && (Lo = Sc, Sc = y[Lo]), te(We, Lo, Pn(Sc, L, N, tt, Lo, y, tr));
    }), We;
  }
  function Qt(y) {
    return ko(y) ? V(y) : {};
  }
  function Oi(y, L, N) {
    var tt = L(y);
    return mc(y) ? tt : jt(tt, N(y));
  }
  function Di(y) {
    return tn.call(y);
  }
  function vn(y) {
    if (!ko(y) || Io(y))
      return !1;
    var L = mf(y) || Be(y) ? d : Yt;
    return L.test(es(y));
  }
  function Fi(y) {
    if (!yf(y))
      return Zt(y);
    var L = [];
    for (var N in Object(y))
      Ft.call(y, N) && N != "constructor" && L.push(N);
    return L;
  }
  function Zs(y, L) {
    if (L)
      return y.slice();
    var N = new y.constructor(y.length);
    return y.copy(N), N;
  }
  function ji(y) {
    var L = new y.constructor(y.byteLength);
    return new $(L).set(new $(y)), L;
  }
  function zi(y, L) {
    var N = L ? ji(y.buffer) : y.buffer;
    return new y.constructor(N, y.byteOffset, y.byteLength);
  }
  function yc(y, L, N) {
    var tt = L ? N(ye(y), !0) : ye(y);
    return Ge(tt, Rt, new y.constructor());
  }
  function wc(y) {
    var L = new y.constructor(y.source, ut.exec(y));
    return L.lastIndex = y.lastIndex, L;
  }
  function Ri(y, L, N) {
    var tt = L ? N($e(y), !0) : $e(y);
    return Ge(tt, ge, new y.constructor());
  }
  function bc(y) {
    return En ? Object(En.call(y)) : {};
  }
  function m(y, L) {
    var N = L ? ji(y.buffer) : y.buffer;
    return new y.constructor(N, y.byteOffset, y.length);
  }
  function v(y, L) {
    var N = -1, tt = y.length;
    for (L || (L = Array(tt)); ++N < tt; )
      L[N] = y[N];
    return L;
  }
  function O(y, L, N, tt) {
    N || (N = {});
    for (var Le = -1, Xe = L.length; ++Le < Xe; ) {
      var tr = L[Le], We = void 0;
      te(N, tr, We === void 0 ? y[tr] : We);
    }
    return N;
  }
  function W(y, L) {
    return O(y, dt(y), L);
  }
  function Q(y) {
    return Oi(y, xc, dt);
  }
  function G(y, L) {
    var N = y.__data__;
    return Un(L) ? N[typeof L == "string" ? "string" : "hash"] : N.map;
  }
  function st(y, L) {
    var N = Ke(y, L);
    return vn(N) ? N : void 0;
  }
  var dt = Lt ? Ae(Lt, Object) : Ky, ot = Di;
  (Ct && ot(new Ct(new ArrayBuffer(1))) != U || It && ot(new It()) != b || Mt && ot(Mt.resolve()) != x || Vt && ot(new Vt()) != D || me && ot(new me()) != k) && (ot = function(y) {
    var L = tn.call(y), N = L == S ? y.constructor : void 0, tt = N ? es(N) : void 0;
    if (tt)
      switch (tt) {
        case rt:
          return U;
        case et:
          return b;
        case kt:
          return x;
        case Se:
          return D;
        case Tt:
          return k;
      }
    return L;
  });
  function Ht(y) {
    var L = y.length, N = y.constructor(L);
    return L && typeof y[0] == "string" && Ft.call(y, "index") && (N.index = y.index, N.input = y.input), N;
  }
  function ke(y) {
    return typeof y.constructor == "function" && !yf(y) ? Qt(P(y)) : {};
  }
  function gn(y, L, N, tt) {
    var Le = y.constructor;
    switch (L) {
      case I:
        return ji(y);
      case a:
      case c:
        return new Le(+y);
      case U:
        return zi(y, tt);
      case K:
      case R:
      case q:
      case E:
      case T:
      case M:
      case B:
      case J:
      case F:
        return m(y, tt);
      case b:
        return yc(y, tt, N);
      case p:
      case H:
        return new Le(y);
      case C:
        return wc(y);
      case D:
        return Ri(y, tt, N);
      case g:
        return bc(y);
    }
  }
  function He(y, L) {
    return L = L ?? i, !!L && (typeof y == "number" || A.test(y)) && y > -1 && y % 1 == 0 && y < L;
  }
  function Un(y) {
    var L = typeof y;
    return L == "string" || L == "number" || L == "symbol" || L == "boolean" ? y !== "__proto__" : y === null;
  }
  function Io(y) {
    return !!be && be in y;
  }
  function yf(y) {
    var L = y && y.constructor, N = typeof L == "function" && L.prototype || we;
    return y === N;
  }
  function es(y) {
    if (y != null) {
      try {
        return hn.call(y);
      } catch {
      }
      try {
        return y + "";
      } catch {
      }
    }
    return "";
  }
  function Dy(y) {
    return Pn(y, !0, !0);
  }
  function wf(y, L) {
    return y === L || y !== y && L !== L;
  }
  function Fy(y) {
    return jy(y) && Ft.call(y, "callee") && (!ct.call(y, "callee") || tn.call(y) == s);
  }
  var mc = Array.isArray;
  function bf(y) {
    return y != null && Ry(y.length) && !mf(y);
  }
  function jy(y) {
    return Gy(y) && bf(y);
  }
  var zy = lt || Vy;
  function mf(y) {
    var L = ko(y) ? tn.call(y) : "";
    return L == h || L == l;
  }
  function Ry(y) {
    return typeof y == "number" && y > -1 && y % 1 == 0 && y <= i;
  }
  function ko(y) {
    var L = typeof y;
    return !!y && (L == "object" || L == "function");
  }
  function Gy(y) {
    return !!y && typeof y == "object";
  }
  function xc(y) {
    return bf(y) ? Z(y) : Fi(y);
  }
  function Ky() {
    return [];
  }
  function Vy() {
    return !1;
  }
  t.exports = Dy;
})(va, va.exports);
var V2 = va.exports;
const Lp = /* @__PURE__ */ t0(V2);
var hl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(hl || (hl = {}));
function q2(t, e) {
  return { type: hl.Address, version: t, hash160: e };
}
function X2(t) {
  return Ds.c32address(t.version, t.hash160);
}
const W2 = (t) => m2(xp(t)), Y2 = (t) => it(W2(t));
fe.hmacSha256Sync = (t, ...e) => {
  const n = bp.create(xp, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Z2(t, e = "mainnet") {
  e = pp(e), t = typeof t == "string" ? _t(t) : t;
  const n = f2(or.P2PKH, e), r = q2(n, Y2(t));
  return X2(r);
}
function Q2(t, e) {
  const n = Te.decodeToken(t), r = n.payload;
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
  const i = r.issuer.publicKey, s = Z2(i);
  if (e !== i) {
    if (e !== s) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new Te.TokenVerifier(n.header.alg, i);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function J2(t, e = null) {
  let n;
  e ? n = Q2(t, e) : n = Te.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const i = n.payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    i.hasOwnProperty("claim") && (r = i.claim);
  }
  return r;
}
const wd = "_blockstackDidCheckEchoReply", tx = "echoReply", ex = "authContinuation";
function nx(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [i, s] = r.split("=");
    return n[i] = s ? decodeURIComponent(s.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function rx() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[wd];
  if (typeof e == "boolean")
    return e;
  const n = nx(t.location.search), r = n[tx];
  if (r) {
    t[wd] = !0;
    const i = `echo-reply-${r}`;
    return t.localStorage.setItem(i, "success"), t.setTimeout(() => {
      const s = n[ex];
      t.location.href = s;
    }, 10), !0;
  }
  return !1;
}
class pl {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new l0();
    else
      throw new Ew("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Qf(e.sessionOptions) : this.store = new Qf() : e ? this.store = new Zf(e.sessionOptions) : this.store = new Zf();
  }
  makeAuthRequestToken(e, n, r, i, s, o = vw().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new tl("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), i = i || c.scopes, s = s || c.appDomain, zm(e, n, r, i, s, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = jm();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = iu("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (rx())
        return ii.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      ii.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = qw()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Co("Existing user session found.");
    const i = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const s = Te.decodeToken(e).payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await qm(e))
      throw new Co("Invalid authentication response.");
    let a = s.private_key, c = s.core_token;
    if (Ac(s.version, "1.1.0"))
      if (i !== void 0 && i != null) {
        if (s.private_key !== void 0 && s.private_key !== null)
          try {
            a = await Wf(i, s.private_key);
          } catch {
            if (ii.warn("Failed decryption of appPrivateKey, will try to use as given"), !fe.isValidPrivateKey(s.private_key))
              throw new Co("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Wf(i, c);
          } catch {
            ii.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Co("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let f = Uw, h;
    Ac(s.version, "1.2.0") && s.hubUrl !== null && s.hubUrl !== void 0 && (f = s.hubUrl), Ac(s.version, "1.3.0") && s.associationToken !== null && s.associationToken !== void 0 && (h = s.associationToken);
    const l = {
      profile: s.profile,
      email: s.email,
      decentralizedID: s.iss,
      identityAddress: fp(s.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: f,
      appPrivateKeyFromWalletSalt: s.appPrivateKeyFromWalletSalt,
      coreNode: s.blockstackAPIUrl,
      gaiaAssociationToken: h
    }, b = s.profile_url;
    if (!l.profile && b) {
      const p = await n(b);
      if (!p.ok)
        l.profile = Object.assign({}, mw);
      else {
        const S = await p.text(), x = JSON.parse(S);
        l.profile = J2(x[0].token);
      }
    } else
      l.profile = s.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new tl("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), U1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), H1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
pl.prototype.makeAuthRequest = pl.prototype.makeAuthRequestToken;
const sx = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], ix = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = sx(), n = t.filter((r) => e.find((s) => s.id === r.id) ? !1 : !!tc(r.id));
  return e.concat(n);
}, tc = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Cp = "STX_PROVIDER", Es = () => typeof window > "u" ? null : window.localStorage.getItem(Cp), ox = (t) => {
  typeof window < "u" && window.localStorage.setItem(Cp, t);
}, ax = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function cx(t, e) {
  const n = {};
  return Object.assign(n, ax, e), await fetch(t, n);
}
function lx(t) {
  let e = cx, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function ux(...t) {
  const { fetchLib: e, middlewares: n } = lx(t);
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
var Ei;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ei || (Ei = {}));
var As;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(As || (As = {}));
var bd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(bd || (bd = {}));
const fx = "https://api.mainnet.hiro.so", dx = "https://api.testnet.hiro.so", hx = "http://localhost:3999", px = ["mainnet", "testnet", "devnet", "mocknet"];
class vs {
  constructor(e) {
    this.version = As.Mainnet, this.chainId = Ei.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === As.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, i) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${i}?proof=0`, this.getMapEntryUrl = (n, r, i) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${i}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? ux();
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
vs.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new gl();
    case "testnet":
      return new yl();
    case "devnet":
      return new gx();
    case "mocknet":
      return new Tp();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${px.join(", ")}`);
  }
};
vs.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : vs.fromName(t);
class gl extends vs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? fx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = As.Mainnet, this.chainId = Ei.Mainnet;
  }
}
class yl extends vs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? dx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = As.Testnet, this.chainId = Ei.Testnet;
  }
}
class Tp extends vs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? hx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = As.Testnet, this.chainId = Ei.Testnet;
  }
}
const gx = Tp;
var $s;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})($s || ($s = {}));
var $a;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})($a || ($a = {}));
$s.Mainnet;
var Is;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Is || (Is = {}));
var ks;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ks || (ks = {}));
Is.Mainnet;
const yx = {
  chainId: $s.Mainnet,
  transactionVersion: Is.Mainnet,
  peerNetworkId: $a.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ks.MainnetSingleSig,
    multiSig: ks.MainnetMultiSig
  },
  client: { baseUrl: o0 }
}, wl = {
  chainId: $s.Testnet,
  transactionVersion: Is.Testnet,
  peerNetworkId: $a.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ks.TestnetSingleSig,
    multiSig: ks.TestnetMultiSig
  },
  client: { baseUrl: a0 }
}, la = {
  ...wl,
  addressVersion: { ...wl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: c0 }
}, wx = {
  ...la,
  addressVersion: { ...la.addressVersion },
  client: { ...la.client }
};
function bx(t) {
  switch (t) {
    case "mainnet":
      return yx;
    case "testnet":
      return wl;
    case "devnet":
      return la;
    case "mocknet":
      return wx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function mx(t) {
  return typeof t == "string" ? bx(t) : t;
}
function xx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const md = /* @__PURE__ */ new Map();
function Bp(t, e) {
  const n = md.get(t);
  if (n !== void 0)
    return n(e);
  const r = xx(t);
  return md.set(t, r), Bp(t, e);
}
let Wt = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? _t(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Rw(this.readBytes(4), 0);
  }
  readUInt8() {
    return jw(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Dw(this.readBytes(2), 0);
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
    if (Bp(e, r))
      return r;
    throw n(r);
  }
};
const Sx = 128, Ex = 128, Mp = 16, hs = 32, bl = 80, ec = 65, Ax = 32, vx = 64, Ia = 34, $x = 1 + 16 * 1024 * 1024, Ix = 165, kx = 16, Lx = 16, Cx = 20, Tx = Lx + 2 + Cx, Bx = Tx + 4, Mx = $x + (Ix + kx * Bx);
var Ot;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ot || (Ot = {}));
var ml;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(ml || (ml = {}));
var sn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(sn || (sn = {}));
const Tc = ["onChainOnly", "offChainOnly", "any"];
Tc[0] + "", sn.OnChainOnly, Tc[1] + "", sn.OffChainOnly, Tc[2] + "", sn.Any, sn.OnChainOnly + "", sn.OnChainOnly, sn.OffChainOnly + "", sn.OffChainOnly, sn.Any + "", sn.Any;
var ka;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(ka || (ka = {}));
var ee;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ee || (ee = {}));
var le;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(le || (le = {}));
var qt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(qt || (qt = {}));
var oe;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(oe || (oe = {}));
var eo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(eo || (eo = {}));
var xl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(xl || (xl = {}));
var Sl;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Sl || (Sl = {}));
var Fe;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Fe || (Fe = {}));
var xd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(xd || (xd = {}));
var El;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(El || (El = {}));
var Cn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Cn || (Cn = {}));
var Sd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Sd || (Sd = {}));
let nc = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, oi = class extends nc {
  constructor(e) {
    super(e);
  }
}, Oe = class extends nc {
  constructor(e) {
    super(e);
  }
}, La = class extends nc {
  constructor(e) {
    super(e);
  }
}, as = class extends nc {
  constructor(e) {
    super(e);
  }
};
function Al(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Nx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Np(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function _x(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Al(t.outputLen), Al(t.blockLen);
}
function Px(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ux(t, e) {
  Np(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const cs = {
  number: Al,
  bool: Nx,
  bytes: Np,
  hash: _x,
  exists: Px,
  output: Ux
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Bc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Dn = (t, e) => t << 32 - e | t >>> e, Hx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Hx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ox(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Iu(t) {
  if (typeof t == "string" && (t = Ox(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let _p = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Fs(t) {
  const e = (r) => t().update(Iu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Pp = class extends _p {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, cs.hash(e);
    const r = Iu(n);
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
    return cs.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    cs.exists(this), cs.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Up = (t, e, n) => new Pp(t, e).update(n).digest();
Up.create = (t, e) => new Pp(t, e);
function Dx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let ku = class extends _p {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Bc(this.buffer);
  }
  update(e) {
    cs.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Iu(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Bc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    cs.exists(this), cs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    Dx(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Bc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      a.setUint32(4 * l, h[l], s);
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
const Fx = (t, e, n) => t & e ^ ~t & n, jx = (t, e, n) => t & e ^ t & n ^ e & n, zx = new Uint32Array([
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
]), Lr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Cr = new Uint32Array(64);
let Hp = class extends ku {
  constructor() {
    super(64, 32, 8, !1), this.A = Lr[0] | 0, this.B = Lr[1] | 0, this.C = Lr[2] | 0, this.D = Lr[3] | 0, this.E = Lr[4] | 0, this.F = Lr[5] | 0, this.G = Lr[6] | 0, this.H = Lr[7] | 0;
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
      Cr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = Cr[l - 15], p = Cr[l - 2], S = Dn(b, 7) ^ Dn(b, 18) ^ b >>> 3, x = Dn(p, 17) ^ Dn(p, 19) ^ p >>> 10;
      Cr[l] = x + Cr[l - 7] + S + Cr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: f, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const b = Dn(a, 6) ^ Dn(a, 11) ^ Dn(a, 25), p = h + b + Fx(a, c, f) + zx[l] + Cr[l] | 0, x = (Dn(r, 2) ^ Dn(r, 13) ^ Dn(r, 22)) + jx(r, i, s) | 0;
      h = f, f = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, i, s, o, a, c, f, h);
  }
  roundClean() {
    Cr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Rx = class extends Hp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Lu = Fs(() => new Hp());
Fs(() => new Rx());
const Gx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Op = Uint8Array.from({ length: 16 }, (t, e) => e), Kx = Op.map((t) => (9 * t + 5) % 16);
let Cu = [Op], Tu = [Kx];
for (let t = 0; t < 4; t++)
  for (let e of [Cu, Tu])
    e.push(e[t].map((n) => Gx[n]));
const Dp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Vx = Cu.map((t, e) => t.map((n) => Dp[e][n])), qx = Tu.map((t, e) => t.map((n) => Dp[e][n])), Xx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Wx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), zo = (t, e) => t << e | t >>> 32 - e;
function Ed(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ro = new Uint32Array(16);
let Yx = class extends ku {
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
    for (let p = 0; p < 16; p++, n += 4)
      Ro[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, f = this.h3 | 0, h = f, l = this.h4 | 0, b = l;
    for (let p = 0; p < 5; p++) {
      const S = 4 - p, x = Xx[p], C = Wx[p], D = Cu[p], H = Tu[p], g = Vx[p], k = qx[p];
      for (let I = 0; I < 16; I++) {
        const U = zo(r + Ed(p, s, a, f) + Ro[D[I]] + x, g[I]) + l | 0;
        r = l, l = f, f = zo(a, 10) | 0, a = s, s = U;
      }
      for (let I = 0; I < 16; I++) {
        const U = zo(i + Ed(S, o, c, h) + Ro[H[I]] + C, k[I]) + b | 0;
        i = b, b = h, h = zo(c, 10) | 0, c = o, o = U;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + f + b | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Ro.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Zx = Fs(() => new Yx()), Go = BigInt(2 ** 32 - 1), vl = BigInt(32);
function Fp(t, e = !1) {
  return e ? { h: Number(t & Go), l: Number(t >> vl & Go) } : { h: Number(t >> vl & Go) | 0, l: Number(t & Go) | 0 };
}
function Qx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Fp(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const Jx = (t, e) => BigInt(t >>> 0) << vl | BigInt(e >>> 0), tS = (t, e, n) => t >>> n, eS = (t, e, n) => t << 32 - n | e >>> n, nS = (t, e, n) => t >>> n | e << 32 - n, rS = (t, e, n) => t << 32 - n | e >>> n, sS = (t, e, n) => t << 64 - n | e >>> n - 32, iS = (t, e, n) => t >>> n - 32 | e << 64 - n, oS = (t, e) => e, aS = (t, e) => t, cS = (t, e, n) => t << n | e >>> 32 - n, lS = (t, e, n) => e << n | t >>> 32 - n, uS = (t, e, n) => e << n - 32 | t >>> 64 - n, fS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function dS(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const hS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), pS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, gS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), yS = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, wS = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), bS = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, wt = {
  fromBig: Fp,
  split: Qx,
  toBig: Jx,
  shrSH: tS,
  shrSL: eS,
  rotrSH: nS,
  rotrSL: rS,
  rotrBH: sS,
  rotrBL: iS,
  rotr32H: oS,
  rotr32L: aS,
  rotlSH: cS,
  rotlSL: lS,
  rotlBH: uS,
  rotlBL: fS,
  add: dS,
  add3L: hS,
  add3H: pS,
  add4L: gS,
  add4H: yS,
  add5H: bS,
  add5L: wS
}, [mS, xS] = wt.split([
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
].map((t) => BigInt(t))), Tr = new Uint32Array(80), Br = new Uint32Array(80);
let rc = class extends ku {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: f, El: h, Fh: l, Fl: b, Gh: p, Gl: S, Hh: x, Hl: C } = this;
    return [e, n, r, i, s, o, a, c, f, h, l, b, p, S, x, C];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, f, h, l, b, p, S, x, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = p | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let g = 0; g < 16; g++, n += 4)
      Tr[g] = e.getUint32(n), Br[g] = e.getUint32(n += 4);
    for (let g = 16; g < 80; g++) {
      const k = Tr[g - 15] | 0, I = Br[g - 15] | 0, U = wt.rotrSH(k, I, 1) ^ wt.rotrSH(k, I, 8) ^ wt.shrSH(k, I, 7), K = wt.rotrSL(k, I, 1) ^ wt.rotrSL(k, I, 8) ^ wt.shrSL(k, I, 7), R = Tr[g - 2] | 0, q = Br[g - 2] | 0, E = wt.rotrSH(R, q, 19) ^ wt.rotrBH(R, q, 61) ^ wt.shrSH(R, q, 6), T = wt.rotrSL(R, q, 19) ^ wt.rotrBL(R, q, 61) ^ wt.shrSL(R, q, 6), M = wt.add4L(K, T, Br[g - 7], Br[g - 16]), B = wt.add4H(M, U, E, Tr[g - 7], Tr[g - 16]);
      Tr[g] = B | 0, Br[g] = M | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: f, Dl: h, Eh: l, El: b, Fh: p, Fl: S, Gh: x, Gl: C, Hh: D, Hl: H } = this;
    for (let g = 0; g < 80; g++) {
      const k = wt.rotrSH(l, b, 14) ^ wt.rotrSH(l, b, 18) ^ wt.rotrBH(l, b, 41), I = wt.rotrSL(l, b, 14) ^ wt.rotrSL(l, b, 18) ^ wt.rotrBL(l, b, 41), U = l & p ^ ~l & x, K = b & S ^ ~b & C, R = wt.add5L(H, I, K, xS[g], Br[g]), q = wt.add5H(R, D, k, U, mS[g], Tr[g]), E = R | 0, T = wt.rotrSH(r, i, 28) ^ wt.rotrBH(r, i, 34) ^ wt.rotrBH(r, i, 39), M = wt.rotrSL(r, i, 28) ^ wt.rotrBL(r, i, 34) ^ wt.rotrBL(r, i, 39), B = r & s ^ r & a ^ s & a, J = i & o ^ i & c ^ o & c;
      D = x | 0, H = C | 0, x = p | 0, C = S | 0, p = l | 0, S = b | 0, { h: l, l: b } = wt.add(f | 0, h | 0, q | 0, E | 0), f = a | 0, h = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const F = wt.add3L(E, M, J);
      r = wt.add3H(F, q, T, B), i = F | 0;
    }
    ({ h: r, l: i } = wt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = wt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = wt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: h } = wt.add(this.Dh | 0, this.Dl | 0, f | 0, h | 0), { h: l, l: b } = wt.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: p, l: S } = wt.add(this.Fh | 0, this.Fl | 0, p | 0, S | 0), { h: x, l: C } = wt.add(this.Gh | 0, this.Gl | 0, x | 0, C | 0), { h: D, l: H } = wt.add(this.Hh | 0, this.Hl | 0, D | 0, H | 0), this.set(r, i, s, o, a, c, f, h, l, b, p, S, x, C, D, H);
  }
  roundClean() {
    Tr.fill(0), Br.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, SS = class extends rc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, ES = class extends rc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, AS = class extends rc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Fs(() => new rc());
Fs(() => new SS());
const vS = Fs(() => new ES());
Fs(() => new AS());
var Bt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Bt || (Bt = {}));
var Ee;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Ee || (Ee = {}));
function Bu(t) {
  return Ee[t];
}
const $S = () => ({ type: Bt.BoolTrue }), IS = () => ({ type: Bt.BoolFalse }), kS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Bt.Buffer, value: it(t) };
}, Ad = BigInt("0xffffffffffffffffffffffffffffffff"), LS = BigInt(0), vd = BigInt("0x7fffffffffffffffffffffffffffffff"), $d = BigInt("-170141183460469231731687303715884105728"), CS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = nl(_t(t))), Je(t, Uint8Array) && (t = nl(t));
  const e = Ue(t);
  if (e > vd)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${vd}`);
  if (e < $d)
    throw new RangeError(`Cannot construct clarity integer form value less than ${$d}`);
  return { type: Bt.Int, value: e };
}, TS = (t) => {
  const e = Ue(t);
  if (e < LS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Ad)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Ad}`);
  return { type: Bt.UInt, value: e };
};
function BS(t) {
  return { type: Bt.List, value: t };
}
function jp() {
  return { type: Bt.OptionalNone };
}
function zp(t) {
  return { type: Bt.OptionalSome, value: t };
}
var Y;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Y || (Y = {}));
function MS() {
  return {
    type: Y.Address,
    version: ks.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Id(t) {
  if (t && Zp(t, Ia))
    throw new Error(`Memo exceeds maximum length of ${Ia} bytes`);
  return { type: Y.MemoString, content: t };
}
function Mu(t, e) {
  return {
    type: Y.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function $l(t) {
  if (_t(t).byteLength != ec)
    throw Error("Invalid signature");
  return {
    type: Y.MessageSignature,
    data: t
  };
}
function NS(t, e, n) {
  return typeof t == "string" && (t = WS(t)), typeof n == "string" && (n = Id(n)), {
    type: Y.Payload,
    payloadType: Ot.TokenTransfer,
    recipient: t,
    amount: Ue(e),
    memo: n ?? Id("")
  };
}
function _S(t, e, n, r) {
  return typeof e == "string" && (e = Nn(e)), typeof n == "string" && (n = Nn(n)), {
    type: Y.Payload,
    payloadType: Ot.ContractCall,
    contractAddress: typeof t == "string" ? Yr(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function PS(t) {
  return Nn(t, 4, 1e5);
}
function kd(t, e, n) {
  return typeof t == "string" && (t = Nn(t)), typeof e == "string" && (e = PS(e)), typeof n == "number" ? {
    type: Y.Payload,
    payloadType: Ot.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: Y.Payload,
    payloadType: Ot.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function US() {
  return { type: Y.Payload, payloadType: Ot.PoisonMicroblock };
}
function Ld(t, e) {
  if (t.byteLength != hs)
    throw Error(`Coinbase buffer size must be ${hs} bytes`);
  return e != null ? {
    type: Y.Payload,
    payloadType: Ot.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: Y.Payload,
    payloadType: Ot.Coinbase,
    coinbaseBytes: t
  };
}
function HS(t, e, n) {
  if (t.byteLength != hs)
    throw Error(`Coinbase buffer size must be ${hs} bytes`);
  if (n.byteLength != bl)
    throw Error(`VRF proof buffer size must be ${bl} bytes`);
  return {
    type: Y.Payload,
    payloadType: Ot.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Bt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function OS(t, e, n, r, i, s, o) {
  return {
    type: Y.Payload,
    payloadType: Ot.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: i,
    cause: s,
    publicKeyHash: o
  };
}
function Nn(t, e, n) {
  const r = e || 1, i = n || Sx;
  if (Zp(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: Y.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function DS(t, e, n) {
  return {
    type: Y.Asset,
    address: Yr(t),
    contractName: Nn(e),
    assetName: Nn(n)
  };
}
function Yr(t) {
  const e = Ds.c32addressDecode(t);
  return {
    type: Y.Address,
    version: e[0],
    hash160: e[1]
  };
}
function FS(t, e) {
  const n = Yr(t), r = Nn(e);
  return {
    type: Y.Principal,
    prefix: Fe.Contract,
    address: n,
    contractName: r
  };
}
function jS(t) {
  const e = Yr(t);
  return {
    type: Y.Principal,
    prefix: Fe.Standard,
    address: e
  };
}
function ai(t, e) {
  return {
    pubKeyEncoding: t,
    type: Y.TransactionAuthField,
    contents: e
  };
}
function sr(t) {
  switch (t.type) {
    case Y.Address:
      return Ao(t);
    case Y.Principal:
      return Rp(t);
    case Y.LengthPrefixedString:
      return vi(t);
    case Y.MemoString:
      return RS(t);
    case Y.Asset:
      return Kp(t);
    case Y.PostCondition:
      return qp(t);
    case Y.PublicKey:
      return Ll(t);
    case Y.LengthPrefixedList:
      return Nu(t);
    case Y.Payload:
      return Xp(t);
    case Y.TransactionAuthField:
      return XS(t);
    case Y.MessageSignature:
      return _u(t);
  }
}
function Ao(t) {
  const e = [];
  return e.push(_t(wo(t.version, 1))), e.push(_t(t.hash160)), he(e);
}
function Ai(t) {
  const e = Je(t, Wt) ? t : new Wt(t), n = za(it(e.readBytes(1))), r = it(e.readBytes(20));
  return { type: Y.Address, version: n, hash160: r };
}
function Rp(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === Fe.Standard || t.prefix === Fe.Contract) && e.push(Ao(t.address)), t.prefix === Fe.Contract && e.push(vi(t.contractName)), he(e);
}
function zS(t) {
  const e = Je(t, Wt) ? t : new Wt(t), n = e.readUInt8Enum(Fe, (s) => {
    throw new Oe(`Unexpected Principal payload type: ${s}`);
  });
  if (n === Fe.Origin)
    return { type: Y.Principal, prefix: n };
  const r = Ai(e);
  if (n === Fe.Standard)
    return { type: Y.Principal, prefix: n, address: r };
  const i = mn(e);
  return {
    type: Y.Principal,
    prefix: n,
    address: r,
    contractName: i
  };
}
function vi(t) {
  const e = [], n = Ps(t.content), r = n.byteLength;
  return e.push(_t(wo(r, t.lengthPrefixBytes))), e.push(n), he(e);
}
function mn(t, e, n) {
  e = e || 1;
  const r = Je(t, Wt) ? t : new Wt(t), i = za(it(r.readBytes(e))), s = bo(r.readBytes(i));
  return Nn(s, e, n ?? 128);
}
function RS(t) {
  const e = [], n = Ps(t.content), r = w3(it(n), Ia * 2);
  return e.push(_t(r)), he(e);
}
function Gp(t) {
  const e = Je(t, Wt) ? t : new Wt(t);
  let n = bo(e.readBytes(Ia));
  return n = n.replace(/\u0000*$/, ""), { type: Y.MemoString, content: n };
}
function Kp(t) {
  const e = [];
  return e.push(Ao(t.address)), e.push(vi(t.contractName)), e.push(vi(t.assetName)), he(e);
}
function Il(t) {
  const e = Je(t, Wt) ? t : new Wt(t);
  return {
    type: Y.Asset,
    address: Ai(e),
    contractName: mn(e),
    assetName: mn(e)
  };
}
function Nu(t) {
  const e = t.values, n = [];
  n.push(_t(wo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(sr(r));
  return he(n);
}
function Vp(t, e, n) {
  const r = Je(t, Wt) ? t : new Wt(t), i = za(it(r.readBytes(4))), s = [];
  for (let o = 0; o < i; o++)
    switch (e) {
      case Y.Address:
        s.push(Ai(r));
        break;
      case Y.LengthPrefixedString:
        s.push(mn(r));
        break;
      case Y.MemoString:
        s.push(Gp(r));
        break;
      case Y.Asset:
        s.push(Il(r));
        break;
      case Y.PostCondition:
        s.push(KS(r));
        break;
      case Y.PublicKey:
        s.push(Cl(r));
        break;
      case Y.TransactionAuthField:
        s.push(qS(r));
        break;
    }
  return Mu(s, n);
}
function GS(t) {
  return it(qp(t));
}
function qp(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Rp(t.principal)), (t.conditionType === ee.Fungible || t.conditionType === ee.NonFungible) && e.push(Kp(t.asset)), t.conditionType === ee.NonFungible && e.push(Vn(t.assetName)), e.push(t.conditionCode), t.conditionType === ee.STX || t.conditionType === ee.Fungible || t.conditionType === ee.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new oi("The post-condition amount may not be larger than 8 bytes");
    e.push(Xr(t.amount, 8));
  }
  return he(e);
}
function KS(t) {
  const e = Je(t, Wt) ? t : new Wt(t), n = e.readUInt8Enum(ee, (a) => {
    throw new Oe(`Could not read ${a} as PostConditionType`);
  }), r = zS(e);
  let i, s, o;
  switch (n) {
    case ee.STX:
      return i = e.readUInt8Enum(eo, (c) => {
        throw new Oe(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${it(e.readBytes(8))}`), {
        type: Y.PostCondition,
        conditionType: ee.STX,
        principal: r,
        conditionCode: i,
        amount: o
      };
    case ee.Fungible:
      return s = Il(e), i = e.readUInt8Enum(eo, (c) => {
        throw new Oe(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${it(e.readBytes(8))}`), {
        type: Y.PostCondition,
        conditionType: ee.Fungible,
        principal: r,
        conditionCode: i,
        amount: o,
        asset: s
      };
    case ee.NonFungible:
      s = Il(e);
      const a = Rn(e);
      return i = e.readUInt8Enum(xl, (c) => {
        throw new Oe(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: Y.PostCondition,
        conditionType: ee.NonFungible,
        principal: r,
        conditionCode: i,
        asset: s,
        assetName: a
      };
    case ee.Staking:
      return i = e.readUInt8Enum(eo, (c) => {
        throw new Oe(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${it(e.readBytes(8))}`), {
        type: Y.PostCondition,
        conditionType: ee.Staking,
        principal: r,
        conditionCode: i,
        amount: o
      };
    case ee.PoX: {
      const c = e.readUInt8Enum(Sl, (f) => {
        throw new Oe(`Could not read ${f} as PoxConditionCode`);
      });
      return {
        type: Y.PostCondition,
        conditionType: ee.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function Xp(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Ot.TokenTransfer:
      e.push(Vn(t.recipient)), e.push(Xr(t.amount, 8)), e.push(sr(t.memo));
      break;
    case Ot.ContractCall:
      e.push(sr(t.contractAddress)), e.push(sr(t.contractName)), e.push(sr(t.functionName));
      const n = new Uint8Array(4);
      ws(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Vn(r));
      });
      break;
    case Ot.SmartContract:
      e.push(sr(t.contractName)), e.push(sr(t.codeBody));
      break;
    case Ot.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(sr(t.contractName)), e.push(sr(t.codeBody));
      break;
    case Ot.PoisonMicroblock:
      break;
    case Ot.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Ot.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Vn(t.recipient));
      break;
    case Ot.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Vn(t.recipient ? zp(t.recipient) : jp())), e.push(t.vrfProof);
      break;
    case Ot.TenureChange:
      e.push(_t(t.tenureHash)), e.push(_t(t.previousTenureHash)), e.push(_t(t.burnViewHash)), e.push(_t(t.previousTenureEnd)), e.push(ws(new Uint8Array(4), t.previousTenureBlocks)), e.push(zw(new Uint8Array(1), t.cause)), e.push(_t(t.publicKeyHash));
      break;
  }
  return he(e);
}
function VS(t) {
  const e = Je(t, Wt) ? t : new Wt(t);
  switch (e.readUInt8Enum(Ot, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Ot.TokenTransfer:
      const r = Rn(e), i = Ue(e.readBytes(8)), s = Gp(e);
      return NS(r, i, s);
    case Ot.ContractCall:
      const o = Ai(e), a = mn(e), c = mn(e), f = [], h = e.readUInt32BE();
      for (let k = 0; k < h; k++) {
        const I = Rn(e);
        f.push(I);
      }
      return _S(o, a, c, f);
    case Ot.SmartContract:
      const l = mn(e), b = mn(e, 4, 1e5);
      return kd(l, b);
    case Ot.VersionedSmartContract: {
      const k = e.readUInt8Enum(ml, (K) => {
        throw new Error(`Cannot recognize ClarityVersion: ${K}`);
      }), I = mn(e), U = mn(e, 4, Mx);
      return kd(I, U, k);
    }
    case Ot.PoisonMicroblock:
      return US();
    case Ot.Coinbase: {
      const k = e.readBytes(hs);
      return Ld(k);
    }
    case Ot.CoinbaseToAltRecipient: {
      const k = e.readBytes(hs), I = Rn(e);
      return Ld(k, I);
    }
    case Ot.NakamotoCoinbase: {
      const k = e.readBytes(hs), I = Rn(e), U = e.readBytes(bl);
      return HS(k, I, U);
    }
    case Ot.TenureChange:
      const p = it(e.readBytes(20)), S = it(e.readBytes(20)), x = it(e.readBytes(20)), C = it(e.readBytes(32)), D = e.readUInt32BE(), H = e.readUInt8Enum(El, (k) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${k}`);
      }), g = it(e.readBytes(20));
      return OS(p, S, x, C, D, H, g);
  }
}
function kl(t) {
  const e = Je(t, Wt) ? t : new Wt(t);
  return $l(it(e.readBytes(ec)));
}
function qS(t) {
  const e = Je(t, Wt) ? t : new Wt(t), n = e.readUInt8Enum(Cn, (r) => {
    throw new Oe(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Cn.PublicKeyCompressed:
      return ai(oe.Compressed, Cl(e));
    case Cn.PublicKeyUncompressed:
      return ai(oe.Uncompressed, Mi(L3(Cl(e).data)));
    case Cn.SignatureCompressed:
      return ai(oe.Compressed, kl(e));
    case Cn.SignatureUncompressed:
      return ai(oe.Uncompressed, kl(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function _u(t) {
  return _t(t.data);
}
function XS(t) {
  const e = [];
  switch (t.contents.type) {
    case Y.PublicKey:
      e.push(t.pubKeyEncoding === oe.Compressed ? Cn.PublicKeyCompressed : Cn.PublicKeyUncompressed), e.push(_t(k3(t.contents.data)));
      break;
    case Y.MessageSignature:
      e.push(t.pubKeyEncoding === oe.Compressed ? Cn.SignatureCompressed : Cn.SignatureUncompressed), e.push(_u(t.contents));
      break;
  }
  return he(e);
}
function Ll(t) {
  return t.data.slice();
}
function Cl(t) {
  const e = Je(t, Wt) ? t : new Wt(t), n = e.readUInt8(), r = n === 4 ? vx : Ax;
  return Mi(he([n, e.readBytes(r)]));
}
function Pu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === qt.P2PKH || e === qt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === qt.P2WPKH || e === qt.P2WSH || e === qt.P2WSHNonSequential) && !r.map((i) => i.data).every(Ni))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case qt.P2PKH:
      return Ko(t, b3(r[0].data));
    case qt.P2WPKH:
      return Ko(t, m3(r[0].data));
    case qt.P2SH:
    case qt.P2SHNonSequential:
      return Ko(t, x3(n, r.map(Ll)));
    case qt.P2WSH:
    case qt.P2WSHNonSequential:
      return Ko(t, S3(n, r.map(Ll)));
  }
}
function Ko(t, e) {
  return { type: Y.Address, version: t, hash160: e };
}
function Uu(t) {
  return Ds.c32address(t.version, t.hash160);
}
function Cd(t) {
  const [e, n, r] = t.split(/\.|::/);
  return DS(e, n, r);
}
function qi(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return FS(e, n);
  } else
    return jS(t);
}
function WS(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return QS(e, n);
  } else
    return YS(t);
}
function YS(t) {
  const e = Yr(t);
  return { type: Bt.PrincipalStandard, value: Uu(e) };
}
function ZS(t) {
  return { type: Bt.PrincipalStandard, value: Uu(t) };
}
function QS(t, e) {
  const n = Yr(t), r = Nn(e);
  return Wp(n, r);
}
function Wp(t, e) {
  if (Ps(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Bt.PrincipalContract,
    value: `${Uu(t)}.${e.content}`
  };
}
function JS(t) {
  return { type: Bt.ResponseErr, value: t };
}
function t3(t) {
  return { type: Bt.ResponseOk, value: t };
}
const e3 = (t) => ({ type: Bt.StringASCII, value: t }), n3 = (t) => ({ type: Bt.StringUTF8, value: t });
function r3(t) {
  for (const e in t)
    if (!E3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Bt.Tuple, value: t };
}
function Rn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Wt(_t(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Wt(t) : e = t;
  switch (e.readUInt8Enum(Ee, (r) => {
    throw new Oe(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Ee.int:
      return CS(nl(e.readBytes(16)));
    case Ee.uint:
      return TS(e.readBytes(16));
    case Ee.buffer:
      const r = e.readUInt32BE();
      return kS(e.readBytes(r));
    case Ee.true:
      return $S();
    case Ee.false:
      return IS();
    case Ee.address:
      const i = Ai(e);
      return ZS(i);
    case Ee.contract:
      const s = Ai(e), o = mn(e);
      return Wp(s, o);
    case Ee.ok:
      return t3(Rn(e));
    case Ee.err:
      return JS(Rn(e));
    case Ee.none:
      return jp();
    case Ee.some:
      return zp(Rn(e));
    case Ee.list:
      const a = e.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(Rn(e));
      return BS(c);
    case Ee.tuple:
      const f = e.readUInt32BE(), h = {};
      for (let x = 0; x < f; x++) {
        const C = mn(e).content;
        if (C === void 0)
          throw new Oe('"content" is undefined');
        h[C] = Rn(e);
      }
      return r3(h);
    case Ee.ascii:
      const l = e.readUInt32BE(), b = _w(e.readBytes(l));
      return e3(b);
    case Ee.utf8:
      const p = e.readUInt32BE(), S = bo(e.readBytes(p));
      return n3(S);
    default:
      throw new Oe("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Zn(t, e) {
  return he([Bu(t), e]);
}
function s3(t) {
  return new Uint8Array([Bu(t.type)]);
}
function i3(t) {
  return t.type === Bt.OptionalNone ? new Uint8Array([Bu(t.type)]) : Zn(t.type, Vn(t.value));
}
function o3(t) {
  const e = new Uint8Array(4);
  return ws(e, Math.ceil(t.value.length / 2), 0), Zn(t.type, Wn(e, _t(t.value)));
}
function a3(t) {
  const e = ou(Cw(BigInt(t.value), BigInt(Ex)), Mp);
  return Zn(t.type, e);
}
function c3(t) {
  const e = ou(BigInt(t.value), Mp);
  return Zn(t.type, e);
}
function l3(t) {
  return Zn(t.type, Ao(Yr(t.value)));
}
function u3(t) {
  const [e, n] = A3(t.value);
  return Zn(t.type, Wn(Ao(Yr(e)), vi(Nn(n))));
}
function f3(t) {
  return Zn(t.type, Vn(t.value));
}
function d3(t) {
  const e = [], n = new Uint8Array(4);
  ws(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const i = Vn(r);
    e.push(i);
  }
  return Zn(t.type, he(e));
}
function h3(t) {
  const e = [], n = new Uint8Array(4);
  ws(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = Nn(i);
    e.push(vi(s));
    const o = Vn(t.value[i]);
    e.push(o);
  }
  return Zn(t.type, he(e));
}
function Yp(t, e) {
  const n = [], r = e == "ascii" ? Nw(t.value) : Ps(t.value), i = new Uint8Array(4);
  return ws(i, r.length, 0), n.push(i), n.push(r), Zn(t.type, he(n));
}
function p3(t) {
  return Yp(t, "ascii");
}
function g3(t) {
  return Yp(t, "utf8");
}
function Td(t) {
  return it(Vn(t));
}
function Vn(t) {
  switch (t.type) {
    case Bt.BoolTrue:
    case Bt.BoolFalse:
      return s3(t);
    case Bt.OptionalNone:
    case Bt.OptionalSome:
      return i3(t);
    case Bt.Buffer:
      return o3(t);
    case Bt.UInt:
      return c3(t);
    case Bt.Int:
      return a3(t);
    case Bt.PrincipalStandard:
      return l3(t);
    case Bt.PrincipalContract:
      return u3(t);
    case Bt.ResponseOk:
    case Bt.ResponseErr:
      return f3(t);
    case Bt.List:
      return d3(t);
    case Bt.Tuple:
      return h3(t);
    case Bt.StringASCII:
      return p3(t);
    case Bt.StringUTF8:
      return g3(t);
    default:
      throw new oi("Unable to serialize. Invalid Clarity Value.");
  }
}
const y3 = (t) => t.length % 2 ? `0${t}` : t, w3 = (t, e) => t.padEnd(e, "0"), Zp = (t, e) => t ? Ps(t).length > e : !1;
function Tl(t) {
  return Lp(t);
}
const oo = (t) => Zx(Lu(t)), Hu = (t) => it(vS(t)), b3 = (t) => it(oo(t)), m3 = (t) => {
  const e = oo(t), n = Wn(new Uint8Array([0]), new Uint8Array([e.length]), e), r = oo(n);
  return it(r);
}, x3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + e.length), n.push(174);
  const r = he(n), i = oo(r);
  return it(i);
}, S3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = he(n), i = Lu(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = he(s), a = oo(o);
  return it(a);
};
function E3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function A3(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
fe.hmacSha256Sync = (t, ...e) => {
  const n = Up.create(Lu, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Mi(t) {
  return t = typeof t == "string" ? _t(t) : t, {
    type: Y.PublicKey,
    data: t
  };
}
function v3(t, e, n = oe.Compressed) {
  const r = Ow(e), i = new ln(Tf(r.r), Tf(r.s)), s = St.fromSignature(t, i, r.recoveryId), o = n === oe.Compressed;
  return s.toHex(o);
}
function $3(t) {
  return typeof t == "string" ? t : it(t);
}
const Ou = $3;
function Qp(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Hw;
}
function Ni(t) {
  return !Ou(t).startsWith("04");
}
function I3(t) {
  t = au(t);
  const e = Qp(t);
  return it(mo(t.slice(0, 32), e));
}
function k3(t) {
  return St.fromHex(Ou(t)).toHex(!0);
}
function L3(t) {
  return St.fromHex(Ou(t)).toHex(!1);
}
function C3(t, e) {
  t = au(t);
  const [n, r] = Ga(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return wo(r, 1) + ln.fromHex(n).toCompactHex();
}
function Du() {
  return {
    type: Y.MessageSignature,
    data: it(new Uint8Array(ec))
  };
}
function Jp(t, e, n, r) {
  const i = Pu(0, t, 1, [Mi(e)]).hash160, s = Ni(e) ? oe.Compressed : oe.Uncompressed;
  return {
    hashMode: t,
    signer: i,
    nonce: Ue(n),
    fee: Ue(r),
    keyEncoding: s,
    signature: Du()
  };
}
function ao(t) {
  return "signature" in t;
}
function Bd(t) {
  return t === qt.P2SH || t === qt.P2WSH;
}
function T3(t) {
  return t === qt.P2SHNonSequential || t === qt.P2WSHNonSequential;
}
function Md(t) {
  const e = Tl(t);
  return e.nonce = 0, e.fee = 0, ao(e) ? e.signature = Du() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function B3(t) {
  const e = [
    t.hashMode,
    _t(t.signer),
    Xr(t.nonce, 8),
    Xr(t.fee, 8),
    t.keyEncoding,
    _u(t.signature)
  ];
  return he(e);
}
function M3(t) {
  const e = [
    t.hashMode,
    _t(t.signer),
    Xr(t.nonce, 8),
    Xr(t.fee, 8)
  ], n = Mu(t.fields);
  e.push(Nu(n));
  const r = new Uint8Array(2);
  return Fw(r, t.signaturesRequired, 0), e.push(r), he(e);
}
function N3(t, e) {
  const n = it(e.readBytes(20)), r = BigInt(`0x${it(e.readBytes(8))}`), i = BigInt(`0x${it(e.readBytes(8))}`), s = e.readUInt8Enum(oe, (a) => {
    throw new Oe(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === qt.P2WPKH && s != oe.Compressed)
    throw new Oe("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = kl(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    keyEncoding: s,
    signature: o
  };
}
function _3(t, e) {
  const n = it(e.readBytes(20)), r = BigInt("0x" + it(e.readBytes(8))), i = BigInt("0x" + it(e.readBytes(8))), s = Vp(e, Y.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const f of s)
    switch (f.contents.type) {
      case Y.PublicKey:
        Ni(f.contents.data) || (o = !0);
        break;
      case Y.MessageSignature:
        if (f.pubKeyEncoding === oe.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new as("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === qt.P2WSH || t === qt.P2WSHNonSequential))
    throw new as("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: c
  };
}
function Mc(t) {
  return ao(t) ? B3(t) : M3(t);
}
function Nc(t) {
  const e = t.readUInt8Enum(qt, (n) => {
    throw new Oe(`Could not parse ${n} as AddressHashMode`);
  });
  return e === qt.P2PKH || e === qt.P2WPKH ? N3(e, t) : _3(e, t);
}
function tg(t, e, n, r) {
  const s = t + it(new Uint8Array([e])) + it(Xr(n, 8)) + it(Xr(r, 8));
  if (_t(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Hu(_t(s));
}
function eg(t, e, n) {
  const r = 33 + ec, i = Ni(e.data) ? oe.Compressed : oe.Uncompressed, s = t + y3(i.toString(16)) + n, o = _t(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Hu(o);
}
function P3(t, e, n, r, i) {
  const s = tg(t, e, n, r), o = C3(i, s), a = Mi(I3(i)), c = eg(s, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function ng(t, e, n, r, i, s) {
  const o = tg(t, e, n, r), a = Mi(v3(o, s, i)), c = eg(o, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function U3() {
  const t = Jp(qt.P2PKH, "", 0, 0);
  return t.signer = MS().hash160, t.keyEncoding = oe.Compressed, t.signature = Du(), t;
}
function Nd(t, e, n) {
  return ao(t) ? H3(t, e, n) : O3(t, e, n);
}
function H3(t, e, n) {
  const { pubKey: r, nextSigHash: i } = ng(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), s = Pu(0, t.hashMode, 1, [r]).hash160;
  if (s !== t.signer)
    throw new as(`Signer hash does not equal hash of public key(s): ${s} != ${t.signer}`);
  return i;
}
function O3(t, e, n) {
  const r = [];
  let i = e, s = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case Y.PublicKey:
        Ni(c.contents.data) || (s = !0), r.push(c.contents);
        break;
      case Y.MessageSignature:
        c.pubKeyEncoding === oe.Uncompressed && (s = !0);
        const { pubKey: f, nextSigHash: h } = ng(i, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Bd(t.hashMode) && (i = h), r.push(f), o += 1, o === 65536)
          throw new as("Too many signatures");
        break;
    }
  if (Bd(t.hashMode) && o !== t.signaturesRequired || T3(t.hashMode) && o < t.signaturesRequired)
    throw new as("Incorrect number of signatures");
  if (s && (t.hashMode === qt.P2WSH || t.hashMode === qt.P2WSHNonSequential))
    throw new as("Uncompressed keys are not allowed in this hash mode");
  const a = Pu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new as(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return i;
}
function rg(t) {
  return {
    authType: le.Standard,
    spendingCondition: t
  };
}
function sg(t, e) {
  return {
    authType: le.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Jp(qt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function _d(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case le.Standard:
        return rg(Md(t.spendingCondition));
      case le.Sponsored:
        return sg(Md(t.spendingCondition), U3());
      default:
        throw new La("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function D3(t, e) {
  switch (t.authType) {
    case le.Standard:
      return Nd(t.spendingCondition, e, le.Standard);
    case le.Sponsored:
      return Nd(t.spendingCondition, e, le.Standard);
    default:
      throw new La("Invalid origin auth type");
  }
}
function F3(t, e) {
  switch (t.authType) {
    case le.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Ue(e)
      };
      return { ...t, spendingCondition: n };
    case le.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Ue(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function j3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Ue(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function z3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Ue(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function R3(t, e) {
  const n = {
    ...e,
    nonce: Ue(e.nonce),
    fee: Ue(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function G3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case le.Standard:
      e.push(Mc(t.spendingCondition));
      break;
    case le.Sponsored:
      e.push(Mc(t.spendingCondition)), e.push(Mc(t.sponsorSpendingCondition));
      break;
  }
  return he(e);
}
function K3(t) {
  const e = t.readUInt8Enum(le, (r) => {
    throw new Oe(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case le.Standard:
      return n = Nc(t), rg(n);
    case le.Sponsored:
      n = Nc(t);
      const r = Nc(t);
      return sg(n, r);
  }
}
class V3 {
  constructor({ auth: e, payload: n, postConditions: r = Mu([]), postConditionMode: i = ka.Deny, transactionVersion: s, chainId: o, network: a = "mainnet" }) {
    a = mx(a), this.transactionVersion = s ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Ue(n.amount)
    } : this.payload = n, this.postConditionMode = i, this.postConditions = r, this.anchorMode = sn.Any;
  }
  signBegin() {
    const e = Tl(this);
    return e.auth = _d(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Tl(this);
    return e.auth = _d(e.auth), e.txid();
  }
  verifyOrigin() {
    return D3(this.auth, this.verifyBegin());
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
    const n = typeof e == "object" && "type" in e ? e : Mi(e), r = this.auth.spendingCondition;
    if (r && !ao(r)) {
      const i = Ni(n.data);
      r.fields.push(ai(i ? oe.Compressed : oe.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, i) {
    const { nextSig: s, nextSigHash: o } = P3(n, r, e.fee, e.nonce, i);
    if (ao(e))
      e.signature = $l(s);
    else {
      const a = Qp(i);
      e.fields.push(ai(a ? oe.Compressed : oe.Uncompressed, $l(s)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return Hu(e);
  }
  setSponsor(e) {
    if (this.auth.authType != le.Sponsored)
      throw new La("Cannot sponsor sign a non-sponsored transaction");
    this.auth = R3(this.auth, e);
  }
  setFee(e) {
    this.auth = F3(this.auth, e);
  }
  setNonce(e) {
    this.auth = j3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != le.Sponsored)
      throw new La("Cannot sponsor sign a non-sponsored transaction");
    this.auth = z3(this.auth, e);
  }
  serialize() {
    return it(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new oi('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new oi('"chainId" is undefined');
    if (this.auth === void 0)
      throw new oi('"auth" is undefined');
    if (this.payload === void 0)
      throw new oi('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return ws(n, this.chainId, 0), e.push(n), e.push(G3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Nu(this.postConditions)), e.push(Xp(this.payload)), he(e);
  }
}
function q3(t) {
  const e = Je(t, Wt) ? t : new Wt(t), n = e.readUInt8Enum(Is, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = e.readUInt32BE(), i = K3(e), s = e.readUInt8Enum(sn, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), o = e.readUInt8Enum(ka, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = Vp(e, Y.PostCondition), c = VS(e), f = new V3({
    transactionVersion: n,
    chainId: r,
    auth: i,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return f.anchorMode = s, f;
}
const Pd = BigInt("18446744073709551615");
function _c(t) {
  const e = Ue(t);
  if (e < 0n || e > Pd)
    throw new RangeError(`Post-condition amount must be between 0 and ${Pd} (u64 max), received: ${e}`);
  return e;
}
var Bl;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Bl || (Bl = {}));
var Ml;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Ml || (Ml = {}));
function X3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: Y.PostCondition,
        conditionType: ee.STX,
        principal: t.address === "origin" ? { type: Y.Principal, prefix: Fe.Origin } : qi(t.address),
        conditionCode: Vo(t.condition),
        amount: _c(t.amount)
      };
    case "ft-postcondition":
      return {
        type: Y.PostCondition,
        conditionType: ee.Fungible,
        principal: t.address === "origin" ? { type: Y.Principal, prefix: Fe.Origin } : qi(t.address),
        conditionCode: Vo(t.condition),
        amount: _c(t.amount),
        asset: Cd(t.asset)
      };
    case "nft-postcondition":
      return {
        type: Y.PostCondition,
        conditionType: ee.NonFungible,
        principal: t.address === "origin" ? { type: Y.Principal, prefix: Fe.Origin } : qi(t.address),
        conditionCode: Vo(t.condition),
        asset: Cd(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: Y.PostCondition,
        conditionType: ee.Staking,
        principal: t.address === "origin" ? { type: Y.Principal, prefix: Fe.Origin } : qi(t.address),
        conditionCode: Vo(t.condition),
        amount: _c(t.amount)
      };
    case "pox-postcondition":
      return {
        type: Y.PostCondition,
        conditionType: ee.PoX,
        principal: t.address === "origin" ? { type: Y.Principal, prefix: Fe.Origin } : qi(t.address),
        conditionCode: W3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Vo(t) {
  return Bl[t];
}
function W3(t) {
  return Ml[t];
}
function ig(t) {
  const e = X3(t);
  return GS(e);
}
function Y3(t, e, n) {
  return ju(og(t), n);
}
function og(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = co(r);
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
    return BigInt(`0x${J3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Fu(t, e = 8) {
  return (typeof t == "bigint" ? t : og(t)).toString(16).padStart(e * 2, "0");
}
function ju(t, e = 16) {
  const n = Fu(t, e);
  return co(n);
}
function Z3(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const Q3 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function J3(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Q3[n];
  return e;
}
function co(t) {
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
function zu(t) {
  return new TextEncoder().encode(t);
}
function tE(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function eE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Ud(t) {
  if (t.some(eE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Ru(...t) {
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
function fr(t) {
  return Ru(...t.map((e) => typeof e == "number" ? Ud([e]) : e instanceof Array ? Ud(e) : e));
}
function sc(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Nl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Nl || (Nl = {}));
Nl.Mainnet;
const nE = 128, rE = 128, ag = 16;
var _l;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(_l || (_l = {}));
var Hd;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Hd || (Hd = {}));
var Od;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Od || (Od = {}));
var Ln;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ln || (Ln = {}));
const Pc = ["onChainOnly", "offChainOnly", "any"];
Pc[0] + "", Ln.OnChainOnly, Pc[1] + "", Ln.OffChainOnly, Pc[2] + "", Ln.Any, Ln.OnChainOnly + "", Ln.OnChainOnly, Ln.OffChainOnly + "", Ln.OffChainOnly, Ln.Any + "", Ln.Any;
var Pl;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Pl || (Pl = {}));
Pl.Mainnet;
var Dd;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Dd || (Dd = {}));
var rs;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(rs || (rs = {}));
var Fd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Fd || (Fd = {}));
var jd;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(jd || (jd = {}));
var zd;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(zd || (zd = {}));
var Rd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Rd || (Rd = {}));
var Gd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Gd || (Gd = {}));
var Kd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Kd || (Kd = {}));
var Ul;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ul || (Ul = {}));
var Vd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Vd || (Vd = {}));
var qd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(qd || (qd = {}));
function Hl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function sE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function cg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function iE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Hl(t.outputLen), Hl(t.blockLen);
}
function oE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function aE(t, e) {
  cg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Uc = {
  number: Hl,
  bool: sE,
  bytes: cg,
  hash: iE,
  exists: oE,
  output: aE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Hc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Fn = (t, e) => t << 32 - e | t >>> e, cE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!cE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function lE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function lg(t) {
  if (typeof t == "string" && (t = lE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let uE = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function js(t) {
  const e = (r) => t().update(lg(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function fE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let Gu = class extends uE {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Hc(this.buffer);
  }
  update(e) {
    Uc.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = lg(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Hc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Uc.exists(this), Uc.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    fE(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Hc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      a.setUint32(4 * l, h[l], s);
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
const dE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ug = Uint8Array.from({ length: 16 }, (t, e) => e), hE = ug.map((t) => (9 * t + 5) % 16);
let Ku = [ug], Vu = [hE];
for (let t = 0; t < 4; t++)
  for (let e of [Ku, Vu])
    e.push(e[t].map((n) => dE[n]));
const fg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), pE = Ku.map((t, e) => t.map((n) => fg[e][n])), gE = Vu.map((t, e) => t.map((n) => fg[e][n])), yE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), wE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), qo = (t, e) => t << e | t >>> 32 - e;
function Xd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Xo = new Uint32Array(16);
let bE = class extends Gu {
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
    for (let p = 0; p < 16; p++, n += 4)
      Xo[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, f = this.h3 | 0, h = f, l = this.h4 | 0, b = l;
    for (let p = 0; p < 5; p++) {
      const S = 4 - p, x = yE[p], C = wE[p], D = Ku[p], H = Vu[p], g = pE[p], k = gE[p];
      for (let I = 0; I < 16; I++) {
        const U = qo(r + Xd(p, s, a, f) + Xo[D[I]] + x, g[I]) + l | 0;
        r = l, l = f, f = qo(a, 10) | 0, a = s, s = U;
      }
      for (let I = 0; I < 16; I++) {
        const U = qo(i + Xd(S, o, c, h) + Xo[H[I]] + C, k[I]) + b | 0;
        i = b, b = h, h = qo(c, 10) | 0, c = o, o = U;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + f + b | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Xo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
js(() => new bE());
const mE = (t, e, n) => t & e ^ ~t & n, xE = (t, e, n) => t & e ^ t & n ^ e & n, SE = new Uint32Array([
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
let dg = class extends Gu {
  constructor() {
    super(64, 32, 8, !1), this.A = Mr[0] | 0, this.B = Mr[1] | 0, this.C = Mr[2] | 0, this.D = Mr[3] | 0, this.E = Mr[4] | 0, this.F = Mr[5] | 0, this.G = Mr[6] | 0, this.H = Mr[7] | 0;
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
      Nr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = Nr[l - 15], p = Nr[l - 2], S = Fn(b, 7) ^ Fn(b, 18) ^ b >>> 3, x = Fn(p, 17) ^ Fn(p, 19) ^ p >>> 10;
      Nr[l] = x + Nr[l - 7] + S + Nr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: f, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const b = Fn(a, 6) ^ Fn(a, 11) ^ Fn(a, 25), p = h + b + mE(a, c, f) + SE[l] + Nr[l] | 0, x = (Fn(r, 2) ^ Fn(r, 13) ^ Fn(r, 22)) + xE(r, i, s) | 0;
      h = f, f = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, i, s, o, a, c, f, h);
  }
  roundClean() {
    Nr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, EE = class extends dg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
js(() => new dg());
js(() => new EE());
const Wo = BigInt(2 ** 32 - 1), Ol = BigInt(32);
function hg(t, e = !1) {
  return e ? { h: Number(t & Wo), l: Number(t >> Ol & Wo) } : { h: Number(t >> Ol & Wo) | 0, l: Number(t & Wo) | 0 };
}
function AE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = hg(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const vE = (t, e) => BigInt(t >>> 0) << Ol | BigInt(e >>> 0), $E = (t, e, n) => t >>> n, IE = (t, e, n) => t << 32 - n | e >>> n, kE = (t, e, n) => t >>> n | e << 32 - n, LE = (t, e, n) => t << 32 - n | e >>> n, CE = (t, e, n) => t << 64 - n | e >>> n - 32, TE = (t, e, n) => t >>> n - 32 | e << 64 - n, BE = (t, e) => e, ME = (t, e) => t, NE = (t, e, n) => t << n | e >>> 32 - n, _E = (t, e, n) => e << n | t >>> 32 - n, PE = (t, e, n) => e << n - 32 | t >>> 64 - n, UE = (t, e, n) => t << n - 32 | e >>> 64 - n;
function HE(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const OE = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), DE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, FE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), jE = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, zE = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), RE = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, bt = {
  fromBig: hg,
  split: AE,
  toBig: vE,
  shrSH: $E,
  shrSL: IE,
  rotrSH: kE,
  rotrSL: LE,
  rotrBH: CE,
  rotrBL: TE,
  rotr32H: BE,
  rotr32L: ME,
  rotlSH: NE,
  rotlSL: _E,
  rotlBH: PE,
  rotlBL: UE,
  add: HE,
  add3L: OE,
  add3H: DE,
  add4L: FE,
  add4H: jE,
  add5H: RE,
  add5L: zE
}, [GE, KE] = bt.split([
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
].map((t) => BigInt(t))), _r = new Uint32Array(80), Pr = new Uint32Array(80);
let ic = class extends Gu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: f, El: h, Fh: l, Fl: b, Gh: p, Gl: S, Hh: x, Hl: C } = this;
    return [e, n, r, i, s, o, a, c, f, h, l, b, p, S, x, C];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, f, h, l, b, p, S, x, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = p | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let g = 0; g < 16; g++, n += 4)
      _r[g] = e.getUint32(n), Pr[g] = e.getUint32(n += 4);
    for (let g = 16; g < 80; g++) {
      const k = _r[g - 15] | 0, I = Pr[g - 15] | 0, U = bt.rotrSH(k, I, 1) ^ bt.rotrSH(k, I, 8) ^ bt.shrSH(k, I, 7), K = bt.rotrSL(k, I, 1) ^ bt.rotrSL(k, I, 8) ^ bt.shrSL(k, I, 7), R = _r[g - 2] | 0, q = Pr[g - 2] | 0, E = bt.rotrSH(R, q, 19) ^ bt.rotrBH(R, q, 61) ^ bt.shrSH(R, q, 6), T = bt.rotrSL(R, q, 19) ^ bt.rotrBL(R, q, 61) ^ bt.shrSL(R, q, 6), M = bt.add4L(K, T, Pr[g - 7], Pr[g - 16]), B = bt.add4H(M, U, E, _r[g - 7], _r[g - 16]);
      _r[g] = B | 0, Pr[g] = M | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: f, Dl: h, Eh: l, El: b, Fh: p, Fl: S, Gh: x, Gl: C, Hh: D, Hl: H } = this;
    for (let g = 0; g < 80; g++) {
      const k = bt.rotrSH(l, b, 14) ^ bt.rotrSH(l, b, 18) ^ bt.rotrBH(l, b, 41), I = bt.rotrSL(l, b, 14) ^ bt.rotrSL(l, b, 18) ^ bt.rotrBL(l, b, 41), U = l & p ^ ~l & x, K = b & S ^ ~b & C, R = bt.add5L(H, I, K, KE[g], Pr[g]), q = bt.add5H(R, D, k, U, GE[g], _r[g]), E = R | 0, T = bt.rotrSH(r, i, 28) ^ bt.rotrBH(r, i, 34) ^ bt.rotrBH(r, i, 39), M = bt.rotrSL(r, i, 28) ^ bt.rotrBL(r, i, 34) ^ bt.rotrBL(r, i, 39), B = r & s ^ r & a ^ s & a, J = i & o ^ i & c ^ o & c;
      D = x | 0, H = C | 0, x = p | 0, C = S | 0, p = l | 0, S = b | 0, { h: l, l: b } = bt.add(f | 0, h | 0, q | 0, E | 0), f = a | 0, h = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const F = bt.add3L(E, M, J);
      r = bt.add3H(F, q, T, B), i = F | 0;
    }
    ({ h: r, l: i } = bt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = bt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = bt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: h } = bt.add(this.Dh | 0, this.Dl | 0, f | 0, h | 0), { h: l, l: b } = bt.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: p, l: S } = bt.add(this.Fh | 0, this.Fl | 0, p | 0, S | 0), { h: x, l: C } = bt.add(this.Gh | 0, this.Gl | 0, x | 0, C | 0), { h: D, l: H } = bt.add(this.Hh | 0, this.Hl | 0, D | 0, H | 0), this.set(r, i, s, o, a, c, f, h, l, b, p, S, x, C, D, H);
  }
  roundClean() {
    _r.fill(0), Pr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, VE = class extends ic {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, qE = class extends ic {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, XE = class extends ic {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
js(() => new ic());
js(() => new VE());
js(() => new qE());
js(() => new XE());
function WE(t, e, n) {
  const i = nE;
  if (fA(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: _l.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: i
  };
}
var ve;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(ve || (ve = {}));
let YE = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, pg = class extends YE {
  constructor(e) {
    super(e);
  }
};
function oc(t) {
  const e = [];
  return e.push(co(Fu(t.version, 1))), e.push(co(t.hash160)), fr(e);
}
function ZE(t) {
  const e = [];
  return e.push(t.prefix), e.push(oc(t.address)), t.prefix === Ul.Contract && e.push(lo(t.contractName)), fr(e);
}
function lo(t) {
  const e = [], n = zu(t.content), r = n.byteLength;
  return e.push(co(Fu(r, t.lengthPrefixBytes))), e.push(n), fr(e);
}
function QE(t) {
  const e = [];
  return e.push(oc(t.address)), e.push(lo(t.contractName)), e.push(lo(t.assetName)), fr(e);
}
function gg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(ZE(t.principal)), (t.conditionType === rs.Fungible || t.conditionType === rs.NonFungible) && e.push(QE(t.assetInfo)), t.conditionType === rs.NonFungible && e.push(Ls(t.assetName)), e.push(t.conditionCode), t.conditionType === rs.STX || t.conditionType === rs.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new pg("The post-condition amount may not be larger than 8 bytes");
    e.push(Y3(t.amount, !1, 8));
  }
  return fr(e);
}
function Qn(t, e) {
  return fr([t, e]);
}
function JE(t) {
  return new Uint8Array([t.type]);
}
function tA(t) {
  return t.type === ve.OptionalNone ? new Uint8Array([t.type]) : Qn(t.type, Ls(t.value));
}
function eA(t) {
  const e = new Uint8Array(4);
  return sc(e, t.buffer.length, 0), Qn(t.type, Ru(e, t.buffer));
}
function nA(t) {
  const e = ju(Z3(t.value, BigInt(rE)), ag);
  return Qn(t.type, e);
}
function rA(t) {
  const e = ju(t.value, ag);
  return Qn(t.type, e);
}
function sA(t) {
  return Qn(t.type, oc(t.address));
}
function iA(t) {
  return Qn(t.type, Ru(oc(t.address), lo(t.contractName)));
}
function oA(t) {
  return Qn(t.type, Ls(t.value));
}
function aA(t) {
  const e = [], n = new Uint8Array(4);
  sc(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const i = Ls(r);
    e.push(i);
  }
  return Qn(t.type, fr(e));
}
function cA(t) {
  const e = [], n = new Uint8Array(4);
  sc(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = WE(i);
    e.push(lo(s));
    const o = Ls(t.data[i]);
    e.push(o);
  }
  return Qn(t.type, fr(e));
}
function yg(t, e) {
  const n = [], r = e == "ascii" ? tE(t.data) : zu(t.data), i = new Uint8Array(4);
  return sc(i, r.length, 0), n.push(i), n.push(r), Qn(t.type, fr(n));
}
function lA(t) {
  return yg(t, "ascii");
}
function uA(t) {
  return yg(t, "utf8");
}
function Ls(t) {
  switch (t.type) {
    case ve.BoolTrue:
    case ve.BoolFalse:
      return JE(t);
    case ve.OptionalNone:
    case ve.OptionalSome:
      return tA(t);
    case ve.Buffer:
      return eA(t);
    case ve.UInt:
      return rA(t);
    case ve.Int:
      return nA(t);
    case ve.PrincipalStandard:
      return sA(t);
    case ve.PrincipalContract:
      return iA(t);
    case ve.ResponseOk:
    case ve.ResponseErr:
      return oA(t);
    case ve.List:
      return aA(t);
    case ve.Tuple:
      return cA(t);
    case ve.StringASCII:
      return lA(t);
    case ve.StringUTF8:
      return uA(t);
    default:
      throw new pg("Unable to serialize. Invalid Clarity Value.");
  }
}
const fA = (t, e) => t ? zu(t).length > e : !1, dA = "connect-ui";
let ua, wg, on = !1, Dl = !1;
const ur = (t, e = "") => () => {
}, hA = (t, e) => () => {
}, pA = "{visibility:hidden}.hydrated{visibility:inherit}", Wd = {}, gA = "http://www.w3.org/2000/svg", yA = "http://www.w3.org/1999/xhtml", wA = (t) => t != null, qu = (t) => (t = typeof t, t === "object" || t === "function");
function bg(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const pt = (t, e, ...n) => {
  let r = null, i = !1, s = !1;
  const o = [], a = (f) => {
    for (let h = 0; h < f.length; h++)
      r = f[h], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((i = typeof t != "function" && !qu(r)) && (r = String(r)), i && s ? o[o.length - 1].$text$ += r : o.push(i ? Fl(null, r) : r), s = i);
  };
  if (a(n), e) {
    const f = e.className || e.class;
    f && (e.class = typeof f != "object" ? f : Object.keys(f).filter((h) => f[h]).join(" "));
  }
  const c = Fl(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Fl = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, bA = {}, mA = (t) => t && t.$tag$ === bA, xA = (t, e) => t != null && !qu(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, SA = (t) => _i(t).$hostElement$, EA = (t, e, n) => {
  const r = Pe.ce(e, n);
  return t.dispatchEvent(r), r;
}, Yd = /* @__PURE__ */ new WeakMap(), AA = (t, e, n) => {
  let r = Ca.get(t);
  RA && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Ca.set(t, r);
}, vA = (t, e, n, r) => {
  var i;
  let s = mg(e);
  const o = Ca.get(s);
  if (t = t.nodeType === 11 ? t : qn, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Yd.get(t), c;
      if (a || Yd.set(t, a = /* @__PURE__ */ new Set()), !a.has(s)) {
        {
          c = qn.createElement("style"), c.innerHTML = o;
          const f = (i = Pe.$nonce$) !== null && i !== void 0 ? i : bg(qn);
          f != null && c.setAttribute("nonce", f), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(s);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return s;
}, $A = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, i = ur("attachStyles", e.$tagName$), s = vA(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = s, n.classList.add(s + "-h")), i();
}, mg = (t, e) => "sc-" + t.$tagName$, Zd = (t, e, n, r, i, s) => {
  if (n !== r) {
    let o = Jd(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, f = Qd(n), h = Qd(r);
      c.remove(...f.filter((l) => l && !h.includes(l))), c.add(...h.filter((l) => l && !f.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Jd(ac, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Pe.rel(t, e, n, !1), r && Pe.ael(t, e, r, !1);
    else {
      const c = qu(r);
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
}, IA = /\s/, Qd = (t) => t ? t.split(IA) : [], xg = (t, e, n, r) => {
  const i = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, s = t && t.$attrs$ || Wd, o = e.$attrs$ || Wd;
  for (r in s)
    r in o || Zd(i, r, s[r], void 0, n, e.$flags$);
  for (r in o)
    Zd(i, r, s[r], o[r], n, e.$flags$);
}, Xu = (t, e, n, r) => {
  const i = e.$children$[n];
  let s = 0, o, a;
  if (i.$text$ !== null)
    o = i.$elm$ = qn.createTextNode(i.$text$);
  else {
    if (on || (on = i.$tag$ === "svg"), o = i.$elm$ = qn.createElementNS(on ? gA : yA, i.$tag$), on && i.$tag$ === "foreignObject" && (on = !1), xg(null, i, on), wA(ua) && o["s-si"] !== ua && o.classList.add(o["s-si"] = ua), i.$children$)
      for (s = 0; s < i.$children$.length; ++s)
        a = Xu(t, i, s), a && o.appendChild(a);
    i.$tag$ === "svg" ? on = !1 : o.tagName === "foreignObject" && (on = !0);
  }
  return o;
}, Sg = (t, e, n, r, i, s) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === wg && (o = o.shadowRoot); i <= s; ++i)
    r[i] && (a = Xu(null, n, i), a && (r[i].$elm$ = a, o.insertBefore(a, e)));
}, Eg = (t, e, n, r, i) => {
  for (; e <= n; ++e)
    (r = t[e]) && (i = r.$elm$, i.remove());
}, kA = (t, e, n, r) => {
  let i = 0, s = 0, o = e.length - 1, a = e[0], c = e[o], f = r.length - 1, h = r[0], l = r[f], b;
  for (; i <= o && s <= f; )
    a == null ? a = e[++i] : c == null ? c = e[--o] : h == null ? h = r[++s] : l == null ? l = r[--f] : Yo(a, h) ? (Yi(a, h), a = e[++i], h = r[++s]) : Yo(c, l) ? (Yi(c, l), c = e[--o], l = r[--f]) : Yo(a, l) ? (Yi(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++i], l = r[--f]) : Yo(c, h) ? (Yi(c, h), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], h = r[++s]) : (b = Xu(e && e[s], n, s), h = r[++s], b && a.$elm$.parentNode.insertBefore(b, a.$elm$));
  i > o ? Sg(t, r[f + 1] == null ? null : r[f + 1].$elm$, n, r, s, f) : s > f && Eg(e, i, o);
}, Yo = (t, e) => t.$tag$ === e.$tag$, Yi = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, i = e.$children$, s = e.$tag$, o = e.$text$;
  o === null ? (on = s === "svg" ? !0 : s === "foreignObject" ? !1 : on, xg(t, e, on), r !== null && i !== null ? kA(n, r, e, i) : i !== null ? (t.$text$ !== null && (n.textContent = ""), Sg(n, null, e, i, 0, i.length - 1)) : r !== null && Eg(r, 0, r.length - 1), on && s === "svg" && (on = !1)) : t.$text$ !== o && (n.data = o);
}, LA = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Fl(null, null), i = mA(e) ? e : pt(null, null, e);
  wg = n.tagName, i.$tag$ = null, i.$flags$ |= 4, t.$vnode$ = i, i.$elm$ = r.$elm$ = n.shadowRoot || n, ua = n["s-sc"], Yi(r, i);
}, Ag = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Wu = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Ag(t, t.$ancestorComponent$), KA(() => CA(t, e));
}, CA = (t, e) => {
  const n = ur("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let i;
  return n(), NA(i, () => TA(t, r, e));
}, TA = async (t, e, n) => {
  const r = t.$hostElement$, i = ur("update", t.$cmpMeta$.$tagName$), s = r["s-rc"];
  n && $A(t);
  const o = ur("render", t.$cmpMeta$.$tagName$);
  BA(t, e), s && (s.map((a) => a()), r["s-rc"] = void 0), o(), i();
  {
    const a = r["s-p"], c = () => MA(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, BA = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, LA(t, e);
  } catch (r) {
    uo(r, t.$hostElement$);
  }
  return null;
}, MA = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = ur("postUpdate", e), i = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, $g(n), r(), t.$onReadyResolve$(n), i || vg()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Zu(() => Wu(t, !1)), t.$flags$ &= -517;
}, vg = (t) => {
  $g(qn.documentElement), Zu(() => EA(ac, "appload", { detail: { namespace: dA } }));
}, NA = (t, e) => t && t.then ? t.then(e) : e(), $g = (t) => t.classList.add("hydrated"), _A = (t, e) => _i(t).$instanceValues$.get(e), PA = (t, e, n, r) => {
  const i = _i(t), s = i.$instanceValues$.get(e), o = i.$flags$, a = i.$lazyInstance$;
  n = xA(n, r.$members$[e][0]);
  const c = Number.isNaN(s) && Number.isNaN(n), f = n !== s && !c;
  (!(o & 8) || s === void 0) && f && (i.$instanceValues$.set(e, n), a && (o & 18) === 2 && Wu(i, !1));
}, Ig = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), i = t.prototype;
    if (r.map(([s, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(i, s, {
        get() {
          return _A(this, s);
        },
        set(a) {
          PA(this, s, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const s = /* @__PURE__ */ new Map();
      i.attributeChangedCallback = function(o, a, c) {
        Pe.jmp(() => {
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
}, UA = async (t, e, n, r, i) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, i = zA(n), i.then) {
        const c = hA();
        i = await i, c();
      }
      i.isProxied || (Ig(
        i,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), i.isProxied = !0);
      const a = ur("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new i(e);
      } catch (c) {
        uo(c);
      }
      e.$flags$ &= -9, a();
    }
    if (i.style) {
      let a = i.style;
      const c = mg(n);
      if (!Ca.has(c)) {
        const f = ur("registerStyles", n.$tagName$);
        AA(c, a, !!(n.$flags$ & 1)), f();
      }
    }
  }
  const s = e.$ancestorComponent$, o = () => Wu(e, !0);
  s && s["s-rc"] ? s["s-rc"].push(o) : o();
}, HA = (t) => {
  if (!(Pe.$flags$ & 1)) {
    const e = _i(t), n = e.$cmpMeta$, r = ur("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let i = t;
        for (; i = i.parentNode || i.host; )
          if (i["s-p"]) {
            Ag(e, e.$ancestorComponent$ = i);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([i, [s]]) => {
        if (s & 31 && t.hasOwnProperty(i)) {
          const o = t[i];
          delete t[i], t[i] = o;
        }
      }), UA(t, e, n);
    }
    r();
  }
}, OA = (t) => {
  Pe.$flags$ & 1 || _i(t);
}, DA = (t, e = {}) => {
  var n;
  const r = ur(), i = [], s = e.exclude || [], o = ac.customElements, a = qn.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), f = /* @__PURE__ */ qn.createElement("style"), h = [];
  let l, b = !0;
  Object.assign(Pe, e), Pe.$resourcesUrl$ = new URL(e.resourcesUrl || "./", qn.baseURI).href, t.map((p) => {
    p[1].map((S) => {
      const x = {
        $flags$: S[0],
        $tagName$: S[1],
        $members$: S[2],
        $listeners$: S[3]
      };
      x.$members$ = S[2];
      const C = x.$tagName$, D = class extends HTMLElement {
        // StencilLazyHost
        constructor(H) {
          super(H), H = this, jA(H, x), x.$flags$ & 1 && H.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), b ? h.push(this) : Pe.jmp(() => HA(this));
        }
        disconnectedCallback() {
          Pe.jmp(() => OA(this));
        }
        componentOnReady() {
          return _i(this).$onReadyPromise$;
        }
      };
      x.$lazyBundleId$ = p[0], !s.includes(C) && !o.get(C) && (i.push(C), o.define(C, Ig(
        D,
        x,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    f.innerHTML = i + pA, f.setAttribute("data-styles", "");
    const p = (n = Pe.$nonce$) !== null && n !== void 0 ? n : bg(qn);
    p != null && f.setAttribute("nonce", p), a.insertBefore(f, c ? c.nextSibling : a.firstChild);
  }
  b = !1, h.length ? h.map((p) => p.connectedCallback()) : Pe.jmp(() => l = setTimeout(vg, 30)), r();
}, Yu = /* @__PURE__ */ new WeakMap(), _i = (t) => Yu.get(t), FA = (t, e) => Yu.set(e.$lazyInstance$ = t, e), jA = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], Yu.set(t, n);
}, Jd = (t, e) => e in t, uo = (t, e) => (0, console.error)(t, e), Oc = /* @__PURE__ */ new Map(), zA = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), i = t.$lazyBundleId$, s = Oc.get(i);
  if (s)
    return s[r];
  {
    const o = (a) => (Oc.set(i, a), a[r]);
    switch (i) {
      case "connect-modal":
        return Promise.resolve().then(() => u$).then(o, uo);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${i}.entry.js`
  ).then((o) => (Oc.set(i, o), o[r]), uo);
}, Ca = /* @__PURE__ */ new Map(), ac = typeof window < "u" ? window : {}, qn = ac.document || { head: {} }, Pe = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, kg = (t) => Promise.resolve(t), RA = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), th = [], Lg = [], GA = (t, e) => (n) => {
  t.push(n), Dl || (Dl = !0, Pe.$flags$ & 4 ? Zu(jl) : Pe.raf(jl));
}, eh = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      uo(n);
    }
  t.length = 0;
}, jl = () => {
  eh(th), eh(Lg), (Dl = th.length > 0) && Pe.raf(jl);
}, Zu = (t) => kg().then(t), KA = /* @__PURE__ */ GA(Lg), VA = () => kg(), qA = (t, e) => typeof window > "u" ? Promise.resolve() : VA().then(() => DA([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var XA = Object.defineProperty, WA = Object.defineProperties, YA = Object.getOwnPropertyDescriptors, Ta = Object.getOwnPropertySymbols, Cg = Object.prototype.hasOwnProperty, Tg = Object.prototype.propertyIsEnumerable, nh = (t, e, n) => e in t ? XA(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, fn = (t, e) => {
  for (var n in e || (e = {})) Cg.call(e, n) && nh(t, n, e[n]);
  if (Ta) for (var n of Ta(e)) Tg.call(e, n) && nh(t, n, e[n]);
  return t;
}, _n = (t, e) => WA(t, YA(e)), Bg = (t, e) => {
  var n = {};
  for (var r in t) Cg.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Ta) for (var r of Ta(t)) e.indexOf(r) < 0 && Tg.call(t, r) && (n[r] = t[r]);
  return n;
};
function Mg() {
  return tc(Es()) || window.StacksProvider || window.BlockstackProvider;
}
function cc(t) {
  return t ? typeof t == "string" ? vs.fromName(t) : "version" in t ? t : "url" in t ? new gl({ url: t.url }) : t.transactionVersion === Is.Mainnet ? new gl({ url: t.client.baseUrl }) : new yl({ url: t.client.baseUrl }) : new yl();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var ZA = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(ZA || {}), QA = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(QA || {}), Qu = (t) => {
  let e = t;
  if (!e) {
    let n = new l0(["store_write"], document.location.href);
    e = new pl({ appConfig: n });
  }
  return e;
};
function Ng(t) {
  try {
    return Qu(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var _g = (t) => {
  let e = Qu(t).loadUserData().appPrivateKey, n = Te.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function JA(t) {
  var e;
  let { stxAddress: n, userSession: r, network: i } = t;
  if (n) return n;
  if (!r || !i) return;
  let s = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [$s.Mainnet]: "mainnet", [$s.Testnet]: "testnet" }, a = cc(i);
  return s == null ? void 0 : s[o[a.chainId]];
}
function t4(t) {
  let e = cc(t.network), n = Qu(t.userSession), r = _n(fn({}, t), { network: e, userSession: n });
  return fn({ stxAddress: JA(r) }, r);
}
async function e4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(ig) : n = n.map((r) => it(gg(r)))), new Te.TokenSigner("ES256k", e).signAsync(_n(fn({}, t), { postConditions: n }));
}
function n4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(ig) : e = e.map((n) => it(gg(n)))), Te.createUnsecuredToken(_n(fn({}, t), { postConditions: e }));
}
var r4 = async ({ token: t, options: e }, n) => {
  var r, i, s;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = _t(a.replace(/^0x/, "")), f = q3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, _n(fn({}, o), { stacksTransaction: f }));
      return;
    }
    (i = e.onFinish) == null || i.call(e, _n(fn({}, o), { stacksTransaction: f }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (s = e.onCancel) == null || s.call(e);
  }
}, s4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: i } = e, s = Bg(e, ["amount", "appDetails", "userSession"]);
  if (Ng(i)) {
    let { privateKey: a, publicKey: c } = _g(i), f = _n(fn({}, s), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (f.appDetails = r), e4(f, a);
  }
  let o = _n(fn({}, s), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), n4(o);
};
async function i4(t, e, n) {
  let r = await e(_n(fn(fn({}, t4(t)), t), { network: cc(t.network) }));
  return r4({ token: r, options: t }, n);
}
function o4(t, e = Mg()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return i4(t, s4, e);
}
function Pg(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? _n(fn({}, t), { message: Td(e), domain: Td(n) }) : _n(fn({}, t), { message: it(Ls(e)), domain: it(Ls(n)) });
}
async function a4(t, e) {
  return new Te.TokenSigner("ES256k", e).signAsync(Pg(t));
}
async function c4(t) {
  let e = t, { userSession: n } = e, r = Bg(e, ["userSession"]);
  if (Ng(n)) {
    let { privateKey: i, publicKey: s } = _g(n), o = _n(fn({}, r), { publicKey: s });
    return a4(o, i);
  }
  return Te.createUnsecuredToken(Pg(t));
}
var l4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(l4 || {}), Ug = "asigna-stx", rh = (t, e) => new Promise((n) => {
  function r(i) {
    i.data.source === Ug && i.data[e] && (n(i.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(f4(t, e), "*");
}), u4 = { authenticationRequest: async (t) => rh(t, "authenticationRequest"), transactionRequest: async (t) => rh(t, "transactionRequest") }, f4 = (t, e) => ({ source: Ug, [e]: t }), d4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = u4);
};
d4();
var h4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function p4(t, e = !0) {
  return function(n, r) {
    var i;
    if (r) return t(n, r);
    let s = Es(), o = Mg();
    if (s && o) return t(n, o);
    if (typeof window > "u") return;
    qA();
    let a = (i = n == null ? void 0 : n.defaultProviders) != null ? i : h4, c = ix(a), f = document.createElement("connect-modal");
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
    let b = (p) => {
      p.key === "Escape" && (document.removeEventListener("keydown", b), f.remove());
    };
    document.addEventListener("keydown", b);
  };
}
var Zo = p4(o4);
function Wr(t, e, n) {
  return Ju(Re(t, e), n);
}
function Re(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = re(r);
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
      const r = w4(BigInt(`0x${vt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${vt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function sh(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function vo(t, e = 8) {
  return (typeof t == "bigint" ? t : Re(t, !1)).toString(16).padStart(e * 2, "0");
}
function lc(t) {
  return parseInt(t, 16);
}
function Ju(t, e = 16) {
  const n = vo(t, e);
  return re(n);
}
function g4(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function y4(t, e) {
  return t & BigInt(1) << e;
}
function w4(t, e) {
  return y4(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const b4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function vt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += b4[n];
  return e;
}
function re(t) {
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
function Pi(t) {
  return new TextEncoder().encode(t);
}
function tf(t) {
  return new TextDecoder().decode(t);
}
function Hg(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function m4(t) {
  return String.fromCharCode.apply(null, t);
}
function x4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function ih(t) {
  if (t.some(x4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function uc(...t) {
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
  return uc(...t.map((e) => typeof e == "number" ? ih([e]) : e instanceof Array ? ih(e) : e));
}
var oh;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(oh || (oh = {}));
var ah;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ah || (ah = {}));
var ch;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ch || (ch = {}));
const Og = 33, Dc = 32;
function S4(t) {
  if (t.length < Dc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Dc * 2), r = t.slice(2 + Dc * 2);
  return {
    recoveryId: lc(e),
    r: n,
    s: r
  };
}
function E4(t) {
  const e = typeof t == "string" ? re(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function A4(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function v4(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function $4(t, e) {
  return t[e];
}
function I4(t, e, n = 0) {
  return t[n] = e, t;
}
function k4(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Cs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var zl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(zl || (zl = {}));
const L4 = zl.Mainnet, C4 = 128, T4 = 128, Dg = 16, ps = 32, Rl = 80, fc = 65, B4 = 32, M4 = 64, Ba = 34;
var nt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(nt || (nt = {}));
var xt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(xt || (xt = {}));
var Gl;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Gl || (Gl = {}));
var Ze;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ze || (Ze = {}));
const fa = ["onChainOnly", "offChainOnly", "any"], lh = {
  [fa[0]]: Ze.OnChainOnly,
  [fa[1]]: Ze.OffChainOnly,
  [fa[2]]: Ze.Any,
  [Ze.OnChainOnly]: Ze.OnChainOnly,
  [Ze.OffChainOnly]: Ze.OffChainOnly,
  [Ze.Any]: Ze.Any
};
function N4(t) {
  if (t in lh)
    return lh[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${fa.join(", ")}`);
}
var Ma;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ma || (Ma = {}));
Ma.Mainnet;
var $i;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})($i || ($i = {}));
var Qe;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Qe || (Qe = {}));
var ue;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ue || (ue = {}));
var Xt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Xt || (Xt = {}));
var Na;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Na || (Na = {}));
var ae;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ae || (ae = {}));
var fo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(fo || (fo = {}));
var Kl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Kl || (Kl = {}));
var ho;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ho || (ho = {}));
var uh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(uh || (uh = {}));
var fh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(fh || (fh = {}));
function Vl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function _4(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Fg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function P4(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Vl(t.outputLen), Vl(t.blockLen);
}
function U4(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function H4(t, e) {
  Fg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ls = {
  number: Vl,
  bool: _4,
  bytes: Fg,
  hash: P4,
  exists: U4,
  output: H4
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Fc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), jn = (t, e) => t << 32 - e | t >>> e, O4 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!O4)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function D4(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function ef(t) {
  if (typeof t == "string" && (t = D4(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class jg {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function zs(t) {
  const e = (r) => t().update(ef(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function F4(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
class nf extends jg {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Fc(this.buffer);
  }
  update(e) {
    ls.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = ef(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Fc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ls.exists(this), ls.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    F4(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Fc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, h = this.get();
    if (f > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < f; l++)
      a.setUint32(4 * l, h[l], s);
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
const j4 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), zg = Uint8Array.from({ length: 16 }, (t, e) => e), z4 = zg.map((t) => (9 * t + 5) % 16);
let rf = [zg], sf = [z4];
for (let t = 0; t < 4; t++)
  for (let e of [rf, sf])
    e.push(e[t].map((n) => j4[n]));
const Rg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), R4 = rf.map((t, e) => t.map((n) => Rg[e][n])), G4 = sf.map((t, e) => t.map((n) => Rg[e][n])), K4 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), V4 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Qo = (t, e) => t << e | t >>> 32 - e;
function dh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Jo = new Uint32Array(16);
class q4 extends nf {
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
    for (let p = 0; p < 16; p++, n += 4)
      Jo[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, f = this.h3 | 0, h = f, l = this.h4 | 0, b = l;
    for (let p = 0; p < 5; p++) {
      const S = 4 - p, x = K4[p], C = V4[p], D = rf[p], H = sf[p], g = R4[p], k = G4[p];
      for (let I = 0; I < 16; I++) {
        const U = Qo(r + dh(p, s, a, f) + Jo[D[I]] + x, g[I]) + l | 0;
        r = l, l = f, f = Qo(a, 10) | 0, a = s, s = U;
      }
      for (let I = 0; I < 16; I++) {
        const U = Qo(i + dh(S, o, c, h) + Jo[H[I]] + C, k[I]) + b | 0;
        i = b, b = h, h = Qo(c, 10) | 0, c = o, o = U;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + f + b | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Jo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const X4 = zs(() => new q4()), W4 = (t, e, n) => t & e ^ ~t & n, Y4 = (t, e, n) => t & e ^ t & n ^ e & n, Z4 = new Uint32Array([
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
]), Ur = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Hr = new Uint32Array(64);
class Gg extends nf {
  constructor() {
    super(64, 32, 8, !1), this.A = Ur[0] | 0, this.B = Ur[1] | 0, this.C = Ur[2] | 0, this.D = Ur[3] | 0, this.E = Ur[4] | 0, this.F = Ur[5] | 0, this.G = Ur[6] | 0, this.H = Ur[7] | 0;
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
      Hr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const b = Hr[l - 15], p = Hr[l - 2], S = jn(b, 7) ^ jn(b, 18) ^ b >>> 3, x = jn(p, 17) ^ jn(p, 19) ^ p >>> 10;
      Hr[l] = x + Hr[l - 7] + S + Hr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: f, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const b = jn(a, 6) ^ jn(a, 11) ^ jn(a, 25), p = h + b + W4(a, c, f) + Z4[l] + Hr[l] | 0, x = (jn(r, 2) ^ jn(r, 13) ^ jn(r, 22)) + Y4(r, i, s) | 0;
      h = f, f = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, h = h + this.H | 0, this.set(r, i, s, o, a, c, f, h);
  }
  roundClean() {
    Hr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Q4 extends Gg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const of = zs(() => new Gg());
zs(() => new Q4());
const ta = BigInt(2 ** 32 - 1), ql = BigInt(32);
function Kg(t, e = !1) {
  return e ? { h: Number(t & ta), l: Number(t >> ql & ta) } : { h: Number(t >> ql & ta) | 0, l: Number(t & ta) | 0 };
}
function J4(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Kg(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const t8 = (t, e) => BigInt(t >>> 0) << ql | BigInt(e >>> 0), e8 = (t, e, n) => t >>> n, n8 = (t, e, n) => t << 32 - n | e >>> n, r8 = (t, e, n) => t >>> n | e << 32 - n, s8 = (t, e, n) => t << 32 - n | e >>> n, i8 = (t, e, n) => t << 64 - n | e >>> n - 32, o8 = (t, e, n) => t >>> n - 32 | e << 64 - n, a8 = (t, e) => e, c8 = (t, e) => t, l8 = (t, e, n) => t << n | e >>> 32 - n, u8 = (t, e, n) => e << n | t >>> 32 - n, f8 = (t, e, n) => e << n - 32 | t >>> 64 - n, d8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function h8(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const p8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), g8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, y8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), w8 = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, b8 = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), m8 = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, mt = {
  fromBig: Kg,
  split: J4,
  toBig: t8,
  shrSH: e8,
  shrSL: n8,
  rotrSH: r8,
  rotrSL: s8,
  rotrBH: i8,
  rotrBL: o8,
  rotr32H: a8,
  rotr32L: c8,
  rotlSH: l8,
  rotlSL: u8,
  rotlBH: f8,
  rotlBL: d8,
  add: h8,
  add3L: p8,
  add3H: g8,
  add4L: y8,
  add4H: w8,
  add5H: m8,
  add5L: b8
}, [x8, S8] = mt.split([
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
].map((t) => BigInt(t))), Or = new Uint32Array(80), Dr = new Uint32Array(80);
class dc extends nf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: f, El: h, Fh: l, Fl: b, Gh: p, Gl: S, Hh: x, Hl: C } = this;
    return [e, n, r, i, s, o, a, c, f, h, l, b, p, S, x, C];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, f, h, l, b, p, S, x, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = b | 0, this.Gh = p | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let g = 0; g < 16; g++, n += 4)
      Or[g] = e.getUint32(n), Dr[g] = e.getUint32(n += 4);
    for (let g = 16; g < 80; g++) {
      const k = Or[g - 15] | 0, I = Dr[g - 15] | 0, U = mt.rotrSH(k, I, 1) ^ mt.rotrSH(k, I, 8) ^ mt.shrSH(k, I, 7), K = mt.rotrSL(k, I, 1) ^ mt.rotrSL(k, I, 8) ^ mt.shrSL(k, I, 7), R = Or[g - 2] | 0, q = Dr[g - 2] | 0, E = mt.rotrSH(R, q, 19) ^ mt.rotrBH(R, q, 61) ^ mt.shrSH(R, q, 6), T = mt.rotrSL(R, q, 19) ^ mt.rotrBL(R, q, 61) ^ mt.shrSL(R, q, 6), M = mt.add4L(K, T, Dr[g - 7], Dr[g - 16]), B = mt.add4H(M, U, E, Or[g - 7], Or[g - 16]);
      Or[g] = B | 0, Dr[g] = M | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: f, Dl: h, Eh: l, El: b, Fh: p, Fl: S, Gh: x, Gl: C, Hh: D, Hl: H } = this;
    for (let g = 0; g < 80; g++) {
      const k = mt.rotrSH(l, b, 14) ^ mt.rotrSH(l, b, 18) ^ mt.rotrBH(l, b, 41), I = mt.rotrSL(l, b, 14) ^ mt.rotrSL(l, b, 18) ^ mt.rotrBL(l, b, 41), U = l & p ^ ~l & x, K = b & S ^ ~b & C, R = mt.add5L(H, I, K, S8[g], Dr[g]), q = mt.add5H(R, D, k, U, x8[g], Or[g]), E = R | 0, T = mt.rotrSH(r, i, 28) ^ mt.rotrBH(r, i, 34) ^ mt.rotrBH(r, i, 39), M = mt.rotrSL(r, i, 28) ^ mt.rotrBL(r, i, 34) ^ mt.rotrBL(r, i, 39), B = r & s ^ r & a ^ s & a, J = i & o ^ i & c ^ o & c;
      D = x | 0, H = C | 0, x = p | 0, C = S | 0, p = l | 0, S = b | 0, { h: l, l: b } = mt.add(f | 0, h | 0, q | 0, E | 0), f = a | 0, h = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const F = mt.add3L(E, M, J);
      r = mt.add3H(F, q, T, B), i = F | 0;
    }
    ({ h: r, l: i } = mt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = mt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = mt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: h } = mt.add(this.Dh | 0, this.Dl | 0, f | 0, h | 0), { h: l, l: b } = mt.add(this.Eh | 0, this.El | 0, l | 0, b | 0), { h: p, l: S } = mt.add(this.Fh | 0, this.Fl | 0, p | 0, S | 0), { h: x, l: C } = mt.add(this.Gh | 0, this.Gl | 0, x | 0, C | 0), { h: D, l: H } = mt.add(this.Hh | 0, this.Hl | 0, D | 0, H | 0), this.set(r, i, s, o, a, c, f, h, l, b, p, S, x, C, D, H);
  }
  roundClean() {
    Or.fill(0), Dr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class E8 extends dc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class A8 extends dc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class v8 extends dc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
zs(() => new dc());
zs(() => new E8());
const $8 = zs(() => new A8());
zs(() => new v8());
function Vg(t) {
  if (re(t).byteLength != fc)
    throw Error("Invalid signature");
  return {
    type: nt.MessageSignature,
    data: t
  };
}
function Zi(t, e) {
  return { type: nt.Address, version: t, hash160: e };
}
function ci(t) {
  return Ds.c32address(t.version, t.hash160);
}
function Ts(t, e, n) {
  const r = e || 1, i = n || C4;
  if (ly(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: nt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function af(t) {
  const e = Ds.c32addressDecode(t);
  return {
    type: nt.Address,
    version: e[0],
    hash160: e[1]
  };
}
var z;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(z || (z = {}));
function I8(t) {
  if (t.type === z.PrincipalStandard)
    return ci(t.address);
  if (t.type === z.PrincipalContract)
    return `${ci(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function qg(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return C8(e, n);
  } else
    return k8(t);
}
function k8(t) {
  const e = af(t);
  return { type: z.PrincipalStandard, address: e };
}
function L8(t) {
  return { type: z.PrincipalStandard, address: t };
}
function C8(t, e) {
  const n = af(t), r = Ts(e);
  return Xg(n, r);
}
function Xg(t, e) {
  if (Pi(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: z.PrincipalContract, address: t, contractName: e };
}
function jc(t, e = !1) {
  switch (t.type) {
    case z.BoolTrue:
      return !0;
    case z.BoolFalse:
      return !1;
    case z.Int:
    case z.UInt:
      return e ? t.value.toString() : t.value;
    case z.Buffer:
      return `0x${vt(t.buffer)}`;
    case z.OptionalNone:
      return null;
    case z.OptionalSome:
      return Gn(t.value);
    case z.ResponseErr:
      return Gn(t.value);
    case z.ResponseOk:
      return Gn(t.value);
    case z.PrincipalStandard:
    case z.PrincipalContract:
      return I8(t);
    case z.List:
      return t.list.map((r) => Gn(r));
    case z.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Gn(t.data[r]);
      }), n;
    case z.StringASCII:
      return t.data;
    case z.StringUTF8:
      return t.data;
  }
}
function Gn(t) {
  switch (t.type) {
    case z.ResponseErr:
      return { type: zr(t), value: jc(t, !0), success: !1 };
    case z.ResponseOk:
      return { type: zr(t), value: jc(t, !0), success: !0 };
    default:
      return { type: zr(t), value: jc(t, !0) };
  }
}
function zr(t) {
  switch (t.type) {
    case z.BoolTrue:
    case z.BoolFalse:
      return "bool";
    case z.Int:
      return "int";
    case z.UInt:
      return "uint";
    case z.Buffer:
      return `(buff ${t.buffer.length})`;
    case z.OptionalNone:
      return "(optional none)";
    case z.OptionalSome:
      return `(optional ${zr(t.value)})`;
    case z.ResponseErr:
      return `(response UnknownType ${zr(t.value)})`;
    case z.ResponseOk:
      return `(response ${zr(t.value)} UnknownType)`;
    case z.PrincipalStandard:
    case z.PrincipalContract:
      return "principal";
    case z.List:
      return `(list ${t.list.length} ${t.list.length ? zr(t.list[0]) : "UnknownType"})`;
    case z.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${zr(t.data[e])})`).join(" ")})`;
    case z.StringASCII:
      return `(string-ascii ${Hg(t.data).length})`;
    case z.StringUTF8:
      return `(string-utf8 ${Pi(t.data).length})`;
  }
}
const Wg = () => ({ type: z.BoolTrue }), Yg = () => ({ type: z.BoolFalse }), T8 = (t) => t ? Wg() : Yg(), hh = BigInt("0xffffffffffffffffffffffffffffffff"), B8 = BigInt(0), ph = BigInt("0x7fffffffffffffffffffffffffffffff"), gh = BigInt("-170141183460469231731687303715884105728"), M8 = (t) => {
  const e = Re(t, !0);
  if (e > ph)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${ph}`);
  if (e < gh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${gh}`);
  return { type: z.Int, value: e };
}, Xn = (t) => {
  const e = Re(t, !1);
  if (e < B8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > hh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${hh}`);
  return { type: z.UInt, value: e };
}, Zg = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: z.Buffer, buffer: t };
};
function Qg() {
  return { type: z.OptionalNone };
}
function Jg(t) {
  return { type: z.OptionalSome, value: t };
}
function N8(t) {
  return { type: z.ResponseErr, value: t };
}
function _8(t) {
  return { type: z.ResponseOk, value: t };
}
function P8(t) {
  return { type: z.List, list: t };
}
function Bs(t) {
  for (const e in t)
    if (!vv(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: z.Tuple, data: t };
}
const Ce = (t) => ({ type: z.StringASCII, data: t }), U8 = (t) => ({ type: z.StringUTF8, data: t });
class ty extends jg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ls.hash(e);
    const r = ef(n);
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
    return ls.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ls.exists(this), ls.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const ey = (t, e, n) => new ty(t, e).update(n).digest();
ey.create = (t, e) => new ty(t, e);
fe.hmacSha256Sync = (t, ...e) => {
  const n = ey.create(of, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Ii(t) {
  return {
    type: nt.PublicKey,
    data: re(t)
  };
}
function H8(t, e, n = ae.Compressed) {
  const r = S4(e.data), i = new ln(sh(r.r), sh(r.s)), s = St.fromSignature(t, i, r.recoveryId), o = n === ae.Compressed;
  return s.toHex(o);
}
function O8(t) {
  return { type: nt.PublicKey, data: t };
}
function Ui(t) {
  return !vt(t.data).startsWith("04");
}
function _a(t) {
  return t.data.slice();
}
function D8(t) {
  const e = z8(t), n = mo(e.data.slice(0, 32), e.compressed);
  return Ii(vt(n));
}
function F8(t) {
  const e = typeof t == "string" ? t : vt(t), n = St.fromHex(e).toHex(!0);
  return Ii(n);
}
function j8(t) {
  const e = typeof t == "string" ? t : vt(t), n = St.fromHex(e).toHex(!1);
  return Ii(n);
}
function Xl(t) {
  const e = t.readUInt8(), n = e === 4 ? M4 : B4;
  return O8(pe([e, t.readBytes(n)]));
}
function z8(t) {
  const e = E4(t), n = e.length == Og;
  return { data: e, compressed: n };
}
function R8(t, e) {
  const [n, r] = Ga(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const s = vo(r, 1) + ln.fromHex(n).toCompactHex();
  return Vg(s);
}
function G8(t) {
  return D8(t.data);
}
function K8(t, e, n) {
  return typeof t == "string" && (t = qg(t)), typeof n == "string" && (n = bh(n)), {
    type: nt.Payload,
    payloadType: xt.TokenTransfer,
    recipient: t,
    amount: Re(e, !1),
    memo: n ?? bh("")
  };
}
function V8(t, e, n, r) {
  return typeof t == "string" && (t = af(t)), typeof e == "string" && (e = Ts(e)), typeof n == "string" && (n = Ts(n)), {
    type: nt.Payload,
    payloadType: xt.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function yh(t, e, n) {
  return typeof t == "string" && (t = Ts(t)), typeof e == "string" && (e = ev(e)), typeof n == "number" ? {
    type: nt.Payload,
    payloadType: xt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: nt.Payload,
    payloadType: xt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function q8() {
  return { type: nt.Payload, payloadType: xt.PoisonMicroblock };
}
function wh(t, e) {
  if (t.byteLength != ps)
    throw Error(`Coinbase buffer size must be ${ps} bytes`);
  return e != null ? {
    type: nt.Payload,
    payloadType: xt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: nt.Payload,
    payloadType: xt.Coinbase,
    coinbaseBytes: t
  };
}
function X8(t, e, n) {
  if (t.byteLength != ps)
    throw Error(`Coinbase buffer size must be ${ps} bytes`);
  if (n.byteLength != Rl)
    throw Error(`VRF proof buffer size must be ${Rl} bytes`);
  return {
    type: nt.Payload,
    payloadType: xt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === z.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Wl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Wl || (Wl = {}));
function W8(t, e, n, r, i, s, o) {
  return {
    type: nt.Payload,
    payloadType: xt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: i,
    cause: s,
    publicKeyHash: o
  };
}
function ny(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case xt.TokenTransfer:
      e.push(de(t.recipient)), e.push(Wr(t.amount, !1, 8)), e.push(ir(t.memo));
      break;
    case xt.ContractCall:
      e.push(ir(t.contractAddress)), e.push(ir(t.contractName)), e.push(ir(t.functionName));
      const n = new Uint8Array(4);
      Cs(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(de(r));
      });
      break;
    case xt.SmartContract:
      e.push(ir(t.contractName)), e.push(ir(t.codeBody));
      break;
    case xt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(ir(t.contractName)), e.push(ir(t.codeBody));
      break;
    case xt.PoisonMicroblock:
      break;
    case xt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case xt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(de(t.recipient));
      break;
    case xt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(de(t.recipient ? Jg(t.recipient) : Qg())), e.push(t.vrfProof);
      break;
    case xt.TenureChange:
      e.push(re(t.tenureHash)), e.push(re(t.previousTenureHash)), e.push(re(t.burnViewHash)), e.push(re(t.previousTenureEnd)), e.push(Cs(new Uint8Array(4), t.previousTenureBlocks)), e.push(I4(new Uint8Array(1), t.cause)), e.push(re(t.publicKeyHash));
      break;
  }
  return pe(e);
}
function Y8(t) {
  switch (t.readUInt8Enum(xt, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case xt.TokenTransfer:
      const n = Sn(t), r = Re(t.readBytes(8), !1), i = sy(t);
      return K8(n, r, i);
    case xt.ContractCall:
      const s = ki(t), o = xn(t), a = xn(t), c = [], f = t.readUInt32BE();
      for (let g = 0; g < f; g++) {
        const k = Sn(t);
        c.push(k);
      }
      return V8(s, o, a, c);
    case xt.SmartContract:
      const h = xn(t), l = xn(t, 4, 1e5);
      return yh(h, l);
    case xt.VersionedSmartContract: {
      const g = t.readUInt8Enum(Gl, (U) => {
        throw new Error(`Cannot recognize ClarityVersion: ${U}`);
      }), k = xn(t), I = xn(t, 4, 1e5);
      return yh(k, I, g);
    }
    case xt.PoisonMicroblock:
      return q8();
    case xt.Coinbase: {
      const g = t.readBytes(ps);
      return wh(g);
    }
    case xt.CoinbaseToAltRecipient: {
      const g = t.readBytes(ps), k = Sn(t);
      return wh(g, k);
    }
    case xt.NakamotoCoinbase: {
      const g = t.readBytes(ps), k = Sn(t), I = t.readBytes(Rl);
      return X8(g, k, I);
    }
    case xt.TenureChange:
      const b = vt(t.readBytes(20)), p = vt(t.readBytes(20)), S = vt(t.readBytes(20)), x = vt(t.readBytes(32)), C = t.readUInt32BE(), D = t.readUInt8Enum(Wl, (g) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${g}`);
      }), H = vt(t.readBytes(20));
      return W8(b, p, S, x, C, D, H);
  }
}
class hc extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class ss extends hc {
  constructor(e) {
    super(e);
  }
}
class cn extends hc {
  constructor(e) {
    super(e);
  }
}
class Pa extends hc {
  constructor(e) {
    super(e);
  }
}
class us extends hc {
  constructor(e) {
    super(e);
  }
}
var Tn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Tn || (Tn = {}));
function Yl(t) {
  return Vg(vt(t.readBytes(fc)));
}
function li(t, e) {
  return {
    pubKeyEncoding: t,
    type: nt.TransactionAuthField,
    contents: e
  };
}
function Z8(t) {
  const e = t.readUInt8Enum(Tn, (n) => {
    throw new cn(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case Tn.PublicKeyCompressed:
      return li(ae.Compressed, Xl(t));
    case Tn.PublicKeyUncompressed:
      return li(ae.Uncompressed, j8(Xl(t).data));
    case Tn.SignatureCompressed:
      return li(ae.Compressed, Yl(t));
    case Tn.SignatureUncompressed:
      return li(ae.Uncompressed, Yl(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function cf(t) {
  return re(t.data);
}
function Q8(t) {
  const e = [];
  switch (t.contents.type) {
    case nt.PublicKey:
      e.push(t.pubKeyEncoding === ae.Compressed ? Tn.PublicKeyCompressed : Tn.PublicKeyUncompressed), e.push(_a(F8(t.contents.data)));
      break;
    case nt.MessageSignature:
      e.push(t.pubKeyEncoding === ae.Compressed ? Tn.SignatureCompressed : Tn.SignatureUncompressed), e.push(cf(t.contents));
      break;
  }
  return pe(e);
}
function ir(t) {
  switch (t.type) {
    case nt.Address:
      return $o(t);
    case nt.Principal:
      return ry(t);
    case nt.LengthPrefixedString:
      return Li(t);
    case nt.MemoString:
      return nv(t);
    case nt.AssetInfo:
      return iy(t);
    case nt.PostCondition:
      return rv(t);
    case nt.PublicKey:
      return _a(t);
    case nt.LengthPrefixedList:
      return ff(t);
    case nt.Payload:
      return ny(t);
    case nt.TransactionAuthField:
      return Q8(t);
    case nt.MessageSignature:
      return cf(t);
  }
}
function J8() {
  return {
    type: nt.Address,
    version: Na.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function lf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Xt.SerializeP2PKH || e === Xt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Xt.SerializeP2WPKH || e === Xt.SerializeP2WSH || e === Xt.SerializeP2WSHNonSequential) && !r.every(Ui))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Xt.SerializeP2PKH:
      return Zi(t, xv(r[0].data));
    case Xt.SerializeP2WPKH:
      return Zi(t, Sv(r[0].data));
    case Xt.SerializeP2SH:
    case Xt.SerializeP2SHNonSequential:
      return Zi(t, Ev(n, r.map(_a)));
    case Xt.SerializeP2WSH:
    case Xt.SerializeP2WSHNonSequential:
      return Zi(t, Av(n, r.map(_a)));
  }
}
function $o(t) {
  const e = [];
  return e.push(re(vo(t.version, 1))), e.push(re(t.hash160)), pe(e);
}
function ki(t) {
  const e = lc(vt(t.readBytes(1))), n = vt(t.readBytes(20));
  return { type: nt.Address, version: e, hash160: n };
}
function ry(t) {
  const e = [];
  return e.push(t.prefix), e.push($o(t.address)), t.prefix === ho.Contract && e.push(Li(t.contractName)), pe(e);
}
function tv(t) {
  const e = t.readUInt8Enum(ho, (i) => {
    throw new cn(`Unexpected Principal payload type: ${i}`);
  }), n = ki(t);
  if (e === ho.Standard)
    return { type: nt.Principal, prefix: e, address: n };
  const r = xn(t);
  return {
    type: nt.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Li(t) {
  const e = [], n = Pi(t.content), r = n.byteLength;
  return e.push(re(vo(r, t.lengthPrefixBytes))), e.push(n), pe(e);
}
function xn(t, e, n) {
  e = e || 1;
  const r = lc(vt(t.readBytes(e))), i = tf(t.readBytes(r));
  return Ts(i, e, n ?? 128);
}
function ev(t) {
  return Ts(t, 4, 1e5);
}
function bh(t) {
  if (t && ly(t, Ba))
    throw new Error(`Memo exceeds maximum length of ${Ba} bytes`);
  return { type: nt.MemoString, content: t };
}
function nv(t) {
  const e = [], n = Pi(t.content), r = mv(vt(n), Ba * 2);
  return e.push(re(r)), pe(e);
}
function sy(t) {
  let e = tf(t.readBytes(Ba));
  return e = e.replace(/\u0000*$/, ""), { type: nt.MemoString, content: e };
}
function iy(t) {
  const e = [];
  return e.push($o(t.address)), e.push(Li(t.contractName)), e.push(Li(t.assetName)), pe(e);
}
function Zl(t) {
  return {
    type: nt.AssetInfo,
    address: ki(t),
    contractName: xn(t),
    assetName: xn(t)
  };
}
function uf(t, e) {
  return {
    type: nt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function ff(t) {
  const e = t.values, n = [];
  n.push(re(vo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(ir(r));
  return pe(n);
}
function oy(t, e, n) {
  const r = lc(vt(t.readBytes(4))), i = [];
  for (let s = 0; s < r; s++)
    switch (e) {
      case nt.Address:
        i.push(ki(t));
        break;
      case nt.LengthPrefixedString:
        i.push(xn(t));
        break;
      case nt.MemoString:
        i.push(sy(t));
        break;
      case nt.AssetInfo:
        i.push(Zl(t));
        break;
      case nt.PostCondition:
        i.push(sv(t));
        break;
      case nt.PublicKey:
        i.push(Xl(t));
        break;
      case nt.TransactionAuthField:
        i.push(Z8(t));
        break;
    }
  return uf(i, n);
}
function rv(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(ry(t.principal)), (t.conditionType === Qe.Fungible || t.conditionType === Qe.NonFungible) && e.push(iy(t.assetInfo)), t.conditionType === Qe.NonFungible && e.push(de(t.assetName)), e.push(t.conditionCode), t.conditionType === Qe.STX || t.conditionType === Qe.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new ss("The post-condition amount may not be larger than 8 bytes");
    e.push(Wr(t.amount, !1, 8));
  }
  return pe(e);
}
function sv(t) {
  const e = t.readUInt8Enum(Qe, (o) => {
    throw new cn(`Could not read ${o} as PostConditionType`);
  }), n = tv(t);
  let r, i, s;
  switch (e) {
    case Qe.STX:
      return r = t.readUInt8Enum(fo, (a) => {
        throw new cn(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${vt(t.readBytes(8))}`), {
        type: nt.PostCondition,
        conditionType: Qe.STX,
        principal: n,
        conditionCode: r,
        amount: s
      };
    case Qe.Fungible:
      return i = Zl(t), r = t.readUInt8Enum(fo, (a) => {
        throw new cn(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${vt(t.readBytes(8))}`), {
        type: nt.PostCondition,
        conditionType: Qe.Fungible,
        principal: n,
        conditionCode: r,
        amount: s,
        assetInfo: i
      };
    case Qe.NonFungible:
      i = Zl(t);
      const o = Sn(t);
      return r = t.readUInt8Enum(Kl, (a) => {
        throw new cn(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: nt.PostCondition,
        conditionType: Qe.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: i,
        assetName: o
      };
  }
}
function Jn(t, e) {
  return pe([t, e]);
}
function iv(t) {
  return new Uint8Array([t.type]);
}
function ov(t) {
  return t.type === z.OptionalNone ? new Uint8Array([t.type]) : Jn(t.type, de(t.value));
}
function av(t) {
  const e = new Uint8Array(4);
  return Cs(e, t.buffer.length, 0), Jn(t.type, uc(e, t.buffer));
}
function cv(t) {
  const e = Ju(g4(t.value, BigInt(T4)), Dg);
  return Jn(t.type, e);
}
function lv(t) {
  const e = Ju(t.value, Dg);
  return Jn(t.type, e);
}
function uv(t) {
  return Jn(t.type, $o(t.address));
}
function fv(t) {
  return Jn(t.type, uc($o(t.address), Li(t.contractName)));
}
function dv(t) {
  return Jn(t.type, de(t.value));
}
function hv(t) {
  const e = [], n = new Uint8Array(4);
  Cs(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const i = de(r);
    e.push(i);
  }
  return Jn(t.type, pe(e));
}
function pv(t) {
  const e = [], n = new Uint8Array(4);
  Cs(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = Ts(i);
    e.push(Li(s));
    const o = de(t.data[i]);
    e.push(o);
  }
  return Jn(t.type, pe(e));
}
function ay(t, e) {
  const n = [], r = e == "ascii" ? Hg(t.data) : Pi(t.data), i = new Uint8Array(4);
  return Cs(i, r.length, 0), n.push(i), n.push(r), Jn(t.type, pe(n));
}
function gv(t) {
  return ay(t, "ascii");
}
function yv(t) {
  return ay(t, "utf8");
}
function de(t) {
  switch (t.type) {
    case z.BoolTrue:
    case z.BoolFalse:
      return iv(t);
    case z.OptionalNone:
    case z.OptionalSome:
      return ov(t);
    case z.Buffer:
      return av(t);
    case z.UInt:
      return lv(t);
    case z.Int:
      return cv(t);
    case z.PrincipalStandard:
      return uv(t);
    case z.PrincipalContract:
      return fv(t);
    case z.ResponseOk:
    case z.ResponseErr:
      return dv(t);
    case z.List:
      return hv(t);
    case z.Tuple:
      return pv(t);
    case z.StringASCII:
      return gv(t);
    case z.StringUTF8:
      return yv(t);
    default:
      throw new ss("Unable to serialize. Invalid Clarity Value.");
  }
}
function wv(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const mh = /* @__PURE__ */ new Map();
function cy(t, e) {
  const n = mh.get(t);
  if (n !== void 0)
    return n(e);
  const r = wv(t);
  return mh.set(t, r), cy(t, e);
}
class no {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return k4(this.readBytes(4), 0);
  }
  readUInt8() {
    return $4(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return A4(this.readBytes(2), 0);
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
    if (cy(e, r))
      return r;
    throw n(r);
  }
}
function Sn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new no(re(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new no(t) : e = t;
  switch (e.readUInt8Enum(z, (r) => {
    throw new cn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case z.Int:
      return M8(e.readBytes(16));
    case z.UInt:
      return Xn(e.readBytes(16));
    case z.Buffer:
      const r = e.readUInt32BE();
      return Zg(e.readBytes(r));
    case z.BoolTrue:
      return Wg();
    case z.BoolFalse:
      return Yg();
    case z.PrincipalStandard:
      const i = ki(e);
      return L8(i);
    case z.PrincipalContract:
      const s = ki(e), o = xn(e);
      return Xg(s, o);
    case z.ResponseOk:
      return _8(Sn(e));
    case z.ResponseErr:
      return N8(Sn(e));
    case z.OptionalNone:
      return Qg();
    case z.OptionalSome:
      return Jg(Sn(e));
    case z.List:
      const a = e.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(Sn(e));
      return P8(c);
    case z.Tuple:
      const f = e.readUInt32BE(), h = {};
      for (let x = 0; x < f; x++) {
        const C = xn(e).content;
        if (C === void 0)
          throw new cn('"content" is undefined');
        h[C] = Sn(e);
      }
      return Bs(h);
    case z.StringASCII:
      const l = e.readUInt32BE(), b = m4(e.readBytes(l));
      return Ce(b);
    case z.StringUTF8:
      const p = e.readUInt32BE(), S = tf(e.readBytes(p));
      return U8(S);
    default:
      throw new cn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const bv = (t) => t.length % 2 == 0 ? t : `0${t}`, mv = (t, e) => t.padEnd(e, "0"), ly = (t, e) => t ? Pi(t).length > e : !1;
function Ql(t) {
  return Lp(t);
}
const po = (t) => X4(of(t)), df = (t) => vt($8(t)), xv = (t) => vt(po(t)), Sv = (t) => {
  const e = po(t), n = uc(new Uint8Array([0]), new Uint8Array([e.length]), e), r = po(n);
  return vt(r);
}, Ev = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + e.length), n.push(174);
  const r = pe(n), i = po(r);
  return vt(i);
}, Av = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = pe(n), i = of(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = pe(s), a = po(o);
  return vt(a);
};
function vv(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function uy(t) {
  const e = de(t);
  return `0x${vt(e)}`;
}
function $v(t) {
  return Sn(t);
}
const fi = (t) => {
  try {
    return Ds.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function hf() {
  return {
    type: nt.MessageSignature,
    data: vt(new Uint8Array(fc))
  };
}
function fy(t, e, n, r) {
  const i = lf(0, t, 1, [Ii(e)]).hash160, s = Ui(Ii(e)) ? ae.Compressed : ae.Uncompressed;
  return {
    hashMode: t,
    signer: i,
    nonce: Re(n, !1),
    fee: Re(r, !1),
    keyEncoding: s,
    signature: hf()
  };
}
function go(t) {
  return "signature" in t;
}
function xh(t) {
  return t === Xt.SerializeP2SH || t === Xt.SerializeP2WSH;
}
function Iv(t) {
  return t === Xt.SerializeP2SHNonSequential || t === Xt.SerializeP2WSHNonSequential;
}
function Sh(t) {
  const e = Ql(t);
  return e.nonce = 0, e.fee = 0, go(e) ? e.signature = hf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function kv(t) {
  const e = [
    t.hashMode,
    re(t.signer),
    Wr(t.nonce, !1, 8),
    Wr(t.fee, !1, 8),
    t.keyEncoding,
    cf(t.signature)
  ];
  return pe(e);
}
function Lv(t) {
  const e = [
    t.hashMode,
    re(t.signer),
    Wr(t.nonce, !1, 8),
    Wr(t.fee, !1, 8)
  ], n = uf(t.fields);
  e.push(ff(n));
  const r = new Uint8Array(2);
  return v4(r, t.signaturesRequired, 0), e.push(r), pe(e);
}
function Cv(t, e) {
  const n = vt(e.readBytes(20)), r = BigInt(`0x${vt(e.readBytes(8))}`), i = BigInt(`0x${vt(e.readBytes(8))}`), s = e.readUInt8Enum(ae, (a) => {
    throw new cn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Xt.SerializeP2WPKH && s != ae.Compressed)
    throw new cn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Yl(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    keyEncoding: s,
    signature: o
  };
}
function Tv(t, e) {
  const n = vt(e.readBytes(20)), r = BigInt("0x" + vt(e.readBytes(8))), i = BigInt("0x" + vt(e.readBytes(8))), s = oy(e, nt.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const f of s)
    switch (f.contents.type) {
      case nt.PublicKey:
        Ui(f.contents) || (o = !0);
        break;
      case nt.MessageSignature:
        if (f.pubKeyEncoding === ae.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new us("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Xt.SerializeP2WSH || t === Xt.SerializeP2WSHNonSequential))
    throw new us("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: c
  };
}
function zc(t) {
  return go(t) ? kv(t) : Lv(t);
}
function Rc(t) {
  const e = t.readUInt8Enum(Xt, (n) => {
    throw new cn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Xt.SerializeP2PKH || e === Xt.SerializeP2WPKH ? Cv(e, t) : Tv(e, t);
}
function dy(t, e, n, r) {
  const s = t + vt(new Uint8Array([e])) + vt(Wr(n, !1, 8)) + vt(Wr(r, !1, 8));
  if (re(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return df(re(s));
}
function hy(t, e, n) {
  const r = 33 + fc, i = Ui(e) ? ae.Compressed : ae.Uncompressed, s = t + bv(i.toString(16)) + n.data, o = re(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return df(o);
}
function Bv(t, e, n, r, i) {
  const s = dy(t, e, n, r), o = R8(i, s), a = G8(i), c = hy(s, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function py(t, e, n, r, i, s) {
  const o = dy(t, e, n, r), a = Ii(H8(o, s, i)), c = hy(o, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function Mv() {
  const t = fy(Xt.SerializeP2PKH, "", 0, 0);
  return t.signer = J8().hash160, t.keyEncoding = ae.Compressed, t.signature = hf(), t;
}
function Eh(t, e, n) {
  return go(t) ? Nv(t, e, n) : _v(t, e, n);
}
function Nv(t, e, n) {
  const { pubKey: r, nextSigHash: i } = py(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), s = lf(0, t.hashMode, 1, [r]).hash160;
  if (s !== t.signer)
    throw new us(`Signer hash does not equal hash of public key(s): ${s} != ${t.signer}`);
  return i;
}
function _v(t, e, n) {
  const r = [];
  let i = e, s = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case nt.PublicKey:
        Ui(c.contents) || (s = !0), r.push(c.contents);
        break;
      case nt.MessageSignature:
        c.pubKeyEncoding === ae.Uncompressed && (s = !0);
        const { pubKey: f, nextSigHash: h } = py(i, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (xh(t.hashMode) && (i = h), r.push(f), o += 1, o === 65536)
          throw new us("Too many signatures");
        break;
    }
  if (xh(t.hashMode) && o !== t.signaturesRequired || Iv(t.hashMode) && o < t.signaturesRequired)
    throw new us("Incorrect number of signatures");
  if (s && (t.hashMode === Xt.SerializeP2WSH || t.hashMode === Xt.SerializeP2WSHNonSequential))
    throw new us("Uncompressed keys are not allowed in this hash mode");
  const a = lf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new us(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return i;
}
function gy(t) {
  return {
    authType: ue.Standard,
    spendingCondition: t
  };
}
function yy(t, e) {
  return {
    authType: ue.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || fy(Xt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Ah(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case ue.Standard:
        return gy(Sh(t.spendingCondition));
      case ue.Sponsored:
        return yy(Sh(t.spendingCondition), Mv());
      default:
        throw new Pa("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Pv(t, e) {
  switch (t.authType) {
    case ue.Standard:
      return Eh(t.spendingCondition, e, ue.Standard);
    case ue.Sponsored:
      return Eh(t.spendingCondition, e, ue.Standard);
    default:
      throw new Pa("Invalid origin auth type");
  }
}
function Uv(t, e) {
  switch (t.authType) {
    case ue.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Re(e, !1)
      };
      return { ...t, spendingCondition: n };
    case ue.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Re(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function Hv(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Re(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function Ov(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Re(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Dv(t, e) {
  const n = {
    ...e,
    nonce: Re(e.nonce, !1),
    fee: Re(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Fv(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case ue.Standard:
      e.push(zc(t.spendingCondition));
      break;
    case ue.Sponsored:
      e.push(zc(t.spendingCondition)), e.push(zc(t.sponsorSpendingCondition));
      break;
  }
  return pe(e);
}
function jv(t) {
  const e = t.readUInt8Enum(ue, (r) => {
    throw new cn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case ue.Standard:
      return n = Rc(t), gy(n);
    case ue.Sponsored:
      n = Rc(t);
      const r = Rc(t);
      return yy(n, r);
  }
}
class zv {
  constructor(e, n, r, i, s, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Re(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? L4, this.postConditionMode = s ?? $i.Deny, this.postConditions = i ?? uf([]), o)
      this.anchorMode = N4(o);
    else
      switch (r.payloadType) {
        case xt.Coinbase:
        case xt.CoinbaseToAltRecipient:
        case xt.NakamotoCoinbase:
        case xt.PoisonMicroblock:
        case xt.TenureChange:
          this.anchorMode = Ze.OnChainOnly;
          break;
        case xt.ContractCall:
        case xt.SmartContract:
        case xt.VersionedSmartContract:
        case xt.TokenTransfer:
          this.anchorMode = Ze.Any;
          break;
      }
  }
  signBegin() {
    const e = Ql(this);
    return e.auth = Ah(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Ql(this);
    return e.auth = Ah(e.auth), e.txid();
  }
  verifyOrigin() {
    return Pv(this.auth, this.verifyBegin());
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
    if (n && !go(n)) {
      const r = Ui(e);
      n.fields.push(li(r ? ae.Compressed : ae.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, i) {
    const { nextSig: s, nextSigHash: o } = Bv(n, r, e.fee, e.nonce, i);
    return go(e) ? e.signature = s : e.fields.push(li(i.data.byteLength === Og ? ae.Compressed : ae.Uncompressed, s)), o;
  }
  txid() {
    const e = this.serialize();
    return df(e);
  }
  setSponsor(e) {
    if (this.auth.authType != ue.Sponsored)
      throw new Pa("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Dv(this.auth, e);
  }
  setFee(e) {
    this.auth = Uv(this.auth, e);
  }
  setNonce(e) {
    this.auth = Hv(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != ue.Sponsored)
      throw new Pa("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Ov(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new ss('"version" is undefined');
    if (this.chainId === void 0)
      throw new ss('"chainId" is undefined');
    if (this.auth === void 0)
      throw new ss('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new ss('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new ss('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return Cs(n, this.chainId, 0), e.push(n), e.push(Fv(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(ff(this.postConditions)), e.push(ny(this.payload)), pe(e);
  }
}
function Ua(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new no(re(t.slice(2))) : e = new no(re(t)) : t instanceof Uint8Array ? e = new no(t) : e = t;
  const n = e.readUInt8Enum(Ma, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), i = jv(e), s = e.readUInt8Enum(Ze, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum($i, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = oy(e, nt.PostCondition), c = Y8(e);
  return new zv(n, i, c, a, o, s, r);
}
const Rv = T8, ro = Xn, Gv = Zg;
const Kv = /* @__PURE__ */ new Set([4001, -31001]), Vv = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], qv = ["result", "data", "payload", "response", "params"], vh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], pc = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Rs = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, cr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, Xv = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), wy = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, i) => !!(r != null && r.id) && n.findIndex((s) => Xv(s, r)) === i
  );
}, by = (t) => t ? wy(Rs()).some(
  (e) => {
    var n;
    return e.id === t && (pc(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, my = () => {
  if (typeof window > "u")
    return;
  const t = Rs(), e = wy(t).filter(
    (n) => {
      var r;
      return pc(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = cr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of Vv) {
    const r = cr(t, n) ?? (t === window ? void 0 : cr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, Wv = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Rs(), n = cr(e, t) ?? (e === window ? void 0 : cr(window, t)) ?? tc(t);
  if (n)
    return n;
  if (pc(t) || by(t))
    return my();
}, ea = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, Yv = ["blockstack-session", "blockstack"], Zv = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of Yv) {
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
Zv();
const xy = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, an = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, Qv = (t) => {
  const e = an(t);
  if (!e)
    return null;
  const n = xy(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, Jv = (t) => {
  const e = an(t);
  if (!e)
    return null;
  const n = xy(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Jl = (t, e = "mainnet") => {
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
      return Jl(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Jl(r, e);
  }
  return e;
}, gs = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, yo = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const i = t.trim();
    return fi(i) ? i : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const i of t) {
      const s = yo(i, e + 1);
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
    const s = yo(n[i], e + 1);
    if (s)
      return s;
  }
  return typeof n.mainnet == "string" && fi(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && fi(n.testnet) ? n.testnet.trim() : null;
}, $h = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Sy = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && Kv.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Ms = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = an(n == null ? void 0 : n.message) ?? an(e.message) ?? an(e.error) ?? an(t) ?? "Wallet provider request failed.", i = new Error(r);
  return i.code = (n == null ? void 0 : n.code) ?? e.code, i.data = (n == null ? void 0 : n.data) ?? e.data, i;
}, Ci = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Ms(e);
    if (e.status === "error")
      throw Ms(e.result ?? e);
  }
  return t;
}, Ih = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Ci(r);
  } catch (r) {
    throw Ms(r);
  }
}, Ey = () => my(), pf = () => {
  if (typeof window > "u")
    return;
  const t = Rs();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = cr(t, e) ?? (t === window ? void 0 : cr(window, e));
    if (n)
      return n;
  }
}, kh = () => {
  if (typeof window > "u")
    return;
  const t = pf();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Rs();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = cr(e, n) ?? (e === window ? void 0 : cr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, da = (t) => {
  var r, i;
  const e = Es();
  if (pc(e) || by(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Rs() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((i = n.xverseProviders) == null ? void 0 : i.StacksProvider) || t === Ey();
}, Gc = (t) => {
  const e = Jv(t);
  if (!e)
    return null;
  try {
    const n = Ua(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Ha = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = Gc(t), r = Qv(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? an(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Ha(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const i = t;
  let s = null;
  for (const a of vh)
    if (Gc(i[a])) {
      s = an(i[a]);
      break;
    }
  const o = an(i.txId) || an(i.txid) || an(i.transactionId);
  if (o)
    return {
      ...i,
      txId: o,
      txid: o,
      txRaw: s ?? an(i.txRaw) ?? void 0
    };
  for (const a of vh) {
    const c = Gc(i[a]);
    if (c)
      return {
        ...i,
        txId: c,
        txid: c,
        txRaw: an(i[a]) ?? void 0
      };
  }
  for (const a of qv) {
    const c = i[a], f = Ha(c, e + 1);
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
}, Kc = (t) => {
  const e = Ha(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, t6 = (t) => {
  const e = Ha(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, e6 = (t) => ({
  ...t,
  fee: gs(t.fee),
  nonce: gs(t.nonce),
  sponsored: t.sponsored === !0
}), Lh = (t) => ({
  recipient: t.recipient,
  amount: gs(t.amount) ?? "0",
  memo: t.memo,
  network: Jl(t.network),
  address: t.stxAddress,
  fee: gs(t.fee),
  nonce: gs(t.nonce),
  sponsored: t.sponsored ?? !1
}), Ay = "WALLET_ADDRESS_MISMATCH", n6 = 45e3;
let so = null;
const tu = (t) => {
  t && (so = { address: t, at: Date.now() });
}, r6 = () => {
  so = null;
}, s6 = () => so && Date.now() - so.at <= n6 ? so.address : null, i6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, o6 = async (t) => {
  r6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = Ci(await t.request("wallet_connect")), n = yo(e);
  return tu(n), n;
}, a6 = async (t, e, n, r) => {
  try {
    return Ci(await t.request(e, n));
  } catch (i) {
    const s = Ms(i);
    if (!i6(s))
      throw s;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: s.message
    });
    let o = null;
    try {
      o = await o6(t);
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
        { code: o ? Ay : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return Ci(await t.request(e, n));
    } catch (a) {
      throw Ms(a);
    }
  }
};
let Ch = 3e4;
const c6 = (t, e) => {
  let n;
  const r = new Promise((i, s) => {
    n = setTimeout(() => {
      s(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${Ch / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Ch);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, l6 = async (t, e, n) => {
  const r = (c, f) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${f}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Ay }
      );
    return c;
  }, i = s6();
  if (i)
    return ea(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: i }), r(i, "cached-session");
  let s = null;
  ea(n, "account-read");
  try {
    const c = Ci(
      await c6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    s = yo(c), console.info("[wallet:xverse-preflight]", {
      stage: s ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: s
    });
  } catch (c) {
    if (Sy(c))
      throw Ms(c);
    ea(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (s)
    return tu(s), r(s, "wallet_getAccount");
  let o;
  ea(n, "account-reconnect");
  try {
    o = Ci(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Ms(c);
  }
  const a = yo(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return tu(a), r(a, "wallet_connect");
}, u6 = async (t, e) => {
  if (!da(t)) {
    const s = await Ih(
      t,
      "stx_transferStx",
      Lh(e)
    );
    return Kc(s);
  }
  const n = pf();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const s = await Ih(
      n,
      "stx_transferStx",
      Lh(e)
    );
    return Kc(s);
  }
  const r = Ey();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await l6(r, e.stxAddress);
  const i = await a6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: gs(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: gs(e.fee) } : {}
    },
    e.stxAddress
  );
  return Kc(i);
}, f6 = () => Es(), vy = () => {
  var r, i;
  if (typeof window > "u")
    return;
  const t = Es(), e = t ? Wv(t) : void 0;
  if (e)
    return e;
  const n = Rs() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((i = n.xverseProviders) == null ? void 0 : i.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Th = (t, e) => {
  const n = vy(), r = e6({
    ...t,
    onFinish: (i) => {
      var s;
      (s = t.onFinish) == null || s.call(t, t6(i));
    }
  });
  if (!n || typeof n.request != "function")
    return Zo(r, e);
  if (da(n) && !pf()) {
    const i = kh();
    if (i)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Es(),
        route: "legacy-transaction-request"
      }), Zo(r, i);
  }
  return void u6(n, t).then((i) => {
    var s;
    (s = t.onFinish) == null || s.call(t, i);
  }).catch((i) => {
    var s, o;
    if ($h(i) && da(n)) {
      const a = kh();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Es(),
          route: "legacy-transaction-request"
        }), Zo(r, a);
        return;
      }
    }
    if ($h(i) && !da(n)) {
      Zo(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", i), Sy(i)) {
      (s = t.onCancel) == null || s.call(t);
      return;
    }
    if (t.onError) {
      t.onError(i);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Bh = (t) => uy(t).replace(/^0x/, ""), Mh = "This wallet cannot sign messages. Try Xverse or Leather.", Nh = (t) => typeof (t == null ? void 0 : t.request) == "function", _h = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", d6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, h6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function p6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Bh(e.message),
    domain: Bh(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function g6(t, e) {
  const n = await c4({
    domain: e.domain,
    message: e.message,
    network: cc(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Ph(t) {
  var i, s;
  const e = f6() || "", n = /xverse/i.test(e);
  let r = vy();
  if (n && !_h(r)) {
    const o = window;
    r = ((i = o.XverseProviders) == null ? void 0 : i.StacksProvider) ?? ((s = o.xverseProviders) == null ? void 0 : s.StacksProvider);
  }
  if (_h(r))
    try {
      return await g6(r, t);
    } catch (o) {
      if (n || !Nh(r) || !h6(o)) throw o;
    }
  if (!n && Nh(r))
    try {
      return await p6(r, t);
    } catch (o) {
      throw d6(o) ? new Error(Mh) : o;
    }
  throw new Error(Mh);
}
const Uh = 1000000n, fs = 1000000n, Oa = 50n, je = 3000n, Gs = 300n, Xi = 3000n, y6 = 50000n, Vc = 200n, gc = 15000n, Mn = (t) => t + Oa;
function In(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / Uh}.${(n % Uh).toString().padStart(6, "0")}`;
}
function Hh(t, e = Gs) {
  return t <= je ? 0 : Number((t - je) / Mn(e));
}
function qc(t, e = 0n) {
  const n = fs - t - e;
  return n > 0n ? n : 0n;
}
function w6(t, e = Gs) {
  return t > fs ? "over" : t < je + Mn(e) ? "empty" : t < y6 ? "low" : "ok";
}
const b6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", m6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", x6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function S6(t) {
  var n, r, i, s;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((i = e["holder-payment"]) == null ? void 0 : i.value) !== "50" || ((s = e["receipt-bytes"]) == null ? void 0 : s.value) !== "16" || x6.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== b6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const $y = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Xc = 3, E6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [eu, Iy] = $y.split("."), wn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function nu(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function A6(t) {
  return wn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function qr(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function ky(t, e = []) {
  const n = await qr(`/v2/contracts/call-read/${eu}/${Iy}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: eu, arguments: e.map((r) => "0x" + wn(de(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Gn(Sn(n.result));
}
async function v6() {
  const t = await qr(`/v2/contracts/source/${eu}/${Iy}?proof=0`);
  if (typeof t.source != "string" || await A6(t.source) !== m6) throw Error("Deployed source does not match the tested helper.");
  if (S6(await ky("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Ly(t) {
  return t.startsWith("SP") && fi(t) && !t.includes(".");
}
async function $6(t) {
  var r;
  if (!Ly(t)) throw Error("Invalid mainnet wallet address.");
  const e = await qr(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await qr(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function I6(t) {
  const e = await qr(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function k6(t, e) {
  var i, s;
  const n = await ky("get-owner", [ro(t), ro(e)]), r = (n == null ? void 0 : n.success) === !0 ? (s = (i = n.value) == null ? void 0 : i.value) == null ? void 0 : s.value : null;
  if (typeof r != "string" || !Ly(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function L6(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: nu(t), signal: AbortSignal.timeout(15e3) });
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
async function C6(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function T6(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Ua(nu(t.raw)), n = e.auth, r = e.payload, i = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || i.hashMode !== 0 || ci(Zi(Na.MainnetSingleSig, i.signer)) !== t.address || i.fee !== BigInt(t.fee) || i.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const s = e.postConditions.values[0];
    if (r.payloadType !== 2 || ci(r.contractAddress) + "." + r.contractName.content !== $y || r.functionName.content !== "play" || r.functionArgs.length !== 3 || wn(de(r.functionArgs[0])) !== wn(de(ro(t.core))) || wn(de(r.functionArgs[1])) !== wn(de(ro(t.song))) || wn(de(r.functionArgs[2])) !== wn(de(Gv(nu(t.id)))) || t.amount !== "50" || e.postConditionMode !== $i.Deny || e.postConditions.values.length !== 1 || s.conditionType !== 0 || s.amount !== 50n || s.conditionCode !== fo.Equal || s.principal.prefix !== 2 || ci(s.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || ci(r.contractAddress) + "." + r.contractName.content !== E6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || wn(de(r.functionArgs[0])) !== wn(de(ro(t.song))) || typeof t.liked != "boolean" || wn(de(r.functionArgs[1])) !== wn(de(Rv(t.liked))) || t.amount !== "0" || e.postConditionMode !== $i.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Gn(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const B6 = "xtrata.xyz/radio/listening-wallet", M6 = "Link a temporary listening wallet for pay-per-play; no spending permission", Ns = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && fi(t), N6 = (t) => ({
  domain: Bs({ name: Ce(B6), version: Ce("1"), "chain-id": Xn(1) }),
  message: Bs({
    purpose: Ce(M6),
    main: Ce(t.main),
    listening: Ce(t.listening),
    issued: Xn(t.issued)
  })
}), Cy = 100000n, _6 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function P6(t, e) {
  const n = t.filter((i) => !i || typeof i.sender != "string" || i.sender === e || !Ns(i.sender) || !/^\d+$/.test(i.amount) ? !1 : BigInt(i.amount) >= Cy).sort(_6);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((i) => i.sender)).size };
}
const na = 50;
function Da(t) {
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
async function U6(t, e, n = 4) {
  if (!Ns(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${na}&offset=${o}`, i = Da(await e(r(0)));
    if (!i || i.total > 0 && !i.transfers.length) return { ok: !1 };
    if (i.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let s = Math.max(0, i.total - na);
    for (let o = 0; o < n; o++) {
      const a = s === 0 && i.total <= na ? i : Da(await e(r(s)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = P6(a.transfers, t);
      if (c.ok && c.funder) return s > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (s === 0) return c;
      s = Math.max(0, s - na);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const nr = 50, H6 = 6, O6 = 20, Oh = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function Dh(t, e) {
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
async function D6(t, e, n) {
  if (!Ns(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), i = Da(await e(`/extended/v1/address/${t}/stx_inbound?limit=${nr}&offset=0`));
    if (!i || i.total > H6 * nr) return { ok: !1 };
    for (const o of i.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = nr; o < i.total; o += nr) {
      const a = Da(await e(`/extended/v1/address/${t}/stx_inbound?limit=${nr}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== i.total) return { ok: !1 };
    const s = /* @__PURE__ */ new Map();
    if (n) {
      const o = (f) => `/extended/v1/address/${t}/transactions?limit=${nr}&offset=${f}`, a = Dh(await e(o(0)), t);
      if (!a || a.total > O6 * nr) return { ok: !1 };
      const c = new Set(a.rows);
      for (const f of a.sent) s.set(f.txId, f);
      for (let f = nr; f < a.total; f += nr) {
        const h = Dh(await e(o(f)), t);
        if (!h || !h.rows.length) return { ok: !1 };
        for (const l of h.rows) c.add(l);
        for (const l of h.sent) s.set(l.txId, l);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...s.values()] };
  } catch {
    return { ok: !1 };
  }
}
function F6(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const i = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(Oh).map((l, b) => {
    const p = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: p, kind: "gift", to: r.payer, at: b } : Ns(l.sender) && p >= Cy ? { sender: l.sender, left: p, kind: "deposit", to: l.sender, at: b } : { sender: l.sender, left: p, kind: "dust", to: null, at: b };
  }), s = i.reduce((l, b) => l + b.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && Ns(l.recipient) && l.amount > 0n).sort(Oh), a = o.reduce((l, b) => l + b.amount, 0n), c = s - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const f = (l, b) => {
    let p = b;
    for (const S of l) {
      if (p <= 0n) break;
      const x = S.left < p ? S.left : p;
      S.left -= x, p -= x;
    }
    return p;
  };
  for (const l of o) {
    const b = f(i.filter((p) => p.to === l.recipient), l.amount);
    b > 0n && f(i, b);
  }
  if (f(i, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (i.reduce((l, b) => l + b.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const h = /* @__PURE__ */ new Map();
  for (const l of i) {
    if (l.left <= 0n) continue;
    const b = `${l.kind}:${l.to ?? ""}`, p = h.get(b);
    p ? (p.amount += l.left, p.newest = Math.max(p.newest, l.at)) : h.set(b, { to: l.to, kind: l.kind, amount: l.left, newest: l.at });
  }
  return {
    ok: !0,
    parts: [...h.values()].sort((l, b) => l.newest - b.newest),
    hasTopUp: i.some((l) => l.kind === "deposit")
  };
}
function j6(t, e) {
  const n = t.filter((f) => f.kind === "deposit").sort((f, h) => f.newest - h.newest), r = t.find((f) => f.kind === "gift"), i = t.filter((f) => f.kind === "dust"), s = ((r == null ? void 0 : r.amount) ?? 0n) + i.reduce((f, h) => f + h.amount, 0n), o = [], a = [], c = s > e;
  return n.forEach((f, h) => {
    if (f.amount <= e) {
      a.push(f);
      return;
    }
    const l = h === n.length - 1 && !c;
    o.push({ to: f.to, kind: "deposit", mode: l ? "all" : "amount", send: f.amount - e });
  }), c ? o.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: s - e }) : (r && a.push(r), a.push(...i)), { steps: o, tooSmall: a };
}
function Fh(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const ru = [50000n, 100000n, 250000n], Wi = ["prepared", "signed", "unknown", "pending"], z6 = 30 * 6e4, ei = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, R6 = 3e3, jh = "Your main listener wallet is out of funds, so likes are paused. Top it up (it only needs a little) and your likes carry on.", Wc = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function G6(t) {
  let e = null, n = -1 / 0, r, i = null, s = null, o, a = -1 / 0, c = null, f = null, h = !1, l = !1, b = !1, p = null, S = !1, x = "", C = "", D = 0, H, g = null, k, I = [], U, K = -1 / 0;
  const R = /* @__PURE__ */ new Set();
  let q = null, E = !1, T = 0, M = null, B = null, J = !1, F = null, Pt = !1, ut = null, Yt = !1, A = !1, _ = !1, ft = !1, $t = !1, Et = 0, At = null, Jt = Promise.resolve();
  const se = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? Gs.toString()), Rt = (m) => !!s && !(s.features ?? []).includes(m), ge = (m, v) => `xtrata.ppp.v1.${m}:${v}`, Dt = (m = s == null ? void 0 : s.address) => {
    if (!m) return [];
    try {
      const v = JSON.parse(t.store.get(ge("entries", m)) || "[]");
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  }, jt = (m) => {
    const v = [m, ...Dt(m.address).filter((O) => !(O.txid === m.txid && O.kind === m.kind))].slice(0, 200);
    t.store.set(ge("entries", m.address), JSON.stringify(v));
  }, Ge = (m = s == null ? void 0 : s.address) => !!m && t.store.get(ge("on", m)) !== "0", dn = (m) => {
    s != null && s.address && t.store.set(ge("on", s.address), m ? "1" : "0");
  }, Ke = () => Dt().filter((m) => Wi.includes(m.status)), Be = () => Kt() ? [...Ke(), ...Dt(Gt()).filter((m) => Wi.includes(m.status))] : Ke(), ye = () => Ae(s == null ? void 0 : s.address), Ae = (m) => {
    if (!m) return null;
    try {
      return JSON.parse(t.store.get(ge("deposit", m)) || "null");
    } catch {
      return null;
    }
  }, $e = (m, v = s == null ? void 0 : s.address) => {
    v && t.store.set(ge("deposit", v), JSON.stringify(m));
  }, Gt = () => Rt("rootLike") ? s == null ? void 0 : s.address : (s == null ? void 0 : s.root) ?? (s == null ? void 0 : s.address), Kt = () => !!(s != null && s.address) && Gt() !== s.address, we = () => Kt() ? c && c.for === Gt() ? c.value : void 0 : o, Me = (m) => m !== void 0 && m < je + Vc, be = () => Ke().filter((m) => t.now() - m.created > z6 && R.has(m.txid)), hn = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), Ft = () => hn() && !(s != null && s.linked), tn = () => {
    const m = t.main();
    return !Ft() && !!m && !!(s != null && s.linked) && s.linked !== m;
  }, d = (m) => ge("return-to", m), w = (m = s == null ? void 0 : s.address) => {
    if (!m) return;
    const v = t.store.get(d(m));
    return v && Ns(v) && v !== m ? v : void 0;
  }, u = (m = s == null ? void 0 : s.address) => q && q.for === m ? q.res : null;
  function $() {
    if (!(s != null && s.address)) return;
    if (s.linked) return { to: s.linked, kind: "linked" };
    const m = w();
    if (m) return { to: m, kind: "chosen" };
    const v = u();
    if (v != null && v.ok && v.funder) return { to: v.funder, kind: "funder" };
  }
  const P = (m) => ge("gift", m);
  function V() {
    const m = s == null ? void 0 : s.address;
    if (!m) return null;
    if ((F == null ? void 0 : F.for) === m) return F.info;
    try {
      const v = JSON.parse(t.store.get(P(m)) || "null");
      return v && typeof v.returnTo == "string" && typeof v.treasury == "string" ? v : null;
    } catch {
      return null;
    }
  }
  async function ct() {
    var Q;
    const m = s == null ? void 0 : s.address;
    if (!m || !t.giftInfo || !((Q = e == null ? void 0 : e.gifts) != null && Q.enabled) || Pt) return;
    const v = (F == null ? void 0 : F.for) === m ? F : null, O = v ? v.ok ? v.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (v && t.now() - v.at < O) return;
    Pt = !0;
    const W = V();
    try {
      const G = await t.giftInfo(m);
      F = { for: m, info: G, ok: !0, at: t.now() }, t.store.set(P(m), JSON.stringify(G));
    } catch {
      F = { for: m, info: W, ok: !1, at: t.now() };
    } finally {
      Pt = !1;
    }
  }
  const ht = () => Dt().reduce((m, v) => Wi.includes(v.status) ? m + BigInt(v.amount || "0") + BigInt(v.fee || "0") : m, 0n);
  function Lt() {
    if (o === void 0) return 0;
    const m = o - ht() - BigInt(Qt.length) * Mn(se());
    return m > 0n ? Hh(m, se()) : 0;
  }
  const lt = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", Zt = "EMPTY — ADD STX TO PLAY";
  function Ct() {
    var O;
    const m = (s == null ? void 0 : s.state) === "known" || (s == null ? void 0 : s.state) === "unlocked";
    if (!((O = V()) != null && O.player) && !m) return null;
    const v = (W, Q) => ({ reason: W, text: Q });
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
        return ye() ? v("arriving", "YOUR PLAYS ARE ARRIVING") : v("out", Kt() ? lt : Zt);
      case "ready":
        return !Ge() || !(s != null && s.session) || s.session.playsLeft < 1 ? v("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : _ ? Lt() < 1 ? v("out", Kt() ? lt : Zt) : null : v("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const It = () => {
    var m;
    return !!(s != null && s.address) && Kt() && !!((m = V()) != null && m.player);
  };
  function Mt() {
    return It() ? { locked: !0, known: !0 } : null;
  }
  const Vt = 3 * 6e4, me = () => !!V() && !!t.history && !(s != null && s.linked);
  async function xe() {
    const m = s.address, v = V(), { balance: O, nonce: W } = await t.chain.account(m), Q = await t.history(m, !0);
    if (!Q.ok) return null;
    const G = F6({ self: m, balance: O, inbound: Q.inbound, outgoing: Q.outgoing, gift: { sender: v.treasury, payer: v.returnTo } });
    if (!G.ok) return null;
    const st = j6(G.parts, Xi);
    return { balance: O, nonce: W, parts: G.parts, steps: st.steps, tooSmall: st.tooSmall.length };
  }
  const rt = () => Yt ? { state: "unavailable" } : !ut || t.now() - ut.at > Vt || o !== void 0 && o !== ut.balance ? { state: "none" } : ut.plan;
  function et() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const m = t.main();
    if (!Ft()) {
      if (!m) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return s ? s.state === "unsupported" ? "unsupported" : s.state === "none" ? "intro" : tn() ? "wrong-wallet" : s.state === "known" ? "locked" : !Ft() && s.linked !== m ? "link" : o === void 0 ? "loading" : o > fs ? "over" : o < je + Mn(se()) ? "fund" : "ready" : "loading";
  }
  const kt = () => {
    var m, v, O, W;
    return {
      step: et(),
      busy: f,
      message: x,
      error: C,
      notice: Se(),
      gate: e,
      main: t.main(),
      listening: s == null ? void 0 : s.address,
      linked: s == null ? void 0 : s.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : w6(o, se()),
      playsLeft: o === void 0 ? 0 : Hh(o, se()),
      allowance: o === void 0 ? fs : qc(o, BigInt(((m = ye()) == null ? void 0 : m.amount) ?? "0")),
      session: (s == null ? void 0 : s.session) ?? null,
      payingOn: Ge(),
      entries: Dt(),
      depositTxid: ((v = ye()) == null ? void 0 : v.txid) ?? H,
      depositPending: !!ye(),
      walletOutdated: Rt("like"),
      linkedListening: U && U === t.main() ? I.map((Q) => Q.listening) : [],
      serverLinked: !!g && k === `${t.main()}:${s == null ? void 0 : s.address}`,
      stuck: be().length,
      armed: ft,
      queued: Qt.length,
      solo: Ft(),
      returnTo: (O = $()) == null ? void 0 : O.to,
      returnToKind: (W = $()) == null ? void 0 : W.kind,
      funderState: (() => {
        const Q = u();
        return Q ? Q.ok ? Q.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const Q = u();
        return !!Q && Q.ok && Q.distinct > 1;
      })(),
      walletCannotSolo: Ft() && Rt("standalone"),
      walletCannotMulti: Rt("multi"),
      others: ((s == null ? void 0 : s.others) ?? []).filter((Q) => Q !== t.main() && Q !== (s == null ? void 0 : s.linked)),
      creditedTo: Ft() && (s != null && s.address) && (M == null ? void 0 : M.for) === s.address && M.main ? M.main : void 0,
      createdHere: !!(s != null && s.address) && t.store.get(ge("created", s.address)) === "1",
      brandNew: !!(s != null && s.address) && o === 0n && (B == null ? void 0 : B.for) === s.address && B.unused,
      gift: (() => {
        const Q = V();
        return Q ? { player: Q.player, from: Q.from, source: Q.source, amount: Q.amount } : null;
      })(),
      giftPlays: V() ? Lt() : 0,
      giftStop: Ct(),
      albumLock: Mt(),
      returnPlan: rt(),
      slot: (s == null ? void 0 : s.state) === "unlocked" ? s.slot ?? 0 : 0,
      root: (s == null ? void 0 : s.state) === "unlocked" ? s.root ?? s.address : void 0,
      walletCannotAlbums: Rt("slots"),
      likeFunds: (() => {
        var st;
        const Q = Gt();
        if (!Q || (s == null ? void 0 : s.state) !== "unlocked") return null;
        const G = we();
        return { address: Q, balance: G, low: Me(G), album: Kt(), pending: !!Ae(Q), txid: (st = Ae(Q)) == null ? void 0 : st.txid, main: t.main() };
      })()
    };
  }, Se = () => D ? D < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", Tt = (m, v = "") => {
    x = m, C = v, t.changed();
  };
  async function ie(m, v) {
    if (!f) {
      f = m, C = "", t.changed();
      try {
        await v();
      } catch (O) {
        const W = O instanceof Error ? O.message : String(O);
        C = /Cancelled in the listening wallet/.test(W) ? "" : W, C || (x = "Not now. Nothing was signed.", $t = !0);
      } finally {
        f = null, await Ie(!0);
      }
    }
  }
  const En = () => !!(e != null && e.enabled) && e.here && (Ft() || !!t.main() && e.allowed), Ne = () => En() && !tn(), An = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Ve = () => {
    if (tn()) throw new Error(An());
  };
  async function pn() {
    if (!En()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return i ?? (i = await t.bridge(e.walletOrigin)), i;
  }
  const qe = (m) => {
    const v = t.main();
    return m.request("listening.status", v ? { main: v } : void 0);
  };
  async function dr(m = !1) {
    s != null && s.address && (!m && t.now() - a < 3e4 || (o = await t.chain.balance(s.address), a = t.now(), await _e(m)));
  }
  async function _e(m = !1) {
    const v = Gt();
    if (!(!Kt() || !v || (s == null ? void 0 : s.state) !== "unlocked") && !(!m && (c == null ? void 0 : c.for) === v && t.now() - c.at < 3e4))
      try {
        c = { for: v, value: await t.chain.balance(v), at: t.now() };
      } catch {
      }
  }
  async function Ks(m) {
    if ((U !== m || t.now() - K >= 6e4) && (I = await t.links(m), U = m, K = t.now()), (s == null ? void 0 : s.state) !== "unlocked" || s.linked === m) return;
    const v = `${m}:${s.address}`;
    k === v && g || (g = I.find((O) => O.listening === s.address) ?? null, k = v);
  }
  async function Hi() {
    const m = s == null ? void 0 : s.address;
    if (!Ft() || !m || s != null && s.linked || !t.funder || E || !o || o <= 0n) return;
    const v = u(m);
    if (v != null && v.ok && v.funder) return;
    const O = v != null && v.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, T - 1), 30 * 6e4);
    if (!(q && q.for === m && t.now() - q.at < O)) {
      E = !0;
      try {
        q = { for: m, res: await t.funder(m), at: t.now() };
      } catch {
        q = { for: m, res: { ok: !1 }, at: t.now() };
      } finally {
        E = !1;
      }
      T = q.res.ok ? 0 : T + 1;
    }
  }
  async function Vs() {
    const m = s == null ? void 0 : s.address;
    if (!(!Ft() || !m || s != null && s.linked || !t.mainOf || J) && !(M && M.for === m && (M.ok || t.now() - M.at < 6e4))) {
      J = !0;
      try {
        M = { for: m, main: await t.mainOf(m), ok: !0, at: t.now() };
      } catch {
        M = { for: m, main: null, ok: !1, at: t.now() };
      } finally {
        J = !1;
      }
    }
  }
  async function qs() {
    const m = s == null ? void 0 : s.address;
    if (!(!m || (s == null ? void 0 : s.state) !== "unlocked" || o !== 0n || (B == null ? void 0 : B.for) === m) && t.store.get(ge("created", m)) !== "1")
      try {
        B = { for: m, unused: await t.chain.confirmedNonce(m) === 0n };
      } catch {
      }
  }
  async function Xs() {
    var Q;
    const m = s == null ? void 0 : s.address;
    if (!m) return !1;
    let v, O = !1;
    const W = /* @__PURE__ */ new Map();
    for (const G of Be())
      try {
        const st = await t.chain.transaction(G.txid);
        if (!st) {
          if (R.add(G.txid), t.now() - G.created > 15 * 6e4 && !W.has(G.address) && W.set(G.address, await t.chain.confirmedNonce(G.address)), v = W.get(G.address), v !== void 0 && v > BigInt(G.nonce)) {
            jt({ ...G, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((G.status === "unknown" || G.status === "signed") && G.raw)
            try {
              await t.chain.broadcast(G.raw, G.txid), jt({ ...G, status: "pending" });
            } catch (ot) {
              ei(ot) && jt({ ...G, status: "failed", note: ot.message, raw: void 0 });
            }
          continue;
        }
        R.delete(G.txid);
        const dt = String(st.tx_status);
        if (dt === "success" && st.canonical !== !1 && st.is_unanchored === !1) {
          if (jt({ ...G, status: "confirmed", confirmedAt: t.now(), actualFee: String(st.fee_rate ?? G.fee), raw: void 0 }), O = !0, G.kind === "like" && (S = !0, G.status !== "confirmed" && typeof G.liked == "boolean"))
            try {
              (Q = t.likeConfirmed) == null || Q.call(t, G.song, G.liked);
            } catch {
            }
        } else dt.startsWith("abort_") || dt.startsWith("dropped_") ? jt({ ...G, status: "failed", note: dt, raw: void 0 }) : G.status !== "pending" && jt({ ...G, status: "pending" });
      } catch {
      }
    for (const G of Kt() ? [m, Gt()] : [m]) {
      const st = Ae(G);
      if (st)
        try {
          const dt = await t.chain.transaction(st.txid), ot = String((dt == null ? void 0 : dt.tx_status) ?? "");
          (ot === "success" && dt.is_unanchored === !1 || ot.startsWith("abort_") || ot.startsWith("dropped_") || !dt && t.now() - st.at > 2 * 36e5) && ($e(null, G), a = -1 / 0, c = null, /on its way/i.test(x) && (x = ""));
        } catch {
        }
    }
    return O;
  }
  async function Ie(m = !1) {
    var v;
    try {
      const O = t.main();
      if ((m || !e || r !== O || t.now() - n > 3e5) && (e = await t.config(O), n = t.now(), r = O), !e.enabled || !e.here || !Ft() && (!O || !e.allowed)) {
        i && (s != null && s.session) && await i.request("listening.stop").catch(() => {
        }), ft && hr(), t.changed();
        return;
      }
      await pn(), s = await qe(i), tn() && s.state === "unlocked" && (Zs(), await i.request("listening.lock").catch(() => {
      }), o = void 0, s = await qe(i)), O && e.allowed && await Ks(O), await dr(m), await Hi(), await Vs(), await qs(), await ct(), await Xs() && await dr(!0), await _e(), await ce(), D = 0;
    } catch {
      D++;
    }
    if (et() === "locked" ? Ys() : ft && hr(), S) {
      S = !1;
      try {
        (v = t.likesChanged) == null || v.call(t);
      } catch {
      }
    }
    t.changed(), Qt.length && !vn && zi();
  }
  async function Ws(m) {
    const v = s == null ? void 0 : s.root;
    if (!v || s != null && s.slot || !(s != null && s.address) || Rt("slots")) return;
    const O = Number(t.store.get(ge("slot", v)));
    if (!(!Number.isSafeInteger(O) || O < 1))
      try {
        const { balance: W } = await t.chain.account(s.address);
        if (W >= je + Mn(se())) return;
        await m.request("listening.openSlot", { slot: O }), s = await qe(m), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function Zr(m, v) {
    var G;
    Ve();
    const O = !(s != null && s.address) || Ge(s.address), W = s != null && s.linked ? (G = t.nameOf) == null ? void 0 : G.call(t, s.linked) : void 0;
    await m.request("listening.unlock", { mode: "unlock", terms: O ? pr() : void 0, anyPasskey: v, ...t.main() ? { main: t.main() } : {}, ...W ? { label: W } : {} }), s = await qe(m), O && (Ge(s.address) ? await en() : await m.request("listening.stop")), await Ws(m), Tt(O ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const Q = p;
    p = null, Q && t.now() - Q.at < 12e4 && setTimeout(() => void Ie(!0).then(() => Ri(Q)), 0);
  }
  function Ys() {
    ft || f || $t || Et >= 3 || !i || !(s != null && s.address) || (ft = !0, Jt = (async () => {
      try {
        await Zr(i, !1), Et = 0;
      } catch (m) {
        const v = m instanceof Error ? m.message : String(m);
        /Cancelled in the listening wallet/.test(v) ? At || ($t = !0, Tt("Not now. Nothing was signed.")) : /did not answer/.test(v) ? await (i == null ? void 0 : i.request("listening.cancel").catch(() => {
        })) : (Et++, C = v);
      } finally {
        ft = !1;
        const m = At;
        At = null, m ? await m() : await Ie(!0);
      }
    })());
  }
  async function hr(m) {
    ft && (At = async () => {
    }, await (i == null ? void 0 : i.request("listening.cancel").catch(() => {
    })), await Jt), m && await m(), t.changed();
  }
  const pr = () => ({
    fee: se().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: fs.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function en() {
    if (!(s != null && s.address)) return !1;
    if (_ || (_ = await t.tabLock(s.address)), !_)
      throw await (i == null ? void 0 : i.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function gr(m, v) {
    const O = s.address, { balance: W, nonce: Q } = v ?? await t.chain.account(O);
    o = W;
    const G = await i.request("listening.prepareReturn", {
      mode: m.mode,
      balance: W.toString(),
      nonce: Q.toString(),
      fee: Xi.toString(),
      ...m.amount !== void 0 ? { amount: m.amount.toString() } : {},
      ...m.linked ? {} : { destination: m.to }
    });
    if (G.recipient !== m.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const st = m.mode === "amount" ? m.amount : m.mode === "all" ? W - Xi : W - fs - Xi, dt = Ua(G.raw);
    if (Gn(dt.payload.recipient).value !== m.to || String(dt.payload.amount) !== G.amount || st !== void 0 && G.amount !== st.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const ot = {
      id: Wc(),
      address: O,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: G.recipient,
      amount: G.amount,
      fee: G.fee,
      nonce: Q.toString(),
      created: t.now(),
      status: "signed",
      raw: G.raw,
      txid: G.txid
    };
    t.validate(ot), jt(ot);
    try {
      await t.chain.broadcast(G.raw, G.txid), jt({ ...ot, status: "pending" });
    } catch (Ht) {
      throw jt({ ...ot, status: "unknown", note: Ht.message }), Ht;
    }
    return G;
  }
  const Qr = gc, yr = Xi;
  async function Jr(m, v, O) {
    if ((s == null ? void 0 : s.state) !== "unlocked" || !s.address) throw new Error("Unlock the listening wallet first.");
    if (Rt("slots") || Rt("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const W = s.slot ?? 0;
    if (m === v || ![m, v].includes(W) || ![m, v].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const Q = s.root ?? s.address, G = m === 0 ? Q : s.address, st = v === 0 ? Q : s.address, { balance: dt, nonce: ot } = await t.chain.account(G);
    if (dt < O + yr + je) throw new Error(m === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const Ht = await i.request("listening.signMove", { from: m, to: v, amount: O.toString(), fee: yr.toString(), nonce: ot.toString(), balance: dt.toString() }), ke = Ua(Ht.raw);
    if (Ht.from !== G || Ht.to !== st || Ht.amount !== O.toString() || Gn(ke.payload.recipient).value !== st || String(ke.payload.amount) !== O.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const gn = {
      id: Wc(),
      address: G,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: st,
      amount: Ht.amount,
      fee: Ht.fee,
      nonce: ot.toString(),
      created: t.now(),
      status: "signed",
      raw: Ht.raw,
      txid: Ht.txid
    };
    t.validate(gn), jt(gn);
    try {
      await t.chain.broadcast(Ht.raw, Ht.txid), jt({ ...gn, status: "pending" });
    } catch (He) {
      throw jt({ ...gn, status: "unknown", note: He.message }), He;
    }
    return $e({ txid: Ht.txid, amount: Ht.amount, at: t.now() }, st), st === Q && Q !== s.address ? c = null : a = -1 / 0, Ht;
  }
  let j = !1;
  const Z = /* @__PURE__ */ new Map(), te = (m) => ge("float", m);
  async function ce() {
    if (j || (s == null ? void 0 : s.state) !== "unlocked" || !Kt() || Rt("move") || Rt("rootLike") || !s.address) return;
    const m = s.address;
    if (t.store.get(te(m)) === "1") return;
    const v = V();
    if (!(v != null && v.player) || v.state !== "arrived") return;
    const O = we();
    if (O === void 0 || o === void 0) return;
    if (!Me(O)) {
      t.store.set(te(m), "1");
      return;
    }
    if (Ae(Gt()) || Fi() || Be().length || o < Qr * 4n + je + yr) return;
    const W = Z.get(m);
    if (!(W && (W.n >= 3 || t.now() - W.at < 5 * 6e4))) {
      j = !0, Z.set(m, { n: ((W == null ? void 0 : W.n) ?? 0) + 1, at: t.now() });
      try {
        await Jr(s.slot ?? 0, 0, Qr), t.store.set(te(m), "1");
      } catch (Q) {
        console.warn("[radio] likes float not sent yet", Q);
      } finally {
        j = !1;
      }
    }
  }
  async function ts(m) {
    if (Ke().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Rt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const v = await xe().catch(() => null);
    if (!v)
      throw ut = null, Yt = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Yt = !1, o = v.balance;
    const O = { balance: v.balance, nonce: v.nonce };
    if (m === "excess") {
      const dt = Fh(v.parts) ?? w();
      if (!dt) throw new Error("Choose where to send the excess first.");
      await gr({ mode: "excess", to: dt, linked: !1 }, O), ut = null, Tt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const W = v.steps;
    if (!W.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!ut && ut.balance === v.balance && t.now() - ut.at <= Vt && ut.steps.length === W.length && ut.steps.every((dt, ot) => dt.to === W[ot].to && dt.mode === W[ot].mode && dt.send === W[ot].send))) {
      ut = {
        at: t.now(),
        balance: v.balance,
        steps: W,
        parts: v.parts,
        plan: { state: "ready", steps: W.map((dt) => ({ to: dt.to, kind: dt.kind, send: dt.send.toString() })), kept: v.tooSmall, excess: Fh(v.parts) }
      }, Tt(W.length > 1 ? `This goes back in ${W.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const G = W[0], st = G.to ?? w();
    if (!st) throw new Error("Choose where to send the rest first.");
    if (G.mode === "amount" && Rt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await gr({ mode: G.mode, to: st, linked: !1, ...G.mode === "amount" ? { amount: G.send } : {} }, O), ut = null, W.length === 1 ? (dn(!1), Tt("Returned ✓ Paying is off.")) : Tt(`Returned ✓ ${W.length - 1} more ${W.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const Pn = {
    forceRefresh: () => Ie(!0),
    create: () => ie("Waiting for your passkey…", async () => {
      const m = await pn();
      await m.request("listening.unlock", { mode: "create", terms: pr(), ...t.main() ? { main: t.main() } : {} }), s = await qe(m), s.address && t.store.set(ge("created", s.address), "1"), dn(!0), Tt(Ft() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await en();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    giftSent: (m, v) => {
      !(s != null && s.address) || ye() || ($e({ txid: m, amount: v.toString(), at: t.now() }), a = -1 / 0, F = null, Tt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (m) => {
      if (Ve(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Rt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await pn()).request("listening.bindSlot", { slot: m, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (m, v, O, W) => {
      $e({ txid: O, amount: W.toString(), at: t.now() }, v), F = null, await Pn.openAlbum(m), Tt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (m) => ie("Opening…", async () => {
      if (Ve(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Rt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (h || l || b) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((s.slot ?? 0) === m) return;
      Zs(), await i.request("listening.openSlot", { slot: m }), s = await qe(i), o = void 0, a = -1 / 0, ut = null, Yt = !1;
      const v = s.root;
      v && m > 0 && t.store.set(ge("slot", v), String(m)), Tt(m === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (m = !1) => {
      const v = () => ie("Waiting for your passkey…", async () => Zr(await pn(), m));
      return ft ? m ? Rt("cancel") ? (Tt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : hr(async () => {
        (et() === "locked" || et() === "intro") && await v();
      }) : Jt : v();
    },
    link: () => ie("Sign in your wallet…", async () => {
      Ve();
      const m = t.main();
      if (!m || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      const v = (await t.links(m)).find((O) => O.listening === s.address);
      if (v)
        await i.request("listening.link", { main: m, issued: v.issued, mainSignature: v.mainSignature });
      else {
        const O = { main: m, listening: s.address, issued: t.now() }, W = await t.signWithMain(m, N6(O)), Q = await i.request("listening.link", { main: m, issued: O.issued, mainSignature: W });
        await t.saveLink({ ...O, mainSignature: W, listeningSignature: Q.listeningSignature }), K = -1 / 0;
      }
      Tt("Linked ✓");
    }),
    deposit: () => ie("Approve the deposit in your wallet…", async () => {
      Ve();
      const m = t.main();
      if (!m || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      if (ye()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await dr(!0);
      const v = qc(o ?? 0n);
      if (v <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      H = await t.deposit(m, s.address, v), H && $e({ txid: H, amount: v.toString(), at: t.now() }), Tt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => ie("Approve the top-up in your wallet…", async () => {
      Ve();
      const m = t.main(), v = Gt();
      if (!m || !v) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (Ae(v)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const O = await t.chain.balance(v);
      Kt() ? c = { for: v, value: O, at: t.now() } : (o = O, a = t.now());
      const W = qc(O);
      if (W <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const Q = await t.deposit(m, v, W);
      Q && $e({ txid: Q, amount: W.toString(), at: t.now() }, v), Tt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_CHOICES`. */
    topUpAlbum: (m) => ie("Adding plays…", async () => {
      if (Ve(), !Kt()) throw new Error("Open the album you want to add plays to first.");
      if (!ru.includes(m)) throw new Error("Choose one of the amounts offered.");
      if (h || l || b) throw new Error("Still sending a payment. Try again in a moment.");
      if (Be().length || ye()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Jr(0, s.slot ?? 0, m), Tt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => ie("Confirm in the listening wallet…", async () => {
      if (!Ne()) throw new Error("Connect your wallet first.");
      await en(), await i.request("listening.approveSession", pr()), dn(!0), Tt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => ie("Clearing…", async () => {
      for (const m of be())
        await t.chain.transaction(m.txid) || jt({ ...m, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Tt("Cleared ✓");
    }),
    switchOff: () => ie("Switching off…", async () => {
      Zs(), await (i == null ? void 0 : i.request("listening.stop")), dn(!1), Tt("Paying is off. Music stays free.");
    }),
    lock: () => ie("Locking…", async () => {
      Zs(), await (i == null ? void 0 : i.request("listening.lock")), o = void 0, Tt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (m) => {
      const v = String(m ?? "").trim();
      if (!(s != null && s.address)) return Tt("", "Unlock the listening wallet first.");
      if (!Ns(v)) return Tt("", "Enter a standard mainnet address (it starts with SP).");
      if (v === s.address) return Tt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(d(s.address), v), Tt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      s != null && s.address && t.store.set(d(s.address), ""), t.changed();
    },
    returnFunds: (m) => ie("Check the return in the listening wallet…", async () => {
      if (!Ne()) throw new Error("Connect your wallet first.");
      if (!(s != null && s.address)) throw new Error("Unlock the listening wallet first.");
      if (me()) return ts(m);
      const v = $();
      if (!v) throw new Error(Ft() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (v.kind !== "linked" && Rt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Ke().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await gr({ mode: m, to: v.to, linked: v.kind === "linked" }), m === "all" && dn(!1), Tt(m === "all" ? v.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Qt = [], Oi = 10, Di = 30 * 6e4;
  let vn = !1;
  const Fi = () => h || !!f || l || b, Zs = () => {
    Qt.length && (Qt.length = 0, t.changed());
  };
  async function ji(m) {
    if (!Qt.some((v) => v.id === m.id) && !Dt().some((v) => v.id === m.id) && (Qt.push({ ...m, at: t.now() }), Qt.length > Oi && Qt.shift()), Fi() || Ke().length) {
      const v = Qt.length;
      x = `Queued ${v === 1 ? "this song" : v + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await zi();
  }
  async function zi() {
    if (!vn) {
      vn = !0;
      try {
        for (; Qt.length; ) {
          for (; Qt.length && t.now() - Qt[0].at > Di; ) Qt.shift();
          if (!Qt.length || Fi() || await yc(Qt[0]) === "wait") return;
          Qt.shift();
        }
      } finally {
        vn = !1, t.changed();
      }
    }
  }
  async function yc(m) {
    var v;
    h = !0;
    try {
      await Ie();
      const O = et();
      if (O === "loading") return "wait";
      if (O !== "ready" || !Ge() || !(s != null && s.session) || s.session.playsLeft < 1 || !_) return "done";
      if (Ke().length) return "wait";
      A || (await t.chain.verify(), A = !0);
      const W = s.address, { balance: Q, nonce: G } = await t.chain.account(W);
      o = Q, a = t.now();
      const st = await t.chain.owner(Xc, m.song);
      if (st === W || st === t.main()) return "done";
      const dt = await i.request("listening.signPlay", {
        core: Xc,
        song: m.song,
        receipt: m.id,
        fee: se().toString(),
        nonce: G.toString(),
        balance: Q.toString()
      }), ot = {
        id: m.id,
        address: W,
        kind: "play",
        core: Xc,
        song: m.song,
        recipient: st,
        amount: "50",
        fee: se().toString(),
        nonce: G.toString(),
        created: t.now(),
        status: "signed",
        raw: dt.raw,
        txid: dt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...m.title ? { title: String(m.title).slice(0, 120) } : {},
        ...m.artist ? { artist: String(m.artist).slice(0, 120) } : {}
      };
      t.validate(ot), jt(ot);
      const Ht = m.title ? `“${m.title}”${m.artist ? ` by ${m.artist}` : ""}` : `song #${m.song}`;
      try {
        await t.chain.broadcast(dt.raw, dt.txid), jt({ ...ot, status: "pending" }), x = `♪ Paid ${Ht}`, C = "";
      } catch (ke) {
        jt({ ...ot, status: ei(ke) ? "failed" : "unknown", note: ke.message, ...ei(ke) ? { raw: void 0 } : {} }), C = ke.message;
      }
      return s = await qe(i), "done";
    } catch (O) {
      const W = O instanceof Error ? O.message : "payment unavailable";
      return (v = V()) != null && v.player ? (x = "Payment is taking a moment: " + W, "wait") : (x = "This song played free: " + W, "done");
    } finally {
      h = !1, t.changed();
    }
  }
  function wc(m) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(et()) || Rt("like") ? !1 : (Ri(m), !0);
  }
  async function Ri(m) {
    const v = m.title ? `“${m.title}”` : `song #${m.song}`, O = (Un) => {
      var Io;
      C = Un, x = "";
      try {
        (Io = t.likeFailed) == null || Io.call(t, m.song);
      } catch {
      }
      t.changed();
    }, W = Kt(), Q = et(), G = t.main(), st = W && (Q === "fund" || Q === "over") ? "ready" : Q, dt = Ft() ? Gt() : G;
    if (st === "locked") {
      p = { ...m, at: t.now() }, Tt(`Unlock to like ${v}. It sends straight after.`);
      return;
    }
    if (st === "wrong-wallet") return O(An());
    if (st === "link") return O("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (Ft() && Rt("standalone")) return O("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (st === "fund") return O("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (st === "over") return O("Return the excess first: the listening wallet holds more than 1 STX.");
    if (W) {
      await _e(!0);
      const Un = we();
      if (Me(Un))
        return t.changed(), O(jh);
    }
    if (st !== "ready" || !dt) return O("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(s != null && s.session)) return O("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!_) return O("Pay-per-play is running in another tab. Like from that tab.");
    const ot = Dt(Gt()).find((Un) => Un.kind === "like" && Un.song === m.song);
    if (ot && Wi.includes(ot.status))
      return O(`Your last like for ${v} is still on its way. It can change again once it confirms.`);
    if (l) return O("One like at a time: your last one is still being sent.");
    if ((ot == null ? void 0 : ot.status) === "confirmed" && t.now() - (ot.confirmedAt ?? 0) < R6)
      return O(`Your like for ${v} has only just confirmed. Try again in a moment.`);
    let Ht;
    b = !0;
    try {
      Ht = t.likeState ? (await t.likeState(dt, m.song)).by : m.likedBy ?? [];
    } catch {
      Ht = m.likedBy;
    } finally {
      b = !1;
    }
    if (!Ht) return O(`Could not check ${v} right now. Try the heart again.`);
    const ke = Gt(), He = ((ot == null ? void 0 : ot.status) === "confirmed" && typeof ot.liked == "boolean" && t.now() - (ot.confirmedAt ?? ot.created) < 5 * 6e4 ? ot.liked : void 0) ?? Ht.includes(ke);
    if (!He && Ht.some((Un) => Un !== ke)) return O(Ft() ? `${v} was liked from another wallet of yours. Unlike it there.` : `${v} was liked from your main wallet${Ht.includes(G) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await bc({ song: m.song, liked: !He, title: m.title, artist: m.artist });
  }
  async function bc(m) {
    var W, Q, G;
    if (l) {
      Tt("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const v = m.title ? `“${m.title}”${m.artist ? ` by ${m.artist}` : ""}` : `song #${m.song}`, O = t.wait ?? ((st) => new Promise((dt) => setTimeout(dt, st)));
    try {
      Tt(`${m.liked ? "Liking" : "Unliking"} ${v}…`);
      const st = t.now() + 12e4;
      for (; h || (Kt() ? Dt(Gt()).some((He) => Wi.includes(He.status)) : Ke().length); ) {
        if (t.now() > st) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await O(5e3), await Ie(!0);
      }
      if (!Kt() && et() !== "ready" || (s == null ? void 0 : s.state) !== "unlocked" || !s.session) throw new Error("Paying stopped before the like was sent.");
      const dt = Gt(), { balance: ot, nonce: Ht } = await t.chain.account(dt);
      if (Kt() ? c = { for: dt, value: ot, at: t.now() } : (o = ot, a = t.now()), Me(ot)) throw new Error(jh);
      const ke = await i.request("listening.signLike", {
        song: m.song,
        liked: m.liked,
        fee: Vc.toString(),
        nonce: Ht.toString(),
        balance: ot.toString()
      }), gn = {
        id: Wc(),
        address: dt,
        kind: "like",
        core: 0,
        song: m.song,
        liked: m.liked,
        recipient: "",
        amount: "0",
        fee: Vc.toString(),
        nonce: Ht.toString(),
        created: t.now(),
        status: "signed",
        raw: ke.raw,
        txid: ke.txid,
        ...m.title ? { title: String(m.title).slice(0, 120) } : {},
        ...m.artist ? { artist: String(m.artist).slice(0, 120) } : {}
      };
      t.validate(gn), jt(gn);
      try {
        await t.chain.broadcast(ke.raw, ke.txid), jt({ ...gn, status: "pending" }), x = `${m.liked ? "♥ Liked" : "Unliked"} ${v}`, C = "";
        try {
          (W = t.likeSent) == null || W.call(t, m.song, m.liked);
        } catch {
        }
      } catch (He) {
        if (jt({ ...gn, status: ei(He) ? "failed" : "unknown", note: He.message, ...ei(He) ? { raw: void 0 } : {} }), C = He.message, ei(He)) try {
          (Q = t.likeFailed) == null || Q.call(t, m.song);
        } catch {
        }
      }
      s = await qe(i);
    } catch (st) {
      C = "Like not sent: " + (st instanceof Error ? st.message : "the listening wallet is unavailable");
      try {
        (G = t.likeFailed) == null || G.call(t, m.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), zi();
    }
  }
  return { snapshot: kt, refresh: Ie, onListened: ji, heart: wc, toggleLike: Ri, ...Pn };
}
const Ty = ["Connect", "Passkey", "Link & fund", "Listen"], By = ["Passkey", "Add 1 STX", "Listen"], su = (t) => t ? By : Ty;
function K6(t) {
  if (t.solo) return V6(t);
  const e = Ty.length, n = (r, i, s = !1) => ({ at: r, blocked: s, caption: r >= e ? i : `Step ${r + 1} of ${e} · ${i}` });
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
      const r = t.entries.filter((i) => i.kind === "play");
      return r.some((i) => i.status === "confirmed") ? n(e, "Paid plays are taking place") : r.some((i) => ["signed", "pending", "unknown"].includes(i.status)) ? n(3, "first paid play sent, confirming") : n(3, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function V6(t) {
  const e = By.length, n = (r, i, s = !1) => ({ at: r, blocked: s, caption: r >= e ? i : `Step ${r + 1} of ${e} · ${i}` });
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
      const r = t.entries.filter((i) => i.kind === "play");
      return r.some((i) => i.status === "confirmed") ? n(e, "Paid plays are taking place") : r.some((i) => ["signed", "pending", "unknown"].includes(i.status)) ? n(2, "first paid play sent, confirming") : n(2, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function q6(t, e) {
  return !e || e.at >= su(!!t.solo).length || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const X6 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function W6(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !X6(r.id)));
}
const Y6 = {}, Z6 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, Q6 = (t) => {
  const e = Y6;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, J6 = (t) => `/hiro/${t}`, t5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, e5 = (t) => {
  const e = Q6(t);
  if (e)
    return [t5(e)];
  const n = Z6[t];
  return typeof window < "u" ? [`${window.location.origin}${J6(t)}`, ...n.filter((i) => !i.includes("hiro.so"))] : n;
}, n5 = {}, zh = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, r5 = "xtrata.log.enabled", s5 = "xtrata.log.level", i5 = "xtrata.log.tags", o5 = "xtrata.log.dedupe", ra = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, a5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, c5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, l5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, u5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, f5 = () => {
  const t = n5 ?? {}, e = ra(r5) ?? t.VITE_LOG_ENABLED, n = ra(s5) ?? t.VITE_LOG_LEVEL, r = ra(i5) ?? t.VITE_LOG_TAGS, i = ra(o5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: a5(e),
    level: c5(n) ?? "warn",
    tags: u5(r),
    dedupe: l5(i)
  };
}, d5 = (t, e, n) => !t.enabled || zh[n] < zh[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), h5 = (t, e, n, r) => {
  const i = f5();
  if (!d5(i, e, t) || g5(i.dedupe))
    return;
  const s = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(s, r) : o(s);
}, p5 = /* @__PURE__ */ new Set();
let Rh = null;
const g5 = (t, e, n, r, i) => (Rh !== t && (p5.clear(), Rh = t), !1), y5 = (t, e, n) => h5("debug", t, e, n), w5 = {}, b5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, m5 = (t) => {
  const e = w5, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : b5[t];
}, x5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, S5 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return x5.test(n) ? n : null;
}, E5 = (t) => t.replace(/\/+$/, ""), A5 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Gh = (t) => {
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
}, ni = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, v5 = (t) => {
  var c, f;
  let e;
  try {
    e = Gn($v(t));
  } catch {
    return null;
  }
  const n = ni(e);
  if (!n || n.success === !1)
    return null;
  const r = ni(n.value), i = ni(r == null ? void 0 : r.value), s = ni(i == null ? void 0 : i.value);
  if (!s)
    return null;
  const o = Gh((c = ni(s.name)) == null ? void 0 : c.value), a = Gh((f = ni(s.namespace)) == null ? void 0 : f.value);
  return !o || !a ? null : S5(`${o}.${a}`);
}, $5 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${E5(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, i = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [uy(qg(t.address))]
    }),
    signal: t.signal
  });
  if (!i.ok)
    throw new Error(`BNS primary lookup failed (${i.status})`);
  const s = await i.json();
  return !(s != null && s.okay) || typeof s.result != "string" ? null : v5(s.result);
}, I5 = async (t) => {
  const e = t.address.trim();
  if (!fi(e))
    return null;
  const n = m5(t.network);
  if (!n)
    return null;
  let r = null;
  for (const i of e5(t.network))
    try {
      return await $5({
        baseUrl: i,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (s) {
      r = s;
    }
  return y5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: A5(r)
  }), null;
};
function k5(t, e, n = {}) {
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
const Kh = Object.freeze({
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
function L5(t, e = "") {
  return Object.hasOwn(Kh, String(t)) ? Kh[String(t)] : e;
}
const Vh = Object.freeze({ 312: "Smalltalk", 315: "Entertainment" });
function C5(t, e = "") {
  return Object.hasOwn(Vh, String(t)) ? Vh[String(t)] : e;
}
const My = 100000n, gf = 1000000n, Fa = 3000n, T5 = (t, e) => `${t}#gift=${e}`, B5 = 100, Yc = (t, e = Gs) => t <= je ? 0 : Number((t - je) / Mn(e)), qh = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), Ny = "xtrata.xyz/radio/gifts", Zc = B5, M5 = "Create a prefunded Xtrata radio gift batch", N5 = (t) => ({
  domain: Bs({ name: Ce(Ny), version: Ce("1"), "chain-id": Xn(1) }),
  message: Bs({
    purpose: Ce(M5),
    creator: Ce(t.creator),
    count: Xn(t.count),
    amount: Xn(BigInt(t.amount)),
    label: Ce(t.label),
    issued: Xn(t.issued),
    ...t.player ? { player: Ce(t.player) } : {}
  })
}), _5 = (t, e, n = Gs) => je + BigInt(t) * Mn(n) + (e ? gc : 0n), P5 = (t, e = Gs) => Number((gf - je - (t ? gc : 0n)) / Mn(e)), U5 = (t, e) => BigInt(t) * (e + Fa);
function H5(t, e, n, r = Gs) {
  const i = n ? gc : 0n, s = e > je + i ? e - je - i : 0n, o = Number(s / Mn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * Oa,
    fees: BigInt(o) * r,
    reserve: je,
    float: i,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: Fa,
    perCopy: e + Fa,
    total: U5(t, e)
  };
}
const O5 = (t) => t >= My && t <= gf, Xh = 40, D5 = "Create an Xtrata radio gift player", F5 = /^[^\u0000-\u001f\u007f<>]+$/u;
function Wh(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && F5.test(t) : !n;
}
function j5(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!Wh(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!Wh(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > Xh) throw new Error(`A player holds 1 to ${Xh} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const z5 = (t) => Y0(np(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), R5 = (t) => ({
  domain: Bs({ name: Ce(Ny), version: Ce("1"), "chain-id": Xn(1) }),
  message: Bs({
    purpose: Ce(D5),
    admin: Ce(t.admin),
    player: Ce(t.hash),
    issued: Xn(t.issued)
  })
}), G5 = [300, 500, 1e3], Yh = 1800, Qc = /* @__PURE__ */ new Map();
async function _y(t) {
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
async function K5(t) {
  const e = navigator;
  if (e.share)
    try {
      return await e.share(t), { label: "Shared ✓", ok: !0 };
    } catch (n) {
      if ((n == null ? void 0 : n.name) === "AbortError") return null;
    }
  return await _y(t.url) ? { label: "Link copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 };
}
function Py(t, e, n, r, i) {
  const s = document.createElement("button");
  return s.type = "button", s.className = r, s.dataset.feedback = t, (() => {
    const a = Qc.get(t), c = !!a && a.until > Date.now();
    s.textContent = c ? a.label : e, s.classList.toggle("is-done", c && a.ok), s.classList.toggle("is-failed", c && !a.ok);
  })(), s.onclick = async () => {
    const a = await n();
    if (a) {
      Qc.set(t, { ...a, until: Date.now() + Yh });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Qc.delete(t), i();
      }, Yh + 50);
    }
  }, s;
}
const ds = (t, e, n, r, i) => Py(t, e, async () => await _y(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, i), ns = "xtrata.radio.gift.incoming.v1", Zh = (t) => "xtrata.radio.gift.mine.v1:" + t, Qh = (t) => "xtrata.radio.gift.batches.v1:" + t, at = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, rr = (t, e, n = "") => {
  const r = at("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, sa = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, rn = (t) => In(t).replace(/\.?0+$/, "");
function V5(t) {
  let e = null;
  const n = (d) => [5e3, 1e4, 2e4, 3e4][d] ?? 6e4, r = (() => {
    try {
      const d = new URL(location.href), w = new URLSearchParams(d.hash.slice(1)).get("gift") ?? d.searchParams.get("gift");
      return w !== null && (d.searchParams.delete("gift"), history.replaceState(null, "", d.pathname + (d.search || ""))), qh(w) ? w : null;
    } catch {
      return null;
    }
  })(), i = (() => {
    try {
      const d = JSON.parse(t.store.get(ns) || "null");
      return qh(d == null ? void 0 : d.code) ? d.code : null;
    } catch {
      return null;
    }
  })(), s = r ?? i;
  if (s) {
    e = { code: s }, t.store.set(ns, JSON.stringify({ code: s, at: t.now() }));
    let d = 0;
    const w = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (u) => {
      const $ = await u.json().catch(() => ({}));
      if (u.status === 404) {
        t.store.set(ns, null), e = { ...e, error: ($ == null ? void 0 : $.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!u.ok) throw new Error("busy");
      const P = $;
      e = { ...e, view: P, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(P.status) && t.store.set(ns, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void w(), n(d++)));
    });
    w();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    e = null, t.store.set(ns, null), t.changed();
  }, c = (d) => d.from ? t.who(d.from) : d.label ? `Xtrata Radio · ${d.label}` : "Xtrata Radio";
  let f = {};
  const h = (d) => {
    if (f.box) return f.box;
    const w = at("div", "", "ppp-gift-check");
    f.box = w;
    const u = () => {
      const $ = window.turnstile;
      !$ || f.rendered || (f.rendered = !0, $.render(w, { sitekey: d, callback: (P) => {
        f.token = P, t.changed();
      }, "expired-callback": () => {
        f.token = void 0;
      } }));
    };
    if (window.turnstile) u();
    else {
      const $ = document.createElement("script");
      $.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", $.async = !0, $.onload = u, document.head.append($);
    }
    return w;
  };
  let l;
  async function b(d) {
    var $, P, V, ct, ht;
    if (!e || e.claiming || !d.listening) return;
    const w = !!(($ = e.view) != null && $.player);
    if (w && !d.root) return;
    e.claiming = !0, e.error = void 0, t.changed();
    const u = async (Lt) => {
      const lt = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: f.token, ...Lt })
      });
      return { res: lt, r: await lt.json().catch(() => ({})) };
    };
    try {
      let Lt = 0, lt = d.listening, Zt;
      if (w) {
        const Mt = Number((P = await t.json("/radio/gift/slots?root=" + encodeURIComponent(d.root))) == null ? void 0 : P.next);
        if (!Number.isSafeInteger(Mt) || Mt < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Lt = Mt;
        for (let Vt = 0; ; Vt++) {
          const me = await t.album.bind(Lt);
          if (lt = me.address, Zt = await u({ wallet: lt, binding: me }), Zt.res.status === 409 && /just taken/.test(((V = Zt.r) == null ? void 0 : V.error) || "") && Vt < 5) {
            Lt += 1;
            continue;
          }
          break;
        }
      } else Zt = await u({ wallet: lt });
      const { res: Ct, r: It } = Zt;
      if (Ct.status === 503 && /sending another gift/.test((It == null ? void 0 : It.error) || "")) {
        e.waiting = !0, clearTimeout(l), l = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!Ct.ok) {
        const Mt = String((It == null ? void 0 : It.error) || "");
        if (Ct.status === 404 || Ct.status === 410 || Ct.status === 409 && /already had a gift|brand-new/.test(Mt))
          throw t.store.set(ns, null), new Error(Mt || "This gift cannot be opened.");
        if (Ct.status === 429 || Ct.status === 403 || Ct.status === 400 && !/wallet number/i.test(Mt)) throw new Error(Mt || `Could not open the gift (${Ct.status}).`);
        const me = /topping up/.test(Mt) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(Mt) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(Mt) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(me), { retry: !0, slow: /topping up|not paid for yet/.test(Mt) });
      }
      e.done = !0, t.store.set(ns, null), w ? await t.album.arrived(Lt, lt, It.txid, BigInt(It.amount)) : t.giftSent(It.txid, BigInt(It.amount));
    } catch (Lt) {
      const lt = Lt, Zt = lt.name === "TypeError" || lt.name === "AbortError" || lt.name === "TimeoutError" || /wallet number/i.test(lt.message);
      if (lt.retry || Zt) {
        const Ct = e.tries ?? 0;
        e.tries = Ct + 1, e.retry = { text: lt.retry ? lt.message : "Still sending your gift… the network is slow, trying again." }, clearTimeout(l), l = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, lt.slow ? 6e4 : n(Ct));
      } else e.error = lt.message;
      f.token = void 0;
      try {
        (ht = (ct = window.turnstile) == null ? void 0 : ct.reset) == null || ht.call(ct, f.box);
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
      p = { ...(p == null ? void 0 : p.wallet) === u ? p : {}, wallet: u, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(u)).then(($) => {
        var P, V;
        (p == null ? void 0 : p.wallet) === u && (p.state = (P = $ == null ? void 0 : $.gift) == null ? void 0 : P.state, p.problem = ((V = $ == null ? void 0 : $.gift) == null ? void 0 : V.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(p.state === "sending" && p.problem)) return [];
    const w = at("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return w.title = `Network reply: ${p.problem}`, [w];
  }
  function x(d, w) {
    var ht, Lt;
    const u = w.player, $ = BigInt(w.amount), P = [at("p", `🎁 ${c(w)} sent you “${u.title}”${u.subtitle ? ` by ${u.subtitle}` : ""}: ${u.tracks.length} ${u.tracks.length === 1 ? "song" : "songs"} and ${Yc($).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!d.root && ["fund", "ready", "over", "link"].includes(d.step)))
      return P.push(at("p", d.step === "intro" ? "Tap below: your passkey makes a listening wallet, and the album arrives in its own wallet. You can keep as many albums as you like." : d.step === "locked" ? "Unlock your listening wallet and the album arrives in its own wallet." : "Open your listening wallet and the album arrives in its own wallet.", "ppp-mute")), P;
    if (d.walletCannotAlbums)
      return P.push(at("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), P;
    const ct = (Lt = (ht = d.gate) == null ? void 0 : ht.gifts) == null ? void 0 : Lt.turnstileSiteKey;
    return ct && !f.token ? P.push(at("p", "One quick check and it is yours:", "ppp-mute"), h(ct)) : !e.claiming && !e.error && !e.waiting && !e.retry && b(d), P.push(...C(d, "Sending your album…")), P;
  }
  function C(d, w) {
    const u = [];
    return e.claiming || e.waiting ? u.push(at("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : w, "ppp-cyan")) : e.retry && u.push(at("p", e.retry.text, "ppp-warn"), rr("Try now", () => {
      clearTimeout(l), e.retry = void 0, b(d);
    }, "quiet")), e.error && u.push(at("p", e.error, "ppp-bad"), rr("Try again", () => {
      e.error = void 0, b(d);
    })), u;
  }
  const D = (d) => {
    var w;
    return !!e && !e.done && !e.error && o() && !!d.listening && !d.linked && !d.creditedTo && (d.createdHere || d.brandNew || !!((w = e.view) != null && w.player)) && (d.balance ?? 0n) === 0n && !d.entries.length;
  };
  function H(d) {
    var Zt, Ct;
    const w = S(d);
    if (!e || ["off", "elsewhere"].includes(d.step)) return w;
    const u = e.view;
    if (e.error && !u) return [at("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!u) return [at("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return w;
    if (u.status === "claimed" || u.status === "claiming") return [at("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(u.status)) return [at("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (u.status === "pending-deposit") return [at("p", `🎁 ${c(u)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (u.player) return [...x(d, u), ...w];
    if (!!d.listening && (!(d.createdHere || d.brandNew) || !!d.linked || !!d.creditedTo || (d.balance ?? 0n) > 0n || d.entries.length > 0))
      return [at("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), rr("Forget this gift link here", a, "quiet")];
    const P = BigInt(u.amount), V = Yc(P).toLocaleString(), ht = [at(
      "p",
      `🎁 ${c(u)} sent you ${rn(P)} STX of on-chain music: about ${V} paid plays.`,
      "ppp-gift"
    )], Lt = !!d.listening && (d.createdHere || d.brandNew) && !d.linked && !d.creditedTo && d.step === "fund" && (d.balance ?? 1n) === 0n && !d.depositPending && !d.entries.length, lt = (Ct = (Zt = d.gate) == null ? void 0 : Zt.gifts) == null ? void 0 : Ct.turnstileSiteKey;
    return Lt ? (lt && !f.token ? ht.push(at("p", "One quick check and it is yours:", "ppp-mute"), h(lt)) : !e.claiming && !e.error && !e.waiting && !e.retry && b(d), ht.push(...C(d, "Sending your gift…"))) : d.step === "intro" ? ht.push(at("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : d.listening && d.linked ? ht.push(at("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), rr("Forget this gift link here", a, "quiet")) : d.listening && (d.balance ?? 0n) > 0n && ht.push(at("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), rr("Forget this gift link here", a, "quiet")), ht;
  }
  async function g(d, w, u) {
    var $;
    try {
      const P = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(d));
      if (($ = P == null ? void 0 : P.gift) != null && $.returnTo) return { ok: !0, funder: P.gift.returnTo, txId: P.gift.txid ?? void 0, amount: P.gift.amount, distinct: 1 };
    } catch {
      if (u) return { ok: !1 };
    }
    return w();
  }
  const k = at("div", "", "ppp-gift-fold");
  let I = 250000n, U = "", K = "";
  const R = (d) => {
    try {
      const w = JSON.parse(t.store.get(Zh(d)) || "[]");
      return Array.isArray(w) ? w : [];
    } catch {
      return [];
    }
  }, q = (d, w) => t.store.set(Zh(d), JSON.stringify(w.slice(0, 50)));
  let E = 0;
  async function T(d) {
    const w = R(d);
    for (const u of w)
      if (!(u.view && ["claimed", "refunded", "expired"].includes(u.view.status)))
        try {
          u.view = !u.view || u.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: u.id, ...u.txid ? { txid: u.txid } : {} }) }) : await t.json("/radio/gift?id=" + u.id), u.error = void 0;
        } catch ($) {
          u.error = $.message;
        }
    q(d, w), t.changed();
  }
  async function M(d) {
    if (U) return;
    U = "Starting your gift…", K = "", t.changed();
    let w = null;
    try {
      w = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: d, amount: I.toString() }) });
      const u = R(d);
      u.unshift({ id: w.id, code: w.code, amount: I.toString(), at: t.now() }), q(d, u), U = "Approve the gift in your wallet…", t.changed();
      const $ = await t.pay(d, w.depositTo, BigInt(w.deposit), w.memo), P = R(d), V = P.find((ct) => ct.id === w.id);
      V && (V.txid = $, V.view = { status: "pending-deposit", amount: I.toString(), source: "friend", from: d, label: "", expires: 0 }), q(d, P), K = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", T(d);
    } catch (u) {
      K = u.message || "Not sent.";
    } finally {
      U = "", t.changed();
    }
  }
  const B = (d) => "xtrata.radio.gift.players.v1:" + d, J = (d) => {
    try {
      const w = JSON.parse(t.store.get(B(d)) || "[]");
      return Array.isArray(w) ? w.filter((u) => u && /^[0-9a-f]{16}$/.test(u.id)) : [];
    } catch {
      return [];
    }
  };
  async function F(d, w) {
    var u;
    if (!U) {
      U = "Checking the player…", K = "", t.changed();
      try {
        const $ = w.tracks.split(/[\s,]+/).filter(Boolean).map((lt) => Number(lt.replace(/^#/, ""))), P = j5({ title: w.title.trim(), subtitle: w.subtitle.trim(), tracks: $, cover: (u = w.cover) != null && u.trim() ? Number(w.cover.trim().replace(/^#/, "")) : null });
        U = "Sign in your wallet…", t.changed();
        const V = { admin: d, hash: z5(P), issued: t.now() }, ct = await t.sign(d, R5(V));
        U = "Making the player…", t.changed();
        const ht = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: P, request: V, signature: ct }) }), Lt = J(d).filter((lt) => lt.id !== ht.id);
        Lt.unshift({ id: ht.id, title: ht.title, tracks: ht.tracks }), t.store.set(B(d), JSON.stringify(Lt.slice(0, 30))), K = `${ht.existing ? "That player already exists" : "Player made"} ✓ “${ht.title}” · ${ht.tracks} songs. Pick it below for a batch.`;
      } catch ($) {
        K = $.message || "Not made.";
      } finally {
        U = "", t.changed();
      }
    }
  }
  const Pt = (d, w) => T5(d || location.origin + "/radio.html", w), ut = (d) => K5({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: d }), Yt = (d) => {
    try {
      const w = JSON.parse(t.store.get(Qh(d)) || "[]");
      return Array.isArray(w) ? w.filter((u) => u && /^[0-9a-f]{16}$/.test(u.id) && Array.isArray(u.codes)) : [];
    } catch {
      return [];
    }
  }, A = (d, w) => t.store.set(Qh(d), JSON.stringify(w.slice(0, 20))), _ = (d) => !!d.view && d.view.status === "live" && d.view.copies.waiting + d.view.copies.claiming + d.view.copies.refunding === 0, ft = (d, w) => t.json(d, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(w) });
  let $t = 0;
  async function Et(d) {
    const w = Yt(d);
    for (const u of w)
      if (!_(u))
        try {
          u.view = !u.view || u.view.status === "pending-deposit" ? await ft("/radio/gift/batch/confirm", { id: u.id, ...u.txid ? { txid: u.txid } : {} }) : await t.json("/radio/gift/batch?id=" + u.id), u.error = void 0;
        } catch ($) {
          u.error = $.message;
        }
    try {
      const u = await t.json("/radio/gift/batches?creator=" + encodeURIComponent(d));
      for (const $ of (u == null ? void 0 : u.batches) ?? []) {
        const P = w.find((V) => V.id === $.id);
        if (P) {
          P.error || (P.view = $);
          continue;
        }
        w.push({ id: $.id, codes: [], count: $.count, amount: $.amount, label: $.label, player: $.player, depositTo: "", deposit: $.deposit, memo: $.memo, at: 0, view: $ });
      }
    } catch {
    }
    A(d, w), t.changed();
  }
  async function At(d, w) {
    const u = Yt(d).find(($) => $.id === w);
    if (!(!u || !u.depositTo || U)) {
      U = "Approve the payment in your wallet…", K = "", t.changed();
      try {
        const $ = await t.pay(d, u.depositTo, BigInt(u.deposit), u.memo), P = Yt(d), V = P.find((ct) => ct.id === w);
        V && (V.txid = $), A(d, P), K = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", U = "", Et(d);
      } catch ($) {
        K = `${/cancel/i.test($.message) ? "Payment cancelled." : $.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        U = "", t.changed();
      }
    }
  }
  async function Jt(d, w, u, $) {
    if (U) return;
    if (!w.ok) {
      K = w.reason, t.changed();
      return;
    }
    U = "Sign in your wallet…", K = "", t.changed();
    let P = null;
    try {
      const V = { creator: d, count: w.count, amount: w.amount.toString(), label: u, issued: t.now(), ...$ ? { player: $ } : {} }, ct = await t.sign(d, N5(V));
      U = "Making your links…", t.changed(), P = await ft("/radio/gift/batch", { request: V, signature: ct });
      const ht = Yt(d);
      ht.unshift({ id: P.id, codes: P.codes, count: w.count, amount: P.amount, label: u, player: $ ?? null, depositTo: P.depositTo, deposit: P.deposit, memo: P.memo, at: t.now() }), A(d, ht);
    } catch (V) {
      K = V.message || "Not made.", U = "", t.changed();
      return;
    }
    U = "", t.changed(), await At(d, P.id);
  }
  function se() {
    const d = !!Gt.value, w = Kt.value === "max" ? P5(d) : Number(Kt.value), u = _5(w, d), $ = Number(we.value);
    return !Number.isInteger($) || $ < 1 || $ > Zc ? { ok: !1, reason: `Make 1 to ${Zc} copies at a time.`, album: d, plays: w, amount: u, count: $ } : O5(u) ? { ok: !0, reason: "", album: d, plays: w, amount: u, count: $, bill: H5($, u, d) } : { ok: !1, reason: "Each copy must be 0.1 to 1 STX.", album: d, plays: w, amount: u, count: $ };
  }
  const Rt = () => {
    const d = se();
    if (!d.ok) return d.reason;
    const w = d.bill;
    return `Each copy: ${d.plays.toLocaleString()} paid plays (${rn(w.holders)} to song holders, ${rn(w.fees)} network fees)${d.album ? `, ${rn(w.float)} for the album’s likes` : ""}, ${rn(w.reserve)} kept so a listener can return what is left, + ${rn(w.sendFee)} to send it = ${rn(w.perCopy)} STX. ${d.count} copies = ${rn(w.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, ge = (d, w) => w.codes.map((u) => Pt(d, u)), Dt = at("input");
  Dt.type = "range", Dt.min = String(My), Dt.max = String(gf), Dt.step = "50000", Dt.value = String(I), Dt.setAttribute("aria-label", "Gift amount");
  const jt = at("p", "", "ppp-gift-amount"), Ge = rr("", () => {
    const d = t.main();
    d && M(d);
  }, "primary"), dn = () => {
    jt.textContent = Ke(), Ge.textContent = `Gift ${rn(I)} STX`;
  };
  Dt.oninput = () => {
    I = BigInt(Dt.value), dn();
  };
  const Ke = () => `${rn(I)} STX · about ${Yc(I).toLocaleString()} paid plays · you pay ${rn(I + Fa)} STX with the network fee`;
  dn();
  const Be = at("input");
  Be.maxLength = 60, Be.placeholder = "Title, e.g. Proof of Sound", Be.setAttribute("aria-label", "Player title");
  const ye = at("input");
  ye.maxLength = 80, ye.placeholder = "Artist (optional)", ye.setAttribute("aria-label", "Player subtitle");
  const Ae = at("textarea");
  Ae.rows = 3, Ae.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Ae.setAttribute("aria-label", "Songs");
  const $e = at("input");
  $e.inputMode = "numeric", $e.placeholder = "Cover inscription number (optional), shown when the album loads", $e.setAttribute("aria-label", "Cover inscription");
  const Gt = at("select");
  Gt.setAttribute("aria-label", "Batch album");
  const Kt = at("select");
  Kt.setAttribute("aria-label", "Plays per copy");
  for (const d of G5) Kt.append(sa(`${d.toLocaleString()} plays`, String(d)));
  Kt.append(sa("Max (1 STX)", "max"));
  const we = at("input");
  we.type = "number", we.min = "1", we.max = String(Zc), we.value = "10", we.setAttribute("aria-label", "Copies");
  const Me = at("input");
  Me.maxLength = 40, Me.placeholder = "Label, e.g. Opera launch", Me.setAttribute("aria-label", "Batch label");
  const be = at("p", "", "ppp-mute"), hn = () => {
    be.textContent = Rt();
  };
  for (const d of [Gt, Kt, we])
    d.oninput = hn, d.onchange = hn;
  hn();
  function Ft(d) {
    var P, V, ct, ht, Lt, lt;
    const w = (P = d.gate) == null ? void 0 : P.gifts;
    if (!(w != null && w.enabled) || ["off", "elsewhere", "unsupported"].includes(d.step)) return null;
    const u = t.main(), $ = [at("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!u)
      $.push(at("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      Ge.disabled = !!U, $.push(Dt, jt, Ge), t.now() - E > 3e4 && (E = t.now(), T(u));
      const Zt = R(u);
      if (Zt.length) {
        const Ct = at("ul", "", "ppp-gift-list");
        for (const It of Zt.slice(0, 10)) {
          const Mt = (V = It.view) == null ? void 0 : V.status, Vt = It.error ? It.error : !Mt || Mt === "pending-deposit" ? It.txid ? "payment confirming…" : "waiting for your payment" : Mt === "live" ? "ready to share" : Mt === "claiming" || Mt === "claimed" ? "claimed ✓" : Mt === "refunding" ? "expired · refund on its way" : Mt === "refunded" ? "expired · refunded to you" : Mt, me = at("li");
          if (me.append(at("span", `${rn(BigInt(It.amount))} STX`, "t"), at("span", Vt, ((ct = It.view) == null ? void 0 : ct.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((ht = It.view) == null ? void 0 : ht.status) === "live") {
            const xe = Pt(((Lt = d.gate) == null ? void 0 : Lt.radioUrl) ?? null, It.code);
            me.append(ds("gift-copy:" + It.id, "Copy link", () => xe, "tiny", t.changed), Py("gift-share:" + It.id, "Share", () => ut(xe), "tiny", t.changed));
          }
          Ct.append(me);
        }
        $.push(Ct);
      }
      if (w.admin) {
        const Ct = at("div", "", "ppp-gift-admin"), It = (rt, et) => {
          const kt = at("label", rt);
          return kt.append(et), kt;
        }, Mt = J(u);
        Ct.append(
          at("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
          Be,
          ye,
          Ae,
          $e,
          rr("Sign and make player", () => void F(u, { title: Be.value, subtitle: ye.value, tracks: Ae.value, cover: $e.value }))
        );
        const Vt = rr("Sign, pay and make links", () => {
          Jt(u, se(), Me.value.trim(), Gt.value || void 0);
        });
        Vt.disabled = !!U;
        const me = Gt.value;
        Gt.replaceChildren(sa("No album (starter copies)", ""), ...Mt.map((rt) => sa(`${rt.title} · ${rt.tracks} songs`, rt.id))), Mt.some((rt) => rt.id === me) && (Gt.value = me), hn(), Ct.append(
          at("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
          It("Album ", Gt),
          It("Plays each ", Kt),
          It("Copies ", we),
          Me,
          be,
          Vt
        ), t.now() - $t > 3e4 && ($t = t.now(), Et(u));
        const xe = Yt(u);
        if (xe.length) {
          const rt = at("ul", "", "ppp-gift-list");
          for (const et of xe.slice(0, 10)) {
            const kt = et.view, Se = kt == null ? void 0 : kt.copies, Tt = et.error ? et.error : !kt || kt.status === "pending-deposit" ? et.txid ? "payment confirming…" : "waiting for your payment" : `${Se.claimed} of ${kt.count} claimed${Se.refunding + Se.refunded ? ` · ${Se.refunded} refunded${Se.refunding ? `, ${Se.refunding} on their way` : ""}` : ""}`, ie = at("li");
            if (ie.append(at("span", `${et.label || "Batch"} · ${et.count} × ${rn(BigInt(et.amount))} STX`, "t"), at("span", Tt, "ppp-mute")), !et.txid && et.depositTo && (!kt || kt.status === "pending-deposit") && ie.append(rr("Pay now", () => void At(u, et.id), "tiny")), et.codes.length && (kt == null ? void 0 : kt.status) === "live") {
              const En = ge(((lt = d.gate) == null ? void 0 : lt.radioUrl) ?? null, et);
              ie.append(
                ds("batch-copy:" + et.id, "Copy all links", () => En.join(`
`), "tiny", t.changed),
                ds("batch-csv:" + et.id, "Copy as CSV", () => ["copy,link", ...En.map((Ne, An) => `${An + 1},${Ne}`)].join(`
`), "tiny", t.changed)
              );
            } else et.codes.length || ie.append(at("span", "links were made on another device", "ppp-mute"));
            rt.append(ie);
          }
          Ct.append(rt);
        }
        $.push(Ct);
      }
    }
    return U && $.push(at("p", U, "ppp-cyan")), K && $.push(at("p", K, /✓/.test(K) ? "ppp-ok" : "ppp-warn")), k.replaceChildren(...$), k;
  }
  return { banner: H, funder: g, renderFold: Ft, liveGift: o, setAside: a, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: D };
}
const q5 = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function X5(t) {
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
const W5 = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).flatMap((i) => [i.title, i.artist])].filter(Boolean).join(" ").toLowerCase();
};
function Y5(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((s) => (!e.pinnedOnly || e.pins.has(s.slot)) && (() => {
    const o = W5(s);
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
function Z5(t, e = 100) {
  const n = Object.entries(t).sort((r, i) => i[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, i]) => [Number(r), i]));
}
const ri = 12, Q5 = 5e3, Ye = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, si = (t, e, n = "") => {
  const r = Ye("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function J5(t) {
  let e, n = [], r = 0, i = !1, s = !1, o = -1 / 0, a = "", c = "recent", f = !1, h = ri;
  const l = Ye("div", "", "ppp-shelf-box"), b = (M) => "xtrata.radio.shelf.pins.v1:" + M, p = (M) => "xtrata.radio.shelf.recent.v1:" + M, S = (M, B) => {
    try {
      return JSON.parse(t.store.get(M) || "null") ?? B;
    } catch {
      return B;
    }
  }, x = (M) => new Set(S(b(M), []).filter((B) => Number.isSafeInteger(B))), C = (M) => {
    const B = S(p(M), {}), J = {};
    for (const [F, Pt] of Object.entries(B)) Number.isSafeInteger(Number(F)) && typeof Pt == "number" && (J[Number(F)] = Pt);
    return J;
  };
  async function D(M) {
    if (!i) {
      i = !0, s = !1;
      try {
        const B = [];
        let J = 0, F = 0;
        for (let Pt = 0; Pt < Q5 / 100 + 1; Pt++) {
          const ut = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(M)}&after=${J}&limit=100`);
          if (B.push(...X5(ut == null ? void 0 : ut.shelf)), F = Number(ut == null ? void 0 : ut.total) || B.length, !(ut != null && ut.next) || !Number.isSafeInteger(ut.next)) break;
          J = ut.next;
        }
        M === e && (n = B, r = F, o = t.now());
      } catch {
        s = !0;
      } finally {
        i = !1, t.changed();
      }
    }
  }
  const H = () => {
    o = -1 / 0;
  }, g = Ye("input");
  g.type = "search", g.placeholder = "Search title, artist or #", g.setAttribute("aria-label", "Search your albums"), g.oninput = () => {
    a = g.value, h = ri, t.changed();
  };
  const k = Ye("select");
  k.setAttribute("aria-label", "Sort albums");
  for (const M of q5) {
    const B = document.createElement("option");
    B.value = M.value, B.textContent = M.label, k.append(B);
  }
  k.onchange = () => {
    c = k.value, h = ri, t.changed();
  };
  const I = si("", () => {
    f = !f, h = ri, t.changed();
  }, "tiny"), U = Ye("div", "", "ppp-shelf-tools");
  U.append(g, k, I);
  const K = Ye("div"), R = Ye("div");
  function q(M) {
    const B = M.step === "off" || M.step === "elsewhere" ? void 0 : M.root;
    if (B !== e && (e = B, n = [], r = 0, o = -1 / 0, h = ri), !B || M.walletCannotAlbums) return null;
    if (!i && t.now() - o > 5 * 6e4 && D(B), !n.length)
      return s ? (R.replaceChildren(Ye("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), si("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(R), l) : null;
    const J = x(B), F = C(B), Pt = Y5(n, { query: a, sort: c, pinnedOnly: f, pins: J, recents: F });
    g.value !== a && (g.value = a), k.value = c, I.textContent = f ? "★ Pinned only" : "☆ Pinned only", I.setAttribute("aria-pressed", String(f));
    const ut = [];
    if (M.slot > 0 && ut.push(si("← My player", () => t.open(0), "quiet")), !Pt.length) ut.push(Ye("p", "No album matches that.", "ppp-mute"));
    else {
      const Yt = Ye("ul", "", "ppp-shelf-list");
      for (const A of Pt.slice(0, h)) {
        const _ = Ye("li", "", A.slot === M.slot ? "now" : ""), ft = J.has(A.slot), $t = si(ft ? "★" : "☆", () => {
          const se = new Set(J);
          ft ? se.delete(A.slot) : se.add(A.slot), t.store.set(b(B), JSON.stringify([...se])), t.changed();
        }, "tiny");
        $t.setAttribute("aria-label", ft ? `Unpin ${A.player.title}` : `Pin ${A.player.title}`);
        const Et = [A.player.subtitle, `${A.player.tracks.length} ${A.player.tracks.length === 1 ? "song" : "songs"}`, A.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), At = A.slot === M.slot, Jt = si(At ? "Playing" : "Play", () => {
          t.store.set(p(B), JSON.stringify(Z5({ ...F, [A.slot]: t.now() }))), t.open(A.slot);
        }, At ? "tiny" : "tiny primary");
        Jt.disabled = At, _.append($t, Ye("span", A.player.title, "t"), Ye("span", " " + Et, "ppp-mute"), Jt), Yt.append(_);
      }
      ut.push(Yt), Pt.length > h && ut.push(si(`Show more (${Pt.length - h} left)`, () => {
        h += ri, t.changed();
      }, "quiet"));
    }
    return s && ut.push(Ye("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), K.replaceChildren(...ut), l.firstChild !== U && l.replaceChildren(U, K), l;
  }
  return { render: q, invalidate: H, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const M = C(e), B = [...n].filter((J) => J.player).sort((J, F) => (M[F.slot] ?? 0) - (M[J.slot] ?? 0) || F.slot - J.slot)[0];
    return B ? { slot: B.slot, title: B.player.title } : null;
  } };
}
const t$ = [
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
function e$(t) {
  for (const [e, n] of t$) if (n.test(t)) return e;
  return null;
}
const Uy = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), Hy = (t) => /Android/.test(t);
function n$(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : Uy(e) ? "x-safari-" + n.href : Hy(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const r$ = (t) => Uy(t) ? "Safari" : Hy(t) ? "Chrome" : "your browser", Jh = document.getElementById("ppp");
Jh && s$(Jh);
function s$(t) {
  var tn;
  const e = ww(), n = (d) => t.querySelector(d), r = n(".ppp-frame");
  let i = null;
  const s = async (d, w) => {
    const u = await fetch(d, { cache: "no-store", ...w, signal: AbortSignal.timeout(15e3) }), $ = await u.json().catch(() => ({}));
    if (!u.ok) throw new Error(($ == null ? void 0 : $.error) || `Request failed (${u.status}).`);
    return $;
  }, o = G6({
    now: Date.now,
    main: () => {
      const d = e.load();
      return d.isConnected && d.network === "mainnet" ? d.address : void 0;
    },
    config: (d) => s("/radio/listening-wallet/config?main=" + encodeURIComponent(d || "")),
    links: async (d) => (await s("/radio/listening-wallet/link?main=" + encodeURIComponent(d))).links ?? [],
    mainOf: async (d) => {
      var u;
      const w = (await s("/radio/listening-wallet/link?listening=" + encodeURIComponent(d))).links;
      return ((u = w == null ? void 0 : w.find(($) => $.listening === d)) == null ? void 0 : u.main) ?? null;
    },
    saveLink: async (d) => {
      await s("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(d) });
    },
    bridge: async (d) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${d}; publickey-credentials-create ${d}`), i.referrerPolicy = "no-referrer";
      const w = new Promise((V, ct) => {
        i.addEventListener("load", () => V(), { once: !0 }), setTimeout(() => ct(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      i.src = d + "/", r.replaceChildren(i), await w;
      const u = new cw({ walletOrigin: d, frame: i, timeoutMs: 30 * 6e4 }), $ = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), P = (V, ct) => $.has(V) ? u.request(V, ct) : Promise.race([
        u.request(V, ct),
        new Promise((ht, Lt) => setTimeout(() => Lt(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await P("listening.status"), { request: P };
    },
    chain: {
      verify: v6,
      balance: I6,
      account: $6,
      owner: k6,
      broadcast: L6,
      transaction: C6,
      confirmedNonce: async (d) => {
        const w = await qr(`/v2/accounts/${d}?proof=0`);
        if (!Number.isSafeInteger(w == null ? void 0 : w.nonce) || w.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(w.nonce);
      }
    },
    signWithMain: (d, w) => Ph({ ...w, network: "mainnet", stxAddress: d }),
    deposit: (d, w, u) => new Promise(($, P) => Th({
      recipient: w,
      amount: u.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: d,
      network: new Jc(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (V) => $(V.txId || ""),
      onCancel: () => P(new Error("Deposit cancelled. Nothing was sent.")),
      onError: P
    })),
    validate: T6,
    tabLock: (d) => new Promise((w) => {
      const u = navigator.locks;
      if (!(u != null && u.request)) {
        w(!0);
        return;
      }
      u.request("xtrata-ppp:" + d, { ifAvailable: !0 }, async ($) => {
        w(!!$), $ && await new Promise(() => {
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
      set: (d, w) => {
        try {
          localStorage.setItem(d, w);
        } catch {
        }
      }
    },
    changed: () => be(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (d) => {
      var w, u;
      return a.funder(d, () => U6(d, qr), !!((u = (w = o.snapshot().gate) == null ? void 0 : w.gifts) != null && u.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (d) => {
      const w = await s("/radio/gift/for?wallet=" + encodeURIComponent(d)), u = w == null ? void 0 : w.gift;
      if (!u) return null;
      if (typeof u.returnTo != "string" || typeof u.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: u.returnTo, from: typeof u.from == "string" ? u.from : null, source: String(u.source ?? ""), amount: String(u.amount ?? "0"), treasury: u.treasury, state: u.state === "sending" ? "sending" : "arrived", player: u.player ?? null };
    },
    history: (d, w) => D6(d, (u) => qr(u), w),
    likesChanged: () => {
      var d, w;
      (w = (d = window.XtrataRadio) == null ? void 0 : d.refreshLikes) == null || w.call(d);
    },
    likeState: async (d, w) => {
      const u = await s("/radio/chain-likes?" + new URLSearchParams({ wallet: d, ids: String(w) })), $ = Array.isArray(u == null ? void 0 : u.rows) ? u.rows.find((P) => (P == null ? void 0 : P.id) === w) : null;
      if (!$ || typeof $.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: $.liked, by: Array.isArray($.by) ? $.by.filter((P) => typeof P == "string") : $.liked ? [d] : [] };
    },
    likeSent: (d, w) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: d, liked: w } })),
    nameOf: (d) => E(d) ?? void 0,
    likeConfirmed: (d, w) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: d, liked: w } })),
    likeFailed: (d) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: d } }))
  }), a = V5({
    json: s,
    main: () => {
      const d = e.load();
      return d.isConnected && d.network === "mainnet" ? d.address : void 0;
    },
    pay: (d, w, u, $) => new Promise((P, V) => Th({
      recipient: w,
      amount: u.toString(),
      memo: $,
      stxAddress: d,
      network: new Jc(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (ct) => P(ct.txId || ""),
      onCancel: () => V(new Error("Gift cancelled. Nothing was sent.")),
      onError: V
    })),
    sign: (d, w) => Ph({ ...w, network: "mainnet", stxAddress: d }),
    giftSent: (d, w) => o.giftSent(d, w),
    album: { bind: (d) => o.bindAlbum(d), arrived: async (d, w, u, $) => {
      c.invalidate(), await o.albumArriving(d, w, u, $);
    } },
    who: (d) => B(d),
    changed: () => be(o.snapshot()),
    store: {
      get: (d) => {
        try {
          return localStorage.getItem(d);
        } catch {
          return null;
        }
      },
      set: (d, w) => {
        try {
          w === null ? localStorage.removeItem(d) : localStorage.setItem(d, w);
        } catch {
        }
      }
    },
    now: Date.now
  }), c = J5({
    json: s,
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
      set: (d, w) => {
        try {
          w === null ? localStorage.removeItem(d) : localStorage.setItem(d, w);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => be(o.snapshot())
  });
  window.XtrataRadioLikeHandler = (d) => {
    if (!d || !Number.isSafeInteger(d.song) || d.song < 0) return !1;
    Yt();
    const w = A(d.song, { title: d.title, artist: d.artist });
    return o.heart({ song: d.song, title: w.title || void 0, artist: w.artist || void 0, likedBy: Array.isArray(d.likedBy) ? d.likedBy : void 0 });
  };
  let f;
  window.XtrataRadioListeningIdentity = () => {
    const d = o.snapshot();
    return d.solo && d.step !== "off" && d.step !== "elsewhere" ? d.listening : void 0;
  };
  const h = (d) => {
    var u, $;
    const w = window.XtrataRadioListeningIdentity();
    w !== f && (f = w, ($ = (u = window.XtrataRadio) == null ? void 0 : u.refreshLikes) == null || $.call(u));
  };
  let l = "", b = null, p = !1;
  const S = (d) => {
    var ct, ht, Lt, lt, Zt;
    const w = window.XtrataRadio;
    if (!(w != null && w.setGiftPlayer) || !(w != null && w.setGiftStop)) return;
    const u = d.step === "off" || d.step === "elsewhere" ? null : ((ct = d.gift) == null ? void 0 : ct.player) ?? null, $ = u ? u.id + ":" + u.cover + ":" + u.tracks.map((Ct) => Ct.id).join(",") : "";
    $ !== l && (w.setGiftPlayer(u ? { id: u.id, title: u.title, subtitle: u.subtitle, tracks: u.tracks.map((Ct) => Ct.id), cover: u.cover } : null), l = $);
    const P = ((ht = d.giftStop) == null ? void 0 : ht.text) ?? null;
    P !== b && (w.setGiftStop(P), b = P);
    const V = !!u && !!((Lt = d.albumLock) != null && Lt.locked);
    V !== p && ((lt = w.setGiftLock) == null || lt.call(w, V), p = V), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(d.step) && ((Zt = w.forgetWallets) == null || Zt.call(w));
  }, x = (d) => d ? d.slice(0, 6) + "…" + d.slice(-4) : "", C = (d) => (Number(d) / 1e6).toFixed(d < 1000n ? 6 : 4), D = (d) => {
    const w = Math.round((Date.now() - d) / 6e4);
    return w < 1 ? "now" : w < 60 ? `${w}m` : w < 1440 ? `${Math.round(w / 60)}h` : `${Math.round(w / 1440)}d`;
  }, H = (d) => `https://explorer.hiro.so/txid/${d}?chain=mainnet`, g = (d, w = "", u = "") => {
    const $ = document.createElement(d);
    return w && ($.textContent = w), u && ($.className = u), $;
  }, k = (d, w, u = "") => {
    const $ = g("button", d, u);
    return $.type = "button", $.onclick = w, $;
  }, I = (d, w) => {
    const u = g("a", d);
    return u.href = w, u.target = "_blank", u.rel = "noopener", u;
  };
  let U = null, K = location.hash === "#give";
  K && history.replaceState(null, "", location.pathname + location.search);
  let R = !1;
  const q = k5((d) => I5({ address: d, network: "mainnet" }), () => be(o.snapshot())), E = (d) => q.get(d), T = e$(navigator.userAgent), M = (d, w) => {
    const u = navigator.userAgent, $ = r$(u), P = `${location.origin}${location.pathname}${w ? `#gift=${w}` : ""}`, V = [g("p", `You are in ${d}'s built-in browser, where passkeys often do not work. Open this page in ${$} to make your listening wallet${w ? " and claim your gift" : ""}.`, "ppp-warn")], ct = g("div", "", "ppp-open-row"), ht = n$(P, u);
    if (ht) {
      const Lt = g("a", `Open in ${$}`, "primary ppp-open-in");
      Lt.href = ht, Lt.dataset.homeAction = "radio:open-in-browser", ct.append(Lt);
    }
    return ct.append(ds("copy-page-link", "Copy link", () => P, ht ? "" : "primary", () => be(o.snapshot()))), V.push(ct, g("p", `If that does not open ${$}, use ${d}'s menu (••• or ⋮) and choose "Open in ${$ === "your browser" ? "browser" : $}", or paste the copied link there.`, "ppp-mute")), V;
  }, B = (d) => E(d) ?? x(d), J = (d) => d.slice(0, 2).map(B).join(" and ") + (d.length > 2 ? ` and ${d.length - 2} more` : ""), F = /* @__PURE__ */ new Map();
  let Pt = !1;
  const ut = (d) => !d || /^(?:Inscription )?#\d+$/.test(d.trim()), Yt = () => {
    Pt || (Pt = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((d) => d.ok ? d.json() : null).then((d) => {
      for (const w of Array.isArray(d == null ? void 0 : d.tracks) ? d.tracks : []) {
        const u = Number(w == null ? void 0 : w.id);
        Number.isSafeInteger(u) && F.set(u, { title: typeof w.title == "string" ? w.title : void 0, artist: typeof w.artist == "string" ? w.artist : void 0 });
      }
      be(o.snapshot());
    }).catch(() => {
      Pt = !1;
    }));
  }, A = (d, w) => {
    const u = F.get(d), $ = C5(d, [u == null ? void 0 : u.title, w == null ? void 0 : w.title].find((V) => !ut(V)) || ""), P = L5(d, (u == null ? void 0 : u.artist) || (w == null ? void 0 : w.artist) || "");
    return { title: $, artist: P };
  }, _ = (d) => {
    const { title: w, artist: u } = A(d.song, d);
    return w ? `“${w}”${u ? ` — ${u}` : ""}` : `Song #${d.song}${u ? ` — ${u}` : ""}`;
  }, ft = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, $t = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function Et(d) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(d.step) ? ["", ""] : d.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : d.step === "over" ? ["OVER 1 STX", "bad"] : d.step === "locked" ? ["LOCKED", "mute"] : d.step === "intro" || d.step === "link" ? ["", ""] : d.step === "fund" ? d.depositPending ? ["ON ITS WAY", "warn"] : d.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : d.payingOn && d.session && d.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function At(d, w, u = "", $) {
    const P = g("dt", d), V = g("dd", w, u);
    return $ && V.append(" ", $), [P, V];
  }
  const Jt = document.getElementById("ppp-top"), se = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Rt = () => {
    var w, u;
    const d = o.snapshot();
    if (d.step === "connect" || d.step === "wrong-wallet") {
      (w = document.getElementById("radio-wallet-connect")) == null || w.click();
      return;
    }
    if (d.step === "elsewhere" && ((u = d.gate) != null && u.radioUrl)) {
      location.href = d.gate.radioUrl;
      return;
    }
    d.step === "locked" && !d.armed && !d.busy && o.unlock(), d.step === "ready" && !d.payingOn && !d.busy && o.switchOn(), se();
  };
  Jt && (Jt.onclick = Rt);
  function ge(d) {
    if (!Jt) return;
    const w = ($, P, V) => {
      Jt.hidden = !1, Jt.className = "ppp-top" + (P ? " is-" + P : ""), Jt.replaceChildren(g("span", "", "dot"), document.createTextNode($)), Jt.title = V;
    }, u = d.session ? Math.min(d.session.playsLeft, d.playsLeft) : 0;
    switch (d.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Jt.hidden = !0;
        return;
      case "elsewhere":
        return w("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        Jt.hidden = !0;
        return;
      case "intro":
        return w("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "wrong-wallet":
        return w(`Connect ${B(d.linked)}`, "warn", `This device's listening wallet belongs to ${B(d.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return w(d.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return w("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return d.depositPending ? w("Funds on their way", "quiet", "Paying starts by itself when they land") : w(d.entries.some(($) => $.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return w("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return w("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return d.payingOn && u > 0 ? w(`On · ${u.toLocaleString()} plays left`, "on", "Paying artists as you listen") : w("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  const Dt = document.getElementById("pppNudge"), jt = document.getElementById("onair");
  (tn = Dt == null ? void 0 : Dt.querySelector("button")) == null || tn.addEventListener("click", () => Rt());
  const Ge = {
    elsewhere: "Listening free · artists get nothing",
    connect: "Not paying artists",
    intro: "Not paying artists",
    locked: "Locked · not paying artists",
    "wrong-wallet": "Wrong wallet connected · not paying artists",
    link: "Not paying artists yet",
    fund: "No funds yet · artists unpaid",
    over: "Paused · artists unpaid",
    ready: "Paying is off · artists get nothing"
  }, dn = {
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
  function Ke(d) {
    var ct;
    if (d.step === "loading") return;
    const w = d.session ? Math.min(d.session.playsLeft, d.playsLeft) : 0, u = d.step === "ready" && d.payingOn && w > 0, $ = d.step === "fund" && d.depositPending, P = u || $ ? "" : Ge[d.step] ?? "", V = u ? "on" : P ? "off" : "";
    if (V ? document.documentElement.dataset.ppp = V : delete document.documentElement.dataset.ppp, jt && (jt.hidden = !V, jt.querySelector(".onair-sub").textContent = u ? `Paying artists · ${w.toLocaleString()} plays left` : "Not paying"), Dt && (Dt.hidden = V !== "off", V === "off")) {
      const ht = Math.floor(Number(1000000n / Mn(BigInt(((ct = d.gate) == null ? void 0 : ct.limits.playFee) ?? "300"))));
      Dt.querySelector(".nudge-t").textContent = "⚠ " + P, Dt.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${ht.toLocaleString()} plays, on-chain, straight to the artists.`, Dt.querySelector("button").textContent = dn[d.step] ?? "Start paying";
    }
  }
  let Be = "";
  function ye(d) {
    const w = g("div", "", "ppp-pick");
    d.funderMultiple && d.returnToKind === "funder" && w.append(g("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), d.returnToKind === "funder" && w.append(g("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const u = g("input");
    u.type = "text", u.placeholder = "SP… address to send returns to", u.autocomplete = "off", u.spellcheck = !1, u.setAttribute("aria-label", "Address to return funds to"), u.value = Be, u.oninput = () => {
      Be = u.value;
    };
    const $ = k(d.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(u.value), Be = "";
    }, "tiny");
    return w.append(u, " ", $), d.returnToKind === "chosen" && w.append(" ", k("Back to the funder", () => o.clearReturnAddress(), "tiny")), w;
  }
  const Ae = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function $e() {
    const d = g("p", Ae + " ", "ppp-mute");
    return d.append(I("Xverse", "https://www.xverse.app/download"), " · ", I("Leather", "https://leather.io/install-extension")), d;
  }
  let Gt = "";
  const Kt = (d) => {
    const w = document.documentElement, u = d.solo && !d.main ? d.listening ? x(d.listening) : "new" : "", $ = W6() ? "1" : "";
    `${u}|${$}` !== Gt && (Gt = `${u}|${$}`, u ? w.dataset.pppSolo = u : delete w.dataset.pppSolo, $ ? w.dataset.pppWalletInstalled = $ : delete w.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const d of [1500, 4e3, 9e3]) setTimeout(() => be(o.snapshot()), d);
  function we(d, w = "") {
    var P;
    const u = g("div", "", "ppp-topup"), $ = (P = d.likeFunds) == null ? void 0 : P.balance;
    u.append(g("span", "Add plays from My player: ", "ppp-mute"));
    for (const V of ru) {
      const ct = k(`+${(Number(V) / 1e6).toFixed(2)} STX`, () => void o.topUpAlbum(V), w);
      ct.disabled = $ === void 0 || $ < V + 6000n || d.depositPending || !!d.busy, u.append(ct);
    }
    return $ !== void 0 && $ < ru[0] + 6000n && u.append(g("p", "My player is nearly empty: add STX to it first (switch to My player above).", "ppp-mute")), u;
  }
  function Me(d) {
    const w = d.likeFunds;
    if (!w || !w.album || !w.low && !w.pending) return [];
    const u = g("div", "", "ppp-pick ppp-lowbox");
    if (!w.low) {
      const P = g("p", "Top-up for your main listener wallet is on its way. ", "ppp-warn");
      return w.txid && P.append(I("View", H(w.txid))), u.append(P), [u];
    }
    u.append(g("p", "⚠ YOUR MAIN LISTENER WALLET IS OUT OF FUNDS", "ppp-bad ppp-lowtitle")), u.append(g("p", "It signs every like for all your albums, so they all count for you. Likes are paused until it has a little STX. 0.1 STX is hundreds of likes.")), u.append(g("p", w.address, "ppp-addr-full"));
    const $ = g("div", "", "ppp-open-row");
    if ($.append(ds("copy-likes-address", "Copy address", () => w.address, "primary", () => be(o.snapshot()))), w.main && !d.solo) {
      const P = fs - (w.balance ?? 0n);
      P > 0n && $.append(k(`Pay ${In(P)} STX from my wallet`, () => void o.topUpLikes(), "primary"));
    }
    return u.append($), u.append(g("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [u];
  }
  function be(d) {
    var qs, Xs, Ie, Ws, Zr, Ys, hr, pr, en, gr, Qr, yr, Jr;
    const w = a.inProgress(d), u = w && d.step === "fund" ? { ...d, depositPending: !0 } : d;
    if (h(), S(d), Kt(u), ge(u), Ke(u), t.hidden = u.step === "off", t.hidden) return;
    const [$, P] = Et(u), V = n(".ppp-state");
    V.textContent = $, V.className = "ppp-state" + (P ? " ppp-state--" + P : ""), V.hidden = !$;
    const ct = !!u.busy || u.armed, ht = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(u.step) && (ct || !["intro", "loading"].includes(u.step));
    r.hidden = !ht, r.classList.toggle("ppp-frame--rest", !ct && !R);
    const Lt = n(".ppp-frame-label");
    Lt.hidden = !0;
    const lt = K6(u) ?? U;
    U = lt;
    const Zt = q6(u, lt);
    n(".ppp-badge").hidden = !Zt;
    const Ct = n(".ppp-steps"), It = n(".ppp-stage");
    Ct.hidden = It.hidden = !Zt, lt && Zt && (Ct.replaceChildren(...su(u.solo).map((j, Z) => {
      const te = g("li", "", Z < lt.at ? "done" : Z === lt.at ? lt.blocked ? "now blocked" : "now" : "");
      return te.append(g("span", Z < lt.at ? "✓" : String(Z + 1), "n"), j), Z === lt.at && te.setAttribute("aria-current", "step"), te;
    })), It.textContent = lt.caption, It.className = "ppp-stage " + (lt.at >= su(u.solo).length ? "ppp-ok" : lt.blocked ? "ppp-bad" : "ppp-cyan"));
    const Mt = n(".ppp-facts"), Vt = [];
    u.main && ((qs = u.gate) != null && qs.here) && !u.solo && Vt.push(...At("Your wallet", B(u.main), "ppp-addr-short"));
    const me = () => {
      if (!u.listening) return;
      const j = ds("copy-listening", "Copy", () => u.listening || "", "tiny", () => be(o.snapshot()));
      Vt.push(...At(u.slot > 0 ? "Album wallet" : u.linked ? "My player (technical)" : "My player wallet", x(u.listening), "ppp-addr-short", j));
    };
    if (u.linked || me(), u.listening && u.step !== "intro")
      if (u.linked)
        Vt.push(...At("Credited to", `${B(u.linked)} · plays, likes and returns`, u.linked === u.main || u.solo ? "ppp-ok" : "ppp-warn")), me();
      else if (u.solo) {
        u.creditedTo && Vt.push(...At("Credited to", `${B(u.creditedTo)} · plays and likes`, "ppp-ok"));
        const j = u.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : u.returnTo ? `${B(u.returnTo)} · ${u.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : u.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Vt.push(...At("Returns go to", u.gift ? j : u.returnTo && !E(u.returnTo) ? j.replace(x(u.returnTo), u.returnTo) : j, u.returnTo && !u.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Vt.push(...At("Linked to", "not linked yet", "ppp-warn"));
    if (u.linkedListening.length && ((Xs = u.gate) != null && Xs.here)) {
      const j = u.linkedListening.map((Z) => x(Z) + (Z === u.listening ? " (this one)" : "")).join(", ");
      Vt.push(...At(u.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", j, "ppp-addr-short"));
    }
    if (u.balance !== void 0 && ["fund", "ready", "over"].includes(u.step)) {
      const j = u.step === "fund" && u.depositPending ? "ppp-mute" : u.balanceState === "ok" ? "ppp-ok" : u.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Vt.push(...At("Balance", `${In(u.balance)} STX · about ${u.playsLeft.toLocaleString()} plays`, j));
    }
    const xe = u.entries.find((j) => j.kind === "play");
    xe && Yt(), xe && Vt.push(...At("Last paid song", `${_(xe)} → ${B(xe.recipient)}`, ft[xe.status] || "")), Mt.replaceChildren(...Vt), Mt.hidden = !Vt.length;
    const rt = [], et = [], kt = [], Se = [], Tt = Mn(BigInt(((Ie = u.gate) == null ? void 0 : Ie.limits.playFee) ?? "300")), ie = `Each song you listen to for 30 seconds sends ${In(Oa)} STX to whoever holds it, plus a ${In(Tt - Oa)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, En = !!u.busy;
    switch (u.step) {
      case "elsewhere": {
        if (rt.push(g("p", "Pay artists as you listen.")), (Ws = u.gate) != null && Ws.radioUrl) {
          const Z = g("p");
          Z.append(I("Open the pay-per-play radio →", u.gate.radioUrl)), rt.push(Z);
        }
        et.push(g("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (u.linked) {
          const Z = [u.linked, ...u.others];
          rt.push(g("p", Z.length > 1 ? `This device has listening wallets for ${J(Z)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${B(u.linked)}. Connect that wallet to keep paying artists.`)), et.push(g("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          rt.push(g("p", "Connect your wallet to pay artists as you listen.")), et.push(g("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        rt.push(g("p", `This device's listening wallet belongs to ${B(u.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), et.push(g("p", `You are connected as ${B(u.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), et.push(g("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), kt.push(k("Switch wallet", () => {
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
        rt.push(g("p", `Pay artists ${In(Tt)} STX a song as you listen.`)), et.push(g("p", ie)), et.push(g("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), et.push(g("p", u.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !u.solo && u.main && u.others.length ? (rt.push(g("p", `This device already has a listening wallet for ${J(u.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), et.push(g("p", `Otherwise, set up a new listening wallet for ${B(u.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !u.solo && u.main && et.push(g("p", `This is the listening wallet for ${B(u.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), u.solo && et.push(g("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const j = a.liveGift();
        kt.push(k(j ? "Claim my gift · no wallet needed" : u.solo ? "Turn on pay-per-play · no wallet needed" : u.others.length && u.main ? `Set up for ${B(u.main)}` : "Turn on pay-per-play", () => void o.create(), "primary")), !j && !u.solo && u.main && u.others.length && kt.push(k("Switch wallet", () => {
          var Z;
          return (Z = document.getElementById("radio-wallet-connect")) == null ? void 0 : Z.click();
        })), !j && u.solo && kt.push(k("I have a Stacks wallet", () => {
          var Z;
          return (Z = document.getElementById("radio-wallet-connect")) == null ? void 0 : Z.click();
        })), kt.push(k("I already have a listening wallet", () => void o.unlock(!0))), j && kt.push(k("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        u.armed || (rt.push(g("p", "Locked.", "ppp-mute")), kt.push(k(u.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), Se.push(k("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        rt.push(g("p", `Link to ${B(u.main)} · free`)), et.push(g("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), et.push(g("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), kt.push(k(u.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        rt.push(g("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (u.depositPending || ((Zr = u.gift) != null && Zr.player ? rt.push(g("p", "Out of plays · add more to keep listening", "ppp-bad")) : u.entries.length ? rt.push(g("p", "Out of funds · top up to keep paying", "ppp-bad")) : rt.push(g("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / Tt)).toLocaleString()} songs`))), (Ys = u.gift) != null && Ys.player ? et.push(g("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : u.entries.length && et.push(g("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), u.payingOn && !u.entries.length && et.push(g("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), w || (u.solo ? (et.push(g("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), et.push(g("p", u.listening || "", "ppp-addr-full")), u.listening && !u.depositPending && kt.push(ds("copy-address", "Copy my address", () => u.listening || "", "primary", () => be(o.snapshot())))) : et.push(g("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute"))), u.depositPending && u.depositTxid) {
          const Z = g("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          Z.append(I("View", H(u.depositTxid))), rt.push(Z);
        } else u.allowance > 0n && !u.solo && kt.push(k(`Deposit ${In(u.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        rt.push(g("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), u.solo && !u.returnTo && (rt.push(g("p", u.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), rt.push(ye(u))), (!u.solo || u.returnTo) && kt.push(k("Return excess", () => void o.returnFunds("excess"), "primary"), k("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (u.payingOn && u.session && u.session.playsLeft > 0) {
          const Z = Math.min(u.session.playsLeft, u.playsLeft);
          rt.push(g("p", `Paying as you listen · up to ${Z.toLocaleString()} plays left`, "ppp-ok")), et.push(g("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), kt.push(k("Switch off", () => void o.switchOff()));
        } else
          rt.push(g("p", "Paying is off. Music stays free.", "ppp-mute")), kt.push(k("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        u.queued && rt.push(g("p", u.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${u.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), u.balanceState === "low" && rt.push(g("p", "Running low · top up", "ppp-warn")), u.depositPending ? rt.push(g("p", "Top-up on its way…", "ppp-warn")) : u.allowance > 0n && u.balanceState !== "ok" && !u.solo && kt.push(k(`Top up ${In(u.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (u.solo && u.walletCannotSolo && et.push(g("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), u.solo && ["fund", "ready"].includes(u.step) && ((u.balance ?? 0n) > 0n && u.slot === 0 && et.push(ye(u)), et.push($e()), u.slot === 0 && u.step === "ready" && u.entries.some((j) => j.kind === "play" && j.status === "confirmed"))) {
      const j = g("p", "New to Stacks? ", "ppp-mute");
      j.append(I("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), rt.push(j);
    }
    if (u.walletOutdated && et.push(g("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), u.stuck && (rt.push(g("p", u.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${u.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), kt.push(k("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(u.step) && (u.returnTo || u.gift) && (u.balance ?? 0n) > 0n && Se.push(k(u.linked ? "Return all to my wallet" : u.gift ? "Return what is left…" : `Return all to ${B(u.returnTo)}`, () => void o.returnFunds("all"), "quiet")), u.slot > 0 && ((hr = u.gift) != null && hr.player) && ["ready", "fund"].includes(u.step) && u.giftPlays > 20 && Se.push(we(u, "quiet")), ["ready", "fund", "link", "over"].includes(u.step) && Se.push(k("Lock", () => void o.lock(), "quiet")), ht && !ct && Se.push(k(R ? "Hide listening wallet box" : "Show listening wallet box", () => {
      R = !R, be(o.snapshot());
    }, "quiet")), [...kt, ...Se].forEach((j) => j.disabled = En), En && (kt.length = 0), u.balance !== void 0 && ["fund", "ready", "over"].includes(u.step) && !(u.step === "fund" && u.depositPending && u.balance === 0n) && !((pr = u.gift) != null && pr.player)) {
      const j = u.balanceState === "ok" ? "ppp-ok" : u.balanceState === "low" ? "ppp-warn" : "ppp-bad", Z = rt.at(0);
      u.step === "ready" && Z ? Z.append(g("span", ` · ${C(u.balance)} STX`, j)) : rt.push(g("p", `Balance ${C(u.balance)} STX`, j));
    }
    if ((en = u.gift) != null && en.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(u.step)) {
      const j = g("p", "", "ppp-gift");
      j.append(`💿 Album · ${u.gift.player.title}`), u.gift.player.subtitle && j.append(" · ", u.gift.player.subtitle);
      const Z = ["ready", "fund", "over"].includes(u.step) && u.balance !== void 0 ? u.giftPlays === 0 && u.depositPending ? g("span", " · plays on their way", "ppp-warn") : g("span", u.giftPlays === 0 ? " · no plays left" : ` · ${u.giftPlays.toLocaleString()} ${u.giftPlays === 1 ? "play" : "plays"} left`, u.giftPlays === 0 ? "ppp-bad" : u.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      Z && j.append(Z);
      const te = (gr = rt.at(0)) == null ? void 0 : gr.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (u.step === "ready" && te && /STX/.test(te.textContent ?? "") && te.remove(), rt.unshift(j), u.giftPlays <= 20 && ["ready", "fund"].includes(u.step) && !u.depositPending)
        if (u.slot > 0)
          rt.splice(1, 0, g("p", u.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), we(u, "primary"));
        else {
          const ce = g("p", u.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          ce.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), ce.append(I("Xverse", "https://www.xverse.app/download"), " and ", I("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), rt.splice(1, 0, ce);
        }
    }
    if (u.gift && !u.linked && ["fund", "ready", "over"].includes(u.step) && u.returnPlan.state === "ready") {
      const j = u.returnPlan, Z = g("div", "", "ppp-pick");
      Z.append(g("p", j.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const te = g("ul", "", "ppp-gift-list");
      j.steps.forEach((ce, ts) => {
        const Pn = ce.kind === "gift" ? "the unused gift" : ce.kind === "deposit" ? "what was added to it" : "the rest", Qt = g("li");
        Qt.append(g("span", `${ts + 1}. ${In(BigInt(ce.send))} STX · ${Pn}`, "t"), g("span", ce.to ? ` → ${B(ce.to)}` : " → choose an address below", ce.to ? "ppp-mute" : "ppp-warn")), te.append(Qt);
      }), Z.append(te), j.kept && Z.append(g("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), j.steps.some((ce) => !ce.to) && Z.append(ye(u)), Z.append(k(j.steps.length > 1 ? `Confirm part 1 of ${j.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), rt.push(Z);
    }
    rt.unshift(...a.banner(d)), rt.unshift(...Me(u)), T && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(u.step)) && rt.unshift(...M(T, a.pendingCode())), u.solo && u.creditedTo && u.listening && !["intro", "off", "elsewhere", "loading"].includes(u.step) && rt.unshift(g("p", `This is ${B(u.creditedTo)}'s listening wallet. Plays and likes count for ${B(u.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...rt);
    const Ne = document.querySelector(".ppp-switch");
    if (Ne) {
      const j = c.latest(), Z = u.slot > 0, te = ["fund", "ready", "over"].includes(u.step) && (Z || !!j);
      if (Ne.hidden = !te, te) {
        const ce = (Pn, Qt, Oi, Di) => {
          const vn = k("", Di, "ppp-tab");
          return vn.setAttribute("aria-pressed", String(Oi)), vn.append(g("span", Pn, "tt"), g("span", Qt === void 0 ? "…" : `${C(Qt)} STX`, "ts")), vn.disabled = !!u.busy, vn;
        }, ts = Z ? ((yr = (Qr = u.gift) == null ? void 0 : Qr.player) == null ? void 0 : yr.title) ?? "Album" : j.title;
        Ne.replaceChildren(
          ce("🎧 My player", Z ? (Jr = u.likeFunds) == null ? void 0 : Jr.balance : u.balance, !Z, () => {
            Z && o.openAlbum(0);
          }),
          ce("💿 " + ts, Z ? u.balance : void 0, Z, () => {
            !Z && j && o.openAlbum(j.slot);
          })
        );
      }
    }
    const An = c.render(u), Ve = document.querySelector(".ppp-shelf");
    if (Ve) {
      Ve.hidden = !An;
      const j = Ve.querySelector("summary");
      j && (j.textContent = c.count() > 0 ? `♪ My albums (${c.count()})` : "♪ My albums");
      const Z = Ve.querySelector(".ppp-shelf-body");
      An && Z && !Z.contains(An) && Z.replaceChildren(An);
    }
    const pn = a.renderFold(d);
    if (n(".ppp-gifts").hidden = !pn, pn && !n(".ppp-gift-body").contains(pn) && n(".ppp-gift-body").replaceChildren(pn), pn && K) {
      K = !1;
      const j = n(".ppp-gifts");
      j.open = !0, requestAnimationFrame(() => j.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...et), n(".ppp-actions").replaceChildren(...kt), n(".ppp-actions2").replaceChildren(...Se);
    const qe = u.busy || u.message || "", dr = n(".ppp-msg"), _e = qe && rt.some((j) => (j.textContent ?? "").startsWith(qe.replace(/[.✓\s]+$/, ""))) ? "" : qe, Ks = !_e && !u.error ? u.notice : "";
    dr.textContent = _e || Ks, dr.classList.toggle("is-warn", !!Ks), n(".ppp-err").textContent = u.error;
    const Hi = u.entries.filter((j) => j.kind === "play");
    n(".ppp-recent").hidden = !u.entries.length, n(".ppp-recent-list").replaceChildren(...Hi.slice(0, 5).map((j) => {
      const Z = g("li"), te = j.status === "confirmed" ? "ok" : j.status === "failed" ? "bad" : "warn";
      return Z.append(g("span", "", "d " + te), g("span", _(j), "t"), g("span", D(j.created), "ppp-mute")), j.txid && Z.append(I("tx", H(j.txid))), Z;
    })), n(".ppp-wallets").hidden = !(Mt.childElementCount || Se.length), n(".ppp-more").hidden = !et.length;
    const Vs = n(".ppp-history");
    Vs.hidden = !u.entries.length, u.entries.length && Yt(), Vs.replaceChildren(g("summary", `All activity (${u.entries.length})`), ...u.entries.slice(0, 20).map((j) => {
      const Z = g("div", "", "ppp-row"), te = j.kind === "play" ? [g("span", _(j), "ppp-song"), g("span", ` · ${In(BigInt(j.amount))} STX to ${B(j.recipient)}`, "ppp-mute")] : j.kind === "like" ? [g("span", `${j.liked ? "♥ Liked" : "Unliked"} ${_(j)}`, "ppp-song"), g("span", ` · for ${u.linked ? B(u.linked) : "this listening wallet"}`, "ppp-mute")] : [g("span", `Returned ${In(BigInt(j.amount))} STX`, "ppp-song"), g("span", ` to ${B(j.recipient)}`, "ppp-mute")];
      return Z.append(
        g("span", $t[j.status] || j.status, "ppp-status " + (ft[j.status] || "")),
        ...te,
        g("span", ` · ${new Date(j.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), j.txid && Z.append(I("tx ↗", H(j.txid))), Z;
    }));
  }
  const hn = /* @__PURE__ */ new Map(), Ft = () => {
    const d = window.XtrataRadio;
    return d != null && d.subscribe ? (d.subscribe((w) => {
      const u = w == null ? void 0 : w.nowPlaying;
      u && Number.isSafeInteger(Number(u.tokenId)) && hn.set(Number(u.tokenId), { title: u.title || void 0, artist: u.artist || void 0 });
    }), !0) : !1;
  };
  if (!Ft()) {
    const d = setInterval(() => {
      Ft() && clearInterval(d);
    }, 500);
    setTimeout(() => clearInterval(d), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (d) => {
    const w = d.detail;
    if (w && Number.isSafeInteger(w.song) && typeof w.id == "string" && /^[0-9a-f]{32}$/.test(w.id)) {
      Yt();
      const u = A(w.song, hn.get(w.song));
      o.onListened({ song: w.song, id: w.id, title: u.title || void 0, artist: u.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const i$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", o$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", i = e.userAgent.includes("Edge"), s = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return s ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && i === !1 && o === !1;
}, a$ = () => o$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, c$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, l$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Oy = class {
  constructor(t) {
    FA(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && ox(t), this.callback(tc(t));
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
    var r, i, s, o, a, c, f, h, l, b;
    return n === "IOS" ? (i = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && i !== void 0 ? i : t.webUrl : e === "Chrome" ? (o = (s = t.chromeWebStoreUrl) !== null && s !== void 0 ? s : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (h = (f = t.googlePlayStoreUrl) !== null && f !== void 0 ? f : this.getBrowserUrl(t)) !== null && h !== void 0 ? h : t.webUrl : (b = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && b !== void 0 ? b : this.getMobileUrl(t);
  }
  render() {
    const t = a$(), e = c$(), n = this.defaultProviders.filter(
      (s) => this.installedProviders.findIndex((o) => o.id === s.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, i = n.length > 0;
    return pt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, pt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), pt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, pt("div", { class: "flex flex-col space-y-[10px]" }, pt("div", { class: "flex items-center" }, pt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), pt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, pt("span", { class: "sr-only" }, "Close popup"), pt("img", { src: i$ }))), r ? pt("p", null, "Select the wallet you want to connect to.") : pt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && pt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && pt("div", { class: "mt-6" }, pt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), pt("ul", { class: "space-y-3" }, this.installedProviders.map((s) => pt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, pt("div", { class: "aspect-square basis-9 overflow-hidden" }, pt("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), pt("div", { class: "flex-1" }, pt("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && pt("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), pt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(s.id) }, "Connect"))))), i && pt("div", { class: "mt-6" }, r ? pt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : pt("div", { class: "mb-5 flex justify-between" }, pt("p", { class: "text-sm font-medium" }, "Recommended wallets"), pt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, pt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, pt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), pt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), pt("p", null, "What is a wallet? ", pt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), pt("ul", { class: "space-y-3" }, n.map((s) => pt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, pt("div", { class: "aspect-square basis-9 overflow-hidden" }, pt("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), pt("div", { class: "flex-1" }, pt("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && pt("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), this.getInstallUrl(s, t, e) && pt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(s, t, e), rel: "noopener noreferrer", target: "_blank" }, s.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return SA(this);
  }
};
Oy.style = l$;
const u$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Oy
}, Symbol.toStringTag, { value: "Module" }));
