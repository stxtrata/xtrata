var ab = Object.defineProperty;
var cb = (e, t, n) => t in e ? ab(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var qi = (e, t, n) => cb(e, typeof t != "symbol" ? t + "" : t, n);
var xn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function mg(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function ll(e) {
  if (e.__esModule) return e;
  var t = e.default;
  if (typeof t == "function") {
    var n = function r() {
      return this instanceof r ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(r) {
    var s = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(n, r, s.get ? s : {
      enumerable: !0,
      get: function() {
        return e[r];
      }
    });
  }), n;
}
(function() {
  (function(e) {
    (function(t) {
      var n = typeof globalThis < "u" && globalThis || typeof e < "u" && e || // eslint-disable-next-line no-undef
      typeof xn < "u" && xn || {}, r = {
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
      function s(m) {
        return m && DataView.prototype.isPrototypeOf(m);
      }
      if (r.arrayBuffer)
        var o = [
          "[object Int8Array]",
          "[object Uint8Array]",
          "[object Uint8ClampedArray]",
          "[object Int16Array]",
          "[object Uint16Array]",
          "[object Int32Array]",
          "[object Uint32Array]",
          "[object Float32Array]",
          "[object Float64Array]"
        ], i = ArrayBuffer.isView || function(m) {
          return m && o.indexOf(Object.prototype.toString.call(m)) > -1;
        };
      function a(m) {
        if (typeof m != "string" && (m = String(m)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(m) || m === "")
          throw new TypeError('Invalid character in header field name: "' + m + '"');
        return m.toLowerCase();
      }
      function c(m) {
        return typeof m != "string" && (m = String(m)), m;
      }
      function p(m) {
        var E = {
          next: function() {
            var P = m.shift();
            return { done: P === void 0, value: P };
          }
        };
        return r.iterable && (E[Symbol.iterator] = function() {
          return E;
        }), E;
      }
      function g(m) {
        this.map = {}, m instanceof g ? m.forEach(function(E, P) {
          this.append(P, E);
        }, this) : Array.isArray(m) ? m.forEach(function(E) {
          if (E.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + E.length);
          this.append(E[0], E[1]);
        }, this) : m && Object.getOwnPropertyNames(m).forEach(function(E) {
          this.append(E, m[E]);
        }, this);
      }
      g.prototype.append = function(m, E) {
        m = a(m), E = c(E);
        var P = this.map[m];
        this.map[m] = P ? P + ", " + E : E;
      }, g.prototype.delete = function(m) {
        delete this.map[a(m)];
      }, g.prototype.get = function(m) {
        return m = a(m), this.has(m) ? this.map[m] : null;
      }, g.prototype.has = function(m) {
        return this.map.hasOwnProperty(a(m));
      }, g.prototype.set = function(m, E) {
        this.map[a(m)] = c(E);
      }, g.prototype.forEach = function(m, E) {
        for (var P in this.map)
          this.map.hasOwnProperty(P) && m.call(E, this.map[P], P, this);
      }, g.prototype.keys = function() {
        var m = [];
        return this.forEach(function(E, P) {
          m.push(P);
        }), p(m);
      }, g.prototype.values = function() {
        var m = [];
        return this.forEach(function(E) {
          m.push(E);
        }), p(m);
      }, g.prototype.entries = function() {
        var m = [];
        return this.forEach(function(E, P) {
          m.push([P, E]);
        }), p(m);
      }, r.iterable && (g.prototype[Symbol.iterator] = g.prototype.entries);
      function h(m) {
        if (!m._noBody) {
          if (m.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          m.bodyUsed = !0;
        }
      }
      function w(m) {
        return new Promise(function(E, P) {
          m.onload = function() {
            E(m.result);
          }, m.onerror = function() {
            P(m.error);
          };
        });
      }
      function y(m) {
        var E = new FileReader(), P = w(E);
        return E.readAsArrayBuffer(m), P;
      }
      function S(m) {
        var E = new FileReader(), P = w(E), N = /charset=([A-Za-z0-9_-]+)/.exec(m.type), V = N ? N[1] : "utf-8";
        return E.readAsText(m, V), P;
      }
      function x(m) {
        for (var E = new Uint8Array(m), P = new Array(E.length), N = 0; N < E.length; N++)
          P[N] = String.fromCharCode(E[N]);
        return P.join("");
      }
      function L(m) {
        if (m.slice)
          return m.slice(0);
        var E = new Uint8Array(m.byteLength);
        return E.set(new Uint8Array(m)), E.buffer;
      }
      function O() {
        return this.bodyUsed = !1, this._initBody = function(m) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = m, m ? typeof m == "string" ? this._bodyText = m : r.blob && Blob.prototype.isPrototypeOf(m) ? this._bodyBlob = m : r.formData && FormData.prototype.isPrototypeOf(m) ? this._bodyFormData = m : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) ? this._bodyText = m.toString() : r.arrayBuffer && r.blob && s(m) ? (this._bodyArrayBuffer = L(m.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(m) || i(m)) ? this._bodyArrayBuffer = L(m) : this._bodyText = m = Object.prototype.toString.call(m) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof m == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var m = h(this);
          if (m)
            return m;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var m = h(this);
            return m || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            ) : Promise.resolve(this._bodyArrayBuffer));
          } else {
            if (r.blob)
              return this.blob().then(y);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var m = h(this);
          if (m)
            return m;
          if (this._bodyBlob)
            return S(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(x(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(B);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var U = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function v(m) {
        var E = m.toUpperCase();
        return U.indexOf(E) > -1 ? E : m;
      }
      function T(m, E) {
        if (!(this instanceof T))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        E = E || {};
        var P = E.body;
        if (m instanceof T) {
          if (m.bodyUsed)
            throw new TypeError("Already read");
          this.url = m.url, this.credentials = m.credentials, E.headers || (this.headers = new g(m.headers)), this.method = m.method, this.mode = m.mode, this.signal = m.signal, !P && m._bodyInit != null && (P = m._bodyInit, m.bodyUsed = !0);
        } else
          this.url = String(m);
        if (this.credentials = E.credentials || this.credentials || "same-origin", (E.headers || !this.headers) && (this.headers = new g(E.headers)), this.method = v(E.method || this.method || "GET"), this.mode = E.mode || this.mode || null, this.signal = E.signal || this.signal || function() {
          if ("AbortController" in n) {
            var G = new AbortController();
            return G.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && P)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(P), (this.method === "GET" || this.method === "HEAD") && (E.cache === "no-store" || E.cache === "no-cache")) {
          var N = /([?&])_=[^&]*/;
          if (N.test(this.url))
            this.url = this.url.replace(N, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var V = /\?/;
            this.url += (V.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      T.prototype.clone = function() {
        return new T(this, { body: this._bodyInit });
      };
      function B(m) {
        var E = new FormData();
        return m.trim().split("&").forEach(function(P) {
          if (P) {
            var N = P.split("="), V = N.shift().replace(/\+/g, " "), G = N.join("=").replace(/\+/g, " ");
            E.append(decodeURIComponent(V), decodeURIComponent(G));
          }
        }), E;
      }
      function z(m) {
        var E = new g(), P = m.replace(/\r?\n[\t ]+/g, " ");
        return P.split("\r").map(function(N) {
          return N.indexOf(`
`) === 0 ? N.substr(1, N.length) : N;
        }).forEach(function(N) {
          var V = N.split(":"), G = V.shift().trim();
          if (G) {
            var ve = V.join(":").trim();
            try {
              E.append(G, ve);
            } catch (ue) {
              console.warn("Response " + ue.message);
            }
          }
        }), E;
      }
      O.call(T.prototype);
      function Q(m, E) {
        if (!(this instanceof Q))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (E || (E = {}), this.type = "default", this.status = E.status === void 0 ? 200 : E.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = E.statusText === void 0 ? "" : "" + E.statusText, this.headers = new g(E.headers), this.url = E.url || "", this._initBody(m);
      }
      O.call(Q.prototype), Q.prototype.clone = function() {
        return new Q(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new g(this.headers),
          url: this.url
        });
      }, Q.error = function() {
        var m = new Q(null, { status: 200, statusText: "" });
        return m.ok = !1, m.status = 0, m.type = "error", m;
      };
      var W = [301, 302, 303, 307, 308];
      Q.redirect = function(m, E) {
        if (W.indexOf(E) === -1)
          throw new RangeError("Invalid status code");
        return new Q(null, { status: E, headers: { location: m } });
      }, t.DOMException = n.DOMException;
      try {
        new t.DOMException();
      } catch {
        t.DOMException = function(E, P) {
          this.message = E, this.name = P;
          var N = Error(E);
          this.stack = N.stack;
        }, t.DOMException.prototype = Object.create(Error.prototype), t.DOMException.prototype.constructor = t.DOMException;
      }
      function K(m, E) {
        return new Promise(function(P, N) {
          var V = new T(m, E);
          if (V.signal && V.signal.aborted)
            return N(new t.DOMException("Aborted", "AbortError"));
          var G = new XMLHttpRequest();
          function ve() {
            G.abort();
          }
          G.onload = function() {
            var C = {
              statusText: G.statusText,
              headers: z(G.getAllResponseHeaders() || "")
            };
            V.url.indexOf("file://") === 0 && (G.status < 200 || G.status > 599) ? C.status = 200 : C.status = G.status, C.url = "responseURL" in G ? G.responseURL : C.headers.get("X-Request-URL");
            var k = "response" in G ? G.response : G.responseText;
            setTimeout(function() {
              P(new Q(k, C));
            }, 0);
          }, G.onerror = function() {
            setTimeout(function() {
              N(new TypeError("Network request failed"));
            }, 0);
          }, G.ontimeout = function() {
            setTimeout(function() {
              N(new TypeError("Network request timed out"));
            }, 0);
          }, G.onabort = function() {
            setTimeout(function() {
              N(new t.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function ue(C) {
            try {
              return C === "" && n.location.href ? n.location.href : C;
            } catch {
              return C;
            }
          }
          if (G.open(V.method, ue(V.url), !0), V.credentials === "include" ? G.withCredentials = !0 : V.credentials === "omit" && (G.withCredentials = !1), "responseType" in G && (r.blob ? G.responseType = "blob" : r.arrayBuffer && (G.responseType = "arraybuffer")), E && typeof E.headers == "object" && !(E.headers instanceof g || n.Headers && E.headers instanceof n.Headers)) {
            var Re = [];
            Object.getOwnPropertyNames(E.headers).forEach(function(C) {
              Re.push(a(C)), G.setRequestHeader(C, c(E.headers[C]));
            }), V.headers.forEach(function(C, k) {
              Re.indexOf(k) === -1 && G.setRequestHeader(k, C);
            });
          } else
            V.headers.forEach(function(C, k) {
              G.setRequestHeader(k, C);
            });
          V.signal && (V.signal.addEventListener("abort", ve), G.onreadystatechange = function() {
            G.readyState === 4 && V.signal.removeEventListener("abort", ve);
          }), G.send(typeof V._bodyInit > "u" ? null : V._bodyInit);
        });
      }
      return K.polyfill = !0, n.fetch || (n.fetch = K, n.Headers = g, n.Request = T, n.Response = Q), t.Headers = g, t.Request = T, t.Response = Q, t.fetch = K, Object.defineProperty(t, "__esModule", { value: !0 }), t;
    })({});
  })(typeof self < "u" ? self : xn);
})();
const lb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function ub(e, t) {
  const n = {};
  return Object.assign(n, lb, t), await fetch(e, n);
}
function db(e) {
  let t = ub, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function fb(...e) {
  const { fetchLib: t, middlewares: n } = db(e);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (i = await Promise.resolve(c.pre({
        fetch: t,
        ...i
      })) ?? i);
    let a = await t(i.url, i.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: t,
        url: i.url,
        init: i.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
var wi;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(wi || (wi = {}));
var go;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(go || (go = {}));
var kh;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(kh || (kh = {}));
const hb = "https://api.mainnet.hiro.so", pb = "https://api.testnet.hiro.so", gb = "http://localhost:3999", yb = ["mainnet", "testnet", "devnet", "mocknet"];
let mi = class {
  constructor(t) {
    this.version = go.Mainnet, this.chainId = wi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === go.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? fb();
  }
  getNameInfo(t) {
    const n = `${this.bnsLookupUrl}/v1/names/${t}`;
    return this.fetchFn(n).then((r) => {
      if (r.status === 404)
        throw new Error("Name not found");
      if (r.status !== 200)
        throw new Error(`Bad response status: ${r.status}`);
      return r.json();
    }).then((r) => r.address ? Object.assign({}, r, { address: r.address }) : r);
  }
};
mi.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new Tu();
    case "testnet":
      return new wb();
    case "devnet":
      return new mb();
    case "mocknet":
      return new bg();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${yb.join(", ")}`);
  }
};
mi.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : mi.fromName(e);
let Tu = class extends mi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? hb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = go.Mainnet, this.chainId = wi.Mainnet;
  }
}, wb = class extends mi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? pb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = go.Testnet, this.chainId = wi.Testnet;
  }
}, bg = class extends mi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? gb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = go.Testnet, this.chainId = wi.Testnet;
  }
};
const mb = bg, xg = "xtrata.wallet.bridge.v1", bb = (e) => typeof e == "object" && e !== null && e.protocol === xg, xb = (e) => bb(e) && e.kind === "response" && typeof e.id == "string" && e.id.length > 0 && typeof e.ok == "boolean", Sb = () => {
  const e = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
};
class Yi extends Error {
  constructor(t, n) {
    super(n), this.code = t, this.name = "BridgeClientError";
  }
}
const $h = 12e4;
class vb {
  constructor(t) {
    qi(this, "pending", /* @__PURE__ */ new Map());
    qi(this, "listenTarget");
    qi(this, "closed", !1);
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
    qi(this, "onMessage", (t) => {
      if (t.origin !== this.options.walletOrigin || t.source !== this.options.frame.contentWindow || !xb(t.data)) return;
      const n = this.pending.get(t.data.id);
      if (n)
        if (this.pending.delete(t.data.id), clearTimeout(n.timer), t.data.ok)
          n.resolve(t.data.result);
        else {
          const r = t.data.error;
          n.reject(
            new Yi("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = t, this.listenTarget = t.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(t, n) {
    if (this.closed)
      return Promise.reject(new Yi("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Yi("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = Sb(), o = { protocol: xg, kind: "request", id: s, method: t, params: n };
    return new Promise((i, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new Yi(
            "TIMEOUT",
            `Wallet did not answer "${t}" within ${this.options.timeoutMs ?? $h}ms.`
          )
        );
      }, this.options.timeoutMs ?? $h);
      this.pending.set(s, { resolve: i, reject: a, timer: c }), r.postMessage(o, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, t] of this.pending)
      clearTimeout(t.timer), t.reject(new Yi("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const Ab = ["SP", "SM"], Eb = ["ST", "SN"], kb = (e) => {
  const [t] = e.split(".");
  if (!t || t.length < 2)
    return null;
  const n = t.slice(0, 2).toUpperCase();
  return Ab.includes(n) ? "mainnet" : Eb.includes(n) ? "testnet" : null;
}, $b = () => {
  const e = /* @__PURE__ */ new Map();
  return {
    getItem: (t) => e.get(t) ?? null,
    setItem: (t, n) => {
      e.set(t, n);
    },
    removeItem: (t) => {
      e.delete(t);
    }
  };
}, Ib = () => typeof window > "u" || !window.localStorage ? $b() : window.localStorage, Vl = "xtrata.v15.1.wallet.session", Ih = "mainnet", Bc = { isConnected: !1 }, Lb = (e) => e.address ? kb(e.address) ?? e.network : e.network, Sg = (e) => !e.isConnected || !e.address ? { ...Bc } : Lb(e) !== Ih ? { ...Bc } : {
  isConnected: !0,
  address: e.address,
  network: Ih,
  ...typeof e.publicKey == "string" && /^[0-9a-f]{66}$/i.test(e.publicKey) ? { publicKey: e.publicKey } : {}
}, Cb = (e) => {
  if (!e)
    return { ...Bc };
  try {
    const t = JSON.parse(e);
    return Sg(t);
  } catch {
    return { ...Bc };
  }
}, Tb = (e) => {
  const t = Sg(e);
  return JSON.stringify(t);
}, Bb = (e) => {
  const t = Ib();
  return {
    load: () => Cb(t.getItem(Vl)),
    save: (n) => {
      t.setItem(Vl, Tb(n));
    },
    clear: () => {
      t.removeItem(Vl);
    }
  };
}, Mb = "https://browser.blockstack.org/auth", Nb = {
  "@type": "Person",
  "@context": "http://schema.org"
}, vg = ["store_write"], _b = "blockstack-session", Pb = {
  logLevel: "debug"
}, Bo = {
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
Object.freeze(Bo);
class Pi extends Error {
  constructor(t) {
    super();
    let n = t.message, r = `Error Code: ${t.code}`, s = this.stack;
    if (s)
      r += `Stack Trace:
${s}`;
    else
      try {
        throw new Error();
      } catch (o) {
        s = o.stack;
      }
    n += `
If you believe this exception is caused by a bug in stacks.js,
      please file a bug report: https://github.com/blockstack/stacks.js/issues

${r}`, this.message = n, this.code = t.code, this.parameter = t.parameter ? t.parameter : void 0;
  }
  toString() {
    return `${super.toString()}
    code: ${this.code} param: ${this.parameter ? this.parameter : "n/a"}`;
  }
}
class Ub extends Pi {
  constructor(t, n = "") {
    super({ code: Bo.MISSING_PARAMETER, message: n, parameter: t }), this.name = "MissingParametersError";
  }
}
class Lh extends Pi {
  constructor(t = "") {
    super({ code: Bo.INVALID_DID_ERROR, message: t }), this.name = "InvalidDIDError";
  }
}
class Oa extends Pi {
  constructor(t) {
    const n = `Failed to login: ${t}`;
    super({ code: Bo.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Ch extends Pi {
  constructor(t = "Unable to decrypt cipher object.") {
    super({ code: Bo.FAILED_DECRYPTION_ERROR, message: t }), this.message = t, this.name = "FailedDecryptionError";
  }
}
class Bu extends Pi {
  constructor(t) {
    super({ code: Bo.INVALID_STATE, message: t }), this.message = t, this.name = "InvalidStateError";
  }
}
class Ag extends Pi {
  constructor(t) {
    super({ code: Bo.INVALID_STATE, message: t }), this.message = t, this.name = "NoSessionDataError";
  }
}
const Th = ["debug", "info", "warn", "error", "none"], Mu = {};
for (let e = 0; e < Th.length; e++) {
  const t = Th[e];
  Mu[t] = e;
}
class li {
  static error(t) {
    this.shouldLog("error") && console.error(this.logMessage("error", t));
  }
  static warn(t) {
    this.shouldLog("warn") && console.warn(this.logMessage("warn", t));
  }
  static info(t) {
    this.shouldLog("info") && console.log(this.logMessage("info", t));
  }
  static debug(t) {
    this.shouldLog("debug") && console.log(this.logMessage("debug", t));
  }
  static logMessage(t, n) {
    return `[${t.toUpperCase()}] ${n}`;
  }
  static shouldLog(t) {
    return Mu[Pb.logLevel] <= Mu[t];
  }
}
function Hb() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Ob() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function ql(e, t) {
  (e === void 0 || e === "") && (e = "0.0.0"), (t === void 0 || e === "") && (t = "0.0.0");
  const n = e.split(".").map((s) => parseInt(s, 10)), r = t.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < t.length; s++)
    if (s >= e.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Db() {
  let e = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (e += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const n = (e + Math.random() * 16) % 16 | 0;
    return e = Math.floor(e / 16), (t === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Fb() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function jb(e, t, n) {
  return n ? `Use of '${n}' requires \`${t}\` which is unavailable on the '${e}' object within the currently executing environment.` : `\`${t}\` is unavailable on the '${e}' object within the currently executing environment.`;
}
function Od(e, { throwIfUnavailable: t, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Fb(), s) {
      const o = s[e];
      if (o)
        return o;
    }
  } catch (o) {
    li.error(`Error getting object '${e}' from global scope '${s}': ${o}`);
  }
  if (t) {
    const o = jb(s, e.toString(), n);
    throw li.error(o), new Error(o);
  }
  if (r)
    return {};
}
function Ds(e, t) {
  return Dd(dn(e), t);
}
function dn(e) {
  if (typeof e == "bigint")
    return e;
  if (typeof e == "string")
    return BigInt(e);
  if (typeof e == "number") {
    if (!Number.isInteger(e))
      throw new RangeError("Invalid value. Values of type 'number' must be an integer.");
    if (e > Number.MAX_SAFE_INTEGER)
      throw new RangeError(`Invalid value. Values of type 'number' must be less than or equal to ${Number.MAX_SAFE_INTEGER}. For larger values, try using a BigInt instead.`);
    return BigInt(e);
  }
  if (kn(e, Uint8Array))
    return BigInt(`0x${Ee(e)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Rb(e) {
  return /^0x/i.test(e) ? e.slice(2) : e;
}
function Bh(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function Ea(e, t = 8) {
  return (typeof e == "bigint" ? e : dn(e)).toString(16).padStart(t * 2, "0");
}
function ul(e) {
  return parseInt(e, 16);
}
function Dd(e, t = 16) {
  const n = Ea(e, t);
  return Ze(n);
}
function zb(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function Gb(e, t) {
  return e & BigInt(1) << t;
}
function Nu(e) {
  return Kb(BigInt(`0x${Ee(e)}`), BigInt(e.byteLength * 8));
}
function Kb(e, t) {
  return Gb(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const Vb = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Ee(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += Vb[n];
  return t;
}
function Ze(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = Rb(e), e = e.length % 2 ? `0${e}` : e;
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, s = e.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    t[n] = o;
  }
  return t;
}
function Mo(e) {
  return new TextEncoder().encode(e);
}
function ka(e) {
  return new TextDecoder().decode(e);
}
function qb(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function Yb(e) {
  return String.fromCharCode.apply(null, e);
}
function Xb(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function Mh(e) {
  if (e.some(Xb))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function Ir(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function Rt(e) {
  return Ir(...e.map((t) => typeof t == "number" ? Mh([t]) : t instanceof Array ? Mh(t) : t));
}
function kn(e, t) {
  var n, r;
  return e instanceof t || ((r = (n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === t.name;
}
const Eg = "https://api.mainnet.hiro.so", kg = "https://api.testnet.hiro.so", $g = "http://localhost:3999", Wb = "https://hub.blockstack.org", Zb = 33, Yl = 32;
function Qb(e) {
  if (e.length < Yl * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + Yl * 2), r = e.slice(2 + Yl * 2);
  return {
    recoveryId: ul(t),
    r: n,
    s: r
  };
}
function Fd(e) {
  const t = typeof e == "string" ? Ze(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function Jb(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function e1(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function t1(e, t) {
  return e[t];
}
function n1(e, t, n = 0) {
  return e[n] = t, e;
}
function r1(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function yo(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
const s1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function o1(e, t) {
  const n = {};
  return Object.assign(n, s1, t), await fetch(e, n);
}
function i1(e) {
  let t = o1, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function a1(...e) {
  const { fetchLib: t, middlewares: n } = i1(e);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (i = await Promise.resolve(c.pre({
        fetch: t,
        ...i
      })) ?? i);
    let a = await t(i.url, i.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: t,
        url: i.url,
        init: i.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
class Ig {
  constructor(t = vg.slice(), n = ((a) => (a = Od("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", o = void 0, i = Mb) {
    this.appDomain = n, this.scopes = t, this.redirectPath = r, this.manifestPath = s, this.coreNode = o, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function _u(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function c1(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Lg(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function l1(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  _u(e.outputLen), _u(e.blockLen);
}
function u1(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function d1(e, t) {
  Lg(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const oo = {
  number: _u,
  bool: c1,
  bytes: Lg,
  hash: l1,
  exists: u1,
  output: d1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Xl = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), pr = (e, t) => e << 32 - t | e >>> t, f1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!f1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function h1(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function jd(e) {
  if (typeof e == "string" && (e = h1(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Cg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function No(e) {
  const t = (r) => e().update(jd(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Tg = class extends Cg {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, oo.hash(t);
    const r = jd(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? t.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = t.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(t) {
    return oo.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    oo.exists(this), oo.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = s, t.destroyed = o, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const dl = (e, t, n) => new Tg(e, t).update(n).digest();
dl.create = (e, t) => new Tg(e, t);
function p1(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, p = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + p, a, r);
}
let Rd = class extends Cg {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Xl(this.buffer);
  }
  update(t) {
    oo.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = jd(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Xl(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    oo.exists(this), oo.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let h = i; h < s; h++)
      n[h] = 0;
    p1(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Xl(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const p = c / 4, g = this.get();
    if (p > g.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < p; h++)
      a.setUint32(4 * h, g[h], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = o, t.destroyed = i, s % n && t.buffer.set(r), t;
  }
};
const g1 = (e, t, n) => e & t ^ ~e & n, y1 = (e, t, n) => e & t ^ e & n ^ t & n, w1 = new Uint32Array([
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
]), cs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ls = new Uint32Array(64);
let Bg = class extends Rd {
  constructor() {
    super(64, 32, 8, !1), this.A = cs[0] | 0, this.B = cs[1] | 0, this.C = cs[2] | 0, this.D = cs[3] | 0, this.E = cs[4] | 0, this.F = cs[5] | 0, this.G = cs[6] | 0, this.H = cs[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      ls[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const w = ls[h - 15], y = ls[h - 2], S = pr(w, 7) ^ pr(w, 18) ^ w >>> 3, x = pr(y, 17) ^ pr(y, 19) ^ y >>> 10;
      ls[h] = x + ls[h - 7] + S + ls[h - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: p, H: g } = this;
    for (let h = 0; h < 64; h++) {
      const w = pr(a, 6) ^ pr(a, 11) ^ pr(a, 25), y = g + w + g1(a, c, p) + w1[h] + ls[h] | 0, x = (pr(r, 2) ^ pr(r, 13) ^ pr(r, 22)) + y1(r, s, o) | 0;
      g = p, p = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, p = p + this.G | 0, g = g + this.H | 0, this.set(r, s, o, i, a, c, p, g);
  }
  roundClean() {
    ls.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, m1 = class extends Bg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const bi = No(() => new Bg());
No(() => new m1());
const b1 = {}, Mg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: b1
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const qe = BigInt(0), vt = BigInt(1), _s = BigInt(2), sa = BigInt(3), Nh = BigInt(8), dt = Object.freeze({
  a: qe,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: vt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), _h = (e, t) => (e + t / _s) / t, Da = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(e) {
    const { n: t } = dt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -vt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), a = _h(o * e, t), c = _h(-r * e, t);
    let p = ae(e - a * n - c * s, t), g = ae(-a * r - c * o, t);
    const h = p > i, w = g > i;
    if (h && (p = t - p), w && (g = t - g), p > i || g > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
    return { k1neg: h, k1: p, k2neg: w, k2: g };
  }
}, cr = 32, wo = 32, Ng = 32, Mc = cr + 1, Nc = 2 * cr + 1;
function Ph(e) {
  const { a: t, b: n } = dt, r = ae(e * e), s = ae(r * e);
  return ae(s + t * e + n);
}
const Fa = dt.a === qe;
class zd extends Error {
  constructor(t) {
    super(t);
  }
}
function Uh(e) {
  if (!(e instanceof nt))
    throw new TypeError("JacobianPoint expected");
}
class nt {
  constructor(t, n, r) {
    this.x = t, this.y = n, this.z = r;
  }
  static fromAffine(t) {
    if (!(t instanceof Fe))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return t.equals(Fe.ZERO) ? nt.ZERO : new nt(t.x, t.y, vt);
  }
  static toAffineBatch(t) {
    const n = E1(t.map((r) => r.z));
    return t.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(t) {
    return nt.toAffineBatch(t).map(nt.fromAffine);
  }
  equals(t) {
    Uh(t);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = t, c = ae(s * s), p = ae(a * a), g = ae(n * p), h = ae(o * c), w = ae(ae(r * a) * p), y = ae(ae(i * s) * c);
    return g === h && w === y;
  }
  negate() {
    return new nt(this.x, ae(-this.y), this.z);
  }
  double() {
    const { x: t, y: n, z: r } = this, s = ae(t * t), o = ae(n * n), i = ae(o * o), a = t + o, c = ae(_s * (ae(a * a) - s - i)), p = ae(sa * s), g = ae(p * p), h = ae(g - _s * c), w = ae(p * (c - h) - Nh * i), y = ae(_s * n * r);
    return new nt(h, w, y);
  }
  add(t) {
    Uh(t);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = t;
    if (o === qe || i === qe)
      return this;
    if (n === qe || r === qe)
      return t;
    const c = ae(s * s), p = ae(a * a), g = ae(n * p), h = ae(o * c), w = ae(ae(r * a) * p), y = ae(ae(i * s) * c), S = ae(h - g), x = ae(y - w);
    if (S === qe)
      return x === qe ? this.double() : nt.ZERO;
    const L = ae(S * S), O = ae(S * L), U = ae(g * L), v = ae(x * x - O - _s * U), T = ae(x * (U - v) - w * O), B = ae(s * a * S);
    return new nt(v, T, B);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const n = nt.ZERO;
    if (typeof t == "bigint" && t === qe)
      return n;
    let r = Dh(t);
    if (r === vt)
      return this;
    if (!Fa) {
      let h = n, w = this;
      for (; r > qe; )
        r & vt && (h = h.add(w)), w = w.double(), r >>= vt;
      return h;
    }
    let { k1neg: s, k1: o, k2neg: i, k2: a } = Da.splitScalar(r), c = n, p = n, g = this;
    for (; o > qe || a > qe; )
      o & vt && (c = c.add(g)), a & vt && (p = p.add(g)), g = g.double(), o >>= vt, a >>= vt;
    return s && (c = c.negate()), i && (p = p.negate()), p = new nt(ae(p.x * Da.beta), p.y, p.z), c.add(p);
  }
  precomputeWindow(t) {
    const n = Fa ? 128 / t + 1 : 256 / t + 1, r = [];
    let s = this, o = s;
    for (let i = 0; i < n; i++) {
      o = s, r.push(o);
      for (let a = 1; a < 2 ** (t - 1); a++)
        o = o.add(s), r.push(o);
      s = o.double();
    }
    return r;
  }
  wNAF(t, n) {
    !n && this.equals(nt.BASE) && (n = Fe.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Pu.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = nt.normalizeZ(s), Pu.set(n, s)));
    let o = nt.ZERO, i = nt.BASE;
    const a = 1 + (Fa ? 128 / r : 256 / r), c = 2 ** (r - 1), p = BigInt(2 ** r - 1), g = 2 ** r, h = BigInt(r);
    for (let w = 0; w < a; w++) {
      const y = w * c;
      let S = Number(t & p);
      t >>= h, S > c && (S -= g, t += vt);
      const x = y, L = y + Math.abs(S) - 1, O = w % 2 !== 0, U = S < 0;
      S === 0 ? i = i.add(ja(O, s[x])) : o = o.add(ja(U, s[L]));
    }
    return { p: o, f: i };
  }
  multiply(t, n) {
    let r = Dh(t), s, o;
    if (Fa) {
      const { k1neg: i, k1: a, k2neg: c, k2: p } = Da.splitScalar(r);
      let { p: g, f: h } = this.wNAF(a, n), { p: w, f: y } = this.wNAF(p, n);
      g = ja(i, g), w = ja(c, w), w = new nt(ae(w.x * Da.beta), w.y, w.z), s = g.add(w), o = h.add(y);
    } else {
      const { p: i, f: a } = this.wNAF(r, n);
      s = i, o = a;
    }
    return nt.normalizeZ([s, o])[0];
  }
  toAffine(t) {
    const { x: n, y: r, z: s } = this, o = this.equals(nt.ZERO);
    t == null && (t = o ? Nh : Ui(s));
    const i = t, a = ae(i * i), c = ae(a * i), p = ae(n * a), g = ae(r * c), h = ae(s * i);
    if (o)
      return Fe.ZERO;
    if (h !== vt)
      throw new Error("invZ was invalid");
    return new Fe(p, g);
  }
}
nt.BASE = new nt(dt.Gx, dt.Gy, vt);
nt.ZERO = new nt(qe, vt, qe);
function ja(e, t) {
  const n = t.negate();
  return e ? n : t;
}
const Pu = /* @__PURE__ */ new WeakMap();
class Fe {
  constructor(t, n) {
    this.x = t, this.y = n;
  }
  _setWindowSize(t) {
    this._WINDOW_SIZE = t, Pu.delete(this);
  }
  hasEvenY() {
    return this.y % _s === qe;
  }
  static fromCompressedHex(t) {
    const n = t.length === 32, r = On(n ? t : t.subarray(1));
    if (!xc(r))
      throw new Error("Point is not on curve");
    const s = Ph(r);
    let o = A1(s);
    const i = (o & vt) === vt;
    n ? i && (o = ae(-o)) : (t[0] & 1) === 1 !== i && (o = ae(-o));
    const a = new Fe(r, o);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(t) {
    const n = On(t.subarray(1, cr + 1)), r = On(t.subarray(cr + 1, cr * 2 + 1)), s = new Fe(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(t) {
    const n = Lr(t), r = n.length, s = n[0];
    if (r === cr)
      return this.fromCompressedHex(n);
    if (r === Mc && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Nc && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Mc} compressed bytes or ${Nc} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(t) {
    return Fe.BASE.multiply(mo(t));
  }
  static fromSignature(t, n, r) {
    const { r: s, s: o } = Ug(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = Gd(Lr(t)), { n: a } = dt, c = r === 2 || r === 3 ? s + a : s, p = Ui(c, a), g = ae(-i * p, a), h = ae(o * p, a), w = r & 1 ? "03" : "02", y = Fe.fromHex(w + Ps(c)), S = Fe.BASE.multiplyAndAddUnsafe(y, g, h);
    if (!S)
      throw new Error("Cannot recover signature: point at infinify");
    return S.assertValidity(), S;
  }
  toRawBytes(t = !1) {
    return Us(this.toHex(t));
  }
  toHex(t = !1) {
    const n = Ps(this.x);
    return t ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Ps(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const t = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!xc(n) || !xc(r))
      throw new Error(t);
    const s = ae(r * r), o = Ph(n);
    if (ae(s - o) !== qe)
      throw new Error(t);
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  negate() {
    return new Fe(this.x, ae(-this.y));
  }
  double() {
    return nt.fromAffine(this).double().toAffine();
  }
  add(t) {
    return nt.fromAffine(this).add(nt.fromAffine(t)).toAffine();
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiply(t) {
    return nt.fromAffine(this).multiply(t, this).toAffine();
  }
  multiplyAndAddUnsafe(t, n, r) {
    const s = nt.fromAffine(this), o = n === qe || n === vt || this !== Fe.BASE ? s.multiplyUnsafe(n) : s.multiply(n), i = nt.fromAffine(t).multiplyUnsafe(r), a = o.add(i);
    return a.equals(nt.ZERO) ? void 0 : a.toAffine();
  }
}
Fe.BASE = new Fe(dt.Gx, dt.Gy);
Fe.ZERO = new Fe(qe, qe);
function Hh(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function Oh(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${xi(e)}`);
  const t = e[1], n = e.subarray(2, t + 2);
  if (!t || n.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: On(n), left: e.subarray(t + 2) };
}
function x1(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${xi(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: n } = Oh(e.subarray(2)), { data: r, left: s } = Oh(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${xi(s)}`);
  return { r: t, s: r };
}
class Hn {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromCompact(t) {
    const n = t instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof t != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? xi(t) : t;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Hn(_c(s.slice(0, 64)), _c(s.slice(64, 128)));
  }
  static fromDER(t) {
    const n = t instanceof Uint8Array;
    if (typeof t != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = x1(n ? t : Us(t));
    return new Hn(r, s);
  }
  static fromHex(t) {
    return this.fromDER(t);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!vi(t))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!vi(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const t = dt.n >> vt;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new Hn(this.r, ae(-this.s, dt.n)) : this;
  }
  toDERRawBytes() {
    return Us(this.toDERHex());
  }
  toDERHex() {
    const t = Hh(Xi(this.s)), n = Hh(Xi(this.r)), r = t.length / 2, s = n.length / 2, o = Xi(r), i = Xi(s);
    return `30${Xi(s + r + 4)}02${i}${n}02${o}${t}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Us(this.toCompactHex());
  }
  toCompactHex() {
    return Ps(this.r) + Ps(this.s);
  }
}
function Ms(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
const S1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function xi(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += S1[e[n]];
  return t;
}
const v1 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Ps(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(qe <= e && e < v1))
    throw new Error("Expected number 0 <= n < 2^256");
  return e.toString(16).padStart(64, "0");
}
function Si(e) {
  const t = Us(Ps(e));
  if (t.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return t;
}
function Xi(e) {
  const t = e.toString(16);
  return t.length & 1 ? `0${t}` : t;
}
function _c(e) {
  if (typeof e != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof e);
  return BigInt(`0x${e}`);
}
function Us(e) {
  if (typeof e != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof e);
  if (e.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + e.length);
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, s = e.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    t[n] = o;
  }
  return t;
}
function On(e) {
  return _c(xi(e));
}
function Lr(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : Us(e);
}
function Dh(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && vi(e))
    return e;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function ae(e, t = dt.P) {
  const n = e % t;
  return n >= qe ? n : t + n;
}
function zn(e, t) {
  const { P: n } = dt;
  let r = e;
  for (; t-- > qe; )
    r *= r, r %= n;
  return r;
}
function A1(e) {
  const { P: t } = dt, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), a = BigInt(88), c = e * e * e % t, p = c * c * e % t, g = zn(p, sa) * p % t, h = zn(g, sa) * p % t, w = zn(h, _s) * c % t, y = zn(w, r) * w % t, S = zn(y, s) * y % t, x = zn(S, i) * S % t, L = zn(x, a) * x % t, O = zn(L, i) * S % t, U = zn(O, sa) * p % t, v = zn(U, o) * y % t, T = zn(v, n) * c % t, B = zn(T, _s);
  if (B * B % t !== e)
    throw new Error("Cannot find square root");
  return B;
}
function Ui(e, t = dt.P) {
  if (e === qe || t <= qe)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let n = ae(e, t), r = t, s = qe, o = vt;
  for (; n !== qe; ) {
    const a = r / n, c = r % n, p = s - o * a;
    r = n, n = c, s = o, o = p;
  }
  if (r !== vt)
    throw new Error("invert: does not exist");
  return ae(s, t);
}
function E1(e, t = dt.P) {
  const n = new Array(e.length), r = e.reduce((o, i, a) => i === qe ? o : (n[a] = o, ae(o * i, t)), vt), s = Ui(r, t);
  return e.reduceRight((o, i, a) => i === qe ? o : (n[a] = ae(o * n[a], t), ae(o * i, t)), s), n;
}
function k1(e) {
  const t = e.length * 8 - wo * 8, n = On(e);
  return t > 0 ? n >> BigInt(t) : n;
}
function Gd(e, t = !1) {
  const n = k1(e);
  if (t)
    return n;
  const { n: r } = dt;
  return n >= r ? n - r : n;
}
let gi, oa;
class _g {
  constructor(t, n) {
    if (this.hashLen = t, this.qByteLen = n, typeof t != "number" || t < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(t).fill(1), this.k = new Uint8Array(t).fill(0), this.counter = 0;
  }
  hmac(...t) {
    return Pt.hmacSha256(this.k, ...t);
  }
  hmacSync(...t) {
    return oa(this.k, ...t);
  }
  checkSync() {
    if (typeof oa != "function")
      throw new zd("hmacSha256Sync needs to be set");
  }
  incr() {
    if (this.counter >= 1e3)
      throw new Error("Tried 1,000 k values for sign(), all were invalid");
    this.counter += 1;
  }
  async reseed(t = new Uint8Array()) {
    this.k = await this.hmac(this.v, Uint8Array.from([0]), t), this.v = await this.hmac(this.v), t.length !== 0 && (this.k = await this.hmac(this.v, Uint8Array.from([1]), t), this.v = await this.hmac(this.v));
  }
  reseedSync(t = new Uint8Array()) {
    this.checkSync(), this.k = this.hmacSync(this.v, Uint8Array.from([0]), t), this.v = this.hmacSync(this.v), t.length !== 0 && (this.k = this.hmacSync(this.v, Uint8Array.from([1]), t), this.v = this.hmacSync(this.v));
  }
  async generate() {
    this.incr();
    let t = 0;
    const n = [];
    for (; t < this.qByteLen; ) {
      this.v = await this.hmac(this.v);
      const r = this.v.slice();
      n.push(r), t += this.v.length;
    }
    return Ms(...n);
  }
  generateSync() {
    this.checkSync(), this.incr();
    let t = 0;
    const n = [];
    for (; t < this.qByteLen; ) {
      this.v = this.hmacSync(this.v);
      const r = this.v.slice();
      n.push(r), t += this.v.length;
    }
    return Ms(...n);
  }
}
function vi(e) {
  return qe < e && e < dt.n;
}
function xc(e) {
  return qe < e && e < dt.P;
}
function Pg(e, t, n, r = !0) {
  const { n: s } = dt, o = Gd(e, !0);
  if (!vi(o))
    return;
  const i = Ui(o, s), a = Fe.BASE.multiply(o), c = ae(a.x, s);
  if (c === qe)
    return;
  const p = ae(i * ae(t + n * c, s), s);
  if (p === qe)
    return;
  let g = new Hn(c, p), h = (a.x === g.r ? 0 : 2) | Number(a.y & vt);
  return r && g.hasHighS() && (g = g.normalizeS(), h ^= 1), { sig: g, recovery: h };
}
function mo(e) {
  let t;
  if (typeof e == "bigint")
    t = e;
  else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    t = BigInt(e);
  else if (typeof e == "string") {
    if (e.length !== 2 * wo)
      throw new Error("Expected 32 bytes of private key");
    t = _c(e);
  } else if (e instanceof Uint8Array) {
    if (e.length !== wo)
      throw new Error("Expected 32 bytes of private key");
    t = On(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!vi(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function Kd(e) {
  return e instanceof Fe ? (e.assertValidity(), e) : Fe.fromHex(e);
}
function Ug(e) {
  if (e instanceof Hn)
    return e.assertValidity(), e;
  try {
    return Hn.fromDER(e);
  } catch {
    return Hn.fromCompact(e);
  }
}
function $a(e, t = !1) {
  return Fe.fromPrivateKey(e).toRawBytes(t);
}
function $1(e, t, n, r = !1) {
  return Fe.fromSignature(e, t, n).toRawBytes(r);
}
function Fh(e) {
  const t = e instanceof Uint8Array, n = typeof e == "string", r = (t || n) && e.length;
  return t ? r === Mc || r === Nc : n ? r === Mc * 2 || r === Nc * 2 : e instanceof Fe;
}
function Vd(e, t, n = !1) {
  if (Fh(e))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Fh(t))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Kd(t);
  return r.assertValidity(), r.multiply(mo(e)).toRawBytes(n);
}
function Hg(e) {
  const t = e.length > cr ? e.slice(0, cr) : e;
  return On(t);
}
function I1(e) {
  const t = Hg(e), n = ae(t, dt.n);
  return Og(n < qe ? t : n);
}
function Og(e) {
  return Si(e);
}
function Dg(e, t, n) {
  if (e == null)
    throw new Error(`sign: expected valid message hash, not "${e}"`);
  const r = Lr(e), s = mo(t), o = [Og(s), I1(r)];
  if (n != null) {
    n === !0 && (n = Pt.randomBytes(cr));
    const c = Lr(n);
    if (c.length !== cr)
      throw new Error(`sign: Expected ${cr} bytes of extra data`);
    o.push(c);
  }
  const i = Ms(...o), a = Hg(r);
  return { seed: i, m: a, d: s };
}
function Fg(e, t) {
  const { sig: n, recovery: r } = e, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, t), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function L1(e, t, n = {}) {
  const { seed: r, m: s, d: o } = Dg(e, t, n.extraEntropy), i = new _g(Ng, wo);
  await i.reseed(r);
  let a;
  for (; !(a = Pg(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return Fg(a, n);
}
function fl(e, t, n = {}) {
  const { seed: r, m: s, d: o } = Dg(e, t, n.extraEntropy), i = new _g(Ng, wo);
  i.reseedSync(r);
  let a;
  for (; !(a = Pg(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return Fg(a, n);
}
const C1 = { strict: !0 };
function T1(e, t, n, r = C1) {
  let s;
  try {
    s = Ug(e), t = Lr(t);
  } catch {
    return !1;
  }
  const { r: o, s: i } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Gd(t);
  let c;
  try {
    c = Kd(n);
  } catch {
    return !1;
  }
  const { n: p } = dt, g = Ui(i, p), h = ae(a * g, p), w = ae(o * g, p), y = Fe.BASE.multiplyAndAddUnsafe(c, h, w);
  return y ? ae(y.x, p) === o : !1;
}
function Pc(e) {
  return ae(On(e), dt.n);
}
class Ai {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromHex(t) {
    const n = Lr(t);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = On(n.subarray(0, 32)), s = On(n.subarray(32, 64));
    return new Ai(r, s);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!xc(t) || !vi(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Ps(this.r) + Ps(this.s);
  }
  toRawBytes() {
    return Us(this.toHex());
  }
}
function B1(e) {
  return Fe.fromPrivateKey(e).toRawX();
}
class jg {
  constructor(t, n, r = Pt.randomBytes()) {
    if (t == null)
      throw new TypeError(`sign: Expected valid message, not "${t}"`);
    this.m = Lr(t);
    const { x: s, scalar: o } = this.getScalar(mo(n));
    if (this.px = s, this.d = o, this.rand = Lr(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(t) {
    const n = Fe.fromPrivateKey(t), r = n.hasEvenY() ? t : dt.n - t;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(t, n) {
    return Si(t ^ On(n));
  }
  finalizeNonce(t) {
    const n = ae(On(t), dt.n);
    if (n === qe)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: o } = this.getScalar(n);
    return { R: r, rx: s, k: o };
  }
  finalizeSig(t, n, r, s) {
    return new Ai(t.x, ae(n + r * s, dt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: t, d: n, px: r, rand: s } = this, o = Pt.taggedHash, i = this.initNonce(n, await o(Bs.aux, s)), { R: a, rx: c, k: p } = this.finalizeNonce(await o(Bs.nonce, i, r, t)), g = Pc(await o(Bs.challenge, c, r, t)), h = this.finalizeSig(a, p, g, n);
    return await Gg(h, t, r) || this.error(), h;
  }
  calcSync() {
    const { m: t, d: n, px: r, rand: s } = this, o = Pt.taggedHashSync, i = this.initNonce(n, o(Bs.aux, s)), { R: a, rx: c, k: p } = this.finalizeNonce(o(Bs.nonce, i, r, t)), g = Pc(o(Bs.challenge, c, r, t)), h = this.finalizeSig(a, p, g, n);
    return Kg(h, t, r) || this.error(), h;
  }
}
async function M1(e, t, n) {
  return new jg(e, t, n).calc();
}
function N1(e, t, n) {
  return new jg(e, t, n).calcSync();
}
function Rg(e, t, n) {
  const r = e instanceof Ai, s = r ? e : Ai.fromHex(e);
  return r && s.assertValidity(), {
    ...s,
    m: Lr(t),
    P: Kd(n)
  };
}
function zg(e, t, n, r) {
  const s = Fe.BASE.multiplyAndAddUnsafe(t, mo(n), ae(-r, dt.n));
  return !(!s || !s.hasEvenY() || s.x !== e);
}
async function Gg(e, t, n) {
  try {
    const { r, s, m: o, P: i } = Rg(e, t, n), a = Pc(await Pt.taggedHash(Bs.challenge, Si(r), i.toRawX(), o));
    return zg(r, i, s, a);
  } catch {
    return !1;
  }
}
function Kg(e, t, n) {
  try {
    const { r, s, m: o, P: i } = Rg(e, t, n), a = Pc(Pt.taggedHashSync(Bs.challenge, Si(r), i.toRawX(), o));
    return zg(r, i, s, a);
  } catch (r) {
    if (r instanceof zd)
      throw r;
    return !1;
  }
}
const _1 = {
  Signature: Ai,
  getPublicKey: B1,
  sign: M1,
  verify: Gg,
  signSync: N1,
  verifySync: Kg
};
Fe.BASE._setWindowSize(8);
const Mn = {
  node: Mg,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Bs = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Ra = {}, Pt = {
  bytesToHex: xi,
  hexToBytes: Us,
  concatBytes: Ms,
  mod: ae,
  invert: Ui,
  isValidPrivateKey(e) {
    try {
      return mo(e), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Si,
  _normalizePrivateKey: mo,
  hashToPrivateKey: (e) => {
    e = Lr(e);
    const t = wo + 8;
    if (e.length < t || e.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = ae(On(e), dt.n - vt) + vt;
    return Si(n);
  },
  randomBytes: (e = 32) => {
    if (Mn.web)
      return Mn.web.getRandomValues(new Uint8Array(e));
    if (Mn.node) {
      const { randomBytes: t } = Mn.node;
      return Uint8Array.from(t(e));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Pt.hashToPrivateKey(Pt.randomBytes(wo + 8)),
  precompute(e = 8, t = Fe.BASE) {
    const n = t === Fe.BASE ? t : new Fe(t.x, t.y);
    return n._setWindowSize(e), n.multiply(sa), n;
  },
  sha256: async (...e) => {
    if (Mn.web) {
      const t = await Mn.web.subtle.digest("SHA-256", Ms(...e));
      return new Uint8Array(t);
    } else if (Mn.node) {
      const { createHash: t } = Mn.node, n = t("sha256");
      return e.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (Mn.web) {
      const n = await Mn.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Ms(...t), s = await Mn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Mn.node) {
      const { createHmac: n } = Mn.node, r = n("sha256", e);
      return t.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (e, ...t) => {
    let n = Ra[e];
    if (n === void 0) {
      const r = await Pt.sha256(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = Ms(r, r), Ra[e] = n;
    }
    return Pt.sha256(n, ...t);
  },
  taggedHashSync: (e, ...t) => {
    if (typeof gi != "function")
      throw new zd("sha256Sync is undefined, you need to set it");
    let n = Ra[e];
    if (n === void 0) {
      const r = gi(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = Ms(r, r), Ra[e] = n;
    }
    return gi(n, ...t);
  },
  _JacobianPoint: nt
};
Object.defineProperties(Pt, {
  sha256Sync: {
    configurable: !1,
    get() {
      return gi;
    },
    set(e) {
      gi || (gi = e);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return oa;
    },
    set(e) {
      oa || (oa = e);
    }
  }
});
const P1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: dt,
  Point: Fe,
  Signature: Hn,
  getPublicKey: $a,
  getSharedSecret: Vd,
  recoverPublicKey: $1,
  schnorr: _1,
  sign: L1,
  signSync: fl,
  utils: Pt,
  verify: T1
}, Symbol.toStringTag, { value: "Module" }));
var Ia = {};
Ia.byteLength = F1;
var U1 = Ia.toByteArray = R1, H1 = Ia.fromByteArray = K1, Sr = [], qn = [], O1 = typeof Uint8Array < "u" ? Uint8Array : Array, Wl = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var ni = 0, D1 = Wl.length; ni < D1; ++ni)
  Sr[ni] = Wl[ni], qn[Wl.charCodeAt(ni)] = ni;
qn[45] = 62;
qn[95] = 63;
function Vg(e) {
  var t = e.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = e.indexOf("=");
  n === -1 && (n = t);
  var r = n === t ? 0 : 4 - n % 4;
  return [n, r];
}
function F1(e) {
  var t = Vg(e), n = t[0], r = t[1];
  return (n + r) * 3 / 4 - r;
}
function j1(e, t, n) {
  return (t + n) * 3 / 4 - n;
}
function R1(e) {
  var t, n = Vg(e), r = n[0], s = n[1], o = new O1(j1(e, r, s)), i = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    t = qn[e.charCodeAt(c)] << 18 | qn[e.charCodeAt(c + 1)] << 12 | qn[e.charCodeAt(c + 2)] << 6 | qn[e.charCodeAt(c + 3)], o[i++] = t >> 16 & 255, o[i++] = t >> 8 & 255, o[i++] = t & 255;
  return s === 2 && (t = qn[e.charCodeAt(c)] << 2 | qn[e.charCodeAt(c + 1)] >> 4, o[i++] = t & 255), s === 1 && (t = qn[e.charCodeAt(c)] << 10 | qn[e.charCodeAt(c + 1)] << 4 | qn[e.charCodeAt(c + 2)] >> 2, o[i++] = t >> 8 & 255, o[i++] = t & 255), o;
}
function z1(e) {
  return Sr[e >> 18 & 63] + Sr[e >> 12 & 63] + Sr[e >> 6 & 63] + Sr[e & 63];
}
function G1(e, t, n) {
  for (var r, s = [], o = t; o < n; o += 3)
    r = (e[o] << 16 & 16711680) + (e[o + 1] << 8 & 65280) + (e[o + 2] & 255), s.push(z1(r));
  return s.join("");
}
function K1(e) {
  for (var t, n = e.length, r = n % 3, s = [], o = 16383, i = 0, a = n - r; i < a; i += o)
    s.push(G1(e, i, i + o > a ? a : i + o));
  return r === 1 ? (t = e[n - 1], s.push(
    Sr[t >> 2] + Sr[t << 4 & 63] + "=="
  )) : r === 2 && (t = (e[n - 2] << 8) + e[n - 1], s.push(
    Sr[t >> 10] + Sr[t >> 4 & 63] + Sr[t << 2 & 63] + "="
  )), s.join("");
}
function V1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const q1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Y1() {
  if (V1())
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
    throw new Error(q1);
  }
}
class X1 {
  constructor(t, n) {
    this.createCipher = t, this.createDecipher = n;
  }
  async encrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const o = this.createCipher(t, n, r), i = new Uint8Array(Ir(o.update(s), o.final()));
    return Promise.resolve(i);
  }
  async decrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const o = this.createDecipher(t, n, r), i = new Uint8Array(Ir(o.update(s), o.final()));
    return Promise.resolve(i);
  }
}
class W1 {
  constructor(t) {
    this.subtleCrypto = t;
  }
  async encrypt(t, n, r, s) {
    let o, i;
    if (t === "aes-128-cbc")
      o = "AES-CBC", i = 128;
    else if (t === "aes-256-cbc")
      o = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: o, length: i }, !1, ["encrypt"]), c = await this.subtleCrypto.encrypt({ name: o, iv: r }, a, s);
    return new Uint8Array(c);
  }
  async decrypt(t, n, r, s) {
    let o, i;
    if (t === "aes-128-cbc")
      o = "AES-CBC", i = 128;
    else if (t === "aes-256-cbc")
      o = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: o, length: i }, !1, ["decrypt"]), c = await this.subtleCrypto.decrypt({ name: o, iv: r }, a, s);
    return new Uint8Array(c);
  }
}
async function qg() {
  const e = await Y1();
  return e.name === "subtleCrypto" ? new W1(e.lib) : new X1(e.lib.createCipheriv, e.lib.createDecipheriv);
}
function Z1(e) {
  if (e.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var t = new Uint8Array(256), n = 0; n < t.length; n++)
    t[n] = 255;
  for (var r = 0; r < e.length; r++) {
    var s = e.charAt(r), o = s.charCodeAt(0);
    if (t[o] !== 255)
      throw new TypeError(s + " is ambiguous");
    t[o] = r;
  }
  var i = e.length, a = e.charAt(0), c = Math.log(i) / Math.log(256), p = Math.log(256) / Math.log(i);
  function g(y) {
    if (y instanceof Uint8Array || (ArrayBuffer.isView(y) ? y = new Uint8Array(y.buffer, y.byteOffset, y.byteLength) : Array.isArray(y) && (y = Uint8Array.from(y))), !(y instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (y.length === 0)
      return "";
    for (var S = 0, x = 0, L = 0, O = y.length; L !== O && y[L] === 0; )
      L++, S++;
    for (var U = (O - L) * p + 1 >>> 0, v = new Uint8Array(U); L !== O; ) {
      for (var T = y[L], B = 0, z = U - 1; (T !== 0 || B < x) && z !== -1; z--, B++)
        T += 256 * v[z] >>> 0, v[z] = T % i >>> 0, T = T / i >>> 0;
      if (T !== 0)
        throw new Error("Non-zero carry");
      x = B, L++;
    }
    for (var Q = U - x; Q !== U && v[Q] === 0; )
      Q++;
    for (var W = a.repeat(S); Q < U; ++Q)
      W += e.charAt(v[Q]);
    return W;
  }
  function h(y) {
    if (typeof y != "string")
      throw new TypeError("Expected String");
    if (y.length === 0)
      return new Uint8Array();
    for (var S = 0, x = 0, L = 0; y[S] === a; )
      x++, S++;
    for (var O = (y.length - S) * c + 1 >>> 0, U = new Uint8Array(O); y[S]; ) {
      var v = y.charCodeAt(S);
      if (v > 255)
        return;
      var T = t[v];
      if (T === 255)
        return;
      for (var B = 0, z = O - 1; (T !== 0 || B < L) && z !== -1; z--, B++)
        T += i * U[z] >>> 0, U[z] = T % 256 >>> 0, T = T / 256 >>> 0;
      if (T !== 0)
        throw new Error("Non-zero carry");
      L = B, S++;
    }
    for (var Q = O - L; Q !== O && U[Q] === 0; )
      Q++;
    for (var W = new Uint8Array(x + (O - Q)), K = x; Q !== O; )
      W[K++] = U[Q++];
    return W;
  }
  function w(y) {
    var S = h(y);
    if (S)
      return S;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: g,
    decodeUnsafe: h,
    decode: w
  };
}
var Yg = Z1;
const Q1 = Yg, J1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var e2 = Q1(J1);
const t2 = /* @__PURE__ */ mg(e2), n2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Xg = Uint8Array.from({ length: 16 }, (e, t) => t), r2 = Xg.map((e) => (9 * e + 5) % 16);
let qd = [Xg], Yd = [r2];
for (let e = 0; e < 4; e++)
  for (let t of [qd, Yd])
    t.push(t[e].map((n) => n2[n]));
const Wg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), s2 = qd.map((e, t) => e.map((n) => Wg[t][n])), o2 = Yd.map((e, t) => e.map((n) => Wg[t][n])), i2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), a2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), za = (e, t) => e << t | e >>> 32 - t;
function jh(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Ga = new Uint32Array(16);
let c2 = class extends Rd {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: o } = this;
    return [t, n, r, s, o];
  }
  set(t, n, r, s, o) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Ga[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, p = this.h3 | 0, g = p, h = this.h4 | 0, w = h;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, x = i2[y], L = a2[y], O = qd[y], U = Yd[y], v = s2[y], T = o2[y];
      for (let B = 0; B < 16; B++) {
        const z = za(r + jh(y, o, a, p) + Ga[O[B]] + x, v[B]) + h | 0;
        r = h, h = p, p = za(a, 10) | 0, a = o, o = z;
      }
      for (let B = 0; B < 16; B++) {
        const z = za(s + jh(S, i, c, g) + Ga[U[B]] + L, T[B]) + w | 0;
        s = w, w = g, g = za(c, 10) | 0, c = i, i = z;
      }
    }
    this.set(this.h1 + a + g | 0, this.h2 + p + w | 0, this.h3 + h + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Ga.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const l2 = No(() => new c2());
function u2(e) {
  return l2(e);
}
const Ka = BigInt(2 ** 32 - 1), Uu = BigInt(32);
function Zg(e, t = !1) {
  return t ? { h: Number(e & Ka), l: Number(e >> Uu & Ka) } : { h: Number(e >> Uu & Ka) | 0, l: Number(e & Ka) | 0 };
}
function d2(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = Zg(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const f2 = (e, t) => BigInt(e >>> 0) << Uu | BigInt(t >>> 0), h2 = (e, t, n) => e >>> n, p2 = (e, t, n) => e << 32 - n | t >>> n, g2 = (e, t, n) => e >>> n | t << 32 - n, y2 = (e, t, n) => e << 32 - n | t >>> n, w2 = (e, t, n) => e << 64 - n | t >>> n - 32, m2 = (e, t, n) => e >>> n - 32 | t << 64 - n, b2 = (e, t) => t, x2 = (e, t) => e, S2 = (e, t, n) => e << n | t >>> 32 - n, v2 = (e, t, n) => t << n | e >>> 32 - n, A2 = (e, t, n) => t << n - 32 | e >>> 64 - n, E2 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function k2(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const $2 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), I2 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, L2 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), C2 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, T2 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), B2 = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, Ne = {
  fromBig: Zg,
  split: d2,
  toBig: f2,
  shrSH: h2,
  shrSL: p2,
  rotrSH: g2,
  rotrSL: y2,
  rotrBH: w2,
  rotrBL: m2,
  rotr32H: b2,
  rotr32L: x2,
  rotlSH: S2,
  rotlSL: v2,
  rotlBH: A2,
  rotlBL: E2,
  add: k2,
  add3L: $2,
  add3H: I2,
  add4L: L2,
  add4H: C2,
  add5H: B2,
  add5L: T2
}, [M2, N2] = Ne.split([
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
].map((e) => BigInt(e))), us = new Uint32Array(80), ds = new Uint32Array(80);
let hl = class extends Rd {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: p, El: g, Fh: h, Fl: w, Gh: y, Gl: S, Hh: x, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, p, g, h, w, y, S, x, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, p, g, h, w, y, S, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = p | 0, this.El = g | 0, this.Fh = h | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let v = 0; v < 16; v++, n += 4)
      us[v] = t.getUint32(n), ds[v] = t.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const T = us[v - 15] | 0, B = ds[v - 15] | 0, z = Ne.rotrSH(T, B, 1) ^ Ne.rotrSH(T, B, 8) ^ Ne.shrSH(T, B, 7), Q = Ne.rotrSL(T, B, 1) ^ Ne.rotrSL(T, B, 8) ^ Ne.shrSL(T, B, 7), W = us[v - 2] | 0, K = ds[v - 2] | 0, m = Ne.rotrSH(W, K, 19) ^ Ne.rotrBH(W, K, 61) ^ Ne.shrSH(W, K, 6), E = Ne.rotrSL(W, K, 19) ^ Ne.rotrBL(W, K, 61) ^ Ne.shrSL(W, K, 6), P = Ne.add4L(Q, E, ds[v - 7], ds[v - 16]), N = Ne.add4H(P, z, m, us[v - 7], us[v - 16]);
      us[v] = N | 0, ds[v] = P | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: p, Dl: g, Eh: h, El: w, Fh: y, Fl: S, Gh: x, Gl: L, Hh: O, Hl: U } = this;
    for (let v = 0; v < 80; v++) {
      const T = Ne.rotrSH(h, w, 14) ^ Ne.rotrSH(h, w, 18) ^ Ne.rotrBH(h, w, 41), B = Ne.rotrSL(h, w, 14) ^ Ne.rotrSL(h, w, 18) ^ Ne.rotrBL(h, w, 41), z = h & y ^ ~h & x, Q = w & S ^ ~w & L, W = Ne.add5L(U, B, Q, N2[v], ds[v]), K = Ne.add5H(W, O, T, z, M2[v], us[v]), m = W | 0, E = Ne.rotrSH(r, s, 28) ^ Ne.rotrBH(r, s, 34) ^ Ne.rotrBH(r, s, 39), P = Ne.rotrSL(r, s, 28) ^ Ne.rotrBL(r, s, 34) ^ Ne.rotrBL(r, s, 39), N = r & o ^ r & a ^ o & a, V = s & i ^ s & c ^ i & c;
      O = x | 0, U = L | 0, x = y | 0, L = S | 0, y = h | 0, S = w | 0, { h, l: w } = Ne.add(p | 0, g | 0, K | 0, m | 0), p = a | 0, g = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const G = Ne.add3L(m, P, V);
      r = Ne.add3H(G, K, E, N), s = G | 0;
    }
    ({ h: r, l: s } = Ne.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Ne.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = Ne.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: p, l: g } = Ne.add(this.Dh | 0, this.Dl | 0, p | 0, g | 0), { h, l: w } = Ne.add(this.Eh | 0, this.El | 0, h | 0, w | 0), { h: y, l: S } = Ne.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: x, l: L } = Ne.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: O, l: U } = Ne.add(this.Hh | 0, this.Hl | 0, O | 0, U | 0), this.set(r, s, o, i, a, c, p, g, h, w, y, S, x, L, O, U);
  }
  roundClean() {
    us.fill(0), ds.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, _2 = class extends hl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, P2 = class extends hl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, U2 = class extends hl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const H2 = No(() => new hl());
No(() => new _2());
No(() => new P2());
No(() => new U2());
function Qg(e) {
  return bi(e);
}
function O2(e) {
  return H2(e);
}
const D2 = 0;
Pt.hmacSha256Sync = (e, ...t) => {
  const n = dl.create(bi, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function F2() {
  return Ee(Pt.randomPrivateKey());
}
function j2(e) {
  const t = bi(bi(e));
  return t2.encode(Ir(e, t).slice(0, e.length + 4));
}
function R2(e, t) {
  return j2(Ir(new Uint8Array([e]), t.slice(0, 20)));
}
function Jg(e, t = D2) {
  const n = typeof e == "string" ? Ze(e) : e, r = u2(Qg(n));
  return R2(t, r);
}
function ey(e) {
  const t = Fd(e);
  return Ee($a(t.slice(0, 32), !0));
}
Pt.hmacSha256Sync = (e, ...t) => {
  const n = dl.create(bi, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
var Uc;
(function(e) {
  e.InvalidFormat = "InvalidFormat", e.IsNotPoint = "IsNotPoint";
})(Uc || (Uc = {}));
async function z2(e, t, n) {
  return await (await qg()).encrypt("aes-256-cbc", t, e, n);
}
async function G2(e, t, n) {
  return await (await qg()).decrypt("aes-256-cbc", t, e, n);
}
function ty(e, t) {
  return dl(bi, e, t);
}
function K2(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
function ny(e) {
  const t = O2(e);
  return {
    encryptionKey: t.slice(0, 32),
    hmacKey: t.slice(32)
  };
}
function V2(e) {
  return e.match(/^[0-9a-f]+$/i) !== null;
}
function q2(e) {
  const t = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Uc.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Uc.IsNotPoint
  };
  if (e.length !== 66 && e.length !== 130)
    return t;
  const r = e.slice(0, 2);
  if (e.length === 130 && r !== "04" || e.length === 66 && r !== "02" && r !== "03" || !V2(e))
    return t;
  try {
    return Fe.fromHex(e).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function Y2(e, t, n, r) {
  const s = q2(e);
  if (!s.result)
    throw s;
  const o = Pt.randomPrivateKey(), i = $a(o, !0);
  let a = Vd(o, e, !0);
  a = a.slice(1);
  const c = ny(a), p = Pt.randomBytes(16), g = await z2(p, c.encryptionKey, t), h = Ir(p, i, g), w = ty(c.hmacKey, h);
  let y;
  if (!r || r === "hex")
    y = Ee(g);
  else if (r === "base64")
    y = H1(g);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const S = {
    iv: Ee(p),
    ephemeralPK: Ee(i),
    cipherText: y,
    mac: Ee(w),
    wasString: n
  };
  return r && r !== "hex" && (S.cipherTextEncoding = r), S;
}
async function ry(e, t) {
  if (!t.ephemeralPK)
    throw new Ch("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = t.ephemeralPK;
  let r = Vd(e, n, !0);
  r = r.slice(1);
  const s = ny(r), o = Ze(t.iv);
  let i;
  if (!t.cipherTextEncoding || t.cipherTextEncoding === "hex")
    i = Ze(t.cipherText);
  else if (t.cipherTextEncoding === "base64")
    i = U1(t.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${t.cipherText}"`);
  const a = Ir(o, Ze(n), i), c = ty(s.hmacKey, a), p = Ze(t.mac);
  if (!K2(p, c))
    throw new Ch("Decryption failed: failure in MAC check");
  const g = await G2(o, s.encryptionKey, i);
  return t.wasString ? ka(g) : g;
}
function X2(e, t) {
  const n = typeof t == "string" ? Mo(t) : t, r = ey(e), s = Qg(n), o = fl(s, e);
  return {
    signature: Ee(o),
    publicKey: r
  };
}
async function W2(e, t) {
  const n = Object.assign({}, t);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = ey(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof e == "string", o = typeof e == "string" ? Mo(e) : e, i = await Y2(n.publicKey, o, s, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = X2(r, a), p = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(p);
  }
  return a;
}
function Z2(e, t) {
  const n = Object.assign({}, t);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(e);
    return ry(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var rn = {}, Ei = {}, mn = {};
Object.defineProperty(mn, "__esModule", { value: !0 });
mn.decode = mn.encode = mn.unescape = mn.escape = mn.pad = void 0;
const sy = Ia;
function Xd(e) {
  return `${e}${"=".repeat(4 - (e.length % 4 || 4))}`;
}
mn.pad = Xd;
function oy(e) {
  return e.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
mn.escape = oy;
function iy(e) {
  return Xd(e).replace(/-/g, "+").replace(/_/g, "/");
}
mn.unescape = iy;
function Q2(e) {
  return oy((0, sy.fromByteArray)(new TextEncoder().encode(e)));
}
mn.encode = Q2;
function J2(e) {
  return new TextDecoder().decode((0, sy.toByteArray)(Xd(iy(e))));
}
mn.decode = J2;
var pl = {}, gl = {}, ay = {}, cy = {}, yl = {};
Object.defineProperty(yl, "__esModule", { value: !0 });
yl.crypto = void 0;
yl.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = n, e.anumber = r, e.abytes = s, e.ahash = o, e.aexists = i, e.aoutput = a, e.u8 = c, e.u32 = p, e.clean = g, e.createView = h, e.rotr = w, e.rotl = y, e.byteSwap = S, e.byteSwap32 = x, e.bytesToHex = U, e.hexToBytes = B, e.asyncLoop = Q, e.utf8ToBytes = W, e.bytesToUtf8 = K, e.toBytes = m, e.kdfInputToBytes = E, e.concatBytes = P, e.checkOpts = N, e.createHasher = G, e.createOptHasher = ve, e.createXOFer = ue, e.randomBytes = Re;
  const t = yl;
  function n(C) {
    return C instanceof Uint8Array || ArrayBuffer.isView(C) && C.constructor.name === "Uint8Array";
  }
  function r(C) {
    if (!Number.isSafeInteger(C) || C < 0)
      throw new Error("positive integer expected, got " + C);
  }
  function s(C, ...k) {
    if (!n(C))
      throw new Error("Uint8Array expected");
    if (k.length > 0 && !k.includes(C.length))
      throw new Error("Uint8Array expected of length " + k + ", got length=" + C.length);
  }
  function o(C) {
    if (typeof C != "function" || typeof C.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(C.outputLen), r(C.blockLen);
  }
  function i(C, k = !0) {
    if (C.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (k && C.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(C, k) {
    s(C);
    const H = k.outputLen;
    if (C.length < H)
      throw new Error("digestInto() expects output buffer of length at least " + H);
  }
  function c(C) {
    return new Uint8Array(C.buffer, C.byteOffset, C.byteLength);
  }
  function p(C) {
    return new Uint32Array(C.buffer, C.byteOffset, Math.floor(C.byteLength / 4));
  }
  function g(...C) {
    for (let k = 0; k < C.length; k++)
      C[k].fill(0);
  }
  function h(C) {
    return new DataView(C.buffer, C.byteOffset, C.byteLength);
  }
  function w(C, k) {
    return C << 32 - k | C >>> k;
  }
  function y(C, k) {
    return C << k | C >>> 32 - k >>> 0;
  }
  e.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function S(C) {
    return C << 24 & 4278190080 | C << 8 & 16711680 | C >>> 8 & 65280 | C >>> 24 & 255;
  }
  e.swap8IfBE = e.isLE ? (C) => C : (C) => S(C), e.byteSwapIfBE = e.swap8IfBE;
  function x(C) {
    for (let k = 0; k < C.length; k++)
      C[k] = S(C[k]);
    return C;
  }
  e.swap32IfBE = e.isLE ? (C) => C : x;
  const L = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", O = /* @__PURE__ */ Array.from({ length: 256 }, (C, k) => k.toString(16).padStart(2, "0"));
  function U(C) {
    if (s(C), L)
      return C.toHex();
    let k = "";
    for (let H = 0; H < C.length; H++)
      k += O[C[H]];
    return k;
  }
  const v = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function T(C) {
    if (C >= v._0 && C <= v._9)
      return C - v._0;
    if (C >= v.A && C <= v.F)
      return C - (v.A - 10);
    if (C >= v.a && C <= v.f)
      return C - (v.a - 10);
  }
  function B(C) {
    if (typeof C != "string")
      throw new Error("hex string expected, got " + typeof C);
    if (L)
      return Uint8Array.fromHex(C);
    const k = C.length, H = k / 2;
    if (k % 2)
      throw new Error("hex string expected, got unpadded hex of length " + k);
    const ne = new Uint8Array(H);
    for (let J = 0, re = 0; J < H; J++, re += 2) {
      const Ce = T(C.charCodeAt(re)), de = T(C.charCodeAt(re + 1));
      if (Ce === void 0 || de === void 0) {
        const me = C[re] + C[re + 1];
        throw new Error('hex string expected, got non-hex character "' + me + '" at index ' + re);
      }
      ne[J] = Ce * 16 + de;
    }
    return ne;
  }
  const z = async () => {
  };
  e.nextTick = z;
  async function Q(C, k, H) {
    let ne = Date.now();
    for (let J = 0; J < C; J++) {
      H(J);
      const re = Date.now() - ne;
      re >= 0 && re < k || (await (0, e.nextTick)(), ne += re);
    }
  }
  function W(C) {
    if (typeof C != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(C));
  }
  function K(C) {
    return new TextDecoder().decode(C);
  }
  function m(C) {
    return typeof C == "string" && (C = W(C)), s(C), C;
  }
  function E(C) {
    return typeof C == "string" && (C = W(C)), s(C), C;
  }
  function P(...C) {
    let k = 0;
    for (let ne = 0; ne < C.length; ne++) {
      const J = C[ne];
      s(J), k += J.length;
    }
    const H = new Uint8Array(k);
    for (let ne = 0, J = 0; ne < C.length; ne++) {
      const re = C[ne];
      H.set(re, J), J += re.length;
    }
    return H;
  }
  function N(C, k) {
    if (k !== void 0 && {}.toString.call(k) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(C, k);
  }
  class V {
  }
  e.Hash = V;
  function G(C) {
    const k = (ne) => C().update(m(ne)).digest(), H = C();
    return k.outputLen = H.outputLen, k.blockLen = H.blockLen, k.create = () => C(), k;
  }
  function ve(C) {
    const k = (ne, J) => C(J).update(m(ne)).digest(), H = C({});
    return k.outputLen = H.outputLen, k.blockLen = H.blockLen, k.create = (ne) => C(ne), k;
  }
  function ue(C) {
    const k = (ne, J) => C(J).update(m(ne)).digest(), H = C({});
    return k.outputLen = H.outputLen, k.blockLen = H.blockLen, k.create = (ne) => C(ne), k;
  }
  e.wrapConstructor = G, e.wrapConstructorWithOpts = ve, e.wrapXOFConstructorWithOpts = ue;
  function Re(C = 32) {
    if (t.crypto && typeof t.crypto.getRandomValues == "function")
      return t.crypto.getRandomValues(new Uint8Array(C));
    if (t.crypto && typeof t.crypto.randomBytes == "function")
      return Uint8Array.from(t.crypto.randomBytes(C));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(cy);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.hmac = e.HMAC = void 0;
  const t = cy;
  class n extends t.Hash {
    constructor(o, i) {
      super(), this.finished = !1, this.destroyed = !1, (0, t.ahash)(o);
      const a = (0, t.toBytes)(i);
      if (this.iHash = o.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, p = new Uint8Array(c);
      p.set(a.length > c ? o.create().update(a).digest() : a);
      for (let g = 0; g < p.length; g++)
        p[g] ^= 54;
      this.iHash.update(p), this.oHash = o.create();
      for (let g = 0; g < p.length; g++)
        p[g] ^= 106;
      this.oHash.update(p), (0, t.clean)(p);
    }
    update(o) {
      return (0, t.aexists)(this), this.iHash.update(o), this;
    }
    digestInto(o) {
      (0, t.aexists)(this), (0, t.abytes)(o, this.outputLen), this.finished = !0, this.iHash.digestInto(o), this.oHash.update(o), this.oHash.digestInto(o), this.destroy();
    }
    digest() {
      const o = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(o), o;
    }
    _cloneInto(o) {
      o || (o = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: i, iHash: a, finished: c, destroyed: p, blockLen: g, outputLen: h } = this;
      return o = o, o.finished = c, o.destroyed = p, o.blockLen = g, o.outputLen = h, o.oHash = i._cloneInto(o.oHash), o.iHash = a._cloneInto(o.iHash), o;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  e.HMAC = n;
  const r = (s, o, i) => new n(s, o).update(i).digest();
  e.hmac = r, e.hmac.create = (s, o) => new n(s, o);
})(ay);
const ri = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function ly(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Hu(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function _o(e, ...t) {
  if (!ly(e))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length))
    throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function ex(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Hu(e.outputLen), Hu(e.blockLen);
}
function Ou(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function uy(e, t) {
  _o(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function tx(e) {
  return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
function nx(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function Hc(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function Sc(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function er(e, t) {
  return e << 32 - t | e >>> t;
}
function rx(e, t) {
  return e << t | e >>> 32 - t >>> 0;
}
const Wd = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Zd(e) {
  return e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
}
const dy = Wd ? (e) => e : (e) => Zd(e), sx = dy;
function fy(e) {
  for (let t = 0; t < e.length; t++)
    e[t] = Zd(e[t]);
  return e;
}
const ox = Wd ? (e) => e : fy, hy = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", ix = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Qd(e) {
  if (_o(e), hy)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += ix[e[n]];
  return t;
}
const Hr = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Rh(e) {
  if (e >= Hr._0 && e <= Hr._9)
    return e - Hr._0;
  if (e >= Hr.A && e <= Hr.F)
    return e - (Hr.A - 10);
  if (e >= Hr.a && e <= Hr.f)
    return e - (Hr.a - 10);
}
function ax(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (hy)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let s = 0, o = 0; s < n; s++, o += 2) {
    const i = Rh(e.charCodeAt(o)), a = Rh(e.charCodeAt(o + 1));
    if (i === void 0 || a === void 0) {
      const c = e[o] + e[o + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + o);
    }
    r[s] = i * 16 + a;
  }
  return r;
}
const py = async () => {
};
async function cx(e, t, n) {
  let r = Date.now();
  for (let s = 0; s < e; s++) {
    n(s);
    const o = Date.now() - r;
    o >= 0 && o < t || (await py(), r += o);
  }
}
function Jd(e) {
  if (typeof e != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function lx(e) {
  return new TextDecoder().decode(e);
}
function La(e) {
  return typeof e == "string" && (e = Jd(e)), _o(e), e;
}
function ux(e) {
  return typeof e == "string" && (e = Jd(e)), _o(e), e;
}
function dx(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const s = e[r];
    _o(s), t += s.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function fx(e, t) {
  if (t !== void 0 && {}.toString.call(t) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(e, t);
}
let gy = class {
};
function wl(e) {
  const t = (r) => e().update(La(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function yy(e) {
  const t = (r, s) => e(s).update(La(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
function wy(e) {
  const t = (r, s) => e(s).update(La(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
const hx = wl, px = yy, gx = wy;
function yx(e = 32) {
  if (ri && typeof ri.getRandomValues == "function")
    return ri.getRandomValues(new Uint8Array(e));
  if (ri && typeof ri.randomBytes == "function")
    return Uint8Array.from(ri.randomBytes(e));
  throw new Error("crypto.getRandomValues must be defined");
}
const wx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: gy,
  abytes: _o,
  aexists: Ou,
  ahash: ex,
  anumber: Hu,
  aoutput: uy,
  asyncLoop: cx,
  byteSwap: Zd,
  byteSwap32: fy,
  byteSwapIfBE: sx,
  bytesToHex: Qd,
  bytesToUtf8: lx,
  checkOpts: fx,
  clean: Hc,
  concatBytes: dx,
  createHasher: wl,
  createOptHasher: yy,
  createView: Sc,
  createXOFer: wy,
  hexToBytes: ax,
  isBytes: ly,
  isLE: Wd,
  kdfInputToBytes: ux,
  nextTick: py,
  randomBytes: yx,
  rotl: rx,
  rotr: er,
  swap32IfBE: ox,
  swap8IfBE: dy,
  toBytes: La,
  u32: nx,
  u8: tx,
  utf8ToBytes: Jd,
  wrapConstructor: hx,
  wrapConstructorWithOpts: px,
  wrapXOFConstructorWithOpts: gx
}, Symbol.toStringTag, { value: "Module" }));
function mx(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, p = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + p, a, r);
}
function bx(e, t, n) {
  return e & t ^ ~e & n;
}
function xx(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class Sx extends gy {
  constructor(t, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(t), this.view = Sc(this.buffer);
  }
  update(t) {
    Ou(this), t = La(t), _o(t);
    const { view: n, buffer: r, blockLen: s } = this, o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Sc(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Ou(this), uy(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, Hc(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let h = i; h < s; h++)
      n[h] = 0;
    mx(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Sc(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const p = c / 4, g = this.get();
    if (p > g.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < p; h++)
      a.setUint32(4 * h, g[h], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.destroyed = i, t.finished = o, t.length = s, t.pos = a, s % n && t.buffer.set(r), t;
  }
  clone() {
    return this._cloneInto();
  }
}
const fs = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), hs = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), vx = /* @__PURE__ */ Uint32Array.from([
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
]), ps = /* @__PURE__ */ new Uint32Array(64);
let ef = class extends Sx {
  constructor(t = 32) {
    super(64, t, 8, !1), this.A = fs[0] | 0, this.B = fs[1] | 0, this.C = fs[2] | 0, this.D = fs[3] | 0, this.E = fs[4] | 0, this.F = fs[5] | 0, this.G = fs[6] | 0, this.H = fs[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      ps[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const w = ps[h - 15], y = ps[h - 2], S = er(w, 7) ^ er(w, 18) ^ w >>> 3, x = er(y, 17) ^ er(y, 19) ^ y >>> 10;
      ps[h] = x + ps[h - 7] + S + ps[h - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: p, H: g } = this;
    for (let h = 0; h < 64; h++) {
      const w = er(a, 6) ^ er(a, 11) ^ er(a, 25), y = g + w + bx(a, c, p) + vx[h] + ps[h] | 0, x = (er(r, 2) ^ er(r, 13) ^ er(r, 22)) + xx(r, s, o) | 0;
      g = p, p = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, p = p + this.G | 0, g = g + this.H | 0, this.set(r, s, o, i, a, c, p, g);
  }
  roundClean() {
    Hc(ps);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Hc(this.buffer);
  }
}, my = class extends ef {
  constructor() {
    super(28), this.A = hs[0] | 0, this.B = hs[1] | 0, this.C = hs[2] | 0, this.D = hs[3] | 0, this.E = hs[4] | 0, this.F = hs[5] | 0, this.G = hs[6] | 0, this.H = hs[7] | 0;
  }
};
const Ax = /* @__PURE__ */ wl(() => new ef()), Ex = /* @__PURE__ */ wl(() => new my()), kx = ef, tf = Ax, $x = my, Ix = Ex, Lx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: $x,
  SHA256: kx,
  sha224: Ix,
  sha256: tf
}, Symbol.toStringTag, { value: "Module" })), ml = /* @__PURE__ */ ll(Lx), Cx = /* @__PURE__ */ ll(P1);
var ki = {};
Object.defineProperty(ki, "__esModule", { value: !0 });
ki.joseToDer = ki.derToJose = void 0;
const by = Ia, xy = mn;
function Zl(e) {
  return (e / 8 | 0) + (e % 8 === 0 ? 0 : 1);
}
const Tx = {
  ES256: Zl(256),
  ES384: Zl(384),
  ES512: Zl(521)
};
function Sy(e) {
  const t = Tx[e];
  if (t)
    return t;
  throw new Error(`Unknown algorithm "${e}"`);
}
const Oc = 128, vy = 0, Bx = 32, Mx = 16, Nx = 2, Ay = Mx | Bx | vy << 6, Dc = Nx | vy << 6;
function Ey(e) {
  if (e instanceof Uint8Array)
    return e;
  if (typeof e == "string")
    return (0, by.toByteArray)((0, xy.pad)(e));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function _x(e, t) {
  const n = Ey(e), r = Sy(t), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== Ay)
    throw new Error('Could not find expected "seq"');
  let a = n[i++];
  if (a === (Oc | 1) && (a = n[i++]), o - i < a)
    throw new Error(`"seq" specified length of "${a}", only "${o - i}" remaining`);
  if (n[i++] !== Dc)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[i++];
  if (o - i - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${o - i - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const p = i;
  if (i += c, n[i++] !== Dc)
    throw new Error('Could not find expected "int" for "s"');
  const g = n[i++];
  if (o - i !== g)
    throw new Error(`"s" specified length of "${g}", expected "${o - i}"`);
  if (s < g)
    throw new Error(`"s" specified length of "${g}", max of "${s}" is acceptable`);
  const h = i;
  if (i += g, i !== o)
    throw new Error(`Expected to consume entire array, but "${o - i}" bytes remain`);
  const w = r - c, y = r - g, S = new Uint8Array(w + c + y + g);
  for (i = 0; i < w; ++i)
    S[i] = 0;
  S.set(n.subarray(p + Math.max(-w, 0), p + c), i), i = r;
  for (const x = i; i < x + y; ++i)
    S[i] = 0;
  return S.set(n.subarray(h + Math.max(-y, 0), h + g), i), (0, xy.escape)((0, by.fromByteArray)(S));
}
ki.derToJose = _x;
function zh(e, t, n) {
  let r = 0;
  for (; t + r < n && e[t + r] === 0; )
    ++r;
  return e[t + r] >= Oc && --r, r;
}
function Px(e, t) {
  e = Ey(e);
  const n = Sy(t), r = e.length;
  if (r !== n * 2)
    throw new TypeError(`"${t}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = zh(e, 0, n), o = zh(e, n, e.length), i = n - s, a = n - o, c = 2 + i + 1 + 1 + a, p = c < Oc, g = new Uint8Array((p ? 2 : 3) + c);
  let h = 0;
  return g[h++] = Ay, p ? g[h++] = c : (g[h++] = Oc | 1, g[h++] = c & 255), g[h++] = Dc, g[h++] = i, s < 0 ? (g[h++] = 0, g.set(e.subarray(0, n), h), h += n) : (g.set(e.subarray(s, n), h), h += n - s), g[h++] = Dc, g[h++] = a, o < 0 ? (g[h++] = 0, g.set(e.subarray(n), h)) : g.set(e.subarray(n + o), h), g;
}
ki.joseToDer = Px;
var qr = {};
Object.defineProperty(qr, "__esModule", { value: !0 });
qr.InvalidTokenError = qr.MissingParametersError = void 0;
class Ux extends Error {
  constructor(t) {
    super(), this.name = "MissingParametersError", this.message = t || "";
  }
}
qr.MissingParametersError = Ux;
class Hx extends Error {
  constructor(t) {
    super(), this.name = "InvalidTokenError", this.message = t || "";
  }
}
qr.InvalidTokenError = Hx;
const Ca = /* @__PURE__ */ ll(wx);
Object.defineProperty(gl, "__esModule", { value: !0 });
gl.SECP256K1Client = void 0;
const Ox = ay, Dx = ml, vc = Cx, Gh = ki, Kh = qr, Vh = Ca;
vc.utils.hmacSha256Sync = (e, ...t) => {
  const n = Ox.hmac.create(Dx.sha256, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
class ky {
  static derivePublicKey(t, n = !0) {
    return t.length === 66 && (t = t.slice(0, 64)), t.length < 64 && (t = t.padStart(64, "0")), (0, Vh.bytesToHex)(vc.getPublicKey(t, n));
  }
  static signHash(t, n, r = "jose") {
    if (!t || !n)
      throw new Kh.MissingParametersError("a signing input hash and private key are all required");
    const s = vc.signSync(t, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Vh.bytesToHex)(s);
    if (r === "jose")
      return (0, Gh.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(t) {
    return (0, Gh.joseToDer)(t, "ES256");
  }
  static verifyHash(t, n, r) {
    if (!t || !n || !r)
      throw new Kh.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return vc.verify(n, t, r, { strict: !1 });
  }
}
gl.SECP256K1Client = ky;
ky.algorithmName = "ES256K";
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.cryptoClients = e.SECP256K1Client = void 0;
  const t = gl;
  Object.defineProperty(e, "SECP256K1Client", { enumerable: !0, get: function() {
    return t.SECP256K1Client;
  } });
  const n = {
    ES256K: t.SECP256K1Client
  };
  e.cryptoClients = n;
})(pl);
var bo = {};
const Fx = /* @__PURE__ */ ll(Mg);
var jx = xn && xn.__awaiter || function(e, t, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function a(g) {
      try {
        p(r.next(g));
      } catch (h) {
        i(h);
      }
    }
    function c(g) {
      try {
        p(r.throw(g));
      } catch (h) {
        i(h);
      }
    }
    function p(g) {
      g.done ? o(g.value) : s(g.value).then(a, c);
    }
    p((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(bo, "__esModule", { value: !0 });
bo.hashSha256Async = bo.hashSha256 = void 0;
const Rx = ml;
function $y(e) {
  return (0, Rx.sha256)(e);
}
bo.hashSha256 = $y;
function zx(e) {
  return jx(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof e == "string" ? new TextEncoder().encode(e) : e, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Fx;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(e).digest());
      }
    } catch (t) {
      return console.log(t), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve($y(e));
    }
  });
}
bo.hashSha256Async = zx;
var Gx = xn && xn.__awaiter || function(e, t, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function a(g) {
      try {
        p(r.next(g));
      } catch (h) {
        i(h);
      }
    }
    function c(g) {
      try {
        p(r.throw(g));
      } catch (h) {
        i(h);
      }
    }
    function p(g) {
      g.done ? o(g.value) : s(g.value).then(a, c);
    }
    p((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(Ei, "__esModule", { value: !0 });
Ei.TokenSigner = Ei.createUnsecuredToken = void 0;
const Du = mn, qh = pl, Kx = qr, Yh = bo;
function Fu(e, t) {
  const n = [], r = Du.encode(JSON.stringify(t));
  n.push(r);
  const s = Du.encode(JSON.stringify(e));
  return n.push(s), n.join(".");
}
function Vx(e) {
  return Fu(e, { typ: "JWT", alg: "none" }) + ".";
}
Ei.createUnsecuredToken = Vx;
class qx {
  constructor(t, n) {
    if (!(t && n))
      throw new Kx.MissingParametersError("a signing algorithm and private key are required");
    if (typeof t != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (t = t.toUpperCase(), !qh.cryptoClients.hasOwnProperty(t))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = qh.cryptoClients[t], this.rawPrivateKey = n;
  }
  header(t = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, t);
  }
  sign(t, n = !1, r = {}) {
    const s = this.header(r), o = Fu(t, s), i = (0, Yh.hashSha256)(o);
    return this.createWithSignedHash(t, n, s, o, i);
  }
  signAsync(t, n = !1, r = {}) {
    return Gx(this, void 0, void 0, function* () {
      const s = this.header(r), o = Fu(t, s), i = yield (0, Yh.hashSha256Async)(o);
      return this.createWithSignedHash(t, n, s, o, i);
    });
  }
  createWithSignedHash(t, n, r, s, o) {
    const i = this.cryptoClient.signHash(o, this.rawPrivateKey);
    return n ? {
      header: [Du.encode(JSON.stringify(r))],
      payload: JSON.stringify(t),
      signature: [i]
    } : [s, i].join(".");
  }
}
Ei.TokenSigner = qx;
var bl = {};
Object.defineProperty(bl, "__esModule", { value: !0 });
bl.TokenVerifier = void 0;
const Yx = mn, Xh = pl, Xx = qr, Va = bo;
class Wx {
  constructor(t, n) {
    if (!(t && n))
      throw new Xx.MissingParametersError("a signing algorithm and public key are required");
    if (typeof t != "string")
      throw "signing algorithm parameter must be a string";
    if (t = t.toUpperCase(), !Xh.cryptoClients.hasOwnProperty(t))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Xh.cryptoClients[t], this.rawPublicKey = n;
  }
  verify(t) {
    return typeof t == "string" ? this.verifyCompact(t, !1) : typeof t == "object" ? this.verifyExpanded(t, !1) : !1;
  }
  verifyAsync(t) {
    return typeof t == "string" ? this.verifyCompact(t, !0) : typeof t == "object" ? this.verifyExpanded(t, !0) : Promise.resolve(!1);
  }
  verifyCompact(t, n) {
    const r = t.split("."), s = r[0] + "." + r[1], o = (i) => {
      const a = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(i, a, this.rawPublicKey);
    };
    if (n)
      return (0, Va.hashSha256Async)(s).then((i) => o(i));
    {
      const i = (0, Va.hashSha256)(s);
      return o(i);
    }
  }
  verifyExpanded(t, n) {
    const r = [t.header.join("."), Yx.encode(t.payload)].join(".");
    let s = !0;
    const o = (i) => (t.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(i, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Va.hashSha256Async)(r).then((i) => o(i));
    {
      const i = (0, Va.hashSha256)(r);
      return o(i);
    }
  }
}
bl.TokenVerifier = Wx;
var xl = {};
Object.defineProperty(xl, "__esModule", { value: !0 });
xl.decodeToken = void 0;
const qa = mn;
function Zx(e) {
  if (typeof e == "string") {
    const t = e.split("."), n = JSON.parse(qa.decode(t[0])), r = JSON.parse(qa.decode(t[1])), s = t[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof e == "object") {
    if (typeof e.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let t = e.payload;
    e.payload[0] !== "{" && (t = qa.decode(t));
    const n = [];
    return e.header.map((r) => {
      const s = JSON.parse(qa.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(t),
      signature: e.signature
    };
  }
}
xl.decodeToken = Zx;
(function(e) {
  var t = xn && xn.__createBinding || (Object.create ? function(r, s, o, i) {
    i === void 0 && (i = o);
    var a = Object.getOwnPropertyDescriptor(s, o);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[o];
    } }), Object.defineProperty(r, i, a);
  } : function(r, s, o, i) {
    i === void 0 && (i = o), r[i] = s[o];
  }), n = xn && xn.__exportStar || function(r, s) {
    for (var o in r) o !== "default" && !Object.prototype.hasOwnProperty.call(s, o) && t(s, r, o);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), n(Ei, e), n(bl, e), n(xl, e), n(qr, e), n(pl, e);
})(rn);
function Qx(e) {
  return `did:btc-addr:${e}`;
}
function Jx(e) {
  const t = e.split(":");
  if (t.length !== 3)
    throw new Lh("Decentralized IDs must have 3 parts");
  if (t[0].toLowerCase() !== "did")
    throw new Lh('Decentralized IDs must start with "did"');
  return t[1].toLowerCase();
}
function Iy(e) {
  if (e)
    return Jx(e) === "btc-addr" ? e.split(":")[2] : void 0;
}
const eS = "1.4.0";
function tS() {
  return F2();
}
function nS(e, t, n, r = vg.slice(), s, o = Hb().getTime(), i = {}) {
  const a = (y) => {
    const S = Od("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${y}=undefined])`
    });
    return S == null ? void 0 : S.origin;
  };
  t || (t = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, i, {
    jti: Db(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: t,
    version: eS,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), p = rn.SECP256K1Client.derivePublicKey(e);
  c.public_keys = [p];
  const g = Jg(p);
  return c.iss = Qx(g), new rn.TokenSigner("ES256k", e).sign(c);
}
async function Wh(e, t) {
  const n = ka(Ze(t)), r = JSON.parse(n), s = await ry(e, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function rS(e) {
  const t = rn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new rn.TokenVerifier("ES256k", r).verify(e);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function sS(e) {
  const t = rn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys, r = Iy(t.iss);
  if (n.length === 1) {
    if (Jg(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function oS(e) {
  const t = rn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  if (t.iat) {
    if (typeof t.iat != "number")
      return !1;
    const n = new Date(t.iat * 1e3);
    return !((/* @__PURE__ */ new Date()).getTime() < n.getTime());
  } else
    return !0;
}
function iS(e) {
  const t = rn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  if (t.exp) {
    if (typeof t.exp != "number")
      return !1;
    const n = new Date(t.exp * 1e3);
    return !((/* @__PURE__ */ new Date()).getTime() > n.getTime());
  } else
    return !0;
}
function aS(e) {
  const t = [
    iS(e),
    oS(e),
    rS(e),
    sS(e)
  ];
  return Promise.resolve(t.every((n) => n));
}
const Zh = "1.0.0";
class Hs {
  constructor(t) {
    this.version = Zh, this.userData = t.userData, this.transitKey = t.transitKey, this.etags = t.etags ? t.etags : {};
  }
  static fromJSON(t) {
    if (t.version !== Zh)
      throw new Bu(`JSON data version ${t.version} not supported by SessionData`);
    const n = {
      coreNode: t.coreNode,
      userData: t.userData,
      transitKey: t.transitKey,
      etags: t.etags
    };
    return new Hs(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Ly {
  constructor(t) {
    if (t) {
      const n = new Hs(t);
      this.setSessionData(n);
    }
  }
  getSessionData() {
    throw new Error("Abstract class");
  }
  setSessionData(t) {
    throw new Error("Abstract class");
  }
  deleteSessionData() {
    throw new Error("Abstract class");
  }
}
class Qh extends Ly {
  constructor(t) {
    super(t), this.sessionData || this.setSessionData(new Hs({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Ag("No session data was found.");
    return this.sessionData;
  }
  setSessionData(t) {
    return this.sessionData = t, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Hs({})), !0;
  }
}
class Jh extends Ly {
  constructor(t) {
    if (super(t), t && t.storeOptions && t.storeOptions.localStorageKey && typeof t.storeOptions.localStorageKey == "string" ? this.key = t.storeOptions.localStorageKey : this.key = _b, !localStorage.getItem(this.key)) {
      const r = new Hs({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const t = localStorage.getItem(this.key);
    if (!t)
      throw new Ag("No session data was found in localStorage");
    const n = JSON.parse(t);
    return Hs.fromJSON(n);
  }
  setSessionData(t) {
    return localStorage.setItem(this.key, t.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Hs({})), !0;
  }
}
var fa;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(fa || (fa = {}));
var Fc;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Fc || (Fc = {}));
fa.Mainnet;
var Gr;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Gr || (Gr = {}));
var Er;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Er || (Er = {}));
Gr.Mainnet;
const Cy = {
  chainId: fa.Mainnet,
  transactionVersion: Gr.Mainnet,
  peerNetworkId: Fc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Er.MainnetSingleSig,
    multiSig: Er.MainnetMultiSig
  },
  client: { baseUrl: Eg }
}, ju = {
  chainId: fa.Testnet,
  transactionVersion: Gr.Testnet,
  peerNetworkId: Fc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Er.TestnetSingleSig,
    multiSig: Er.TestnetMultiSig
  },
  client: { baseUrl: kg }
}, Ac = {
  ...ju,
  addressVersion: { ...ju.addressVersion },
  magicBytes: "id",
  client: { baseUrl: $g }
}, cS = {
  ...Ac,
  addressVersion: { ...Ac.addressVersion },
  client: { ...Ac.client }
};
function lS(e) {
  switch (e) {
    case "mainnet":
      return Cy;
    case "testnet":
      return ju;
    case "devnet":
      return Ac;
    case "mocknet":
      return cS;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function Ty(e) {
  return typeof e == "string" ? lS(e) : e;
}
var ep;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ep || (ep = {}));
var tp;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(tp || (tp = {}));
var tr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(tr || (tr = {}));
const Ql = ["onChainOnly", "offChainOnly", "any"];
Ql[0] + "", tr.OnChainOnly, Ql[1] + "", tr.OffChainOnly, Ql[2] + "", tr.Any, tr.OnChainOnly + "", tr.OnChainOnly, tr.OffChainOnly + "", tr.OffChainOnly, tr.Any + "", tr.Any;
var np;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(np || (np = {}));
var rp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(rp || (rp = {}));
var sp;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(sp || (sp = {}));
var Rr;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Rr || (Rr = {}));
var op;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(op || (op = {}));
var ip;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(ip || (ip = {}));
var ap;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(ap || (ap = {}));
var cp;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(cp || (cp = {}));
var lp;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(lp || (lp = {}));
var up;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(up || (up = {}));
var dp;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(dp || (dp = {}));
var fp;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(fp || (fp = {}));
var hp;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(hp || (hp = {}));
function Ru(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function uS(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function By(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function dS(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ru(e.outputLen), Ru(e.blockLen);
}
function fS(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function hS(e, t) {
  By(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const io = {
  number: Ru,
  bool: uS,
  bytes: By,
  hash: dS,
  exists: fS,
  output: hS
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Jl = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), gr = (e, t) => e << 32 - t | e >>> t, pS = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!pS)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function gS(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function nf(e) {
  if (typeof e == "string" && (e = gS(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let My = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Po(e) {
  const t = (r) => e().update(nf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Ny = class extends My {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, io.hash(t);
    const r = nf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? t.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = t.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(t) {
    return io.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    io.exists(this), io.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = s, t.destroyed = o, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const _y = (e, t, n) => new Ny(e, t).update(n).digest();
_y.create = (e, t) => new Ny(e, t);
function yS(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, p = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + p, a, r);
}
let rf = class extends My {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Jl(this.buffer);
  }
  update(t) {
    io.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = nf(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Jl(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    io.exists(this), io.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let h = i; h < s; h++)
      n[h] = 0;
    yS(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Jl(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const p = c / 4, g = this.get();
    if (p > g.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < p; h++)
      a.setUint32(4 * h, g[h], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = o, t.destroyed = i, s % n && t.buffer.set(r), t;
  }
};
const wS = (e, t, n) => e & t ^ ~e & n, mS = (e, t, n) => e & t ^ e & n ^ t & n, bS = new Uint32Array([
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
let Py = class extends rf {
  constructor() {
    super(64, 32, 8, !1), this.A = gs[0] | 0, this.B = gs[1] | 0, this.C = gs[2] | 0, this.D = gs[3] | 0, this.E = gs[4] | 0, this.F = gs[5] | 0, this.G = gs[6] | 0, this.H = gs[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      ys[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const w = ys[h - 15], y = ys[h - 2], S = gr(w, 7) ^ gr(w, 18) ^ w >>> 3, x = gr(y, 17) ^ gr(y, 19) ^ y >>> 10;
      ys[h] = x + ys[h - 7] + S + ys[h - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: p, H: g } = this;
    for (let h = 0; h < 64; h++) {
      const w = gr(a, 6) ^ gr(a, 11) ^ gr(a, 25), y = g + w + wS(a, c, p) + bS[h] + ys[h] | 0, x = (gr(r, 2) ^ gr(r, 13) ^ gr(r, 22)) + mS(r, s, o) | 0;
      g = p, p = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, p = p + this.G | 0, g = g + this.H | 0, this.set(r, s, o, i, a, c, p, g);
  }
  roundClean() {
    ys.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, xS = class extends Py {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Uy = Po(() => new Py());
Po(() => new xS());
var Uo = {}, sf = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32decode = e.c32normalize = e.c32encode = e.c32 = void 0;
  const t = Ca;
  e.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, a) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let c = [], p = 0;
    for (let y = i.length - 1; y >= 0; y--)
      if (p < 4) {
        const S = n.indexOf(i[y]) >> p;
        let x = 0;
        y !== 0 && (x = n.indexOf(i[y - 1]));
        const L = 1 + p, O = x % (1 << L) << 5 - L, U = e.c32[S + O];
        p = L, c.unshift(U);
      } else
        p = 0;
    let g = 0;
    for (let y = 0; y < c.length && c[y] === "0"; y++)
      g++;
    c = c.slice(g);
    const h = new TextDecoder().decode((0, t.hexToBytes)(i)).match(/^\u0000*/), w = h ? h[0].length : 0;
    for (let y = 0; y < w; y++)
      c.unshift(e.c32[0]);
    if (a) {
      const y = a - c.length;
      for (let S = 0; S < y; S++)
        c.unshift(e.c32[0]);
    }
    return c.join("");
  }
  e.c32encode = r;
  function s(i) {
    return i.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  e.c32normalize = s;
  function o(i, a) {
    if (i = s(i), !i.match(`^[${e.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const c = i.match(`^${e.c32[0]}*`), p = c ? c[0].length : 0;
    let g = [], h = 0, w = 0;
    for (let x = i.length - 1; x >= 0; x--) {
      w === 4 && (g.unshift(n[h]), w = 0, h = 0);
      const O = (e.c32.indexOf(i[x]) << w) + h, U = n[O % 16];
      if (w += 1, h = O >> 4, h > 1 << w)
        throw new Error("Panic error in decoding.");
      g.unshift(U);
    }
    g.unshift(n[h]), g.length % 2 === 1 && g.unshift("0");
    let y = 0;
    for (let x = 0; x < g.length && g[x] === "0"; x++)
      y++;
    g = g.slice(y - y % 2);
    let S = g.join("");
    for (let x = 0; x < p; x++)
      S = `00${S}`;
    if (a) {
      const x = a * 2 - S.length;
      for (let L = 0; L < x; L += 2)
        S = `00${S}`;
    }
    return S;
  }
  e.c32decode = o;
})(sf);
var xo = {};
Object.defineProperty(xo, "__esModule", { value: !0 });
xo.c32checkDecode = xo.c32checkEncode = void 0;
const pp = ml, gp = Ca, ia = sf;
function Hy(e) {
  const t = (0, pp.sha256)((0, pp.sha256)((0, gp.hexToBytes)(e)));
  return (0, gp.bytesToHex)(t.slice(0, 4));
}
function SS(e, t) {
  if (e < 0 || e >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!t.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  t = t.toLowerCase(), t.length % 2 !== 0 && (t = `0${t}`);
  let n = e.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Hy(`${n}${t}`), s = (0, ia.c32encode)(`${t}${r}`);
  return `${ia.c32[e]}${s}`;
}
xo.c32checkEncode = SS;
function vS(e) {
  e = (0, ia.c32normalize)(e);
  const t = (0, ia.c32decode)(e.slice(1)), n = e[0], r = ia.c32.indexOf(n), s = t.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), Hy(`${o}${t.substring(0, t.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, t.substring(0, t.length - 8)];
}
xo.c32checkDecode = vS;
var Oy = {}, $i = {};
Object.defineProperty($i, "__esModule", { value: !0 });
$i.decode = $i.encode = void 0;
const jc = ml, yp = Ca, Dy = Yg, Fy = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function AS(e, t = "00") {
  const n = typeof e == "string" ? (0, yp.hexToBytes)(e) : e, r = typeof t == "string" ? (0, yp.hexToBytes)(t) : e;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, jc.sha256)((0, jc.sha256)(new Uint8Array([...r, ...n])));
  return Dy(Fy).encode([...r, ...n, ...s.slice(0, 4)]);
}
$i.encode = AS;
function ES(e) {
  const t = Dy(Fy).decode(e), n = t.slice(0, 1), r = t.slice(1, -4), s = (0, jc.sha256)((0, jc.sha256)(new Uint8Array([...n, ...r])));
  return t.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
$i.decode = ES;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32ToB58 = e.b58ToC32 = e.c32addressDecode = e.c32address = e.versions = void 0;
  const t = xo, n = $i, r = Ca;
  e.versions = {
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
  s[0] = e.versions.mainnet.p2pkh, s[5] = e.versions.mainnet.p2sh, s[111] = e.versions.testnet.p2pkh, s[196] = e.versions.testnet.p2sh;
  const o = {};
  o[e.versions.mainnet.p2pkh] = 0, o[e.versions.mainnet.p2sh] = 5, o[e.versions.testnet.p2pkh] = 111, o[e.versions.testnet.p2sh] = 196;
  function i(g, h) {
    if (!h.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, t.c32checkEncode)(g, h)}`;
  }
  e.c32address = i;
  function a(g) {
    if (g.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (g[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, t.c32checkDecode)(g.slice(1));
  }
  e.c32addressDecode = a;
  function c(g, h = -1) {
    const w = n.decode(g), y = (0, r.bytesToHex)(w.data), S = parseInt((0, r.bytesToHex)(w.prefix), 16);
    let x;
    return h < 0 ? (x = S, s[S] !== void 0 && (x = s[S])) : x = h, i(x, y);
  }
  e.b58ToC32 = c;
  function p(g, h = -1) {
    const w = a(g), y = w[0], S = w[1];
    let x;
    h < 0 ? (x = y, o[y] !== void 0 && (x = o[y])) : x = h;
    let L = x.toString(16);
    return L.length === 1 && (L = `0${L}`), n.encode(S, L);
  }
  e.c32ToB58 = p;
})(Oy);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.b58ToC32 = e.c32ToB58 = e.versions = e.c32normalize = e.c32addressDecode = e.c32address = e.c32checkDecode = e.c32checkEncode = e.c32decode = e.c32encode = void 0;
  const t = sf;
  Object.defineProperty(e, "c32encode", { enumerable: !0, get: function() {
    return t.c32encode;
  } }), Object.defineProperty(e, "c32decode", { enumerable: !0, get: function() {
    return t.c32decode;
  } }), Object.defineProperty(e, "c32normalize", { enumerable: !0, get: function() {
    return t.c32normalize;
  } });
  const n = xo;
  Object.defineProperty(e, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(e, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Oy;
  Object.defineProperty(e, "c32address", { enumerable: !0, get: function() {
    return r.c32address;
  } }), Object.defineProperty(e, "c32addressDecode", { enumerable: !0, get: function() {
    return r.c32addressDecode;
  } }), Object.defineProperty(e, "c32ToB58", { enumerable: !0, get: function() {
    return r.c32ToB58;
  } }), Object.defineProperty(e, "b58ToC32", { enumerable: !0, get: function() {
    return r.b58ToC32;
  } }), Object.defineProperty(e, "versions", { enumerable: !0, get: function() {
    return r.versions;
  } });
})(Uo);
function kS(e, t) {
  switch (t = Ty(t ?? Cy), e) {
    case Rr.P2PKH:
      switch (t.transactionVersion) {
        case Gr.Mainnet:
          return Er.MainnetSingleSig;
        case Gr.Testnet:
          return Er.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    case Rr.P2SH:
    case Rr.P2SHNonSequential:
    case Rr.P2WPKH:
    case Rr.P2WSH:
    case Rr.P2WSHNonSequential:
      switch (t.transactionVersion) {
        case Gr.Mainnet:
          return Er.MainnetMultiSig;
        case Gr.Testnet:
          return Er.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${e}`);
  }
}
const $S = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), jy = Uint8Array.from({ length: 16 }, (e, t) => t), IS = jy.map((e) => (9 * e + 5) % 16);
let of = [jy], af = [IS];
for (let e = 0; e < 4; e++)
  for (let t of [of, af])
    t.push(t[e].map((n) => $S[n]));
const Ry = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), LS = of.map((e, t) => e.map((n) => Ry[t][n])), CS = af.map((e, t) => e.map((n) => Ry[t][n])), TS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), BS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ya = (e, t) => e << t | e >>> 32 - t;
function wp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Xa = new Uint32Array(16);
let MS = class extends rf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: o } = this;
    return [t, n, r, s, o];
  }
  set(t, n, r, s, o) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Xa[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, p = this.h3 | 0, g = p, h = this.h4 | 0, w = h;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, x = TS[y], L = BS[y], O = of[y], U = af[y], v = LS[y], T = CS[y];
      for (let B = 0; B < 16; B++) {
        const z = Ya(r + wp(y, o, a, p) + Xa[O[B]] + x, v[B]) + h | 0;
        r = h, h = p, p = Ya(a, 10) | 0, a = o, o = z;
      }
      for (let B = 0; B < 16; B++) {
        const z = Ya(s + wp(S, i, c, g) + Xa[U[B]] + L, T[B]) + w | 0;
        s = w, w = g, g = Ya(c, 10) | 0, c = i, i = z;
      }
    }
    this.set(this.h1 + a + g | 0, this.h2 + p + w | 0, this.h3 + h + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Xa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const NS = Po(() => new MS()), Wa = BigInt(2 ** 32 - 1), zu = BigInt(32);
function zy(e, t = !1) {
  return t ? { h: Number(e & Wa), l: Number(e >> zu & Wa) } : { h: Number(e >> zu & Wa) | 0, l: Number(e & Wa) | 0 };
}
function _S(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = zy(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const PS = (e, t) => BigInt(e >>> 0) << zu | BigInt(t >>> 0), US = (e, t, n) => e >>> n, HS = (e, t, n) => e << 32 - n | t >>> n, OS = (e, t, n) => e >>> n | t << 32 - n, DS = (e, t, n) => e << 32 - n | t >>> n, FS = (e, t, n) => e << 64 - n | t >>> n - 32, jS = (e, t, n) => e >>> n - 32 | t << 64 - n, RS = (e, t) => t, zS = (e, t) => e, GS = (e, t, n) => e << n | t >>> 32 - n, KS = (e, t, n) => t << n | e >>> 32 - n, VS = (e, t, n) => t << n - 32 | e >>> 64 - n, qS = (e, t, n) => e << n - 32 | t >>> 64 - n;
function YS(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const XS = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), WS = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, ZS = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), QS = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, JS = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), ev = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, _e = {
  fromBig: zy,
  split: _S,
  toBig: PS,
  shrSH: US,
  shrSL: HS,
  rotrSH: OS,
  rotrSL: DS,
  rotrBH: FS,
  rotrBL: jS,
  rotr32H: RS,
  rotr32L: zS,
  rotlSH: GS,
  rotlSL: KS,
  rotlBH: VS,
  rotlBL: qS,
  add: YS,
  add3L: XS,
  add3H: WS,
  add4L: ZS,
  add4H: QS,
  add5H: ev,
  add5L: JS
}, [tv, nv] = _e.split([
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
].map((e) => BigInt(e))), ws = new Uint32Array(80), ms = new Uint32Array(80);
let Sl = class extends rf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: p, El: g, Fh: h, Fl: w, Gh: y, Gl: S, Hh: x, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, p, g, h, w, y, S, x, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, p, g, h, w, y, S, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = p | 0, this.El = g | 0, this.Fh = h | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let v = 0; v < 16; v++, n += 4)
      ws[v] = t.getUint32(n), ms[v] = t.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const T = ws[v - 15] | 0, B = ms[v - 15] | 0, z = _e.rotrSH(T, B, 1) ^ _e.rotrSH(T, B, 8) ^ _e.shrSH(T, B, 7), Q = _e.rotrSL(T, B, 1) ^ _e.rotrSL(T, B, 8) ^ _e.shrSL(T, B, 7), W = ws[v - 2] | 0, K = ms[v - 2] | 0, m = _e.rotrSH(W, K, 19) ^ _e.rotrBH(W, K, 61) ^ _e.shrSH(W, K, 6), E = _e.rotrSL(W, K, 19) ^ _e.rotrBL(W, K, 61) ^ _e.shrSL(W, K, 6), P = _e.add4L(Q, E, ms[v - 7], ms[v - 16]), N = _e.add4H(P, z, m, ws[v - 7], ws[v - 16]);
      ws[v] = N | 0, ms[v] = P | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: p, Dl: g, Eh: h, El: w, Fh: y, Fl: S, Gh: x, Gl: L, Hh: O, Hl: U } = this;
    for (let v = 0; v < 80; v++) {
      const T = _e.rotrSH(h, w, 14) ^ _e.rotrSH(h, w, 18) ^ _e.rotrBH(h, w, 41), B = _e.rotrSL(h, w, 14) ^ _e.rotrSL(h, w, 18) ^ _e.rotrBL(h, w, 41), z = h & y ^ ~h & x, Q = w & S ^ ~w & L, W = _e.add5L(U, B, Q, nv[v], ms[v]), K = _e.add5H(W, O, T, z, tv[v], ws[v]), m = W | 0, E = _e.rotrSH(r, s, 28) ^ _e.rotrBH(r, s, 34) ^ _e.rotrBH(r, s, 39), P = _e.rotrSL(r, s, 28) ^ _e.rotrBL(r, s, 34) ^ _e.rotrBL(r, s, 39), N = r & o ^ r & a ^ o & a, V = s & i ^ s & c ^ i & c;
      O = x | 0, U = L | 0, x = y | 0, L = S | 0, y = h | 0, S = w | 0, { h, l: w } = _e.add(p | 0, g | 0, K | 0, m | 0), p = a | 0, g = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const G = _e.add3L(m, P, V);
      r = _e.add3H(G, K, E, N), s = G | 0;
    }
    ({ h: r, l: s } = _e.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = _e.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = _e.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: p, l: g } = _e.add(this.Dh | 0, this.Dl | 0, p | 0, g | 0), { h, l: w } = _e.add(this.Eh | 0, this.El | 0, h | 0, w | 0), { h: y, l: S } = _e.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: x, l: L } = _e.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: O, l: U } = _e.add(this.Hh | 0, this.Hl | 0, O | 0, U | 0), this.set(r, s, o, i, a, c, p, g, h, w, y, S, x, L, O, U);
  }
  roundClean() {
    ws.fill(0), ms.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, rv = class extends Sl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, sv = class extends Sl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, ov = class extends Sl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Po(() => new Sl());
Po(() => new rv());
Po(() => new sv());
Po(() => new ov());
var Rc = { exports: {} };
Rc.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", c = "[object Date]", p = "[object Error]", g = "[object Function]", h = "[object GeneratorFunction]", w = "[object Map]", y = "[object Number]", S = "[object Object]", x = "[object Promise]", L = "[object RegExp]", O = "[object Set]", U = "[object String]", v = "[object Symbol]", T = "[object WeakMap]", B = "[object ArrayBuffer]", z = "[object DataView]", Q = "[object Float32Array]", W = "[object Float64Array]", K = "[object Int8Array]", m = "[object Int16Array]", E = "[object Int32Array]", P = "[object Uint8Array]", N = "[object Uint8ClampedArray]", V = "[object Uint16Array]", G = "[object Uint32Array]", ve = /[\\^$.*+?()[\]{}|]/g, ue = /\w*$/, Re = /^\[object .+?Constructor\]$/, C = /^(?:0|[1-9]\d*)$/, k = {};
  k[o] = k[i] = k[B] = k[z] = k[a] = k[c] = k[Q] = k[W] = k[K] = k[m] = k[E] = k[w] = k[y] = k[S] = k[L] = k[O] = k[U] = k[v] = k[P] = k[N] = k[V] = k[G] = !0, k[p] = k[g] = k[T] = !1;
  var H = typeof xn == "object" && xn && xn.Object === Object && xn, ne = typeof self == "object" && self && self.Object === Object && self, J = H || ne || Function("return this")(), re = t && !t.nodeType && t, Ce = re && !0 && e && !e.nodeType && e, de = Ce && Ce.exports === re;
  function me(b, _) {
    return b.set(_[0], _[1]), b;
  }
  function he(b, _) {
    return b.add(_), b;
  }
  function Ke(b, _) {
    for (var F = -1, fe = b ? b.length : 0; ++F < fe && _(b[F], F, b) !== !1; )
      ;
    return b;
  }
  function Lt(b, _) {
    for (var F = -1, fe = _.length, ft = b.length; ++F < fe; )
      b[ft + F] = _[F];
    return b;
  }
  function $e(b, _, F, fe) {
    for (var ft = -1, Tt = b ? b.length : 0; ++ft < Tt; )
      F = _(F, b[ft], ft, b);
    return F;
  }
  function ct(b, _) {
    for (var F = -1, fe = Array(b); ++F < b; )
      fe[F] = _(F);
    return fe;
  }
  function Te(b, _) {
    return b == null ? void 0 : b[_];
  }
  function fn(b) {
    var _ = !1;
    if (b != null && typeof b.toString != "function")
      try {
        _ = !!(b + "");
      } catch {
      }
    return _;
  }
  function sn(b) {
    var _ = -1, F = Array(b.size);
    return b.forEach(function(fe, ft) {
      F[++_] = [ft, fe];
    }), F;
  }
  function Ut(b, _) {
    return function(F) {
      return b(_(F));
    };
  }
  function Zt(b) {
    var _ = -1, F = Array(b.size);
    return b.forEach(function(fe) {
      F[++_] = fe;
    }), F;
  }
  var Ct = Array.prototype, hn = Function.prototype, Gt = Object.prototype, rt = J["__core-js_shared__"], Ge = function() {
    var b = /[^.]+$/.exec(rt && rt.keys && rt.keys.IE_PROTO || "");
    return b ? "Symbol(src)_1." + b : "";
  }(), Qt = hn.toString, Kt = Gt.hasOwnProperty, wt = Gt.toString, mt = RegExp(
    "^" + Qt.call(Kt).replace(ve, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), $n = de ? J.Buffer : void 0, Qn = J.Symbol, I = J.Uint8Array, q = Ut(Object.getPrototypeOf, Object), j = Object.create, X = Gt.propertyIsEnumerable, Ae = Ct.splice, Ie = Object.getOwnPropertySymbols, Qe = $n ? $n.isBuffer : void 0, bt = Ut(Object.keys, Object), Ye = lt(J, "DataView"), st = lt(J, "Map"), ze = lt(J, "Promise"), $ = lt(J, "Set"), oe = lt(J, "WeakMap"), ye = lt(Object, "create"), Je = vn(Ye), it = vn(st), Et = vn(ze), gt = vn($), pn = vn(oe), qt = Qn ? Qn.prototype : void 0, Zr = qt ? qt.valueOf : void 0;
  function Me(b) {
    var _ = -1, F = b ? b.length : 0;
    for (this.clear(); ++_ < F; ) {
      var fe = b[_];
      this.set(fe[0], fe[1]);
    }
  }
  function Rs() {
    this.__data__ = ye ? ye(null) : {};
  }
  function zs(b) {
    return this.has(b) && delete this.__data__[b];
  }
  function Qr(b) {
    var _ = this.__data__;
    if (ye) {
      var F = _[b];
      return F === r ? void 0 : F;
    }
    return Kt.call(_, b) ? _[b] : void 0;
  }
  function jo(b) {
    var _ = this.__data__;
    return ye ? _[b] !== void 0 : Kt.call(_, b);
  }
  function Jr(b, _) {
    var F = this.__data__;
    return F[b] = ye && _ === void 0 ? r : _, this;
  }
  Me.prototype.clear = Rs, Me.prototype.delete = zs, Me.prototype.get = Qr, Me.prototype.has = jo, Me.prototype.set = Jr;
  function gn(b) {
    var _ = -1, F = b ? b.length : 0;
    for (this.clear(); ++_ < F; ) {
      var fe = b[_];
      this.set(fe[0], fe[1]);
    }
  }
  function Mr() {
    this.__data__ = [];
  }
  function Ro(b) {
    var _ = this.__data__, F = hr(_, b);
    if (F < 0)
      return !1;
    var fe = _.length - 1;
    return F == fe ? _.pop() : Ae.call(_, F, 1), !0;
  }
  function Ri(b) {
    var _ = this.__data__, F = hr(_, b);
    return F < 0 ? void 0 : _[F][1];
  }
  function zi(b) {
    return hr(this.__data__, b) > -1;
  }
  function Ht(b, _) {
    var F = this.__data__, fe = hr(F, b);
    return fe < 0 ? F.push([b, _]) : F[fe][1] = _, this;
  }
  gn.prototype.clear = Mr, gn.prototype.delete = Ro, gn.prototype.get = Ri, gn.prototype.has = zi, gn.prototype.set = Ht;
  function Yt(b) {
    var _ = -1, F = b ? b.length : 0;
    for (this.clear(); ++_ < F; ) {
      var fe = b[_];
      this.set(fe[0], fe[1]);
    }
  }
  function Gs() {
    this.__data__ = {
      hash: new Me(),
      map: new (st || gn)(),
      string: new Me()
    };
  }
  function Oe(b) {
    return Pr(this, b).delete(b);
  }
  function Ot(b) {
    return Pr(this, b).get(b);
  }
  function es(b) {
    return Pr(this, b).has(b);
  }
  function Ks(b, _) {
    return Pr(this, b).set(b, _), this;
  }
  Yt.prototype.clear = Gs, Yt.prototype.delete = Oe, Yt.prototype.get = Ot, Yt.prototype.has = es, Yt.prototype.set = Ks;
  function yn(b) {
    this.__data__ = new gn(b);
  }
  function Fn() {
    this.__data__ = new gn();
  }
  function In(b) {
    return this.__data__.delete(b);
  }
  function xt(b) {
    return this.__data__.get(b);
  }
  function Nr(b) {
    return this.__data__.has(b);
  }
  function Vs(b, _) {
    var F = this.__data__;
    if (F instanceof gn) {
      var fe = F.__data__;
      if (!st || fe.length < n - 1)
        return fe.push([b, _]), this;
      F = this.__data__ = new Yt(fe);
    }
    return F.set(b, _), this;
  }
  yn.prototype.clear = Fn, yn.prototype.delete = In, yn.prototype.get = xt, yn.prototype.has = Nr, yn.prototype.set = Vs;
  function Gi(b, _) {
    var F = d(b) || f(b) ? ct(b.length, String) : [], fe = F.length, ft = !!fe;
    for (var Tt in b)
      Kt.call(b, Tt) && !(ft && (Tt == "length" || Wo(Tt, fe))) && F.push(Tt);
    return F;
  }
  function zo(b, _, F) {
    var fe = b[_];
    (!(Kt.call(b, _) && l(fe, F)) || F === void 0 && !(_ in b)) && (b[_] = F);
  }
  function hr(b, _) {
    for (var F = b.length; F--; )
      if (l(b[F][0], _))
        return F;
    return -1;
  }
  function qs(b, _) {
    return b && Xo(_, pe(_), b);
  }
  function Ys(b, _, F, fe, ft, Tt, Dt) {
    var Jt;
    if (fe && (Jt = Tt ? fe(b, ft, Tt, Dt) : fe(b)), Jt !== void 0)
      return Jt;
    if (!se(b))
      return b;
    var os = d(b);
    if (os) {
      if (Jt = Rn(b), !_)
        return Zs(b, Jt);
    } else {
      var Se = jn(b), et = Se == g || Se == h;
      if (M(b))
        return Xs(b, _);
      if (Se == S || Se == o || et && !Tt) {
        if (fn(b))
          return Tt ? b : {};
        if (Jt = rs(et ? {} : b), !_)
          return Ki(b, qs(Jt, b));
      } else {
        if (!k[Se])
          return Tt ? b : {};
        Jt = Ur(b, Se, Ys, _);
      }
    }
    Dt || (Dt = new yn());
    var at = Dt.get(b);
    if (at)
      return at;
    if (Dt.set(b, Jt), !os)
      var on = F ? Qs(b) : pe(b);
    return Ke(on || b, function(Qo, eo) {
      on && (eo = Qo, Qo = b[eo]), zo(Jt, eo, Ys(Qo, _, F, fe, eo, b, Dt));
    }), Jt;
  }
  function Ln(b) {
    return se(b) ? j(b) : {};
  }
  function Go(b, _, F) {
    var fe = _(b);
    return d(b) ? fe : Lt(fe, F(b));
  }
  function Ko(b) {
    return wt.call(b);
  }
  function Vo(b) {
    if (!se(b) || Zo(b))
      return !1;
    var _ = R(b) || fn(b) ? mt : Re;
    return _.test(vn(b));
  }
  function ts(b) {
    if (!Js(b))
      return bt(b);
    var _ = [];
    for (var F in Object(b))
      Kt.call(b, F) && F != "constructor" && _.push(F);
    return _;
  }
  function Xs(b, _) {
    if (_)
      return b.slice();
    var F = new b.constructor(b.length);
    return b.copy(F), F;
  }
  function Cn(b) {
    var _ = new b.constructor(b.byteLength);
    return new I(_).set(new I(b)), _;
  }
  function ns(b, _) {
    var F = _ ? Cn(b.buffer) : b.buffer;
    return new b.constructor(F, b.byteOffset, b.byteLength);
  }
  function Ws(b, _, F) {
    var fe = _ ? F(sn(b), !0) : sn(b);
    return $e(fe, me, new b.constructor());
  }
  function _r(b) {
    var _ = new b.constructor(b.source, ue.exec(b));
    return _.lastIndex = b.lastIndex, _;
  }
  function qo(b, _, F) {
    var fe = _ ? F(Zt(b), !0) : Zt(b);
    return $e(fe, he, new b.constructor());
  }
  function Xe(b) {
    return Zr ? Object(Zr.call(b)) : {};
  }
  function Yo(b, _) {
    var F = _ ? Cn(b.buffer) : b.buffer;
    return new b.constructor(F, b.byteOffset, b.length);
  }
  function Zs(b, _) {
    var F = -1, fe = b.length;
    for (_ || (_ = Array(fe)); ++F < fe; )
      _[F] = b[F];
    return _;
  }
  function Xo(b, _, F, fe) {
    F || (F = {});
    for (var ft = -1, Tt = _.length; ++ft < Tt; ) {
      var Dt = _[ft], Jt = void 0;
      zo(F, Dt, Jt === void 0 ? b[Dt] : Jt);
    }
    return F;
  }
  function Ki(b, _) {
    return Xo(b, Tn(b), _);
  }
  function Qs(b) {
    return Go(b, pe, Tn);
  }
  function Pr(b, _) {
    var F = b.__data__;
    return ss(_) ? F[typeof _ == "string" ? "string" : "hash"] : F.map;
  }
  function lt(b, _) {
    var F = Te(b, _);
    return Vo(F) ? F : void 0;
  }
  var Tn = Ie ? Ut(Ie, Object) : we, jn = Ko;
  (Ye && jn(new Ye(new ArrayBuffer(1))) != z || st && jn(new st()) != w || ze && jn(ze.resolve()) != x || $ && jn(new $()) != O || oe && jn(new oe()) != T) && (jn = function(b) {
    var _ = wt.call(b), F = _ == S ? b.constructor : void 0, fe = F ? vn(F) : void 0;
    if (fe)
      switch (fe) {
        case Je:
          return z;
        case it:
          return w;
        case Et:
          return x;
        case gt:
          return O;
        case pn:
          return T;
      }
    return _;
  });
  function Rn(b) {
    var _ = b.length, F = b.constructor(_);
    return _ && typeof b[0] == "string" && Kt.call(b, "index") && (F.index = b.index, F.input = b.input), F;
  }
  function rs(b) {
    return typeof b.constructor == "function" && !Js(b) ? Ln(q(b)) : {};
  }
  function Ur(b, _, F, fe) {
    var ft = b.constructor;
    switch (_) {
      case B:
        return Cn(b);
      case a:
      case c:
        return new ft(+b);
      case z:
        return ns(b, fe);
      case Q:
      case W:
      case K:
      case m:
      case E:
      case P:
      case N:
      case V:
      case G:
        return Yo(b, fe);
      case w:
        return Ws(b, fe, F);
      case y:
      case U:
        return new ft(b);
      case L:
        return _r(b);
      case O:
        return qo(b, fe, F);
      case v:
        return Xe(b);
    }
  }
  function Wo(b, _) {
    return _ = _ ?? s, !!_ && (typeof b == "number" || C.test(b)) && b > -1 && b % 1 == 0 && b < _;
  }
  function ss(b) {
    var _ = typeof b;
    return _ == "string" || _ == "number" || _ == "symbol" || _ == "boolean" ? b !== "__proto__" : b === null;
  }
  function Zo(b) {
    return !!Ge && Ge in b;
  }
  function Js(b) {
    var _ = b && b.constructor, F = typeof _ == "function" && _.prototype || Gt;
    return b === F;
  }
  function vn(b) {
    if (b != null) {
      try {
        return Qt.call(b);
      } catch {
      }
      try {
        return b + "";
      } catch {
      }
    }
    return "";
  }
  function u(b) {
    return Ys(b, !0, !0);
  }
  function l(b, _) {
    return b === _ || b !== b && _ !== _;
  }
  function f(b) {
    return D(b) && Kt.call(b, "callee") && (!X.call(b, "callee") || wt.call(b) == o);
  }
  var d = Array.isArray;
  function A(b) {
    return b != null && Z(b.length) && !R(b);
  }
  function D(b) {
    return ce(b) && A(b);
  }
  var M = Qe || ge;
  function R(b) {
    var _ = se(b) ? wt.call(b) : "";
    return _ == g || _ == h;
  }
  function Z(b) {
    return typeof b == "number" && b > -1 && b % 1 == 0 && b <= s;
  }
  function se(b) {
    var _ = typeof b;
    return !!b && (_ == "object" || _ == "function");
  }
  function ce(b) {
    return !!b && typeof b == "object";
  }
  function pe(b) {
    return A(b) ? Gi(b) : ts(b);
  }
  function we() {
    return [];
  }
  function ge() {
    return !1;
  }
  e.exports = u;
})(Rc, Rc.exports);
var iv = Rc.exports;
const Gy = /* @__PURE__ */ mg(iv);
var Gu;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Gu || (Gu = {}));
function av(e, t) {
  return { type: Gu.Address, version: e, hash160: t };
}
function cv(e) {
  return Uo.c32address(e.version, e.hash160);
}
const lv = (e) => NS(Uy(e)), uv = (e) => Ee(lv(e));
Pt.hmacSha256Sync = (e, ...t) => {
  const n = _y.create(Uy, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function dv(e, t = "mainnet") {
  t = Ty(t), e = typeof e == "string" ? Ze(e) : e;
  const n = kS(Rr.P2PKH, t), r = av(n, uv(e));
  return cv(r);
}
function fv(e, t) {
  const n = rn.decodeToken(e), r = n.payload;
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
  const s = r.issuer.publicKey, o = dv(s);
  if (t !== s) {
    if (t !== o) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new rn.TokenVerifier(n.header.alg, s);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(e))
    throw new Error("Token verification failed");
  return n;
}
function hv(e, t = null) {
  let n;
  t ? n = fv(e, t) : n = rn.decodeToken(e);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const mp = "_blockstackDidCheckEchoReply", pv = "echoReply", gv = "authContinuation";
function yv(e) {
  return e ? (/^[?#]/.test(e) ? e.slice(1) : e).split("&").reduce((n, r) => {
    const [s, o] = r.split("=");
    return n[s] = o ? decodeURIComponent(o.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function wv() {
  let e;
  if (typeof self < "u")
    e = self;
  else if (typeof window < "u")
    e = window;
  else
    return !1;
  if (!e.location || !e.localStorage)
    return !1;
  const t = e[mp];
  if (typeof t == "boolean")
    return t;
  const n = yv(e.location.search), r = n[pv];
  if (r) {
    e[mp] = !0;
    const s = `echo-reply-${r}`;
    return e.localStorage.setItem(s, "success"), e.setTimeout(() => {
      const o = n[gv];
      e.location.href = o;
    }, 10), !0;
  }
  return !1;
}
class Ku {
  constructor(t) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), t && t.appConfig)
      this.appConfig = t.appConfig;
    else if (n)
      this.appConfig = new Ig();
    else
      throw new Ub("You need to specify options.appConfig");
    t && t.sessionStore ? this.store = t.sessionStore : n ? t ? this.store = new Jh(t.sessionOptions) : this.store = new Jh() : t ? this.store = new Qh(t.sessionOptions) : this.store = new Qh();
  }
  makeAuthRequestToken(t, n, r, s, o, i = Ob().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Bu("Missing AppConfig");
    return t = t || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, o = o || c.appDomain, nS(t, n, r, s, o, i, a);
  }
  generateAndStoreTransitKey() {
    const t = this.store.getSessionData(), n = tS();
    return t.transitKey = n, this.store.setSessionData(t), n;
  }
  getAuthResponseToken() {
    var r;
    const t = (r = Od("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(t).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (wv())
        return li.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (t) {
      li.error(`Error checking for protocol echo reply isSignInPending: ${t}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(t = this.getAuthResponseToken(), n = a1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Oa("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = rn.decodeToken(t).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await aS(t))
      throw new Oa("Invalid authentication response.");
    let a = o.private_key, c = o.core_token;
    if (ql(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            a = await Wh(s, o.private_key);
          } catch {
            if (li.warn("Failed decryption of appPrivateKey, will try to use as given"), !Pt.isValidPrivateKey(o.private_key))
              throw new Oa("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Wh(s, c);
          } catch {
            li.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Oa("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let p = Wb, g;
    ql(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (p = o.hubUrl), ql(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (g = o.associationToken);
    const h = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: Iy(o.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: t,
      hubUrl: p,
      appPrivateKeyFromWalletSalt: o.appPrivateKeyFromWalletSalt,
      coreNode: o.blockstackAPIUrl,
      gaiaAssociationToken: g
    }, w = o.profile_url;
    if (!h.profile && w) {
      const y = await n(w);
      if (!y.ok)
        h.profile = Object.assign({}, Nb);
      else {
        const S = await y.text(), x = JSON.parse(S);
        h.profile = hv(x[0].token);
      }
    } else
      h.profile = o.profile;
    return r.userData = h, this.store.setSessionData(r), h;
  }
  loadUserData() {
    const t = this.store.getSessionData().userData;
    if (!t)
      throw new Bu("No user data found. Did the user sign in?");
    return t;
  }
  encryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), W2(t, r);
  }
  decryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Z2(t, r);
  }
  signUserOut(t) {
    this.store.deleteSessionData(), t && typeof location < "u" && location.href && (location.href = t);
  }
}
Ku.prototype.makeAuthRequest = Ku.prototype.makeAuthRequestToken;
const mv = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], bv = (e = []) => {
  if (typeof window > "u")
    return [];
  const t = mv(), n = e.filter((r) => t.find((o) => o.id === r.id) ? !1 : !!vl(r.id));
  return t.concat(n);
}, vl = (e) => e == null ? void 0 : e.split(".").reduce((t, n) => t == null ? void 0 : t[n], window), Ky = "STX_PROVIDER", So = () => typeof window > "u" ? null : window.localStorage.getItem(Ky), xv = (e) => {
  typeof window < "u" && window.localStorage.setItem(Ky, e);
}, Sv = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function vv(e, t) {
  const n = {};
  return Object.assign(n, Sv, t), await fetch(e, n);
}
function Av(e) {
  let t = vv, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function Ev(...e) {
  const { fetchLib: t, middlewares: n } = Av(e);
  return async (s, o) => {
    let i = { url: s, init: o ?? {} };
    for (const c of n)
      typeof c.pre == "function" && (i = await Promise.resolve(c.pre({
        fetch: t,
        ...i
      })) ?? i);
    let a = await t(i.url, i.init);
    for (const c of n)
      typeof c.post == "function" && (a = await Promise.resolve(c.post({
        fetch: t,
        url: i.url,
        init: i.init,
        response: (a == null ? void 0 : a.clone()) ?? a
      })) ?? a);
    return a;
  };
}
var Ii;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Ii || (Ii = {}));
var vo;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(vo || (vo = {}));
var bp;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(bp || (bp = {}));
const kv = "https://api.mainnet.hiro.so", $v = "https://api.testnet.hiro.so", Iv = "http://localhost:3999", Lv = ["mainnet", "testnet", "devnet", "mocknet"];
class Ao {
  constructor(t) {
    this.version = vo.Mainnet, this.chainId = Ii.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === vo.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? Ev();
  }
  getNameInfo(t) {
    const n = `${this.bnsLookupUrl}/v1/names/${t}`;
    return this.fetchFn(n).then((r) => {
      if (r.status === 404)
        throw new Error("Name not found");
      if (r.status !== 200)
        throw new Error(`Bad response status: ${r.status}`);
      return r.json();
    }).then((r) => r.address ? Object.assign({}, r, { address: r.address }) : r);
  }
}
Ao.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new Vu();
    case "testnet":
      return new qu();
    case "devnet":
      return new Cv();
    case "mocknet":
      return new Vy();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Lv.join(", ")}`);
  }
};
Ao.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : Ao.fromName(e);
class Vu extends Ao {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? kv,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = vo.Mainnet, this.chainId = Ii.Mainnet;
  }
}
class qu extends Ao {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? $v,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = vo.Testnet, this.chainId = Ii.Testnet;
  }
}
class Vy extends Ao {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Iv,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = vo.Testnet, this.chainId = Ii.Testnet;
  }
}
const Cv = Vy;
var Eo;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(Eo || (Eo = {}));
var zc;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(zc || (zc = {}));
Eo.Mainnet;
var ko;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(ko || (ko = {}));
var $o;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})($o || ($o = {}));
ko.Mainnet;
const Tv = {
  chainId: Eo.Mainnet,
  transactionVersion: ko.Mainnet,
  peerNetworkId: zc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: $o.MainnetSingleSig,
    multiSig: $o.MainnetMultiSig
  },
  client: { baseUrl: Eg }
}, Yu = {
  chainId: Eo.Testnet,
  transactionVersion: ko.Testnet,
  peerNetworkId: zc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: $o.TestnetSingleSig,
    multiSig: $o.TestnetMultiSig
  },
  client: { baseUrl: kg }
}, Ec = {
  ...Yu,
  addressVersion: { ...Yu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: $g }
}, Bv = {
  ...Ec,
  addressVersion: { ...Ec.addressVersion },
  client: { ...Ec.client }
};
function Mv(e) {
  switch (e) {
    case "mainnet":
      return Tv;
    case "testnet":
      return Yu;
    case "devnet":
      return Ec;
    case "mocknet":
      return Bv;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function Nv(e) {
  return typeof e == "string" ? Mv(e) : e;
}
function _v(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const xp = /* @__PURE__ */ new Map();
function qy(e, t) {
  const n = xp.get(e);
  if (n !== void 0)
    return n(t);
  const r = _v(e);
  return xp.set(e, r), qy(e, t);
}
let yt = class {
  constructor(t) {
    this.consumed = 0, this.source = typeof t == "string" ? Ze(t) : t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return r1(this.readBytes(4), 0);
  }
  readUInt8() {
    return t1(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Jb(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = Ee(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = Ee(n);
    return BigInt(`0x${r}`);
  }
  get readOffset() {
    return this.consumed;
  }
  set readOffset(t) {
    this.consumed = t;
  }
  get internalBytes() {
    return this.source;
  }
  readUInt8Enum(t, n) {
    const r = this.readUInt8();
    if (qy(t, r))
      return r;
    throw n(r);
  }
};
const Pv = 128, Uv = 128, Yy = 16, fo = 32, Xu = 80, Al = 65, Hv = 32, Ov = 64, Gc = 34, Dv = 1 + 16 * 1024 * 1024, Fv = 165, jv = 16, Rv = 16, zv = 20, Gv = Rv + 2 + zv, Kv = Gv + 4, Vv = Dv + (Fv + jv * Kv);
var ot;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ot || (ot = {}));
var Wu;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(Wu || (Wu = {}));
var Nn;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Nn || (Nn = {}));
const eu = ["onChainOnly", "offChainOnly", "any"];
eu[0] + "", Nn.OnChainOnly, eu[1] + "", Nn.OffChainOnly, eu[2] + "", Nn.Any, Nn.OnChainOnly + "", Nn.OnChainOnly, Nn.OffChainOnly + "", Nn.OffChainOnly, Nn.Any + "", Nn.Any;
var Kc;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(Kc || (Kc = {}));
var St;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(St || (St = {}));
var Nt;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Nt || (Nt = {}));
var ht;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ht || (ht = {}));
var $t;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})($t || ($t = {}));
var aa;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(aa || (aa = {}));
var Zu;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(Zu || (Zu = {}));
var Qu;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(Qu || (Qu = {}));
var bn;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(bn || (bn = {}));
var Sp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Sp || (Sp = {}));
var Ju;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Ju || (Ju = {}));
var or;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(or || (or = {}));
var vp;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(vp || (vp = {}));
let El = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, ui = class extends El {
  constructor(t) {
    super(t);
  }
}, wn = class extends El {
  constructor(t) {
    super(t);
  }
}, Vc = class extends El {
  constructor(t) {
    super(t);
  }
}, ao = class extends El {
  constructor(t) {
    super(t);
  }
};
function ed(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function qv(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Xy(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function Yv(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ed(e.outputLen), ed(e.blockLen);
}
function Xv(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Wv(e, t) {
  Xy(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const co = {
  number: ed,
  bool: qv,
  bytes: Xy,
  hash: Yv,
  exists: Xv,
  output: Wv
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const tu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), yr = (e, t) => e << 32 - t | e >>> t, Zv = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Zv)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Qv(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function cf(e) {
  if (typeof e == "string" && (e = Qv(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Wy = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ho(e) {
  const t = (r) => e().update(cf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Zy = class extends Wy {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, co.hash(t);
    const r = cf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? t.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = t.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(t) {
    return co.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    co.exists(this), co.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = s, t.destroyed = o, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Qy = (e, t, n) => new Zy(e, t).update(n).digest();
Qy.create = (e, t) => new Zy(e, t);
function Jv(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, p = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + p, a, r);
}
let lf = class extends Wy {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = tu(this.buffer);
  }
  update(t) {
    co.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = cf(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = tu(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    co.exists(this), co.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let h = i; h < s; h++)
      n[h] = 0;
    Jv(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = tu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const p = c / 4, g = this.get();
    if (p > g.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < p; h++)
      a.setUint32(4 * h, g[h], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = o, t.destroyed = i, s % n && t.buffer.set(r), t;
  }
};
const eA = (e, t, n) => e & t ^ ~e & n, tA = (e, t, n) => e & t ^ e & n ^ t & n, nA = new Uint32Array([
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
]), bs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), xs = new Uint32Array(64);
let Jy = class extends lf {
  constructor() {
    super(64, 32, 8, !1), this.A = bs[0] | 0, this.B = bs[1] | 0, this.C = bs[2] | 0, this.D = bs[3] | 0, this.E = bs[4] | 0, this.F = bs[5] | 0, this.G = bs[6] | 0, this.H = bs[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      xs[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const w = xs[h - 15], y = xs[h - 2], S = yr(w, 7) ^ yr(w, 18) ^ w >>> 3, x = yr(y, 17) ^ yr(y, 19) ^ y >>> 10;
      xs[h] = x + xs[h - 7] + S + xs[h - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: p, H: g } = this;
    for (let h = 0; h < 64; h++) {
      const w = yr(a, 6) ^ yr(a, 11) ^ yr(a, 25), y = g + w + eA(a, c, p) + nA[h] + xs[h] | 0, x = (yr(r, 2) ^ yr(r, 13) ^ yr(r, 22)) + tA(r, s, o) | 0;
      g = p, p = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, p = p + this.G | 0, g = g + this.H | 0, this.set(r, s, o, i, a, c, p, g);
  }
  roundClean() {
    xs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, rA = class extends Jy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const uf = Ho(() => new Jy());
Ho(() => new rA());
const sA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ew = Uint8Array.from({ length: 16 }, (e, t) => t), oA = ew.map((e) => (9 * e + 5) % 16);
let df = [ew], ff = [oA];
for (let e = 0; e < 4; e++)
  for (let t of [df, ff])
    t.push(t[e].map((n) => sA[n]));
const tw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), iA = df.map((e, t) => e.map((n) => tw[t][n])), aA = ff.map((e, t) => e.map((n) => tw[t][n])), cA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), lA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Za = (e, t) => e << t | e >>> 32 - t;
function Ap(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Qa = new Uint32Array(16);
let uA = class extends lf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: o } = this;
    return [t, n, r, s, o];
  }
  set(t, n, r, s, o) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Qa[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, p = this.h3 | 0, g = p, h = this.h4 | 0, w = h;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, x = cA[y], L = lA[y], O = df[y], U = ff[y], v = iA[y], T = aA[y];
      for (let B = 0; B < 16; B++) {
        const z = Za(r + Ap(y, o, a, p) + Qa[O[B]] + x, v[B]) + h | 0;
        r = h, h = p, p = Za(a, 10) | 0, a = o, o = z;
      }
      for (let B = 0; B < 16; B++) {
        const z = Za(s + Ap(S, i, c, g) + Qa[U[B]] + L, T[B]) + w | 0;
        s = w, w = g, g = Za(c, 10) | 0, c = i, i = z;
      }
    }
    this.set(this.h1 + a + g | 0, this.h2 + p + w | 0, this.h3 + h + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Qa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const dA = Ho(() => new uA()), Ja = BigInt(2 ** 32 - 1), td = BigInt(32);
function nw(e, t = !1) {
  return t ? { h: Number(e & Ja), l: Number(e >> td & Ja) } : { h: Number(e >> td & Ja) | 0, l: Number(e & Ja) | 0 };
}
function fA(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = nw(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const hA = (e, t) => BigInt(e >>> 0) << td | BigInt(t >>> 0), pA = (e, t, n) => e >>> n, gA = (e, t, n) => e << 32 - n | t >>> n, yA = (e, t, n) => e >>> n | t << 32 - n, wA = (e, t, n) => e << 32 - n | t >>> n, mA = (e, t, n) => e << 64 - n | t >>> n - 32, bA = (e, t, n) => e >>> n - 32 | t << 64 - n, xA = (e, t) => t, SA = (e, t) => e, vA = (e, t, n) => e << n | t >>> 32 - n, AA = (e, t, n) => t << n | e >>> 32 - n, EA = (e, t, n) => t << n - 32 | e >>> 64 - n, kA = (e, t, n) => e << n - 32 | t >>> 64 - n;
function $A(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const IA = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), LA = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, CA = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), TA = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, BA = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), MA = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, Pe = {
  fromBig: nw,
  split: fA,
  toBig: hA,
  shrSH: pA,
  shrSL: gA,
  rotrSH: yA,
  rotrSL: wA,
  rotrBH: mA,
  rotrBL: bA,
  rotr32H: xA,
  rotr32L: SA,
  rotlSH: vA,
  rotlSL: AA,
  rotlBH: EA,
  rotlBL: kA,
  add: $A,
  add3L: IA,
  add3H: LA,
  add4L: CA,
  add4H: TA,
  add5H: MA,
  add5L: BA
}, [NA, _A] = Pe.split([
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
].map((e) => BigInt(e))), Ss = new Uint32Array(80), vs = new Uint32Array(80);
let kl = class extends lf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: p, El: g, Fh: h, Fl: w, Gh: y, Gl: S, Hh: x, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, p, g, h, w, y, S, x, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, p, g, h, w, y, S, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = p | 0, this.El = g | 0, this.Fh = h | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let v = 0; v < 16; v++, n += 4)
      Ss[v] = t.getUint32(n), vs[v] = t.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const T = Ss[v - 15] | 0, B = vs[v - 15] | 0, z = Pe.rotrSH(T, B, 1) ^ Pe.rotrSH(T, B, 8) ^ Pe.shrSH(T, B, 7), Q = Pe.rotrSL(T, B, 1) ^ Pe.rotrSL(T, B, 8) ^ Pe.shrSL(T, B, 7), W = Ss[v - 2] | 0, K = vs[v - 2] | 0, m = Pe.rotrSH(W, K, 19) ^ Pe.rotrBH(W, K, 61) ^ Pe.shrSH(W, K, 6), E = Pe.rotrSL(W, K, 19) ^ Pe.rotrBL(W, K, 61) ^ Pe.shrSL(W, K, 6), P = Pe.add4L(Q, E, vs[v - 7], vs[v - 16]), N = Pe.add4H(P, z, m, Ss[v - 7], Ss[v - 16]);
      Ss[v] = N | 0, vs[v] = P | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: p, Dl: g, Eh: h, El: w, Fh: y, Fl: S, Gh: x, Gl: L, Hh: O, Hl: U } = this;
    for (let v = 0; v < 80; v++) {
      const T = Pe.rotrSH(h, w, 14) ^ Pe.rotrSH(h, w, 18) ^ Pe.rotrBH(h, w, 41), B = Pe.rotrSL(h, w, 14) ^ Pe.rotrSL(h, w, 18) ^ Pe.rotrBL(h, w, 41), z = h & y ^ ~h & x, Q = w & S ^ ~w & L, W = Pe.add5L(U, B, Q, _A[v], vs[v]), K = Pe.add5H(W, O, T, z, NA[v], Ss[v]), m = W | 0, E = Pe.rotrSH(r, s, 28) ^ Pe.rotrBH(r, s, 34) ^ Pe.rotrBH(r, s, 39), P = Pe.rotrSL(r, s, 28) ^ Pe.rotrBL(r, s, 34) ^ Pe.rotrBL(r, s, 39), N = r & o ^ r & a ^ o & a, V = s & i ^ s & c ^ i & c;
      O = x | 0, U = L | 0, x = y | 0, L = S | 0, y = h | 0, S = w | 0, { h, l: w } = Pe.add(p | 0, g | 0, K | 0, m | 0), p = a | 0, g = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const G = Pe.add3L(m, P, V);
      r = Pe.add3H(G, K, E, N), s = G | 0;
    }
    ({ h: r, l: s } = Pe.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Pe.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = Pe.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: p, l: g } = Pe.add(this.Dh | 0, this.Dl | 0, p | 0, g | 0), { h, l: w } = Pe.add(this.Eh | 0, this.El | 0, h | 0, w | 0), { h: y, l: S } = Pe.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: x, l: L } = Pe.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: O, l: U } = Pe.add(this.Hh | 0, this.Hl | 0, O | 0, U | 0), this.set(r, s, o, i, a, c, p, g, h, w, y, S, x, L, O, U);
  }
  roundClean() {
    Ss.fill(0), vs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, PA = class extends kl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, UA = class extends kl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, HA = class extends kl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ho(() => new kl());
Ho(() => new PA());
const OA = Ho(() => new UA());
Ho(() => new HA());
var Ve;
(function(e) {
  e.Int = "int", e.UInt = "uint", e.Buffer = "buffer", e.BoolTrue = "true", e.BoolFalse = "false", e.PrincipalStandard = "address", e.PrincipalContract = "contract", e.ResponseOk = "ok", e.ResponseErr = "err", e.OptionalNone = "none", e.OptionalSome = "some", e.List = "list", e.Tuple = "tuple", e.StringASCII = "ascii", e.StringUTF8 = "utf8";
})(Ve || (Ve = {}));
var Vt;
(function(e) {
  e[e.int = 0] = "int", e[e.uint = 1] = "uint", e[e.buffer = 2] = "buffer", e[e.true = 3] = "true", e[e.false = 4] = "false", e[e.address = 5] = "address", e[e.contract = 6] = "contract", e[e.ok = 7] = "ok", e[e.err = 8] = "err", e[e.none = 9] = "none", e[e.some = 10] = "some", e[e.list = 11] = "list", e[e.tuple = 12] = "tuple", e[e.ascii = 13] = "ascii", e[e.utf8 = 14] = "utf8";
})(Vt || (Vt = {}));
function hf(e) {
  return Vt[e];
}
const DA = () => ({ type: Ve.BoolTrue }), FA = () => ({ type: Ve.BoolFalse }), jA = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Ve.Buffer, value: Ee(e) };
}, Ep = BigInt("0xffffffffffffffffffffffffffffffff"), RA = BigInt(0), kp = BigInt("0x7fffffffffffffffffffffffffffffff"), $p = BigInt("-170141183460469231731687303715884105728"), zA = (e) => {
  typeof e == "string" && e.toLowerCase().startsWith("0x") && (e = Nu(Ze(e))), kn(e, Uint8Array) && (e = Nu(e));
  const t = dn(e);
  if (t > kp)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${kp}`);
  if (t < $p)
    throw new RangeError(`Cannot construct clarity integer form value less than ${$p}`);
  return { type: Ve.Int, value: t };
}, GA = (e) => {
  const t = dn(e);
  if (t < RA)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > Ep)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Ep}`);
  return { type: Ve.UInt, value: t };
};
function KA(e) {
  return { type: Ve.List, value: e };
}
function rw() {
  return { type: Ve.OptionalNone };
}
function sw(e) {
  return { type: Ve.OptionalSome, value: e };
}
var le;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(le || (le = {}));
function VA() {
  return {
    type: le.Address,
    version: $o.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Ip(e) {
  if (e && hw(e, Gc))
    throw new Error(`Memo exceeds maximum length of ${Gc} bytes`);
  return { type: le.MemoString, content: e };
}
function pf(e, t) {
  return {
    type: le.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function nd(e) {
  if (Ze(e).byteLength != Al)
    throw Error("Invalid signature");
  return {
    type: le.MessageSignature,
    data: e
  };
}
function qA(e, t, n) {
  return typeof e == "string" && (e = lE(e)), typeof n == "string" && (n = Ip(n)), {
    type: le.Payload,
    payloadType: ot.TokenTransfer,
    recipient: e,
    amount: dn(t),
    memo: n ?? Ip("")
  };
}
function YA(e, t, n, r) {
  return typeof t == "string" && (t = ur(t)), typeof n == "string" && (n = ur(n)), {
    type: le.Payload,
    payloadType: ot.ContractCall,
    contractAddress: typeof e == "string" ? js(e) : e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function XA(e) {
  return ur(e, 4, 1e5);
}
function Lp(e, t, n) {
  return typeof e == "string" && (e = ur(e)), typeof t == "string" && (t = XA(t)), typeof n == "number" ? {
    type: le.Payload,
    payloadType: ot.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: le.Payload,
    payloadType: ot.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function WA() {
  return { type: le.Payload, payloadType: ot.PoisonMicroblock };
}
function Cp(e, t) {
  if (e.byteLength != fo)
    throw Error(`Coinbase buffer size must be ${fo} bytes`);
  return t != null ? {
    type: le.Payload,
    payloadType: ot.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: le.Payload,
    payloadType: ot.Coinbase,
    coinbaseBytes: e
  };
}
function ZA(e, t, n) {
  if (e.byteLength != fo)
    throw Error(`Coinbase buffer size must be ${fo} bytes`);
  if (n.byteLength != Xu)
    throw Error(`VRF proof buffer size must be ${Xu} bytes`);
  return {
    type: le.Payload,
    payloadType: ot.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === Ve.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
function QA(e, t, n, r, s, o, i) {
  return {
    type: le.Payload,
    payloadType: ot.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: o,
    publicKeyHash: i
  };
}
function ur(e, t, n) {
  const r = t || 1, s = n || Pv;
  if (hw(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: le.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function JA(e, t, n) {
  return {
    type: le.Asset,
    address: js(e),
    contractName: ur(t),
    assetName: ur(n)
  };
}
function js(e) {
  const t = Uo.c32addressDecode(e);
  return {
    type: le.Address,
    version: t[0],
    hash160: t[1]
  };
}
function eE(e, t) {
  const n = js(e), r = ur(t);
  return {
    type: le.Principal,
    prefix: bn.Contract,
    address: n,
    contractName: r
  };
}
function tE(e) {
  const t = js(e);
  return {
    type: le.Principal,
    prefix: bn.Standard,
    address: t
  };
}
function di(e, t) {
  return {
    pubKeyEncoding: e,
    type: le.TransactionAuthField,
    contents: t
  };
}
function Dr(e) {
  switch (e.type) {
    case le.Address:
      return Ta(e);
    case le.Principal:
      return ow(e);
    case le.LengthPrefixedString:
      return Ci(e);
    case le.MemoString:
      return rE(e);
    case le.Asset:
      return aw(e);
    case le.PostCondition:
      return lw(e);
    case le.PublicKey:
      return od(e);
    case le.LengthPrefixedList:
      return gf(e);
    case le.Payload:
      return uw(e);
    case le.TransactionAuthField:
      return cE(e);
    case le.MessageSignature:
      return yf(e);
  }
}
function Ta(e) {
  const t = [];
  return t.push(Ze(Ea(e.version, 1))), t.push(Ze(e.hash160)), Rt(t);
}
function Li(e) {
  const t = kn(e, yt) ? e : new yt(e), n = ul(Ee(t.readBytes(1))), r = Ee(t.readBytes(20));
  return { type: le.Address, version: n, hash160: r };
}
function ow(e) {
  const t = [];
  return t.push(e.prefix), (e.prefix === bn.Standard || e.prefix === bn.Contract) && t.push(Ta(e.address)), e.prefix === bn.Contract && t.push(Ci(e.contractName)), Rt(t);
}
function nE(e) {
  const t = kn(e, yt) ? e : new yt(e), n = t.readUInt8Enum(bn, (o) => {
    throw new wn(`Unexpected Principal payload type: ${o}`);
  });
  if (n === bn.Origin)
    return { type: le.Principal, prefix: n };
  const r = Li(t);
  if (n === bn.Standard)
    return { type: le.Principal, prefix: n, address: r };
  const s = Yn(t);
  return {
    type: le.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Ci(e) {
  const t = [], n = Mo(e.content), r = n.byteLength;
  return t.push(Ze(Ea(r, e.lengthPrefixBytes))), t.push(n), Rt(t);
}
function Yn(e, t, n) {
  t = t || 1;
  const r = kn(e, yt) ? e : new yt(e), s = ul(Ee(r.readBytes(t))), o = ka(r.readBytes(s));
  return ur(o, t, n ?? 128);
}
function rE(e) {
  const t = [], n = Mo(e.content), r = BE(Ee(n), Gc * 2);
  return t.push(Ze(r)), Rt(t);
}
function iw(e) {
  const t = kn(e, yt) ? e : new yt(e);
  let n = ka(t.readBytes(Gc));
  return n = n.replace(/\u0000*$/, ""), { type: le.MemoString, content: n };
}
function aw(e) {
  const t = [];
  return t.push(Ta(e.address)), t.push(Ci(e.contractName)), t.push(Ci(e.assetName)), Rt(t);
}
function rd(e) {
  const t = kn(e, yt) ? e : new yt(e);
  return {
    type: le.Asset,
    address: Li(t),
    contractName: Yn(t),
    assetName: Yn(t)
  };
}
function gf(e) {
  const t = e.values, n = [];
  n.push(Ze(Ea(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(Dr(r));
  return Rt(n);
}
function cw(e, t, n) {
  const r = kn(e, yt) ? e : new yt(e), s = ul(Ee(r.readBytes(4))), o = [];
  for (let i = 0; i < s; i++)
    switch (t) {
      case le.Address:
        o.push(Li(r));
        break;
      case le.LengthPrefixedString:
        o.push(Yn(r));
        break;
      case le.MemoString:
        o.push(iw(r));
        break;
      case le.Asset:
        o.push(rd(r));
        break;
      case le.PostCondition:
        o.push(oE(r));
        break;
      case le.PublicKey:
        o.push(id(r));
        break;
      case le.TransactionAuthField:
        o.push(aE(r));
        break;
    }
  return pf(o, n);
}
function sE(e) {
  return Ee(lw(e));
}
function lw(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(ow(e.principal)), (e.conditionType === St.Fungible || e.conditionType === St.NonFungible) && t.push(aw(e.asset)), e.conditionType === St.NonFungible && t.push(kr(e.assetName)), t.push(e.conditionCode), e.conditionType === St.STX || e.conditionType === St.Fungible || e.conditionType === St.Staking) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new ui("The post-condition amount may not be larger than 8 bytes");
    t.push(Ds(e.amount, 8));
  }
  return Rt(t);
}
function oE(e) {
  const t = kn(e, yt) ? e : new yt(e), n = t.readUInt8Enum(St, (a) => {
    throw new wn(`Could not read ${a} as PostConditionType`);
  }), r = nE(t);
  let s, o, i;
  switch (n) {
    case St.STX:
      return s = t.readUInt8Enum(aa, (c) => {
        throw new wn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ee(t.readBytes(8))}`), {
        type: le.PostCondition,
        conditionType: St.STX,
        principal: r,
        conditionCode: s,
        amount: i
      };
    case St.Fungible:
      return o = rd(t), s = t.readUInt8Enum(aa, (c) => {
        throw new wn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ee(t.readBytes(8))}`), {
        type: le.PostCondition,
        conditionType: St.Fungible,
        principal: r,
        conditionCode: s,
        amount: i,
        asset: o
      };
    case St.NonFungible:
      o = rd(t);
      const a = vr(t);
      return s = t.readUInt8Enum(Zu, (c) => {
        throw new wn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: le.PostCondition,
        conditionType: St.NonFungible,
        principal: r,
        conditionCode: s,
        asset: o,
        assetName: a
      };
    case St.Staking:
      return s = t.readUInt8Enum(aa, (c) => {
        throw new wn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ee(t.readBytes(8))}`), {
        type: le.PostCondition,
        conditionType: St.Staking,
        principal: r,
        conditionCode: s,
        amount: i
      };
    case St.PoX: {
      const c = t.readUInt8Enum(Qu, (p) => {
        throw new wn(`Could not read ${p} as PoxConditionCode`);
      });
      return {
        type: le.PostCondition,
        conditionType: St.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function uw(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case ot.TokenTransfer:
      t.push(kr(e.recipient)), t.push(Ds(e.amount, 8)), t.push(Dr(e.memo));
      break;
    case ot.ContractCall:
      t.push(Dr(e.contractAddress)), t.push(Dr(e.contractName)), t.push(Dr(e.functionName));
      const n = new Uint8Array(4);
      yo(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(kr(r));
      });
      break;
    case ot.SmartContract:
      t.push(Dr(e.contractName)), t.push(Dr(e.codeBody));
      break;
    case ot.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(Dr(e.contractName)), t.push(Dr(e.codeBody));
      break;
    case ot.PoisonMicroblock:
      break;
    case ot.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case ot.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(kr(e.recipient));
      break;
    case ot.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(kr(e.recipient ? sw(e.recipient) : rw())), t.push(e.vrfProof);
      break;
    case ot.TenureChange:
      t.push(Ze(e.tenureHash)), t.push(Ze(e.previousTenureHash)), t.push(Ze(e.burnViewHash)), t.push(Ze(e.previousTenureEnd)), t.push(yo(new Uint8Array(4), e.previousTenureBlocks)), t.push(n1(new Uint8Array(1), e.cause)), t.push(Ze(e.publicKeyHash));
      break;
  }
  return Rt(t);
}
function iE(e) {
  const t = kn(e, yt) ? e : new yt(e);
  switch (t.readUInt8Enum(ot, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case ot.TokenTransfer:
      const r = vr(t), s = dn(t.readBytes(8)), o = iw(t);
      return qA(r, s, o);
    case ot.ContractCall:
      const i = Li(t), a = Yn(t), c = Yn(t), p = [], g = t.readUInt32BE();
      for (let T = 0; T < g; T++) {
        const B = vr(t);
        p.push(B);
      }
      return YA(i, a, c, p);
    case ot.SmartContract:
      const h = Yn(t), w = Yn(t, 4, 1e5);
      return Lp(h, w);
    case ot.VersionedSmartContract: {
      const T = t.readUInt8Enum(Wu, (Q) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Q}`);
      }), B = Yn(t), z = Yn(t, 4, Vv);
      return Lp(B, z, T);
    }
    case ot.PoisonMicroblock:
      return WA();
    case ot.Coinbase: {
      const T = t.readBytes(fo);
      return Cp(T);
    }
    case ot.CoinbaseToAltRecipient: {
      const T = t.readBytes(fo), B = vr(t);
      return Cp(T, B);
    }
    case ot.NakamotoCoinbase: {
      const T = t.readBytes(fo), B = vr(t), z = t.readBytes(Xu);
      return ZA(T, B, z);
    }
    case ot.TenureChange:
      const y = Ee(t.readBytes(20)), S = Ee(t.readBytes(20)), x = Ee(t.readBytes(20)), L = Ee(t.readBytes(32)), O = t.readUInt32BE(), U = t.readUInt8Enum(Ju, (T) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${T}`);
      }), v = Ee(t.readBytes(20));
      return QA(y, S, x, L, O, U, v);
  }
}
function sd(e) {
  const t = kn(e, yt) ? e : new yt(e);
  return nd(Ee(t.readBytes(Al)));
}
function aE(e) {
  const t = kn(e, yt) ? e : new yt(e), n = t.readUInt8Enum(or, (r) => {
    throw new wn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case or.PublicKeyCompressed:
      return di($t.Compressed, id(t));
    case or.PublicKeyUncompressed:
      return di($t.Uncompressed, Hi(RE(id(t).data)));
    case or.SignatureCompressed:
      return di($t.Compressed, sd(t));
    case or.SignatureUncompressed:
      return di($t.Uncompressed, sd(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function yf(e) {
  return Ze(e.data);
}
function cE(e) {
  const t = [];
  switch (e.contents.type) {
    case le.PublicKey:
      t.push(e.pubKeyEncoding === $t.Compressed ? or.PublicKeyCompressed : or.PublicKeyUncompressed), t.push(Ze(jE(e.contents.data)));
      break;
    case le.MessageSignature:
      t.push(e.pubKeyEncoding === $t.Compressed ? or.SignatureCompressed : or.SignatureUncompressed), t.push(yf(e.contents));
      break;
  }
  return Rt(t);
}
function od(e) {
  return e.data.slice();
}
function id(e) {
  const t = kn(e, yt) ? e : new yt(e), n = t.readUInt8(), r = n === 4 ? Ov : Hv;
  return Hi(Rt([n, t.readBytes(r)]));
}
function wf(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === ht.P2PKH || t === ht.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === ht.P2WPKH || t === ht.P2WSH || t === ht.P2WSHNonSequential) && !r.map((s) => s.data).every(Oi))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case ht.P2PKH:
      return ec(e, ME(r[0].data));
    case ht.P2WPKH:
      return ec(e, NE(r[0].data));
    case ht.P2SH:
    case ht.P2SHNonSequential:
      return ec(e, _E(n, r.map(od)));
    case ht.P2WSH:
    case ht.P2WSHNonSequential:
      return ec(e, PE(n, r.map(od)));
  }
}
function ec(e, t) {
  return { type: le.Address, version: e, hash160: t };
}
function mf(e) {
  return Uo.c32address(e.version, e.hash160);
}
function Tp(e) {
  const [t, n, r] = e.split(/\.|::/);
  return JA(t, n, r);
}
function Wi(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return eE(t, n);
  } else
    return tE(e);
}
function lE(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return fE(t, n);
  } else
    return uE(e);
}
function uE(e) {
  const t = js(e);
  return { type: Ve.PrincipalStandard, value: mf(t) };
}
function dE(e) {
  return { type: Ve.PrincipalStandard, value: mf(e) };
}
function fE(e, t) {
  const n = js(e), r = ur(t);
  return dw(n, r);
}
function dw(e, t) {
  if (Mo(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Ve.PrincipalContract,
    value: `${mf(e)}.${t.content}`
  };
}
function hE(e) {
  return { type: Ve.ResponseErr, value: e };
}
function pE(e) {
  return { type: Ve.ResponseOk, value: e };
}
const gE = (e) => ({ type: Ve.StringASCII, value: e }), yE = (e) => ({ type: Ve.StringUTF8, value: e });
function wE(e) {
  for (const t in e)
    if (!UE(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: Ve.Tuple, value: e };
}
function vr(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new yt(Ze(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new yt(e) : t = e;
  switch (t.readUInt8Enum(Vt, (r) => {
    throw new wn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Vt.int:
      return zA(Nu(t.readBytes(16)));
    case Vt.uint:
      return GA(t.readBytes(16));
    case Vt.buffer:
      const r = t.readUInt32BE();
      return jA(t.readBytes(r));
    case Vt.true:
      return DA();
    case Vt.false:
      return FA();
    case Vt.address:
      const s = Li(t);
      return dE(s);
    case Vt.contract:
      const o = Li(t), i = Yn(t);
      return dw(o, i);
    case Vt.ok:
      return pE(vr(t));
    case Vt.err:
      return hE(vr(t));
    case Vt.none:
      return rw();
    case Vt.some:
      return sw(vr(t));
    case Vt.list:
      const a = t.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(vr(t));
      return KA(c);
    case Vt.tuple:
      const p = t.readUInt32BE(), g = {};
      for (let x = 0; x < p; x++) {
        const L = Yn(t).content;
        if (L === void 0)
          throw new wn('"content" is undefined');
        g[L] = vr(t);
      }
      return wE(g);
    case Vt.ascii:
      const h = t.readUInt32BE(), w = Yb(t.readBytes(h));
      return gE(w);
    case Vt.utf8:
      const y = t.readUInt32BE(), S = ka(t.readBytes(y));
      return yE(S);
    default:
      throw new wn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Cr(e, t) {
  return Rt([hf(e), t]);
}
function mE(e) {
  return new Uint8Array([hf(e.type)]);
}
function bE(e) {
  return e.type === Ve.OptionalNone ? new Uint8Array([hf(e.type)]) : Cr(e.type, kr(e.value));
}
function xE(e) {
  const t = new Uint8Array(4);
  return yo(t, Math.ceil(e.value.length / 2), 0), Cr(e.type, Ir(t, Ze(e.value)));
}
function SE(e) {
  const t = Dd(zb(BigInt(e.value), BigInt(Uv)), Yy);
  return Cr(e.type, t);
}
function vE(e) {
  const t = Dd(BigInt(e.value), Yy);
  return Cr(e.type, t);
}
function AE(e) {
  return Cr(e.type, Ta(js(e.value)));
}
function EE(e) {
  const [t, n] = HE(e.value);
  return Cr(e.type, Ir(Ta(js(t)), Ci(ur(n))));
}
function kE(e) {
  return Cr(e.type, kr(e.value));
}
function $E(e) {
  const t = [], n = new Uint8Array(4);
  yo(n, e.value.length, 0), t.push(n);
  for (const r of e.value) {
    const s = kr(r);
    t.push(s);
  }
  return Cr(e.type, Rt(t));
}
function IE(e) {
  const t = [], n = new Uint8Array(4);
  yo(n, Object.keys(e.value).length, 0), t.push(n);
  const r = Object.keys(e.value).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = ur(s);
    t.push(Ci(o));
    const i = kr(e.value[s]);
    t.push(i);
  }
  return Cr(e.type, Rt(t));
}
function fw(e, t) {
  const n = [], r = t == "ascii" ? qb(e.value) : Mo(e.value), s = new Uint8Array(4);
  return yo(s, r.length, 0), n.push(s), n.push(r), Cr(e.type, Rt(n));
}
function LE(e) {
  return fw(e, "ascii");
}
function CE(e) {
  return fw(e, "utf8");
}
function Bp(e) {
  return Ee(kr(e));
}
function kr(e) {
  switch (e.type) {
    case Ve.BoolTrue:
    case Ve.BoolFalse:
      return mE(e);
    case Ve.OptionalNone:
    case Ve.OptionalSome:
      return bE(e);
    case Ve.Buffer:
      return xE(e);
    case Ve.UInt:
      return vE(e);
    case Ve.Int:
      return SE(e);
    case Ve.PrincipalStandard:
      return AE(e);
    case Ve.PrincipalContract:
      return EE(e);
    case Ve.ResponseOk:
    case Ve.ResponseErr:
      return kE(e);
    case Ve.List:
      return $E(e);
    case Ve.Tuple:
      return IE(e);
    case Ve.StringASCII:
      return LE(e);
    case Ve.StringUTF8:
      return CE(e);
    default:
      throw new ui("Unable to serialize. Invalid Clarity Value.");
  }
}
const TE = (e) => e.length % 2 ? `0${e}` : e, BE = (e, t) => e.padEnd(t, "0"), hw = (e, t) => e ? Mo(e).length > t : !1;
function ad(e) {
  return Gy(e);
}
const ha = (e) => dA(uf(e)), bf = (e) => Ee(OA(e)), ME = (e) => Ee(ha(e)), NE = (e) => {
  const t = ha(e), n = Ir(new Uint8Array([0]), new Uint8Array([t.length]), t), r = ha(n);
  return Ee(r);
}, _E = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + t.length), n.push(174);
  const r = Rt(n), s = ha(r);
  return Ee(s);
}, PE = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = Rt(n), s = uf(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const i = Rt(o), a = ha(i);
  return Ee(a);
};
function UE(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function HE(e) {
  const [t, n] = e.split(".");
  if (!t || !n)
    throw new Error(`Invalid contract identifier: ${e}`);
  return [t, n];
}
Pt.hmacSha256Sync = (e, ...t) => {
  const n = Qy.create(uf, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Hi(e) {
  return e = typeof e == "string" ? Ze(e) : e, {
    type: le.PublicKey,
    data: e
  };
}
function OE(e, t, n = $t.Compressed) {
  const r = Qb(t), s = new Hn(Bh(r.r), Bh(r.s)), o = Fe.fromSignature(e, s, r.recoveryId), i = n === $t.Compressed;
  return o.toHex(i);
}
function DE(e) {
  return typeof e == "string" ? e : Ee(e);
}
const xf = DE;
function pw(e) {
  return (typeof e == "string" ? e.length / 2 : e.byteLength) === Zb;
}
function Oi(e) {
  return !xf(e).startsWith("04");
}
function FE(e) {
  e = Fd(e);
  const t = pw(e);
  return Ee($a(e.slice(0, 32), t));
}
function jE(e) {
  return Fe.fromHex(xf(e)).toHex(!0);
}
function RE(e) {
  return Fe.fromHex(xf(e)).toHex(!1);
}
function zE(e, t) {
  e = Fd(e);
  const [n, r] = fl(t, e.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Ea(r, 1) + Hn.fromHex(n).toCompactHex();
}
function Sf() {
  return {
    type: le.MessageSignature,
    data: Ee(new Uint8Array(Al))
  };
}
function gw(e, t, n, r) {
  const s = wf(0, e, 1, [Hi(t)]).hash160, o = Oi(t) ? $t.Compressed : $t.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: dn(n),
    fee: dn(r),
    keyEncoding: o,
    signature: Sf()
  };
}
function pa(e) {
  return "signature" in e;
}
function Mp(e) {
  return e === ht.P2SH || e === ht.P2WSH;
}
function GE(e) {
  return e === ht.P2SHNonSequential || e === ht.P2WSHNonSequential;
}
function Np(e) {
  const t = ad(e);
  return t.nonce = 0, t.fee = 0, pa(t) ? t.signature = Sf() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function KE(e) {
  const t = [
    e.hashMode,
    Ze(e.signer),
    Ds(e.nonce, 8),
    Ds(e.fee, 8),
    e.keyEncoding,
    yf(e.signature)
  ];
  return Rt(t);
}
function VE(e) {
  const t = [
    e.hashMode,
    Ze(e.signer),
    Ds(e.nonce, 8),
    Ds(e.fee, 8)
  ], n = pf(e.fields);
  t.push(gf(n));
  const r = new Uint8Array(2);
  return e1(r, e.signaturesRequired, 0), t.push(r), Rt(t);
}
function qE(e, t) {
  const n = Ee(t.readBytes(20)), r = BigInt(`0x${Ee(t.readBytes(8))}`), s = BigInt(`0x${Ee(t.readBytes(8))}`), o = t.readUInt8Enum($t, (a) => {
    throw new wn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === ht.P2WPKH && o != $t.Compressed)
    throw new wn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = sd(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: o,
    signature: i
  };
}
function YE(e, t) {
  const n = Ee(t.readBytes(20)), r = BigInt("0x" + Ee(t.readBytes(8))), s = BigInt("0x" + Ee(t.readBytes(8))), o = cw(t, le.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const p of o)
    switch (p.contents.type) {
      case le.PublicKey:
        Oi(p.contents.data) || (i = !0);
        break;
      case le.MessageSignature:
        if (p.pubKeyEncoding === $t.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new ao("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === ht.P2WSH || e === ht.P2WSHNonSequential))
    throw new ao("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    fields: o,
    signaturesRequired: c
  };
}
function nu(e) {
  return pa(e) ? KE(e) : VE(e);
}
function ru(e) {
  const t = e.readUInt8Enum(ht, (n) => {
    throw new wn(`Could not parse ${n} as AddressHashMode`);
  });
  return t === ht.P2PKH || t === ht.P2WPKH ? qE(t, e) : YE(t, e);
}
function yw(e, t, n, r) {
  const o = e + Ee(new Uint8Array([t])) + Ee(Ds(n, 8)) + Ee(Ds(r, 8));
  if (Ze(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return bf(Ze(o));
}
function ww(e, t, n) {
  const r = 33 + Al, s = Oi(t.data) ? $t.Compressed : $t.Uncompressed, o = e + TE(s.toString(16)) + n, i = Ze(o);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return bf(i);
}
function XE(e, t, n, r, s) {
  const o = yw(e, t, n, r), i = zE(s, o), a = Hi(FE(s)), c = ww(o, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function mw(e, t, n, r, s, o) {
  const i = yw(e, t, n, r), a = Hi(OE(i, o, s)), c = ww(i, a, o);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function WE() {
  const e = gw(ht.P2PKH, "", 0, 0);
  return e.signer = VA().hash160, e.keyEncoding = $t.Compressed, e.signature = Sf(), e;
}
function _p(e, t, n) {
  return pa(e) ? ZE(e, t, n) : QE(e, t, n);
}
function ZE(e, t, n) {
  const { pubKey: r, nextSigHash: s } = mw(t, n, e.fee, e.nonce, e.keyEncoding, e.signature.data), o = wf(0, e.hashMode, 1, [r]).hash160;
  if (o !== e.signer)
    throw new ao(`Signer hash does not equal hash of public key(s): ${o} != ${e.signer}`);
  return s;
}
function QE(e, t, n) {
  const r = [];
  let s = t, o = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case le.PublicKey:
        Oi(c.contents.data) || (o = !0), r.push(c.contents);
        break;
      case le.MessageSignature:
        c.pubKeyEncoding === $t.Uncompressed && (o = !0);
        const { pubKey: p, nextSigHash: g } = mw(s, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents.data);
        if (Mp(e.hashMode) && (s = g), r.push(p), i += 1, i === 65536)
          throw new ao("Too many signatures");
        break;
    }
  if (Mp(e.hashMode) && i !== e.signaturesRequired || GE(e.hashMode) && i < e.signaturesRequired)
    throw new ao("Incorrect number of signatures");
  if (o && (e.hashMode === ht.P2WSH || e.hashMode === ht.P2WSHNonSequential))
    throw new ao("Uncompressed keys are not allowed in this hash mode");
  const a = wf(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new ao(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return s;
}
function bw(e) {
  return {
    authType: Nt.Standard,
    spendingCondition: e
  };
}
function xw(e, t) {
  return {
    authType: Nt.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || gw(ht.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Pp(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case Nt.Standard:
        return bw(Np(e.spendingCondition));
      case Nt.Sponsored:
        return xw(Np(e.spendingCondition), WE());
      default:
        throw new Vc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function JE(e, t) {
  switch (e.authType) {
    case Nt.Standard:
      return _p(e.spendingCondition, t, Nt.Standard);
    case Nt.Sponsored:
      return _p(e.spendingCondition, t, Nt.Standard);
    default:
      throw new Vc("Invalid origin auth type");
  }
}
function e3(e, t) {
  switch (e.authType) {
    case Nt.Standard:
      const n = {
        ...e.spendingCondition,
        fee: dn(t)
      };
      return { ...e, spendingCondition: n };
    case Nt.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: dn(t)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function t3(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: dn(t)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function n3(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: dn(t)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function r3(e, t) {
  const n = {
    ...t,
    nonce: dn(t.nonce),
    fee: dn(t.fee)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function s3(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case Nt.Standard:
      t.push(nu(e.spendingCondition));
      break;
    case Nt.Sponsored:
      t.push(nu(e.spendingCondition)), t.push(nu(e.sponsorSpendingCondition));
      break;
  }
  return Rt(t);
}
function o3(e) {
  const t = e.readUInt8Enum(Nt, (r) => {
    throw new wn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case Nt.Standard:
      return n = ru(e), bw(n);
    case Nt.Sponsored:
      n = ru(e);
      const r = ru(e);
      return xw(n, r);
  }
}
class i3 {
  constructor({ auth: t, payload: n, postConditions: r = pf([]), postConditionMode: s = Kc.Deny, transactionVersion: o, chainId: i, network: a = "mainnet" }) {
    a = Nv(a), this.transactionVersion = o ?? a.transactionVersion, this.chainId = i ?? a.chainId, this.auth = t, "amount" in n ? this.payload = {
      ...n,
      amount: dn(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Nn.Any;
  }
  signBegin() {
    const t = ad(this);
    return t.auth = Pp(t.auth), t.txid();
  }
  verifyBegin() {
    const t = ad(this);
    return t.auth = Pp(t.auth), t.txid();
  }
  verifyOrigin() {
    return JE(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, Nt.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === Nt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, Nt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = typeof t == "object" && "type" in t ? t : Hi(t), r = this.auth.spendingCondition;
    if (r && !pa(r)) {
      const s = Oi(n.data);
      r.fields.push(di(s ? $t.Compressed : $t.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: o, nextSigHash: i } = XE(n, r, t.fee, t.nonce, s);
    if (pa(t))
      t.signature = nd(o);
    else {
      const a = pw(s);
      t.fields.push(di(a ? $t.Compressed : $t.Uncompressed, nd(o)));
    }
    return i;
  }
  txid() {
    const t = this.serializeBytes();
    return bf(t);
  }
  setSponsor(t) {
    if (this.auth.authType != Nt.Sponsored)
      throw new Vc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = r3(this.auth, t);
  }
  setFee(t) {
    this.auth = e3(this.auth, t);
  }
  setNonce(t) {
    this.auth = t3(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != Nt.Sponsored)
      throw new Vc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = n3(this.auth, t);
  }
  serialize() {
    return Ee(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new ui('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new ui('"chainId" is undefined');
    if (this.auth === void 0)
      throw new ui('"auth" is undefined');
    if (this.payload === void 0)
      throw new ui('"payload" is undefined');
    const t = [];
    t.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return yo(n, this.chainId, 0), t.push(n), t.push(s3(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(gf(this.postConditions)), t.push(uw(this.payload)), Rt(t);
  }
}
function a3(e) {
  const t = kn(e, yt) ? e : new yt(e), n = t.readUInt8Enum(ko, (g) => {
    throw new Error(`Could not parse ${g} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = o3(t), o = t.readUInt8Enum(Nn, (g) => {
    throw new Error(`Could not parse ${g} as AnchorMode`);
  }), i = t.readUInt8Enum(Kc, (g) => {
    throw new Error(`Could not parse ${g} as PostConditionMode`);
  }), a = cw(t, le.PostCondition), c = iE(t), p = new i3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: i
  });
  return p.anchorMode = o, p;
}
const Up = BigInt("18446744073709551615");
function su(e) {
  const t = dn(e);
  if (t < 0n || t > Up)
    throw new RangeError(`Post-condition amount must be between 0 and ${Up} (u64 max), received: ${t}`);
  return t;
}
var cd;
(function(e) {
  e[e.eq = 1] = "eq", e[e.gt = 2] = "gt", e[e.lt = 4] = "lt", e[e.gte = 3] = "gte", e[e.lte = 5] = "lte", e[e.sent = 16] = "sent", e[e["not-sent"] = 17] = "not-sent", e[e["maybe-sent"] = 18] = "maybe-sent";
})(cd || (cd = {}));
var ld;
(function(e) {
  e[e["will-not-perform"] = 48] = "will-not-perform", e[e["may-perform"] = 49] = "may-perform", e[e["will-perform"] = 50] = "will-perform";
})(ld || (ld = {}));
function c3(e) {
  switch (e.type) {
    case "stx-postcondition":
      return {
        type: le.PostCondition,
        conditionType: St.STX,
        principal: e.address === "origin" ? { type: le.Principal, prefix: bn.Origin } : Wi(e.address),
        conditionCode: tc(e.condition),
        amount: su(e.amount)
      };
    case "ft-postcondition":
      return {
        type: le.PostCondition,
        conditionType: St.Fungible,
        principal: e.address === "origin" ? { type: le.Principal, prefix: bn.Origin } : Wi(e.address),
        conditionCode: tc(e.condition),
        amount: su(e.amount),
        asset: Tp(e.asset)
      };
    case "nft-postcondition":
      return {
        type: le.PostCondition,
        conditionType: St.NonFungible,
        principal: e.address === "origin" ? { type: le.Principal, prefix: bn.Origin } : Wi(e.address),
        conditionCode: tc(e.condition),
        asset: Tp(e.asset),
        assetName: e.assetId
      };
    case "staking-postcondition":
      return {
        type: le.PostCondition,
        conditionType: St.Staking,
        principal: e.address === "origin" ? { type: le.Principal, prefix: bn.Origin } : Wi(e.address),
        conditionCode: tc(e.condition),
        amount: su(e.amount)
      };
    case "pox-postcondition":
      return {
        type: le.PostCondition,
        conditionType: St.PoX,
        principal: e.address === "origin" ? { type: le.Principal, prefix: bn.Origin } : Wi(e.address),
        conditionCode: l3(e.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function tc(e) {
  return cd[e];
}
function l3(e) {
  return ld[e];
}
function Sw(e) {
  const t = c3(e);
  return sE(t);
}
function u3(e, t, n) {
  return Af(vw(e), n);
}
function vw(e, t) {
  let n = e;
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
      r = r.padStart(r.length + r.length % 2, "0"), n = ga(r);
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
    return BigInt(`0x${h3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function vf(e, t = 8) {
  return (typeof e == "bigint" ? e : vw(e)).toString(16).padStart(t * 2, "0");
}
function Af(e, t = 16) {
  const n = vf(e, t);
  return ga(n);
}
function d3(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
const f3 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function h3(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += f3[n];
  return t;
}
function ga(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, o = t.slice(s, s + 2), i = Number.parseInt(o, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    n[r] = i;
  }
  return n;
}
function Ef(e) {
  return new TextEncoder().encode(e);
}
function p3(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function g3(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function Hp(e) {
  if (e.some(g3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function kf(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function Wr(e) {
  return kf(...e.map((t) => typeof t == "number" ? Hp([t]) : t instanceof Array ? Hp(t) : t));
}
function $l(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var ud;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(ud || (ud = {}));
ud.Mainnet;
const y3 = 128, w3 = 128, Aw = 16;
var dd;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(dd || (dd = {}));
var Op;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Op || (Op = {}));
var Dp;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(Dp || (Dp = {}));
var nr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(nr || (nr = {}));
const ou = ["onChainOnly", "offChainOnly", "any"];
ou[0] + "", nr.OnChainOnly, ou[1] + "", nr.OffChainOnly, ou[2] + "", nr.Any, nr.OnChainOnly + "", nr.OnChainOnly, nr.OffChainOnly + "", nr.OffChainOnly, nr.Any + "", nr.Any;
var fd;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(fd || (fd = {}));
fd.Mainnet;
var Fp;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(Fp || (Fp = {}));
var ro;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(ro || (ro = {}));
var jp;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(jp || (jp = {}));
var Rp;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Rp || (Rp = {}));
var zp;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(zp || (zp = {}));
var Gp;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Gp || (Gp = {}));
var Kp;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Kp || (Kp = {}));
var Vp;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(Vp || (Vp = {}));
var hd;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(hd || (hd = {}));
var qp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(qp || (qp = {}));
var Yp;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(Yp || (Yp = {}));
function pd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function m3(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Ew(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function b3(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  pd(e.outputLen), pd(e.blockLen);
}
function x3(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function S3(e, t) {
  Ew(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const iu = {
  number: pd,
  bool: m3,
  bytes: Ew,
  hash: b3,
  exists: x3,
  output: S3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const au = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), wr = (e, t) => e << 32 - t | e >>> t, v3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!v3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function A3(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function kw(e) {
  if (typeof e == "string" && (e = A3(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let E3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Oo(e) {
  const t = (r) => e().update(kw(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function k3(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, p = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + p, a, r);
}
let $f = class extends E3 {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = au(this.buffer);
  }
  update(t) {
    iu.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = kw(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = au(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    iu.exists(this), iu.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let h = i; h < s; h++)
      n[h] = 0;
    k3(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = au(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const p = c / 4, g = this.get();
    if (p > g.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < p; h++)
      a.setUint32(4 * h, g[h], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = o, t.destroyed = i, s % n && t.buffer.set(r), t;
  }
};
const $3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), $w = Uint8Array.from({ length: 16 }, (e, t) => t), I3 = $w.map((e) => (9 * e + 5) % 16);
let If = [$w], Lf = [I3];
for (let e = 0; e < 4; e++)
  for (let t of [If, Lf])
    t.push(t[e].map((n) => $3[n]));
const Iw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), L3 = If.map((e, t) => e.map((n) => Iw[t][n])), C3 = Lf.map((e, t) => e.map((n) => Iw[t][n])), T3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), B3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), nc = (e, t) => e << t | e >>> 32 - t;
function Xp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const rc = new Uint32Array(16);
let M3 = class extends $f {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: o } = this;
    return [t, n, r, s, o];
  }
  set(t, n, r, s, o) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      rc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, p = this.h3 | 0, g = p, h = this.h4 | 0, w = h;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, x = T3[y], L = B3[y], O = If[y], U = Lf[y], v = L3[y], T = C3[y];
      for (let B = 0; B < 16; B++) {
        const z = nc(r + Xp(y, o, a, p) + rc[O[B]] + x, v[B]) + h | 0;
        r = h, h = p, p = nc(a, 10) | 0, a = o, o = z;
      }
      for (let B = 0; B < 16; B++) {
        const z = nc(s + Xp(S, i, c, g) + rc[U[B]] + L, T[B]) + w | 0;
        s = w, w = g, g = nc(c, 10) | 0, c = i, i = z;
      }
    }
    this.set(this.h1 + a + g | 0, this.h2 + p + w | 0, this.h3 + h + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    rc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Oo(() => new M3());
const N3 = (e, t, n) => e & t ^ ~e & n, _3 = (e, t, n) => e & t ^ e & n ^ t & n, P3 = new Uint32Array([
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
]), Es = new Uint32Array(64);
let Lw = class extends $f {
  constructor() {
    super(64, 32, 8, !1), this.A = As[0] | 0, this.B = As[1] | 0, this.C = As[2] | 0, this.D = As[3] | 0, this.E = As[4] | 0, this.F = As[5] | 0, this.G = As[6] | 0, this.H = As[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      Es[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const w = Es[h - 15], y = Es[h - 2], S = wr(w, 7) ^ wr(w, 18) ^ w >>> 3, x = wr(y, 17) ^ wr(y, 19) ^ y >>> 10;
      Es[h] = x + Es[h - 7] + S + Es[h - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: p, H: g } = this;
    for (let h = 0; h < 64; h++) {
      const w = wr(a, 6) ^ wr(a, 11) ^ wr(a, 25), y = g + w + N3(a, c, p) + P3[h] + Es[h] | 0, x = (wr(r, 2) ^ wr(r, 13) ^ wr(r, 22)) + _3(r, s, o) | 0;
      g = p, p = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, p = p + this.G | 0, g = g + this.H | 0, this.set(r, s, o, i, a, c, p, g);
  }
  roundClean() {
    Es.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, U3 = class extends Lw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Oo(() => new Lw());
Oo(() => new U3());
const sc = BigInt(2 ** 32 - 1), gd = BigInt(32);
function Cw(e, t = !1) {
  return t ? { h: Number(e & sc), l: Number(e >> gd & sc) } : { h: Number(e >> gd & sc) | 0, l: Number(e & sc) | 0 };
}
function H3(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = Cw(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const O3 = (e, t) => BigInt(e >>> 0) << gd | BigInt(t >>> 0), D3 = (e, t, n) => e >>> n, F3 = (e, t, n) => e << 32 - n | t >>> n, j3 = (e, t, n) => e >>> n | t << 32 - n, R3 = (e, t, n) => e << 32 - n | t >>> n, z3 = (e, t, n) => e << 64 - n | t >>> n - 32, G3 = (e, t, n) => e >>> n - 32 | t << 64 - n, K3 = (e, t) => t, V3 = (e, t) => e, q3 = (e, t, n) => e << n | t >>> 32 - n, Y3 = (e, t, n) => t << n | e >>> 32 - n, X3 = (e, t, n) => t << n - 32 | e >>> 64 - n, W3 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function Z3(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Q3 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), J3 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, e4 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), t4 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, n4 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), r4 = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, Ue = {
  fromBig: Cw,
  split: H3,
  toBig: O3,
  shrSH: D3,
  shrSL: F3,
  rotrSH: j3,
  rotrSL: R3,
  rotrBH: z3,
  rotrBL: G3,
  rotr32H: K3,
  rotr32L: V3,
  rotlSH: q3,
  rotlSL: Y3,
  rotlBH: X3,
  rotlBL: W3,
  add: Z3,
  add3L: Q3,
  add3H: J3,
  add4L: e4,
  add4H: t4,
  add5H: r4,
  add5L: n4
}, [s4, o4] = Ue.split([
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
].map((e) => BigInt(e))), ks = new Uint32Array(80), $s = new Uint32Array(80);
let Il = class extends $f {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: p, El: g, Fh: h, Fl: w, Gh: y, Gl: S, Hh: x, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, p, g, h, w, y, S, x, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, p, g, h, w, y, S, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = p | 0, this.El = g | 0, this.Fh = h | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let v = 0; v < 16; v++, n += 4)
      ks[v] = t.getUint32(n), $s[v] = t.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const T = ks[v - 15] | 0, B = $s[v - 15] | 0, z = Ue.rotrSH(T, B, 1) ^ Ue.rotrSH(T, B, 8) ^ Ue.shrSH(T, B, 7), Q = Ue.rotrSL(T, B, 1) ^ Ue.rotrSL(T, B, 8) ^ Ue.shrSL(T, B, 7), W = ks[v - 2] | 0, K = $s[v - 2] | 0, m = Ue.rotrSH(W, K, 19) ^ Ue.rotrBH(W, K, 61) ^ Ue.shrSH(W, K, 6), E = Ue.rotrSL(W, K, 19) ^ Ue.rotrBL(W, K, 61) ^ Ue.shrSL(W, K, 6), P = Ue.add4L(Q, E, $s[v - 7], $s[v - 16]), N = Ue.add4H(P, z, m, ks[v - 7], ks[v - 16]);
      ks[v] = N | 0, $s[v] = P | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: p, Dl: g, Eh: h, El: w, Fh: y, Fl: S, Gh: x, Gl: L, Hh: O, Hl: U } = this;
    for (let v = 0; v < 80; v++) {
      const T = Ue.rotrSH(h, w, 14) ^ Ue.rotrSH(h, w, 18) ^ Ue.rotrBH(h, w, 41), B = Ue.rotrSL(h, w, 14) ^ Ue.rotrSL(h, w, 18) ^ Ue.rotrBL(h, w, 41), z = h & y ^ ~h & x, Q = w & S ^ ~w & L, W = Ue.add5L(U, B, Q, o4[v], $s[v]), K = Ue.add5H(W, O, T, z, s4[v], ks[v]), m = W | 0, E = Ue.rotrSH(r, s, 28) ^ Ue.rotrBH(r, s, 34) ^ Ue.rotrBH(r, s, 39), P = Ue.rotrSL(r, s, 28) ^ Ue.rotrBL(r, s, 34) ^ Ue.rotrBL(r, s, 39), N = r & o ^ r & a ^ o & a, V = s & i ^ s & c ^ i & c;
      O = x | 0, U = L | 0, x = y | 0, L = S | 0, y = h | 0, S = w | 0, { h, l: w } = Ue.add(p | 0, g | 0, K | 0, m | 0), p = a | 0, g = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const G = Ue.add3L(m, P, V);
      r = Ue.add3H(G, K, E, N), s = G | 0;
    }
    ({ h: r, l: s } = Ue.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Ue.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = Ue.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: p, l: g } = Ue.add(this.Dh | 0, this.Dl | 0, p | 0, g | 0), { h, l: w } = Ue.add(this.Eh | 0, this.El | 0, h | 0, w | 0), { h: y, l: S } = Ue.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: x, l: L } = Ue.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: O, l: U } = Ue.add(this.Hh | 0, this.Hl | 0, O | 0, U | 0), this.set(r, s, o, i, a, c, p, g, h, w, y, S, x, L, O, U);
  }
  roundClean() {
    ks.fill(0), $s.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, i4 = class extends Il {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, a4 = class extends Il {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, c4 = class extends Il {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Oo(() => new Il());
Oo(() => new i4());
Oo(() => new a4());
Oo(() => new c4());
function l4(e, t, n) {
  const s = y3;
  if (k4(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: dd.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Xt;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(Xt || (Xt = {}));
let u4 = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Tw = class extends u4 {
  constructor(t) {
    super(t);
  }
};
function Ll(e) {
  const t = [];
  return t.push(ga(vf(e.version, 1))), t.push(ga(e.hash160)), Wr(t);
}
function d4(e) {
  const t = [];
  return t.push(e.prefix), t.push(Ll(e.address)), e.prefix === hd.Contract && t.push(ya(e.contractName)), Wr(t);
}
function ya(e) {
  const t = [], n = Ef(e.content), r = n.byteLength;
  return t.push(ga(vf(r, e.lengthPrefixBytes))), t.push(n), Wr(t);
}
function f4(e) {
  const t = [];
  return t.push(Ll(e.address)), t.push(ya(e.contractName)), t.push(ya(e.assetName)), Wr(t);
}
function Bw(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(d4(e.principal)), (e.conditionType === ro.Fungible || e.conditionType === ro.NonFungible) && t.push(f4(e.assetInfo)), e.conditionType === ro.NonFungible && t.push(Io(e.assetName)), t.push(e.conditionCode), e.conditionType === ro.STX || e.conditionType === ro.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Tw("The post-condition amount may not be larger than 8 bytes");
    t.push(u3(e.amount, !1, 8));
  }
  return Wr(t);
}
function Tr(e, t) {
  return Wr([e, t]);
}
function h4(e) {
  return new Uint8Array([e.type]);
}
function p4(e) {
  return e.type === Xt.OptionalNone ? new Uint8Array([e.type]) : Tr(e.type, Io(e.value));
}
function g4(e) {
  const t = new Uint8Array(4);
  return $l(t, e.buffer.length, 0), Tr(e.type, kf(t, e.buffer));
}
function y4(e) {
  const t = Af(d3(e.value, BigInt(w3)), Aw);
  return Tr(e.type, t);
}
function w4(e) {
  const t = Af(e.value, Aw);
  return Tr(e.type, t);
}
function m4(e) {
  return Tr(e.type, Ll(e.address));
}
function b4(e) {
  return Tr(e.type, kf(Ll(e.address), ya(e.contractName)));
}
function x4(e) {
  return Tr(e.type, Io(e.value));
}
function S4(e) {
  const t = [], n = new Uint8Array(4);
  $l(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = Io(r);
    t.push(s);
  }
  return Tr(e.type, Wr(t));
}
function v4(e) {
  const t = [], n = new Uint8Array(4);
  $l(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = l4(s);
    t.push(ya(o));
    const i = Io(e.data[s]);
    t.push(i);
  }
  return Tr(e.type, Wr(t));
}
function Mw(e, t) {
  const n = [], r = t == "ascii" ? p3(e.data) : Ef(e.data), s = new Uint8Array(4);
  return $l(s, r.length, 0), n.push(s), n.push(r), Tr(e.type, Wr(n));
}
function A4(e) {
  return Mw(e, "ascii");
}
function E4(e) {
  return Mw(e, "utf8");
}
function Io(e) {
  switch (e.type) {
    case Xt.BoolTrue:
    case Xt.BoolFalse:
      return h4(e);
    case Xt.OptionalNone:
    case Xt.OptionalSome:
      return p4(e);
    case Xt.Buffer:
      return g4(e);
    case Xt.UInt:
      return w4(e);
    case Xt.Int:
      return y4(e);
    case Xt.PrincipalStandard:
      return m4(e);
    case Xt.PrincipalContract:
      return b4(e);
    case Xt.ResponseOk:
    case Xt.ResponseErr:
      return x4(e);
    case Xt.List:
      return S4(e);
    case Xt.Tuple:
      return v4(e);
    case Xt.StringASCII:
      return A4(e);
    case Xt.StringUTF8:
      return E4(e);
    default:
      throw new Tw("Unable to serialize. Invalid Clarity Value.");
  }
}
const k4 = (e, t) => e ? Ef(e).length > t : !1, $4 = "connect-ui";
let kc, Nw, _n = !1, yd = !1;
const Yr = (e, t = "") => () => {
}, I4 = (e, t) => () => {
}, L4 = "{visibility:hidden}.hydrated{visibility:inherit}", Wp = {}, C4 = "http://www.w3.org/2000/svg", T4 = "http://www.w3.org/1999/xhtml", B4 = (e) => e != null, Cf = (e) => (e = typeof e, e === "object" || e === "function");
function _w(e) {
  var t, n, r;
  return (r = (n = (t = e.head) === null || t === void 0 ? void 0 : t.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Be = (e, t, ...n) => {
  let r = null, s = !1, o = !1;
  const i = [], a = (p) => {
    for (let g = 0; g < p.length; g++)
      r = p[g], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof e != "function" && !Cf(r)) && (r = String(r)), s && o ? i[i.length - 1].$text$ += r : i.push(s ? wd(null, r) : r), o = s);
  };
  if (a(n), t) {
    const p = t.className || t.class;
    p && (t.class = typeof p != "object" ? p : Object.keys(p).filter((g) => p[g]).join(" "));
  }
  const c = wd(e, null);
  return c.$attrs$ = t, i.length > 0 && (c.$children$ = i), c;
}, wd = (e, t) => {
  const n = {
    $flags$: 0,
    $tag$: e,
    $text$: t,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, M4 = {}, N4 = (e) => e && e.$tag$ === M4, _4 = (e, t) => e != null && !Cf(e) && t & 4 ? e === "false" ? !1 : e === "" || !!e : e, P4 = (e) => Di(e).$hostElement$, U4 = (e, t, n) => {
  const r = ln.ce(t, n);
  return e.dispatchEvent(r), r;
}, Zp = /* @__PURE__ */ new WeakMap(), H4 = (e, t, n) => {
  let r = qc.get(e);
  rk && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = t : r.replaceSync(t)) : r = t, qc.set(e, r);
}, O4 = (e, t, n, r) => {
  var s;
  let o = Pw(t);
  const i = qc.get(o);
  if (e = e.nodeType === 11 ? e : $r, i)
    if (typeof i == "string") {
      e = e.head || e;
      let a = Zp.get(e), c;
      if (a || Zp.set(e, a = /* @__PURE__ */ new Set()), !a.has(o)) {
        {
          c = $r.createElement("style"), c.innerHTML = i;
          const p = (s = ln.$nonce$) !== null && s !== void 0 ? s : _w($r);
          p != null && c.setAttribute("nonce", p), e.insertBefore(c, e.querySelector("link"));
        }
        a && a.add(o);
      }
    } else e.adoptedStyleSheets.includes(i) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, i]);
  return o;
}, D4 = (e) => {
  const t = e.$cmpMeta$, n = e.$hostElement$, r = t.$flags$, s = Yr("attachStyles", t.$tagName$), o = O4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), t);
  r & 10 && (n["s-sc"] = o, n.classList.add(o + "-h")), s();
}, Pw = (e, t) => "sc-" + e.$tagName$, Qp = (e, t, n, r, s, o) => {
  if (n !== r) {
    let i = e0(e, t), a = t.toLowerCase();
    if (t === "class") {
      const c = e.classList, p = Jp(n), g = Jp(r);
      c.remove(...p.filter((h) => h && !g.includes(h))), c.add(...g.filter((h) => h && !p.includes(h)));
    } else if (!i && t[0] === "o" && t[1] === "n")
      t[2] === "-" ? t = t.slice(3) : e0(Cl, a) ? t = a.slice(2) : t = a[2] + t.slice(3), n && ln.rel(e, t, n, !1), r && ln.ael(e, t, r, !1);
    else {
      const c = Cf(r);
      if ((i || c && r !== null) && !s)
        try {
          if (e.tagName.includes("-"))
            e[t] = r;
          else {
            const p = r ?? "";
            t === "list" ? i = !1 : (n == null || e[t] != p) && (e[t] = p);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || e.getAttribute(t) === "") && e.removeAttribute(t) : (!i || o & 4 || s) && !c && (r = r === !0 ? "" : r, e.setAttribute(t, r));
    }
  }
}, F4 = /\s/, Jp = (e) => e ? e.split(F4) : [], Uw = (e, t, n, r) => {
  const s = t.$elm$.nodeType === 11 && t.$elm$.host ? t.$elm$.host : t.$elm$, o = e && e.$attrs$ || Wp, i = t.$attrs$ || Wp;
  for (r in o)
    r in i || Qp(s, r, o[r], void 0, n, t.$flags$);
  for (r in i)
    Qp(s, r, o[r], i[r], n, t.$flags$);
}, Tf = (e, t, n, r) => {
  const s = t.$children$[n];
  let o = 0, i, a;
  if (s.$text$ !== null)
    i = s.$elm$ = $r.createTextNode(s.$text$);
  else {
    if (_n || (_n = s.$tag$ === "svg"), i = s.$elm$ = $r.createElementNS(_n ? C4 : T4, s.$tag$), _n && s.$tag$ === "foreignObject" && (_n = !1), Uw(null, s, _n), B4(kc) && i["s-si"] !== kc && i.classList.add(i["s-si"] = kc), s.$children$)
      for (o = 0; o < s.$children$.length; ++o)
        a = Tf(e, s, o), a && i.appendChild(a);
    s.$tag$ === "svg" ? _n = !1 : i.tagName === "foreignObject" && (_n = !0);
  }
  return i;
}, Hw = (e, t, n, r, s, o) => {
  let i = e, a;
  for (i.shadowRoot && i.tagName === Nw && (i = i.shadowRoot); s <= o; ++s)
    r[s] && (a = Tf(null, n, s), a && (r[s].$elm$ = a, i.insertBefore(a, t)));
}, Ow = (e, t, n, r, s) => {
  for (; t <= n; ++t)
    (r = e[t]) && (s = r.$elm$, s.remove());
}, j4 = (e, t, n, r) => {
  let s = 0, o = 0, i = t.length - 1, a = t[0], c = t[i], p = r.length - 1, g = r[0], h = r[p], w;
  for (; s <= i && o <= p; )
    a == null ? a = t[++s] : c == null ? c = t[--i] : g == null ? g = r[++o] : h == null ? h = r[--p] : oc(a, g) ? (na(a, g), a = t[++s], g = r[++o]) : oc(c, h) ? (na(c, h), c = t[--i], h = r[--p]) : oc(a, h) ? (na(a, h), e.insertBefore(a.$elm$, c.$elm$.nextSibling), a = t[++s], h = r[--p]) : oc(c, g) ? (na(c, g), e.insertBefore(c.$elm$, a.$elm$), c = t[--i], g = r[++o]) : (w = Tf(t && t[o], n, o), g = r[++o], w && a.$elm$.parentNode.insertBefore(w, a.$elm$));
  s > i ? Hw(e, r[p + 1] == null ? null : r[p + 1].$elm$, n, r, o, p) : o > p && Ow(t, s, i);
}, oc = (e, t) => e.$tag$ === t.$tag$, na = (e, t) => {
  const n = t.$elm$ = e.$elm$, r = e.$children$, s = t.$children$, o = t.$tag$, i = t.$text$;
  i === null ? (_n = o === "svg" ? !0 : o === "foreignObject" ? !1 : _n, Uw(e, t, _n), r !== null && s !== null ? j4(n, r, t, s) : s !== null ? (e.$text$ !== null && (n.textContent = ""), Hw(n, null, t, s, 0, s.length - 1)) : r !== null && Ow(r, 0, r.length - 1), _n && o === "svg" && (_n = !1)) : e.$text$ !== i && (n.data = i);
}, R4 = (e, t) => {
  const n = e.$hostElement$, r = e.$vnode$ || wd(null, null), s = N4(t) ? t : Be(null, null, t);
  Nw = n.tagName, s.$tag$ = null, s.$flags$ |= 4, e.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, kc = n["s-sc"], na(r, s);
}, Dw = (e, t) => {
  t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((n) => e.$onRenderResolve$ = n));
}, Bf = (e, t) => {
  if (e.$flags$ |= 16, e.$flags$ & 4) {
    e.$flags$ |= 512;
    return;
  }
  return Dw(e, e.$ancestorComponent$), ok(() => z4(e, t));
}, z4 = (e, t) => {
  const n = Yr("scheduleUpdate", e.$cmpMeta$.$tagName$), r = e.$lazyInstance$;
  let s;
  return n(), q4(s, () => G4(e, r, t));
}, G4 = async (e, t, n) => {
  const r = e.$hostElement$, s = Yr("update", e.$cmpMeta$.$tagName$), o = r["s-rc"];
  n && D4(e);
  const i = Yr("render", e.$cmpMeta$.$tagName$);
  K4(e, t), o && (o.map((a) => a()), r["s-rc"] = void 0), i(), s();
  {
    const a = r["s-p"], c = () => V4(e);
    a.length === 0 ? c() : (Promise.all(a).then(c), e.$flags$ |= 4, a.length = 0);
  }
}, K4 = (e, t, n) => {
  try {
    t = t.render(), e.$flags$ &= -17, e.$flags$ |= 2, R4(e, t);
  } catch (r) {
    wa(r, e.$hostElement$);
  }
  return null;
}, V4 = (e) => {
  const t = e.$cmpMeta$.$tagName$, n = e.$hostElement$, r = Yr("postUpdate", t), s = e.$ancestorComponent$;
  e.$flags$ & 64 ? r() : (e.$flags$ |= 64, jw(n), r(), e.$onReadyResolve$(n), s || Fw()), e.$onRenderResolve$ && (e.$onRenderResolve$(), e.$onRenderResolve$ = void 0), e.$flags$ & 512 && Nf(() => Bf(e, !1)), e.$flags$ &= -517;
}, Fw = (e) => {
  jw($r.documentElement), Nf(() => U4(Cl, "appload", { detail: { namespace: $4 } }));
}, q4 = (e, t) => e && e.then ? e.then(t) : t(), jw = (e) => e.classList.add("hydrated"), Y4 = (e, t) => Di(e).$instanceValues$.get(t), X4 = (e, t, n, r) => {
  const s = Di(e), o = s.$instanceValues$.get(t), i = s.$flags$, a = s.$lazyInstance$;
  n = _4(n, r.$members$[t][0]);
  const c = Number.isNaN(o) && Number.isNaN(n), p = n !== o && !c;
  (!(i & 8) || o === void 0) && p && (s.$instanceValues$.set(t, n), a && (i & 18) === 2 && Bf(s, !1));
}, Rw = (e, t, n) => {
  if (t.$members$) {
    const r = Object.entries(t.$members$), s = e.prototype;
    if (r.map(([o, [i]]) => {
      (i & 31 || n & 2 && i & 32) && Object.defineProperty(s, o, {
        get() {
          return Y4(this, o);
        },
        set(a) {
          X4(this, o, a, t);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const o = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(i, a, c) {
        ln.jmp(() => {
          const p = o.get(i);
          if (this.hasOwnProperty(p))
            c = this[p], delete this[p];
          else if (s.hasOwnProperty(p) && typeof this[p] == "number" && this[p] == c)
            return;
          this[p] = c === null && typeof this[p] == "boolean" ? !1 : c;
        });
      }, e.observedAttributes = r.filter(
        ([i, a]) => a[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([i, a]) => {
        const c = a[1] || i;
        return o.set(c, i), c;
      });
    }
  }
  return e;
}, W4 = async (e, t, n, r, s) => {
  if (!(t.$flags$ & 32)) {
    {
      if (t.$flags$ |= 32, s = nk(n), s.then) {
        const c = I4();
        s = await s, c();
      }
      s.isProxied || (Rw(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Yr("createInstance", n.$tagName$);
      t.$flags$ |= 8;
      try {
        new s(t);
      } catch (c) {
        wa(c);
      }
      t.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = Pw(n);
      if (!qc.has(c)) {
        const p = Yr("registerStyles", n.$tagName$);
        H4(c, a, !!(n.$flags$ & 1)), p();
      }
    }
  }
  const o = t.$ancestorComponent$, i = () => Bf(t, !0);
  o && o["s-rc"] ? o["s-rc"].push(i) : i();
}, Z4 = (e) => {
  if (!(ln.$flags$ & 1)) {
    const t = Di(e), n = t.$cmpMeta$, r = Yr("connectedCallback", n.$tagName$);
    if (!(t.$flags$ & 1)) {
      t.$flags$ |= 1;
      {
        let s = e;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Dw(t, t.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [o]]) => {
        if (o & 31 && e.hasOwnProperty(s)) {
          const i = e[s];
          delete e[s], e[s] = i;
        }
      }), W4(e, t, n);
    }
    r();
  }
}, Q4 = (e) => {
  ln.$flags$ & 1 || Di(e);
}, J4 = (e, t = {}) => {
  var n;
  const r = Yr(), s = [], o = t.exclude || [], i = Cl.customElements, a = $r.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), p = /* @__PURE__ */ $r.createElement("style"), g = [];
  let h, w = !0;
  Object.assign(ln, t), ln.$resourcesUrl$ = new URL(t.resourcesUrl || "./", $r.baseURI).href, e.map((y) => {
    y[1].map((S) => {
      const x = {
        $flags$: S[0],
        $tagName$: S[1],
        $members$: S[2],
        $listeners$: S[3]
      };
      x.$members$ = S[2];
      const L = x.$tagName$, O = class extends HTMLElement {
        // StencilLazyHost
        constructor(U) {
          super(U), U = this, tk(U, x), x.$flags$ & 1 && U.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          h && (clearTimeout(h), h = null), w ? g.push(this) : ln.jmp(() => Z4(this));
        }
        disconnectedCallback() {
          ln.jmp(() => Q4(this));
        }
        componentOnReady() {
          return Di(this).$onReadyPromise$;
        }
      };
      x.$lazyBundleId$ = y[0], !o.includes(L) && !i.get(L) && (s.push(L), i.define(L, Rw(
        O,
        x,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    p.innerHTML = s + L4, p.setAttribute("data-styles", "");
    const y = (n = ln.$nonce$) !== null && n !== void 0 ? n : _w($r);
    y != null && p.setAttribute("nonce", y), a.insertBefore(p, c ? c.nextSibling : a.firstChild);
  }
  w = !1, g.length ? g.map((y) => y.connectedCallback()) : ln.jmp(() => h = setTimeout(Fw, 30)), r();
}, Mf = /* @__PURE__ */ new WeakMap(), Di = (e) => Mf.get(e), ek = (e, t) => Mf.set(t.$lazyInstance$ = e, t), tk = (e, t) => {
  const n = {
    $flags$: 0,
    $hostElement$: e,
    $cmpMeta$: t,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), e["s-p"] = [], e["s-rc"] = [], Mf.set(e, n);
}, e0 = (e, t) => t in e, wa = (e, t) => (0, console.error)(e, t), cu = /* @__PURE__ */ new Map(), nk = (e, t, n) => {
  const r = e.$tagName$.replace(/-/g, "_"), s = e.$lazyBundleId$, o = cu.get(s);
  if (o)
    return o[r];
  {
    const i = (a) => (cu.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => IL).then(i, wa);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((i) => (cu.set(s, i), i[r]), wa);
}, qc = /* @__PURE__ */ new Map(), Cl = typeof window < "u" ? window : {}, $r = Cl.document || { head: {} }, ln = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (e) => e(),
  raf: (e) => requestAnimationFrame(e),
  ael: (e, t, n, r) => e.addEventListener(t, n, r),
  rel: (e, t, n, r) => e.removeEventListener(t, n, r),
  ce: (e, t) => new CustomEvent(e, t)
}, zw = (e) => Promise.resolve(e), rk = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), t0 = [], Gw = [], sk = (e, t) => (n) => {
  e.push(n), yd || (yd = !0, ln.$flags$ & 4 ? Nf(md) : ln.raf(md));
}, n0 = (e) => {
  for (let t = 0; t < e.length; t++)
    try {
      e[t](performance.now());
    } catch (n) {
      wa(n);
    }
  e.length = 0;
}, md = () => {
  n0(t0), n0(Gw), (yd = t0.length > 0) && ln.raf(md);
}, Nf = (e) => zw().then(e), ok = /* @__PURE__ */ sk(Gw), ik = () => zw(), ak = (e, t) => typeof window > "u" ? Promise.resolve() : ik().then(() => J4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], t));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var e = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(e, [], this.constructor);
    }, HTMLElement.prototype = e.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, e);
  }
})();
var ck = Object.defineProperty, lk = Object.defineProperties, uk = Object.getOwnPropertyDescriptors, Yc = Object.getOwnPropertySymbols, Kw = Object.prototype.hasOwnProperty, Vw = Object.prototype.propertyIsEnumerable, r0 = (e, t, n) => t in e ? ck(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Dn = (e, t) => {
  for (var n in t || (t = {})) Kw.call(t, n) && r0(e, n, t[n]);
  if (Yc) for (var n of Yc(t)) Vw.call(t, n) && r0(e, n, t[n]);
  return e;
}, dr = (e, t) => lk(e, uk(t)), qw = (e, t) => {
  var n = {};
  for (var r in e) Kw.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && Yc) for (var r of Yc(e)) t.indexOf(r) < 0 && Vw.call(e, r) && (n[r] = e[r]);
  return n;
};
function Yw() {
  return vl(So()) || window.StacksProvider || window.BlockstackProvider;
}
function Tl(e) {
  return e ? typeof e == "string" ? Ao.fromName(e) : "version" in e ? e : "url" in e ? new Vu({ url: e.url }) : e.transactionVersion === ko.Mainnet ? new Vu({ url: e.client.baseUrl }) : new qu({ url: e.client.baseUrl }) : new qu();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var dk = ((e) => (e.ContractCall = "contract_call", e.ContractDeploy = "smart_contract", e.STXTransfer = "token_transfer", e))(dk || {}), fk = ((e) => (e.BUFFER = "buffer", e.UINT = "uint", e.INT = "int", e.PRINCIPAL = "principal", e.BOOL = "bool", e))(fk || {}), _f = (e) => {
  let t = e;
  if (!t) {
    let n = new Ig(["store_write"], document.location.href);
    t = new Ku({ appConfig: n });
  }
  return t;
};
function Xw(e) {
  try {
    return _f(e).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Ww = (e) => {
  let t = _f(e).loadUserData().appPrivateKey, n = rn.SECP256K1Client.derivePublicKey(t);
  return { privateKey: t, publicKey: n };
};
function hk(e) {
  var t;
  let { stxAddress: n, userSession: r, network: s } = e;
  if (n) return n;
  if (!r || !s) return;
  let o = (t = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : t.stxAddress, i = { [Eo.Mainnet]: "mainnet", [Eo.Testnet]: "testnet" }, a = Tl(s);
  return o == null ? void 0 : o[i[a.chainId]];
}
function pk(e) {
  let t = Tl(e.network), n = _f(e.userSession), r = dr(Dn({}, e), { network: t, userSession: n });
  return Dn({ stxAddress: hk(r) }, r);
}
async function gk(e, t) {
  let { postConditions: n } = e;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Sw) : n = n.map((r) => Ee(Bw(r)))), new rn.TokenSigner("ES256k", t).signAsync(dr(Dn({}, e), { postConditions: n }));
}
function yk(e) {
  let { postConditions: t } = e;
  return t && t.length > 0 && typeof t[0] != "string" && (typeof t[0].type == "string" ? t = t.map(Sw) : t = t.map((n) => Ee(Bw(n)))), rn.createUnsecuredToken(dr(Dn({}, e), { postConditions: t }));
}
var wk = async ({ token: e, options: t }, n) => {
  var r, s, o;
  try {
    let i = await n.transactionRequest(e), { txRaw: a } = i, c = Ze(a.replace(/^0x/, "")), p = a3(c);
    if ("sponsored" in t && t.sponsored) {
      (r = t.onFinish) == null || r.call(t, dr(Dn({}, i), { stacksTransaction: p }));
      return;
    }
    (s = t.onFinish) == null || s.call(t, dr(Dn({}, i), { stacksTransaction: p }));
  } catch (i) {
    console.error("[Connect] Error during transaction request", i), (o = t.onCancel) == null || o.call(t);
  }
}, mk = async (e) => {
  let t = e, { amount: n, appDetails: r, userSession: s } = t, o = qw(t, ["amount", "appDetails", "userSession"]);
  if (Xw(s)) {
    let { privateKey: a, publicKey: c } = Ww(s), p = dr(Dn({}, o), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (p.appDetails = r), gk(p, a);
  }
  let i = dr(Dn({}, o), { amount: n.toString(10), txType: "token_transfer" });
  return r && (i.appDetails = r), yk(i);
};
async function bk(e, t, n) {
  let r = await t(dr(Dn(Dn({}, pk(e)), e), { network: Tl(e.network) }));
  return wk({ token: r, options: e }, n);
}
function xk(e, t = Yw()) {
  if (!t) throw new Error("[Connect] No installed Stacks wallet found");
  return bk(e, mk, t);
}
function Zw(e) {
  let { message: t, domain: n } = e;
  return typeof t.type == "string" && typeof n.type == "string" ? dr(Dn({}, e), { message: Bp(t), domain: Bp(n) }) : dr(Dn({}, e), { message: Ee(Io(t)), domain: Ee(Io(n)) });
}
async function Sk(e, t) {
  return new rn.TokenSigner("ES256k", t).signAsync(Zw(e));
}
async function vk(e) {
  let t = e, { userSession: n } = t, r = qw(t, ["userSession"]);
  if (Xw(n)) {
    let { privateKey: s, publicKey: o } = Ww(n), i = dr(Dn({}, r), { publicKey: o });
    return Sk(i, s);
  }
  return rn.createUnsecuredToken(Zw(e));
}
var Ak = ((e) => (e[e.DEFAULT = 0] = "DEFAULT", e[e.ALL = 1] = "ALL", e[e.NONE = 2] = "NONE", e[e.SINGLE = 3] = "SINGLE", e[e.ANYONECANPAY = 128] = "ANYONECANPAY", e))(Ak || {}), Qw = "asigna-stx", s0 = (e, t) => new Promise((n) => {
  function r(s) {
    s.data.source === Qw && s.data[t] && (n(s.data[t]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(kk(e, t), "*");
}), Ek = { authenticationRequest: async (e) => s0(e, "authenticationRequest"), transactionRequest: async (e) => s0(e, "transactionRequest") }, kk = (e, t) => ({ source: Qw, [t]: e }), $k = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = Ek);
};
$k();
var Ik = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function Lk(e, t = !0) {
  return function(n, r) {
    var s;
    if (r) return e(n, r);
    let o = So(), i = Yw();
    if (o && i) return e(n, i);
    if (typeof window > "u") return;
    ak();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : Ik, c = bv(a), p = document.createElement("connect-modal");
    p.defaultProviders = a, p.installedProviders = c, p.persistSelection = t;
    let g = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let h = () => {
      p.remove(), document.body.style.overflow = g;
    };
    p.callback = (y) => {
      h(), e(n, y);
    }, p.cancelCallback = () => {
      var y;
      h(), (y = n.onCancel) == null || y.call(n);
    }, document.body.appendChild(p);
    let w = (y) => {
      y.key === "Escape" && (document.removeEventListener("keydown", w), p.remove());
    };
    document.addEventListener("keydown", w);
  };
}
var ic = Lk(xk);
function Fs(e, t, n) {
  return Pf(Sn(e, t), n);
}
function Sn(e, t) {
  let n = e;
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
      r = r.padStart(r.length + r.length % 2, "0"), n = At(r);
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
    if (t) {
      const r = Bk(BigInt(`0x${je(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${je(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function o0(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function Ba(e, t = 8) {
  return (typeof e == "bigint" ? e : Sn(e, !1)).toString(16).padStart(t * 2, "0");
}
function Bl(e) {
  return parseInt(e, 16);
}
function Pf(e, t = 16) {
  const n = Ba(e, t);
  return At(n);
}
function Ck(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function Tk(e, t) {
  return e & BigInt(1) << t;
}
function Bk(e, t) {
  return Tk(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const Mk = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function je(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += Mk[n];
  return t;
}
function At(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const s = r * 2, o = t.slice(s, s + 2), i = Number.parseInt(o, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    n[r] = i;
  }
  return n;
}
function Fi(e) {
  return new TextEncoder().encode(e);
}
function Uf(e) {
  return new TextDecoder().decode(e);
}
function Jw(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function Nk(e) {
  return String.fromCharCode.apply(null, e);
}
function _k(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function i0(e) {
  if (e.some(_k))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function Ml(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, s) => r + s.length, 0), n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function zt(e) {
  return Ml(...e.map((t) => typeof t == "number" ? i0([t]) : t instanceof Array ? i0(t) : t));
}
var a0;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(a0 || (a0 = {}));
var c0;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(c0 || (c0 = {}));
var l0;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(l0 || (l0 = {}));
const em = 33, lu = 32;
function Pk(e) {
  if (e.length < lu * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + lu * 2), r = e.slice(2 + lu * 2);
  return {
    recoveryId: Bl(t),
    r: n,
    s: r
  };
}
function Uk(e) {
  const t = typeof e == "string" ? At(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function Hk(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function Ok(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function Dk(e, t) {
  return e[t];
}
function Fk(e, t, n = 0) {
  return e[n] = t, e;
}
function jk(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function Lo(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var bd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(bd || (bd = {}));
const Rk = bd.Mainnet, zk = 128, Gk = 128, tm = 16, ho = 32, xd = 80, Nl = 65, Kk = 32, Vk = 64, Xc = 34;
var xe;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(xe || (xe = {}));
var De;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(De || (De = {}));
var Sd;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(Sd || (Sd = {}));
var An;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(An || (An = {}));
const $c = ["onChainOnly", "offChainOnly", "any"], u0 = {
  [$c[0]]: An.OnChainOnly,
  [$c[1]]: An.OffChainOnly,
  [$c[2]]: An.Any,
  [An.OnChainOnly]: An.OnChainOnly,
  [An.OffChainOnly]: An.OffChainOnly,
  [An.Any]: An.Any
};
function qk(e) {
  if (e in u0)
    return u0[e];
  throw new Error(`Invalid anchor mode "${e}", must be one of: ${$c.join(", ")}`);
}
var Wc;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Wc || (Wc = {}));
Wc.Mainnet;
var Ti;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(Ti || (Ti = {}));
var En;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(En || (En = {}));
var _t;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(_t || (_t = {}));
var pt;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(pt || (pt = {}));
var Zc;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Zc || (Zc = {}));
var It;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(It || (It = {}));
var ma;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(ma || (ma = {}));
var vd;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(vd || (vd = {}));
var ba;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(ba || (ba = {}));
var d0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(d0 || (d0 = {}));
var f0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(f0 || (f0 = {}));
function Ad(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function Yk(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function nm(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function Xk(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ad(e.outputLen), Ad(e.blockLen);
}
function Wk(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Zk(e, t) {
  nm(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const lo = {
  number: Ad,
  bool: Yk,
  bytes: nm,
  hash: Xk,
  exists: Wk,
  output: Zk
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const uu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), mr = (e, t) => e << 32 - t | e >>> t, Qk = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Qk)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Jk(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Hf(e) {
  if (typeof e == "string" && (e = Jk(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
class rm {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Do(e) {
  const t = (r) => e().update(Hf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function e8(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, p = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + p, a, r);
}
class Of extends rm {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = uu(this.buffer);
  }
  update(t) {
    lo.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Hf(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = uu(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    lo.exists(this), lo.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let h = i; h < s; h++)
      n[h] = 0;
    e8(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = uu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const p = c / 4, g = this.get();
    if (p > g.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < p; h++)
      a.setUint32(4 * h, g[h], o);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: s, finished: o, destroyed: i, pos: a } = this;
    return t.length = s, t.pos = a, t.finished = o, t.destroyed = i, s % n && t.buffer.set(r), t;
  }
}
const t8 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), sm = Uint8Array.from({ length: 16 }, (e, t) => t), n8 = sm.map((e) => (9 * e + 5) % 16);
let Df = [sm], Ff = [n8];
for (let e = 0; e < 4; e++)
  for (let t of [Df, Ff])
    t.push(t[e].map((n) => t8[n]));
const om = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), r8 = Df.map((e, t) => e.map((n) => om[t][n])), s8 = Ff.map((e, t) => e.map((n) => om[t][n])), o8 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), i8 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ac = (e, t) => e << t | e >>> 32 - t;
function h0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const cc = new Uint32Array(16);
class a8 extends Of {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: s, h4: o } = this;
    return [t, n, r, s, o];
  }
  set(t, n, r, s, o) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = s | 0, this.h4 = o | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      cc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, p = this.h3 | 0, g = p, h = this.h4 | 0, w = h;
    for (let y = 0; y < 5; y++) {
      const S = 4 - y, x = o8[y], L = i8[y], O = Df[y], U = Ff[y], v = r8[y], T = s8[y];
      for (let B = 0; B < 16; B++) {
        const z = ac(r + h0(y, o, a, p) + cc[O[B]] + x, v[B]) + h | 0;
        r = h, h = p, p = ac(a, 10) | 0, a = o, o = z;
      }
      for (let B = 0; B < 16; B++) {
        const z = ac(s + h0(S, i, c, g) + cc[U[B]] + L, T[B]) + w | 0;
        s = w, w = g, g = ac(c, 10) | 0, c = i, i = z;
      }
    }
    this.set(this.h1 + a + g | 0, this.h2 + p + w | 0, this.h3 + h + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    cc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const c8 = Do(() => new a8()), l8 = (e, t, n) => e & t ^ ~e & n, u8 = (e, t, n) => e & t ^ e & n ^ t & n, d8 = new Uint32Array([
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
]), Is = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ls = new Uint32Array(64);
class im extends Of {
  constructor() {
    super(64, 32, 8, !1), this.A = Is[0] | 0, this.B = Is[1] | 0, this.C = Is[2] | 0, this.D = Is[3] | 0, this.E = Is[4] | 0, this.F = Is[5] | 0, this.G = Is[6] | 0, this.H = Is[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: s, E: o, F: i, G: a, H: c } = this;
    return [t, n, r, s, o, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = s | 0, this.E = o | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      Ls[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const w = Ls[h - 15], y = Ls[h - 2], S = mr(w, 7) ^ mr(w, 18) ^ w >>> 3, x = mr(y, 17) ^ mr(y, 19) ^ y >>> 10;
      Ls[h] = x + Ls[h - 7] + S + Ls[h - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: p, H: g } = this;
    for (let h = 0; h < 64; h++) {
      const w = mr(a, 6) ^ mr(a, 11) ^ mr(a, 25), y = g + w + l8(a, c, p) + d8[h] + Ls[h] | 0, x = (mr(r, 2) ^ mr(r, 13) ^ mr(r, 22)) + u8(r, s, o) | 0;
      g = p, p = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, p = p + this.G | 0, g = g + this.H | 0, this.set(r, s, o, i, a, c, p, g);
  }
  roundClean() {
    Ls.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class f8 extends im {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const jf = Do(() => new im());
Do(() => new f8());
const lc = BigInt(2 ** 32 - 1), Ed = BigInt(32);
function am(e, t = !1) {
  return t ? { h: Number(e & lc), l: Number(e >> Ed & lc) } : { h: Number(e >> Ed & lc) | 0, l: Number(e & lc) | 0 };
}
function h8(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = am(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const p8 = (e, t) => BigInt(e >>> 0) << Ed | BigInt(t >>> 0), g8 = (e, t, n) => e >>> n, y8 = (e, t, n) => e << 32 - n | t >>> n, w8 = (e, t, n) => e >>> n | t << 32 - n, m8 = (e, t, n) => e << 32 - n | t >>> n, b8 = (e, t, n) => e << 64 - n | t >>> n - 32, x8 = (e, t, n) => e >>> n - 32 | t << 64 - n, S8 = (e, t) => t, v8 = (e, t) => e, A8 = (e, t, n) => e << n | t >>> 32 - n, E8 = (e, t, n) => t << n | e >>> 32 - n, k8 = (e, t, n) => t << n - 32 | e >>> 64 - n, $8 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function I8(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const L8 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), C8 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, T8 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), B8 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, M8 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), N8 = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, He = {
  fromBig: am,
  split: h8,
  toBig: p8,
  shrSH: g8,
  shrSL: y8,
  rotrSH: w8,
  rotrSL: m8,
  rotrBH: b8,
  rotrBL: x8,
  rotr32H: S8,
  rotr32L: v8,
  rotlSH: A8,
  rotlSL: E8,
  rotlBH: k8,
  rotlBL: $8,
  add: I8,
  add3L: L8,
  add3H: C8,
  add4L: T8,
  add4H: B8,
  add5H: N8,
  add5L: M8
}, [_8, P8] = He.split([
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
].map((e) => BigInt(e))), Cs = new Uint32Array(80), Ts = new Uint32Array(80);
class _l extends Of {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: p, El: g, Fh: h, Fl: w, Gh: y, Gl: S, Hh: x, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, p, g, h, w, y, S, x, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, p, g, h, w, y, S, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = p | 0, this.El = g | 0, this.Fh = h | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = S | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let v = 0; v < 16; v++, n += 4)
      Cs[v] = t.getUint32(n), Ts[v] = t.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const T = Cs[v - 15] | 0, B = Ts[v - 15] | 0, z = He.rotrSH(T, B, 1) ^ He.rotrSH(T, B, 8) ^ He.shrSH(T, B, 7), Q = He.rotrSL(T, B, 1) ^ He.rotrSL(T, B, 8) ^ He.shrSL(T, B, 7), W = Cs[v - 2] | 0, K = Ts[v - 2] | 0, m = He.rotrSH(W, K, 19) ^ He.rotrBH(W, K, 61) ^ He.shrSH(W, K, 6), E = He.rotrSL(W, K, 19) ^ He.rotrBL(W, K, 61) ^ He.shrSL(W, K, 6), P = He.add4L(Q, E, Ts[v - 7], Ts[v - 16]), N = He.add4H(P, z, m, Cs[v - 7], Cs[v - 16]);
      Cs[v] = N | 0, Ts[v] = P | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: p, Dl: g, Eh: h, El: w, Fh: y, Fl: S, Gh: x, Gl: L, Hh: O, Hl: U } = this;
    for (let v = 0; v < 80; v++) {
      const T = He.rotrSH(h, w, 14) ^ He.rotrSH(h, w, 18) ^ He.rotrBH(h, w, 41), B = He.rotrSL(h, w, 14) ^ He.rotrSL(h, w, 18) ^ He.rotrBL(h, w, 41), z = h & y ^ ~h & x, Q = w & S ^ ~w & L, W = He.add5L(U, B, Q, P8[v], Ts[v]), K = He.add5H(W, O, T, z, _8[v], Cs[v]), m = W | 0, E = He.rotrSH(r, s, 28) ^ He.rotrBH(r, s, 34) ^ He.rotrBH(r, s, 39), P = He.rotrSL(r, s, 28) ^ He.rotrBL(r, s, 34) ^ He.rotrBL(r, s, 39), N = r & o ^ r & a ^ o & a, V = s & i ^ s & c ^ i & c;
      O = x | 0, U = L | 0, x = y | 0, L = S | 0, y = h | 0, S = w | 0, { h, l: w } = He.add(p | 0, g | 0, K | 0, m | 0), p = a | 0, g = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const G = He.add3L(m, P, V);
      r = He.add3H(G, K, E, N), s = G | 0;
    }
    ({ h: r, l: s } = He.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = He.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = He.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: p, l: g } = He.add(this.Dh | 0, this.Dl | 0, p | 0, g | 0), { h, l: w } = He.add(this.Eh | 0, this.El | 0, h | 0, w | 0), { h: y, l: S } = He.add(this.Fh | 0, this.Fl | 0, y | 0, S | 0), { h: x, l: L } = He.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: O, l: U } = He.add(this.Hh | 0, this.Hl | 0, O | 0, U | 0), this.set(r, s, o, i, a, c, p, g, h, w, y, S, x, L, O, U);
  }
  roundClean() {
    Cs.fill(0), Ts.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class U8 extends _l {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class H8 extends _l {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class O8 extends _l {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Do(() => new _l());
Do(() => new U8());
const D8 = Do(() => new H8());
Do(() => new O8());
function cm(e) {
  if (At(e).byteLength != Nl)
    throw Error("Invalid signature");
  return {
    type: xe.MessageSignature,
    data: e
  };
}
function ra(e, t) {
  return { type: xe.Address, version: e, hash160: t };
}
function fi(e) {
  return Uo.c32address(e.version, e.hash160);
}
function Co(e, t, n) {
  const r = t || 1, s = n || zk;
  if (km(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: xe.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Rf(e) {
  const t = Uo.c32addressDecode(e);
  return {
    type: xe.Address,
    version: t[0],
    hash160: t[1]
  };
}
var te;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(te || (te = {}));
function F8(e) {
  if (e.type === te.PrincipalStandard)
    return fi(e.address);
  if (e.type === te.PrincipalContract)
    return `${fi(e.address)}.${e.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(e)}`);
}
function lm(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return z8(t, n);
  } else
    return j8(e);
}
function j8(e) {
  const t = Rf(e);
  return { type: te.PrincipalStandard, address: t };
}
function R8(e) {
  return { type: te.PrincipalStandard, address: e };
}
function z8(e, t) {
  const n = Rf(e), r = Co(t);
  return um(n, r);
}
function um(e, t) {
  if (Fi(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: te.PrincipalContract, address: e, contractName: t };
}
function du(e, t = !1) {
  switch (e.type) {
    case te.BoolTrue:
      return !0;
    case te.BoolFalse:
      return !1;
    case te.Int:
    case te.UInt:
      return t ? e.value.toString() : e.value;
    case te.Buffer:
      return `0x${je(e.buffer)}`;
    case te.OptionalNone:
      return null;
    case te.OptionalSome:
      return ir(e.value);
    case te.ResponseErr:
      return ir(e.value);
    case te.ResponseOk:
      return ir(e.value);
    case te.PrincipalStandard:
    case te.PrincipalContract:
      return F8(e);
    case te.List:
      return e.list.map((r) => ir(r));
    case te.Tuple:
      const n = {};
      return Object.keys(e.data).forEach((r) => {
        n[r] = ir(e.data[r]);
      }), n;
    case te.StringASCII:
      return e.data;
    case te.StringUTF8:
      return e.data;
  }
}
function ir(e) {
  switch (e.type) {
    case te.ResponseErr:
      return { type: Ns(e), value: du(e, !0), success: !1 };
    case te.ResponseOk:
      return { type: Ns(e), value: du(e, !0), success: !0 };
    default:
      return { type: Ns(e), value: du(e, !0) };
  }
}
function Ns(e) {
  switch (e.type) {
    case te.BoolTrue:
    case te.BoolFalse:
      return "bool";
    case te.Int:
      return "int";
    case te.UInt:
      return "uint";
    case te.Buffer:
      return `(buff ${e.buffer.length})`;
    case te.OptionalNone:
      return "(optional none)";
    case te.OptionalSome:
      return `(optional ${Ns(e.value)})`;
    case te.ResponseErr:
      return `(response UnknownType ${Ns(e.value)})`;
    case te.ResponseOk:
      return `(response ${Ns(e.value)} UnknownType)`;
    case te.PrincipalStandard:
    case te.PrincipalContract:
      return "principal";
    case te.List:
      return `(list ${e.list.length} ${e.list.length ? Ns(e.list[0]) : "UnknownType"})`;
    case te.Tuple:
      return `(tuple ${Object.keys(e.data).map((t) => `(${t} ${Ns(e.data[t])})`).join(" ")})`;
    case te.StringASCII:
      return `(string-ascii ${Jw(e.data).length})`;
    case te.StringUTF8:
      return `(string-utf8 ${Fi(e.data).length})`;
  }
}
const dm = () => ({ type: te.BoolTrue }), fm = () => ({ type: te.BoolFalse }), G8 = (e) => e ? dm() : fm(), p0 = BigInt("0xffffffffffffffffffffffffffffffff"), K8 = BigInt(0), g0 = BigInt("0x7fffffffffffffffffffffffffffffff"), y0 = BigInt("-170141183460469231731687303715884105728"), V8 = (e) => {
  const t = Sn(e, !0);
  if (t > g0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${g0}`);
  if (t < y0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${y0}`);
  return { type: te.Int, value: t };
}, Zn = (e) => {
  const t = Sn(e, !1);
  if (t < K8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > p0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${p0}`);
  return { type: te.UInt, value: t };
}, hm = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: te.Buffer, buffer: e };
};
function pm() {
  return { type: te.OptionalNone };
}
function gm(e) {
  return { type: te.OptionalSome, value: e };
}
function q8(e) {
  return { type: te.ResponseErr, value: e };
}
function Y8(e) {
  return { type: te.ResponseOk, value: e };
}
function X8(e) {
  return { type: te.List, list: e };
}
function Xr(e) {
  for (const t in e)
    if (!O$(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: te.Tuple, data: e };
}
const Mt = (e) => ({ type: te.StringASCII, data: e }), W8 = (e) => ({ type: te.StringUTF8, data: e });
class ym extends rm {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, lo.hash(t);
    const r = Hf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const s = this.blockLen, o = new Uint8Array(s);
    o.set(r.length > s ? t.create().update(r).digest() : r);
    for (let i = 0; i < o.length; i++)
      o[i] ^= 54;
    this.iHash.update(o), this.oHash = t.create();
    for (let i = 0; i < o.length; i++)
      o[i] ^= 106;
    this.oHash.update(o), o.fill(0);
  }
  update(t) {
    return lo.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    lo.exists(this), lo.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: s, destroyed: o, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = s, t.destroyed = o, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const wm = (e, t, n) => new ym(e, t).update(n).digest();
wm.create = (e, t) => new ym(e, t);
Pt.hmacSha256Sync = (e, ...t) => {
  const n = wm.create(jf, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Bi(e) {
  return {
    type: xe.PublicKey,
    data: At(e)
  };
}
function Z8(e, t, n = It.Compressed) {
  const r = Pk(t.data), s = new Hn(o0(r.r), o0(r.s)), o = Fe.fromSignature(e, s, r.recoveryId), i = n === It.Compressed;
  return o.toHex(i);
}
function Q8(e) {
  return { type: xe.PublicKey, data: e };
}
function ji(e) {
  return !je(e.data).startsWith("04");
}
function Qc(e) {
  return e.data.slice();
}
function J8(e) {
  const t = n$(e), n = $a(t.data.slice(0, 32), t.compressed);
  return Bi(je(n));
}
function e$(e) {
  const t = typeof e == "string" ? e : je(e), n = Fe.fromHex(t).toHex(!0);
  return Bi(n);
}
function t$(e) {
  const t = typeof e == "string" ? e : je(e), n = Fe.fromHex(t).toHex(!1);
  return Bi(n);
}
function kd(e) {
  const t = e.readUInt8(), n = t === 4 ? Vk : Kk;
  return Q8(zt([t, e.readBytes(n)]));
}
function n$(e) {
  const t = Uk(e), n = t.length == em;
  return { data: t, compressed: n };
}
function r$(e, t) {
  const [n, r] = fl(t, e.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const o = Ba(r, 1) + Hn.fromHex(n).toCompactHex();
  return cm(o);
}
function s$(e) {
  return J8(e.data);
}
function o$(e, t, n) {
  return typeof e == "string" && (e = lm(e)), typeof n == "string" && (n = b0(n)), {
    type: xe.Payload,
    payloadType: De.TokenTransfer,
    recipient: e,
    amount: Sn(t, !1),
    memo: n ?? b0("")
  };
}
function i$(e, t, n, r) {
  return typeof e == "string" && (e = Rf(e)), typeof t == "string" && (t = Co(t)), typeof n == "string" && (n = Co(n)), {
    type: xe.Payload,
    payloadType: De.ContractCall,
    contractAddress: e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function w0(e, t, n) {
  return typeof e == "string" && (e = Co(e)), typeof t == "string" && (t = g$(t)), typeof n == "number" ? {
    type: xe.Payload,
    payloadType: De.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: xe.Payload,
    payloadType: De.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function a$() {
  return { type: xe.Payload, payloadType: De.PoisonMicroblock };
}
function m0(e, t) {
  if (e.byteLength != ho)
    throw Error(`Coinbase buffer size must be ${ho} bytes`);
  return t != null ? {
    type: xe.Payload,
    payloadType: De.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: xe.Payload,
    payloadType: De.Coinbase,
    coinbaseBytes: e
  };
}
function c$(e, t, n) {
  if (e.byteLength != ho)
    throw Error(`Coinbase buffer size must be ${ho} bytes`);
  if (n.byteLength != xd)
    throw Error(`VRF proof buffer size must be ${xd} bytes`);
  return {
    type: xe.Payload,
    payloadType: De.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === te.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
var $d;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended";
})($d || ($d = {}));
function l$(e, t, n, r, s, o, i) {
  return {
    type: xe.Payload,
    payloadType: De.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: o,
    publicKeyHash: i
  };
}
function mm(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case De.TokenTransfer:
      t.push(Ft(e.recipient)), t.push(Fs(e.amount, !1, 8)), t.push(Fr(e.memo));
      break;
    case De.ContractCall:
      t.push(Fr(e.contractAddress)), t.push(Fr(e.contractName)), t.push(Fr(e.functionName));
      const n = new Uint8Array(4);
      Lo(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(Ft(r));
      });
      break;
    case De.SmartContract:
      t.push(Fr(e.contractName)), t.push(Fr(e.codeBody));
      break;
    case De.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(Fr(e.contractName)), t.push(Fr(e.codeBody));
      break;
    case De.PoisonMicroblock:
      break;
    case De.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case De.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(Ft(e.recipient));
      break;
    case De.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(Ft(e.recipient ? gm(e.recipient) : pm())), t.push(e.vrfProof);
      break;
    case De.TenureChange:
      t.push(At(e.tenureHash)), t.push(At(e.previousTenureHash)), t.push(At(e.burnViewHash)), t.push(At(e.previousTenureEnd)), t.push(Lo(new Uint8Array(4), e.previousTenureBlocks)), t.push(Fk(new Uint8Array(1), e.cause)), t.push(At(e.publicKeyHash));
      break;
  }
  return zt(t);
}
function u$(e) {
  switch (e.readUInt8Enum(De, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case De.TokenTransfer:
      const n = Wn(e), r = Sn(e.readBytes(8), !1), s = xm(e);
      return o$(n, r, s);
    case De.ContractCall:
      const o = Mi(e), i = Xn(e), a = Xn(e), c = [], p = e.readUInt32BE();
      for (let v = 0; v < p; v++) {
        const T = Wn(e);
        c.push(T);
      }
      return i$(o, i, a, c);
    case De.SmartContract:
      const g = Xn(e), h = Xn(e, 4, 1e5);
      return w0(g, h);
    case De.VersionedSmartContract: {
      const v = e.readUInt8Enum(Sd, (z) => {
        throw new Error(`Cannot recognize ClarityVersion: ${z}`);
      }), T = Xn(e), B = Xn(e, 4, 1e5);
      return w0(T, B, v);
    }
    case De.PoisonMicroblock:
      return a$();
    case De.Coinbase: {
      const v = e.readBytes(ho);
      return m0(v);
    }
    case De.CoinbaseToAltRecipient: {
      const v = e.readBytes(ho), T = Wn(e);
      return m0(v, T);
    }
    case De.NakamotoCoinbase: {
      const v = e.readBytes(ho), T = Wn(e), B = e.readBytes(xd);
      return c$(v, T, B);
    }
    case De.TenureChange:
      const w = je(e.readBytes(20)), y = je(e.readBytes(20)), S = je(e.readBytes(20)), x = je(e.readBytes(32)), L = e.readUInt32BE(), O = e.readUInt8Enum($d, (v) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${v}`);
      }), U = je(e.readBytes(20));
      return l$(w, y, S, x, L, O, U);
  }
}
class Pl extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class so extends Pl {
  constructor(t) {
    super(t);
  }
}
class Un extends Pl {
  constructor(t) {
    super(t);
  }
}
class Jc extends Pl {
  constructor(t) {
    super(t);
  }
}
class uo extends Pl {
  constructor(t) {
    super(t);
  }
}
var ar;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ar || (ar = {}));
function Id(e) {
  return cm(je(e.readBytes(Nl)));
}
function hi(e, t) {
  return {
    pubKeyEncoding: e,
    type: xe.TransactionAuthField,
    contents: t
  };
}
function d$(e) {
  const t = e.readUInt8Enum(ar, (n) => {
    throw new Un(`Could not read ${n} as AuthFieldType`);
  });
  switch (t) {
    case ar.PublicKeyCompressed:
      return hi(It.Compressed, kd(e));
    case ar.PublicKeyUncompressed:
      return hi(It.Uncompressed, t$(kd(e).data));
    case ar.SignatureCompressed:
      return hi(It.Compressed, Id(e));
    case ar.SignatureUncompressed:
      return hi(It.Uncompressed, Id(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(t)}`);
  }
}
function zf(e) {
  return At(e.data);
}
function f$(e) {
  const t = [];
  switch (e.contents.type) {
    case xe.PublicKey:
      t.push(e.pubKeyEncoding === It.Compressed ? ar.PublicKeyCompressed : ar.PublicKeyUncompressed), t.push(Qc(e$(e.contents.data)));
      break;
    case xe.MessageSignature:
      t.push(e.pubKeyEncoding === It.Compressed ? ar.SignatureCompressed : ar.SignatureUncompressed), t.push(zf(e.contents));
      break;
  }
  return zt(t);
}
function Fr(e) {
  switch (e.type) {
    case xe.Address:
      return Ma(e);
    case xe.Principal:
      return bm(e);
    case xe.LengthPrefixedString:
      return Ni(e);
    case xe.MemoString:
      return y$(e);
    case xe.AssetInfo:
      return Sm(e);
    case xe.PostCondition:
      return w$(e);
    case xe.PublicKey:
      return Qc(e);
    case xe.LengthPrefixedList:
      return Vf(e);
    case xe.Payload:
      return mm(e);
    case xe.TransactionAuthField:
      return f$(e);
    case xe.MessageSignature:
      return zf(e);
  }
}
function h$() {
  return {
    type: xe.Address,
    version: Zc.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Gf(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === pt.SerializeP2PKH || t === pt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === pt.SerializeP2WPKH || t === pt.SerializeP2WSH || t === pt.SerializeP2WSHNonSequential) && !r.every(ji))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case pt.SerializeP2PKH:
      return ra(e, _$(r[0].data));
    case pt.SerializeP2WPKH:
      return ra(e, P$(r[0].data));
    case pt.SerializeP2SH:
    case pt.SerializeP2SHNonSequential:
      return ra(e, U$(n, r.map(Qc)));
    case pt.SerializeP2WSH:
    case pt.SerializeP2WSHNonSequential:
      return ra(e, H$(n, r.map(Qc)));
  }
}
function Ma(e) {
  const t = [];
  return t.push(At(Ba(e.version, 1))), t.push(At(e.hash160)), zt(t);
}
function Mi(e) {
  const t = Bl(je(e.readBytes(1))), n = je(e.readBytes(20));
  return { type: xe.Address, version: t, hash160: n };
}
function bm(e) {
  const t = [];
  return t.push(e.prefix), t.push(Ma(e.address)), e.prefix === ba.Contract && t.push(Ni(e.contractName)), zt(t);
}
function p$(e) {
  const t = e.readUInt8Enum(ba, (s) => {
    throw new Un(`Unexpected Principal payload type: ${s}`);
  }), n = Mi(e);
  if (t === ba.Standard)
    return { type: xe.Principal, prefix: t, address: n };
  const r = Xn(e);
  return {
    type: xe.Principal,
    prefix: t,
    address: n,
    contractName: r
  };
}
function Ni(e) {
  const t = [], n = Fi(e.content), r = n.byteLength;
  return t.push(At(Ba(r, e.lengthPrefixBytes))), t.push(n), zt(t);
}
function Xn(e, t, n) {
  t = t || 1;
  const r = Bl(je(e.readBytes(t))), s = Uf(e.readBytes(r));
  return Co(s, t, n ?? 128);
}
function g$(e) {
  return Co(e, 4, 1e5);
}
function b0(e) {
  if (e && km(e, Xc))
    throw new Error(`Memo exceeds maximum length of ${Xc} bytes`);
  return { type: xe.MemoString, content: e };
}
function y$(e) {
  const t = [], n = Fi(e.content), r = N$(je(n), Xc * 2);
  return t.push(At(r)), zt(t);
}
function xm(e) {
  let t = Uf(e.readBytes(Xc));
  return t = t.replace(/\u0000*$/, ""), { type: xe.MemoString, content: t };
}
function Sm(e) {
  const t = [];
  return t.push(Ma(e.address)), t.push(Ni(e.contractName)), t.push(Ni(e.assetName)), zt(t);
}
function Ld(e) {
  return {
    type: xe.AssetInfo,
    address: Mi(e),
    contractName: Xn(e),
    assetName: Xn(e)
  };
}
function Kf(e, t) {
  return {
    type: xe.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function Vf(e) {
  const t = e.values, n = [];
  n.push(At(Ba(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(Fr(r));
  return zt(n);
}
function vm(e, t, n) {
  const r = Bl(je(e.readBytes(4))), s = [];
  for (let o = 0; o < r; o++)
    switch (t) {
      case xe.Address:
        s.push(Mi(e));
        break;
      case xe.LengthPrefixedString:
        s.push(Xn(e));
        break;
      case xe.MemoString:
        s.push(xm(e));
        break;
      case xe.AssetInfo:
        s.push(Ld(e));
        break;
      case xe.PostCondition:
        s.push(m$(e));
        break;
      case xe.PublicKey:
        s.push(kd(e));
        break;
      case xe.TransactionAuthField:
        s.push(d$(e));
        break;
    }
  return Kf(s, n);
}
function w$(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(bm(e.principal)), (e.conditionType === En.Fungible || e.conditionType === En.NonFungible) && t.push(Sm(e.assetInfo)), e.conditionType === En.NonFungible && t.push(Ft(e.assetName)), t.push(e.conditionCode), e.conditionType === En.STX || e.conditionType === En.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new so("The post-condition amount may not be larger than 8 bytes");
    t.push(Fs(e.amount, !1, 8));
  }
  return zt(t);
}
function m$(e) {
  const t = e.readUInt8Enum(En, (i) => {
    throw new Un(`Could not read ${i} as PostConditionType`);
  }), n = p$(e);
  let r, s, o;
  switch (t) {
    case En.STX:
      return r = e.readUInt8Enum(ma, (a) => {
        throw new Un(`Could not read ${a} as FungibleConditionCode`);
      }), o = BigInt(`0x${je(e.readBytes(8))}`), {
        type: xe.PostCondition,
        conditionType: En.STX,
        principal: n,
        conditionCode: r,
        amount: o
      };
    case En.Fungible:
      return s = Ld(e), r = e.readUInt8Enum(ma, (a) => {
        throw new Un(`Could not read ${a} as FungibleConditionCode`);
      }), o = BigInt(`0x${je(e.readBytes(8))}`), {
        type: xe.PostCondition,
        conditionType: En.Fungible,
        principal: n,
        conditionCode: r,
        amount: o,
        assetInfo: s
      };
    case En.NonFungible:
      s = Ld(e);
      const i = Wn(e);
      return r = e.readUInt8Enum(vd, (a) => {
        throw new Un(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: xe.PostCondition,
        conditionType: En.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: i
      };
  }
}
function Br(e, t) {
  return zt([e, t]);
}
function b$(e) {
  return new Uint8Array([e.type]);
}
function x$(e) {
  return e.type === te.OptionalNone ? new Uint8Array([e.type]) : Br(e.type, Ft(e.value));
}
function S$(e) {
  const t = new Uint8Array(4);
  return Lo(t, e.buffer.length, 0), Br(e.type, Ml(t, e.buffer));
}
function v$(e) {
  const t = Pf(Ck(e.value, BigInt(Gk)), tm);
  return Br(e.type, t);
}
function A$(e) {
  const t = Pf(e.value, tm);
  return Br(e.type, t);
}
function E$(e) {
  return Br(e.type, Ma(e.address));
}
function k$(e) {
  return Br(e.type, Ml(Ma(e.address), Ni(e.contractName)));
}
function $$(e) {
  return Br(e.type, Ft(e.value));
}
function I$(e) {
  const t = [], n = new Uint8Array(4);
  Lo(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = Ft(r);
    t.push(s);
  }
  return Br(e.type, zt(t));
}
function L$(e) {
  const t = [], n = new Uint8Array(4);
  Lo(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = Co(s);
    t.push(Ni(o));
    const i = Ft(e.data[s]);
    t.push(i);
  }
  return Br(e.type, zt(t));
}
function Am(e, t) {
  const n = [], r = t == "ascii" ? Jw(e.data) : Fi(e.data), s = new Uint8Array(4);
  return Lo(s, r.length, 0), n.push(s), n.push(r), Br(e.type, zt(n));
}
function C$(e) {
  return Am(e, "ascii");
}
function T$(e) {
  return Am(e, "utf8");
}
function Ft(e) {
  switch (e.type) {
    case te.BoolTrue:
    case te.BoolFalse:
      return b$(e);
    case te.OptionalNone:
    case te.OptionalSome:
      return x$(e);
    case te.Buffer:
      return S$(e);
    case te.UInt:
      return A$(e);
    case te.Int:
      return v$(e);
    case te.PrincipalStandard:
      return E$(e);
    case te.PrincipalContract:
      return k$(e);
    case te.ResponseOk:
    case te.ResponseErr:
      return $$(e);
    case te.List:
      return I$(e);
    case te.Tuple:
      return L$(e);
    case te.StringASCII:
      return C$(e);
    case te.StringUTF8:
      return T$(e);
    default:
      throw new so("Unable to serialize. Invalid Clarity Value.");
  }
}
function B$(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const x0 = /* @__PURE__ */ new Map();
function Em(e, t) {
  const n = x0.get(e);
  if (n !== void 0)
    return n(t);
  const r = B$(e);
  return x0.set(e, r), Em(e, t);
}
class ca {
  constructor(t) {
    this.consumed = 0, this.source = t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return jk(this.readBytes(4), 0);
  }
  readUInt8() {
    return Dk(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Hk(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = je(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = je(n);
    return BigInt(`0x${r}`);
  }
  get readOffset() {
    return this.consumed;
  }
  set readOffset(t) {
    this.consumed = t;
  }
  get internalBytes() {
    return this.source;
  }
  readUInt8Enum(t, n) {
    const r = this.readUInt8();
    if (Em(t, r))
      return r;
    throw n(r);
  }
}
function Wn(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new ca(At(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new ca(e) : t = e;
  switch (t.readUInt8Enum(te, (r) => {
    throw new Un(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case te.Int:
      return V8(t.readBytes(16));
    case te.UInt:
      return Zn(t.readBytes(16));
    case te.Buffer:
      const r = t.readUInt32BE();
      return hm(t.readBytes(r));
    case te.BoolTrue:
      return dm();
    case te.BoolFalse:
      return fm();
    case te.PrincipalStandard:
      const s = Mi(t);
      return R8(s);
    case te.PrincipalContract:
      const o = Mi(t), i = Xn(t);
      return um(o, i);
    case te.ResponseOk:
      return Y8(Wn(t));
    case te.ResponseErr:
      return q8(Wn(t));
    case te.OptionalNone:
      return pm();
    case te.OptionalSome:
      return gm(Wn(t));
    case te.List:
      const a = t.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(Wn(t));
      return X8(c);
    case te.Tuple:
      const p = t.readUInt32BE(), g = {};
      for (let x = 0; x < p; x++) {
        const L = Xn(t).content;
        if (L === void 0)
          throw new Un('"content" is undefined');
        g[L] = Wn(t);
      }
      return Xr(g);
    case te.StringASCII:
      const h = t.readUInt32BE(), w = Nk(t.readBytes(h));
      return Mt(w);
    case te.StringUTF8:
      const y = t.readUInt32BE(), S = Uf(t.readBytes(y));
      return W8(S);
    default:
      throw new Un("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const M$ = (e) => e.length % 2 == 0 ? e : `0${e}`, N$ = (e, t) => e.padEnd(t, "0"), km = (e, t) => e ? Fi(e).length > t : !1;
function Cd(e) {
  return Gy(e);
}
const xa = (e) => c8(jf(e)), qf = (e) => je(D8(e)), _$ = (e) => je(xa(e)), P$ = (e) => {
  const t = xa(e), n = Ml(new Uint8Array([0]), new Uint8Array([t.length]), t), r = xa(n);
  return je(r);
}, U$ = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + t.length), n.push(174);
  const r = zt(n), s = xa(r);
  return je(s);
}, H$ = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = zt(n), s = jf(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const i = zt(o), a = xa(i);
  return je(a);
};
function O$(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function $m(e) {
  const t = Ft(e);
  return `0x${je(t)}`;
}
function D$(e) {
  return Wn(e);
}
const yi = (e) => {
  try {
    return Uo.c32addressDecode(e), !0;
  } catch {
    return !1;
  }
};
function Yf() {
  return {
    type: xe.MessageSignature,
    data: je(new Uint8Array(Nl))
  };
}
function Im(e, t, n, r) {
  const s = Gf(0, e, 1, [Bi(t)]).hash160, o = ji(Bi(t)) ? It.Compressed : It.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: Sn(n, !1),
    fee: Sn(r, !1),
    keyEncoding: o,
    signature: Yf()
  };
}
function Sa(e) {
  return "signature" in e;
}
function S0(e) {
  return e === pt.SerializeP2SH || e === pt.SerializeP2WSH;
}
function F$(e) {
  return e === pt.SerializeP2SHNonSequential || e === pt.SerializeP2WSHNonSequential;
}
function v0(e) {
  const t = Cd(e);
  return t.nonce = 0, t.fee = 0, Sa(t) ? t.signature = Yf() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function j$(e) {
  const t = [
    e.hashMode,
    At(e.signer),
    Fs(e.nonce, !1, 8),
    Fs(e.fee, !1, 8),
    e.keyEncoding,
    zf(e.signature)
  ];
  return zt(t);
}
function R$(e) {
  const t = [
    e.hashMode,
    At(e.signer),
    Fs(e.nonce, !1, 8),
    Fs(e.fee, !1, 8)
  ], n = Kf(e.fields);
  t.push(Vf(n));
  const r = new Uint8Array(2);
  return Ok(r, e.signaturesRequired, 0), t.push(r), zt(t);
}
function z$(e, t) {
  const n = je(t.readBytes(20)), r = BigInt(`0x${je(t.readBytes(8))}`), s = BigInt(`0x${je(t.readBytes(8))}`), o = t.readUInt8Enum(It, (a) => {
    throw new Un(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === pt.SerializeP2WPKH && o != It.Compressed)
    throw new Un("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = Id(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: o,
    signature: i
  };
}
function G$(e, t) {
  const n = je(t.readBytes(20)), r = BigInt("0x" + je(t.readBytes(8))), s = BigInt("0x" + je(t.readBytes(8))), o = vm(t, xe.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const p of o)
    switch (p.contents.type) {
      case xe.PublicKey:
        ji(p.contents) || (i = !0);
        break;
      case xe.MessageSignature:
        if (p.pubKeyEncoding === It.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new uo("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === pt.SerializeP2WSH || e === pt.SerializeP2WSHNonSequential))
    throw new uo("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    fields: o,
    signaturesRequired: c
  };
}
function fu(e) {
  return Sa(e) ? j$(e) : R$(e);
}
function hu(e) {
  const t = e.readUInt8Enum(pt, (n) => {
    throw new Un(`Could not parse ${n} as AddressHashMode`);
  });
  return t === pt.SerializeP2PKH || t === pt.SerializeP2WPKH ? z$(t, e) : G$(t, e);
}
function Lm(e, t, n, r) {
  const o = e + je(new Uint8Array([t])) + je(Fs(n, !1, 8)) + je(Fs(r, !1, 8));
  if (At(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return qf(At(o));
}
function Cm(e, t, n) {
  const r = 33 + Nl, s = ji(t) ? It.Compressed : It.Uncompressed, o = e + M$(s.toString(16)) + n.data, i = At(o);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return qf(i);
}
function K$(e, t, n, r, s) {
  const o = Lm(e, t, n, r), i = r$(s, o), a = s$(s), c = Cm(o, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function Tm(e, t, n, r, s, o) {
  const i = Lm(e, t, n, r), a = Bi(Z8(i, o, s)), c = Cm(i, a, o);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function V$() {
  const e = Im(pt.SerializeP2PKH, "", 0, 0);
  return e.signer = h$().hash160, e.keyEncoding = It.Compressed, e.signature = Yf(), e;
}
function A0(e, t, n) {
  return Sa(e) ? q$(e, t, n) : Y$(e, t, n);
}
function q$(e, t, n) {
  const { pubKey: r, nextSigHash: s } = Tm(t, n, e.fee, e.nonce, e.keyEncoding, e.signature), o = Gf(0, e.hashMode, 1, [r]).hash160;
  if (o !== e.signer)
    throw new uo(`Signer hash does not equal hash of public key(s): ${o} != ${e.signer}`);
  return s;
}
function Y$(e, t, n) {
  const r = [];
  let s = t, o = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case xe.PublicKey:
        ji(c.contents) || (o = !0), r.push(c.contents);
        break;
      case xe.MessageSignature:
        c.pubKeyEncoding === It.Uncompressed && (o = !0);
        const { pubKey: p, nextSigHash: g } = Tm(s, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents);
        if (S0(e.hashMode) && (s = g), r.push(p), i += 1, i === 65536)
          throw new uo("Too many signatures");
        break;
    }
  if (S0(e.hashMode) && i !== e.signaturesRequired || F$(e.hashMode) && i < e.signaturesRequired)
    throw new uo("Incorrect number of signatures");
  if (o && (e.hashMode === pt.SerializeP2WSH || e.hashMode === pt.SerializeP2WSHNonSequential))
    throw new uo("Uncompressed keys are not allowed in this hash mode");
  const a = Gf(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new uo(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return s;
}
function Bm(e) {
  return {
    authType: _t.Standard,
    spendingCondition: e
  };
}
function Mm(e, t) {
  return {
    authType: _t.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || Im(pt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function E0(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case _t.Standard:
        return Bm(v0(e.spendingCondition));
      case _t.Sponsored:
        return Mm(v0(e.spendingCondition), V$());
      default:
        throw new Jc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function X$(e, t) {
  switch (e.authType) {
    case _t.Standard:
      return A0(e.spendingCondition, t, _t.Standard);
    case _t.Sponsored:
      return A0(e.spendingCondition, t, _t.Standard);
    default:
      throw new Jc("Invalid origin auth type");
  }
}
function W$(e, t) {
  switch (e.authType) {
    case _t.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Sn(t, !1)
      };
      return { ...e, spendingCondition: n };
    case _t.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Sn(t, !1)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function Z$(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Sn(t, !1)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function Q$(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Sn(t, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function J$(e, t) {
  const n = {
    ...t,
    nonce: Sn(t.nonce, !1),
    fee: Sn(t.fee, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function e6(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case _t.Standard:
      t.push(fu(e.spendingCondition));
      break;
    case _t.Sponsored:
      t.push(fu(e.spendingCondition)), t.push(fu(e.sponsorSpendingCondition));
      break;
  }
  return zt(t);
}
function t6(e) {
  const t = e.readUInt8Enum(_t, (r) => {
    throw new Un(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case _t.Standard:
      return n = hu(e), Bm(n);
    case _t.Sponsored:
      n = hu(e);
      const r = hu(e);
      return Mm(n, r);
  }
}
class n6 {
  constructor(t, n, r, s, o, i, a) {
    if (this.version = t, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Sn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? Rk, this.postConditionMode = o ?? Ti.Deny, this.postConditions = s ?? Kf([]), i)
      this.anchorMode = qk(i);
    else
      switch (r.payloadType) {
        case De.Coinbase:
        case De.CoinbaseToAltRecipient:
        case De.NakamotoCoinbase:
        case De.PoisonMicroblock:
        case De.TenureChange:
          this.anchorMode = An.OnChainOnly;
          break;
        case De.ContractCall:
        case De.SmartContract:
        case De.VersionedSmartContract:
        case De.TokenTransfer:
          this.anchorMode = An.Any;
          break;
      }
  }
  signBegin() {
    const t = Cd(this);
    return t.auth = E0(t.auth), t.txid();
  }
  verifyBegin() {
    const t = Cd(this);
    return t.auth = E0(t.auth), t.txid();
  }
  verifyOrigin() {
    return X$(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, _t.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === _t.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, _t.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = this.auth.spendingCondition;
    if (n && !Sa(n)) {
      const r = ji(t);
      n.fields.push(hi(r ? It.Compressed : It.Uncompressed, t));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: o, nextSigHash: i } = K$(n, r, t.fee, t.nonce, s);
    return Sa(t) ? t.signature = o : t.fields.push(hi(s.data.byteLength === em ? It.Compressed : It.Uncompressed, o)), i;
  }
  txid() {
    const t = this.serialize();
    return qf(t);
  }
  setSponsor(t) {
    if (this.auth.authType != _t.Sponsored)
      throw new Jc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = J$(this.auth, t);
  }
  setFee(t) {
    this.auth = W$(this.auth, t);
  }
  setNonce(t) {
    this.auth = Z$(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != _t.Sponsored)
      throw new Jc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Q$(this.auth, t);
  }
  serialize() {
    if (this.version === void 0)
      throw new so('"version" is undefined');
    if (this.chainId === void 0)
      throw new so('"chainId" is undefined');
    if (this.auth === void 0)
      throw new so('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new so('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new so('"payload" is undefined');
    const t = [];
    t.push(this.version);
    const n = new Uint8Array(4);
    return Lo(n, this.chainId, 0), t.push(n), t.push(e6(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(Vf(this.postConditions)), t.push(mm(this.payload)), zt(t);
  }
}
function pi(e) {
  let t;
  typeof e == "string" ? e.slice(0, 2).toLowerCase() === "0x" ? t = new ca(At(e.slice(2))) : t = new ca(At(e)) : e instanceof Uint8Array ? t = new ca(e) : t = e;
  const n = t.readUInt8Enum(Wc, (p) => {
    throw new Error(`Could not parse ${p} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = t6(t), o = t.readUInt8Enum(An, (p) => {
    throw new Error(`Could not parse ${p} as AnchorMode`);
  }), i = t.readUInt8Enum(Ti, (p) => {
    throw new Error(`Could not parse ${p} as PostConditionMode`);
  }), a = vm(t, xe.PostCondition), c = u$(t);
  return new n6(n, s, c, a, i, o, r);
}
const r6 = G8, la = Zn, s6 = hm;
const o6 = /* @__PURE__ */ new Set([4001, -31001]), i6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], a6 = ["result", "data", "payload", "response", "params"], k0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Ul = (e) => typeof e == "string" && e.toLowerCase().includes("xverse"), Fo = () => {
  if (!(typeof window > "u")) {
    try {
      const e = window.top;
      if (e && e !== window.self && e.location.origin === window.location.origin)
        return e;
    } catch {
    }
    return window;
  }
}, Vr = (e, t) => {
  if (!(!e || !t))
    return t.split(".").reduce((n, r) => n == null ? void 0 : n[r], e);
}, c6 = (e, t) => e.id === t.id || !!(e.name && t.name && e.name.toLowerCase() === t.name.toLowerCase()), Nm = (e) => {
  if (!e)
    return [];
  const t = e, n = [
    ...t.btc_providers ?? [],
    ...t.webbtc_providers ?? [],
    ...t.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((o) => c6(o, r)) === s
  );
}, _m = (e) => e ? Nm(Fo()).some(
  (t) => {
    var n;
    return t.id === e && (Ul(t.id) || ((n = t.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Pm = () => {
  if (typeof window > "u")
    return;
  const e = Fo(), t = Nm(e).filter(
    (n) => {
      var r;
      return Ul(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of t) {
    const r = Vr(e, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of i6) {
    const r = Vr(e, n) ?? (e === window ? void 0 : Vr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, l6 = (e) => {
  if (typeof window > "u" || !e)
    return;
  const t = Fo(), n = Vr(t, e) ?? (t === window ? void 0 : Vr(window, e)) ?? vl(e);
  if (n)
    return n;
  if (Ul(e) || _m(e))
    return Pm();
}, uc = (e, t) => {
  try {
    e == null || e(t);
  } catch {
  }
}, u6 = ["blockstack-session", "blockstack"], d6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const e of u6) {
      let t = null;
      try {
        t = window.localStorage.getItem(e);
      } catch {
        continue;
      }
      if (!t)
        continue;
      let n = !1;
      try {
        const r = JSON.parse(t);
        n = typeof (r == null ? void 0 : r.version) == "string" && r.version.length > 0;
      } catch {
        n = !1;
      }
      if (!n)
        try {
          window.localStorage.removeItem(e);
        } catch {
        }
    }
};
d6();
const Um = (e) => e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e, Pn = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}, f6 = (e) => {
  const t = Pn(e);
  if (!t)
    return null;
  const n = Um(t);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : t.startsWith("0x") || t.startsWith("0X") ? t : `0x${n}`;
}, h6 = (e) => {
  const t = Pn(e);
  if (!t)
    return null;
  const n = Um(t);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Td = (e, t = "mainnet") => {
  if (typeof e == "string") {
    const n = e.toLowerCase();
    if (n.includes("testnet") || n === "test")
      return "testnet";
    if (n.includes("mainnet") || n === "main")
      return "mainnet";
  }
  if (e && typeof e == "object") {
    const n = e;
    if (typeof n.network == "string")
      return Td(n.network, t);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Td(r, t);
  }
  return t;
}, po = (e) => {
  if (typeof e > "u" || e === null)
    return;
  if (typeof e == "bigint")
    return e.toString(10);
  if (typeof e == "number")
    return Number.isFinite(e) ? String(e) : void 0;
  const t = String(e).trim();
  return t.length > 0 ? t : void 0;
}, va = (e, t = 0) => {
  if (t > 8)
    return null;
  if (typeof e == "string") {
    const s = e.trim();
    return yi(s) ? s : null;
  }
  if (!e)
    return null;
  if (Array.isArray(e)) {
    for (const s of e) {
      const o = va(s, t + 1);
      if (o)
        return o;
    }
    return null;
  }
  if (typeof e != "object")
    return null;
  const n = e, r = [
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
    const o = va(n[s], t + 1);
    if (o)
      return o;
  }
  return typeof n.mainnet == "string" && yi(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && yi(n.testnet) ? n.testnet.trim() : null;
}, $0 = (e) => {
  const t = e && typeof e == "object" && "code" in e ? e.code : void 0, r = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Hm = (e) => {
  if (e && typeof e == "object") {
    const r = "code" in e ? e.code : void 0;
    if (typeof r == "number" && o6.has(r))
      return !0;
  }
  const n = (e instanceof Error ? e.message : String(e ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, To = (e) => {
  if (e instanceof Error)
    return e;
  const t = e && typeof e == "object" ? e : {}, n = t.error && typeof t.error == "object" ? t.error : null, r = Pn(n == null ? void 0 : n.message) ?? Pn(t.message) ?? Pn(t.error) ?? Pn(e) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? t.code, s.data = (n == null ? void 0 : n.data) ?? t.data, s;
}, _i = (e) => {
  if (e && typeof e == "object") {
    const t = e;
    if (t.error)
      throw To(t);
    if (t.status === "error")
      throw To(t.result ?? t);
  }
  return e;
}, I0 = async (e, t, n) => {
  if (typeof e.request != "function")
    throw new Error(`Wallet provider does not support request("${t}").`);
  try {
    const r = await e.request(t, n);
    return _i(r);
  } catch (r) {
    throw To(r);
  }
}, Om = () => Pm(), Xf = () => {
  if (typeof window > "u")
    return;
  const e = Fo();
  for (const t of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Vr(e, t) ?? (e === window ? void 0 : Vr(window, t));
    if (n)
      return n;
  }
}, L0 = () => {
  if (typeof window > "u")
    return;
  const e = Xf();
  if (typeof (e == null ? void 0 : e.transactionRequest) == "function")
    return e;
  const t = Fo();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Vr(t, n) ?? (t === window ? void 0 : Vr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Ic = (e) => {
  var r, s;
  const t = So();
  if (Ul(t) || _m(t))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Fo() ?? window;
  return e === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || e === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || e === Om();
}, pu = (e) => {
  const t = h6(e);
  if (!t)
    return null;
  try {
    const n = pi(t).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, el = (e, t = 0) => {
  if (t > 6 || typeof e > "u" || e === null)
    return null;
  const n = pu(e), r = f6(e) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Pn(e) ?? void 0 : void 0
    };
  if (Array.isArray(e)) {
    for (const a of e) {
      const c = el(a, t + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof e != "object")
    return null;
  const s = e;
  let o = null;
  for (const a of k0)
    if (pu(s[a])) {
      o = Pn(s[a]);
      break;
    }
  const i = Pn(s.txId) || Pn(s.txid) || Pn(s.transactionId);
  if (i)
    return {
      ...s,
      txId: i,
      txid: i,
      txRaw: o ?? Pn(s.txRaw) ?? void 0
    };
  for (const a of k0) {
    const c = pu(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Pn(s[a]) ?? void 0
      };
  }
  for (const a of a6) {
    const c = s[a], p = el(c, t + 1);
    if (p)
      return {
        ...s,
        ...c && typeof c == "object" ? c : {},
        ...p,
        txId: p.txId,
        txid: p.txid ?? p.txId
      };
  }
  return null;
}, gu = (e) => {
  const t = el(e);
  if (t)
    return t;
  throw new Error("Wallet response did not include a transaction id.");
}, p6 = (e) => {
  const t = el(e);
  return t || (e && typeof e == "object" ? e : { result: e });
}, g6 = (e) => ({
  ...e,
  fee: po(e.fee),
  nonce: po(e.nonce),
  sponsored: e.sponsored === !0
}), C0 = (e) => ({
  recipient: e.recipient,
  amount: po(e.amount) ?? "0",
  memo: e.memo,
  network: Td(e.network),
  address: e.stxAddress,
  fee: po(e.fee),
  nonce: po(e.nonce),
  sponsored: e.sponsored ?? !1
}), Dm = "WALLET_ADDRESS_MISMATCH", y6 = 45e3;
let ua = null;
const Bd = (e) => {
  e && (ua = { address: e, at: Date.now() });
}, w6 = () => {
  ua = null;
}, m6 = () => ua && Date.now() - ua.at <= y6 ? ua.address : null, b6 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t.includes("network mismatch") || t.includes("mismatch") && t.includes("network");
}, x6 = async (e) => {
  w6();
  try {
    await e.request("wallet_disconnect");
  } catch {
  }
  const t = _i(await e.request("wallet_connect")), n = va(t);
  return Bd(n), n;
}, S6 = async (e, t, n, r) => {
  try {
    return _i(await e.request(t, n));
  } catch (s) {
    const o = To(s);
    if (!b6(o))
      throw o;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: t,
      message: o.message
    });
    let i = null;
    try {
      i = await x6(e);
    } catch (a) {
      throw console.info("[wallet:xverse-preflight]", {
        stage: "RECOVERY_RECONNECT_FAILED",
        message: a instanceof Error ? a.message : String(a)
      }), o;
    }
    if (!i || r && i !== r)
      throw Object.assign(
        new Error(
          i ? `Xverse reconnected as ${i}, not the expected ${r}. Switch back to that account and retry.` : o.message
        ),
        { code: i ? Dm : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: t, address: i });
    try {
      return _i(await e.request(t, n));
    } catch (a) {
      throw To(a);
    }
  }
};
let T0 = 3e4;
const v6 = (e, t) => {
  let n;
  const r = new Promise((s, o) => {
    n = setTimeout(() => {
      o(
        Object.assign(
          new Error(`Xverse did not answer ${t} within ${T0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, T0);
  });
  return Promise.race([e, r]).finally(() => {
    n && clearTimeout(n);
  });
}, A6 = async (e, t, n) => {
  const r = (c, p) => {
    if (t && c !== t)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${p}) does not match the connected address ${t}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Dm }
      );
    return c;
  }, s = m6();
  if (s)
    return uc(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let o = null;
  uc(n, "account-read");
  try {
    const c = _i(
      await v6(e.request("wallet_getAccount"), "wallet_getAccount")
    );
    o = va(c), console.info("[wallet:xverse-preflight]", {
      stage: o ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: o
    });
  } catch (c) {
    if (Hm(c))
      throw To(c);
    uc(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (o)
    return Bd(o), r(o, "wallet_getAccount");
  let i;
  uc(n, "account-reconnect");
  try {
    i = _i(await e.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), To(c);
  }
  const a = va(i);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Bd(a), r(a, "wallet_connect");
}, E6 = async (e, t) => {
  if (!Ic(e)) {
    const o = await I0(
      e,
      "stx_transferStx",
      C0(t)
    );
    return gu(o);
  }
  const n = Xf();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const o = await I0(
      n,
      "stx_transferStx",
      C0(t)
    );
    return gu(o);
  }
  const r = Om();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await A6(r, t.stxAddress);
  const s = await S6(
    r,
    "stx_transferStx",
    {
      recipient: t.recipient,
      amount: po(t.amount) ?? "0",
      ...t.memo ? { memo: t.memo } : {},
      ...t.fee !== void 0 ? { fee: po(t.fee) } : {}
    },
    t.stxAddress
  );
  return gu(s);
}, k6 = () => So(), Fm = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const e = So(), t = e ? l6(e) : void 0;
  if (t)
    return t;
  const n = Fo() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, B0 = (e, t) => {
  const n = Fm(), r = g6({
    ...e,
    onFinish: (s) => {
      var o;
      (o = e.onFinish) == null || o.call(e, p6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return ic(r, t);
  if (Ic(n) && !Xf()) {
    const s = L0();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: So(),
        route: "legacy-transaction-request"
      }), ic(r, s);
  }
  return void E6(n, e).then((s) => {
    var o;
    (o = e.onFinish) == null || o.call(e, s);
  }).catch((s) => {
    var o, i;
    if ($0(s) && Ic(n)) {
      const a = L0();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: So(),
          route: "legacy-transaction-request"
        }), ic(r, a);
        return;
      }
    }
    if ($0(s) && !Ic(n)) {
      ic(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Hm(s)) {
      (o = e.onCancel) == null || o.call(e);
      return;
    }
    if (e.onError) {
      e.onError(s);
      return;
    }
    (i = e.onCancel) == null || i.call(e);
  });
}, $6 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), M0 = (e) => $m(e).replace(/^0x/, ""), N0 = "This wallet cannot sign messages. Try Xverse or Leather.", _0 = (e) => typeof (e == null ? void 0 : e.request) == "function", P0 = (e) => typeof (e == null ? void 0 : e.structuredDataSignatureRequest) == "function", I6 = (e) => {
  const t = e && typeof e == "object" ? e.code : void 0, n = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, L6 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(t) || t.includes("no longer supported") || t.includes("request() rpc") || t.includes("upgrade to the");
};
async function C6(e, t) {
  const n = await e.request("stx_signStructuredMessage", {
    message: M0(t.message),
    domain: M0(t.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function T6(e, t) {
  const n = await vk({
    domain: t.domain,
    message: t.message,
    network: Tl(t.network),
    stxAddress: t.stxAddress,
    appDetails: t.appDetails ?? $6()
  }), r = await e.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function yu(e) {
  var s, o;
  const t = k6() || "", n = /xverse/i.test(t);
  let r = Fm();
  if (n && !P0(r)) {
    const i = window;
    r = ((s = i.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((o = i.xverseProviders) == null ? void 0 : o.StacksProvider);
  }
  if (P0(r))
    try {
      return await T6(r, e);
    } catch (i) {
      if (n || !_0(r) || !L6(i)) throw i;
    }
  if (!n && _0(r))
    try {
      return await C6(r, e);
    } catch (i) {
      throw I6(i) ? new Error(N0) : i;
    }
  throw new Error(N0);
}
const U0 = 1000000n, zr = 1000000n, tl = 50n, jt = 3000n, fr = 300n, Zi = 3000n, B6 = 50000n, wu = 200n, Hl = 15000n, un = (e) => e + tl;
function rr(e) {
  const t = e < 0n ? "-" : "", n = e < 0n ? -e : e;
  return `${t}${n / U0}.${(n % U0).toString().padStart(6, "0")}`;
}
function H0(e, t = fr) {
  return e <= jt ? 0 : Number((e - jt) / un(t));
}
function mu(e, t = 0n) {
  const n = zr - e - t;
  return n > 0n ? n : 0n;
}
function M6(e, t = fr) {
  return e > zr ? "over" : e < jt + un(t) ? "empty" : e < B6 ? "low" : "ok";
}
const N6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", _6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", P6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function U6(e) {
  var n, r, s, o;
  const t = (e == null ? void 0 : e.success) === !0 ? (n = e.value) == null ? void 0 : n.value : null;
  return !t || ((r = t.version) == null ? void 0 : r.value) !== "1" || ((s = t["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((o = t["receipt-bytes"]) == null ? void 0 : o.value) !== "16" || P6.some((i, a) => {
    var c;
    return ((c = t["core-" + (a + 1)]) == null ? void 0 : c.value) !== N6 + "." + i;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const jm = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", bu = 3, H6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", O6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0", O0 = 1, [Md, Rm] = jm.split("."), Vn = (e) => Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
function Nd(e) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(e)) throw Error("Invalid encoded data.");
  return Uint8Array.from(e.match(/../g), (t) => parseInt(t, 16));
}
async function D6(e) {
  return Vn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(e))));
}
async function Os(e, t = {}) {
  const n = await fetch("/hiro/mainnet" + e, { ...t, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function zm(e, t = []) {
  const n = await Os(`/v2/contracts/call-read/${Md}/${Rm}/${e}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Md, arguments: t.map((r) => "0x" + Vn(Ft(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return ir(Wn(n.result));
}
async function F6() {
  const e = await Os(`/v2/contracts/source/${Md}/${Rm}?proof=0`);
  if (typeof e.source != "string" || await D6(e.source) !== _6) throw Error("Deployed source does not match the tested helper.");
  if (U6(await zm("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Gm(e) {
  return e.startsWith("SP") && yi(e) && !e.includes(".");
}
async function j6(e) {
  var r;
  if (!Gm(e)) throw Error("Invalid mainnet wallet address.");
  const t = await Os(`/v2/accounts/${e}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(t.balance) || !Number.isSafeInteger(t.nonce) || t.nonce < 0) throw Error("Malformed account data.");
  const n = await Os(`/extended/v1/address/${e}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== t.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= t.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(t.balance), nonce: BigInt(t.nonce) };
}
async function R6(e) {
  const t = await Os(`/v2/accounts/${e}?proof=0`);
  return BigInt(t.balance);
}
async function z6(e, t) {
  var s, o;
  const n = await zm("get-owner", [la(e), la(t)]), r = (n == null ? void 0 : n.success) === !0 ? (o = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : o.value : null;
  if (typeof r != "string" || !Gm(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function G6(e, t) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Nd(e), signal: AbortSignal.timeout(15e3) });
  } catch {
    throw Error("Submission outcome unknown. Reconcile the saved transaction before doing anything else.");
  }
  const r = await n.json();
  if (n.status === 400 && (r == null ? void 0 : r.reason) === "FeeTooLow") {
    const s = new Error("Node rejected the fee as too low. No automatic increase. Preview a new test with another fee.");
    throw Object.assign(s, { feeRejected: !0 }), s;
  }
  if (!n.ok || typeof r != "string" || r.replace(/^0x/, "") !== t.replace(/^0x/, "")) throw Error(`Submission unconfirmed (${n.status}). Reconcile or resend the same saved transaction; do not create a replacement.`);
  return r;
}
async function K6(e) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(e)) throw Error("Invalid transaction ID.");
  const t = await fetch(`/hiro/mainnet/extended/v1/tx/${e}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (t.status === 404) return null;
  if (!t.ok) throw Error("Transaction lookup unavailable.");
  return t.json();
}
function V6(e) {
  if (!e.raw || e.raw.length > 16384 || !e.txid) throw Error("Missing or oversized signed transaction.");
  const t = pi(Nd(e.raw)), n = t.auth, r = t.payload, s = n.spendingCondition;
  if (t.version !== 0 || t.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || fi(ra(Zc.MainnetSingleSig, s.signer)) !== e.address || s.fee !== BigInt(e.fee) || s.nonce !== BigInt(e.nonce) || t.txid() !== e.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (t.verifyOrigin(), e.kind === "play") {
    const o = t.postConditions.values[0];
    if (r.payloadType !== 2 || fi(r.contractAddress) + "." + r.contractName.content !== jm || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Vn(Ft(r.functionArgs[0])) !== Vn(Ft(la(e.core))) || Vn(Ft(r.functionArgs[1])) !== Vn(Ft(la(e.song))) || Vn(Ft(r.functionArgs[2])) !== Vn(Ft(s6(Nd(e.id)))) || e.amount !== "50" || t.postConditionMode !== Ti.Deny || t.postConditions.values.length !== 1 || o.conditionType !== 0 || o.amount !== 50n || o.conditionCode !== ma.Equal || o.principal.prefix !== 2 || fi(o.principal.address) !== e.address) throw Error("Saved play protection or master does not match.");
  } else if (e.kind === "like") {
    if (r.payloadType !== 2 || fi(r.contractAddress) + "." + r.contractName.content !== H6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Vn(Ft(r.functionArgs[0])) !== Vn(Ft(la(e.song))) || typeof e.liked != "boolean" || Vn(Ft(r.functionArgs[1])) !== Vn(Ft(r6(e.liked))) || e.amount !== "0" || t.postConditionMode !== Ti.Deny || t.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || ir(r.recipient).value !== e.recipient || r.amount !== BigInt(e.amount)) throw Error("Saved withdrawal does not match.");
}
const q6 = "xtrata.xyz/radio/listening-wallet", Y6 = "Link a temporary listening wallet for pay-per-play; no spending permission", Ar = (e) => typeof e == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(e) && yi(e), X6 = (e) => ({
  domain: Xr({ name: Mt(q6), version: Mt("1"), "chain-id": Zn(1) }),
  message: Xr({
    purpose: Mt(Y6),
    main: Mt(e.main),
    listening: Mt(e.listening),
    issued: Zn(e.issued)
  })
}), Km = 100000n, W6 = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function Z6(e, t) {
  const n = e.filter((s) => !s || typeof s.sender != "string" || s.sender === t || !Ar(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= Km).sort(W6);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const dc = 50;
function nl(e) {
  const t = e;
  if (!t || typeof t.total != "number" || !Number.isSafeInteger(t.total) || t.total < 0 || !Array.isArray(t.results)) return null;
  const n = [];
  for (const r of t.results) {
    if (typeof (r == null ? void 0 : r.sender) != "string" || typeof r.amount != "string" || typeof r.tx_id != "string") return null;
    const s = Number(r.block_height), o = Number(r.tx_index ?? 0);
    if (!Number.isSafeInteger(s) || !Number.isSafeInteger(o)) return null;
    n.push({ sender: r.sender, amount: r.amount, txId: r.tx_id, blockHeight: s, txIndex: o });
  }
  return { total: t.total, transfers: n };
}
async function Q6(e, t, n = 4) {
  if (!Ar(e)) return { ok: !1 };
  try {
    const r = (i) => `/extended/v1/address/${e}/stx_inbound?limit=${dc}&offset=${i}`, s = nl(await t(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let o = Math.max(0, s.total - dc);
    for (let i = 0; i < n; i++) {
      const a = o === 0 && s.total <= dc ? s : nl(await t(r(o)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = Z6(a.transfers, e);
      if (c.ok && c.funder) return o > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (o === 0) return c;
      o = Math.max(0, o - dc);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const Or = 50, J6 = 6, e5 = 20, D0 = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function F0(e, t) {
  const n = e;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], s = [];
  for (const o of n.results) {
    const i = o && typeof o == "object" && o.tx && typeof o.tx == "object" ? o.tx : o;
    if (!i || typeof i.tx_id != "string" || typeof i.tx_type != "string") return null;
    if (s.push(i.tx_id), i.tx_type !== "token_transfer" || i.sender_address !== t || i.tx_status !== "success") continue;
    const a = i.token_transfer;
    if (!a || typeof a.recipient_address != "string" || typeof a.amount != "string" || !/^\d+$/.test(a.amount)) return null;
    const c = Number(i.block_height), p = Number(i.tx_index ?? 0);
    if (!Number.isSafeInteger(c) || !Number.isSafeInteger(p)) return null;
    r.push({ recipient: a.recipient_address, amount: BigInt(a.amount), txId: i.tx_id, blockHeight: c, txIndex: p });
  }
  return { total: n.total, sent: r, rows: s };
}
async function t5(e, t, n) {
  if (!Ar(e)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = nl(await t(`/extended/v1/address/${e}/stx_inbound?limit=${Or}&offset=0`));
    if (!s || s.total > J6 * Or) return { ok: !1 };
    for (const i of s.transfers) r.set(i.txId + ":" + i.txIndex, i);
    for (let i = Or; i < s.total; i += Or) {
      const a = nl(await t(`/extended/v1/address/${e}/stx_inbound?limit=${Or}&offset=${i}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const o = /* @__PURE__ */ new Map();
    if (n) {
      const i = (p) => `/extended/v1/address/${e}/transactions?limit=${Or}&offset=${p}`, a = F0(await t(i(0)), e);
      if (!a || a.total > e5 * Or) return { ok: !1 };
      const c = new Set(a.rows);
      for (const p of a.sent) o.set(p.txId, p);
      for (let p = Or; p < a.total; p += Or) {
        const g = F0(await t(i(p)), e);
        if (!g || !g.rows.length) return { ok: !1 };
        for (const h of g.rows) c.add(h);
        for (const h of g.sent) o.set(h.txId, h);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...o.values()] };
  } catch {
    return { ok: !1 };
  }
}
function n5(e) {
  const { self: t, balance: n, gift: r } = e;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...e.inbound].filter((h) => h && typeof h.sender == "string" && h.sender !== t && /^\d+$/.test(h.amount) && BigInt(h.amount) > 0n).sort(D0).map((h, w) => {
    const y = BigInt(h.amount);
    return r && h.sender === r.sender ? { sender: h.sender, left: y, kind: "gift", to: r.payer, at: w } : Ar(h.sender) && y >= Km ? { sender: h.sender, left: y, kind: "deposit", to: h.sender, at: w } : { sender: h.sender, left: y, kind: "dust", to: null, at: w };
  }), o = s.reduce((h, w) => h + w.left, 0n), i = [...e.outgoing].filter((h) => h && h.recipient !== t && Ar(h.recipient) && h.amount > 0n).sort(D0), a = i.reduce((h, w) => h + w.amount, 0n), c = o - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const p = (h, w) => {
    let y = w;
    for (const S of h) {
      if (y <= 0n) break;
      const x = S.left < y ? S.left : y;
      S.left -= x, y -= x;
    }
    return y;
  };
  for (const h of i) {
    const w = p(s.filter((y) => y.to === h.recipient), h.amount);
    w > 0n && p(s, w);
  }
  if (p(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((h, w) => h + w.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const g = /* @__PURE__ */ new Map();
  for (const h of s) {
    if (h.left <= 0n) continue;
    const w = `${h.kind}:${h.to ?? ""}`, y = g.get(w);
    y ? (y.amount += h.left, y.newest = Math.max(y.newest, h.at)) : g.set(w, { to: h.to, kind: h.kind, amount: h.left, newest: h.at });
  }
  return {
    ok: !0,
    parts: [...g.values()].sort((h, w) => h.newest - w.newest),
    hasTopUp: s.some((h) => h.kind === "deposit")
  };
}
function r5(e, t) {
  const n = e.filter((p) => p.kind === "deposit").sort((p, g) => p.newest - g.newest), r = e.find((p) => p.kind === "gift"), s = e.filter((p) => p.kind === "dust"), o = ((r == null ? void 0 : r.amount) ?? 0n) + s.reduce((p, g) => p + g.amount, 0n), i = [], a = [], c = o > t;
  return n.forEach((p, g) => {
    if (p.amount <= t) {
      a.push(p);
      return;
    }
    const h = g === n.length - 1 && !c;
    i.push({ to: p.to, kind: "deposit", mode: h ? "all" : "amount", send: p.amount - t });
  }), c ? i.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: o - t }) : (r && a.push(r), a.push(...s)), { steps: i, tooSmall: a };
}
function j0(e) {
  const t = e.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (t == null ? void 0 : t.to) ?? null;
}
const fc = 1500n, Lc = [100, 250, 500], s5 = (e, t) => BigInt(e) * un(t), Qi = ["prepared", "signed", "unknown", "pending"], o5 = 30 * 6e4, rl = 6e4, si = (e) => {
  const t = e;
  return (t == null ? void 0 : t.feeRejected) === !0 || /\(400\)/.test((t == null ? void 0 : t.message) ?? "");
}, i5 = 3e3, sl = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", xu = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
function a5(e) {
  let t = null, n = -1 / 0, r, s = null, o = null, i, a = -1 / 0, c = null, p = null, g = !1, h = !1, w = !1, y = null, S = !1, x = "", L = "", O = 0, U, v = null, T, B = [], z, Q = -1 / 0;
  const W = /* @__PURE__ */ new Set();
  let K = null, m = !1, E = 0, P = null, N = null, V = !1, G = null, ve = !1, ue = null, Re = !1, C = !1, k = !1, H = !1, ne = !1, J = 0, re = null, Ce = Promise.resolve();
  const de = () => BigInt((t == null ? void 0 : t.limits.playFee) ?? fr.toString()), me = (l) => !!o && !(o.features ?? []).includes(l), he = (l, f) => `xtrata.ppp.v1.${l}:${f}`, Ke = "xtrata.ppp.v1.as-main", Lt = () => {
    if (e.main()) return;
    const l = e.store.get(Ke);
    return l && Ar(l) ? l : void 0;
  }, $e = () => e.main() ?? Lt(), ct = (l = o == null ? void 0 : o.address) => {
    if (!l) return [];
    try {
      const f = JSON.parse(e.store.get(he("entries", l)) || "[]");
      return Array.isArray(f) ? f : [];
    } catch {
      return [];
    }
  }, Te = (l) => {
    const f = [l, ...ct(l.address).filter((d) => !(d.txid === l.txid && d.kind === l.kind))].slice(0, 200);
    e.store.set(he("entries", l.address), JSON.stringify(f));
  }, fn = (l = o == null ? void 0 : o.address) => !!l && e.store.get(he("on", l)) !== "0", sn = (l) => {
    o != null && o.address && e.store.set(he("on", o.address), l ? "1" : "0");
  }, Ut = () => ct().filter((l) => Qi.includes(l.status)), Zt = () => mt() ? [...Ut(), ...ct(wt()).filter((l) => Qi.includes(l.status))] : Ut(), Ct = () => hn(o == null ? void 0 : o.address), hn = (l) => {
    if (!l) return null;
    try {
      return JSON.parse(e.store.get(he("deposit", l)) || "null");
    } catch {
      return null;
    }
  }, Gt = (l, f = o == null ? void 0 : o.address) => {
    f && e.store.set(he("deposit", f), JSON.stringify(l));
  };
  let rt = null;
  const Ge = (l = rl) => {
    const f = e.now();
    rt = { since: rt && f < rt.until ? rt.since : f, until: Math.max((rt == null ? void 0 : rt.until) ?? 0, f + l) };
  }, Qt = () => !!rt && e.now() < rt.until && (i === void 0 || i < jt + un(de())), Kt = () => !!Ct() || Qt(), wt = () => me("rootLike") ? o == null ? void 0 : o.address : (o == null ? void 0 : o.root) ?? (o == null ? void 0 : o.address), mt = () => !!(o != null && o.address) && wt() !== o.address, $n = () => mt() ? c && c.for === wt() ? c.value : void 0 : i, Qn = (l) => l !== void 0 && l < jt + wu, I = () => Ut().filter((l) => e.now() - l.created > o5 && W.has(l.txid)), q = () => (t == null ? void 0 : t.passkeyOnly) === !0 && (!$e() || r === $e() && !t.allowed), j = () => q() && !(o != null && o.linked), X = () => {
    const l = $e();
    return !j() && !!l && !!(o != null && o.linked) && o.linked !== l;
  }, Ae = (l) => he("return-to", l), Ie = (l = o == null ? void 0 : o.address) => {
    if (!l) return;
    const f = e.store.get(Ae(l));
    return f && Ar(f) && f !== l ? f : void 0;
  }, Qe = (l = o == null ? void 0 : o.address) => K && K.for === l ? K.res : null;
  function bt() {
    if (!(o != null && o.address)) return;
    if (o.linked) return { to: o.linked, kind: "linked" };
    const l = Ie();
    if (l) return { to: l, kind: "chosen" };
    const f = Qe();
    if (f != null && f.ok && f.funder) return { to: f.funder, kind: "funder" };
  }
  const Ye = (l) => he("gift", l);
  function st() {
    const l = o == null ? void 0 : o.address;
    if (!l) return null;
    if ((G == null ? void 0 : G.for) === l) return G.info;
    try {
      const f = JSON.parse(e.store.get(Ye(l)) || "null");
      return f && typeof f.returnTo == "string" && typeof f.treasury == "string" ? f : null;
    } catch {
      return null;
    }
  }
  const ze = () => (o == null ? void 0 : o.state) === "unlocked" ? o.root ?? o.address : ((o == null ? void 0 : o.slot) ?? 0) === 0 ? o == null ? void 0 : o.address : void 0;
  let $ = null, oe = null, ye = !1;
  const Je = (l) => he("award-claim", l), it = (l) => he("award-send", l), Et = (l) => {
    try {
      const f = JSON.parse(e.store.get(it(l)) || "null");
      return f && typeof f.txid == "string" && e.now() - f.at < 2 * 36e5 ? f : null;
    } catch {
      return null;
    }
  }, gt = (l) => {
    try {
      const f = JSON.parse(e.store.get(Je(l)) || "null");
      return f && typeof f.txid == "string" && e.now() - f.at < 2 * 36e5 ? f : null;
    } catch {
      return null;
    }
  };
  async function pn(l = !1) {
    const f = ze();
    if (!f || !e.awardStatus || ye) return;
    const d = ($ == null ? void 0 : $.for) === f ? $ : null, A = d == null ? void 0 : d.view.state, D = d ? A === "off" || A === "not-a-player" ? 30 * 6e4 : gt(f) || Et(f) ? 2e4 : A === "claimed" ? 10 * 6e4 : 6e4 : 0;
    if (!(d && !l && e.now() - d.at < D)) {
      ye = !0;
      try {
        const M = await e.awardStatus(f);
        if ($ = { for: f, view: M, at: e.now() }, M.state === "claimed" && e.store.set(Je(f), ""), M.state === "claimed" && M.holds === !1 && e.store.set(it(f), ""), M.state === "ready" && e.awardName && (oe == null ? void 0 : oe.for) !== f)
          try {
            oe = { for: f, name: await e.awardName(f), at: e.now() };
          } catch {
            oe = { for: f, name: void 0, at: e.now() };
          }
      } catch {
        $ = { for: f, view: d && d.view.state !== "off" && d.view.state !== "not-a-player" ? { ...d.view, state: "unavailable" } : { state: "unavailable" }, at: e.now() };
      } finally {
        ye = !1;
      }
    }
  }
  function qt() {
    const l = ze();
    if (!l || ($ == null ? void 0 : $.for) !== l) return null;
    const f = $.view;
    if (f.state === "off" || f.state === "not-a-player") return null;
    const d = f.state === "claimed" ? null : gt(l), A = f.state === "claimed" && f.holds !== !1 ? Et(l) : null;
    return { ...f, ...(oe == null ? void 0 : oe.for) === l ? { name: oe.name } : {}, ...d ? { claimTx: d.txid } : {}, ...A ? { sendTx: A.txid } : {} };
  }
  async function Zr() {
    var D;
    const l = o == null ? void 0 : o.address;
    if (!l || !e.giftInfo || !((D = t == null ? void 0 : t.gifts) != null && D.enabled) || ve) return;
    const f = (G == null ? void 0 : G.for) === l ? G : null, d = f ? f.ok ? f.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (f && e.now() - f.at < d) return;
    ve = !0;
    const A = st();
    try {
      const M = await e.giftInfo(l);
      G = { for: l, info: M, ok: !0, at: e.now() }, e.store.set(Ye(l), JSON.stringify(M));
    } catch {
      G = { for: l, info: A, ok: !1, at: e.now() };
    } finally {
      ve = !1;
    }
  }
  const Me = () => ct().reduce((l, f) => Qi.includes(f.status) ? l + BigInt(f.amount || "0") + BigInt(f.fee || "0") : l, 0n);
  function Rs() {
    if (i === void 0) return 0;
    const l = i - Me() - BigInt(lt.length) * un(de());
    return l > 0n ? H0(l, de()) : 0;
  }
  const zs = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", Qr = "EMPTY — ADD STX TO PLAY";
  function jo() {
    if (!(t != null && t.here)) return null;
    const l = (f, d) => ({ reason: f, text: d });
    switch (Ht()) {
      case "connect":
      case "wrong-wallet":
        return l("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "intro":
        return l("setup", "SET UP YOUR PLAYER TO LISTEN");
      case "loading":
        return l("checking", "CHECKING YOUR LISTENING WALLET");
      case "unsupported":
        return l("unavailable", "OPEN IN A BROWSER THAT SUPPORTS PASSKEYS");
      case "not-invited":
      case "off":
        return l("unavailable", "PAID RADIO IS UNAVAILABLE");
      case "locked":
        return l("locked", "UNLOCK TO LISTEN");
      case "link":
        return l("link", "FINISH SETUP TO LISTEN");
      case "over":
        return l("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return Kt() ? l("arriving", "YOUR PLAYS ARE ARRIVING") : l("out", mt() ? zs : Qr);
      case "ready":
        return !fn() || !(o != null && o.session) || o.session.playsLeft < 1 || o.session.expires <= e.now() ? l("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : k ? Rs() < 1 ? l("out", mt() ? zs : Qr) : null : l("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const Jr = () => {
    var l;
    return !!(o != null && o.address) && mt() && !!((l = st()) != null && l.player);
  };
  function gn() {
    return Jr() ? { locked: !0, known: !0 } : null;
  }
  const Mr = 3 * 6e4, Ro = () => !!st() && !!e.history && !(o != null && o.linked);
  async function Ri() {
    const l = o.address, f = st(), { balance: d, nonce: A } = await e.chain.account(l), D = await e.history(l, !0);
    if (!D.ok) return null;
    const M = n5({ self: l, balance: d, inbound: D.inbound, outgoing: D.outgoing, gift: { sender: f.treasury, payer: f.returnTo } });
    if (!M.ok) return null;
    const R = r5(M.parts, Zi);
    return { balance: d, nonce: A, parts: M.parts, steps: R.steps, tooSmall: R.tooSmall.length };
  }
  const zi = () => Re ? { state: "unavailable" } : !ue || e.now() - ue.at > Mr || i !== void 0 && i !== ue.balance ? { state: "none" } : ue.plan;
  function Ht() {
    if (!(t != null && t.enabled)) return "off";
    if (!t.here) return "elsewhere";
    const l = $e();
    if (!j()) {
      if (!l) return "connect";
      if (!t.allowed) return "not-invited";
    }
    return o ? o.state === "unsupported" ? "unsupported" : o.state === "none" ? "intro" : X() ? "wrong-wallet" : o.state === "known" ? "locked" : !j() && o.linked !== l ? "link" : i === void 0 ? "loading" : i > zr && !o.backedUp ? "over" : i < jt + un(de()) ? "fund" : "ready" : "loading";
  }
  const Yt = () => {
    var l, f, d, A, D;
    return {
      step: Ht(),
      busy: p,
      message: x,
      error: L,
      notice: Gs(),
      gate: t,
      main: $e(),
      mainConnected: !!e.main(),
      standIn: Lt(),
      listening: o == null ? void 0 : o.address,
      linked: o == null ? void 0 : o.linked,
      award: qt(),
      unproven: !!(o != null && o.unproven),
      phrase: !!(o != null && o.phrase),
      backedUp: !!(o != null && o.backedUp),
      balance: i,
      balanceState: i === void 0 ? void 0 : ((M) => M === "over" && (o != null && o.backedUp) ? "ok" : M)(M6(i, de())),
      // backed up: over 1 STX reads as a healthy balance
      aboveTarget: i !== void 0 && i > zr && !!(o != null && o.backedUp),
      playsLeft: i === void 0 ? 0 : H0(i, de()),
      allowance: i === void 0 ? zr : mu(i, BigInt(((l = Ct()) == null ? void 0 : l.amount) ?? "0")),
      session: (o == null ? void 0 : o.session) ?? null,
      payingOn: fn(),
      entries: ct(),
      depositTxid: ((f = Ct()) == null ? void 0 : f.txid) ?? U,
      depositPending: Kt(),
      arrival: Kt() ? { since: ((d = Ct()) == null ? void 0 : d.at) ?? (rt == null ? void 0 : rt.since) ?? e.now(), graceMs: rl } : null,
      walletOutdated: me("like"),
      linkedListening: z && z === $e() ? B.map((M) => M.listening) : [],
      serverLinked: !!v && T === `${$e()}:${o == null ? void 0 : o.address}`,
      stuck: I().length,
      armed: H,
      queued: lt.length,
      solo: j(),
      returnTo: (A = bt()) == null ? void 0 : A.to,
      returnToKind: (D = bt()) == null ? void 0 : D.kind,
      funderState: (() => {
        const M = Qe();
        return M ? M.ok ? M.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const M = Qe();
        return !!M && M.ok && M.distinct > 1;
      })(),
      walletCannotSolo: j() && me("standalone"),
      walletCannotMulti: me("multi"),
      others: ((o == null ? void 0 : o.others) ?? []).filter((M) => M !== $e() && M !== (o == null ? void 0 : o.linked)),
      creditedTo: j() && (o != null && o.address) && (P == null ? void 0 : P.for) === o.address && P.main ? P.main : void 0,
      createdHere: !!(o != null && o.address) && e.store.get(he("created", o.address)) === "1",
      brandNew: !!(o != null && o.address) && i === 0n && (N == null ? void 0 : N.for) === o.address && N.unused,
      gift: (() => {
        const M = st();
        return M ? { player: M.player, from: M.from, source: M.source, amount: M.amount, ...M.drop !== void 0 ? { drop: M.drop } : {} } : null;
      })(),
      giftPlays: st() ? Rs() : 0,
      playCost: un(de()),
      giftStop: jo(),
      albumLock: gn(),
      returnPlan: zi(),
      slot: (o == null ? void 0 : o.state) === "unlocked" ? o.slot ?? 0 : 0,
      root: (o == null ? void 0 : o.state) === "unlocked" ? o.root ?? o.address : void 0,
      walletCannotAlbums: me("slots"),
      likeFunds: (() => {
        var Z;
        const M = wt();
        if (!M || (o == null ? void 0 : o.state) !== "unlocked") return null;
        const R = $n();
        return { address: M, balance: R, low: Qn(R), album: mt(), pending: !!hn(M), txid: (Z = hn(M)) == null ? void 0 : Z.txid, main: $e() };
      })()
    };
  }, Gs = () => O ? O < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", Oe = (l, f = "") => {
    x = l, L = f, e.changed();
  };
  async function Ot(l, f) {
    if (!p) {
      p = l, L = "", e.changed();
      try {
        await f();
      } catch (d) {
        const A = d instanceof Error ? d.message : String(d);
        L = /Cancelled in the listening wallet/.test(A) ? "" : A, L || (x = "Not now. Nothing was signed.", ne = !0);
      } finally {
        p = null, await Ln(!0);
      }
    }
  }
  const es = () => !!(t != null && t.enabled) && t.here && (j() || !!$e() && t.allowed), Ks = () => es() && !X(), yn = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Fn = () => {
    if (X()) throw new Error(yn());
  };
  async function In() {
    if (!es()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(t != null && t.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await e.bridge(t.walletOrigin)), s;
  }
  const xt = (l) => {
    const f = $e();
    return l.request("listening.status", f ? { main: f } : void 0);
  };
  async function Nr(l = !1) {
    o != null && o.address && (!l && e.now() - a < 3e4 || (i = await e.chain.balance(o.address), a = e.now(), await Vs(l)));
  }
  async function Vs(l = !1) {
    const f = wt();
    if (!(!mt() || !f || (o == null ? void 0 : o.state) !== "unlocked") && !(!l && (c == null ? void 0 : c.for) === f && e.now() - c.at < 3e4))
      try {
        c = { for: f, value: await e.chain.balance(f), at: e.now() };
      } catch {
      }
  }
  async function Gi(l) {
    if ((z !== l || e.now() - Q >= 6e4) && (B = await e.links(l), z = l, Q = e.now()), (o == null ? void 0 : o.state) !== "unlocked" || o.linked === l) return;
    const f = `${l}:${o.address}`;
    T === f && v || (v = B.find((d) => d.listening === o.address) ?? null, T = f);
  }
  async function zo() {
    const l = o == null ? void 0 : o.address;
    if (!j() || !l || o != null && o.linked || !e.funder || m || !i || i <= 0n) return;
    const f = Qe(l);
    if (f != null && f.ok && f.funder) return;
    const d = f != null && f.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, E - 1), 30 * 6e4);
    if (!(K && K.for === l && e.now() - K.at < d)) {
      m = !0;
      try {
        K = { for: l, res: await e.funder(l), at: e.now() };
      } catch {
        K = { for: l, res: { ok: !1 }, at: e.now() };
      } finally {
        m = !1;
      }
      E = K.res.ok ? 0 : E + 1;
    }
  }
  async function hr() {
    const l = o == null ? void 0 : o.address;
    if (!(!j() || !l || o != null && o.linked || !e.mainOf || V) && !(P && P.for === l && (P.ok || e.now() - P.at < 6e4))) {
      V = !0;
      try {
        P = { for: l, main: await e.mainOf(l), ok: !0, at: e.now() };
      } catch {
        P = { for: l, main: null, ok: !1, at: e.now() };
      } finally {
        V = !1;
      }
    }
  }
  async function qs() {
    const l = o == null ? void 0 : o.address;
    if (!(!l || (o == null ? void 0 : o.state) !== "unlocked" || i !== 0n || (N == null ? void 0 : N.for) === l) && e.store.get(he("created", l)) !== "1")
      try {
        N = { for: l, unused: await e.chain.confirmedNonce(l) === 0n };
      } catch {
      }
  }
  async function Ys() {
    var D;
    const l = o == null ? void 0 : o.address;
    if (!l) return !1;
    let f, d = !1;
    const A = /* @__PURE__ */ new Map();
    for (const M of Zt())
      try {
        const R = await e.chain.transaction(M.txid);
        if (!R) {
          if (W.add(M.txid), e.now() - M.created > 15 * 6e4 && !A.has(M.address) && A.set(M.address, await e.chain.confirmedNonce(M.address)), f = A.get(M.address), f !== void 0 && f > BigInt(M.nonce)) {
            Te({ ...M, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((M.status === "unknown" || M.status === "signed") && M.raw)
            try {
              await e.chain.broadcast(M.raw, M.txid), Te({ ...M, status: "pending" });
            } catch (se) {
              si(se) && Te({ ...M, status: "failed", note: se.message, raw: void 0 });
            }
          continue;
        }
        W.delete(M.txid);
        const Z = String(R.tx_status);
        if (Z === "success" && R.canonical !== !1 && R.is_unanchored === !1) {
          if (Te({ ...M, status: "confirmed", confirmedAt: e.now(), actualFee: String(R.fee_rate ?? M.fee), raw: void 0 }), d = !0, M.kind === "like" && (S = !0, M.status !== "confirmed" && typeof M.liked == "boolean"))
            try {
              (D = e.likeConfirmed) == null || D.call(e, M.song, M.liked);
            } catch {
            }
        } else Z.startsWith("abort_") || Z.startsWith("dropped_") ? Te({ ...M, status: "failed", note: Z, raw: void 0 }) : M.status !== "pending" && Te({ ...M, status: "pending" });
      } catch {
      }
    for (const M of mt() ? [l, wt()] : [l]) {
      const R = hn(M);
      if (R)
        try {
          const Z = await e.chain.transaction(R.txid), se = String((Z == null ? void 0 : Z.tx_status) ?? "");
          (se === "success" && Z.is_unanchored === !1 || se.startsWith("abort_") || se.startsWith("dropped_") || !Z && e.now() - R.at > 2 * 36e5) && (Gt(null, M), se === "success" && Ge(2e4), a = -1 / 0, c = null, /on its way/i.test(x) && (x = ""));
        } catch {
        }
    }
    return d;
  }
  async function Ln(l = !1) {
    var f;
    try {
      const d = $e();
      if ((l || !t || r !== d || e.now() - n > 3e5) && (t = await e.config(d), n = e.now(), r = d), !t.enabled || !t.here || !j() && (!d || !t.allowed)) {
        s && (o != null && o.session) && await s.request("listening.stop").catch(() => {
        }), H && ts(), e.changed();
        return;
      }
      await In(), o = await xt(s), X() && o.state === "unlocked" && (Ur(), await s.request("listening.lock").catch(() => {
      }), i = void 0, o = await xt(s)), d && t.allowed && await Gi(d), await Nr(l), await zo(), await hr(), await qs(), await Zr(), await pn(), await Ys() && await Nr(!0), await Vs(), await Xo(), O = 0;
    } catch {
      O++;
    }
    if (Ht() === "locked" ? Vo() : H && ts(), S) {
      S = !1;
      try {
        (f = e.likesChanged) == null || f.call(e);
      } catch {
      }
    }
    e.changed(), lt.length && !Rn && ss();
  }
  async function Go(l) {
    const f = o == null ? void 0 : o.root;
    if (!f || o != null && o.slot || !(o != null && o.address) || me("slots")) return;
    const d = Number(e.store.get(he("slot", f)));
    if (!(!Number.isSafeInteger(d) || d < 1))
      try {
        const { balance: A } = await e.chain.account(o.address);
        if (A >= jt + un(de())) return;
        await l.request("listening.openSlot", { slot: d }), o = await xt(l), i = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function Ko(l, f) {
    var M;
    Fn();
    const d = !(o != null && o.address) || fn(o.address), A = o != null && o.linked ? (M = e.nameOf) == null ? void 0 : M.call(e, o.linked) : void 0;
    await l.request("listening.unlock", { mode: "unlock", terms: d ? Xs() : void 0, anyPasskey: f, ...$e() ? { main: $e() } : {}, ...A ? { label: A } : {} }), o = await xt(l), d && (fn(o.address) ? await Cn() : await l.request("listening.stop")), await Go(l), Oe(d ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const D = y;
    y = null, D && e.now() - D.at < 12e4 && setTimeout(() => void Ln(!0).then(() => vn(D)), 0);
  }
  function Vo() {
    H || p || ne || J >= 3 || !s || !(o != null && o.address) || (H = !0, Ce = (async () => {
      try {
        await Ko(s, !1), J = 0;
      } catch (l) {
        const f = l instanceof Error ? l.message : String(l);
        /Cancelled in the listening wallet/.test(f) ? re || (ne = !0, Oe("Not now. Nothing was signed.")) : /did not answer/.test(f) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (J++, L = f);
      } finally {
        H = !1;
        const l = re;
        re = null, l ? await l() : await Ln(!0);
      }
    })());
  }
  async function ts(l) {
    H && (re = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await Ce), l && await l(), e.changed();
  }
  const Xs = () => ({
    fee: de().toString(),
    maxPlays: t.limits.maxSessionPlays,
    budget: zr.toString(),
    expires: e.now() + t.limits.sessionHours * 36e5
  });
  async function Cn() {
    if (!(o != null && o.address)) return !1;
    if (k || (k = await e.tabLock(o.address)), !k)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function ns(l, f) {
    const d = o.address, { balance: A, nonce: D } = f ?? await e.chain.account(d);
    i = A;
    const M = await s.request("listening.prepareReturn", {
      mode: l.mode,
      balance: A.toString(),
      nonce: D.toString(),
      fee: Zi.toString(),
      ...l.amount !== void 0 ? { amount: l.amount.toString() } : {},
      ...l.linked ? {} : { destination: l.to }
    });
    if (M.recipient !== l.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const R = l.mode === "amount" ? l.amount : l.mode === "all" ? A - Zi : A - zr - Zi, Z = pi(M.raw);
    if (ir(Z.payload.recipient).value !== l.to || String(Z.payload.amount) !== M.amount || R !== void 0 && M.amount !== R.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const se = {
      id: xu(),
      address: d,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: M.recipient,
      amount: M.amount,
      fee: M.fee,
      nonce: D.toString(),
      created: e.now(),
      status: "signed",
      raw: M.raw,
      txid: M.txid
    };
    e.validate(se), Te(se);
    try {
      await e.chain.broadcast(M.raw, M.txid), Te({ ...se, status: "pending" });
    } catch (ce) {
      throw Te({ ...se, status: "unknown", note: ce.message }), ce;
    }
    return M;
  }
  const Ws = Hl, _r = Zi;
  async function qo(l, f, d) {
    if ((o == null ? void 0 : o.state) !== "unlocked" || !o.address) throw new Error("Unlock the listening wallet first.");
    if (me("slots") || me("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const A = o.slot ?? 0;
    if (l === f || ![l, f].includes(A) || ![l, f].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const D = o.root ?? o.address, M = l === 0 ? D : o.address, R = f === 0 ? D : o.address, { balance: Z, nonce: se } = await e.chain.account(M);
    if (Z < d + _r + jt) throw new Error(l === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const ce = await s.request("listening.signMove", { from: l, to: f, amount: d.toString(), fee: _r.toString(), nonce: se.toString(), balance: Z.toString() }), pe = pi(ce.raw);
    if (ce.from !== M || ce.to !== R || ce.amount !== d.toString() || ir(pe.payload.recipient).value !== R || String(pe.payload.amount) !== d.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const we = {
      id: xu(),
      address: M,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: R,
      amount: ce.amount,
      fee: ce.fee,
      nonce: se.toString(),
      created: e.now(),
      status: "signed",
      raw: ce.raw,
      txid: ce.txid
    };
    e.validate(we), Te(we);
    try {
      await e.chain.broadcast(ce.raw, ce.txid), Te({ ...we, status: "pending" });
    } catch (ge) {
      throw Te({ ...we, status: "unknown", note: ge.message }), ge;
    }
    return Gt({ txid: ce.txid, amount: ce.amount, at: e.now() }, R), R === D && D !== o.address ? c = null : a = -1 / 0, ce;
  }
  let Xe = !1;
  const Yo = /* @__PURE__ */ new Map(), Zs = (l) => he("float", l);
  async function Xo() {
    if (Xe || (o == null ? void 0 : o.state) !== "unlocked" || !mt() || me("move") || me("rootLike") || !o.address) return;
    const l = o.address;
    if (e.store.get(Zs(l)) === "1") return;
    const f = st();
    if (!(f != null && f.player) || f.state !== "arrived") return;
    const d = $n();
    if (d === void 0 || i === void 0) return;
    if (!Qn(d)) {
      e.store.set(Zs(l), "1");
      return;
    }
    if (hn(wt()) || rs() || Zt().length || i < Ws * 4n + jt + _r) return;
    const A = Yo.get(l);
    if (!(A && (A.n >= 3 || e.now() - A.at < 5 * 6e4))) {
      Xe = !0, Yo.set(l, { n: ((A == null ? void 0 : A.n) ?? 0) + 1, at: e.now() });
      try {
        await qo(o.slot ?? 0, 0, Ws), e.store.set(Zs(l), "1");
      } catch (D) {
        console.warn("[radio] likes float not sent yet", D);
      } finally {
        Xe = !1;
      }
    }
  }
  async function Ki(l) {
    if (Ut().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (me("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const f = await Ri().catch(() => null);
    if (!f)
      throw ue = null, Re = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Re = !1, i = f.balance;
    const d = { balance: f.balance, nonce: f.nonce };
    if (l === "excess") {
      const Z = j0(f.parts) ?? Ie();
      if (!Z) throw new Error("Choose where to send the excess first.");
      await ns({ mode: "excess", to: Z, linked: !1 }, d), ue = null, Oe("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const A = f.steps;
    if (!A.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!ue && ue.balance === f.balance && e.now() - ue.at <= Mr && ue.steps.length === A.length && ue.steps.every((Z, se) => Z.to === A[se].to && Z.mode === A[se].mode && Z.send === A[se].send))) {
      ue = {
        at: e.now(),
        balance: f.balance,
        steps: A,
        parts: f.parts,
        plan: { state: "ready", steps: A.map((Z) => ({ to: Z.to, kind: Z.kind, send: Z.send.toString() })), kept: f.tooSmall, excess: j0(f.parts) }
      }, Oe(A.length > 1 ? `This goes back in ${A.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const M = A[0], R = M.to ?? Ie();
    if (!R) throw new Error("Choose where to send the rest first.");
    if (M.mode === "amount" && me("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await ns({ mode: M.mode, to: R, linked: !1, ...M.mode === "amount" ? { amount: M.send } : {} }, d), ue = null, A.length === 1 ? (sn(!1), Oe("Returned ✓ Paying is off.")) : Oe(`Returned ✓ ${A.length - 1} more ${A.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function Qs() {
    if (!(o != null && o.unproven)) return;
    const l = await In();
    await l.request("listening.prove"), o = await xt(l);
  }
  const Pr = {
    forceRefresh: () => Ln(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (l) => {
      if (!e.main() && !(l !== null && !Ar(l))) {
        if (l === Lt()) return Ln(!0);
        e.store.set(Ke, l ?? ""), L = "", x = "", i = void 0, a = -1 / 0, c = null, await Ln(!0);
      }
    },
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (l) => Ot("Waiting for your passkey…", async () => {
      const f = await In();
      await f.request("listening.unlock", { mode: "create", terms: Xs(), ...e.main() ? { main: e.main() } : {}, ...l != null && l.quick && !e.main() ? { quick: !0 } : {} }), o = await xt(f), o.address && e.store.set(he("created", o.address), "1"), sn(!0), Oe(j() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Cn();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (l) => {
      l ? Ge() : rt = null, e.changed();
    },
    giftSent: (l, f) => {
      !(o != null && o.address) || Ct() || (Gt({ txid: l, amount: f.toString(), at: e.now() }), a = -1 / 0, G = null, Oe("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (l) => {
      if (Fn(), (o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (me("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await In()).request("listening.bindSlot", { slot: l, issued: e.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (l, f, d, A) => {
      Gt({ txid: d, amount: A.toString(), at: e.now() }, f), G = null, await Pr.openAlbum(l), Oe("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (l) => Ot("Opening…", async () => {
      if (Fn(), (o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (me("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (g || h || w) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((o.slot ?? 0) === l) return;
      Ur(), await s.request("listening.openSlot", { slot: l }), o = await xt(s), i = void 0, a = -1 / 0, ue = null, Re = !1;
      const f = o.root;
      f && l > 0 && e.store.set(he("slot", f), String(l)), Oe(l === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (l = !1) => {
      const f = () => Ot("Waiting for your passkey…", async () => Ko(await In(), l));
      return H ? l ? me("cancel") ? (Oe("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : ts(async () => {
        (Ht() === "locked" || Ht() === "intro") && await f();
      }) : Ce : f();
    },
    link: () => Ot("Sign in your wallet…", async () => {
      Fn();
      const l = e.main();
      if (!l || !(o != null && o.address)) throw new Error("Connect your main wallet first.");
      const f = (await e.links(l)).find((d) => d.listening === o.address);
      if (f)
        await s.request("listening.link", { main: l, issued: f.issued, mainSignature: f.mainSignature });
      else {
        const d = { main: l, listening: o.address, issued: e.now() }, A = await e.signWithMain(l, X6(d)), D = await s.request("listening.link", { main: l, issued: d.issued, mainSignature: A });
        await e.saveLink({ ...d, mainSignature: A, listeningSignature: D.listeningSignature }), Q = -1 / 0;
      }
      Oe("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => o != null && o.unproven ? (await Ot("One more passkey check…", Qs), !(o != null && o.unproven)) : !0,
    deposit: () => Ot("Approve the deposit in your wallet…", async () => {
      Fn(), await Qs();
      const l = e.main();
      if (!l || !(o != null && o.address)) throw new Error("Connect your main wallet first.");
      if (Ct()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (Qt()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await Nr(!0);
      const f = mu(i ?? 0n);
      if (f <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      U = await e.deposit(l, o.address, f), U && Gt({ txid: U, amount: f.toString(), at: e.now() }), Oe("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Ot("Approve the top-up in your wallet…", async () => {
      Fn(), await Qs();
      const l = e.main(), f = wt();
      if (!l || !f) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (hn(f)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const d = await e.chain.balance(f);
      mt() ? c = { for: f, value: d, at: e.now() } : (i = d, a = e.now());
      const A = mu(d);
      if (A <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const D = await e.deposit(l, f, A);
      D && Gt({ txid: D, amount: A.toString(), at: e.now() }, f), Oe("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (l) => Ot("Adding plays…", async () => {
      if (Fn(), !mt()) throw new Error("Open the album you want to add plays to first.");
      if (!Lc.includes(l)) throw new Error("Choose one of the amounts offered.");
      const f = s5(l, de());
      if (g || h || w) throw new Error("Still sending a payment. Try again in a moment.");
      if (Zt().length || Ct()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await qo(0, o.slot ?? 0, f), Oe("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Ot("Confirm in the listening wallet…", async () => {
      if (!Ks()) throw new Error("Connect your wallet first.");
      await Cn(), await s.request("listening.approveSession", Xs()), sn(!0), Oe("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Ot("Clearing…", async () => {
      for (const l of I())
        await e.chain.transaction(l.txid) || Te({ ...l, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Oe("Cleared ✓");
    }),
    switchOff: () => Ot("Switching off…", async () => {
      Ur(), await (s == null ? void 0 : s.request("listening.stop")), sn(!1), Oe("Music support is off. Playback is paused.");
    }),
    /**
     * Write down the backup words. The wallet box shows them and asks three back; this page never sees a word, only
     * that it was done. For a player that has a phrase, while it is open.
     */
    backup: () => Ot("Showing your backup words in the box…", async () => {
      if (!(o != null && o.phrase)) throw new Error("This player was made before backup words existed, so it has none.");
      const l = await In();
      await l.request("listening.backup"), o = await xt(l), Oe("Backed up ✓ Keep those 24 words somewhere safe and private.");
    }),
    /**
     * The open player signs a request about the albums it keeps (releases.ts). No panel: it is a structured message
     * that can move nothing. Rejects when the player is locked or the wallet box is too old.
     */
    signShelf: async (l, f) => {
      if ((o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock your player first.");
      if (me("shelf")) throw new Error("The listening wallet box needs an update before it can keep albums. Try again shortly.");
      return (await In()).request("listening.signShelf", { action: l, ...f ? { release: f } : {} });
    },
    /** Ask again where the player's record stands, and what name it would carry (after linking a wallet, say). */
    awardRefresh: async () => {
      oe = null, await pn(!0), e.changed();
    },
    /**
     * Claim the player's Music Hero record. The server signs the record (with the name, or the address alone); the
     * wallet box reads it, shows it and signs the claim; this page sends it. The player pays the network fee only.
     */
    claimAward: (l) => Ot("Confirm in the listening wallet…", async () => {
      var se, ce, pe, we;
      const f = ze();
      if ((o == null ? void 0 : o.state) !== "unlocked" || !f) throw new Error("Unlock your player first.");
      if (!e.awardNote) throw new Error("Awards are not available here.");
      if (me("award")) throw new Error("The listening wallet box needs an update before it can claim a record. Try again shortly.");
      if (gt(f)) throw new Error("Your claim is already on its way. It usually confirms in a minute or two.");
      if (g || h || w || Zt().length) throw new Error("A payment is still confirming. Claim as soon as it has.");
      await Cn();
      const d = await e.awardNote(f, l), { balance: A, nonce: D } = await e.chain.account(f);
      if (A < fc) throw new Error("Your player needs a little STX for the network fee to claim. Add plays first.");
      const R = await (await In()).request("listening.signAward", {
        cls: d.cls,
        number: d.number,
        plays: d.plays,
        record: d.record,
        signature: d.signature,
        fee: fc.toString(),
        nonce: D.toString(),
        balance: A.toString()
      }), Z = pi(R.raw);
      if (R.hero !== f || R.number !== d.number || ((ce = (se = Z.payload) == null ? void 0 : se.functionName) == null ? void 0 : ce.content) !== "claim" || ((we = (pe = Z.payload) == null ? void 0 : pe.contractName) == null ? void 0 : we.content) !== O6.split(".")[1])
        throw new Error("The signed claim does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(R.raw, R.txid), e.store.set(Je(f), JSON.stringify({ txid: R.txid, at: e.now() })), a = -1 / 0, $ && ($ = { ...$, at: -1 / 0 }), Oe("Record claimed ✓ It is being made now: about a minute.");
    }),
    /**
     * Send the player's claimed record to another address. The wallet box shows the inscription and the full address
     * and the listener confirms there; the transaction can move that one inscription and nothing else.
     */
    sendAward: (l) => Ot("Confirm in the listening wallet…", async () => {
      var ce, pe, we;
      const f = ze(), d = qt();
      if ((o == null ? void 0 : o.state) !== "unlocked" || !f) throw new Error("Unlock your player first.");
      if ((d == null ? void 0 : d.state) !== "claimed" || d.inscription === void 0) throw new Error("There is no record to send yet.");
      if (d.holds === !1) throw new Error("This record has already been sent.");
      if (d.holds !== !0) throw new Error("Could not check that your player still holds the record. Try again shortly.");
      if (Et(f)) throw new Error("Your record is already on its way.");
      const A = l.trim();
      if (!Ar(A)) throw new Error("Enter a Stacks address starting SP. A .btc name will not work here.");
      if (A === f) throw new Error("That is your player itself. Enter the address to send it to.");
      if (me("sendRecord")) throw new Error("The listening wallet box needs an update before it can send a record. Try again shortly.");
      if (g || h || w || Zt().length) throw new Error("A payment is still confirming. Send as soon as it has.");
      await Cn();
      const { balance: D, nonce: M } = await e.chain.account(f);
      if (D < fc) throw new Error("Your player needs a little STX for the network fee. Add plays first.");
      const Z = await (await In()).request("listening.signSendRecord", { inscription: d.inscription, recipient: A, fee: fc.toString(), nonce: M.toString(), balance: D.toString() }), se = pi(Z.raw);
      if (Z.from !== f || Z.recipient !== A || Z.inscription !== d.inscription || ((pe = (ce = se.payload) == null ? void 0 : ce.functionName) == null ? void 0 : pe.content) !== "transfer" || ir((we = se.payload.functionArgs) == null ? void 0 : we[2]).value !== A)
        throw new Error("The signed send does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(Z.raw, Z.txid), e.store.set(it(f), JSON.stringify({ txid: Z.txid, at: e.now() })), a = -1 / 0, $ && ($ = { ...$, at: -1 / 0 }), Oe("Record sent ✓ It arrives in a minute or two.");
    }),
    lock: () => Ot("Locking…", async () => {
      Ur(), await (s == null ? void 0 : s.request("listening.lock")), i = void 0, Oe("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (l) => {
      const f = String(l ?? "").trim();
      if (!(o != null && o.address)) return Oe("", "Unlock the listening wallet first.");
      if (!Ar(f)) return Oe("", "Enter a standard mainnet address (it starts with SP).");
      if (f === o.address) return Oe("", "That is this listening wallet itself. Enter a different address.");
      e.store.set(Ae(o.address), f), Oe("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      o != null && o.address && e.store.set(Ae(o.address), ""), e.changed();
    },
    returnFunds: (l) => Ot("Check the return in the listening wallet…", async () => {
      if (!Ks()) throw new Error("Connect your wallet first.");
      if (!(o != null && o.address)) throw new Error("Unlock the listening wallet first.");
      if (Ro()) return Ki(l);
      const f = bt();
      if (!f) throw new Error(j() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (f.kind !== "linked" && me("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Ut().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await ns({ mode: l, to: f.to, linked: f.kind === "linked" }), l === "all" && sn(!1), Oe(l === "all" ? f.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, lt = [], Tn = 10, jn = 30 * 6e4;
  let Rn = !1;
  const rs = () => g || !!p || h || w, Ur = () => {
    lt.length && (lt.length = 0, e.changed());
  };
  async function Wo(l) {
    if (!lt.some((f) => f.id === l.id) && !ct().some((f) => f.id === l.id) && (lt.push({ ...l, at: e.now() }), lt.length > Tn && lt.shift()), rs() || Ut().length) {
      const f = lt.length;
      x = `Queued ${f === 1 ? "this song" : f + " songs"}: paid as soon as the wallet is free.`, e.changed();
    }
    await ss();
  }
  async function ss() {
    if (!Rn) {
      Rn = !0;
      try {
        for (; lt.length; ) {
          for (; lt.length && e.now() - lt[0].at > jn; ) lt.shift();
          if (!lt.length || rs() || await Zo(lt[0]) === "wait") return;
          lt.shift();
        }
      } finally {
        Rn = !1, e.changed();
      }
    }
  }
  async function Zo(l) {
    var f;
    g = !0;
    try {
      await Ln();
      const d = Ht();
      if (d === "loading") return "wait";
      if (d !== "ready" || !fn() || !(o != null && o.session) || o.session.playsLeft < 1 || !k) return "done";
      if (Ut().length) return "wait";
      C || (await e.chain.verify(), C = !0);
      const A = o.address, { balance: D, nonce: M } = await e.chain.account(A);
      i = D, a = e.now();
      const R = await e.chain.owner(bu, l.song);
      if (R === A || R === $e()) return "done";
      const Z = await s.request("listening.signPlay", {
        core: bu,
        song: l.song,
        receipt: l.id,
        fee: de().toString(),
        nonce: M.toString(),
        balance: D.toString()
      }), se = {
        id: l.id,
        address: A,
        kind: "play",
        core: bu,
        song: l.song,
        recipient: R,
        amount: "50",
        fee: de().toString(),
        nonce: M.toString(),
        created: e.now(),
        status: "signed",
        raw: Z.raw,
        txid: Z.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...l.title ? { title: String(l.title).slice(0, 120) } : {},
        ...l.artist ? { artist: String(l.artist).slice(0, 120) } : {}
      };
      e.validate(se), Te(se);
      const ce = l.title ? `“${l.title}”${l.artist ? ` by ${l.artist}` : ""}` : `song #${l.song}`;
      try {
        await e.chain.broadcast(Z.raw, Z.txid), Te({ ...se, status: "pending" }), x = `♪ Paid ${ce}`, L = "";
      } catch (pe) {
        Te({ ...se, status: si(pe) ? "failed" : "unknown", note: pe.message, ...si(pe) ? { raw: void 0 } : {} }), L = pe.message;
      }
      return o = await xt(s), "done";
    } catch (d) {
      const A = d instanceof Error ? d.message : "payment unavailable";
      return (f = st()) != null && f.player ? (x = "Payment is taking a moment: " + A, "wait") : (x = "This song played free: " + A, "done");
    } finally {
      g = !1, e.changed();
    }
  }
  function Js(l) {
    return !(t != null && t.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Ht()) || me("like") ? !1 : (vn(l), !0);
  }
  async function vn(l) {
    const f = l.title ? `“${l.title}”` : `song #${l.song}`, d = (b) => {
      var _;
      L = b, x = "";
      try {
        (_ = e.likeFailed) == null || _.call(e, l.song);
      } catch {
      }
      e.changed();
    }, A = mt(), D = Ht(), M = $e(), R = A && (D === "fund" || D === "over") ? "ready" : D, Z = j() ? wt() : M;
    if (R === "locked") {
      y = { ...l, at: e.now() }, Oe(`Unlock to like ${f}. It sends straight after.`);
      return;
    }
    if (R === "wrong-wallet") return d(yn());
    if (R === "link") return d("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (j() && me("standalone")) return d("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (R === "fund") return d("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (R === "over") return d("Return the excess first: the listening wallet holds more than 1 STX.");
    if (A) {
      await Vs(!0);
      const b = $n();
      if (Qn(b))
        return e.changed(), d(sl);
    }
    if (R !== "ready" || !Z) return d("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(o != null && o.session)) return d("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!k) return d("Pay-per-play is running in another tab. Like from that tab.");
    const se = ct(wt()).find((b) => b.kind === "like" && b.song === l.song);
    if (se && Qi.includes(se.status))
      return d(`Your last like for ${f} is still on its way. It can change again once it confirms.`);
    if (h) return d("One like at a time: your last one is still being sent.");
    if ((se == null ? void 0 : se.status) === "confirmed" && e.now() - (se.confirmedAt ?? 0) < i5)
      return d(`Your like for ${f} has only just confirmed. Try again in a moment.`);
    let ce;
    w = !0;
    try {
      ce = e.likeState ? (await e.likeState(Z, l.song)).by : l.likedBy ?? [];
    } catch {
      ce = l.likedBy;
    } finally {
      w = !1;
    }
    if (!ce) return d(`Could not check ${f} right now. Try the heart again.`);
    const pe = wt(), ge = ((se == null ? void 0 : se.status) === "confirmed" && typeof se.liked == "boolean" && e.now() - (se.confirmedAt ?? se.created) < 5 * 6e4 ? se.liked : void 0) ?? ce.includes(pe);
    if (!ge && ce.some((b) => b !== pe)) return d(j() ? `${f} was liked from another wallet of yours. Unlike it there.` : `${f} was liked from your main wallet${ce.includes(M) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await u({ song: l.song, liked: !ge, title: l.title, artist: l.artist });
  }
  async function u(l) {
    var A, D, M;
    if (h) {
      Oe("Still sending your last like. Try again in a moment.");
      return;
    }
    h = !0;
    const f = l.title ? `“${l.title}”${l.artist ? ` by ${l.artist}` : ""}` : `song #${l.song}`, d = e.wait ?? ((R) => new Promise((Z) => setTimeout(Z, R)));
    try {
      Oe(`${l.liked ? "Liking" : "Unliking"} ${f}…`);
      const R = e.now() + 12e4;
      for (; g || (mt() ? ct(wt()).some((ge) => Qi.includes(ge.status)) : Ut().length); ) {
        if (e.now() > R) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await d(5e3), await Ln(!0);
      }
      if (!mt() && Ht() !== "ready" || (o == null ? void 0 : o.state) !== "unlocked" || !o.session) throw new Error("Paying stopped before the like was sent.");
      const Z = wt(), { balance: se, nonce: ce } = await e.chain.account(Z);
      if (mt() ? c = { for: Z, value: se, at: e.now() } : (i = se, a = e.now()), Qn(se)) throw new Error(sl);
      const pe = await s.request("listening.signLike", {
        song: l.song,
        liked: l.liked,
        fee: wu.toString(),
        nonce: ce.toString(),
        balance: se.toString()
      }), we = {
        id: xu(),
        address: Z,
        kind: "like",
        core: 0,
        song: l.song,
        liked: l.liked,
        recipient: "",
        amount: "0",
        fee: wu.toString(),
        nonce: ce.toString(),
        created: e.now(),
        status: "signed",
        raw: pe.raw,
        txid: pe.txid,
        ...l.title ? { title: String(l.title).slice(0, 120) } : {},
        ...l.artist ? { artist: String(l.artist).slice(0, 120) } : {}
      };
      e.validate(we), Te(we);
      try {
        await e.chain.broadcast(pe.raw, pe.txid), Te({ ...we, status: "pending" }), x = `${l.liked ? "♥ Liked" : "Unliked"} ${f}`, L = "";
        try {
          (A = e.likeSent) == null || A.call(e, l.song, l.liked);
        } catch {
        }
      } catch (ge) {
        if (Te({ ...we, status: si(ge) ? "failed" : "unknown", note: ge.message, ...si(ge) ? { raw: void 0 } : {} }), L = ge.message, si(ge)) try {
          (D = e.likeFailed) == null || D.call(e, l.song);
        } catch {
        }
      }
      o = await xt(s);
    } catch (R) {
      L = "Like not sent: " + (R instanceof Error ? R.message : "the listening wallet is unavailable");
      try {
        (M = e.likeFailed) == null || M.call(e, l.song);
      } catch {
      }
    } finally {
      h = !1, e.changed(), ss();
    }
  }
  return { snapshot: Yt, refresh: Ln, onListened: Wo, heart: Js, toggleLike: vn, ...Pr };
}
const Vm = ["Connect", "Passkey", "Link & fund", "Listen"], qm = ["Passkey", "Add 1 STX", "Listen"], _d = (e) => e ? qm : Vm;
function c5(e) {
  if (e.solo) return l5(e);
  const t = Vm.length, n = (r, s, o = !1) => ({ at: r, blocked: o, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
  switch (e.step) {
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
      return n(2, e.depositPending ? "funds on their way: nothing to do" : "add up to 1 STX");
    case "over":
      return n(2, "over 1 STX: return the excess", !0);
    case "ready": {
      if (!e.payingOn || !e.session || e.session.playsLeft < 1) return n(3, "switch paying on");
      const r = e.entries.filter((s) => s.kind === "play");
      return r.some((s) => s.status === "confirmed") ? n(t, "Paid plays are taking place") : r.some((s) => ["signed", "pending", "unknown"].includes(s.status)) ? n(3, "first paid play sent, confirming") : n(3, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function l5(e) {
  const t = qm.length, n = (r, s, o = !1) => ({ at: r, blocked: o, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
  switch (e.step) {
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
      return n(1, e.depositPending ? "your funds are on their way: nothing to do" : "add 1 STX: anyone can send it to your address");
    case "over":
      return n(1, "over 1 STX: return the excess", !0);
    case "ready": {
      if (!e.payingOn || !e.session || e.session.playsLeft < 1) return n(2, "switch paying on");
      const r = e.entries.filter((s) => s.kind === "play");
      return r.some((s) => s.status === "confirmed") ? n(t, "Paid plays are taking place") : r.some((s) => ["signed", "pending", "unknown"].includes(s.status)) ? n(2, "first paid play sent, confirming") : n(2, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function u5(e, t) {
  return !t || t.at >= _d(!!e.solo).length || e.heard || e.step === "wrong-wallet" || e.entries.some((n) => n.kind === "play") || e.creditedTo ? !1 : !(e.step === "locked" && e.linked);
}
const d5 = (e) => typeof e == "string" && e.toLowerCase().includes("asigna");
function f5(e = typeof window > "u" ? void 0 : window) {
  if (!e) return !1;
  let t = e;
  try {
    const n = e;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (t = n.top);
  } catch {
  }
  return t.LeatherProvider || t.XverseProviders || t.HiroWalletProvider || t.StacksProvider ? !0 : [t.btc_providers, t.webbtc_providers, t.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !d5(r.id)));
}
const h5 = {}, p5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, g5 = (e) => {
  const t = h5;
  return e === "mainnet" ? t.VITE_STACKS_API_MAINNET : t.VITE_STACKS_API_TESTNET;
}, y5 = (e) => `/hiro/${e}`, w5 = (e) => e.startsWith("/") && typeof window < "u" ? `${window.location.origin}${e}` : e, m5 = (e) => {
  const t = g5(e);
  if (t)
    return [w5(t)];
  const n = p5[e];
  return typeof window < "u" ? [`${window.location.origin}${y5(e)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, b5 = {}, R0 = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, x5 = "xtrata.log.enabled", S5 = "xtrata.log.level", v5 = "xtrata.log.tags", A5 = "xtrata.log.dedupe", hc = (e) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(e);
  } catch {
    return null;
  }
}, E5 = (e) => {
  if (!e)
    return !0;
  const t = e.toLowerCase();
  return t !== "false" && t !== "0" && t !== "off";
}, k5 = (e) => {
  if (!e)
    return null;
  const t = e.toLowerCase();
  return t === "debug" || t === "info" || t === "warn" || t === "error" ? t : null;
}, $5 = (e) => {
  if (!e)
    return !1;
  const t = e.toLowerCase();
  return t === "true" || t === "1" || t === "on";
}, I5 = (e) => {
  if (!e)
    return null;
  const t = e.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return t.length === 0 ? null : t.includes("*") || t.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(t);
}, L5 = () => {
  const e = b5 ?? {}, t = hc(x5) ?? e.VITE_LOG_ENABLED, n = hc(S5) ?? e.VITE_LOG_LEVEL, r = hc(v5) ?? e.VITE_LOG_TAGS, s = hc(A5) ?? e.VITE_LOG_DEDUPE;
  return {
    enabled: E5(t),
    level: k5(n) ?? "warn",
    tags: I5(r),
    dedupe: $5(s)
  };
}, C5 = (e, t, n) => !e.enabled || R0[n] < R0[e.level] ? !1 : !e.tags || e.tags.has("*") ? !0 : e.tags.has(t.toLowerCase()), T5 = (e, t, n, r) => {
  const s = L5();
  if (!C5(s, t, e) || M5(s.dedupe))
    return;
  const o = `[xtrata:${t}] ${n}`, i = console[e] ?? console.log;
  r !== void 0 ? i(o, r) : i(o);
}, B5 = /* @__PURE__ */ new Set();
let z0 = null;
const M5 = (e, t, n, r, s) => (z0 !== e && (B5.clear(), z0 = e), !1), N5 = (e, t, n) => T5("debug", e, t, n), _5 = {}, P5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, U5 = (e) => {
  const t = _5, n = e === "testnet" ? t.VITE_BNSV2_CONTRACT_TESTNET : t.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : P5[e];
}, H5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, O5 = (e) => {
  if (!e)
    return null;
  const t = e.trim();
  if (!t)
    return null;
  const n = t.toLowerCase();
  return H5.test(n) ? n : null;
}, D5 = (e) => e.replace(/\/+$/, ""), F5 = (e) => e instanceof Error ? e.message || e.name || "Error" : typeof e == "string" ? e : String(e), G0 = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.startsWith("0x") ? e.slice(2) : e;
  if (!t || t.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(t))
    return null;
  let n = "";
  for (let r = 0; r < t.length; r += 2) {
    const s = Number.parseInt(t.slice(r, r + 2), 16);
    if (s < 32 || s > 126)
      return null;
    n += String.fromCharCode(s);
  }
  return n;
}, oi = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : null, j5 = (e) => {
  var c, p;
  let t;
  try {
    t = ir(D$(e));
  } catch {
    return null;
  }
  const n = oi(t);
  if (!n || n.success === !1)
    return null;
  const r = oi(n.value), s = oi(r == null ? void 0 : r.value), o = oi(s == null ? void 0 : s.value);
  if (!o)
    return null;
  const i = G0((c = oi(o.name)) == null ? void 0 : c.value), a = G0((p = oi(o.namespace)) == null ? void 0 : p.value);
  return !i || !a ? null : O5(`${i}.${a}`);
}, R5 = async (e) => {
  const [t, n] = e.contractId.split("."), r = `${D5(
    e.baseUrl
  )}/v2/contracts/call-read/${t}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: e.address,
      arguments: [$m(lm(e.address))]
    }),
    signal: e.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const o = await s.json();
  return !(o != null && o.okay) || typeof o.result != "string" ? null : j5(o.result);
}, z5 = async (e) => {
  const t = e.address.trim();
  if (!yi(t))
    return null;
  const n = U5(e.network);
  if (!n)
    return null;
  let r = null;
  for (const s of m5(e.network))
    try {
      return await R5({
        baseUrl: s,
        contractId: n,
        address: t,
        signal: e.signal
      });
    } catch (o) {
      r = o;
    }
  return N5("bns", "Primary BNS name lookup unavailable", {
    address: t,
    network: e.network,
    error: F5(r)
  }), null;
};
function G5(e, t, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, o = /* @__PURE__ */ new Map(), i = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => e(a)).then((p) => {
      c.pending = !1, p && (c.name = p, t());
    }).catch(() => {
      c.pending = !1, c.failedAt = s();
    });
  };
  return {
    get(a) {
      if (!a) return null;
      let c = o.get(a);
      return c ? !c.pending && c.name === null && c.failedAt !== void 0 && s() - c.failedAt >= r && i(a, c) : (c = { name: null, pending: !1 }, o.set(a, c), i(a, c)), c.name;
    }
  };
}
const K0 = Object.freeze({
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
}), V0 = Object.freeze({ 139: "melophonic" });
function q0(e, t = "") {
  const n = String(e);
  return Object.hasOwn(K0, n) ? K0[n] : Object.hasOwn(V0, n) ? V0[n] : t;
}
const Y0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function X0(e, t = "") {
  return Object.hasOwn(Y0, String(e)) ? Y0[String(e)] : t;
}
const Ym = 10000n, Wf = 1000000n, ol = 3000n, K5 = (e, t) => `${e}#gift=${t}`, V5 = 100, Ji = (e, t = fr) => e <= jt ? 0 : Number((e - jt) / un(t)), W0 = (e) => typeof e == "string" && /^[A-Za-z0-9_-]{22}$/.test(e), Xm = "xtrata.xyz/radio/gifts", Su = V5, q5 = "Create a prefunded Xtrata radio gift batch", Y5 = (e) => ({
  domain: Xr({ name: Mt(Xm), version: Mt("1"), "chain-id": Zn(1) }),
  message: Xr({
    purpose: Mt(q5),
    creator: Mt(e.creator),
    count: Zn(e.count),
    amount: Zn(BigInt(e.amount)),
    label: Mt(e.label),
    issued: Zn(e.issued),
    ...e.player ? { player: Mt(e.player) } : {}
  })
}), X5 = (e, t, n = fr) => jt + BigInt(e) * un(n) + (t ? Hl : 0n), W5 = (e, t = fr) => Number((Wf - jt - (e ? Hl : 0n)) / un(t)), Z5 = (e, t) => BigInt(e) * (t + ol);
function Q5(e, t, n, r = fr) {
  const s = n ? Hl : 0n, o = t > jt + s ? t - jt - s : 0n, i = Number(o / un(r));
  return {
    plays: i,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(i) * tl,
    fees: BigInt(i) * r,
    reserve: jt,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: ol,
    perCopy: t + ol,
    total: Z5(e, t)
  };
}
const J5 = (e) => e >= Ym && e <= Wf, Z0 = 40, eI = "Create an Xtrata radio gift player", Wm = (e) => typeof e == "string" && /^[0-9a-f]{16}$/.test(e), tI = /^[^\u0000-\u001f\u007f<>]+$/u;
function Q0(e, t, n) {
  return typeof e != "string" ? !1 : e.length ? e.length <= t && e === e.trim() && tI.test(e) : !n;
}
function Zm(e) {
  if (!e || typeof e != "object") throw new Error("A player needs a definition.");
  if (!Q0(e.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!Q0(e.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(e.tracks) || e.tracks.length < 1 || e.tracks.length > Z0) throw new Error(`A player holds 1 to ${Z0} songs.`);
  const t = /* @__PURE__ */ new Set();
  for (const s of e.tracks) {
    if (!Number.isSafeInteger(s) || s < 1) throw new Error("Songs are catalogue token numbers.");
    if (t.has(s)) throw new Error("A song appears twice in the list.");
    t.add(s);
  }
  if (e.cover !== null && e.cover !== void 0 && (!Number.isSafeInteger(e.cover) || e.cover < 1)) throw new Error("Cover is a catalogue token number.");
  const n = e.explicit ?? [];
  if (!Array.isArray(n)) throw new Error("Explicit songs: a list of song numbers from the album.");
  for (const s of n) if (!t.has(s)) throw new Error("An explicit song must be one of the album’s songs.");
  const r = [...new Set(n)].sort((s, o) => s - o);
  return { title: e.title, subtitle: e.subtitle ?? "", tracks: [...e.tracks], cover: e.cover ?? null, ...r.length ? { explicit: r } : {} };
}
const Qm = (e) => {
  const t = [...new Set(e.explicit ?? [])].sort((n, r) => n - r);
  return Qd(tf(new TextEncoder().encode(JSON.stringify({ title: e.title, subtitle: e.subtitle ?? "", tracks: e.tracks, cover: e.cover ?? null, ...t.length ? { explicit: t } : {} }))));
}, nI = (e) => ({
  domain: Xr({ name: Mt(Xm), version: Mt("1"), "chain-id": Zn(1) }),
  message: Xr({
    purpose: Mt(eI),
    admin: Mt(e.admin),
    player: Mt(e.hash),
    issued: Zn(e.issued)
  })
}), lr = (e) => e.tracks.filter((t) => !t.hidden), rI = (e) => e.tracks.find((t) => t.hidden) ?? null, J0 = [300, 500, 1e3], eg = 1800, vu = /* @__PURE__ */ new Map();
async function sI(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
  }
  try {
    const t = document.createElement("textarea");
    t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.append(t), t.select();
    const n = document.execCommand("copy");
    return t.remove(), n;
  } catch {
    return !1;
  }
}
function oI(e, t, n, r, s) {
  const o = document.createElement("button");
  return o.type = "button", o.className = r, o.dataset.feedback = e, (() => {
    const a = vu.get(e), c = !!a && a.until > Date.now();
    o.textContent = c ? a.label : t, o.classList.toggle("is-done", c && a.ok), o.classList.toggle("is-failed", c && !a.ok);
  })(), o.onclick = async () => {
    const a = await n();
    if (a) {
      vu.set(e, { ...a, until: Date.now() + eg });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === e && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        vu.delete(e), s();
      }, eg + 50);
    }
  }, o;
}
const sr = (e, t, n, r, s) => oI(e, t, async () => await sI(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), to = "xtrata.radio.gift.incoming.v1", tg = (e) => "xtrata.radio.gift.mine.v1:" + e, ng = (e) => "xtrata.radio.gift.batches.v1:" + e, ke = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, br = (e, t, n = "") => {
  const r = ke("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, pc = (e, t) => {
  const n = document.createElement("option");
  return n.textContent = e, n.value = t, n;
}, Gn = (e) => rr(e).replace(/\.?0+$/, "");
function iI(e) {
  let t = null;
  const n = (I) => [5e3, 1e4, 2e4, 3e4][I] ?? 6e4, r = (() => {
    try {
      const I = new URL(location.href), q = new URLSearchParams(I.hash.slice(1)).get("gift") ?? I.searchParams.get("gift");
      return q !== null && (I.searchParams.delete("gift"), history.replaceState(null, "", I.pathname + (I.search || ""))), W0(q) ? q : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const I = JSON.parse(e.store.get(to) || "null");
      return W0(I == null ? void 0 : I.code) ? I.code : null;
    } catch {
      return null;
    }
  })(), o = r ?? s;
  if (o) {
    t = { code: o }, e.store.set(to, JSON.stringify({ code: o, at: e.now() }));
    let I = 0;
    const q = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: o }), signal: AbortSignal.timeout(15e3) }).then(async (j) => {
      const X = await j.json().catch(() => ({}));
      if (j.status === 404) {
        e.store.set(to, null), t = { ...t, error: (X == null ? void 0 : X.error) || "That gift link is not valid." }, e.changed();
        return;
      }
      if (!j.ok) throw new Error("busy");
      const Ae = X;
      t = { ...t, view: Ae, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(Ae.status) && e.store.set(to, null), e.changed();
    }).catch(() => {
      !t || t.view || (t = { ...t, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, e.changed(), setTimeout(() => void q(), n(I++)));
    });
    q();
  }
  const i = () => !!(t != null && t.view) && t.view.status === "live" && !t.done, a = () => {
    const I = t == null ? void 0 : t.view;
    return !(I != null && I.player) || !i() ? null : { player: I.player, from: h(I), plays: Ji(BigInt(I.amount)) };
  }, c = () => {
    const I = t == null ? void 0 : t.view;
    return !I || I.player || !i() ? null : { plays: Ji(BigInt(I.amount)), from: I.from ? e.who(I.from) : null };
  }, p = () => {
    const I = t == null ? void 0 : t.code;
    if (!I) return [];
    const q = `${location.origin}${location.pathname}#gift=${I}`;
    return [sr("gift-pass-on", "Copy the link to pass on", () => q, "primary", e.changed)];
  }, g = () => {
    t = null, e.store.set(to, null), e.changed();
  }, h = (I) => I.from ? e.who(I.from) : I.label ? `Xtrata Radio · ${I.label}` : "Xtrata Radio";
  let w = {};
  const y = (I) => {
    if (w.box) return w.box;
    const q = ke("div", "", "ppp-gift-check");
    w.box = q;
    const j = () => {
      const X = window.turnstile;
      !X || w.rendered || (w.rendered = !0, X.render(q, { sitekey: I, callback: (Ae) => {
        w.token = Ae, e.changed();
      }, "expired-callback": () => {
        w.token = void 0;
      } }));
    };
    if (window.turnstile) j();
    else {
      const X = document.createElement("script");
      X.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", X.async = !0, X.onload = j, document.head.append(X);
    }
    return q;
  }, S = (I) => {
    queueMicrotask(() => void I());
  };
  let x;
  async function L(I) {
    var X, Ae, Ie, Qe, bt, Ye, st, ze, $;
    if (!t || t.claiming || !I.listening) return;
    const q = !!((X = t.view) != null && X.player);
    if (q && !I.root) return;
    t.claiming = !0, t.error = void 0, (Ae = e.claiming) == null || Ae.call(e, !0), e.changed();
    const j = async (oe) => {
      const ye = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: t.code, turnstile: w.token, ...oe })
      });
      return { res: ye, r: await ye.json().catch(() => ({})) };
    };
    try {
      let oe = 0, ye = I.listening, Je;
      if (q) {
        const gt = Number((Ie = await e.json("/radio/gift/slots?root=" + encodeURIComponent(I.root))) == null ? void 0 : Ie.next);
        if (!Number.isSafeInteger(gt) || gt < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        oe = gt;
        for (let pn = 0; ; pn++) {
          const qt = await e.album.bind(oe);
          if (ye = qt.address, Je = await j({ wallet: ye, binding: qt }), Je.res.status === 409 && /just taken/.test(((Qe = Je.r) == null ? void 0 : Qe.error) || "") && pn < 5) {
            oe += 1;
            continue;
          }
          break;
        }
      } else Je = await j({ wallet: ye });
      const { res: it, r: Et } = Je;
      if (it.status === 503 && /sending another gift/.test((Et == null ? void 0 : Et.error) || "")) {
        t.waiting = !0, (bt = e.claiming) == null || bt.call(e, !0), clearTimeout(x), x = setTimeout(() => {
          t && (t.waiting = !1, e.changed());
        }, 12e3);
        return;
      }
      if (!it.ok) {
        const gt = String((Et == null ? void 0 : Et.error) || "");
        if (it.status === 404 || it.status === 410 || it.status === 409 && /already had a gift|brand-new|already have this album/.test(gt))
          throw e.store.set(to, null), new Error(gt || "This gift cannot be opened.");
        if (it.status === 429 || it.status === 403 || it.status === 400 && !/wallet number/i.test(gt)) throw new Error(gt || `Could not open the gift (${it.status}).`);
        const qt = /topping up/.test(gt) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(gt) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(gt) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(qt), { retry: !0, slow: /topping up|not paid for yet/.test(gt) });
      }
      t.done = !0, e.store.set(to, null), q ? await e.album.arrived(oe, ye, Et.txid, BigInt(Et.amount)) : e.giftSent(Et.txid, BigInt(Et.amount));
    } catch (oe) {
      const ye = oe, Je = ye.name === "TypeError" || ye.name === "AbortError" || ye.name === "TimeoutError" || /wallet number/i.test(ye.message);
      if (ye.retry || Je) {
        const it = t.tries ?? 0;
        t.tries = it + 1, t.retry = { text: ye.retry ? ye.message : "Still sending your gift… the network is slow, trying again." }, (Ye = e.claiming) == null || Ye.call(e, !0), clearTimeout(x), x = setTimeout(() => {
          t && (t.retry = void 0, e.changed());
        }, ye.slow ? 6e4 : n(it));
      } else
        t.error = ye.message, (st = e.claiming) == null || st.call(e, !1);
      w.token = void 0;
      try {
        ($ = (ze = window.turnstile) == null ? void 0 : ze.reset) == null || $.call(ze, w.box);
      } catch {
      }
    } finally {
      t.claiming = !1, e.changed();
    }
  }
  let O = null;
  function U(I) {
    if (!I.listening || !I.depositPending || I.step !== "fund")
      return O = null, [];
    if (!O || O.wallet !== I.listening || e.now() - O.at > 3e4) {
      const j = I.listening;
      O = { ...(O == null ? void 0 : O.wallet) === j ? O : {}, wallet: j, at: e.now() }, e.json("/radio/gift/for?wallet=" + encodeURIComponent(j)).then((X) => {
        var Ae, Ie;
        (O == null ? void 0 : O.wallet) === j && (O.state = (Ae = X == null ? void 0 : X.gift) == null ? void 0 : Ae.state, O.problem = ((Ie = X == null ? void 0 : X.gift) == null ? void 0 : Ie.problem) ?? null, e.changed());
      }).catch(() => {
      });
    }
    if (!(O.state === "sending" && O.problem)) return [];
    const q = ke("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return q.title = `Network reply: ${O.problem}`, [q];
  }
  function v(I, q, j = !1) {
    var Ye, st;
    const X = q.player, Ae = BigInt(q.amount), Ie = j ? [] : [ke("p", `🎁 ${h(q)} sent you “${X.title}”${X.subtitle ? ` by ${X.subtitle}` : ""}: ${lr(X).length} ${lr(X).length === 1 ? "song" : "songs"} and ${Ji(Ae).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!I.root && ["fund", "ready", "over", "link"].includes(I.step))) {
      if (j) return Ie;
      if (Ie.push(ke("p", I.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : I.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), I.step === "intro") {
        const ze = document.createElement("details");
        ze.className = "ppp-how";
        const $ = document.createElement("summary");
        $.textContent = "How does this work?", ze.append($, ke("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), Ie.push(ze);
      }
      return Ie;
    }
    if (I.walletCannotAlbums)
      return Ie.push(ke("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), Ie;
    const bt = (st = (Ye = I.gate) == null ? void 0 : Ye.gifts) == null ? void 0 : st.turnstileSiteKey;
    return bt && !w.token ? Ie.push(ke("p", "One quick check and it is yours:", "ppp-mute"), y(bt)) : !t.claiming && !t.error && !t.waiting && !t.retry && S(() => L(I)), Ie.push(...T(I, "Sending your album…")), Ie;
  }
  function T(I, q) {
    const j = [];
    return t.claiming || t.waiting ? j.push(ke("p", t.waiting ? "Another gift is on its way out first. Yours is next…" : q, "ppp-cyan")) : t.retry && j.push(ke("p", t.retry.text, "ppp-warn"), br("Try now", () => {
      clearTimeout(x), t.retry = void 0, L(I);
    }, "quiet")), t.error && /already have this album/i.test(t.error) ? j.push(ke("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...p(), br("Forget this gift link here", g, "quiet")) : t.error && j.push(ke("p", t.error, "ppp-bad"), br("Try again", () => {
      t.error = void 0, L(I);
    })), j;
  }
  const B = (I) => {
    var q;
    return !!t && !t.done && !t.error && i() && !!I.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(t.claiming || t.waiting || t.retry) || !I.linked && !I.creditedTo && (I.createdHere || I.brandNew || !!((q = t.view) != null && q.player)) && (I.balance ?? 0n) === 0n && !I.entries.length);
  };
  function z(I, q = {}) {
    var $, oe;
    const j = U(I);
    if (!t || ["off", "elsewhere"].includes(I.step)) return j;
    const X = t.view;
    if (t.error && !X) return [ke("p", `🎁 ${t.error}`, "ppp-warn")];
    if (!X) return [ke("p", t.retry ? `🎁 ${t.retry.text}` : "🎁 Checking your gift…", t.retry ? "ppp-warn" : "ppp-mute")];
    if (t.done) return j;
    if (X.status === "claimed" || X.status === "claiming") return [ke("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(X.status)) return [ke("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (X.status === "pending-deposit") return [ke("p", `🎁 ${h(X)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (X.player) return [...v(I, X, !!q.bare), ...j];
    if (!!I.listening && (!(I.createdHere || I.brandNew) || !!I.linked || !!I.creditedTo || (I.balance ?? 0n) > 0n || I.entries.length > 0))
      return [ke("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...p(), br("Forget this gift link here", g, "quiet")];
    const Ie = BigInt(X.amount), Qe = Ji(Ie).toLocaleString(), bt = ke(
      "p",
      `🎁 ${h(X)} sent you ${Gn(Ie)} STX of on-chain music: about ${Qe} paid plays.`,
      "ppp-gift"
    ), Ye = q.bare ? [] : [bt], st = !!I.listening && (I.createdHere || I.brandNew) && !I.linked && !I.creditedTo && I.step === "fund" && (I.balance ?? 1n) === 0n && !I.depositPending && !I.entries.length, ze = (oe = ($ = I.gate) == null ? void 0 : $.gifts) == null ? void 0 : oe.turnstileSiteKey;
    return st ? (ze && !w.token ? Ye.push(ke("p", "One quick check and it is yours:", "ppp-mute"), y(ze)) : !t.claiming && !t.error && !t.waiting && !t.retry && S(() => L(I)), Ye.push(...T(I, "Sending your gift…"))) : I.step === "intro" ? q.bare || Ye.push(ke("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : I.listening && I.linked ? Ye.push(ke("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...p(), br("Forget this gift link here", g, "quiet")) : I.listening && (I.balance ?? 0n) > 0n && Ye.push(ke("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...p(), br("Forget this gift link here", g, "quiet")), Ye;
  }
  async function Q(I, q, j) {
    var X;
    try {
      const Ae = await e.json("/radio/gift/for?wallet=" + encodeURIComponent(I));
      if ((X = Ae == null ? void 0 : Ae.gift) != null && X.returnTo) return { ok: !0, funder: Ae.gift.returnTo, txId: Ae.gift.txid ?? void 0, amount: Ae.gift.amount, distinct: 1 };
    } catch {
      if (j) return { ok: !1 };
    }
    return q();
  }
  const W = ke("div", "", "ppp-gift-fold");
  let K = 250000n, m = "", E = "";
  const P = (I) => {
    try {
      const q = JSON.parse(e.store.get(tg(I)) || "[]");
      return Array.isArray(q) ? q : [];
    } catch {
      return [];
    }
  }, N = (I, q) => e.store.set(tg(I), JSON.stringify(q.slice(0, 50)));
  async function V(I) {
    const q = P(I);
    for (const j of q)
      if (!(j.view && ["claimed", "refunded", "expired"].includes(j.view.status)))
        try {
          j.view = !j.view || j.view.status === "pending-deposit" ? await e.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: j.id, ...j.txid ? { txid: j.txid } : {} }) }) : await e.json("/radio/gift?id=" + j.id), j.error = void 0;
        } catch (X) {
          j.error = X.message;
        }
    N(I, q), e.changed();
  }
  async function G(I) {
    if (m) return;
    m = "Starting your gift…", E = "", e.changed();
    let q = null;
    try {
      q = await e.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: I, amount: K.toString() }) });
      const j = P(I);
      j.unshift({ id: q.id, code: q.code, amount: K.toString(), at: e.now() }), N(I, j), m = "Approve the gift in your wallet…", e.changed();
      const X = await e.pay(I, q.depositTo, BigInt(q.deposit), q.memo), Ae = P(I), Ie = Ae.find((Qe) => Qe.id === q.id);
      Ie && (Ie.txid = X, Ie.view = { status: "pending-deposit", amount: K.toString(), source: "friend", from: I, label: "", expires: 0 }), N(I, Ae), E = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", V(I);
    } catch (j) {
      E = j.message || "Not sent.";
    } finally {
      m = "", e.changed();
    }
  }
  const ve = (I) => "xtrata.radio.gift.players.v1:" + I, ue = (I) => {
    try {
      const q = JSON.parse(e.store.get(ve(I)) || "[]");
      return Array.isArray(q) ? q.filter((j) => j && /^[0-9a-f]{16}$/.test(j.id)) : [];
    } catch {
      return [];
    }
  };
  async function Re(I, q) {
    var j;
    if (!m) {
      m = "Checking the player…", E = "", e.changed();
      try {
        const X = q.tracks.split(/[\s,]+/).filter(Boolean).map((ze) => Number(ze.replace(/^#/, ""))), Ae = (q.explicit ?? "").split(/[\s,]+/).map((ze) => ze.replace(/^#/, "")).filter(Boolean).map(Number), Ie = Zm({ title: q.title.trim(), subtitle: q.subtitle.trim(), tracks: X, cover: (j = q.cover) != null && j.trim() ? Number(q.cover.trim().replace(/^#/, "")) : null, ...Ae.length ? { explicit: Ae } : {} });
        m = "Sign in your wallet…", e.changed();
        const Qe = { admin: I, hash: Qm(Ie), issued: e.now() }, bt = await e.sign(I, nI(Qe));
        m = "Making the player…", e.changed();
        const Ye = await e.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: Ie, request: Qe, signature: bt }) }), st = ue(I).filter((ze) => ze.id !== Ye.id);
        st.unshift({ id: Ye.id, title: Ye.title, tracks: Ye.tracks }), e.store.set(ve(I), JSON.stringify(st.slice(0, 30))), E = `${Ye.existing ? "That player already exists" : "Player made"} ✓ “${Ye.title}” · ${Ye.tracks} songs. Pick it below for a batch.`;
      } catch (X) {
        E = X.message || "Not made.";
      } finally {
        m = "", e.changed();
      }
    }
  }
  const C = (I, q) => K5(I || location.origin + "/radio.html", q), k = (I) => {
    try {
      const q = JSON.parse(e.store.get(ng(I)) || "[]");
      return Array.isArray(q) ? q.filter((j) => j && /^[0-9a-f]{16}$/.test(j.id) && Array.isArray(j.codes)) : [];
    } catch {
      return [];
    }
  }, H = (I, q) => e.store.set(ng(I), JSON.stringify(q.slice(0, 20))), ne = (I) => !!I.view && I.view.status === "live" && I.view.copies.waiting + I.view.copies.claiming + I.view.copies.refunding === 0, J = (I, q) => e.json(I, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(q) });
  let re = 0;
  async function Ce(I) {
    const q = k(I);
    for (const j of q)
      if (!ne(j))
        try {
          j.view = !j.view || j.view.status === "pending-deposit" ? await J("/radio/gift/batch/confirm", { id: j.id, ...j.txid ? { txid: j.txid } : {} }) : await e.json("/radio/gift/batch?id=" + j.id), j.error = void 0;
        } catch (X) {
          j.error = X.message;
        }
    try {
      const j = await e.json("/radio/gift/batches?creator=" + encodeURIComponent(I));
      for (const X of (j == null ? void 0 : j.batches) ?? []) {
        const Ae = q.find((Ie) => Ie.id === X.id);
        if (Ae) {
          Ae.error || (Ae.view = X);
          continue;
        }
        q.push({ id: X.id, codes: [], count: X.count, amount: X.amount, label: X.label, player: X.player, depositTo: "", deposit: X.deposit, memo: X.memo, at: 0, view: X });
      }
    } catch {
    }
    H(I, q), e.changed();
  }
  async function de(I, q) {
    const j = k(I).find((X) => X.id === q);
    if (!(!j || !j.depositTo || m)) {
      m = "Approve the payment in your wallet…", E = "", e.changed();
      try {
        const X = await e.pay(I, j.depositTo, BigInt(j.deposit), j.memo), Ae = k(I), Ie = Ae.find((Qe) => Qe.id === q);
        Ie && (Ie.txid = X), H(I, Ae), E = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", m = "", Ce(I);
      } catch (X) {
        E = `${/cancel/i.test(X.message) ? "Payment cancelled." : X.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        m = "", e.changed();
      }
    }
  }
  async function me(I, q, j, X) {
    if (m) return;
    if (!q.ok) {
      E = q.reason, e.changed();
      return;
    }
    m = "Sign in your wallet…", E = "", e.changed();
    let Ae = null;
    try {
      const Ie = { creator: I, count: q.count, amount: q.amount.toString(), label: j, issued: e.now(), ...X ? { player: X } : {} }, Qe = await e.sign(I, Y5(Ie));
      m = "Making your links…", e.changed(), Ae = await J("/radio/gift/batch", { request: Ie, signature: Qe });
      const bt = k(I);
      bt.unshift({ id: Ae.id, codes: Ae.codes, count: q.count, amount: Ae.amount, label: j, player: X ?? null, depositTo: Ae.depositTo, deposit: Ae.deposit, memo: Ae.memo, at: e.now() }), H(I, bt);
    } catch (Ie) {
      E = Ie.message || "Not made.", m = "", e.changed();
      return;
    }
    m = "", e.changed(), await de(I, Ae.id);
  }
  function he() {
    const I = !!rt.value, q = Ge.value === "max" ? W5(I) : Number(Ge.value), j = X5(q, I), X = Number(Qt.value);
    return !Number.isInteger(X) || X < 1 || X > Su ? { ok: !1, reason: `Make 1 to ${Su} copies at a time.`, album: I, plays: q, amount: j, count: X } : J5(j) ? { ok: !0, reason: "", album: I, plays: q, amount: j, count: X, bill: Q5(X, j, I) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: I, plays: q, amount: j, count: X };
  }
  const Ke = () => {
    const I = he();
    if (!I.ok) return I.reason;
    const q = I.bill;
    return `Each copy: ${I.plays.toLocaleString()} paid plays (${Gn(q.holders)} to song holders, ${Gn(q.fees)} network fees)${I.album ? `, ${Gn(q.float)} for the album’s likes` : ""}, ${Gn(q.reserve)} kept so a listener can return what is left, + ${Gn(q.sendFee)} to send it = ${Gn(q.perCopy)} STX. ${I.count} copies = ${Gn(q.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Lt = (I, q) => q.codes.map((j) => C(I, j)), $e = ke("input");
  $e.type = "range", $e.min = String(Ym), $e.max = String(Wf), $e.step = "10000", $e.value = String(K), $e.setAttribute("aria-label", "Gift amount");
  const ct = ke("p", "", "ppp-gift-amount"), Te = br("", () => {
    const I = e.main();
    I && G(I);
  }, "primary"), fn = () => {
    ct.textContent = sn(), Te.textContent = `Gift ${Gn(K)} STX`;
  };
  $e.oninput = () => {
    K = BigInt($e.value), fn();
  };
  const sn = () => `${Gn(K)} STX · about ${Ji(K).toLocaleString()} paid plays · you pay ${Gn(K + ol)} STX with the network fee`;
  fn();
  const Ut = ke("input");
  Ut.maxLength = 60, Ut.placeholder = "Title, e.g. Proof of Sound", Ut.setAttribute("aria-label", "Player title");
  const Zt = ke("input");
  Zt.maxLength = 80, Zt.placeholder = "Artist (optional)", Zt.setAttribute("aria-label", "Player subtitle");
  const Ct = ke("textarea");
  Ct.rows = 3, Ct.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Ct.setAttribute("aria-label", "Songs");
  const hn = ke("input");
  hn.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", hn.setAttribute("aria-label", "Explicit songs");
  const Gt = ke("input");
  Gt.inputMode = "numeric", Gt.placeholder = "Cover inscription number (optional), shown when the album loads", Gt.setAttribute("aria-label", "Cover inscription");
  const rt = ke("select");
  rt.setAttribute("aria-label", "Batch album");
  const Ge = ke("select");
  Ge.setAttribute("aria-label", "Plays per copy");
  for (const I of [.../* @__PURE__ */ new Set([50, 100, 250, ...J0])].sort((q, j) => q - j)) Ge.append(pc(`${I.toLocaleString()} plays`, String(I)));
  Ge.append(pc("Max (1 STX)", "max")), Ge.value = String(J0[0]);
  const Qt = ke("input");
  Qt.type = "number", Qt.min = "1", Qt.max = String(Su), Qt.value = "10", Qt.setAttribute("aria-label", "Copies");
  const Kt = ke("input");
  Kt.maxLength = 40, Kt.placeholder = "Label, e.g. Opera launch", Kt.setAttribute("aria-label", "Batch label");
  const wt = ke("p", "", "ppp-mute"), mt = () => {
    wt.textContent = Ke();
  };
  for (const I of [rt, Ge, Qt])
    I.oninput = mt, I.onchange = mt;
  mt();
  function $n(I) {
    var Ae, Ie;
    const q = (Ae = I.gate) == null ? void 0 : Ae.gifts;
    if (!(q != null && q.enabled) || !q.admin || ["off", "elsewhere", "unsupported"].includes(I.step)) return null;
    const j = e.main(), X = [ke("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!j)
      X.push(ke("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (q.admin) {
      const Qe = ke("div", "", "ppp-gift-admin"), bt = (oe, ye) => {
        const Je = ke("label", oe);
        return Je.append(ye), Je;
      }, Ye = ue(j);
      Qe.append(
        ke("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        Ut,
        Zt,
        Ct,
        Gt,
        hn,
        br("Sign and make player", () => void Re(j, { title: Ut.value, subtitle: Zt.value, tracks: Ct.value, cover: Gt.value, explicit: hn.value }))
      );
      const st = br("Sign, pay and make links", () => {
        me(j, he(), Kt.value.trim(), rt.value || void 0);
      });
      st.disabled = !!m;
      const ze = rt.value;
      rt.replaceChildren(pc("No album (starter copies)", ""), ...Ye.map((oe) => pc(`${oe.title} · ${oe.tracks} songs`, oe.id))), Ye.some((oe) => oe.id === ze) && (rt.value = ze), mt(), Qe.append(
        ke("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        bt("Album ", rt),
        bt("Plays each ", Ge),
        bt("Copies ", Qt),
        Kt,
        wt,
        st
      ), e.now() - re > 3e4 && (re = e.now(), Ce(j));
      const $ = k(j);
      if ($.length) {
        const oe = ke("ul", "", "ppp-gift-list");
        for (const ye of $.slice(0, 10)) {
          const Je = ye.view, it = Je == null ? void 0 : Je.copies, Et = ye.error ? ye.error : !Je || Je.status === "pending-deposit" ? ye.txid ? "payment confirming…" : "waiting for your payment" : `${it.claimed} of ${Je.count} claimed${it.refunding + it.refunded ? ` · ${it.refunded} refunded${it.refunding ? `, ${it.refunding} on their way` : ""}` : ""}`, gt = ke("li");
          if (gt.append(ke("span", `${ye.label || "Batch"} · ${ye.count} × ${Gn(BigInt(ye.amount))} STX`, "t"), ke("span", Et, "ppp-mute")), !ye.txid && ye.depositTo && (!Je || Je.status === "pending-deposit") && gt.append(br("Pay now", () => void de(j, ye.id), "tiny")), ye.codes.length && (Je == null ? void 0 : Je.status) === "live") {
            const pn = Lt(((Ie = I.gate) == null ? void 0 : Ie.radioUrl) ?? null, ye);
            gt.append(
              sr("batch-copy:" + ye.id, "Copy all links", () => pn.join(`
`), "tiny", e.changed),
              sr("batch-csv:" + ye.id, "Copy as CSV", () => ["copy,link", ...pn.map((qt, Zr) => `${Zr + 1},${qt}`)].join(`
`), "tiny", e.changed)
            );
          } else ye.codes.length || gt.append(ke("span", "links were made on another device", "ppp-mute"));
          oe.append(gt);
        }
        Qe.append(oe);
      }
      X.push(Qe);
    }
    return m && X.push(ke("p", m, "ppp-cyan")), E && X.push(ke("p", E, /✓/.test(E) ? "ppp-ok" : "ppp-warn")), W.replaceChildren(...X), W;
  }
  return { banner: z, funder: Q, renderFold: $n, liveGift: i, incomingAlbum: a, incomingStarter: c, setAside: g, pendingCode: () => t && !t.done && (!t.view || t.view.status === "live") ? t.code : null, inProgress: B };
}
const aI = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function cI(e) {
  if (!Array.isArray(e)) return [];
  const t = [];
  for (const n of e) {
    if (!n || !Number.isSafeInteger(n.slot) || n.slot < 1 || typeof n.address != "string") continue;
    const r = n.player, s = r && typeof r.id == "string" && typeof r.title == "string" && Array.isArray(r.tracks) ? r : null;
    s && t.push({
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
  return t;
}
const lI = (e) => {
  var t, n, r;
  return [(t = e.player) == null ? void 0 : t.title, (n = e.player) == null ? void 0 : n.subtitle, e.label, `#${e.slot}`, ...(((r = e.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function uI(e, t) {
  const n = t.query.toLowerCase().split(/\s+/).filter(Boolean), r = e.filter((o) => (!t.pinnedOnly || t.pins.has(o.slot)) && (() => {
    const i = lI(o);
    return n.every((a) => i.includes(a));
  })()), s = {
    recent: (o, i) => (t.recents[i.slot] ?? 0) - (t.recents[o.slot] ?? 0) || i.slot - o.slot,
    newest: (o, i) => i.slot - o.slot,
    oldest: (o, i) => o.slot - i.slot,
    title: (o, i) => {
      var a, c;
      return (((a = o.player) == null ? void 0 : a.title) ?? "").localeCompare(((c = i.player) == null ? void 0 : c.title) ?? "") || o.slot - i.slot;
    }
  };
  return r.sort((o, i) => Number(t.pins.has(i.slot)) - Number(t.pins.has(o.slot)) || s[t.sort](o, i));
}
function dI(e, t = 100) {
  const n = Object.entries(e).sort((r, s) => s[1] - r[1]).slice(0, t);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const Pd = /* @__PURE__ */ new Set(), Zf = (e) => (Pd.add(e), () => {
  Pd.delete(e);
}), il = () => {
  for (const e of [...Pd])
    try {
      e();
    } catch {
    }
}, rg = "xtrata:al-thumb:v1:", Qf = "-", ea = 96, fI = 24 * 1024 * 1024, Wt = /* @__PURE__ */ new Map(), sg = /* @__PURE__ */ new Set(), Ud = [];
let Au = !1, Eu;
const Aa = (e, t) => {
  try {
    if (t === void 0) return window.localStorage.getItem(rg + e);
    window.localStorage.setItem(rg + e, t);
  } catch {
  }
  return null;
};
function Jf(e) {
  return new Promise((t) => {
    var n;
    try {
      const r = document.createElement("canvas"), s = (n = r.getContext) == null ? void 0 : n.call(r, "2d");
      if (!s) return t(e);
      const o = new Image(), i = setTimeout(() => t(e), 8e3);
      o.onload = () => {
        clearTimeout(i);
        try {
          const a = Math.min(o.naturalWidth, o.naturalHeight);
          if (!a) return t(e);
          r.width = r.height = ea, s.fillStyle = "#143a40", s.fillRect(0, 0, ea, ea), s.drawImage(o, (o.naturalWidth - a) / 2, (o.naturalHeight - a) / 2, a, a, 0, 0, ea, ea), t(r.toDataURL("image/jpeg", 0.82));
        } catch {
          t(e);
        }
      }, o.onerror = () => {
        clearTimeout(i), t(e);
      }, o.src = e;
    } catch {
      t(e);
    }
  });
}
async function hI(e) {
  var c, p, g, h, w;
  const t = await fetch("/inscription/" + e, { signal: AbortSignal.timeout(6e4) }), n = (t.headers.get("content-type") || "").toLowerCase();
  if (!t.ok)
    return await ((c = t.body) == null ? void 0 : c.cancel()), null;
  if (n.startsWith("image/"))
    return await ((p = t.body) == null ? void 0 : p.cancel()), "/inscription/" + e;
  if (!n.includes("text/html"))
    return await ((g = t.body) == null ? void 0 : g.cancel()), "";
  let r = "", s = 0;
  const o = (y) => {
    let S = 0;
    for (; ; ) {
      const x = r.slice(S).search(/<img\b/i);
      if (x < 0)
        return r = y ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const L = S + x, O = r.indexOf(">", L);
      if (O < 0)
        return r = r.slice(L), null;
      const U = r.slice(L, O + 1), v = U.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (v) return v[1].replace(/&amp;/g, "&");
      const T = U.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (T) return "/inscription/" + T[1];
      S = O + 1;
    }
  }, i = (w = (h = t.body) == null ? void 0 : h.getReader) == null ? void 0 : w.call(h);
  if (!i)
    return r = await t.text(), o(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: y, value: S } = await i.read();
    if (y) break;
    s += S.byteLength, r += a.decode(S, { stream: !0 });
    const x = o(!1);
    if (x)
      return await i.cancel(), x;
    if (s > fI)
      return await i.cancel(), null;
  }
  return r += a.decode(), o(!0) ?? "";
}
async function pI() {
  if (!Au) {
    Au = !0;
    try {
      for (; Ud.length; ) {
        const e = Ud.shift();
        if (!Wt.has(e))
          try {
            const t = await hI(e);
            if (t === null) continue;
            if (!t) {
              Wt.set(e, ""), Aa(e, Qf), il();
              continue;
            }
            const n = await Jf(t);
            Wt.set(e, n), n.startsWith("data:image/jpeg") && Aa(e, n), il();
          } catch {
          }
      }
    } finally {
      Au = !1;
    }
  }
}
function eh(e, t) {
  if (t && !Wt.get(e) ? (Wt.set(e, t), Jf(t).then((r) => {
    r !== t && (Wt.set(e, r), r.startsWith("data:image/jpeg") && Aa(e, r), il());
  })) : t === "" && !Wt.has(e) && Wt.set(e, ""), Wt.has(e)) return Wt.get(e);
  const n = Aa(e);
  if (n != null) {
    const r = n === Qf ? "" : n;
    return Wt.set(e, r), r;
  }
  return sg.has(e) || (sg.add(e), Ud.push(e), Eu || (Eu = setTimeout(() => {
    Eu = void 0, pI();
  }, 1200))), "";
}
function og(e) {
  if (Wt.has(e)) return Wt.get(e);
  const t = Aa(e);
  if (t == null) return null;
  const n = t === Qf ? "" : t;
  return Wt.set(e, n), n;
}
const ku = /* @__PURE__ */ new Map(), $u = /* @__PURE__ */ new Set();
function Cc(e) {
  return !e || !Number.isSafeInteger(e) || e < 0 ? "" : ku.has(e) ? ku.get(e) : ($u.has(e) || ($u.add(e), fetch("/inscription/" + e, { signal: AbortSignal.timeout(2e4) }).then(async (t) => {
    var r, s, o, i;
    const n = (t.headers.get("content-type") || "").toLowerCase();
    if (!t.ok)
      throw await ((r = t.body) == null ? void 0 : r.cancel()), new Error("no cover");
    return n.startsWith("image/") ? (await ((s = t.body) == null ? void 0 : s.cancel()), "/inscription/" + e) : n.includes("text/html") ? (((o = (await t.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : o[1]) ?? "").replace(/&amp;/g, "&") : (await ((i = t.body) == null ? void 0 : i.cancel()), "");
  }).then((t) => {
    ku.set(e, t), il();
  }).catch(() => {
    $u.delete(e);
  })), "");
}
const ii = 12, gI = 5e3, cn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, ai = (e, t, n = "") => {
  const r = cn("button", e, n);
  return r.type = "button", r.onclick = t, r;
};
function yI(e) {
  let t, n = [], r = 0, s = !1, o = !1, i = -1 / 0, a = "", c = "recent", p = !1, g = ii;
  const h = cn("div", "", "ppp-shelf-box");
  Zf(() => e.changed());
  const w = (P) => "xtrata.radio.shelf.pins.v1:" + P, y = (P) => "xtrata.radio.shelf.recent.v1:" + P, S = (P, N) => {
    try {
      return JSON.parse(e.store.get(P) || "null") ?? N;
    } catch {
      return N;
    }
  }, x = (P) => new Set(S(w(P), []).filter((N) => Number.isSafeInteger(N))), L = (P) => {
    const N = S(y(P), {}), V = {};
    for (const [G, ve] of Object.entries(N)) Number.isSafeInteger(Number(G)) && typeof ve == "number" && (V[Number(G)] = ve);
    return V;
  };
  async function O(P) {
    if (!s) {
      s = !0, o = !1;
      try {
        const N = [];
        let V = 0, G = 0;
        for (let ve = 0; ve < gI / 100 + 1; ve++) {
          const ue = await e.json(`/radio/gift/shelf?root=${encodeURIComponent(P)}&after=${V}&limit=100`);
          if (N.push(...cI(ue == null ? void 0 : ue.shelf)), G = Number(ue == null ? void 0 : ue.total) || N.length, !(ue != null && ue.next) || !Number.isSafeInteger(ue.next)) break;
          V = ue.next;
        }
        P === t && (n = N, r = G, i = e.now());
      } catch {
        o = !0;
      } finally {
        s = !1, e.changed();
      }
    }
  }
  const U = () => {
    i = -1 / 0;
  }, v = cn("input");
  v.type = "search", v.placeholder = "Search title, artist or #", v.setAttribute("aria-label", "Search your albums"), v.oninput = () => {
    a = v.value, g = ii, e.changed();
  };
  const T = cn("select");
  T.setAttribute("aria-label", "Sort albums");
  for (const P of aI) {
    const N = document.createElement("option");
    N.value = P.value, N.textContent = P.label, T.append(N);
  }
  T.onchange = () => {
    c = T.value, g = ii, e.changed();
  };
  const B = ai("", () => {
    p = !p, g = ii, e.changed();
  }, "tiny"), z = cn("div", "", "ppp-shelf-tools");
  z.append(v, T, B);
  const Q = cn("div"), W = cn("div");
  function K(P) {
    const N = P.step === "off" || P.step === "elsewhere" ? void 0 : P.root;
    if (N !== t && (t = N, n = [], r = 0, i = -1 / 0, g = ii), !N || P.walletCannotAlbums) return null;
    if (!s && e.now() - i > 5 * 6e4 && O(N), !n.length)
      return o ? (W.replaceChildren(cn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), ai("Try again", () => {
        i = -1 / 0, e.changed();
      }, "quiet")), h.replaceChildren(W), h) : null;
    const V = x(N), G = L(N), ve = uI(n, { query: a, sort: c, pinnedOnly: p, pins: V, recents: G });
    v.value !== a && (v.value = a), T.value = c, B.textContent = p ? "★ Pinned only" : "☆ Pinned only", B.setAttribute("aria-pressed", String(p));
    const ue = [];
    if (P.slot > 0 && ue.push(ai("← My player", () => e.open(0), "quiet")), !ve.length) ue.push(cn("p", "No album matches that.", "ppp-mute"));
    else {
      const Re = cn("ul", "", "ppp-shelf-list");
      for (const C of ve.slice(0, g)) {
        const k = cn("li", "", C.slot === P.slot ? "now" : ""), H = V.has(C.slot), ne = ai(H ? "★" : "☆", () => {
          const $e = new Set(V);
          H ? $e.delete(C.slot) : $e.add(C.slot), e.store.set(w(N), JSON.stringify([...$e])), e.changed();
        }, "tiny");
        ne.setAttribute("aria-label", H ? `Unpin ${C.player.title}` : `Pin ${C.player.title}`);
        const J = [C.player.subtitle, `${lr(C.player).length} ${lr(C.player).length === 1 ? "song" : "songs"}`, C.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), re = C.slot === P.slot, Ce = ai(re ? "Playing" : "Select", () => {
          e.store.set(y(N), JSON.stringify(dI({ ...G, [C.slot]: e.now() }))), e.open(C.slot);
        }, re ? "tiny ppp-pick" : "tiny primary ppp-pick");
        Ce.disabled = re;
        const de = lr(C.player)[0], me = C.player.cover ?? (de == null ? void 0 : de.id), he = me ? eh(String(me)) : "", Ke = cn("span", "", "ppp-shelf-art");
        if (he) {
          const $e = document.createElement("img");
          $e.src = he, $e.alt = "", $e.decoding = "async", Ke.append($e);
        } else Ke.textContent = "💿";
        const Lt = cn("span", "", "ppp-shelf-txt");
        Lt.append(cn("span", C.player.title, "t"), cn("span", J, "ppp-mute")), k.append(ne, Ke, Lt, Ce), Re.append(k);
      }
      ue.push(Re), ve.length > g && ue.push(ai(`Show more (${ve.length - g} left)`, () => {
        g += ii, e.changed();
      }, "quiet"));
    }
    return o && ue.push(cn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), Q.replaceChildren(...ue), h.firstChild !== z && h.replaceChildren(z, Q), h;
  }
  return { render: K, invalidate: U, count: () => r || n.length, latest: () => {
    if (!t || !n.length) return null;
    const P = L(t), N = [...n].filter((V) => V.player).sort((V, G) => (P[G.slot] ?? 0) - (P[V.slot] ?? 0) || G.slot - V.slot)[0];
    return N ? { slot: N.slot, title: N.player.title } : null;
  } };
}
const ig = "http://www.w3.org/2000/svg", wI = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function al(e = "", t = !1) {
  const n = document.createElementNS(ig, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), e && n.setAttribute("class", e);
  for (const [r, s] of wI) {
    const o = document.createElementNS(ig, "path");
    o.setAttribute("fill-rule", "evenodd"), o.setAttribute("fill", t ? "currentColor" : r), o.setAttribute("d", s), n.append(o);
  }
  return n;
}
const tt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, no = (e, t, n, r = !1) => {
  const s = tt("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, Jm = (e) => e.toLocaleString(), ag = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, mI = (e) => e === "gift" || e === "new" ? 1 : e === "arriving" ? 2 : e === "landed" ? 3 : -1;
function cl(e, t) {
  const n = tt("ol", "al-steps");
  return n.setAttribute("aria-label", t >= e.length ? "All steps done" : `Step ${t + 1} of ${e.length}: ${e[t]}`), e.forEach((r, s) => {
    const o = tt("li", s < t ? "is-done" : s === t ? "is-now" : "");
    o.append(tt("i", "", s < t ? "✓" : String(s + 1)), tt("span", "", r)), n.append(o);
  }), n;
}
function bI() {
  const e = tt("div", "tier-disc tier-disc--mid");
  return e.dataset.tier = "mystery", e.setAttribute("role", "img"), e.setAttribute("aria-label", "A player waiting to be opened"), e.append(tt("span", "tier-disc__mark", "?")), e;
}
const xI = [
  ["It pays the artist", "Each play goes straight to whoever owns the song. Nobody in the middle.", "♪"],
  ["It’s yours", "It lives on this device, opened by your face or fingerprint. No account, no password.", "◉"],
  ["Likes build your playlist", "Tap ♥ on a song and it joins your own station, in your order, saved on a public record no company can take away.", "♥"]
], jr = {
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
}, SI = (e, t, n = !1) => n ? `${t || "Xtrata Music"} has loaded it with plays. Classic, Bronze, Silver, Gold or Diamond? Claim it to find out which one is yours.` : `${t || "Xtrata Music"} has covered ${e ? `${Jm(e)} plays` : "your first plays"}. Play any song you like, and every play pays the artist.`, vI = (e) => e ? `Your player holds ${Jm(e)} plays. Play anything: each one pays the artist you’re hearing.` : "Your player is ready. Play anything: each play pays the artist you’re hearing.", AI = (e) => e ? `You got a ${e.name} player` : jr.landed.title;
function EI(e, t = !0) {
  const n = tt("div", "tier-disc" + (t ? " tier-disc--big" : ""));
  return n.dataset.tier = e.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${e.name} player`), n.append(tt("span", "tier-disc__mark", e.mark)), n;
}
function kI(e) {
  const t = document.documentElement;
  let n = !1;
  const r = () => {
    const s = tt("ul", "al-welcome-points");
    for (const [o, i, a] of xI) {
      const c = tt("li");
      c.title = i;
      const p = tt("em", "", a);
      p.setAttribute("aria-hidden", "true"), c.append(p, tt("b", "", o), tt("span", "", i)), s.append(c);
    }
    return s;
  };
  return {
    showing: () => n,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(s, o = !1) {
      var h;
      if (!s) {
        n && !o && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n = !1, delete t.dataset.welcome;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.welcome = s.mode, s.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const i = tt("header", "al-top"), a = tt("a", "al-brand");
      a.href = "/radio", a.append(al("al-logo"), tt("span", "", "Xtrata "), tt("b", "", "Music")), i.append(a);
      const c = tt("div", "al-body al-body--welcome"), p = tt("div", "al-welcome"), g = s.mode;
      if (g === "checking")
        p.append(tt("p", "al-welcome-wait", jr.checking));
      else {
        const w = mI(g);
        if (w >= 0 && p.append(cl(g === "new" ? ag.fresh : ag.gift, w)), s.tier && (g === "landed" || g === "back" || g === "empty") ? p.append(EI(s.tier)) : g === "gift" || g === "arriving" ? p.append(bI()) : g === "new" && p.append(al("al-hero-mark")), p.append(tt("h1", "", g === "landed" ? AI(s.tier) : g === "back" && s.tier ? `Your ${s.tier.name} player` : jr[g].title)), p.append(tt("p", "", g === "gift" ? SI(s.plays, s.from, s.mystery) : g === "landed" ? vI(s.plays) : jr[g].body)), (g === "landed" || g === "gift") && p.append(r()), s.status.length) {
          const y = tt("div", "al-status");
          y.setAttribute("role", "status"), y.append(...s.status), p.append(y);
        }
        if (s.asking) p.append(tt("p", "al-hint al-hint--ask", jr.asking));
        else if (g === "gift" || g === "new" || g === "back") {
          const y = jr[g];
          s.canStart && p.append(no("al-primary", y.primary, g === "back" ? s.unlock : s.start, s.busy), tt("p", "al-hint", y.hint)), s.canStart && p.append(no("al-link", y.returning, s.returning, s.busy)), p.append(no("al-link", y.full, s.full));
        } else if (g === "landed") {
          if (p.append(no("al-primary", jr.landed.primary, s.full)), (h = s.albums) != null && h.length) {
            p.append(tt("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const y of s.albums) {
              const S = no("al-album", "", y.run);
              if (y.cover) {
                const L = tt("img", "al-album__art");
                L.src = y.cover, L.alt = "", S.classList.add("al-album--art"), S.append(L);
              }
              const x = tt("span", "al-album__t");
              x.append(tt("b", "", y.title), tt("span", "", y.by)), S.append(x), p.append(S);
            }
          }
        } else g === "empty" && p.append(no("al-primary", jr.empty.primary, s.restock), no("al-link", jr.empty.full, s.full));
      }
      c.append(p), e.hidden = !1, e.replaceChildren(i, c);
    }
  };
}
const $I = 20, II = ["Album", "Passkey", "Listen"], tn = (e, t = 22, n = !1) => `<svg width="${t}" height="${t}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${e}</svg>`, Bt = {
  grid: tn('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: tn('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: tn('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: tn('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: tn('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: tn('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: tn('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: tn('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: tn('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: tn('<path d="M6 9l6 6 6-6"/>', 18),
  right: tn('<path d="M9 6l6 6-6 6"/>', 16),
  close: tn('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: tn('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: tn('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: tn('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: tn('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: tn('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function ee(e, t = {}, ...n) {
  const r = document.createElement(e);
  for (const [s, o] of Object.entries(t))
    o == null || o === !1 || (s === "class" ? r.className = String(o) : s === "html" ? r.innerHTML = String(o) : s.startsWith("on") && typeof o == "function" ? r[s.toLowerCase()] = o : s === "disabled" ? r.disabled = !!o : r.setAttribute(s, o === !0 ? "" : String(o)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const an = (e, ...t) => ee("button", { type: "button", ...e }, ...t), gc = (e) => `${Math.floor(e / 60)}:${String(Math.floor(e % 60)).padStart(2, "0")}`, ta = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`, LI = { music: "My music", device: "This device", gifts: "Albums (admin)" }, CI = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function cg(e, t, n = {}) {
  const r = !!n.list;
  let s = null, o = "", i = !1;
  const a = document.documentElement;
  function c(m) {
    var P, N, V;
    if (!m || !Number.isSafeInteger(m)) return "";
    const E = (V = (N = (P = t.radio()) == null ? void 0 : P.getState) == null ? void 0 : N.call(P)) == null ? void 0 : V.albumCover;
    return E != null && E.url && Number(E.tokenId) === m ? E.url : Cc(m);
  }
  Zf(() => K());
  function p(m) {
    var P;
    o = m, m ? a.dataset.sheet = m : delete a.dataset.sheet;
    const E = document.querySelector(".side");
    if (m && m !== "more") {
      for (const G of CI[m]) {
        const ve = E == null ? void 0 : E.querySelector(G);
        ve && (ve.open = !0);
      }
      const N = document.getElementById("sheetTitle");
      N && (N.textContent = LI[m]);
      const V = document.getElementById("sheetExtra");
      V && V.replaceChildren(...m === "music" ? [h()] : []), (P = E == null ? void 0 : E.scrollTo) == null || P.call(E, { top: 0 });
    }
    K();
  }
  const g = r ? null : document.getElementById("sheetClose");
  g && (g.onclick = () => p("")), r || document.addEventListener("keydown", (m) => {
    m.key === "Escape" && o && a.dataset.view === "album" && p("");
  });
  const h = () => an(
    { class: "al-row", onClick: () => {
      p(""), t.openPlayer();
    } },
    ee("span", { class: "al-row-i", html: Bt.radio }),
    ee("span", { class: "al-row-t" }, ee("b", {}, "Xtrata Radio"), ee("small", {}, "Every song on-chain · FM, liked, all")),
    ee("span", { class: "al-row-go", html: Bt.right })
  );
  let w = null, y = !1;
  const S = () => {
    var E;
    const m = t.radio();
    y || !(m != null && m.subscribe) || (y = !0, m.subscribe((P) => {
      w = P, (s == null ? void 0 : s.mode) === "open" && K();
    }), w = ((E = m.getState) == null ? void 0 : E.call(m)) ?? null);
  };
  r || setInterval(() => {
    var N, V;
    if ((s == null ? void 0 : s.mode) !== "open" || !(w != null && w.playing)) return;
    const m = (V = (N = t.radio()) == null ? void 0 : N.getPosition) == null ? void 0 : V.call(N), E = e.querySelector(".al-bar > i"), P = e.querySelectorAll(".al-times span");
    !m || !E || (E.style.width = m.duration ? `${Math.min(100, m.current / m.duration * 100)}%` : "0%", P.length === 2 && (P[0].textContent = gc(m.current || 0), P[1].textContent = m.duration ? gc(m.duration) : "–:––"));
  }, 500);
  let x = "", L = null;
  function O(m, E, P = {}) {
    const N = P.song || c(m.cover), G = [N ? ee("img", { src: N, alt: P.song ? "Song artwork" : `${m.title} cover` }) : ee("div", { class: "al-cover-fallback" }, ee("b", {}, m.title), m.subtitle ? ee("span", {}, m.subtitle) : null), P.paused ? ee("span", { class: "al-paused" }, ee("i", { html: Bt.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], ve = "al-cover" + (E ? "" : " al-cover--small") + (P.paused ? " is-paused" : "");
    return P.flip ? (G.push(ee("span", { class: "al-flip", "aria-hidden": "true", html: Bt.flip })), an({ class: ve + " is-flippable", "aria-label": P.flipped ? "Show this song’s artwork" : `Show the ${m.title} cover`, onClick: P.flip }, ...G)) : ee("div", { class: ve }, ...G);
  }
  function U(m) {
    return m.plays === null || m.plays === void 0 ? ee("span", { class: "al-chip al-chip--quiet" }, m.playsComing ? "Plays on their way…" : "…") : m.plays === 0 ? ee("span", { class: "al-chip al-chip--out" }, m.playsComing ? "Plays on their way…" : "No plays left") : ee("span", { class: "al-chip" + (m.plays <= $I ? " al-chip--low" : "") }, `${ta(m.plays, "play", "plays")} left`);
  }
  function v(m) {
    const E = m.player, P = E.tracks.filter((V) => !V.hidden), N = [];
    return m.step !== void 0 && N.push(cl(II, m.step)), m.mode === "arrive" && m.from && N.push(ee("p", { class: "al-from" }, ee("span", { html: Bt.gift }), ee("span", {}, ee("b", {}, m.from), " sent you an album"))), N.push(O(E, !0)), N.push(ee(
      "div",
      { class: "al-intro" },
      ee("h1", {}, E.title),
      E.subtitle ? ee("p", { class: "al-artist" }, E.subtitle) : null,
      P.length ? ee("p", { class: "al-songline" }, P.map((V) => V.title || `#${V.id}`).join(" · ")) : null,
      ee("span", { class: "al-chip" }, [ta(P.length, "song", "songs"), m.offered ? ta(m.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), m.status.length && N.push(ee("div", { class: "al-status", role: "status" }, ...m.status)), N.push(ee("div", { class: "al-grow" })), m.asking ? N.push(ee("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : m.primary && N.push(an({ class: "al-primary", onClick: m.primary.run, disabled: m.busy }, ee("span", { html: Bt.playSmall }), m.primary.label)), m.hint && !m.asking && N.push(ee("p", { class: "al-hint" }, m.hint)), m.secondary && !m.asking && N.push(an({ class: "al-link", onClick: m.secondary.run, disabled: m.busy }, m.secondary.label)), N;
  }
  function T(m, E) {
    const { songs: P, current: N, started: V, own: G, out: ve, waiting: ue } = E, Re = m.player, C = t.radio(), k = [];
    k.push(ee("div", { class: "al-listhead" }, ee("span", {}, ee("b", {}, Re.title), ` · ${ta(P.length, "song", "songs")}`), U(m)));
    const H = c(Re.cover), ne = "album:" + Re.cover;
    H && !Wt.has(ne) && (Wt.set(ne, H), Jf(H).then((re) => {
      re !== H && (Wt.set(ne, re), K());
    }));
    const J = H ? Wt.get(ne) || H : "";
    return k.push(ee("ol", { class: "al-tracks" }, ...P.map((re, Ce) => {
      const de = String(re.id) === N, me = eh(String(re.id), de && V ? G : void 0);
      return ee("li", {}, an(
        { class: "al-track" + (de ? " is-on" : ""), "aria-label": `Play ${re.title || "#" + re.id}`, "aria-current": de ? "true" : void 0, disabled: ve || ue, onClick: () => {
          var he;
          return (he = C == null ? void 0 : C.playToken) == null ? void 0 : he.call(C, re.id);
        } },
        ee(
          "span",
          { class: "al-th" + (me ? "" : " is-blank") },
          me ? ee("img", { src: me, alt: "", decoding: "async" }) : J ? ee("img", { src: J, alt: "", decoding: "async" }) : null,
          me ? null : ee("span", { class: "al-n" }, String(Ce + 1)),
          de ? ee("span", { class: "al-eq", html: Bt.eq }) : null
        ),
        ee("span", { class: "al-tt" }, re.title || `#${re.id}`, re.explicit ? ee("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), k;
  }
  function B(m) {
    var me;
    const E = m.player, P = E.tracks.filter((he) => !he.hidden), N = t.radio(), V = w == null ? void 0 : w.nowPlaying, G = V && E.tracks.some((he) => String(he.id) === String(V.tokenId)) ? String(V.tokenId) : null, ve = G ? E.tracks.find((he) => String(he.id) === G) : null, ue = m.plays === 0 && !m.playsComing, Re = !!m.playsComing && !m.plays, C = !!(w != null && w.playing) && !!G, k = w == null ? void 0 : w.heart, H = G ? (me = N == null ? void 0 : N.getPosition) == null ? void 0 : me.call(N) : null;
    G && (C || ((H == null ? void 0 : H.current) ?? 0) > 0.5) && (x = E.id);
    const ne = !!G && x === E.id;
    L && L !== G && (L = null);
    const J = ne ? String((V == null ? void 0 : V.cover) || "") : "", re = !!J && L === G, de = [O(E, !ue, { song: re ? "" : J, paused: ne && !C, flip: J ? () => {
      L = L === G ? null : G, K();
    } : void 0, flipped: re })];
    if (de.push(ee(
      "div",
      { class: "al-now" },
      ee(
        "div",
        { class: "al-now-t" },
        ee("div", { class: "al-song" }, ve ? ve.title || (V == null ? void 0 : V.title) || `#${ve.id}` : E.title),
        ee("div", { class: "al-artist" }, ve ? ve.artist || (V == null ? void 0 : V.artist) || E.subtitle : E.subtitle || "Press play")
      ),
      G ? an({ class: "al-icon" + (k != null && k.liked ? " is-on" : ""), "aria-label": k != null && k.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(k != null && k.liked)), disabled: !!(k != null && k.pending) || !!(k != null && k.locked) || Re, onClick: () => {
        var he;
        return (he = N == null ? void 0 : N.toggleLike) == null ? void 0 : he.call(N);
      }, html: k != null && k.liked ? Bt.heartOn : Bt.heart }) : null
    )), ue)
      de.push(ee(
        "div",
        { class: "al-out" },
        ee("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        ee("p", { class: "al-out-t" }, "You've played this album out"),
        ee("p", { class: "al-out-s" }, "Add plays to keep listening."),
        z(m, !0)
      ));
    else {
      const he = H != null && H.duration ? Math.min(100, H.current / H.duration * 100) : 0;
      de.push(ee(
        "div",
        { class: "al-prog" },
        ee("div", { class: "al-bar" }, ee("i", { style: `width: ${he}%` })),
        ee("div", { class: "al-times" }, ee("span", {}, gc((H == null ? void 0 : H.current) || 0)), ee("span", {}, H != null && H.duration ? gc(H.duration) : "–:––"))
      ));
    }
    return de.push(ee(
      "div",
      { class: "al-ctl" + (ue || Re ? " is-off" : "") },
      an({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: ue || Re, onClick: () => {
        var he;
        return (he = N == null ? void 0 : N.prev) == null ? void 0 : he.call(N);
      }, html: Bt.prev }),
      an({ class: "al-play", "aria-label": C ? "Pause" : "Play", disabled: ue || Re, onClick: () => {
        var he;
        return (he = N == null ? void 0 : N.playPause) == null ? void 0 : he.call(N);
      }, html: C ? Bt.pause : Bt.play }),
      an({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: ue || Re, onClick: () => {
        var he;
        return (he = N == null ? void 0 : N.next) == null ? void 0 : he.call(N);
      }, html: Bt.next })
    )), m.status.length && de.push(ee("div", { class: "al-status", role: "status" }, ...m.status)), de.push(...T(m, { songs: P, current: G, started: ne, own: J, out: ue, waiting: Re })), de.push(ee("div", { class: "al-grow" })), de.push(an(
      { class: "al-more", "aria-expanded": String(o === "more"), onClick: () => p(o === "more" ? "" : "more") },
      ee("span", {}, "More ", ee("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      ee("span", { html: Bt.down })
    )), de;
  }
  function z(m, E) {
    const P = ee("div", { class: "al-topups" + (E ? " al-topups--primary" : "") }), N = E ? [m.topUps[1] ?? m.topUps[0]] : [...m.topUps];
    for (const V of N) {
      const G = m.myPlays !== void 0 && m.myPlays >= V && !m.playsComing && !m.busy;
      P.append(an({ class: "al-topup", disabled: !G, onClick: () => t.topUp(V) }, E ? `Add ${V.toLocaleString()} plays` : `+${V.toLocaleString()}`));
    }
    return E && P.append(an({ class: "al-link", onClick: () => p("more") }, "Other amounts")), P;
  }
  function Q(m) {
    const E = m.myPlays !== void 0 && m.myPlays >= (m.topUps[0] ?? 0), P = ee(
      "div",
      { class: "al-card" },
      ee("div", { class: "al-card-h" }, ee("b", {}, `Add plays to ${m.player.title}`), ee("span", { class: "al-mono" }, m.plays === null || m.plays === void 0 ? "" : `${m.plays.toLocaleString()} left`)),
      z(m, !1),
      ee("p", { class: "al-mute al-small" }, m.playsComing ? "Plays are on their way. Add more once they arrive." : m.myPlays === void 0 ? "Checking My player…" : E ? `Moved from My player · ${ta(m.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !E && !m.playsComing && m.myPlays !== void 0 ? an({ class: "al-link", onClick: () => {
        p(""), t.openPlayer();
      } }, "Open My player") : null
    ), N = (G, ve, ue, Re) => an(
      { class: "al-row", onClick: Re },
      ee("span", { class: "al-row-i", html: G }),
      ee("span", { class: "al-row-t" }, ee("b", {}, ve), ee("small", {}, ue)),
      ee("span", { class: "al-row-go", html: Bt.right })
    ), V = ee(
      "div",
      { class: "al-how" + (i ? " is-open" : "") },
      N(Bt.info, "How plays work", "Every play counts for the song’s owner", () => {
        i = !i, K();
      }),
      i ? ee("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return ee(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      ee("div", { class: "al-sheet-h" }, ee("b", {}, "More"), an({ class: "al-icon", "aria-label": "Close", onClick: () => p(""), html: Bt.close })),
      m.mode === "open" ? P : null,
      ee(
        "div",
        { class: "al-rows" },
        N(Bt.grid, "My music", "Your albums and the radio", () => p("music")),
        N(Bt.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          p(""), t.openPlayer();
        }),
        m.canMake ? N(Bt.gift, "Albums (admin)", "Make an album and fund copies", () => p("gifts")) : null,
        N(Bt.device, "This device", "Backup, history, Stacks wallet, returns", () => p("device")),
        V
      )
    );
  }
  function W(m) {
    var ue, Re;
    const E = m.player, P = w == null ? void 0 : w.nowPlaying, N = P && E.tracks.some((C) => String(C.id) === String(P.tokenId)) ? String(P.tokenId) : null, V = !!(w != null && w.playing) && !!N, G = N ? (Re = (ue = t.radio()) == null ? void 0 : ue.getPosition) == null ? void 0 : Re.call(ue) : null;
    N && (V || ((G == null ? void 0 : G.current) ?? 0) > 0.5) && (x = E.id);
    const ve = !!N && x === E.id;
    return T(m, {
      songs: E.tracks.filter((C) => !C.hidden),
      current: N,
      started: ve,
      own: ve ? String((P == null ? void 0 : P.cover) || "") : "",
      out: m.plays === 0 && !m.playsComing,
      waiting: !!m.playsComing && !m.plays
    });
  }
  function K() {
    const m = s;
    if (r) {
      if (!m || m.mode !== "open") {
        e.hidden = !0, e.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      S(), e.hidden = !1, a.dataset.albumlist = "1", e.replaceChildren(...W(m));
      return;
    }
    if (!m) {
      e.hidden = !0, e.replaceChildren();
      return;
    }
    S(), e.hidden = !1;
    const E = ee(
      "header",
      { class: "al-top" },
      ee("a", { class: "al-brand", href: "/radio" }, al("al-logo"), "Xtrata ", ee("b", {}, "Music")),
      m.mode === "open" ? an({ class: "al-icon", "aria-label": "My music", onClick: () => p("music"), html: Bt.grid }) : null
    ), P = ee("div", { class: "al-body al-body--" + m.mode }, ...m.mode === "open" ? B(m) : v(m));
    e.replaceChildren(E, P, ...o === "more" ? [ee("div", { class: "al-scrim", onClick: () => p("") }), Q(m)] : []);
  }
  return {
    render(m) {
      if (r) {
        s = m, K();
        return;
      }
      const E = !!s;
      s = m, !m && (E || o) && (o = "", delete a.dataset.sheet), m ? a.dataset.view = "album" : delete a.dataset.view, m != null && m.asking ? a.dataset.asking = "1" : delete a.dataset.asking, K();
    },
    sheet: () => o,
    setSheet: p
  };
}
const TI = "(?:https?:\\/\\/(?:radio\\.)?xtrata\\.xyz)?", BI = (e, t) => {
  if (typeof t != "string") return null;
  const n = t.match(new RegExp(`<(?:${e})\\b[^>]*\\bsrc=["']${TI}\\/inscription\\/(\\d{1,9})["']`, "i"));
  return n ? Number(n[1]) : null;
}, MI = (e) => BI("source|audio", e), NI = 48 * 1024 * 1024;
function _I(e) {
  const t = /^data:(audio\/[^;,]+)[^,]*?(;base64)?,(.*)$/s.exec(e);
  if (!t) throw new Error("unreadable audio");
  if (!t[2]) return e;
  const n = atob(t[3].replace(/\s+/g, "")), r = new Uint8Array(n.length);
  for (let s = 0; s < n.length; s++) r[s] = n.charCodeAt(s);
  return URL.createObjectURL(new Blob([r], { type: t[1] }));
}
function PI(e) {
  const t = e.fetch ?? ((...g) => fetch(...g));
  let n = null, r = null, s = "", o = null;
  const i = (g) => {
    n = g, e.changed();
  }, a = () => {
    var g;
    if (o == null || o.abort(), o = null, r)
      try {
        r.pause(), r.removeAttribute("src"), (g = r.load) == null || g.call(r);
      } catch {
      }
    s.startsWith("blob:") && URL.revokeObjectURL(s), s = "";
  };
  async function c(g, h, w = 0) {
    var v, T, B;
    const y = "/inscription/" + g, S = await t(y, { signal: h }), x = (S.headers.get("content-type") || "").toLowerCase();
    if (!S.ok)
      throw await ((v = S.body) == null ? void 0 : v.cancel()), new Error("not found");
    if (x.startsWith("audio/"))
      return await ((T = S.body) == null ? void 0 : T.cancel()), y;
    if (!x.includes("text/html"))
      throw await ((B = S.body) == null ? void 0 : B.cancel()), new Error("not a song");
    const L = await S.text();
    if (L.length > NI) throw new Error("too large");
    const O = L.match(/<(?:source|audio)\b[^>]*\bsrc=["'](data:audio\/[^"']+)["']/i);
    if (O) return _I(O[1].replace(/&amp;/g, "&"));
    const U = w === 0 ? MI(L) : null;
    if (U) return c(Number(U), h, 1);
    throw new Error("no audio");
  }
  async function p(g) {
    var w;
    a();
    const h = o = new AbortController();
    i({ id: g, state: "loading" });
    try {
      const y = await c(g, h.signal);
      if (h.signal.aborted) {
        y.startsWith("blob:") && URL.revokeObjectURL(y);
        return;
      }
      if (s = y, r || (r = e.audio ? e.audio() : new Audio(), r.addEventListener("ended", () => {
        (n == null ? void 0 : n.state) === "playing" && (a(), i(null));
      }), r.addEventListener("error", () => {
        if ((n == null ? void 0 : n.state) === "playing") {
          const S = n.id;
          a(), i({ id: S, state: "error" });
        }
      })), (w = e.quiet) == null || w.call(e), r.src = y, await r.play(), h.signal.aborted) return;
      i({ id: g, state: "playing" });
    } catch {
      if (h.signal.aborted) return;
      a(), i({ id: g, state: "error" });
    }
  }
  return {
    state: (g) => (n == null ? void 0 : n.id) === g ? n.state : "idle",
    toggle: (g) => {
      (n == null ? void 0 : n.id) === g && n.state !== "error" ? (a(), i(null)) : p(g);
    },
    stop: () => {
      n && (a(), i(null));
    }
  };
}
const UI = ["Earned", "Claim", "Yours"], HI = ["Connect", "Link", "Name"], ut = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, nn = (e, t, n, r = !1) => {
  const s = ut("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, lg = (e, t, n, r = !1) => {
  const s = nn("al-album", "", n, r), o = ut("span", "al-album__t");
  return o.append(ut("b", "", e), ut("span", "", t)), s.append(o), s;
}, OI = (e) => `No. ${String(e).padStart(4, "0")}`, DI = (e) => e.main ? e.linked ? 2 : 1 : 0;
function FI(e) {
  const t = document.documentElement;
  let n = !1, r = "", s = null;
  const o = (i) => {
    if (s && r === i.art) return s;
    r = i.art, s = ut("div", "aw-art");
    const a = document.createElement("iframe");
    return a.src = i.art, a.title = `${i.tier.name} record. Drag to turn it.`, a.setAttribute("sandbox", "allow-scripts"), s.append(a), s;
  };
  return {
    showing: () => n,
    /** `otherActive`: an album or a welcome screen owns the mount right now, so this view only steps aside. */
    render(i, a = !1) {
      if (!i) {
        n && !a && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n && (delete t.dataset.award, r = "", s = null), n = !1;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.award = i.screen, i.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const c = ut("header", "al-top"), p = ut("a", "al-brand");
      p.href = "/radio", p.append(al("al-logo"), ut("span", "", "Xtrata "), ut("b", "", "Music")), c.append(p);
      const g = ut("div", "al-welcome"), h = i.screen, w = i.tier.name, y = typeof i.name == "string" && i.name ? i.name : null;
      if (g.append(h === "have" ? cl(HI, DI(i)) : cl(UI, h === "making" ? 2 : h === "yours" ? 3 : 1)), h === "making") {
        const U = ut("div", "tier-disc tier-disc--mid");
        U.dataset.tier = i.tier.id, U.append(ut("span", "tier-disc__mark", i.tier.mark)), g.append(U);
      } else if (h !== "have" && h !== "get") {
        const U = o(i);
        U.classList.toggle("aw-art--small", h === "name"), g.append(U);
      }
      const S = h === "ready" ? `Your ${w} record is ready` : h === "name" ? "Put your name on it?" : h === "have" ? "Use the name in your wallet" : h === "get" ? "Get a .btc name" : h === "making" ? "Making your record" : "It’s yours";
      g.append(ut("h1", "", S));
      const x = (U, v = "") => g.append(ut("p", v, U)), L = [];
      if (h === "ready")
        x(`You’ve paid artists for ${i.need.toLocaleString()} plays. That makes you an Xtrata Music Hero.`), L.push(nn("al-primary", `Claim my ${w} record`, () => i.go("name"), i.busy), ut("p", "al-hint", "Free. One tap with Face ID or your fingerprint."), nn("al-link", "Later", i.later));
      else if (h === "name")
        y ? (x(`Your record will carry ${y} beside your player’s address.`), L.push(nn("al-primary", `Claim with ${y}`, () => i.claim("auto"), i.busy), nn("al-link", "Use my address only", () => i.claim("none"), i.busy))) : i.name === null ? (x("Right now it will carry your player’s address. A .btc name makes it yours at a glance."), L.push(
          lg("I have a name in Leather or Xverse", "Connect that wallet and link your player to it", () => i.go("have"), i.busy),
          lg("I want to get a name", "Where to get one, and how to put it on your player", () => i.go("get"), i.busy),
          nn("al-primary", "Claim with my address", () => i.claim("none"), i.busy)
        )) : (x("Could not check for a .btc name just now.", "ppp-warn"), L.push(nn("al-primary", "Check again", i.refresh, i.busy), nn("al-link", "Claim with my address only", () => i.claim("none"), i.busy))), L.push(ut("p", "al-hint", "What is on the plaque cannot be changed afterwards."));
      else if (h === "have")
        i.main ? !i.linked && i.canLink ? (x(`Link this player to ${i.main}. Your plays and likes are then credited to that wallet’s name. One signature in your wallet: nothing is spent.`), L.push(nn("al-primary", "Link my player", i.link, i.busy))) : i.linked ? y ? (x(`Found it: ${y}. It goes on your plaque beside your player’s address.`), L.push(nn("al-primary", `Claim with ${y}`, () => i.claim("auto"), i.busy))) : (x(i.name === null ? `${i.main} has no primary .btc name yet. Set one in your wallet, then check again.` : "Could not check for the name just now.", i.name === null ? "" : "ppp-warn"), L.push(nn("al-primary", "Check again", i.refresh, i.busy))) : (x(`Linking is not open for ${i.main} right now. You can send a name to your player instead.`, "ppp-warn"), L.push(nn("al-primary", "Show me how", () => i.go("get"), i.busy))) : (x("Connect the Leather or Xverse wallet that holds your .btc name."), L.push(nn("al-primary", "Connect my wallet", i.connect, i.busy))), L.push(nn("al-link", "Back", () => i.go("name")));
      else if (h === "get") {
        const U = ut("ol", "aw-steps"), v = ut("li");
        v.append("Get a name at BNS One. You need a Stacks wallet (Leather or Xverse) with a little STX. ");
        const T = ut("a", "", "Open BNS One ↗");
        T.href = "https://bns.one", T.target = "_blank", T.rel = "noopener", v.append(T);
        const B = ut("li");
        B.append("Then come back and choose “I have a name in Leather or Xverse”. Or send the name to your player’s own address:", ut("span", "ppp-addr-full", i.player), i.copyAddress());
        const z = ut("li", "", "Check again, and your name shows on the preview before you claim.");
        U.append(v, B, z), g.append(U), L.push(nn("al-primary", "I have my name: check again", () => {
          i.refresh(), i.go("name");
        }, i.busy), nn("al-link", "Back", () => i.go("name")));
      } else if (h === "making") {
        if (x("It is being written to Xtrata with your plaque on it. About a minute: keep this page open and it carries on by itself."), i.claimLink) {
          const U = ut("p", "al-hint"), v = ut("a", "", "See the claim on-chain ↗");
          v.href = i.claimLink, v.target = "_blank", v.rel = "noopener", U.append(v), g.append(U);
        }
      } else if (x(`${w} record ${OI(i.number)}${i.inscription !== void 0 ? ` · Xtrata inscription #${i.inscription}` : ""}. In your player now, and yours for good.`), L.push(nn("al-primary", "See it in my player", i.done)), i.inscription !== void 0) {
        const U = ut("a", "al-link", "Open it full screen ↗");
        U.href = `/i/${i.inscription}`, U.target = "_blank", U.rel = "noopener", L.push(U);
      }
      if (i.status.length) {
        const U = ut("div", "al-status");
        U.setAttribute("role", "status"), U.append(...i.status), g.append(U);
      }
      i.asking ? g.append(ut("p", "al-hint al-hint--ask", "Continue in the box below.")) : g.append(...L);
      const O = ut("div", "al-body al-body--welcome");
      O.append(g), e.hidden = !1, e.replaceChildren(c, O);
    }
  };
}
const jI = "xtrata.xyz/music/release", RI = "Release music on Xtrata Music; no spending permission", zI = (e) => ({
  domain: Xr({ name: Mt(jI), version: Mt("1"), "chain-id": Zn(1) }),
  message: Xr({ purpose: Mt(RI), artist: Mt(e.artist), release: Mt(e.hash), issued: Zn(e.issued) })
}), be = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, xr = (e, t, n = "") => {
  const r = be("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, ug = (e) => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(e) }), dg = (e) => {
  const t = lr(e).length;
  return `${t} ${t === 1 ? "song" : "songs"}`;
};
function yc(e, t, n = "", r = "") {
  const s = be("span", "", "ppp-rel-art" + (e ? "" : " is-blank") + (r ? " " + r : "")), o = e || n;
  if (o) {
    const i = document.createElement("img");
    i.src = o, i.alt = "", i.decoding = "async", s.append(i);
  }
  return e || s.append(be("span", t)), s;
}
const Iu = (e) => !!e && Wm(e.id) && typeof e.title == "string" && Array.isArray(e.tracks) && e.tracks.length > 0 && typeof e.artist == "string";
function GI(e) {
  let t = null, n = !1, r = "", s = "";
  const o = (() => {
    try {
      const k = new URLSearchParams(location.search).get("release");
      return Wm(k) ? k : null;
    } catch {
      return null;
    }
  })();
  let i = o ? { id: o } : null;
  const a = (k) => "xtrata.radio.releases.shelf.v1:" + k;
  let c = null, p = !1, g = -1 / 0;
  const h = (k, H, ne) => {
    const J = Array.isArray(H) ? H.filter(Iu).map((re) => ({ ...re, hidden: !!re.hidden })) : [];
    c = { for: k, albums: J, fresh: ne }, ne && e.store.set(a(k), JSON.stringify(J));
  }, w = (k) => {
    try {
      h(k, JSON.parse(e.store.get(a(k)) || "[]"), !1);
    } catch {
      h(k, [], !1);
    }
  }, y = () => {
    const k = e.player().address;
    return k && (c == null ? void 0 : c.for) === k ? c.albums : [];
  };
  async function S(k, H = "") {
    const ne = e.player();
    if (!ne.address || !ne.unlocked)
      return s = "Unlock your player first.", e.changed(), !1;
    if (p) return !1;
    p = !0, s = "", e.changed();
    try {
      const J = await e.signShelf(k, H), re = await e.json("/radio/release/shelf", ug(J));
      return h(ne.address, re == null ? void 0 : re.albums, !0), !0;
    } catch (J) {
      return k !== "list" && (s = J.message || "That did not work. Try again."), !1;
    } finally {
      p = !1, e.changed();
    }
  }
  function x() {
    if (n || (n = !0, e.json("/radio/release/config").then((H) => {
      t = (H == null ? void 0 : H.enabled) === !0;
    }, () => {
      t = !1, n = !1;
    }).finally(e.changed)), !t) return;
    if (i && !i.view && !i.error) {
      const H = i;
      H.error = "", e.json("/radio/release/view?id=" + H.id).then(
        (ne) => {
          Iu(ne) ? (H.view = ne, delete H.error) : H.error = "This release could not be read.";
        },
        (ne) => {
          H.error = ne.message || "This release could not be opened right now.";
        }
      ).finally(e.changed);
    }
    const k = e.player();
    k.address && ((c == null ? void 0 : c.for) !== k.address && w(k.address), k.unlocked && !(c != null && c.fresh) && !p && e.now() - g > 6e4 && (g = e.now(), S("list")));
  }
  const L = () => t ? y().filter((k) => !k.hidden) : [];
  function O(k, H) {
    const ne = be("ol", "", "ppp-rel-songs");
    return k.forEach((J, re) => {
      const Ce = be("li");
      Ce.append(yc(e.art.song(J.id, !0) || "", String(re + 1), H), be("span", J.title)), ne.append(Ce);
    }), ne;
  }
  function U() {
    if (!t || !i || i.dismissed) return [];
    if (!i.view) return i.error ? [be("p", `♫ ${i.error}`, "ppp-warn")] : [be("p", "♫ Opening this release…", "ppp-mute")];
    const k = i.view, H = be("div", "", "ppp-release-in"), ne = be("p", "", "ppp-release-in__h");
    ne.append(be("b", k.title), be("span", `${k.subtitle || e.who(k.artist)} · ${dg(k)}`));
    const J = lr(k), re = e.art.cover(k.cover) || (k.cover ? "" : J[0] && e.art.song(J[0].id, !0) || ""), Ce = be("div", "", "ppp-rel-top");
    Ce.append(yc(re, "💿", "", "is-cover"), ne), H.append(Ce, O(J.map((Ke) => ({ id: Ke.id, title: Ke.title || `#${Ke.id}` })), e.art.cover(k.cover))), H.append(be("p", `Released by ${e.who(k.artist)}. ${k.added === 1 ? "1 player has" : `${k.added.toLocaleString()} players have`} added it.`, "ppp-mute"));
    const de = e.player(), me = y().find((Ke) => Ke.id === k.id), he = be("div", "", "ppp-award__row");
    if (me)
      H.append(be("p", "In your player ✓ It stays there until you hide or remove it.", "ppp-ok")), he.append(xr("Play it", () => e.open(k), "primary"));
    else if (!de.address) H.append(be("p", "Make your player first (above), then add this album to it. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
    else if (!de.unlocked) H.append(be("p", "Unlock your player to add this album to it.", "ppp-mute"));
    else {
      H.append(be("p", "Add it and it stays in your player. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
      const Ke = xr("Add to my player", () => {
        S("add", k.id).then((Lt) => {
          Lt && (i != null && i.view) && (i.view = { ...i.view, added: i.view.added + 1 });
        });
      }, "primary");
      Ke.disabled = p, he.append(Ke);
    }
    return he.append(xr("Not now", () => {
      i && (i.dismissed = !0), e.changed();
    }, "quiet")), H.append(he), s && H.append(be("p", s, "ppp-warn")), [H];
  }
  let v = !1;
  function T() {
    const k = t ? y() : [];
    if (!k.length) return null;
    const H = be("details", "", "ppp-release-manage");
    H.open = v, H.ontoggle = () => {
      v = H.open;
    };
    const ne = k.filter((re) => re.hidden).length;
    H.append(be("summary", `Albums I added (${k.length}${ne ? `, ${ne} hidden` : ""})`));
    const J = e.player().unlocked;
    J || H.append(be("p", "Unlock your player to hide or remove an album.", "ppp-mute"));
    for (const re of k) {
      const Ce = be("div", "", "ppp-release-row" + (re.hidden ? " is-hidden" : "")), de = be("span", "", "ppp-release-row__t");
      de.append(be("b", re.title), be("span", `${re.subtitle || e.who(re.artist)}${re.hidden ? " · hidden" : ""}`));
      const me = xr(re.hidden ? "Show" : "Hide", () => void S(re.hidden ? "show" : "hide", re.id), "tiny"), he = xr("Remove", () => void S("remove", re.id), "tiny");
      me.disabled = he.disabled = !J || p, Ce.append(de, me, he), H.append(Ce);
    }
    return H.append(be("p", "Hide keeps an album but out of sight. Remove takes it off your player; you can add it again from its link.", "ppp-mute")), s && !i && H.append(be("p", s, "ppp-warn")), H;
  }
  let B = null, z = [], Q = null;
  const W = be("input");
  W.maxLength = 60, W.placeholder = "Title of the single, EP or album", W.setAttribute("aria-label", "Release title");
  const K = be("input");
  K.maxLength = 80, K.placeholder = "Artist name shown under the title", K.setAttribute("aria-label", "Artist name");
  const m = be("input");
  m.inputMode = "numeric", m.placeholder = "Cover: an inscription number (optional; the first song’s artwork if left empty)", m.setAttribute("aria-label", "Cover inscription number");
  const E = (k) => `${location.origin}${location.pathname}?release=${k}`;
  function P(k) {
    B = { for: k, loading: !0 }, z = [], e.changed(), e.json("/radio/release/songs?wallet=" + encodeURIComponent(k)).then(
      (H) => {
        const ne = Array.isArray(H == null ? void 0 : H.songs) ? H.songs.filter((J) => Number.isSafeInteger(J == null ? void 0 : J.id) && typeof J.title == "string") : null;
        B = ne ? { for: k, songs: ne, more: !!H.more } : { for: k, error: "Your songs could not be read right now." };
      },
      (H) => {
        B = { for: k, error: H.message || "Your songs could not be read right now." };
      }
    ).finally(e.changed);
  }
  function N(k, H = !1) {
    !H && (Q == null ? void 0 : Q.for) === k && e.now() - Q.at < 6e4 || (Q = { for: k, list: (Q == null ? void 0 : Q.for) === k ? Q.list : [], at: e.now() }, e.json("/radio/release/by?artist=" + encodeURIComponent(k)).then((ne) => {
      Array.isArray(ne == null ? void 0 : ne.releases) && (Q = { for: k, list: ne.releases.filter(Iu), at: e.now() });
    }, () => {
    }).finally(e.changed));
  }
  async function V(k) {
    if (!r) {
      r = "Checking your release…", s = "", e.changed();
      try {
        const H = m.value.trim().replace(/^#/, ""), ne = Zm({ title: W.value.trim(), subtitle: K.value.trim(), tracks: [...z], cover: H ? Number(H) : null });
        r = "Sign in your wallet (nothing is spent)…", e.changed();
        const J = { artist: k, hash: Qm(ne), issued: e.now() }, re = await e.sign(k, zI(J));
        r = "Releasing…", e.changed();
        const Ce = await e.json("/radio/release/create", ug({ definition: ne, request: J, signature: re }));
        s = `${Ce.existing ? "Already released" : "Released"} ✓ “${Ce.title}”. Its link is below.`, z = [], W.value = "", m.value = "", e.audition.stop(), N(k, !0);
      } catch (H) {
        s = H.message || "Not released.";
      } finally {
        r = "", e.changed();
      }
    }
  }
  const G = () => {
    queueMicrotask(() => e.audition.stop());
  }, ve = /* @__PURE__ */ new Set();
  function ue(k) {
    const H = z.map((Te) => k.find((fn) => fn.id === Te)).filter((Te) => !!Te), ne = m.value.trim().replace(/^#/, ""), J = /^\d{1,9}$/.test(ne) ? Number(ne) : null, re = e.art.cover(J), Ce = H[0] ? e.art.song(H[0].id, !0) : null, de = be("div", "", "ppp-release-preview");
    de.append(be("p", "How it will look", "ppp-featured__h"));
    const me = be("p", "", "ppp-release-in__h"), he = be("b", W.value.trim() || "Untitled"), Ke = be("span", `${K.value.trim() || e.who(e.main())} · ${H.length} ${H.length === 1 ? "song" : "songs"}`);
    me.append(he, Ke);
    const Lt = be("div", "", "ppp-rel-top");
    Lt.append(yc(J ? re : Ce || "", "💿", "", "is-cover"), me), de.append(Lt, O(H.map((Te) => ({ id: Te.id, title: Te.title })), re));
    const $e = H.filter((Te) => e.art.song(Te.id, !0) === null).length, ct = [];
    J && !re && ct.push(`Looking for an image in #${J}… If none appears, that inscription is not a picture.`), $e && ct.push(`Finding artwork for ${$e} ${$e === 1 ? "song" : "songs"}…`), !$e && H.some((Te) => e.art.song(Te.id, !1) === "") && ct.push(`A numbered square is a song with no artwork of its own${re ? ": it shows the cover, dimmed" : ""}.`);
    for (const Te of ct) de.append(be("p", Te, "ppp-mute"));
    return W.oninput = () => {
      he.textContent = W.value.trim() || "Untitled";
    }, K.oninput = () => {
      Ke.textContent = `${K.value.trim() || e.who(e.main())} · ${H.length} ${H.length === 1 ? "song" : "songs"}`;
    }, m.onchange = () => e.changed(), de;
  }
  function Re() {
    var ne;
    const k = e.main();
    if (!t || !k)
      return B && (B = null, z = [], G()), null;
    const H = [be("p", "Put your own songs out as a single, an EP or an album. Listeners add it to their player, and every play pays you. Nothing to pay, and no money passes through Xtrata.", "ppp-mute")];
    if (B && B.for !== k && (B = null, z = [], ve.clear(), G()), !B) H.push(xr("Show the songs in my wallet", () => P(k), "primary"));
    else if (B.loading) H.push(be("p", "Reading your wallet…", "ppp-cyan"));
    else if (B.error) H.push(be("p", B.error, "ppp-warn"), xr("Try again", () => P(k)));
    else if (!B.songs.length) H.push(be("p", "No songs found in this wallet. A release is made by the wallet that holds its song masters.", "ppp-mute"));
    else {
      H.push(be("p", "Tap your songs in the order they should play. Tap one again to take it out.", "ppp-cyan"));
      const J = be("div", "", "ppp-release-songs");
      for (const de of B.songs) {
        const me = z.indexOf(de.id), he = be("div", "", "ppp-release-song" + (me >= 0 ? " is-on" : "")), Ke = e.audition.state(de.id);
        Ke !== "idle" && ve.add(de.id);
        const Lt = xr(Ke === "playing" ? "❚❚" : Ke === "loading" ? "…" : "▶", () => e.audition.toggle(de.id), "ppp-release-hear" + (Ke === "playing" ? " is-on" : ""));
        Lt.setAttribute("aria-label", Ke === "playing" ? `Stop ${de.title}` : `Listen to ${de.title}`), Lt.title = Ke === "error" ? "This song could not be played just now" : Ke === "playing" ? "Stop" : "Listen (free: it is your own song)";
        const $e = e.art.song(de.id, me >= 0 || ve.has(de.id)), ct = xr("", () => {
          z = me >= 0 ? z.filter((Te) => Te !== de.id) : [...z, de.id], e.changed();
        }, "ppp-release-pick");
        ct.setAttribute("aria-pressed", String(me >= 0)), ct.append(be("i", me >= 0 ? String(me + 1) : "+"), be("b", de.title), be("span", Ke === "error" ? "could not play" : `${de.artist ? de.artist + " · " : ""}#${de.id}`, Ke === "error" ? "ppp-warn" : "")), he.append(Lt, yc($e || "", $e === "" ? "♪" : "", ""), ct), J.append(he);
      }
      H.push(J), B.more && H.push(be("p", "This wallet holds a lot: only the first few hundred inscriptions were looked through.", "ppp-mute")), !K.value && z.length && (K.value = ((ne = B.songs.find((de) => de.id === z[0])) == null ? void 0 : ne.artist) || "");
      const re = z.length === 0 ? "release" : z.length === 1 ? "single" : z.length <= 6 ? "EP" : "album", Ce = xr(z.length ? `Sign and release this ${re} · ${z.length} ${z.length === 1 ? "song" : "songs"}` : "Pick at least one song", () => void V(k), "primary");
      Ce.disabled = !z.length || !!r, H.push(W, K, m), z.length && H.push(ue(B.songs)), H.push(Ce);
    }
    if (r && H.push(be("p", r, "ppp-cyan")), s && !i && H.push(be("p", s, /✓/.test(s) ? "ppp-ok" : "ppp-warn")), N(k), (Q == null ? void 0 : Q.for) === k && Q.list.length) {
      H.push(be("p", "Your releases", "ppp-featured__h"));
      for (const J of Q.list) {
        const re = be("div", "", "ppp-release-row"), Ce = be("span", "", "ppp-release-row__t");
        Ce.append(be("b", J.title), be("span", `${dg(J)} · added by ${J.added.toLocaleString()} ${J.added === 1 ? "player" : "players"}`)), re.append(Ce, sr("release-link:" + J.id, "Copy link", () => E(J.id), "tiny", e.changed)), H.push(re);
      }
    }
    return H;
  }
  return { sync: x, albums: L, banner: U, manage: T, fold: Re, wantsArt: () => t === !0 && (!!(i != null && i.view) && !i.dismissed || !!(B != null && B.songs) && !!e.main()), enabled: () => t === !0 };
}
const KI = [
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
function VI(e) {
  for (const [t, n] of KI) if (n.test(e)) return t;
  return null;
}
const eb = (e) => /iP(hone|ad|od)/.test(e) || /Macintosh/.test(e) && /Mobile\//.test(e), tb = (e) => /Android/.test(e);
function qI(e, t) {
  const n = new URL(e);
  return n.protocol !== "https:" ? null : eb(t) ? "x-safari-" + n.href : tb(t) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const YI = (e) => eb(e) ? "Safari" : tb(e) ? "Chrome" : "your browser", ci = "Xtrata Music Wallet", XI = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function fg(e, t = (n) => n) {
  var o, i, a;
  if (e.mainConnected ?? !!e.main) return [];
  if (e.step === "off" || e.step === "elsewhere") return [];
  if (e.gate && (e.gate.enabled === !1 || e.gate.here === !1)) return [];
  if (e.step === "unsupported")
    return ((o = e.gate) == null ? void 0 : o.passkeyOnly) || e.linked || ((i = e.others) == null ? void 0 : i.length) ? [{ action: null, label: ci, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([e.standIn, e.linked, ...e.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const p = e.standIn === c && XI.has(e.step);
    r.push({
      action: "linked",
      main: c,
      label: `${ci} · ${t(c)}`,
      detail: p ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${t(c)}.`
    });
  }
  if ((a = e.gate) != null && a.passkeyOnly && e.solo)
    switch (e.step) {
      case "intro":
        r.push({ action: "create", label: ci, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "locked":
        r.push({ action: "unlock", label: ci, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: ci, detail: "Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: ci, detail: "Open on this device." });
    }
  return r;
}
const Lu = "xtrata.radio.novice", nb = "xtrata.radio.novice.previewed.v1", hg = 6 * 6e4;
function WI(e, t) {
  let n = null;
  try {
    const r = new URLSearchParams(e).get("novice");
    if (r === "1" || r === "preview")
      t.set(Lu, r), n = r;
    else {
      if (r === "0")
        return t.set(Lu, null), { on: !1, preview: !1 };
      n = t.get(Lu);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const ZI = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, pg = (e) => ZI.test(e ?? ""), QI = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, JI = {
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
}, eL = (e, t) => JI[e] ?? t;
function tL(e, t) {
  switch (e) {
    case "fund":
      return t.arriving ? [] : [
        t.played ? "Out of plays." : "No plays yet.",
        "Tap “Add plays” to top up, or open an album someone shares with you."
      ];
    case "over":
      return ["Your player is holding more than it should, so plays are paused. Open “This device” below to send the extra back."];
    default:
      return [];
  }
}
const nL = "Make your player once, with Face ID or your fingerprint, and the music starts.", rL = "Checking your player…", Hd = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function rb(e) {
  try {
    const t = JSON.parse(e.get(nb) || "[]");
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function sL(e, t) {
  const n = rb(e).filter((r) => r !== t);
  n.push(t), e.set(nb, JSON.stringify(n.slice(-50)));
}
function Cu(e, t) {
  switch (t.kind) {
    case "offer":
      return e.album === t.album && e.phase !== "idle" ? e : { ...Hd(), album: t.album, phase: t.already ? "done" : "open" };
    case "withdraw":
      return e.phase === "idle" ? e : Hd();
    case "now":
      return e.phase === "open" && t.playing && t.track ? { ...e, phase: "playing", track: t.track, since: t.at } : e.phase === "playing" && t.track && t.track !== e.track ? { ...e, phase: "done" } : e.phase === "playing" && t.at - e.since > hg ? { ...e, phase: "done" } : e;
    case "listened":
      return e.phase !== "playing" ? e : e.heard >= 1 ? { ...e, phase: "done" } : { ...e, heard: e.heard + 1 };
    case "tick":
      return e.phase === "playing" && t.at - e.since > hg ? { ...e, phase: "done" } : e;
  }
}
const wc = (e) => e.phase === "open" || e.phase === "playing";
function oL(e = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: e.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: e.sbtc === !0 }
  ];
}
const iL = [100, 250, 500, 1e3], aL = (e, t = fr) => BigInt(e) * un(t);
function cL(e, t = fr, n = 0n) {
  const r = zr - e - n;
  return r > 0n ? Number(r / un(t)) : 0;
}
function lL(e, t = fr, n = 0n) {
  const r = e === void 0 ? 0 : cL(e, t, n);
  return iL.map((s) => ({ plays: s, stx: aL(s, t), fits: e !== void 0 && s <= r }));
}
const uL = {
  microSTX: (e) => `${e / 1000000n}.${(e % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (e) => `${e.toLocaleString("en-GB")} sats`,
  pence: (e) => `£${e / 100n}.${(e % 100n).toString().padStart(2, "0")}`
}, dL = (e) => uL[e.unit](e.amount), kt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, Tc = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`;
function fL(e) {
  if (!e || e.plays < 1) return "";
  const t = [`paid for ${Tc(e.plays, "play", "plays")}${e.artists > 0 ? ` to ${Tc(e.artists, "artist", "artists")}` : ""}`];
  return e.likes > 0 && t.push(`saved ${Tc(e.likes, "like", "likes")}`), `So far your player has ${t.join(" and ")}, all on the public record.`;
}
function hL(e) {
  let t = null, n = 0, r = "stx";
  const s = (i) => {
    var c;
    if (i.some((p) => p.plays === n && p.fits)) return;
    const a = i.filter((p) => p.fits);
    n = ((c = a.find((p) => {
      var g;
      return p.plays === ((g = i[1]) == null ? void 0 : g.plays);
    }) ?? a.at(-1)) == null ? void 0 : c.plays) ?? 0;
  };
  function o() {
    var y;
    if (!t) return;
    const i = e.input();
    if (!i) {
      t.close();
      return;
    }
    const a = lL(i.balance, i.fee, i.incoming);
    s(a);
    const c = oL(i.switches);
    (y = c.find((S) => S.id === r)) != null && y.on || (r = "stx");
    const p = [], g = kt("h2", "ppp-connect__title", "Add plays");
    g.id = "ppp-restock-title", p.push(g), p.push(kt("p", "ppp-restock__left", i.playsLeft === null ? "Checking your player…" : i.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${Tc(i.playsLeft, "play", "plays")} left.`));
    const h = fL(i.done);
    if (h && p.push(kt("p", "ppp-restock__done", h)), i.arriving)
      p.push(kt("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (i.balance === void 0)
      p.push(kt("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((S) => S.fits))
      p.push(kt("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const S = kt("div", "ppp-restock__packs");
      S.setAttribute("role", "group"), S.setAttribute("aria-label", "How many plays");
      for (const O of a) {
        const U = kt("button", "ppp-restock__pack" + (O.plays === n ? " is-on" : ""));
        U.type = "button", U.disabled = !O.fits, U.setAttribute("aria-pressed", String(O.plays === n)), U.append(kt("b", "", O.plays.toLocaleString()), kt("span", "", "plays")), U.onclick = () => {
          n = O.plays, o();
        }, S.append(U);
      }
      p.push(S);
      const x = kt("div", "ppp-restock__ways");
      x.setAttribute("role", "group"), x.setAttribute("aria-label", "How to pay");
      for (const O of c) {
        const U = kt("button", "ppp-restock__way" + (O.id === r ? " is-on" : ""));
        U.type = "button", U.disabled = !O.on, U.setAttribute("aria-pressed", String(O.id === r)), U.append(kt("b", "", O.label), kt("span", "", O.on ? O.blurb : "Soon")), U.onclick = () => {
          r = O.id, o();
        }, x.append(U);
      }
      p.push(x);
      const L = a.find((O) => O.plays === n);
      if (L && r === "stx") {
        const O = kt("div", "ppp-restock__pay"), U = dL({ unit: "microSTX", amount: L.stx }), v = kt("p", "ppp-restock__amount");
        v.append("Send ", kt("b", "", U), " to your player:"), O.append(v, kt("p", "ppp-addr-full ppp-restock__addr", i.address));
        const T = kt("div", "ppp-restock__row");
        T.append(e.copyButton("restock-address", "Copy address", () => i.address, "primary"), e.copyButton("restock-amount", "Copy amount", () => rr(L.stx), "")), O.append(T), O.append(kt("p", "ppp-restock__note", `From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: ${i.backedUp ? "your player is backed up, though larger amounts are safer in your main wallet" : "your player holds up to 1 STX"}. The plays appear here by themselves, usually within a few minutes, so you can close this.`)), p.push(O);
      }
    }
    p.push(kt("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const w = kt("button", "quiet ppp-connect__cancel", "Close");
    w.type = "button", w.onclick = () => t == null ? void 0 : t.close(), p.push(w), t.replaceChildren(...p);
  }
  return {
    isOpen: () => !!t,
    open() {
      if (t || !e.input()) return;
      t = kt("dialog", "ppp-connect ppp-restock"), t.setAttribute("aria-labelledby", "ppp-restock-title");
      const i = t;
      i.addEventListener("close", () => {
        i.remove(), t === i && (t = null);
      }), i.addEventListener("click", (a) => {
        a.target === i && i.close();
      }), document.body.appendChild(i), o(), typeof i.showModal == "function" ? i.showModal() : i.setAttribute("open", "");
    },
    /** The page redrew (a balance changed, plays landed): keep the sheet in step. */
    refresh: o,
    close() {
      t == null || t.close();
    }
  };
}
const Kr = (e) => e.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), pL = (e) => !e || /^(?:Inscription )?#\d+$/.test(e.trim());
function gL(e, t) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const s of Array.isArray(e) ? e : []) {
    const o = Number(s == null ? void 0 : s.id);
    if (!Number.isSafeInteger(o) || o < 0 || n.has(o)) continue;
    n.add(o);
    const i = t(o, { title: typeof s.title == "string" ? s.title : void 0, artist: typeof s.artist == "string" ? s.artist : void 0 });
    r.push({ id: o, title: pL(i.title) ? `#${o}` : i.title.trim(), artist: (i.artist || "").trim() });
  }
  return r.sort((s, o) => s.id - o.id);
}
function yL(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n.artist) continue;
    const r = Kr(n.artist), s = t.get(r);
    s ? s.songs++ : t.set(r, { name: n.artist, songs: 1 });
  }
  return [...t.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function wL(e, t, n = "", r = 60) {
  const s = Kr(t).split(/\s+/).filter(Boolean), o = Kr(n);
  if (!s.length && !o) return { songs: [], total: 0 };
  const i = [];
  for (const a of e) {
    const c = Kr(a.artist), p = Kr(a.title), g = String(a.id);
    if (o && c !== o) continue;
    let h = 0, w = !0;
    for (const y of s) {
      const S = y.replace(/^#/, "");
      if (p.includes(y)) h += p.startsWith(y) ? 0 : 1;
      else if (/^\d+$/.test(S) && g === S) h += 0;
      else if (c.includes(y)) h += 2;
      else if (/^\d+$/.test(S) && g.startsWith(S)) h += 3;
      else {
        w = !1;
        break;
      }
    }
    w && i.push({ s: a, rank: h });
  }
  return i.sort((a, c) => a.rank - c.rank || a.s.id - c.s.id), { songs: i.slice(0, r).map((a) => a.s), total: i.length };
}
const Kn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, gg = 12;
function mL(e, t) {
  let n = null, r = "idle", s = "", o = "", i = !1;
  const a = Kn("input", "find-q");
  a.type = "search", a.placeholder = "Search songs, artists or #", a.setAttribute("aria-label", "Search all music"), a.autocomplete = "off";
  const c = Kn("div", "hint"), p = Kn("div", "find-artists"), g = Kn("ol", "likesList find-list");
  c.setAttribute("role", "status");
  const h = Kn("div", "likesTools");
  h.append(a), e.replaceChildren(h, c, p, g), a.oninput = () => {
    s = a.value, y();
  };
  function w() {
    r === "loading" || r === "ready" || (r = "loading", y(), t.load().then((S) => {
      n = S, r = "ready", y();
    }, () => {
      r = "failed", y();
    }));
  }
  function y() {
    const S = t.locked();
    if (a.disabled = S, S) {
      c.textContent = "An album is open and plays only its own songs. Go back to My player to find other music.", p.replaceChildren(), g.replaceChildren();
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
      const T = Kn("button", "", "Try again");
      T.type = "button", T.onclick = () => {
        r = "idle", w();
      }, c.append(T), p.replaceChildren(), g.replaceChildren();
      return;
    }
    const x = yL(n), L = i ? x : x.slice(0, gg), O = (T, B, z, Q = "") => {
      const W = Kn("button", "find-chip" + (B ? " is-on" : ""), T);
      return W.type = "button", W.setAttribute("aria-pressed", String(B)), Q && (W.title = Q), W.onclick = z, W;
    };
    p.replaceChildren(
      ...L.map((T) => O(`${T.name} · ${T.songs}`, Kr(T.name) === Kr(o), () => {
        o = Kr(T.name) === Kr(o) ? "" : T.name, y();
      }, `Show ${T.name}’s ${T.songs === 1 ? "song" : `${T.songs} songs`}`)),
      ...x.length > gg ? [O(i ? "Fewer artists" : `All ${x.length} artists`, !1, () => {
        i = !i, y();
      })] : []
    );
    const U = wL(n, s, o), v = t.current();
    g.replaceChildren(...U.songs.map((T) => {
      var Q, W;
      const B = Kn("li", "lrow" + (T.id === v ? " now" : "")), z = Kn("button", "lt", T.title);
      if (z.type = "button", z.title = `Play “${T.title}”${T.artist ? ` by ${T.artist}` : ""}`, z.onclick = () => t.play(T.id), (Q = t.explicit) != null && Q.call(t, T.id)) {
        const K = Kn("span", "exp", "E");
        K.title = "Explicit lyrics: only plays when you choose it", z.append(" ", K);
      }
      if ((W = t.liked) != null && W.call(t, T.id)) {
        const K = Kn("span", "find-liked", "♥");
        K.title = "You like this song", K.setAttribute("role", "img"), K.setAttribute("aria-label", "Liked"), B.append(z, K);
      } else B.append(z);
      return B.append(Kn("span", "find-by", `${T.artist ? T.artist + " · " : ""}#${T.id}`)), B;
    })), c.textContent = !s.trim() && !o ? `${n.length.toLocaleString()} songs by ${x.length.toLocaleString()} artists. Search, or pick an artist.` : U.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : U.total > U.songs.length ? `Showing ${U.songs.length} of ${U.total.toLocaleString()}. Type more to narrow it down.` : `${U.total} ${U.total === 1 ? "song" : "songs"}${o ? ` by ${o}` : ""}. Tap one to play it.`;
  }
  return { load: w, refresh: y };
}
const da = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], mc = (e) => typeof e == "string" && da.some((t) => t.id === e), bc = (e) => da.find((t) => t.id === e), bL = (e) => da.find((t) => e >= t.min) ?? da[da.length - 1];
function xL(e, t = fr) {
  return bL(e <= jt ? 0 : Number((e - jt) / un(t)));
}
const yg = (e, t, n) => Qd(tf(new TextEncoder().encode(`xtrata-music-hero:${e}:${t}:${n}`))).slice(0, 8), wg = document.getElementById("ppp");
wg && SL(wg);
function SL(e) {
  var vn;
  const t = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = Bb(), s = (u) => e.querySelector(u), o = s(".ppp-frame");
  let i = null;
  const a = async (u, l) => {
    const f = await fetch(u, { cache: "no-store", ...l, signal: AbortSignal.timeout(15e3) }), d = await f.json().catch(() => ({}));
    if (!f.ok) throw new Error((d == null ? void 0 : d.error) || `Request failed (${f.status}).`);
    return d;
  }, c = a5({
    now: Date.now,
    main: () => {
      const u = r.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    config: (u) => a("/radio/listening-wallet/config?main=" + encodeURIComponent(u || "")),
    links: async (u) => (await a("/radio/listening-wallet/link?main=" + encodeURIComponent(u))).links ?? [],
    mainOf: async (u) => {
      var f;
      const l = (await a("/radio/listening-wallet/link?listening=" + encodeURIComponent(u))).links;
      return ((f = l == null ? void 0 : l.find((d) => d.listening === u)) == null ? void 0 : f.main) ?? null;
    },
    saveLink: async (u) => {
      await a("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(u) });
    },
    bridge: async (u) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${u}; publickey-credentials-create ${u}`), i.referrerPolicy = "no-referrer";
      const l = new Promise((D, M) => {
        i.addEventListener("load", () => D(), { once: !0 }), setTimeout(() => M(new Error("The listening wallet did not load.")), 15e3);
      });
      i.src = u + "/", o.replaceChildren(i), await l;
      const f = new vb({ walletOrigin: u, frame: i, timeoutMs: 30 * 6e4 }), d = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.backup", "listening.signAward", "listening.approveSession", "listening.prepareReturn"]), A = (D, M) => d.has(D) ? f.request(D, M) : Promise.race([
        f.request(D, M),
        new Promise((R, Z) => setTimeout(() => Z(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await A("listening.status"), { request: A };
    },
    chain: {
      verify: F6,
      balance: R6,
      account: j6,
      owner: z6,
      broadcast: G6,
      transaction: K6,
      confirmedNonce: async (u) => {
        const l = await Os(`/v2/accounts/${u}?proof=0`);
        if (!Number.isSafeInteger(l == null ? void 0 : l.nonce) || l.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(l.nonce);
      }
    },
    signWithMain: (u, l) => yu({ ...l, network: "mainnet", stxAddress: u }),
    deposit: (u, l, f) => new Promise((d, A) => B0({
      recipient: l,
      amount: f.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: u,
      network: new Tu(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (D) => d(D.txId || ""),
      onCancel: () => A(new Error("Deposit cancelled. Nothing was sent.")),
      onError: A
    })),
    validate: V6,
    tabLock: (u) => new Promise((l) => {
      const f = navigator.locks;
      if (!(f != null && f.request)) {
        l(!0);
        return;
      }
      f.request("xtrata-ppp:" + u, { ifAvailable: !0 }, async (d) => {
        l(!!d), d && await new Promise(() => {
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
      set: (u, l) => {
        try {
          localStorage.setItem(u, l);
        } catch {
        }
      }
    },
    changed: () => Xe(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (u) => {
      var l, f;
      return p.funder(u, () => Q6(u, Os), !!((f = (l = c.snapshot().gate) == null ? void 0 : l.gifts) != null && f.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (u) => {
      const l = await a("/radio/gift/for?wallet=" + encodeURIComponent(u)), f = l == null ? void 0 : l.gift;
      if (!f) return null;
      if (typeof f.returnTo != "string" || typeof f.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: f.returnTo, from: typeof f.from == "string" ? f.from : null, source: String(f.source ?? ""), amount: String(f.amount ?? "0"), treasury: f.treasury, state: f.state === "sending" ? "sending" : "arrived", player: f.player ?? null };
    },
    // Music Hero awards: a failed request throws (shown as "can't check"), it is never read as "no award" or "no plays".
    awardStatus: async (u) => {
      const l = await a("/radio/awards/status?address=" + encodeURIComponent(u));
      if (typeof (l == null ? void 0 : l.state) != "string") throw new Error("Unreadable award status.");
      return l;
    },
    awardName: async (u) => {
      const l = await a("/radio/awards/name?address=" + encodeURIComponent(u));
      if ((l == null ? void 0 : l.name) !== null && typeof (l == null ? void 0 : l.name) != "string") throw new Error("Unreadable name.");
      return l.name;
    },
    awardNote: async (u, l) => {
      const f = await a("/radio/awards/note", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: u, name: l }) });
      if (typeof (f == null ? void 0 : f.record) != "string" || typeof (f == null ? void 0 : f.signature) != "string" || !Number.isSafeInteger(f == null ? void 0 : f.cls) || !Number.isSafeInteger(f == null ? void 0 : f.number) || !Number.isSafeInteger(f == null ? void 0 : f.plays)) throw new Error("Unreadable award note.");
      return { cls: f.cls, number: f.number, plays: f.plays, record: f.record, signature: f.signature, name: typeof f.name == "string" ? f.name : null };
    },
    history: (u, l) => t5(u, (f) => Os(f), l),
    likesChanged: () => {
      var u, l;
      (l = (u = window.XtrataRadio) == null ? void 0 : u.refreshLikes) == null || l.call(u);
    },
    likeState: async (u, l) => {
      const f = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: u, ids: String(l) })), d = Array.isArray(f == null ? void 0 : f.rows) ? f.rows.find((A) => (A == null ? void 0 : A.id) === l) : null;
      if (!d || typeof d.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: d.liked, by: Array.isArray(d.by) ? d.by.filter((A) => typeof A == "string") : d.liked ? [u] : [] };
    },
    likeSent: (u, l) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: u, liked: l } })),
    nameOf: (u) => pn(u) ?? void 0,
    likeConfirmed: (u, l) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: u, liked: l } })),
    likeFailed: (u) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: u } }))
  }), p = iI({
    json: a,
    main: () => {
      const u = r.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    pay: (u, l, f, d) => new Promise((A, D) => B0({
      recipient: l,
      amount: f.toString(),
      memo: d,
      stxAddress: u,
      network: new Tu(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (M) => A(M.txId || ""),
      onCancel: () => D(new Error("Gift cancelled. Nothing was sent.")),
      onError: D
    })),
    sign: (u, l) => yu({ ...l, network: "mainnet", stxAddress: u }),
    giftSent: (u, l) => c.giftSent(u, l),
    claiming: (u) => c.giftClaiming(u),
    album: { bind: (u) => c.bindAlbum(u), arrived: async (u, l, f, d) => {
      g.invalidate(), await c.albumArriving(u, l, f, d);
    } },
    who: (u) => Me(u),
    changed: () => Xe(c.snapshot()),
    store: {
      get: (u) => {
        try {
          return localStorage.getItem(u);
        } catch {
          return null;
        }
      },
      set: (u, l) => {
        try {
          l === null ? localStorage.removeItem(u) : localStorage.setItem(u, l);
        } catch {
        }
      }
    },
    now: Date.now
  }), g = yI({
    json: a,
    open: (u) => {
      c.openAlbum(u);
    },
    store: {
      get: (u) => {
        try {
          return localStorage.getItem(u);
        } catch {
          return null;
        }
      },
      set: (u, l) => {
        try {
          l === null ? localStorage.removeItem(u) : localStorage.setItem(u, l);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => Xe(c.snapshot())
  }), h = {
    get: (u) => {
      try {
        return localStorage.getItem(u);
      } catch {
        return null;
      }
    },
    set: (u, l) => {
      try {
        l === null ? localStorage.removeItem(u) : localStorage.setItem(u, l);
      } catch {
      }
    }
  }, w = WI(location.search, h);
  w.on && (document.documentElement.dataset.novice = w.preview ? "preview" : "1");
  const y = (u) => w.on && u.solo, S = w.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), x = S ? document.getElementById("album") : null, L = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (u) => void c.topUpAlbum(u),
    openPlayer: () => void c.openAlbum(0)
  }, O = x ? cg(x, L) : null, U = GI({
    json: a,
    main: () => {
      const u = r.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    sign: (u, l) => yu({ ...l, network: "mainnet", stxAddress: u }),
    signShelf: (u, l) => c.signShelf(u, l),
    player: () => {
      const u = c.snapshot(), l = u.slot === 0 ? u.listening : u.root;
      return { address: l, unlocked: !!l && ["ready", "fund", "over", "link"].includes(u.step) };
    },
    open: (u) => rt(u, !0),
    who: (u) => Me(u),
    art: { song: (u, l) => l && eh(String(u)) || og(String(u)), cover: (u) => Cc(u) },
    audition: PI({
      changed: () => Xe(c.snapshot()),
      quiet: () => {
        var l;
        const u = window.XtrataRadio;
        try {
          (l = u == null ? void 0 : u.getState) != null && l.call(u).playing && u.playPause();
        } catch {
        }
      }
    }),
    changed: () => Xe(c.snapshot()),
    store: {
      get: (u) => {
        try {
          return localStorage.getItem(u);
        } catch {
          return null;
        }
      },
      set: (u, l) => {
        try {
          l === null ? localStorage.removeItem(u) : localStorage.setItem(u, l);
        } catch {
        }
      }
    },
    now: () => Date.now()
  }), v = () => {
    const u = new Set(sn.map((l) => l.id));
    return [...sn, ...U.albums().filter((l) => !u.has(l.id))];
  }, T = x ? FI(x) : null, B = "xtrata.radio.award.later.v1";
  let z = "ready", Q = !1, W = (() => {
    try {
      return Date.now() - Number(localStorage.getItem(B) || 0) < 24 * 36e5;
    } catch {
      return !1;
    }
  })(), K = !1;
  const m = "xtrata.radio.tier.v1";
  let E = (() => {
    const u = h.get(m);
    return mc(u) ? bc(u) : null;
  })();
  const P = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function N(u) {
    var A;
    if (u.listening && u.slot === 0 && ["fund", "ready", "over"].includes(u.step) && !(u.gift && u.gift.drop === void 0)) {
      let D = null;
      try {
        D = u.gift && !u.gift.player && u.gift.drop === "players" ? xL(BigInt(u.gift.amount)) : null;
      } catch {
        D = null;
      }
      ((A = u.award) == null ? void 0 : A.state) === "claimed" && u.award.holds === !1 && (D = null), ((D == null ? void 0 : D.id) ?? null) !== ((E == null ? void 0 : E.id) ?? null) && (E = D, h.set(m, D ? D.id : null));
    }
    const l = document.documentElement;
    E ? l.dataset.tier = E.id : delete l.dataset.tier;
    const f = document.querySelector("#ppp .ppp-head h3");
    if (!f) return;
    let d = f.querySelector(".ppp-tier");
    if (!E) {
      d == null || d.remove();
      return;
    }
    d || (d = $("span", "", "ppp-tier"), f.append(d)), d.dataset.tier = E.id, d.textContent = `${E.mark} ${E.name.toUpperCase()} PLAYER`, d.title = `A ${E.name} player from the Xtrata Music giveaway`;
  }
  const V = w.on && x ? kI(x) : null, G = Date.now();
  let ve = !1, ue = null, Re = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const C = () => {
    Re = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    Xe(c.snapshot());
  }, k = (u, l) => {
    var A;
    if (!V || l || Re) return null;
    if (!u.gate || u.step === "loading" || (ve = !0), !ve) return Date.now() - G < 1e4 ? "checking" : null;
    if (!y(u)) return null;
    if (u.step === "intro" || u.step === "unsupported") return p.incomingStarter() ? "gift" : "new";
    if (u.step === "locked") return "back";
    const d = u.slot === 0 && !((A = u.gift) != null && A.player) && !u.entries.some((D) => D.kind === "play");
    return u.step === "fund" && d ? u.depositPending ? "arriving" : "empty" : u.step === "ready" && d && (ue === "arriving" || ue === "landed") ? "landed" : u.step === "loading" && ue !== "checking" ? ue : null;
  };
  let H = !1;
  function ne(u, l, f = [], d) {
    if (!V) return;
    const A = d !== void 0 ? d : k(u, l);
    if (ue = A, delete document.documentElement.dataset.noviceBoot, !A) {
      V.render(null, l);
      return;
    }
    const D = [...f];
    A === "arriving" && u.arrival && D.push(Cn(u.arrival)), u.step === "unsupported" ? D.push($("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : u.error && D.push($("p", u.error, "ppp-warn"));
    const M = A === "gift" ? p.incomingStarter() : null;
    M && !H && u.step === "intro" && !u.busy && !u.armed && !u.error && !qt && (H = !0, c.create({ quick: !0 })), V.render({
      mode: A,
      status: D,
      asking: !!u.busy || u.armed,
      busy: !!u.busy,
      canStart: (u.step === "intro" || u.step === "locked") && !qt,
      plays: M ? M.plays : A === "landed" ? u.playsLeft : null,
      from: (M == null ? void 0 : M.from) ?? null,
      tier: E,
      mystery: P,
      albums: A === "landed" ? sn.map((R) => ({ title: R.title, by: R.subtitle, cover: Cc(R.cover), run: () => {
        C(), rt(R, !0);
      } })) : [],
      start: () => void c.create({ quick: !!p.incomingStarter() }),
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => Ce(),
      full: () => {
        var se, ce, pe;
        const R = window.XtrataRadio, Z = A === "landed" && !((ce = (se = R == null ? void 0 : R.getState) == null ? void 0 : se.call(R)) != null && ce.playing);
        C(), Z && ((pe = R == null ? void 0 : R.playPause) == null || pe.call(R));
      }
    });
  }
  V && setTimeout(() => {
    ve || Xe(c.snapshot());
  }, 10100), Zf(() => {
    (V != null && V.showing() || document.documentElement.dataset.asking || U.wantsArt()) && Xe(c.snapshot());
  });
  const re = hL({
    input: () => {
      var A, D, M, R;
      const u = c.snapshot();
      if (!["fund", "ready", "over"].includes(u.step)) return null;
      const l = u.slot === 0 ? { address: u.listening, balance: u.balance } : { address: u.root, balance: (A = u.likeFunds) == null ? void 0 : A.balance };
      if (!l.address) return null;
      const f = u.slot === 0 ? u.entries : [], d = f.filter((Z) => Z.kind === "play" && Z.status === "confirmed");
      return {
        playsLeft: l.balance === void 0 ? null : bt(l.balance),
        balance: l.balance,
        incoming: 0n,
        fee: BigInt(((D = u.gate) == null ? void 0 : D.limits.playFee) ?? "300"),
        address: l.address,
        switches: ((M = u.gate) == null ? void 0 : M.restock) ?? {},
        backedUp: u.backedUp,
        done: d.length ? { plays: d.length, artists: new Set(d.map((Z) => Z.recipient)).size, likes: f.filter((Z) => Z.kind === "like" && Z.status === "confirmed" && Z.liked).length } : null,
        arriving: u.slot === 0 ? u.depositPending : !!((R = u.likeFunds) != null && R.pending)
      };
    },
    copyButton: (u, l, f, d) => sr(u, l, f, d, () => {
      Xe(c.snapshot());
    })
  }), Ce = () => {
    if (!c.snapshot().unproven) {
      re.open();
      return;
    }
    c.prove().then((u) => {
      u && re.open();
    });
  }, de = document.getElementById("albumList"), me = de ? cg(de, L, { list: !0 }) : null, he = "xtrata.radio.album.last.v1", Ke = () => {
    try {
      const u = JSON.parse(localStorage.getItem(he) || "null");
      return u && typeof u.root == "string" && Number.isSafeInteger(u.slot) && u.slot > 0 && u.player && Array.isArray(u.player.tracks) ? u : null;
    } catch {
      return null;
    }
  };
  let Lt = "";
  const $e = (u) => {
    const l = JSON.stringify(u);
    if (l !== Lt) {
      Lt = l;
      try {
        localStorage.setItem(he, l);
      } catch {
      }
    }
  };
  let ct = null;
  window.XtrataRadioLikeHandler = (u) => {
    var f;
    if (!u || !Number.isSafeInteger(u.song) || u.song < 0) return !1;
    (f = c.snapshot().likeFunds) != null && f.album && (j = !0), Jr();
    const l = gn(u.song, { title: u.title, artist: u.artist });
    return c.heart({ song: u.song, title: l.title || void 0, artist: l.artist || void 0, likedBy: Array.isArray(u.likedBy) ? u.likedBy : void 0 });
  };
  let Te;
  window.XtrataRadioListeningIdentity = () => {
    const u = c.snapshot();
    return u.solo && u.step !== "off" && u.step !== "elsewhere" ? u.listening : void 0;
  };
  const fn = (u) => {
    var f, d;
    const l = window.XtrataRadioListeningIdentity();
    l !== Te && (Te = l, (d = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || d.call(f));
  };
  let sn = [], Ut = 0, Zt = !1, Ct = null;
  const hn = (u) => {
    var l, f;
    Zt || !((f = (l = u.gate) == null ? void 0 : l.gifts) != null && f.enabled) || Date.now() - Ut < 6e4 || (Ut = Date.now(), a("/radio/gift/featured").then((d) => {
      sn = (Array.isArray(d == null ? void 0 : d.players) ? d.players : []).filter((A) => A && typeof A.id == "string" && typeof A.title == "string" && Array.isArray(A.tracks) && A.tracks.length > 0).slice(0, 6), Zt = !0, sn.length && Xe(c.snapshot());
    }).catch(() => {
    }));
  }, Gt = (u) => {
    var l;
    return Ct && u.slot === 0 && !((l = u.gift) != null && l.player) && ["ready", "fund", "loading"].includes(u.step) ? Ct : null;
  }, rt = (u, l = !1) => {
    var d, A;
    Ct = u, Xe(c.snapshot());
    const f = u && l ? lr(u)[0] : null;
    f && ((A = (d = window.XtrataRadio) == null ? void 0 : d.playToken) == null || A.call(d, f.id));
  };
  let Ge = Hd(), Qt = null;
  const Kt = (u) => {
    const l = w.preview && !qt && u.step === "intro" ? p.incomingAlbum() : null;
    return l ? (Ge = Cu(Ge, { kind: "offer", album: l.player.id, already: rb(h).includes(l.player.id) }), wc(Ge) ? l.player : null) : (Ge = Cu(Ge, { kind: "withdraw" }), null);
  }, wt = (u) => {
    const l = Ge.phase;
    Ge = Cu(Ge, u), Ge.phase !== l && (Ge.album && (Ge.phase === "playing" || Ge.phase === "done") && sL(h, Ge.album), Xe(c.snapshot()));
  };
  setInterval(() => {
    Ge.phase === "playing" && wt({ kind: "tick", at: Date.now() });
  }, 5e3);
  let mt = "", $n, Qn = !1, I = !1;
  const q = (u, l) => {
    var pe, we, ge, b, _, F, fe, ft;
    const f = window.XtrataRadio;
    if (!(f != null && f.setGiftPlayer) || !(f != null && f.setGiftStop)) return;
    const d = l.depositPending && u.step === "fund" && ((pe = u.giftStop) == null ? void 0 : pe.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : u.giftStop, A = Qt, D = d ? y(u) ? eL(d.reason, d.text) : d.text : null, M = A ? null : D ?? (t && (!((we = u.gate) != null && we.here) || u.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    M && M !== $n && (f.setGiftStop(M), $n = M);
    const R = u.step === "off" || u.step === "elsewhere" ? null : ((ge = u.gift) == null ? void 0 : ge.player) ?? A ?? Gt(u) ?? null, Z = R ? R.id + ":" + R.cover + ":" + R.tracks.map((Tt) => Tt.id).join(",") : "";
    Z !== mt && (f.setGiftPlayer(R ? { id: R.id, title: R.title, subtitle: R.subtitle, tracks: lr(R).map((Tt) => Tt.id), hidden: ((b = rI(R)) == null ? void 0 : b.id) ?? null, cover: R.cover } : null), mt = Z), M !== $n && (f.setGiftStop(M), $n = M);
    const se = (d == null ? void 0 : d.reason) === "arriving";
    se !== I && ((_ = f.setGiftWait) == null || _.call(f, se), I = se);
    const ce = !!R && (!!A || !!((F = u.albumLock) != null && F.locked));
    ce !== Qn && ((fe = f.setGiftLock) == null || fe.call(f, ce), Qn = ce), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(u.step) && ((ft = f.forgetWallets) == null || ft.call(f));
  };
  let j = !1;
  const X = /* @__PURE__ */ new Map(), Ae = (u) => {
    if (!(u.step === "fund" && !u.depositPending && !!u.gift && !!u.listening && u.balance === 0n && !u.entries.some((d) => d.kind === "play") && (u.brandNew || u.createdHere))) return null;
    let f = X.get(u.listening);
    return f === void 0 && (f = Date.now(), X.set(u.listening, f)), Date.now() - f < rl ? f : null;
  }, Ie = (u) => u.step === "fund" && !u.depositPending && !!u.gift && u.balance === 0n && !u.entries.some((l) => l.kind === "play") && !!u.listening && X.has(u.listening), Qe = (u) => u ? u.slice(0, 6) + "…" + u.slice(-4) : "", bt = (u) => {
    const l = c.snapshot().playCost || 350n;
    return u > jt ? Number((u - jt) / l) : 0;
  }, Ye = (u) => (Number(u) / 1e6).toFixed(u < 1000n ? 6 : 4), st = (u) => {
    const l = Math.round((Date.now() - u) / 6e4);
    return l < 1 ? "now" : l < 60 ? `${l}m` : l < 1440 ? `${Math.round(l / 60)}h` : `${Math.round(l / 1440)}d`;
  }, ze = (u) => `https://explorer.hiro.so/txid/${u}?chain=mainnet`, $ = (u, l = "", f = "") => {
    const d = document.createElement(u);
    return l && (d.textContent = l), f && (d.className = f), d;
  }, oe = (u, l, f = "") => {
    const d = $("button", u, f);
    return d.type = "button", d.onclick = l, d;
  }, ye = (u, l) => {
    const f = $("a", u);
    return f.href = l, f.target = "_blank", f.rel = "noopener", f;
  };
  let Je = null, it = location.hash === "#give";
  it && history.replaceState(null, "", location.pathname + location.search);
  let Et = !1;
  const gt = G5((u) => z5({ address: u, network: "mainnet" }), () => Xe(c.snapshot())), pn = (u) => gt.get(u), qt = VI(navigator.userAgent), Zr = (u, l) => {
    const f = navigator.userAgent, d = YI(f), A = `${location.origin}${location.pathname}${l ? `#gift=${l}` : ""}`, D = [$("p", `You are in ${u}'s built-in browser, where passkeys often do not work. Open this page in ${d} to make your ${w.on ? "player" : "listening wallet"}${l ? w.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], M = $("div", "", "ppp-open-row"), R = qI(A, f);
    if (R) {
      const Z = $("a", `Open in ${d}`, "primary ppp-open-in");
      Z.href = R, Z.dataset.homeAction = "radio:open-in-browser", M.append(Z);
    }
    return M.append(sr("copy-page-link", "Copy link", () => A, R ? "" : "primary", () => Xe(c.snapshot()))), D.push(M, $("p", `If that does not open ${d}, use ${u}'s menu (••• or ⋮) and choose "Open in ${d === "your browser" ? "browser" : d}", or paste the copied link there.`, "ppp-mute")), D;
  }, Me = (u) => pn(u) ?? Qe(u), Rs = (u) => u.slice(0, 2).map(Me).join(" and ") + (u.length > 2 ? ` and ${u.length - 2} more` : ""), zs = /* @__PURE__ */ new Map();
  let Qr = !1;
  const jo = (u) => !u || /^(?:Inscription )?#\d+$/.test(u.trim()), Jr = () => {
    Qr || (Qr = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((u) => u.ok ? u.json() : null).then((u) => {
      for (const l of Array.isArray(u == null ? void 0 : u.tracks) ? u.tracks : []) {
        const f = Number(l == null ? void 0 : l.id);
        Number.isSafeInteger(f) && zs.set(f, { title: typeof l.title == "string" ? l.title : void 0, artist: typeof l.artist == "string" ? l.artist : void 0 });
      }
      Xe(c.snapshot());
    }).catch(() => {
      Qr = !1;
    }));
  }, gn = (u, l) => {
    const f = zs.get(u), d = X0(u, [f == null ? void 0 : f.title, l == null ? void 0 : l.title].find((D) => !jo(D)) || ""), A = q0(u, (f == null ? void 0 : f.artist) || (l == null ? void 0 : l.artist) || "");
    return { title: d, artist: A };
  }, Mr = (u) => {
    const { title: l, artist: f } = gn(u.song, u);
    return l ? `“${l}”${f ? ` — ${f}` : ""}` : `Song #${u.song}${f ? ` — ${f}` : ""}`;
  }, Ro = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Ri = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function zi(u) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(u.step) ? ["", ""] : u.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : u.step === "over" ? ["TOO MUCH", "bad"] : u.step === "locked" ? ["LOCKED", "mute"] : u.step === "intro" || u.step === "link" ? ["", ""] : u.step === "fund" ? u.depositPending ? ["ON ITS WAY", "warn"] : u.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : u.payingOn && u.session && u.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function Ht(u, l, f = "", d) {
    const A = $("dt", u), D = $("dd", l, f);
    return d && D.append(" ", d), [A, D];
  }
  const Yt = document.getElementById("ppp-top"), Gs = () => {
    (o.hidden || o.classList.contains("ppp-frame--rest") ? e : o).scrollIntoView({ behavior: "smooth", block: "center" }), e.classList.remove("ppp-flash"), e.offsetWidth, e.classList.add("ppp-flash");
  }, Oe = () => {
    var l;
    const u = window.XtrataRadioConnectStacks;
    u ? u() : (l = document.getElementById("radio-wallet-connect")) == null || l.click();
  }, Ot = () => {
    var l, f;
    const u = c.snapshot();
    if (u.step === "connect" || u.step === "wrong-wallet") {
      Oe();
      return;
    }
    if (u.step === "elsewhere" && ((l = u.gate) != null && l.radioUrl)) {
      location.href = u.gate.radioUrl;
      return;
    }
    if (u.step === "locked" && !u.armed && !u.busy && c.unlock(), u.step === "ready" && ((f = u.giftStop) == null ? void 0 : f.reason) === "off" && !u.busy && c.switchOn(), u.step === "fund" && u.solo && !u.depositPending && !u.busy) {
      Ce();
      return;
    }
    Gs();
  };
  Yt && (Yt.onclick = Ot);
  const es = (u, l, f, d = "") => u.standIn && !u.mainConnected ? oe(`Connect ${Me(u.standIn)} to add STX`, Oe, d) : oe(l, f, d), Ks = (u) => {
    c.useLinked(u).then(() => Gs());
  };
  let yn = null;
  const Fn = () => {
    const u = fg(c.snapshot(), Me);
    return u.length ? yn || (yn = new Promise((l) => {
      var ce;
      const f = $("dialog", "", "ppp-connect");
      f.setAttribute("aria-labelledby", "ppp-connect-title");
      let d = null;
      const A = (pe) => {
        d = pe, f.close();
      };
      f.addEventListener("close", () => {
        f.remove(), yn = null, l(d);
      }), f.addEventListener("click", (pe) => {
        pe.target === f && A(null);
      });
      const D = (pe, we, ge, b, _ = !1) => {
        const F = $("button", "", "ppp-connect__opt " + ge);
        return F.type = "button", F.disabled = _, F.onclick = b, F.append($("b", pe), $("span", we)), F;
      }, M = $("h2", "Connect", "ppp-connect__title");
      M.id = "ppp-connect-title";
      const R = u.map((pe) => D(pe.label, pe.detail, "is-music", () => {
        if (A("music"), pe.action === "linked" && pe.main) {
          Ks(pe.main);
          return;
        }
        const we = fg(c.snapshot(), Me).find((ge) => ge.action !== "linked");
        (we == null ? void 0 : we.action) === "create" ? c.create() : (we == null ? void 0 : we.action) === "unlock" && c.unlock(), Gs();
      }, !!pe.disabled)), Z = D("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => A("stacks")), se = oe("Cancel", () => A(null), "quiet ppp-connect__cancel");
      f.append(M, ...R, Z, se), document.body.appendChild(f), f.showModal(), (ce = R.find((pe) => !pe.disabled)) == null || ce.focus();
    }), yn) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = Fn;
  function In(u) {
    if (!Yt) return;
    const l = (d, A, D) => {
      Yt.hidden = !1, Yt.className = "ppp-top" + (A ? " is-" + A : ""), Yt.replaceChildren($("span", "", "dot"), document.createTextNode(d)), Yt.title = D;
    }, f = u.session ? Math.min(u.session.playsLeft, u.playsLeft) : 0;
    switch (u.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Yt.hidden = !0;
        return;
      case "elsewhere":
        return l("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        Yt.hidden = !0;
        return;
      case "intro":
        return l("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return l(`Connect ${Me(u.linked)}`, "warn", `This device's listening wallet belongs to ${Me(u.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return l("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return l("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return u.depositPending ? l("Plays on their way", "quiet", "Plays start by themselves when they land") : l(u.entries.some((d) => d.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return l("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return l("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return u.payingOn && f > 0 && !u.giftStop ? l(`${f.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : l("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const xt = document.getElementById("pppNudge"), Nr = document.getElementById("onair");
  (vn = xt == null ? void 0 : xt.querySelector("button")) == null || vn.addEventListener("click", () => Ot());
  const Vs = {
    connect: "Connect your wallet to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, Gi = {
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
  function zo(u) {
    if (u.step === "loading") return;
    const l = u.session ? Math.min(u.session.playsLeft, u.playsLeft) : 0, f = u.step === "ready" && u.payingOn && l > 0 && !u.giftStop, d = u.step === "fund" && u.depositPending, A = u.step === "elsewhere" && !t, D = f || d || A ? "" : Vs[u.step] ?? "", M = f ? "on" : A ? "free" : D ? "off" : "";
    M ? document.documentElement.dataset.ppp = M : delete document.documentElement.dataset.ppp, Nr && (Nr.hidden = !M || M === "free", Nr.querySelector(".onair-sub").textContent = f ? `${l.toLocaleString()} plays left` : "Plays off"), xt && (xt.hidden = M !== "off" && M !== "free", xt.classList.toggle("is-free", M === "free"), M === "free" ? (xt.querySelector(".nudge-t").textContent = "You’re on the free player", xt.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", xt.querySelector("button").textContent = "Get a player") : M === "off" && (xt.querySelector(".nudge-t").textContent = D, xt.querySelector(".nudge-s").textContent = y(u) ? u.step === "intro" ? nL : "" : "This radio requires a funded listening wallet with music support on.", xt.querySelector("button").textContent = Gi[u.step] ?? "Start"));
  }
  let hr = "";
  function qs(u) {
    const l = $("div", "", "ppp-pick");
    u.funderMultiple && u.returnToKind === "funder" && l.append($("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), u.returnToKind === "funder" && l.append($("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const f = $("input");
    f.type = "text", f.placeholder = "SP… address to send returns to", f.autocomplete = "off", f.spellcheck = !1, f.setAttribute("aria-label", "Address to return funds to"), f.value = hr, f.oninput = () => {
      hr = f.value;
    };
    const d = oe(u.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(f.value), hr = "";
    }, "tiny");
    return l.append(f, " ", d), u.returnToKind === "chosen" && l.append(" ", oe("Back to the funder", () => c.clearReturnAddress(), "tiny")), l;
  }
  const Ys = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Ln() {
    const u = $("p", Ys + " ", "ppp-mute");
    return u.append(ye("Xverse", "https://www.xverse.app/download"), " · ", ye("Leather", "https://leather.io/install-extension")), u;
  }
  let Go = "";
  const Ko = (u) => {
    const l = document.documentElement, f = u.solo && !u.main ? u.listening ? Qe(u.listening) : "new" : "", d = f5() ? "1" : "", A = u.standIn && !u.mainConnected ? Me(u.standIn) : "";
    `${f}|${d}|${A}` !== Go && (Go = `${f}|${d}|${A}`, f ? l.dataset.pppSolo = f : delete l.dataset.pppSolo, A ? l.dataset.pppAs = A : delete l.dataset.pppAs, d ? l.dataset.pppWalletInstalled = d : delete l.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const u of [1500, 4e3, 9e3]) setTimeout(() => Xe(c.snapshot()), u);
  function Vo(u, l = "") {
    const f = $("div", "", "ppp-topup"), d = ts(u);
    f.append($("span", "Add plays from My player: ", "ppp-mute"));
    for (const A of Lc) {
      const D = oe(`+${A.toLocaleString()}`, () => void c.topUpAlbum(A), l);
      D.disabled = d === void 0 || d < A || u.depositPending || !!u.busy, f.append(D);
    }
    return d !== void 0 && d < Lc[0] && f.append($("p", "My player needs plays first (switch to My player above).", "ppp-mute")), f;
  }
  const ts = (u) => {
    var d;
    const l = (d = u.likeFunds) == null ? void 0 : d.balance;
    if (l === void 0 || !u.playCost) return;
    const f = l - jt - 6000n;
    return f > 0n ? Number(f / u.playCost) : 0;
  };
  function Xs(u) {
    const l = u.likeFunds;
    if (!l || !l.album || !l.low && !l.pending) return [];
    if (l.low || (j = !1), l.low && !j) return [];
    const f = $("div", "", "ppp-pick ppp-lowbox");
    if (!l.low) {
      if (!l.txid) return [];
      const A = $("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return l.txid && A.append(ye("View", ze(l.txid))), f.append(A), [f];
    }
    f.append($("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), f.append($("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), f.append($("p", l.address, "ppp-addr-full"));
    const d = $("div", "", "ppp-open-row");
    if (d.append(sr("copy-likes-address", "Copy address", () => l.address, "primary", () => Xe(c.snapshot()))), l.main && !u.solo) {
      const A = zr - (l.balance ?? 0n);
      A > 0n && d.append(es(u, `Pay ${rr(A)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return f.append(d), f.append($("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [f];
  }
  const Cn = (u) => {
    const l = $("div", "", "ppp-wait");
    l.dataset.since = String(u.since), l.dataset.grace = String(u.graceMs), l.setAttribute("role", "progressbar"), l.setAttribute("aria-label", "Your plays are arriving");
    const f = $("p", "", "ppp-wait-t"), d = $("div", "", "ppp-wait-track");
    return d.append($("div", "", "ppp-wait-fill")), l.append(f, d), ns(l), l;
  };
  function ns(u) {
    const l = Number(u.dataset.since), f = Number(u.dataset.grace) || 6e4, d = Math.max(0, Date.now() - l), A = u.querySelector(".ppp-wait-fill"), D = u.querySelector(".ppp-wait-t");
    if (d < f) {
      const M = Math.ceil((f - d) / 1e3);
      A.style.width = Math.max(4, Math.min(95, d / f * 100)).toFixed(0) + "%", D.textContent = `Your plays are arriving… usually about a minute · ${M}s`, u.classList.remove("is-long"), u.setAttribute("aria-valuenow", String(Math.round(d / f * 100)));
    } else
      A.style.width = "", D.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", u.classList.add("is-long"), u.removeAttribute("aria-valuenow");
  }
  let Ws = 0;
  setInterval(() => {
    const u = document.querySelectorAll(".ppp-wait");
    if (!u.length) {
      Ws = 0;
      return;
    }
    u.forEach(ns), ++Ws % 10 === 0 && Xe(c.snapshot());
  }, 1e3);
  let _r = null;
  function qo(u) {
    if (u.step === "loading" && _r !== null) return;
    const f = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(u.step) || !!u.busy || u.armed || !!p.pendingCode() && !["ready", "fund", "over"].includes(u.step);
    f !== _r && (_r = f, f ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function Xe(u) {
    var ih, ah, ch, lh, uh, dh, fh, hh, ph, gh, yh, wh, mh, bh, xh, Sh, vh, Ah;
    if (U.sync(), ct && ["ready", "fund", "over"].includes(u.step) && !u.busy) {
      const Y = ct;
      ct = null, u.root === Y.root && u.slot !== Y.slot && c.openAlbum(Y.slot);
    }
    const l = p.inProgress(u), f = Ae(u), d = l && u.step === "fund" ? { ...u, depositPending: !0 } : f !== null ? { ...u, depositPending: !0, arrival: { since: f, graceMs: rl } } : u, A = d.error === sl;
    if (fn(), hn(u), N(u), Qt = Kt(u), q(u, d), qo(d), Ko(d), !l && p.inProgress(u)) return;
    if (In(d), zo(d), t && n && (n.hidden = !["off", "elsewhere", "loading"].includes(d.step), n.textContent = d.step === "loading" || !d.gate ? w.on ? rL : "Checking your listening wallet…" : w.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), e.hidden = d.step === "off", e.hidden) {
      ne(d, !1);
      return;
    }
    const [D, M] = zi(d), R = s(".ppp-state");
    R.textContent = D, R.className = "ppp-state" + (M ? " ppp-state--" + M : ""), R.hidden = !D;
    const Z = !!d.busy || d.armed, se = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(d.step) && (Z || !["intro", "loading"].includes(d.step));
    o.hidden = !se, o.classList.toggle("ppp-frame--rest", !Z && !Et);
    const ce = s(".ppp-frame-label");
    ce.hidden = !0;
    const pe = c5(d) ?? Je;
    Je = pe;
    const we = "xtrata.radio.ppp.heard.v1", ge = (() => {
      try {
        return localStorage.getItem(we) === "1";
      } catch {
        return !1;
      }
    })();
    if (!ge && d.entries.some((Y) => Y.kind === "play"))
      try {
        localStorage.setItem(we, "1");
      } catch {
      }
    const b = ge || d.slot > 0 && ((((ih = d.likeFunds) == null ? void 0 : ih.balance) ?? 0n) > 0n || g.count() > 1), _ = y(d), F = !_ && u5({ ...d, heard: b }, pe);
    s(".ppp-badge").hidden = !F;
    const fe = s(".ppp-steps"), ft = s(".ppp-stage");
    fe.hidden = ft.hidden = !F, pe && F && (fe.replaceChildren(..._d(d.solo).map((Y, ie) => {
      const Le = $("li", "", ie < pe.at ? "done" : ie === pe.at ? pe.blocked ? "now blocked" : "now" : "");
      return Le.append($("span", ie < pe.at ? "✓" : String(ie + 1), "n"), Y), ie === pe.at && Le.setAttribute("aria-current", "step"), Le;
    })), ft.textContent = pe.caption, ft.className = "ppp-stage " + (pe.at >= _d(d.solo).length ? "ppp-ok" : pe.blocked ? "ppp-bad" : "ppp-cyan"));
    const Tt = s(".ppp-facts"), Dt = [];
    d.main && ((ah = d.gate) != null && ah.here) && !d.solo && Dt.push(...Ht("Your wallet", Me(d.main), "ppp-addr-short"));
    const Jt = () => {
      if (!d.listening) return;
      const Y = sr("copy-listening", "Copy", () => d.listening || "", "tiny", () => Xe(c.snapshot()));
      Dt.push(...Ht(d.slot > 0 ? "Album wallet" : d.linked ? "My player (technical)" : "My player wallet", Qe(d.listening), "ppp-addr-short", Y));
    };
    if (d.linked || Jt(), d.listening && d.step !== "intro")
      if (d.linked)
        Dt.push(...Ht("Credited to", `${Me(d.linked)} · plays, likes and returns`, d.linked === d.main || d.solo ? "ppp-ok" : "ppp-warn")), Jt();
      else if (d.solo) {
        d.creditedTo && Dt.push(...Ht("Credited to", `${Me(d.creditedTo)} · plays and likes`, "ppp-ok"));
        const Y = d.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : d.returnTo ? `${Me(d.returnTo)} · ${d.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : d.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Dt.push(...Ht("Returns go to", d.gift ? Y : d.returnTo && !pn(d.returnTo) ? Y.replace(Qe(d.returnTo), d.returnTo) : Y, d.returnTo && !d.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Dt.push(...Ht("Linked to", "not linked yet", "ppp-warn"));
    if (d.linkedListening.length && ((ch = d.gate) != null && ch.here)) {
      const Y = d.linkedListening.map((ie) => Qe(ie) + (ie === d.listening ? " (this one)" : "")).join(", ");
      Dt.push(...Ht(d.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", Y, "ppp-addr-short"));
    }
    if (d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step)) {
      const Y = d.step === "fund" && d.depositPending ? "ppp-mute" : d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Dt.push(...Ht("Balance", `${rr(d.balance)} STX · about ${d.playsLeft.toLocaleString()} plays`, Y));
    }
    const os = d.entries.find((Y) => Y.kind === "play");
    os && Jr(), os && Dt.push(...Ht("Last paid song", `${Mr(os)} → ${Me(os.recipient)}`, Ro[os.status] || "")), Tt.replaceChildren(...Dt), Tt.hidden = !Dt.length;
    const Se = [], et = [], at = [], on = [], Qo = un(BigInt(((lh = d.gate) == null ? void 0 : lh.limits.playFee) ?? "300")), eo = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${rr(tl)} STX to the song holder, plus a ${rr(Qo - tl)} STX network fee.`, th = !!d.busy;
    switch (d.step) {
      case "elsewhere": {
        if (Se.push($("p", "Pay artists as you listen.")), (uh = d.gate) != null && uh.radioUrl) {
          const ie = $("p");
          ie.append(ye("Open the pay-per-play radio →", d.gate.radioUrl)), Se.push(ie);
        }
        et.push($("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (d.linked) {
          const ie = [d.linked, ...d.others];
          Se.push($("p", ie.length > 1 ? `This device has listening wallets for ${Rs(ie)}.` : `This device has a listening wallet for ${Me(d.linked)}.`)), et.push($("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), ie.slice(0, 3).forEach((Le, We) => at.push(oe(`Open ${Me(Le)}`, () => Ks(Le), We === 0 ? "primary" : "")));
        } else
          Se.push($("p", "Connect your wallet to pay artists as you listen.")), et.push($("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        Se.push($("p", `This device's listening wallet belongs to ${Me(d.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), et.push($("p", `You are connected as ${Me(d.main)}. Switch to the linked wallet to continue listening.`)), et.push($("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), at.push(oe("Switch wallet", Oe, "primary"));
        break;
      case "not-invited":
        Se.push($("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        Se.push($("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        Se.push($("p", "Every play counts for the song’s owner, on-chain.")), et.push($("p", eo)), et.push($("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), et.push($("p", d.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !d.solo && d.main && d.others.length ? (Se.push($("p", `This device already has a listening wallet for ${Rs(d.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), et.push($("p", `Otherwise, set up a new listening wallet for ${Me(d.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !d.solo && d.main && et.push($("p", `This is the listening wallet for ${Me(d.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), d.solo && et.push($("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const Y = p.liveGift();
        at.push(oe(Y ? "Claim my gift · no wallet needed" : d.solo ? "Start listening · no wallet needed" : d.others.length && d.main ? `Set up for ${Me(d.main)}` : "Start listening", () => void c.create(), "primary")), !Y && !d.solo && d.main && d.others.length && at.push(oe("Switch wallet", Oe)), !Y && d.solo && at.push(oe("I have a Stacks wallet", Oe)), at.push(oe("I already have a listening wallet", () => void c.unlock(!0))), Y && at.push(oe("Not now", () => p.setAside(), "quiet"));
        break;
      case "locked":
        d.armed || (Se.push($("p", "Locked.", "ppp-mute")), at.push(oe("Unlock", () => void c.unlock(), "primary"))), d.standIn ? on.push(oe("Use a different listening wallet", () => void Fn().then((ie) => {
          ie === "stacks" && Oe();
        }), "quiet")) : on.push(oe("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        Se.push($("p", `Link to ${Me(d.main)} · free`)), et.push($("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), et.push($("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), at.push(oe(d.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        Se.push($("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (d.depositPending ? d.arrival && Se.push(Cn(d.arrival)) : Ie(d) ? Se.push($("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (dh = d.gift) != null && dh.player ? Se.push($("p", "Out of plays · add more to keep listening", "ppp-bad")) : d.entries.length ? Se.push($("p", "No plays left · add plays to keep counting", "ppp-bad")) : Se.push($("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / Qo)).toLocaleString()} plays`)), d.entries.length && et.push($("p", "Playback is paused until your top-up confirms.")), d.payingOn && !d.entries.length && et.push($("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), l ? et.push($("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : d.depositPending ? et.push($("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : d.solo ? (et.push($("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), et.push($("p", d.listening || "", "ppp-addr-full")), d.listening && !d.depositPending && at.push(sr("copy-address", "Copy my address", () => d.listening || "", "primary", () => Xe(c.snapshot())))) : et.push($("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), d.depositPending && d.depositTxid) {
          const ie = $("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          ie.append(ye("View", ze(d.depositTxid))), Se.push(ie);
        } else d.allowance > 0n && !d.solo && !d.depositPending && at.push(es(d, `Deposit ${rr(d.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        Se.push($("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), d.phrase && (Se.push($("p", "Or back up your player. With its 24 words written down it can hold more, because a lost passkey is no longer lost money.", "ppp-mute")), at.push(oe("Back up my player · 24 words", () => void c.backup(), ""))), d.solo && !d.returnTo && (Se.push($("p", d.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), Se.push(qs(d))), (!d.solo || d.returnTo) && at.push(oe("Return excess", () => void c.returnFunds("excess"), "primary"), oe("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (d.payingOn && d.session && d.session.playsLeft > 0 && ((fh = d.giftStop) == null ? void 0 : fh.reason) !== "off") {
          const ie = Math.min(d.session.playsLeft, d.playsLeft);
          Se.push($("p", `${ie.toLocaleString()} plays left`, "ppp-ok")), et.push($("p", eo + " The heart likes or unlikes from this wallet for 0.0002 STX.")), at.push(oe("Switch off", () => void c.switchOff()));
        } else
          Se.push($("p", "Switch on music support to listen.", "ppp-mute")), at.push(oe("Switch plays on", () => void c.switchOn(), "primary"));
        d.queued && Se.push($("p", d.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${d.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), d.balanceState === "low" && Se.push($("p", "Running low on plays", "ppp-warn")), d.aboveTarget && Se.push($("p", "More than 1 STX here · backed up ✓ This player pays from this page as you listen, so keep larger amounts in your main wallet.", "ppp-mute")), d.depositPending ? Se.push($("p", "Plays on their way…", "ppp-warn")) : d.allowance > 0n && d.balanceState !== "ok" && !d.solo && at.push(es(d, `Top up ${rr(d.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (d.solo && d.listening && !d.depositPending) {
      const Y = d.step === "fund", ie = d.step === "ready" && (d.balanceState === "low" || !!d.gift && d.giftPlays <= 20);
      Y ? at.unshift(oe("Add plays", () => Ce(), "primary")) : ie ? at.push(oe("Add plays", () => Ce(), "primary")) : d.step === "ready" && on.push(oe("Add plays", () => Ce(), "quiet"));
    }
    if (d.solo && d.walletCannotSolo && et.push($("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), d.solo && ["fund", "ready"].includes(d.step) && ((d.balance ?? 0n) > 0n && d.slot === 0 && et.push(qs(d)), et.push(Ln()), d.slot === 0 && d.step === "ready" && d.entries.some((Y) => Y.kind === "play" && Y.status === "confirmed"))) {
      const Y = $("p", "New to Stacks? ", "ppp-mute");
      Y.append(ye("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), Se.push(Y);
    }
    if (d.walletOutdated && et.push($("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), d.stuck && (Se.push($("p", d.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${d.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), at.push(oe("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(d.step) && (d.returnTo || d.gift) && (d.balance ?? 0n) > 0n && on.push(oe(d.linked ? "Return all to my wallet" : d.gift ? "Return what is left…" : `Return all to ${Me(d.returnTo)}`, () => void c.returnFunds("all"), "quiet")), d.slot > 0 && ((hh = d.gift) != null && hh.player) && ["ready", "fund"].includes(d.step) && d.giftPlays > 20 && on.push(Vo(d, "quiet")), d.phrase && ["ready", "fund", "over"].includes(d.step) && on.push(oe(d.backedUp ? "Show my 24 backup words again" : "Back up my player · 24 words", () => void c.backup(), "quiet")), ["ready", "fund", "link", "over"].includes(d.step) && on.push(oe("Lock", () => void c.lock(), "quiet")), se && !Z && on.push(oe(Et ? "Hide listening wallet box" : "Show listening wallet box", () => {
      Et = !Et, Xe(c.snapshot());
    }, "quiet")), [...at, ...on].forEach((Y) => Y.disabled = th), th && (at.length = 0), !_ && d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step) && !(d.step === "fund" && d.depositPending && d.balance === 0n) && !((ph = d.gift) != null && ph.player)) {
      const Y = d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad", ie = Se.at(0);
      d.step === "ready" && ie ? ie.append($("span", ` · ${Ye(d.balance)} STX`, Y)) : Se.push($("p", `Balance ${Ye(d.balance)} STX`, Y));
    }
    if (_) {
      for (const Le of [...at, ...on]) {
        const We = QI[Le.textContent ?? ""];
        We && (Le.textContent = We);
      }
      for (let Le = Se.length - 1; Le >= 0; Le--) pg(Se[Le].textContent) && et.unshift(...Se.splice(Le, 1));
      for (let Le = at.length - 1; Le >= 0; Le--) pg(at[Le].textContent) && on.unshift(...at.splice(Le, 1));
      const Y = d.entries.some((Le) => Le.kind === "play"), ie = tL(d.step, { played: Y, arriving: d.depositPending });
      ie.length && Se.length && ie.shift(), Se.push(...ie.map((Le) => $("p", Le, "ppp-mute")));
    }
    if ((gh = d.gift) != null && gh.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(d.step)) {
      const Y = $("p", "", "ppp-gift");
      Y.append(`💿 Album · ${d.gift.player.title}`), d.gift.player.subtitle && Y.append(" · ", d.gift.player.subtitle);
      const ie = ["ready", "fund", "over"].includes(d.step) && d.balance !== void 0 ? d.giftPlays === 0 && d.depositPending ? $("span", " · plays on their way", "ppp-warn") : $("span", d.giftPlays === 0 ? " · no plays left" : ` · ${d.giftPlays.toLocaleString()} ${d.giftPlays === 1 ? "play" : "plays"} left`, d.giftPlays === 0 ? "ppp-bad" : d.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      ie && Y.append(ie);
      const Le = (yh = Se.at(0)) == null ? void 0 : yh.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (d.step === "ready" && Le && /STX/.test(Le.textContent ?? "") && Le.remove(), Se.unshift(Y), d.giftPlays <= 20 && ["ready", "fund"].includes(d.step) && !d.depositPending)
        if (d.slot > 0)
          Se.splice(1, 0, $("p", d.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), Vo(d, "primary"));
        else {
          const We = $("p", d.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          We.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), We.append(ye("Xverse", "https://www.xverse.app/download"), " and ", ye("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), Se.splice(1, 0, We);
        }
    }
    if (d.gift && !d.linked && ["fund", "ready", "over"].includes(d.step) && d.returnPlan.state === "ready") {
      const Y = d.returnPlan, ie = $("div", "", "ppp-pick");
      ie.append($("p", Y.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Le = $("ul", "", "ppp-gift-list");
      Y.steps.forEach((We, Jn) => {
        const Bn = We.kind === "gift" ? "the unused gift" : We.kind === "deposit" ? "what was added to it" : "the rest", en = $("li");
        en.append($("span", `${Jn + 1}. ${rr(BigInt(We.send))} STX · ${Bn}`, "t"), $("span", We.to ? ` → ${Me(We.to)}` : " → choose an address below", We.to ? "ppp-mute" : "ppp-warn")), Le.append(en);
      }), ie.append(Le), Y.kept && ie.append($("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), Y.steps.some((We) => !We.to) && ie.append(qs(d)), ie.append(oe(Y.steps.length > 1 ? `Confirm part 1 of ${Y.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), Se.push(ie);
    }
    const is = Yo(d), as = S ? is : null, Jo = k(d, !!as), ob = Jo === "gift" || Jo === "arriving" || Jo === "new", Ol = p.banner(u, { bare: !!as || Jo === "gift" || Jo === "arriving" }), Na = qt && (p.pendingCode() || ["intro", "locked", "unsupported"].includes(d.step)) ? Zr(qt, p.pendingCode()) : [];
    as || (Se.unshift(...Ol), Se.push(...Xs(d)), Se.unshift(...Na)), d.solo && d.creditedTo && d.listening && !["intro", "off", "elsewhere", "loading"].includes(d.step) && Se.unshift($("p", `This is ${Me(d.creditedTo)}'s listening wallet. Plays and likes count for ${Me(d.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...Se);
    const Dl = document.querySelector(".ppp-switch");
    if (Dl) {
      const Y = g.latest(), ie = d.slot > 0, Le = ["fund", "ready", "over"].includes(d.step) && (ie || !!Y);
      if (Dl.hidden = !Le, Le) {
        const We = (en, Ua, Ha, Kl) => {
          const ti = oe("", Kl, "ppp-tab");
          return ti.setAttribute("aria-pressed", String(Ha)), ti.append($("span", en, "tt"), $("span", Ua === void 0 ? "…" : `${bt(Ua).toLocaleString()} plays`, "ts")), ti.disabled = !!d.busy, ti;
        }, Jn = ie ? ((mh = (wh = d.gift) == null ? void 0 : wh.player) == null ? void 0 : mh.title) ?? "Album" : Y.title, Bn = oe("View all albums" + (g.count() > 1 ? ` (${g.count()})` : ""), () => {
          const en = document.querySelector(".ppp-shelf");
          en && (en.hidden = !1, en.open = !en.open, Bn.setAttribute("aria-expanded", String(en.open)), en.open && requestAnimationFrame(() => en.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        Bn.setAttribute("aria-expanded", String(!!((bh = document.querySelector(".ppp-shelf")) != null && bh.open))), Dl.replaceChildren(
          We("🎧 My player", ie ? (xh = d.likeFunds) == null ? void 0 : xh.balance : d.balance, !ie, () => {
            ie && c.openAlbum(0);
          }),
          We("💿 " + Jn, ie ? d.balance : void 0, ie, () => {
            !ie && Y && c.openAlbum(Y.slot);
          }),
          Bn
        );
      }
    }
    const _a = g.render(d), Pa = document.querySelector(".ppp-shelf");
    if (Pa) {
      Pa.hidden = !_a;
      const Y = Pa.querySelector("summary");
      Y && (Y.textContent = g.count() > 0 ? `♪ My albums (${g.count()})` : "♪ My albums");
      const ie = Pa.querySelector(".ppp-shelf-body");
      _a && ie && !ie.contains(_a) && ie.replaceChildren(_a);
    }
    const Vi = p.renderFold(u);
    if (s(".ppp-gifts").hidden = !Vi, Vi && !s(".ppp-gift-body").contains(Vi) && s(".ppp-gift-body").replaceChildren(Vi), Vi && it) {
      it = !1;
      const Y = s(".ppp-gifts");
      Y.open = !0, requestAnimationFrame(() => Y.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const Fl = document.querySelector("#ppp .ppp-featured");
    if (Fl) {
      const Y = v(), ie = U.manage(), Le = (Y.length > 0 || !!ie) && d.slot === 0 && !((Sh = d.gift) != null && Sh.player) && d.step === "ready";
      Fl.hidden = !Le, Le && Fl.replaceChildren(...Y.length ? [$("p", "Albums in your player", "ppp-featured__h")] : [], ...Y.map((We) => {
        const Jn = (Ct == null ? void 0 : Ct.id) === We.id, Bn = oe("", () => rt(Jn ? null : We, !Jn), "ppp-featured__a" + (Jn ? " is-on" : "")), en = lr(We).length;
        return Bn.append($("b", We.title), $("span", Jn ? "Playing now · tap to go back to the radio" : `${We.subtitle ? We.subtitle + " · " : ""}${en} ${en === 1 ? "song" : "songs"}`)), Bn.setAttribute("aria-pressed", String(Jn)), Bn.disabled = !!d.busy, Bn;
      }), ...ie ? [ie] : []);
    }
    const jl = document.querySelector("#ppp .ppp-release-in-slot");
    if (jl) {
      const Y = ["off", "elsewhere", "unsupported"].includes(d.step) ? [] : U.banner();
      jl.hidden = !Y.length, jl.replaceChildren(...Y);
    }
    const ei = document.querySelector("#ppp .ppp-release");
    if (ei) {
      const Y = ["off", "elsewhere", "unsupported"].includes(d.step) ? null : U.fold();
      if (ei.hidden = !Y, Y) {
        const ie = document.activeElement instanceof HTMLElement && ei.contains(document.activeElement) ? document.activeElement : null, Le = ((vh = ei.querySelector(".ppp-release-songs")) == null ? void 0 : vh.scrollTop) ?? 0;
        (Ah = ei.querySelector(".ppp-release-body")) == null || Ah.replaceChildren(...Y);
        const We = ei.querySelector(".ppp-release-songs");
        We && Le && (We.scrollTop = Le), ie && ie.isConnected && document.activeElement !== ie && ie.focus({ preventScroll: !0 });
      }
    }
    Qs(d);
    const Rl = document.querySelector("#ppp .ppp-yours");
    if (Rl) {
      const Y = d.solo && !!d.listening && d.slot === 0 && ["fund", "ready"].includes(d.step);
      Rl.hidden = !Y;
      const ie = Rl.querySelector(".ppp-yours-body");
      if (Y && ie && ie.getAttribute("data-for") !== d.listening) {
        ie.setAttribute("data-for", d.listening);
        const Le = (Kl, ...ti) => {
          const Eh = $("details", "", "ppp-yours-item");
          return Eh.append($("summary", Kl), ...ti), Eh;
        }, We = $("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        We.append($("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const Jn = $("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), Bn = $("p");
        Bn.append(ye("Find a name at BNS One →", "https://bns.one"));
        const en = $("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), Ua = $("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), Ha = $("p");
        Ha.append(ye("See the giveaway →", "https://xtrata.xyz/giveaway")), ie.replaceChildren(
          Le("Give your player a name", We, Jn, $("p", d.listening, "ppp-addr-full"), sr("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => Xe(c.snapshot())), Bn),
          Le("Link it to a wallet you already have", en),
          Le("Bring a friend in", Ua, Ha)
        );
      }
    }
    s(".ppp-body").replaceChildren(...et), s(".ppp-actions").replaceChildren(...at), s(".ppp-actions2").replaceChildren(...on);
    const zl = d.busy || d.message || "", nh = s(".ppp-msg"), Gl = zl && Se.some((Y) => (Y.textContent ?? "").startsWith(zl.replace(/[.✓\s]+$/, ""))) ? "" : zl, rh = !Gl && !d.error ? d.notice : A && !Gl ? d.error : "";
    nh.textContent = Gl || rh, nh.classList.toggle("is-warn", !!rh), s(".ppp-err").textContent = A ? "" : d.error;
    const ib = d.entries.filter((Y) => Y.kind === "play");
    s(".ppp-recent").hidden = !d.entries.length, s(".ppp-recent-list").replaceChildren(...ib.slice(0, 5).map((Y) => {
      const ie = $("li"), Le = Y.status === "confirmed" ? "ok" : Y.status === "failed" ? "bad" : "warn";
      return ie.append($("span", "", "d " + Le), $("span", Mr(Y), "t"), $("span", st(Y.created), "ppp-mute")), Y.txid && ie.append(ye("tx", ze(Y.txid))), ie;
    })), s(".ppp-wallets").hidden = !(Tt.childElementCount || on.length), s(".ppp-more").hidden = !et.length;
    const sh = s(".ppp-history");
    sh.hidden = !d.entries.length, d.entries.length && Jr(), sh.replaceChildren($("summary", `All activity (${d.entries.length})`), ...d.entries.slice(0, 20).map((Y) => {
      const ie = $("div", "", "ppp-row"), Le = Y.kind === "play" ? [$("span", Mr(Y), "ppp-song"), $("span", ` · ${rr(BigInt(Y.amount))} STX to ${Me(Y.recipient)}`, "ppp-mute")] : Y.kind === "like" ? [$("span", `${Y.liked ? "♥ Liked" : "Unliked"} ${Mr(Y)}`, "ppp-song"), $("span", ` · for ${d.linked ? Me(d.linked) : "this listening wallet"}`, "ppp-mute")] : [$("span", `Returned ${rr(BigInt(Y.amount))} STX`, "ppp-song"), $("span", ` to ${Me(Y.recipient)}`, "ppp-mute")];
      return ie.append(
        $("span", Ri[Y.status] || Y.status, "ppp-status " + (Ro[Y.status] || "")),
        ...Le,
        $("span", ` · ${new Date(Y.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), Y.txid && ie.append(ye("tx ↗", ze(Y.txid))), ie;
    })), O == null || O.render(as ? lt(d, as, [...Na, ...Ol]) : null), ne(d, !!as, ob ? [...Na, ...Ol] : Na, Jo), Ki(d, !!as || !!(V != null && V.showing())), Pr(d, as), re.isOpen() && re.refresh(), Wo();
    const oh = (is == null ? void 0 : is.mode) === "open" ? null : Gt(d);
    me == null || me.render((is == null ? void 0 : is.mode) === "open" ? lt(d, is, []) : oh ? { ...lt(d, { mode: "open", player: oh }, []), plays: d.balance === void 0 ? null : d.playsLeft } : null);
  }
  function Yo(u) {
    var d;
    if (["off", "elsewhere", "not-invited"].includes(u.step)) return null;
    if (u.slot > 0 && ((d = u.gift) != null && d.player) && ["fund", "ready", "over", "link", "loading"].includes(u.step))
      return u.root && $e({ root: u.root, slot: u.slot, player: u.gift.player }), { mode: "open", player: u.gift.player };
    const l = p.incomingAlbum();
    if (l) return { mode: "arrive", player: l.player, from: l.from, offered: l.plays };
    const f = Ke();
    return f && (u.step === "locked" || ct && u.step === "loading") ? { mode: "locked", player: f.player } : null;
  }
  const Zs = (u, l, f, d, A) => `/awards/${u.id}#${new URLSearchParams({ n: String(l), a: f, ...A ? { b: A } : {}, p: String(d), s: yg(O0, l, f) })}`;
  function Xo(u) {
    const l = u.award;
    return !l || !["ready", "fund", "over", "link"].includes(u.step) ? null : l.claimTx ? Q ? "making" : null : l.state === "claimed" ? Q && l.inscription !== void 0 ? "yours" : null : l.state !== "ready" || W || u.step === "link" && z !== "have" ? null : z === "making" || z === "yours" ? "ready" : z;
  }
  function Ki(u, l) {
    if (!T) return;
    const f = u.award, d = f != null && f.cls && mc(f.cls) ? bc(f.cls) : null, A = u.slot === 0 ? u.listening : u.root, D = l || !f || !d || !A || f.number === void 0 ? null : Xo(u);
    if (!D || !f || !d || !A) {
      T.render(null, l);
      return;
    }
    D === "have" && u.linked && !K && (K = !0, c.awardRefresh());
    const M = typeof f.name == "string" && f.name ? f.name : null, R = [];
    u.error && R.push($("p", u.error, "ppp-warn"));
    const Z = (se) => {
      z = se, se === "name" && (Q = !0), Xe(c.snapshot());
    };
    T.render({
      screen: D,
      tier: d,
      number: f.number,
      need: f.need ?? 0,
      player: A,
      name: f.name,
      inscription: f.inscription,
      art: D === "yours" && f.inscription !== void 0 ? `/i/${f.inscription}` : Zs(d, f.number, A, f.need ?? 0, M),
      claimLink: f.claimTx ? ze(f.claimTx) : void 0,
      status: R,
      asking: !!u.busy || u.armed,
      busy: !!u.busy,
      main: u.main ? Me(u.main) : null,
      canLink: u.step === "link",
      linked: !!u.linked,
      copyAddress: () => sr("award-player-address", "Copy my player’s address", () => A, "tiny", () => Xe(c.snapshot())),
      go: Z,
      claim: (se) => {
        Q = !0, c.claimAward(se);
      },
      refresh: () => void c.awardRefresh(),
      connect: () => {
        var se;
        return (se = document.getElementById("radio-wallet-connect")) == null ? void 0 : se.click();
      },
      link: () => void c.link(),
      later: () => {
        W = !0;
        try {
          localStorage.setItem(B, String(Date.now()));
        } catch {
        }
        Xe(c.snapshot());
      },
      done: () => {
        Q = !1, z = "ready", Xe(c.snapshot());
      }
    }, l);
  }
  function Qs(u) {
    var pe;
    const l = document.querySelector("#ppp .ppp-award");
    if (!l) return;
    const f = u.award, d = u.slot === 0 ? u.listening : u.root, A = f != null && f.cls && mc(f.cls) ? bc(f.cls) : null, D = !!f && !!A && !!d && ["ready", "fund", "over"].includes(u.step) && !(f.state === "unavailable" && f.number === void 0);
    if (l.hidden = !D, !D || !f || !A || !d) {
      l.replaceChildren();
      return;
    }
    const M = JSON.stringify([f, d, !!u.busy]);
    if (l.getAttribute("data-sig") === M) return;
    l.setAttribute("data-sig", M);
    const R = (we) => {
      const ge = $("p", "", "ppp-award__h");
      return ge.append($("b", `${A.mark} Music Hero award`), $("span", we)), ge;
    }, Z = `No. ${String(f.number ?? 0).padStart(4, "0")}`, se = (we) => {
      const ge = $("div", "", "ppp-award__art"), b = document.createElement("iframe");
      return b.src = we, b.title = `${A.name} record`, b.setAttribute("sandbox", "allow-scripts"), b.setAttribute("loading", "lazy"), ge.append(b), ge;
    }, ce = [];
    if (f.state === "claimed") {
      if (ce.push(R(`${A.name} record · ${Z}`)), f.inscription !== void 0 && ce.push(se(`/i/${f.inscription}`)), ce.push($("p", f.holds === !1 ? "You sent this record to another wallet, so your player has gone back to plain. Whoever holds it keeps a record that still names you." : f.holds === null || f.holds === void 0 ? `Yours: Xtrata inscription #${f.inscription}.` : `Yours for good: Xtrata inscription #${f.inscription}. It gives your player its ${A.name} colours.`, f.holds === !1 ? "ppp-mute" : "ppp-ok")), f.inscription !== void 0) {
        const we = $("p");
        we.append(ye("Open it full screen ↗", `/i/${f.inscription}`)), ce.push(we);
      }
      if (f.sendTx) {
        const we = $("p", "Your record is on its way to its new address. About a minute. ", "ppp-cyan");
        we.append(ye("View", ze(f.sendTx))), ce.push(we);
      } else if (f.holds === !0 && f.inscription !== void 0) {
        const we = $("details", "", "ppp-award__send"), ge = document.createElement("input");
        ge.type = "text", ge.placeholder = "SP… address to send it to", ge.autocomplete = "off", ge.spellcheck = !1, ge.setAttribute("aria-label", "Address to send your record to");
        const b = oe("Send my record…", () => void c.sendAward(ge.value), "");
        b.disabled = !!u.busy, we.append(
          $("summary", "Send this record to someone"),
          $("p", "It is yours to give or sell. Whoever holds it keeps a record that still names you, and your player goes back to plain without it. This cannot be undone.", "ppp-mute"),
          ge,
          b
        ), ce.push(we);
      }
    } else if (f.claimTx) {
      ce.push(R(`${A.name} record · ${Z}`));
      const we = $("p", "Your record is being made: written to Xtrata with your plaque on it. About a minute. ", "ppp-cyan");
      we.append(ye("View", ze(f.claimTx))), ce.push(we);
    } else if (f.state === "ready") {
      ce.push(R(`${A.name} record · ${Z}`));
      const we = typeof f.name == "string" && f.name ? f.name : null, ge = new URLSearchParams({ n: String(f.number), a: d, ...we ? { b: we } : {}, p: String(f.need), s: yg(O0, f.number, d) });
      ce.push(se(`/awards/${A.id}#${ge}`)), ce.push($("p", `Your ${A.name} record is ready. You have paid artists for ${(pe = f.need) == null ? void 0 : pe.toLocaleString()} plays: that makes you an Xtrata Music Hero.`));
      const b = $("div", "", "ppp-award__row");
      we ? (ce.push($("p", `Its plaque will carry ${we} beside your player’s address. What is on it cannot be changed afterwards.`, "ppp-mute")), b.append(oe("Claim my record", () => {
        Q = !0, c.claimAward("auto");
      }, "primary"), oe("Use my address only", () => {
        Q = !0, c.claimAward("none");
      }, "quiet"))) : f.name === null ? (ce.push($("p", "Its plaque will carry your player’s address. Want a .btc name on it? Link a wallet that has one (see “Make it yours” below), then check again. What is on it cannot be changed afterwards.", "ppp-mute")), b.append(oe("Claim my record", () => {
        Q = !0, c.claimAward("none");
      }, "primary"), oe("Check for a name again", () => void c.awardRefresh(), "quiet"))) : (ce.push($("p", "Could not check for a .btc name just now. Check again, or claim with your player’s address alone.", "ppp-warn")), b.append(oe("Check for a name again", () => void c.awardRefresh(), "primary"), oe("Claim with my address only", () => void c.claimAward("none"), "quiet"))), b.querySelectorAll("button").forEach((_) => {
        _.disabled = !!u.busy;
      }), ce.push(b, $("p", "Free to claim: your player pays only a tiny network fee.", "ppp-mute"));
    } else if (f.state === "earning" && f.have !== void 0 && f.need) {
      ce.push(R(`${f.have.toLocaleString()} of ${f.need.toLocaleString()} paid plays`));
      const we = $("div", "", "ppp-award__bar"), ge = document.createElement("i");
      ge.style.width = `${Math.min(100, Math.round(f.have / f.need * 100))}%`, we.append(ge);
      const b = f.need - f.have;
      ce.push(we, $("p", `${b.toLocaleString()} more ${b === 1 ? "play" : "plays"} and your ${A.name} record is yours to claim.`, "ppp-mute"));
    } else
      ce.push(R(`${A.name} record · ${Z}`)), ce.push($("p", f.state === "paused" ? "Claiming is paused for a moment. Your record is safe: try again later." : f.state === "class-full" || f.state === "not-open" ? "Claiming is not open for this record right now." : "Can’t check your award right now. Your plays still count: this updates by itself.", "ppp-mute"));
    l.replaceChildren(...ce);
  }
  function Pr(u, l) {
    var R;
    const f = document.querySelector(".ppp-skin");
    if (!f) return;
    if (!l && (T != null && T.showing()) && ((R = u.award) != null && R.cls) && mc(u.award.cls) && (u.busy || u.armed)) {
      const Z = bc(u.award.cls), se = $("span", "", "ppp-skin__t");
      se.append($("b", `${Z.name} record · No. ${String(u.award.number ?? 0).padStart(4, "0")}`), $("span", "Xtrata Music Hero")), f.hidden = !1, f.replaceChildren($("span", Z.mark, "ppp-skin__art ppp-skin__art--none"), se);
      return;
    }
    const d = !!l && (!!u.busy || u.armed);
    if (f.hidden = !d, !d || !l) {
      f.replaceChildren();
      return;
    }
    const A = Cc(l.player.cover), D = A ? $("img", "", "ppp-skin__art") : $("span", "♪", "ppp-skin__art ppp-skin__art--none");
    A && (D.src = A, D.alt = "");
    const M = $("span", "", "ppp-skin__t");
    M.append($("b", l.player.title), $("span", l.mode === "arrive" && l.from ? `A gift from ${l.from}` : l.player.subtitle || "Your album")), f.replaceChildren(D, M);
  }
  function lt(u, l, f) {
    var Z, se, ce, pe, we;
    const d = !!u.busy || u.armed, A = [...f];
    u.depositPending && u.arrival && A.push(Cn(u.arrival)), u.error ? A.push($("p", u.error, u.error === sl ? "ppp-warn" : "ppp-bad")) : u.message && !d ? A.push($("p", u.message, "ppp-cyan")) : u.notice && A.push($("p", u.notice, "ppp-warn")), l.mode === "open" && j && ((Z = u.likeFunds) != null && Z.album) && u.likeFunds.low && !u.likeFunds.pending && A.push($("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let D = "Kept on this device with Face ID or your passkey. No app or account needed.", M = null, R = null;
    if (l.mode === "locked")
      M = { label: "Continue listening", run: () => {
        ct = Ke(), c.unlock();
      } }, R = { label: "Use a different passkey", run: () => {
        ct = null, c.unlock(!0);
      } };
    else if (l.mode === "arrive")
      if (u.step === "intro" && wc(Ge) && Ge.album === l.player.id) {
        const ge = window.XtrataRadio, b = lr(l.player)[0], _ = Ge.phase === "playing";
        M = { label: _ && !!((ce = (se = ge == null ? void 0 : ge.getState) == null ? void 0 : se.call(ge)) != null && ce.playing) ? "Pause" : _ ? "Carry on" : "Play the first song", run: () => {
          var fe, ft;
          _ ? (fe = ge == null ? void 0 : ge.playPause) == null || fe.call(ge) : b && ((ft = ge == null ? void 0 : ge.playToken) == null || ft.call(ge, b.id));
        } }, R = { label: "Make my player and hear it all", run: () => void c.create() }, D = "The first song is free. Nothing to set up yet.";
      } else if (u.step === "intro") {
        const ge = Ge.phase === "done" && Ge.album === l.player.id;
        ge && !A.length && A.push($("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), M = { label: ge ? "Keep listening" : "Open album", run: () => void c.create() }, R = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else u.step === "locked" ? (M = { label: "Open album", run: () => void c.unlock() }, R = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : u.step === "unsupported" ? A.push($("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : A.length || A.push($("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: l.mode,
      player: l.player,
      from: l.from,
      offered: l.offered,
      // A newcomer opening a gifted album: where they are, as three lights. Not for someone who already has a player.
      step: l.mode === "arrive" && u.step === "intro" ? 1 : void 0,
      plays: l.mode === "open" ? u.balance === void 0 ? null : u.giftPlays : void 0,
      playsComing: u.depositPending,
      status: A,
      primary: M,
      secondary: R,
      hint: M ? D : void 0,
      asking: d,
      busy: !!u.busy,
      myPlays: ts(u),
      topUps: Lc,
      canMake: !!((we = (pe = u.gate) == null ? void 0 : pe.gifts) != null && we.admin)
    };
  }
  const Tn = document.getElementById("findBox"), jn = document.getElementById("findBody"), Rn = Tn && jn ? mL(jn, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((u) => u.ok ? u.json() : Promise.reject(new Error("catalogue unavailable"))).then((u) => gL(u == null ? void 0 : u.tracks, (l, f) => ({ title: X0(l, jo(f.title) ? "" : f.title), artist: q0(l, f.artist || "") }))),
    play: (u) => {
      var l, f;
      (f = (l = window.XtrataRadio) == null ? void 0 : l.playToken) == null || f.call(l, u);
    },
    current: () => {
      var l, f, d, A;
      const u = Number((A = (d = (f = (l = window.XtrataRadio) == null ? void 0 : l.getState) == null ? void 0 : f.call(l)) == null ? void 0 : d.nowPlaying) == null ? void 0 : A.tokenId);
      return Number.isSafeInteger(u) ? u : null;
    },
    locked: () => {
      var u;
      return !!((u = c.snapshot().albumLock) != null && u.locked);
    },
    explicit: (u) => {
      var l, f;
      return !!((f = (l = window.XtrataRadio) == null ? void 0 : l.isExplicit) != null && f.call(l, u));
    },
    liked: (u) => Ur().has(u)
  }) : null;
  Tn == null || Tn.addEventListener("toggle", () => {
    Tn.open && (Rn == null || Rn.load());
  });
  let rs = "";
  const Ur = () => {
    var l, f, d;
    const u = (d = (f = (l = window.XtrataRadio) == null ? void 0 : l.getState) == null ? void 0 : f.call(l)) == null ? void 0 : d.likes;
    return new Set(Array.isArray(u) ? u.map((A) => Number(A == null ? void 0 : A.tokenId)).filter(Number.isSafeInteger) : []);
  }, Wo = () => {
    var l, f, d, A, D;
    if (!Rn || !(Tn != null && Tn.open)) return;
    const u = `${!!((l = c.snapshot().albumLock) != null && l.locked)}|${((D = (A = (d = (f = window.XtrataRadio) == null ? void 0 : f.getState) == null ? void 0 : d.call(f)) == null ? void 0 : A.nowPlaying) == null ? void 0 : D.tokenId) ?? ""}|${[...Ur()].sort((M, R) => M - R).join(",")}`;
    u !== rs && (rs = u, Rn.refresh());
  }, ss = /* @__PURE__ */ new Map();
  let Zo = !1;
  const Js = () => {
    const u = window.XtrataRadio;
    return u != null && u.subscribe ? (u.subscribe((l) => {
      const f = l == null ? void 0 : l.nowPlaying;
      if (f && Number.isSafeInteger(Number(f.tokenId)) && ss.set(Number(f.tokenId), { title: f.title || void 0, artist: f.artist || void 0 }), Wo(), wc(Ge)) {
        const d = !!(l != null && l.playing);
        wt({ kind: "now", track: f && f.tokenId != null ? String(f.tokenId) : null, playing: d, at: Date.now() }), d !== Zo && (Zo = d, Xe(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!Js()) {
    const u = setInterval(() => {
      Js() && clearInterval(u);
    }, 500);
    setTimeout(() => clearInterval(u), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (u) => {
    const l = u.detail;
    if (wc(Ge) && wt({ kind: "listened", at: Date.now() }), l && Number.isSafeInteger(l.song) && typeof l.id == "string" && /^[0-9a-f]{32}$/.test(l.id)) {
      Jr();
      const f = gn(l.song, ss.get(l.song));
      c.onListened({ song: l.song, id: l.id, title: f.title || void 0, artist: f.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (t || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const vL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", AL = () => {
  const e = !!window.chrome, t = window.navigator, n = t.vendor, r = typeof window.opr < "u", s = t.userAgent.includes("Edge"), o = /CriOS/.exec(t.userAgent), i = t.userAgent.includes("Mobile");
  return o ? !1 : e !== null && typeof e < "u" && n === "Google Inc." && r === !1 && s === !1 && i === !1;
}, EL = () => AL() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, kL = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, $L = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', sb = class {
  constructor(e) {
    ek(this, e), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(e) {
    this.persistSelection && xv(e), this.callback(vl(e));
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
  getBrowserUrl(e) {
    var t;
    return (t = e.chromeWebStoreUrl) !== null && t !== void 0 ? t : e.mozillaAddOnsUrl;
  }
  getMobileUrl(e) {
    var t;
    return (t = e.iOSAppStoreUrl) !== null && t !== void 0 ? t : e.googlePlayStoreUrl;
  }
  getInstallUrl(e, t, n) {
    var r, s, o, i, a, c, p, g, h, w;
    return n === "IOS" ? (s = (r = e.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(e)) !== null && s !== void 0 ? s : e.webUrl : t === "Chrome" ? (i = (o = e.chromeWebStoreUrl) !== null && o !== void 0 ? o : this.getMobileUrl(e)) !== null && i !== void 0 ? i : e.webUrl : t === "Firefox" ? (c = (a = e.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(e)) !== null && c !== void 0 ? c : e.webUrl : n === "Android" ? (g = (p = e.googlePlayStoreUrl) !== null && p !== void 0 ? p : this.getBrowserUrl(e)) !== null && g !== void 0 ? g : e.webUrl : (w = (h = this.getBrowserUrl(e)) !== null && h !== void 0 ? h : e.webUrl) !== null && w !== void 0 ? w : this.getMobileUrl(e);
  }
  render() {
    const e = EL(), t = kL(), n = this.defaultProviders.filter(
      (o) => this.installedProviders.findIndex((i) => i.id === o.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return Be("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Be("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Be("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Be("div", { class: "flex flex-col space-y-[10px]" }, Be("div", { class: "flex items-center" }, Be("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Be("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Be("span", { class: "sr-only" }, "Close popup"), Be("img", { src: vL }))), r ? Be("p", null, "Select the wallet you want to connect to.") : Be("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !t && !e && Be("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Be("div", { class: "mt-6" }, Be("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Be("ul", { class: "space-y-3" }, this.installedProviders.map((o) => Be("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Be("div", { class: "aspect-square basis-9 overflow-hidden" }, Be("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Be("div", { class: "flex-1" }, Be("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && Be("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), Be("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(o.id) }, "Connect"))))), s && Be("div", { class: "mt-6" }, r ? Be("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Be("div", { class: "mb-5 flex justify-between" }, Be("p", { class: "text-sm font-medium" }, "Recommended wallets"), Be("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Be("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Be("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Be("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Be("p", null, "What is a wallet? ", Be("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Be("ul", { class: "space-y-3" }, n.map((o) => Be("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Be("div", { class: "aspect-square basis-9 overflow-hidden" }, Be("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Be("div", { class: "flex-1" }, Be("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && Be("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), this.getInstallUrl(o, e, t) && Be("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(o, e, t), rel: "noopener noreferrer", target: "_blank" }, o.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return P4(this);
  }
};
sb.style = $L;
const IL = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: sb
}, Symbol.toStringTag, { value: "Module" }));
