var Ry = Object.defineProperty;
var Gy = (t, e, n) => e in t ? Ry(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Oi = (t, e, n) => Gy(t, typeof e != "symbol" ? e + "" : e, n);
var Me = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Kh(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Ma(t) {
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
      typeof Me < "u" && Me || {}, r = {
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
      function m(S) {
        var C = new FileReader(), _ = g(C), T = /charset=([A-Za-z0-9_-]+)/.exec(S.type), q = T ? T[1] : "utf-8";
        return C.readAsText(S, q), _;
      }
      function b(S) {
        for (var C = new Uint8Array(S), _ = new Array(C.length), T = 0; T < C.length; T++)
          _[T] = String.fromCharCode(C[T]);
        return _.join("");
      }
      function L(S) {
        if (S.slice)
          return S.slice(0);
        var C = new Uint8Array(S.byteLength);
        return C.set(new Uint8Array(S)), C.buffer;
      }
      function P() {
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
            var G = new AbortController();
            return G.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && _)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(_), (this.method === "GET" || this.method === "HEAD") && (C.cache === "no-store" || C.cache === "no-cache")) {
          var T = /([?&])_=[^&]*/;
          if (T.test(this.url))
            this.url = this.url.replace(T, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var q = /\?/;
            this.url += (q.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
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
            var T = _.split("="), q = T.shift().replace(/\+/g, " "), G = T.join("=").replace(/\+/g, " ");
            C.append(decodeURIComponent(q), decodeURIComponent(G));
          }
        }), C;
      }
      function R(S) {
        var C = new d(), _ = S.replace(/\r?\n[\t ]+/g, " ");
        return _.split("\r").map(function(T) {
          return T.indexOf(`
`) === 0 ? T.substr(1, T.length) : T;
        }).forEach(function(T) {
          var q = T.split(":"), G = q.shift().trim();
          if (G) {
            var yt = q.join(":").trim();
            try {
              C.append(G, yt);
            } catch (ut) {
              console.warn("Response " + ut.message);
            }
          }
        }), C;
      }
      P.call($.prototype);
      function Q(S, C) {
        if (!(this instanceof Q))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (C || (C = {}), this.type = "default", this.status = C.status === void 0 ? 200 : C.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = C.statusText === void 0 ? "" : "" + C.statusText, this.headers = new d(C.headers), this.url = C.url || "", this._initBody(S);
      }
      P.call(Q.prototype), Q.prototype.clone = function() {
        return new Q(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, Q.error = function() {
        var S = new Q(null, { status: 200, statusText: "" });
        return S.ok = !1, S.status = 0, S.type = "error", S;
      };
      var H = [301, 302, 303, 307, 308];
      Q.redirect = function(S, C) {
        if (H.indexOf(C) === -1)
          throw new RangeError("Invalid status code");
        return new Q(null, { status: C, headers: { location: S } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(C, _) {
          this.message = C, this.name = _;
          var T = Error(C);
          this.stack = T.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function W(S, C) {
        return new Promise(function(_, T) {
          var q = new $(S, C);
          if (q.signal && q.signal.aborted)
            return T(new e.DOMException("Aborted", "AbortError"));
          var G = new XMLHttpRequest();
          function yt() {
            G.abort();
          }
          G.onload = function() {
            var E = {
              statusText: G.statusText,
              headers: R(G.getAllResponseHeaders() || "")
            };
            q.url.indexOf("file://") === 0 && (G.status < 200 || G.status > 599) ? E.status = 200 : E.status = G.status, E.url = "responseURL" in G ? G.responseURL : E.headers.get("X-Request-URL");
            var M = "response" in G ? G.response : G.responseText;
            setTimeout(function() {
              _(new Q(M, E));
            }, 0);
          }, G.onerror = function() {
            setTimeout(function() {
              T(new TypeError("Network request failed"));
            }, 0);
          }, G.ontimeout = function() {
            setTimeout(function() {
              T(new TypeError("Network request timed out"));
            }, 0);
          }, G.onabort = function() {
            setTimeout(function() {
              T(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function ut(E) {
            try {
              return E === "" && n.location.href ? n.location.href : E;
            } catch {
              return E;
            }
          }
          if (G.open(q.method, ut(q.url), !0), q.credentials === "include" ? G.withCredentials = !0 : q.credentials === "omit" && (G.withCredentials = !1), "responseType" in G && (r.blob ? G.responseType = "blob" : r.arrayBuffer && (G.responseType = "arraybuffer")), C && typeof C.headers == "object" && !(C.headers instanceof d || n.Headers && C.headers instanceof n.Headers)) {
            var he = [];
            Object.getOwnPropertyNames(C.headers).forEach(function(E) {
              he.push(a(E)), G.setRequestHeader(E, c(C.headers[E]));
            }), q.headers.forEach(function(E, M) {
              he.indexOf(M) === -1 && G.setRequestHeader(M, E);
            });
          } else
            q.headers.forEach(function(E, M) {
              G.setRequestHeader(M, E);
            });
          q.signal && (q.signal.addEventListener("abort", yt), G.onreadystatechange = function() {
            G.readyState === 4 && q.signal.removeEventListener("abort", yt);
          }), G.send(typeof q._bodyInit > "u" ? null : q._bodyInit);
        });
      }
      return W.polyfill = !0, n.fetch || (n.fetch = W, n.Headers = d, n.Request = $, n.Response = Q), e.Headers = d, e.Request = $, e.Response = Q, e.fetch = W, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : Me);
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
var ui;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ui || (ui = {}));
var fs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(fs || (fs = {}));
var df;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(df || (df = {}));
const Xy = "https://api.mainnet.hiro.so", Yy = "https://api.testnet.hiro.so", Zy = "http://localhost:3999", Qy = ["mainnet", "testnet", "devnet", "mocknet"];
let fi = class {
  constructor(e) {
    this.version = fs.Mainnet, this.chainId = ui.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === fs.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
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
fi.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Fc();
    case "testnet":
      return new Jy();
    case "devnet":
      return new tw();
    case "mocknet":
      return new Vh();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Qy.join(", ")}`);
  }
};
fi.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : fi.fromName(t);
let Fc = class extends fi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Xy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = fs.Mainnet, this.chainId = ui.Mainnet;
  }
}, Jy = class extends fi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Yy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = fs.Testnet, this.chainId = ui.Testnet;
  }
}, Vh = class extends fi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Zy,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = fs.Testnet, this.chainId = ui.Testnet;
  }
};
const tw = Vh, qh = "xtrata.wallet.bridge.v1", ew = (t) => typeof t == "object" && t !== null && t.protocol === qh, nw = (t) => ew(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", rw = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class Di extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const hf = 12e4;
class sw {
  constructor(e) {
    Oi(this, "pending", /* @__PURE__ */ new Map());
    Oi(this, "listenTarget");
    Oi(this, "closed", !1);
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
    Oi(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !nw(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new Di("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new Di("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Di("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = rw(), i = { protocol: qh, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new Di(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? hf}ms.`
          )
        );
      }, this.options.timeoutMs ?? hf);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new Di("CLOSED", "Bridge client closed before the reply arrived."));
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
}, lw = () => typeof window > "u" || !window.localStorage ? cw() : window.localStorage, fc = "xtrata.v15.1.wallet.session", pf = "mainnet", aa = { isConnected: !1 }, uw = (t) => t.address ? aw(t.address) ?? t.network : t.network, Wh = (t) => !t.isConnected || !t.address ? { ...aa } : uw(t) !== pf ? { ...aa } : {
  isConnected: !0,
  address: t.address,
  network: pf,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, fw = (t) => {
  if (!t)
    return { ...aa };
  try {
    const e = JSON.parse(t);
    return Wh(e);
  } catch {
    return { ...aa };
  }
}, dw = (t) => {
  const e = Wh(t);
  return JSON.stringify(e);
}, hw = (t) => {
  const e = lw();
  return {
    load: () => fw(e.getItem(fc)),
    save: (n) => {
      e.setItem(fc, dw(n));
    },
    clear: () => {
      e.removeItem(fc);
    }
  };
}, pw = "https://browser.blockstack.org/auth", gw = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Xh = ["store_write"], yw = "blockstack-session", ww = {
  logLevel: "debug"
}, Cs = {
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
Object.freeze(Cs);
class Li extends Error {
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
class bw extends Li {
  constructor(e, n = "") {
    super({ code: Cs.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class gf extends Li {
  constructor(e = "") {
    super({ code: Cs.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Ao extends Li {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Cs.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class yf extends Li {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Cs.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class jc extends Li {
  constructor(e) {
    super({ code: Cs.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Yh extends Li {
  constructor(e) {
    super({ code: Cs.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const wf = ["debug", "info", "warn", "error", "none"], zc = {};
for (let t = 0; t < wf.length; t++) {
  const e = wf[t];
  zc[e] = t;
}
class ni {
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
    return zc[ww.logLevel] <= zc[e];
  }
}
function mw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function xw() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function dc(t, e) {
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
function Vl(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Ew(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    ni.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = Aw(s, t.toString(), n);
    throw ni.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Gr(t, e) {
  return ql(Le(t), e);
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
  if (je(t, Uint8Array))
    return BigInt(`0x${st(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function vw(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function bf(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function uo(t, e = 8) {
  return (typeof t == "bigint" ? t : Le(t)).toString(16).padStart(e * 2, "0");
}
function Na(t) {
  return parseInt(t, 16);
}
function ql(t, e = 16) {
  const n = uo(t, e);
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
function Rc(t) {
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
function Bs(t) {
  return new TextEncoder().encode(t);
}
function fo(t) {
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
function mf(t) {
  if (t.some(Tw))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Dn(...t) {
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
  return Dn(...t.map((e) => typeof e == "number" ? mf([e]) : e instanceof Array ? mf(e) : e));
}
function je(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Zh = "https://api.mainnet.hiro.so", Qh = "https://api.testnet.hiro.so", Jh = "http://localhost:3999", Mw = "https://hub.blockstack.org", Nw = 33, hc = 32;
function _w(t) {
  if (t.length < hc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + hc * 2), r = t.slice(2 + hc * 2);
  return {
    recoveryId: Na(e),
    r: n,
    s: r
  };
}
function Wl(t) {
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
function ds(t, e, n = 0) {
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
class t0 {
  constructor(e = Xh.slice(), n = ((a) => (a = Vl("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = pw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Gc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Gw(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function e0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Kw(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Gc(t.outputLen), Gc(t.blockLen);
}
function Vw(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function qw(t, e) {
  e0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const es = {
  number: Gc,
  bool: Gw,
  bytes: e0,
  hash: Kw,
  exists: Vw,
  output: qw
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const pc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Ln = (t, e) => t << 32 - e | t >>> e, Ww = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Ww)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Xw(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Xl(t) {
  if (typeof t == "string" && (t = Xw(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let n0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ts(t) {
  const e = (r) => t().update(Xl(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let r0 = class extends n0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, es.hash(e);
    const r = Xl(n);
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
const _a = (t, e, n) => new r0(t, e).update(n).digest();
_a.create = (t, e) => new r0(t, e);
function Yw(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let Yl = class extends n0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = pc(this.buffer);
  }
  update(e) {
    es.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Xl(e);
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
    es.exists(this), es.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Yw(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
]), dr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), hr = new Uint32Array(64);
let s0 = class extends Yl {
  constructor() {
    super(64, 32, 8, !1), this.A = dr[0] | 0, this.B = dr[1] | 0, this.C = dr[2] | 0, this.D = dr[3] | 0, this.E = dr[4] | 0, this.F = dr[5] | 0, this.G = dr[6] | 0, this.H = dr[7] | 0;
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
      hr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = hr[l - 15], h = hr[l - 2], m = Ln(g, 7) ^ Ln(g, 18) ^ g >>> 3, b = Ln(h, 17) ^ Ln(h, 19) ^ h >>> 10;
      hr[l] = b + hr[l - 7] + m + hr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Ln(a, 6) ^ Ln(a, 11) ^ Ln(a, 25), h = d + g + Zw(a, c, f) + Jw[l] + hr[l] | 0, b = (Ln(r, 2) ^ Ln(r, 13) ^ Ln(r, 22)) + Qw(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    hr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, tb = class extends s0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const di = Ts(() => new s0());
Ts(() => new tb());
const eb = {}, i0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: eb
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const _t = BigInt(0), Jt = BigInt(1), Dr = BigInt(2), Vi = BigInt(3), xf = BigInt(8), Kt = Object.freeze({
  a: _t,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Jt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Sf = (t, e) => (t + e / Dr) / e, vo = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = Kt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Jt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = Sf(i * t, e), c = Sf(-r * t, e);
    let f = V(t - a * n - c * s, e), d = V(-a * r - c * i, e);
    const l = f > o, g = d > o;
    if (l && (f = e - f), g && (d = e - d), f > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: f, k2neg: g, k2: d };
  }
}, xn = 32, hs = 32, o0 = 32, ca = xn + 1, la = 2 * xn + 1;
function Ef(t) {
  const { a: e, b: n } = Kt, r = V(t * t), s = V(r * t);
  return V(s + e * t + n);
}
const $o = Kt.a === _t;
class Zl extends Error {
  constructor(e) {
    super(e);
  }
}
function Af(t) {
  if (!(t instanceof jt))
    throw new TypeError("JacobianPoint expected");
}
class jt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Ct))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Ct.ZERO) ? jt.ZERO : new jt(e.x, e.y, Jt);
  }
  static toAffineBatch(e) {
    const n = ob(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return jt.toAffineBatch(e).map(jt.fromAffine);
  }
  equals(e) {
    Af(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = V(s * s), f = V(a * a), d = V(n * f), l = V(i * c), g = V(V(r * a) * f), h = V(V(o * s) * c);
    return d === l && g === h;
  }
  negate() {
    return new jt(this.x, V(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = V(e * e), i = V(n * n), o = V(i * i), a = e + i, c = V(Dr * (V(a * a) - s - o)), f = V(Vi * s), d = V(f * f), l = V(d - Dr * c), g = V(f * (c - l) - xf * o), h = V(Dr * n * r);
    return new jt(l, g, h);
  }
  add(e) {
    Af(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === _t || o === _t)
      return this;
    if (n === _t || r === _t)
      return e;
    const c = V(s * s), f = V(a * a), d = V(n * f), l = V(i * c), g = V(V(r * a) * f), h = V(V(o * s) * c), m = V(l - d), b = V(h - g);
    if (m === _t)
      return b === _t ? this.double() : jt.ZERO;
    const L = V(m * m), P = V(m * L), U = V(d * L), p = V(b * b - P - Dr * U), $ = V(b * (U - p) - g * P), I = V(s * a * m);
    return new jt(p, $, I);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = jt.ZERO;
    if (typeof e == "bigint" && e === _t)
      return n;
    let r = If(e);
    if (r === Jt)
      return this;
    if (!$o) {
      let l = n, g = this;
      for (; r > _t; )
        r & Jt && (l = l.add(g)), g = g.double(), r >>= Jt;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = vo.splitScalar(r), c = n, f = n, d = this;
    for (; i > _t || a > _t; )
      i & Jt && (c = c.add(d)), a & Jt && (f = f.add(d)), d = d.double(), i >>= Jt, a >>= Jt;
    return s && (c = c.negate()), o && (f = f.negate()), f = new jt(V(f.x * vo.beta), f.y, f.z), c.add(f);
  }
  precomputeWindow(e) {
    const n = $o ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(jt.BASE) && (n = Ct.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Kc.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = jt.normalizeZ(s), Kc.set(n, s)));
    let i = jt.ZERO, o = jt.BASE;
    const a = 1 + ($o ? 128 / r : 256 / r), c = 2 ** (r - 1), f = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let g = 0; g < a; g++) {
      const h = g * c;
      let m = Number(e & f);
      e >>= l, m > c && (m -= d, e += Jt);
      const b = h, L = h + Math.abs(m) - 1, P = g % 2 !== 0, U = m < 0;
      m === 0 ? o = o.add(Io(P, s[b])) : i = i.add(Io(U, s[L]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = If(e), s, i;
    if ($o) {
      const { k1neg: o, k1: a, k2neg: c, k2: f } = vo.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: g, f: h } = this.wNAF(f, n);
      d = Io(o, d), g = Io(c, g), g = new jt(V(g.x * vo.beta), g.y, g.z), s = d.add(g), i = l.add(h);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return jt.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(jt.ZERO);
    e == null && (e = i ? xf : Ci(s));
    const o = e, a = V(o * o), c = V(a * o), f = V(n * a), d = V(r * c), l = V(s * o);
    if (i)
      return Ct.ZERO;
    if (l !== Jt)
      throw new Error("invZ was invalid");
    return new Ct(f, d);
  }
}
jt.BASE = new jt(Kt.Gx, Kt.Gy, Jt);
jt.ZERO = new jt(_t, Jt, _t);
function Io(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Kc = /* @__PURE__ */ new WeakMap();
class Ct {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Kc.delete(this);
  }
  hasEvenY() {
    return this.y % Dr === _t;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Xe(n ? e : e.subarray(1));
    if (!Jo(r))
      throw new Error("Point is not on curve");
    const s = Ef(r);
    let i = ib(s);
    const o = (i & Jt) === Jt;
    n ? o && (i = V(-i)) : (e[0] & 1) === 1 !== o && (i = V(-i));
    const a = new Ct(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Xe(e.subarray(1, xn + 1)), r = Xe(e.subarray(xn + 1, xn * 2 + 1)), s = new Ct(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Fn(e), r = n.length, s = n[0];
    if (r === xn)
      return this.fromCompressedHex(n);
    if (r === ca && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === la && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${ca} compressed bytes or ${la} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Ct.BASE.multiply(ps(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = l0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Ql(Fn(e)), { n: a } = Kt, c = r === 2 || r === 3 ? s + a : s, f = Ci(c, a), d = V(-o * f, a), l = V(i * f, a), g = r & 1 ? "03" : "02", h = Ct.fromHex(g + Fr(c)), m = Ct.BASE.multiplyAndAddUnsafe(h, d, l);
    if (!m)
      throw new Error("Cannot recover signature: point at infinify");
    return m.assertValidity(), m;
  }
  toRawBytes(e = !1) {
    return jr(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Fr(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Fr(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Jo(n) || !Jo(r))
      throw new Error(e);
    const s = V(r * r), i = Ef(n);
    if (V(s - i) !== _t)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Ct(this.x, V(-this.y));
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
    const s = jt.fromAffine(this), i = n === _t || n === Jt || this !== Ct.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = jt.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(jt.ZERO) ? void 0 : a.toAffine();
  }
}
Ct.BASE = new Ct(Kt.Gx, Kt.Gy);
Ct.ZERO = new Ct(_t, _t);
function vf(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function $f(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${hi(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Xe(n), left: t.subarray(e + 2) };
}
function nb(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${hi(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = $f(t.subarray(2)), { data: r, left: s } = $f(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${hi(s)}`);
  return { r: e, s: r };
}
class We {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? hi(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new We(ua(s.slice(0, 64)), ua(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = nb(n ? e : jr(e));
    return new We(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!gi(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!gi(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = Kt.n >> Jt;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new We(this.r, V(-this.s, Kt.n)) : this;
  }
  toDERRawBytes() {
    return jr(this.toDERHex());
  }
  toDERHex() {
    const e = vf(Fi(this.s)), n = vf(Fi(this.r)), r = e.length / 2, s = n.length / 2, i = Fi(r), o = Fi(s);
    return `30${Fi(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return jr(this.toCompactHex());
  }
  toCompactHex() {
    return Fr(this.r) + Fr(this.s);
  }
}
function Hr(...t) {
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
function hi(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += rb[t[n]];
  return e;
}
const sb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Fr(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(_t <= t && t < sb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function pi(t) {
  const e = jr(Fr(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Fi(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function ua(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function jr(t) {
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
function Xe(t) {
  return ua(hi(t));
}
function Fn(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : jr(t);
}
function If(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && gi(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function V(t, e = Kt.P) {
  const n = t % e;
  return n >= _t ? n : e + n;
}
function rn(t, e) {
  const { P: n } = Kt;
  let r = t;
  for (; e-- > _t; )
    r *= r, r %= n;
  return r;
}
function ib(t) {
  const { P: e } = Kt, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, f = c * c * t % e, d = rn(f, Vi) * f % e, l = rn(d, Vi) * f % e, g = rn(l, Dr) * c % e, h = rn(g, r) * g % e, m = rn(h, s) * h % e, b = rn(m, o) * m % e, L = rn(b, a) * b % e, P = rn(L, o) * m % e, U = rn(P, Vi) * f % e, p = rn(U, i) * h % e, $ = rn(p, n) * c % e, I = rn($, Dr);
  if (I * I % e !== t)
    throw new Error("Cannot find square root");
  return I;
}
function Ci(t, e = Kt.P) {
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
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === _t ? i : (n[a] = i, V(i * o, e)), Jt), s = Ci(r, e);
  return t.reduceRight((i, o, a) => o === _t ? i : (n[a] = V(i * n[a], e), V(i * o, e)), s), n;
}
function ab(t) {
  const e = t.length * 8 - hs * 8, n = Xe(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Ql(t, e = !1) {
  const n = ab(t);
  if (e)
    return n;
  const { n: r } = Kt;
  return n >= r ? n - r : n;
}
let ci, qi;
class a0 {
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
    return qi(this.k, ...e);
  }
  checkSync() {
    if (typeof qi != "function")
      throw new Zl("hmacSha256Sync needs to be set");
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
    return Hr(...n);
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
    return Hr(...n);
  }
}
function gi(t) {
  return _t < t && t < Kt.n;
}
function Jo(t) {
  return _t < t && t < Kt.P;
}
function c0(t, e, n, r = !0) {
  const { n: s } = Kt, i = Ql(t, !0);
  if (!gi(i))
    return;
  const o = Ci(i, s), a = Ct.BASE.multiply(i), c = V(a.x, s);
  if (c === _t)
    return;
  const f = V(o * V(e + n * c, s), s);
  if (f === _t)
    return;
  let d = new We(c, f), l = (a.x === d.r ? 0 : 2) | Number(a.y & Jt);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function ps(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * hs)
      throw new Error("Expected 32 bytes of private key");
    e = ua(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== hs)
      throw new Error("Expected 32 bytes of private key");
    e = Xe(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!gi(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Jl(t) {
  return t instanceof Ct ? (t.assertValidity(), t) : Ct.fromHex(t);
}
function l0(t) {
  if (t instanceof We)
    return t.assertValidity(), t;
  try {
    return We.fromDER(t);
  } catch {
    return We.fromCompact(t);
  }
}
function ho(t, e = !1) {
  return Ct.fromPrivateKey(t).toRawBytes(e);
}
function cb(t, e, n, r = !1) {
  return Ct.fromSignature(t, e, n).toRawBytes(r);
}
function kf(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === ca || r === la : n ? r === ca * 2 || r === la * 2 : t instanceof Ct;
}
function tu(t, e, n = !1) {
  if (kf(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!kf(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Jl(e);
  return r.assertValidity(), r.multiply(ps(t)).toRawBytes(n);
}
function u0(t) {
  const e = t.length > xn ? t.slice(0, xn) : t;
  return Xe(e);
}
function lb(t) {
  const e = u0(t), n = V(e, Kt.n);
  return f0(n < _t ? e : n);
}
function f0(t) {
  return pi(t);
}
function d0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Fn(t), s = ps(e), i = [f0(s), lb(r)];
  if (n != null) {
    n === !0 && (n = ae.randomBytes(xn));
    const c = Fn(n);
    if (c.length !== xn)
      throw new Error(`sign: Expected ${xn} bytes of extra data`);
    i.push(c);
  }
  const o = Hr(...i), a = u0(r);
  return { seed: o, m: a, d: s };
}
function h0(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function ub(t, e, n = {}) {
  const { seed: r, m: s, d: i } = d0(t, e, n.extraEntropy), o = new a0(o0, hs);
  await o.reseed(r);
  let a;
  for (; !(a = c0(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return h0(a, n);
}
function Ua(t, e, n = {}) {
  const { seed: r, m: s, d: i } = d0(t, e, n.extraEntropy), o = new a0(o0, hs);
  o.reseedSync(r);
  let a;
  for (; !(a = c0(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return h0(a, n);
}
const fb = { strict: !0 };
function db(t, e, n, r = fb) {
  let s;
  try {
    s = l0(t), e = Fn(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Ql(e);
  let c;
  try {
    c = Jl(n);
  } catch {
    return !1;
  }
  const { n: f } = Kt, d = Ci(o, f), l = V(a * d, f), g = V(i * d, f), h = Ct.BASE.multiplyAndAddUnsafe(c, l, g);
  return h ? V(h.x, f) === i : !1;
}
function fa(t) {
  return V(Xe(t), Kt.n);
}
class yi {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Fn(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Xe(n.subarray(0, 32)), s = Xe(n.subarray(32, 64));
    return new yi(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Jo(e) || !gi(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Fr(this.r) + Fr(this.s);
  }
  toRawBytes() {
    return jr(this.toHex());
  }
}
function hb(t) {
  return Ct.fromPrivateKey(t).toRawX();
}
class p0 {
  constructor(e, n, r = ae.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Fn(e);
    const { x: s, scalar: i } = this.getScalar(ps(n));
    if (this.px = s, this.d = i, this.rand = Fn(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Ct.fromPrivateKey(e), r = n.hasEvenY() ? e : Kt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return pi(e ^ Xe(n));
  }
  finalizeNonce(e) {
    const n = V(Xe(e), Kt.n);
    if (n === _t)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new yi(e.x, V(n + r * s, Kt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = ae.taggedHash, o = this.initNonce(n, await i(Pr.aux, s)), { R: a, rx: c, k: f } = this.finalizeNonce(await i(Pr.nonce, o, r, e)), d = fa(await i(Pr.challenge, c, r, e)), l = this.finalizeSig(a, f, d, n);
    return await w0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = ae.taggedHashSync, o = this.initNonce(n, i(Pr.aux, s)), { R: a, rx: c, k: f } = this.finalizeNonce(i(Pr.nonce, o, r, e)), d = fa(i(Pr.challenge, c, r, e)), l = this.finalizeSig(a, f, d, n);
    return b0(l, e, r) || this.error(), l;
  }
}
async function pb(t, e, n) {
  return new p0(t, e, n).calc();
}
function gb(t, e, n) {
  return new p0(t, e, n).calcSync();
}
function g0(t, e, n) {
  const r = t instanceof yi, s = r ? t : yi.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Fn(e),
    P: Jl(n)
  };
}
function y0(t, e, n, r) {
  const s = Ct.BASE.multiplyAndAddUnsafe(e, ps(n), V(-r, Kt.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function w0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = g0(t, e, n), a = fa(await ae.taggedHash(Pr.challenge, pi(r), o.toRawX(), i));
    return y0(r, o, s, a);
  } catch {
    return !1;
  }
}
function b0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = g0(t, e, n), a = fa(ae.taggedHashSync(Pr.challenge, pi(r), o.toRawX(), i));
    return y0(r, o, s, a);
  } catch (r) {
    if (r instanceof Zl)
      throw r;
    return !1;
  }
}
const yb = {
  Signature: yi,
  getPublicKey: hb,
  sign: pb,
  verify: w0,
  signSync: gb,
  verifySync: b0
};
Ct.BASE._setWindowSize(8);
const Re = {
  node: i0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Pr = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, ko = {}, ae = {
  bytesToHex: hi,
  hexToBytes: jr,
  concatBytes: Hr,
  mod: V,
  invert: Ci,
  isValidPrivateKey(t) {
    try {
      return ps(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: pi,
  _normalizePrivateKey: ps,
  hashToPrivateKey: (t) => {
    t = Fn(t);
    const e = hs + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = V(Xe(t), Kt.n - Jt) + Jt;
    return pi(n);
  },
  randomBytes: (t = 32) => {
    if (Re.web)
      return Re.web.getRandomValues(new Uint8Array(t));
    if (Re.node) {
      const { randomBytes: e } = Re.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => ae.hashToPrivateKey(ae.randomBytes(hs + 8)),
  precompute(t = 8, e = Ct.BASE) {
    const n = e === Ct.BASE ? e : new Ct(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Vi), n;
  },
  sha256: async (...t) => {
    if (Re.web) {
      const e = await Re.web.subtle.digest("SHA-256", Hr(...t));
      return new Uint8Array(e);
    } else if (Re.node) {
      const { createHash: e } = Re.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Re.web) {
      const n = await Re.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Hr(...e), s = await Re.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Re.node) {
      const { createHmac: n } = Re.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = ko[t];
    if (n === void 0) {
      const r = await ae.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Hr(r, r), ko[t] = n;
    }
    return ae.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof ci != "function")
      throw new Zl("sha256Sync is undefined, you need to set it");
    let n = ko[t];
    if (n === void 0) {
      const r = ci(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Hr(r, r), ko[t] = n;
    }
    return ci(n, ...e);
  },
  _JacobianPoint: jt
};
Object.defineProperties(ae, {
  sha256Sync: {
    configurable: !1,
    get() {
      return ci;
    },
    set(t) {
      ci || (ci = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return qi;
    },
    set(t) {
      qi || (qi = t);
    }
  }
});
const wb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Kt,
  Point: Ct,
  Signature: We,
  getPublicKey: ho,
  getSharedSecret: tu,
  recoverPublicKey: cb,
  schnorr: yb,
  sign: ub,
  signSync: Ua,
  utils: ae,
  verify: db
}, Symbol.toStringTag, { value: "Module" }));
var po = {};
po.byteLength = Eb;
var bb = po.toByteArray = vb, mb = po.fromByteArray = kb, Nn = [], on = [], xb = typeof Uint8Array < "u" ? Uint8Array : Array, gc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Xs = 0, Sb = gc.length; Xs < Sb; ++Xs)
  Nn[Xs] = gc[Xs], on[gc.charCodeAt(Xs)] = Xs;
on[45] = 62;
on[95] = 63;
function m0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Eb(t) {
  var e = m0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Ab(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function vb(t) {
  var e, n = m0(t), r = n[0], s = n[1], i = new xb(Ab(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = on[t.charCodeAt(c)] << 18 | on[t.charCodeAt(c + 1)] << 12 | on[t.charCodeAt(c + 2)] << 6 | on[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = on[t.charCodeAt(c)] << 2 | on[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = on[t.charCodeAt(c)] << 10 | on[t.charCodeAt(c + 1)] << 4 | on[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function $b(t) {
  return Nn[t >> 18 & 63] + Nn[t >> 12 & 63] + Nn[t >> 6 & 63] + Nn[t & 63];
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
    Nn[e >> 2] + Nn[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Nn[e >> 10] + Nn[e >> 4 & 63] + Nn[e << 2 & 63] + "="
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
    const i = this.createCipher(e, n, r), o = new Uint8Array(Dn(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(Dn(i.update(s), i.final()));
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
async function x0() {
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
    for (var m = 0, b = 0, L = 0, P = h.length; L !== P && h[L] === 0; )
      L++, m++;
    for (var U = (P - L) * f + 1 >>> 0, p = new Uint8Array(U); L !== P; ) {
      for (var $ = h[L], I = 0, R = U - 1; ($ !== 0 || I < b) && R !== -1; R--, I++)
        $ += 256 * p[R] >>> 0, p[R] = $ % o >>> 0, $ = $ / o >>> 0;
      if ($ !== 0)
        throw new Error("Non-zero carry");
      b = I, L++;
    }
    for (var Q = U - b; Q !== U && p[Q] === 0; )
      Q++;
    for (var H = a.repeat(m); Q < U; ++Q)
      H += t.charAt(p[Q]);
    return H;
  }
  function l(h) {
    if (typeof h != "string")
      throw new TypeError("Expected String");
    if (h.length === 0)
      return new Uint8Array();
    for (var m = 0, b = 0, L = 0; h[m] === a; )
      b++, m++;
    for (var P = (h.length - m) * c + 1 >>> 0, U = new Uint8Array(P); h[m]; ) {
      var p = h.charCodeAt(m);
      if (p > 255)
        return;
      var $ = e[p];
      if ($ === 255)
        return;
      for (var I = 0, R = P - 1; ($ !== 0 || I < L) && R !== -1; R--, I++)
        $ += o * U[R] >>> 0, U[R] = $ % 256 >>> 0, $ = $ / 256 >>> 0;
      if ($ !== 0)
        throw new Error("Non-zero carry");
      L = I, m++;
    }
    for (var Q = P - L; Q !== P && U[Q] === 0; )
      Q++;
    for (var H = new Uint8Array(b + (P - Q)), W = b; Q !== P; )
      H[W++] = U[Q++];
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
var S0 = Nb;
const _b = S0, Ub = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Pb = _b(Ub);
const Hb = /* @__PURE__ */ Kh(Pb), Ob = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), E0 = Uint8Array.from({ length: 16 }, (t, e) => e), Db = E0.map((t) => (9 * t + 5) % 16);
let eu = [E0], nu = [Db];
for (let t = 0; t < 4; t++)
  for (let e of [eu, nu])
    e.push(e[t].map((n) => Ob[n]));
const A0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Fb = eu.map((t, e) => t.map((n) => A0[e][n])), jb = nu.map((t, e) => t.map((n) => A0[e][n])), zb = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Rb = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Lo = (t, e) => t << e | t >>> 32 - e;
function Lf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Co = new Uint32Array(16);
let Gb = class extends Yl {
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
      Co[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const m = 4 - h, b = zb[h], L = Rb[h], P = eu[h], U = nu[h], p = Fb[h], $ = jb[h];
      for (let I = 0; I < 16; I++) {
        const R = Lo(r + Lf(h, i, a, f) + Co[P[I]] + b, p[I]) + l | 0;
        r = l, l = f, f = Lo(a, 10) | 0, a = i, i = R;
      }
      for (let I = 0; I < 16; I++) {
        const R = Lo(s + Lf(m, o, c, d) + Co[U[I]] + L, $[I]) + g | 0;
        s = g, g = d, d = Lo(c, 10) | 0, c = o, o = R;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Co.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Kb = Ts(() => new Gb());
function Vb(t) {
  return Kb(t);
}
const Bo = BigInt(2 ** 32 - 1), Vc = BigInt(32);
function v0(t, e = !1) {
  return e ? { h: Number(t & Bo), l: Number(t >> Vc & Bo) } : { h: Number(t >> Vc & Bo) | 0, l: Number(t & Bo) | 0 };
}
function qb(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = v0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Wb = (t, e) => BigInt(t >>> 0) << Vc | BigInt(e >>> 0), Xb = (t, e, n) => t >>> n, Yb = (t, e, n) => t << 32 - n | e >>> n, Zb = (t, e, n) => t >>> n | e << 32 - n, Qb = (t, e, n) => t << 32 - n | e >>> n, Jb = (t, e, n) => t << 64 - n | e >>> n - 32, t1 = (t, e, n) => t >>> n - 32 | e << 64 - n, e1 = (t, e) => e, n1 = (t, e) => t, r1 = (t, e, n) => t << n | e >>> 32 - n, s1 = (t, e, n) => e << n | t >>> 32 - n, i1 = (t, e, n) => e << n - 32 | t >>> 64 - n, o1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function a1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const c1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), l1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, u1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), f1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, d1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), h1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Et = {
  fromBig: v0,
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
}, [p1, g1] = Et.split([
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
].map((t) => BigInt(t))), pr = new Uint32Array(80), gr = new Uint32Array(80);
let Pa = class extends Yl {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: m, Hh: b, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, m, b, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, m, b, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = m | 0, this.Hh = b | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      pr[p] = e.getUint32(n), gr[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const $ = pr[p - 15] | 0, I = gr[p - 15] | 0, R = Et.rotrSH($, I, 1) ^ Et.rotrSH($, I, 8) ^ Et.shrSH($, I, 7), Q = Et.rotrSL($, I, 1) ^ Et.rotrSL($, I, 8) ^ Et.shrSL($, I, 7), H = pr[p - 2] | 0, W = gr[p - 2] | 0, S = Et.rotrSH(H, W, 19) ^ Et.rotrBH(H, W, 61) ^ Et.shrSH(H, W, 6), C = Et.rotrSL(H, W, 19) ^ Et.rotrBL(H, W, 61) ^ Et.shrSL(H, W, 6), _ = Et.add4L(Q, C, gr[p - 7], gr[p - 16]), T = Et.add4H(_, R, S, pr[p - 7], pr[p - 16]);
      pr[p] = T | 0, gr[p] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: m, Gh: b, Gl: L, Hh: P, Hl: U } = this;
    for (let p = 0; p < 80; p++) {
      const $ = Et.rotrSH(l, g, 14) ^ Et.rotrSH(l, g, 18) ^ Et.rotrBH(l, g, 41), I = Et.rotrSL(l, g, 14) ^ Et.rotrSL(l, g, 18) ^ Et.rotrBL(l, g, 41), R = l & h ^ ~l & b, Q = g & m ^ ~g & L, H = Et.add5L(U, I, Q, g1[p], gr[p]), W = Et.add5H(H, P, $, R, p1[p], pr[p]), S = H | 0, C = Et.rotrSH(r, s, 28) ^ Et.rotrBH(r, s, 34) ^ Et.rotrBH(r, s, 39), _ = Et.rotrSL(r, s, 28) ^ Et.rotrBL(r, s, 34) ^ Et.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, q = s & o ^ s & c ^ o & c;
      P = b | 0, U = L | 0, b = h | 0, L = m | 0, h = l | 0, m = g | 0, { h: l, l: g } = Et.add(f | 0, d | 0, W | 0, S | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const G = Et.add3L(S, _, q);
      r = Et.add3H(G, W, C, T), s = G | 0;
    }
    ({ h: r, l: s } = Et.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Et.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = Et.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = Et.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: m } = Et.add(this.Fh | 0, this.Fl | 0, h | 0, m | 0), { h: b, l: L } = Et.add(this.Gh | 0, this.Gl | 0, b | 0, L | 0), { h: P, l: U } = Et.add(this.Hh | 0, this.Hl | 0, P | 0, U | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, m, b, L, P, U);
  }
  roundClean() {
    pr.fill(0), gr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, y1 = class extends Pa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, w1 = class extends Pa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, b1 = class extends Pa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const m1 = Ts(() => new Pa());
Ts(() => new y1());
Ts(() => new w1());
Ts(() => new b1());
function $0(t) {
  return di(t);
}
function x1(t) {
  return m1(t);
}
const S1 = 0;
ae.hmacSha256Sync = (t, ...e) => {
  const n = _a.create(di, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function E1() {
  return st(ae.randomPrivateKey());
}
function A1(t) {
  const e = di(di(t));
  return Hb.encode(Dn(t, e).slice(0, t.length + 4));
}
function v1(t, e) {
  return A1(Dn(new Uint8Array([t]), e.slice(0, 20)));
}
function I0(t, e = S1) {
  const n = typeof t == "string" ? Pt(t) : t, r = Vb($0(n));
  return v1(e, r);
}
function k0(t) {
  const e = Wl(t);
  return st(ho(e.slice(0, 32), !0));
}
ae.hmacSha256Sync = (t, ...e) => {
  const n = _a.create(di, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var da;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(da || (da = {}));
async function $1(t, e, n) {
  return await (await x0()).encrypt("aes-256-cbc", e, t, n);
}
async function I1(t, e, n) {
  return await (await x0()).decrypt("aes-256-cbc", e, t, n);
}
function L0(t, e) {
  return _a(di, t, e);
}
function k1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function C0(t) {
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
    reason: da.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: da.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !L1(t))
    return e;
  try {
    return Ct.fromHex(t).assertValidity(), {
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
  const i = ae.randomPrivateKey(), o = ho(i, !0);
  let a = tu(i, t, !0);
  a = a.slice(1);
  const c = C0(a), f = ae.randomBytes(16), d = await $1(f, c.encryptionKey, e), l = Dn(f, o, d), g = L0(c.hmacKey, l);
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
async function B0(t, e) {
  if (!e.ephemeralPK)
    throw new yf("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = tu(t, n, !0);
  r = r.slice(1);
  const s = C0(r), i = Pt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Pt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = bb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = Dn(i, Pt(n), o), c = L0(s.hmacKey, a), f = Pt(e.mac);
  if (!k1(f, c))
    throw new yf("Decryption failed: failure in MAC check");
  const d = await I1(i, s.encryptionKey, o);
  return e.wasString ? fo(d) : d;
}
function T1(t, e) {
  const n = typeof e == "string" ? Bs(e) : e, r = k0(t), s = $0(n), i = Ua(s, t);
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
    n.publicKey = k0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Bs(t) : t, o = await B1(n.publicKey, i, s, n.cipherTextEncoding);
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
    return B0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var ve = {}, wi = {}, Be = {};
Object.defineProperty(Be, "__esModule", { value: !0 });
Be.decode = Be.encode = Be.unescape = Be.escape = Be.pad = void 0;
const T0 = po;
function ru(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
Be.pad = ru;
function M0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Be.escape = M0;
function N0(t) {
  return ru(t).replace(/-/g, "+").replace(/_/g, "/");
}
Be.unescape = N0;
function _1(t) {
  return M0((0, T0.fromByteArray)(new TextEncoder().encode(t)));
}
Be.encode = _1;
function U1(t) {
  return new TextDecoder().decode((0, T0.toByteArray)(ru(N0(t))));
}
Be.decode = U1;
var Ha = {}, Oa = {}, _0 = {}, U0 = {}, Da = {};
Object.defineProperty(Da, "__esModule", { value: !0 });
Da.crypto = void 0;
Da.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = f, t.clean = d, t.createView = l, t.rotr = g, t.rotl = h, t.byteSwap = m, t.byteSwap32 = b, t.bytesToHex = U, t.hexToBytes = I, t.asyncLoop = Q, t.utf8ToBytes = H, t.bytesToUtf8 = W, t.toBytes = S, t.kdfInputToBytes = C, t.concatBytes = _, t.checkOpts = T, t.createHasher = G, t.createOptHasher = yt, t.createXOFer = ut, t.randomBytes = he;
  const e = Da;
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
  function m(E) {
    return E << 24 & 4278190080 | E << 8 & 16711680 | E >>> 8 & 65280 | E >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (E) => E : (E) => m(E), t.byteSwapIfBE = t.swap8IfBE;
  function b(E) {
    for (let M = 0; M < E.length; M++)
      E[M] = m(E[M]);
    return E;
  }
  t.swap32IfBE = t.isLE ? (E) => E : b;
  const L = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", P = /* @__PURE__ */ Array.from({ length: 256 }, (E, M) => M.toString(16).padStart(2, "0"));
  function U(E) {
    if (s(E), L)
      return E.toHex();
    let M = "";
    for (let kt = 0; kt < E.length; kt++)
      M += P[E[kt]];
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
    for (let ct = 0, xt = 0; ct < kt; ct++, xt += 2) {
      const Nt = $(E.charCodeAt(xt)), Dt = $(E.charCodeAt(xt + 1));
      if (Nt === void 0 || Dt === void 0) {
        const Vt = E[xt] + E[xt + 1];
        throw new Error('hex string expected, got non-hex character "' + Vt + '" at index ' + xt);
      }
      pt[ct] = Nt * 16 + Dt;
    }
    return pt;
  }
  const R = async () => {
  };
  t.nextTick = R;
  async function Q(E, M, kt) {
    let pt = Date.now();
    for (let ct = 0; ct < E; ct++) {
      kt(ct);
      const xt = Date.now() - pt;
      xt >= 0 && xt < M || (await (0, t.nextTick)(), pt += xt);
    }
  }
  function H(E) {
    if (typeof E != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(E));
  }
  function W(E) {
    return new TextDecoder().decode(E);
  }
  function S(E) {
    return typeof E == "string" && (E = H(E)), s(E), E;
  }
  function C(E) {
    return typeof E == "string" && (E = H(E)), s(E), E;
  }
  function _(...E) {
    let M = 0;
    for (let pt = 0; pt < E.length; pt++) {
      const ct = E[pt];
      s(ct), M += ct.length;
    }
    const kt = new Uint8Array(M);
    for (let pt = 0, ct = 0; pt < E.length; pt++) {
      const xt = E[pt];
      kt.set(xt, ct), ct += xt.length;
    }
    return kt;
  }
  function T(E, M) {
    if (M !== void 0 && {}.toString.call(M) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(E, M);
  }
  class q {
  }
  t.Hash = q;
  function G(E) {
    const M = (pt) => E().update(S(pt)).digest(), kt = E();
    return M.outputLen = kt.outputLen, M.blockLen = kt.blockLen, M.create = () => E(), M;
  }
  function yt(E) {
    const M = (pt, ct) => E(ct).update(S(pt)).digest(), kt = E({});
    return M.outputLen = kt.outputLen, M.blockLen = kt.blockLen, M.create = (pt) => E(pt), M;
  }
  function ut(E) {
    const M = (pt, ct) => E(ct).update(S(pt)).digest(), kt = E({});
    return M.outputLen = kt.outputLen, M.blockLen = kt.blockLen, M.create = (pt) => E(pt), M;
  }
  t.wrapConstructor = G, t.wrapConstructorWithOpts = yt, t.wrapXOFConstructorWithOpts = ut;
  function he(E = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(E));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(E));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(U0);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = U0;
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
})(_0);
const Ys = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function P0(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function qc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Ms(t, ...e) {
  if (!P0(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function P1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  qc(t.outputLen), qc(t.blockLen);
}
function Wc(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function H0(t, e) {
  Ms(t);
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
function ha(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function ta(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function pn(t, e) {
  return t << 32 - e | t >>> e;
}
function D1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const su = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function iu(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const O0 = su ? (t) => t : (t) => iu(t), F1 = O0;
function D0(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = iu(t[e]);
  return t;
}
const j1 = su ? (t) => t : D0, F0 = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", z1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function j0(t) {
  if (Ms(t), F0)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += z1[t[n]];
  return e;
}
const Vn = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Cf(t) {
  if (t >= Vn._0 && t <= Vn._9)
    return t - Vn._0;
  if (t >= Vn.A && t <= Vn.F)
    return t - (Vn.A - 10);
  if (t >= Vn.a && t <= Vn.f)
    return t - (Vn.a - 10);
}
function R1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (F0)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = Cf(t.charCodeAt(i)), a = Cf(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const z0 = async () => {
};
async function G1(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await z0(), r += i);
  }
}
function ou(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function K1(t) {
  return new TextDecoder().decode(t);
}
function go(t) {
  return typeof t == "string" && (t = ou(t)), Ms(t), t;
}
function V1(t) {
  return typeof t == "string" && (t = ou(t)), Ms(t), t;
}
function q1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Ms(s), e += s.length;
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
let R0 = class {
};
function Fa(t) {
  const e = (r) => t().update(go(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function G0(t) {
  const e = (r, s) => t(s).update(go(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function K0(t) {
  const e = (r, s) => t(s).update(go(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const X1 = Fa, Y1 = G0, Z1 = K0;
function Q1(t = 32) {
  if (Ys && typeof Ys.getRandomValues == "function")
    return Ys.getRandomValues(new Uint8Array(t));
  if (Ys && typeof Ys.randomBytes == "function")
    return Uint8Array.from(Ys.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const J1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: R0,
  abytes: Ms,
  aexists: Wc,
  ahash: P1,
  anumber: qc,
  aoutput: H0,
  asyncLoop: G1,
  byteSwap: iu,
  byteSwap32: D0,
  byteSwapIfBE: F1,
  bytesToHex: j0,
  bytesToUtf8: K1,
  checkOpts: W1,
  clean: ha,
  concatBytes: q1,
  createHasher: Fa,
  createOptHasher: G0,
  createView: ta,
  createXOFer: K0,
  hexToBytes: R1,
  isBytes: P0,
  isLE: su,
  kdfInputToBytes: V1,
  nextTick: z0,
  randomBytes: Q1,
  rotl: D1,
  rotr: pn,
  swap32IfBE: j1,
  swap8IfBE: O0,
  toBytes: go,
  u32: O1,
  u8: H1,
  utf8ToBytes: ou,
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
class rm extends R0 {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = ta(this.buffer);
  }
  update(e) {
    Wc(this), e = go(e), Ms(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ta(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Wc(this), H0(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, ha(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    tm(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ta(e), c = this.outputLen;
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
const yr = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), wr = /* @__PURE__ */ Uint32Array.from([
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
]), br = /* @__PURE__ */ new Uint32Array(64);
let au = class extends rm {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = yr[0] | 0, this.B = yr[1] | 0, this.C = yr[2] | 0, this.D = yr[3] | 0, this.E = yr[4] | 0, this.F = yr[5] | 0, this.G = yr[6] | 0, this.H = yr[7] | 0;
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
      const g = br[l - 15], h = br[l - 2], m = pn(g, 7) ^ pn(g, 18) ^ g >>> 3, b = pn(h, 17) ^ pn(h, 19) ^ h >>> 10;
      br[l] = b + br[l - 7] + m + br[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = pn(a, 6) ^ pn(a, 11) ^ pn(a, 25), h = d + g + em(a, c, f) + sm[l] + br[l] | 0, b = (pn(r, 2) ^ pn(r, 13) ^ pn(r, 22)) + nm(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    ha(br);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), ha(this.buffer);
  }
}, V0 = class extends au {
  constructor() {
    super(28), this.A = wr[0] | 0, this.B = wr[1] | 0, this.C = wr[2] | 0, this.D = wr[3] | 0, this.E = wr[4] | 0, this.F = wr[5] | 0, this.G = wr[6] | 0, this.H = wr[7] | 0;
  }
};
const im = /* @__PURE__ */ Fa(() => new au()), om = /* @__PURE__ */ Fa(() => new V0()), am = au, q0 = im, cm = V0, lm = om, um = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: cm,
  SHA256: am,
  sha224: lm,
  sha256: q0
}, Symbol.toStringTag, { value: "Module" })), ja = /* @__PURE__ */ Ma(um), fm = /* @__PURE__ */ Ma(wb);
var bi = {};
Object.defineProperty(bi, "__esModule", { value: !0 });
bi.joseToDer = bi.derToJose = void 0;
const W0 = po, X0 = Be;
function yc(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const dm = {
  ES256: yc(256),
  ES384: yc(384),
  ES512: yc(521)
};
function Y0(t) {
  const e = dm[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const pa = 128, Z0 = 0, hm = 32, pm = 16, gm = 2, Q0 = pm | hm | Z0 << 6, ga = gm | Z0 << 6;
function J0(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, W0.toByteArray)((0, X0.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function ym(t, e) {
  const n = J0(t), r = Y0(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Q0)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (pa | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== ga)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const f = o;
  if (o += c, n[o++] !== ga)
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
  return m.set(n.subarray(l + Math.max(-h, 0), l + d), o), (0, X0.escape)((0, W0.fromByteArray)(m));
}
bi.derToJose = ym;
function Bf(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= pa && --r, r;
}
function wm(t, e) {
  t = J0(t);
  const n = Y0(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Bf(t, 0, n), i = Bf(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, f = c < pa, d = new Uint8Array((f ? 2 : 3) + c);
  let l = 0;
  return d[l++] = Q0, f ? d[l++] = c : (d[l++] = pa | 1, d[l++] = c & 255), d[l++] = ga, d[l++] = o, s < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(s, n), l), l += n - s), d[l++] = ga, d[l++] = a, i < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + i), l), d;
}
bi.joseToDer = wm;
var nr = {};
Object.defineProperty(nr, "__esModule", { value: !0 });
nr.InvalidTokenError = nr.MissingParametersError = void 0;
class bm extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
nr.MissingParametersError = bm;
class mm extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
nr.InvalidTokenError = mm;
const yo = /* @__PURE__ */ Ma(J1);
Object.defineProperty(Oa, "__esModule", { value: !0 });
Oa.SECP256K1Client = void 0;
const xm = _0, Sm = ja, ea = fm, Tf = bi, Mf = nr, Nf = yo;
ea.utils.hmacSha256Sync = (t, ...e) => {
  const n = xm.hmac.create(Sm.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class tp {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Nf.bytesToHex)(ea.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Mf.MissingParametersError("a signing input hash and private key are all required");
    const s = ea.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Nf.bytesToHex)(s);
    if (r === "jose")
      return (0, Tf.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Tf.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Mf.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return ea.verify(n, e, r, { strict: !1 });
  }
}
Oa.SECP256K1Client = tp;
tp.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Oa;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Ha);
var gs = {};
const Em = /* @__PURE__ */ Ma(i0);
var Am = Me && Me.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(gs, "__esModule", { value: !0 });
gs.hashSha256Async = gs.hashSha256 = void 0;
const vm = ja;
function ep(t) {
  return (0, vm.sha256)(t);
}
gs.hashSha256 = ep;
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
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(ep(t));
    }
  });
}
gs.hashSha256Async = $m;
var Im = Me && Me.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(wi, "__esModule", { value: !0 });
wi.TokenSigner = wi.createUnsecuredToken = void 0;
const Xc = Be, _f = Ha, km = nr, Uf = gs;
function Yc(t, e) {
  const n = [], r = Xc.encode(JSON.stringify(e));
  n.push(r);
  const s = Xc.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function Lm(t) {
  return Yc(t, { typ: "JWT", alg: "none" }) + ".";
}
wi.createUnsecuredToken = Lm;
class Cm {
  constructor(e, n) {
    if (!(e && n))
      throw new km.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !_f.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = _f.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = Yc(e, s), o = (0, Uf.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return Im(this, void 0, void 0, function* () {
      const s = this.header(r), i = Yc(e, s), o = yield (0, Uf.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [Xc.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
wi.TokenSigner = Cm;
var za = {};
Object.defineProperty(za, "__esModule", { value: !0 });
za.TokenVerifier = void 0;
const Bm = Be, Pf = Ha, Tm = nr, To = gs;
class Mm {
  constructor(e, n) {
    if (!(e && n))
      throw new Tm.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Pf.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Pf.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, To.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, To.hashSha256)(s);
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
      return (0, To.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, To.hashSha256)(r);
      return i(o);
    }
  }
}
za.TokenVerifier = Mm;
var Ra = {};
Object.defineProperty(Ra, "__esModule", { value: !0 });
Ra.decodeToken = void 0;
const Mo = Be;
function Nm(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Mo.decode(e[0])), r = JSON.parse(Mo.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Mo.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Mo.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Ra.decodeToken = Nm;
(function(t) {
  var e = Me && Me.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = Me && Me.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(wi, t), n(za, t), n(Ra, t), n(nr, t), n(Ha, t);
})(ve);
function _m(t) {
  return `did:btc-addr:${t}`;
}
function Um(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new gf("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new gf('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function np(t) {
  if (t)
    return Um(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Pm = "1.4.0";
function Hm() {
  return E1();
}
function Om(t, e, n, r = Xh.slice(), s, i = mw().getTime(), o = {}) {
  const a = (h) => {
    const m = Vl("location", {
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
  const d = I0(f);
  return c.iss = _m(d), new ve.TokenSigner("ES256k", t).sign(c);
}
async function Hf(t, e) {
  const n = fo(Pt(e)), r = JSON.parse(n), s = await B0(t, r);
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
  const n = e.public_keys, r = np(e.iss);
  if (n.length === 1) {
    if (I0(n[0]) === r)
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
const Of = "1.0.0";
class zr {
  constructor(e) {
    this.version = Of, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Of)
      throw new jc(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new zr(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class rp {
  constructor(e) {
    if (e) {
      const n = new zr(e);
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
class Df extends rp {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new zr({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Yh("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new zr({})), !0;
  }
}
class Ff extends rp {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = yw, !localStorage.getItem(this.key)) {
      const r = new zr({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Yh("No session data was found in localStorage");
    const n = JSON.parse(e);
    return zr.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new zr({})), !0;
  }
}
var Ji;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Ji || (Ji = {}));
var ya;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ya || (ya = {}));
Ji.Mainnet;
var Qn;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Qn || (Qn = {}));
var Un;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Un || (Un = {}));
Qn.Mainnet;
const sp = {
  chainId: Ji.Mainnet,
  transactionVersion: Qn.Mainnet,
  peerNetworkId: ya.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Un.MainnetSingleSig,
    multiSig: Un.MainnetMultiSig
  },
  client: { baseUrl: Zh }
}, Zc = {
  chainId: Ji.Testnet,
  transactionVersion: Qn.Testnet,
  peerNetworkId: ya.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Un.TestnetSingleSig,
    multiSig: Un.TestnetMultiSig
  },
  client: { baseUrl: Qh }
}, na = {
  ...Zc,
  addressVersion: { ...Zc.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Jh }
}, Gm = {
  ...na,
  addressVersion: { ...na.addressVersion },
  client: { ...na.client }
};
function Km(t) {
  switch (t) {
    case "mainnet":
      return sp;
    case "testnet":
      return Zc;
    case "devnet":
      return na;
    case "mocknet":
      return Gm;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function ip(t) {
  return typeof t == "string" ? Km(t) : t;
}
var jf;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(jf || (jf = {}));
var zf;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(zf || (zf = {}));
var yn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(yn || (yn = {}));
const wc = ["onChainOnly", "offChainOnly", "any"];
wc[0] + "", yn.OnChainOnly, wc[1] + "", yn.OffChainOnly, wc[2] + "", yn.Any, yn.OnChainOnly + "", yn.OnChainOnly, yn.OffChainOnly + "", yn.OffChainOnly, yn.Any + "", yn.Any;
var Rf;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Rf || (Rf = {}));
var Gf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Gf || (Gf = {}));
var Kf;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Kf || (Kf = {}));
var Yn;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Yn || (Yn = {}));
var Vf;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Vf || (Vf = {}));
var qf;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(qf || (qf = {}));
var Wf;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Wf || (Wf = {}));
var Xf;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Xf || (Xf = {}));
var Yf;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Yf || (Yf = {}));
var Zf;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Zf || (Zf = {}));
var Qf;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Qf || (Qf = {}));
var Jf;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Jf || (Jf = {}));
var td;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(td || (td = {}));
function Qc(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Vm(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function op(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function qm(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Qc(t.outputLen), Qc(t.blockLen);
}
function Wm(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Xm(t, e) {
  op(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ns = {
  number: Qc,
  bool: Vm,
  bytes: op,
  hash: qm,
  exists: Wm,
  output: Xm
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const bc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Cn = (t, e) => t << 32 - e | t >>> e, Ym = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Ym)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Zm(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function cu(t) {
  if (typeof t == "string" && (t = Zm(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let ap = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ns(t) {
  const e = (r) => t().update(cu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let cp = class extends ap {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ns.hash(e);
    const r = cu(n);
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
};
const lp = (t, e, n) => new cp(t, e).update(n).digest();
lp.create = (t, e) => new cp(t, e);
function Qm(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let lu = class extends ap {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = bc(this.buffer);
  }
  update(e) {
    ns.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = cu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = bc(e);
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
    Qm(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = bc(e), c = this.outputLen;
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
let up = class extends lu {
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
      const g = xr[l - 15], h = xr[l - 2], m = Cn(g, 7) ^ Cn(g, 18) ^ g >>> 3, b = Cn(h, 17) ^ Cn(h, 19) ^ h >>> 10;
      xr[l] = b + xr[l - 7] + m + xr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Cn(a, 6) ^ Cn(a, 11) ^ Cn(a, 25), h = d + g + Jm(a, c, f) + e2[l] + xr[l] | 0, b = (Cn(r, 2) ^ Cn(r, 13) ^ Cn(r, 22)) + t2(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    xr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, n2 = class extends up {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const fp = Ns(() => new up());
Ns(() => new n2());
var _s = {}, uu = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = yo;
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
        const L = 1 + f, P = b % (1 << L) << 5 - L, U = t.c32[m + P];
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
      const P = (t.c32.indexOf(o[b]) << g) + l, U = n[P % 16];
      if (g += 1, l = P >> 4, l > 1 << g)
        throw new Error("Panic error in decoding.");
      d.unshift(U);
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
      for (let L = 0; L < b; L += 2)
        m = `00${m}`;
    }
    return m;
  }
  t.c32decode = i;
})(uu);
var ys = {};
Object.defineProperty(ys, "__esModule", { value: !0 });
ys.c32checkDecode = ys.c32checkEncode = void 0;
const ed = ja, nd = yo, Wi = uu;
function dp(t) {
  const e = (0, ed.sha256)((0, ed.sha256)((0, nd.hexToBytes)(t)));
  return (0, nd.bytesToHex)(e.slice(0, 4));
}
function r2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = dp(`${n}${e}`), s = (0, Wi.c32encode)(`${e}${r}`);
  return `${Wi.c32[t]}${s}`;
}
ys.c32checkEncode = r2;
function s2(t) {
  t = (0, Wi.c32normalize)(t);
  const e = (0, Wi.c32decode)(t.slice(1)), n = t[0], r = Wi.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), dp(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
ys.c32checkDecode = s2;
var hp = {}, mi = {};
Object.defineProperty(mi, "__esModule", { value: !0 });
mi.decode = mi.encode = void 0;
const wa = ja, rd = yo, pp = S0, gp = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function i2(t, e = "00") {
  const n = typeof t == "string" ? (0, rd.hexToBytes)(t) : t, r = typeof e == "string" ? (0, rd.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, wa.sha256)((0, wa.sha256)(new Uint8Array([...r, ...n])));
  return pp(gp).encode([...r, ...n, ...s.slice(0, 4)]);
}
mi.encode = i2;
function o2(t) {
  const e = pp(gp).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, wa.sha256)((0, wa.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
mi.decode = o2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = ys, n = mi, r = yo;
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
    let L = b.toString(16);
    return L.length === 1 && (L = `0${L}`), n.encode(m, L);
  }
  t.c32ToB58 = f;
})(hp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = uu;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = ys;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = hp;
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
})(_s);
function a2(t, e) {
  switch (e = ip(e ?? sp), t) {
    case Yn.P2PKH:
      switch (e.transactionVersion) {
        case Qn.Mainnet:
          return Un.MainnetSingleSig;
        case Qn.Testnet:
          return Un.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Yn.P2SH:
    case Yn.P2SHNonSequential:
    case Yn.P2WPKH:
    case Yn.P2WSH:
    case Yn.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Qn.Mainnet:
          return Un.MainnetMultiSig;
        case Qn.Testnet:
          return Un.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const c2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), yp = Uint8Array.from({ length: 16 }, (t, e) => e), l2 = yp.map((t) => (9 * t + 5) % 16);
let fu = [yp], du = [l2];
for (let t = 0; t < 4; t++)
  for (let e of [fu, du])
    e.push(e[t].map((n) => c2[n]));
const wp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), u2 = fu.map((t, e) => t.map((n) => wp[e][n])), f2 = du.map((t, e) => t.map((n) => wp[e][n])), d2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), h2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), No = (t, e) => t << e | t >>> 32 - e;
function sd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const _o = new Uint32Array(16);
let p2 = class extends lu {
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
      const m = 4 - h, b = d2[h], L = h2[h], P = fu[h], U = du[h], p = u2[h], $ = f2[h];
      for (let I = 0; I < 16; I++) {
        const R = No(r + sd(h, i, a, f) + _o[P[I]] + b, p[I]) + l | 0;
        r = l, l = f, f = No(a, 10) | 0, a = i, i = R;
      }
      for (let I = 0; I < 16; I++) {
        const R = No(s + sd(m, o, c, d) + _o[U[I]] + L, $[I]) + g | 0;
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
const g2 = Ns(() => new p2()), Uo = BigInt(2 ** 32 - 1), Jc = BigInt(32);
function bp(t, e = !1) {
  return e ? { h: Number(t & Uo), l: Number(t >> Jc & Uo) } : { h: Number(t >> Jc & Uo) | 0, l: Number(t & Uo) | 0 };
}
function y2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = bp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const w2 = (t, e) => BigInt(t >>> 0) << Jc | BigInt(e >>> 0), b2 = (t, e, n) => t >>> n, m2 = (t, e, n) => t << 32 - n | e >>> n, x2 = (t, e, n) => t >>> n | e << 32 - n, S2 = (t, e, n) => t << 32 - n | e >>> n, E2 = (t, e, n) => t << 64 - n | e >>> n - 32, A2 = (t, e, n) => t >>> n - 32 | e << 64 - n, v2 = (t, e) => e, $2 = (t, e) => t, I2 = (t, e, n) => t << n | e >>> 32 - n, k2 = (t, e, n) => e << n | t >>> 32 - n, L2 = (t, e, n) => e << n - 32 | t >>> 64 - n, C2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function B2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const T2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), M2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, N2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), _2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, U2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), P2 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, At = {
  fromBig: bp,
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
}, [H2, O2] = At.split([
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
let Ga = class extends lu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: m, Hh: b, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, m, b, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, m, b, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = m | 0, this.Hh = b | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Sr[p] = e.getUint32(n), Er[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const $ = Sr[p - 15] | 0, I = Er[p - 15] | 0, R = At.rotrSH($, I, 1) ^ At.rotrSH($, I, 8) ^ At.shrSH($, I, 7), Q = At.rotrSL($, I, 1) ^ At.rotrSL($, I, 8) ^ At.shrSL($, I, 7), H = Sr[p - 2] | 0, W = Er[p - 2] | 0, S = At.rotrSH(H, W, 19) ^ At.rotrBH(H, W, 61) ^ At.shrSH(H, W, 6), C = At.rotrSL(H, W, 19) ^ At.rotrBL(H, W, 61) ^ At.shrSL(H, W, 6), _ = At.add4L(Q, C, Er[p - 7], Er[p - 16]), T = At.add4H(_, R, S, Sr[p - 7], Sr[p - 16]);
      Sr[p] = T | 0, Er[p] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: m, Gh: b, Gl: L, Hh: P, Hl: U } = this;
    for (let p = 0; p < 80; p++) {
      const $ = At.rotrSH(l, g, 14) ^ At.rotrSH(l, g, 18) ^ At.rotrBH(l, g, 41), I = At.rotrSL(l, g, 14) ^ At.rotrSL(l, g, 18) ^ At.rotrBL(l, g, 41), R = l & h ^ ~l & b, Q = g & m ^ ~g & L, H = At.add5L(U, I, Q, O2[p], Er[p]), W = At.add5H(H, P, $, R, H2[p], Sr[p]), S = H | 0, C = At.rotrSH(r, s, 28) ^ At.rotrBH(r, s, 34) ^ At.rotrBH(r, s, 39), _ = At.rotrSL(r, s, 28) ^ At.rotrBL(r, s, 34) ^ At.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, q = s & o ^ s & c ^ o & c;
      P = b | 0, U = L | 0, b = h | 0, L = m | 0, h = l | 0, m = g | 0, { h: l, l: g } = At.add(f | 0, d | 0, W | 0, S | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const G = At.add3L(S, _, q);
      r = At.add3H(G, W, C, T), s = G | 0;
    }
    ({ h: r, l: s } = At.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = At.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = At.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = At.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = At.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: m } = At.add(this.Fh | 0, this.Fl | 0, h | 0, m | 0), { h: b, l: L } = At.add(this.Gh | 0, this.Gl | 0, b | 0, L | 0), { h: P, l: U } = At.add(this.Hh | 0, this.Hl | 0, P | 0, U | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, m, b, L, P, U);
  }
  roundClean() {
    Sr.fill(0), Er.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, D2 = class extends Ga {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, F2 = class extends Ga {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, j2 = class extends Ga {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ns(() => new Ga());
Ns(() => new D2());
Ns(() => new F2());
Ns(() => new j2());
var ba = { exports: {} };
ba.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", f = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", g = "[object Map]", h = "[object Number]", m = "[object Object]", b = "[object Promise]", L = "[object RegExp]", P = "[object Set]", U = "[object String]", p = "[object Symbol]", $ = "[object WeakMap]", I = "[object ArrayBuffer]", R = "[object DataView]", Q = "[object Float32Array]", H = "[object Float64Array]", W = "[object Int8Array]", S = "[object Int16Array]", C = "[object Int32Array]", _ = "[object Uint8Array]", T = "[object Uint8ClampedArray]", q = "[object Uint16Array]", G = "[object Uint32Array]", yt = /[\\^$.*+?()[\]{}|]/g, ut = /\w*$/, he = /^\[object .+?Constructor\]$/, E = /^(?:0|[1-9]\d*)$/, M = {};
  M[i] = M[o] = M[I] = M[R] = M[a] = M[c] = M[Q] = M[H] = M[W] = M[S] = M[C] = M[g] = M[h] = M[m] = M[L] = M[P] = M[U] = M[p] = M[_] = M[T] = M[q] = M[G] = !0, M[f] = M[d] = M[$] = !1;
  var kt = typeof Me == "object" && Me && Me.Object === Object && Me, pt = typeof self == "object" && self && self.Object === Object && self, ct = kt || pt || Function("return this")(), xt = e && !e.nodeType && e, Nt = xt && !0 && t && !t.nodeType && t, Dt = Nt && Nt.exports === xt;
  function Vt(y, k) {
    return y.set(k[0], k[1]), y;
  }
  function pe(y, k) {
    return y.add(k), y;
  }
  function Ut(y, k) {
    for (var N = -1, et = y ? y.length : 0; ++N < et && k(y[N], N, y) !== !1; )
      ;
    return y;
  }
  function ze(y, k) {
    for (var N = -1, et = k.length, Ee = y.length; ++N < et; )
      y[Ee + N] = k[N];
    return y;
  }
  function un(y, k, N, et) {
    for (var Ee = -1, Pe = y ? y.length : 0; ++Ee < Pe; )
      N = k(N, y[Ee], Ee, y);
    return N;
  }
  function B(y, k) {
    for (var N = -1, et = Array(y); ++N < y; )
      et[N] = k(N);
    return et;
  }
  function Y(y, k) {
    return y == null ? void 0 : y[k];
  }
  function z(y) {
    var k = !1;
    if (y != null && typeof y.toString != "function")
      try {
        k = !!(y + "");
      } catch {
      }
    return k;
  }
  function ot(y) {
    var k = -1, N = Array(y.size);
    return y.forEach(function(et, Ee) {
      N[++k] = [Ee, et];
    }), N;
  }
  function it(y, k) {
    return function(N) {
      return y(k(N));
    };
  }
  function Tt(y) {
    var k = -1, N = Array(y.size);
    return y.forEach(function(et) {
      N[++k] = et;
    }), N;
  }
  var gt = Array.prototype, Gt = Function.prototype, Ft = Object.prototype, Ht = ct["__core-js_shared__"], ce = function() {
    var y = /[^.]+$/.exec(Ht && Ht.keys && Ht.keys.IE_PROTO || "");
    return y ? "Symbol(src)_1." + y : "";
  }(), lt = Gt.toString, ft = Ft.hasOwnProperty, u = Ft.toString, x = RegExp(
    "^" + lt.call(ft).replace(yt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), A = Dt ? ct.Buffer : void 0, O = ct.Symbol, rt = ct.Uint8Array, dt = it(Object.getPrototypeOf, Object), le = Object.create, ee = Ft.propertyIsEnumerable, xe = gt.splice, fn = Object.getOwnPropertySymbols, dn = A ? A.isBuffer : void 0, hn = it(Object.keys, Object), Se = qs(ct, "DataView"), An = qs(ct, "Map"), Ze = qs(ct, "Promise"), ht = qs(ct, "Set"), Ot = qs(ct, "WeakMap"), Xt = qs(Object, "create"), we = Zr(Se), qr = Zr(An), zt = Zr(Ze), $e = Zr(ht), ir = Zr(Ot), vn = O ? O.prototype : void 0, $n = vn ? vn.valueOf : void 0;
  function ge(y) {
    var k = -1, N = y ? y.length : 0;
    for (this.clear(); ++k < N; ) {
      var et = y[k];
      this.set(et[0], et[1]);
    }
  }
  function In() {
    this.__data__ = Xt ? Xt(null) : {};
  }
  function Qe(y) {
    return this.has(y) && delete this.__data__[y];
  }
  function or(y) {
    var k = this.__data__;
    if (Xt) {
      var N = k[y];
      return N === r ? void 0 : N;
    }
    return ft.call(k, y) ? k[y] : void 0;
  }
  function ar(y) {
    var k = this.__data__;
    return Xt ? k[y] !== void 0 : ft.call(k, y);
  }
  function Ds(y, k) {
    var N = this.__data__;
    return N[y] = Xt && k === void 0 ? r : k, this;
  }
  ge.prototype.clear = In, ge.prototype.delete = Qe, ge.prototype.get = or, ge.prototype.has = ar, ge.prototype.set = Ds;
  function _e(y) {
    var k = -1, N = y ? y.length : 0;
    for (this.clear(); ++k < N; ) {
      var et = y[k];
      this.set(et[0], et[1]);
    }
  }
  function Fs() {
    this.__data__ = [];
  }
  function js(y) {
    var k = this.__data__, N = Vs(k, y);
    if (N < 0)
      return !1;
    var et = k.length - 1;
    return N == et ? k.pop() : xe.call(k, N, 1), !0;
  }
  function zs(y) {
    var k = this.__data__, N = Vs(k, y);
    return N < 0 ? void 0 : k[N][1];
  }
  function Je(y) {
    return Vs(this.__data__, y) > -1;
  }
  function Rs(y, k) {
    var N = this.__data__, et = Vs(N, y);
    return et < 0 ? N.push([y, k]) : N[et][1] = k, this;
  }
  _e.prototype.clear = Fs, _e.prototype.delete = js, _e.prototype.get = zs, _e.prototype.has = Je, _e.prototype.set = Rs;
  function tn(y) {
    var k = -1, N = y ? y.length : 0;
    for (this.clear(); ++k < N; ) {
      var et = y[k];
      this.set(et[0], et[1]);
    }
  }
  function Gs() {
    this.__data__ = {
      hash: new ge(),
      map: new (An || _e)(),
      string: new ge()
    };
  }
  function cr(y) {
    return Xr(this, y).delete(y);
  }
  function lr(y) {
    return Xr(this, y).get(y);
  }
  function D(y) {
    return Xr(this, y).has(y);
  }
  function Z(y, k) {
    return Xr(this, y).set(y, k), this;
  }
  tn.prototype.clear = Gs, tn.prototype.delete = cr, tn.prototype.get = lr, tn.prototype.has = D, tn.prototype.set = Z;
  function Yt(y) {
    this.__data__ = new _e(y);
  }
  function ye() {
    this.__data__ = new _e();
  }
  function ne(y) {
    return this.__data__.delete(y);
  }
  function Wr(y) {
    return this.__data__.get(y);
  }
  function Gn(y) {
    return this.__data__.has(y);
  }
  function ur(y, k) {
    var N = this.__data__;
    if (N instanceof _e) {
      var et = N.__data__;
      if (!An || et.length < n - 1)
        return et.push([y, k]), this;
      N = this.__data__ = new tn(et);
    }
    return N.set(y, k), this;
  }
  Yt.prototype.clear = ye, Yt.prototype.delete = ne, Yt.prototype.get = Wr, Yt.prototype.has = Gn, Yt.prototype.set = ur;
  function Ks(y, k) {
    var N = cc(y) || Py(y) ? B(y.length, String) : [], et = N.length, Ee = !!et;
    for (var Pe in y)
      ft.call(y, Pe) && !(Ee && (Pe == "length" || My(Pe, et))) && N.push(Pe);
    return N;
  }
  function en(y, k, N) {
    var et = y[k];
    (!(ft.call(y, k) && sf(et, N)) || N === void 0 && !(k in y)) && (y[k] = N);
  }
  function Vs(y, k) {
    for (var N = y.length; N--; )
      if (sf(y[N][0], k))
        return N;
    return -1;
  }
  function Ui(y, k) {
    return y && fr(k, lc(k), y);
  }
  function Pi(y, k, N, et, Ee, Pe, Kn) {
    var He;
    if (et && (He = Pe ? et(y, Ee, Pe, Kn) : et(y)), He !== void 0)
      return He;
    if (!So(y))
      return y;
    var cf = cc(y);
    if (cf) {
      if (He = Cy(y), !k)
        return Ue(y, He);
    } else {
      var Ws = Yr(y), lf = Ws == d || Ws == l;
      if (Oy(y))
        return F(y, k);
      if (Ws == m || Ws == i || lf && !Pe) {
        if (z(y))
          return Pe ? y : {};
        if (He = By(lf ? {} : y), !k)
          return nn(y, Ui(He, y));
      } else {
        if (!M[Ws])
          return Pe ? y : {};
        He = Ty(y, Ws, Pi, k);
      }
    }
    Kn || (Kn = new Yt());
    var uf = Kn.get(y);
    if (uf)
      return uf;
    if (Kn.set(y, He), !cf)
      var ff = N ? kn(y) : lc(y);
    return Ut(ff || y, function(uc, Eo) {
      ff && (Eo = uc, uc = y[Eo]), en(He, Eo, Pi(uc, k, N, et, Eo, y, Kn));
    }), He;
  }
  function oc(y) {
    return So(y) ? le(y) : {};
  }
  function Hi(y, k, N) {
    var et = k(y);
    return cc(y) ? et : ze(et, N(y));
  }
  function ac(y) {
    return u.call(y);
  }
  function w(y) {
    if (!So(y) || _y(y))
      return !1;
    var k = af(y) || z(y) ? x : he;
    return k.test(Zr(y));
  }
  function v(y) {
    if (!rf(y))
      return hn(y);
    var k = [];
    for (var N in Object(y))
      ft.call(y, N) && N != "constructor" && k.push(N);
    return k;
  }
  function F(y, k) {
    if (k)
      return y.slice();
    var N = new y.constructor(y.length);
    return y.copy(N), N;
  }
  function J(y) {
    var k = new y.constructor(y.byteLength);
    return new rt(k).set(new rt(y)), k;
  }
  function tt(y, k) {
    var N = k ? J(y.buffer) : y.buffer;
    return new y.constructor(N, y.byteOffset, y.byteLength);
  }
  function K(y, k, N) {
    var et = k ? N(ot(y), !0) : ot(y);
    return un(et, Vt, new y.constructor());
  }
  function wt(y) {
    var k = new y.constructor(y.source, ut.exec(y));
    return k.lastIndex = y.lastIndex, k;
  }
  function St(y, k, N) {
    var et = k ? N(Tt(y), !0) : Tt(y);
    return un(et, pe, new y.constructor());
  }
  function bt(y) {
    return $n ? Object($n.call(y)) : {};
  }
  function Ie(y, k) {
    var N = k ? J(y.buffer) : y.buffer;
    return new y.constructor(N, y.byteOffset, y.length);
  }
  function Ue(y, k) {
    var N = -1, et = y.length;
    for (k || (k = Array(et)); ++N < et; )
      k[N] = y[N];
    return k;
  }
  function fr(y, k, N, et) {
    N || (N = {});
    for (var Ee = -1, Pe = k.length; ++Ee < Pe; ) {
      var Kn = k[Ee], He = void 0;
      en(N, Kn, He === void 0 ? y[Kn] : He);
    }
    return N;
  }
  function nn(y, k) {
    return fr(y, nf(y), k);
  }
  function kn(y) {
    return Hi(y, lc, nf);
  }
  function Xr(y, k) {
    var N = y.__data__;
    return Ny(k) ? N[typeof k == "string" ? "string" : "hash"] : N.map;
  }
  function qs(y, k) {
    var N = Y(y, k);
    return w(N) ? N : void 0;
  }
  var nf = fn ? it(fn, Object) : jy, Yr = ac;
  (Se && Yr(new Se(new ArrayBuffer(1))) != R || An && Yr(new An()) != g || Ze && Yr(Ze.resolve()) != b || ht && Yr(new ht()) != P || Ot && Yr(new Ot()) != $) && (Yr = function(y) {
    var k = u.call(y), N = k == m ? y.constructor : void 0, et = N ? Zr(N) : void 0;
    if (et)
      switch (et) {
        case we:
          return R;
        case qr:
          return g;
        case zt:
          return b;
        case $e:
          return P;
        case ir:
          return $;
      }
    return k;
  });
  function Cy(y) {
    var k = y.length, N = y.constructor(k);
    return k && typeof y[0] == "string" && ft.call(y, "index") && (N.index = y.index, N.input = y.input), N;
  }
  function By(y) {
    return typeof y.constructor == "function" && !rf(y) ? oc(dt(y)) : {};
  }
  function Ty(y, k, N, et) {
    var Ee = y.constructor;
    switch (k) {
      case I:
        return J(y);
      case a:
      case c:
        return new Ee(+y);
      case R:
        return tt(y, et);
      case Q:
      case H:
      case W:
      case S:
      case C:
      case _:
      case T:
      case q:
      case G:
        return Ie(y, et);
      case g:
        return K(y, et, N);
      case h:
      case U:
        return new Ee(y);
      case L:
        return wt(y);
      case P:
        return St(y, et, N);
      case p:
        return bt(y);
    }
  }
  function My(y, k) {
    return k = k ?? s, !!k && (typeof y == "number" || E.test(y)) && y > -1 && y % 1 == 0 && y < k;
  }
  function Ny(y) {
    var k = typeof y;
    return k == "string" || k == "number" || k == "symbol" || k == "boolean" ? y !== "__proto__" : y === null;
  }
  function _y(y) {
    return !!ce && ce in y;
  }
  function rf(y) {
    var k = y && y.constructor, N = typeof k == "function" && k.prototype || Ft;
    return y === N;
  }
  function Zr(y) {
    if (y != null) {
      try {
        return lt.call(y);
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
    return Pi(y, !0, !0);
  }
  function sf(y, k) {
    return y === k || y !== y && k !== k;
  }
  function Py(y) {
    return Hy(y) && ft.call(y, "callee") && (!ee.call(y, "callee") || u.call(y) == i);
  }
  var cc = Array.isArray;
  function of(y) {
    return y != null && Dy(y.length) && !af(y);
  }
  function Hy(y) {
    return Fy(y) && of(y);
  }
  var Oy = dn || zy;
  function af(y) {
    var k = So(y) ? u.call(y) : "";
    return k == d || k == l;
  }
  function Dy(y) {
    return typeof y == "number" && y > -1 && y % 1 == 0 && y <= s;
  }
  function So(y) {
    var k = typeof y;
    return !!y && (k == "object" || k == "function");
  }
  function Fy(y) {
    return !!y && typeof y == "object";
  }
  function lc(y) {
    return of(y) ? Ks(y) : v(y);
  }
  function jy() {
    return [];
  }
  function zy() {
    return !1;
  }
  t.exports = Uy;
})(ba, ba.exports);
var z2 = ba.exports;
const mp = /* @__PURE__ */ Kh(z2);
var tl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(tl || (tl = {}));
function R2(t, e) {
  return { type: tl.Address, version: t, hash160: e };
}
function G2(t) {
  return _s.c32address(t.version, t.hash160);
}
const K2 = (t) => g2(fp(t)), V2 = (t) => st(K2(t));
ae.hmacSha256Sync = (t, ...e) => {
  const n = lp.create(fp, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function q2(t, e = "mainnet") {
  e = ip(e), t = typeof t == "string" ? Pt(t) : t;
  const n = a2(Yn.P2PKH, e), r = R2(n, V2(t));
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
const id = "_blockstackDidCheckEchoReply", Y2 = "echoReply", Z2 = "authContinuation";
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
  const e = t[id];
  if (typeof e == "boolean")
    return e;
  const n = Q2(t.location.search), r = n[Y2];
  if (r) {
    t[id] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[Z2];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class el {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new t0();
    else
      throw new bw("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Ff(e.sessionOptions) : this.store = new Ff() : e ? this.store = new Df(e.sessionOptions) : this.store = new Df();
  }
  makeAuthRequestToken(e, n, r, s, i, o = xw().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new jc("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, Om(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Hm();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Vl("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (J2())
        return ni.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      ni.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Rw()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Ao("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = ve.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Rm(e))
      throw new Ao("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (dc(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Hf(s, i.private_key);
          } catch {
            if (ni.warn("Failed decryption of appPrivateKey, will try to use as given"), !ae.isValidPrivateKey(i.private_key))
              throw new Ao("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Hf(s, c);
          } catch {
            ni.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Ao("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let f = Mw, d;
    dc(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (f = i.hubUrl), dc(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (d = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: np(i.iss),
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
      throw new jc("No user data found. Did the user sign in?");
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
el.prototype.makeAuthRequest = el.prototype.makeAuthRequestToken;
const tx = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], ex = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = tx(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!Ka(r.id));
  return e.concat(n);
}, Ka = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), xp = "STX_PROVIDER", ws = () => typeof window > "u" ? null : window.localStorage.getItem(xp), nx = (t) => {
  typeof window < "u" && window.localStorage.setItem(xp, t);
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
var xi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(xi || (xi = {}));
var bs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(bs || (bs = {}));
var od;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(od || (od = {}));
const ax = "https://api.mainnet.hiro.so", cx = "https://api.testnet.hiro.so", lx = "http://localhost:3999", ux = ["mainnet", "testnet", "devnet", "mocknet"];
class ms {
  constructor(e) {
    this.version = bs.Mainnet, this.chainId = xi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === bs.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
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
ms.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new nl();
    case "testnet":
      return new rl();
    case "devnet":
      return new fx();
    case "mocknet":
      return new Sp();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${ux.join(", ")}`);
  }
};
ms.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : ms.fromName(t);
class nl extends ms {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? ax,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = bs.Mainnet, this.chainId = xi.Mainnet;
  }
}
class rl extends ms {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? cx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = bs.Testnet, this.chainId = xi.Testnet;
  }
}
class Sp extends ms {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? lx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = bs.Testnet, this.chainId = xi.Testnet;
  }
}
const fx = Sp;
var xs;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(xs || (xs = {}));
var ma;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ma || (ma = {}));
xs.Mainnet;
var Ss;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ss || (Ss = {}));
var Es;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Es || (Es = {}));
Ss.Mainnet;
const dx = {
  chainId: xs.Mainnet,
  transactionVersion: Ss.Mainnet,
  peerNetworkId: ma.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Es.MainnetSingleSig,
    multiSig: Es.MainnetMultiSig
  },
  client: { baseUrl: Zh }
}, sl = {
  chainId: xs.Testnet,
  transactionVersion: Ss.Testnet,
  peerNetworkId: ma.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Es.TestnetSingleSig,
    multiSig: Es.TestnetMultiSig
  },
  client: { baseUrl: Qh }
}, ra = {
  ...sl,
  addressVersion: { ...sl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Jh }
}, hx = {
  ...ra,
  addressVersion: { ...ra.addressVersion },
  client: { ...ra.client }
};
function px(t) {
  switch (t) {
    case "mainnet":
      return dx;
    case "testnet":
      return sl;
    case "devnet":
      return ra;
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
const ad = /* @__PURE__ */ new Map();
function Ep(t, e) {
  const n = ad.get(t);
  if (n !== void 0)
    return n(e);
  const r = yx(t);
  return ad.set(t, r), Ep(t, e);
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
    if (Ep(e, r))
      return r;
    throw n(r);
  }
};
const wx = 128, bx = 128, Ap = 16, cs = 32, il = 80, Va = 65, mx = 32, xx = 64, xa = 34, Sx = 1 + 16 * 1024 * 1024, Ex = 165, Ax = 16, vx = 16, $x = 20, Ix = vx + 2 + $x, kx = Ix + 4, Lx = Sx + (Ex + Ax * kx);
var Rt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Rt || (Rt = {}));
var ol;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(ol || (ol = {}));
var Ge;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ge || (Ge = {}));
const mc = ["onChainOnly", "offChainOnly", "any"];
mc[0] + "", Ge.OnChainOnly, mc[1] + "", Ge.OffChainOnly, mc[2] + "", Ge.Any, Ge.OnChainOnly + "", Ge.OnChainOnly, Ge.OffChainOnly + "", Ge.OffChainOnly, Ge.Any + "", Ge.Any;
var Sa;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Sa || (Sa = {}));
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
var Xi;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Xi || (Xi = {}));
var al;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(al || (al = {}));
var cl;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(cl || (cl = {}));
var Te;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Te || (Te = {}));
var cd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(cd || (cd = {}));
var ll;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(ll || (ll = {}));
var bn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(bn || (bn = {}));
var ld;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(ld || (ld = {}));
let qa = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, ri = class extends qa {
  constructor(e) {
    super(e);
  }
}, Ce = class extends qa {
  constructor(e) {
    super(e);
  }
}, Ea = class extends qa {
  constructor(e) {
    super(e);
  }
}, rs = class extends qa {
  constructor(e) {
    super(e);
  }
};
function ul(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Cx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function vp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Bx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ul(t.outputLen), ul(t.blockLen);
}
function Tx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Mx(t, e) {
  vp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ss = {
  number: ul,
  bool: Cx,
  bytes: vp,
  hash: Bx,
  exists: Tx,
  output: Mx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const xc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Bn = (t, e) => t << 32 - e | t >>> e, Nx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Nx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function _x(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function hu(t) {
  if (typeof t == "string" && (t = _x(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let $p = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Us(t) {
  const e = (r) => t().update(hu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Ip = class extends $p {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ss.hash(e);
    const r = hu(n);
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
    return ss.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ss.exists(this), ss.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const kp = (t, e, n) => new Ip(t, e).update(n).digest();
kp.create = (t, e) => new Ip(t, e);
function Ux(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let pu = class extends $p {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = xc(this.buffer);
  }
  update(e) {
    ss.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = hu(e);
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
    ss.exists(this), ss.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Ux(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
]), Ar = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), vr = new Uint32Array(64);
let Lp = class extends pu {
  constructor() {
    super(64, 32, 8, !1), this.A = Ar[0] | 0, this.B = Ar[1] | 0, this.C = Ar[2] | 0, this.D = Ar[3] | 0, this.E = Ar[4] | 0, this.F = Ar[5] | 0, this.G = Ar[6] | 0, this.H = Ar[7] | 0;
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
      vr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const g = vr[l - 15], h = vr[l - 2], m = Bn(g, 7) ^ Bn(g, 18) ^ g >>> 3, b = Bn(h, 17) ^ Bn(h, 19) ^ h >>> 10;
      vr[l] = b + vr[l - 7] + m + vr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Bn(a, 6) ^ Bn(a, 11) ^ Bn(a, 25), h = d + g + Px(a, c, f) + Ox[l] + vr[l] | 0, b = (Bn(r, 2) ^ Bn(r, 13) ^ Bn(r, 22)) + Hx(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    vr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Dx = class extends Lp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const gu = Us(() => new Lp());
Us(() => new Dx());
const Fx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Cp = Uint8Array.from({ length: 16 }, (t, e) => e), jx = Cp.map((t) => (9 * t + 5) % 16);
let yu = [Cp], wu = [jx];
for (let t = 0; t < 4; t++)
  for (let e of [yu, wu])
    e.push(e[t].map((n) => Fx[n]));
const Bp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), zx = yu.map((t, e) => t.map((n) => Bp[e][n])), Rx = wu.map((t, e) => t.map((n) => Bp[e][n])), Gx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Kx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Po = (t, e) => t << e | t >>> 32 - e;
function ud(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ho = new Uint32Array(16);
let Vx = class extends pu {
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
      Ho[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const m = 4 - h, b = Gx[h], L = Kx[h], P = yu[h], U = wu[h], p = zx[h], $ = Rx[h];
      for (let I = 0; I < 16; I++) {
        const R = Po(r + ud(h, i, a, f) + Ho[P[I]] + b, p[I]) + l | 0;
        r = l, l = f, f = Po(a, 10) | 0, a = i, i = R;
      }
      for (let I = 0; I < 16; I++) {
        const R = Po(s + ud(m, o, c, d) + Ho[U[I]] + L, $[I]) + g | 0;
        s = g, g = d, d = Po(c, 10) | 0, c = o, o = R;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ho.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const qx = Us(() => new Vx()), Oo = BigInt(2 ** 32 - 1), fl = BigInt(32);
function Tp(t, e = !1) {
  return e ? { h: Number(t & Oo), l: Number(t >> fl & Oo) } : { h: Number(t >> fl & Oo) | 0, l: Number(t & Oo) | 0 };
}
function Wx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Tp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Xx = (t, e) => BigInt(t >>> 0) << fl | BigInt(e >>> 0), Yx = (t, e, n) => t >>> n, Zx = (t, e, n) => t << 32 - n | e >>> n, Qx = (t, e, n) => t >>> n | e << 32 - n, Jx = (t, e, n) => t << 32 - n | e >>> n, tS = (t, e, n) => t << 64 - n | e >>> n - 32, eS = (t, e, n) => t >>> n - 32 | e << 64 - n, nS = (t, e) => e, rS = (t, e) => t, sS = (t, e, n) => t << n | e >>> 32 - n, iS = (t, e, n) => e << n | t >>> 32 - n, oS = (t, e, n) => e << n - 32 | t >>> 64 - n, aS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function cS(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const lS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), uS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, fS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), dS = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, hS = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), pS = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, vt = {
  fromBig: Tp,
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
}, [gS, yS] = vt.split([
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
].map((t) => BigInt(t))), $r = new Uint32Array(80), Ir = new Uint32Array(80);
let Wa = class extends pu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: m, Hh: b, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, m, b, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, m, b, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = m | 0, this.Hh = b | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      $r[p] = e.getUint32(n), Ir[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const $ = $r[p - 15] | 0, I = Ir[p - 15] | 0, R = vt.rotrSH($, I, 1) ^ vt.rotrSH($, I, 8) ^ vt.shrSH($, I, 7), Q = vt.rotrSL($, I, 1) ^ vt.rotrSL($, I, 8) ^ vt.shrSL($, I, 7), H = $r[p - 2] | 0, W = Ir[p - 2] | 0, S = vt.rotrSH(H, W, 19) ^ vt.rotrBH(H, W, 61) ^ vt.shrSH(H, W, 6), C = vt.rotrSL(H, W, 19) ^ vt.rotrBL(H, W, 61) ^ vt.shrSL(H, W, 6), _ = vt.add4L(Q, C, Ir[p - 7], Ir[p - 16]), T = vt.add4H(_, R, S, $r[p - 7], $r[p - 16]);
      $r[p] = T | 0, Ir[p] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: m, Gh: b, Gl: L, Hh: P, Hl: U } = this;
    for (let p = 0; p < 80; p++) {
      const $ = vt.rotrSH(l, g, 14) ^ vt.rotrSH(l, g, 18) ^ vt.rotrBH(l, g, 41), I = vt.rotrSL(l, g, 14) ^ vt.rotrSL(l, g, 18) ^ vt.rotrBL(l, g, 41), R = l & h ^ ~l & b, Q = g & m ^ ~g & L, H = vt.add5L(U, I, Q, yS[p], Ir[p]), W = vt.add5H(H, P, $, R, gS[p], $r[p]), S = H | 0, C = vt.rotrSH(r, s, 28) ^ vt.rotrBH(r, s, 34) ^ vt.rotrBH(r, s, 39), _ = vt.rotrSL(r, s, 28) ^ vt.rotrBL(r, s, 34) ^ vt.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, q = s & o ^ s & c ^ o & c;
      P = b | 0, U = L | 0, b = h | 0, L = m | 0, h = l | 0, m = g | 0, { h: l, l: g } = vt.add(f | 0, d | 0, W | 0, S | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const G = vt.add3L(S, _, q);
      r = vt.add3H(G, W, C, T), s = G | 0;
    }
    ({ h: r, l: s } = vt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = vt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = vt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = vt.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = vt.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: m } = vt.add(this.Fh | 0, this.Fl | 0, h | 0, m | 0), { h: b, l: L } = vt.add(this.Gh | 0, this.Gl | 0, b | 0, L | 0), { h: P, l: U } = vt.add(this.Hh | 0, this.Hl | 0, P | 0, U | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, m, b, L, P, U);
  }
  roundClean() {
    $r.fill(0), Ir.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, wS = class extends Wa {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, bS = class extends Wa {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, mS = class extends Wa {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Us(() => new Wa());
Us(() => new wS());
const xS = Us(() => new bS());
Us(() => new mS());
var Mt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Mt || (Mt = {}));
var be;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(be || (be = {}));
function bu(t) {
  return be[t];
}
const SS = () => ({ type: Mt.BoolTrue }), ES = () => ({ type: Mt.BoolFalse }), AS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Mt.Buffer, value: st(t) };
}, fd = BigInt("0xffffffffffffffffffffffffffffffff"), vS = BigInt(0), dd = BigInt("0x7fffffffffffffffffffffffffffffff"), hd = BigInt("-170141183460469231731687303715884105728"), $S = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = Rc(Pt(t))), je(t, Uint8Array) && (t = Rc(t));
  const e = Le(t);
  if (e > dd)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${dd}`);
  if (e < hd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${hd}`);
  return { type: Mt.Int, value: e };
}, IS = (t) => {
  const e = Le(t);
  if (e < vS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > fd)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${fd}`);
  return { type: Mt.UInt, value: e };
};
function kS(t) {
  return { type: Mt.List, value: t };
}
function Mp() {
  return { type: Mt.OptionalNone };
}
function Np(t) {
  return { type: Mt.OptionalSome, value: t };
}
var X;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(X || (X = {}));
function LS() {
  return {
    type: X.Address,
    version: Es.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function pd(t) {
  if (t && zp(t, xa))
    throw new Error(`Memo exceeds maximum length of ${xa} bytes`);
  return { type: X.MemoString, content: t };
}
function mu(t, e) {
  return {
    type: X.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function dl(t) {
  if (Pt(t).byteLength != Va)
    throw Error("Invalid signature");
  return {
    type: X.MessageSignature,
    data: t
  };
}
function CS(t, e, n) {
  return typeof t == "string" && (t = KS(t)), typeof n == "string" && (n = pd(n)), {
    type: X.Payload,
    payloadType: Rt.TokenTransfer,
    recipient: t,
    amount: Le(e),
    memo: n ?? pd("")
  };
}
function BS(t, e, n, r) {
  return typeof e == "string" && (e = Sn(e)), typeof n == "string" && (n = Sn(n)), {
    type: X.Payload,
    payloadType: Rt.ContractCall,
    contractAddress: typeof t == "string" ? Vr(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function TS(t) {
  return Sn(t, 4, 1e5);
}
function gd(t, e, n) {
  return typeof t == "string" && (t = Sn(t)), typeof e == "string" && (e = TS(e)), typeof n == "number" ? {
    type: X.Payload,
    payloadType: Rt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: X.Payload,
    payloadType: Rt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function MS() {
  return { type: X.Payload, payloadType: Rt.PoisonMicroblock };
}
function yd(t, e) {
  if (t.byteLength != cs)
    throw Error(`Coinbase buffer size must be ${cs} bytes`);
  return e != null ? {
    type: X.Payload,
    payloadType: Rt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: X.Payload,
    payloadType: Rt.Coinbase,
    coinbaseBytes: t
  };
}
function NS(t, e, n) {
  if (t.byteLength != cs)
    throw Error(`Coinbase buffer size must be ${cs} bytes`);
  if (n.byteLength != il)
    throw Error(`VRF proof buffer size must be ${il} bytes`);
  return {
    type: X.Payload,
    payloadType: Rt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Mt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function _S(t, e, n, r, s, i, o) {
  return {
    type: X.Payload,
    payloadType: Rt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Sn(t, e, n) {
  const r = e || 1, s = n || wx;
  if (zp(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: X.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function US(t, e, n) {
  return {
    type: X.Asset,
    address: Vr(t),
    contractName: Sn(e),
    assetName: Sn(n)
  };
}
function Vr(t) {
  const e = _s.c32addressDecode(t);
  return {
    type: X.Address,
    version: e[0],
    hash160: e[1]
  };
}
function PS(t, e) {
  const n = Vr(t), r = Sn(e);
  return {
    type: X.Principal,
    prefix: Te.Contract,
    address: n,
    contractName: r
  };
}
function HS(t) {
  const e = Vr(t);
  return {
    type: X.Principal,
    prefix: Te.Standard,
    address: e
  };
}
function si(t, e) {
  return {
    pubKeyEncoding: t,
    type: X.TransactionAuthField,
    contents: e
  };
}
function Wn(t) {
  switch (t.type) {
    case X.Address:
      return wo(t);
    case X.Principal:
      return _p(t);
    case X.LengthPrefixedString:
      return Ei(t);
    case X.MemoString:
      return DS(t);
    case X.Asset:
      return Pp(t);
    case X.PostCondition:
      return Op(t);
    case X.PublicKey:
      return gl(t);
    case X.LengthPrefixedList:
      return xu(t);
    case X.Payload:
      return Dp(t);
    case X.TransactionAuthField:
      return GS(t);
    case X.MessageSignature:
      return Su(t);
  }
}
function wo(t) {
  const e = [];
  return e.push(Pt(uo(t.version, 1))), e.push(Pt(t.hash160)), fe(e);
}
function Si(t) {
  const e = je(t, Zt) ? t : new Zt(t), n = Na(st(e.readBytes(1))), r = st(e.readBytes(20));
  return { type: X.Address, version: n, hash160: r };
}
function _p(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === Te.Standard || t.prefix === Te.Contract) && e.push(wo(t.address)), t.prefix === Te.Contract && e.push(Ei(t.contractName)), fe(e);
}
function OS(t) {
  const e = je(t, Zt) ? t : new Zt(t), n = e.readUInt8Enum(Te, (i) => {
    throw new Ce(`Unexpected Principal payload type: ${i}`);
  });
  if (n === Te.Origin)
    return { type: X.Principal, prefix: n };
  const r = Si(e);
  if (n === Te.Standard)
    return { type: X.Principal, prefix: n, address: r };
  const s = an(e);
  return {
    type: X.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Ei(t) {
  const e = [], n = Bs(t.content), r = n.byteLength;
  return e.push(Pt(uo(r, t.lengthPrefixBytes))), e.push(n), fe(e);
}
function an(t, e, n) {
  e = e || 1;
  const r = je(t, Zt) ? t : new Zt(t), s = Na(st(r.readBytes(e))), i = fo(r.readBytes(s));
  return Sn(i, e, n ?? 128);
}
function DS(t) {
  const e = [], n = Bs(t.content), r = h3(st(n), xa * 2);
  return e.push(Pt(r)), fe(e);
}
function Up(t) {
  const e = je(t, Zt) ? t : new Zt(t);
  let n = fo(e.readBytes(xa));
  return n = n.replace(/\u0000*$/, ""), { type: X.MemoString, content: n };
}
function Pp(t) {
  const e = [];
  return e.push(wo(t.address)), e.push(Ei(t.contractName)), e.push(Ei(t.assetName)), fe(e);
}
function hl(t) {
  const e = je(t, Zt) ? t : new Zt(t);
  return {
    type: X.Asset,
    address: Si(e),
    contractName: an(e),
    assetName: an(e)
  };
}
function xu(t) {
  const e = t.values, n = [];
  n.push(Pt(uo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Wn(r));
  return fe(n);
}
function Hp(t, e, n) {
  const r = je(t, Zt) ? t : new Zt(t), s = Na(st(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case X.Address:
        i.push(Si(r));
        break;
      case X.LengthPrefixedString:
        i.push(an(r));
        break;
      case X.MemoString:
        i.push(Up(r));
        break;
      case X.Asset:
        i.push(hl(r));
        break;
      case X.PostCondition:
        i.push(jS(r));
        break;
      case X.PublicKey:
        i.push(yl(r));
        break;
      case X.TransactionAuthField:
        i.push(RS(r));
        break;
    }
  return mu(i, n);
}
function FS(t) {
  return st(Op(t));
}
function Op(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(_p(t.principal)), (t.conditionType === Qt.Fungible || t.conditionType === Qt.NonFungible) && e.push(Pp(t.asset)), t.conditionType === Qt.NonFungible && e.push(Pn(t.assetName)), e.push(t.conditionCode), t.conditionType === Qt.STX || t.conditionType === Qt.Fungible || t.conditionType === Qt.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new ri("The post-condition amount may not be larger than 8 bytes");
    e.push(Gr(t.amount, 8));
  }
  return fe(e);
}
function jS(t) {
  const e = je(t, Zt) ? t : new Zt(t), n = e.readUInt8Enum(Qt, (a) => {
    throw new Ce(`Could not read ${a} as PostConditionType`);
  }), r = OS(e);
  let s, i, o;
  switch (n) {
    case Qt.STX:
      return s = e.readUInt8Enum(Xi, (c) => {
        throw new Ce(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${st(e.readBytes(8))}`), {
        type: X.PostCondition,
        conditionType: Qt.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Qt.Fungible:
      return i = hl(e), s = e.readUInt8Enum(Xi, (c) => {
        throw new Ce(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${st(e.readBytes(8))}`), {
        type: X.PostCondition,
        conditionType: Qt.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case Qt.NonFungible:
      i = hl(e);
      const a = _n(e);
      return s = e.readUInt8Enum(al, (c) => {
        throw new Ce(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: X.PostCondition,
        conditionType: Qt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case Qt.Staking:
      return s = e.readUInt8Enum(Xi, (c) => {
        throw new Ce(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${st(e.readBytes(8))}`), {
        type: X.PostCondition,
        conditionType: Qt.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case Qt.PoX: {
      const c = e.readUInt8Enum(cl, (f) => {
        throw new Ce(`Could not read ${f} as PoxConditionCode`);
      });
      return {
        type: X.PostCondition,
        conditionType: Qt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function Dp(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Rt.TokenTransfer:
      e.push(Pn(t.recipient)), e.push(Gr(t.amount, 8)), e.push(Wn(t.memo));
      break;
    case Rt.ContractCall:
      e.push(Wn(t.contractAddress)), e.push(Wn(t.contractName)), e.push(Wn(t.functionName));
      const n = new Uint8Array(4);
      ds(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Pn(r));
      });
      break;
    case Rt.SmartContract:
      e.push(Wn(t.contractName)), e.push(Wn(t.codeBody));
      break;
    case Rt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Wn(t.contractName)), e.push(Wn(t.codeBody));
      break;
    case Rt.PoisonMicroblock:
      break;
    case Rt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Rt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Pn(t.recipient));
      break;
    case Rt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Pn(t.recipient ? Np(t.recipient) : Mp())), e.push(t.vrfProof);
      break;
    case Rt.TenureChange:
      e.push(Pt(t.tenureHash)), e.push(Pt(t.previousTenureHash)), e.push(Pt(t.burnViewHash)), e.push(Pt(t.previousTenureEnd)), e.push(ds(new Uint8Array(4), t.previousTenureBlocks)), e.push(Ow(new Uint8Array(1), t.cause)), e.push(Pt(t.publicKeyHash));
      break;
  }
  return fe(e);
}
function zS(t) {
  const e = je(t, Zt) ? t : new Zt(t);
  switch (e.readUInt8Enum(Rt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Rt.TokenTransfer:
      const r = _n(e), s = Le(e.readBytes(8)), i = Up(e);
      return CS(r, s, i);
    case Rt.ContractCall:
      const o = Si(e), a = an(e), c = an(e), f = [], d = e.readUInt32BE();
      for (let $ = 0; $ < d; $++) {
        const I = _n(e);
        f.push(I);
      }
      return BS(o, a, c, f);
    case Rt.SmartContract:
      const l = an(e), g = an(e, 4, 1e5);
      return gd(l, g);
    case Rt.VersionedSmartContract: {
      const $ = e.readUInt8Enum(ol, (Q) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Q}`);
      }), I = an(e), R = an(e, 4, Lx);
      return gd(I, R, $);
    }
    case Rt.PoisonMicroblock:
      return MS();
    case Rt.Coinbase: {
      const $ = e.readBytes(cs);
      return yd($);
    }
    case Rt.CoinbaseToAltRecipient: {
      const $ = e.readBytes(cs), I = _n(e);
      return yd($, I);
    }
    case Rt.NakamotoCoinbase: {
      const $ = e.readBytes(cs), I = _n(e), R = e.readBytes(il);
      return NS($, I, R);
    }
    case Rt.TenureChange:
      const h = st(e.readBytes(20)), m = st(e.readBytes(20)), b = st(e.readBytes(20)), L = st(e.readBytes(32)), P = e.readUInt32BE(), U = e.readUInt8Enum(ll, ($) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${$}`);
      }), p = st(e.readBytes(20));
      return _S(h, m, b, L, P, U, p);
  }
}
function pl(t) {
  const e = je(t, Zt) ? t : new Zt(t);
  return dl(st(e.readBytes(Va)));
}
function RS(t) {
  const e = je(t, Zt) ? t : new Zt(t), n = e.readUInt8Enum(bn, (r) => {
    throw new Ce(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case bn.PublicKeyCompressed:
      return si(re.Compressed, yl(e));
    case bn.PublicKeyUncompressed:
      return si(re.Uncompressed, Bi(v3(yl(e).data)));
    case bn.SignatureCompressed:
      return si(re.Compressed, pl(e));
    case bn.SignatureUncompressed:
      return si(re.Uncompressed, pl(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Su(t) {
  return Pt(t.data);
}
function GS(t) {
  const e = [];
  switch (t.contents.type) {
    case X.PublicKey:
      e.push(t.pubKeyEncoding === re.Compressed ? bn.PublicKeyCompressed : bn.PublicKeyUncompressed), e.push(Pt(A3(t.contents.data)));
      break;
    case X.MessageSignature:
      e.push(t.pubKeyEncoding === re.Compressed ? bn.SignatureCompressed : bn.SignatureUncompressed), e.push(Su(t.contents));
      break;
  }
  return fe(e);
}
function gl(t) {
  return t.data.slice();
}
function yl(t) {
  const e = je(t, Zt) ? t : new Zt(t), n = e.readUInt8(), r = n === 4 ? xx : mx;
  return Bi(fe([n, e.readBytes(r)]));
}
function Eu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === qt.P2PKH || e === qt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === qt.P2WPKH || e === qt.P2WSH || e === qt.P2WSHNonSequential) && !r.map((s) => s.data).every(Ti))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case qt.P2PKH:
      return Do(t, p3(r[0].data));
    case qt.P2WPKH:
      return Do(t, g3(r[0].data));
    case qt.P2SH:
    case qt.P2SHNonSequential:
      return Do(t, y3(n, r.map(gl)));
    case qt.P2WSH:
    case qt.P2WSHNonSequential:
      return Do(t, w3(n, r.map(gl)));
  }
}
function Do(t, e) {
  return { type: X.Address, version: t, hash160: e };
}
function Au(t) {
  return _s.c32address(t.version, t.hash160);
}
function wd(t) {
  const [e, n, r] = t.split(/\.|::/);
  return US(e, n, r);
}
function ji(t) {
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
  const e = Vr(t);
  return { type: Mt.PrincipalStandard, value: Au(e) };
}
function qS(t) {
  return { type: Mt.PrincipalStandard, value: Au(t) };
}
function WS(t, e) {
  const n = Vr(t), r = Sn(e);
  return Fp(n, r);
}
function Fp(t, e) {
  if (Bs(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Mt.PrincipalContract,
    value: `${Au(t)}.${e.content}`
  };
}
function XS(t) {
  return { type: Mt.ResponseErr, value: t };
}
function YS(t) {
  return { type: Mt.ResponseOk, value: t };
}
const ZS = (t) => ({ type: Mt.StringASCII, value: t }), QS = (t) => ({ type: Mt.StringUTF8, value: t });
function JS(t) {
  for (const e in t)
    if (!b3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Mt.Tuple, value: t };
}
function _n(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Zt(Pt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Zt(t) : e = t;
  switch (e.readUInt8Enum(be, (r) => {
    throw new Ce(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case be.int:
      return $S(Rc(e.readBytes(16)));
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
      const s = Si(e);
      return qS(s);
    case be.contract:
      const i = Si(e), o = an(e);
      return Fp(i, o);
    case be.ok:
      return YS(_n(e));
    case be.err:
      return XS(_n(e));
    case be.none:
      return Mp();
    case be.some:
      return Np(_n(e));
    case be.list:
      const a = e.readUInt32BE(), c = [];
      for (let b = 0; b < a; b++)
        c.push(_n(e));
      return kS(c);
    case be.tuple:
      const f = e.readUInt32BE(), d = {};
      for (let b = 0; b < f; b++) {
        const L = an(e).content;
        if (L === void 0)
          throw new Ce('"content" is undefined');
        d[L] = _n(e);
      }
      return JS(d);
    case be.ascii:
      const l = e.readUInt32BE(), g = Bw(e.readBytes(l));
      return ZS(g);
    case be.utf8:
      const h = e.readUInt32BE(), m = fo(e.readBytes(h));
      return QS(m);
    default:
      throw new Ce("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function jn(t, e) {
  return fe([bu(t), e]);
}
function t3(t) {
  return new Uint8Array([bu(t.type)]);
}
function e3(t) {
  return t.type === Mt.OptionalNone ? new Uint8Array([bu(t.type)]) : jn(t.type, Pn(t.value));
}
function n3(t) {
  const e = new Uint8Array(4);
  return ds(e, Math.ceil(t.value.length / 2), 0), jn(t.type, Dn(e, Pt(t.value)));
}
function r3(t) {
  const e = ql($w(BigInt(t.value), BigInt(bx)), Ap);
  return jn(t.type, e);
}
function s3(t) {
  const e = ql(BigInt(t.value), Ap);
  return jn(t.type, e);
}
function i3(t) {
  return jn(t.type, wo(Vr(t.value)));
}
function o3(t) {
  const [e, n] = m3(t.value);
  return jn(t.type, Dn(wo(Vr(e)), Ei(Sn(n))));
}
function a3(t) {
  return jn(t.type, Pn(t.value));
}
function c3(t) {
  const e = [], n = new Uint8Array(4);
  ds(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Pn(r);
    e.push(s);
  }
  return jn(t.type, fe(e));
}
function l3(t) {
  const e = [], n = new Uint8Array(4);
  ds(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Sn(s);
    e.push(Ei(i));
    const o = Pn(t.value[s]);
    e.push(o);
  }
  return jn(t.type, fe(e));
}
function jp(t, e) {
  const n = [], r = e == "ascii" ? Cw(t.value) : Bs(t.value), s = new Uint8Array(4);
  return ds(s, r.length, 0), n.push(s), n.push(r), jn(t.type, fe(n));
}
function u3(t) {
  return jp(t, "ascii");
}
function f3(t) {
  return jp(t, "utf8");
}
function bd(t) {
  return st(Pn(t));
}
function Pn(t) {
  switch (t.type) {
    case Mt.BoolTrue:
    case Mt.BoolFalse:
      return t3(t);
    case Mt.OptionalNone:
    case Mt.OptionalSome:
      return e3(t);
    case Mt.Buffer:
      return n3(t);
    case Mt.UInt:
      return s3(t);
    case Mt.Int:
      return r3(t);
    case Mt.PrincipalStandard:
      return i3(t);
    case Mt.PrincipalContract:
      return o3(t);
    case Mt.ResponseOk:
    case Mt.ResponseErr:
      return a3(t);
    case Mt.List:
      return c3(t);
    case Mt.Tuple:
      return l3(t);
    case Mt.StringASCII:
      return u3(t);
    case Mt.StringUTF8:
      return f3(t);
    default:
      throw new ri("Unable to serialize. Invalid Clarity Value.");
  }
}
const d3 = (t) => t.length % 2 ? `0${t}` : t, h3 = (t, e) => t.padEnd(e, "0"), zp = (t, e) => t ? Bs(t).length > e : !1;
function wl(t) {
  return mp(t);
}
const to = (t) => qx(gu(t)), vu = (t) => st(xS(t)), p3 = (t) => st(to(t)), g3 = (t) => {
  const e = to(t), n = Dn(new Uint8Array([0]), new Uint8Array([e.length]), e), r = to(n);
  return st(r);
}, y3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = fe(n), s = to(r);
  return st(s);
}, w3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = fe(n), s = gu(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = fe(i), a = to(o);
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
  const n = kp.create(gu, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Bi(t) {
  return t = typeof t == "string" ? Pt(t) : t, {
    type: X.PublicKey,
    data: t
  };
}
function x3(t, e, n = re.Compressed) {
  const r = _w(e), s = new We(bf(r.r), bf(r.s)), i = Ct.fromSignature(t, s, r.recoveryId), o = n === re.Compressed;
  return i.toHex(o);
}
function S3(t) {
  return typeof t == "string" ? t : st(t);
}
const $u = S3;
function Rp(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === Nw;
}
function Ti(t) {
  return !$u(t).startsWith("04");
}
function E3(t) {
  t = Wl(t);
  const e = Rp(t);
  return st(ho(t.slice(0, 32), e));
}
function A3(t) {
  return Ct.fromHex($u(t)).toHex(!0);
}
function v3(t) {
  return Ct.fromHex($u(t)).toHex(!1);
}
function $3(t, e) {
  t = Wl(t);
  const [n, r] = Ua(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return uo(r, 1) + We.fromHex(n).toCompactHex();
}
function Iu() {
  return {
    type: X.MessageSignature,
    data: st(new Uint8Array(Va))
  };
}
function Gp(t, e, n, r) {
  const s = Eu(0, t, 1, [Bi(e)]).hash160, i = Ti(e) ? re.Compressed : re.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Le(n),
    fee: Le(r),
    keyEncoding: i,
    signature: Iu()
  };
}
function eo(t) {
  return "signature" in t;
}
function md(t) {
  return t === qt.P2SH || t === qt.P2WSH;
}
function I3(t) {
  return t === qt.P2SHNonSequential || t === qt.P2WSHNonSequential;
}
function xd(t) {
  const e = wl(t);
  return e.nonce = 0, e.fee = 0, eo(e) ? e.signature = Iu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function k3(t) {
  const e = [
    t.hashMode,
    Pt(t.signer),
    Gr(t.nonce, 8),
    Gr(t.fee, 8),
    t.keyEncoding,
    Su(t.signature)
  ];
  return fe(e);
}
function L3(t) {
  const e = [
    t.hashMode,
    Pt(t.signer),
    Gr(t.nonce, 8),
    Gr(t.fee, 8)
  ], n = mu(t.fields);
  e.push(xu(n));
  const r = new Uint8Array(2);
  return Pw(r, t.signaturesRequired, 0), e.push(r), fe(e);
}
function C3(t, e) {
  const n = st(e.readBytes(20)), r = BigInt(`0x${st(e.readBytes(8))}`), s = BigInt(`0x${st(e.readBytes(8))}`), i = e.readUInt8Enum(re, (a) => {
    throw new Ce(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === qt.P2WPKH && i != re.Compressed)
    throw new Ce("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = pl(e);
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
  const n = st(e.readBytes(20)), r = BigInt("0x" + st(e.readBytes(8))), s = BigInt("0x" + st(e.readBytes(8))), i = Hp(e, X.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const f of i)
    switch (f.contents.type) {
      case X.PublicKey:
        Ti(f.contents.data) || (o = !0);
        break;
      case X.MessageSignature:
        if (f.pubKeyEncoding === re.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new rs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === qt.P2WSH || t === qt.P2WSHNonSequential))
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
function Sc(t) {
  return eo(t) ? k3(t) : L3(t);
}
function Ec(t) {
  const e = t.readUInt8Enum(qt, (n) => {
    throw new Ce(`Could not parse ${n} as AddressHashMode`);
  });
  return e === qt.P2PKH || e === qt.P2WPKH ? C3(e, t) : B3(e, t);
}
function Kp(t, e, n, r) {
  const i = t + st(new Uint8Array([e])) + st(Gr(n, 8)) + st(Gr(r, 8));
  if (Pt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return vu(Pt(i));
}
function Vp(t, e, n) {
  const r = 33 + Va, s = Ti(e.data) ? re.Compressed : re.Uncompressed, i = t + d3(s.toString(16)) + n, o = Pt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return vu(o);
}
function T3(t, e, n, r, s) {
  const i = Kp(t, e, n, r), o = $3(s, i), a = Bi(E3(s)), c = Vp(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function qp(t, e, n, r, s, i) {
  const o = Kp(t, e, n, r), a = Bi(x3(o, i, s)), c = Vp(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function M3() {
  const t = Gp(qt.P2PKH, "", 0, 0);
  return t.signer = LS().hash160, t.keyEncoding = re.Compressed, t.signature = Iu(), t;
}
function Sd(t, e, n) {
  return eo(t) ? N3(t, e, n) : _3(t, e, n);
}
function N3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = qp(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Eu(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new rs(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function _3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case X.PublicKey:
        Ti(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case X.MessageSignature:
        c.pubKeyEncoding === re.Uncompressed && (i = !0);
        const { pubKey: f, nextSigHash: d } = qp(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (md(t.hashMode) && (s = d), r.push(f), o += 1, o === 65536)
          throw new rs("Too many signatures");
        break;
    }
  if (md(t.hashMode) && o !== t.signaturesRequired || I3(t.hashMode) && o < t.signaturesRequired)
    throw new rs("Incorrect number of signatures");
  if (i && (t.hashMode === qt.P2WSH || t.hashMode === qt.P2WSHNonSequential))
    throw new rs("Uncompressed keys are not allowed in this hash mode");
  const a = Eu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new rs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Wp(t) {
  return {
    authType: ie.Standard,
    spendingCondition: t
  };
}
function Xp(t, e) {
  return {
    authType: ie.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Gp(qt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Ed(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case ie.Standard:
        return Wp(xd(t.spendingCondition));
      case ie.Sponsored:
        return Xp(xd(t.spendingCondition), M3());
      default:
        throw new Ea("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function U3(t, e) {
  switch (t.authType) {
    case ie.Standard:
      return Sd(t.spendingCondition, e, ie.Standard);
    case ie.Sponsored:
      return Sd(t.spendingCondition, e, ie.Standard);
    default:
      throw new Ea("Invalid origin auth type");
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
      e.push(Sc(t.spendingCondition));
      break;
    case ie.Sponsored:
      e.push(Sc(t.spendingCondition)), e.push(Sc(t.sponsorSpendingCondition));
      break;
  }
  return fe(e);
}
function j3(t) {
  const e = t.readUInt8Enum(ie, (r) => {
    throw new Ce(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case ie.Standard:
      return n = Ec(t), Wp(n);
    case ie.Sponsored:
      n = Ec(t);
      const r = Ec(t);
      return Xp(n, r);
  }
}
class z3 {
  constructor({ auth: e, payload: n, postConditions: r = mu([]), postConditionMode: s = Sa.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = gx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Le(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Ge.Any;
  }
  signBegin() {
    const e = wl(this);
    return e.auth = Ed(e.auth), e.txid();
  }
  verifyBegin() {
    const e = wl(this);
    return e.auth = Ed(e.auth), e.txid();
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
    const n = typeof e == "object" && "type" in e ? e : Bi(e), r = this.auth.spendingCondition;
    if (r && !eo(r)) {
      const s = Ti(n.data);
      r.fields.push(si(s ? re.Compressed : re.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = T3(n, r, e.fee, e.nonce, s);
    if (eo(e))
      e.signature = dl(i);
    else {
      const a = Rp(s);
      e.fields.push(si(a ? re.Compressed : re.Uncompressed, dl(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return vu(e);
  }
  setSponsor(e) {
    if (this.auth.authType != ie.Sponsored)
      throw new Ea("Cannot sponsor sign a non-sponsored transaction");
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
      throw new Ea("Cannot sponsor sign a non-sponsored transaction");
    this.auth = O3(this.auth, e);
  }
  serialize() {
    return st(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new ri('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new ri('"chainId" is undefined');
    if (this.auth === void 0)
      throw new ri('"auth" is undefined');
    if (this.payload === void 0)
      throw new ri('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return ds(n, this.chainId, 0), e.push(n), e.push(F3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(xu(this.postConditions)), e.push(Dp(this.payload)), fe(e);
  }
}
function R3(t) {
  const e = je(t, Zt) ? t : new Zt(t), n = e.readUInt8Enum(Ss, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = j3(e), i = e.readUInt8Enum(Ge, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(Sa, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = Hp(e, X.PostCondition), c = zS(e), f = new z3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return f.anchorMode = i, f;
}
const Ad = BigInt("18446744073709551615");
function Ac(t) {
  const e = Le(t);
  if (e < 0n || e > Ad)
    throw new RangeError(`Post-condition amount must be between 0 and ${Ad} (u64 max), received: ${e}`);
  return e;
}
var bl;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(bl || (bl = {}));
var ml;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(ml || (ml = {}));
function G3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: X.PostCondition,
        conditionType: Qt.STX,
        principal: t.address === "origin" ? { type: X.Principal, prefix: Te.Origin } : ji(t.address),
        conditionCode: Fo(t.condition),
        amount: Ac(t.amount)
      };
    case "ft-postcondition":
      return {
        type: X.PostCondition,
        conditionType: Qt.Fungible,
        principal: t.address === "origin" ? { type: X.Principal, prefix: Te.Origin } : ji(t.address),
        conditionCode: Fo(t.condition),
        amount: Ac(t.amount),
        asset: wd(t.asset)
      };
    case "nft-postcondition":
      return {
        type: X.PostCondition,
        conditionType: Qt.NonFungible,
        principal: t.address === "origin" ? { type: X.Principal, prefix: Te.Origin } : ji(t.address),
        conditionCode: Fo(t.condition),
        asset: wd(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: X.PostCondition,
        conditionType: Qt.Staking,
        principal: t.address === "origin" ? { type: X.Principal, prefix: Te.Origin } : ji(t.address),
        conditionCode: Fo(t.condition),
        amount: Ac(t.amount)
      };
    case "pox-postcondition":
      return {
        type: X.PostCondition,
        conditionType: Qt.PoX,
        principal: t.address === "origin" ? { type: X.Principal, prefix: Te.Origin } : ji(t.address),
        conditionCode: K3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Fo(t) {
  return bl[t];
}
function K3(t) {
  return ml[t];
}
function Yp(t) {
  const e = G3(t);
  return FS(e);
}
function V3(t, e, n) {
  return Lu(Zp(t), n);
}
function Zp(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = no(r);
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
function ku(t, e = 8) {
  return (typeof t == "bigint" ? t : Zp(t)).toString(16).padStart(e * 2, "0");
}
function Lu(t, e = 16) {
  const n = ku(t, e);
  return no(n);
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
function no(t) {
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
function Cu(t) {
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
function vd(t) {
  if (t.some(Z3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Bu(...t) {
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
function sr(t) {
  return Bu(...t.map((e) => typeof e == "number" ? vd([e]) : e instanceof Array ? vd(e) : e));
}
function Xa(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var xl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(xl || (xl = {}));
xl.Mainnet;
const Q3 = 128, J3 = 128, Qp = 16;
var Sl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Sl || (Sl = {}));
var $d;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})($d || ($d = {}));
var Id;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Id || (Id = {}));
var wn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(wn || (wn = {}));
const vc = ["onChainOnly", "offChainOnly", "any"];
vc[0] + "", wn.OnChainOnly, vc[1] + "", wn.OffChainOnly, vc[2] + "", wn.Any, wn.OnChainOnly + "", wn.OnChainOnly, wn.OffChainOnly + "", wn.OffChainOnly, wn.Any + "", wn.Any;
var El;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(El || (El = {}));
El.Mainnet;
var kd;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(kd || (kd = {}));
var Jr;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Jr || (Jr = {}));
var Ld;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ld || (Ld = {}));
var Cd;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Cd || (Cd = {}));
var Bd;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Bd || (Bd = {}));
var Td;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Td || (Td = {}));
var Md;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Md || (Md = {}));
var Nd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Nd || (Nd = {}));
var Al;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Al || (Al = {}));
var _d;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(_d || (_d = {}));
var Ud;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Ud || (Ud = {}));
function vl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function tE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Jp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function eE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  vl(t.outputLen), vl(t.blockLen);
}
function nE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function rE(t, e) {
  Jp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const $c = {
  number: vl,
  bool: tE,
  bytes: Jp,
  hash: eE,
  exists: nE,
  output: rE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ic = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Tn = (t, e) => t << 32 - e | t >>> e, sE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!sE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function iE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function tg(t) {
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
function Ps(t) {
  const e = (r) => t().update(tg(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function aE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
let Tu = class extends oE {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ic(this.buffer);
  }
  update(e) {
    $c.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = tg(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Ic(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    $c.exists(this), $c.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    aE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ic(e), c = this.outputLen;
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
const cE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), eg = Uint8Array.from({ length: 16 }, (t, e) => e), lE = eg.map((t) => (9 * t + 5) % 16);
let Mu = [eg], Nu = [lE];
for (let t = 0; t < 4; t++)
  for (let e of [Mu, Nu])
    e.push(e[t].map((n) => cE[n]));
const ng = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), uE = Mu.map((t, e) => t.map((n) => ng[e][n])), fE = Nu.map((t, e) => t.map((n) => ng[e][n])), dE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), hE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), jo = (t, e) => t << e | t >>> 32 - e;
function Pd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const zo = new Uint32Array(16);
let pE = class extends Tu {
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
      zo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const m = 4 - h, b = dE[h], L = hE[h], P = Mu[h], U = Nu[h], p = uE[h], $ = fE[h];
      for (let I = 0; I < 16; I++) {
        const R = jo(r + Pd(h, i, a, f) + zo[P[I]] + b, p[I]) + l | 0;
        r = l, l = f, f = jo(a, 10) | 0, a = i, i = R;
      }
      for (let I = 0; I < 16; I++) {
        const R = jo(s + Pd(m, o, c, d) + zo[U[I]] + L, $[I]) + g | 0;
        s = g, g = d, d = jo(c, 10) | 0, c = o, o = R;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    zo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Ps(() => new pE());
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
let rg = class extends Tu {
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
      const g = Lr[l - 15], h = Lr[l - 2], m = Tn(g, 7) ^ Tn(g, 18) ^ g >>> 3, b = Tn(h, 17) ^ Tn(h, 19) ^ h >>> 10;
      Lr[l] = b + Lr[l - 7] + m + Lr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Tn(a, 6) ^ Tn(a, 11) ^ Tn(a, 25), h = d + g + gE(a, c, f) + wE[l] + Lr[l] | 0, b = (Tn(r, 2) ^ Tn(r, 13) ^ Tn(r, 22)) + yE(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    Lr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, bE = class extends rg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Ps(() => new rg());
Ps(() => new bE());
const Ro = BigInt(2 ** 32 - 1), $l = BigInt(32);
function sg(t, e = !1) {
  return e ? { h: Number(t & Ro), l: Number(t >> $l & Ro) } : { h: Number(t >> $l & Ro) | 0, l: Number(t & Ro) | 0 };
}
function mE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = sg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const xE = (t, e) => BigInt(t >>> 0) << $l | BigInt(e >>> 0), SE = (t, e, n) => t >>> n, EE = (t, e, n) => t << 32 - n | e >>> n, AE = (t, e, n) => t >>> n | e << 32 - n, vE = (t, e, n) => t << 32 - n | e >>> n, $E = (t, e, n) => t << 64 - n | e >>> n - 32, IE = (t, e, n) => t >>> n - 32 | e << 64 - n, kE = (t, e) => e, LE = (t, e) => t, CE = (t, e, n) => t << n | e >>> 32 - n, BE = (t, e, n) => e << n | t >>> 32 - n, TE = (t, e, n) => e << n - 32 | t >>> 64 - n, ME = (t, e, n) => t << n - 32 | e >>> 64 - n;
function NE(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const _E = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), UE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, PE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), HE = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, OE = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), DE = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, $t = {
  fromBig: sg,
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
}, [FE, jE] = $t.split([
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
let Ya = class extends Tu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: m, Hh: b, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, m, b, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, m, b, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = m | 0, this.Hh = b | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Cr[p] = e.getUint32(n), Br[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const $ = Cr[p - 15] | 0, I = Br[p - 15] | 0, R = $t.rotrSH($, I, 1) ^ $t.rotrSH($, I, 8) ^ $t.shrSH($, I, 7), Q = $t.rotrSL($, I, 1) ^ $t.rotrSL($, I, 8) ^ $t.shrSL($, I, 7), H = Cr[p - 2] | 0, W = Br[p - 2] | 0, S = $t.rotrSH(H, W, 19) ^ $t.rotrBH(H, W, 61) ^ $t.shrSH(H, W, 6), C = $t.rotrSL(H, W, 19) ^ $t.rotrBL(H, W, 61) ^ $t.shrSL(H, W, 6), _ = $t.add4L(Q, C, Br[p - 7], Br[p - 16]), T = $t.add4H(_, R, S, Cr[p - 7], Cr[p - 16]);
      Cr[p] = T | 0, Br[p] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: m, Gh: b, Gl: L, Hh: P, Hl: U } = this;
    for (let p = 0; p < 80; p++) {
      const $ = $t.rotrSH(l, g, 14) ^ $t.rotrSH(l, g, 18) ^ $t.rotrBH(l, g, 41), I = $t.rotrSL(l, g, 14) ^ $t.rotrSL(l, g, 18) ^ $t.rotrBL(l, g, 41), R = l & h ^ ~l & b, Q = g & m ^ ~g & L, H = $t.add5L(U, I, Q, jE[p], Br[p]), W = $t.add5H(H, P, $, R, FE[p], Cr[p]), S = H | 0, C = $t.rotrSH(r, s, 28) ^ $t.rotrBH(r, s, 34) ^ $t.rotrBH(r, s, 39), _ = $t.rotrSL(r, s, 28) ^ $t.rotrBL(r, s, 34) ^ $t.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, q = s & o ^ s & c ^ o & c;
      P = b | 0, U = L | 0, b = h | 0, L = m | 0, h = l | 0, m = g | 0, { h: l, l: g } = $t.add(f | 0, d | 0, W | 0, S | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const G = $t.add3L(S, _, q);
      r = $t.add3H(G, W, C, T), s = G | 0;
    }
    ({ h: r, l: s } = $t.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = $t.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = $t.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = $t.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = $t.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: m } = $t.add(this.Fh | 0, this.Fl | 0, h | 0, m | 0), { h: b, l: L } = $t.add(this.Gh | 0, this.Gl | 0, b | 0, L | 0), { h: P, l: U } = $t.add(this.Hh | 0, this.Hl | 0, P | 0, U | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, m, b, L, P, U);
  }
  roundClean() {
    Cr.fill(0), Br.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, zE = class extends Ya {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, RE = class extends Ya {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, GE = class extends Ya {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ps(() => new Ya());
Ps(() => new zE());
Ps(() => new RE());
Ps(() => new GE());
function KE(t, e, n) {
  const s = Q3;
  if (a4(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Sl.LengthPrefixedString,
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
}, ig = class extends VE {
  constructor(e) {
    super(e);
  }
};
function Za(t) {
  const e = [];
  return e.push(no(ku(t.version, 1))), e.push(no(t.hash160)), sr(e);
}
function qE(t) {
  const e = [];
  return e.push(t.prefix), e.push(Za(t.address)), t.prefix === Al.Contract && e.push(ro(t.contractName)), sr(e);
}
function ro(t) {
  const e = [], n = Cu(t.content), r = n.byteLength;
  return e.push(no(ku(r, t.lengthPrefixBytes))), e.push(n), sr(e);
}
function WE(t) {
  const e = [];
  return e.push(Za(t.address)), e.push(ro(t.contractName)), e.push(ro(t.assetName)), sr(e);
}
function og(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(qE(t.principal)), (t.conditionType === Jr.Fungible || t.conditionType === Jr.NonFungible) && e.push(WE(t.assetInfo)), t.conditionType === Jr.NonFungible && e.push(As(t.assetName)), e.push(t.conditionCode), t.conditionType === Jr.STX || t.conditionType === Jr.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new ig("The post-condition amount may not be larger than 8 bytes");
    e.push(V3(t.amount, !1, 8));
  }
  return sr(e);
}
function zn(t, e) {
  return sr([t, e]);
}
function XE(t) {
  return new Uint8Array([t.type]);
}
function YE(t) {
  return t.type === me.OptionalNone ? new Uint8Array([t.type]) : zn(t.type, As(t.value));
}
function ZE(t) {
  const e = new Uint8Array(4);
  return Xa(e, t.buffer.length, 0), zn(t.type, Bu(e, t.buffer));
}
function QE(t) {
  const e = Lu(q3(t.value, BigInt(J3)), Qp);
  return zn(t.type, e);
}
function JE(t) {
  const e = Lu(t.value, Qp);
  return zn(t.type, e);
}
function t4(t) {
  return zn(t.type, Za(t.address));
}
function e4(t) {
  return zn(t.type, Bu(Za(t.address), ro(t.contractName)));
}
function n4(t) {
  return zn(t.type, As(t.value));
}
function r4(t) {
  const e = [], n = new Uint8Array(4);
  Xa(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = As(r);
    e.push(s);
  }
  return zn(t.type, sr(e));
}
function s4(t) {
  const e = [], n = new Uint8Array(4);
  Xa(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = KE(s);
    e.push(ro(i));
    const o = As(t.data[s]);
    e.push(o);
  }
  return zn(t.type, sr(e));
}
function ag(t, e) {
  const n = [], r = e == "ascii" ? Y3(t.data) : Cu(t.data), s = new Uint8Array(4);
  return Xa(s, r.length, 0), n.push(s), n.push(r), zn(t.type, sr(n));
}
function i4(t) {
  return ag(t, "ascii");
}
function o4(t) {
  return ag(t, "utf8");
}
function As(t) {
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
      throw new ig("Unable to serialize. Invalid Clarity Value.");
  }
}
const a4 = (t, e) => t ? Cu(t).length > e : !1, c4 = "connect-ui";
let sa, cg, Ke = !1, Il = !1;
const rr = (t, e = "") => () => {
}, l4 = (t, e) => () => {
}, u4 = "{visibility:hidden}.hydrated{visibility:inherit}", Hd = {}, f4 = "http://www.w3.org/2000/svg", d4 = "http://www.w3.org/1999/xhtml", h4 = (t) => t != null, _u = (t) => (t = typeof t, t === "object" || t === "function");
function lg(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const mt = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (f) => {
    for (let d = 0; d < f.length; d++)
      r = f[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !_u(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? kl(null, r) : r), i = s);
  };
  if (a(n), e) {
    const f = e.className || e.class;
    f && (e.class = typeof f != "object" ? f : Object.keys(f).filter((d) => f[d]).join(" "));
  }
  const c = kl(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, kl = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, p4 = {}, g4 = (t) => t && t.$tag$ === p4, y4 = (t, e) => t != null && !_u(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, w4 = (t) => Mi(t).$hostElement$, b4 = (t, e, n) => {
  const r = ke.ce(e, n);
  return t.dispatchEvent(r), r;
}, Od = /* @__PURE__ */ new WeakMap(), m4 = (t, e, n) => {
  let r = Aa.get(t);
  D4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Aa.set(t, r);
}, x4 = (t, e, n, r) => {
  var s;
  let i = ug(e);
  const o = Aa.get(i);
  if (t = t.nodeType === 11 ? t : Hn, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Od.get(t), c;
      if (a || Od.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = Hn.createElement("style"), c.innerHTML = o;
          const f = (s = ke.$nonce$) !== null && s !== void 0 ? s : lg(Hn);
          f != null && c.setAttribute("nonce", f), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, S4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = rr("attachStyles", e.$tagName$), i = x4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, ug = (t, e) => "sc-" + t.$tagName$, Dd = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = jd(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, f = Fd(n), d = Fd(r);
      c.remove(...f.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !f.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : jd(Qa, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && ke.rel(t, e, n, !1), r && ke.ael(t, e, r, !1);
    else {
      const c = _u(r);
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
}, E4 = /\s/, Fd = (t) => t ? t.split(E4) : [], fg = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || Hd, o = e.$attrs$ || Hd;
  for (r in i)
    r in o || Dd(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    Dd(s, r, i[r], o[r], n, e.$flags$);
}, Uu = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = Hn.createTextNode(s.$text$);
  else {
    if (Ke || (Ke = s.$tag$ === "svg"), o = s.$elm$ = Hn.createElementNS(Ke ? f4 : d4, s.$tag$), Ke && s.$tag$ === "foreignObject" && (Ke = !1), fg(null, s, Ke), h4(sa) && o["s-si"] !== sa && o.classList.add(o["s-si"] = sa), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = Uu(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Ke = !1 : o.tagName === "foreignObject" && (Ke = !0);
  }
  return o;
}, dg = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === cg && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = Uu(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, hg = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, A4 = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], f = r.length - 1, d = r[0], l = r[f], g;
  for (; s <= o && i <= f; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : d == null ? d = r[++i] : l == null ? l = r[--f] : Go(a, d) ? (Gi(a, d), a = e[++s], d = r[++i]) : Go(c, l) ? (Gi(c, l), c = e[--o], l = r[--f]) : Go(a, l) ? (Gi(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--f]) : Go(c, d) ? (Gi(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++i]) : (g = Uu(e && e[i], n, i), d = r[++i], g && a.$elm$.parentNode.insertBefore(g, a.$elm$));
  s > o ? dg(t, r[f + 1] == null ? null : r[f + 1].$elm$, n, r, i, f) : i > f && hg(e, s, o);
}, Go = (t, e) => t.$tag$ === e.$tag$, Gi = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (Ke = i === "svg" ? !0 : i === "foreignObject" ? !1 : Ke, fg(t, e, Ke), r !== null && s !== null ? A4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), dg(n, null, e, s, 0, s.length - 1)) : r !== null && hg(r, 0, r.length - 1), Ke && i === "svg" && (Ke = !1)) : t.$text$ !== o && (n.data = o);
}, v4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || kl(null, null), s = g4(e) ? e : mt(null, null, e);
  cg = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, sa = n["s-sc"], Gi(r, s);
}, pg = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Pu = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return pg(t, t.$ancestorComponent$), j4(() => $4(t, e));
}, $4 = (t, e) => {
  const n = rr("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), C4(s, () => I4(t, r, e));
}, I4 = async (t, e, n) => {
  const r = t.$hostElement$, s = rr("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && S4(t);
  const o = rr("render", t.$cmpMeta$.$tagName$);
  k4(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => L4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, k4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, v4(t, e);
  } catch (r) {
    so(r, t.$hostElement$);
  }
  return null;
}, L4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = rr("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, yg(n), r(), t.$onReadyResolve$(n), s || gg()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Ou(() => Pu(t, !1)), t.$flags$ &= -517;
}, gg = (t) => {
  yg(Hn.documentElement), Ou(() => b4(Qa, "appload", { detail: { namespace: c4 } }));
}, C4 = (t, e) => t && t.then ? t.then(e) : e(), yg = (t) => t.classList.add("hydrated"), B4 = (t, e) => Mi(t).$instanceValues$.get(e), T4 = (t, e, n, r) => {
  const s = Mi(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = y4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), f = n !== i && !c;
  (!(o & 8) || i === void 0) && f && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && Pu(s, !1));
}, wg = (t, e, n) => {
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
      s.isProxied || (wg(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = rr("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        so(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = ug(n);
      if (!Aa.has(c)) {
        const f = rr("registerStyles", n.$tagName$);
        m4(c, a, !!(n.$flags$ & 1)), f();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => Pu(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, N4 = (t) => {
  if (!(ke.$flags$ & 1)) {
    const e = Mi(t), n = e.$cmpMeta$, r = rr("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            pg(e, e.$ancestorComponent$ = s);
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
  ke.$flags$ & 1 || Mi(t);
}, U4 = (t, e = {}) => {
  var n;
  const r = rr(), s = [], i = e.exclude || [], o = Qa.customElements, a = Hn.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), f = /* @__PURE__ */ Hn.createElement("style"), d = [];
  let l, g = !0;
  Object.assign(ke, e), ke.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Hn.baseURI).href, t.map((h) => {
    h[1].map((m) => {
      const b = {
        $flags$: m[0],
        $tagName$: m[1],
        $members$: m[2],
        $listeners$: m[3]
      };
      b.$members$ = m[2];
      const L = b.$tagName$, P = class extends HTMLElement {
        // StencilLazyHost
        constructor(U) {
          super(U), U = this, H4(U, b), b.$flags$ & 1 && U.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), g ? d.push(this) : ke.jmp(() => N4(this));
        }
        disconnectedCallback() {
          ke.jmp(() => _4(this));
        }
        componentOnReady() {
          return Mi(this).$onReadyPromise$;
        }
      };
      b.$lazyBundleId$ = h[0], !i.includes(L) && !o.get(L) && (s.push(L), o.define(L, wg(
        P,
        b,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    f.innerHTML = s + u4, f.setAttribute("data-styles", "");
    const h = (n = ke.$nonce$) !== null && n !== void 0 ? n : lg(Hn);
    h != null && f.setAttribute("nonce", h), a.insertBefore(f, c ? c.nextSibling : a.firstChild);
  }
  g = !1, d.length ? d.map((h) => h.connectedCallback()) : ke.jmp(() => l = setTimeout(gg, 30)), r();
}, Hu = /* @__PURE__ */ new WeakMap(), Mi = (t) => Hu.get(t), P4 = (t, e) => Hu.set(e.$lazyInstance$ = t, e), H4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], Hu.set(t, n);
}, jd = (t, e) => e in t, so = (t, e) => (0, console.error)(t, e), kc = /* @__PURE__ */ new Map(), O4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = kc.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (kc.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => n$).then(o, so);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (kc.set(s, o), o[r]), so);
}, Aa = /* @__PURE__ */ new Map(), Qa = typeof window < "u" ? window : {}, Hn = Qa.document || { head: {} }, ke = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, bg = (t) => Promise.resolve(t), D4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), zd = [], mg = [], F4 = (t, e) => (n) => {
  t.push(n), Il || (Il = !0, ke.$flags$ & 4 ? Ou(Ll) : ke.raf(Ll));
}, Rd = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      so(n);
    }
  t.length = 0;
}, Ll = () => {
  Rd(zd), Rd(mg), (Il = zd.length > 0) && ke.raf(Ll);
}, Ou = (t) => bg().then(t), j4 = /* @__PURE__ */ F4(mg), z4 = () => bg(), R4 = (t, e) => typeof window > "u" ? Promise.resolve() : z4().then(() => U4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var G4 = Object.defineProperty, K4 = Object.defineProperties, V4 = Object.getOwnPropertyDescriptors, va = Object.getOwnPropertySymbols, xg = Object.prototype.hasOwnProperty, Sg = Object.prototype.propertyIsEnumerable, Gd = (t, e, n) => e in t ? G4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Ye = (t, e) => {
  for (var n in e || (e = {})) xg.call(e, n) && Gd(t, n, e[n]);
  if (va) for (var n of va(e)) Sg.call(e, n) && Gd(t, n, e[n]);
  return t;
}, En = (t, e) => K4(t, V4(e)), Eg = (t, e) => {
  var n = {};
  for (var r in t) xg.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && va) for (var r of va(t)) e.indexOf(r) < 0 && Sg.call(t, r) && (n[r] = t[r]);
  return n;
};
function Ag() {
  return Ka(ws()) || window.StacksProvider || window.BlockstackProvider;
}
function Ja(t) {
  return t ? typeof t == "string" ? ms.fromName(t) : "version" in t ? t : "url" in t ? new nl({ url: t.url }) : t.transactionVersion === Ss.Mainnet ? new nl({ url: t.client.baseUrl }) : new rl({ url: t.client.baseUrl }) : new rl();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var q4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(q4 || {}), W4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(W4 || {}), Du = (t) => {
  let e = t;
  if (!e) {
    let n = new t0(["store_write"], document.location.href);
    e = new el({ appConfig: n });
  }
  return e;
};
function vg(t) {
  try {
    return Du(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var $g = (t) => {
  let e = Du(t).loadUserData().appPrivateKey, n = ve.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function X4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [xs.Mainnet]: "mainnet", [xs.Testnet]: "testnet" }, a = Ja(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function Y4(t) {
  let e = Ja(t.network), n = Du(t.userSession), r = En(Ye({}, t), { network: e, userSession: n });
  return Ye({ stxAddress: X4(r) }, r);
}
async function Z4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Yp) : n = n.map((r) => st(og(r)))), new ve.TokenSigner("ES256k", e).signAsync(En(Ye({}, t), { postConditions: n }));
}
function Q4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(Yp) : e = e.map((n) => st(og(n)))), ve.createUnsecuredToken(En(Ye({}, t), { postConditions: e }));
}
var J4 = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Pt(a.replace(/^0x/, "")), f = R3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, En(Ye({}, o), { stacksTransaction: f }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, En(Ye({}, o), { stacksTransaction: f }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, tA = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = Eg(e, ["amount", "appDetails", "userSession"]);
  if (vg(s)) {
    let { privateKey: a, publicKey: c } = $g(s), f = En(Ye({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (f.appDetails = r), Z4(f, a);
  }
  let o = En(Ye({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), Q4(o);
};
async function eA(t, e, n) {
  let r = await e(En(Ye(Ye({}, Y4(t)), t), { network: Ja(t.network) }));
  return J4({ token: r, options: t }, n);
}
function nA(t, e = Ag()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return eA(t, tA, e);
}
function Ig(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? En(Ye({}, t), { message: bd(e), domain: bd(n) }) : En(Ye({}, t), { message: st(As(e)), domain: st(As(n)) });
}
async function rA(t, e) {
  return new ve.TokenSigner("ES256k", e).signAsync(Ig(t));
}
async function sA(t) {
  let e = t, { userSession: n } = e, r = Eg(e, ["userSession"]);
  if (vg(n)) {
    let { privateKey: s, publicKey: i } = $g(n), o = En(Ye({}, r), { publicKey: i });
    return rA(o, s);
  }
  return ve.createUnsecuredToken(Ig(t));
}
var iA = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(iA || {}), kg = "asigna-stx", Kd = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === kg && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(aA(t, e), "*");
}), oA = { authenticationRequest: async (t) => Kd(t, "authenticationRequest"), transactionRequest: async (t) => Kd(t, "transactionRequest") }, aA = (t, e) => ({ source: kg, [e]: t }), cA = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = oA);
};
cA();
var lA = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function uA(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = ws(), o = Ag();
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
var Ko = uA(nA);
function Kr(t, e, n) {
  return Fu(Ne(t, e), n);
}
function Ne(t, e) {
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
      const r = hA(BigInt(`0x${Bt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Bt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Vd(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function bo(t, e = 8) {
  return (typeof t == "bigint" ? t : Ne(t, !1)).toString(16).padStart(e * 2, "0");
}
function tc(t) {
  return parseInt(t, 16);
}
function Fu(t, e = 16) {
  const n = bo(t, e);
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
function Bt(t) {
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
function Ni(t) {
  return new TextEncoder().encode(t);
}
function ju(t) {
  return new TextDecoder().decode(t);
}
function Lg(t) {
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
function qd(t) {
  if (t.some(yA))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function ec(...t) {
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
  return ec(...t.map((e) => typeof e == "number" ? qd([e]) : e instanceof Array ? qd(e) : e));
}
var Wd;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Wd || (Wd = {}));
var Xd;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Xd || (Xd = {}));
var Yd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Yd || (Yd = {}));
const Cg = 33, Lc = 32;
function wA(t) {
  if (t.length < Lc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Lc * 2), r = t.slice(2 + Lc * 2);
  return {
    recoveryId: tc(e),
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
function vs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Cl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Cl || (Cl = {}));
const vA = Cl.Mainnet, $A = 128, IA = 128, Bg = 16, ls = 32, Bl = 80, nc = 65, kA = 32, LA = 64, $a = 34;
var nt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(nt || (nt = {}));
var Lt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Lt || (Lt = {}));
var Tl;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Tl || (Tl = {}));
var De;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(De || (De = {}));
const ia = ["onChainOnly", "offChainOnly", "any"], Zd = {
  [ia[0]]: De.OnChainOnly,
  [ia[1]]: De.OffChainOnly,
  [ia[2]]: De.Any,
  [De.OnChainOnly]: De.OnChainOnly,
  [De.OffChainOnly]: De.OffChainOnly,
  [De.Any]: De.Any
};
function CA(t) {
  if (t in Zd)
    return Zd[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${ia.join(", ")}`);
}
var Ia;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ia || (Ia = {}));
Ia.Mainnet;
var Ai;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Ai || (Ai = {}));
var Fe;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Fe || (Fe = {}));
var oe;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(oe || (oe = {}));
var Wt;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Wt || (Wt = {}));
var ka;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ka || (ka = {}));
var se;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(se || (se = {}));
var io;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(io || (io = {}));
var Ml;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Ml || (Ml = {}));
var oo;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(oo || (oo = {}));
var Qd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Qd || (Qd = {}));
var Jd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Jd || (Jd = {}));
function Nl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function BA(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Tg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function TA(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Nl(t.outputLen), Nl(t.blockLen);
}
function MA(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function NA(t, e) {
  Tg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const is = {
  number: Nl,
  bool: BA,
  bytes: Tg,
  hash: TA,
  exists: MA,
  output: NA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Cc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Mn = (t, e) => t << 32 - e | t >>> e, _A = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!_A)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function UA(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function zu(t) {
  if (typeof t == "string" && (t = UA(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Mg {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Hs(t) {
  const e = (r) => t().update(zu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function PA(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, f = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + f, a, r);
}
class Ru extends Mg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Cc(this.buffer);
  }
  update(e) {
    is.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = zu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Cc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    is.exists(this), is.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    PA(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Cc(e), c = this.outputLen;
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
const HA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Ng = Uint8Array.from({ length: 16 }, (t, e) => e), OA = Ng.map((t) => (9 * t + 5) % 16);
let Gu = [Ng], Ku = [OA];
for (let t = 0; t < 4; t++)
  for (let e of [Gu, Ku])
    e.push(e[t].map((n) => HA[n]));
const _g = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), DA = Gu.map((t, e) => t.map((n) => _g[e][n])), FA = Ku.map((t, e) => t.map((n) => _g[e][n])), jA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), zA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Vo = (t, e) => t << e | t >>> 32 - e;
function th(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const qo = new Uint32Array(16);
class RA extends Ru {
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
      qo[h] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, f = this.h3 | 0, d = f, l = this.h4 | 0, g = l;
    for (let h = 0; h < 5; h++) {
      const m = 4 - h, b = jA[h], L = zA[h], P = Gu[h], U = Ku[h], p = DA[h], $ = FA[h];
      for (let I = 0; I < 16; I++) {
        const R = Vo(r + th(h, i, a, f) + qo[P[I]] + b, p[I]) + l | 0;
        r = l, l = f, f = Vo(a, 10) | 0, a = i, i = R;
      }
      for (let I = 0; I < 16; I++) {
        const R = Vo(s + th(m, o, c, d) + qo[U[I]] + L, $[I]) + g | 0;
        s = g, g = d, d = Vo(c, 10) | 0, c = o, o = R;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + f + g | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    qo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const GA = Hs(() => new RA()), KA = (t, e, n) => t & e ^ ~t & n, VA = (t, e, n) => t & e ^ t & n ^ e & n, qA = new Uint32Array([
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
]), Tr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Mr = new Uint32Array(64);
class Ug extends Ru {
  constructor() {
    super(64, 32, 8, !1), this.A = Tr[0] | 0, this.B = Tr[1] | 0, this.C = Tr[2] | 0, this.D = Tr[3] | 0, this.E = Tr[4] | 0, this.F = Tr[5] | 0, this.G = Tr[6] | 0, this.H = Tr[7] | 0;
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
      const g = Mr[l - 15], h = Mr[l - 2], m = Mn(g, 7) ^ Mn(g, 18) ^ g >>> 3, b = Mn(h, 17) ^ Mn(h, 19) ^ h >>> 10;
      Mr[l] = b + Mr[l - 7] + m + Mr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: f, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const g = Mn(a, 6) ^ Mn(a, 11) ^ Mn(a, 25), h = d + g + KA(a, c, f) + qA[l] + Mr[l] | 0, b = (Mn(r, 2) ^ Mn(r, 13) ^ Mn(r, 22)) + VA(r, s, i) | 0;
      d = f, f = c, c = a, a = o + h | 0, o = i, i = s, s = r, r = h + b | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, f, d);
  }
  roundClean() {
    Mr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class WA extends Ug {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Vu = Hs(() => new Ug());
Hs(() => new WA());
const Wo = BigInt(2 ** 32 - 1), _l = BigInt(32);
function Pg(t, e = !1) {
  return e ? { h: Number(t & Wo), l: Number(t >> _l & Wo) } : { h: Number(t >> _l & Wo) | 0, l: Number(t & Wo) | 0 };
}
function XA(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Pg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const YA = (t, e) => BigInt(t >>> 0) << _l | BigInt(e >>> 0), ZA = (t, e, n) => t >>> n, QA = (t, e, n) => t << 32 - n | e >>> n, JA = (t, e, n) => t >>> n | e << 32 - n, t8 = (t, e, n) => t << 32 - n | e >>> n, e8 = (t, e, n) => t << 64 - n | e >>> n - 32, n8 = (t, e, n) => t >>> n - 32 | e << 64 - n, r8 = (t, e) => e, s8 = (t, e) => t, i8 = (t, e, n) => t << n | e >>> 32 - n, o8 = (t, e, n) => e << n | t >>> 32 - n, a8 = (t, e, n) => e << n - 32 | t >>> 64 - n, c8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function l8(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const u8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), f8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, d8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), h8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, p8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), g8 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, It = {
  fromBig: Pg,
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
}, [y8, w8] = It.split([
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
].map((t) => BigInt(t))), Nr = new Uint32Array(80), _r = new Uint32Array(80);
class rc extends Ru {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: f, El: d, Fh: l, Fl: g, Gh: h, Gl: m, Hh: b, Hl: L } = this;
    return [e, n, r, s, i, o, a, c, f, d, l, g, h, m, b, L];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, f, d, l, g, h, m, b, L) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = g | 0, this.Gh = h | 0, this.Gl = m | 0, this.Hh = b | 0, this.Hl = L | 0;
  }
  process(e, n) {
    for (let p = 0; p < 16; p++, n += 4)
      Nr[p] = e.getUint32(n), _r[p] = e.getUint32(n += 4);
    for (let p = 16; p < 80; p++) {
      const $ = Nr[p - 15] | 0, I = _r[p - 15] | 0, R = It.rotrSH($, I, 1) ^ It.rotrSH($, I, 8) ^ It.shrSH($, I, 7), Q = It.rotrSL($, I, 1) ^ It.rotrSL($, I, 8) ^ It.shrSL($, I, 7), H = Nr[p - 2] | 0, W = _r[p - 2] | 0, S = It.rotrSH(H, W, 19) ^ It.rotrBH(H, W, 61) ^ It.shrSH(H, W, 6), C = It.rotrSL(H, W, 19) ^ It.rotrBL(H, W, 61) ^ It.shrSL(H, W, 6), _ = It.add4L(Q, C, _r[p - 7], _r[p - 16]), T = It.add4H(_, R, S, Nr[p - 7], Nr[p - 16]);
      Nr[p] = T | 0, _r[p] = _ | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: f, Dl: d, Eh: l, El: g, Fh: h, Fl: m, Gh: b, Gl: L, Hh: P, Hl: U } = this;
    for (let p = 0; p < 80; p++) {
      const $ = It.rotrSH(l, g, 14) ^ It.rotrSH(l, g, 18) ^ It.rotrBH(l, g, 41), I = It.rotrSL(l, g, 14) ^ It.rotrSL(l, g, 18) ^ It.rotrBL(l, g, 41), R = l & h ^ ~l & b, Q = g & m ^ ~g & L, H = It.add5L(U, I, Q, w8[p], _r[p]), W = It.add5H(H, P, $, R, y8[p], Nr[p]), S = H | 0, C = It.rotrSH(r, s, 28) ^ It.rotrBH(r, s, 34) ^ It.rotrBH(r, s, 39), _ = It.rotrSL(r, s, 28) ^ It.rotrBL(r, s, 34) ^ It.rotrBL(r, s, 39), T = r & i ^ r & a ^ i & a, q = s & o ^ s & c ^ o & c;
      P = b | 0, U = L | 0, b = h | 0, L = m | 0, h = l | 0, m = g | 0, { h: l, l: g } = It.add(f | 0, d | 0, W | 0, S | 0), f = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const G = It.add3L(S, _, q);
      r = It.add3H(G, W, C, T), s = G | 0;
    }
    ({ h: r, l: s } = It.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = It.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = It.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: d } = It.add(this.Dh | 0, this.Dl | 0, f | 0, d | 0), { h: l, l: g } = It.add(this.Eh | 0, this.El | 0, l | 0, g | 0), { h, l: m } = It.add(this.Fh | 0, this.Fl | 0, h | 0, m | 0), { h: b, l: L } = It.add(this.Gh | 0, this.Gl | 0, b | 0, L | 0), { h: P, l: U } = It.add(this.Hh | 0, this.Hl | 0, P | 0, U | 0), this.set(r, s, i, o, a, c, f, d, l, g, h, m, b, L, P, U);
  }
  roundClean() {
    Nr.fill(0), _r.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class b8 extends rc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class m8 extends rc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class x8 extends rc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Hs(() => new rc());
Hs(() => new b8());
const S8 = Hs(() => new m8());
Hs(() => new x8());
function Hg(t) {
  if (te(t).byteLength != nc)
    throw Error("Invalid signature");
  return {
    type: nt.MessageSignature,
    data: t
  };
}
function Ki(t, e) {
  return { type: nt.Address, version: t, hash160: e };
}
function ii(t) {
  return _s.c32address(t.version, t.hash160);
}
function $s(t, e, n) {
  const r = e || 1, s = n || $A;
  if (ty(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: nt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function qu(t) {
  const e = _s.c32addressDecode(t);
  return {
    type: nt.Address,
    version: e[0],
    hash160: e[1]
  };
}
var j;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(j || (j = {}));
function E8(t) {
  if (t.type === j.PrincipalStandard)
    return ii(t.address);
  if (t.type === j.PrincipalContract)
    return `${ii(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Og(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return $8(e, n);
  } else
    return A8(t);
}
function A8(t) {
  const e = qu(t);
  return { type: j.PrincipalStandard, address: e };
}
function v8(t) {
  return { type: j.PrincipalStandard, address: t };
}
function $8(t, e) {
  const n = qu(t), r = $s(e);
  return Dg(n, r);
}
function Dg(t, e) {
  if (Ni(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: j.PrincipalContract, address: t, contractName: e };
}
function Bc(t, e = !1) {
  switch (t.type) {
    case j.BoolTrue:
      return !0;
    case j.BoolFalse:
      return !1;
    case j.Int:
    case j.UInt:
      return e ? t.value.toString() : t.value;
    case j.Buffer:
      return `0x${Bt(t.buffer)}`;
    case j.OptionalNone:
      return null;
    case j.OptionalSome:
      return Zn(t.value);
    case j.ResponseErr:
      return Zn(t.value);
    case j.ResponseOk:
      return Zn(t.value);
    case j.PrincipalStandard:
    case j.PrincipalContract:
      return E8(t);
    case j.List:
      return t.list.map((r) => Zn(r));
    case j.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Zn(t.data[r]);
      }), n;
    case j.StringASCII:
      return t.data;
    case j.StringUTF8:
      return t.data;
  }
}
function Zn(t) {
  switch (t.type) {
    case j.ResponseErr:
      return { type: Or(t), value: Bc(t, !0), success: !1 };
    case j.ResponseOk:
      return { type: Or(t), value: Bc(t, !0), success: !0 };
    default:
      return { type: Or(t), value: Bc(t, !0) };
  }
}
function Or(t) {
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
      return `(optional ${Or(t.value)})`;
    case j.ResponseErr:
      return `(response UnknownType ${Or(t.value)})`;
    case j.ResponseOk:
      return `(response ${Or(t.value)} UnknownType)`;
    case j.PrincipalStandard:
    case j.PrincipalContract:
      return "principal";
    case j.List:
      return `(list ${t.list.length} ${t.list.length ? Or(t.list[0]) : "UnknownType"})`;
    case j.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${Or(t.data[e])})`).join(" ")})`;
    case j.StringASCII:
      return `(string-ascii ${Lg(t.data).length})`;
    case j.StringUTF8:
      return `(string-utf8 ${Ni(t.data).length})`;
  }
}
const Fg = () => ({ type: j.BoolTrue }), jg = () => ({ type: j.BoolFalse }), I8 = (t) => t ? Fg() : jg(), eh = BigInt("0xffffffffffffffffffffffffffffffff"), k8 = BigInt(0), nh = BigInt("0x7fffffffffffffffffffffffffffffff"), rh = BigInt("-170141183460469231731687303715884105728"), L8 = (t) => {
  const e = Ne(t, !0);
  if (e > nh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${nh}`);
  if (e < rh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${rh}`);
  return { type: j.Int, value: e };
}, On = (t) => {
  const e = Ne(t, !1);
  if (e < k8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > eh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${eh}`);
  return { type: j.UInt, value: e };
}, zg = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: j.Buffer, buffer: t };
};
function Rg() {
  return { type: j.OptionalNone };
}
function Gg(t) {
  return { type: j.OptionalSome, value: t };
}
function C8(t) {
  return { type: j.ResponseErr, value: t };
}
function B8(t) {
  return { type: j.ResponseOk, value: t };
}
function T8(t) {
  return { type: j.List, list: t };
}
function Is(t) {
  for (const e in t)
    if (!x6(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: j.Tuple, data: t };
}
const Ae = (t) => ({ type: j.StringASCII, data: t }), M8 = (t) => ({ type: j.StringUTF8, data: t });
class Kg extends Mg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, is.hash(e);
    const r = zu(n);
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
    const { oHash: n, iHash: r, finished: s, destroyed: i, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = s, e.destroyed = i, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const Vg = (t, e, n) => new Kg(t, e).update(n).digest();
Vg.create = (t, e) => new Kg(t, e);
ae.hmacSha256Sync = (t, ...e) => {
  const n = Vg.create(Vu, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function vi(t) {
  return {
    type: nt.PublicKey,
    data: te(t)
  };
}
function N8(t, e, n = se.Compressed) {
  const r = wA(e.data), s = new We(Vd(r.r), Vd(r.s)), i = Ct.fromSignature(t, s, r.recoveryId), o = n === se.Compressed;
  return i.toHex(o);
}
function _8(t) {
  return { type: nt.PublicKey, data: t };
}
function _i(t) {
  return !Bt(t.data).startsWith("04");
}
function La(t) {
  return t.data.slice();
}
function U8(t) {
  const e = O8(t), n = ho(e.data.slice(0, 32), e.compressed);
  return vi(Bt(n));
}
function P8(t) {
  const e = typeof t == "string" ? t : Bt(t), n = Ct.fromHex(e).toHex(!0);
  return vi(n);
}
function H8(t) {
  const e = typeof t == "string" ? t : Bt(t), n = Ct.fromHex(e).toHex(!1);
  return vi(n);
}
function Ul(t) {
  const e = t.readUInt8(), n = e === 4 ? LA : kA;
  return _8(de([e, t.readBytes(n)]));
}
function O8(t) {
  const e = bA(t), n = e.length == Cg;
  return { data: e, compressed: n };
}
function D8(t, e) {
  const [n, r] = Ua(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = bo(r, 1) + We.fromHex(n).toCompactHex();
  return Hg(i);
}
function F8(t) {
  return U8(t.data);
}
function j8(t, e, n) {
  return typeof t == "string" && (t = Og(t)), typeof n == "string" && (n = oh(n)), {
    type: nt.Payload,
    payloadType: Lt.TokenTransfer,
    recipient: t,
    amount: Ne(e, !1),
    memo: n ?? oh("")
  };
}
function z8(t, e, n, r) {
  return typeof t == "string" && (t = qu(t)), typeof e == "string" && (e = $s(e)), typeof n == "string" && (n = $s(n)), {
    type: nt.Payload,
    payloadType: Lt.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function sh(t, e, n) {
  return typeof t == "string" && (t = $s(t)), typeof e == "string" && (e = Z8(e)), typeof n == "number" ? {
    type: nt.Payload,
    payloadType: Lt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: nt.Payload,
    payloadType: Lt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function R8() {
  return { type: nt.Payload, payloadType: Lt.PoisonMicroblock };
}
function ih(t, e) {
  if (t.byteLength != ls)
    throw Error(`Coinbase buffer size must be ${ls} bytes`);
  return e != null ? {
    type: nt.Payload,
    payloadType: Lt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: nt.Payload,
    payloadType: Lt.Coinbase,
    coinbaseBytes: t
  };
}
function G8(t, e, n) {
  if (t.byteLength != ls)
    throw Error(`Coinbase buffer size must be ${ls} bytes`);
  if (n.byteLength != Bl)
    throw Error(`VRF proof buffer size must be ${Bl} bytes`);
  return {
    type: nt.Payload,
    payloadType: Lt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === j.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Pl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Pl || (Pl = {}));
function K8(t, e, n, r, s, i, o) {
  return {
    type: nt.Payload,
    payloadType: Lt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function qg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Lt.TokenTransfer:
      e.push(ue(t.recipient)), e.push(Kr(t.amount, !1, 8)), e.push(Xn(t.memo));
      break;
    case Lt.ContractCall:
      e.push(Xn(t.contractAddress)), e.push(Xn(t.contractName)), e.push(Xn(t.functionName));
      const n = new Uint8Array(4);
      vs(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(ue(r));
      });
      break;
    case Lt.SmartContract:
      e.push(Xn(t.contractName)), e.push(Xn(t.codeBody));
      break;
    case Lt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Xn(t.contractName)), e.push(Xn(t.codeBody));
      break;
    case Lt.PoisonMicroblock:
      break;
    case Lt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Lt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(ue(t.recipient));
      break;
    case Lt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(ue(t.recipient ? Gg(t.recipient) : Rg())), e.push(t.vrfProof);
      break;
    case Lt.TenureChange:
      e.push(te(t.tenureHash)), e.push(te(t.previousTenureHash)), e.push(te(t.burnViewHash)), e.push(te(t.previousTenureEnd)), e.push(vs(new Uint8Array(4), t.previousTenureBlocks)), e.push(EA(new Uint8Array(1), t.cause)), e.push(te(t.publicKeyHash));
      break;
  }
  return de(e);
}
function V8(t) {
  switch (t.readUInt8Enum(Lt, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Lt.TokenTransfer:
      const n = ln(t), r = Ne(t.readBytes(8), !1), s = Xg(t);
      return j8(n, r, s);
    case Lt.ContractCall:
      const i = $i(t), o = cn(t), a = cn(t), c = [], f = t.readUInt32BE();
      for (let p = 0; p < f; p++) {
        const $ = ln(t);
        c.push($);
      }
      return z8(i, o, a, c);
    case Lt.SmartContract:
      const d = cn(t), l = cn(t, 4, 1e5);
      return sh(d, l);
    case Lt.VersionedSmartContract: {
      const p = t.readUInt8Enum(Tl, (R) => {
        throw new Error(`Cannot recognize ClarityVersion: ${R}`);
      }), $ = cn(t), I = cn(t, 4, 1e5);
      return sh($, I, p);
    }
    case Lt.PoisonMicroblock:
      return R8();
    case Lt.Coinbase: {
      const p = t.readBytes(ls);
      return ih(p);
    }
    case Lt.CoinbaseToAltRecipient: {
      const p = t.readBytes(ls), $ = ln(t);
      return ih(p, $);
    }
    case Lt.NakamotoCoinbase: {
      const p = t.readBytes(ls), $ = ln(t), I = t.readBytes(Bl);
      return G8(p, $, I);
    }
    case Lt.TenureChange:
      const g = Bt(t.readBytes(20)), h = Bt(t.readBytes(20)), m = Bt(t.readBytes(20)), b = Bt(t.readBytes(32)), L = t.readUInt32BE(), P = t.readUInt8Enum(Pl, (p) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${p}`);
      }), U = Bt(t.readBytes(20));
      return K8(g, h, m, b, L, P, U);
  }
}
class sc extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class ts extends sc {
  constructor(e) {
    super(e);
  }
}
class qe extends sc {
  constructor(e) {
    super(e);
  }
}
class Ca extends sc {
  constructor(e) {
    super(e);
  }
}
class os extends sc {
  constructor(e) {
    super(e);
  }
}
var mn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(mn || (mn = {}));
function Hl(t) {
  return Hg(Bt(t.readBytes(nc)));
}
function oi(t, e) {
  return {
    pubKeyEncoding: t,
    type: nt.TransactionAuthField,
    contents: e
  };
}
function q8(t) {
  const e = t.readUInt8Enum(mn, (n) => {
    throw new qe(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case mn.PublicKeyCompressed:
      return oi(se.Compressed, Ul(t));
    case mn.PublicKeyUncompressed:
      return oi(se.Uncompressed, H8(Ul(t).data));
    case mn.SignatureCompressed:
      return oi(se.Compressed, Hl(t));
    case mn.SignatureUncompressed:
      return oi(se.Uncompressed, Hl(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function Wu(t) {
  return te(t.data);
}
function W8(t) {
  const e = [];
  switch (t.contents.type) {
    case nt.PublicKey:
      e.push(t.pubKeyEncoding === se.Compressed ? mn.PublicKeyCompressed : mn.PublicKeyUncompressed), e.push(La(P8(t.contents.data)));
      break;
    case nt.MessageSignature:
      e.push(t.pubKeyEncoding === se.Compressed ? mn.SignatureCompressed : mn.SignatureUncompressed), e.push(Wu(t.contents));
      break;
  }
  return de(e);
}
function Xn(t) {
  switch (t.type) {
    case nt.Address:
      return mo(t);
    case nt.Principal:
      return Wg(t);
    case nt.LengthPrefixedString:
      return Ii(t);
    case nt.MemoString:
      return Q8(t);
    case nt.AssetInfo:
      return Yg(t);
    case nt.PostCondition:
      return J8(t);
    case nt.PublicKey:
      return La(t);
    case nt.LengthPrefixedList:
      return Zu(t);
    case nt.Payload:
      return qg(t);
    case nt.TransactionAuthField:
      return W8(t);
    case nt.MessageSignature:
      return Wu(t);
  }
}
function X8() {
  return {
    type: nt.Address,
    version: ka.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Xu(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === Wt.SerializeP2PKH || e === Wt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === Wt.SerializeP2WPKH || e === Wt.SerializeP2WSH || e === Wt.SerializeP2WSHNonSequential) && !r.every(_i))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case Wt.SerializeP2PKH:
      return Ki(t, y6(r[0].data));
    case Wt.SerializeP2WPKH:
      return Ki(t, w6(r[0].data));
    case Wt.SerializeP2SH:
    case Wt.SerializeP2SHNonSequential:
      return Ki(t, b6(n, r.map(La)));
    case Wt.SerializeP2WSH:
    case Wt.SerializeP2WSHNonSequential:
      return Ki(t, m6(n, r.map(La)));
  }
}
function mo(t) {
  const e = [];
  return e.push(te(bo(t.version, 1))), e.push(te(t.hash160)), de(e);
}
function $i(t) {
  const e = tc(Bt(t.readBytes(1))), n = Bt(t.readBytes(20));
  return { type: nt.Address, version: e, hash160: n };
}
function Wg(t) {
  const e = [];
  return e.push(t.prefix), e.push(mo(t.address)), t.prefix === oo.Contract && e.push(Ii(t.contractName)), de(e);
}
function Y8(t) {
  const e = t.readUInt8Enum(oo, (s) => {
    throw new qe(`Unexpected Principal payload type: ${s}`);
  }), n = $i(t);
  if (e === oo.Standard)
    return { type: nt.Principal, prefix: e, address: n };
  const r = cn(t);
  return {
    type: nt.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Ii(t) {
  const e = [], n = Ni(t.content), r = n.byteLength;
  return e.push(te(bo(r, t.lengthPrefixBytes))), e.push(n), de(e);
}
function cn(t, e, n) {
  e = e || 1;
  const r = tc(Bt(t.readBytes(e))), s = ju(t.readBytes(r));
  return $s(s, e, n ?? 128);
}
function Z8(t) {
  return $s(t, 4, 1e5);
}
function oh(t) {
  if (t && ty(t, $a))
    throw new Error(`Memo exceeds maximum length of ${$a} bytes`);
  return { type: nt.MemoString, content: t };
}
function Q8(t) {
  const e = [], n = Ni(t.content), r = g6(Bt(n), $a * 2);
  return e.push(te(r)), de(e);
}
function Xg(t) {
  let e = ju(t.readBytes($a));
  return e = e.replace(/\u0000*$/, ""), { type: nt.MemoString, content: e };
}
function Yg(t) {
  const e = [];
  return e.push(mo(t.address)), e.push(Ii(t.contractName)), e.push(Ii(t.assetName)), de(e);
}
function Ol(t) {
  return {
    type: nt.AssetInfo,
    address: $i(t),
    contractName: cn(t),
    assetName: cn(t)
  };
}
function Yu(t, e) {
  return {
    type: nt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Zu(t) {
  const e = t.values, n = [];
  n.push(te(bo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Xn(r));
  return de(n);
}
function Zg(t, e, n) {
  const r = tc(Bt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case nt.Address:
        s.push($i(t));
        break;
      case nt.LengthPrefixedString:
        s.push(cn(t));
        break;
      case nt.MemoString:
        s.push(Xg(t));
        break;
      case nt.AssetInfo:
        s.push(Ol(t));
        break;
      case nt.PostCondition:
        s.push(t6(t));
        break;
      case nt.PublicKey:
        s.push(Ul(t));
        break;
      case nt.TransactionAuthField:
        s.push(q8(t));
        break;
    }
  return Yu(s, n);
}
function J8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Wg(t.principal)), (t.conditionType === Fe.Fungible || t.conditionType === Fe.NonFungible) && e.push(Yg(t.assetInfo)), t.conditionType === Fe.NonFungible && e.push(ue(t.assetName)), e.push(t.conditionCode), t.conditionType === Fe.STX || t.conditionType === Fe.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new ts("The post-condition amount may not be larger than 8 bytes");
    e.push(Kr(t.amount, !1, 8));
  }
  return de(e);
}
function t6(t) {
  const e = t.readUInt8Enum(Fe, (o) => {
    throw new qe(`Could not read ${o} as PostConditionType`);
  }), n = Y8(t);
  let r, s, i;
  switch (e) {
    case Fe.STX:
      return r = t.readUInt8Enum(io, (a) => {
        throw new qe(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Bt(t.readBytes(8))}`), {
        type: nt.PostCondition,
        conditionType: Fe.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case Fe.Fungible:
      return s = Ol(t), r = t.readUInt8Enum(io, (a) => {
        throw new qe(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Bt(t.readBytes(8))}`), {
        type: nt.PostCondition,
        conditionType: Fe.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case Fe.NonFungible:
      s = Ol(t);
      const o = ln(t);
      return r = t.readUInt8Enum(Ml, (a) => {
        throw new qe(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: nt.PostCondition,
        conditionType: Fe.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Rn(t, e) {
  return de([t, e]);
}
function e6(t) {
  return new Uint8Array([t.type]);
}
function n6(t) {
  return t.type === j.OptionalNone ? new Uint8Array([t.type]) : Rn(t.type, ue(t.value));
}
function r6(t) {
  const e = new Uint8Array(4);
  return vs(e, t.buffer.length, 0), Rn(t.type, ec(e, t.buffer));
}
function s6(t) {
  const e = Fu(fA(t.value, BigInt(IA)), Bg);
  return Rn(t.type, e);
}
function i6(t) {
  const e = Fu(t.value, Bg);
  return Rn(t.type, e);
}
function o6(t) {
  return Rn(t.type, mo(t.address));
}
function a6(t) {
  return Rn(t.type, ec(mo(t.address), Ii(t.contractName)));
}
function c6(t) {
  return Rn(t.type, ue(t.value));
}
function l6(t) {
  const e = [], n = new Uint8Array(4);
  vs(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = ue(r);
    e.push(s);
  }
  return Rn(t.type, de(e));
}
function u6(t) {
  const e = [], n = new Uint8Array(4);
  vs(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = $s(s);
    e.push(Ii(i));
    const o = ue(t.data[s]);
    e.push(o);
  }
  return Rn(t.type, de(e));
}
function Qg(t, e) {
  const n = [], r = e == "ascii" ? Lg(t.data) : Ni(t.data), s = new Uint8Array(4);
  return vs(s, r.length, 0), n.push(s), n.push(r), Rn(t.type, de(n));
}
function f6(t) {
  return Qg(t, "ascii");
}
function d6(t) {
  return Qg(t, "utf8");
}
function ue(t) {
  switch (t.type) {
    case j.BoolTrue:
    case j.BoolFalse:
      return e6(t);
    case j.OptionalNone:
    case j.OptionalSome:
      return n6(t);
    case j.Buffer:
      return r6(t);
    case j.UInt:
      return i6(t);
    case j.Int:
      return s6(t);
    case j.PrincipalStandard:
      return o6(t);
    case j.PrincipalContract:
      return a6(t);
    case j.ResponseOk:
    case j.ResponseErr:
      return c6(t);
    case j.List:
      return l6(t);
    case j.Tuple:
      return u6(t);
    case j.StringASCII:
      return f6(t);
    case j.StringUTF8:
      return d6(t);
    default:
      throw new ts("Unable to serialize. Invalid Clarity Value.");
  }
}
function h6(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const ah = /* @__PURE__ */ new Map();
function Jg(t, e) {
  const n = ah.get(t);
  if (n !== void 0)
    return n(e);
  const r = h6(t);
  return ah.set(t, r), Jg(t, e);
}
class Yi {
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
    const n = this.readBytes(e).slice().reverse(), r = Bt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Bt(n);
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
    if (Jg(e, r))
      return r;
    throw n(r);
  }
}
function ln(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Yi(te(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Yi(t) : e = t;
  switch (e.readUInt8Enum(j, (r) => {
    throw new qe(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case j.Int:
      return L8(e.readBytes(16));
    case j.UInt:
      return On(e.readBytes(16));
    case j.Buffer:
      const r = e.readUInt32BE();
      return zg(e.readBytes(r));
    case j.BoolTrue:
      return Fg();
    case j.BoolFalse:
      return jg();
    case j.PrincipalStandard:
      const s = $i(e);
      return v8(s);
    case j.PrincipalContract:
      const i = $i(e), o = cn(e);
      return Dg(i, o);
    case j.ResponseOk:
      return B8(ln(e));
    case j.ResponseErr:
      return C8(ln(e));
    case j.OptionalNone:
      return Rg();
    case j.OptionalSome:
      return Gg(ln(e));
    case j.List:
      const a = e.readUInt32BE(), c = [];
      for (let b = 0; b < a; b++)
        c.push(ln(e));
      return T8(c);
    case j.Tuple:
      const f = e.readUInt32BE(), d = {};
      for (let b = 0; b < f; b++) {
        const L = cn(e).content;
        if (L === void 0)
          throw new qe('"content" is undefined');
        d[L] = ln(e);
      }
      return Is(d);
    case j.StringASCII:
      const l = e.readUInt32BE(), g = gA(e.readBytes(l));
      return Ae(g);
    case j.StringUTF8:
      const h = e.readUInt32BE(), m = ju(e.readBytes(h));
      return M8(m);
    default:
      throw new qe("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const p6 = (t) => t.length % 2 == 0 ? t : `0${t}`, g6 = (t, e) => t.padEnd(e, "0"), ty = (t, e) => t ? Ni(t).length > e : !1;
function Dl(t) {
  return mp(t);
}
const ao = (t) => GA(Vu(t)), Qu = (t) => Bt(S8(t)), y6 = (t) => Bt(ao(t)), w6 = (t) => {
  const e = ao(t), n = ec(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ao(n);
  return Bt(r);
}, b6 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = de(n), s = ao(r);
  return Bt(s);
}, m6 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = de(n), s = Vu(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = de(i), a = ao(o);
  return Bt(a);
};
function x6(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function ey(t) {
  const e = ue(t);
  return `0x${Bt(e)}`;
}
function S6(t) {
  return ln(t);
}
const li = (t) => {
  try {
    return _s.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Ju() {
  return {
    type: nt.MessageSignature,
    data: Bt(new Uint8Array(nc))
  };
}
function ny(t, e, n, r) {
  const s = Xu(0, t, 1, [vi(e)]).hash160, i = _i(vi(e)) ? se.Compressed : se.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Ne(n, !1),
    fee: Ne(r, !1),
    keyEncoding: i,
    signature: Ju()
  };
}
function co(t) {
  return "signature" in t;
}
function ch(t) {
  return t === Wt.SerializeP2SH || t === Wt.SerializeP2WSH;
}
function E6(t) {
  return t === Wt.SerializeP2SHNonSequential || t === Wt.SerializeP2WSHNonSequential;
}
function lh(t) {
  const e = Dl(t);
  return e.nonce = 0, e.fee = 0, co(e) ? e.signature = Ju() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function A6(t) {
  const e = [
    t.hashMode,
    te(t.signer),
    Kr(t.nonce, !1, 8),
    Kr(t.fee, !1, 8),
    t.keyEncoding,
    Wu(t.signature)
  ];
  return de(e);
}
function v6(t) {
  const e = [
    t.hashMode,
    te(t.signer),
    Kr(t.nonce, !1, 8),
    Kr(t.fee, !1, 8)
  ], n = Yu(t.fields);
  e.push(Zu(n));
  const r = new Uint8Array(2);
  return xA(r, t.signaturesRequired, 0), e.push(r), de(e);
}
function $6(t, e) {
  const n = Bt(e.readBytes(20)), r = BigInt(`0x${Bt(e.readBytes(8))}`), s = BigInt(`0x${Bt(e.readBytes(8))}`), i = e.readUInt8Enum(se, (a) => {
    throw new qe(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === Wt.SerializeP2WPKH && i != se.Compressed)
    throw new qe("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Hl(e);
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
  const n = Bt(e.readBytes(20)), r = BigInt("0x" + Bt(e.readBytes(8))), s = BigInt("0x" + Bt(e.readBytes(8))), i = Zg(e, nt.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const f of i)
    switch (f.contents.type) {
      case nt.PublicKey:
        _i(f.contents) || (o = !0);
        break;
      case nt.MessageSignature:
        if (f.pubKeyEncoding === se.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new os("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === Wt.SerializeP2WSH || t === Wt.SerializeP2WSHNonSequential))
    throw new os("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Tc(t) {
  return co(t) ? A6(t) : v6(t);
}
function Mc(t) {
  const e = t.readUInt8Enum(Wt, (n) => {
    throw new qe(`Could not parse ${n} as AddressHashMode`);
  });
  return e === Wt.SerializeP2PKH || e === Wt.SerializeP2WPKH ? $6(e, t) : I6(e, t);
}
function ry(t, e, n, r) {
  const i = t + Bt(new Uint8Array([e])) + Bt(Kr(n, !1, 8)) + Bt(Kr(r, !1, 8));
  if (te(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Qu(te(i));
}
function sy(t, e, n) {
  const r = 33 + nc, s = _i(e) ? se.Compressed : se.Uncompressed, i = t + p6(s.toString(16)) + n.data, o = te(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Qu(o);
}
function k6(t, e, n, r, s) {
  const i = ry(t, e, n, r), o = D8(s, i), a = F8(s), c = sy(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function iy(t, e, n, r, s, i) {
  const o = ry(t, e, n, r), a = vi(N8(o, i, s)), c = sy(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function L6() {
  const t = ny(Wt.SerializeP2PKH, "", 0, 0);
  return t.signer = X8().hash160, t.keyEncoding = se.Compressed, t.signature = Ju(), t;
}
function uh(t, e, n) {
  return co(t) ? C6(t, e, n) : B6(t, e, n);
}
function C6(t, e, n) {
  const { pubKey: r, nextSigHash: s } = iy(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = Xu(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new os(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function B6(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case nt.PublicKey:
        _i(c.contents) || (i = !0), r.push(c.contents);
        break;
      case nt.MessageSignature:
        c.pubKeyEncoding === se.Uncompressed && (i = !0);
        const { pubKey: f, nextSigHash: d } = iy(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (ch(t.hashMode) && (s = d), r.push(f), o += 1, o === 65536)
          throw new os("Too many signatures");
        break;
    }
  if (ch(t.hashMode) && o !== t.signaturesRequired || E6(t.hashMode) && o < t.signaturesRequired)
    throw new os("Incorrect number of signatures");
  if (i && (t.hashMode === Wt.SerializeP2WSH || t.hashMode === Wt.SerializeP2WSHNonSequential))
    throw new os("Uncompressed keys are not allowed in this hash mode");
  const a = Xu(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new os(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function oy(t) {
  return {
    authType: oe.Standard,
    spendingCondition: t
  };
}
function ay(t, e) {
  return {
    authType: oe.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || ny(Wt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function fh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case oe.Standard:
        return oy(lh(t.spendingCondition));
      case oe.Sponsored:
        return ay(lh(t.spendingCondition), L6());
      default:
        throw new Ca("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function T6(t, e) {
  switch (t.authType) {
    case oe.Standard:
      return uh(t.spendingCondition, e, oe.Standard);
    case oe.Sponsored:
      return uh(t.spendingCondition, e, oe.Standard);
    default:
      throw new Ca("Invalid origin auth type");
  }
}
function M6(t, e) {
  switch (t.authType) {
    case oe.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Ne(e, !1)
      };
      return { ...t, spendingCondition: n };
    case oe.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Ne(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function N6(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Ne(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function _6(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Ne(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function U6(t, e) {
  const n = {
    ...e,
    nonce: Ne(e.nonce, !1),
    fee: Ne(e.fee, !1)
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
      e.push(Tc(t.spendingCondition));
      break;
    case oe.Sponsored:
      e.push(Tc(t.spendingCondition)), e.push(Tc(t.sponsorSpendingCondition));
      break;
  }
  return de(e);
}
function H6(t) {
  const e = t.readUInt8Enum(oe, (r) => {
    throw new qe(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case oe.Standard:
      return n = Mc(t), oy(n);
    case oe.Sponsored:
      n = Mc(t);
      const r = Mc(t);
      return ay(n, r);
  }
}
class O6 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Ne(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? vA, this.postConditionMode = i ?? Ai.Deny, this.postConditions = s ?? Yu([]), o)
      this.anchorMode = CA(o);
    else
      switch (r.payloadType) {
        case Lt.Coinbase:
        case Lt.CoinbaseToAltRecipient:
        case Lt.NakamotoCoinbase:
        case Lt.PoisonMicroblock:
        case Lt.TenureChange:
          this.anchorMode = De.OnChainOnly;
          break;
        case Lt.ContractCall:
        case Lt.SmartContract:
        case Lt.VersionedSmartContract:
        case Lt.TokenTransfer:
          this.anchorMode = De.Any;
          break;
      }
  }
  signBegin() {
    const e = Dl(this);
    return e.auth = fh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Dl(this);
    return e.auth = fh(e.auth), e.txid();
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
    if (n && !co(n)) {
      const r = _i(e);
      n.fields.push(oi(r ? se.Compressed : se.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = k6(n, r, e.fee, e.nonce, s);
    return co(e) ? e.signature = i : e.fields.push(oi(s.data.byteLength === Cg ? se.Compressed : se.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return Qu(e);
  }
  setSponsor(e) {
    if (this.auth.authType != oe.Sponsored)
      throw new Ca("Cannot sponsor sign a non-sponsored transaction");
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
      throw new Ca("Cannot sponsor sign a non-sponsored transaction");
    this.auth = _6(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new ts('"version" is undefined');
    if (this.chainId === void 0)
      throw new ts('"chainId" is undefined');
    if (this.auth === void 0)
      throw new ts('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new ts('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new ts('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return vs(n, this.chainId, 0), e.push(n), e.push(P6(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Zu(this.postConditions)), e.push(qg(this.payload)), de(e);
  }
}
function tf(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Yi(te(t.slice(2))) : e = new Yi(te(t)) : t instanceof Uint8Array ? e = new Yi(t) : e = t;
  const n = e.readUInt8Enum(Ia, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = H6(e), i = e.readUInt8Enum(De, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(Ai, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = Zg(e, nt.PostCondition), c = V8(e);
  return new O6(n, s, c, a, o, i, r);
}
const D6 = I8, Zi = On, F6 = zg;
const j6 = /* @__PURE__ */ new Set([4001, -31001]), z6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], R6 = ["result", "data", "payload", "response", "params"], dh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], ic = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Os = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Jn = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, G6 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), cy = (t) => {
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
}, ly = (t) => t ? cy(Os()).some(
  (e) => {
    var n;
    return e.id === t && (ic(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, uy = () => {
  if (typeof window > "u")
    return;
  const t = Os(), e = cy(t).filter(
    (n) => {
      var r;
      return ic(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Jn(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of z6) {
    const r = Jn(t, n) ?? (t === window ? void 0 : Jn(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, K6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Os(), n = Jn(e, t) ?? (e === window ? void 0 : Jn(window, t)) ?? Ka(t);
  if (n)
    return n;
  if (ic(t) || ly(t))
    return uy();
}, Xo = (t, e) => {
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
const fy = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Ve = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, W6 = (t) => {
  const e = Ve(t);
  if (!e)
    return null;
  const n = fy(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, X6 = (t) => {
  const e = Ve(t);
  if (!e)
    return null;
  const n = fy(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Fl = (t, e = "mainnet") => {
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
      return Fl(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Fl(r, e);
  }
  return e;
}, us = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, lo = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return li(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = lo(s, e + 1);
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
    const i = lo(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && li(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && li(n.testnet) ? n.testnet.trim() : null;
}, hh = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, dy = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && j6.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, ks = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Ve(n == null ? void 0 : n.message) ?? Ve(e.message) ?? Ve(e.error) ?? Ve(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, ki = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw ks(e);
    if (e.status === "error")
      throw ks(e.result ?? e);
  }
  return t;
}, ph = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return ki(r);
  } catch (r) {
    throw ks(r);
  }
}, hy = () => uy(), ef = () => {
  if (typeof window > "u")
    return;
  const t = Os();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Jn(t, e) ?? (t === window ? void 0 : Jn(window, e));
    if (n)
      return n;
  }
}, gh = () => {
  if (typeof window > "u")
    return;
  const t = ef();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Os();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Jn(e, n) ?? (e === window ? void 0 : Jn(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, oa = (t) => {
  var r, s;
  const e = ws();
  if (ic(e) || ly(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Os() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === hy();
}, Nc = (t) => {
  const e = X6(t);
  if (!e)
    return null;
  try {
    const n = tf(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Ba = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = Nc(t), r = W6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Ve(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Ba(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of dh)
    if (Nc(s[a])) {
      i = Ve(s[a]);
      break;
    }
  const o = Ve(s.txId) || Ve(s.txid) || Ve(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? Ve(s.txRaw) ?? void 0
    };
  for (const a of dh) {
    const c = Nc(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Ve(s[a]) ?? void 0
      };
  }
  for (const a of R6) {
    const c = s[a], f = Ba(c, e + 1);
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
}, _c = (t) => {
  const e = Ba(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, Y6 = (t) => {
  const e = Ba(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, Z6 = (t) => ({
  ...t,
  fee: us(t.fee),
  nonce: us(t.nonce),
  sponsored: t.sponsored === !0
}), yh = (t) => ({
  recipient: t.recipient,
  amount: us(t.amount) ?? "0",
  memo: t.memo,
  network: Fl(t.network),
  address: t.stxAddress,
  fee: us(t.fee),
  nonce: us(t.nonce),
  sponsored: t.sponsored ?? !1
}), py = "WALLET_ADDRESS_MISMATCH", Q6 = 45e3;
let Qi = null;
const jl = (t) => {
  t && (Qi = { address: t, at: Date.now() });
}, J6 = () => {
  Qi = null;
}, tv = () => Qi && Date.now() - Qi.at <= Q6 ? Qi.address : null, ev = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, nv = async (t) => {
  J6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = ki(await t.request("wallet_connect")), n = lo(e);
  return jl(n), n;
}, rv = async (t, e, n, r) => {
  try {
    return ki(await t.request(e, n));
  } catch (s) {
    const i = ks(s);
    if (!ev(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await nv(t);
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
        { code: o ? py : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return ki(await t.request(e, n));
    } catch (a) {
      throw ks(a);
    }
  }
};
let wh = 3e4;
const sv = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${wh / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, wh);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, iv = async (t, e, n) => {
  const r = (c, f) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${f}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: py }
      );
    return c;
  }, s = tv();
  if (s)
    return Xo(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  Xo(n, "account-read");
  try {
    const c = ki(
      await sv(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = lo(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (dy(c))
      throw ks(c);
    Xo(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return jl(i), r(i, "wallet_getAccount");
  let o;
  Xo(n, "account-reconnect");
  try {
    o = ki(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), ks(c);
  }
  const a = lo(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return jl(a), r(a, "wallet_connect");
}, ov = async (t, e) => {
  if (!oa(t)) {
    const i = await ph(
      t,
      "stx_transferStx",
      yh(e)
    );
    return _c(i);
  }
  const n = ef();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await ph(
      n,
      "stx_transferStx",
      yh(e)
    );
    return _c(i);
  }
  const r = hy();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await iv(r, e.stxAddress);
  const s = await rv(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: us(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: us(e.fee) } : {}
    },
    e.stxAddress
  );
  return _c(s);
}, av = () => ws(), gy = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = ws(), e = t ? K6(t) : void 0;
  if (e)
    return e;
  const n = Os() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, bh = (t, e) => {
  const n = gy(), r = Z6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, Y6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return Ko(r, e);
  if (oa(n) && !ef()) {
    const s = gh();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: ws(),
        route: "legacy-transaction-request"
      }), Ko(r, s);
  }
  return void ov(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (hh(s) && oa(n)) {
      const a = gh();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: ws(),
          route: "legacy-transaction-request"
        }), Ko(r, a);
        return;
      }
    }
    if (hh(s) && !oa(n)) {
      Ko(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), dy(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, mh = (t) => ey(t).replace(/^0x/, ""), xh = "This wallet cannot sign messages. Try Xverse or Leather.", Sh = (t) => typeof (t == null ? void 0 : t.request) == "function", Eh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", cv = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, lv = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function uv(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: mh(e.message),
    domain: mh(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function fv(t, e) {
  const n = await sA({
    domain: e.domain,
    message: e.message,
    network: Ja(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Ah(t) {
  var s, i;
  const e = av() || "", n = /xverse/i.test(e);
  let r = gy();
  if (n && !Eh(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (Eh(r))
    try {
      return await fv(r, t);
    } catch (o) {
      if (n || !Sh(r) || !lv(o)) throw o;
    }
  if (!n && Sh(r))
    try {
      return await uv(r, t);
    } catch (o) {
      throw cv(o) ? new Error(xh) : o;
    }
  throw new Error(xh);
}
const vh = 1000000n, as = 1000000n, zl = 50n, tr = 3000n, xo = 300n, Yo = 3000n, dv = 50000n, Uc = 200n, er = (t) => t + zl;
function gn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / vh}.${(n % vh).toString().padStart(6, "0")}`;
}
function $h(t, e = xo) {
  return t <= tr ? 0 : Number((t - tr) / er(e));
}
function Pc(t, e = 0n) {
  const n = as - t - e;
  return n > 0n ? n : 0n;
}
function hv(t, e = xo) {
  return t > as ? "over" : t < tr + er(e) ? "empty" : t < dv ? "low" : "ok";
}
const pv = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", gv = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", yv = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function wv(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || yv.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== pv + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const yy = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Hc = 3, bv = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [Rl, wy] = yy.split("."), sn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function Gl(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function mv(t) {
  return sn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Rr(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function by(t, e = []) {
  const n = await Rr(`/v2/contracts/call-read/${Rl}/${wy}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Rl, arguments: e.map((r) => "0x" + sn(ue(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Zn(ln(n.result));
}
async function xv() {
  const t = await Rr(`/v2/contracts/source/${Rl}/${wy}?proof=0`);
  if (typeof t.source != "string" || await mv(t.source) !== gv) throw Error("Deployed source does not match the tested helper.");
  if (wv(await by("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function my(t) {
  return t.startsWith("SP") && li(t) && !t.includes(".");
}
async function Sv(t) {
  var r;
  if (!my(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Rr(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Rr(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function Ev(t) {
  const e = await Rr(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function Av(t, e) {
  var s, i;
  const n = await by("get-owner", [Zi(t), Zi(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !my(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function vv(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Gl(t), signal: AbortSignal.timeout(15e3) });
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
async function $v(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function Iv(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = tf(Gl(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || ii(Ki(ka.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || ii(r.contractAddress) + "." + r.contractName.content !== yy || r.functionName.content !== "play" || r.functionArgs.length !== 3 || sn(ue(r.functionArgs[0])) !== sn(ue(Zi(t.core))) || sn(ue(r.functionArgs[1])) !== sn(ue(Zi(t.song))) || sn(ue(r.functionArgs[2])) !== sn(ue(F6(Gl(t.id)))) || t.amount !== "50" || e.postConditionMode !== Ai.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== io.Equal || i.principal.prefix !== 2 || ii(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || ii(r.contractAddress) + "." + r.contractName.content !== bv || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || sn(ue(r.functionArgs[0])) !== sn(ue(Zi(t.song))) || typeof t.liked != "boolean" || sn(ue(r.functionArgs[1])) !== sn(ue(D6(t.liked))) || t.amount !== "0" || e.postConditionMode !== Ai.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Zn(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const kv = "xtrata.xyz/radio/listening-wallet", Lv = "Link a temporary listening wallet for pay-per-play; no spending permission", Ls = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && li(t), Cv = (t) => ({
  domain: Is({ name: Ae(kv), version: Ae("1"), "chain-id": On(1) }),
  message: Is({
    purpose: Ae(Lv),
    main: Ae(t.main),
    listening: Ae(t.listening),
    issued: On(t.issued)
  })
}), xy = 100000n, Bv = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function Tv(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Ls(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= xy).sort(Bv);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const Zo = 50;
function Ta(t) {
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
async function Mv(t, e, n = 4) {
  if (!Ls(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${Zo}&offset=${o}`, s = Ta(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - Zo);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= Zo ? s : Ta(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = Tv(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - Zo);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const qn = 50, Nv = 6, _v = 20, Ih = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function kh(t, e) {
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
async function Uv(t, e, n) {
  if (!Ls(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = Ta(await e(`/extended/v1/address/${t}/stx_inbound?limit=${qn}&offset=0`));
    if (!s || s.total > Nv * qn) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = qn; o < s.total; o += qn) {
      const a = Ta(await e(`/extended/v1/address/${t}/stx_inbound?limit=${qn}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (f) => `/extended/v1/address/${t}/transactions?limit=${qn}&offset=${f}`, a = kh(await e(o(0)), t);
      if (!a || a.total > _v * qn) return { ok: !1 };
      const c = new Set(a.rows);
      for (const f of a.sent) i.set(f.txId, f);
      for (let f = qn; f < a.total; f += qn) {
        const d = kh(await e(o(f)), t);
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
function Pv(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(Ih).map((l, g) => {
    const h = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: h, kind: "gift", to: r.payer, at: g } : Ls(l.sender) && h >= xy ? { sender: l.sender, left: h, kind: "deposit", to: l.sender, at: g } : { sender: l.sender, left: h, kind: "dust", to: null, at: g };
  }), i = s.reduce((l, g) => l + g.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && Ls(l.recipient) && l.amount > 0n).sort(Ih), a = o.reduce((l, g) => l + g.amount, 0n), c = i - n - a;
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
function Hv(t, e) {
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
function Lh(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const zi = ["prepared", "signed", "unknown", "pending"], Ov = 30 * 6e4, Zs = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, Dv = 3e3, Ch = "Your main listener wallet is out of funds, so likes are paused. Top it up (it only needs a little) and your likes carry on.", Bh = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function Fv(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, f = null, d = !1, l = !1, g = !1, h = null, m = !1, b = "", L = "", P, U = null, p, $ = [], I, R = -1 / 0;
  const Q = /* @__PURE__ */ new Set();
  let H = null, W = !1, S = 0, C = null, _ = null, T = !1, q = null, G = !1, yt = null, ut = !1, he = !1, E = !1, M = !1, kt = !1, pt = 0, ct = null, xt = Promise.resolve();
  const Nt = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? xo.toString()), Dt = (w) => !!i && !(i.features ?? []).includes(w), Vt = (w, v) => `xtrata.ppp.v1.${w}:${v}`, pe = (w = i == null ? void 0 : i.address) => {
    if (!w) return [];
    try {
      const v = JSON.parse(t.store.get(Vt("entries", w)) || "[]");
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  }, Ut = (w) => {
    const v = [w, ...pe(w.address).filter((F) => !(F.txid === w.txid && F.kind === w.kind))].slice(0, 200);
    t.store.set(Vt("entries", w.address), JSON.stringify(v));
  }, ze = (w = i == null ? void 0 : i.address) => !!w && t.store.get(Vt("on", w)) !== "0", un = (w) => {
    i != null && i.address && t.store.set(Vt("on", i.address), w ? "1" : "0");
  }, B = () => pe().filter((w) => zi.includes(w.status)), Y = () => gt() ? [...B(), ...pe(Tt()).filter((w) => zi.includes(w.status))] : B(), z = () => ot(i == null ? void 0 : i.address), ot = (w) => {
    if (!w) return null;
    try {
      return JSON.parse(t.store.get(Vt("deposit", w)) || "null");
    } catch {
      return null;
    }
  }, it = (w, v = i == null ? void 0 : i.address) => {
    v && t.store.set(Vt("deposit", v), JSON.stringify(w));
  }, Tt = () => Dt("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), gt = () => !!(i != null && i.address) && Tt() !== i.address, Gt = () => gt() ? c && c.for === Tt() ? c.value : void 0 : o, Ft = (w) => w !== void 0 && w < tr + Uc, Ht = () => B().filter((w) => t.now() - w.created > Ov && Q.has(w.txid)), ce = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), lt = () => ce() && !(i != null && i.linked), ft = () => {
    const w = t.main();
    return !lt() && !!w && !!(i != null && i.linked) && i.linked !== w;
  }, u = (w) => Vt("return-to", w), x = (w = i == null ? void 0 : i.address) => {
    if (!w) return;
    const v = t.store.get(u(w));
    return v && Ls(v) && v !== w ? v : void 0;
  }, A = (w = i == null ? void 0 : i.address) => H && H.for === w ? H.res : null;
  function O() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const w = x();
    if (w) return { to: w, kind: "chosen" };
    const v = A();
    if (v != null && v.ok && v.funder) return { to: v.funder, kind: "funder" };
  }
  const rt = (w) => Vt("gift", w);
  function dt() {
    const w = i == null ? void 0 : i.address;
    if (!w) return null;
    if ((q == null ? void 0 : q.for) === w) return q.info;
    try {
      const v = JSON.parse(t.store.get(rt(w)) || "null");
      return v && typeof v.returnTo == "string" && typeof v.treasury == "string" ? v : null;
    } catch {
      return null;
    }
  }
  async function le() {
    var tt;
    const w = i == null ? void 0 : i.address;
    if (!w || !t.giftInfo || !((tt = e == null ? void 0 : e.gifts) != null && tt.enabled) || G) return;
    const v = (q == null ? void 0 : q.for) === w ? q : null, F = v ? v.ok ? v.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (v && t.now() - v.at < F) return;
    G = !0;
    const J = dt();
    try {
      const K = await t.giftInfo(w);
      q = { for: w, info: K, ok: !0, at: t.now() }, t.store.set(rt(w), JSON.stringify(K));
    } catch {
      q = { for: w, info: J, ok: !1, at: t.now() };
    } finally {
      G = !1;
    }
  }
  const ee = () => pe().reduce((w, v) => zi.includes(v.status) ? w + BigInt(v.amount || "0") + BigInt(v.fee || "0") : w, 0n);
  function xe() {
    if (o === void 0) return 0;
    const w = o - ee() - BigInt(ne.length) * er(Nt());
    return w > 0n ? $h(w, Nt()) : 0;
  }
  const fn = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", dn = "EMPTY — ADD STX TO PLAY";
  function hn() {
    var F;
    const w = (i == null ? void 0 : i.state) === "known" || (i == null ? void 0 : i.state) === "unlocked";
    if (!((F = dt()) != null && F.player) && !w) return null;
    const v = (J, tt) => ({ reason: J, text: tt });
    switch (we()) {
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
        return z() ? v("arriving", "YOUR PLAYS ARE ARRIVING") : v("out", gt() ? fn : dn);
      case "ready":
        return !ze() || !(i != null && i.session) || i.session.playsLeft < 1 ? v("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : E ? xe() < 1 ? v("out", gt() ? fn : dn) : null : v("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const Se = () => {
    var w;
    return !!(i != null && i.address) && gt() && !!((w = dt()) != null && w.player);
  };
  function An() {
    return Se() ? { locked: !0, known: !0 } : null;
  }
  const Ze = 3 * 6e4, ht = () => !!dt() && !!t.history && !(i != null && i.linked);
  async function Ot() {
    const w = i.address, v = dt(), { balance: F, nonce: J } = await t.chain.account(w), tt = await t.history(w, !0);
    if (!tt.ok) return null;
    const K = Pv({ self: w, balance: F, inbound: tt.inbound, outgoing: tt.outgoing, gift: { sender: v.treasury, payer: v.returnTo } });
    if (!K.ok) return null;
    const wt = Hv(K.parts, Yo);
    return { balance: F, nonce: J, parts: K.parts, steps: wt.steps, tooSmall: wt.tooSmall.length };
  }
  const Xt = () => ut ? { state: "unavailable" } : !yt || t.now() - yt.at > Ze || o !== void 0 && o !== yt.balance ? { state: "none" } : yt.plan;
  function we() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const w = t.main();
    if (!lt()) {
      if (!w) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : ft() ? "wrong-wallet" : i.state === "known" ? "locked" : !lt() && i.linked !== w ? "link" : o === void 0 ? "loading" : o > as ? "over" : o < tr + er(Nt()) ? "fund" : "ready" : "loading";
  }
  const qr = () => {
    var w, v, F, J;
    return {
      step: we(),
      busy: f,
      message: b,
      error: L,
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : hv(o, Nt()),
      playsLeft: o === void 0 ? 0 : $h(o, Nt()),
      allowance: o === void 0 ? as : Pc(o, BigInt(((w = z()) == null ? void 0 : w.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: ze(),
      entries: pe(),
      depositTxid: ((v = z()) == null ? void 0 : v.txid) ?? P,
      depositPending: !!z(),
      walletOutdated: Dt("like"),
      linkedListening: I && I === t.main() ? $.map((tt) => tt.listening) : [],
      serverLinked: !!U && p === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: Ht().length,
      armed: M,
      queued: ne.length,
      solo: lt(),
      returnTo: (F = O()) == null ? void 0 : F.to,
      returnToKind: (J = O()) == null ? void 0 : J.kind,
      funderState: (() => {
        const tt = A();
        return tt ? tt.ok ? tt.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const tt = A();
        return !!tt && tt.ok && tt.distinct > 1;
      })(),
      walletCannotSolo: lt() && Dt("standalone"),
      walletCannotMulti: Dt("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((tt) => tt !== t.main() && tt !== (i == null ? void 0 : i.linked)),
      creditedTo: lt() && (i != null && i.address) && (C == null ? void 0 : C.for) === i.address && C.main ? C.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(Vt("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (_ == null ? void 0 : _.for) === i.address && _.unused,
      gift: (() => {
        const tt = dt();
        return tt ? { player: tt.player, from: tt.from, source: tt.source, amount: tt.amount } : null;
      })(),
      giftPlays: dt() ? xe() : 0,
      giftStop: hn(),
      albumLock: An(),
      returnPlan: Xt(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: Dt("slots"),
      likeFunds: (() => {
        var wt;
        const tt = Tt();
        if (!tt || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const K = Gt();
        return { address: tt, balance: K, low: Ft(K), album: gt(), pending: !!ot(tt), txid: (wt = ot(tt)) == null ? void 0 : wt.txid, main: t.main() };
      })()
    };
  }, zt = (w, v = "") => {
    b = w, L = v, t.changed();
  };
  async function $e(w, v) {
    if (!f) {
      f = w, L = "", t.changed();
      try {
        await v();
      } catch (F) {
        const J = F instanceof Error ? F.message : String(F);
        L = /Cancelled in the listening wallet/.test(J) ? "" : J, L || (b = "Not now. Nothing was signed.", kt = !0);
      } finally {
        f = null, await Je(!0);
      }
    }
  }
  const ir = () => !!(e != null && e.enabled) && e.here && (lt() || !!t.main() && e.allowed), vn = () => ir() && !ft(), $n = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", ge = () => {
    if (ft()) throw new Error($n());
  };
  async function In() {
    if (!ir()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const Qe = (w) => {
    const v = t.main();
    return w.request("listening.status", v ? { main: v } : void 0);
  };
  async function or(w = !1) {
    i != null && i.address && (!w && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now(), await ar(w)));
  }
  async function ar(w = !1) {
    const v = Tt();
    if (!(!gt() || !v || (i == null ? void 0 : i.state) !== "unlocked") && !(!w && (c == null ? void 0 : c.for) === v && t.now() - c.at < 3e4))
      try {
        c = { for: v, value: await t.chain.balance(v), at: t.now() };
      } catch {
      }
  }
  async function Ds(w) {
    if ((I !== w || t.now() - R >= 6e4) && ($ = await t.links(w), I = w, R = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === w) return;
    const v = `${w}:${i.address}`;
    p === v && U || (U = $.find((F) => F.listening === i.address) ?? null, p = v);
  }
  async function _e() {
    const w = i == null ? void 0 : i.address;
    if (!lt() || !w || i != null && i.linked || !t.funder || W || !o || o <= 0n) return;
    const v = A(w);
    if (v != null && v.ok && v.funder) return;
    const F = v != null && v.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, S - 1), 30 * 6e4);
    if (!(H && H.for === w && t.now() - H.at < F)) {
      W = !0;
      try {
        H = { for: w, res: await t.funder(w), at: t.now() };
      } catch {
        H = { for: w, res: { ok: !1 }, at: t.now() };
      } finally {
        W = !1;
      }
      S = H.res.ok ? 0 : S + 1;
    }
  }
  async function Fs() {
    const w = i == null ? void 0 : i.address;
    if (!(!lt() || !w || i != null && i.linked || !t.mainOf || T) && !(C && C.for === w && (C.ok || t.now() - C.at < 6e4))) {
      T = !0;
      try {
        C = { for: w, main: await t.mainOf(w), ok: !0, at: t.now() };
      } catch {
        C = { for: w, main: null, ok: !1, at: t.now() };
      } finally {
        T = !1;
      }
    }
  }
  async function js() {
    const w = i == null ? void 0 : i.address;
    if (!(!w || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (_ == null ? void 0 : _.for) === w) && t.store.get(Vt("created", w)) !== "1")
      try {
        _ = { for: w, unused: await t.chain.confirmedNonce(w) === 0n };
      } catch {
      }
  }
  async function zs() {
    var tt;
    const w = i == null ? void 0 : i.address;
    if (!w) return !1;
    let v, F = !1;
    const J = /* @__PURE__ */ new Map();
    for (const K of Y())
      try {
        const wt = await t.chain.transaction(K.txid);
        if (!wt) {
          if (Q.add(K.txid), t.now() - K.created > 15 * 6e4 && !J.has(K.address) && J.set(K.address, await t.chain.confirmedNonce(K.address)), v = J.get(K.address), v !== void 0 && v > BigInt(K.nonce)) {
            Ut({ ...K, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((K.status === "unknown" || K.status === "signed") && K.raw)
            try {
              await t.chain.broadcast(K.raw, K.txid), Ut({ ...K, status: "pending" });
            } catch (bt) {
              Zs(bt) && Ut({ ...K, status: "failed", note: bt.message, raw: void 0 });
            }
          continue;
        }
        Q.delete(K.txid);
        const St = String(wt.tx_status);
        if (St === "success" && wt.canonical !== !1 && wt.is_unanchored === !1) {
          if (Ut({ ...K, status: "confirmed", confirmedAt: t.now(), actualFee: String(wt.fee_rate ?? K.fee), raw: void 0 }), F = !0, K.kind === "like" && (m = !0, K.status !== "confirmed" && typeof K.liked == "boolean"))
            try {
              (tt = t.likeConfirmed) == null || tt.call(t, K.song, K.liked);
            } catch {
            }
        } else St.startsWith("abort_") || St.startsWith("dropped_") ? Ut({ ...K, status: "failed", note: St, raw: void 0 }) : K.status !== "pending" && Ut({ ...K, status: "pending" });
      } catch {
      }
    for (const K of gt() ? [w, Tt()] : [w]) {
      const wt = ot(K);
      if (wt)
        try {
          const St = await t.chain.transaction(wt.txid), bt = String((St == null ? void 0 : St.tx_status) ?? "");
          (bt === "success" && St.is_unanchored === !1 || bt.startsWith("abort_") || bt.startsWith("dropped_") || !St && t.now() - wt.at > 2 * 36e5) && (it(null, K), a = -1 / 0, c = null, /on its way/i.test(b) && (b = ""));
        } catch {
        }
    }
    return F;
  }
  async function Je(w = !1) {
    var v;
    try {
      const F = t.main();
      if ((w || !e || r !== F || t.now() - n > 3e5) && (e = await t.config(F), n = t.now(), r = F), !e.enabled || !e.here || !lt() && (!F || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), M && cr(), t.changed();
        return;
      }
      await In(), i = await Qe(s), ft() && i.state === "unlocked" && (en(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await Qe(s)), F && e.allowed && await Ds(F), await or(w), await _e(), await Fs(), await js(), await le(), await zs() && await or(!0), await ar();
    } catch (F) {
      L = F instanceof Error ? F.message : "Pay-per-play could not refresh. Listening stays free.";
    }
    if (we() === "locked" ? Gs() : M && cr(), m) {
      m = !1;
      try {
        (v = t.likesChanged) == null || v.call(t);
      } catch {
      }
    }
    t.changed(), ne.length && !ur && Ui();
  }
  async function Rs(w) {
    const v = i == null ? void 0 : i.root;
    if (!v || i != null && i.slot || !(i != null && i.address) || Dt("slots")) return;
    const F = Number(t.store.get(Vt("slot", v)));
    if (!(!Number.isSafeInteger(F) || F < 1))
      try {
        const { balance: J } = await t.chain.account(i.address);
        if (J >= tr + er(Nt())) return;
        await w.request("listening.openSlot", { slot: F }), i = await Qe(w), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function tn(w, v) {
    var K;
    ge();
    const F = !(i != null && i.address) || ze(i.address), J = i != null && i.linked ? (K = t.nameOf) == null ? void 0 : K.call(t, i.linked) : void 0;
    await w.request("listening.unlock", { mode: "unlock", terms: F ? lr() : void 0, anyPasskey: v, ...t.main() ? { main: t.main() } : {}, ...J ? { label: J } : {} }), i = await Qe(w), F && (ze(i.address) ? await D() : await w.request("listening.stop")), await Rs(w), zt(F ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const tt = h;
    h = null, tt && t.now() - tt.at < 12e4 && setTimeout(() => void Je(!0).then(() => Hi(tt)), 0);
  }
  function Gs() {
    M || f || kt || pt >= 3 || !s || !(i != null && i.address) || (M = !0, xt = (async () => {
      try {
        await tn(s, !1), pt = 0;
      } catch (w) {
        const v = w instanceof Error ? w.message : String(w);
        /Cancelled in the listening wallet/.test(v) ? ct || (kt = !0, zt("Not now. Nothing was signed.")) : /did not answer/.test(v) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (pt++, L = v);
      } finally {
        M = !1;
        const w = ct;
        ct = null, w ? await w() : await Je(!0);
      }
    })());
  }
  async function cr(w) {
    M && (ct = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await xt), w && await w(), t.changed();
  }
  const lr = () => ({
    fee: Nt().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: as.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function D() {
    if (!(i != null && i.address)) return !1;
    if (E || (E = await t.tabLock(i.address)), !E)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function Z(w, v) {
    const F = i.address, { balance: J, nonce: tt } = v ?? await t.chain.account(F);
    o = J;
    const K = await s.request("listening.prepareReturn", {
      mode: w.mode,
      balance: J.toString(),
      nonce: tt.toString(),
      fee: Yo.toString(),
      ...w.amount !== void 0 ? { amount: w.amount.toString() } : {},
      ...w.linked ? {} : { destination: w.to }
    });
    if (K.recipient !== w.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const wt = w.mode === "amount" ? w.amount : w.mode === "all" ? J - Yo : J - as - Yo, St = tf(K.raw);
    if (Zn(St.payload.recipient).value !== w.to || String(St.payload.amount) !== K.amount || wt !== void 0 && K.amount !== wt.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const bt = {
      id: Bh(),
      address: F,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: K.recipient,
      amount: K.amount,
      fee: K.fee,
      nonce: tt.toString(),
      created: t.now(),
      status: "signed",
      raw: K.raw,
      txid: K.txid
    };
    t.validate(bt), Ut(bt);
    try {
      await t.chain.broadcast(K.raw, K.txid), Ut({ ...bt, status: "pending" });
    } catch (Ie) {
      throw Ut({ ...bt, status: "unknown", note: Ie.message }), Ie;
    }
    return K;
  }
  async function Yt(w) {
    if (B().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Dt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const v = await Ot().catch(() => null);
    if (!v)
      throw yt = null, ut = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    ut = !1, o = v.balance;
    const F = { balance: v.balance, nonce: v.nonce };
    if (w === "excess") {
      const St = Lh(v.parts) ?? x();
      if (!St) throw new Error("Choose where to send the excess first.");
      await Z({ mode: "excess", to: St, linked: !1 }, F), yt = null, zt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const J = v.steps;
    if (!J.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!yt && yt.balance === v.balance && t.now() - yt.at <= Ze && yt.steps.length === J.length && yt.steps.every((St, bt) => St.to === J[bt].to && St.mode === J[bt].mode && St.send === J[bt].send))) {
      yt = {
        at: t.now(),
        balance: v.balance,
        steps: J,
        parts: v.parts,
        plan: { state: "ready", steps: J.map((St) => ({ to: St.to, kind: St.kind, send: St.send.toString() })), kept: v.tooSmall, excess: Lh(v.parts) }
      }, zt(J.length > 1 ? `This goes back in ${J.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const K = J[0], wt = K.to ?? x();
    if (!wt) throw new Error("Choose where to send the rest first.");
    if (K.mode === "amount" && Dt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await Z({ mode: K.mode, to: wt, linked: !1, ...K.mode === "amount" ? { amount: K.send } : {} }, F), yt = null, J.length === 1 ? (un(!1), zt("Returned ✓ Paying is off.")) : zt(`Returned ✓ ${J.length - 1} more ${J.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const ye = {
    forceRefresh: () => Je(!0),
    create: () => $e("Waiting for your passkey…", async () => {
      const w = await In();
      await w.request("listening.unlock", { mode: "create", terms: lr(), ...t.main() ? { main: t.main() } : {} }), i = await Qe(w), i.address && t.store.set(Vt("created", i.address), "1"), un(!0), zt(lt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await D();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    giftSent: (w, v) => {
      !(i != null && i.address) || z() || (it({ txid: w, amount: v.toString(), at: t.now() }), a = -1 / 0, q = null, zt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (w) => {
      if (ge(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Dt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await In()).request("listening.bindSlot", { slot: w, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (w, v, F, J) => {
      it({ txid: F, amount: J.toString(), at: t.now() }, v), q = null, await ye.openAlbum(w), zt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (w) => $e("Opening…", async () => {
      if (ge(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Dt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (d || l || g) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === w) return;
      en(), await s.request("listening.openSlot", { slot: w }), i = await Qe(s), o = void 0, a = -1 / 0, yt = null, ut = !1;
      const v = i.root;
      v && w > 0 && t.store.set(Vt("slot", v), String(w)), zt(w === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (w = !1) => {
      const v = () => $e("Waiting for your passkey…", async () => tn(await In(), w));
      return M ? w ? Dt("cancel") ? (zt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : cr(async () => {
        (we() === "locked" || we() === "intro") && await v();
      }) : xt : v();
    },
    link: () => $e("Sign in your wallet…", async () => {
      ge();
      const w = t.main();
      if (!w || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const v = (await t.links(w)).find((F) => F.listening === i.address);
      if (v)
        await s.request("listening.link", { main: w, issued: v.issued, mainSignature: v.mainSignature });
      else {
        const F = { main: w, listening: i.address, issued: t.now() }, J = await t.signWithMain(w, Cv(F)), tt = await s.request("listening.link", { main: w, issued: F.issued, mainSignature: J });
        await t.saveLink({ ...F, mainSignature: J, listeningSignature: tt.listeningSignature }), R = -1 / 0;
      }
      zt("Linked ✓");
    }),
    deposit: () => $e("Approve the deposit in your wallet…", async () => {
      ge();
      const w = t.main();
      if (!w || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (z()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await or(!0);
      const v = Pc(o ?? 0n);
      if (v <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      P = await t.deposit(w, i.address, v), P && it({ txid: P, amount: v.toString(), at: t.now() }), zt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => $e("Approve the top-up in your wallet…", async () => {
      ge();
      const w = t.main(), v = Tt();
      if (!w || !v) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (ot(v)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const F = await t.chain.balance(v);
      gt() ? c = { for: v, value: F, at: t.now() } : (o = F, a = t.now());
      const J = Pc(F);
      if (J <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const tt = await t.deposit(w, v, J);
      tt && it({ txid: tt, amount: J.toString(), at: t.now() }, v), zt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    switchOn: () => $e("Confirm in the listening wallet…", async () => {
      if (!vn()) throw new Error("Connect your wallet first.");
      await D(), await s.request("listening.approveSession", lr()), un(!0), zt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => $e("Clearing…", async () => {
      for (const w of Ht())
        await t.chain.transaction(w.txid) || Ut({ ...w, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      zt("Cleared ✓");
    }),
    switchOff: () => $e("Switching off…", async () => {
      en(), await (s == null ? void 0 : s.request("listening.stop")), un(!1), zt("Paying is off. Music stays free.");
    }),
    lock: () => $e("Locking…", async () => {
      en(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, zt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (w) => {
      const v = String(w ?? "").trim();
      if (!(i != null && i.address)) return zt("", "Unlock the listening wallet first.");
      if (!Ls(v)) return zt("", "Enter a standard mainnet address (it starts with SP).");
      if (v === i.address) return zt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(u(i.address), v), zt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(u(i.address), ""), t.changed();
    },
    returnFunds: (w) => $e("Check the return in the listening wallet…", async () => {
      if (!vn()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (ht()) return Yt(w);
      const v = O();
      if (!v) throw new Error(lt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (v.kind !== "linked" && Dt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (B().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await Z({ mode: w, to: v.to, linked: v.kind === "linked" }), w === "all" && un(!1), zt(w === "all" ? v.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, ne = [], Wr = 10, Gn = 30 * 6e4;
  let ur = !1;
  const Ks = () => d || !!f || l || g, en = () => {
    ne.length && (ne.length = 0, t.changed());
  };
  async function Vs(w) {
    if (!ne.some((v) => v.id === w.id) && !pe().some((v) => v.id === w.id) && (ne.push({ ...w, at: t.now() }), ne.length > Wr && ne.shift()), Ks() || B().length) {
      const v = ne.length;
      b = `Queued ${v === 1 ? "this song" : v + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Ui();
  }
  async function Ui() {
    if (!ur) {
      ur = !0;
      try {
        for (; ne.length; ) {
          for (; ne.length && t.now() - ne[0].at > Gn; ) ne.shift();
          if (!ne.length || Ks() || await Pi(ne[0]) === "wait") return;
          ne.shift();
        }
      } finally {
        ur = !1, t.changed();
      }
    }
  }
  async function Pi(w) {
    var v;
    d = !0;
    try {
      await Je();
      const F = we();
      if (F === "loading") return "wait";
      if (F !== "ready" || !ze() || !(i != null && i.session) || i.session.playsLeft < 1 || !E) return "done";
      if (B().length) return "wait";
      he || (await t.chain.verify(), he = !0);
      const J = i.address, { balance: tt, nonce: K } = await t.chain.account(J);
      o = tt, a = t.now();
      const wt = await t.chain.owner(Hc, w.song);
      if (wt === J || wt === t.main()) return "done";
      const St = await s.request("listening.signPlay", {
        core: Hc,
        song: w.song,
        receipt: w.id,
        fee: Nt().toString(),
        nonce: K.toString(),
        balance: tt.toString()
      }), bt = {
        id: w.id,
        address: J,
        kind: "play",
        core: Hc,
        song: w.song,
        recipient: wt,
        amount: "50",
        fee: Nt().toString(),
        nonce: K.toString(),
        created: t.now(),
        status: "signed",
        raw: St.raw,
        txid: St.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(bt), Ut(bt);
      const Ie = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`;
      try {
        await t.chain.broadcast(St.raw, St.txid), Ut({ ...bt, status: "pending" }), b = `♪ Paid ${Ie}`, L = "";
      } catch (Ue) {
        Ut({ ...bt, status: Zs(Ue) ? "failed" : "unknown", note: Ue.message, ...Zs(Ue) ? { raw: void 0 } : {} }), L = Ue.message;
      }
      return i = await Qe(s), "done";
    } catch (F) {
      const J = F instanceof Error ? F.message : "payment unavailable";
      return (v = dt()) != null && v.player ? (b = "Payment is taking a moment: " + J, "wait") : (b = "This song played free: " + J, "done");
    } finally {
      d = !1, t.changed();
    }
  }
  function oc(w) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(we()) || Dt("like") ? !1 : (Hi(w), !0);
  }
  async function Hi(w) {
    const v = w.title ? `“${w.title}”` : `song #${w.song}`, F = (kn) => {
      var Xr;
      L = kn, b = "";
      try {
        (Xr = t.likeFailed) == null || Xr.call(t, w.song);
      } catch {
      }
      t.changed();
    }, J = gt(), tt = we(), K = t.main(), wt = J && (tt === "fund" || tt === "over") ? "ready" : tt, St = lt() ? Tt() : K;
    if (wt === "locked") {
      h = { ...w, at: t.now() }, zt(`Unlock to like ${v}. It sends straight after.`);
      return;
    }
    if (wt === "wrong-wallet") return F($n());
    if (wt === "link") return F("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (lt() && Dt("standalone")) return F("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (wt === "fund") return F("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (wt === "over") return F("Return the excess first: the listening wallet holds more than 1 STX.");
    if (J) {
      await ar(!0);
      const kn = Gt();
      if (Ft(kn))
        return t.changed(), F(Ch);
    }
    if (wt !== "ready" || !St) return F("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return F("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!E) return F("Pay-per-play is running in another tab. Like from that tab.");
    const bt = pe(Tt()).find((kn) => kn.kind === "like" && kn.song === w.song);
    if (bt && zi.includes(bt.status))
      return F(`Your last like for ${v} is still on its way. It can change again once it confirms.`);
    if (l) return F("One like at a time: your last one is still being sent.");
    if ((bt == null ? void 0 : bt.status) === "confirmed" && t.now() - (bt.confirmedAt ?? 0) < Dv)
      return F(`Your like for ${v} has only just confirmed. Try again in a moment.`);
    let Ie;
    g = !0;
    try {
      Ie = t.likeState ? (await t.likeState(St, w.song)).by : w.likedBy ?? [];
    } catch {
      Ie = w.likedBy;
    } finally {
      g = !1;
    }
    if (!Ie) return F(`Could not check ${v} right now. Try the heart again.`);
    const Ue = Tt(), nn = ((bt == null ? void 0 : bt.status) === "confirmed" && typeof bt.liked == "boolean" && t.now() - (bt.confirmedAt ?? bt.created) < 5 * 6e4 ? bt.liked : void 0) ?? Ie.includes(Ue);
    if (!nn && Ie.some((kn) => kn !== Ue)) return F(lt() ? `${v} was liked from another wallet of yours. Unlike it there.` : `${v} was liked from your main wallet${Ie.includes(K) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await ac({ song: w.song, liked: !nn, title: w.title, artist: w.artist });
  }
  async function ac(w) {
    var J, tt, K;
    if (l) {
      zt("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const v = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`, F = t.wait ?? ((wt) => new Promise((St) => setTimeout(St, wt)));
    try {
      zt(`${w.liked ? "Liking" : "Unliking"} ${v}…`);
      const wt = t.now() + 12e4;
      for (; d || (gt() ? pe(Tt()).some((nn) => zi.includes(nn.status)) : B().length); ) {
        if (t.now() > wt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await F(5e3), await Je(!0);
      }
      if (!gt() && we() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const St = Tt(), { balance: bt, nonce: Ie } = await t.chain.account(St);
      if (gt() ? c = { for: St, value: bt, at: t.now() } : (o = bt, a = t.now()), Ft(bt)) throw new Error(Ch);
      const Ue = await s.request("listening.signLike", {
        song: w.song,
        liked: w.liked,
        fee: Uc.toString(),
        nonce: Ie.toString(),
        balance: bt.toString()
      }), fr = {
        id: Bh(),
        address: St,
        kind: "like",
        core: 0,
        song: w.song,
        liked: w.liked,
        recipient: "",
        amount: "0",
        fee: Uc.toString(),
        nonce: Ie.toString(),
        created: t.now(),
        status: "signed",
        raw: Ue.raw,
        txid: Ue.txid,
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(fr), Ut(fr);
      try {
        await t.chain.broadcast(Ue.raw, Ue.txid), Ut({ ...fr, status: "pending" }), b = `${w.liked ? "♥ Liked" : "Unliked"} ${v}`, L = "";
        try {
          (J = t.likeSent) == null || J.call(t, w.song, w.liked);
        } catch {
        }
      } catch (nn) {
        if (Ut({ ...fr, status: Zs(nn) ? "failed" : "unknown", note: nn.message, ...Zs(nn) ? { raw: void 0 } : {} }), L = nn.message, Zs(nn)) try {
          (tt = t.likeFailed) == null || tt.call(t, w.song);
        } catch {
        }
      }
      i = await Qe(s);
    } catch (wt) {
      L = "Like not sent: " + (wt instanceof Error ? wt.message : "the listening wallet is unavailable");
      try {
        (K = t.likeFailed) == null || K.call(t, w.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), Ui();
    }
  }
  return { snapshot: qr, refresh: Je, onListened: Vs, heart: oc, toggleLike: Hi, ...ye };
}
const Sy = ["Connect", "Passkey", "Link & fund", "Listen"], Ey = ["Passkey", "Add 1 STX", "Listen"], Kl = (t) => t ? Ey : Sy;
function jv(t) {
  if (t.solo) return zv(t);
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
function zv(t) {
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
function Rv(t, e) {
  return !e || e.at >= Kl(!!t.solo).length || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const Gv = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function Kv(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !Gv(r.id)));
}
const Vv = {}, qv = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, Wv = (t) => {
  const e = Vv;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, Xv = (t) => `/hiro/${t}`, Yv = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, Zv = (t) => {
  const e = Wv(t);
  if (e)
    return [Yv(e)];
  const n = qv[t];
  return typeof window < "u" ? [`${window.location.origin}${Xv(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, Qv = {}, Th = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, Jv = "xtrata.log.enabled", t5 = "xtrata.log.level", e5 = "xtrata.log.tags", n5 = "xtrata.log.dedupe", Qo = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, r5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, s5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, i5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, o5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, a5 = () => {
  const t = Qv ?? {}, e = Qo(Jv) ?? t.VITE_LOG_ENABLED, n = Qo(t5) ?? t.VITE_LOG_LEVEL, r = Qo(e5) ?? t.VITE_LOG_TAGS, s = Qo(n5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: r5(e),
    level: s5(n) ?? "warn",
    tags: o5(r),
    dedupe: i5(s)
  };
}, c5 = (t, e, n) => !t.enabled || Th[n] < Th[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), l5 = (t, e, n, r) => {
  const s = a5();
  if (!c5(s, e, t) || f5(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, u5 = /* @__PURE__ */ new Set();
let Mh = null;
const f5 = (t, e, n, r, s) => (Mh !== t && (u5.clear(), Mh = t), !1), d5 = (t, e, n) => l5("debug", t, e, n), h5 = {}, p5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, g5 = (t) => {
  const e = h5, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : p5[t];
}, y5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, w5 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return y5.test(n) ? n : null;
}, b5 = (t) => t.replace(/\/+$/, ""), m5 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Nh = (t) => {
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
}, Qs = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, x5 = (t) => {
  var c, f;
  let e;
  try {
    e = Zn(S6(t));
  } catch {
    return null;
  }
  const n = Qs(e);
  if (!n || n.success === !1)
    return null;
  const r = Qs(n.value), s = Qs(r == null ? void 0 : r.value), i = Qs(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = Nh((c = Qs(i.name)) == null ? void 0 : c.value), a = Nh((f = Qs(i.namespace)) == null ? void 0 : f.value);
  return !o || !a ? null : w5(`${o}.${a}`);
}, S5 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${b5(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [ey(Og(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : x5(i.result);
}, E5 = async (t) => {
  const e = t.address.trim();
  if (!li(e))
    return null;
  const n = g5(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of Zv(t.network))
    try {
      return await S5({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return d5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: m5(r)
  }), null;
};
function A5(t, e, n = {}) {
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
const _h = Object.freeze({
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
function v5(t, e = "") {
  return Object.hasOwn(_h, String(t)) ? _h[String(t)] : e;
}
const Uh = Object.freeze({ 312: "Smalltalk", 315: "Entertainment" });
function $5(t, e = "") {
  return Object.hasOwn(Uh, String(t)) ? Uh[String(t)] : e;
}
const I5 = 100000n, Ph = 1000000n, k5 = 3000n, L5 = (t, e) => `${t}#gift=${e}`, C5 = 100, Oc = (t, e = xo) => t <= tr ? 0 : Number((t - tr) / er(e)), Hh = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), Ay = "xtrata.xyz/radio/gifts", B5 = "Create Xtrata radio gift links paid from the gift treasury", T5 = (t) => ({
  domain: Is({ name: Ae(Ay), version: Ae("1"), "chain-id": On(1) }),
  message: Is({
    purpose: Ae(B5),
    admin: Ae(t.admin),
    count: On(t.count),
    amount: On(BigInt(t.amount)),
    label: Ae(t.label),
    issued: On(t.issued),
    ...t.player ? { player: Ae(t.player) } : {}
  })
}), Oh = 40, M5 = "Create an Xtrata radio gift player", N5 = /^[^\u0000-\u001f\u007f<>]+$/u;
function Dh(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && N5.test(t) : !n;
}
function _5(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!Dh(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!Dh(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > Oh) throw new Error(`A player holds 1 to ${Oh} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: null };
}
const U5 = (t) => j0(q0(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), P5 = (t) => ({
  domain: Is({ name: Ae(Ay), version: Ae("1"), "chain-id": On(1) }),
  message: Is({
    purpose: Ae(M5),
    admin: Ae(t.admin),
    player: Ae(t.hash),
    issued: On(t.issued)
  })
}), Fh = (t, e = xo) => tr + BigInt(t) * er(e), jh = [300, 500, 1e3], zh = 1800, Dc = /* @__PURE__ */ new Map();
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
async function H5(t) {
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
    const a = Dc.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      Dc.set(t, { ...a, until: Date.now() + zh });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Dc.delete(t), s();
      }, zh + 50);
    }
  }, i;
}
const ai = (t, e, n, r, s) => $y(t, e, async () => await vy(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), Qr = "xtrata.radio.gift.incoming.v1", Rh = (t) => "xtrata.radio.gift.mine.v1:" + t, at = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Ur = (t, e, n = "") => {
  const r = at("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, Ri = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, Js = (t) => gn(t).replace(/\.?0+$/, "");
function O5(t) {
  let e = null;
  const n = (() => {
    try {
      const B = new URL(location.href), Y = new URLSearchParams(B.hash.slice(1)).get("gift") ?? B.searchParams.get("gift");
      return Y !== null && (B.searchParams.delete("gift"), history.replaceState(null, "", B.pathname + (B.search || ""))), Hh(Y) ? Y : null;
    } catch {
      return null;
    }
  })(), r = (() => {
    try {
      const B = JSON.parse(t.store.get(Qr) || "null");
      return Hh(B == null ? void 0 : B.code) ? B.code : null;
    } catch {
      return null;
    }
  })(), s = n ?? r;
  s && (e = { code: s }, t.store.set(Qr, JSON.stringify({ code: s, at: t.now() })), fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (B) => {
    const Y = await B.json().catch(() => ({}));
    if (!B.ok)
      throw B.status === 404 && t.store.set(Qr, null), new Error((Y == null ? void 0 : Y.error) || "Could not check your gift right now. Reload to try again.");
    const z = Y;
    e = { ...e, view: z }, ["claimed", "expired", "refunding", "refunded"].includes(z.status) && t.store.set(Qr, null), t.changed();
  }).catch((B) => {
    e = { ...e, error: B.message }, t.changed();
  }));
  const i = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, o = () => {
    e = null, t.store.set(Qr, null), t.changed();
  }, a = (B) => B.from ? t.who(B.from) : B.label ? `Xtrata Radio · ${B.label}` : "Xtrata Radio";
  let c = {};
  const f = (B) => {
    if (c.box) return c.box;
    const Y = at("div", "", "ppp-gift-check");
    c.box = Y;
    const z = () => {
      const ot = window.turnstile;
      !ot || c.rendered || (c.rendered = !0, ot.render(Y, { sitekey: B, callback: (it) => {
        c.token = it, t.changed();
      }, "expired-callback": () => {
        c.token = void 0;
      } }));
    };
    if (window.turnstile) z();
    else {
      const ot = document.createElement("script");
      ot.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", ot.async = !0, ot.onload = z, document.head.append(ot);
    }
    return Y;
  };
  let d;
  async function l(B) {
    var ot, it, Tt, gt, Gt;
    if (!e || e.claiming || !B.listening) return;
    const Y = !!((ot = e.view) != null && ot.player);
    if (Y && !B.root) return;
    e.claiming = !0, e.error = void 0, t.changed();
    const z = async (Ft) => {
      const Ht = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: c.token, ...Ft })
      });
      return { res: Ht, r: await Ht.json().catch(() => ({})) };
    };
    try {
      let Ft = 0, Ht = B.listening, ce;
      if (Y) {
        const u = Number((it = await t.json("/radio/gift/slots?root=" + encodeURIComponent(B.root))) == null ? void 0 : it.next);
        if (!Number.isSafeInteger(u) || u < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Ft = u;
        for (let x = 0; ; x++) {
          const A = await t.album.bind(Ft);
          if (Ht = A.address, ce = await z({ wallet: Ht, binding: A }), ce.res.status === 409 && /just taken/.test(((Tt = ce.r) == null ? void 0 : Tt.error) || "") && x < 5) {
            Ft += 1;
            continue;
          }
          break;
        }
      } else ce = await z({ wallet: Ht });
      const { res: lt, r: ft } = ce;
      if (lt.status === 503 && /sending another gift/.test((ft == null ? void 0 : ft.error) || "")) {
        e.waiting = !0, clearTimeout(d), d = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!lt.ok)
        throw (lt.status === 404 || lt.status === 410 || lt.status === 409 && /already had a gift|brand-new/.test((ft == null ? void 0 : ft.error) || "")) && t.store.set(Qr, null), new Error((ft == null ? void 0 : ft.error) || `Could not claim the gift (${lt.status}).`);
      e.done = !0, t.store.set(Qr, null), Y ? await t.album.arrived(Ft, Ht, ft.txid, BigInt(ft.amount)) : t.giftSent(ft.txid, BigInt(ft.amount));
    } catch (Ft) {
      e.error = Ft.message, c.token = void 0;
      try {
        (Gt = (gt = window.turnstile) == null ? void 0 : gt.reset) == null || Gt.call(gt, c.box);
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
      const Y = B.listening;
      g = { ...(g == null ? void 0 : g.wallet) === Y ? g : {}, wallet: Y, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(Y)).then((z) => {
        var ot, it;
        (g == null ? void 0 : g.wallet) === Y && (g.state = (ot = z == null ? void 0 : z.gift) == null ? void 0 : ot.state, g.problem = ((it = z == null ? void 0 : z.gift) == null ? void 0 : it.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    return g.state === "sending" && g.problem ? [at("p", `🎁 Your gift is waiting to go out (${g.problem}). It is retried automatically.`, "ppp-warn")] : [];
  }
  function m(B, Y) {
    var Gt, Ft;
    const z = Y.player, ot = BigInt(Y.amount), it = [at("p", `🎁 ${a(Y)} sent you “${z.title}”${z.subtitle ? ` by ${z.subtitle}` : ""}: ${z.tracks.length} ${z.tracks.length === 1 ? "song" : "songs"} and ${Oc(ot).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!B.root && ["fund", "ready", "over", "link"].includes(B.step)))
      return it.push(at("p", B.step === "intro" ? "Tap below: your passkey makes a listening wallet, and the album arrives in its own wallet. You can keep as many albums as you like." : B.step === "locked" ? "Unlock your listening wallet and the album arrives in its own wallet." : "Open your listening wallet and the album arrives in its own wallet.", "ppp-mute")), it;
    if (B.walletCannotAlbums)
      return it.push(at("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), it;
    const gt = (Ft = (Gt = B.gate) == null ? void 0 : Gt.gifts) == null ? void 0 : Ft.turnstileSiteKey;
    return gt && !c.token ? it.push(at("p", "One quick check and it is yours:", "ppp-mute"), f(gt)) : !e.claiming && !e.error && !e.waiting && l(B), (e.claiming || e.waiting) && it.push(at("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : "Sending your album…", "ppp-cyan")), e.error && it.push(at("p", e.error, "ppp-bad"), Ur("Try again", () => {
      e.error = void 0, l(B);
    })), it;
  }
  function b(B) {
    var ce, lt;
    const Y = h(B);
    if (!e || ["off", "elsewhere"].includes(B.step)) return Y;
    const z = e.view;
    if (e.error && !z) return [at("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!z) return [at("p", "🎁 Checking your gift…", "ppp-mute")];
    if (e.done) return Y;
    if (z.status === "claimed" || z.status === "claiming") return [at("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(z.status)) return [at("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (z.status === "pending-deposit") return [at("p", `🎁 ${a(z)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (z.player) return [...m(B, z), ...Y];
    if (!!B.listening && (!(B.createdHere || B.brandNew) || !!B.linked || !!B.creditedTo || (B.balance ?? 0n) > 0n || B.entries.length > 0))
      return [at("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), Ur("Forget this gift link here", o, "quiet")];
    const it = BigInt(z.amount), Tt = Oc(it).toLocaleString(), Gt = [at(
      "p",
      `🎁 ${a(z)} sent you ${Js(it)} STX of on-chain music: about ${Tt} paid plays.`,
      "ppp-gift"
    )], Ft = !!B.listening && (B.createdHere || B.brandNew) && !B.linked && !B.creditedTo && B.step === "fund" && (B.balance ?? 1n) === 0n && !B.depositPending && !B.entries.length, Ht = (lt = (ce = B.gate) == null ? void 0 : ce.gifts) == null ? void 0 : lt.turnstileSiteKey;
    return Ft ? (Ht && !c.token ? Gt.push(at("p", "One quick check and it is yours:", "ppp-mute"), f(Ht)) : !e.claiming && !e.error && !e.waiting && l(B), (e.claiming || e.waiting) && Gt.push(at("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : "Sending your gift…", "ppp-cyan")), e.error && Gt.push(at("p", e.error, "ppp-bad"), Ur("Try again", () => {
      e.error = void 0, l(B);
    }))) : B.step === "intro" ? Gt.push(at("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : B.listening && B.linked ? Gt.push(at("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), Ur("Forget this gift link here", o, "quiet")) : B.listening && (B.balance ?? 0n) > 0n && Gt.push(at("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), Ur("Forget this gift link here", o, "quiet")), Gt;
  }
  async function L(B, Y, z) {
    var ot;
    try {
      const it = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(B));
      if ((ot = it == null ? void 0 : it.gift) != null && ot.returnTo) return { ok: !0, funder: it.gift.returnTo, txId: it.gift.txid ?? void 0, amount: it.gift.amount, distinct: 1 };
    } catch {
      if (z) return { ok: !1 };
    }
    return Y();
  }
  const P = at("div", "", "ppp-gift-fold");
  let U = 250000n, p = "", $ = "", I = null;
  const R = (B) => {
    try {
      const Y = JSON.parse(t.store.get(Rh(B)) || "[]");
      return Array.isArray(Y) ? Y : [];
    } catch {
      return [];
    }
  }, Q = (B, Y) => t.store.set(Rh(B), JSON.stringify(Y.slice(0, 50)));
  let H = 0;
  async function W(B) {
    const Y = R(B);
    for (const z of Y)
      if (!(z.view && ["claimed", "refunded", "expired"].includes(z.view.status)))
        try {
          z.view = !z.view || z.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: z.id, ...z.txid ? { txid: z.txid } : {} }) }) : await t.json("/radio/gift?id=" + z.id), z.error = void 0;
        } catch (ot) {
          z.error = ot.message;
        }
    Q(B, Y), t.changed();
  }
  async function S(B) {
    if (p) return;
    p = "Starting your gift…", $ = "", t.changed();
    let Y = null;
    try {
      Y = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: B, amount: U.toString() }) });
      const z = R(B);
      z.unshift({ id: Y.id, code: Y.code, amount: U.toString(), at: t.now() }), Q(B, z), p = "Approve the gift in your wallet…", t.changed();
      const ot = await t.pay(B, Y.depositTo, BigInt(Y.deposit), Y.memo), it = R(B), Tt = it.find((gt) => gt.id === Y.id);
      Tt && (Tt.txid = ot, Tt.view = { status: "pending-deposit", amount: U.toString(), source: "friend", from: B, label: "", expires: 0 }), Q(B, it), $ = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", W(B);
    } catch (z) {
      $ = z.message || "Not sent.";
    } finally {
      p = "", t.changed();
    }
  }
  const C = (B) => "xtrata.radio.gift.players.v1:" + B, _ = (B) => {
    try {
      const Y = JSON.parse(t.store.get(C(B)) || "[]");
      return Array.isArray(Y) ? Y.filter((z) => z && /^[0-9a-f]{16}$/.test(z.id)) : [];
    } catch {
      return [];
    }
  };
  async function T(B, Y) {
    if (!p) {
      p = "Checking the player…", $ = "", t.changed();
      try {
        const z = Y.tracks.split(/[\s,]+/).filter(Boolean).map((Ft) => Number(Ft.replace(/^#/, ""))), ot = _5({ title: Y.title.trim(), subtitle: Y.subtitle.trim(), tracks: z, cover: null });
        p = "Sign in your wallet…", t.changed();
        const it = { admin: B, hash: U5(ot), issued: t.now() }, Tt = await t.sign(B, P5(it));
        p = "Making the player…", t.changed();
        const gt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: ot, request: it, signature: Tt }) }), Gt = _(B).filter((Ft) => Ft.id !== gt.id);
        Gt.unshift({ id: gt.id, title: gt.title, tracks: gt.tracks }), t.store.set(C(B), JSON.stringify(Gt.slice(0, 30))), $ = `${gt.existing ? "That player already exists" : "Player made"} ✓ “${gt.title}” · ${gt.tracks} songs. Pick it below for a campaign.`;
      } catch (z) {
        $ = z.message || "Not made.";
      } finally {
        p = "", t.changed();
      }
    }
  }
  async function q(B, Y, z, ot, it) {
    if (!p) {
      p = "Sign in your wallet…", $ = "", I = null, t.changed();
      try {
        const Tt = { admin: B, count: Y, amount: z.toString(), label: ot, issued: t.now(), ...it ? { player: it } : {} }, gt = await t.sign(B, T5(Tt));
        p = "Making links…", t.changed();
        const Gt = await t.json("/radio/gift/campaign", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ request: Tt, signature: gt }) });
        I = { codes: Gt.codes, amount: Gt.amount };
      } catch (Tt) {
        $ = Tt.message || "Not made.";
      } finally {
        p = "", t.changed();
      }
    }
  }
  const G = (B, Y) => L5(B || location.origin + "/radio.html", Y), yt = (B) => H5({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: B }), ut = at("input");
  ut.type = "range", ut.min = String(I5), ut.max = String(Ph), ut.step = "50000", ut.value = String(U), ut.setAttribute("aria-label", "Gift amount");
  const he = at("p", "", "ppp-gift-amount"), E = Ur("", () => {
    const B = t.main();
    B && S(B);
  }, "primary"), M = () => {
    he.textContent = kt(), E.textContent = `Gift ${Js(U)} STX`;
  };
  ut.oninput = () => {
    U = BigInt(ut.value), M();
  };
  const kt = () => `${Js(U)} STX · about ${Oc(U).toLocaleString()} paid plays · you pay ${Js(U + k5)} STX with the network fee`;
  M();
  const pt = at("input");
  pt.type = "number", pt.min = "1", pt.max = String(C5), pt.value = "10", pt.setAttribute("aria-label", "How many links");
  const ct = at("input");
  ct.type = "number", ct.min = "0.1", ct.max = "1", ct.step = "0.05", ct.value = String(Number(Fh(jh[0])) / 1e6), ct.setAttribute("aria-label", "STX per link");
  const xt = at("input");
  xt.maxLength = 60, xt.placeholder = "Title, e.g. Proof of Sound", xt.setAttribute("aria-label", "Player title");
  const Nt = at("input");
  Nt.maxLength = 80, Nt.placeholder = "Artist (optional)", Nt.setAttribute("aria-label", "Player subtitle");
  const Dt = at("textarea");
  Dt.rows = 3, Dt.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Dt.setAttribute("aria-label", "Songs");
  const Vt = at("select");
  Vt.setAttribute("aria-label", "Gift player");
  const pe = at("select");
  pe.setAttribute("aria-label", "Plays per link");
  for (const B of jh) pe.append(Ri(`${B.toLocaleString()} plays`, String(Fh(B))));
  pe.append(Ri("Max (1 STX)", String(Ph)), Ri("Custom STX", "")), pe.onchange = () => {
    pe.value && (ct.value = String(Number(pe.value) / 1e6));
  };
  const Ut = at("input");
  Ut.maxLength = 40, Ut.placeholder = "Label, e.g. Launch week", Ut.setAttribute("aria-label", "Campaign label");
  function ze(B) {
    var it, Tt, gt, Gt, Ft;
    const Y = (it = B.gate) == null ? void 0 : it.gifts;
    if (!(Y != null && Y.enabled) || ["off", "elsewhere", "unsupported"].includes(B.step)) return null;
    const z = t.main(), ot = [at("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!z)
      ot.push(at("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      E.disabled = !!p, ot.push(ut, he, E), t.now() - H > 3e4 && (H = t.now(), W(z));
      const Ht = R(z);
      if (Ht.length) {
        const ce = at("ul", "", "ppp-gift-list");
        for (const lt of Ht.slice(0, 10)) {
          const ft = (Tt = lt.view) == null ? void 0 : Tt.status, u = lt.error ? lt.error : !ft || ft === "pending-deposit" ? lt.txid ? "payment confirming…" : "waiting for your payment" : ft === "live" ? "ready to share" : ft === "claiming" || ft === "claimed" ? "claimed ✓" : ft === "refunding" ? "expired · refund on its way" : ft === "refunded" ? "expired · refunded to you" : ft, x = at("li");
          if (x.append(at("span", `${Js(BigInt(lt.amount))} STX`, "t"), at("span", u, ((gt = lt.view) == null ? void 0 : gt.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((Gt = lt.view) == null ? void 0 : Gt.status) === "live") {
            const A = G(((Ft = B.gate) == null ? void 0 : Ft.radioUrl) ?? null, lt.code);
            x.append(ai("gift-copy:" + lt.id, "Copy link", () => A, "tiny", t.changed), $y("gift-share:" + lt.id, "Share", () => yt(A), "tiny", t.changed));
          }
          ce.append(x);
        }
        ot.push(ce);
      }
      if (Y.admin) {
        const ce = Ur("Sign and make links", () => {
          const A = BigInt(Math.round(Number(ct.value) * 1e6));
          q(z, Number(pt.value), A, Ut.value.trim(), Vt.value || void 0);
        }), lt = at("div", "", "ppp-gift-admin"), ft = (A, O) => {
          const rt = at("label", A);
          return rt.append(O), rt;
        }, u = _(z), x = Vt.value;
        if (Vt.replaceChildren(Ri("No player (plain gift)", ""), ...u.map((A) => Ri(`${A.title} · ${A.tracks} songs`, A.id))), u.some((A) => A.id === x) && (Vt.value = x), lt.append(
          at("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
          xt,
          Nt,
          Dt,
          Ur("Sign and make player", () => void T(z, { title: xt.value, subtitle: Nt.value, tracks: Dt.value })),
          at("p", "Campaign links (admin) · paid from the gift treasury", "ppp-cyan"),
          ft("Player ", Vt),
          ft("Plays each ", pe),
          ft("Links ", pt),
          ft("STX each ", ct),
          Ut,
          ce
        ), I) {
          const A = I.codes.map((rt) => {
            var dt;
            return G(((dt = B.gate) == null ? void 0 : dt.radioUrl) ?? null, rt);
          }).join(`
`), O = at("textarea");
          O.readOnly = !0, O.value = A, O.rows = Math.min(8, I.codes.length), lt.append(at("p", `${I.codes.length} links, ${Js(BigInt(I.amount))} STX each. Copy them now: they are not shown again.`, "ppp-warn"), O, ai("campaign-copy", "Copy all", () => A, "tiny", t.changed));
        }
        ot.push(lt);
      }
    }
    return p && ot.push(at("p", p, "ppp-cyan")), $ && ot.push(at("p", $, /✓/.test($) ? "ppp-ok" : "ppp-warn")), P.replaceChildren(...ot), P;
  }
  return { banner: b, funder: L, renderFold: ze, liveGift: i, setAside: o, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null };
}
const D5 = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function F5(t) {
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
const j5 = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function z5(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((i) => (!e.pinnedOnly || e.pins.has(i.slot)) && (() => {
    const o = j5(i);
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
function R5(t, e = 100) {
  const n = Object.entries(t).sort((r, s) => s[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const ti = 12, G5 = 5e3, Oe = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, ei = (t, e, n = "") => {
  const r = Oe("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function K5(t) {
  let e, n = [], r = 0, s = !1, i = !1, o = -1 / 0, a = "", c = "recent", f = !1, d = ti;
  const l = Oe("div", "", "ppp-shelf-box"), g = (_) => "xtrata.radio.shelf.pins.v1:" + _, h = (_) => "xtrata.radio.shelf.recent.v1:" + _, m = (_, T) => {
    try {
      return JSON.parse(t.store.get(_) || "null") ?? T;
    } catch {
      return T;
    }
  }, b = (_) => new Set(m(g(_), []).filter((T) => Number.isSafeInteger(T))), L = (_) => {
    const T = m(h(_), {}), q = {};
    for (const [G, yt] of Object.entries(T)) Number.isSafeInteger(Number(G)) && typeof yt == "number" && (q[Number(G)] = yt);
    return q;
  };
  async function P(_) {
    if (!s) {
      s = !0, i = !1;
      try {
        const T = [];
        let q = 0, G = 0;
        for (let yt = 0; yt < G5 / 100 + 1; yt++) {
          const ut = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(_)}&after=${q}&limit=100`);
          if (T.push(...F5(ut == null ? void 0 : ut.shelf)), G = Number(ut == null ? void 0 : ut.total) || T.length, !(ut != null && ut.next) || !Number.isSafeInteger(ut.next)) break;
          q = ut.next;
        }
        _ === e && (n = T, r = G, o = t.now());
      } catch {
        i = !0;
      } finally {
        s = !1, t.changed();
      }
    }
  }
  const U = () => {
    o = -1 / 0;
  }, p = Oe("input");
  p.type = "search", p.placeholder = "Search title, artist or #", p.setAttribute("aria-label", "Search your albums"), p.oninput = () => {
    a = p.value, d = ti, t.changed();
  };
  const $ = Oe("select");
  $.setAttribute("aria-label", "Sort albums");
  for (const _ of D5) {
    const T = document.createElement("option");
    T.value = _.value, T.textContent = _.label, $.append(T);
  }
  $.onchange = () => {
    c = $.value, d = ti, t.changed();
  };
  const I = ei("", () => {
    f = !f, d = ti, t.changed();
  }, "tiny"), R = Oe("div", "", "ppp-shelf-tools");
  R.append(p, $, I);
  const Q = Oe("div"), H = Oe("div");
  function W(_) {
    const T = _.step === "off" || _.step === "elsewhere" ? void 0 : _.root;
    if (T !== e && (e = T, n = [], r = 0, o = -1 / 0, d = ti), !T || _.walletCannotAlbums) return null;
    if (!s && t.now() - o > 5 * 6e4 && P(T), !n.length)
      return i ? (H.replaceChildren(Oe("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), ei("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(H), l) : null;
    const q = b(T), G = L(T), yt = z5(n, { query: a, sort: c, pinnedOnly: f, pins: q, recents: G });
    p.value !== a && (p.value = a), $.value = c, I.textContent = f ? "★ Pinned only" : "☆ Pinned only", I.setAttribute("aria-pressed", String(f));
    const ut = [];
    if (_.slot > 0 && ut.push(ei("← My player", () => t.open(0), "quiet")), !yt.length) ut.push(Oe("p", "No album matches that.", "ppp-mute"));
    else {
      const he = Oe("ul", "", "ppp-shelf-list");
      for (const E of yt.slice(0, d)) {
        const M = Oe("li", "", E.slot === _.slot ? "now" : ""), kt = q.has(E.slot), pt = ei(kt ? "★" : "☆", () => {
          const Dt = new Set(q);
          kt ? Dt.delete(E.slot) : Dt.add(E.slot), t.store.set(g(T), JSON.stringify([...Dt])), t.changed();
        }, "tiny");
        pt.setAttribute("aria-label", kt ? `Unpin ${E.player.title}` : `Pin ${E.player.title}`);
        const ct = [E.player.subtitle, `${E.player.tracks.length} ${E.player.tracks.length === 1 ? "song" : "songs"}`, E.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), xt = E.slot === _.slot, Nt = ei(xt ? "Playing" : "Play", () => {
          t.store.set(h(T), JSON.stringify(R5({ ...G, [E.slot]: t.now() }))), t.open(E.slot);
        }, xt ? "tiny" : "tiny primary");
        Nt.disabled = xt, M.append(pt, Oe("span", E.player.title, "t"), Oe("span", " " + ct, "ppp-mute"), Nt), he.append(M);
      }
      ut.push(he), yt.length > d && ut.push(ei(`Show more (${yt.length - d} left)`, () => {
        d += ti, t.changed();
      }, "quiet"));
    }
    return i && ut.push(Oe("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), Q.replaceChildren(...ut), l.firstChild !== R && l.replaceChildren(R, Q), l;
  }
  return { render: W, invalidate: U, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const _ = L(e), T = [...n].filter((q) => q.player).sort((q, G) => (_[G.slot] ?? 0) - (_[q.slot] ?? 0) || G.slot - q.slot)[0];
    return T ? { slot: T.slot, title: T.player.title } : null;
  } };
}
const V5 = [
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
function q5(t) {
  for (const [e, n] of V5) if (n.test(t)) return e;
  return null;
}
const Iy = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), ky = (t) => /Android/.test(t);
function W5(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : Iy(e) ? "x-safari-" + n.href : ky(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const X5 = (t) => Iy(t) ? "Safari" : ky(t) ? "Chrome" : "your browser", Gh = document.getElementById("ppp");
Gh && Y5(Gh);
function Y5(t) {
  var ft;
  const e = hw(), n = (u) => t.querySelector(u), r = n(".ppp-frame");
  let s = null;
  const i = async (u, x) => {
    const A = await fetch(u, { cache: "no-store", ...x, signal: AbortSignal.timeout(15e3) }), O = await A.json().catch(() => ({}));
    if (!A.ok) throw new Error((O == null ? void 0 : O.error) || `Request failed (${A.status}).`);
    return O;
  }, o = Fv({
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
      const x = new Promise((dt, le) => {
        s.addEventListener("load", () => dt(), { once: !0 }), setTimeout(() => le(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = u + "/", r.replaceChildren(s), await x;
      const A = new sw({ walletOrigin: u, frame: s, timeoutMs: 30 * 6e4 }), O = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), rt = (dt, le) => O.has(dt) ? A.request(dt, le) : Promise.race([
        A.request(dt, le),
        new Promise((ee, xe) => setTimeout(() => xe(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await rt("listening.status"), { request: rt };
    },
    chain: {
      verify: xv,
      balance: Ev,
      account: Sv,
      owner: Av,
      broadcast: vv,
      transaction: $v,
      confirmedNonce: async (u) => {
        const x = await Rr(`/v2/accounts/${u}?proof=0`);
        if (!Number.isSafeInteger(x == null ? void 0 : x.nonce) || x.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(x.nonce);
      }
    },
    signWithMain: (u, x) => Ah({ ...x, network: "mainnet", stxAddress: u }),
    deposit: (u, x, A) => new Promise((O, rt) => bh({
      recipient: x,
      amount: A.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: u,
      network: new Fc(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (dt) => O(dt.txId || ""),
      onCancel: () => rt(new Error("Deposit cancelled. Nothing was sent.")),
      onError: rt
    })),
    validate: Iv,
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
    changed: () => Ht(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (u) => {
      var x, A;
      return a.funder(u, () => Mv(u, Rr), !!((A = (x = o.snapshot().gate) == null ? void 0 : x.gifts) != null && A.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (u) => {
      const x = await i("/radio/gift/for?wallet=" + encodeURIComponent(u)), A = x == null ? void 0 : x.gift;
      if (!A) return null;
      if (typeof A.returnTo != "string" || typeof A.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: A.returnTo, from: typeof A.from == "string" ? A.from : null, source: String(A.source ?? ""), amount: String(A.amount ?? "0"), treasury: A.treasury, state: A.state === "sending" ? "sending" : "arrived", player: A.player ?? null };
    },
    history: (u, x) => Uv(u, (A) => Rr(A), x),
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
  }), a = O5({
    json: i,
    main: () => {
      const u = e.load();
      return u.isConnected && u.network === "mainnet" ? u.address : void 0;
    },
    pay: (u, x, A, O) => new Promise((rt, dt) => bh({
      recipient: x,
      amount: A.toString(),
      memo: O,
      stxAddress: u,
      network: new Fc(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (le) => rt(le.txId || ""),
      onCancel: () => dt(new Error("Gift cancelled. Nothing was sent.")),
      onError: dt
    })),
    sign: (u, x) => Ah({ ...x, network: "mainnet", stxAddress: u }),
    giftSent: (u, x) => o.giftSent(u, x),
    album: { bind: (u) => o.bindAlbum(u), arrived: async (u, x, A, O) => {
      c.invalidate(), await o.albumArriving(u, x, A, O);
    } },
    who: (u) => T(u),
    changed: () => Ht(o.snapshot()),
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
  }), c = K5({
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
    changed: () => Ht(o.snapshot())
  });
  window.XtrataRadioLikeHandler = (u) => {
    if (!u || !Number.isSafeInteger(u.song) || u.song < 0) return !1;
    he();
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
    var le, ee, xe, fn, dn;
    const x = window.XtrataRadio;
    if (!(x != null && x.setGiftPlayer) || !(x != null && x.setGiftStop)) return;
    const A = u.step === "off" || u.step === "elsewhere" ? null : ((le = u.gift) == null ? void 0 : le.player) ?? null, O = A ? A.id + ":" + A.tracks.map((hn) => hn.id).join(",") : "";
    O !== l && (x.setGiftPlayer(A ? { id: A.id, title: A.title, subtitle: A.subtitle, tracks: A.tracks.map((hn) => hn.id) } : null), l = O);
    const rt = ((ee = u.giftStop) == null ? void 0 : ee.text) ?? null;
    rt !== g && (x.setGiftStop(rt), g = rt);
    const dt = !!A && !!((xe = u.albumLock) != null && xe.locked);
    dt !== h && ((fn = x.setGiftLock) == null || fn.call(x, dt), h = dt), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(u.step) && ((dn = x.forgetWallets) == null || dn.call(x));
  }, b = (u) => u ? u.slice(0, 6) + "…" + u.slice(-4) : "", L = (u) => (Number(u) / 1e6).toFixed(u < 1000n ? 6 : 4), P = (u) => {
    const x = Math.round((Date.now() - u) / 6e4);
    return x < 1 ? "now" : x < 60 ? `${x}m` : x < 1440 ? `${Math.round(x / 60)}h` : `${Math.round(x / 1440)}d`;
  }, U = (u) => `https://explorer.hiro.so/txid/${u}?chain=mainnet`, p = (u, x = "", A = "") => {
    const O = document.createElement(u);
    return x && (O.textContent = x), A && (O.className = A), O;
  }, $ = (u, x, A = "") => {
    const O = p("button", u, A);
    return O.type = "button", O.onclick = x, O;
  }, I = (u, x) => {
    const A = p("a", u);
    return A.href = x, A.target = "_blank", A.rel = "noopener", A;
  };
  let R = null, Q = location.hash === "#give";
  Q && history.replaceState(null, "", location.pathname + location.search);
  let H = !1;
  const W = A5((u) => E5({ address: u, network: "mainnet" }), () => Ht(o.snapshot())), S = (u) => W.get(u), C = q5(navigator.userAgent), _ = (u, x) => {
    const A = navigator.userAgent, O = X5(A), rt = `${location.origin}${location.pathname}${x ? `#gift=${x}` : ""}`, dt = [p("p", `You are in ${u}'s built-in browser, where passkeys often do not work. Open this page in ${O} to make your listening wallet${x ? " and claim your gift" : ""}.`, "ppp-warn")], le = p("div", "", "ppp-open-row"), ee = W5(rt, A);
    if (ee) {
      const xe = p("a", `Open in ${O}`, "primary ppp-open-in");
      xe.href = ee, xe.dataset.homeAction = "radio:open-in-browser", le.append(xe);
    }
    return le.append(ai("copy-page-link", "Copy link", () => rt, ee ? "" : "primary", () => Ht(o.snapshot()))), dt.push(le, p("p", `If that does not open ${O}, use ${u}'s menu (••• or ⋮) and choose "Open in ${O === "your browser" ? "browser" : O}", or paste the copied link there.`, "ppp-mute")), dt;
  }, T = (u) => S(u) ?? b(u), q = (u) => u.slice(0, 2).map(T).join(" and ") + (u.length > 2 ? ` and ${u.length - 2} more` : ""), G = /* @__PURE__ */ new Map();
  let yt = !1;
  const ut = (u) => !u || /^(?:Inscription )?#\d+$/.test(u.trim()), he = () => {
    yt || (yt = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((u) => u.ok ? u.json() : null).then((u) => {
      for (const x of Array.isArray(u == null ? void 0 : u.tracks) ? u.tracks : []) {
        const A = Number(x == null ? void 0 : x.id);
        Number.isSafeInteger(A) && G.set(A, { title: typeof x.title == "string" ? x.title : void 0, artist: typeof x.artist == "string" ? x.artist : void 0 });
      }
      Ht(o.snapshot());
    }).catch(() => {
      yt = !1;
    }));
  }, E = (u, x) => {
    const A = G.get(u), O = $5(u, [A == null ? void 0 : A.title, x == null ? void 0 : x.title].find((dt) => !ut(dt)) || ""), rt = v5(u, (A == null ? void 0 : A.artist) || (x == null ? void 0 : x.artist) || "");
    return { title: O, artist: rt };
  }, M = (u) => {
    const { title: x, artist: A } = E(u.song, u);
    return x ? `“${x}”${A ? ` — ${A}` : ""}` : `Song #${u.song}${A ? ` — ${A}` : ""}`;
  }, kt = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, pt = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function ct(u) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(u.step) ? ["", ""] : u.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : u.step === "over" ? ["OVER 1 STX", "bad"] : u.step === "locked" ? ["LOCKED", "mute"] : u.step === "intro" || u.step === "link" ? ["", ""] : u.step === "fund" ? u.depositPending ? ["ON ITS WAY", "warn"] : u.entries.length ? ["OUT OF FUNDS", "bad"] : ["ADD FUNDS", "warn"] : u.payingOn && u.session && u.session.playsLeft > 0 ? ["ON · PAYING", "ok"] : ["OFF", "mute"];
  }
  function xt(u, x, A = "", O) {
    const rt = p("dt", u), dt = p("dd", x, A);
    return O && dt.append(" ", O), [rt, dt];
  }
  const Nt = document.getElementById("ppp-top"), Dt = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Vt = () => {
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
    u.step === "locked" && !u.armed && !u.busy && o.unlock(), u.step === "ready" && !u.payingOn && !u.busy && o.switchOn(), Dt();
  };
  Nt && (Nt.onclick = Vt);
  function pe(u) {
    if (!Nt) return;
    const x = (O, rt, dt) => {
      Nt.hidden = !1, Nt.className = "ppp-top" + (rt ? " is-" + rt : ""), Nt.replaceChildren(p("span", "", "dot"), document.createTextNode(O)), Nt.title = dt;
    }, A = u.session ? Math.min(u.session.playsLeft, u.playsLeft) : 0;
    switch (u.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Nt.hidden = !0;
        return;
      case "elsewhere":
        return x("Pay-per-play radio", "quiet", "Open the pay-per-play radio");
      case "connect":
        Nt.hidden = !0;
        return;
      case "intro":
        return x("Set up pay-per-play", "", "Create your passkey listening wallet");
      case "wrong-wallet":
        return x(`Connect ${T(u.linked)}`, "warn", `This device's listening wallet belongs to ${T(u.linked)}. Connect that wallet to pay artists or like songs.`);
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
  const Ut = document.getElementById("pppNudge"), ze = document.getElementById("onair");
  (ft = Ut == null ? void 0 : Ut.querySelector("button")) == null || ft.addEventListener("click", () => Vt());
  const un = {
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
  function Y(u) {
    var dt;
    if (u.step === "loading") return;
    const x = u.session ? Math.min(u.session.playsLeft, u.playsLeft) : 0, A = u.step === "ready" && u.payingOn && x > 0, O = A ? "" : un[u.step] ?? "", rt = A ? "on" : O ? "off" : "";
    if (rt ? document.documentElement.dataset.ppp = rt : delete document.documentElement.dataset.ppp, ze && (ze.hidden = !rt, ze.querySelector(".onair-sub").textContent = A ? `Paying artists · ${x.toLocaleString()} plays left` : "Not paying"), Ut && (Ut.hidden = rt !== "off" || u.step === "fund" && u.depositPending, rt === "off")) {
      const le = Math.floor(Number(1000000n / er(BigInt(((dt = u.gate) == null ? void 0 : dt.limits.playFee) ?? "300"))));
      Ut.querySelector(".nudge-t").textContent = "⚠ " + O, Ut.querySelector(".nudge-s").textContent = `1 STX (less than $1) pays for ${le.toLocaleString()} plays, on-chain, straight to the artists.`, Ut.querySelector("button").textContent = B[u.step] ?? "Start paying";
    }
  }
  let z = "";
  function ot(u) {
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
  function Tt() {
    const u = p("p", it + " ", "ppp-mute");
    return u.append(I("Xverse", "https://www.xverse.app/download"), " · ", I("Leather", "https://leather.io/install-extension")), u;
  }
  let gt = "";
  const Gt = (u) => {
    const x = document.documentElement, A = u.solo && !u.main ? u.listening ? b(u.listening) : "new" : "", O = Kv() ? "1" : "";
    `${A}|${O}` !== gt && (gt = `${A}|${O}`, A ? x.dataset.pppSolo = A : delete x.dataset.pppSolo, O ? x.dataset.pppWalletInstalled = O : delete x.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const u of [1500, 4e3, 9e3]) setTimeout(() => Ht(o.snapshot()), u);
  function Ft(u) {
    const x = u.likeFunds;
    if (!x || !x.album || !x.low && !x.pending) return [];
    const A = p("div", "", "ppp-pick ppp-lowbox");
    if (!x.low) {
      const rt = p("p", "Top-up for your main listener wallet is on its way. ", "ppp-warn");
      return x.txid && rt.append(I("View", U(x.txid))), A.append(rt), [A];
    }
    A.append(p("p", "⚠ YOUR MAIN LISTENER WALLET IS OUT OF FUNDS", "ppp-bad ppp-lowtitle")), A.append(p("p", "It signs every like for all your albums, so they all count for you. Likes are paused until it has a little STX. 0.1 STX is hundreds of likes.")), A.append(p("p", x.address, "ppp-addr-full"));
    const O = p("div", "", "ppp-open-row");
    if (O.append(ai("copy-likes-address", "Copy address", () => x.address, "primary", () => Ht(o.snapshot()))), x.main && !u.solo) {
      const rt = as - (x.balance ?? 0n);
      rt > 0n && O.append($(`Pay ${gn(rt)} STX from my wallet`, () => void o.topUpLikes(), "primary"));
    }
    return A.append(O), A.append(p("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [A];
  }
  function Ht(u) {
    var ar, Ds, _e, Fs, js, zs, Je, Rs, tn, Gs, cr, lr;
    if (d(), m(u), Gt(u), pe(u), Y(u), t.hidden = u.step === "off", t.hidden) return;
    const [x, A] = ct(u), O = n(".ppp-state");
    O.textContent = x, O.className = "ppp-state" + (A ? " ppp-state--" + A : ""), O.hidden = !x;
    const rt = !!u.busy || u.armed, dt = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(u.step) && (rt || !["intro", "loading"].includes(u.step));
    r.hidden = !dt, r.classList.toggle("ppp-frame--rest", !rt && !H);
    const le = n(".ppp-frame-label");
    le.hidden = !0;
    const ee = jv(u) ?? R;
    R = ee;
    const xe = Rv(u, ee);
    n(".ppp-badge").hidden = !xe;
    const fn = n(".ppp-steps"), dn = n(".ppp-stage");
    fn.hidden = dn.hidden = !xe, ee && xe && (fn.replaceChildren(...Kl(u.solo).map((D, Z) => {
      const Yt = p("li", "", Z < ee.at ? "done" : Z === ee.at ? ee.blocked ? "now blocked" : "now" : "");
      return Yt.append(p("span", Z < ee.at ? "✓" : String(Z + 1), "n"), D), Z === ee.at && Yt.setAttribute("aria-current", "step"), Yt;
    })), dn.textContent = ee.caption, dn.className = "ppp-stage " + (ee.at >= Kl(u.solo).length ? "ppp-ok" : ee.blocked ? "ppp-bad" : "ppp-cyan"));
    const hn = n(".ppp-facts"), Se = [];
    u.main && ((ar = u.gate) != null && ar.here) && !u.solo && Se.push(...xt("Your wallet", T(u.main), "ppp-addr-short"));
    const An = () => {
      if (!u.listening) return;
      const D = ai("copy-listening", "Copy", () => u.listening || "", "tiny", () => Ht(o.snapshot()));
      Se.push(...xt(u.slot > 0 ? "Album wallet" : u.linked ? "My player (technical)" : "My player wallet", b(u.listening), "ppp-addr-short", D));
    };
    if (u.linked || An(), u.listening && u.step !== "intro")
      if (u.linked)
        Se.push(...xt("Credited to", `${T(u.linked)} · plays, likes and returns`, u.linked === u.main || u.solo ? "ppp-ok" : "ppp-warn")), An();
      else if (u.solo) {
        u.creditedTo && Se.push(...xt("Credited to", `${T(u.creditedTo)} · plays and likes`, "ppp-ok"));
        const D = u.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : u.returnTo ? `${T(u.returnTo)} · ${u.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : u.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Se.push(...xt("Returns go to", u.gift ? D : u.returnTo && !S(u.returnTo) ? D.replace(b(u.returnTo), u.returnTo) : D, u.returnTo && !u.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Se.push(...xt("Linked to", "not linked yet", "ppp-warn"));
    if (u.linkedListening.length && ((Ds = u.gate) != null && Ds.here)) {
      const D = u.linkedListening.map((Z) => b(Z) + (Z === u.listening ? " (this one)" : "")).join(", ");
      Se.push(...xt(u.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", D, "ppp-addr-short"));
    }
    if (u.balance !== void 0 && ["fund", "ready", "over"].includes(u.step)) {
      const D = u.balanceState === "ok" ? "ppp-ok" : u.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Se.push(...xt("Balance", `${gn(u.balance)} STX · about ${u.playsLeft.toLocaleString()} plays`, D));
    }
    const Ze = u.entries.find((D) => D.kind === "play");
    Ze && he(), Ze && Se.push(...xt("Last paid song", `${M(Ze)} → ${T(Ze.recipient)}`, kt[Ze.status] || "")), hn.replaceChildren(...Se), hn.hidden = !Se.length;
    const ht = [], Ot = [], Xt = [], we = [], qr = er(BigInt(((_e = u.gate) == null ? void 0 : _e.limits.playFee) ?? "300")), zt = `Each song you listen to for 30 seconds sends ${gn(zl)} STX to whoever holds it, plus a ${gn(qr - zl)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, $e = !!u.busy;
    switch (u.step) {
      case "elsewhere": {
        if (ht.push(p("p", "Pay artists as you listen.")), (Fs = u.gate) != null && Fs.radioUrl) {
          const Z = p("p");
          Z.append(I("Open the pay-per-play radio →", u.gate.radioUrl)), ht.push(Z);
        }
        Ot.push(p("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (u.linked) {
          const Z = [u.linked, ...u.others];
          ht.push(p("p", Z.length > 1 ? `This device has listening wallets for ${q(Z)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${T(u.linked)}. Connect that wallet to keep paying artists.`)), Ot.push(p("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          ht.push(p("p", "Connect your wallet to pay artists as you listen.")), Ot.push(p("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        ht.push(p("p", `This device's listening wallet belongs to ${T(u.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Ot.push(p("p", `You are connected as ${T(u.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), Ot.push(p("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Xt.push($("Switch wallet", () => {
          var Z;
          return (Z = document.getElementById("radio-wallet-connect")) == null ? void 0 : Z.click();
        }, "primary"));
        break;
      case "not-invited":
        ht.push(p("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        ht.push(p("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        ht.push(p("p", `Pay artists ${gn(qr)} STX a song as you listen.`)), Ot.push(p("p", zt)), Ot.push(p("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), Ot.push(p("p", u.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !u.solo && u.main && u.others.length ? (ht.push(p("p", `This device already has a listening wallet for ${q(u.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Ot.push(p("p", `Otherwise, set up a new listening wallet for ${T(u.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !u.solo && u.main && Ot.push(p("p", `This is the listening wallet for ${T(u.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), u.solo && Ot.push(p("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const D = a.liveGift();
        Xt.push($(D ? "Claim my gift · no wallet needed" : u.solo ? "Turn on pay-per-play · no wallet needed" : u.others.length && u.main ? `Set up for ${T(u.main)}` : "Turn on pay-per-play", () => void o.create(), "primary")), !D && !u.solo && u.main && u.others.length && Xt.push($("Switch wallet", () => {
          var Z;
          return (Z = document.getElementById("radio-wallet-connect")) == null ? void 0 : Z.click();
        })), !D && u.solo && Xt.push($("I have a Stacks wallet", () => {
          var Z;
          return (Z = document.getElementById("radio-wallet-connect")) == null ? void 0 : Z.click();
        })), Xt.push($("I already have a listening wallet", () => void o.unlock(!0))), D && Xt.push($("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        u.armed || (ht.push(p("p", "Locked.", "ppp-mute")), Xt.push($(u.payingOn ? "Unlock and keep paying" : "Unlock", () => void o.unlock(), "primary"))), we.push($("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        ht.push(p("p", `Link to ${T(u.main)} · free`)), Ot.push(p("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Ot.push(p("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Xt.push($(u.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        ht.push(p("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (u.depositPending || ((js = u.gift) != null && js.player ? ht.push(p("p", "Out of plays · add more to keep listening", "ppp-bad")) : u.entries.length ? ht.push(p("p", "Out of funds · top up to keep paying", "ppp-bad")) : ht.push(p("p", `Add funds · 1 STX ≈ ${Math.floor(Number(1000000n / qr)).toLocaleString()} songs`))), (zs = u.gift) != null && zs.player ? Ot.push(p("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : u.entries.length && Ot.push(p("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), u.payingOn && !u.entries.length && Ot.push(p("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), u.solo ? (Ot.push(p("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Ot.push(p("p", u.listening || "", "ppp-addr-full")), u.listening && !u.depositPending && Xt.push(ai("copy-address", "Copy my address", () => u.listening || "", "primary", () => Ht(o.snapshot())))) : Ot.push(p("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), u.depositPending && u.depositTxid) {
          const Z = p("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          Z.append(I("View", U(u.depositTxid))), ht.push(Z);
        } else u.allowance > 0n && !u.solo && Xt.push($(`Deposit ${gn(u.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        ht.push(p("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), u.solo && !u.returnTo && (ht.push(p("p", u.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), ht.push(ot(u))), (!u.solo || u.returnTo) && Xt.push($("Return excess", () => void o.returnFunds("excess"), "primary"), $("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (u.payingOn && u.session && u.session.playsLeft > 0) {
          const Z = Math.min(u.session.playsLeft, u.playsLeft);
          ht.push(p("p", `Paying as you listen · up to ${Z.toLocaleString()} plays left`, "ppp-ok")), Ot.push(p("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), Xt.push($("Switch off", () => void o.switchOff()));
        } else
          ht.push(p("p", "Paying is off. Music stays free.", "ppp-mute")), Xt.push($("Switch on paying as I listen", () => void o.switchOn(), "primary"));
        u.queued && ht.push(p("p", u.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${u.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), u.balanceState === "low" && ht.push(p("p", "Running low · top up", "ppp-warn")), u.depositPending ? ht.push(p("p", "Top-up on its way…", "ppp-warn")) : u.allowance > 0n && u.balanceState !== "ok" && !u.solo && Xt.push($(`Top up ${gn(u.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (u.solo && u.walletCannotSolo && Ot.push(p("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), u.solo && ["fund", "ready"].includes(u.step) && ((u.balance ?? 0n) > 0n && u.slot === 0 && Ot.push(ot(u)), Ot.push(Tt()), u.slot === 0 && u.step === "ready" && u.entries.some((D) => D.kind === "play" && D.status === "confirmed"))) {
      const D = p("p", "New to Stacks? ", "ppp-mute");
      D.append(I("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), ht.push(D);
    }
    if (u.walletOutdated && Ot.push(p("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), u.stuck && (ht.push(p("p", u.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${u.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Xt.push($("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(u.step) && (u.returnTo || u.gift) && (u.balance ?? 0n) > 0n && we.push($(u.linked ? "Return all to my wallet" : u.gift ? "Return what is left…" : `Return all to ${T(u.returnTo)}`, () => void o.returnFunds("all"), "quiet")), ["ready", "fund", "link", "over"].includes(u.step) && we.push($("Lock", () => void o.lock(), "quiet")), dt && !rt && we.push($(H ? "Hide listening wallet box" : "Show listening wallet box", () => {
      H = !H, Ht(o.snapshot());
    }, "quiet")), [...Xt, ...we].forEach((D) => D.disabled = $e), $e && (Xt.length = 0), u.balance !== void 0 && ["fund", "ready", "over"].includes(u.step) && !(u.step === "fund" && u.depositPending && u.balance === 0n) && !((Je = u.gift) != null && Je.player)) {
      const D = u.balanceState === "ok" ? "ppp-ok" : u.balanceState === "low" ? "ppp-warn" : "ppp-bad", Z = ht.at(0);
      u.step === "ready" && Z ? Z.append(p("span", ` · ${L(u.balance)} STX`, D)) : ht.push(p("p", `Balance ${L(u.balance)} STX`, D));
    }
    if ((Rs = u.gift) != null && Rs.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(u.step)) {
      const D = p("p", "", "ppp-gift");
      D.append(`💿 Album · ${u.gift.player.title}`), u.gift.player.subtitle && D.append(" · ", u.gift.player.subtitle);
      const Z = ["ready", "fund", "over"].includes(u.step) && u.balance !== void 0 ? p("span", u.giftPlays === 0 ? " · no plays left" : ` · ${u.giftPlays.toLocaleString()} ${u.giftPlays === 1 ? "play" : "plays"} left`, u.giftPlays === 0 ? "ppp-bad" : u.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      Z && D.append(Z);
      const Yt = (tn = ht.at(0)) == null ? void 0 : tn.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (u.step === "ready" && Yt && /STX/.test(Yt.textContent ?? "") && Yt.remove(), ht.unshift(D), u.giftPlays <= 20 && ["ready", "fund"].includes(u.step) && !u.depositPending) {
        const ye = p("p", u.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
        ye.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), ye.append(I("Xverse", "https://www.xverse.app/download"), " and ", I("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), ht.splice(1, 0, ye);
      }
    }
    if (u.gift && !u.linked && ["fund", "ready", "over"].includes(u.step) && u.returnPlan.state === "ready") {
      const D = u.returnPlan, Z = p("div", "", "ppp-pick");
      Z.append(p("p", D.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Yt = p("ul", "", "ppp-gift-list");
      D.steps.forEach((ye, ne) => {
        const Wr = ye.kind === "gift" ? "the unused gift" : ye.kind === "deposit" ? "what was added to it" : "the rest", Gn = p("li");
        Gn.append(p("span", `${ne + 1}. ${gn(BigInt(ye.send))} STX · ${Wr}`, "t"), p("span", ye.to ? ` → ${T(ye.to)}` : " → choose an address below", ye.to ? "ppp-mute" : "ppp-warn")), Yt.append(Gn);
      }), Z.append(Yt), D.kept && Z.append(p("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), D.steps.some((ye) => !ye.to) && Z.append(ot(u)), Z.append($(D.steps.length > 1 ? `Confirm part 1 of ${D.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), ht.push(Z);
    }
    ht.unshift(...a.banner(u)), ht.unshift(...Ft(u)), C && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(u.step)) && ht.unshift(..._(C, a.pendingCode())), u.solo && u.creditedTo && u.listening && !["intro", "off", "elsewhere", "loading"].includes(u.step) && ht.unshift(p("p", `This is ${T(u.creditedTo)}'s listening wallet. Plays and likes count for ${T(u.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...ht);
    const ir = document.querySelector(".ppp-switch");
    if (ir) {
      const D = c.latest(), Z = u.slot > 0, Yt = ["fund", "ready", "over"].includes(u.step) && (Z || !!D);
      if (ir.hidden = !Yt, Yt) {
        const ye = (Wr, Gn, ur, Ks) => {
          const en = $("", Ks, "ppp-tab");
          return en.setAttribute("aria-pressed", String(ur)), en.append(p("span", Wr, "tt"), p("span", Gn === void 0 ? "…" : `${L(Gn)} STX`, "ts")), en.disabled = !!u.busy, en;
        }, ne = Z ? ((cr = (Gs = u.gift) == null ? void 0 : Gs.player) == null ? void 0 : cr.title) ?? "Album" : D.title;
        ir.replaceChildren(
          ye("🎧 My player", Z ? (lr = u.likeFunds) == null ? void 0 : lr.balance : u.balance, !Z, () => {
            Z && o.openAlbum(0);
          }),
          ye("💿 " + ne, Z ? u.balance : void 0, Z, () => {
            !Z && D && o.openAlbum(D.slot);
          })
        );
      }
    }
    const vn = c.render(u), $n = document.querySelector(".ppp-shelf");
    if ($n) {
      $n.hidden = !vn;
      const D = $n.querySelector("summary");
      D && (D.textContent = c.count() > 0 ? `♪ My albums (${c.count()})` : "♪ My albums");
      const Z = $n.querySelector(".ppp-shelf-body");
      vn && Z && !Z.contains(vn) && Z.replaceChildren(vn);
    }
    const ge = a.renderFold(u);
    if (n(".ppp-gifts").hidden = !ge, ge && !n(".ppp-gift-body").contains(ge) && n(".ppp-gift-body").replaceChildren(ge), ge && Q) {
      Q = !1;
      const D = n(".ppp-gifts");
      D.open = !0, requestAnimationFrame(() => D.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...Ot), n(".ppp-actions").replaceChildren(...Xt), n(".ppp-actions2").replaceChildren(...we);
    const In = u.busy || u.message || "";
    n(".ppp-msg").textContent = In && ht.some((D) => (D.textContent ?? "").startsWith(In.replace(/[.✓\s]+$/, ""))) ? "" : In, n(".ppp-err").textContent = u.error;
    const Qe = u.entries.filter((D) => D.kind === "play");
    n(".ppp-recent").hidden = !u.entries.length, n(".ppp-recent-list").replaceChildren(...Qe.slice(0, 5).map((D) => {
      const Z = p("li"), Yt = D.status === "confirmed" ? "ok" : D.status === "failed" ? "bad" : "warn";
      return Z.append(p("span", "", "d " + Yt), p("span", M(D), "t"), p("span", P(D.created), "ppp-mute")), D.txid && Z.append(I("tx", U(D.txid))), Z;
    })), n(".ppp-wallets").hidden = !(hn.childElementCount || we.length), n(".ppp-more").hidden = !Ot.length;
    const or = n(".ppp-history");
    or.hidden = !u.entries.length, u.entries.length && he(), or.replaceChildren(p("summary", `All activity (${u.entries.length})`), ...u.entries.slice(0, 20).map((D) => {
      const Z = p("div", "", "ppp-row"), Yt = D.kind === "play" ? [p("span", M(D), "ppp-song"), p("span", ` · ${gn(BigInt(D.amount))} STX to ${T(D.recipient)}`, "ppp-mute")] : D.kind === "like" ? [p("span", `${D.liked ? "♥ Liked" : "Unliked"} ${M(D)}`, "ppp-song"), p("span", ` · for ${u.linked ? T(u.linked) : "this listening wallet"}`, "ppp-mute")] : [p("span", `Returned ${gn(BigInt(D.amount))} STX`, "ppp-song"), p("span", ` to ${T(D.recipient)}`, "ppp-mute")];
      return Z.append(
        p("span", pt[D.status] || D.status, "ppp-status " + (kt[D.status] || "")),
        ...Yt,
        p("span", ` · ${new Date(D.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), D.txid && Z.append(I("tx ↗", U(D.txid))), Z;
    }));
  }
  const ce = /* @__PURE__ */ new Map(), lt = () => {
    const u = window.XtrataRadio;
    return u != null && u.subscribe ? (u.subscribe((x) => {
      const A = x == null ? void 0 : x.nowPlaying;
      A && Number.isSafeInteger(Number(A.tokenId)) && ce.set(Number(A.tokenId), { title: A.title || void 0, artist: A.artist || void 0 });
    }), !0) : !1;
  };
  if (!lt()) {
    const u = setInterval(() => {
      lt() && clearInterval(u);
    }, 500);
    setTimeout(() => clearInterval(u), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (u) => {
    const x = u.detail;
    if (x && Number.isSafeInteger(x.song) && typeof x.id == "string" && /^[0-9a-f]{32}$/.test(x.id)) {
      he();
      const A = E(x.song, ce.get(x.song));
      o.onListened({ song: x.song, id: x.id, title: A.title || void 0, artist: A.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const Z5 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", Q5 = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, J5 = () => Q5() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, t$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, e$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Ly = class {
  constructor(t) {
    P4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && nx(t), this.callback(Ka(t));
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
    const t = J5(), e = t$(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return mt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, mt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), mt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, mt("div", { class: "flex flex-col space-y-[10px]" }, mt("div", { class: "flex items-center" }, mt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), mt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, mt("span", { class: "sr-only" }, "Close popup"), mt("img", { src: Z5 }))), r ? mt("p", null, "Select the wallet you want to connect to.") : mt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && mt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && mt("div", { class: "mt-6" }, mt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), mt("ul", { class: "space-y-3" }, this.installedProviders.map((i) => mt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, mt("div", { class: "aspect-square basis-9 overflow-hidden" }, mt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), mt("div", { class: "flex-1" }, mt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && mt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), mt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && mt("div", { class: "mt-6" }, r ? mt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : mt("div", { class: "mb-5 flex justify-between" }, mt("p", { class: "text-sm font-medium" }, "Recommended wallets"), mt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, mt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, mt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), mt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), mt("p", null, "What is a wallet? ", mt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), mt("ul", { class: "space-y-3" }, n.map((i) => mt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, mt("div", { class: "aspect-square basis-9 overflow-hidden" }, mt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), mt("div", { class: "flex-1" }, mt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && mt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && mt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
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
