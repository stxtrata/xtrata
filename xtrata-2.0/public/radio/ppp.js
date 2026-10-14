var Ry = Object.defineProperty;
var Gy = (t, e, n) => e in t ? Ry(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var _i = (t, e, n) => Gy(t, typeof e != "symbol" ? e + "" : e, n);
var _e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Vh(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Ca(t) {
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
        var k = {
          next: function() {
            var N = S.shift();
            return { done: N === void 0, value: N };
          }
        };
        return r.iterable && (k[Symbol.iterator] = function() {
          return k;
        }), k;
      }
      function d(S) {
        this.map = {}, S instanceof d ? S.forEach(function(k, N) {
          this.append(N, k);
        }, this) : Array.isArray(S) ? S.forEach(function(k) {
          if (k.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + k.length);
          this.append(k[0], k[1]);
        }, this) : S && Object.getOwnPropertyNames(S).forEach(function(k) {
          this.append(k, S[k]);
        }, this);
      }
      d.prototype.append = function(S, k) {
        S = a(S), k = c(k);
        var N = this.map[S];
        this.map[S] = N ? N + ", " + k : k;
      }, d.prototype.delete = function(S) {
        delete this.map[a(S)];
      }, d.prototype.get = function(S) {
        return S = a(S), this.has(S) ? this.map[S] : null;
      }, d.prototype.has = function(S) {
        return this.map.hasOwnProperty(a(S));
      }, d.prototype.set = function(S, k) {
        this.map[a(S)] = c(k);
      }, d.prototype.forEach = function(S, k) {
        for (var N in this.map)
          this.map.hasOwnProperty(N) && S.call(k, this.map[N], N, this);
      }, d.prototype.keys = function() {
        var S = [];
        return this.forEach(function(k, N) {
          S.push(N);
        }), f(S);
      }, d.prototype.values = function() {
        var S = [];
        return this.forEach(function(k) {
          S.push(k);
        }), f(S);
      }, d.prototype.entries = function() {
        var S = [];
        return this.forEach(function(k, N) {
          S.push([N, k]);
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
        return new Promise(function(k, N) {
          S.onload = function() {
            k(S.result);
          }, S.onerror = function() {
            N(S.error);
          };
        });
      }
      function h(S) {
        var k = new FileReader(), N = g(k);
        return k.readAsArrayBuffer(S), N;
      }
      function m(S) {
        var k = new FileReader(), N = g(k), U = /charset=([A-Za-z0-9_-]+)/.exec(S.type), Z = U ? U[1] : "utf-8";
        return k.readAsText(S, Z), N;
      }
      function b(S) {
        for (var k = new Uint8Array(S), N = new Array(k.length), U = 0; U < k.length; U++)
          N[U] = String.fromCharCode(k[U]);
        return N.join("");
      }
      function C(S) {
        if (S.slice)
          return S.slice(0);
        var k = new Uint8Array(S.byteLength);
        return k.set(new Uint8Array(S)), k.buffer;
      }
      function P() {
        return this.bodyUsed = !1, this._initBody = function(S) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = S, S ? typeof S == "string" ? this._bodyText = S : r.blob && Blob.prototype.isPrototypeOf(S) ? this._bodyBlob = S : r.formData && FormData.prototype.isPrototypeOf(S) ? this._bodyFormData = S : r.searchParams && URLSearchParams.prototype.isPrototypeOf(S) ? this._bodyText = S.toString() : r.arrayBuffer && r.blob && s(S) ? (this._bodyArrayBuffer = C(S.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(S) || o(S)) ? this._bodyArrayBuffer = C(S) : this._bodyText = S = Object.prototype.toString.call(S) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof S == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(S) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
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
            return m(this._bodyBlob);
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
      var _ = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function p(S) {
        var k = S.toUpperCase();
        return _.indexOf(k) > -1 ? k : S;
      }
      function $(S, k) {
        if (!(this instanceof $))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        k = k || {};
        var N = k.body;
        if (S instanceof $) {
          if (S.bodyUsed)
            throw new TypeError("Already read");
          this.url = S.url, this.credentials = S.credentials, k.headers || (this.headers = new d(S.headers)), this.method = S.method, this.mode = S.mode, this.signal = S.signal, !N && S._bodyInit != null && (N = S._bodyInit, S.bodyUsed = !0);
        } else
          this.url = String(S);
        if (this.credentials = k.credentials || this.credentials || "same-origin", (k.headers || !this.headers) && (this.headers = new d(k.headers)), this.method = p(k.method || this.method || "GET"), this.mode = k.mode || this.mode || null, this.signal = k.signal || this.signal || function() {
          if ("AbortController" in n) {
            var G = new AbortController();
            return G.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && N)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(N), (this.method === "GET" || this.method === "HEAD") && (k.cache === "no-store" || k.cache === "no-cache")) {
          var U = /([?&])_=[^&]*/;
          if (U.test(this.url))
            this.url = this.url.replace(U, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var Z = /\?/;
            this.url += (Z.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      $.prototype.clone = function() {
        return new $(this, { body: this._bodyInit });
      };
      function I(S) {
        var k = new FormData();
        return S.trim().split("&").forEach(function(N) {
          if (N) {
            var U = N.split("="), Z = U.shift().replace(/\+/g, " "), G = U.join("=").replace(/\+/g, " ");
            k.append(decodeURIComponent(Z), decodeURIComponent(G));
          }
        }), k;
      }
      function R(S) {
        var k = new d(), N = S.replace(/\r?\n[\t ]+/g, " ");
        return N.split("\r").map(function(U) {
          return U.indexOf(`
`) === 0 ? U.substr(1, U.length) : U;
        }).forEach(function(U) {
          var Z = U.split(":"), G = Z.shift().trim();
          if (G) {
            var ot = Z.join(":").trim();
            try {
              k.append(G, ot);
            } catch (Gt) {
              console.warn("Response " + Gt.message);
            }
          }
        }), k;
      }
      P.call($.prototype);
      function Y(S, k) {
        if (!(this instanceof Y))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (k || (k = {}), this.type = "default", this.status = k.status === void 0 ? 200 : k.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = k.statusText === void 0 ? "" : "" + k.statusText, this.headers = new d(k.headers), this.url = k.url || "", this._initBody(S);
      }
      P.call(Y.prototype), Y.prototype.clone = function() {
        return new Y(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, Y.error = function() {
        var S = new Y(null, { status: 200, statusText: "" });
        return S.ok = !1, S.status = 0, S.type = "error", S;
      };
      var H = [301, 302, 303, 307, 308];
      Y.redirect = function(S, k) {
        if (H.indexOf(k) === -1)
          throw new RangeError("Invalid status code");
        return new Y(null, { status: k, headers: { location: S } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(k, N) {
          this.message = k, this.name = N;
          var U = Error(k);
          this.stack = U.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function q(S, k) {
        return new Promise(function(N, U) {
          var Z = new $(S, k);
          if (Z.signal && Z.signal.aborted)
            return U(new e.DOMException("Aborted", "AbortError"));
          var G = new XMLHttpRequest();
          function ot() {
            G.abort();
          }
          G.onload = function() {
            var E = {
              statusText: G.statusText,
              headers: R(G.getAllResponseHeaders() || "")
            };
            Z.url.indexOf("file://") === 0 && (G.status < 200 || G.status > 599) ? E.status = 200 : E.status = G.status, E.url = "responseURL" in G ? G.responseURL : E.headers.get("X-Request-URL");
            var T = "response" in G ? G.response : G.responseText;
            setTimeout(function() {
              N(new Y(T, E));
            }, 0);
          }, G.onerror = function() {
            setTimeout(function() {
              U(new TypeError("Network request failed"));
            }, 0);
          }, G.ontimeout = function() {
            setTimeout(function() {
              U(new TypeError("Network request timed out"));
            }, 0);
          }, G.onabort = function() {
            setTimeout(function() {
              U(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function Gt(E) {
            try {
              return E === "" && n.location.href ? n.location.href : E;
            } catch {
              return E;
            }
          }
          if (G.open(Z.method, Gt(Z.url), !0), Z.credentials === "include" ? G.withCredentials = !0 : Z.credentials === "omit" && (G.withCredentials = !1), "responseType" in G && (r.blob ? G.responseType = "blob" : r.arrayBuffer && (G.responseType = "arraybuffer")), k && typeof k.headers == "object" && !(k.headers instanceof d || n.Headers && k.headers instanceof n.Headers)) {
            var Ht = [];
            Object.getOwnPropertyNames(k.headers).forEach(function(E) {
              Ht.push(a(E)), G.setRequestHeader(E, c(k.headers[E]));
            }), Z.headers.forEach(function(E, T) {
              Ht.indexOf(T) === -1 && G.setRequestHeader(T, E);
            });
          } else
            Z.headers.forEach(function(E, T) {
              G.setRequestHeader(T, E);
            });
          Z.signal && (Z.signal.addEventListener("abort", ot), G.onreadystatechange = function() {
            G.readyState === 4 && Z.signal.removeEventListener("abort", ot);
          }), G.send(typeof Z._bodyInit > "u" ? null : Z._bodyInit);
        });
      }
      return q.polyfill = !0, n.fetch || (n.fetch = q, n.Headers = d, n.Request = $, n.Response = Y), e.Headers = d, e.Request = $, e.Response = Y, e.fetch = q, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : _e);
})();
const Ky = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Vy(t, e) {
  const n = {};
  return Object.assign(n, Ky, e), await fetch(t, n);
}
function qy(t) {
  let e = Vy, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Wy(...t) {
  const { fetchLib: e, middlewares: n } = qy(t);
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
var ri;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ri || (ri = {}));
var cs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(cs || (cs = {}));
var hf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(hf || (hf = {}));
const Xy = "https://api.mainnet.hiro.so", Yy = "https://api.testnet.hiro.so", Zy = "http://localhost:3999", Qy = ["mainnet", "testnet", "devnet", "mocknet"];
let si = class {
  constructor(e) {
    this.version = cs.Mainnet, this.chainId = ri.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === cs.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Wy();
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
si.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new jc();
    case "testnet":
      return new Jy();
    case "devnet":
      return new tw();
    case "mocknet":
      return new qh();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Qy.join(", ")}`);
  }
};
si.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : si.fromName(t);
let jc = class extends si {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Xy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = cs.Mainnet, this.chainId = ri.Mainnet;
  }
}, Jy = class extends si {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Yy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = cs.Testnet, this.chainId = ri.Testnet;
  }
}, qh = class extends si {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Zy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = cs.Testnet, this.chainId = ri.Testnet;
  }
};
const tw = qh, Wh = "xtrata.wallet.bridge.v1", ew = (t) => typeof t == "object" && t !== null && t.protocol === Wh, nw = (t) => ew(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", rw = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class Ui extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const pf = 12e4;
class sw {
  constructor(e) {
    _i(this, "pending", /* @__PURE__ */ new Map());
    _i(this, "listenTarget");
    _i(this, "closed", !1);
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
    _i(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !nw(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new Ui("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new Ui("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Ui("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = rw(), i = { protocol: Wh, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new Ui(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? pf}ms.`
          )
        );
      }, this.options.timeoutMs ?? pf);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new Ui("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const iw = ["SP", "SM"], ow = ["ST", "SN"], aw = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return iw.includes(n) ? "mainnet" : ow.includes(n) ? "testnet" : null;
}, cw = () => {
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
}, lw = () => typeof window > "u" || !window.localStorage ? cw() : window.localStorage, dc = "xtrata.v15.1.wallet.session", gf = "mainnet", sa = { isConnected: !1 }, uw = (t) => t.address ? aw(t.address) ?? t.network : t.network, Xh = (t) => !t.isConnected || !t.address ? { ...sa } : uw(t) !== gf ? { ...sa } : {
  isConnected: !0,
  address: t.address,
  network: gf,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, fw = (t) => {
  if (!t)
    return { ...sa };
  try {
    const e = JSON.parse(t);
    return Xh(e);
  } catch {
    return { ...sa };
  }
}, dw = (t) => {
  const e = Xh(t);
  return JSON.stringify(e);
}, hw = (t) => {
  const e = lw();
  return {
    load: () => fw(e.getItem(dc)),
    save: (n) => {
      e.setItem(dc, dw(n));
    },
    clear: () => {
      e.removeItem(dc);
    }
  };
}, pw = "https://browser.blockstack.org/auth", gw = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Yh = ["store_write"], yw = "blockstack-session", ww = {
  logLevel: "debug"
}, $s = {
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
Object.freeze($s);
class Si extends Error {
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
class bw extends Si {
  constructor(e, n = "") {
    super({ code: $s.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class yf extends Si {
  constructor(e = "") {
    super({ code: $s.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class xo extends Si {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: $s.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class wf extends Si {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: $s.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class zc extends Si {
  constructor(e) {
    super({ code: $s.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Zh extends Si {
  constructor(e) {
    super({ code: $s.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const bf = ["debug", "info", "warn", "error", "none"], Rc = {};
for (let t = 0; t < bf.length; t++) {
  const e = bf[t];
  Rc[e] = t;
}
class Xs {
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
    return Rc[ww.logLevel] <= Rc[e];
  }
}
function mw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function xw() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function hc(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Sw() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Ew() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Aw(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function ql(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Ew(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    Xs.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = Aw(s, t.toString(), n);
    throw Xs.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Ur(t, e) {
  return Wl(Le(t), e);
}
function Le(t) {
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
  if (Ge(t, Uint8Array))
    return BigInt(`0x${st(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function vw(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function mf(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function oo(t, e = 8) {
  return (typeof t == "bigint" ? t : Le(t)).toString(16).padStart(e * 2, "0");
}
function Ba(t) {
  return parseInt(t, 16);
}
function Wl(t, e = 16) {
  const n = oo(t, e);
  return Pt(n);
}
function $w(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Iw(t, e) {
  return t & BigInt(1) << e;
}
function Gc(t) {
  return kw(BigInt(`0x${st(t)}`), BigInt(t.byteLength * 8));
}
function kw(t, e) {
  return Iw(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Lw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function st(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Lw[n];
  return e;
}
function Pt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = vw(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function Is(t) {
  return new TextEncoder().encode(t);
}
function ao(t) {
  return new TextDecoder().decode(t);
}
function Cw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Bw(t) {
  return String.fromCharCode.apply(null, t);
}
function Tw(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function xf(t) {
  if (t.some(Tw))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Pn(...t) {
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
function fe(t) {
  return Pn(...t.map((e) => typeof e == "number" ? xf([e]) : e instanceof Array ? xf(e) : e));
}
function Ge(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Qh = "https://api.mainnet.hiro.so", Jh = "https://api.testnet.hiro.so", t0 = "http://localhost:3999", Mw = "https://hub.blockstack.org", Nw = 33, pc = 32;
function _w(t) {
  if (t.length < pc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + pc * 2), r = t.slice(2 + pc * 2);
  return {
    recoveryId: Ba(e),
    r: n,
    s: r
  };
}
function Xl(t) {
  const e = typeof t == "string" ? Pt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Uw(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Pw(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Hw(t, e) {
  return t[e];
}
function Ow(t, e, n = 0) {
  return t[n] = e, t;
}
function Dw(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function ls(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Fw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function jw(t, e) {
  const n = {};
  return Object.assign(n, Fw, e), await fetch(t, n);
}
function zw(t) {
  let e = jw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Rw(...t) {
  const { fetchLib: e, middlewares: n } = zw(t);
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
class e0 {
  constructor(e = Yh.slice(), n = ((a) => (a = ql("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = pw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Kc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Gw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function n0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Kw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Kc(t.outputLen), Kc(t.blockLen);
}
function Vw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function qw(t, e) {
  n0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Qr = {
  number: Kc,
  bool: Gw,
  bytes: n0,
  hash: Kw,
  exists: Vw,
  output: qw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const gc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), $n = (t, e) => t << 32 - e | t >>> e, Ww = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Ww)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Xw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Yl(t) {
  if (typeof t == "string" && (t = Xw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let r0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ks(t) {
  const e = (r) => t().update(Yl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let s0 = class extends r0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Qr.hash(e);
    const r = Yl(n);
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
    return Qr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Qr.exists(this), Qr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Ta = (t, e, n) => new s0(t, e).update(n).digest();
Ta.create = (t, e) => new s0(t, e);
function Yw(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let Zl = class extends r0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = gc(this.buffer);
  }
  update(e) {
    Qr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Yl(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = gc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Qr.exists(this), Qr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Yw(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = gc(e), c = this.outputLen;
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
const Zw = (t, e, n) => t & e ^ ~t & n, Qw = (t, e, n) => t & e ^ t & n ^ e & n, Jw = new Uint32Array([
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
]), nr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), rr = new Uint32Array(64);
let i0 = class extends Zl {
  constructor() {
    super(64, 32, 8, !1), this.A = nr[0] | 0, this.B = nr[1] | 0, this.C = nr[2] | 0, this.D = nr[3] | 0, this.E = nr[4] | 0, this.F = nr[5] | 0, this.G = nr[6] | 0, this.H = nr[7] | 0;
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
      rr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = rr[l - 15], h = rr[l - 2], m = $n(g, 7) ^ $n(g, 18) ^ g >>> 3, b = $n(h, 17) ^ $n(h, 19) ^ h >>> 10;
      rr[l] = b + rr[l - 7] + m + rr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = $n(a, 6) ^ $n(a, 11) ^ $n(a, 25), h = d + g + Zw(a, c, f) + Jw[l] + rr[l] | 0, b = ($n(r, 2) ^ $n(r, 13) ^ $n(r, 22)) + Qw(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    rr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, tb = class extends i0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const ii = ks(() => new i0());
ks(() => new tb());
const eb = {}, o0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: eb
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const _t = BigInt(0), Jt = BigInt(1), Cr = BigInt(2), zi = BigInt(3), Sf = BigInt(8), Kt = Object.freeze({
  a: _t,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Jt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Ef = (t, e) => (t + e / Cr) / e, So = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = Kt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Jt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = Ef(i * t, e), c = Ef(-r * t, e);
    let f = V(t - a * n - c * s, e), d = V(-a * r - c * i, e);
    const l = f > o, g = d > o;
    if (l && (f = e - f), g && (d = e - d), f > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: f, k2neg: g, k2: d };
  }
}, Sn = 32, us = 32, a0 = 32, ia = Sn + 1, oa = 2 * Sn + 1;
function Af(t) {
  const { a: e, b: n } = Kt, r = V(t * t), s = V(r * t);
  return V(s + e * t + n);
}
const Eo = Kt.a === _t;
class Ql extends Error {
  constructor(e) {
    super(e);
  }
}
function vf(t) {
  if (!(t instanceof jt))
    throw new TypeError("JacobianPoint expected");
}
class jt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof kt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(kt.ZERO) ? jt.ZERO : new jt(e.x, e.y, Jt);
  }
  static toAffineBatch(e) {
    const n = ob(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return jt.toAffineBatch(e).map(jt.fromAffine);
  }
  equals(e) {
    vf(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = V(s * s), f = V(a * a), d = V(n * f), l = V(i * c), g = V(V(r * a) * f), h = V(V(o * s) * c);
    return d === l && g === h;
  }
  negate() {
    return new jt(this.x, V(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = V(e * e), i = V(n * n), o = V(i * i), a = e + i, c = V(Cr * (V(a * a) - s - o)), f = V(zi * s), d = V(f * f), l = V(d - Cr * c), g = V(f * (c - l) - Sf * o), h = V(Cr * n * r);
    return new jt(l, g, h);
  }
  add(e) {
    vf(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === _t || o === _t)
      return this;
    if (n === _t || r === _t)
      return e;
    const c = V(s * s), f = V(a * a), d = V(n * f), l = V(i * c), g = V(V(r * a) * f), h = V(V(o * s) * c), m = V(l - d), b = V(h - g);
    if (m === _t)
      return b === _t ? this.double() : jt.ZERO;
    const C = V(m * m), P = V(m * C), _ = V(d * C), p = V(b * b - P - Cr * _), $ = V(b * (_ - p) - g * P), I = V(s * a * m);
    return new jt(p, $, I);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = jt.ZERO;
    if (typeof e == "bigint" && e === _t)
      return n;
    let r = kf(e);
    if (r === Jt)
      return this;
    if (!Eo) {
      let l = n, g = this;
      for (; r > _t; )
        r & Jt && (l = l.add(g)), g = g.double(), r >>= Jt;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = So.splitScalar(r), c = n, f = n, d = this;
    for (; i > _t || a > _t; )
      i & Jt && (c = c.add(d)), a & Jt && (f = f.add(d)), d = d.double(), i >>= Jt, a >>= Jt;
    return s && (c = c.negate()), o && (f = f.negate()), f = new jt(V(f.x * So.beta), f.y, f.z), c.add(f);
  }
  precomputeWindow(e) {
    const n = Eo ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(jt.BASE) && (n = kt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Vc.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = jt.normalizeZ(s), Vc.set(n, s)));
    let i = jt.ZERO, o = jt.BASE;
    const a = 1 + (Eo ? 128 / r : 256 / r), c = 2 ** (r - 1), f = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let g = 0; g < a; g++) {
      const h = g * c;
      let m = Number(e & f);
      e >>= l, m > c && (m -= d, e += Jt);
      const b = h, C = h + Math.abs(m) - 1, P = g % 2 !== 0, _ = m < 0;
      m === 0 ? o = o.add(Ao(P, s[b])) : i = i.add(Ao(_, s[C]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = kf(e), s, i;
    if (Eo) {
      const { k1neg: o, k1: a, k2neg: c, k2: f } = So.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: g, f: h } = this.wNAF(f, n);
      d = Ao(o, d), g = Ao(c, g), g = new jt(V(g.x * So.beta), g.y, g.z), s = d.add(g), i = l.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return jt.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(jt.ZERO);
    e == null && (e = i ? Sf : Ei(s));
    const o = e, a = V(o * o), c = V(a * o), f = V(n * a), d = V(r * c), l = V(s * o);
    if (i)
      return kt.ZERO;
    if (l !== Jt)
      throw new Error("invZ was invalid");
    return new kt(f, d);
  }
}
jt.BASE = new jt(Kt.Gx, Kt.Gy, Jt);
jt.ZERO = new jt(_t, Jt, _t);
function Ao(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Vc = /* @__PURE__ */ new WeakMap();
class kt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Vc.delete(this);
  }
  hasEvenY() {
    return this.y % Cr === _t;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Je(n ? e : e.subarray(1));
    if (!Yo(r))
      throw new Error("Point is not on curve");
    const s = Af(r);
    let i = ib(s);
    const o = (i & Jt) === Jt;
    n ? o && (i = V(-i)) : (e[0] & 1) === 1 !== o && (i = V(-i));
    const a = new kt(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Je(e.subarray(1, Sn + 1)), r = Je(e.subarray(Sn + 1, Sn * 2 + 1)), s = new kt(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Hn(e), r = n.length, s = n[0];
    if (r === Sn)
      return this.fromCompressedHex(n);
    if (r === ia && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === oa && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${ia} compressed bytes or ${oa} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return kt.BASE.multiply(fs(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = u0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Jl(Hn(e)), { n: a } = Kt, c = r === 2 || r === 3 ? s + a : s, f = Ei(c, a), d = V(-o * f, a), l = V(i * f, a), g = r & 1 ? "03" : "02", h = kt.fromHex(g + Br(c)), m = kt.BASE.multiplyAndAddUnsafe(h, d, l);
    if (!m)
      throw new Error("Cannot recover signature: point at infinify");
    return m.assertValidity(), m;
  }
  toRawBytes(e = !1) {
    return Tr(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Br(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Br(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Yo(n) || !Yo(r))
      throw new Error(e);
    const s = V(r * r), i = Af(n);
    if (V(s - i) !== _t)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new kt(this.x, V(-this.y));
  }
  double() {
    return jt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return jt.fromAffine(this).add(jt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return jt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = jt.fromAffine(this), i = n === _t || n === Jt || this !== kt.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = jt.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(jt.ZERO) ? void 0 : a.toAffine();
  }
}
kt.BASE = new kt(Kt.Gx, Kt.Gy);
kt.ZERO = new kt(_t, _t);
function $f(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function If(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${oi(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Je(n), left: t.subarray(e + 2) };
}
function nb(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${oi(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = If(t.subarray(2)), { data: r, left: s } = If(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${oi(s)}`);
  return { r: e, s: r };
}
class Qe {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? oi(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Qe(aa(s.slice(0, 64)), aa(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = nb(n ? e : Tr(e));
    return new Qe(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ci(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!ci(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = Kt.n >> Jt;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Qe(this.r, V(-this.s, Kt.n)) : this;
  }
  toDERRawBytes() {
    return Tr(this.toDERHex());
  }
  toDERHex() {
    const e = $f(Pi(this.s)), n = $f(Pi(this.r)), r = e.length / 2, s = n.length / 2, i = Pi(r), o = Pi(s);
    return `30${Pi(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Tr(this.toCompactHex());
  }
  toCompactHex() {
    return Br(this.r) + Br(this.s);
  }
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
const rb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function oi(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += rb[t[n]];
  return e;
}
const sb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Br(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(_t <= t && t < sb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function ai(t) {
  const e = Tr(Br(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Pi(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function aa(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Tr(t) {
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
function Je(t) {
  return aa(oi(t));
}
function Hn(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Tr(t);
}
function kf(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && ci(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function V(t, e = Kt.P) {
  const n = t % e;
  return n >= _t ? n : e + n;
}
function sn(t, e) {
  const { P: n } = Kt;
  let r = t;
  for (; e-- > _t; )
    r *= r, r %= n;
  return r;
}
function ib(t) {
  const { P: e } = Kt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, f = c * c * t % e, d = sn(f, zi) * f % e, l = sn(d, zi) * f % e, g = sn(l, Cr) * c % e, h = sn(g, r) * g % e, m = sn(h, s) * h % e, b = sn(m, o) * m % e, C = sn(b, a) * b % e, P = sn(C, o) * m % e, _ = sn(P, zi) * f % e, p = sn(_, i) * h % e, $ = sn(p, n) * c % e, I = sn($, Cr);
  if (I * I % e !== t)
    throw new Error("Cannot find square root");
  return I;
}
function Ei(t, e = Kt.P) {
  if (t === _t || e <= _t)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = V(t, e), r = e, s = _t, i = Jt;
  for (; n !== _t; ) {
    const a = r / n, c = r % n, f = s - i * a;
    r = n, n = c, s = i, i = f;
  }
  if (r !== Jt)
    throw new Error("invert: does not exist");
  return V(s, e);
}
function ob(t, e = Kt.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === _t ? i : (n[a] = i, V(i * o, e)), Jt), s = Ei(r, e);
  return t.reduceRight((i, o, a) => o === _t ? i : (n[a] = V(i * n[a], e), V(i * o, e)), s), n;
}
function ab(t) {
  const e = t.length * 8 - us * 8, n = Je(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Jl(t, e = !1) {
  const n = ab(t);
  if (e)
    return n;
  const { n: r } = Kt;
  return n >= r ? n - r : n;
}
let ei, Ri;
class c0 {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return ae.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return Ri(this.k, ...e);
  }
  checkSync() {
    if (typeof Ri != "function")
      throw new Ql("hmacSha256Sync needs to be set");
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
    return kr(...n);
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
    return kr(...n);
  }
}
function ci(t) {
  return _t < t && t < Kt.n;
}
function Yo(t) {
  return _t < t && t < Kt.P;
}
function l0(t, e, n, r = !0) {
  const { n: s } = Kt, i = Jl(t, !0);
  if (!ci(i))
    return;
  const o = Ei(i, s), a = kt.BASE.multiply(i), c = V(a.x, s);
  if (c === _t)
    return;
  const f = V(o * V(e + n * c, s), s);
  if (f === _t)
    return;
  let d = new Qe(c, f), l = (a.x === d.r ? 0 : 2) | Number(a.y & Jt);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function fs(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * us)
      throw new Error("Expected 32 bytes of private key");
    e = aa(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== us)
      throw new Error("Expected 32 bytes of private key");
    e = Je(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!ci(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function tu(t) {
  return t instanceof kt ? (t.assertValidity(), t) : kt.fromHex(t);
}
function u0(t) {
  if (t instanceof Qe)
    return t.assertValidity(), t;
  try {
    return Qe.fromDER(t);
  } catch {
    return Qe.fromCompact(t);
  }
}
function co(t, e = !1) {
  return kt.fromPrivateKey(t).toRawBytes(e);
}
function cb(t, e, n, r = !1) {
  return kt.fromSignature(t, e, n).toRawBytes(r);
}
function Lf(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === ia || r === oa : n ? r === ia * 2 || r === oa * 2 : t instanceof kt;
}
function eu(t, e, n = !1) {
  if (Lf(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Lf(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = tu(e);
  return r.assertValidity(), r.multiply(fs(t)).toRawBytes(n);
}
function f0(t) {
  const e = t.length > Sn ? t.slice(0, Sn) : t;
  return Je(e);
}
function lb(t) {
  const e = f0(t), n = V(e, Kt.n);
  return d0(n < _t ? e : n);
}
function d0(t) {
  return ai(t);
}
function h0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Hn(t), s = fs(e), i = [d0(s), lb(r)];
  if (n != null) {
    n === !0 && (n = ae.randomBytes(Sn));
    const c = Hn(n);
    if (c.length !== Sn)
      throw new Error(`sign: Expected ${Sn} bytes of extra data`);
    i.push(c);
  }
  const o = kr(...i), a = f0(r);
  return { seed: o, m: a, d: s };
}
function p0(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function ub(t, e, n = {}) {
  const { seed: r, m: s, d: i } = h0(t, e, n.extraEntropy), o = new c0(a0, us);
  await o.reseed(r);
  let a;
  for (; !(a = l0(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return p0(a, n);
}
function Ma(t, e, n = {}) {
  const { seed: r, m: s, d: i } = h0(t, e, n.extraEntropy), o = new c0(a0, us);
  o.reseedSync(r);
  let a;
  for (; !(a = l0(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return p0(a, n);
}
const fb = { strict: !0 };
function db(t, e, n, r = fb) {
  let s;
  try {
    s = u0(t), e = Hn(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Jl(e);
  let c;
  try {
    c = tu(n);
  } catch {
    return !1;
  }
  const { n: f } = Kt, d = Ei(o, f), l = V(a * d, f), g = V(i * d, f), h = kt.BASE.multiplyAndAddUnsafe(c, l, g);
  return h ? V(h.x, f) === i : !1;
}
function ca(t) {
  return V(Je(t), Kt.n);
}
class li {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Hn(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Je(n.subarray(0, 32)), s = Je(n.subarray(32, 64));
    return new li(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Yo(e) || !ci(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Br(this.r) + Br(this.s);
  }
  toRawBytes() {
    return Tr(this.toHex());
  }
}
function hb(t) {
  return kt.fromPrivateKey(t).toRawX();
}
class g0 {
  constructor(e, n, r = ae.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Hn(e);
    const { x: s, scalar: i } = this.getScalar(fs(n));
    if (this.px = s, this.d = i, this.rand = Hn(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = kt.fromPrivateKey(e), r = n.hasEvenY() ? e : Kt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return ai(e ^ Je(n));
  }
  finalizeNonce(e) {
    const n = V(Je(e), Kt.n);
    if (n === _t)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new li(e.x, V(n + r * s, Kt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = ae.taggedHash, o = this.initNonce(n, await i(Ir.aux, s)), { R: a, rx: c, k: f } = this.finalizeNonce(await i(Ir.nonce, o, r, e)), d = ca(await i(Ir.challenge, c, r, e)), l = this.finalizeSig(a, f, d, n);
    return await b0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = ae.taggedHashSync, o = this.initNonce(n, i(Ir.aux, s)), { R: a, rx: c, k: f } = this.finalizeNonce(i(Ir.nonce, o, r, e)), d = ca(i(Ir.challenge, c, r, e)), l = this.finalizeSig(a, f, d, n);
    return m0(l, e, r) || this.error(), l;
  }
}
async function pb(t, e, n) {
  return new g0(t, e, n).calc();
}
function gb(t, e, n) {
  return new g0(t, e, n).calcSync();
}
function y0(t, e, n) {
  const r = t instanceof li, s = r ? t : li.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Hn(e),
    P: tu(n)
  };
}
function w0(t, e, n, r) {
  const s = kt.BASE.multiplyAndAddUnsafe(e, fs(n), V(-r, Kt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function b0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = y0(t, e, n), a = ca(await ae.taggedHash(Ir.challenge, ai(r), o.toRawX(), i));
    return w0(r, o, s, a);
  } catch {
    return !1;
  }
}
function m0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = y0(t, e, n), a = ca(ae.taggedHashSync(Ir.challenge, ai(r), o.toRawX(), i));
    return w0(r, o, s, a);
  } catch (r) {
    if (r instanceof Ql)
      throw r;
    return !1;
  }
}
const yb = {
  Signature: li,
  getPublicKey: hb,
  sign: pb,
  verify: b0,
  signSync: gb,
  verifySync: m0
};
kt.BASE._setWindowSize(8);
const qe = {
  node: o0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Ir = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, vo = {}, ae = {
  bytesToHex: oi,
  hexToBytes: Tr,
  concatBytes: kr,
  mod: V,
  invert: Ei,
  isValidPrivateKey(t) {
    try {
      return fs(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: ai,
  _normalizePrivateKey: fs,
  hashToPrivateKey: (t) => {
    t = Hn(t);
    const e = us + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = V(Je(t), Kt.n - Jt) + Jt;
    return ai(n);
  },
  randomBytes: (t = 32) => {
    if (qe.web)
      return qe.web.getRandomValues(new Uint8Array(t));
    if (qe.node) {
      const { randomBytes: e } = qe.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => ae.hashToPrivateKey(ae.randomBytes(us + 8)),
  precompute(t = 8, e = kt.BASE) {
    const n = e === kt.BASE ? e : new kt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(zi), n;
  },
  sha256: async (...t) => {
    if (qe.web) {
      const e = await qe.web.subtle.digest("SHA-256", kr(...t));
      return new Uint8Array(e);
    } else if (qe.node) {
      const { createHash: e } = qe.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (qe.web) {
      const n = await qe.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = kr(...e), s = await qe.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (qe.node) {
      const { createHmac: n } = qe.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = vo[t];
    if (n === void 0) {
      const r = await ae.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = kr(r, r), vo[t] = n;
    }
    return ae.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof ei != "function")
      throw new Ql("sha256Sync is undefined, you need to set it");
    let n = vo[t];
    if (n === void 0) {
      const r = ei(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = kr(r, r), vo[t] = n;
    }
    return ei(n, ...e);
  },
  _JacobianPoint: jt
};
Object.defineProperties(ae, {
  sha256Sync: {
    configurable: !1,
    get() {
      return ei;
    },
    set(t) {
      ei || (ei = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Ri;
    },
    set(t) {
      Ri || (Ri = t);
    }
  }
});
const wb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Kt,
  Point: kt,
  Signature: Qe,
  getPublicKey: co,
  getSharedSecret: eu,
  recoverPublicKey: cb,
  schnorr: yb,
  sign: ub,
  signSync: Ma,
  utils: ae,
  verify: db
}, Symbol.toStringTag, { value: "Module" }));
var lo = {};
lo.byteLength = Eb;
var bb = lo.toByteArray = vb, mb = lo.fromByteArray = kb, Bn = [], an = [], xb = typeof Uint8Array < "u" ? Uint8Array : Array, yc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var zs = 0, Sb = yc.length; zs < Sb; ++zs)
  Bn[zs] = yc[zs], an[yc.charCodeAt(zs)] = zs;
an[45] = 62;
an[95] = 63;
function x0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Eb(t) {
  var e = x0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Ab(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function vb(t) {
  var e, n = x0(t), r = n[0], s = n[1], i = new xb(Ab(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = an[t.charCodeAt(c)] << 18 | an[t.charCodeAt(c + 1)] << 12 | an[t.charCodeAt(c + 2)] << 6 | an[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = an[t.charCodeAt(c)] << 2 | an[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = an[t.charCodeAt(c)] << 10 | an[t.charCodeAt(c + 1)] << 4 | an[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function $b(t) {
  return Bn[t >> 18 & 63] + Bn[t >> 12 & 63] + Bn[t >> 6 & 63] + Bn[t & 63];
}
function Ib(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push($b(r));
  return s.join("");
}
function kb(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(Ib(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    Bn[e >> 2] + Bn[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Bn[e >> 10] + Bn[e >> 4 & 63] + Bn[e << 2 & 63] + "="
  )), s.join("");
}
function Lb() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Cb = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Bb() {
  if (Lb())
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
    throw new Error(Cb);
  }
}
class Tb {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(Pn(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(Pn(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class Mb {
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
async function S0() {
  const t = await Bb();
  return t.name === "subtleCrypto" ? new Mb(t.lib) : new Tb(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function Nb(t) {
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
    for (var m = 0, b = 0, C = 0, P = h.length; C !== P && h[C] === 0; )
      C++, m++;
    for (var _ = (P - C) * f + 1 >>> 0, p = new Uint8Array(_); C !== P; ) {
      for (var $ = h[C], I = 0, R = _ - 1; ($ !== 0 || I < b) && R !== -1; R--, I++)
        $ += 256 * p[R] >>> 0, p[R] = $ % o >>> 0, $ = $ / o >>> 0;
      if ($ !== 0)
        throw new Error("Non-zero carry");
      b = I, C++;
    }
    for (var Y = _ - b; Y !== _ && p[Y] === 0; )
      Y++;
    for (var H = a.repeat(m); Y < _; ++Y)
      H += t.charAt(p[Y]);
    return H;
  }
  function l(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var m = 0, b = 0, C = 0; h[m] === a; )
      b++, m++;
    for (var P = (h.length - m) * c + 1 >>> 0, _ = new Uint8Array(P); h[m]; ) {
      var p = h.charCodeAt(m);
      if (p > 255)
        return;
      var $ = e[p];
      if ($ === 255)
        return;
      for (var I = 0, R = P - 1; ($ !== 0 || I < C) && R !== -1; R--, I++)
        $ += o * _[R] >>> 0, _[R] = $ % 256 >>> 0, $ = $ / 256 >>> 0;
      if ($ !== 0)
        throw new Error("Non-zero carry");
      C = I, m++;
    }
    for (var Y = P - C; Y !== P && _[Y] === 0; )
      Y++;
    for (var H = new Uint8Array(b + (P - Y)), q = b; Y !== P; )
      H[q++] = _[Y++];
    return H;
  }
  function g(h) {
    var m = l(h);
    if (m)
      return m;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: d,
    decodeUnsafe: l,
    decode: g
  };
}
var E0 = Nb;
const _b = E0, Ub = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Pb = _b(Ub);
const Hb = /* @__PURE__ */ Vh(Pb), Ob = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), A0 = Uint8Array.from({ length: 16 }, (t, e) => e), Db = A0.map((t) => (9 * t + 5) % 16);
let nu = [A0], ru = [Db];
for (let t = 0; t < 4; t++)
  for (let e of [nu, ru])
    e.push(e[t].map((n) => Ob[n]));
const v0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Fb = nu.map((t, e) => t.map((n) => v0[e][n])), jb = ru.map((t, e) => t.map((n) => v0[e][n])), zb = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Rb = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), $o = (t, e) => t << e | t >>> 32 - e;
function Cf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Io = new Uint32Array(16);
let Gb = class extends Zl {
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
      Io[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const m = 4 - h, b = zb[h], C = Rb[h], P = nu[h], _ = ru[h], p = Fb[h], $ = jb[h];
      for (let I = 0; I < 16; I++) {
        const R = $o(r + Cf(h, i, a, f) + Io[P[I]] + b, p[I]) + l | 0;
        r = l, l = f, f = $o(a, 10) | 0, a = i, i = R;
      }
      for (let I = 0; I < 16; I++) {
        const R = $o(s + Cf(m, o, c, d) + Io[_[I]] + C, $[I]) + g | 0;
        s = g, g = d, d = $o(c, 10) | 0, c = o, o = R;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Io.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Kb = ks(() => new Gb());
function Vb(t) {
  return Kb(t);
}
const ko = BigInt(2 ** 32 - 1), qc = BigInt(32);
function $0(t, e = !1) {
  return e ? { h: Number(t & ko), l: Number(t >> qc & ko) } : { h: Number(t >> qc & ko) | 0, l: Number(t & ko) | 0 };
}
function qb(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = $0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Wb = (t, e) => BigInt(t >>> 0) << qc | BigInt(e >>> 0), Xb = (t, e, n) => t >>> n, Yb = (t, e, n) => t << 32 - n | e >>> n, Zb = (t, e, n) => t >>> n | e << 32 - n, Qb = (t, e, n) => t << 32 - n | e >>> n, Jb = (t, e, n) => t << 64 - n | e >>> n - 32, t1 = (t, e, n) => t >>> n - 32 | e << 64 - n, e1 = (t, e) => e, n1 = (t, e) => t, r1 = (t, e, n) => t << n | e >>> 32 - n, s1 = (t, e, n) => e << n | t >>> 32 - n, i1 = (t, e, n) => e << n - 32 | t >>> 64 - n, o1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function a1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const c1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), l1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, u1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), f1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, d1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), h1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, xt = {
  fromBig: $0,
  split: qb,
  toBig: Wb,
  shrSH: Xb,
  shrSL: Yb,
  rotrSH: Zb,
  rotrSL: Qb,
  rotrBH: Jb,
  rotrBL: t1,
  rotr32H: e1,
  rotr32L: n1,
  rotlSH: r1,
  rotlSL: s1,
  rotlBH: i1,
  rotlBL: o1,
  add: a1,
  add3L: c1,
  add3H: l1,
  add4L: u1,
  add4H: f1,
  add5H: h1,
  add5L: d1
}, [p1, g1] = xt.split([
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
].map((t) => BigInt(t))), sr = new Uint32Array(80), ir = new Uint32Array(80);
let Na = class extends Zl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: m, Hh: b, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, m, b, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, m, b, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = m | 0, this.Hh = b | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      sr[p] = e.getUint32(n), ir[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const $ = sr[p - 15] | 0, I = ir[p - 15] | 0, R = xt.rotrSH($, I, 1) ^ xt.rotrSH($, I, 8) ^ xt.shrSH($, I, 7), Y = xt.rotrSL($, I, 1) ^ xt.rotrSL($, I, 8) ^ xt.shrSL($, I, 7), H = sr[p - 2] | 0, q = ir[p - 2] | 0, S = xt.rotrSH(H, q, 19) ^ xt.rotrBH(H, q, 61) ^ xt.shrSH(H, q, 6), k = xt.rotrSL(H, q, 19) ^ xt.rotrBL(H, q, 61) ^ xt.shrSL(H, q, 6), N = xt.add4L(Y, k, ir[p - 7], ir[p - 16]), U = xt.add4H(N, R, S, sr[p - 7], sr[p - 16]);
      sr[p] = U | 0, ir[p] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: m, Gh: b, Gl: C, Hh: P, Hl: _ } = this;
    for (let p = 0; p < 80; p++) {
      const $ = xt.rotrSH(l, g, 14) ^ xt.rotrSH(l, g, 18) ^ xt.rotrBH(l, g, 41), I = xt.rotrSL(l, g, 14) ^ xt.rotrSL(l, g, 18) ^ xt.rotrBL(l, g, 41), R = l & h ^ ~l & b, Y = g & m ^ ~g & C, H = xt.add5L(_, I, Y, g1[p], ir[p]), q = xt.add5H(H, P, $, R, p1[p], sr[p]), S = H | 0, k = xt.rotrSH(r, s, 28) ^ xt.rotrBH(r, s, 34) ^ xt.rotrBH(r, s, 39), N = xt.rotrSL(r, s, 28) ^ xt.rotrBL(r, s, 34) ^ xt.rotrBL(r, s, 39), U = r & i ^ r & a ^ i & a, Z = s & o ^ s & c ^ o & c;
      P = b | 0, _ = C | 0, b = h | 0, C = m | 0, h = l | 0, m = g | 0, { h: l, l: g } = xt.add(f | 0, d | 0, q | 0, S | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const G = xt.add3L(S, N, Z);
      r = xt.add3H(G, q, k, U), s = G | 0;
    }
    ({ h: r, l: s } = xt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = xt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = xt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = xt.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = xt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: m } = xt.add(this.Fh | 0, this.Fl | 0, h | 0, m | 0), { h: b, l: C } = xt.add(this.Gh | 0, this.Gl | 0, b | 0, C | 0), { h: P, l: _ } = xt.add(this.Hh | 0, this.Hl | 0, P | 0, _ | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, m, b, C, P, _);
  }
  roundClean() {
    sr.fill(0), ir.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, y1 = class extends Na {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, w1 = class extends Na {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, b1 = class extends Na {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const m1 = ks(() => new Na());
ks(() => new y1());
ks(() => new w1());
ks(() => new b1());
function I0(t) {
  return ii(t);
}
function x1(t) {
  return m1(t);
}
const S1 = 0;
ae.hmacSha256Sync = (t, ...e) => {
  const n = Ta.create(ii, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function E1() {
  return st(ae.randomPrivateKey());
}
function A1(t) {
  const e = ii(ii(t));
  return Hb.encode(Pn(t, e).slice(0, t.length + 4));
}
function v1(t, e) {
  return A1(Pn(new Uint8Array([t]), e.slice(0, 20)));
}
function k0(t, e = S1) {
  const n = typeof t == "string" ? Pt(t) : t, r = Vb(I0(n));
  return v1(e, r);
}
function L0(t) {
  const e = Xl(t);
  return st(co(e.slice(0, 32), !0));
}
ae.hmacSha256Sync = (t, ...e) => {
  const n = Ta.create(ii, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var la;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(la || (la = {}));
async function $1(t, e, n) {
  return await (await S0()).encrypt("aes-256-cbc", e, t, n);
}
async function I1(t, e, n) {
  return await (await S0()).decrypt("aes-256-cbc", e, t, n);
}
function C0(t, e) {
  return Ta(ii, t, e);
}
function k1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function B0(t) {
  const e = x1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function L1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function C1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: la.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: la.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !L1(t))
    return e;
  try {
    return kt.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function B1(t, e, n, r) {
  const s = C1(t);
  if (!s.result)
    throw s;
  const i = ae.randomPrivateKey(), o = co(i, !0);
  let a = eu(i, t, !0);
  a = a.slice(1);
  const c = B0(a), f = ae.randomBytes(16), d = await $1(f, c.encryptionKey, e), l = Pn(f, o, d), g = C0(c.hmacKey, l);
  let h;
  if (!r || r === "hex")
    h = st(d);
  else if (r === "base64")
    h = mb(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const m = {
    iv: st(f),
    ephemeralPK: st(o),
    cipherText: h,
    mac: st(g),
    wasString: n
  };
  return r && r !== "hex" && (m.cipherTextEncoding = r), m;
}
async function T0(t, e) {
  if (!e.ephemeralPK)
    throw new wf("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = eu(t, n, !0);
  r = r.slice(1);
  const s = B0(r), i = Pt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Pt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = bb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = Pn(i, Pt(n), o), c = C0(s.hmacKey, a), f = Pt(e.mac);
  if (!k1(f, c))
    throw new wf("Decryption failed: failure in MAC check");
  const d = await I1(i, s.encryptionKey, o);
  return e.wasString ? ao(d) : d;
}
function T1(t, e) {
  const n = typeof e == "string" ? Is(e) : e, r = L0(t), s = I0(n), i = Ma(s, t);
  return {
    signature: st(i),
    publicKey: r
  };
}
async function M1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = L0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Is(t) : t, o = await B1(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = T1(r, a), f = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(f);
  }
  return a;
}
function N1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return T0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var ve = {}, ui = {}, Me = {};
Object.defineProperty(Me, "__esModule", { value: !0 });
Me.decode = Me.encode = Me.unescape = Me.escape = Me.pad = void 0;
const M0 = lo;
function su(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
Me.pad = su;
function N0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Me.escape = N0;
function _0(t) {
  return su(t).replace(/-/g, "+").replace(/_/g, "/");
}
Me.unescape = _0;
function _1(t) {
  return N0((0, M0.fromByteArray)(new TextEncoder().encode(t)));
}
Me.encode = _1;
function U1(t) {
  return new TextDecoder().decode((0, M0.toByteArray)(su(_0(t))));
}
Me.decode = U1;
var _a = {}, Ua = {}, U0 = {}, P0 = {}, Pa = {};
Object.defineProperty(Pa, "__esModule", { value: !0 });
Pa.crypto = void 0;
Pa.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = f, t.clean = d, t.createView = l, t.rotr = g, t.rotl = h, t.byteSwap = m, t.byteSwap32 = b, t.bytesToHex = _, t.hexToBytes = I, t.asyncLoop = Y, t.utf8ToBytes = H, t.bytesToUtf8 = q, t.toBytes = S, t.kdfInputToBytes = k, t.concatBytes = N, t.checkOpts = U, t.createHasher = G, t.createOptHasher = ot, t.createXOFer = Gt, t.randomBytes = Ht;
  const e = Pa;
  function n(E) {
    return E instanceof Uint8Array || ArrayBuffer.isView(E) && E.constructor.name === "Uint8Array";
  }
  function r(E) {
    if (!Number.isSafeInteger(E) || E < 0)
      throw new Error("positive integer expected, got " + E);
  }
  function s(E, ...T) {
    if (!n(E))
      throw new Error("Uint8Array expected");
    if (T.length > 0 && !T.includes(E.length))
      throw new Error("Uint8Array expected of length " + T + ", got length=" + E.length);
  }
  function i(E) {
    if (typeof E != "function" || typeof E.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(E.outputLen), r(E.blockLen);
  }
  function o(E, T = !0) {
    if (E.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (T && E.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(E, T) {
    s(E);
    const Lt = T.outputLen;
    if (E.length < Lt)
      throw new Error("digestInto() expects output buffer of length at least " + Lt);
  }
  function c(E) {
    return new Uint8Array(E.buffer, E.byteOffset, E.byteLength);
  }
  function f(E) {
    return new Uint32Array(E.buffer, E.byteOffset, Math.floor(E.byteLength / 4));
  }
  function d(...E) {
    for (let T = 0; T < E.length; T++)
      E[T].fill(0);
  }
  function l(E) {
    return new DataView(E.buffer, E.byteOffset, E.byteLength);
  }
  function g(E, T) {
    return E << 32 - T | E >>> T;
  }
  function h(E, T) {
    return E << T | E >>> 32 - T >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function m(E) {
    return E << 24 & 4278190080 | E << 8 & 16711680 | E >>> 8 & 65280 | E >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (E) => E : (E) => m(E), t.byteSwapIfBE = t.swap8IfBE;
  function b(E) {
    for (let T = 0; T < E.length; T++)
      E[T] = m(E[T]);
    return E;
  }
  t.swap32IfBE = t.isLE ? (E) => E : b;
  const C = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", P = /* @__PURE__ */ Array.from({ length: 256 }, (E, T) => T.toString(16).padStart(2, "0"));
  function _(E) {
    if (s(E), C)
      return E.toHex();
    let T = "";
    for (let Lt = 0; Lt < E.length; Lt++)
      T += P[E[Lt]];
    return T;
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
    if (C)
      return Uint8Array.fromHex(E);
    const T = E.length, Lt = T / 2;
    if (T % 2)
      throw new Error("hex string expected, got unpadded hex of length " + T);
    const pt = new Uint8Array(Lt);
    for (let ct = 0, $t = 0; ct < Lt; ct++, $t += 2) {
      const Mt = $(E.charCodeAt($t)), Xt = $(E.charCodeAt($t + 1));
      if (Mt === void 0 || Xt === void 0) {
        const Yt = E[$t] + E[$t + 1];
        throw new Error('hex string expected, got non-hex character "' + Yt + '" at index ' + $t);
      }
      pt[ct] = Mt * 16 + Xt;
    }
    return pt;
  }
  const R = async () => {
  };
  t.nextTick = R;
  async function Y(E, T, Lt) {
    let pt = Date.now();
    for (let ct = 0; ct < E; ct++) {
      Lt(ct);
      const $t = Date.now() - pt;
      $t >= 0 && $t < T || (await (0, t.nextTick)(), pt += $t);
    }
  }
  function H(E) {
    if (typeof E != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(E));
  }
  function q(E) {
    return new TextDecoder().decode(E);
  }
  function S(E) {
    return typeof E == "string" && (E = H(E)), s(E), E;
  }
  function k(E) {
    return typeof E == "string" && (E = H(E)), s(E), E;
  }
  function N(...E) {
    let T = 0;
    for (let pt = 0; pt < E.length; pt++) {
      const ct = E[pt];
      s(ct), T += ct.length;
    }
    const Lt = new Uint8Array(T);
    for (let pt = 0, ct = 0; pt < E.length; pt++) {
      const $t = E[pt];
      Lt.set($t, ct), ct += $t.length;
    }
    return Lt;
  }
  function U(E, T) {
    if (T !== void 0 && {}.toString.call(T) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(E, T);
  }
  class Z {
  }
  t.Hash = Z;
  function G(E) {
    const T = (pt) => E().update(S(pt)).digest(), Lt = E();
    return T.outputLen = Lt.outputLen, T.blockLen = Lt.blockLen, T.create = () => E(), T;
  }
  function ot(E) {
    const T = (pt, ct) => E(ct).update(S(pt)).digest(), Lt = E({});
    return T.outputLen = Lt.outputLen, T.blockLen = Lt.blockLen, T.create = (pt) => E(pt), T;
  }
  function Gt(E) {
    const T = (pt, ct) => E(ct).update(S(pt)).digest(), Lt = E({});
    return T.outputLen = Lt.outputLen, T.blockLen = Lt.blockLen, T.create = (pt) => E(pt), T;
  }
  t.wrapConstructor = G, t.wrapConstructorWithOpts = ot, t.wrapXOFConstructorWithOpts = Gt;
  function Ht(E = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(E));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(E));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(P0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = P0;
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
})(U0);
const Rs = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function H0(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Wc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Ls(t, ...e) {
  if (!H0(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function P1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Wc(t.outputLen), Wc(t.blockLen);
}
function Xc(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function O0(t, e) {
  Ls(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function H1(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function O1(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function ua(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Zo(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function gn(t, e) {
  return t << 32 - e | t >>> e;
}
function D1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const iu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function ou(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const D0 = iu ? (t) => t : (t) => ou(t), F1 = D0;
function F0(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = ou(t[e]);
  return t;
}
const j1 = iu ? (t) => t : F0, j0 = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", z1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function z0(t) {
  if (Ls(t), j0)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += z1[t[n]];
  return e;
}
const Rn = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Bf(t) {
  if (t >= Rn._0 && t <= Rn._9)
    return t - Rn._0;
  if (t >= Rn.A && t <= Rn.F)
    return t - (Rn.A - 10);
  if (t >= Rn.a && t <= Rn.f)
    return t - (Rn.a - 10);
}
function R1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (j0)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = Bf(t.charCodeAt(i)), a = Bf(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const R0 = async () => {
};
async function G1(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await R0(), r += i);
  }
}
function au(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function K1(t) {
  return new TextDecoder().decode(t);
}
function uo(t) {
  return typeof t == "string" && (t = au(t)), Ls(t), t;
}
function V1(t) {
  return typeof t == "string" && (t = au(t)), Ls(t), t;
}
function q1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Ls(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function W1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let G0 = class {
};
function Ha(t) {
  const e = (r) => t().update(uo(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function K0(t) {
  const e = (r, s) => t(s).update(uo(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function V0(t) {
  const e = (r, s) => t(s).update(uo(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const X1 = Ha, Y1 = K0, Z1 = V0;
function Q1(t = 32) {
  if (Rs && typeof Rs.getRandomValues == "function")
    return Rs.getRandomValues(new Uint8Array(t));
  if (Rs && typeof Rs.randomBytes == "function")
    return Uint8Array.from(Rs.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const J1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: G0,
  abytes: Ls,
  aexists: Xc,
  ahash: P1,
  anumber: Wc,
  aoutput: O0,
  asyncLoop: G1,
  byteSwap: ou,
  byteSwap32: F0,
  byteSwapIfBE: F1,
  bytesToHex: z0,
  bytesToUtf8: K1,
  checkOpts: W1,
  clean: ua,
  concatBytes: q1,
  createHasher: Ha,
  createOptHasher: K0,
  createView: Zo,
  createXOFer: V0,
  hexToBytes: R1,
  isBytes: H0,
  isLE: iu,
  kdfInputToBytes: V1,
  nextTick: R0,
  randomBytes: Q1,
  rotl: D1,
  rotr: gn,
  swap32IfBE: j1,
  swap8IfBE: D0,
  toBytes: uo,
  u32: O1,
  u8: H1,
  utf8ToBytes: au,
  wrapConstructor: X1,
  wrapConstructorWithOpts: Y1,
  wrapXOFConstructorWithOpts: Z1
}, Symbol.toStringTag, { value: "Module" }));
function tm(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
function em(t, e, n) {
  return t & e ^ ~t & n;
}
function nm(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class rm extends G0 {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = Zo(this.buffer);
  }
  update(e) {
    Xc(this), e = uo(e), Ls(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Zo(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Xc(this), O0(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, ua(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    tm(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Zo(e), c = this.outputLen;
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
const or = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ar = /* @__PURE__ */ Uint32Array.from([
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
]), cr = /* @__PURE__ */ new Uint32Array(64);
let cu = class extends rm {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = or[0] | 0, this.B = or[1] | 0, this.C = or[2] | 0, this.D = or[3] | 0, this.E = or[4] | 0, this.F = or[5] | 0, this.G = or[6] | 0, this.H = or[7] | 0;
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
      const g = cr[l - 15], h = cr[l - 2], m = gn(g, 7) ^ gn(g, 18) ^ g >>> 3, b = gn(h, 17) ^ gn(h, 19) ^ h >>> 10;
      cr[l] = b + cr[l - 7] + m + cr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = gn(a, 6) ^ gn(a, 11) ^ gn(a, 25), h = d + g + em(a, c, f) + sm[l] + cr[l] | 0, b = (gn(r, 2) ^ gn(r, 13) ^ gn(r, 22)) + nm(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    ua(cr);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), ua(this.buffer);
  }
}, q0 = class extends cu {
  constructor() {
    super(28), this.A = ar[0] | 0, this.B = ar[1] | 0, this.C = ar[2] | 0, this.D = ar[3] | 0, this.E = ar[4] | 0, this.F = ar[5] | 0, this.G = ar[6] | 0, this.H = ar[7] | 0;
  }
};
const im = /* @__PURE__ */ Ha(() => new cu()), om = /* @__PURE__ */ Ha(() => new q0()), am = cu, W0 = im, cm = q0, lm = om, um = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: cm,
  SHA256: am,
  sha224: lm,
  sha256: W0
}, Symbol.toStringTag, { value: "Module" })), Oa = /* @__PURE__ */ Ca(um), fm = /* @__PURE__ */ Ca(wb);
var fi = {};
Object.defineProperty(fi, "__esModule", { value: !0 });
fi.joseToDer = fi.derToJose = void 0;
const X0 = lo, Y0 = Me;
function wc(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const dm = {
  ES256: wc(256),
  ES384: wc(384),
  ES512: wc(521)
};
function Z0(t) {
  const e = dm[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const fa = 128, Q0 = 0, hm = 32, pm = 16, gm = 2, J0 = pm | hm | Q0 << 6, da = gm | Q0 << 6;
function tp(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, X0.toByteArray)((0, Y0.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function ym(t, e) {
  const n = tp(t), r = Z0(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== J0)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (fa | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== da)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const f = o;
  if (o += c, n[o++] !== da)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[o++];
  if (i - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${i - o}"`);
  if (s < d)
    throw new Error(`"s" specified length of "${d}", max of "${s}" is acceptable`);
  const l = o;
  if (o += d, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const g = r - c, h = r - d, m = new Uint8Array(g + c + h + d);
  for (o = 0; o < g; ++o)
    m[o] = 0;
  m.set(n.subarray(f + Math.max(-g, 0), f + c), o), o = r;
  for (const b = o; o < b + h; ++o)
    m[o] = 0;
  return m.set(n.subarray(l + Math.max(-h, 0), l + d), o), (0, Y0.escape)((0, X0.fromByteArray)(m));
}
fi.derToJose = ym;
function Tf(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= fa && --r, r;
}
function wm(t, e) {
  t = tp(t);
  const n = Z0(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Tf(t, 0, n), i = Tf(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, f = c < fa, d = new Uint8Array((f ? 2 : 3) + c);
  let l = 0;
  return d[l++] = J0, f ? d[l++] = c : (d[l++] = fa | 1, d[l++] = c & 255), d[l++] = da, d[l++] = o, s < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(s, n), l), l += n - s), d[l++] = da, d[l++] = a, i < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + i), l), d;
}
fi.joseToDer = wm;
var Zn = {};
Object.defineProperty(Zn, "__esModule", { value: !0 });
Zn.InvalidTokenError = Zn.MissingParametersError = void 0;
class bm extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Zn.MissingParametersError = bm;
class mm extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Zn.InvalidTokenError = mm;
const fo = /* @__PURE__ */ Ca(J1);
Object.defineProperty(Ua, "__esModule", { value: !0 });
Ua.SECP256K1Client = void 0;
const xm = U0, Sm = Oa, Qo = fm, Mf = fi, Nf = Zn, _f = fo;
Qo.utils.hmacSha256Sync = (t, ...e) => {
  const n = xm.hmac.create(Sm.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class ep {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, _f.bytesToHex)(Qo.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Nf.MissingParametersError("a signing input hash and private key are all required");
    const s = Qo.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, _f.bytesToHex)(s);
    if (r === "jose")
      return (0, Mf.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Mf.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Nf.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Qo.verify(n, e, r, { strict: !1 });
  }
}
Ua.SECP256K1Client = ep;
ep.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Ua;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(_a);
var ds = {};
const Em = /* @__PURE__ */ Ca(o0);
var Am = _e && _e.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(ds, "__esModule", { value: !0 });
ds.hashSha256Async = ds.hashSha256 = void 0;
const vm = Oa;
function np(t) {
  return (0, vm.sha256)(t);
}
ds.hashSha256 = np;
function $m(t) {
  return Am(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Em;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(np(t));
    }
  });
}
ds.hashSha256Async = $m;
var Im = _e && _e.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(ui, "__esModule", { value: !0 });
ui.TokenSigner = ui.createUnsecuredToken = void 0;
const Yc = Me, Uf = _a, km = Zn, Pf = ds;
function Zc(t, e) {
  const n = [], r = Yc.encode(JSON.stringify(e));
  n.push(r);
  const s = Yc.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function Lm(t) {
  return Zc(t, { typ: "JWT", alg: "none" }) + ".";
}
ui.createUnsecuredToken = Lm;
class Cm {
  constructor(e, n) {
    if (!(e && n))
      throw new km.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Uf.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Uf.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = Zc(e, s), o = (0, Pf.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return Im(this, void 0, void 0, function* () {
      const s = this.header(r), i = Zc(e, s), o = yield (0, Pf.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [Yc.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
ui.TokenSigner = Cm;
var Da = {};
Object.defineProperty(Da, "__esModule", { value: !0 });
Da.TokenVerifier = void 0;
const Bm = Me, Hf = _a, Tm = Zn, Lo = ds;
class Mm {
  constructor(e, n) {
    if (!(e && n))
      throw new Tm.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Hf.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Hf.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Lo.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, Lo.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), Bm.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Lo.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, Lo.hashSha256)(r);
      return i(o);
    }
  }
}
Da.TokenVerifier = Mm;
var Fa = {};
Object.defineProperty(Fa, "__esModule", { value: !0 });
Fa.decodeToken = void 0;
const Co = Me;
function Nm(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Co.decode(e[0])), r = JSON.parse(Co.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Co.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Co.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Fa.decodeToken = Nm;
(function(t) {
  var e = _e && _e.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = _e && _e.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(ui, t), n(Da, t), n(Fa, t), n(Zn, t), n(_a, t);
})(ve);
function _m(t) {
  return `did:btc-addr:${t}`;
}
function Um(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new yf("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new yf('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function rp(t) {
  if (t)
    return Um(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Pm = "1.4.0";
function Hm() {
  return E1();
}
function Om(t, e, n, r = Yh.slice(), s, i = mw().getTime(), o = {}) {
  const a = (h) => {
    const m = ql("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${h}=undefined])`
    });
    return m == null ? void 0 : m.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Sw(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: Pm,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), f = ve.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [f];
  const d = k0(f);
  return c.iss = _m(d), new ve.TokenSigner("ES256k", t).sign(c);
}
async function Of(t, e) {
  const n = ao(Pt(e)), r = JSON.parse(n), s = await T0(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function Dm(t) {
  const e = ve.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new ve.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function Fm(t) {
  const e = ve.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = rp(e.iss);
  if (n.length === 1) {
    if (k0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function jm(t) {
  const e = ve.decodeToken(t).payload;
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
function zm(t) {
  const e = ve.decodeToken(t).payload;
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
function Rm(t) {
  const e = [
    zm(t),
    jm(t),
    Dm(t),
    Fm(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Df = "1.0.0";
class Mr {
  constructor(e) {
    this.version = Df, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Df)
      throw new zc(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Mr(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class sp {
  constructor(e) {
    if (e) {
      const n = new Mr(e);
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
class Ff extends sp {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Mr({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Zh("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Mr({})), !0;
  }
}
class jf extends sp {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = yw, !localStorage.getItem(this.key)) {
      const r = new Mr({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Zh("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Mr.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Mr({})), !0;
  }
}
var Xi;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Xi || (Xi = {}));
var ha;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ha || (ha = {}));
Xi.Mainnet;
var Xn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Xn || (Xn = {}));
var Mn;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Mn || (Mn = {}));
Xn.Mainnet;
const ip = {
  chainId: Xi.Mainnet,
  transactionVersion: Xn.Mainnet,
  peerNetworkId: ha.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Mn.MainnetSingleSig,
    multiSig: Mn.MainnetMultiSig
  },
  client: { baseUrl: Qh }
}, Qc = {
  chainId: Xi.Testnet,
  transactionVersion: Xn.Testnet,
  peerNetworkId: ha.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Mn.TestnetSingleSig,
    multiSig: Mn.TestnetMultiSig
  },
  client: { baseUrl: Jh }
}, Jo = {
  ...Qc,
  addressVersion: { ...Qc.addressVersion },
  magicBytes: "id",
  client: { baseUrl: t0 }
}, Gm = {
  ...Jo,
  addressVersion: { ...Jo.addressVersion },
  client: { ...Jo.client }
};
function Km(t) {
  switch (t) {
    case "mainnet":
      return ip;
    case "testnet":
      return Qc;
    case "devnet":
      return Jo;
    case "mocknet":
      return Gm;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function op(t) {
  return typeof t == "string" ? Km(t) : t;
}
var zf;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(zf || (zf = {}));
var Rf;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Rf || (Rf = {}));
var wn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(wn || (wn = {}));
const bc = ["onChainOnly", "offChainOnly", "any"];
bc[0] + "", wn.OnChainOnly, bc[1] + "", wn.OffChainOnly, bc[2] + "", wn.Any, wn.OnChainOnly + "", wn.OnChainOnly, wn.OffChainOnly + "", wn.OffChainOnly, wn.Any + "", wn.Any;
var Gf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Gf || (Gf = {}));
var Kf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Kf || (Kf = {}));
var Vf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Vf || (Vf = {}));
var qn;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(qn || (qn = {}));
var qf;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(qf || (qf = {}));
var Wf;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Wf || (Wf = {}));
var Xf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Xf || (Xf = {}));
var Yf;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Yf || (Yf = {}));
var Zf;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Zf || (Zf = {}));
var Qf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Qf || (Qf = {}));
var Jf;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Jf || (Jf = {}));
var td;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(td || (td = {}));
var ed;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(ed || (ed = {}));
function Jc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Vm(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function ap(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function qm(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Jc(t.outputLen), Jc(t.blockLen);
}
function Wm(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Xm(t, e) {
  ap(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Jr = {
  number: Jc,
  bool: Vm,
  bytes: ap,
  hash: qm,
  exists: Wm,
  output: Xm
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const mc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), In = (t, e) => t << 32 - e | t >>> e, Ym = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Ym)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Zm(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function lu(t) {
  if (typeof t == "string" && (t = Zm(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let cp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Cs(t) {
  const e = (r) => t().update(lu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let lp = class extends cp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Jr.hash(e);
    const r = lu(n);
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
    return Jr.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Jr.exists(this), Jr.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const up = (t, e, n) => new lp(t, e).update(n).digest();
up.create = (t, e) => new lp(t, e);
function Qm(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let uu = class extends cp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = mc(this.buffer);
  }
  update(e) {
    Jr.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = lu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = mc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Jr.exists(this), Jr.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Qm(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = mc(e), c = this.outputLen;
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
const Jm = (t, e, n) => t & e ^ ~t & n, t2 = (t, e, n) => t & e ^ t & n ^ e & n, e2 = new Uint32Array([
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
]), lr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ur = new Uint32Array(64);
let fp = class extends uu {
  constructor() {
    super(64, 32, 8, !1), this.A = lr[0] | 0, this.B = lr[1] | 0, this.C = lr[2] | 0, this.D = lr[3] | 0, this.E = lr[4] | 0, this.F = lr[5] | 0, this.G = lr[6] | 0, this.H = lr[7] | 0;
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
      ur[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = ur[l - 15], h = ur[l - 2], m = In(g, 7) ^ In(g, 18) ^ g >>> 3, b = In(h, 17) ^ In(h, 19) ^ h >>> 10;
      ur[l] = b + ur[l - 7] + m + ur[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = In(a, 6) ^ In(a, 11) ^ In(a, 25), h = d + g + Jm(a, c, f) + e2[l] + ur[l] | 0, b = (In(r, 2) ^ In(r, 13) ^ In(r, 22)) + t2(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    ur.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, n2 = class extends fp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const dp = Cs(() => new fp());
Cs(() => new n2());
var Bs = {}, fu = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = fo;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], f = 0;
    for (let h = o.length - 1; h >= 0; h--)
      if (f < 4) {
        const m = n.indexOf(o[h]) >> f;
        let b = 0;
        h !== 0 && (b = n.indexOf(o[h - 1]));
        const C = 1 + f, P = b % (1 << C) << 5 - C, _ = t.c32[m + P];
        f = C, c.unshift(_);
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
      for (let m = 0; m < h; m++)
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
    for (let b = o.length - 1; b >= 0; b--) {
      g === 4 && (d.unshift(n[l]), g = 0, l = 0);
      const P = (t.c32.indexOf(o[b]) << g) + l, _ = n[P % 16];
      if (g += 1, l = P >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      d.unshift(_);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let h = 0;
    for (let b = 0; b < d.length && d[b] === "0"; b++)
      h++;
    d = d.slice(h - h % 2);
    let m = d.join("");
    for (let b = 0; b < f; b++)
      m = `00${m}`;
    if (a) {
      const b = a * 2 - m.length;
      for (let C = 0; C < b; C += 2)
        m = `00${m}`;
    }
    return m;
  }
  t.c32decode = i;
})(fu);
var hs = {};
Object.defineProperty(hs, "__esModule", { value: !0 });
hs.c32checkDecode = hs.c32checkEncode = void 0;
const nd = Oa, rd = fo, Gi = fu;
function hp(t) {
  const e = (0, nd.sha256)((0, nd.sha256)((0, rd.hexToBytes)(t)));
  return (0, rd.bytesToHex)(e.slice(0, 4));
}
function r2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = hp(`${n}${e}`), s = (0, Gi.c32encode)(`${e}${r}`);
  return `${Gi.c32[t]}${s}`;
}
hs.c32checkEncode = r2;
function s2(t) {
  t = (0, Gi.c32normalize)(t);
  const e = (0, Gi.c32decode)(t.slice(1)), n = t[0], r = Gi.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), hp(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
hs.c32checkDecode = s2;
var pp = {}, di = {};
Object.defineProperty(di, "__esModule", { value: !0 });
di.decode = di.encode = void 0;
const pa = Oa, sd = fo, gp = E0, yp = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function i2(t, e = "00") {
  const n = typeof t == "string" ? (0, sd.hexToBytes)(t) : t, r = typeof e == "string" ? (0, sd.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, pa.sha256)((0, pa.sha256)(new Uint8Array([...r, ...n])));
  return gp(yp).encode([...r, ...n, ...s.slice(0, 4)]);
}
di.encode = i2;
function o2(t) {
  const e = gp(yp).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, pa.sha256)((0, pa.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
di.decode = o2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = hs, n = di, r = fo;
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
    const g = n.decode(d), h = (0, r.bytesToHex)(g.data), m = parseInt((0, r.bytesToHex)(g.prefix), 16);
    let b;
    return l < 0 ? (b = m, s[m] !== void 0 && (b = s[m])) : b = l, o(b, h);
  }
  t.b58ToC32 = c;
  function f(d, l = -1) {
    const g = a(d), h = g[0], m = g[1];
    let b;
    l < 0 ? (b = h, i[h] !== void 0 && (b = i[h])) : b = l;
    let C = b.toString(16);
    return C.length === 1 && (C = `0${C}`), n.encode(m, C);
  }
  t.c32ToB58 = f;
})(pp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = fu;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = hs;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = pp;
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
})(Bs);
function a2(t, e) {
  switch (e = op(e ?? ip), t) {
    case qn.P2PKH:
      switch (e.transactionVersion) {
        case Xn.Mainnet:
          return Mn.MainnetSingleSig;
        case Xn.Testnet:
          return Mn.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case qn.P2SH:
    case qn.P2SHNonSequential:
    case qn.P2WPKH:
    case qn.P2WSH:
    case qn.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Xn.Mainnet:
          return Mn.MainnetMultiSig;
        case Xn.Testnet:
          return Mn.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const c2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), wp = Uint8Array.from({ length: 16 }, (t, e) => e), l2 = wp.map((t) => (9 * t + 5) % 16);
let du = [wp], hu = [l2];
for (let t = 0; t < 4; t++)
  for (let e of [du, hu])
    e.push(e[t].map((n) => c2[n]));
const bp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), u2 = du.map((t, e) => t.map((n) => bp[e][n])), f2 = hu.map((t, e) => t.map((n) => bp[e][n])), d2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), h2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Bo = (t, e) => t << e | t >>> 32 - e;
function id(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const To = new Uint32Array(16);
let p2 = class extends uu {
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
      To[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const m = 4 - h, b = d2[h], C = h2[h], P = du[h], _ = hu[h], p = u2[h], $ = f2[h];
      for (let I = 0; I < 16; I++) {
        const R = Bo(r + id(h, i, a, f) + To[P[I]] + b, p[I]) + l | 0;
        r = l, l = f, f = Bo(a, 10) | 0, a = i, i = R;
      }
      for (let I = 0; I < 16; I++) {
        const R = Bo(s + id(m, o, c, d) + To[_[I]] + C, $[I]) + g | 0;
        s = g, g = d, d = Bo(c, 10) | 0, c = o, o = R;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    To.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const g2 = Cs(() => new p2()), Mo = BigInt(2 ** 32 - 1), tl = BigInt(32);
function mp(t, e = !1) {
  return e ? { h: Number(t & Mo), l: Number(t >> tl & Mo) } : { h: Number(t >> tl & Mo) | 0, l: Number(t & Mo) | 0 };
}
function y2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = mp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const w2 = (t, e) => BigInt(t >>> 0) << tl | BigInt(e >>> 0), b2 = (t, e, n) => t >>> n, m2 = (t, e, n) => t << 32 - n | e >>> n, x2 = (t, e, n) => t >>> n | e << 32 - n, S2 = (t, e, n) => t << 32 - n | e >>> n, E2 = (t, e, n) => t << 64 - n | e >>> n - 32, A2 = (t, e, n) => t >>> n - 32 | e << 64 - n, v2 = (t, e) => e, $2 = (t, e) => t, I2 = (t, e, n) => t << n | e >>> 32 - n, k2 = (t, e, n) => e << n | t >>> 32 - n, L2 = (t, e, n) => e << n - 32 | t >>> 64 - n, C2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function B2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const T2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), M2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, N2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), _2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, U2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), P2 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, St = {
  fromBig: mp,
  split: y2,
  toBig: w2,
  shrSH: b2,
  shrSL: m2,
  rotrSH: x2,
  rotrSL: S2,
  rotrBH: E2,
  rotrBL: A2,
  rotr32H: v2,
  rotr32L: $2,
  rotlSH: I2,
  rotlSL: k2,
  rotlBH: L2,
  rotlBL: C2,
  add: B2,
  add3L: T2,
  add3H: M2,
  add4L: N2,
  add4H: _2,
  add5H: P2,
  add5L: U2
}, [H2, O2] = St.split([
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
].map((t) => BigInt(t))), fr = new Uint32Array(80), dr = new Uint32Array(80);
let ja = class extends uu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: m, Hh: b, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, m, b, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, m, b, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = m | 0, this.Hh = b | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      fr[p] = e.getUint32(n), dr[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const $ = fr[p - 15] | 0, I = dr[p - 15] | 0, R = St.rotrSH($, I, 1) ^ St.rotrSH($, I, 8) ^ St.shrSH($, I, 7), Y = St.rotrSL($, I, 1) ^ St.rotrSL($, I, 8) ^ St.shrSL($, I, 7), H = fr[p - 2] | 0, q = dr[p - 2] | 0, S = St.rotrSH(H, q, 19) ^ St.rotrBH(H, q, 61) ^ St.shrSH(H, q, 6), k = St.rotrSL(H, q, 19) ^ St.rotrBL(H, q, 61) ^ St.shrSL(H, q, 6), N = St.add4L(Y, k, dr[p - 7], dr[p - 16]), U = St.add4H(N, R, S, fr[p - 7], fr[p - 16]);
      fr[p] = U | 0, dr[p] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: m, Gh: b, Gl: C, Hh: P, Hl: _ } = this;
    for (let p = 0; p < 80; p++) {
      const $ = St.rotrSH(l, g, 14) ^ St.rotrSH(l, g, 18) ^ St.rotrBH(l, g, 41), I = St.rotrSL(l, g, 14) ^ St.rotrSL(l, g, 18) ^ St.rotrBL(l, g, 41), R = l & h ^ ~l & b, Y = g & m ^ ~g & C, H = St.add5L(_, I, Y, O2[p], dr[p]), q = St.add5H(H, P, $, R, H2[p], fr[p]), S = H | 0, k = St.rotrSH(r, s, 28) ^ St.rotrBH(r, s, 34) ^ St.rotrBH(r, s, 39), N = St.rotrSL(r, s, 28) ^ St.rotrBL(r, s, 34) ^ St.rotrBL(r, s, 39), U = r & i ^ r & a ^ i & a, Z = s & o ^ s & c ^ o & c;
      P = b | 0, _ = C | 0, b = h | 0, C = m | 0, h = l | 0, m = g | 0, { h: l, l: g } = St.add(f | 0, d | 0, q | 0, S | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const G = St.add3L(S, N, Z);
      r = St.add3H(G, q, k, U), s = G | 0;
    }
    ({ h: r, l: s } = St.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = St.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = St.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = St.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = St.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: m } = St.add(this.Fh | 0, this.Fl | 0, h | 0, m | 0), { h: b, l: C } = St.add(this.Gh | 0, this.Gl | 0, b | 0, C | 0), { h: P, l: _ } = St.add(this.Hh | 0, this.Hl | 0, P | 0, _ | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, m, b, C, P, _);
  }
  roundClean() {
    fr.fill(0), dr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, D2 = class extends ja {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, F2 = class extends ja {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, j2 = class extends ja {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Cs(() => new ja());
Cs(() => new D2());
Cs(() => new F2());
Cs(() => new j2());
var ga = { exports: {} };
ga.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", f = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", h = "[object Number]", m = "[object Object]", b = "[object Promise]", C = "[object RegExp]", P = "[object Set]", _ = "[object String]", p = "[object Symbol]", $ = "[object WeakMap]", I = "[object ArrayBuffer]", R = "[object DataView]", Y = "[object Float32Array]", H = "[object Float64Array]", q = "[object Int8Array]", S = "[object Int16Array]", k = "[object Int32Array]", N = "[object Uint8Array]", U = "[object Uint8ClampedArray]", Z = "[object Uint16Array]", G = "[object Uint32Array]", ot = /[\\^$.*+?()[\]{}|]/g, Gt = /\w*$/, Ht = /^\[object .+?Constructor\]$/, E = /^(?:0|[1-9]\d*)$/, T = {};
  T[i] = T[o] = T[I] = T[R] = T[a] = T[c] = T[Y] = T[H] = T[q] = T[S] = T[k] = T[g] = T[h] = T[m] = T[C] = T[P] = T[_] = T[p] = T[N] = T[U] = T[Z] = T[G] = !0, T[f] = T[d] = T[$] = !1;
  var Lt = typeof _e == "object" && _e && _e.Object === Object && _e, pt = typeof self == "object" && self && self.Object === Object && self, ct = Lt || pt || Function("return this")(), $t = e && !e.nodeType && e, Mt = $t && !0 && t && !t.nodeType && t, Xt = Mt && Mt.exports === $t;
  function Yt(y, L) {
    return y.set(L[0], L[1]), y;
  }
  function he(y, L) {
    return y.add(L), y;
  }
  function Ut(y, L) {
    for (var M = -1, et = y ? y.length : 0; ++M < et && L(y[M], M, y) !== !1; )
      ;
    return y;
  }
  function Ke(y, L) {
    for (var M = -1, et = L.length, Ee = y.length; ++M < et; )
      y[Ee + M] = L[M];
    return y;
  }
  function fn(y, L, M, et) {
    for (var Ee = -1, De = y ? y.length : 0; ++Ee < De; )
      M = L(M, y[Ee], Ee, y);
    return M;
  }
  function B(y, L) {
    for (var M = -1, et = Array(y); ++M < y; )
      et[M] = L(M);
    return et;
  }
  function X(y, L) {
    return y == null ? void 0 : y[L];
  }
  function z(y) {
    var L = !1;
    if (y != null && typeof y.toString != "function")
      try {
        L = !!(y + "");
      } catch {
      }
    return L;
  }
  function at(y) {
    var L = -1, M = Array(y.size);
    return y.forEach(function(et, Ee) {
      M[++L] = [Ee, et];
    }), M;
  }
  function it(y, L) {
    return function(M) {
      return y(L(M));
    };
  }
  function Bt(y) {
    var L = -1, M = Array(y.size);
    return y.forEach(function(et) {
      M[++L] = et;
    }), M;
  }
  var bt = Array.prototype, Rt = Function.prototype, Ft = Object.prototype, Ot = ct["__core-js_shared__"], ce = function() {
    var y = /[^.]+$/.exec(Ot && Ot.keys && Ot.keys.IE_PROTO || "");
    return y ? "Symbol(src)_1." + y : "";
  }(), ut = Rt.toString, dt = Ft.hasOwnProperty, u = Ft.toString, x = RegExp(
    "^" + ut.call(dt).replace(ot, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), A = Xt ? ct.Buffer : void 0, O = ct.Symbol, rt = ct.Uint8Array, ft = it(Object.getPrototypeOf, Object), le = Object.create, ee = Ft.propertyIsEnumerable, xe = bt.splice, dn = Object.getOwnPropertySymbols, vn = A ? A.isBuffer : void 0, ne = it(Object.keys, Object), ge = Be(ct, "DataView"), en = Be(ct, "Map"), nn = Be(ct, "Promise"), ht = Be(ct, "Set"), Dt = Be(ct, "WeakMap"), Vt = Be(Object, "create"), hn = Wr(ge), Fr = Wr(en), Li = Wr(nn), Pe = Wr(ht), tr = Wr(Dt), Nt = O ? O.prototype : void 0, pe = Nt ? Nt.valueOf : void 0;
  function He(y) {
    var L = -1, M = y ? y.length : 0;
    for (this.clear(); ++L < M; ) {
      var et = y[L];
      this.set(et[0], et[1]);
    }
  }
  function Us() {
    this.__data__ = Vt ? Vt(null) : {};
  }
  function jr(y) {
    return this.has(y) && delete this.__data__[y];
  }
  function pn(y) {
    var L = this.__data__;
    if (Vt) {
      var M = L[y];
      return M === r ? void 0 : M;
    }
    return dt.call(L, y) ? L[y] : void 0;
  }
  function jn(y) {
    var L = this.__data__;
    return Vt ? L[y] !== void 0 : dt.call(L, y);
  }
  function rn(y, L) {
    var M = this.__data__;
    return M[y] = Vt && L === void 0 ? r : L, this;
  }
  He.prototype.clear = Us, He.prototype.delete = jr, He.prototype.get = pn, He.prototype.has = jn, He.prototype.set = rn;
  function $e(y) {
    var L = -1, M = y ? y.length : 0;
    for (this.clear(); ++L < M; ) {
      var et = y[L];
      this.set(et[0], et[1]);
    }
  }
  function er() {
    this.__data__ = [];
  }
  function Ps(y) {
    var L = this.__data__, M = Kr(L, y);
    if (M < 0)
      return !1;
    var et = L.length - 1;
    return M == et ? L.pop() : xe.call(L, M, 1), !0;
  }
  function Hs(y) {
    var L = this.__data__, M = Kr(L, y);
    return M < 0 ? void 0 : L[M][1];
  }
  function Os(y) {
    return Kr(this.__data__, y) > -1;
  }
  function Ds(y, L) {
    var M = this.__data__, et = Kr(M, y);
    return et < 0 ? M.push([y, L]) : M[et][1] = L, this;
  }
  $e.prototype.clear = er, $e.prototype.delete = Ps, $e.prototype.get = Hs, $e.prototype.has = Os, $e.prototype.set = Ds;
  function F(y) {
    var L = -1, M = y ? y.length : 0;
    for (this.clear(); ++L < M; ) {
      var et = y[L];
      this.set(et[0], et[1]);
    }
  }
  function tt() {
    this.__data__ = {
      hash: new He(),
      map: new (en || $e)(),
      string: new He()
    };
  }
  function ye(y) {
    return Ce(this, y).delete(y);
  }
  function Ie(y) {
    return Ce(this, y).get(y);
  }
  function zr(y) {
    return Ce(this, y).has(y);
  }
  function Rr(y, L) {
    return Ce(this, y).set(y, L), this;
  }
  F.prototype.clear = tt, F.prototype.delete = ye, F.prototype.get = Ie, F.prototype.has = zr, F.prototype.set = Rr;
  function Ve(y) {
    this.__data__ = new $e(y);
  }
  function Ci() {
    this.__data__ = new $e();
  }
  function rc(y) {
    return this.__data__.delete(y);
  }
  function wo(y) {
    return this.__data__.get(y);
  }
  function we(y) {
    return this.__data__.has(y);
  }
  function sc(y, L) {
    var M = this.__data__;
    if (M instanceof $e) {
      var et = M.__data__;
      if (!en || et.length < n - 1)
        return et.push([y, L]), this;
      M = this.__data__ = new F(et);
    }
    return M.set(y, L), this;
  }
  Ve.prototype.clear = Ci, Ve.prototype.delete = rc, Ve.prototype.get = wo, Ve.prototype.has = we, Ve.prototype.set = sc;
  function ic(y, L) {
    var M = lc(y) || Py(y) ? B(y.length, String) : [], et = M.length, Ee = !!et;
    for (var De in y)
      dt.call(y, De) && !(Ee && (De == "length" || My(De, et))) && M.push(De);
    return M;
  }
  function Gr(y, L, M) {
    var et = y[L];
    (!(dt.call(y, L) && of(et, M)) || M === void 0 && !(L in y)) && (y[L] = M);
  }
  function Kr(y, L) {
    for (var M = y.length; M--; )
      if (of(y[M][0], L))
        return M;
    return -1;
  }
  function Fs(y, L) {
    return y && Se(L, uc(L), y);
  }
  function Bi(y, L, M, et, Ee, De, zn) {
    var Fe;
    if (et && (Fe = De ? et(y, Ee, De, zn) : et(y)), Fe !== void 0)
      return Fe;
    if (!bo(y))
      return y;
    var lf = lc(y);
    if (lf) {
      if (Fe = Cy(y), !L)
        return yt(y, Fe);
    } else {
      var js = qr(y), uf = js == d || js == l;
      if (Oy(y))
        return w(y, L);
      if (js == m || js == i || uf && !De) {
        if (z(y))
          return De ? y : {};
        if (Fe = By(uf ? {} : y), !L)
          return Oe(y, Fs(Fe, y));
      } else {
        if (!T[js])
          return De ? y : {};
        Fe = Ty(y, js, Bi, L);
      }
    }
    zn || (zn = new Ve());
    var ff = zn.get(y);
    if (ff)
      return ff;
    if (zn.set(y, Fe), !lf)
      var df = M ? Vr(y) : uc(y);
    return Ut(df || y, function(fc, mo) {
      df && (mo = fc, fc = y[mo]), Gr(Fe, mo, Bi(fc, L, M, et, mo, y, zn));
    }), Fe;
  }
  function Ti(y) {
    return bo(y) ? le(y) : {};
  }
  function oc(y, L, M) {
    var et = L(y);
    return lc(y) ? et : Ke(et, M(y));
  }
  function ac(y) {
    return u.call(y);
  }
  function Mi(y) {
    if (!bo(y) || _y(y))
      return !1;
    var L = cf(y) || z(y) ? x : Ht;
    return L.test(Wr(y));
  }
  function cc(y) {
    if (!sf(y))
      return ne(y);
    var L = [];
    for (var M in Object(y))
      dt.call(y, M) && M != "constructor" && L.push(M);
    return L;
  }
  function w(y, L) {
    if (L)
      return y.slice();
    var M = new y.constructor(y.length);
    return y.copy(M), M;
  }
  function v(y) {
    var L = new y.constructor(y.byteLength);
    return new rt(L).set(new rt(y)), L;
  }
  function j(y, L) {
    var M = L ? v(y.buffer) : y.buffer;
    return new y.constructor(M, y.byteOffset, y.byteLength);
  }
  function Q(y, L, M) {
    var et = L ? M(at(y), !0) : at(y);
    return fn(et, Yt, new y.constructor());
  }
  function J(y) {
    var L = new y.constructor(y.source, Gt.exec(y));
    return L.lastIndex = y.lastIndex, L;
  }
  function K(y, L, M) {
    var et = L ? M(Bt(y), !0) : Bt(y);
    return fn(et, he, new y.constructor());
  }
  function gt(y) {
    return pe ? Object(pe.call(y)) : {};
  }
  function mt(y, L) {
    var M = L ? v(y.buffer) : y.buffer;
    return new y.constructor(M, y.byteOffset, y.length);
  }
  function yt(y, L) {
    var M = -1, et = y.length;
    for (L || (L = Array(et)); ++M < et; )
      L[M] = y[M];
    return L;
  }
  function Se(y, L, M, et) {
    M || (M = {});
    for (var Ee = -1, De = L.length; ++Ee < De; ) {
      var zn = L[Ee], Fe = void 0;
      Gr(M, zn, Fe === void 0 ? y[zn] : Fe);
    }
    return M;
  }
  function Oe(y, L) {
    return Se(y, Ni(y), L);
  }
  function Vr(y) {
    return oc(y, uc, Ni);
  }
  function Ce(y, L) {
    var M = y.__data__;
    return Ny(L) ? M[typeof L == "string" ? "string" : "hash"] : M.map;
  }
  function Be(y, L) {
    var M = X(y, L);
    return Mi(M) ? M : void 0;
  }
  var Ni = dn ? it(dn, Object) : jy, qr = ac;
  (ge && qr(new ge(new ArrayBuffer(1))) != R || en && qr(new en()) != g || nn && qr(nn.resolve()) != b || ht && qr(new ht()) != P || Dt && qr(new Dt()) != $) && (qr = function(y) {
    var L = u.call(y), M = L == m ? y.constructor : void 0, et = M ? Wr(M) : void 0;
    if (et)
      switch (et) {
        case hn:
          return R;
        case Fr:
          return g;
        case Li:
          return b;
        case Pe:
          return P;
        case tr:
          return $;
      }
    return L;
  });
  function Cy(y) {
    var L = y.length, M = y.constructor(L);
    return L && typeof y[0] == "string" && dt.call(y, "index") && (M.index = y.index, M.input = y.input), M;
  }
  function By(y) {
    return typeof y.constructor == "function" && !sf(y) ? Ti(ft(y)) : {};
  }
  function Ty(y, L, M, et) {
    var Ee = y.constructor;
    switch (L) {
      case I:
        return v(y);
      case a:
      case c:
        return new Ee(+y);
      case R:
        return j(y, et);
      case Y:
      case H:
      case q:
      case S:
      case k:
      case N:
      case U:
      case Z:
      case G:
        return mt(y, et);
      case g:
        return Q(y, et, M);
      case h:
      case _:
        return new Ee(y);
      case C:
        return J(y);
      case P:
        return K(y, et, M);
      case p:
        return gt(y);
    }
  }
  function My(y, L) {
    return L = L ?? s, !!L && (typeof y == "number" || E.test(y)) && y > -1 && y % 1 == 0 && y < L;
  }
  function Ny(y) {
    var L = typeof y;
    return L == "string" || L == "number" || L == "symbol" || L == "boolean" ? y !== "__proto__" : y === null;
  }
  function _y(y) {
    return !!ce && ce in y;
  }
  function sf(y) {
    var L = y && y.constructor, M = typeof L == "function" && L.prototype || Ft;
    return y === M;
  }
  function Wr(y) {
    if (y != null) {
      try {
        return ut.call(y);
      } catch {
      }
      try {
        return y + "";
      } catch {
      }
    }
    return "";
  }
  function Uy(y) {
    return Bi(y, !0, !0);
  }
  function of(y, L) {
    return y === L || y !== y && L !== L;
  }
  function Py(y) {
    return Hy(y) && dt.call(y, "callee") && (!ee.call(y, "callee") || u.call(y) == i);
  }
  var lc = Array.isArray;
  function af(y) {
    return y != null && Dy(y.length) && !cf(y);
  }
  function Hy(y) {
    return Fy(y) && af(y);
  }
  var Oy = vn || zy;
  function cf(y) {
    var L = bo(y) ? u.call(y) : "";
    return L == d || L == l;
  }
  function Dy(y) {
    return typeof y == "number" && y > -1 && y % 1 == 0 && y <= s;
  }
  function bo(y) {
    var L = typeof y;
    return !!y && (L == "object" || L == "function");
  }
  function Fy(y) {
    return !!y && typeof y == "object";
  }
  function uc(y) {
    return af(y) ? ic(y) : cc(y);
  }
  function jy() {
    return [];
  }
  function zy() {
    return !1;
  }
  t.exports = Uy;
})(ga, ga.exports);
var z2 = ga.exports;
const xp = /* @__PURE__ */ Vh(z2);
var el;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(el || (el = {}));
function R2(t, e) {
  return { type: el.Address, version: t, hash160: e };
}
function G2(t) {
  return Bs.c32address(t.version, t.hash160);
}
const K2 = (t) => g2(dp(t)), V2 = (t) => st(K2(t));
ae.hmacSha256Sync = (t, ...e) => {
  const n = up.create(dp, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function q2(t, e = "mainnet") {
  e = op(e), t = typeof t == "string" ? Pt(t) : t;
  const n = a2(qn.P2PKH, e), r = R2(n, V2(t));
  return G2(r);
}
function W2(t, e) {
  const n = ve.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = q2(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new ve.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function X2(t, e = null) {
  let n;
  e ? n = W2(t, e) : n = ve.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const od = "_blockstackDidCheckEchoReply", Y2 = "echoReply", Z2 = "authContinuation";
function Q2(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function J2() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[od];
  if (typeof e == "boolean")
    return e;
  const n = Q2(t.location.search), r = n[Y2];
  if (r) {
    t[od] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[Z2];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class nl {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new e0();
    else
      throw new bw("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new jf(e.sessionOptions) : this.store = new jf() : e ? this.store = new Ff(e.sessionOptions) : this.store = new Ff();
  }
  makeAuthRequestToken(e, n, r, s, i, o = xw().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new zc("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, Om(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Hm();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = ql("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (J2())
        return Xs.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Xs.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Rw()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new xo("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = ve.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Rm(e))
      throw new xo("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (hc(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Of(s, i.private_key);
          } catch {
            if (Xs.warn("Failed decryption of appPrivateKey, will try to use as given"), !ae.isValidPrivateKey(i.private_key))
              throw new xo("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Of(s, c);
          } catch {
            Xs.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new xo("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let f = Mw, d;
    hc(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (f = i.hubUrl), hc(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (d = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: rp(i.iss),
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
        l.profile = Object.assign({}, gw);
      else {
        const m = await h.text(), b = JSON.parse(m);
        l.profile = X2(b[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new zc("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), M1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), N1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
nl.prototype.makeAuthRequest = nl.prototype.makeAuthRequestToken;
const tx = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], ex = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = tx(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!za(r.id));
  return e.concat(n);
}, za = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Sp = "STX_PROVIDER", ps = () => typeof window > "u" ? null : window.localStorage.getItem(Sp), nx = (t) => {
  typeof window < "u" && window.localStorage.setItem(Sp, t);
}, rx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function sx(t, e) {
  const n = {};
  return Object.assign(n, rx, e), await fetch(t, n);
}
function ix(t) {
  let e = sx, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function ox(...t) {
  const { fetchLib: e, middlewares: n } = ix(t);
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
var hi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(hi || (hi = {}));
var gs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(gs || (gs = {}));
var ad;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ad || (ad = {}));
const ax = "https://api.mainnet.hiro.so", cx = "https://api.testnet.hiro.so", lx = "http://localhost:3999", ux = ["mainnet", "testnet", "devnet", "mocknet"];
class ys {
  constructor(e) {
    this.version = gs.Mainnet, this.chainId = hi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === gs.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? ox();
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
ys.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new rl();
    case "testnet":
      return new sl();
    case "devnet":
      return new fx();
    case "mocknet":
      return new Ep();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${ux.join(", ")}`);
  }
};
ys.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : ys.fromName(t);
class rl extends ys {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ax,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = gs.Mainnet, this.chainId = hi.Mainnet;
  }
}
class sl extends ys {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? cx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = gs.Testnet, this.chainId = hi.Testnet;
  }
}
class Ep extends ys {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? lx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = gs.Testnet, this.chainId = hi.Testnet;
  }
}
const fx = Ep;
var ws;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(ws || (ws = {}));
var ya;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ya || (ya = {}));
ws.Mainnet;
var bs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(bs || (bs = {}));
var ms;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ms || (ms = {}));
bs.Mainnet;
const dx = {
  chainId: ws.Mainnet,
  transactionVersion: bs.Mainnet,
  peerNetworkId: ya.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ms.MainnetSingleSig,
    multiSig: ms.MainnetMultiSig
  },
  client: { baseUrl: Qh }
}, il = {
  chainId: ws.Testnet,
  transactionVersion: bs.Testnet,
  peerNetworkId: ya.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ms.TestnetSingleSig,
    multiSig: ms.TestnetMultiSig
  },
  client: { baseUrl: Jh }
}, ta = {
  ...il,
  addressVersion: { ...il.addressVersion },
  magicBytes: "id",
  client: { baseUrl: t0 }
}, hx = {
  ...ta,
  addressVersion: { ...ta.addressVersion },
  client: { ...ta.client }
};
function px(t) {
  switch (t) {
    case "mainnet":
      return dx;
    case "testnet":
      return il;
    case "devnet":
      return ta;
    case "mocknet":
      return hx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function gx(t) {
  return typeof t == "string" ? px(t) : t;
}
function yx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const cd = /* @__PURE__ */ new Map();
function Ap(t, e) {
  const n = cd.get(t);
  if (n !== void 0)
    return n(e);
  const r = yx(t);
  return cd.set(t, r), Ap(t, e);
}
let Zt = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Pt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Dw(this.readBytes(4), 0);
  }
  readUInt8() {
    return Hw(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Uw(this.readBytes(2), 0);
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
    if (Ap(e, r))
      return r;
    throw n(r);
  }
};
const wx = 128, bx = 128, vp = 16, is = 32, ol = 80, Ra = 65, mx = 32, xx = 64, wa = 34, Sx = 1 + 16 * 1024 * 1024, Ex = 165, Ax = 16, vx = 16, $x = 20, Ix = vx + 2 + $x, kx = Ix + 4, Lx = Sx + (Ex + Ax * kx);
var zt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(zt || (zt = {}));
var al;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(al || (al = {}));
var We;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(We || (We = {}));
const xc = ["onChainOnly", "offChainOnly", "any"];
xc[0] + "", We.OnChainOnly, xc[1] + "", We.OffChainOnly, xc[2] + "", We.Any, We.OnChainOnly + "", We.OnChainOnly, We.OffChainOnly + "", We.OffChainOnly, We.Any + "", We.Any;
var ba;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(ba || (ba = {}));
var Qt;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Qt || (Qt = {}));
var ie;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ie || (ie = {}));
var qt;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(qt || (qt = {}));
var re;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(re || (re = {}));
var Ki;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ki || (Ki = {}));
var cl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(cl || (cl = {}));
var ll;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(ll || (ll = {}));
var Ne;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ne || (Ne = {}));
var ld;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ld || (ld = {}));
var ul;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(ul || (ul = {}));
var mn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(mn || (mn = {}));
var ud;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(ud || (ud = {}));
let Ga = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ys = class extends Ga {
  constructor(e) {
    super(e);
  }
}, Te = class extends Ga {
  constructor(e) {
    super(e);
  }
}, ma = class extends Ga {
  constructor(e) {
    super(e);
  }
}, ts = class extends Ga {
  constructor(e) {
    super(e);
  }
};
function fl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Cx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function $p(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Bx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  fl(t.outputLen), fl(t.blockLen);
}
function Tx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Mx(t, e) {
  $p(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const es = {
  number: fl,
  bool: Cx,
  bytes: $p,
  hash: Bx,
  exists: Tx,
  output: Mx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Sc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), kn = (t, e) => t << 32 - e | t >>> e, Nx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Nx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function _x(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function pu(t) {
  if (typeof t == "string" && (t = _x(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Ip = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ts(t) {
  const e = (r) => t().update(pu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let kp = class extends Ip {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, es.hash(e);
    const r = pu(n);
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
    return es.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    es.exists(this), es.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Lp = (t, e, n) => new kp(t, e).update(n).digest();
Lp.create = (t, e) => new kp(t, e);
function Ux(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let gu = class extends Ip {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Sc(this.buffer);
  }
  update(e) {
    es.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = pu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Sc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    es.exists(this), es.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Ux(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Sc(e), c = this.outputLen;
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
const Px = (t, e, n) => t & e ^ ~t & n, Hx = (t, e, n) => t & e ^ t & n ^ e & n, Ox = new Uint32Array([
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
]), hr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), pr = new Uint32Array(64);
let Cp = class extends gu {
  constructor() {
    super(64, 32, 8, !1), this.A = hr[0] | 0, this.B = hr[1] | 0, this.C = hr[2] | 0, this.D = hr[3] | 0, this.E = hr[4] | 0, this.F = hr[5] | 0, this.G = hr[6] | 0, this.H = hr[7] | 0;
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
      pr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = pr[l - 15], h = pr[l - 2], m = kn(g, 7) ^ kn(g, 18) ^ g >>> 3, b = kn(h, 17) ^ kn(h, 19) ^ h >>> 10;
      pr[l] = b + pr[l - 7] + m + pr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = kn(a, 6) ^ kn(a, 11) ^ kn(a, 25), h = d + g + Px(a, c, f) + Ox[l] + pr[l] | 0, b = (kn(r, 2) ^ kn(r, 13) ^ kn(r, 22)) + Hx(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    pr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Dx = class extends Cp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const yu = Ts(() => new Cp());
Ts(() => new Dx());
const Fx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Bp = Uint8Array.from({ length: 16 }, (t, e) => e), jx = Bp.map((t) => (9 * t + 5) % 16);
let wu = [Bp], bu = [jx];
for (let t = 0; t < 4; t++)
  for (let e of [wu, bu])
    e.push(e[t].map((n) => Fx[n]));
const Tp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), zx = wu.map((t, e) => t.map((n) => Tp[e][n])), Rx = bu.map((t, e) => t.map((n) => Tp[e][n])), Gx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Kx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), No = (t, e) => t << e | t >>> 32 - e;
function fd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const _o = new Uint32Array(16);
let Vx = class extends gu {
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
      const m = 4 - h, b = Gx[h], C = Kx[h], P = wu[h], _ = bu[h], p = zx[h], $ = Rx[h];
      for (let I = 0; I < 16; I++) {
        const R = No(r + fd(h, i, a, f) + _o[P[I]] + b, p[I]) + l | 0;
        r = l, l = f, f = No(a, 10) | 0, a = i, i = R;
      }
      for (let I = 0; I < 16; I++) {
        const R = No(s + fd(m, o, c, d) + _o[_[I]] + C, $[I]) + g | 0;
        s = g, g = d, d = No(c, 10) | 0, c = o, o = R;
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
const qx = Ts(() => new Vx()), Uo = BigInt(2 ** 32 - 1), dl = BigInt(32);
function Mp(t, e = !1) {
  return e ? { h: Number(t & Uo), l: Number(t >> dl & Uo) } : { h: Number(t >> dl & Uo) | 0, l: Number(t & Uo) | 0 };
}
function Wx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Mp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Xx = (t, e) => BigInt(t >>> 0) << dl | BigInt(e >>> 0), Yx = (t, e, n) => t >>> n, Zx = (t, e, n) => t << 32 - n | e >>> n, Qx = (t, e, n) => t >>> n | e << 32 - n, Jx = (t, e, n) => t << 32 - n | e >>> n, tS = (t, e, n) => t << 64 - n | e >>> n - 32, eS = (t, e, n) => t >>> n - 32 | e << 64 - n, nS = (t, e) => e, rS = (t, e) => t, sS = (t, e, n) => t << n | e >>> 32 - n, iS = (t, e, n) => e << n | t >>> 32 - n, oS = (t, e, n) => e << n - 32 | t >>> 64 - n, aS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function cS(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const lS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), uS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, fS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), dS = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, hS = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), pS = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Et = {
  fromBig: Mp,
  split: Wx,
  toBig: Xx,
  shrSH: Yx,
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
}, [gS, yS] = Et.split([
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
].map((t) => BigInt(t))), gr = new Uint32Array(80), yr = new Uint32Array(80);
let Ka = class extends gu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: m, Hh: b, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, m, b, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, m, b, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = m | 0, this.Hh = b | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      gr[p] = e.getUint32(n), yr[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const $ = gr[p - 15] | 0, I = yr[p - 15] | 0, R = Et.rotrSH($, I, 1) ^ Et.rotrSH($, I, 8) ^ Et.shrSH($, I, 7), Y = Et.rotrSL($, I, 1) ^ Et.rotrSL($, I, 8) ^ Et.shrSL($, I, 7), H = gr[p - 2] | 0, q = yr[p - 2] | 0, S = Et.rotrSH(H, q, 19) ^ Et.rotrBH(H, q, 61) ^ Et.shrSH(H, q, 6), k = Et.rotrSL(H, q, 19) ^ Et.rotrBL(H, q, 61) ^ Et.shrSL(H, q, 6), N = Et.add4L(Y, k, yr[p - 7], yr[p - 16]), U = Et.add4H(N, R, S, gr[p - 7], gr[p - 16]);
      gr[p] = U | 0, yr[p] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: m, Gh: b, Gl: C, Hh: P, Hl: _ } = this;
    for (let p = 0; p < 80; p++) {
      const $ = Et.rotrSH(l, g, 14) ^ Et.rotrSH(l, g, 18) ^ Et.rotrBH(l, g, 41), I = Et.rotrSL(l, g, 14) ^ Et.rotrSL(l, g, 18) ^ Et.rotrBL(l, g, 41), R = l & h ^ ~l & b, Y = g & m ^ ~g & C, H = Et.add5L(_, I, Y, yS[p], yr[p]), q = Et.add5H(H, P, $, R, gS[p], gr[p]), S = H | 0, k = Et.rotrSH(r, s, 28) ^ Et.rotrBH(r, s, 34) ^ Et.rotrBH(r, s, 39), N = Et.rotrSL(r, s, 28) ^ Et.rotrBL(r, s, 34) ^ Et.rotrBL(r, s, 39), U = r & i ^ r & a ^ i & a, Z = s & o ^ s & c ^ o & c;
      P = b | 0, _ = C | 0, b = h | 0, C = m | 0, h = l | 0, m = g | 0, { h: l, l: g } = Et.add(f | 0, d | 0, q | 0, S | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const G = Et.add3L(S, N, Z);
      r = Et.add3H(G, q, k, U), s = G | 0;
    }
    ({ h: r, l: s } = Et.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Et.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = Et.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = Et.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: m } = Et.add(this.Fh | 0, this.Fl | 0, h | 0, m | 0), { h: b, l: C } = Et.add(this.Gh | 0, this.Gl | 0, b | 0, C | 0), { h: P, l: _ } = Et.add(this.Hh | 0, this.Hl | 0, P | 0, _ | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, m, b, C, P, _);
  }
  roundClean() {
    gr.fill(0), yr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, wS = class extends Ka {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, bS = class extends Ka {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, mS = class extends Ka {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ts(() => new Ka());
Ts(() => new wS());
const xS = Ts(() => new bS());
Ts(() => new mS());
var Tt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Tt || (Tt = {}));
var be;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(be || (be = {}));
function mu(t) {
  return be[t];
}
const SS = () => ({ type: Tt.BoolTrue }), ES = () => ({ type: Tt.BoolFalse }), AS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Tt.Buffer, value: st(t) };
}, dd = BigInt("0xffffffffffffffffffffffffffffffff"), vS = BigInt(0), hd = BigInt("0x7fffffffffffffffffffffffffffffff"), pd = BigInt("-170141183460469231731687303715884105728"), $S = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = Gc(Pt(t))), Ge(t, Uint8Array) && (t = Gc(t));
  const e = Le(t);
  if (e > hd)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${hd}`);
  if (e < pd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${pd}`);
  return { type: Tt.Int, value: e };
}, IS = (t) => {
  const e = Le(t);
  if (e < vS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > dd)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${dd}`);
  return { type: Tt.UInt, value: e };
};
function kS(t) {
  return { type: Tt.List, value: t };
}
function Np() {
  return { type: Tt.OptionalNone };
}
function _p(t) {
  return { type: Tt.OptionalSome, value: t };
}
var W;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(W || (W = {}));
function LS() {
  return {
    type: W.Address,
    version: ms.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function gd(t) {
  if (t && Rp(t, wa))
    throw new Error(`Memo exceeds maximum length of ${wa} bytes`);
  return { type: W.MemoString, content: t };
}
function xu(t, e) {
  return {
    type: W.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function hl(t) {
  if (Pt(t).byteLength != Ra)
    throw Error("Invalid signature");
  return {
    type: W.MessageSignature,
    data: t
  };
}
function CS(t, e, n) {
  return typeof t == "string" && (t = KS(t)), typeof n == "string" && (n = gd(n)), {
    type: W.Payload,
    payloadType: zt.TokenTransfer,
    recipient: t,
    amount: Le(e),
    memo: n ?? gd("")
  };
}
function BS(t, e, n, r) {
  return typeof e == "string" && (e = En(e)), typeof n == "string" && (n = En(n)), {
    type: W.Payload,
    payloadType: zt.ContractCall,
    contractAddress: typeof t == "string" ? Dr(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function TS(t) {
  return En(t, 4, 1e5);
}
function yd(t, e, n) {
  return typeof t == "string" && (t = En(t)), typeof e == "string" && (e = TS(e)), typeof n == "number" ? {
    type: W.Payload,
    payloadType: zt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: W.Payload,
    payloadType: zt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function MS() {
  return { type: W.Payload, payloadType: zt.PoisonMicroblock };
}
function wd(t, e) {
  if (t.byteLength != is)
    throw Error(`Coinbase buffer size must be ${is} bytes`);
  return e != null ? {
    type: W.Payload,
    payloadType: zt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: W.Payload,
    payloadType: zt.Coinbase,
    coinbaseBytes: t
  };
}
function NS(t, e, n) {
  if (t.byteLength != is)
    throw Error(`Coinbase buffer size must be ${is} bytes`);
  if (n.byteLength != ol)
    throw Error(`VRF proof buffer size must be ${ol} bytes`);
  return {
    type: W.Payload,
    payloadType: zt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Tt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function _S(t, e, n, r, s, i, o) {
  return {
    type: W.Payload,
    payloadType: zt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function En(t, e, n) {
  const r = e || 1, s = n || wx;
  if (Rp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: W.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function US(t, e, n) {
  return {
    type: W.Asset,
    address: Dr(t),
    contractName: En(e),
    assetName: En(n)
  };
}
function Dr(t) {
  const e = Bs.c32addressDecode(t);
  return {
    type: W.Address,
    version: e[0],
    hash160: e[1]
  };
}
function PS(t, e) {
  const n = Dr(t), r = En(e);
  return {
    type: W.Principal,
    prefix: Ne.Contract,
    address: n,
    contractName: r
  };
}
function HS(t) {
  const e = Dr(t);
  return {
    type: W.Principal,
    prefix: Ne.Standard,
    address: e
  };
}
function Zs(t, e) {
  return {
    pubKeyEncoding: t,
    type: W.TransactionAuthField,
    contents: e
  };
}
function Kn(t) {
  switch (t.type) {
    case W.Address:
      return ho(t);
    case W.Principal:
      return Up(t);
    case W.LengthPrefixedString:
      return gi(t);
    case W.MemoString:
      return DS(t);
    case W.Asset:
      return Hp(t);
    case W.PostCondition:
      return Dp(t);
    case W.PublicKey:
      return yl(t);
    case W.LengthPrefixedList:
      return Su(t);
    case W.Payload:
      return Fp(t);
    case W.TransactionAuthField:
      return GS(t);
    case W.MessageSignature:
      return Eu(t);
  }
}
function ho(t) {
  const e = [];
  return e.push(Pt(oo(t.version, 1))), e.push(Pt(t.hash160)), fe(e);
}
function pi(t) {
  const e = Ge(t, Zt) ? t : new Zt(t), n = Ba(st(e.readBytes(1))), r = st(e.readBytes(20));
  return { type: W.Address, version: n, hash160: r };
}
function Up(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === Ne.Standard || t.prefix === Ne.Contract) && e.push(ho(t.address)), t.prefix === Ne.Contract && e.push(gi(t.contractName)), fe(e);
}
function OS(t) {
  const e = Ge(t, Zt) ? t : new Zt(t), n = e.readUInt8Enum(Ne, (i) => {
    throw new Te(`Unexpected Principal payload type: ${i}`);
  });
  if (n === Ne.Origin)
    return { type: W.Principal, prefix: n };
  const r = pi(e);
  if (n === Ne.Standard)
    return { type: W.Principal, prefix: n, address: r };
  const s = cn(e);
  return {
    type: W.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function gi(t) {
  const e = [], n = Is(t.content), r = n.byteLength;
  return e.push(Pt(oo(r, t.lengthPrefixBytes))), e.push(n), fe(e);
}
function cn(t, e, n) {
  e = e || 1;
  const r = Ge(t, Zt) ? t : new Zt(t), s = Ba(st(r.readBytes(e))), i = ao(r.readBytes(s));
  return En(i, e, n ?? 128);
}
function DS(t) {
  const e = [], n = Is(t.content), r = h3(st(n), wa * 2);
  return e.push(Pt(r)), fe(e);
}
function Pp(t) {
  const e = Ge(t, Zt) ? t : new Zt(t);
  let n = ao(e.readBytes(wa));
  return n = n.replace(/\u0000*$/, ""), { type: W.MemoString, content: n };
}
function Hp(t) {
  const e = [];
  return e.push(ho(t.address)), e.push(gi(t.contractName)), e.push(gi(t.assetName)), fe(e);
}
function pl(t) {
  const e = Ge(t, Zt) ? t : new Zt(t);
  return {
    type: W.Asset,
    address: pi(e),
    contractName: cn(e),
    assetName: cn(e)
  };
}
function Su(t) {
  const e = t.values, n = [];
  n.push(Pt(oo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Kn(r));
  return fe(n);
}
function Op(t, e, n) {
  const r = Ge(t, Zt) ? t : new Zt(t), s = Ba(st(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case W.Address:
        i.push(pi(r));
        break;
      case W.LengthPrefixedString:
        i.push(cn(r));
        break;
      case W.MemoString:
        i.push(Pp(r));
        break;
      case W.Asset:
        i.push(pl(r));
        break;
      case W.PostCondition:
        i.push(jS(r));
        break;
      case W.PublicKey:
        i.push(wl(r));
        break;
      case W.TransactionAuthField:
        i.push(RS(r));
        break;
    }
  return xu(i, n);
}
function FS(t) {
  return st(Dp(t));
}
function Dp(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Up(t.principal)), (t.conditionType === Qt.Fungible || t.conditionType === Qt.NonFungible) && e.push(Hp(t.asset)), t.conditionType === Qt.NonFungible && e.push(Nn(t.assetName)), e.push(t.conditionCode), t.conditionType === Qt.STX || t.conditionType === Qt.Fungible || t.conditionType === Qt.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ys("The post-condition amount may not be larger than 8 bytes");
    e.push(Ur(t.amount, 8));
  }
  return fe(e);
}
function jS(t) {
  const e = Ge(t, Zt) ? t : new Zt(t), n = e.readUInt8Enum(Qt, (a) => {
    throw new Te(`Could not read ${a} as PostConditionType`);
  }), r = OS(e);
  let s, i, o;
  switch (n) {
    case Qt.STX:
      return s = e.readUInt8Enum(Ki, (c) => {
        throw new Te(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${st(e.readBytes(8))}`), {
        type: W.PostCondition,
        conditionType: Qt.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Qt.Fungible:
      return i = pl(e), s = e.readUInt8Enum(Ki, (c) => {
        throw new Te(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${st(e.readBytes(8))}`), {
        type: W.PostCondition,
        conditionType: Qt.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case Qt.NonFungible:
      i = pl(e);
      const a = Tn(e);
      return s = e.readUInt8Enum(cl, (c) => {
        throw new Te(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: W.PostCondition,
        conditionType: Qt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case Qt.Staking:
      return s = e.readUInt8Enum(Ki, (c) => {
        throw new Te(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${st(e.readBytes(8))}`), {
        type: W.PostCondition,
        conditionType: Qt.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Qt.PoX: {
      const c = e.readUInt8Enum(ll, (f) => {
        throw new Te(`Could not read ${f} as PoxConditionCode`);
      });
      return {
        type: W.PostCondition,
        conditionType: Qt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function Fp(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case zt.TokenTransfer:
      e.push(Nn(t.recipient)), e.push(Ur(t.amount, 8)), e.push(Kn(t.memo));
      break;
    case zt.ContractCall:
      e.push(Kn(t.contractAddress)), e.push(Kn(t.contractName)), e.push(Kn(t.functionName));
      const n = new Uint8Array(4);
      ls(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Nn(r));
      });
      break;
    case zt.SmartContract:
      e.push(Kn(t.contractName)), e.push(Kn(t.codeBody));
      break;
    case zt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Kn(t.contractName)), e.push(Kn(t.codeBody));
      break;
    case zt.PoisonMicroblock:
      break;
    case zt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case zt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Nn(t.recipient));
      break;
    case zt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Nn(t.recipient ? _p(t.recipient) : Np())), e.push(t.vrfProof);
      break;
    case zt.TenureChange:
      e.push(Pt(t.tenureHash)), e.push(Pt(t.previousTenureHash)), e.push(Pt(t.burnViewHash)), e.push(Pt(t.previousTenureEnd)), e.push(ls(new Uint8Array(4), t.previousTenureBlocks)), e.push(Ow(new Uint8Array(1), t.cause)), e.push(Pt(t.publicKeyHash));
      break;
  }
  return fe(e);
}
function zS(t) {
  const e = Ge(t, Zt) ? t : new Zt(t);
  switch (e.readUInt8Enum(zt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case zt.TokenTransfer:
      const r = Tn(e), s = Le(e.readBytes(8)), i = Pp(e);
      return CS(r, s, i);
    case zt.ContractCall:
      const o = pi(e), a = cn(e), c = cn(e), f = [], d = e.readUInt32BE();
      for (let $ = 0; $ < d; $++) {
        const I = Tn(e);
        f.push(I);
      }
      return BS(o, a, c, f);
    case zt.SmartContract:
      const l = cn(e), g = cn(e, 4, 1e5);
      return yd(l, g);
    case zt.VersionedSmartContract: {
      const $ = e.readUInt8Enum(al, (Y) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Y}`);
      }), I = cn(e), R = cn(e, 4, Lx);
      return yd(I, R, $);
    }
    case zt.PoisonMicroblock:
      return MS();
    case zt.Coinbase: {
      const $ = e.readBytes(is);
      return wd($);
    }
    case zt.CoinbaseToAltRecipient: {
      const $ = e.readBytes(is), I = Tn(e);
      return wd($, I);
    }
    case zt.NakamotoCoinbase: {
      const $ = e.readBytes(is), I = Tn(e), R = e.readBytes(ol);
      return NS($, I, R);
    }
    case zt.TenureChange:
      const h = st(e.readBytes(20)), m = st(e.readBytes(20)), b = st(e.readBytes(20)), C = st(e.readBytes(32)), P = e.readUInt32BE(), _ = e.readUInt8Enum(ul, ($) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${$}`);
      }), p = st(e.readBytes(20));
      return _S(h, m, b, C, P, _, p);
  }
}
function gl(t) {
  const e = Ge(t, Zt) ? t : new Zt(t);
  return hl(st(e.readBytes(Ra)));
}
function RS(t) {
  const e = Ge(t, Zt) ? t : new Zt(t), n = e.readUInt8Enum(mn, (r) => {
    throw new Te(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case mn.PublicKeyCompressed:
      return Zs(re.Compressed, wl(e));
    case mn.PublicKeyUncompressed:
      return Zs(re.Uncompressed, Ai(v3(wl(e).data)));
    case mn.SignatureCompressed:
      return Zs(re.Compressed, gl(e));
    case mn.SignatureUncompressed:
      return Zs(re.Uncompressed, gl(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Eu(t) {
  return Pt(t.data);
}
function GS(t) {
  const e = [];
  switch (t.contents.type) {
    case W.PublicKey:
      e.push(t.pubKeyEncoding === re.Compressed ? mn.PublicKeyCompressed : mn.PublicKeyUncompressed), e.push(Pt(A3(t.contents.data)));
      break;
    case W.MessageSignature:
      e.push(t.pubKeyEncoding === re.Compressed ? mn.SignatureCompressed : mn.SignatureUncompressed), e.push(Eu(t.contents));
      break;
  }
  return fe(e);
}
function yl(t) {
  return t.data.slice();
}
function wl(t) {
  const e = Ge(t, Zt) ? t : new Zt(t), n = e.readUInt8(), r = n === 4 ? xx : mx;
  return Ai(fe([n, e.readBytes(r)]));
}
function Au(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === qt.P2PKH || e === qt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === qt.P2WPKH || e === qt.P2WSH || e === qt.P2WSHNonSequential) && !r.map((s) => s.data).every(vi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case qt.P2PKH:
      return Po(t, p3(r[0].data));
    case qt.P2WPKH:
      return Po(t, g3(r[0].data));
    case qt.P2SH:
    case qt.P2SHNonSequential:
      return Po(t, y3(n, r.map(yl)));
    case qt.P2WSH:
    case qt.P2WSHNonSequential:
      return Po(t, w3(n, r.map(yl)));
  }
}
function Po(t, e) {
  return { type: W.Address, version: t, hash160: e };
}
function vu(t) {
  return Bs.c32address(t.version, t.hash160);
}
function bd(t) {
  const [e, n, r] = t.split(/\.|::/);
  return US(e, n, r);
}
function Hi(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return PS(e, n);
  } else
    return HS(t);
}
function KS(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return WS(e, n);
  } else
    return VS(t);
}
function VS(t) {
  const e = Dr(t);
  return { type: Tt.PrincipalStandard, value: vu(e) };
}
function qS(t) {
  return { type: Tt.PrincipalStandard, value: vu(t) };
}
function WS(t, e) {
  const n = Dr(t), r = En(e);
  return jp(n, r);
}
function jp(t, e) {
  if (Is(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Tt.PrincipalContract,
    value: `${vu(t)}.${e.content}`
  };
}
function XS(t) {
  return { type: Tt.ResponseErr, value: t };
}
function YS(t) {
  return { type: Tt.ResponseOk, value: t };
}
const ZS = (t) => ({ type: Tt.StringASCII, value: t }), QS = (t) => ({ type: Tt.StringUTF8, value: t });
function JS(t) {
  for (const e in t)
    if (!b3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Tt.Tuple, value: t };
}
function Tn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Zt(Pt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Zt(t) : e = t;
  switch (e.readUInt8Enum(be, (r) => {
    throw new Te(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case be.int:
      return $S(Gc(e.readBytes(16)));
    case be.uint:
      return IS(e.readBytes(16));
    case be.buffer:
      const r = e.readUInt32BE();
      return AS(e.readBytes(r));
    case be.true:
      return SS();
    case be.false:
      return ES();
    case be.address:
      const s = pi(e);
      return qS(s);
    case be.contract:
      const i = pi(e), o = cn(e);
      return jp(i, o);
    case be.ok:
      return YS(Tn(e));
    case be.err:
      return XS(Tn(e));
    case be.none:
      return Np();
    case be.some:
      return _p(Tn(e));
    case be.list:
      const a = e.readUInt32BE(), c = [];
      for (let b = 0; b < a; b++)
        c.push(Tn(e));
      return kS(c);
    case be.tuple:
      const f = e.readUInt32BE(), d = {};
      for (let b = 0; b < f; b++) {
        const C = cn(e).content;
        if (C === void 0)
          throw new Te('"content" is undefined');
        d[C] = Tn(e);
      }
      return JS(d);
    case be.ascii:
      const l = e.readUInt32BE(), g = Bw(e.readBytes(l));
      return ZS(g);
    case be.utf8:
      const h = e.readUInt32BE(), m = ao(e.readBytes(h));
      return QS(m);
    default:
      throw new Te("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function On(t, e) {
  return fe([mu(t), e]);
}
function t3(t) {
  return new Uint8Array([mu(t.type)]);
}
function e3(t) {
  return t.type === Tt.OptionalNone ? new Uint8Array([mu(t.type)]) : On(t.type, Nn(t.value));
}
function n3(t) {
  const e = new Uint8Array(4);
  return ls(e, Math.ceil(t.value.length / 2), 0), On(t.type, Pn(e, Pt(t.value)));
}
function r3(t) {
  const e = Wl($w(BigInt(t.value), BigInt(bx)), vp);
  return On(t.type, e);
}
function s3(t) {
  const e = Wl(BigInt(t.value), vp);
  return On(t.type, e);
}
function i3(t) {
  return On(t.type, ho(Dr(t.value)));
}
function o3(t) {
  const [e, n] = m3(t.value);
  return On(t.type, Pn(ho(Dr(e)), gi(En(n))));
}
function a3(t) {
  return On(t.type, Nn(t.value));
}
function c3(t) {
  const e = [], n = new Uint8Array(4);
  ls(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Nn(r);
    e.push(s);
  }
  return On(t.type, fe(e));
}
function l3(t) {
  const e = [], n = new Uint8Array(4);
  ls(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = En(s);
    e.push(gi(i));
    const o = Nn(t.value[s]);
    e.push(o);
  }
  return On(t.type, fe(e));
}
function zp(t, e) {
  const n = [], r = e == "ascii" ? Cw(t.value) : Is(t.value), s = new Uint8Array(4);
  return ls(s, r.length, 0), n.push(s), n.push(r), On(t.type, fe(n));
}
function u3(t) {
  return zp(t, "ascii");
}
function f3(t) {
  return zp(t, "utf8");
}
function md(t) {
  return st(Nn(t));
}
function Nn(t) {
  switch (t.type) {
    case Tt.BoolTrue:
    case Tt.BoolFalse:
      return t3(t);
    case Tt.OptionalNone:
    case Tt.OptionalSome:
      return e3(t);
    case Tt.Buffer:
      return n3(t);
    case Tt.UInt:
      return s3(t);
    case Tt.Int:
      return r3(t);
    case Tt.PrincipalStandard:
      return i3(t);
    case Tt.PrincipalContract:
      return o3(t);
    case Tt.ResponseOk:
    case Tt.ResponseErr:
      return a3(t);
    case Tt.List:
      return c3(t);
    case Tt.Tuple:
      return l3(t);
    case Tt.StringASCII:
      return u3(t);
    case Tt.StringUTF8:
      return f3(t);
    default:
      throw new Ys("Unable to serialize. Invalid Clarity Value.");
  }
}
const d3 = (t) => t.length % 2 ? `0${t}` : t, h3 = (t, e) => t.padEnd(e, "0"), Rp = (t, e) => t ? Is(t).length > e : !1;
function bl(t) {
  return xp(t);
}
const Yi = (t) => qx(yu(t)), $u = (t) => st(xS(t)), p3 = (t) => st(Yi(t)), g3 = (t) => {
  const e = Yi(t), n = Pn(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Yi(n);
  return st(r);
}, y3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = fe(n), s = Yi(r);
  return st(s);
}, w3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = fe(n), s = yu(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = fe(i), a = Yi(o);
  return st(a);
};
function b3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function m3(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
ae.hmacSha256Sync = (t, ...e) => {
  const n = Lp.create(yu, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Ai(t) {
  return t = typeof t == "string" ? Pt(t) : t, {
    type: W.PublicKey,
    data: t
  };
}
function x3(t, e, n = re.Compressed) {
  const r = _w(e), s = new Qe(mf(r.r), mf(r.s)), i = kt.fromSignature(t, s, r.recoveryId), o = n === re.Compressed;
  return i.toHex(o);
}
function S3(t) {
  return typeof t == "string" ? t : st(t);
}
const Iu = S3;
function Gp(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Nw;
}
function vi(t) {
  return !Iu(t).startsWith("04");
}
function E3(t) {
  t = Xl(t);
  const e = Gp(t);
  return st(co(t.slice(0, 32), e));
}
function A3(t) {
  return kt.fromHex(Iu(t)).toHex(!0);
}
function v3(t) {
  return kt.fromHex(Iu(t)).toHex(!1);
}
function $3(t, e) {
  t = Xl(t);
  const [n, r] = Ma(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return oo(r, 1) + Qe.fromHex(n).toCompactHex();
}
function ku() {
  return {
    type: W.MessageSignature,
    data: st(new Uint8Array(Ra))
  };
}
function Kp(t, e, n, r) {
  const s = Au(0, t, 1, [Ai(e)]).hash160, i = vi(e) ? re.Compressed : re.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Le(n),
    fee: Le(r),
    keyEncoding: i,
    signature: ku()
  };
}
function Zi(t) {
  return "signature" in t;
}
function xd(t) {
  return t === qt.P2SH || t === qt.P2WSH;
}
function I3(t) {
  return t === qt.P2SHNonSequential || t === qt.P2WSHNonSequential;
}
function Sd(t) {
  const e = bl(t);
  return e.nonce = 0, e.fee = 0, Zi(e) ? e.signature = ku() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function k3(t) {
  const e = [
    t.hashMode,
    Pt(t.signer),
    Ur(t.nonce, 8),
    Ur(t.fee, 8),
    t.keyEncoding,
    Eu(t.signature)
  ];
  return fe(e);
}
function L3(t) {
  const e = [
    t.hashMode,
    Pt(t.signer),
    Ur(t.nonce, 8),
    Ur(t.fee, 8)
  ], n = xu(t.fields);
  e.push(Su(n));
  const r = new Uint8Array(2);
  return Pw(r, t.signaturesRequired, 0), e.push(r), fe(e);
}
function C3(t, e) {
  const n = st(e.readBytes(20)), r = BigInt(`0x${st(e.readBytes(8))}`), s = BigInt(`0x${st(e.readBytes(8))}`), i = e.readUInt8Enum(re, (a) => {
    throw new Te(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === qt.P2WPKH && i != re.Compressed)
    throw new Te("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = gl(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function B3(t, e) {
  const n = st(e.readBytes(20)), r = BigInt("0x" + st(e.readBytes(8))), s = BigInt("0x" + st(e.readBytes(8))), i = Op(e, W.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const f of i)
    switch (f.contents.type) {
      case W.PublicKey:
        vi(f.contents.data) || (o = !0);
        break;
      case W.MessageSignature:
        if (f.pubKeyEncoding === re.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new ts("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === qt.P2WSH || t === qt.P2WSHNonSequential))
    throw new ts("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Ec(t) {
  return Zi(t) ? k3(t) : L3(t);
}
function Ac(t) {
  const e = t.readUInt8Enum(qt, (n) => {
    throw new Te(`Could not parse ${n} as AddressHashMode`);
  });
  return e === qt.P2PKH || e === qt.P2WPKH ? C3(e, t) : B3(e, t);
}
function Vp(t, e, n, r) {
  const i = t + st(new Uint8Array([e])) + st(Ur(n, 8)) + st(Ur(r, 8));
  if (Pt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return $u(Pt(i));
}
function qp(t, e, n) {
  const r = 33 + Ra, s = vi(e.data) ? re.Compressed : re.Uncompressed, i = t + d3(s.toString(16)) + n, o = Pt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return $u(o);
}
function T3(t, e, n, r, s) {
  const i = Vp(t, e, n, r), o = $3(s, i), a = Ai(E3(s)), c = qp(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Wp(t, e, n, r, s, i) {
  const o = Vp(t, e, n, r), a = Ai(x3(o, i, s)), c = qp(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function M3() {
  const t = Kp(qt.P2PKH, "", 0, 0);
  return t.signer = LS().hash160, t.keyEncoding = re.Compressed, t.signature = ku(), t;
}
function Ed(t, e, n) {
  return Zi(t) ? N3(t, e, n) : _3(t, e, n);
}
function N3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Wp(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Au(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new ts(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function _3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case W.PublicKey:
        vi(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case W.MessageSignature:
        c.pubKeyEncoding === re.Uncompressed && (i = !0);
        const { pubKey: f, nextSigHash: d } = Wp(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (xd(t.hashMode) && (s = d), r.push(f), o += 1, o === 65536)
          throw new ts("Too many signatures");
        break;
    }
  if (xd(t.hashMode) && o !== t.signaturesRequired || I3(t.hashMode) && o < t.signaturesRequired)
    throw new ts("Incorrect number of signatures");
  if (i && (t.hashMode === qt.P2WSH || t.hashMode === qt.P2WSHNonSequential))
    throw new ts("Uncompressed keys are not allowed in this hash mode");
  const a = Au(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new ts(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Xp(t) {
  return {
    authType: ie.Standard,
    spendingCondition: t
  };
}
function Yp(t, e) {
  return {
    authType: ie.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Kp(qt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Ad(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case ie.Standard:
        return Xp(Sd(t.spendingCondition));
      case ie.Sponsored:
        return Yp(Sd(t.spendingCondition), M3());
      default:
        throw new ma("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function U3(t, e) {
  switch (t.authType) {
    case ie.Standard:
      return Ed(t.spendingCondition, e, ie.Standard);
    case ie.Sponsored:
      return Ed(t.spendingCondition, e, ie.Standard);
    default:
      throw new ma("Invalid origin auth type");
  }
}
function P3(t, e) {
  switch (t.authType) {
    case ie.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Le(e)
      };
      return { ...t, spendingCondition: n };
    case ie.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Le(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function H3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Le(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function O3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Le(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function D3(t, e) {
  const n = {
    ...e,
    nonce: Le(e.nonce),
    fee: Le(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function F3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case ie.Standard:
      e.push(Ec(t.spendingCondition));
      break;
    case ie.Sponsored:
      e.push(Ec(t.spendingCondition)), e.push(Ec(t.sponsorSpendingCondition));
      break;
  }
  return fe(e);
}
function j3(t) {
  const e = t.readUInt8Enum(ie, (r) => {
    throw new Te(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case ie.Standard:
      return n = Ac(t), Xp(n);
    case ie.Sponsored:
      n = Ac(t);
      const r = Ac(t);
      return Yp(n, r);
  }
}
class z3 {
  constructor({ auth: e, payload: n, postConditions: r = xu([]), postConditionMode: s = ba.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = gx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Le(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = We.Any;
  }
  signBegin() {
    const e = bl(this);
    return e.auth = Ad(e.auth), e.txid();
  }
  verifyBegin() {
    const e = bl(this);
    return e.auth = Ad(e.auth), e.txid();
  }
  verifyOrigin() {
    return U3(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, ie.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === ie.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, ie.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : Ai(e), r = this.auth.spendingCondition;
    if (r && !Zi(r)) {
      const s = vi(n.data);
      r.fields.push(Zs(s ? re.Compressed : re.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = T3(n, r, e.fee, e.nonce, s);
    if (Zi(e))
      e.signature = hl(i);
    else {
      const a = Gp(s);
      e.fields.push(Zs(a ? re.Compressed : re.Uncompressed, hl(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return $u(e);
  }
  setSponsor(e) {
    if (this.auth.authType != ie.Sponsored)
      throw new ma("Cannot sponsor sign a non-sponsored transaction");
    this.auth = D3(this.auth, e);
  }
  setFee(e) {
    this.auth = P3(this.auth, e);
  }
  setNonce(e) {
    this.auth = H3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != ie.Sponsored)
      throw new ma("Cannot sponsor sign a non-sponsored transaction");
    this.auth = O3(this.auth, e);
  }
  serialize() {
    return st(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Ys('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Ys('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ys('"auth" is undefined');
    if (this.payload === void 0)
      throw new Ys('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return ls(n, this.chainId, 0), e.push(n), e.push(F3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Su(this.postConditions)), e.push(Fp(this.payload)), fe(e);
  }
}
function R3(t) {
  const e = Ge(t, Zt) ? t : new Zt(t), n = e.readUInt8Enum(bs, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = j3(e), i = e.readUInt8Enum(We, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(ba, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = Op(e, W.PostCondition), c = zS(e), f = new z3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return f.anchorMode = i, f;
}
const vd = BigInt("18446744073709551615");
function vc(t) {
  const e = Le(t);
  if (e < 0n || e > vd)
    throw new RangeError(`Post-condition amount must be between 0 and ${vd} (u64 max), received: ${e}`);
  return e;
}
var ml;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(ml || (ml = {}));
var xl;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(xl || (xl = {}));
function G3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: W.PostCondition,
        conditionType: Qt.STX,
        principal: t.address === "origin" ? { type: W.Principal, prefix: Ne.Origin } : Hi(t.address),
        conditionCode: Ho(t.condition),
        amount: vc(t.amount)
      };
    case "ft-postcondition":
      return {
        type: W.PostCondition,
        conditionType: Qt.Fungible,
        principal: t.address === "origin" ? { type: W.Principal, prefix: Ne.Origin } : Hi(t.address),
        conditionCode: Ho(t.condition),
        amount: vc(t.amount),
        asset: bd(t.asset)
      };
    case "nft-postcondition":
      return {
        type: W.PostCondition,
        conditionType: Qt.NonFungible,
        principal: t.address === "origin" ? { type: W.Principal, prefix: Ne.Origin } : Hi(t.address),
        conditionCode: Ho(t.condition),
        asset: bd(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: W.PostCondition,
        conditionType: Qt.Staking,
        principal: t.address === "origin" ? { type: W.Principal, prefix: Ne.Origin } : Hi(t.address),
        conditionCode: Ho(t.condition),
        amount: vc(t.amount)
      };
    case "pox-postcondition":
      return {
        type: W.PostCondition,
        conditionType: Qt.PoX,
        principal: t.address === "origin" ? { type: W.Principal, prefix: Ne.Origin } : Hi(t.address),
        conditionCode: K3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Ho(t) {
  return ml[t];
}
function K3(t) {
  return xl[t];
}
function Zp(t) {
  const e = G3(t);
  return FS(e);
}
function V3(t, e, n) {
  return Cu(Qp(t), n);
}
function Qp(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Qi(r);
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
    return BigInt(`0x${X3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Lu(t, e = 8) {
  return (typeof t == "bigint" ? t : Qp(t)).toString(16).padStart(e * 2, "0");
}
function Cu(t, e = 16) {
  const n = Lu(t, e);
  return Qi(n);
}
function q3(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const W3 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function X3(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += W3[n];
  return e;
}
function Qi(t) {
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
function Bu(t) {
  return new TextEncoder().encode(t);
}
function Y3(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Z3(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function $d(t) {
  if (t.some(Z3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Tu(...t) {
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
function Jn(t) {
  return Tu(...t.map((e) => typeof e == "number" ? $d([e]) : e instanceof Array ? $d(e) : e));
}
function Va(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Sl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Sl || (Sl = {}));
Sl.Mainnet;
const Q3 = 128, J3 = 128, Jp = 16;
var El;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(El || (El = {}));
var Id;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Id || (Id = {}));
var kd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(kd || (kd = {}));
var bn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(bn || (bn = {}));
const $c = ["onChainOnly", "offChainOnly", "any"];
$c[0] + "", bn.OnChainOnly, $c[1] + "", bn.OffChainOnly, $c[2] + "", bn.Any, bn.OnChainOnly + "", bn.OnChainOnly, bn.OffChainOnly + "", bn.OffChainOnly, bn.Any + "", bn.Any;
var Al;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Al || (Al = {}));
Al.Mainnet;
var Ld;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Ld || (Ld = {}));
var Yr;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Yr || (Yr = {}));
var Cd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Cd || (Cd = {}));
var Bd;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Bd || (Bd = {}));
var Td;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Td || (Td = {}));
var Md;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Md || (Md = {}));
var Nd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Nd || (Nd = {}));
var _d;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(_d || (_d = {}));
var vl;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(vl || (vl = {}));
var Ud;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ud || (Ud = {}));
var Pd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Pd || (Pd = {}));
function $l(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function tE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function tg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function eE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  $l(t.outputLen), $l(t.blockLen);
}
function nE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function rE(t, e) {
  tg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ic = {
  number: $l,
  bool: tE,
  bytes: tg,
  hash: eE,
  exists: nE,
  output: rE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const kc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ln = (t, e) => t << 32 - e | t >>> e, sE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!sE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function iE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function eg(t) {
  if (typeof t == "string" && (t = iE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let oE = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ms(t) {
  const e = (r) => t().update(eg(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function aE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let Mu = class extends oE {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = kc(this.buffer);
  }
  update(e) {
    Ic.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = eg(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = kc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ic.exists(this), Ic.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    aE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = kc(e), c = this.outputLen;
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
const cE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ng = Uint8Array.from({ length: 16 }, (t, e) => e), lE = ng.map((t) => (9 * t + 5) % 16);
let Nu = [ng], _u = [lE];
for (let t = 0; t < 4; t++)
  for (let e of [Nu, _u])
    e.push(e[t].map((n) => cE[n]));
const rg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), uE = Nu.map((t, e) => t.map((n) => rg[e][n])), fE = _u.map((t, e) => t.map((n) => rg[e][n])), dE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), hE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Oo = (t, e) => t << e | t >>> 32 - e;
function Hd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Do = new Uint32Array(16);
let pE = class extends Mu {
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
      Do[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const m = 4 - h, b = dE[h], C = hE[h], P = Nu[h], _ = _u[h], p = uE[h], $ = fE[h];
      for (let I = 0; I < 16; I++) {
        const R = Oo(r + Hd(h, i, a, f) + Do[P[I]] + b, p[I]) + l | 0;
        r = l, l = f, f = Oo(a, 10) | 0, a = i, i = R;
      }
      for (let I = 0; I < 16; I++) {
        const R = Oo(s + Hd(m, o, c, d) + Do[_[I]] + C, $[I]) + g | 0;
        s = g, g = d, d = Oo(c, 10) | 0, c = o, o = R;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Do.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Ms(() => new pE());
const gE = (t, e, n) => t & e ^ ~t & n, yE = (t, e, n) => t & e ^ t & n ^ e & n, wE = new Uint32Array([
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
let sg = class extends Mu {
  constructor() {
    super(64, 32, 8, !1), this.A = wr[0] | 0, this.B = wr[1] | 0, this.C = wr[2] | 0, this.D = wr[3] | 0, this.E = wr[4] | 0, this.F = wr[5] | 0, this.G = wr[6] | 0, this.H = wr[7] | 0;
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
      br[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = br[l - 15], h = br[l - 2], m = Ln(g, 7) ^ Ln(g, 18) ^ g >>> 3, b = Ln(h, 17) ^ Ln(h, 19) ^ h >>> 10;
      br[l] = b + br[l - 7] + m + br[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Ln(a, 6) ^ Ln(a, 11) ^ Ln(a, 25), h = d + g + gE(a, c, f) + wE[l] + br[l] | 0, b = (Ln(r, 2) ^ Ln(r, 13) ^ Ln(r, 22)) + yE(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    br.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, bE = class extends sg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Ms(() => new sg());
Ms(() => new bE());
const Fo = BigInt(2 ** 32 - 1), Il = BigInt(32);
function ig(t, e = !1) {
  return e ? { h: Number(t & Fo), l: Number(t >> Il & Fo) } : { h: Number(t >> Il & Fo) | 0, l: Number(t & Fo) | 0 };
}
function mE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = ig(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const xE = (t, e) => BigInt(t >>> 0) << Il | BigInt(e >>> 0), SE = (t, e, n) => t >>> n, EE = (t, e, n) => t << 32 - n | e >>> n, AE = (t, e, n) => t >>> n | e << 32 - n, vE = (t, e, n) => t << 32 - n | e >>> n, $E = (t, e, n) => t << 64 - n | e >>> n - 32, IE = (t, e, n) => t >>> n - 32 | e << 64 - n, kE = (t, e) => e, LE = (t, e) => t, CE = (t, e, n) => t << n | e >>> 32 - n, BE = (t, e, n) => e << n | t >>> 32 - n, TE = (t, e, n) => e << n - 32 | t >>> 64 - n, ME = (t, e, n) => t << n - 32 | e >>> 64 - n;
function NE(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const _E = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), UE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, PE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), HE = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, OE = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), DE = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, At = {
  fromBig: ig,
  split: mE,
  toBig: xE,
  shrSH: SE,
  shrSL: EE,
  rotrSH: AE,
  rotrSL: vE,
  rotrBH: $E,
  rotrBL: IE,
  rotr32H: kE,
  rotr32L: LE,
  rotlSH: CE,
  rotlSL: BE,
  rotlBH: TE,
  rotlBL: ME,
  add: NE,
  add3L: _E,
  add3H: UE,
  add4L: PE,
  add4H: HE,
  add5H: DE,
  add5L: OE
}, [FE, jE] = At.split([
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
let qa = class extends Mu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: m, Hh: b, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, m, b, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, m, b, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = m | 0, this.Hh = b | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      mr[p] = e.getUint32(n), xr[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const $ = mr[p - 15] | 0, I = xr[p - 15] | 0, R = At.rotrSH($, I, 1) ^ At.rotrSH($, I, 8) ^ At.shrSH($, I, 7), Y = At.rotrSL($, I, 1) ^ At.rotrSL($, I, 8) ^ At.shrSL($, I, 7), H = mr[p - 2] | 0, q = xr[p - 2] | 0, S = At.rotrSH(H, q, 19) ^ At.rotrBH(H, q, 61) ^ At.shrSH(H, q, 6), k = At.rotrSL(H, q, 19) ^ At.rotrBL(H, q, 61) ^ At.shrSL(H, q, 6), N = At.add4L(Y, k, xr[p - 7], xr[p - 16]), U = At.add4H(N, R, S, mr[p - 7], mr[p - 16]);
      mr[p] = U | 0, xr[p] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: m, Gh: b, Gl: C, Hh: P, Hl: _ } = this;
    for (let p = 0; p < 80; p++) {
      const $ = At.rotrSH(l, g, 14) ^ At.rotrSH(l, g, 18) ^ At.rotrBH(l, g, 41), I = At.rotrSL(l, g, 14) ^ At.rotrSL(l, g, 18) ^ At.rotrBL(l, g, 41), R = l & h ^ ~l & b, Y = g & m ^ ~g & C, H = At.add5L(_, I, Y, jE[p], xr[p]), q = At.add5H(H, P, $, R, FE[p], mr[p]), S = H | 0, k = At.rotrSH(r, s, 28) ^ At.rotrBH(r, s, 34) ^ At.rotrBH(r, s, 39), N = At.rotrSL(r, s, 28) ^ At.rotrBL(r, s, 34) ^ At.rotrBL(r, s, 39), U = r & i ^ r & a ^ i & a, Z = s & o ^ s & c ^ o & c;
      P = b | 0, _ = C | 0, b = h | 0, C = m | 0, h = l | 0, m = g | 0, { h: l, l: g } = At.add(f | 0, d | 0, q | 0, S | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const G = At.add3L(S, N, Z);
      r = At.add3H(G, q, k, U), s = G | 0;
    }
    ({ h: r, l: s } = At.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = At.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = At.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = At.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = At.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: m } = At.add(this.Fh | 0, this.Fl | 0, h | 0, m | 0), { h: b, l: C } = At.add(this.Gh | 0, this.Gl | 0, b | 0, C | 0), { h: P, l: _ } = At.add(this.Hh | 0, this.Hl | 0, P | 0, _ | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, m, b, C, P, _);
  }
  roundClean() {
    mr.fill(0), xr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, zE = class extends qa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, RE = class extends qa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, GE = class extends qa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ms(() => new qa());
Ms(() => new zE());
Ms(() => new RE());
Ms(() => new GE());
function KE(t, e, n) {
  const s = Q3;
  if (a4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: El.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var me;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(me || (me = {}));
let VE = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, og = class extends VE {
  constructor(e) {
    super(e);
  }
};
function Wa(t) {
  const e = [];
  return e.push(Qi(Lu(t.version, 1))), e.push(Qi(t.hash160)), Jn(e);
}
function qE(t) {
  const e = [];
  return e.push(t.prefix), e.push(Wa(t.address)), t.prefix === vl.Contract && e.push(Ji(t.contractName)), Jn(e);
}
function Ji(t) {
  const e = [], n = Bu(t.content), r = n.byteLength;
  return e.push(Qi(Lu(r, t.lengthPrefixBytes))), e.push(n), Jn(e);
}
function WE(t) {
  const e = [];
  return e.push(Wa(t.address)), e.push(Ji(t.contractName)), e.push(Ji(t.assetName)), Jn(e);
}
function ag(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(qE(t.principal)), (t.conditionType === Yr.Fungible || t.conditionType === Yr.NonFungible) && e.push(WE(t.assetInfo)), t.conditionType === Yr.NonFungible && e.push(xs(t.assetName)), e.push(t.conditionCode), t.conditionType === Yr.STX || t.conditionType === Yr.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new og("The post-condition amount may not be larger than 8 bytes");
    e.push(V3(t.amount, !1, 8));
  }
  return Jn(e);
}
function Dn(t, e) {
  return Jn([t, e]);
}
function XE(t) {
  return new Uint8Array([t.type]);
}
function YE(t) {
  return t.type === me.OptionalNone ? new Uint8Array([t.type]) : Dn(t.type, xs(t.value));
}
function ZE(t) {
  const e = new Uint8Array(4);
  return Va(e, t.buffer.length, 0), Dn(t.type, Tu(e, t.buffer));
}
function QE(t) {
  const e = Cu(q3(t.value, BigInt(J3)), Jp);
  return Dn(t.type, e);
}
function JE(t) {
  const e = Cu(t.value, Jp);
  return Dn(t.type, e);
}
function t4(t) {
  return Dn(t.type, Wa(t.address));
}
function e4(t) {
  return Dn(t.type, Tu(Wa(t.address), Ji(t.contractName)));
}
function n4(t) {
  return Dn(t.type, xs(t.value));
}
function r4(t) {
  const e = [], n = new Uint8Array(4);
  Va(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = xs(r);
    e.push(s);
  }
  return Dn(t.type, Jn(e));
}
function s4(t) {
  const e = [], n = new Uint8Array(4);
  Va(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = KE(s);
    e.push(Ji(i));
    const o = xs(t.data[s]);
    e.push(o);
  }
  return Dn(t.type, Jn(e));
}
function cg(t, e) {
  const n = [], r = e == "ascii" ? Y3(t.data) : Bu(t.data), s = new Uint8Array(4);
  return Va(s, r.length, 0), n.push(s), n.push(r), Dn(t.type, Jn(n));
}
function i4(t) {
  return cg(t, "ascii");
}
function o4(t) {
  return cg(t, "utf8");
}
function xs(t) {
  switch (t.type) {
    case me.BoolTrue:
    case me.BoolFalse:
      return XE(t);
    case me.OptionalNone:
    case me.OptionalSome:
      return YE(t);
    case me.Buffer:
      return ZE(t);
    case me.UInt:
      return JE(t);
    case me.Int:
      return QE(t);
    case me.PrincipalStandard:
      return t4(t);
    case me.PrincipalContract:
      return e4(t);
    case me.ResponseOk:
    case me.ResponseErr:
      return n4(t);
    case me.List:
      return r4(t);
    case me.Tuple:
      return s4(t);
    case me.StringASCII:
      return i4(t);
    case me.StringUTF8:
      return o4(t);
    default:
      throw new og("Unable to serialize. Invalid Clarity Value.");
  }
}
const a4 = (t, e) => t ? Bu(t).length > e : !1, c4 = "connect-ui";
let ea, lg, Xe = !1, kl = !1;
const Qn = (t, e = "") => () => {
}, l4 = (t, e) => () => {
}, u4 = "{visibility:hidden}.hydrated{visibility:inherit}", Od = {}, f4 = "http://www.w3.org/2000/svg", d4 = "http://www.w3.org/1999/xhtml", h4 = (t) => t != null, Uu = (t) => (t = typeof t, t === "object" || t === "function");
function ug(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const wt = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (f) => {
    for (let d = 0; d < f.length; d++)
      r = f[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !Uu(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Ll(null, r) : r), i = s);
  };
  if (a(n), e) {
    const f = e.className || e.class;
    f && (e.class = typeof f != "object" ? f : Object.keys(f).filter((d) => f[d]).join(" "));
  }
  const c = Ll(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Ll = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, p4 = {}, g4 = (t) => t && t.$tag$ === p4, y4 = (t, e) => t != null && !Uu(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, w4 = (t) => $i(t).$hostElement$, b4 = (t, e, n) => {
  const r = ke.ce(e, n);
  return t.dispatchEvent(r), r;
}, Dd = /* @__PURE__ */ new WeakMap(), m4 = (t, e, n) => {
  let r = xa.get(t);
  D4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, xa.set(t, r);
}, x4 = (t, e, n, r) => {
  var s;
  let i = fg(e);
  const o = xa.get(i);
  if (t = t.nodeType === 11 ? t : _n, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Dd.get(t), c;
      if (a || Dd.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = _n.createElement("style"), c.innerHTML = o;
          const f = (s = ke.$nonce$) !== null && s !== void 0 ? s : ug(_n);
          f != null && c.setAttribute("nonce", f), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, S4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Qn("attachStyles", e.$tagName$), i = x4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, fg = (t, e) => "sc-" + t.$tagName$, Fd = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = zd(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, f = jd(n), d = jd(r);
      c.remove(...f.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !f.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : zd(Xa, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && ke.rel(t, e, n, !1), r && ke.ael(t, e, r, !1);
    else {
      const c = Uu(r);
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
}, E4 = /\s/, jd = (t) => t ? t.split(E4) : [], dg = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || Od, o = e.$attrs$ || Od;
  for (r in i)
    r in o || Fd(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    Fd(s, r, i[r], o[r], n, e.$flags$);
}, Pu = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = _n.createTextNode(s.$text$);
  else {
    if (Xe || (Xe = s.$tag$ === "svg"), o = s.$elm$ = _n.createElementNS(Xe ? f4 : d4, s.$tag$), Xe && s.$tag$ === "foreignObject" && (Xe = !1), dg(null, s, Xe), h4(ea) && o["s-si"] !== ea && o.classList.add(o["s-si"] = ea), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = Pu(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Xe = !1 : o.tagName === "foreignObject" && (Xe = !0);
  }
  return o;
}, hg = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === lg && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = Pu(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, pg = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, A4 = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], f = r.length - 1, d = r[0], l = r[f], g;
  for (; s <= o && i <= f; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : d == null ? d = r[++i] : l == null ? l = r[--f] : jo(a, d) ? (Fi(a, d), a = e[++s], d = r[++i]) : jo(c, l) ? (Fi(c, l), c = e[--o], l = r[--f]) : jo(a, l) ? (Fi(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--f]) : jo(c, d) ? (Fi(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++i]) : (g = Pu(e && e[i], n, i), d = r[++i], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  s > o ? hg(t, r[f + 1] == null ? null : r[f + 1].$elm$, n, r, i, f) : i > f && pg(e, s, o);
}, jo = (t, e) => t.$tag$ === e.$tag$, Fi = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (Xe = i === "svg" ? !0 : i === "foreignObject" ? !1 : Xe, dg(t, e, Xe), r !== null && s !== null ? A4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), hg(n, null, e, s, 0, s.length - 1)) : r !== null && pg(r, 0, r.length - 1), Xe && i === "svg" && (Xe = !1)) : t.$text$ !== o && (n.data = o);
}, v4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Ll(null, null), s = g4(e) ? e : wt(null, null, e);
  lg = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, ea = n["s-sc"], Fi(r, s);
}, gg = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Hu = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return gg(t, t.$ancestorComponent$), j4(() => $4(t, e));
}, $4 = (t, e) => {
  const n = Qn("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), C4(s, () => I4(t, r, e));
}, I4 = async (t, e, n) => {
  const r = t.$hostElement$, s = Qn("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && S4(t);
  const o = Qn("render", t.$cmpMeta$.$tagName$);
  k4(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => L4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, k4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, v4(t, e);
  } catch (r) {
    to(r, t.$hostElement$);
  }
  return null;
}, L4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Qn("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, wg(n), r(), t.$onReadyResolve$(n), s || yg()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Du(() => Hu(t, !1)), t.$flags$ &= -517;
}, yg = (t) => {
  wg(_n.documentElement), Du(() => b4(Xa, "appload", { detail: { namespace: c4 } }));
}, C4 = (t, e) => t && t.then ? t.then(e) : e(), wg = (t) => t.classList.add("hydrated"), B4 = (t, e) => $i(t).$instanceValues$.get(e), T4 = (t, e, n, r) => {
  const s = $i(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = y4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), f = n !== i && !c;
  (!(o & 8) || i === void 0) && f && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && Hu(s, !1));
}, bg = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return B4(this, i);
        },
        set(a) {
          T4(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        ke.jmp(() => {
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
}, M4 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = O4(n), s.then) {
        const c = l4();
        s = await s, c();
      }
      s.isProxied || (bg(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Qn("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        to(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = fg(n);
      if (!xa.has(c)) {
        const f = Qn("registerStyles", n.$tagName$);
        m4(c, a, !!(n.$flags$ & 1)), f();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => Hu(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, N4 = (t) => {
  if (!(ke.$flags$ & 1)) {
    const e = $i(t), n = e.$cmpMeta$, r = Qn("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            gg(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), M4(t, e, n);
    }
    r();
  }
}, _4 = (t) => {
  ke.$flags$ & 1 || $i(t);
}, U4 = (t, e = {}) => {
  var n;
  const r = Qn(), s = [], i = e.exclude || [], o = Xa.customElements, a = _n.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), f = /* @__PURE__ */ _n.createElement("style"), d = [];
  let l, g = !0;
  Object.assign(ke, e), ke.$resourcesUrl$ = new URL(e.resourcesUrl || "./", _n.baseURI).href, t.map((h) => {
    h[1].map((m) => {
      const b = {
        $flags$: m[0],
        $tagName$: m[1],
        $members$: m[2],
        $listeners$: m[3]
      };
      b.$members$ = m[2];
      const C = b.$tagName$, P = class extends HTMLElement {
        // StencilLazyHost
        constructor(_) {
          super(_), _ = this, H4(_, b), b.$flags$ & 1 && _.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? d.push(this) : ke.jmp(() => N4(this));
        }
        disconnectedCallback() {
          ke.jmp(() => _4(this));
        }
        componentOnReady() {
          return $i(this).$onReadyPromise$;
        }
      };
      b.$lazyBundleId$ = h[0], !i.includes(C) && !o.get(C) && (s.push(C), o.define(C, bg(
        P,
        b,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    f.innerHTML = s + u4, f.setAttribute("data-styles", "");
    const h = (n = ke.$nonce$) !== null && n !== void 0 ? n : ug(_n);
    h != null && f.setAttribute("nonce", h), a.insertBefore(f, c ? c.nextSibling : a.firstChild);
  }
  g = !1, d.length ? d.map((h) => h.connectedCallback()) : ke.jmp(() => l = setTimeout(yg, 30)), r();
}, Ou = /* @__PURE__ */ new WeakMap(), $i = (t) => Ou.get(t), P4 = (t, e) => Ou.set(e.$lazyInstance$ = t, e), H4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], Ou.set(t, n);
}, zd = (t, e) => e in t, to = (t, e) => (0, console.error)(t, e), Lc = /* @__PURE__ */ new Map(), O4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Lc.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (Lc.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => n$).then(o, to);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Lc.set(s, o), o[r]), to);
}, xa = /* @__PURE__ */ new Map(), Xa = typeof window < "u" ? window : {}, _n = Xa.document || { head: {} }, ke = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, mg = (t) => Promise.resolve(t), D4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Rd = [], xg = [], F4 = (t, e) => (n) => {
  t.push(n), kl || (kl = !0, ke.$flags$ & 4 ? Du(Cl) : ke.raf(Cl));
}, Gd = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      to(n);
    }
  t.length = 0;
}, Cl = () => {
  Gd(Rd), Gd(xg), (kl = Rd.length > 0) && ke.raf(Cl);
}, Du = (t) => mg().then(t), j4 = /* @__PURE__ */ F4(xg), z4 = () => mg(), R4 = (t, e) => typeof window > "u" ? Promise.resolve() : z4().then(() => U4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var G4 = Object.defineProperty, K4 = Object.defineProperties, V4 = Object.getOwnPropertyDescriptors, Sa = Object.getOwnPropertySymbols, Sg = Object.prototype.hasOwnProperty, Eg = Object.prototype.propertyIsEnumerable, Kd = (t, e, n) => e in t ? G4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, tn = (t, e) => {
  for (var n in e || (e = {})) Sg.call(e, n) && Kd(t, n, e[n]);
  if (Sa) for (var n of Sa(e)) Eg.call(e, n) && Kd(t, n, e[n]);
  return t;
}, An = (t, e) => K4(t, V4(e)), Ag = (t, e) => {
  var n = {};
  for (var r in t) Sg.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Sa) for (var r of Sa(t)) e.indexOf(r) < 0 && Eg.call(t, r) && (n[r] = t[r]);
  return n;
};
function vg() {
  return za(ps()) || window.StacksProvider || window.BlockstackProvider;
}
function Ya(t) {
  return t ? typeof t == "string" ? ys.fromName(t) : "version" in t ? t : "url" in t ? new rl({ url: t.url }) : t.transactionVersion === bs.Mainnet ? new rl({ url: t.client.baseUrl }) : new sl({ url: t.client.baseUrl }) : new sl();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var q4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(q4 || {}), W4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(W4 || {}), Fu = (t) => {
  let e = t;
  if (!e) {
    let n = new e0(["store_write"], document.location.href);
    e = new nl({ appConfig: n });
  }
  return e;
};
function $g(t) {
  try {
    return Fu(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Ig = (t) => {
  let e = Fu(t).loadUserData().appPrivateKey, n = ve.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function X4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [ws.Mainnet]: "mainnet", [ws.Testnet]: "testnet" }, a = Ya(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function Y4(t) {
  let e = Ya(t.network), n = Fu(t.userSession), r = An(tn({}, t), { network: e, userSession: n });
  return tn({ stxAddress: X4(r) }, r);
}
async function Z4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Zp) : n = n.map((r) => st(ag(r)))), new ve.TokenSigner("ES256k", e).signAsync(An(tn({}, t), { postConditions: n }));
}
function Q4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(Zp) : e = e.map((n) => st(ag(n)))), ve.createUnsecuredToken(An(tn({}, t), { postConditions: e }));
}
var J4 = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Pt(a.replace(/^0x/, "")), f = R3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, An(tn({}, o), { stacksTransaction: f }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, An(tn({}, o), { stacksTransaction: f }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, tA = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = Ag(e, ["amount", "appDetails", "userSession"]);
  if ($g(s)) {
    let { privateKey: a, publicKey: c } = Ig(s), f = An(tn({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (f.appDetails = r), Z4(f, a);
  }
  let o = An(tn({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), Q4(o);
};
async function eA(t, e, n) {
  let r = await e(An(tn(tn({}, Y4(t)), t), { network: Ya(t.network) }));
  return J4({ token: r, options: t }, n);
}
function nA(t, e = vg()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return eA(t, tA, e);
}
function kg(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? An(tn({}, t), { message: md(e), domain: md(n) }) : An(tn({}, t), { message: st(xs(e)), domain: st(xs(n)) });
}
async function rA(t, e) {
  return new ve.TokenSigner("ES256k", e).signAsync(kg(t));
}
async function sA(t) {
  let e = t, { userSession: n } = e, r = Ag(e, ["userSession"]);
  if ($g(n)) {
    let { privateKey: s, publicKey: i } = Ig(n), o = An(tn({}, r), { publicKey: i });
    return rA(o, s);
  }
  return ve.createUnsecuredToken(kg(t));
}
var iA = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(iA || {}), Lg = "asigna-stx", Vd = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Lg && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(aA(t, e), "*");
}), oA = { authenticationRequest: async (t) => Vd(t, "authenticationRequest"), transactionRequest: async (t) => Vd(t, "transactionRequest") }, aA = (t, e) => ({ source: Lg, [e]: t }), cA = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = oA);
};
cA();
var lA = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function uA(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = ps(), o = vg();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    R4();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : lA, c = ex(a), f = document.createElement("connect-modal");
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
var zo = uA(nA);
function Pr(t, e, n) {
  return ju(Ue(t, e), n);
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
      r = r.padStart(r.length + r.length % 2, "0"), n = te(r);
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
      const r = hA(BigInt(`0x${Ct(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Ct(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function qd(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function po(t, e = 8) {
  return (typeof t == "bigint" ? t : Ue(t, !1)).toString(16).padStart(e * 2, "0");
}
function Za(t) {
  return parseInt(t, 16);
}
function ju(t, e = 16) {
  const n = po(t, e);
  return te(n);
}
function fA(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function dA(t, e) {
  return t & BigInt(1) << e;
}
function hA(t, e) {
  return dA(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const pA = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ct(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += pA[n];
  return e;
}
function te(t) {
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
function Ii(t) {
  return new TextEncoder().encode(t);
}
function zu(t) {
  return new TextDecoder().decode(t);
}
function Cg(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function gA(t) {
  return String.fromCharCode.apply(null, t);
}
function yA(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Wd(t) {
  if (t.some(yA))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Qa(...t) {
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
function de(t) {
  return Qa(...t.map((e) => typeof e == "number" ? Wd([e]) : e instanceof Array ? Wd(e) : e));
}
var Xd;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Xd || (Xd = {}));
var Yd;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Yd || (Yd = {}));
var Zd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Zd || (Zd = {}));
const Bg = 33, Cc = 32;
function wA(t) {
  if (t.length < Cc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Cc * 2), r = t.slice(2 + Cc * 2);
  return {
    recoveryId: Za(e),
    r: n,
    s: r
  };
}
function bA(t) {
  const e = typeof t == "string" ? te(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function mA(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function xA(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function SA(t, e) {
  return t[e];
}
function EA(t, e, n = 0) {
  return t[n] = e, t;
}
function AA(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Ss(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Bl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Bl || (Bl = {}));
const vA = Bl.Mainnet, $A = 128, IA = 128, Tg = 16, os = 32, Tl = 80, Ja = 65, kA = 32, LA = 64, Ea = 34;
var nt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(nt || (nt = {}));
var It;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(It || (It = {}));
var Ml;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Ml || (Ml = {}));
var ze;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(ze || (ze = {}));
const na = ["onChainOnly", "offChainOnly", "any"], Qd = {
  [na[0]]: ze.OnChainOnly,
  [na[1]]: ze.OffChainOnly,
  [na[2]]: ze.Any,
  [ze.OnChainOnly]: ze.OnChainOnly,
  [ze.OffChainOnly]: ze.OffChainOnly,
  [ze.Any]: ze.Any
};
function CA(t) {
  if (t in Qd)
    return Qd[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${na.join(", ")}`);
}
var Aa;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Aa || (Aa = {}));
Aa.Mainnet;
var yi;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(yi || (yi = {}));
var Re;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Re || (Re = {}));
var oe;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(oe || (oe = {}));
var Wt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Wt || (Wt = {}));
var va;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(va || (va = {}));
var se;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(se || (se = {}));
var eo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(eo || (eo = {}));
var Nl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Nl || (Nl = {}));
var no;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(no || (no = {}));
var Jd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Jd || (Jd = {}));
var th;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(th || (th = {}));
function _l(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function BA(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Mg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function TA(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  _l(t.outputLen), _l(t.blockLen);
}
function MA(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function NA(t, e) {
  Mg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ns = {
  number: _l,
  bool: BA,
  bytes: Mg,
  hash: TA,
  exists: MA,
  output: NA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Bc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Cn = (t, e) => t << 32 - e | t >>> e, _A = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!_A)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function UA(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ru(t) {
  if (typeof t == "string" && (t = UA(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Ng {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Ns(t) {
  const e = (r) => t().update(Ru(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function PA(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
class Gu extends Ng {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Bc(this.buffer);
  }
  update(e) {
    ns.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ru(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Bc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ns.exists(this), ns.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    PA(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Bc(e), c = this.outputLen;
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
const HA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), _g = Uint8Array.from({ length: 16 }, (t, e) => e), OA = _g.map((t) => (9 * t + 5) % 16);
let Ku = [_g], Vu = [OA];
for (let t = 0; t < 4; t++)
  for (let e of [Ku, Vu])
    e.push(e[t].map((n) => HA[n]));
const Ug = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), DA = Ku.map((t, e) => t.map((n) => Ug[e][n])), FA = Vu.map((t, e) => t.map((n) => Ug[e][n])), jA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), zA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ro = (t, e) => t << e | t >>> 32 - e;
function eh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Go = new Uint32Array(16);
class RA extends Gu {
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
      Go[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const m = 4 - h, b = jA[h], C = zA[h], P = Ku[h], _ = Vu[h], p = DA[h], $ = FA[h];
      for (let I = 0; I < 16; I++) {
        const R = Ro(r + eh(h, i, a, f) + Go[P[I]] + b, p[I]) + l | 0;
        r = l, l = f, f = Ro(a, 10) | 0, a = i, i = R;
      }
      for (let I = 0; I < 16; I++) {
        const R = Ro(s + eh(m, o, c, d) + Go[_[I]] + C, $[I]) + g | 0;
        s = g, g = d, d = Ro(c, 10) | 0, c = o, o = R;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Go.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const GA = Ns(() => new RA()), KA = (t, e, n) => t & e ^ ~t & n, VA = (t, e, n) => t & e ^ t & n ^ e & n, qA = new Uint32Array([
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
class Pg extends Gu {
  constructor() {
    super(64, 32, 8, !1), this.A = Sr[0] | 0, this.B = Sr[1] | 0, this.C = Sr[2] | 0, this.D = Sr[3] | 0, this.E = Sr[4] | 0, this.F = Sr[5] | 0, this.G = Sr[6] | 0, this.H = Sr[7] | 0;
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
      Er[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = Er[l - 15], h = Er[l - 2], m = Cn(g, 7) ^ Cn(g, 18) ^ g >>> 3, b = Cn(h, 17) ^ Cn(h, 19) ^ h >>> 10;
      Er[l] = b + Er[l - 7] + m + Er[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Cn(a, 6) ^ Cn(a, 11) ^ Cn(a, 25), h = d + g + KA(a, c, f) + qA[l] + Er[l] | 0, b = (Cn(r, 2) ^ Cn(r, 13) ^ Cn(r, 22)) + VA(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    Er.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class WA extends Pg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const qu = Ns(() => new Pg());
Ns(() => new WA());
const Ko = BigInt(2 ** 32 - 1), Ul = BigInt(32);
function Hg(t, e = !1) {
  return e ? { h: Number(t & Ko), l: Number(t >> Ul & Ko) } : { h: Number(t >> Ul & Ko) | 0, l: Number(t & Ko) | 0 };
}
function XA(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Hg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const YA = (t, e) => BigInt(t >>> 0) << Ul | BigInt(e >>> 0), ZA = (t, e, n) => t >>> n, QA = (t, e, n) => t << 32 - n | e >>> n, JA = (t, e, n) => t >>> n | e << 32 - n, t8 = (t, e, n) => t << 32 - n | e >>> n, e8 = (t, e, n) => t << 64 - n | e >>> n - 32, n8 = (t, e, n) => t >>> n - 32 | e << 64 - n, r8 = (t, e) => e, s8 = (t, e) => t, i8 = (t, e, n) => t << n | e >>> 32 - n, o8 = (t, e, n) => e << n | t >>> 32 - n, a8 = (t, e, n) => e << n - 32 | t >>> 64 - n, c8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function l8(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const u8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), f8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, d8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), h8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, p8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), g8 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, vt = {
  fromBig: Hg,
  split: XA,
  toBig: YA,
  shrSH: ZA,
  shrSL: QA,
  rotrSH: JA,
  rotrSL: t8,
  rotrBH: e8,
  rotrBL: n8,
  rotr32H: r8,
  rotr32L: s8,
  rotlSH: i8,
  rotlSL: o8,
  rotlBH: a8,
  rotlBL: c8,
  add: l8,
  add3L: u8,
  add3H: f8,
  add4L: d8,
  add4H: h8,
  add5H: g8,
  add5L: p8
}, [y8, w8] = vt.split([
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
class tc extends Gu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: m, Hh: b, Hl: C } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, m, b, C];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, m, b, C) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = m | 0, this.Hh = b | 0, this.Hl = C | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Ar[p] = e.getUint32(n), vr[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const $ = Ar[p - 15] | 0, I = vr[p - 15] | 0, R = vt.rotrSH($, I, 1) ^ vt.rotrSH($, I, 8) ^ vt.shrSH($, I, 7), Y = vt.rotrSL($, I, 1) ^ vt.rotrSL($, I, 8) ^ vt.shrSL($, I, 7), H = Ar[p - 2] | 0, q = vr[p - 2] | 0, S = vt.rotrSH(H, q, 19) ^ vt.rotrBH(H, q, 61) ^ vt.shrSH(H, q, 6), k = vt.rotrSL(H, q, 19) ^ vt.rotrBL(H, q, 61) ^ vt.shrSL(H, q, 6), N = vt.add4L(Y, k, vr[p - 7], vr[p - 16]), U = vt.add4H(N, R, S, Ar[p - 7], Ar[p - 16]);
      Ar[p] = U | 0, vr[p] = N | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: m, Gh: b, Gl: C, Hh: P, Hl: _ } = this;
    for (let p = 0; p < 80; p++) {
      const $ = vt.rotrSH(l, g, 14) ^ vt.rotrSH(l, g, 18) ^ vt.rotrBH(l, g, 41), I = vt.rotrSL(l, g, 14) ^ vt.rotrSL(l, g, 18) ^ vt.rotrBL(l, g, 41), R = l & h ^ ~l & b, Y = g & m ^ ~g & C, H = vt.add5L(_, I, Y, w8[p], vr[p]), q = vt.add5H(H, P, $, R, y8[p], Ar[p]), S = H | 0, k = vt.rotrSH(r, s, 28) ^ vt.rotrBH(r, s, 34) ^ vt.rotrBH(r, s, 39), N = vt.rotrSL(r, s, 28) ^ vt.rotrBL(r, s, 34) ^ vt.rotrBL(r, s, 39), U = r & i ^ r & a ^ i & a, Z = s & o ^ s & c ^ o & c;
      P = b | 0, _ = C | 0, b = h | 0, C = m | 0, h = l | 0, m = g | 0, { h: l, l: g } = vt.add(f | 0, d | 0, q | 0, S | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const G = vt.add3L(S, N, Z);
      r = vt.add3H(G, q, k, U), s = G | 0;
    }
    ({ h: r, l: s } = vt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = vt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = vt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = vt.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = vt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: m } = vt.add(this.Fh | 0, this.Fl | 0, h | 0, m | 0), { h: b, l: C } = vt.add(this.Gh | 0, this.Gl | 0, b | 0, C | 0), { h: P, l: _ } = vt.add(this.Hh | 0, this.Hl | 0, P | 0, _ | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, m, b, C, P, _);
  }
  roundClean() {
    Ar.fill(0), vr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class b8 extends tc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class m8 extends tc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class x8 extends tc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Ns(() => new tc());
Ns(() => new b8());
const S8 = Ns(() => new m8());
Ns(() => new x8());
function Og(t) {
  if (te(t).byteLength != Ja)
    throw Error("Invalid signature");
  return {
    type: nt.MessageSignature,
    data: t
  };
}
function ji(t, e) {
  return { type: nt.Address, version: t, hash160: e };
}
function Qs(t) {
  return Bs.c32address(t.version, t.hash160);
}
function Es(t, e, n) {
  const r = e || 1, s = n || $A;
  if (ey(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: nt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Wu(t) {
  const e = Bs.c32addressDecode(t);
  return {
    type: nt.Address,
    version: e[0],
    hash160: e[1]
  };
}
var D;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(D || (D = {}));
function E8(t) {
  if (t.type === D.PrincipalStandard)
    return Qs(t.address);
  if (t.type === D.PrincipalContract)
    return `${Qs(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Dg(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return $8(e, n);
  } else
    return A8(t);
}
function A8(t) {
  const e = Wu(t);
  return { type: D.PrincipalStandard, address: e };
}
function v8(t) {
  return { type: D.PrincipalStandard, address: t };
}
function $8(t, e) {
  const n = Wu(t), r = Es(e);
  return Fg(n, r);
}
function Fg(t, e) {
  if (Ii(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: D.PrincipalContract, address: t, contractName: e };
}
function Tc(t, e = !1) {
  switch (t.type) {
    case D.BoolTrue:
      return !0;
    case D.BoolFalse:
      return !1;
    case D.Int:
    case D.UInt:
      return e ? t.value.toString() : t.value;
    case D.Buffer:
      return `0x${Ct(t.buffer)}`;
    case D.OptionalNone:
      return null;
    case D.OptionalSome:
      return Wn(t.value);
    case D.ResponseErr:
      return Wn(t.value);
    case D.ResponseOk:
      return Wn(t.value);
    case D.PrincipalStandard:
    case D.PrincipalContract:
      return E8(t);
    case D.List:
      return t.list.map((r) => Wn(r));
    case D.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Wn(t.data[r]);
      }), n;
    case D.StringASCII:
      return t.data;
    case D.StringUTF8:
      return t.data;
  }
}
function Wn(t) {
  switch (t.type) {
    case D.ResponseErr:
      return { type: Lr(t), value: Tc(t, !0), success: !1 };
    case D.ResponseOk:
      return { type: Lr(t), value: Tc(t, !0), success: !0 };
    default:
      return { type: Lr(t), value: Tc(t, !0) };
  }
}
function Lr(t) {
  switch (t.type) {
    case D.BoolTrue:
    case D.BoolFalse:
      return "bool";
    case D.Int:
      return "int";
    case D.UInt:
      return "uint";
    case D.Buffer:
      return `(buff ${t.buffer.length})`;
    case D.OptionalNone:
      return "(optional none)";
    case D.OptionalSome:
      return `(optional ${Lr(t.value)})`;
    case D.ResponseErr:
      return `(response UnknownType ${Lr(t.value)})`;
    case D.ResponseOk:
      return `(response ${Lr(t.value)} UnknownType)`;
    case D.PrincipalStandard:
    case D.PrincipalContract:
      return "principal";
    case D.List:
      return `(list ${t.list.length} ${t.list.length ? Lr(t.list[0]) : "UnknownType"})`;
    case D.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${Lr(t.data[e])})`).join(" ")})`;
    case D.StringASCII:
      return `(string-ascii ${Cg(t.data).length})`;
    case D.StringUTF8:
      return `(string-utf8 ${Ii(t.data).length})`;
  }
}
const jg = () => ({ type: D.BoolTrue }), zg = () => ({ type: D.BoolFalse }), I8 = (t) => t ? jg() : zg(), nh = BigInt("0xffffffffffffffffffffffffffffffff"), k8 = BigInt(0), rh = BigInt("0x7fffffffffffffffffffffffffffffff"), sh = BigInt("-170141183460469231731687303715884105728"), L8 = (t) => {
  const e = Ue(t, !0);
  if (e > rh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${rh}`);
  if (e < sh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${sh}`);
  return { type: D.Int, value: e };
}, Un = (t) => {
  const e = Ue(t, !1);
  if (e < k8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > nh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${nh}`);
  return { type: D.UInt, value: e };
}, Rg = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: D.Buffer, buffer: t };
};
function Gg() {
  return { type: D.OptionalNone };
}
function Kg(t) {
  return { type: D.OptionalSome, value: t };
}
function C8(t) {
  return { type: D.ResponseErr, value: t };
}
function B8(t) {
  return { type: D.ResponseOk, value: t };
}
function T8(t) {
  return { type: D.List, list: t };
}
function As(t) {
  for (const e in t)
    if (!x6(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: D.Tuple, data: t };
}
const Ae = (t) => ({ type: D.StringASCII, data: t }), M8 = (t) => ({ type: D.StringUTF8, data: t });
class Vg extends Ng {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ns.hash(e);
    const r = Ru(n);
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
    return ns.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ns.exists(this), ns.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const qg = (t, e, n) => new Vg(t, e).update(n).digest();
qg.create = (t, e) => new Vg(t, e);
ae.hmacSha256Sync = (t, ...e) => {
  const n = qg.create(qu, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function wi(t) {
  return {
    type: nt.PublicKey,
    data: te(t)
  };
}
function N8(t, e, n = se.Compressed) {
  const r = wA(e.data), s = new Qe(qd(r.r), qd(r.s)), i = kt.fromSignature(t, s, r.recoveryId), o = n === se.Compressed;
  return i.toHex(o);
}
function _8(t) {
  return { type: nt.PublicKey, data: t };
}
function ki(t) {
  return !Ct(t.data).startsWith("04");
}
function $a(t) {
  return t.data.slice();
}
function U8(t) {
  const e = O8(t), n = co(e.data.slice(0, 32), e.compressed);
  return wi(Ct(n));
}
function P8(t) {
  const e = typeof t == "string" ? t : Ct(t), n = kt.fromHex(e).toHex(!0);
  return wi(n);
}
function H8(t) {
  const e = typeof t == "string" ? t : Ct(t), n = kt.fromHex(e).toHex(!1);
  return wi(n);
}
function Pl(t) {
  const e = t.readUInt8(), n = e === 4 ? LA : kA;
  return _8(de([e, t.readBytes(n)]));
}
function O8(t) {
  const e = bA(t), n = e.length == Bg;
  return { data: e, compressed: n };
}
function D8(t, e) {
  const [n, r] = Ma(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = po(r, 1) + Qe.fromHex(n).toCompactHex();
  return Og(i);
}
function F8(t) {
  return U8(t.data);
}
function j8(t, e, n) {
  return typeof t == "string" && (t = Dg(t)), typeof n == "string" && (n = ah(n)), {
    type: nt.Payload,
    payloadType: It.TokenTransfer,
    recipient: t,
    amount: Ue(e, !1),
    memo: n ?? ah("")
  };
}
function z8(t, e, n, r) {
  return typeof t == "string" && (t = Wu(t)), typeof e == "string" && (e = Es(e)), typeof n == "string" && (n = Es(n)), {
    type: nt.Payload,
    payloadType: It.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function ih(t, e, n) {
  return typeof t == "string" && (t = Es(t)), typeof e == "string" && (e = Z8(e)), typeof n == "number" ? {
    type: nt.Payload,
    payloadType: It.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: nt.Payload,
    payloadType: It.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function R8() {
  return { type: nt.Payload, payloadType: It.PoisonMicroblock };
}
function oh(t, e) {
  if (t.byteLength != os)
    throw Error(`Coinbase buffer size must be ${os} bytes`);
  return e != null ? {
    type: nt.Payload,
    payloadType: It.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: nt.Payload,
    payloadType: It.Coinbase,
    coinbaseBytes: t
  };
}
function G8(t, e, n) {
  if (t.byteLength != os)
    throw Error(`Coinbase buffer size must be ${os} bytes`);
  if (n.byteLength != Tl)
    throw Error(`VRF proof buffer size must be ${Tl} bytes`);
  return {
    type: nt.Payload,
    payloadType: It.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === D.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Hl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Hl || (Hl = {}));
function K8(t, e, n, r, s, i, o) {
  return {
    type: nt.Payload,
    payloadType: It.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Wg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case It.TokenTransfer:
      e.push(ue(t.recipient)), e.push(Pr(t.amount, !1, 8)), e.push(Vn(t.memo));
      break;
    case It.ContractCall:
      e.push(Vn(t.contractAddress)), e.push(Vn(t.contractName)), e.push(Vn(t.functionName));
      const n = new Uint8Array(4);
      Ss(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(ue(r));
      });
      break;
    case It.SmartContract:
      e.push(Vn(t.contractName)), e.push(Vn(t.codeBody));
      break;
    case It.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Vn(t.contractName)), e.push(Vn(t.codeBody));
      break;
    case It.PoisonMicroblock:
      break;
    case It.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case It.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(ue(t.recipient));
      break;
    case It.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(ue(t.recipient ? Kg(t.recipient) : Gg())), e.push(t.vrfProof);
      break;
    case It.TenureChange:
      e.push(te(t.tenureHash)), e.push(te(t.previousTenureHash)), e.push(te(t.burnViewHash)), e.push(te(t.previousTenureEnd)), e.push(Ss(new Uint8Array(4), t.previousTenureBlocks)), e.push(EA(new Uint8Array(1), t.cause)), e.push(te(t.publicKeyHash));
      break;
  }
  return de(e);
}
function V8(t) {
  switch (t.readUInt8Enum(It, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case It.TokenTransfer:
      const n = un(t), r = Ue(t.readBytes(8), !1), s = Yg(t);
      return j8(n, r, s);
    case It.ContractCall:
      const i = bi(t), o = ln(t), a = ln(t), c = [], f = t.readUInt32BE();
      for (let p = 0; p < f; p++) {
        const $ = un(t);
        c.push($);
      }
      return z8(i, o, a, c);
    case It.SmartContract:
      const d = ln(t), l = ln(t, 4, 1e5);
      return ih(d, l);
    case It.VersionedSmartContract: {
      const p = t.readUInt8Enum(Ml, (R) => {
        throw new Error(`Cannot recognize ClarityVersion: ${R}`);
      }), $ = ln(t), I = ln(t, 4, 1e5);
      return ih($, I, p);
    }
    case It.PoisonMicroblock:
      return R8();
    case It.Coinbase: {
      const p = t.readBytes(os);
      return oh(p);
    }
    case It.CoinbaseToAltRecipient: {
      const p = t.readBytes(os), $ = un(t);
      return oh(p, $);
    }
    case It.NakamotoCoinbase: {
      const p = t.readBytes(os), $ = un(t), I = t.readBytes(Tl);
      return G8(p, $, I);
    }
    case It.TenureChange:
      const g = Ct(t.readBytes(20)), h = Ct(t.readBytes(20)), m = Ct(t.readBytes(20)), b = Ct(t.readBytes(32)), C = t.readUInt32BE(), P = t.readUInt8Enum(Hl, (p) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${p}`);
      }), _ = Ct(t.readBytes(20));
      return K8(g, h, m, b, C, P, _);
  }
}
class ec extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Zr extends ec {
  constructor(e) {
    super(e);
  }
}
class Ze extends ec {
  constructor(e) {
    super(e);
  }
}
class Ia extends ec {
  constructor(e) {
    super(e);
  }
}
class rs extends ec {
  constructor(e) {
    super(e);
  }
}
var xn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(xn || (xn = {}));
function Ol(t) {
  return Og(Ct(t.readBytes(Ja)));
}
function Js(t, e) {
  return {
    pubKeyEncoding: t,
    type: nt.TransactionAuthField,
    contents: e
  };
}
function q8(t) {
  const e = t.readUInt8Enum(xn, (n) => {
    throw new Ze(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case xn.PublicKeyCompressed:
      return Js(se.Compressed, Pl(t));
    case xn.PublicKeyUncompressed:
      return Js(se.Uncompressed, H8(Pl(t).data));
    case xn.SignatureCompressed:
      return Js(se.Compressed, Ol(t));
    case xn.SignatureUncompressed:
      return Js(se.Uncompressed, Ol(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function Xu(t) {
  return te(t.data);
}
function W8(t) {
  const e = [];
  switch (t.contents.type) {
    case nt.PublicKey:
      e.push(t.pubKeyEncoding === se.Compressed ? xn.PublicKeyCompressed : xn.PublicKeyUncompressed), e.push($a(P8(t.contents.data)));
      break;
    case nt.MessageSignature:
      e.push(t.pubKeyEncoding === se.Compressed ? xn.SignatureCompressed : xn.SignatureUncompressed), e.push(Xu(t.contents));
      break;
  }
  return de(e);
}
function Vn(t) {
  switch (t.type) {
    case nt.Address:
      return go(t);
    case nt.Principal:
      return Xg(t);
    case nt.LengthPrefixedString:
      return mi(t);
    case nt.MemoString:
      return Q8(t);
    case nt.AssetInfo:
      return Zg(t);
    case nt.PostCondition:
      return J8(t);
    case nt.PublicKey:
      return $a(t);
    case nt.LengthPrefixedList:
      return Qu(t);
    case nt.Payload:
      return Wg(t);
    case nt.TransactionAuthField:
      return W8(t);
    case nt.MessageSignature:
      return Xu(t);
  }
}
function X8() {
  return {
    type: nt.Address,
    version: va.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Yu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Wt.SerializeP2PKH || e === Wt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Wt.SerializeP2WPKH || e === Wt.SerializeP2WSH || e === Wt.SerializeP2WSHNonSequential) && !r.every(ki))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Wt.SerializeP2PKH:
      return ji(t, y6(r[0].data));
    case Wt.SerializeP2WPKH:
      return ji(t, w6(r[0].data));
    case Wt.SerializeP2SH:
    case Wt.SerializeP2SHNonSequential:
      return ji(t, b6(n, r.map($a)));
    case Wt.SerializeP2WSH:
    case Wt.SerializeP2WSHNonSequential:
      return ji(t, m6(n, r.map($a)));
  }
}
function go(t) {
  const e = [];
  return e.push(te(po(t.version, 1))), e.push(te(t.hash160)), de(e);
}
function bi(t) {
  const e = Za(Ct(t.readBytes(1))), n = Ct(t.readBytes(20));
  return { type: nt.Address, version: e, hash160: n };
}
function Xg(t) {
  const e = [];
  return e.push(t.prefix), e.push(go(t.address)), t.prefix === no.Contract && e.push(mi(t.contractName)), de(e);
}
function Y8(t) {
  const e = t.readUInt8Enum(no, (s) => {
    throw new Ze(`Unexpected Principal payload type: ${s}`);
  }), n = bi(t);
  if (e === no.Standard)
    return { type: nt.Principal, prefix: e, address: n };
  const r = ln(t);
  return {
    type: nt.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function mi(t) {
  const e = [], n = Ii(t.content), r = n.byteLength;
  return e.push(te(po(r, t.lengthPrefixBytes))), e.push(n), de(e);
}
function ln(t, e, n) {
  e = e || 1;
  const r = Za(Ct(t.readBytes(e))), s = zu(t.readBytes(r));
  return Es(s, e, n ?? 128);
}
function Z8(t) {
  return Es(t, 4, 1e5);
}
function ah(t) {
  if (t && ey(t, Ea))
    throw new Error(`Memo exceeds maximum length of ${Ea} bytes`);
  return { type: nt.MemoString, content: t };
}
function Q8(t) {
  const e = [], n = Ii(t.content), r = g6(Ct(n), Ea * 2);
  return e.push(te(r)), de(e);
}
function Yg(t) {
  let e = zu(t.readBytes(Ea));
  return e = e.replace(/\u0000*$/, ""), { type: nt.MemoString, content: e };
}
function Zg(t) {
  const e = [];
  return e.push(go(t.address)), e.push(mi(t.contractName)), e.push(mi(t.assetName)), de(e);
}
function Dl(t) {
  return {
    type: nt.AssetInfo,
    address: bi(t),
    contractName: ln(t),
    assetName: ln(t)
  };
}
function Zu(t, e) {
  return {
    type: nt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Qu(t) {
  const e = t.values, n = [];
  n.push(te(po(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Vn(r));
  return de(n);
}
function Qg(t, e, n) {
  const r = Za(Ct(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case nt.Address:
        s.push(bi(t));
        break;
      case nt.LengthPrefixedString:
        s.push(ln(t));
        break;
      case nt.MemoString:
        s.push(Yg(t));
        break;
      case nt.AssetInfo:
        s.push(Dl(t));
        break;
      case nt.PostCondition:
        s.push(t6(t));
        break;
      case nt.PublicKey:
        s.push(Pl(t));
        break;
      case nt.TransactionAuthField:
        s.push(q8(t));
        break;
    }
  return Zu(s, n);
}
function J8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Xg(t.principal)), (t.conditionType === Re.Fungible || t.conditionType === Re.NonFungible) && e.push(Zg(t.assetInfo)), t.conditionType === Re.NonFungible && e.push(ue(t.assetName)), e.push(t.conditionCode), t.conditionType === Re.STX || t.conditionType === Re.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Zr("The post-condition amount may not be larger than 8 bytes");
    e.push(Pr(t.amount, !1, 8));
  }
  return de(e);
}
function t6(t) {
  const e = t.readUInt8Enum(Re, (o) => {
    throw new Ze(`Could not read ${o} as PostConditionType`);
  }), n = Y8(t);
  let r, s, i;
  switch (e) {
    case Re.STX:
      return r = t.readUInt8Enum(eo, (a) => {
        throw new Ze(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ct(t.readBytes(8))}`), {
        type: nt.PostCondition,
        conditionType: Re.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case Re.Fungible:
      return s = Dl(t), r = t.readUInt8Enum(eo, (a) => {
        throw new Ze(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ct(t.readBytes(8))}`), {
        type: nt.PostCondition,
        conditionType: Re.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case Re.NonFungible:
      s = Dl(t);
      const o = un(t);
      return r = t.readUInt8Enum(Nl, (a) => {
        throw new Ze(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: nt.PostCondition,
        conditionType: Re.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Fn(t, e) {
  return de([t, e]);
}
function e6(t) {
  return new Uint8Array([t.type]);
}
function n6(t) {
  return t.type === D.OptionalNone ? new Uint8Array([t.type]) : Fn(t.type, ue(t.value));
}
function r6(t) {
  const e = new Uint8Array(4);
  return Ss(e, t.buffer.length, 0), Fn(t.type, Qa(e, t.buffer));
}
function s6(t) {
  const e = ju(fA(t.value, BigInt(IA)), Tg);
  return Fn(t.type, e);
}
function i6(t) {
  const e = ju(t.value, Tg);
  return Fn(t.type, e);
}
function o6(t) {
  return Fn(t.type, go(t.address));
}
function a6(t) {
  return Fn(t.type, Qa(go(t.address), mi(t.contractName)));
}
function c6(t) {
  return Fn(t.type, ue(t.value));
}
function l6(t) {
  const e = [], n = new Uint8Array(4);
  Ss(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = ue(r);
    e.push(s);
  }
  return Fn(t.type, de(e));
}
function u6(t) {
  const e = [], n = new Uint8Array(4);
  Ss(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Es(s);
    e.push(mi(i));
    const o = ue(t.data[s]);
    e.push(o);
  }
  return Fn(t.type, de(e));
}
function Jg(t, e) {
  const n = [], r = e == "ascii" ? Cg(t.data) : Ii(t.data), s = new Uint8Array(4);
  return Ss(s, r.length, 0), n.push(s), n.push(r), Fn(t.type, de(n));
}
function f6(t) {
  return Jg(t, "ascii");
}
function d6(t) {
  return Jg(t, "utf8");
}
function ue(t) {
  switch (t.type) {
    case D.BoolTrue:
    case D.BoolFalse:
      return e6(t);
    case D.OptionalNone:
    case D.OptionalSome:
      return n6(t);
    case D.Buffer:
      return r6(t);
    case D.UInt:
      return i6(t);
    case D.Int:
      return s6(t);
    case D.PrincipalStandard:
      return o6(t);
    case D.PrincipalContract:
      return a6(t);
    case D.ResponseOk:
    case D.ResponseErr:
      return c6(t);
    case D.List:
      return l6(t);
    case D.Tuple:
      return u6(t);
    case D.StringASCII:
      return f6(t);
    case D.StringUTF8:
      return d6(t);
    default:
      throw new Zr("Unable to serialize. Invalid Clarity Value.");
  }
}
function h6(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const ch = /* @__PURE__ */ new Map();
function ty(t, e) {
  const n = ch.get(t);
  if (n !== void 0)
    return n(e);
  const r = h6(t);
  return ch.set(t, r), ty(t, e);
}
class Vi {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return AA(this.readBytes(4), 0);
  }
  readUInt8() {
    return SA(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return mA(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = Ct(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Ct(n);
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
    if (ty(e, r))
      return r;
    throw n(r);
  }
}
function un(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Vi(te(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Vi(t) : e = t;
  switch (e.readUInt8Enum(D, (r) => {
    throw new Ze(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case D.Int:
      return L8(e.readBytes(16));
    case D.UInt:
      return Un(e.readBytes(16));
    case D.Buffer:
      const r = e.readUInt32BE();
      return Rg(e.readBytes(r));
    case D.BoolTrue:
      return jg();
    case D.BoolFalse:
      return zg();
    case D.PrincipalStandard:
      const s = bi(e);
      return v8(s);
    case D.PrincipalContract:
      const i = bi(e), o = ln(e);
      return Fg(i, o);
    case D.ResponseOk:
      return B8(un(e));
    case D.ResponseErr:
      return C8(un(e));
    case D.OptionalNone:
      return Gg();
    case D.OptionalSome:
      return Kg(un(e));
    case D.List:
      const a = e.readUInt32BE(), c = [];
      for (let b = 0; b < a; b++)
        c.push(un(e));
      return T8(c);
    case D.Tuple:
      const f = e.readUInt32BE(), d = {};
      for (let b = 0; b < f; b++) {
        const C = ln(e).content;
        if (C === void 0)
          throw new Ze('"content" is undefined');
        d[C] = un(e);
      }
      return As(d);
    case D.StringASCII:
      const l = e.readUInt32BE(), g = gA(e.readBytes(l));
      return Ae(g);
    case D.StringUTF8:
      const h = e.readUInt32BE(), m = zu(e.readBytes(h));
      return M8(m);
    default:
      throw new Ze("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const p6 = (t) => t.length % 2 == 0 ? t : `0${t}`, g6 = (t, e) => t.padEnd(e, "0"), ey = (t, e) => t ? Ii(t).length > e : !1;
function Fl(t) {
  return xp(t);
}
const ro = (t) => GA(qu(t)), Ju = (t) => Ct(S8(t)), y6 = (t) => Ct(ro(t)), w6 = (t) => {
  const e = ro(t), n = Qa(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ro(n);
  return Ct(r);
}, b6 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = de(n), s = ro(r);
  return Ct(s);
}, m6 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = de(n), s = qu(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = de(i), a = ro(o);
  return Ct(a);
};
function x6(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function ny(t) {
  const e = ue(t);
  return `0x${Ct(e)}`;
}
function S6(t) {
  return un(t);
}
const ni = (t) => {
  try {
    return Bs.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function tf() {
  return {
    type: nt.MessageSignature,
    data: Ct(new Uint8Array(Ja))
  };
}
function ry(t, e, n, r) {
  const s = Yu(0, t, 1, [wi(e)]).hash160, i = ki(wi(e)) ? se.Compressed : se.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Ue(n, !1),
    fee: Ue(r, !1),
    keyEncoding: i,
    signature: tf()
  };
}
function so(t) {
  return "signature" in t;
}
function lh(t) {
  return t === Wt.SerializeP2SH || t === Wt.SerializeP2WSH;
}
function E6(t) {
  return t === Wt.SerializeP2SHNonSequential || t === Wt.SerializeP2WSHNonSequential;
}
function uh(t) {
  const e = Fl(t);
  return e.nonce = 0, e.fee = 0, so(e) ? e.signature = tf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function A6(t) {
  const e = [
    t.hashMode,
    te(t.signer),
    Pr(t.nonce, !1, 8),
    Pr(t.fee, !1, 8),
    t.keyEncoding,
    Xu(t.signature)
  ];
  return de(e);
}
function v6(t) {
  const e = [
    t.hashMode,
    te(t.signer),
    Pr(t.nonce, !1, 8),
    Pr(t.fee, !1, 8)
  ], n = Zu(t.fields);
  e.push(Qu(n));
  const r = new Uint8Array(2);
  return xA(r, t.signaturesRequired, 0), e.push(r), de(e);
}
function $6(t, e) {
  const n = Ct(e.readBytes(20)), r = BigInt(`0x${Ct(e.readBytes(8))}`), s = BigInt(`0x${Ct(e.readBytes(8))}`), i = e.readUInt8Enum(se, (a) => {
    throw new Ze(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Wt.SerializeP2WPKH && i != se.Compressed)
    throw new Ze("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Ol(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function I6(t, e) {
  const n = Ct(e.readBytes(20)), r = BigInt("0x" + Ct(e.readBytes(8))), s = BigInt("0x" + Ct(e.readBytes(8))), i = Qg(e, nt.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const f of i)
    switch (f.contents.type) {
      case nt.PublicKey:
        ki(f.contents) || (o = !0);
        break;
      case nt.MessageSignature:
        if (f.pubKeyEncoding === se.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new rs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Wt.SerializeP2WSH || t === Wt.SerializeP2WSHNonSequential))
    throw new rs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Mc(t) {
  return so(t) ? A6(t) : v6(t);
}
function Nc(t) {
  const e = t.readUInt8Enum(Wt, (n) => {
    throw new Ze(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Wt.SerializeP2PKH || e === Wt.SerializeP2WPKH ? $6(e, t) : I6(e, t);
}
function sy(t, e, n, r) {
  const i = t + Ct(new Uint8Array([e])) + Ct(Pr(n, !1, 8)) + Ct(Pr(r, !1, 8));
  if (te(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Ju(te(i));
}
function iy(t, e, n) {
  const r = 33 + Ja, s = ki(e) ? se.Compressed : se.Uncompressed, i = t + p6(s.toString(16)) + n.data, o = te(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Ju(o);
}
function k6(t, e, n, r, s) {
  const i = sy(t, e, n, r), o = D8(s, i), a = F8(s), c = iy(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function oy(t, e, n, r, s, i) {
  const o = sy(t, e, n, r), a = wi(N8(o, i, s)), c = iy(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function L6() {
  const t = ry(Wt.SerializeP2PKH, "", 0, 0);
  return t.signer = X8().hash160, t.keyEncoding = se.Compressed, t.signature = tf(), t;
}
function fh(t, e, n) {
  return so(t) ? C6(t, e, n) : B6(t, e, n);
}
function C6(t, e, n) {
  const { pubKey: r, nextSigHash: s } = oy(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = Yu(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new rs(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function B6(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case nt.PublicKey:
        ki(c.contents) || (i = !0), r.push(c.contents);
        break;
      case nt.MessageSignature:
        c.pubKeyEncoding === se.Uncompressed && (i = !0);
        const { pubKey: f, nextSigHash: d } = oy(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (lh(t.hashMode) && (s = d), r.push(f), o += 1, o === 65536)
          throw new rs("Too many signatures");
        break;
    }
  if (lh(t.hashMode) && o !== t.signaturesRequired || E6(t.hashMode) && o < t.signaturesRequired)
    throw new rs("Incorrect number of signatures");
  if (i && (t.hashMode === Wt.SerializeP2WSH || t.hashMode === Wt.SerializeP2WSHNonSequential))
    throw new rs("Uncompressed keys are not allowed in this hash mode");
  const a = Yu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new rs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function ay(t) {
  return {
    authType: oe.Standard,
    spendingCondition: t
  };
}
function cy(t, e) {
  return {
    authType: oe.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || ry(Wt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function dh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case oe.Standard:
        return ay(uh(t.spendingCondition));
      case oe.Sponsored:
        return cy(uh(t.spendingCondition), L6());
      default:
        throw new Ia("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function T6(t, e) {
  switch (t.authType) {
    case oe.Standard:
      return fh(t.spendingCondition, e, oe.Standard);
    case oe.Sponsored:
      return fh(t.spendingCondition, e, oe.Standard);
    default:
      throw new Ia("Invalid origin auth type");
  }
}
function M6(t, e) {
  switch (t.authType) {
    case oe.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Ue(e, !1)
      };
      return { ...t, spendingCondition: n };
    case oe.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Ue(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function N6(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Ue(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function _6(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Ue(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function U6(t, e) {
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
function P6(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case oe.Standard:
      e.push(Mc(t.spendingCondition));
      break;
    case oe.Sponsored:
      e.push(Mc(t.spendingCondition)), e.push(Mc(t.sponsorSpendingCondition));
      break;
  }
  return de(e);
}
function H6(t) {
  const e = t.readUInt8Enum(oe, (r) => {
    throw new Ze(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case oe.Standard:
      return n = Nc(t), ay(n);
    case oe.Sponsored:
      n = Nc(t);
      const r = Nc(t);
      return cy(n, r);
  }
}
class O6 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Ue(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? vA, this.postConditionMode = i ?? yi.Deny, this.postConditions = s ?? Zu([]), o)
      this.anchorMode = CA(o);
    else
      switch (r.payloadType) {
        case It.Coinbase:
        case It.CoinbaseToAltRecipient:
        case It.NakamotoCoinbase:
        case It.PoisonMicroblock:
        case It.TenureChange:
          this.anchorMode = ze.OnChainOnly;
          break;
        case It.ContractCall:
        case It.SmartContract:
        case It.VersionedSmartContract:
        case It.TokenTransfer:
          this.anchorMode = ze.Any;
          break;
      }
  }
  signBegin() {
    const e = Fl(this);
    return e.auth = dh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Fl(this);
    return e.auth = dh(e.auth), e.txid();
  }
  verifyOrigin() {
    return T6(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, oe.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === oe.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, oe.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !so(n)) {
      const r = ki(e);
      n.fields.push(Js(r ? se.Compressed : se.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = k6(n, r, e.fee, e.nonce, s);
    return so(e) ? e.signature = i : e.fields.push(Js(s.data.byteLength === Bg ? se.Compressed : se.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return Ju(e);
  }
  setSponsor(e) {
    if (this.auth.authType != oe.Sponsored)
      throw new Ia("Cannot sponsor sign a non-sponsored transaction");
    this.auth = U6(this.auth, e);
  }
  setFee(e) {
    this.auth = M6(this.auth, e);
  }
  setNonce(e) {
    this.auth = N6(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != oe.Sponsored)
      throw new Ia("Cannot sponsor sign a non-sponsored transaction");
    this.auth = _6(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Zr('"version" is undefined');
    if (this.chainId === void 0)
      throw new Zr('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Zr('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Zr('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Zr('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return Ss(n, this.chainId, 0), e.push(n), e.push(P6(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Qu(this.postConditions)), e.push(Wg(this.payload)), de(e);
  }
}
function ef(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Vi(te(t.slice(2))) : e = new Vi(te(t)) : t instanceof Uint8Array ? e = new Vi(t) : e = t;
  const n = e.readUInt8Enum(Aa, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = H6(e), i = e.readUInt8Enum(ze, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(yi, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = Qg(e, nt.PostCondition), c = V8(e);
  return new O6(n, s, c, a, o, i, r);
}
const D6 = I8, qi = Un, F6 = Rg;
const j6 = /* @__PURE__ */ new Set([4001, -31001]), z6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], R6 = ["result", "data", "payload", "response", "params"], hh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], nc = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), _s = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Yn = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, G6 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), ly = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => G6(i, r)) === s
  );
}, uy = (t) => t ? ly(_s()).some(
  (e) => {
    var n;
    return e.id === t && (nc(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, fy = () => {
  if (typeof window > "u")
    return;
  const t = _s(), e = ly(t).filter(
    (n) => {
      var r;
      return nc(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Yn(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of z6) {
    const r = Yn(t, n) ?? (t === window ? void 0 : Yn(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, K6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = _s(), n = Yn(e, t) ?? (e === window ? void 0 : Yn(window, t)) ?? za(t);
  if (n)
    return n;
  if (nc(t) || uy(t))
    return fy();
}, Vo = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, V6 = ["blockstack-session", "blockstack"], q6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of V6) {
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
q6();
const dy = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Ye = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, W6 = (t) => {
  const e = Ye(t);
  if (!e)
    return null;
  const n = dy(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, X6 = (t) => {
  const e = Ye(t);
  if (!e)
    return null;
  const n = dy(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, jl = (t, e = "mainnet") => {
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
      return jl(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return jl(r, e);
  }
  return e;
}, as = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, io = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return ni(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = io(s, e + 1);
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
    const i = io(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && ni(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && ni(n.testnet) ? n.testnet.trim() : null;
}, ph = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, hy = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && j6.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, vs = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Ye(n == null ? void 0 : n.message) ?? Ye(e.message) ?? Ye(e.error) ?? Ye(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, xi = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw vs(e);
    if (e.status === "error")
      throw vs(e.result ?? e);
  }
  return t;
}, gh = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return xi(r);
  } catch (r) {
    throw vs(r);
  }
}, py = () => fy(), nf = () => {
  if (typeof window > "u")
    return;
  const t = _s();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Yn(t, e) ?? (t === window ? void 0 : Yn(window, e));
    if (n)
      return n;
  }
}, yh = () => {
  if (typeof window > "u")
    return;
  const t = nf();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = _s();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Yn(e, n) ?? (e === window ? void 0 : Yn(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, ra = (t) => {
  var r, s;
  const e = ps();
  if (nc(e) || uy(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = _s() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === py();
}, _c = (t) => {
  const e = X6(t);
  if (!e)
    return null;
  try {
    const n = ef(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, ka = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = _c(t), r = W6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Ye(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = ka(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of hh)
    if (_c(s[a])) {
      i = Ye(s[a]);
      break;
    }
  const o = Ye(s.txId) || Ye(s.txid) || Ye(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? Ye(s.txRaw) ?? void 0
    };
  for (const a of hh) {
    const c = _c(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Ye(s[a]) ?? void 0
      };
  }
  for (const a of R6) {
    const c = s[a], f = ka(c, e + 1);
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
}, Uc = (t) => {
  const e = ka(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, Y6 = (t) => {
  const e = ka(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, Z6 = (t) => ({
  ...t,
  fee: as(t.fee),
  nonce: as(t.nonce),
  sponsored: t.sponsored === !0
}), wh = (t) => ({
  recipient: t.recipient,
  amount: as(t.amount) ?? "0",
  memo: t.memo,
  network: jl(t.network),
  address: t.stxAddress,
  fee: as(t.fee),
  nonce: as(t.nonce),
  sponsored: t.sponsored ?? !1
}), gy = "WALLET_ADDRESS_MISMATCH", Q6 = 45e3;
let Wi = null;
const zl = (t) => {
  t && (Wi = { address: t, at: Date.now() });
}, J6 = () => {
  Wi = null;
}, t5 = () => Wi && Date.now() - Wi.at <= Q6 ? Wi.address : null, e5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, n5 = async (t) => {
  J6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = xi(await t.request("wallet_connect")), n = io(e);
  return zl(n), n;
}, r5 = async (t, e, n, r) => {
  try {
    return xi(await t.request(e, n));
  } catch (s) {
    const i = vs(s);
    if (!e5(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await n5(t);
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
        { code: o ? gy : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return xi(await t.request(e, n));
    } catch (a) {
      throw vs(a);
    }
  }
};
let bh = 3e4;
const s5 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${bh / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, bh);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, i5 = async (t, e, n) => {
  const r = (c, f) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${f}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: gy }
      );
    return c;
  }, s = t5();
  if (s)
    return Vo(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  Vo(n, "account-read");
  try {
    const c = xi(
      await s5(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = io(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (hy(c))
      throw vs(c);
    Vo(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return zl(i), r(i, "wallet_getAccount");
  let o;
  Vo(n, "account-reconnect");
  try {
    o = xi(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), vs(c);
  }
  const a = io(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return zl(a), r(a, "wallet_connect");
}, o5 = async (t, e) => {
  if (!ra(t)) {
    const i = await gh(
      t,
      "stx_transferStx",
      wh(e)
    );
    return Uc(i);
  }
  const n = nf();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await gh(
      n,
      "stx_transferStx",
      wh(e)
    );
    return Uc(i);
  }
  const r = py();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await i5(r, e.stxAddress);
  const s = await r5(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: as(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: as(e.fee) } : {}
    },
    e.stxAddress
  );
  return Uc(s);
}, a5 = () => ps(), yy = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = ps(), e = t ? K6(t) : void 0;
  if (e)
    return e;
  const n = _s() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, mh = (t, e) => {
  const n = yy(), r = Z6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, Y6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return zo(r, e);
  if (ra(n) && !nf()) {
    const s = yh();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: ps(),
        route: "legacy-transaction-request"
      }), zo(r, s);
  }
  return void o5(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (ph(s) && ra(n)) {
      const a = yh();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: ps(),
          route: "legacy-transaction-request"
        }), zo(r, a);
        return;
      }
    }
    if (ph(s) && !ra(n)) {
      zo(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), hy(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, xh = (t) => ny(t).replace(/^0x/, ""), Sh = "This wallet cannot sign messages. Try Xverse or Leather.", Eh = (t) => typeof (t == null ? void 0 : t.request) == "function", Ah = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", c5 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, l5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function u5(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: xh(e.message),
    domain: xh(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function f5(t, e) {
  const n = await sA({
    domain: e.domain,
    message: e.message,
    network: Ya(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function vh(t) {
  var s, i;
  const e = a5() || "", n = /xverse/i.test(e);
  let r = yy();
  if (n && !Ah(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (Ah(r))
    try {
      return await f5(r, t);
    } catch (o) {
      if (n || !Eh(r) || !l5(o)) throw o;
    }
  if (!n && Eh(r))
    try {
      return await u5(r, t);
    } catch (o) {
      throw c5(o) ? new Error(Sh) : o;
    }
  throw new Error(Sh);
}
const $h = 1000000n, ss = 1000000n, Rl = 50n, Hr = 3000n, yo = 300n, qo = 3000n, d5 = 50000n, Pc = 200n, Or = (t) => t + Rl;
function yn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / $h}.${(n % $h).toString().padStart(6, "0")}`;
}
function Ih(t, e = yo) {
  return t <= Hr ? 0 : Number((t - Hr) / Or(e));
}
function Hc(t, e = 0n) {
  const n = ss - t - e;
  return n > 0n ? n : 0n;
}
function h5(t, e = yo) {
  return t > ss ? "over" : t < Hr + Or(e) ? "empty" : t < d5 ? "low" : "ok";
}
const p5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", g5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", y5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function w5(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || y5.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== p5 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const wy = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Oc = 3, b5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [Gl, by] = wy.split("."), on = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function Kl(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function m5(t) {
  return on(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Nr(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function my(t, e = []) {
  const n = await Nr(`/v2/contracts/call-read/${Gl}/${by}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Gl, arguments: e.map((r) => "0x" + on(ue(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Wn(un(n.result));
}
async function x5() {
  const t = await Nr(`/v2/contracts/source/${Gl}/${by}?proof=0`);
  if (typeof t.source != "string" || await m5(t.source) !== g5) throw Error("Deployed source does not match the tested helper.");
  if (w5(await my("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function xy(t) {
  return t.startsWith("SP") && ni(t) && !t.includes(".");
}
async function S5(t) {
  var r;
  if (!xy(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Nr(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Nr(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function E5(t) {
  const e = await Nr(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function A5(t, e) {
  var s, i;
  const n = await my("get-owner", [qi(t), qi(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !xy(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function v5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Kl(t), signal: AbortSignal.timeout(15e3) });
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
async function $5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function I5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = ef(Kl(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || Qs(ji(va.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || Qs(r.contractAddress) + "." + r.contractName.content !== wy || r.functionName.content !== "play" || r.functionArgs.length !== 3 || on(ue(r.functionArgs[0])) !== on(ue(qi(t.core))) || on(ue(r.functionArgs[1])) !== on(ue(qi(t.song))) || on(ue(r.functionArgs[2])) !== on(ue(F6(Kl(t.id)))) || t.amount !== "50" || e.postConditionMode !== yi.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== eo.Equal || i.principal.prefix !== 2 || Qs(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || Qs(r.contractAddress) + "." + r.contractName.content !== b5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || on(ue(r.functionArgs[0])) !== on(ue(qi(t.song))) || typeof t.liked != "boolean" || on(ue(r.functionArgs[1])) !== on(ue(D6(t.liked))) || t.amount !== "0" || e.postConditionMode !== yi.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Wn(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const k5 = "xtrata.xyz/radio/listening-wallet", L5 = "Link a temporary listening wallet for pay-per-play; no spending permission", _r = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && ni(t), C5 = (t) => ({
  domain: As({ name: Ae(k5), version: Ae("1"), "chain-id": Un(1) }),
  message: As({
    purpose: Ae(L5),
    main: Ae(t.main),
    listening: Ae(t.listening),
    issued: Un(t.issued)
  })
}), rf = 100000n, B5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function T5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !_r(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= rf).sort(B5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const Wo = 50;
function La(t) {
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
async function M5(t, e, n = 4) {
  if (!_r(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${Wo}&offset=${o}`, s = La(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - Wo);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= Wo ? s : La(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = T5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - Wo);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const Gn = 50, N5 = 6, _5 = 20, kh = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function Lh(t, e) {
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
async function U5(t, e, n) {
  if (!_r(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = La(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Gn}&offset=0`));
    if (!s || s.total > N5 * Gn) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = Gn; o < s.total; o += Gn) {
      const a = La(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Gn}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (f) => `/extended/v1/address/${t}/transactions?limit=${Gn}&offset=${f}`, a = Lh(await e(o(0)), t);
      if (!a || a.total > _5 * Gn) return { ok: !1 };
      const c = new Set(a.rows);
      for (const f of a.sent) i.set(f.txId, f);
      for (let f = Gn; f < a.total; f += Gn) {
        const d = Lh(await e(o(f)), t);
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
function P5(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(kh).map((l, g) => {
    const h = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: h, kind: "gift", to: r.payer, at: g } : _r(l.sender) && h >= rf ? { sender: l.sender, left: h, kind: "deposit", to: l.sender, at: g } : { sender: l.sender, left: h, kind: "dust", to: null, at: g };
  }), i = s.reduce((l, g) => l + g.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && _r(l.recipient) && l.amount > 0n).sort(kh), a = o.reduce((l, g) => l + g.amount, 0n), c = i - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const f = (l, g) => {
    let h = g;
    for (const m of l) {
      if (h <= 0n) break;
      const b = m.left < h ? m.left : h;
      m.left -= b, h -= b;
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
function H5(t, e) {
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
function Ch(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const Oi = ["prepared", "signed", "unknown", "pending"], O5 = 30 * 6e4, Gs = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, D5 = 3e3, Bh = "Your main listener wallet is out of funds, so likes are paused. Top it up (it only needs a little) and your likes carry on.", Th = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function F5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, f = null, d = !1, l = !1, g = !1, h = null, m = !1, b = "", C = "", P, _ = null, p, $ = [], I, R = -1 / 0;
  const Y = /* @__PURE__ */ new Set();
  let H = null, q = !1, S = 0, k = null, N = null, U = !1, Z = null, G = !1, ot = null, Gt = !1, Ht = !1, E = !1, T = !1, Lt = !1, pt = 0, ct = null, $t = Promise.resolve();
  const Mt = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? yo.toString()), Xt = (w) => !!i && !(i.features ?? []).includes(w), Yt = (w, v) => `xtrata.ppp.v1.${w}:${v}`, he = (w = i == null ? void 0 : i.address) => {
    if (!w) return [];
    try {
      const v = JSON.parse(t.store.get(Yt("entries", w)) || "[]");
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  }, Ut = (w) => {
    const v = [w, ...he(w.address).filter((j) => !(j.txid === w.txid && j.kind === w.kind))].slice(0, 200);
    t.store.set(Yt("entries", w.address), JSON.stringify(v));
  }, Ke = (w = i == null ? void 0 : i.address) => !!w && t.store.get(Yt("on", w)) !== "0", fn = (w) => {
    i != null && i.address && t.store.set(Yt("on", i.address), w ? "1" : "0");
  }, B = () => he().filter((w) => Oi.includes(w.status)), X = () => bt() ? [...B(), ...he(Bt()).filter((w) => Oi.includes(w.status))] : B(), z = () => at(i == null ? void 0 : i.address), at = (w) => {
    if (!w) return null;
    try {
      return JSON.parse(t.store.get(Yt("deposit", w)) || "null");
    } catch {
      return null;
    }
  }, it = (w, v = i == null ? void 0 : i.address) => {
    v && t.store.set(Yt("deposit", v), JSON.stringify(w));
  }, Bt = () => Xt("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), bt = () => !!(i != null && i.address) && Bt() !== i.address, Rt = () => bt() ? c && c.for === Bt() ? c.value : void 0 : o, Ft = (w) => w !== void 0 && w < Hr + Pc, Ot = () => B().filter((w) => t.now() - w.created > O5 && Y.has(w.txid)), ce = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), ut = () => ce() && !(i != null && i.linked), dt = () => {
    const w = t.main();
    return !ut() && !!w && !!(i != null && i.linked) && i.linked !== w;
  }, u = (w) => Yt("return-to", w), x = (w = i == null ? void 0 : i.address) => {
    if (!w) return;
    const v = t.store.get(u(w));
    return v && _r(v) && v !== w ? v : void 0;
  }, A = (w = i == null ? void 0 : i.address) => H && H.for === w ? H.res : null;
  function O() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const w = x();
    if (w) return { to: w, kind: "chosen" };
    const v = A();
    if (v != null && v.ok && v.funder) return { to: v.funder, kind: "funder" };
  }
  const rt = (w) => Yt("gift", w);
  function ft() {
    const w = i == null ? void 0 : i.address;
    if (!w) return null;
    if ((Z == null ? void 0 : Z.for) === w) return Z.info;
    try {
      const v = JSON.parse(t.store.get(rt(w)) || "null");
      return v && typeof v.returnTo == "string" && typeof v.treasury == "string" ? v : null;
    } catch {
      return null;
    }
  }
  async function le() {
    var J;
    const w = i == null ? void 0 : i.address;
    if (!w || !t.giftInfo || !((J = e == null ? void 0 : e.gifts) != null && J.enabled) || G) return;
    const v = (Z == null ? void 0 : Z.for) === w ? Z : null, j = v ? v.ok ? v.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (v && t.now() - v.at < j) return;
    G = !0;
    const Q = ft();
    try {
      const K = await t.giftInfo(w);
      Z = { for: w, info: K, ok: !0, at: t.now() }, t.store.set(rt(w), JSON.stringify(K));
    } catch {
      Z = { for: w, info: Q, ok: !1, at: t.now() };
    } finally {
      G = !1;
    }
  }
  const ee = () => he().reduce((w, v) => Oi.includes(v.status) ? w + BigInt(v.amount || "0") + BigInt(v.fee || "0") : w, 0n);
  function xe() {
    if (o === void 0) return 0;
    const w = o - ee() - BigInt(we.length) * Or(Mt());
    return w > 0n ? Ih(w, Mt()) : 0;
  }
  const dn = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING";
  function vn() {
    var v;
    if (!((v = ft()) != null && v.player)) return null;
    const w = (j, Q) => ({ reason: j, text: Q });
    switch (Pe()) {
      case "connect":
      case "wrong-wallet":
        return w("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "locked":
        return w("locked", "UNLOCK TO LISTEN");
      case "link":
        return w("link", "FINISH SETUP TO LISTEN");
      case "over":
        return w("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return z() ? w("arriving", "YOUR PLAYS ARE ARRIVING") : w("out", dn);
      case "ready":
        return !Ke() || !(i != null && i.session) || i.session.playsLeft < 1 ? w("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : E ? xe() < 1 ? w("out", dn) : null : w("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  let ne = null, ge = !1;
  const en = (w) => Yt("album-unlocked", w), nn = () => {
    var w;
    return !!(i != null && i.address) && bt() && !!((w = ft()) != null && w.player);
  };
  function ht() {
    if (!nn()) return null;
    const w = i.address;
    return t.store.get(en(w)) === "1" ? { locked: !1, known: !0 } : (ne == null ? void 0 : ne.for) === w && ne.ok ? { locked: !ne.open, known: !0 } : { locked: !0, known: !1 };
  }
  async function Dt() {
    if (!nn() || !t.history || ge) return;
    const w = ft(), v = i.address;
    if (t.store.get(en(v)) !== "1" && !((ne == null ? void 0 : ne.for) === v && t.now() - ne.at < (ne.ok ? 2 * 6e4 : 6e4))) {
      ge = !0;
      try {
        const j = await t.history(v, !1);
        if (!j.ok) ne = { for: v, ok: !1, open: !1, at: t.now() };
        else {
          const Q = j.inbound.some((J) => _r(J.sender) && J.sender !== v && J.sender !== w.from && J.sender !== w.treasury && BigInt(J.amount) >= rf);
          ne = { for: v, ok: !0, open: Q, at: t.now() }, Q && t.store.set(en(v), "1");
        }
      } catch {
        ne = { for: v, ok: !1, open: !1, at: t.now() };
      } finally {
        ge = !1;
      }
    }
  }
  const Vt = 3 * 6e4, hn = () => !!ft() && !!t.history && !(i != null && i.linked);
  async function Fr() {
    const w = i.address, v = ft(), { balance: j, nonce: Q } = await t.chain.account(w), J = await t.history(w, !0);
    if (!J.ok) return null;
    const K = P5({ self: w, balance: j, inbound: J.inbound, outgoing: J.outgoing, gift: { sender: v.treasury, payer: v.returnTo } });
    if (!K.ok) return null;
    const gt = H5(K.parts, qo);
    return { balance: j, nonce: Q, parts: K.parts, steps: gt.steps, tooSmall: gt.tooSmall.length };
  }
  const Li = () => Gt ? { state: "unavailable" } : !ot || t.now() - ot.at > Vt || o !== void 0 && o !== ot.balance ? { state: "none" } : ot.plan;
  function Pe() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const w = t.main();
    if (!ut()) {
      if (!w) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : dt() ? "wrong-wallet" : i.state === "known" ? "locked" : !ut() && i.linked !== w ? "link" : o === void 0 ? "loading" : o > ss ? "over" : o < Hr + Or(Mt()) ? "fund" : "ready" : "loading";
  }
  const tr = () => {
    var w, v, j, Q;
    return {
      step: Pe(),
      busy: f,
      message: b,
      error: C,
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : h5(o, Mt()),
      playsLeft: o === void 0 ? 0 : Ih(o, Mt()),
      allowance: o === void 0 ? ss : Hc(o, BigInt(((w = z()) == null ? void 0 : w.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: Ke(),
      entries: he(),
      depositTxid: ((v = z()) == null ? void 0 : v.txid) ?? P,
      depositPending: !!z(),
      walletOutdated: Xt("like"),
      linkedListening: I && I === t.main() ? $.map((J) => J.listening) : [],
      serverLinked: !!_ && p === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: Ot().length,
      armed: T,
      queued: we.length,
      solo: ut(),
      returnTo: (j = O()) == null ? void 0 : j.to,
      returnToKind: (Q = O()) == null ? void 0 : Q.kind,
      funderState: (() => {
        const J = A();
        return J ? J.ok ? J.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const J = A();
        return !!J && J.ok && J.distinct > 1;
      })(),
      walletCannotSolo: ut() && Xt("standalone"),
      walletCannotMulti: Xt("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((J) => J !== t.main() && J !== (i == null ? void 0 : i.linked)),
      creditedTo: ut() && (i != null && i.address) && (k == null ? void 0 : k.for) === i.address && k.main ? k.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(Yt("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (N == null ? void 0 : N.for) === i.address && N.unused,
      gift: (() => {
        const J = ft();
        return J ? { player: J.player, from: J.from, source: J.source, amount: J.amount } : null;
      })(),
      giftPlays: ft() ? xe() : 0,
      giftStop: vn(),
      albumLock: ht(),
      returnPlan: Li(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: Xt("slots"),
      likeFunds: (() => {
        var gt;
        const J = Bt();
        if (!J || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const K = Rt();
        return { address: J, balance: K, low: Ft(K), album: bt(), pending: !!at(J), txid: (gt = at(J)) == null ? void 0 : gt.txid, main: t.main() };
      })()
    };
  }, Nt = (w, v = "") => {
    b = w, C = v, t.changed();
  };
  async function pe(w, v) {
    if (!f) {
      f = w, C = "", t.changed();
      try {
        await v();
      } catch (j) {
        const Q = j instanceof Error ? j.message : String(j);
        C = /Cancelled in the listening wallet/.test(Q) ? "" : Q, C || (b = "Not now. Nothing was signed.", Lt = !0);
      } finally {
        f = null, await tt(!0);
      }
    }
  }
  const He = () => !!(e != null && e.enabled) && e.here && (ut() || !!t.main() && e.allowed), Us = () => He() && !dt(), jr = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", pn = () => {
    if (dt()) throw new Error(jr());
  };
  async function jn() {
    if (!He()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const rn = (w) => {
    const v = t.main();
    return w.request("listening.status", v ? { main: v } : void 0);
  };
  async function $e(w = !1) {
    i != null && i.address && (!w && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now(), await er(w)));
  }
  async function er(w = !1) {
    const v = Bt();
    if (!(!bt() || !v || (i == null ? void 0 : i.state) !== "unlocked") && !(!w && (c == null ? void 0 : c.for) === v && t.now() - c.at < 3e4))
      try {
        c = { for: v, value: await t.chain.balance(v), at: t.now() };
      } catch {
      }
  }
  async function Ps(w) {
    if ((I !== w || t.now() - R >= 6e4) && ($ = await t.links(w), I = w, R = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === w) return;
    const v = `${w}:${i.address}`;
    p === v && _ || (_ = $.find((j) => j.listening === i.address) ?? null, p = v);
  }
  async function Hs() {
    const w = i == null ? void 0 : i.address;
    if (!ut() || !w || i != null && i.linked || !t.funder || q || !o || o <= 0n) return;
    const v = A(w);
    if (v != null && v.ok && v.funder) return;
    const j = v != null && v.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, S - 1), 30 * 6e4);
    if (!(H && H.for === w && t.now() - H.at < j)) {
      q = !0;
      try {
        H = { for: w, res: await t.funder(w), at: t.now() };
      } catch {
        H = { for: w, res: { ok: !1 }, at: t.now() };
      } finally {
        q = !1;
      }
      S = H.res.ok ? 0 : S + 1;
    }
  }
  async function Os() {
    const w = i == null ? void 0 : i.address;
    if (!(!ut() || !w || i != null && i.linked || !t.mainOf || U) && !(k && k.for === w && (k.ok || t.now() - k.at < 6e4))) {
      U = !0;
      try {
        k = { for: w, main: await t.mainOf(w), ok: !0, at: t.now() };
      } catch {
        k = { for: w, main: null, ok: !1, at: t.now() };
      } finally {
        U = !1;
      }
    }
  }
  async function Ds() {
    const w = i == null ? void 0 : i.address;
    if (!(!w || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (N == null ? void 0 : N.for) === w) && t.store.get(Yt("created", w)) !== "1")
      try {
        N = { for: w, unused: await t.chain.confirmedNonce(w) === 0n };
      } catch {
      }
  }
  async function F() {
    var J;
    const w = i == null ? void 0 : i.address;
    if (!w) return !1;
    let v, j = !1;
    const Q = /* @__PURE__ */ new Map();
    for (const K of X())
      try {
        const gt = await t.chain.transaction(K.txid);
        if (!gt) {
          if (Y.add(K.txid), t.now() - K.created > 15 * 6e4 && !Q.has(K.address) && Q.set(K.address, await t.chain.confirmedNonce(K.address)), v = Q.get(K.address), v !== void 0 && v > BigInt(K.nonce)) {
            Ut({ ...K, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((K.status === "unknown" || K.status === "signed") && K.raw)
            try {
              await t.chain.broadcast(K.raw, K.txid), Ut({ ...K, status: "pending" });
            } catch (yt) {
              Gs(yt) && Ut({ ...K, status: "failed", note: yt.message, raw: void 0 });
            }
          continue;
        }
        Y.delete(K.txid);
        const mt = String(gt.tx_status);
        if (mt === "success" && gt.canonical !== !1 && gt.is_unanchored === !1) {
          if (Ut({ ...K, status: "confirmed", confirmedAt: t.now(), actualFee: String(gt.fee_rate ?? K.fee), raw: void 0 }), j = !0, K.kind === "like" && (m = !0, K.status !== "confirmed" && typeof K.liked == "boolean"))
            try {
              (J = t.likeConfirmed) == null || J.call(t, K.song, K.liked);
            } catch {
            }
        } else mt.startsWith("abort_") || mt.startsWith("dropped_") ? Ut({ ...K, status: "failed", note: mt, raw: void 0 }) : K.status !== "pending" && Ut({ ...K, status: "pending" });
      } catch {
      }
    for (const K of bt() ? [w, Bt()] : [w]) {
      const gt = at(K);
      if (gt)
        try {
          const mt = await t.chain.transaction(gt.txid), yt = String((mt == null ? void 0 : mt.tx_status) ?? "");
          (yt === "success" && mt.is_unanchored === !1 || yt.startsWith("abort_") || yt.startsWith("dropped_") || !mt && t.now() - gt.at > 2 * 36e5) && (it(null, K), a = -1 / 0, c = null, /on its way/i.test(b) && (b = ""));
        } catch {
        }
    }
    return j;
  }
  async function tt(w = !1) {
    var v;
    try {
      const j = t.main();
      if ((w || !e || r !== j || t.now() - n > 3e5) && (e = await t.config(j), n = t.now(), r = j), !e.enabled || !e.here || !ut() && (!j || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), T && zr(), t.changed();
        return;
      }
      await jn(), i = await rn(s), dt() && i.state === "unlocked" && (Fs(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await rn(s)), j && e.allowed && await Ps(j), await $e(w), await Hs(), await Os(), await Ds(), await le(), await Dt(), await F() && await $e(!0), await er();
    } catch (j) {
      C = j instanceof Error ? j.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    if (Pe() === "locked" ? Ie() : T && zr(), m) {
      m = !1;
      try {
        (v = t.likesChanged) == null || v.call(t);
      } catch {
      }
    }
    t.changed(), we.length && !Gr && Ti();
  }
  async function ye(w, v) {
    var K;
    pn();
    const j = !(i != null && i.address) || Ke(i.address), Q = i != null && i.linked ? (K = t.nameOf) == null ? void 0 : K.call(t, i.linked) : void 0;
    await w.request("listening.unlock", { mode: "unlock", terms: j ? Rr() : void 0, anyPasskey: v, ...t.main() ? { main: t.main() } : {}, ...Q ? { label: Q } : {} }), i = await rn(w), j && (Ke(i.address) ? await Ve() : await w.request("listening.stop")), Nt(j ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const J = h;
    h = null, J && t.now() - J.at < 12e4 && setTimeout(() => void tt(!0).then(() => Mi(J)), 0);
  }
  function Ie() {
    T || f || Lt || pt >= 3 || !s || !(i != null && i.address) || (T = !0, $t = (async () => {
      try {
        await ye(s, !1), pt = 0;
      } catch (w) {
        const v = w instanceof Error ? w.message : String(w);
        /Cancelled in the listening wallet/.test(v) ? ct || (Lt = !0, Nt("Not now. Nothing was signed.")) : /did not answer/.test(v) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (pt++, C = v);
      } finally {
        T = !1;
        const w = ct;
        ct = null, w ? await w() : await tt(!0);
      }
    })());
  }
  async function zr(w) {
    T && (ct = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await $t), w && await w(), t.changed();
  }
  const Rr = () => ({
    fee: Mt().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: ss.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function Ve() {
    if (!(i != null && i.address)) return !1;
    if (E || (E = await t.tabLock(i.address)), !E)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function Ci(w, v) {
    const j = i.address, { balance: Q, nonce: J } = v ?? await t.chain.account(j);
    o = Q;
    const K = await s.request("listening.prepareReturn", {
      mode: w.mode,
      balance: Q.toString(),
      nonce: J.toString(),
      fee: qo.toString(),
      ...w.amount !== void 0 ? { amount: w.amount.toString() } : {},
      ...w.linked ? {} : { destination: w.to }
    });
    if (K.recipient !== w.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const gt = w.mode === "amount" ? w.amount : w.mode === "all" ? Q - qo : Q - ss - qo, mt = ef(K.raw);
    if (Wn(mt.payload.recipient).value !== w.to || String(mt.payload.amount) !== K.amount || gt !== void 0 && K.amount !== gt.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const yt = {
      id: Th(),
      address: j,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: K.recipient,
      amount: K.amount,
      fee: K.fee,
      nonce: J.toString(),
      created: t.now(),
      status: "signed",
      raw: K.raw,
      txid: K.txid
    };
    t.validate(yt), Ut(yt);
    try {
      await t.chain.broadcast(K.raw, K.txid), Ut({ ...yt, status: "pending" });
    } catch (Se) {
      throw Ut({ ...yt, status: "unknown", note: Se.message }), Se;
    }
    return K;
  }
  async function rc(w) {
    if (B().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Xt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const v = await Fr().catch(() => null);
    if (!v)
      throw ot = null, Gt = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Gt = !1, o = v.balance;
    const j = { balance: v.balance, nonce: v.nonce };
    if (w === "excess") {
      const mt = Ch(v.parts) ?? x();
      if (!mt) throw new Error("Choose where to send the excess first.");
      await Ci({ mode: "excess", to: mt, linked: !1 }, j), ot = null, Nt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const Q = v.steps;
    if (!Q.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!ot && ot.balance === v.balance && t.now() - ot.at <= Vt && ot.steps.length === Q.length && ot.steps.every((mt, yt) => mt.to === Q[yt].to && mt.mode === Q[yt].mode && mt.send === Q[yt].send))) {
      ot = {
        at: t.now(),
        balance: v.balance,
        steps: Q,
        parts: v.parts,
        plan: { state: "ready", steps: Q.map((mt) => ({ to: mt.to, kind: mt.kind, send: mt.send.toString() })), kept: v.tooSmall, excess: Ch(v.parts) }
      }, Nt(Q.length > 1 ? `This goes back in ${Q.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const K = Q[0], gt = K.to ?? x();
    if (!gt) throw new Error("Choose where to send the rest first.");
    if (K.mode === "amount" && Xt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await Ci({ mode: K.mode, to: gt, linked: !1, ...K.mode === "amount" ? { amount: K.send } : {} }, j), ot = null, Q.length === 1 ? (fn(!1), Nt("Returned ✓ Paying is off.")) : Nt(`Returned ✓ ${Q.length - 1} more ${Q.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const wo = {
    forceRefresh: () => tt(!0),
    create: () => pe("Waiting for your passkey…", async () => {
      const w = await jn();
      await w.request("listening.unlock", { mode: "create", terms: Rr(), ...t.main() ? { main: t.main() } : {} }), i = await rn(w), i.address && t.store.set(Yt("created", i.address), "1"), fn(!0), Nt(ut() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Ve();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    giftSent: (w, v) => {
      !(i != null && i.address) || z() || (it({ txid: w, amount: v.toString(), at: t.now() }), a = -1 / 0, Z = null, Nt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (w) => {
      if (pn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Xt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await jn()).request("listening.bindSlot", { slot: w, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (w, v, j, Q) => {
      it({ txid: j, amount: Q.toString(), at: t.now() }, v), Z = null, await wo.openAlbum(w), Nt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (w) => pe("Opening…", async () => {
      if (pn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Xt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (d || l || g) throw new Error("Still sending a payment. Open the album again in a moment.");
      (i.slot ?? 0) !== w && (Fs(), await s.request("listening.openSlot", { slot: w }), i = await rn(s), o = void 0, a = -1 / 0, ot = null, Gt = !1, Nt(w === 0 ? "Back to your own wallet ✓" : "Album opened ✓"));
    }),
    unlock: (w = !1) => {
      const v = () => pe("Waiting for your passkey…", async () => ye(await jn(), w));
      return T ? w ? Xt("cancel") ? (Nt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : zr(async () => {
        (Pe() === "locked" || Pe() === "intro") && await v();
      }) : $t : v();
    },
    link: () => pe("Sign in your wallet…", async () => {
      pn();
      const w = t.main();
      if (!w || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const v = (await t.links(w)).find((j) => j.listening === i.address);
      if (v)
        await s.request("listening.link", { main: w, issued: v.issued, mainSignature: v.mainSignature });
      else {
        const j = { main: w, listening: i.address, issued: t.now() }, Q = await t.signWithMain(w, C5(j)), J = await s.request("listening.link", { main: w, issued: j.issued, mainSignature: Q });
        await t.saveLink({ ...j, mainSignature: Q, listeningSignature: J.listeningSignature }), R = -1 / 0;
      }
      Nt("Linked ✓");
    }),
    deposit: () => pe("Approve the deposit in your wallet…", async () => {
      pn();
      const w = t.main();
      if (!w || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (z()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await $e(!0);
      const v = Hc(o ?? 0n);
      if (v <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      P = await t.deposit(w, i.address, v), P && it({ txid: P, amount: v.toString(), at: t.now() }), Nt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => pe("Approve the top-up in your wallet…", async () => {
      pn();
      const w = t.main(), v = Bt();
      if (!w || !v) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (at(v)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const j = await t.chain.balance(v);
      bt() ? c = { for: v, value: j, at: t.now() } : (o = j, a = t.now());
      const Q = Hc(j);
      if (Q <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const J = await t.deposit(w, v, Q);
      J && it({ txid: J, amount: Q.toString(), at: t.now() }, v), Nt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    switchOn: () => pe("Confirm in the listening wallet…", async () => {
      if (!Us()) throw new Error("Connect your wallet first.");
      await Ve(), await s.request("listening.approveSession", Rr()), fn(!0), Nt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => pe("Clearing…", async () => {
      for (const w of Ot())
        await t.chain.transaction(w.txid) || Ut({ ...w, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Nt("Cleared ✓");
    }),
    switchOff: () => pe("Switching off…", async () => {
      Fs(), await (s == null ? void 0 : s.request("listening.stop")), fn(!1), Nt("Paying is off. Music stays free.");
    }),
    lock: () => pe("Locking…", async () => {
      Fs(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, Nt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (w) => {
      const v = String(w ?? "").trim();
      if (!(i != null && i.address)) return Nt("", "Unlock the listening wallet first.");
      if (!_r(v)) return Nt("", "Enter a standard mainnet address (it starts with SP).");
      if (v === i.address) return Nt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(u(i.address), v), Nt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(u(i.address), ""), t.changed();
    },
    returnFunds: (w) => pe("Check the return in the listening wallet…", async () => {
      if (!Us()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (hn()) return rc(w);
      const v = O();
      if (!v) throw new Error(ut() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (v.kind !== "linked" && Xt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (B().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await Ci({ mode: w, to: v.to, linked: v.kind === "linked" }), w === "all" && fn(!1), Nt(w === "all" ? v.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, we = [], sc = 10, ic = 30 * 6e4;
  let Gr = !1;
  const Kr = () => d || !!f || l || g, Fs = () => {
    we.length && (we.length = 0, t.changed());
  };
  async function Bi(w) {
    if (!we.some((v) => v.id === w.id) && !he().some((v) => v.id === w.id) && (we.push({ ...w, at: t.now() }), we.length > sc && we.shift()), Kr() || B().length) {
      const v = we.length;
      b = `Queued ${v === 1 ? "this song" : v + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Ti();
  }
  async function Ti() {
    if (!Gr) {
      Gr = !0;
      try {
        for (; we.length; ) {
          for (; we.length && t.now() - we[0].at > ic; ) we.shift();
          if (!we.length || Kr() || await oc(we[0]) === "wait") return;
          we.shift();
        }
      } finally {
        Gr = !1, t.changed();
      }
    }
  }
  async function oc(w) {
    var v;
    d = !0;
    try {
      await tt();
      const j = Pe();
      if (j === "loading") return "wait";
      if (j !== "ready" || !Ke() || !(i != null && i.session) || i.session.playsLeft < 1 || !E) return "done";
      if (B().length) return "wait";
      Ht || (await t.chain.verify(), Ht = !0);
      const Q = i.address, { balance: J, nonce: K } = await t.chain.account(Q);
      o = J, a = t.now();
      const gt = await t.chain.owner(Oc, w.song);
      if (gt === Q || gt === t.main()) return "done";
      const mt = await s.request("listening.signPlay", {
        core: Oc,
        song: w.song,
        receipt: w.id,
        fee: Mt().toString(),
        nonce: K.toString(),
        balance: J.toString()
      }), yt = {
        id: w.id,
        address: Q,
        kind: "play",
        core: Oc,
        song: w.song,
        recipient: gt,
        amount: "50",
        fee: Mt().toString(),
        nonce: K.toString(),
        created: t.now(),
        status: "signed",
        raw: mt.raw,
        txid: mt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(yt), Ut(yt);
      const Se = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`;
      try {
        await t.chain.broadcast(mt.raw, mt.txid), Ut({ ...yt, status: "pending" }), b = `♪ Paid ${Se}`, C = "";
      } catch (Oe) {
        Ut({ ...yt, status: Gs(Oe) ? "failed" : "unknown", note: Oe.message, ...Gs(Oe) ? { raw: void 0 } : {} }), C = Oe.message;
      }
      return i = await rn(s), "done";
    } catch (j) {
      const Q = j instanceof Error ? j.message : "payment unavailable";
      return (v = ft()) != null && v.player ? (b = "Payment is taking a moment: " + Q, "wait") : (b = "This song played free: " + Q, "done");
    } finally {
      d = !1, t.changed();
    }
  }
  function ac(w) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Pe()) || Xt("like") ? !1 : (Mi(w), !0);
  }
  async function Mi(w) {
    const v = w.title ? `“${w.title}”` : `song #${w.song}`, j = (Be) => {
      var Ni;
      C = Be, b = "";
      try {
        (Ni = t.likeFailed) == null || Ni.call(t, w.song);
      } catch {
      }
      t.changed();
    }, Q = bt(), J = Pe(), K = t.main(), gt = Q && (J === "fund" || J === "over") ? "ready" : J, mt = ut() ? Bt() : K;
    if (gt === "locked") {
      h = { ...w, at: t.now() }, Nt(`Unlock to like ${v}. It sends straight after.`);
      return;
    }
    if (gt === "wrong-wallet") return j(jr());
    if (gt === "link") return j("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (ut() && Xt("standalone")) return j("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (gt === "fund") return j("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (gt === "over") return j("Return the excess first: the listening wallet holds more than 1 STX.");
    if (Q) {
      await er(!0);
      const Be = Rt();
      if (Ft(Be))
        return t.changed(), j(Bh);
    }
    if (gt !== "ready" || !mt) return j("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return j("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!E) return j("Pay-per-play is running in another tab. Like from that tab.");
    const yt = he(Bt()).find((Be) => Be.kind === "like" && Be.song === w.song);
    if (yt && Oi.includes(yt.status))
      return j(`Your last like for ${v} is still on its way. It can change again once it confirms.`);
    if (l) return j("One like at a time: your last one is still being sent.");
    if ((yt == null ? void 0 : yt.status) === "confirmed" && t.now() - (yt.confirmedAt ?? 0) < D5)
      return j(`Your like for ${v} has only just confirmed. Try again in a moment.`);
    let Se;
    g = !0;
    try {
      Se = t.likeState ? (await t.likeState(mt, w.song)).by : w.likedBy ?? [];
    } catch {
      Se = w.likedBy;
    } finally {
      g = !1;
    }
    if (!Se) return j(`Could not check ${v} right now. Try the heart again.`);
    const Oe = Bt(), Ce = ((yt == null ? void 0 : yt.status) === "confirmed" && typeof yt.liked == "boolean" && t.now() - (yt.confirmedAt ?? yt.created) < 5 * 6e4 ? yt.liked : void 0) ?? Se.includes(Oe);
    if (!Ce && Se.some((Be) => Be !== Oe)) return j(ut() ? `${v} was liked from another wallet of yours. Unlike it there.` : `${v} was liked from your main wallet${Se.includes(K) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await cc({ song: w.song, liked: !Ce, title: w.title, artist: w.artist });
  }
  async function cc(w) {
    var Q, J, K;
    if (l) {
      Nt("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const v = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`, j = t.wait ?? ((gt) => new Promise((mt) => setTimeout(mt, gt)));
    try {
      Nt(`${w.liked ? "Liking" : "Unliking"} ${v}…`);
      const gt = t.now() + 12e4;
      for (; d || (bt() ? he(Bt()).some((Ce) => Oi.includes(Ce.status)) : B().length); ) {
        if (t.now() > gt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await j(5e3), await tt(!0);
      }
      if (!bt() && Pe() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const mt = Bt(), { balance: yt, nonce: Se } = await t.chain.account(mt);
      if (bt() ? c = { for: mt, value: yt, at: t.now() } : (o = yt, a = t.now()), Ft(yt)) throw new Error(Bh);
      const Oe = await s.request("listening.signLike", {
        song: w.song,
        liked: w.liked,
        fee: Pc.toString(),
        nonce: Se.toString(),
        balance: yt.toString()
      }), Vr = {
        id: Th(),
        address: mt,
        kind: "like",
        core: 0,
        song: w.song,
        liked: w.liked,
        recipient: "",
        amount: "0",
        fee: Pc.toString(),
        nonce: Se.toString(),
        created: t.now(),
        status: "signed",
        raw: Oe.raw,
        txid: Oe.txid,
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(Vr), Ut(Vr);
      try {
        await t.chain.broadcast(Oe.raw, Oe.txid), Ut({ ...Vr, status: "pending" }), b = `${w.liked ? "♥ Liked" : "Unliked"} ${v}`, C = "";
        try {
          (Q = t.likeSent) == null || Q.call(t, w.song, w.liked);
        } catch {
        }
      } catch (Ce) {
        if (Ut({ ...Vr, status: Gs(Ce) ? "failed" : "unknown", note: Ce.message, ...Gs(Ce) ? { raw: void 0 } : {} }), C = Ce.message, Gs(Ce)) try {
          (J = t.likeFailed) == null || J.call(t, w.song);
        } catch {
        }
      }
      i = await rn(s);
    } catch (gt) {
      C = "Like not sent: " + (gt instanceof Error ? gt.message : "the listening wallet is unavailable");
      try {
        (K = t.likeFailed) == null || K.call(t, w.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), Ti();
    }
  }
  return { snapshot: tr, refresh: tt, onListened: Bi, heart: ac, toggleLike: Mi, ...wo };
}
const Sy = ["Connect", "Passkey", "Link & fund", "Listen"], Ey = ["Passkey", "Add 1 STX", "Listen"], Vl = (t) => t ? Ey : Sy;
function j5(t) {
  if (t.solo) return z5(t);
  const e = Sy.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function z5(t) {
  const e = Ey.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function R5(t, e) {
  return !e || e.at >= Vl(!!t.solo).length || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const G5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function K5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !G5(r.id)));
}
const V5 = {}, q5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, W5 = (t) => {
  const e = V5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, X5 = (t) => `/hiro/${t}`, Y5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, Z5 = (t) => {
  const e = W5(t);
  if (e)
    return [Y5(e)];
  const n = q5[t];
  return typeof window < "u" ? [`${window.location.origin}${X5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, Q5 = {}, Mh = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, J5 = "xtrata.log.enabled", tv = "xtrata.log.level", ev = "xtrata.log.tags", nv = "xtrata.log.dedupe", Xo = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, rv = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, sv = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, iv = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, ov = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, av = () => {
  const t = Q5 ?? {}, e = Xo(J5) ?? t.VITE_LOG_ENABLED, n = Xo(tv) ?? t.VITE_LOG_LEVEL, r = Xo(ev) ?? t.VITE_LOG_TAGS, s = Xo(nv) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: rv(e),
    level: sv(n) ?? "warn",
    tags: ov(r),
    dedupe: iv(s)
  };
}, cv = (t, e, n) => !t.enabled || Mh[n] < Mh[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), lv = (t, e, n, r) => {
  const s = av();
  if (!cv(s, e, t) || fv(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, uv = /* @__PURE__ */ new Set();
let Nh = null;
const fv = (t, e, n, r, s) => (Nh !== t && (uv.clear(), Nh = t), !1), dv = (t, e, n) => lv("debug", t, e, n), hv = {}, pv = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, gv = (t) => {
  const e = hv, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : pv[t];
}, yv = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, wv = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return yv.test(n) ? n : null;
}, bv = (t) => t.replace(/\/+$/, ""), mv = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), _h = (t) => {
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
}, Ks = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, xv = (t) => {
  var c, f;
  let e;
  try {
    e = Wn(S6(t));
  } catch {
    return null;
  }
  const n = Ks(e);
  if (!n || n.success === !1)
    return null;
  const r = Ks(n.value), s = Ks(r == null ? void 0 : r.value), i = Ks(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = _h((c = Ks(i.name)) == null ? void 0 : c.value), a = _h((f = Ks(i.namespace)) == null ? void 0 : f.value);
  return !o || !a ? null : wv(`${o}.${a}`);
}, Sv = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${bv(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [ny(Dg(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : xv(i.result);
}, Ev = async (t) => {
  const e = t.address.trim();
  if (!ni(e))
    return null;
  const n = gv(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of Z5(t.network))
    try {
      return await Sv({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return dv("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: mv(r)
  }), null;
};
function Av(t, e, n = {}) {
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
const Uh = Object.freeze({
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
function vv(t, e = "") {
  return Object.hasOwn(Uh, String(t)) ? Uh[String(t)] : e;
}
const Ph = Object.freeze({ 312: "Smalltalk", 315: "Entertainment" });
function $v(t, e = "") {
  return Object.hasOwn(Ph, String(t)) ? Ph[String(t)] : e;
}
const Iv = 100000n, Hh = 1000000n, kv = 3000n, Lv = (t, e) => `${t}#gift=${e}`, Cv = 100, Dc = (t, e = yo) => t <= Hr ? 0 : Number((t - Hr) / Or(e)), Oh = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), Ay = "xtrata.xyz/radio/gifts", Bv = "Create Xtrata radio gift links paid from the gift treasury", Tv = (t) => ({
  domain: As({ name: Ae(Ay), version: Ae("1"), "chain-id": Un(1) }),
  message: As({
    purpose: Ae(Bv),
    admin: Ae(t.admin),
    count: Un(t.count),
    amount: Un(BigInt(t.amount)),
    label: Ae(t.label),
    issued: Un(t.issued),
    ...t.player ? { player: Ae(t.player) } : {}
  })
}), Dh = 40, Mv = "Create an Xtrata radio gift player", Nv = /^[^\u0000-\u001f\u007f<>]+$/u;
function Fh(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && Nv.test(t) : !n;
}
function _v(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!Fh(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!Fh(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > Dh) throw new Error(`A player holds 1 to ${Dh} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: null };
}
const Uv = (t) => z0(W0(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), Pv = (t) => ({
  domain: As({ name: Ae(Ay), version: Ae("1"), "chain-id": Un(1) }),
  message: As({
    purpose: Ae(Mv),
    admin: Ae(t.admin),
    player: Ae(t.hash),
    issued: Un(t.issued)
  })
}), jh = (t, e = yo) => Hr + BigInt(t) * Or(e), zh = [300, 500, 1e3], Rh = 1800, Fc = /* @__PURE__ */ new Map();
async function vy(t) {
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
async function Hv(t) {
  const e = navigator;
  if (e.share)
    try {
      return await e.share(t), { label: "Shared ✓", ok: !0 };
    } catch (n) {
      if ((n == null ? void 0 : n.name) === "AbortError") return null;
    }
  return await vy(t.url) ? { label: "Link copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 };
}
function $y(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = Fc.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      Fc.set(t, { ...a, until: Date.now() + Rh });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Fc.delete(t), s();
      }, Rh + 50);
    }
  }, i;
}
const ti = (t, e, n, r, s) => $y(t, e, async () => await vy(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), Xr = "xtrata.radio.gift.incoming.v1", Gh = (t) => "xtrata.radio.gift.mine.v1:" + t, lt = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, $r = (t, e, n = "") => {
  const r = lt("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, Di = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, Vs = (t) => yn(t).replace(/\.?0+$/, "");
function Ov(t) {
  let e = null;
  const n = (() => {
    try {
      const B = new URL(location.href), X = new URLSearchParams(B.hash.slice(1)).get("gift") ?? B.searchParams.get("gift");
      return X !== null && (B.searchParams.delete("gift"), history.replaceState(null, "", B.pathname + (B.search || ""))), Oh(X) ? X : null;
    } catch {
      return null;
    }
  })(), r = (() => {
    try {
      const B = JSON.parse(t.store.get(Xr) || "null");
      return Oh(B == null ? void 0 : B.code) ? B.code : null;
    } catch {
      return null;
    }
  })(), s = n ?? r;
  s && (e = { code: s }, t.store.set(Xr, JSON.stringify({ code: s, at: t.now() })), fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (B) => {
    const X = await B.json().catch(() => ({}));
    if (!B.ok)
      throw B.status === 404 && t.store.set(Xr, null), new Error((X == null ? void 0 : X.error) || "Could not check your gift right now. Reload to try again.");
    const z = X;
    e = { ...e, view: z }, ["claimed", "expired", "refunding", "refunded"].includes(z.status) && t.store.set(Xr, null), t.changed();
  }).catch((B) => {
    e = { ...e, error: B.message }, t.changed();
  }));
  const i = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, o = () => {
    e = null, t.store.set(Xr, null), t.changed();
  }, a = (B) => B.from ? t.who(B.from) : B.label ? `Xtrata Radio · ${B.label}` : "Xtrata Radio";
  let c = {};
  const f = (B) => {
    if (c.box) return c.box;
    const X = lt("div", "", "ppp-gift-check");
    c.box = X;
    const z = () => {
      const at = window.turnstile;
      !at || c.rendered || (c.rendered = !0, at.render(X, { sitekey: B, callback: (it) => {
        c.token = it, t.changed();
      }, "expired-callback": () => {
        c.token = void 0;
      } }));
    };
    if (window.turnstile) z();
    else {
      const at = document.createElement("script");
      at.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", at.async = !0, at.onload = z, document.head.append(at);
    }
    return X;
  };
  let d;
  async function l(B) {
    var at, it, Bt, bt, Rt;
    if (!e || e.claiming || !B.listening) return;
    const X = !!((at = e.view) != null && at.player);
    if (X && !B.root) return;
    e.claiming = !0, e.error = void 0, t.changed();
    const z = async (Ft) => {
      const Ot = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: c.token, ...Ft })
      });
      return { res: Ot, r: await Ot.json().catch(() => ({})) };
    };
    try {
      let Ft = 0, Ot = B.listening, ce;
      if (X) {
        const u = Number((it = await t.json("/radio/gift/slots?root=" + encodeURIComponent(B.root))) == null ? void 0 : it.next);
        if (!Number.isSafeInteger(u) || u < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Ft = u;
        for (let x = 0; ; x++) {
          const A = await t.album.bind(Ft);
          if (Ot = A.address, ce = await z({ wallet: Ot, binding: A }), ce.res.status === 409 && /just taken/.test(((Bt = ce.r) == null ? void 0 : Bt.error) || "") && x < 5) {
            Ft += 1;
            continue;
          }
          break;
        }
      } else ce = await z({ wallet: Ot });
      const { res: ut, r: dt } = ce;
      if (ut.status === 503 && /sending another gift/.test((dt == null ? void 0 : dt.error) || "")) {
        e.waiting = !0, clearTimeout(d), d = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!ut.ok)
        throw (ut.status === 404 || ut.status === 410 || ut.status === 409 && /already had a gift|brand-new/.test((dt == null ? void 0 : dt.error) || "")) && t.store.set(Xr, null), new Error((dt == null ? void 0 : dt.error) || `Could not claim the gift (${ut.status}).`);
      e.done = !0, t.store.set(Xr, null), X ? await t.album.arrived(Ft, Ot, dt.txid, BigInt(dt.amount)) : t.giftSent(dt.txid, BigInt(dt.amount));
    } catch (Ft) {
      e.error = Ft.message, c.token = void 0;
      try {
        (Rt = (bt = window.turnstile) == null ? void 0 : bt.reset) == null || Rt.call(bt, c.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let g = null;
  function h(B) {
    if (!B.listening || !B.depositPending || B.step !== "fund")
      return g = null, [];
    if (!g || g.wallet !== B.listening || t.now() - g.at > 3e4) {
      const X = B.listening;
      g = { ...(g == null ? void 0 : g.wallet) === X ? g : {}, wallet: X, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(X)).then((z) => {
        var at, it;
        (g == null ? void 0 : g.wallet) === X && (g.state = (at = z == null ? void 0 : z.gift) == null ? void 0 : at.state, g.problem = ((it = z == null ? void 0 : z.gift) == null ? void 0 : it.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    return g.state === "sending" && g.problem ? [lt("p", `🎁 Your gift is waiting to go out (${g.problem}). It is retried automatically.`, "ppp-warn")] : [];
  }
  function m(B, X) {
    var Rt, Ft;
    const z = X.player, at = BigInt(X.amount), it = [lt("p", `🎁 ${a(X)} sent you “${z.title}”${z.subtitle ? ` by ${z.subtitle}` : ""}: ${z.tracks.length} ${z.tracks.length === 1 ? "song" : "songs"} and ${Dc(at).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!B.root && ["fund", "ready", "over", "link"].includes(B.step)))
      return it.push(lt("p", B.step === "intro" ? "Tap below: your passkey makes a listening wallet, and the album arrives in its own wallet. You can keep as many albums as you like." : B.step === "locked" ? "Unlock your listening wallet and the album arrives in its own wallet." : "Open your listening wallet and the album arrives in its own wallet.", "ppp-mute")), it;
    if (B.walletCannotAlbums)
      return it.push(lt("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), it;
    const bt = (Ft = (Rt = B.gate) == null ? void 0 : Rt.gifts) == null ? void 0 : Ft.turnstileSiteKey;
    return bt && !c.token ? it.push(lt("p", "One quick check and it is yours:", "ppp-mute"), f(bt)) : !e.claiming && !e.error && !e.waiting && l(B), (e.claiming || e.waiting) && it.push(lt("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : "Sending your album…", "ppp-cyan")), e.error && it.push(lt("p", e.error, "ppp-bad"), $r("Try again", () => {
      e.error = void 0, l(B);
    })), it;
  }
  function b(B) {
    var ce, ut;
    const X = h(B);
    if (!e || ["off", "elsewhere"].includes(B.step)) return X;
    const z = e.view;
    if (e.error && !z) return [lt("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!z) return [lt("p", "🎁 Checking your gift…", "ppp-mute")];
    if (e.done) return X;
    if (z.status === "claimed" || z.status === "claiming") return [lt("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(z.status)) return [lt("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (z.status === "pending-deposit") return [lt("p", `🎁 ${a(z)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (z.player) return [...m(B, z), ...X];
    if (!!B.listening && (!(B.createdHere || B.brandNew) || !!B.linked || !!B.creditedTo || (B.balance ?? 0n) > 0n || B.entries.length > 0))
      return [lt("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), $r("Forget this gift link here", o, "quiet")];
    const it = BigInt(z.amount), Bt = Dc(it).toLocaleString(), Rt = [lt(
      "p",
      `🎁 ${a(z)} sent you ${Vs(it)} STX of on-chain music: about ${Bt} paid plays.`,
      "ppp-gift"
    )], Ft = !!B.listening && (B.createdHere || B.brandNew) && !B.linked && !B.creditedTo && B.step === "fund" && (B.balance ?? 1n) === 0n && !B.depositPending && !B.entries.length, Ot = (ut = (ce = B.gate) == null ? void 0 : ce.gifts) == null ? void 0 : ut.turnstileSiteKey;
    return Ft ? (Ot && !c.token ? Rt.push(lt("p", "One quick check and it is yours:", "ppp-mute"), f(Ot)) : !e.claiming && !e.error && !e.waiting && l(B), (e.claiming || e.waiting) && Rt.push(lt("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : "Sending your gift…", "ppp-cyan")), e.error && Rt.push(lt("p", e.error, "ppp-bad"), $r("Try again", () => {
      e.error = void 0, l(B);
    }))) : B.step === "intro" ? Rt.push(lt("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : B.listening && B.linked ? Rt.push(lt("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), $r("Forget this gift link here", o, "quiet")) : B.listening && (B.balance ?? 0n) > 0n && Rt.push(lt("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), $r("Forget this gift link here", o, "quiet")), Rt;
  }
  async function C(B, X, z) {
    var at;
    try {
      const it = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(B));
      if ((at = it == null ? void 0 : it.gift) != null && at.returnTo) return { ok: !0, funder: it.gift.returnTo, txId: it.gift.txid ?? void 0, amount: it.gift.amount, distinct: 1 };
    } catch {
      if (z) return { ok: !1 };
    }
    return X();
  }
  const P = lt("div", "", "ppp-gift-fold");
  let _ = 250000n, p = "", $ = "", I = null;
  const R = (B) => {
    try {
      const X = JSON.parse(t.store.get(Gh(B)) || "[]");
      return Array.isArray(X) ? X : [];
    } catch {
      return [];
    }
  }, Y = (B, X) => t.store.set(Gh(B), JSON.stringify(X.slice(0, 50)));
  let H = 0;
  async function q(B) {
    const X = R(B);
    for (const z of X)
      if (!(z.view && ["claimed", "refunded", "expired"].includes(z.view.status)))
        try {
          z.view = !z.view || z.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: z.id, ...z.txid ? { txid: z.txid } : {} }) }) : await t.json("/radio/gift?id=" + z.id), z.error = void 0;
        } catch (at) {
          z.error = at.message;
        }
    Y(B, X), t.changed();
  }
  async function S(B) {
    if (p) return;
    p = "Starting your gift…", $ = "", t.changed();
    let X = null;
    try {
      X = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: B, amount: _.toString() }) });
      const z = R(B);
      z.unshift({ id: X.id, code: X.code, amount: _.toString(), at: t.now() }), Y(B, z), p = "Approve the gift in your wallet…", t.changed();
      const at = await t.pay(B, X.depositTo, BigInt(X.deposit), X.memo), it = R(B), Bt = it.find((bt) => bt.id === X.id);
      Bt && (Bt.txid = at, Bt.view = { status: "pending-deposit", amount: _.toString(), source: "friend", from: B, label: "", expires: 0 }), Y(B, it), $ = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", q(B);
    } catch (z) {
      $ = z.message || "Not sent.";
    } finally {
      p = "", t.changed();
    }
  }
  const k = (B) => "xtrata.radio.gift.players.v1:" + B, N = (B) => {
    try {
      const X = JSON.parse(t.store.get(k(B)) || "[]");
      return Array.isArray(X) ? X.filter((z) => z && /^[0-9a-f]{16}$/.test(z.id)) : [];
    } catch {
      return [];
    }
  };
  async function U(B, X) {
    if (!p) {
      p = "Checking the player…", $ = "", t.changed();
      try {
        const z = X.tracks.split(/[\s,]+/).filter(Boolean).map((Ft) => Number(Ft.replace(/^#/, ""))), at = _v({ title: X.title.trim(), subtitle: X.subtitle.trim(), tracks: z, cover: null });
        p = "Sign in your wallet…", t.changed();
        const it = { admin: B, hash: Uv(at), issued: t.now() }, Bt = await t.sign(B, Pv(it));
        p = "Making the player…", t.changed();
        const bt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: at, request: it, signature: Bt }) }), Rt = N(B).filter((Ft) => Ft.id !== bt.id);
        Rt.unshift({ id: bt.id, title: bt.title, tracks: bt.tracks }), t.store.set(k(B), JSON.stringify(Rt.slice(0, 30))), $ = `${bt.existing ? "That player already exists" : "Player made"} ✓ “${bt.title}” · ${bt.tracks} songs. Pick it below for a campaign.`;
      } catch (z) {
        $ = z.message || "Not made.";
      } finally {
        p = "", t.changed();
      }
    }
  }
  async function Z(B, X, z, at, it) {
    if (!p) {
      p = "Sign in your wallet…", $ = "", I = null, t.changed();
      try {
        const Bt = { admin: B, count: X, amount: z.toString(), label: at, issued: t.now(), ...it ? { player: it } : {} }, bt = await t.sign(B, Tv(Bt));
        p = "Making links…", t.changed();
        const Rt = await t.json("/radio/gift/campaign", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ request: Bt, signature: bt }) });
        I = { codes: Rt.codes, amount: Rt.amount };
      } catch (Bt) {
        $ = Bt.message || "Not made.";
      } finally {
        p = "", t.changed();
      }
    }
  }
  const G = (B, X) => Lv(B || location.origin + "/radio.html", X), ot = (B) => Hv({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: B }), Gt = lt("input");
  Gt.type = "range", Gt.min = String(Iv), Gt.max = String(Hh), Gt.step = "50000", Gt.value = String(_), Gt.setAttribute("aria-label", "Gift amount");
  const Ht = lt("p", "", "ppp-gift-amount"), E = $r("", () => {
    const B = t.main();
    B && S(B);
  }, "primary"), T = () => {
    Ht.textContent = Lt(), E.textContent = `Gift ${Vs(_)} STX`;
  };
  Gt.oninput = () => {
    _ = BigInt(Gt.value), T();
  };
  const Lt = () => `${Vs(_)} STX · about ${Dc(_).toLocaleString()} paid plays · you pay ${Vs(_ + kv)} STX with the network fee`;
  T();
  const pt = lt("input");
  pt.type = "number", pt.min = "1", pt.max = String(Cv), pt.value = "10", pt.setAttribute("aria-label", "How many links");
  const ct = lt("input");
  ct.type = "number", ct.min = "0.1", ct.max = "1", ct.step = "0.05", ct.value = String(Number(jh(zh[0])) / 1e6), ct.setAttribute("aria-label", "STX per link");
  const $t = lt("input");
  $t.maxLength = 60, $t.placeholder = "Title, e.g. Proof of Sound", $t.setAttribute("aria-label", "Player title");
  const Mt = lt("input");
  Mt.maxLength = 80, Mt.placeholder = "Artist (optional)", Mt.setAttribute("aria-label", "Player subtitle");
  const Xt = lt("textarea");
  Xt.rows = 3, Xt.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Xt.setAttribute("aria-label", "Songs");
  const Yt = lt("select");
  Yt.setAttribute("aria-label", "Gift player");
  const he = lt("select");
  he.setAttribute("aria-label", "Plays per link");
  for (const B of zh) he.append(Di(`${B.toLocaleString()} plays`, String(jh(B))));
  he.append(Di("Max (1 STX)", String(Hh)), Di("Custom STX", "")), he.onchange = () => {
    he.value && (ct.value = String(Number(he.value) / 1e6));
  };
  const Ut = lt("input");
  Ut.maxLength = 40, Ut.placeholder = "Label, e.g. Launch week", Ut.setAttribute("aria-label", "Campaign label");
  function Ke(B) {
    var it, Bt, bt, Rt, Ft;
    const X = (it = B.gate) == null ? void 0 : it.gifts;
    if (!(X != null && X.enabled) || ["off", "elsewhere", "unsupported"].includes(B.step)) return null;
    const z = t.main(), at = [lt("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!z)
      at.push(lt("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      E.disabled = !!p, at.push(Gt, Ht, E), t.now() - H > 3e4 && (H = t.now(), q(z));
      const Ot = R(z);
      if (Ot.length) {
        const ce = lt("ul", "", "ppp-gift-list");
        for (const ut of Ot.slice(0, 10)) {
          const dt = (Bt = ut.view) == null ? void 0 : Bt.status, u = ut.error ? ut.error : !dt || dt === "pending-deposit" ? ut.txid ? "payment confirming…" : "waiting for your payment" : dt === "live" ? "ready to share" : dt === "claiming" || dt === "claimed" ? "claimed ✓" : dt === "refunding" ? "expired · refund on its way" : dt === "refunded" ? "expired · refunded to you" : dt, x = lt("li");
          if (x.append(lt("span", `${Vs(BigInt(ut.amount))} STX`, "t"), lt("span", u, ((bt = ut.view) == null ? void 0 : bt.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((Rt = ut.view) == null ? void 0 : Rt.status) === "live") {
            const A = G(((Ft = B.gate) == null ? void 0 : Ft.radioUrl) ?? null, ut.code);
            x.append(ti("gift-copy:" + ut.id, "Copy link", () => A, "tiny", t.changed), $y("gift-share:" + ut.id, "Share", () => ot(A), "tiny", t.changed));
          }
          ce.append(x);
        }
        at.push(ce);
      }
      if (X.admin) {
        const ce = $r("Sign and make links", () => {
          const A = BigInt(Math.round(Number(ct.value) * 1e6));
          Z(z, Number(pt.value), A, Ut.value.trim(), Yt.value || void 0);
        }), ut = lt("div", "", "ppp-gift-admin"), dt = (A, O) => {
          const rt = lt("label", A);
          return rt.append(O), rt;
        }, u = N(z), x = Yt.value;
        if (Yt.replaceChildren(Di("No player (plain gift)", ""), ...u.map((A) => Di(`${A.title} · ${A.tracks} songs`, A.id))), u.some((A) => A.id === x) && (Yt.value = x), ut.append(
          lt("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
          $t,
          Mt,
          Xt,
          $r("Sign and make player", () => void U(z, { title: $t.value, subtitle: Mt.value, tracks: Xt.value })),
          lt("p", "Campaign links (admin) · paid from the gift treasury", "ppp-cyan"),
          dt("Player ", Yt),
          dt("Plays each ", he),
          dt("Links ", pt),
          dt("STX each ", ct),
          Ut,
          ce
        ), I) {
          const A = I.codes.map((rt) => {
            var ft;
            return G(((ft = B.gate) == null ? void 0 : ft.radioUrl) ?? null, rt);
          }).join(`
`), O = lt("textarea");
          O.readOnly = !0, O.value = A, O.rows = Math.min(8, I.codes.length), ut.append(lt("p", `${I.codes.length} links, ${Vs(BigInt(I.amount))} STX each. Copy them now: they are not shown again.`, "ppp-warn"), O, ti("campaign-copy", "Copy all", () => A, "tiny", t.changed));
        }
        at.push(ut);
      }
    }
    return p && at.push(lt("p", p, "ppp-cyan")), $ && at.push(lt("p", $, /✓/.test($) ? "ppp-ok" : "ppp-warn")), P.replaceChildren(...at), P;
  }
  return { banner: b, funder: C, renderFold: Ke, liveGift: i, setAside: o, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null };
}
const Dv = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function Fv(t) {
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
const jv = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function zv(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((i) => (!e.pinnedOnly || e.pins.has(i.slot)) && (() => {
    const o = jv(i);
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
function Rv(t, e = 100) {
  const n = Object.entries(t).sort((r, s) => s[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const qs = 12, Gv = 5e3, je = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Ws = (t, e, n = "") => {
  const r = je("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function Kv(t) {
  let e, n = [], r = 0, s = !1, i = !1, o = -1 / 0, a = "", c = "recent", f = !1, d = qs;
  const l = je("div", "", "ppp-shelf-box"), g = (k) => "xtrata.radio.shelf.pins.v1:" + k, h = (k) => "xtrata.radio.shelf.recent.v1:" + k, m = (k, N) => {
    try {
      return JSON.parse(t.store.get(k) || "null") ?? N;
    } catch {
      return N;
    }
  }, b = (k) => new Set(m(g(k), []).filter((N) => Number.isSafeInteger(N))), C = (k) => {
    const N = m(h(k), {}), U = {};
    for (const [Z, G] of Object.entries(N)) Number.isSafeInteger(Number(Z)) && typeof G == "number" && (U[Number(Z)] = G);
    return U;
  };
  async function P(k) {
    if (!s) {
      s = !0, i = !1;
      try {
        const N = [];
        let U = 0, Z = 0;
        for (let G = 0; G < Gv / 100 + 1; G++) {
          const ot = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(k)}&after=${U}&limit=100`);
          if (N.push(...Fv(ot == null ? void 0 : ot.shelf)), Z = Number(ot == null ? void 0 : ot.total) || N.length, !(ot != null && ot.next) || !Number.isSafeInteger(ot.next)) break;
          U = ot.next;
        }
        k === e && (n = N, r = Z, o = t.now());
      } catch {
        i = !0;
      } finally {
        s = !1, t.changed();
      }
    }
  }
  const _ = () => {
    o = -1 / 0;
  }, p = je("input");
  p.type = "search", p.placeholder = "Search title, artist or #", p.setAttribute("aria-label", "Search your albums"), p.oninput = () => {
    a = p.value, d = qs, t.changed();
  };
  const $ = je("select");
  $.setAttribute("aria-label", "Sort albums");
  for (const k of Dv) {
    const N = document.createElement("option");
    N.value = k.value, N.textContent = k.label, $.append(N);
  }
  $.onchange = () => {
    c = $.value, d = qs, t.changed();
  };
  const I = Ws("", () => {
    f = !f, d = qs, t.changed();
  }, "tiny"), R = je("div", "", "ppp-shelf-tools");
  R.append(p, $, I);
  const Y = je("div"), H = je("div");
  function q(k) {
    const N = k.step === "off" || k.step === "elsewhere" ? void 0 : k.root;
    if (N !== e && (e = N, n = [], r = 0, o = -1 / 0, d = qs), !N || k.walletCannotAlbums) return null;
    if (!s && t.now() - o > 5 * 6e4 && P(N), !n.length)
      return i ? (H.replaceChildren(je("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Ws("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(H), l) : null;
    const U = b(N), Z = C(N), G = zv(n, { query: a, sort: c, pinnedOnly: f, pins: U, recents: Z });
    p.value !== a && (p.value = a), $.value = c, I.textContent = f ? "★ Pinned only" : "☆ Pinned only", I.setAttribute("aria-pressed", String(f));
    const ot = [];
    if (k.slot > 0 && ot.push(Ws("← Back to my own wallet", () => t.open(0), "quiet")), !G.length) ot.push(je("p", "No album matches that.", "ppp-mute"));
    else {
      const Gt = je("ul", "", "ppp-shelf-list");
      for (const Ht of G.slice(0, d)) {
        const E = je("li", "", Ht.slot === k.slot ? "now" : ""), T = U.has(Ht.slot), Lt = Ws(T ? "★" : "☆", () => {
          const Mt = new Set(U);
          T ? Mt.delete(Ht.slot) : Mt.add(Ht.slot), t.store.set(g(N), JSON.stringify([...Mt])), t.changed();
        }, "tiny");
        Lt.setAttribute("aria-label", T ? `Unpin ${Ht.player.title}` : `Pin ${Ht.player.title}`);
        const pt = [Ht.player.subtitle, `${Ht.player.tracks.length} ${Ht.player.tracks.length === 1 ? "song" : "songs"}`, Ht.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), ct = Ht.slot === k.slot, $t = Ws(ct ? "Playing" : "Play", () => {
          t.store.set(h(N), JSON.stringify(Rv({ ...Z, [Ht.slot]: t.now() }))), t.open(Ht.slot);
        }, ct ? "tiny" : "tiny primary");
        $t.disabled = ct, E.append(Lt, je("span", Ht.player.title, "t"), je("span", " " + pt, "ppp-mute"), $t), Gt.append(E);
      }
      ot.push(Gt), G.length > d && ot.push(Ws(`Show more (${G.length - d} left)`, () => {
        d += qs, t.changed();
      }, "quiet"));
    }
    return i && ot.push(je("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), Y.replaceChildren(...ot), l.firstChild !== R && l.replaceChildren(R, Y), l;
  }
  return { render: q, invalidate: _, count: () => r || n.length };
}
const Vv = [
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
function qv(t) {
  for (const [e, n] of Vv) if (n.test(t)) return e;
  return null;
}
const Iy = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), ky = (t) => /Android/.test(t);
function Wv(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : Iy(e) ? "x-safari-" + n.href : ky(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const Xv = (t) => Iy(t) ? "Safari" : ky(t) ? "Chrome" : "your browser", Kh = document.getElementById("ppp");
Kh && Yv(Kh);
function Yv(t) {
  var dt;
  const e = hw(), n = (u) => t.querySelector(u), r = n(".ppp-frame");
  let s = null;
  const i = async (u, x) => {
    const A = await fetch(u, { cache: "no-store", ...x, signal: AbortSignal.timeout(15e3) }), O = await A.json().catch(() => ({}));
    if (!A.ok) throw new Error((O == null ? void 0 : O.error) || `Request failed (${A.status}).`);
    return O;
  }, o = F5({
    now: Date.now,
    main: () => {
      const u = e.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    config: (u) => i("/radio/listening-wallet/config?main=" + encodeURIComponent(u || "")),
    links: async (u) => (await i("/radio/listening-wallet/link?main=" + encodeURIComponent(u))).links ?? [],
    mainOf: async (u) => {
      var A;
      const x = (await i("/radio/listening-wallet/link?listening=" + encodeURIComponent(u))).links;
      return ((A = x == null ? void 0 : x.find((O) => O.listening === u)) == null ? void 0 : A.main) ?? null;
    },
    saveLink: async (u) => {
      await i("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(u) });
    },
    bridge: async (u) => {
      s = document.createElement("iframe"), s.title = "Xtrata listening wallet", s.setAttribute("allow", `publickey-credentials-get ${u}; publickey-credentials-create ${u}`), s.referrerPolicy = "no-referrer";
      const x = new Promise((ft, le) => {
        s.addEventListener("load", () => ft(), { once: !0 }), setTimeout(() => le(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = u + "/", r.replaceChildren(s), await x;
      const A = new sw({ walletOrigin: u, frame: s, timeoutMs: 30 * 6e4 }), O = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), rt = (ft, le) => O.has(ft) ? A.request(ft, le) : Promise.race([
        A.request(ft, le),
        new Promise((ee, xe) => setTimeout(() => xe(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await rt("listening.status"), { request: rt };
    },
    chain: {
      verify: x5,
      balance: E5,
      account: S5,
      owner: A5,
      broadcast: v5,
      transaction: $5,
      confirmedNonce: async (u) => {
        const x = await Nr(`/v2/accounts/${u}?proof=0`);
        if (!Number.isSafeInteger(x == null ? void 0 : x.nonce) || x.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(x.nonce);
      }
    },
    signWithMain: (u, x) => vh({ ...x, network: "mainnet", stxAddress: u }),
    deposit: (u, x, A) => new Promise((O, rt) => mh({
      recipient: x,
      amount: A.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: u,
      network: new jc(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (ft) => O(ft.txId || ""),
      onCancel: () => rt(new Error("Deposit cancelled. Nothing was sent.")),
      onError: rt
    })),
    validate: I5,
    tabLock: (u) => new Promise((x) => {
      const A = navigator.locks;
      if (!(A != null && A.request)) {
        x(!0);
        return;
      }
      A.request("xtrata-ppp:" + u, { ifAvailable: !0 }, async (O) => {
        x(!!O), O && await new Promise(() => {
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
      set: (u, x) => {
        try {
          localStorage.setItem(u, x);
        } catch {
        }
      }
    },
    changed: () => Ot(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (u) => {
      var x, A;
      return a.funder(u, () => M5(u, Nr), !!((A = (x = o.snapshot().gate) == null ? void 0 : x.gifts) != null && A.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (u) => {
      const x = await i("/radio/gift/for?wallet=" + encodeURIComponent(u)), A = x == null ? void 0 : x.gift;
      if (!A) return null;
      if (typeof A.returnTo != "string" || typeof A.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: A.returnTo, from: typeof A.from == "string" ? A.from : null, source: String(A.source ?? ""), amount: String(A.amount ?? "0"), treasury: A.treasury, state: A.state === "sending" ? "sending" : "arrived", player: A.player ?? null };
    },
    history: (u, x) => U5(u, (A) => Nr(A), x),
    likesChanged: () => {
      var u, x;
      (x = (u = window.XtrataRadio) == null ? void 0 : u.refreshLikes) == null || x.call(u);
    },
    likeState: async (u, x) => {
      const A = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: u, ids: String(x) })), O = Array.isArray(A == null ? void 0 : A.rows) ? A.rows.find((rt) => (rt == null ? void 0 : rt.id) === x) : null;
      if (!O || typeof O.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: O.liked, by: Array.isArray(O.by) ? O.by.filter((rt) => typeof rt == "string") : O.liked ? [u] : [] };
    },
    likeSent: (u, x) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: u, liked: x } })),
    nameOf: (u) => S(u) ?? void 0,
    likeConfirmed: (u, x) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: u, liked: x } })),
    likeFailed: (u) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: u } }))
  }), a = Ov({
    json: i,
    main: () => {
      const u = e.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    pay: (u, x, A, O) => new Promise((rt, ft) => mh({
      recipient: x,
      amount: A.toString(),
      memo: O,
      stxAddress: u,
      network: new jc(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (le) => rt(le.txId || ""),
      onCancel: () => ft(new Error("Gift cancelled. Nothing was sent.")),
      onError: ft
    })),
    sign: (u, x) => vh({ ...x, network: "mainnet", stxAddress: u }),
    giftSent: (u, x) => o.giftSent(u, x),
    album: { bind: (u) => o.bindAlbum(u), arrived: async (u, x, A, O) => {
      c.invalidate(), await o.albumArriving(u, x, A, O);
    } },
    who: (u) => U(u),
    changed: () => Ot(o.snapshot()),
    store: {
      get: (u) => {
        try {
          return localStorage.getItem(u);
        } catch {
          return null;
        }
      },
      set: (u, x) => {
        try {
          x === null ? localStorage.removeItem(u) : localStorage.setItem(u, x);
        } catch {
        }
      }
    },
    now: Date.now
  }), c = Kv({
    json: i,
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
      set: (u, x) => {
        try {
          x === null ? localStorage.removeItem(u) : localStorage.setItem(u, x);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => Ot(o.snapshot())
  });
  window.XtrataRadioLikeHandler = (u) => {
    if (!u || !Number.isSafeInteger(u.song) || u.song < 0) return !1;
    Ht();
    const x = E(u.song, { title: u.title, artist: u.artist });
    return o.heart({ song: u.song, title: x.title || void 0, artist: x.artist || void 0, likedBy: Array.isArray(u.likedBy) ? u.likedBy : void 0 });
  };
  let f;
  window.XtrataRadioListeningIdentity = () => {
    const u = o.snapshot();
    return u.solo && u.step !== "off" && u.step !== "elsewhere" ? u.listening : void 0;
  };
  const d = (u) => {
    var A, O;
    const x = window.XtrataRadioListeningIdentity();
    x !== f && (f = x, (O = (A = window.XtrataRadio) == null ? void 0 : A.refreshLikes) == null || O.call(A));
  };
  let l = "", g = null, h = !1;
  const m = (u) => {
    var le, ee, xe, dn, vn;
    const x = window.XtrataRadio;
    if (!(x != null && x.setGiftPlayer) || !(x != null && x.setGiftStop)) return;
    const A = u.step === "off" || u.step === "elsewhere" ? null : ((le = u.gift) == null ? void 0 : le.player) ?? null, O = A ? A.id + ":" + A.tracks.map((ne) => ne.id).join(",") : "";
    O !== l && (x.setGiftPlayer(A ? { id: A.id, title: A.title, subtitle: A.subtitle, tracks: A.tracks.map((ne) => ne.id) } : null), l = O);
    const rt = A ? ((ee = u.giftStop) == null ? void 0 : ee.text) ?? null : null;
    rt !== g && (x.setGiftStop(rt), g = rt);
    const ft = !!A && !!((xe = u.albumLock) != null && xe.locked);
    ft !== h && ((dn = x.setGiftLock) == null || dn.call(x, ft), h = ft), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(u.step) && ((vn = x.forgetWallets) == null || vn.call(x));
  }, b = (u) => u ? u.slice(0, 6) + "…" + u.slice(-4) : "", C = (u) => (Number(u) / 1e6).toFixed(u < 1000n ? 6 : 4), P = (u) => {
    const x = Math.round((Date.now() - u) / 6e4);
    return x < 1 ? "now" : x < 60 ? `${x}m` : x < 1440 ? `${Math.round(x / 60)}h` : `${Math.round(x / 1440)}d`;
  }, _ = (u) => `https://explorer.hiro.so/txid/${u}?chain=mainnet`, p = (u, x = "", A = "") => {
    const O = document.createElement(u);
    return x && (O.textContent = x), A && (O.className = A), O;
  }, $ = (u, x, A = "") => {
    const O = p("button", u, A);
    return O.type = "button", O.onclick = x, O;
  }, I = (u, x) => {
    const A = p("a", u);
    return A.href = x, A.target = "_blank", A.rel = "noopener", A;
  };
  let R = null, Y = location.hash === "#give";
  Y && history.replaceState(null, "", location.pathname + location.search);
  let H = !1;
  const q = Av((u) => Ev({ address: u, network: "mainnet" }), () => Ot(o.snapshot())), S = (u) => q.get(u), k = qv(navigator.userAgent), N = (u, x) => {
    const A = navigator.userAgent, O = Xv(A), rt = `${location.origin}${location.pathname}${x ? `#gift=${x}` : ""}`, ft = [p("p", `You are in ${u}'s built-in browser, where passkeys often do not work. Open this page in ${O} to make your listening wallet${x ? " and claim your gift" : ""}.`, "ppp-warn")], le = p("div", "", "ppp-open-row"), ee = Wv(rt, A);
    if (ee) {
      const xe = p("a", `Open in ${O}`, "primary ppp-open-in");
      xe.href = ee, xe.dataset.homeAction = "radio:open-in-browser", le.append(xe);
    }
    return le.append(ti("copy-page-link", "Copy link", () => rt, ee ? "" : "primary", () => Ot(o.snapshot()))), ft.push(le, p("p", `If that does not open ${O}, use ${u}'s menu (••• or ⋮) and choose "Open in ${O === "your browser" ? "browser" : O}", or paste the copied link there.`, "ppp-mute")), ft;
  }, U = (u) => S(u) ?? b(u), Z = (u) => u.slice(0, 2).map(U).join(" and ") + (u.length > 2 ? ` and ${u.length - 2} more` : ""), G = /* @__PURE__ */ new Map();
  let ot = !1;
  const Gt = (u) => !u || /^(?:Inscription )?#\d+$/.test(u.trim()), Ht = () => {
    ot || (ot = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((u) => u.ok ? u.json() : null).then((u) => {
      for (const x of Array.isArray(u == null ? void 0 : u.tracks) ? u.tracks : []) {
        const A = Number(x == null ? void 0 : x.id);
        Number.isSafeInteger(A) && G.set(A, { title: typeof x.title == "string" ? x.title : void 0, artist: typeof x.artist == "string" ? x.artist : void 0 });
      }
      Ot(o.snapshot());
    }).catch(() => {
      ot = !1;
    }));
  }, E = (u, x) => {
    const A = G.get(u), O = $v(u, [A == null ? void 0 : A.title, x == null ? void 0 : x.title].find((ft) => !Gt(ft)) || ""), rt = vv(u, (A == null ? void 0 : A.artist) || (x == null ? void 0 : x.artist) || "");
    return { title: O, artist: rt };
  }, T = (u) => {
    const { title: x, artist: A } = E(u.song, u);
    return x ? `“${x}”${A ? ` — ${A}` : ""}` : `Song #${u.song}${A ? ` — ${A}` : ""}`;
  }, Lt = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, pt = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function ct(u) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(u.step) ? ["", ""] : u.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : u.step === "over" ? ["OVER 1 STX", "bad"] : u.step === "locked" ? ["LOCKED", "mute"] : u.step === "intro" || u.step === "link" ? ["", ""] : u.step === "fund" ? u.depositPending ? ["ON ITS WAY", "warn"] : u.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : u.payingOn && u.session && u.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function $t(u, x, A = "", O) {
    const rt = p("dt", u), ft = p("dd", x, A);
    return O && ft.append(" ", O), [rt, ft];
  }
  const Mt = document.getElementById("ppp-top"), Xt = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Yt = () => {
    var x, A;
    const u = o.snapshot();
    if (u.step === "connect" || u.step === "wrong-wallet") {
      (x = document.getElementById("radio-wallet-connect")) == null || x.click();
      return;
    }
    if (u.step === "elsewhere" && ((A = u.gate) != null && A.radioUrl)) {
      location.href = u.gate.radioUrl;
      return;
    }
    u.step === "locked" && !u.armed && !u.busy && o.unlock(), u.step === "ready" && !u.payingOn && !u.busy && o.switchOn(), Xt();
  };
  Mt && (Mt.onclick = Yt);
  function he(u) {
    if (!Mt) return;
    const x = (O, rt, ft) => {
      Mt.hidden = !1, Mt.className = "ppp-top" + (rt ? " is-" + rt : ""), Mt.replaceChildren(p("span", "", "dot"), document.createTextNode(O)), Mt.title = ft;
    }, A = u.session ? Math.min(u.session.playsLeft, u.playsLeft) : 0;
    switch (u.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Mt.hidden = !0;
        return;
      case "elsewhere":
        return x("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        Mt.hidden = !0;
        return;
      case "intro":
        return x("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "wrong-wallet":
        return x(`Connect ${U(u.linked)}`, "warn", `This device's listening wallet belongs to ${U(u.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return x(u.payingOn ? "Unlock · keep paying" : "Unlock wallet", "", "Opens the listening wallet: one tap there asks for your passkey");
      case "link":
        return x("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return u.depositPending ? x("Funds on their way", "quiet", "Paying starts by itself when they land") : x(u.entries.some((O) => O.kind === "play") ? "Out of funds · top up" : "Add funds", "warn", "Add up to 1 STX to keep paying artists");
      case "over":
        return x("Over 1 STX", "warn", "Return the excess to keep paying");
      case "loading":
        return x("Pay-per-play", "quiet", "Checking the listening wallet");
      case "ready":
        return u.payingOn && A > 0 ? x(`On · ${A.toLocaleString()} plays left`, "on", "Paying artists as you listen") : x("Paying off · switch on", "off", "Pay-per-play is switched off");
    }
  }
  const Ut = document.getElementById("pppNudge"), Ke = document.getElementById("onair");
  (dt = Ut == null ? void 0 : Ut.querySelector("button")) == null || dt.addEventListener("click", () => Yt());
  const fn = {
    elsewhere: "Listening free · artists get nothing",
    connect: "Not paying artists",
    intro: "Not paying artists",
    locked: "Locked · not paying artists",
    "wrong-wallet": "Wrong wallet connected · not paying artists",
    link: "Not paying artists yet",
    fund: "No funds yet · artists unpaid",
    over: "Paused · artists unpaid",
    ready: "Paying is off · artists get nothing"
  }, B = {
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
  function X(u) {
    var ft;
    if (u.step === "loading") return;
    const x = u.session ? Math.min(u.session.playsLeft, u.playsLeft) : 0, A = u.step === "ready" && u.payingOn && x > 0, O = A ? "" : fn[u.step] ?? "", rt = A ? "on" : O ? "off" : "";
    if (rt ? document.documentElement.dataset.ppp = rt : delete document.documentElement.dataset.ppp, Ke && (Ke.hidden = !rt, Ke.querySelector(".onair-sub").textContent = A ? `Paying artists · ${x.toLocaleString()} plays left` : "Not paying"), Ut && (Ut.hidden = rt !== "off" || u.step === "fund" && u.depositPending, rt === "off")) {
      const le = Math.floor(Number(1000000n / Or(BigInt(((ft = u.gate) == null ? void 0 : ft.limits.playFee) ?? "300"))));
      Ut.querySelector(".nudge-t").textContent = "⚠ " + O, Ut.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${le.toLocaleString()} plays, on-chain, straight to the artists.`, Ut.querySelector("button").textContent = B[u.step] ?? "Start paying";
    }
  }
  let z = "";
  function at(u) {
    const x = p("div", "", "ppp-pick");
    u.funderMultiple && u.returnToKind === "funder" && x.append(p("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), u.returnToKind === "funder" && x.append(p("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const A = p("input");
    A.type = "text", A.placeholder = "SP… address to send returns to", A.autocomplete = "off", A.spellcheck = !1, A.setAttribute("aria-label", "Address to return funds to"), A.value = z, A.oninput = () => {
      z = A.value;
    };
    const O = $(u.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(A.value), z = "";
    }, "tiny");
    return x.append(A, " ", O), u.returnToKind === "chosen" && x.append(" ", $("Back to the funder", () => o.clearReturnAddress(), "tiny")), x;
  }
  const it = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Bt() {
    const u = p("p", it + " ", "ppp-mute");
    return u.append(I("Xverse", "https://www.xverse.app/download"), " · ", I("Leather", "https://leather.io/install-extension")), u;
  }
  let bt = "";
  const Rt = (u) => {
    const x = document.documentElement, A = u.solo && !u.main ? u.listening ? b(u.listening) : "new" : "", O = K5() ? "1" : "";
    `${A}|${O}` !== bt && (bt = `${A}|${O}`, A ? x.dataset.pppSolo = A : delete x.dataset.pppSolo, O ? x.dataset.pppWalletInstalled = O : delete x.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const u of [1500, 4e3, 9e3]) setTimeout(() => Ot(o.snapshot()), u);
  function Ft(u) {
    const x = u.likeFunds;
    if (!x || !x.album || !x.low && !x.pending) return [];
    const A = p("div", "", "ppp-pick ppp-lowbox");
    if (!x.low) {
      const rt = p("p", "Top-up for your main listener wallet is on its way. ", "ppp-warn");
      return x.txid && rt.append(I("View", _(x.txid))), A.append(rt), [A];
    }
    A.append(p("p", "⚠ YOUR MAIN LISTENER WALLET IS OUT OF FUNDS", "ppp-bad ppp-lowtitle")), A.append(p("p", "It signs every like for all your albums, so they all count for you. Likes are paused until it has a little STX. 0.1 STX is hundreds of likes.")), A.append(p("p", x.address, "ppp-addr-full"));
    const O = p("div", "", "ppp-open-row");
    if (O.append(ti("copy-likes-address", "Copy address", () => x.address, "primary", () => Ot(o.snapshot()))), x.main && !u.solo) {
      const rt = ss - (x.balance ?? 0n);
      rt > 0n && O.append($(`Pay ${yn(rt)} STX from my wallet`, () => void o.topUpLikes(), "primary"));
    }
    return A.append(O), A.append(p("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [A];
  }
  function Ot(u) {
    var pn, jn, rn, $e, er, Ps, Hs, Os, Ds;
    if (d(), m(u), Rt(u), he(u), X(u), t.hidden = u.step === "off", t.hidden) return;
    const [x, A] = ct(u), O = n(".ppp-state");
    O.textContent = x, O.className = "ppp-state" + (A ? " ppp-state--" + A : ""), O.hidden = !x;
    const rt = !!u.busy || u.armed, ft = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(u.step) && (rt || !["intro", "loading"].includes(u.step));
    r.hidden = !ft, r.classList.toggle("ppp-frame--rest", !rt && !H);
    const le = n(".ppp-frame-label");
    le.hidden = !0;
    const ee = j5(u) ?? R;
    R = ee;
    const xe = R5(u, ee);
    n(".ppp-badge").hidden = !xe;
    const dn = n(".ppp-steps"), vn = n(".ppp-stage");
    dn.hidden = vn.hidden = !xe, ee && xe && (dn.replaceChildren(...Vl(u.solo).map((F, tt) => {
      const ye = p("li", "", tt < ee.at ? "done" : tt === ee.at ? ee.blocked ? "now blocked" : "now" : "");
      return ye.append(p("span", tt < ee.at ? "✓" : String(tt + 1), "n"), F), tt === ee.at && ye.setAttribute("aria-current", "step"), ye;
    })), vn.textContent = ee.caption, vn.className = "ppp-stage " + (ee.at >= Vl(u.solo).length ? "ppp-ok" : ee.blocked ? "ppp-bad" : "ppp-cyan"));
    const ne = n(".ppp-facts"), ge = [];
    u.main && ((pn = u.gate) != null && pn.here) && !u.solo && ge.push(...$t("Your wallet", U(u.main), "ppp-addr-short"));
    const en = () => {
      if (!u.listening) return;
      const F = ti("copy-listening", "Copy", () => u.listening || "", "tiny", () => Ot(o.snapshot()));
      ge.push(...$t(u.linked ? "Listening wallet (technical)" : "Listening wallet", b(u.listening), "ppp-addr-short", F));
    };
    if (u.linked || en(), u.listening && u.step !== "intro")
      if (u.linked)
        ge.push(...$t("Credited to", `${U(u.linked)} · plays, likes and returns`, u.linked === u.main || u.solo ? "ppp-ok" : "ppp-warn")), en();
      else if (u.solo) {
        u.creditedTo && ge.push(...$t("Credited to", `${U(u.creditedTo)} · plays and likes`, "ppp-ok"));
        const F = u.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : u.returnTo ? `${U(u.returnTo)} · ${u.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : u.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        ge.push(...$t("Returns go to", u.gift ? F : u.returnTo && !S(u.returnTo) ? F.replace(b(u.returnTo), u.returnTo) : F, u.returnTo && !u.gift ? "ppp-addr-full" : "ppp-mute"));
      } else ge.push(...$t("Linked to", "not linked yet", "ppp-warn"));
    if (u.linkedListening.length && ((jn = u.gate) != null && jn.here)) {
      const F = u.linkedListening.map((tt) => b(tt) + (tt === u.listening ? " (this one)" : "")).join(", ");
      ge.push(...$t(u.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", F, "ppp-addr-short"));
    }
    if (u.balance !== void 0 && ["fund", "ready", "over"].includes(u.step)) {
      const F = u.balanceState === "ok" ? "ppp-ok" : u.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      ge.push(...$t("Balance", `${yn(u.balance)} STX · about ${u.playsLeft.toLocaleString()} plays`, F));
    }
    const nn = u.entries.find((F) => F.kind === "play");
    nn && Ht(), nn && ge.push(...$t("Last paid song", `${T(nn)} → ${U(nn.recipient)}`, Lt[nn.status] || "")), ne.replaceChildren(...ge), ne.hidden = !ge.length;
    const ht = [], Dt = [], Vt = [], hn = [], Fr = Or(BigInt(((rn = u.gate) == null ? void 0 : rn.limits.playFee) ?? "300")), Li = `Each song you listen to for 30 seconds sends ${yn(Rl)} STX to whoever holds it, plus a ${yn(Fr - Rl)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, Pe = !!u.busy;
    switch (u.step) {
      case "elsewhere": {
        if (ht.push(p("p", "Pay artists as you listen.")), ($e = u.gate) != null && $e.radioUrl) {
          const tt = p("p");
          tt.append(I("Open the pay-per-play radio →", u.gate.radioUrl)), ht.push(tt);
        }
        Dt.push(p("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (u.linked) {
          const tt = [u.linked, ...u.others];
          ht.push(p("p", tt.length > 1 ? `This device has listening wallets for ${Z(tt)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${U(u.linked)}. Connect that wallet to keep paying artists.`)), Dt.push(p("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          ht.push(p("p", "Connect your wallet to pay artists as you listen.")), Dt.push(p("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        ht.push(p("p", `This device's listening wallet belongs to ${U(u.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Dt.push(p("p", `You are connected as ${U(u.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), Dt.push(p("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Vt.push($("Switch wallet", () => {
          var tt;
          return (tt = document.getElementById("radio-wallet-connect")) == null ? void 0 : tt.click();
        }, "primary"));
        break;
      case "not-invited":
        ht.push(p("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        ht.push(p("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        ht.push(p("p", `Pay artists ${yn(Fr)} STX a song as you listen.`)), Dt.push(p("p", Li)), Dt.push(p("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), Dt.push(p("p", u.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !u.solo && u.main && u.others.length ? (ht.push(p("p", `This device already has a listening wallet for ${Z(u.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Dt.push(p("p", `Otherwise, set up a new listening wallet for ${U(u.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !u.solo && u.main && Dt.push(p("p", `This is the listening wallet for ${U(u.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), u.solo && Dt.push(p("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const F = a.liveGift();
        Vt.push($(F ? "Claim my gift · no wallet needed" : u.solo ? "Turn on pay-per-play · no wallet needed" : u.others.length && u.main ? `Set up for ${U(u.main)}` : "Turn on pay-per-play", () => void o.create(), "primary")), !F && !u.solo && u.main && u.others.length && Vt.push($("Switch wallet", () => {
          var tt;
          return (tt = document.getElementById("radio-wallet-connect")) == null ? void 0 : tt.click();
        })), !F && u.solo && Vt.push($("I have a Stacks wallet", () => {
          var tt;
          return (tt = document.getElementById("radio-wallet-connect")) == null ? void 0 : tt.click();
        })), Vt.push($("I already have a listening wallet", () => void o.unlock(!0))), F && Vt.push($("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        u.armed || (ht.push(p("p", "Locked.", "ppp-mute")), Vt.push($(u.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), hn.push($("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        ht.push(p("p", `Link to ${U(u.main)} · free`)), Dt.push(p("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Dt.push(p("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Vt.push($(u.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        ht.push(p("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (u.depositPending || ((er = u.gift) != null && er.player ? ht.push(p("p", "Out of plays · add more to keep listening", "ppp-bad")) : u.entries.length ? ht.push(p("p", "Out of funds · top up to keep paying", "ppp-bad")) : ht.push(p("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / Fr)).toLocaleString()} songs`))), (Ps = u.gift) != null && Ps.player ? Dt.push(p("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : u.entries.length && Dt.push(p("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), u.payingOn && !u.entries.length && Dt.push(p("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), u.solo ? (Dt.push(p("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Dt.push(p("p", u.listening || "", "ppp-addr-full")), u.listening && !u.depositPending && Vt.push(ti("copy-address", "Copy my address", () => u.listening || "", "primary", () => Ot(o.snapshot())))) : Dt.push(p("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), u.depositPending && u.depositTxid) {
          const tt = p("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          tt.append(I("View", _(u.depositTxid))), ht.push(tt);
        } else u.allowance > 0n && !u.solo && Vt.push($(`Deposit ${yn(u.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        ht.push(p("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), u.solo && !u.returnTo && (ht.push(p("p", u.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), ht.push(at(u))), (!u.solo || u.returnTo) && Vt.push($("Return excess", () => void o.returnFunds("excess"), "primary"), $("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (u.payingOn && u.session && u.session.playsLeft > 0) {
          const tt = Math.min(u.session.playsLeft, u.playsLeft);
          ht.push(p("p", `Paying as you listen · up to ${tt.toLocaleString()} plays left`, "ppp-ok")), Dt.push(p("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), Vt.push($("Switch off", () => void o.switchOff()));
        } else
          ht.push(p("p", "Paying is off. Music stays free.", "ppp-mute")), Vt.push($("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        u.queued && ht.push(p("p", u.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${u.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), u.balanceState === "low" && ht.push(p("p", "Running low · top up", "ppp-warn")), u.depositPending ? ht.push(p("p", "Top-up on its way…", "ppp-warn")) : u.allowance > 0n && u.balanceState !== "ok" && !u.solo && Vt.push($(`Top up ${yn(u.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (u.solo && u.walletCannotSolo && Dt.push(p("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), u.solo && ["fund", "ready"].includes(u.step) && ((u.balance ?? 0n) > 0n && Dt.push(at(u)), Dt.push(Bt()), u.step === "ready" && u.entries.some((F) => F.kind === "play" && F.status === "confirmed"))) {
      const F = p("p", "New to Stacks? ", "ppp-mute");
      F.append(I("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), ht.push(F);
    }
    if (u.walletOutdated && Dt.push(p("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), u.stuck && (ht.push(p("p", u.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${u.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Vt.push($("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(u.step) && (u.returnTo || u.gift) && (u.balance ?? 0n) > 0n && hn.push($(u.linked ? "Return all to my wallet" : u.gift ? "Return what is left…" : `Return all to ${U(u.returnTo)}`, () => void o.returnFunds("all"), "quiet")), ["ready", "fund", "link", "over"].includes(u.step) && hn.push($("Lock", () => void o.lock(), "quiet")), ft && !rt && hn.push($(H ? "Hide listening wallet box" : "Show listening wallet box", () => {
      H = !H, Ot(o.snapshot());
    }, "quiet")), [...Vt, ...hn].forEach((F) => F.disabled = Pe), Pe && (Vt.length = 0), u.balance !== void 0 && ["fund", "ready", "over"].includes(u.step) && !(u.step === "fund" && u.depositPending && u.balance === 0n) && !((Hs = u.gift) != null && Hs.player)) {
      const F = u.balanceState === "ok" ? "ppp-ok" : u.balanceState === "low" ? "ppp-warn" : "ppp-bad", tt = ht.at(0);
      u.step === "ready" && tt ? tt.append(p("span", ` · ${C(u.balance)} STX`, F)) : ht.push(p("p", `Balance ${C(u.balance)} STX`, F));
    }
    if ((Os = u.gift) != null && Os.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(u.step)) {
      const F = p("p", "", "ppp-gift");
      F.append(`🎁 Gift Edition · ${u.gift.player.title}`), u.gift.player.subtitle && F.append(" · ", u.gift.player.subtitle);
      const tt = ["ready", "fund", "over"].includes(u.step) && u.balance !== void 0 ? p("span", u.giftPlays === 0 ? " · no plays left" : ` · ${u.giftPlays.toLocaleString()} ${u.giftPlays === 1 ? "play" : "plays"} left`, u.giftPlays === 0 ? "ppp-bad" : u.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      tt && F.append(tt);
      const ye = (Ds = ht.at(0)) == null ? void 0 : Ds.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (u.step === "ready" && ye && /STX/.test(ye.textContent ?? "") && ye.remove(), ht.unshift(F), u.giftPlays <= 20 && ["ready", "fund"].includes(u.step) && !u.depositPending) {
        const Ie = p("p", u.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
        Ie.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), Ie.append(I("Xverse", "https://www.xverse.app/download"), " and ", I("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), ht.splice(1, 0, Ie);
      }
    }
    if (u.gift && !u.linked && ["fund", "ready", "over"].includes(u.step) && u.returnPlan.state === "ready") {
      const F = u.returnPlan, tt = p("div", "", "ppp-pick");
      tt.append(p("p", F.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const ye = p("ul", "", "ppp-gift-list");
      F.steps.forEach((Ie, zr) => {
        const Rr = Ie.kind === "gift" ? "the unused gift" : Ie.kind === "deposit" ? "what was added to it" : "the rest", Ve = p("li");
        Ve.append(p("span", `${zr + 1}. ${yn(BigInt(Ie.send))} STX · ${Rr}`, "t"), p("span", Ie.to ? ` → ${U(Ie.to)}` : " → choose an address below", Ie.to ? "ppp-mute" : "ppp-warn")), ye.append(Ve);
      }), tt.append(ye), F.kept && tt.append(p("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), F.steps.some((Ie) => !Ie.to) && tt.append(at(u)), tt.append($(F.steps.length > 1 ? `Confirm part 1 of ${F.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), ht.push(tt);
    }
    ht.unshift(...a.banner(u)), ht.unshift(...Ft(u)), k && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(u.step)) && ht.unshift(...N(k, a.pendingCode())), u.solo && u.creditedTo && u.listening && !["intro", "off", "elsewhere", "loading"].includes(u.step) && ht.unshift(p("p", `This is ${U(u.creditedTo)}'s listening wallet. Plays and likes count for ${U(u.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...ht);
    const tr = c.render(u), Nt = document.querySelector(".ppp-shelf");
    if (Nt) {
      Nt.hidden = !tr;
      const F = Nt.querySelector("summary");
      F && (F.textContent = c.count() > 0 ? `♪ My albums (${c.count()})` : "♪ My albums");
      const tt = Nt.querySelector(".ppp-shelf-body");
      tr && tt && !tt.contains(tr) && tt.replaceChildren(tr);
    }
    const pe = a.renderFold(u);
    if (n(".ppp-gifts").hidden = !pe, pe && !n(".ppp-gift-body").contains(pe) && n(".ppp-gift-body").replaceChildren(pe), pe && Y) {
      Y = !1;
      const F = n(".ppp-gifts");
      F.open = !0, requestAnimationFrame(() => F.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...Dt), n(".ppp-actions").replaceChildren(...Vt), n(".ppp-actions2").replaceChildren(...hn);
    const He = u.busy || u.message || "";
    n(".ppp-msg").textContent = He && ht.some((F) => (F.textContent ?? "").startsWith(He.replace(/[.✓\s]+$/, ""))) ? "" : He, n(".ppp-err").textContent = u.error;
    const Us = u.entries.filter((F) => F.kind === "play");
    n(".ppp-recent").hidden = !u.entries.length, n(".ppp-recent-list").replaceChildren(...Us.slice(0, 5).map((F) => {
      const tt = p("li"), ye = F.status === "confirmed" ? "ok" : F.status === "failed" ? "bad" : "warn";
      return tt.append(p("span", "", "d " + ye), p("span", T(F), "t"), p("span", P(F.created), "ppp-mute")), F.txid && tt.append(I("tx", _(F.txid))), tt;
    })), n(".ppp-wallets").hidden = !(ne.childElementCount || hn.length), n(".ppp-more").hidden = !Dt.length;
    const jr = n(".ppp-history");
    jr.hidden = !u.entries.length, u.entries.length && Ht(), jr.replaceChildren(p("summary", `All activity (${u.entries.length})`), ...u.entries.slice(0, 20).map((F) => {
      const tt = p("div", "", "ppp-row"), ye = F.kind === "play" ? [p("span", T(F), "ppp-song"), p("span", ` · ${yn(BigInt(F.amount))} STX to ${U(F.recipient)}`, "ppp-mute")] : F.kind === "like" ? [p("span", `${F.liked ? "♥ Liked" : "Unliked"} ${T(F)}`, "ppp-song"), p("span", ` · for ${u.linked ? U(u.linked) : "this listening wallet"}`, "ppp-mute")] : [p("span", `Returned ${yn(BigInt(F.amount))} STX`, "ppp-song"), p("span", ` to ${U(F.recipient)}`, "ppp-mute")];
      return tt.append(
        p("span", pt[F.status] || F.status, "ppp-status " + (Lt[F.status] || "")),
        ...ye,
        p("span", ` · ${new Date(F.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), F.txid && tt.append(I("tx ↗", _(F.txid))), tt;
    }));
  }
  const ce = /* @__PURE__ */ new Map(), ut = () => {
    const u = window.XtrataRadio;
    return u != null && u.subscribe ? (u.subscribe((x) => {
      const A = x == null ? void 0 : x.nowPlaying;
      A && Number.isSafeInteger(Number(A.tokenId)) && ce.set(Number(A.tokenId), { title: A.title || void 0, artist: A.artist || void 0 });
    }), !0) : !1;
  };
  if (!ut()) {
    const u = setInterval(() => {
      ut() && clearInterval(u);
    }, 500);
    setTimeout(() => clearInterval(u), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (u) => {
    const x = u.detail;
    if (x && Number.isSafeInteger(x.song) && typeof x.id == "string" && /^[0-9a-f]{32}$/.test(x.id)) {
      Ht();
      const A = E(x.song, ce.get(x.song));
      o.onListened({ song: x.song, id: x.id, title: A.title || void 0, artist: A.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const Zv = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", Qv = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, Jv = () => Qv() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, t$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, e$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Ly = class {
  constructor(t) {
    P4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && nx(t), this.callback(za(t));
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
    const t = Jv(), e = t$(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return wt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, wt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), wt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, wt("div", { class: "flex flex-col space-y-[10px]" }, wt("div", { class: "flex items-center" }, wt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), wt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, wt("span", { class: "sr-only" }, "Close popup"), wt("img", { src: Zv }))), r ? wt("p", null, "Select the wallet you want to connect to.") : wt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && wt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && wt("div", { class: "mt-6" }, wt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), wt("ul", { class: "space-y-3" }, this.installedProviders.map((i) => wt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, wt("div", { class: "aspect-square basis-9 overflow-hidden" }, wt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), wt("div", { class: "flex-1" }, wt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && wt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), wt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && wt("div", { class: "mt-6" }, r ? wt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : wt("div", { class: "mb-5 flex justify-between" }, wt("p", { class: "text-sm font-medium" }, "Recommended wallets"), wt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, wt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, wt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), wt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), wt("p", null, "What is a wallet? ", wt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), wt("ul", { class: "space-y-3" }, n.map((i) => wt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, wt("div", { class: "aspect-square basis-9 overflow-hidden" }, wt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), wt("div", { class: "flex-1" }, wt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && wt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && wt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return w4(this);
  }
};
Ly.style = e$;
const n$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Ly
}, Symbol.toStringTag, { value: "Module" }));
