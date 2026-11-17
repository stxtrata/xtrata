var Xb = Object.defineProperty;
var Yb = (e, t, n) => t in e ? Xb(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var ma = (e, t, n) => Yb(e, typeof t != "symbol" ? t + "" : t, n);
var Gn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ny(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function _l(e) {
  if (e.__esModule) return e;
  var t = e.default;
  if (typeof t == "function") {
    var n = function r() {
      return this instanceof r ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(r) {
    var o = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(n, r, o.get ? o : {
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
      typeof Gn < "u" && Gn || {}, r = {
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
      function o(b) {
        return b && DataView.prototype.isPrototypeOf(b);
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
        ], i = ArrayBuffer.isView || function(b) {
          return b && s.indexOf(Object.prototype.toString.call(b)) > -1;
        };
      function a(b) {
        if (typeof b != "string" && (b = String(b)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(b) || b === "")
          throw new TypeError('Invalid character in header field name: "' + b + '"');
        return b.toLowerCase();
      }
      function c(b) {
        return typeof b != "string" && (b = String(b)), b;
      }
      function u(b) {
        var I = {
          next: function() {
            var N = b.shift();
            return { done: N === void 0, value: N };
          }
        };
        return r.iterable && (I[Symbol.iterator] = function() {
          return I;
        }), I;
      }
      function h(b) {
        this.map = {}, b instanceof h ? b.forEach(function(I, N) {
          this.append(N, I);
        }, this) : Array.isArray(b) ? b.forEach(function(I) {
          if (I.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + I.length);
          this.append(I[0], I[1]);
        }, this) : b && Object.getOwnPropertyNames(b).forEach(function(I) {
          this.append(I, b[I]);
        }, this);
      }
      h.prototype.append = function(b, I) {
        b = a(b), I = c(I);
        var N = this.map[b];
        this.map[b] = N ? N + ", " + I : I;
      }, h.prototype.delete = function(b) {
        delete this.map[a(b)];
      }, h.prototype.get = function(b) {
        return b = a(b), this.has(b) ? this.map[b] : null;
      }, h.prototype.has = function(b) {
        return this.map.hasOwnProperty(a(b));
      }, h.prototype.set = function(b, I) {
        this.map[a(b)] = c(I);
      }, h.prototype.forEach = function(b, I) {
        for (var N in this.map)
          this.map.hasOwnProperty(N) && b.call(I, this.map[N], N, this);
      }, h.prototype.keys = function() {
        var b = [];
        return this.forEach(function(I, N) {
          b.push(N);
        }), u(b);
      }, h.prototype.values = function() {
        var b = [];
        return this.forEach(function(I) {
          b.push(I);
        }), u(b);
      }, h.prototype.entries = function() {
        var b = [];
        return this.forEach(function(I, N) {
          b.push([N, I]);
        }), u(b);
      }, r.iterable && (h.prototype[Symbol.iterator] = h.prototype.entries);
      function d(b) {
        if (!b._noBody) {
          if (b.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          b.bodyUsed = !0;
        }
      }
      function m(b) {
        return new Promise(function(I, N) {
          b.onload = function() {
            I(b.result);
          }, b.onerror = function() {
            N(b.error);
          };
        });
      }
      function w(b) {
        var I = new FileReader(), N = m(I);
        return I.readAsArrayBuffer(b), N;
      }
      function v(b) {
        var I = new FileReader(), N = m(I), P = /charset=([A-Za-z0-9_-]+)/.exec(b.type), W = P ? P[1] : "utf-8";
        return I.readAsText(b, W), N;
      }
      function x(b) {
        for (var I = new Uint8Array(b), N = new Array(I.length), P = 0; P < I.length; P++)
          N[P] = String.fromCharCode(I[P]);
        return N.join("");
      }
      function L(b) {
        if (b.slice)
          return b.slice(0);
        var I = new Uint8Array(b.byteLength);
        return I.set(new Uint8Array(b)), I.buffer;
      }
      function B() {
        return this.bodyUsed = !1, this._initBody = function(b) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = b, b ? typeof b == "string" ? this._bodyText = b : r.blob && Blob.prototype.isPrototypeOf(b) ? this._bodyBlob = b : r.formData && FormData.prototype.isPrototypeOf(b) ? this._bodyFormData = b : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) ? this._bodyText = b.toString() : r.arrayBuffer && r.blob && o(b) ? (this._bodyArrayBuffer = L(b.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(b) || i(b)) ? this._bodyArrayBuffer = L(b) : this._bodyText = b = Object.prototype.toString.call(b) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof b == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(b) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var b = d(this);
          if (b)
            return b;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var b = d(this);
            return b || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
              this._bodyArrayBuffer.buffer.slice(
                this._bodyArrayBuffer.byteOffset,
                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
              )
            ) : Promise.resolve(this._bodyArrayBuffer));
          } else {
            if (r.blob)
              return this.blob().then(w);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var b = d(this);
          if (b)
            return b;
          if (this._bodyBlob)
            return v(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(x(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(_);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var U = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function A(b) {
        var I = b.toUpperCase();
        return U.indexOf(I) > -1 ? I : b;
      }
      function T(b, I) {
        if (!(this instanceof T))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        I = I || {};
        var N = I.body;
        if (b instanceof T) {
          if (b.bodyUsed)
            throw new TypeError("Already read");
          this.url = b.url, this.credentials = b.credentials, I.headers || (this.headers = new h(b.headers)), this.method = b.method, this.mode = b.mode, this.signal = b.signal, !N && b._bodyInit != null && (N = b._bodyInit, b.bodyUsed = !0);
        } else
          this.url = String(b);
        if (this.credentials = I.credentials || this.credentials || "same-origin", (I.headers || !this.headers) && (this.headers = new h(I.headers)), this.method = A(I.method || this.method || "GET"), this.mode = I.mode || this.mode || null, this.signal = I.signal || this.signal || function() {
          if ("AbortController" in n) {
            var R = new AbortController();
            return R.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && N)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(N), (this.method === "GET" || this.method === "HEAD") && (I.cache === "no-store" || I.cache === "no-cache")) {
          var P = /([?&])_=[^&]*/;
          if (P.test(this.url))
            this.url = this.url.replace(P, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var W = /\?/;
            this.url += (W.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      T.prototype.clone = function() {
        return new T(this, { body: this._bodyInit });
      };
      function _(b) {
        var I = new FormData();
        return b.trim().split("&").forEach(function(N) {
          if (N) {
            var P = N.split("="), W = P.shift().replace(/\+/g, " "), R = P.join("=").replace(/\+/g, " ");
            I.append(decodeURIComponent(W), decodeURIComponent(R));
          }
        }), I;
      }
      function X(b) {
        var I = new h(), N = b.replace(/\r?\n[\t ]+/g, " ");
        return N.split("\r").map(function(P) {
          return P.indexOf(`
`) === 0 ? P.substr(1, P.length) : P;
        }).forEach(function(P) {
          var W = P.split(":"), R = W.shift().trim();
          if (R) {
            var le = W.join(":").trim();
            try {
              I.append(R, le);
            } catch (ue) {
              console.warn("Response " + ue.message);
            }
          }
        }), I;
      }
      B.call(T.prototype);
      function ce(b, I) {
        if (!(this instanceof ce))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (I || (I = {}), this.type = "default", this.status = I.status === void 0 ? 200 : I.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = I.statusText === void 0 ? "" : "" + I.statusText, this.headers = new h(I.headers), this.url = I.url || "", this._initBody(b);
      }
      B.call(ce.prototype), ce.prototype.clone = function() {
        return new ce(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, ce.error = function() {
        var b = new ce(null, { status: 200, statusText: "" });
        return b.ok = !1, b.status = 0, b.type = "error", b;
      };
      var ne = [301, 302, 303, 307, 308];
      ce.redirect = function(b, I) {
        if (ne.indexOf(I) === -1)
          throw new RangeError("Invalid status code");
        return new ce(null, { status: I, headers: { location: b } });
      }, t.DOMException = n.DOMException;
      try {
        new t.DOMException();
      } catch {
        t.DOMException = function(I, N) {
          this.message = I, this.name = N;
          var P = Error(I);
          this.stack = P.stack;
        }, t.DOMException.prototype = Object.create(Error.prototype), t.DOMException.prototype.constructor = t.DOMException;
      }
      function q(b, I) {
        return new Promise(function(N, P) {
          var W = new T(b, I);
          if (W.signal && W.signal.aborted)
            return P(new t.DOMException("Aborted", "AbortError"));
          var R = new XMLHttpRequest();
          function le() {
            R.abort();
          }
          R.onload = function() {
            var C = {
              statusText: R.statusText,
              headers: X(R.getAllResponseHeaders() || "")
            };
            W.url.indexOf("file://") === 0 && (R.status < 200 || R.status > 599) ? C.status = 200 : C.status = R.status, C.url = "responseURL" in R ? R.responseURL : C.headers.get("X-Request-URL");
            var F = "response" in R ? R.response : R.responseText;
            setTimeout(function() {
              N(new ce(F, C));
            }, 0);
          }, R.onerror = function() {
            setTimeout(function() {
              P(new TypeError("Network request failed"));
            }, 0);
          }, R.ontimeout = function() {
            setTimeout(function() {
              P(new TypeError("Network request timed out"));
            }, 0);
          }, R.onabort = function() {
            setTimeout(function() {
              P(new t.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function ue(C) {
            try {
              return C === "" && n.location.href ? n.location.href : C;
            } catch {
              return C;
            }
          }
          if (R.open(W.method, ue(W.url), !0), W.credentials === "include" ? R.withCredentials = !0 : W.credentials === "omit" && (R.withCredentials = !1), "responseType" in R && (r.blob ? R.responseType = "blob" : r.arrayBuffer && (R.responseType = "arraybuffer")), I && typeof I.headers == "object" && !(I.headers instanceof h || n.Headers && I.headers instanceof n.Headers)) {
            var Xe = [];
            Object.getOwnPropertyNames(I.headers).forEach(function(C) {
              Xe.push(a(C)), R.setRequestHeader(C, c(I.headers[C]));
            }), W.headers.forEach(function(C, F) {
              Xe.indexOf(F) === -1 && R.setRequestHeader(F, C);
            });
          } else
            W.headers.forEach(function(C, F) {
              R.setRequestHeader(F, C);
            });
          W.signal && (W.signal.addEventListener("abort", le), R.onreadystatechange = function() {
            R.readyState === 4 && W.signal.removeEventListener("abort", le);
          }), R.send(typeof W._bodyInit > "u" ? null : W._bodyInit);
        });
      }
      return q.polyfill = !0, n.fetch || (n.fetch = q, n.Headers = h, n.Request = T, n.Response = ce), t.Headers = h, t.Request = T, t.Response = ce, t.fetch = q, Object.defineProperty(t, "__esModule", { value: !0 }), t;
    })({});
  })(typeof self < "u" ? self : Gn);
})();
const qb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Wb(e, t) {
  const n = {};
  return Object.assign(n, qb, t), await fetch(e, n);
}
function Zb(e) {
  let t = Wb, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function Jb(...e) {
  const { fetchLib: t, middlewares: n } = Zb(e);
  return async (o, s) => {
    let i = { url: o, init: s ?? {} };
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
var Gi;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Gi || (Gi = {}));
var Ko;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Ko || (Ko = {}));
var ip;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(ip || (ip = {}));
const Qb = "https://api.mainnet.hiro.so", e1 = "https://api.testnet.hiro.so", t1 = "http://localhost:3999", n1 = ["mainnet", "testnet", "devnet", "mocknet"];
let Ki = class {
  constructor(t) {
    this.version = Ko.Mainnet, this.chainId = Gi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ko.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, o) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(o)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, o) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${o}?proof=0`, this.getMapEntryUrl = (n, r, o) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${o}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? Jb();
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
Ki.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new sd();
    case "testnet":
      return new r1();
    case "devnet":
      return new s1();
    case "mocknet":
      return new ry();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${n1.join(", ")}`);
  }
};
Ki.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : Ki.fromName(e);
let sd = class extends Ki {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Qb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ko.Mainnet, this.chainId = Gi.Mainnet;
  }
}, r1 = class extends Ki {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? e1,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ko.Testnet, this.chainId = Gi.Testnet;
  }
}, ry = class extends Ki {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? t1,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ko.Testnet, this.chainId = Gi.Testnet;
  }
};
const s1 = ry, sy = "xtrata.wallet.bridge.v1", o1 = (e) => typeof e == "object" && e !== null && e.protocol === sy, i1 = (e) => o1(e) && e.kind === "response" && typeof e.id == "string" && e.id.length > 0 && typeof e.ok == "boolean", a1 = () => {
  const e = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
};
class ba extends Error {
  constructor(t, n) {
    super(n), this.code = t, this.name = "BridgeClientError";
  }
}
const ap = 12e4;
class c1 {
  constructor(t) {
    ma(this, "pending", /* @__PURE__ */ new Map());
    ma(this, "listenTarget");
    ma(this, "closed", !1);
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
    ma(this, "onMessage", (t) => {
      if (t.origin !== this.options.walletOrigin || t.source !== this.options.frame.contentWindow || !i1(t.data)) return;
      const n = this.pending.get(t.data.id);
      if (n)
        if (this.pending.delete(t.data.id), clearTimeout(n.timer), t.data.ok)
          n.resolve(t.data.result);
        else {
          const r = t.data.error;
          n.reject(
            new ba("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = t, this.listenTarget = t.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(t, n) {
    if (this.closed)
      return Promise.reject(new ba("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new ba("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const o = a1(), s = { protocol: sy, kind: "request", id: o, method: t, params: n };
    return new Promise((i, a) => {
      const c = setTimeout(() => {
        this.pending.delete(o), a(
          new ba(
            "TIMEOUT",
            `Wallet did not answer "${t}" within ${this.options.timeoutMs ?? ap}ms.`
          )
        );
      }, this.options.timeoutMs ?? ap);
      this.pending.set(o, { resolve: i, reject: a, timer: c }), r.postMessage(s, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, t] of this.pending)
      clearTimeout(t.timer), t.reject(new ba("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const l1 = ["SP", "SM"], u1 = ["ST", "SN"], d1 = (e) => {
  const [t] = e.split(".");
  if (!t || t.length < 2)
    return null;
  const n = t.slice(0, 2).toUpperCase();
  return l1.includes(n) ? "mainnet" : u1.includes(n) ? "testnet" : null;
}, f1 = () => {
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
}, h1 = () => typeof window > "u" || !window.localStorage ? f1() : window.localStorage, bu = "xtrata.v15.1.wallet.session", cp = "mainnet", rl = { isConnected: !1 }, p1 = (e) => e.address ? d1(e.address) ?? e.network : e.network, oy = (e) => !e.isConnected || !e.address ? { ...rl } : p1(e) !== cp ? { ...rl } : {
  isConnected: !0,
  address: e.address,
  network: cp,
  ...typeof e.publicKey == "string" && /^[0-9a-f]{66}$/i.test(e.publicKey) ? { publicKey: e.publicKey } : {}
}, g1 = (e) => {
  if (!e)
    return { ...rl };
  try {
    const t = JSON.parse(e);
    return oy(t);
  } catch {
    return { ...rl };
  }
}, y1 = (e) => {
  const t = oy(e);
  return JSON.stringify(t);
}, w1 = (e) => {
  const t = h1();
  return {
    load: () => g1(t.getItem(bu)),
    save: (n) => {
      t.setItem(bu, y1(n));
    },
    clear: () => {
      t.removeItem(bu);
    }
  };
}, m1 = "https://browser.blockstack.org/auth", b1 = {
  "@type": "Person",
  "@context": "http://schema.org"
}, iy = ["store_write"], x1 = "blockstack-session", S1 = {
  logLevel: "debug"
}, ai = {
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
Object.freeze(ai);
class ca extends Error {
  constructor(t) {
    super();
    let n = t.message, r = `Error Code: ${t.code}`, o = this.stack;
    if (o)
      r += `Stack Trace:
${o}`;
    else
      try {
        throw new Error();
      } catch (s) {
        o = s.stack;
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
class v1 extends ca {
  constructor(t, n = "") {
    super({ code: ai.MISSING_PARAMETER, message: n, parameter: t }), this.name = "MissingParametersError";
  }
}
class lp extends ca {
  constructor(t = "") {
    super({ code: ai.INVALID_DID_ERROR, message: t }), this.name = "InvalidDIDError";
  }
}
class dc extends ca {
  constructor(t) {
    const n = `Failed to login: ${t}`;
    super({ code: ai.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class up extends ca {
  constructor(t = "Unable to decrypt cipher object.") {
    super({ code: ai.FAILED_DECRYPTION_ERROR, message: t }), this.message = t, this.name = "FailedDecryptionError";
  }
}
class od extends ca {
  constructor(t) {
    super({ code: ai.INVALID_STATE, message: t }), this.message = t, this.name = "InvalidStateError";
  }
}
class ay extends ca {
  constructor(t) {
    super({ code: ai.INVALID_STATE, message: t }), this.message = t, this.name = "NoSessionDataError";
  }
}
const dp = ["debug", "info", "warn", "error", "none"], id = {};
for (let e = 0; e < dp.length; e++) {
  const t = dp[e];
  id[t] = e;
}
class _i {
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
    return id[S1.logLevel] <= id[t];
  }
}
function A1() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function E1() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function xu(e, t) {
  (e === void 0 || e === "") && (e = "0.0.0"), (t === void 0 || e === "") && (t = "0.0.0");
  const n = e.split(".").map((o) => parseInt(o, 10)), r = t.split(".").map((o) => parseInt(o, 10));
  for (let o = 0; o < t.length; o++)
    if (o >= e.length && r.push(0), n[o] < r[o])
      return !1;
  return !0;
}
function k1() {
  let e = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (e += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const n = (e + Math.random() * 16) % 16 | 0;
    return e = Math.floor(e / 16), (t === "x" ? n : n & 3 | 8).toString(16);
  });
}
function $1() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function I1(e, t, n) {
  return n ? `Use of '${n}' requires \`${t}\` which is unavailable on the '${e}' object within the currently executing environment.` : `\`${t}\` is unavailable on the '${e}' object within the currently executing environment.`;
}
function pf(e, { throwIfUnavailable: t, usageDesc: n, returnEmptyObject: r } = {}) {
  let o;
  try {
    if (o = $1(), o) {
      const s = o[e];
      if (s)
        return s;
    }
  } catch (s) {
    _i.error(`Error getting object '${e}' from global scope '${o}': ${s}`);
  }
  if (t) {
    const s = I1(o, e.toString(), n);
    throw _i.error(s), new Error(s);
  }
  if (r)
    return {};
}
function xo(e, t) {
  return gf(Hn(e), t);
}
function Hn(e) {
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
  if (Qn(e, Uint8Array))
    return BigInt(`0x${Ue(e)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function L1(e) {
  return /^0x/i.test(e) ? e.slice(2) : e;
}
function fp(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function Za(e, t = 8) {
  return (typeof e == "bigint" ? e : Hn(e)).toString(16).padStart(t * 2, "0");
}
function Ul(e) {
  return parseInt(e, 16);
}
function gf(e, t = 16) {
  const n = Za(e, t);
  return mt(n);
}
function C1(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function T1(e, t) {
  return e & BigInt(1) << t;
}
function ad(e) {
  return B1(BigInt(`0x${Ue(e)}`), BigInt(e.byteLength * 8));
}
function B1(e, t) {
  return T1(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const N1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Ue(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += N1[n];
  return t;
}
function mt(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = L1(e), e = e.length % 2 ? `0${e}` : e;
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, o = e.slice(r, r + 2), s = Number.parseInt(o, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    t[n] = s;
  }
  return t;
}
function ci(e) {
  return new TextEncoder().encode(e);
}
function Ja(e) {
  return new TextDecoder().decode(e);
}
function M1(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function P1(e) {
  return String.fromCharCode.apply(null, e);
}
function _1(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function hp(e) {
  if (e.some(_1))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function os(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, o) => r + o.length, 0), n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
function an(e) {
  return os(...e.map((t) => typeof t == "number" ? hp([t]) : t instanceof Array ? hp(t) : t));
}
function Qn(e, t) {
  var n, r;
  return e instanceof t || ((r = (n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === t.name;
}
const cy = "https://api.mainnet.hiro.so", ly = "https://api.testnet.hiro.so", uy = "http://localhost:3999", U1 = "https://hub.blockstack.org", O1 = 33, Su = 32;
function H1(e) {
  if (e.length < Su * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + Su * 2), r = e.slice(2 + Su * 2);
  return {
    recoveryId: Ul(t),
    r: n,
    s: r
  };
}
function yf(e) {
  const t = typeof e == "string" ? mt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function D1(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function F1(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function j1(e, t) {
  return e[t];
}
function R1(e, t, n = 0) {
  return e[n] = t, e;
}
function z1(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function Vo(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
const G1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function K1(e, t) {
  const n = {};
  return Object.assign(n, G1, t), await fetch(e, n);
}
function V1(e) {
  let t = K1, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function X1(...e) {
  const { fetchLib: t, middlewares: n } = V1(e);
  return async (o, s) => {
    let i = { url: o, init: s ?? {} };
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
class dy {
  constructor(t = iy.slice(), n = ((a) => (a = pf("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", o = "/manifest.json", s = void 0, i = m1) {
    this.appDomain = n, this.scopes = t, this.redirectPath = r, this.manifestPath = o, this.coreNode = s, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function cd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function Y1(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function fy(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function q1(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  cd(e.outputLen), cd(e.blockLen);
}
function W1(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Z1(e, t) {
  fy(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const _o = {
  number: cd,
  bool: Y1,
  bytes: fy,
  hash: q1,
  exists: W1,
  output: Z1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const vu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Yr = (e, t) => e << 32 - t | e >>> t, J1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!J1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Q1(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function wf(e) {
  if (typeof e == "string" && (e = Q1(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let hy = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function li(e) {
  const t = (r) => e().update(wf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let py = class extends hy {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, _o.hash(t);
    const r = wf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, s = new Uint8Array(o);
    s.set(r.length > o ? t.create().update(r).digest() : r);
    for (let i = 0; i < s.length; i++)
      s[i] ^= 54;
    this.iHash.update(s), this.oHash = t.create();
    for (let i = 0; i < s.length; i++)
      s[i] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(t) {
    return _o.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    _o.exists(this), _o.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = o, t.destroyed = s, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Ol = (e, t, n) => new py(e, t).update(n).digest();
Ol.create = (e, t) => new py(e, t);
function e2(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let mf = class extends hy {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = vu(this.buffer);
  }
  update(t) {
    _o.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = wf(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = vu(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    _o.exists(this), _o.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    e2(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = vu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.length = o, t.pos = a, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
};
const t2 = (e, t, n) => e & t ^ ~e & n, n2 = (e, t, n) => e & t ^ e & n ^ t & n, r2 = new Uint32Array([
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
]), js = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Rs = new Uint32Array(64);
let gy = class extends mf {
  constructor() {
    super(64, 32, 8, !1), this.A = js[0] | 0, this.B = js[1] | 0, this.C = js[2] | 0, this.D = js[3] | 0, this.E = js[4] | 0, this.F = js[5] | 0, this.G = js[6] | 0, this.H = js[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      Rs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = Rs[d - 15], w = Rs[d - 2], v = Yr(m, 7) ^ Yr(m, 18) ^ m >>> 3, x = Yr(w, 17) ^ Yr(w, 19) ^ w >>> 10;
      Rs[d] = x + Rs[d - 7] + v + Rs[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = Yr(a, 6) ^ Yr(a, 11) ^ Yr(a, 25), w = h + m + t2(a, c, u) + r2[d] + Rs[d] | 0, x = (Yr(r, 2) ^ Yr(r, 13) ^ Yr(r, 22)) + n2(r, o, s) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = s, s = o, o = r, r = w + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, o, s, i, a, c, u, h);
  }
  roundClean() {
    Rs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, s2 = class extends gy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Vi = li(() => new gy());
li(() => new s2());
const o2 = {}, yy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: o2
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const gt = BigInt(0), Gt = BigInt(1), go = BigInt(2), Ba = BigInt(3), pp = BigInt(8), Ct = Object.freeze({
  a: gt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Gt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), gp = (e, t) => (e + t / go) / t, fc = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(e) {
    const { n: t } = Ct, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Gt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), o = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), s = n, i = BigInt("0x100000000000000000000000000000000"), a = gp(s * e, t), c = gp(-r * e, t);
    let u = ye(e - a * n - c * o, t), h = ye(-a * r - c * s, t);
    const d = u > i, m = h > i;
    if (d && (u = t - u), m && (h = t - h), u > i || h > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
    return { k1neg: d, k1: u, k2neg: m, k2: h };
  }
}, Or = 32, Xo = 32, wy = 32, sl = Or + 1, ol = 2 * Or + 1;
function yp(e) {
  const { a: t, b: n } = Ct, r = ye(e * e), o = ye(r * e);
  return ye(o + t * e + n);
}
const hc = Ct.a === gt;
class bf extends Error {
  constructor(t) {
    super(t);
  }
}
function wp(e) {
  if (!(e instanceof vt))
    throw new TypeError("JacobianPoint expected");
}
class vt {
  constructor(t, n, r) {
    this.x = t, this.y = n, this.z = r;
  }
  static fromAffine(t) {
    if (!(t instanceof at))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return t.equals(at.ZERO) ? vt.ZERO : new vt(t.x, t.y, Gt);
  }
  static toAffineBatch(t) {
    const n = u2(t.map((r) => r.z));
    return t.map((r, o) => r.toAffine(n[o]));
  }
  static normalizeZ(t) {
    return vt.toAffineBatch(t).map(vt.fromAffine);
  }
  equals(t) {
    wp(t);
    const { x: n, y: r, z: o } = this, { x: s, y: i, z: a } = t, c = ye(o * o), u = ye(a * a), h = ye(n * u), d = ye(s * c), m = ye(ye(r * a) * u), w = ye(ye(i * o) * c);
    return h === d && m === w;
  }
  negate() {
    return new vt(this.x, ye(-this.y), this.z);
  }
  double() {
    const { x: t, y: n, z: r } = this, o = ye(t * t), s = ye(n * n), i = ye(s * s), a = t + s, c = ye(go * (ye(a * a) - o - i)), u = ye(Ba * o), h = ye(u * u), d = ye(h - go * c), m = ye(u * (c - d) - pp * i), w = ye(go * n * r);
    return new vt(d, m, w);
  }
  add(t) {
    wp(t);
    const { x: n, y: r, z: o } = this, { x: s, y: i, z: a } = t;
    if (s === gt || i === gt)
      return this;
    if (n === gt || r === gt)
      return t;
    const c = ye(o * o), u = ye(a * a), h = ye(n * u), d = ye(s * c), m = ye(ye(r * a) * u), w = ye(ye(i * o) * c), v = ye(d - h), x = ye(w - m);
    if (v === gt)
      return x === gt ? this.double() : vt.ZERO;
    const L = ye(v * v), B = ye(v * L), U = ye(h * L), A = ye(x * x - B - go * U), T = ye(x * (U - A) - m * B), _ = ye(o * a * v);
    return new vt(A, T, _);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const n = vt.ZERO;
    if (typeof t == "bigint" && t === gt)
      return n;
    let r = xp(t);
    if (r === Gt)
      return this;
    if (!hc) {
      let d = n, m = this;
      for (; r > gt; )
        r & Gt && (d = d.add(m)), m = m.double(), r >>= Gt;
      return d;
    }
    let { k1neg: o, k1: s, k2neg: i, k2: a } = fc.splitScalar(r), c = n, u = n, h = this;
    for (; s > gt || a > gt; )
      s & Gt && (c = c.add(h)), a & Gt && (u = u.add(h)), h = h.double(), s >>= Gt, a >>= Gt;
    return o && (c = c.negate()), i && (u = u.negate()), u = new vt(ye(u.x * fc.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(t) {
    const n = hc ? 128 / t + 1 : 256 / t + 1, r = [];
    let o = this, s = o;
    for (let i = 0; i < n; i++) {
      s = o, r.push(s);
      for (let a = 1; a < 2 ** (t - 1); a++)
        s = s.add(o), r.push(s);
      o = s.double();
    }
    return r;
  }
  wNAF(t, n) {
    !n && this.equals(vt.BASE) && (n = at.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let o = n && ld.get(n);
    o || (o = this.precomputeWindow(r), n && r !== 1 && (o = vt.normalizeZ(o), ld.set(n, o)));
    let s = vt.ZERO, i = vt.BASE;
    const a = 1 + (hc ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), h = 2 ** r, d = BigInt(r);
    for (let m = 0; m < a; m++) {
      const w = m * c;
      let v = Number(t & u);
      t >>= d, v > c && (v -= h, t += Gt);
      const x = w, L = w + Math.abs(v) - 1, B = m % 2 !== 0, U = v < 0;
      v === 0 ? i = i.add(pc(B, o[x])) : s = s.add(pc(U, o[L]));
    }
    return { p: s, f: i };
  }
  multiply(t, n) {
    let r = xp(t), o, s;
    if (hc) {
      const { k1neg: i, k1: a, k2neg: c, k2: u } = fc.splitScalar(r);
      let { p: h, f: d } = this.wNAF(a, n), { p: m, f: w } = this.wNAF(u, n);
      h = pc(i, h), m = pc(c, m), m = new vt(ye(m.x * fc.beta), m.y, m.z), o = h.add(m), s = d.add(w);
    } else {
      const { p: i, f: a } = this.wNAF(r, n);
      o = i, s = a;
    }
    return vt.normalizeZ([o, s])[0];
  }
  toAffine(t) {
    const { x: n, y: r, z: o } = this, s = this.equals(vt.ZERO);
    t == null && (t = s ? pp : la(o));
    const i = t, a = ye(i * i), c = ye(a * i), u = ye(n * a), h = ye(r * c), d = ye(o * i);
    if (s)
      return at.ZERO;
    if (d !== Gt)
      throw new Error("invZ was invalid");
    return new at(u, h);
  }
}
vt.BASE = new vt(Ct.Gx, Ct.Gy, Gt);
vt.ZERO = new vt(gt, Gt, gt);
function pc(e, t) {
  const n = t.negate();
  return e ? n : t;
}
const ld = /* @__PURE__ */ new WeakMap();
class at {
  constructor(t, n) {
    this.x = t, this.y = n;
  }
  _setWindowSize(t) {
    this._WINDOW_SIZE = t, ld.delete(this);
  }
  hasEvenY() {
    return this.y % go === gt;
  }
  static fromCompressedHex(t) {
    const n = t.length === 32, r = gr(n ? t : t.subarray(1));
    if (!Vc(r))
      throw new Error("Point is not on curve");
    const o = yp(r);
    let s = l2(o);
    const i = (s & Gt) === Gt;
    n ? i && (s = ye(-s)) : (t[0] & 1) === 1 !== i && (s = ye(-s));
    const a = new at(r, s);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(t) {
    const n = gr(t.subarray(1, Or + 1)), r = gr(t.subarray(Or + 1, Or * 2 + 1)), o = new at(n, r);
    return o.assertValidity(), o;
  }
  static fromHex(t) {
    const n = is(t), r = n.length, o = n[0];
    if (r === Or)
      return this.fromCompressedHex(n);
    if (r === sl && (o === 2 || o === 3))
      return this.fromCompressedHex(n);
    if (r === ol && o === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${sl} compressed bytes or ${ol} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(t) {
    return at.BASE.multiply(Yo(t));
  }
  static fromSignature(t, n, r) {
    const { r: o, s } = xy(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = xf(is(t)), { n: a } = Ct, c = r === 2 || r === 3 ? o + a : o, u = la(c, a), h = ye(-i * u, a), d = ye(s * u, a), m = r & 1 ? "03" : "02", w = at.fromHex(m + yo(c)), v = at.BASE.multiplyAndAddUnsafe(w, h, d);
    if (!v)
      throw new Error("Cannot recover signature: point at infinify");
    return v.assertValidity(), v;
  }
  toRawBytes(t = !1) {
    return wo(this.toHex(t));
  }
  toHex(t = !1) {
    const n = yo(this.x);
    return t ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${yo(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const t = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Vc(n) || !Vc(r))
      throw new Error(t);
    const o = ye(r * r), s = yp(n);
    if (ye(o - s) !== gt)
      throw new Error(t);
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  negate() {
    return new at(this.x, ye(-this.y));
  }
  double() {
    return vt.fromAffine(this).double().toAffine();
  }
  add(t) {
    return vt.fromAffine(this).add(vt.fromAffine(t)).toAffine();
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiply(t) {
    return vt.fromAffine(this).multiply(t, this).toAffine();
  }
  multiplyAndAddUnsafe(t, n, r) {
    const o = vt.fromAffine(this), s = n === gt || n === Gt || this !== at.BASE ? o.multiplyUnsafe(n) : o.multiply(n), i = vt.fromAffine(t).multiplyUnsafe(r), a = s.add(i);
    return a.equals(vt.ZERO) ? void 0 : a.toAffine();
  }
}
at.BASE = new at(Ct.Gx, Ct.Gy);
at.ZERO = new at(gt, gt);
function mp(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function bp(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Xi(e)}`);
  const t = e[1], n = e.subarray(2, t + 2);
  if (!t || n.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: gr(n), left: e.subarray(t + 2) };
}
function i2(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${Xi(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: n } = bp(e.subarray(2)), { data: r, left: o } = bp(n);
  if (o.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Xi(o)}`);
  return { r: t, s: r };
}
class pr {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromCompact(t) {
    const n = t instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof t != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const o = n ? Xi(t) : t;
    if (o.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new pr(il(o.slice(0, 64)), il(o.slice(64, 128)));
  }
  static fromDER(t) {
    const n = t instanceof Uint8Array;
    if (typeof t != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s: o } = i2(n ? t : wo(t));
    return new pr(r, o);
  }
  static fromHex(t) {
    return this.fromDER(t);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!qi(t))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!qi(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const t = Ct.n >> Gt;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new pr(this.r, ye(-this.s, Ct.n)) : this;
  }
  toDERRawBytes() {
    return wo(this.toDERHex());
  }
  toDERHex() {
    const t = mp(xa(this.s)), n = mp(xa(this.r)), r = t.length / 2, o = n.length / 2, s = xa(r), i = xa(o);
    return `30${xa(o + r + 4)}02${i}${n}02${s}${t}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return wo(this.toCompactHex());
  }
  toCompactHex() {
    return yo(this.r) + yo(this.s);
  }
}
function ho(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, o) => r + o.length, 0), n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
const a2 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Xi(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += a2[e[n]];
  return t;
}
const c2 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function yo(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(gt <= e && e < c2))
    throw new Error("Expected number 0 <= n < 2^256");
  return e.toString(16).padStart(64, "0");
}
function Yi(e) {
  const t = wo(yo(e));
  if (t.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return t;
}
function xa(e) {
  const t = e.toString(16);
  return t.length & 1 ? `0${t}` : t;
}
function il(e) {
  if (typeof e != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof e);
  return BigInt(`0x${e}`);
}
function wo(e) {
  if (typeof e != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof e);
  if (e.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + e.length);
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, o = e.slice(r, r + 2), s = Number.parseInt(o, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    t[n] = s;
  }
  return t;
}
function gr(e) {
  return il(Xi(e));
}
function is(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : wo(e);
}
function xp(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && qi(e))
    return e;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function ye(e, t = Ct.P) {
  const n = e % t;
  return n >= gt ? n : t + n;
}
function xr(e, t) {
  const { P: n } = Ct;
  let r = e;
  for (; t-- > gt; )
    r *= r, r %= n;
  return r;
}
function l2(e) {
  const { P: t } = Ct, n = BigInt(6), r = BigInt(11), o = BigInt(22), s = BigInt(23), i = BigInt(44), a = BigInt(88), c = e * e * e % t, u = c * c * e % t, h = xr(u, Ba) * u % t, d = xr(h, Ba) * u % t, m = xr(d, go) * c % t, w = xr(m, r) * m % t, v = xr(w, o) * w % t, x = xr(v, i) * v % t, L = xr(x, a) * x % t, B = xr(L, i) * v % t, U = xr(B, Ba) * u % t, A = xr(U, s) * w % t, T = xr(A, n) * c % t, _ = xr(T, go);
  if (_ * _ % t !== e)
    throw new Error("Cannot find square root");
  return _;
}
function la(e, t = Ct.P) {
  if (e === gt || t <= gt)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let n = ye(e, t), r = t, o = gt, s = Gt;
  for (; n !== gt; ) {
    const a = r / n, c = r % n, u = o - s * a;
    r = n, n = c, o = s, s = u;
  }
  if (r !== Gt)
    throw new Error("invert: does not exist");
  return ye(o, t);
}
function u2(e, t = Ct.P) {
  const n = new Array(e.length), r = e.reduce((s, i, a) => i === gt ? s : (n[a] = s, ye(s * i, t)), Gt), o = la(r, t);
  return e.reduceRight((s, i, a) => i === gt ? s : (n[a] = ye(s * n[a], t), ye(s * i, t)), o), n;
}
function d2(e) {
  const t = e.length * 8 - Xo * 8, n = gr(e);
  return t > 0 ? n >> BigInt(t) : n;
}
function xf(e, t = !1) {
  const n = d2(e);
  if (t)
    return n;
  const { n: r } = Ct;
  return n >= r ? n - r : n;
}
let Ri, Na;
class my {
  constructor(t, n) {
    if (this.hashLen = t, this.qByteLen = n, typeof t != "number" || t < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(t).fill(1), this.k = new Uint8Array(t).fill(0), this.counter = 0;
  }
  hmac(...t) {
    return nn.hmacSha256(this.k, ...t);
  }
  hmacSync(...t) {
    return Na(this.k, ...t);
  }
  checkSync() {
    if (typeof Na != "function")
      throw new bf("hmacSha256Sync needs to be set");
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
    return ho(...n);
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
    return ho(...n);
  }
}
function qi(e) {
  return gt < e && e < Ct.n;
}
function Vc(e) {
  return gt < e && e < Ct.P;
}
function by(e, t, n, r = !0) {
  const { n: o } = Ct, s = xf(e, !0);
  if (!qi(s))
    return;
  const i = la(s, o), a = at.BASE.multiply(s), c = ye(a.x, o);
  if (c === gt)
    return;
  const u = ye(i * ye(t + n * c, o), o);
  if (u === gt)
    return;
  let h = new pr(c, u), d = (a.x === h.r ? 0 : 2) | Number(a.y & Gt);
  return r && h.hasHighS() && (h = h.normalizeS(), d ^= 1), { sig: h, recovery: d };
}
function Yo(e) {
  let t;
  if (typeof e == "bigint")
    t = e;
  else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    t = BigInt(e);
  else if (typeof e == "string") {
    if (e.length !== 2 * Xo)
      throw new Error("Expected 32 bytes of private key");
    t = il(e);
  } else if (e instanceof Uint8Array) {
    if (e.length !== Xo)
      throw new Error("Expected 32 bytes of private key");
    t = gr(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!qi(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function Sf(e) {
  return e instanceof at ? (e.assertValidity(), e) : at.fromHex(e);
}
function xy(e) {
  if (e instanceof pr)
    return e.assertValidity(), e;
  try {
    return pr.fromDER(e);
  } catch {
    return pr.fromCompact(e);
  }
}
function Qa(e, t = !1) {
  return at.fromPrivateKey(e).toRawBytes(t);
}
function f2(e, t, n, r = !1) {
  return at.fromSignature(e, t, n).toRawBytes(r);
}
function Sp(e) {
  const t = e instanceof Uint8Array, n = typeof e == "string", r = (t || n) && e.length;
  return t ? r === sl || r === ol : n ? r === sl * 2 || r === ol * 2 : e instanceof at;
}
function vf(e, t, n = !1) {
  if (Sp(e))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!Sp(t))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Sf(t);
  return r.assertValidity(), r.multiply(Yo(e)).toRawBytes(n);
}
function Sy(e) {
  const t = e.length > Or ? e.slice(0, Or) : e;
  return gr(t);
}
function h2(e) {
  const t = Sy(e), n = ye(t, Ct.n);
  return vy(n < gt ? t : n);
}
function vy(e) {
  return Yi(e);
}
function Ay(e, t, n) {
  if (e == null)
    throw new Error(`sign: expected valid message hash, not "${e}"`);
  const r = is(e), o = Yo(t), s = [vy(o), h2(r)];
  if (n != null) {
    n === !0 && (n = nn.randomBytes(Or));
    const c = is(n);
    if (c.length !== Or)
      throw new Error(`sign: Expected ${Or} bytes of extra data`);
    s.push(c);
  }
  const i = ho(...s), a = Sy(r);
  return { seed: i, m: a, d: o };
}
function Ey(e, t) {
  const { sig: n, recovery: r } = e, { der: o, recovered: s } = Object.assign({ canonical: !0, der: !0 }, t), i = o ? n.toDERRawBytes() : n.toCompactRawBytes();
  return s ? [i, r] : i;
}
async function p2(e, t, n = {}) {
  const { seed: r, m: o, d: s } = Ay(e, t, n.extraEntropy), i = new my(wy, Xo);
  await i.reseed(r);
  let a;
  for (; !(a = by(await i.generate(), o, s, n.canonical)); )
    await i.reseed();
  return Ey(a, n);
}
function Hl(e, t, n = {}) {
  const { seed: r, m: o, d: s } = Ay(e, t, n.extraEntropy), i = new my(wy, Xo);
  i.reseedSync(r);
  let a;
  for (; !(a = by(i.generateSync(), o, s, n.canonical)); )
    i.reseedSync();
  return Ey(a, n);
}
const g2 = { strict: !0 };
function y2(e, t, n, r = g2) {
  let o;
  try {
    o = xy(e), t = is(t);
  } catch {
    return !1;
  }
  const { r: s, s: i } = o;
  if (r.strict && o.hasHighS())
    return !1;
  const a = xf(t);
  let c;
  try {
    c = Sf(n);
  } catch {
    return !1;
  }
  const { n: u } = Ct, h = la(i, u), d = ye(a * h, u), m = ye(s * h, u), w = at.BASE.multiplyAndAddUnsafe(c, d, m);
  return w ? ye(w.x, u) === s : !1;
}
function al(e) {
  return ye(gr(e), Ct.n);
}
class Wi {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromHex(t) {
    const n = is(t);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = gr(n.subarray(0, 32)), o = gr(n.subarray(32, 64));
    return new Wi(r, o);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Vc(t) || !qi(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return yo(this.r) + yo(this.s);
  }
  toRawBytes() {
    return wo(this.toHex());
  }
}
function w2(e) {
  return at.fromPrivateKey(e).toRawX();
}
class ky {
  constructor(t, n, r = nn.randomBytes()) {
    if (t == null)
      throw new TypeError(`sign: Expected valid message, not "${t}"`);
    this.m = is(t);
    const { x: o, scalar: s } = this.getScalar(Yo(n));
    if (this.px = o, this.d = s, this.rand = is(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(t) {
    const n = at.fromPrivateKey(t), r = n.hasEvenY() ? t : Ct.n - t;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(t, n) {
    return Yi(t ^ gr(n));
  }
  finalizeNonce(t) {
    const n = ye(gr(t), Ct.n);
    if (n === gt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: o, scalar: s } = this.getScalar(n);
    return { R: r, rx: o, k: s };
  }
  finalizeSig(t, n, r, o) {
    return new Wi(t.x, ye(n + r * o, Ct.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: t, d: n, px: r, rand: o } = this, s = nn.taggedHash, i = this.initNonce(n, await s(fo.aux, o)), { R: a, rx: c, k: u } = this.finalizeNonce(await s(fo.nonce, i, r, t)), h = al(await s(fo.challenge, c, r, t)), d = this.finalizeSig(a, u, h, n);
    return await Ly(d, t, r) || this.error(), d;
  }
  calcSync() {
    const { m: t, d: n, px: r, rand: o } = this, s = nn.taggedHashSync, i = this.initNonce(n, s(fo.aux, o)), { R: a, rx: c, k: u } = this.finalizeNonce(s(fo.nonce, i, r, t)), h = al(s(fo.challenge, c, r, t)), d = this.finalizeSig(a, u, h, n);
    return Cy(d, t, r) || this.error(), d;
  }
}
async function m2(e, t, n) {
  return new ky(e, t, n).calc();
}
function b2(e, t, n) {
  return new ky(e, t, n).calcSync();
}
function $y(e, t, n) {
  const r = e instanceof Wi, o = r ? e : Wi.fromHex(e);
  return r && o.assertValidity(), {
    ...o,
    m: is(t),
    P: Sf(n)
  };
}
function Iy(e, t, n, r) {
  const o = at.BASE.multiplyAndAddUnsafe(t, Yo(n), ye(-r, Ct.n));
  return !(!o || !o.hasEvenY() || o.x !== e);
}
async function Ly(e, t, n) {
  try {
    const { r, s: o, m: s, P: i } = $y(e, t, n), a = al(await nn.taggedHash(fo.challenge, Yi(r), i.toRawX(), s));
    return Iy(r, i, o, a);
  } catch {
    return !1;
  }
}
function Cy(e, t, n) {
  try {
    const { r, s: o, m: s, P: i } = $y(e, t, n), a = al(nn.taggedHashSync(fo.challenge, Yi(r), i.toRawX(), s));
    return Iy(r, i, o, a);
  } catch (r) {
    if (r instanceof bf)
      throw r;
    return !1;
  }
}
const x2 = {
  Signature: Wi,
  getPublicKey: w2,
  sign: m2,
  verify: Ly,
  signSync: b2,
  verifySync: Cy
};
at.BASE._setWindowSize(8);
const ar = {
  node: yy,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, fo = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, gc = {}, nn = {
  bytesToHex: Xi,
  hexToBytes: wo,
  concatBytes: ho,
  mod: ye,
  invert: la,
  isValidPrivateKey(e) {
    try {
      return Yo(e), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Yi,
  _normalizePrivateKey: Yo,
  hashToPrivateKey: (e) => {
    e = is(e);
    const t = Xo + 8;
    if (e.length < t || e.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = ye(gr(e), Ct.n - Gt) + Gt;
    return Yi(n);
  },
  randomBytes: (e = 32) => {
    if (ar.web)
      return ar.web.getRandomValues(new Uint8Array(e));
    if (ar.node) {
      const { randomBytes: t } = ar.node;
      return Uint8Array.from(t(e));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => nn.hashToPrivateKey(nn.randomBytes(Xo + 8)),
  precompute(e = 8, t = at.BASE) {
    const n = t === at.BASE ? t : new at(t.x, t.y);
    return n._setWindowSize(e), n.multiply(Ba), n;
  },
  sha256: async (...e) => {
    if (ar.web) {
      const t = await ar.web.subtle.digest("SHA-256", ho(...e));
      return new Uint8Array(t);
    } else if (ar.node) {
      const { createHash: t } = ar.node, n = t("sha256");
      return e.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (ar.web) {
      const n = await ar.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = ho(...t), o = await ar.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(o);
    } else if (ar.node) {
      const { createHmac: n } = ar.node, r = n("sha256", e);
      return t.forEach((o) => r.update(o)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (e, ...t) => {
    let n = gc[e];
    if (n === void 0) {
      const r = await nn.sha256(Uint8Array.from(e, (o) => o.charCodeAt(0)));
      n = ho(r, r), gc[e] = n;
    }
    return nn.sha256(n, ...t);
  },
  taggedHashSync: (e, ...t) => {
    if (typeof Ri != "function")
      throw new bf("sha256Sync is undefined, you need to set it");
    let n = gc[e];
    if (n === void 0) {
      const r = Ri(Uint8Array.from(e, (o) => o.charCodeAt(0)));
      n = ho(r, r), gc[e] = n;
    }
    return Ri(n, ...t);
  },
  _JacobianPoint: vt
};
Object.defineProperties(nn, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Ri;
    },
    set(e) {
      Ri || (Ri = e);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Na;
    },
    set(e) {
      Na || (Na = e);
    }
  }
});
const S2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Ct,
  Point: at,
  Signature: pr,
  getPublicKey: Qa,
  getSharedSecret: vf,
  recoverPublicKey: f2,
  schnorr: x2,
  sign: p2,
  signSync: Hl,
  utils: nn,
  verify: y2
}, Symbol.toStringTag, { value: "Module" }));
var ec = {};
ec.byteLength = $2;
var v2 = ec.toByteArray = L2, A2 = ec.fromByteArray = B2, Qr = [], Ar = [], E2 = typeof Uint8Array < "u" ? Uint8Array : Array, Au = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Ii = 0, k2 = Au.length; Ii < k2; ++Ii)
  Qr[Ii] = Au[Ii], Ar[Au.charCodeAt(Ii)] = Ii;
Ar[45] = 62;
Ar[95] = 63;
function Ty(e) {
  var t = e.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = e.indexOf("=");
  n === -1 && (n = t);
  var r = n === t ? 0 : 4 - n % 4;
  return [n, r];
}
function $2(e) {
  var t = Ty(e), n = t[0], r = t[1];
  return (n + r) * 3 / 4 - r;
}
function I2(e, t, n) {
  return (t + n) * 3 / 4 - n;
}
function L2(e) {
  var t, n = Ty(e), r = n[0], o = n[1], s = new E2(I2(e, r, o)), i = 0, a = o > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    t = Ar[e.charCodeAt(c)] << 18 | Ar[e.charCodeAt(c + 1)] << 12 | Ar[e.charCodeAt(c + 2)] << 6 | Ar[e.charCodeAt(c + 3)], s[i++] = t >> 16 & 255, s[i++] = t >> 8 & 255, s[i++] = t & 255;
  return o === 2 && (t = Ar[e.charCodeAt(c)] << 2 | Ar[e.charCodeAt(c + 1)] >> 4, s[i++] = t & 255), o === 1 && (t = Ar[e.charCodeAt(c)] << 10 | Ar[e.charCodeAt(c + 1)] << 4 | Ar[e.charCodeAt(c + 2)] >> 2, s[i++] = t >> 8 & 255, s[i++] = t & 255), s;
}
function C2(e) {
  return Qr[e >> 18 & 63] + Qr[e >> 12 & 63] + Qr[e >> 6 & 63] + Qr[e & 63];
}
function T2(e, t, n) {
  for (var r, o = [], s = t; s < n; s += 3)
    r = (e[s] << 16 & 16711680) + (e[s + 1] << 8 & 65280) + (e[s + 2] & 255), o.push(C2(r));
  return o.join("");
}
function B2(e) {
  for (var t, n = e.length, r = n % 3, o = [], s = 16383, i = 0, a = n - r; i < a; i += s)
    o.push(T2(e, i, i + s > a ? a : i + s));
  return r === 1 ? (t = e[n - 1], o.push(
    Qr[t >> 2] + Qr[t << 4 & 63] + "=="
  )) : r === 2 && (t = (e[n - 2] << 8) + e[n - 1], o.push(
    Qr[t >> 10] + Qr[t >> 4 & 63] + Qr[t << 2 & 63] + "="
  )), o.join("");
}
function N2() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const M2 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function P2() {
  if (N2())
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
    throw new Error(M2);
  }
}
class _2 {
  constructor(t, n) {
    this.createCipher = t, this.createDecipher = n;
  }
  async encrypt(t, n, r, o) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const s = this.createCipher(t, n, r), i = new Uint8Array(os(s.update(o), s.final()));
    return Promise.resolve(i);
  }
  async decrypt(t, n, r, o) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const s = this.createDecipher(t, n, r), i = new Uint8Array(os(s.update(o), s.final()));
    return Promise.resolve(i);
  }
}
class U2 {
  constructor(t) {
    this.subtleCrypto = t;
  }
  async encrypt(t, n, r, o) {
    let s, i;
    if (t === "aes-128-cbc")
      s = "AES-CBC", i = 128;
    else if (t === "aes-256-cbc")
      s = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: s, length: i }, !1, ["encrypt"]), c = await this.subtleCrypto.encrypt({ name: s, iv: r }, a, o);
    return new Uint8Array(c);
  }
  async decrypt(t, n, r, o) {
    let s, i;
    if (t === "aes-128-cbc")
      s = "AES-CBC", i = 128;
    else if (t === "aes-256-cbc")
      s = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: s, length: i }, !1, ["decrypt"]), c = await this.subtleCrypto.decrypt({ name: s, iv: r }, a, o);
    return new Uint8Array(c);
  }
}
async function By() {
  const e = await P2();
  return e.name === "subtleCrypto" ? new U2(e.lib) : new _2(e.lib.createCipheriv, e.lib.createDecipheriv);
}
function O2(e) {
  if (e.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var t = new Uint8Array(256), n = 0; n < t.length; n++)
    t[n] = 255;
  for (var r = 0; r < e.length; r++) {
    var o = e.charAt(r), s = o.charCodeAt(0);
    if (t[s] !== 255)
      throw new TypeError(o + " is ambiguous");
    t[s] = r;
  }
  var i = e.length, a = e.charAt(0), c = Math.log(i) / Math.log(256), u = Math.log(256) / Math.log(i);
  function h(w) {
    if (w instanceof Uint8Array || (ArrayBuffer.isView(w) ? w = new Uint8Array(w.buffer, w.byteOffset, w.byteLength) : Array.isArray(w) && (w = Uint8Array.from(w))), !(w instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (w.length === 0)
      return "";
    for (var v = 0, x = 0, L = 0, B = w.length; L !== B && w[L] === 0; )
      L++, v++;
    for (var U = (B - L) * u + 1 >>> 0, A = new Uint8Array(U); L !== B; ) {
      for (var T = w[L], _ = 0, X = U - 1; (T !== 0 || _ < x) && X !== -1; X--, _++)
        T += 256 * A[X] >>> 0, A[X] = T % i >>> 0, T = T / i >>> 0;
      if (T !== 0)
        throw new Error("Non-zero carry");
      x = _, L++;
    }
    for (var ce = U - x; ce !== U && A[ce] === 0; )
      ce++;
    for (var ne = a.repeat(v); ce < U; ++ce)
      ne += e.charAt(A[ce]);
    return ne;
  }
  function d(w) {
    if (typeof w != "string")
      throw new TypeError("Expected String");
    if (w.length === 0)
      return new Uint8Array();
    for (var v = 0, x = 0, L = 0; w[v] === a; )
      x++, v++;
    for (var B = (w.length - v) * c + 1 >>> 0, U = new Uint8Array(B); w[v]; ) {
      var A = w.charCodeAt(v);
      if (A > 255)
        return;
      var T = t[A];
      if (T === 255)
        return;
      for (var _ = 0, X = B - 1; (T !== 0 || _ < L) && X !== -1; X--, _++)
        T += i * U[X] >>> 0, U[X] = T % 256 >>> 0, T = T / 256 >>> 0;
      if (T !== 0)
        throw new Error("Non-zero carry");
      L = _, v++;
    }
    for (var ce = B - L; ce !== B && U[ce] === 0; )
      ce++;
    for (var ne = new Uint8Array(x + (B - ce)), q = x; ce !== B; )
      ne[q++] = U[ce++];
    return ne;
  }
  function m(w) {
    var v = d(w);
    if (v)
      return v;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: h,
    decodeUnsafe: d,
    decode: m
  };
}
var Ny = O2;
const H2 = Ny, D2 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var F2 = H2(D2);
const j2 = /* @__PURE__ */ ny(F2), R2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), My = Uint8Array.from({ length: 16 }, (e, t) => t), z2 = My.map((e) => (9 * e + 5) % 16);
let Af = [My], Ef = [z2];
for (let e = 0; e < 4; e++)
  for (let t of [Af, Ef])
    t.push(t[e].map((n) => R2[n]));
const Py = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), G2 = Af.map((e, t) => e.map((n) => Py[t][n])), K2 = Ef.map((e, t) => e.map((n) => Py[t][n])), V2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), X2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), yc = (e, t) => e << t | e >>> 32 - t;
function vp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const wc = new Uint32Array(16);
let Y2 = class extends mf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: o, h4: s } = this;
    return [t, n, r, o, s];
  }
  set(t, n, r, o, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let w = 0; w < 16; w++, n += 4)
      wc[w] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, m = d;
    for (let w = 0; w < 5; w++) {
      const v = 4 - w, x = V2[w], L = X2[w], B = Af[w], U = Ef[w], A = G2[w], T = K2[w];
      for (let _ = 0; _ < 16; _++) {
        const X = yc(r + vp(w, s, a, u) + wc[B[_]] + x, A[_]) + d | 0;
        r = d, d = u, u = yc(a, 10) | 0, a = s, s = X;
      }
      for (let _ = 0; _ < 16; _++) {
        const X = yc(o + vp(v, i, c, h) + wc[U[_]] + L, T[_]) + m | 0;
        o = m, m = h, h = yc(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + m | 0, this.h3 + d + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    wc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const q2 = li(() => new Y2());
function W2(e) {
  return q2(e);
}
const mc = BigInt(2 ** 32 - 1), ud = BigInt(32);
function _y(e, t = !1) {
  return t ? { h: Number(e & mc), l: Number(e >> ud & mc) } : { h: Number(e >> ud & mc) | 0, l: Number(e & mc) | 0 };
}
function Z2(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = _y(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const J2 = (e, t) => BigInt(e >>> 0) << ud | BigInt(t >>> 0), Q2 = (e, t, n) => e >>> n, ex = (e, t, n) => e << 32 - n | t >>> n, tx = (e, t, n) => e >>> n | t << 32 - n, nx = (e, t, n) => e << 32 - n | t >>> n, rx = (e, t, n) => e << 64 - n | t >>> n - 32, sx = (e, t, n) => e >>> n - 32 | t << 64 - n, ox = (e, t) => t, ix = (e, t) => e, ax = (e, t, n) => e << n | t >>> 32 - n, cx = (e, t, n) => t << n | e >>> 32 - n, lx = (e, t, n) => t << n - 32 | e >>> 64 - n, ux = (e, t, n) => e << n - 32 | t >>> 64 - n;
function dx(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const fx = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), hx = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, px = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), gx = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, yx = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), wx = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, Je = {
  fromBig: _y,
  split: Z2,
  toBig: J2,
  shrSH: Q2,
  shrSL: ex,
  rotrSH: tx,
  rotrSL: nx,
  rotrBH: rx,
  rotrBL: sx,
  rotr32H: ox,
  rotr32L: ix,
  rotlSH: ax,
  rotlSL: cx,
  rotlBH: lx,
  rotlBL: ux,
  add: dx,
  add3L: fx,
  add3H: hx,
  add4L: px,
  add4H: gx,
  add5H: wx,
  add5L: yx
}, [mx, bx] = Je.split([
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
].map((e) => BigInt(e))), zs = new Uint32Array(80), Gs = new Uint32Array(80);
let Dl = class extends mf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: m, Gh: w, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, o, s, i, a, c, u, h, d, m, w, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c, u, h, d, m, w, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      zs[A] = t.getUint32(n), Gs[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = zs[A - 15] | 0, _ = Gs[A - 15] | 0, X = Je.rotrSH(T, _, 1) ^ Je.rotrSH(T, _, 8) ^ Je.shrSH(T, _, 7), ce = Je.rotrSL(T, _, 1) ^ Je.rotrSL(T, _, 8) ^ Je.shrSL(T, _, 7), ne = zs[A - 2] | 0, q = Gs[A - 2] | 0, b = Je.rotrSH(ne, q, 19) ^ Je.rotrBH(ne, q, 61) ^ Je.shrSH(ne, q, 6), I = Je.rotrSL(ne, q, 19) ^ Je.rotrBL(ne, q, 61) ^ Je.shrSL(ne, q, 6), N = Je.add4L(ce, I, Gs[A - 7], Gs[A - 16]), P = Je.add4H(N, X, b, zs[A - 7], zs[A - 16]);
      zs[A] = P | 0, Gs[A] = N | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: m, Fh: w, Fl: v, Gh: x, Gl: L, Hh: B, Hl: U } = this;
    for (let A = 0; A < 80; A++) {
      const T = Je.rotrSH(d, m, 14) ^ Je.rotrSH(d, m, 18) ^ Je.rotrBH(d, m, 41), _ = Je.rotrSL(d, m, 14) ^ Je.rotrSL(d, m, 18) ^ Je.rotrBL(d, m, 41), X = d & w ^ ~d & x, ce = m & v ^ ~m & L, ne = Je.add5L(U, _, ce, bx[A], Gs[A]), q = Je.add5H(ne, B, T, X, mx[A], zs[A]), b = ne | 0, I = Je.rotrSH(r, o, 28) ^ Je.rotrBH(r, o, 34) ^ Je.rotrBH(r, o, 39), N = Je.rotrSL(r, o, 28) ^ Je.rotrBL(r, o, 34) ^ Je.rotrBL(r, o, 39), P = r & s ^ r & a ^ s & a, W = o & i ^ o & c ^ i & c;
      B = x | 0, U = L | 0, x = w | 0, L = v | 0, w = d | 0, v = m | 0, { h: d, l: m } = Je.add(u | 0, h | 0, q | 0, b | 0), u = a | 0, h = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const R = Je.add3L(b, N, W);
      r = Je.add3H(R, q, I, P), o = R | 0;
    }
    ({ h: r, l: o } = Je.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = Je.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = Je.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Je.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: m } = Je.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: w, l: v } = Je.add(this.Fh | 0, this.Fl | 0, w | 0, v | 0), { h: x, l: L } = Je.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: B, l: U } = Je.add(this.Hh | 0, this.Hl | 0, B | 0, U | 0), this.set(r, o, s, i, a, c, u, h, d, m, w, v, x, L, B, U);
  }
  roundClean() {
    zs.fill(0), Gs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, xx = class extends Dl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Sx = class extends Dl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, vx = class extends Dl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Ax = li(() => new Dl());
li(() => new xx());
li(() => new Sx());
li(() => new vx());
function Uy(e) {
  return Vi(e);
}
function Ex(e) {
  return Ax(e);
}
const kx = 0;
nn.hmacSha256Sync = (e, ...t) => {
  const n = Ol.create(Vi, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function $x() {
  return Ue(nn.randomPrivateKey());
}
function Ix(e) {
  const t = Vi(Vi(e));
  return j2.encode(os(e, t).slice(0, e.length + 4));
}
function Lx(e, t) {
  return Ix(os(new Uint8Array([e]), t.slice(0, 20)));
}
function Oy(e, t = kx) {
  const n = typeof e == "string" ? mt(e) : e, r = W2(Uy(n));
  return Lx(t, r);
}
function Hy(e) {
  const t = yf(e);
  return Ue(Qa(t.slice(0, 32), !0));
}
nn.hmacSha256Sync = (e, ...t) => {
  const n = Ol.create(Vi, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
var cl;
(function(e) {
  e.InvalidFormat = "InvalidFormat", e.IsNotPoint = "IsNotPoint";
})(cl || (cl = {}));
async function Cx(e, t, n) {
  return await (await By()).encrypt("aes-256-cbc", t, e, n);
}
async function Tx(e, t, n) {
  return await (await By()).decrypt("aes-256-cbc", t, e, n);
}
function Dy(e, t) {
  return Ol(Vi, e, t);
}
function Bx(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
function Fy(e) {
  const t = Ex(e);
  return {
    encryptionKey: t.slice(0, 32),
    hmacKey: t.slice(32)
  };
}
function Nx(e) {
  return e.match(/^[0-9a-f]+$/i) !== null;
}
function Mx(e) {
  const t = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: cl.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: cl.IsNotPoint
  };
  if (e.length !== 66 && e.length !== 130)
    return t;
  const r = e.slice(0, 2);
  if (e.length === 130 && r !== "04" || e.length === 66 && r !== "02" && r !== "03" || !Nx(e))
    return t;
  try {
    return at.fromHex(e).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function Px(e, t, n, r) {
  const o = Mx(e);
  if (!o.result)
    throw o;
  const s = nn.randomPrivateKey(), i = Qa(s, !0);
  let a = vf(s, e, !0);
  a = a.slice(1);
  const c = Fy(a), u = nn.randomBytes(16), h = await Cx(u, c.encryptionKey, t), d = os(u, i, h), m = Dy(c.hmacKey, d);
  let w;
  if (!r || r === "hex")
    w = Ue(h);
  else if (r === "base64")
    w = A2(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const v = {
    iv: Ue(u),
    ephemeralPK: Ue(i),
    cipherText: w,
    mac: Ue(m),
    wasString: n
  };
  return r && r !== "hex" && (v.cipherTextEncoding = r), v;
}
async function jy(e, t) {
  if (!t.ephemeralPK)
    throw new up("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = t.ephemeralPK;
  let r = vf(e, n, !0);
  r = r.slice(1);
  const o = Fy(r), s = mt(t.iv);
  let i;
  if (!t.cipherTextEncoding || t.cipherTextEncoding === "hex")
    i = mt(t.cipherText);
  else if (t.cipherTextEncoding === "base64")
    i = v2(t.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${t.cipherText}"`);
  const a = os(s, mt(n), i), c = Dy(o.hmacKey, a), u = mt(t.mac);
  if (!Bx(u, c))
    throw new up("Decryption failed: failure in MAC check");
  const h = await Tx(s, o.encryptionKey, i);
  return t.wasString ? Ja(h) : h;
}
function _x(e, t) {
  const n = typeof t == "string" ? ci(t) : t, r = Hy(e), o = Uy(n), s = Hl(o, e);
  return {
    signature: Ue(s),
    publicKey: r
  };
}
async function Ux(e, t) {
  const n = Object.assign({}, t);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Hy(n.privateKey);
  }
  const o = typeof n.wasString == "boolean" ? n.wasString : typeof e == "string", s = typeof e == "string" ? ci(e) : e, i = await Px(n.publicKey, s, o, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = _x(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function Ox(e, t) {
  const n = Object.assign({}, t);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(e);
    return jy(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Bn = {}, Zi = {}, Rn = {};
Object.defineProperty(Rn, "__esModule", { value: !0 });
Rn.decode = Rn.encode = Rn.unescape = Rn.escape = Rn.pad = void 0;
const Ry = ec;
function kf(e) {
  return `${e}${"=".repeat(4 - (e.length % 4 || 4))}`;
}
Rn.pad = kf;
function zy(e) {
  return e.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Rn.escape = zy;
function Gy(e) {
  return kf(e).replace(/-/g, "+").replace(/_/g, "/");
}
Rn.unescape = Gy;
function Hx(e) {
  return zy((0, Ry.fromByteArray)(new TextEncoder().encode(e)));
}
Rn.encode = Hx;
function Dx(e) {
  return new TextDecoder().decode((0, Ry.toByteArray)(kf(Gy(e))));
}
Rn.decode = Dx;
var Fl = {}, jl = {}, Ky = {}, Vy = {}, Rl = {};
Object.defineProperty(Rl, "__esModule", { value: !0 });
Rl.crypto = void 0;
Rl.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = n, e.anumber = r, e.abytes = o, e.ahash = s, e.aexists = i, e.aoutput = a, e.u8 = c, e.u32 = u, e.clean = h, e.createView = d, e.rotr = m, e.rotl = w, e.byteSwap = v, e.byteSwap32 = x, e.bytesToHex = U, e.hexToBytes = _, e.asyncLoop = ce, e.utf8ToBytes = ne, e.bytesToUtf8 = q, e.toBytes = b, e.kdfInputToBytes = I, e.concatBytes = N, e.checkOpts = P, e.createHasher = R, e.createOptHasher = le, e.createXOFer = ue, e.randomBytes = Xe;
  const t = Rl;
  function n(C) {
    return C instanceof Uint8Array || ArrayBuffer.isView(C) && C.constructor.name === "Uint8Array";
  }
  function r(C) {
    if (!Number.isSafeInteger(C) || C < 0)
      throw new Error("positive integer expected, got " + C);
  }
  function o(C, ...F) {
    if (!n(C))
      throw new Error("Uint8Array expected");
    if (F.length > 0 && !F.includes(C.length))
      throw new Error("Uint8Array expected of length " + F + ", got length=" + C.length);
  }
  function s(C) {
    if (typeof C != "function" || typeof C.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(C.outputLen), r(C.blockLen);
  }
  function i(C, F = !0) {
    if (C.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (F && C.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(C, F) {
    o(C);
    const re = F.outputLen;
    if (C.length < re)
      throw new Error("digestInto() expects output buffer of length at least " + re);
  }
  function c(C) {
    return new Uint8Array(C.buffer, C.byteOffset, C.byteLength);
  }
  function u(C) {
    return new Uint32Array(C.buffer, C.byteOffset, Math.floor(C.byteLength / 4));
  }
  function h(...C) {
    for (let F = 0; F < C.length; F++)
      C[F].fill(0);
  }
  function d(C) {
    return new DataView(C.buffer, C.byteOffset, C.byteLength);
  }
  function m(C, F) {
    return C << 32 - F | C >>> F;
  }
  function w(C, F) {
    return C << F | C >>> 32 - F >>> 0;
  }
  e.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function v(C) {
    return C << 24 & 4278190080 | C << 8 & 16711680 | C >>> 8 & 65280 | C >>> 24 & 255;
  }
  e.swap8IfBE = e.isLE ? (C) => C : (C) => v(C), e.byteSwapIfBE = e.swap8IfBE;
  function x(C) {
    for (let F = 0; F < C.length; F++)
      C[F] = v(C[F]);
    return C;
  }
  e.swap32IfBE = e.isLE ? (C) => C : x;
  const L = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", B = /* @__PURE__ */ Array.from({ length: 256 }, (C, F) => F.toString(16).padStart(2, "0"));
  function U(C) {
    if (o(C), L)
      return C.toHex();
    let F = "";
    for (let re = 0; re < C.length; re++)
      F += B[C[re]];
    return F;
  }
  const A = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function T(C) {
    if (C >= A._0 && C <= A._9)
      return C - A._0;
    if (C >= A.A && C <= A.F)
      return C - (A.A - 10);
    if (C >= A.a && C <= A.f)
      return C - (A.a - 10);
  }
  function _(C) {
    if (typeof C != "string")
      throw new Error("hex string expected, got " + typeof C);
    if (L)
      return Uint8Array.fromHex(C);
    const F = C.length, re = F / 2;
    if (F % 2)
      throw new Error("hex string expected, got unpadded hex of length " + F);
    const de = new Uint8Array(re);
    for (let Be = 0, Me = 0; Be < re; Be++, Me += 2) {
      const Ot = T(C.charCodeAt(Me)), Ge = T(C.charCodeAt(Me + 1));
      if (Ot === void 0 || Ge === void 0) {
        const Pe = C[Me] + C[Me + 1];
        throw new Error('hex string expected, got non-hex character "' + Pe + '" at index ' + Me);
      }
      de[Be] = Ot * 16 + Ge;
    }
    return de;
  }
  const X = async () => {
  };
  e.nextTick = X;
  async function ce(C, F, re) {
    let de = Date.now();
    for (let Be = 0; Be < C; Be++) {
      re(Be);
      const Me = Date.now() - de;
      Me >= 0 && Me < F || (await (0, e.nextTick)(), de += Me);
    }
  }
  function ne(C) {
    if (typeof C != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(C));
  }
  function q(C) {
    return new TextDecoder().decode(C);
  }
  function b(C) {
    return typeof C == "string" && (C = ne(C)), o(C), C;
  }
  function I(C) {
    return typeof C == "string" && (C = ne(C)), o(C), C;
  }
  function N(...C) {
    let F = 0;
    for (let de = 0; de < C.length; de++) {
      const Be = C[de];
      o(Be), F += Be.length;
    }
    const re = new Uint8Array(F);
    for (let de = 0, Be = 0; de < C.length; de++) {
      const Me = C[de];
      re.set(Me, Be), Be += Me.length;
    }
    return re;
  }
  function P(C, F) {
    if (F !== void 0 && {}.toString.call(F) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(C, F);
  }
  class W {
  }
  e.Hash = W;
  function R(C) {
    const F = (de) => C().update(b(de)).digest(), re = C();
    return F.outputLen = re.outputLen, F.blockLen = re.blockLen, F.create = () => C(), F;
  }
  function le(C) {
    const F = (de, Be) => C(Be).update(b(de)).digest(), re = C({});
    return F.outputLen = re.outputLen, F.blockLen = re.blockLen, F.create = (de) => C(de), F;
  }
  function ue(C) {
    const F = (de, Be) => C(Be).update(b(de)).digest(), re = C({});
    return F.outputLen = re.outputLen, F.blockLen = re.blockLen, F.create = (de) => C(de), F;
  }
  e.wrapConstructor = R, e.wrapConstructorWithOpts = le, e.wrapXOFConstructorWithOpts = ue;
  function Xe(C = 32) {
    if (t.crypto && typeof t.crypto.getRandomValues == "function")
      return t.crypto.getRandomValues(new Uint8Array(C));
    if (t.crypto && typeof t.crypto.randomBytes == "function")
      return Uint8Array.from(t.crypto.randomBytes(C));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Vy);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.hmac = e.HMAC = void 0;
  const t = Vy;
  class n extends t.Hash {
    constructor(s, i) {
      super(), this.finished = !1, this.destroyed = !1, (0, t.ahash)(s);
      const a = (0, t.toBytes)(i);
      if (this.iHash = s.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, u = new Uint8Array(c);
      u.set(a.length > c ? s.create().update(a).digest() : a);
      for (let h = 0; h < u.length; h++)
        u[h] ^= 54;
      this.iHash.update(u), this.oHash = s.create();
      for (let h = 0; h < u.length; h++)
        u[h] ^= 106;
      this.oHash.update(u), (0, t.clean)(u);
    }
    update(s) {
      return (0, t.aexists)(this), this.iHash.update(s), this;
    }
    digestInto(s) {
      (0, t.aexists)(this), (0, t.abytes)(s, this.outputLen), this.finished = !0, this.iHash.digestInto(s), this.oHash.update(s), this.oHash.digestInto(s), this.destroy();
    }
    digest() {
      const s = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(s), s;
    }
    _cloneInto(s) {
      s || (s = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: i, iHash: a, finished: c, destroyed: u, blockLen: h, outputLen: d } = this;
      return s = s, s.finished = c, s.destroyed = u, s.blockLen = h, s.outputLen = d, s.oHash = i._cloneInto(s.oHash), s.iHash = a._cloneInto(s.iHash), s;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  e.HMAC = n;
  const r = (o, s, i) => new n(o, s).update(i).digest();
  e.hmac = r, e.hmac.create = (o, s) => new n(o, s);
})(Ky);
const Li = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Xy(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function dd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function ui(e, ...t) {
  if (!Xy(e))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length))
    throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function Fx(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  dd(e.outputLen), dd(e.blockLen);
}
function fd(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Yy(e, t) {
  ui(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function jx(e) {
  return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
function Rx(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function ll(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function Xc(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function Tr(e, t) {
  return e << 32 - t | e >>> t;
}
function zx(e, t) {
  return e << t | e >>> 32 - t >>> 0;
}
const $f = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function If(e) {
  return e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
}
const qy = $f ? (e) => e : (e) => If(e), Gx = qy;
function Wy(e) {
  for (let t = 0; t < e.length; t++)
    e[t] = If(e[t]);
  return e;
}
const Kx = $f ? (e) => e : Wy, Zy = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Vx = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Lf(e) {
  if (ui(e), Zy)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += Vx[e[n]];
  return t;
}
const xs = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Ap(e) {
  if (e >= xs._0 && e <= xs._9)
    return e - xs._0;
  if (e >= xs.A && e <= xs.F)
    return e - (xs.A - 10);
  if (e >= xs.a && e <= xs.f)
    return e - (xs.a - 10);
}
function Xx(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (Zy)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let o = 0, s = 0; o < n; o++, s += 2) {
    const i = Ap(e.charCodeAt(s)), a = Ap(e.charCodeAt(s + 1));
    if (i === void 0 || a === void 0) {
      const c = e[s] + e[s + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + s);
    }
    r[o] = i * 16 + a;
  }
  return r;
}
const Jy = async () => {
};
async function Yx(e, t, n) {
  let r = Date.now();
  for (let o = 0; o < e; o++) {
    n(o);
    const s = Date.now() - r;
    s >= 0 && s < t || (await Jy(), r += s);
  }
}
function Cf(e) {
  if (typeof e != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function qx(e) {
  return new TextDecoder().decode(e);
}
function tc(e) {
  return typeof e == "string" && (e = Cf(e)), ui(e), e;
}
function Wx(e) {
  return typeof e == "string" && (e = Cf(e)), ui(e), e;
}
function Zx(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const o = e[r];
    ui(o), t += o.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
function Jx(e, t) {
  if (t !== void 0 && {}.toString.call(t) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(e, t);
}
let Qy = class {
};
function zl(e) {
  const t = (r) => e().update(tc(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function ew(e) {
  const t = (r, o) => e(o).update(tc(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
function tw(e) {
  const t = (r, o) => e(o).update(tc(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
const Qx = zl, eS = ew, tS = tw;
function nS(e = 32) {
  if (Li && typeof Li.getRandomValues == "function")
    return Li.getRandomValues(new Uint8Array(e));
  if (Li && typeof Li.randomBytes == "function")
    return Uint8Array.from(Li.randomBytes(e));
  throw new Error("crypto.getRandomValues must be defined");
}
const rS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Qy,
  abytes: ui,
  aexists: fd,
  ahash: Fx,
  anumber: dd,
  aoutput: Yy,
  asyncLoop: Yx,
  byteSwap: If,
  byteSwap32: Wy,
  byteSwapIfBE: Gx,
  bytesToHex: Lf,
  bytesToUtf8: qx,
  checkOpts: Jx,
  clean: ll,
  concatBytes: Zx,
  createHasher: zl,
  createOptHasher: ew,
  createView: Xc,
  createXOFer: tw,
  hexToBytes: Xx,
  isBytes: Xy,
  isLE: $f,
  kdfInputToBytes: Wx,
  nextTick: Jy,
  randomBytes: nS,
  rotl: zx,
  rotr: Tr,
  swap32IfBE: Kx,
  swap8IfBE: qy,
  toBytes: tc,
  u32: Rx,
  u8: jx,
  utf8ToBytes: Cf,
  wrapConstructor: Qx,
  wrapConstructorWithOpts: eS,
  wrapXOFConstructorWithOpts: tS
}, Symbol.toStringTag, { value: "Module" }));
function sS(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
function oS(e, t, n) {
  return e & t ^ ~e & n;
}
function iS(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class aS extends Qy {
  constructor(t, n, r, o) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.buffer = new Uint8Array(t), this.view = Xc(this.buffer);
  }
  update(t) {
    fd(this), t = tc(t), ui(t);
    const { view: n, buffer: r, blockLen: o } = this, s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = Xc(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    fd(this), Yy(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, ll(this.buffer.subarray(i)), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    sS(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Xc(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.destroyed = i, t.finished = s, t.length = o, t.pos = a, o % n && t.buffer.set(r), t;
  }
  clone() {
    return this._cloneInto();
  }
}
const Ks = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Vs = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), cS = /* @__PURE__ */ Uint32Array.from([
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
]), Xs = /* @__PURE__ */ new Uint32Array(64);
let Tf = class extends aS {
  constructor(t = 32) {
    super(64, t, 8, !1), this.A = Ks[0] | 0, this.B = Ks[1] | 0, this.C = Ks[2] | 0, this.D = Ks[3] | 0, this.E = Ks[4] | 0, this.F = Ks[5] | 0, this.G = Ks[6] | 0, this.H = Ks[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      Xs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = Xs[d - 15], w = Xs[d - 2], v = Tr(m, 7) ^ Tr(m, 18) ^ m >>> 3, x = Tr(w, 17) ^ Tr(w, 19) ^ w >>> 10;
      Xs[d] = x + Xs[d - 7] + v + Xs[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = Tr(a, 6) ^ Tr(a, 11) ^ Tr(a, 25), w = h + m + oS(a, c, u) + cS[d] + Xs[d] | 0, x = (Tr(r, 2) ^ Tr(r, 13) ^ Tr(r, 22)) + iS(r, o, s) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = s, s = o, o = r, r = w + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, o, s, i, a, c, u, h);
  }
  roundClean() {
    ll(Xs);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), ll(this.buffer);
  }
}, nw = class extends Tf {
  constructor() {
    super(28), this.A = Vs[0] | 0, this.B = Vs[1] | 0, this.C = Vs[2] | 0, this.D = Vs[3] | 0, this.E = Vs[4] | 0, this.F = Vs[5] | 0, this.G = Vs[6] | 0, this.H = Vs[7] | 0;
  }
};
const lS = /* @__PURE__ */ zl(() => new Tf()), uS = /* @__PURE__ */ zl(() => new nw()), dS = Tf, Bf = lS, fS = nw, hS = uS, pS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: fS,
  SHA256: dS,
  sha224: hS,
  sha256: Bf
}, Symbol.toStringTag, { value: "Module" })), Gl = /* @__PURE__ */ _l(pS), gS = /* @__PURE__ */ _l(S2);
var Ji = {};
Object.defineProperty(Ji, "__esModule", { value: !0 });
Ji.joseToDer = Ji.derToJose = void 0;
const rw = ec, sw = Rn;
function Eu(e) {
  return (e / 8 | 0) + (e % 8 === 0 ? 0 : 1);
}
const yS = {
  ES256: Eu(256),
  ES384: Eu(384),
  ES512: Eu(521)
};
function ow(e) {
  const t = yS[e];
  if (t)
    return t;
  throw new Error(`Unknown algorithm "${e}"`);
}
const ul = 128, iw = 0, wS = 32, mS = 16, bS = 2, aw = mS | wS | iw << 6, dl = bS | iw << 6;
function cw(e) {
  if (e instanceof Uint8Array)
    return e;
  if (typeof e == "string")
    return (0, rw.toByteArray)((0, sw.pad)(e));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function xS(e, t) {
  const n = cw(e), r = ow(t), o = r + 1, s = n.length;
  let i = 0;
  if (n[i++] !== aw)
    throw new Error('Could not find expected "seq"');
  let a = n[i++];
  if (a === (ul | 1) && (a = n[i++]), s - i < a)
    throw new Error(`"seq" specified length of "${a}", only "${s - i}" remaining`);
  if (n[i++] !== dl)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[i++];
  if (s - i - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${s - i - 2}" available`);
  if (o < c)
    throw new Error(`"r" specified length of "${c}", max of "${o}" is acceptable`);
  const u = i;
  if (i += c, n[i++] !== dl)
    throw new Error('Could not find expected "int" for "s"');
  const h = n[i++];
  if (s - i !== h)
    throw new Error(`"s" specified length of "${h}", expected "${s - i}"`);
  if (o < h)
    throw new Error(`"s" specified length of "${h}", max of "${o}" is acceptable`);
  const d = i;
  if (i += h, i !== s)
    throw new Error(`Expected to consume entire array, but "${s - i}" bytes remain`);
  const m = r - c, w = r - h, v = new Uint8Array(m + c + w + h);
  for (i = 0; i < m; ++i)
    v[i] = 0;
  v.set(n.subarray(u + Math.max(-m, 0), u + c), i), i = r;
  for (const x = i; i < x + w; ++i)
    v[i] = 0;
  return v.set(n.subarray(d + Math.max(-w, 0), d + h), i), (0, sw.escape)((0, rw.fromByteArray)(v));
}
Ji.derToJose = xS;
function Ep(e, t, n) {
  let r = 0;
  for (; t + r < n && e[t + r] === 0; )
    ++r;
  return e[t + r] >= ul && --r, r;
}
function SS(e, t) {
  e = cw(e);
  const n = ow(t), r = e.length;
  if (r !== n * 2)
    throw new TypeError(`"${t}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const o = Ep(e, 0, n), s = Ep(e, n, e.length), i = n - o, a = n - s, c = 2 + i + 1 + 1 + a, u = c < ul, h = new Uint8Array((u ? 2 : 3) + c);
  let d = 0;
  return h[d++] = aw, u ? h[d++] = c : (h[d++] = ul | 1, h[d++] = c & 255), h[d++] = dl, h[d++] = i, o < 0 ? (h[d++] = 0, h.set(e.subarray(0, n), d), d += n) : (h.set(e.subarray(o, n), d), d += n - o), h[d++] = dl, h[d++] = a, s < 0 ? (h[d++] = 0, h.set(e.subarray(n), d)) : h.set(e.subarray(n + s), d), h;
}
Ji.joseToDer = SS;
var Cs = {};
Object.defineProperty(Cs, "__esModule", { value: !0 });
Cs.InvalidTokenError = Cs.MissingParametersError = void 0;
class vS extends Error {
  constructor(t) {
    super(), this.name = "MissingParametersError", this.message = t || "";
  }
}
Cs.MissingParametersError = vS;
class AS extends Error {
  constructor(t) {
    super(), this.name = "InvalidTokenError", this.message = t || "";
  }
}
Cs.InvalidTokenError = AS;
const nc = /* @__PURE__ */ _l(rS);
Object.defineProperty(jl, "__esModule", { value: !0 });
jl.SECP256K1Client = void 0;
const ES = Ky, kS = Gl, Yc = gS, kp = Ji, $p = Cs, Ip = nc;
Yc.utils.hmacSha256Sync = (e, ...t) => {
  const n = ES.hmac.create(kS.sha256, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
class lw {
  static derivePublicKey(t, n = !0) {
    return t.length === 66 && (t = t.slice(0, 64)), t.length < 64 && (t = t.padStart(64, "0")), (0, Ip.bytesToHex)(Yc.getPublicKey(t, n));
  }
  static signHash(t, n, r = "jose") {
    if (!t || !n)
      throw new $p.MissingParametersError("a signing input hash and private key are all required");
    const o = Yc.signSync(t, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Ip.bytesToHex)(o);
    if (r === "jose")
      return (0, kp.derToJose)(o, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(t) {
    return (0, kp.joseToDer)(t, "ES256");
  }
  static verifyHash(t, n, r) {
    if (!t || !n || !r)
      throw new $p.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Yc.verify(n, t, r, { strict: !1 });
  }
}
jl.SECP256K1Client = lw;
lw.algorithmName = "ES256K";
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.cryptoClients = e.SECP256K1Client = void 0;
  const t = jl;
  Object.defineProperty(e, "SECP256K1Client", { enumerable: !0, get: function() {
    return t.SECP256K1Client;
  } });
  const n = {
    ES256K: t.SECP256K1Client
  };
  e.cryptoClients = n;
})(Fl);
var qo = {};
const $S = /* @__PURE__ */ _l(yy);
var IS = Gn && Gn.__awaiter || function(e, t, n, r) {
  function o(s) {
    return s instanceof n ? s : new n(function(i) {
      i(s);
    });
  }
  return new (n || (n = Promise))(function(s, i) {
    function a(h) {
      try {
        u(r.next(h));
      } catch (d) {
        i(d);
      }
    }
    function c(h) {
      try {
        u(r.throw(h));
      } catch (d) {
        i(d);
      }
    }
    function u(h) {
      h.done ? s(h.value) : o(h.value).then(a, c);
    }
    u((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(qo, "__esModule", { value: !0 });
qo.hashSha256Async = qo.hashSha256 = void 0;
const LS = Gl;
function uw(e) {
  return (0, LS.sha256)(e);
}
qo.hashSha256 = uw;
function CS(e) {
  return IS(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof e == "string" ? new TextEncoder().encode(e) : e, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = $S;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(e).digest());
      }
    } catch (t) {
      return console.log(t), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(uw(e));
    }
  });
}
qo.hashSha256Async = CS;
var TS = Gn && Gn.__awaiter || function(e, t, n, r) {
  function o(s) {
    return s instanceof n ? s : new n(function(i) {
      i(s);
    });
  }
  return new (n || (n = Promise))(function(s, i) {
    function a(h) {
      try {
        u(r.next(h));
      } catch (d) {
        i(d);
      }
    }
    function c(h) {
      try {
        u(r.throw(h));
      } catch (d) {
        i(d);
      }
    }
    function u(h) {
      h.done ? s(h.value) : o(h.value).then(a, c);
    }
    u((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(Zi, "__esModule", { value: !0 });
Zi.TokenSigner = Zi.createUnsecuredToken = void 0;
const hd = Rn, Lp = Fl, BS = Cs, Cp = qo;
function pd(e, t) {
  const n = [], r = hd.encode(JSON.stringify(t));
  n.push(r);
  const o = hd.encode(JSON.stringify(e));
  return n.push(o), n.join(".");
}
function NS(e) {
  return pd(e, { typ: "JWT", alg: "none" }) + ".";
}
Zi.createUnsecuredToken = NS;
class MS {
  constructor(t, n) {
    if (!(t && n))
      throw new BS.MissingParametersError("a signing algorithm and private key are required");
    if (typeof t != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (t = t.toUpperCase(), !Lp.cryptoClients.hasOwnProperty(t))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Lp.cryptoClients[t], this.rawPrivateKey = n;
  }
  header(t = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, t);
  }
  sign(t, n = !1, r = {}) {
    const o = this.header(r), s = pd(t, o), i = (0, Cp.hashSha256)(s);
    return this.createWithSignedHash(t, n, o, s, i);
  }
  signAsync(t, n = !1, r = {}) {
    return TS(this, void 0, void 0, function* () {
      const o = this.header(r), s = pd(t, o), i = yield (0, Cp.hashSha256Async)(s);
      return this.createWithSignedHash(t, n, o, s, i);
    });
  }
  createWithSignedHash(t, n, r, o, s) {
    const i = this.cryptoClient.signHash(s, this.rawPrivateKey);
    return n ? {
      header: [hd.encode(JSON.stringify(r))],
      payload: JSON.stringify(t),
      signature: [i]
    } : [o, i].join(".");
  }
}
Zi.TokenSigner = MS;
var Kl = {};
Object.defineProperty(Kl, "__esModule", { value: !0 });
Kl.TokenVerifier = void 0;
const PS = Rn, Tp = Fl, _S = Cs, bc = qo;
class US {
  constructor(t, n) {
    if (!(t && n))
      throw new _S.MissingParametersError("a signing algorithm and public key are required");
    if (typeof t != "string")
      throw "signing algorithm parameter must be a string";
    if (t = t.toUpperCase(), !Tp.cryptoClients.hasOwnProperty(t))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Tp.cryptoClients[t], this.rawPublicKey = n;
  }
  verify(t) {
    return typeof t == "string" ? this.verifyCompact(t, !1) : typeof t == "object" ? this.verifyExpanded(t, !1) : !1;
  }
  verifyAsync(t) {
    return typeof t == "string" ? this.verifyCompact(t, !0) : typeof t == "object" ? this.verifyExpanded(t, !0) : Promise.resolve(!1);
  }
  verifyCompact(t, n) {
    const r = t.split("."), o = r[0] + "." + r[1], s = (i) => {
      const a = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(i, a, this.rawPublicKey);
    };
    if (n)
      return (0, bc.hashSha256Async)(o).then((i) => s(i));
    {
      const i = (0, bc.hashSha256)(o);
      return s(i);
    }
  }
  verifyExpanded(t, n) {
    const r = [t.header.join("."), PS.encode(t.payload)].join(".");
    let o = !0;
    const s = (i) => (t.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(i, c, this.rawPublicKey) || (o = !1);
    }), o);
    if (n)
      return (0, bc.hashSha256Async)(r).then((i) => s(i));
    {
      const i = (0, bc.hashSha256)(r);
      return s(i);
    }
  }
}
Kl.TokenVerifier = US;
var Vl = {};
Object.defineProperty(Vl, "__esModule", { value: !0 });
Vl.decodeToken = void 0;
const xc = Rn;
function OS(e) {
  if (typeof e == "string") {
    const t = e.split("."), n = JSON.parse(xc.decode(t[0])), r = JSON.parse(xc.decode(t[1])), o = t[2];
    return {
      header: n,
      payload: r,
      signature: o
    };
  } else if (typeof e == "object") {
    if (typeof e.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let t = e.payload;
    e.payload[0] !== "{" && (t = xc.decode(t));
    const n = [];
    return e.header.map((r) => {
      const o = JSON.parse(xc.decode(r));
      n.push(o);
    }), {
      header: n,
      payload: JSON.parse(t),
      signature: e.signature
    };
  }
}
Vl.decodeToken = OS;
(function(e) {
  var t = Gn && Gn.__createBinding || (Object.create ? function(r, o, s, i) {
    i === void 0 && (i = s);
    var a = Object.getOwnPropertyDescriptor(o, s);
    (!a || ("get" in a ? !o.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return o[s];
    } }), Object.defineProperty(r, i, a);
  } : function(r, o, s, i) {
    i === void 0 && (i = s), r[i] = o[s];
  }), n = Gn && Gn.__exportStar || function(r, o) {
    for (var s in r) s !== "default" && !Object.prototype.hasOwnProperty.call(o, s) && t(o, r, s);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), n(Zi, e), n(Kl, e), n(Vl, e), n(Cs, e), n(Fl, e);
})(Bn);
function HS(e) {
  return `did:btc-addr:${e}`;
}
function DS(e) {
  const t = e.split(":");
  if (t.length !== 3)
    throw new lp("Decentralized IDs must have 3 parts");
  if (t[0].toLowerCase() !== "did")
    throw new lp('Decentralized IDs must start with "did"');
  return t[1].toLowerCase();
}
function dw(e) {
  if (e)
    return DS(e) === "btc-addr" ? e.split(":")[2] : void 0;
}
const FS = "1.4.0";
function jS() {
  return $x();
}
function RS(e, t, n, r = iy.slice(), o, s = A1().getTime(), i = {}) {
  const a = (w) => {
    const v = pf("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${w}=undefined])`
    });
    return v == null ? void 0 : v.origin;
  };
  t || (t = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), o || (o = a("appDomain"));
  const c = Object.assign({}, i, {
    jti: k1(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(s / 1e3),
    iss: null,
    public_keys: [],
    domain_name: o,
    manifest_uri: n,
    redirect_uri: t,
    version: FS,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = Bn.SECP256K1Client.derivePublicKey(e);
  c.public_keys = [u];
  const h = Oy(u);
  return c.iss = HS(h), new Bn.TokenSigner("ES256k", e).sign(c);
}
async function Bp(e, t) {
  const n = Ja(mt(t)), r = JSON.parse(n), o = await jy(e, r);
  if (typeof o != "string")
    throw new Error("Unable to correctly decrypt private key");
  return o;
}
function zS(e) {
  const t = Bn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Bn.TokenVerifier("ES256k", r).verify(e);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function GS(e) {
  const t = Bn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys, r = dw(t.iss);
  if (n.length === 1) {
    if (Oy(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function KS(e) {
  const t = Bn.decodeToken(e).payload;
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
function VS(e) {
  const t = Bn.decodeToken(e).payload;
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
function XS(e) {
  const t = [
    VS(e),
    KS(e),
    zS(e),
    GS(e)
  ];
  return Promise.resolve(t.every((n) => n));
}
const Np = "1.0.0";
class mo {
  constructor(t) {
    this.version = Np, this.userData = t.userData, this.transitKey = t.transitKey, this.etags = t.etags ? t.etags : {};
  }
  static fromJSON(t) {
    if (t.version !== Np)
      throw new od(`JSON data version ${t.version} not supported by SessionData`);
    const n = {
      coreNode: t.coreNode,
      userData: t.userData,
      transitKey: t.transitKey,
      etags: t.etags
    };
    return new mo(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class fw {
  constructor(t) {
    if (t) {
      const n = new mo(t);
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
class Mp extends fw {
  constructor(t) {
    super(t), this.sessionData || this.setSessionData(new mo({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new ay("No session data was found.");
    return this.sessionData;
  }
  setSessionData(t) {
    return this.sessionData = t, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new mo({})), !0;
  }
}
class Pp extends fw {
  constructor(t) {
    if (super(t), t && t.storeOptions && t.storeOptions.localStorageKey && typeof t.storeOptions.localStorageKey == "string" ? this.key = t.storeOptions.localStorageKey : this.key = x1, !localStorage.getItem(this.key)) {
      const r = new mo({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const t = localStorage.getItem(this.key);
    if (!t)
      throw new ay("No session data was found in localStorage");
    const n = JSON.parse(t);
    return mo.fromJSON(n);
  }
  setSessionData(t) {
    return localStorage.setItem(this.key, t.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new mo({})), !0;
  }
}
var Da;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(Da || (Da = {}));
var fl;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(fl || (fl = {}));
Da.Mainnet;
var $s;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})($s || ($s = {}));
var ns;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ns || (ns = {}));
$s.Mainnet;
const hw = {
  chainId: Da.Mainnet,
  transactionVersion: $s.Mainnet,
  peerNetworkId: fl.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ns.MainnetSingleSig,
    multiSig: ns.MainnetMultiSig
  },
  client: { baseUrl: cy }
}, gd = {
  chainId: Da.Testnet,
  transactionVersion: $s.Testnet,
  peerNetworkId: fl.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ns.TestnetSingleSig,
    multiSig: ns.TestnetMultiSig
  },
  client: { baseUrl: ly }
}, qc = {
  ...gd,
  addressVersion: { ...gd.addressVersion },
  magicBytes: "id",
  client: { baseUrl: uy }
}, YS = {
  ...qc,
  addressVersion: { ...qc.addressVersion },
  client: { ...qc.client }
};
function qS(e) {
  switch (e) {
    case "mainnet":
      return hw;
    case "testnet":
      return gd;
    case "devnet":
      return qc;
    case "mocknet":
      return YS;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function pw(e) {
  return typeof e == "string" ? qS(e) : e;
}
var _p;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(_p || (_p = {}));
var Up;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(Up || (Up = {}));
var Br;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Br || (Br = {}));
const ku = ["onChainOnly", "offChainOnly", "any"];
ku[0] + "", Br.OnChainOnly, ku[1] + "", Br.OffChainOnly, ku[2] + "", Br.Any, Br.OnChainOnly + "", Br.OnChainOnly, Br.OffChainOnly + "", Br.OffChainOnly, Br.Any + "", Br.Any;
var Op;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(Op || (Op = {}));
var Hp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(Hp || (Hp = {}));
var Dp;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Dp || (Dp = {}));
var Es;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Es || (Es = {}));
var Fp;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Fp || (Fp = {}));
var jp;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(jp || (jp = {}));
var Rp;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(Rp || (Rp = {}));
var zp;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(zp || (zp = {}));
var Gp;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Gp || (Gp = {}));
var Kp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Kp || (Kp = {}));
var Vp;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Vp || (Vp = {}));
var Xp;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Xp || (Xp = {}));
var Yp;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(Yp || (Yp = {}));
function yd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function WS(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function gw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function ZS(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  yd(e.outputLen), yd(e.blockLen);
}
function JS(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function QS(e, t) {
  gw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Uo = {
  number: yd,
  bool: WS,
  bytes: gw,
  hash: ZS,
  exists: JS,
  output: QS
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const $u = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), qr = (e, t) => e << 32 - t | e >>> t, ev = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ev)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function tv(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Nf(e) {
  if (typeof e == "string" && (e = tv(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let yw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function di(e) {
  const t = (r) => e().update(Nf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let ww = class extends yw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Uo.hash(t);
    const r = Nf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, s = new Uint8Array(o);
    s.set(r.length > o ? t.create().update(r).digest() : r);
    for (let i = 0; i < s.length; i++)
      s[i] ^= 54;
    this.iHash.update(s), this.oHash = t.create();
    for (let i = 0; i < s.length; i++)
      s[i] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(t) {
    return Uo.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Uo.exists(this), Uo.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = o, t.destroyed = s, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const mw = (e, t, n) => new ww(e, t).update(n).digest();
mw.create = (e, t) => new ww(e, t);
function nv(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Mf = class extends yw {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = $u(this.buffer);
  }
  update(t) {
    Uo.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = Nf(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = $u(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Uo.exists(this), Uo.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    nv(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = $u(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.length = o, t.pos = a, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
};
const rv = (e, t, n) => e & t ^ ~e & n, sv = (e, t, n) => e & t ^ e & n ^ t & n, ov = new Uint32Array([
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
]), Ys = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), qs = new Uint32Array(64);
let bw = class extends Mf {
  constructor() {
    super(64, 32, 8, !1), this.A = Ys[0] | 0, this.B = Ys[1] | 0, this.C = Ys[2] | 0, this.D = Ys[3] | 0, this.E = Ys[4] | 0, this.F = Ys[5] | 0, this.G = Ys[6] | 0, this.H = Ys[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      qs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = qs[d - 15], w = qs[d - 2], v = qr(m, 7) ^ qr(m, 18) ^ m >>> 3, x = qr(w, 17) ^ qr(w, 19) ^ w >>> 10;
      qs[d] = x + qs[d - 7] + v + qs[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = qr(a, 6) ^ qr(a, 11) ^ qr(a, 25), w = h + m + rv(a, c, u) + ov[d] + qs[d] | 0, x = (qr(r, 2) ^ qr(r, 13) ^ qr(r, 22)) + sv(r, o, s) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = s, s = o, o = r, r = w + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, o, s, i, a, c, u, h);
  }
  roundClean() {
    qs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, iv = class extends bw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const xw = di(() => new bw());
di(() => new iv());
var fi = {}, Pf = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32decode = e.c32normalize = e.c32encode = e.c32 = void 0;
  const t = nc;
  e.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, a) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let c = [], u = 0;
    for (let w = i.length - 1; w >= 0; w--)
      if (u < 4) {
        const v = n.indexOf(i[w]) >> u;
        let x = 0;
        w !== 0 && (x = n.indexOf(i[w - 1]));
        const L = 1 + u, B = x % (1 << L) << 5 - L, U = e.c32[v + B];
        u = L, c.unshift(U);
      } else
        u = 0;
    let h = 0;
    for (let w = 0; w < c.length && c[w] === "0"; w++)
      h++;
    c = c.slice(h);
    const d = new TextDecoder().decode((0, t.hexToBytes)(i)).match(/^\u0000*/), m = d ? d[0].length : 0;
    for (let w = 0; w < m; w++)
      c.unshift(e.c32[0]);
    if (a) {
      const w = a - c.length;
      for (let v = 0; v < w; v++)
        c.unshift(e.c32[0]);
    }
    return c.join("");
  }
  e.c32encode = r;
  function o(i) {
    return i.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  e.c32normalize = o;
  function s(i, a) {
    if (i = o(i), !i.match(`^[${e.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const c = i.match(`^${e.c32[0]}*`), u = c ? c[0].length : 0;
    let h = [], d = 0, m = 0;
    for (let x = i.length - 1; x >= 0; x--) {
      m === 4 && (h.unshift(n[d]), m = 0, d = 0);
      const B = (e.c32.indexOf(i[x]) << m) + d, U = n[B % 16];
      if (m += 1, d = B >> 4, d > 1 << m)
        throw new Error("Panic error in decoding.");
      h.unshift(U);
    }
    h.unshift(n[d]), h.length % 2 === 1 && h.unshift("0");
    let w = 0;
    for (let x = 0; x < h.length && h[x] === "0"; x++)
      w++;
    h = h.slice(w - w % 2);
    let v = h.join("");
    for (let x = 0; x < u; x++)
      v = `00${v}`;
    if (a) {
      const x = a * 2 - v.length;
      for (let L = 0; L < x; L += 2)
        v = `00${v}`;
    }
    return v;
  }
  e.c32decode = s;
})(Pf);
var Wo = {};
Object.defineProperty(Wo, "__esModule", { value: !0 });
Wo.c32checkDecode = Wo.c32checkEncode = void 0;
const qp = Gl, Wp = nc, Ma = Pf;
function Sw(e) {
  const t = (0, qp.sha256)((0, qp.sha256)((0, Wp.hexToBytes)(e)));
  return (0, Wp.bytesToHex)(t.slice(0, 4));
}
function av(e, t) {
  if (e < 0 || e >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!t.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  t = t.toLowerCase(), t.length % 2 !== 0 && (t = `0${t}`);
  let n = e.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Sw(`${n}${t}`), o = (0, Ma.c32encode)(`${t}${r}`);
  return `${Ma.c32[e]}${o}`;
}
Wo.c32checkEncode = av;
function cv(e) {
  e = (0, Ma.c32normalize)(e);
  const t = (0, Ma.c32decode)(e.slice(1)), n = e[0], r = Ma.c32.indexOf(n), o = t.slice(-8);
  let s = r.toString(16);
  if (s.length === 1 && (s = `0${s}`), Sw(`${s}${t.substring(0, t.length - 8)}`) !== o)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, t.substring(0, t.length - 8)];
}
Wo.c32checkDecode = cv;
var vw = {}, Qi = {};
Object.defineProperty(Qi, "__esModule", { value: !0 });
Qi.decode = Qi.encode = void 0;
const hl = Gl, Zp = nc, Aw = Ny, Ew = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function lv(e, t = "00") {
  const n = typeof e == "string" ? (0, Zp.hexToBytes)(e) : e, r = typeof t == "string" ? (0, Zp.hexToBytes)(t) : e;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const o = (0, hl.sha256)((0, hl.sha256)(new Uint8Array([...r, ...n])));
  return Aw(Ew).encode([...r, ...n, ...o.slice(0, 4)]);
}
Qi.encode = lv;
function uv(e) {
  const t = Aw(Ew).decode(e), n = t.slice(0, 1), r = t.slice(1, -4), o = (0, hl.sha256)((0, hl.sha256)(new Uint8Array([...n, ...r])));
  return t.slice(-4).forEach((s, i) => {
    if (s !== o[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Qi.decode = uv;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32ToB58 = e.b58ToC32 = e.c32addressDecode = e.c32address = e.versions = void 0;
  const t = Wo, n = Qi, r = nc;
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
  const o = {};
  o[0] = e.versions.mainnet.p2pkh, o[5] = e.versions.mainnet.p2sh, o[111] = e.versions.testnet.p2pkh, o[196] = e.versions.testnet.p2sh;
  const s = {};
  s[e.versions.mainnet.p2pkh] = 0, s[e.versions.mainnet.p2sh] = 5, s[e.versions.testnet.p2pkh] = 111, s[e.versions.testnet.p2sh] = 196;
  function i(h, d) {
    if (!d.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, t.c32checkEncode)(h, d)}`;
  }
  e.c32address = i;
  function a(h) {
    if (h.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (h[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, t.c32checkDecode)(h.slice(1));
  }
  e.c32addressDecode = a;
  function c(h, d = -1) {
    const m = n.decode(h), w = (0, r.bytesToHex)(m.data), v = parseInt((0, r.bytesToHex)(m.prefix), 16);
    let x;
    return d < 0 ? (x = v, o[v] !== void 0 && (x = o[v])) : x = d, i(x, w);
  }
  e.b58ToC32 = c;
  function u(h, d = -1) {
    const m = a(h), w = m[0], v = m[1];
    let x;
    d < 0 ? (x = w, s[w] !== void 0 && (x = s[w])) : x = d;
    let L = x.toString(16);
    return L.length === 1 && (L = `0${L}`), n.encode(v, L);
  }
  e.c32ToB58 = u;
})(vw);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.b58ToC32 = e.c32ToB58 = e.versions = e.c32normalize = e.c32addressDecode = e.c32address = e.c32checkDecode = e.c32checkEncode = e.c32decode = e.c32encode = void 0;
  const t = Pf;
  Object.defineProperty(e, "c32encode", { enumerable: !0, get: function() {
    return t.c32encode;
  } }), Object.defineProperty(e, "c32decode", { enumerable: !0, get: function() {
    return t.c32decode;
  } }), Object.defineProperty(e, "c32normalize", { enumerable: !0, get: function() {
    return t.c32normalize;
  } });
  const n = Wo;
  Object.defineProperty(e, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(e, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = vw;
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
})(fi);
function dv(e, t) {
  switch (t = pw(t ?? hw), e) {
    case Es.P2PKH:
      switch (t.transactionVersion) {
        case $s.Mainnet:
          return ns.MainnetSingleSig;
        case $s.Testnet:
          return ns.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    case Es.P2SH:
    case Es.P2SHNonSequential:
    case Es.P2WPKH:
    case Es.P2WSH:
    case Es.P2WSHNonSequential:
      switch (t.transactionVersion) {
        case $s.Mainnet:
          return ns.MainnetMultiSig;
        case $s.Testnet:
          return ns.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${e}`);
  }
}
const fv = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), kw = Uint8Array.from({ length: 16 }, (e, t) => t), hv = kw.map((e) => (9 * e + 5) % 16);
let _f = [kw], Uf = [hv];
for (let e = 0; e < 4; e++)
  for (let t of [_f, Uf])
    t.push(t[e].map((n) => fv[n]));
const $w = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), pv = _f.map((e, t) => e.map((n) => $w[t][n])), gv = Uf.map((e, t) => e.map((n) => $w[t][n])), yv = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), wv = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Sc = (e, t) => e << t | e >>> 32 - t;
function Jp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const vc = new Uint32Array(16);
let mv = class extends Mf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: o, h4: s } = this;
    return [t, n, r, o, s];
  }
  set(t, n, r, o, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let w = 0; w < 16; w++, n += 4)
      vc[w] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, m = d;
    for (let w = 0; w < 5; w++) {
      const v = 4 - w, x = yv[w], L = wv[w], B = _f[w], U = Uf[w], A = pv[w], T = gv[w];
      for (let _ = 0; _ < 16; _++) {
        const X = Sc(r + Jp(w, s, a, u) + vc[B[_]] + x, A[_]) + d | 0;
        r = d, d = u, u = Sc(a, 10) | 0, a = s, s = X;
      }
      for (let _ = 0; _ < 16; _++) {
        const X = Sc(o + Jp(v, i, c, h) + vc[U[_]] + L, T[_]) + m | 0;
        o = m, m = h, h = Sc(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + m | 0, this.h3 + d + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    vc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const bv = di(() => new mv()), Ac = BigInt(2 ** 32 - 1), wd = BigInt(32);
function Iw(e, t = !1) {
  return t ? { h: Number(e & Ac), l: Number(e >> wd & Ac) } : { h: Number(e >> wd & Ac) | 0, l: Number(e & Ac) | 0 };
}
function xv(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = Iw(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const Sv = (e, t) => BigInt(e >>> 0) << wd | BigInt(t >>> 0), vv = (e, t, n) => e >>> n, Av = (e, t, n) => e << 32 - n | t >>> n, Ev = (e, t, n) => e >>> n | t << 32 - n, kv = (e, t, n) => e << 32 - n | t >>> n, $v = (e, t, n) => e << 64 - n | t >>> n - 32, Iv = (e, t, n) => e >>> n - 32 | t << 64 - n, Lv = (e, t) => t, Cv = (e, t) => e, Tv = (e, t, n) => e << n | t >>> 32 - n, Bv = (e, t, n) => t << n | e >>> 32 - n, Nv = (e, t, n) => t << n - 32 | e >>> 64 - n, Mv = (e, t, n) => e << n - 32 | t >>> 64 - n;
function Pv(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const _v = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), Uv = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, Ov = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Hv = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, Dv = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), Fv = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, Qe = {
  fromBig: Iw,
  split: xv,
  toBig: Sv,
  shrSH: vv,
  shrSL: Av,
  rotrSH: Ev,
  rotrSL: kv,
  rotrBH: $v,
  rotrBL: Iv,
  rotr32H: Lv,
  rotr32L: Cv,
  rotlSH: Tv,
  rotlSL: Bv,
  rotlBH: Nv,
  rotlBL: Mv,
  add: Pv,
  add3L: _v,
  add3H: Uv,
  add4L: Ov,
  add4H: Hv,
  add5H: Fv,
  add5L: Dv
}, [jv, Rv] = Qe.split([
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
].map((e) => BigInt(e))), Ws = new Uint32Array(80), Zs = new Uint32Array(80);
let Xl = class extends Mf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: m, Gh: w, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, o, s, i, a, c, u, h, d, m, w, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c, u, h, d, m, w, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Ws[A] = t.getUint32(n), Zs[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = Ws[A - 15] | 0, _ = Zs[A - 15] | 0, X = Qe.rotrSH(T, _, 1) ^ Qe.rotrSH(T, _, 8) ^ Qe.shrSH(T, _, 7), ce = Qe.rotrSL(T, _, 1) ^ Qe.rotrSL(T, _, 8) ^ Qe.shrSL(T, _, 7), ne = Ws[A - 2] | 0, q = Zs[A - 2] | 0, b = Qe.rotrSH(ne, q, 19) ^ Qe.rotrBH(ne, q, 61) ^ Qe.shrSH(ne, q, 6), I = Qe.rotrSL(ne, q, 19) ^ Qe.rotrBL(ne, q, 61) ^ Qe.shrSL(ne, q, 6), N = Qe.add4L(ce, I, Zs[A - 7], Zs[A - 16]), P = Qe.add4H(N, X, b, Ws[A - 7], Ws[A - 16]);
      Ws[A] = P | 0, Zs[A] = N | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: m, Fh: w, Fl: v, Gh: x, Gl: L, Hh: B, Hl: U } = this;
    for (let A = 0; A < 80; A++) {
      const T = Qe.rotrSH(d, m, 14) ^ Qe.rotrSH(d, m, 18) ^ Qe.rotrBH(d, m, 41), _ = Qe.rotrSL(d, m, 14) ^ Qe.rotrSL(d, m, 18) ^ Qe.rotrBL(d, m, 41), X = d & w ^ ~d & x, ce = m & v ^ ~m & L, ne = Qe.add5L(U, _, ce, Rv[A], Zs[A]), q = Qe.add5H(ne, B, T, X, jv[A], Ws[A]), b = ne | 0, I = Qe.rotrSH(r, o, 28) ^ Qe.rotrBH(r, o, 34) ^ Qe.rotrBH(r, o, 39), N = Qe.rotrSL(r, o, 28) ^ Qe.rotrBL(r, o, 34) ^ Qe.rotrBL(r, o, 39), P = r & s ^ r & a ^ s & a, W = o & i ^ o & c ^ i & c;
      B = x | 0, U = L | 0, x = w | 0, L = v | 0, w = d | 0, v = m | 0, { h: d, l: m } = Qe.add(u | 0, h | 0, q | 0, b | 0), u = a | 0, h = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const R = Qe.add3L(b, N, W);
      r = Qe.add3H(R, q, I, P), o = R | 0;
    }
    ({ h: r, l: o } = Qe.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = Qe.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = Qe.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Qe.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: m } = Qe.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: w, l: v } = Qe.add(this.Fh | 0, this.Fl | 0, w | 0, v | 0), { h: x, l: L } = Qe.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: B, l: U } = Qe.add(this.Hh | 0, this.Hl | 0, B | 0, U | 0), this.set(r, o, s, i, a, c, u, h, d, m, w, v, x, L, B, U);
  }
  roundClean() {
    Ws.fill(0), Zs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, zv = class extends Xl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Gv = class extends Xl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Kv = class extends Xl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
di(() => new Xl());
di(() => new zv());
di(() => new Gv());
di(() => new Kv());
var pl = { exports: {} };
pl.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", o = 9007199254740991, s = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", h = "[object Function]", d = "[object GeneratorFunction]", m = "[object Map]", w = "[object Number]", v = "[object Object]", x = "[object Promise]", L = "[object RegExp]", B = "[object Set]", U = "[object String]", A = "[object Symbol]", T = "[object WeakMap]", _ = "[object ArrayBuffer]", X = "[object DataView]", ce = "[object Float32Array]", ne = "[object Float64Array]", q = "[object Int8Array]", b = "[object Int16Array]", I = "[object Int32Array]", N = "[object Uint8Array]", P = "[object Uint8ClampedArray]", W = "[object Uint16Array]", R = "[object Uint32Array]", le = /[\\^$.*+?()[\]{}|]/g, ue = /\w*$/, Xe = /^\[object .+?Constructor\]$/, C = /^(?:0|[1-9]\d*)$/, F = {};
  F[s] = F[i] = F[_] = F[X] = F[a] = F[c] = F[ce] = F[ne] = F[q] = F[b] = F[I] = F[m] = F[w] = F[v] = F[L] = F[B] = F[U] = F[A] = F[N] = F[P] = F[W] = F[R] = !0, F[u] = F[h] = F[T] = !1;
  var re = typeof Gn == "object" && Gn && Gn.Object === Object && Gn, de = typeof self == "object" && self && self.Object === Object && self, Be = re || de || Function("return this")(), Me = t && !t.nodeType && t, Ot = Me && !0 && e && !e.nodeType && e, Ge = Ot && Ot.exports === Me;
  function Pe(S, M) {
    return S.set(M[0], M[1]), S;
  }
  function _e(S, M) {
    return S.add(M), S;
  }
  function Pt(S, M) {
    for (var G = -1, me = S ? S.length : 0; ++G < me && M(S[G], G, S) !== !1; )
      ;
    return S;
  }
  function En(S, M) {
    for (var G = -1, me = M.length, Rt = S.length; ++G < me; )
      S[Rt + G] = M[G];
    return S;
  }
  function lt(S, M, G, me) {
    for (var Rt = -1, kn = S ? S.length : 0; ++Rt < kn; )
      G = M(G, S[Rt], Rt, S);
    return G;
  }
  function Zt(S, M) {
    for (var G = -1, me = Array(S); ++G < S; )
      me[G] = M(G);
    return me;
  }
  function kt(S, M) {
    return S == null ? void 0 : S[M];
  }
  function z(S) {
    var M = !1;
    if (S != null && typeof S.toString != "function")
      try {
        M = !!(S + "");
      } catch {
      }
    return M;
  }
  function H(S) {
    var M = -1, G = Array(S.size);
    return S.forEach(function(me, Rt) {
      G[++M] = [Rt, me];
    }), G;
  }
  function Q(S, M) {
    return function(G) {
      return S(M(G));
    };
  }
  function se(S) {
    var M = -1, G = Array(S.size);
    return S.forEach(function(me) {
      G[++M] = me;
    }), G;
  }
  var he = Array.prototype, dt = Function.prototype, Ne = Object.prototype, He = Be["__core-js_shared__"], St = function() {
    var S = /[^.]+$/.exec(He && He.keys && He.keys.IE_PROTO || "");
    return S ? "Symbol(src)_1." + S : "";
  }(), Ke = dt.toString, Ie = Ne.hasOwnProperty, Ze = Ne.toString, Ye = RegExp(
    "^" + Ke.call(Ie).replace(le, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Ve = Ge ? Be.Buffer : void 0, Ht = Be.Symbol, pn = Be.Uint8Array, gn = Q(Object.getPrototypeOf, Object), Vn = Object.create, $t = Ne.propertyIsEnumerable, un = he.splice, Ir = Object.getOwnPropertySymbols, Rr = Ve ? Ve.isBuffer : void 0, mr = Q(Object.keys, Object), bt = Lr(Be, "DataView"), yn = Lr(Be, "Map"), Dt = Lr(Be, "Promise"), wn = Lr(Be, "Set"), Et = Lr(Be, "WeakMap"), Vt = Lr(Object, "create"), zr = Dn(bt), us = Dn(yn), E = Dn(Dt), O = Dn(wn), K = Dn(Et), D = Ht ? Ht.prototype : void 0, J = D ? D.valueOf : void 0;
  function ee(S) {
    var M = -1, G = S ? S.length : 0;
    for (this.clear(); ++M < G; ) {
      var me = S[M];
      this.set(me[0], me[1]);
    }
  }
  function Ce() {
    this.__data__ = Vt ? Vt(null) : {};
  }
  function Ae(S) {
    return this.has(S) && delete this.__data__[S];
  }
  function Fe(S) {
    var M = this.__data__;
    if (Vt) {
      var G = M[S];
      return G === r ? void 0 : G;
    }
    return Ie.call(M, S) ? M[S] : void 0;
  }
  function ft(S) {
    var M = this.__data__;
    return Vt ? M[S] !== void 0 : Ie.call(M, S);
  }
  function $(S, M) {
    var G = this.__data__;
    return G[S] = Vt && M === void 0 ? r : M, this;
  }
  ee.prototype.clear = Ce, ee.prototype.delete = Ae, ee.prototype.get = Fe, ee.prototype.has = ft, ee.prototype.set = $;
  function pe(S) {
    var M = -1, G = S ? S.length : 0;
    for (this.clear(); ++M < G; ) {
      var me = S[M];
      this.set(me[0], me[1]);
    }
  }
  function ze() {
    this.__data__ = [];
  }
  function ut(S) {
    var M = this.__data__, G = Mn(M, S);
    if (G < 0)
      return !1;
    var me = M.length - 1;
    return G == me ? M.pop() : un.call(M, G, 1), !0;
  }
  function Xt(S) {
    var M = this.__data__, G = Mn(M, S);
    return G < 0 ? void 0 : M[G][1];
  }
  function Ft(S) {
    return Mn(this.__data__, S) > -1;
  }
  function dn(S, M) {
    var G = this.__data__, me = Mn(G, S);
    return me < 0 ? G.push([S, M]) : G[me][1] = M, this;
  }
  pe.prototype.clear = ze, pe.prototype.delete = ut, pe.prototype.get = Xt, pe.prototype.has = Ft, pe.prototype.set = dn;
  function yt(S) {
    var M = -1, G = S ? S.length : 0;
    for (this.clear(); ++M < G; ) {
      var me = S[M];
      this.set(me[0], me[1]);
    }
  }
  function er() {
    this.__data__ = {
      hash: new ee(),
      map: new (yn || pe)(),
      string: new ee()
    };
  }
  function Gr(S) {
    return Vr(this, S).delete(S);
  }
  function ve(S) {
    return Vr(this, S).get(S);
  }
  function Jt(S) {
    return Vr(this, S).has(S);
  }
  function Ao(S, M) {
    return Vr(this, S).set(S, M), this;
  }
  yt.prototype.clear = er, yt.prototype.delete = Gr, yt.prototype.get = ve, yt.prototype.has = Jt, yt.prototype.set = Ao;
  function tr(S) {
    this.__data__ = new pe(S);
  }
  function Eo() {
    this.__data__ = new pe();
  }
  function Xn(S) {
    return this.__data__.delete(S);
  }
  function Nn(S) {
    return this.__data__.get(S);
  }
  function mn(S) {
    return this.__data__.has(S);
  }
  function Ns(S, M) {
    var G = this.__data__;
    if (G instanceof pe) {
      var me = G.__data__;
      if (!yn || me.length < n - 1)
        return me.push([S, M]), this;
      G = this.__data__ = new yt(me);
    }
    return G.set(S, M), this;
  }
  tr.prototype.clear = Eo, tr.prototype.delete = Xn, tr.prototype.get = Nn, tr.prototype.has = mn, tr.prototype.set = Ns;
  function ko(S, M) {
    var G = Bo(S) || ws(S) ? Zt(S.length, String) : [], me = G.length, Rt = !!me;
    for (var kn in S)
      Ie.call(S, kn) && !(Rt && (kn == "length" || ga(kn, me))) && G.push(kn);
    return G;
  }
  function wi(S, M, G) {
    var me = S[M];
    (!(Ie.call(S, M) && To(me, G)) || G === void 0 && !(M in S)) && (S[M] = G);
  }
  function Mn(S, M) {
    for (var G = S.length; G--; )
      if (To(S[G][0], M))
        return G;
    return -1;
  }
  function nr(S, M) {
    return S && ys(M, xe(M), S);
  }
  function ds(S, M, G, me, Rt, kn, br) {
    var $n;
    if (me && ($n = kn ? me(S, Rt, kn, br) : me(S)), $n !== void 0)
      return $n;
    if (!Y(S))
      return S;
    var l = Bo(S);
    if (l) {
      if ($n = xi(S), !M)
        return gs(S, $n);
    } else {
      var p = rr(S), y = p == h || p == d;
      if (V(S))
        return Ms(S, M);
      if (p == v || p == s || y && !kn) {
        if (z(S))
          return kn ? S : {};
        if ($n = Os(y ? {} : S), !M)
          return bi(S, nr($n, S));
      } else {
        if (!F[p])
          return kn ? S : {};
        $n = Co(S, p, ds, M);
      }
    }
    br || (br = new tr());
    var f = br.get(S);
    if (f)
      return f;
    if (br.set(S, $n), !l)
      var j = G ? Us(S) : xe(S);
    return Pt(j || S, function(ae, Se) {
      j && (Se = ae, ae = S[Se]), wi($n, Se, ds(ae, M, G, me, Se, S, br));
    }), $n;
  }
  function Kr(S) {
    return Y(S) ? Vn(S) : {};
  }
  function Yn(S, M, G) {
    var me = M(S);
    return Bo(S) ? me : En(me, G(S));
  }
  function $o(S) {
    return Ze.call(S);
  }
  function Io(S) {
    if (!Y(S) || Xr(S))
      return !1;
    var M = te(S) || z(S) ? Ye : Xe;
    return M.test(Dn(S));
  }
  function fs(S) {
    if (!Si(S))
      return mr(S);
    var M = [];
    for (var G in Object(S))
      Ie.call(S, G) && G != "constructor" && M.push(G);
    return M;
  }
  function Ms(S, M) {
    if (M)
      return S.slice();
    var G = new S.constructor(S.length);
    return S.copy(G), G;
  }
  function hs(S) {
    var M = new S.constructor(S.byteLength);
    return new pn(M).set(new pn(S)), M;
  }
  function ln(S, M) {
    var G = M ? hs(S.buffer) : S.buffer;
    return new S.constructor(G, S.byteOffset, S.byteLength);
  }
  function ps(S, M, G) {
    var me = M ? G(H(S), !0) : H(S);
    return lt(me, Pe, new S.constructor());
  }
  function mi(S) {
    var M = new S.constructor(S.source, ue.exec(S));
    return M.lastIndex = S.lastIndex, M;
  }
  function Lo(S, M, G) {
    var me = M ? G(se(S), !0) : se(S);
    return lt(me, _e, new S.constructor());
  }
  function Ps(S) {
    return J ? Object(J.call(S)) : {};
  }
  function _s(S, M) {
    var G = M ? hs(S.buffer) : S.buffer;
    return new S.constructor(G, S.byteOffset, S.length);
  }
  function gs(S, M) {
    var G = -1, me = S.length;
    for (M || (M = Array(me)); ++G < me; )
      M[G] = S[G];
    return M;
  }
  function ys(S, M, G, me) {
    G || (G = {});
    for (var Rt = -1, kn = M.length; ++Rt < kn; ) {
      var br = M[Rt], $n = void 0;
      wi(G, br, $n === void 0 ? S[br] : $n);
    }
    return G;
  }
  function bi(S, M) {
    return ys(S, jt(S), M);
  }
  function Us(S) {
    return Yn(S, xe, jt);
  }
  function Vr(S, M) {
    var G = S.__data__;
    return Hs(M) ? G[typeof M == "string" ? "string" : "hash"] : G.map;
  }
  function Lr(S, M) {
    var G = kt(S, M);
    return Io(G) ? G : void 0;
  }
  var jt = Ir ? Q(Ir, Object) : $e, rr = $o;
  (bt && rr(new bt(new ArrayBuffer(1))) != X || yn && rr(new yn()) != m || Dt && rr(Dt.resolve()) != x || wn && rr(new wn()) != B || Et && rr(new Et()) != T) && (rr = function(S) {
    var M = Ze.call(S), G = M == v ? S.constructor : void 0, me = G ? Dn(G) : void 0;
    if (me)
      switch (me) {
        case zr:
          return X;
        case us:
          return m;
        case E:
          return x;
        case O:
          return B;
        case K:
          return T;
      }
    return M;
  });
  function xi(S) {
    var M = S.length, G = S.constructor(M);
    return M && typeof S[0] == "string" && Ie.call(S, "index") && (G.index = S.index, G.input = S.input), G;
  }
  function Os(S) {
    return typeof S.constructor == "function" && !Si(S) ? Kr(gn(S)) : {};
  }
  function Co(S, M, G, me) {
    var Rt = S.constructor;
    switch (M) {
      case _:
        return hs(S);
      case a:
      case c:
        return new Rt(+S);
      case X:
        return ln(S, me);
      case ce:
      case ne:
      case q:
      case b:
      case I:
      case N:
      case P:
      case W:
      case R:
        return _s(S, me);
      case m:
        return ps(S, me, G);
      case w:
      case U:
        return new Rt(S);
      case L:
        return mi(S);
      case B:
        return Lo(S, me, G);
      case A:
        return Ps(S);
    }
  }
  function ga(S, M) {
    return M = M ?? o, !!M && (typeof S == "number" || C.test(S)) && S > -1 && S % 1 == 0 && S < M;
  }
  function Hs(S) {
    var M = typeof S;
    return M == "string" || M == "number" || M == "symbol" || M == "boolean" ? S !== "__proto__" : S === null;
  }
  function Xr(S) {
    return !!St && St in S;
  }
  function Si(S) {
    var M = S && S.constructor, G = typeof M == "function" && M.prototype || Ne;
    return S === G;
  }
  function Dn(S) {
    if (S != null) {
      try {
        return Ke.call(S);
      } catch {
      }
      try {
        return S + "";
      } catch {
      }
    }
    return "";
  }
  function vi(S) {
    return ds(S, !0, !0);
  }
  function To(S, M) {
    return S === M || S !== S && M !== M;
  }
  function ws(S) {
    return k(S) && Ie.call(S, "callee") && (!$t.call(S, "callee") || Ze.call(S) == s);
  }
  var Bo = Array.isArray;
  function g(S) {
    return S != null && Te(S.length) && !te(S);
  }
  function k(S) {
    return ke(S) && g(S);
  }
  var V = Rr || st;
  function te(S) {
    var M = Y(S) ? Ze.call(S) : "";
    return M == h || M == d;
  }
  function Te(S) {
    return typeof S == "number" && S > -1 && S % 1 == 0 && S <= o;
  }
  function Y(S) {
    var M = typeof S;
    return !!S && (M == "object" || M == "function");
  }
  function ke(S) {
    return !!S && typeof S == "object";
  }
  function xe(S) {
    return g(S) ? ko(S) : fs(S);
  }
  function $e() {
    return [];
  }
  function st() {
    return !1;
  }
  e.exports = vi;
})(pl, pl.exports);
var Vv = pl.exports;
const Lw = /* @__PURE__ */ ny(Vv);
var md;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(md || (md = {}));
function Xv(e, t) {
  return { type: md.Address, version: e, hash160: t };
}
function Yv(e) {
  return fi.c32address(e.version, e.hash160);
}
const qv = (e) => bv(xw(e)), Wv = (e) => Ue(qv(e));
nn.hmacSha256Sync = (e, ...t) => {
  const n = mw.create(xw, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Zv(e, t = "mainnet") {
  t = pw(t), e = typeof e == "string" ? mt(e) : e;
  const n = dv(Es.P2PKH, t), r = Xv(n, Wv(e));
  return Yv(r);
}
function Jv(e, t) {
  const n = Bn.decodeToken(e), r = n.payload;
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
  const o = r.issuer.publicKey, s = Zv(o);
  if (t !== o) {
    if (t !== s) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new Bn.TokenVerifier(n.header.alg, o);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(e))
    throw new Error("Token verification failed");
  return n;
}
function Qv(e, t = null) {
  let n;
  t ? n = Jv(e, t) : n = Bn.decodeToken(e);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const o = n.payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    o.hasOwnProperty("claim") && (r = o.claim);
  }
  return r;
}
const Qp = "_blockstackDidCheckEchoReply", eA = "echoReply", tA = "authContinuation";
function nA(e) {
  return e ? (/^[?#]/.test(e) ? e.slice(1) : e).split("&").reduce((n, r) => {
    const [o, s] = r.split("=");
    return n[o] = s ? decodeURIComponent(s.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function rA() {
  let e;
  if (typeof self < "u")
    e = self;
  else if (typeof window < "u")
    e = window;
  else
    return !1;
  if (!e.location || !e.localStorage)
    return !1;
  const t = e[Qp];
  if (typeof t == "boolean")
    return t;
  const n = nA(e.location.search), r = n[eA];
  if (r) {
    e[Qp] = !0;
    const o = `echo-reply-${r}`;
    return e.localStorage.setItem(o, "success"), e.setTimeout(() => {
      const s = n[tA];
      e.location.href = s;
    }, 10), !0;
  }
  return !1;
}
class bd {
  constructor(t) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), t && t.appConfig)
      this.appConfig = t.appConfig;
    else if (n)
      this.appConfig = new dy();
    else
      throw new v1("You need to specify options.appConfig");
    t && t.sessionStore ? this.store = t.sessionStore : n ? t ? this.store = new Pp(t.sessionOptions) : this.store = new Pp() : t ? this.store = new Mp(t.sessionOptions) : this.store = new Mp();
  }
  makeAuthRequestToken(t, n, r, o, s, i = E1().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new od("Missing AppConfig");
    return t = t || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), o = o || c.scopes, s = s || c.appDomain, RS(t, n, r, o, s, i, a);
  }
  generateAndStoreTransitKey() {
    const t = this.store.getSessionData(), n = jS();
    return t.transitKey = n, this.store.setSessionData(t), n;
  }
  getAuthResponseToken() {
    var r;
    const t = (r = pf("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(t).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (rA())
        return _i.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (t) {
      _i.error(`Error checking for protocol echo reply isSignInPending: ${t}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(t = this.getAuthResponseToken(), n = X1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new dc("Existing user session found.");
    const o = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const s = Bn.decodeToken(t).payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await XS(t))
      throw new dc("Invalid authentication response.");
    let a = s.private_key, c = s.core_token;
    if (xu(s.version, "1.1.0"))
      if (o !== void 0 && o != null) {
        if (s.private_key !== void 0 && s.private_key !== null)
          try {
            a = await Bp(o, s.private_key);
          } catch {
            if (_i.warn("Failed decryption of appPrivateKey, will try to use as given"), !nn.isValidPrivateKey(s.private_key))
              throw new dc("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Bp(o, c);
          } catch {
            _i.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new dc("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = U1, h;
    xu(s.version, "1.2.0") && s.hubUrl !== null && s.hubUrl !== void 0 && (u = s.hubUrl), xu(s.version, "1.3.0") && s.associationToken !== null && s.associationToken !== void 0 && (h = s.associationToken);
    const d = {
      profile: s.profile,
      email: s.email,
      decentralizedID: s.iss,
      identityAddress: dw(s.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: t,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: s.appPrivateKeyFromWalletSalt,
      coreNode: s.blockstackAPIUrl,
      gaiaAssociationToken: h
    }, m = s.profile_url;
    if (!d.profile && m) {
      const w = await n(m);
      if (!w.ok)
        d.profile = Object.assign({}, b1);
      else {
        const v = await w.text(), x = JSON.parse(v);
        d.profile = Qv(x[0].token);
      }
    } else
      d.profile = s.profile;
    return r.userData = d, this.store.setSessionData(r), d;
  }
  loadUserData() {
    const t = this.store.getSessionData().userData;
    if (!t)
      throw new od("No user data found. Did the user sign in?");
    return t;
  }
  encryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Ux(t, r);
  }
  decryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Ox(t, r);
  }
  signUserOut(t) {
    this.store.deleteSessionData(), t && typeof location < "u" && location.href && (location.href = t);
  }
}
bd.prototype.makeAuthRequest = bd.prototype.makeAuthRequestToken;
const sA = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], oA = (e = []) => {
  if (typeof window > "u")
    return [];
  const t = sA(), n = e.filter((r) => t.find((s) => s.id === r.id) ? !1 : !!Yl(r.id));
  return t.concat(n);
}, Yl = (e) => e == null ? void 0 : e.split(".").reduce((t, n) => t == null ? void 0 : t[n], window), Cw = "STX_PROVIDER", Zo = () => typeof window > "u" ? null : window.localStorage.getItem(Cw), iA = (e) => {
  typeof window < "u" && window.localStorage.setItem(Cw, e);
}, aA = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function cA(e, t) {
  const n = {};
  return Object.assign(n, aA, t), await fetch(e, n);
}
function lA(e) {
  let t = cA, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function uA(...e) {
  const { fetchLib: t, middlewares: n } = lA(e);
  return async (o, s) => {
    let i = { url: o, init: s ?? {} };
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
var ea;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(ea || (ea = {}));
var Jo;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Jo || (Jo = {}));
var e0;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(e0 || (e0 = {}));
const dA = "https://api.mainnet.hiro.so", fA = "https://api.testnet.hiro.so", hA = "http://localhost:3999", pA = ["mainnet", "testnet", "devnet", "mocknet"];
class Qo {
  constructor(t) {
    this.version = Jo.Mainnet, this.chainId = ea.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Jo.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, o) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(o)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, o) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${o}?proof=0`, this.getMapEntryUrl = (n, r, o) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${o}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? uA();
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
Qo.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new xd();
    case "testnet":
      return new Sd();
    case "devnet":
      return new gA();
    case "mocknet":
      return new Tw();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${pA.join(", ")}`);
  }
};
Qo.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : Qo.fromName(e);
class xd extends Qo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? dA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Jo.Mainnet, this.chainId = ea.Mainnet;
  }
}
class Sd extends Qo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? fA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Jo.Testnet, this.chainId = ea.Testnet;
  }
}
class Tw extends Qo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? hA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Jo.Testnet, this.chainId = ea.Testnet;
  }
}
const gA = Tw;
var ei;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(ei || (ei = {}));
var gl;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(gl || (gl = {}));
ei.Mainnet;
var ti;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(ti || (ti = {}));
var ni;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ni || (ni = {}));
ti.Mainnet;
const yA = {
  chainId: ei.Mainnet,
  transactionVersion: ti.Mainnet,
  peerNetworkId: gl.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ni.MainnetSingleSig,
    multiSig: ni.MainnetMultiSig
  },
  client: { baseUrl: cy }
}, vd = {
  chainId: ei.Testnet,
  transactionVersion: ti.Testnet,
  peerNetworkId: gl.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ni.TestnetSingleSig,
    multiSig: ni.TestnetMultiSig
  },
  client: { baseUrl: ly }
}, Wc = {
  ...vd,
  addressVersion: { ...vd.addressVersion },
  magicBytes: "id",
  client: { baseUrl: uy }
}, wA = {
  ...Wc,
  addressVersion: { ...Wc.addressVersion },
  client: { ...Wc.client }
};
function mA(e) {
  switch (e) {
    case "mainnet":
      return yA;
    case "testnet":
      return vd;
    case "devnet":
      return Wc;
    case "mocknet":
      return wA;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function bA(e) {
  return typeof e == "string" ? mA(e) : e;
}
function xA(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const t0 = /* @__PURE__ */ new Map();
function Bw(e, t) {
  const n = t0.get(e);
  if (n !== void 0)
    return n(t);
  const r = xA(e);
  return t0.set(e, r), Bw(e, t);
}
let Ut = class {
  constructor(t) {
    this.consumed = 0, this.source = typeof t == "string" ? mt(t) : t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return z1(this.readBytes(4), 0);
  }
  readUInt8() {
    return j1(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return D1(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = Ue(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = Ue(n);
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
    if (Bw(t, r))
      return r;
    throw n(r);
  }
};
const SA = 128, vA = 128, Nw = 16, Ro = 32, Ad = 80, ql = 65, AA = 32, EA = 64, yl = 34, kA = 1 + 16 * 1024 * 1024, $A = 165, IA = 16, LA = 16, CA = 20, TA = LA + 2 + CA, BA = TA + 4, NA = kA + ($A + IA * BA);
var At;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(At || (At = {}));
var Ed;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(Ed || (Ed = {}));
var lr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(lr || (lr = {}));
const Iu = ["onChainOnly", "offChainOnly", "any"];
Iu[0] + "", lr.OnChainOnly, Iu[1] + "", lr.OffChainOnly, Iu[2] + "", lr.Any, lr.OnChainOnly + "", lr.OnChainOnly, lr.OffChainOnly + "", lr.OffChainOnly, lr.Any + "", lr.Any;
var wl;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(wl || (wl = {}));
var zt;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(zt || (zt = {}));
var en;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(en || (en = {}));
var Nt;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Nt || (Nt = {}));
var qt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(qt || (qt = {}));
var Pa;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Pa || (Pa = {}));
var kd;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(kd || (kd = {}));
var $d;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})($d || ($d = {}));
var zn;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(zn || (zn = {}));
var n0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(n0 || (n0 = {}));
var Id;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Id || (Id = {}));
var Pr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Pr || (Pr = {}));
var r0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(r0 || (r0 = {}));
let Wl = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ui = class extends Wl {
  constructor(t) {
    super(t);
  }
}, jn = class extends Wl {
  constructor(t) {
    super(t);
  }
}, ml = class extends Wl {
  constructor(t) {
    super(t);
  }
}, Oo = class extends Wl {
  constructor(t) {
    super(t);
  }
};
function Ld(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function MA(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Mw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function PA(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ld(e.outputLen), Ld(e.blockLen);
}
function _A(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function UA(e, t) {
  Mw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ho = {
  number: Ld,
  bool: MA,
  bytes: Mw,
  hash: PA,
  exists: _A,
  output: UA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Lu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Wr = (e, t) => e << 32 - t | e >>> t, OA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!OA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function HA(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Of(e) {
  if (typeof e == "string" && (e = HA(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Pw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function hi(e) {
  const t = (r) => e().update(Of(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let _w = class extends Pw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Ho.hash(t);
    const r = Of(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, s = new Uint8Array(o);
    s.set(r.length > o ? t.create().update(r).digest() : r);
    for (let i = 0; i < s.length; i++)
      s[i] ^= 54;
    this.iHash.update(s), this.oHash = t.create();
    for (let i = 0; i < s.length; i++)
      s[i] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(t) {
    return Ho.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Ho.exists(this), Ho.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = o, t.destroyed = s, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Uw = (e, t, n) => new _w(e, t).update(n).digest();
Uw.create = (e, t) => new _w(e, t);
function DA(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Hf = class extends Pw {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Lu(this.buffer);
  }
  update(t) {
    Ho.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = Of(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = Lu(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Ho.exists(this), Ho.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    DA(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Lu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.length = o, t.pos = a, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
};
const FA = (e, t, n) => e & t ^ ~e & n, jA = (e, t, n) => e & t ^ e & n ^ t & n, RA = new Uint32Array([
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
]), Js = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Qs = new Uint32Array(64);
let Ow = class extends Hf {
  constructor() {
    super(64, 32, 8, !1), this.A = Js[0] | 0, this.B = Js[1] | 0, this.C = Js[2] | 0, this.D = Js[3] | 0, this.E = Js[4] | 0, this.F = Js[5] | 0, this.G = Js[6] | 0, this.H = Js[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      Qs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = Qs[d - 15], w = Qs[d - 2], v = Wr(m, 7) ^ Wr(m, 18) ^ m >>> 3, x = Wr(w, 17) ^ Wr(w, 19) ^ w >>> 10;
      Qs[d] = x + Qs[d - 7] + v + Qs[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = Wr(a, 6) ^ Wr(a, 11) ^ Wr(a, 25), w = h + m + FA(a, c, u) + RA[d] + Qs[d] | 0, x = (Wr(r, 2) ^ Wr(r, 13) ^ Wr(r, 22)) + jA(r, o, s) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = s, s = o, o = r, r = w + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, o, s, i, a, c, u, h);
  }
  roundClean() {
    Qs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, zA = class extends Ow {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Df = hi(() => new Ow());
hi(() => new zA());
const GA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Hw = Uint8Array.from({ length: 16 }, (e, t) => t), KA = Hw.map((e) => (9 * e + 5) % 16);
let Ff = [Hw], jf = [KA];
for (let e = 0; e < 4; e++)
  for (let t of [Ff, jf])
    t.push(t[e].map((n) => GA[n]));
const Dw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), VA = Ff.map((e, t) => e.map((n) => Dw[t][n])), XA = jf.map((e, t) => e.map((n) => Dw[t][n])), YA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), qA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ec = (e, t) => e << t | e >>> 32 - t;
function s0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const kc = new Uint32Array(16);
let WA = class extends Hf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: o, h4: s } = this;
    return [t, n, r, o, s];
  }
  set(t, n, r, o, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let w = 0; w < 16; w++, n += 4)
      kc[w] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, m = d;
    for (let w = 0; w < 5; w++) {
      const v = 4 - w, x = YA[w], L = qA[w], B = Ff[w], U = jf[w], A = VA[w], T = XA[w];
      for (let _ = 0; _ < 16; _++) {
        const X = Ec(r + s0(w, s, a, u) + kc[B[_]] + x, A[_]) + d | 0;
        r = d, d = u, u = Ec(a, 10) | 0, a = s, s = X;
      }
      for (let _ = 0; _ < 16; _++) {
        const X = Ec(o + s0(v, i, c, h) + kc[U[_]] + L, T[_]) + m | 0;
        o = m, m = h, h = Ec(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + m | 0, this.h3 + d + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    kc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const ZA = hi(() => new WA()), $c = BigInt(2 ** 32 - 1), Cd = BigInt(32);
function Fw(e, t = !1) {
  return t ? { h: Number(e & $c), l: Number(e >> Cd & $c) } : { h: Number(e >> Cd & $c) | 0, l: Number(e & $c) | 0 };
}
function JA(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = Fw(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const QA = (e, t) => BigInt(e >>> 0) << Cd | BigInt(t >>> 0), eE = (e, t, n) => e >>> n, tE = (e, t, n) => e << 32 - n | t >>> n, nE = (e, t, n) => e >>> n | t << 32 - n, rE = (e, t, n) => e << 32 - n | t >>> n, sE = (e, t, n) => e << 64 - n | t >>> n - 32, oE = (e, t, n) => e >>> n - 32 | t << 64 - n, iE = (e, t) => t, aE = (e, t) => e, cE = (e, t, n) => e << n | t >>> 32 - n, lE = (e, t, n) => t << n | e >>> 32 - n, uE = (e, t, n) => t << n - 32 | e >>> 64 - n, dE = (e, t, n) => e << n - 32 | t >>> 64 - n;
function fE(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const hE = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), pE = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, gE = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), yE = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, wE = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), mE = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, et = {
  fromBig: Fw,
  split: JA,
  toBig: QA,
  shrSH: eE,
  shrSL: tE,
  rotrSH: nE,
  rotrSL: rE,
  rotrBH: sE,
  rotrBL: oE,
  rotr32H: iE,
  rotr32L: aE,
  rotlSH: cE,
  rotlSL: lE,
  rotlBH: uE,
  rotlBL: dE,
  add: fE,
  add3L: hE,
  add3H: pE,
  add4L: gE,
  add4H: yE,
  add5H: mE,
  add5L: wE
}, [bE, xE] = et.split([
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
].map((e) => BigInt(e))), eo = new Uint32Array(80), to = new Uint32Array(80);
let Zl = class extends Hf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: m, Gh: w, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, o, s, i, a, c, u, h, d, m, w, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c, u, h, d, m, w, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      eo[A] = t.getUint32(n), to[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = eo[A - 15] | 0, _ = to[A - 15] | 0, X = et.rotrSH(T, _, 1) ^ et.rotrSH(T, _, 8) ^ et.shrSH(T, _, 7), ce = et.rotrSL(T, _, 1) ^ et.rotrSL(T, _, 8) ^ et.shrSL(T, _, 7), ne = eo[A - 2] | 0, q = to[A - 2] | 0, b = et.rotrSH(ne, q, 19) ^ et.rotrBH(ne, q, 61) ^ et.shrSH(ne, q, 6), I = et.rotrSL(ne, q, 19) ^ et.rotrBL(ne, q, 61) ^ et.shrSL(ne, q, 6), N = et.add4L(ce, I, to[A - 7], to[A - 16]), P = et.add4H(N, X, b, eo[A - 7], eo[A - 16]);
      eo[A] = P | 0, to[A] = N | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: m, Fh: w, Fl: v, Gh: x, Gl: L, Hh: B, Hl: U } = this;
    for (let A = 0; A < 80; A++) {
      const T = et.rotrSH(d, m, 14) ^ et.rotrSH(d, m, 18) ^ et.rotrBH(d, m, 41), _ = et.rotrSL(d, m, 14) ^ et.rotrSL(d, m, 18) ^ et.rotrBL(d, m, 41), X = d & w ^ ~d & x, ce = m & v ^ ~m & L, ne = et.add5L(U, _, ce, xE[A], to[A]), q = et.add5H(ne, B, T, X, bE[A], eo[A]), b = ne | 0, I = et.rotrSH(r, o, 28) ^ et.rotrBH(r, o, 34) ^ et.rotrBH(r, o, 39), N = et.rotrSL(r, o, 28) ^ et.rotrBL(r, o, 34) ^ et.rotrBL(r, o, 39), P = r & s ^ r & a ^ s & a, W = o & i ^ o & c ^ i & c;
      B = x | 0, U = L | 0, x = w | 0, L = v | 0, w = d | 0, v = m | 0, { h: d, l: m } = et.add(u | 0, h | 0, q | 0, b | 0), u = a | 0, h = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const R = et.add3L(b, N, W);
      r = et.add3H(R, q, I, P), o = R | 0;
    }
    ({ h: r, l: o } = et.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = et.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = et.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: m } = et.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: w, l: v } = et.add(this.Fh | 0, this.Fl | 0, w | 0, v | 0), { h: x, l: L } = et.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: B, l: U } = et.add(this.Hh | 0, this.Hl | 0, B | 0, U | 0), this.set(r, o, s, i, a, c, u, h, d, m, w, v, x, L, B, U);
  }
  roundClean() {
    eo.fill(0), to.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, SE = class extends Zl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, vE = class extends Zl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, AE = class extends Zl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
hi(() => new Zl());
hi(() => new SE());
const EE = hi(() => new vE());
hi(() => new AE());
var pt;
(function(e) {
  e.Int = "int", e.UInt = "uint", e.Buffer = "buffer", e.BoolTrue = "true", e.BoolFalse = "false", e.PrincipalStandard = "address", e.PrincipalContract = "contract", e.ResponseOk = "ok", e.ResponseErr = "err", e.OptionalNone = "none", e.OptionalSome = "some", e.List = "list", e.Tuple = "tuple", e.StringASCII = "ascii", e.StringUTF8 = "utf8";
})(pt || (pt = {}));
var hn;
(function(e) {
  e[e.int = 0] = "int", e[e.uint = 1] = "uint", e[e.buffer = 2] = "buffer", e[e.true = 3] = "true", e[e.false = 4] = "false", e[e.address = 5] = "address", e[e.contract = 6] = "contract", e[e.ok = 7] = "ok", e[e.err = 8] = "err", e[e.none = 9] = "none", e[e.some = 10] = "some", e[e.list = 11] = "list", e[e.tuple = 12] = "tuple", e[e.ascii = 13] = "ascii", e[e.utf8 = 14] = "utf8";
})(hn || (hn = {}));
function Rf(e) {
  return hn[e];
}
const kE = () => ({ type: pt.BoolTrue }), $E = () => ({ type: pt.BoolFalse }), IE = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: pt.Buffer, value: Ue(e) };
}, o0 = BigInt("0xffffffffffffffffffffffffffffffff"), LE = BigInt(0), i0 = BigInt("0x7fffffffffffffffffffffffffffffff"), a0 = BigInt("-170141183460469231731687303715884105728"), CE = (e) => {
  typeof e == "string" && e.toLowerCase().startsWith("0x") && (e = ad(mt(e))), Qn(e, Uint8Array) && (e = ad(e));
  const t = Hn(e);
  if (t > i0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${i0}`);
  if (t < a0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${a0}`);
  return { type: pt.Int, value: t };
}, TE = (e) => {
  const t = Hn(e);
  if (t < LE)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > o0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${o0}`);
  return { type: pt.UInt, value: t };
};
function BE(e) {
  return { type: pt.List, value: e };
}
function jw() {
  return { type: pt.OptionalNone };
}
function Rw(e) {
  return { type: pt.OptionalSome, value: e };
}
var we;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(we || (we = {}));
function NE() {
  return {
    type: we.Address,
    version: ni.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function c0(e) {
  if (e && Zw(e, yl))
    throw new Error(`Memo exceeds maximum length of ${yl} bytes`);
  return { type: we.MemoString, content: e };
}
function zf(e, t) {
  return {
    type: we.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function Td(e) {
  if (mt(e).byteLength != ql)
    throw Error("Invalid signature");
  return {
    type: we.MessageSignature,
    data: e
  };
}
function ME(e, t, n) {
  return typeof e == "string" && (e = qE(e)), typeof n == "string" && (n = c0(n)), {
    type: we.Payload,
    payloadType: At.TokenTransfer,
    recipient: e,
    amount: Hn(t),
    memo: n ?? c0("")
  };
}
function PE(e, t, n, r) {
  return typeof t == "string" && (t = Dr(t)), typeof n == "string" && (n = Dr(n)), {
    type: we.Payload,
    payloadType: At.ContractCall,
    contractAddress: typeof e == "string" ? vo(e) : e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function _E(e) {
  return Dr(e, 4, 1e5);
}
function l0(e, t, n) {
  return typeof e == "string" && (e = Dr(e)), typeof t == "string" && (t = _E(t)), typeof n == "number" ? {
    type: we.Payload,
    payloadType: At.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: we.Payload,
    payloadType: At.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function UE() {
  return { type: we.Payload, payloadType: At.PoisonMicroblock };
}
function u0(e, t) {
  if (e.byteLength != Ro)
    throw Error(`Coinbase buffer size must be ${Ro} bytes`);
  return t != null ? {
    type: we.Payload,
    payloadType: At.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: we.Payload,
    payloadType: At.Coinbase,
    coinbaseBytes: e
  };
}
function OE(e, t, n) {
  if (e.byteLength != Ro)
    throw Error(`Coinbase buffer size must be ${Ro} bytes`);
  if (n.byteLength != Ad)
    throw Error(`VRF proof buffer size must be ${Ad} bytes`);
  return {
    type: we.Payload,
    payloadType: At.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === pt.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
function HE(e, t, n, r, o, s, i) {
  return {
    type: we.Payload,
    payloadType: At.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: o,
    cause: s,
    publicKeyHash: i
  };
}
function Dr(e, t, n) {
  const r = t || 1, o = n || SA;
  if (Zw(e, o))
    throw new Error(`String length exceeds maximum bytes ${o}`);
  return {
    type: we.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: o
  };
}
function DE(e, t, n) {
  return {
    type: we.Asset,
    address: vo(e),
    contractName: Dr(t),
    assetName: Dr(n)
  };
}
function vo(e) {
  const t = fi.c32addressDecode(e);
  return {
    type: we.Address,
    version: t[0],
    hash160: t[1]
  };
}
function FE(e, t) {
  const n = vo(e), r = Dr(t);
  return {
    type: we.Principal,
    prefix: zn.Contract,
    address: n,
    contractName: r
  };
}
function jE(e) {
  const t = vo(e);
  return {
    type: we.Principal,
    prefix: zn.Standard,
    address: t
  };
}
function Oi(e, t) {
  return {
    pubKeyEncoding: e,
    type: we.TransactionAuthField,
    contents: t
  };
}
function vs(e) {
  switch (e.type) {
    case we.Address:
      return rc(e);
    case we.Principal:
      return zw(e);
    case we.LengthPrefixedString:
      return na(e);
    case we.MemoString:
      return zE(e);
    case we.Asset:
      return Kw(e);
    case we.PostCondition:
      return Xw(e);
    case we.PublicKey:
      return Md(e);
    case we.LengthPrefixedList:
      return Gf(e);
    case we.Payload:
      return Yw(e);
    case we.TransactionAuthField:
      return YE(e);
    case we.MessageSignature:
      return Kf(e);
  }
}
function rc(e) {
  const t = [];
  return t.push(mt(Za(e.version, 1))), t.push(mt(e.hash160)), an(t);
}
function ta(e) {
  const t = Qn(e, Ut) ? e : new Ut(e), n = Ul(Ue(t.readBytes(1))), r = Ue(t.readBytes(20));
  return { type: we.Address, version: n, hash160: r };
}
function zw(e) {
  const t = [];
  return t.push(e.prefix), (e.prefix === zn.Standard || e.prefix === zn.Contract) && t.push(rc(e.address)), e.prefix === zn.Contract && t.push(na(e.contractName)), an(t);
}
function RE(e) {
  const t = Qn(e, Ut) ? e : new Ut(e), n = t.readUInt8Enum(zn, (s) => {
    throw new jn(`Unexpected Principal payload type: ${s}`);
  });
  if (n === zn.Origin)
    return { type: we.Principal, prefix: n };
  const r = ta(t);
  if (n === zn.Standard)
    return { type: we.Principal, prefix: n, address: r };
  const o = Er(t);
  return {
    type: we.Principal,
    prefix: n,
    address: r,
    contractName: o
  };
}
function na(e) {
  const t = [], n = ci(e.content), r = n.byteLength;
  return t.push(mt(Za(r, e.lengthPrefixBytes))), t.push(n), an(t);
}
function Er(e, t, n) {
  t = t || 1;
  const r = Qn(e, Ut) ? e : new Ut(e), o = Ul(Ue(r.readBytes(t))), s = Ja(r.readBytes(o));
  return Dr(s, t, n ?? 128);
}
function zE(e) {
  const t = [], n = ci(e.content), r = wk(Ue(n), yl * 2);
  return t.push(mt(r)), an(t);
}
function Gw(e) {
  const t = Qn(e, Ut) ? e : new Ut(e);
  let n = Ja(t.readBytes(yl));
  return n = n.replace(/\u0000*$/, ""), { type: we.MemoString, content: n };
}
function Kw(e) {
  const t = [];
  return t.push(rc(e.address)), t.push(na(e.contractName)), t.push(na(e.assetName)), an(t);
}
function Bd(e) {
  const t = Qn(e, Ut) ? e : new Ut(e);
  return {
    type: we.Asset,
    address: ta(t),
    contractName: Er(t),
    assetName: Er(t)
  };
}
function Gf(e) {
  const t = e.values, n = [];
  n.push(mt(Za(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(vs(r));
  return an(n);
}
function Vw(e, t, n) {
  const r = Qn(e, Ut) ? e : new Ut(e), o = Ul(Ue(r.readBytes(4))), s = [];
  for (let i = 0; i < o; i++)
    switch (t) {
      case we.Address:
        s.push(ta(r));
        break;
      case we.LengthPrefixedString:
        s.push(Er(r));
        break;
      case we.MemoString:
        s.push(Gw(r));
        break;
      case we.Asset:
        s.push(Bd(r));
        break;
      case we.PostCondition:
        s.push(KE(r));
        break;
      case we.PublicKey:
        s.push(Pd(r));
        break;
      case we.TransactionAuthField:
        s.push(XE(r));
        break;
    }
  return zf(s, n);
}
function GE(e) {
  return Ue(Xw(e));
}
function Xw(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(zw(e.principal)), (e.conditionType === zt.Fungible || e.conditionType === zt.NonFungible) && t.push(Kw(e.asset)), e.conditionType === zt.NonFungible && t.push(rs(e.assetName)), t.push(e.conditionCode), e.conditionType === zt.STX || e.conditionType === zt.Fungible || e.conditionType === zt.Staking) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Ui("The post-condition amount may not be larger than 8 bytes");
    t.push(xo(e.amount, 8));
  }
  return an(t);
}
function KE(e) {
  const t = Qn(e, Ut) ? e : new Ut(e), n = t.readUInt8Enum(zt, (a) => {
    throw new jn(`Could not read ${a} as PostConditionType`);
  }), r = RE(t);
  let o, s, i;
  switch (n) {
    case zt.STX:
      return o = t.readUInt8Enum(Pa, (c) => {
        throw new jn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ue(t.readBytes(8))}`), {
        type: we.PostCondition,
        conditionType: zt.STX,
        principal: r,
        conditionCode: o,
        amount: i
      };
    case zt.Fungible:
      return s = Bd(t), o = t.readUInt8Enum(Pa, (c) => {
        throw new jn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ue(t.readBytes(8))}`), {
        type: we.PostCondition,
        conditionType: zt.Fungible,
        principal: r,
        conditionCode: o,
        amount: i,
        asset: s
      };
    case zt.NonFungible:
      s = Bd(t);
      const a = es(t);
      return o = t.readUInt8Enum(kd, (c) => {
        throw new jn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: we.PostCondition,
        conditionType: zt.NonFungible,
        principal: r,
        conditionCode: o,
        asset: s,
        assetName: a
      };
    case zt.Staking:
      return o = t.readUInt8Enum(Pa, (c) => {
        throw new jn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ue(t.readBytes(8))}`), {
        type: we.PostCondition,
        conditionType: zt.Staking,
        principal: r,
        conditionCode: o,
        amount: i
      };
    case zt.PoX: {
      const c = t.readUInt8Enum($d, (u) => {
        throw new jn(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: we.PostCondition,
        conditionType: zt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function Yw(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case At.TokenTransfer:
      t.push(rs(e.recipient)), t.push(xo(e.amount, 8)), t.push(vs(e.memo));
      break;
    case At.ContractCall:
      t.push(vs(e.contractAddress)), t.push(vs(e.contractName)), t.push(vs(e.functionName));
      const n = new Uint8Array(4);
      Vo(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(rs(r));
      });
      break;
    case At.SmartContract:
      t.push(vs(e.contractName)), t.push(vs(e.codeBody));
      break;
    case At.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(vs(e.contractName)), t.push(vs(e.codeBody));
      break;
    case At.PoisonMicroblock:
      break;
    case At.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case At.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(rs(e.recipient));
      break;
    case At.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(rs(e.recipient ? Rw(e.recipient) : jw())), t.push(e.vrfProof);
      break;
    case At.TenureChange:
      t.push(mt(e.tenureHash)), t.push(mt(e.previousTenureHash)), t.push(mt(e.burnViewHash)), t.push(mt(e.previousTenureEnd)), t.push(Vo(new Uint8Array(4), e.previousTenureBlocks)), t.push(R1(new Uint8Array(1), e.cause)), t.push(mt(e.publicKeyHash));
      break;
  }
  return an(t);
}
function VE(e) {
  const t = Qn(e, Ut) ? e : new Ut(e);
  switch (t.readUInt8Enum(At, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case At.TokenTransfer:
      const r = es(t), o = Hn(t.readBytes(8)), s = Gw(t);
      return ME(r, o, s);
    case At.ContractCall:
      const i = ta(t), a = Er(t), c = Er(t), u = [], h = t.readUInt32BE();
      for (let T = 0; T < h; T++) {
        const _ = es(t);
        u.push(_);
      }
      return PE(i, a, c, u);
    case At.SmartContract:
      const d = Er(t), m = Er(t, 4, 1e5);
      return l0(d, m);
    case At.VersionedSmartContract: {
      const T = t.readUInt8Enum(Ed, (ce) => {
        throw new Error(`Cannot recognize ClarityVersion: ${ce}`);
      }), _ = Er(t), X = Er(t, 4, NA);
      return l0(_, X, T);
    }
    case At.PoisonMicroblock:
      return UE();
    case At.Coinbase: {
      const T = t.readBytes(Ro);
      return u0(T);
    }
    case At.CoinbaseToAltRecipient: {
      const T = t.readBytes(Ro), _ = es(t);
      return u0(T, _);
    }
    case At.NakamotoCoinbase: {
      const T = t.readBytes(Ro), _ = es(t), X = t.readBytes(Ad);
      return OE(T, _, X);
    }
    case At.TenureChange:
      const w = Ue(t.readBytes(20)), v = Ue(t.readBytes(20)), x = Ue(t.readBytes(20)), L = Ue(t.readBytes(32)), B = t.readUInt32BE(), U = t.readUInt8Enum(Id, (T) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${T}`);
      }), A = Ue(t.readBytes(20));
      return HE(w, v, x, L, B, U, A);
  }
}
function Nd(e) {
  const t = Qn(e, Ut) ? e : new Ut(e);
  return Td(Ue(t.readBytes(ql)));
}
function XE(e) {
  const t = Qn(e, Ut) ? e : new Ut(e), n = t.readUInt8Enum(Pr, (r) => {
    throw new jn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Pr.PublicKeyCompressed:
      return Oi(qt.Compressed, Pd(t));
    case Pr.PublicKeyUncompressed:
      return Oi(qt.Uncompressed, ua(Lk(Pd(t).data)));
    case Pr.SignatureCompressed:
      return Oi(qt.Compressed, Nd(t));
    case Pr.SignatureUncompressed:
      return Oi(qt.Uncompressed, Nd(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Kf(e) {
  return mt(e.data);
}
function YE(e) {
  const t = [];
  switch (e.contents.type) {
    case we.PublicKey:
      t.push(e.pubKeyEncoding === qt.Compressed ? Pr.PublicKeyCompressed : Pr.PublicKeyUncompressed), t.push(mt(Ik(e.contents.data)));
      break;
    case we.MessageSignature:
      t.push(e.pubKeyEncoding === qt.Compressed ? Pr.SignatureCompressed : Pr.SignatureUncompressed), t.push(Kf(e.contents));
      break;
  }
  return an(t);
}
function Md(e) {
  return e.data.slice();
}
function Pd(e) {
  const t = Qn(e, Ut) ? e : new Ut(e), n = t.readUInt8(), r = n === 4 ? EA : AA;
  return ua(an([n, t.readBytes(r)]));
}
function Vf(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Nt.P2PKH || t === Nt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Nt.P2WPKH || t === Nt.P2WSH || t === Nt.P2WSHNonSequential) && !r.map((o) => o.data).every(da))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Nt.P2PKH:
      return Ic(e, mk(r[0].data));
    case Nt.P2WPKH:
      return Ic(e, bk(r[0].data));
    case Nt.P2SH:
    case Nt.P2SHNonSequential:
      return Ic(e, xk(n, r.map(Md)));
    case Nt.P2WSH:
    case Nt.P2WSHNonSequential:
      return Ic(e, Sk(n, r.map(Md)));
  }
}
function Ic(e, t) {
  return { type: we.Address, version: e, hash160: t };
}
function Xf(e) {
  return fi.c32address(e.version, e.hash160);
}
function d0(e) {
  const [t, n, r] = e.split(/\.|::/);
  return DE(t, n, r);
}
function Sa(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return FE(t, n);
  } else
    return jE(e);
}
function qE(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return JE(t, n);
  } else
    return WE(e);
}
function WE(e) {
  const t = vo(e);
  return { type: pt.PrincipalStandard, value: Xf(t) };
}
function ZE(e) {
  return { type: pt.PrincipalStandard, value: Xf(e) };
}
function JE(e, t) {
  const n = vo(e), r = Dr(t);
  return qw(n, r);
}
function qw(e, t) {
  if (ci(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: pt.PrincipalContract,
    value: `${Xf(e)}.${t.content}`
  };
}
function QE(e) {
  return { type: pt.ResponseErr, value: e };
}
function ek(e) {
  return { type: pt.ResponseOk, value: e };
}
const tk = (e) => ({ type: pt.StringASCII, value: e }), nk = (e) => ({ type: pt.StringUTF8, value: e });
function rk(e) {
  for (const t in e)
    if (!vk(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: pt.Tuple, value: e };
}
function es(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new Ut(mt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new Ut(e) : t = e;
  switch (t.readUInt8Enum(hn, (r) => {
    throw new jn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case hn.int:
      return CE(ad(t.readBytes(16)));
    case hn.uint:
      return TE(t.readBytes(16));
    case hn.buffer:
      const r = t.readUInt32BE();
      return IE(t.readBytes(r));
    case hn.true:
      return kE();
    case hn.false:
      return $E();
    case hn.address:
      const o = ta(t);
      return ZE(o);
    case hn.contract:
      const s = ta(t), i = Er(t);
      return qw(s, i);
    case hn.ok:
      return ek(es(t));
    case hn.err:
      return QE(es(t));
    case hn.none:
      return jw();
    case hn.some:
      return Rw(es(t));
    case hn.list:
      const a = t.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(es(t));
      return BE(c);
    case hn.tuple:
      const u = t.readUInt32BE(), h = {};
      for (let x = 0; x < u; x++) {
        const L = Er(t).content;
        if (L === void 0)
          throw new jn('"content" is undefined');
        h[L] = es(t);
      }
      return rk(h);
    case hn.ascii:
      const d = t.readUInt32BE(), m = P1(t.readBytes(d));
      return tk(m);
    case hn.utf8:
      const w = t.readUInt32BE(), v = Ja(t.readBytes(w));
      return nk(v);
    default:
      throw new jn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function as(e, t) {
  return an([Rf(e), t]);
}
function sk(e) {
  return new Uint8Array([Rf(e.type)]);
}
function ok(e) {
  return e.type === pt.OptionalNone ? new Uint8Array([Rf(e.type)]) : as(e.type, rs(e.value));
}
function ik(e) {
  const t = new Uint8Array(4);
  return Vo(t, Math.ceil(e.value.length / 2), 0), as(e.type, os(t, mt(e.value)));
}
function ak(e) {
  const t = gf(C1(BigInt(e.value), BigInt(vA)), Nw);
  return as(e.type, t);
}
function ck(e) {
  const t = gf(BigInt(e.value), Nw);
  return as(e.type, t);
}
function lk(e) {
  return as(e.type, rc(vo(e.value)));
}
function uk(e) {
  const [t, n] = Ak(e.value);
  return as(e.type, os(rc(vo(t)), na(Dr(n))));
}
function dk(e) {
  return as(e.type, rs(e.value));
}
function fk(e) {
  const t = [], n = new Uint8Array(4);
  Vo(n, e.value.length, 0), t.push(n);
  for (const r of e.value) {
    const o = rs(r);
    t.push(o);
  }
  return as(e.type, an(t));
}
function hk(e) {
  const t = [], n = new Uint8Array(4);
  Vo(n, Object.keys(e.value).length, 0), t.push(n);
  const r = Object.keys(e.value).sort((o, s) => o.localeCompare(s));
  for (const o of r) {
    const s = Dr(o);
    t.push(na(s));
    const i = rs(e.value[o]);
    t.push(i);
  }
  return as(e.type, an(t));
}
function Ww(e, t) {
  const n = [], r = t == "ascii" ? M1(e.value) : ci(e.value), o = new Uint8Array(4);
  return Vo(o, r.length, 0), n.push(o), n.push(r), as(e.type, an(n));
}
function pk(e) {
  return Ww(e, "ascii");
}
function gk(e) {
  return Ww(e, "utf8");
}
function f0(e) {
  return Ue(rs(e));
}
function rs(e) {
  switch (e.type) {
    case pt.BoolTrue:
    case pt.BoolFalse:
      return sk(e);
    case pt.OptionalNone:
    case pt.OptionalSome:
      return ok(e);
    case pt.Buffer:
      return ik(e);
    case pt.UInt:
      return ck(e);
    case pt.Int:
      return ak(e);
    case pt.PrincipalStandard:
      return lk(e);
    case pt.PrincipalContract:
      return uk(e);
    case pt.ResponseOk:
    case pt.ResponseErr:
      return dk(e);
    case pt.List:
      return fk(e);
    case pt.Tuple:
      return hk(e);
    case pt.StringASCII:
      return pk(e);
    case pt.StringUTF8:
      return gk(e);
    default:
      throw new Ui("Unable to serialize. Invalid Clarity Value.");
  }
}
const yk = (e) => e.length % 2 ? `0${e}` : e, wk = (e, t) => e.padEnd(t, "0"), Zw = (e, t) => e ? ci(e).length > t : !1;
function _d(e) {
  return Lw(e);
}
const Fa = (e) => ZA(Df(e)), Yf = (e) => Ue(EE(e)), mk = (e) => Ue(Fa(e)), bk = (e) => {
  const t = Fa(e), n = os(new Uint8Array([0]), new Uint8Array([t.length]), t), r = Fa(n);
  return Ue(r);
}, xk = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + t.length), n.push(174);
  const r = an(n), o = Fa(r);
  return Ue(o);
}, Sk = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = an(n), o = Df(r), s = [];
  s.push(0), s.push(o.length), s.push(o);
  const i = an(s), a = Fa(i);
  return Ue(a);
};
function vk(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function Ak(e) {
  const [t, n] = e.split(".");
  if (!t || !n)
    throw new Error(`Invalid contract identifier: ${e}`);
  return [t, n];
}
nn.hmacSha256Sync = (e, ...t) => {
  const n = Uw.create(Df, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function ua(e) {
  return e = typeof e == "string" ? mt(e) : e, {
    type: we.PublicKey,
    data: e
  };
}
function Ek(e, t, n = qt.Compressed) {
  const r = H1(t), o = new pr(fp(r.r), fp(r.s)), s = at.fromSignature(e, o, r.recoveryId), i = n === qt.Compressed;
  return s.toHex(i);
}
function kk(e) {
  return typeof e == "string" ? e : Ue(e);
}
const qf = kk;
function Jw(e) {
  return (typeof e == "string" ? e.length / 2 : e.byteLength) === O1;
}
function da(e) {
  return !qf(e).startsWith("04");
}
function $k(e) {
  e = yf(e);
  const t = Jw(e);
  return Ue(Qa(e.slice(0, 32), t));
}
function Ik(e) {
  return at.fromHex(qf(e)).toHex(!0);
}
function Lk(e) {
  return at.fromHex(qf(e)).toHex(!1);
}
function Ck(e, t) {
  e = yf(e);
  const [n, r] = Hl(t, e.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Za(r, 1) + pr.fromHex(n).toCompactHex();
}
function Wf() {
  return {
    type: we.MessageSignature,
    data: Ue(new Uint8Array(ql))
  };
}
function Qw(e, t, n, r) {
  const o = Vf(0, e, 1, [ua(t)]).hash160, s = da(t) ? qt.Compressed : qt.Uncompressed;
  return {
    hashMode: e,
    signer: o,
    nonce: Hn(n),
    fee: Hn(r),
    keyEncoding: s,
    signature: Wf()
  };
}
function ja(e) {
  return "signature" in e;
}
function h0(e) {
  return e === Nt.P2SH || e === Nt.P2WSH;
}
function Tk(e) {
  return e === Nt.P2SHNonSequential || e === Nt.P2WSHNonSequential;
}
function p0(e) {
  const t = _d(e);
  return t.nonce = 0, t.fee = 0, ja(t) ? t.signature = Wf() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function Bk(e) {
  const t = [
    e.hashMode,
    mt(e.signer),
    xo(e.nonce, 8),
    xo(e.fee, 8),
    e.keyEncoding,
    Kf(e.signature)
  ];
  return an(t);
}
function Nk(e) {
  const t = [
    e.hashMode,
    mt(e.signer),
    xo(e.nonce, 8),
    xo(e.fee, 8)
  ], n = zf(e.fields);
  t.push(Gf(n));
  const r = new Uint8Array(2);
  return F1(r, e.signaturesRequired, 0), t.push(r), an(t);
}
function Mk(e, t) {
  const n = Ue(t.readBytes(20)), r = BigInt(`0x${Ue(t.readBytes(8))}`), o = BigInt(`0x${Ue(t.readBytes(8))}`), s = t.readUInt8Enum(qt, (a) => {
    throw new jn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === Nt.P2WPKH && s != qt.Compressed)
    throw new jn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = Nd(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: o,
    keyEncoding: s,
    signature: i
  };
}
function Pk(e, t) {
  const n = Ue(t.readBytes(20)), r = BigInt("0x" + Ue(t.readBytes(8))), o = BigInt("0x" + Ue(t.readBytes(8))), s = Vw(t, we.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case we.PublicKey:
        da(u.contents.data) || (i = !0);
        break;
      case we.MessageSignature:
        if (u.pubKeyEncoding === qt.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new Oo("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === Nt.P2WSH || e === Nt.P2WSHNonSequential))
    throw new Oo("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: o,
    fields: s,
    signaturesRequired: c
  };
}
function Cu(e) {
  return ja(e) ? Bk(e) : Nk(e);
}
function Tu(e) {
  const t = e.readUInt8Enum(Nt, (n) => {
    throw new jn(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Nt.P2PKH || t === Nt.P2WPKH ? Mk(t, e) : Pk(t, e);
}
function em(e, t, n, r) {
  const s = e + Ue(new Uint8Array([t])) + Ue(xo(n, 8)) + Ue(xo(r, 8));
  if (mt(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Yf(mt(s));
}
function tm(e, t, n) {
  const r = 33 + ql, o = da(t.data) ? qt.Compressed : qt.Uncompressed, s = e + yk(o.toString(16)) + n, i = mt(s);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return Yf(i);
}
function _k(e, t, n, r, o) {
  const s = em(e, t, n, r), i = Ck(o, s), a = ua($k(o)), c = tm(s, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function nm(e, t, n, r, o, s) {
  const i = em(e, t, n, r), a = ua(Ek(i, s, o)), c = tm(i, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function Uk() {
  const e = Qw(Nt.P2PKH, "", 0, 0);
  return e.signer = NE().hash160, e.keyEncoding = qt.Compressed, e.signature = Wf(), e;
}
function g0(e, t, n) {
  return ja(e) ? Ok(e, t, n) : Hk(e, t, n);
}
function Ok(e, t, n) {
  const { pubKey: r, nextSigHash: o } = nm(t, n, e.fee, e.nonce, e.keyEncoding, e.signature.data), s = Vf(0, e.hashMode, 1, [r]).hash160;
  if (s !== e.signer)
    throw new Oo(`Signer hash does not equal hash of public key(s): ${s} != ${e.signer}`);
  return o;
}
function Hk(e, t, n) {
  const r = [];
  let o = t, s = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case we.PublicKey:
        da(c.contents.data) || (s = !0), r.push(c.contents);
        break;
      case we.MessageSignature:
        c.pubKeyEncoding === qt.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: h } = nm(o, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents.data);
        if (h0(e.hashMode) && (o = h), r.push(u), i += 1, i === 65536)
          throw new Oo("Too many signatures");
        break;
    }
  if (h0(e.hashMode) && i !== e.signaturesRequired || Tk(e.hashMode) && i < e.signaturesRequired)
    throw new Oo("Incorrect number of signatures");
  if (s && (e.hashMode === Nt.P2WSH || e.hashMode === Nt.P2WSHNonSequential))
    throw new Oo("Uncompressed keys are not allowed in this hash mode");
  const a = Vf(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new Oo(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return o;
}
function rm(e) {
  return {
    authType: en.Standard,
    spendingCondition: e
  };
}
function sm(e, t) {
  return {
    authType: en.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || Qw(Nt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function y0(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case en.Standard:
        return rm(p0(e.spendingCondition));
      case en.Sponsored:
        return sm(p0(e.spendingCondition), Uk());
      default:
        throw new ml("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Dk(e, t) {
  switch (e.authType) {
    case en.Standard:
      return g0(e.spendingCondition, t, en.Standard);
    case en.Sponsored:
      return g0(e.spendingCondition, t, en.Standard);
    default:
      throw new ml("Invalid origin auth type");
  }
}
function Fk(e, t) {
  switch (e.authType) {
    case en.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Hn(t)
      };
      return { ...e, spendingCondition: n };
    case en.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Hn(t)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function jk(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Hn(t)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function Rk(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Hn(t)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function zk(e, t) {
  const n = {
    ...t,
    nonce: Hn(t.nonce),
    fee: Hn(t.fee)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function Gk(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case en.Standard:
      t.push(Cu(e.spendingCondition));
      break;
    case en.Sponsored:
      t.push(Cu(e.spendingCondition)), t.push(Cu(e.sponsorSpendingCondition));
      break;
  }
  return an(t);
}
function Kk(e) {
  const t = e.readUInt8Enum(en, (r) => {
    throw new jn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case en.Standard:
      return n = Tu(e), rm(n);
    case en.Sponsored:
      n = Tu(e);
      const r = Tu(e);
      return sm(n, r);
  }
}
class Vk {
  constructor({ auth: t, payload: n, postConditions: r = zf([]), postConditionMode: o = wl.Deny, transactionVersion: s, chainId: i, network: a = "mainnet" }) {
    a = bA(a), this.transactionVersion = s ?? a.transactionVersion, this.chainId = i ?? a.chainId, this.auth = t, "amount" in n ? this.payload = {
      ...n,
      amount: Hn(n.amount)
    } : this.payload = n, this.postConditionMode = o, this.postConditions = r, this.anchorMode = lr.Any;
  }
  signBegin() {
    const t = _d(this);
    return t.auth = y0(t.auth), t.txid();
  }
  verifyBegin() {
    const t = _d(this);
    return t.auth = y0(t.auth), t.txid();
  }
  verifyOrigin() {
    return Dk(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, en.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === en.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, en.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = typeof t == "object" && "type" in t ? t : ua(t), r = this.auth.spendingCondition;
    if (r && !ja(r)) {
      const o = da(n.data);
      r.fields.push(Oi(o ? qt.Compressed : qt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, o) {
    const { nextSig: s, nextSigHash: i } = _k(n, r, t.fee, t.nonce, o);
    if (ja(t))
      t.signature = Td(s);
    else {
      const a = Jw(o);
      t.fields.push(Oi(a ? qt.Compressed : qt.Uncompressed, Td(s)));
    }
    return i;
  }
  txid() {
    const t = this.serializeBytes();
    return Yf(t);
  }
  setSponsor(t) {
    if (this.auth.authType != en.Sponsored)
      throw new ml("Cannot sponsor sign a non-sponsored transaction");
    this.auth = zk(this.auth, t);
  }
  setFee(t) {
    this.auth = Fk(this.auth, t);
  }
  setNonce(t) {
    this.auth = jk(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != en.Sponsored)
      throw new ml("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Rk(this.auth, t);
  }
  serialize() {
    return Ue(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Ui('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Ui('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ui('"auth" is undefined');
    if (this.payload === void 0)
      throw new Ui('"payload" is undefined');
    const t = [];
    t.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Vo(n, this.chainId, 0), t.push(n), t.push(Gk(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(Gf(this.postConditions)), t.push(Yw(this.payload)), an(t);
  }
}
function Xk(e) {
  const t = Qn(e, Ut) ? e : new Ut(e), n = t.readUInt8Enum(ti, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = t.readUInt32BE(), o = Kk(t), s = t.readUInt8Enum(lr, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), i = t.readUInt8Enum(wl, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = Vw(t, we.PostCondition), c = VE(t), u = new Vk({
    transactionVersion: n,
    chainId: r,
    auth: o,
    payload: c,
    postConditions: a,
    postConditionMode: i
  });
  return u.anchorMode = s, u;
}
const w0 = BigInt("18446744073709551615");
function Bu(e) {
  const t = Hn(e);
  if (t < 0n || t > w0)
    throw new RangeError(`Post-condition amount must be between 0 and ${w0} (u64 max), received: ${t}`);
  return t;
}
var Ud;
(function(e) {
  e[e.eq = 1] = "eq", e[e.gt = 2] = "gt", e[e.lt = 4] = "lt", e[e.gte = 3] = "gte", e[e.lte = 5] = "lte", e[e.sent = 16] = "sent", e[e["not-sent"] = 17] = "not-sent", e[e["maybe-sent"] = 18] = "maybe-sent";
})(Ud || (Ud = {}));
var Od;
(function(e) {
  e[e["will-not-perform"] = 48] = "will-not-perform", e[e["may-perform"] = 49] = "may-perform", e[e["will-perform"] = 50] = "will-perform";
})(Od || (Od = {}));
function Yk(e) {
  switch (e.type) {
    case "stx-postcondition":
      return {
        type: we.PostCondition,
        conditionType: zt.STX,
        principal: e.address === "origin" ? { type: we.Principal, prefix: zn.Origin } : Sa(e.address),
        conditionCode: Lc(e.condition),
        amount: Bu(e.amount)
      };
    case "ft-postcondition":
      return {
        type: we.PostCondition,
        conditionType: zt.Fungible,
        principal: e.address === "origin" ? { type: we.Principal, prefix: zn.Origin } : Sa(e.address),
        conditionCode: Lc(e.condition),
        amount: Bu(e.amount),
        asset: d0(e.asset)
      };
    case "nft-postcondition":
      return {
        type: we.PostCondition,
        conditionType: zt.NonFungible,
        principal: e.address === "origin" ? { type: we.Principal, prefix: zn.Origin } : Sa(e.address),
        conditionCode: Lc(e.condition),
        asset: d0(e.asset),
        assetName: e.assetId
      };
    case "staking-postcondition":
      return {
        type: we.PostCondition,
        conditionType: zt.Staking,
        principal: e.address === "origin" ? { type: we.Principal, prefix: zn.Origin } : Sa(e.address),
        conditionCode: Lc(e.condition),
        amount: Bu(e.amount)
      };
    case "pox-postcondition":
      return {
        type: we.PostCondition,
        conditionType: zt.PoX,
        principal: e.address === "origin" ? { type: we.Principal, prefix: zn.Origin } : Sa(e.address),
        conditionCode: qk(e.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Lc(e) {
  return Ud[e];
}
function qk(e) {
  return Od[e];
}
function om(e) {
  const t = Yk(e);
  return GE(t);
}
function Wk(e, t, n) {
  return Jf(im(e), n);
}
function im(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Ra(r);
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
    return BigInt(`0x${Qk(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Zf(e, t = 8) {
  return (typeof e == "bigint" ? e : im(e)).toString(16).padStart(t * 2, "0");
}
function Jf(e, t = 16) {
  const n = Zf(e, t);
  return Ra(n);
}
function Zk(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
const Jk = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Qk(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += Jk[n];
  return t;
}
function Ra(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const o = r * 2, s = t.slice(o, o + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    n[r] = i;
  }
  return n;
}
function Qf(e) {
  return new TextEncoder().encode(e);
}
function e3(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function t3(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function m0(e) {
  if (e.some(t3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function eh(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, o) => r + o.length, 0), n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
function Bs(e) {
  return eh(...e.map((t) => typeof t == "number" ? m0([t]) : t instanceof Array ? m0(t) : t));
}
function Jl(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var Hd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Hd || (Hd = {}));
Hd.Mainnet;
const n3 = 128, r3 = 128, am = 16;
var Dd;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Dd || (Dd = {}));
var b0;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(b0 || (b0 = {}));
var x0;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(x0 || (x0 = {}));
var Nr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Nr || (Nr = {}));
const Nu = ["onChainOnly", "offChainOnly", "any"];
Nu[0] + "", Nr.OnChainOnly, Nu[1] + "", Nr.OffChainOnly, Nu[2] + "", Nr.Any, Nr.OnChainOnly + "", Nr.OnChainOnly, Nr.OffChainOnly + "", Nr.OffChainOnly, Nr.Any + "", Nr.Any;
var Fd;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Fd || (Fd = {}));
Fd.Mainnet;
var S0;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(S0 || (S0 = {}));
var Mo;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Mo || (Mo = {}));
var v0;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(v0 || (v0 = {}));
var A0;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(A0 || (A0 = {}));
var E0;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(E0 || (E0 = {}));
var k0;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(k0 || (k0 = {}));
var $0;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})($0 || ($0 = {}));
var I0;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(I0 || (I0 = {}));
var jd;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(jd || (jd = {}));
var L0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(L0 || (L0 = {}));
var C0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(C0 || (C0 = {}));
function Rd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function s3(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function cm(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function o3(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Rd(e.outputLen), Rd(e.blockLen);
}
function i3(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function a3(e, t) {
  cm(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Mu = {
  number: Rd,
  bool: s3,
  bytes: cm,
  hash: o3,
  exists: i3,
  output: a3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Pu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Zr = (e, t) => e << 32 - t | e >>> t, c3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!c3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function l3(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function lm(e) {
  if (typeof e == "string" && (e = l3(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let u3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function pi(e) {
  const t = (r) => e().update(lm(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function d3(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let th = class extends u3 {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Pu(this.buffer);
  }
  update(t) {
    Mu.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = lm(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = Pu(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Mu.exists(this), Mu.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    d3(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Pu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.length = o, t.pos = a, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
};
const f3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), um = Uint8Array.from({ length: 16 }, (e, t) => t), h3 = um.map((e) => (9 * e + 5) % 16);
let nh = [um], rh = [h3];
for (let e = 0; e < 4; e++)
  for (let t of [nh, rh])
    t.push(t[e].map((n) => f3[n]));
const dm = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), p3 = nh.map((e, t) => e.map((n) => dm[t][n])), g3 = rh.map((e, t) => e.map((n) => dm[t][n])), y3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), w3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Cc = (e, t) => e << t | e >>> 32 - t;
function T0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Tc = new Uint32Array(16);
let m3 = class extends th {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: o, h4: s } = this;
    return [t, n, r, o, s];
  }
  set(t, n, r, o, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let w = 0; w < 16; w++, n += 4)
      Tc[w] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, m = d;
    for (let w = 0; w < 5; w++) {
      const v = 4 - w, x = y3[w], L = w3[w], B = nh[w], U = rh[w], A = p3[w], T = g3[w];
      for (let _ = 0; _ < 16; _++) {
        const X = Cc(r + T0(w, s, a, u) + Tc[B[_]] + x, A[_]) + d | 0;
        r = d, d = u, u = Cc(a, 10) | 0, a = s, s = X;
      }
      for (let _ = 0; _ < 16; _++) {
        const X = Cc(o + T0(v, i, c, h) + Tc[U[_]] + L, T[_]) + m | 0;
        o = m, m = h, h = Cc(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + m | 0, this.h3 + d + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Tc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
pi(() => new m3());
const b3 = (e, t, n) => e & t ^ ~e & n, x3 = (e, t, n) => e & t ^ e & n ^ t & n, S3 = new Uint32Array([
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
]), no = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ro = new Uint32Array(64);
let fm = class extends th {
  constructor() {
    super(64, 32, 8, !1), this.A = no[0] | 0, this.B = no[1] | 0, this.C = no[2] | 0, this.D = no[3] | 0, this.E = no[4] | 0, this.F = no[5] | 0, this.G = no[6] | 0, this.H = no[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      ro[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = ro[d - 15], w = ro[d - 2], v = Zr(m, 7) ^ Zr(m, 18) ^ m >>> 3, x = Zr(w, 17) ^ Zr(w, 19) ^ w >>> 10;
      ro[d] = x + ro[d - 7] + v + ro[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = Zr(a, 6) ^ Zr(a, 11) ^ Zr(a, 25), w = h + m + b3(a, c, u) + S3[d] + ro[d] | 0, x = (Zr(r, 2) ^ Zr(r, 13) ^ Zr(r, 22)) + x3(r, o, s) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = s, s = o, o = r, r = w + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, o, s, i, a, c, u, h);
  }
  roundClean() {
    ro.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, v3 = class extends fm {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
pi(() => new fm());
pi(() => new v3());
const Bc = BigInt(2 ** 32 - 1), zd = BigInt(32);
function hm(e, t = !1) {
  return t ? { h: Number(e & Bc), l: Number(e >> zd & Bc) } : { h: Number(e >> zd & Bc) | 0, l: Number(e & Bc) | 0 };
}
function A3(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = hm(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const E3 = (e, t) => BigInt(e >>> 0) << zd | BigInt(t >>> 0), k3 = (e, t, n) => e >>> n, $3 = (e, t, n) => e << 32 - n | t >>> n, I3 = (e, t, n) => e >>> n | t << 32 - n, L3 = (e, t, n) => e << 32 - n | t >>> n, C3 = (e, t, n) => e << 64 - n | t >>> n - 32, T3 = (e, t, n) => e >>> n - 32 | t << 64 - n, B3 = (e, t) => t, N3 = (e, t) => e, M3 = (e, t, n) => e << n | t >>> 32 - n, P3 = (e, t, n) => t << n | e >>> 32 - n, _3 = (e, t, n) => t << n - 32 | e >>> 64 - n, U3 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function O3(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const H3 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), D3 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, F3 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), j3 = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, R3 = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), z3 = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, tt = {
  fromBig: hm,
  split: A3,
  toBig: E3,
  shrSH: k3,
  shrSL: $3,
  rotrSH: I3,
  rotrSL: L3,
  rotrBH: C3,
  rotrBL: T3,
  rotr32H: B3,
  rotr32L: N3,
  rotlSH: M3,
  rotlSL: P3,
  rotlBH: _3,
  rotlBL: U3,
  add: O3,
  add3L: H3,
  add3H: D3,
  add4L: F3,
  add4H: j3,
  add5H: z3,
  add5L: R3
}, [G3, K3] = tt.split([
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
].map((e) => BigInt(e))), so = new Uint32Array(80), oo = new Uint32Array(80);
let Ql = class extends th {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: m, Gh: w, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, o, s, i, a, c, u, h, d, m, w, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c, u, h, d, m, w, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      so[A] = t.getUint32(n), oo[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = so[A - 15] | 0, _ = oo[A - 15] | 0, X = tt.rotrSH(T, _, 1) ^ tt.rotrSH(T, _, 8) ^ tt.shrSH(T, _, 7), ce = tt.rotrSL(T, _, 1) ^ tt.rotrSL(T, _, 8) ^ tt.shrSL(T, _, 7), ne = so[A - 2] | 0, q = oo[A - 2] | 0, b = tt.rotrSH(ne, q, 19) ^ tt.rotrBH(ne, q, 61) ^ tt.shrSH(ne, q, 6), I = tt.rotrSL(ne, q, 19) ^ tt.rotrBL(ne, q, 61) ^ tt.shrSL(ne, q, 6), N = tt.add4L(ce, I, oo[A - 7], oo[A - 16]), P = tt.add4H(N, X, b, so[A - 7], so[A - 16]);
      so[A] = P | 0, oo[A] = N | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: m, Fh: w, Fl: v, Gh: x, Gl: L, Hh: B, Hl: U } = this;
    for (let A = 0; A < 80; A++) {
      const T = tt.rotrSH(d, m, 14) ^ tt.rotrSH(d, m, 18) ^ tt.rotrBH(d, m, 41), _ = tt.rotrSL(d, m, 14) ^ tt.rotrSL(d, m, 18) ^ tt.rotrBL(d, m, 41), X = d & w ^ ~d & x, ce = m & v ^ ~m & L, ne = tt.add5L(U, _, ce, K3[A], oo[A]), q = tt.add5H(ne, B, T, X, G3[A], so[A]), b = ne | 0, I = tt.rotrSH(r, o, 28) ^ tt.rotrBH(r, o, 34) ^ tt.rotrBH(r, o, 39), N = tt.rotrSL(r, o, 28) ^ tt.rotrBL(r, o, 34) ^ tt.rotrBL(r, o, 39), P = r & s ^ r & a ^ s & a, W = o & i ^ o & c ^ i & c;
      B = x | 0, U = L | 0, x = w | 0, L = v | 0, w = d | 0, v = m | 0, { h: d, l: m } = tt.add(u | 0, h | 0, q | 0, b | 0), u = a | 0, h = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const R = tt.add3L(b, N, W);
      r = tt.add3H(R, q, I, P), o = R | 0;
    }
    ({ h: r, l: o } = tt.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = tt.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = tt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: m } = tt.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: w, l: v } = tt.add(this.Fh | 0, this.Fl | 0, w | 0, v | 0), { h: x, l: L } = tt.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: B, l: U } = tt.add(this.Hh | 0, this.Hl | 0, B | 0, U | 0), this.set(r, o, s, i, a, c, u, h, d, m, w, v, x, L, B, U);
  }
  roundClean() {
    so.fill(0), oo.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, V3 = class extends Ql {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, X3 = class extends Ql {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Y3 = class extends Ql {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
pi(() => new Ql());
pi(() => new V3());
pi(() => new X3());
pi(() => new Y3());
function q3(e, t, n) {
  const o = n3;
  if (d4(e, o))
    throw new Error(`String length exceeds maximum bytes ${o}`);
  return {
    type: Dd.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: 1,
    maxLengthBytes: o
  };
}
var Sn;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(Sn || (Sn = {}));
let W3 = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, pm = class extends W3 {
  constructor(t) {
    super(t);
  }
};
function eu(e) {
  const t = [];
  return t.push(Ra(Zf(e.version, 1))), t.push(Ra(e.hash160)), Bs(t);
}
function Z3(e) {
  const t = [];
  return t.push(e.prefix), t.push(eu(e.address)), e.prefix === jd.Contract && t.push(za(e.contractName)), Bs(t);
}
function za(e) {
  const t = [], n = Qf(e.content), r = n.byteLength;
  return t.push(Ra(Zf(r, e.lengthPrefixBytes))), t.push(n), Bs(t);
}
function J3(e) {
  const t = [];
  return t.push(eu(e.address)), t.push(za(e.contractName)), t.push(za(e.assetName)), Bs(t);
}
function gm(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(Z3(e.principal)), (e.conditionType === Mo.Fungible || e.conditionType === Mo.NonFungible) && t.push(J3(e.assetInfo)), e.conditionType === Mo.NonFungible && t.push(ri(e.assetName)), t.push(e.conditionCode), e.conditionType === Mo.STX || e.conditionType === Mo.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new pm("The post-condition amount may not be larger than 8 bytes");
    t.push(Wk(e.amount, !1, 8));
  }
  return Bs(t);
}
function cs(e, t) {
  return Bs([e, t]);
}
function Q3(e) {
  return new Uint8Array([e.type]);
}
function e4(e) {
  return e.type === Sn.OptionalNone ? new Uint8Array([e.type]) : cs(e.type, ri(e.value));
}
function t4(e) {
  const t = new Uint8Array(4);
  return Jl(t, e.buffer.length, 0), cs(e.type, eh(t, e.buffer));
}
function n4(e) {
  const t = Jf(Zk(e.value, BigInt(r3)), am);
  return cs(e.type, t);
}
function r4(e) {
  const t = Jf(e.value, am);
  return cs(e.type, t);
}
function s4(e) {
  return cs(e.type, eu(e.address));
}
function o4(e) {
  return cs(e.type, eh(eu(e.address), za(e.contractName)));
}
function i4(e) {
  return cs(e.type, ri(e.value));
}
function a4(e) {
  const t = [], n = new Uint8Array(4);
  Jl(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const o = ri(r);
    t.push(o);
  }
  return cs(e.type, Bs(t));
}
function c4(e) {
  const t = [], n = new Uint8Array(4);
  Jl(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((o, s) => o.localeCompare(s));
  for (const o of r) {
    const s = q3(o);
    t.push(za(s));
    const i = ri(e.data[o]);
    t.push(i);
  }
  return cs(e.type, Bs(t));
}
function ym(e, t) {
  const n = [], r = t == "ascii" ? e3(e.data) : Qf(e.data), o = new Uint8Array(4);
  return Jl(o, r.length, 0), n.push(o), n.push(r), cs(e.type, Bs(n));
}
function l4(e) {
  return ym(e, "ascii");
}
function u4(e) {
  return ym(e, "utf8");
}
function ri(e) {
  switch (e.type) {
    case Sn.BoolTrue:
    case Sn.BoolFalse:
      return Q3(e);
    case Sn.OptionalNone:
    case Sn.OptionalSome:
      return e4(e);
    case Sn.Buffer:
      return t4(e);
    case Sn.UInt:
      return r4(e);
    case Sn.Int:
      return n4(e);
    case Sn.PrincipalStandard:
      return s4(e);
    case Sn.PrincipalContract:
      return o4(e);
    case Sn.ResponseOk:
    case Sn.ResponseErr:
      return i4(e);
    case Sn.List:
      return a4(e);
    case Sn.Tuple:
      return c4(e);
    case Sn.StringASCII:
      return l4(e);
    case Sn.StringUTF8:
      return u4(e);
    default:
      throw new pm("Unable to serialize. Invalid Clarity Value.");
  }
}
const d4 = (e, t) => e ? Qf(e).length > t : !1, f4 = "connect-ui";
let Zc, wm, ur = !1, Gd = !1;
const Ts = (e, t = "") => () => {
}, h4 = (e, t) => () => {
}, p4 = "{visibility:hidden}.hydrated{visibility:inherit}", B0 = {}, g4 = "http://www.w3.org/2000/svg", y4 = "http://www.w3.org/1999/xhtml", w4 = (e) => e != null, sh = (e) => (e = typeof e, e === "object" || e === "function");
function mm(e) {
  var t, n, r;
  return (r = (n = (t = e.head) === null || t === void 0 ? void 0 : t.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const We = (e, t, ...n) => {
  let r = null, o = !1, s = !1;
  const i = [], a = (u) => {
    for (let h = 0; h < u.length; h++)
      r = u[h], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((o = typeof e != "function" && !sh(r)) && (r = String(r)), o && s ? i[i.length - 1].$text$ += r : i.push(o ? Kd(null, r) : r), s = o);
  };
  if (a(n), t) {
    const u = t.className || t.class;
    u && (t.class = typeof u != "object" ? u : Object.keys(u).filter((h) => u[h]).join(" "));
  }
  const c = Kd(e, null);
  return c.$attrs$ = t, i.length > 0 && (c.$children$ = i), c;
}, Kd = (e, t) => {
  const n = {
    $flags$: 0,
    $tag$: e,
    $text$: t,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, m4 = {}, b4 = (e) => e && e.$tag$ === m4, x4 = (e, t) => e != null && !sh(e) && t & 4 ? e === "false" ? !1 : e === "" || !!e : e, S4 = (e) => fa(e).$hostElement$, v4 = (e, t, n) => {
  const r = Un.ce(t, n);
  return e.dispatchEvent(r), r;
}, N0 = /* @__PURE__ */ new WeakMap(), A4 = (e, t, n) => {
  let r = bl.get(e);
  z4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = t : r.replaceSync(t)) : r = t, bl.set(e, r);
}, E4 = (e, t, n, r) => {
  var o;
  let s = bm(t);
  const i = bl.get(s);
  if (e = e.nodeType === 11 ? e : ss, i)
    if (typeof i == "string") {
      e = e.head || e;
      let a = N0.get(e), c;
      if (a || N0.set(e, a = /* @__PURE__ */ new Set()), !a.has(s)) {
        {
          c = ss.createElement("style"), c.innerHTML = i;
          const u = (o = Un.$nonce$) !== null && o !== void 0 ? o : mm(ss);
          u != null && c.setAttribute("nonce", u), e.insertBefore(c, e.querySelector("link"));
        }
        a && a.add(s);
      }
    } else e.adoptedStyleSheets.includes(i) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, i]);
  return s;
}, k4 = (e) => {
  const t = e.$cmpMeta$, n = e.$hostElement$, r = t.$flags$, o = Ts("attachStyles", t.$tagName$), s = E4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), t);
  r & 10 && (n["s-sc"] = s, n.classList.add(s + "-h")), o();
}, bm = (e, t) => "sc-" + e.$tagName$, M0 = (e, t, n, r, o, s) => {
  if (n !== r) {
    let i = _0(e, t), a = t.toLowerCase();
    if (t === "class") {
      const c = e.classList, u = P0(n), h = P0(r);
      c.remove(...u.filter((d) => d && !h.includes(d))), c.add(...h.filter((d) => d && !u.includes(d)));
    } else if (!i && t[0] === "o" && t[1] === "n")
      t[2] === "-" ? t = t.slice(3) : _0(tu, a) ? t = a.slice(2) : t = a[2] + t.slice(3), n && Un.rel(e, t, n, !1), r && Un.ael(e, t, r, !1);
    else {
      const c = sh(r);
      if ((i || c && r !== null) && !o)
        try {
          if (e.tagName.includes("-"))
            e[t] = r;
          else {
            const u = r ?? "";
            t === "list" ? i = !1 : (n == null || e[t] != u) && (e[t] = u);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || e.getAttribute(t) === "") && e.removeAttribute(t) : (!i || s & 4 || o) && !c && (r = r === !0 ? "" : r, e.setAttribute(t, r));
    }
  }
}, $4 = /\s/, P0 = (e) => e ? e.split($4) : [], xm = (e, t, n, r) => {
  const o = t.$elm$.nodeType === 11 && t.$elm$.host ? t.$elm$.host : t.$elm$, s = e && e.$attrs$ || B0, i = t.$attrs$ || B0;
  for (r in s)
    r in i || M0(o, r, s[r], void 0, n, t.$flags$);
  for (r in i)
    M0(o, r, s[r], i[r], n, t.$flags$);
}, oh = (e, t, n, r) => {
  const o = t.$children$[n];
  let s = 0, i, a;
  if (o.$text$ !== null)
    i = o.$elm$ = ss.createTextNode(o.$text$);
  else {
    if (ur || (ur = o.$tag$ === "svg"), i = o.$elm$ = ss.createElementNS(ur ? g4 : y4, o.$tag$), ur && o.$tag$ === "foreignObject" && (ur = !1), xm(null, o, ur), w4(Zc) && i["s-si"] !== Zc && i.classList.add(i["s-si"] = Zc), o.$children$)
      for (s = 0; s < o.$children$.length; ++s)
        a = oh(e, o, s), a && i.appendChild(a);
    o.$tag$ === "svg" ? ur = !1 : i.tagName === "foreignObject" && (ur = !0);
  }
  return i;
}, Sm = (e, t, n, r, o, s) => {
  let i = e, a;
  for (i.shadowRoot && i.tagName === wm && (i = i.shadowRoot); o <= s; ++o)
    r[o] && (a = oh(null, n, o), a && (r[o].$elm$ = a, i.insertBefore(a, t)));
}, vm = (e, t, n, r, o) => {
  for (; t <= n; ++t)
    (r = e[t]) && (o = r.$elm$, o.remove());
}, I4 = (e, t, n, r) => {
  let o = 0, s = 0, i = t.length - 1, a = t[0], c = t[i], u = r.length - 1, h = r[0], d = r[u], m;
  for (; o <= i && s <= u; )
    a == null ? a = t[++o] : c == null ? c = t[--i] : h == null ? h = r[++s] : d == null ? d = r[--u] : Nc(a, h) ? (La(a, h), a = t[++o], h = r[++s]) : Nc(c, d) ? (La(c, d), c = t[--i], d = r[--u]) : Nc(a, d) ? (La(a, d), e.insertBefore(a.$elm$, c.$elm$.nextSibling), a = t[++o], d = r[--u]) : Nc(c, h) ? (La(c, h), e.insertBefore(c.$elm$, a.$elm$), c = t[--i], h = r[++s]) : (m = oh(t && t[s], n, s), h = r[++s], m && a.$elm$.parentNode.insertBefore(m, a.$elm$));
  o > i ? Sm(e, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, s, u) : s > u && vm(t, o, i);
}, Nc = (e, t) => e.$tag$ === t.$tag$, La = (e, t) => {
  const n = t.$elm$ = e.$elm$, r = e.$children$, o = t.$children$, s = t.$tag$, i = t.$text$;
  i === null ? (ur = s === "svg" ? !0 : s === "foreignObject" ? !1 : ur, xm(e, t, ur), r !== null && o !== null ? I4(n, r, t, o) : o !== null ? (e.$text$ !== null && (n.textContent = ""), Sm(n, null, t, o, 0, o.length - 1)) : r !== null && vm(r, 0, r.length - 1), ur && s === "svg" && (ur = !1)) : e.$text$ !== i && (n.data = i);
}, L4 = (e, t) => {
  const n = e.$hostElement$, r = e.$vnode$ || Kd(null, null), o = b4(t) ? t : We(null, null, t);
  wm = n.tagName, o.$tag$ = null, o.$flags$ |= 4, e.$vnode$ = o, o.$elm$ = r.$elm$ = n.shadowRoot || n, Zc = n["s-sc"], La(r, o);
}, Am = (e, t) => {
  t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((n) => e.$onRenderResolve$ = n));
}, ih = (e, t) => {
  if (e.$flags$ |= 16, e.$flags$ & 4) {
    e.$flags$ |= 512;
    return;
  }
  return Am(e, e.$ancestorComponent$), K4(() => C4(e, t));
}, C4 = (e, t) => {
  const n = Ts("scheduleUpdate", e.$cmpMeta$.$tagName$), r = e.$lazyInstance$;
  let o;
  return n(), M4(o, () => T4(e, r, t));
}, T4 = async (e, t, n) => {
  const r = e.$hostElement$, o = Ts("update", e.$cmpMeta$.$tagName$), s = r["s-rc"];
  n && k4(e);
  const i = Ts("render", e.$cmpMeta$.$tagName$);
  B4(e, t), s && (s.map((a) => a()), r["s-rc"] = void 0), i(), o();
  {
    const a = r["s-p"], c = () => N4(e);
    a.length === 0 ? c() : (Promise.all(a).then(c), e.$flags$ |= 4, a.length = 0);
  }
}, B4 = (e, t, n) => {
  try {
    t = t.render(), e.$flags$ &= -17, e.$flags$ |= 2, L4(e, t);
  } catch (r) {
    Ga(r, e.$hostElement$);
  }
  return null;
}, N4 = (e) => {
  const t = e.$cmpMeta$.$tagName$, n = e.$hostElement$, r = Ts("postUpdate", t), o = e.$ancestorComponent$;
  e.$flags$ & 64 ? r() : (e.$flags$ |= 64, km(n), r(), e.$onReadyResolve$(n), o || Em()), e.$onRenderResolve$ && (e.$onRenderResolve$(), e.$onRenderResolve$ = void 0), e.$flags$ & 512 && ch(() => ih(e, !1)), e.$flags$ &= -517;
}, Em = (e) => {
  km(ss.documentElement), ch(() => v4(tu, "appload", { detail: { namespace: f4 } }));
}, M4 = (e, t) => e && e.then ? e.then(t) : t(), km = (e) => e.classList.add("hydrated"), P4 = (e, t) => fa(e).$instanceValues$.get(t), _4 = (e, t, n, r) => {
  const o = fa(e), s = o.$instanceValues$.get(t), i = o.$flags$, a = o.$lazyInstance$;
  n = x4(n, r.$members$[t][0]);
  const c = Number.isNaN(s) && Number.isNaN(n), u = n !== s && !c;
  (!(i & 8) || s === void 0) && u && (o.$instanceValues$.set(t, n), a && (i & 18) === 2 && ih(o, !1));
}, $m = (e, t, n) => {
  if (t.$members$) {
    const r = Object.entries(t.$members$), o = e.prototype;
    if (r.map(([s, [i]]) => {
      (i & 31 || n & 2 && i & 32) && Object.defineProperty(o, s, {
        get() {
          return P4(this, s);
        },
        set(a) {
          _4(this, s, a, t);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const s = /* @__PURE__ */ new Map();
      o.attributeChangedCallback = function(i, a, c) {
        Un.jmp(() => {
          const u = s.get(i);
          if (this.hasOwnProperty(u))
            c = this[u], delete this[u];
          else if (o.hasOwnProperty(u) && typeof this[u] == "number" && this[u] == c)
            return;
          this[u] = c === null && typeof this[u] == "boolean" ? !1 : c;
        });
      }, e.observedAttributes = r.filter(
        ([i, a]) => a[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([i, a]) => {
        const c = a[1] || i;
        return s.set(c, i), c;
      });
    }
  }
  return e;
}, U4 = async (e, t, n, r, o) => {
  if (!(t.$flags$ & 32)) {
    {
      if (t.$flags$ |= 32, o = R4(n), o.then) {
        const c = h4();
        o = await o, c();
      }
      o.isProxied || ($m(
        o,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), o.isProxied = !0);
      const a = Ts("createInstance", n.$tagName$);
      t.$flags$ |= 8;
      try {
        new o(t);
      } catch (c) {
        Ga(c);
      }
      t.$flags$ &= -9, a();
    }
    if (o.style) {
      let a = o.style;
      const c = bm(n);
      if (!bl.has(c)) {
        const u = Ts("registerStyles", n.$tagName$);
        A4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const s = t.$ancestorComponent$, i = () => ih(t, !0);
  s && s["s-rc"] ? s["s-rc"].push(i) : i();
}, O4 = (e) => {
  if (!(Un.$flags$ & 1)) {
    const t = fa(e), n = t.$cmpMeta$, r = Ts("connectedCallback", n.$tagName$);
    if (!(t.$flags$ & 1)) {
      t.$flags$ |= 1;
      {
        let o = e;
        for (; o = o.parentNode || o.host; )
          if (o["s-p"]) {
            Am(t, t.$ancestorComponent$ = o);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([o, [s]]) => {
        if (s & 31 && e.hasOwnProperty(o)) {
          const i = e[o];
          delete e[o], e[o] = i;
        }
      }), U4(e, t, n);
    }
    r();
  }
}, H4 = (e) => {
  Un.$flags$ & 1 || fa(e);
}, D4 = (e, t = {}) => {
  var n;
  const r = Ts(), o = [], s = t.exclude || [], i = tu.customElements, a = ss.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ ss.createElement("style"), h = [];
  let d, m = !0;
  Object.assign(Un, t), Un.$resourcesUrl$ = new URL(t.resourcesUrl || "./", ss.baseURI).href, e.map((w) => {
    w[1].map((v) => {
      const x = {
        $flags$: v[0],
        $tagName$: v[1],
        $members$: v[2],
        $listeners$: v[3]
      };
      x.$members$ = v[2];
      const L = x.$tagName$, B = class extends HTMLElement {
        // StencilLazyHost
        constructor(U) {
          super(U), U = this, j4(U, x), x.$flags$ & 1 && U.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          d && (clearTimeout(d), d = null), m ? h.push(this) : Un.jmp(() => O4(this));
        }
        disconnectedCallback() {
          Un.jmp(() => H4(this));
        }
        componentOnReady() {
          return fa(this).$onReadyPromise$;
        }
      };
      x.$lazyBundleId$ = w[0], !s.includes(L) && !i.get(L) && (o.push(L), i.define(L, $m(
        B,
        x,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = o + p4, u.setAttribute("data-styles", "");
    const w = (n = Un.$nonce$) !== null && n !== void 0 ? n : mm(ss);
    w != null && u.setAttribute("nonce", w), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  m = !1, h.length ? h.map((w) => w.connectedCallback()) : Un.jmp(() => d = setTimeout(Em, 30)), r();
}, ah = /* @__PURE__ */ new WeakMap(), fa = (e) => ah.get(e), F4 = (e, t) => ah.set(t.$lazyInstance$ = e, t), j4 = (e, t) => {
  const n = {
    $flags$: 0,
    $hostElement$: e,
    $cmpMeta$: t,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), e["s-p"] = [], e["s-rc"] = [], ah.set(e, n);
}, _0 = (e, t) => t in e, Ga = (e, t) => (0, console.error)(e, t), _u = /* @__PURE__ */ new Map(), R4 = (e, t, n) => {
  const r = e.$tagName$.replace(/-/g, "_"), o = e.$lazyBundleId$, s = _u.get(o);
  if (s)
    return s[r];
  {
    const i = (a) => (_u.set(o, a), a[r]);
    switch (o) {
      case "connect-modal":
        return Promise.resolve().then(() => UC).then(i, Ga);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${o}.entry.js`
  ).then((i) => (_u.set(o, i), i[r]), Ga);
}, bl = /* @__PURE__ */ new Map(), tu = typeof window < "u" ? window : {}, ss = tu.document || { head: {} }, Un = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (e) => e(),
  raf: (e) => requestAnimationFrame(e),
  ael: (e, t, n, r) => e.addEventListener(t, n, r),
  rel: (e, t, n, r) => e.removeEventListener(t, n, r),
  ce: (e, t) => new CustomEvent(e, t)
}, Im = (e) => Promise.resolve(e), z4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), U0 = [], Lm = [], G4 = (e, t) => (n) => {
  e.push(n), Gd || (Gd = !0, Un.$flags$ & 4 ? ch(Vd) : Un.raf(Vd));
}, O0 = (e) => {
  for (let t = 0; t < e.length; t++)
    try {
      e[t](performance.now());
    } catch (n) {
      Ga(n);
    }
  e.length = 0;
}, Vd = () => {
  O0(U0), O0(Lm), (Gd = U0.length > 0) && Un.raf(Vd);
}, ch = (e) => Im().then(e), K4 = /* @__PURE__ */ G4(Lm), V4 = () => Im(), X4 = (e, t) => typeof window > "u" ? Promise.resolve() : V4().then(() => D4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], t));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var e = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(e, [], this.constructor);
    }, HTMLElement.prototype = e.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, e);
  }
})();
var Y4 = Object.defineProperty, q4 = Object.defineProperties, W4 = Object.getOwnPropertyDescriptors, xl = Object.getOwnPropertySymbols, Cm = Object.prototype.hasOwnProperty, Tm = Object.prototype.propertyIsEnumerable, H0 = (e, t, n) => t in e ? Y4(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, yr = (e, t) => {
  for (var n in t || (t = {})) Cm.call(t, n) && H0(e, n, t[n]);
  if (xl) for (var n of xl(t)) Tm.call(t, n) && H0(e, n, t[n]);
  return e;
}, Fr = (e, t) => q4(e, W4(t)), Bm = (e, t) => {
  var n = {};
  for (var r in e) Cm.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && xl) for (var r of xl(e)) t.indexOf(r) < 0 && Tm.call(e, r) && (n[r] = e[r]);
  return n;
};
function Nm() {
  return Yl(Zo()) || window.StacksProvider || window.BlockstackProvider;
}
function nu(e) {
  return e ? typeof e == "string" ? Qo.fromName(e) : "version" in e ? e : "url" in e ? new xd({ url: e.url }) : e.transactionVersion === ti.Mainnet ? new xd({ url: e.client.baseUrl }) : new Sd({ url: e.client.baseUrl }) : new Sd();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var Z4 = ((e) => (e.ContractCall = "contract_call", e.ContractDeploy = "smart_contract", e.STXTransfer = "token_transfer", e))(Z4 || {}), J4 = ((e) => (e.BUFFER = "buffer", e.UINT = "uint", e.INT = "int", e.PRINCIPAL = "principal", e.BOOL = "bool", e))(J4 || {}), lh = (e) => {
  let t = e;
  if (!t) {
    let n = new dy(["store_write"], document.location.href);
    t = new bd({ appConfig: n });
  }
  return t;
};
function Mm(e) {
  try {
    return lh(e).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Pm = (e) => {
  let t = lh(e).loadUserData().appPrivateKey, n = Bn.SECP256K1Client.derivePublicKey(t);
  return { privateKey: t, publicKey: n };
};
function Q4(e) {
  var t;
  let { stxAddress: n, userSession: r, network: o } = e;
  if (n) return n;
  if (!r || !o) return;
  let s = (t = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : t.stxAddress, i = { [ei.Mainnet]: "mainnet", [ei.Testnet]: "testnet" }, a = nu(o);
  return s == null ? void 0 : s[i[a.chainId]];
}
function e$(e) {
  let t = nu(e.network), n = lh(e.userSession), r = Fr(yr({}, e), { network: t, userSession: n });
  return yr({ stxAddress: Q4(r) }, r);
}
async function t$(e, t) {
  let { postConditions: n } = e;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(om) : n = n.map((r) => Ue(gm(r)))), new Bn.TokenSigner("ES256k", t).signAsync(Fr(yr({}, e), { postConditions: n }));
}
function n$(e) {
  let { postConditions: t } = e;
  return t && t.length > 0 && typeof t[0] != "string" && (typeof t[0].type == "string" ? t = t.map(om) : t = t.map((n) => Ue(gm(n)))), Bn.createUnsecuredToken(Fr(yr({}, e), { postConditions: t }));
}
var r$ = async ({ token: e, options: t }, n) => {
  var r, o, s;
  try {
    let i = await n.transactionRequest(e), { txRaw: a } = i, c = mt(a.replace(/^0x/, "")), u = Xk(c);
    if ("sponsored" in t && t.sponsored) {
      (r = t.onFinish) == null || r.call(t, Fr(yr({}, i), { stacksTransaction: u }));
      return;
    }
    (o = t.onFinish) == null || o.call(t, Fr(yr({}, i), { stacksTransaction: u }));
  } catch (i) {
    console.error("[Connect] Error during transaction request", i), (s = t.onCancel) == null || s.call(t);
  }
}, s$ = async (e) => {
  let t = e, { amount: n, appDetails: r, userSession: o } = t, s = Bm(t, ["amount", "appDetails", "userSession"]);
  if (Mm(o)) {
    let { privateKey: a, publicKey: c } = Pm(o), u = Fr(yr({}, s), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), t$(u, a);
  }
  let i = Fr(yr({}, s), { amount: n.toString(10), txType: "token_transfer" });
  return r && (i.appDetails = r), n$(i);
};
async function o$(e, t, n) {
  let r = await t(Fr(yr(yr({}, e$(e)), e), { network: nu(e.network) }));
  return r$({ token: r, options: e }, n);
}
function i$(e, t = Nm()) {
  if (!t) throw new Error("[Connect] No installed Stacks wallet found");
  return o$(e, s$, t);
}
function _m(e) {
  let { message: t, domain: n } = e;
  return typeof t.type == "string" && typeof n.type == "string" ? Fr(yr({}, e), { message: f0(t), domain: f0(n) }) : Fr(yr({}, e), { message: Ue(ri(t)), domain: Ue(ri(n)) });
}
async function a$(e, t) {
  return new Bn.TokenSigner("ES256k", t).signAsync(_m(e));
}
async function c$(e) {
  let t = e, { userSession: n } = t, r = Bm(t, ["userSession"]);
  if (Mm(n)) {
    let { privateKey: o, publicKey: s } = Pm(n), i = Fr(yr({}, r), { publicKey: s });
    return a$(i, o);
  }
  return Bn.createUnsecuredToken(_m(e));
}
var l$ = ((e) => (e[e.DEFAULT = 0] = "DEFAULT", e[e.ALL = 1] = "ALL", e[e.NONE = 2] = "NONE", e[e.SINGLE = 3] = "SINGLE", e[e.ANYONECANPAY = 128] = "ANYONECANPAY", e))(l$ || {}), Um = "asigna-stx", D0 = (e, t) => new Promise((n) => {
  function r(o) {
    o.data.source === Um && o.data[t] && (n(o.data[t]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(d$(e, t), "*");
}), u$ = { authenticationRequest: async (e) => D0(e, "authenticationRequest"), transactionRequest: async (e) => D0(e, "transactionRequest") }, d$ = (e, t) => ({ source: Um, [t]: e }), f$ = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = u$);
};
f$();
var h$ = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function p$(e, t = !0) {
  return function(n, r) {
    var o;
    if (r) return e(n, r);
    let s = Zo(), i = Nm();
    if (s && i) return e(n, i);
    if (typeof window > "u") return;
    X4();
    let a = (o = n == null ? void 0 : n.defaultProviders) != null ? o : h$, c = oA(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = t;
    let h = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let d = () => {
      u.remove(), document.body.style.overflow = h;
    };
    u.callback = (w) => {
      d(), e(n, w);
    }, u.cancelCallback = () => {
      var w;
      d(), (w = n.onCancel) == null || w.call(n);
    }, document.body.appendChild(u);
    let m = (w) => {
      w.key === "Escape" && (document.removeEventListener("keydown", m), u.remove());
    };
    document.addEventListener("keydown", m);
  };
}
var Mc = p$(i$);
function So(e, t, n) {
  return uh(Kn(e, t), n);
}
function Kn(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Kt(r);
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
      const r = w$(BigInt(`0x${ct(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${ct(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function F0(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function sc(e, t = 8) {
  return (typeof e == "bigint" ? e : Kn(e, !1)).toString(16).padStart(t * 2, "0");
}
function ru(e) {
  return parseInt(e, 16);
}
function uh(e, t = 16) {
  const n = sc(e, t);
  return Kt(n);
}
function g$(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function y$(e, t) {
  return e & BigInt(1) << t;
}
function w$(e, t) {
  return y$(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const m$ = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function ct(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += m$[n];
  return t;
}
function Kt(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const o = r * 2, s = t.slice(o, o + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    n[r] = i;
  }
  return n;
}
function ha(e) {
  return new TextEncoder().encode(e);
}
function dh(e) {
  return new TextDecoder().decode(e);
}
function Om(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function b$(e) {
  return String.fromCharCode.apply(null, e);
}
function x$(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function j0(e) {
  if (e.some(x$))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function su(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, o) => r + o.length, 0), n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
function cn(e) {
  return su(...e.map((t) => typeof t == "number" ? j0([t]) : t instanceof Array ? j0(t) : t));
}
var R0;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(R0 || (R0 = {}));
var z0;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(z0 || (z0 = {}));
var G0;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(G0 || (G0 = {}));
const Hm = 33, Uu = 32;
function S$(e) {
  if (e.length < Uu * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + Uu * 2), r = e.slice(2 + Uu * 2);
  return {
    recoveryId: ru(t),
    r: n,
    s: r
  };
}
function v$(e) {
  const t = typeof e == "string" ? Kt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function A$(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function E$(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function k$(e, t) {
  return e[t];
}
function $$(e, t, n = 0) {
  return e[n] = t, e;
}
function I$(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function si(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var Xd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Xd || (Xd = {}));
const L$ = Xd.Mainnet, C$ = 128, T$ = 128, Dm = 16, zo = 32, Yd = 80, ou = 65, B$ = 32, N$ = 64, Sl = 34;
var Le;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Le || (Le = {}));
var it;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(it || (it = {}));
var qd;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(qd || (qd = {}));
var Zn;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Zn || (Zn = {}));
const Jc = ["onChainOnly", "offChainOnly", "any"], K0 = {
  [Jc[0]]: Zn.OnChainOnly,
  [Jc[1]]: Zn.OffChainOnly,
  [Jc[2]]: Zn.Any,
  [Zn.OnChainOnly]: Zn.OnChainOnly,
  [Zn.OffChainOnly]: Zn.OffChainOnly,
  [Zn.Any]: Zn.Any
};
function M$(e) {
  if (e in K0)
    return K0[e];
  throw new Error(`Invalid anchor mode "${e}", must be one of: ${Jc.join(", ")}`);
}
var vl;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(vl || (vl = {}));
vl.Mainnet;
var ra;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(ra || (ra = {}));
var Jn;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Jn || (Jn = {}));
var tn;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(tn || (tn = {}));
var Mt;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Mt || (Mt = {}));
var Al;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Al || (Al = {}));
var Wt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Wt || (Wt = {}));
var Ka;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Ka || (Ka = {}));
var Wd;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(Wd || (Wd = {}));
var Va;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Va || (Va = {}));
var V0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(V0 || (V0 = {}));
var X0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(X0 || (X0 = {}));
function Zd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function P$(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Fm(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function _$(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Zd(e.outputLen), Zd(e.blockLen);
}
function U$(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function O$(e, t) {
  Fm(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Do = {
  number: Zd,
  bool: P$,
  bytes: Fm,
  hash: _$,
  exists: U$,
  output: O$
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ou = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Jr = (e, t) => e << 32 - t | e >>> t, H$ = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!H$)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function D$(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function fh(e) {
  if (typeof e == "string" && (e = D$(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
class jm {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function gi(e) {
  const t = (r) => e().update(fh(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function F$(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
class hh extends jm {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Ou(this.buffer);
  }
  update(t) {
    Do.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = fh(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = Ou(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Do.exists(this), Do.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    F$(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Ou(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.length = o, t.pos = a, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
}
const j$ = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Rm = Uint8Array.from({ length: 16 }, (e, t) => t), R$ = Rm.map((e) => (9 * e + 5) % 16);
let ph = [Rm], gh = [R$];
for (let e = 0; e < 4; e++)
  for (let t of [ph, gh])
    t.push(t[e].map((n) => j$[n]));
const zm = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), z$ = ph.map((e, t) => e.map((n) => zm[t][n])), G$ = gh.map((e, t) => e.map((n) => zm[t][n])), K$ = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), V$ = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Pc = (e, t) => e << t | e >>> 32 - t;
function Y0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const _c = new Uint32Array(16);
class X$ extends hh {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: o, h4: s } = this;
    return [t, n, r, o, s];
  }
  set(t, n, r, o, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let w = 0; w < 16; w++, n += 4)
      _c[w] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, m = d;
    for (let w = 0; w < 5; w++) {
      const v = 4 - w, x = K$[w], L = V$[w], B = ph[w], U = gh[w], A = z$[w], T = G$[w];
      for (let _ = 0; _ < 16; _++) {
        const X = Pc(r + Y0(w, s, a, u) + _c[B[_]] + x, A[_]) + d | 0;
        r = d, d = u, u = Pc(a, 10) | 0, a = s, s = X;
      }
      for (let _ = 0; _ < 16; _++) {
        const X = Pc(o + Y0(v, i, c, h) + _c[U[_]] + L, T[_]) + m | 0;
        o = m, m = h, h = Pc(c, 10) | 0, c = i, i = X;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + m | 0, this.h3 + d + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    _c.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const Y$ = gi(() => new X$()), q$ = (e, t, n) => e & t ^ ~e & n, W$ = (e, t, n) => e & t ^ e & n ^ t & n, Z$ = new Uint32Array([
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
]), io = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ao = new Uint32Array(64);
class Gm extends hh {
  constructor() {
    super(64, 32, 8, !1), this.A = io[0] | 0, this.B = io[1] | 0, this.C = io[2] | 0, this.D = io[3] | 0, this.E = io[4] | 0, this.F = io[5] | 0, this.G = io[6] | 0, this.H = io[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      ao[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const m = ao[d - 15], w = ao[d - 2], v = Jr(m, 7) ^ Jr(m, 18) ^ m >>> 3, x = Jr(w, 17) ^ Jr(w, 19) ^ w >>> 10;
      ao[d] = x + ao[d - 7] + v + ao[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const m = Jr(a, 6) ^ Jr(a, 11) ^ Jr(a, 25), w = h + m + q$(a, c, u) + Z$[d] + ao[d] | 0, x = (Jr(r, 2) ^ Jr(r, 13) ^ Jr(r, 22)) + W$(r, o, s) | 0;
      h = u, u = c, c = a, a = i + w | 0, i = s, s = o, o = r, r = w + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, o, s, i, a, c, u, h);
  }
  roundClean() {
    ao.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class J$ extends Gm {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const yh = gi(() => new Gm());
gi(() => new J$());
const Uc = BigInt(2 ** 32 - 1), Jd = BigInt(32);
function Km(e, t = !1) {
  return t ? { h: Number(e & Uc), l: Number(e >> Jd & Uc) } : { h: Number(e >> Jd & Uc) | 0, l: Number(e & Uc) | 0 };
}
function Q$(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = Km(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const e8 = (e, t) => BigInt(e >>> 0) << Jd | BigInt(t >>> 0), t8 = (e, t, n) => e >>> n, n8 = (e, t, n) => e << 32 - n | t >>> n, r8 = (e, t, n) => e >>> n | t << 32 - n, s8 = (e, t, n) => e << 32 - n | t >>> n, o8 = (e, t, n) => e << 64 - n | t >>> n - 32, i8 = (e, t, n) => e >>> n - 32 | t << 64 - n, a8 = (e, t) => t, c8 = (e, t) => e, l8 = (e, t, n) => e << n | t >>> 32 - n, u8 = (e, t, n) => t << n | e >>> 32 - n, d8 = (e, t, n) => t << n - 32 | e >>> 64 - n, f8 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function h8(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const p8 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), g8 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, y8 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), w8 = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, m8 = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), b8 = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, nt = {
  fromBig: Km,
  split: Q$,
  toBig: e8,
  shrSH: t8,
  shrSL: n8,
  rotrSH: r8,
  rotrSL: s8,
  rotrBH: o8,
  rotrBL: i8,
  rotr32H: a8,
  rotr32L: c8,
  rotlSH: l8,
  rotlSL: u8,
  rotlBH: d8,
  rotlBL: f8,
  add: h8,
  add3L: p8,
  add3H: g8,
  add4L: y8,
  add4H: w8,
  add5H: b8,
  add5L: m8
}, [x8, S8] = nt.split([
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
].map((e) => BigInt(e))), co = new Uint32Array(80), lo = new Uint32Array(80);
class iu extends hh {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: m, Gh: w, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, o, s, i, a, c, u, h, d, m, w, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c, u, h, d, m, w, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = m | 0, this.Gh = w | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      co[A] = t.getUint32(n), lo[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = co[A - 15] | 0, _ = lo[A - 15] | 0, X = nt.rotrSH(T, _, 1) ^ nt.rotrSH(T, _, 8) ^ nt.shrSH(T, _, 7), ce = nt.rotrSL(T, _, 1) ^ nt.rotrSL(T, _, 8) ^ nt.shrSL(T, _, 7), ne = co[A - 2] | 0, q = lo[A - 2] | 0, b = nt.rotrSH(ne, q, 19) ^ nt.rotrBH(ne, q, 61) ^ nt.shrSH(ne, q, 6), I = nt.rotrSL(ne, q, 19) ^ nt.rotrBL(ne, q, 61) ^ nt.shrSL(ne, q, 6), N = nt.add4L(ce, I, lo[A - 7], lo[A - 16]), P = nt.add4H(N, X, b, co[A - 7], co[A - 16]);
      co[A] = P | 0, lo[A] = N | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: m, Fh: w, Fl: v, Gh: x, Gl: L, Hh: B, Hl: U } = this;
    for (let A = 0; A < 80; A++) {
      const T = nt.rotrSH(d, m, 14) ^ nt.rotrSH(d, m, 18) ^ nt.rotrBH(d, m, 41), _ = nt.rotrSL(d, m, 14) ^ nt.rotrSL(d, m, 18) ^ nt.rotrBL(d, m, 41), X = d & w ^ ~d & x, ce = m & v ^ ~m & L, ne = nt.add5L(U, _, ce, S8[A], lo[A]), q = nt.add5H(ne, B, T, X, x8[A], co[A]), b = ne | 0, I = nt.rotrSH(r, o, 28) ^ nt.rotrBH(r, o, 34) ^ nt.rotrBH(r, o, 39), N = nt.rotrSL(r, o, 28) ^ nt.rotrBL(r, o, 34) ^ nt.rotrBL(r, o, 39), P = r & s ^ r & a ^ s & a, W = o & i ^ o & c ^ i & c;
      B = x | 0, U = L | 0, x = w | 0, L = v | 0, w = d | 0, v = m | 0, { h: d, l: m } = nt.add(u | 0, h | 0, q | 0, b | 0), u = a | 0, h = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const R = nt.add3L(b, N, W);
      r = nt.add3H(R, q, I, P), o = R | 0;
    }
    ({ h: r, l: o } = nt.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = nt.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = nt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: m } = nt.add(this.Eh | 0, this.El | 0, d | 0, m | 0), { h: w, l: v } = nt.add(this.Fh | 0, this.Fl | 0, w | 0, v | 0), { h: x, l: L } = nt.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: B, l: U } = nt.add(this.Hh | 0, this.Hl | 0, B | 0, U | 0), this.set(r, o, s, i, a, c, u, h, d, m, w, v, x, L, B, U);
  }
  roundClean() {
    co.fill(0), lo.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class v8 extends iu {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class A8 extends iu {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class E8 extends iu {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
gi(() => new iu());
gi(() => new v8());
const k8 = gi(() => new A8());
gi(() => new E8());
function Vm(e) {
  if (Kt(e).byteLength != ou)
    throw Error("Invalid signature");
  return {
    type: Le.MessageSignature,
    data: e
  };
}
function Ca(e, t) {
  return { type: Le.Address, version: e, hash160: t };
}
function Hi(e) {
  return fi.c32address(e.version, e.hash160);
}
function oi(e, t, n) {
  const r = t || 1, o = n || C$;
  if (lb(e, o))
    throw new Error(`String length exceeds maximum bytes ${o}`);
  return {
    type: Le.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: o
  };
}
function wh(e) {
  const t = fi.c32addressDecode(e);
  return {
    type: Le.Address,
    version: t[0],
    hash160: t[1]
  };
}
var ie;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(ie || (ie = {}));
function $8(e) {
  if (e.type === ie.PrincipalStandard)
    return Hi(e.address);
  if (e.type === ie.PrincipalContract)
    return `${Hi(e.address)}.${e.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(e)}`);
}
function Xm(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return C8(t, n);
  } else
    return I8(e);
}
function I8(e) {
  const t = wh(e);
  return { type: ie.PrincipalStandard, address: t };
}
function L8(e) {
  return { type: ie.PrincipalStandard, address: e };
}
function C8(e, t) {
  const n = wh(e), r = oi(t);
  return Ym(n, r);
}
function Ym(e, t) {
  if (ha(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: ie.PrincipalContract, address: e, contractName: t };
}
function Hu(e, t = !1) {
  switch (e.type) {
    case ie.BoolTrue:
      return !0;
    case ie.BoolFalse:
      return !1;
    case ie.Int:
    case ie.UInt:
      return t ? e.value.toString() : e.value;
    case ie.Buffer:
      return `0x${ct(e.buffer)}`;
    case ie.OptionalNone:
      return null;
    case ie.OptionalSome:
      return _r(e.value);
    case ie.ResponseErr:
      return _r(e.value);
    case ie.ResponseOk:
      return _r(e.value);
    case ie.PrincipalStandard:
    case ie.PrincipalContract:
      return $8(e);
    case ie.List:
      return e.list.map((r) => _r(r));
    case ie.Tuple:
      const n = {};
      return Object.keys(e.data).forEach((r) => {
        n[r] = _r(e.data[r]);
      }), n;
    case ie.StringASCII:
      return e.data;
    case ie.StringUTF8:
      return e.data;
  }
}
function _r(e) {
  switch (e.type) {
    case ie.ResponseErr:
      return { type: po(e), value: Hu(e, !0), success: !1 };
    case ie.ResponseOk:
      return { type: po(e), value: Hu(e, !0), success: !0 };
    default:
      return { type: po(e), value: Hu(e, !0) };
  }
}
function po(e) {
  switch (e.type) {
    case ie.BoolTrue:
    case ie.BoolFalse:
      return "bool";
    case ie.Int:
      return "int";
    case ie.UInt:
      return "uint";
    case ie.Buffer:
      return `(buff ${e.buffer.length})`;
    case ie.OptionalNone:
      return "(optional none)";
    case ie.OptionalSome:
      return `(optional ${po(e.value)})`;
    case ie.ResponseErr:
      return `(response UnknownType ${po(e.value)})`;
    case ie.ResponseOk:
      return `(response ${po(e.value)} UnknownType)`;
    case ie.PrincipalStandard:
    case ie.PrincipalContract:
      return "principal";
    case ie.List:
      return `(list ${e.list.length} ${e.list.length ? po(e.list[0]) : "UnknownType"})`;
    case ie.Tuple:
      return `(tuple ${Object.keys(e.data).map((t) => `(${t} ${po(e.data[t])})`).join(" ")})`;
    case ie.StringASCII:
      return `(string-ascii ${Om(e.data).length})`;
    case ie.StringUTF8:
      return `(string-utf8 ${ha(e.data).length})`;
  }
}
const qm = () => ({ type: ie.BoolTrue }), Wm = () => ({ type: ie.BoolFalse }), T8 = (e) => e ? qm() : Wm(), q0 = BigInt("0xffffffffffffffffffffffffffffffff"), B8 = BigInt(0), W0 = BigInt("0x7fffffffffffffffffffffffffffffff"), Z0 = BigInt("-170141183460469231731687303715884105728"), N8 = (e) => {
  const t = Kn(e, !0);
  if (t > W0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${W0}`);
  if (t < Z0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Z0}`);
  return { type: ie.Int, value: t };
}, An = (e) => {
  const t = Kn(e, !1);
  if (t < B8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > q0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${q0}`);
  return { type: ie.UInt, value: t };
}, Zm = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: ie.Buffer, buffer: e };
};
function Jm() {
  return { type: ie.OptionalNone };
}
function Qm(e) {
  return { type: ie.OptionalSome, value: e };
}
function M8(e) {
  return { type: ie.ResponseErr, value: e };
}
function P8(e) {
  return { type: ie.ResponseOk, value: e };
}
function _8(e) {
  return { type: ie.List, list: e };
}
function wr(e) {
  for (const t in e)
    if (!E6(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: ie.Tuple, data: e };
}
const xt = (e) => ({ type: ie.StringASCII, data: e }), U8 = (e) => ({ type: ie.StringUTF8, data: e });
class eb extends jm {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Do.hash(t);
    const r = fh(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, s = new Uint8Array(o);
    s.set(r.length > o ? t.create().update(r).digest() : r);
    for (let i = 0; i < s.length; i++)
      s[i] ^= 54;
    this.iHash.update(s), this.oHash = t.create();
    for (let i = 0; i < s.length; i++)
      s[i] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(t) {
    return Do.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Do.exists(this), Do.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = o, t.destroyed = s, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const tb = (e, t, n) => new eb(e, t).update(n).digest();
tb.create = (e, t) => new eb(e, t);
nn.hmacSha256Sync = (e, ...t) => {
  const n = tb.create(yh, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function sa(e) {
  return {
    type: Le.PublicKey,
    data: Kt(e)
  };
}
function O8(e, t, n = Wt.Compressed) {
  const r = S$(t.data), o = new pr(F0(r.r), F0(r.s)), s = at.fromSignature(e, o, r.recoveryId), i = n === Wt.Compressed;
  return s.toHex(i);
}
function H8(e) {
  return { type: Le.PublicKey, data: e };
}
function pa(e) {
  return !ct(e.data).startsWith("04");
}
function El(e) {
  return e.data.slice();
}
function D8(e) {
  const t = R8(e), n = Qa(t.data.slice(0, 32), t.compressed);
  return sa(ct(n));
}
function F8(e) {
  const t = typeof e == "string" ? e : ct(e), n = at.fromHex(t).toHex(!0);
  return sa(n);
}
function j8(e) {
  const t = typeof e == "string" ? e : ct(e), n = at.fromHex(t).toHex(!1);
  return sa(n);
}
function Qd(e) {
  const t = e.readUInt8(), n = t === 4 ? N$ : B$;
  return H8(cn([t, e.readBytes(n)]));
}
function R8(e) {
  const t = v$(e), n = t.length == Hm;
  return { data: t, compressed: n };
}
function z8(e, t) {
  const [n, r] = Hl(t, e.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const s = sc(r, 1) + pr.fromHex(n).toCompactHex();
  return Vm(s);
}
function G8(e) {
  return D8(e.data);
}
function K8(e, t, n) {
  return typeof e == "string" && (e = Xm(e)), typeof n == "string" && (n = eg(n)), {
    type: Le.Payload,
    payloadType: it.TokenTransfer,
    recipient: e,
    amount: Kn(t, !1),
    memo: n ?? eg("")
  };
}
function V8(e, t, n, r) {
  return typeof e == "string" && (e = wh(e)), typeof t == "string" && (t = oi(t)), typeof n == "string" && (n = oi(n)), {
    type: Le.Payload,
    payloadType: it.ContractCall,
    contractAddress: e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function J0(e, t, n) {
  return typeof e == "string" && (e = oi(e)), typeof t == "string" && (t = t6(t)), typeof n == "number" ? {
    type: Le.Payload,
    payloadType: it.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: Le.Payload,
    payloadType: it.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function X8() {
  return { type: Le.Payload, payloadType: it.PoisonMicroblock };
}
function Q0(e, t) {
  if (e.byteLength != zo)
    throw Error(`Coinbase buffer size must be ${zo} bytes`);
  return t != null ? {
    type: Le.Payload,
    payloadType: it.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: Le.Payload,
    payloadType: it.Coinbase,
    coinbaseBytes: e
  };
}
function Y8(e, t, n) {
  if (e.byteLength != zo)
    throw Error(`Coinbase buffer size must be ${zo} bytes`);
  if (n.byteLength != Yd)
    throw Error(`VRF proof buffer size must be ${Yd} bytes`);
  return {
    type: Le.Payload,
    payloadType: it.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === ie.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
var ef;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended";
})(ef || (ef = {}));
function q8(e, t, n, r, o, s, i) {
  return {
    type: Le.Payload,
    payloadType: it.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: o,
    cause: s,
    publicKeyHash: i
  };
}
function nb(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case it.TokenTransfer:
      t.push(sn(e.recipient)), t.push(So(e.amount, !1, 8)), t.push(As(e.memo));
      break;
    case it.ContractCall:
      t.push(As(e.contractAddress)), t.push(As(e.contractName)), t.push(As(e.functionName));
      const n = new Uint8Array(4);
      si(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(sn(r));
      });
      break;
    case it.SmartContract:
      t.push(As(e.contractName)), t.push(As(e.codeBody));
      break;
    case it.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(As(e.contractName)), t.push(As(e.codeBody));
      break;
    case it.PoisonMicroblock:
      break;
    case it.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case it.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(sn(e.recipient));
      break;
    case it.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(sn(e.recipient ? Qm(e.recipient) : Jm())), t.push(e.vrfProof);
      break;
    case it.TenureChange:
      t.push(Kt(e.tenureHash)), t.push(Kt(e.previousTenureHash)), t.push(Kt(e.burnViewHash)), t.push(Kt(e.previousTenureEnd)), t.push(si(new Uint8Array(4), e.previousTenureBlocks)), t.push($$(new Uint8Array(1), e.cause)), t.push(Kt(e.publicKeyHash));
      break;
  }
  return cn(t);
}
function W8(e) {
  switch (e.readUInt8Enum(it, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case it.TokenTransfer:
      const n = $r(e), r = Kn(e.readBytes(8), !1), o = sb(e);
      return K8(n, r, o);
    case it.ContractCall:
      const s = oa(e), i = kr(e), a = kr(e), c = [], u = e.readUInt32BE();
      for (let A = 0; A < u; A++) {
        const T = $r(e);
        c.push(T);
      }
      return V8(s, i, a, c);
    case it.SmartContract:
      const h = kr(e), d = kr(e, 4, 1e5);
      return J0(h, d);
    case it.VersionedSmartContract: {
      const A = e.readUInt8Enum(qd, (X) => {
        throw new Error(`Cannot recognize ClarityVersion: ${X}`);
      }), T = kr(e), _ = kr(e, 4, 1e5);
      return J0(T, _, A);
    }
    case it.PoisonMicroblock:
      return X8();
    case it.Coinbase: {
      const A = e.readBytes(zo);
      return Q0(A);
    }
    case it.CoinbaseToAltRecipient: {
      const A = e.readBytes(zo), T = $r(e);
      return Q0(A, T);
    }
    case it.NakamotoCoinbase: {
      const A = e.readBytes(zo), T = $r(e), _ = e.readBytes(Yd);
      return Y8(A, T, _);
    }
    case it.TenureChange:
      const m = ct(e.readBytes(20)), w = ct(e.readBytes(20)), v = ct(e.readBytes(20)), x = ct(e.readBytes(32)), L = e.readUInt32BE(), B = e.readUInt8Enum(ef, (A) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${A}`);
      }), U = ct(e.readBytes(20));
      return q8(m, w, v, x, L, B, U);
  }
}
class au extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Po extends au {
  constructor(t) {
    super(t);
  }
}
class hr extends au {
  constructor(t) {
    super(t);
  }
}
class kl extends au {
  constructor(t) {
    super(t);
  }
}
class Fo extends au {
  constructor(t) {
    super(t);
  }
}
var Ur;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Ur || (Ur = {}));
function tf(e) {
  return Vm(ct(e.readBytes(ou)));
}
function Di(e, t) {
  return {
    pubKeyEncoding: e,
    type: Le.TransactionAuthField,
    contents: t
  };
}
function Z8(e) {
  const t = e.readUInt8Enum(Ur, (n) => {
    throw new hr(`Could not read ${n} as AuthFieldType`);
  });
  switch (t) {
    case Ur.PublicKeyCompressed:
      return Di(Wt.Compressed, Qd(e));
    case Ur.PublicKeyUncompressed:
      return Di(Wt.Uncompressed, j8(Qd(e).data));
    case Ur.SignatureCompressed:
      return Di(Wt.Compressed, tf(e));
    case Ur.SignatureUncompressed:
      return Di(Wt.Uncompressed, tf(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(t)}`);
  }
}
function mh(e) {
  return Kt(e.data);
}
function J8(e) {
  const t = [];
  switch (e.contents.type) {
    case Le.PublicKey:
      t.push(e.pubKeyEncoding === Wt.Compressed ? Ur.PublicKeyCompressed : Ur.PublicKeyUncompressed), t.push(El(F8(e.contents.data)));
      break;
    case Le.MessageSignature:
      t.push(e.pubKeyEncoding === Wt.Compressed ? Ur.SignatureCompressed : Ur.SignatureUncompressed), t.push(mh(e.contents));
      break;
  }
  return cn(t);
}
function As(e) {
  switch (e.type) {
    case Le.Address:
      return oc(e);
    case Le.Principal:
      return rb(e);
    case Le.LengthPrefixedString:
      return ia(e);
    case Le.MemoString:
      return n6(e);
    case Le.AssetInfo:
      return ob(e);
    case Le.PostCondition:
      return r6(e);
    case Le.PublicKey:
      return El(e);
    case Le.LengthPrefixedList:
      return Sh(e);
    case Le.Payload:
      return nb(e);
    case Le.TransactionAuthField:
      return J8(e);
    case Le.MessageSignature:
      return mh(e);
  }
}
function Q8() {
  return {
    type: Le.Address,
    version: Al.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function bh(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Mt.SerializeP2PKH || t === Mt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Mt.SerializeP2WPKH || t === Mt.SerializeP2WSH || t === Mt.SerializeP2WSHNonSequential) && !r.every(pa))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Mt.SerializeP2PKH:
      return Ca(e, x6(r[0].data));
    case Mt.SerializeP2WPKH:
      return Ca(e, S6(r[0].data));
    case Mt.SerializeP2SH:
    case Mt.SerializeP2SHNonSequential:
      return Ca(e, v6(n, r.map(El)));
    case Mt.SerializeP2WSH:
    case Mt.SerializeP2WSHNonSequential:
      return Ca(e, A6(n, r.map(El)));
  }
}
function oc(e) {
  const t = [];
  return t.push(Kt(sc(e.version, 1))), t.push(Kt(e.hash160)), cn(t);
}
function oa(e) {
  const t = ru(ct(e.readBytes(1))), n = ct(e.readBytes(20));
  return { type: Le.Address, version: t, hash160: n };
}
function rb(e) {
  const t = [];
  return t.push(e.prefix), t.push(oc(e.address)), e.prefix === Va.Contract && t.push(ia(e.contractName)), cn(t);
}
function e6(e) {
  const t = e.readUInt8Enum(Va, (o) => {
    throw new hr(`Unexpected Principal payload type: ${o}`);
  }), n = oa(e);
  if (t === Va.Standard)
    return { type: Le.Principal, prefix: t, address: n };
  const r = kr(e);
  return {
    type: Le.Principal,
    prefix: t,
    address: n,
    contractName: r
  };
}
function ia(e) {
  const t = [], n = ha(e.content), r = n.byteLength;
  return t.push(Kt(sc(r, e.lengthPrefixBytes))), t.push(n), cn(t);
}
function kr(e, t, n) {
  t = t || 1;
  const r = ru(ct(e.readBytes(t))), o = dh(e.readBytes(r));
  return oi(o, t, n ?? 128);
}
function t6(e) {
  return oi(e, 4, 1e5);
}
function eg(e) {
  if (e && lb(e, Sl))
    throw new Error(`Memo exceeds maximum length of ${Sl} bytes`);
  return { type: Le.MemoString, content: e };
}
function n6(e) {
  const t = [], n = ha(e.content), r = b6(ct(n), Sl * 2);
  return t.push(Kt(r)), cn(t);
}
function sb(e) {
  let t = dh(e.readBytes(Sl));
  return t = t.replace(/\u0000*$/, ""), { type: Le.MemoString, content: t };
}
function ob(e) {
  const t = [];
  return t.push(oc(e.address)), t.push(ia(e.contractName)), t.push(ia(e.assetName)), cn(t);
}
function nf(e) {
  return {
    type: Le.AssetInfo,
    address: oa(e),
    contractName: kr(e),
    assetName: kr(e)
  };
}
function xh(e, t) {
  return {
    type: Le.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function Sh(e) {
  const t = e.values, n = [];
  n.push(Kt(sc(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(As(r));
  return cn(n);
}
function ib(e, t, n) {
  const r = ru(ct(e.readBytes(4))), o = [];
  for (let s = 0; s < r; s++)
    switch (t) {
      case Le.Address:
        o.push(oa(e));
        break;
      case Le.LengthPrefixedString:
        o.push(kr(e));
        break;
      case Le.MemoString:
        o.push(sb(e));
        break;
      case Le.AssetInfo:
        o.push(nf(e));
        break;
      case Le.PostCondition:
        o.push(s6(e));
        break;
      case Le.PublicKey:
        o.push(Qd(e));
        break;
      case Le.TransactionAuthField:
        o.push(Z8(e));
        break;
    }
  return xh(o, n);
}
function r6(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(rb(e.principal)), (e.conditionType === Jn.Fungible || e.conditionType === Jn.NonFungible) && t.push(ob(e.assetInfo)), e.conditionType === Jn.NonFungible && t.push(sn(e.assetName)), t.push(e.conditionCode), e.conditionType === Jn.STX || e.conditionType === Jn.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Po("The post-condition amount may not be larger than 8 bytes");
    t.push(So(e.amount, !1, 8));
  }
  return cn(t);
}
function s6(e) {
  const t = e.readUInt8Enum(Jn, (i) => {
    throw new hr(`Could not read ${i} as PostConditionType`);
  }), n = e6(e);
  let r, o, s;
  switch (t) {
    case Jn.STX:
      return r = e.readUInt8Enum(Ka, (a) => {
        throw new hr(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${ct(e.readBytes(8))}`), {
        type: Le.PostCondition,
        conditionType: Jn.STX,
        principal: n,
        conditionCode: r,
        amount: s
      };
    case Jn.Fungible:
      return o = nf(e), r = e.readUInt8Enum(Ka, (a) => {
        throw new hr(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${ct(e.readBytes(8))}`), {
        type: Le.PostCondition,
        conditionType: Jn.Fungible,
        principal: n,
        conditionCode: r,
        amount: s,
        assetInfo: o
      };
    case Jn.NonFungible:
      o = nf(e);
      const i = $r(e);
      return r = e.readUInt8Enum(Wd, (a) => {
        throw new hr(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: Le.PostCondition,
        conditionType: Jn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: o,
        assetName: i
      };
  }
}
function ls(e, t) {
  return cn([e, t]);
}
function o6(e) {
  return new Uint8Array([e.type]);
}
function i6(e) {
  return e.type === ie.OptionalNone ? new Uint8Array([e.type]) : ls(e.type, sn(e.value));
}
function a6(e) {
  const t = new Uint8Array(4);
  return si(t, e.buffer.length, 0), ls(e.type, su(t, e.buffer));
}
function c6(e) {
  const t = uh(g$(e.value, BigInt(T$)), Dm);
  return ls(e.type, t);
}
function l6(e) {
  const t = uh(e.value, Dm);
  return ls(e.type, t);
}
function u6(e) {
  return ls(e.type, oc(e.address));
}
function d6(e) {
  return ls(e.type, su(oc(e.address), ia(e.contractName)));
}
function f6(e) {
  return ls(e.type, sn(e.value));
}
function h6(e) {
  const t = [], n = new Uint8Array(4);
  si(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const o = sn(r);
    t.push(o);
  }
  return ls(e.type, cn(t));
}
function p6(e) {
  const t = [], n = new Uint8Array(4);
  si(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((o, s) => o.localeCompare(s));
  for (const o of r) {
    const s = oi(o);
    t.push(ia(s));
    const i = sn(e.data[o]);
    t.push(i);
  }
  return ls(e.type, cn(t));
}
function ab(e, t) {
  const n = [], r = t == "ascii" ? Om(e.data) : ha(e.data), o = new Uint8Array(4);
  return si(o, r.length, 0), n.push(o), n.push(r), ls(e.type, cn(n));
}
function g6(e) {
  return ab(e, "ascii");
}
function y6(e) {
  return ab(e, "utf8");
}
function sn(e) {
  switch (e.type) {
    case ie.BoolTrue:
    case ie.BoolFalse:
      return o6(e);
    case ie.OptionalNone:
    case ie.OptionalSome:
      return i6(e);
    case ie.Buffer:
      return a6(e);
    case ie.UInt:
      return l6(e);
    case ie.Int:
      return c6(e);
    case ie.PrincipalStandard:
      return u6(e);
    case ie.PrincipalContract:
      return d6(e);
    case ie.ResponseOk:
    case ie.ResponseErr:
      return f6(e);
    case ie.List:
      return h6(e);
    case ie.Tuple:
      return p6(e);
    case ie.StringASCII:
      return g6(e);
    case ie.StringUTF8:
      return y6(e);
    default:
      throw new Po("Unable to serialize. Invalid Clarity Value.");
  }
}
function w6(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const tg = /* @__PURE__ */ new Map();
function cb(e, t) {
  const n = tg.get(e);
  if (n !== void 0)
    return n(t);
  const r = w6(e);
  return tg.set(e, r), cb(e, t);
}
class _a {
  constructor(t) {
    this.consumed = 0, this.source = t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return I$(this.readBytes(4), 0);
  }
  readUInt8() {
    return k$(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return A$(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = ct(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = ct(n);
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
    if (cb(t, r))
      return r;
    throw n(r);
  }
}
function $r(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new _a(Kt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new _a(e) : t = e;
  switch (t.readUInt8Enum(ie, (r) => {
    throw new hr(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case ie.Int:
      return N8(t.readBytes(16));
    case ie.UInt:
      return An(t.readBytes(16));
    case ie.Buffer:
      const r = t.readUInt32BE();
      return Zm(t.readBytes(r));
    case ie.BoolTrue:
      return qm();
    case ie.BoolFalse:
      return Wm();
    case ie.PrincipalStandard:
      const o = oa(t);
      return L8(o);
    case ie.PrincipalContract:
      const s = oa(t), i = kr(t);
      return Ym(s, i);
    case ie.ResponseOk:
      return P8($r(t));
    case ie.ResponseErr:
      return M8($r(t));
    case ie.OptionalNone:
      return Jm();
    case ie.OptionalSome:
      return Qm($r(t));
    case ie.List:
      const a = t.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push($r(t));
      return _8(c);
    case ie.Tuple:
      const u = t.readUInt32BE(), h = {};
      for (let x = 0; x < u; x++) {
        const L = kr(t).content;
        if (L === void 0)
          throw new hr('"content" is undefined');
        h[L] = $r(t);
      }
      return wr(h);
    case ie.StringASCII:
      const d = t.readUInt32BE(), m = b$(t.readBytes(d));
      return xt(m);
    case ie.StringUTF8:
      const w = t.readUInt32BE(), v = dh(t.readBytes(w));
      return U8(v);
    default:
      throw new hr("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const m6 = (e) => e.length % 2 == 0 ? e : `0${e}`, b6 = (e, t) => e.padEnd(t, "0"), lb = (e, t) => e ? ha(e).length > t : !1;
function rf(e) {
  return Lw(e);
}
const Xa = (e) => Y$(yh(e)), vh = (e) => ct(k8(e)), x6 = (e) => ct(Xa(e)), S6 = (e) => {
  const t = Xa(e), n = su(new Uint8Array([0]), new Uint8Array([t.length]), t), r = Xa(n);
  return ct(r);
}, v6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + t.length), n.push(174);
  const r = cn(n), o = Xa(r);
  return ct(o);
}, A6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = cn(n), o = yh(r), s = [];
  s.push(0), s.push(o.length), s.push(o);
  const i = cn(s), a = Xa(i);
  return ct(a);
};
function E6(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function ub(e) {
  const t = sn(e);
  return `0x${ct(t)}`;
}
function k6(e) {
  return $r(e);
}
const zi = (e) => {
  try {
    return fi.c32addressDecode(e), !0;
  } catch {
    return !1;
  }
};
function Ah() {
  return {
    type: Le.MessageSignature,
    data: ct(new Uint8Array(ou))
  };
}
function db(e, t, n, r) {
  const o = bh(0, e, 1, [sa(t)]).hash160, s = pa(sa(t)) ? Wt.Compressed : Wt.Uncompressed;
  return {
    hashMode: e,
    signer: o,
    nonce: Kn(n, !1),
    fee: Kn(r, !1),
    keyEncoding: s,
    signature: Ah()
  };
}
function Ya(e) {
  return "signature" in e;
}
function ng(e) {
  return e === Mt.SerializeP2SH || e === Mt.SerializeP2WSH;
}
function $6(e) {
  return e === Mt.SerializeP2SHNonSequential || e === Mt.SerializeP2WSHNonSequential;
}
function rg(e) {
  const t = rf(e);
  return t.nonce = 0, t.fee = 0, Ya(t) ? t.signature = Ah() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function I6(e) {
  const t = [
    e.hashMode,
    Kt(e.signer),
    So(e.nonce, !1, 8),
    So(e.fee, !1, 8),
    e.keyEncoding,
    mh(e.signature)
  ];
  return cn(t);
}
function L6(e) {
  const t = [
    e.hashMode,
    Kt(e.signer),
    So(e.nonce, !1, 8),
    So(e.fee, !1, 8)
  ], n = xh(e.fields);
  t.push(Sh(n));
  const r = new Uint8Array(2);
  return E$(r, e.signaturesRequired, 0), t.push(r), cn(t);
}
function C6(e, t) {
  const n = ct(t.readBytes(20)), r = BigInt(`0x${ct(t.readBytes(8))}`), o = BigInt(`0x${ct(t.readBytes(8))}`), s = t.readUInt8Enum(Wt, (a) => {
    throw new hr(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === Mt.SerializeP2WPKH && s != Wt.Compressed)
    throw new hr("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = tf(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: o,
    keyEncoding: s,
    signature: i
  };
}
function T6(e, t) {
  const n = ct(t.readBytes(20)), r = BigInt("0x" + ct(t.readBytes(8))), o = BigInt("0x" + ct(t.readBytes(8))), s = ib(t, Le.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case Le.PublicKey:
        pa(u.contents) || (i = !0);
        break;
      case Le.MessageSignature:
        if (u.pubKeyEncoding === Wt.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new Fo("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === Mt.SerializeP2WSH || e === Mt.SerializeP2WSHNonSequential))
    throw new Fo("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: o,
    fields: s,
    signaturesRequired: c
  };
}
function Du(e) {
  return Ya(e) ? I6(e) : L6(e);
}
function Fu(e) {
  const t = e.readUInt8Enum(Mt, (n) => {
    throw new hr(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Mt.SerializeP2PKH || t === Mt.SerializeP2WPKH ? C6(t, e) : T6(t, e);
}
function fb(e, t, n, r) {
  const s = e + ct(new Uint8Array([t])) + ct(So(n, !1, 8)) + ct(So(r, !1, 8));
  if (Kt(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return vh(Kt(s));
}
function hb(e, t, n) {
  const r = 33 + ou, o = pa(t) ? Wt.Compressed : Wt.Uncompressed, s = e + m6(o.toString(16)) + n.data, i = Kt(s);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return vh(i);
}
function B6(e, t, n, r, o) {
  const s = fb(e, t, n, r), i = z8(o, s), a = G8(o), c = hb(s, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function pb(e, t, n, r, o, s) {
  const i = fb(e, t, n, r), a = sa(O8(i, s, o)), c = hb(i, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function N6() {
  const e = db(Mt.SerializeP2PKH, "", 0, 0);
  return e.signer = Q8().hash160, e.keyEncoding = Wt.Compressed, e.signature = Ah(), e;
}
function sg(e, t, n) {
  return Ya(e) ? M6(e, t, n) : P6(e, t, n);
}
function M6(e, t, n) {
  const { pubKey: r, nextSigHash: o } = pb(t, n, e.fee, e.nonce, e.keyEncoding, e.signature), s = bh(0, e.hashMode, 1, [r]).hash160;
  if (s !== e.signer)
    throw new Fo(`Signer hash does not equal hash of public key(s): ${s} != ${e.signer}`);
  return o;
}
function P6(e, t, n) {
  const r = [];
  let o = t, s = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case Le.PublicKey:
        pa(c.contents) || (s = !0), r.push(c.contents);
        break;
      case Le.MessageSignature:
        c.pubKeyEncoding === Wt.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: h } = pb(o, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents);
        if (ng(e.hashMode) && (o = h), r.push(u), i += 1, i === 65536)
          throw new Fo("Too many signatures");
        break;
    }
  if (ng(e.hashMode) && i !== e.signaturesRequired || $6(e.hashMode) && i < e.signaturesRequired)
    throw new Fo("Incorrect number of signatures");
  if (s && (e.hashMode === Mt.SerializeP2WSH || e.hashMode === Mt.SerializeP2WSHNonSequential))
    throw new Fo("Uncompressed keys are not allowed in this hash mode");
  const a = bh(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new Fo(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return o;
}
function gb(e) {
  return {
    authType: tn.Standard,
    spendingCondition: e
  };
}
function yb(e, t) {
  return {
    authType: tn.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || db(Mt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function og(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case tn.Standard:
        return gb(rg(e.spendingCondition));
      case tn.Sponsored:
        return yb(rg(e.spendingCondition), N6());
      default:
        throw new kl("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function _6(e, t) {
  switch (e.authType) {
    case tn.Standard:
      return sg(e.spendingCondition, t, tn.Standard);
    case tn.Sponsored:
      return sg(e.spendingCondition, t, tn.Standard);
    default:
      throw new kl("Invalid origin auth type");
  }
}
function U6(e, t) {
  switch (e.authType) {
    case tn.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Kn(t, !1)
      };
      return { ...e, spendingCondition: n };
    case tn.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Kn(t, !1)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function O6(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Kn(t, !1)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function H6(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Kn(t, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function D6(e, t) {
  const n = {
    ...t,
    nonce: Kn(t.nonce, !1),
    fee: Kn(t.fee, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function F6(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case tn.Standard:
      t.push(Du(e.spendingCondition));
      break;
    case tn.Sponsored:
      t.push(Du(e.spendingCondition)), t.push(Du(e.sponsorSpendingCondition));
      break;
  }
  return cn(t);
}
function j6(e) {
  const t = e.readUInt8Enum(tn, (r) => {
    throw new hr(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case tn.Standard:
      return n = Fu(e), gb(n);
    case tn.Sponsored:
      n = Fu(e);
      const r = Fu(e);
      return yb(n, r);
  }
}
class R6 {
  constructor(t, n, r, o, s, i, a) {
    if (this.version = t, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Kn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? L$, this.postConditionMode = s ?? ra.Deny, this.postConditions = o ?? xh([]), i)
      this.anchorMode = M$(i);
    else
      switch (r.payloadType) {
        case it.Coinbase:
        case it.CoinbaseToAltRecipient:
        case it.NakamotoCoinbase:
        case it.PoisonMicroblock:
        case it.TenureChange:
          this.anchorMode = Zn.OnChainOnly;
          break;
        case it.ContractCall:
        case it.SmartContract:
        case it.VersionedSmartContract:
        case it.TokenTransfer:
          this.anchorMode = Zn.Any;
          break;
      }
  }
  signBegin() {
    const t = rf(this);
    return t.auth = og(t.auth), t.txid();
  }
  verifyBegin() {
    const t = rf(this);
    return t.auth = og(t.auth), t.txid();
  }
  verifyOrigin() {
    return _6(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, tn.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === tn.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, tn.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = this.auth.spendingCondition;
    if (n && !Ya(n)) {
      const r = pa(t);
      n.fields.push(Di(r ? Wt.Compressed : Wt.Uncompressed, t));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, o) {
    const { nextSig: s, nextSigHash: i } = B6(n, r, t.fee, t.nonce, o);
    return Ya(t) ? t.signature = s : t.fields.push(Di(o.data.byteLength === Hm ? Wt.Compressed : Wt.Uncompressed, s)), i;
  }
  txid() {
    const t = this.serialize();
    return vh(t);
  }
  setSponsor(t) {
    if (this.auth.authType != tn.Sponsored)
      throw new kl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = D6(this.auth, t);
  }
  setFee(t) {
    this.auth = U6(this.auth, t);
  }
  setNonce(t) {
    this.auth = O6(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != tn.Sponsored)
      throw new kl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = H6(this.auth, t);
  }
  serialize() {
    if (this.version === void 0)
      throw new Po('"version" is undefined');
    if (this.chainId === void 0)
      throw new Po('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Po('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Po('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Po('"payload" is undefined');
    const t = [];
    t.push(this.version);
    const n = new Uint8Array(4);
    return si(n, this.chainId, 0), t.push(n), t.push(F6(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(Sh(this.postConditions)), t.push(nb(this.payload)), cn(t);
  }
}
function Fi(e) {
  let t;
  typeof e == "string" ? e.slice(0, 2).toLowerCase() === "0x" ? t = new _a(Kt(e.slice(2))) : t = new _a(Kt(e)) : e instanceof Uint8Array ? t = new _a(e) : t = e;
  const n = t.readUInt8Enum(vl, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = t.readUInt32BE(), o = j6(t), s = t.readUInt8Enum(Zn, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), i = t.readUInt8Enum(ra, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = ib(t, Le.PostCondition), c = W8(t);
  return new R6(n, o, c, a, i, s, r);
}
const z6 = T8, Ua = An, G6 = Zm;
const K6 = /* @__PURE__ */ new Set([4001, -31001]), V6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], X6 = ["result", "data", "payload", "response", "params"], ig = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], cu = (e) => typeof e == "string" && e.toLowerCase().includes("xverse"), yi = () => {
  if (!(typeof window > "u")) {
    try {
      const e = window.top;
      if (e && e !== window.self && e.location.origin === window.location.origin)
        return e;
    } catch {
    }
    return window;
  }
}, Ls = (e, t) => {
  if (!(!e || !t))
    return t.split(".").reduce((n, r) => n == null ? void 0 : n[r], e);
}, Y6 = (e, t) => e.id === t.id || !!(e.name && t.name && e.name.toLowerCase() === t.name.toLowerCase()), wb = (e) => {
  if (!e)
    return [];
  const t = e, n = [
    ...t.btc_providers ?? [],
    ...t.webbtc_providers ?? [],
    ...t.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, o) => !!(r != null && r.id) && n.findIndex((s) => Y6(s, r)) === o
  );
}, mb = (e) => e ? wb(yi()).some(
  (t) => {
    var n;
    return t.id === e && (cu(t.id) || ((n = t.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, bb = () => {
  if (typeof window > "u")
    return;
  const e = yi(), t = wb(e).filter(
    (n) => {
      var r;
      return cu(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of t) {
    const r = Ls(e, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of V6) {
    const r = Ls(e, n) ?? (e === window ? void 0 : Ls(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, q6 = (e) => {
  if (typeof window > "u" || !e)
    return;
  const t = yi(), n = Ls(t, e) ?? (t === window ? void 0 : Ls(window, e)) ?? Yl(e);
  if (n)
    return n;
  if (cu(e) || mb(e))
    return bb();
}, Oc = (e, t) => {
  try {
    e == null || e(t);
  } catch {
  }
}, W6 = ["blockstack-session", "blockstack"], Z6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const e of W6) {
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
Z6();
const xb = (e) => e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e, dr = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}, J6 = (e) => {
  const t = dr(e);
  if (!t)
    return null;
  const n = xb(t);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : t.startsWith("0x") || t.startsWith("0X") ? t : `0x${n}`;
}, Q6 = (e) => {
  const t = dr(e);
  if (!t)
    return null;
  const n = xb(t);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, sf = (e, t = "mainnet") => {
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
      return sf(n.network, t);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return sf(r, t);
  }
  return t;
}, Go = (e) => {
  if (typeof e > "u" || e === null)
    return;
  if (typeof e == "bigint")
    return e.toString(10);
  if (typeof e == "number")
    return Number.isFinite(e) ? String(e) : void 0;
  const t = String(e).trim();
  return t.length > 0 ? t : void 0;
}, qa = (e, t = 0) => {
  if (t > 8)
    return null;
  if (typeof e == "string") {
    const o = e.trim();
    return zi(o) ? o : null;
  }
  if (!e)
    return null;
  if (Array.isArray(e)) {
    for (const o of e) {
      const s = qa(o, t + 1);
      if (s)
        return s;
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
  for (const o of r) {
    if (!(o in n))
      continue;
    const s = qa(n[o], t + 1);
    if (s)
      return s;
  }
  return typeof n.mainnet == "string" && zi(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && zi(n.testnet) ? n.testnet.trim() : null;
}, ag = (e) => {
  const t = e && typeof e == "object" && "code" in e ? e.code : void 0, r = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Sb = (e) => {
  if (e && typeof e == "object") {
    const r = "code" in e ? e.code : void 0;
    if (typeof r == "number" && K6.has(r))
      return !0;
  }
  const n = (e instanceof Error ? e.message : String(e ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, ii = (e) => {
  if (e instanceof Error)
    return e;
  const t = e && typeof e == "object" ? e : {}, n = t.error && typeof t.error == "object" ? t.error : null, r = dr(n == null ? void 0 : n.message) ?? dr(t.message) ?? dr(t.error) ?? dr(e) ?? "Wallet provider request failed.", o = new Error(r);
  return o.code = (n == null ? void 0 : n.code) ?? t.code, o.data = (n == null ? void 0 : n.data) ?? t.data, o;
}, aa = (e) => {
  if (e && typeof e == "object") {
    const t = e;
    if (t.error)
      throw ii(t);
    if (t.status === "error")
      throw ii(t.result ?? t);
  }
  return e;
}, cg = async (e, t, n) => {
  if (typeof e.request != "function")
    throw new Error(`Wallet provider does not support request("${t}").`);
  try {
    const r = await e.request(t, n);
    return aa(r);
  } catch (r) {
    throw ii(r);
  }
}, vb = () => bb(), Eh = () => {
  if (typeof window > "u")
    return;
  const e = yi();
  for (const t of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Ls(e, t) ?? (e === window ? void 0 : Ls(window, t));
    if (n)
      return n;
  }
}, lg = () => {
  if (typeof window > "u")
    return;
  const e = Eh();
  if (typeof (e == null ? void 0 : e.transactionRequest) == "function")
    return e;
  const t = yi();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Ls(t, n) ?? (t === window ? void 0 : Ls(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Qc = (e) => {
  var r, o;
  const t = Zo();
  if (cu(t) || mb(t))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = yi() ?? window;
  return e === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || e === ((o = n.xverseProviders) == null ? void 0 : o.StacksProvider) || e === vb();
}, ju = (e) => {
  const t = Q6(e);
  if (!t)
    return null;
  try {
    const n = Fi(t).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, $l = (e, t = 0) => {
  if (t > 6 || typeof e > "u" || e === null)
    return null;
  const n = ju(e), r = J6(e) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? dr(e) ?? void 0 : void 0
    };
  if (Array.isArray(e)) {
    for (const a of e) {
      const c = $l(a, t + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof e != "object")
    return null;
  const o = e;
  let s = null;
  for (const a of ig)
    if (ju(o[a])) {
      s = dr(o[a]);
      break;
    }
  const i = dr(o.txId) || dr(o.txid) || dr(o.transactionId);
  if (i)
    return {
      ...o,
      txId: i,
      txid: i,
      txRaw: s ?? dr(o.txRaw) ?? void 0
    };
  for (const a of ig) {
    const c = ju(o[a]);
    if (c)
      return {
        ...o,
        txId: c,
        txid: c,
        txRaw: dr(o[a]) ?? void 0
      };
  }
  for (const a of X6) {
    const c = o[a], u = $l(c, t + 1);
    if (u)
      return {
        ...o,
        ...c && typeof c == "object" ? c : {},
        ...u,
        txId: u.txId,
        txid: u.txid ?? u.txId
      };
  }
  return null;
}, Ru = (e) => {
  const t = $l(e);
  if (t)
    return t;
  throw new Error("Wallet response did not include a transaction id.");
}, e5 = (e) => {
  const t = $l(e);
  return t || (e && typeof e == "object" ? e : { result: e });
}, t5 = (e) => ({
  ...e,
  fee: Go(e.fee),
  nonce: Go(e.nonce),
  sponsored: e.sponsored === !0
}), ug = (e) => ({
  recipient: e.recipient,
  amount: Go(e.amount) ?? "0",
  memo: e.memo,
  network: sf(e.network),
  address: e.stxAddress,
  fee: Go(e.fee),
  nonce: Go(e.nonce),
  sponsored: e.sponsored ?? !1
}), Ab = "WALLET_ADDRESS_MISMATCH", n5 = 45e3;
let Oa = null;
const of = (e) => {
  e && (Oa = { address: e, at: Date.now() });
}, r5 = () => {
  Oa = null;
}, s5 = () => Oa && Date.now() - Oa.at <= n5 ? Oa.address : null, o5 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t.includes("network mismatch") || t.includes("mismatch") && t.includes("network");
}, i5 = async (e) => {
  r5();
  try {
    await e.request("wallet_disconnect");
  } catch {
  }
  const t = aa(await e.request("wallet_connect")), n = qa(t);
  return of(n), n;
}, a5 = async (e, t, n, r) => {
  try {
    return aa(await e.request(t, n));
  } catch (o) {
    const s = ii(o);
    if (!o5(s))
      throw s;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: t,
      message: s.message
    });
    let i = null;
    try {
      i = await i5(e);
    } catch (a) {
      throw console.info("[wallet:xverse-preflight]", {
        stage: "RECOVERY_RECONNECT_FAILED",
        message: a instanceof Error ? a.message : String(a)
      }), s;
    }
    if (!i || r && i !== r)
      throw Object.assign(
        new Error(
          i ? `Xverse reconnected as ${i}, not the expected ${r}. Switch back to that account and retry.` : s.message
        ),
        { code: i ? Ab : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: t, address: i });
    try {
      return aa(await e.request(t, n));
    } catch (a) {
      throw ii(a);
    }
  }
};
let dg = 3e4;
const c5 = (e, t) => {
  let n;
  const r = new Promise((o, s) => {
    n = setTimeout(() => {
      s(
        Object.assign(
          new Error(`Xverse did not answer ${t} within ${dg / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, dg);
  });
  return Promise.race([e, r]).finally(() => {
    n && clearTimeout(n);
  });
}, l5 = async (e, t, n) => {
  const r = (c, u) => {
    if (t && c !== t)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${t}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Ab }
      );
    return c;
  }, o = s5();
  if (o)
    return Oc(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: o }), r(o, "cached-session");
  let s = null;
  Oc(n, "account-read");
  try {
    const c = aa(
      await c5(e.request("wallet_getAccount"), "wallet_getAccount")
    );
    s = qa(c), console.info("[wallet:xverse-preflight]", {
      stage: s ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: s
    });
  } catch (c) {
    if (Sb(c))
      throw ii(c);
    Oc(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (s)
    return of(s), r(s, "wallet_getAccount");
  let i;
  Oc(n, "account-reconnect");
  try {
    i = aa(await e.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), ii(c);
  }
  const a = qa(i);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return of(a), r(a, "wallet_connect");
}, u5 = async (e, t) => {
  if (!Qc(e)) {
    const s = await cg(
      e,
      "stx_transferStx",
      ug(t)
    );
    return Ru(s);
  }
  const n = Eh();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const s = await cg(
      n,
      "stx_transferStx",
      ug(t)
    );
    return Ru(s);
  }
  const r = vb();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await l5(r, t.stxAddress);
  const o = await a5(
    r,
    "stx_transferStx",
    {
      recipient: t.recipient,
      amount: Go(t.amount) ?? "0",
      ...t.memo ? { memo: t.memo } : {},
      ...t.fee !== void 0 ? { fee: Go(t.fee) } : {}
    },
    t.stxAddress
  );
  return Ru(o);
}, d5 = () => Zo(), Eb = () => {
  var r, o;
  if (typeof window > "u")
    return;
  const e = Zo(), t = e ? q6(e) : void 0;
  if (t)
    return t;
  const n = yi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((o = n.xverseProviders) == null ? void 0 : o.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, fg = (e, t) => {
  const n = Eb(), r = t5({
    ...e,
    onFinish: (o) => {
      var s;
      (s = e.onFinish) == null || s.call(e, e5(o));
    }
  });
  if (!n || typeof n.request != "function")
    return Mc(r, t);
  if (Qc(n) && !Eh()) {
    const o = lg();
    if (o)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Zo(),
        route: "legacy-transaction-request"
      }), Mc(r, o);
  }
  return void u5(n, e).then((o) => {
    var s;
    (s = e.onFinish) == null || s.call(e, o);
  }).catch((o) => {
    var s, i;
    if (ag(o) && Qc(n)) {
      const a = lg();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Zo(),
          route: "legacy-transaction-request"
        }), Mc(r, a);
        return;
      }
    }
    if (ag(o) && !Qc(n)) {
      Mc(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", o), Sb(o)) {
      (s = e.onCancel) == null || s.call(e);
      return;
    }
    if (e.onError) {
      e.onError(o);
      return;
    }
    (i = e.onCancel) == null || i.call(e);
  });
}, f5 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), hg = (e) => ub(e).replace(/^0x/, ""), pg = "This wallet cannot sign messages. Try Xverse or Leather.", gg = (e) => typeof (e == null ? void 0 : e.request) == "function", yg = (e) => typeof (e == null ? void 0 : e.structuredDataSignatureRequest) == "function", h5 = (e) => {
  const t = e && typeof e == "object" ? e.code : void 0, n = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, p5 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(t) || t.includes("no longer supported") || t.includes("request() rpc") || t.includes("upgrade to the");
};
async function g5(e, t) {
  const n = await e.request("stx_signStructuredMessage", {
    message: hg(t.message),
    domain: hg(t.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function y5(e, t) {
  const n = await c$({
    domain: t.domain,
    message: t.message,
    network: nu(t.network),
    stxAddress: t.stxAddress,
    appDetails: t.appDetails ?? f5()
  }), r = await e.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function zu(e) {
  var o, s;
  const t = d5() || "", n = /xverse/i.test(t);
  let r = Eb();
  if (n && !yg(r)) {
    const i = window;
    r = ((o = i.XverseProviders) == null ? void 0 : o.StacksProvider) ?? ((s = i.xverseProviders) == null ? void 0 : s.StacksProvider);
  }
  if (yg(r))
    try {
      return await y5(r, e);
    } catch (i) {
      if (n || !gg(r) || !p5(i)) throw i;
    }
  if (!n && gg(r))
    try {
      return await g5(r, e);
    } catch (i) {
      throw h5(i) ? new Error(pg) : i;
    }
  throw new Error(pg);
}
const wg = 1000000n, ks = 1000000n, Il = 50n, on = 3000n, jr = 300n, va = 3000n, w5 = 50000n, m5 = 300n, b5 = 200n, lu = 15000n, On = (e) => e + Il;
function Mr(e) {
  const t = e < 0n ? "-" : "", n = e < 0n ? -e : e;
  return `${t}${n / wg}.${(n % wg).toString().padStart(6, "0")}`;
}
function mg(e, t = jr) {
  return e <= on ? 0 : Number((e - on) / On(t));
}
function Gu(e, t = 0n) {
  const n = ks - e - t;
  return n > 0n ? n : 0n;
}
function x5(e, t = jr) {
  return e > ks ? "over" : e < on + On(t) ? "empty" : e < w5 ? "low" : "ok";
}
const S5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", v5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", A5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function E5(e) {
  var n, r, o, s;
  const t = (e == null ? void 0 : e.success) === !0 ? (n = e.value) == null ? void 0 : n.value : null;
  return !t || ((r = t.version) == null ? void 0 : r.value) !== "1" || ((o = t["holder-payment"]) == null ? void 0 : o.value) !== "50" || ((s = t["receipt-bytes"]) == null ? void 0 : s.value) !== "16" || A5.some((i, a) => {
    var c;
    return ((c = t["core-" + (a + 1)]) == null ? void 0 : c.value) !== S5 + "." + i;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const kb = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Ku = 3, k5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", $5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0", bg = 1, [af, $b] = kb.split("."), vr = (e) => Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
function cf(e) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(e)) throw Error("Invalid encoded data.");
  return Uint8Array.from(e.match(/../g), (t) => parseInt(t, 16));
}
async function I5(e) {
  return vr(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(e))));
}
async function bo(e, t = {}) {
  const n = await fetch("/hiro/mainnet" + e, { ...t, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Ib(e, t = []) {
  const n = await bo(`/v2/contracts/call-read/${af}/${$b}/${e}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: af, arguments: t.map((r) => "0x" + vr(sn(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return _r($r(n.result));
}
async function L5() {
  const e = await bo(`/v2/contracts/source/${af}/${$b}?proof=0`);
  if (typeof e.source != "string" || await I5(e.source) !== v5) throw Error("Deployed source does not match the tested helper.");
  if (E5(await Ib("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Lb(e) {
  return e.startsWith("SP") && zi(e) && !e.includes(".");
}
async function C5(e) {
  var r;
  if (!Lb(e)) throw Error("Invalid mainnet wallet address.");
  const t = await bo(`/v2/accounts/${e}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(t.balance) || !Number.isSafeInteger(t.nonce) || t.nonce < 0) throw Error("Malformed account data.");
  const n = await bo(`/extended/v1/address/${e}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== t.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= t.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(t.balance), nonce: BigInt(t.nonce) };
}
async function T5(e) {
  const t = await bo(`/v2/accounts/${e}?proof=0`);
  return BigInt(t.balance);
}
async function B5(e, t) {
  var o, s;
  const n = await Ib("get-owner", [Ua(e), Ua(t)]), r = (n == null ? void 0 : n.success) === !0 ? (s = (o = n.value) == null ? void 0 : o.value) == null ? void 0 : s.value : null;
  if (typeof r != "string" || !Lb(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function N5(e, t) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: cf(e), signal: AbortSignal.timeout(15e3) });
  } catch {
    throw Error("Submission outcome unknown. Reconcile the saved transaction before doing anything else.");
  }
  const r = await n.json();
  if (n.status === 400 && (r == null ? void 0 : r.reason) === "FeeTooLow") {
    const o = new Error("Node rejected the fee as too low. No automatic increase. Preview a new test with another fee.");
    throw Object.assign(o, { feeRejected: !0 }), o;
  }
  if (!n.ok || typeof r != "string" || r.replace(/^0x/, "") !== t.replace(/^0x/, "")) throw Error(`Submission unconfirmed (${n.status}). Reconcile or resend the same saved transaction; do not create a replacement.`);
  return r;
}
async function M5(e) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(e)) throw Error("Invalid transaction ID.");
  const t = await fetch(`/hiro/mainnet/extended/v1/tx/${e}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (t.status === 404) return null;
  if (!t.ok) throw Error("Transaction lookup unavailable.");
  return t.json();
}
function P5(e) {
  if (!e.raw || e.raw.length > 16384 || !e.txid) throw Error("Missing or oversized signed transaction.");
  const t = Fi(cf(e.raw)), n = t.auth, r = t.payload, o = n.spendingCondition;
  if (t.version !== 0 || t.chainId !== 1 || n.authType !== 4 || o.hashMode !== 0 || Hi(Ca(Al.MainnetSingleSig, o.signer)) !== e.address || o.fee !== BigInt(e.fee) || o.nonce !== BigInt(e.nonce) || t.txid() !== e.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (t.verifyOrigin(), e.kind === "play") {
    const s = t.postConditions.values[0];
    if (r.payloadType !== 2 || Hi(r.contractAddress) + "." + r.contractName.content !== kb || r.functionName.content !== "play" || r.functionArgs.length !== 3 || vr(sn(r.functionArgs[0])) !== vr(sn(Ua(e.core))) || vr(sn(r.functionArgs[1])) !== vr(sn(Ua(e.song))) || vr(sn(r.functionArgs[2])) !== vr(sn(G6(cf(e.id)))) || e.amount !== "50" || t.postConditionMode !== ra.Deny || t.postConditions.values.length !== 1 || s.conditionType !== 0 || s.amount !== 50n || s.conditionCode !== Ka.Equal || s.principal.prefix !== 2 || Hi(s.principal.address) !== e.address) throw Error("Saved play protection or master does not match.");
  } else if (e.kind === "like") {
    if (r.payloadType !== 2 || Hi(r.contractAddress) + "." + r.contractName.content !== k5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || vr(sn(r.functionArgs[0])) !== vr(sn(Ua(e.song))) || typeof e.liked != "boolean" || vr(sn(r.functionArgs[1])) !== vr(sn(z6(e.liked))) || e.amount !== "0" || t.postConditionMode !== ra.Deny || t.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || _r(r.recipient).value !== e.recipient || r.amount !== BigInt(e.amount)) throw Error("Saved withdrawal does not match.");
}
const _5 = "xtrata.xyz/radio/listening-wallet", U5 = "Link a temporary listening wallet for pay-per-play; no spending permission", ts = (e) => typeof e == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(e) && zi(e), O5 = (e) => ({
  domain: wr({ name: xt(_5), version: xt("1"), "chain-id": An(1) }),
  message: wr({
    purpose: xt(U5),
    main: xt(e.main),
    listening: xt(e.listening),
    issued: An(e.issued)
  })
}), Cb = 100000n, H5 = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function D5(e, t) {
  const n = e.filter((o) => !o || typeof o.sender != "string" || o.sender === t || !ts(o.sender) || !/^\d+$/.test(o.amount) ? !1 : BigInt(o.amount) >= Cb).sort(H5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((o) => o.sender)).size };
}
const Hc = 50;
function Ll(e) {
  const t = e;
  if (!t || typeof t.total != "number" || !Number.isSafeInteger(t.total) || t.total < 0 || !Array.isArray(t.results)) return null;
  const n = [];
  for (const r of t.results) {
    if (typeof (r == null ? void 0 : r.sender) != "string" || typeof r.amount != "string" || typeof r.tx_id != "string") return null;
    const o = Number(r.block_height), s = Number(r.tx_index ?? 0);
    if (!Number.isSafeInteger(o) || !Number.isSafeInteger(s)) return null;
    n.push({ sender: r.sender, amount: r.amount, txId: r.tx_id, blockHeight: o, txIndex: s });
  }
  return { total: t.total, transfers: n };
}
async function F5(e, t, n = 4) {
  if (!ts(e)) return { ok: !1 };
  try {
    const r = (i) => `/extended/v1/address/${e}/stx_inbound?limit=${Hc}&offset=${i}`, o = Ll(await t(r(0)));
    if (!o || o.total > 0 && !o.transfers.length) return { ok: !1 };
    if (o.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let s = Math.max(0, o.total - Hc);
    for (let i = 0; i < n; i++) {
      const a = s === 0 && o.total <= Hc ? o : Ll(await t(r(s)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = D5(a.transfers, e);
      if (c.ok && c.funder) return s > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (s === 0) return c;
      s = Math.max(0, s - Hc);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const Ss = 50, j5 = 6, R5 = 20, xg = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function Sg(e, t) {
  const n = e;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], o = [];
  for (const s of n.results) {
    const i = s && typeof s == "object" && s.tx && typeof s.tx == "object" ? s.tx : s;
    if (!i || typeof i.tx_id != "string" || typeof i.tx_type != "string") return null;
    if (o.push(i.tx_id), i.tx_type !== "token_transfer" || i.sender_address !== t || i.tx_status !== "success") continue;
    const a = i.token_transfer;
    if (!a || typeof a.recipient_address != "string" || typeof a.amount != "string" || !/^\d+$/.test(a.amount)) return null;
    const c = Number(i.block_height), u = Number(i.tx_index ?? 0);
    if (!Number.isSafeInteger(c) || !Number.isSafeInteger(u)) return null;
    r.push({ recipient: a.recipient_address, amount: BigInt(a.amount), txId: i.tx_id, blockHeight: c, txIndex: u });
  }
  return { total: n.total, sent: r, rows: o };
}
async function z5(e, t, n) {
  if (!ts(e)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), o = Ll(await t(`/extended/v1/address/${e}/stx_inbound?limit=${Ss}&offset=0`));
    if (!o || o.total > j5 * Ss) return { ok: !1 };
    for (const i of o.transfers) r.set(i.txId + ":" + i.txIndex, i);
    for (let i = Ss; i < o.total; i += Ss) {
      const a = Ll(await t(`/extended/v1/address/${e}/stx_inbound?limit=${Ss}&offset=${i}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== o.total) return { ok: !1 };
    const s = /* @__PURE__ */ new Map();
    if (n) {
      const i = (u) => `/extended/v1/address/${e}/transactions?limit=${Ss}&offset=${u}`, a = Sg(await t(i(0)), e);
      if (!a || a.total > R5 * Ss) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) s.set(u.txId, u);
      for (let u = Ss; u < a.total; u += Ss) {
        const h = Sg(await t(i(u)), e);
        if (!h || !h.rows.length) return { ok: !1 };
        for (const d of h.rows) c.add(d);
        for (const d of h.sent) s.set(d.txId, d);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...s.values()] };
  } catch {
    return { ok: !1 };
  }
}
function G5(e) {
  const { self: t, balance: n, gift: r } = e;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const o = [...e.inbound].filter((d) => d && typeof d.sender == "string" && d.sender !== t && /^\d+$/.test(d.amount) && BigInt(d.amount) > 0n).sort(xg).map((d, m) => {
    const w = BigInt(d.amount);
    return r && d.sender === r.sender ? { sender: d.sender, left: w, kind: "gift", to: r.payer, at: m } : ts(d.sender) && w >= Cb ? { sender: d.sender, left: w, kind: "deposit", to: d.sender, at: m } : { sender: d.sender, left: w, kind: "dust", to: null, at: m };
  }), s = o.reduce((d, m) => d + m.left, 0n), i = [...e.outgoing].filter((d) => d && d.recipient !== t && ts(d.recipient) && d.amount > 0n).sort(xg), a = i.reduce((d, m) => d + m.amount, 0n), c = s - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (d, m) => {
    let w = m;
    for (const v of d) {
      if (w <= 0n) break;
      const x = v.left < w ? v.left : w;
      v.left -= x, w -= x;
    }
    return w;
  };
  for (const d of i) {
    const m = u(o.filter((w) => w.to === d.recipient), d.amount);
    m > 0n && u(o, m);
  }
  if (u(o, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (o.reduce((d, m) => d + m.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const h = /* @__PURE__ */ new Map();
  for (const d of o) {
    if (d.left <= 0n) continue;
    const m = `${d.kind}:${d.to ?? ""}`, w = h.get(m);
    w ? (w.amount += d.left, w.newest = Math.max(w.newest, d.at)) : h.set(m, { to: d.to, kind: d.kind, amount: d.left, newest: d.at });
  }
  return {
    ok: !0,
    parts: [...h.values()].sort((d, m) => d.newest - m.newest),
    hasTopUp: o.some((d) => d.kind === "deposit")
  };
}
function K5(e, t) {
  const n = e.filter((u) => u.kind === "deposit").sort((u, h) => u.newest - h.newest), r = e.find((u) => u.kind === "gift"), o = e.filter((u) => u.kind === "dust"), s = ((r == null ? void 0 : r.amount) ?? 0n) + o.reduce((u, h) => u + h.amount, 0n), i = [], a = [], c = s > t;
  return n.forEach((u, h) => {
    if (u.amount <= t) {
      a.push(u);
      return;
    }
    const d = h === n.length - 1 && !c;
    i.push({ to: u.to, kind: "deposit", mode: d ? "all" : "amount", send: u.amount - t });
  }), c ? i.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: s - t }) : (r && a.push(r), a.push(...o)), { steps: i, tooSmall: a };
}
function vg(e) {
  const t = e.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (t == null ? void 0 : t.to) ?? null;
}
const Dc = 1500n, el = [100, 250, 500], V5 = (e, t) => BigInt(e) * On(t), Aa = ["prepared", "signed", "unknown", "pending"], X5 = 30 * 6e4, Cl = 6e4, Ci = (e) => {
  const t = e;
  return (t == null ? void 0 : t.feeRejected) === !0 || /\(400\)/.test((t == null ? void 0 : t.message) ?? "");
}, Y5 = 3e3, Tl = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", Vu = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
function q5(e) {
  let t = null, n = -1 / 0, r, o = null, s = null, i, a = -1 / 0, c = null, u = null, h = !1, d = !1, m = !1, w = null, v = !1, x = "", L = "", B = 0, U, A = null, T, _ = [], X, ce = -1 / 0;
  const ne = /* @__PURE__ */ new Set();
  let q = null, b = !1, I = 0, N = null, P = null, W = !1, R = null, le = !1, ue = null, Xe = !1, C = !1, F = !1, re = !1, de = !1, Be = 0, Me = null, Ot = Promise.resolve();
  const Ge = () => BigInt((t == null ? void 0 : t.limits.playFee) ?? jr.toString()), Pe = (g) => !!s && !(s.features ?? []).includes(g), _e = (g, k) => `xtrata.ppp.v1.${g}:${k}`, Pt = "xtrata.ppp.v1.as-main", En = () => {
    if (e.main()) return;
    const g = e.store.get(Pt);
    return g && ts(g) ? g : void 0;
  }, lt = () => e.main() ?? En(), Zt = (g = s == null ? void 0 : s.address) => {
    if (!g) return [];
    try {
      const k = JSON.parse(e.store.get(_e("entries", g)) || "[]");
      return Array.isArray(k) ? k : [];
    } catch {
      return [];
    }
  }, kt = (g) => {
    const k = [g, ...Zt(g.address).filter((V) => !(V.txid === g.txid && V.kind === g.kind))].slice(0, 200);
    e.store.set(_e("entries", g.address), JSON.stringify(k));
  }, z = (g = s == null ? void 0 : s.address) => !!g && e.store.get(_e("on", g)) !== "0", H = (g) => {
    s != null && s.address && e.store.set(_e("on", s.address), g ? "1" : "0");
  }, Q = () => Zt().filter((g) => Aa.includes(g.status)), se = () => Ye() ? [...Q(), ...Zt(Ze()).filter((g) => Aa.includes(g.status))] : Q(), he = () => dt(s == null ? void 0 : s.address), dt = (g) => {
    if (!g) return null;
    try {
      return JSON.parse(e.store.get(_e("deposit", g)) || "null");
    } catch {
      return null;
    }
  }, Ne = (g, k = s == null ? void 0 : s.address) => {
    k && e.store.set(_e("deposit", k), JSON.stringify(g));
  };
  let He = null;
  const St = (g = Cl) => {
    const k = e.now();
    He = { since: He && k < He.until ? He.since : k, until: Math.max((He == null ? void 0 : He.until) ?? 0, k + g) };
  }, Ke = () => !!He && e.now() < He.until && (i === void 0 || i < on + On(Ge())), Ie = () => !!he() || Ke(), Ze = () => Pe("rootLike") ? s == null ? void 0 : s.address : (s == null ? void 0 : s.root) ?? (s == null ? void 0 : s.address), Ye = () => !!(s != null && s.address) && Ze() !== s.address, Ve = () => Ye() ? c && c.for === Ze() ? c.value : void 0 : i, Ht = () => Pe("likeFee") ? b5 : m5, pn = (g) => g !== void 0 && g < on + Ht(), gn = () => Q().filter((g) => e.now() - g.created > X5 && ne.has(g.txid)), Vn = () => (t == null ? void 0 : t.passkeyOnly) === !0 && (!lt() || r === lt() && !t.allowed), $t = () => Vn() && !(s != null && s.linked), un = () => {
    const g = lt();
    return !$t() && !!g && !!(s != null && s.linked) && s.linked !== g;
  }, Ir = (g) => _e("return-to", g), Rr = (g = s == null ? void 0 : s.address) => {
    if (!g) return;
    const k = e.store.get(Ir(g));
    return k && ts(k) && k !== g ? k : void 0;
  }, mr = (g = s == null ? void 0 : s.address) => q && q.for === g ? q.res : null;
  function bt() {
    if (!(s != null && s.address)) return;
    if (s.linked) return { to: s.linked, kind: "linked" };
    const g = Rr();
    if (g) return { to: g, kind: "chosen" };
    const k = mr();
    if (k != null && k.ok && k.funder) return { to: k.funder, kind: "funder" };
  }
  const yn = (g) => _e("gift", g);
  function Dt() {
    const g = s == null ? void 0 : s.address;
    if (!g) return null;
    if ((R == null ? void 0 : R.for) === g) return R.info;
    try {
      const k = JSON.parse(e.store.get(yn(g)) || "null");
      return k && typeof k.returnTo == "string" && typeof k.treasury == "string" ? k : null;
    } catch {
      return null;
    }
  }
  const wn = () => (s == null ? void 0 : s.state) === "unlocked" ? s.root ?? s.address : ((s == null ? void 0 : s.slot) ?? 0) === 0 ? s == null ? void 0 : s.address : void 0;
  let Et = null, Vt = null, zr = !1;
  const us = (g) => _e("award-claim", g), E = (g) => _e("award-send", g), O = (g) => {
    try {
      const k = JSON.parse(e.store.get(E(g)) || "null");
      return k && typeof k.txid == "string" && e.now() - k.at < 2 * 36e5 ? k : null;
    } catch {
      return null;
    }
  }, K = (g) => {
    try {
      const k = JSON.parse(e.store.get(us(g)) || "null");
      return k && typeof k.txid == "string" && e.now() - k.at < 2 * 36e5 ? k : null;
    } catch {
      return null;
    }
  };
  async function D(g = !1) {
    var ke;
    const k = wn();
    if (!k || !e.awardStatus || zr) return;
    const V = (Et == null ? void 0 : Et.for) === k ? Et : null, te = V == null ? void 0 : V.view.state, Te = te === "not-a-player" && ((ke = Dt()) == null ? void 0 : ke.drop) === "players", Y = V ? Te ? 2e4 : te === "off" || te === "not-a-player" ? 30 * 6e4 : K(k) || O(k) ? 2e4 : te === "claimed" ? 10 * 6e4 : 6e4 : 0;
    if (!(V && !g && e.now() - V.at < Y)) {
      zr = !0;
      try {
        const xe = await e.awardStatus(k);
        if (Et = { for: k, view: xe, at: e.now() }, xe.state === "claimed" && e.store.set(us(k), ""), xe.state === "claimed" && xe.holds === !1 && e.store.set(E(k), ""), xe.state === "ready" && e.awardName && (Vt == null ? void 0 : Vt.for) !== k)
          try {
            Vt = { for: k, name: await e.awardName(k), at: e.now() };
          } catch {
            Vt = { for: k, name: void 0, at: e.now() };
          }
      } catch {
        Et = { for: k, view: V && V.view.state !== "off" && V.view.state !== "not-a-player" ? { ...V.view, state: "unavailable" } : { state: "unavailable" }, at: e.now() };
      } finally {
        zr = !1;
      }
    }
  }
  function J() {
    const g = wn();
    if (!g || (Et == null ? void 0 : Et.for) !== g) return null;
    const k = Et.view;
    if (k.state === "off" || k.state === "not-a-player") return null;
    const V = k.state === "claimed" ? null : K(g), te = k.state === "claimed" && k.holds !== !1 ? O(g) : null;
    return { ...k, ...(Vt == null ? void 0 : Vt.for) === g ? { name: Vt.name } : {}, ...V ? { claimTx: V.txid } : {}, ...te ? { sendTx: te.txid } : {} };
  }
  async function ee() {
    var Te;
    const g = s == null ? void 0 : s.address;
    if (!g || !e.giftInfo || !((Te = t == null ? void 0 : t.gifts) != null && Te.enabled) || le) return;
    const k = (R == null ? void 0 : R.for) === g ? R : null, V = k ? k.ok ? k.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (k && e.now() - k.at < V) return;
    le = !0;
    const te = Dt();
    try {
      const Y = await e.giftInfo(g);
      R = { for: g, info: Y, ok: !0, at: e.now() }, e.store.set(yn(g), JSON.stringify(Y));
    } catch {
      R = { for: g, info: te, ok: !1, at: e.now() };
    } finally {
      le = !1;
    }
  }
  const Ce = () => Zt().reduce((g, k) => Aa.includes(k.status) ? g + BigInt(k.amount || "0") + BigInt(k.fee || "0") : g, 0n);
  function Ae() {
    if (i === void 0) return 0;
    const g = i - Ce() - BigInt(jt.length) * On(Ge());
    return g > 0n ? mg(g, Ge()) : 0;
  }
  const Fe = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", ft = "EMPTY — ADD STX TO PLAY";
  function $() {
    if (!(t != null && t.here)) return null;
    const g = (k, V) => ({ reason: k, text: V });
    switch (yt()) {
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
        return Ie() ? g("arriving", "YOUR PLAYS ARE ARRIVING") : g("out", Ye() ? Fe : ft);
      case "ready":
        return !z() || !(s != null && s.session) || s.session.playsLeft < 1 || s.session.expires <= e.now() ? g("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : F ? Ae() < 1 ? g("out", Ye() ? Fe : ft) : null : g("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const pe = () => {
    var g;
    return !!(s != null && s.address) && Ye() && !!((g = Dt()) != null && g.player);
  };
  function ze() {
    return pe() ? { locked: !0, known: !0 } : null;
  }
  const ut = 3 * 6e4, Xt = () => !!Dt() && !!e.history && !(s != null && s.linked);
  async function Ft() {
    const g = s.address, k = Dt(), { balance: V, nonce: te } = await e.chain.account(g), Te = await e.history(g, !0);
    if (!Te.ok) return null;
    const Y = G5({ self: g, balance: V, inbound: Te.inbound, outgoing: Te.outgoing, gift: { sender: k.treasury, payer: k.returnTo } });
    if (!Y.ok) return null;
    const ke = K5(Y.parts, va);
    return { balance: V, nonce: te, parts: Y.parts, steps: ke.steps, tooSmall: ke.tooSmall.length };
  }
  const dn = () => Xe ? { state: "unavailable" } : !ue || e.now() - ue.at > ut || i !== void 0 && i !== ue.balance ? { state: "none" } : ue.plan;
  function yt() {
    if (!(t != null && t.enabled)) return "off";
    if (!t.here) return "elsewhere";
    const g = lt();
    if (!$t()) {
      if (!g) return "connect";
      if (!t.allowed) return "not-invited";
    }
    return s ? s.state === "unsupported" ? "unsupported" : s.state === "none" ? "intro" : un() ? "wrong-wallet" : s.state === "known" ? "locked" : !$t() && s.linked !== g ? "link" : i === void 0 ? "loading" : i > ks && !s.backedUp ? "over" : i < on + On(Ge()) ? "fund" : "ready" : "loading";
  }
  const er = () => {
    var g, k, V, te, Te;
    return {
      step: yt(),
      busy: u,
      message: x,
      error: L,
      notice: Gr(),
      gate: t,
      main: lt(),
      mainConnected: !!e.main(),
      standIn: En(),
      listening: s == null ? void 0 : s.address,
      linked: s == null ? void 0 : s.linked,
      award: J(),
      unproven: !!(s != null && s.unproven),
      phrase: !!(s != null && s.hasBackup),
      backedUp: !!(s != null && s.backedUp),
      balance: i,
      balanceState: i === void 0 ? void 0 : ((Y) => Y === "over" && (s != null && s.backedUp) ? "ok" : Y)(x5(i, Ge())),
      // backed up: over 1 STX reads as a healthy balance
      aboveTarget: i !== void 0 && i > ks && !!(s != null && s.backedUp),
      playsLeft: i === void 0 ? 0 : mg(i, Ge()),
      allowance: i === void 0 ? ks : Gu(i, BigInt(((g = he()) == null ? void 0 : g.amount) ?? "0")),
      session: (s == null ? void 0 : s.session) ?? null,
      payingOn: z(),
      entries: Zt(),
      depositTxid: ((k = he()) == null ? void 0 : k.txid) ?? U,
      depositPending: Ie(),
      arrival: Ie() ? { since: ((V = he()) == null ? void 0 : V.at) ?? (He == null ? void 0 : He.since) ?? e.now(), graceMs: Cl } : null,
      walletOutdated: Pe("like"),
      canAnother: !!s && !Pe("another"),
      canForget: !!s && !Pe("forget"),
      passkeyName: s == null ? void 0 : s.passkeyName,
      hadGift: s != null && s.address && (R == null ? void 0 : R.for) === s.address && R.ok ? !!R.info : null,
      linkedListening: X && X === lt() ? _.map((Y) => Y.listening) : [],
      serverLinked: !!A && T === `${lt()}:${s == null ? void 0 : s.address}`,
      stuck: gn().length,
      armed: re,
      queued: jt.length,
      solo: $t(),
      returnTo: (te = bt()) == null ? void 0 : te.to,
      returnToKind: (Te = bt()) == null ? void 0 : Te.kind,
      funderState: (() => {
        const Y = mr();
        return Y ? Y.ok ? Y.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const Y = mr();
        return !!Y && Y.ok && Y.distinct > 1;
      })(),
      walletCannotSolo: $t() && Pe("standalone"),
      walletCannotMulti: Pe("multi"),
      others: ((s == null ? void 0 : s.others) ?? []).filter((Y) => Y !== lt() && Y !== (s == null ? void 0 : s.linked)),
      creditedTo: $t() && (s != null && s.address) && (N == null ? void 0 : N.for) === s.address && N.main ? N.main : void 0,
      createdHere: !!(s != null && s.address) && e.store.get(_e("created", s.address)) === "1",
      brandNew: !!(s != null && s.address) && i === 0n && (P == null ? void 0 : P.for) === s.address && P.unused,
      gift: (() => {
        const Y = Dt();
        return Y ? { player: Y.player, from: Y.from, source: Y.source, amount: Y.amount, ...Y.drop !== void 0 ? { drop: Y.drop } : {} } : null;
      })(),
      giftPlays: Dt() ? Ae() : 0,
      playCost: On(Ge()),
      giftStop: $(),
      albumLock: ze(),
      returnPlan: dn(),
      slot: (s == null ? void 0 : s.state) === "unlocked" ? s.slot ?? 0 : 0,
      root: (s == null ? void 0 : s.state) === "unlocked" ? s.root ?? s.address : void 0,
      walletCannotAlbums: Pe("slots"),
      likeFunds: (() => {
        var xe;
        const Y = Ze();
        if (!Y || (s == null ? void 0 : s.state) !== "unlocked") return null;
        const ke = Ve();
        return { address: Y, balance: ke, low: pn(ke), album: Ye(), pending: !!dt(Y), txid: (xe = dt(Y)) == null ? void 0 : xe.txid, main: lt() };
      })()
    };
  }, Gr = () => B ? B < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", ve = (g, k = "") => {
    x = g, L = k, e.changed();
  };
  async function Jt(g, k) {
    if (!u) {
      u = g, L = "", e.changed();
      try {
        await k();
      } catch (V) {
        const te = V instanceof Error ? V.message : String(V);
        L = /Cancelled in the listening wallet/.test(te) ? "" : te, L || (x = "Not now. Nothing was signed.", de = !0);
      } finally {
        u = null, await Yn(!0);
      }
    }
  }
  const Ao = () => !!(t != null && t.enabled) && t.here && ($t() || !!lt() && t.allowed), tr = () => Ao() && !un(), Eo = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Xn = () => {
    if (un()) throw new Error(Eo());
  };
  async function Nn() {
    if (!Ao()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(t != null && t.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return o ?? (o = await e.bridge(t.walletOrigin)), o;
  }
  const mn = (g) => {
    const k = lt();
    return g.request("listening.status", k ? { main: k } : void 0);
  };
  async function Ns(g = !1) {
    s != null && s.address && (!g && e.now() - a < 3e4 || (i = await e.chain.balance(s.address), a = e.now(), await ko(g)));
  }
  async function ko(g = !1) {
    const k = Ze();
    if (!(!Ye() || !k || (s == null ? void 0 : s.state) !== "unlocked") && !(!g && (c == null ? void 0 : c.for) === k && e.now() - c.at < 3e4))
      try {
        c = { for: k, value: await e.chain.balance(k), at: e.now() };
      } catch {
      }
  }
  async function wi(g) {
    if ((X !== g || e.now() - ce >= 6e4) && (_ = await e.links(g), X = g, ce = e.now()), (s == null ? void 0 : s.state) !== "unlocked" || s.linked === g) return;
    const k = `${g}:${s.address}`;
    T === k && A || (A = _.find((V) => V.listening === s.address) ?? null, T = k);
  }
  async function Mn() {
    const g = s == null ? void 0 : s.address;
    if (!$t() || !g || s != null && s.linked || !e.funder || b || !i || i <= 0n) return;
    const k = mr(g);
    if (k != null && k.ok && k.funder) return;
    const V = k != null && k.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, I - 1), 30 * 6e4);
    if (!(q && q.for === g && e.now() - q.at < V)) {
      b = !0;
      try {
        q = { for: g, res: await e.funder(g), at: e.now() };
      } catch {
        q = { for: g, res: { ok: !1 }, at: e.now() };
      } finally {
        b = !1;
      }
      I = q.res.ok ? 0 : I + 1;
    }
  }
  async function nr() {
    const g = s == null ? void 0 : s.address;
    if (!(!$t() || !g || s != null && s.linked || !e.mainOf || W) && !(N && N.for === g && (N.ok || e.now() - N.at < 6e4))) {
      W = !0;
      try {
        N = { for: g, main: await e.mainOf(g), ok: !0, at: e.now() };
      } catch {
        N = { for: g, main: null, ok: !1, at: e.now() };
      } finally {
        W = !1;
      }
    }
  }
  async function ds() {
    const g = s == null ? void 0 : s.address;
    if (!(!g || (s == null ? void 0 : s.state) !== "unlocked" || i !== 0n || (P == null ? void 0 : P.for) === g) && e.store.get(_e("created", g)) !== "1")
      try {
        P = { for: g, unused: await e.chain.confirmedNonce(g) === 0n };
      } catch {
      }
  }
  async function Kr() {
    var Te;
    const g = s == null ? void 0 : s.address;
    if (!g) return !1;
    let k, V = !1;
    const te = /* @__PURE__ */ new Map();
    for (const Y of se())
      try {
        const ke = await e.chain.transaction(Y.txid);
        if (!ke) {
          if (ne.add(Y.txid), e.now() - Y.created > 15 * 6e4 && !te.has(Y.address) && te.set(Y.address, await e.chain.confirmedNonce(Y.address)), k = te.get(Y.address), k !== void 0 && k > BigInt(Y.nonce)) {
            kt({ ...Y, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((Y.status === "unknown" || Y.status === "signed") && Y.raw)
            try {
              await e.chain.broadcast(Y.raw, Y.txid), kt({ ...Y, status: "pending" });
            } catch ($e) {
              Ci($e) && kt({ ...Y, status: "failed", note: $e.message, raw: void 0 });
            }
          continue;
        }
        ne.delete(Y.txid);
        const xe = String(ke.tx_status);
        if (xe === "success" && ke.canonical !== !1 && ke.is_unanchored === !1) {
          if (kt({ ...Y, status: "confirmed", confirmedAt: e.now(), actualFee: String(ke.fee_rate ?? Y.fee), raw: void 0 }), V = !0, Y.kind === "like" && (v = !0, Y.status !== "confirmed" && typeof Y.liked == "boolean"))
            try {
              (Te = e.likeConfirmed) == null || Te.call(e, Y.song, Y.liked);
            } catch {
            }
        } else xe.startsWith("abort_") || xe.startsWith("dropped_") ? kt({ ...Y, status: "failed", note: xe, raw: void 0 }) : Y.status !== "pending" && kt({ ...Y, status: "pending" });
      } catch {
      }
    for (const Y of Ye() ? [g, Ze()] : [g]) {
      const ke = dt(Y);
      if (ke)
        try {
          const xe = await e.chain.transaction(ke.txid), $e = String((xe == null ? void 0 : xe.tx_status) ?? "");
          ($e === "success" && xe.is_unanchored === !1 || $e.startsWith("abort_") || $e.startsWith("dropped_") || !xe && e.now() - ke.at > 2 * 36e5) && (Ne(null, Y), $e === "success" && St(2e4), a = -1 / 0, c = null, /on its way/i.test(x) && (x = ""));
        } catch {
        }
    }
    return V;
  }
  async function Yn(g = !1) {
    var k;
    try {
      const V = lt();
      if ((g || !t || r !== V || e.now() - n > 3e5) && (t = await e.config(V), n = e.now(), r = V), !t.enabled || !t.here || !$t() && (!V || !t.allowed)) {
        o && (s != null && s.session) && await o.request("listening.stop").catch(() => {
        }), re && Ms(), e.changed();
        return;
      }
      await Nn(), s = await mn(o), un() && s.state === "unlocked" && (Xr(), await o.request("listening.lock").catch(() => {
      }), i = void 0, s = await mn(o)), V && t.allowed && await wi(V), await Ns(g), await Mn(), await nr(), await ds(), await ee(), await D(), await Kr() && await Ns(!0), await ko(), await bi(), B = 0;
    } catch {
      B++;
    }
    if (yt() === "locked" ? fs() : re && Ms(), v) {
      v = !1;
      try {
        (k = e.likesChanged) == null || k.call(e);
      } catch {
      }
    }
    e.changed(), jt.length && !Os && Dn();
  }
  async function $o(g) {
    const k = s == null ? void 0 : s.root;
    if (!k || s != null && s.slot || !(s != null && s.address) || Pe("slots")) return;
    const V = Number(e.store.get(_e("slot", k)));
    if (!(!Number.isSafeInteger(V) || V < 1))
      try {
        const { balance: te } = await e.chain.account(s.address);
        if (te >= on + On(Ge())) return;
        await g.request("listening.openSlot", { slot: V }), s = await mn(g), i = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function Io(g, k) {
    var Y;
    Xn();
    const V = !(s != null && s.address) || z(s.address), te = s != null && s.linked ? (Y = e.nameOf) == null ? void 0 : Y.call(e, s.linked) : void 0;
    await g.request("listening.unlock", { mode: "unlock", terms: V ? hs() : void 0, anyPasskey: k, ...lt() ? { main: lt() } : {}, ...te ? { label: te } : {} }), s = await mn(g), V && (z(s.address) ? await ln() : await g.request("listening.stop")), await $o(g), ve(V ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const Te = w;
    w = null, Te && e.now() - Te.at < 12e4 && setTimeout(() => void Yn(!0).then(() => ws(Te)), 0);
  }
  function fs() {
    re || u || de || Be >= 3 || !o || !(s != null && s.address) || (re = !0, Ot = (async () => {
      try {
        await Io(o, !1), Be = 0;
      } catch (g) {
        const k = g instanceof Error ? g.message : String(g);
        /Cancelled in the listening wallet/.test(k) ? Me || (de = !0, ve("Not now. Nothing was signed.")) : /did not answer/.test(k) ? await (o == null ? void 0 : o.request("listening.cancel").catch(() => {
        })) : (Be++, L = k);
      } finally {
        re = !1;
        const g = Me;
        Me = null, g ? await g() : await Yn(!0);
      }
    })());
  }
  async function Ms(g) {
    re && (Me = async () => {
    }, await (o == null ? void 0 : o.request("listening.cancel").catch(() => {
    })), await Ot), g && await g(), e.changed();
  }
  const hs = () => ({
    fee: Ge().toString(),
    maxPlays: t.limits.maxSessionPlays,
    budget: ks.toString(),
    expires: e.now() + t.limits.sessionHours * 36e5
  });
  async function ln() {
    if (!(s != null && s.address)) return !1;
    if (F || (F = await e.tabLock(s.address)), !F)
      throw await (o == null ? void 0 : o.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function ps(g, k) {
    const V = s.address, { balance: te, nonce: Te } = k ?? await e.chain.account(V);
    i = te;
    const Y = await o.request("listening.prepareReturn", {
      mode: g.mode,
      balance: te.toString(),
      nonce: Te.toString(),
      fee: va.toString(),
      ...g.amount !== void 0 ? { amount: g.amount.toString() } : {},
      ...g.linked ? {} : { destination: g.to }
    });
    if (Y.recipient !== g.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const ke = g.mode === "amount" ? g.amount : g.mode === "all" ? te - va : te - ks - va, xe = Fi(Y.raw);
    if (_r(xe.payload.recipient).value !== g.to || String(xe.payload.amount) !== Y.amount || ke !== void 0 && Y.amount !== ke.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const $e = {
      id: Vu(),
      address: V,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: Y.recipient,
      amount: Y.amount,
      fee: Y.fee,
      nonce: Te.toString(),
      created: e.now(),
      status: "signed",
      raw: Y.raw,
      txid: Y.txid
    };
    e.validate($e), kt($e);
    try {
      await e.chain.broadcast(Y.raw, Y.txid), kt({ ...$e, status: "pending" });
    } catch (st) {
      throw kt({ ...$e, status: "unknown", note: st.message }), st;
    }
    return Y;
  }
  const mi = lu, Lo = va;
  async function Ps(g, k, V) {
    if ((s == null ? void 0 : s.state) !== "unlocked" || !s.address) throw new Error("Unlock the listening wallet first.");
    if (Pe("slots") || Pe("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const te = s.slot ?? 0;
    if (g === k || ![g, k].includes(te) || ![g, k].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const Te = s.root ?? s.address, Y = g === 0 ? Te : s.address, ke = k === 0 ? Te : s.address, { balance: xe, nonce: $e } = await e.chain.account(Y);
    if (xe < V + Lo + on) throw new Error(g === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const st = await o.request("listening.signMove", { from: g, to: k, amount: V.toString(), fee: Lo.toString(), nonce: $e.toString(), balance: xe.toString() }), S = Fi(st.raw);
    if (st.from !== Y || st.to !== ke || st.amount !== V.toString() || _r(S.payload.recipient).value !== ke || String(S.payload.amount) !== V.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const M = {
      id: Vu(),
      address: Y,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: ke,
      amount: st.amount,
      fee: st.fee,
      nonce: $e.toString(),
      created: e.now(),
      status: "signed",
      raw: st.raw,
      txid: st.txid
    };
    e.validate(M), kt(M);
    try {
      await e.chain.broadcast(st.raw, st.txid), kt({ ...M, status: "pending" });
    } catch (G) {
      throw kt({ ...M, status: "unknown", note: G.message }), G;
    }
    return Ne({ txid: st.txid, amount: st.amount, at: e.now() }, ke), ke === Te && Te !== s.address ? c = null : a = -1 / 0, st;
  }
  let _s = !1;
  const gs = /* @__PURE__ */ new Map(), ys = (g) => _e("float", g);
  async function bi() {
    if (_s || (s == null ? void 0 : s.state) !== "unlocked" || !Ye() || Pe("move") || Pe("rootLike") || !s.address) return;
    const g = s.address;
    if (e.store.get(ys(g)) === "1") return;
    const k = Dt();
    if (!(k != null && k.player) || k.state !== "arrived") return;
    const V = Ve();
    if (V === void 0 || i === void 0) return;
    if (!pn(V)) {
      e.store.set(ys(g), "1");
      return;
    }
    if (dt(Ze()) || Hs() || se().length || i < mi * 4n + on + Lo) return;
    const te = gs.get(g);
    if (!(te && (te.n >= 3 || e.now() - te.at < 5 * 6e4))) {
      _s = !0, gs.set(g, { n: ((te == null ? void 0 : te.n) ?? 0) + 1, at: e.now() });
      try {
        await Ps(s.slot ?? 0, 0, mi), e.store.set(ys(g), "1");
      } catch (Te) {
        console.warn("[radio] likes float not sent yet", Te);
      } finally {
        _s = !1;
      }
    }
  }
  async function Us(g) {
    if (Q().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Pe("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const k = await Ft().catch(() => null);
    if (!k)
      throw ue = null, Xe = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Xe = !1, i = k.balance;
    const V = { balance: k.balance, nonce: k.nonce };
    if (g === "excess") {
      const xe = vg(k.parts) ?? Rr();
      if (!xe) throw new Error("Choose where to send the excess first.");
      await ps({ mode: "excess", to: xe, linked: !1 }, V), ue = null, ve("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const te = k.steps;
    if (!te.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!ue && ue.balance === k.balance && e.now() - ue.at <= ut && ue.steps.length === te.length && ue.steps.every((xe, $e) => xe.to === te[$e].to && xe.mode === te[$e].mode && xe.send === te[$e].send))) {
      ue = {
        at: e.now(),
        balance: k.balance,
        steps: te,
        parts: k.parts,
        plan: { state: "ready", steps: te.map((xe) => ({ to: xe.to, kind: xe.kind, send: xe.send.toString() })), kept: k.tooSmall, excess: vg(k.parts) }
      }, ve(te.length > 1 ? `This goes back in ${te.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const Y = te[0], ke = Y.to ?? Rr();
    if (!ke) throw new Error("Choose where to send the rest first.");
    if (Y.mode === "amount" && Pe("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await ps({ mode: Y.mode, to: ke, linked: !1, ...Y.mode === "amount" ? { amount: Y.send } : {} }, V), ue = null, te.length === 1 ? (H(!1), ve("Returned ✓ Paying is off.")) : ve(`Returned ✓ ${te.length - 1} more ${te.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function Vr() {
    if (!(s != null && s.unproven)) return;
    const g = await Nn();
    await g.request("listening.prove"), s = await mn(g);
  }
  const Lr = {
    forceRefresh: () => Yn(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (g) => {
      if (!e.main() && !(g !== null && !ts(g))) {
        if (g === En()) return Yn(!0);
        e.store.set(Pt, g ?? ""), L = "", x = "", i = void 0, a = -1 / 0, c = null, await Yn(!0);
      }
    },
    /**
     * Remove the open player from this device (the wallet box asks in its own panel; the passkey is not touched). Only
     * the listener's own player, only when it is empty and nothing is on its way: checked here as well as on the page.
     */
    forget: () => Jt("Check the listening wallet…", async () => {
      const g = await Nn();
      if (Pe("forget")) throw new Error("The listening wallet box needs an update before it can do this. Try again shortly.");
      if ((s == null ? void 0 : s.state) !== "unlocked" || (s.slot ?? 0) !== 0) throw new Error("Unlock your own player first.");
      if (i === void 0) throw new Error("Could not read what this player holds. Nothing was removed.");
      if (i > BigInt((t == null ? void 0 : t.limits.returnFee) ?? "3000")) throw new Error("Empty this player first. Nothing was removed.");
      if (Q().length) throw new Error("Wait for the pending payment to confirm. Nothing was removed.");
      Xr(), await g.request("listening.forget"), i = void 0, s = await mn(g), H(!1), ve("Removed from this device ✓");
    }),
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (g) => Jt("Waiting for your passkey…", async () => {
      const k = await Nn(), V = !!(g != null && g.another) && !e.main() && !Pe("another");
      V && (s == null ? void 0 : s.state) === "unlocked" && await k.request("listening.lock"), await k.request("listening.unlock", { mode: "create", terms: hs(), ...e.main() ? { main: e.main() } : {}, ...g != null && g.quick && !e.main() ? { quick: !0 } : {}, ...V ? { another: !0 } : {} }), s = await mn(k), s.address && e.store.set(_e("created", s.address), "1"), H(!0), ve($t() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await ln();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** The intro song has started for someone claiming a new player: its play waits for the plays to land (30 minutes at most). */
    holdFirstPlay: () => {
      Co = e.now() + xi;
    },
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (g) => {
      g ? St() : He = null, e.changed();
    },
    giftSent: (g, k) => {
      !(s != null && s.address) || he() || (Ne({ txid: g, amount: k.toString(), at: e.now() }), a = -1 / 0, R = null, Et && (Et = { ...Et, at: -1 / 0 }), ve("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (g) => {
      if (Xn(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Pe("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await Nn()).request("listening.bindSlot", { slot: g, issued: e.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (g, k, V, te) => {
      Ne({ txid: V, amount: te.toString(), at: e.now() }, k), R = null, await Lr.openAlbum(g), ve("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (g) => Jt("Opening…", async () => {
      if (Xn(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Pe("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (h || d || m) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((s.slot ?? 0) === g) return;
      Xr(), await o.request("listening.openSlot", { slot: g }), s = await mn(o), i = void 0, a = -1 / 0, ue = null, Xe = !1;
      const k = s.root;
      k && g > 0 && e.store.set(_e("slot", k), String(g)), ve(g === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (g = !1) => {
      const k = () => Jt("Waiting for your passkey…", async () => Io(await Nn(), g));
      return re ? g ? Pe("cancel") ? (ve("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Ms(async () => {
        (yt() === "locked" || yt() === "intro") && await k();
      }) : Ot : k();
    },
    link: () => Jt("Sign in your wallet…", async () => {
      Xn();
      const g = e.main();
      if (!g || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      const k = (await e.links(g)).find((V) => V.listening === s.address);
      if (k)
        await o.request("listening.link", { main: g, issued: k.issued, mainSignature: k.mainSignature });
      else {
        const V = { main: g, listening: s.address, issued: e.now() }, te = await e.signWithMain(g, O5(V)), Te = await o.request("listening.link", { main: g, issued: V.issued, mainSignature: te });
        await e.saveLink({ ...V, mainSignature: te, listeningSignature: Te.listeningSignature }), ce = -1 / 0;
      }
      ve("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => s != null && s.unproven ? (await Jt("One more passkey check…", Vr), !(s != null && s.unproven)) : !0,
    deposit: () => Jt("Approve the deposit in your wallet…", async () => {
      Xn(), await Vr();
      const g = e.main();
      if (!g || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      if (he()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (Ke()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await Ns(!0);
      const k = Gu(i ?? 0n);
      if (k <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      U = await e.deposit(g, s.address, k), U && Ne({ txid: U, amount: k.toString(), at: e.now() }), ve("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Jt("Approve the top-up in your wallet…", async () => {
      Xn(), await Vr();
      const g = e.main(), k = Ze();
      if (!g || !k) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (dt(k)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const V = await e.chain.balance(k);
      Ye() ? c = { for: k, value: V, at: e.now() } : (i = V, a = e.now());
      const te = Gu(V);
      if (te <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const Te = await e.deposit(g, k, te);
      Te && Ne({ txid: Te, amount: te.toString(), at: e.now() }, k), ve("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (g) => Jt("Adding plays…", async () => {
      if (Xn(), !Ye()) throw new Error("Open the album you want to add plays to first.");
      if (!el.includes(g)) throw new Error("Choose one of the amounts offered.");
      const k = V5(g, Ge());
      if (h || d || m) throw new Error("Still sending a payment. Try again in a moment.");
      if (se().length || he()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Ps(0, s.slot ?? 0, k), ve("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Jt("Confirm in the listening wallet…", async () => {
      if (!tr()) throw new Error("Connect your wallet first.");
      await ln(), await o.request("listening.approveSession", hs()), H(!0), ve("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Jt("Clearing…", async () => {
      for (const g of gn())
        await e.chain.transaction(g.txid) || kt({ ...g, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      ve("Cleared ✓");
    }),
    switchOff: () => Jt("Switching off…", async () => {
      Xr(), await (o == null ? void 0 : o.request("listening.stop")), H(!1), ve("Music support is off. Playback is paused.");
    }),
    /**
     * Write down the backup words. The wallet box shows them and asks three back; this page never sees a word, only
     * that it was done. For a player that has a phrase, while it is open.
     */
    backup: () => Jt("Showing your backup words in the box…", async () => {
      if (!(s != null && s.hasBackup)) throw new Error("This player was made before backup words existed, so it has none.");
      const g = await Nn();
      await g.request("listening.backup"), s = await mn(g), ve("Backed up ✓ Keep those 24 words somewhere safe and private.");
    }),
    /**
     * The open player signs a request about the albums it keeps (releases.ts). No panel: it is a structured message
     * that can move nothing. Rejects when the player is locked or the wallet box is too old.
     */
    signShelf: async (g, k) => {
      if ((s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock your player first.");
      if (Pe("shelf")) throw new Error("The listening wallet box needs an update before it can keep albums. Try again shortly.");
      return (await Nn()).request("listening.signShelf", { action: g, ...k ? { release: k } : {} });
    },
    /** Ask again where the player's record stands, and what name it would carry (after linking a wallet, say). */
    awardRefresh: async () => {
      Vt = null, await D(!0), e.changed();
    },
    /**
     * Claim the player's Music Hero record. The server signs the record (with the name, or the address alone); the
     * wallet box reads it, shows it and signs the claim; this page sends it. The player pays the network fee only.
     */
    claimAward: (g) => Jt("Confirm in the listening wallet…", async () => {
      var $e, st, S, M;
      const k = wn();
      if ((s == null ? void 0 : s.state) !== "unlocked" || !k) throw new Error("Unlock your player first.");
      if (!e.awardNote) throw new Error("Awards are not available here.");
      if (Pe("award")) throw new Error("The listening wallet box needs an update before it can claim a record. Try again shortly.");
      if (K(k)) throw new Error("Your claim is already on its way. It usually confirms in a minute or two.");
      if (h || d || m || se().length) throw new Error("A payment is still confirming. Claim as soon as it has.");
      await ln();
      const V = await e.awardNote(k, g), { balance: te, nonce: Te } = await e.chain.account(k);
      if (te < Dc) throw new Error("Your player needs a little STX for the network fee to claim. Add plays first.");
      const ke = await (await Nn()).request("listening.signAward", {
        cls: V.cls,
        number: V.number,
        plays: V.plays,
        record: V.record,
        signature: V.signature,
        fee: Dc.toString(),
        nonce: Te.toString(),
        balance: te.toString()
      }), xe = Fi(ke.raw);
      if (ke.hero !== k || ke.number !== V.number || ((st = ($e = xe.payload) == null ? void 0 : $e.functionName) == null ? void 0 : st.content) !== "claim" || ((M = (S = xe.payload) == null ? void 0 : S.contractName) == null ? void 0 : M.content) !== $5.split(".")[1])
        throw new Error("The signed claim does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(ke.raw, ke.txid), e.store.set(us(k), JSON.stringify({ txid: ke.txid, at: e.now() })), a = -1 / 0, Et && (Et = { ...Et, at: -1 / 0 }), ve("Record claimed ✓ It is being made now: about a minute.");
    }),
    /**
     * Send the player's claimed record to another address. The wallet box shows the inscription and the full address
     * and the listener confirms there; the transaction can move that one inscription and nothing else.
     */
    sendAward: (g) => Jt("Confirm in the listening wallet…", async () => {
      var st, S, M;
      const k = wn(), V = J();
      if ((s == null ? void 0 : s.state) !== "unlocked" || !k) throw new Error("Unlock your player first.");
      if ((V == null ? void 0 : V.state) !== "claimed" || V.inscription === void 0) throw new Error("There is no record to send yet.");
      if (V.holds === !1) throw new Error("This record has already been sent.");
      if (V.holds !== !0) throw new Error("Could not check that your player still holds the record. Try again shortly.");
      if (O(k)) throw new Error("Your record is already on its way.");
      const te = g.trim();
      if (!ts(te)) throw new Error("Enter a Stacks address starting SP. A .btc name will not work here.");
      if (te === k) throw new Error("That is your player itself. Enter the address to send it to.");
      if (Pe("sendRecord")) throw new Error("The listening wallet box needs an update before it can send a record. Try again shortly.");
      if (h || d || m || se().length) throw new Error("A payment is still confirming. Send as soon as it has.");
      await ln();
      const { balance: Te, nonce: Y } = await e.chain.account(k);
      if (Te < Dc) throw new Error("Your player needs a little STX for the network fee. Add plays first.");
      const xe = await (await Nn()).request("listening.signSendRecord", { inscription: V.inscription, recipient: te, fee: Dc.toString(), nonce: Y.toString(), balance: Te.toString() }), $e = Fi(xe.raw);
      if (xe.from !== k || xe.recipient !== te || xe.inscription !== V.inscription || ((S = (st = $e.payload) == null ? void 0 : st.functionName) == null ? void 0 : S.content) !== "transfer" || _r((M = $e.payload.functionArgs) == null ? void 0 : M[2]).value !== te)
        throw new Error("The signed send does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(xe.raw, xe.txid), e.store.set(E(k), JSON.stringify({ txid: xe.txid, at: e.now() })), a = -1 / 0, Et && (Et = { ...Et, at: -1 / 0 }), ve("Record sent ✓ It arrives in a minute or two.");
    }),
    lock: () => Jt("Locking…", async () => {
      Xr(), await (o == null ? void 0 : o.request("listening.lock")), i = void 0, ve("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (g) => {
      const k = String(g ?? "").trim();
      if (!(s != null && s.address)) return ve("", "Unlock the listening wallet first.");
      if (!ts(k)) return ve("", "Enter a standard mainnet address (it starts with SP).");
      if (k === s.address) return ve("", "That is this listening wallet itself. Enter a different address.");
      e.store.set(Ir(s.address), k), ve("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      s != null && s.address && e.store.set(Ir(s.address), ""), e.changed();
    },
    returnFunds: (g) => Jt("Check the return in the listening wallet…", async () => {
      if (!tr()) throw new Error("Connect your wallet first.");
      if (!(s != null && s.address)) throw new Error("Unlock the listening wallet first.");
      if (Xt()) return Us(g);
      const k = bt();
      if (!k) throw new Error($t() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (k.kind !== "linked" && Pe("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Q().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await ps({ mode: g, to: k.to, linked: k.kind === "linked" }), g === "all" && H(!1), ve(g === "all" ? k.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, jt = [], rr = 10, xi = 30 * 6e4;
  let Os = !1, Co = 0;
  const ga = (g) => e.now() < Co && (g === "intro" || g === "locked" || g === "link" || g === "fund" && Ie()), Hs = () => h || !!u || d || m, Xr = () => {
    jt.length && (jt.length = 0, e.changed());
  };
  async function Si(g) {
    if (!jt.some((k) => k.id === g.id) && !Zt().some((k) => k.id === g.id) && (jt.push({ ...g, at: e.now() }), jt.length > rr && jt.shift()), Hs() || Q().length) {
      const k = jt.length;
      x = `Queued ${k === 1 ? "this song" : k + " songs"}: paid as soon as the wallet is free.`, e.changed();
    }
    await Dn();
  }
  async function Dn() {
    if (!Os) {
      Os = !0;
      try {
        for (; jt.length; ) {
          for (; jt.length && e.now() - jt[0].at > xi; ) jt.shift();
          if (!jt.length || Hs() || await vi(jt[0]) === "wait") return;
          jt.shift();
        }
      } finally {
        Os = !1, e.changed();
      }
    }
  }
  async function vi(g) {
    var k;
    h = !0;
    try {
      await Yn();
      const V = yt();
      if (V === "loading" || ga(V)) return "wait";
      if (V !== "ready" || !z() || !(s != null && s.session) || s.session.playsLeft < 1 || !F) return "done";
      if (Q().length) return "wait";
      C || (await e.chain.verify(), C = !0);
      const te = s.address, { balance: Te, nonce: Y } = await e.chain.account(te);
      i = Te, a = e.now();
      const ke = await e.chain.owner(Ku, g.song);
      if (ke === te || ke === lt()) return "done";
      const xe = await o.request("listening.signPlay", {
        core: Ku,
        song: g.song,
        receipt: g.id,
        fee: Ge().toString(),
        nonce: Y.toString(),
        balance: Te.toString()
      }), $e = {
        id: g.id,
        address: te,
        kind: "play",
        core: Ku,
        song: g.song,
        recipient: ke,
        amount: "50",
        fee: Ge().toString(),
        nonce: Y.toString(),
        created: e.now(),
        status: "signed",
        raw: xe.raw,
        txid: xe.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...g.title ? { title: String(g.title).slice(0, 120) } : {},
        ...g.artist ? { artist: String(g.artist).slice(0, 120) } : {}
      };
      e.validate($e), kt($e);
      const st = g.title ? `“${g.title}”${g.artist ? ` by ${g.artist}` : ""}` : `song #${g.song}`;
      try {
        await e.chain.broadcast(xe.raw, xe.txid), kt({ ...$e, status: "pending" }), x = `♪ Paid ${st}`, L = "";
      } catch (S) {
        kt({ ...$e, status: Ci(S) ? "failed" : "unknown", note: S.message, ...Ci(S) ? { raw: void 0 } : {} }), L = S.message;
      }
      return s = await mn(o), "done";
    } catch (V) {
      const te = V instanceof Error ? V.message : "payment unavailable";
      return (k = Dt()) != null && k.player ? (x = "Payment is taking a moment: " + te, "wait") : (x = "This song played free: " + te, "done");
    } finally {
      h = !1, e.changed();
    }
  }
  function To(g) {
    return !(t != null && t.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(yt()) || Pe("like") ? !1 : (ws(g), !0);
  }
  async function ws(g) {
    const k = g.title ? `“${g.title}”` : `song #${g.song}`, V = (me) => {
      var Rt;
      L = me, x = "";
      try {
        (Rt = e.likeFailed) == null || Rt.call(e, g.song);
      } catch {
      }
      e.changed();
    }, te = Ye(), Te = yt(), Y = lt(), ke = te && (Te === "fund" || Te === "over") ? "ready" : Te, xe = $t() ? Ze() : Y;
    if (ke === "locked") {
      w = { ...g, at: e.now() }, ve(`Unlock to like ${k}. It sends straight after.`);
      return;
    }
    if (ke === "wrong-wallet") return V(Eo());
    if (ke === "link") return V("Link the listening wallet to your main wallet first, so your likes count for it.");
    if ($t() && Pe("standalone")) return V("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (ke === "fund") return V("Top up the listening wallet to like: each like or unlike costs 0.0003 STX.");
    if (ke === "over") return V("Return the excess first: the listening wallet holds more than 1 STX.");
    if (te) {
      await ko(!0);
      const me = Ve();
      if (pn(me))
        return e.changed(), V(Tl);
    }
    if (ke !== "ready" || !xe) return V("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(s != null && s.session)) return V("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!F) return V("Pay-per-play is running in another tab. Like from that tab.");
    const $e = Zt(Ze()).find((me) => me.kind === "like" && me.song === g.song);
    if ($e && Aa.includes($e.status))
      return V(`Your last like for ${k} is still on its way. It can change again once it confirms.`);
    if (d) return V("One like at a time: your last one is still being sent.");
    if (($e == null ? void 0 : $e.status) === "confirmed" && e.now() - ($e.confirmedAt ?? 0) < Y5)
      return V(`Your like for ${k} has only just confirmed. Try again in a moment.`);
    let st;
    m = !0;
    try {
      st = e.likeState ? (await e.likeState(xe, g.song)).by : g.likedBy ?? [];
    } catch {
      st = g.likedBy;
    } finally {
      m = !1;
    }
    if (!st) return V(`Could not check ${k} right now. Try the heart again.`);
    const S = Ze(), G = (($e == null ? void 0 : $e.status) === "confirmed" && typeof $e.liked == "boolean" && e.now() - ($e.confirmedAt ?? $e.created) < 5 * 6e4 ? $e.liked : void 0) ?? st.includes(S);
    if (!G && st.some((me) => me !== S)) return V($t() ? `${k} was liked from another wallet of yours. Unlike it there.` : `${k} was liked from your main wallet${st.includes(Y) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await Bo({ song: g.song, liked: !G, title: g.title, artist: g.artist });
  }
  async function Bo(g) {
    var te, Te, Y;
    if (d) {
      ve("Still sending your last like. Try again in a moment.");
      return;
    }
    d = !0;
    const k = g.title ? `“${g.title}”${g.artist ? ` by ${g.artist}` : ""}` : `song #${g.song}`, V = e.wait ?? ((ke) => new Promise((xe) => setTimeout(xe, ke)));
    try {
      ve(`${g.liked ? "Liking" : "Unliking"} ${k}…`);
      const ke = e.now() + 12e4;
      for (; h || (Ye() ? Zt(Ze()).some((G) => Aa.includes(G.status)) : Q().length); ) {
        if (e.now() > ke) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await V(5e3), await Yn(!0);
      }
      if (!Ye() && yt() !== "ready" || (s == null ? void 0 : s.state) !== "unlocked" || !s.session) throw new Error("Paying stopped before the like was sent.");
      const xe = Ze(), { balance: $e, nonce: st } = await e.chain.account(xe);
      if (Ye() ? c = { for: xe, value: $e, at: e.now() } : (i = $e, a = e.now()), pn($e)) throw new Error(Tl);
      const S = await o.request("listening.signLike", {
        song: g.song,
        liked: g.liked,
        fee: Ht().toString(),
        nonce: st.toString(),
        balance: $e.toString()
      }), M = {
        id: Vu(),
        address: xe,
        kind: "like",
        core: 0,
        song: g.song,
        liked: g.liked,
        recipient: "",
        amount: "0",
        fee: Ht().toString(),
        nonce: st.toString(),
        created: e.now(),
        status: "signed",
        raw: S.raw,
        txid: S.txid,
        ...g.title ? { title: String(g.title).slice(0, 120) } : {},
        ...g.artist ? { artist: String(g.artist).slice(0, 120) } : {}
      };
      e.validate(M), kt(M);
      try {
        await e.chain.broadcast(S.raw, S.txid), kt({ ...M, status: "pending" }), x = `${g.liked ? "♥ Liked" : "Unliked"} ${k}`, L = "";
        try {
          (te = e.likeSent) == null || te.call(e, g.song, g.liked);
        } catch {
        }
      } catch (G) {
        if (kt({ ...M, status: Ci(G) ? "failed" : "unknown", note: G.message, ...Ci(G) ? { raw: void 0 } : {} }), L = G.message, Ci(G)) try {
          (Te = e.likeFailed) == null || Te.call(e, g.song);
        } catch {
        }
      }
      s = await mn(o);
    } catch (ke) {
      L = "Like not sent: " + (ke instanceof Error ? ke.message : "the listening wallet is unavailable");
      try {
        (Y = e.likeFailed) == null || Y.call(e, g.song);
      } catch {
      }
    } finally {
      d = !1, e.changed(), Dn();
    }
  }
  return { snapshot: er, refresh: Yn, onListened: Si, heart: To, toggleLike: ws, ...Lr };
}
const Tb = ["Connect", "Passkey", "Link & fund", "Listen"], Bb = ["Passkey", "Add 1 STX", "Listen"], lf = (e) => e ? Bb : Tb;
function W5(e) {
  if (e.solo) return Z5(e);
  const t = Tb.length, n = (r, o, s = !1) => ({ at: r, blocked: s, caption: r >= t ? o : `Step ${r + 1} of ${t} · ${o}` });
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
      const r = e.entries.filter((o) => o.kind === "play");
      return r.some((o) => o.status === "confirmed") ? n(t, "Paid plays are taking place") : r.some((o) => ["signed", "pending", "unknown"].includes(o.status)) ? n(3, "first paid play sent, confirming") : n(3, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function Z5(e) {
  const t = Bb.length, n = (r, o, s = !1) => ({ at: r, blocked: s, caption: r >= t ? o : `Step ${r + 1} of ${t} · ${o}` });
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
      const r = e.entries.filter((o) => o.kind === "play");
      return r.some((o) => o.status === "confirmed") ? n(t, "Paid plays are taking place") : r.some((o) => ["signed", "pending", "unknown"].includes(o.status)) ? n(2, "first paid play sent, confirming") : n(2, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function J5(e, t) {
  return !t || t.at >= lf(!!e.solo).length || e.heard || e.step === "wrong-wallet" || e.entries.some((n) => n.kind === "play") || e.creditedTo ? !1 : !(e.step === "locked" && e.linked);
}
const Q5 = (e) => typeof e == "string" && e.toLowerCase().includes("asigna");
function eI(e = typeof window > "u" ? void 0 : window) {
  if (!e) return !1;
  let t = e;
  try {
    const n = e;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (t = n.top);
  } catch {
  }
  return t.LeatherProvider || t.XverseProviders || t.HiroWalletProvider || t.StacksProvider ? !0 : [t.btc_providers, t.webbtc_providers, t.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !Q5(r.id)));
}
const tI = {}, nI = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, rI = (e) => {
  const t = tI;
  return e === "mainnet" ? t.VITE_STACKS_API_MAINNET : t.VITE_STACKS_API_TESTNET;
}, sI = (e) => `/hiro/${e}`, oI = (e) => e.startsWith("/") && typeof window < "u" ? `${window.location.origin}${e}` : e, iI = (e) => {
  const t = rI(e);
  if (t)
    return [oI(t)];
  const n = nI[e];
  return typeof window < "u" ? [`${window.location.origin}${sI(e)}`, ...n.filter((o) => !o.includes("hiro.so"))] : n;
}, aI = {}, Ag = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, cI = "xtrata.log.enabled", lI = "xtrata.log.level", uI = "xtrata.log.tags", dI = "xtrata.log.dedupe", Fc = (e) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(e);
  } catch {
    return null;
  }
}, fI = (e) => {
  if (!e)
    return !0;
  const t = e.toLowerCase();
  return t !== "false" && t !== "0" && t !== "off";
}, hI = (e) => {
  if (!e)
    return null;
  const t = e.toLowerCase();
  return t === "debug" || t === "info" || t === "warn" || t === "error" ? t : null;
}, pI = (e) => {
  if (!e)
    return !1;
  const t = e.toLowerCase();
  return t === "true" || t === "1" || t === "on";
}, gI = (e) => {
  if (!e)
    return null;
  const t = e.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return t.length === 0 ? null : t.includes("*") || t.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(t);
}, yI = () => {
  const e = aI ?? {}, t = Fc(cI) ?? e.VITE_LOG_ENABLED, n = Fc(lI) ?? e.VITE_LOG_LEVEL, r = Fc(uI) ?? e.VITE_LOG_TAGS, o = Fc(dI) ?? e.VITE_LOG_DEDUPE;
  return {
    enabled: fI(t),
    level: hI(n) ?? "warn",
    tags: gI(r),
    dedupe: pI(o)
  };
}, wI = (e, t, n) => !e.enabled || Ag[n] < Ag[e.level] ? !1 : !e.tags || e.tags.has("*") ? !0 : e.tags.has(t.toLowerCase()), mI = (e, t, n, r) => {
  const o = yI();
  if (!wI(o, t, e) || xI(o.dedupe))
    return;
  const s = `[xtrata:${t}] ${n}`, i = console[e] ?? console.log;
  r !== void 0 ? i(s, r) : i(s);
}, bI = /* @__PURE__ */ new Set();
let Eg = null;
const xI = (e, t, n, r, o) => (Eg !== e && (bI.clear(), Eg = e), !1), SI = (e, t, n) => mI("debug", e, t, n), vI = {}, AI = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, EI = (e) => {
  const t = vI, n = e === "testnet" ? t.VITE_BNSV2_CONTRACT_TESTNET : t.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : AI[e];
}, kI = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, $I = (e) => {
  if (!e)
    return null;
  const t = e.trim();
  if (!t)
    return null;
  const n = t.toLowerCase();
  return kI.test(n) ? n : null;
}, II = (e) => e.replace(/\/+$/, ""), LI = (e) => e instanceof Error ? e.message || e.name || "Error" : typeof e == "string" ? e : String(e), kg = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.startsWith("0x") ? e.slice(2) : e;
  if (!t || t.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(t))
    return null;
  let n = "";
  for (let r = 0; r < t.length; r += 2) {
    const o = Number.parseInt(t.slice(r, r + 2), 16);
    if (o < 32 || o > 126)
      return null;
    n += String.fromCharCode(o);
  }
  return n;
}, Ti = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : null, CI = (e) => {
  var c, u;
  let t;
  try {
    t = _r(k6(e));
  } catch {
    return null;
  }
  const n = Ti(t);
  if (!n || n.success === !1)
    return null;
  const r = Ti(n.value), o = Ti(r == null ? void 0 : r.value), s = Ti(o == null ? void 0 : o.value);
  if (!s)
    return null;
  const i = kg((c = Ti(s.name)) == null ? void 0 : c.value), a = kg((u = Ti(s.namespace)) == null ? void 0 : u.value);
  return !i || !a ? null : $I(`${i}.${a}`);
}, TI = async (e) => {
  const [t, n] = e.contractId.split("."), r = `${II(
    e.baseUrl
  )}/v2/contracts/call-read/${t}/${n}/get-primary`, o = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: e.address,
      arguments: [ub(Xm(e.address))]
    }),
    signal: e.signal
  });
  if (!o.ok)
    throw new Error(`BNS primary lookup failed (${o.status})`);
  const s = await o.json();
  return !(s != null && s.okay) || typeof s.result != "string" ? null : CI(s.result);
}, BI = async (e) => {
  const t = e.address.trim();
  if (!zi(t))
    return null;
  const n = EI(e.network);
  if (!n)
    return null;
  let r = null;
  for (const o of iI(e.network))
    try {
      return await TI({
        baseUrl: o,
        contractId: n,
        address: t,
        signal: e.signal
      });
    } catch (s) {
      r = s;
    }
  return SI("bns", "Primary BNS name lookup unavailable", {
    address: t,
    network: e.network,
    error: LI(r)
  }), null;
};
function NI(e, t, n = {}) {
  const r = n.retryAfterMs ?? 3e4, o = n.now ?? Date.now, s = /* @__PURE__ */ new Map(), i = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => e(a)).then((u) => {
      c.pending = !1, u && (c.name = u, t());
    }).catch(() => {
      c.pending = !1, c.failedAt = o();
    });
  };
  return {
    get(a) {
      if (!a) return null;
      let c = s.get(a);
      return c ? !c.pending && c.name === null && c.failedAt !== void 0 && o() - c.failedAt >= r && i(a, c) : (c = { name: null, pending: !1 }, s.set(a, c), i(a, c)), c.name;
    }
  };
}
const $g = Object.freeze({
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
}), Ig = Object.freeze({ 139: "melophonic" });
function Lg(e, t = "") {
  const n = String(e);
  return Object.hasOwn($g, n) ? $g[n] : Object.hasOwn(Ig, n) ? Ig[n] : t;
}
const Cg = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function Tg(e, t = "") {
  return Object.hasOwn(Cg, String(e)) ? Cg[String(e)] : t;
}
const Nb = 10000n, kh = 1000000n, Bl = 3000n, MI = (e, t) => `${e}#gift=${t}`, PI = 100, Ea = (e, t = jr) => e <= on ? 0 : Number((e - on) / On(t)), Bg = (e) => typeof e == "string" && /^[A-Za-z0-9_-]{22}$/.test(e), $h = "xtrata.xyz/radio/gifts", Ta = PI, _I = "Create a prefunded Xtrata radio gift batch", UI = (e) => ({
  domain: wr({ name: xt($h), version: xt("1"), "chain-id": An(1) }),
  message: wr({
    purpose: xt(_I),
    creator: xt(e.creator),
    count: An(e.count),
    amount: An(BigInt(e.amount)),
    label: xt(e.label),
    issued: An(e.issued),
    ...e.player ? { player: xt(e.player) } : {}
  })
}), Mb = (e, t, n = jr) => on + BigInt(e) * On(n) + (t ? lu : 0n), OI = (e, t = jr) => Number((kh - on - (e ? lu : 0n)) / On(t)), Pb = (e, t) => BigInt(e) * (t + Bl);
function HI(e, t, n, r = jr) {
  const o = n ? lu : 0n, s = t > on + o ? t - on - o : 0n, i = Number(s / On(r));
  return {
    plays: i,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(i) * Il,
    fees: BigInt(i) * r,
    reserve: on,
    float: o,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: Bl,
    perCopy: t + Bl,
    total: Pb(e, t)
  };
}
const DI = (e) => e >= Nb && e <= kh, FI = 90, Ng = [30, 90], jI = "Extend my prefunded Xtrata radio gift batches; no spending permission", RI = (e) => ({
  domain: wr({ name: xt($h), version: xt("1"), "chain-id": An(1) }),
  message: wr({ purpose: xt(jI), creator: xt(e.creator), batch: xt(e.batch), days: An(e.days), issued: An(e.issued) })
}), Mg = 40, zI = "Create an Xtrata radio gift player", uf = (e) => typeof e == "string" && /^[0-9a-f]{16}$/.test(e), GI = /^[^\u0000-\u001f\u007f<>]+$/u;
function Pg(e, t, n) {
  return typeof e != "string" ? !1 : e.length ? e.length <= t && e === e.trim() && GI.test(e) : !n;
}
function _b(e) {
  if (!e || typeof e != "object") throw new Error("A player needs a definition.");
  if (!Pg(e.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!Pg(e.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(e.tracks) || e.tracks.length < 1 || e.tracks.length > Mg) throw new Error(`A player holds 1 to ${Mg} songs.`);
  const t = /* @__PURE__ */ new Set();
  for (const o of e.tracks) {
    if (!Number.isSafeInteger(o) || o < 1) throw new Error("Songs are catalogue token numbers.");
    if (t.has(o)) throw new Error("A song appears twice in the list.");
    t.add(o);
  }
  if (e.cover !== null && e.cover !== void 0 && (!Number.isSafeInteger(e.cover) || e.cover < 1)) throw new Error("Cover is a catalogue token number.");
  const n = e.explicit ?? [];
  if (!Array.isArray(n)) throw new Error("Explicit songs: a list of song numbers from the album.");
  for (const o of n) if (!t.has(o)) throw new Error("An explicit song must be one of the album’s songs.");
  const r = [...new Set(n)].sort((o, s) => o - s);
  return { title: e.title, subtitle: e.subtitle ?? "", tracks: [...e.tracks], cover: e.cover ?? null, ...r.length ? { explicit: r } : {} };
}
const Ub = (e) => {
  const t = [...new Set(e.explicit ?? [])].sort((n, r) => n - r);
  return Lf(Bf(new TextEncoder().encode(JSON.stringify({ title: e.title, subtitle: e.subtitle ?? "", tracks: e.tracks, cover: e.cover ?? null, ...t.length ? { explicit: t } : {} }))));
}, KI = (e) => ({
  domain: wr({ name: xt($h), version: xt("1"), "chain-id": An(1) }),
  message: wr({
    purpose: xt(zI),
    admin: xt(e.admin),
    player: xt(e.hash),
    issued: An(e.issued)
  })
}), Hr = (e) => e.tracks.filter((t) => !t.hidden), VI = (e) => e.tracks.find((t) => t.hidden) ?? null, Xu = [300, 500, 1e3], Ha = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], jc = (e) => typeof e == "string" && Ha.some((t) => t.id === e), jo = (e) => Ha.find((t) => t.id === e), XI = (e) => Ha.find((t) => e >= t.min) ?? Ha[Ha.length - 1];
function YI(e, t = jr) {
  return XI(e <= on ? 0 : Number((e - on) / On(t)));
}
const Ob = [
  { tier: "diamond", plays: 1e3, count: 5 },
  { tier: "gold", plays: 500, count: 10 },
  { tier: "silver", plays: 250, count: 20 },
  { tier: "bronze", plays: 100, count: 100 },
  { tier: "classic", plays: 50, count: 865 }
], qI = "1000 Players";
function Ih(e = Ta) {
  const t = [];
  for (const n of Ob) {
    const r = Mb(n.plays, !1);
    for (let o = n.count; o > 0; o -= e) {
      const s = Math.min(o, e), i = t.length + 1;
      t.push({ n: i, tier: n.tier, plays: n.plays, count: s, label: `${qI} ${String(i).padStart(2, "0")}`, amount: r, deposit: Pb(s, r) });
    }
  }
  return t;
}
const Lh = (e = Ih()) => ({
  batches: e.length,
  players: e.reduce((t, n) => t + n.count, 0),
  deposit: e.reduce((t, n) => t + n.deposit, 0n),
  tiers: Ob.map((t) => ({ id: t.tier, plays: t.plays, count: t.count }))
}), WI = 23 * 36e5, _g = (e) => ["todo", "unpaid", "confirming", "touched", "live"].indexOf(e);
function ZI(e, t) {
  const n = e.view;
  return (n == null ? void 0 : n.status) === "live" ? n.copies.waiting === e.count ? "live" : "touched" : e.txid ? "confirming" : t - e.at < WI ? "unpaid" : "todo";
}
function JI(e, t, n) {
  var a;
  const r = t.filter((c) => c.label === e.label && c.player === null && c.count === e.count && c.amount === e.amount.toString() && c.codes.length === e.count).map((c) => ({ b: c, state: ZI(c, n) })).filter((c) => c.state !== "todo").sort((c, u) => _g(u.state) - _g(c.state) || u.b.at - c.b.at), o = r[0];
  if (!o) return { step: e, state: "todo", extras: 0, detail: "not made yet" };
  const s = (a = o.b.view) == null ? void 0 : a.copies, i = o.state === "live" ? `live · all ${e.count} waiting to be claimed` : o.state === "touched" ? `live, but only ${(s == null ? void 0 : s.waiting) ?? 0} of ${e.count} still waiting (${(s == null ? void 0 : s.claimed) ?? 0} claimed)` : o.state === "confirming" ? "paid · waiting for the payment to confirm" : "made · links saved · not paid yet";
  return { step: e, state: o.state, batch: o.b, extras: r.length - 1, detail: o.b.error ? `${i} (${o.b.error})` : i };
}
function Ug(e, t, n = Ih()) {
  var u;
  const r = n.map((h) => JI(h, e, t)), o = [];
  for (const h of r)
    h.extras && o.push(`Batch ${h.step.n} was made more than once. The extra ${h.extras === 1 ? "one is" : "ones are"} not part of the drop: leave ${h.extras === 1 ? "it" : "them"} unpaid, or if paid the money comes back when the copies run out.`), h.state === "touched" && o.push(`Batch ${h.step.n} has copies that are no longer waiting, so the wall would come up short.`);
  const s = r.every((h) => h.state === "live"), i = s ? r.flatMap((h) => h.batch.codes) : [], a = Lh(n).players;
  s && new Set(i).size !== a && o.push(`The links do not add up: ${new Set(i).size} different links for ${a} players.`);
  const c = s && new Set(i).size === a;
  return { steps: r, next: ((u = r.find((h) => h.state === "todo")) == null ? void 0 : u.step) ?? null, done: r.filter((h) => h.state === "live").length, ready: c, codes: c ? i : [], problems: o };
}
function QI(e, t = Ih()) {
  const n = e;
  if (!n || typeof n.total != "number") return { ok: !1, text: "The wall could not be read just now." };
  const r = Lh(t);
  if (n.total === 0) return { ok: !1, text: "The wall is empty: nothing is loaded." };
  const o = n.total - (n.free ?? 0) - (n.held ?? 0) - (n.claimed ?? 0), s = r.tiers.map((u) => {
    var d;
    const h = (d = n.tiers) == null ? void 0 : d.find((m) => m.plays === u.plays);
    return { ...u, got: (h == null ? void 0 : h.total) ?? 0 };
  }), i = s.map((u) => `${u.got} ${jo(u.id).name}`).join(", "), a = (n.tiers ?? []).filter((u) => !r.tiers.some((h) => h.plays === u.plays)), c = n.total === r.players && o === 0 && !!n.tiers && s.every((u) => u.got === u.count) && a.length === 0;
  return c ? { ok: c, text: `The wall holds ${n.total.toLocaleString("en-GB")} players: ${i}. ${n.claimed ?? 0} claimed so far${n.state === "paused" ? " · PAUSED" : ""}.` } : { ok: c, text: `The wall is not the 1,000 yet: ${n.total.toLocaleString("en-GB")} spots${n.tiers ? ` (${i}${a.length ? `, and ${a.reduce((u, h) => u + h.total, 0)} of another size` : ""})` : ""}${o ? `, ${o} no longer available` : ""}.` };
}
const Og = 1800, Yu = /* @__PURE__ */ new Map();
async function eL(e) {
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
function tL(e, t, n, r, o) {
  const s = document.createElement("button");
  return s.type = "button", s.className = r, s.dataset.feedback = e, (() => {
    const a = Yu.get(e), c = !!a && a.until > Date.now();
    s.textContent = c ? a.label : t, s.classList.toggle("is-done", c && a.ok), s.classList.toggle("is-failed", c && !a.ok);
  })(), s.onclick = async () => {
    const a = await n();
    if (a) {
      Yu.set(e, { ...a, until: Date.now() + Og });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === e && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Yu.delete(e), o();
      }, Og + 50);
    }
  }, s;
}
const fr = (e, t, n, r, o) => tL(e, t, async () => await eL(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, o), No = "xtrata.radio.gift.incoming.v1", Hg = (e) => "xtrata.radio.gift.mine.v1:" + e, Dg = (e) => "xtrata.radio.gift.batches.v1:" + e, ge = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, rn = (e, t, n = "") => {
  const r = ge("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, ka = (e, t) => {
  const n = document.createElement("option");
  return n.textContent = e, n.value = t, n;
}, Wn = (e) => Mr(e).replace(/\.?0+$/, "");
function nL(e) {
  let t = null;
  const n = (E) => [5e3, 1e4, 2e4, 3e4][E] ?? 6e4, r = (() => {
    try {
      const E = new URL(location.href), O = new URLSearchParams(E.hash.slice(1)).get("gift") ?? E.searchParams.get("gift");
      return O !== null && (E.searchParams.delete("gift"), history.replaceState(null, "", E.pathname + (E.search || ""))), Bg(O) ? O : null;
    } catch {
      return null;
    }
  })(), o = (() => {
    try {
      const E = JSON.parse(e.store.get(No) || "null");
      return Bg(E == null ? void 0 : E.code) ? E.code : null;
    } catch {
      return null;
    }
  })(), s = r ?? o;
  if (s) {
    t = { code: s }, e.store.set(No, JSON.stringify({ code: s, at: e.now() }));
    let E = 0;
    const O = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (K) => {
      const D = await K.json().catch(() => ({}));
      if (K.status === 404) {
        e.store.set(No, null), t = { ...t, error: (D == null ? void 0 : D.error) || "That gift link is not valid." }, e.changed();
        return;
      }
      if (!K.ok) throw new Error("busy");
      const J = D;
      t = { ...t, view: J, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(J.status) && e.store.set(No, null), e.changed();
    }).catch(() => {
      !t || t.view || (t = { ...t, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, e.changed(), setTimeout(() => void O(), n(E++)));
    });
    O();
  }
  const i = () => !!(t != null && t.view) && t.view.status === "live" && !t.done, a = () => {
    const E = t == null ? void 0 : t.view;
    return !(E != null && E.player) || !i() ? null : { player: E.player, from: d(E), plays: Ea(BigInt(E.amount)) };
  }, c = () => {
    const E = t == null ? void 0 : t.view;
    return !E || E.player || !i() ? null : { plays: Ea(BigInt(E.amount)), from: E.from ? e.who(E.from) : null };
  }, u = () => {
    const E = t == null ? void 0 : t.code;
    if (!E) return [];
    const O = `${location.origin}${location.pathname}#gift=${E}`;
    return [fr("gift-pass-on", "Copy the link to pass on", () => O, "primary", e.changed)];
  }, h = () => {
    t = null, e.store.set(No, null), e.changed();
  }, d = (E) => E.from ? e.who(E.from) : E.label ? `Xtrata Radio · ${E.label}` : "Xtrata Radio";
  let m = {};
  const w = (E) => {
    if (m.box) return m.box;
    const O = ge("div", "", "ppp-gift-check");
    m.box = O;
    const K = () => {
      const D = window.turnstile;
      !D || m.rendered || (m.rendered = !0, D.render(O, { sitekey: E, callback: (J) => {
        m.token = J, e.changed();
      }, "expired-callback": () => {
        m.token = void 0;
      } }));
    };
    if (window.turnstile) K();
    else {
      const D = document.createElement("script");
      D.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", D.async = !0, D.onload = K, document.head.append(D);
    }
    return O;
  }, v = (E) => {
    queueMicrotask(() => void E());
  };
  let x;
  async function L(E) {
    var D, J, ee, Ce, Ae, Fe, ft, $, pe;
    if (!t || t.claiming || !E.listening) return;
    const O = !!((D = t.view) != null && D.player);
    if (O && !E.root) return;
    t.claiming = !0, t.error = void 0, (J = e.claiming) == null || J.call(e, !0), e.changed();
    const K = async (ze) => {
      const ut = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: t.code, turnstile: m.token, ...ze })
      });
      return { res: ut, r: await ut.json().catch(() => ({})) };
    };
    try {
      let ze = 0, ut = E.listening, Xt;
      if (O) {
        const yt = Number((ee = await e.json("/radio/gift/slots?root=" + encodeURIComponent(E.root))) == null ? void 0 : ee.next);
        if (!Number.isSafeInteger(yt) || yt < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        ze = yt;
        for (let er = 0; ; er++) {
          const Gr = await e.album.bind(ze);
          if (ut = Gr.address, Xt = await K({ wallet: ut, binding: Gr }), Xt.res.status === 409 && /just taken/.test(((Ce = Xt.r) == null ? void 0 : Ce.error) || "") && er < 5) {
            ze += 1;
            continue;
          }
          break;
        }
      } else Xt = await K({ wallet: ut });
      const { res: Ft, r: dn } = Xt;
      if (Ft.status === 503 && /sending another gift/.test((dn == null ? void 0 : dn.error) || "")) {
        t.waiting = !0, (Ae = e.claiming) == null || Ae.call(e, !0), clearTimeout(x), x = setTimeout(() => {
          t && (t.waiting = !1, e.changed());
        }, 12e3);
        return;
      }
      if (!Ft.ok) {
        const yt = String((dn == null ? void 0 : dn.error) || "");
        if (Ft.status === 404 || Ft.status === 410 || Ft.status === 409 && /already had a gift|brand-new|already have this album/.test(yt))
          throw e.store.set(No, null), new Error(yt || "This gift cannot be opened.");
        if (Ft.status === 429 || Ft.status === 403 || Ft.status === 400 && !/wallet number/i.test(yt)) throw new Error(yt || `Could not open the gift (${Ft.status}).`);
        const Gr = /topping up/.test(yt) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(yt) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(yt) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Gr), { retry: !0, slow: /topping up|not paid for yet/.test(yt) });
      }
      t.done = !0, e.store.set(No, null), O ? await e.album.arrived(ze, ut, dn.txid, BigInt(dn.amount)) : e.giftSent(dn.txid, BigInt(dn.amount));
    } catch (ze) {
      const ut = ze, Xt = ut.name === "TypeError" || ut.name === "AbortError" || ut.name === "TimeoutError" || /wallet number/i.test(ut.message);
      if (ut.retry || Xt) {
        const Ft = t.tries ?? 0;
        t.tries = Ft + 1, t.retry = { text: ut.retry ? ut.message : "Still sending your gift… the network is slow, trying again." }, (Fe = e.claiming) == null || Fe.call(e, !0), clearTimeout(x), x = setTimeout(() => {
          t && (t.retry = void 0, e.changed());
        }, ut.slow ? 6e4 : n(Ft));
      } else
        t.error = ut.message, (ft = e.claiming) == null || ft.call(e, !1);
      m.token = void 0;
      try {
        (pe = ($ = window.turnstile) == null ? void 0 : $.reset) == null || pe.call($, m.box);
      } catch {
      }
    } finally {
      t.claiming = !1, e.changed();
    }
  }
  let B = null;
  function U(E) {
    if (!E.listening || !E.depositPending || E.step !== "fund")
      return B = null, [];
    if (!B || B.wallet !== E.listening || e.now() - B.at > 3e4) {
      const K = E.listening;
      B = { ...(B == null ? void 0 : B.wallet) === K ? B : {}, wallet: K, at: e.now() }, e.json("/radio/gift/for?wallet=" + encodeURIComponent(K)).then((D) => {
        var J, ee;
        (B == null ? void 0 : B.wallet) === K && (B.state = (J = D == null ? void 0 : D.gift) == null ? void 0 : J.state, B.problem = ((ee = D == null ? void 0 : D.gift) == null ? void 0 : ee.problem) ?? null, e.changed());
      }).catch(() => {
      });
    }
    if (!(B.state === "sending" && B.problem)) return [];
    const O = ge("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return O.title = `Network reply: ${B.problem}`, [O];
  }
  function A(E, O, K = !1) {
    var Fe, ft;
    const D = O.player, J = BigInt(O.amount), ee = K ? [] : [ge("p", `🎁 ${d(O)} sent you “${D.title}”${D.subtitle ? ` by ${D.subtitle}` : ""}: ${Hr(D).length} ${Hr(D).length === 1 ? "song" : "songs"} and ${Ea(J).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!E.root && ["fund", "ready", "over", "link"].includes(E.step))) {
      if (K) return ee;
      if (ee.push(ge("p", E.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : E.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), E.step === "intro") {
        const $ = document.createElement("details");
        $.className = "ppp-how";
        const pe = document.createElement("summary");
        pe.textContent = "How does this work?", $.append(pe, ge("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), ee.push($);
      }
      return ee;
    }
    if (E.walletCannotAlbums)
      return ee.push(ge("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), ee;
    const Ae = (ft = (Fe = E.gate) == null ? void 0 : Fe.gifts) == null ? void 0 : ft.turnstileSiteKey;
    return Ae && !m.token ? ee.push(ge("p", "One quick check and it is yours:", "ppp-mute"), w(Ae)) : !t.claiming && !t.error && !t.waiting && !t.retry && v(() => L(E)), ee.push(...T(E, "Sending your album…")), ee;
  }
  function T(E, O) {
    const K = [];
    return t.claiming || t.waiting ? K.push(ge("p", t.waiting ? "Another gift is on its way out first. Yours is next…" : O, "ppp-cyan")) : t.retry && K.push(ge("p", t.retry.text, "ppp-warn"), rn("Try now", () => {
      clearTimeout(x), t.retry = void 0, L(E);
    }, "quiet")), t.error && /already have this album/i.test(t.error) ? K.push(ge("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...u(), rn("Forget this gift link here", h, "quiet")) : t.error && K.push(ge("p", t.error, "ppp-bad"), rn("Try again", () => {
      t.error = void 0, L(E);
    })), K;
  }
  const _ = (E) => {
    var O;
    return !!t && !t.done && !t.error && i() && !!E.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(t.claiming || t.waiting || t.retry) || !E.linked && !E.creditedTo && (E.createdHere || E.brandNew || !!((O = t.view) != null && O.player)) && (E.balance ?? 0n) === 0n && !E.entries.length);
  };
  function X(E, O = {}) {
    var ut, Xt, Ft, dn;
    const K = U(E);
    if (!t || ["off", "elsewhere"].includes(E.step)) return K;
    const D = t.view;
    if (t.error && !D) return [ge("p", `🎁 ${t.error}`, "ppp-warn")];
    if (!D) return [ge("p", t.retry ? `🎁 ${t.retry.text}` : "🎁 Checking your gift…", t.retry ? "ppp-warn" : "ppp-mute")];
    if (t.done) return K;
    if (D.status === "claimed" || D.status === "claiming") return [ge("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(D.status)) return [ge("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (D.status === "pending-deposit") return [ge("p", `🎁 ${d(D)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (D.player) return [...A(E, D, !!O.bare), ...K];
    const J = !!E.listening && (!(E.createdHere || E.brandNew) || !!E.linked || !!E.creditedTo || (E.balance ?? 0n) > 0n || E.entries.length > 0), ee = J ? ((ut = e.claimNew) == null ? void 0 : ut.call(e, E)) ?? null : null, Ce = ee ? ((Xt = e.replaceOld) == null ? void 0 : Xt.call(e, E)) ?? null : null;
    if (ee && Ce)
      return [
        ge("p", "🎁 A free player is waiting, and this device already has a player you made before. Replace the old one to end up with a single player that has 24 backup words: its balance is sent back first, then it is removed from this device. Or keep both as two separate players.", "ppp-mute"),
        rn("Replace my old player", Ce, "primary"),
        rn("Keep both players", ee, "quiet"),
        rn("Not now", h, "quiet")
      ];
    if (ee)
      return [
        ge("p", "🎁 This device already has a player you made before. You can claim this free one as a new, separate player with its own passkey. Your existing player, and anything in it, stays exactly as it is; you can switch between them with “Use a different listening wallet”.", "ppp-mute"),
        rn("Claim it as a new player", ee, "primary"),
        rn("Not now", h, "quiet")
      ];
    if (J)
      return [ge("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), rn("Forget this gift link here", h, "quiet")];
    const Ae = BigInt(D.amount), Fe = Ea(Ae).toLocaleString(), ft = ge(
      "p",
      `🎁 ${d(D)} sent you ${Wn(Ae)} STX of on-chain music: about ${Fe} paid plays.`,
      "ppp-gift"
    ), $ = O.bare ? [] : [ft], pe = !!E.listening && (E.createdHere || E.brandNew) && !E.linked && !E.creditedTo && E.step === "fund" && (E.balance ?? 1n) === 0n && !E.depositPending && !E.entries.length, ze = (dn = (Ft = E.gate) == null ? void 0 : Ft.gifts) == null ? void 0 : dn.turnstileSiteKey;
    return pe ? (ze && !m.token ? $.push(ge("p", "One quick check and it is yours:", "ppp-mute"), w(ze)) : !t.claiming && !t.error && !t.waiting && !t.retry && v(() => L(E)), $.push(...T(E, "Sending your gift…"))) : E.step === "intro" ? O.bare || $.push(ge("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : E.listening && E.linked ? $.push(ge("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), rn("Forget this gift link here", h, "quiet")) : E.listening && (E.balance ?? 0n) > 0n && $.push(ge("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), rn("Forget this gift link here", h, "quiet")), $;
  }
  async function ce(E, O, K) {
    var D;
    try {
      const J = await e.json("/radio/gift/for?wallet=" + encodeURIComponent(E));
      if ((D = J == null ? void 0 : J.gift) != null && D.returnTo) return { ok: !0, funder: J.gift.returnTo, txId: J.gift.txid ?? void 0, amount: J.gift.amount, distinct: 1 };
    } catch {
      if (K) return { ok: !1 };
    }
    return O();
  }
  const ne = ge("div", "", "ppp-gift-fold");
  let q = 250000n, b = "", I = "";
  const N = (E) => {
    try {
      const O = JSON.parse(e.store.get(Hg(E)) || "[]");
      return Array.isArray(O) ? O : [];
    } catch {
      return [];
    }
  }, P = (E, O) => e.store.set(Hg(E), JSON.stringify(O.slice(0, 50)));
  async function W(E) {
    const O = N(E);
    for (const K of O)
      if (!(K.view && ["claimed", "refunded", "expired"].includes(K.view.status)))
        try {
          K.view = !K.view || K.view.status === "pending-deposit" ? await e.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: K.id, ...K.txid ? { txid: K.txid } : {} }) }) : await e.json("/radio/gift?id=" + K.id), K.error = void 0;
        } catch (D) {
          K.error = D.message;
        }
    P(E, O), e.changed();
  }
  async function R(E) {
    if (b) return;
    b = "Starting your gift…", I = "", e.changed();
    let O = null;
    try {
      O = await e.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: E, amount: q.toString() }) });
      const K = N(E);
      K.unshift({ id: O.id, code: O.code, amount: q.toString(), at: e.now() }), P(E, K), b = "Approve the gift in your wallet…", e.changed();
      const D = await e.pay(E, O.depositTo, BigInt(O.deposit), O.memo), J = N(E), ee = J.find((Ce) => Ce.id === O.id);
      ee && (ee.txid = D, ee.view = { status: "pending-deposit", amount: q.toString(), source: "friend", from: E, label: "", expires: 0 }), P(E, J), I = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", W(E);
    } catch (K) {
      I = K.message || "Not sent.";
    } finally {
      b = "", e.changed();
    }
  }
  const le = (E) => "xtrata.radio.gift.players.v1:" + E, ue = (E) => {
    try {
      const O = JSON.parse(e.store.get(le(E)) || "[]");
      return Array.isArray(O) ? O.filter((K) => K && /^[0-9a-f]{16}$/.test(K.id)) : [];
    } catch {
      return [];
    }
  };
  async function Xe(E, O) {
    var K;
    if (!b) {
      b = "Checking the player…", I = "", e.changed();
      try {
        const D = O.tracks.split(/[\s,]+/).filter(Boolean).map(($) => Number($.replace(/^#/, ""))), J = (O.explicit ?? "").split(/[\s,]+/).map(($) => $.replace(/^#/, "")).filter(Boolean).map(Number), ee = _b({ title: O.title.trim(), subtitle: O.subtitle.trim(), tracks: D, cover: (K = O.cover) != null && K.trim() ? Number(O.cover.trim().replace(/^#/, "")) : null, ...J.length ? { explicit: J } : {} });
        b = "Sign in your wallet…", e.changed();
        const Ce = { admin: E, hash: Ub(ee), issued: e.now() }, Ae = await e.sign(E, KI(Ce));
        b = "Making the player…", e.changed();
        const Fe = await e.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: ee, request: Ce, signature: Ae }) }), ft = ue(E).filter(($) => $.id !== Fe.id);
        ft.unshift({ id: Fe.id, title: Fe.title, tracks: Fe.tracks }), e.store.set(le(E), JSON.stringify(ft.slice(0, 30))), I = `${Fe.existing ? "That player already exists" : "Player made"} ✓ “${Fe.title}” · ${Fe.tracks} songs. Pick it below for a batch.`;
      } catch (D) {
        I = D.message || "Not made.";
      } finally {
        b = "", e.changed();
      }
    }
  }
  const C = (E, O) => MI(E || location.origin + "/radio.html", O), F = (E) => {
    try {
      const O = JSON.parse(e.store.get(Dg(E)) || "[]");
      return Array.isArray(O) ? O.filter((K) => K && /^[0-9a-f]{16}$/.test(K.id) && Array.isArray(K.codes)) : [];
    } catch {
      return [];
    }
  }, re = (E, O) => e.store.set(Dg(E), JSON.stringify([...O.filter((K) => K.codes.length), ...O.filter((K) => !K.codes.length)].slice(0, 80))), de = (E) => !!E.view && E.view.status === "live" && E.view.copies.waiting + E.view.copies.claiming + E.view.copies.refunding === 0, Be = (E, O) => e.json(E, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(O) });
  let Me = 0;
  async function Ot(E) {
    const O = F(E);
    for (const D of O)
      if (!de(D))
        try {
          D.view = !D.view || D.view.status === "pending-deposit" ? await Be("/radio/gift/batch/confirm", { id: D.id, ...D.txid ? { txid: D.txid } : {} }) : await e.json("/radio/gift/batch?id=" + D.id), D.error = void 0;
        } catch (J) {
          D.error = J.message;
        }
    try {
      const D = await e.json("/radio/gift/batches?creator=" + encodeURIComponent(E));
      for (const J of (D == null ? void 0 : D.batches) ?? []) {
        const ee = O.find((Ce) => Ce.id === J.id);
        if (ee) {
          ee.error || (ee.view = J);
          continue;
        }
        O.push({ id: J.id, codes: [], count: J.count, amount: J.amount, label: J.label, player: J.player, depositTo: "", deposit: J.deposit, memo: J.memo, at: 0, view: J });
      }
    } catch {
    }
    const K = /* @__PURE__ */ new Map();
    for (const D of F(E)) (!K.has(D.id) || D.codes.length > K.get(D.id).codes.length) && K.set(D.id, D);
    for (const D of O) {
      const J = K.get(D.id);
      J ? K.set(D.id, { ...J, view: D.view ?? J.view, error: D.error, txid: J.txid ?? D.txid, codes: J.codes.length >= D.codes.length ? J.codes : D.codes, depositTo: J.depositTo || D.depositTo }) : K.set(D.id, D);
    }
    re(E, [...K.values()]), e.changed();
  }
  async function Ge(E, O) {
    const K = F(E).find((D) => D.id === O);
    if (!(!K || !K.depositTo || b)) {
      b = "Approve the payment in your wallet…", I = "", e.changed();
      try {
        const D = await e.pay(E, K.depositTo, BigInt(K.deposit), K.memo), J = F(E), ee = J.find((Ce) => Ce.id === O);
        ee && (ee.txid = D), re(E, J), I = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", b = "", Ot(E);
      } catch (D) {
        I = `${/cancel/i.test(D.message) ? "Payment cancelled." : D.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        b = "", e.changed();
      }
    }
  }
  async function Pe(E, O, K, D) {
    if (b) return;
    if (!O.ok) {
      I = O.reason, e.changed();
      return;
    }
    b = "Sign in your wallet…", I = "", e.changed();
    let J = null;
    try {
      const ee = { creator: E, count: O.count, amount: O.amount.toString(), label: K, issued: e.now(), ...D ? { player: D } : {} }, Ce = await e.sign(E, UI(ee));
      b = "Making your links…", e.changed(), J = await Be("/radio/gift/batch", { request: ee, signature: Ce });
      const Ae = F(E);
      Ae.unshift({ id: J.id, codes: J.codes, count: O.count, amount: J.amount, label: K, player: D ?? null, depositTo: J.depositTo, deposit: J.deposit, memo: J.memo, at: e.now() }), re(E, Ae);
    } catch (ee) {
      I = ee.message || "Not made.", b = "", e.changed();
      return;
    }
    b = "", e.changed(), await Ge(E, J.id);
  }
  async function _e(E, O, K) {
    if (!b) {
      b = "Sign in your wallet (nothing is spent)…", I = "", e.changed();
      try {
        const D = { creator: E, batch: O, days: K, issued: e.now() }, J = await e.sign(E, RI(D));
        b = "Extending…", e.changed();
        const ee = await Be("/radio/gift/batch/extend", { request: D, signature: J }), Ce = F(E);
        for (const Ae of (ee == null ? void 0 : ee.batches) ?? []) {
          const Fe = Ce.find((ft) => ft.id === Ae.id);
          Fe && (Fe.view = Ae, Fe.error = void 0);
        }
        re(E, Ce), I = ee != null && ee.extended ? `Extended ✓ ${ee.extended === 1 ? "That batch has" : `${ee.extended} batches have`} ${K} more days.` : "There was nothing live to extend.";
      } catch (D) {
        I = /cancel/i.test(D.message || "") ? "Cancelled. Nothing changed." : D.message || "Not extended.";
      } finally {
        b = "", e.changed();
      }
    }
  }
  const Pt = (E) => Math.max(0, Math.ceil((E - e.now()) / 864e5));
  function En(E, O) {
    const K = O.filter((ee) => {
      var Ce;
      return ((Ce = ee.view) == null ? void 0 : Ce.status) === "live" && ee.view.copies.waiting > 0;
    });
    if (!K.length) return null;
    const D = Math.min(...K.map((ee) => ee.view.expires)), J = ge("p", "", "ppp-batch-extend");
    J.append(ge("span", `${K.length} live ${K.length === 1 ? "batch" : "batches"} · the first runs out in ${Pt(D)} days. Extend ${K.length === 1 ? "it" : "them all"}: `));
    for (const ee of Ng) {
      const Ce = rn(`+${ee} days`, () => void _e(E, "all", ee), "tiny");
      Ce.disabled = !!b, J.append(Ce);
    }
    return J;
  }
  const lt = () => Zt(!!Ye.value, Ve.value, Ht.value);
  function Zt(E, O, K) {
    const D = O === "max" ? OI(E) : Number(O), J = Mb(D, E), ee = Number(K);
    return !Number.isInteger(ee) || ee < 1 || ee > Ta ? { ok: !1, reason: `Make 1 to ${Ta} copies at a time.`, album: E, plays: D, amount: J, count: ee } : DI(J) ? { ok: !0, reason: "", album: E, plays: D, amount: J, count: ee, bill: HI(ee, J, E) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: E, plays: D, amount: J, count: ee };
  }
  const kt = () => {
    var E;
    return ((E = e.batchDays) == null ? void 0 : E.call(e)) ?? FI;
  }, z = (E = lt()) => {
    if (!E.ok) return E.reason;
    const O = E.bill;
    return `Each copy: ${E.plays.toLocaleString()} paid plays (${Wn(O.holders)} to song holders, ${Wn(O.fees)} network fees)${E.album ? `, ${Wn(O.float)} for the album’s likes` : ""}, ${Wn(O.reserve)} kept so a listener can return what is left, + ${Wn(O.sendFee)} to send it = ${Wn(O.perCopy)} STX. ${E.count} copies = ${Wn(O.total)} STX, paid now in one payment. Copies nobody claims within ${kt()} days come back to you, and you can extend that at any time.`;
  }, H = (E, O) => O.codes.map((K) => C(E, K)), Q = ge("input");
  Q.type = "range", Q.min = String(Nb), Q.max = String(kh), Q.step = "10000", Q.value = String(q), Q.setAttribute("aria-label", "Gift amount");
  const se = ge("p", "", "ppp-gift-amount"), he = rn("", () => {
    const E = e.main();
    E && R(E);
  }, "primary"), dt = () => {
    se.textContent = Ne(), he.textContent = `Gift ${Wn(q)} STX`;
  };
  Q.oninput = () => {
    q = BigInt(Q.value), dt();
  };
  const Ne = () => `${Wn(q)} STX · about ${Ea(q).toLocaleString()} paid plays · you pay ${Wn(q + Bl)} STX with the network fee`;
  dt();
  const He = ge("input");
  He.maxLength = 60, He.placeholder = "Title, e.g. Proof of Sound", He.setAttribute("aria-label", "Player title");
  const St = ge("input");
  St.maxLength = 80, St.placeholder = "Artist (optional)", St.setAttribute("aria-label", "Player subtitle");
  const Ke = ge("textarea");
  Ke.rows = 3, Ke.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Ke.setAttribute("aria-label", "Songs");
  const Ie = ge("input");
  Ie.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", Ie.setAttribute("aria-label", "Explicit songs");
  const Ze = ge("input");
  Ze.inputMode = "numeric", Ze.placeholder = "Cover inscription number (optional), shown when the album loads", Ze.setAttribute("aria-label", "Cover inscription");
  const Ye = ge("select");
  Ye.setAttribute("aria-label", "Batch album");
  const Ve = ge("select");
  Ve.setAttribute("aria-label", "Plays per copy");
  for (const E of [.../* @__PURE__ */ new Set([50, 100, 250, ...Xu])].sort((O, K) => O - K)) Ve.append(ka(`${E.toLocaleString()} plays`, String(E)));
  Ve.append(ka("Max (1 STX)", "max")), Ve.value = String(Xu[0]);
  const Ht = ge("input");
  Ht.type = "number", Ht.min = "1", Ht.max = String(Ta), Ht.value = "10", Ht.setAttribute("aria-label", "Copies");
  const pn = ge("input");
  pn.maxLength = 40, pn.placeholder = "Label, e.g. Opera launch", pn.setAttribute("aria-label", "Batch label");
  const gn = ge("p", "", "ppp-mute"), Vn = () => {
    gn.textContent = z();
  };
  for (const E of [Ye, Ve, Ht])
    E.oninput = Vn, E.onchange = Vn;
  Vn();
  let $t = null, un = 0;
  async function Ir() {
    un = e.now();
    try {
      $t = QI(await e.json("/radio/giveaway/players"));
    } catch {
      $t = { ok: !1, text: "The wall could not be read just now." };
    }
    e.changed();
  }
  const Rr = (E, O) => {
    var D;
    if (((D = Ug(F(E), e.now()).next) == null ? void 0 : D.n) !== O.n) {
      I = "That batch is already made. Check again.", e.changed();
      return;
    }
    Pe(E, Zt(!1, String(O.plays), String(O.count)), O.label);
  };
  function mr(E) {
    var Ce;
    const O = Ug(F(E), e.now()), K = Lh(), D = ge("div", "", "ppp-drop");
    D.append(
      ge("p", `The ${K.players.toLocaleString("en-GB")} players (admin) · ${O.done} of ${K.batches} batches live`, "ppp-cyan"),
      ge("p", `${K.tiers.map((Ae) => `${Ae.count} ${jo(Ae.id).name}`).join(", ")}. ${K.batches} batches, ${Wn(K.deposit)} STX in all, paid from this wallet. One batch at a time, top to bottom: each is a signature, then a payment. The links are saved on this device the moment they are made, so make every batch in this browser.`, "ppp-mute")
    );
    const J = ge("ol", "", "ppp-gift-list ppp-drop-steps");
    for (const Ae of O.steps) {
      const Fe = ge("li"), ft = Ae.state === "live" ? "✓" : Ae.state === "touched" ? "!" : Ae.state === "todo" ? "○" : "…";
      if (Fe.append(ge("span", `${ft} ${Ae.step.n}. ${jo(Ae.step.tier).name} · ${Ae.step.count} × ${Ae.step.plays.toLocaleString("en-GB")} plays · ${Wn(Ae.step.deposit)} STX`, "t"), ge("span", Ae.detail, Ae.state === "live" ? "ppp-ok" : Ae.state === "touched" ? "ppp-warn" : "ppp-mute")), Ae.state === "todo" && ((Ce = O.next) == null ? void 0 : Ce.n) === Ae.step.n) {
        const $ = rn("Sign and pay", () => Rr(E, Ae.step), "tiny");
        $.disabled = !!b, Fe.append($);
      }
      if (Ae.state === "unpaid" && Ae.batch) {
        const $ = rn("Pay now", () => void Ge(E, Ae.batch.id), "tiny");
        $.disabled = !!b, Fe.append($);
      }
      J.append(Fe);
    }
    D.append(J);
    for (const Ae of O.problems) D.append(ge("p", Ae, "ppp-warn"));
    O.ready ? D.append(
      ge("p", `All ${K.batches} batches are live: ${O.codes.length.toLocaleString("en-GB")} links, none claimed. Copy them, then in Terminal (in the xtrata-2.0 folder) run:  node scripts/load-players-wall.mjs`, "ppp-ok"),
      fr("drop-copy", `Copy the ${O.codes.length.toLocaleString("en-GB")} links`, () => O.codes.join(`
`), "tiny", e.changed)
    ) : D.append(ge("p", "The links can be copied for the wall once every batch is live.", "ppp-mute")), e.now() - un > 6e4 && Ir(), $t && D.append(ge("p", $t.text, $t.ok ? "ppp-ok" : "ppp-mute"));
    const ee = rn("Check again", () => {
      Me = e.now(), Ot(E), Ir();
    }, "tiny");
    return ee.disabled = !!b, D.append(ee), D;
  }
  function bt(E, O, K) {
    const D = O.view, J = D == null ? void 0 : D.copies, ee = O.error ? O.error : !D || D.status === "pending-deposit" ? O.txid ? "payment confirming…" : "waiting for your payment" : `${J.claimed} of ${D.count} claimed${J.refunding + J.refunded ? ` · ${J.refunded} refunded${J.refunding ? `, ${J.refunding} on their way` : ""}` : ""}`, Ce = ge("li");
    if (Ce.append(ge("span", `${O.label || "Batch"} · ${O.count} × ${Wn(BigInt(O.amount))} STX`, "t"), ge("span", ee, "ppp-mute")), !O.txid && O.depositTo && (!D || D.status === "pending-deposit") && Ce.append(rn("Pay now", () => void Ge(E, O.id), "tiny")), (D == null ? void 0 : D.status) === "live" && J.waiting > 0) {
      Ce.append(ge("span", `${Pt(D.expires)} days left`, "ppp-mute"));
      for (const Ae of Ng) {
        const Fe = rn(`+${Ae}`, () => void _e(E, O.id, Ae), "tiny");
        Fe.title = `Extend this batch by ${Ae} days (a signature, no payment)`, Fe.setAttribute("aria-label", `Extend ${O.label || "this batch"} by ${Ae} days`), Fe.disabled = !!b, Ce.append(Fe);
      }
    }
    if (O.codes.length && (D == null ? void 0 : D.status) === "live") {
      const Ae = H(K, O);
      Ce.append(
        fr("batch-copy:" + O.id, "Copy all links", () => Ae.join(`
`), "tiny", e.changed),
        fr("batch-csv:" + O.id, "Copy as CSV", () => ["copy,link", ...Ae.map((Fe, ft) => `${ft + 1},${Fe}`)].join(`
`), "tiny", e.changed)
      );
    } else O.codes.length || Ce.append(ge("span", "links were made on another device", "ppp-mute"));
    return Ce;
  }
  const yn = ge("select");
  yn.setAttribute("aria-label", "Plays in each copy");
  for (const E of [.../* @__PURE__ */ new Set([50, 100, 250, ...Xu])].sort((O, K) => O - K)) yn.append(ka(`${E.toLocaleString()} plays`, String(E)));
  yn.value = "50";
  const Dt = ge("input");
  Dt.type = "number", Dt.min = "1", Dt.max = String(Ta), Dt.value = "10", Dt.setAttribute("aria-label", "How many copies");
  const wn = ge("input");
  wn.maxLength = 40, wn.placeholder = "A note recipients see, e.g. Launch week (optional)", wn.setAttribute("aria-label", "Note for recipients");
  const Et = ge("p", "", "ppp-mute");
  function Vt(E, O, K) {
    const D = () => Zt(!0, yn.value, Dt.value), J = () => {
      Et.textContent = z(D());
    };
    for (const pe of [yn, Dt])
      pe.oninput = J, pe.onchange = J;
    J();
    const ee = () => (wn.value.trim() || O.title).replace(/[^ -~]/g, "").slice(0, 40), Ce = rn("Sign, pay and make links", () => {
      Pe(E, D(), ee(), O.id);
    }, "primary");
    Ce.disabled = !!b;
    const Ae = (pe, ze) => {
      const ut = ge("label", pe);
      return ut.append(ze), ut;
    }, Fe = [
      ge("p", "Each copy is a link. Whoever opens it gets this album with its own plays, paid for by you. You pay for every copy now, in one payment; copies nobody claims come back to you when their time runs out, and you can extend that.", "ppp-mute"),
      Ae("Plays in each ", yn),
      Ae("Copies ", Dt),
      wn,
      Et,
      Ce
    ];
    e.now() - Me > 3e4 && (Me = e.now(), Ot(E));
    const ft = F(E).filter((pe) => pe.player === O.id);
    if (ft.length) {
      const pe = ge("ul", "", "ppp-gift-list");
      for (const ze of ft.slice(0, 10)) pe.append(bt(E, ze, K));
      Fe.push(pe);
    }
    const $ = En(E, F(E));
    return $ && Fe.push($), b && Fe.push(ge("p", b, "ppp-cyan")), I && Fe.push(ge("p", I, /✓/.test(I) ? "ppp-ok" : "ppp-warn")), Fe;
  }
  function zr(E) {
    var J, ee;
    const O = (J = E.gate) == null ? void 0 : J.gifts;
    if (!(O != null && O.enabled) || !O.admin || ["off", "elsewhere", "unsupported"].includes(E.step)) return null;
    const K = e.main(), D = [ge("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!K)
      D.push(ge("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (O.admin) {
      const Ce = ge("div", "", "ppp-gift-admin"), Ae = (ze, ut) => {
        const Xt = ge("label", ze);
        return Xt.append(ut), Xt;
      }, Fe = ue(K);
      Ce.append(
        ge("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        He,
        St,
        Ke,
        Ze,
        Ie,
        rn("Sign and make player", () => void Xe(K, { title: He.value, subtitle: St.value, tracks: Ke.value, cover: Ze.value, explicit: Ie.value }))
      );
      const ft = rn("Sign, pay and make links", () => {
        Pe(K, lt(), pn.value.trim(), Ye.value || void 0);
      });
      ft.disabled = !!b;
      const $ = Ye.value;
      Ye.replaceChildren(ka("No album (starter copies)", ""), ...Fe.map((ze) => ka(`${ze.title} · ${ze.tracks} songs`, ze.id))), Fe.some((ze) => ze.id === $) && (Ye.value = $), Vn(), Ce.append(
        ge("p", `Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after ${kt()} days unless you extend`, "ppp-cyan"),
        Ae("Album ", Ye),
        Ae("Plays each ", Ve),
        Ae("Copies ", Ht),
        pn,
        gn,
        ft
      ), e.now() - Me > 3e4 && (Me = e.now(), Ot(K));
      const pe = F(K);
      if (pe.length) {
        const ze = ge("ul", "", "ppp-gift-list");
        for (const Xt of pe.slice(0, 20)) ze.append(bt(K, Xt, ((ee = E.gate) == null ? void 0 : ee.radioUrl) ?? null));
        Ce.append(ze);
        const ut = En(K, pe);
        ut && Ce.append(ut);
      }
      Ce.append(mr(K)), D.push(Ce);
    }
    return b && D.push(ge("p", b, "ppp-cyan")), I && D.push(ge("p", I, /✓/.test(I) ? "ppp-ok" : "ppp-warn")), ne.replaceChildren(...D), ne;
  }
  return { banner: X, funder: ce, renderFold: zr, copies: Vt, liveGift: i, incomingAlbum: a, incomingStarter: c, setAside: h, pendingCode: () => t && !t.done && (!t.view || t.view.status === "live") ? t.code : null, inProgress: _ };
}
const rL = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function sL(e) {
  if (!Array.isArray(e)) return [];
  const t = [];
  for (const n of e) {
    if (!n || !Number.isSafeInteger(n.slot) || n.slot < 1 || typeof n.address != "string") continue;
    const r = n.player, o = r && typeof r.id == "string" && typeof r.title == "string" && Array.isArray(r.tracks) ? r : null;
    o && t.push({
      slot: n.slot,
      address: n.address,
      state: n.state === "arrived" ? "arrived" : "sending",
      amount: String(n.amount ?? "0"),
      label: typeof n.label == "string" ? n.label : "",
      from: typeof n.from == "string" ? n.from : null,
      source: String(n.source ?? ""),
      player: o
    });
  }
  return t;
}
const oL = (e) => {
  var t, n, r;
  return [(t = e.player) == null ? void 0 : t.title, (n = e.player) == null ? void 0 : n.subtitle, e.label, `#${e.slot}`, ...(((r = e.player) == null ? void 0 : r.tracks) ?? []).filter((o) => !o.hidden).flatMap((o) => [o.title, o.artist])].filter(Boolean).join(" ").toLowerCase();
};
function iL(e, t) {
  const n = t.query.toLowerCase().split(/\s+/).filter(Boolean), r = e.filter((s) => (!t.pinnedOnly || t.pins.has(s.slot)) && (() => {
    const i = oL(s);
    return n.every((a) => i.includes(a));
  })()), o = {
    recent: (s, i) => (t.recents[i.slot] ?? 0) - (t.recents[s.slot] ?? 0) || i.slot - s.slot,
    newest: (s, i) => i.slot - s.slot,
    oldest: (s, i) => s.slot - i.slot,
    title: (s, i) => {
      var a, c;
      return (((a = s.player) == null ? void 0 : a.title) ?? "").localeCompare(((c = i.player) == null ? void 0 : c.title) ?? "") || s.slot - i.slot;
    }
  };
  return r.sort((s, i) => Number(t.pins.has(i.slot)) - Number(t.pins.has(s.slot)) || o[t.sort](s, i));
}
function aL(e, t = 100) {
  const n = Object.entries(e).sort((r, o) => o[1] - r[1]).slice(0, t);
  return Object.fromEntries(n.map(([r, o]) => [Number(r), o]));
}
const df = /* @__PURE__ */ new Set(), Ch = (e) => (df.add(e), () => {
  df.delete(e);
}), Nl = () => {
  for (const e of [...df])
    try {
      e();
    } catch {
    }
}, Fg = "xtrata:al-thumb:v1:", Th = "-", $a = 96, cL = 24 * 1024 * 1024, vn = /* @__PURE__ */ new Map(), jg = /* @__PURE__ */ new Set(), ff = [];
let qu = !1, Wu;
const Wa = (e, t) => {
  try {
    if (t === void 0) return window.localStorage.getItem(Fg + e);
    window.localStorage.setItem(Fg + e, t);
  } catch {
  }
  return null;
};
function Bh(e) {
  return new Promise((t) => {
    var n;
    try {
      const r = document.createElement("canvas"), o = (n = r.getContext) == null ? void 0 : n.call(r, "2d");
      if (!o) return t(e);
      const s = new Image(), i = setTimeout(() => t(e), 8e3);
      s.onload = () => {
        clearTimeout(i);
        try {
          const a = Math.min(s.naturalWidth, s.naturalHeight);
          if (!a) return t(e);
          r.width = r.height = $a, o.fillStyle = "#143a40", o.fillRect(0, 0, $a, $a), o.drawImage(s, (s.naturalWidth - a) / 2, (s.naturalHeight - a) / 2, a, a, 0, 0, $a, $a), t(r.toDataURL("image/jpeg", 0.82));
        } catch {
          t(e);
        }
      }, s.onerror = () => {
        clearTimeout(i), t(e);
      }, s.src = e;
    } catch {
      t(e);
    }
  });
}
async function lL(e) {
  var c, u, h, d, m;
  const t = await fetch("/inscription/" + e, { signal: AbortSignal.timeout(6e4) }), n = (t.headers.get("content-type") || "").toLowerCase();
  if (!t.ok)
    return await ((c = t.body) == null ? void 0 : c.cancel()), null;
  if (n.startsWith("image/"))
    return await ((u = t.body) == null ? void 0 : u.cancel()), "/inscription/" + e;
  if (!n.includes("text/html"))
    return await ((h = t.body) == null ? void 0 : h.cancel()), "";
  let r = "", o = 0;
  const s = (w) => {
    let v = 0;
    for (; ; ) {
      const x = r.slice(v).search(/<img\b/i);
      if (x < 0)
        return r = w ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const L = v + x, B = r.indexOf(">", L);
      if (B < 0)
        return r = r.slice(L), null;
      const U = r.slice(L, B + 1), A = U.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (A) return A[1].replace(/&amp;/g, "&");
      const T = U.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (T) return "/inscription/" + T[1];
      v = B + 1;
    }
  }, i = (m = (d = t.body) == null ? void 0 : d.getReader) == null ? void 0 : m.call(d);
  if (!i)
    return r = await t.text(), s(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: w, value: v } = await i.read();
    if (w) break;
    o += v.byteLength, r += a.decode(v, { stream: !0 });
    const x = s(!1);
    if (x)
      return await i.cancel(), x;
    if (o > cL)
      return await i.cancel(), null;
  }
  return r += a.decode(), s(!0) ?? "";
}
async function uL() {
  if (!qu) {
    qu = !0;
    try {
      for (; ff.length; ) {
        const e = ff.shift();
        if (!vn.has(e))
          try {
            const t = await lL(e);
            if (t === null) continue;
            if (!t) {
              vn.set(e, ""), Wa(e, Th), Nl();
              continue;
            }
            const n = await Bh(t);
            vn.set(e, n), n.startsWith("data:image/jpeg") && Wa(e, n), Nl();
          } catch {
          }
      }
    } finally {
      qu = !1;
    }
  }
}
function Nh(e, t) {
  if (t && !vn.get(e) ? (vn.set(e, t), Bh(t).then((r) => {
    r !== t && (vn.set(e, r), r.startsWith("data:image/jpeg") && Wa(e, r), Nl());
  })) : t === "" && !vn.has(e) && vn.set(e, ""), vn.has(e)) return vn.get(e);
  const n = Wa(e);
  if (n != null) {
    const r = n === Th ? "" : n;
    return vn.set(e, r), r;
  }
  return jg.has(e) || (jg.add(e), ff.push(e), Wu || (Wu = setTimeout(() => {
    Wu = void 0, uL();
  }, 1200))), "";
}
function Rg(e) {
  if (vn.has(e)) return vn.get(e);
  const t = Wa(e);
  if (t == null) return null;
  const n = t === Th ? "" : t;
  return vn.set(e, n), n;
}
const Zu = /* @__PURE__ */ new Map(), Ju = /* @__PURE__ */ new Set();
function tl(e) {
  return !e || !Number.isSafeInteger(e) || e < 0 ? "" : Zu.has(e) ? Zu.get(e) : (Ju.has(e) || (Ju.add(e), fetch("/inscription/" + e, { signal: AbortSignal.timeout(2e4) }).then(async (t) => {
    var r, o, s, i;
    const n = (t.headers.get("content-type") || "").toLowerCase();
    if (!t.ok)
      throw await ((r = t.body) == null ? void 0 : r.cancel()), new Error("no cover");
    return n.startsWith("image/") ? (await ((o = t.body) == null ? void 0 : o.cancel()), "/inscription/" + e) : n.includes("text/html") ? (((s = (await t.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : s[1]) ?? "").replace(/&amp;/g, "&") : (await ((i = t.body) == null ? void 0 : i.cancel()), "");
  }).then((t) => {
    Zu.set(e, t), Nl();
  }).catch(() => {
    Ju.delete(e);
  })), "");
}
const Bi = 12, dL = 5e3, _n = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Ni = (e, t, n = "") => {
  const r = _n("button", e, n);
  return r.type = "button", r.onclick = t, r;
};
function fL(e) {
  let t, n = [], r = 0, o = !1, s = !1, i = -1 / 0, a = "", c = "recent", u = !1, h = Bi;
  const d = _n("div", "", "ppp-shelf-box");
  Ch(() => e.changed());
  const m = (N) => "xtrata.radio.shelf.pins.v1:" + N, w = (N) => "xtrata.radio.shelf.recent.v1:" + N, v = (N, P) => {
    try {
      return JSON.parse(e.store.get(N) || "null") ?? P;
    } catch {
      return P;
    }
  }, x = (N) => new Set(v(m(N), []).filter((P) => Number.isSafeInteger(P))), L = (N) => {
    const P = v(w(N), {}), W = {};
    for (const [R, le] of Object.entries(P)) Number.isSafeInteger(Number(R)) && typeof le == "number" && (W[Number(R)] = le);
    return W;
  };
  async function B(N) {
    if (!o) {
      o = !0, s = !1;
      try {
        const P = [];
        let W = 0, R = 0;
        for (let le = 0; le < dL / 100 + 1; le++) {
          const ue = await e.json(`/radio/gift/shelf?root=${encodeURIComponent(N)}&after=${W}&limit=100`);
          if (P.push(...sL(ue == null ? void 0 : ue.shelf)), R = Number(ue == null ? void 0 : ue.total) || P.length, !(ue != null && ue.next) || !Number.isSafeInteger(ue.next)) break;
          W = ue.next;
        }
        N === t && (n = P, r = R, i = e.now());
      } catch {
        s = !0;
      } finally {
        o = !1, e.changed();
      }
    }
  }
  const U = () => {
    i = -1 / 0;
  }, A = _n("input");
  A.type = "search", A.placeholder = "Search title, artist or #", A.setAttribute("aria-label", "Search your albums"), A.oninput = () => {
    a = A.value, h = Bi, e.changed();
  };
  const T = _n("select");
  T.setAttribute("aria-label", "Sort albums");
  for (const N of rL) {
    const P = document.createElement("option");
    P.value = N.value, P.textContent = N.label, T.append(P);
  }
  T.onchange = () => {
    c = T.value, h = Bi, e.changed();
  };
  const _ = Ni("", () => {
    u = !u, h = Bi, e.changed();
  }, "tiny"), X = _n("div", "", "ppp-shelf-tools");
  X.append(A, T, _);
  const ce = _n("div"), ne = _n("div");
  function q(N) {
    const P = N.step === "off" || N.step === "elsewhere" ? void 0 : N.root;
    if (P !== t && (t = P, n = [], r = 0, i = -1 / 0, h = Bi), !P || N.walletCannotAlbums) return null;
    if (!o && e.now() - i > 5 * 6e4 && B(P), !n.length)
      return s ? (ne.replaceChildren(_n("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Ni("Try again", () => {
        i = -1 / 0, e.changed();
      }, "quiet")), d.replaceChildren(ne), d) : null;
    const W = x(P), R = L(P), le = iL(n, { query: a, sort: c, pinnedOnly: u, pins: W, recents: R });
    A.value !== a && (A.value = a), T.value = c, _.textContent = u ? "★ Pinned only" : "☆ Pinned only", _.setAttribute("aria-pressed", String(u));
    const ue = [];
    if (N.slot > 0 && ue.push(Ni("← My player", () => e.open(0), "quiet")), !le.length) ue.push(_n("p", "No album matches that.", "ppp-mute"));
    else {
      const Xe = _n("ul", "", "ppp-shelf-list");
      for (const C of le.slice(0, h)) {
        const F = _n("li", "", C.slot === N.slot ? "now" : ""), re = W.has(C.slot), de = Ni(re ? "★" : "☆", () => {
          const lt = new Set(W);
          re ? lt.delete(C.slot) : lt.add(C.slot), e.store.set(m(P), JSON.stringify([...lt])), e.changed();
        }, "tiny");
        de.setAttribute("aria-label", re ? `Unpin ${C.player.title}` : `Pin ${C.player.title}`);
        const Be = [C.player.subtitle, `${Hr(C.player).length} ${Hr(C.player).length === 1 ? "song" : "songs"}`, C.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Me = C.slot === N.slot, Ot = Ni(Me ? "Playing" : "Select", () => {
          e.store.set(w(P), JSON.stringify(aL({ ...R, [C.slot]: e.now() }))), e.open(C.slot);
        }, Me ? "tiny ppp-pick" : "tiny primary ppp-pick");
        Ot.disabled = Me;
        const Ge = Hr(C.player)[0], Pe = C.player.cover ?? (Ge == null ? void 0 : Ge.id), _e = Pe ? Nh(String(Pe)) : "", Pt = _n("span", "", "ppp-shelf-art");
        if (_e) {
          const lt = document.createElement("img");
          lt.src = _e, lt.alt = "", lt.decoding = "async", Pt.append(lt);
        } else Pt.textContent = "💿";
        const En = _n("span", "", "ppp-shelf-txt");
        En.append(_n("span", C.player.title, "t"), _n("span", Be, "ppp-mute")), F.append(de, Pt, En, Ot), Xe.append(F);
      }
      ue.push(Xe), le.length > h && ue.push(Ni(`Show more (${le.length - h} left)`, () => {
        h += Bi, e.changed();
      }, "quiet"));
    }
    return s && ue.push(_n("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), ce.replaceChildren(...ue), d.firstChild !== X && d.replaceChildren(X, ce), d;
  }
  return { render: q, invalidate: U, count: () => r || n.length, latest: () => {
    if (!t || !n.length) return null;
    const N = L(t), P = [...n].filter((W) => W.player).sort((W, R) => (N[R.slot] ?? 0) - (N[W.slot] ?? 0) || R.slot - W.slot)[0];
    return P ? { slot: P.slot, title: P.player.title } : null;
  } };
}
const zg = "http://www.w3.org/2000/svg", hL = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function Ml(e = "", t = !1) {
  const n = document.createElementNS(zg, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), e && n.setAttribute("class", e);
  for (const [r, o] of hL) {
    const s = document.createElementNS(zg, "path");
    s.setAttribute("fill-rule", "evenodd"), s.setAttribute("fill", t ? "currentColor" : r), s.setAttribute("d", o), n.append(s);
  }
  return n;
}
const rt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, fn = (e, t, n, r = !1) => {
  const o = rt("button", e, t);
  return o.type = "button", o.disabled = r, o.onclick = n, o;
}, Hb = (e) => e.toLocaleString(), Gg = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, pL = (e) => e === "gift" || e === "new" ? 1 : e === "arriving" ? 2 : e === "landed" ? 3 : -1;
function Pl(e, t) {
  const n = rt("ol", "al-steps");
  return n.setAttribute("aria-label", t >= e.length ? "All steps done" : `Step ${t + 1} of ${e.length}: ${e[t]}`), e.forEach((r, o) => {
    const s = rt("li", o < t ? "is-done" : o === t ? "is-now" : "");
    s.append(rt("i", "", o < t ? "✓" : String(o + 1)), rt("span", "", r)), n.append(s);
  }), n;
}
function gL() {
  const e = rt("div", "tier-disc tier-disc--mid");
  return e.dataset.tier = "mystery", e.setAttribute("role", "img"), e.setAttribute("aria-label", "A player waiting to be opened"), e.append(rt("span", "tier-disc__mark", "?")), e;
}
const xn = {
  gift: { title: "Your disc is ready", primary: "Claim my free player", play: "Play", hint: "Free. Face ID or fingerprint.", returning: "I already have a player", full: "Look around first" },
  installedNew: { title: "Open your player", body: "Use your face or fingerprint to open the player you already have.", primary: "Open my player", hint: "Face ID or fingerprint.", fresh: "I’m new: make my player" },
  new: {
    title: "Music that pays the artist",
    body: "Every play counts for whoever owns the song. Make your player once and you’re in.",
    primary: "Make my player",
    hint: "One tap with Face ID or your fingerprint. No app, no account, no password.",
    returning: "I’ve listened here before",
    full: "Look around first"
  },
  back: { title: "Welcome back", body: "Unlock your player and carry on listening.", primary: "Unlock my player", hint: "One tap with Face ID or your fingerprint.", returning: "Use a different passkey", full: "Look around first" },
  backClaim: {
    title: "A free player is waiting",
    body: "This device already has a player you made before. You can claim the free one as a new, separate player with its own passkey. Your existing player, and anything in it, stays exactly as it is.",
    primary: "Claim it as a new player",
    hint: "One tap with Face ID or your fingerprint. You can switch between your players at any time.",
    unlock: "Open my existing player instead",
    replace: "Replace my old player",
    replaceHint: "Its balance is sent back first, then it is removed from this device. You end up with one player that has 24 backup words.",
    both: "Keep both players"
  },
  arriving: { title: "Your player is made", body: "Your plays are on their way to it. This usually takes about a minute: keep this page open and it carries on by itself.", playing: "Your player is made" },
  landed: { title: "You’re in", primary: "Start listening", playing: "Keep listening" },
  empty: { title: "Your player is ready", body: "It has no plays yet. Add some and every song you hear pays its artist.", primary: "Add plays", full: "Look around the radio" },
  checking: "One moment…",
  asking: "Continue in the box below."
}, yL = (e) => e ? `Disc ${e} is yours` : xn.gift.title, wL = (e, t, n = !1) => n ? "What is inside? Play it to find out." : e ? `${Hb(e)} plays inside. Every play pays the artist.` : "Every play pays the artist.", mL = (e) => e ? `${Hb(e)} plays. Every one pays the artist.` : "Every play pays the artist.";
function Kg(e, t = !1) {
  const n = rt("div", "al-now" + (t ? " al-now--big" : "")), r = rt("img", "al-now__art");
  r.src = e.art, r.alt = "";
  const o = rt("div", "al-now__t");
  o.append(rt("b", "", e.title || "Playing now"), rt("span", "", e.artist));
  const s = rt("i", "al-now__eq" + (e.playing ? " is-on" : ""));
  return s.setAttribute("aria-hidden", "true"), s.append(rt("s"), rt("s"), rt("s")), n.append(r, o, s), n.setAttribute("role", "group"), n.setAttribute("aria-label", `${e.playing ? "Playing" : "Starting"}: ${e.title || "your first song"}${e.artist ? ` by ${e.artist}` : ""}`), n;
}
const bL = (e) => e ? `You got a ${e.name} player` : xn.landed.title;
function xL(e, t = !0) {
  const n = rt("div", "tier-disc" + (t ? " tier-disc--big" : ""));
  return n.dataset.tier = e.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${e.name} player`), n.append(rt("span", "tier-disc__mark", e.mark)), n;
}
function SL(e) {
  const t = document.documentElement;
  let n = !1;
  return {
    showing: () => n,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(r, o = !1) {
      var h, d;
      if (!r) {
        n && !o && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n = !1, delete t.dataset.welcome;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.welcome = r.mode, r.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const s = rt("header", "al-top"), i = rt("a", "al-brand");
      i.href = "/radio", i.append(Ml("al-logo"), rt("span", "", "Xtrata "), rt("b", "", "Music")), s.append(i);
      const a = rt("div", "al-body al-body--welcome"), c = rt("div", "al-welcome"), u = r.mode;
      if (u === "checking")
        c.append(rt("p", "al-welcome-wait", xn.checking));
      else {
        const m = pL(u);
        m >= 0 && c.append(Pl(u === "new" ? Gg.fresh : Gg.gift, m)), r.tier && (u === "landed" || u === "back" || u === "empty") ? c.append(xL(r.tier)) : u === "gift" || u === "arriving" ? c.append(gL()) : u === "new" && c.append(Ml("al-hero-mark"));
        const w = r.now && (u === "gift" || u === "arriving" || u === "landed") ? r.now : null, v = u === "new" && !!r.installed;
        if (c.append(rt("h1", "", u === "landed" ? bL(r.tier) : u === "back" && r.tier ? `Your ${r.tier.name} player` : u === "gift" ? yL(r.spot) : v ? xn.installedNew.title : xn[u].title)), w && u === "arriving" ? c.append(Kg(w, !0)) : c.append(rt("p", "", u === "gift" ? wL(r.plays, r.from, r.mystery) : u === "landed" ? mL(r.plays) : v ? xn.installedNew.body : xn[u].body)), w && u !== "arriving" && c.append(Kg(w)), r.status.length) {
          const x = rt("div", "al-status");
          x.setAttribute("role", "status"), x.append(...r.status), c.append(x);
        }
        if (r.asking) c.append(rt("p", "al-hint al-hint--ask", xn.asking));
        else if (u === "back" && r.claimNew) {
          const x = xn.backClaim;
          c.append(rt("p", "al-hint", x.body)), r.canStart && r.replaceOld ? c.append(fn("al-primary", x.replace, r.replaceOld, r.busy), rt("p", "al-hint", x.replaceHint), fn("al-link", x.both, r.claimNew, r.busy), fn("al-link", x.unlock, r.unlock, r.busy)) : r.canStart && c.append(fn("al-primary", x.primary, r.claimNew, r.busy), rt("p", "al-hint", x.hint), fn("al-link", x.unlock, r.unlock, r.busy)), c.append(fn("al-link", xn.back.full, r.full));
        } else if (u === "gift") {
          const x = xn.gift;
          if (r.canStart) {
            const L = fn("al-primary" + (r.intro ? " al-primary--play" : ""), r.intro ? x.play : x.primary, r.start, r.busy);
            c.append(L, rt("p", "al-hint", x.hint));
          }
          r.canStart ? c.append(fn("al-link", x.returning, r.returning, r.busy)) : c.append(fn("al-link", x.full, r.full));
        } else if (u === "new" && r.installed) {
          const x = xn.installedNew;
          r.canStart && c.append(fn("al-primary", x.primary, r.returning, r.busy), rt("p", "al-hint", x.hint), fn("al-link", x.fresh, r.start, r.busy)), c.append(fn("al-link", xn.new.full, r.full));
        } else if (u === "new" || u === "back") {
          const x = xn[u];
          r.canStart && c.append(fn("al-primary", x.primary, u === "back" ? r.unlock : r.start, r.busy), rt("p", "al-hint", x.hint)), r.canStart && c.append(fn("al-link", x.returning, r.returning, r.busy)), c.append(fn("al-link", x.full, r.full));
        } else if (u === "landed") {
          if (c.append(fn("al-primary", (h = r.now) != null && h.playing ? xn.landed.playing : xn.landed.primary, r.full)), (d = r.albums) != null && d.length && !r.now) {
            c.append(rt("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const x of r.albums) {
              const L = fn("al-album", "", x.run);
              if (x.cover) {
                const U = rt("img", "al-album__art");
                U.src = x.cover, U.alt = "", L.classList.add("al-album--art"), L.append(U);
              }
              const B = rt("span", "al-album__t");
              B.append(rt("b", "", x.title), rt("span", "", x.by)), L.append(B), c.append(L);
            }
          }
        } else u === "empty" && c.append(fn("al-primary", xn.empty.primary, r.restock), fn("al-link", xn.empty.full, r.full));
      }
      a.append(c), e.hidden = !1, e.replaceChildren(s, a);
    }
  };
}
const vL = 20, AL = ["Album", "Passkey", "Listen"], Ln = (e, t = 22, n = !1) => `<svg width="${t}" height="${t}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${e}</svg>`, Qt = {
  grid: Ln('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: Ln('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: Ln('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: Ln('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: Ln('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: Ln('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: Ln('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: Ln('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: Ln('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: Ln('<path d="M6 9l6 6 6-6"/>', 18),
  right: Ln('<path d="M9 6l6 6-6 6"/>', 16),
  close: Ln('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: Ln('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: Ln('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: Ln('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: Ln('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: Ln('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function oe(e, t = {}, ...n) {
  const r = document.createElement(e);
  for (const [o, s] of Object.entries(t))
    s == null || s === !1 || (o === "class" ? r.className = String(s) : o === "html" ? r.innerHTML = String(s) : o.startsWith("on") && typeof s == "function" ? r[o.toLowerCase()] = s : o === "disabled" ? r.disabled = !!s : r.setAttribute(o, s === !0 ? "" : String(s)));
  for (const o of n) o != null && o !== !1 && r.append(o);
  return r;
}
const Pn = (e, ...t) => oe("button", { type: "button", ...e }, ...t), Rc = (e) => `${Math.floor(e / 60)}:${String(Math.floor(e % 60)).padStart(2, "0")}`, Ia = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`, EL = { music: "My music", device: "This device", gifts: "Albums (admin)" }, kL = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function Vg(e, t, n = {}) {
  const r = !!n.list;
  let o = null, s = "", i = !1;
  const a = document.documentElement;
  function c(b) {
    var N, P, W;
    if (!b || !Number.isSafeInteger(b)) return "";
    const I = (W = (P = (N = t.radio()) == null ? void 0 : N.getState) == null ? void 0 : P.call(N)) == null ? void 0 : W.albumCover;
    return I != null && I.url && Number(I.tokenId) === b ? I.url : tl(b);
  }
  Ch(() => q());
  function u(b) {
    var N;
    s = b, b ? a.dataset.sheet = b : delete a.dataset.sheet;
    const I = document.querySelector(".side");
    if (b && b !== "more") {
      for (const R of kL[b]) {
        const le = I == null ? void 0 : I.querySelector(R);
        le && (le.open = !0);
      }
      const P = document.getElementById("sheetTitle");
      P && (P.textContent = EL[b]);
      const W = document.getElementById("sheetExtra");
      W && W.replaceChildren(...b === "music" ? [d()] : []), (N = I == null ? void 0 : I.scrollTo) == null || N.call(I, { top: 0 });
    }
    q();
  }
  const h = r ? null : document.getElementById("sheetClose");
  h && (h.onclick = () => u("")), r || document.addEventListener("keydown", (b) => {
    b.key === "Escape" && s && a.dataset.view === "album" && u("");
  });
  const d = () => Pn(
    { class: "al-row", onClick: () => {
      u(""), t.openPlayer();
    } },
    oe("span", { class: "al-row-i", html: Qt.radio }),
    oe("span", { class: "al-row-t" }, oe("b", {}, "Xtrata Radio"), oe("small", {}, "Every song on-chain · FM, liked, all")),
    oe("span", { class: "al-row-go", html: Qt.right })
  );
  let m = null, w = !1;
  const v = () => {
    var I;
    const b = t.radio();
    w || !(b != null && b.subscribe) || (w = !0, b.subscribe((N) => {
      m = N, (o == null ? void 0 : o.mode) === "open" && q();
    }), m = ((I = b.getState) == null ? void 0 : I.call(b)) ?? null);
  };
  r || setInterval(() => {
    var P, W;
    if ((o == null ? void 0 : o.mode) !== "open" || !(m != null && m.playing)) return;
    const b = (W = (P = t.radio()) == null ? void 0 : P.getPosition) == null ? void 0 : W.call(P), I = e.querySelector(".al-bar > i"), N = e.querySelectorAll(".al-times span");
    !b || !I || (I.style.width = b.duration ? `${Math.min(100, b.current / b.duration * 100)}%` : "0%", N.length === 2 && (N[0].textContent = Rc(b.current || 0), N[1].textContent = b.duration ? Rc(b.duration) : "–:––"));
  }, 500);
  let x = "", L = null;
  function B(b, I, N = {}) {
    const P = N.song || c(b.cover), R = [P ? oe("img", { src: P, alt: N.song ? "Song artwork" : `${b.title} cover` }) : oe("div", { class: "al-cover-fallback" }, oe("b", {}, b.title), b.subtitle ? oe("span", {}, b.subtitle) : null), N.paused ? oe("span", { class: "al-paused" }, oe("i", { html: Qt.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], le = "al-cover" + (I ? "" : " al-cover--small") + (N.paused ? " is-paused" : "");
    return N.flip ? (R.push(oe("span", { class: "al-flip", "aria-hidden": "true", html: Qt.flip })), Pn({ class: le + " is-flippable", "aria-label": N.flipped ? "Show this song’s artwork" : `Show the ${b.title} cover`, onClick: N.flip }, ...R)) : oe("div", { class: le }, ...R);
  }
  function U(b) {
    return b.plays === null || b.plays === void 0 ? oe("span", { class: "al-chip al-chip--quiet" }, b.playsComing ? "Plays on their way…" : "…") : b.plays === 0 ? oe("span", { class: "al-chip al-chip--out" }, b.playsComing ? "Plays on their way…" : "No plays left") : oe("span", { class: "al-chip" + (b.plays <= vL ? " al-chip--low" : "") }, `${Ia(b.plays, "play", "plays")} left`);
  }
  function A(b) {
    const I = b.player, N = I.tracks.filter((W) => !W.hidden), P = [];
    return b.step !== void 0 && P.push(Pl(AL, b.step)), b.mode === "arrive" && b.from && P.push(oe("p", { class: "al-from" }, oe("span", { html: Qt.gift }), oe("span", {}, oe("b", {}, b.from), " sent you an album"))), P.push(B(I, !0)), P.push(oe(
      "div",
      { class: "al-intro" },
      oe("h1", {}, I.title),
      I.subtitle ? oe("p", { class: "al-artist" }, I.subtitle) : null,
      N.length ? oe("p", { class: "al-songline" }, N.map((W) => W.title || `#${W.id}`).join(" · ")) : null,
      oe("span", { class: "al-chip" }, [Ia(N.length, "song", "songs"), b.offered ? Ia(b.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), b.status.length && P.push(oe("div", { class: "al-status", role: "status" }, ...b.status)), P.push(oe("div", { class: "al-grow" })), b.asking ? P.push(oe("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : b.primary && P.push(Pn({ class: "al-primary", onClick: b.primary.run, disabled: b.busy }, oe("span", { html: Qt.playSmall }), b.primary.label)), b.hint && !b.asking && P.push(oe("p", { class: "al-hint" }, b.hint)), b.secondary && !b.asking && P.push(Pn({ class: "al-link", onClick: b.secondary.run, disabled: b.busy }, b.secondary.label)), P;
  }
  function T(b, I) {
    const { songs: N, current: P, started: W, own: R, out: le, waiting: ue } = I, Xe = b.player, C = t.radio(), F = [];
    F.push(oe("div", { class: "al-listhead" }, oe("span", {}, oe("b", {}, Xe.title), ` · ${Ia(N.length, "song", "songs")}`), U(b)));
    const re = c(Xe.cover), de = "album:" + Xe.cover;
    re && !vn.has(de) && (vn.set(de, re), Bh(re).then((Me) => {
      Me !== re && (vn.set(de, Me), q());
    }));
    const Be = re ? vn.get(de) || re : "";
    return F.push(oe("ol", { class: "al-tracks" }, ...N.map((Me, Ot) => {
      const Ge = String(Me.id) === P, Pe = Nh(String(Me.id), Ge && W ? R : void 0);
      return oe("li", {}, Pn(
        { class: "al-track" + (Ge ? " is-on" : ""), "aria-label": `Play ${Me.title || "#" + Me.id}`, "aria-current": Ge ? "true" : void 0, disabled: le || ue, onClick: () => {
          var _e;
          return (_e = C == null ? void 0 : C.playToken) == null ? void 0 : _e.call(C, Me.id);
        } },
        oe(
          "span",
          { class: "al-th" + (Pe ? "" : " is-blank") },
          Pe ? oe("img", { src: Pe, alt: "", decoding: "async" }) : Be ? oe("img", { src: Be, alt: "", decoding: "async" }) : null,
          Pe ? null : oe("span", { class: "al-n" }, String(Ot + 1)),
          Ge ? oe("span", { class: "al-eq", html: Qt.eq }) : null
        ),
        oe("span", { class: "al-tt" }, Me.title || `#${Me.id}`, Me.explicit ? oe("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), F;
  }
  function _(b) {
    var Pe;
    const I = b.player, N = I.tracks.filter((_e) => !_e.hidden), P = t.radio(), W = m == null ? void 0 : m.nowPlaying, R = W && I.tracks.some((_e) => String(_e.id) === String(W.tokenId)) ? String(W.tokenId) : null, le = R ? I.tracks.find((_e) => String(_e.id) === R) : null, ue = b.plays === 0 && !b.playsComing, Xe = !!b.playsComing && !b.plays, C = !!(m != null && m.playing) && !!R, F = m == null ? void 0 : m.heart, re = R ? (Pe = P == null ? void 0 : P.getPosition) == null ? void 0 : Pe.call(P) : null;
    R && (C || ((re == null ? void 0 : re.current) ?? 0) > 0.5) && (x = I.id);
    const de = !!R && x === I.id;
    L && L !== R && (L = null);
    const Be = de ? String((W == null ? void 0 : W.cover) || "") : "", Me = !!Be && L === R, Ge = [B(I, !ue, { song: Me ? "" : Be, paused: de && !C, flip: Be ? () => {
      L = L === R ? null : R, q();
    } : void 0, flipped: Me })];
    if (Ge.push(oe(
      "div",
      { class: "al-now" },
      oe(
        "div",
        { class: "al-now-t" },
        oe("div", { class: "al-song" }, le ? le.title || (W == null ? void 0 : W.title) || `#${le.id}` : I.title),
        oe("div", { class: "al-artist" }, le ? le.artist || (W == null ? void 0 : W.artist) || I.subtitle : I.subtitle || "Press play")
      ),
      R ? Pn({ class: "al-icon" + (F != null && F.liked ? " is-on" : ""), "aria-label": F != null && F.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(F != null && F.liked)), disabled: !!(F != null && F.pending) || !!(F != null && F.locked) || Xe, onClick: () => {
        var _e;
        return (_e = P == null ? void 0 : P.toggleLike) == null ? void 0 : _e.call(P);
      }, html: F != null && F.liked ? Qt.heartOn : Qt.heart }) : null
    )), ue)
      Ge.push(oe(
        "div",
        { class: "al-out" },
        oe("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        oe("p", { class: "al-out-t" }, "You've played this album out"),
        oe("p", { class: "al-out-s" }, "Add plays to keep listening."),
        X(b, !0)
      ));
    else {
      const _e = re != null && re.duration ? Math.min(100, re.current / re.duration * 100) : 0;
      Ge.push(oe(
        "div",
        { class: "al-prog" },
        oe("div", { class: "al-bar" }, oe("i", { style: `width: ${_e}%` })),
        oe("div", { class: "al-times" }, oe("span", {}, Rc((re == null ? void 0 : re.current) || 0)), oe("span", {}, re != null && re.duration ? Rc(re.duration) : "–:––"))
      ));
    }
    return Ge.push(oe(
      "div",
      { class: "al-ctl" + (ue || Xe ? " is-off" : "") },
      Pn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: ue || Xe, onClick: () => {
        var _e;
        return (_e = P == null ? void 0 : P.prev) == null ? void 0 : _e.call(P);
      }, html: Qt.prev }),
      Pn({ class: "al-play", "aria-label": C ? "Pause" : "Play", disabled: ue || Xe, onClick: () => {
        var _e;
        return (_e = P == null ? void 0 : P.playPause) == null ? void 0 : _e.call(P);
      }, html: C ? Qt.pause : Qt.play }),
      Pn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: ue || Xe, onClick: () => {
        var _e;
        return (_e = P == null ? void 0 : P.next) == null ? void 0 : _e.call(P);
      }, html: Qt.next })
    )), b.status.length && Ge.push(oe("div", { class: "al-status", role: "status" }, ...b.status)), Ge.push(...T(b, { songs: N, current: R, started: de, own: Be, out: ue, waiting: Xe })), Ge.push(oe("div", { class: "al-grow" })), Ge.push(Pn(
      { class: "al-more", "aria-expanded": String(s === "more"), onClick: () => u(s === "more" ? "" : "more") },
      oe("span", {}, "More ", oe("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      oe("span", { html: Qt.down })
    )), Ge;
  }
  function X(b, I) {
    const N = oe("div", { class: "al-topups" + (I ? " al-topups--primary" : "") }), P = I ? [b.topUps[1] ?? b.topUps[0]] : [...b.topUps];
    for (const W of P) {
      const R = b.myPlays !== void 0 && b.myPlays >= W && !b.playsComing && !b.busy;
      N.append(Pn({ class: "al-topup", disabled: !R, onClick: () => t.topUp(W) }, I ? `Add ${W.toLocaleString()} plays` : `+${W.toLocaleString()}`));
    }
    return I && N.append(Pn({ class: "al-link", onClick: () => u("more") }, "Other amounts")), N;
  }
  function ce(b) {
    const I = b.myPlays !== void 0 && b.myPlays >= (b.topUps[0] ?? 0), N = oe(
      "div",
      { class: "al-card" },
      oe("div", { class: "al-card-h" }, oe("b", {}, `Add plays to ${b.player.title}`), oe("span", { class: "al-mono" }, b.plays === null || b.plays === void 0 ? "" : `${b.plays.toLocaleString()} left`)),
      X(b, !1),
      oe("p", { class: "al-mute al-small" }, b.playsComing ? "Plays are on their way. Add more once they arrive." : b.myPlays === void 0 ? "Checking My player…" : I ? `Moved from My player · ${Ia(b.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !I && !b.playsComing && b.myPlays !== void 0 ? Pn({ class: "al-link", onClick: () => {
        u(""), t.openPlayer();
      } }, "Open My player") : null
    ), P = (R, le, ue, Xe) => Pn(
      { class: "al-row", onClick: Xe },
      oe("span", { class: "al-row-i", html: R }),
      oe("span", { class: "al-row-t" }, oe("b", {}, le), oe("small", {}, ue)),
      oe("span", { class: "al-row-go", html: Qt.right })
    ), W = oe(
      "div",
      { class: "al-how" + (i ? " is-open" : "") },
      P(Qt.info, "How plays work", "Every play counts for the song’s owner", () => {
        i = !i, q();
      }),
      i ? oe("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return oe(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      oe("div", { class: "al-sheet-h" }, oe("b", {}, "More"), Pn({ class: "al-icon", "aria-label": "Close", onClick: () => u(""), html: Qt.close })),
      b.mode === "open" ? N : null,
      oe(
        "div",
        { class: "al-rows" },
        P(Qt.grid, "My music", "Your albums and the radio", () => u("music")),
        P(Qt.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          u(""), t.openPlayer();
        }),
        b.canMake ? P(Qt.gift, "Albums (admin)", "Make an album and fund copies", () => u("gifts")) : null,
        P(Qt.device, "This device", "Backup, history, Stacks wallet, returns", () => u("device")),
        W
      )
    );
  }
  function ne(b) {
    var ue, Xe;
    const I = b.player, N = m == null ? void 0 : m.nowPlaying, P = N && I.tracks.some((C) => String(C.id) === String(N.tokenId)) ? String(N.tokenId) : null, W = !!(m != null && m.playing) && !!P, R = P ? (Xe = (ue = t.radio()) == null ? void 0 : ue.getPosition) == null ? void 0 : Xe.call(ue) : null;
    P && (W || ((R == null ? void 0 : R.current) ?? 0) > 0.5) && (x = I.id);
    const le = !!P && x === I.id;
    return T(b, {
      songs: I.tracks.filter((C) => !C.hidden),
      current: P,
      started: le,
      own: le ? String((N == null ? void 0 : N.cover) || "") : "",
      out: b.plays === 0 && !b.playsComing,
      waiting: !!b.playsComing && !b.plays
    });
  }
  function q() {
    const b = o;
    if (r) {
      if (!b || b.mode !== "open") {
        e.hidden = !0, e.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      v(), e.hidden = !1, a.dataset.albumlist = "1", e.replaceChildren(...ne(b));
      return;
    }
    if (!b) {
      e.hidden = !0, e.replaceChildren();
      return;
    }
    v(), e.hidden = !1;
    const I = oe(
      "header",
      { class: "al-top" },
      oe("a", { class: "al-brand", href: "/radio" }, Ml("al-logo"), "Xtrata ", oe("b", {}, "Music")),
      b.mode === "open" ? Pn({ class: "al-icon", "aria-label": "My music", onClick: () => u("music"), html: Qt.grid }) : null
    ), N = oe("div", { class: "al-body al-body--" + b.mode }, ...b.mode === "open" ? _(b) : A(b));
    e.replaceChildren(I, N, ...s === "more" ? [oe("div", { class: "al-scrim", onClick: () => u("") }), ce(b)] : []);
  }
  return {
    render(b) {
      if (r) {
        o = b, q();
        return;
      }
      const I = !!o;
      o = b, !b && (I || s) && (s = "", delete a.dataset.sheet), b ? a.dataset.view = "album" : delete a.dataset.view, b != null && b.asking ? a.dataset.asking = "1" : delete a.dataset.asking, q();
    },
    sheet: () => s,
    setSheet: u
  };
}
const $L = "(?:https?:\\/\\/(?:radio\\.)?xtrata\\.xyz)?", IL = (e, t) => {
  if (typeof t != "string") return null;
  const n = t.match(new RegExp(`<(?:${e})\\b[^>]*\\bsrc=["']${$L}\\/inscription\\/(\\d{1,9})["']`, "i"));
  return n ? Number(n[1]) : null;
}, LL = (e) => IL("source|audio", e), CL = 48 * 1024 * 1024;
function TL(e) {
  const t = /^data:(audio\/[^;,]+)[^,]*?(;base64)?,(.*)$/s.exec(e);
  if (!t) throw new Error("unreadable audio");
  if (!t[2]) return e;
  const n = atob(t[3].replace(/\s+/g, "")), r = new Uint8Array(n.length);
  for (let o = 0; o < n.length; o++) r[o] = n.charCodeAt(o);
  return URL.createObjectURL(new Blob([r], { type: t[1] }));
}
function BL(e) {
  const t = e.fetch ?? ((...h) => fetch(...h));
  let n = null, r = null, o = "", s = null;
  const i = (h) => {
    n = h, e.changed();
  }, a = () => {
    var h;
    if (s == null || s.abort(), s = null, r)
      try {
        r.pause(), r.removeAttribute("src"), (h = r.load) == null || h.call(r);
      } catch {
      }
    o.startsWith("blob:") && URL.revokeObjectURL(o), o = "";
  };
  async function c(h, d, m = 0) {
    var A, T, _;
    const w = "/inscription/" + h, v = await t(w, { signal: d }), x = (v.headers.get("content-type") || "").toLowerCase();
    if (!v.ok)
      throw await ((A = v.body) == null ? void 0 : A.cancel()), new Error("not found");
    if (x.startsWith("audio/"))
      return await ((T = v.body) == null ? void 0 : T.cancel()), w;
    if (!x.includes("text/html"))
      throw await ((_ = v.body) == null ? void 0 : _.cancel()), new Error("not a song");
    const L = await v.text();
    if (L.length > CL) throw new Error("too large");
    const B = L.match(/<(?:source|audio)\b[^>]*\bsrc=["'](data:audio\/[^"']+)["']/i);
    if (B) return TL(B[1].replace(/&amp;/g, "&"));
    const U = m === 0 ? LL(L) : null;
    if (U) return c(Number(U), d, 1);
    throw new Error("no audio");
  }
  async function u(h) {
    var m;
    a();
    const d = s = new AbortController();
    i({ id: h, state: "loading" });
    try {
      const w = await c(h, d.signal);
      if (d.signal.aborted) {
        w.startsWith("blob:") && URL.revokeObjectURL(w);
        return;
      }
      if (o = w, r || (r = e.audio ? e.audio() : new Audio(), r.addEventListener("ended", () => {
        (n == null ? void 0 : n.state) === "playing" && (a(), i(null));
      }), r.addEventListener("error", () => {
        if ((n == null ? void 0 : n.state) === "playing") {
          const v = n.id;
          a(), i({ id: v, state: "error" });
        }
      })), (m = e.quiet) == null || m.call(e), r.src = w, await r.play(), d.signal.aborted) return;
      i({ id: h, state: "playing" });
    } catch {
      if (d.signal.aborted) return;
      a(), i({ id: h, state: "error" });
    }
  }
  return {
    state: (h) => (n == null ? void 0 : n.id) === h ? n.state : "idle",
    toggle: (h) => {
      (n == null ? void 0 : n.id) === h && n.state !== "error" ? (a(), i(null)) : u(h);
    },
    stop: () => {
      n && (a(), i(null));
    }
  };
}
const NL = ["Earned", "Claim", "Yours"], ML = ["Connect", "Link", "Name"], Lt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, bn = (e, t, n, r = !1) => {
  const o = Lt("button", e, t);
  return o.type = "button", o.disabled = r, o.onclick = n, o;
}, Xg = (e, t, n, r = !1) => {
  const o = bn("al-album", "", n, r), s = Lt("span", "al-album__t");
  return s.append(Lt("b", "", e), Lt("span", "", t)), o.append(s), o;
}, PL = (e) => `No. ${String(e).padStart(4, "0")}`, _L = (e) => e.main ? e.linked ? 2 : 1 : 0;
function UL(e) {
  const t = document.documentElement;
  let n = !1, r = "", o = null;
  const s = (i) => {
    if (o && r === i.art) return o;
    r = i.art, o = Lt("div", "aw-art");
    const a = document.createElement("iframe");
    return a.src = i.art, a.title = `${i.tier.name} record. Drag to turn it.`, a.setAttribute("sandbox", "allow-scripts"), o.append(a), o;
  };
  return {
    showing: () => n,
    /** `otherActive`: an album or a welcome screen owns the mount right now, so this view only steps aside. */
    render(i, a = !1) {
      if (!i) {
        n && !a && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n && (delete t.dataset.award, r = "", o = null), n = !1;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.award = i.screen, i.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const c = Lt("header", "al-top"), u = Lt("a", "al-brand");
      u.href = "/radio", u.append(Ml("al-logo"), Lt("span", "", "Xtrata "), Lt("b", "", "Music")), c.append(u);
      const h = Lt("div", "al-welcome"), d = i.screen, m = i.tier.name, w = typeof i.name == "string" && i.name ? i.name : null;
      if (h.append(d === "have" ? Pl(ML, _L(i)) : Pl(NL, d === "making" ? 2 : d === "yours" ? 3 : 1)), d === "making") {
        const U = Lt("div", "tier-disc tier-disc--mid");
        U.dataset.tier = i.tier.id, U.append(Lt("span", "tier-disc__mark", i.tier.mark)), h.append(U);
      } else if (d !== "have" && d !== "get") {
        const U = s(i);
        U.classList.toggle("aw-art--small", d === "name"), h.append(U);
      }
      const v = d === "ready" ? `Your ${m} record is ready` : d === "name" ? "Put your name on it?" : d === "have" ? "Use the name in your wallet" : d === "get" ? "Get a .btc name" : d === "making" ? "Making your record" : "It’s yours";
      h.append(Lt("h1", "", v));
      const x = (U, A = "") => h.append(Lt("p", A, U)), L = [];
      if (d === "ready")
        x(`You’ve paid artists for ${i.need.toLocaleString()} plays. That makes you an Xtrata Music Hero.`), L.push(bn("al-primary", `Claim my ${m} record`, () => i.go("name"), i.busy), Lt("p", "al-hint", "Free. One tap with Face ID or your fingerprint."), bn("al-link", "Later", i.later));
      else if (d === "name")
        w ? (x(`Your record will carry ${w} beside your player’s address.`), L.push(bn("al-primary", `Claim with ${w}`, () => i.claim("auto"), i.busy), bn("al-link", "Use my address only", () => i.claim("none"), i.busy))) : i.name === null ? (x("Right now it will carry your player’s address. A .btc name makes it yours at a glance."), L.push(
          Xg("I have a name in Leather or Xverse", "Connect that wallet and link your player to it", () => i.go("have"), i.busy),
          Xg("I want to get a name", "Where to get one, and how to put it on your player", () => i.go("get"), i.busy),
          bn("al-primary", "Claim with my address", () => i.claim("none"), i.busy)
        )) : (x("Could not check for a .btc name just now.", "ppp-warn"), L.push(bn("al-primary", "Check again", i.refresh, i.busy), bn("al-link", "Claim with my address only", () => i.claim("none"), i.busy))), L.push(Lt("p", "al-hint", "What is on the plaque cannot be changed afterwards.")), L.push(bn("al-link", "Later", i.later));
      else if (d === "have")
        i.main ? !i.linked && i.canLink ? (x(`Link this player to ${i.main}. Your plays and likes are then credited to that wallet’s name. One signature in your wallet: nothing is spent.`), L.push(bn("al-primary", "Link my player", i.link, i.busy))) : i.linked ? w ? (x(`Found it: ${w}. It goes on your plaque beside your player’s address.`), L.push(bn("al-primary", `Claim with ${w}`, () => i.claim("auto"), i.busy))) : (x(i.name === null ? `${i.main} has no primary .btc name yet. Set one in your wallet, then check again.` : "Could not check for the name just now.", i.name === null ? "" : "ppp-warn"), L.push(bn("al-primary", "Check again", i.refresh, i.busy))) : (x(`Linking is not open for ${i.main} right now. You can send a name to your player instead.`, "ppp-warn"), L.push(bn("al-primary", "Show me how", () => i.go("get"), i.busy))) : (x("Connect the Leather or Xverse wallet that holds your .btc name."), L.push(bn("al-primary", "Connect my wallet", i.connect, i.busy))), L.push(bn("al-link", "Back", () => i.go("name")));
      else if (d === "get") {
        const U = Lt("ol", "aw-steps"), A = Lt("li");
        A.append("Get a name at BNS One. You need a Stacks wallet (Leather or Xverse) with a little STX. ");
        const T = Lt("a", "", "Open BNS One ↗");
        T.href = "https://bns.one", T.target = "_blank", T.rel = "noopener", A.append(T);
        const _ = Lt("li");
        _.append("Then come back and choose “I have a name in Leather or Xverse”. Or send the name to your player’s own address:", Lt("span", "ppp-addr-full", i.player), i.copyAddress());
        const X = Lt("li", "", "Check again, and your name shows on the preview before you claim.");
        U.append(A, _, X), h.append(U), L.push(bn("al-primary", "I have my name: check again", () => {
          i.refresh(), i.go("name");
        }, i.busy), bn("al-link", "Back", () => i.go("name")));
      } else if (d === "making") {
        if (x("It is being written to Xtrata with your plaque on it. About a minute: keep this page open and it carries on by itself."), i.claimLink) {
          const U = Lt("p", "al-hint"), A = Lt("a", "", "See the claim on-chain ↗");
          A.href = i.claimLink, A.target = "_blank", A.rel = "noopener", U.append(A), h.append(U);
        }
      } else if (x(`${m} record ${PL(i.number)}${i.inscription !== void 0 ? ` · Xtrata inscription #${i.inscription}` : ""}. In your player now, and yours for good.`), L.push(bn("al-primary", "See it in my player", i.done)), i.inscription !== void 0) {
        const U = Lt("a", "al-link", "Open it full screen ↗");
        U.href = `/i/${i.inscription}`, U.target = "_blank", U.rel = "noopener", L.push(U);
      }
      if (i.status.length) {
        const U = Lt("div", "al-status");
        U.setAttribute("role", "status"), U.append(...i.status), h.append(U);
      }
      i.asking ? h.append(Lt("p", "al-hint al-hint--ask", "Continue in the box below.")) : h.append(...L);
      const B = Lt("div", "al-body al-body--welcome");
      B.append(h), e.hidden = !1, e.replaceChildren(c, B);
    }
  };
}
const Db = "xtrata.xyz/music/release", OL = "Release music on Xtrata Music; no spending permission", HL = (e) => ({
  domain: wr({ name: xt(Db), version: xt("1"), "chain-id": An(1) }),
  message: wr({ purpose: xt(OL), artist: xt(e.artist), release: xt(e.hash), issued: An(e.issued) })
}), DL = "Set the price of my release on Xtrata Music; no spending permission", FL = 100000n, jL = 1000000000n, RL = (e) => e === 0n || e >= FL && e <= jL, zL = (e) => ({
  domain: wr({ name: xt(Db), version: xt("1"), "chain-id": An(1) }),
  message: wr({ purpose: xt(DL), artist: xt(e.artist), release: xt(e.release), price: An(BigInt(e.price)), issued: An(e.issued) })
}), Mi = (e) => {
  const t = BigInt(e), n = t / 1000000n, r = (t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "");
  return r ? `${n}.${r}` : `${n}`;
}, GL = (e) => {
  const t = /^\s*(\d{1,6})(?:\.(\d{1,6}))?\s*$/.exec(e);
  return t ? BigInt(t[1]) * 1000000n + BigInt((t[2] ?? "").padEnd(6, "0") || "0") : null;
}, be = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Cn = (e, t, n = "") => {
  const r = be("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, zc = (e) => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(e) }), Yg = (e) => {
  const t = Hr(e).length;
  return `${t} ${t === 1 ? "song" : "songs"}`;
};
function Gc(e, t, n = "", r = "") {
  const o = be("span", "", "ppp-rel-art" + (e ? "" : " is-blank") + (r ? " " + r : "")), s = e || n;
  if (s) {
    const i = document.createElement("img");
    i.src = s, i.alt = "", i.decoding = "async", o.append(i);
  }
  return e || o.append(be("span", t)), o;
}
const Qu = (e) => !!e && uf(e.id) && typeof e.title == "string" && Array.isArray(e.tracks) && e.tracks.length > 0 && typeof e.artist == "string";
function KL(e) {
  let t = null, n = { copies: !1, sales: !1 }, r = !1, o = "", s = "";
  const i = (() => {
    try {
      const z = new URLSearchParams(location.search).get("release");
      return uf(z) ? z : null;
    } catch {
      return null;
    }
  })();
  let a = i ? { id: i } : null;
  const c = (z) => "xtrata.radio.releases.shelf.v1:" + z;
  let u = null, h = !1, d = -1 / 0;
  const m = (z, H, Q) => {
    const se = Array.isArray(H) ? H.filter(Qu).map((he) => ({ ...he, hidden: !!he.hidden })) : [];
    u = { for: z, albums: se, fresh: Q }, Q && e.store.set(c(z), JSON.stringify(se));
  }, w = (z) => {
    try {
      m(z, JSON.parse(e.store.get(c(z)) || "[]"), !1);
    } catch {
      m(z, [], !1);
    }
  }, v = () => {
    const z = e.player().address;
    return z && (u == null ? void 0 : u.for) === z ? u.albums : [];
  };
  async function x(z, H = "") {
    const Q = e.player();
    if (!Q.address || !Q.unlocked)
      return s = "Unlock your player first.", e.changed(), !1;
    if (h) return !1;
    h = !0, s = "", e.changed();
    try {
      const se = await e.signShelf(z, H), he = await e.json("/radio/release/shelf", zc(se));
      return m(Q.address, he == null ? void 0 : he.albums, !0), B(he == null ? void 0 : he.pay) ? A(Q.address, he.pay) : z === "add" && A(Q.address, null, H), !0;
    } catch (se) {
      return z !== "list" && (s = se.message || "That did not work. Try again."), !1;
    } finally {
      h = !1, e.changed();
    }
  }
  const L = (z) => "xtrata.radio.releases.orders.v1:" + z, B = (z) => !!z && /^[0-9a-f]{16}$/.test(z.order) && uf(z.release) && typeof z.to == "string" && /^\d{1,12}$/.test(z.amount) && typeof z.memo == "string", U = (z) => {
    if (!z) return {};
    try {
      const H = JSON.parse(e.store.get(L(z)) || "{}");
      return H && typeof H == "object" ? Object.fromEntries(Object.entries(H).filter(([, Q]) => B(Q))) : {};
    } catch {
      return {};
    }
  };
  function A(z, H, Q = (H == null ? void 0 : H.release) ?? "") {
    var he;
    const se = U(z);
    H ? se[H.release] = { ...((he = se[H.release]) == null ? void 0 : he.order) === H.order ? se[H.release] : {}, ...H } : delete se[Q], e.store.set(L(z), Object.keys(se).length ? JSON.stringify(se) : null);
  }
  const T = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Map();
  async function X(z, H, Q = !1) {
    var se;
    if (!T.has(H.order)) {
      T.add(H.order), _.set(H.order, e.now()), Q && (s = "", e.changed());
      try {
        const he = await e.json("/radio/release/paid", zc({ order: H.order, ...H.txid ? { txid: H.txid } : {} }));
        (he == null ? void 0 : he.status) === "paid" ? (A(z, null, H.release), ((se = a == null ? void 0 : a.view) == null ? void 0 : se.id) === H.release && (a.view = { ...a.view, added: a.view.added + 1 }), s = "", T.delete(H.order), (u == null ? void 0 : u.for) === z && (u.fresh = !1), e.player().unlocked && await x("list")) : (B(he) && A(z, { ...H, ...he }), Q && (he == null ? void 0 : he.status) === "pending" && (s = "No payment found yet. If you have just paid, give it a minute and check again."));
      } catch (he) {
        /did not go through|does not pay this order/.test(he.message || "") && A(z, { ...H, txid: void 0, status: "pending" }), (Q || H.txid) && (s = he.message || "The payment could not be checked right now. Nothing is lost.");
      } finally {
        T.delete(H.order), e.changed();
      }
    }
  }
  async function ce(z, H, Q) {
    if (!o) {
      o = "Approve the payment in your wallet…", s = "", e.changed();
      try {
        const se = await e.pay(z, Q.to, BigInt(Q.amount), Q.memo), he = { ...Q, txid: se || void 0, status: "confirming" };
        A(H, he), o = "", X(H, he);
      } catch (se) {
        s = /cancel/i.test(se.message || "") ? "Payment cancelled. Nothing was sent." : se.message || "Not paid. Nothing was sent.";
      } finally {
        o = "", e.changed();
      }
    }
  }
  async function ne(z) {
    const H = e.player();
    if (!await x("add", z.id) || !H.address) return;
    const Q = U(H.address)[z.id], se = e.main();
    Q && se && await ce(se, H.address, Q);
  }
  function q() {
    if (r || (r = !0, e.json("/radio/release/config").then((H) => {
      t = (H == null ? void 0 : H.enabled) === !0, n = { copies: t && (H == null ? void 0 : H.copies) === !0, sales: t && (H == null ? void 0 : H.sales) === !0 };
    }, () => {
      t = !1, r = !1;
    }).finally(e.changed)), !t) return;
    if (a && !a.view && !a.error) {
      const H = a;
      H.error = "", e.json("/radio/release/view?id=" + H.id).then(
        (Q) => {
          Qu(Q) ? (H.view = Q, delete H.error) : H.error = "This release could not be read.";
        },
        (Q) => {
          H.error = Q.message || "This release could not be opened right now.";
        }
      ).finally(e.changed);
    }
    const z = e.player();
    if (z.address) {
      (u == null ? void 0 : u.for) !== z.address && w(z.address), z.unlocked && !(u != null && u.fresh) && !h && e.now() - d > 6e4 && (d = e.now(), x("list"));
      for (const H of Object.values(U(z.address)))
        if ((H.txid || H.status === "confirming") && !T.has(H.order) && e.now() - (_.get(H.order) ?? -1 / 0) > 2e4) {
          const Q = z.address;
          X(Q, H).then(() => {
            setTimeout(() => e.changed(), 20500);
          });
        }
    }
  }
  const b = () => t ? v().filter((z) => !z.hidden) : [];
  function I(z, H) {
    const Q = be("ol", "", "ppp-rel-songs");
    return z.forEach((se, he) => {
      const dt = be("li");
      dt.append(Gc(e.art.song(se.id, !0) || "", String(he + 1), H), be("span", se.title)), Q.append(dt);
    }), Q;
  }
  function N() {
    if (!t || !a || a.dismissed) return [];
    if (!a.view) return a.error ? [be("p", `♫ ${a.error}`, "ppp-warn")] : [be("p", "♫ Opening this release…", "ppp-mute")];
    const z = a.view, H = be("div", "", "ppp-release-in"), Q = be("p", "", "ppp-release-in__h"), se = BigInt(/^\d{1,12}$/.test(z.price ?? "") ? z.price : "0");
    Q.append(be("b", z.title), be("span", `${z.subtitle || e.who(z.artist)} · ${Yg(z)}${se > 0n ? ` · ${Mi(se)} STX` : ""}`));
    const he = Hr(z), dt = e.art.cover(z.cover) || (z.cover ? "" : he[0] && e.art.song(he[0].id, !0) || ""), Ne = be("div", "", "ppp-rel-top");
    Ne.append(Gc(dt, "💿", "", "is-cover"), Q), H.append(Ne, I(he.map((Ie) => ({ id: Ie.id, title: Ie.title || `#${Ie.id}` })), e.art.cover(z.cover))), H.append(be("p", `Released by ${e.who(z.artist)}. ${z.added === 1 ? "1 player has" : `${z.added.toLocaleString()} players have`} added it.`, "ppp-mute"));
    const He = e.player(), St = v().find((Ie) => Ie.id === z.id), Ke = be("div", "", "ppp-award__row");
    if (St)
      H.append(be("p", "In your player ✓ It stays there until you hide or remove it.", "ppp-ok")), Ke.append(Cn("Play it", () => e.open(z), "primary"));
    else if (!He.address) H.append(be("p", "Make your player first (above), then add this album to it. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
    else if (!He.unlocked) H.append(be("p", "Unlock your player to add this album to it.", "ppp-mute"));
    else if (se > 0n) {
      const Ie = U(He.address)[z.id], Ze = e.main(), Ye = `${Mi((Ie == null ? void 0 : Ie.amount) ?? se)} STX`;
      if (Ie != null && Ie.txid || (Ie == null ? void 0 : Ie.status) === "confirming") {
        H.append(be("p", "Payment sent ✓ Waiting for it to confirm (a few minutes). The album appears in your player by itself.", "ppp-ok"));
        const Ve = Cn("Check now", () => void X(He.address, Ie, !0));
        Ve.disabled = T.has(Ie.order), Ke.append(Ve);
      } else if (H.append(be("p", `This album costs ${Ye}. You pay ${e.who(z.artist)} directly: Xtrata takes nothing, never holds the money and cannot refund it. Once paid it is in your player for good, and it plays with your own plays.`, "ppp-mute")), !n.sales && !Ie) H.append(be("p", "Buying is paused right now.", "ppp-warn"));
      else if (Ie) {
        if (Ze) {
          const gn = Cn(`Pay ${Ye} from my wallet`, () => void ce(Ze, He.address, Ie), "primary");
          gn.disabled = !!o, Ke.append(gn);
        } else H.append(be("p", "Connect a Stacks wallet (top right) to pay here. Or pay from any wallet, exactly like this:", "ppp-mute"));
        const Ve = be("div", "", "ppp-rel-pay"), Ht = (gn, Vn, $t) => {
          const un = be("p");
          return un.append(be("span", gn), be("code", Vn), fr(`order-${$t}:${Ie.order}`, "Copy", () => Vn, "tiny", e.changed)), un;
        };
        Ve.append(Ht("Send", Mi(Ie.amount) + " STX", "amount"), Ht("To", Ie.to, "to"), Ht("Memo", Ie.memo, "memo")), H.append(Ve, be("p", "The memo is what ties the payment to your player. Without it the album cannot be added.", "ppp-mute"));
        const pn = Cn("I have paid: check", () => void X(He.address, Ie, !0));
        pn.disabled = T.has(Ie.order), Ke.append(pn);
      } else {
        const Ve = Cn(`Buy · ${Ye}`, () => void ne(z), "primary");
        Ve.disabled = h || !!o, Ke.append(Ve);
      }
    } else {
      H.append(be("p", "Add it and it stays in your player. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
      const Ie = Cn("Add to my player", () => {
        x("add", z.id).then((Ze) => {
          Ze && (a != null && a.view) && (a.view = { ...a.view, added: a.view.added + 1 });
        });
      }, "primary");
      Ie.disabled = h, Ke.append(Ie);
    }
    return Ke.append(Cn("Not now", () => {
      a && (a.dismissed = !0), e.changed();
    }, "quiet")), H.append(Ke), o && H.append(be("p", o, "ppp-cyan")), s && H.append(be("p", s, "ppp-warn")), [H];
  }
  let P = !1;
  function W() {
    const z = t ? v() : [];
    if (!z.length) return null;
    const H = be("details", "", "ppp-release-manage");
    H.open = P, H.ontoggle = () => {
      P = H.open;
    };
    const Q = z.filter((he) => he.hidden).length;
    H.append(be("summary", `Albums I added (${z.length}${Q ? `, ${Q} hidden` : ""})`));
    const se = e.player().unlocked;
    se || H.append(be("p", "Unlock your player to hide or remove an album.", "ppp-mute"));
    for (const he of z) {
      const dt = be("div", "", "ppp-release-row" + (he.hidden ? " is-hidden" : "")), Ne = be("span", "", "ppp-release-row__t");
      Ne.append(be("b", he.title), be("span", `${he.subtitle || e.who(he.artist)}${he.hidden ? " · hidden" : ""}`));
      const He = Cn(he.hidden ? "Show" : "Hide", () => void x(he.hidden ? "show" : "hide", he.id), "tiny"), St = Cn("Remove", () => void x("remove", he.id), "tiny");
      He.disabled = St.disabled = !se || h, dt.append(Ne, He, St), H.append(dt);
    }
    return H.append(be("p", "Hide keeps an album but out of sight. Remove takes it off your player; you can add it again from its link.", "ppp-mute")), s && !a && H.append(be("p", s, "ppp-warn")), H;
  }
  let R = null, le = [], ue = null;
  const Xe = be("input");
  Xe.maxLength = 60, Xe.placeholder = "Title of the single, EP or album", Xe.setAttribute("aria-label", "Release title");
  const C = be("input");
  C.maxLength = 80, C.placeholder = "Artist name shown under the title", C.setAttribute("aria-label", "Artist name");
  const F = be("input");
  F.inputMode = "numeric", F.placeholder = "Cover: an inscription number (optional; the first song’s artwork if left empty)", F.setAttribute("aria-label", "Cover inscription number");
  const re = be("input");
  re.inputMode = "decimal", re.placeholder = "Price in STX, e.g. 2 (0 makes it free)", re.setAttribute("aria-label", "Price in STX");
  let de = null;
  const Be = (z, H, Q = "") => {
    de = (de == null ? void 0 : de.id) === z && de.what === H ? null : { id: z, what: H }, (de == null ? void 0 : de.what) === "price" && (re.value = Q), s = "", e.changed();
  };
  async function Me(z, H) {
    if (o) return;
    const Q = GL(re.value);
    if (Q === null || !RL(Q)) {
      s = "A price is 0 (free), or 0.1 to 1,000 STX.", e.changed();
      return;
    }
    o = "Sign in your wallet (nothing is spent)…", s = "", e.changed();
    try {
      const se = { artist: z, release: H.id, price: Q.toString(), issued: e.now() }, he = await e.sign(z, zL(se));
      o = "Saving the price…", e.changed(), await e.json("/radio/release/price", zc({ request: se, signature: he })), s = Q > 0n ? `Price set ✓ “${H.title}” now costs ${Mi(Q)} STX, paid straight to this wallet.` : `“${H.title}” is free again ✓`, de = null, Pe(z, !0);
    } catch (se) {
      s = se.message || "The price was not changed.";
    } finally {
      o = "", e.changed();
    }
  }
  const Ot = (z) => `${location.origin}${location.pathname}?release=${z}`;
  function Ge(z) {
    R = { for: z, loading: !0 }, le = [], e.changed(), e.json("/radio/release/songs?wallet=" + encodeURIComponent(z)).then(
      (H) => {
        const Q = Array.isArray(H == null ? void 0 : H.songs) ? H.songs.filter((se) => Number.isSafeInteger(se == null ? void 0 : se.id) && typeof se.title == "string") : null;
        R = Q ? { for: z, songs: Q, more: !!H.more } : { for: z, error: "Your songs could not be read right now." };
      },
      (H) => {
        R = { for: z, error: H.message || "Your songs could not be read right now." };
      }
    ).finally(e.changed);
  }
  function Pe(z, H = !1) {
    !H && (ue == null ? void 0 : ue.for) === z && e.now() - ue.at < 6e4 || (ue = { for: z, list: (ue == null ? void 0 : ue.for) === z ? ue.list : [], at: e.now() }, e.json("/radio/release/by?artist=" + encodeURIComponent(z)).then((Q) => {
      Array.isArray(Q == null ? void 0 : Q.releases) && (ue = { for: z, list: Q.releases.filter(Qu), at: e.now() });
    }, () => {
    }).finally(e.changed));
  }
  async function _e(z) {
    if (!o) {
      o = "Checking your release…", s = "", e.changed();
      try {
        const H = F.value.trim().replace(/^#/, ""), Q = _b({ title: Xe.value.trim(), subtitle: C.value.trim(), tracks: [...le], cover: H ? Number(H) : null });
        o = "Sign in your wallet (nothing is spent)…", e.changed();
        const se = { artist: z, hash: Ub(Q), issued: e.now() }, he = await e.sign(z, HL(se));
        o = "Releasing…", e.changed();
        const dt = await e.json("/radio/release/create", zc({ definition: Q, request: se, signature: he }));
        s = `${dt.existing ? "Already released" : "Released"} ✓ “${dt.title}”. Its link is below.`, le = [], Xe.value = "", F.value = "", e.audition.stop(), Pe(z, !0);
      } catch (H) {
        s = H.message || "Not released.";
      } finally {
        o = "", e.changed();
      }
    }
  }
  const Pt = () => {
    queueMicrotask(() => e.audition.stop());
  }, En = /* @__PURE__ */ new Set();
  function lt(z) {
    const H = le.map((Ve) => z.find((Ht) => Ht.id === Ve)).filter((Ve) => !!Ve), Q = F.value.trim().replace(/^#/, ""), se = /^\d{1,9}$/.test(Q) ? Number(Q) : null, he = e.art.cover(se), dt = H[0] ? e.art.song(H[0].id, !0) : null, Ne = be("div", "", "ppp-release-preview");
    Ne.append(be("p", "How it will look", "ppp-featured__h"));
    const He = be("p", "", "ppp-release-in__h"), St = be("b", Xe.value.trim() || "Untitled"), Ke = be("span", `${C.value.trim() || e.who(e.main())} · ${H.length} ${H.length === 1 ? "song" : "songs"}`);
    He.append(St, Ke);
    const Ie = be("div", "", "ppp-rel-top");
    Ie.append(Gc(se ? he : dt || "", "💿", "", "is-cover"), He), Ne.append(Ie, I(H.map((Ve) => ({ id: Ve.id, title: Ve.title })), he));
    const Ze = H.filter((Ve) => e.art.song(Ve.id, !0) === null).length, Ye = [];
    se && !he && Ye.push(`Looking for an image in #${se}… If none appears, that inscription is not a picture.`), Ze && Ye.push(`Finding artwork for ${Ze} ${Ze === 1 ? "song" : "songs"}…`), !Ze && H.some((Ve) => e.art.song(Ve.id, !1) === "") && Ye.push(`A numbered square is a song with no artwork of its own${he ? ": it shows the cover, dimmed" : ""}.`);
    for (const Ve of Ye) Ne.append(be("p", Ve, "ppp-mute"));
    return Xe.oninput = () => {
      St.textContent = Xe.value.trim() || "Untitled";
    }, C.oninput = () => {
      Ke.textContent = `${C.value.trim() || e.who(e.main())} · ${H.length} ${H.length === 1 ? "song" : "songs"}`;
    }, F.onchange = () => e.changed(), Ne;
  }
  function Zt() {
    var Q;
    const z = e.main();
    if (!t || !z)
      return R && (R = null, le = [], Pt()), null;
    const H = [be("p", "Put your own songs out as a single, an EP or an album. Listeners add it to their player, and every play pays you. Nothing to pay, and no money passes through Xtrata.", "ppp-mute")];
    if (R && R.for !== z && (R = null, le = [], En.clear(), Pt()), !R) H.push(Cn("Show the songs in my wallet", () => Ge(z), "primary"));
    else if (R.loading) H.push(be("p", "Reading your wallet…", "ppp-cyan"));
    else if (R.error) H.push(be("p", R.error, "ppp-warn"), Cn("Try again", () => Ge(z)));
    else if (!R.songs.length) H.push(be("p", "No songs found in this wallet. A release is made by the wallet that holds its song masters.", "ppp-mute"));
    else {
      H.push(be("p", "Tap your songs in the order they should play. Tap one again to take it out.", "ppp-cyan"));
      const se = be("div", "", "ppp-release-songs");
      for (const Ne of R.songs) {
        const He = le.indexOf(Ne.id), St = be("div", "", "ppp-release-song" + (He >= 0 ? " is-on" : "")), Ke = e.audition.state(Ne.id);
        Ke !== "idle" && En.add(Ne.id);
        const Ie = Cn(Ke === "playing" ? "❚❚" : Ke === "loading" ? "…" : "▶", () => e.audition.toggle(Ne.id), "ppp-release-hear" + (Ke === "playing" ? " is-on" : ""));
        Ie.setAttribute("aria-label", Ke === "playing" ? `Stop ${Ne.title}` : `Listen to ${Ne.title}`), Ie.title = Ke === "error" ? "This song could not be played just now" : Ke === "playing" ? "Stop" : "Listen (free: it is your own song)";
        const Ze = e.art.song(Ne.id, He >= 0 || En.has(Ne.id)), Ye = Cn("", () => {
          le = He >= 0 ? le.filter((Ve) => Ve !== Ne.id) : [...le, Ne.id], e.changed();
        }, "ppp-release-pick");
        Ye.setAttribute("aria-pressed", String(He >= 0)), Ye.append(be("i", He >= 0 ? String(He + 1) : "+"), be("b", Ne.title), be("span", Ke === "error" ? "could not play" : `${Ne.artist ? Ne.artist + " · " : ""}#${Ne.id}`, Ke === "error" ? "ppp-warn" : "")), St.append(Ie, Gc(Ze || "", Ze === "" ? "♪" : "", ""), Ye), se.append(St);
      }
      H.push(se), R.more && H.push(be("p", "This wallet holds a lot: only the first few hundred inscriptions were looked through.", "ppp-mute")), !C.value && le.length && (C.value = ((Q = R.songs.find((Ne) => Ne.id === le[0])) == null ? void 0 : Q.artist) || "");
      const he = le.length === 0 ? "release" : le.length === 1 ? "single" : le.length <= 6 ? "EP" : "album", dt = Cn(le.length ? `Sign and release this ${he} · ${le.length} ${le.length === 1 ? "song" : "songs"}` : "Pick at least one song", () => void _e(z), "primary");
      dt.disabled = !le.length || !!o, H.push(Xe, C, F), le.length && H.push(lt(R.songs)), H.push(dt);
    }
    if (o && H.push(be("p", o, "ppp-cyan")), s && !a && H.push(be("p", s, /✓/.test(s) ? "ppp-ok" : "ppp-warn")), Pe(z), (ue == null ? void 0 : ue.for) === z && ue.list.length) {
      H.push(be("p", "Your releases", "ppp-featured__h"));
      for (const se of ue.list) {
        const he = be("div", "", "ppp-release-row"), dt = be("span", "", "ppp-release-row__t"), Ne = BigInt(/^\d{1,12}$/.test(se.price ?? "") ? se.price : "0"), He = Ne > 0n ? ` · ${Mi(Ne)} STX · ${(se.sold ?? 0).toLocaleString()} sold` : n.sales ? " · free" : "";
        if (dt.append(be("b", se.title), be("span", `${Yg(se)} · added by ${se.added.toLocaleString()} ${se.added === 1 ? "player" : "players"}${He}`)), he.append(dt, fr("release-link:" + se.id, "Copy link", () => Ot(se.id), "tiny", e.changed)), n.sales) {
          const Ke = Cn("Price", () => Be(se.id, "price", Ne > 0n ? Mi(Ne) : ""), "tiny");
          Ke.setAttribute("aria-expanded", String((de == null ? void 0 : de.id) === se.id && de.what === "price")), he.append(Ke);
        }
        if (n.copies && e.copies) {
          const Ke = Cn("Send copies", () => Be(se.id, "copies"), "tiny");
          Ke.setAttribute("aria-expanded", String((de == null ? void 0 : de.id) === se.id && de.what === "copies")), he.append(Ke);
        }
        if (H.push(he), (de == null ? void 0 : de.id) !== se.id) continue;
        const St = be("div", "", "ppp-release-way");
        if (de.what === "price" && n.sales) {
          const Ke = Cn("Sign this price", () => void Me(z, se), "primary");
          Ke.disabled = !!o, St.append(
            be("p", "Put a price on this release. Each listener then pays you that price once to add it, straight to this wallet. Xtrata takes nothing, never holds the money and cannot refund a sale: a refund is between you and the buyer. Players that already have it keep it.", "ppp-mute"),
            re,
            Ke
          );
        } else de.what === "copies" && n.copies && e.copies && St.append(...e.copies(z, { id: se.id, title: se.title }));
        St.childNodes.length && H.push(St);
      }
    }
    return H;
  }
  return { sync: q, albums: b, banner: N, manage: W, fold: Zt, wantsArt: () => t === !0 && (!!(a != null && a.view) && !a.dismissed || !!(R != null && R.songs) && !!e.main()), enabled: () => t === !0 };
}
const ed = "xtrata.radio.replace.v1", Tn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, uo = (e, t, n = "") => {
  const r = Tn("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, qg = (e) => (Number(e) / 1e6).toLocaleString("en-GB", { maximumFractionDigits: 6 });
function VL(e) {
  let n = (() => {
    try {
      const v = JSON.parse(e.store.get(ed) || "null");
      return v && typeof v.old == "string" ? v : null;
    } catch {
      return null;
    }
  })();
  const r = (v) => {
    n = v, e.store.set(ed, v ? JSON.stringify(v) : null), e.changed();
  };
  let o = null, s = !1, i = "", a = !1;
  function c(v) {
    s || (o == null ? void 0 : o.for) === v && (o.n !== null || Date.now() - o.at < 3e4) || (s = !0, e.json("/radio/gift/shelf?root=" + encodeURIComponent(v) + "&limit=1").then(
      (x) => {
        o = { for: v, n: Number.isSafeInteger(x == null ? void 0 : x.total) ? x.total : null, at: Date.now() };
      },
      () => {
        o = { for: v, n: null, at: Date.now() };
      }
    ).finally(() => {
      s = !1, e.changed();
    }));
  }
  const u = () => !!n, h = () => !!(n != null && n.removed);
  function d(v) {
    v.listening && (i = "", r({ old: v.listening }));
  }
  const m = () => {
    i = "", r(null);
  };
  function w(v) {
    var _;
    if (!n) return null;
    n.removed && v.listening === n.old && (n = { old: n.old }, e.store.set(ed, JSON.stringify(n)));
    const x = [], L = (X, ce) => x.push(Tn("p", `Replacing your old player · step ${X} of 3 · ${ce}`, "ppp-cyan")), B = () => uo("Stop · keep my old player", m, "quiet");
    if (v.listening && v.listening !== n.old) {
      if (!n.removed)
        return m(), null;
      x.push(Tn("p", "Your new player is ready ✓ Your old one is empty and no longer on this device.", "ppp-ok")), v.phrase && !v.backedUp ? x.push(Tn("p", "First, write down your new player’s 24 backup words. They are the only way back in if this passkey is ever lost."), uo("Back up my player · 24 words", e.backup, "primary")) : v.backedUp && x.push(Tn("p", "Its 24 backup words are written down ✓", "ppp-ok"));
      const X = v.passkeyName ? `the one called “${v.passkeyName}”` : "the newest one";
      return x.push(Tn("p", `Your phone still has the old player’s passkey. You can delete it in your phone’s saved passwords (search for “xtrata”) if you like: keep ${X}, which is this new player. Deleting a passkey cannot be undone, so do it only after the backup words are written down, and only if you are sure which is which. Leaving it there does no harm.`, "ppp-mute")), x.push(uo("Done", m, "quiet")), x;
    }
    if (!v.listening || n.removed)
      return n.removed ? (L(3, "claim your new player"), x.push(Tn("p", "Old player removed from this device ✓ Now claim your free player: it is made with a new passkey and comes with 24 backup words.", "ppp-ok")), x.push(uo("Hide this", m, "quiet")), x) : null;
    if (c(n.old), v.step === "locked" || v.step === "intro")
      return L(1, "empty it"), x.push(Tn("p", "Unlock your old player so it can be emptied."), uo("Unlock my old player", e.unlock, "primary"), B()), x;
    const U = e.keepBoth(v), A = (X) => (L(1, "empty it"), x.push(Tn("p", X, "ppp-warn")), U && x.push(uo("Keep both players instead", () => {
      m(), U();
    }, "primary")), x.push(B()), x);
    if (v.slot !== 0) return A("An album is open. Go back to your own player first.");
    if ((o == null ? void 0 : o.for) !== n.old)
      return L(1, "empty it"), x.push(Tn("p", "Checking what this player has…", "ppp-mute"), B()), x;
    if (o.n === null) return A("Could not check whether this player has albums of its own, so it will not be removed. Try again shortly.");
    if (o.n > 0) return A(`This player has ${o.n === 1 ? "an album" : `${o.n} albums`} of its own. Replacing it would leave ${o.n === 1 ? "it" : "them"} behind, so it stays.`);
    if (((_ = v.award) == null ? void 0 : _.state) === "claimed" && v.award.holds !== !1) return A("This player holds a Music Hero record. Send the record to another address first, or keep both players.");
    if (v.depositPending || v.entries.some((X) => ["prepared", "signed", "unknown", "pending"].includes(String(X.status))))
      return L(1, "empty it"), x.push(Tn("p", "Something is still on its way in or out of this player. This carries on by itself once it has settled.", "ppp-mute"), B()), x;
    if (v.balance === void 0)
      return L(1, "empty it"), x.push(Tn("p", "Checking what it holds…", "ppp-mute"), B()), x;
    if (v.balance > e.dust(v))
      return L(1, "empty it"), x.push(Tn("p", `It holds ${qg(v.balance)} STX. Send it back${v.returnTo ? ` to ${e.who(v.returnTo)}` : ""} first: nothing may be left in a player you are about to remove.`)), v.returnTo || v.gift ? x.push(uo("Send everything back", e.returnAll, "primary")) : x.push(Tn("p", "There is nowhere set to send it. Connect a Stacks wallet (top right) and link it to this player, then come back here.", "ppp-warn")), x.push(B()), x;
    L(2, "remove it from this device"), x.push(Tn("p", v.balance > 0n ? `Empty ✓ (the ${qg(v.balance)} STX left is less than the network fee to move it).` : "Empty ✓", "ppp-ok")), x.push(Tn("p", "What stays behind with the old player: its likes, its play history and any progress toward a Music Hero award. Your new player starts fresh.", "ppp-mute"));
    const T = uo(a ? "Check the box below…" : "Remove my old player", () => {
      a || (a = !0, i = "", e.changed(), e.forget().then(() => {
        r({ old: n.old, removed: !0 });
      }, (X) => {
        i = /cancel/i.test((X == null ? void 0 : X.message) || "") ? "" : (X == null ? void 0 : X.message) || "It was not removed.";
      }).finally(() => {
        a = !1, e.changed();
      }));
    }, "primary");
    return T.disabled = a || !!v.busy, x.push(T, B()), i && x.push(Tn("p", i, "ppp-warn")), x;
  }
  return { active: u, claiming: h, start: d, stop: m, lines: w };
}
const XL = [
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
function YL(e) {
  for (const [t, n] of XL) if (n.test(e)) return t;
  return null;
}
const Fb = (e) => /iP(hone|ad|od)/.test(e) || /Macintosh/.test(e) && /Mobile\//.test(e), jb = (e) => /Android/.test(e);
function qL(e, t) {
  const n = new URL(e);
  return n.protocol !== "https:" ? null : Fb(t) ? "x-safari-" + n.href : jb(t) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const WL = (e) => Fb(e) ? "Safari" : jb(e) ? "Chrome" : "your browser", Pi = "Xtrata Music player", ZL = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function Wg(e, t = (n) => n) {
  var s, i, a;
  if (e.mainConnected ?? !!e.main) return [];
  if (e.step === "off" || e.step === "elsewhere") return [];
  if (e.gate && (e.gate.enabled === !1 || e.gate.here === !1)) return [];
  if (e.step === "unsupported")
    return ((s = e.gate) == null ? void 0 : s.passkeyOnly) || e.linked || ((i = e.others) == null ? void 0 : i.length) ? [{ action: null, label: Pi, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], o = [...new Set([e.standIn, e.linked, ...e.others ?? []].filter((c) => !!c))];
  for (const c of o) {
    const u = e.standIn === c && ZL.has(e.step);
    r.push({
      action: "linked",
      main: c,
      label: `${Pi} · ${t(c)}`,
      detail: u ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${t(c)}.`
    });
  }
  if ((a = e.gate) != null && a.passkeyOnly && e.solo)
    switch (e.step) {
      case "intro":
        r.push({ action: "create", label: Pi, detail: "Make one with Face ID or your fingerprint. Nothing to install." });
        break;
      case "locked":
        r.push({ action: "unlock", label: Pi, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: Pi, detail: "Face ID or your fingerprint. Nothing to install." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: Pi, detail: "Open on this device." });
    }
  return r;
}
const td = "xtrata.radio.novice", Rb = "xtrata.radio.novice.previewed.v1", Zg = 6 * 6e4;
function JL(e, t) {
  let n = null;
  try {
    const r = new URLSearchParams(e).get("novice");
    if (r === "1" || r === "preview")
      t.set(td, r), n = r;
    else {
      if (r === "0")
        return t.set(td, null), { on: !1, preview: !1 };
      n = t.get(td);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const QL = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, Jg = (e) => QL.test(e ?? ""), eC = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, tC = {
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
}, nC = (e, t) => tC[e] ?? t;
function rC(e, t) {
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
const sC = "Make your player once, with Face ID or your fingerprint, and the music starts.", oC = "Checking your player…", hf = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function zb(e) {
  try {
    const t = JSON.parse(e.get(Rb) || "[]");
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function iC(e, t) {
  const n = zb(e).filter((r) => r !== t);
  n.push(t), e.set(Rb, JSON.stringify(n.slice(-50)));
}
function nd(e, t) {
  switch (t.kind) {
    case "offer":
      return e.album === t.album && e.phase !== "idle" ? e : { ...hf(), album: t.album, phase: t.already ? "done" : "open" };
    case "withdraw":
      return e.phase === "idle" ? e : hf();
    case "now":
      return e.phase === "open" && t.playing && t.track ? { ...e, phase: "playing", track: t.track, since: t.at } : e.phase === "playing" && t.track && t.track !== e.track ? { ...e, phase: "done" } : e.phase === "playing" && t.at - e.since > Zg ? { ...e, phase: "done" } : e;
    case "listened":
      return e.phase !== "playing" ? e : e.heard >= 1 ? { ...e, phase: "done" } : { ...e, heard: e.heard + 1 };
    case "tick":
      return e.phase === "playing" && t.at - e.since > Zg ? { ...e, phase: "done" } : e;
  }
}
const Kc = (e) => e.phase === "open" || e.phase === "playing";
function aC(e = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: e.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: e.sbtc === !0 }
  ];
}
const cC = [100, 250, 500, 1e3], lC = (e, t = jr) => BigInt(e) * On(t);
function uC(e, t = jr, n = 0n) {
  const r = ks - e - n;
  return r > 0n ? Number(r / On(t)) : 0;
}
function dC(e, t = jr, n = 0n) {
  const r = e === void 0 ? 0 : uC(e, t, n);
  return cC.map((o) => ({ plays: o, stx: lC(o, t), fits: e !== void 0 && o <= r }));
}
const fC = {
  microSTX: (e) => `${e / 1000000n}.${(e % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (e) => `${e.toLocaleString("en-GB")} sats`,
  pence: (e) => `£${e / 100n}.${(e % 100n).toString().padStart(2, "0")}`
}, hC = (e) => fC[e.unit](e.amount), Yt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, nl = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`;
function pC(e) {
  if (!e || e.plays < 1) return "";
  const t = [`paid for ${nl(e.plays, "play", "plays")}${e.artists > 0 ? ` to ${nl(e.artists, "artist", "artists")}` : ""}`];
  return e.likes > 0 && t.push(`saved ${nl(e.likes, "like", "likes")}`), `So far your player has ${t.join(" and ")}, all on the public record.`;
}
function gC(e) {
  let t = null, n = 0, r = "stx";
  const o = (i) => {
    var c;
    if (i.some((u) => u.plays === n && u.fits)) return;
    const a = i.filter((u) => u.fits);
    n = ((c = a.find((u) => {
      var h;
      return u.plays === ((h = i[1]) == null ? void 0 : h.plays);
    }) ?? a.at(-1)) == null ? void 0 : c.plays) ?? 0;
  };
  function s() {
    var w;
    if (!t) return;
    const i = e.input();
    if (!i) {
      t.close();
      return;
    }
    const a = dC(i.balance, i.fee, i.incoming);
    o(a);
    const c = aC(i.switches);
    (w = c.find((v) => v.id === r)) != null && w.on || (r = "stx");
    const u = [], h = Yt("h2", "ppp-connect__title", "Add plays");
    h.id = "ppp-restock-title", u.push(h), u.push(Yt("p", "ppp-restock__left", i.playsLeft === null ? "Checking your player…" : i.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${nl(i.playsLeft, "play", "plays")} left.`));
    const d = pC(i.done);
    if (d && u.push(Yt("p", "ppp-restock__done", d)), i.arriving)
      u.push(Yt("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (i.balance === void 0)
      u.push(Yt("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((v) => v.fits))
      u.push(Yt("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const v = Yt("div", "ppp-restock__packs");
      v.setAttribute("role", "group"), v.setAttribute("aria-label", "How many plays");
      for (const B of a) {
        const U = Yt("button", "ppp-restock__pack" + (B.plays === n ? " is-on" : ""));
        U.type = "button", U.disabled = !B.fits, U.setAttribute("aria-pressed", String(B.plays === n)), U.append(Yt("b", "", B.plays.toLocaleString()), Yt("span", "", "plays")), U.onclick = () => {
          n = B.plays, s();
        }, v.append(U);
      }
      u.push(v);
      const x = Yt("div", "ppp-restock__ways");
      x.setAttribute("role", "group"), x.setAttribute("aria-label", "How to pay");
      for (const B of c) {
        const U = Yt("button", "ppp-restock__way" + (B.id === r ? " is-on" : ""));
        U.type = "button", U.disabled = !B.on, U.setAttribute("aria-pressed", String(B.id === r)), U.append(Yt("b", "", B.label), Yt("span", "", B.on ? B.blurb : "Soon")), U.onclick = () => {
          r = B.id, s();
        }, x.append(U);
      }
      u.push(x);
      const L = a.find((B) => B.plays === n);
      if (L && r === "stx") {
        const B = Yt("div", "ppp-restock__pay"), U = hC({ unit: "microSTX", amount: L.stx }), A = Yt("p", "ppp-restock__amount");
        A.append("Send ", Yt("b", "", U), " to your player:"), B.append(A, Yt("p", "ppp-addr-full ppp-restock__addr", i.address));
        const T = Yt("div", "ppp-restock__row");
        T.append(e.copyButton("restock-address", "Copy address", () => i.address, "primary"), e.copyButton("restock-amount", "Copy amount", () => Mr(L.stx), "")), B.append(T), B.append(Yt("p", "ppp-restock__note", `From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: ${i.backedUp ? "your player is backed up, though larger amounts are safer in your main wallet" : "your player holds up to 1 STX"}. The plays appear here by themselves, usually within a few minutes, so you can close this.`)), u.push(B);
      }
    }
    u.push(Yt("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const m = Yt("button", "quiet ppp-connect__cancel", "Close");
    m.type = "button", m.onclick = () => t == null ? void 0 : t.close(), u.push(m), t.replaceChildren(...u);
  }
  return {
    isOpen: () => !!t,
    open() {
      if (t || !e.input()) return;
      t = Yt("dialog", "ppp-connect ppp-restock"), t.setAttribute("aria-labelledby", "ppp-restock-title");
      const i = t;
      i.addEventListener("close", () => {
        i.remove(), t === i && (t = null);
      }), i.addEventListener("click", (a) => {
        a.target === i && i.close();
      }), document.body.appendChild(i), s(), typeof i.showModal == "function" ? i.showModal() : i.setAttribute("open", "");
    },
    /** The page redrew (a balance changed, plays landed): keep the sheet in step. */
    refresh: s,
    close() {
      t == null || t.close();
    }
  };
}
const Is = (e) => e.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), yC = (e) => !e || /^(?:Inscription )?#\d+$/.test(e.trim());
function wC(e, t) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const o of Array.isArray(e) ? e : []) {
    const s = Number(o == null ? void 0 : o.id);
    if (!Number.isSafeInteger(s) || s < 0 || n.has(s)) continue;
    n.add(s);
    const i = t(s, { title: typeof o.title == "string" ? o.title : void 0, artist: typeof o.artist == "string" ? o.artist : void 0 });
    r.push({ id: s, title: yC(i.title) ? `#${s}` : i.title.trim(), artist: (i.artist || "").trim() });
  }
  return r.sort((o, s) => o.id - s.id);
}
function mC(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n.artist) continue;
    const r = Is(n.artist), o = t.get(r);
    o ? o.songs++ : t.set(r, { name: n.artist, songs: 1 });
  }
  return [...t.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function bC(e, t, n = "", r = 60) {
  const o = Is(t).split(/\s+/).filter(Boolean), s = Is(n);
  if (!o.length && !s) return { songs: [], total: 0 };
  const i = [];
  for (const a of e) {
    const c = Is(a.artist), u = Is(a.title), h = String(a.id);
    if (s && c !== s) continue;
    let d = 0, m = !0;
    for (const w of o) {
      const v = w.replace(/^#/, "");
      if (u.includes(w)) d += u.startsWith(w) ? 0 : 1;
      else if (/^\d+$/.test(v) && h === v) d += 0;
      else if (c.includes(w)) d += 2;
      else if (/^\d+$/.test(v) && h.startsWith(v)) d += 3;
      else {
        m = !1;
        break;
      }
    }
    m && i.push({ s: a, rank: d });
  }
  return i.sort((a, c) => a.rank - c.rank || a.s.id - c.s.id), { songs: i.slice(0, r).map((a) => a.s), total: i.length };
}
const Sr = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, Qg = 12;
function xC(e, t) {
  let n = null, r = "idle", o = "", s = "", i = !1;
  const a = Sr("input", "find-q");
  a.type = "search", a.placeholder = "Search songs, artists or #", a.setAttribute("aria-label", "Search all music"), a.autocomplete = "off";
  const c = Sr("div", "hint"), u = Sr("div", "find-artists"), h = Sr("ol", "likesList find-list");
  c.setAttribute("role", "status");
  const d = Sr("div", "likesTools");
  d.append(a), e.replaceChildren(d, c, u, h), a.oninput = () => {
    o = a.value, w();
  };
  function m() {
    r === "loading" || r === "ready" || (r = "loading", w(), t.load().then((v) => {
      n = v, r = "ready", w();
    }, () => {
      r = "failed", w();
    }));
  }
  function w() {
    const v = t.locked();
    if (a.disabled = v, v) {
      c.textContent = "An album is open and plays only its own songs. Go back to My player to find other music.", u.replaceChildren(), h.replaceChildren();
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
      const T = Sr("button", "", "Try again");
      T.type = "button", T.onclick = () => {
        r = "idle", m();
      }, c.append(T), u.replaceChildren(), h.replaceChildren();
      return;
    }
    const x = mC(n), L = i ? x : x.slice(0, Qg), B = (T, _, X, ce = "") => {
      const ne = Sr("button", "find-chip" + (_ ? " is-on" : ""), T);
      return ne.type = "button", ne.setAttribute("aria-pressed", String(_)), ce && (ne.title = ce), ne.onclick = X, ne;
    };
    u.replaceChildren(
      ...L.map((T) => B(`${T.name} · ${T.songs}`, Is(T.name) === Is(s), () => {
        s = Is(T.name) === Is(s) ? "" : T.name, w();
      }, `Show ${T.name}’s ${T.songs === 1 ? "song" : `${T.songs} songs`}`)),
      ...x.length > Qg ? [B(i ? "Fewer artists" : `All ${x.length} artists`, !1, () => {
        i = !i, w();
      })] : []
    );
    const U = bC(n, o, s), A = t.current();
    h.replaceChildren(...U.songs.map((T) => {
      var ce, ne;
      const _ = Sr("li", "lrow" + (T.id === A ? " now" : "")), X = Sr("button", "lt", T.title);
      if (X.type = "button", X.title = `Play “${T.title}”${T.artist ? ` by ${T.artist}` : ""}`, X.onclick = () => t.play(T.id), (ce = t.explicit) != null && ce.call(t, T.id)) {
        const q = Sr("span", "exp", "E");
        q.title = "Explicit lyrics: only plays when you choose it", X.append(" ", q);
      }
      if ((ne = t.liked) != null && ne.call(t, T.id)) {
        const q = Sr("span", "find-liked", "♥");
        q.title = "You like this song", q.setAttribute("role", "img"), q.setAttribute("aria-label", "Liked"), _.append(X, q);
      } else _.append(X);
      return _.append(Sr("span", "find-by", `${T.artist ? T.artist + " · " : ""}#${T.id}`)), _;
    })), c.textContent = !o.trim() && !s ? `${n.length.toLocaleString()} songs by ${x.length.toLocaleString()} artists. Search, or pick an artist.` : U.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : U.total > U.songs.length ? `Showing ${U.songs.length} of ${U.total.toLocaleString()}. Type more to narrow it down.` : `${U.total} ${U.total === 1 ? "song" : "songs"}${s ? ` by ${s}` : ""}. Tap one to play it.`;
  }
  return { load: m, refresh: w };
}
const ey = (e, t, n) => Lf(Bf(new TextEncoder().encode(`xtrata-music-hero:${e}:${t}:${n}`))).slice(0, 8), SC = 317, vC = (e) => typeof e == "number" && Number.isSafeInteger(e) && e >= 1 && e <= 999999999, AC = 15 * 6e4, EC = (e) => /iPhone|iPad|iPod/.test(e.userAgent) || /Macintosh/.test(e.userAgent) && e.maxTouchPoints > 1;
function rd(e, t) {
  return e.standalone ? null : t ? "prompt" : EC(e) ? "ios" : null;
}
const ji = {
  label: "Add to Home Screen",
  title: "Add it to your Home Screen",
  body: "Your phone only lets you do this from its own menu. It takes a few taps:",
  close: "Got it"
};
function kC(e) {
  var n;
  return /CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/.test(e) ? "other" : Number(((n = /Version\/(\d+)/.exec(e)) == null ? void 0 : n[1]) ?? 0) >= 26 ? "safari-dots" : "safari";
}
function $C(e) {
  return e === "safari-dots" ? { steps: ["Tap ••• at the bottom right of your screen", "Tap Share", "Scroll down and tap “Add to Home Screen”", "Tap Add"], where: "bottom-right" } : e === "safari" ? { steps: ["Tap the Share button at the bottom of your screen (a square with an arrow)", "Scroll down and tap “Add to Home Screen”", "Tap Add"], where: "bottom" } : { steps: ["Tap the Share button beside the address bar (a square with an arrow)", "Tap “Add to Home Screen”", "Tap Add"], where: "top-right" };
}
const cr = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, IC = (e) => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("viewBox", "0 0 26 26"), t.setAttribute("aria-hidden", "true");
  const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return n.setAttribute("d", e), t.append(n), t;
};
function LC(e, t, n = "safari") {
  const r = $C(n), o = cr("div", "a2hs-sheet a2hs-sheet--" + r.where);
  o.setAttribute("role", "dialog"), o.setAttribute("aria-modal", "true"), o.setAttribute("aria-label", ji.title);
  const s = cr("div", "a2hs-card"), i = cr("div", "a2hs-head"), a = cr("img", "a2hs-icon");
  a.src = e, a.alt = "";
  const c = cr("div");
  c.append(cr("h2", "", ji.title), cr("p", "", ji.body)), i.append(a, c);
  const u = cr("ol", "a2hs-steps");
  r.steps.forEach((m, w) => {
    const v = cr("li");
    v.append(cr("i", "", String(w + 1)), cr("span", "", m)), u.append(v);
  });
  const h = cr("div", "a2hs-arrow");
  h.setAttribute("aria-hidden", "true"), h.append(IC(r.where === "top-right" ? "M13 22V5M6 12l7-7 7 7" : "M13 4v17M6 14l7 7 7-7"));
  const d = cr("button", "a2hs-close", ji.close);
  return d.type = "button", d.onclick = t, s.append(i, u, d), o.append(s, h), o.onclick = (m) => {
    m.target === o && t();
  }, o;
}
function CC(e) {
  let t = null, n = null, r = !1;
  const o = () => {
    n == null || n.remove(), n = null, e.button.focus();
  }, s = () => {
    const i = r ? null : rd(e.env(), !!t);
    e.button.hidden = !i, e.button.dataset.kind = i ?? "";
  };
  return e.button.setAttribute("aria-label", ji.label), e.button.title = ji.label, e.button.onclick = () => {
    var a;
    const i = rd(e.env(), !!t);
    if (i === "prompt" && t) {
      const c = t;
      t = null;
      try {
        c.prompt();
      } catch {
      }
      s();
      return;
    }
    i === "ios" && !n && (n = LC(e.icon, o, kC(e.env().userAgent)), e.mount.append(n), (a = n.querySelector(".a2hs-close")) == null || a.focus());
  }, e.target.addEventListener("beforeinstallprompt", (i) => {
    i.preventDefault(), t = i, s();
  }), e.target.addEventListener("appinstalled", () => {
    r = !0, t = null, o(), s();
  }), s(), { sync: s, kind: () => r ? null : rd(e.env(), !!t) };
}
const ty = document.getElementById("ppp");
ty && TC(ty);
function TC(e) {
  var $n;
  const t = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = w1(), o = (l) => e.querySelector(l), s = o(".ppp-frame");
  let i = null;
  const a = async (l, p) => {
    const y = await fetch(l, { cache: "no-store", ...p, signal: AbortSignal.timeout(15e3) }), f = await y.json().catch(() => ({}));
    if (!y.ok) throw new Error((f == null ? void 0 : f.error) || `Request failed (${y.status}).`);
    return f;
  }, c = q5({
    now: Date.now,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    config: (l) => a("/radio/listening-wallet/config?main=" + encodeURIComponent(l || "")),
    links: async (l) => (await a("/radio/listening-wallet/link?main=" + encodeURIComponent(l))).links ?? [],
    mainOf: async (l) => {
      var y;
      const p = (await a("/radio/listening-wallet/link?listening=" + encodeURIComponent(l))).links;
      return ((y = p == null ? void 0 : p.find((f) => f.listening === l)) == null ? void 0 : y.main) ?? null;
    },
    saveLink: async (l) => {
      await a("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(l) });
    },
    bridge: async (l) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${l}; publickey-credentials-create ${l}`), i.referrerPolicy = "no-referrer";
      const p = new Promise((ae, Se) => {
        i.addEventListener("load", () => ae(), { once: !0 }), setTimeout(() => Se(new Error("The listening wallet did not load.")), 15e3);
      });
      i.src = l + "/", s.replaceChildren(i), await p;
      const y = new c1({ walletOrigin: l, frame: i, timeoutMs: 30 * 6e4 }), f = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.backup", "listening.signAward", "listening.approveSession", "listening.prepareReturn"]), j = (ae, Se) => f.has(ae) ? y.request(ae, Se) : Promise.race([
        y.request(ae, Se),
        new Promise((Ee, Oe) => setTimeout(() => Oe(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await j("listening.status"), { request: j };
    },
    chain: {
      verify: L5,
      balance: T5,
      account: C5,
      owner: B5,
      broadcast: N5,
      transaction: M5,
      confirmedNonce: async (l) => {
        const p = await bo(`/v2/accounts/${l}?proof=0`);
        if (!Number.isSafeInteger(p == null ? void 0 : p.nonce) || p.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(p.nonce);
      }
    },
    signWithMain: (l, p) => zu({ ...p, network: "mainnet", stxAddress: l }),
    deposit: (l, p, y) => new Promise((f, j) => fg({
      recipient: p,
      amount: y.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: l,
      network: new sd(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (ae) => f(ae.txId || ""),
      onCancel: () => j(new Error("Deposit cancelled. Nothing was sent.")),
      onError: j
    })),
    validate: P5,
    tabLock: (l) => new Promise((p) => {
      const y = navigator.locks;
      if (!(y != null && y.request)) {
        p(!0);
        return;
      }
      y.request("xtrata-ppp:" + l, { ifAvailable: !0 }, async (f) => {
        p(!!f), f && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, p) => {
        try {
          localStorage.setItem(l, p);
        } catch {
        }
      }
    },
    changed: () => g(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (l) => {
      var p, y;
      return v.funder(l, () => F5(l, bo), !!((y = (p = c.snapshot().gate) == null ? void 0 : p.gifts) != null && y.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (l) => {
      const p = await a("/radio/gift/for?wallet=" + encodeURIComponent(l)), y = p == null ? void 0 : p.gift;
      if (!y) return null;
      if (typeof y.returnTo != "string" || typeof y.treasury != "string") throw new Error("Unreadable gift record.");
      return {
        returnTo: y.returnTo,
        from: typeof y.from == "string" ? y.from : null,
        source: String(y.source ?? ""),
        amount: String(y.amount ?? "0"),
        treasury: y.treasury,
        state: y.state === "sending" ? "sending" : "arrived",
        player: y.player ?? null,
        ...y.drop === "players" || y.drop === null ? { drop: y.drop } : {}
      };
    },
    // Music Hero awards: a failed request throws (shown as "can't check"), it is never read as "no award" or "no plays".
    awardStatus: async (l) => {
      const p = await a("/radio/awards/status?address=" + encodeURIComponent(l));
      if (typeof (p == null ? void 0 : p.state) != "string") throw new Error("Unreadable award status.");
      return p;
    },
    awardName: async (l) => {
      const p = await a("/radio/awards/name?address=" + encodeURIComponent(l));
      if ((p == null ? void 0 : p.name) !== null && typeof (p == null ? void 0 : p.name) != "string") throw new Error("Unreadable name.");
      return p.name;
    },
    awardNote: async (l, p) => {
      const y = await a("/radio/awards/note", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: l, name: p }) });
      if (typeof (y == null ? void 0 : y.record) != "string" || typeof (y == null ? void 0 : y.signature) != "string" || !Number.isSafeInteger(y == null ? void 0 : y.cls) || !Number.isSafeInteger(y == null ? void 0 : y.number) || !Number.isSafeInteger(y == null ? void 0 : y.plays)) throw new Error("Unreadable award note.");
      return { cls: y.cls, number: y.number, plays: y.plays, record: y.record, signature: y.signature, name: typeof y.name == "string" ? y.name : null };
    },
    history: (l, p) => z5(l, (y) => bo(y), p),
    likesChanged: () => {
      var l, p;
      (p = (l = window.XtrataRadio) == null ? void 0 : l.refreshLikes) == null || p.call(l);
    },
    likeState: async (l, p) => {
      const y = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: l, ids: String(p) })), f = Array.isArray(y == null ? void 0 : y.rows) ? y.rows.find((j) => (j == null ? void 0 : j.id) === p) : null;
      if (!f || typeof f.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: f.liked, by: Array.isArray(f.by) ? f.by.filter((j) => typeof j == "string") : f.liked ? [l] : [] };
    },
    likeSent: (l, p) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: l, liked: p } })),
    nameOf: (l) => yt(l) ?? void 0,
    likeConfirmed: (l, p) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: l, liked: p } })),
    likeFailed: (l) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: l } }))
  }), u = (l, p, y, f, j, ae) => new Promise((Se, Ee) => fg({
    recipient: f,
    amount: j.toString(),
    memo: ae,
    stxAddress: y,
    network: new sd(),
    appDetails: { name: l, icon: "/favicon.svg" },
    onFinish: (Oe) => Se(Oe.txId || ""),
    onCancel: () => Ee(new Error(p)),
    onError: Ee
  })), h = (l) => v.incomingStarter() && l.canAnother && l.hadGift === !1 && !l.main && l.listening && !l.createdHere && !l.brandNew && ["locked", "ready", "fund", "over", "link"].includes(l.step) && !l.busy ? () => void c.create({ quick: !0, another: !0 }) : null, d = (l) => h(l) && l.canForget ? () => {
    m.start(l), g(c.snapshot());
  } : null, m = VL({
    json: a,
    unlock: () => void c.unlock(),
    returnAll: () => void c.returnFunds("all"),
    forget: () => c.forget(),
    backup: () => void c.backup(),
    keepBoth: (l) => h(l),
    who: (l) => ve(l),
    changed: () => g(c.snapshot()),
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, p) => {
        try {
          p === null ? localStorage.removeItem(l) : localStorage.setItem(l, p);
        } catch {
        }
      }
    },
    dust: (l) => {
      var p;
      return BigInt(((p = l.gate) == null ? void 0 : p.limits.returnFee) ?? "3000");
    }
  }), w = () => ({ quick: !!v.incomingStarter(), ...m.claiming() ? { another: !0 } : {} }), v = nL({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    pay: (l, p, y, f) => u("Xtrata Radio · gift", "Gift cancelled. Nothing was sent.", l, p, y, f),
    sign: (l, p) => zu({ ...p, network: "mainnet", stxAddress: l }),
    giftSent: (l, p) => c.giftSent(l, p),
    claiming: (l) => c.giftClaiming(l),
    batchDays: () => {
      var l, p;
      return (p = (l = c.snapshot().gate) == null ? void 0 : l.gifts) == null ? void 0 : p.batchDays;
    },
    claimNew: (l) => h(l),
    replaceOld: (l) => d(l),
    album: { bind: (l) => c.bindAlbum(l), arrived: async (l, p, y, f) => {
      x.invalidate(), await c.albumArriving(l, p, y, f);
    } },
    who: (l) => ve(l),
    changed: () => g(c.snapshot()),
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, p) => {
        try {
          p === null ? localStorage.removeItem(l) : localStorage.setItem(l, p);
        } catch {
        }
      }
    },
    now: Date.now
  }), x = fL({
    json: a,
    open: (l) => {
      c.openAlbum(l);
    },
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, p) => {
        try {
          p === null ? localStorage.removeItem(l) : localStorage.setItem(l, p);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => g(c.snapshot())
  }), L = {
    get: (l) => {
      try {
        return localStorage.getItem(l);
      } catch {
        return null;
      }
    },
    set: (l, p) => {
      try {
        p === null ? localStorage.removeItem(l) : localStorage.setItem(l, p);
      } catch {
      }
    }
  }, B = JL(location.search, L);
  B.on && (document.documentElement.dataset.novice = B.preview ? "preview" : "1");
  const U = (l) => B.on && l.solo, A = B.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), T = A ? document.getElementById("album") : null, _ = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (l) => void c.topUpAlbum(l),
    openPlayer: () => void c.openAlbum(0)
  }, X = T ? Vg(T, _) : null, ce = KL({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    sign: (l, p) => zu({ ...p, network: "mainnet", stxAddress: l }),
    signShelf: (l, p) => c.signShelf(l, p),
    pay: (l, p, y, f) => u("Xtrata Music · album", "Payment cancelled. Nothing was sent.", l, p, y, f),
    copies: (l, p) => {
      var y;
      return v.copies(l, p, ((y = c.snapshot().gate) == null ? void 0 : y.radioUrl) ?? null);
    },
    player: () => {
      const l = c.snapshot(), p = l.slot === 0 ? l.listening : l.root;
      return { address: p, unlocked: !!p && ["ready", "fund", "over", "link"].includes(l.step) };
    },
    open: (l) => mr(l, !0),
    who: (l) => ve(l),
    art: { song: (l, p) => p && Nh(String(l)) || Rg(String(l)), cover: (l) => tl(l) },
    audition: BL({
      changed: () => g(c.snapshot()),
      quiet: () => {
        var p;
        const l = window.XtrataRadio;
        try {
          (p = l == null ? void 0 : l.getState) != null && p.call(l).playing && l.playPause();
        } catch {
        }
      }
    }),
    changed: () => g(c.snapshot()),
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, p) => {
        try {
          p === null ? localStorage.removeItem(l) : localStorage.setItem(l, p);
        } catch {
        }
      }
    },
    now: () => Date.now()
  }), ne = () => {
    const l = new Set(gn.map((p) => p.id));
    return [...gn, ...ce.albums().filter((p) => !l.has(p.id))];
  }, q = T ? UL(T) : null, b = "xtrata.radio.award.later.v1";
  let I = "ready", N = !1, P = (() => {
    try {
      return Date.now() - Number(localStorage.getItem(b) || 0) < 24 * 36e5;
    } catch {
      return !1;
    }
  })(), W = !1;
  const R = "xtrata.radio.tier.v1";
  let le = (() => {
    const l = L.get(R);
    return jc(l) ? jo(l) : null;
  })();
  const ue = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function Xe(l) {
    var j;
    if (l.listening && l.slot === 0 && ["fund", "ready", "over"].includes(l.step) && !(l.gift && l.gift.drop === void 0)) {
      let ae = null;
      try {
        ae = l.gift && !l.gift.player && l.gift.drop === "players" ? YI(BigInt(l.gift.amount)) : null;
      } catch {
        ae = null;
      }
      ((j = l.award) == null ? void 0 : j.state) === "claimed" && l.award.holds === !1 && (ae = null), ((ae == null ? void 0 : ae.id) ?? null) !== ((le == null ? void 0 : le.id) ?? null) && (le = ae, L.set(R, ae ? ae.id : null));
    }
    const p = document.documentElement;
    le ? p.dataset.tier = le.id : delete p.dataset.tier;
    const y = document.querySelector("#ppp .ppp-head h3");
    if (!y) return;
    let f = y.querySelector(".ppp-tier");
    if (!le) {
      f == null || f.remove();
      return;
    }
    f || (f = $("span", "", "ppp-tier"), y.append(f)), f.dataset.tier = le.id, f.textContent = `${le.mark} ${le.name.toUpperCase()} PLAYER`, f.title = `A ${le.name} player from the Xtrata Music giveaway`;
  }
  const C = (() => {
    var l;
    try {
      return !!((l = window.matchMedia) != null && l.call(window, "(display-mode: standalone)").matches) || navigator.standalone === !0;
    } catch {
      return !1;
    }
  })(), F = document.getElementById("a2hs");
  F && CC({
    button: F,
    icon: "/radio/icons/app-192.png",
    mount: document.body,
    target: window,
    env: () => ({ userAgent: navigator.userAgent, maxTouchPoints: navigator.maxTouchPoints || 0, standalone: C })
  });
  let re = B.on ? SC : null, de = !1, Be = 0, Me = "";
  B.on && a("/radio/giveaway/players/intro").then((l) => {
    const p = l && l.song === null ? null : vC(l == null ? void 0 : l.song) ? l.song : re;
    p !== re && !de && (re = p, g(c.snapshot()));
  }).catch(() => {
  });
  const Ot = (() => {
    try {
      const l = Number(new URLSearchParams(location.search).get("n"));
      Number.isSafeInteger(l) && l >= 1 && l <= 1e5 && sessionStorage.setItem("xtrata.radio.spot", String(l));
      const p = Number(sessionStorage.getItem("xtrata.radio.spot"));
      return Number.isSafeInteger(p) && p >= 1 ? p : null;
    } catch {
      return null;
    }
  })(), Ge = (l) => {
    var f, j, ae;
    if (!de || re === null) return !1;
    if (Date.now() - Be > AC || l.step === "ready")
      return l.step !== "ready" && (de = !1), !1;
    const p = (j = (f = window.XtrataRadio) == null ? void 0 : f.getState) == null ? void 0 : j.call(f), y = Number((ae = p == null ? void 0 : p.nowPlaying) == null ? void 0 : ae.tokenId);
    return Date.now() - Be < 2e4 && !Number.isSafeInteger(y) ? !0 : y !== re ? (de = !1, !1) : !0;
  };
  function Pe() {
    const l = window.XtrataRadio;
    if (!(re === null || !(l != null && l.playToken))) {
      de = !0, Be = Date.now(), c.holdFirstPlay(), g(c.snapshot());
      try {
        l.playToken(re);
      } catch {
        de = !1;
      }
    }
  }
  const _e = () => {
    var f, j;
    if (!de || re === null) return null;
    const l = (j = (f = window.XtrataRadio) == null ? void 0 : f.getState) == null ? void 0 : j.call(f), p = l != null && l.nowPlaying && Number(l.nowPlaying.tokenId) === re ? l.nowPlaying : null, y = Rt.get(re);
    return { title: (p == null ? void 0 : p.title) || (y == null ? void 0 : y.title) || "", artist: (p == null ? void 0 : p.artist) || (y == null ? void 0 : y.artist) || "", art: `/radio/artwork?id=${re}`, playing: !!(l != null && l.playing) };
  }, Pt = B.on && T ? SL(T) : null, En = Date.now();
  let lt = !1, Zt = null, kt = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const z = () => {
    kt = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    g(c.snapshot());
  }, H = (l, p) => {
    var ae;
    if (!Pt || p || kt) return null;
    if (!l.gate || l.step === "loading" || (lt = !0), !lt) return Date.now() - En < 1e4 ? "checking" : null;
    if (!U(l) || m.active() && l.step !== "intro") return null;
    if (l.step === "intro" || l.step === "unsupported") return v.incomingStarter() ? "gift" : "new";
    if (l.step === "locked") return "back";
    const f = l.slot === 0 && !((ae = l.gift) != null && ae.player), j = f && !l.entries.some((Se) => Se.kind === "play");
    return l.step === "fund" && j ? l.depositPending ? "arriving" : "empty" : l.step === "ready" && f && (Zt === "landed" || Zt === "arriving" && (j || de)) ? "landed" : l.step === "loading" && Zt !== "checking" ? Zt : null;
  };
  let Q = !1;
  function se(l, p, y = [], f) {
    if (!Pt) return;
    const j = f !== void 0 ? f : H(l, p);
    if (Zt = j, delete document.documentElement.dataset.noviceBoot, !j) {
      Pt.render(null, p);
      return;
    }
    const ae = [...y];
    j === "arriving" && l.arrival && ae.push(Dn(l.arrival)), l.step === "unsupported" ? ae.push($("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : l.error && ae.push($("p", l.error, "ppp-warn"));
    const Se = j === "gift" ? v.incomingStarter() : null;
    Se && re === null && !Q && l.step === "intro" && !l.busy && !l.armed && !l.error && !er && (Q = !0, c.create({ quick: !0, ...m.claiming() ? { another: !0 } : {} })), Pt.render({
      mode: j,
      status: ae,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      canStart: (l.step === "intro" || l.step === "locked") && !er,
      plays: Se ? Se.plays : j === "landed" ? l.playsLeft : null,
      from: (Se == null ? void 0 : Se.from) ?? null,
      tier: le,
      mystery: ue,
      spot: Ot,
      installed: C,
      intro: Se && re !== null && l.step === "intro" ? { ready: !0 } : null,
      now: _e(),
      albums: j === "landed" ? gn.map((Ee) => ({ title: Ee.title, by: Ee.subtitle, cover: tl(Ee.cover), run: () => {
        z(), mr(Ee, !0);
      } })) : [],
      claimNew: j === "back" ? h(l) : null,
      replaceOld: j === "back" ? d(l) : null,
      start: () => {
        Se && re !== null && Pe(), c.create(w());
      },
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => Ne(),
      full: () => {
        var Tt, ht, ot;
        const Ee = window.XtrataRadio, Oe = j === "landed" && !((ht = (Tt = Ee == null ? void 0 : Ee.getState) == null ? void 0 : Tt.call(Ee)) != null && ht.playing);
        de = !1, z(), Oe && ((ot = Ee == null ? void 0 : Ee.playPause) == null || ot.call(Ee));
      }
    });
  }
  Pt && setTimeout(() => {
    lt || g(c.snapshot());
  }, 10100), Ch(() => {
    (Pt != null && Pt.showing() || document.documentElement.dataset.asking || ce.wantsArt()) && g(c.snapshot());
  });
  const dt = gC({
    input: () => {
      var j, ae, Se, Ee;
      const l = c.snapshot();
      if (!["fund", "ready", "over"].includes(l.step)) return null;
      const p = l.slot === 0 ? { address: l.listening, balance: l.balance } : { address: l.root, balance: (j = l.likeFunds) == null ? void 0 : j.balance };
      if (!p.address) return null;
      const y = l.slot === 0 ? l.entries : [], f = y.filter((Oe) => Oe.kind === "play" && Oe.status === "confirmed");
      return {
        playsLeft: p.balance === void 0 ? null : Ce(p.balance),
        balance: p.balance,
        incoming: 0n,
        fee: BigInt(((ae = l.gate) == null ? void 0 : ae.limits.playFee) ?? "300"),
        address: p.address,
        switches: ((Se = l.gate) == null ? void 0 : Se.restock) ?? {},
        backedUp: l.backedUp,
        done: f.length ? { plays: f.length, artists: new Set(f.map((Oe) => Oe.recipient)).size, likes: y.filter((Oe) => Oe.kind === "like" && Oe.status === "confirmed" && Oe.liked).length } : null,
        arriving: l.slot === 0 ? l.depositPending : !!((Ee = l.likeFunds) != null && Ee.pending)
      };
    },
    copyButton: (l, p, y, f) => fr(l, p, y, f, () => {
      g(c.snapshot());
    })
  }), Ne = () => {
    if (!c.snapshot().unproven) {
      dt.open();
      return;
    }
    c.prove().then((l) => {
      l && dt.open();
    });
  }, He = document.getElementById("albumList"), St = He ? Vg(He, _, { list: !0 }) : null, Ke = "xtrata.radio.album.last.v1", Ie = () => {
    try {
      const l = JSON.parse(localStorage.getItem(Ke) || "null");
      return l && typeof l.root == "string" && Number.isSafeInteger(l.slot) && l.slot > 0 && l.player && Array.isArray(l.player.tracks) ? l : null;
    } catch {
      return null;
    }
  };
  let Ze = "";
  const Ye = (l) => {
    const p = JSON.stringify(l);
    if (p !== Ze) {
      Ze = p;
      try {
        localStorage.setItem(Ke, p);
      } catch {
      }
    }
  };
  let Ve = null;
  window.XtrataRadioLikeHandler = (l) => {
    var y;
    if (!l || !Number.isSafeInteger(l.song) || l.song < 0) return !1;
    (y = c.snapshot().likeFunds) != null && y.album && (O = !0), Xn();
    const p = Nn(l.song, { title: l.title, artist: l.artist });
    return c.heart({ song: l.song, title: p.title || void 0, artist: p.artist || void 0, likedBy: Array.isArray(l.likedBy) ? l.likedBy : void 0 });
  };
  let Ht;
  window.XtrataRadioListeningIdentity = () => {
    const l = c.snapshot();
    return l.solo && l.step !== "off" && l.step !== "elsewhere" ? l.listening : void 0;
  };
  const pn = (l) => {
    var y, f;
    const p = window.XtrataRadioListeningIdentity();
    p !== Ht && (Ht = p, (f = (y = window.XtrataRadio) == null ? void 0 : y.refreshLikes) == null || f.call(y));
  };
  let gn = [], Vn = 0, $t = !1, un = null;
  const Ir = (l) => {
    var p, y;
    $t || !((y = (p = l.gate) == null ? void 0 : p.gifts) != null && y.enabled) || Date.now() - Vn < 6e4 || (Vn = Date.now(), a("/radio/gift/featured").then((f) => {
      gn = (Array.isArray(f == null ? void 0 : f.players) ? f.players : []).filter((j) => j && typeof j.id == "string" && typeof j.title == "string" && Array.isArray(j.tracks) && j.tracks.length > 0).slice(0, 6), $t = !0, gn.length && g(c.snapshot());
    }).catch(() => {
    }));
  }, Rr = (l) => {
    var p;
    return un && l.slot === 0 && !((p = l.gift) != null && p.player) && ["ready", "fund", "loading"].includes(l.step) ? un : null;
  }, mr = (l, p = !1) => {
    var f, j;
    un = l, g(c.snapshot());
    const y = l && p ? Hr(l)[0] : null;
    y && ((j = (f = window.XtrataRadio) == null ? void 0 : f.playToken) == null || j.call(f, y.id));
  };
  let bt = hf(), yn = null;
  const Dt = (l) => {
    const p = B.preview && !er && l.step === "intro" ? v.incomingAlbum() : null;
    return p ? (bt = nd(bt, { kind: "offer", album: p.player.id, already: zb(L).includes(p.player.id) }), Kc(bt) ? p.player : null) : (bt = nd(bt, { kind: "withdraw" }), null);
  }, wn = (l) => {
    const p = bt.phase;
    bt = nd(bt, l), bt.phase !== p && (bt.album && (bt.phase === "playing" || bt.phase === "done") && iC(L, bt.album), g(c.snapshot()));
  };
  setInterval(() => {
    bt.phase === "playing" && wn({ kind: "tick", at: Date.now() });
  }, 5e3);
  let Et = "", Vt, zr = !1, us = !1;
  const E = (l, p) => {
    var qe, je, Bt, qn, sr, Ds, ms, Ai;
    const y = window.XtrataRadio;
    if (!(y != null && y.setGiftPlayer) || !(y != null && y.setGiftStop)) return;
    const f = p.depositPending && l.step === "fund" && ((qe = l.giftStop) == null ? void 0 : qe.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : l.giftStop, j = yn, ae = Ge(l), Se = f ? U(l) ? nC(f.reason, f.text) : f.text : null, Ee = j || ae ? null : Se ?? (t && (!((je = l.gate) != null && je.here) || l.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    Ee && Ee !== Vt && (y.setGiftStop(Ee), Vt = Ee);
    const Oe = l.step === "off" || l.step === "elsewhere" ? null : ((Bt = l.gift) == null ? void 0 : Bt.player) ?? j ?? Rr(l) ?? null, Tt = Oe ? Oe.id + ":" + Oe.cover + ":" + Oe.tracks.map((Fn) => Fn.id).join(",") : "";
    Tt !== Et && (y.setGiftPlayer(Oe ? { id: Oe.id, title: Oe.title, subtitle: Oe.subtitle, tracks: Hr(Oe).map((Fn) => Fn.id), hidden: ((qn = VI(Oe)) == null ? void 0 : qn.id) ?? null, cover: Oe.cover } : null), Et = Tt), Ee !== Vt && (y.setGiftStop(Ee), Vt = Ee);
    const ht = !ae && (f == null ? void 0 : f.reason) === "arriving";
    ht !== us && ((sr = y.setGiftWait) == null || sr.call(y, ht), us = ht);
    const ot = !!Oe && (!!j || !!((Ds = l.albumLock) != null && Ds.locked));
    ot !== zr && ((ms = y.setGiftLock) == null || ms.call(y, ot), zr = ot), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(l.step) && ((Ai = y.forgetWallets) == null || Ai.call(y));
  };
  let O = !1;
  const K = /* @__PURE__ */ new Map(), D = (l) => {
    if (!(l.step === "fund" && !l.depositPending && !!l.gift && !!l.listening && l.balance === 0n && !l.entries.some((f) => f.kind === "play") && (l.brandNew || l.createdHere))) return null;
    let y = K.get(l.listening);
    return y === void 0 && (y = Date.now(), K.set(l.listening, y)), Date.now() - y < Cl ? y : null;
  }, J = (l) => l.step === "fund" && !l.depositPending && !!l.gift && l.balance === 0n && !l.entries.some((p) => p.kind === "play") && !!l.listening && K.has(l.listening), ee = (l) => l ? l.slice(0, 6) + "…" + l.slice(-4) : "", Ce = (l) => {
    const p = c.snapshot().playCost || 350n;
    return l > on ? Number((l - on) / p) : 0;
  }, Ae = (l) => (Number(l) / 1e6).toFixed(l < 1000n ? 6 : 4), Fe = (l) => {
    const p = Math.round((Date.now() - l) / 6e4);
    return p < 1 ? "now" : p < 60 ? `${p}m` : p < 1440 ? `${Math.round(p / 60)}h` : `${Math.round(p / 1440)}d`;
  }, ft = (l) => `https://explorer.hiro.so/txid/${l}?chain=mainnet`, $ = (l, p = "", y = "") => {
    const f = document.createElement(l);
    return p && (f.textContent = p), y && (f.className = y), f;
  }, pe = (l, p, y = "") => {
    const f = $("button", l, y);
    return f.type = "button", f.onclick = p, f;
  }, ze = (l, p) => {
    const y = $("a", l);
    return y.href = p, y.target = "_blank", y.rel = "noopener", y;
  };
  let ut = null, Xt = location.hash === "#give";
  Xt && history.replaceState(null, "", location.pathname + location.search);
  let Ft = !1;
  const dn = NI((l) => BI({ address: l, network: "mainnet" }), () => g(c.snapshot())), yt = (l) => dn.get(l), er = YL(navigator.userAgent), Gr = (l, p) => {
    const y = navigator.userAgent, f = WL(y), j = `${location.origin}${location.pathname}${p ? `#gift=${p}` : ""}`, ae = [$("p", `You are in ${l}'s built-in browser, where passkeys often do not work. Open this page in ${f} to make your ${B.on ? "player" : "listening wallet"}${p ? B.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], Se = $("div", "", "ppp-open-row"), Ee = qL(j, y);
    if (Ee) {
      const Oe = $("a", `Open in ${f}`, "primary ppp-open-in");
      Oe.href = Ee, Oe.dataset.homeAction = "radio:open-in-browser", Se.append(Oe);
    }
    return Se.append(fr("copy-page-link", "Copy link", () => j, Ee ? "" : "primary", () => g(c.snapshot()))), ae.push(Se, $("p", `If that does not open ${f}, use ${l}'s menu (••• or ⋮) and choose "Open in ${f === "your browser" ? "browser" : f}", or paste the copied link there.`, "ppp-mute")), ae;
  }, ve = (l) => yt(l) ?? ee(l), Jt = (l) => l.slice(0, 2).map(ve).join(" and ") + (l.length > 2 ? ` and ${l.length - 2} more` : ""), Ao = /* @__PURE__ */ new Map();
  let tr = !1;
  const Eo = (l) => !l || /^(?:Inscription )?#\d+$/.test(l.trim()), Xn = () => {
    tr || (tr = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : null).then((l) => {
      for (const p of Array.isArray(l == null ? void 0 : l.tracks) ? l.tracks : []) {
        const y = Number(p == null ? void 0 : p.id);
        Number.isSafeInteger(y) && Ao.set(y, { title: typeof p.title == "string" ? p.title : void 0, artist: typeof p.artist == "string" ? p.artist : void 0 });
      }
      g(c.snapshot());
    }).catch(() => {
      tr = !1;
    }));
  }, Nn = (l, p) => {
    const y = Ao.get(l), f = Tg(l, [y == null ? void 0 : y.title, p == null ? void 0 : p.title].find((ae) => !Eo(ae)) || ""), j = Lg(l, (y == null ? void 0 : y.artist) || (p == null ? void 0 : p.artist) || "");
    return { title: f, artist: j };
  }, mn = (l) => {
    const { title: p, artist: y } = Nn(l.song, l);
    return p ? `“${p}”${y ? ` — ${y}` : ""}` : `Song #${l.song}${y ? ` — ${y}` : ""}`;
  }, Ns = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, ko = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function wi(l) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(l.step) ? ["", ""] : l.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : l.step === "over" ? ["TOO MUCH", "bad"] : l.step === "locked" ? ["LOCKED", "mute"] : l.step === "intro" || l.step === "link" ? ["", ""] : l.step === "fund" ? l.depositPending ? ["ON ITS WAY", "warn"] : l.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : l.payingOn && l.session && l.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function Mn(l, p, y = "", f) {
    const j = $("dt", l), ae = $("dd", p, y);
    return f && ae.append(" ", f), [j, ae];
  }
  const nr = document.getElementById("ppp-top"), ds = () => {
    window.dispatchEvent(new CustomEvent("xtrata:radio-panel")), (s.hidden || s.classList.contains("ppp-frame--rest") ? e : s).scrollIntoView({ behavior: "smooth", block: "center" }), e.classList.remove("ppp-flash"), e.offsetWidth, e.classList.add("ppp-flash");
  }, Kr = () => {
    var p;
    const l = window.XtrataRadioConnectStacks;
    l ? l() : (p = document.getElementById("radio-wallet-connect")) == null || p.click();
  }, Yn = () => {
    var p, y;
    const l = c.snapshot();
    if (l.step === "connect" || l.step === "wrong-wallet") {
      Kr();
      return;
    }
    if (l.step === "elsewhere" && ((p = l.gate) != null && p.radioUrl)) {
      location.href = l.gate.radioUrl;
      return;
    }
    if (l.step === "locked" && !l.armed && !l.busy && c.unlock(), l.step === "ready" && ((y = l.giftStop) == null ? void 0 : y.reason) === "off" && !l.busy && c.switchOn(), l.step === "fund" && l.solo && !l.depositPending && !l.busy) {
      Ne();
      return;
    }
    ds();
  };
  nr && (nr.onclick = Yn);
  const $o = (l, p, y, f = "") => l.standIn && !l.mainConnected ? pe(`Connect ${ve(l.standIn)} to add STX`, Kr, f) : pe(p, y, f), Io = (l) => {
    c.useLinked(l).then(() => ds());
  };
  let fs = null;
  const Ms = () => {
    const l = Wg(c.snapshot(), ve);
    return l.length ? fs || (fs = new Promise((p) => {
      var ht;
      const y = $("dialog", "", "ppp-connect");
      y.setAttribute("aria-labelledby", "ppp-connect-title");
      let f = null;
      const j = (ot) => {
        f = ot, y.close();
      };
      y.addEventListener("close", () => {
        y.remove(), fs = null, p(f);
      }), y.addEventListener("click", (ot) => {
        ot.target === y && j(null);
      });
      const ae = (ot, qe, je, Bt, qn = !1) => {
        const sr = $("button", "", "ppp-connect__opt " + je);
        return sr.type = "button", sr.disabled = qn, sr.onclick = Bt, sr.append($("b", ot), $("span", qe)), sr;
      }, Se = $("h2", "Connect to Xtrata Music", "ppp-connect__title");
      Se.id = "ppp-connect-title";
      const Ee = l.map((ot) => ae(ot.label, ot.detail, "is-music", () => {
        if (j("music"), ot.action === "linked" && ot.main) {
          Io(ot.main);
          return;
        }
        const qe = Wg(c.snapshot(), ve).find((je) => je.action !== "linked");
        (qe == null ? void 0 : qe.action) === "create" ? c.create() : (qe == null ? void 0 : qe.action) === "unlock" && c.unlock(), ds();
      }, !!ot.disabled)), Oe = ae("Xverse or Leather", "If you already use one.", "is-stacks", () => j("stacks")), Tt = pe("Cancel", () => j(null), "quiet ppp-connect__cancel");
      y.append(Se, ...Ee, Oe, Tt), document.body.appendChild(y), y.showModal(), (ht = Ee.find((ot) => !ot.disabled)) == null || ht.focus();
    }), fs) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = Ms;
  function hs(l) {
    if (!nr) return;
    const p = (f, j, ae) => {
      nr.hidden = !1, nr.className = "ppp-top" + (j ? " is-" + j : ""), nr.replaceChildren($("span", "", "dot"), document.createTextNode(f)), nr.title = ae;
    }, y = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0;
    switch (l.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        nr.hidden = !0;
        return;
      case "elsewhere":
        return p("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        nr.hidden = !0;
        return;
      case "intro":
        return p("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return p(`Connect ${ve(l.linked)}`, "warn", `This device's listening wallet belongs to ${ve(l.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return p("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return p("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return l.depositPending ? p("Plays on their way", "quiet", "Plays start by themselves when they land") : p(l.entries.some((f) => f.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return p("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return p("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return l.payingOn && y > 0 && !l.giftStop ? p(`${y.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : p("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const ln = document.getElementById("pppNudge"), ps = document.getElementById("onair");
  ($n = ln == null ? void 0 : ln.querySelector("button")) == null || $n.addEventListener("click", () => Yn());
  const mi = {
    connect: "Connect your player to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, Lo = {
    elsewhere: "Open",
    connect: "Connect",
    "wrong-wallet": "Switch wallet",
    intro: "Set up",
    locked: "Unlock",
    link: "Finish setup",
    fund: "Add plays",
    over: "Fix it",
    ready: "Switch on"
  }, Ps = document.getElementById("claimCard");
  let _s = !1, gs = 0, ys = 0;
  function bi(l) {
    if (!Ps) return;
    const p = (l.step === "intro" || l.step === "connect" || l.step === "elsewhere") && !l.gift;
    p && !_s && (_s = !0, a("/radio/giveaway/players").then((f) => {
      (f == null ? void 0 : f.state) !== "open" || typeof f.free != "number" || typeof f.total != "number" || f.free <= 0 || (gs = f.free, ys = f.total, bi(c.snapshot()));
    }).catch(() => {
    })), Ps.hidden = !(p && gs > 0);
    const y = Ps.querySelector(".claim-n");
    y && gs > 0 && (y.textContent = `${gs.toLocaleString()} of ${ys.toLocaleString()} left`);
  }
  const Us = document.getElementById("youStatus");
  function Vr(l) {
    if (!Us || l.step === "loading") return;
    const p = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0, y = l.step === "ready" && l.payingOn && p > 0 && !l.giftStop, f = l.step === "intro" || l.step === "connect" || l.step === "elsewhere";
    Us.dataset.on = y ? "1" : "0", Us.querySelector("b").textContent = y ? "Connected to Xtrata Music" : f ? "No player connected" : "Your player is not connected", Us.querySelector("span").textContent = y ? "Every play goes to the artist, and your likes are saved." : f ? "Connect a player to play songs and pay the artists you listen to." : l.step === "locked" ? "Unlock it below to carry on listening." : "See below for what it needs.";
  }
  function Lr(l) {
    if (l.step === "loading") return;
    const p = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0, y = l.step === "ready" && l.payingOn && p > 0 && !l.giftStop, f = l.step === "fund" && l.depositPending, j = l.step === "elsewhere" && !t, ae = y || f || j ? "" : mi[l.step] ?? "", Se = y ? "on" : j ? "free" : ae ? "off" : "";
    Se ? document.documentElement.dataset.ppp = Se : delete document.documentElement.dataset.ppp, ps && (ps.hidden = !Se || Se === "free", ps.querySelector(".onair-sub").textContent = y ? `${p.toLocaleString()} plays left` : "Plays off"), ln && (ln.hidden = Se !== "off" && Se !== "free", ln.classList.toggle("is-free", Se === "free"), Se === "free" ? (ln.querySelector(".nudge-t").textContent = "You’re on the free player", ln.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", ln.querySelector("button").textContent = "Get a player") : Se === "off" && (ln.querySelector(".nudge-t").textContent = ae, ln.querySelector(".nudge-s").textContent = U(l) ? l.step === "intro" ? sC : "" : "This radio requires a funded listening wallet with music support on.", ln.querySelector("button").textContent = Lo[l.step] ?? "Start"));
  }
  let jt = "";
  function rr(l) {
    const p = $("div", "", "ppp-pick");
    l.funderMultiple && l.returnToKind === "funder" && p.append($("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), l.returnToKind === "funder" && p.append($("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const y = $("input");
    y.type = "text", y.placeholder = "SP… address to send returns to", y.autocomplete = "off", y.spellcheck = !1, y.setAttribute("aria-label", "Address to return funds to"), y.value = jt, y.oninput = () => {
      jt = y.value;
    };
    const f = pe(l.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(y.value), jt = "";
    }, "tiny");
    return p.append(y, " ", f), l.returnToKind === "chosen" && p.append(" ", pe("Back to the funder", () => c.clearReturnAddress(), "tiny")), p;
  }
  const xi = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Os() {
    const l = $("p", xi + " ", "ppp-mute");
    return l.append(ze("Xverse", "https://www.xverse.app/download"), " · ", ze("Leather", "https://leather.io/install-extension")), l;
  }
  let Co = "";
  const ga = (l) => {
    const p = document.documentElement, y = l.solo && !l.main ? l.listening ? ee(l.listening) : "new" : "", f = eI() ? "1" : "", j = l.standIn && !l.mainConnected ? ve(l.standIn) : "";
    `${y}|${f}|${j}` !== Co && (Co = `${y}|${f}|${j}`, y ? p.dataset.pppSolo = y : delete p.dataset.pppSolo, j ? p.dataset.pppAs = j : delete p.dataset.pppAs, f ? p.dataset.pppWalletInstalled = f : delete p.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const l of [1500, 4e3, 9e3]) setTimeout(() => g(c.snapshot()), l);
  function Hs(l, p = "") {
    const y = $("div", "", "ppp-topup"), f = Xr(l);
    y.append($("span", "Add plays from My player: ", "ppp-mute"));
    for (const j of el) {
      const ae = pe(`+${j.toLocaleString()}`, () => void c.topUpAlbum(j), p);
      ae.disabled = f === void 0 || f < j || l.depositPending || !!l.busy, y.append(ae);
    }
    return f !== void 0 && f < el[0] && y.append($("p", "My player needs plays first (switch to My player above).", "ppp-mute")), y;
  }
  const Xr = (l) => {
    var f;
    const p = (f = l.likeFunds) == null ? void 0 : f.balance;
    if (p === void 0 || !l.playCost) return;
    const y = p - on - 6000n;
    return y > 0n ? Number(y / l.playCost) : 0;
  };
  function Si(l) {
    const p = l.likeFunds;
    if (!p || !p.album || !p.low && !p.pending) return [];
    if (p.low || (O = !1), p.low && !O) return [];
    const y = $("div", "", "ppp-pick ppp-lowbox");
    if (!p.low) {
      if (!p.txid) return [];
      const j = $("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return p.txid && j.append(ze("View", ft(p.txid))), y.append(j), [y];
    }
    y.append($("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), y.append($("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), y.append($("p", p.address, "ppp-addr-full"));
    const f = $("div", "", "ppp-open-row");
    if (f.append(fr("copy-likes-address", "Copy address", () => p.address, "primary", () => g(c.snapshot()))), p.main && !l.solo) {
      const j = ks - (p.balance ?? 0n);
      j > 0n && f.append($o(l, `Pay ${Mr(j)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return y.append(f), y.append($("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [y];
  }
  const Dn = (l) => {
    const p = $("div", "", "ppp-wait");
    p.dataset.since = String(l.since), p.dataset.grace = String(l.graceMs), p.setAttribute("role", "progressbar"), p.setAttribute("aria-label", "Your plays are arriving");
    const y = $("p", "", "ppp-wait-t"), f = $("div", "", "ppp-wait-track");
    return f.append($("div", "", "ppp-wait-fill")), p.append(y, f), vi(p), p;
  };
  function vi(l) {
    const p = Number(l.dataset.since), y = Number(l.dataset.grace) || 6e4, f = Math.max(0, Date.now() - p), j = l.querySelector(".ppp-wait-fill"), ae = l.querySelector(".ppp-wait-t");
    if (f < y) {
      const Se = Math.ceil((y - f) / 1e3);
      j.style.width = Math.max(4, Math.min(95, f / y * 100)).toFixed(0) + "%", ae.textContent = `Loading your plays · ${Se}s`, l.classList.remove("is-long"), l.setAttribute("aria-valuenow", String(Math.round(f / y * 100)));
    } else
      j.style.width = "", ae.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", l.classList.add("is-long"), l.removeAttribute("aria-valuenow");
  }
  let To = 0;
  setInterval(() => {
    const l = document.querySelectorAll(".ppp-wait");
    if (!l.length) {
      To = 0;
      return;
    }
    l.forEach(vi), ++To % 10 === 0 && g(c.snapshot());
  }, 1e3);
  let ws = null;
  function Bo(l) {
    if (l.step === "loading" && ws !== null) return;
    const y = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(l.step) || !!l.busy || l.armed || !!v.pendingCode() && !["ready", "fund", "over"].includes(l.step);
    y !== ws && (ws = y, y ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function g(l) {
    var jh, Rh, zh, Gh, Kh, Vh, Xh, Yh, qh, Wh, Zh, Jh, Qh, ep, tp, np, rp, sp;
    if (ce.sync(), Ve && ["ready", "fund", "over"].includes(l.step) && !l.busy) {
      const Z = Ve;
      Ve = null, l.root === Z.root && l.slot !== Z.slot && c.openAlbum(Z.slot);
    }
    const p = v.inProgress(l), y = D(l), f = p && l.step === "fund" ? { ...l, depositPending: !0 } : y !== null ? { ...l, depositPending: !0, arrival: { since: y, graceMs: Cl } } : l, j = f.error === Tl;
    if (pn(), Ir(l), Xe(l), yn = Dt(l), E(l, f), Bo(f), ga(f), !p && v.inProgress(l)) return;
    if (hs(f), Lr(f), bi(f), Vr(f), t && n && (n.hidden = !["off", "elsewhere", "loading"].includes(f.step), n.textContent = f.step === "loading" || !f.gate ? B.on ? oC : "Checking your listening wallet…" : B.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), e.hidden = f.step === "off", e.hidden) {
      se(f, !1);
      return;
    }
    const [ae, Se] = wi(f), Ee = o(".ppp-state");
    Ee.textContent = ae, Ee.className = "ppp-state" + (Se ? " ppp-state--" + Se : ""), Ee.hidden = !ae;
    const Oe = !!f.busy || f.armed, Tt = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (Oe || !["intro", "loading"].includes(f.step));
    s.hidden = !Tt, s.classList.toggle("ppp-frame--rest", !Oe && !Ft);
    const ht = o(".ppp-frame-label");
    ht.hidden = !0;
    const ot = W5(f) ?? ut;
    ut = ot;
    const qe = "xtrata.radio.ppp.heard.v1", je = (() => {
      try {
        return localStorage.getItem(qe) === "1";
      } catch {
        return !1;
      }
    })();
    if (!je && f.entries.some((Z) => Z.kind === "play"))
      try {
        localStorage.setItem(qe, "1");
      } catch {
      }
    const Bt = je || f.slot > 0 && ((((jh = f.likeFunds) == null ? void 0 : jh.balance) ?? 0n) > 0n || x.count() > 1), qn = U(f), sr = !qn && J5({ ...f, heard: Bt }, ot);
    o(".ppp-badge").hidden = !sr;
    const Ds = o(".ppp-steps"), ms = o(".ppp-stage");
    Ds.hidden = ms.hidden = !sr, ot && sr && (Ds.replaceChildren(...lf(f.solo).map((Z, fe) => {
      const Re = $("li", "", fe < ot.at ? "done" : fe === ot.at ? ot.blocked ? "now blocked" : "now" : "");
      return Re.append($("span", fe < ot.at ? "✓" : String(fe + 1), "n"), Z), fe === ot.at && Re.setAttribute("aria-current", "step"), Re;
    })), ms.textContent = ot.caption, ms.className = "ppp-stage " + (ot.at >= lf(f.solo).length ? "ppp-ok" : ot.blocked ? "ppp-bad" : "ppp-cyan"));
    const Ai = o(".ppp-facts"), Fn = [];
    f.main && ((Rh = f.gate) != null && Rh.here) && !f.solo && Fn.push(...Mn("Your wallet", ve(f.main), "ppp-addr-short"));
    const Mh = () => {
      if (!f.listening) return;
      const Z = fr("copy-listening", "Copy", () => f.listening || "", "tiny", () => g(c.snapshot()));
      Fn.push(...Mn(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", ee(f.listening), "ppp-addr-short", Z));
    };
    if (f.linked || Mh(), f.listening && f.step !== "intro")
      if (f.linked)
        Fn.push(...Mn("Credited to", `${ve(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), Mh();
      else if (f.solo) {
        f.creditedTo && Fn.push(...Mn("Credited to", `${ve(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const Z = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${ve(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Fn.push(...Mn("Returns go to", f.gift ? Z : f.returnTo && !yt(f.returnTo) ? Z.replace(ee(f.returnTo), f.returnTo) : Z, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Fn.push(...Mn("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((zh = f.gate) != null && zh.here)) {
      const Z = f.linkedListening.map((fe) => ee(fe) + (fe === f.listening ? " (this one)" : "")).join(", ");
      Fn.push(...Mn(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", Z, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const Z = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Fn.push(...Mn("Balance", `${Mr(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, Z));
    }
    const ya = f.entries.find((Z) => Z.kind === "play");
    ya && Xn(), ya && Fn.push(...Mn("Last paid song", `${mn(ya)} → ${ve(ya.recipient)}`, Ns[ya.status] || "")), Ai.replaceChildren(...Fn), Ai.hidden = !Fn.length;
    const De = [], It = [], _t = [], or = [], Ph = On(BigInt(((Gh = f.gate) == null ? void 0 : Gh.limits.playFee) ?? "300")), _h = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${Mr(Il)} STX to the song holder, plus a ${Mr(Ph - Il)} STX network fee.`, Uh = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (De.push($("p", "Pay artists as you listen.")), (Kh = f.gate) != null && Kh.radioUrl) {
          const fe = $("p");
          fe.append(ze("Open the pay-per-play radio →", f.gate.radioUrl)), De.push(fe);
        }
        It.push($("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const fe = [f.linked, ...f.others];
          De.push($("p", fe.length > 1 ? `This device has listening wallets for ${Jt(fe)}.` : `This device has a listening wallet for ${ve(f.linked)}.`)), It.push($("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), fe.slice(0, 3).forEach((Re, wt) => _t.push(pe(`Open ${ve(Re)}`, () => Io(Re), wt === 0 ? "primary" : "")));
        } else
          De.push($("p", "Connect your wallet to pay artists as you listen.")), It.push($("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        De.push($("p", `This device's listening wallet belongs to ${ve(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), It.push($("p", `You are connected as ${ve(f.main)}. Switch to the linked wallet to continue listening.`)), It.push($("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), _t.push(pe("Switch wallet", Kr, "primary"));
        break;
      case "not-invited":
        De.push($("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        De.push($("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        De.push($("p", "Every play counts for the song’s owner, on-chain.")), It.push($("p", _h)), It.push($("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), It.push($("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (De.push($("p", `This device already has a listening wallet for ${Jt(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), It.push($("p", `Otherwise, set up a new listening wallet for ${ve(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && It.push($("p", `This is the listening wallet for ${ve(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && It.push($("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const Z = v.liveGift();
        _t.push(pe(Z ? "Claim my gift · no wallet needed" : f.solo ? "Start listening · no wallet needed" : f.others.length && f.main ? `Set up for ${ve(f.main)}` : "Start listening", () => void c.create(m.claiming() ? { another: !0 } : void 0), "primary")), !Z && !f.solo && f.main && f.others.length && _t.push(pe("Switch wallet", Kr)), !Z && f.solo && _t.push(pe("I have a Stacks wallet", Kr)), _t.push(pe("I already have a listening wallet", () => void c.unlock(!0))), Z && _t.push(pe("Not now", () => v.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (De.push($("p", "Locked.", "ppp-mute")), _t.push(pe("Unlock", () => void c.unlock(), "primary"))), f.standIn ? or.push(pe("Use a different listening wallet", () => void Ms().then((fe) => {
          fe === "stacks" && Kr();
        }), "quiet")) : or.push(pe("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        De.push($("p", `Link to ${ve(f.main)} · free`)), It.push($("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), It.push($("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), _t.push(pe(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        De.push($("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && De.push(Dn(f.arrival)) : J(f) ? De.push($("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (Vh = f.gift) != null && Vh.player ? De.push($("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? De.push($("p", "No plays left · add plays to keep counting", "ppp-bad")) : De.push($("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / Ph)).toLocaleString()} plays`)), f.entries.length && It.push($("p", "Playback is paused until your top-up confirms.")), f.payingOn && !f.entries.length && It.push($("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), p ? It.push($("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : f.depositPending ? It.push($("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : f.solo ? (It.push($("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), It.push($("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && _t.push(fr("copy-address", "Copy my address", () => f.listening || "", "primary", () => g(c.snapshot())))) : It.push($("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), f.depositPending && f.depositTxid) {
          const fe = $("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          fe.append(ze("View", ft(f.depositTxid))), De.push(fe);
        } else f.allowance > 0n && !f.solo && !f.depositPending && _t.push($o(f, `Deposit ${Mr(f.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        De.push($("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.phrase && (De.push($("p", "Or back up your player. With its 24 words written down it can hold more, because a lost passkey is no longer lost money.", "ppp-mute")), _t.push(pe("Back up my player · 24 words", () => void c.backup(), ""))), f.solo && !f.returnTo && (De.push($("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), De.push(rr(f))), (!f.solo || f.returnTo) && _t.push(pe("Return excess", () => void c.returnFunds("excess"), "primary"), pe("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0 && ((Xh = f.giftStop) == null ? void 0 : Xh.reason) !== "off") {
          const fe = Math.min(f.session.playsLeft, f.playsLeft);
          De.push($("p", `${fe.toLocaleString()} plays left`, "ppp-ok")), It.push($("p", _h + " The heart likes or unlikes from this wallet for 0.0003 STX.")), _t.push(pe("Switch off", () => void c.switchOff()));
        } else
          De.push($("p", "Switch on music support to listen.", "ppp-mute")), _t.push(pe("Switch plays on", () => void c.switchOn(), "primary"));
        f.queued && De.push($("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && De.push($("p", "Running low on plays", "ppp-warn")), f.aboveTarget && De.push($("p", "More than 1 STX here · backed up ✓ This player pays from this page as you listen, so keep larger amounts in your main wallet.", "ppp-mute")), f.depositPending ? De.push($("p", "Plays on their way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && _t.push($o(f, `Top up ${Mr(f.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (f.solo && f.listening && !f.depositPending) {
      const Z = f.step === "fund", fe = f.step === "ready" && (f.balanceState === "low" || !!f.gift && f.giftPlays <= 20);
      Z ? _t.unshift(pe("Add plays", () => Ne(), "primary")) : fe ? _t.push(pe("Add plays", () => Ne(), "primary")) : f.step === "ready" && or.push(pe("Add plays", () => Ne(), "quiet"));
    }
    if (f.solo && f.walletCannotSolo && It.push($("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && It.push(rr(f)), It.push(Os()), f.slot === 0 && f.step === "ready" && f.entries.some((Z) => Z.kind === "play" && Z.status === "confirmed"))) {
      const Z = $("p", "New to Stacks? ", "ppp-mute");
      Z.append(ze("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), De.push(Z);
    }
    if (f.walletOutdated && It.push($("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (De.push($("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), _t.push(pe("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && or.push(pe(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${ve(f.returnTo)}`, () => void c.returnFunds("all"), "quiet")), f.slot > 0 && ((Yh = f.gift) != null && Yh.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && or.push(Hs(f, "quiet")), f.phrase && ["ready", "fund", "over"].includes(f.step) && or.push(pe(f.backedUp ? "Show my 24 backup words again" : "Back up my player · 24 words", () => void c.backup(), "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && or.push(pe("Lock", () => void c.lock(), "quiet")), Tt && !Oe && or.push(pe(Ft ? "Hide listening wallet box" : "Show listening wallet box", () => {
      Ft = !Ft, g(c.snapshot());
    }, "quiet")), [..._t, ...or].forEach((Z) => Z.disabled = Uh), Uh && (_t.length = 0), !qn && f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((qh = f.gift) != null && qh.player)) {
      const Z = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", fe = De.at(0);
      f.step === "ready" && fe ? fe.append($("span", ` · ${Ae(f.balance)} STX`, Z)) : De.push($("p", `Balance ${Ae(f.balance)} STX`, Z));
    }
    if (qn) {
      for (const Re of [..._t, ...or]) {
        const wt = eC[Re.textContent ?? ""];
        wt && (Re.textContent = wt);
      }
      for (let Re = De.length - 1; Re >= 0; Re--) Jg(De[Re].textContent) && It.unshift(...De.splice(Re, 1));
      for (let Re = _t.length - 1; Re >= 0; Re--) Jg(_t[Re].textContent) && or.unshift(..._t.splice(Re, 1));
      const Z = f.entries.some((Re) => Re.kind === "play"), fe = rC(f.step, { played: Z, arriving: f.depositPending });
      fe.length && De.length && fe.shift(), De.push(...fe.map((Re) => $("p", Re, "ppp-mute")));
    }
    if ((Wh = f.gift) != null && Wh.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const Z = $("p", "", "ppp-gift");
      Z.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && Z.append(" · ", f.gift.player.subtitle);
      const fe = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? $("span", " · plays on their way", "ppp-warn") : $("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      fe && Z.append(fe);
      const Re = (Zh = De.at(0)) == null ? void 0 : Zh.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && Re && /STX/.test(Re.textContent ?? "") && Re.remove(), De.unshift(Z), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          De.splice(1, 0, $("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), Hs(f, "primary"));
        else {
          const wt = $("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          wt.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), wt.append(ze("Xverse", "https://www.xverse.app/download"), " and ", ze("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), De.splice(1, 0, wt);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const Z = f.returnPlan, fe = $("div", "", "ppp-pick");
      fe.append($("p", Z.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Re = $("ul", "", "ppp-gift-list");
      Z.steps.forEach((wt, Cr) => {
        const ir = wt.kind === "gift" ? "the unused gift" : wt.kind === "deposit" ? "what was added to it" : "the rest", In = $("li");
        In.append($("span", `${Cr + 1}. ${Mr(BigInt(wt.send))} STX · ${ir}`, "t"), $("span", wt.to ? ` → ${ve(wt.to)}` : " → choose an address below", wt.to ? "ppp-mute" : "ppp-warn")), Re.append(In);
      }), fe.append(Re), Z.kept && fe.append($("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), Z.steps.some((wt) => !wt.to) && fe.append(rr(f)), fe.append(pe(Z.steps.length > 1 ? `Confirm part 1 of ${Z.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), De.push(fe);
    }
    const Fs = k(f), bs = A ? Fs : null, Ei = H(f, !!bs), Kb = Ei === "gift" || Ei === "arriving" || Ei === "new", uu = bs ? null : m.lines(l), du = uu && !m.claiming() ? uu : [...uu ?? [], ...v.banner(l, { bare: !!bs || Ei === "gift" || Ei === "arriving" })], ic = er && (v.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) ? Gr(er, v.pendingCode()) : [];
    bs || (De.unshift(...du), De.push(...Si(f)), De.unshift(...ic)), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && De.unshift($("p", `This is ${ve(f.creditedTo)}'s listening wallet. Plays and likes count for ${ve(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), o(".ppp-key").replaceChildren(...De);
    const fu = document.querySelector(".ppp-switch");
    if (fu) {
      const Z = x.latest(), fe = f.slot > 0, Re = ["fund", "ready", "over"].includes(f.step) && (fe || !!Z);
      if (fu.hidden = !Re, Re) {
        const wt = (In, lc, uc, mu) => {
          const $i = pe("", mu, "ppp-tab");
          return $i.setAttribute("aria-pressed", String(uc)), $i.append($("span", In, "tt"), $("span", lc === void 0 ? "…" : `${Ce(lc).toLocaleString()} plays`, "ts")), $i.disabled = !!f.busy, $i;
        }, Cr = fe ? ((Qh = (Jh = f.gift) == null ? void 0 : Jh.player) == null ? void 0 : Qh.title) ?? "Album" : Z.title, ir = pe("View all albums" + (x.count() > 1 ? ` (${x.count()})` : ""), () => {
          const In = document.querySelector(".ppp-shelf");
          In && (In.hidden = !1, In.open = !In.open, ir.setAttribute("aria-expanded", String(In.open)), In.open && requestAnimationFrame(() => In.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        ir.setAttribute("aria-expanded", String(!!((ep = document.querySelector(".ppp-shelf")) != null && ep.open))), fu.replaceChildren(
          wt("🎧 My player", fe ? (tp = f.likeFunds) == null ? void 0 : tp.balance : f.balance, !fe, () => {
            fe && c.openAlbum(0);
          }),
          wt("💿 " + Cr, fe ? f.balance : void 0, fe, () => {
            !fe && Z && c.openAlbum(Z.slot);
          }),
          ir
        );
      }
    }
    const ac = x.render(f), cc = document.querySelector(".ppp-shelf");
    if (cc) {
      cc.hidden = !ac;
      const Z = cc.querySelector("summary");
      Z && (Z.textContent = x.count() > 0 ? `♪ My albums (${x.count()})` : "♪ My albums");
      const fe = cc.querySelector(".ppp-shelf-body");
      ac && fe && !fe.contains(ac) && fe.replaceChildren(ac);
    }
    const wa = v.renderFold(l);
    if (o(".ppp-gifts").hidden = !wa, wa && !o(".ppp-gift-body").contains(wa) && o(".ppp-gift-body").replaceChildren(wa), wa && Xt) {
      Xt = !1;
      const Z = o(".ppp-gifts");
      Z.open = !0, requestAnimationFrame(() => Z.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const hu = document.querySelector("#ppp .ppp-featured");
    if (hu) {
      const Z = ne(), fe = ce.manage(), Re = (Z.length > 0 || !!fe) && f.slot === 0 && !((np = f.gift) != null && np.player) && f.step === "ready";
      hu.hidden = !Re, Re && hu.replaceChildren(...Z.length ? [$("p", "Albums in your player", "ppp-featured__h")] : [], ...Z.map((wt) => {
        const Cr = (un == null ? void 0 : un.id) === wt.id, ir = pe("", () => mr(Cr ? null : wt, !Cr), "ppp-featured__a" + (Cr ? " is-on" : "")), In = Hr(wt).length;
        return ir.append($("b", wt.title), $("span", Cr ? "Playing now · tap to go back to the radio" : `${wt.subtitle ? wt.subtitle + " · " : ""}${In} ${In === 1 ? "song" : "songs"}`)), ir.setAttribute("aria-pressed", String(Cr)), ir.disabled = !!f.busy, ir;
      }), ...fe ? [fe] : []);
    }
    const pu = document.querySelector("#ppp .ppp-release-in-slot");
    if (pu) {
      const Z = ["off", "elsewhere", "unsupported"].includes(f.step) ? [] : ce.banner();
      pu.hidden = !Z.length, pu.replaceChildren(...Z);
    }
    const ki = document.querySelector("#ppp .ppp-release");
    if (ki) {
      const Z = ["off", "elsewhere", "unsupported"].includes(f.step) ? null : ce.fold();
      if (ki.hidden = !Z, Z) {
        const fe = document.activeElement instanceof HTMLElement && ki.contains(document.activeElement) ? document.activeElement : null, Re = ((rp = ki.querySelector(".ppp-release-songs")) == null ? void 0 : rp.scrollTop) ?? 0;
        (sp = ki.querySelector(".ppp-release-body")) == null || sp.replaceChildren(...Z);
        const wt = ki.querySelector(".ppp-release-songs");
        wt && Re && (wt.scrollTop = Re), fe && fe.isConnected && document.activeElement !== fe && fe.focus({ preventScroll: !0 });
      }
    }
    Y(f);
    const gu = document.querySelector("#ppp .ppp-yours");
    if (gu) {
      const Z = f.solo && !!f.listening && f.slot === 0 && ["fund", "ready"].includes(f.step);
      gu.hidden = !Z;
      const fe = gu.querySelector(".ppp-yours-body");
      if (Z && fe && fe.getAttribute("data-for") !== f.listening) {
        fe.setAttribute("data-for", f.listening);
        const Re = (mu, ...$i) => {
          const op = $("details", "", "ppp-yours-item");
          return op.append($("summary", mu), ...$i), op;
        }, wt = $("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        wt.append($("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const Cr = $("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), ir = $("p");
        ir.append(ze("Find a name at BNS One →", "https://bns.one"));
        const In = $("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), lc = $("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), uc = $("p");
        uc.append(ze("See the giveaway →", "https://xtrata.xyz/giveaway")), fe.replaceChildren(
          Re("Give your player a name", wt, Cr, $("p", f.listening, "ppp-addr-full"), fr("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => g(c.snapshot())), ir),
          Re("Link it to a wallet you already have", In),
          Re("Bring a friend in", lc, uc)
        );
      }
    }
    o(".ppp-body").replaceChildren(...It), o(".ppp-actions").replaceChildren(..._t), o(".ppp-actions2").replaceChildren(...or);
    const yu = f.busy || f.message || "", Oh = o(".ppp-msg"), wu = yu && De.some((Z) => (Z.textContent ?? "").startsWith(yu.replace(/[.✓\s]+$/, ""))) ? "" : yu, Hh = !wu && !f.error ? f.notice : j && !wu ? f.error : "";
    Oh.textContent = wu || Hh, Oh.classList.toggle("is-warn", !!Hh), o(".ppp-err").textContent = j ? "" : f.error;
    const Vb = f.entries.filter((Z) => Z.kind === "play");
    o(".ppp-recent").hidden = !f.entries.length, o(".ppp-recent-list").replaceChildren(...Vb.slice(0, 5).map((Z) => {
      const fe = $("li"), Re = Z.status === "confirmed" ? "ok" : Z.status === "failed" ? "bad" : "warn";
      return fe.append($("span", "", "d " + Re), $("span", mn(Z), "t"), $("span", Fe(Z.created), "ppp-mute")), Z.txid && fe.append(ze("tx", ft(Z.txid))), fe;
    })), o(".ppp-wallets").hidden = !(Ai.childElementCount || or.length), o(".ppp-more").hidden = !It.length;
    const Dh = o(".ppp-history");
    Dh.hidden = !f.entries.length, f.entries.length && Xn(), Dh.replaceChildren($("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((Z) => {
      const fe = $("div", "", "ppp-row"), Re = Z.kind === "play" ? [$("span", mn(Z), "ppp-song"), $("span", ` · ${Mr(BigInt(Z.amount))} STX to ${ve(Z.recipient)}`, "ppp-mute")] : Z.kind === "like" ? [$("span", `${Z.liked ? "♥ Liked" : "Unliked"} ${mn(Z)}`, "ppp-song"), $("span", ` · for ${f.linked ? ve(f.linked) : "this listening wallet"}`, "ppp-mute")] : [$("span", `Returned ${Mr(BigInt(Z.amount))} STX`, "ppp-song"), $("span", ` to ${ve(Z.recipient)}`, "ppp-mute")];
      return fe.append(
        $("span", ko[Z.status] || Z.status, "ppp-status " + (Ns[Z.status] || "")),
        ...Re,
        $("span", ` · ${new Date(Z.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), Z.txid && fe.append(ze("tx ↗", ft(Z.txid))), fe;
    })), X == null || X.render(bs ? xe(f, bs, [...ic, ...du]) : null), se(f, !!bs, Kb ? [...ic, ...du] : ic, Ei), Te(f, !!bs || !!(Pt != null && Pt.showing())), ke(f, bs), dt.isOpen() && dt.refresh(), me();
    const Fh = (Fs == null ? void 0 : Fs.mode) === "open" ? null : Rr(f);
    St == null || St.render((Fs == null ? void 0 : Fs.mode) === "open" ? xe(f, Fs, []) : Fh ? { ...xe(f, { mode: "open", player: Fh }, []), plays: f.balance === void 0 ? null : f.playsLeft } : null);
  }
  function k(l) {
    var f;
    if (["off", "elsewhere", "not-invited"].includes(l.step)) return null;
    if (l.slot > 0 && ((f = l.gift) != null && f.player) && ["fund", "ready", "over", "link", "loading"].includes(l.step))
      return l.root && Ye({ root: l.root, slot: l.slot, player: l.gift.player }), { mode: "open", player: l.gift.player };
    const p = v.incomingAlbum();
    if (p) return { mode: "arrive", player: p.player, from: p.from, offered: p.plays };
    const y = Ie();
    return y && (l.step === "locked" || Ve && l.step === "loading") ? { mode: "locked", player: y.player } : null;
  }
  const V = (l, p, y, f, j) => `/awards/${l.id}#${new URLSearchParams({ n: String(p), a: y, ...j ? { b: j } : {}, p: String(f), s: ey(bg, p, y) })}`;
  function te(l) {
    const p = l.award;
    return !p || !["ready", "fund", "over", "link"].includes(l.step) ? null : p.claimTx ? N ? "making" : null : p.state === "claimed" ? N && p.inscription !== void 0 ? "yours" : null : p.state !== "ready" || P || l.step === "link" && I !== "have" ? null : I === "making" || I === "yours" ? "ready" : I;
  }
  function Te(l, p) {
    if (!q) return;
    const y = l.award, f = y != null && y.cls && jc(y.cls) ? jo(y.cls) : null, j = l.slot === 0 ? l.listening : l.root, ae = p || !y || !f || !j || y.number === void 0 ? null : te(l);
    if (!ae || !y || !f || !j) {
      q.render(null, p);
      return;
    }
    ae === "have" && l.linked && !W && (W = !0, c.awardRefresh());
    const Se = typeof y.name == "string" && y.name ? y.name : null, Ee = [];
    l.error && Ee.push($("p", l.error, "ppp-warn"));
    const Oe = (Tt) => {
      I = Tt, Tt === "name" && (N = !0), g(c.snapshot());
    };
    q.render({
      screen: ae,
      tier: f,
      number: y.number,
      need: y.need ?? 0,
      player: j,
      name: y.name,
      inscription: y.inscription,
      art: ae === "yours" && y.inscription !== void 0 ? `/i/${y.inscription}` : V(f, y.number, j, y.need ?? 0, Se),
      claimLink: y.claimTx ? ft(y.claimTx) : void 0,
      status: Ee,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      main: l.main ? ve(l.main) : null,
      canLink: l.step === "link",
      linked: !!l.linked,
      copyAddress: () => fr("award-player-address", "Copy my player’s address", () => j, "tiny", () => g(c.snapshot())),
      go: Oe,
      claim: (Tt) => {
        N = !0, c.claimAward(Tt);
      },
      refresh: () => void c.awardRefresh(),
      connect: () => {
        var Tt;
        return (Tt = document.getElementById("radio-wallet-connect")) == null ? void 0 : Tt.click();
      },
      link: () => void c.link(),
      later: () => {
        P = !0;
        try {
          localStorage.setItem(b, String(Date.now()));
        } catch {
        }
        g(c.snapshot());
      },
      done: () => {
        N = !1, I = "ready", g(c.snapshot());
      }
    }, p);
  }
  function Y(l) {
    var ot;
    const p = document.querySelector("#ppp .ppp-award");
    if (!p) return;
    const y = l.award, f = l.slot === 0 ? l.listening : l.root, j = y != null && y.cls && jc(y.cls) ? jo(y.cls) : null, ae = !!y && !!j && !!f && ["ready", "fund", "over"].includes(l.step) && !(y.state === "unavailable" && y.number === void 0);
    if (p.hidden = !ae, !ae || !y || !j || !f) {
      p.replaceChildren();
      return;
    }
    const Se = JSON.stringify([y, f, !!l.busy]);
    if (p.getAttribute("data-sig") === Se) return;
    p.setAttribute("data-sig", Se);
    const Ee = (qe) => {
      const je = $("p", "", "ppp-award__h");
      return je.append($("b", `${j.mark} Music Hero award`), $("span", qe)), je;
    }, Oe = `No. ${String(y.number ?? 0).padStart(4, "0")}`, Tt = (qe) => {
      const je = $("div", "", "ppp-award__art"), Bt = document.createElement("iframe");
      return Bt.src = qe, Bt.title = `${j.name} record`, Bt.setAttribute("sandbox", "allow-scripts"), Bt.setAttribute("loading", "lazy"), je.append(Bt), je;
    }, ht = [];
    if (y.state === "claimed") {
      if (ht.push(Ee(`${j.name} record · ${Oe}`)), y.inscription !== void 0 && ht.push(Tt(`/i/${y.inscription}`)), ht.push($("p", y.holds === !1 ? "You sent this record to another wallet, so your player has gone back to plain. Whoever holds it keeps a record that still names you." : y.holds === null || y.holds === void 0 ? `Yours: Xtrata inscription #${y.inscription}.` : `Yours for good: Xtrata inscription #${y.inscription}. It gives your player its ${j.name} colours.`, y.holds === !1 ? "ppp-mute" : "ppp-ok")), y.inscription !== void 0) {
        const qe = $("p");
        qe.append(ze("Open it full screen ↗", `/i/${y.inscription}`)), ht.push(qe);
      }
      if (y.sendTx) {
        const qe = $("p", "Your record is on its way to its new address. About a minute. ", "ppp-cyan");
        qe.append(ze("View", ft(y.sendTx))), ht.push(qe);
      } else if (y.holds === !0 && y.inscription !== void 0) {
        const qe = $("details", "", "ppp-award__send"), je = document.createElement("input");
        je.type = "text", je.placeholder = "SP… address to send it to", je.autocomplete = "off", je.spellcheck = !1, je.setAttribute("aria-label", "Address to send your record to");
        const Bt = pe("Send my record…", () => void c.sendAward(je.value), "");
        Bt.disabled = !!l.busy, qe.append(
          $("summary", "Send this record to someone"),
          $("p", "It is yours to give or sell. Whoever holds it keeps a record that still names you, and your player goes back to plain without it. This cannot be undone.", "ppp-mute"),
          je,
          Bt
        ), ht.push(qe);
      }
    } else if (y.claimTx) {
      ht.push(Ee(`${j.name} record · ${Oe}`));
      const qe = $("p", "Your record is being made: written to Xtrata with your plaque on it. About a minute. ", "ppp-cyan");
      qe.append(ze("View", ft(y.claimTx))), ht.push(qe);
    } else if (y.state === "ready") {
      ht.push(Ee(`${j.name} record · ${Oe}`));
      const qe = typeof y.name == "string" && y.name ? y.name : null, je = new URLSearchParams({ n: String(y.number), a: f, ...qe ? { b: qe } : {}, p: String(y.need), s: ey(bg, y.number, f) });
      ht.push(Tt(`/awards/${j.id}#${je}`)), ht.push($("p", `Your ${j.name} record is ready. You have paid artists for ${(ot = y.need) == null ? void 0 : ot.toLocaleString()} plays: that makes you an Xtrata Music Hero.`));
      const Bt = $("div", "", "ppp-award__row");
      qe ? (ht.push($("p", `Its plaque will carry ${qe} beside your player’s address. What is on it cannot be changed afterwards.`, "ppp-mute")), Bt.append(pe("Claim my record", () => {
        N = !0, c.claimAward("auto");
      }, "primary"), pe("Use my address only", () => {
        N = !0, c.claimAward("none");
      }, "quiet"))) : y.name === null ? (ht.push($("p", "Its plaque will carry your player’s address. Want a .btc name on it? Link a wallet that has one (see “Make it yours” below), then check again. What is on it cannot be changed afterwards.", "ppp-mute")), Bt.append(pe("Claim my record", () => {
        N = !0, c.claimAward("none");
      }, "primary"), pe("Check for a name again", () => void c.awardRefresh(), "quiet"))) : (ht.push($("p", "Could not check for a .btc name just now. Check again, or claim with your player’s address alone.", "ppp-warn")), Bt.append(pe("Check for a name again", () => void c.awardRefresh(), "primary"), pe("Claim with my address only", () => void c.claimAward("none"), "quiet"))), Bt.querySelectorAll("button").forEach((qn) => {
        qn.disabled = !!l.busy;
      }), ht.push(Bt, $("p", "Free to claim: your player pays only a tiny network fee.", "ppp-mute"));
    } else if (y.state === "earning" && y.have !== void 0 && y.need) {
      ht.push(Ee(`${y.have.toLocaleString()} of ${y.need.toLocaleString()} paid plays`));
      const qe = $("div", "", "ppp-award__bar"), je = document.createElement("i");
      je.style.width = `${Math.min(100, Math.round(y.have / y.need * 100))}%`, qe.append(je);
      const Bt = y.need - y.have;
      ht.push(qe, $("p", `${Bt.toLocaleString()} more ${Bt === 1 ? "play" : "plays"} and your ${j.name} record is yours to claim.`, "ppp-mute"));
    } else
      ht.push(Ee(`${j.name} record · ${Oe}`)), ht.push($("p", y.state === "paused" ? "Claiming is paused for a moment. Your record is safe: try again later." : y.state === "class-full" || y.state === "not-open" ? "Claiming is not open for this record right now." : "Can’t check your award right now. Your plays still count: this updates by itself.", "ppp-mute"));
    p.replaceChildren(...ht);
  }
  function ke(l, p) {
    var Ee;
    const y = document.querySelector(".ppp-skin");
    if (!y) return;
    if (!p && (q != null && q.showing()) && ((Ee = l.award) != null && Ee.cls) && jc(l.award.cls) && (l.busy || l.armed)) {
      const Oe = jo(l.award.cls), Tt = $("span", "", "ppp-skin__t");
      Tt.append($("b", `${Oe.name} record · No. ${String(l.award.number ?? 0).padStart(4, "0")}`), $("span", "Xtrata Music Hero")), y.hidden = !1, y.replaceChildren($("span", Oe.mark, "ppp-skin__art ppp-skin__art--none"), Tt);
      return;
    }
    const f = !!p && (!!l.busy || l.armed);
    if (y.hidden = !f, !f || !p) {
      y.replaceChildren();
      return;
    }
    const j = tl(p.player.cover), ae = j ? $("img", "", "ppp-skin__art") : $("span", "♪", "ppp-skin__art ppp-skin__art--none");
    j && (ae.src = j, ae.alt = "");
    const Se = $("span", "", "ppp-skin__t");
    Se.append($("b", p.player.title), $("span", p.mode === "arrive" && p.from ? `A gift from ${p.from}` : p.player.subtitle || "Your album")), y.replaceChildren(ae, Se);
  }
  function xe(l, p, y) {
    var Oe, Tt, ht, ot, qe;
    const f = !!l.busy || l.armed, j = [...y];
    l.depositPending && l.arrival && j.push(Dn(l.arrival)), l.error ? j.push($("p", l.error, l.error === Tl ? "ppp-warn" : "ppp-bad")) : l.message && !f ? j.push($("p", l.message, "ppp-cyan")) : l.notice && j.push($("p", l.notice, "ppp-warn")), p.mode === "open" && O && ((Oe = l.likeFunds) != null && Oe.album) && l.likeFunds.low && !l.likeFunds.pending && j.push($("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let ae = "Kept on this device with Face ID or your passkey. No app or account needed.", Se = null, Ee = null;
    if (p.mode === "locked")
      Se = { label: "Continue listening", run: () => {
        Ve = Ie(), c.unlock();
      } }, Ee = { label: "Use a different passkey", run: () => {
        Ve = null, c.unlock(!0);
      } };
    else if (p.mode === "arrive")
      if (l.step === "intro" && Kc(bt) && bt.album === p.player.id) {
        const je = window.XtrataRadio, Bt = Hr(p.player)[0], qn = bt.phase === "playing";
        Se = { label: qn && !!((ht = (Tt = je == null ? void 0 : je.getState) == null ? void 0 : Tt.call(je)) != null && ht.playing) ? "Pause" : qn ? "Carry on" : "Play the first song", run: () => {
          var Ds, ms;
          qn ? (Ds = je == null ? void 0 : je.playPause) == null || Ds.call(je) : Bt && ((ms = je == null ? void 0 : je.playToken) == null || ms.call(je, Bt.id));
        } }, Ee = { label: "Make my player and hear it all", run: () => void c.create() }, ae = "The first song is free. Nothing to set up yet.";
      } else if (l.step === "intro") {
        const je = bt.phase === "done" && bt.album === p.player.id;
        je && !j.length && j.push($("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), Se = { label: je ? "Keep listening" : "Open album", run: () => void c.create() }, Ee = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else l.step === "locked" ? (Se = { label: "Open album", run: () => void c.unlock() }, Ee = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : l.step === "unsupported" ? j.push($("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : j.length || j.push($("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: p.mode,
      player: p.player,
      from: p.from,
      offered: p.offered,
      // A newcomer opening a gifted album: where they are, as three lights. Not for someone who already has a player.
      step: p.mode === "arrive" && l.step === "intro" ? 1 : void 0,
      plays: p.mode === "open" ? l.balance === void 0 ? null : l.giftPlays : void 0,
      playsComing: l.depositPending,
      status: j,
      primary: Se,
      secondary: Ee,
      hint: Se ? ae : void 0,
      asking: f,
      busy: !!l.busy,
      myPlays: Xr(l),
      topUps: el,
      canMake: !!((qe = (ot = l.gate) == null ? void 0 : ot.gifts) != null && qe.admin)
    };
  }
  const $e = document.getElementById("findBox"), st = document.getElementById("findBody"), S = $e && st ? xC(st, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : Promise.reject(new Error("catalogue unavailable"))).then((l) => wC(l == null ? void 0 : l.tracks, (p, y) => ({ title: Tg(p, Eo(y.title) ? "" : y.title), artist: Lg(p, y.artist || "") }))),
    play: (l) => {
      var p, y;
      (y = (p = window.XtrataRadio) == null ? void 0 : p.playToken) == null || y.call(p, l);
    },
    current: () => {
      var p, y, f, j;
      const l = Number((j = (f = (y = (p = window.XtrataRadio) == null ? void 0 : p.getState) == null ? void 0 : y.call(p)) == null ? void 0 : f.nowPlaying) == null ? void 0 : j.tokenId);
      return Number.isSafeInteger(l) ? l : null;
    },
    locked: () => {
      var l;
      return !!((l = c.snapshot().albumLock) != null && l.locked);
    },
    explicit: (l) => {
      var p, y;
      return !!((y = (p = window.XtrataRadio) == null ? void 0 : p.isExplicit) != null && y.call(p, l));
    },
    liked: (l) => G().has(l)
  }) : null;
  $e == null || $e.addEventListener("toggle", () => {
    $e.open && (S == null || S.load());
  });
  let M = "";
  const G = () => {
    var p, y, f;
    const l = (f = (y = (p = window.XtrataRadio) == null ? void 0 : p.getState) == null ? void 0 : y.call(p)) == null ? void 0 : f.likes;
    return new Set(Array.isArray(l) ? l.map((j) => Number(j == null ? void 0 : j.tokenId)).filter(Number.isSafeInteger) : []);
  }, me = () => {
    var p, y, f, j, ae;
    if (!S || !($e != null && $e.open)) return;
    const l = `${!!((p = c.snapshot().albumLock) != null && p.locked)}|${((ae = (j = (f = (y = window.XtrataRadio) == null ? void 0 : y.getState) == null ? void 0 : f.call(y)) == null ? void 0 : j.nowPlaying) == null ? void 0 : ae.tokenId) ?? ""}|${[...G()].sort((Se, Ee) => Se - Ee).join(",")}`;
    l !== M && (M = l, S.refresh());
  }, Rt = /* @__PURE__ */ new Map();
  let kn = !1;
  const br = () => {
    const l = window.XtrataRadio;
    return l != null && l.subscribe ? (l.subscribe((p) => {
      const y = p == null ? void 0 : p.nowPlaying;
      if (y && Number.isSafeInteger(Number(y.tokenId)) && Rt.set(Number(y.tokenId), { title: y.title || void 0, artist: y.artist || void 0 }), me(), de) {
        const f = `${(y == null ? void 0 : y.tokenId) ?? ""}|${!!(p != null && p.playing)}`;
        f !== Me && (Me = f, g(c.snapshot()));
      }
      if (Kc(bt)) {
        const f = !!(p != null && p.playing);
        wn({ kind: "now", track: y && y.tokenId != null ? String(y.tokenId) : null, playing: f, at: Date.now() }), f !== kn && (kn = f, g(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!br()) {
    const l = setInterval(() => {
      br() && clearInterval(l);
    }, 500);
    setTimeout(() => clearInterval(l), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (l) => {
    const p = l.detail;
    if (Kc(bt) && wn({ kind: "listened", at: Date.now() }), p && Number.isSafeInteger(p.song) && typeof p.id == "string" && /^[0-9a-f]{32}$/.test(p.id)) {
      Xn();
      const y = Nn(p.song, Rt.get(p.song));
      c.onListened({ song: p.song, id: p.id, title: y.title || void 0, artist: y.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (t || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const BC = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", NC = () => {
  const e = !!window.chrome, t = window.navigator, n = t.vendor, r = typeof window.opr < "u", o = t.userAgent.includes("Edge"), s = /CriOS/.exec(t.userAgent), i = t.userAgent.includes("Mobile");
  return s ? !1 : e !== null && typeof e < "u" && n === "Google Inc." && r === !1 && o === !1 && i === !1;
}, MC = () => NC() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, PC = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, _C = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Gb = class {
  constructor(e) {
    F4(this, e), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(e) {
    this.persistSelection && iA(e), this.callback(Yl(e));
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
    var r, o, s, i, a, c, u, h, d, m;
    return n === "IOS" ? (o = (r = e.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(e)) !== null && o !== void 0 ? o : e.webUrl : t === "Chrome" ? (i = (s = e.chromeWebStoreUrl) !== null && s !== void 0 ? s : this.getMobileUrl(e)) !== null && i !== void 0 ? i : e.webUrl : t === "Firefox" ? (c = (a = e.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(e)) !== null && c !== void 0 ? c : e.webUrl : n === "Android" ? (h = (u = e.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(e)) !== null && h !== void 0 ? h : e.webUrl : (m = (d = this.getBrowserUrl(e)) !== null && d !== void 0 ? d : e.webUrl) !== null && m !== void 0 ? m : this.getMobileUrl(e);
  }
  render() {
    const e = MC(), t = PC(), n = this.defaultProviders.filter(
      (s) => this.installedProviders.findIndex((i) => i.id === s.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, o = n.length > 0;
    return We("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, We("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), We("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, We("div", { class: "flex flex-col space-y-[10px]" }, We("div", { class: "flex items-center" }, We("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), We("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, We("span", { class: "sr-only" }, "Close popup"), We("img", { src: BC }))), r ? We("p", null, "Select the wallet you want to connect to.") : We("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !t && !e && We("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && We("div", { class: "mt-6" }, We("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), We("ul", { class: "space-y-3" }, this.installedProviders.map((s) => We("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, We("div", { class: "aspect-square basis-9 overflow-hidden" }, We("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), We("div", { class: "flex-1" }, We("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && We("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), We("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(s.id) }, "Connect"))))), o && We("div", { class: "mt-6" }, r ? We("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : We("div", { class: "mb-5 flex justify-between" }, We("p", { class: "text-sm font-medium" }, "Recommended wallets"), We("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, We("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, We("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), We("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), We("p", null, "What is a wallet? ", We("span", { class: "align-text-bottom text-[9px]" }, "↗")))), We("ul", { class: "space-y-3" }, n.map((s) => We("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, We("div", { class: "aspect-square basis-9 overflow-hidden" }, We("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), We("div", { class: "flex-1" }, We("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && We("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), this.getInstallUrl(s, e, t) && We("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(s, e, t), rel: "noopener noreferrer", target: "_blank" }, s.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return S4(this);
  }
};
Gb.style = _C;
const UC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Gb
}, Symbol.toStringTag, { value: "Module" }));
