var gw = Object.defineProperty;
var yw = (t, e, n) => e in t ? gw(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var so = (t, e, n) => yw(t, typeof e != "symbol" ? e + "" : e, n);
var nn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function A0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function oc(t) {
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
      typeof nn < "u" && nn || {}, r = {
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
      function i(v) {
        return v && DataView.prototype.isPrototypeOf(v);
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
        ], o = ArrayBuffer.isView || function(v) {
          return v && s.indexOf(Object.prototype.toString.call(v)) > -1;
        };
      function a(v) {
        if (typeof v != "string" && (v = String(v)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(v) || v === "")
          throw new TypeError('Invalid character in header field name: "' + v + '"');
        return v.toLowerCase();
      }
      function c(v) {
        return typeof v != "string" && (v = String(v)), v;
      }
      function u(v) {
        var N = {
          next: function() {
            var b = v.shift();
            return { done: b === void 0, value: b };
          }
        };
        return r.iterable && (N[Symbol.iterator] = function() {
          return N;
        }), N;
      }
      function d(v) {
        this.map = {}, v instanceof d ? v.forEach(function(N, b) {
          this.append(b, N);
        }, this) : Array.isArray(v) ? v.forEach(function(N) {
          if (N.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + N.length);
          this.append(N[0], N[1]);
        }, this) : v && Object.getOwnPropertyNames(v).forEach(function(N) {
          this.append(N, v[N]);
        }, this);
      }
      d.prototype.append = function(v, N) {
        v = a(v), N = c(N);
        var b = this.map[v];
        this.map[v] = b ? b + ", " + N : N;
      }, d.prototype.delete = function(v) {
        delete this.map[a(v)];
      }, d.prototype.get = function(v) {
        return v = a(v), this.has(v) ? this.map[v] : null;
      }, d.prototype.has = function(v) {
        return this.map.hasOwnProperty(a(v));
      }, d.prototype.set = function(v, N) {
        this.map[a(v)] = c(N);
      }, d.prototype.forEach = function(v, N) {
        for (var b in this.map)
          this.map.hasOwnProperty(b) && v.call(N, this.map[b], b, this);
      }, d.prototype.keys = function() {
        var v = [];
        return this.forEach(function(N, b) {
          v.push(b);
        }), u(v);
      }, d.prototype.values = function() {
        var v = [];
        return this.forEach(function(N) {
          v.push(N);
        }), u(v);
      }, d.prototype.entries = function() {
        var v = [];
        return this.forEach(function(N, b) {
          v.push([b, N]);
        }), u(v);
      }, r.iterable && (d.prototype[Symbol.iterator] = d.prototype.entries);
      function l(v) {
        if (!v._noBody) {
          if (v.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          v.bodyUsed = !0;
        }
      }
      function y(v) {
        return new Promise(function(N, b) {
          v.onload = function() {
            N(v.result);
          }, v.onerror = function() {
            b(v.error);
          };
        });
      }
      function p(v) {
        var N = new FileReader(), b = y(N);
        return N.readAsArrayBuffer(v), b;
      }
      function m(v) {
        var N = new FileReader(), b = y(N), C = /charset=([A-Za-z0-9_-]+)/.exec(v.type), D = C ? C[1] : "utf-8";
        return N.readAsText(v, D), b;
      }
      function x(v) {
        for (var N = new Uint8Array(v), b = new Array(N.length), C = 0; C < N.length; C++)
          b[C] = String.fromCharCode(N[C]);
        return b.join("");
      }
      function T(v) {
        if (v.slice)
          return v.slice(0);
        var N = new Uint8Array(v.byteLength);
        return N.set(new Uint8Array(v)), N.buffer;
      }
      function K() {
        return this.bodyUsed = !1, this._initBody = function(v) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = v, v ? typeof v == "string" ? this._bodyText = v : r.blob && Blob.prototype.isPrototypeOf(v) ? this._bodyBlob = v : r.formData && FormData.prototype.isPrototypeOf(v) ? this._bodyFormData = v : r.searchParams && URLSearchParams.prototype.isPrototypeOf(v) ? this._bodyText = v.toString() : r.arrayBuffer && r.blob && i(v) ? (this._bodyArrayBuffer = T(v.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(v) || o(v)) ? this._bodyArrayBuffer = T(v) : this._bodyText = v = Object.prototype.toString.call(v) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof v == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(v) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var v = l(this);
          if (v)
            return v;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var v = l(this);
            return v || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var v = l(this);
          if (v)
            return v;
          if (this._bodyBlob)
            return m(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(x(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(M);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var V = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function E(v) {
        var N = v.toUpperCase();
        return V.indexOf(N) > -1 ? N : v;
      }
      function _(v, N) {
        if (!(this instanceof _))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        N = N || {};
        var b = N.body;
        if (v instanceof _) {
          if (v.bodyUsed)
            throw new TypeError("Already read");
          this.url = v.url, this.credentials = v.credentials, N.headers || (this.headers = new d(v.headers)), this.method = v.method, this.mode = v.mode, this.signal = v.signal, !b && v._bodyInit != null && (b = v._bodyInit, v.bodyUsed = !0);
        } else
          this.url = String(v);
        if (this.credentials = N.credentials || this.credentials || "same-origin", (N.headers || !this.headers) && (this.headers = new d(N.headers)), this.method = E(N.method || this.method || "GET"), this.mode = N.mode || this.mode || null, this.signal = N.signal || this.signal || function() {
          if ("AbortController" in n) {
            var L = new AbortController();
            return L.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && b)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(b), (this.method === "GET" || this.method === "HEAD") && (N.cache === "no-store" || N.cache === "no-cache")) {
          var C = /([?&])_=[^&]*/;
          if (C.test(this.url))
            this.url = this.url.replace(C, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var D = /\?/;
            this.url += (D.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      _.prototype.clone = function() {
        return new _(this, { body: this._bodyInit });
      };
      function M(v) {
        var N = new FormData();
        return v.trim().split("&").forEach(function(b) {
          if (b) {
            var C = b.split("="), D = C.shift().replace(/\+/g, " "), L = C.join("=").replace(/\+/g, " ");
            N.append(decodeURIComponent(D), decodeURIComponent(L));
          }
        }), N;
      }
      function J(v) {
        var N = new d(), b = v.replace(/\r?\n[\t ]+/g, " ");
        return b.split("\r").map(function(C) {
          return C.indexOf(`
`) === 0 ? C.substr(1, C.length) : C;
        }).forEach(function(C) {
          var D = C.split(":"), L = D.shift().trim();
          if (L) {
            var I = D.join(":").trim();
            try {
              N.append(L, I);
            } catch (F) {
              console.warn("Response " + F.message);
            }
          }
        }), N;
      }
      K.call(_.prototype);
      function et(v, N) {
        if (!(this instanceof et))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (N || (N = {}), this.type = "default", this.status = N.status === void 0 ? 200 : N.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = N.statusText === void 0 ? "" : "" + N.statusText, this.headers = new d(N.headers), this.url = N.url || "", this._initBody(v);
      }
      K.call(et.prototype), et.prototype.clone = function() {
        return new et(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, et.error = function() {
        var v = new et(null, { status: 200, statusText: "" });
        return v.ok = !1, v.status = 0, v.type = "error", v;
      };
      var q = [301, 302, 303, 307, 308];
      et.redirect = function(v, N) {
        if (q.indexOf(N) === -1)
          throw new RangeError("Invalid status code");
        return new et(null, { status: N, headers: { location: v } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(N, b) {
          this.message = N, this.name = b;
          var C = Error(N);
          this.stack = C.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function Y(v, N) {
        return new Promise(function(b, C) {
          var D = new _(v, N);
          if (D.signal && D.signal.aborted)
            return C(new e.DOMException("Aborted", "AbortError"));
          var L = new XMLHttpRequest();
          function I() {
            L.abort();
          }
          L.onload = function() {
            var A = {
              statusText: L.statusText,
              headers: J(L.getAllResponseHeaders() || "")
            };
            D.url.indexOf("file://") === 0 && (L.status < 200 || L.status > 599) ? A.status = 200 : A.status = L.status, A.url = "responseURL" in L ? L.responseURL : A.headers.get("X-Request-URL");
            var U = "response" in L ? L.response : L.responseText;
            setTimeout(function() {
              b(new et(U, A));
            }, 0);
          }, L.onerror = function() {
            setTimeout(function() {
              C(new TypeError("Network request failed"));
            }, 0);
          }, L.ontimeout = function() {
            setTimeout(function() {
              C(new TypeError("Network request timed out"));
            }, 0);
          }, L.onabort = function() {
            setTimeout(function() {
              C(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function F(A) {
            try {
              return A === "" && n.location.href ? n.location.href : A;
            } catch {
              return A;
            }
          }
          if (L.open(D.method, F(D.url), !0), D.credentials === "include" ? L.withCredentials = !0 : D.credentials === "omit" && (L.withCredentials = !1), "responseType" in L && (r.blob ? L.responseType = "blob" : r.arrayBuffer && (L.responseType = "arraybuffer")), N && typeof N.headers == "object" && !(N.headers instanceof d || n.Headers && N.headers instanceof n.Headers)) {
            var gt = [];
            Object.getOwnPropertyNames(N.headers).forEach(function(A) {
              gt.push(a(A)), L.setRequestHeader(A, c(N.headers[A]));
            }), D.headers.forEach(function(A, U) {
              gt.indexOf(U) === -1 && L.setRequestHeader(U, A);
            });
          } else
            D.headers.forEach(function(A, U) {
              L.setRequestHeader(U, A);
            });
          D.signal && (D.signal.addEventListener("abort", I), L.onreadystatechange = function() {
            L.readyState === 4 && D.signal.removeEventListener("abort", I);
          }), L.send(typeof D._bodyInit > "u" ? null : D._bodyInit);
        });
      }
      return Y.polyfill = !0, n.fetch || (n.fetch = Y, n.Headers = d, n.Request = _, n.Response = et), e.Headers = d, e.Request = _, e.Response = et, e.fetch = Y, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : nn);
})();
const ww = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function bw(t, e) {
  const n = {};
  return Object.assign(n, ww, e), await fetch(t, n);
}
function mw(t) {
  let e = bw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function xw(...t) {
  const { fetchLib: e, middlewares: n } = mw(t);
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
var Mi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Mi || (Mi = {}));
var Ps;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ps || (Ps = {}));
var zf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(zf || (zf = {}));
const Sw = "https://api.mainnet.hiro.so", Ew = "https://api.testnet.hiro.so", Aw = "http://localhost:3999", vw = ["mainnet", "testnet", "devnet", "mocknet"];
let Ni = class {
  constructor(e) {
    this.version = Ps.Mainnet, this.chainId = Mi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ps.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, i) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${i}?proof=0`, this.getMapEntryUrl = (n, r, i) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${i}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? xw();
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
Ni.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new yl();
    case "testnet":
      return new $w();
    case "devnet":
      return new kw();
    case "mocknet":
      return new v0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${vw.join(", ")}`);
  }
};
Ni.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Ni.fromName(t);
let yl = class extends Ni {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Sw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ps.Mainnet, this.chainId = Mi.Mainnet;
  }
}, $w = class extends Ni {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ew,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ps.Testnet, this.chainId = Mi.Testnet;
  }
}, v0 = class extends Ni {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Aw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ps.Testnet, this.chainId = Mi.Testnet;
  }
};
const kw = v0, $0 = "xtrata.wallet.bridge.v1", Iw = (t) => typeof t == "object" && t !== null && t.protocol === $0, Lw = (t) => Iw(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", Cw = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class io extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Rf = 12e4;
class Tw {
  constructor(e) {
    so(this, "pending", /* @__PURE__ */ new Map());
    so(this, "listenTarget");
    so(this, "closed", !1);
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
    so(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !Lw(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new io("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new io("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new io("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const i = Cw(), s = { protocol: $0, kind: "request", id: i, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(i), a(
          new io(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Rf}ms.`
          )
        );
      }, this.options.timeoutMs ?? Rf);
      this.pending.set(i, { resolve: o, reject: a, timer: c }), r.postMessage(s, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new io("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const Bw = ["SP", "SM"], Mw = ["ST", "SN"], Nw = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return Bw.includes(n) ? "mainnet" : Mw.includes(n) ? "testnet" : null;
}, Pw = () => {
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
}, _w = () => typeof window > "u" || !window.localStorage ? Pw() : window.localStorage, Oc = "xtrata.v15.1.wallet.session", Gf = "mainnet", Ba = { isConnected: !1 }, Uw = (t) => t.address ? Nw(t.address) ?? t.network : t.network, k0 = (t) => !t.isConnected || !t.address ? { ...Ba } : Uw(t) !== Gf ? { ...Ba } : {
  isConnected: !0,
  address: t.address,
  network: Gf,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Hw = (t) => {
  if (!t)
    return { ...Ba };
  try {
    const e = JSON.parse(t);
    return k0(e);
  } catch {
    return { ...Ba };
  }
}, Ow = (t) => {
  const e = k0(t);
  return JSON.stringify(e);
}, Dw = (t) => {
  const e = _w();
  return {
    load: () => Hw(e.getItem(Oc)),
    save: (n) => {
      e.setItem(Oc, Ow(n));
    },
    clear: () => {
      e.removeItem(Oc);
    }
  };
}, Fw = "https://browser.blockstack.org/auth", jw = {
  "@type": "Person",
  "@context": "http://schema.org"
}, I0 = ["store_write"], zw = "blockstack-session", Rw = {
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
class Yi extends Error {
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
class Gw extends Yi {
  constructor(e, n = "") {
    super({ code: Qs.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Kf extends Yi {
  constructor(e = "") {
    super({ code: Qs.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Go extends Yi {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Qs.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Vf extends Yi {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Qs.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class wl extends Yi {
  constructor(e) {
    super({ code: Qs.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class L0 extends Yi {
  constructor(e) {
    super({ code: Qs.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const qf = ["debug", "info", "warn", "error", "none"], bl = {};
for (let t = 0; t < qf.length; t++) {
  const e = qf[t];
  bl[e] = t;
}
class Ai {
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
    return bl[Rw.logLevel] <= bl[e];
  }
}
function Kw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Vw() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Dc(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((i) => parseInt(i, 10)), r = e.split(".").map((i) => parseInt(i, 10));
  for (let i = 0; i < e.length; i++)
    if (i >= t.length && r.push(0), n[i] < r[i])
      return !1;
  return !0;
}
function qw() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Ww() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Xw(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function vu(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let i;
  try {
    if (i = Ww(), i) {
      const s = i[t];
      if (s)
        return s;
    }
  } catch (s) {
    Ai.error(`Error getting object '${t}' from global scope '${i}': ${s}`);
  }
  if (e) {
    const s = Xw(i, t.toString(), n);
    throw Ai.error(s), new Error(s);
  }
  if (r)
    return {};
}
function ds(t, e) {
  return $u(Xe(t), e);
}
function Xe(t) {
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
  if (dn(t, Uint8Array))
    return BigInt(`0x${bt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Yw(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Wf(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function No(t, e = 8) {
  return (typeof t == "bigint" ? t : Xe(t)).toString(16).padStart(e * 2, "0");
}
function ac(t) {
  return parseInt(t, 16);
}
function $u(t, e = 16) {
  const n = No(t, e);
  return Rt(n);
}
function Zw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Qw(t, e) {
  return t & BigInt(1) << e;
}
function ml(t) {
  return Jw(BigInt(`0x${bt(t)}`), BigInt(t.byteLength * 8));
}
function Jw(t, e) {
  return Qw(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const tb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function bt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += tb[n];
  return e;
}
function Rt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Yw(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, i = t.slice(r, r + 2), s = Number.parseInt(i, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    e[n] = s;
  }
  return e;
}
function Js(t) {
  return new TextEncoder().encode(t);
}
function Po(t) {
  return new TextDecoder().decode(t);
}
function eb(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function nb(t) {
  return String.fromCharCode.apply(null, t);
}
function rb(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Xf(t) {
  if (t.some(rb))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function cr(...t) {
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
function ke(t) {
  return cr(...t.map((e) => typeof e == "number" ? Xf([e]) : e instanceof Array ? Xf(e) : e));
}
function dn(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const C0 = "https://api.mainnet.hiro.so", T0 = "https://api.testnet.hiro.so", B0 = "http://localhost:3999", sb = "https://hub.blockstack.org", ib = 33, Fc = 32;
function ob(t) {
  if (t.length < Fc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Fc * 2), r = t.slice(2 + Fc * 2);
  return {
    recoveryId: ac(e),
    r: n,
    s: r
  };
}
function ku(t) {
  const e = typeof t == "string" ? Rt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function ab(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function cb(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function lb(t, e) {
  return t[e];
}
function ub(t, e, n = 0) {
  return t[n] = e, t;
}
function fb(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function _s(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const db = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function hb(t, e) {
  const n = {};
  return Object.assign(n, db, e), await fetch(t, n);
}
function pb(t) {
  let e = hb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function gb(...t) {
  const { fetchLib: e, middlewares: n } = pb(t);
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
class M0 {
  constructor(e = I0.slice(), n = ((a) => (a = vu("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", i = "/manifest.json", s = void 0, o = Fw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = i, this.coreNode = s, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function xl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function yb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function N0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function wb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  xl(t.outputLen), xl(t.blockLen);
}
function bb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function mb(t, e) {
  N0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const vs = {
  number: xl,
  bool: yb,
  bytes: N0,
  hash: wb,
  exists: bb,
  output: mb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const jc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Xn = (t, e) => t << 32 - e | t >>> e, xb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!xb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Sb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Iu(t) {
  if (typeof t == "string" && (t = Sb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let P0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ti(t) {
  const e = (r) => t().update(Iu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let _0 = class extends P0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, vs.hash(e);
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
    return vs.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    vs.exists(this), vs.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const cc = (t, e, n) => new _0(t, e).update(n).digest();
cc.create = (t, e) => new _0(t, e);
function Eb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Lu = class extends P0 {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = jc(this.buffer);
  }
  update(e) {
    vs.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Iu(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = jc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    vs.exists(this), vs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    Eb(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = jc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
const Ab = (t, e, n) => t & e ^ ~t & n, vb = (t, e, n) => t & e ^ t & n ^ e & n, $b = new Uint32Array([
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
]), _r = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ur = new Uint32Array(64);
let U0 = class extends Lu {
  constructor() {
    super(64, 32, 8, !1), this.A = _r[0] | 0, this.B = _r[1] | 0, this.C = _r[2] | 0, this.D = _r[3] | 0, this.E = _r[4] | 0, this.F = _r[5] | 0, this.G = _r[6] | 0, this.H = _r[7] | 0;
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
      Ur[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Ur[l - 15], p = Ur[l - 2], m = Xn(y, 7) ^ Xn(y, 18) ^ y >>> 3, x = Xn(p, 17) ^ Xn(p, 19) ^ p >>> 10;
      Ur[l] = x + Ur[l - 7] + m + Ur[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Xn(a, 6) ^ Xn(a, 11) ^ Xn(a, 25), p = d + y + Ab(a, c, u) + $b[l] + Ur[l] | 0, x = (Xn(r, 2) ^ Xn(r, 13) ^ Xn(r, 22)) + vb(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Ur.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, kb = class extends U0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Pi = ti(() => new U0());
ti(() => new kb());
const Ib = {}, H0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ib
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const jt = BigInt(0), ue = BigInt(1), as = BigInt(2), go = BigInt(3), Yf = BigInt(8), Qt = Object.freeze({
  a: jt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: ue,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Zf = (t, e) => (t + e / as) / e, Ko = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = Qt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -ue * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), i = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), s = n, o = BigInt("0x100000000000000000000000000000000"), a = Zf(s * t, e), c = Zf(-r * t, e);
    let u = nt(t - a * n - c * i, e), d = nt(-a * r - c * s, e);
    const l = u > o, y = d > o;
    if (l && (u = e - u), y && (d = e - d), u > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: y, k2: d };
  }
}, Gn = 32, Us = 32, O0 = 32, Ma = Gn + 1, Na = 2 * Gn + 1;
function Qf(t) {
  const { a: e, b: n } = Qt, r = nt(t * t), i = nt(r * t);
  return nt(i + e * t + n);
}
const Vo = Qt.a === jt;
class Cu extends Error {
  constructor(e) {
    super(e);
  }
}
function Jf(t) {
  if (!(t instanceof Vt))
    throw new TypeError("JacobianPoint expected");
}
class Vt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Nt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Nt.ZERO) ? Vt.ZERO : new Vt(e.x, e.y, ue);
  }
  static toAffineBatch(e) {
    const n = Mb(e.map((r) => r.z));
    return e.map((r, i) => r.toAffine(n[i]));
  }
  static normalizeZ(e) {
    return Vt.toAffineBatch(e).map(Vt.fromAffine);
  }
  equals(e) {
    Jf(e);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = e, c = nt(i * i), u = nt(a * a), d = nt(n * u), l = nt(s * c), y = nt(nt(r * a) * u), p = nt(nt(o * i) * c);
    return d === l && y === p;
  }
  negate() {
    return new Vt(this.x, nt(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, i = nt(e * e), s = nt(n * n), o = nt(s * s), a = e + s, c = nt(as * (nt(a * a) - i - o)), u = nt(go * i), d = nt(u * u), l = nt(d - as * c), y = nt(u * (c - l) - Yf * o), p = nt(as * n * r);
    return new Vt(l, y, p);
  }
  add(e) {
    Jf(e);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = e;
    if (s === jt || o === jt)
      return this;
    if (n === jt || r === jt)
      return e;
    const c = nt(i * i), u = nt(a * a), d = nt(n * u), l = nt(s * c), y = nt(nt(r * a) * u), p = nt(nt(o * i) * c), m = nt(l - d), x = nt(p - y);
    if (m === jt)
      return x === jt ? this.double() : Vt.ZERO;
    const T = nt(m * m), K = nt(m * T), V = nt(d * T), E = nt(x * x - K - as * V), _ = nt(x * (V - E) - y * K), M = nt(i * a * m);
    return new Vt(E, _, M);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Vt.ZERO;
    if (typeof e == "bigint" && e === jt)
      return n;
    let r = nd(e);
    if (r === ue)
      return this;
    if (!Vo) {
      let l = n, y = this;
      for (; r > jt; )
        r & ue && (l = l.add(y)), y = y.double(), r >>= ue;
      return l;
    }
    let { k1neg: i, k1: s, k2neg: o, k2: a } = Ko.splitScalar(r), c = n, u = n, d = this;
    for (; s > jt || a > jt; )
      s & ue && (c = c.add(d)), a & ue && (u = u.add(d)), d = d.double(), s >>= ue, a >>= ue;
    return i && (c = c.negate()), o && (u = u.negate()), u = new Vt(nt(u.x * Ko.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = Vo ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(Vt.BASE) && (n = Nt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let i = n && Sl.get(n);
    i || (i = this.precomputeWindow(r), n && r !== 1 && (i = Vt.normalizeZ(i), Sl.set(n, i)));
    let s = Vt.ZERO, o = Vt.BASE;
    const a = 1 + (Vo ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let y = 0; y < a; y++) {
      const p = y * c;
      let m = Number(e & u);
      e >>= l, m > c && (m -= d, e += ue);
      const x = p, T = p + Math.abs(m) - 1, K = y % 2 !== 0, V = m < 0;
      m === 0 ? o = o.add(qo(K, i[x])) : s = s.add(qo(V, i[T]));
    }
    return { p: s, f: o };
  }
  multiply(e, n) {
    let r = nd(e), i, s;
    if (Vo) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = Ko.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: y, f: p } = this.wNAF(u, n);
      d = qo(o, d), y = qo(c, y), y = new Vt(nt(y.x * Ko.beta), y.y, y.z), i = d.add(y), s = l.add(p);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      i = o, s = a;
    }
    return Vt.normalizeZ([i, s])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: i } = this, s = this.equals(Vt.ZERO);
    e == null && (e = s ? Yf : Zi(i));
    const o = e, a = nt(o * o), c = nt(a * o), u = nt(n * a), d = nt(r * c), l = nt(i * o);
    if (s)
      return Nt.ZERO;
    if (l !== ue)
      throw new Error("invZ was invalid");
    return new Nt(u, d);
  }
}
Vt.BASE = new Vt(Qt.Gx, Qt.Gy, ue);
Vt.ZERO = new Vt(jt, ue, jt);
function qo(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Sl = /* @__PURE__ */ new WeakMap();
class Nt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Sl.delete(this);
  }
  hasEvenY() {
    return this.y % as === jt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = An(n ? e : e.subarray(1));
    if (!Ea(r))
      throw new Error("Point is not on curve");
    const i = Qf(r);
    let s = Bb(i);
    const o = (s & ue) === ue;
    n ? o && (s = nt(-s)) : (e[0] & 1) === 1 !== o && (s = nt(-s));
    const a = new Nt(r, s);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = An(e.subarray(1, Gn + 1)), r = An(e.subarray(Gn + 1, Gn * 2 + 1)), i = new Nt(n, r);
    return i.assertValidity(), i;
  }
  static fromHex(e) {
    const n = lr(e), r = n.length, i = n[0];
    if (r === Gn)
      return this.fromCompressedHex(n);
    if (r === Ma && (i === 2 || i === 3))
      return this.fromCompressedHex(n);
    if (r === Na && i === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Ma} compressed bytes or ${Na} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Nt.BASE.multiply(Hs(e));
  }
  static fromSignature(e, n, r) {
    const { r: i, s } = j0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Tu(lr(e)), { n: a } = Qt, c = r === 2 || r === 3 ? i + a : i, u = Zi(c, a), d = nt(-o * u, a), l = nt(s * u, a), y = r & 1 ? "03" : "02", p = Nt.fromHex(y + cs(c)), m = Nt.BASE.multiplyAndAddUnsafe(p, d, l);
    if (!m)
      throw new Error("Cannot recover signature: point at infinify");
    return m.assertValidity(), m;
  }
  toRawBytes(e = !1) {
    return ls(this.toHex(e));
  }
  toHex(e = !1) {
    const n = cs(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${cs(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Ea(n) || !Ea(r))
      throw new Error(e);
    const i = nt(r * r), s = Qf(n);
    if (nt(i - s) !== jt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Nt(this.x, nt(-this.y));
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
    const i = Vt.fromAffine(this), s = n === jt || n === ue || this !== Nt.BASE ? i.multiplyUnsafe(n) : i.multiply(n), o = Vt.fromAffine(e).multiplyUnsafe(r), a = s.add(o);
    return a.equals(Vt.ZERO) ? void 0 : a.toAffine();
  }
}
Nt.BASE = new Nt(Qt.Gx, Qt.Gy);
Nt.ZERO = new Nt(jt, jt);
function td(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function ed(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${_i(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: An(n), left: t.subarray(e + 2) };
}
function Lb(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${_i(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = ed(t.subarray(2)), { data: r, left: i } = ed(n);
  if (i.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${_i(i)}`);
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
    const i = n ? _i(e) : e;
    if (i.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new En(Pa(i.slice(0, 64)), Pa(i.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s: i } = Lb(n ? e : ls(e));
    return new En(r, i);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Hi(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Hi(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = Qt.n >> ue;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new En(this.r, nt(-this.s, Qt.n)) : this;
  }
  toDERRawBytes() {
    return ls(this.toDERHex());
  }
  toDERHex() {
    const e = td(oo(this.s)), n = td(oo(this.r)), r = e.length / 2, i = n.length / 2, s = oo(r), o = oo(i);
    return `30${oo(i + r + 4)}02${o}${n}02${s}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return ls(this.toCompactHex());
  }
  toCompactHex() {
    return cs(this.r) + cs(this.s);
  }
}
function is(...t) {
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
const Cb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function _i(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Cb[t[n]];
  return e;
}
const Tb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function cs(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(jt <= t && t < Tb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Ui(t) {
  const e = ls(cs(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function oo(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Pa(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function ls(t) {
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
function An(t) {
  return Pa(_i(t));
}
function lr(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : ls(t);
}
function nd(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Hi(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function nt(t, e = Qt.P) {
  const n = t % e;
  return n >= jt ? n : e + n;
}
function kn(t, e) {
  const { P: n } = Qt;
  let r = t;
  for (; e-- > jt; )
    r *= r, r %= n;
  return r;
}
function Bb(t) {
  const { P: e } = Qt, n = BigInt(6), r = BigInt(11), i = BigInt(22), s = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, d = kn(u, go) * u % e, l = kn(d, go) * u % e, y = kn(l, as) * c % e, p = kn(y, r) * y % e, m = kn(p, i) * p % e, x = kn(m, o) * m % e, T = kn(x, a) * x % e, K = kn(T, o) * m % e, V = kn(K, go) * u % e, E = kn(V, s) * p % e, _ = kn(E, n) * c % e, M = kn(_, as);
  if (M * M % e !== t)
    throw new Error("Cannot find square root");
  return M;
}
function Zi(t, e = Qt.P) {
  if (t === jt || e <= jt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = nt(t, e), r = e, i = jt, s = ue;
  for (; n !== jt; ) {
    const a = r / n, c = r % n, u = i - s * a;
    r = n, n = c, i = s, s = u;
  }
  if (r !== ue)
    throw new Error("invert: does not exist");
  return nt(i, e);
}
function Mb(t, e = Qt.P) {
  const n = new Array(t.length), r = t.reduce((s, o, a) => o === jt ? s : (n[a] = s, nt(s * o, e)), ue), i = Zi(r, e);
  return t.reduceRight((s, o, a) => o === jt ? s : (n[a] = nt(s * n[a], e), nt(s * o, e)), i), n;
}
function Nb(t) {
  const e = t.length * 8 - Us * 8, n = An(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Tu(t, e = !1) {
  const n = Nb(t);
  if (e)
    return n;
  const { n: r } = Qt;
  return n >= r ? n - r : n;
}
let Ci, yo;
class D0 {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Ee.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return yo(this.k, ...e);
  }
  checkSync() {
    if (typeof yo != "function")
      throw new Cu("hmacSha256Sync needs to be set");
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
function Hi(t) {
  return jt < t && t < Qt.n;
}
function Ea(t) {
  return jt < t && t < Qt.P;
}
function F0(t, e, n, r = !0) {
  const { n: i } = Qt, s = Tu(t, !0);
  if (!Hi(s))
    return;
  const o = Zi(s, i), a = Nt.BASE.multiply(s), c = nt(a.x, i);
  if (c === jt)
    return;
  const u = nt(o * nt(e + n * c, i), i);
  if (u === jt)
    return;
  let d = new En(c, u), l = (a.x === d.r ? 0 : 2) | Number(a.y & ue);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function Hs(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Us)
      throw new Error("Expected 32 bytes of private key");
    e = Pa(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Us)
      throw new Error("Expected 32 bytes of private key");
    e = An(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Hi(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Bu(t) {
  return t instanceof Nt ? (t.assertValidity(), t) : Nt.fromHex(t);
}
function j0(t) {
  if (t instanceof En)
    return t.assertValidity(), t;
  try {
    return En.fromDER(t);
  } catch {
    return En.fromCompact(t);
  }
}
function _o(t, e = !1) {
  return Nt.fromPrivateKey(t).toRawBytes(e);
}
function Pb(t, e, n, r = !1) {
  return Nt.fromSignature(t, e, n).toRawBytes(r);
}
function rd(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Ma || r === Na : n ? r === Ma * 2 || r === Na * 2 : t instanceof Nt;
}
function Mu(t, e, n = !1) {
  if (rd(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!rd(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Bu(e);
  return r.assertValidity(), r.multiply(Hs(t)).toRawBytes(n);
}
function z0(t) {
  const e = t.length > Gn ? t.slice(0, Gn) : t;
  return An(e);
}
function _b(t) {
  const e = z0(t), n = nt(e, Qt.n);
  return R0(n < jt ? e : n);
}
function R0(t) {
  return Ui(t);
}
function G0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = lr(t), i = Hs(e), s = [R0(i), _b(r)];
  if (n != null) {
    n === !0 && (n = Ee.randomBytes(Gn));
    const c = lr(n);
    if (c.length !== Gn)
      throw new Error(`sign: Expected ${Gn} bytes of extra data`);
    s.push(c);
  }
  const o = is(...s), a = z0(r);
  return { seed: o, m: a, d: i };
}
function K0(t, e) {
  const { sig: n, recovery: r } = t, { der: i, recovered: s } = Object.assign({ canonical: !0, der: !0 }, e), o = i ? n.toDERRawBytes() : n.toCompactRawBytes();
  return s ? [o, r] : o;
}
async function Ub(t, e, n = {}) {
  const { seed: r, m: i, d: s } = G0(t, e, n.extraEntropy), o = new D0(O0, Us);
  await o.reseed(r);
  let a;
  for (; !(a = F0(await o.generate(), i, s, n.canonical)); )
    await o.reseed();
  return K0(a, n);
}
function lc(t, e, n = {}) {
  const { seed: r, m: i, d: s } = G0(t, e, n.extraEntropy), o = new D0(O0, Us);
  o.reseedSync(r);
  let a;
  for (; !(a = F0(o.generateSync(), i, s, n.canonical)); )
    o.reseedSync();
  return K0(a, n);
}
const Hb = { strict: !0 };
function Ob(t, e, n, r = Hb) {
  let i;
  try {
    i = j0(t), e = lr(e);
  } catch {
    return !1;
  }
  const { r: s, s: o } = i;
  if (r.strict && i.hasHighS())
    return !1;
  const a = Tu(e);
  let c;
  try {
    c = Bu(n);
  } catch {
    return !1;
  }
  const { n: u } = Qt, d = Zi(o, u), l = nt(a * d, u), y = nt(s * d, u), p = Nt.BASE.multiplyAndAddUnsafe(c, l, y);
  return p ? nt(p.x, u) === s : !1;
}
function _a(t) {
  return nt(An(t), Qt.n);
}
class Oi {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = lr(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = An(n.subarray(0, 32)), i = An(n.subarray(32, 64));
    return new Oi(r, i);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Ea(e) || !Hi(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return cs(this.r) + cs(this.s);
  }
  toRawBytes() {
    return ls(this.toHex());
  }
}
function Db(t) {
  return Nt.fromPrivateKey(t).toRawX();
}
class V0 {
  constructor(e, n, r = Ee.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = lr(e);
    const { x: i, scalar: s } = this.getScalar(Hs(n));
    if (this.px = i, this.d = s, this.rand = lr(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Nt.fromPrivateKey(e), r = n.hasEvenY() ? e : Qt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Ui(e ^ An(n));
  }
  finalizeNonce(e) {
    const n = nt(An(e), Qt.n);
    if (n === jt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: i, scalar: s } = this.getScalar(n);
    return { R: r, rx: i, k: s };
  }
  finalizeSig(e, n, r, i) {
    return new Oi(e.x, nt(n + r * i, Qt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: i } = this, s = Ee.taggedHash, o = this.initNonce(n, await s(ss.aux, i)), { R: a, rx: c, k: u } = this.finalizeNonce(await s(ss.nonce, o, r, e)), d = _a(await s(ss.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return await X0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: i } = this, s = Ee.taggedHashSync, o = this.initNonce(n, s(ss.aux, i)), { R: a, rx: c, k: u } = this.finalizeNonce(s(ss.nonce, o, r, e)), d = _a(s(ss.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return Y0(l, e, r) || this.error(), l;
  }
}
async function Fb(t, e, n) {
  return new V0(t, e, n).calc();
}
function jb(t, e, n) {
  return new V0(t, e, n).calcSync();
}
function q0(t, e, n) {
  const r = t instanceof Oi, i = r ? t : Oi.fromHex(t);
  return r && i.assertValidity(), {
    ...i,
    m: lr(e),
    P: Bu(n)
  };
}
function W0(t, e, n, r) {
  const i = Nt.BASE.multiplyAndAddUnsafe(e, Hs(n), nt(-r, Qt.n));
  return !(!i || !i.hasEvenY() || i.x !== t);
}
async function X0(t, e, n) {
  try {
    const { r, s: i, m: s, P: o } = q0(t, e, n), a = _a(await Ee.taggedHash(ss.challenge, Ui(r), o.toRawX(), s));
    return W0(r, o, i, a);
  } catch {
    return !1;
  }
}
function Y0(t, e, n) {
  try {
    const { r, s: i, m: s, P: o } = q0(t, e, n), a = _a(Ee.taggedHashSync(ss.challenge, Ui(r), o.toRawX(), s));
    return W0(r, o, i, a);
  } catch (r) {
    if (r instanceof Cu)
      throw r;
    return !1;
  }
}
const zb = {
  Signature: Oi,
  getPublicKey: Db,
  sign: Fb,
  verify: X0,
  signSync: jb,
  verifySync: Y0
};
Nt.BASE._setWindowSize(8);
const yn = {
  node: H0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ss = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Wo = {}, Ee = {
  bytesToHex: _i,
  hexToBytes: ls,
  concatBytes: is,
  mod: nt,
  invert: Zi,
  isValidPrivateKey(t) {
    try {
      return Hs(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Ui,
  _normalizePrivateKey: Hs,
  hashToPrivateKey: (t) => {
    t = lr(t);
    const e = Us + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = nt(An(t), Qt.n - ue) + ue;
    return Ui(n);
  },
  randomBytes: (t = 32) => {
    if (yn.web)
      return yn.web.getRandomValues(new Uint8Array(t));
    if (yn.node) {
      const { randomBytes: e } = yn.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Ee.hashToPrivateKey(Ee.randomBytes(Us + 8)),
  precompute(t = 8, e = Nt.BASE) {
    const n = e === Nt.BASE ? e : new Nt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(go), n;
  },
  sha256: async (...t) => {
    if (yn.web) {
      const e = await yn.web.subtle.digest("SHA-256", is(...t));
      return new Uint8Array(e);
    } else if (yn.node) {
      const { createHash: e } = yn.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (yn.web) {
      const n = await yn.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = is(...e), i = await yn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(i);
    } else if (yn.node) {
      const { createHmac: n } = yn.node, r = n("sha256", t);
      return e.forEach((i) => r.update(i)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Wo[t];
    if (n === void 0) {
      const r = await Ee.sha256(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      n = is(r, r), Wo[t] = n;
    }
    return Ee.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Ci != "function")
      throw new Cu("sha256Sync is undefined, you need to set it");
    let n = Wo[t];
    if (n === void 0) {
      const r = Ci(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      n = is(r, r), Wo[t] = n;
    }
    return Ci(n, ...e);
  },
  _JacobianPoint: Vt
};
Object.defineProperties(Ee, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Ci;
    },
    set(t) {
      Ci || (Ci = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return yo;
    },
    set(t) {
      yo || (yo = t);
    }
  }
});
const Rb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Qt,
  Point: Nt,
  Signature: En,
  getPublicKey: _o,
  getSharedSecret: Mu,
  recoverPublicKey: Pb,
  schnorr: zb,
  sign: Ub,
  signSync: lc,
  utils: Ee,
  verify: Ob
}, Symbol.toStringTag, { value: "Module" }));
var Uo = {};
Uo.byteLength = Wb;
var Gb = Uo.toByteArray = Yb, Kb = Uo.fromByteArray = Jb, er = [], Cn = [], Vb = typeof Uint8Array < "u" ? Uint8Array : Array, zc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var wi = 0, qb = zc.length; wi < qb; ++wi)
  er[wi] = zc[wi], Cn[zc.charCodeAt(wi)] = wi;
Cn[45] = 62;
Cn[95] = 63;
function Z0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Wb(t) {
  var e = Z0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Xb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Yb(t) {
  var e, n = Z0(t), r = n[0], i = n[1], s = new Vb(Xb(t, r, i)), o = 0, a = i > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = Cn[t.charCodeAt(c)] << 18 | Cn[t.charCodeAt(c + 1)] << 12 | Cn[t.charCodeAt(c + 2)] << 6 | Cn[t.charCodeAt(c + 3)], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
  return i === 2 && (e = Cn[t.charCodeAt(c)] << 2 | Cn[t.charCodeAt(c + 1)] >> 4, s[o++] = e & 255), i === 1 && (e = Cn[t.charCodeAt(c)] << 10 | Cn[t.charCodeAt(c + 1)] << 4 | Cn[t.charCodeAt(c + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
}
function Zb(t) {
  return er[t >> 18 & 63] + er[t >> 12 & 63] + er[t >> 6 & 63] + er[t & 63];
}
function Qb(t, e, n) {
  for (var r, i = [], s = e; s < n; s += 3)
    r = (t[s] << 16 & 16711680) + (t[s + 1] << 8 & 65280) + (t[s + 2] & 255), i.push(Zb(r));
  return i.join("");
}
function Jb(t) {
  for (var e, n = t.length, r = n % 3, i = [], s = 16383, o = 0, a = n - r; o < a; o += s)
    i.push(Qb(t, o, o + s > a ? a : o + s));
  return r === 1 ? (e = t[n - 1], i.push(
    er[e >> 2] + er[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], i.push(
    er[e >> 10] + er[e >> 4 & 63] + er[e << 2 & 63] + "="
  )), i.join("");
}
function tm() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const em = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function nm() {
  if (tm())
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
    throw new Error(em);
  }
}
class rm {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, i) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createCipher(e, n, r), o = new Uint8Array(cr(s.update(i), s.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, i) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createDecipher(e, n, r), o = new Uint8Array(cr(s.update(i), s.final()));
    return Promise.resolve(o);
  }
}
class sm {
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
async function Q0() {
  const t = await nm();
  return t.name === "subtleCrypto" ? new sm(t.lib) : new rm(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function im(t) {
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
  var o = t.length, a = t.charAt(0), c = Math.log(o) / Math.log(256), u = Math.log(256) / Math.log(o);
  function d(p) {
    if (p instanceof Uint8Array || (ArrayBuffer.isView(p) ? p = new Uint8Array(p.buffer, p.byteOffset, p.byteLength) : Array.isArray(p) && (p = Uint8Array.from(p))), !(p instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (p.length === 0)
      return "";
    for (var m = 0, x = 0, T = 0, K = p.length; T !== K && p[T] === 0; )
      T++, m++;
    for (var V = (K - T) * u + 1 >>> 0, E = new Uint8Array(V); T !== K; ) {
      for (var _ = p[T], M = 0, J = V - 1; (_ !== 0 || M < x) && J !== -1; J--, M++)
        _ += 256 * E[J] >>> 0, E[J] = _ % o >>> 0, _ = _ / o >>> 0;
      if (_ !== 0)
        throw new Error("Non-zero carry");
      x = M, T++;
    }
    for (var et = V - x; et !== V && E[et] === 0; )
      et++;
    for (var q = a.repeat(m); et < V; ++et)
      q += t.charAt(E[et]);
    return q;
  }
  function l(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var m = 0, x = 0, T = 0; p[m] === a; )
      x++, m++;
    for (var K = (p.length - m) * c + 1 >>> 0, V = new Uint8Array(K); p[m]; ) {
      var E = p.charCodeAt(m);
      if (E > 255)
        return;
      var _ = e[E];
      if (_ === 255)
        return;
      for (var M = 0, J = K - 1; (_ !== 0 || M < T) && J !== -1; J--, M++)
        _ += o * V[J] >>> 0, V[J] = _ % 256 >>> 0, _ = _ / 256 >>> 0;
      if (_ !== 0)
        throw new Error("Non-zero carry");
      T = M, m++;
    }
    for (var et = K - T; et !== K && V[et] === 0; )
      et++;
    for (var q = new Uint8Array(x + (K - et)), Y = x; et !== K; )
      q[Y++] = V[et++];
    return q;
  }
  function y(p) {
    var m = l(p);
    if (m)
      return m;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: d,
    decodeUnsafe: l,
    decode: y
  };
}
var J0 = im;
const om = J0, am = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var cm = om(am);
const lm = /* @__PURE__ */ A0(cm), um = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), tp = Uint8Array.from({ length: 16 }, (t, e) => e), fm = tp.map((t) => (9 * t + 5) % 16);
let Nu = [tp], Pu = [fm];
for (let t = 0; t < 4; t++)
  for (let e of [Nu, Pu])
    e.push(e[t].map((n) => um[n]));
const ep = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), dm = Nu.map((t, e) => t.map((n) => ep[e][n])), hm = Pu.map((t, e) => t.map((n) => ep[e][n])), pm = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), gm = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Xo = (t, e) => t << e | t >>> 32 - e;
function sd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Yo = new Uint32Array(16);
let ym = class extends Lu {
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
      Yo[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const m = 4 - p, x = pm[p], T = gm[p], K = Nu[p], V = Pu[p], E = dm[p], _ = hm[p];
      for (let M = 0; M < 16; M++) {
        const J = Xo(r + sd(p, s, a, u) + Yo[K[M]] + x, E[M]) + l | 0;
        r = l, l = u, u = Xo(a, 10) | 0, a = s, s = J;
      }
      for (let M = 0; M < 16; M++) {
        const J = Xo(i + sd(m, o, c, d) + Yo[V[M]] + T, _[M]) + y | 0;
        i = y, y = d, d = Xo(c, 10) | 0, c = o, o = J;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Yo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const wm = ti(() => new ym());
function bm(t) {
  return wm(t);
}
const Zo = BigInt(2 ** 32 - 1), El = BigInt(32);
function np(t, e = !1) {
  return e ? { h: Number(t & Zo), l: Number(t >> El & Zo) } : { h: Number(t >> El & Zo) | 0, l: Number(t & Zo) | 0 };
}
function mm(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = np(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const xm = (t, e) => BigInt(t >>> 0) << El | BigInt(e >>> 0), Sm = (t, e, n) => t >>> n, Em = (t, e, n) => t << 32 - n | e >>> n, Am = (t, e, n) => t >>> n | e << 32 - n, vm = (t, e, n) => t << 32 - n | e >>> n, $m = (t, e, n) => t << 64 - n | e >>> n - 32, km = (t, e, n) => t >>> n - 32 | e << 64 - n, Im = (t, e) => e, Lm = (t, e) => t, Cm = (t, e, n) => t << n | e >>> 32 - n, Tm = (t, e, n) => e << n | t >>> 32 - n, Bm = (t, e, n) => e << n - 32 | t >>> 64 - n, Mm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Nm(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const Pm = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), _m = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Um = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Hm = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, Om = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), Dm = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, kt = {
  fromBig: np,
  split: mm,
  toBig: xm,
  shrSH: Sm,
  shrSL: Em,
  rotrSH: Am,
  rotrSL: vm,
  rotrBH: $m,
  rotrBL: km,
  rotr32H: Im,
  rotr32L: Lm,
  rotlSH: Cm,
  rotlSL: Tm,
  rotlBH: Bm,
  rotlBL: Mm,
  add: Nm,
  add3L: Pm,
  add3H: _m,
  add4L: Um,
  add4H: Hm,
  add5H: Dm,
  add5L: Om
}, [Fm, jm] = kt.split([
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
].map((t) => BigInt(t))), Hr = new Uint32Array(80), Or = new Uint32Array(80);
let uc = class extends Lu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: m, Hh: x, Hl: T } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, y, p, m, x, T];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, y, p, m, x, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = m | 0, this.Hh = x | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Hr[E] = e.getUint32(n), Or[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const _ = Hr[E - 15] | 0, M = Or[E - 15] | 0, J = kt.rotrSH(_, M, 1) ^ kt.rotrSH(_, M, 8) ^ kt.shrSH(_, M, 7), et = kt.rotrSL(_, M, 1) ^ kt.rotrSL(_, M, 8) ^ kt.shrSL(_, M, 7), q = Hr[E - 2] | 0, Y = Or[E - 2] | 0, v = kt.rotrSH(q, Y, 19) ^ kt.rotrBH(q, Y, 61) ^ kt.shrSH(q, Y, 6), N = kt.rotrSL(q, Y, 19) ^ kt.rotrBL(q, Y, 61) ^ kt.shrSL(q, Y, 6), b = kt.add4L(et, N, Or[E - 7], Or[E - 16]), C = kt.add4H(b, J, v, Hr[E - 7], Hr[E - 16]);
      Hr[E] = C | 0, Or[E] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: m, Gh: x, Gl: T, Hh: K, Hl: V } = this;
    for (let E = 0; E < 80; E++) {
      const _ = kt.rotrSH(l, y, 14) ^ kt.rotrSH(l, y, 18) ^ kt.rotrBH(l, y, 41), M = kt.rotrSL(l, y, 14) ^ kt.rotrSL(l, y, 18) ^ kt.rotrBL(l, y, 41), J = l & p ^ ~l & x, et = y & m ^ ~y & T, q = kt.add5L(V, M, et, jm[E], Or[E]), Y = kt.add5H(q, K, _, J, Fm[E], Hr[E]), v = q | 0, N = kt.rotrSH(r, i, 28) ^ kt.rotrBH(r, i, 34) ^ kt.rotrBH(r, i, 39), b = kt.rotrSL(r, i, 28) ^ kt.rotrBL(r, i, 34) ^ kt.rotrBL(r, i, 39), C = r & s ^ r & a ^ s & a, D = i & o ^ i & c ^ o & c;
      K = x | 0, V = T | 0, x = p | 0, T = m | 0, p = l | 0, m = y | 0, { h: l, l: y } = kt.add(u | 0, d | 0, Y | 0, v | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const L = kt.add3L(v, b, D);
      r = kt.add3H(L, Y, N, C), i = L | 0;
    }
    ({ h: r, l: i } = kt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = kt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = kt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = kt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = kt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: m } = kt.add(this.Fh | 0, this.Fl | 0, p | 0, m | 0), { h: x, l: T } = kt.add(this.Gh | 0, this.Gl | 0, x | 0, T | 0), { h: K, l: V } = kt.add(this.Hh | 0, this.Hl | 0, K | 0, V | 0), this.set(r, i, s, o, a, c, u, d, l, y, p, m, x, T, K, V);
  }
  roundClean() {
    Hr.fill(0), Or.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, zm = class extends uc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Rm = class extends uc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Gm = class extends uc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Km = ti(() => new uc());
ti(() => new zm());
ti(() => new Rm());
ti(() => new Gm());
function rp(t) {
  return Pi(t);
}
function Vm(t) {
  return Km(t);
}
const qm = 0;
Ee.hmacSha256Sync = (t, ...e) => {
  const n = cc.create(Pi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Wm() {
  return bt(Ee.randomPrivateKey());
}
function Xm(t) {
  const e = Pi(Pi(t));
  return lm.encode(cr(t, e).slice(0, t.length + 4));
}
function Ym(t, e) {
  return Xm(cr(new Uint8Array([t]), e.slice(0, 20)));
}
function sp(t, e = qm) {
  const n = typeof t == "string" ? Rt(t) : t, r = bm(rp(n));
  return Ym(e, r);
}
function ip(t) {
  const e = ku(t);
  return bt(_o(e.slice(0, 32), !0));
}
Ee.hmacSha256Sync = (t, ...e) => {
  const n = cc.create(Pi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Ua;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Ua || (Ua = {}));
async function Zm(t, e, n) {
  return await (await Q0()).encrypt("aes-256-cbc", e, t, n);
}
async function Qm(t, e, n) {
  return await (await Q0()).decrypt("aes-256-cbc", e, t, n);
}
function op(t, e) {
  return cc(Pi, t, e);
}
function Jm(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function ap(t) {
  const e = Vm(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function t1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function e1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Ua.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Ua.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !t1(t))
    return e;
  try {
    return Nt.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function n1(t, e, n, r) {
  const i = e1(t);
  if (!i.result)
    throw i;
  const s = Ee.randomPrivateKey(), o = _o(s, !0);
  let a = Mu(s, t, !0);
  a = a.slice(1);
  const c = ap(a), u = Ee.randomBytes(16), d = await Zm(u, c.encryptionKey, e), l = cr(u, o, d), y = op(c.hmacKey, l);
  let p;
  if (!r || r === "hex")
    p = bt(d);
  else if (r === "base64")
    p = Kb(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const m = {
    iv: bt(u),
    ephemeralPK: bt(o),
    cipherText: p,
    mac: bt(y),
    wasString: n
  };
  return r && r !== "hex" && (m.cipherTextEncoding = r), m;
}
async function cp(t, e) {
  if (!e.ephemeralPK)
    throw new Vf("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Mu(t, n, !0);
  r = r.slice(1);
  const i = ap(r), s = Rt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Rt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Gb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = cr(s, Rt(n), o), c = op(i.hmacKey, a), u = Rt(e.mac);
  if (!Jm(u, c))
    throw new Vf("Decryption failed: failure in MAC check");
  const d = await Qm(s, i.encryptionKey, o);
  return e.wasString ? Po(d) : d;
}
function r1(t, e) {
  const n = typeof e == "string" ? Js(e) : e, r = ip(t), i = rp(n), s = lc(i, t);
  return {
    signature: bt(s),
    publicKey: r
  };
}
async function s1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = ip(n.privateKey);
  }
  const i = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", s = typeof t == "string" ? Js(t) : t, o = await n1(n.publicKey, s, i, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = r1(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function i1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return cp(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Ge = {}, Di = {}, tn = {};
Object.defineProperty(tn, "__esModule", { value: !0 });
tn.decode = tn.encode = tn.unescape = tn.escape = tn.pad = void 0;
const lp = Uo;
function _u(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
tn.pad = _u;
function up(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
tn.escape = up;
function fp(t) {
  return _u(t).replace(/-/g, "+").replace(/_/g, "/");
}
tn.unescape = fp;
function o1(t) {
  return up((0, lp.fromByteArray)(new TextEncoder().encode(t)));
}
tn.encode = o1;
function a1(t) {
  return new TextDecoder().decode((0, lp.toByteArray)(_u(fp(t))));
}
tn.decode = a1;
var fc = {}, dc = {}, dp = {}, hp = {}, hc = {};
Object.defineProperty(hc, "__esModule", { value: !0 });
hc.crypto = void 0;
hc.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = i, t.ahash = s, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = d, t.createView = l, t.rotr = y, t.rotl = p, t.byteSwap = m, t.byteSwap32 = x, t.bytesToHex = V, t.hexToBytes = M, t.asyncLoop = et, t.utf8ToBytes = q, t.bytesToUtf8 = Y, t.toBytes = v, t.kdfInputToBytes = N, t.concatBytes = b, t.checkOpts = C, t.createHasher = L, t.createOptHasher = I, t.createXOFer = F, t.randomBytes = gt;
  const e = hc;
  function n(A) {
    return A instanceof Uint8Array || ArrayBuffer.isView(A) && A.constructor.name === "Uint8Array";
  }
  function r(A) {
    if (!Number.isSafeInteger(A) || A < 0)
      throw new Error("positive integer expected, got " + A);
  }
  function i(A, ...U) {
    if (!n(A))
      throw new Error("Uint8Array expected");
    if (U.length > 0 && !U.includes(A.length))
      throw new Error("Uint8Array expected of length " + U + ", got length=" + A.length);
  }
  function s(A) {
    if (typeof A != "function" || typeof A.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(A.outputLen), r(A.blockLen);
  }
  function o(A, U = !0) {
    if (A.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (U && A.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(A, U) {
    i(A);
    const it = U.outputLen;
    if (A.length < it)
      throw new Error("digestInto() expects output buffer of length at least " + it);
  }
  function c(A) {
    return new Uint8Array(A.buffer, A.byteOffset, A.byteLength);
  }
  function u(A) {
    return new Uint32Array(A.buffer, A.byteOffset, Math.floor(A.byteLength / 4));
  }
  function d(...A) {
    for (let U = 0; U < A.length; U++)
      A[U].fill(0);
  }
  function l(A) {
    return new DataView(A.buffer, A.byteOffset, A.byteLength);
  }
  function y(A, U) {
    return A << 32 - U | A >>> U;
  }
  function p(A, U) {
    return A << U | A >>> 32 - U >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function m(A) {
    return A << 24 & 4278190080 | A << 8 & 16711680 | A >>> 8 & 65280 | A >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (A) => A : (A) => m(A), t.byteSwapIfBE = t.swap8IfBE;
  function x(A) {
    for (let U = 0; U < A.length; U++)
      A[U] = m(A[U]);
    return A;
  }
  t.swap32IfBE = t.isLE ? (A) => A : x;
  const T = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", K = /* @__PURE__ */ Array.from({ length: 256 }, (A, U) => U.toString(16).padStart(2, "0"));
  function V(A) {
    if (i(A), T)
      return A.toHex();
    let U = "";
    for (let it = 0; it < A.length; it++)
      U += K[A[it]];
    return U;
  }
  const E = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function _(A) {
    if (A >= E._0 && A <= E._9)
      return A - E._0;
    if (A >= E.A && A <= E.F)
      return A - (E.A - 10);
    if (A >= E.a && A <= E.f)
      return A - (E.a - 10);
  }
  function M(A) {
    if (typeof A != "string")
      throw new Error("hex string expected, got " + typeof A);
    if (T)
      return Uint8Array.fromHex(A);
    const U = A.length, it = U / 2;
    if (U % 2)
      throw new Error("hex string expected, got unpadded hex of length " + U);
    const ot = new Uint8Array(it);
    for (let at = 0, $t = 0; at < it; at++, $t += 2) {
      const ae = _(A.charCodeAt($t)), lt = _(A.charCodeAt($t + 1));
      if (ae === void 0 || lt === void 0) {
        const zt = A[$t] + A[$t + 1];
        throw new Error('hex string expected, got non-hex character "' + zt + '" at index ' + $t);
      }
      ot[at] = ae * 16 + lt;
    }
    return ot;
  }
  const J = async () => {
  };
  t.nextTick = J;
  async function et(A, U, it) {
    let ot = Date.now();
    for (let at = 0; at < A; at++) {
      it(at);
      const $t = Date.now() - ot;
      $t >= 0 && $t < U || (await (0, t.nextTick)(), ot += $t);
    }
  }
  function q(A) {
    if (typeof A != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(A));
  }
  function Y(A) {
    return new TextDecoder().decode(A);
  }
  function v(A) {
    return typeof A == "string" && (A = q(A)), i(A), A;
  }
  function N(A) {
    return typeof A == "string" && (A = q(A)), i(A), A;
  }
  function b(...A) {
    let U = 0;
    for (let ot = 0; ot < A.length; ot++) {
      const at = A[ot];
      i(at), U += at.length;
    }
    const it = new Uint8Array(U);
    for (let ot = 0, at = 0; ot < A.length; ot++) {
      const $t = A[ot];
      it.set($t, at), at += $t.length;
    }
    return it;
  }
  function C(A, U) {
    if (U !== void 0 && {}.toString.call(U) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(A, U);
  }
  class D {
  }
  t.Hash = D;
  function L(A) {
    const U = (ot) => A().update(v(ot)).digest(), it = A();
    return U.outputLen = it.outputLen, U.blockLen = it.blockLen, U.create = () => A(), U;
  }
  function I(A) {
    const U = (ot, at) => A(at).update(v(ot)).digest(), it = A({});
    return U.outputLen = it.outputLen, U.blockLen = it.blockLen, U.create = (ot) => A(ot), U;
  }
  function F(A) {
    const U = (ot, at) => A(at).update(v(ot)).digest(), it = A({});
    return U.outputLen = it.outputLen, U.blockLen = it.blockLen, U.create = (ot) => A(ot), U;
  }
  t.wrapConstructor = L, t.wrapConstructorWithOpts = I, t.wrapXOFConstructorWithOpts = F;
  function gt(A = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(A));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(A));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(hp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = hp;
  class n extends e.Hash {
    constructor(s, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(s);
      const a = (0, e.toBytes)(o);
      if (this.iHash = s.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, u = new Uint8Array(c);
      u.set(a.length > c ? s.create().update(a).digest() : a);
      for (let d = 0; d < u.length; d++)
        u[d] ^= 54;
      this.iHash.update(u), this.oHash = s.create();
      for (let d = 0; d < u.length; d++)
        u[d] ^= 106;
      this.oHash.update(u), (0, e.clean)(u);
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
      const { oHash: o, iHash: a, finished: c, destroyed: u, blockLen: d, outputLen: l } = this;
      return s = s, s.finished = c, s.destroyed = u, s.blockLen = d, s.outputLen = l, s.oHash = o._cloneInto(s.oHash), s.iHash = a._cloneInto(s.iHash), s;
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
})(dp);
const bi = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function pp(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Al(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function ei(t, ...e) {
  if (!pp(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function c1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Al(t.outputLen), Al(t.blockLen);
}
function vl(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function gp(t, e) {
  ei(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function l1(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function u1(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Ha(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Aa(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Dn(t, e) {
  return t << 32 - e | t >>> e;
}
function f1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Uu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Hu(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const yp = Uu ? (t) => t : (t) => Hu(t), d1 = yp;
function wp(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Hu(t[e]);
  return t;
}
const h1 = Uu ? (t) => t : wp, bp = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", p1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function mp(t) {
  if (ei(t), bp)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += p1[t[n]];
  return e;
}
const mr = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function id(t) {
  if (t >= mr._0 && t <= mr._9)
    return t - mr._0;
  if (t >= mr.A && t <= mr.F)
    return t - (mr.A - 10);
  if (t >= mr.a && t <= mr.f)
    return t - (mr.a - 10);
}
function g1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (bp)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let i = 0, s = 0; i < n; i++, s += 2) {
    const o = id(t.charCodeAt(s)), a = id(t.charCodeAt(s + 1));
    if (o === void 0 || a === void 0) {
      const c = t[s] + t[s + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + s);
    }
    r[i] = o * 16 + a;
  }
  return r;
}
const xp = async () => {
};
async function y1(t, e, n) {
  let r = Date.now();
  for (let i = 0; i < t; i++) {
    n(i);
    const s = Date.now() - r;
    s >= 0 && s < e || (await xp(), r += s);
  }
}
function Ou(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function w1(t) {
  return new TextDecoder().decode(t);
}
function Ho(t) {
  return typeof t == "string" && (t = Ou(t)), ei(t), t;
}
function b1(t) {
  return typeof t == "string" && (t = Ou(t)), ei(t), t;
}
function m1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const i = t[r];
    ei(i), e += i.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function x1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let Sp = class {
};
function pc(t) {
  const e = (r) => t().update(Ho(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Ep(t) {
  const e = (r, i) => t(i).update(Ho(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Ap(t) {
  const e = (r, i) => t(i).update(Ho(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const S1 = pc, E1 = Ep, A1 = Ap;
function v1(t = 32) {
  if (bi && typeof bi.getRandomValues == "function")
    return bi.getRandomValues(new Uint8Array(t));
  if (bi && typeof bi.randomBytes == "function")
    return Uint8Array.from(bi.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const $1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Sp,
  abytes: ei,
  aexists: vl,
  ahash: c1,
  anumber: Al,
  aoutput: gp,
  asyncLoop: y1,
  byteSwap: Hu,
  byteSwap32: wp,
  byteSwapIfBE: d1,
  bytesToHex: mp,
  bytesToUtf8: w1,
  checkOpts: x1,
  clean: Ha,
  concatBytes: m1,
  createHasher: pc,
  createOptHasher: Ep,
  createView: Aa,
  createXOFer: Ap,
  hexToBytes: g1,
  isBytes: pp,
  isLE: Uu,
  kdfInputToBytes: b1,
  nextTick: xp,
  randomBytes: v1,
  rotl: f1,
  rotr: Dn,
  swap32IfBE: h1,
  swap8IfBE: yp,
  toBytes: Ho,
  u32: u1,
  u8: l1,
  utf8ToBytes: Ou,
  wrapConstructor: S1,
  wrapConstructorWithOpts: E1,
  wrapXOFConstructorWithOpts: A1
}, Symbol.toStringTag, { value: "Module" }));
function k1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function I1(t, e, n) {
  return t & e ^ ~t & n;
}
function L1(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class C1 extends Sp {
  constructor(e, n, r, i) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.buffer = new Uint8Array(e), this.view = Aa(this.buffer);
  }
  update(e) {
    vl(this), e = Ho(e), ei(e);
    const { view: n, buffer: r, blockLen: i } = this, s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Aa(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    vl(this), gp(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, Ha(this.buffer.subarray(o)), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    k1(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Aa(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
const Dr = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Fr = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), T1 = /* @__PURE__ */ Uint32Array.from([
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
]), jr = /* @__PURE__ */ new Uint32Array(64);
let Du = class extends C1 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Dr[0] | 0, this.B = Dr[1] | 0, this.C = Dr[2] | 0, this.D = Dr[3] | 0, this.E = Dr[4] | 0, this.F = Dr[5] | 0, this.G = Dr[6] | 0, this.H = Dr[7] | 0;
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
      jr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = jr[l - 15], p = jr[l - 2], m = Dn(y, 7) ^ Dn(y, 18) ^ y >>> 3, x = Dn(p, 17) ^ Dn(p, 19) ^ p >>> 10;
      jr[l] = x + jr[l - 7] + m + jr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Dn(a, 6) ^ Dn(a, 11) ^ Dn(a, 25), p = d + y + I1(a, c, u) + T1[l] + jr[l] | 0, x = (Dn(r, 2) ^ Dn(r, 13) ^ Dn(r, 22)) + L1(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Ha(jr);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Ha(this.buffer);
  }
}, vp = class extends Du {
  constructor() {
    super(28), this.A = Fr[0] | 0, this.B = Fr[1] | 0, this.C = Fr[2] | 0, this.D = Fr[3] | 0, this.E = Fr[4] | 0, this.F = Fr[5] | 0, this.G = Fr[6] | 0, this.H = Fr[7] | 0;
  }
};
const B1 = /* @__PURE__ */ pc(() => new Du()), M1 = /* @__PURE__ */ pc(() => new vp()), N1 = Du, $p = B1, P1 = vp, _1 = M1, U1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: P1,
  SHA256: N1,
  sha224: _1,
  sha256: $p
}, Symbol.toStringTag, { value: "Module" })), gc = /* @__PURE__ */ oc(U1), H1 = /* @__PURE__ */ oc(Rb);
var Fi = {};
Object.defineProperty(Fi, "__esModule", { value: !0 });
Fi.joseToDer = Fi.derToJose = void 0;
const kp = Uo, Ip = tn;
function Rc(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const O1 = {
  ES256: Rc(256),
  ES384: Rc(384),
  ES512: Rc(521)
};
function Lp(t) {
  const e = O1[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Oa = 128, Cp = 0, D1 = 32, F1 = 16, j1 = 2, Tp = F1 | D1 | Cp << 6, Da = j1 | Cp << 6;
function Bp(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, kp.toByteArray)((0, Ip.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function z1(t, e) {
  const n = Bp(t), r = Lp(e), i = r + 1, s = n.length;
  let o = 0;
  if (n[o++] !== Tp)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Oa | 1) && (a = n[o++]), s - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${s - o}" remaining`);
  if (n[o++] !== Da)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (s - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${s - o - 2}" available`);
  if (i < c)
    throw new Error(`"r" specified length of "${c}", max of "${i}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== Da)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[o++];
  if (s - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${s - o}"`);
  if (i < d)
    throw new Error(`"s" specified length of "${d}", max of "${i}" is acceptable`);
  const l = o;
  if (o += d, o !== s)
    throw new Error(`Expected to consume entire array, but "${s - o}" bytes remain`);
  const y = r - c, p = r - d, m = new Uint8Array(y + c + p + d);
  for (o = 0; o < y; ++o)
    m[o] = 0;
  m.set(n.subarray(u + Math.max(-y, 0), u + c), o), o = r;
  for (const x = o; o < x + p; ++o)
    m[o] = 0;
  return m.set(n.subarray(l + Math.max(-p, 0), l + d), o), (0, Ip.escape)((0, kp.fromByteArray)(m));
}
Fi.derToJose = z1;
function od(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Oa && --r, r;
}
function R1(t, e) {
  t = Bp(t);
  const n = Lp(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const i = od(t, 0, n), s = od(t, n, t.length), o = n - i, a = n - s, c = 2 + o + 1 + 1 + a, u = c < Oa, d = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return d[l++] = Tp, u ? d[l++] = c : (d[l++] = Oa | 1, d[l++] = c & 255), d[l++] = Da, d[l++] = o, i < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(i, n), l), l += n - i), d[l++] = Da, d[l++] = a, s < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + s), l), d;
}
Fi.joseToDer = R1;
var Ir = {};
Object.defineProperty(Ir, "__esModule", { value: !0 });
Ir.InvalidTokenError = Ir.MissingParametersError = void 0;
class G1 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Ir.MissingParametersError = G1;
class K1 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Ir.InvalidTokenError = K1;
const Oo = /* @__PURE__ */ oc($1);
Object.defineProperty(dc, "__esModule", { value: !0 });
dc.SECP256K1Client = void 0;
const V1 = dp, q1 = gc, va = H1, ad = Fi, cd = Ir, ld = Oo;
va.utils.hmacSha256Sync = (t, ...e) => {
  const n = V1.hmac.create(q1.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Mp {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, ld.bytesToHex)(va.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new cd.MissingParametersError("a signing input hash and private key are all required");
    const i = va.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, ld.bytesToHex)(i);
    if (r === "jose")
      return (0, ad.derToJose)(i, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, ad.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new cd.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return va.verify(n, e, r, { strict: !1 });
  }
}
dc.SECP256K1Client = Mp;
Mp.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = dc;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(fc);
var Os = {};
const W1 = /* @__PURE__ */ oc(H0);
var X1 = nn && nn.__awaiter || function(t, e, n, r) {
  function i(s) {
    return s instanceof n ? s : new n(function(o) {
      o(s);
    });
  }
  return new (n || (n = Promise))(function(s, o) {
    function a(d) {
      try {
        u(r.next(d));
      } catch (l) {
        o(l);
      }
    }
    function c(d) {
      try {
        u(r.throw(d));
      } catch (l) {
        o(l);
      }
    }
    function u(d) {
      d.done ? s(d.value) : i(d.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Os, "__esModule", { value: !0 });
Os.hashSha256Async = Os.hashSha256 = void 0;
const Y1 = gc;
function Np(t) {
  return (0, Y1.sha256)(t);
}
Os.hashSha256 = Np;
function Z1(t) {
  return X1(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = W1;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Np(t));
    }
  });
}
Os.hashSha256Async = Z1;
var Q1 = nn && nn.__awaiter || function(t, e, n, r) {
  function i(s) {
    return s instanceof n ? s : new n(function(o) {
      o(s);
    });
  }
  return new (n || (n = Promise))(function(s, o) {
    function a(d) {
      try {
        u(r.next(d));
      } catch (l) {
        o(l);
      }
    }
    function c(d) {
      try {
        u(r.throw(d));
      } catch (l) {
        o(l);
      }
    }
    function u(d) {
      d.done ? s(d.value) : i(d.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Di, "__esModule", { value: !0 });
Di.TokenSigner = Di.createUnsecuredToken = void 0;
const $l = tn, ud = fc, J1 = Ir, fd = Os;
function kl(t, e) {
  const n = [], r = $l.encode(JSON.stringify(e));
  n.push(r);
  const i = $l.encode(JSON.stringify(t));
  return n.push(i), n.join(".");
}
function t2(t) {
  return kl(t, { typ: "JWT", alg: "none" }) + ".";
}
Di.createUnsecuredToken = t2;
class e2 {
  constructor(e, n) {
    if (!(e && n))
      throw new J1.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !ud.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = ud.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const i = this.header(r), s = kl(e, i), o = (0, fd.hashSha256)(s);
    return this.createWithSignedHash(e, n, i, s, o);
  }
  signAsync(e, n = !1, r = {}) {
    return Q1(this, void 0, void 0, function* () {
      const i = this.header(r), s = kl(e, i), o = yield (0, fd.hashSha256Async)(s);
      return this.createWithSignedHash(e, n, i, s, o);
    });
  }
  createWithSignedHash(e, n, r, i, s) {
    const o = this.cryptoClient.signHash(s, this.rawPrivateKey);
    return n ? {
      header: [$l.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [i, o].join(".");
  }
}
Di.TokenSigner = e2;
var yc = {};
Object.defineProperty(yc, "__esModule", { value: !0 });
yc.TokenVerifier = void 0;
const n2 = tn, dd = fc, r2 = Ir, Qo = Os;
class s2 {
  constructor(e, n) {
    if (!(e && n))
      throw new r2.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !dd.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = dd.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Qo.hashSha256Async)(i).then((o) => s(o));
    {
      const o = (0, Qo.hashSha256)(i);
      return s(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), n2.encode(e.payload)].join(".");
    let i = !0;
    const s = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (i = !1);
    }), i);
    if (n)
      return (0, Qo.hashSha256Async)(r).then((o) => s(o));
    {
      const o = (0, Qo.hashSha256)(r);
      return s(o);
    }
  }
}
yc.TokenVerifier = s2;
var wc = {};
Object.defineProperty(wc, "__esModule", { value: !0 });
wc.decodeToken = void 0;
const Jo = tn;
function i2(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Jo.decode(e[0])), r = JSON.parse(Jo.decode(e[1])), i = e[2];
    return {
      header: n,
      payload: r,
      signature: i
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Jo.decode(e));
    const n = [];
    return t.header.map((r) => {
      const i = JSON.parse(Jo.decode(r));
      n.push(i);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
wc.decodeToken = i2;
(function(t) {
  var e = nn && nn.__createBinding || (Object.create ? function(r, i, s, o) {
    o === void 0 && (o = s);
    var a = Object.getOwnPropertyDescriptor(i, s);
    (!a || ("get" in a ? !i.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return i[s];
    } }), Object.defineProperty(r, o, a);
  } : function(r, i, s, o) {
    o === void 0 && (o = s), r[o] = i[s];
  }), n = nn && nn.__exportStar || function(r, i) {
    for (var s in r) s !== "default" && !Object.prototype.hasOwnProperty.call(i, s) && e(i, r, s);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Di, t), n(yc, t), n(wc, t), n(Ir, t), n(fc, t);
})(Ge);
function o2(t) {
  return `did:btc-addr:${t}`;
}
function a2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Kf("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Kf('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Pp(t) {
  if (t)
    return a2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const c2 = "1.4.0";
function l2() {
  return Wm();
}
function u2(t, e, n, r = I0.slice(), i, s = Kw().getTime(), o = {}) {
  const a = (p) => {
    const m = vu("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return m == null ? void 0 : m.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), i || (i = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: qw(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(s / 1e3),
    iss: null,
    public_keys: [],
    domain_name: i,
    manifest_uri: n,
    redirect_uri: e,
    version: c2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = Ge.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const d = sp(u);
  return c.iss = o2(d), new Ge.TokenSigner("ES256k", t).sign(c);
}
async function hd(t, e) {
  const n = Po(Rt(e)), r = JSON.parse(n), i = await cp(t, r);
  if (typeof i != "string")
    throw new Error("Unable to correctly decrypt private key");
  return i;
}
function f2(t) {
  const e = Ge.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Ge.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function d2(t) {
  const e = Ge.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Pp(e.iss);
  if (n.length === 1) {
    if (sp(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function h2(t) {
  const e = Ge.decodeToken(t).payload;
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
function p2(t) {
  const e = Ge.decodeToken(t).payload;
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
function g2(t) {
  const e = [
    p2(t),
    h2(t),
    f2(t),
    d2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const pd = "1.0.0";
class us {
  constructor(e) {
    this.version = pd, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== pd)
      throw new wl(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new us(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class _p {
  constructor(e) {
    if (e) {
      const n = new us(e);
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
class gd extends _p {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new us({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new L0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new us({})), !0;
  }
}
class yd extends _p {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = zw, !localStorage.getItem(this.key)) {
      const r = new us({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new L0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return us.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new us({})), !0;
  }
}
var Eo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Eo || (Eo = {}));
var Fa;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Fa || (Fa = {}));
Eo.Mainnet;
var $r;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})($r || ($r = {}));
var sr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(sr || (sr = {}));
$r.Mainnet;
const Up = {
  chainId: Eo.Mainnet,
  transactionVersion: $r.Mainnet,
  peerNetworkId: Fa.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: sr.MainnetSingleSig,
    multiSig: sr.MainnetMultiSig
  },
  client: { baseUrl: C0 }
}, Il = {
  chainId: Eo.Testnet,
  transactionVersion: $r.Testnet,
  peerNetworkId: Fa.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: sr.TestnetSingleSig,
    multiSig: sr.TestnetMultiSig
  },
  client: { baseUrl: T0 }
}, $a = {
  ...Il,
  addressVersion: { ...Il.addressVersion },
  magicBytes: "id",
  client: { baseUrl: B0 }
}, y2 = {
  ...$a,
  addressVersion: { ...$a.addressVersion },
  client: { ...$a.client }
};
function w2(t) {
  switch (t) {
    case "mainnet":
      return Up;
    case "testnet":
      return Il;
    case "devnet":
      return $a;
    case "mocknet":
      return y2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Hp(t) {
  return typeof t == "string" ? w2(t) : t;
}
var wd;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(wd || (wd = {}));
var bd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(bd || (bd = {}));
var Fn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Fn || (Fn = {}));
const Gc = ["onChainOnly", "offChainOnly", "any"];
Gc[0] + "", Fn.OnChainOnly, Gc[1] + "", Fn.OffChainOnly, Gc[2] + "", Fn.Any, Fn.OnChainOnly + "", Fn.OnChainOnly, Fn.OffChainOnly + "", Fn.OffChainOnly, Fn.Any + "", Fn.Any;
var md;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(md || (md = {}));
var xd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(xd || (xd = {}));
var Sd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Sd || (Sd = {}));
var vr;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(vr || (vr = {}));
var Ed;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ed || (Ed = {}));
var Ad;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ad || (Ad = {}));
var vd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(vd || (vd = {}));
var $d;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})($d || ($d = {}));
var kd;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(kd || (kd = {}));
var Id;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Id || (Id = {}));
var Ld;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Ld || (Ld = {}));
var Cd;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Cd || (Cd = {}));
var Td;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Td || (Td = {}));
function Ll(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function b2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Op(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function m2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ll(t.outputLen), Ll(t.blockLen);
}
function x2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function S2(t, e) {
  Op(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const $s = {
  number: Ll,
  bool: b2,
  bytes: Op,
  hash: m2,
  exists: x2,
  output: S2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Kc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Yn = (t, e) => t << 32 - e | t >>> e, E2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!E2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function A2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Fu(t) {
  if (typeof t == "string" && (t = A2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Dp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ni(t) {
  const e = (r) => t().update(Fu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Fp = class extends Dp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, $s.hash(e);
    const r = Fu(n);
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
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const jp = (t, e, n) => new Fp(t, e).update(n).digest();
jp.create = (t, e) => new Fp(t, e);
function v2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let ju = class extends Dp {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Kc(this.buffer);
  }
  update(e) {
    $s.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Fu(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Kc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    $s.exists(this), $s.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    v2(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Kc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
const $2 = (t, e, n) => t & e ^ ~t & n, k2 = (t, e, n) => t & e ^ t & n ^ e & n, I2 = new Uint32Array([
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
let zp = class extends ju {
  constructor() {
    super(64, 32, 8, !1), this.A = zr[0] | 0, this.B = zr[1] | 0, this.C = zr[2] | 0, this.D = zr[3] | 0, this.E = zr[4] | 0, this.F = zr[5] | 0, this.G = zr[6] | 0, this.H = zr[7] | 0;
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
      Rr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Rr[l - 15], p = Rr[l - 2], m = Yn(y, 7) ^ Yn(y, 18) ^ y >>> 3, x = Yn(p, 17) ^ Yn(p, 19) ^ p >>> 10;
      Rr[l] = x + Rr[l - 7] + m + Rr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Yn(a, 6) ^ Yn(a, 11) ^ Yn(a, 25), p = d + y + $2(a, c, u) + I2[l] + Rr[l] | 0, x = (Yn(r, 2) ^ Yn(r, 13) ^ Yn(r, 22)) + k2(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Rr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, L2 = class extends zp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Rp = ni(() => new zp());
ni(() => new L2());
var ri = {}, zu = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Oo;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let p = o.length - 1; p >= 0; p--)
      if (u < 4) {
        const m = n.indexOf(o[p]) >> u;
        let x = 0;
        p !== 0 && (x = n.indexOf(o[p - 1]));
        const T = 1 + u, K = x % (1 << T) << 5 - T, V = t.c32[m + K];
        u = T, c.unshift(V);
      } else
        u = 0;
    let d = 0;
    for (let p = 0; p < c.length && c[p] === "0"; p++)
      d++;
    c = c.slice(d);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), y = l ? l[0].length : 0;
    for (let p = 0; p < y; p++)
      c.unshift(t.c32[0]);
    if (a) {
      const p = a - c.length;
      for (let m = 0; m < p; m++)
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
    const c = o.match(`^${t.c32[0]}*`), u = c ? c[0].length : 0;
    let d = [], l = 0, y = 0;
    for (let x = o.length - 1; x >= 0; x--) {
      y === 4 && (d.unshift(n[l]), y = 0, l = 0);
      const K = (t.c32.indexOf(o[x]) << y) + l, V = n[K % 16];
      if (y += 1, l = K >> 4, l > 1 << y)
        throw new Error("Panic error in decoding.");
      d.unshift(V);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let p = 0;
    for (let x = 0; x < d.length && d[x] === "0"; x++)
      p++;
    d = d.slice(p - p % 2);
    let m = d.join("");
    for (let x = 0; x < u; x++)
      m = `00${m}`;
    if (a) {
      const x = a * 2 - m.length;
      for (let T = 0; T < x; T += 2)
        m = `00${m}`;
    }
    return m;
  }
  t.c32decode = s;
})(zu);
var Ds = {};
Object.defineProperty(Ds, "__esModule", { value: !0 });
Ds.c32checkDecode = Ds.c32checkEncode = void 0;
const Bd = gc, Md = Oo, wo = zu;
function Gp(t) {
  const e = (0, Bd.sha256)((0, Bd.sha256)((0, Md.hexToBytes)(t)));
  return (0, Md.bytesToHex)(e.slice(0, 4));
}
function C2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Gp(`${n}${e}`), i = (0, wo.c32encode)(`${e}${r}`);
  return `${wo.c32[t]}${i}`;
}
Ds.c32checkEncode = C2;
function T2(t) {
  t = (0, wo.c32normalize)(t);
  const e = (0, wo.c32decode)(t.slice(1)), n = t[0], r = wo.c32.indexOf(n), i = e.slice(-8);
  let s = r.toString(16);
  if (s.length === 1 && (s = `0${s}`), Gp(`${s}${e.substring(0, e.length - 8)}`) !== i)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Ds.c32checkDecode = T2;
var Kp = {}, ji = {};
Object.defineProperty(ji, "__esModule", { value: !0 });
ji.decode = ji.encode = void 0;
const ja = gc, Nd = Oo, Vp = J0, qp = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function B2(t, e = "00") {
  const n = typeof t == "string" ? (0, Nd.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Nd.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const i = (0, ja.sha256)((0, ja.sha256)(new Uint8Array([...r, ...n])));
  return Vp(qp).encode([...r, ...n, ...i.slice(0, 4)]);
}
ji.encode = B2;
function M2(t) {
  const e = Vp(qp).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), i = (0, ja.sha256)((0, ja.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((s, o) => {
    if (s !== i[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
ji.decode = M2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Ds, n = ji, r = Oo;
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
    const y = n.decode(d), p = (0, r.bytesToHex)(y.data), m = parseInt((0, r.bytesToHex)(y.prefix), 16);
    let x;
    return l < 0 ? (x = m, i[m] !== void 0 && (x = i[m])) : x = l, o(x, p);
  }
  t.b58ToC32 = c;
  function u(d, l = -1) {
    const y = a(d), p = y[0], m = y[1];
    let x;
    l < 0 ? (x = p, s[p] !== void 0 && (x = s[p])) : x = l;
    let T = x.toString(16);
    return T.length === 1 && (T = `0${T}`), n.encode(m, T);
  }
  t.c32ToB58 = u;
})(Kp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = zu;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Ds;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Kp;
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
})(ri);
function N2(t, e) {
  switch (e = Hp(e ?? Up), t) {
    case vr.P2PKH:
      switch (e.transactionVersion) {
        case $r.Mainnet:
          return sr.MainnetSingleSig;
        case $r.Testnet:
          return sr.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case vr.P2SH:
    case vr.P2SHNonSequential:
    case vr.P2WPKH:
    case vr.P2WSH:
    case vr.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case $r.Mainnet:
          return sr.MainnetMultiSig;
        case $r.Testnet:
          return sr.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const P2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Wp = Uint8Array.from({ length: 16 }, (t, e) => e), _2 = Wp.map((t) => (9 * t + 5) % 16);
let Ru = [Wp], Gu = [_2];
for (let t = 0; t < 4; t++)
  for (let e of [Ru, Gu])
    e.push(e[t].map((n) => P2[n]));
const Xp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), U2 = Ru.map((t, e) => t.map((n) => Xp[e][n])), H2 = Gu.map((t, e) => t.map((n) => Xp[e][n])), O2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), D2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ta = (t, e) => t << e | t >>> 32 - e;
function Pd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ea = new Uint32Array(16);
let F2 = class extends ju {
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
      ea[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const m = 4 - p, x = O2[p], T = D2[p], K = Ru[p], V = Gu[p], E = U2[p], _ = H2[p];
      for (let M = 0; M < 16; M++) {
        const J = ta(r + Pd(p, s, a, u) + ea[K[M]] + x, E[M]) + l | 0;
        r = l, l = u, u = ta(a, 10) | 0, a = s, s = J;
      }
      for (let M = 0; M < 16; M++) {
        const J = ta(i + Pd(m, o, c, d) + ea[V[M]] + T, _[M]) + y | 0;
        i = y, y = d, d = ta(c, 10) | 0, c = o, o = J;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    ea.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const j2 = ni(() => new F2()), na = BigInt(2 ** 32 - 1), Cl = BigInt(32);
function Yp(t, e = !1) {
  return e ? { h: Number(t & na), l: Number(t >> Cl & na) } : { h: Number(t >> Cl & na) | 0, l: Number(t & na) | 0 };
}
function z2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Yp(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const R2 = (t, e) => BigInt(t >>> 0) << Cl | BigInt(e >>> 0), G2 = (t, e, n) => t >>> n, K2 = (t, e, n) => t << 32 - n | e >>> n, V2 = (t, e, n) => t >>> n | e << 32 - n, q2 = (t, e, n) => t << 32 - n | e >>> n, W2 = (t, e, n) => t << 64 - n | e >>> n - 32, X2 = (t, e, n) => t >>> n - 32 | e << 64 - n, Y2 = (t, e) => e, Z2 = (t, e) => t, Q2 = (t, e, n) => t << n | e >>> 32 - n, J2 = (t, e, n) => e << n | t >>> 32 - n, tx = (t, e, n) => e << n - 32 | t >>> 64 - n, ex = (t, e, n) => t << n - 32 | e >>> 64 - n;
function nx(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const rx = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), sx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, ix = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), ox = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, ax = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), cx = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, It = {
  fromBig: Yp,
  split: z2,
  toBig: R2,
  shrSH: G2,
  shrSL: K2,
  rotrSH: V2,
  rotrSL: q2,
  rotrBH: W2,
  rotrBL: X2,
  rotr32H: Y2,
  rotr32L: Z2,
  rotlSH: Q2,
  rotlSL: J2,
  rotlBH: tx,
  rotlBL: ex,
  add: nx,
  add3L: rx,
  add3H: sx,
  add4L: ix,
  add4H: ox,
  add5H: cx,
  add5L: ax
}, [lx, ux] = It.split([
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
].map((t) => BigInt(t))), Gr = new Uint32Array(80), Kr = new Uint32Array(80);
let bc = class extends ju {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: m, Hh: x, Hl: T } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, y, p, m, x, T];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, y, p, m, x, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = m | 0, this.Hh = x | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Gr[E] = e.getUint32(n), Kr[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const _ = Gr[E - 15] | 0, M = Kr[E - 15] | 0, J = It.rotrSH(_, M, 1) ^ It.rotrSH(_, M, 8) ^ It.shrSH(_, M, 7), et = It.rotrSL(_, M, 1) ^ It.rotrSL(_, M, 8) ^ It.shrSL(_, M, 7), q = Gr[E - 2] | 0, Y = Kr[E - 2] | 0, v = It.rotrSH(q, Y, 19) ^ It.rotrBH(q, Y, 61) ^ It.shrSH(q, Y, 6), N = It.rotrSL(q, Y, 19) ^ It.rotrBL(q, Y, 61) ^ It.shrSL(q, Y, 6), b = It.add4L(et, N, Kr[E - 7], Kr[E - 16]), C = It.add4H(b, J, v, Gr[E - 7], Gr[E - 16]);
      Gr[E] = C | 0, Kr[E] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: m, Gh: x, Gl: T, Hh: K, Hl: V } = this;
    for (let E = 0; E < 80; E++) {
      const _ = It.rotrSH(l, y, 14) ^ It.rotrSH(l, y, 18) ^ It.rotrBH(l, y, 41), M = It.rotrSL(l, y, 14) ^ It.rotrSL(l, y, 18) ^ It.rotrBL(l, y, 41), J = l & p ^ ~l & x, et = y & m ^ ~y & T, q = It.add5L(V, M, et, ux[E], Kr[E]), Y = It.add5H(q, K, _, J, lx[E], Gr[E]), v = q | 0, N = It.rotrSH(r, i, 28) ^ It.rotrBH(r, i, 34) ^ It.rotrBH(r, i, 39), b = It.rotrSL(r, i, 28) ^ It.rotrBL(r, i, 34) ^ It.rotrBL(r, i, 39), C = r & s ^ r & a ^ s & a, D = i & o ^ i & c ^ o & c;
      K = x | 0, V = T | 0, x = p | 0, T = m | 0, p = l | 0, m = y | 0, { h: l, l: y } = It.add(u | 0, d | 0, Y | 0, v | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const L = It.add3L(v, b, D);
      r = It.add3H(L, Y, N, C), i = L | 0;
    }
    ({ h: r, l: i } = It.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = It.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = It.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = It.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = It.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: m } = It.add(this.Fh | 0, this.Fl | 0, p | 0, m | 0), { h: x, l: T } = It.add(this.Gh | 0, this.Gl | 0, x | 0, T | 0), { h: K, l: V } = It.add(this.Hh | 0, this.Hl | 0, K | 0, V | 0), this.set(r, i, s, o, a, c, u, d, l, y, p, m, x, T, K, V);
  }
  roundClean() {
    Gr.fill(0), Kr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, fx = class extends bc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, dx = class extends bc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, hx = class extends bc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ni(() => new bc());
ni(() => new fx());
ni(() => new dx());
ni(() => new hx());
var za = { exports: {} };
za.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", i = 9007199254740991, s = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", y = "[object Map]", p = "[object Number]", m = "[object Object]", x = "[object Promise]", T = "[object RegExp]", K = "[object Set]", V = "[object String]", E = "[object Symbol]", _ = "[object WeakMap]", M = "[object ArrayBuffer]", J = "[object DataView]", et = "[object Float32Array]", q = "[object Float64Array]", Y = "[object Int8Array]", v = "[object Int16Array]", N = "[object Int32Array]", b = "[object Uint8Array]", C = "[object Uint8ClampedArray]", D = "[object Uint16Array]", L = "[object Uint32Array]", I = /[\\^$.*+?()[\]{}|]/g, F = /\w*$/, gt = /^\[object .+?Constructor\]$/, A = /^(?:0|[1-9]\d*)$/, U = {};
  U[s] = U[o] = U[M] = U[J] = U[a] = U[c] = U[et] = U[q] = U[Y] = U[v] = U[N] = U[y] = U[p] = U[m] = U[T] = U[K] = U[V] = U[E] = U[b] = U[C] = U[D] = U[L] = !0, U[u] = U[d] = U[_] = !1;
  var it = typeof nn == "object" && nn && nn.Object === Object && nn, ot = typeof self == "object" && self && self.Object === Object && self, at = it || ot || Function("return this")(), $t = e && !e.nodeType && e, ae = $t && !0 && t && !t.nodeType && t, lt = ae && ae.exports === $t;
  function zt(g, B) {
    return g.set(B[0], B[1]), g;
  }
  function Bt(g, B) {
    return g.add(B), g;
  }
  function Ut(g, B) {
    for (var O = -1, ft = g ? g.length : 0; ++O < ft && B(g[O], O, g) !== !1; )
      ;
    return g;
  }
  function wt(g, B) {
    for (var O = -1, ft = B.length, je = g.length; ++O < ft; )
      g[je + O] = B[O];
    return g;
  }
  function ce(g, B, O, ft) {
    for (var je = -1, cn = g ? g.length : 0; ++je < cn; )
      O = B(O, g[je], je, g);
    return O;
  }
  function sn(g, B) {
    for (var O = -1, ft = Array(g); ++O < g; )
      ft[O] = B(O);
    return ft;
  }
  function De(g, B) {
    return g == null ? void 0 : g[B];
  }
  function Ye(g) {
    var B = !1;
    if (g != null && typeof g.toString != "function")
      try {
        B = !!(g + "");
      } catch {
      }
    return B;
  }
  function Pe(g) {
    var B = -1, O = Array(g.size);
    return g.forEach(function(ft, je) {
      O[++B] = [je, ft];
    }), O;
  }
  function _e(g, B) {
    return function(O) {
      return g(B(O));
    };
  }
  function ie(g) {
    var B = -1, O = Array(g.size);
    return g.forEach(function(ft) {
      O[++B] = ft;
    }), O;
  }
  var Ot = Array.prototype, on = Function.prototype, Te = Object.prototype, Ze = at["__core-js_shared__"], Gt = function() {
    var g = /[^.]+$/.exec(Ze && Ze.keys && Ze.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), Jt = on.toString, Ke = Te.hasOwnProperty, $n = Te.toString, k = RegExp(
    "^" + Jt.call(Ke).replace(I, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), z = lt ? at.Buffer : void 0, H = at.Symbol, W = at.Uint8Array, yt = _e(Object.getPrototypeOf, Object), xt = Object.create, te = Te.propertyIsEnumerable, qt = Ot.splice, ee = Object.getOwnPropertySymbols, Yt = z ? z.isBuffer : void 0, Ae = _e(Object.keys, Object), Le = X(at, "DataView"), Dt = X(at, "Map"), ht = X(at, "Promise"), Kt = X(at, "Set"), Zt = X(at, "WeakMap"), de = X(Object, "create"), oe = Ft(Le), an = Ft(Dt), h = Ft(ht), S = Ft(Kt), f = Ft(Zt), R = H ? H.prototype : void 0, ut = R ? R.valueOf : void 0;
  function mt(g) {
    var B = -1, O = g ? g.length : 0;
    for (this.clear(); ++B < O; ) {
      var ft = g[B];
      this.set(ft[0], ft[1]);
    }
  }
  function st() {
    this.__data__ = de ? de(null) : {};
  }
  function Wt(g) {
    return this.has(g) && delete this.__data__[g];
  }
  function Ue(g) {
    var B = this.__data__;
    if (de) {
      var O = B[g];
      return O === r ? void 0 : O;
    }
    return Ke.call(B, g) ? B[g] : void 0;
  }
  function ye(g) {
    var B = this.__data__;
    return de ? B[g] !== void 0 : Ke.call(B, g);
  }
  function hn(g, B) {
    var O = this.__data__;
    return O[g] = de && B === void 0 ? r : B, this;
  }
  mt.prototype.clear = st, mt.prototype.delete = Wt, mt.prototype.get = Ue, mt.prototype.has = ye, mt.prototype.set = hn;
  function he(g) {
    var B = -1, O = g ? g.length : 0;
    for (this.clear(); ++B < O; ) {
      var ft = g[B];
      this.set(ft[0], ft[1]);
    }
  }
  function Nn() {
    this.__data__ = [];
  }
  function Fe(g) {
    var B = this.__data__, O = Un(B, g);
    if (O < 0)
      return !1;
    var ft = B.length - 1;
    return O == ft ? B.pop() : qt.call(B, O, 1), !0;
  }
  function Pn(g) {
    var B = this.__data__, O = Un(B, g);
    return O < 0 ? void 0 : B[O][1];
  }
  function pn(g) {
    return Un(this.__data__, g) > -1;
  }
  function gs(g, B) {
    var O = this.__data__, ft = Un(O, g);
    return ft < 0 ? O.push([g, B]) : O[ft][1] = B, this;
  }
  he.prototype.clear = Nn, he.prototype.delete = Fe, he.prototype.get = Pn, he.prototype.has = pn, he.prototype.set = gs;
  function Ce(g) {
    var B = -1, O = g ? g.length : 0;
    for (this.clear(); ++B < O; ) {
      var ft = g[B];
      this.set(ft[0], ft[1]);
    }
  }
  function li() {
    this.__data__ = {
      hash: new mt(),
      map: new (Dt || he)(),
      string: new mt()
    };
  }
  function hr(g) {
    return $(this, g).delete(g);
  }
  function At(g) {
    return $(this, g).get(g);
  }
  function Pt(g) {
    return $(this, g).has(g);
  }
  function we(g, B) {
    return $(this, g).set(g, B), this;
  }
  Ce.prototype.clear = li, Ce.prototype.delete = hr, Ce.prototype.get = At, Ce.prototype.has = Pt, Ce.prototype.set = we;
  function He(g) {
    this.__data__ = new he(g);
  }
  function ui() {
    this.__data__ = new he();
  }
  function ys(g) {
    return this.__data__.delete(g);
  }
  function Tr(g) {
    return this.__data__.get(g);
  }
  function _n(g) {
    return this.__data__.has(g);
  }
  function qn(g, B) {
    var O = this.__data__;
    if (O instanceof he) {
      var ft = O.__data__;
      if (!Dt || ft.length < n - 1)
        return ft.push([g, B]), this;
      O = this.__data__ = new Ce(ft);
    }
    return O.set(g, B), this;
  }
  He.prototype.clear = ui, He.prototype.delete = ys, He.prototype.get = Tr, He.prototype.has = _n, He.prototype.set = qn;
  function ws(g, B) {
    var O = Pr(g) || _c(g) ? sn(g.length, String) : [], ft = O.length, je = !!ft;
    for (var cn in g)
      Ke.call(g, cn) && !(je && (cn == "length" || ct(cn, ft))) && O.push(cn);
    return O;
  }
  function pr(g, B, O) {
    var ft = g[B];
    (!(Ke.call(g, B) && xs(ft, O)) || O === void 0 && !(B in g)) && (g[B] = O);
  }
  function Un(g, B) {
    for (var O = g.length; O--; )
      if (xs(g[O][0], B))
        return O;
    return -1;
  }
  function Wn(g, B) {
    return g && wr(B, Uc(B), g);
  }
  function Hn(g, B, O, ft, je, cn, br) {
    var ln;
    if (ft && (ln = cn ? ft(g, je, cn, br) : ft(g)), ln !== void 0)
      return ln;
    if (!zo(g))
      return g;
    var Of = Pr(g);
    if (Of) {
      if (ln = G(g), !B)
        return pi(g, ln);
    } else {
      var yi = pt(g), Df = yi == d || yi == l;
      if (uw(g))
        return ro(g, B);
      if (yi == m || yi == s || Df && !cn) {
        if (Ye(g))
          return cn ? g : {};
        if (ln = P(Df ? {} : g), !B)
          return gi(g, Wn(ln, g));
      } else {
        if (!U[yi])
          return cn ? g : {};
        ln = j(g, yi, Hn, B);
      }
    }
    br || (br = new He());
    var Ff = br.get(g);
    if (Ff)
      return Ff;
    if (br.set(g, ln), !Of)
      var jf = O ? w(g) : Uc(g);
    return Ut(jf || g, function(Hc, Ro) {
      jf && (Ro = Hc, Hc = g[Ro]), pr(ln, Ro, Hn(Hc, B, O, ft, Ro, g, br));
    }), ln;
  }
  function On(g) {
    return zo(g) ? xt(g) : {};
  }
  function bs(g, B, O) {
    var ft = B(g);
    return Pr(g) ? ft : wt(ft, O(g));
  }
  function fi(g) {
    return $n.call(g);
  }
  function ms(g) {
    if (!zo(g) || ve(g))
      return !1;
    var B = Hf(g) || Ye(g) ? k : gt;
    return B.test(Ft(g));
  }
  function be(g) {
    if (!Be(g))
      return Ae(g);
    var B = [];
    for (var O in Object(g))
      Ke.call(g, O) && O != "constructor" && B.push(O);
    return B;
  }
  function ro(g, B) {
    if (B)
      return g.slice();
    var O = new g.constructor(g.length);
    return g.copy(O), O;
  }
  function Br(g) {
    var B = new g.constructor(g.byteLength);
    return new W(B).set(new W(g)), B;
  }
  function gr(g, B) {
    var O = B ? Br(g.buffer) : g.buffer;
    return new g.constructor(O, g.byteOffset, g.byteLength);
  }
  function Mr(g, B, O) {
    var ft = B ? O(Pe(g), !0) : Pe(g);
    return ce(ft, zt, new g.constructor());
  }
  function yr(g) {
    var B = new g.constructor(g.source, F.exec(g));
    return B.lastIndex = g.lastIndex, B;
  }
  function di(g, B, O) {
    var ft = B ? O(ie(g), !0) : ie(g);
    return ce(ft, Bt, new g.constructor());
  }
  function Nr(g) {
    return ut ? Object(ut.call(g)) : {};
  }
  function hi(g, B) {
    var O = B ? Br(g.buffer) : g.buffer;
    return new g.constructor(O, g.byteOffset, g.length);
  }
  function pi(g, B) {
    var O = -1, ft = g.length;
    for (B || (B = Array(ft)); ++O < ft; )
      B[O] = g[O];
    return B;
  }
  function wr(g, B, O, ft) {
    O || (O = {});
    for (var je = -1, cn = B.length; ++je < cn; ) {
      var br = B[je], ln = void 0;
      pr(O, br, ln === void 0 ? g[br] : ln);
    }
    return O;
  }
  function gi(g, B) {
    return wr(g, tt(g), B);
  }
  function w(g) {
    return bs(g, Uc, tt);
  }
  function $(g, B) {
    var O = g.__data__;
    return Et(B) ? O[typeof B == "string" ? "string" : "hash"] : O.map;
  }
  function X(g, B) {
    var O = De(g, B);
    return ms(O) ? O : void 0;
  }
  var tt = ee ? _e(ee, Object) : hw, pt = fi;
  (Le && pt(new Le(new ArrayBuffer(1))) != J || Dt && pt(new Dt()) != y || ht && pt(ht.resolve()) != x || Kt && pt(new Kt()) != K || Zt && pt(new Zt()) != _) && (pt = function(g) {
    var B = $n.call(g), O = B == m ? g.constructor : void 0, ft = O ? Ft(O) : void 0;
    if (ft)
      switch (ft) {
        case oe:
          return J;
        case an:
          return y;
        case h:
          return x;
        case S:
          return K;
        case f:
          return _;
      }
    return B;
  });
  function G(g) {
    var B = g.length, O = g.constructor(B);
    return B && typeof g[0] == "string" && Ke.call(g, "index") && (O.index = g.index, O.input = g.input), O;
  }
  function P(g) {
    return typeof g.constructor == "function" && !Be(g) ? On(yt(g)) : {};
  }
  function j(g, B, O, ft) {
    var je = g.constructor;
    switch (B) {
      case M:
        return Br(g);
      case a:
      case c:
        return new je(+g);
      case J:
        return gr(g, ft);
      case et:
      case q:
      case Y:
      case v:
      case N:
      case b:
      case C:
      case D:
      case L:
        return hi(g, ft);
      case y:
        return Mr(g, ft, O);
      case p:
      case V:
        return new je(g);
      case T:
        return yr(g);
      case K:
        return di(g, ft, O);
      case E:
        return Nr(g);
    }
  }
  function ct(g, B) {
    return B = B ?? i, !!B && (typeof g == "number" || A.test(g)) && g > -1 && g % 1 == 0 && g < B;
  }
  function Et(g) {
    var B = typeof g;
    return B == "string" || B == "number" || B == "symbol" || B == "boolean" ? g !== "__proto__" : g === null;
  }
  function ve(g) {
    return !!Gt && Gt in g;
  }
  function Be(g) {
    var B = g && g.constructor, O = typeof B == "function" && B.prototype || Te;
    return g === O;
  }
  function Ft(g) {
    if (g != null) {
      try {
        return Jt.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function gn(g) {
    return Hn(g, !0, !0);
  }
  function xs(g, B) {
    return g === B || g !== g && B !== B;
  }
  function _c(g) {
    return lw(g) && Ke.call(g, "callee") && (!te.call(g, "callee") || $n.call(g) == s);
  }
  var Pr = Array.isArray;
  function Uf(g) {
    return g != null && fw(g.length) && !Hf(g);
  }
  function lw(g) {
    return dw(g) && Uf(g);
  }
  var uw = Yt || pw;
  function Hf(g) {
    var B = zo(g) ? $n.call(g) : "";
    return B == d || B == l;
  }
  function fw(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= i;
  }
  function zo(g) {
    var B = typeof g;
    return !!g && (B == "object" || B == "function");
  }
  function dw(g) {
    return !!g && typeof g == "object";
  }
  function Uc(g) {
    return Uf(g) ? ws(g) : be(g);
  }
  function hw() {
    return [];
  }
  function pw() {
    return !1;
  }
  t.exports = gn;
})(za, za.exports);
var px = za.exports;
const Zp = /* @__PURE__ */ A0(px);
var Tl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Tl || (Tl = {}));
function gx(t, e) {
  return { type: Tl.Address, version: t, hash160: e };
}
function yx(t) {
  return ri.c32address(t.version, t.hash160);
}
const wx = (t) => j2(Rp(t)), bx = (t) => bt(wx(t));
Ee.hmacSha256Sync = (t, ...e) => {
  const n = jp.create(Rp, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function mx(t, e = "mainnet") {
  e = Hp(e), t = typeof t == "string" ? Rt(t) : t;
  const n = N2(vr.P2PKH, e), r = gx(n, bx(t));
  return yx(r);
}
function xx(t, e) {
  const n = Ge.decodeToken(t), r = n.payload;
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
  const i = r.issuer.publicKey, s = mx(i);
  if (e !== i) {
    if (e !== s) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new Ge.TokenVerifier(n.header.alg, i);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function Sx(t, e = null) {
  let n;
  e ? n = xx(t, e) : n = Ge.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const i = n.payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    i.hasOwnProperty("claim") && (r = i.claim);
  }
  return r;
}
const _d = "_blockstackDidCheckEchoReply", Ex = "echoReply", Ax = "authContinuation";
function vx(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [i, s] = r.split("=");
    return n[i] = s ? decodeURIComponent(s.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function $x() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[_d];
  if (typeof e == "boolean")
    return e;
  const n = vx(t.location.search), r = n[Ex];
  if (r) {
    t[_d] = !0;
    const i = `echo-reply-${r}`;
    return t.localStorage.setItem(i, "success"), t.setTimeout(() => {
      const s = n[Ax];
      t.location.href = s;
    }, 10), !0;
  }
  return !1;
}
class Bl {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new M0();
    else
      throw new Gw("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new yd(e.sessionOptions) : this.store = new yd() : e ? this.store = new gd(e.sessionOptions) : this.store = new gd();
  }
  makeAuthRequestToken(e, n, r, i, s, o = Vw().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new wl("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), i = i || c.scopes, s = s || c.appDomain, u2(e, n, r, i, s, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = l2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = vu("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if ($x())
        return Ai.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Ai.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = gb()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Go("Existing user session found.");
    const i = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const s = Ge.decodeToken(e).payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await g2(e))
      throw new Go("Invalid authentication response.");
    let a = s.private_key, c = s.core_token;
    if (Dc(s.version, "1.1.0"))
      if (i !== void 0 && i != null) {
        if (s.private_key !== void 0 && s.private_key !== null)
          try {
            a = await hd(i, s.private_key);
          } catch {
            if (Ai.warn("Failed decryption of appPrivateKey, will try to use as given"), !Ee.isValidPrivateKey(s.private_key))
              throw new Go("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await hd(i, c);
          } catch {
            Ai.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Go("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = sb, d;
    Dc(s.version, "1.2.0") && s.hubUrl !== null && s.hubUrl !== void 0 && (u = s.hubUrl), Dc(s.version, "1.3.0") && s.associationToken !== null && s.associationToken !== void 0 && (d = s.associationToken);
    const l = {
      profile: s.profile,
      email: s.email,
      decentralizedID: s.iss,
      identityAddress: Pp(s.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: s.appPrivateKeyFromWalletSalt,
      coreNode: s.blockstackAPIUrl,
      gaiaAssociationToken: d
    }, y = s.profile_url;
    if (!l.profile && y) {
      const p = await n(y);
      if (!p.ok)
        l.profile = Object.assign({}, jw);
      else {
        const m = await p.text(), x = JSON.parse(m);
        l.profile = Sx(x[0].token);
      }
    } else
      l.profile = s.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new wl("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), s1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), i1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
Bl.prototype.makeAuthRequest = Bl.prototype.makeAuthRequestToken;
const kx = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Ix = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = kx(), n = t.filter((r) => e.find((s) => s.id === r.id) ? !1 : !!mc(r.id));
  return e.concat(n);
}, mc = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Qp = "STX_PROVIDER", Fs = () => typeof window > "u" ? null : window.localStorage.getItem(Qp), Lx = (t) => {
  typeof window < "u" && window.localStorage.setItem(Qp, t);
}, Cx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Tx(t, e) {
  const n = {};
  return Object.assign(n, Cx, e), await fetch(t, n);
}
function Bx(t) {
  let e = Tx, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Mx(...t) {
  const { fetchLib: e, middlewares: n } = Bx(t);
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
var zi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(zi || (zi = {}));
var js;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(js || (js = {}));
var Ud;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ud || (Ud = {}));
const Nx = "https://api.mainnet.hiro.so", Px = "https://api.testnet.hiro.so", _x = "http://localhost:3999", Ux = ["mainnet", "testnet", "devnet", "mocknet"];
class zs {
  constructor(e) {
    this.version = js.Mainnet, this.chainId = zi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === js.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, i) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${i}?proof=0`, this.getMapEntryUrl = (n, r, i) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${i}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Mx();
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
zs.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Ml();
    case "testnet":
      return new Nl();
    case "devnet":
      return new Hx();
    case "mocknet":
      return new Jp();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Ux.join(", ")}`);
  }
};
zs.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : zs.fromName(t);
class Ml extends zs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Nx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = js.Mainnet, this.chainId = zi.Mainnet;
  }
}
class Nl extends zs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Px,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = js.Testnet, this.chainId = zi.Testnet;
  }
}
class Jp extends zs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? _x,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = js.Testnet, this.chainId = zi.Testnet;
  }
}
const Hx = Jp;
var Rs;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Rs || (Rs = {}));
var Ra;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ra || (Ra = {}));
Rs.Mainnet;
var Gs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Gs || (Gs = {}));
var Ks;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ks || (Ks = {}));
Gs.Mainnet;
const Ox = {
  chainId: Rs.Mainnet,
  transactionVersion: Gs.Mainnet,
  peerNetworkId: Ra.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Ks.MainnetSingleSig,
    multiSig: Ks.MainnetMultiSig
  },
  client: { baseUrl: C0 }
}, Pl = {
  chainId: Rs.Testnet,
  transactionVersion: Gs.Testnet,
  peerNetworkId: Ra.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Ks.TestnetSingleSig,
    multiSig: Ks.TestnetMultiSig
  },
  client: { baseUrl: T0 }
}, ka = {
  ...Pl,
  addressVersion: { ...Pl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: B0 }
}, Dx = {
  ...ka,
  addressVersion: { ...ka.addressVersion },
  client: { ...ka.client }
};
function Fx(t) {
  switch (t) {
    case "mainnet":
      return Ox;
    case "testnet":
      return Pl;
    case "devnet":
      return ka;
    case "mocknet":
      return Dx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function jx(t) {
  return typeof t == "string" ? Fx(t) : t;
}
function zx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Hd = /* @__PURE__ */ new Map();
function tg(t, e) {
  const n = Hd.get(t);
  if (n !== void 0)
    return n(e);
  const r = zx(t);
  return Hd.set(t, r), tg(t, e);
}
let se = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Rt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return fb(this.readBytes(4), 0);
  }
  readUInt8() {
    return lb(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return ab(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = bt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = bt(n);
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
const Rx = 128, Gx = 128, eg = 16, Bs = 32, _l = 80, xc = 65, Kx = 32, Vx = 64, Ga = 34, qx = 1 + 16 * 1024 * 1024, Wx = 165, Xx = 16, Yx = 16, Zx = 20, Qx = Yx + 2 + Zx, Jx = Qx + 4, tS = qx + (Wx + Xx * Jx);
var Xt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Xt || (Xt = {}));
var Ul;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Ul || (Ul = {}));
var wn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(wn || (wn = {}));
const Vc = ["onChainOnly", "offChainOnly", "any"];
Vc[0] + "", wn.OnChainOnly, Vc[1] + "", wn.OffChainOnly, Vc[2] + "", wn.Any, wn.OnChainOnly + "", wn.OnChainOnly, wn.OffChainOnly + "", wn.OffChainOnly, wn.Any + "", wn.Any;
var Ka;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Ka || (Ka = {}));
var le;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(le || (le = {}));
var xe;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(xe || (xe = {}));
var ne;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ne || (ne = {}));
var pe;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(pe || (pe = {}));
var bo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(bo || (bo = {}));
var Hl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Hl || (Hl = {}));
var Ol;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Ol || (Ol = {}));
var en;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(en || (en = {}));
var Od;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Od || (Od = {}));
var Dl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Dl || (Dl = {}));
var zn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(zn || (zn = {}));
var Dd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Dd || (Dd = {}));
let Sc = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, vi = class extends Sc {
  constructor(e) {
    super(e);
  }
}, Je = class extends Sc {
  constructor(e) {
    super(e);
  }
}, Va = class extends Sc {
  constructor(e) {
    super(e);
  }
}, ks = class extends Sc {
  constructor(e) {
    super(e);
  }
};
function Fl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function eS(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function ng(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function nS(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Fl(t.outputLen), Fl(t.blockLen);
}
function rS(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function sS(t, e) {
  ng(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Is = {
  number: Fl,
  bool: eS,
  bytes: ng,
  hash: nS,
  exists: rS,
  output: sS
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const qc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Zn = (t, e) => t << 32 - e | t >>> e, iS = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!iS)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function oS(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ku(t) {
  if (typeof t == "string" && (t = oS(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let rg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function si(t) {
  const e = (r) => t().update(Ku(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let sg = class extends rg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Is.hash(e);
    const r = Ku(n);
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
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const ig = (t, e, n) => new sg(t, e).update(n).digest();
ig.create = (t, e) => new sg(t, e);
function aS(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Vu = class extends rg {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = qc(this.buffer);
  }
  update(e) {
    Is.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Ku(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = qc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Is.exists(this), Is.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    aS(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = qc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
const cS = (t, e, n) => t & e ^ ~t & n, lS = (t, e, n) => t & e ^ t & n ^ e & n, uS = new Uint32Array([
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
]), Vr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), qr = new Uint32Array(64);
let og = class extends Vu {
  constructor() {
    super(64, 32, 8, !1), this.A = Vr[0] | 0, this.B = Vr[1] | 0, this.C = Vr[2] | 0, this.D = Vr[3] | 0, this.E = Vr[4] | 0, this.F = Vr[5] | 0, this.G = Vr[6] | 0, this.H = Vr[7] | 0;
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
      qr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = qr[l - 15], p = qr[l - 2], m = Zn(y, 7) ^ Zn(y, 18) ^ y >>> 3, x = Zn(p, 17) ^ Zn(p, 19) ^ p >>> 10;
      qr[l] = x + qr[l - 7] + m + qr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Zn(a, 6) ^ Zn(a, 11) ^ Zn(a, 25), p = d + y + cS(a, c, u) + uS[l] + qr[l] | 0, x = (Zn(r, 2) ^ Zn(r, 13) ^ Zn(r, 22)) + lS(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    qr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, fS = class extends og {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const qu = si(() => new og());
si(() => new fS());
const dS = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ag = Uint8Array.from({ length: 16 }, (t, e) => e), hS = ag.map((t) => (9 * t + 5) % 16);
let Wu = [ag], Xu = [hS];
for (let t = 0; t < 4; t++)
  for (let e of [Wu, Xu])
    e.push(e[t].map((n) => dS[n]));
const cg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), pS = Wu.map((t, e) => t.map((n) => cg[e][n])), gS = Xu.map((t, e) => t.map((n) => cg[e][n])), yS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), wS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ra = (t, e) => t << e | t >>> 32 - e;
function Fd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const sa = new Uint32Array(16);
let bS = class extends Vu {
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
      sa[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const m = 4 - p, x = yS[p], T = wS[p], K = Wu[p], V = Xu[p], E = pS[p], _ = gS[p];
      for (let M = 0; M < 16; M++) {
        const J = ra(r + Fd(p, s, a, u) + sa[K[M]] + x, E[M]) + l | 0;
        r = l, l = u, u = ra(a, 10) | 0, a = s, s = J;
      }
      for (let M = 0; M < 16; M++) {
        const J = ra(i + Fd(m, o, c, d) + sa[V[M]] + T, _[M]) + y | 0;
        i = y, y = d, d = ra(c, 10) | 0, c = o, o = J;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    sa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const mS = si(() => new bS()), ia = BigInt(2 ** 32 - 1), jl = BigInt(32);
function lg(t, e = !1) {
  return e ? { h: Number(t & ia), l: Number(t >> jl & ia) } : { h: Number(t >> jl & ia) | 0, l: Number(t & ia) | 0 };
}
function xS(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = lg(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const SS = (t, e) => BigInt(t >>> 0) << jl | BigInt(e >>> 0), ES = (t, e, n) => t >>> n, AS = (t, e, n) => t << 32 - n | e >>> n, vS = (t, e, n) => t >>> n | e << 32 - n, $S = (t, e, n) => t << 32 - n | e >>> n, kS = (t, e, n) => t << 64 - n | e >>> n - 32, IS = (t, e, n) => t >>> n - 32 | e << 64 - n, LS = (t, e) => e, CS = (t, e) => t, TS = (t, e, n) => t << n | e >>> 32 - n, BS = (t, e, n) => e << n | t >>> 32 - n, MS = (t, e, n) => e << n - 32 | t >>> 64 - n, NS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function PS(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const _S = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), US = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, HS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), OS = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, DS = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), FS = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Lt = {
  fromBig: lg,
  split: xS,
  toBig: SS,
  shrSH: ES,
  shrSL: AS,
  rotrSH: vS,
  rotrSL: $S,
  rotrBH: kS,
  rotrBL: IS,
  rotr32H: LS,
  rotr32L: CS,
  rotlSH: TS,
  rotlSL: BS,
  rotlBH: MS,
  rotlBL: NS,
  add: PS,
  add3L: _S,
  add3H: US,
  add4L: HS,
  add4H: OS,
  add5H: FS,
  add5L: DS
}, [jS, zS] = Lt.split([
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
].map((t) => BigInt(t))), Wr = new Uint32Array(80), Xr = new Uint32Array(80);
let Ec = class extends Vu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: m, Hh: x, Hl: T } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, y, p, m, x, T];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, y, p, m, x, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = m | 0, this.Hh = x | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Wr[E] = e.getUint32(n), Xr[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const _ = Wr[E - 15] | 0, M = Xr[E - 15] | 0, J = Lt.rotrSH(_, M, 1) ^ Lt.rotrSH(_, M, 8) ^ Lt.shrSH(_, M, 7), et = Lt.rotrSL(_, M, 1) ^ Lt.rotrSL(_, M, 8) ^ Lt.shrSL(_, M, 7), q = Wr[E - 2] | 0, Y = Xr[E - 2] | 0, v = Lt.rotrSH(q, Y, 19) ^ Lt.rotrBH(q, Y, 61) ^ Lt.shrSH(q, Y, 6), N = Lt.rotrSL(q, Y, 19) ^ Lt.rotrBL(q, Y, 61) ^ Lt.shrSL(q, Y, 6), b = Lt.add4L(et, N, Xr[E - 7], Xr[E - 16]), C = Lt.add4H(b, J, v, Wr[E - 7], Wr[E - 16]);
      Wr[E] = C | 0, Xr[E] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: m, Gh: x, Gl: T, Hh: K, Hl: V } = this;
    for (let E = 0; E < 80; E++) {
      const _ = Lt.rotrSH(l, y, 14) ^ Lt.rotrSH(l, y, 18) ^ Lt.rotrBH(l, y, 41), M = Lt.rotrSL(l, y, 14) ^ Lt.rotrSL(l, y, 18) ^ Lt.rotrBL(l, y, 41), J = l & p ^ ~l & x, et = y & m ^ ~y & T, q = Lt.add5L(V, M, et, zS[E], Xr[E]), Y = Lt.add5H(q, K, _, J, jS[E], Wr[E]), v = q | 0, N = Lt.rotrSH(r, i, 28) ^ Lt.rotrBH(r, i, 34) ^ Lt.rotrBH(r, i, 39), b = Lt.rotrSL(r, i, 28) ^ Lt.rotrBL(r, i, 34) ^ Lt.rotrBL(r, i, 39), C = r & s ^ r & a ^ s & a, D = i & o ^ i & c ^ o & c;
      K = x | 0, V = T | 0, x = p | 0, T = m | 0, p = l | 0, m = y | 0, { h: l, l: y } = Lt.add(u | 0, d | 0, Y | 0, v | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const L = Lt.add3L(v, b, D);
      r = Lt.add3H(L, Y, N, C), i = L | 0;
    }
    ({ h: r, l: i } = Lt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Lt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Lt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Lt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = Lt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: m } = Lt.add(this.Fh | 0, this.Fl | 0, p | 0, m | 0), { h: x, l: T } = Lt.add(this.Gh | 0, this.Gl | 0, x | 0, T | 0), { h: K, l: V } = Lt.add(this.Hh | 0, this.Hl | 0, K | 0, V | 0), this.set(r, i, s, o, a, c, u, d, l, y, p, m, x, T, K, V);
  }
  roundClean() {
    Wr.fill(0), Xr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, RS = class extends Ec {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, GS = class extends Ec {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, KS = class extends Ec {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
si(() => new Ec());
si(() => new RS());
const VS = si(() => new GS());
si(() => new KS());
var Ht;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Ht || (Ht = {}));
var Me;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Me || (Me = {}));
function Yu(t) {
  return Me[t];
}
const qS = () => ({ type: Ht.BoolTrue }), WS = () => ({ type: Ht.BoolFalse }), XS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Ht.Buffer, value: bt(t) };
}, jd = BigInt("0xffffffffffffffffffffffffffffffff"), YS = BigInt(0), zd = BigInt("0x7fffffffffffffffffffffffffffffff"), Rd = BigInt("-170141183460469231731687303715884105728"), ZS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = ml(Rt(t))), dn(t, Uint8Array) && (t = ml(t));
  const e = Xe(t);
  if (e > zd)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${zd}`);
  if (e < Rd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Rd}`);
  return { type: Ht.Int, value: e };
}, QS = (t) => {
  const e = Xe(t);
  if (e < YS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > jd)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${jd}`);
  return { type: Ht.UInt, value: e };
};
function JS(t) {
  return { type: Ht.List, value: t };
}
function ug() {
  return { type: Ht.OptionalNone };
}
function fg(t) {
  return { type: Ht.OptionalSome, value: t };
}
var rt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(rt || (rt = {}));
function t3() {
  return {
    type: rt.Address,
    version: Ks.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Gd(t) {
  if (t && xg(t, Ga))
    throw new Error(`Memo exceeds maximum length of ${Ga} bytes`);
  return { type: rt.MemoString, content: t };
}
function Zu(t, e) {
  return {
    type: rt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function zl(t) {
  if (Rt(t).byteLength != xc)
    throw Error("Invalid signature");
  return {
    type: rt.MessageSignature,
    data: t
  };
}
function e3(t, e, n) {
  return typeof t == "string" && (t = w3(t)), typeof n == "string" && (n = Gd(n)), {
    type: rt.Payload,
    payloadType: Xt.TokenTransfer,
    recipient: t,
    amount: Xe(e),
    memo: n ?? Gd("")
  };
}
function n3(t, e, n, r) {
  return typeof e == "string" && (e = Kn(e)), typeof n == "string" && (n = Kn(n)), {
    type: rt.Payload,
    payloadType: Xt.ContractCall,
    contractAddress: typeof t == "string" ? ps(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function r3(t) {
  return Kn(t, 4, 1e5);
}
function Kd(t, e, n) {
  return typeof t == "string" && (t = Kn(t)), typeof e == "string" && (e = r3(e)), typeof n == "number" ? {
    type: rt.Payload,
    payloadType: Xt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: rt.Payload,
    payloadType: Xt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function s3() {
  return { type: rt.Payload, payloadType: Xt.PoisonMicroblock };
}
function Vd(t, e) {
  if (t.byteLength != Bs)
    throw Error(`Coinbase buffer size must be ${Bs} bytes`);
  return e != null ? {
    type: rt.Payload,
    payloadType: Xt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: rt.Payload,
    payloadType: Xt.Coinbase,
    coinbaseBytes: t
  };
}
function i3(t, e, n) {
  if (t.byteLength != Bs)
    throw Error(`Coinbase buffer size must be ${Bs} bytes`);
  if (n.byteLength != _l)
    throw Error(`VRF proof buffer size must be ${_l} bytes`);
  return {
    type: rt.Payload,
    payloadType: Xt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Ht.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function o3(t, e, n, r, i, s, o) {
  return {
    type: rt.Payload,
    payloadType: Xt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: i,
    cause: s,
    publicKeyHash: o
  };
}
function Kn(t, e, n) {
  const r = e || 1, i = n || Rx;
  if (xg(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: rt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function a3(t, e, n) {
  return {
    type: rt.Asset,
    address: ps(t),
    contractName: Kn(e),
    assetName: Kn(n)
  };
}
function ps(t) {
  const e = ri.c32addressDecode(t);
  return {
    type: rt.Address,
    version: e[0],
    hash160: e[1]
  };
}
function c3(t, e) {
  const n = ps(t), r = Kn(e);
  return {
    type: rt.Principal,
    prefix: en.Contract,
    address: n,
    contractName: r
  };
}
function l3(t) {
  const e = ps(t);
  return {
    type: rt.Principal,
    prefix: en.Standard,
    address: e
  };
}
function $i(t, e) {
  return {
    pubKeyEncoding: t,
    type: rt.TransactionAuthField,
    contents: e
  };
}
function Er(t) {
  switch (t.type) {
    case rt.Address:
      return Do(t);
    case rt.Principal:
      return dg(t);
    case rt.LengthPrefixedString:
      return Gi(t);
    case rt.MemoString:
      return f3(t);
    case rt.Asset:
      return pg(t);
    case rt.PostCondition:
      return yg(t);
    case rt.PublicKey:
      return Kl(t);
    case rt.LengthPrefixedList:
      return Qu(t);
    case rt.Payload:
      return wg(t);
    case rt.TransactionAuthField:
      return y3(t);
    case rt.MessageSignature:
      return Ju(t);
  }
}
function Do(t) {
  const e = [];
  return e.push(Rt(No(t.version, 1))), e.push(Rt(t.hash160)), ke(e);
}
function Ri(t) {
  const e = dn(t, se) ? t : new se(t), n = ac(bt(e.readBytes(1))), r = bt(e.readBytes(20));
  return { type: rt.Address, version: n, hash160: r };
}
function dg(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === en.Standard || t.prefix === en.Contract) && e.push(Do(t.address)), t.prefix === en.Contract && e.push(Gi(t.contractName)), ke(e);
}
function u3(t) {
  const e = dn(t, se) ? t : new se(t), n = e.readUInt8Enum(en, (s) => {
    throw new Je(`Unexpected Principal payload type: ${s}`);
  });
  if (n === en.Origin)
    return { type: rt.Principal, prefix: n };
  const r = Ri(e);
  if (n === en.Standard)
    return { type: rt.Principal, prefix: n, address: r };
  const i = Tn(e);
  return {
    type: rt.Principal,
    prefix: n,
    address: r,
    contractName: i
  };
}
function Gi(t) {
  const e = [], n = Js(t.content), r = n.byteLength;
  return e.push(Rt(No(r, t.lengthPrefixBytes))), e.push(n), ke(e);
}
function Tn(t, e, n) {
  e = e || 1;
  const r = dn(t, se) ? t : new se(t), i = ac(bt(r.readBytes(e))), s = Po(r.readBytes(i));
  return Kn(s, e, n ?? 128);
}
function f3(t) {
  const e = [], n = Js(t.content), r = D3(bt(n), Ga * 2);
  return e.push(Rt(r)), ke(e);
}
function hg(t) {
  const e = dn(t, se) ? t : new se(t);
  let n = Po(e.readBytes(Ga));
  return n = n.replace(/\u0000*$/, ""), { type: rt.MemoString, content: n };
}
function pg(t) {
  const e = [];
  return e.push(Do(t.address)), e.push(Gi(t.contractName)), e.push(Gi(t.assetName)), ke(e);
}
function Rl(t) {
  const e = dn(t, se) ? t : new se(t);
  return {
    type: rt.Asset,
    address: Ri(e),
    contractName: Tn(e),
    assetName: Tn(e)
  };
}
function Qu(t) {
  const e = t.values, n = [];
  n.push(Rt(No(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Er(r));
  return ke(n);
}
function gg(t, e, n) {
  const r = dn(t, se) ? t : new se(t), i = ac(bt(r.readBytes(4))), s = [];
  for (let o = 0; o < i; o++)
    switch (e) {
      case rt.Address:
        s.push(Ri(r));
        break;
      case rt.LengthPrefixedString:
        s.push(Tn(r));
        break;
      case rt.MemoString:
        s.push(hg(r));
        break;
      case rt.Asset:
        s.push(Rl(r));
        break;
      case rt.PostCondition:
        s.push(h3(r));
        break;
      case rt.PublicKey:
        s.push(Vl(r));
        break;
      case rt.TransactionAuthField:
        s.push(g3(r));
        break;
    }
  return Zu(s, n);
}
function d3(t) {
  return bt(yg(t));
}
function yg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(dg(t.principal)), (t.conditionType === le.Fungible || t.conditionType === le.NonFungible) && e.push(pg(t.asset)), t.conditionType === le.NonFungible && e.push(ir(t.assetName)), e.push(t.conditionCode), t.conditionType === le.STX || t.conditionType === le.Fungible || t.conditionType === le.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new vi("The post-condition amount may not be larger than 8 bytes");
    e.push(ds(t.amount, 8));
  }
  return ke(e);
}
function h3(t) {
  const e = dn(t, se) ? t : new se(t), n = e.readUInt8Enum(le, (a) => {
    throw new Je(`Could not read ${a} as PostConditionType`);
  }), r = u3(e);
  let i, s, o;
  switch (n) {
    case le.STX:
      return i = e.readUInt8Enum(bo, (c) => {
        throw new Je(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${bt(e.readBytes(8))}`), {
        type: rt.PostCondition,
        conditionType: le.STX,
        principal: r,
        conditionCode: i,
        amount: o
      };
    case le.Fungible:
      return s = Rl(e), i = e.readUInt8Enum(bo, (c) => {
        throw new Je(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${bt(e.readBytes(8))}`), {
        type: rt.PostCondition,
        conditionType: le.Fungible,
        principal: r,
        conditionCode: i,
        amount: o,
        asset: s
      };
    case le.NonFungible:
      s = Rl(e);
      const a = nr(e);
      return i = e.readUInt8Enum(Hl, (c) => {
        throw new Je(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: rt.PostCondition,
        conditionType: le.NonFungible,
        principal: r,
        conditionCode: i,
        asset: s,
        assetName: a
      };
    case le.Staking:
      return i = e.readUInt8Enum(bo, (c) => {
        throw new Je(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${bt(e.readBytes(8))}`), {
        type: rt.PostCondition,
        conditionType: le.Staking,
        principal: r,
        conditionCode: i,
        amount: o
      };
    case le.PoX: {
      const c = e.readUInt8Enum(Ol, (u) => {
        throw new Je(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: rt.PostCondition,
        conditionType: le.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function wg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Xt.TokenTransfer:
      e.push(ir(t.recipient)), e.push(ds(t.amount, 8)), e.push(Er(t.memo));
      break;
    case Xt.ContractCall:
      e.push(Er(t.contractAddress)), e.push(Er(t.contractName)), e.push(Er(t.functionName));
      const n = new Uint8Array(4);
      _s(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(ir(r));
      });
      break;
    case Xt.SmartContract:
      e.push(Er(t.contractName)), e.push(Er(t.codeBody));
      break;
    case Xt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Er(t.contractName)), e.push(Er(t.codeBody));
      break;
    case Xt.PoisonMicroblock:
      break;
    case Xt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Xt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(ir(t.recipient));
      break;
    case Xt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(ir(t.recipient ? fg(t.recipient) : ug())), e.push(t.vrfProof);
      break;
    case Xt.TenureChange:
      e.push(Rt(t.tenureHash)), e.push(Rt(t.previousTenureHash)), e.push(Rt(t.burnViewHash)), e.push(Rt(t.previousTenureEnd)), e.push(_s(new Uint8Array(4), t.previousTenureBlocks)), e.push(ub(new Uint8Array(1), t.cause)), e.push(Rt(t.publicKeyHash));
      break;
  }
  return ke(e);
}
function p3(t) {
  const e = dn(t, se) ? t : new se(t);
  switch (e.readUInt8Enum(Xt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Xt.TokenTransfer:
      const r = nr(e), i = Xe(e.readBytes(8)), s = hg(e);
      return e3(r, i, s);
    case Xt.ContractCall:
      const o = Ri(e), a = Tn(e), c = Tn(e), u = [], d = e.readUInt32BE();
      for (let _ = 0; _ < d; _++) {
        const M = nr(e);
        u.push(M);
      }
      return n3(o, a, c, u);
    case Xt.SmartContract:
      const l = Tn(e), y = Tn(e, 4, 1e5);
      return Kd(l, y);
    case Xt.VersionedSmartContract: {
      const _ = e.readUInt8Enum(Ul, (et) => {
        throw new Error(`Cannot recognize ClarityVersion: ${et}`);
      }), M = Tn(e), J = Tn(e, 4, tS);
      return Kd(M, J, _);
    }
    case Xt.PoisonMicroblock:
      return s3();
    case Xt.Coinbase: {
      const _ = e.readBytes(Bs);
      return Vd(_);
    }
    case Xt.CoinbaseToAltRecipient: {
      const _ = e.readBytes(Bs), M = nr(e);
      return Vd(_, M);
    }
    case Xt.NakamotoCoinbase: {
      const _ = e.readBytes(Bs), M = nr(e), J = e.readBytes(_l);
      return i3(_, M, J);
    }
    case Xt.TenureChange:
      const p = bt(e.readBytes(20)), m = bt(e.readBytes(20)), x = bt(e.readBytes(20)), T = bt(e.readBytes(32)), K = e.readUInt32BE(), V = e.readUInt8Enum(Dl, (_) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${_}`);
      }), E = bt(e.readBytes(20));
      return o3(p, m, x, T, K, V, E);
  }
}
function Gl(t) {
  const e = dn(t, se) ? t : new se(t);
  return zl(bt(e.readBytes(xc)));
}
function g3(t) {
  const e = dn(t, se) ? t : new se(t), n = e.readUInt8Enum(zn, (r) => {
    throw new Je(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case zn.PublicKeyCompressed:
      return $i(pe.Compressed, Vl(e));
    case zn.PublicKeyUncompressed:
      return $i(pe.Uncompressed, Qi(Y3(Vl(e).data)));
    case zn.SignatureCompressed:
      return $i(pe.Compressed, Gl(e));
    case zn.SignatureUncompressed:
      return $i(pe.Uncompressed, Gl(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Ju(t) {
  return Rt(t.data);
}
function y3(t) {
  const e = [];
  switch (t.contents.type) {
    case rt.PublicKey:
      e.push(t.pubKeyEncoding === pe.Compressed ? zn.PublicKeyCompressed : zn.PublicKeyUncompressed), e.push(Rt(X3(t.contents.data)));
      break;
    case rt.MessageSignature:
      e.push(t.pubKeyEncoding === pe.Compressed ? zn.SignatureCompressed : zn.SignatureUncompressed), e.push(Ju(t.contents));
      break;
  }
  return ke(e);
}
function Kl(t) {
  return t.data.slice();
}
function Vl(t) {
  const e = dn(t, se) ? t : new se(t), n = e.readUInt8(), r = n === 4 ? Vx : Kx;
  return Qi(ke([n, e.readBytes(r)]));
}
function tf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ne.P2PKH || e === ne.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ne.P2WPKH || e === ne.P2WSH || e === ne.P2WSHNonSequential) && !r.map((i) => i.data).every(Ji))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ne.P2PKH:
      return oa(t, F3(r[0].data));
    case ne.P2WPKH:
      return oa(t, j3(r[0].data));
    case ne.P2SH:
    case ne.P2SHNonSequential:
      return oa(t, z3(n, r.map(Kl)));
    case ne.P2WSH:
    case ne.P2WSHNonSequential:
      return oa(t, R3(n, r.map(Kl)));
  }
}
function oa(t, e) {
  return { type: rt.Address, version: t, hash160: e };
}
function ef(t) {
  return ri.c32address(t.version, t.hash160);
}
function qd(t) {
  const [e, n, r] = t.split(/\.|::/);
  return a3(e, n, r);
}
function ao(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return c3(e, n);
  } else
    return l3(t);
}
function w3(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return x3(e, n);
  } else
    return b3(t);
}
function b3(t) {
  const e = ps(t);
  return { type: Ht.PrincipalStandard, value: ef(e) };
}
function m3(t) {
  return { type: Ht.PrincipalStandard, value: ef(t) };
}
function x3(t, e) {
  const n = ps(t), r = Kn(e);
  return bg(n, r);
}
function bg(t, e) {
  if (Js(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Ht.PrincipalContract,
    value: `${ef(t)}.${e.content}`
  };
}
function S3(t) {
  return { type: Ht.ResponseErr, value: t };
}
function E3(t) {
  return { type: Ht.ResponseOk, value: t };
}
const A3 = (t) => ({ type: Ht.StringASCII, value: t }), v3 = (t) => ({ type: Ht.StringUTF8, value: t });
function $3(t) {
  for (const e in t)
    if (!G3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Ht.Tuple, value: t };
}
function nr(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new se(Rt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new se(t) : e = t;
  switch (e.readUInt8Enum(Me, (r) => {
    throw new Je(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Me.int:
      return ZS(ml(e.readBytes(16)));
    case Me.uint:
      return QS(e.readBytes(16));
    case Me.buffer:
      const r = e.readUInt32BE();
      return XS(e.readBytes(r));
    case Me.true:
      return qS();
    case Me.false:
      return WS();
    case Me.address:
      const i = Ri(e);
      return m3(i);
    case Me.contract:
      const s = Ri(e), o = Tn(e);
      return bg(s, o);
    case Me.ok:
      return E3(nr(e));
    case Me.err:
      return S3(nr(e));
    case Me.none:
      return ug();
    case Me.some:
      return fg(nr(e));
    case Me.list:
      const a = e.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(nr(e));
      return JS(c);
    case Me.tuple:
      const u = e.readUInt32BE(), d = {};
      for (let x = 0; x < u; x++) {
        const T = Tn(e).content;
        if (T === void 0)
          throw new Je('"content" is undefined');
        d[T] = nr(e);
      }
      return $3(d);
    case Me.ascii:
      const l = e.readUInt32BE(), y = nb(e.readBytes(l));
      return A3(y);
    case Me.utf8:
      const p = e.readUInt32BE(), m = Po(e.readBytes(p));
      return v3(m);
    default:
      throw new Je("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function ur(t, e) {
  return ke([Yu(t), e]);
}
function k3(t) {
  return new Uint8Array([Yu(t.type)]);
}
function I3(t) {
  return t.type === Ht.OptionalNone ? new Uint8Array([Yu(t.type)]) : ur(t.type, ir(t.value));
}
function L3(t) {
  const e = new Uint8Array(4);
  return _s(e, Math.ceil(t.value.length / 2), 0), ur(t.type, cr(e, Rt(t.value)));
}
function C3(t) {
  const e = $u(Zw(BigInt(t.value), BigInt(Gx)), eg);
  return ur(t.type, e);
}
function T3(t) {
  const e = $u(BigInt(t.value), eg);
  return ur(t.type, e);
}
function B3(t) {
  return ur(t.type, Do(ps(t.value)));
}
function M3(t) {
  const [e, n] = K3(t.value);
  return ur(t.type, cr(Do(ps(e)), Gi(Kn(n))));
}
function N3(t) {
  return ur(t.type, ir(t.value));
}
function P3(t) {
  const e = [], n = new Uint8Array(4);
  _s(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const i = ir(r);
    e.push(i);
  }
  return ur(t.type, ke(e));
}
function _3(t) {
  const e = [], n = new Uint8Array(4);
  _s(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = Kn(i);
    e.push(Gi(s));
    const o = ir(t.value[i]);
    e.push(o);
  }
  return ur(t.type, ke(e));
}
function mg(t, e) {
  const n = [], r = e == "ascii" ? eb(t.value) : Js(t.value), i = new Uint8Array(4);
  return _s(i, r.length, 0), n.push(i), n.push(r), ur(t.type, ke(n));
}
function U3(t) {
  return mg(t, "ascii");
}
function H3(t) {
  return mg(t, "utf8");
}
function Wd(t) {
  return bt(ir(t));
}
function ir(t) {
  switch (t.type) {
    case Ht.BoolTrue:
    case Ht.BoolFalse:
      return k3(t);
    case Ht.OptionalNone:
    case Ht.OptionalSome:
      return I3(t);
    case Ht.Buffer:
      return L3(t);
    case Ht.UInt:
      return T3(t);
    case Ht.Int:
      return C3(t);
    case Ht.PrincipalStandard:
      return B3(t);
    case Ht.PrincipalContract:
      return M3(t);
    case Ht.ResponseOk:
    case Ht.ResponseErr:
      return N3(t);
    case Ht.List:
      return P3(t);
    case Ht.Tuple:
      return _3(t);
    case Ht.StringASCII:
      return U3(t);
    case Ht.StringUTF8:
      return H3(t);
    default:
      throw new vi("Unable to serialize. Invalid Clarity Value.");
  }
}
const O3 = (t) => t.length % 2 ? `0${t}` : t, D3 = (t, e) => t.padEnd(e, "0"), xg = (t, e) => t ? Js(t).length > e : !1;
function ql(t) {
  return Zp(t);
}
const Ao = (t) => mS(qu(t)), nf = (t) => bt(VS(t)), F3 = (t) => bt(Ao(t)), j3 = (t) => {
  const e = Ao(t), n = cr(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Ao(n);
  return bt(r);
}, z3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + e.length), n.push(174);
  const r = ke(n), i = Ao(r);
  return bt(i);
}, R3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = ke(n), i = qu(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = ke(s), a = Ao(o);
  return bt(a);
};
function G3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function K3(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Ee.hmacSha256Sync = (t, ...e) => {
  const n = ig.create(qu, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Qi(t) {
  return t = typeof t == "string" ? Rt(t) : t, {
    type: rt.PublicKey,
    data: t
  };
}
function V3(t, e, n = pe.Compressed) {
  const r = ob(e), i = new En(Wf(r.r), Wf(r.s)), s = Nt.fromSignature(t, i, r.recoveryId), o = n === pe.Compressed;
  return s.toHex(o);
}
function q3(t) {
  return typeof t == "string" ? t : bt(t);
}
const rf = q3;
function Sg(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === ib;
}
function Ji(t) {
  return !rf(t).startsWith("04");
}
function W3(t) {
  t = ku(t);
  const e = Sg(t);
  return bt(_o(t.slice(0, 32), e));
}
function X3(t) {
  return Nt.fromHex(rf(t)).toHex(!0);
}
function Y3(t) {
  return Nt.fromHex(rf(t)).toHex(!1);
}
function Z3(t, e) {
  t = ku(t);
  const [n, r] = lc(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return No(r, 1) + En.fromHex(n).toCompactHex();
}
function sf() {
  return {
    type: rt.MessageSignature,
    data: bt(new Uint8Array(xc))
  };
}
function Eg(t, e, n, r) {
  const i = tf(0, t, 1, [Qi(e)]).hash160, s = Ji(e) ? pe.Compressed : pe.Uncompressed;
  return {
    hashMode: t,
    signer: i,
    nonce: Xe(n),
    fee: Xe(r),
    keyEncoding: s,
    signature: sf()
  };
}
function vo(t) {
  return "signature" in t;
}
function Xd(t) {
  return t === ne.P2SH || t === ne.P2WSH;
}
function Q3(t) {
  return t === ne.P2SHNonSequential || t === ne.P2WSHNonSequential;
}
function Yd(t) {
  const e = ql(t);
  return e.nonce = 0, e.fee = 0, vo(e) ? e.signature = sf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function J3(t) {
  const e = [
    t.hashMode,
    Rt(t.signer),
    ds(t.nonce, 8),
    ds(t.fee, 8),
    t.keyEncoding,
    Ju(t.signature)
  ];
  return ke(e);
}
function tE(t) {
  const e = [
    t.hashMode,
    Rt(t.signer),
    ds(t.nonce, 8),
    ds(t.fee, 8)
  ], n = Zu(t.fields);
  e.push(Qu(n));
  const r = new Uint8Array(2);
  return cb(r, t.signaturesRequired, 0), e.push(r), ke(e);
}
function eE(t, e) {
  const n = bt(e.readBytes(20)), r = BigInt(`0x${bt(e.readBytes(8))}`), i = BigInt(`0x${bt(e.readBytes(8))}`), s = e.readUInt8Enum(pe, (a) => {
    throw new Je(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ne.P2WPKH && s != pe.Compressed)
    throw new Je("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
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
function nE(t, e) {
  const n = bt(e.readBytes(20)), r = BigInt("0x" + bt(e.readBytes(8))), i = BigInt("0x" + bt(e.readBytes(8))), s = gg(e, rt.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case rt.PublicKey:
        Ji(u.contents.data) || (o = !0);
        break;
      case rt.MessageSignature:
        if (u.pubKeyEncoding === pe.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new ks("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ne.P2WSH || t === ne.P2WSHNonSequential))
    throw new ks("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: c
  };
}
function Wc(t) {
  return vo(t) ? J3(t) : tE(t);
}
function Xc(t) {
  const e = t.readUInt8Enum(ne, (n) => {
    throw new Je(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ne.P2PKH || e === ne.P2WPKH ? eE(e, t) : nE(e, t);
}
function Ag(t, e, n, r) {
  const s = t + bt(new Uint8Array([e])) + bt(ds(n, 8)) + bt(ds(r, 8));
  if (Rt(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return nf(Rt(s));
}
function vg(t, e, n) {
  const r = 33 + xc, i = Ji(e.data) ? pe.Compressed : pe.Uncompressed, s = t + O3(i.toString(16)) + n, o = Rt(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return nf(o);
}
function rE(t, e, n, r, i) {
  const s = Ag(t, e, n, r), o = Z3(i, s), a = Qi(W3(i)), c = vg(s, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function $g(t, e, n, r, i, s) {
  const o = Ag(t, e, n, r), a = Qi(V3(o, s, i)), c = vg(o, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function sE() {
  const t = Eg(ne.P2PKH, "", 0, 0);
  return t.signer = t3().hash160, t.keyEncoding = pe.Compressed, t.signature = sf(), t;
}
function Zd(t, e, n) {
  return vo(t) ? iE(t, e, n) : oE(t, e, n);
}
function iE(t, e, n) {
  const { pubKey: r, nextSigHash: i } = $g(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), s = tf(0, t.hashMode, 1, [r]).hash160;
  if (s !== t.signer)
    throw new ks(`Signer hash does not equal hash of public key(s): ${s} != ${t.signer}`);
  return i;
}
function oE(t, e, n) {
  const r = [];
  let i = e, s = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case rt.PublicKey:
        Ji(c.contents.data) || (s = !0), r.push(c.contents);
        break;
      case rt.MessageSignature:
        c.pubKeyEncoding === pe.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: d } = $g(i, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Xd(t.hashMode) && (i = d), r.push(u), o += 1, o === 65536)
          throw new ks("Too many signatures");
        break;
    }
  if (Xd(t.hashMode) && o !== t.signaturesRequired || Q3(t.hashMode) && o < t.signaturesRequired)
    throw new ks("Incorrect number of signatures");
  if (s && (t.hashMode === ne.P2WSH || t.hashMode === ne.P2WSHNonSequential))
    throw new ks("Uncompressed keys are not allowed in this hash mode");
  const a = tf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new ks(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return i;
}
function kg(t) {
  return {
    authType: xe.Standard,
    spendingCondition: t
  };
}
function Ig(t, e) {
  return {
    authType: xe.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Eg(ne.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Qd(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case xe.Standard:
        return kg(Yd(t.spendingCondition));
      case xe.Sponsored:
        return Ig(Yd(t.spendingCondition), sE());
      default:
        throw new Va("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function aE(t, e) {
  switch (t.authType) {
    case xe.Standard:
      return Zd(t.spendingCondition, e, xe.Standard);
    case xe.Sponsored:
      return Zd(t.spendingCondition, e, xe.Standard);
    default:
      throw new Va("Invalid origin auth type");
  }
}
function cE(t, e) {
  switch (t.authType) {
    case xe.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Xe(e)
      };
      return { ...t, spendingCondition: n };
    case xe.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Xe(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function lE(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Xe(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function uE(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Xe(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function fE(t, e) {
  const n = {
    ...e,
    nonce: Xe(e.nonce),
    fee: Xe(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function dE(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case xe.Standard:
      e.push(Wc(t.spendingCondition));
      break;
    case xe.Sponsored:
      e.push(Wc(t.spendingCondition)), e.push(Wc(t.sponsorSpendingCondition));
      break;
  }
  return ke(e);
}
function hE(t) {
  const e = t.readUInt8Enum(xe, (r) => {
    throw new Je(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case xe.Standard:
      return n = Xc(t), kg(n);
    case xe.Sponsored:
      n = Xc(t);
      const r = Xc(t);
      return Ig(n, r);
  }
}
class pE {
  constructor({ auth: e, payload: n, postConditions: r = Zu([]), postConditionMode: i = Ka.Deny, transactionVersion: s, chainId: o, network: a = "mainnet" }) {
    a = jx(a), this.transactionVersion = s ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Xe(n.amount)
    } : this.payload = n, this.postConditionMode = i, this.postConditions = r, this.anchorMode = wn.Any;
  }
  signBegin() {
    const e = ql(this);
    return e.auth = Qd(e.auth), e.txid();
  }
  verifyBegin() {
    const e = ql(this);
    return e.auth = Qd(e.auth), e.txid();
  }
  verifyOrigin() {
    return aE(this.auth, this.verifyBegin());
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
    const n = typeof e == "object" && "type" in e ? e : Qi(e), r = this.auth.spendingCondition;
    if (r && !vo(r)) {
      const i = Ji(n.data);
      r.fields.push($i(i ? pe.Compressed : pe.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, i) {
    const { nextSig: s, nextSigHash: o } = rE(n, r, e.fee, e.nonce, i);
    if (vo(e))
      e.signature = zl(s);
    else {
      const a = Sg(i);
      e.fields.push($i(a ? pe.Compressed : pe.Uncompressed, zl(s)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return nf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != xe.Sponsored)
      throw new Va("Cannot sponsor sign a non-sponsored transaction");
    this.auth = fE(this.auth, e);
  }
  setFee(e) {
    this.auth = cE(this.auth, e);
  }
  setNonce(e) {
    this.auth = lE(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != xe.Sponsored)
      throw new Va("Cannot sponsor sign a non-sponsored transaction");
    this.auth = uE(this.auth, e);
  }
  serialize() {
    return bt(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new vi('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new vi('"chainId" is undefined');
    if (this.auth === void 0)
      throw new vi('"auth" is undefined');
    if (this.payload === void 0)
      throw new vi('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return _s(n, this.chainId, 0), e.push(n), e.push(dE(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Qu(this.postConditions)), e.push(wg(this.payload)), ke(e);
  }
}
function gE(t) {
  const e = dn(t, se) ? t : new se(t), n = e.readUInt8Enum(Gs, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), i = hE(e), s = e.readUInt8Enum(wn, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(Ka, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = gg(e, rt.PostCondition), c = p3(e), u = new pE({
    transactionVersion: n,
    chainId: r,
    auth: i,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = s, u;
}
const Jd = BigInt("18446744073709551615");
function Yc(t) {
  const e = Xe(t);
  if (e < 0n || e > Jd)
    throw new RangeError(`Post-condition amount must be between 0 and ${Jd} (u64 max), received: ${e}`);
  return e;
}
var Wl;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Wl || (Wl = {}));
var Xl;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Xl || (Xl = {}));
function yE(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: rt.PostCondition,
        conditionType: le.STX,
        principal: t.address === "origin" ? { type: rt.Principal, prefix: en.Origin } : ao(t.address),
        conditionCode: aa(t.condition),
        amount: Yc(t.amount)
      };
    case "ft-postcondition":
      return {
        type: rt.PostCondition,
        conditionType: le.Fungible,
        principal: t.address === "origin" ? { type: rt.Principal, prefix: en.Origin } : ao(t.address),
        conditionCode: aa(t.condition),
        amount: Yc(t.amount),
        asset: qd(t.asset)
      };
    case "nft-postcondition":
      return {
        type: rt.PostCondition,
        conditionType: le.NonFungible,
        principal: t.address === "origin" ? { type: rt.Principal, prefix: en.Origin } : ao(t.address),
        conditionCode: aa(t.condition),
        asset: qd(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: rt.PostCondition,
        conditionType: le.Staking,
        principal: t.address === "origin" ? { type: rt.Principal, prefix: en.Origin } : ao(t.address),
        conditionCode: aa(t.condition),
        amount: Yc(t.amount)
      };
    case "pox-postcondition":
      return {
        type: rt.PostCondition,
        conditionType: le.PoX,
        principal: t.address === "origin" ? { type: rt.Principal, prefix: en.Origin } : ao(t.address),
        conditionCode: wE(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function aa(t) {
  return Wl[t];
}
function wE(t) {
  return Xl[t];
}
function Lg(t) {
  const e = yE(t);
  return d3(e);
}
function bE(t, e, n) {
  return af(Cg(t), n);
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
      r = r.padStart(r.length + r.length % 2, "0"), n = $o(r);
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
    return BigInt(`0x${SE(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function of(t, e = 8) {
  return (typeof t == "bigint" ? t : Cg(t)).toString(16).padStart(e * 2, "0");
}
function af(t, e = 16) {
  const n = of(t, e);
  return $o(n);
}
function mE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const xE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function SE(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += xE[n];
  return e;
}
function $o(t) {
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
function cf(t) {
  return new TextEncoder().encode(t);
}
function EE(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function AE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function th(t) {
  if (t.some(AE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function lf(...t) {
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
function Cr(t) {
  return lf(...t.map((e) => typeof e == "number" ? th([e]) : e instanceof Array ? th(e) : e));
}
function Ac(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Yl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Yl || (Yl = {}));
Yl.Mainnet;
const vE = 128, $E = 128, Tg = 16;
var Zl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Zl || (Zl = {}));
var eh;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(eh || (eh = {}));
var nh;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(nh || (nh = {}));
var jn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(jn || (jn = {}));
const Zc = ["onChainOnly", "offChainOnly", "any"];
Zc[0] + "", jn.OnChainOnly, Zc[1] + "", jn.OffChainOnly, Zc[2] + "", jn.Any, jn.OnChainOnly + "", jn.OnChainOnly, jn.OffChainOnly + "", jn.OffChainOnly, jn.Any + "", jn.Any;
var Ql;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ql || (Ql = {}));
Ql.Mainnet;
var rh;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(rh || (rh = {}));
var Es;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Es || (Es = {}));
var sh;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(sh || (sh = {}));
var ih;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ih || (ih = {}));
var oh;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(oh || (oh = {}));
var ah;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ah || (ah = {}));
var ch;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ch || (ch = {}));
var lh;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(lh || (lh = {}));
var Jl;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Jl || (Jl = {}));
var uh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(uh || (uh = {}));
var fh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(fh || (fh = {}));
function tu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function kE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Bg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function IE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  tu(t.outputLen), tu(t.blockLen);
}
function LE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function CE(t, e) {
  Bg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Qc = {
  number: tu,
  bool: kE,
  bytes: Bg,
  hash: IE,
  exists: LE,
  output: CE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Jc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Qn = (t, e) => t << 32 - e | t >>> e, TE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!TE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function BE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Mg(t) {
  if (typeof t == "string" && (t = BE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let ME = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ii(t) {
  const e = (r) => t().update(Mg(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function NE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let uf = class extends ME {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Jc(this.buffer);
  }
  update(e) {
    Qc.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Mg(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Jc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Qc.exists(this), Qc.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    NE(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Jc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
const PE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Ng = Uint8Array.from({ length: 16 }, (t, e) => e), _E = Ng.map((t) => (9 * t + 5) % 16);
let ff = [Ng], df = [_E];
for (let t = 0; t < 4; t++)
  for (let e of [ff, df])
    e.push(e[t].map((n) => PE[n]));
const Pg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), UE = ff.map((t, e) => t.map((n) => Pg[e][n])), HE = df.map((t, e) => t.map((n) => Pg[e][n])), OE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), DE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ca = (t, e) => t << e | t >>> 32 - e;
function dh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const la = new Uint32Array(16);
let FE = class extends uf {
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
      la[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const m = 4 - p, x = OE[p], T = DE[p], K = ff[p], V = df[p], E = UE[p], _ = HE[p];
      for (let M = 0; M < 16; M++) {
        const J = ca(r + dh(p, s, a, u) + la[K[M]] + x, E[M]) + l | 0;
        r = l, l = u, u = ca(a, 10) | 0, a = s, s = J;
      }
      for (let M = 0; M < 16; M++) {
        const J = ca(i + dh(m, o, c, d) + la[V[M]] + T, _[M]) + y | 0;
        i = y, y = d, d = ca(c, 10) | 0, c = o, o = J;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    la.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
ii(() => new FE());
const jE = (t, e, n) => t & e ^ ~t & n, zE = (t, e, n) => t & e ^ t & n ^ e & n, RE = new Uint32Array([
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
]), Yr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Zr = new Uint32Array(64);
let _g = class extends uf {
  constructor() {
    super(64, 32, 8, !1), this.A = Yr[0] | 0, this.B = Yr[1] | 0, this.C = Yr[2] | 0, this.D = Yr[3] | 0, this.E = Yr[4] | 0, this.F = Yr[5] | 0, this.G = Yr[6] | 0, this.H = Yr[7] | 0;
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
      Zr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Zr[l - 15], p = Zr[l - 2], m = Qn(y, 7) ^ Qn(y, 18) ^ y >>> 3, x = Qn(p, 17) ^ Qn(p, 19) ^ p >>> 10;
      Zr[l] = x + Zr[l - 7] + m + Zr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Qn(a, 6) ^ Qn(a, 11) ^ Qn(a, 25), p = d + y + jE(a, c, u) + RE[l] + Zr[l] | 0, x = (Qn(r, 2) ^ Qn(r, 13) ^ Qn(r, 22)) + zE(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    Zr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, GE = class extends _g {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
ii(() => new _g());
ii(() => new GE());
const ua = BigInt(2 ** 32 - 1), eu = BigInt(32);
function Ug(t, e = !1) {
  return e ? { h: Number(t & ua), l: Number(t >> eu & ua) } : { h: Number(t >> eu & ua) | 0, l: Number(t & ua) | 0 };
}
function KE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Ug(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const VE = (t, e) => BigInt(t >>> 0) << eu | BigInt(e >>> 0), qE = (t, e, n) => t >>> n, WE = (t, e, n) => t << 32 - n | e >>> n, XE = (t, e, n) => t >>> n | e << 32 - n, YE = (t, e, n) => t << 32 - n | e >>> n, ZE = (t, e, n) => t << 64 - n | e >>> n - 32, QE = (t, e, n) => t >>> n - 32 | e << 64 - n, JE = (t, e) => e, tA = (t, e) => t, eA = (t, e, n) => t << n | e >>> 32 - n, nA = (t, e, n) => e << n | t >>> 32 - n, rA = (t, e, n) => e << n - 32 | t >>> 64 - n, sA = (t, e, n) => t << n - 32 | e >>> 64 - n;
function iA(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const oA = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), aA = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, cA = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), lA = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, uA = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), fA = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Ct = {
  fromBig: Ug,
  split: KE,
  toBig: VE,
  shrSH: qE,
  shrSL: WE,
  rotrSH: XE,
  rotrSL: YE,
  rotrBH: ZE,
  rotrBL: QE,
  rotr32H: JE,
  rotr32L: tA,
  rotlSH: eA,
  rotlSL: nA,
  rotlBH: rA,
  rotlBL: sA,
  add: iA,
  add3L: oA,
  add3H: aA,
  add4L: cA,
  add4H: lA,
  add5H: fA,
  add5L: uA
}, [dA, hA] = Ct.split([
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
].map((t) => BigInt(t))), Qr = new Uint32Array(80), Jr = new Uint32Array(80);
let vc = class extends uf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: m, Hh: x, Hl: T } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, y, p, m, x, T];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, y, p, m, x, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = m | 0, this.Hh = x | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Qr[E] = e.getUint32(n), Jr[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const _ = Qr[E - 15] | 0, M = Jr[E - 15] | 0, J = Ct.rotrSH(_, M, 1) ^ Ct.rotrSH(_, M, 8) ^ Ct.shrSH(_, M, 7), et = Ct.rotrSL(_, M, 1) ^ Ct.rotrSL(_, M, 8) ^ Ct.shrSL(_, M, 7), q = Qr[E - 2] | 0, Y = Jr[E - 2] | 0, v = Ct.rotrSH(q, Y, 19) ^ Ct.rotrBH(q, Y, 61) ^ Ct.shrSH(q, Y, 6), N = Ct.rotrSL(q, Y, 19) ^ Ct.rotrBL(q, Y, 61) ^ Ct.shrSL(q, Y, 6), b = Ct.add4L(et, N, Jr[E - 7], Jr[E - 16]), C = Ct.add4H(b, J, v, Qr[E - 7], Qr[E - 16]);
      Qr[E] = C | 0, Jr[E] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: m, Gh: x, Gl: T, Hh: K, Hl: V } = this;
    for (let E = 0; E < 80; E++) {
      const _ = Ct.rotrSH(l, y, 14) ^ Ct.rotrSH(l, y, 18) ^ Ct.rotrBH(l, y, 41), M = Ct.rotrSL(l, y, 14) ^ Ct.rotrSL(l, y, 18) ^ Ct.rotrBL(l, y, 41), J = l & p ^ ~l & x, et = y & m ^ ~y & T, q = Ct.add5L(V, M, et, hA[E], Jr[E]), Y = Ct.add5H(q, K, _, J, dA[E], Qr[E]), v = q | 0, N = Ct.rotrSH(r, i, 28) ^ Ct.rotrBH(r, i, 34) ^ Ct.rotrBH(r, i, 39), b = Ct.rotrSL(r, i, 28) ^ Ct.rotrBL(r, i, 34) ^ Ct.rotrBL(r, i, 39), C = r & s ^ r & a ^ s & a, D = i & o ^ i & c ^ o & c;
      K = x | 0, V = T | 0, x = p | 0, T = m | 0, p = l | 0, m = y | 0, { h: l, l: y } = Ct.add(u | 0, d | 0, Y | 0, v | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const L = Ct.add3L(v, b, D);
      r = Ct.add3H(L, Y, N, C), i = L | 0;
    }
    ({ h: r, l: i } = Ct.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Ct.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Ct.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Ct.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = Ct.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: m } = Ct.add(this.Fh | 0, this.Fl | 0, p | 0, m | 0), { h: x, l: T } = Ct.add(this.Gh | 0, this.Gl | 0, x | 0, T | 0), { h: K, l: V } = Ct.add(this.Hh | 0, this.Hl | 0, K | 0, V | 0), this.set(r, i, s, o, a, c, u, d, l, y, p, m, x, T, K, V);
  }
  roundClean() {
    Qr.fill(0), Jr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, pA = class extends vc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, gA = class extends vc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, yA = class extends vc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ii(() => new vc());
ii(() => new pA());
ii(() => new gA());
ii(() => new yA());
function wA(t, e, n) {
  const i = vE;
  if (NA(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: Zl.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: i
  };
}
var Oe;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Oe || (Oe = {}));
let bA = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Hg = class extends bA {
  constructor(e) {
    super(e);
  }
};
function $c(t) {
  const e = [];
  return e.push($o(of(t.version, 1))), e.push($o(t.hash160)), Cr(e);
}
function mA(t) {
  const e = [];
  return e.push(t.prefix), e.push($c(t.address)), t.prefix === Jl.Contract && e.push(ko(t.contractName)), Cr(e);
}
function ko(t) {
  const e = [], n = cf(t.content), r = n.byteLength;
  return e.push($o(of(r, t.lengthPrefixBytes))), e.push(n), Cr(e);
}
function xA(t) {
  const e = [];
  return e.push($c(t.address)), e.push(ko(t.contractName)), e.push(ko(t.assetName)), Cr(e);
}
function Og(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(mA(t.principal)), (t.conditionType === Es.Fungible || t.conditionType === Es.NonFungible) && e.push(xA(t.assetInfo)), t.conditionType === Es.NonFungible && e.push(Vs(t.assetName)), e.push(t.conditionCode), t.conditionType === Es.STX || t.conditionType === Es.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Hg("The post-condition amount may not be larger than 8 bytes");
    e.push(bE(t.amount, !1, 8));
  }
  return Cr(e);
}
function fr(t, e) {
  return Cr([t, e]);
}
function SA(t) {
  return new Uint8Array([t.type]);
}
function EA(t) {
  return t.type === Oe.OptionalNone ? new Uint8Array([t.type]) : fr(t.type, Vs(t.value));
}
function AA(t) {
  const e = new Uint8Array(4);
  return Ac(e, t.buffer.length, 0), fr(t.type, lf(e, t.buffer));
}
function vA(t) {
  const e = af(mE(t.value, BigInt($E)), Tg);
  return fr(t.type, e);
}
function $A(t) {
  const e = af(t.value, Tg);
  return fr(t.type, e);
}
function kA(t) {
  return fr(t.type, $c(t.address));
}
function IA(t) {
  return fr(t.type, lf($c(t.address), ko(t.contractName)));
}
function LA(t) {
  return fr(t.type, Vs(t.value));
}
function CA(t) {
  const e = [], n = new Uint8Array(4);
  Ac(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const i = Vs(r);
    e.push(i);
  }
  return fr(t.type, Cr(e));
}
function TA(t) {
  const e = [], n = new Uint8Array(4);
  Ac(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = wA(i);
    e.push(ko(s));
    const o = Vs(t.data[i]);
    e.push(o);
  }
  return fr(t.type, Cr(e));
}
function Dg(t, e) {
  const n = [], r = e == "ascii" ? EE(t.data) : cf(t.data), i = new Uint8Array(4);
  return Ac(i, r.length, 0), n.push(i), n.push(r), fr(t.type, Cr(n));
}
function BA(t) {
  return Dg(t, "ascii");
}
function MA(t) {
  return Dg(t, "utf8");
}
function Vs(t) {
  switch (t.type) {
    case Oe.BoolTrue:
    case Oe.BoolFalse:
      return SA(t);
    case Oe.OptionalNone:
    case Oe.OptionalSome:
      return EA(t);
    case Oe.Buffer:
      return AA(t);
    case Oe.UInt:
      return $A(t);
    case Oe.Int:
      return vA(t);
    case Oe.PrincipalStandard:
      return kA(t);
    case Oe.PrincipalContract:
      return IA(t);
    case Oe.ResponseOk:
    case Oe.ResponseErr:
      return LA(t);
    case Oe.List:
      return CA(t);
    case Oe.Tuple:
      return TA(t);
    case Oe.StringASCII:
      return BA(t);
    case Oe.StringUTF8:
      return MA(t);
    default:
      throw new Hg("Unable to serialize. Invalid Clarity Value.");
  }
}
const NA = (t, e) => t ? cf(t).length > e : !1, PA = "connect-ui";
let Ia, Fg, bn = !1, nu = !1;
const Lr = (t, e = "") => () => {
}, _A = (t, e) => () => {
}, UA = "{visibility:hidden}.hydrated{visibility:inherit}", hh = {}, HA = "http://www.w3.org/2000/svg", OA = "http://www.w3.org/1999/xhtml", DA = (t) => t != null, hf = (t) => (t = typeof t, t === "object" || t === "function");
function jg(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const vt = (t, e, ...n) => {
  let r = null, i = !1, s = !1;
  const o = [], a = (u) => {
    for (let d = 0; d < u.length; d++)
      r = u[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((i = typeof t != "function" && !hf(r)) && (r = String(r)), i && s ? o[o.length - 1].$text$ += r : o.push(i ? ru(null, r) : r), s = i);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((d) => u[d]).join(" "));
  }
  const c = ru(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, ru = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, FA = {}, jA = (t) => t && t.$tag$ === FA, zA = (t, e) => t != null && !hf(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, RA = (t) => to(t).$hostElement$, GA = (t, e, n) => {
  const r = We.ce(e, n);
  return t.dispatchEvent(r), r;
}, ph = /* @__PURE__ */ new WeakMap(), KA = (t, e, n) => {
  let r = qa.get(t);
  f4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, qa.set(t, r);
}, VA = (t, e, n, r) => {
  var i;
  let s = zg(e);
  const o = qa.get(s);
  if (t = t.nodeType === 11 ? t : or, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = ph.get(t), c;
      if (a || ph.set(t, a = /* @__PURE__ */ new Set()), !a.has(s)) {
        {
          c = or.createElement("style"), c.innerHTML = o;
          const u = (i = We.$nonce$) !== null && i !== void 0 ? i : jg(or);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(s);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return s;
}, qA = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, i = Lr("attachStyles", e.$tagName$), s = VA(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = s, n.classList.add(s + "-h")), i();
}, zg = (t, e) => "sc-" + t.$tagName$, gh = (t, e, n, r, i, s) => {
  if (n !== r) {
    let o = wh(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = yh(n), d = yh(r);
      c.remove(...u.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : wh(kc, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && We.rel(t, e, n, !1), r && We.ael(t, e, r, !1);
    else {
      const c = hf(r);
      if ((o || c && r !== null) && !i)
        try {
          if (t.tagName.includes("-"))
            t[e] = r;
          else {
            const u = r ?? "";
            e === "list" ? o = !1 : (n == null || t[e] != u) && (t[e] = u);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || t.getAttribute(e) === "") && t.removeAttribute(e) : (!o || s & 4 || i) && !c && (r = r === !0 ? "" : r, t.setAttribute(e, r));
    }
  }
}, WA = /\s/, yh = (t) => t ? t.split(WA) : [], Rg = (t, e, n, r) => {
  const i = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, s = t && t.$attrs$ || hh, o = e.$attrs$ || hh;
  for (r in s)
    r in o || gh(i, r, s[r], void 0, n, e.$flags$);
  for (r in o)
    gh(i, r, s[r], o[r], n, e.$flags$);
}, pf = (t, e, n, r) => {
  const i = e.$children$[n];
  let s = 0, o, a;
  if (i.$text$ !== null)
    o = i.$elm$ = or.createTextNode(i.$text$);
  else {
    if (bn || (bn = i.$tag$ === "svg"), o = i.$elm$ = or.createElementNS(bn ? HA : OA, i.$tag$), bn && i.$tag$ === "foreignObject" && (bn = !1), Rg(null, i, bn), DA(Ia) && o["s-si"] !== Ia && o.classList.add(o["s-si"] = Ia), i.$children$)
      for (s = 0; s < i.$children$.length; ++s)
        a = pf(t, i, s), a && o.appendChild(a);
    i.$tag$ === "svg" ? bn = !1 : o.tagName === "foreignObject" && (bn = !0);
  }
  return o;
}, Gg = (t, e, n, r, i, s) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Fg && (o = o.shadowRoot); i <= s; ++i)
    r[i] && (a = pf(null, n, i), a && (r[i].$elm$ = a, o.insertBefore(a, e)));
}, Kg = (t, e, n, r, i) => {
  for (; e <= n; ++e)
    (r = t[e]) && (i = r.$elm$, i.remove());
}, XA = (t, e, n, r) => {
  let i = 0, s = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, d = r[0], l = r[u], y;
  for (; i <= o && s <= u; )
    a == null ? a = e[++i] : c == null ? c = e[--o] : d == null ? d = r[++s] : l == null ? l = r[--u] : fa(a, d) ? (ho(a, d), a = e[++i], d = r[++s]) : fa(c, l) ? (ho(c, l), c = e[--o], l = r[--u]) : fa(a, l) ? (ho(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++i], l = r[--u]) : fa(c, d) ? (ho(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++s]) : (y = pf(e && e[s], n, s), d = r[++s], y && a.$elm$.parentNode.insertBefore(y, a.$elm$));
  i > o ? Gg(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, s, u) : s > u && Kg(e, i, o);
}, fa = (t, e) => t.$tag$ === e.$tag$, ho = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, i = e.$children$, s = e.$tag$, o = e.$text$;
  o === null ? (bn = s === "svg" ? !0 : s === "foreignObject" ? !1 : bn, Rg(t, e, bn), r !== null && i !== null ? XA(n, r, e, i) : i !== null ? (t.$text$ !== null && (n.textContent = ""), Gg(n, null, e, i, 0, i.length - 1)) : r !== null && Kg(r, 0, r.length - 1), bn && s === "svg" && (bn = !1)) : t.$text$ !== o && (n.data = o);
}, YA = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || ru(null, null), i = jA(e) ? e : vt(null, null, e);
  Fg = n.tagName, i.$tag$ = null, i.$flags$ |= 4, t.$vnode$ = i, i.$elm$ = r.$elm$ = n.shadowRoot || n, Ia = n["s-sc"], ho(r, i);
}, Vg = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, gf = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Vg(t, t.$ancestorComponent$), h4(() => ZA(t, e));
}, ZA = (t, e) => {
  const n = Lr("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let i;
  return n(), e4(i, () => QA(t, r, e));
}, QA = async (t, e, n) => {
  const r = t.$hostElement$, i = Lr("update", t.$cmpMeta$.$tagName$), s = r["s-rc"];
  n && qA(t);
  const o = Lr("render", t.$cmpMeta$.$tagName$);
  JA(t, e), s && (s.map((a) => a()), r["s-rc"] = void 0), o(), i();
  {
    const a = r["s-p"], c = () => t4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, JA = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, YA(t, e);
  } catch (r) {
    Io(r, t.$hostElement$);
  }
  return null;
}, t4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Lr("postUpdate", e), i = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Wg(n), r(), t.$onReadyResolve$(n), i || qg()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && wf(() => gf(t, !1)), t.$flags$ &= -517;
}, qg = (t) => {
  Wg(or.documentElement), wf(() => GA(kc, "appload", { detail: { namespace: PA } }));
}, e4 = (t, e) => t && t.then ? t.then(e) : e(), Wg = (t) => t.classList.add("hydrated"), n4 = (t, e) => to(t).$instanceValues$.get(e), r4 = (t, e, n, r) => {
  const i = to(t), s = i.$instanceValues$.get(e), o = i.$flags$, a = i.$lazyInstance$;
  n = zA(n, r.$members$[e][0]);
  const c = Number.isNaN(s) && Number.isNaN(n), u = n !== s && !c;
  (!(o & 8) || s === void 0) && u && (i.$instanceValues$.set(e, n), a && (o & 18) === 2 && gf(i, !1));
}, Xg = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), i = t.prototype;
    if (r.map(([s, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(i, s, {
        get() {
          return n4(this, s);
        },
        set(a) {
          r4(this, s, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const s = /* @__PURE__ */ new Map();
      i.attributeChangedCallback = function(o, a, c) {
        We.jmp(() => {
          const u = s.get(o);
          if (this.hasOwnProperty(u))
            c = this[u], delete this[u];
          else if (i.hasOwnProperty(u) && typeof this[u] == "number" && this[u] == c)
            return;
          this[u] = c === null && typeof this[u] == "boolean" ? !1 : c;
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
}, s4 = async (t, e, n, r, i) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, i = u4(n), i.then) {
        const c = _A();
        i = await i, c();
      }
      i.isProxied || (Xg(
        i,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), i.isProxied = !0);
      const a = Lr("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new i(e);
      } catch (c) {
        Io(c);
      }
      e.$flags$ &= -9, a();
    }
    if (i.style) {
      let a = i.style;
      const c = zg(n);
      if (!qa.has(c)) {
        const u = Lr("registerStyles", n.$tagName$);
        KA(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const s = e.$ancestorComponent$, o = () => gf(e, !0);
  s && s["s-rc"] ? s["s-rc"].push(o) : o();
}, i4 = (t) => {
  if (!(We.$flags$ & 1)) {
    const e = to(t), n = e.$cmpMeta$, r = Lr("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let i = t;
        for (; i = i.parentNode || i.host; )
          if (i["s-p"]) {
            Vg(e, e.$ancestorComponent$ = i);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([i, [s]]) => {
        if (s & 31 && t.hasOwnProperty(i)) {
          const o = t[i];
          delete t[i], t[i] = o;
        }
      }), s4(t, e, n);
    }
    r();
  }
}, o4 = (t) => {
  We.$flags$ & 1 || to(t);
}, a4 = (t, e = {}) => {
  var n;
  const r = Lr(), i = [], s = e.exclude || [], o = kc.customElements, a = or.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ or.createElement("style"), d = [];
  let l, y = !0;
  Object.assign(We, e), We.$resourcesUrl$ = new URL(e.resourcesUrl || "./", or.baseURI).href, t.map((p) => {
    p[1].map((m) => {
      const x = {
        $flags$: m[0],
        $tagName$: m[1],
        $members$: m[2],
        $listeners$: m[3]
      };
      x.$members$ = m[2];
      const T = x.$tagName$, K = class extends HTMLElement {
        // StencilLazyHost
        constructor(V) {
          super(V), V = this, l4(V, x), x.$flags$ & 1 && V.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), y ? d.push(this) : We.jmp(() => i4(this));
        }
        disconnectedCallback() {
          We.jmp(() => o4(this));
        }
        componentOnReady() {
          return to(this).$onReadyPromise$;
        }
      };
      x.$lazyBundleId$ = p[0], !s.includes(T) && !o.get(T) && (i.push(T), o.define(T, Xg(
        K,
        x,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = i + UA, u.setAttribute("data-styles", "");
    const p = (n = We.$nonce$) !== null && n !== void 0 ? n : jg(or);
    p != null && u.setAttribute("nonce", p), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  y = !1, d.length ? d.map((p) => p.connectedCallback()) : We.jmp(() => l = setTimeout(qg, 30)), r();
}, yf = /* @__PURE__ */ new WeakMap(), to = (t) => yf.get(t), c4 = (t, e) => yf.set(e.$lazyInstance$ = t, e), l4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], yf.set(t, n);
}, wh = (t, e) => e in t, Io = (t, e) => (0, console.error)(t, e), tl = /* @__PURE__ */ new Map(), u4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), i = t.$lazyBundleId$, s = tl.get(i);
  if (s)
    return s[r];
  {
    const o = (a) => (tl.set(i, a), a[r]);
    switch (i) {
      case "connect-modal":
        return Promise.resolve().then(() => j$).then(o, Io);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${i}.entry.js`
  ).then((o) => (tl.set(i, o), o[r]), Io);
}, qa = /* @__PURE__ */ new Map(), kc = typeof window < "u" ? window : {}, or = kc.document || { head: {} }, We = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Yg = (t) => Promise.resolve(t), f4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), bh = [], Zg = [], d4 = (t, e) => (n) => {
  t.push(n), nu || (nu = !0, We.$flags$ & 4 ? wf(su) : We.raf(su));
}, mh = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Io(n);
    }
  t.length = 0;
}, su = () => {
  mh(bh), mh(Zg), (nu = bh.length > 0) && We.raf(su);
}, wf = (t) => Yg().then(t), h4 = /* @__PURE__ */ d4(Zg), p4 = () => Yg(), g4 = (t, e) => typeof window > "u" ? Promise.resolve() : p4().then(() => a4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var y4 = Object.defineProperty, w4 = Object.defineProperties, b4 = Object.getOwnPropertyDescriptors, Wa = Object.getOwnPropertySymbols, Qg = Object.prototype.hasOwnProperty, Jg = Object.prototype.propertyIsEnumerable, xh = (t, e, n) => e in t ? y4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, vn = (t, e) => {
  for (var n in e || (e = {})) Qg.call(e, n) && xh(t, n, e[n]);
  if (Wa) for (var n of Wa(e)) Jg.call(e, n) && xh(t, n, e[n]);
  return t;
}, Vn = (t, e) => w4(t, b4(e)), ty = (t, e) => {
  var n = {};
  for (var r in t) Qg.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Wa) for (var r of Wa(t)) e.indexOf(r) < 0 && Jg.call(t, r) && (n[r] = t[r]);
  return n;
};
function ey() {
  return mc(Fs()) || window.StacksProvider || window.BlockstackProvider;
}
function Ic(t) {
  return t ? typeof t == "string" ? zs.fromName(t) : "version" in t ? t : "url" in t ? new Ml({ url: t.url }) : t.transactionVersion === Gs.Mainnet ? new Ml({ url: t.client.baseUrl }) : new Nl({ url: t.client.baseUrl }) : new Nl();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var m4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(m4 || {}), x4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(x4 || {}), bf = (t) => {
  let e = t;
  if (!e) {
    let n = new M0(["store_write"], document.location.href);
    e = new Bl({ appConfig: n });
  }
  return e;
};
function ny(t) {
  try {
    return bf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var ry = (t) => {
  let e = bf(t).loadUserData().appPrivateKey, n = Ge.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function S4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: i } = t;
  if (n) return n;
  if (!r || !i) return;
  let s = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [Rs.Mainnet]: "mainnet", [Rs.Testnet]: "testnet" }, a = Ic(i);
  return s == null ? void 0 : s[o[a.chainId]];
}
function E4(t) {
  let e = Ic(t.network), n = bf(t.userSession), r = Vn(vn({}, t), { network: e, userSession: n });
  return vn({ stxAddress: S4(r) }, r);
}
async function A4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Lg) : n = n.map((r) => bt(Og(r)))), new Ge.TokenSigner("ES256k", e).signAsync(Vn(vn({}, t), { postConditions: n }));
}
function v4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(Lg) : e = e.map((n) => bt(Og(n)))), Ge.createUnsecuredToken(Vn(vn({}, t), { postConditions: e }));
}
var $4 = async ({ token: t, options: e }, n) => {
  var r, i, s;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Rt(a.replace(/^0x/, "")), u = gE(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, Vn(vn({}, o), { stacksTransaction: u }));
      return;
    }
    (i = e.onFinish) == null || i.call(e, Vn(vn({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (s = e.onCancel) == null || s.call(e);
  }
}, k4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: i } = e, s = ty(e, ["amount", "appDetails", "userSession"]);
  if (ny(i)) {
    let { privateKey: a, publicKey: c } = ry(i), u = Vn(vn({}, s), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), A4(u, a);
  }
  let o = Vn(vn({}, s), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), v4(o);
};
async function I4(t, e, n) {
  let r = await e(Vn(vn(vn({}, E4(t)), t), { network: Ic(t.network) }));
  return $4({ token: r, options: t }, n);
}
function L4(t, e = ey()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return I4(t, k4, e);
}
function sy(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? Vn(vn({}, t), { message: Wd(e), domain: Wd(n) }) : Vn(vn({}, t), { message: bt(Vs(e)), domain: bt(Vs(n)) });
}
async function C4(t, e) {
  return new Ge.TokenSigner("ES256k", e).signAsync(sy(t));
}
async function T4(t) {
  let e = t, { userSession: n } = e, r = ty(e, ["userSession"]);
  if (ny(n)) {
    let { privateKey: i, publicKey: s } = ry(n), o = Vn(vn({}, r), { publicKey: s });
    return C4(o, i);
  }
  return Ge.createUnsecuredToken(sy(t));
}
var B4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(B4 || {}), iy = "asigna-stx", Sh = (t, e) => new Promise((n) => {
  function r(i) {
    i.data.source === iy && i.data[e] && (n(i.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(N4(t, e), "*");
}), M4 = { authenticationRequest: async (t) => Sh(t, "authenticationRequest"), transactionRequest: async (t) => Sh(t, "transactionRequest") }, N4 = (t, e) => ({ source: iy, [e]: t }), P4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = M4);
};
P4();
var _4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function U4(t, e = !0) {
  return function(n, r) {
    var i;
    if (r) return t(n, r);
    let s = Fs(), o = ey();
    if (s && o) return t(n, o);
    if (typeof window > "u") return;
    g4();
    let a = (i = n == null ? void 0 : n.defaultProviders) != null ? i : _4, c = Ix(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = e;
    let d = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      u.remove(), document.body.style.overflow = d;
    };
    u.callback = (p) => {
      l(), t(n, p);
    }, u.cancelCallback = () => {
      var p;
      l(), (p = n.onCancel) == null || p.call(n);
    }, document.body.appendChild(u);
    let y = (p) => {
      p.key === "Escape" && (document.removeEventListener("keydown", y), u.remove());
    };
    document.addEventListener("keydown", y);
  };
}
var da = U4(L4);
function hs(t, e, n) {
  return mf(rn(t, e), n);
}
function rn(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = fe(r);
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
      const r = D4(BigInt(`0x${_t(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${_t(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Eh(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Fo(t, e = 8) {
  return (typeof t == "bigint" ? t : rn(t, !1)).toString(16).padStart(e * 2, "0");
}
function Lc(t) {
  return parseInt(t, 16);
}
function mf(t, e = 16) {
  const n = Fo(t, e);
  return fe(n);
}
function H4(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function O4(t, e) {
  return t & BigInt(1) << e;
}
function D4(t, e) {
  return O4(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const F4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function _t(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += F4[n];
  return e;
}
function fe(t) {
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
function eo(t) {
  return new TextEncoder().encode(t);
}
function xf(t) {
  return new TextDecoder().decode(t);
}
function oy(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function j4(t) {
  return String.fromCharCode.apply(null, t);
}
function z4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Ah(t) {
  if (t.some(z4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Cc(...t) {
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
function Ie(t) {
  return Cc(...t.map((e) => typeof e == "number" ? Ah([e]) : e instanceof Array ? Ah(e) : e));
}
var vh;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(vh || (vh = {}));
var $h;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})($h || ($h = {}));
var kh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(kh || (kh = {}));
const ay = 33, el = 32;
function R4(t) {
  if (t.length < el * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + el * 2), r = t.slice(2 + el * 2);
  return {
    recoveryId: Lc(e),
    r: n,
    s: r
  };
}
function G4(t) {
  const e = typeof t == "string" ? fe(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function K4(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function V4(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function q4(t, e) {
  return t[e];
}
function W4(t, e, n = 0) {
  return t[n] = e, t;
}
function X4(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function qs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var iu;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(iu || (iu = {}));
const Y4 = iu.Mainnet, Z4 = 128, Q4 = 128, cy = 16, Ms = 32, ou = 80, Tc = 65, J4 = 32, tv = 64, Xa = 34;
var dt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(dt || (dt = {}));
var Mt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Mt || (Mt = {}));
var au;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(au || (au = {}));
var un;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(un || (un = {}));
const La = ["onChainOnly", "offChainOnly", "any"], Ih = {
  [La[0]]: un.OnChainOnly,
  [La[1]]: un.OffChainOnly,
  [La[2]]: un.Any,
  [un.OnChainOnly]: un.OnChainOnly,
  [un.OffChainOnly]: un.OffChainOnly,
  [un.Any]: un.Any
};
function ev(t) {
  if (t in Ih)
    return Ih[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${La.join(", ")}`);
}
var Ya;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ya || (Ya = {}));
Ya.Mainnet;
var Ki;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Ki || (Ki = {}));
var fn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(fn || (fn = {}));
var Se;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Se || (Se = {}));
var re;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(re || (re = {}));
var Za;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Za || (Za = {}));
var ge;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ge || (ge = {}));
var Lo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Lo || (Lo = {}));
var cu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(cu || (cu = {}));
var Co;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Co || (Co = {}));
var Lh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Lh || (Lh = {}));
var Ch;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Ch || (Ch = {}));
function lu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function nv(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function ly(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function rv(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  lu(t.outputLen), lu(t.blockLen);
}
function sv(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function iv(t, e) {
  ly(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ls = {
  number: lu,
  bool: nv,
  bytes: ly,
  hash: rv,
  exists: sv,
  output: iv
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const nl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Jn = (t, e) => t << 32 - e | t >>> e, ov = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ov)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function av(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Sf(t) {
  if (typeof t == "string" && (t = av(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class uy {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function oi(t) {
  const e = (r) => t().update(Sf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function cv(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class Ef extends uy {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = nl(this.buffer);
  }
  update(e) {
    Ls.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Sf(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = nl(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ls.exists(this), Ls.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    cv(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = nl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
const lv = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), fy = Uint8Array.from({ length: 16 }, (t, e) => e), uv = fy.map((t) => (9 * t + 5) % 16);
let Af = [fy], vf = [uv];
for (let t = 0; t < 4; t++)
  for (let e of [Af, vf])
    e.push(e[t].map((n) => lv[n]));
const dy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), fv = Af.map((t, e) => t.map((n) => dy[e][n])), dv = vf.map((t, e) => t.map((n) => dy[e][n])), hv = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), pv = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ha = (t, e) => t << e | t >>> 32 - e;
function Th(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const pa = new Uint32Array(16);
class gv extends Ef {
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
      pa[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const m = 4 - p, x = hv[p], T = pv[p], K = Af[p], V = vf[p], E = fv[p], _ = dv[p];
      for (let M = 0; M < 16; M++) {
        const J = ha(r + Th(p, s, a, u) + pa[K[M]] + x, E[M]) + l | 0;
        r = l, l = u, u = ha(a, 10) | 0, a = s, s = J;
      }
      for (let M = 0; M < 16; M++) {
        const J = ha(i + Th(m, o, c, d) + pa[V[M]] + T, _[M]) + y | 0;
        i = y, y = d, d = ha(c, 10) | 0, c = o, o = J;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    pa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const yv = oi(() => new gv()), wv = (t, e, n) => t & e ^ ~t & n, bv = (t, e, n) => t & e ^ t & n ^ e & n, mv = new Uint32Array([
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
]), ts = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), es = new Uint32Array(64);
class hy extends Ef {
  constructor() {
    super(64, 32, 8, !1), this.A = ts[0] | 0, this.B = ts[1] | 0, this.C = ts[2] | 0, this.D = ts[3] | 0, this.E = ts[4] | 0, this.F = ts[5] | 0, this.G = ts[6] | 0, this.H = ts[7] | 0;
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
      es[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = es[l - 15], p = es[l - 2], m = Jn(y, 7) ^ Jn(y, 18) ^ y >>> 3, x = Jn(p, 17) ^ Jn(p, 19) ^ p >>> 10;
      es[l] = x + es[l - 7] + m + es[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Jn(a, 6) ^ Jn(a, 11) ^ Jn(a, 25), p = d + y + wv(a, c, u) + mv[l] + es[l] | 0, x = (Jn(r, 2) ^ Jn(r, 13) ^ Jn(r, 22)) + bv(r, i, s) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + x | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, i, s, o, a, c, u, d);
  }
  roundClean() {
    es.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class xv extends hy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const $f = oi(() => new hy());
oi(() => new xv());
const ga = BigInt(2 ** 32 - 1), uu = BigInt(32);
function py(t, e = !1) {
  return e ? { h: Number(t & ga), l: Number(t >> uu & ga) } : { h: Number(t >> uu & ga) | 0, l: Number(t & ga) | 0 };
}
function Sv(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = py(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const Ev = (t, e) => BigInt(t >>> 0) << uu | BigInt(e >>> 0), Av = (t, e, n) => t >>> n, vv = (t, e, n) => t << 32 - n | e >>> n, $v = (t, e, n) => t >>> n | e << 32 - n, kv = (t, e, n) => t << 32 - n | e >>> n, Iv = (t, e, n) => t << 64 - n | e >>> n - 32, Lv = (t, e, n) => t >>> n - 32 | e << 64 - n, Cv = (t, e) => e, Tv = (t, e) => t, Bv = (t, e, n) => t << n | e >>> 32 - n, Mv = (t, e, n) => e << n | t >>> 32 - n, Nv = (t, e, n) => e << n - 32 | t >>> 64 - n, Pv = (t, e, n) => t << n - 32 | e >>> 64 - n;
function _v(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const Uv = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Hv = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Ov = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Dv = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, Fv = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), jv = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Tt = {
  fromBig: py,
  split: Sv,
  toBig: Ev,
  shrSH: Av,
  shrSL: vv,
  rotrSH: $v,
  rotrSL: kv,
  rotrBH: Iv,
  rotrBL: Lv,
  rotr32H: Cv,
  rotr32L: Tv,
  rotlSH: Bv,
  rotlSL: Mv,
  rotlBH: Nv,
  rotlBL: Pv,
  add: _v,
  add3L: Uv,
  add3H: Hv,
  add4L: Ov,
  add4H: Dv,
  add5H: jv,
  add5L: Fv
}, [zv, Rv] = Tt.split([
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
].map((t) => BigInt(t))), ns = new Uint32Array(80), rs = new Uint32Array(80);
class Bc extends Ef {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: m, Hh: x, Hl: T } = this;
    return [e, n, r, i, s, o, a, c, u, d, l, y, p, m, x, T];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, d, l, y, p, m, x, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = m | 0, this.Hh = x | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      ns[E] = e.getUint32(n), rs[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const _ = ns[E - 15] | 0, M = rs[E - 15] | 0, J = Tt.rotrSH(_, M, 1) ^ Tt.rotrSH(_, M, 8) ^ Tt.shrSH(_, M, 7), et = Tt.rotrSL(_, M, 1) ^ Tt.rotrSL(_, M, 8) ^ Tt.shrSL(_, M, 7), q = ns[E - 2] | 0, Y = rs[E - 2] | 0, v = Tt.rotrSH(q, Y, 19) ^ Tt.rotrBH(q, Y, 61) ^ Tt.shrSH(q, Y, 6), N = Tt.rotrSL(q, Y, 19) ^ Tt.rotrBL(q, Y, 61) ^ Tt.shrSL(q, Y, 6), b = Tt.add4L(et, N, rs[E - 7], rs[E - 16]), C = Tt.add4H(b, J, v, ns[E - 7], ns[E - 16]);
      ns[E] = C | 0, rs[E] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: m, Gh: x, Gl: T, Hh: K, Hl: V } = this;
    for (let E = 0; E < 80; E++) {
      const _ = Tt.rotrSH(l, y, 14) ^ Tt.rotrSH(l, y, 18) ^ Tt.rotrBH(l, y, 41), M = Tt.rotrSL(l, y, 14) ^ Tt.rotrSL(l, y, 18) ^ Tt.rotrBL(l, y, 41), J = l & p ^ ~l & x, et = y & m ^ ~y & T, q = Tt.add5L(V, M, et, Rv[E], rs[E]), Y = Tt.add5H(q, K, _, J, zv[E], ns[E]), v = q | 0, N = Tt.rotrSH(r, i, 28) ^ Tt.rotrBH(r, i, 34) ^ Tt.rotrBH(r, i, 39), b = Tt.rotrSL(r, i, 28) ^ Tt.rotrBL(r, i, 34) ^ Tt.rotrBL(r, i, 39), C = r & s ^ r & a ^ s & a, D = i & o ^ i & c ^ o & c;
      K = x | 0, V = T | 0, x = p | 0, T = m | 0, p = l | 0, m = y | 0, { h: l, l: y } = Tt.add(u | 0, d | 0, Y | 0, v | 0), u = a | 0, d = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const L = Tt.add3L(v, b, D);
      r = Tt.add3H(L, Y, N, C), i = L | 0;
    }
    ({ h: r, l: i } = Tt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Tt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Tt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = Tt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: m } = Tt.add(this.Fh | 0, this.Fl | 0, p | 0, m | 0), { h: x, l: T } = Tt.add(this.Gh | 0, this.Gl | 0, x | 0, T | 0), { h: K, l: V } = Tt.add(this.Hh | 0, this.Hl | 0, K | 0, V | 0), this.set(r, i, s, o, a, c, u, d, l, y, p, m, x, T, K, V);
  }
  roundClean() {
    ns.fill(0), rs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class Gv extends Bc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class Kv extends Bc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class Vv extends Bc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
oi(() => new Bc());
oi(() => new Gv());
const qv = oi(() => new Kv());
oi(() => new Vv());
function gy(t) {
  if (fe(t).byteLength != Tc)
    throw Error("Invalid signature");
  return {
    type: dt.MessageSignature,
    data: t
  };
}
function po(t, e) {
  return { type: dt.Address, version: t, hash160: e };
}
function ki(t) {
  return ri.c32address(t.version, t.hash160);
}
function Ws(t, e, n) {
  const r = e || 1, i = n || Z4;
  if (My(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: dt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function kf(t) {
  const e = ri.c32addressDecode(t);
  return {
    type: dt.Address,
    version: e[0],
    hash160: e[1]
  };
}
var Z;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Z || (Z = {}));
function Wv(t) {
  if (t.type === Z.PrincipalStandard)
    return ki(t.address);
  if (t.type === Z.PrincipalContract)
    return `${ki(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function yy(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Zv(e, n);
  } else
    return Xv(t);
}
function Xv(t) {
  const e = kf(t);
  return { type: Z.PrincipalStandard, address: e };
}
function Yv(t) {
  return { type: Z.PrincipalStandard, address: t };
}
function Zv(t, e) {
  const n = kf(t), r = Ws(e);
  return wy(n, r);
}
function wy(t, e) {
  if (eo(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: Z.PrincipalContract, address: t, contractName: e };
}
function rl(t, e = !1) {
  switch (t.type) {
    case Z.BoolTrue:
      return !0;
    case Z.BoolFalse:
      return !1;
    case Z.Int:
    case Z.UInt:
      return e ? t.value.toString() : t.value;
    case Z.Buffer:
      return `0x${_t(t.buffer)}`;
    case Z.OptionalNone:
      return null;
    case Z.OptionalSome:
      return rr(t.value);
    case Z.ResponseErr:
      return rr(t.value);
    case Z.ResponseOk:
      return rr(t.value);
    case Z.PrincipalStandard:
    case Z.PrincipalContract:
      return Wv(t);
    case Z.List:
      return t.list.map((r) => rr(r));
    case Z.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = rr(t.data[r]);
      }), n;
    case Z.StringASCII:
      return t.data;
    case Z.StringUTF8:
      return t.data;
  }
}
function rr(t) {
  switch (t.type) {
    case Z.ResponseErr:
      return { type: os(t), value: rl(t, !0), success: !1 };
    case Z.ResponseOk:
      return { type: os(t), value: rl(t, !0), success: !0 };
    default:
      return { type: os(t), value: rl(t, !0) };
  }
}
function os(t) {
  switch (t.type) {
    case Z.BoolTrue:
    case Z.BoolFalse:
      return "bool";
    case Z.Int:
      return "int";
    case Z.UInt:
      return "uint";
    case Z.Buffer:
      return `(buff ${t.buffer.length})`;
    case Z.OptionalNone:
      return "(optional none)";
    case Z.OptionalSome:
      return `(optional ${os(t.value)})`;
    case Z.ResponseErr:
      return `(response UnknownType ${os(t.value)})`;
    case Z.ResponseOk:
      return `(response ${os(t.value)} UnknownType)`;
    case Z.PrincipalStandard:
    case Z.PrincipalContract:
      return "principal";
    case Z.List:
      return `(list ${t.list.length} ${t.list.length ? os(t.list[0]) : "UnknownType"})`;
    case Z.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${os(t.data[e])})`).join(" ")})`;
    case Z.StringASCII:
      return `(string-ascii ${oy(t.data).length})`;
    case Z.StringUTF8:
      return `(string-utf8 ${eo(t.data).length})`;
  }
}
const by = () => ({ type: Z.BoolTrue }), my = () => ({ type: Z.BoolFalse }), Qv = (t) => t ? by() : my(), Bh = BigInt("0xffffffffffffffffffffffffffffffff"), Jv = BigInt(0), Mh = BigInt("0x7fffffffffffffffffffffffffffffff"), Nh = BigInt("-170141183460469231731687303715884105728"), t8 = (t) => {
  const e = rn(t, !0);
  if (e > Mh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Mh}`);
  if (e < Nh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Nh}`);
  return { type: Z.Int, value: e };
}, ar = (t) => {
  const e = rn(t, !1);
  if (e < Jv)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Bh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Bh}`);
  return { type: Z.UInt, value: e };
}, xy = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Z.Buffer, buffer: t };
};
function Sy() {
  return { type: Z.OptionalNone };
}
function Ey(t) {
  return { type: Z.OptionalSome, value: t };
}
function e8(t) {
  return { type: Z.ResponseErr, value: t };
}
function n8(t) {
  return { type: Z.ResponseOk, value: t };
}
function r8(t) {
  return { type: Z.List, list: t };
}
function Xs(t) {
  for (const e in t)
    if (!V8(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Z.Tuple, data: t };
}
const Re = (t) => ({ type: Z.StringASCII, data: t }), s8 = (t) => ({ type: Z.StringUTF8, data: t });
class Ay extends uy {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ls.hash(e);
    const r = Sf(n);
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
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const vy = (t, e, n) => new Ay(t, e).update(n).digest();
vy.create = (t, e) => new Ay(t, e);
Ee.hmacSha256Sync = (t, ...e) => {
  const n = vy.create($f, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Vi(t) {
  return {
    type: dt.PublicKey,
    data: fe(t)
  };
}
function i8(t, e, n = ge.Compressed) {
  const r = R4(e.data), i = new En(Eh(r.r), Eh(r.s)), s = Nt.fromSignature(t, i, r.recoveryId), o = n === ge.Compressed;
  return s.toHex(o);
}
function o8(t) {
  return { type: dt.PublicKey, data: t };
}
function no(t) {
  return !_t(t.data).startsWith("04");
}
function Qa(t) {
  return t.data.slice();
}
function a8(t) {
  const e = u8(t), n = _o(e.data.slice(0, 32), e.compressed);
  return Vi(_t(n));
}
function c8(t) {
  const e = typeof t == "string" ? t : _t(t), n = Nt.fromHex(e).toHex(!0);
  return Vi(n);
}
function l8(t) {
  const e = typeof t == "string" ? t : _t(t), n = Nt.fromHex(e).toHex(!1);
  return Vi(n);
}
function fu(t) {
  const e = t.readUInt8(), n = e === 4 ? tv : J4;
  return o8(Ie([e, t.readBytes(n)]));
}
function u8(t) {
  const e = G4(t), n = e.length == ay;
  return { data: e, compressed: n };
}
function f8(t, e) {
  const [n, r] = lc(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const s = Fo(r, 1) + En.fromHex(n).toCompactHex();
  return gy(s);
}
function d8(t) {
  return a8(t.data);
}
function h8(t, e, n) {
  return typeof t == "string" && (t = yy(t)), typeof n == "string" && (n = Uh(n)), {
    type: dt.Payload,
    payloadType: Mt.TokenTransfer,
    recipient: t,
    amount: rn(e, !1),
    memo: n ?? Uh("")
  };
}
function p8(t, e, n, r) {
  return typeof t == "string" && (t = kf(t)), typeof e == "string" && (e = Ws(e)), typeof n == "string" && (n = Ws(n)), {
    type: dt.Payload,
    payloadType: Mt.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Ph(t, e, n) {
  return typeof t == "string" && (t = Ws(t)), typeof e == "string" && (e = A8(e)), typeof n == "number" ? {
    type: dt.Payload,
    payloadType: Mt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: dt.Payload,
    payloadType: Mt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function g8() {
  return { type: dt.Payload, payloadType: Mt.PoisonMicroblock };
}
function _h(t, e) {
  if (t.byteLength != Ms)
    throw Error(`Coinbase buffer size must be ${Ms} bytes`);
  return e != null ? {
    type: dt.Payload,
    payloadType: Mt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: dt.Payload,
    payloadType: Mt.Coinbase,
    coinbaseBytes: t
  };
}
function y8(t, e, n) {
  if (t.byteLength != Ms)
    throw Error(`Coinbase buffer size must be ${Ms} bytes`);
  if (n.byteLength != ou)
    throw Error(`VRF proof buffer size must be ${ou} bytes`);
  return {
    type: dt.Payload,
    payloadType: Mt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Z.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var du;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(du || (du = {}));
function w8(t, e, n, r, i, s, o) {
  return {
    type: dt.Payload,
    payloadType: Mt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: i,
    cause: s,
    publicKeyHash: o
  };
}
function $y(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Mt.TokenTransfer:
      e.push($e(t.recipient)), e.push(hs(t.amount, !1, 8)), e.push(Ar(t.memo));
      break;
    case Mt.ContractCall:
      e.push(Ar(t.contractAddress)), e.push(Ar(t.contractName)), e.push(Ar(t.functionName));
      const n = new Uint8Array(4);
      qs(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push($e(r));
      });
      break;
    case Mt.SmartContract:
      e.push(Ar(t.contractName)), e.push(Ar(t.codeBody));
      break;
    case Mt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Ar(t.contractName)), e.push(Ar(t.codeBody));
      break;
    case Mt.PoisonMicroblock:
      break;
    case Mt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Mt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push($e(t.recipient));
      break;
    case Mt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push($e(t.recipient ? Ey(t.recipient) : Sy())), e.push(t.vrfProof);
      break;
    case Mt.TenureChange:
      e.push(fe(t.tenureHash)), e.push(fe(t.previousTenureHash)), e.push(fe(t.burnViewHash)), e.push(fe(t.previousTenureEnd)), e.push(qs(new Uint8Array(4), t.previousTenureBlocks)), e.push(W4(new Uint8Array(1), t.cause)), e.push(fe(t.publicKeyHash));
      break;
  }
  return Ie(e);
}
function b8(t) {
  switch (t.readUInt8Enum(Mt, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Mt.TokenTransfer:
      const n = Mn(t), r = rn(t.readBytes(8), !1), i = Iy(t);
      return h8(n, r, i);
    case Mt.ContractCall:
      const s = qi(t), o = Bn(t), a = Bn(t), c = [], u = t.readUInt32BE();
      for (let E = 0; E < u; E++) {
        const _ = Mn(t);
        c.push(_);
      }
      return p8(s, o, a, c);
    case Mt.SmartContract:
      const d = Bn(t), l = Bn(t, 4, 1e5);
      return Ph(d, l);
    case Mt.VersionedSmartContract: {
      const E = t.readUInt8Enum(au, (J) => {
        throw new Error(`Cannot recognize ClarityVersion: ${J}`);
      }), _ = Bn(t), M = Bn(t, 4, 1e5);
      return Ph(_, M, E);
    }
    case Mt.PoisonMicroblock:
      return g8();
    case Mt.Coinbase: {
      const E = t.readBytes(Ms);
      return _h(E);
    }
    case Mt.CoinbaseToAltRecipient: {
      const E = t.readBytes(Ms), _ = Mn(t);
      return _h(E, _);
    }
    case Mt.NakamotoCoinbase: {
      const E = t.readBytes(Ms), _ = Mn(t), M = t.readBytes(ou);
      return y8(E, _, M);
    }
    case Mt.TenureChange:
      const y = _t(t.readBytes(20)), p = _t(t.readBytes(20)), m = _t(t.readBytes(20)), x = _t(t.readBytes(32)), T = t.readUInt32BE(), K = t.readUInt8Enum(du, (E) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${E}`);
      }), V = _t(t.readBytes(20));
      return w8(y, p, m, x, T, K, V);
  }
}
class Mc extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class As extends Mc {
  constructor(e) {
    super(e);
  }
}
class Sn extends Mc {
  constructor(e) {
    super(e);
  }
}
class Ja extends Mc {
  constructor(e) {
    super(e);
  }
}
class Cs extends Mc {
  constructor(e) {
    super(e);
  }
}
var Rn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Rn || (Rn = {}));
function hu(t) {
  return gy(_t(t.readBytes(Tc)));
}
function Ii(t, e) {
  return {
    pubKeyEncoding: t,
    type: dt.TransactionAuthField,
    contents: e
  };
}
function m8(t) {
  const e = t.readUInt8Enum(Rn, (n) => {
    throw new Sn(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case Rn.PublicKeyCompressed:
      return Ii(ge.Compressed, fu(t));
    case Rn.PublicKeyUncompressed:
      return Ii(ge.Uncompressed, l8(fu(t).data));
    case Rn.SignatureCompressed:
      return Ii(ge.Compressed, hu(t));
    case Rn.SignatureUncompressed:
      return Ii(ge.Uncompressed, hu(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function If(t) {
  return fe(t.data);
}
function x8(t) {
  const e = [];
  switch (t.contents.type) {
    case dt.PublicKey:
      e.push(t.pubKeyEncoding === ge.Compressed ? Rn.PublicKeyCompressed : Rn.PublicKeyUncompressed), e.push(Qa(c8(t.contents.data)));
      break;
    case dt.MessageSignature:
      e.push(t.pubKeyEncoding === ge.Compressed ? Rn.SignatureCompressed : Rn.SignatureUncompressed), e.push(If(t.contents));
      break;
  }
  return Ie(e);
}
function Ar(t) {
  switch (t.type) {
    case dt.Address:
      return jo(t);
    case dt.Principal:
      return ky(t);
    case dt.LengthPrefixedString:
      return Wi(t);
    case dt.MemoString:
      return v8(t);
    case dt.AssetInfo:
      return Ly(t);
    case dt.PostCondition:
      return $8(t);
    case dt.PublicKey:
      return Qa(t);
    case dt.LengthPrefixedList:
      return Tf(t);
    case dt.Payload:
      return $y(t);
    case dt.TransactionAuthField:
      return x8(t);
    case dt.MessageSignature:
      return If(t);
  }
}
function S8() {
  return {
    type: dt.Address,
    version: Za.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Lf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === re.SerializeP2PKH || e === re.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === re.SerializeP2WPKH || e === re.SerializeP2WSH || e === re.SerializeP2WSHNonSequential) && !r.every(no))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case re.SerializeP2PKH:
      return po(t, z8(r[0].data));
    case re.SerializeP2WPKH:
      return po(t, R8(r[0].data));
    case re.SerializeP2SH:
    case re.SerializeP2SHNonSequential:
      return po(t, G8(n, r.map(Qa)));
    case re.SerializeP2WSH:
    case re.SerializeP2WSHNonSequential:
      return po(t, K8(n, r.map(Qa)));
  }
}
function jo(t) {
  const e = [];
  return e.push(fe(Fo(t.version, 1))), e.push(fe(t.hash160)), Ie(e);
}
function qi(t) {
  const e = Lc(_t(t.readBytes(1))), n = _t(t.readBytes(20));
  return { type: dt.Address, version: e, hash160: n };
}
function ky(t) {
  const e = [];
  return e.push(t.prefix), e.push(jo(t.address)), t.prefix === Co.Contract && e.push(Wi(t.contractName)), Ie(e);
}
function E8(t) {
  const e = t.readUInt8Enum(Co, (i) => {
    throw new Sn(`Unexpected Principal payload type: ${i}`);
  }), n = qi(t);
  if (e === Co.Standard)
    return { type: dt.Principal, prefix: e, address: n };
  const r = Bn(t);
  return {
    type: dt.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Wi(t) {
  const e = [], n = eo(t.content), r = n.byteLength;
  return e.push(fe(Fo(r, t.lengthPrefixBytes))), e.push(n), Ie(e);
}
function Bn(t, e, n) {
  e = e || 1;
  const r = Lc(_t(t.readBytes(e))), i = xf(t.readBytes(r));
  return Ws(i, e, n ?? 128);
}
function A8(t) {
  return Ws(t, 4, 1e5);
}
function Uh(t) {
  if (t && My(t, Xa))
    throw new Error(`Memo exceeds maximum length of ${Xa} bytes`);
  return { type: dt.MemoString, content: t };
}
function v8(t) {
  const e = [], n = eo(t.content), r = j8(_t(n), Xa * 2);
  return e.push(fe(r)), Ie(e);
}
function Iy(t) {
  let e = xf(t.readBytes(Xa));
  return e = e.replace(/\u0000*$/, ""), { type: dt.MemoString, content: e };
}
function Ly(t) {
  const e = [];
  return e.push(jo(t.address)), e.push(Wi(t.contractName)), e.push(Wi(t.assetName)), Ie(e);
}
function pu(t) {
  return {
    type: dt.AssetInfo,
    address: qi(t),
    contractName: Bn(t),
    assetName: Bn(t)
  };
}
function Cf(t, e) {
  return {
    type: dt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Tf(t) {
  const e = t.values, n = [];
  n.push(fe(Fo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Ar(r));
  return Ie(n);
}
function Cy(t, e, n) {
  const r = Lc(_t(t.readBytes(4))), i = [];
  for (let s = 0; s < r; s++)
    switch (e) {
      case dt.Address:
        i.push(qi(t));
        break;
      case dt.LengthPrefixedString:
        i.push(Bn(t));
        break;
      case dt.MemoString:
        i.push(Iy(t));
        break;
      case dt.AssetInfo:
        i.push(pu(t));
        break;
      case dt.PostCondition:
        i.push(k8(t));
        break;
      case dt.PublicKey:
        i.push(fu(t));
        break;
      case dt.TransactionAuthField:
        i.push(m8(t));
        break;
    }
  return Cf(i, n);
}
function $8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(ky(t.principal)), (t.conditionType === fn.Fungible || t.conditionType === fn.NonFungible) && e.push(Ly(t.assetInfo)), t.conditionType === fn.NonFungible && e.push($e(t.assetName)), e.push(t.conditionCode), t.conditionType === fn.STX || t.conditionType === fn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new As("The post-condition amount may not be larger than 8 bytes");
    e.push(hs(t.amount, !1, 8));
  }
  return Ie(e);
}
function k8(t) {
  const e = t.readUInt8Enum(fn, (o) => {
    throw new Sn(`Could not read ${o} as PostConditionType`);
  }), n = E8(t);
  let r, i, s;
  switch (e) {
    case fn.STX:
      return r = t.readUInt8Enum(Lo, (a) => {
        throw new Sn(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${_t(t.readBytes(8))}`), {
        type: dt.PostCondition,
        conditionType: fn.STX,
        principal: n,
        conditionCode: r,
        amount: s
      };
    case fn.Fungible:
      return i = pu(t), r = t.readUInt8Enum(Lo, (a) => {
        throw new Sn(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${_t(t.readBytes(8))}`), {
        type: dt.PostCondition,
        conditionType: fn.Fungible,
        principal: n,
        conditionCode: r,
        amount: s,
        assetInfo: i
      };
    case fn.NonFungible:
      i = pu(t);
      const o = Mn(t);
      return r = t.readUInt8Enum(cu, (a) => {
        throw new Sn(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: dt.PostCondition,
        conditionType: fn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: i,
        assetName: o
      };
  }
}
function dr(t, e) {
  return Ie([t, e]);
}
function I8(t) {
  return new Uint8Array([t.type]);
}
function L8(t) {
  return t.type === Z.OptionalNone ? new Uint8Array([t.type]) : dr(t.type, $e(t.value));
}
function C8(t) {
  const e = new Uint8Array(4);
  return qs(e, t.buffer.length, 0), dr(t.type, Cc(e, t.buffer));
}
function T8(t) {
  const e = mf(H4(t.value, BigInt(Q4)), cy);
  return dr(t.type, e);
}
function B8(t) {
  const e = mf(t.value, cy);
  return dr(t.type, e);
}
function M8(t) {
  return dr(t.type, jo(t.address));
}
function N8(t) {
  return dr(t.type, Cc(jo(t.address), Wi(t.contractName)));
}
function P8(t) {
  return dr(t.type, $e(t.value));
}
function _8(t) {
  const e = [], n = new Uint8Array(4);
  qs(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const i = $e(r);
    e.push(i);
  }
  return dr(t.type, Ie(e));
}
function U8(t) {
  const e = [], n = new Uint8Array(4);
  qs(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = Ws(i);
    e.push(Wi(s));
    const o = $e(t.data[i]);
    e.push(o);
  }
  return dr(t.type, Ie(e));
}
function Ty(t, e) {
  const n = [], r = e == "ascii" ? oy(t.data) : eo(t.data), i = new Uint8Array(4);
  return qs(i, r.length, 0), n.push(i), n.push(r), dr(t.type, Ie(n));
}
function H8(t) {
  return Ty(t, "ascii");
}
function O8(t) {
  return Ty(t, "utf8");
}
function $e(t) {
  switch (t.type) {
    case Z.BoolTrue:
    case Z.BoolFalse:
      return I8(t);
    case Z.OptionalNone:
    case Z.OptionalSome:
      return L8(t);
    case Z.Buffer:
      return C8(t);
    case Z.UInt:
      return B8(t);
    case Z.Int:
      return T8(t);
    case Z.PrincipalStandard:
      return M8(t);
    case Z.PrincipalContract:
      return N8(t);
    case Z.ResponseOk:
    case Z.ResponseErr:
      return P8(t);
    case Z.List:
      return _8(t);
    case Z.Tuple:
      return U8(t);
    case Z.StringASCII:
      return H8(t);
    case Z.StringUTF8:
      return O8(t);
    default:
      throw new As("Unable to serialize. Invalid Clarity Value.");
  }
}
function D8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Hh = /* @__PURE__ */ new Map();
function By(t, e) {
  const n = Hh.get(t);
  if (n !== void 0)
    return n(e);
  const r = D8(t);
  return Hh.set(t, r), By(t, e);
}
class mo {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return X4(this.readBytes(4), 0);
  }
  readUInt8() {
    return q4(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return K4(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = _t(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = _t(n);
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
    if (By(e, r))
      return r;
    throw n(r);
  }
}
function Mn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new mo(fe(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new mo(t) : e = t;
  switch (e.readUInt8Enum(Z, (r) => {
    throw new Sn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Z.Int:
      return t8(e.readBytes(16));
    case Z.UInt:
      return ar(e.readBytes(16));
    case Z.Buffer:
      const r = e.readUInt32BE();
      return xy(e.readBytes(r));
    case Z.BoolTrue:
      return by();
    case Z.BoolFalse:
      return my();
    case Z.PrincipalStandard:
      const i = qi(e);
      return Yv(i);
    case Z.PrincipalContract:
      const s = qi(e), o = Bn(e);
      return wy(s, o);
    case Z.ResponseOk:
      return n8(Mn(e));
    case Z.ResponseErr:
      return e8(Mn(e));
    case Z.OptionalNone:
      return Sy();
    case Z.OptionalSome:
      return Ey(Mn(e));
    case Z.List:
      const a = e.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(Mn(e));
      return r8(c);
    case Z.Tuple:
      const u = e.readUInt32BE(), d = {};
      for (let x = 0; x < u; x++) {
        const T = Bn(e).content;
        if (T === void 0)
          throw new Sn('"content" is undefined');
        d[T] = Mn(e);
      }
      return Xs(d);
    case Z.StringASCII:
      const l = e.readUInt32BE(), y = j4(e.readBytes(l));
      return Re(y);
    case Z.StringUTF8:
      const p = e.readUInt32BE(), m = xf(e.readBytes(p));
      return s8(m);
    default:
      throw new Sn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const F8 = (t) => t.length % 2 == 0 ? t : `0${t}`, j8 = (t, e) => t.padEnd(e, "0"), My = (t, e) => t ? eo(t).length > e : !1;
function gu(t) {
  return Zp(t);
}
const To = (t) => yv($f(t)), Bf = (t) => _t(qv(t)), z8 = (t) => _t(To(t)), R8 = (t) => {
  const e = To(t), n = Cc(new Uint8Array([0]), new Uint8Array([e.length]), e), r = To(n);
  return _t(r);
}, G8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + e.length), n.push(174);
  const r = Ie(n), i = To(r);
  return _t(i);
}, K8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ie(n), i = $f(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = Ie(s), a = To(o);
  return _t(a);
};
function V8(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Ny(t) {
  const e = $e(t);
  return `0x${_t(e)}`;
}
function q8(t) {
  return Mn(t);
}
const Ti = (t) => {
  try {
    return ri.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Mf() {
  return {
    type: dt.MessageSignature,
    data: _t(new Uint8Array(Tc))
  };
}
function Py(t, e, n, r) {
  const i = Lf(0, t, 1, [Vi(e)]).hash160, s = no(Vi(e)) ? ge.Compressed : ge.Uncompressed;
  return {
    hashMode: t,
    signer: i,
    nonce: rn(n, !1),
    fee: rn(r, !1),
    keyEncoding: s,
    signature: Mf()
  };
}
function Bo(t) {
  return "signature" in t;
}
function Oh(t) {
  return t === re.SerializeP2SH || t === re.SerializeP2WSH;
}
function W8(t) {
  return t === re.SerializeP2SHNonSequential || t === re.SerializeP2WSHNonSequential;
}
function Dh(t) {
  const e = gu(t);
  return e.nonce = 0, e.fee = 0, Bo(e) ? e.signature = Mf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function X8(t) {
  const e = [
    t.hashMode,
    fe(t.signer),
    hs(t.nonce, !1, 8),
    hs(t.fee, !1, 8),
    t.keyEncoding,
    If(t.signature)
  ];
  return Ie(e);
}
function Y8(t) {
  const e = [
    t.hashMode,
    fe(t.signer),
    hs(t.nonce, !1, 8),
    hs(t.fee, !1, 8)
  ], n = Cf(t.fields);
  e.push(Tf(n));
  const r = new Uint8Array(2);
  return V4(r, t.signaturesRequired, 0), e.push(r), Ie(e);
}
function Z8(t, e) {
  const n = _t(e.readBytes(20)), r = BigInt(`0x${_t(e.readBytes(8))}`), i = BigInt(`0x${_t(e.readBytes(8))}`), s = e.readUInt8Enum(ge, (a) => {
    throw new Sn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === re.SerializeP2WPKH && s != ge.Compressed)
    throw new Sn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = hu(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    keyEncoding: s,
    signature: o
  };
}
function Q8(t, e) {
  const n = _t(e.readBytes(20)), r = BigInt("0x" + _t(e.readBytes(8))), i = BigInt("0x" + _t(e.readBytes(8))), s = Cy(e, dt.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case dt.PublicKey:
        no(u.contents) || (o = !0);
        break;
      case dt.MessageSignature:
        if (u.pubKeyEncoding === ge.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Cs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === re.SerializeP2WSH || t === re.SerializeP2WSHNonSequential))
    throw new Cs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: c
  };
}
function sl(t) {
  return Bo(t) ? X8(t) : Y8(t);
}
function il(t) {
  const e = t.readUInt8Enum(re, (n) => {
    throw new Sn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === re.SerializeP2PKH || e === re.SerializeP2WPKH ? Z8(e, t) : Q8(e, t);
}
function _y(t, e, n, r) {
  const s = t + _t(new Uint8Array([e])) + _t(hs(n, !1, 8)) + _t(hs(r, !1, 8));
  if (fe(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Bf(fe(s));
}
function Uy(t, e, n) {
  const r = 33 + Tc, i = no(e) ? ge.Compressed : ge.Uncompressed, s = t + F8(i.toString(16)) + n.data, o = fe(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Bf(o);
}
function J8(t, e, n, r, i) {
  const s = _y(t, e, n, r), o = f8(i, s), a = d8(i), c = Uy(s, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Hy(t, e, n, r, i, s) {
  const o = _y(t, e, n, r), a = Vi(i8(o, s, i)), c = Uy(o, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function t5() {
  const t = Py(re.SerializeP2PKH, "", 0, 0);
  return t.signer = S8().hash160, t.keyEncoding = ge.Compressed, t.signature = Mf(), t;
}
function Fh(t, e, n) {
  return Bo(t) ? e5(t, e, n) : n5(t, e, n);
}
function e5(t, e, n) {
  const { pubKey: r, nextSigHash: i } = Hy(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), s = Lf(0, t.hashMode, 1, [r]).hash160;
  if (s !== t.signer)
    throw new Cs(`Signer hash does not equal hash of public key(s): ${s} != ${t.signer}`);
  return i;
}
function n5(t, e, n) {
  const r = [];
  let i = e, s = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case dt.PublicKey:
        no(c.contents) || (s = !0), r.push(c.contents);
        break;
      case dt.MessageSignature:
        c.pubKeyEncoding === ge.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: d } = Hy(i, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Oh(t.hashMode) && (i = d), r.push(u), o += 1, o === 65536)
          throw new Cs("Too many signatures");
        break;
    }
  if (Oh(t.hashMode) && o !== t.signaturesRequired || W8(t.hashMode) && o < t.signaturesRequired)
    throw new Cs("Incorrect number of signatures");
  if (s && (t.hashMode === re.SerializeP2WSH || t.hashMode === re.SerializeP2WSHNonSequential))
    throw new Cs("Uncompressed keys are not allowed in this hash mode");
  const a = Lf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Cs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return i;
}
function Oy(t) {
  return {
    authType: Se.Standard,
    spendingCondition: t
  };
}
function Dy(t, e) {
  return {
    authType: Se.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Py(re.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function jh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Se.Standard:
        return Oy(Dh(t.spendingCondition));
      case Se.Sponsored:
        return Dy(Dh(t.spendingCondition), t5());
      default:
        throw new Ja("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function r5(t, e) {
  switch (t.authType) {
    case Se.Standard:
      return Fh(t.spendingCondition, e, Se.Standard);
    case Se.Sponsored:
      return Fh(t.spendingCondition, e, Se.Standard);
    default:
      throw new Ja("Invalid origin auth type");
  }
}
function s5(t, e) {
  switch (t.authType) {
    case Se.Standard:
      const n = {
        ...t.spendingCondition,
        fee: rn(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Se.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: rn(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function i5(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: rn(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function o5(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: rn(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function a5(t, e) {
  const n = {
    ...e,
    nonce: rn(e.nonce, !1),
    fee: rn(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function c5(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Se.Standard:
      e.push(sl(t.spendingCondition));
      break;
    case Se.Sponsored:
      e.push(sl(t.spendingCondition)), e.push(sl(t.sponsorSpendingCondition));
      break;
  }
  return Ie(e);
}
function l5(t) {
  const e = t.readUInt8Enum(Se, (r) => {
    throw new Sn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Se.Standard:
      return n = il(t), Oy(n);
    case Se.Sponsored:
      n = il(t);
      const r = il(t);
      return Dy(n, r);
  }
}
class u5 {
  constructor(e, n, r, i, s, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: rn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? Y4, this.postConditionMode = s ?? Ki.Deny, this.postConditions = i ?? Cf([]), o)
      this.anchorMode = ev(o);
    else
      switch (r.payloadType) {
        case Mt.Coinbase:
        case Mt.CoinbaseToAltRecipient:
        case Mt.NakamotoCoinbase:
        case Mt.PoisonMicroblock:
        case Mt.TenureChange:
          this.anchorMode = un.OnChainOnly;
          break;
        case Mt.ContractCall:
        case Mt.SmartContract:
        case Mt.VersionedSmartContract:
        case Mt.TokenTransfer:
          this.anchorMode = un.Any;
          break;
      }
  }
  signBegin() {
    const e = gu(this);
    return e.auth = jh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = gu(this);
    return e.auth = jh(e.auth), e.txid();
  }
  verifyOrigin() {
    return r5(this.auth, this.verifyBegin());
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
    if (n && !Bo(n)) {
      const r = no(e);
      n.fields.push(Ii(r ? ge.Compressed : ge.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, i) {
    const { nextSig: s, nextSigHash: o } = J8(n, r, e.fee, e.nonce, i);
    return Bo(e) ? e.signature = s : e.fields.push(Ii(i.data.byteLength === ay ? ge.Compressed : ge.Uncompressed, s)), o;
  }
  txid() {
    const e = this.serialize();
    return Bf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Se.Sponsored)
      throw new Ja("Cannot sponsor sign a non-sponsored transaction");
    this.auth = a5(this.auth, e);
  }
  setFee(e) {
    this.auth = s5(this.auth, e);
  }
  setNonce(e) {
    this.auth = i5(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Se.Sponsored)
      throw new Ja("Cannot sponsor sign a non-sponsored transaction");
    this.auth = o5(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new As('"version" is undefined');
    if (this.chainId === void 0)
      throw new As('"chainId" is undefined');
    if (this.auth === void 0)
      throw new As('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new As('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new As('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return qs(n, this.chainId, 0), e.push(n), e.push(c5(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Tf(this.postConditions)), e.push($y(this.payload)), Ie(e);
  }
}
function tc(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new mo(fe(t.slice(2))) : e = new mo(fe(t)) : t instanceof Uint8Array ? e = new mo(t) : e = t;
  const n = e.readUInt8Enum(Ya, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), i = l5(e), s = e.readUInt8Enum(un, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(Ki, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = Cy(e, dt.PostCondition), c = b8(e);
  return new u5(n, i, c, a, o, s, r);
}
const f5 = Qv, xo = ar, d5 = xy;
const h5 = /* @__PURE__ */ new Set([4001, -31001]), p5 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], g5 = ["result", "data", "payload", "response", "params"], zh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Nc = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), ai = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, kr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, y5 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Fy = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, i) => !!(r != null && r.id) && n.findIndex((s) => y5(s, r)) === i
  );
}, jy = (t) => t ? Fy(ai()).some(
  (e) => {
    var n;
    return e.id === t && (Nc(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, zy = () => {
  if (typeof window > "u")
    return;
  const t = ai(), e = Fy(t).filter(
    (n) => {
      var r;
      return Nc(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = kr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of p5) {
    const r = kr(t, n) ?? (t === window ? void 0 : kr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, w5 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = ai(), n = kr(e, t) ?? (e === window ? void 0 : kr(window, t)) ?? mc(t);
  if (n)
    return n;
  if (Nc(t) || jy(t))
    return zy();
}, ya = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, b5 = ["blockstack-session", "blockstack"], m5 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of b5) {
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
m5();
const Ry = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, mn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, x5 = (t) => {
  const e = mn(t);
  if (!e)
    return null;
  const n = Ry(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, S5 = (t) => {
  const e = mn(t);
  if (!e)
    return null;
  const n = Ry(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, yu = (t, e = "mainnet") => {
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
      return yu(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return yu(r, e);
  }
  return e;
}, Ns = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, Mo = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const i = t.trim();
    return Ti(i) ? i : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const i of t) {
      const s = Mo(i, e + 1);
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
    const s = Mo(n[i], e + 1);
    if (s)
      return s;
  }
  return typeof n.mainnet == "string" && Ti(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Ti(n.testnet) ? n.testnet.trim() : null;
}, Rh = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Gy = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && h5.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Ys = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = mn(n == null ? void 0 : n.message) ?? mn(e.message) ?? mn(e.error) ?? mn(t) ?? "Wallet provider request failed.", i = new Error(r);
  return i.code = (n == null ? void 0 : n.code) ?? e.code, i.data = (n == null ? void 0 : n.data) ?? e.data, i;
}, Xi = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Ys(e);
    if (e.status === "error")
      throw Ys(e.result ?? e);
  }
  return t;
}, Gh = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Xi(r);
  } catch (r) {
    throw Ys(r);
  }
}, Ky = () => zy(), Nf = () => {
  if (typeof window > "u")
    return;
  const t = ai();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = kr(t, e) ?? (t === window ? void 0 : kr(window, e));
    if (n)
      return n;
  }
}, Kh = () => {
  if (typeof window > "u")
    return;
  const t = Nf();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = ai();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = kr(e, n) ?? (e === window ? void 0 : kr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Ca = (t) => {
  var r, i;
  const e = Fs();
  if (Nc(e) || jy(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = ai() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((i = n.xverseProviders) == null ? void 0 : i.StacksProvider) || t === Ky();
}, ol = (t) => {
  const e = S5(t);
  if (!e)
    return null;
  try {
    const n = tc(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, ec = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = ol(t), r = x5(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? mn(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = ec(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const i = t;
  let s = null;
  for (const a of zh)
    if (ol(i[a])) {
      s = mn(i[a]);
      break;
    }
  const o = mn(i.txId) || mn(i.txid) || mn(i.transactionId);
  if (o)
    return {
      ...i,
      txId: o,
      txid: o,
      txRaw: s ?? mn(i.txRaw) ?? void 0
    };
  for (const a of zh) {
    const c = ol(i[a]);
    if (c)
      return {
        ...i,
        txId: c,
        txid: c,
        txRaw: mn(i[a]) ?? void 0
      };
  }
  for (const a of g5) {
    const c = i[a], u = ec(c, e + 1);
    if (u)
      return {
        ...i,
        ...c && typeof c == "object" ? c : {},
        ...u,
        txId: u.txId,
        txid: u.txid ?? u.txId
      };
  }
  return null;
}, al = (t) => {
  const e = ec(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, E5 = (t) => {
  const e = ec(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, A5 = (t) => ({
  ...t,
  fee: Ns(t.fee),
  nonce: Ns(t.nonce),
  sponsored: t.sponsored === !0
}), Vh = (t) => ({
  recipient: t.recipient,
  amount: Ns(t.amount) ?? "0",
  memo: t.memo,
  network: yu(t.network),
  address: t.stxAddress,
  fee: Ns(t.fee),
  nonce: Ns(t.nonce),
  sponsored: t.sponsored ?? !1
}), Vy = "WALLET_ADDRESS_MISMATCH", v5 = 45e3;
let So = null;
const wu = (t) => {
  t && (So = { address: t, at: Date.now() });
}, $5 = () => {
  So = null;
}, k5 = () => So && Date.now() - So.at <= v5 ? So.address : null, I5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, L5 = async (t) => {
  $5();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = Xi(await t.request("wallet_connect")), n = Mo(e);
  return wu(n), n;
}, C5 = async (t, e, n, r) => {
  try {
    return Xi(await t.request(e, n));
  } catch (i) {
    const s = Ys(i);
    if (!I5(s))
      throw s;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: s.message
    });
    let o = null;
    try {
      o = await L5(t);
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
        { code: o ? Vy : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return Xi(await t.request(e, n));
    } catch (a) {
      throw Ys(a);
    }
  }
};
let qh = 3e4;
const T5 = (t, e) => {
  let n;
  const r = new Promise((i, s) => {
    n = setTimeout(() => {
      s(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${qh / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, qh);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, B5 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Vy }
      );
    return c;
  }, i = k5();
  if (i)
    return ya(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: i }), r(i, "cached-session");
  let s = null;
  ya(n, "account-read");
  try {
    const c = Xi(
      await T5(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    s = Mo(c), console.info("[wallet:xverse-preflight]", {
      stage: s ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: s
    });
  } catch (c) {
    if (Gy(c))
      throw Ys(c);
    ya(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (s)
    return wu(s), r(s, "wallet_getAccount");
  let o;
  ya(n, "account-reconnect");
  try {
    o = Xi(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Ys(c);
  }
  const a = Mo(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return wu(a), r(a, "wallet_connect");
}, M5 = async (t, e) => {
  if (!Ca(t)) {
    const s = await Gh(
      t,
      "stx_transferStx",
      Vh(e)
    );
    return al(s);
  }
  const n = Nf();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const s = await Gh(
      n,
      "stx_transferStx",
      Vh(e)
    );
    return al(s);
  }
  const r = Ky();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await B5(r, e.stxAddress);
  const i = await C5(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: Ns(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: Ns(e.fee) } : {}
    },
    e.stxAddress
  );
  return al(i);
}, N5 = () => Fs(), qy = () => {
  var r, i;
  if (typeof window > "u")
    return;
  const t = Fs(), e = t ? w5(t) : void 0;
  if (e)
    return e;
  const n = ai() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((i = n.xverseProviders) == null ? void 0 : i.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Wh = (t, e) => {
  const n = qy(), r = A5({
    ...t,
    onFinish: (i) => {
      var s;
      (s = t.onFinish) == null || s.call(t, E5(i));
    }
  });
  if (!n || typeof n.request != "function")
    return da(r, e);
  if (Ca(n) && !Nf()) {
    const i = Kh();
    if (i)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Fs(),
        route: "legacy-transaction-request"
      }), da(r, i);
  }
  return void M5(n, t).then((i) => {
    var s;
    (s = t.onFinish) == null || s.call(t, i);
  }).catch((i) => {
    var s, o;
    if (Rh(i) && Ca(n)) {
      const a = Kh();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Fs(),
          route: "legacy-transaction-request"
        }), da(r, a);
        return;
      }
    }
    if (Rh(i) && !Ca(n)) {
      da(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", i), Gy(i)) {
      (s = t.onCancel) == null || s.call(t);
      return;
    }
    if (t.onError) {
      t.onError(i);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Xh = (t) => Ny(t).replace(/^0x/, ""), Yh = "This wallet cannot sign messages. Try Xverse or Leather.", Zh = (t) => typeof (t == null ? void 0 : t.request) == "function", Qh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", P5 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, _5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function U5(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Xh(e.message),
    domain: Xh(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function H5(t, e) {
  const n = await T4({
    domain: e.domain,
    message: e.message,
    network: Ic(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Jh(t) {
  var i, s;
  const e = N5() || "", n = /xverse/i.test(e);
  let r = qy();
  if (n && !Qh(r)) {
    const o = window;
    r = ((i = o.XverseProviders) == null ? void 0 : i.StacksProvider) ?? ((s = o.xverseProviders) == null ? void 0 : s.StacksProvider);
  }
  if (Qh(r))
    try {
      return await H5(r, t);
    } catch (o) {
      if (n || !Zh(r) || !_5(o)) throw o;
    }
  if (!n && Zh(r))
    try {
      return await U5(r, t);
    } catch (o) {
      throw P5(o) ? new Error(Yh) : o;
    }
  throw new Error(Yh);
}
const t0 = 1000000n, Ts = 1000000n, nc = 50n, Ne = 3000n, ci = 300n, co = 3000n, O5 = 50000n, cl = 200n, Pc = 15000n, xn = (t) => t + nc;
function tr(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / t0}.${(n % t0).toString().padStart(6, "0")}`;
}
function e0(t, e = ci) {
  return t <= Ne ? 0 : Number((t - Ne) / xn(e));
}
function ll(t, e = 0n) {
  const n = Ts - t - e;
  return n > 0n ? n : 0n;
}
function D5(t, e = ci) {
  return t > Ts ? "over" : t < Ne + xn(e) ? "empty" : t < O5 ? "low" : "ok";
}
const F5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", j5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", z5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function R5(t) {
  var n, r, i, s;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((i = e["holder-payment"]) == null ? void 0 : i.value) !== "50" || ((s = e["receipt-bytes"]) == null ? void 0 : s.value) !== "16" || z5.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== F5 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Wy = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", ul = 3, G5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [bu, Xy] = Wy.split("."), Ln = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function mu(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function K5(t) {
  return Ln(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function fs(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Yy(t, e = []) {
  const n = await fs(`/v2/contracts/call-read/${bu}/${Xy}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: bu, arguments: e.map((r) => "0x" + Ln($e(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return rr(Mn(n.result));
}
async function V5() {
  const t = await fs(`/v2/contracts/source/${bu}/${Xy}?proof=0`);
  if (typeof t.source != "string" || await K5(t.source) !== j5) throw Error("Deployed source does not match the tested helper.");
  if (R5(await Yy("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Zy(t) {
  return t.startsWith("SP") && Ti(t) && !t.includes(".");
}
async function q5(t) {
  var r;
  if (!Zy(t)) throw Error("Invalid mainnet wallet address.");
  const e = await fs(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await fs(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function W5(t) {
  const e = await fs(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function X5(t, e) {
  var i, s;
  const n = await Yy("get-owner", [xo(t), xo(e)]), r = (n == null ? void 0 : n.success) === !0 ? (s = (i = n.value) == null ? void 0 : i.value) == null ? void 0 : s.value : null;
  if (typeof r != "string" || !Zy(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function Y5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: mu(t), signal: AbortSignal.timeout(15e3) });
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
async function Z5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function Q5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = tc(mu(t.raw)), n = e.auth, r = e.payload, i = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || i.hashMode !== 0 || ki(po(Za.MainnetSingleSig, i.signer)) !== t.address || i.fee !== BigInt(t.fee) || i.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const s = e.postConditions.values[0];
    if (r.payloadType !== 2 || ki(r.contractAddress) + "." + r.contractName.content !== Wy || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Ln($e(r.functionArgs[0])) !== Ln($e(xo(t.core))) || Ln($e(r.functionArgs[1])) !== Ln($e(xo(t.song))) || Ln($e(r.functionArgs[2])) !== Ln($e(d5(mu(t.id)))) || t.amount !== "50" || e.postConditionMode !== Ki.Deny || e.postConditions.values.length !== 1 || s.conditionType !== 0 || s.amount !== 50n || s.conditionCode !== Lo.Equal || s.principal.prefix !== 2 || ki(s.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || ki(r.contractAddress) + "." + r.contractName.content !== G5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Ln($e(r.functionArgs[0])) !== Ln($e(xo(t.song))) || typeof t.liked != "boolean" || Ln($e(r.functionArgs[1])) !== Ln($e(f5(t.liked))) || t.amount !== "0" || e.postConditionMode !== Ki.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || rr(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const J5 = "xtrata.xyz/radio/listening-wallet", t6 = "Link a temporary listening wallet for pay-per-play; no spending permission", Zs = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && Ti(t), e6 = (t) => ({
  domain: Xs({ name: Re(J5), version: Re("1"), "chain-id": ar(1) }),
  message: Xs({
    purpose: Re(t6),
    main: Re(t.main),
    listening: Re(t.listening),
    issued: ar(t.issued)
  })
}), Qy = 100000n, n6 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function r6(t, e) {
  const n = t.filter((i) => !i || typeof i.sender != "string" || i.sender === e || !Zs(i.sender) || !/^\d+$/.test(i.amount) ? !1 : BigInt(i.amount) >= Qy).sort(n6);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((i) => i.sender)).size };
}
const wa = 50;
function rc(t) {
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
async function s6(t, e, n = 4) {
  if (!Zs(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${wa}&offset=${o}`, i = rc(await e(r(0)));
    if (!i || i.total > 0 && !i.transfers.length) return { ok: !1 };
    if (i.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let s = Math.max(0, i.total - wa);
    for (let o = 0; o < n; o++) {
      const a = s === 0 && i.total <= wa ? i : rc(await e(r(s)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = r6(a.transfers, t);
      if (c.ok && c.funder) return s > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (s === 0) return c;
      s = Math.max(0, s - wa);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const xr = 50, i6 = 6, o6 = 20, n0 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function r0(t, e) {
  const n = t;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], i = [];
  for (const s of n.results) {
    const o = s && typeof s == "object" && s.tx && typeof s.tx == "object" ? s.tx : s;
    if (!o || typeof o.tx_id != "string" || typeof o.tx_type != "string") return null;
    if (i.push(o.tx_id), o.tx_type !== "token_transfer" || o.sender_address !== e || o.tx_status !== "success") continue;
    const a = o.token_transfer;
    if (!a || typeof a.recipient_address != "string" || typeof a.amount != "string" || !/^\d+$/.test(a.amount)) return null;
    const c = Number(o.block_height), u = Number(o.tx_index ?? 0);
    if (!Number.isSafeInteger(c) || !Number.isSafeInteger(u)) return null;
    r.push({ recipient: a.recipient_address, amount: BigInt(a.amount), txId: o.tx_id, blockHeight: c, txIndex: u });
  }
  return { total: n.total, sent: r, rows: i };
}
async function a6(t, e, n) {
  if (!Zs(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), i = rc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${xr}&offset=0`));
    if (!i || i.total > i6 * xr) return { ok: !1 };
    for (const o of i.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = xr; o < i.total; o += xr) {
      const a = rc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${xr}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== i.total) return { ok: !1 };
    const s = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${xr}&offset=${u}`, a = r0(await e(o(0)), t);
      if (!a || a.total > o6 * xr) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) s.set(u.txId, u);
      for (let u = xr; u < a.total; u += xr) {
        const d = r0(await e(o(u)), t);
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
function c6(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const i = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(n0).map((l, y) => {
    const p = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: p, kind: "gift", to: r.payer, at: y } : Zs(l.sender) && p >= Qy ? { sender: l.sender, left: p, kind: "deposit", to: l.sender, at: y } : { sender: l.sender, left: p, kind: "dust", to: null, at: y };
  }), s = i.reduce((l, y) => l + y.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && Zs(l.recipient) && l.amount > 0n).sort(n0), a = o.reduce((l, y) => l + y.amount, 0n), c = s - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (l, y) => {
    let p = y;
    for (const m of l) {
      if (p <= 0n) break;
      const x = m.left < p ? m.left : p;
      m.left -= x, p -= x;
    }
    return p;
  };
  for (const l of o) {
    const y = u(i.filter((p) => p.to === l.recipient), l.amount);
    y > 0n && u(i, y);
  }
  if (u(i, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (i.reduce((l, y) => l + y.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const d = /* @__PURE__ */ new Map();
  for (const l of i) {
    if (l.left <= 0n) continue;
    const y = `${l.kind}:${l.to ?? ""}`, p = d.get(y);
    p ? (p.amount += l.left, p.newest = Math.max(p.newest, l.at)) : d.set(y, { to: l.to, kind: l.kind, amount: l.left, newest: l.at });
  }
  return {
    ok: !0,
    parts: [...d.values()].sort((l, y) => l.newest - y.newest),
    hasTopUp: i.some((l) => l.kind === "deposit")
  };
}
function l6(t, e) {
  const n = t.filter((u) => u.kind === "deposit").sort((u, d) => u.newest - d.newest), r = t.find((u) => u.kind === "gift"), i = t.filter((u) => u.kind === "dust"), s = ((r == null ? void 0 : r.amount) ?? 0n) + i.reduce((u, d) => u + d.amount, 0n), o = [], a = [], c = s > e;
  return n.forEach((u, d) => {
    if (u.amount <= e) {
      a.push(u);
      return;
    }
    const l = d === n.length - 1 && !c;
    o.push({ to: u.to, kind: "deposit", mode: l ? "all" : "amount", send: u.amount - e });
  }), c ? o.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: s - e }) : (r && a.push(r), a.push(...i)), { steps: o, tooSmall: a };
}
function s0(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const Ta = [100, 250, 500], u6 = (t, e) => BigInt(t) * xn(e), lo = ["prepared", "signed", "unknown", "pending"], f6 = 30 * 6e4, i0 = 6e4, mi = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, d6 = 3e3, o0 = "Your main listener wallet is out of funds, so likes are paused. Top it up (it only needs a little) and your likes carry on.", fl = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function h6(t) {
  let e = null, n = -1 / 0, r, i = null, s = null, o, a = -1 / 0, c = null, u = null, d = !1, l = !1, y = !1, p = null, m = !1, x = "", T = "", K = 0, V, E = null, _, M = [], J, et = -1 / 0;
  const q = /* @__PURE__ */ new Set();
  let Y = null, v = !1, N = 0, b = null, C = null, D = !1, L = null, I = !1, F = null, gt = !1, A = !1, U = !1, it = !1, ot = !1, at = 0, $t = null, ae = Promise.resolve();
  const lt = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? ci.toString()), zt = (w) => !!s && !(s.features ?? []).includes(w), Bt = (w, $) => `xtrata.ppp.v1.${w}:${$}`, Ut = (w = s == null ? void 0 : s.address) => {
    if (!w) return [];
    try {
      const $ = JSON.parse(t.store.get(Bt("entries", w)) || "[]");
      return Array.isArray($) ? $ : [];
    } catch {
      return [];
    }
  }, wt = (w) => {
    const $ = [w, ...Ut(w.address).filter((X) => !(X.txid === w.txid && X.kind === w.kind))].slice(0, 200);
    t.store.set(Bt("entries", w.address), JSON.stringify($));
  }, ce = (w = s == null ? void 0 : s.address) => !!w && t.store.get(Bt("on", w)) !== "0", sn = (w) => {
    s != null && s.address && t.store.set(Bt("on", s.address), w ? "1" : "0");
  }, De = () => Ut().filter((w) => lo.includes(w.status)), Ye = () => Jt() ? [...De(), ...Ut(Gt()).filter((w) => lo.includes(w.status))] : De(), Pe = () => _e(s == null ? void 0 : s.address), _e = (w) => {
    if (!w) return null;
    try {
      return JSON.parse(t.store.get(Bt("deposit", w)) || "null");
    } catch {
      return null;
    }
  }, ie = (w, $ = s == null ? void 0 : s.address) => {
    $ && t.store.set(Bt("deposit", $), JSON.stringify(w));
  };
  let Ot = null;
  const on = (w = i0) => {
    const $ = t.now();
    Ot = { since: Ot && $ < Ot.until ? Ot.since : $, until: Math.max((Ot == null ? void 0 : Ot.until) ?? 0, $ + w) };
  }, Te = () => !!Ot && t.now() < Ot.until && (o === void 0 || o < Ne + xn(lt())), Ze = () => !!Pe() || Te(), Gt = () => zt("rootLike") ? s == null ? void 0 : s.address : (s == null ? void 0 : s.root) ?? (s == null ? void 0 : s.address), Jt = () => !!(s != null && s.address) && Gt() !== s.address, Ke = () => Jt() ? c && c.for === Gt() ? c.value : void 0 : o, $n = (w) => w !== void 0 && w < Ne + cl, k = () => De().filter((w) => t.now() - w.created > f6 && q.has(w.txid)), z = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), H = () => z() && !(s != null && s.linked), W = () => {
    const w = t.main();
    return !H() && !!w && !!(s != null && s.linked) && s.linked !== w;
  }, yt = (w) => Bt("return-to", w), xt = (w = s == null ? void 0 : s.address) => {
    if (!w) return;
    const $ = t.store.get(yt(w));
    return $ && Zs($) && $ !== w ? $ : void 0;
  }, te = (w = s == null ? void 0 : s.address) => Y && Y.for === w ? Y.res : null;
  function qt() {
    if (!(s != null && s.address)) return;
    if (s.linked) return { to: s.linked, kind: "linked" };
    const w = xt();
    if (w) return { to: w, kind: "chosen" };
    const $ = te();
    if ($ != null && $.ok && $.funder) return { to: $.funder, kind: "funder" };
  }
  const ee = (w) => Bt("gift", w);
  function Yt() {
    const w = s == null ? void 0 : s.address;
    if (!w) return null;
    if ((L == null ? void 0 : L.for) === w) return L.info;
    try {
      const $ = JSON.parse(t.store.get(ee(w)) || "null");
      return $ && typeof $.returnTo == "string" && typeof $.treasury == "string" ? $ : null;
    } catch {
      return null;
    }
  }
  async function Ae() {
    var pt;
    const w = s == null ? void 0 : s.address;
    if (!w || !t.giftInfo || !((pt = e == null ? void 0 : e.gifts) != null && pt.enabled) || I) return;
    const $ = (L == null ? void 0 : L.for) === w ? L : null, X = $ ? $.ok ? $.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if ($ && t.now() - $.at < X) return;
    I = !0;
    const tt = Yt();
    try {
      const G = await t.giftInfo(w);
      L = { for: w, info: G, ok: !0, at: t.now() }, t.store.set(ee(w), JSON.stringify(G));
    } catch {
      L = { for: w, info: tt, ok: !1, at: t.now() };
    } finally {
      I = !1;
    }
  }
  const Le = () => Ut().reduce((w, $) => lo.includes($.status) ? w + BigInt($.amount || "0") + BigInt($.fee || "0") : w, 0n);
  function Dt() {
    if (o === void 0) return 0;
    const w = o - Le() - BigInt(be.length) * xn(lt());
    return w > 0n ? e0(w, lt()) : 0;
  }
  const ht = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", Kt = "EMPTY — ADD STX TO PLAY";
  function Zt() {
    var X;
    const w = (s == null ? void 0 : s.state) === "known" || (s == null ? void 0 : s.state) === "unlocked";
    if (!((X = Yt()) != null && X.player) && !w) return null;
    const $ = (tt, pt) => ({ reason: tt, text: pt });
    switch (R()) {
      case "connect":
      case "wrong-wallet":
        return $("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "locked":
        return $("locked", "UNLOCK TO LISTEN");
      case "link":
        return $("link", "FINISH SETUP TO LISTEN");
      case "over":
        return $("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return Ze() ? $("arriving", "YOUR PLAYS ARE ARRIVING") : $("out", Jt() ? ht : Kt);
      case "ready":
        return !ce() || !(s != null && s.session) || s.session.playsLeft < 1 ? $("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : U ? Dt() < 1 ? $("out", Jt() ? ht : Kt) : null : $("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const de = () => {
    var w;
    return !!(s != null && s.address) && Jt() && !!((w = Yt()) != null && w.player);
  };
  function oe() {
    return de() ? { locked: !0, known: !0 } : null;
  }
  const an = 3 * 6e4, h = () => !!Yt() && !!t.history && !(s != null && s.linked);
  async function S() {
    const w = s.address, $ = Yt(), { balance: X, nonce: tt } = await t.chain.account(w), pt = await t.history(w, !0);
    if (!pt.ok) return null;
    const G = c6({ self: w, balance: X, inbound: pt.inbound, outgoing: pt.outgoing, gift: { sender: $.treasury, payer: $.returnTo } });
    if (!G.ok) return null;
    const P = l6(G.parts, co);
    return { balance: X, nonce: tt, parts: G.parts, steps: P.steps, tooSmall: P.tooSmall.length };
  }
  const f = () => gt ? { state: "unavailable" } : !F || t.now() - F.at > an || o !== void 0 && o !== F.balance ? { state: "none" } : F.plan;
  function R() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const w = t.main();
    if (!H()) {
      if (!w) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return s ? s.state === "unsupported" ? "unsupported" : s.state === "none" ? "intro" : W() ? "wrong-wallet" : s.state === "known" ? "locked" : !H() && s.linked !== w ? "link" : o === void 0 ? "loading" : o > Ts ? "over" : o < Ne + xn(lt()) ? "fund" : "ready" : "loading";
  }
  const ut = () => {
    var w, $, X, tt, pt;
    return {
      step: R(),
      busy: u,
      message: x,
      error: T,
      notice: mt(),
      gate: e,
      main: t.main(),
      listening: s == null ? void 0 : s.address,
      linked: s == null ? void 0 : s.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : D5(o, lt()),
      playsLeft: o === void 0 ? 0 : e0(o, lt()),
      allowance: o === void 0 ? Ts : ll(o, BigInt(((w = Pe()) == null ? void 0 : w.amount) ?? "0")),
      session: (s == null ? void 0 : s.session) ?? null,
      payingOn: ce(),
      entries: Ut(),
      depositTxid: (($ = Pe()) == null ? void 0 : $.txid) ?? V,
      depositPending: Ze(),
      arrival: Ze() ? { since: ((X = Pe()) == null ? void 0 : X.at) ?? (Ot == null ? void 0 : Ot.since) ?? t.now(), graceMs: i0 } : null,
      walletOutdated: zt("like"),
      linkedListening: J && J === t.main() ? M.map((G) => G.listening) : [],
      serverLinked: !!E && _ === `${t.main()}:${s == null ? void 0 : s.address}`,
      stuck: k().length,
      armed: it,
      queued: be.length,
      solo: H(),
      returnTo: (tt = qt()) == null ? void 0 : tt.to,
      returnToKind: (pt = qt()) == null ? void 0 : pt.kind,
      funderState: (() => {
        const G = te();
        return G ? G.ok ? G.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const G = te();
        return !!G && G.ok && G.distinct > 1;
      })(),
      walletCannotSolo: H() && zt("standalone"),
      walletCannotMulti: zt("multi"),
      others: ((s == null ? void 0 : s.others) ?? []).filter((G) => G !== t.main() && G !== (s == null ? void 0 : s.linked)),
      creditedTo: H() && (s != null && s.address) && (b == null ? void 0 : b.for) === s.address && b.main ? b.main : void 0,
      createdHere: !!(s != null && s.address) && t.store.get(Bt("created", s.address)) === "1",
      brandNew: !!(s != null && s.address) && o === 0n && (C == null ? void 0 : C.for) === s.address && C.unused,
      gift: (() => {
        const G = Yt();
        return G ? { player: G.player, from: G.from, source: G.source, amount: G.amount } : null;
      })(),
      giftPlays: Yt() ? Dt() : 0,
      playCost: xn(lt()),
      giftStop: Zt(),
      albumLock: oe(),
      returnPlan: f(),
      slot: (s == null ? void 0 : s.state) === "unlocked" ? s.slot ?? 0 : 0,
      root: (s == null ? void 0 : s.state) === "unlocked" ? s.root ?? s.address : void 0,
      walletCannotAlbums: zt("slots"),
      likeFunds: (() => {
        var j;
        const G = Gt();
        if (!G || (s == null ? void 0 : s.state) !== "unlocked") return null;
        const P = Ke();
        return { address: G, balance: P, low: $n(P), album: Jt(), pending: !!_e(G), txid: (j = _e(G)) == null ? void 0 : j.txid, main: t.main() };
      })()
    };
  }, mt = () => K ? K < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", st = (w, $ = "") => {
    x = w, T = $, t.changed();
  };
  async function Wt(w, $) {
    if (!u) {
      u = w, T = "", t.changed();
      try {
        await $();
      } catch (X) {
        const tt = X instanceof Error ? X.message : String(X);
        T = /Cancelled in the listening wallet/.test(tt) ? "" : tt, T || (x = "Not now. Nothing was signed.", ot = !0);
      } finally {
        u = null, await Pt(!0);
      }
    }
  }
  const Ue = () => !!(e != null && e.enabled) && e.here && (H() || !!t.main() && e.allowed), ye = () => Ue() && !W(), hn = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", he = () => {
    if (W()) throw new Error(hn());
  };
  async function Nn() {
    if (!Ue()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return i ?? (i = await t.bridge(e.walletOrigin)), i;
  }
  const Fe = (w) => {
    const $ = t.main();
    return w.request("listening.status", $ ? { main: $ } : void 0);
  };
  async function Pn(w = !1) {
    s != null && s.address && (!w && t.now() - a < 3e4 || (o = await t.chain.balance(s.address), a = t.now(), await pn(w)));
  }
  async function pn(w = !1) {
    const $ = Gt();
    if (!(!Jt() || !$ || (s == null ? void 0 : s.state) !== "unlocked") && !(!w && (c == null ? void 0 : c.for) === $ && t.now() - c.at < 3e4))
      try {
        c = { for: $, value: await t.chain.balance($), at: t.now() };
      } catch {
      }
  }
  async function gs(w) {
    if ((J !== w || t.now() - et >= 6e4) && (M = await t.links(w), J = w, et = t.now()), (s == null ? void 0 : s.state) !== "unlocked" || s.linked === w) return;
    const $ = `${w}:${s.address}`;
    _ === $ && E || (E = M.find((X) => X.listening === s.address) ?? null, _ = $);
  }
  async function Ce() {
    const w = s == null ? void 0 : s.address;
    if (!H() || !w || s != null && s.linked || !t.funder || v || !o || o <= 0n) return;
    const $ = te(w);
    if ($ != null && $.ok && $.funder) return;
    const X = $ != null && $.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, N - 1), 30 * 6e4);
    if (!(Y && Y.for === w && t.now() - Y.at < X)) {
      v = !0;
      try {
        Y = { for: w, res: await t.funder(w), at: t.now() };
      } catch {
        Y = { for: w, res: { ok: !1 }, at: t.now() };
      } finally {
        v = !1;
      }
      N = Y.res.ok ? 0 : N + 1;
    }
  }
  async function li() {
    const w = s == null ? void 0 : s.address;
    if (!(!H() || !w || s != null && s.linked || !t.mainOf || D) && !(b && b.for === w && (b.ok || t.now() - b.at < 6e4))) {
      D = !0;
      try {
        b = { for: w, main: await t.mainOf(w), ok: !0, at: t.now() };
      } catch {
        b = { for: w, main: null, ok: !1, at: t.now() };
      } finally {
        D = !1;
      }
    }
  }
  async function hr() {
    const w = s == null ? void 0 : s.address;
    if (!(!w || (s == null ? void 0 : s.state) !== "unlocked" || o !== 0n || (C == null ? void 0 : C.for) === w) && t.store.get(Bt("created", w)) !== "1")
      try {
        C = { for: w, unused: await t.chain.confirmedNonce(w) === 0n };
      } catch {
      }
  }
  async function At() {
    var pt;
    const w = s == null ? void 0 : s.address;
    if (!w) return !1;
    let $, X = !1;
    const tt = /* @__PURE__ */ new Map();
    for (const G of Ye())
      try {
        const P = await t.chain.transaction(G.txid);
        if (!P) {
          if (q.add(G.txid), t.now() - G.created > 15 * 6e4 && !tt.has(G.address) && tt.set(G.address, await t.chain.confirmedNonce(G.address)), $ = tt.get(G.address), $ !== void 0 && $ > BigInt(G.nonce)) {
            wt({ ...G, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((G.status === "unknown" || G.status === "signed") && G.raw)
            try {
              await t.chain.broadcast(G.raw, G.txid), wt({ ...G, status: "pending" });
            } catch (ct) {
              mi(ct) && wt({ ...G, status: "failed", note: ct.message, raw: void 0 });
            }
          continue;
        }
        q.delete(G.txid);
        const j = String(P.tx_status);
        if (j === "success" && P.canonical !== !1 && P.is_unanchored === !1) {
          if (wt({ ...G, status: "confirmed", confirmedAt: t.now(), actualFee: String(P.fee_rate ?? G.fee), raw: void 0 }), X = !0, G.kind === "like" && (m = !0, G.status !== "confirmed" && typeof G.liked == "boolean"))
            try {
              (pt = t.likeConfirmed) == null || pt.call(t, G.song, G.liked);
            } catch {
            }
        } else j.startsWith("abort_") || j.startsWith("dropped_") ? wt({ ...G, status: "failed", note: j, raw: void 0 }) : G.status !== "pending" && wt({ ...G, status: "pending" });
      } catch {
      }
    for (const G of Jt() ? [w, Gt()] : [w]) {
      const P = _e(G);
      if (P)
        try {
          const j = await t.chain.transaction(P.txid), ct = String((j == null ? void 0 : j.tx_status) ?? "");
          (ct === "success" && j.is_unanchored === !1 || ct.startsWith("abort_") || ct.startsWith("dropped_") || !j && t.now() - P.at > 2 * 36e5) && (ie(null, G), ct === "success" && on(2e4), a = -1 / 0, c = null, /on its way/i.test(x) && (x = ""));
        } catch {
        }
    }
    return X;
  }
  async function Pt(w = !1) {
    var $;
    try {
      const X = t.main();
      if ((w || !e || r !== X || t.now() - n > 3e5) && (e = await t.config(X), n = t.now(), r = X), !e.enabled || !e.here || !H() && (!X || !e.allowed)) {
        i && (s != null && s.session) && await i.request("listening.stop").catch(() => {
        }), it && ys(), t.changed();
        return;
      }
      await Nn(), s = await Fe(i), W() && s.state === "unlocked" && (yr(), await i.request("listening.lock").catch(() => {
      }), o = void 0, s = await Fe(i)), X && e.allowed && await gs(X), await Pn(w), await Ce(), await li(), await hr(), await Ae(), await At() && await Pn(!0), await pn(), await bs(), K = 0;
    } catch {
      K++;
    }
    if (R() === "locked" ? ui() : it && ys(), m) {
      m = !1;
      try {
        ($ = t.likesChanged) == null || $.call(t);
      } catch {
      }
    }
    t.changed(), be.length && !gr && Nr();
  }
  async function we(w) {
    const $ = s == null ? void 0 : s.root;
    if (!$ || s != null && s.slot || !(s != null && s.address) || zt("slots")) return;
    const X = Number(t.store.get(Bt("slot", $)));
    if (!(!Number.isSafeInteger(X) || X < 1))
      try {
        const { balance: tt } = await t.chain.account(s.address);
        if (tt >= Ne + xn(lt())) return;
        await w.request("listening.openSlot", { slot: X }), s = await Fe(w), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function He(w, $) {
    var G;
    he();
    const X = !(s != null && s.address) || ce(s.address), tt = s != null && s.linked ? (G = t.nameOf) == null ? void 0 : G.call(t, s.linked) : void 0;
    await w.request("listening.unlock", { mode: "unlock", terms: X ? Tr() : void 0, anyPasskey: $, ...t.main() ? { main: t.main() } : {}, ...tt ? { label: tt } : {} }), s = await Fe(w), X && (ce(s.address) ? await _n() : await w.request("listening.stop")), await we(w), st(X ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const pt = p;
    p = null, pt && t.now() - pt.at < 12e4 && setTimeout(() => void Pt(!0).then(() => wr(pt)), 0);
  }
  function ui() {
    it || u || ot || at >= 3 || !i || !(s != null && s.address) || (it = !0, ae = (async () => {
      try {
        await He(i, !1), at = 0;
      } catch (w) {
        const $ = w instanceof Error ? w.message : String(w);
        /Cancelled in the listening wallet/.test($) ? $t || (ot = !0, st("Not now. Nothing was signed.")) : /did not answer/.test($) ? await (i == null ? void 0 : i.request("listening.cancel").catch(() => {
        })) : (at++, T = $);
      } finally {
        it = !1;
        const w = $t;
        $t = null, w ? await w() : await Pt(!0);
      }
    })());
  }
  async function ys(w) {
    it && ($t = async () => {
    }, await (i == null ? void 0 : i.request("listening.cancel").catch(() => {
    })), await ae), w && await w(), t.changed();
  }
  const Tr = () => ({
    fee: lt().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Ts.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function _n() {
    if (!(s != null && s.address)) return !1;
    if (U || (U = await t.tabLock(s.address)), !U)
      throw await (i == null ? void 0 : i.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function qn(w, $) {
    const X = s.address, { balance: tt, nonce: pt } = $ ?? await t.chain.account(X);
    o = tt;
    const G = await i.request("listening.prepareReturn", {
      mode: w.mode,
      balance: tt.toString(),
      nonce: pt.toString(),
      fee: co.toString(),
      ...w.amount !== void 0 ? { amount: w.amount.toString() } : {},
      ...w.linked ? {} : { destination: w.to }
    });
    if (G.recipient !== w.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const P = w.mode === "amount" ? w.amount : w.mode === "all" ? tt - co : tt - Ts - co, j = tc(G.raw);
    if (rr(j.payload.recipient).value !== w.to || String(j.payload.amount) !== G.amount || P !== void 0 && G.amount !== P.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const ct = {
      id: fl(),
      address: X,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: G.recipient,
      amount: G.amount,
      fee: G.fee,
      nonce: pt.toString(),
      created: t.now(),
      status: "signed",
      raw: G.raw,
      txid: G.txid
    };
    t.validate(ct), wt(ct);
    try {
      await t.chain.broadcast(G.raw, G.txid), wt({ ...ct, status: "pending" });
    } catch (Et) {
      throw wt({ ...ct, status: "unknown", note: Et.message }), Et;
    }
    return G;
  }
  const ws = Pc, pr = co;
  async function Un(w, $, X) {
    if ((s == null ? void 0 : s.state) !== "unlocked" || !s.address) throw new Error("Unlock the listening wallet first.");
    if (zt("slots") || zt("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const tt = s.slot ?? 0;
    if (w === $ || ![w, $].includes(tt) || ![w, $].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const pt = s.root ?? s.address, G = w === 0 ? pt : s.address, P = $ === 0 ? pt : s.address, { balance: j, nonce: ct } = await t.chain.account(G);
    if (j < X + pr + Ne) throw new Error(w === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const Et = await i.request("listening.signMove", { from: w, to: $, amount: X.toString(), fee: pr.toString(), nonce: ct.toString(), balance: j.toString() }), ve = tc(Et.raw);
    if (Et.from !== G || Et.to !== P || Et.amount !== X.toString() || rr(ve.payload.recipient).value !== P || String(ve.payload.amount) !== X.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const Be = {
      id: fl(),
      address: G,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: P,
      amount: Et.amount,
      fee: Et.fee,
      nonce: ct.toString(),
      created: t.now(),
      status: "signed",
      raw: Et.raw,
      txid: Et.txid
    };
    t.validate(Be), wt(Be);
    try {
      await t.chain.broadcast(Et.raw, Et.txid), wt({ ...Be, status: "pending" });
    } catch (Ft) {
      throw wt({ ...Be, status: "unknown", note: Ft.message }), Ft;
    }
    return ie({ txid: Et.txid, amount: Et.amount, at: t.now() }, P), P === pt && pt !== s.address ? c = null : a = -1 / 0, Et;
  }
  let Wn = !1;
  const Hn = /* @__PURE__ */ new Map(), On = (w) => Bt("float", w);
  async function bs() {
    if (Wn || (s == null ? void 0 : s.state) !== "unlocked" || !Jt() || zt("move") || zt("rootLike") || !s.address) return;
    const w = s.address;
    if (t.store.get(On(w)) === "1") return;
    const $ = Yt();
    if (!($ != null && $.player) || $.state !== "arrived") return;
    const X = Ke();
    if (X === void 0 || o === void 0) return;
    if (!$n(X)) {
      t.store.set(On(w), "1");
      return;
    }
    if (_e(Gt()) || Mr() || Ye().length || o < ws * 4n + Ne + pr) return;
    const tt = Hn.get(w);
    if (!(tt && (tt.n >= 3 || t.now() - tt.at < 5 * 6e4))) {
      Wn = !0, Hn.set(w, { n: ((tt == null ? void 0 : tt.n) ?? 0) + 1, at: t.now() });
      try {
        await Un(s.slot ?? 0, 0, ws), t.store.set(On(w), "1");
      } catch (pt) {
        console.warn("[radio] likes float not sent yet", pt);
      } finally {
        Wn = !1;
      }
    }
  }
  async function fi(w) {
    if (De().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (zt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const $ = await S().catch(() => null);
    if (!$)
      throw F = null, gt = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    gt = !1, o = $.balance;
    const X = { balance: $.balance, nonce: $.nonce };
    if (w === "excess") {
      const j = s0($.parts) ?? xt();
      if (!j) throw new Error("Choose where to send the excess first.");
      await qn({ mode: "excess", to: j, linked: !1 }, X), F = null, st("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const tt = $.steps;
    if (!tt.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!F && F.balance === $.balance && t.now() - F.at <= an && F.steps.length === tt.length && F.steps.every((j, ct) => j.to === tt[ct].to && j.mode === tt[ct].mode && j.send === tt[ct].send))) {
      F = {
        at: t.now(),
        balance: $.balance,
        steps: tt,
        parts: $.parts,
        plan: { state: "ready", steps: tt.map((j) => ({ to: j.to, kind: j.kind, send: j.send.toString() })), kept: $.tooSmall, excess: s0($.parts) }
      }, st(tt.length > 1 ? `This goes back in ${tt.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const G = tt[0], P = G.to ?? xt();
    if (!P) throw new Error("Choose where to send the rest first.");
    if (G.mode === "amount" && zt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await qn({ mode: G.mode, to: P, linked: !1, ...G.mode === "amount" ? { amount: G.send } : {} }, X), F = null, tt.length === 1 ? (sn(!1), st("Returned ✓ Paying is off.")) : st(`Returned ✓ ${tt.length - 1} more ${tt.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const ms = {
    forceRefresh: () => Pt(!0),
    create: () => Wt("Waiting for your passkey…", async () => {
      const w = await Nn();
      await w.request("listening.unlock", { mode: "create", terms: Tr(), ...t.main() ? { main: t.main() } : {} }), s = await Fe(w), s.address && t.store.set(Bt("created", s.address), "1"), sn(!0), st(H() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await _n();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (w) => {
      w ? on() : Ot = null, t.changed();
    },
    giftSent: (w, $) => {
      !(s != null && s.address) || Pe() || (ie({ txid: w, amount: $.toString(), at: t.now() }), a = -1 / 0, L = null, st("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (w) => {
      if (he(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (zt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await Nn()).request("listening.bindSlot", { slot: w, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (w, $, X, tt) => {
      ie({ txid: X, amount: tt.toString(), at: t.now() }, $), L = null, await ms.openAlbum(w), st("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (w) => Wt("Opening…", async () => {
      if (he(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (zt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (d || l || y) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((s.slot ?? 0) === w) return;
      yr(), await i.request("listening.openSlot", { slot: w }), s = await Fe(i), o = void 0, a = -1 / 0, F = null, gt = !1;
      const $ = s.root;
      $ && w > 0 && t.store.set(Bt("slot", $), String(w)), st(w === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (w = !1) => {
      const $ = () => Wt("Waiting for your passkey…", async () => He(await Nn(), w));
      return it ? w ? zt("cancel") ? (st("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : ys(async () => {
        (R() === "locked" || R() === "intro") && await $();
      }) : ae : $();
    },
    link: () => Wt("Sign in your wallet…", async () => {
      he();
      const w = t.main();
      if (!w || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      const $ = (await t.links(w)).find((X) => X.listening === s.address);
      if ($)
        await i.request("listening.link", { main: w, issued: $.issued, mainSignature: $.mainSignature });
      else {
        const X = { main: w, listening: s.address, issued: t.now() }, tt = await t.signWithMain(w, e6(X)), pt = await i.request("listening.link", { main: w, issued: X.issued, mainSignature: tt });
        await t.saveLink({ ...X, mainSignature: tt, listeningSignature: pt.listeningSignature }), et = -1 / 0;
      }
      st("Linked ✓");
    }),
    deposit: () => Wt("Approve the deposit in your wallet…", async () => {
      he();
      const w = t.main();
      if (!w || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      if (Pe()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (Te()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await Pn(!0);
      const $ = ll(o ?? 0n);
      if ($ <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      V = await t.deposit(w, s.address, $), V && ie({ txid: V, amount: $.toString(), at: t.now() }), st("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Wt("Approve the top-up in your wallet…", async () => {
      he();
      const w = t.main(), $ = Gt();
      if (!w || !$) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (_e($)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const X = await t.chain.balance($);
      Jt() ? c = { for: $, value: X, at: t.now() } : (o = X, a = t.now());
      const tt = ll(X);
      if (tt <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const pt = await t.deposit(w, $, tt);
      pt && ie({ txid: pt, amount: tt.toString(), at: t.now() }, $), st("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (w) => Wt("Adding plays…", async () => {
      if (he(), !Jt()) throw new Error("Open the album you want to add plays to first.");
      if (!Ta.includes(w)) throw new Error("Choose one of the amounts offered.");
      const $ = u6(w, lt());
      if (d || l || y) throw new Error("Still sending a payment. Try again in a moment.");
      if (Ye().length || Pe()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Un(0, s.slot ?? 0, $), st("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Wt("Confirm in the listening wallet…", async () => {
      if (!ye()) throw new Error("Connect your wallet first.");
      await _n(), await i.request("listening.approveSession", Tr()), sn(!0), st("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Wt("Clearing…", async () => {
      for (const w of k())
        await t.chain.transaction(w.txid) || wt({ ...w, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      st("Cleared ✓");
    }),
    switchOff: () => Wt("Switching off…", async () => {
      yr(), await (i == null ? void 0 : i.request("listening.stop")), sn(!1), st("Paying is off. Music stays free.");
    }),
    lock: () => Wt("Locking…", async () => {
      yr(), await (i == null ? void 0 : i.request("listening.lock")), o = void 0, st("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (w) => {
      const $ = String(w ?? "").trim();
      if (!(s != null && s.address)) return st("", "Unlock the listening wallet first.");
      if (!Zs($)) return st("", "Enter a standard mainnet address (it starts with SP).");
      if ($ === s.address) return st("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(yt(s.address), $), st("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      s != null && s.address && t.store.set(yt(s.address), ""), t.changed();
    },
    returnFunds: (w) => Wt("Check the return in the listening wallet…", async () => {
      if (!ye()) throw new Error("Connect your wallet first.");
      if (!(s != null && s.address)) throw new Error("Unlock the listening wallet first.");
      if (h()) return fi(w);
      const $ = qt();
      if (!$) throw new Error(H() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if ($.kind !== "linked" && zt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (De().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await qn({ mode: w, to: $.to, linked: $.kind === "linked" }), w === "all" && sn(!1), st(w === "all" ? $.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, be = [], ro = 10, Br = 30 * 6e4;
  let gr = !1;
  const Mr = () => d || !!u || l || y, yr = () => {
    be.length && (be.length = 0, t.changed());
  };
  async function di(w) {
    if (!be.some(($) => $.id === w.id) && !Ut().some(($) => $.id === w.id) && (be.push({ ...w, at: t.now() }), be.length > ro && be.shift()), Mr() || De().length) {
      const $ = be.length;
      x = `Queued ${$ === 1 ? "this song" : $ + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Nr();
  }
  async function Nr() {
    if (!gr) {
      gr = !0;
      try {
        for (; be.length; ) {
          for (; be.length && t.now() - be[0].at > Br; ) be.shift();
          if (!be.length || Mr() || await hi(be[0]) === "wait") return;
          be.shift();
        }
      } finally {
        gr = !1, t.changed();
      }
    }
  }
  async function hi(w) {
    var $;
    d = !0;
    try {
      await Pt();
      const X = R();
      if (X === "loading") return "wait";
      if (X !== "ready" || !ce() || !(s != null && s.session) || s.session.playsLeft < 1 || !U) return "done";
      if (De().length) return "wait";
      A || (await t.chain.verify(), A = !0);
      const tt = s.address, { balance: pt, nonce: G } = await t.chain.account(tt);
      o = pt, a = t.now();
      const P = await t.chain.owner(ul, w.song);
      if (P === tt || P === t.main()) return "done";
      const j = await i.request("listening.signPlay", {
        core: ul,
        song: w.song,
        receipt: w.id,
        fee: lt().toString(),
        nonce: G.toString(),
        balance: pt.toString()
      }), ct = {
        id: w.id,
        address: tt,
        kind: "play",
        core: ul,
        song: w.song,
        recipient: P,
        amount: "50",
        fee: lt().toString(),
        nonce: G.toString(),
        created: t.now(),
        status: "signed",
        raw: j.raw,
        txid: j.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(ct), wt(ct);
      const Et = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`;
      try {
        await t.chain.broadcast(j.raw, j.txid), wt({ ...ct, status: "pending" }), x = `♪ Paid ${Et}`, T = "";
      } catch (ve) {
        wt({ ...ct, status: mi(ve) ? "failed" : "unknown", note: ve.message, ...mi(ve) ? { raw: void 0 } : {} }), T = ve.message;
      }
      return s = await Fe(i), "done";
    } catch (X) {
      const tt = X instanceof Error ? X.message : "payment unavailable";
      return ($ = Yt()) != null && $.player ? (x = "Payment is taking a moment: " + tt, "wait") : (x = "This song played free: " + tt, "done");
    } finally {
      d = !1, t.changed();
    }
  }
  function pi(w) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(R()) || zt("like") ? !1 : (wr(w), !0);
  }
  async function wr(w) {
    const $ = w.title ? `“${w.title}”` : `song #${w.song}`, X = (gn) => {
      var xs;
      T = gn, x = "";
      try {
        (xs = t.likeFailed) == null || xs.call(t, w.song);
      } catch {
      }
      t.changed();
    }, tt = Jt(), pt = R(), G = t.main(), P = tt && (pt === "fund" || pt === "over") ? "ready" : pt, j = H() ? Gt() : G;
    if (P === "locked") {
      p = { ...w, at: t.now() }, st(`Unlock to like ${$}. It sends straight after.`);
      return;
    }
    if (P === "wrong-wallet") return X(hn());
    if (P === "link") return X("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (H() && zt("standalone")) return X("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (P === "fund") return X("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (P === "over") return X("Return the excess first: the listening wallet holds more than 1 STX.");
    if (tt) {
      await pn(!0);
      const gn = Ke();
      if ($n(gn))
        return t.changed(), X(o0);
    }
    if (P !== "ready" || !j) return X("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(s != null && s.session)) return X("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!U) return X("Pay-per-play is running in another tab. Like from that tab.");
    const ct = Ut(Gt()).find((gn) => gn.kind === "like" && gn.song === w.song);
    if (ct && lo.includes(ct.status))
      return X(`Your last like for ${$} is still on its way. It can change again once it confirms.`);
    if (l) return X("One like at a time: your last one is still being sent.");
    if ((ct == null ? void 0 : ct.status) === "confirmed" && t.now() - (ct.confirmedAt ?? 0) < d6)
      return X(`Your like for ${$} has only just confirmed. Try again in a moment.`);
    let Et;
    y = !0;
    try {
      Et = t.likeState ? (await t.likeState(j, w.song)).by : w.likedBy ?? [];
    } catch {
      Et = w.likedBy;
    } finally {
      y = !1;
    }
    if (!Et) return X(`Could not check ${$} right now. Try the heart again.`);
    const ve = Gt(), Ft = ((ct == null ? void 0 : ct.status) === "confirmed" && typeof ct.liked == "boolean" && t.now() - (ct.confirmedAt ?? ct.created) < 5 * 6e4 ? ct.liked : void 0) ?? Et.includes(ve);
    if (!Ft && Et.some((gn) => gn !== ve)) return X(H() ? `${$} was liked from another wallet of yours. Unlike it there.` : `${$} was liked from your main wallet${Et.includes(G) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await gi({ song: w.song, liked: !Ft, title: w.title, artist: w.artist });
  }
  async function gi(w) {
    var tt, pt, G;
    if (l) {
      st("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const $ = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`, X = t.wait ?? ((P) => new Promise((j) => setTimeout(j, P)));
    try {
      st(`${w.liked ? "Liking" : "Unliking"} ${$}…`);
      const P = t.now() + 12e4;
      for (; d || (Jt() ? Ut(Gt()).some((Ft) => lo.includes(Ft.status)) : De().length); ) {
        if (t.now() > P) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await X(5e3), await Pt(!0);
      }
      if (!Jt() && R() !== "ready" || (s == null ? void 0 : s.state) !== "unlocked" || !s.session) throw new Error("Paying stopped before the like was sent.");
      const j = Gt(), { balance: ct, nonce: Et } = await t.chain.account(j);
      if (Jt() ? c = { for: j, value: ct, at: t.now() } : (o = ct, a = t.now()), $n(ct)) throw new Error(o0);
      const ve = await i.request("listening.signLike", {
        song: w.song,
        liked: w.liked,
        fee: cl.toString(),
        nonce: Et.toString(),
        balance: ct.toString()
      }), Be = {
        id: fl(),
        address: j,
        kind: "like",
        core: 0,
        song: w.song,
        liked: w.liked,
        recipient: "",
        amount: "0",
        fee: cl.toString(),
        nonce: Et.toString(),
        created: t.now(),
        status: "signed",
        raw: ve.raw,
        txid: ve.txid,
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(Be), wt(Be);
      try {
        await t.chain.broadcast(ve.raw, ve.txid), wt({ ...Be, status: "pending" }), x = `${w.liked ? "♥ Liked" : "Unliked"} ${$}`, T = "";
        try {
          (tt = t.likeSent) == null || tt.call(t, w.song, w.liked);
        } catch {
        }
      } catch (Ft) {
        if (wt({ ...Be, status: mi(Ft) ? "failed" : "unknown", note: Ft.message, ...mi(Ft) ? { raw: void 0 } : {} }), T = Ft.message, mi(Ft)) try {
          (pt = t.likeFailed) == null || pt.call(t, w.song);
        } catch {
        }
      }
      s = await Fe(i);
    } catch (P) {
      T = "Like not sent: " + (P instanceof Error ? P.message : "the listening wallet is unavailable");
      try {
        (G = t.likeFailed) == null || G.call(t, w.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), Nr();
    }
  }
  return { snapshot: ut, refresh: Pt, onListened: di, heart: pi, toggleLike: wr, ...ms };
}
const Jy = ["Connect", "Passkey", "Link & fund", "Listen"], tw = ["Passkey", "Add 1 STX", "Listen"], xu = (t) => t ? tw : Jy;
function p6(t) {
  if (t.solo) return g6(t);
  const e = Jy.length, n = (r, i, s = !1) => ({ at: r, blocked: s, caption: r >= e ? i : `Step ${r + 1} of ${e} · ${i}` });
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
function g6(t) {
  const e = tw.length, n = (r, i, s = !1) => ({ at: r, blocked: s, caption: r >= e ? i : `Step ${r + 1} of ${e} · ${i}` });
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
function y6(t, e) {
  return !e || e.at >= xu(!!t.solo).length || t.heard || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const w6 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function b6(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !w6(r.id)));
}
const m6 = {}, x6 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, S6 = (t) => {
  const e = m6;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, E6 = (t) => `/hiro/${t}`, A6 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, v6 = (t) => {
  const e = S6(t);
  if (e)
    return [A6(e)];
  const n = x6[t];
  return typeof window < "u" ? [`${window.location.origin}${E6(t)}`, ...n.filter((i) => !i.includes("hiro.so"))] : n;
}, $6 = {}, a0 = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, k6 = "xtrata.log.enabled", I6 = "xtrata.log.level", L6 = "xtrata.log.tags", C6 = "xtrata.log.dedupe", ba = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, T6 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, B6 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, M6 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, N6 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, P6 = () => {
  const t = $6 ?? {}, e = ba(k6) ?? t.VITE_LOG_ENABLED, n = ba(I6) ?? t.VITE_LOG_LEVEL, r = ba(L6) ?? t.VITE_LOG_TAGS, i = ba(C6) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: T6(e),
    level: B6(n) ?? "warn",
    tags: N6(r),
    dedupe: M6(i)
  };
}, _6 = (t, e, n) => !t.enabled || a0[n] < a0[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), U6 = (t, e, n, r) => {
  const i = P6();
  if (!_6(i, e, t) || O6(i.dedupe))
    return;
  const s = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(s, r) : o(s);
}, H6 = /* @__PURE__ */ new Set();
let c0 = null;
const O6 = (t, e, n, r, i) => (c0 !== t && (H6.clear(), c0 = t), !1), D6 = (t, e, n) => U6("debug", t, e, n), F6 = {}, j6 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, z6 = (t) => {
  const e = F6, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : j6[t];
}, R6 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, G6 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return R6.test(n) ? n : null;
}, K6 = (t) => t.replace(/\/+$/, ""), V6 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), l0 = (t) => {
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
}, xi = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, q6 = (t) => {
  var c, u;
  let e;
  try {
    e = rr(q8(t));
  } catch {
    return null;
  }
  const n = xi(e);
  if (!n || n.success === !1)
    return null;
  const r = xi(n.value), i = xi(r == null ? void 0 : r.value), s = xi(i == null ? void 0 : i.value);
  if (!s)
    return null;
  const o = l0((c = xi(s.name)) == null ? void 0 : c.value), a = l0((u = xi(s.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : G6(`${o}.${a}`);
}, W6 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${K6(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, i = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [Ny(yy(t.address))]
    }),
    signal: t.signal
  });
  if (!i.ok)
    throw new Error(`BNS primary lookup failed (${i.status})`);
  const s = await i.json();
  return !(s != null && s.okay) || typeof s.result != "string" ? null : q6(s.result);
}, X6 = async (t) => {
  const e = t.address.trim();
  if (!Ti(e))
    return null;
  const n = z6(t.network);
  if (!n)
    return null;
  let r = null;
  for (const i of v6(t.network))
    try {
      return await W6({
        baseUrl: i,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (s) {
      r = s;
    }
  return D6("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: V6(r)
  }), null;
};
function Y6(t, e, n = {}) {
  const r = n.retryAfterMs ?? 3e4, i = n.now ?? Date.now, s = /* @__PURE__ */ new Map(), o = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => t(a)).then((u) => {
      c.pending = !1, u && (c.name = u, e());
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
const u0 = Object.freeze({
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
}), f0 = Object.freeze({ 139: "melophonic" });
function Z6(t, e = "") {
  const n = String(t);
  return Object.hasOwn(u0, n) ? u0[n] : Object.hasOwn(f0, n) ? f0[n] : e;
}
const d0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function Q6(t, e = "") {
  return Object.hasOwn(d0, String(t)) ? d0[String(t)] : e;
}
const ew = 100000n, Pf = 1000000n, sc = 3000n, J6 = (t, e) => `${t}#gift=${e}`, t$ = 100, ma = (t, e = ci) => t <= Ne ? 0 : Number((t - Ne) / xn(e)), h0 = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), nw = "xtrata.xyz/radio/gifts", dl = t$, e$ = "Create a prefunded Xtrata radio gift batch", n$ = (t) => ({
  domain: Xs({ name: Re(nw), version: Re("1"), "chain-id": ar(1) }),
  message: Xs({
    purpose: Re(e$),
    creator: Re(t.creator),
    count: ar(t.count),
    amount: ar(BigInt(t.amount)),
    label: Re(t.label),
    issued: ar(t.issued),
    ...t.player ? { player: Re(t.player) } : {}
  })
}), r$ = (t, e, n = ci) => Ne + BigInt(t) * xn(n) + (e ? Pc : 0n), s$ = (t, e = ci) => Number((Pf - Ne - (t ? Pc : 0n)) / xn(e)), i$ = (t, e) => BigInt(t) * (e + sc);
function o$(t, e, n, r = ci) {
  const i = n ? Pc : 0n, s = e > Ne + i ? e - Ne - i : 0n, o = Number(s / xn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * nc,
    fees: BigInt(o) * r,
    reserve: Ne,
    float: i,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: sc,
    perCopy: e + sc,
    total: i$(t, e)
  };
}
const a$ = (t) => t >= ew && t <= Pf, p0 = 40, c$ = "Create an Xtrata radio gift player", l$ = /^[^\u0000-\u001f\u007f<>]+$/u;
function g0(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && l$.test(t) : !n;
}
function u$(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!g0(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!g0(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > p0) throw new Error(`A player holds 1 to ${p0} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const f$ = (t) => mp($p(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), d$ = (t) => ({
  domain: Xs({ name: Re(nw), version: Re("1"), "chain-id": ar(1) }),
  message: Xs({
    purpose: Re(c$),
    admin: Re(t.admin),
    player: Re(t.hash),
    issued: ar(t.issued)
  })
}), Bi = (t) => t.tracks.filter((e) => !e.hidden), h$ = (t) => t.tracks.find((e) => e.hidden) ?? null, p$ = [300, 500, 1e3], y0 = 1800, hl = /* @__PURE__ */ new Map();
async function g$(t) {
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
function y$(t, e, n, r, i) {
  const s = document.createElement("button");
  return s.type = "button", s.className = r, s.dataset.feedback = t, (() => {
    const a = hl.get(t), c = !!a && a.until > Date.now();
    s.textContent = c ? a.label : e, s.classList.toggle("is-done", c && a.ok), s.classList.toggle("is-failed", c && !a.ok);
  })(), s.onclick = async () => {
    const a = await n();
    if (a) {
      hl.set(t, { ...a, until: Date.now() + y0 });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        hl.delete(t), i();
      }, y0 + 50);
    }
  }, s;
}
const Li = (t, e, n, r, i) => y$(t, e, async () => await g$(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, i), Ss = "xtrata.radio.gift.incoming.v1", w0 = (t) => "xtrata.radio.gift.mine.v1:" + t, b0 = (t) => "xtrata.radio.gift.batches.v1:" + t, St = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Sr = (t, e, n = "") => {
  const r = St("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, xa = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, In = (t) => tr(t).replace(/\.?0+$/, "");
function w$(t) {
  let e = null;
  const n = (k) => [5e3, 1e4, 2e4, 3e4][k] ?? 6e4, r = (() => {
    try {
      const k = new URL(location.href), z = new URLSearchParams(k.hash.slice(1)).get("gift") ?? k.searchParams.get("gift");
      return z !== null && (k.searchParams.delete("gift"), history.replaceState(null, "", k.pathname + (k.search || ""))), h0(z) ? z : null;
    } catch {
      return null;
    }
  })(), i = (() => {
    try {
      const k = JSON.parse(t.store.get(Ss) || "null");
      return h0(k == null ? void 0 : k.code) ? k.code : null;
    } catch {
      return null;
    }
  })(), s = r ?? i;
  if (s) {
    e = { code: s }, t.store.set(Ss, JSON.stringify({ code: s, at: t.now() }));
    let k = 0;
    const z = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (H) => {
      const W = await H.json().catch(() => ({}));
      if (H.status === 404) {
        t.store.set(Ss, null), e = { ...e, error: (W == null ? void 0 : W.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!H.ok) throw new Error("busy");
      const yt = W;
      e = { ...e, view: yt, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(yt.status) && t.store.set(Ss, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void z(), n(k++)));
    });
    z();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    const k = e == null ? void 0 : e.view;
    return !(k != null && k.player) || !o() ? null : { player: k.player, from: u(k), plays: ma(BigInt(k.amount)) };
  }, c = () => {
    e = null, t.store.set(Ss, null), t.changed();
  }, u = (k) => k.from ? t.who(k.from) : k.label ? `Xtrata Radio · ${k.label}` : "Xtrata Radio";
  let d = {};
  const l = (k) => {
    if (d.box) return d.box;
    const z = St("div", "", "ppp-gift-check");
    d.box = z;
    const H = () => {
      const W = window.turnstile;
      !W || d.rendered || (d.rendered = !0, W.render(z, { sitekey: k, callback: (yt) => {
        d.token = yt, t.changed();
      }, "expired-callback": () => {
        d.token = void 0;
      } }));
    };
    if (window.turnstile) H();
    else {
      const W = document.createElement("script");
      W.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", W.async = !0, W.onload = H, document.head.append(W);
    }
    return z;
  }, y = (k) => {
    queueMicrotask(() => void k());
  };
  let p;
  async function m(k) {
    var W, yt, xt, te, qt, ee, Yt, Ae, Le;
    if (!e || e.claiming || !k.listening) return;
    const z = !!((W = e.view) != null && W.player);
    if (z && !k.root) return;
    e.claiming = !0, e.error = void 0, (yt = t.claiming) == null || yt.call(t, !0), t.changed();
    const H = async (Dt) => {
      const ht = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: d.token, ...Dt })
      });
      return { res: ht, r: await ht.json().catch(() => ({})) };
    };
    try {
      let Dt = 0, ht = k.listening, Kt;
      if (z) {
        const oe = Number((xt = await t.json("/radio/gift/slots?root=" + encodeURIComponent(k.root))) == null ? void 0 : xt.next);
        if (!Number.isSafeInteger(oe) || oe < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Dt = oe;
        for (let an = 0; ; an++) {
          const h = await t.album.bind(Dt);
          if (ht = h.address, Kt = await H({ wallet: ht, binding: h }), Kt.res.status === 409 && /just taken/.test(((te = Kt.r) == null ? void 0 : te.error) || "") && an < 5) {
            Dt += 1;
            continue;
          }
          break;
        }
      } else Kt = await H({ wallet: ht });
      const { res: Zt, r: de } = Kt;
      if (Zt.status === 503 && /sending another gift/.test((de == null ? void 0 : de.error) || "")) {
        e.waiting = !0, (qt = t.claiming) == null || qt.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!Zt.ok) {
        const oe = String((de == null ? void 0 : de.error) || "");
        if (Zt.status === 404 || Zt.status === 410 || Zt.status === 409 && /already had a gift|brand-new|already have this album/.test(oe))
          throw t.store.set(Ss, null), new Error(oe || "This gift cannot be opened.");
        if (Zt.status === 429 || Zt.status === 403 || Zt.status === 400 && !/wallet number/i.test(oe)) throw new Error(oe || `Could not open the gift (${Zt.status}).`);
        const h = /topping up/.test(oe) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(oe) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(oe) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(h), { retry: !0, slow: /topping up|not paid for yet/.test(oe) });
      }
      e.done = !0, t.store.set(Ss, null), z ? await t.album.arrived(Dt, ht, de.txid, BigInt(de.amount)) : t.giftSent(de.txid, BigInt(de.amount));
    } catch (Dt) {
      const ht = Dt, Kt = ht.name === "TypeError" || ht.name === "AbortError" || ht.name === "TimeoutError" || /wallet number/i.test(ht.message);
      if (ht.retry || Kt) {
        const Zt = e.tries ?? 0;
        e.tries = Zt + 1, e.retry = { text: ht.retry ? ht.message : "Still sending your gift… the network is slow, trying again." }, (ee = t.claiming) == null || ee.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, ht.slow ? 6e4 : n(Zt));
      } else
        e.error = ht.message, (Yt = t.claiming) == null || Yt.call(t, !1);
      d.token = void 0;
      try {
        (Le = (Ae = window.turnstile) == null ? void 0 : Ae.reset) == null || Le.call(Ae, d.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let x = null;
  function T(k) {
    if (!k.listening || !k.depositPending || k.step !== "fund")
      return x = null, [];
    if (!x || x.wallet !== k.listening || t.now() - x.at > 3e4) {
      const H = k.listening;
      x = { ...(x == null ? void 0 : x.wallet) === H ? x : {}, wallet: H, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(H)).then((W) => {
        var yt, xt;
        (x == null ? void 0 : x.wallet) === H && (x.state = (yt = W == null ? void 0 : W.gift) == null ? void 0 : yt.state, x.problem = ((xt = W == null ? void 0 : W.gift) == null ? void 0 : xt.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(x.state === "sending" && x.problem)) return [];
    const z = St("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return z.title = `Network reply: ${x.problem}`, [z];
  }
  function K(k, z, H = !1) {
    var ee, Yt;
    const W = z.player, yt = BigInt(z.amount), xt = H ? [] : [St("p", `🎁 ${u(z)} sent you “${W.title}”${W.subtitle ? ` by ${W.subtitle}` : ""}: ${Bi(W).length} ${Bi(W).length === 1 ? "song" : "songs"} and ${ma(yt).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!k.root && ["fund", "ready", "over", "link"].includes(k.step))) {
      if (H) return xt;
      if (xt.push(St("p", k.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : k.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), k.step === "intro") {
        const Ae = document.createElement("details");
        Ae.className = "ppp-how";
        const Le = document.createElement("summary");
        Le.textContent = "How does this work?", Ae.append(Le, St("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), xt.push(Ae);
      }
      return xt;
    }
    if (k.walletCannotAlbums)
      return xt.push(St("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), xt;
    const qt = (Yt = (ee = k.gate) == null ? void 0 : ee.gifts) == null ? void 0 : Yt.turnstileSiteKey;
    return qt && !d.token ? xt.push(St("p", "One quick check and it is yours:", "ppp-mute"), l(qt)) : !e.claiming && !e.error && !e.waiting && !e.retry && y(() => m(k)), xt.push(...V(k, "Sending your album…")), xt;
  }
  function V(k, z) {
    const H = [];
    return e.claiming || e.waiting ? H.push(St("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : z, "ppp-cyan")) : e.retry && H.push(St("p", e.retry.text, "ppp-warn"), Sr("Try now", () => {
      clearTimeout(p), e.retry = void 0, m(k);
    }, "quiet")), e.error && H.push(St("p", e.error, "ppp-bad"), Sr("Try again", () => {
      e.error = void 0, m(k);
    })), H;
  }
  const E = (k) => {
    var z;
    return !!e && !e.done && !e.error && o() && !!k.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !k.linked && !k.creditedTo && (k.createdHere || k.brandNew || !!((z = e.view) != null && z.player)) && (k.balance ?? 0n) === 0n && !k.entries.length);
  };
  function _(k, z = {}) {
    var Le, Dt;
    const H = T(k);
    if (!e || ["off", "elsewhere"].includes(k.step)) return H;
    const W = e.view;
    if (e.error && !W) return [St("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!W) return [St("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return H;
    if (W.status === "claimed" || W.status === "claiming") return [St("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(W.status)) return [St("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (W.status === "pending-deposit") return [St("p", `🎁 ${u(W)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (W.player) return [...K(k, W, !!z.bare), ...H];
    if (!!k.listening && (!(k.createdHere || k.brandNew) || !!k.linked || !!k.creditedTo || (k.balance ?? 0n) > 0n || k.entries.length > 0))
      return [St("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), Sr("Forget this gift link here", c, "quiet")];
    const xt = BigInt(W.amount), te = ma(xt).toLocaleString(), ee = [St(
      "p",
      `🎁 ${u(W)} sent you ${In(xt)} STX of on-chain music: about ${te} paid plays.`,
      "ppp-gift"
    )], Yt = !!k.listening && (k.createdHere || k.brandNew) && !k.linked && !k.creditedTo && k.step === "fund" && (k.balance ?? 1n) === 0n && !k.depositPending && !k.entries.length, Ae = (Dt = (Le = k.gate) == null ? void 0 : Le.gifts) == null ? void 0 : Dt.turnstileSiteKey;
    return Yt ? (Ae && !d.token ? ee.push(St("p", "One quick check and it is yours:", "ppp-mute"), l(Ae)) : !e.claiming && !e.error && !e.waiting && !e.retry && y(() => m(k)), ee.push(...V(k, "Sending your gift…"))) : k.step === "intro" ? ee.push(St("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : k.listening && k.linked ? ee.push(St("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), Sr("Forget this gift link here", c, "quiet")) : k.listening && (k.balance ?? 0n) > 0n && ee.push(St("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), Sr("Forget this gift link here", c, "quiet")), ee;
  }
  async function M(k, z, H) {
    var W;
    try {
      const yt = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(k));
      if ((W = yt == null ? void 0 : yt.gift) != null && W.returnTo) return { ok: !0, funder: yt.gift.returnTo, txId: yt.gift.txid ?? void 0, amount: yt.gift.amount, distinct: 1 };
    } catch {
      if (H) return { ok: !1 };
    }
    return z();
  }
  const J = St("div", "", "ppp-gift-fold");
  let et = 250000n, q = "", Y = "";
  const v = (k) => {
    try {
      const z = JSON.parse(t.store.get(w0(k)) || "[]");
      return Array.isArray(z) ? z : [];
    } catch {
      return [];
    }
  }, N = (k, z) => t.store.set(w0(k), JSON.stringify(z.slice(0, 50)));
  async function b(k) {
    const z = v(k);
    for (const H of z)
      if (!(H.view && ["claimed", "refunded", "expired"].includes(H.view.status)))
        try {
          H.view = !H.view || H.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: H.id, ...H.txid ? { txid: H.txid } : {} }) }) : await t.json("/radio/gift?id=" + H.id), H.error = void 0;
        } catch (W) {
          H.error = W.message;
        }
    N(k, z), t.changed();
  }
  async function C(k) {
    if (q) return;
    q = "Starting your gift…", Y = "", t.changed();
    let z = null;
    try {
      z = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: k, amount: et.toString() }) });
      const H = v(k);
      H.unshift({ id: z.id, code: z.code, amount: et.toString(), at: t.now() }), N(k, H), q = "Approve the gift in your wallet…", t.changed();
      const W = await t.pay(k, z.depositTo, BigInt(z.deposit), z.memo), yt = v(k), xt = yt.find((te) => te.id === z.id);
      xt && (xt.txid = W, xt.view = { status: "pending-deposit", amount: et.toString(), source: "friend", from: k, label: "", expires: 0 }), N(k, yt), Y = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", b(k);
    } catch (H) {
      Y = H.message || "Not sent.";
    } finally {
      q = "", t.changed();
    }
  }
  const D = (k) => "xtrata.radio.gift.players.v1:" + k, L = (k) => {
    try {
      const z = JSON.parse(t.store.get(D(k)) || "[]");
      return Array.isArray(z) ? z.filter((H) => H && /^[0-9a-f]{16}$/.test(H.id)) : [];
    } catch {
      return [];
    }
  };
  async function I(k, z) {
    var H;
    if (!q) {
      q = "Checking the player…", Y = "", t.changed();
      try {
        const W = z.tracks.split(/[\s,]+/).filter(Boolean).map((Yt) => Number(Yt.replace(/^#/, ""))), yt = u$({ title: z.title.trim(), subtitle: z.subtitle.trim(), tracks: W, cover: (H = z.cover) != null && H.trim() ? Number(z.cover.trim().replace(/^#/, "")) : null });
        q = "Sign in your wallet…", t.changed();
        const xt = { admin: k, hash: f$(yt), issued: t.now() }, te = await t.sign(k, d$(xt));
        q = "Making the player…", t.changed();
        const qt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: yt, request: xt, signature: te }) }), ee = L(k).filter((Yt) => Yt.id !== qt.id);
        ee.unshift({ id: qt.id, title: qt.title, tracks: qt.tracks }), t.store.set(D(k), JSON.stringify(ee.slice(0, 30))), Y = `${qt.existing ? "That player already exists" : "Player made"} ✓ “${qt.title}” · ${qt.tracks} songs. Pick it below for a batch.`;
      } catch (W) {
        Y = W.message || "Not made.";
      } finally {
        q = "", t.changed();
      }
    }
  }
  const F = (k, z) => J6(k || location.origin + "/radio.html", z), gt = (k) => {
    try {
      const z = JSON.parse(t.store.get(b0(k)) || "[]");
      return Array.isArray(z) ? z.filter((H) => H && /^[0-9a-f]{16}$/.test(H.id) && Array.isArray(H.codes)) : [];
    } catch {
      return [];
    }
  }, A = (k, z) => t.store.set(b0(k), JSON.stringify(z.slice(0, 20))), U = (k) => !!k.view && k.view.status === "live" && k.view.copies.waiting + k.view.copies.claiming + k.view.copies.refunding === 0, it = (k, z) => t.json(k, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(z) });
  let ot = 0;
  async function at(k) {
    const z = gt(k);
    for (const H of z)
      if (!U(H))
        try {
          H.view = !H.view || H.view.status === "pending-deposit" ? await it("/radio/gift/batch/confirm", { id: H.id, ...H.txid ? { txid: H.txid } : {} }) : await t.json("/radio/gift/batch?id=" + H.id), H.error = void 0;
        } catch (W) {
          H.error = W.message;
        }
    try {
      const H = await t.json("/radio/gift/batches?creator=" + encodeURIComponent(k));
      for (const W of (H == null ? void 0 : H.batches) ?? []) {
        const yt = z.find((xt) => xt.id === W.id);
        if (yt) {
          yt.error || (yt.view = W);
          continue;
        }
        z.push({ id: W.id, codes: [], count: W.count, amount: W.amount, label: W.label, player: W.player, depositTo: "", deposit: W.deposit, memo: W.memo, at: 0, view: W });
      }
    } catch {
    }
    A(k, z), t.changed();
  }
  async function $t(k, z) {
    const H = gt(k).find((W) => W.id === z);
    if (!(!H || !H.depositTo || q)) {
      q = "Approve the payment in your wallet…", Y = "", t.changed();
      try {
        const W = await t.pay(k, H.depositTo, BigInt(H.deposit), H.memo), yt = gt(k), xt = yt.find((te) => te.id === z);
        xt && (xt.txid = W), A(k, yt), Y = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", q = "", at(k);
      } catch (W) {
        Y = `${/cancel/i.test(W.message) ? "Payment cancelled." : W.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        q = "", t.changed();
      }
    }
  }
  async function ae(k, z, H, W) {
    if (q) return;
    if (!z.ok) {
      Y = z.reason, t.changed();
      return;
    }
    q = "Sign in your wallet…", Y = "", t.changed();
    let yt = null;
    try {
      const xt = { creator: k, count: z.count, amount: z.amount.toString(), label: H, issued: t.now(), ...W ? { player: W } : {} }, te = await t.sign(k, n$(xt));
      q = "Making your links…", t.changed(), yt = await it("/radio/gift/batch", { request: xt, signature: te });
      const qt = gt(k);
      qt.unshift({ id: yt.id, codes: yt.codes, count: z.count, amount: yt.amount, label: H, player: W ?? null, depositTo: yt.depositTo, deposit: yt.deposit, memo: yt.memo, at: t.now() }), A(k, qt);
    } catch (xt) {
      Y = xt.message || "Not made.", q = "", t.changed();
      return;
    }
    q = "", t.changed(), await $t(k, yt.id);
  }
  function lt() {
    const k = !!Ot.value, z = on.value === "max" ? s$(k) : Number(on.value), H = r$(z, k), W = Number(Te.value);
    return !Number.isInteger(W) || W < 1 || W > dl ? { ok: !1, reason: `Make 1 to ${dl} copies at a time.`, album: k, plays: z, amount: H, count: W } : a$(H) ? { ok: !0, reason: "", album: k, plays: z, amount: H, count: W, bill: o$(W, H, k) } : { ok: !1, reason: "Each copy must be 0.1 to 1 STX.", album: k, plays: z, amount: H, count: W };
  }
  const zt = () => {
    const k = lt();
    if (!k.ok) return k.reason;
    const z = k.bill;
    return `Each copy: ${k.plays.toLocaleString()} paid plays (${In(z.holders)} to song holders, ${In(z.fees)} network fees)${k.album ? `, ${In(z.float)} for the album’s likes` : ""}, ${In(z.reserve)} kept so a listener can return what is left, + ${In(z.sendFee)} to send it = ${In(z.perCopy)} STX. ${k.count} copies = ${In(z.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Bt = (k, z) => z.codes.map((H) => F(k, H)), Ut = St("input");
  Ut.type = "range", Ut.min = String(ew), Ut.max = String(Pf), Ut.step = "50000", Ut.value = String(et), Ut.setAttribute("aria-label", "Gift amount");
  const wt = St("p", "", "ppp-gift-amount"), ce = Sr("", () => {
    const k = t.main();
    k && C(k);
  }, "primary"), sn = () => {
    wt.textContent = De(), ce.textContent = `Gift ${In(et)} STX`;
  };
  Ut.oninput = () => {
    et = BigInt(Ut.value), sn();
  };
  const De = () => `${In(et)} STX · about ${ma(et).toLocaleString()} paid plays · you pay ${In(et + sc)} STX with the network fee`;
  sn();
  const Ye = St("input");
  Ye.maxLength = 60, Ye.placeholder = "Title, e.g. Proof of Sound", Ye.setAttribute("aria-label", "Player title");
  const Pe = St("input");
  Pe.maxLength = 80, Pe.placeholder = "Artist (optional)", Pe.setAttribute("aria-label", "Player subtitle");
  const _e = St("textarea");
  _e.rows = 3, _e.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", _e.setAttribute("aria-label", "Songs");
  const ie = St("input");
  ie.inputMode = "numeric", ie.placeholder = "Cover inscription number (optional), shown when the album loads", ie.setAttribute("aria-label", "Cover inscription");
  const Ot = St("select");
  Ot.setAttribute("aria-label", "Batch album");
  const on = St("select");
  on.setAttribute("aria-label", "Plays per copy");
  for (const k of p$) on.append(xa(`${k.toLocaleString()} plays`, String(k)));
  on.append(xa("Max (1 STX)", "max"));
  const Te = St("input");
  Te.type = "number", Te.min = "1", Te.max = String(dl), Te.value = "10", Te.setAttribute("aria-label", "Copies");
  const Ze = St("input");
  Ze.maxLength = 40, Ze.placeholder = "Label, e.g. Opera launch", Ze.setAttribute("aria-label", "Batch label");
  const Gt = St("p", "", "ppp-mute"), Jt = () => {
    Gt.textContent = zt();
  };
  for (const k of [Ot, on, Te])
    k.oninput = Jt, k.onchange = Jt;
  Jt();
  function Ke(k) {
    var yt, xt;
    const z = (yt = k.gate) == null ? void 0 : yt.gifts;
    if (!(z != null && z.enabled) || !z.admin || ["off", "elsewhere", "unsupported"].includes(k.step)) return null;
    const H = t.main(), W = [St("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!H)
      W.push(St("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (z.admin) {
      const te = St("div", "", "ppp-gift-admin"), qt = (Dt, ht) => {
        const Kt = St("label", Dt);
        return Kt.append(ht), Kt;
      }, ee = L(H);
      te.append(
        St("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        Ye,
        Pe,
        _e,
        ie,
        Sr("Sign and make player", () => void I(H, { title: Ye.value, subtitle: Pe.value, tracks: _e.value, cover: ie.value }))
      );
      const Yt = Sr("Sign, pay and make links", () => {
        ae(H, lt(), Ze.value.trim(), Ot.value || void 0);
      });
      Yt.disabled = !!q;
      const Ae = Ot.value;
      Ot.replaceChildren(xa("No album (starter copies)", ""), ...ee.map((Dt) => xa(`${Dt.title} · ${Dt.tracks} songs`, Dt.id))), ee.some((Dt) => Dt.id === Ae) && (Ot.value = Ae), Jt(), te.append(
        St("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        qt("Album ", Ot),
        qt("Plays each ", on),
        qt("Copies ", Te),
        Ze,
        Gt,
        Yt
      ), t.now() - ot > 3e4 && (ot = t.now(), at(H));
      const Le = gt(H);
      if (Le.length) {
        const Dt = St("ul", "", "ppp-gift-list");
        for (const ht of Le.slice(0, 10)) {
          const Kt = ht.view, Zt = Kt == null ? void 0 : Kt.copies, de = ht.error ? ht.error : !Kt || Kt.status === "pending-deposit" ? ht.txid ? "payment confirming…" : "waiting for your payment" : `${Zt.claimed} of ${Kt.count} claimed${Zt.refunding + Zt.refunded ? ` · ${Zt.refunded} refunded${Zt.refunding ? `, ${Zt.refunding} on their way` : ""}` : ""}`, oe = St("li");
          if (oe.append(St("span", `${ht.label || "Batch"} · ${ht.count} × ${In(BigInt(ht.amount))} STX`, "t"), St("span", de, "ppp-mute")), !ht.txid && ht.depositTo && (!Kt || Kt.status === "pending-deposit") && oe.append(Sr("Pay now", () => void $t(H, ht.id), "tiny")), ht.codes.length && (Kt == null ? void 0 : Kt.status) === "live") {
            const an = Bt(((xt = k.gate) == null ? void 0 : xt.radioUrl) ?? null, ht);
            oe.append(
              Li("batch-copy:" + ht.id, "Copy all links", () => an.join(`
`), "tiny", t.changed),
              Li("batch-csv:" + ht.id, "Copy as CSV", () => ["copy,link", ...an.map((h, S) => `${S + 1},${h}`)].join(`
`), "tiny", t.changed)
            );
          } else ht.codes.length || oe.append(St("span", "links were made on another device", "ppp-mute"));
          Dt.append(oe);
        }
        te.append(Dt);
      }
      W.push(te);
    }
    return q && W.push(St("p", q, "ppp-cyan")), Y && W.push(St("p", Y, /✓/.test(Y) ? "ppp-ok" : "ppp-warn")), J.replaceChildren(...W), J;
  }
  return { banner: _, funder: M, renderFold: Ke, liveGift: o, incomingAlbum: a, setAside: c, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: E };
}
const b$ = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function m$(t) {
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
const x$ = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((i) => !i.hidden).flatMap((i) => [i.title, i.artist])].filter(Boolean).join(" ").toLowerCase();
};
function S$(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((s) => (!e.pinnedOnly || e.pins.has(s.slot)) && (() => {
    const o = x$(s);
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
function E$(t, e = 100) {
  const n = Object.entries(t).sort((r, i) => i[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, i]) => [Number(r), i]));
}
const Su = /* @__PURE__ */ new Set(), rw = (t) => (Su.add(t), () => {
  Su.delete(t);
}), Eu = () => {
  for (const t of [...Su])
    try {
      t();
    } catch {
    }
}, m0 = "xtrata:al-thumb:v1:", sw = "-", uo = 96, A$ = 24 * 1024 * 1024, Qe = /* @__PURE__ */ new Map(), x0 = /* @__PURE__ */ new Set(), Au = [];
let pl = !1, gl;
const ic = (t, e) => {
  try {
    if (e === void 0) return window.localStorage.getItem(m0 + t);
    window.localStorage.setItem(m0 + t, e);
  } catch {
  }
  return null;
};
function _f(t) {
  return new Promise((e) => {
    var n;
    try {
      const r = document.createElement("canvas"), i = (n = r.getContext) == null ? void 0 : n.call(r, "2d");
      if (!i) return e(t);
      const s = new Image(), o = setTimeout(() => e(t), 8e3);
      s.onload = () => {
        clearTimeout(o);
        try {
          const a = Math.min(s.naturalWidth, s.naturalHeight);
          if (!a) return e(t);
          r.width = r.height = uo, i.fillStyle = "#143a40", i.fillRect(0, 0, uo, uo), i.drawImage(s, (s.naturalWidth - a) / 2, (s.naturalHeight - a) / 2, a, a, 0, 0, uo, uo), e(r.toDataURL("image/jpeg", 0.82));
        } catch {
          e(t);
        }
      }, s.onerror = () => {
        clearTimeout(o), e(t);
      }, s.src = t;
    } catch {
      e(t);
    }
  });
}
async function v$(t) {
  var c, u, d, l, y;
  const e = await fetch("/inscription/" + t, { signal: AbortSignal.timeout(6e4) }), n = (e.headers.get("content-type") || "").toLowerCase();
  if (!e.ok)
    return await ((c = e.body) == null ? void 0 : c.cancel()), null;
  if (n.startsWith("image/"))
    return await ((u = e.body) == null ? void 0 : u.cancel()), "/inscription/" + t;
  if (!n.includes("text/html"))
    return await ((d = e.body) == null ? void 0 : d.cancel()), "";
  let r = "", i = 0;
  const s = (p) => {
    let m = 0;
    for (; ; ) {
      const x = r.slice(m).search(/<img\b/i);
      if (x < 0)
        return r = p ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const T = m + x, K = r.indexOf(">", T);
      if (K < 0)
        return r = r.slice(T), null;
      const V = r.slice(T, K + 1), E = V.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (E) return E[1].replace(/&amp;/g, "&");
      const _ = V.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (_) return "/inscription/" + _[1];
      m = K + 1;
    }
  }, o = (y = (l = e.body) == null ? void 0 : l.getReader) == null ? void 0 : y.call(l);
  if (!o)
    return r = await e.text(), s(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: p, value: m } = await o.read();
    if (p) break;
    i += m.byteLength, r += a.decode(m, { stream: !0 });
    const x = s(!1);
    if (x)
      return await o.cancel(), x;
    if (i > A$)
      return await o.cancel(), null;
  }
  return r += a.decode(), s(!0) ?? "";
}
async function $$() {
  if (!pl) {
    pl = !0;
    try {
      for (; Au.length; ) {
        const t = Au.shift();
        if (!Qe.has(t))
          try {
            const e = await v$(t);
            if (e === null) continue;
            if (!e) {
              Qe.set(t, ""), ic(t, sw), Eu();
              continue;
            }
            const n = await _f(e);
            Qe.set(t, n), n.startsWith("data:image/jpeg") && ic(t, n), Eu();
          } catch {
          }
      }
    } finally {
      pl = !1;
    }
  }
}
function iw(t, e) {
  if (e && !Qe.get(t) ? (Qe.set(t, e), _f(e).then((r) => {
    r !== e && (Qe.set(t, r), r.startsWith("data:image/jpeg") && ic(t, r), Eu());
  })) : e === "" && !Qe.has(t) && Qe.set(t, ""), Qe.has(t)) return Qe.get(t);
  const n = ic(t);
  if (n != null) {
    const r = n === sw ? "" : n;
    return Qe.set(t, r), r;
  }
  return x0.has(t) || (x0.add(t), Au.push(t), gl || (gl = setTimeout(() => {
    gl = void 0, $$();
  }, 1200))), "";
}
const Si = 12, k$ = 5e3, qe = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Ei = (t, e, n = "") => {
  const r = qe("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function I$(t) {
  let e, n = [], r = 0, i = !1, s = !1, o = -1 / 0, a = "", c = "recent", u = !1, d = Si;
  const l = qe("div", "", "ppp-shelf-box");
  rw(() => t.changed());
  const y = (b) => "xtrata.radio.shelf.pins.v1:" + b, p = (b) => "xtrata.radio.shelf.recent.v1:" + b, m = (b, C) => {
    try {
      return JSON.parse(t.store.get(b) || "null") ?? C;
    } catch {
      return C;
    }
  }, x = (b) => new Set(m(y(b), []).filter((C) => Number.isSafeInteger(C))), T = (b) => {
    const C = m(p(b), {}), D = {};
    for (const [L, I] of Object.entries(C)) Number.isSafeInteger(Number(L)) && typeof I == "number" && (D[Number(L)] = I);
    return D;
  };
  async function K(b) {
    if (!i) {
      i = !0, s = !1;
      try {
        const C = [];
        let D = 0, L = 0;
        for (let I = 0; I < k$ / 100 + 1; I++) {
          const F = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(b)}&after=${D}&limit=100`);
          if (C.push(...m$(F == null ? void 0 : F.shelf)), L = Number(F == null ? void 0 : F.total) || C.length, !(F != null && F.next) || !Number.isSafeInteger(F.next)) break;
          D = F.next;
        }
        b === e && (n = C, r = L, o = t.now());
      } catch {
        s = !0;
      } finally {
        i = !1, t.changed();
      }
    }
  }
  const V = () => {
    o = -1 / 0;
  }, E = qe("input");
  E.type = "search", E.placeholder = "Search title, artist or #", E.setAttribute("aria-label", "Search your albums"), E.oninput = () => {
    a = E.value, d = Si, t.changed();
  };
  const _ = qe("select");
  _.setAttribute("aria-label", "Sort albums");
  for (const b of b$) {
    const C = document.createElement("option");
    C.value = b.value, C.textContent = b.label, _.append(C);
  }
  _.onchange = () => {
    c = _.value, d = Si, t.changed();
  };
  const M = Ei("", () => {
    u = !u, d = Si, t.changed();
  }, "tiny"), J = qe("div", "", "ppp-shelf-tools");
  J.append(E, _, M);
  const et = qe("div"), q = qe("div");
  function Y(b) {
    const C = b.step === "off" || b.step === "elsewhere" ? void 0 : b.root;
    if (C !== e && (e = C, n = [], r = 0, o = -1 / 0, d = Si), !C || b.walletCannotAlbums) return null;
    if (!i && t.now() - o > 5 * 6e4 && K(C), !n.length)
      return s ? (q.replaceChildren(qe("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Ei("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(q), l) : null;
    const D = x(C), L = T(C), I = S$(n, { query: a, sort: c, pinnedOnly: u, pins: D, recents: L });
    E.value !== a && (E.value = a), _.value = c, M.textContent = u ? "★ Pinned only" : "☆ Pinned only", M.setAttribute("aria-pressed", String(u));
    const F = [];
    if (b.slot > 0 && F.push(Ei("← My player", () => t.open(0), "quiet")), !I.length) F.push(qe("p", "No album matches that.", "ppp-mute"));
    else {
      const gt = qe("ul", "", "ppp-shelf-list");
      for (const A of I.slice(0, d)) {
        const U = qe("li", "", A.slot === b.slot ? "now" : ""), it = D.has(A.slot), ot = Ei(it ? "★" : "☆", () => {
          const ce = new Set(D);
          it ? ce.delete(A.slot) : ce.add(A.slot), t.store.set(y(C), JSON.stringify([...ce])), t.changed();
        }, "tiny");
        ot.setAttribute("aria-label", it ? `Unpin ${A.player.title}` : `Pin ${A.player.title}`);
        const at = [A.player.subtitle, `${Bi(A.player).length} ${Bi(A.player).length === 1 ? "song" : "songs"}`, A.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), $t = A.slot === b.slot, ae = Ei($t ? "Playing" : "Select", () => {
          t.store.set(p(C), JSON.stringify(E$({ ...L, [A.slot]: t.now() }))), t.open(A.slot);
        }, $t ? "tiny ppp-pick" : "tiny primary ppp-pick");
        ae.disabled = $t;
        const lt = Bi(A.player)[0], zt = A.player.cover ?? (lt == null ? void 0 : lt.id), Bt = zt ? iw(String(zt)) : "", Ut = qe("span", "", "ppp-shelf-art");
        if (Bt) {
          const ce = document.createElement("img");
          ce.src = Bt, ce.alt = "", ce.decoding = "async", Ut.append(ce);
        } else Ut.textContent = "💿";
        const wt = qe("span", "", "ppp-shelf-txt");
        wt.append(qe("span", A.player.title, "t"), qe("span", at, "ppp-mute")), U.append(ot, Ut, wt, ae), gt.append(U);
      }
      F.push(gt), I.length > d && F.push(Ei(`Show more (${I.length - d} left)`, () => {
        d += Si, t.changed();
      }, "quiet"));
    }
    return s && F.push(qe("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), et.replaceChildren(...F), l.firstChild !== J && l.replaceChildren(J, et), l;
  }
  return { render: Y, invalidate: V, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const b = T(e), C = [...n].filter((D) => D.player).sort((D, L) => (b[L.slot] ?? 0) - (b[D.slot] ?? 0) || L.slot - D.slot)[0];
    return C ? { slot: C.slot, title: C.player.title } : null;
  } };
}
const L$ = 20, ze = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, me = {
  grid: ze('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: ze('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: ze('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: ze('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: ze('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: ze('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: ze('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: ze('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: ze('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: ze('<path d="M6 9l6 6 6-6"/>', 18),
  right: ze('<path d="M9 6l6 6-6 6"/>', 16),
  close: ze('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: ze('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: ze('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: ze('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: ze('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: ze('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function Q(t, e = {}, ...n) {
  const r = document.createElement(t);
  for (const [i, s] of Object.entries(e))
    s == null || s === !1 || (i === "class" ? r.className = String(s) : i === "html" ? r.innerHTML = String(s) : i.startsWith("on") && typeof s == "function" ? r[i.toLowerCase()] = s : i === "disabled" ? r.disabled = !!s : r.setAttribute(i, s === !0 ? "" : String(s)));
  for (const i of n) i != null && i !== !1 && r.append(i);
  return r;
}
const Ve = (t, ...e) => Q("button", { type: "button", ...t }, ...e), Sa = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, fo = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, C$ = { music: "My music", device: "This device", gifts: "Albums (admin)" }, T$ = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function S0(t, e, n = {}) {
  const r = !!n.list;
  let i = null, s = "", o = !1;
  const a = document.documentElement, c = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set();
  function d(b) {
    var D, L, I;
    if (!b || !Number.isSafeInteger(b)) return "";
    const C = (I = (L = (D = e.radio()) == null ? void 0 : D.getState) == null ? void 0 : L.call(D)) == null ? void 0 : I.albumCover;
    return C != null && C.url && Number(C.tokenId) === b ? C.url : c.has(b) ? c.get(b) : (u.has(b) || (u.add(b), fetch("/inscription/" + b, { signal: AbortSignal.timeout(2e4) }).then(async (F) => {
      var A, U, it, ot;
      const gt = (F.headers.get("content-type") || "").toLowerCase();
      if (!F.ok)
        throw await ((A = F.body) == null ? void 0 : A.cancel()), new Error("no cover");
      return gt.startsWith("image/") ? (await ((U = F.body) == null ? void 0 : U.cancel()), "/inscription/" + b) : gt.includes("text/html") ? (((it = (await F.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : it[1]) ?? "").replace(/&amp;/g, "&") : (await ((ot = F.body) == null ? void 0 : ot.cancel()), "");
    }).then((F) => {
      c.set(b, F), N();
    }).catch(() => {
      u.delete(b);
    })), "");
  }
  rw(() => N());
  function l(b) {
    var D;
    s = b, b ? a.dataset.sheet = b : delete a.dataset.sheet;
    const C = document.querySelector(".side");
    if (b && b !== "more") {
      for (const F of T$[b]) {
        const gt = C == null ? void 0 : C.querySelector(F);
        gt && (gt.open = !0);
      }
      const L = document.getElementById("sheetTitle");
      L && (L.textContent = C$[b]);
      const I = document.getElementById("sheetExtra");
      I && I.replaceChildren(...b === "music" ? [p()] : []), (D = C == null ? void 0 : C.scrollTo) == null || D.call(C, { top: 0 });
    }
    N();
  }
  const y = r ? null : document.getElementById("sheetClose");
  y && (y.onclick = () => l("")), r || document.addEventListener("keydown", (b) => {
    b.key === "Escape" && s && a.dataset.view === "album" && l("");
  });
  const p = () => Ve(
    { class: "al-row", onClick: () => {
      l(""), e.openPlayer();
    } },
    Q("span", { class: "al-row-i", html: me.radio }),
    Q("span", { class: "al-row-t" }, Q("b", {}, "Xtrata Radio"), Q("small", {}, "Every song on-chain · FM, liked, all")),
    Q("span", { class: "al-row-go", html: me.right })
  );
  let m = null, x = !1;
  const T = () => {
    var C;
    const b = e.radio();
    x || !(b != null && b.subscribe) || (x = !0, b.subscribe((D) => {
      m = D, (i == null ? void 0 : i.mode) === "open" && N();
    }), m = ((C = b.getState) == null ? void 0 : C.call(b)) ?? null);
  };
  r || setInterval(() => {
    var L, I;
    if ((i == null ? void 0 : i.mode) !== "open" || !(m != null && m.playing)) return;
    const b = (I = (L = e.radio()) == null ? void 0 : L.getPosition) == null ? void 0 : I.call(L), C = t.querySelector(".al-bar > i"), D = t.querySelectorAll(".al-times span");
    !b || !C || (C.style.width = b.duration ? `${Math.min(100, b.current / b.duration * 100)}%` : "0%", D.length === 2 && (D[0].textContent = Sa(b.current || 0), D[1].textContent = b.duration ? Sa(b.duration) : "–:––"));
  }, 500);
  let K = "", V = null;
  function E(b, C, D = {}) {
    const L = D.song || d(b.cover), F = [L ? Q("img", { src: L, alt: D.song ? "Song artwork" : `${b.title} cover` }) : Q("div", { class: "al-cover-fallback" }, Q("b", {}, b.title), b.subtitle ? Q("span", {}, b.subtitle) : null), D.paused ? Q("span", { class: "al-paused" }, Q("i", { html: me.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], gt = "al-cover" + (C ? "" : " al-cover--small") + (D.paused ? " is-paused" : "");
    return D.flip ? (F.push(Q("span", { class: "al-flip", "aria-hidden": "true", html: me.flip })), Ve({ class: gt + " is-flippable", "aria-label": D.flipped ? "Show this song’s artwork" : `Show the ${b.title} cover`, onClick: D.flip }, ...F)) : Q("div", { class: gt }, ...F);
  }
  function _(b) {
    return b.plays === null || b.plays === void 0 ? Q("span", { class: "al-chip al-chip--quiet" }, b.playsComing ? "Plays on their way…" : "…") : b.plays === 0 ? Q("span", { class: "al-chip al-chip--out" }, b.playsComing ? "Plays on their way…" : "No plays left") : Q("span", { class: "al-chip" + (b.plays <= L$ ? " al-chip--low" : "") }, `${fo(b.plays, "play", "plays")} left`);
  }
  function M(b) {
    const C = b.player, D = C.tracks.filter((I) => !I.hidden), L = [];
    return b.mode === "arrive" && b.from && L.push(Q("p", { class: "al-from" }, Q("span", { html: me.gift }), Q("span", {}, Q("b", {}, b.from), " sent you an album"))), L.push(E(C, !0)), L.push(Q(
      "div",
      { class: "al-intro" },
      Q("h1", {}, C.title),
      C.subtitle ? Q("p", { class: "al-artist" }, C.subtitle) : null,
      D.length ? Q("p", { class: "al-songline" }, D.map((I) => I.title || `#${I.id}`).join(" · ")) : null,
      Q("span", { class: "al-chip" }, [fo(D.length, "song", "songs"), b.offered ? fo(b.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), b.status.length && L.push(Q("div", { class: "al-status", role: "status" }, ...b.status)), L.push(Q("div", { class: "al-grow" })), b.asking ? L.push(Q("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : b.primary && L.push(Ve({ class: "al-primary", onClick: b.primary.run, disabled: b.busy }, Q("span", { html: me.playSmall }), b.primary.label)), b.hint && !b.asking && L.push(Q("p", { class: "al-hint" }, b.hint)), b.secondary && !b.asking && L.push(Ve({ class: "al-link", onClick: b.secondary.run, disabled: b.busy }, b.secondary.label)), L;
  }
  function J(b, C) {
    const { songs: D, current: L, started: I, own: F, out: gt, waiting: A } = C, U = b.player, it = e.radio(), ot = [];
    ot.push(Q("div", { class: "al-listhead" }, Q("span", {}, Q("b", {}, U.title), ` · ${fo(D.length, "song", "songs")}`), _(b)));
    const at = d(U.cover), $t = "album:" + U.cover;
    at && !Qe.has($t) && (Qe.set($t, at), _f(at).then((lt) => {
      lt !== at && (Qe.set($t, lt), N());
    }));
    const ae = at ? Qe.get($t) || at : "";
    return ot.push(Q("ol", { class: "al-tracks" }, ...D.map((lt, zt) => {
      const Bt = String(lt.id) === L, Ut = iw(String(lt.id), Bt && I ? F : void 0);
      return Q("li", {}, Ve(
        { class: "al-track" + (Bt ? " is-on" : ""), "aria-label": `Play ${lt.title || "#" + lt.id}`, "aria-current": Bt ? "true" : void 0, disabled: gt || A, onClick: () => {
          var wt;
          return (wt = it == null ? void 0 : it.playToken) == null ? void 0 : wt.call(it, lt.id);
        } },
        Q(
          "span",
          { class: "al-th" + (Ut ? "" : " is-blank") },
          Ut ? Q("img", { src: Ut, alt: "", decoding: "async" }) : ae ? Q("img", { src: ae, alt: "", decoding: "async" }) : null,
          Ut ? null : Q("span", { class: "al-n" }, String(zt + 1)),
          Bt ? Q("span", { class: "al-eq", html: me.eq }) : null
        ),
        Q("span", { class: "al-tt" }, lt.title || `#${lt.id}`)
      ));
    }))), ot;
  }
  function et(b) {
    var Ut;
    const C = b.player, D = C.tracks.filter((wt) => !wt.hidden), L = e.radio(), I = m == null ? void 0 : m.nowPlaying, F = I && C.tracks.some((wt) => String(wt.id) === String(I.tokenId)) ? String(I.tokenId) : null, gt = F ? C.tracks.find((wt) => String(wt.id) === F) : null, A = b.plays === 0 && !b.playsComing, U = !!b.playsComing && !b.plays, it = !!(m != null && m.playing) && !!F, ot = m == null ? void 0 : m.heart, at = F ? (Ut = L == null ? void 0 : L.getPosition) == null ? void 0 : Ut.call(L) : null;
    F && (it || ((at == null ? void 0 : at.current) ?? 0) > 0.5) && (K = C.id);
    const $t = !!F && K === C.id;
    V && V !== F && (V = null);
    const ae = $t ? String((I == null ? void 0 : I.cover) || "") : "", lt = !!ae && V === F, Bt = [E(C, !A, { song: lt ? "" : ae, paused: $t && !it, flip: ae ? () => {
      V = V === F ? null : F, N();
    } : void 0, flipped: lt })];
    if (Bt.push(Q(
      "div",
      { class: "al-now" },
      Q(
        "div",
        { class: "al-now-t" },
        Q("div", { class: "al-song" }, gt ? gt.title || (I == null ? void 0 : I.title) || `#${gt.id}` : C.title),
        Q("div", { class: "al-artist" }, gt ? gt.artist || (I == null ? void 0 : I.artist) || C.subtitle : C.subtitle || "Press play")
      ),
      F ? Ve({ class: "al-icon" + (ot != null && ot.liked ? " is-on" : ""), "aria-label": ot != null && ot.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(ot != null && ot.liked)), disabled: !!(ot != null && ot.pending) || !!(ot != null && ot.locked) || U, onClick: () => {
        var wt;
        return (wt = L == null ? void 0 : L.toggleLike) == null ? void 0 : wt.call(L);
      }, html: ot != null && ot.liked ? me.heartOn : me.heart }) : null
    )), A)
      Bt.push(Q(
        "div",
        { class: "al-out" },
        Q("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        Q("p", { class: "al-out-t" }, "You've played this album out"),
        Q("p", { class: "al-out-s" }, "Add plays to keep listening."),
        q(b, !0)
      ));
    else {
      const wt = at != null && at.duration ? Math.min(100, at.current / at.duration * 100) : 0;
      Bt.push(Q(
        "div",
        { class: "al-prog" },
        Q("div", { class: "al-bar" }, Q("i", { style: `width: ${wt}%` })),
        Q("div", { class: "al-times" }, Q("span", {}, Sa((at == null ? void 0 : at.current) || 0)), Q("span", {}, at != null && at.duration ? Sa(at.duration) : "–:––"))
      ));
    }
    return Bt.push(Q(
      "div",
      { class: "al-ctl" + (A || U ? " is-off" : "") },
      Ve({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: A || U, onClick: () => {
        var wt;
        return (wt = L == null ? void 0 : L.prev) == null ? void 0 : wt.call(L);
      }, html: me.prev }),
      Ve({ class: "al-play", "aria-label": it ? "Pause" : "Play", disabled: A || U, onClick: () => {
        var wt;
        return (wt = L == null ? void 0 : L.playPause) == null ? void 0 : wt.call(L);
      }, html: it ? me.pause : me.play }),
      Ve({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: A || U, onClick: () => {
        var wt;
        return (wt = L == null ? void 0 : L.next) == null ? void 0 : wt.call(L);
      }, html: me.next })
    )), b.status.length && Bt.push(Q("div", { class: "al-status", role: "status" }, ...b.status)), Bt.push(...J(b, { songs: D, current: F, started: $t, own: ae, out: A, waiting: U })), Bt.push(Q("div", { class: "al-grow" })), Bt.push(Ve(
      { class: "al-more", "aria-expanded": String(s === "more"), onClick: () => l(s === "more" ? "" : "more") },
      Q("span", {}, "More ", Q("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      Q("span", { html: me.down })
    )), Bt;
  }
  function q(b, C) {
    const D = Q("div", { class: "al-topups" + (C ? " al-topups--primary" : "") }), L = C ? [b.topUps[1] ?? b.topUps[0]] : [...b.topUps];
    for (const I of L) {
      const F = b.myPlays !== void 0 && b.myPlays >= I && !b.playsComing && !b.busy;
      D.append(Ve({ class: "al-topup", disabled: !F, onClick: () => e.topUp(I) }, C ? `Add ${I.toLocaleString()} plays` : `+${I.toLocaleString()}`));
    }
    return C && D.append(Ve({ class: "al-link", onClick: () => l("more") }, "Other amounts")), D;
  }
  function Y(b) {
    const C = b.myPlays !== void 0 && b.myPlays >= (b.topUps[0] ?? 0), D = Q(
      "div",
      { class: "al-card" },
      Q("div", { class: "al-card-h" }, Q("b", {}, `Add plays to ${b.player.title}`), Q("span", { class: "al-mono" }, b.plays === null || b.plays === void 0 ? "" : `${b.plays.toLocaleString()} left`)),
      q(b, !1),
      Q("p", { class: "al-mute al-small" }, b.playsComing ? "Plays are on their way. Add more once they arrive." : b.myPlays === void 0 ? "Checking My player…" : C ? `Moved from My player · ${fo(b.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !C && !b.playsComing && b.myPlays !== void 0 ? Ve({ class: "al-link", onClick: () => {
        l(""), e.openPlayer();
      } }, "Open My player") : null
    ), L = (F, gt, A, U) => Ve(
      { class: "al-row", onClick: U },
      Q("span", { class: "al-row-i", html: F }),
      Q("span", { class: "al-row-t" }, Q("b", {}, gt), Q("small", {}, A)),
      Q("span", { class: "al-row-go", html: me.right })
    ), I = Q(
      "div",
      { class: "al-how" + (o ? " is-open" : "") },
      L(me.info, "How plays work", "Every play counts for the song’s owner", () => {
        o = !o, N();
      }),
      o ? Q("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return Q(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      Q("div", { class: "al-sheet-h" }, Q("b", {}, "More"), Ve({ class: "al-icon", "aria-label": "Close", onClick: () => l(""), html: me.close })),
      b.mode === "open" ? D : null,
      Q(
        "div",
        { class: "al-rows" },
        L(me.grid, "My music", "Your albums and the radio", () => l("music")),
        L(me.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          l(""), e.openPlayer();
        }),
        b.canMake ? L(me.gift, "Albums (admin)", "Make an album and fund copies", () => l("gifts")) : null,
        L(me.device, "This device", "Backup, history, Stacks wallet, returns", () => l("device")),
        I
      )
    );
  }
  function v(b) {
    var A, U;
    const C = b.player, D = m == null ? void 0 : m.nowPlaying, L = D && C.tracks.some((it) => String(it.id) === String(D.tokenId)) ? String(D.tokenId) : null, I = !!(m != null && m.playing) && !!L, F = L ? (U = (A = e.radio()) == null ? void 0 : A.getPosition) == null ? void 0 : U.call(A) : null;
    L && (I || ((F == null ? void 0 : F.current) ?? 0) > 0.5) && (K = C.id);
    const gt = !!L && K === C.id;
    return J(b, {
      songs: C.tracks.filter((it) => !it.hidden),
      current: L,
      started: gt,
      own: gt ? String((D == null ? void 0 : D.cover) || "") : "",
      out: b.plays === 0 && !b.playsComing,
      waiting: !!b.playsComing && !b.plays
    });
  }
  function N() {
    const b = i;
    if (r) {
      if (!b || b.mode !== "open") {
        t.hidden = !0, t.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      T(), t.hidden = !1, a.dataset.albumlist = "1", t.replaceChildren(...v(b));
      return;
    }
    if (!b) {
      t.hidden = !0, t.replaceChildren();
      return;
    }
    T(), t.hidden = !1;
    const C = Q(
      "header",
      { class: "al-top" },
      Q("a", { class: "al-brand", href: "/radio" }, "Xtrata ", Q("b", {}, "Music")),
      b.mode === "open" ? Ve({ class: "al-icon", "aria-label": "My music", onClick: () => l("music"), html: me.grid }) : null
    ), D = Q("div", { class: "al-body al-body--" + b.mode }, ...b.mode === "open" ? et(b) : M(b));
    t.replaceChildren(C, D, ...s === "more" ? [Q("div", { class: "al-scrim", onClick: () => l("") }), Y(b)] : []);
  }
  return {
    render(b) {
      if (r) {
        i = b, N();
        return;
      }
      const C = !!i;
      i = b, !b && (C || s) && (s = "", delete a.dataset.sheet), b ? a.dataset.view = "album" : delete a.dataset.view, b != null && b.asking ? a.dataset.asking = "1" : delete a.dataset.asking, N();
    },
    sheet: () => s,
    setSheet: l
  };
}
const B$ = [
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
function M$(t) {
  for (const [e, n] of B$) if (n.test(t)) return e;
  return null;
}
const ow = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), aw = (t) => /Android/.test(t);
function N$(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : ow(e) ? "x-safari-" + n.href : aw(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const P$ = (t) => ow(t) ? "Safari" : aw(t) ? "Chrome" : "your browser", E0 = document.getElementById("ppp");
E0 && _$(E0);
function _$(t) {
  var an;
  const e = Dw(), n = (h) => t.querySelector(h), r = n(".ppp-frame");
  let i = null;
  const s = async (h, S) => {
    const f = await fetch(h, { cache: "no-store", ...S, signal: AbortSignal.timeout(15e3) }), R = await f.json().catch(() => ({}));
    if (!f.ok) throw new Error((R == null ? void 0 : R.error) || `Request failed (${f.status}).`);
    return R;
  }, o = h6({
    now: Date.now,
    main: () => {
      const h = e.load();
      return h.isConnected && h.network === "mainnet" ? h.address : void 0;
    },
    config: (h) => s("/radio/listening-wallet/config?main=" + encodeURIComponent(h || "")),
    links: async (h) => (await s("/radio/listening-wallet/link?main=" + encodeURIComponent(h))).links ?? [],
    mainOf: async (h) => {
      var f;
      const S = (await s("/radio/listening-wallet/link?listening=" + encodeURIComponent(h))).links;
      return ((f = S == null ? void 0 : S.find((R) => R.listening === h)) == null ? void 0 : f.main) ?? null;
    },
    saveLink: async (h) => {
      await s("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(h) });
    },
    bridge: async (h) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${h}; publickey-credentials-create ${h}`), i.referrerPolicy = "no-referrer";
      const S = new Promise((mt, st) => {
        i.addEventListener("load", () => mt(), { once: !0 }), setTimeout(() => st(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      i.src = h + "/", r.replaceChildren(i), await S;
      const f = new Tw({ walletOrigin: h, frame: i, timeoutMs: 30 * 6e4 }), R = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), ut = (mt, st) => R.has(mt) ? f.request(mt, st) : Promise.race([
        f.request(mt, st),
        new Promise((Wt, Ue) => setTimeout(() => Ue(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await ut("listening.status"), { request: ut };
    },
    chain: {
      verify: V5,
      balance: W5,
      account: q5,
      owner: X5,
      broadcast: Y5,
      transaction: Z5,
      confirmedNonce: async (h) => {
        const S = await fs(`/v2/accounts/${h}?proof=0`);
        if (!Number.isSafeInteger(S == null ? void 0 : S.nonce) || S.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(S.nonce);
      }
    },
    signWithMain: (h, S) => Jh({ ...S, network: "mainnet", stxAddress: h }),
    deposit: (h, S, f) => new Promise((R, ut) => Wh({
      recipient: S,
      amount: f.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: h,
      network: new yl(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (mt) => R(mt.txId || ""),
      onCancel: () => ut(new Error("Deposit cancelled. Nothing was sent.")),
      onError: ut
    })),
    validate: Q5,
    tabLock: (h) => new Promise((S) => {
      const f = navigator.locks;
      if (!(f != null && f.request)) {
        S(!0);
        return;
      }
      f.request("xtrata-ppp:" + h, { ifAvailable: !0 }, async (R) => {
        S(!!R), R && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (h) => {
        try {
          return localStorage.getItem(h);
        } catch {
          return null;
        }
      },
      set: (h, S) => {
        try {
          localStorage.setItem(h, S);
        } catch {
        }
      }
    },
    changed: () => ht(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (h) => {
      var S, f;
      return a.funder(h, () => s6(h, fs), !!((f = (S = o.snapshot().gate) == null ? void 0 : S.gifts) != null && f.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (h) => {
      const S = await s("/radio/gift/for?wallet=" + encodeURIComponent(h)), f = S == null ? void 0 : S.gift;
      if (!f) return null;
      if (typeof f.returnTo != "string" || typeof f.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: f.returnTo, from: typeof f.from == "string" ? f.from : null, source: String(f.source ?? ""), amount: String(f.amount ?? "0"), treasury: f.treasury, state: f.state === "sending" ? "sending" : "arrived", player: f.player ?? null };
    },
    history: (h, S) => a6(h, (f) => fs(f), S),
    likesChanged: () => {
      var h, S;
      (S = (h = window.XtrataRadio) == null ? void 0 : h.refreshLikes) == null || S.call(h);
    },
    likeState: async (h, S) => {
      const f = await s("/radio/chain-likes?" + new URLSearchParams({ wallet: h, ids: String(S) })), R = Array.isArray(f == null ? void 0 : f.rows) ? f.rows.find((ut) => (ut == null ? void 0 : ut.id) === S) : null;
      if (!R || typeof R.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: R.liked, by: Array.isArray(R.by) ? R.by.filter((ut) => typeof ut == "string") : R.liked ? [h] : [] };
    },
    likeSent: (h, S) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: h, liked: S } })),
    nameOf: (h) => at(h) ?? void 0,
    likeConfirmed: (h, S) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: h, liked: S } })),
    likeFailed: (h) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: h } }))
  }), a = w$({
    json: s,
    main: () => {
      const h = e.load();
      return h.isConnected && h.network === "mainnet" ? h.address : void 0;
    },
    pay: (h, S, f, R) => new Promise((ut, mt) => Wh({
      recipient: S,
      amount: f.toString(),
      memo: R,
      stxAddress: h,
      network: new yl(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (st) => ut(st.txId || ""),
      onCancel: () => mt(new Error("Gift cancelled. Nothing was sent.")),
      onError: mt
    })),
    sign: (h, S) => Jh({ ...S, network: "mainnet", stxAddress: h }),
    giftSent: (h, S) => o.giftSent(h, S),
    claiming: (h) => o.giftClaiming(h),
    album: { bind: (h) => o.bindAlbum(h), arrived: async (h, S, f, R) => {
      c.invalidate(), await o.albumArriving(h, S, f, R);
    } },
    who: (h) => lt(h),
    changed: () => ht(o.snapshot()),
    store: {
      get: (h) => {
        try {
          return localStorage.getItem(h);
        } catch {
          return null;
        }
      },
      set: (h, S) => {
        try {
          S === null ? localStorage.removeItem(h) : localStorage.setItem(h, S);
        } catch {
        }
      }
    },
    now: Date.now
  }), c = I$({
    json: s,
    open: (h) => {
      o.openAlbum(h);
    },
    store: {
      get: (h) => {
        try {
          return localStorage.getItem(h);
        } catch {
          return null;
        }
      },
      set: (h, S) => {
        try {
          S === null ? localStorage.removeItem(h) : localStorage.setItem(h, S);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => ht(o.snapshot())
  }), u = (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), d = u ? document.getElementById("album") : null, l = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (h) => void o.topUpAlbum(h),
    openPlayer: () => void o.openAlbum(0)
  }, y = d ? S0(d, l) : null, p = document.getElementById("albumList"), m = p ? S0(p, l, { list: !0 }) : null, x = "xtrata.radio.album.last.v1", T = () => {
    try {
      const h = JSON.parse(localStorage.getItem(x) || "null");
      return h && typeof h.root == "string" && Number.isSafeInteger(h.slot) && h.slot > 0 && h.player && Array.isArray(h.player.tracks) ? h : null;
    } catch {
      return null;
    }
  };
  let K = "";
  const V = (h) => {
    const S = JSON.stringify(h);
    if (S !== K) {
      K = S;
      try {
        localStorage.setItem(x, S);
      } catch {
      }
    }
  };
  let E = null;
  window.XtrataRadioLikeHandler = (h) => {
    if (!h || !Number.isSafeInteger(h.song) || h.song < 0) return !1;
    ce();
    const S = sn(h.song, { title: h.title, artist: h.artist });
    return o.heart({ song: h.song, title: S.title || void 0, artist: S.artist || void 0, likedBy: Array.isArray(h.likedBy) ? h.likedBy : void 0 });
  };
  let _;
  window.XtrataRadioListeningIdentity = () => {
    const h = o.snapshot();
    return h.solo && h.step !== "off" && h.step !== "elsewhere" ? h.listening : void 0;
  };
  const M = (h) => {
    var f, R;
    const S = window.XtrataRadioListeningIdentity();
    S !== _ && (_ = S, (R = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || R.call(f));
  };
  let J = "", et = null, q = !1, Y = !1;
  const v = (h) => {
    var Wt, Ue, ye, hn, he, Nn, Fe, Pn;
    const S = window.XtrataRadio;
    if (!(S != null && S.setGiftPlayer) || !(S != null && S.setGiftStop)) return;
    const f = h.step === "off" || h.step === "elsewhere" ? null : ((Wt = h.gift) == null ? void 0 : Wt.player) ?? null, R = f ? f.id + ":" + f.cover + ":" + f.tracks.map((pn) => pn.id).join(",") : "";
    R !== J && (S.setGiftPlayer(f ? { id: f.id, title: f.title, subtitle: f.subtitle, tracks: Bi(f).map((pn) => pn.id), hidden: ((Ue = h$(f)) == null ? void 0 : Ue.id) ?? null, cover: f.cover } : null), J = R);
    const ut = ((ye = h.giftStop) == null ? void 0 : ye.text) ?? null;
    ut !== et && (S.setGiftStop(ut), et = ut);
    const mt = ((hn = h.giftStop) == null ? void 0 : hn.reason) === "arriving";
    mt !== Y && ((he = S.setGiftWait) == null || he.call(S, mt), Y = mt);
    const st = !!f && !!((Nn = h.albumLock) != null && Nn.locked);
    st !== q && ((Fe = S.setGiftLock) == null || Fe.call(S, st), q = st), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(h.step) && ((Pn = S.forgetWallets) == null || Pn.call(S));
  }, N = (h) => h ? h.slice(0, 6) + "…" + h.slice(-4) : "", b = (h) => {
    const S = o.snapshot().playCost || 350n;
    return h > Ne ? Number((h - Ne) / S) : 0;
  }, C = (h) => (Number(h) / 1e6).toFixed(h < 1000n ? 6 : 4), D = (h) => {
    const S = Math.round((Date.now() - h) / 6e4);
    return S < 1 ? "now" : S < 60 ? `${S}m` : S < 1440 ? `${Math.round(S / 60)}h` : `${Math.round(S / 1440)}d`;
  }, L = (h) => `https://explorer.hiro.so/txid/${h}?chain=mainnet`, I = (h, S = "", f = "") => {
    const R = document.createElement(h);
    return S && (R.textContent = S), f && (R.className = f), R;
  }, F = (h, S, f = "") => {
    const R = I("button", h, f);
    return R.type = "button", R.onclick = S, R;
  }, gt = (h, S) => {
    const f = I("a", h);
    return f.href = S, f.target = "_blank", f.rel = "noopener", f;
  };
  let A = null, U = location.hash === "#give";
  U && history.replaceState(null, "", location.pathname + location.search);
  let it = !1;
  const ot = Y6((h) => X6({ address: h, network: "mainnet" }), () => ht(o.snapshot())), at = (h) => ot.get(h), $t = M$(navigator.userAgent), ae = (h, S) => {
    const f = navigator.userAgent, R = P$(f), ut = `${location.origin}${location.pathname}${S ? `#gift=${S}` : ""}`, mt = [I("p", `You are in ${h}'s built-in browser, where passkeys often do not work. Open this page in ${R} to make your listening wallet${S ? " and claim your gift" : ""}.`, "ppp-warn")], st = I("div", "", "ppp-open-row"), Wt = N$(ut, f);
    if (Wt) {
      const Ue = I("a", `Open in ${R}`, "primary ppp-open-in");
      Ue.href = Wt, Ue.dataset.homeAction = "radio:open-in-browser", st.append(Ue);
    }
    return st.append(Li("copy-page-link", "Copy link", () => ut, Wt ? "" : "primary", () => ht(o.snapshot()))), mt.push(st, I("p", `If that does not open ${R}, use ${h}'s menu (••• or ⋮) and choose "Open in ${R === "your browser" ? "browser" : R}", or paste the copied link there.`, "ppp-mute")), mt;
  }, lt = (h) => at(h) ?? N(h), zt = (h) => h.slice(0, 2).map(lt).join(" and ") + (h.length > 2 ? ` and ${h.length - 2} more` : ""), Bt = /* @__PURE__ */ new Map();
  let Ut = !1;
  const wt = (h) => !h || /^(?:Inscription )?#\d+$/.test(h.trim()), ce = () => {
    Ut || (Ut = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((h) => h.ok ? h.json() : null).then((h) => {
      for (const S of Array.isArray(h == null ? void 0 : h.tracks) ? h.tracks : []) {
        const f = Number(S == null ? void 0 : S.id);
        Number.isSafeInteger(f) && Bt.set(f, { title: typeof S.title == "string" ? S.title : void 0, artist: typeof S.artist == "string" ? S.artist : void 0 });
      }
      ht(o.snapshot());
    }).catch(() => {
      Ut = !1;
    }));
  }, sn = (h, S) => {
    const f = Bt.get(h), R = Q6(h, [f == null ? void 0 : f.title, S == null ? void 0 : S.title].find((mt) => !wt(mt)) || ""), ut = Z6(h, (f == null ? void 0 : f.artist) || (S == null ? void 0 : S.artist) || "");
    return { title: R, artist: ut };
  }, De = (h) => {
    const { title: S, artist: f } = sn(h.song, h);
    return S ? `“${S}”${f ? ` — ${f}` : ""}` : `Song #${h.song}${f ? ` — ${f}` : ""}`;
  }, Ye = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Pe = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function _e(h) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(h.step) ? ["", ""] : h.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : h.step === "over" ? ["TOO MUCH", "bad"] : h.step === "locked" ? ["LOCKED", "mute"] : h.step === "intro" || h.step === "link" ? ["", ""] : h.step === "fund" ? h.depositPending ? ["ON ITS WAY", "warn"] : h.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : h.payingOn && h.session && h.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function ie(h, S, f = "", R) {
    const ut = I("dt", h), mt = I("dd", S, f);
    return R && mt.append(" ", R), [ut, mt];
  }
  const Ot = document.getElementById("ppp-top"), on = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Te = () => {
    var S, f;
    const h = o.snapshot();
    if (h.step === "connect" || h.step === "wrong-wallet") {
      (S = document.getElementById("radio-wallet-connect")) == null || S.click();
      return;
    }
    if (h.step === "elsewhere" && ((f = h.gate) != null && f.radioUrl)) {
      location.href = h.gate.radioUrl;
      return;
    }
    h.step === "locked" && !h.armed && !h.busy && o.unlock(), h.step === "ready" && !h.payingOn && !h.busy && o.switchOn(), on();
  };
  Ot && (Ot.onclick = Te);
  function Ze(h) {
    if (!Ot) return;
    const S = (R, ut, mt) => {
      Ot.hidden = !1, Ot.className = "ppp-top" + (ut ? " is-" + ut : ""), Ot.replaceChildren(I("span", "", "dot"), document.createTextNode(R)), Ot.title = mt;
    }, f = h.session ? Math.min(h.session.playsLeft, h.playsLeft) : 0;
    switch (h.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Ot.hidden = !0;
        return;
      case "elsewhere":
        return S("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        Ot.hidden = !0;
        return;
      case "intro":
        return S("Start listening", "", "Make your player with your face or fingerprint: no app or account needed");
      case "wrong-wallet":
        return S(`Connect ${lt(h.linked)}`, "warn", `This device's listening wallet belongs to ${lt(h.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return S("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return S("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return h.depositPending ? S("Plays on their way", "quiet", "Plays start by themselves when they land") : S(h.entries.some((R) => R.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return S("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return S("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return h.payingOn && f > 0 ? S(`${f.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : S("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const Gt = document.getElementById("pppNudge"), Jt = document.getElementById("onair");
  (an = Gt == null ? void 0 : Gt.querySelector("button")) == null || an.addEventListener("click", () => Te());
  const Ke = {
    connect: "Plays are not counted",
    intro: "Plays are not counted",
    locked: "Locked · plays are not counted",
    "wrong-wallet": "Wrong wallet connected · plays are not counted",
    link: "Plays are not counted yet",
    fund: "No plays yet",
    over: "Paused · plays are not counted",
    ready: "Plays are off"
  }, $n = {
    elsewhere: "Open",
    connect: "Connect",
    "wrong-wallet": "Switch wallet",
    intro: "Start",
    locked: "Unlock",
    link: "Finish setup",
    fund: "Add plays",
    over: "Fix it",
    ready: "Switch on"
  };
  function k(h) {
    if (h.step === "loading") return;
    const S = h.session ? Math.min(h.session.playsLeft, h.playsLeft) : 0, f = h.step === "ready" && h.payingOn && S > 0, R = h.step === "fund" && h.depositPending, ut = h.step === "elsewhere", mt = f || R || ut ? "" : Ke[h.step] ?? "", st = f ? "on" : ut ? "free" : mt ? "off" : "";
    st ? document.documentElement.dataset.ppp = st : delete document.documentElement.dataset.ppp, Jt && (Jt.hidden = !st || st === "free", Jt.querySelector(".onair-sub").textContent = f ? `${S.toLocaleString()} plays left` : "Plays off"), Gt && (Gt.hidden = st !== "off" && st !== "free", Gt.classList.toggle("is-free", st === "free"), st === "free" ? (Gt.querySelector(".nudge-t").textContent = "You’re on the free player", Gt.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", Gt.querySelector("button").textContent = "Get a player") : st === "off" && (Gt.querySelector(".nudge-t").textContent = mt, Gt.querySelector(".nudge-s").textContent = "Every play you count goes to the song’s owner, on-chain.", Gt.querySelector("button").textContent = $n[h.step] ?? "Start"));
  }
  let z = "";
  function H(h) {
    const S = I("div", "", "ppp-pick");
    h.funderMultiple && h.returnToKind === "funder" && S.append(I("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), h.returnToKind === "funder" && S.append(I("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const f = I("input");
    f.type = "text", f.placeholder = "SP… address to send returns to", f.autocomplete = "off", f.spellcheck = !1, f.setAttribute("aria-label", "Address to return funds to"), f.value = z, f.oninput = () => {
      z = f.value;
    };
    const R = F(h.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(f.value), z = "";
    }, "tiny");
    return S.append(f, " ", R), h.returnToKind === "chosen" && S.append(" ", F("Back to the funder", () => o.clearReturnAddress(), "tiny")), S;
  }
  const W = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function yt() {
    const h = I("p", W + " ", "ppp-mute");
    return h.append(gt("Xverse", "https://www.xverse.app/download"), " · ", gt("Leather", "https://leather.io/install-extension")), h;
  }
  let xt = "";
  const te = (h) => {
    const S = document.documentElement, f = h.solo && !h.main ? h.listening ? N(h.listening) : "new" : "", R = b6() ? "1" : "";
    `${f}|${R}` !== xt && (xt = `${f}|${R}`, f ? S.dataset.pppSolo = f : delete S.dataset.pppSolo, R ? S.dataset.pppWalletInstalled = R : delete S.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const h of [1500, 4e3, 9e3]) setTimeout(() => ht(o.snapshot()), h);
  function qt(h, S = "") {
    const f = I("div", "", "ppp-topup"), R = ee(h);
    f.append(I("span", "Add plays from My player: ", "ppp-mute"));
    for (const ut of Ta) {
      const mt = F(`+${ut.toLocaleString()}`, () => void o.topUpAlbum(ut), S);
      mt.disabled = R === void 0 || R < ut || h.depositPending || !!h.busy, f.append(mt);
    }
    return R !== void 0 && R < Ta[0] && f.append(I("p", "My player needs plays first (switch to My player above).", "ppp-mute")), f;
  }
  const ee = (h) => {
    var R;
    const S = (R = h.likeFunds) == null ? void 0 : R.balance;
    if (S === void 0 || !h.playCost) return;
    const f = S - Ne - 6000n;
    return f > 0n ? Number(f / h.playCost) : 0;
  };
  function Yt(h) {
    const S = h.likeFunds;
    if (!S || !S.album || !S.low && !S.pending) return [];
    const f = I("div", "", "ppp-pick ppp-lowbox");
    if (!S.low) {
      const ut = I("p", "Top-up for your main listener wallet is on its way. ", "ppp-warn");
      return S.txid && ut.append(gt("View", L(S.txid))), f.append(ut), [f];
    }
    f.append(I("p", "⚠ YOUR MAIN LISTENER WALLET IS OUT OF FUNDS", "ppp-bad ppp-lowtitle")), f.append(I("p", "It signs every like for all your albums, so they all count for you. Likes are paused until it has a little STX. 0.1 STX is hundreds of likes.")), f.append(I("p", S.address, "ppp-addr-full"));
    const R = I("div", "", "ppp-open-row");
    if (R.append(Li("copy-likes-address", "Copy address", () => S.address, "primary", () => ht(o.snapshot()))), S.main && !h.solo) {
      const ut = Ts - (S.balance ?? 0n);
      ut > 0n && R.append(F(`Pay ${tr(ut)} STX from my wallet`, () => void o.topUpLikes(), "primary"));
    }
    return f.append(R), f.append(I("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [f];
  }
  const Ae = (h) => {
    const S = I("div", "", "ppp-wait");
    S.dataset.since = String(h.since), S.dataset.grace = String(h.graceMs), S.setAttribute("role", "progressbar"), S.setAttribute("aria-label", "Your plays are arriving");
    const f = I("p", "", "ppp-wait-t"), R = I("div", "", "ppp-wait-track");
    return R.append(I("div", "", "ppp-wait-fill")), S.append(f, R), Le(S), S;
  };
  function Le(h) {
    const S = Number(h.dataset.since), f = Number(h.dataset.grace) || 6e4, R = Math.max(0, Date.now() - S), ut = h.querySelector(".ppp-wait-fill"), mt = h.querySelector(".ppp-wait-t");
    if (R < f) {
      const st = Math.ceil((f - R) / 1e3);
      ut.style.width = Math.max(4, Math.min(95, R / f * 100)).toFixed(0) + "%", mt.textContent = `Your plays are arriving… usually about a minute · ${st}s`, h.classList.remove("is-long"), h.setAttribute("aria-valuenow", String(Math.round(R / f * 100)));
    } else
      ut.style.width = "", mt.textContent = "Still arriving… this can take a few minutes. Nothing for you to do: it starts by itself.", h.classList.add("is-long"), h.removeAttribute("aria-valuenow");
  }
  let Dt = 0;
  setInterval(() => {
    const h = document.querySelectorAll(".ppp-wait");
    if (!h.length) {
      Dt = 0;
      return;
    }
    h.forEach(Le), ++Dt % 10 === 0 && ht(o.snapshot());
  }, 1e3);
  function ht(h) {
    var gr, Mr, yr, di, Nr, hi, pi, wr, gi, w, $, X, tt, pt, G;
    if (E && ["ready", "fund", "over"].includes(h.step) && !h.busy) {
      const P = E;
      E = null, h.root === P.root && h.slot !== P.slot && o.openAlbum(P.slot);
    }
    const S = a.inProgress(h), f = S && h.step === "fund" ? { ...h, depositPending: !0 } : h;
    if (M(), v(h), te(f), !S && a.inProgress(h) || (Ze(f), k(f), t.hidden = f.step === "off", t.hidden)) return;
    const [R, ut] = _e(f), mt = n(".ppp-state");
    mt.textContent = R, mt.className = "ppp-state" + (ut ? " ppp-state--" + ut : ""), mt.hidden = !R;
    const st = !!f.busy || f.armed, Wt = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (st || !["intro", "loading"].includes(f.step));
    r.hidden = !Wt, r.classList.toggle("ppp-frame--rest", !st && !it);
    const Ue = n(".ppp-frame-label");
    Ue.hidden = !0;
    const ye = p6(f) ?? A;
    A = ye;
    const hn = "xtrata.radio.ppp.heard.v1", he = (() => {
      try {
        return localStorage.getItem(hn) === "1";
      } catch {
        return !1;
      }
    })();
    if (!he && f.entries.some((P) => P.kind === "play"))
      try {
        localStorage.setItem(hn, "1");
      } catch {
      }
    const Nn = he || f.slot > 0 && ((((gr = f.likeFunds) == null ? void 0 : gr.balance) ?? 0n) > 0n || c.count() > 1), Fe = y6({ ...f, heard: Nn }, ye);
    n(".ppp-badge").hidden = !Fe;
    const Pn = n(".ppp-steps"), pn = n(".ppp-stage");
    Pn.hidden = pn.hidden = !Fe, ye && Fe && (Pn.replaceChildren(...xu(f.solo).map((P, j) => {
      const ct = I("li", "", j < ye.at ? "done" : j === ye.at ? ye.blocked ? "now blocked" : "now" : "");
      return ct.append(I("span", j < ye.at ? "✓" : String(j + 1), "n"), P), j === ye.at && ct.setAttribute("aria-current", "step"), ct;
    })), pn.textContent = ye.caption, pn.className = "ppp-stage " + (ye.at >= xu(f.solo).length ? "ppp-ok" : ye.blocked ? "ppp-bad" : "ppp-cyan"));
    const gs = n(".ppp-facts"), Ce = [];
    f.main && ((Mr = f.gate) != null && Mr.here) && !f.solo && Ce.push(...ie("Your wallet", lt(f.main), "ppp-addr-short"));
    const li = () => {
      if (!f.listening) return;
      const P = Li("copy-listening", "Copy", () => f.listening || "", "tiny", () => ht(o.snapshot()));
      Ce.push(...ie(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", N(f.listening), "ppp-addr-short", P));
    };
    if (f.linked || li(), f.listening && f.step !== "intro")
      if (f.linked)
        Ce.push(...ie("Credited to", `${lt(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), li();
      else if (f.solo) {
        f.creditedTo && Ce.push(...ie("Credited to", `${lt(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const P = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${lt(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Ce.push(...ie("Returns go to", f.gift ? P : f.returnTo && !at(f.returnTo) ? P.replace(N(f.returnTo), f.returnTo) : P, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Ce.push(...ie("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((yr = f.gate) != null && yr.here)) {
      const P = f.linkedListening.map((j) => N(j) + (j === f.listening ? " (this one)" : "")).join(", ");
      Ce.push(...ie(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", P, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const P = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Ce.push(...ie("Balance", `${tr(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, P));
    }
    const hr = f.entries.find((P) => P.kind === "play");
    hr && ce(), hr && Ce.push(...ie("Last paid song", `${De(hr)} → ${lt(hr.recipient)}`, Ye[hr.status] || "")), gs.replaceChildren(...Ce), gs.hidden = !Ce.length;
    const At = [], Pt = [], we = [], He = [], ui = xn(BigInt(((di = f.gate) == null ? void 0 : di.limits.playFee) ?? "300")), ys = `Each song you listen to for 30 seconds sends ${tr(nc)} STX to whoever holds it, plus a ${tr(ui - nc)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, Tr = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (At.push(I("p", "Pay artists as you listen.")), (Nr = f.gate) != null && Nr.radioUrl) {
          const j = I("p");
          j.append(gt("Open the pay-per-play radio →", f.gate.radioUrl)), At.push(j);
        }
        Pt.push(I("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const j = [f.linked, ...f.others];
          At.push(I("p", j.length > 1 ? `This device has listening wallets for ${zt(j)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${lt(f.linked)}. Connect that wallet to keep paying artists.`)), Pt.push(I("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          At.push(I("p", "Connect your wallet to pay artists as you listen.")), Pt.push(I("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        At.push(I("p", `This device's listening wallet belongs to ${lt(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Pt.push(I("p", `You are connected as ${lt(f.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), Pt.push(I("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), we.push(F("Switch wallet", () => {
          var j;
          return (j = document.getElementById("radio-wallet-connect")) == null ? void 0 : j.click();
        }, "primary"));
        break;
      case "not-invited":
        At.push(I("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        At.push(I("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        At.push(I("p", "Every play counts for the song’s owner, on-chain.")), Pt.push(I("p", ys)), Pt.push(I("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), Pt.push(I("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (At.push(I("p", `This device already has a listening wallet for ${zt(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Pt.push(I("p", `Otherwise, set up a new listening wallet for ${lt(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && Pt.push(I("p", `This is the listening wallet for ${lt(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && Pt.push(I("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const P = a.liveGift();
        we.push(F(P ? "Claim my gift · no wallet needed" : f.solo ? "Start listening · no wallet needed" : f.others.length && f.main ? `Set up for ${lt(f.main)}` : "Start listening", () => void o.create(), "primary")), !P && !f.solo && f.main && f.others.length && we.push(F("Switch wallet", () => {
          var j;
          return (j = document.getElementById("radio-wallet-connect")) == null ? void 0 : j.click();
        })), !P && f.solo && we.push(F("I have a Stacks wallet", () => {
          var j;
          return (j = document.getElementById("radio-wallet-connect")) == null ? void 0 : j.click();
        })), we.push(F("I already have a listening wallet", () => void o.unlock(!0))), P && we.push(F("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (At.push(I("p", "Locked.", "ppp-mute")), we.push(F("Unlock", () => void o.unlock(), "primary"))), He.push(F("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        At.push(I("p", `Link to ${lt(f.main)} · free`)), Pt.push(I("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Pt.push(I("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), we.push(F(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        At.push(I("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && At.push(Ae(f.arrival)) : (hi = f.gift) != null && hi.player ? At.push(I("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? At.push(I("p", "No plays left · add plays to keep counting", "ppp-bad")) : At.push(I("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / ui)).toLocaleString()} plays`)), (pi = f.gift) != null && pi.player ? Pt.push(I("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : f.entries.length && Pt.push(I("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), f.payingOn && !f.entries.length && Pt.push(I("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), S ? Pt.push(I("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : f.depositPending ? Pt.push(I("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : f.solo ? (Pt.push(I("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Pt.push(I("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && we.push(Li("copy-address", "Copy my address", () => f.listening || "", "primary", () => ht(o.snapshot())))) : Pt.push(I("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), f.depositPending && f.depositTxid) {
          const j = I("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          j.append(gt("View", L(f.depositTxid))), At.push(j);
        } else f.allowance > 0n && !f.solo && !f.depositPending && we.push(F(`Deposit ${tr(f.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        At.push(I("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.solo && !f.returnTo && (At.push(I("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), At.push(H(f))), (!f.solo || f.returnTo) && we.push(F("Return excess", () => void o.returnFunds("excess"), "primary"), F("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0) {
          const j = Math.min(f.session.playsLeft, f.playsLeft);
          At.push(I("p", `${j.toLocaleString()} plays left`, "ppp-ok")), Pt.push(I("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), we.push(F("Switch off", () => void o.switchOff()));
        } else
          At.push(I("p", "Plays are off. Music stays free.", "ppp-mute")), we.push(F("Switch plays on", () => void o.switchOn(), "primary"));
        f.queued && At.push(I("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && At.push(I("p", "Running low on plays", "ppp-warn")), f.depositPending ? At.push(I("p", "Plays on their way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && we.push(F(`Top up ${tr(f.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (f.solo && f.walletCannotSolo && Pt.push(I("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && Pt.push(H(f)), Pt.push(yt()), f.slot === 0 && f.step === "ready" && f.entries.some((P) => P.kind === "play" && P.status === "confirmed"))) {
      const P = I("p", "New to Stacks? ", "ppp-mute");
      P.append(gt("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), At.push(P);
    }
    if (f.walletOutdated && Pt.push(I("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (At.push(I("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), we.push(F("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && He.push(F(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${lt(f.returnTo)}`, () => void o.returnFunds("all"), "quiet")), f.slot > 0 && ((wr = f.gift) != null && wr.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && He.push(qt(f, "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && He.push(F("Lock", () => void o.lock(), "quiet")), Wt && !st && He.push(F(it ? "Hide listening wallet box" : "Show listening wallet box", () => {
      it = !it, ht(o.snapshot());
    }, "quiet")), [...we, ...He].forEach((P) => P.disabled = Tr), Tr && (we.length = 0), f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((gi = f.gift) != null && gi.player)) {
      const P = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", j = At.at(0);
      f.step === "ready" && j ? j.append(I("span", ` · ${C(f.balance)} STX`, P)) : At.push(I("p", `Balance ${C(f.balance)} STX`, P));
    }
    if ((w = f.gift) != null && w.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const P = I("p", "", "ppp-gift");
      P.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && P.append(" · ", f.gift.player.subtitle);
      const j = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? I("span", " · plays on their way", "ppp-warn") : I("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      j && P.append(j);
      const ct = ($ = At.at(0)) == null ? void 0 : $.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && ct && /STX/.test(ct.textContent ?? "") && ct.remove(), At.unshift(P), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          At.splice(1, 0, I("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), qt(f, "primary"));
        else {
          const Et = I("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          Et.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), Et.append(gt("Xverse", "https://www.xverse.app/download"), " and ", gt("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), At.splice(1, 0, Et);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const P = f.returnPlan, j = I("div", "", "ppp-pick");
      j.append(I("p", P.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const ct = I("ul", "", "ppp-gift-list");
      P.steps.forEach((Et, ve) => {
        const Be = Et.kind === "gift" ? "the unused gift" : Et.kind === "deposit" ? "what was added to it" : "the rest", Ft = I("li");
        Ft.append(I("span", `${ve + 1}. ${tr(BigInt(Et.send))} STX · ${Be}`, "t"), I("span", Et.to ? ` → ${lt(Et.to)}` : " → choose an address below", Et.to ? "ppp-mute" : "ppp-warn")), ct.append(Ft);
      }), j.append(ct), P.kept && j.append(I("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), P.steps.some((Et) => !Et.to) && j.append(H(f)), j.append(F(P.steps.length > 1 ? `Confirm part 1 of ${P.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), At.push(j);
    }
    const _n = Kt(f), qn = u ? _n : null, ws = a.banner(h, { bare: !!qn }), pr = $t && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) ? ae($t, a.pendingCode()) : [];
    qn || (At.unshift(...ws), At.unshift(...Yt(f)), At.unshift(...pr)), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && At.unshift(I("p", `This is ${lt(f.creditedTo)}'s listening wallet. Plays and likes count for ${lt(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...At);
    const Un = document.querySelector(".ppp-switch");
    if (Un) {
      const P = c.latest(), j = f.slot > 0, ct = ["fund", "ready", "over"].includes(f.step) && (j || !!P);
      if (Un.hidden = !ct, ct) {
        const Et = (Ft, gn, xs, _c) => {
          const Pr = F("", _c, "ppp-tab");
          return Pr.setAttribute("aria-pressed", String(xs)), Pr.append(I("span", Ft, "tt"), I("span", gn === void 0 ? "…" : `${b(gn).toLocaleString()} plays`, "ts")), Pr.disabled = !!f.busy, Pr;
        }, ve = j ? ((tt = (X = f.gift) == null ? void 0 : X.player) == null ? void 0 : tt.title) ?? "Album" : P.title, Be = F("View all albums" + (c.count() > 1 ? ` (${c.count()})` : ""), () => {
          const Ft = document.querySelector(".ppp-shelf");
          Ft && (Ft.hidden = !1, Ft.open = !Ft.open, Be.setAttribute("aria-expanded", String(Ft.open)), Ft.open && requestAnimationFrame(() => Ft.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        Be.setAttribute("aria-expanded", String(!!((pt = document.querySelector(".ppp-shelf")) != null && pt.open))), Un.replaceChildren(
          Et("🎧 My player", j ? (G = f.likeFunds) == null ? void 0 : G.balance : f.balance, !j, () => {
            j && o.openAlbum(0);
          }),
          Et("💿 " + ve, j ? f.balance : void 0, j, () => {
            !j && P && o.openAlbum(P.slot);
          }),
          Be
        );
      }
    }
    const Wn = c.render(f), Hn = document.querySelector(".ppp-shelf");
    if (Hn) {
      Hn.hidden = !Wn;
      const P = Hn.querySelector("summary");
      P && (P.textContent = c.count() > 0 ? `♪ My albums (${c.count()})` : "♪ My albums");
      const j = Hn.querySelector(".ppp-shelf-body");
      Wn && j && !j.contains(Wn) && j.replaceChildren(Wn);
    }
    const On = a.renderFold(h);
    if (n(".ppp-gifts").hidden = !On, On && !n(".ppp-gift-body").contains(On) && n(".ppp-gift-body").replaceChildren(On), On && U) {
      U = !1;
      const P = n(".ppp-gifts");
      P.open = !0, requestAnimationFrame(() => P.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...Pt), n(".ppp-actions").replaceChildren(...we), n(".ppp-actions2").replaceChildren(...He);
    const bs = f.busy || f.message || "", fi = n(".ppp-msg"), ms = bs && At.some((P) => (P.textContent ?? "").startsWith(bs.replace(/[.✓\s]+$/, ""))) ? "" : bs, be = !ms && !f.error ? f.notice : "";
    fi.textContent = ms || be, fi.classList.toggle("is-warn", !!be), n(".ppp-err").textContent = f.error;
    const ro = f.entries.filter((P) => P.kind === "play");
    n(".ppp-recent").hidden = !f.entries.length, n(".ppp-recent-list").replaceChildren(...ro.slice(0, 5).map((P) => {
      const j = I("li"), ct = P.status === "confirmed" ? "ok" : P.status === "failed" ? "bad" : "warn";
      return j.append(I("span", "", "d " + ct), I("span", De(P), "t"), I("span", D(P.created), "ppp-mute")), P.txid && j.append(gt("tx", L(P.txid))), j;
    })), n(".ppp-wallets").hidden = !(gs.childElementCount || He.length), n(".ppp-more").hidden = !Pt.length;
    const Br = n(".ppp-history");
    Br.hidden = !f.entries.length, f.entries.length && ce(), Br.replaceChildren(I("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((P) => {
      const j = I("div", "", "ppp-row"), ct = P.kind === "play" ? [I("span", De(P), "ppp-song"), I("span", ` · ${tr(BigInt(P.amount))} STX to ${lt(P.recipient)}`, "ppp-mute")] : P.kind === "like" ? [I("span", `${P.liked ? "♥ Liked" : "Unliked"} ${De(P)}`, "ppp-song"), I("span", ` · for ${f.linked ? lt(f.linked) : "this listening wallet"}`, "ppp-mute")] : [I("span", `Returned ${tr(BigInt(P.amount))} STX`, "ppp-song"), I("span", ` to ${lt(P.recipient)}`, "ppp-mute")];
      return j.append(
        I("span", Pe[P.status] || P.status, "ppp-status " + (Ye[P.status] || "")),
        ...ct,
        I("span", ` · ${new Date(P.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), P.txid && j.append(gt("tx ↗", L(P.txid))), j;
    })), y == null || y.render(qn ? Zt(f, qn, [...pr, ...ws]) : null), m == null || m.render((_n == null ? void 0 : _n.mode) === "open" ? Zt(f, _n, []) : null);
  }
  function Kt(h) {
    var R;
    if (["off", "elsewhere", "not-invited"].includes(h.step)) return null;
    if (h.slot > 0 && ((R = h.gift) != null && R.player) && ["fund", "ready", "over", "link", "loading"].includes(h.step))
      return h.root && V({ root: h.root, slot: h.slot, player: h.gift.player }), { mode: "open", player: h.gift.player };
    const S = a.incomingAlbum();
    if (S) return { mode: "arrive", player: S.player, from: S.from, offered: S.plays };
    const f = T();
    return f && (h.step === "locked" || E && h.step === "loading") ? { mode: "locked", player: f.player } : null;
  }
  function Zt(h, S, f) {
    var Ue, ye, hn;
    const R = !!h.busy || h.armed, ut = [...f];
    h.depositPending && h.arrival && ut.push(Ae(h.arrival)), h.error ? ut.push(I("p", h.error, "ppp-bad")) : h.message && !R ? ut.push(I("p", h.message, "ppp-cyan")) : h.notice && ut.push(I("p", h.notice, "ppp-warn")), S.mode === "open" && ((Ue = h.likeFunds) != null && Ue.album) && h.likeFunds.low && !h.likeFunds.pending && ut.push(I("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    const mt = "Kept on this device with Face ID or your passkey. No app or account needed.";
    let st = null, Wt = null;
    return S.mode === "locked" ? (st = { label: "Continue listening", run: () => {
      E = T(), o.unlock();
    } }, Wt = { label: "Use a different passkey", run: () => {
      E = null, o.unlock(!0);
    } }) : S.mode === "arrive" && (h.step === "intro" ? (st = { label: "Open album", run: () => void o.create() }, Wt = { label: "I've used Xtrata Music here before", run: () => void o.unlock(!0) }) : h.step === "locked" ? (st = { label: "Open album", run: () => void o.unlock() }, Wt = { label: "Use a different passkey", run: () => void o.unlock(!0) }) : h.step === "unsupported" ? ut.push(I("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : ut.length || ut.push(I("p", "Opening your album…", "ppp-cyan"))), {
      mode: S.mode,
      player: S.player,
      from: S.from,
      offered: S.offered,
      plays: S.mode === "open" ? h.balance === void 0 ? null : h.giftPlays : void 0,
      playsComing: h.depositPending,
      status: ut,
      primary: st,
      secondary: Wt,
      hint: st ? mt : void 0,
      asking: R,
      busy: !!h.busy,
      myPlays: ee(h),
      topUps: Ta,
      canMake: !!((hn = (ye = h.gate) == null ? void 0 : ye.gifts) != null && hn.admin)
    };
  }
  const de = /* @__PURE__ */ new Map(), oe = () => {
    const h = window.XtrataRadio;
    return h != null && h.subscribe ? (h.subscribe((S) => {
      const f = S == null ? void 0 : S.nowPlaying;
      f && Number.isSafeInteger(Number(f.tokenId)) && de.set(Number(f.tokenId), { title: f.title || void 0, artist: f.artist || void 0 });
    }), !0) : !1;
  };
  if (!oe()) {
    const h = setInterval(() => {
      oe() && clearInterval(h);
    }, 500);
    setTimeout(() => clearInterval(h), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (h) => {
    const S = h.detail;
    if (S && Number.isSafeInteger(S.song) && typeof S.id == "string" && /^[0-9a-f]{32}$/.test(S.id)) {
      ce();
      const f = sn(S.song, de.get(S.song));
      o.onListened({ song: S.song, id: S.id, title: f.title || void 0, artist: f.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const U$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", H$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", i = e.userAgent.includes("Edge"), s = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return s ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && i === !1 && o === !1;
}, O$ = () => H$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, D$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, F$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', cw = class {
  constructor(t) {
    c4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && Lx(t), this.callback(mc(t));
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
    var r, i, s, o, a, c, u, d, l, y;
    return n === "IOS" ? (i = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && i !== void 0 ? i : t.webUrl : e === "Chrome" ? (o = (s = t.chromeWebStoreUrl) !== null && s !== void 0 ? s : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (d = (u = t.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(t)) !== null && d !== void 0 ? d : t.webUrl : (y = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && y !== void 0 ? y : this.getMobileUrl(t);
  }
  render() {
    const t = O$(), e = D$(), n = this.defaultProviders.filter(
      (s) => this.installedProviders.findIndex((o) => o.id === s.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, i = n.length > 0;
    return vt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, vt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), vt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, vt("div", { class: "flex flex-col space-y-[10px]" }, vt("div", { class: "flex items-center" }, vt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), vt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, vt("span", { class: "sr-only" }, "Close popup"), vt("img", { src: U$ }))), r ? vt("p", null, "Select the wallet you want to connect to.") : vt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && vt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && vt("div", { class: "mt-6" }, vt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), vt("ul", { class: "space-y-3" }, this.installedProviders.map((s) => vt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, vt("div", { class: "aspect-square basis-9 overflow-hidden" }, vt("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), vt("div", { class: "flex-1" }, vt("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && vt("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), vt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(s.id) }, "Connect"))))), i && vt("div", { class: "mt-6" }, r ? vt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : vt("div", { class: "mb-5 flex justify-between" }, vt("p", { class: "text-sm font-medium" }, "Recommended wallets"), vt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, vt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, vt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), vt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), vt("p", null, "What is a wallet? ", vt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), vt("ul", { class: "space-y-3" }, n.map((s) => vt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, vt("div", { class: "aspect-square basis-9 overflow-hidden" }, vt("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), vt("div", { class: "flex-1" }, vt("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && vt("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), this.getInstallUrl(s, t, e) && vt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(s, t, e), rel: "noopener noreferrer", target: "_blank" }, s.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return RA(this);
  }
};
cw.style = F$;
const j$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: cw
}, Symbol.toStringTag, { value: "Module" }));
