var xw = Object.defineProperty;
var Sw = (t, e, n) => e in t ? xw(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var eo = (t, e, n) => Sw(t, typeof e != "symbol" ? e + "" : e, n);
var rn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function f0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function d0(t) {
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
      typeof rn < "u" && rn || {}, r = {
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
      function u(A) {
        var T = {
          next: function() {
            var M = A.shift();
            return { done: M === void 0, value: M };
          }
        };
        return r.iterable && (T[Symbol.iterator] = function() {
          return T;
        }), T;
      }
      function f(A) {
        this.map = {}, A instanceof f ? A.forEach(function(T, M) {
          this.append(M, T);
        }, this) : Array.isArray(A) ? A.forEach(function(T) {
          if (T.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + T.length);
          this.append(T[0], T[1]);
        }, this) : A && Object.getOwnPropertyNames(A).forEach(function(T) {
          this.append(T, A[T]);
        }, this);
      }
      f.prototype.append = function(A, T) {
        A = a(A), T = c(T);
        var M = this.map[A];
        this.map[A] = M ? M + ", " + T : T;
      }, f.prototype.delete = function(A) {
        delete this.map[a(A)];
      }, f.prototype.get = function(A) {
        return A = a(A), this.has(A) ? this.map[A] : null;
      }, f.prototype.has = function(A) {
        return this.map.hasOwnProperty(a(A));
      }, f.prototype.set = function(A, T) {
        this.map[a(A)] = c(T);
      }, f.prototype.forEach = function(A, T) {
        for (var M in this.map)
          this.map.hasOwnProperty(M) && A.call(T, this.map[M], M, this);
      }, f.prototype.keys = function() {
        var A = [];
        return this.forEach(function(T, M) {
          A.push(M);
        }), u(A);
      }, f.prototype.values = function() {
        var A = [];
        return this.forEach(function(T) {
          A.push(T);
        }), u(A);
      }, f.prototype.entries = function() {
        var A = [];
        return this.forEach(function(T, M) {
          A.push([M, T]);
        }), u(A);
      }, r.iterable && (f.prototype[Symbol.iterator] = f.prototype.entries);
      function l(A) {
        if (!A._noBody) {
          if (A.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          A.bodyUsed = !0;
        }
      }
      function g(A) {
        return new Promise(function(T, M) {
          A.onload = function() {
            T(A.result);
          }, A.onerror = function() {
            M(A.error);
          };
        });
      }
      function h(A) {
        var T = new FileReader(), M = g(T);
        return T.readAsArrayBuffer(A), M;
      }
      function x(A) {
        var T = new FileReader(), M = g(T), _ = /charset=([A-Za-z0-9_-]+)/.exec(A.type), nt = _ ? _[1] : "utf-8";
        return T.readAsText(A, nt), M;
      }
      function m(A) {
        for (var T = new Uint8Array(A), M = new Array(T.length), _ = 0; _ < T.length; _++)
          M[_] = String.fromCharCode(T[_]);
        return M.join("");
      }
      function L(A) {
        if (A.slice)
          return A.slice(0);
        var T = new Uint8Array(A.byteLength);
        return T.set(new Uint8Array(A)), T.buffer;
      }
      function D() {
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
              return this.blob().then(h);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var A = l(this);
          if (A)
            return A;
          if (this._bodyBlob)
            return x(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(m(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(I);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var O = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function p(A) {
        var T = A.toUpperCase();
        return O.indexOf(T) > -1 ? T : A;
      }
      function k(A, T) {
        if (!(this instanceof k))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        T = T || {};
        var M = T.body;
        if (A instanceof k) {
          if (A.bodyUsed)
            throw new TypeError("Already read");
          this.url = A.url, this.credentials = A.credentials, T.headers || (this.headers = new f(A.headers)), this.method = A.method, this.mode = A.mode, this.signal = A.signal, !M && A._bodyInit != null && (M = A._bodyInit, A.bodyUsed = !0);
        } else
          this.url = String(A);
        if (this.credentials = T.credentials || this.credentials || "same-origin", (T.headers || !this.headers) && (this.headers = new f(T.headers)), this.method = p(T.method || this.method || "GET"), this.mode = T.mode || this.mode || null, this.signal = T.signal || this.signal || function() {
          if ("AbortController" in n) {
            var G = new AbortController();
            return G.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && M)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(M), (this.method === "GET" || this.method === "HEAD") && (T.cache === "no-store" || T.cache === "no-cache")) {
          var _ = /([?&])_=[^&]*/;
          if (_.test(this.url))
            this.url = this.url.replace(_, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var nt = /\?/;
            this.url += (nt.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      k.prototype.clone = function() {
        return new k(this, { body: this._bodyInit });
      };
      function I(A) {
        var T = new FormData();
        return A.trim().split("&").forEach(function(M) {
          if (M) {
            var _ = M.split("="), nt = _.shift().replace(/\+/g, " "), G = _.join("=").replace(/\+/g, " ");
            T.append(decodeURIComponent(nt), decodeURIComponent(G));
          }
        }), T;
      }
      function U(A) {
        var T = new f(), M = A.replace(/\r?\n[\t ]+/g, " ");
        return M.split("\r").map(function(_) {
          return _.indexOf(`
`) === 0 ? _.substr(1, _.length) : _;
        }).forEach(function(_) {
          var nt = _.split(":"), G = nt.shift().trim();
          if (G) {
            var Kt = nt.join(":").trim();
            try {
              T.append(G, Kt);
            } catch (wt) {
              console.warn("Response " + wt.message);
            }
          }
        }), T;
      }
      D.call(k.prototype);
      function V(A, T) {
        if (!(this instanceof V))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (T || (T = {}), this.type = "default", this.status = T.status === void 0 ? 200 : T.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = T.statusText === void 0 ? "" : "" + T.statusText, this.headers = new f(T.headers), this.url = T.url || "", this._initBody(A);
      }
      D.call(V.prototype), V.prototype.clone = function() {
        return new V(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new f(this.headers),
          url: this.url
        });
      }, V.error = function() {
        var A = new V(null, { status: 200, statusText: "" });
        return A.ok = !1, A.status = 0, A.type = "error", A;
      };
      var F = [301, 302, 303, 307, 308];
      V.redirect = function(A, T) {
        if (F.indexOf(T) === -1)
          throw new RangeError("Invalid status code");
        return new V(null, { status: T, headers: { location: A } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(T, M) {
          this.message = T, this.name = M;
          var _ = Error(T);
          this.stack = _.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function R(A, T) {
        return new Promise(function(M, _) {
          var nt = new k(A, T);
          if (nt.signal && nt.signal.aborted)
            return _(new e.DOMException("Aborted", "AbortError"));
          var G = new XMLHttpRequest();
          function Kt() {
            G.abort();
          }
          G.onload = function() {
            var $ = {
              statusText: G.statusText,
              headers: U(G.getAllResponseHeaders() || "")
            };
            nt.url.indexOf("file://") === 0 && (G.status < 200 || G.status > 599) ? $.status = 200 : $.status = G.status, $.url = "responseURL" in G ? G.responseURL : $.headers.get("X-Request-URL");
            var N = "response" in G ? G.response : G.responseText;
            setTimeout(function() {
              M(new V(N, $));
            }, 0);
          }, G.onerror = function() {
            setTimeout(function() {
              _(new TypeError("Network request failed"));
            }, 0);
          }, G.ontimeout = function() {
            setTimeout(function() {
              _(new TypeError("Network request timed out"));
            }, 0);
          }, G.onabort = function() {
            setTimeout(function() {
              _(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function wt($) {
            try {
              return $ === "" && n.location.href ? n.location.href : $;
            } catch {
              return $;
            }
          }
          if (G.open(nt.method, wt(nt.url), !0), nt.credentials === "include" ? G.withCredentials = !0 : nt.credentials === "omit" && (G.withCredentials = !1), "responseType" in G && (r.blob ? G.responseType = "blob" : r.arrayBuffer && (G.responseType = "arraybuffer")), T && typeof T.headers == "object" && !(T.headers instanceof f || n.Headers && T.headers instanceof n.Headers)) {
            var pe = [];
            Object.getOwnPropertyNames(T.headers).forEach(function($) {
              pe.push(a($)), G.setRequestHeader($, c(T.headers[$]));
            }), nt.headers.forEach(function($, N) {
              pe.indexOf(N) === -1 && G.setRequestHeader(N, $);
            });
          } else
            nt.headers.forEach(function($, N) {
              G.setRequestHeader(N, $);
            });
          nt.signal && (nt.signal.addEventListener("abort", Kt), G.onreadystatechange = function() {
            G.readyState === 4 && nt.signal.removeEventListener("abort", Kt);
          }), G.send(typeof nt._bodyInit > "u" ? null : nt._bodyInit);
        });
      }
      return R.polyfill = !0, n.fetch || (n.fetch = R, n.Headers = f, n.Request = k, n.Response = V), e.Headers = f, e.Request = k, e.Response = V, e.fetch = R, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : rn);
})();
const Aw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Ew(t, e) {
  const n = {};
  return Object.assign(n, Aw, e), await fetch(t, n);
}
function vw(t) {
  let e = Ew, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function $w(...t) {
  const { fetchLib: e, middlewares: n } = vw(t);
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
var vi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(vi || (vi = {}));
var Ns;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ns || (Ns = {}));
var Hf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Hf || (Hf = {}));
const Iw = "https://api.mainnet.hiro.so", kw = "https://api.testnet.hiro.so", Lw = "http://localhost:3999", Cw = ["mainnet", "testnet", "devnet", "mocknet"];
let $i = class {
  constructor(e) {
    this.version = Ns.Mainnet, this.chainId = vi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ns.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? $w();
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
$i.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new ul();
    case "testnet":
      return new Bw();
    case "devnet":
      return new Tw();
    case "mocknet":
      return new h0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Cw.join(", ")}`);
  }
};
$i.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : $i.fromName(t);
let ul = class extends $i {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Iw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ns.Mainnet, this.chainId = vi.Mainnet;
  }
}, Bw = class extends $i {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? kw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ns.Testnet, this.chainId = vi.Testnet;
  }
}, h0 = class extends $i {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Lw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ns.Testnet, this.chainId = vi.Testnet;
  }
};
const Tw = h0, p0 = "xtrata.wallet.bridge.v1", _w = (t) => typeof t == "object" && t !== null && t.protocol === p0, Hw = (t) => _w(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", Mw = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class no extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Mf = 12e4;
class Nw {
  constructor(e) {
    eo(this, "pending", /* @__PURE__ */ new Map());
    eo(this, "listenTarget");
    eo(this, "closed", !1);
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
    eo(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !Hw(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new no("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new no("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new no("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = Mw(), i = { protocol: p0, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new no(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Mf}ms.`
          )
        );
      }, this.options.timeoutMs ?? Mf);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new no("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const Pw = ["SP", "SM"], Uw = ["ST", "SN"], Ow = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return Pw.includes(n) ? "mainnet" : Uw.includes(n) ? "testnet" : null;
}, Dw = () => {
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
}, Fw = () => typeof window > "u" || !window.localStorage ? Dw() : window.localStorage, Tc = "xtrata.v15.1.wallet.session", Nf = "mainnet", Ea = { isConnected: !1 }, jw = (t) => t.address ? Ow(t.address) ?? t.network : t.network, g0 = (t) => !t.isConnected || !t.address ? { ...Ea } : jw(t) !== Nf ? { ...Ea } : {
  isConnected: !0,
  address: t.address,
  network: Nf,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, zw = (t) => {
  if (!t)
    return { ...Ea };
  try {
    const e = JSON.parse(t);
    return g0(e);
  } catch {
    return { ...Ea };
  }
}, Rw = (t) => {
  const e = g0(t);
  return JSON.stringify(e);
}, Gw = (t) => {
  const e = Fw();
  return {
    load: () => zw(e.getItem(Tc)),
    save: (n) => {
      e.setItem(Tc, Rw(n));
    },
    clear: () => {
      e.removeItem(Tc);
    }
  };
}, Vw = "https://browser.blockstack.org/auth", Kw = {
  "@type": "Person",
  "@context": "http://schema.org"
}, y0 = ["store_write"], Ww = "blockstack-session", Xw = {
  logLevel: "debug"
}, Qs = {
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
Object.freeze(Qs);
class zi extends Error {
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
class qw extends zi {
  constructor(e, n = "") {
    super({ code: Qs.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Pf extends zi {
  constructor(e = "") {
    super({ code: Qs.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Fo extends zi {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Qs.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Uf extends zi {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Qs.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class fl extends zi {
  constructor(e) {
    super({ code: Qs.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class w0 extends zi {
  constructor(e) {
    super({ code: Qs.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Of = ["debug", "info", "warn", "error", "none"], dl = {};
for (let t = 0; t < Of.length; t++) {
  const e = Of[t];
  dl[e] = t;
}
class wi {
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
    return dl[Xw.logLevel] <= dl[e];
  }
}
function Yw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Zw() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function _c(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Qw() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Jw() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function tb(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function yu(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Jw(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    wi.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = tb(s, t.toString(), n);
    throw wi.error(i), new Error(i);
  }
  if (r)
    return {};
}
function hs(t, e) {
  return wu(Ye(t), e);
}
function Ye(t) {
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
  if (pn(t, Uint8Array))
    return BigInt(`0x${dt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function eb(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Df(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Co(t, e = 8) {
  return (typeof t == "bigint" ? t : Ye(t)).toString(16).padStart(e * 2, "0");
}
function Za(t) {
  return parseInt(t, 16);
}
function wu(t, e = 16) {
  const n = Co(t, e);
  return zt(n);
}
function nb(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function rb(t, e) {
  return t & BigInt(1) << e;
}
function hl(t) {
  return sb(BigInt(`0x${dt(t)}`), BigInt(t.byteLength * 8));
}
function sb(t, e) {
  return rb(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const ib = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function dt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += ib[n];
  return e;
}
function zt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = eb(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function Js(t) {
  return new TextEncoder().encode(t);
}
function Bo(t) {
  return new TextDecoder().decode(t);
}
function ob(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function ab(t) {
  return String.fromCharCode.apply(null, t);
}
function cb(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Ff(t) {
  if (t.some(cb))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function cr(...t) {
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
function Le(t) {
  return cr(...t.map((e) => typeof e == "number" ? Ff([e]) : e instanceof Array ? Ff(e) : e));
}
function pn(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const b0 = "https://api.mainnet.hiro.so", m0 = "https://api.testnet.hiro.so", x0 = "http://localhost:3999", lb = "https://hub.blockstack.org", ub = 33, Hc = 32;
function fb(t) {
  if (t.length < Hc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Hc * 2), r = t.slice(2 + Hc * 2);
  return {
    recoveryId: Za(e),
    r: n,
    s: r
  };
}
function bu(t) {
  const e = typeof t == "string" ? zt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function db(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function hb(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function pb(t, e) {
  return t[e];
}
function gb(t, e, n = 0) {
  return t[n] = e, t;
}
function yb(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Ps(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
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
class S0 {
  constructor(e = y0.slice(), n = ((a) => (a = yu("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = Vw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function pl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Sb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function A0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Ab(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  pl(t.outputLen), pl(t.blockLen);
}
function Eb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function vb(t, e) {
  A0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const $s = {
  number: pl,
  bool: Sb,
  bytes: A0,
  hash: Ab,
  exists: Eb,
  output: vb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Mc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Xn = (t, e) => t << 32 - e | t >>> e, $b = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!$b)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ib(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function mu(t) {
  if (typeof t == "string" && (t = Ib(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let E0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ti(t) {
  const e = (r) => t().update(mu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let v0 = class extends E0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, $s.hash(e);
    const r = mu(n);
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
    return $s.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    $s.exists(this), $s.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Qa = (t, e, n) => new v0(t, e).update(n).digest();
Qa.create = (t, e) => new v0(t, e);
function kb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let xu = class extends E0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Mc(this.buffer);
  }
  update(e) {
    $s.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = mu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Mc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    $s.exists(this), $s.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    kb(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Mc(e), c = this.outputLen;
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
const Lb = (t, e, n) => t & e ^ ~t & n, Cb = (t, e, n) => t & e ^ t & n ^ e & n, Bb = new Uint32Array([
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
]), Hr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Mr = new Uint32Array(64);
let $0 = class extends xu {
  constructor() {
    super(64, 32, 8, !1), this.A = Hr[0] | 0, this.B = Hr[1] | 0, this.C = Hr[2] | 0, this.D = Hr[3] | 0, this.E = Hr[4] | 0, this.F = Hr[5] | 0, this.G = Hr[6] | 0, this.H = Hr[7] | 0;
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
      Mr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Mr[l - 15], h = Mr[l - 2], x = Xn(g, 7) ^ Xn(g, 18) ^ g >>> 3, m = Xn(h, 17) ^ Xn(h, 19) ^ h >>> 10;
      Mr[l] = m + Mr[l - 7] + x + Mr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = Xn(a, 6) ^ Xn(a, 11) ^ Xn(a, 25), h = f + g + Lb(a, c, u) + Bb[l] + Mr[l] | 0, m = (Xn(r, 2) ^ Xn(r, 13) ^ Xn(r, 22)) + Cb(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    Mr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Tb = class extends $0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Ii = ti(() => new $0());
ti(() => new Tb());
const _b = {}, I0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _b
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Ft = BigInt(0), de = BigInt(1), as = BigInt(2), lo = BigInt(3), jf = BigInt(8), Qt = Object.freeze({
  a: Ft,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: de,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), zf = (t, e) => (t + e / as) / e, jo = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = Qt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -de * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = zf(i * t, e), c = zf(-r * t, e);
    let u = Y(t - a * n - c * s, e), f = Y(-a * r - c * i, e);
    const l = u > o, g = f > o;
    if (l && (u = e - u), g && (f = e - f), u > o || f > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: g, k2: f };
  }
}, Rn = 32, Us = 32, k0 = 32, va = Rn + 1, $a = 2 * Rn + 1;
function Rf(t) {
  const { a: e, b: n } = Qt, r = Y(t * t), s = Y(r * t);
  return Y(s + e * t + n);
}
const zo = Qt.a === Ft;
class Su extends Error {
  constructor(e) {
    super(e);
  }
}
function Gf(t) {
  if (!(t instanceof Vt))
    throw new TypeError("JacobianPoint expected");
}
class Vt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof _t))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(_t.ZERO) ? Vt.ZERO : new Vt(e.x, e.y, de);
  }
  static toAffineBatch(e) {
    const n = Ub(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return Vt.toAffineBatch(e).map(Vt.fromAffine);
  }
  equals(e) {
    Gf(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = Y(s * s), u = Y(a * a), f = Y(n * u), l = Y(i * c), g = Y(Y(r * a) * u), h = Y(Y(o * s) * c);
    return f === l && g === h;
  }
  negate() {
    return new Vt(this.x, Y(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = Y(e * e), i = Y(n * n), o = Y(i * i), a = e + i, c = Y(as * (Y(a * a) - s - o)), u = Y(lo * s), f = Y(u * u), l = Y(f - as * c), g = Y(u * (c - l) - jf * o), h = Y(as * n * r);
    return new Vt(l, g, h);
  }
  add(e) {
    Gf(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === Ft || o === Ft)
      return this;
    if (n === Ft || r === Ft)
      return e;
    const c = Y(s * s), u = Y(a * a), f = Y(n * u), l = Y(i * c), g = Y(Y(r * a) * u), h = Y(Y(o * s) * c), x = Y(l - f), m = Y(h - g);
    if (x === Ft)
      return m === Ft ? this.double() : Vt.ZERO;
    const L = Y(x * x), D = Y(x * L), O = Y(f * L), p = Y(m * m - D - as * O), k = Y(m * (O - p) - g * D), I = Y(s * a * x);
    return new Vt(p, k, I);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Vt.ZERO;
    if (typeof e == "bigint" && e === Ft)
      return n;
    let r = Wf(e);
    if (r === de)
      return this;
    if (!zo) {
      let l = n, g = this;
      for (; r > Ft; )
        r & de && (l = l.add(g)), g = g.double(), r >>= de;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = jo.splitScalar(r), c = n, u = n, f = this;
    for (; i > Ft || a > Ft; )
      i & de && (c = c.add(f)), a & de && (u = u.add(f)), f = f.double(), i >>= de, a >>= de;
    return s && (c = c.negate()), o && (u = u.negate()), u = new Vt(Y(u.x * jo.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = zo ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(Vt.BASE) && (n = _t.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && gl.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = Vt.normalizeZ(s), gl.set(n, s)));
    let i = Vt.ZERO, o = Vt.BASE;
    const a = 1 + (zo ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), f = 2 ** r, l = BigInt(r);
    for (let g = 0; g < a; g++) {
      const h = g * c;
      let x = Number(e & u);
      e >>= l, x > c && (x -= f, e += de);
      const m = h, L = h + Math.abs(x) - 1, D = g % 2 !== 0, O = x < 0;
      x === 0 ? o = o.add(Ro(D, s[m])) : i = i.add(Ro(O, s[L]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = Wf(e), s, i;
    if (zo) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = jo.splitScalar(r);
      let { p: f, f: l } = this.wNAF(a, n), { p: g, f: h } = this.wNAF(u, n);
      f = Ro(o, f), g = Ro(c, g), g = new Vt(Y(g.x * jo.beta), g.y, g.z), s = f.add(g), i = l.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return Vt.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(Vt.ZERO);
    e == null && (e = i ? jf : Ri(s));
    const o = e, a = Y(o * o), c = Y(a * o), u = Y(n * a), f = Y(r * c), l = Y(s * o);
    if (i)
      return _t.ZERO;
    if (l !== de)
      throw new Error("invZ was invalid");
    return new _t(u, f);
  }
}
Vt.BASE = new Vt(Qt.Gx, Qt.Gy, de);
Vt.ZERO = new Vt(Ft, de, Ft);
function Ro(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const gl = /* @__PURE__ */ new WeakMap();
class _t {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, gl.delete(this);
  }
  hasEvenY() {
    return this.y % as === Ft;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = vn(n ? e : e.subarray(1));
    if (!ya(r))
      throw new Error("Point is not on curve");
    const s = Rf(r);
    let i = Pb(s);
    const o = (i & de) === de;
    n ? o && (i = Y(-i)) : (e[0] & 1) === 1 !== o && (i = Y(-i));
    const a = new _t(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = vn(e.subarray(1, Rn + 1)), r = vn(e.subarray(Rn + 1, Rn * 2 + 1)), s = new _t(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = lr(e), r = n.length, s = n[0];
    if (r === Rn)
      return this.fromCompressedHex(n);
    if (r === va && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === $a && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${va} compressed bytes or ${$a} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return _t.BASE.multiply(Os(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = B0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Au(lr(e)), { n: a } = Qt, c = r === 2 || r === 3 ? s + a : s, u = Ri(c, a), f = Y(-o * u, a), l = Y(i * u, a), g = r & 1 ? "03" : "02", h = _t.fromHex(g + ls(c)), x = _t.BASE.multiplyAndAddUnsafe(h, f, l);
    if (!x)
      throw new Error("Cannot recover signature: point at infinify");
    return x.assertValidity(), x;
  }
  toRawBytes(e = !1) {
    return us(this.toHex(e));
  }
  toHex(e = !1) {
    const n = ls(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${ls(this.y)}`;
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
    const s = Y(r * r), i = Rf(n);
    if (Y(s - i) !== Ft)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new _t(this.x, Y(-this.y));
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
    const s = Vt.fromAffine(this), i = n === Ft || n === de || this !== _t.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = Vt.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(Vt.ZERO) ? void 0 : a.toAffine();
  }
}
_t.BASE = new _t(Qt.Gx, Qt.Gy);
_t.ZERO = new _t(Ft, Ft);
function Vf(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Kf(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${ki(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: vn(n), left: t.subarray(e + 2) };
}
function Hb(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${ki(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Kf(t.subarray(2)), { data: r, left: s } = Kf(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${ki(s)}`);
  return { r: e, s: r };
}
class En {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? ki(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new En(Ia(s.slice(0, 64)), Ia(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Hb(n ? e : us(e));
    return new En(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Ci(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Ci(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = Qt.n >> de;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new En(this.r, Y(-this.s, Qt.n)) : this;
  }
  toDERRawBytes() {
    return us(this.toDERHex());
  }
  toDERHex() {
    const e = Vf(ro(this.s)), n = Vf(ro(this.r)), r = e.length / 2, s = n.length / 2, i = ro(r), o = ro(s);
    return `30${ro(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return us(this.toCompactHex());
  }
  toCompactHex() {
    return ls(this.r) + ls(this.s);
  }
}
function is(...t) {
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
const Mb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ki(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Mb[t[n]];
  return e;
}
const Nb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function ls(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Ft <= t && t < Nb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Li(t) {
  const e = us(ls(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function ro(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Ia(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function us(t) {
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
function vn(t) {
  return Ia(ki(t));
}
function lr(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : us(t);
}
function Wf(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Ci(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function Y(t, e = Qt.P) {
  const n = t % e;
  return n >= Ft ? n : e + n;
}
function Bn(t, e) {
  const { P: n } = Qt;
  let r = t;
  for (; e-- > Ft; )
    r *= r, r %= n;
  return r;
}
function Pb(t) {
  const { P: e } = Qt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, f = Bn(u, lo) * u % e, l = Bn(f, lo) * u % e, g = Bn(l, as) * c % e, h = Bn(g, r) * g % e, x = Bn(h, s) * h % e, m = Bn(x, o) * x % e, L = Bn(m, a) * m % e, D = Bn(L, o) * x % e, O = Bn(D, lo) * u % e, p = Bn(O, i) * h % e, k = Bn(p, n) * c % e, I = Bn(k, as);
  if (I * I % e !== t)
    throw new Error("Cannot find square root");
  return I;
}
function Ri(t, e = Qt.P) {
  if (t === Ft || e <= Ft)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = Y(t, e), r = e, s = Ft, i = de;
  for (; n !== Ft; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== de)
    throw new Error("invert: does not exist");
  return Y(s, e);
}
function Ub(t, e = Qt.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === Ft ? i : (n[a] = i, Y(i * o, e)), de), s = Ri(r, e);
  return t.reduceRight((i, o, a) => o === Ft ? i : (n[a] = Y(i * n[a], e), Y(i * o, e)), s), n;
}
function Ob(t) {
  const e = t.length * 8 - Us * 8, n = vn(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Au(t, e = !1) {
  const n = Ob(t);
  if (e)
    return n;
  const { n: r } = Qt;
  return n >= r ? n - r : n;
}
let Ai, uo;
class L0 {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Ae.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return uo(this.k, ...e);
  }
  checkSync() {
    if (typeof uo != "function")
      throw new Su("hmacSha256Sync needs to be set");
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
    return is(...n);
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
    return is(...n);
  }
}
function Ci(t) {
  return Ft < t && t < Qt.n;
}
function ya(t) {
  return Ft < t && t < Qt.P;
}
function C0(t, e, n, r = !0) {
  const { n: s } = Qt, i = Au(t, !0);
  if (!Ci(i))
    return;
  const o = Ri(i, s), a = _t.BASE.multiply(i), c = Y(a.x, s);
  if (c === Ft)
    return;
  const u = Y(o * Y(e + n * c, s), s);
  if (u === Ft)
    return;
  let f = new En(c, u), l = (a.x === f.r ? 0 : 2) | Number(a.y & de);
  return r && f.hasHighS() && (f = f.normalizeS(), l ^= 1), { sig: f, recovery: l };
}
function Os(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Us)
      throw new Error("Expected 32 bytes of private key");
    e = Ia(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Us)
      throw new Error("Expected 32 bytes of private key");
    e = vn(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Ci(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Eu(t) {
  return t instanceof _t ? (t.assertValidity(), t) : _t.fromHex(t);
}
function B0(t) {
  if (t instanceof En)
    return t.assertValidity(), t;
  try {
    return En.fromDER(t);
  } catch {
    return En.fromCompact(t);
  }
}
function To(t, e = !1) {
  return _t.fromPrivateKey(t).toRawBytes(e);
}
function Db(t, e, n, r = !1) {
  return _t.fromSignature(t, e, n).toRawBytes(r);
}
function Xf(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === va || r === $a : n ? r === va * 2 || r === $a * 2 : t instanceof _t;
}
function vu(t, e, n = !1) {
  if (Xf(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Xf(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Eu(e);
  return r.assertValidity(), r.multiply(Os(t)).toRawBytes(n);
}
function T0(t) {
  const e = t.length > Rn ? t.slice(0, Rn) : t;
  return vn(e);
}
function Fb(t) {
  const e = T0(t), n = Y(e, Qt.n);
  return _0(n < Ft ? e : n);
}
function _0(t) {
  return Li(t);
}
function H0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = lr(t), s = Os(e), i = [_0(s), Fb(r)];
  if (n != null) {
    n === !0 && (n = Ae.randomBytes(Rn));
    const c = lr(n);
    if (c.length !== Rn)
      throw new Error(`sign: Expected ${Rn} bytes of extra data`);
    i.push(c);
  }
  const o = is(...i), a = T0(r);
  return { seed: o, m: a, d: s };
}
function M0(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function jb(t, e, n = {}) {
  const { seed: r, m: s, d: i } = H0(t, e, n.extraEntropy), o = new L0(k0, Us);
  await o.reseed(r);
  let a;
  for (; !(a = C0(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return M0(a, n);
}
function Ja(t, e, n = {}) {
  const { seed: r, m: s, d: i } = H0(t, e, n.extraEntropy), o = new L0(k0, Us);
  o.reseedSync(r);
  let a;
  for (; !(a = C0(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return M0(a, n);
}
const zb = { strict: !0 };
function Rb(t, e, n, r = zb) {
  let s;
  try {
    s = B0(t), e = lr(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Au(e);
  let c;
  try {
    c = Eu(n);
  } catch {
    return !1;
  }
  const { n: u } = Qt, f = Ri(o, u), l = Y(a * f, u), g = Y(i * f, u), h = _t.BASE.multiplyAndAddUnsafe(c, l, g);
  return h ? Y(h.x, u) === i : !1;
}
function ka(t) {
  return Y(vn(t), Qt.n);
}
class Bi {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = lr(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = vn(n.subarray(0, 32)), s = vn(n.subarray(32, 64));
    return new Bi(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ya(e) || !Ci(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return ls(this.r) + ls(this.s);
  }
  toRawBytes() {
    return us(this.toHex());
  }
}
function Gb(t) {
  return _t.fromPrivateKey(t).toRawX();
}
class N0 {
  constructor(e, n, r = Ae.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = lr(e);
    const { x: s, scalar: i } = this.getScalar(Os(n));
    if (this.px = s, this.d = i, this.rand = lr(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = _t.fromPrivateKey(e), r = n.hasEvenY() ? e : Qt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Li(e ^ vn(n));
  }
  finalizeNonce(e) {
    const n = Y(vn(e), Qt.n);
    if (n === Ft)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new Bi(e.x, Y(n + r * s, Qt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Ae.taggedHash, o = this.initNonce(n, await i(ss.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(ss.nonce, o, r, e)), f = ka(await i(ss.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return await O0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Ae.taggedHashSync, o = this.initNonce(n, i(ss.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(ss.nonce, o, r, e)), f = ka(i(ss.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return D0(l, e, r) || this.error(), l;
  }
}
async function Vb(t, e, n) {
  return new N0(t, e, n).calc();
}
function Kb(t, e, n) {
  return new N0(t, e, n).calcSync();
}
function P0(t, e, n) {
  const r = t instanceof Bi, s = r ? t : Bi.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: lr(e),
    P: Eu(n)
  };
}
function U0(t, e, n, r) {
  const s = _t.BASE.multiplyAndAddUnsafe(e, Os(n), Y(-r, Qt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function O0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = P0(t, e, n), a = ka(await Ae.taggedHash(ss.challenge, Li(r), o.toRawX(), i));
    return U0(r, o, s, a);
  } catch {
    return !1;
  }
}
function D0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = P0(t, e, n), a = ka(Ae.taggedHashSync(ss.challenge, Li(r), o.toRawX(), i));
    return U0(r, o, s, a);
  } catch (r) {
    if (r instanceof Su)
      throw r;
    return !1;
  }
}
const Wb = {
  Signature: Bi,
  getPublicKey: Gb,
  sign: Vb,
  verify: O0,
  signSync: Kb,
  verifySync: D0
};
_t.BASE._setWindowSize(8);
const wn = {
  node: I0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ss = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Go = {}, Ae = {
  bytesToHex: ki,
  hexToBytes: us,
  concatBytes: is,
  mod: Y,
  invert: Ri,
  isValidPrivateKey(t) {
    try {
      return Os(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Li,
  _normalizePrivateKey: Os,
  hashToPrivateKey: (t) => {
    t = lr(t);
    const e = Us + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = Y(vn(t), Qt.n - de) + de;
    return Li(n);
  },
  randomBytes: (t = 32) => {
    if (wn.web)
      return wn.web.getRandomValues(new Uint8Array(t));
    if (wn.node) {
      const { randomBytes: e } = wn.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Ae.hashToPrivateKey(Ae.randomBytes(Us + 8)),
  precompute(t = 8, e = _t.BASE) {
    const n = e === _t.BASE ? e : new _t(e.x, e.y);
    return n._setWindowSize(t), n.multiply(lo), n;
  },
  sha256: async (...t) => {
    if (wn.web) {
      const e = await wn.web.subtle.digest("SHA-256", is(...t));
      return new Uint8Array(e);
    } else if (wn.node) {
      const { createHash: e } = wn.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (wn.web) {
      const n = await wn.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = is(...e), s = await wn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (wn.node) {
      const { createHmac: n } = wn.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Go[t];
    if (n === void 0) {
      const r = await Ae.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = is(r, r), Go[t] = n;
    }
    return Ae.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Ai != "function")
      throw new Su("sha256Sync is undefined, you need to set it");
    let n = Go[t];
    if (n === void 0) {
      const r = Ai(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = is(r, r), Go[t] = n;
    }
    return Ai(n, ...e);
  },
  _JacobianPoint: Vt
};
Object.defineProperties(Ae, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Ai;
    },
    set(t) {
      Ai || (Ai = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return uo;
    },
    set(t) {
      uo || (uo = t);
    }
  }
});
const Xb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Qt,
  Point: _t,
  Signature: En,
  getPublicKey: To,
  getSharedSecret: vu,
  recoverPublicKey: Db,
  schnorr: Wb,
  sign: jb,
  signSync: Ja,
  utils: Ae,
  verify: Rb
}, Symbol.toStringTag, { value: "Module" }));
var _o = {};
_o.byteLength = Jb;
var qb = _o.toByteArray = e1, Yb = _o.fromByteArray = s1, nr = [], _n = [], Zb = typeof Uint8Array < "u" ? Uint8Array : Array, Nc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var di = 0, Qb = Nc.length; di < Qb; ++di)
  nr[di] = Nc[di], _n[Nc.charCodeAt(di)] = di;
_n[45] = 62;
_n[95] = 63;
function F0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Jb(t) {
  var e = F0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function t1(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function e1(t) {
  var e, n = F0(t), r = n[0], s = n[1], i = new Zb(t1(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = _n[t.charCodeAt(c)] << 18 | _n[t.charCodeAt(c + 1)] << 12 | _n[t.charCodeAt(c + 2)] << 6 | _n[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = _n[t.charCodeAt(c)] << 2 | _n[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = _n[t.charCodeAt(c)] << 10 | _n[t.charCodeAt(c + 1)] << 4 | _n[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function n1(t) {
  return nr[t >> 18 & 63] + nr[t >> 12 & 63] + nr[t >> 6 & 63] + nr[t & 63];
}
function r1(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(n1(r));
  return s.join("");
}
function s1(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(r1(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    nr[e >> 2] + nr[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    nr[e >> 10] + nr[e >> 4 & 63] + nr[e << 2 & 63] + "="
  )), s.join("");
}
function i1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const o1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function a1() {
  if (i1())
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
    throw new Error(o1);
  }
}
class c1 {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(cr(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(cr(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class l1 {
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
async function j0() {
  const t = await a1();
  return t.name === "subtleCrypto" ? new l1(t.lib) : new c1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function u1(t) {
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
  function f(h) {
    if (h instanceof Uint8Array || (ArrayBuffer.isView(h) ? h = new Uint8Array(h.buffer, h.byteOffset, h.byteLength) : Array.isArray(h) && (h = Uint8Array.from(h))), !(h instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (h.length === 0)
      return "";
    for (var x = 0, m = 0, L = 0, D = h.length; L !== D && h[L] === 0; )
      L++, x++;
    for (var O = (D - L) * u + 1 >>> 0, p = new Uint8Array(O); L !== D; ) {
      for (var k = h[L], I = 0, U = O - 1; (k !== 0 || I < m) && U !== -1; U--, I++)
        k += 256 * p[U] >>> 0, p[U] = k % o >>> 0, k = k / o >>> 0;
      if (k !== 0)
        throw new Error("Non-zero carry");
      m = I, L++;
    }
    for (var V = O - m; V !== O && p[V] === 0; )
      V++;
    for (var F = a.repeat(x); V < O; ++V)
      F += t.charAt(p[V]);
    return F;
  }
  function l(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var x = 0, m = 0, L = 0; h[x] === a; )
      m++, x++;
    for (var D = (h.length - x) * c + 1 >>> 0, O = new Uint8Array(D); h[x]; ) {
      var p = h.charCodeAt(x);
      if (p > 255)
        return;
      var k = e[p];
      if (k === 255)
        return;
      for (var I = 0, U = D - 1; (k !== 0 || I < L) && U !== -1; U--, I++)
        k += o * O[U] >>> 0, O[U] = k % 256 >>> 0, k = k / 256 >>> 0;
      if (k !== 0)
        throw new Error("Non-zero carry");
      L = I, x++;
    }
    for (var V = D - L; V !== D && O[V] === 0; )
      V++;
    for (var F = new Uint8Array(m + (D - V)), R = m; V !== D; )
      F[R++] = O[V++];
    return F;
  }
  function g(h) {
    var x = l(h);
    if (x)
      return x;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: f,
    decodeUnsafe: l,
    decode: g
  };
}
var z0 = u1;
const f1 = z0, d1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var h1 = f1(d1);
const p1 = /* @__PURE__ */ f0(h1), g1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), R0 = Uint8Array.from({ length: 16 }, (t, e) => e), y1 = R0.map((t) => (9 * t + 5) % 16);
let $u = [R0], Iu = [y1];
for (let t = 0; t < 4; t++)
  for (let e of [$u, Iu])
    e.push(e[t].map((n) => g1[n]));
const G0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), w1 = $u.map((t, e) => t.map((n) => G0[e][n])), b1 = Iu.map((t, e) => t.map((n) => G0[e][n])), m1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), x1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Vo = (t, e) => t << e | t >>> 32 - e;
function qf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ko = new Uint32Array(16);
let S1 = class extends xu {
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
      Ko[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, m = m1[h], L = x1[h], D = $u[h], O = Iu[h], p = w1[h], k = b1[h];
      for (let I = 0; I < 16; I++) {
        const U = Vo(r + qf(h, i, a, u) + Ko[D[I]] + m, p[I]) + l | 0;
        r = l, l = u, u = Vo(a, 10) | 0, a = i, i = U;
      }
      for (let I = 0; I < 16; I++) {
        const U = Vo(s + qf(x, o, c, f) + Ko[O[I]] + L, k[I]) + g | 0;
        s = g, g = f, f = Vo(c, 10) | 0, c = o, o = U;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ko.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const A1 = ti(() => new S1());
function E1(t) {
  return A1(t);
}
const Wo = BigInt(2 ** 32 - 1), yl = BigInt(32);
function V0(t, e = !1) {
  return e ? { h: Number(t & Wo), l: Number(t >> yl & Wo) } : { h: Number(t >> yl & Wo) | 0, l: Number(t & Wo) | 0 };
}
function v1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = V0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const $1 = (t, e) => BigInt(t >>> 0) << yl | BigInt(e >>> 0), I1 = (t, e, n) => t >>> n, k1 = (t, e, n) => t << 32 - n | e >>> n, L1 = (t, e, n) => t >>> n | e << 32 - n, C1 = (t, e, n) => t << 32 - n | e >>> n, B1 = (t, e, n) => t << 64 - n | e >>> n - 32, T1 = (t, e, n) => t >>> n - 32 | e << 64 - n, _1 = (t, e) => e, H1 = (t, e) => t, M1 = (t, e, n) => t << n | e >>> 32 - n, N1 = (t, e, n) => e << n | t >>> 32 - n, P1 = (t, e, n) => e << n - 32 | t >>> 64 - n, U1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function O1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const D1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), F1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, j1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), z1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, R1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), G1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, $t = {
  fromBig: V0,
  split: v1,
  toBig: $1,
  shrSH: I1,
  shrSL: k1,
  rotrSH: L1,
  rotrSL: C1,
  rotrBH: B1,
  rotrBL: T1,
  rotr32H: _1,
  rotr32L: H1,
  rotlSH: M1,
  rotlSL: N1,
  rotlBH: P1,
  rotlBL: U1,
  add: O1,
  add3L: D1,
  add3H: F1,
  add4L: j1,
  add4H: z1,
  add5H: G1,
  add5L: R1
}, [V1, K1] = $t.split([
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
].map((t) => BigInt(t))), Nr = new Uint32Array(80), Pr = new Uint32Array(80);
let tc = class extends xu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: g, Gh: h, Gl: x, Hh: m, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, g, h, x, m, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, g, h, x, m, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = m | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Nr[p] = e.getUint32(n), Pr[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const k = Nr[p - 15] | 0, I = Pr[p - 15] | 0, U = $t.rotrSH(k, I, 1) ^ $t.rotrSH(k, I, 8) ^ $t.shrSH(k, I, 7), V = $t.rotrSL(k, I, 1) ^ $t.rotrSL(k, I, 8) ^ $t.shrSL(k, I, 7), F = Nr[p - 2] | 0, R = Pr[p - 2] | 0, A = $t.rotrSH(F, R, 19) ^ $t.rotrBH(F, R, 61) ^ $t.shrSH(F, R, 6), T = $t.rotrSL(F, R, 19) ^ $t.rotrBL(F, R, 61) ^ $t.shrSL(F, R, 6), M = $t.add4L(V, T, Pr[p - 7], Pr[p - 16]), _ = $t.add4H(M, U, A, Nr[p - 7], Nr[p - 16]);
      Nr[p] = _ | 0, Pr[p] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: x, Gh: m, Gl: L, Hh: D, Hl: O } = this;
    for (let p = 0; p < 80; p++) {
      const k = $t.rotrSH(l, g, 14) ^ $t.rotrSH(l, g, 18) ^ $t.rotrBH(l, g, 41), I = $t.rotrSL(l, g, 14) ^ $t.rotrSL(l, g, 18) ^ $t.rotrBL(l, g, 41), U = l & h ^ ~l & m, V = g & x ^ ~g & L, F = $t.add5L(O, I, V, K1[p], Pr[p]), R = $t.add5H(F, D, k, U, V1[p], Nr[p]), A = F | 0, T = $t.rotrSH(r, s, 28) ^ $t.rotrBH(r, s, 34) ^ $t.rotrBH(r, s, 39), M = $t.rotrSL(r, s, 28) ^ $t.rotrBL(r, s, 34) ^ $t.rotrBL(r, s, 39), _ = r & i ^ r & a ^ i & a, nt = s & o ^ s & c ^ o & c;
      D = m | 0, O = L | 0, m = h | 0, L = x | 0, h = l | 0, x = g | 0, { h: l, l: g } = $t.add(u | 0, f | 0, R | 0, A | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const G = $t.add3L(A, M, nt);
      r = $t.add3H(G, R, T, _), s = G | 0;
    }
    ({ h: r, l: s } = $t.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = $t.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = $t.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = $t.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = $t.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: x } = $t.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: m, l: L } = $t.add(this.Gh | 0, this.Gl | 0, m | 0, L | 0), { h: D, l: O } = $t.add(this.Hh | 0, this.Hl | 0, D | 0, O | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, x, m, L, D, O);
  }
  roundClean() {
    Nr.fill(0), Pr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, W1 = class extends tc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, X1 = class extends tc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, q1 = class extends tc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Y1 = ti(() => new tc());
ti(() => new W1());
ti(() => new X1());
ti(() => new q1());
function K0(t) {
  return Ii(t);
}
function Z1(t) {
  return Y1(t);
}
const Q1 = 0;
Ae.hmacSha256Sync = (t, ...e) => {
  const n = Qa.create(Ii, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function J1() {
  return dt(Ae.randomPrivateKey());
}
function t2(t) {
  const e = Ii(Ii(t));
  return p1.encode(cr(t, e).slice(0, t.length + 4));
}
function e2(t, e) {
  return t2(cr(new Uint8Array([t]), e.slice(0, 20)));
}
function W0(t, e = Q1) {
  const n = typeof t == "string" ? zt(t) : t, r = E1(K0(n));
  return e2(e, r);
}
function X0(t) {
  const e = bu(t);
  return dt(To(e.slice(0, 32), !0));
}
Ae.hmacSha256Sync = (t, ...e) => {
  const n = Qa.create(Ii, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var La;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(La || (La = {}));
async function n2(t, e, n) {
  return await (await j0()).encrypt("aes-256-cbc", e, t, n);
}
async function r2(t, e, n) {
  return await (await j0()).decrypt("aes-256-cbc", e, t, n);
}
function q0(t, e) {
  return Qa(Ii, t, e);
}
function s2(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function Y0(t) {
  const e = Z1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function i2(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function o2(t) {
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
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !i2(t))
    return e;
  try {
    return _t.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function a2(t, e, n, r) {
  const s = o2(t);
  if (!s.result)
    throw s;
  const i = Ae.randomPrivateKey(), o = To(i, !0);
  let a = vu(i, t, !0);
  a = a.slice(1);
  const c = Y0(a), u = Ae.randomBytes(16), f = await n2(u, c.encryptionKey, e), l = cr(u, o, f), g = q0(c.hmacKey, l);
  let h;
  if (!r || r === "hex")
    h = dt(f);
  else if (r === "base64")
    h = Yb(f);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const x = {
    iv: dt(u),
    ephemeralPK: dt(o),
    cipherText: h,
    mac: dt(g),
    wasString: n
  };
  return r && r !== "hex" && (x.cipherTextEncoding = r), x;
}
async function Z0(t, e) {
  if (!e.ephemeralPK)
    throw new Uf("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = vu(t, n, !0);
  r = r.slice(1);
  const s = Y0(r), i = zt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = zt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = qb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = cr(i, zt(n), o), c = q0(s.hmacKey, a), u = zt(e.mac);
  if (!s2(u, c))
    throw new Uf("Decryption failed: failure in MAC check");
  const f = await r2(i, s.encryptionKey, o);
  return e.wasString ? Bo(f) : f;
}
function c2(t, e) {
  const n = typeof e == "string" ? Js(e) : e, r = X0(t), s = K0(n), i = Ja(s, t);
  return {
    signature: dt(i),
    publicKey: r
  };
}
async function l2(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = X0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Js(t) : t, o = await a2(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = c2(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function u2(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return Z0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var ze = {}, Ti = {}, tn = {};
Object.defineProperty(tn, "__esModule", { value: !0 });
tn.decode = tn.encode = tn.unescape = tn.escape = tn.pad = void 0;
const Q0 = _o;
function ku(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
tn.pad = ku;
function J0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
tn.escape = J0;
function tp(t) {
  return ku(t).replace(/-/g, "+").replace(/_/g, "/");
}
tn.unescape = tp;
function f2(t) {
  return J0((0, Q0.fromByteArray)(new TextEncoder().encode(t)));
}
tn.encode = f2;
function d2(t) {
  return new TextDecoder().decode((0, Q0.toByteArray)(ku(tp(t))));
}
tn.decode = d2;
var ec = {}, nc = {}, ep = {}, vr = {}, rc = {};
Object.defineProperty(rc, "__esModule", { value: !0 });
rc.crypto = void 0;
rc.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = f, t.createView = l, t.rotr = g, t.rotl = h, t.byteSwap = x, t.byteSwap32 = m, t.bytesToHex = O, t.hexToBytes = I, t.asyncLoop = V, t.utf8ToBytes = F, t.bytesToUtf8 = R, t.toBytes = A, t.kdfInputToBytes = T, t.concatBytes = M, t.checkOpts = _, t.createHasher = G, t.createOptHasher = Kt, t.createXOFer = wt, t.randomBytes = pe;
  const e = rc;
  function n($) {
    return $ instanceof Uint8Array || ArrayBuffer.isView($) && $.constructor.name === "Uint8Array";
  }
  function r($) {
    if (!Number.isSafeInteger($) || $ < 0)
      throw new Error("positive integer expected, got " + $);
  }
  function s($, ...N) {
    if (!n($))
      throw new Error("Uint8Array expected");
    if (N.length > 0 && !N.includes($.length))
      throw new Error("Uint8Array expected of length " + N + ", got length=" + $.length);
  }
  function i($) {
    if (typeof $ != "function" || typeof $.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r($.outputLen), r($.blockLen);
  }
  function o($, N = !0) {
    if ($.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (N && $.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a($, N) {
    s($);
    const bt = N.outputLen;
    if ($.length < bt)
      throw new Error("digestInto() expects output buffer of length at least " + bt);
  }
  function c($) {
    return new Uint8Array($.buffer, $.byteOffset, $.byteLength);
  }
  function u($) {
    return new Uint32Array($.buffer, $.byteOffset, Math.floor($.byteLength / 4));
  }
  function f(...$) {
    for (let N = 0; N < $.length; N++)
      $[N].fill(0);
  }
  function l($) {
    return new DataView($.buffer, $.byteOffset, $.byteLength);
  }
  function g($, N) {
    return $ << 32 - N | $ >>> N;
  }
  function h($, N) {
    return $ << N | $ >>> 32 - N >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function x($) {
    return $ << 24 & 4278190080 | $ << 8 & 16711680 | $ >>> 8 & 65280 | $ >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? ($) => $ : ($) => x($), t.byteSwapIfBE = t.swap8IfBE;
  function m($) {
    for (let N = 0; N < $.length; N++)
      $[N] = x($[N]);
    return $;
  }
  t.swap32IfBE = t.isLE ? ($) => $ : m;
  const L = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", D = /* @__PURE__ */ Array.from({ length: 256 }, ($, N) => N.toString(16).padStart(2, "0"));
  function O($) {
    if (s($), L)
      return $.toHex();
    let N = "";
    for (let bt = 0; bt < $.length; bt++)
      N += D[$[bt]];
    return N;
  }
  const p = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function k($) {
    if ($ >= p._0 && $ <= p._9)
      return $ - p._0;
    if ($ >= p.A && $ <= p.F)
      return $ - (p.A - 10);
    if ($ >= p.a && $ <= p.f)
      return $ - (p.a - 10);
  }
  function I($) {
    if (typeof $ != "string")
      throw new Error("hex string expected, got " + typeof $);
    if (L)
      return Uint8Array.fromHex($);
    const N = $.length, bt = N / 2;
    if (N % 2)
      throw new Error("hex string expected, got unpadded hex of length " + N);
    const Pt = new Uint8Array(bt);
    for (let Ht = 0, Mt = 0; Ht < bt; Ht++, Mt += 2) {
      const ie = k($.charCodeAt(Mt)), ge = k($.charCodeAt(Mt + 1));
      if (ie === void 0 || ge === void 0) {
        const Jt = $[Mt] + $[Mt + 1];
        throw new Error('hex string expected, got non-hex character "' + Jt + '" at index ' + Mt);
      }
      Pt[Ht] = ie * 16 + ge;
    }
    return Pt;
  }
  const U = async () => {
  };
  t.nextTick = U;
  async function V($, N, bt) {
    let Pt = Date.now();
    for (let Ht = 0; Ht < $; Ht++) {
      bt(Ht);
      const Mt = Date.now() - Pt;
      Mt >= 0 && Mt < N || (await (0, t.nextTick)(), Pt += Mt);
    }
  }
  function F($) {
    if (typeof $ != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode($));
  }
  function R($) {
    return new TextDecoder().decode($);
  }
  function A($) {
    return typeof $ == "string" && ($ = F($)), s($), $;
  }
  function T($) {
    return typeof $ == "string" && ($ = F($)), s($), $;
  }
  function M(...$) {
    let N = 0;
    for (let Pt = 0; Pt < $.length; Pt++) {
      const Ht = $[Pt];
      s(Ht), N += Ht.length;
    }
    const bt = new Uint8Array(N);
    for (let Pt = 0, Ht = 0; Pt < $.length; Pt++) {
      const Mt = $[Pt];
      bt.set(Mt, Ht), Ht += Mt.length;
    }
    return bt;
  }
  function _($, N) {
    if (N !== void 0 && {}.toString.call(N) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign($, N);
  }
  class nt {
  }
  t.Hash = nt;
  function G($) {
    const N = (Pt) => $().update(A(Pt)).digest(), bt = $();
    return N.outputLen = bt.outputLen, N.blockLen = bt.blockLen, N.create = () => $(), N;
  }
  function Kt($) {
    const N = (Pt, Ht) => $(Ht).update(A(Pt)).digest(), bt = $({});
    return N.outputLen = bt.outputLen, N.blockLen = bt.blockLen, N.create = (Pt) => $(Pt), N;
  }
  function wt($) {
    const N = (Pt, Ht) => $(Ht).update(A(Pt)).digest(), bt = $({});
    return N.outputLen = bt.outputLen, N.blockLen = bt.blockLen, N.create = (Pt) => $(Pt), N;
  }
  t.wrapConstructor = G, t.wrapConstructorWithOpts = Kt, t.wrapXOFConstructorWithOpts = wt;
  function pe($ = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array($));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes($));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(vr);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = vr;
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
})(ep);
var Sn = {}, re = {}, en = {};
Object.defineProperty(en, "__esModule", { value: !0 });
en.SHA512_IV = en.SHA384_IV = en.SHA224_IV = en.SHA256_IV = en.HashMD = void 0;
en.setBigUint64 = np;
en.Chi = h2;
en.Maj = p2;
const qn = vr;
function np(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function h2(t, e, n) {
  return t & e ^ ~t & n;
}
function p2(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
let g2 = class extends qn.Hash {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = (0, qn.createView)(this.buffer);
  }
  update(e) {
    (0, qn.aexists)(this), e = (0, qn.toBytes)(e), (0, qn.abytes)(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = (0, qn.createView)(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    (0, qn.aexists)(this), (0, qn.aoutput)(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, (0, qn.clean)(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    np(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = (0, qn.createView)(e), c = this.outputLen;
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
};
en.HashMD = g2;
en.SHA256_IV = Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
en.SHA224_IV = Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]);
en.SHA384_IV = Uint32Array.from([
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
en.SHA512_IV = Uint32Array.from([
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
var St = {};
Object.defineProperty(St, "__esModule", { value: !0 });
St.toBig = St.shrSL = St.shrSH = St.rotrSL = St.rotrSH = St.rotrBL = St.rotrBH = St.rotr32L = St.rotr32H = St.rotlSL = St.rotlSH = St.rotlBL = St.rotlBH = St.add5L = St.add5H = St.add4L = St.add4H = St.add3L = St.add3H = void 0;
St.add = wp;
St.fromBig = Lu;
St.split = rp;
const Xo = /* @__PURE__ */ BigInt(2 ** 32 - 1), wl = /* @__PURE__ */ BigInt(32);
function Lu(t, e = !1) {
  return e ? { h: Number(t & Xo), l: Number(t >> wl & Xo) } : { h: Number(t >> wl & Xo) | 0, l: Number(t & Xo) | 0 };
}
function rp(t, e = !1) {
  const n = t.length;
  let r = new Uint32Array(n), s = new Uint32Array(n);
  for (let i = 0; i < n; i++) {
    const { h: o, l: a } = Lu(t[i], e);
    [r[i], s[i]] = [o, a];
  }
  return [r, s];
}
const sp = (t, e) => BigInt(t >>> 0) << wl | BigInt(e >>> 0);
St.toBig = sp;
const ip = (t, e, n) => t >>> n;
St.shrSH = ip;
const op = (t, e, n) => t << 32 - n | e >>> n;
St.shrSL = op;
const ap = (t, e, n) => t >>> n | e << 32 - n;
St.rotrSH = ap;
const cp = (t, e, n) => t << 32 - n | e >>> n;
St.rotrSL = cp;
const lp = (t, e, n) => t << 64 - n | e >>> n - 32;
St.rotrBH = lp;
const up = (t, e, n) => t >>> n - 32 | e << 64 - n;
St.rotrBL = up;
const fp = (t, e) => e;
St.rotr32H = fp;
const dp = (t, e) => t;
St.rotr32L = dp;
const hp = (t, e, n) => t << n | e >>> 32 - n;
St.rotlSH = hp;
const pp = (t, e, n) => e << n | t >>> 32 - n;
St.rotlSL = pp;
const gp = (t, e, n) => e << n - 32 | t >>> 64 - n;
St.rotlBH = gp;
const yp = (t, e, n) => t << n - 32 | e >>> 64 - n;
St.rotlBL = yp;
function wp(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const bp = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0);
St.add3L = bp;
const mp = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0;
St.add3H = mp;
const xp = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0);
St.add4L = xp;
const Sp = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0;
St.add4H = Sp;
const Ap = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0);
St.add5L = Ap;
const Ep = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0;
St.add5H = Ep;
const y2 = {
  fromBig: Lu,
  split: rp,
  toBig: sp,
  shrSH: ip,
  shrSL: op,
  rotrSH: ap,
  rotrSL: cp,
  rotrBH: lp,
  rotrBL: up,
  rotr32H: fp,
  rotr32L: dp,
  rotlSH: hp,
  rotlSL: pp,
  rotlBH: gp,
  rotlBL: yp,
  add: wp,
  add3L: bp,
  add3H: mp,
  add4L: xp,
  add4H: Sp,
  add5H: Ep,
  add5L: Ap
};
St.default = y2;
Object.defineProperty(re, "__esModule", { value: !0 });
re.sha512_224 = re.sha512_256 = re.sha384 = re.sha512 = re.sha224 = re.sha256 = re.SHA512_256 = re.SHA512_224 = re.SHA384 = re.SHA512 = re.SHA224 = re.SHA256 = void 0;
const ft = en, It = St, _e = vr, w2 = /* @__PURE__ */ Uint32Array.from([
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
]), Ur = /* @__PURE__ */ new Uint32Array(64);
let Cu = class extends ft.HashMD {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = ft.SHA256_IV[0] | 0, this.B = ft.SHA256_IV[1] | 0, this.C = ft.SHA256_IV[2] | 0, this.D = ft.SHA256_IV[3] | 0, this.E = ft.SHA256_IV[4] | 0, this.F = ft.SHA256_IV[5] | 0, this.G = ft.SHA256_IV[6] | 0, this.H = ft.SHA256_IV[7] | 0;
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
      Ur[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Ur[l - 15], h = Ur[l - 2], x = (0, _e.rotr)(g, 7) ^ (0, _e.rotr)(g, 18) ^ g >>> 3, m = (0, _e.rotr)(h, 17) ^ (0, _e.rotr)(h, 19) ^ h >>> 10;
      Ur[l] = m + Ur[l - 7] + x + Ur[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = (0, _e.rotr)(a, 6) ^ (0, _e.rotr)(a, 11) ^ (0, _e.rotr)(a, 25), h = f + g + (0, ft.Chi)(a, c, u) + w2[l] + Ur[l] | 0, m = ((0, _e.rotr)(r, 2) ^ (0, _e.rotr)(r, 13) ^ (0, _e.rotr)(r, 22)) + (0, ft.Maj)(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    (0, _e.clean)(Ur);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), (0, _e.clean)(this.buffer);
  }
};
re.SHA256 = Cu;
let vp = class extends Cu {
  constructor() {
    super(28), this.A = ft.SHA224_IV[0] | 0, this.B = ft.SHA224_IV[1] | 0, this.C = ft.SHA224_IV[2] | 0, this.D = ft.SHA224_IV[3] | 0, this.E = ft.SHA224_IV[4] | 0, this.F = ft.SHA224_IV[5] | 0, this.G = ft.SHA224_IV[6] | 0, this.H = ft.SHA224_IV[7] | 0;
  }
};
re.SHA224 = vp;
const $p = It.split([
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
].map((t) => BigInt(t))), b2 = $p[0], m2 = $p[1], Or = /* @__PURE__ */ new Uint32Array(80), Dr = /* @__PURE__ */ new Uint32Array(80);
let Ho = class extends ft.HashMD {
  constructor(e = 64) {
    super(128, e, 16, !1), this.Ah = ft.SHA512_IV[0] | 0, this.Al = ft.SHA512_IV[1] | 0, this.Bh = ft.SHA512_IV[2] | 0, this.Bl = ft.SHA512_IV[3] | 0, this.Ch = ft.SHA512_IV[4] | 0, this.Cl = ft.SHA512_IV[5] | 0, this.Dh = ft.SHA512_IV[6] | 0, this.Dl = ft.SHA512_IV[7] | 0, this.Eh = ft.SHA512_IV[8] | 0, this.El = ft.SHA512_IV[9] | 0, this.Fh = ft.SHA512_IV[10] | 0, this.Fl = ft.SHA512_IV[11] | 0, this.Gh = ft.SHA512_IV[12] | 0, this.Gl = ft.SHA512_IV[13] | 0, this.Hh = ft.SHA512_IV[14] | 0, this.Hl = ft.SHA512_IV[15] | 0;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: g, Gh: h, Gl: x, Hh: m, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, g, h, x, m, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, g, h, x, m, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = m | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Or[p] = e.getUint32(n), Dr[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const k = Or[p - 15] | 0, I = Dr[p - 15] | 0, U = It.rotrSH(k, I, 1) ^ It.rotrSH(k, I, 8) ^ It.shrSH(k, I, 7), V = It.rotrSL(k, I, 1) ^ It.rotrSL(k, I, 8) ^ It.shrSL(k, I, 7), F = Or[p - 2] | 0, R = Dr[p - 2] | 0, A = It.rotrSH(F, R, 19) ^ It.rotrBH(F, R, 61) ^ It.shrSH(F, R, 6), T = It.rotrSL(F, R, 19) ^ It.rotrBL(F, R, 61) ^ It.shrSL(F, R, 6), M = It.add4L(V, T, Dr[p - 7], Dr[p - 16]), _ = It.add4H(M, U, A, Or[p - 7], Or[p - 16]);
      Or[p] = _ | 0, Dr[p] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: x, Gh: m, Gl: L, Hh: D, Hl: O } = this;
    for (let p = 0; p < 80; p++) {
      const k = It.rotrSH(l, g, 14) ^ It.rotrSH(l, g, 18) ^ It.rotrBH(l, g, 41), I = It.rotrSL(l, g, 14) ^ It.rotrSL(l, g, 18) ^ It.rotrBL(l, g, 41), U = l & h ^ ~l & m, V = g & x ^ ~g & L, F = It.add5L(O, I, V, m2[p], Dr[p]), R = It.add5H(F, D, k, U, b2[p], Or[p]), A = F | 0, T = It.rotrSH(r, s, 28) ^ It.rotrBH(r, s, 34) ^ It.rotrBH(r, s, 39), M = It.rotrSL(r, s, 28) ^ It.rotrBL(r, s, 34) ^ It.rotrBL(r, s, 39), _ = r & i ^ r & a ^ i & a, nt = s & o ^ s & c ^ o & c;
      D = m | 0, O = L | 0, m = h | 0, L = x | 0, h = l | 0, x = g | 0, { h: l, l: g } = It.add(u | 0, f | 0, R | 0, A | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const G = It.add3L(A, M, nt);
      r = It.add3H(G, R, T, _), s = G | 0;
    }
    ({ h: r, l: s } = It.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = It.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = It.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = It.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = It.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: x } = It.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: m, l: L } = It.add(this.Gh | 0, this.Gl | 0, m | 0, L | 0), { h: D, l: O } = It.add(this.Hh | 0, this.Hl | 0, D | 0, O | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, x, m, L, D, O);
  }
  roundClean() {
    (0, _e.clean)(Or, Dr);
  }
  destroy() {
    (0, _e.clean)(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
re.SHA512 = Ho;
let Ip = class extends Ho {
  constructor() {
    super(48), this.Ah = ft.SHA384_IV[0] | 0, this.Al = ft.SHA384_IV[1] | 0, this.Bh = ft.SHA384_IV[2] | 0, this.Bl = ft.SHA384_IV[3] | 0, this.Ch = ft.SHA384_IV[4] | 0, this.Cl = ft.SHA384_IV[5] | 0, this.Dh = ft.SHA384_IV[6] | 0, this.Dl = ft.SHA384_IV[7] | 0, this.Eh = ft.SHA384_IV[8] | 0, this.El = ft.SHA384_IV[9] | 0, this.Fh = ft.SHA384_IV[10] | 0, this.Fl = ft.SHA384_IV[11] | 0, this.Gh = ft.SHA384_IV[12] | 0, this.Gl = ft.SHA384_IV[13] | 0, this.Hh = ft.SHA384_IV[14] | 0, this.Hl = ft.SHA384_IV[15] | 0;
  }
};
re.SHA384 = Ip;
const Ke = /* @__PURE__ */ Uint32Array.from([
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
]), We = /* @__PURE__ */ Uint32Array.from([
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
let kp = class extends Ho {
  constructor() {
    super(28), this.Ah = Ke[0] | 0, this.Al = Ke[1] | 0, this.Bh = Ke[2] | 0, this.Bl = Ke[3] | 0, this.Ch = Ke[4] | 0, this.Cl = Ke[5] | 0, this.Dh = Ke[6] | 0, this.Dl = Ke[7] | 0, this.Eh = Ke[8] | 0, this.El = Ke[9] | 0, this.Fh = Ke[10] | 0, this.Fl = Ke[11] | 0, this.Gh = Ke[12] | 0, this.Gl = Ke[13] | 0, this.Hh = Ke[14] | 0, this.Hl = Ke[15] | 0;
  }
};
re.SHA512_224 = kp;
let Lp = class extends Ho {
  constructor() {
    super(32), this.Ah = We[0] | 0, this.Al = We[1] | 0, this.Bh = We[2] | 0, this.Bl = We[3] | 0, this.Ch = We[4] | 0, this.Cl = We[5] | 0, this.Dh = We[6] | 0, this.Dl = We[7] | 0, this.Eh = We[8] | 0, this.El = We[9] | 0, this.Fh = We[10] | 0, this.Fl = We[11] | 0, this.Gh = We[12] | 0, this.Gl = We[13] | 0, this.Hh = We[14] | 0, this.Hl = We[15] | 0;
  }
};
re.SHA512_256 = Lp;
re.sha256 = (0, _e.createHasher)(() => new Cu());
re.sha224 = (0, _e.createHasher)(() => new vp());
re.sha512 = (0, _e.createHasher)(() => new Ho());
re.sha384 = (0, _e.createHasher)(() => new Ip());
re.sha512_256 = (0, _e.createHasher)(() => new Lp());
re.sha512_224 = (0, _e.createHasher)(() => new kp());
Object.defineProperty(Sn, "__esModule", { value: !0 });
Sn.sha224 = Sn.SHA224 = Sn.sha256 = Sn.SHA256 = void 0;
const sc = re;
Sn.SHA256 = sc.SHA256;
Sn.sha256 = sc.sha256;
Sn.SHA224 = sc.SHA224;
Sn.sha224 = sc.sha224;
const x2 = /* @__PURE__ */ d0(Xb);
var _i = {};
Object.defineProperty(_i, "__esModule", { value: !0 });
_i.joseToDer = _i.derToJose = void 0;
const Cp = _o, Bp = tn;
function Pc(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const S2 = {
  ES256: Pc(256),
  ES384: Pc(384),
  ES512: Pc(521)
};
function Tp(t) {
  const e = S2[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Ca = 128, _p = 0, A2 = 32, E2 = 16, v2 = 2, Hp = E2 | A2 | _p << 6, Ba = v2 | _p << 6;
function Mp(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Cp.toByteArray)((0, Bp.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function $2(t, e) {
  const n = Mp(t), r = Tp(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Hp)
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
  const u = o;
  if (o += c, n[o++] !== Ba)
    throw new Error('Could not find expected "int" for "s"');
  const f = n[o++];
  if (i - o !== f)
    throw new Error(`"s" specified length of "${f}", expected "${i - o}"`);
  if (s < f)
    throw new Error(`"s" specified length of "${f}", max of "${s}" is acceptable`);
  const l = o;
  if (o += f, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const g = r - c, h = r - f, x = new Uint8Array(g + c + h + f);
  for (o = 0; o < g; ++o)
    x[o] = 0;
  x.set(n.subarray(u + Math.max(-g, 0), u + c), o), o = r;
  for (const m = o; o < m + h; ++o)
    x[o] = 0;
  return x.set(n.subarray(l + Math.max(-h, 0), l + f), o), (0, Bp.escape)((0, Cp.fromByteArray)(x));
}
_i.derToJose = $2;
function Yf(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Ca && --r, r;
}
function I2(t, e) {
  t = Mp(t);
  const n = Tp(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Yf(t, 0, n), i = Yf(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < Ca, f = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return f[l++] = Hp, u ? f[l++] = c : (f[l++] = Ca | 1, f[l++] = c & 255), f[l++] = Ba, f[l++] = o, s < 0 ? (f[l++] = 0, f.set(t.subarray(0, n), l), l += n) : (f.set(t.subarray(s, n), l), l += n - s), f[l++] = Ba, f[l++] = a, i < 0 ? (f[l++] = 0, f.set(t.subarray(n), l)) : f.set(t.subarray(n + i), l), f;
}
_i.joseToDer = I2;
var Sr = {};
Object.defineProperty(Sr, "__esModule", { value: !0 });
Sr.InvalidTokenError = Sr.MissingParametersError = void 0;
class k2 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Sr.MissingParametersError = k2;
class L2 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Sr.InvalidTokenError = L2;
Object.defineProperty(nc, "__esModule", { value: !0 });
nc.SECP256K1Client = void 0;
const C2 = ep, B2 = Sn, wa = x2, Zf = _i, Qf = Sr, Jf = vr;
wa.utils.hmacSha256Sync = (t, ...e) => {
  const n = C2.hmac.create(B2.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Np {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Jf.bytesToHex)(wa.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Qf.MissingParametersError("a signing input hash and private key are all required");
    const s = wa.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Jf.bytesToHex)(s);
    if (r === "jose")
      return (0, Zf.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Zf.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Qf.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return wa.verify(n, e, r, { strict: !1 });
  }
}
nc.SECP256K1Client = Np;
Np.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = nc;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(ec);
var Ds = {};
const T2 = /* @__PURE__ */ d0(I0);
var _2 = rn && rn.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Ds, "__esModule", { value: !0 });
Ds.hashSha256Async = Ds.hashSha256 = void 0;
const H2 = Sn;
function Pp(t) {
  return (0, H2.sha256)(t);
}
Ds.hashSha256 = Pp;
function M2(t) {
  return _2(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = T2;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Pp(t));
    }
  });
}
Ds.hashSha256Async = M2;
var N2 = rn && rn.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.TokenSigner = Ti.createUnsecuredToken = void 0;
const bl = tn, td = ec, P2 = Sr, ed = Ds;
function ml(t, e) {
  const n = [], r = bl.encode(JSON.stringify(e));
  n.push(r);
  const s = bl.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function U2(t) {
  return ml(t, { typ: "JWT", alg: "none" }) + ".";
}
Ti.createUnsecuredToken = U2;
class O2 {
  constructor(e, n) {
    if (!(e && n))
      throw new P2.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !td.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = td.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = ml(e, s), o = (0, ed.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return N2(this, void 0, void 0, function* () {
      const s = this.header(r), i = ml(e, s), o = yield (0, ed.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [bl.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Ti.TokenSigner = O2;
var ic = {};
Object.defineProperty(ic, "__esModule", { value: !0 });
ic.TokenVerifier = void 0;
const D2 = tn, nd = ec, F2 = Sr, qo = Ds;
class j2 {
  constructor(e, n) {
    if (!(e && n))
      throw new F2.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !nd.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = nd.cryptoClients[e], this.rawPublicKey = n;
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
    const r = [e.header.join("."), D2.encode(e.payload)].join(".");
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
ic.TokenVerifier = j2;
var oc = {};
Object.defineProperty(oc, "__esModule", { value: !0 });
oc.decodeToken = void 0;
const Yo = tn;
function z2(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Yo.decode(e[0])), r = JSON.parse(Yo.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Yo.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Yo.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
oc.decodeToken = z2;
(function(t) {
  var e = rn && rn.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = rn && rn.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Ti, t), n(ic, t), n(oc, t), n(Sr, t), n(ec, t);
})(ze);
function R2(t) {
  return `did:btc-addr:${t}`;
}
function G2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Pf("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Pf('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Up(t) {
  if (t)
    return G2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const V2 = "1.4.0";
function K2() {
  return J1();
}
function W2(t, e, n, r = y0.slice(), s, i = Yw().getTime(), o = {}) {
  const a = (h) => {
    const x = yu("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return x == null ? void 0 : x.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Qw(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: V2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = ze.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const f = W0(u);
  return c.iss = R2(f), new ze.TokenSigner("ES256k", t).sign(c);
}
async function rd(t, e) {
  const n = Bo(zt(e)), r = JSON.parse(n), s = await Z0(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function X2(t) {
  const e = ze.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new ze.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function q2(t) {
  const e = ze.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Up(e.iss);
  if (n.length === 1) {
    if (W0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function Y2(t) {
  const e = ze.decodeToken(t).payload;
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
function Z2(t) {
  const e = ze.decodeToken(t).payload;
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
function Q2(t) {
  const e = [
    Z2(t),
    Y2(t),
    X2(t),
    q2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const sd = "1.0.0";
class fs {
  constructor(e) {
    this.version = sd, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== sd)
      throw new fl(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new fs(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Op {
  constructor(e) {
    if (e) {
      const n = new fs(e);
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
class id extends Op {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new fs({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new w0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new fs({})), !0;
  }
}
class od extends Op {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Ww, !localStorage.getItem(this.key)) {
      const r = new fs({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new w0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return fs.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new fs({})), !0;
  }
}
var wo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(wo || (wo = {}));
var Ta;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ta || (Ta = {}));
wo.Mainnet;
var mr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(mr || (mr = {}));
var ir;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ir || (ir = {}));
mr.Mainnet;
const Dp = {
  chainId: wo.Mainnet,
  transactionVersion: mr.Mainnet,
  peerNetworkId: Ta.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ir.MainnetSingleSig,
    multiSig: ir.MainnetMultiSig
  },
  client: { baseUrl: b0 }
}, xl = {
  chainId: wo.Testnet,
  transactionVersion: mr.Testnet,
  peerNetworkId: Ta.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ir.TestnetSingleSig,
    multiSig: ir.TestnetMultiSig
  },
  client: { baseUrl: m0 }
}, ba = {
  ...xl,
  addressVersion: { ...xl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: x0 }
}, J2 = {
  ...ba,
  addressVersion: { ...ba.addressVersion },
  client: { ...ba.client }
};
function tm(t) {
  switch (t) {
    case "mainnet":
      return Dp;
    case "testnet":
      return xl;
    case "devnet":
      return ba;
    case "mocknet":
      return J2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Fp(t) {
  return typeof t == "string" ? tm(t) : t;
}
var ad;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ad || (ad = {}));
var cd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(cd || (cd = {}));
var Dn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Dn || (Dn = {}));
const Uc = ["onChainOnly", "offChainOnly", "any"];
Uc[0] + "", Dn.OnChainOnly, Uc[1] + "", Dn.OffChainOnly, Uc[2] + "", Dn.Any, Dn.OnChainOnly + "", Dn.OnChainOnly, Dn.OffChainOnly + "", Dn.OffChainOnly, Dn.Any + "", Dn.Any;
var ld;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(ld || (ld = {}));
var ud;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ud || (ud = {}));
var fd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(fd || (fd = {}));
var br;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(br || (br = {}));
var dd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(dd || (dd = {}));
var hd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(hd || (hd = {}));
var pd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(pd || (pd = {}));
var gd;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(gd || (gd = {}));
var yd;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(yd || (yd = {}));
var wd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(wd || (wd = {}));
var bd;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(bd || (bd = {}));
var md;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(md || (md = {}));
var xd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(xd || (xd = {}));
function Sl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function em(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function jp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function nm(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Sl(t.outputLen), Sl(t.blockLen);
}
function rm(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function sm(t, e) {
  jp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Is = {
  number: Sl,
  bool: em,
  bytes: jp,
  hash: nm,
  exists: rm,
  output: sm
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Oc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Yn = (t, e) => t << 32 - e | t >>> e, im = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!im)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function om(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Bu(t) {
  if (typeof t == "string" && (t = om(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let zp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ei(t) {
  const e = (r) => t().update(Bu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Rp = class extends zp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Is.hash(e);
    const r = Bu(n);
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
    return Is.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Is.exists(this), Is.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Gp = (t, e, n) => new Rp(t, e).update(n).digest();
Gp.create = (t, e) => new Rp(t, e);
function am(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Tu = class extends zp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Oc(this.buffer);
  }
  update(e) {
    Is.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Bu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Oc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Is.exists(this), Is.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    am(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Oc(e), c = this.outputLen;
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
const cm = (t, e, n) => t & e ^ ~t & n, lm = (t, e, n) => t & e ^ t & n ^ e & n, um = new Uint32Array([
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
]), Fr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), jr = new Uint32Array(64);
let Vp = class extends Tu {
  constructor() {
    super(64, 32, 8, !1), this.A = Fr[0] | 0, this.B = Fr[1] | 0, this.C = Fr[2] | 0, this.D = Fr[3] | 0, this.E = Fr[4] | 0, this.F = Fr[5] | 0, this.G = Fr[6] | 0, this.H = Fr[7] | 0;
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
      jr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = jr[l - 15], h = jr[l - 2], x = Yn(g, 7) ^ Yn(g, 18) ^ g >>> 3, m = Yn(h, 17) ^ Yn(h, 19) ^ h >>> 10;
      jr[l] = m + jr[l - 7] + x + jr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = Yn(a, 6) ^ Yn(a, 11) ^ Yn(a, 25), h = f + g + cm(a, c, u) + um[l] + jr[l] | 0, m = (Yn(r, 2) ^ Yn(r, 13) ^ Yn(r, 22)) + lm(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    jr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, fm = class extends Vp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Kp = ei(() => new Vp());
ei(() => new fm());
var ni = {}, _u = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = vr;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let h = o.length - 1; h >= 0; h--)
      if (u < 4) {
        const x = n.indexOf(o[h]) >> u;
        let m = 0;
        h !== 0 && (m = n.indexOf(o[h - 1]));
        const L = 1 + u, D = m % (1 << L) << 5 - L, O = t.c32[x + D];
        u = L, c.unshift(O);
      } else
        u = 0;
    let f = 0;
    for (let h = 0; h < c.length && c[h] === "0"; h++)
      f++;
    c = c.slice(f);
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
    const c = o.match(`^${t.c32[0]}*`), u = c ? c[0].length : 0;
    let f = [], l = 0, g = 0;
    for (let m = o.length - 1; m >= 0; m--) {
      g === 4 && (f.unshift(n[l]), g = 0, l = 0);
      const D = (t.c32.indexOf(o[m]) << g) + l, O = n[D % 16];
      if (g += 1, l = D >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      f.unshift(O);
    }
    f.unshift(n[l]), f.length % 2 === 1 && f.unshift("0");
    let h = 0;
    for (let m = 0; m < f.length && f[m] === "0"; m++)
      h++;
    f = f.slice(h - h % 2);
    let x = f.join("");
    for (let m = 0; m < u; m++)
      x = `00${x}`;
    if (a) {
      const m = a * 2 - x.length;
      for (let L = 0; L < m; L += 2)
        x = `00${x}`;
    }
    return x;
  }
  t.c32decode = i;
})(_u);
var Fs = {};
Object.defineProperty(Fs, "__esModule", { value: !0 });
Fs.c32checkDecode = Fs.c32checkEncode = void 0;
const Sd = Sn, Ad = vr, fo = _u;
function Wp(t) {
  const e = (0, Sd.sha256)((0, Sd.sha256)((0, Ad.hexToBytes)(t)));
  return (0, Ad.bytesToHex)(e.slice(0, 4));
}
function dm(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Wp(`${n}${e}`), s = (0, fo.c32encode)(`${e}${r}`);
  return `${fo.c32[t]}${s}`;
}
Fs.c32checkEncode = dm;
function hm(t) {
  t = (0, fo.c32normalize)(t);
  const e = (0, fo.c32decode)(t.slice(1)), n = t[0], r = fo.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Wp(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Fs.c32checkDecode = hm;
var Xp = {}, Hi = {};
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.decode = Hi.encode = void 0;
const _a = Sn, Ed = vr, qp = z0, Yp = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function pm(t, e = "00") {
  const n = typeof t == "string" ? (0, Ed.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Ed.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, _a.sha256)((0, _a.sha256)(new Uint8Array([...r, ...n])));
  return qp(Yp).encode([...r, ...n, ...s.slice(0, 4)]);
}
Hi.encode = pm;
function gm(t) {
  const e = qp(Yp).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, _a.sha256)((0, _a.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Hi.decode = gm;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Fs, n = Hi, r = vr;
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
    const g = n.decode(f), h = (0, r.bytesToHex)(g.data), x = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let m;
    return l < 0 ? (m = x, s[x] !== void 0 && (m = s[x])) : m = l, o(m, h);
  }
  t.b58ToC32 = c;
  function u(f, l = -1) {
    const g = a(f), h = g[0], x = g[1];
    let m;
    l < 0 ? (m = h, i[h] !== void 0 && (m = i[h])) : m = l;
    let L = m.toString(16);
    return L.length === 1 && (L = `0${L}`), n.encode(x, L);
  }
  t.c32ToB58 = u;
})(Xp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = _u;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Fs;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Xp;
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
})(ni);
function ym(t, e) {
  switch (e = Fp(e ?? Dp), t) {
    case br.P2PKH:
      switch (e.transactionVersion) {
        case mr.Mainnet:
          return ir.MainnetSingleSig;
        case mr.Testnet:
          return ir.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case br.P2SH:
    case br.P2SHNonSequential:
    case br.P2WPKH:
    case br.P2WSH:
    case br.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case mr.Mainnet:
          return ir.MainnetMultiSig;
        case mr.Testnet:
          return ir.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const wm = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Zp = Uint8Array.from({ length: 16 }, (t, e) => e), bm = Zp.map((t) => (9 * t + 5) % 16);
let Hu = [Zp], Mu = [bm];
for (let t = 0; t < 4; t++)
  for (let e of [Hu, Mu])
    e.push(e[t].map((n) => wm[n]));
const Qp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), mm = Hu.map((t, e) => t.map((n) => Qp[e][n])), xm = Mu.map((t, e) => t.map((n) => Qp[e][n])), Sm = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Am = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Zo = (t, e) => t << e | t >>> 32 - e;
function vd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Qo = new Uint32Array(16);
let Em = class extends Tu {
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
      Qo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, m = Sm[h], L = Am[h], D = Hu[h], O = Mu[h], p = mm[h], k = xm[h];
      for (let I = 0; I < 16; I++) {
        const U = Zo(r + vd(h, i, a, u) + Qo[D[I]] + m, p[I]) + l | 0;
        r = l, l = u, u = Zo(a, 10) | 0, a = i, i = U;
      }
      for (let I = 0; I < 16; I++) {
        const U = Zo(s + vd(x, o, c, f) + Qo[O[I]] + L, k[I]) + g | 0;
        s = g, g = f, f = Zo(c, 10) | 0, c = o, o = U;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Qo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const vm = ei(() => new Em()), Jo = BigInt(2 ** 32 - 1), Al = BigInt(32);
function Jp(t, e = !1) {
  return e ? { h: Number(t & Jo), l: Number(t >> Al & Jo) } : { h: Number(t >> Al & Jo) | 0, l: Number(t & Jo) | 0 };
}
function $m(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Jp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Im = (t, e) => BigInt(t >>> 0) << Al | BigInt(e >>> 0), km = (t, e, n) => t >>> n, Lm = (t, e, n) => t << 32 - n | e >>> n, Cm = (t, e, n) => t >>> n | e << 32 - n, Bm = (t, e, n) => t << 32 - n | e >>> n, Tm = (t, e, n) => t << 64 - n | e >>> n - 32, _m = (t, e, n) => t >>> n - 32 | e << 64 - n, Hm = (t, e) => e, Mm = (t, e) => t, Nm = (t, e, n) => t << n | e >>> 32 - n, Pm = (t, e, n) => e << n | t >>> 32 - n, Um = (t, e, n) => e << n - 32 | t >>> 64 - n, Om = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Dm(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Fm = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), jm = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, zm = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Rm = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Gm = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Vm = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, kt = {
  fromBig: Jp,
  split: $m,
  toBig: Im,
  shrSH: km,
  shrSL: Lm,
  rotrSH: Cm,
  rotrSL: Bm,
  rotrBH: Tm,
  rotrBL: _m,
  rotr32H: Hm,
  rotr32L: Mm,
  rotlSH: Nm,
  rotlSL: Pm,
  rotlBH: Um,
  rotlBL: Om,
  add: Dm,
  add3L: Fm,
  add3H: jm,
  add4L: zm,
  add4H: Rm,
  add5H: Vm,
  add5L: Gm
}, [Km, Wm] = kt.split([
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
].map((t) => BigInt(t))), zr = new Uint32Array(80), Rr = new Uint32Array(80);
let ac = class extends Tu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: g, Gh: h, Gl: x, Hh: m, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, g, h, x, m, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, g, h, x, m, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = m | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      zr[p] = e.getUint32(n), Rr[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const k = zr[p - 15] | 0, I = Rr[p - 15] | 0, U = kt.rotrSH(k, I, 1) ^ kt.rotrSH(k, I, 8) ^ kt.shrSH(k, I, 7), V = kt.rotrSL(k, I, 1) ^ kt.rotrSL(k, I, 8) ^ kt.shrSL(k, I, 7), F = zr[p - 2] | 0, R = Rr[p - 2] | 0, A = kt.rotrSH(F, R, 19) ^ kt.rotrBH(F, R, 61) ^ kt.shrSH(F, R, 6), T = kt.rotrSL(F, R, 19) ^ kt.rotrBL(F, R, 61) ^ kt.shrSL(F, R, 6), M = kt.add4L(V, T, Rr[p - 7], Rr[p - 16]), _ = kt.add4H(M, U, A, zr[p - 7], zr[p - 16]);
      zr[p] = _ | 0, Rr[p] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: x, Gh: m, Gl: L, Hh: D, Hl: O } = this;
    for (let p = 0; p < 80; p++) {
      const k = kt.rotrSH(l, g, 14) ^ kt.rotrSH(l, g, 18) ^ kt.rotrBH(l, g, 41), I = kt.rotrSL(l, g, 14) ^ kt.rotrSL(l, g, 18) ^ kt.rotrBL(l, g, 41), U = l & h ^ ~l & m, V = g & x ^ ~g & L, F = kt.add5L(O, I, V, Wm[p], Rr[p]), R = kt.add5H(F, D, k, U, Km[p], zr[p]), A = F | 0, T = kt.rotrSH(r, s, 28) ^ kt.rotrBH(r, s, 34) ^ kt.rotrBH(r, s, 39), M = kt.rotrSL(r, s, 28) ^ kt.rotrBL(r, s, 34) ^ kt.rotrBL(r, s, 39), _ = r & i ^ r & a ^ i & a, nt = s & o ^ s & c ^ o & c;
      D = m | 0, O = L | 0, m = h | 0, L = x | 0, h = l | 0, x = g | 0, { h: l, l: g } = kt.add(u | 0, f | 0, R | 0, A | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const G = kt.add3L(A, M, nt);
      r = kt.add3H(G, R, T, _), s = G | 0;
    }
    ({ h: r, l: s } = kt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = kt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = kt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = kt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = kt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: x } = kt.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: m, l: L } = kt.add(this.Gh | 0, this.Gl | 0, m | 0, L | 0), { h: D, l: O } = kt.add(this.Hh | 0, this.Hl | 0, D | 0, O | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, x, m, L, D, O);
  }
  roundClean() {
    zr.fill(0), Rr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Xm = class extends ac {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, qm = class extends ac {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Ym = class extends ac {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ei(() => new ac());
ei(() => new Xm());
ei(() => new qm());
ei(() => new Ym());
var Ha = { exports: {} };
Ha.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", f = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", h = "[object Number]", x = "[object Object]", m = "[object Promise]", L = "[object RegExp]", D = "[object Set]", O = "[object String]", p = "[object Symbol]", k = "[object WeakMap]", I = "[object ArrayBuffer]", U = "[object DataView]", V = "[object Float32Array]", F = "[object Float64Array]", R = "[object Int8Array]", A = "[object Int16Array]", T = "[object Int32Array]", M = "[object Uint8Array]", _ = "[object Uint8ClampedArray]", nt = "[object Uint16Array]", G = "[object Uint32Array]", Kt = /[\\^$.*+?()[\]{}|]/g, wt = /\w*$/, pe = /^\[object .+?Constructor\]$/, $ = /^(?:0|[1-9]\d*)$/, N = {};
  N[i] = N[o] = N[I] = N[U] = N[a] = N[c] = N[V] = N[F] = N[R] = N[A] = N[T] = N[g] = N[h] = N[x] = N[L] = N[D] = N[O] = N[p] = N[M] = N[_] = N[nt] = N[G] = !0, N[u] = N[f] = N[k] = !1;
  var bt = typeof rn == "object" && rn && rn.Object === Object && rn, Pt = typeof self == "object" && self && self.Object === Object && self, Ht = bt || Pt || Function("return this")(), Mt = e && !e.nodeType && e, ie = Mt && !0 && t && !t.nodeType && t, ge = ie && ie.exports === Mt;
  function Jt(y, C) {
    return y.set(C[0], C[1]), y;
  }
  function Ee(y, C) {
    return y.add(C), y;
  }
  function ve(y, C) {
    for (var P = -1, st = y ? y.length : 0; ++P < st && C(y[P], P, y) !== !1; )
      ;
    return y;
  }
  function te(y, C) {
    for (var P = -1, st = C.length, je = y.length; ++P < st; )
      y[je + P] = C[P];
    return y;
  }
  function Be(y, C, P, st) {
    for (var je = -1, an = y ? y.length : 0; ++je < an; )
      P = C(P, y[je], je, y);
    return P;
  }
  function In(y, C) {
    for (var P = -1, st = Array(y); ++P < y; )
      st[P] = C(P);
    return st;
  }
  function Re(y, C) {
    return y == null ? void 0 : y[C];
  }
  function gn(y) {
    var C = !1;
    if (y != null && typeof y.toString != "function")
      try {
        C = !!(y + "");
      } catch {
      }
    return C;
  }
  function Ge(y) {
    var C = -1, P = Array(y.size);
    return y.forEach(function(st, je) {
      P[++C] = [je, st];
    }), P;
  }
  function Te(y, C) {
    return function(P) {
      return y(C(P));
    };
  }
  function $e(y) {
    var C = -1, P = Array(y.size);
    return y.forEach(function(st) {
      P[++C] = st;
    }), P;
  }
  var ce = Array.prototype, oe = Function.prototype, Ue = Object.prototype, Ve = Ht["__core-js_shared__"], le = function() {
    var y = /[^.]+$/.exec(Ve && Ve.keys && Ve.keys.IE_PROTO || "");
    return y ? "Symbol(src)_1." + y : "";
  }(), Ze = oe.toString, jt = Ue.hasOwnProperty, Ie = Ue.toString, b = RegExp(
    "^" + Ze.call(jt).replace(Kt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), E = ge ? Ht.Buffer : void 0, d = Ht.Symbol, X = Ht.Uint8Array, ct = Te(Object.getPrototypeOf, Object), lt = Object.create, Yt = Ue.propertyIsEnumerable, S = ce.splice, H = Object.getOwnPropertySymbols, B = E ? E.isBuffer : void 0, z = Te(Object.keys, Object), J = ut(Ht, "DataView"), gt = ut(Ht, "Map"), Rt = ut(Ht, "Promise"), yt = ut(Ht, "Set"), Zt = ut(Ht, "WeakMap"), Et = ut(Object, "create"), ot = Ss(J), rt = Ss(gt), ht = Ss(Rt), At = Ss(yt), mt = Ss(Zt), qt = d ? d.prototype : void 0, on = qt ? qt.valueOf : void 0;
  function Oe(y) {
    var C = -1, P = y ? y.length : 0;
    for (this.clear(); ++C < P; ) {
      var st = y[C];
      this.set(st[0], st[1]);
    }
  }
  function kn() {
    this.__data__ = Et ? Et(null) : {};
  }
  function Ut(y) {
    return this.has(y) && delete this.__data__[y];
  }
  function Ot(y) {
    var C = this.__data__;
    if (Et) {
      var P = C[y];
      return P === r ? void 0 : P;
    }
    return jt.call(C, y) ? C[y] : void 0;
  }
  function Gt(y) {
    var C = this.__data__;
    return Et ? C[y] !== void 0 : jt.call(C, y);
  }
  function Me(y, C) {
    var P = this.__data__;
    return P[y] = Et && C === void 0 ? r : C, this;
  }
  Oe.prototype.clear = kn, Oe.prototype.delete = Ut, Oe.prototype.get = Ot, Oe.prototype.has = Gt, Oe.prototype.set = Me;
  function Ne(y) {
    var C = -1, P = y ? y.length : 0;
    for (this.clear(); ++C < P; ) {
      var st = y[C];
      this.set(st[0], st[1]);
    }
  }
  function Ln() {
    this.__data__ = [];
  }
  function Ir(y) {
    var C = this.__data__, P = me(C, y);
    if (P < 0)
      return !1;
    var st = C.length - 1;
    return P == st ? C.pop() : S.call(C, P, 1), !0;
  }
  function kr(y) {
    var C = this.__data__, P = me(C, y);
    return P < 0 ? void 0 : C[P][1];
  }
  function Lr(y) {
    return me(this.__data__, y) > -1;
  }
  function ai(y, C) {
    var P = this.__data__, st = me(P, y);
    return st < 0 ? P.push([y, C]) : P[st][1] = C, this;
  }
  Ne.prototype.clear = Ln, Ne.prototype.delete = Ir, Ne.prototype.get = kr, Ne.prototype.has = Lr, Ne.prototype.set = ai;
  function De(y) {
    var C = -1, P = y ? y.length : 0;
    for (this.clear(); ++C < P; ) {
      var st = y[C];
      this.set(st[0], st[1]);
    }
  }
  function ci() {
    this.__data__ = {
      hash: new Oe(),
      map: new (gt || Ne)(),
      string: new Oe()
    };
  }
  function ws(y) {
    return q(this, y).delete(y);
  }
  function li(y) {
    return q(this, y).get(y);
  }
  function Cr(y) {
    return q(this, y).has(y);
  }
  function Br(y, C) {
    return q(this, y).set(y, C), this;
  }
  De.prototype.clear = ci, De.prototype.delete = ws, De.prototype.get = li, De.prototype.has = Cr, De.prototype.set = Br;
  function yn(y) {
    this.__data__ = new Ne(y);
  }
  function Tr() {
    this.__data__ = new Ne();
  }
  function bs(y) {
    return this.__data__.delete(y);
  }
  function _r(y) {
    return this.__data__.get(y);
  }
  function ms(y) {
    return this.__data__.has(y);
  }
  function K(y, C) {
    var P = this.__data__;
    if (P instanceof Ne) {
      var st = P.__data__;
      if (!gt || st.length < n - 1)
        return st.push([y, C]), this;
      P = this.__data__ = new De(st);
    }
    return P.set(y, C), this;
  }
  yn.prototype.clear = Tr, yn.prototype.delete = bs, yn.prototype.get = _r, yn.prototype.has = ms, yn.prototype.set = K;
  function tt(y, C) {
    var P = Lc(y) || hw(y) ? In(y.length, String) : [], st = P.length, je = !!st;
    for (var an in y)
      jt.call(y, an) && !(je && (an == "length" || Qe(an, st))) && P.push(an);
    return P;
  }
  function ue(y, C, P) {
    var st = y[C];
    (!(jt.call(y, C) && If(st, P)) || P === void 0 && !(C in y)) && (y[C] = P);
  }
  function me(y, C) {
    for (var P = y.length; P--; )
      if (If(y[P][0], C))
        return P;
    return -1;
  }
  function xs(y, C) {
    return y && j(C, Cc(C), y);
  }
  function Kn(y, C, P, st, je, an, hr) {
    var cn;
    if (st && (cn = an ? st(y, je, an, hr) : st(y)), cn !== void 0)
      return cn;
    if (!Oo(y))
      return y;
    var Cf = Lc(y);
    if (Cf) {
      if (cn = Wt(y), !C)
        return v(y, cn);
    } else {
      var fi = pt(y), Bf = fi == f || fi == l;
      if (gw(y))
        return ui(y, C);
      if (fi == x || fi == i || Bf && !an) {
        if (gn(y))
          return an ? y : {};
        if (cn = Fe(Bf ? {} : y), !C)
          return Z(y, xs(cn, y));
      } else {
        if (!N[fi])
          return an ? y : {};
        cn = Cn(y, fi, Kn, C);
      }
    }
    hr || (hr = new yn());
    var Tf = hr.get(y);
    if (Tf)
      return Tf;
    if (hr.set(y, cn), !Cf)
      var _f = P ? et(y) : Cc(y);
    return ve(_f || y, function(Bc, Do) {
      _f && (Do = Bc, Bc = y[Do]), ue(cn, Do, Kn(Bc, C, P, st, Do, y, hr));
    }), cn;
  }
  function ae(y) {
    return Oo(y) ? lt(y) : {};
  }
  function qi(y, C, P) {
    var st = C(y);
    return Lc(y) ? st : te(st, P(y));
  }
  function Yi(y) {
    return Ie.call(y);
  }
  function Un(y) {
    if (!Oo(y) || Uo(y))
      return !1;
    var C = Lf(y) || gn(y) ? b : pe;
    return C.test(Ss(y));
  }
  function Zi(y) {
    if (!$f(y))
      return z(y);
    var C = [];
    for (var P in Object(y))
      jt.call(y, P) && P != "constructor" && C.push(P);
    return C;
  }
  function ui(y, C) {
    if (C)
      return y.slice();
    var P = new y.constructor(y.length);
    return y.copy(P), P;
  }
  function Qi(y) {
    var C = new y.constructor(y.byteLength);
    return new X(C).set(new X(y)), C;
  }
  function Ji(y, C) {
    var P = C ? Qi(y.buffer) : y.buffer;
    return new y.constructor(P, y.byteOffset, y.byteLength);
  }
  function $c(y, C, P) {
    var st = C ? P(Ge(y), !0) : Ge(y);
    return Be(st, Jt, new y.constructor());
  }
  function Ic(y) {
    var C = new y.constructor(y.source, wt.exec(y));
    return C.lastIndex = y.lastIndex, C;
  }
  function to(y, C, P) {
    var st = C ? P($e(y), !0) : $e(y);
    return Be(st, Ee, new y.constructor());
  }
  function kc(y) {
    return on ? Object(on.call(y)) : {};
  }
  function w(y, C) {
    var P = C ? Qi(y.buffer) : y.buffer;
    return new y.constructor(P, y.byteOffset, y.length);
  }
  function v(y, C) {
    var P = -1, st = y.length;
    for (C || (C = Array(st)); ++P < st; )
      C[P] = y[P];
    return C;
  }
  function j(y, C, P, st) {
    P || (P = {});
    for (var je = -1, an = C.length; ++je < an; ) {
      var hr = C[je], cn = void 0;
      ue(P, hr, cn === void 0 ? y[hr] : cn);
    }
    return P;
  }
  function Z(y, C) {
    return j(y, xt(y), C);
  }
  function et(y) {
    return qi(y, Cc, xt);
  }
  function q(y, C) {
    var P = y.__data__;
    return Wn(C) ? P[typeof C == "string" ? "string" : "hash"] : P.map;
  }
  function ut(y, C) {
    var P = Re(y, C);
    return Un(P) ? P : void 0;
  }
  var xt = H ? Te(H, Object) : bw, pt = Yi;
  (J && pt(new J(new ArrayBuffer(1))) != U || gt && pt(new gt()) != g || Rt && pt(Rt.resolve()) != m || yt && pt(new yt()) != D || Zt && pt(new Zt()) != k) && (pt = function(y) {
    var C = Ie.call(y), P = C == x ? y.constructor : void 0, st = P ? Ss(P) : void 0;
    if (st)
      switch (st) {
        case ot:
          return U;
        case rt:
          return g;
        case ht:
          return m;
        case At:
          return D;
        case mt:
          return k;
      }
    return C;
  });
  function Wt(y) {
    var C = y.length, P = y.constructor(C);
    return C && typeof y[0] == "string" && jt.call(y, "index") && (P.index = y.index, P.input = y.input), P;
  }
  function Fe(y) {
    return typeof y.constructor == "function" && !$f(y) ? ae(ct(y)) : {};
  }
  function Cn(y, C, P, st) {
    var je = y.constructor;
    switch (C) {
      case I:
        return Qi(y);
      case a:
      case c:
        return new je(+y);
      case U:
        return Ji(y, st);
      case V:
      case F:
      case R:
      case A:
      case T:
      case M:
      case _:
      case nt:
      case G:
        return w(y, st);
      case g:
        return $c(y, st, P);
      case h:
      case O:
        return new je(y);
      case L:
        return Ic(y);
      case D:
        return to(y, st, P);
      case p:
        return kc(y);
    }
  }
  function Qe(y, C) {
    return C = C ?? s, !!C && (typeof y == "number" || $.test(y)) && y > -1 && y % 1 == 0 && y < C;
  }
  function Wn(y) {
    var C = typeof y;
    return C == "string" || C == "number" || C == "symbol" || C == "boolean" ? y !== "__proto__" : y === null;
  }
  function Uo(y) {
    return !!le && le in y;
  }
  function $f(y) {
    var C = y && y.constructor, P = typeof C == "function" && C.prototype || Ue;
    return y === P;
  }
  function Ss(y) {
    if (y != null) {
      try {
        return Ze.call(y);
      } catch {
      }
      try {
        return y + "";
      } catch {
      }
    }
    return "";
  }
  function dw(y) {
    return Kn(y, !0, !0);
  }
  function If(y, C) {
    return y === C || y !== y && C !== C;
  }
  function hw(y) {
    return pw(y) && jt.call(y, "callee") && (!Yt.call(y, "callee") || Ie.call(y) == i);
  }
  var Lc = Array.isArray;
  function kf(y) {
    return y != null && yw(y.length) && !Lf(y);
  }
  function pw(y) {
    return ww(y) && kf(y);
  }
  var gw = B || mw;
  function Lf(y) {
    var C = Oo(y) ? Ie.call(y) : "";
    return C == f || C == l;
  }
  function yw(y) {
    return typeof y == "number" && y > -1 && y % 1 == 0 && y <= s;
  }
  function Oo(y) {
    var C = typeof y;
    return !!y && (C == "object" || C == "function");
  }
  function ww(y) {
    return !!y && typeof y == "object";
  }
  function Cc(y) {
    return kf(y) ? tt(y) : Zi(y);
  }
  function bw() {
    return [];
  }
  function mw() {
    return !1;
  }
  t.exports = dw;
})(Ha, Ha.exports);
var Zm = Ha.exports;
const tg = /* @__PURE__ */ f0(Zm);
var El;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(El || (El = {}));
function Qm(t, e) {
  return { type: El.Address, version: t, hash160: e };
}
function Jm(t) {
  return ni.c32address(t.version, t.hash160);
}
const tx = (t) => vm(Kp(t)), ex = (t) => dt(tx(t));
Ae.hmacSha256Sync = (t, ...e) => {
  const n = Gp.create(Kp, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function nx(t, e = "mainnet") {
  e = Fp(e), t = typeof t == "string" ? zt(t) : t;
  const n = ym(br.P2PKH, e), r = Qm(n, ex(t));
  return Jm(r);
}
function rx(t, e) {
  const n = ze.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = nx(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new ze.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function sx(t, e = null) {
  let n;
  e ? n = rx(t, e) : n = ze.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const $d = "_blockstackDidCheckEchoReply", ix = "echoReply", ox = "authContinuation";
function ax(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function cx() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[$d];
  if (typeof e == "boolean")
    return e;
  const n = ax(t.location.search), r = n[ix];
  if (r) {
    t[$d] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[ox];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class vl {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new S0();
    else
      throw new qw("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new od(e.sessionOptions) : this.store = new od() : e ? this.store = new id(e.sessionOptions) : this.store = new id();
  }
  makeAuthRequestToken(e, n, r, s, i, o = Zw().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new fl("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, W2(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = K2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = yu("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (cx())
        return wi.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      wi.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = xb()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Fo("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = ze.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Q2(e))
      throw new Fo("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (_c(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await rd(s, i.private_key);
          } catch {
            if (wi.warn("Failed decryption of appPrivateKey, will try to use as given"), !Ae.isValidPrivateKey(i.private_key))
              throw new Fo("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await rd(s, c);
          } catch {
            wi.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Fo("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = lb, f;
    _c(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), _c(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (f = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: Up(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: f
    }, g = i.profile_url;
    if (!l.profile && g) {
      const h = await n(g);
      if (!h.ok)
        l.profile = Object.assign({}, Kw);
      else {
        const x = await h.text(), m = JSON.parse(x);
        l.profile = sx(m[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new fl("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), l2(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), u2(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
vl.prototype.makeAuthRequest = vl.prototype.makeAuthRequestToken;
const lx = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], ux = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = lx(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!cc(r.id));
  return e.concat(n);
}, cc = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), eg = "STX_PROVIDER", js = () => typeof window > "u" ? null : window.localStorage.getItem(eg), fx = (t) => {
  typeof window < "u" && window.localStorage.setItem(eg, t);
}, dx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function hx(t, e) {
  const n = {};
  return Object.assign(n, dx, e), await fetch(t, n);
}
function px(t) {
  let e = hx, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function gx(...t) {
  const { fetchLib: e, middlewares: n } = px(t);
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
var Mi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Mi || (Mi = {}));
var zs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(zs || (zs = {}));
var Id;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Id || (Id = {}));
const yx = "https://api.mainnet.hiro.so", wx = "https://api.testnet.hiro.so", bx = "http://localhost:3999", mx = ["mainnet", "testnet", "devnet", "mocknet"];
class Rs {
  constructor(e) {
    this.version = zs.Mainnet, this.chainId = Mi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === zs.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? gx();
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
Rs.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new $l();
    case "testnet":
      return new Il();
    case "devnet":
      return new xx();
    case "mocknet":
      return new ng();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${mx.join(", ")}`);
  }
};
Rs.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Rs.fromName(t);
class $l extends Rs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? yx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = zs.Mainnet, this.chainId = Mi.Mainnet;
  }
}
class Il extends Rs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? wx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = zs.Testnet, this.chainId = Mi.Testnet;
  }
}
class ng extends Rs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? bx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = zs.Testnet, this.chainId = Mi.Testnet;
  }
}
const xx = ng;
var Gs;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Gs || (Gs = {}));
var Ma;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ma || (Ma = {}));
Gs.Mainnet;
var Vs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Vs || (Vs = {}));
var Ks;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ks || (Ks = {}));
Vs.Mainnet;
const Sx = {
  chainId: Gs.Mainnet,
  transactionVersion: Vs.Mainnet,
  peerNetworkId: Ma.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Ks.MainnetSingleSig,
    multiSig: Ks.MainnetMultiSig
  },
  client: { baseUrl: b0 }
}, kl = {
  chainId: Gs.Testnet,
  transactionVersion: Vs.Testnet,
  peerNetworkId: Ma.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Ks.TestnetSingleSig,
    multiSig: Ks.TestnetMultiSig
  },
  client: { baseUrl: m0 }
}, ma = {
  ...kl,
  addressVersion: { ...kl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: x0 }
}, Ax = {
  ...ma,
  addressVersion: { ...ma.addressVersion },
  client: { ...ma.client }
};
function Ex(t) {
  switch (t) {
    case "mainnet":
      return Sx;
    case "testnet":
      return kl;
    case "devnet":
      return ma;
    case "mocknet":
      return Ax;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function vx(t) {
  return typeof t == "string" ? Ex(t) : t;
}
function $x(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const kd = /* @__PURE__ */ new Map();
function rg(t, e) {
  const n = kd.get(t);
  if (n !== void 0)
    return n(e);
  const r = $x(t);
  return kd.set(t, r), rg(t, e);
}
let se = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? zt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return yb(this.readBytes(4), 0);
  }
  readUInt8() {
    return pb(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return db(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = dt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = dt(n);
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
    if (rg(e, r))
      return r;
    throw n(r);
  }
};
const Ix = 128, kx = 128, sg = 16, _s = 32, Ll = 80, lc = 65, Lx = 32, Cx = 64, Na = 34, Bx = 1 + 16 * 1024 * 1024, Tx = 165, _x = 16, Hx = 16, Mx = 20, Nx = Hx + 2 + Mx, Px = Nx + 4, Ux = Bx + (Tx + _x * Px);
var Xt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Xt || (Xt = {}));
var Cl;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Cl || (Cl = {}));
var bn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(bn || (bn = {}));
const Dc = ["onChainOnly", "offChainOnly", "any"];
Dc[0] + "", bn.OnChainOnly, Dc[1] + "", bn.OffChainOnly, Dc[2] + "", bn.Any, bn.OnChainOnly + "", bn.OnChainOnly, bn.OffChainOnly + "", bn.OffChainOnly, bn.Any + "", bn.Any;
var Pa;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Pa || (Pa = {}));
var fe;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(fe || (fe = {}));
var xe;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(xe || (xe = {}));
var ee;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ee || (ee = {}));
var we;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(we || (we = {}));
var ho;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ho || (ho = {}));
var Bl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Bl || (Bl = {}));
var Tl;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Tl || (Tl = {}));
var nn;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(nn || (nn = {}));
var Ld;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ld || (Ld = {}));
var _l;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(_l || (_l = {}));
var jn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(jn || (jn = {}));
var Cd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Cd || (Cd = {}));
let uc = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, bi = class extends uc {
  constructor(e) {
    super(e);
  }
}, Je = class extends uc {
  constructor(e) {
    super(e);
  }
}, Ua = class extends uc {
  constructor(e) {
    super(e);
  }
}, ks = class extends uc {
  constructor(e) {
    super(e);
  }
};
function Hl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Ox(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function ig(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Dx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Hl(t.outputLen), Hl(t.blockLen);
}
function Fx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function jx(t, e) {
  ig(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ls = {
  number: Hl,
  bool: Ox,
  bytes: ig,
  hash: Dx,
  exists: Fx,
  output: jx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Fc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Zn = (t, e) => t << 32 - e | t >>> e, zx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!zx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Rx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Nu(t) {
  if (typeof t == "string" && (t = Rx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let og = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ri(t) {
  const e = (r) => t().update(Nu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let ag = class extends og {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ls.hash(e);
    const r = Nu(n);
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
    return Ls.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ls.exists(this), Ls.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const cg = (t, e, n) => new ag(t, e).update(n).digest();
cg.create = (t, e) => new ag(t, e);
function Gx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Pu = class extends og {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Fc(this.buffer);
  }
  update(e) {
    Ls.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Nu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Fc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ls.exists(this), Ls.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Gx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Fc(e), c = this.outputLen;
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
const Vx = (t, e, n) => t & e ^ ~t & n, Kx = (t, e, n) => t & e ^ t & n ^ e & n, Wx = new Uint32Array([
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
]), Vr = new Uint32Array(64);
let lg = class extends Pu {
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
      Vr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Vr[l - 15], h = Vr[l - 2], x = Zn(g, 7) ^ Zn(g, 18) ^ g >>> 3, m = Zn(h, 17) ^ Zn(h, 19) ^ h >>> 10;
      Vr[l] = m + Vr[l - 7] + x + Vr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = Zn(a, 6) ^ Zn(a, 11) ^ Zn(a, 25), h = f + g + Vx(a, c, u) + Wx[l] + Vr[l] | 0, m = (Zn(r, 2) ^ Zn(r, 13) ^ Zn(r, 22)) + Kx(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    Vr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Xx = class extends lg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Uu = ri(() => new lg());
ri(() => new Xx());
const qx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ug = Uint8Array.from({ length: 16 }, (t, e) => e), Yx = ug.map((t) => (9 * t + 5) % 16);
let Ou = [ug], Du = [Yx];
for (let t = 0; t < 4; t++)
  for (let e of [Ou, Du])
    e.push(e[t].map((n) => qx[n]));
const fg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Zx = Ou.map((t, e) => t.map((n) => fg[e][n])), Qx = Du.map((t, e) => t.map((n) => fg[e][n])), Jx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), tS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ta = (t, e) => t << e | t >>> 32 - e;
function Bd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ea = new Uint32Array(16);
let eS = class extends Pu {
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
      ea[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, m = Jx[h], L = tS[h], D = Ou[h], O = Du[h], p = Zx[h], k = Qx[h];
      for (let I = 0; I < 16; I++) {
        const U = ta(r + Bd(h, i, a, u) + ea[D[I]] + m, p[I]) + l | 0;
        r = l, l = u, u = ta(a, 10) | 0, a = i, i = U;
      }
      for (let I = 0; I < 16; I++) {
        const U = ta(s + Bd(x, o, c, f) + ea[O[I]] + L, k[I]) + g | 0;
        s = g, g = f, f = ta(c, 10) | 0, c = o, o = U;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    ea.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const nS = ri(() => new eS()), na = BigInt(2 ** 32 - 1), Ml = BigInt(32);
function dg(t, e = !1) {
  return e ? { h: Number(t & na), l: Number(t >> Ml & na) } : { h: Number(t >> Ml & na) | 0, l: Number(t & na) | 0 };
}
function rS(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = dg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const sS = (t, e) => BigInt(t >>> 0) << Ml | BigInt(e >>> 0), iS = (t, e, n) => t >>> n, oS = (t, e, n) => t << 32 - n | e >>> n, aS = (t, e, n) => t >>> n | e << 32 - n, cS = (t, e, n) => t << 32 - n | e >>> n, lS = (t, e, n) => t << 64 - n | e >>> n - 32, uS = (t, e, n) => t >>> n - 32 | e << 64 - n, fS = (t, e) => e, dS = (t, e) => t, hS = (t, e, n) => t << n | e >>> 32 - n, pS = (t, e, n) => e << n | t >>> 32 - n, gS = (t, e, n) => e << n - 32 | t >>> 64 - n, yS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function wS(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const bS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), mS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, xS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), SS = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, AS = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), ES = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Lt = {
  fromBig: dg,
  split: rS,
  toBig: sS,
  shrSH: iS,
  shrSL: oS,
  rotrSH: aS,
  rotrSL: cS,
  rotrBH: lS,
  rotrBL: uS,
  rotr32H: fS,
  rotr32L: dS,
  rotlSH: hS,
  rotlSL: pS,
  rotlBH: gS,
  rotlBL: yS,
  add: wS,
  add3L: bS,
  add3H: mS,
  add4L: xS,
  add4H: SS,
  add5H: ES,
  add5L: AS
}, [vS, $S] = Lt.split([
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
].map((t) => BigInt(t))), Kr = new Uint32Array(80), Wr = new Uint32Array(80);
let fc = class extends Pu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: g, Gh: h, Gl: x, Hh: m, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, g, h, x, m, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, g, h, x, m, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = m | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Kr[p] = e.getUint32(n), Wr[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const k = Kr[p - 15] | 0, I = Wr[p - 15] | 0, U = Lt.rotrSH(k, I, 1) ^ Lt.rotrSH(k, I, 8) ^ Lt.shrSH(k, I, 7), V = Lt.rotrSL(k, I, 1) ^ Lt.rotrSL(k, I, 8) ^ Lt.shrSL(k, I, 7), F = Kr[p - 2] | 0, R = Wr[p - 2] | 0, A = Lt.rotrSH(F, R, 19) ^ Lt.rotrBH(F, R, 61) ^ Lt.shrSH(F, R, 6), T = Lt.rotrSL(F, R, 19) ^ Lt.rotrBL(F, R, 61) ^ Lt.shrSL(F, R, 6), M = Lt.add4L(V, T, Wr[p - 7], Wr[p - 16]), _ = Lt.add4H(M, U, A, Kr[p - 7], Kr[p - 16]);
      Kr[p] = _ | 0, Wr[p] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: x, Gh: m, Gl: L, Hh: D, Hl: O } = this;
    for (let p = 0; p < 80; p++) {
      const k = Lt.rotrSH(l, g, 14) ^ Lt.rotrSH(l, g, 18) ^ Lt.rotrBH(l, g, 41), I = Lt.rotrSL(l, g, 14) ^ Lt.rotrSL(l, g, 18) ^ Lt.rotrBL(l, g, 41), U = l & h ^ ~l & m, V = g & x ^ ~g & L, F = Lt.add5L(O, I, V, $S[p], Wr[p]), R = Lt.add5H(F, D, k, U, vS[p], Kr[p]), A = F | 0, T = Lt.rotrSH(r, s, 28) ^ Lt.rotrBH(r, s, 34) ^ Lt.rotrBH(r, s, 39), M = Lt.rotrSL(r, s, 28) ^ Lt.rotrBL(r, s, 34) ^ Lt.rotrBL(r, s, 39), _ = r & i ^ r & a ^ i & a, nt = s & o ^ s & c ^ o & c;
      D = m | 0, O = L | 0, m = h | 0, L = x | 0, h = l | 0, x = g | 0, { h: l, l: g } = Lt.add(u | 0, f | 0, R | 0, A | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const G = Lt.add3L(A, M, nt);
      r = Lt.add3H(G, R, T, _), s = G | 0;
    }
    ({ h: r, l: s } = Lt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Lt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Lt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Lt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = Lt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: x } = Lt.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: m, l: L } = Lt.add(this.Gh | 0, this.Gl | 0, m | 0, L | 0), { h: D, l: O } = Lt.add(this.Hh | 0, this.Hl | 0, D | 0, O | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, x, m, L, D, O);
  }
  roundClean() {
    Kr.fill(0), Wr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, IS = class extends fc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, kS = class extends fc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, LS = class extends fc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ri(() => new fc());
ri(() => new IS());
const CS = ri(() => new kS());
ri(() => new LS());
var Dt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Dt || (Dt = {}));
var He;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(He || (He = {}));
function Fu(t) {
  return He[t];
}
const BS = () => ({ type: Dt.BoolTrue }), TS = () => ({ type: Dt.BoolFalse }), _S = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Dt.Buffer, value: dt(t) };
}, Td = BigInt("0xffffffffffffffffffffffffffffffff"), HS = BigInt(0), _d = BigInt("0x7fffffffffffffffffffffffffffffff"), Hd = BigInt("-170141183460469231731687303715884105728"), MS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = hl(zt(t))), pn(t, Uint8Array) && (t = hl(t));
  const e = Ye(t);
  if (e > _d)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${_d}`);
  if (e < Hd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Hd}`);
  return { type: Dt.Int, value: e };
}, NS = (t) => {
  const e = Ye(t);
  if (e < HS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Td)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Td}`);
  return { type: Dt.UInt, value: e };
};
function PS(t) {
  return { type: Dt.List, value: t };
}
function hg() {
  return { type: Dt.OptionalNone };
}
function pg(t) {
  return { type: Dt.OptionalSome, value: t };
}
var Q;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Q || (Q = {}));
function US() {
  return {
    type: Q.Address,
    version: Ks.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Md(t) {
  if (t && Eg(t, Na))
    throw new Error(`Memo exceeds maximum length of ${Na} bytes`);
  return { type: Q.MemoString, content: t };
}
function ju(t, e) {
  return {
    type: Q.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Nl(t) {
  if (zt(t).byteLength != lc)
    throw Error("Invalid signature");
  return {
    type: Q.MessageSignature,
    data: t
  };
}
function OS(t, e, n) {
  return typeof t == "string" && (t = t3(t)), typeof n == "string" && (n = Md(n)), {
    type: Q.Payload,
    payloadType: Xt.TokenTransfer,
    recipient: t,
    amount: Ye(e),
    memo: n ?? Md("")
  };
}
function DS(t, e, n, r) {
  return typeof e == "string" && (e = Gn(e)), typeof n == "string" && (n = Gn(n)), {
    type: Q.Payload,
    payloadType: Xt.ContractCall,
    contractAddress: typeof t == "string" ? gs(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function FS(t) {
  return Gn(t, 4, 1e5);
}
function Nd(t, e, n) {
  return typeof t == "string" && (t = Gn(t)), typeof e == "string" && (e = FS(e)), typeof n == "number" ? {
    type: Q.Payload,
    payloadType: Xt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: Q.Payload,
    payloadType: Xt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function jS() {
  return { type: Q.Payload, payloadType: Xt.PoisonMicroblock };
}
function Pd(t, e) {
  if (t.byteLength != _s)
    throw Error(`Coinbase buffer size must be ${_s} bytes`);
  return e != null ? {
    type: Q.Payload,
    payloadType: Xt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: Q.Payload,
    payloadType: Xt.Coinbase,
    coinbaseBytes: t
  };
}
function zS(t, e, n) {
  if (t.byteLength != _s)
    throw Error(`Coinbase buffer size must be ${_s} bytes`);
  if (n.byteLength != Ll)
    throw Error(`VRF proof buffer size must be ${Ll} bytes`);
  return {
    type: Q.Payload,
    payloadType: Xt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Dt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function RS(t, e, n, r, s, i, o) {
  return {
    type: Q.Payload,
    payloadType: Xt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Gn(t, e, n) {
  const r = e || 1, s = n || Ix;
  if (Eg(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Q.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function GS(t, e, n) {
  return {
    type: Q.Asset,
    address: gs(t),
    contractName: Gn(e),
    assetName: Gn(n)
  };
}
function gs(t) {
  const e = ni.c32addressDecode(t);
  return {
    type: Q.Address,
    version: e[0],
    hash160: e[1]
  };
}
function VS(t, e) {
  const n = gs(t), r = Gn(e);
  return {
    type: Q.Principal,
    prefix: nn.Contract,
    address: n,
    contractName: r
  };
}
function KS(t) {
  const e = gs(t);
  return {
    type: Q.Principal,
    prefix: nn.Standard,
    address: e
  };
}
function mi(t, e) {
  return {
    pubKeyEncoding: t,
    type: Q.TransactionAuthField,
    contents: e
  };
}
function yr(t) {
  switch (t.type) {
    case Q.Address:
      return Mo(t);
    case Q.Principal:
      return gg(t);
    case Q.LengthPrefixedString:
      return Pi(t);
    case Q.MemoString:
      return XS(t);
    case Q.Asset:
      return wg(t);
    case Q.PostCondition:
      return mg(t);
    case Q.PublicKey:
      return Ol(t);
    case Q.LengthPrefixedList:
      return zu(t);
    case Q.Payload:
      return xg(t);
    case Q.TransactionAuthField:
      return JS(t);
    case Q.MessageSignature:
      return Ru(t);
  }
}
function Mo(t) {
  const e = [];
  return e.push(zt(Co(t.version, 1))), e.push(zt(t.hash160)), Le(e);
}
function Ni(t) {
  const e = pn(t, se) ? t : new se(t), n = Za(dt(e.readBytes(1))), r = dt(e.readBytes(20));
  return { type: Q.Address, version: n, hash160: r };
}
function gg(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === nn.Standard || t.prefix === nn.Contract) && e.push(Mo(t.address)), t.prefix === nn.Contract && e.push(Pi(t.contractName)), Le(e);
}
function WS(t) {
  const e = pn(t, se) ? t : new se(t), n = e.readUInt8Enum(nn, (i) => {
    throw new Je(`Unexpected Principal payload type: ${i}`);
  });
  if (n === nn.Origin)
    return { type: Q.Principal, prefix: n };
  const r = Ni(e);
  if (n === nn.Standard)
    return { type: Q.Principal, prefix: n, address: r };
  const s = Hn(e);
  return {
    type: Q.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Pi(t) {
  const e = [], n = Js(t.content), r = n.byteLength;
  return e.push(zt(Co(r, t.lengthPrefixBytes))), e.push(n), Le(e);
}
function Hn(t, e, n) {
  e = e || 1;
  const r = pn(t, se) ? t : new se(t), s = Za(dt(r.readBytes(e))), i = Bo(r.readBytes(s));
  return Gn(i, e, n ?? 128);
}
function XS(t) {
  const e = [], n = Js(t.content), r = A3(dt(n), Na * 2);
  return e.push(zt(r)), Le(e);
}
function yg(t) {
  const e = pn(t, se) ? t : new se(t);
  let n = Bo(e.readBytes(Na));
  return n = n.replace(/\u0000*$/, ""), { type: Q.MemoString, content: n };
}
function wg(t) {
  const e = [];
  return e.push(Mo(t.address)), e.push(Pi(t.contractName)), e.push(Pi(t.assetName)), Le(e);
}
function Pl(t) {
  const e = pn(t, se) ? t : new se(t);
  return {
    type: Q.Asset,
    address: Ni(e),
    contractName: Hn(e),
    assetName: Hn(e)
  };
}
function zu(t) {
  const e = t.values, n = [];
  n.push(zt(Co(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(yr(r));
  return Le(n);
}
function bg(t, e, n) {
  const r = pn(t, se) ? t : new se(t), s = Za(dt(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case Q.Address:
        i.push(Ni(r));
        break;
      case Q.LengthPrefixedString:
        i.push(Hn(r));
        break;
      case Q.MemoString:
        i.push(yg(r));
        break;
      case Q.Asset:
        i.push(Pl(r));
        break;
      case Q.PostCondition:
        i.push(YS(r));
        break;
      case Q.PublicKey:
        i.push(Dl(r));
        break;
      case Q.TransactionAuthField:
        i.push(QS(r));
        break;
    }
  return ju(i, n);
}
function qS(t) {
  return dt(mg(t));
}
function mg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(gg(t.principal)), (t.conditionType === fe.Fungible || t.conditionType === fe.NonFungible) && e.push(wg(t.asset)), t.conditionType === fe.NonFungible && e.push(or(t.assetName)), e.push(t.conditionCode), t.conditionType === fe.STX || t.conditionType === fe.Fungible || t.conditionType === fe.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new bi("The post-condition amount may not be larger than 8 bytes");
    e.push(hs(t.amount, 8));
  }
  return Le(e);
}
function YS(t) {
  const e = pn(t, se) ? t : new se(t), n = e.readUInt8Enum(fe, (a) => {
    throw new Je(`Could not read ${a} as PostConditionType`);
  }), r = WS(e);
  let s, i, o;
  switch (n) {
    case fe.STX:
      return s = e.readUInt8Enum(ho, (c) => {
        throw new Je(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${dt(e.readBytes(8))}`), {
        type: Q.PostCondition,
        conditionType: fe.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case fe.Fungible:
      return i = Pl(e), s = e.readUInt8Enum(ho, (c) => {
        throw new Je(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${dt(e.readBytes(8))}`), {
        type: Q.PostCondition,
        conditionType: fe.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case fe.NonFungible:
      i = Pl(e);
      const a = rr(e);
      return s = e.readUInt8Enum(Bl, (c) => {
        throw new Je(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: Q.PostCondition,
        conditionType: fe.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case fe.Staking:
      return s = e.readUInt8Enum(ho, (c) => {
        throw new Je(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${dt(e.readBytes(8))}`), {
        type: Q.PostCondition,
        conditionType: fe.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case fe.PoX: {
      const c = e.readUInt8Enum(Tl, (u) => {
        throw new Je(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: Q.PostCondition,
        conditionType: fe.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function xg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Xt.TokenTransfer:
      e.push(or(t.recipient)), e.push(hs(t.amount, 8)), e.push(yr(t.memo));
      break;
    case Xt.ContractCall:
      e.push(yr(t.contractAddress)), e.push(yr(t.contractName)), e.push(yr(t.functionName));
      const n = new Uint8Array(4);
      Ps(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(or(r));
      });
      break;
    case Xt.SmartContract:
      e.push(yr(t.contractName)), e.push(yr(t.codeBody));
      break;
    case Xt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(yr(t.contractName)), e.push(yr(t.codeBody));
      break;
    case Xt.PoisonMicroblock:
      break;
    case Xt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Xt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(or(t.recipient));
      break;
    case Xt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(or(t.recipient ? pg(t.recipient) : hg())), e.push(t.vrfProof);
      break;
    case Xt.TenureChange:
      e.push(zt(t.tenureHash)), e.push(zt(t.previousTenureHash)), e.push(zt(t.burnViewHash)), e.push(zt(t.previousTenureEnd)), e.push(Ps(new Uint8Array(4), t.previousTenureBlocks)), e.push(gb(new Uint8Array(1), t.cause)), e.push(zt(t.publicKeyHash));
      break;
  }
  return Le(e);
}
function ZS(t) {
  const e = pn(t, se) ? t : new se(t);
  switch (e.readUInt8Enum(Xt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Xt.TokenTransfer:
      const r = rr(e), s = Ye(e.readBytes(8)), i = yg(e);
      return OS(r, s, i);
    case Xt.ContractCall:
      const o = Ni(e), a = Hn(e), c = Hn(e), u = [], f = e.readUInt32BE();
      for (let k = 0; k < f; k++) {
        const I = rr(e);
        u.push(I);
      }
      return DS(o, a, c, u);
    case Xt.SmartContract:
      const l = Hn(e), g = Hn(e, 4, 1e5);
      return Nd(l, g);
    case Xt.VersionedSmartContract: {
      const k = e.readUInt8Enum(Cl, (V) => {
        throw new Error(`Cannot recognize ClarityVersion: ${V}`);
      }), I = Hn(e), U = Hn(e, 4, Ux);
      return Nd(I, U, k);
    }
    case Xt.PoisonMicroblock:
      return jS();
    case Xt.Coinbase: {
      const k = e.readBytes(_s);
      return Pd(k);
    }
    case Xt.CoinbaseToAltRecipient: {
      const k = e.readBytes(_s), I = rr(e);
      return Pd(k, I);
    }
    case Xt.NakamotoCoinbase: {
      const k = e.readBytes(_s), I = rr(e), U = e.readBytes(Ll);
      return zS(k, I, U);
    }
    case Xt.TenureChange:
      const h = dt(e.readBytes(20)), x = dt(e.readBytes(20)), m = dt(e.readBytes(20)), L = dt(e.readBytes(32)), D = e.readUInt32BE(), O = e.readUInt8Enum(_l, (k) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${k}`);
      }), p = dt(e.readBytes(20));
      return RS(h, x, m, L, D, O, p);
  }
}
function Ul(t) {
  const e = pn(t, se) ? t : new se(t);
  return Nl(dt(e.readBytes(lc)));
}
function QS(t) {
  const e = pn(t, se) ? t : new se(t), n = e.readUInt8Enum(jn, (r) => {
    throw new Je(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case jn.PublicKeyCompressed:
      return mi(we.Compressed, Dl(e));
    case jn.PublicKeyUncompressed:
      return mi(we.Uncompressed, Gi(H3(Dl(e).data)));
    case jn.SignatureCompressed:
      return mi(we.Compressed, Ul(e));
    case jn.SignatureUncompressed:
      return mi(we.Uncompressed, Ul(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Ru(t) {
  return zt(t.data);
}
function JS(t) {
  const e = [];
  switch (t.contents.type) {
    case Q.PublicKey:
      e.push(t.pubKeyEncoding === we.Compressed ? jn.PublicKeyCompressed : jn.PublicKeyUncompressed), e.push(zt(_3(t.contents.data)));
      break;
    case Q.MessageSignature:
      e.push(t.pubKeyEncoding === we.Compressed ? jn.SignatureCompressed : jn.SignatureUncompressed), e.push(Ru(t.contents));
      break;
  }
  return Le(e);
}
function Ol(t) {
  return t.data.slice();
}
function Dl(t) {
  const e = pn(t, se) ? t : new se(t), n = e.readUInt8(), r = n === 4 ? Cx : Lx;
  return Gi(Le([n, e.readBytes(r)]));
}
function Gu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ee.P2PKH || e === ee.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ee.P2WPKH || e === ee.P2WSH || e === ee.P2WSHNonSequential) && !r.map((s) => s.data).every(Vi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ee.P2PKH:
      return ra(t, E3(r[0].data));
    case ee.P2WPKH:
      return ra(t, v3(r[0].data));
    case ee.P2SH:
    case ee.P2SHNonSequential:
      return ra(t, $3(n, r.map(Ol)));
    case ee.P2WSH:
    case ee.P2WSHNonSequential:
      return ra(t, I3(n, r.map(Ol)));
  }
}
function ra(t, e) {
  return { type: Q.Address, version: t, hash160: e };
}
function Vu(t) {
  return ni.c32address(t.version, t.hash160);
}
function Ud(t) {
  const [e, n, r] = t.split(/\.|::/);
  return GS(e, n, r);
}
function so(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return VS(e, n);
  } else
    return KS(t);
}
function t3(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return r3(e, n);
  } else
    return e3(t);
}
function e3(t) {
  const e = gs(t);
  return { type: Dt.PrincipalStandard, value: Vu(e) };
}
function n3(t) {
  return { type: Dt.PrincipalStandard, value: Vu(t) };
}
function r3(t, e) {
  const n = gs(t), r = Gn(e);
  return Sg(n, r);
}
function Sg(t, e) {
  if (Js(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Dt.PrincipalContract,
    value: `${Vu(t)}.${e.content}`
  };
}
function s3(t) {
  return { type: Dt.ResponseErr, value: t };
}
function i3(t) {
  return { type: Dt.ResponseOk, value: t };
}
const o3 = (t) => ({ type: Dt.StringASCII, value: t }), a3 = (t) => ({ type: Dt.StringUTF8, value: t });
function c3(t) {
  for (const e in t)
    if (!k3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Dt.Tuple, value: t };
}
function rr(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new se(zt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new se(t) : e = t;
  switch (e.readUInt8Enum(He, (r) => {
    throw new Je(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case He.int:
      return MS(hl(e.readBytes(16)));
    case He.uint:
      return NS(e.readBytes(16));
    case He.buffer:
      const r = e.readUInt32BE();
      return _S(e.readBytes(r));
    case He.true:
      return BS();
    case He.false:
      return TS();
    case He.address:
      const s = Ni(e);
      return n3(s);
    case He.contract:
      const i = Ni(e), o = Hn(e);
      return Sg(i, o);
    case He.ok:
      return i3(rr(e));
    case He.err:
      return s3(rr(e));
    case He.none:
      return hg();
    case He.some:
      return pg(rr(e));
    case He.list:
      const a = e.readUInt32BE(), c = [];
      for (let m = 0; m < a; m++)
        c.push(rr(e));
      return PS(c);
    case He.tuple:
      const u = e.readUInt32BE(), f = {};
      for (let m = 0; m < u; m++) {
        const L = Hn(e).content;
        if (L === void 0)
          throw new Je('"content" is undefined');
        f[L] = rr(e);
      }
      return c3(f);
    case He.ascii:
      const l = e.readUInt32BE(), g = ab(e.readBytes(l));
      return o3(g);
    case He.utf8:
      const h = e.readUInt32BE(), x = Bo(e.readBytes(h));
      return a3(x);
    default:
      throw new Je("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function ur(t, e) {
  return Le([Fu(t), e]);
}
function l3(t) {
  return new Uint8Array([Fu(t.type)]);
}
function u3(t) {
  return t.type === Dt.OptionalNone ? new Uint8Array([Fu(t.type)]) : ur(t.type, or(t.value));
}
function f3(t) {
  const e = new Uint8Array(4);
  return Ps(e, Math.ceil(t.value.length / 2), 0), ur(t.type, cr(e, zt(t.value)));
}
function d3(t) {
  const e = wu(nb(BigInt(t.value), BigInt(kx)), sg);
  return ur(t.type, e);
}
function h3(t) {
  const e = wu(BigInt(t.value), sg);
  return ur(t.type, e);
}
function p3(t) {
  return ur(t.type, Mo(gs(t.value)));
}
function g3(t) {
  const [e, n] = L3(t.value);
  return ur(t.type, cr(Mo(gs(e)), Pi(Gn(n))));
}
function y3(t) {
  return ur(t.type, or(t.value));
}
function w3(t) {
  const e = [], n = new Uint8Array(4);
  Ps(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = or(r);
    e.push(s);
  }
  return ur(t.type, Le(e));
}
function b3(t) {
  const e = [], n = new Uint8Array(4);
  Ps(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Gn(s);
    e.push(Pi(i));
    const o = or(t.value[s]);
    e.push(o);
  }
  return ur(t.type, Le(e));
}
function Ag(t, e) {
  const n = [], r = e == "ascii" ? ob(t.value) : Js(t.value), s = new Uint8Array(4);
  return Ps(s, r.length, 0), n.push(s), n.push(r), ur(t.type, Le(n));
}
function m3(t) {
  return Ag(t, "ascii");
}
function x3(t) {
  return Ag(t, "utf8");
}
function Od(t) {
  return dt(or(t));
}
function or(t) {
  switch (t.type) {
    case Dt.BoolTrue:
    case Dt.BoolFalse:
      return l3(t);
    case Dt.OptionalNone:
    case Dt.OptionalSome:
      return u3(t);
    case Dt.Buffer:
      return f3(t);
    case Dt.UInt:
      return h3(t);
    case Dt.Int:
      return d3(t);
    case Dt.PrincipalStandard:
      return p3(t);
    case Dt.PrincipalContract:
      return g3(t);
    case Dt.ResponseOk:
    case Dt.ResponseErr:
      return y3(t);
    case Dt.List:
      return w3(t);
    case Dt.Tuple:
      return b3(t);
    case Dt.StringASCII:
      return m3(t);
    case Dt.StringUTF8:
      return x3(t);
    default:
      throw new bi("Unable to serialize. Invalid Clarity Value.");
  }
}
const S3 = (t) => t.length % 2 ? `0${t}` : t, A3 = (t, e) => t.padEnd(e, "0"), Eg = (t, e) => t ? Js(t).length > e : !1;
function Fl(t) {
  return tg(t);
}
const bo = (t) => nS(Uu(t)), Ku = (t) => dt(CS(t)), E3 = (t) => dt(bo(t)), v3 = (t) => {
  const e = bo(t), n = cr(new Uint8Array([0]), new Uint8Array([e.length]), e), r = bo(n);
  return dt(r);
}, $3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Le(n), s = bo(r);
  return dt(s);
}, I3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Le(n), s = Uu(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Le(i), a = bo(o);
  return dt(a);
};
function k3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function L3(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Ae.hmacSha256Sync = (t, ...e) => {
  const n = cg.create(Uu, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Gi(t) {
  return t = typeof t == "string" ? zt(t) : t, {
    type: Q.PublicKey,
    data: t
  };
}
function C3(t, e, n = we.Compressed) {
  const r = fb(e), s = new En(Df(r.r), Df(r.s)), i = _t.fromSignature(t, s, r.recoveryId), o = n === we.Compressed;
  return i.toHex(o);
}
function B3(t) {
  return typeof t == "string" ? t : dt(t);
}
const Wu = B3;
function vg(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === ub;
}
function Vi(t) {
  return !Wu(t).startsWith("04");
}
function T3(t) {
  t = bu(t);
  const e = vg(t);
  return dt(To(t.slice(0, 32), e));
}
function _3(t) {
  return _t.fromHex(Wu(t)).toHex(!0);
}
function H3(t) {
  return _t.fromHex(Wu(t)).toHex(!1);
}
function M3(t, e) {
  t = bu(t);
  const [n, r] = Ja(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Co(r, 1) + En.fromHex(n).toCompactHex();
}
function Xu() {
  return {
    type: Q.MessageSignature,
    data: dt(new Uint8Array(lc))
  };
}
function $g(t, e, n, r) {
  const s = Gu(0, t, 1, [Gi(e)]).hash160, i = Vi(e) ? we.Compressed : we.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Ye(n),
    fee: Ye(r),
    keyEncoding: i,
    signature: Xu()
  };
}
function mo(t) {
  return "signature" in t;
}
function Dd(t) {
  return t === ee.P2SH || t === ee.P2WSH;
}
function N3(t) {
  return t === ee.P2SHNonSequential || t === ee.P2WSHNonSequential;
}
function Fd(t) {
  const e = Fl(t);
  return e.nonce = 0, e.fee = 0, mo(e) ? e.signature = Xu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function P3(t) {
  const e = [
    t.hashMode,
    zt(t.signer),
    hs(t.nonce, 8),
    hs(t.fee, 8),
    t.keyEncoding,
    Ru(t.signature)
  ];
  return Le(e);
}
function U3(t) {
  const e = [
    t.hashMode,
    zt(t.signer),
    hs(t.nonce, 8),
    hs(t.fee, 8)
  ], n = ju(t.fields);
  e.push(zu(n));
  const r = new Uint8Array(2);
  return hb(r, t.signaturesRequired, 0), e.push(r), Le(e);
}
function O3(t, e) {
  const n = dt(e.readBytes(20)), r = BigInt(`0x${dt(e.readBytes(8))}`), s = BigInt(`0x${dt(e.readBytes(8))}`), i = e.readUInt8Enum(we, (a) => {
    throw new Je(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ee.P2WPKH && i != we.Compressed)
    throw new Je("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Ul(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function D3(t, e) {
  const n = dt(e.readBytes(20)), r = BigInt("0x" + dt(e.readBytes(8))), s = BigInt("0x" + dt(e.readBytes(8))), i = bg(e, Q.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case Q.PublicKey:
        Vi(u.contents.data) || (o = !0);
        break;
      case Q.MessageSignature:
        if (u.pubKeyEncoding === we.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new ks("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ee.P2WSH || t === ee.P2WSHNonSequential))
    throw new ks("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function jc(t) {
  return mo(t) ? P3(t) : U3(t);
}
function zc(t) {
  const e = t.readUInt8Enum(ee, (n) => {
    throw new Je(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ee.P2PKH || e === ee.P2WPKH ? O3(e, t) : D3(e, t);
}
function Ig(t, e, n, r) {
  const i = t + dt(new Uint8Array([e])) + dt(hs(n, 8)) + dt(hs(r, 8));
  if (zt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Ku(zt(i));
}
function kg(t, e, n) {
  const r = 33 + lc, s = Vi(e.data) ? we.Compressed : we.Uncompressed, i = t + S3(s.toString(16)) + n, o = zt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Ku(o);
}
function F3(t, e, n, r, s) {
  const i = Ig(t, e, n, r), o = M3(s, i), a = Gi(T3(s)), c = kg(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Lg(t, e, n, r, s, i) {
  const o = Ig(t, e, n, r), a = Gi(C3(o, i, s)), c = kg(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function j3() {
  const t = $g(ee.P2PKH, "", 0, 0);
  return t.signer = US().hash160, t.keyEncoding = we.Compressed, t.signature = Xu(), t;
}
function jd(t, e, n) {
  return mo(t) ? z3(t, e, n) : R3(t, e, n);
}
function z3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Lg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Gu(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new ks(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function R3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case Q.PublicKey:
        Vi(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case Q.MessageSignature:
        c.pubKeyEncoding === we.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: f } = Lg(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Dd(t.hashMode) && (s = f), r.push(u), o += 1, o === 65536)
          throw new ks("Too many signatures");
        break;
    }
  if (Dd(t.hashMode) && o !== t.signaturesRequired || N3(t.hashMode) && o < t.signaturesRequired)
    throw new ks("Incorrect number of signatures");
  if (i && (t.hashMode === ee.P2WSH || t.hashMode === ee.P2WSHNonSequential))
    throw new ks("Uncompressed keys are not allowed in this hash mode");
  const a = Gu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new ks(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Cg(t) {
  return {
    authType: xe.Standard,
    spendingCondition: t
  };
}
function Bg(t, e) {
  return {
    authType: xe.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || $g(ee.P2PKH, "0".repeat(66), 0, 0)
  };
}
function zd(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case xe.Standard:
        return Cg(Fd(t.spendingCondition));
      case xe.Sponsored:
        return Bg(Fd(t.spendingCondition), j3());
      default:
        throw new Ua("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function G3(t, e) {
  switch (t.authType) {
    case xe.Standard:
      return jd(t.spendingCondition, e, xe.Standard);
    case xe.Sponsored:
      return jd(t.spendingCondition, e, xe.Standard);
    default:
      throw new Ua("Invalid origin auth type");
  }
}
function V3(t, e) {
  switch (t.authType) {
    case xe.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Ye(e)
      };
      return { ...t, spendingCondition: n };
    case xe.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Ye(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function K3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Ye(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function W3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Ye(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function X3(t, e) {
  const n = {
    ...e,
    nonce: Ye(e.nonce),
    fee: Ye(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function q3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case xe.Standard:
      e.push(jc(t.spendingCondition));
      break;
    case xe.Sponsored:
      e.push(jc(t.spendingCondition)), e.push(jc(t.sponsorSpendingCondition));
      break;
  }
  return Le(e);
}
function Y3(t) {
  const e = t.readUInt8Enum(xe, (r) => {
    throw new Je(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case xe.Standard:
      return n = zc(t), Cg(n);
    case xe.Sponsored:
      n = zc(t);
      const r = zc(t);
      return Bg(n, r);
  }
}
class Z3 {
  constructor({ auth: e, payload: n, postConditions: r = ju([]), postConditionMode: s = Pa.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = vx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Ye(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = bn.Any;
  }
  signBegin() {
    const e = Fl(this);
    return e.auth = zd(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Fl(this);
    return e.auth = zd(e.auth), e.txid();
  }
  verifyOrigin() {
    return G3(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, xe.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === xe.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, xe.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : Gi(e), r = this.auth.spendingCondition;
    if (r && !mo(r)) {
      const s = Vi(n.data);
      r.fields.push(mi(s ? we.Compressed : we.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = F3(n, r, e.fee, e.nonce, s);
    if (mo(e))
      e.signature = Nl(i);
    else {
      const a = vg(s);
      e.fields.push(mi(a ? we.Compressed : we.Uncompressed, Nl(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return Ku(e);
  }
  setSponsor(e) {
    if (this.auth.authType != xe.Sponsored)
      throw new Ua("Cannot sponsor sign a non-sponsored transaction");
    this.auth = X3(this.auth, e);
  }
  setFee(e) {
    this.auth = V3(this.auth, e);
  }
  setNonce(e) {
    this.auth = K3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != xe.Sponsored)
      throw new Ua("Cannot sponsor sign a non-sponsored transaction");
    this.auth = W3(this.auth, e);
  }
  serialize() {
    return dt(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new bi('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new bi('"chainId" is undefined');
    if (this.auth === void 0)
      throw new bi('"auth" is undefined');
    if (this.payload === void 0)
      throw new bi('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Ps(n, this.chainId, 0), e.push(n), e.push(q3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(zu(this.postConditions)), e.push(xg(this.payload)), Le(e);
  }
}
function Q3(t) {
  const e = pn(t, se) ? t : new se(t), n = e.readUInt8Enum(Vs, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = Y3(e), i = e.readUInt8Enum(bn, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(Pa, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = bg(e, Q.PostCondition), c = ZS(e), u = new Z3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const Rd = BigInt("18446744073709551615");
function Rc(t) {
  const e = Ye(t);
  if (e < 0n || e > Rd)
    throw new RangeError(`Post-condition amount must be between 0 and ${Rd} (u64 max), received: ${e}`);
  return e;
}
var jl;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(jl || (jl = {}));
var zl;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(zl || (zl = {}));
function J3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: Q.PostCondition,
        conditionType: fe.STX,
        principal: t.address === "origin" ? { type: Q.Principal, prefix: nn.Origin } : so(t.address),
        conditionCode: sa(t.condition),
        amount: Rc(t.amount)
      };
    case "ft-postcondition":
      return {
        type: Q.PostCondition,
        conditionType: fe.Fungible,
        principal: t.address === "origin" ? { type: Q.Principal, prefix: nn.Origin } : so(t.address),
        conditionCode: sa(t.condition),
        amount: Rc(t.amount),
        asset: Ud(t.asset)
      };
    case "nft-postcondition":
      return {
        type: Q.PostCondition,
        conditionType: fe.NonFungible,
        principal: t.address === "origin" ? { type: Q.Principal, prefix: nn.Origin } : so(t.address),
        conditionCode: sa(t.condition),
        asset: Ud(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: Q.PostCondition,
        conditionType: fe.Staking,
        principal: t.address === "origin" ? { type: Q.Principal, prefix: nn.Origin } : so(t.address),
        conditionCode: sa(t.condition),
        amount: Rc(t.amount)
      };
    case "pox-postcondition":
      return {
        type: Q.PostCondition,
        conditionType: fe.PoX,
        principal: t.address === "origin" ? { type: Q.Principal, prefix: nn.Origin } : so(t.address),
        conditionCode: t4(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function sa(t) {
  return jl[t];
}
function t4(t) {
  return zl[t];
}
function Tg(t) {
  const e = J3(t);
  return qS(e);
}
function e4(t, e, n) {
  return Yu(_g(t), n);
}
function _g(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = xo(r);
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
    return BigInt(`0x${s4(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function qu(t, e = 8) {
  return (typeof t == "bigint" ? t : _g(t)).toString(16).padStart(e * 2, "0");
}
function Yu(t, e = 16) {
  const n = qu(t, e);
  return xo(n);
}
function n4(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const r4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function s4(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += r4[n];
  return e;
}
function xo(t) {
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
function Zu(t) {
  return new TextEncoder().encode(t);
}
function i4(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function o4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Gd(t) {
  if (t.some(o4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Qu(...t) {
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
function $r(t) {
  return Qu(...t.map((e) => typeof e == "number" ? Gd([e]) : e instanceof Array ? Gd(e) : e));
}
function dc(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Rl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Rl || (Rl = {}));
Rl.Mainnet;
const a4 = 128, c4 = 128, Hg = 16;
var Gl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Gl || (Gl = {}));
var Vd;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Vd || (Vd = {}));
var Kd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Kd || (Kd = {}));
var Fn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Fn || (Fn = {}));
const Gc = ["onChainOnly", "offChainOnly", "any"];
Gc[0] + "", Fn.OnChainOnly, Gc[1] + "", Fn.OffChainOnly, Gc[2] + "", Fn.Any, Fn.OnChainOnly + "", Fn.OnChainOnly, Fn.OffChainOnly + "", Fn.OffChainOnly, Fn.Any + "", Fn.Any;
var Vl;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Vl || (Vl = {}));
Vl.Mainnet;
var Wd;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Wd || (Wd = {}));
var Es;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Es || (Es = {}));
var Xd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Xd || (Xd = {}));
var qd;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(qd || (qd = {}));
var Yd;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Yd || (Yd = {}));
var Zd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Zd || (Zd = {}));
var Qd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Qd || (Qd = {}));
var Jd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Jd || (Jd = {}));
var Kl;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Kl || (Kl = {}));
var th;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(th || (th = {}));
var eh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(eh || (eh = {}));
function Wl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function l4(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Mg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function u4(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Wl(t.outputLen), Wl(t.blockLen);
}
function f4(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function d4(t, e) {
  Mg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Vc = {
  number: Wl,
  bool: l4,
  bytes: Mg,
  hash: u4,
  exists: f4,
  output: d4
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Kc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Qn = (t, e) => t << 32 - e | t >>> e, h4 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!h4)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function p4(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ng(t) {
  if (typeof t == "string" && (t = p4(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let g4 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function si(t) {
  const e = (r) => t().update(Ng(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function y4(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Ju = class extends g4 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Kc(this.buffer);
  }
  update(e) {
    Vc.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ng(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Kc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Vc.exists(this), Vc.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    y4(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Kc(e), c = this.outputLen;
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
const w4 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Pg = Uint8Array.from({ length: 16 }, (t, e) => e), b4 = Pg.map((t) => (9 * t + 5) % 16);
let tf = [Pg], ef = [b4];
for (let t = 0; t < 4; t++)
  for (let e of [tf, ef])
    e.push(e[t].map((n) => w4[n]));
const Ug = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), m4 = tf.map((t, e) => t.map((n) => Ug[e][n])), x4 = ef.map((t, e) => t.map((n) => Ug[e][n])), S4 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), A4 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ia = (t, e) => t << e | t >>> 32 - e;
function nh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const oa = new Uint32Array(16);
let E4 = class extends Ju {
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
      oa[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, m = S4[h], L = A4[h], D = tf[h], O = ef[h], p = m4[h], k = x4[h];
      for (let I = 0; I < 16; I++) {
        const U = ia(r + nh(h, i, a, u) + oa[D[I]] + m, p[I]) + l | 0;
        r = l, l = u, u = ia(a, 10) | 0, a = i, i = U;
      }
      for (let I = 0; I < 16; I++) {
        const U = ia(s + nh(x, o, c, f) + oa[O[I]] + L, k[I]) + g | 0;
        s = g, g = f, f = ia(c, 10) | 0, c = o, o = U;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    oa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
si(() => new E4());
const v4 = (t, e, n) => t & e ^ ~t & n, $4 = (t, e, n) => t & e ^ t & n ^ e & n, I4 = new Uint32Array([
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
]), Xr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), qr = new Uint32Array(64);
let Og = class extends Ju {
  constructor() {
    super(64, 32, 8, !1), this.A = Xr[0] | 0, this.B = Xr[1] | 0, this.C = Xr[2] | 0, this.D = Xr[3] | 0, this.E = Xr[4] | 0, this.F = Xr[5] | 0, this.G = Xr[6] | 0, this.H = Xr[7] | 0;
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
      qr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = qr[l - 15], h = qr[l - 2], x = Qn(g, 7) ^ Qn(g, 18) ^ g >>> 3, m = Qn(h, 17) ^ Qn(h, 19) ^ h >>> 10;
      qr[l] = m + qr[l - 7] + x + qr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = Qn(a, 6) ^ Qn(a, 11) ^ Qn(a, 25), h = f + g + v4(a, c, u) + I4[l] + qr[l] | 0, m = (Qn(r, 2) ^ Qn(r, 13) ^ Qn(r, 22)) + $4(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    qr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, k4 = class extends Og {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
si(() => new Og());
si(() => new k4());
const aa = BigInt(2 ** 32 - 1), Xl = BigInt(32);
function Dg(t, e = !1) {
  return e ? { h: Number(t & aa), l: Number(t >> Xl & aa) } : { h: Number(t >> Xl & aa) | 0, l: Number(t & aa) | 0 };
}
function L4(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Dg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const C4 = (t, e) => BigInt(t >>> 0) << Xl | BigInt(e >>> 0), B4 = (t, e, n) => t >>> n, T4 = (t, e, n) => t << 32 - n | e >>> n, _4 = (t, e, n) => t >>> n | e << 32 - n, H4 = (t, e, n) => t << 32 - n | e >>> n, M4 = (t, e, n) => t << 64 - n | e >>> n - 32, N4 = (t, e, n) => t >>> n - 32 | e << 64 - n, P4 = (t, e) => e, U4 = (t, e) => t, O4 = (t, e, n) => t << n | e >>> 32 - n, D4 = (t, e, n) => e << n | t >>> 32 - n, F4 = (t, e, n) => e << n - 32 | t >>> 64 - n, j4 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function z4(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const R4 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), G4 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, V4 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), K4 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, W4 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), X4 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Ct = {
  fromBig: Dg,
  split: L4,
  toBig: C4,
  shrSH: B4,
  shrSL: T4,
  rotrSH: _4,
  rotrSL: H4,
  rotrBH: M4,
  rotrBL: N4,
  rotr32H: P4,
  rotr32L: U4,
  rotlSH: O4,
  rotlSL: D4,
  rotlBH: F4,
  rotlBL: j4,
  add: z4,
  add3L: R4,
  add3H: G4,
  add4L: V4,
  add4H: K4,
  add5H: X4,
  add5L: W4
}, [q4, Y4] = Ct.split([
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
let hc = class extends Ju {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: g, Gh: h, Gl: x, Hh: m, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, g, h, x, m, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, g, h, x, m, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = m | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Yr[p] = e.getUint32(n), Zr[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const k = Yr[p - 15] | 0, I = Zr[p - 15] | 0, U = Ct.rotrSH(k, I, 1) ^ Ct.rotrSH(k, I, 8) ^ Ct.shrSH(k, I, 7), V = Ct.rotrSL(k, I, 1) ^ Ct.rotrSL(k, I, 8) ^ Ct.shrSL(k, I, 7), F = Yr[p - 2] | 0, R = Zr[p - 2] | 0, A = Ct.rotrSH(F, R, 19) ^ Ct.rotrBH(F, R, 61) ^ Ct.shrSH(F, R, 6), T = Ct.rotrSL(F, R, 19) ^ Ct.rotrBL(F, R, 61) ^ Ct.shrSL(F, R, 6), M = Ct.add4L(V, T, Zr[p - 7], Zr[p - 16]), _ = Ct.add4H(M, U, A, Yr[p - 7], Yr[p - 16]);
      Yr[p] = _ | 0, Zr[p] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: x, Gh: m, Gl: L, Hh: D, Hl: O } = this;
    for (let p = 0; p < 80; p++) {
      const k = Ct.rotrSH(l, g, 14) ^ Ct.rotrSH(l, g, 18) ^ Ct.rotrBH(l, g, 41), I = Ct.rotrSL(l, g, 14) ^ Ct.rotrSL(l, g, 18) ^ Ct.rotrBL(l, g, 41), U = l & h ^ ~l & m, V = g & x ^ ~g & L, F = Ct.add5L(O, I, V, Y4[p], Zr[p]), R = Ct.add5H(F, D, k, U, q4[p], Yr[p]), A = F | 0, T = Ct.rotrSH(r, s, 28) ^ Ct.rotrBH(r, s, 34) ^ Ct.rotrBH(r, s, 39), M = Ct.rotrSL(r, s, 28) ^ Ct.rotrBL(r, s, 34) ^ Ct.rotrBL(r, s, 39), _ = r & i ^ r & a ^ i & a, nt = s & o ^ s & c ^ o & c;
      D = m | 0, O = L | 0, m = h | 0, L = x | 0, h = l | 0, x = g | 0, { h: l, l: g } = Ct.add(u | 0, f | 0, R | 0, A | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const G = Ct.add3L(A, M, nt);
      r = Ct.add3H(G, R, T, _), s = G | 0;
    }
    ({ h: r, l: s } = Ct.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ct.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ct.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Ct.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = Ct.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: x } = Ct.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: m, l: L } = Ct.add(this.Gh | 0, this.Gl | 0, m | 0, L | 0), { h: D, l: O } = Ct.add(this.Hh | 0, this.Hl | 0, D | 0, O | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, x, m, L, D, O);
  }
  roundClean() {
    Yr.fill(0), Zr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Z4 = class extends hc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Q4 = class extends hc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, J4 = class extends hc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
si(() => new hc());
si(() => new Z4());
si(() => new Q4());
si(() => new J4());
function tA(t, e, n) {
  const s = a4;
  if (yA(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Gl.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Pe;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Pe || (Pe = {}));
let eA = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Fg = class extends eA {
  constructor(e) {
    super(e);
  }
};
function pc(t) {
  const e = [];
  return e.push(xo(qu(t.version, 1))), e.push(xo(t.hash160)), $r(e);
}
function nA(t) {
  const e = [];
  return e.push(t.prefix), e.push(pc(t.address)), t.prefix === Kl.Contract && e.push(So(t.contractName)), $r(e);
}
function So(t) {
  const e = [], n = Zu(t.content), r = n.byteLength;
  return e.push(xo(qu(r, t.lengthPrefixBytes))), e.push(n), $r(e);
}
function rA(t) {
  const e = [];
  return e.push(pc(t.address)), e.push(So(t.contractName)), e.push(So(t.assetName)), $r(e);
}
function jg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(nA(t.principal)), (t.conditionType === Es.Fungible || t.conditionType === Es.NonFungible) && e.push(rA(t.assetInfo)), t.conditionType === Es.NonFungible && e.push(Ws(t.assetName)), e.push(t.conditionCode), t.conditionType === Es.STX || t.conditionType === Es.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Fg("The post-condition amount may not be larger than 8 bytes");
    e.push(e4(t.amount, !1, 8));
  }
  return $r(e);
}
function fr(t, e) {
  return $r([t, e]);
}
function sA(t) {
  return new Uint8Array([t.type]);
}
function iA(t) {
  return t.type === Pe.OptionalNone ? new Uint8Array([t.type]) : fr(t.type, Ws(t.value));
}
function oA(t) {
  const e = new Uint8Array(4);
  return dc(e, t.buffer.length, 0), fr(t.type, Qu(e, t.buffer));
}
function aA(t) {
  const e = Yu(n4(t.value, BigInt(c4)), Hg);
  return fr(t.type, e);
}
function cA(t) {
  const e = Yu(t.value, Hg);
  return fr(t.type, e);
}
function lA(t) {
  return fr(t.type, pc(t.address));
}
function uA(t) {
  return fr(t.type, Qu(pc(t.address), So(t.contractName)));
}
function fA(t) {
  return fr(t.type, Ws(t.value));
}
function dA(t) {
  const e = [], n = new Uint8Array(4);
  dc(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Ws(r);
    e.push(s);
  }
  return fr(t.type, $r(e));
}
function hA(t) {
  const e = [], n = new Uint8Array(4);
  dc(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = tA(s);
    e.push(So(i));
    const o = Ws(t.data[s]);
    e.push(o);
  }
  return fr(t.type, $r(e));
}
function zg(t, e) {
  const n = [], r = e == "ascii" ? i4(t.data) : Zu(t.data), s = new Uint8Array(4);
  return dc(s, r.length, 0), n.push(s), n.push(r), fr(t.type, $r(n));
}
function pA(t) {
  return zg(t, "ascii");
}
function gA(t) {
  return zg(t, "utf8");
}
function Ws(t) {
  switch (t.type) {
    case Pe.BoolTrue:
    case Pe.BoolFalse:
      return sA(t);
    case Pe.OptionalNone:
    case Pe.OptionalSome:
      return iA(t);
    case Pe.Buffer:
      return oA(t);
    case Pe.UInt:
      return cA(t);
    case Pe.Int:
      return aA(t);
    case Pe.PrincipalStandard:
      return lA(t);
    case Pe.PrincipalContract:
      return uA(t);
    case Pe.ResponseOk:
    case Pe.ResponseErr:
      return fA(t);
    case Pe.List:
      return dA(t);
    case Pe.Tuple:
      return hA(t);
    case Pe.StringASCII:
      return pA(t);
    case Pe.StringUTF8:
      return gA(t);
    default:
      throw new Fg("Unable to serialize. Invalid Clarity Value.");
  }
}
const yA = (t, e) => t ? Zu(t).length > e : !1, wA = "connect-ui";
let xa, Rg, mn = !1, ql = !1;
const Ar = (t, e = "") => () => {
}, bA = (t, e) => () => {
}, mA = "{visibility:hidden}.hydrated{visibility:inherit}", rh = {}, xA = "http://www.w3.org/2000/svg", SA = "http://www.w3.org/1999/xhtml", AA = (t) => t != null, nf = (t) => (t = typeof t, t === "object" || t === "function");
function Gg(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const vt = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let f = 0; f < u.length; f++)
      r = u[f], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !nf(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Yl(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((f) => u[f]).join(" "));
  }
  const c = Yl(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Yl = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, EA = {}, vA = (t) => t && t.$tag$ === EA, $A = (t, e) => t != null && !nf(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, IA = (t) => Ki(t).$hostElement$, kA = (t, e, n) => {
  const r = Xe.ce(e, n);
  return t.dispatchEvent(r), r;
}, sh = /* @__PURE__ */ new WeakMap(), LA = (t, e, n) => {
  let r = Oa.get(t);
  XA && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Oa.set(t, r);
}, CA = (t, e, n, r) => {
  var s;
  let i = Vg(e);
  const o = Oa.get(i);
  if (t = t.nodeType === 11 ? t : ar, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = sh.get(t), c;
      if (a || sh.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = ar.createElement("style"), c.innerHTML = o;
          const u = (s = Xe.$nonce$) !== null && s !== void 0 ? s : Gg(ar);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, BA = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Ar("attachStyles", e.$tagName$), i = CA(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, Vg = (t, e) => "sc-" + t.$tagName$, ih = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = ah(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = oh(n), f = oh(r);
      c.remove(...u.filter((l) => l && !f.includes(l))), c.add(...f.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : ah(gc, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Xe.rel(t, e, n, !1), r && Xe.ael(t, e, r, !1);
    else {
      const c = nf(r);
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
}, TA = /\s/, oh = (t) => t ? t.split(TA) : [], Kg = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || rh, o = e.$attrs$ || rh;
  for (r in i)
    r in o || ih(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    ih(s, r, i[r], o[r], n, e.$flags$);
}, rf = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = ar.createTextNode(s.$text$);
  else {
    if (mn || (mn = s.$tag$ === "svg"), o = s.$elm$ = ar.createElementNS(mn ? xA : SA, s.$tag$), mn && s.$tag$ === "foreignObject" && (mn = !1), Kg(null, s, mn), AA(xa) && o["s-si"] !== xa && o.classList.add(o["s-si"] = xa), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = rf(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? mn = !1 : o.tagName === "foreignObject" && (mn = !0);
  }
  return o;
}, Wg = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Rg && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = rf(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, Xg = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, _A = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, f = r[0], l = r[u], g;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : f == null ? f = r[++i] : l == null ? l = r[--u] : ca(a, f) ? (ao(a, f), a = e[++s], f = r[++i]) : ca(c, l) ? (ao(c, l), c = e[--o], l = r[--u]) : ca(a, l) ? (ao(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : ca(c, f) ? (ao(c, f), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], f = r[++i]) : (g = rf(e && e[i], n, i), f = r[++i], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  s > o ? Wg(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && Xg(e, s, o);
}, ca = (t, e) => t.$tag$ === e.$tag$, ao = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (mn = i === "svg" ? !0 : i === "foreignObject" ? !1 : mn, Kg(t, e, mn), r !== null && s !== null ? _A(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), Wg(n, null, e, s, 0, s.length - 1)) : r !== null && Xg(r, 0, r.length - 1), mn && i === "svg" && (mn = !1)) : t.$text$ !== o && (n.data = o);
}, HA = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Yl(null, null), s = vA(e) ? e : vt(null, null, e);
  Rg = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, xa = n["s-sc"], ao(r, s);
}, qg = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, sf = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return qg(t, t.$ancestorComponent$), YA(() => MA(t, e));
}, MA = (t, e) => {
  const n = Ar("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), OA(s, () => NA(t, r, e));
}, NA = async (t, e, n) => {
  const r = t.$hostElement$, s = Ar("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && BA(t);
  const o = Ar("render", t.$cmpMeta$.$tagName$);
  PA(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => UA(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, PA = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, HA(t, e);
  } catch (r) {
    Ao(r, t.$hostElement$);
  }
  return null;
}, UA = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Ar("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Zg(n), r(), t.$onReadyResolve$(n), s || Yg()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && af(() => sf(t, !1)), t.$flags$ &= -517;
}, Yg = (t) => {
  Zg(ar.documentElement), af(() => kA(gc, "appload", { detail: { namespace: wA } }));
}, OA = (t, e) => t && t.then ? t.then(e) : e(), Zg = (t) => t.classList.add("hydrated"), DA = (t, e) => Ki(t).$instanceValues$.get(e), FA = (t, e, n, r) => {
  const s = Ki(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = $A(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && sf(s, !1));
}, Qg = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return DA(this, i);
        },
        set(a) {
          FA(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        Xe.jmp(() => {
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
}, jA = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = WA(n), s.then) {
        const c = bA();
        s = await s, c();
      }
      s.isProxied || (Qg(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Ar("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        Ao(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = Vg(n);
      if (!Oa.has(c)) {
        const u = Ar("registerStyles", n.$tagName$);
        LA(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => sf(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, zA = (t) => {
  if (!(Xe.$flags$ & 1)) {
    const e = Ki(t), n = e.$cmpMeta$, r = Ar("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            qg(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), jA(t, e, n);
    }
    r();
  }
}, RA = (t) => {
  Xe.$flags$ & 1 || Ki(t);
}, GA = (t, e = {}) => {
  var n;
  const r = Ar(), s = [], i = e.exclude || [], o = gc.customElements, a = ar.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ ar.createElement("style"), f = [];
  let l, g = !0;
  Object.assign(Xe, e), Xe.$resourcesUrl$ = new URL(e.resourcesUrl || "./", ar.baseURI).href, t.map((h) => {
    h[1].map((x) => {
      const m = {
        $flags$: x[0],
        $tagName$: x[1],
        $members$: x[2],
        $listeners$: x[3]
      };
      m.$members$ = x[2];
      const L = m.$tagName$, D = class extends HTMLElement {
        // StencilLazyHost
        constructor(O) {
          super(O), O = this, KA(O, m), m.$flags$ & 1 && O.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? f.push(this) : Xe.jmp(() => zA(this));
        }
        disconnectedCallback() {
          Xe.jmp(() => RA(this));
        }
        componentOnReady() {
          return Ki(this).$onReadyPromise$;
        }
      };
      m.$lazyBundleId$ = h[0], !i.includes(L) && !o.get(L) && (s.push(L), o.define(L, Qg(
        D,
        m,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + mA, u.setAttribute("data-styles", "");
    const h = (n = Xe.$nonce$) !== null && n !== void 0 ? n : Gg(ar);
    h != null && u.setAttribute("nonce", h), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  g = !1, f.length ? f.map((h) => h.connectedCallback()) : Xe.jmp(() => l = setTimeout(Yg, 30)), r();
}, of = /* @__PURE__ */ new WeakMap(), Ki = (t) => of.get(t), VA = (t, e) => of.set(e.$lazyInstance$ = t, e), KA = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], of.set(t, n);
}, ah = (t, e) => e in t, Ao = (t, e) => (0, console.error)(t, e), Wc = /* @__PURE__ */ new Map(), WA = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Wc.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (Wc.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => _$).then(o, Ao);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Wc.set(s, o), o[r]), Ao);
}, Oa = /* @__PURE__ */ new Map(), gc = typeof window < "u" ? window : {}, ar = gc.document || { head: {} }, Xe = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Jg = (t) => Promise.resolve(t), XA = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), ch = [], ty = [], qA = (t, e) => (n) => {
  t.push(n), ql || (ql = !0, Xe.$flags$ & 4 ? af(Zl) : Xe.raf(Zl));
}, lh = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Ao(n);
    }
  t.length = 0;
}, Zl = () => {
  lh(ch), lh(ty), (ql = ch.length > 0) && Xe.raf(Zl);
}, af = (t) => Jg().then(t), YA = /* @__PURE__ */ qA(ty), ZA = () => Jg(), QA = (t, e) => typeof window > "u" ? Promise.resolve() : ZA().then(() => GA([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var JA = Object.defineProperty, tE = Object.defineProperties, eE = Object.getOwnPropertyDescriptors, Da = Object.getOwnPropertySymbols, ey = Object.prototype.hasOwnProperty, ny = Object.prototype.propertyIsEnumerable, uh = (t, e, n) => e in t ? JA(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, $n = (t, e) => {
  for (var n in e || (e = {})) ey.call(e, n) && uh(t, n, e[n]);
  if (Da) for (var n of Da(e)) ny.call(e, n) && uh(t, n, e[n]);
  return t;
}, Vn = (t, e) => tE(t, eE(e)), ry = (t, e) => {
  var n = {};
  for (var r in t) ey.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Da) for (var r of Da(t)) e.indexOf(r) < 0 && ny.call(t, r) && (n[r] = t[r]);
  return n;
};
function sy() {
  return cc(js()) || window.StacksProvider || window.BlockstackProvider;
}
function yc(t) {
  return t ? typeof t == "string" ? Rs.fromName(t) : "version" in t ? t : "url" in t ? new $l({ url: t.url }) : t.transactionVersion === Vs.Mainnet ? new $l({ url: t.client.baseUrl }) : new Il({ url: t.client.baseUrl }) : new Il();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var nE = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(nE || {}), rE = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(rE || {}), cf = (t) => {
  let e = t;
  if (!e) {
    let n = new S0(["store_write"], document.location.href);
    e = new vl({ appConfig: n });
  }
  return e;
};
function iy(t) {
  try {
    return cf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var oy = (t) => {
  let e = cf(t).loadUserData().appPrivateKey, n = ze.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function sE(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [Gs.Mainnet]: "mainnet", [Gs.Testnet]: "testnet" }, a = yc(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function iE(t) {
  let e = yc(t.network), n = cf(t.userSession), r = Vn($n({}, t), { network: e, userSession: n });
  return $n({ stxAddress: sE(r) }, r);
}
async function oE(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Tg) : n = n.map((r) => dt(jg(r)))), new ze.TokenSigner("ES256k", e).signAsync(Vn($n({}, t), { postConditions: n }));
}
function aE(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(Tg) : e = e.map((n) => dt(jg(n)))), ze.createUnsecuredToken(Vn($n({}, t), { postConditions: e }));
}
var cE = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = zt(a.replace(/^0x/, "")), u = Q3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Vn($n({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, Vn($n({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, lE = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = ry(e, ["amount", "appDetails", "userSession"]);
  if (iy(s)) {
    let { privateKey: a, publicKey: c } = oy(s), u = Vn($n({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), oE(u, a);
  }
  let o = Vn($n({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), aE(o);
};
async function uE(t, e, n) {
  let r = await e(Vn($n($n({}, iE(t)), t), { network: yc(t.network) }));
  return cE({ token: r, options: t }, n);
}
function fE(t, e = sy()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return uE(t, lE, e);
}
function ay(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Vn($n({}, t), { message: Od(e), domain: Od(n) }) : Vn($n({}, t), { message: dt(Ws(e)), domain: dt(Ws(n)) });
}
async function dE(t, e) {
  return new ze.TokenSigner("ES256k", e).signAsync(ay(t));
}
async function hE(t) {
  let e = t, { userSession: n } = e, r = ry(e, ["userSession"]);
  if (iy(n)) {
    let { privateKey: s, publicKey: i } = oy(n), o = Vn($n({}, r), { publicKey: i });
    return dE(o, s);
  }
  return ze.createUnsecuredToken(ay(t));
}
var pE = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(pE || {}), cy = "asigna-stx", fh = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === cy && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(yE(t, e), "*");
}), gE = { authenticationRequest: async (t) => fh(t, "authenticationRequest"), transactionRequest: async (t) => fh(t, "transactionRequest") }, yE = (t, e) => ({ source: cy, [e]: t }), wE = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = gE);
};
wE();
var bE = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function mE(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = js(), o = sy();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    QA();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : bE, c = ux(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = e;
    let f = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      u.remove(), document.body.style.overflow = f;
    };
    u.callback = (h) => {
      l(), t(n, h);
    }, u.cancelCallback = () => {
      var h;
      l(), (h = n.onCancel) == null || h.call(n);
    }, document.body.appendChild(u);
    let g = (h) => {
      h.key === "Escape" && (document.removeEventListener("keydown", g), u.remove());
    };
    document.addEventListener("keydown", g);
  };
}
var la = mE(fE);
function ps(t, e, n) {
  return lf(sn(t, e), n);
}
function sn(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = he(r);
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
      const r = AE(BigInt(`0x${Nt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Nt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function dh(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function No(t, e = 8) {
  return (typeof t == "bigint" ? t : sn(t, !1)).toString(16).padStart(e * 2, "0");
}
function wc(t) {
  return parseInt(t, 16);
}
function lf(t, e = 16) {
  const n = No(t, e);
  return he(n);
}
function xE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function SE(t, e) {
  return t & BigInt(1) << e;
}
function AE(t, e) {
  return SE(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const EE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Nt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += EE[n];
  return e;
}
function he(t) {
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
function Wi(t) {
  return new TextEncoder().encode(t);
}
function uf(t) {
  return new TextDecoder().decode(t);
}
function ly(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function vE(t) {
  return String.fromCharCode.apply(null, t);
}
function $E(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function hh(t) {
  if (t.some($E))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function bc(...t) {
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
function Ce(t) {
  return bc(...t.map((e) => typeof e == "number" ? hh([e]) : e instanceof Array ? hh(e) : e));
}
var ph;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ph || (ph = {}));
var gh;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(gh || (gh = {}));
var yh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(yh || (yh = {}));
const uy = 33, Xc = 32;
function IE(t) {
  if (t.length < Xc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Xc * 2), r = t.slice(2 + Xc * 2);
  return {
    recoveryId: wc(e),
    r: n,
    s: r
  };
}
function kE(t) {
  const e = typeof t == "string" ? he(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function LE(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function CE(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function BE(t, e) {
  return t[e];
}
function TE(t, e, n = 0) {
  return t[n] = e, t;
}
function _E(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Xs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Ql;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ql || (Ql = {}));
const HE = Ql.Mainnet, ME = 128, NE = 128, fy = 16, Hs = 32, Jl = 80, mc = 65, PE = 32, UE = 64, Fa = 34;
var at;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(at || (at = {}));
var Tt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Tt || (Tt = {}));
var tu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(tu || (tu = {}));
var fn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(fn || (fn = {}));
const Sa = ["onChainOnly", "offChainOnly", "any"], wh = {
  [Sa[0]]: fn.OnChainOnly,
  [Sa[1]]: fn.OffChainOnly,
  [Sa[2]]: fn.Any,
  [fn.OnChainOnly]: fn.OnChainOnly,
  [fn.OffChainOnly]: fn.OffChainOnly,
  [fn.Any]: fn.Any
};
function OE(t) {
  if (t in wh)
    return wh[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${Sa.join(", ")}`);
}
var ja;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ja || (ja = {}));
ja.Mainnet;
var Ui;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Ui || (Ui = {}));
var dn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(dn || (dn = {}));
var Se;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Se || (Se = {}));
var ne;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ne || (ne = {}));
var za;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(za || (za = {}));
var be;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(be || (be = {}));
var Eo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Eo || (Eo = {}));
var eu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(eu || (eu = {}));
var vo;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(vo || (vo = {}));
var bh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(bh || (bh = {}));
var mh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(mh || (mh = {}));
function nu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function DE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function dy(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function FE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  nu(t.outputLen), nu(t.blockLen);
}
function jE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function zE(t, e) {
  dy(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Cs = {
  number: nu,
  bool: DE,
  bytes: dy,
  hash: FE,
  exists: jE,
  output: zE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const qc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Jn = (t, e) => t << 32 - e | t >>> e, RE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!RE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function GE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function ff(t) {
  if (typeof t == "string" && (t = GE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let hy = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ii(t) {
  const e = (r) => t().update(ff(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function VE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class df extends hy {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = qc(this.buffer);
  }
  update(e) {
    Cs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = ff(e);
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
    Cs.exists(this), Cs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    VE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = qc(e), c = this.outputLen;
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
const KE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), py = Uint8Array.from({ length: 16 }, (t, e) => e), WE = py.map((t) => (9 * t + 5) % 16);
let hf = [py], pf = [WE];
for (let t = 0; t < 4; t++)
  for (let e of [hf, pf])
    e.push(e[t].map((n) => KE[n]));
const gy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), XE = hf.map((t, e) => t.map((n) => gy[e][n])), qE = pf.map((t, e) => t.map((n) => gy[e][n])), YE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), ZE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ua = (t, e) => t << e | t >>> 32 - e;
function xh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const fa = new Uint32Array(16);
class QE extends df {
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
      fa[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const x = 4 - h, m = YE[h], L = ZE[h], D = hf[h], O = pf[h], p = XE[h], k = qE[h];
      for (let I = 0; I < 16; I++) {
        const U = ua(r + xh(h, i, a, u) + fa[D[I]] + m, p[I]) + l | 0;
        r = l, l = u, u = ua(a, 10) | 0, a = i, i = U;
      }
      for (let I = 0; I < 16; I++) {
        const U = ua(s + xh(x, o, c, f) + fa[O[I]] + L, k[I]) + g | 0;
        s = g, g = f, f = ua(c, 10) | 0, c = o, o = U;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    fa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const JE = ii(() => new QE()), t8 = (t, e, n) => t & e ^ ~t & n, e8 = (t, e, n) => t & e ^ t & n ^ e & n, n8 = new Uint32Array([
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
]), Qr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Jr = new Uint32Array(64);
let yy = class extends df {
  constructor() {
    super(64, 32, 8, !1), this.A = Qr[0] | 0, this.B = Qr[1] | 0, this.C = Qr[2] | 0, this.D = Qr[3] | 0, this.E = Qr[4] | 0, this.F = Qr[5] | 0, this.G = Qr[6] | 0, this.H = Qr[7] | 0;
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
      Jr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Jr[l - 15], h = Jr[l - 2], x = Jn(g, 7) ^ Jn(g, 18) ^ g >>> 3, m = Jn(h, 17) ^ Jn(h, 19) ^ h >>> 10;
      Jr[l] = m + Jr[l - 7] + x + Jr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = Jn(a, 6) ^ Jn(a, 11) ^ Jn(a, 25), h = f + g + t8(a, c, u) + n8[l] + Jr[l] | 0, m = (Jn(r, 2) ^ Jn(r, 13) ^ Jn(r, 22)) + e8(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    Jr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
};
class r8 extends yy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const gf = ii(() => new yy());
ii(() => new r8());
const da = BigInt(2 ** 32 - 1), ru = BigInt(32);
function wy(t, e = !1) {
  return e ? { h: Number(t & da), l: Number(t >> ru & da) } : { h: Number(t >> ru & da) | 0, l: Number(t & da) | 0 };
}
function s8(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = wy(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const i8 = (t, e) => BigInt(t >>> 0) << ru | BigInt(e >>> 0), o8 = (t, e, n) => t >>> n, a8 = (t, e, n) => t << 32 - n | e >>> n, c8 = (t, e, n) => t >>> n | e << 32 - n, l8 = (t, e, n) => t << 32 - n | e >>> n, u8 = (t, e, n) => t << 64 - n | e >>> n - 32, f8 = (t, e, n) => t >>> n - 32 | e << 64 - n, d8 = (t, e) => e, h8 = (t, e) => t, p8 = (t, e, n) => t << n | e >>> 32 - n, g8 = (t, e, n) => e << n | t >>> 32 - n, y8 = (t, e, n) => e << n - 32 | t >>> 64 - n, w8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function b8(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const m8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), x8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, S8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), A8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, E8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), v8 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Bt = {
  fromBig: wy,
  split: s8,
  toBig: i8,
  shrSH: o8,
  shrSL: a8,
  rotrSH: c8,
  rotrSL: l8,
  rotrBH: u8,
  rotrBL: f8,
  rotr32H: d8,
  rotr32L: h8,
  rotlSH: p8,
  rotlSL: g8,
  rotlBH: y8,
  rotlBL: w8,
  add: b8,
  add3L: m8,
  add3H: x8,
  add4L: S8,
  add4H: A8,
  add5H: v8,
  add5L: E8
}, [$8, I8] = Bt.split([
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
].map((t) => BigInt(t))), ts = new Uint32Array(80), es = new Uint32Array(80);
class xc extends df {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: g, Gh: h, Gl: x, Hh: m, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, g, h, x, m, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, g, h, x, m, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = x | 0, this.Hh = m | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      ts[p] = e.getUint32(n), es[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const k = ts[p - 15] | 0, I = es[p - 15] | 0, U = Bt.rotrSH(k, I, 1) ^ Bt.rotrSH(k, I, 8) ^ Bt.shrSH(k, I, 7), V = Bt.rotrSL(k, I, 1) ^ Bt.rotrSL(k, I, 8) ^ Bt.shrSL(k, I, 7), F = ts[p - 2] | 0, R = es[p - 2] | 0, A = Bt.rotrSH(F, R, 19) ^ Bt.rotrBH(F, R, 61) ^ Bt.shrSH(F, R, 6), T = Bt.rotrSL(F, R, 19) ^ Bt.rotrBL(F, R, 61) ^ Bt.shrSL(F, R, 6), M = Bt.add4L(V, T, es[p - 7], es[p - 16]), _ = Bt.add4H(M, U, A, ts[p - 7], ts[p - 16]);
      ts[p] = _ | 0, es[p] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: g, Fh: h, Fl: x, Gh: m, Gl: L, Hh: D, Hl: O } = this;
    for (let p = 0; p < 80; p++) {
      const k = Bt.rotrSH(l, g, 14) ^ Bt.rotrSH(l, g, 18) ^ Bt.rotrBH(l, g, 41), I = Bt.rotrSL(l, g, 14) ^ Bt.rotrSL(l, g, 18) ^ Bt.rotrBL(l, g, 41), U = l & h ^ ~l & m, V = g & x ^ ~g & L, F = Bt.add5L(O, I, V, I8[p], es[p]), R = Bt.add5H(F, D, k, U, $8[p], ts[p]), A = F | 0, T = Bt.rotrSH(r, s, 28) ^ Bt.rotrBH(r, s, 34) ^ Bt.rotrBH(r, s, 39), M = Bt.rotrSL(r, s, 28) ^ Bt.rotrBL(r, s, 34) ^ Bt.rotrBL(r, s, 39), _ = r & i ^ r & a ^ i & a, nt = s & o ^ s & c ^ o & c;
      D = m | 0, O = L | 0, m = h | 0, L = x | 0, h = l | 0, x = g | 0, { h: l, l: g } = Bt.add(u | 0, f | 0, R | 0, A | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const G = Bt.add3L(A, M, nt);
      r = Bt.add3H(G, R, T, _), s = G | 0;
    }
    ({ h: r, l: s } = Bt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Bt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Bt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Bt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: g } = Bt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: x } = Bt.add(this.Fh | 0, this.Fl | 0, h | 0, x | 0), { h: m, l: L } = Bt.add(this.Gh | 0, this.Gl | 0, m | 0, L | 0), { h: D, l: O } = Bt.add(this.Hh | 0, this.Hl | 0, D | 0, O | 0), this.set(r, s, i, o, a, c, u, f, l, g, h, x, m, L, D, O);
  }
  roundClean() {
    ts.fill(0), es.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class k8 extends xc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class L8 extends xc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class C8 extends xc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
ii(() => new xc());
ii(() => new k8());
const B8 = ii(() => new L8());
ii(() => new C8());
function by(t) {
  if (he(t).byteLength != mc)
    throw Error("Invalid signature");
  return {
    type: at.MessageSignature,
    data: t
  };
}
function co(t, e) {
  return { type: at.Address, version: t, hash160: e };
}
function xi(t) {
  return ni.c32address(t.version, t.hash160);
}
function qs(t, e, n) {
  const r = e || 1, s = n || ME;
  if (Ny(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: at.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function yf(t) {
  const e = ni.c32addressDecode(t);
  return {
    type: at.Address,
    version: e[0],
    hash160: e[1]
  };
}
var W;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(W || (W = {}));
function T8(t) {
  if (t.type === W.PrincipalStandard)
    return xi(t.address);
  if (t.type === W.PrincipalContract)
    return `${xi(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function my(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return M8(e, n);
  } else
    return _8(t);
}
function _8(t) {
  const e = yf(t);
  return { type: W.PrincipalStandard, address: e };
}
function H8(t) {
  return { type: W.PrincipalStandard, address: t };
}
function M8(t, e) {
  const n = yf(t), r = qs(e);
  return xy(n, r);
}
function xy(t, e) {
  if (Wi(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: W.PrincipalContract, address: t, contractName: e };
}
function Yc(t, e = !1) {
  switch (t.type) {
    case W.BoolTrue:
      return !0;
    case W.BoolFalse:
      return !1;
    case W.Int:
    case W.UInt:
      return e ? t.value.toString() : t.value;
    case W.Buffer:
      return `0x${Nt(t.buffer)}`;
    case W.OptionalNone:
      return null;
    case W.OptionalSome:
      return sr(t.value);
    case W.ResponseErr:
      return sr(t.value);
    case W.ResponseOk:
      return sr(t.value);
    case W.PrincipalStandard:
    case W.PrincipalContract:
      return T8(t);
    case W.List:
      return t.list.map((r) => sr(r));
    case W.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = sr(t.data[r]);
      }), n;
    case W.StringASCII:
      return t.data;
    case W.StringUTF8:
      return t.data;
  }
}
function sr(t) {
  switch (t.type) {
    case W.ResponseErr:
      return { type: os(t), value: Yc(t, !0), success: !1 };
    case W.ResponseOk:
      return { type: os(t), value: Yc(t, !0), success: !0 };
    default:
      return { type: os(t), value: Yc(t, !0) };
  }
}
function os(t) {
  switch (t.type) {
    case W.BoolTrue:
    case W.BoolFalse:
      return "bool";
    case W.Int:
      return "int";
    case W.UInt:
      return "uint";
    case W.Buffer:
      return `(buff ${t.buffer.length})`;
    case W.OptionalNone:
      return "(optional none)";
    case W.OptionalSome:
      return `(optional ${os(t.value)})`;
    case W.ResponseErr:
      return `(response UnknownType ${os(t.value)})`;
    case W.ResponseOk:
      return `(response ${os(t.value)} UnknownType)`;
    case W.PrincipalStandard:
    case W.PrincipalContract:
      return "principal";
    case W.List:
      return `(list ${t.list.length} ${t.list.length ? os(t.list[0]) : "UnknownType"})`;
    case W.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${os(t.data[e])})`).join(" ")})`;
    case W.StringASCII:
      return `(string-ascii ${ly(t.data).length})`;
    case W.StringUTF8:
      return `(string-utf8 ${Wi(t.data).length})`;
  }
}
const Sy = () => ({ type: W.BoolTrue }), Ay = () => ({ type: W.BoolFalse }), N8 = (t) => t ? Sy() : Ay(), Sh = BigInt("0xffffffffffffffffffffffffffffffff"), P8 = BigInt(0), Ah = BigInt("0x7fffffffffffffffffffffffffffffff"), Eh = BigInt("-170141183460469231731687303715884105728"), U8 = (t) => {
  const e = sn(t, !0);
  if (e > Ah)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Ah}`);
  if (e < Eh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Eh}`);
  return { type: W.Int, value: e };
}, hn = (t) => {
  const e = sn(t, !1);
  if (e < P8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Sh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Sh}`);
  return { type: W.UInt, value: e };
}, Ey = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: W.Buffer, buffer: t };
};
function vy() {
  return { type: W.OptionalNone };
}
function $y(t) {
  return { type: W.OptionalSome, value: t };
}
function O8(t) {
  return { type: W.ResponseErr, value: t };
}
function D8(t) {
  return { type: W.ResponseOk, value: t };
}
function F8(t) {
  return { type: W.List, list: t };
}
function Er(t) {
  for (const e in t)
    if (!C5(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: W.Tuple, data: t };
}
const ye = (t) => ({ type: W.StringASCII, data: t }), j8 = (t) => ({ type: W.StringUTF8, data: t });
class Iy extends hy {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Cs.hash(e);
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
}
const ky = (t, e, n) => new Iy(t, e).update(n).digest();
ky.create = (t, e) => new Iy(t, e);
Ae.hmacSha256Sync = (t, ...e) => {
  const n = ky.create(gf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Oi(t) {
  return {
    type: at.PublicKey,
    data: he(t)
  };
}
function z8(t, e, n = be.Compressed) {
  const r = IE(e.data), s = new En(dh(r.r), dh(r.s)), i = _t.fromSignature(t, s, r.recoveryId), o = n === be.Compressed;
  return i.toHex(o);
}
function R8(t) {
  return { type: at.PublicKey, data: t };
}
function Xi(t) {
  return !Nt(t.data).startsWith("04");
}
function Ra(t) {
  return t.data.slice();
}
function G8(t) {
  const e = W8(t), n = To(e.data.slice(0, 32), e.compressed);
  return Oi(Nt(n));
}
function V8(t) {
  const e = typeof t == "string" ? t : Nt(t), n = _t.fromHex(e).toHex(!0);
  return Oi(n);
}
function K8(t) {
  const e = typeof t == "string" ? t : Nt(t), n = _t.fromHex(e).toHex(!1);
  return Oi(n);
}
function su(t) {
  const e = t.readUInt8(), n = e === 4 ? UE : PE;
  return R8(Ce([e, t.readBytes(n)]));
}
function W8(t) {
  const e = kE(t), n = e.length == uy;
  return { data: e, compressed: n };
}
function X8(t, e) {
  const [n, r] = Ja(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = No(r, 1) + En.fromHex(n).toCompactHex();
  return by(i);
}
function q8(t) {
  return G8(t.data);
}
function Y8(t, e, n) {
  return typeof t == "string" && (t = my(t)), typeof n == "string" && (n = Ih(n)), {
    type: at.Payload,
    payloadType: Tt.TokenTransfer,
    recipient: t,
    amount: sn(e, !1),
    memo: n ?? Ih("")
  };
}
function Z8(t, e, n, r) {
  return typeof t == "string" && (t = yf(t)), typeof e == "string" && (e = qs(e)), typeof n == "string" && (n = qs(n)), {
    type: at.Payload,
    payloadType: Tt.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function vh(t, e, n) {
  return typeof t == "string" && (t = qs(t)), typeof e == "string" && (e = o5(e)), typeof n == "number" ? {
    type: at.Payload,
    payloadType: Tt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: at.Payload,
    payloadType: Tt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function Q8() {
  return { type: at.Payload, payloadType: Tt.PoisonMicroblock };
}
function $h(t, e) {
  if (t.byteLength != Hs)
    throw Error(`Coinbase buffer size must be ${Hs} bytes`);
  return e != null ? {
    type: at.Payload,
    payloadType: Tt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: at.Payload,
    payloadType: Tt.Coinbase,
    coinbaseBytes: t
  };
}
function J8(t, e, n) {
  if (t.byteLength != Hs)
    throw Error(`Coinbase buffer size must be ${Hs} bytes`);
  if (n.byteLength != Jl)
    throw Error(`VRF proof buffer size must be ${Jl} bytes`);
  return {
    type: at.Payload,
    payloadType: Tt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === W.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var iu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(iu || (iu = {}));
function t5(t, e, n, r, s, i, o) {
  return {
    type: at.Payload,
    payloadType: Tt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Ly(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Tt.TokenTransfer:
      e.push(ke(t.recipient)), e.push(ps(t.amount, !1, 8)), e.push(wr(t.memo));
      break;
    case Tt.ContractCall:
      e.push(wr(t.contractAddress)), e.push(wr(t.contractName)), e.push(wr(t.functionName));
      const n = new Uint8Array(4);
      Xs(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(ke(r));
      });
      break;
    case Tt.SmartContract:
      e.push(wr(t.contractName)), e.push(wr(t.codeBody));
      break;
    case Tt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(wr(t.contractName)), e.push(wr(t.codeBody));
      break;
    case Tt.PoisonMicroblock:
      break;
    case Tt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Tt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(ke(t.recipient));
      break;
    case Tt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(ke(t.recipient ? $y(t.recipient) : vy())), e.push(t.vrfProof);
      break;
    case Tt.TenureChange:
      e.push(he(t.tenureHash)), e.push(he(t.previousTenureHash)), e.push(he(t.burnViewHash)), e.push(he(t.previousTenureEnd)), e.push(Xs(new Uint8Array(4), t.previousTenureBlocks)), e.push(TE(new Uint8Array(1), t.cause)), e.push(he(t.publicKeyHash));
      break;
  }
  return Ce(e);
}
function e5(t) {
  switch (t.readUInt8Enum(Tt, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Tt.TokenTransfer:
      const n = Nn(t), r = sn(t.readBytes(8), !1), s = By(t);
      return Y8(n, r, s);
    case Tt.ContractCall:
      const i = Di(t), o = Mn(t), a = Mn(t), c = [], u = t.readUInt32BE();
      for (let p = 0; p < u; p++) {
        const k = Nn(t);
        c.push(k);
      }
      return Z8(i, o, a, c);
    case Tt.SmartContract:
      const f = Mn(t), l = Mn(t, 4, 1e5);
      return vh(f, l);
    case Tt.VersionedSmartContract: {
      const p = t.readUInt8Enum(tu, (U) => {
        throw new Error(`Cannot recognize ClarityVersion: ${U}`);
      }), k = Mn(t), I = Mn(t, 4, 1e5);
      return vh(k, I, p);
    }
    case Tt.PoisonMicroblock:
      return Q8();
    case Tt.Coinbase: {
      const p = t.readBytes(Hs);
      return $h(p);
    }
    case Tt.CoinbaseToAltRecipient: {
      const p = t.readBytes(Hs), k = Nn(t);
      return $h(p, k);
    }
    case Tt.NakamotoCoinbase: {
      const p = t.readBytes(Hs), k = Nn(t), I = t.readBytes(Jl);
      return J8(p, k, I);
    }
    case Tt.TenureChange:
      const g = Nt(t.readBytes(20)), h = Nt(t.readBytes(20)), x = Nt(t.readBytes(20)), m = Nt(t.readBytes(32)), L = t.readUInt32BE(), D = t.readUInt8Enum(iu, (p) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${p}`);
      }), O = Nt(t.readBytes(20));
      return t5(g, h, x, m, L, D, O);
  }
}
class Sc extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class vs extends Sc {
  constructor(e) {
    super(e);
  }
}
class An extends Sc {
  constructor(e) {
    super(e);
  }
}
class Ga extends Sc {
  constructor(e) {
    super(e);
  }
}
class Bs extends Sc {
  constructor(e) {
    super(e);
  }
}
var zn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(zn || (zn = {}));
function ou(t) {
  return by(Nt(t.readBytes(mc)));
}
function Si(t, e) {
  return {
    pubKeyEncoding: t,
    type: at.TransactionAuthField,
    contents: e
  };
}
function n5(t) {
  const e = t.readUInt8Enum(zn, (n) => {
    throw new An(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case zn.PublicKeyCompressed:
      return Si(be.Compressed, su(t));
    case zn.PublicKeyUncompressed:
      return Si(be.Uncompressed, K8(su(t).data));
    case zn.SignatureCompressed:
      return Si(be.Compressed, ou(t));
    case zn.SignatureUncompressed:
      return Si(be.Uncompressed, ou(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function wf(t) {
  return he(t.data);
}
function r5(t) {
  const e = [];
  switch (t.contents.type) {
    case at.PublicKey:
      e.push(t.pubKeyEncoding === be.Compressed ? zn.PublicKeyCompressed : zn.PublicKeyUncompressed), e.push(Ra(V8(t.contents.data)));
      break;
    case at.MessageSignature:
      e.push(t.pubKeyEncoding === be.Compressed ? zn.SignatureCompressed : zn.SignatureUncompressed), e.push(wf(t.contents));
      break;
  }
  return Ce(e);
}
function wr(t) {
  switch (t.type) {
    case at.Address:
      return Po(t);
    case at.Principal:
      return Cy(t);
    case at.LengthPrefixedString:
      return Fi(t);
    case at.MemoString:
      return a5(t);
    case at.AssetInfo:
      return Ty(t);
    case at.PostCondition:
      return c5(t);
    case at.PublicKey:
      return Ra(t);
    case at.LengthPrefixedList:
      return xf(t);
    case at.Payload:
      return Ly(t);
    case at.TransactionAuthField:
      return r5(t);
    case at.MessageSignature:
      return wf(t);
  }
}
function s5() {
  return {
    type: at.Address,
    version: za.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function bf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ne.SerializeP2PKH || e === ne.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ne.SerializeP2WPKH || e === ne.SerializeP2WSH || e === ne.SerializeP2WSHNonSequential) && !r.every(Xi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ne.SerializeP2PKH:
      return co(t, $5(r[0].data));
    case ne.SerializeP2WPKH:
      return co(t, I5(r[0].data));
    case ne.SerializeP2SH:
    case ne.SerializeP2SHNonSequential:
      return co(t, k5(n, r.map(Ra)));
    case ne.SerializeP2WSH:
    case ne.SerializeP2WSHNonSequential:
      return co(t, L5(n, r.map(Ra)));
  }
}
function Po(t) {
  const e = [];
  return e.push(he(No(t.version, 1))), e.push(he(t.hash160)), Ce(e);
}
function Di(t) {
  const e = wc(Nt(t.readBytes(1))), n = Nt(t.readBytes(20));
  return { type: at.Address, version: e, hash160: n };
}
function Cy(t) {
  const e = [];
  return e.push(t.prefix), e.push(Po(t.address)), t.prefix === vo.Contract && e.push(Fi(t.contractName)), Ce(e);
}
function i5(t) {
  const e = t.readUInt8Enum(vo, (s) => {
    throw new An(`Unexpected Principal payload type: ${s}`);
  }), n = Di(t);
  if (e === vo.Standard)
    return { type: at.Principal, prefix: e, address: n };
  const r = Mn(t);
  return {
    type: at.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Fi(t) {
  const e = [], n = Wi(t.content), r = n.byteLength;
  return e.push(he(No(r, t.lengthPrefixBytes))), e.push(n), Ce(e);
}
function Mn(t, e, n) {
  e = e || 1;
  const r = wc(Nt(t.readBytes(e))), s = uf(t.readBytes(r));
  return qs(s, e, n ?? 128);
}
function o5(t) {
  return qs(t, 4, 1e5);
}
function Ih(t) {
  if (t && Ny(t, Fa))
    throw new Error(`Memo exceeds maximum length of ${Fa} bytes`);
  return { type: at.MemoString, content: t };
}
function a5(t) {
  const e = [], n = Wi(t.content), r = v5(Nt(n), Fa * 2);
  return e.push(he(r)), Ce(e);
}
function By(t) {
  let e = uf(t.readBytes(Fa));
  return e = e.replace(/\u0000*$/, ""), { type: at.MemoString, content: e };
}
function Ty(t) {
  const e = [];
  return e.push(Po(t.address)), e.push(Fi(t.contractName)), e.push(Fi(t.assetName)), Ce(e);
}
function au(t) {
  return {
    type: at.AssetInfo,
    address: Di(t),
    contractName: Mn(t),
    assetName: Mn(t)
  };
}
function mf(t, e) {
  return {
    type: at.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function xf(t) {
  const e = t.values, n = [];
  n.push(he(No(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(wr(r));
  return Ce(n);
}
function _y(t, e, n) {
  const r = wc(Nt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case at.Address:
        s.push(Di(t));
        break;
      case at.LengthPrefixedString:
        s.push(Mn(t));
        break;
      case at.MemoString:
        s.push(By(t));
        break;
      case at.AssetInfo:
        s.push(au(t));
        break;
      case at.PostCondition:
        s.push(l5(t));
        break;
      case at.PublicKey:
        s.push(su(t));
        break;
      case at.TransactionAuthField:
        s.push(n5(t));
        break;
    }
  return mf(s, n);
}
function c5(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Cy(t.principal)), (t.conditionType === dn.Fungible || t.conditionType === dn.NonFungible) && e.push(Ty(t.assetInfo)), t.conditionType === dn.NonFungible && e.push(ke(t.assetName)), e.push(t.conditionCode), t.conditionType === dn.STX || t.conditionType === dn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new vs("The post-condition amount may not be larger than 8 bytes");
    e.push(ps(t.amount, !1, 8));
  }
  return Ce(e);
}
function l5(t) {
  const e = t.readUInt8Enum(dn, (o) => {
    throw new An(`Could not read ${o} as PostConditionType`);
  }), n = i5(t);
  let r, s, i;
  switch (e) {
    case dn.STX:
      return r = t.readUInt8Enum(Eo, (a) => {
        throw new An(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Nt(t.readBytes(8))}`), {
        type: at.PostCondition,
        conditionType: dn.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case dn.Fungible:
      return s = au(t), r = t.readUInt8Enum(Eo, (a) => {
        throw new An(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Nt(t.readBytes(8))}`), {
        type: at.PostCondition,
        conditionType: dn.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case dn.NonFungible:
      s = au(t);
      const o = Nn(t);
      return r = t.readUInt8Enum(eu, (a) => {
        throw new An(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: at.PostCondition,
        conditionType: dn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function dr(t, e) {
  return Ce([t, e]);
}
function u5(t) {
  return new Uint8Array([t.type]);
}
function f5(t) {
  return t.type === W.OptionalNone ? new Uint8Array([t.type]) : dr(t.type, ke(t.value));
}
function d5(t) {
  const e = new Uint8Array(4);
  return Xs(e, t.buffer.length, 0), dr(t.type, bc(e, t.buffer));
}
function h5(t) {
  const e = lf(xE(t.value, BigInt(NE)), fy);
  return dr(t.type, e);
}
function p5(t) {
  const e = lf(t.value, fy);
  return dr(t.type, e);
}
function g5(t) {
  return dr(t.type, Po(t.address));
}
function y5(t) {
  return dr(t.type, bc(Po(t.address), Fi(t.contractName)));
}
function w5(t) {
  return dr(t.type, ke(t.value));
}
function b5(t) {
  const e = [], n = new Uint8Array(4);
  Xs(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = ke(r);
    e.push(s);
  }
  return dr(t.type, Ce(e));
}
function m5(t) {
  const e = [], n = new Uint8Array(4);
  Xs(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = qs(s);
    e.push(Fi(i));
    const o = ke(t.data[s]);
    e.push(o);
  }
  return dr(t.type, Ce(e));
}
function Hy(t, e) {
  const n = [], r = e == "ascii" ? ly(t.data) : Wi(t.data), s = new Uint8Array(4);
  return Xs(s, r.length, 0), n.push(s), n.push(r), dr(t.type, Ce(n));
}
function x5(t) {
  return Hy(t, "ascii");
}
function S5(t) {
  return Hy(t, "utf8");
}
function ke(t) {
  switch (t.type) {
    case W.BoolTrue:
    case W.BoolFalse:
      return u5(t);
    case W.OptionalNone:
    case W.OptionalSome:
      return f5(t);
    case W.Buffer:
      return d5(t);
    case W.UInt:
      return p5(t);
    case W.Int:
      return h5(t);
    case W.PrincipalStandard:
      return g5(t);
    case W.PrincipalContract:
      return y5(t);
    case W.ResponseOk:
    case W.ResponseErr:
      return w5(t);
    case W.List:
      return b5(t);
    case W.Tuple:
      return m5(t);
    case W.StringASCII:
      return x5(t);
    case W.StringUTF8:
      return S5(t);
    default:
      throw new vs("Unable to serialize. Invalid Clarity Value.");
  }
}
function A5(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const kh = /* @__PURE__ */ new Map();
function My(t, e) {
  const n = kh.get(t);
  if (n !== void 0)
    return n(e);
  const r = A5(t);
  return kh.set(t, r), My(t, e);
}
class po {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return _E(this.readBytes(4), 0);
  }
  readUInt8() {
    return BE(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return LE(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = Nt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Nt(n);
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
    if (My(e, r))
      return r;
    throw n(r);
  }
}
function Nn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new po(he(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new po(t) : e = t;
  switch (e.readUInt8Enum(W, (r) => {
    throw new An(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case W.Int:
      return U8(e.readBytes(16));
    case W.UInt:
      return hn(e.readBytes(16));
    case W.Buffer:
      const r = e.readUInt32BE();
      return Ey(e.readBytes(r));
    case W.BoolTrue:
      return Sy();
    case W.BoolFalse:
      return Ay();
    case W.PrincipalStandard:
      const s = Di(e);
      return H8(s);
    case W.PrincipalContract:
      const i = Di(e), o = Mn(e);
      return xy(i, o);
    case W.ResponseOk:
      return D8(Nn(e));
    case W.ResponseErr:
      return O8(Nn(e));
    case W.OptionalNone:
      return vy();
    case W.OptionalSome:
      return $y(Nn(e));
    case W.List:
      const a = e.readUInt32BE(), c = [];
      for (let m = 0; m < a; m++)
        c.push(Nn(e));
      return F8(c);
    case W.Tuple:
      const u = e.readUInt32BE(), f = {};
      for (let m = 0; m < u; m++) {
        const L = Mn(e).content;
        if (L === void 0)
          throw new An('"content" is undefined');
        f[L] = Nn(e);
      }
      return Er(f);
    case W.StringASCII:
      const l = e.readUInt32BE(), g = vE(e.readBytes(l));
      return ye(g);
    case W.StringUTF8:
      const h = e.readUInt32BE(), x = uf(e.readBytes(h));
      return j8(x);
    default:
      throw new An("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const E5 = (t) => t.length % 2 == 0 ? t : `0${t}`, v5 = (t, e) => t.padEnd(e, "0"), Ny = (t, e) => t ? Wi(t).length > e : !1;
function cu(t) {
  return tg(t);
}
const $o = (t) => JE(gf(t)), Sf = (t) => Nt(B8(t)), $5 = (t) => Nt($o(t)), I5 = (t) => {
  const e = $o(t), n = bc(new Uint8Array([0]), new Uint8Array([e.length]), e), r = $o(n);
  return Nt(r);
}, k5 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Ce(n), s = $o(r);
  return Nt(s);
}, L5 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ce(n), s = gf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Ce(i), a = $o(o);
  return Nt(a);
};
function C5(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Py(t) {
  const e = ke(t);
  return `0x${Nt(e)}`;
}
function B5(t) {
  return Nn(t);
}
const Ei = (t) => {
  try {
    return ni.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Af() {
  return {
    type: at.MessageSignature,
    data: Nt(new Uint8Array(mc))
  };
}
function Uy(t, e, n, r) {
  const s = bf(0, t, 1, [Oi(e)]).hash160, i = Xi(Oi(e)) ? be.Compressed : be.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: sn(n, !1),
    fee: sn(r, !1),
    keyEncoding: i,
    signature: Af()
  };
}
function Io(t) {
  return "signature" in t;
}
function Lh(t) {
  return t === ne.SerializeP2SH || t === ne.SerializeP2WSH;
}
function T5(t) {
  return t === ne.SerializeP2SHNonSequential || t === ne.SerializeP2WSHNonSequential;
}
function Ch(t) {
  const e = cu(t);
  return e.nonce = 0, e.fee = 0, Io(e) ? e.signature = Af() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function _5(t) {
  const e = [
    t.hashMode,
    he(t.signer),
    ps(t.nonce, !1, 8),
    ps(t.fee, !1, 8),
    t.keyEncoding,
    wf(t.signature)
  ];
  return Ce(e);
}
function H5(t) {
  const e = [
    t.hashMode,
    he(t.signer),
    ps(t.nonce, !1, 8),
    ps(t.fee, !1, 8)
  ], n = mf(t.fields);
  e.push(xf(n));
  const r = new Uint8Array(2);
  return CE(r, t.signaturesRequired, 0), e.push(r), Ce(e);
}
function M5(t, e) {
  const n = Nt(e.readBytes(20)), r = BigInt(`0x${Nt(e.readBytes(8))}`), s = BigInt(`0x${Nt(e.readBytes(8))}`), i = e.readUInt8Enum(be, (a) => {
    throw new An(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ne.SerializeP2WPKH && i != be.Compressed)
    throw new An("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = ou(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function N5(t, e) {
  const n = Nt(e.readBytes(20)), r = BigInt("0x" + Nt(e.readBytes(8))), s = BigInt("0x" + Nt(e.readBytes(8))), i = _y(e, at.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case at.PublicKey:
        Xi(u.contents) || (o = !0);
        break;
      case at.MessageSignature:
        if (u.pubKeyEncoding === be.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Bs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ne.SerializeP2WSH || t === ne.SerializeP2WSHNonSequential))
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
function Zc(t) {
  return Io(t) ? _5(t) : H5(t);
}
function Qc(t) {
  const e = t.readUInt8Enum(ne, (n) => {
    throw new An(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ne.SerializeP2PKH || e === ne.SerializeP2WPKH ? M5(e, t) : N5(e, t);
}
function Oy(t, e, n, r) {
  const i = t + Nt(new Uint8Array([e])) + Nt(ps(n, !1, 8)) + Nt(ps(r, !1, 8));
  if (he(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Sf(he(i));
}
function Dy(t, e, n) {
  const r = 33 + mc, s = Xi(e) ? be.Compressed : be.Uncompressed, i = t + E5(s.toString(16)) + n.data, o = he(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Sf(o);
}
function P5(t, e, n, r, s) {
  const i = Oy(t, e, n, r), o = X8(s, i), a = q8(s), c = Dy(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Fy(t, e, n, r, s, i) {
  const o = Oy(t, e, n, r), a = Oi(z8(o, i, s)), c = Dy(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function U5() {
  const t = Uy(ne.SerializeP2PKH, "", 0, 0);
  return t.signer = s5().hash160, t.keyEncoding = be.Compressed, t.signature = Af(), t;
}
function Bh(t, e, n) {
  return Io(t) ? O5(t, e, n) : D5(t, e, n);
}
function O5(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Fy(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = bf(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Bs(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function D5(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case at.PublicKey:
        Xi(c.contents) || (i = !0), r.push(c.contents);
        break;
      case at.MessageSignature:
        c.pubKeyEncoding === be.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: f } = Fy(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Lh(t.hashMode) && (s = f), r.push(u), o += 1, o === 65536)
          throw new Bs("Too many signatures");
        break;
    }
  if (Lh(t.hashMode) && o !== t.signaturesRequired || T5(t.hashMode) && o < t.signaturesRequired)
    throw new Bs("Incorrect number of signatures");
  if (i && (t.hashMode === ne.SerializeP2WSH || t.hashMode === ne.SerializeP2WSHNonSequential))
    throw new Bs("Uncompressed keys are not allowed in this hash mode");
  const a = bf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Bs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function jy(t) {
  return {
    authType: Se.Standard,
    spendingCondition: t
  };
}
function zy(t, e) {
  return {
    authType: Se.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Uy(ne.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Th(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Se.Standard:
        return jy(Ch(t.spendingCondition));
      case Se.Sponsored:
        return zy(Ch(t.spendingCondition), U5());
      default:
        throw new Ga("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function F5(t, e) {
  switch (t.authType) {
    case Se.Standard:
      return Bh(t.spendingCondition, e, Se.Standard);
    case Se.Sponsored:
      return Bh(t.spendingCondition, e, Se.Standard);
    default:
      throw new Ga("Invalid origin auth type");
  }
}
function j5(t, e) {
  switch (t.authType) {
    case Se.Standard:
      const n = {
        ...t.spendingCondition,
        fee: sn(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Se.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: sn(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function z5(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: sn(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function R5(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: sn(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function G5(t, e) {
  const n = {
    ...e,
    nonce: sn(e.nonce, !1),
    fee: sn(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function V5(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Se.Standard:
      e.push(Zc(t.spendingCondition));
      break;
    case Se.Sponsored:
      e.push(Zc(t.spendingCondition)), e.push(Zc(t.sponsorSpendingCondition));
      break;
  }
  return Ce(e);
}
function K5(t) {
  const e = t.readUInt8Enum(Se, (r) => {
    throw new An(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Se.Standard:
      return n = Qc(t), jy(n);
    case Se.Sponsored:
      n = Qc(t);
      const r = Qc(t);
      return zy(n, r);
  }
}
class W5 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: sn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? HE, this.postConditionMode = i ?? Ui.Deny, this.postConditions = s ?? mf([]), o)
      this.anchorMode = OE(o);
    else
      switch (r.payloadType) {
        case Tt.Coinbase:
        case Tt.CoinbaseToAltRecipient:
        case Tt.NakamotoCoinbase:
        case Tt.PoisonMicroblock:
        case Tt.TenureChange:
          this.anchorMode = fn.OnChainOnly;
          break;
        case Tt.ContractCall:
        case Tt.SmartContract:
        case Tt.VersionedSmartContract:
        case Tt.TokenTransfer:
          this.anchorMode = fn.Any;
          break;
      }
  }
  signBegin() {
    const e = cu(this);
    return e.auth = Th(e.auth), e.txid();
  }
  verifyBegin() {
    const e = cu(this);
    return e.auth = Th(e.auth), e.txid();
  }
  verifyOrigin() {
    return F5(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Se.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Se.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Se.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !Io(n)) {
      const r = Xi(e);
      n.fields.push(Si(r ? be.Compressed : be.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = P5(n, r, e.fee, e.nonce, s);
    return Io(e) ? e.signature = i : e.fields.push(Si(s.data.byteLength === uy ? be.Compressed : be.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return Sf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Se.Sponsored)
      throw new Ga("Cannot sponsor sign a non-sponsored transaction");
    this.auth = G5(this.auth, e);
  }
  setFee(e) {
    this.auth = j5(this.auth, e);
  }
  setNonce(e) {
    this.auth = z5(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Se.Sponsored)
      throw new Ga("Cannot sponsor sign a non-sponsored transaction");
    this.auth = R5(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new vs('"version" is undefined');
    if (this.chainId === void 0)
      throw new vs('"chainId" is undefined');
    if (this.auth === void 0)
      throw new vs('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new vs('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new vs('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return Xs(n, this.chainId, 0), e.push(n), e.push(V5(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(xf(this.postConditions)), e.push(Ly(this.payload)), Ce(e);
  }
}
function Va(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new po(he(t.slice(2))) : e = new po(he(t)) : t instanceof Uint8Array ? e = new po(t) : e = t;
  const n = e.readUInt8Enum(ja, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = K5(e), i = e.readUInt8Enum(fn, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(Ui, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = _y(e, at.PostCondition), c = e5(e);
  return new W5(n, s, c, a, o, i, r);
}
const X5 = N8, go = hn, q5 = Ey;
const Y5 = /* @__PURE__ */ new Set([4001, -31001]), Z5 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], Q5 = ["result", "data", "payload", "response", "params"], _h = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Ac = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), oi = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, xr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, J5 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Ry = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => J5(i, r)) === s
  );
}, Gy = (t) => t ? Ry(oi()).some(
  (e) => {
    var n;
    return e.id === t && (Ac(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Vy = () => {
  if (typeof window > "u")
    return;
  const t = oi(), e = Ry(t).filter(
    (n) => {
      var r;
      return Ac(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = xr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of Z5) {
    const r = xr(t, n) ?? (t === window ? void 0 : xr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, t6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = oi(), n = xr(e, t) ?? (e === window ? void 0 : xr(window, t)) ?? cc(t);
  if (n)
    return n;
  if (Ac(t) || Gy(t))
    return Vy();
}, ha = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, e6 = ["blockstack-session", "blockstack"], n6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of e6) {
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
n6();
const Ky = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, xn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, r6 = (t) => {
  const e = xn(t);
  if (!e)
    return null;
  const n = Ky(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, s6 = (t) => {
  const e = xn(t);
  if (!e)
    return null;
  const n = Ky(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, lu = (t, e = "mainnet") => {
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
      return lu(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return lu(r, e);
  }
  return e;
}, Ms = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, ko = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return Ei(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = ko(s, e + 1);
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
    const i = ko(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && Ei(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Ei(n.testnet) ? n.testnet.trim() : null;
}, Hh = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Wy = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && Y5.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Ys = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = xn(n == null ? void 0 : n.message) ?? xn(e.message) ?? xn(e.error) ?? xn(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, ji = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Ys(e);
    if (e.status === "error")
      throw Ys(e.result ?? e);
  }
  return t;
}, Mh = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return ji(r);
  } catch (r) {
    throw Ys(r);
  }
}, Xy = () => Vy(), Ef = () => {
  if (typeof window > "u")
    return;
  const t = oi();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = xr(t, e) ?? (t === window ? void 0 : xr(window, e));
    if (n)
      return n;
  }
}, Nh = () => {
  if (typeof window > "u")
    return;
  const t = Ef();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = oi();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = xr(e, n) ?? (e === window ? void 0 : xr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Aa = (t) => {
  var r, s;
  const e = js();
  if (Ac(e) || Gy(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = oi() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Xy();
}, Jc = (t) => {
  const e = s6(t);
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
  const n = Jc(t), r = r6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? xn(t) ?? void 0 : void 0
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
  for (const a of _h)
    if (Jc(s[a])) {
      i = xn(s[a]);
      break;
    }
  const o = xn(s.txId) || xn(s.txid) || xn(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? xn(s.txRaw) ?? void 0
    };
  for (const a of _h) {
    const c = Jc(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: xn(s[a]) ?? void 0
      };
  }
  for (const a of Q5) {
    const c = s[a], u = Ka(c, e + 1);
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
}, tl = (t) => {
  const e = Ka(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, i6 = (t) => {
  const e = Ka(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, o6 = (t) => ({
  ...t,
  fee: Ms(t.fee),
  nonce: Ms(t.nonce),
  sponsored: t.sponsored === !0
}), Ph = (t) => ({
  recipient: t.recipient,
  amount: Ms(t.amount) ?? "0",
  memo: t.memo,
  network: lu(t.network),
  address: t.stxAddress,
  fee: Ms(t.fee),
  nonce: Ms(t.nonce),
  sponsored: t.sponsored ?? !1
}), qy = "WALLET_ADDRESS_MISMATCH", a6 = 45e3;
let yo = null;
const uu = (t) => {
  t && (yo = { address: t, at: Date.now() });
}, c6 = () => {
  yo = null;
}, l6 = () => yo && Date.now() - yo.at <= a6 ? yo.address : null, u6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, f6 = async (t) => {
  c6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = ji(await t.request("wallet_connect")), n = ko(e);
  return uu(n), n;
}, d6 = async (t, e, n, r) => {
  try {
    return ji(await t.request(e, n));
  } catch (s) {
    const i = Ys(s);
    if (!u6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await f6(t);
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
        { code: o ? qy : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return ji(await t.request(e, n));
    } catch (a) {
      throw Ys(a);
    }
  }
};
let Uh = 3e4;
const h6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${Uh / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Uh);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, p6 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: qy }
      );
    return c;
  }, s = l6();
  if (s)
    return ha(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  ha(n, "account-read");
  try {
    const c = ji(
      await h6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = ko(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Wy(c))
      throw Ys(c);
    ha(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return uu(i), r(i, "wallet_getAccount");
  let o;
  ha(n, "account-reconnect");
  try {
    o = ji(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Ys(c);
  }
  const a = ko(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return uu(a), r(a, "wallet_connect");
}, g6 = async (t, e) => {
  if (!Aa(t)) {
    const i = await Mh(
      t,
      "stx_transferStx",
      Ph(e)
    );
    return tl(i);
  }
  const n = Ef();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await Mh(
      n,
      "stx_transferStx",
      Ph(e)
    );
    return tl(i);
  }
  const r = Xy();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await p6(r, e.stxAddress);
  const s = await d6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: Ms(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: Ms(e.fee) } : {}
    },
    e.stxAddress
  );
  return tl(s);
}, y6 = () => js(), Yy = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = js(), e = t ? t6(t) : void 0;
  if (e)
    return e;
  const n = oi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Oh = (t, e) => {
  const n = Yy(), r = o6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, i6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return la(r, e);
  if (Aa(n) && !Ef()) {
    const s = Nh();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: js(),
        route: "legacy-transaction-request"
      }), la(r, s);
  }
  return void g6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (Hh(s) && Aa(n)) {
      const a = Nh();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: js(),
          route: "legacy-transaction-request"
        }), la(r, a);
        return;
      }
    }
    if (Hh(s) && !Aa(n)) {
      la(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Wy(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Dh = (t) => Py(t).replace(/^0x/, ""), Fh = "This wallet cannot sign messages. Try Xverse or Leather.", jh = (t) => typeof (t == null ? void 0 : t.request) == "function", zh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", w6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, b6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function m6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Dh(e.message),
    domain: Dh(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function x6(t, e) {
  const n = await hE({
    domain: e.domain,
    message: e.message,
    network: yc(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Rh(t) {
  var s, i;
  const e = y6() || "", n = /xverse/i.test(e);
  let r = Yy();
  if (n && !zh(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (zh(r))
    try {
      return await x6(r, t);
    } catch (o) {
      if (n || !jh(r) || !b6(o)) throw o;
    }
  if (!n && jh(r))
    try {
      return await m6(r, t);
    } catch (o) {
      throw w6(o) ? new Error(Fh) : o;
    }
  throw new Error(Fh);
}
const Gh = 1000000n, Ts = 1000000n, Wa = 50n, qe = 3000n, ys = 300n, io = 3000n, S6 = 50000n, el = 200n, Ec = 15000n, Pn = (t) => t + Wa;
function On(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / Gh}.${(n % Gh).toString().padStart(6, "0")}`;
}
function Vh(t, e = ys) {
  return t <= qe ? 0 : Number((t - qe) / Pn(e));
}
function nl(t, e = 0n) {
  const n = Ts - t - e;
  return n > 0n ? n : 0n;
}
function A6(t, e = ys) {
  return t > Ts ? "over" : t < qe + Pn(e) ? "empty" : t < S6 ? "low" : "ok";
}
const E6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", v6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", $6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function I6(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || $6.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== E6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Zy = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", rl = 3, k6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [fu, Qy] = Zy.split("."), Tn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function du(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function L6(t) {
  return Tn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function ds(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Jy(t, e = []) {
  const n = await ds(`/v2/contracts/call-read/${fu}/${Qy}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: fu, arguments: e.map((r) => "0x" + Tn(ke(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return sr(Nn(n.result));
}
async function C6() {
  const t = await ds(`/v2/contracts/source/${fu}/${Qy}?proof=0`);
  if (typeof t.source != "string" || await L6(t.source) !== v6) throw Error("Deployed source does not match the tested helper.");
  if (I6(await Jy("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function tw(t) {
  return t.startsWith("SP") && Ei(t) && !t.includes(".");
}
async function B6(t) {
  var r;
  if (!tw(t)) throw Error("Invalid mainnet wallet address.");
  const e = await ds(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await ds(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function T6(t) {
  const e = await ds(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function _6(t, e) {
  var s, i;
  const n = await Jy("get-owner", [go(t), go(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !tw(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function H6(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: du(t), signal: AbortSignal.timeout(15e3) });
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
async function M6(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function N6(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Va(du(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || xi(co(za.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || xi(r.contractAddress) + "." + r.contractName.content !== Zy || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Tn(ke(r.functionArgs[0])) !== Tn(ke(go(t.core))) || Tn(ke(r.functionArgs[1])) !== Tn(ke(go(t.song))) || Tn(ke(r.functionArgs[2])) !== Tn(ke(q5(du(t.id)))) || t.amount !== "50" || e.postConditionMode !== Ui.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== Eo.Equal || i.principal.prefix !== 2 || xi(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || xi(r.contractAddress) + "." + r.contractName.content !== k6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Tn(ke(r.functionArgs[0])) !== Tn(ke(go(t.song))) || typeof t.liked != "boolean" || Tn(ke(r.functionArgs[1])) !== Tn(ke(X5(t.liked))) || t.amount !== "0" || e.postConditionMode !== Ui.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || sr(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function P6(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function vc(t, ...e) {
  if (!P6(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function Kh(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function U6(t, e) {
  vc(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function hu(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function sl(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function tr(t, e) {
  return t << 32 - e | t >>> e;
}
const O6 = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", D6 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function F6(t) {
  if (vc(t), O6)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += D6[t[n]];
  return e;
}
function j6(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function ew(t) {
  return typeof t == "string" && (t = j6(t)), vc(t), t;
}
class z6 {
}
function R6(t) {
  const e = (r) => t().update(ew(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function G6(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function V6(t, e, n) {
  return t & e ^ ~t & n;
}
function K6(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class W6 extends z6 {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = sl(this.buffer);
  }
  update(e) {
    Kh(this), e = ew(e), vc(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
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
    Kh(this), U6(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, hu(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    G6(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
    return e.destroyed = o, e.finished = i, e.length = s, e.pos = a, s % n && e.buffer.set(r), e;
  }
  clone() {
    return this._cloneInto();
  }
}
const ns = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), X6 = /* @__PURE__ */ Uint32Array.from([
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
]), rs = /* @__PURE__ */ new Uint32Array(64);
class q6 extends W6 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = ns[0] | 0, this.B = ns[1] | 0, this.C = ns[2] | 0, this.D = ns[3] | 0, this.E = ns[4] | 0, this.F = ns[5] | 0, this.G = ns[6] | 0, this.H = ns[7] | 0;
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
      const g = rs[l - 15], h = rs[l - 2], x = tr(g, 7) ^ tr(g, 18) ^ g >>> 3, m = tr(h, 17) ^ tr(h, 19) ^ h >>> 10;
      rs[l] = m + rs[l - 7] + x + rs[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const g = tr(a, 6) ^ tr(a, 11) ^ tr(a, 25), h = f + g + V6(a, c, u) + X6[l] + rs[l] | 0, m = (tr(r, 2) ^ tr(r, 13) ^ tr(r, 22)) + K6(r, s, i) | 0;
      f = u, u = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + m | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    hu(rs);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), hu(this.buffer);
  }
}
const Y6 = /* @__PURE__ */ R6(() => new q6()), Z6 = Y6, Q6 = "xtrata.xyz/radio/listening-wallet", J6 = "Link a temporary listening wallet for pay-per-play; no spending permission", Zs = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && Ei(t), tv = (t) => ({
  domain: Er({ name: ye(Q6), version: ye("1"), "chain-id": hn(1) }),
  message: Er({
    purpose: ye(J6),
    main: ye(t.main),
    listening: ye(t.listening),
    issued: hn(t.issued)
  })
}), nw = 100000n, ev = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function nv(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Zs(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= nw).sort(ev);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const pa = 50;
function Xa(t) {
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
async function rv(t, e, n = 4) {
  if (!Zs(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${pa}&offset=${o}`, s = Xa(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - pa);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= pa ? s : Xa(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = nv(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - pa);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const pr = 50, sv = 6, iv = 20, Wh = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function Xh(t, e) {
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
async function ov(t, e, n) {
  if (!Zs(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = Xa(await e(`/extended/v1/address/${t}/stx_inbound?limit=${pr}&offset=0`));
    if (!s || s.total > sv * pr) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = pr; o < s.total; o += pr) {
      const a = Xa(await e(`/extended/v1/address/${t}/stx_inbound?limit=${pr}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${pr}&offset=${u}`, a = Xh(await e(o(0)), t);
      if (!a || a.total > iv * pr) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) i.set(u.txId, u);
      for (let u = pr; u < a.total; u += pr) {
        const f = Xh(await e(o(u)), t);
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
function av(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(Wh).map((l, g) => {
    const h = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: h, kind: "gift", to: r.payer, at: g } : Zs(l.sender) && h >= nw ? { sender: l.sender, left: h, kind: "deposit", to: l.sender, at: g } : { sender: l.sender, left: h, kind: "dust", to: null, at: g };
  }), i = s.reduce((l, g) => l + g.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && Zs(l.recipient) && l.amount > 0n).sort(Wh), a = o.reduce((l, g) => l + g.amount, 0n), c = i - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (l, g) => {
    let h = g;
    for (const x of l) {
      if (h <= 0n) break;
      const m = x.left < h ? x.left : h;
      x.left -= m, h -= m;
    }
    return h;
  };
  for (const l of o) {
    const g = u(s.filter((h) => h.to === l.recipient), l.amount);
    g > 0n && u(s, g);
  }
  if (u(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((l, g) => l + g.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const f = /* @__PURE__ */ new Map();
  for (const l of s) {
    if (l.left <= 0n) continue;
    const g = `${l.kind}:${l.to ?? ""}`, h = f.get(g);
    h ? (h.amount += l.left, h.newest = Math.max(h.newest, l.at)) : f.set(g, { to: l.to, kind: l.kind, amount: l.left, newest: l.at });
  }
  return {
    ok: !0,
    parts: [...f.values()].sort((l, g) => l.newest - g.newest),
    hasTopUp: s.some((l) => l.kind === "deposit")
  };
}
function cv(t, e) {
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
function qh(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const pu = [50000n, 100000n, 250000n], oo = ["prepared", "signed", "unknown", "pending"], lv = 30 * 6e4, hi = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, uv = 3e3, Yh = "Your main listener wallet is out of funds, so likes are paused. Top it up (it only needs a little) and your likes carry on.", il = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function fv(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = null, f = !1, l = !1, g = !1, h = null, x = !1, m = "", L = "", D = 0, O, p = null, k, I = [], U, V = -1 / 0;
  const F = /* @__PURE__ */ new Set();
  let R = null, A = !1, T = 0, M = null, _ = null, nt = !1, G = null, Kt = !1, wt = null, pe = !1, $ = !1, N = !1, bt = !1, Pt = !1, Ht = 0, Mt = null, ie = Promise.resolve();
  const ge = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? ys.toString()), Jt = (w) => !!i && !(i.features ?? []).includes(w), Ee = (w, v) => `xtrata.ppp.v1.${w}:${v}`, ve = (w = i == null ? void 0 : i.address) => {
    if (!w) return [];
    try {
      const v = JSON.parse(t.store.get(Ee("entries", w)) || "[]");
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  }, te = (w) => {
    const v = [w, ...ve(w.address).filter((j) => !(j.txid === w.txid && j.kind === w.kind))].slice(0, 200);
    t.store.set(Ee("entries", w.address), JSON.stringify(v));
  }, Be = (w = i == null ? void 0 : i.address) => !!w && t.store.get(Ee("on", w)) !== "0", In = (w) => {
    i != null && i.address && t.store.set(Ee("on", i.address), w ? "1" : "0");
  }, Re = () => ve().filter((w) => oo.includes(w.status)), gn = () => oe() ? [...Re(), ...ve(ce()).filter((w) => oo.includes(w.status))] : Re(), Ge = () => Te(i == null ? void 0 : i.address), Te = (w) => {
    if (!w) return null;
    try {
      return JSON.parse(t.store.get(Ee("deposit", w)) || "null");
    } catch {
      return null;
    }
  }, $e = (w, v = i == null ? void 0 : i.address) => {
    v && t.store.set(Ee("deposit", v), JSON.stringify(w));
  }, ce = () => Jt("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), oe = () => !!(i != null && i.address) && ce() !== i.address, Ue = () => oe() ? c && c.for === ce() ? c.value : void 0 : o, Ve = (w) => w !== void 0 && w < qe + el, le = () => Re().filter((w) => t.now() - w.created > lv && F.has(w.txid)), Ze = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), jt = () => Ze() && !(i != null && i.linked), Ie = () => {
    const w = t.main();
    return !jt() && !!w && !!(i != null && i.linked) && i.linked !== w;
  }, b = (w) => Ee("return-to", w), E = (w = i == null ? void 0 : i.address) => {
    if (!w) return;
    const v = t.store.get(b(w));
    return v && Zs(v) && v !== w ? v : void 0;
  }, d = (w = i == null ? void 0 : i.address) => R && R.for === w ? R.res : null;
  function X() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const w = E();
    if (w) return { to: w, kind: "chosen" };
    const v = d();
    if (v != null && v.ok && v.funder) return { to: v.funder, kind: "funder" };
  }
  const ct = (w) => Ee("gift", w);
  function lt() {
    const w = i == null ? void 0 : i.address;
    if (!w) return null;
    if ((G == null ? void 0 : G.for) === w) return G.info;
    try {
      const v = JSON.parse(t.store.get(ct(w)) || "null");
      return v && typeof v.returnTo == "string" && typeof v.treasury == "string" ? v : null;
    } catch {
      return null;
    }
  }
  async function Yt() {
    var et;
    const w = i == null ? void 0 : i.address;
    if (!w || !t.giftInfo || !((et = e == null ? void 0 : e.gifts) != null && et.enabled) || Kt) return;
    const v = (G == null ? void 0 : G.for) === w ? G : null, j = v ? v.ok ? v.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (v && t.now() - v.at < j) return;
    Kt = !0;
    const Z = lt();
    try {
      const q = await t.giftInfo(w);
      G = { for: w, info: q, ok: !0, at: t.now() }, t.store.set(ct(w), JSON.stringify(q));
    } catch {
      G = { for: w, info: Z, ok: !1, at: t.now() };
    } finally {
      Kt = !1;
    }
  }
  const S = () => ve().reduce((w, v) => oo.includes(v.status) ? w + BigInt(v.amount || "0") + BigInt(v.fee || "0") : w, 0n);
  function H() {
    if (o === void 0) return 0;
    const w = o - S() - BigInt(ae.length) * Pn(ge());
    return w > 0n ? Vh(w, ge()) : 0;
  }
  const B = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", z = "EMPTY — ADD STX TO PLAY";
  function J() {
    var j;
    const w = (i == null ? void 0 : i.state) === "known" || (i == null ? void 0 : i.state) === "unlocked";
    if (!((j = lt()) != null && j.player) && !w) return null;
    const v = (Z, et) => ({ reason: Z, text: et });
    switch (rt()) {
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
        return Ge() ? v("arriving", "YOUR PLAYS ARE ARRIVING") : v("out", oe() ? B : z);
      case "ready":
        return !Be() || !(i != null && i.session) || i.session.playsLeft < 1 ? v("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : N ? H() < 1 ? v("out", oe() ? B : z) : null : v("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const gt = () => {
    var w;
    return !!(i != null && i.address) && oe() && !!((w = lt()) != null && w.player);
  };
  function Rt() {
    return gt() ? { locked: !0, known: !0 } : null;
  }
  const yt = 3 * 6e4, Zt = () => !!lt() && !!t.history && !(i != null && i.linked);
  async function Et() {
    const w = i.address, v = lt(), { balance: j, nonce: Z } = await t.chain.account(w), et = await t.history(w, !0);
    if (!et.ok) return null;
    const q = av({ self: w, balance: j, inbound: et.inbound, outgoing: et.outgoing, gift: { sender: v.treasury, payer: v.returnTo } });
    if (!q.ok) return null;
    const ut = cv(q.parts, io);
    return { balance: j, nonce: Z, parts: q.parts, steps: ut.steps, tooSmall: ut.tooSmall.length };
  }
  const ot = () => pe ? { state: "unavailable" } : !wt || t.now() - wt.at > yt || o !== void 0 && o !== wt.balance ? { state: "none" } : wt.plan;
  function rt() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const w = t.main();
    if (!jt()) {
      if (!w) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : Ie() ? "wrong-wallet" : i.state === "known" ? "locked" : !jt() && i.linked !== w ? "link" : o === void 0 ? "loading" : o > Ts ? "over" : o < qe + Pn(ge()) ? "fund" : "ready" : "loading";
  }
  const ht = () => {
    var w, v, j, Z;
    return {
      step: rt(),
      busy: u,
      message: m,
      error: L,
      notice: At(),
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : A6(o, ge()),
      playsLeft: o === void 0 ? 0 : Vh(o, ge()),
      allowance: o === void 0 ? Ts : nl(o, BigInt(((w = Ge()) == null ? void 0 : w.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: Be(),
      entries: ve(),
      depositTxid: ((v = Ge()) == null ? void 0 : v.txid) ?? O,
      depositPending: !!Ge(),
      walletOutdated: Jt("like"),
      linkedListening: U && U === t.main() ? I.map((et) => et.listening) : [],
      serverLinked: !!p && k === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: le().length,
      armed: bt,
      queued: ae.length,
      solo: jt(),
      returnTo: (j = X()) == null ? void 0 : j.to,
      returnToKind: (Z = X()) == null ? void 0 : Z.kind,
      funderState: (() => {
        const et = d();
        return et ? et.ok ? et.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const et = d();
        return !!et && et.ok && et.distinct > 1;
      })(),
      walletCannotSolo: jt() && Jt("standalone"),
      walletCannotMulti: Jt("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((et) => et !== t.main() && et !== (i == null ? void 0 : i.linked)),
      creditedTo: jt() && (i != null && i.address) && (M == null ? void 0 : M.for) === i.address && M.main ? M.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(Ee("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (_ == null ? void 0 : _.for) === i.address && _.unused,
      gift: (() => {
        const et = lt();
        return et ? { player: et.player, from: et.from, source: et.source, amount: et.amount } : null;
      })(),
      giftPlays: lt() ? H() : 0,
      giftStop: J(),
      albumLock: Rt(),
      returnPlan: ot(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: Jt("slots"),
      likeFunds: (() => {
        var ut;
        const et = ce();
        if (!et || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const q = Ue();
        return { address: et, balance: q, low: Ve(q), album: oe(), pending: !!Te(et), txid: (ut = Te(et)) == null ? void 0 : ut.txid, main: t.main() };
      })()
    };
  }, At = () => D ? D < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", mt = (w, v = "") => {
    m = w, L = v, t.changed();
  };
  async function qt(w, v) {
    if (!u) {
      u = w, L = "", t.changed();
      try {
        await v();
      } catch (j) {
        const Z = j instanceof Error ? j.message : String(j);
        L = /Cancelled in the listening wallet/.test(Z) ? "" : Z, L || (m = "Not now. Nothing was signed.", Pt = !0);
      } finally {
        u = null, await De(!0);
      }
    }
  }
  const on = () => !!(e != null && e.enabled) && e.here && (jt() || !!t.main() && e.allowed), Oe = () => on() && !Ie(), kn = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Ut = () => {
    if (Ie()) throw new Error(kn());
  };
  async function Ot() {
    if (!on()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const Gt = (w) => {
    const v = t.main();
    return w.request("listening.status", v ? { main: v } : void 0);
  };
  async function Me(w = !1) {
    i != null && i.address && (!w && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now(), await Ne(w)));
  }
  async function Ne(w = !1) {
    const v = ce();
    if (!(!oe() || !v || (i == null ? void 0 : i.state) !== "unlocked") && !(!w && (c == null ? void 0 : c.for) === v && t.now() - c.at < 3e4))
      try {
        c = { for: v, value: await t.chain.balance(v), at: t.now() };
      } catch {
      }
  }
  async function Ln(w) {
    if ((U !== w || t.now() - V >= 6e4) && (I = await t.links(w), U = w, V = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === w) return;
    const v = `${w}:${i.address}`;
    k === v && p || (p = I.find((j) => j.listening === i.address) ?? null, k = v);
  }
  async function Ir() {
    const w = i == null ? void 0 : i.address;
    if (!jt() || !w || i != null && i.linked || !t.funder || A || !o || o <= 0n) return;
    const v = d(w);
    if (v != null && v.ok && v.funder) return;
    const j = v != null && v.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, T - 1), 30 * 6e4);
    if (!(R && R.for === w && t.now() - R.at < j)) {
      A = !0;
      try {
        R = { for: w, res: await t.funder(w), at: t.now() };
      } catch {
        R = { for: w, res: { ok: !1 }, at: t.now() };
      } finally {
        A = !1;
      }
      T = R.res.ok ? 0 : T + 1;
    }
  }
  async function kr() {
    const w = i == null ? void 0 : i.address;
    if (!(!jt() || !w || i != null && i.linked || !t.mainOf || nt) && !(M && M.for === w && (M.ok || t.now() - M.at < 6e4))) {
      nt = !0;
      try {
        M = { for: w, main: await t.mainOf(w), ok: !0, at: t.now() };
      } catch {
        M = { for: w, main: null, ok: !1, at: t.now() };
      } finally {
        nt = !1;
      }
    }
  }
  async function Lr() {
    const w = i == null ? void 0 : i.address;
    if (!(!w || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (_ == null ? void 0 : _.for) === w) && t.store.get(Ee("created", w)) !== "1")
      try {
        _ = { for: w, unused: await t.chain.confirmedNonce(w) === 0n };
      } catch {
      }
  }
  async function ai() {
    var et;
    const w = i == null ? void 0 : i.address;
    if (!w) return !1;
    let v, j = !1;
    const Z = /* @__PURE__ */ new Map();
    for (const q of gn())
      try {
        const ut = await t.chain.transaction(q.txid);
        if (!ut) {
          if (F.add(q.txid), t.now() - q.created > 15 * 6e4 && !Z.has(q.address) && Z.set(q.address, await t.chain.confirmedNonce(q.address)), v = Z.get(q.address), v !== void 0 && v > BigInt(q.nonce)) {
            te({ ...q, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((q.status === "unknown" || q.status === "signed") && q.raw)
            try {
              await t.chain.broadcast(q.raw, q.txid), te({ ...q, status: "pending" });
            } catch (pt) {
              hi(pt) && te({ ...q, status: "failed", note: pt.message, raw: void 0 });
            }
          continue;
        }
        F.delete(q.txid);
        const xt = String(ut.tx_status);
        if (xt === "success" && ut.canonical !== !1 && ut.is_unanchored === !1) {
          if (te({ ...q, status: "confirmed", confirmedAt: t.now(), actualFee: String(ut.fee_rate ?? q.fee), raw: void 0 }), j = !0, q.kind === "like" && (x = !0, q.status !== "confirmed" && typeof q.liked == "boolean"))
            try {
              (et = t.likeConfirmed) == null || et.call(t, q.song, q.liked);
            } catch {
            }
        } else xt.startsWith("abort_") || xt.startsWith("dropped_") ? te({ ...q, status: "failed", note: xt, raw: void 0 }) : q.status !== "pending" && te({ ...q, status: "pending" });
      } catch {
      }
    for (const q of oe() ? [w, ce()] : [w]) {
      const ut = Te(q);
      if (ut)
        try {
          const xt = await t.chain.transaction(ut.txid), pt = String((xt == null ? void 0 : xt.tx_status) ?? "");
          (pt === "success" && xt.is_unanchored === !1 || pt.startsWith("abort_") || pt.startsWith("dropped_") || !xt && t.now() - ut.at > 2 * 36e5) && ($e(null, q), a = -1 / 0, c = null, /on its way/i.test(m) && (m = ""));
        } catch {
        }
    }
    return j;
  }
  async function De(w = !1) {
    var v;
    try {
      const j = t.main();
      if ((w || !e || r !== j || t.now() - n > 3e5) && (e = await t.config(j), n = t.now(), r = j), !e.enabled || !e.here || !jt() && (!j || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), bt && Cr(), t.changed();
        return;
      }
      await Ot(), i = await Gt(s), Ie() && i.state === "unlocked" && (ui(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await Gt(s)), j && e.allowed && await Ln(j), await Me(w), await Ir(), await kr(), await Lr(), await Yt(), await ai() && await Me(!0), await Ne(), await me(), D = 0;
    } catch {
      D++;
    }
    if (rt() === "locked" ? li() : bt && Cr(), x) {
      x = !1;
      try {
        (v = t.likesChanged) == null || v.call(t);
      } catch {
      }
    }
    t.changed(), ae.length && !Un && Ji();
  }
  async function ci(w) {
    const v = i == null ? void 0 : i.root;
    if (!v || i != null && i.slot || !(i != null && i.address) || Jt("slots")) return;
    const j = Number(t.store.get(Ee("slot", v)));
    if (!(!Number.isSafeInteger(j) || j < 1))
      try {
        const { balance: Z } = await t.chain.account(i.address);
        if (Z >= qe + Pn(ge())) return;
        await w.request("listening.openSlot", { slot: j }), i = await Gt(w), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function ws(w, v) {
    var q;
    Ut();
    const j = !(i != null && i.address) || Be(i.address), Z = i != null && i.linked ? (q = t.nameOf) == null ? void 0 : q.call(t, i.linked) : void 0;
    await w.request("listening.unlock", { mode: "unlock", terms: j ? Br() : void 0, anyPasskey: v, ...t.main() ? { main: t.main() } : {}, ...Z ? { label: Z } : {} }), i = await Gt(w), j && (Be(i.address) ? await yn() : await w.request("listening.stop")), await ci(w), mt(j ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const et = h;
    h = null, et && t.now() - et.at < 12e4 && setTimeout(() => void De(!0).then(() => to(et)), 0);
  }
  function li() {
    bt || u || Pt || Ht >= 3 || !s || !(i != null && i.address) || (bt = !0, ie = (async () => {
      try {
        await ws(s, !1), Ht = 0;
      } catch (w) {
        const v = w instanceof Error ? w.message : String(w);
        /Cancelled in the listening wallet/.test(v) ? Mt || (Pt = !0, mt("Not now. Nothing was signed.")) : /did not answer/.test(v) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (Ht++, L = v);
      } finally {
        bt = !1;
        const w = Mt;
        Mt = null, w ? await w() : await De(!0);
      }
    })());
  }
  async function Cr(w) {
    bt && (Mt = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await ie), w && await w(), t.changed();
  }
  const Br = () => ({
    fee: ge().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Ts.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function yn() {
    if (!(i != null && i.address)) return !1;
    if (N || (N = await t.tabLock(i.address)), !N)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function Tr(w, v) {
    const j = i.address, { balance: Z, nonce: et } = v ?? await t.chain.account(j);
    o = Z;
    const q = await s.request("listening.prepareReturn", {
      mode: w.mode,
      balance: Z.toString(),
      nonce: et.toString(),
      fee: io.toString(),
      ...w.amount !== void 0 ? { amount: w.amount.toString() } : {},
      ...w.linked ? {} : { destination: w.to }
    });
    if (q.recipient !== w.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const ut = w.mode === "amount" ? w.amount : w.mode === "all" ? Z - io : Z - Ts - io, xt = Va(q.raw);
    if (sr(xt.payload.recipient).value !== w.to || String(xt.payload.amount) !== q.amount || ut !== void 0 && q.amount !== ut.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const pt = {
      id: il(),
      address: j,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: q.recipient,
      amount: q.amount,
      fee: q.fee,
      nonce: et.toString(),
      created: t.now(),
      status: "signed",
      raw: q.raw,
      txid: q.txid
    };
    t.validate(pt), te(pt);
    try {
      await t.chain.broadcast(q.raw, q.txid), te({ ...pt, status: "pending" });
    } catch (Wt) {
      throw te({ ...pt, status: "unknown", note: Wt.message }), Wt;
    }
    return q;
  }
  const bs = Ec, _r = io;
  async function ms(w, v, j) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || !i.address) throw new Error("Unlock the listening wallet first.");
    if (Jt("slots") || Jt("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const Z = i.slot ?? 0;
    if (w === v || ![w, v].includes(Z) || ![w, v].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const et = i.root ?? i.address, q = w === 0 ? et : i.address, ut = v === 0 ? et : i.address, { balance: xt, nonce: pt } = await t.chain.account(q);
    if (xt < j + _r + qe) throw new Error(w === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const Wt = await s.request("listening.signMove", { from: w, to: v, amount: j.toString(), fee: _r.toString(), nonce: pt.toString(), balance: xt.toString() }), Fe = Va(Wt.raw);
    if (Wt.from !== q || Wt.to !== ut || Wt.amount !== j.toString() || sr(Fe.payload.recipient).value !== ut || String(Fe.payload.amount) !== j.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const Cn = {
      id: il(),
      address: q,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: ut,
      amount: Wt.amount,
      fee: Wt.fee,
      nonce: pt.toString(),
      created: t.now(),
      status: "signed",
      raw: Wt.raw,
      txid: Wt.txid
    };
    t.validate(Cn), te(Cn);
    try {
      await t.chain.broadcast(Wt.raw, Wt.txid), te({ ...Cn, status: "pending" });
    } catch (Qe) {
      throw te({ ...Cn, status: "unknown", note: Qe.message }), Qe;
    }
    return $e({ txid: Wt.txid, amount: Wt.amount, at: t.now() }, ut), ut === et && et !== i.address ? c = null : a = -1 / 0, Wt;
  }
  let K = !1;
  const tt = /* @__PURE__ */ new Map(), ue = (w) => Ee("float", w);
  async function me() {
    if (K || (i == null ? void 0 : i.state) !== "unlocked" || !oe() || Jt("move") || Jt("rootLike") || !i.address) return;
    const w = i.address;
    if (t.store.get(ue(w)) === "1") return;
    const v = lt();
    if (!(v != null && v.player) || v.state !== "arrived") return;
    const j = Ue();
    if (j === void 0 || o === void 0) return;
    if (!Ve(j)) {
      t.store.set(ue(w), "1");
      return;
    }
    if (Te(ce()) || Zi() || gn().length || o < bs * 4n + qe + _r) return;
    const Z = tt.get(w);
    if (!(Z && (Z.n >= 3 || t.now() - Z.at < 5 * 6e4))) {
      K = !0, tt.set(w, { n: ((Z == null ? void 0 : Z.n) ?? 0) + 1, at: t.now() });
      try {
        await ms(i.slot ?? 0, 0, bs), t.store.set(ue(w), "1");
      } catch (et) {
        console.warn("[radio] likes float not sent yet", et);
      } finally {
        K = !1;
      }
    }
  }
  async function xs(w) {
    if (Re().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Jt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const v = await Et().catch(() => null);
    if (!v)
      throw wt = null, pe = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    pe = !1, o = v.balance;
    const j = { balance: v.balance, nonce: v.nonce };
    if (w === "excess") {
      const xt = qh(v.parts) ?? E();
      if (!xt) throw new Error("Choose where to send the excess first.");
      await Tr({ mode: "excess", to: xt, linked: !1 }, j), wt = null, mt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const Z = v.steps;
    if (!Z.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!wt && wt.balance === v.balance && t.now() - wt.at <= yt && wt.steps.length === Z.length && wt.steps.every((xt, pt) => xt.to === Z[pt].to && xt.mode === Z[pt].mode && xt.send === Z[pt].send))) {
      wt = {
        at: t.now(),
        balance: v.balance,
        steps: Z,
        parts: v.parts,
        plan: { state: "ready", steps: Z.map((xt) => ({ to: xt.to, kind: xt.kind, send: xt.send.toString() })), kept: v.tooSmall, excess: qh(v.parts) }
      }, mt(Z.length > 1 ? `This goes back in ${Z.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const q = Z[0], ut = q.to ?? E();
    if (!ut) throw new Error("Choose where to send the rest first.");
    if (q.mode === "amount" && Jt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await Tr({ mode: q.mode, to: ut, linked: !1, ...q.mode === "amount" ? { amount: q.send } : {} }, j), wt = null, Z.length === 1 ? (In(!1), mt("Returned ✓ Paying is off.")) : mt(`Returned ✓ ${Z.length - 1} more ${Z.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const Kn = {
    forceRefresh: () => De(!0),
    create: () => qt("Waiting for your passkey…", async () => {
      const w = await Ot();
      await w.request("listening.unlock", { mode: "create", terms: Br(), ...t.main() ? { main: t.main() } : {} }), i = await Gt(w), i.address && t.store.set(Ee("created", i.address), "1"), In(!0), mt(jt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await yn();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    giftSent: (w, v) => {
      !(i != null && i.address) || Ge() || ($e({ txid: w, amount: v.toString(), at: t.now() }), a = -1 / 0, G = null, mt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (w) => {
      if (Ut(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Jt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await Ot()).request("listening.bindSlot", { slot: w, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (w, v, j, Z) => {
      $e({ txid: j, amount: Z.toString(), at: t.now() }, v), G = null, await Kn.openAlbum(w), mt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (w) => qt("Opening…", async () => {
      if (Ut(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Jt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (f || l || g) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === w) return;
      ui(), await s.request("listening.openSlot", { slot: w }), i = await Gt(s), o = void 0, a = -1 / 0, wt = null, pe = !1;
      const v = i.root;
      v && w > 0 && t.store.set(Ee("slot", v), String(w)), mt(w === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (w = !1) => {
      const v = () => qt("Waiting for your passkey…", async () => ws(await Ot(), w));
      return bt ? w ? Jt("cancel") ? (mt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Cr(async () => {
        (rt() === "locked" || rt() === "intro") && await v();
      }) : ie : v();
    },
    link: () => qt("Sign in your wallet…", async () => {
      Ut();
      const w = t.main();
      if (!w || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const v = (await t.links(w)).find((j) => j.listening === i.address);
      if (v)
        await s.request("listening.link", { main: w, issued: v.issued, mainSignature: v.mainSignature });
      else {
        const j = { main: w, listening: i.address, issued: t.now() }, Z = await t.signWithMain(w, tv(j)), et = await s.request("listening.link", { main: w, issued: j.issued, mainSignature: Z });
        await t.saveLink({ ...j, mainSignature: Z, listeningSignature: et.listeningSignature }), V = -1 / 0;
      }
      mt("Linked ✓");
    }),
    deposit: () => qt("Approve the deposit in your wallet…", async () => {
      Ut();
      const w = t.main();
      if (!w || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (Ge()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await Me(!0);
      const v = nl(o ?? 0n);
      if (v <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      O = await t.deposit(w, i.address, v), O && $e({ txid: O, amount: v.toString(), at: t.now() }), mt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => qt("Approve the top-up in your wallet…", async () => {
      Ut();
      const w = t.main(), v = ce();
      if (!w || !v) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (Te(v)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const j = await t.chain.balance(v);
      oe() ? c = { for: v, value: j, at: t.now() } : (o = j, a = t.now());
      const Z = nl(j);
      if (Z <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const et = await t.deposit(w, v, Z);
      et && $e({ txid: et, amount: Z.toString(), at: t.now() }, v), mt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_CHOICES`. */
    topUpAlbum: (w) => qt("Adding plays…", async () => {
      if (Ut(), !oe()) throw new Error("Open the album you want to add plays to first.");
      if (!pu.includes(w)) throw new Error("Choose one of the amounts offered.");
      if (f || l || g) throw new Error("Still sending a payment. Try again in a moment.");
      if (gn().length || Ge()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await ms(0, i.slot ?? 0, w), mt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => qt("Confirm in the listening wallet…", async () => {
      if (!Oe()) throw new Error("Connect your wallet first.");
      await yn(), await s.request("listening.approveSession", Br()), In(!0), mt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => qt("Clearing…", async () => {
      for (const w of le())
        await t.chain.transaction(w.txid) || te({ ...w, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      mt("Cleared ✓");
    }),
    switchOff: () => qt("Switching off…", async () => {
      ui(), await (s == null ? void 0 : s.request("listening.stop")), In(!1), mt("Paying is off. Music stays free.");
    }),
    lock: () => qt("Locking…", async () => {
      ui(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, mt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (w) => {
      const v = String(w ?? "").trim();
      if (!(i != null && i.address)) return mt("", "Unlock the listening wallet first.");
      if (!Zs(v)) return mt("", "Enter a standard mainnet address (it starts with SP).");
      if (v === i.address) return mt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(b(i.address), v), mt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(b(i.address), ""), t.changed();
    },
    returnFunds: (w) => qt("Check the return in the listening wallet…", async () => {
      if (!Oe()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (Zt()) return xs(w);
      const v = X();
      if (!v) throw new Error(jt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (v.kind !== "linked" && Jt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Re().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await Tr({ mode: w, to: v.to, linked: v.kind === "linked" }), w === "all" && In(!1), mt(w === "all" ? v.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, ae = [], qi = 10, Yi = 30 * 6e4;
  let Un = !1;
  const Zi = () => f || !!u || l || g, ui = () => {
    ae.length && (ae.length = 0, t.changed());
  };
  async function Qi(w) {
    if (!ae.some((v) => v.id === w.id) && !ve().some((v) => v.id === w.id) && (ae.push({ ...w, at: t.now() }), ae.length > qi && ae.shift()), Zi() || Re().length) {
      const v = ae.length;
      m = `Queued ${v === 1 ? "this song" : v + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Ji();
  }
  async function Ji() {
    if (!Un) {
      Un = !0;
      try {
        for (; ae.length; ) {
          for (; ae.length && t.now() - ae[0].at > Yi; ) ae.shift();
          if (!ae.length || Zi() || await $c(ae[0]) === "wait") return;
          ae.shift();
        }
      } finally {
        Un = !1, t.changed();
      }
    }
  }
  async function $c(w) {
    var v;
    f = !0;
    try {
      await De();
      const j = rt();
      if (j === "loading") return "wait";
      if (j !== "ready" || !Be() || !(i != null && i.session) || i.session.playsLeft < 1 || !N) return "done";
      if (Re().length) return "wait";
      $ || (await t.chain.verify(), $ = !0);
      const Z = i.address, { balance: et, nonce: q } = await t.chain.account(Z);
      o = et, a = t.now();
      const ut = await t.chain.owner(rl, w.song);
      if (ut === Z || ut === t.main()) return "done";
      const xt = await s.request("listening.signPlay", {
        core: rl,
        song: w.song,
        receipt: w.id,
        fee: ge().toString(),
        nonce: q.toString(),
        balance: et.toString()
      }), pt = {
        id: w.id,
        address: Z,
        kind: "play",
        core: rl,
        song: w.song,
        recipient: ut,
        amount: "50",
        fee: ge().toString(),
        nonce: q.toString(),
        created: t.now(),
        status: "signed",
        raw: xt.raw,
        txid: xt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(pt), te(pt);
      const Wt = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`;
      try {
        await t.chain.broadcast(xt.raw, xt.txid), te({ ...pt, status: "pending" }), m = `♪ Paid ${Wt}`, L = "";
      } catch (Fe) {
        te({ ...pt, status: hi(Fe) ? "failed" : "unknown", note: Fe.message, ...hi(Fe) ? { raw: void 0 } : {} }), L = Fe.message;
      }
      return i = await Gt(s), "done";
    } catch (j) {
      const Z = j instanceof Error ? j.message : "payment unavailable";
      return (v = lt()) != null && v.player ? (m = "Payment is taking a moment: " + Z, "wait") : (m = "This song played free: " + Z, "done");
    } finally {
      f = !1, t.changed();
    }
  }
  function Ic(w) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(rt()) || Jt("like") ? !1 : (to(w), !0);
  }
  async function to(w) {
    const v = w.title ? `“${w.title}”` : `song #${w.song}`, j = (Wn) => {
      var Uo;
      L = Wn, m = "";
      try {
        (Uo = t.likeFailed) == null || Uo.call(t, w.song);
      } catch {
      }
      t.changed();
    }, Z = oe(), et = rt(), q = t.main(), ut = Z && (et === "fund" || et === "over") ? "ready" : et, xt = jt() ? ce() : q;
    if (ut === "locked") {
      h = { ...w, at: t.now() }, mt(`Unlock to like ${v}. It sends straight after.`);
      return;
    }
    if (ut === "wrong-wallet") return j(kn());
    if (ut === "link") return j("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (jt() && Jt("standalone")) return j("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (ut === "fund") return j("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (ut === "over") return j("Return the excess first: the listening wallet holds more than 1 STX.");
    if (Z) {
      await Ne(!0);
      const Wn = Ue();
      if (Ve(Wn))
        return t.changed(), j(Yh);
    }
    if (ut !== "ready" || !xt) return j("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return j("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!N) return j("Pay-per-play is running in another tab. Like from that tab.");
    const pt = ve(ce()).find((Wn) => Wn.kind === "like" && Wn.song === w.song);
    if (pt && oo.includes(pt.status))
      return j(`Your last like for ${v} is still on its way. It can change again once it confirms.`);
    if (l) return j("One like at a time: your last one is still being sent.");
    if ((pt == null ? void 0 : pt.status) === "confirmed" && t.now() - (pt.confirmedAt ?? 0) < uv)
      return j(`Your like for ${v} has only just confirmed. Try again in a moment.`);
    let Wt;
    g = !0;
    try {
      Wt = t.likeState ? (await t.likeState(xt, w.song)).by : w.likedBy ?? [];
    } catch {
      Wt = w.likedBy;
    } finally {
      g = !1;
    }
    if (!Wt) return j(`Could not check ${v} right now. Try the heart again.`);
    const Fe = ce(), Qe = ((pt == null ? void 0 : pt.status) === "confirmed" && typeof pt.liked == "boolean" && t.now() - (pt.confirmedAt ?? pt.created) < 5 * 6e4 ? pt.liked : void 0) ?? Wt.includes(Fe);
    if (!Qe && Wt.some((Wn) => Wn !== Fe)) return j(jt() ? `${v} was liked from another wallet of yours. Unlike it there.` : `${v} was liked from your main wallet${Wt.includes(q) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await kc({ song: w.song, liked: !Qe, title: w.title, artist: w.artist });
  }
  async function kc(w) {
    var Z, et, q;
    if (l) {
      mt("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const v = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`, j = t.wait ?? ((ut) => new Promise((xt) => setTimeout(xt, ut)));
    try {
      mt(`${w.liked ? "Liking" : "Unliking"} ${v}…`);
      const ut = t.now() + 12e4;
      for (; f || (oe() ? ve(ce()).some((Qe) => oo.includes(Qe.status)) : Re().length); ) {
        if (t.now() > ut) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await j(5e3), await De(!0);
      }
      if (!oe() && rt() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const xt = ce(), { balance: pt, nonce: Wt } = await t.chain.account(xt);
      if (oe() ? c = { for: xt, value: pt, at: t.now() } : (o = pt, a = t.now()), Ve(pt)) throw new Error(Yh);
      const Fe = await s.request("listening.signLike", {
        song: w.song,
        liked: w.liked,
        fee: el.toString(),
        nonce: Wt.toString(),
        balance: pt.toString()
      }), Cn = {
        id: il(),
        address: xt,
        kind: "like",
        core: 0,
        song: w.song,
        liked: w.liked,
        recipient: "",
        amount: "0",
        fee: el.toString(),
        nonce: Wt.toString(),
        created: t.now(),
        status: "signed",
        raw: Fe.raw,
        txid: Fe.txid,
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(Cn), te(Cn);
      try {
        await t.chain.broadcast(Fe.raw, Fe.txid), te({ ...Cn, status: "pending" }), m = `${w.liked ? "♥ Liked" : "Unliked"} ${v}`, L = "";
        try {
          (Z = t.likeSent) == null || Z.call(t, w.song, w.liked);
        } catch {
        }
      } catch (Qe) {
        if (te({ ...Cn, status: hi(Qe) ? "failed" : "unknown", note: Qe.message, ...hi(Qe) ? { raw: void 0 } : {} }), L = Qe.message, hi(Qe)) try {
          (et = t.likeFailed) == null || et.call(t, w.song);
        } catch {
        }
      }
      i = await Gt(s);
    } catch (ut) {
      L = "Like not sent: " + (ut instanceof Error ? ut.message : "the listening wallet is unavailable");
      try {
        (q = t.likeFailed) == null || q.call(t, w.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), Ji();
    }
  }
  return { snapshot: ht, refresh: De, onListened: Qi, heart: Ic, toggleLike: to, ...Kn };
}
const rw = ["Connect", "Passkey", "Link & fund", "Listen"], sw = ["Passkey", "Add 1 STX", "Listen"], gu = (t) => t ? sw : rw;
function dv(t) {
  if (t.solo) return hv(t);
  const e = rw.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function hv(t) {
  const e = sw.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function pv(t, e) {
  return !e || e.at >= gu(!!t.solo).length || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const gv = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function yv(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !gv(r.id)));
}
const wv = {}, bv = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, mv = (t) => {
  const e = wv;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, xv = (t) => `/hiro/${t}`, Sv = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, Av = (t) => {
  const e = mv(t);
  if (e)
    return [Sv(e)];
  const n = bv[t];
  return typeof window < "u" ? [`${window.location.origin}${xv(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, Ev = {}, Zh = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, vv = "xtrata.log.enabled", $v = "xtrata.log.level", Iv = "xtrata.log.tags", kv = "xtrata.log.dedupe", ga = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, Lv = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, Cv = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, Bv = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, Tv = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, _v = () => {
  const t = Ev ?? {}, e = ga(vv) ?? t.VITE_LOG_ENABLED, n = ga($v) ?? t.VITE_LOG_LEVEL, r = ga(Iv) ?? t.VITE_LOG_TAGS, s = ga(kv) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: Lv(e),
    level: Cv(n) ?? "warn",
    tags: Tv(r),
    dedupe: Bv(s)
  };
}, Hv = (t, e, n) => !t.enabled || Zh[n] < Zh[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), Mv = (t, e, n, r) => {
  const s = _v();
  if (!Hv(s, e, t) || Pv(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, Nv = /* @__PURE__ */ new Set();
let Qh = null;
const Pv = (t, e, n, r, s) => (Qh !== t && (Nv.clear(), Qh = t), !1), Uv = (t, e, n) => Mv("debug", t, e, n), Ov = {}, Dv = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, Fv = (t) => {
  const e = Ov, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : Dv[t];
}, jv = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, zv = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return jv.test(n) ? n : null;
}, Rv = (t) => t.replace(/\/+$/, ""), Gv = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Jh = (t) => {
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
}, pi = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, Vv = (t) => {
  var c, u;
  let e;
  try {
    e = sr(B5(t));
  } catch {
    return null;
  }
  const n = pi(e);
  if (!n || n.success === !1)
    return null;
  const r = pi(n.value), s = pi(r == null ? void 0 : r.value), i = pi(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = Jh((c = pi(i.name)) == null ? void 0 : c.value), a = Jh((u = pi(i.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : zv(`${o}.${a}`);
}, Kv = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${Rv(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [Py(my(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : Vv(i.result);
}, Wv = async (t) => {
  const e = t.address.trim();
  if (!Ei(e))
    return null;
  const n = Fv(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of Av(t.network))
    try {
      return await Kv({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return Uv("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: Gv(r)
  }), null;
};
function Xv(t, e, n = {}) {
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
const t0 = Object.freeze({
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
}), e0 = Object.freeze({ 139: "melophonic" });
function qv(t, e = "") {
  const n = String(t);
  return Object.hasOwn(t0, n) ? t0[n] : Object.hasOwn(e0, n) ? e0[n] : e;
}
const n0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function Yv(t, e = "") {
  return Object.hasOwn(n0, String(t)) ? n0[String(t)] : e;
}
const iw = 100000n, qa = 1000000n, Ya = 3000n, Zv = (t, e) => `${t}#gift=${e}`, ow = 100, ol = (t, e = ys) => t <= qe ? 0 : Number((t - qe) / Pn(e)), r0 = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), vf = "xtrata.xyz/radio/gifts", Qv = "Create Xtrata radio gift links paid from the gift treasury", Jv = (t) => ({
  domain: Er({ name: ye(vf), version: ye("1"), "chain-id": hn(1) }),
  message: Er({
    purpose: ye(Qv),
    admin: ye(t.admin),
    count: hn(t.count),
    amount: hn(BigInt(t.amount)),
    label: ye(t.label),
    issued: hn(t.issued),
    ...t.player ? { player: ye(t.player) } : {}
  })
}), al = ow, t$ = "Create a prefunded Xtrata radio gift batch", e$ = (t) => ({
  domain: Er({ name: ye(vf), version: ye("1"), "chain-id": hn(1) }),
  message: Er({
    purpose: ye(t$),
    creator: ye(t.creator),
    count: hn(t.count),
    amount: hn(BigInt(t.amount)),
    label: ye(t.label),
    issued: hn(t.issued),
    ...t.player ? { player: ye(t.player) } : {}
  })
}), n$ = (t, e, n = ys) => qe + BigInt(t) * Pn(n) + (e ? Ec : 0n), r$ = (t, e = ys) => Number((qa - qe - (t ? Ec : 0n)) / Pn(e)), s$ = (t, e) => BigInt(t) * (e + Ya);
function i$(t, e, n, r = ys) {
  const s = n ? Ec : 0n, i = e > qe + s ? e - qe - s : 0n, o = Number(i / Pn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * Wa,
    fees: BigInt(o) * r,
    reserve: qe,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: Ya,
    perCopy: e + Ya,
    total: s$(t, e)
  };
}
const o$ = (t) => t >= iw && t <= qa, s0 = 40, a$ = "Create an Xtrata radio gift player", c$ = /^[^\u0000-\u001f\u007f<>]+$/u;
function i0(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && c$.test(t) : !n;
}
function l$(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!i0(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!i0(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > s0) throw new Error(`A player holds 1 to ${s0} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const u$ = (t) => F6(Z6(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), f$ = (t) => ({
  domain: Er({ name: ye(vf), version: ye("1"), "chain-id": hn(1) }),
  message: Er({
    purpose: ye(a$),
    admin: ye(t.admin),
    player: ye(t.hash),
    issued: hn(t.issued)
  })
}), o0 = (t, e = ys) => qe + BigInt(t) * Pn(e), Lo = (t) => t.tracks.filter((e) => !e.hidden), d$ = (t) => t.tracks.find((e) => e.hidden) ?? null, cl = [300, 500, 1e3], a0 = 1800, ll = /* @__PURE__ */ new Map();
async function aw(t) {
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
async function h$(t) {
  const e = navigator;
  if (e.share)
    try {
      return await e.share(t), { label: "Shared ✓", ok: !0 };
    } catch (n) {
      if ((n == null ? void 0 : n.name) === "AbortError") return null;
    }
  return await aw(t.url) ? { label: "Link copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 };
}
function cw(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = ll.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      ll.set(t, { ...a, until: Date.now() + a0 });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        ll.delete(t), s();
      }, a0 + 50);
    }
  }, i;
}
const cs = (t, e, n, r, s) => cw(t, e, async () => await aw(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), As = "xtrata.radio.gift.incoming.v1", c0 = (t) => "xtrata.radio.gift.mine.v1:" + t, l0 = (t) => "xtrata.radio.gift.batches.v1:" + t, it = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, er = (t, e, n = "") => {
  const r = it("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, gr = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, ln = (t) => On(t).replace(/\.?0+$/, "");
function p$(t) {
  let e = null;
  const n = (S) => [5e3, 1e4, 2e4, 3e4][S] ?? 6e4, r = (() => {
    try {
      const S = new URL(location.href), H = new URLSearchParams(S.hash.slice(1)).get("gift") ?? S.searchParams.get("gift");
      return H !== null && (S.searchParams.delete("gift"), history.replaceState(null, "", S.pathname + (S.search || ""))), r0(H) ? H : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const S = JSON.parse(t.store.get(As) || "null");
      return r0(S == null ? void 0 : S.code) ? S.code : null;
    } catch {
      return null;
    }
  })(), i = r ?? s;
  if (i) {
    e = { code: i }, t.store.set(As, JSON.stringify({ code: i, at: t.now() }));
    let S = 0;
    const H = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (B) => {
      const z = await B.json().catch(() => ({}));
      if (B.status === 404) {
        t.store.set(As, null), e = { ...e, error: (z == null ? void 0 : z.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!B.ok) throw new Error("busy");
      const J = z;
      e = { ...e, view: J, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(J.status) && t.store.set(As, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void H(), n(S++)));
    });
    H();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    e = null, t.store.set(As, null), t.changed();
  }, c = (S) => S.from ? t.who(S.from) : S.label ? `Xtrata Radio · ${S.label}` : "Xtrata Radio";
  let u = {};
  const f = (S) => {
    if (u.box) return u.box;
    const H = it("div", "", "ppp-gift-check");
    u.box = H;
    const B = () => {
      const z = window.turnstile;
      !z || u.rendered || (u.rendered = !0, z.render(H, { sitekey: S, callback: (J) => {
        u.token = J, t.changed();
      }, "expired-callback": () => {
        u.token = void 0;
      } }));
    };
    if (window.turnstile) B();
    else {
      const z = document.createElement("script");
      z.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", z.async = !0, z.onload = B, document.head.append(z);
    }
    return H;
  };
  let l;
  async function g(S) {
    var z, J, gt, Rt, yt;
    if (!e || e.claiming || !S.listening) return;
    const H = !!((z = e.view) != null && z.player);
    if (H && !S.root) return;
    e.claiming = !0, e.error = void 0, t.changed();
    const B = async (Zt) => {
      const Et = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: u.token, ...Zt })
      });
      return { res: Et, r: await Et.json().catch(() => ({})) };
    };
    try {
      let Zt = 0, Et = S.listening, ot;
      if (H) {
        const At = Number((J = await t.json("/radio/gift/slots?root=" + encodeURIComponent(S.root))) == null ? void 0 : J.next);
        if (!Number.isSafeInteger(At) || At < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Zt = At;
        for (let mt = 0; ; mt++) {
          const qt = await t.album.bind(Zt);
          if (Et = qt.address, ot = await B({ wallet: Et, binding: qt }), ot.res.status === 409 && /just taken/.test(((gt = ot.r) == null ? void 0 : gt.error) || "") && mt < 5) {
            Zt += 1;
            continue;
          }
          break;
        }
      } else ot = await B({ wallet: Et });
      const { res: rt, r: ht } = ot;
      if (rt.status === 503 && /sending another gift/.test((ht == null ? void 0 : ht.error) || "")) {
        e.waiting = !0, clearTimeout(l), l = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!rt.ok) {
        const At = String((ht == null ? void 0 : ht.error) || "");
        if (rt.status === 404 || rt.status === 410 || rt.status === 409 && /already had a gift|brand-new/.test(At))
          throw t.store.set(As, null), new Error(At || "This gift cannot be opened.");
        if (rt.status === 429 || rt.status === 403 || rt.status === 400 && !/wallet number/i.test(At)) throw new Error(At || `Could not open the gift (${rt.status}).`);
        const qt = /topping up/.test(At) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(At) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(At) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(qt), { retry: !0, slow: /topping up|not paid for yet/.test(At) });
      }
      e.done = !0, t.store.set(As, null), H ? await t.album.arrived(Zt, Et, ht.txid, BigInt(ht.amount)) : t.giftSent(ht.txid, BigInt(ht.amount));
    } catch (Zt) {
      const Et = Zt, ot = Et.name === "TypeError" || Et.name === "AbortError" || Et.name === "TimeoutError" || /wallet number/i.test(Et.message);
      if (Et.retry || ot) {
        const rt = e.tries ?? 0;
        e.tries = rt + 1, e.retry = { text: Et.retry ? Et.message : "Still sending your gift… the network is slow, trying again." }, clearTimeout(l), l = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, Et.slow ? 6e4 : n(rt));
      } else e.error = Et.message;
      u.token = void 0;
      try {
        (yt = (Rt = window.turnstile) == null ? void 0 : Rt.reset) == null || yt.call(Rt, u.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let h = null;
  function x(S) {
    if (!S.listening || !S.depositPending || S.step !== "fund")
      return h = null, [];
    if (!h || h.wallet !== S.listening || t.now() - h.at > 3e4) {
      const B = S.listening;
      h = { ...(h == null ? void 0 : h.wallet) === B ? h : {}, wallet: B, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(B)).then((z) => {
        var J, gt;
        (h == null ? void 0 : h.wallet) === B && (h.state = (J = z == null ? void 0 : z.gift) == null ? void 0 : J.state, h.problem = ((gt = z == null ? void 0 : z.gift) == null ? void 0 : gt.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(h.state === "sending" && h.problem)) return [];
    const H = it("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return H.title = `Network reply: ${h.problem}`, [H];
  }
  function m(S, H) {
    var yt, Zt;
    const B = H.player, z = BigInt(H.amount), J = [it("p", `🎁 ${c(H)} sent you “${B.title}”${B.subtitle ? ` by ${B.subtitle}` : ""}: ${Lo(B).length} ${Lo(B).length === 1 ? "song" : "songs"} and ${ol(z).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!S.root && ["fund", "ready", "over", "link"].includes(S.step)))
      return J.push(it("p", S.step === "intro" ? "Tap below: your passkey makes a listening wallet, and the album arrives in its own wallet. You can keep as many albums as you like." : S.step === "locked" ? "Unlock your listening wallet and the album arrives in its own wallet." : "Open your listening wallet and the album arrives in its own wallet.", "ppp-mute")), J;
    if (S.walletCannotAlbums)
      return J.push(it("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), J;
    const Rt = (Zt = (yt = S.gate) == null ? void 0 : yt.gifts) == null ? void 0 : Zt.turnstileSiteKey;
    return Rt && !u.token ? J.push(it("p", "One quick check and it is yours:", "ppp-mute"), f(Rt)) : !e.claiming && !e.error && !e.waiting && !e.retry && g(S), J.push(...L(S, "Sending your album…")), J;
  }
  function L(S, H) {
    const B = [];
    return e.claiming || e.waiting ? B.push(it("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : H, "ppp-cyan")) : e.retry && B.push(it("p", e.retry.text, "ppp-warn"), er("Try now", () => {
      clearTimeout(l), e.retry = void 0, g(S);
    }, "quiet")), e.error && B.push(it("p", e.error, "ppp-bad"), er("Try again", () => {
      e.error = void 0, g(S);
    })), B;
  }
  const D = (S) => {
    var H;
    return !!e && !e.done && !e.error && o() && !!S.listening && !S.linked && !S.creditedTo && (S.createdHere || S.brandNew || !!((H = e.view) != null && H.player)) && (S.balance ?? 0n) === 0n && !S.entries.length;
  };
  function O(S) {
    var ot, rt;
    const H = x(S);
    if (!e || ["off", "elsewhere"].includes(S.step)) return H;
    const B = e.view;
    if (e.error && !B) return [it("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!B) return [it("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return H;
    if (B.status === "claimed" || B.status === "claiming") return [it("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(B.status)) return [it("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (B.status === "pending-deposit") return [it("p", `🎁 ${c(B)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (B.player) return [...m(S, B), ...H];
    if (!!S.listening && (!(S.createdHere || S.brandNew) || !!S.linked || !!S.creditedTo || (S.balance ?? 0n) > 0n || S.entries.length > 0))
      return [it("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), er("Forget this gift link here", a, "quiet")];
    const J = BigInt(B.amount), gt = ol(J).toLocaleString(), yt = [it(
      "p",
      `🎁 ${c(B)} sent you ${ln(J)} STX of on-chain music: about ${gt} paid plays.`,
      "ppp-gift"
    )], Zt = !!S.listening && (S.createdHere || S.brandNew) && !S.linked && !S.creditedTo && S.step === "fund" && (S.balance ?? 1n) === 0n && !S.depositPending && !S.entries.length, Et = (rt = (ot = S.gate) == null ? void 0 : ot.gifts) == null ? void 0 : rt.turnstileSiteKey;
    return Zt ? (Et && !u.token ? yt.push(it("p", "One quick check and it is yours:", "ppp-mute"), f(Et)) : !e.claiming && !e.error && !e.waiting && !e.retry && g(S), yt.push(...L(S, "Sending your gift…"))) : S.step === "intro" ? yt.push(it("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : S.listening && S.linked ? yt.push(it("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), er("Forget this gift link here", a, "quiet")) : S.listening && (S.balance ?? 0n) > 0n && yt.push(it("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), er("Forget this gift link here", a, "quiet")), yt;
  }
  async function p(S, H, B) {
    var z;
    try {
      const J = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(S));
      if ((z = J == null ? void 0 : J.gift) != null && z.returnTo) return { ok: !0, funder: J.gift.returnTo, txId: J.gift.txid ?? void 0, amount: J.gift.amount, distinct: 1 };
    } catch {
      if (B) return { ok: !1 };
    }
    return H();
  }
  const k = it("div", "", "ppp-gift-fold");
  let I = 250000n, U = "", V = "", F = null;
  const R = (S) => {
    try {
      const H = JSON.parse(t.store.get(c0(S)) || "[]");
      return Array.isArray(H) ? H : [];
    } catch {
      return [];
    }
  }, A = (S, H) => t.store.set(c0(S), JSON.stringify(H.slice(0, 50)));
  let T = 0;
  async function M(S) {
    const H = R(S);
    for (const B of H)
      if (!(B.view && ["claimed", "refunded", "expired"].includes(B.view.status)))
        try {
          B.view = !B.view || B.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: B.id, ...B.txid ? { txid: B.txid } : {} }) }) : await t.json("/radio/gift?id=" + B.id), B.error = void 0;
        } catch (z) {
          B.error = z.message;
        }
    A(S, H), t.changed();
  }
  async function _(S) {
    if (U) return;
    U = "Starting your gift…", V = "", t.changed();
    let H = null;
    try {
      H = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: S, amount: I.toString() }) });
      const B = R(S);
      B.unshift({ id: H.id, code: H.code, amount: I.toString(), at: t.now() }), A(S, B), U = "Approve the gift in your wallet…", t.changed();
      const z = await t.pay(S, H.depositTo, BigInt(H.deposit), H.memo), J = R(S), gt = J.find((Rt) => Rt.id === H.id);
      gt && (gt.txid = z, gt.view = { status: "pending-deposit", amount: I.toString(), source: "friend", from: S, label: "", expires: 0 }), A(S, J), V = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", M(S);
    } catch (B) {
      V = B.message || "Not sent.";
    } finally {
      U = "", t.changed();
    }
  }
  const nt = (S) => "xtrata.radio.gift.players.v1:" + S, G = (S) => {
    try {
      const H = JSON.parse(t.store.get(nt(S)) || "[]");
      return Array.isArray(H) ? H.filter((B) => B && /^[0-9a-f]{16}$/.test(B.id)) : [];
    } catch {
      return [];
    }
  };
  async function Kt(S, H) {
    var B;
    if (!U) {
      U = "Checking the player…", V = "", t.changed();
      try {
        const z = H.tracks.split(/[\s,]+/).filter(Boolean).map((Et) => Number(Et.replace(/^#/, ""))), J = l$({ title: H.title.trim(), subtitle: H.subtitle.trim(), tracks: z, cover: (B = H.cover) != null && B.trim() ? Number(H.cover.trim().replace(/^#/, "")) : null });
        U = "Sign in your wallet…", t.changed();
        const gt = { admin: S, hash: u$(J), issued: t.now() }, Rt = await t.sign(S, f$(gt));
        U = "Making the player…", t.changed();
        const yt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: J, request: gt, signature: Rt }) }), Zt = G(S).filter((Et) => Et.id !== yt.id);
        Zt.unshift({ id: yt.id, title: yt.title, tracks: yt.tracks }), t.store.set(nt(S), JSON.stringify(Zt.slice(0, 30))), V = `${yt.existing ? "That player already exists" : "Player made"} ✓ “${yt.title}” · ${yt.tracks} songs. Pick it below for a campaign.`;
      } catch (z) {
        V = z.message || "Not made.";
      } finally {
        U = "", t.changed();
      }
    }
  }
  async function wt(S, H, B, z, J) {
    if (!U) {
      U = "Sign in your wallet…", V = "", F = null, t.changed();
      try {
        const gt = { admin: S, count: H, amount: B.toString(), label: z, issued: t.now(), ...J ? { player: J } : {} }, Rt = await t.sign(S, Jv(gt));
        U = "Making links…", t.changed();
        const yt = await t.json("/radio/gift/campaign", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ request: gt, signature: Rt }) });
        F = { codes: yt.codes, amount: yt.amount };
      } catch (gt) {
        V = gt.message || "Not made.";
      } finally {
        U = "", t.changed();
      }
    }
  }
  const pe = (S, H) => Zv(S || location.origin + "/radio.html", H), $ = (S) => h$({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: S }), N = (S) => {
    try {
      const H = JSON.parse(t.store.get(l0(S)) || "[]");
      return Array.isArray(H) ? H.filter((B) => B && /^[0-9a-f]{16}$/.test(B.id) && Array.isArray(B.codes)) : [];
    } catch {
      return [];
    }
  }, bt = (S, H) => t.store.set(l0(S), JSON.stringify(H.slice(0, 20))), Pt = (S) => !!S.view && S.view.status === "live" && S.view.copies.waiting + S.view.copies.claiming + S.view.copies.refunding === 0, Ht = (S, H) => t.json(S, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(H) });
  let Mt = 0;
  async function ie(S) {
    const H = N(S);
    for (const B of H)
      if (!Pt(B))
        try {
          B.view = !B.view || B.view.status === "pending-deposit" ? await Ht("/radio/gift/batch/confirm", { id: B.id, ...B.txid ? { txid: B.txid } : {} }) : await t.json("/radio/gift/batch?id=" + B.id), B.error = void 0;
        } catch (z) {
          B.error = z.message;
        }
    try {
      const B = await t.json("/radio/gift/batches?creator=" + encodeURIComponent(S));
      for (const z of (B == null ? void 0 : B.batches) ?? []) {
        const J = H.find((gt) => gt.id === z.id);
        if (J) {
          J.error || (J.view = z);
          continue;
        }
        H.push({ id: z.id, codes: [], count: z.count, amount: z.amount, label: z.label, player: z.player, depositTo: "", deposit: z.deposit, memo: z.memo, at: 0, view: z });
      }
    } catch {
    }
    bt(S, H), t.changed();
  }
  async function ge(S, H) {
    const B = N(S).find((z) => z.id === H);
    if (!(!B || !B.depositTo || U)) {
      U = "Approve the payment in your wallet…", V = "", t.changed();
      try {
        const z = await t.pay(S, B.depositTo, BigInt(B.deposit), B.memo), J = N(S), gt = J.find((Rt) => Rt.id === H);
        gt && (gt.txid = z), bt(S, J), V = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", U = "", ie(S);
      } catch (z) {
        V = `${/cancel/i.test(z.message) ? "Payment cancelled." : z.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        U = "", t.changed();
      }
    }
  }
  async function Jt(S, H, B, z) {
    if (U) return;
    if (!H.ok) {
      V = H.reason, t.changed();
      return;
    }
    U = "Sign in your wallet…", V = "", t.changed();
    let J = null;
    try {
      const gt = { creator: S, count: H.count, amount: H.amount.toString(), label: B, issued: t.now(), ...z ? { player: z } : {} }, Rt = await t.sign(S, e$(gt));
      U = "Making your links…", t.changed(), J = await Ht("/radio/gift/batch", { request: gt, signature: Rt });
      const yt = N(S);
      yt.unshift({ id: J.id, codes: J.codes, count: H.count, amount: J.amount, label: B, player: z ?? null, depositTo: J.depositTo, deposit: J.deposit, memo: J.memo, at: t.now() }), bt(S, yt);
    } catch (gt) {
      V = gt.message || "Not made.", U = "", t.changed();
      return;
    }
    U = "", t.changed(), await ge(S, J.id);
  }
  function Ee() {
    const S = !!Ie.value, H = b.value === "max" ? r$(S) : Number(b.value), B = n$(H, S), z = Number(E.value);
    return !Number.isInteger(z) || z < 1 || z > al ? { ok: !1, reason: `Make 1 to ${al} copies at a time.`, album: S, plays: H, amount: B, count: z } : o$(B) ? { ok: !0, reason: "", album: S, plays: H, amount: B, count: z, bill: i$(z, B, S) } : { ok: !1, reason: "Each copy must be 0.1 to 1 STX.", album: S, plays: H, amount: B, count: z };
  }
  const ve = () => {
    const S = Ee();
    if (!S.ok) return S.reason;
    const H = S.bill;
    return `Each copy: ${S.plays.toLocaleString()} paid plays (${ln(H.holders)} to song holders, ${ln(H.fees)} network fees)${S.album ? `, ${ln(H.float)} for the album’s likes` : ""}, ${ln(H.reserve)} kept so a listener can return what is left, + ${ln(H.sendFee)} to send it = ${ln(H.perCopy)} STX. ${S.count} copies = ${ln(H.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, te = (S, H) => H.codes.map((B) => pe(S, B)), Be = it("input");
  Be.type = "range", Be.min = String(iw), Be.max = String(qa), Be.step = "50000", Be.value = String(I), Be.setAttribute("aria-label", "Gift amount");
  const In = it("p", "", "ppp-gift-amount"), Re = er("", () => {
    const S = t.main();
    S && _(S);
  }, "primary"), gn = () => {
    In.textContent = Ge(), Re.textContent = `Gift ${ln(I)} STX`;
  };
  Be.oninput = () => {
    I = BigInt(Be.value), gn();
  };
  const Ge = () => `${ln(I)} STX · about ${ol(I).toLocaleString()} paid plays · you pay ${ln(I + Ya)} STX with the network fee`;
  gn();
  const Te = it("input");
  Te.type = "number", Te.min = "1", Te.max = String(ow), Te.value = "10", Te.setAttribute("aria-label", "How many links");
  const $e = it("input");
  $e.type = "number", $e.min = "0.1", $e.max = "1", $e.step = "0.05", $e.value = String(Number(o0(cl[0])) / 1e6), $e.setAttribute("aria-label", "STX per link");
  const ce = it("input");
  ce.maxLength = 60, ce.placeholder = "Title, e.g. Proof of Sound", ce.setAttribute("aria-label", "Player title");
  const oe = it("input");
  oe.maxLength = 80, oe.placeholder = "Artist (optional)", oe.setAttribute("aria-label", "Player subtitle");
  const Ue = it("textarea");
  Ue.rows = 3, Ue.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Ue.setAttribute("aria-label", "Songs");
  const Ve = it("input");
  Ve.inputMode = "numeric", Ve.placeholder = "Cover inscription number (optional), shown when the album loads", Ve.setAttribute("aria-label", "Cover inscription");
  const le = it("select");
  le.setAttribute("aria-label", "Gift player");
  const Ze = it("select");
  Ze.setAttribute("aria-label", "Plays per link");
  for (const S of cl) Ze.append(gr(`${S.toLocaleString()} plays`, String(o0(S))));
  Ze.append(gr("Max (1 STX)", String(qa)), gr("Custom STX", "")), Ze.onchange = () => {
    Ze.value && ($e.value = String(Number(Ze.value) / 1e6));
  };
  const jt = it("input");
  jt.maxLength = 40, jt.placeholder = "Label, e.g. Launch week", jt.setAttribute("aria-label", "Campaign label");
  const Ie = it("select");
  Ie.setAttribute("aria-label", "Batch album");
  const b = it("select");
  b.setAttribute("aria-label", "Plays per copy");
  for (const S of cl) b.append(gr(`${S.toLocaleString()} plays`, String(S)));
  b.append(gr("Max (1 STX)", "max"));
  const E = it("input");
  E.type = "number", E.min = "1", E.max = String(al), E.value = "10", E.setAttribute("aria-label", "Copies");
  const d = it("input");
  d.maxLength = 40, d.placeholder = "Label, e.g. Opera launch", d.setAttribute("aria-label", "Batch label");
  const X = it("p", "", "ppp-mute"), ct = () => {
    X.textContent = ve();
  };
  for (const S of [Ie, b, E])
    S.oninput = ct, S.onchange = ct;
  ct();
  function lt(S) {
    var J, gt, Rt, yt, Zt, Et;
    const H = (J = S.gate) == null ? void 0 : J.gifts;
    if (!(H != null && H.enabled) || ["off", "elsewhere", "unsupported"].includes(S.step)) return null;
    const B = t.main(), z = [it("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!B)
      z.push(it("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      Re.disabled = !!U, z.push(Be, In, Re), t.now() - T > 3e4 && (T = t.now(), M(B));
      const ot = R(B);
      if (ot.length) {
        const rt = it("ul", "", "ppp-gift-list");
        for (const ht of ot.slice(0, 10)) {
          const At = (gt = ht.view) == null ? void 0 : gt.status, mt = ht.error ? ht.error : !At || At === "pending-deposit" ? ht.txid ? "payment confirming…" : "waiting for your payment" : At === "live" ? "ready to share" : At === "claiming" || At === "claimed" ? "claimed ✓" : At === "refunding" ? "expired · refund on its way" : At === "refunded" ? "expired · refunded to you" : At, qt = it("li");
          if (qt.append(it("span", `${ln(BigInt(ht.amount))} STX`, "t"), it("span", mt, ((Rt = ht.view) == null ? void 0 : Rt.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((yt = ht.view) == null ? void 0 : yt.status) === "live") {
            const on = pe(((Zt = S.gate) == null ? void 0 : Zt.radioUrl) ?? null, ht.code);
            qt.append(cs("gift-copy:" + ht.id, "Copy link", () => on, "tiny", t.changed), cw("gift-share:" + ht.id, "Share", () => $(on), "tiny", t.changed));
          }
          rt.append(qt);
        }
        z.push(rt);
      }
      if (H.admin) {
        const rt = er("Sign and make links", () => {
          const Ut = BigInt(Math.round(Number($e.value) * 1e6));
          wt(B, Number(Te.value), Ut, jt.value.trim(), le.value || void 0);
        }), ht = it("div", "", "ppp-gift-admin"), At = (Ut, Ot) => {
          const Gt = it("label", Ut);
          return Gt.append(Ot), Gt;
        }, mt = G(B), qt = le.value;
        if (le.replaceChildren(gr("No player (plain gift)", ""), ...mt.map((Ut) => gr(`${Ut.title} · ${Ut.tracks} songs`, Ut.id))), mt.some((Ut) => Ut.id === qt) && (le.value = qt), ht.append(
          it("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
          ce,
          oe,
          Ue,
          Ve,
          er("Sign and make player", () => void Kt(B, { title: ce.value, subtitle: oe.value, tracks: Ue.value, cover: Ve.value })),
          it("p", "Campaign links (admin) · paid from the gift treasury", "ppp-cyan"),
          At("Player ", le),
          At("Plays each ", Ze),
          At("Links ", Te),
          At("STX each ", $e),
          jt,
          rt
        ), F) {
          const Ut = F.codes.map((Gt) => {
            var Me;
            return pe(((Me = S.gate) == null ? void 0 : Me.radioUrl) ?? null, Gt);
          }).join(`
`), Ot = it("textarea");
          Ot.readOnly = !0, Ot.value = Ut, Ot.rows = Math.min(8, F.codes.length), ht.append(it("p", `${F.codes.length} links, ${ln(BigInt(F.amount))} STX each. Copy them now: they are not shown again.`, "ppp-warn"), Ot, cs("campaign-copy", "Copy all", () => Ut, "tiny", t.changed));
        }
        const on = er("Sign, pay and make links", () => {
          Jt(B, Ee(), d.value.trim(), Ie.value || void 0);
        });
        on.disabled = !!U;
        const Oe = Ie.value;
        Ie.replaceChildren(gr("No album (starter copies)", ""), ...mt.map((Ut) => gr(`${Ut.title} · ${Ut.tracks} songs`, Ut.id))), mt.some((Ut) => Ut.id === Oe) && (Ie.value = Oe), ct(), ht.append(
          it("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
          At("Album ", Ie),
          At("Plays each ", b),
          At("Copies ", E),
          d,
          X,
          on
        ), t.now() - Mt > 3e4 && (Mt = t.now(), ie(B));
        const kn = N(B);
        if (kn.length) {
          const Ut = it("ul", "", "ppp-gift-list");
          for (const Ot of kn.slice(0, 10)) {
            const Gt = Ot.view, Me = Gt == null ? void 0 : Gt.copies, Ne = Ot.error ? Ot.error : !Gt || Gt.status === "pending-deposit" ? Ot.txid ? "payment confirming…" : "waiting for your payment" : `${Me.claimed} of ${Gt.count} claimed${Me.refunding + Me.refunded ? ` · ${Me.refunded} refunded${Me.refunding ? `, ${Me.refunding} on their way` : ""}` : ""}`, Ln = it("li");
            if (Ln.append(it("span", `${Ot.label || "Batch"} · ${Ot.count} × ${ln(BigInt(Ot.amount))} STX`, "t"), it("span", Ne, "ppp-mute")), !Ot.txid && Ot.depositTo && (!Gt || Gt.status === "pending-deposit") && Ln.append(er("Pay now", () => void ge(B, Ot.id), "tiny")), Ot.codes.length && (Gt == null ? void 0 : Gt.status) === "live") {
              const Ir = te(((Et = S.gate) == null ? void 0 : Et.radioUrl) ?? null, Ot);
              Ln.append(
                cs("batch-copy:" + Ot.id, "Copy all links", () => Ir.join(`
`), "tiny", t.changed),
                cs("batch-csv:" + Ot.id, "Copy as CSV", () => ["copy,link", ...Ir.map((kr, Lr) => `${Lr + 1},${kr}`)].join(`
`), "tiny", t.changed)
              );
            } else Ot.codes.length || Ln.append(it("span", "links were made on another device", "ppp-mute"));
            Ut.append(Ln);
          }
          ht.append(Ut);
        }
        z.push(ht);
      }
    }
    return U && z.push(it("p", U, "ppp-cyan")), V && z.push(it("p", V, /✓/.test(V) ? "ppp-ok" : "ppp-warn")), k.replaceChildren(...z), k;
  }
  return { banner: O, funder: p, renderFold: lt, liveGift: o, setAside: a, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: D };
}
const g$ = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function y$(t) {
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
const w$ = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function b$(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((i) => (!e.pinnedOnly || e.pins.has(i.slot)) && (() => {
    const o = w$(i);
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
function m$(t, e = 100) {
  const n = Object.entries(t).sort((r, s) => s[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const gi = 12, x$ = 5e3, un = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, yi = (t, e, n = "") => {
  const r = un("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function S$(t) {
  let e, n = [], r = 0, s = !1, i = !1, o = -1 / 0, a = "", c = "recent", u = !1, f = gi;
  const l = un("div", "", "ppp-shelf-box"), g = (M) => "xtrata.radio.shelf.pins.v1:" + M, h = (M) => "xtrata.radio.shelf.recent.v1:" + M, x = (M, _) => {
    try {
      return JSON.parse(t.store.get(M) || "null") ?? _;
    } catch {
      return _;
    }
  }, m = (M) => new Set(x(g(M), []).filter((_) => Number.isSafeInteger(_))), L = (M) => {
    const _ = x(h(M), {}), nt = {};
    for (const [G, Kt] of Object.entries(_)) Number.isSafeInteger(Number(G)) && typeof Kt == "number" && (nt[Number(G)] = Kt);
    return nt;
  };
  async function D(M) {
    if (!s) {
      s = !0, i = !1;
      try {
        const _ = [];
        let nt = 0, G = 0;
        for (let Kt = 0; Kt < x$ / 100 + 1; Kt++) {
          const wt = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(M)}&after=${nt}&limit=100`);
          if (_.push(...y$(wt == null ? void 0 : wt.shelf)), G = Number(wt == null ? void 0 : wt.total) || _.length, !(wt != null && wt.next) || !Number.isSafeInteger(wt.next)) break;
          nt = wt.next;
        }
        M === e && (n = _, r = G, o = t.now());
      } catch {
        i = !0;
      } finally {
        s = !1, t.changed();
      }
    }
  }
  const O = () => {
    o = -1 / 0;
  }, p = un("input");
  p.type = "search", p.placeholder = "Search title, artist or #", p.setAttribute("aria-label", "Search your albums"), p.oninput = () => {
    a = p.value, f = gi, t.changed();
  };
  const k = un("select");
  k.setAttribute("aria-label", "Sort albums");
  for (const M of g$) {
    const _ = document.createElement("option");
    _.value = M.value, _.textContent = M.label, k.append(_);
  }
  k.onchange = () => {
    c = k.value, f = gi, t.changed();
  };
  const I = yi("", () => {
    u = !u, f = gi, t.changed();
  }, "tiny"), U = un("div", "", "ppp-shelf-tools");
  U.append(p, k, I);
  const V = un("div"), F = un("div");
  function R(M) {
    const _ = M.step === "off" || M.step === "elsewhere" ? void 0 : M.root;
    if (_ !== e && (e = _, n = [], r = 0, o = -1 / 0, f = gi), !_ || M.walletCannotAlbums) return null;
    if (!s && t.now() - o > 5 * 6e4 && D(_), !n.length)
      return i ? (F.replaceChildren(un("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), yi("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(F), l) : null;
    const nt = m(_), G = L(_), Kt = b$(n, { query: a, sort: c, pinnedOnly: u, pins: nt, recents: G });
    p.value !== a && (p.value = a), k.value = c, I.textContent = u ? "★ Pinned only" : "☆ Pinned only", I.setAttribute("aria-pressed", String(u));
    const wt = [];
    if (M.slot > 0 && wt.push(yi("← My player", () => t.open(0), "quiet")), !Kt.length) wt.push(un("p", "No album matches that.", "ppp-mute"));
    else {
      const pe = un("ul", "", "ppp-shelf-list");
      for (const $ of Kt.slice(0, f)) {
        const N = un("li", "", $.slot === M.slot ? "now" : ""), bt = nt.has($.slot), Pt = yi(bt ? "★" : "☆", () => {
          const ge = new Set(nt);
          bt ? ge.delete($.slot) : ge.add($.slot), t.store.set(g(_), JSON.stringify([...ge])), t.changed();
        }, "tiny");
        Pt.setAttribute("aria-label", bt ? `Unpin ${$.player.title}` : `Pin ${$.player.title}`);
        const Ht = [$.player.subtitle, `${Lo($.player).length} ${Lo($.player).length === 1 ? "song" : "songs"}`, $.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Mt = $.slot === M.slot, ie = yi(Mt ? "Playing" : "Play", () => {
          t.store.set(h(_), JSON.stringify(m$({ ...G, [$.slot]: t.now() }))), t.open($.slot);
        }, Mt ? "tiny" : "tiny primary");
        ie.disabled = Mt, N.append(Pt, un("span", $.player.title, "t"), un("span", " " + Ht, "ppp-mute"), ie), pe.append(N);
      }
      wt.push(pe), Kt.length > f && wt.push(yi(`Show more (${Kt.length - f} left)`, () => {
        f += gi, t.changed();
      }, "quiet"));
    }
    return i && wt.push(un("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), V.replaceChildren(...wt), l.firstChild !== U && l.replaceChildren(U, V), l;
  }
  return { render: R, invalidate: O, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const M = L(e), _ = [...n].filter((nt) => nt.player).sort((nt, G) => (M[G.slot] ?? 0) - (M[nt.slot] ?? 0) || G.slot - nt.slot)[0];
    return _ ? { slot: _.slot, title: _.player.title } : null;
  } };
}
const A$ = [
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
function E$(t) {
  for (const [e, n] of A$) if (n.test(t)) return e;
  return null;
}
const lw = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), uw = (t) => /Android/.test(t);
function v$(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : lw(e) ? "x-safari-" + n.href : uw(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const $$ = (t) => lw(t) ? "Safari" : uw(t) ? "Chrome" : "your browser", u0 = document.getElementById("ppp");
u0 && I$(u0);
function I$(t) {
  var Ie;
  const e = Gw(), n = (b) => t.querySelector(b), r = n(".ppp-frame");
  let s = null;
  const i = async (b, E) => {
    const d = await fetch(b, { cache: "no-store", ...E, signal: AbortSignal.timeout(15e3) }), X = await d.json().catch(() => ({}));
    if (!d.ok) throw new Error((X == null ? void 0 : X.error) || `Request failed (${d.status}).`);
    return X;
  }, o = fv({
    now: Date.now,
    main: () => {
      const b = e.load();
      return b.isConnected && b.network === "mainnet" ? b.address : void 0;
    },
    config: (b) => i("/radio/listening-wallet/config?main=" + encodeURIComponent(b || "")),
    links: async (b) => (await i("/radio/listening-wallet/link?main=" + encodeURIComponent(b))).links ?? [],
    mainOf: async (b) => {
      var d;
      const E = (await i("/radio/listening-wallet/link?listening=" + encodeURIComponent(b))).links;
      return ((d = E == null ? void 0 : E.find((X) => X.listening === b)) == null ? void 0 : d.main) ?? null;
    },
    saveLink: async (b) => {
      await i("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b) });
    },
    bridge: async (b) => {
      s = document.createElement("iframe"), s.title = "Xtrata listening wallet", s.setAttribute("allow", `publickey-credentials-get ${b}; publickey-credentials-create ${b}`), s.referrerPolicy = "no-referrer";
      const E = new Promise((lt, Yt) => {
        s.addEventListener("load", () => lt(), { once: !0 }), setTimeout(() => Yt(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = b + "/", r.replaceChildren(s), await E;
      const d = new Nw({ walletOrigin: b, frame: s, timeoutMs: 30 * 6e4 }), X = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), ct = (lt, Yt) => X.has(lt) ? d.request(lt, Yt) : Promise.race([
        d.request(lt, Yt),
        new Promise((S, H) => setTimeout(() => H(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await ct("listening.status"), { request: ct };
    },
    chain: {
      verify: C6,
      balance: T6,
      account: B6,
      owner: _6,
      broadcast: H6,
      transaction: M6,
      confirmedNonce: async (b) => {
        const E = await ds(`/v2/accounts/${b}?proof=0`);
        if (!Number.isSafeInteger(E == null ? void 0 : E.nonce) || E.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(E.nonce);
      }
    },
    signWithMain: (b, E) => Rh({ ...E, network: "mainnet", stxAddress: b }),
    deposit: (b, E, d) => new Promise((X, ct) => Oh({
      recipient: E,
      amount: d.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: b,
      network: new ul(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (lt) => X(lt.txId || ""),
      onCancel: () => ct(new Error("Deposit cancelled. Nothing was sent.")),
      onError: ct
    })),
    validate: N6,
    tabLock: (b) => new Promise((E) => {
      const d = navigator.locks;
      if (!(d != null && d.request)) {
        E(!0);
        return;
      }
      d.request("xtrata-ppp:" + b, { ifAvailable: !0 }, async (X) => {
        E(!!X), X && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (b) => {
        try {
          return localStorage.getItem(b);
        } catch {
          return null;
        }
      },
      set: (b, E) => {
        try {
          localStorage.setItem(b, E);
        } catch {
        }
      }
    },
    changed: () => le(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (b) => {
      var E, d;
      return a.funder(b, () => rv(b, ds), !!((d = (E = o.snapshot().gate) == null ? void 0 : E.gifts) != null && d.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (b) => {
      const E = await i("/radio/gift/for?wallet=" + encodeURIComponent(b)), d = E == null ? void 0 : E.gift;
      if (!d) return null;
      if (typeof d.returnTo != "string" || typeof d.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: d.returnTo, from: typeof d.from == "string" ? d.from : null, source: String(d.source ?? ""), amount: String(d.amount ?? "0"), treasury: d.treasury, state: d.state === "sending" ? "sending" : "arrived", player: d.player ?? null };
    },
    history: (b, E) => ov(b, (d) => ds(d), E),
    likesChanged: () => {
      var b, E;
      (E = (b = window.XtrataRadio) == null ? void 0 : b.refreshLikes) == null || E.call(b);
    },
    likeState: async (b, E) => {
      const d = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: b, ids: String(E) })), X = Array.isArray(d == null ? void 0 : d.rows) ? d.rows.find((ct) => (ct == null ? void 0 : ct.id) === E) : null;
      if (!X || typeof X.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: X.liked, by: Array.isArray(X.by) ? X.by.filter((ct) => typeof ct == "string") : X.liked ? [b] : [] };
    },
    likeSent: (b, E) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: b, liked: E } })),
    nameOf: (b) => A(b) ?? void 0,
    likeConfirmed: (b, E) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: b, liked: E } })),
    likeFailed: (b) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: b } }))
  }), a = p$({
    json: i,
    main: () => {
      const b = e.load();
      return b.isConnected && b.network === "mainnet" ? b.address : void 0;
    },
    pay: (b, E, d, X) => new Promise((ct, lt) => Oh({
      recipient: E,
      amount: d.toString(),
      memo: X,
      stxAddress: b,
      network: new ul(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (Yt) => ct(Yt.txId || ""),
      onCancel: () => lt(new Error("Gift cancelled. Nothing was sent.")),
      onError: lt
    })),
    sign: (b, E) => Rh({ ...E, network: "mainnet", stxAddress: b }),
    giftSent: (b, E) => o.giftSent(b, E),
    album: { bind: (b) => o.bindAlbum(b), arrived: async (b, E, d, X) => {
      c.invalidate(), await o.albumArriving(b, E, d, X);
    } },
    who: (b) => _(b),
    changed: () => le(o.snapshot()),
    store: {
      get: (b) => {
        try {
          return localStorage.getItem(b);
        } catch {
          return null;
        }
      },
      set: (b, E) => {
        try {
          E === null ? localStorage.removeItem(b) : localStorage.setItem(b, E);
        } catch {
        }
      }
    },
    now: Date.now
  }), c = S$({
    json: i,
    open: (b) => {
      o.openAlbum(b);
    },
    store: {
      get: (b) => {
        try {
          return localStorage.getItem(b);
        } catch {
          return null;
        }
      },
      set: (b, E) => {
        try {
          E === null ? localStorage.removeItem(b) : localStorage.setItem(b, E);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => le(o.snapshot())
  });
  window.XtrataRadioLikeHandler = (b) => {
    if (!b || !Number.isSafeInteger(b.song) || b.song < 0) return !1;
    pe();
    const E = $(b.song, { title: b.title, artist: b.artist });
    return o.heart({ song: b.song, title: E.title || void 0, artist: E.artist || void 0, likedBy: Array.isArray(b.likedBy) ? b.likedBy : void 0 });
  };
  let u;
  window.XtrataRadioListeningIdentity = () => {
    const b = o.snapshot();
    return b.solo && b.step !== "off" && b.step !== "elsewhere" ? b.listening : void 0;
  };
  const f = (b) => {
    var d, X;
    const E = window.XtrataRadioListeningIdentity();
    E !== u && (u = E, (X = (d = window.XtrataRadio) == null ? void 0 : d.refreshLikes) == null || X.call(d));
  };
  let l = "", g = null, h = !1;
  const x = (b) => {
    var Yt, S, H, B, z, J;
    const E = window.XtrataRadio;
    if (!(E != null && E.setGiftPlayer) || !(E != null && E.setGiftStop)) return;
    const d = b.step === "off" || b.step === "elsewhere" ? null : ((Yt = b.gift) == null ? void 0 : Yt.player) ?? null, X = d ? d.id + ":" + d.cover + ":" + d.tracks.map((gt) => gt.id).join(",") : "";
    X !== l && (E.setGiftPlayer(d ? { id: d.id, title: d.title, subtitle: d.subtitle, tracks: Lo(d).map((gt) => gt.id), hidden: ((S = d$(d)) == null ? void 0 : S.id) ?? null, cover: d.cover } : null), l = X);
    const ct = ((H = b.giftStop) == null ? void 0 : H.text) ?? null;
    ct !== g && (E.setGiftStop(ct), g = ct);
    const lt = !!d && !!((B = b.albumLock) != null && B.locked);
    lt !== h && ((z = E.setGiftLock) == null || z.call(E, lt), h = lt), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(b.step) && ((J = E.forgetWallets) == null || J.call(E));
  }, m = (b) => b ? b.slice(0, 6) + "…" + b.slice(-4) : "", L = (b) => (Number(b) / 1e6).toFixed(b < 1000n ? 6 : 4), D = (b) => {
    const E = Math.round((Date.now() - b) / 6e4);
    return E < 1 ? "now" : E < 60 ? `${E}m` : E < 1440 ? `${Math.round(E / 60)}h` : `${Math.round(E / 1440)}d`;
  }, O = (b) => `https://explorer.hiro.so/txid/${b}?chain=mainnet`, p = (b, E = "", d = "") => {
    const X = document.createElement(b);
    return E && (X.textContent = E), d && (X.className = d), X;
  }, k = (b, E, d = "") => {
    const X = p("button", b, d);
    return X.type = "button", X.onclick = E, X;
  }, I = (b, E) => {
    const d = p("a", b);
    return d.href = E, d.target = "_blank", d.rel = "noopener", d;
  };
  let U = null, V = location.hash === "#give";
  V && history.replaceState(null, "", location.pathname + location.search);
  let F = !1;
  const R = Xv((b) => Wv({ address: b, network: "mainnet" }), () => le(o.snapshot())), A = (b) => R.get(b), T = E$(navigator.userAgent), M = (b, E) => {
    const d = navigator.userAgent, X = $$(d), ct = `${location.origin}${location.pathname}${E ? `#gift=${E}` : ""}`, lt = [p("p", `You are in ${b}'s built-in browser, where passkeys often do not work. Open this page in ${X} to make your listening wallet${E ? " and claim your gift" : ""}.`, "ppp-warn")], Yt = p("div", "", "ppp-open-row"), S = v$(ct, d);
    if (S) {
      const H = p("a", `Open in ${X}`, "primary ppp-open-in");
      H.href = S, H.dataset.homeAction = "radio:open-in-browser", Yt.append(H);
    }
    return Yt.append(cs("copy-page-link", "Copy link", () => ct, S ? "" : "primary", () => le(o.snapshot()))), lt.push(Yt, p("p", `If that does not open ${X}, use ${b}'s menu (••• or ⋮) and choose "Open in ${X === "your browser" ? "browser" : X}", or paste the copied link there.`, "ppp-mute")), lt;
  }, _ = (b) => A(b) ?? m(b), nt = (b) => b.slice(0, 2).map(_).join(" and ") + (b.length > 2 ? ` and ${b.length - 2} more` : ""), G = /* @__PURE__ */ new Map();
  let Kt = !1;
  const wt = (b) => !b || /^(?:Inscription )?#\d+$/.test(b.trim()), pe = () => {
    Kt || (Kt = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((b) => b.ok ? b.json() : null).then((b) => {
      for (const E of Array.isArray(b == null ? void 0 : b.tracks) ? b.tracks : []) {
        const d = Number(E == null ? void 0 : E.id);
        Number.isSafeInteger(d) && G.set(d, { title: typeof E.title == "string" ? E.title : void 0, artist: typeof E.artist == "string" ? E.artist : void 0 });
      }
      le(o.snapshot());
    }).catch(() => {
      Kt = !1;
    }));
  }, $ = (b, E) => {
    const d = G.get(b), X = Yv(b, [d == null ? void 0 : d.title, E == null ? void 0 : E.title].find((lt) => !wt(lt)) || ""), ct = qv(b, (d == null ? void 0 : d.artist) || (E == null ? void 0 : E.artist) || "");
    return { title: X, artist: ct };
  }, N = (b) => {
    const { title: E, artist: d } = $(b.song, b);
    return E ? `“${E}”${d ? ` — ${d}` : ""}` : `Song #${b.song}${d ? ` — ${d}` : ""}`;
  }, bt = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Pt = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function Ht(b) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(b.step) ? ["", ""] : b.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : b.step === "over" ? ["OVER 1 STX", "bad"] : b.step === "locked" ? ["LOCKED", "mute"] : b.step === "intro" || b.step === "link" ? ["", ""] : b.step === "fund" ? b.depositPending ? ["ON ITS WAY", "warn"] : b.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : b.payingOn && b.session && b.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function Mt(b, E, d = "", X) {
    const ct = p("dt", b), lt = p("dd", E, d);
    return X && lt.append(" ", X), [ct, lt];
  }
  const ie = document.getElementById("ppp-top"), ge = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Jt = () => {
    var E, d;
    const b = o.snapshot();
    if (b.step === "connect" || b.step === "wrong-wallet") {
      (E = document.getElementById("radio-wallet-connect")) == null || E.click();
      return;
    }
    if (b.step === "elsewhere" && ((d = b.gate) != null && d.radioUrl)) {
      location.href = b.gate.radioUrl;
      return;
    }
    b.step === "locked" && !b.armed && !b.busy && o.unlock(), b.step === "ready" && !b.payingOn && !b.busy && o.switchOn(), ge();
  };
  ie && (ie.onclick = Jt);
  function Ee(b) {
    if (!ie) return;
    const E = (X, ct, lt) => {
      ie.hidden = !1, ie.className = "ppp-top" + (ct ? " is-" + ct : ""), ie.replaceChildren(p("span", "", "dot"), document.createTextNode(X)), ie.title = lt;
    }, d = b.session ? Math.min(b.session.playsLeft, b.playsLeft) : 0;
    switch (b.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        ie.hidden = !0;
        return;
      case "elsewhere":
        return E("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        ie.hidden = !0;
        return;
      case "intro":
        return E("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "wrong-wallet":
        return E(`Connect ${_(b.linked)}`, "warn", `This device's listening wallet belongs to ${_(b.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return E(b.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return E("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return b.depositPending ? E("Funds on their way", "quiet", "Paying starts by itself when they land") : E(b.entries.some((X) => X.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return E("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return E("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return b.payingOn && d > 0 ? E(`On · ${d.toLocaleString()} plays left`, "on", "Paying artists as you listen") : E("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  const ve = document.getElementById("pppNudge"), te = document.getElementById("onair");
  (Ie = ve == null ? void 0 : ve.querySelector("button")) == null || Ie.addEventListener("click", () => Jt());
  const Be = {
    elsewhere: "Listening free · artists get nothing",
    connect: "Not paying artists",
    intro: "Not paying artists",
    locked: "Locked · not paying artists",
    "wrong-wallet": "Wrong wallet connected · not paying artists",
    link: "Not paying artists yet",
    fund: "No funds yet · artists unpaid",
    over: "Paused · artists unpaid",
    ready: "Paying is off · artists get nothing"
  }, In = {
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
  function Re(b) {
    var Yt;
    if (b.step === "loading") return;
    const E = b.session ? Math.min(b.session.playsLeft, b.playsLeft) : 0, d = b.step === "ready" && b.payingOn && E > 0, X = b.step === "fund" && b.depositPending, ct = d || X ? "" : Be[b.step] ?? "", lt = d ? "on" : ct ? "off" : "";
    if (lt ? document.documentElement.dataset.ppp = lt : delete document.documentElement.dataset.ppp, te && (te.hidden = !lt, te.querySelector(".onair-sub").textContent = d ? `Paying artists · ${E.toLocaleString()} plays left` : "Not paying"), ve && (ve.hidden = lt !== "off", lt === "off")) {
      const S = Math.floor(Number(1000000n / Pn(BigInt(((Yt = b.gate) == null ? void 0 : Yt.limits.playFee) ?? "300"))));
      ve.querySelector(".nudge-t").textContent = "⚠ " + ct, ve.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${S.toLocaleString()} plays, on-chain, straight to the artists.`, ve.querySelector("button").textContent = In[b.step] ?? "Start paying";
    }
  }
  let gn = "";
  function Ge(b) {
    const E = p("div", "", "ppp-pick");
    b.funderMultiple && b.returnToKind === "funder" && E.append(p("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), b.returnToKind === "funder" && E.append(p("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const d = p("input");
    d.type = "text", d.placeholder = "SP… address to send returns to", d.autocomplete = "off", d.spellcheck = !1, d.setAttribute("aria-label", "Address to return funds to"), d.value = gn, d.oninput = () => {
      gn = d.value;
    };
    const X = k(b.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(d.value), gn = "";
    }, "tiny");
    return E.append(d, " ", X), b.returnToKind === "chosen" && E.append(" ", k("Back to the funder", () => o.clearReturnAddress(), "tiny")), E;
  }
  const Te = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function $e() {
    const b = p("p", Te + " ", "ppp-mute");
    return b.append(I("Xverse", "https://www.xverse.app/download"), " · ", I("Leather", "https://leather.io/install-extension")), b;
  }
  let ce = "";
  const oe = (b) => {
    const E = document.documentElement, d = b.solo && !b.main ? b.listening ? m(b.listening) : "new" : "", X = yv() ? "1" : "";
    `${d}|${X}` !== ce && (ce = `${d}|${X}`, d ? E.dataset.pppSolo = d : delete E.dataset.pppSolo, X ? E.dataset.pppWalletInstalled = X : delete E.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const b of [1500, 4e3, 9e3]) setTimeout(() => le(o.snapshot()), b);
  function Ue(b, E = "") {
    var ct;
    const d = p("div", "", "ppp-topup"), X = (ct = b.likeFunds) == null ? void 0 : ct.balance;
    d.append(p("span", "Add plays from My player: ", "ppp-mute"));
    for (const lt of pu) {
      const Yt = k(`+${(Number(lt) / 1e6).toFixed(2)} STX`, () => void o.topUpAlbum(lt), E);
      Yt.disabled = X === void 0 || X < lt + 6000n || b.depositPending || !!b.busy, d.append(Yt);
    }
    return X !== void 0 && X < pu[0] + 6000n && d.append(p("p", "My player is nearly empty: add STX to it first (switch to My player above).", "ppp-mute")), d;
  }
  function Ve(b) {
    const E = b.likeFunds;
    if (!E || !E.album || !E.low && !E.pending) return [];
    const d = p("div", "", "ppp-pick ppp-lowbox");
    if (!E.low) {
      const ct = p("p", "Top-up for your main listener wallet is on its way. ", "ppp-warn");
      return E.txid && ct.append(I("View", O(E.txid))), d.append(ct), [d];
    }
    d.append(p("p", "⚠ YOUR MAIN LISTENER WALLET IS OUT OF FUNDS", "ppp-bad ppp-lowtitle")), d.append(p("p", "It signs every like for all your albums, so they all count for you. Likes are paused until it has a little STX. 0.1 STX is hundreds of likes.")), d.append(p("p", E.address, "ppp-addr-full"));
    const X = p("div", "", "ppp-open-row");
    if (X.append(cs("copy-likes-address", "Copy address", () => E.address, "primary", () => le(o.snapshot()))), E.main && !b.solo) {
      const ct = Ts - (E.balance ?? 0n);
      ct > 0n && X.append(k(`Pay ${On(ct)} STX from my wallet`, () => void o.topUpLikes(), "primary"));
    }
    return d.append(X), d.append(p("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [d];
  }
  function le(b) {
    var Lr, ai, De, ci, ws, li, Cr, Br, yn, Tr, bs, _r, ms;
    const E = a.inProgress(b), d = E && b.step === "fund" ? { ...b, depositPending: !0 } : b;
    if (f(), x(b), oe(d), Ee(d), Re(d), t.hidden = d.step === "off", t.hidden) return;
    const [X, ct] = Ht(d), lt = n(".ppp-state");
    lt.textContent = X, lt.className = "ppp-state" + (ct ? " ppp-state--" + ct : ""), lt.hidden = !X;
    const Yt = !!d.busy || d.armed, S = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(d.step) && (Yt || !["intro", "loading"].includes(d.step));
    r.hidden = !S, r.classList.toggle("ppp-frame--rest", !Yt && !F);
    const H = n(".ppp-frame-label");
    H.hidden = !0;
    const B = dv(d) ?? U;
    U = B;
    const z = pv(d, B);
    n(".ppp-badge").hidden = !z;
    const J = n(".ppp-steps"), gt = n(".ppp-stage");
    J.hidden = gt.hidden = !z, B && z && (J.replaceChildren(...gu(d.solo).map((K, tt) => {
      const ue = p("li", "", tt < B.at ? "done" : tt === B.at ? B.blocked ? "now blocked" : "now" : "");
      return ue.append(p("span", tt < B.at ? "✓" : String(tt + 1), "n"), K), tt === B.at && ue.setAttribute("aria-current", "step"), ue;
    })), gt.textContent = B.caption, gt.className = "ppp-stage " + (B.at >= gu(d.solo).length ? "ppp-ok" : B.blocked ? "ppp-bad" : "ppp-cyan"));
    const Rt = n(".ppp-facts"), yt = [];
    d.main && ((Lr = d.gate) != null && Lr.here) && !d.solo && yt.push(...Mt("Your wallet", _(d.main), "ppp-addr-short"));
    const Zt = () => {
      if (!d.listening) return;
      const K = cs("copy-listening", "Copy", () => d.listening || "", "tiny", () => le(o.snapshot()));
      yt.push(...Mt(d.slot > 0 ? "Album wallet" : d.linked ? "My player (technical)" : "My player wallet", m(d.listening), "ppp-addr-short", K));
    };
    if (d.linked || Zt(), d.listening && d.step !== "intro")
      if (d.linked)
        yt.push(...Mt("Credited to", `${_(d.linked)} · plays, likes and returns`, d.linked === d.main || d.solo ? "ppp-ok" : "ppp-warn")), Zt();
      else if (d.solo) {
        d.creditedTo && yt.push(...Mt("Credited to", `${_(d.creditedTo)} · plays and likes`, "ppp-ok"));
        const K = d.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : d.returnTo ? `${_(d.returnTo)} · ${d.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : d.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        yt.push(...Mt("Returns go to", d.gift ? K : d.returnTo && !A(d.returnTo) ? K.replace(m(d.returnTo), d.returnTo) : K, d.returnTo && !d.gift ? "ppp-addr-full" : "ppp-mute"));
      } else yt.push(...Mt("Linked to", "not linked yet", "ppp-warn"));
    if (d.linkedListening.length && ((ai = d.gate) != null && ai.here)) {
      const K = d.linkedListening.map((tt) => m(tt) + (tt === d.listening ? " (this one)" : "")).join(", ");
      yt.push(...Mt(d.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", K, "ppp-addr-short"));
    }
    if (d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step)) {
      const K = d.step === "fund" && d.depositPending ? "ppp-mute" : d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      yt.push(...Mt("Balance", `${On(d.balance)} STX · about ${d.playsLeft.toLocaleString()} plays`, K));
    }
    const Et = d.entries.find((K) => K.kind === "play");
    Et && pe(), Et && yt.push(...Mt("Last paid song", `${N(Et)} → ${_(Et.recipient)}`, bt[Et.status] || "")), Rt.replaceChildren(...yt), Rt.hidden = !yt.length;
    const ot = [], rt = [], ht = [], At = [], mt = Pn(BigInt(((De = d.gate) == null ? void 0 : De.limits.playFee) ?? "300")), qt = `Each song you listen to for 30 seconds sends ${On(Wa)} STX to whoever holds it, plus a ${On(mt - Wa)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, on = !!d.busy;
    switch (d.step) {
      case "elsewhere": {
        if (ot.push(p("p", "Pay artists as you listen.")), (ci = d.gate) != null && ci.radioUrl) {
          const tt = p("p");
          tt.append(I("Open the pay-per-play radio →", d.gate.radioUrl)), ot.push(tt);
        }
        rt.push(p("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (d.linked) {
          const tt = [d.linked, ...d.others];
          ot.push(p("p", tt.length > 1 ? `This device has listening wallets for ${nt(tt)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${_(d.linked)}. Connect that wallet to keep paying artists.`)), rt.push(p("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          ot.push(p("p", "Connect your wallet to pay artists as you listen.")), rt.push(p("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        ot.push(p("p", `This device's listening wallet belongs to ${_(d.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), rt.push(p("p", `You are connected as ${_(d.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), rt.push(p("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), ht.push(k("Switch wallet", () => {
          var tt;
          return (tt = document.getElementById("radio-wallet-connect")) == null ? void 0 : tt.click();
        }, "primary"));
        break;
      case "not-invited":
        ot.push(p("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        ot.push(p("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        ot.push(p("p", `Pay artists ${On(mt)} STX a song as you listen.`)), rt.push(p("p", qt)), rt.push(p("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), rt.push(p("p", d.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !d.solo && d.main && d.others.length ? (ot.push(p("p", `This device already has a listening wallet for ${nt(d.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), rt.push(p("p", `Otherwise, set up a new listening wallet for ${_(d.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !d.solo && d.main && rt.push(p("p", `This is the listening wallet for ${_(d.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), d.solo && rt.push(p("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const K = a.liveGift();
        ht.push(k(K ? "Claim my gift · no wallet needed" : d.solo ? "Turn on pay-per-play · no wallet needed" : d.others.length && d.main ? `Set up for ${_(d.main)}` : "Turn on pay-per-play", () => void o.create(), "primary")), !K && !d.solo && d.main && d.others.length && ht.push(k("Switch wallet", () => {
          var tt;
          return (tt = document.getElementById("radio-wallet-connect")) == null ? void 0 : tt.click();
        })), !K && d.solo && ht.push(k("I have a Stacks wallet", () => {
          var tt;
          return (tt = document.getElementById("radio-wallet-connect")) == null ? void 0 : tt.click();
        })), ht.push(k("I already have a listening wallet", () => void o.unlock(!0))), K && ht.push(k("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        d.armed || (ot.push(p("p", "Locked.", "ppp-mute")), ht.push(k(d.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), At.push(k("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        ot.push(p("p", `Link to ${_(d.main)} · free`)), rt.push(p("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), rt.push(p("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), ht.push(k(d.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        ot.push(p("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (d.depositPending || ((ws = d.gift) != null && ws.player ? ot.push(p("p", "Out of plays · add more to keep listening", "ppp-bad")) : d.entries.length ? ot.push(p("p", "Out of funds · top up to keep paying", "ppp-bad")) : ot.push(p("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / mt)).toLocaleString()} songs`))), (li = d.gift) != null && li.player ? rt.push(p("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : d.entries.length && rt.push(p("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), d.payingOn && !d.entries.length && rt.push(p("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), E || (d.solo ? (rt.push(p("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), rt.push(p("p", d.listening || "", "ppp-addr-full")), d.listening && !d.depositPending && ht.push(cs("copy-address", "Copy my address", () => d.listening || "", "primary", () => le(o.snapshot())))) : rt.push(p("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute"))), d.depositPending && d.depositTxid) {
          const tt = p("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          tt.append(I("View", O(d.depositTxid))), ot.push(tt);
        } else d.allowance > 0n && !d.solo && ht.push(k(`Deposit ${On(d.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        ot.push(p("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), d.solo && !d.returnTo && (ot.push(p("p", d.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), ot.push(Ge(d))), (!d.solo || d.returnTo) && ht.push(k("Return excess", () => void o.returnFunds("excess"), "primary"), k("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (d.payingOn && d.session && d.session.playsLeft > 0) {
          const tt = Math.min(d.session.playsLeft, d.playsLeft);
          ot.push(p("p", `Paying as you listen · up to ${tt.toLocaleString()} plays left`, "ppp-ok")), rt.push(p("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), ht.push(k("Switch off", () => void o.switchOff()));
        } else
          ot.push(p("p", "Paying is off. Music stays free.", "ppp-mute")), ht.push(k("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        d.queued && ot.push(p("p", d.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${d.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), d.balanceState === "low" && ot.push(p("p", "Running low · top up", "ppp-warn")), d.depositPending ? ot.push(p("p", "Top-up on its way…", "ppp-warn")) : d.allowance > 0n && d.balanceState !== "ok" && !d.solo && ht.push(k(`Top up ${On(d.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (d.solo && d.walletCannotSolo && rt.push(p("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), d.solo && ["fund", "ready"].includes(d.step) && ((d.balance ?? 0n) > 0n && d.slot === 0 && rt.push(Ge(d)), rt.push($e()), d.slot === 0 && d.step === "ready" && d.entries.some((K) => K.kind === "play" && K.status === "confirmed"))) {
      const K = p("p", "New to Stacks? ", "ppp-mute");
      K.append(I("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), ot.push(K);
    }
    if (d.walletOutdated && rt.push(p("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), d.stuck && (ot.push(p("p", d.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${d.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), ht.push(k("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(d.step) && (d.returnTo || d.gift) && (d.balance ?? 0n) > 0n && At.push(k(d.linked ? "Return all to my wallet" : d.gift ? "Return what is left…" : `Return all to ${_(d.returnTo)}`, () => void o.returnFunds("all"), "quiet")), d.slot > 0 && ((Cr = d.gift) != null && Cr.player) && ["ready", "fund"].includes(d.step) && d.giftPlays > 20 && At.push(Ue(d, "quiet")), ["ready", "fund", "link", "over"].includes(d.step) && At.push(k("Lock", () => void o.lock(), "quiet")), S && !Yt && At.push(k(F ? "Hide listening wallet box" : "Show listening wallet box", () => {
      F = !F, le(o.snapshot());
    }, "quiet")), [...ht, ...At].forEach((K) => K.disabled = on), on && (ht.length = 0), d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step) && !(d.step === "fund" && d.depositPending && d.balance === 0n) && !((Br = d.gift) != null && Br.player)) {
      const K = d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad", tt = ot.at(0);
      d.step === "ready" && tt ? tt.append(p("span", ` · ${L(d.balance)} STX`, K)) : ot.push(p("p", `Balance ${L(d.balance)} STX`, K));
    }
    if ((yn = d.gift) != null && yn.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(d.step)) {
      const K = p("p", "", "ppp-gift");
      K.append(`💿 Album · ${d.gift.player.title}`), d.gift.player.subtitle && K.append(" · ", d.gift.player.subtitle);
      const tt = ["ready", "fund", "over"].includes(d.step) && d.balance !== void 0 ? d.giftPlays === 0 && d.depositPending ? p("span", " · plays on their way", "ppp-warn") : p("span", d.giftPlays === 0 ? " · no plays left" : ` · ${d.giftPlays.toLocaleString()} ${d.giftPlays === 1 ? "play" : "plays"} left`, d.giftPlays === 0 ? "ppp-bad" : d.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      tt && K.append(tt);
      const ue = (Tr = ot.at(0)) == null ? void 0 : Tr.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (d.step === "ready" && ue && /STX/.test(ue.textContent ?? "") && ue.remove(), ot.unshift(K), d.giftPlays <= 20 && ["ready", "fund"].includes(d.step) && !d.depositPending)
        if (d.slot > 0)
          ot.splice(1, 0, p("p", d.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), Ue(d, "primary"));
        else {
          const me = p("p", d.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          me.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), me.append(I("Xverse", "https://www.xverse.app/download"), " and ", I("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), ot.splice(1, 0, me);
        }
    }
    if (d.gift && !d.linked && ["fund", "ready", "over"].includes(d.step) && d.returnPlan.state === "ready") {
      const K = d.returnPlan, tt = p("div", "", "ppp-pick");
      tt.append(p("p", K.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const ue = p("ul", "", "ppp-gift-list");
      K.steps.forEach((me, xs) => {
        const Kn = me.kind === "gift" ? "the unused gift" : me.kind === "deposit" ? "what was added to it" : "the rest", ae = p("li");
        ae.append(p("span", `${xs + 1}. ${On(BigInt(me.send))} STX · ${Kn}`, "t"), p("span", me.to ? ` → ${_(me.to)}` : " → choose an address below", me.to ? "ppp-mute" : "ppp-warn")), ue.append(ae);
      }), tt.append(ue), K.kept && tt.append(p("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), K.steps.some((me) => !me.to) && tt.append(Ge(d)), tt.append(k(K.steps.length > 1 ? `Confirm part 1 of ${K.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), ot.push(tt);
    }
    ot.unshift(...a.banner(b)), ot.unshift(...Ve(d)), T && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(d.step)) && ot.unshift(...M(T, a.pendingCode())), d.solo && d.creditedTo && d.listening && !["intro", "off", "elsewhere", "loading"].includes(d.step) && ot.unshift(p("p", `This is ${_(d.creditedTo)}'s listening wallet. Plays and likes count for ${_(d.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...ot);
    const Oe = document.querySelector(".ppp-switch");
    if (Oe) {
      const K = c.latest(), tt = d.slot > 0, ue = ["fund", "ready", "over"].includes(d.step) && (tt || !!K);
      if (Oe.hidden = !ue, ue) {
        const me = (Kn, ae, qi, Yi) => {
          const Un = k("", Yi, "ppp-tab");
          return Un.setAttribute("aria-pressed", String(qi)), Un.append(p("span", Kn, "tt"), p("span", ae === void 0 ? "…" : `${L(ae)} STX`, "ts")), Un.disabled = !!d.busy, Un;
        }, xs = tt ? ((_r = (bs = d.gift) == null ? void 0 : bs.player) == null ? void 0 : _r.title) ?? "Album" : K.title;
        Oe.replaceChildren(
          me("🎧 My player", tt ? (ms = d.likeFunds) == null ? void 0 : ms.balance : d.balance, !tt, () => {
            tt && o.openAlbum(0);
          }),
          me("💿 " + xs, tt ? d.balance : void 0, tt, () => {
            !tt && K && o.openAlbum(K.slot);
          })
        );
      }
    }
    const kn = c.render(d), Ut = document.querySelector(".ppp-shelf");
    if (Ut) {
      Ut.hidden = !kn;
      const K = Ut.querySelector("summary");
      K && (K.textContent = c.count() > 0 ? `♪ My albums (${c.count()})` : "♪ My albums");
      const tt = Ut.querySelector(".ppp-shelf-body");
      kn && tt && !tt.contains(kn) && tt.replaceChildren(kn);
    }
    const Ot = a.renderFold(b);
    if (n(".ppp-gifts").hidden = !Ot, Ot && !n(".ppp-gift-body").contains(Ot) && n(".ppp-gift-body").replaceChildren(Ot), Ot && V) {
      V = !1;
      const K = n(".ppp-gifts");
      K.open = !0, requestAnimationFrame(() => K.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...rt), n(".ppp-actions").replaceChildren(...ht), n(".ppp-actions2").replaceChildren(...At);
    const Gt = d.busy || d.message || "", Me = n(".ppp-msg"), Ne = Gt && ot.some((K) => (K.textContent ?? "").startsWith(Gt.replace(/[.✓\s]+$/, ""))) ? "" : Gt, Ln = !Ne && !d.error ? d.notice : "";
    Me.textContent = Ne || Ln, Me.classList.toggle("is-warn", !!Ln), n(".ppp-err").textContent = d.error;
    const Ir = d.entries.filter((K) => K.kind === "play");
    n(".ppp-recent").hidden = !d.entries.length, n(".ppp-recent-list").replaceChildren(...Ir.slice(0, 5).map((K) => {
      const tt = p("li"), ue = K.status === "confirmed" ? "ok" : K.status === "failed" ? "bad" : "warn";
      return tt.append(p("span", "", "d " + ue), p("span", N(K), "t"), p("span", D(K.created), "ppp-mute")), K.txid && tt.append(I("tx", O(K.txid))), tt;
    })), n(".ppp-wallets").hidden = !(Rt.childElementCount || At.length), n(".ppp-more").hidden = !rt.length;
    const kr = n(".ppp-history");
    kr.hidden = !d.entries.length, d.entries.length && pe(), kr.replaceChildren(p("summary", `All activity (${d.entries.length})`), ...d.entries.slice(0, 20).map((K) => {
      const tt = p("div", "", "ppp-row"), ue = K.kind === "play" ? [p("span", N(K), "ppp-song"), p("span", ` · ${On(BigInt(K.amount))} STX to ${_(K.recipient)}`, "ppp-mute")] : K.kind === "like" ? [p("span", `${K.liked ? "♥ Liked" : "Unliked"} ${N(K)}`, "ppp-song"), p("span", ` · for ${d.linked ? _(d.linked) : "this listening wallet"}`, "ppp-mute")] : [p("span", `Returned ${On(BigInt(K.amount))} STX`, "ppp-song"), p("span", ` to ${_(K.recipient)}`, "ppp-mute")];
      return tt.append(
        p("span", Pt[K.status] || K.status, "ppp-status " + (bt[K.status] || "")),
        ...ue,
        p("span", ` · ${new Date(K.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), K.txid && tt.append(I("tx ↗", O(K.txid))), tt;
    }));
  }
  const Ze = /* @__PURE__ */ new Map(), jt = () => {
    const b = window.XtrataRadio;
    return b != null && b.subscribe ? (b.subscribe((E) => {
      const d = E == null ? void 0 : E.nowPlaying;
      d && Number.isSafeInteger(Number(d.tokenId)) && Ze.set(Number(d.tokenId), { title: d.title || void 0, artist: d.artist || void 0 });
    }), !0) : !1;
  };
  if (!jt()) {
    const b = setInterval(() => {
      jt() && clearInterval(b);
    }, 500);
    setTimeout(() => clearInterval(b), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (b) => {
    const E = b.detail;
    if (E && Number.isSafeInteger(E.song) && typeof E.id == "string" && /^[0-9a-f]{32}$/.test(E.id)) {
      pe();
      const d = $(E.song, Ze.get(E.song));
      o.onListened({ song: E.song, id: E.id, title: d.title || void 0, artist: d.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const k$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", L$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, C$ = () => L$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, B$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, T$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', fw = class {
  constructor(t) {
    VA(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && fx(t), this.callback(cc(t));
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
    var r, s, i, o, a, c, u, f, l, g;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (f = (u = t.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(t)) !== null && f !== void 0 ? f : t.webUrl : (g = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && g !== void 0 ? g : this.getMobileUrl(t);
  }
  render() {
    const t = C$(), e = B$(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return vt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, vt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), vt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, vt("div", { class: "flex flex-col space-y-[10px]" }, vt("div", { class: "flex items-center" }, vt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), vt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, vt("span", { class: "sr-only" }, "Close popup"), vt("img", { src: k$ }))), r ? vt("p", null, "Select the wallet you want to connect to.") : vt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && vt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && vt("div", { class: "mt-6" }, vt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), vt("ul", { class: "space-y-3" }, this.installedProviders.map((i) => vt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, vt("div", { class: "aspect-square basis-9 overflow-hidden" }, vt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), vt("div", { class: "flex-1" }, vt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && vt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), vt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && vt("div", { class: "mt-6" }, r ? vt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : vt("div", { class: "mb-5 flex justify-between" }, vt("p", { class: "text-sm font-medium" }, "Recommended wallets"), vt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, vt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, vt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), vt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), vt("p", null, "What is a wallet? ", vt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), vt("ul", { class: "space-y-3" }, n.map((i) => vt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, vt("div", { class: "aspect-square basis-9 overflow-hidden" }, vt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), vt("div", { class: "flex-1" }, vt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && vt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && vt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return IA(this);
  }
};
fw.style = T$;
const _$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: fw
}, Symbol.toStringTag, { value: "Module" }));
