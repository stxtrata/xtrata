var _w = Object.defineProperty;
var Uw = (t, e, n) => e in t ? _w(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Eo = (t, e, n) => Uw(t, typeof e != "symbol" ? e + "" : e, n);
var wn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function K0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Tc(t) {
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
      typeof wn < "u" && wn || {}, r = {
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
      function s(I) {
        return I && DataView.prototype.isPrototypeOf(I);
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
        ], o = ArrayBuffer.isView || function(I) {
          return I && i.indexOf(Object.prototype.toString.call(I)) > -1;
        };
      function a(I) {
        if (typeof I != "string" && (I = String(I)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(I) || I === "")
          throw new TypeError('Invalid character in header field name: "' + I + '"');
        return I.toLowerCase();
      }
      function c(I) {
        return typeof I != "string" && (I = String(I)), I;
      }
      function u(I) {
        var P = {
          next: function() {
            var b = I.shift();
            return { done: b === void 0, value: b };
          }
        };
        return r.iterable && (P[Symbol.iterator] = function() {
          return P;
        }), P;
      }
      function d(I) {
        this.map = {}, I instanceof d ? I.forEach(function(P, b) {
          this.append(b, P);
        }, this) : Array.isArray(I) ? I.forEach(function(P) {
          if (P.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + P.length);
          this.append(P[0], P[1]);
        }, this) : I && Object.getOwnPropertyNames(I).forEach(function(P) {
          this.append(P, I[P]);
        }, this);
      }
      d.prototype.append = function(I, P) {
        I = a(I), P = c(P);
        var b = this.map[I];
        this.map[I] = b ? b + ", " + P : P;
      }, d.prototype.delete = function(I) {
        delete this.map[a(I)];
      }, d.prototype.get = function(I) {
        return I = a(I), this.has(I) ? this.map[I] : null;
      }, d.prototype.has = function(I) {
        return this.map.hasOwnProperty(a(I));
      }, d.prototype.set = function(I, P) {
        this.map[a(I)] = c(P);
      }, d.prototype.forEach = function(I, P) {
        for (var b in this.map)
          this.map.hasOwnProperty(b) && I.call(P, this.map[b], b, this);
      }, d.prototype.keys = function() {
        var I = [];
        return this.forEach(function(P, b) {
          I.push(b);
        }), u(I);
      }, d.prototype.values = function() {
        var I = [];
        return this.forEach(function(P) {
          I.push(P);
        }), u(I);
      }, d.prototype.entries = function() {
        var I = [];
        return this.forEach(function(P, b) {
          I.push([b, P]);
        }), u(I);
      }, r.iterable && (d.prototype[Symbol.iterator] = d.prototype.entries);
      function l(I) {
        if (!I._noBody) {
          if (I.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          I.bodyUsed = !0;
        }
      }
      function w(I) {
        return new Promise(function(P, b) {
          I.onload = function() {
            P(I.result);
          }, I.onerror = function() {
            b(I.error);
          };
        });
      }
      function p(I) {
        var P = new FileReader(), b = w(P);
        return P.readAsArrayBuffer(I), b;
      }
      function x(I) {
        var P = new FileReader(), b = w(P), L = /charset=([A-Za-z0-9_-]+)/.exec(I.type), D = L ? L[1] : "utf-8";
        return P.readAsText(I, D), b;
      }
      function S(I) {
        for (var P = new Uint8Array(I), b = new Array(P.length), L = 0; L < P.length; L++)
          b[L] = String.fromCharCode(P[L]);
        return b.join("");
      }
      function B(I) {
        if (I.slice)
          return I.slice(0);
        var P = new Uint8Array(I.byteLength);
        return P.set(new Uint8Array(I)), P.buffer;
      }
      function G() {
        return this.bodyUsed = !1, this._initBody = function(I) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = I, I ? typeof I == "string" ? this._bodyText = I : r.blob && Blob.prototype.isPrototypeOf(I) ? this._bodyBlob = I : r.formData && FormData.prototype.isPrototypeOf(I) ? this._bodyFormData = I : r.searchParams && URLSearchParams.prototype.isPrototypeOf(I) ? this._bodyText = I.toString() : r.arrayBuffer && r.blob && s(I) ? (this._bodyArrayBuffer = B(I.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(I) || o(I)) ? this._bodyArrayBuffer = B(I) : this._bodyText = I = Object.prototype.toString.call(I) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof I == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(I) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var I = l(this);
          if (I)
            return I;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var I = l(this);
            return I || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var I = l(this);
          if (I)
            return I;
          if (this._bodyBlob)
            return x(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(S(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(M);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var j = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function v(I) {
        var P = I.toUpperCase();
        return j.indexOf(P) > -1 ? P : I;
      }
      function U(I, P) {
        if (!(this instanceof U))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        P = P || {};
        var b = P.body;
        if (I instanceof U) {
          if (I.bodyUsed)
            throw new TypeError("Already read");
          this.url = I.url, this.credentials = I.credentials, P.headers || (this.headers = new d(I.headers)), this.method = I.method, this.mode = I.mode, this.signal = I.signal, !b && I._bodyInit != null && (b = I._bodyInit, I.bodyUsed = !0);
        } else
          this.url = String(I);
        if (this.credentials = P.credentials || this.credentials || "same-origin", (P.headers || !this.headers) && (this.headers = new d(P.headers)), this.method = v(P.method || this.method || "GET"), this.mode = P.mode || this.mode || null, this.signal = P.signal || this.signal || function() {
          if ("AbortController" in n) {
            var C = new AbortController();
            return C.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && b)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(b), (this.method === "GET" || this.method === "HEAD") && (P.cache === "no-store" || P.cache === "no-cache")) {
          var L = /([?&])_=[^&]*/;
          if (L.test(this.url))
            this.url = this.url.replace(L, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var D = /\?/;
            this.url += (D.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      U.prototype.clone = function() {
        return new U(this, { body: this._bodyInit });
      };
      function M(I) {
        var P = new FormData();
        return I.trim().split("&").forEach(function(b) {
          if (b) {
            var L = b.split("="), D = L.shift().replace(/\+/g, " "), C = L.join("=").replace(/\+/g, " ");
            P.append(decodeURIComponent(D), decodeURIComponent(C));
          }
        }), P;
      }
      function Q(I) {
        var P = new d(), b = I.replace(/\r?\n[\t ]+/g, " ");
        return b.split("\r").map(function(L) {
          return L.indexOf(`
`) === 0 ? L.substr(1, L.length) : L;
        }).forEach(function(L) {
          var D = L.split(":"), C = D.shift().trim();
          if (C) {
            var rt = D.join(":").trim();
            try {
              P.append(C, rt);
            } catch (Y) {
              console.warn("Response " + Y.message);
            }
          }
        }), P;
      }
      G.call(U.prototype);
      function tt(I, P) {
        if (!(this instanceof tt))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (P || (P = {}), this.type = "default", this.status = P.status === void 0 ? 200 : P.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = P.statusText === void 0 ? "" : "" + P.statusText, this.headers = new d(P.headers), this.url = P.url || "", this._initBody(I);
      }
      G.call(tt.prototype), tt.prototype.clone = function() {
        return new tt(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, tt.error = function() {
        var I = new tt(null, { status: 200, statusText: "" });
        return I.ok = !1, I.status = 0, I.type = "error", I;
      };
      var K = [301, 302, 303, 307, 308];
      tt.redirect = function(I, P) {
        if (K.indexOf(P) === -1)
          throw new RangeError("Invalid status code");
        return new tt(null, { status: P, headers: { location: I } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(P, b) {
          this.message = P, this.name = b;
          var L = Error(P);
          this.stack = L.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function q(I, P) {
        return new Promise(function(b, L) {
          var D = new U(I, P);
          if (D.signal && D.signal.aborted)
            return L(new e.DOMException("Aborted", "AbortError"));
          var C = new XMLHttpRequest();
          function rt() {
            C.abort();
          }
          C.onload = function() {
            var E = {
              statusText: C.statusText,
              headers: Q(C.getAllResponseHeaders() || "")
            };
            D.url.indexOf("file://") === 0 && (C.status < 200 || C.status > 599) ? E.status = 200 : E.status = C.status, E.url = "responseURL" in C ? C.responseURL : E.headers.get("X-Request-URL");
            var H = "response" in C ? C.response : C.responseText;
            setTimeout(function() {
              b(new tt(H, E));
            }, 0);
          }, C.onerror = function() {
            setTimeout(function() {
              L(new TypeError("Network request failed"));
            }, 0);
          }, C.ontimeout = function() {
            setTimeout(function() {
              L(new TypeError("Network request timed out"));
            }, 0);
          }, C.onabort = function() {
            setTimeout(function() {
              L(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function Y(E) {
            try {
              return E === "" && n.location.href ? n.location.href : E;
            } catch {
              return E;
            }
          }
          if (C.open(D.method, Y(D.url), !0), D.credentials === "include" ? C.withCredentials = !0 : D.credentials === "omit" && (C.withCredentials = !1), "responseType" in C && (r.blob ? C.responseType = "blob" : r.arrayBuffer && (C.responseType = "arraybuffer")), P && typeof P.headers == "object" && !(P.headers instanceof d || n.Headers && P.headers instanceof n.Headers)) {
            var kt = [];
            Object.getOwnPropertyNames(P.headers).forEach(function(E) {
              kt.push(a(E)), C.setRequestHeader(E, c(P.headers[E]));
            }), D.headers.forEach(function(E, H) {
              kt.indexOf(H) === -1 && C.setRequestHeader(H, E);
            });
          } else
            D.headers.forEach(function(E, H) {
              C.setRequestHeader(H, E);
            });
          D.signal && (D.signal.addEventListener("abort", rt), C.onreadystatechange = function() {
            C.readyState === 4 && D.signal.removeEventListener("abort", rt);
          }), C.send(typeof D._bodyInit > "u" ? null : D._bodyInit);
        });
      }
      return q.polyfill = !0, n.fetch || (n.fetch = q, n.Headers = d, n.Request = U, n.Response = tt), e.Headers = d, e.Request = U, e.Response = tt, e.fetch = q, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : wn);
})();
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
var zi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(zi || (zi = {}));
var Vs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Vs || (Vs = {}));
var ld;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(ld || (ld = {}));
const jw = "https://api.mainnet.hiro.so", Rw = "https://api.testnet.hiro.so", zw = "http://localhost:3999", Gw = ["mainnet", "testnet", "devnet", "mocknet"];
let Gi = class {
  constructor(e) {
    this.version = Vs.Mainnet, this.chainId = zi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Vs.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Fw();
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
Gi.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new jl();
    case "testnet":
      return new Kw();
    case "devnet":
      return new Vw();
    case "mocknet":
      return new V0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Gw.join(", ")}`);
  }
};
Gi.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Gi.fromName(t);
let jl = class extends Gi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? jw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Vs.Mainnet, this.chainId = zi.Mainnet;
  }
}, Kw = class extends Gi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Rw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Vs.Testnet, this.chainId = zi.Testnet;
  }
}, V0 = class extends Gi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? zw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Vs.Testnet, this.chainId = zi.Testnet;
  }
};
const Vw = V0, q0 = "xtrata.wallet.bridge.v1", qw = (t) => typeof t == "object" && t !== null && t.protocol === q0, Ww = (t) => qw(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", Yw = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class Ao extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const ud = 12e4;
class Xw {
  constructor(e) {
    Eo(this, "pending", /* @__PURE__ */ new Map());
    Eo(this, "listenTarget");
    Eo(this, "closed", !1);
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
    Eo(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !Ww(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new Ao("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new Ao("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Ao("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = Yw(), i = { protocol: q0, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new Ao(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? ud}ms.`
          )
        );
      }, this.options.timeoutMs ?? ud);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new Ao("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const Zw = ["SP", "SM"], Qw = ["ST", "SN"], Jw = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return Zw.includes(n) ? "mainnet" : Qw.includes(n) ? "testnet" : null;
}, tb = () => {
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
}, eb = () => typeof window > "u" || !window.localStorage ? tb() : window.localStorage, al = "xtrata.v15.1.wallet.session", fd = "mainnet", Ja = { isConnected: !1 }, nb = (t) => t.address ? Jw(t.address) ?? t.network : t.network, W0 = (t) => !t.isConnected || !t.address ? { ...Ja } : nb(t) !== fd ? { ...Ja } : {
  isConnected: !0,
  address: t.address,
  network: fd,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, rb = (t) => {
  if (!t)
    return { ...Ja };
  try {
    const e = JSON.parse(t);
    return W0(e);
  } catch {
    return { ...Ja };
  }
}, sb = (t) => {
  const e = W0(t);
  return JSON.stringify(e);
}, ib = (t) => {
  const e = eb();
  return {
    load: () => rb(e.getItem(al)),
    save: (n) => {
      e.setItem(al, sb(n));
    },
    clear: () => {
      e.removeItem(al);
    }
  };
}, ob = "https://browser.blockstack.org/auth", ab = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Y0 = ["store_write"], cb = "blockstack-session", lb = {
  logLevel: "debug"
}, li = {
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
Object.freeze(li);
class ao extends Error {
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
class ub extends ao {
  constructor(e, n = "") {
    super({ code: li.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class dd extends ao {
  constructor(e = "") {
    super({ code: li.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class ua extends ao {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: li.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class hd extends ao {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: li.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Rl extends ao {
  constructor(e) {
    super({ code: li.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class X0 extends ao {
  constructor(e) {
    super({ code: li.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const pd = ["debug", "info", "warn", "error", "none"], zl = {};
for (let t = 0; t < pd.length; t++) {
  const e = pd[t];
  zl[e] = t;
}
class _i {
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
    return zl[lb.logLevel] <= zl[e];
  }
}
function fb() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function db() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function cl(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function hb() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function pb() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function gb(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function Xu(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = pb(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    _i.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = gb(s, t.toString(), n);
    throw _i.error(i), new Error(i);
  }
  if (r)
    return {};
}
function vs(t, e) {
  return Zu(cn(t), e);
}
function cn(t) {
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
  if (kn(t, Uint8Array))
    return BigInt(`0x${wt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function yb(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function gd(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Xo(t, e = 8) {
  return (typeof t == "bigint" ? t : cn(t)).toString(16).padStart(e * 2, "0");
}
function Bc(t) {
  return parseInt(t, 16);
}
function Zu(t, e = 16) {
  const n = Xo(t, e);
  return Wt(n);
}
function wb(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function bb(t, e) {
  return t & BigInt(1) << e;
}
function Gl(t) {
  return mb(BigInt(`0x${wt(t)}`), BigInt(t.byteLength * 8));
}
function mb(t, e) {
  return bb(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const xb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function wt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += xb[n];
  return e;
}
function Wt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = yb(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function ui(t) {
  return new TextEncoder().encode(t);
}
function Zo(t) {
  return new TextDecoder().decode(t);
}
function Sb(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Eb(t) {
  return String.fromCharCode.apply(null, t);
}
function Ab(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function yd(t) {
  if (t.some(Ab))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Ar(...t) {
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
function Ne(t) {
  return Ar(...t.map((e) => typeof e == "number" ? yd([e]) : e instanceof Array ? yd(e) : e));
}
function kn(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Z0 = "https://api.mainnet.hiro.so", Q0 = "https://api.testnet.hiro.so", J0 = "http://localhost:3999", vb = "https://hub.blockstack.org", kb = 33, ll = 32;
function $b(t) {
  if (t.length < ll * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + ll * 2), r = t.slice(2 + ll * 2);
  return {
    recoveryId: Bc(e),
    r: n,
    s: r
  };
}
function Qu(t) {
  const e = typeof t == "string" ? Wt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Ib(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Lb(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Cb(t, e) {
  return t[e];
}
function Tb(t, e, n = 0) {
  return t[n] = e, t;
}
function Bb(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function qs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const Mb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Nb(t, e) {
  const n = {};
  return Object.assign(n, Mb, e), await fetch(t, n);
}
function Pb(t) {
  let e = Nb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function _b(...t) {
  const { fetchLib: e, middlewares: n } = Pb(t);
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
class tp {
  constructor(e = Y0.slice(), n = ((a) => (a = Xu("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = ob) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Kl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Ub(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function ep(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Hb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Kl(t.outputLen), Kl(t.blockLen);
}
function Ob(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Db(t, e) {
  ep(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const _s = {
  number: Kl,
  bool: Ub,
  bytes: ep,
  hash: Hb,
  exists: Ob,
  output: Db
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ul = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), ur = (t, e) => t << 32 - e | t >>> e, Fb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Fb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function jb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ju(t) {
  if (typeof t == "string" && (t = jb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let np = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function fi(t) {
  const e = (r) => t().update(Ju(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let rp = class extends np {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, _s.hash(e);
    const r = Ju(n);
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
    return _s.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    _s.exists(this), _s.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Mc = (t, e, n) => new rp(t, e).update(n).digest();
Mc.create = (t, e) => new rp(t, e);
function Rb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let tf = class extends np {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ul(this.buffer);
  }
  update(e) {
    _s.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ju(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ul(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    _s.exists(this), _s.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Rb(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ul(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
const zb = (t, e, n) => t & e ^ ~t & n, Gb = (t, e, n) => t & e ^ t & n ^ e & n, Kb = new Uint32Array([
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
]), qr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Wr = new Uint32Array(64);
let sp = class extends tf {
  constructor() {
    super(64, 32, 8, !1), this.A = qr[0] | 0, this.B = qr[1] | 0, this.C = qr[2] | 0, this.D = qr[3] | 0, this.E = qr[4] | 0, this.F = qr[5] | 0, this.G = qr[6] | 0, this.H = qr[7] | 0;
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
      const w = Wr[l - 15], p = Wr[l - 2], x = ur(w, 7) ^ ur(w, 18) ^ w >>> 3, S = ur(p, 17) ^ ur(p, 19) ^ p >>> 10;
      Wr[l] = S + Wr[l - 7] + x + Wr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const w = ur(a, 6) ^ ur(a, 11) ^ ur(a, 25), p = d + w + zb(a, c, u) + Kb[l] + Wr[l] | 0, S = (ur(r, 2) ^ ur(r, 13) ^ ur(r, 22)) + Gb(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Wr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Vb = class extends sp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Ki = fi(() => new sp());
fi(() => new Vb());
const qb = {}, ip = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: qb
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Kt = BigInt(0), me = BigInt(1), ms = BigInt(2), Mo = BigInt(3), wd = BigInt(8), ie = Object.freeze({
  a: Kt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: me,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), bd = (t, e) => (t + e / ms) / e, fa = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = ie, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -me * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = bd(i * t, e), c = bd(-r * t, e);
    let u = nt(t - a * n - c * s, e), d = nt(-a * r - c * i, e);
    const l = u > o, w = d > o;
    if (l && (u = e - u), w && (d = e - d), u > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: w, k2: d };
  }
}, or = 32, Ws = 32, op = 32, tc = or + 1, ec = 2 * or + 1;
function md(t) {
  const { a: e, b: n } = ie, r = nt(t * t), s = nt(r * t);
  return nt(s + e * t + n);
}
const da = ie.a === Kt;
class ef extends Error {
  constructor(e) {
    super(e);
  }
}
function xd(t) {
  if (!(t instanceof te))
    throw new TypeError("JacobianPoint expected");
}
class te {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Dt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Dt.ZERO) ? te.ZERO : new te(e.x, e.y, me);
  }
  static toAffineBatch(e) {
    const n = Qb(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return te.toAffineBatch(e).map(te.fromAffine);
  }
  equals(e) {
    xd(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = nt(s * s), u = nt(a * a), d = nt(n * u), l = nt(i * c), w = nt(nt(r * a) * u), p = nt(nt(o * s) * c);
    return d === l && w === p;
  }
  negate() {
    return new te(this.x, nt(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = nt(e * e), i = nt(n * n), o = nt(i * i), a = e + i, c = nt(ms * (nt(a * a) - s - o)), u = nt(Mo * s), d = nt(u * u), l = nt(d - ms * c), w = nt(u * (c - l) - wd * o), p = nt(ms * n * r);
    return new te(l, w, p);
  }
  add(e) {
    xd(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === Kt || o === Kt)
      return this;
    if (n === Kt || r === Kt)
      return e;
    const c = nt(s * s), u = nt(a * a), d = nt(n * u), l = nt(i * c), w = nt(nt(r * a) * u), p = nt(nt(o * s) * c), x = nt(l - d), S = nt(p - w);
    if (x === Kt)
      return S === Kt ? this.double() : te.ZERO;
    const B = nt(x * x), G = nt(x * B), j = nt(d * B), v = nt(S * S - G - ms * j), U = nt(S * (j - v) - w * G), M = nt(s * a * x);
    return new te(v, U, M);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = te.ZERO;
    if (typeof e == "bigint" && e === Kt)
      return n;
    let r = Ad(e);
    if (r === me)
      return this;
    if (!da) {
      let l = n, w = this;
      for (; r > Kt; )
        r & me && (l = l.add(w)), w = w.double(), r >>= me;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = fa.splitScalar(r), c = n, u = n, d = this;
    for (; i > Kt || a > Kt; )
      i & me && (c = c.add(d)), a & me && (u = u.add(d)), d = d.double(), i >>= me, a >>= me;
    return s && (c = c.negate()), o && (u = u.negate()), u = new te(nt(u.x * fa.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = da ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(te.BASE) && (n = Dt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Vl.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = te.normalizeZ(s), Vl.set(n, s)));
    let i = te.ZERO, o = te.BASE;
    const a = 1 + (da ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let w = 0; w < a; w++) {
      const p = w * c;
      let x = Number(e & u);
      e >>= l, x > c && (x -= d, e += me);
      const S = p, B = p + Math.abs(x) - 1, G = w % 2 !== 0, j = x < 0;
      x === 0 ? o = o.add(ha(G, s[S])) : i = i.add(ha(j, s[B]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = Ad(e), s, i;
    if (da) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = fa.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: w, f: p } = this.wNAF(u, n);
      d = ha(o, d), w = ha(c, w), w = new te(nt(w.x * fa.beta), w.y, w.z), s = d.add(w), i = l.add(p);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return te.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(te.ZERO);
    e == null && (e = i ? wd : co(s));
    const o = e, a = nt(o * o), c = nt(a * o), u = nt(n * a), d = nt(r * c), l = nt(s * o);
    if (i)
      return Dt.ZERO;
    if (l !== me)
      throw new Error("invZ was invalid");
    return new Dt(u, d);
  }
}
te.BASE = new te(ie.Gx, ie.Gy, me);
te.ZERO = new te(Kt, me, Kt);
function ha(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Vl = /* @__PURE__ */ new WeakMap();
class Dt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Vl.delete(this);
  }
  hasEvenY() {
    return this.y % ms === Kt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Fn(n ? e : e.subarray(1));
    if (!Ga(r))
      throw new Error("Point is not on curve");
    const s = md(r);
    let i = Zb(s);
    const o = (i & me) === me;
    n ? o && (i = nt(-i)) : (e[0] & 1) === 1 !== o && (i = nt(-i));
    const a = new Dt(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Fn(e.subarray(1, or + 1)), r = Fn(e.subarray(or + 1, or * 2 + 1)), s = new Dt(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = vr(e), r = n.length, s = n[0];
    if (r === or)
      return this.fromCompressedHex(n);
    if (r === tc && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === ec && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${tc} compressed bytes or ${ec} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Dt.BASE.multiply(Ys(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = lp(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = nf(vr(e)), { n: a } = ie, c = r === 2 || r === 3 ? s + a : s, u = co(c, a), d = nt(-o * u, a), l = nt(i * u, a), w = r & 1 ? "03" : "02", p = Dt.fromHex(w + xs(c)), x = Dt.BASE.multiplyAndAddUnsafe(p, d, l);
    if (!x)
      throw new Error("Cannot recover signature: point at infinify");
    return x.assertValidity(), x;
  }
  toRawBytes(e = !1) {
    return Ss(this.toHex(e));
  }
  toHex(e = !1) {
    const n = xs(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${xs(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Ga(n) || !Ga(r))
      throw new Error(e);
    const s = nt(r * r), i = md(n);
    if (nt(s - i) !== Kt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Dt(this.x, nt(-this.y));
  }
  double() {
    return te.fromAffine(this).double().toAffine();
  }
  add(e) {
    return te.fromAffine(this).add(te.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return te.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = te.fromAffine(this), i = n === Kt || n === me || this !== Dt.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = te.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(te.ZERO) ? void 0 : a.toAffine();
  }
}
Dt.BASE = new Dt(ie.Gx, ie.Gy);
Dt.ZERO = new Dt(Kt, Kt);
function Sd(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Ed(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Vi(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Fn(n), left: t.subarray(e + 2) };
}
function Wb(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Vi(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Ed(t.subarray(2)), { data: r, left: s } = Ed(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Vi(s)}`);
  return { r: e, s: r };
}
class Dn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Vi(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Dn(nc(s.slice(0, 64)), nc(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Wb(n ? e : Ss(e));
    return new Dn(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Wi(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Wi(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = ie.n >> me;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Dn(this.r, nt(-this.s, ie.n)) : this;
  }
  toDERRawBytes() {
    return Ss(this.toDERHex());
  }
  toDERHex() {
    const e = Sd(vo(this.s)), n = Sd(vo(this.r)), r = e.length / 2, s = n.length / 2, i = vo(r), o = vo(s);
    return `30${vo(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Ss(this.toCompactHex());
  }
  toCompactHex() {
    return xs(this.r) + xs(this.s);
  }
}
function ws(...t) {
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
const Yb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Vi(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Yb[t[n]];
  return e;
}
const Xb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function xs(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Kt <= t && t < Xb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function qi(t) {
  const e = Ss(xs(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function vo(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function nc(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Ss(t) {
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
function Fn(t) {
  return nc(Vi(t));
}
function vr(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Ss(t);
}
function Ad(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Wi(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function nt(t, e = ie.P) {
  const n = t % e;
  return n >= Kt ? n : e + n;
}
function qn(t, e) {
  const { P: n } = ie;
  let r = t;
  for (; e-- > Kt; )
    r *= r, r %= n;
  return r;
}
function Zb(t) {
  const { P: e } = ie, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, d = qn(u, Mo) * u % e, l = qn(d, Mo) * u % e, w = qn(l, ms) * c % e, p = qn(w, r) * w % e, x = qn(p, s) * p % e, S = qn(x, o) * x % e, B = qn(S, a) * S % e, G = qn(B, o) * x % e, j = qn(G, Mo) * u % e, v = qn(j, i) * p % e, U = qn(v, n) * c % e, M = qn(U, ms);
  if (M * M % e !== t)
    throw new Error("Cannot find square root");
  return M;
}
function co(t, e = ie.P) {
  if (t === Kt || e <= Kt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = nt(t, e), r = e, s = Kt, i = me;
  for (; n !== Kt; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== me)
    throw new Error("invert: does not exist");
  return nt(s, e);
}
function Qb(t, e = ie.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === Kt ? i : (n[a] = i, nt(i * o, e)), me), s = co(r, e);
  return t.reduceRight((i, o, a) => o === Kt ? i : (n[a] = nt(i * n[a], e), nt(i * o, e)), s), n;
}
function Jb(t) {
  const e = t.length * 8 - Ws * 8, n = Fn(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function nf(t, e = !1) {
  const n = Jb(t);
  if (e)
    return n;
  const { n: r } = ie;
  return n >= r ? n - r : n;
}
let ji, No;
class ap {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Te.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return No(this.k, ...e);
  }
  checkSync() {
    if (typeof No != "function")
      throw new ef("hmacSha256Sync needs to be set");
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
    return ws(...n);
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
    return ws(...n);
  }
}
function Wi(t) {
  return Kt < t && t < ie.n;
}
function Ga(t) {
  return Kt < t && t < ie.P;
}
function cp(t, e, n, r = !0) {
  const { n: s } = ie, i = nf(t, !0);
  if (!Wi(i))
    return;
  const o = co(i, s), a = Dt.BASE.multiply(i), c = nt(a.x, s);
  if (c === Kt)
    return;
  const u = nt(o * nt(e + n * c, s), s);
  if (u === Kt)
    return;
  let d = new Dn(c, u), l = (a.x === d.r ? 0 : 2) | Number(a.y & me);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function Ys(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Ws)
      throw new Error("Expected 32 bytes of private key");
    e = nc(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Ws)
      throw new Error("Expected 32 bytes of private key");
    e = Fn(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Wi(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function rf(t) {
  return t instanceof Dt ? (t.assertValidity(), t) : Dt.fromHex(t);
}
function lp(t) {
  if (t instanceof Dn)
    return t.assertValidity(), t;
  try {
    return Dn.fromDER(t);
  } catch {
    return Dn.fromCompact(t);
  }
}
function Qo(t, e = !1) {
  return Dt.fromPrivateKey(t).toRawBytes(e);
}
function tm(t, e, n, r = !1) {
  return Dt.fromSignature(t, e, n).toRawBytes(r);
}
function vd(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === tc || r === ec : n ? r === tc * 2 || r === ec * 2 : t instanceof Dt;
}
function sf(t, e, n = !1) {
  if (vd(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!vd(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = rf(e);
  return r.assertValidity(), r.multiply(Ys(t)).toRawBytes(n);
}
function up(t) {
  const e = t.length > or ? t.slice(0, or) : t;
  return Fn(e);
}
function em(t) {
  const e = up(t), n = nt(e, ie.n);
  return fp(n < Kt ? e : n);
}
function fp(t) {
  return qi(t);
}
function dp(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = vr(t), s = Ys(e), i = [fp(s), em(r)];
  if (n != null) {
    n === !0 && (n = Te.randomBytes(or));
    const c = vr(n);
    if (c.length !== or)
      throw new Error(`sign: Expected ${or} bytes of extra data`);
    i.push(c);
  }
  const o = ws(...i), a = up(r);
  return { seed: o, m: a, d: s };
}
function hp(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function nm(t, e, n = {}) {
  const { seed: r, m: s, d: i } = dp(t, e, n.extraEntropy), o = new ap(op, Ws);
  await o.reseed(r);
  let a;
  for (; !(a = cp(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return hp(a, n);
}
function Nc(t, e, n = {}) {
  const { seed: r, m: s, d: i } = dp(t, e, n.extraEntropy), o = new ap(op, Ws);
  o.reseedSync(r);
  let a;
  for (; !(a = cp(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return hp(a, n);
}
const rm = { strict: !0 };
function sm(t, e, n, r = rm) {
  let s;
  try {
    s = lp(t), e = vr(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = nf(e);
  let c;
  try {
    c = rf(n);
  } catch {
    return !1;
  }
  const { n: u } = ie, d = co(o, u), l = nt(a * d, u), w = nt(i * d, u), p = Dt.BASE.multiplyAndAddUnsafe(c, l, w);
  return p ? nt(p.x, u) === i : !1;
}
function rc(t) {
  return nt(Fn(t), ie.n);
}
class Yi {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = vr(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Fn(n.subarray(0, 32)), s = Fn(n.subarray(32, 64));
    return new Yi(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Ga(e) || !Wi(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return xs(this.r) + xs(this.s);
  }
  toRawBytes() {
    return Ss(this.toHex());
  }
}
function im(t) {
  return Dt.fromPrivateKey(t).toRawX();
}
class pp {
  constructor(e, n, r = Te.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = vr(e);
    const { x: s, scalar: i } = this.getScalar(Ys(n));
    if (this.px = s, this.d = i, this.rand = vr(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Dt.fromPrivateKey(e), r = n.hasEvenY() ? e : ie.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return qi(e ^ Fn(n));
  }
  finalizeNonce(e) {
    const n = nt(Fn(e), ie.n);
    if (n === Kt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new Yi(e.x, nt(n + r * s, ie.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Te.taggedHash, o = this.initNonce(n, await i(ys.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(ys.nonce, o, r, e)), d = rc(await i(ys.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return await wp(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Te.taggedHashSync, o = this.initNonce(n, i(ys.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(ys.nonce, o, r, e)), d = rc(i(ys.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return bp(l, e, r) || this.error(), l;
  }
}
async function om(t, e, n) {
  return new pp(t, e, n).calc();
}
function am(t, e, n) {
  return new pp(t, e, n).calcSync();
}
function gp(t, e, n) {
  const r = t instanceof Yi, s = r ? t : Yi.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: vr(e),
    P: rf(n)
  };
}
function yp(t, e, n, r) {
  const s = Dt.BASE.multiplyAndAddUnsafe(e, Ys(n), nt(-r, ie.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function wp(t, e, n) {
  try {
    const { r, s, m: i, P: o } = gp(t, e, n), a = rc(await Te.taggedHash(ys.challenge, qi(r), o.toRawX(), i));
    return yp(r, o, s, a);
  } catch {
    return !1;
  }
}
function bp(t, e, n) {
  try {
    const { r, s, m: i, P: o } = gp(t, e, n), a = rc(Te.taggedHashSync(ys.challenge, qi(r), o.toRawX(), i));
    return yp(r, o, s, a);
  } catch (r) {
    if (r instanceof ef)
      throw r;
    return !1;
  }
}
const cm = {
  Signature: Yi,
  getPublicKey: im,
  sign: om,
  verify: wp,
  signSync: am,
  verifySync: bp
};
Dt.BASE._setWindowSize(8);
const Mn = {
  node: ip,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ys = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, pa = {}, Te = {
  bytesToHex: Vi,
  hexToBytes: Ss,
  concatBytes: ws,
  mod: nt,
  invert: co,
  isValidPrivateKey(t) {
    try {
      return Ys(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: qi,
  _normalizePrivateKey: Ys,
  hashToPrivateKey: (t) => {
    t = vr(t);
    const e = Ws + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = nt(Fn(t), ie.n - me) + me;
    return qi(n);
  },
  randomBytes: (t = 32) => {
    if (Mn.web)
      return Mn.web.getRandomValues(new Uint8Array(t));
    if (Mn.node) {
      const { randomBytes: e } = Mn.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Te.hashToPrivateKey(Te.randomBytes(Ws + 8)),
  precompute(t = 8, e = Dt.BASE) {
    const n = e === Dt.BASE ? e : new Dt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Mo), n;
  },
  sha256: async (...t) => {
    if (Mn.web) {
      const e = await Mn.web.subtle.digest("SHA-256", ws(...t));
      return new Uint8Array(e);
    } else if (Mn.node) {
      const { createHash: e } = Mn.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Mn.web) {
      const n = await Mn.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = ws(...e), s = await Mn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Mn.node) {
      const { createHmac: n } = Mn.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = pa[t];
    if (n === void 0) {
      const r = await Te.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = ws(r, r), pa[t] = n;
    }
    return Te.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof ji != "function")
      throw new ef("sha256Sync is undefined, you need to set it");
    let n = pa[t];
    if (n === void 0) {
      const r = ji(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = ws(r, r), pa[t] = n;
    }
    return ji(n, ...e);
  },
  _JacobianPoint: te
};
Object.defineProperties(Te, {
  sha256Sync: {
    configurable: !1,
    get() {
      return ji;
    },
    set(t) {
      ji || (ji = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return No;
    },
    set(t) {
      No || (No = t);
    }
  }
});
const lm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: ie,
  Point: Dt,
  Signature: Dn,
  getPublicKey: Qo,
  getSharedSecret: sf,
  recoverPublicKey: tm,
  schnorr: cm,
  sign: nm,
  signSync: Nc,
  utils: Te,
  verify: sm
}, Symbol.toStringTag, { value: "Module" }));
var Jo = {};
Jo.byteLength = pm;
var um = Jo.toByteArray = ym, fm = Jo.fromByteArray = mm, yr = [], Xn = [], dm = typeof Uint8Array < "u" ? Uint8Array : Array, fl = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Ii = 0, hm = fl.length; Ii < hm; ++Ii)
  yr[Ii] = fl[Ii], Xn[fl.charCodeAt(Ii)] = Ii;
Xn[45] = 62;
Xn[95] = 63;
function mp(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function pm(t) {
  var e = mp(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function gm(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function ym(t) {
  var e, n = mp(t), r = n[0], s = n[1], i = new dm(gm(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = Xn[t.charCodeAt(c)] << 18 | Xn[t.charCodeAt(c + 1)] << 12 | Xn[t.charCodeAt(c + 2)] << 6 | Xn[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = Xn[t.charCodeAt(c)] << 2 | Xn[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = Xn[t.charCodeAt(c)] << 10 | Xn[t.charCodeAt(c + 1)] << 4 | Xn[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function wm(t) {
  return yr[t >> 18 & 63] + yr[t >> 12 & 63] + yr[t >> 6 & 63] + yr[t & 63];
}
function bm(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(wm(r));
  return s.join("");
}
function mm(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(bm(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    yr[e >> 2] + yr[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    yr[e >> 10] + yr[e >> 4 & 63] + yr[e << 2 & 63] + "="
  )), s.join("");
}
function xm() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Sm = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Em() {
  if (xm())
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
    throw new Error(Sm);
  }
}
class Am {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(Ar(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(Ar(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class vm {
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
async function xp() {
  const t = await Em();
  return t.name === "subtleCrypto" ? new vm(t.lib) : new Am(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function km(t) {
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
  function d(p) {
    if (p instanceof Uint8Array || (ArrayBuffer.isView(p) ? p = new Uint8Array(p.buffer, p.byteOffset, p.byteLength) : Array.isArray(p) && (p = Uint8Array.from(p))), !(p instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (p.length === 0)
      return "";
    for (var x = 0, S = 0, B = 0, G = p.length; B !== G && p[B] === 0; )
      B++, x++;
    for (var j = (G - B) * u + 1 >>> 0, v = new Uint8Array(j); B !== G; ) {
      for (var U = p[B], M = 0, Q = j - 1; (U !== 0 || M < S) && Q !== -1; Q--, M++)
        U += 256 * v[Q] >>> 0, v[Q] = U % o >>> 0, U = U / o >>> 0;
      if (U !== 0)
        throw new Error("Non-zero carry");
      S = M, B++;
    }
    for (var tt = j - S; tt !== j && v[tt] === 0; )
      tt++;
    for (var K = a.repeat(x); tt < j; ++tt)
      K += t.charAt(v[tt]);
    return K;
  }
  function l(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var x = 0, S = 0, B = 0; p[x] === a; )
      S++, x++;
    for (var G = (p.length - x) * c + 1 >>> 0, j = new Uint8Array(G); p[x]; ) {
      var v = p.charCodeAt(x);
      if (v > 255)
        return;
      var U = e[v];
      if (U === 255)
        return;
      for (var M = 0, Q = G - 1; (U !== 0 || M < B) && Q !== -1; Q--, M++)
        U += o * j[Q] >>> 0, j[Q] = U % 256 >>> 0, U = U / 256 >>> 0;
      if (U !== 0)
        throw new Error("Non-zero carry");
      B = M, x++;
    }
    for (var tt = G - B; tt !== G && j[tt] === 0; )
      tt++;
    for (var K = new Uint8Array(S + (G - tt)), q = S; tt !== G; )
      K[q++] = j[tt++];
    return K;
  }
  function w(p) {
    var x = l(p);
    if (x)
      return x;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: d,
    decodeUnsafe: l,
    decode: w
  };
}
var Sp = km;
const $m = Sp, Im = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Lm = $m(Im);
const Cm = /* @__PURE__ */ K0(Lm), Tm = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Ep = Uint8Array.from({ length: 16 }, (t, e) => e), Bm = Ep.map((t) => (9 * t + 5) % 16);
let of = [Ep], af = [Bm];
for (let t = 0; t < 4; t++)
  for (let e of [of, af])
    e.push(e[t].map((n) => Tm[n]));
const Ap = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Mm = of.map((t, e) => t.map((n) => Ap[e][n])), Nm = af.map((t, e) => t.map((n) => Ap[e][n])), Pm = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), _m = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ga = (t, e) => t << e | t >>> 32 - e;
function kd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ya = new Uint32Array(16);
let Um = class extends tf {
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
      ya[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, w = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, S = Pm[p], B = _m[p], G = of[p], j = af[p], v = Mm[p], U = Nm[p];
      for (let M = 0; M < 16; M++) {
        const Q = ga(r + kd(p, i, a, u) + ya[G[M]] + S, v[M]) + l | 0;
        r = l, l = u, u = ga(a, 10) | 0, a = i, i = Q;
      }
      for (let M = 0; M < 16; M++) {
        const Q = ga(s + kd(x, o, c, d) + ya[j[M]] + B, U[M]) + w | 0;
        s = w, w = d, d = ga(c, 10) | 0, c = o, o = Q;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + w | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    ya.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Hm = fi(() => new Um());
function Om(t) {
  return Hm(t);
}
const wa = BigInt(2 ** 32 - 1), ql = BigInt(32);
function vp(t, e = !1) {
  return e ? { h: Number(t & wa), l: Number(t >> ql & wa) } : { h: Number(t >> ql & wa) | 0, l: Number(t & wa) | 0 };
}
function Dm(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = vp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Fm = (t, e) => BigInt(t >>> 0) << ql | BigInt(e >>> 0), jm = (t, e, n) => t >>> n, Rm = (t, e, n) => t << 32 - n | e >>> n, zm = (t, e, n) => t >>> n | e << 32 - n, Gm = (t, e, n) => t << 32 - n | e >>> n, Km = (t, e, n) => t << 64 - n | e >>> n - 32, Vm = (t, e, n) => t >>> n - 32 | e << 64 - n, qm = (t, e) => e, Wm = (t, e) => t, Ym = (t, e, n) => t << n | e >>> 32 - n, Xm = (t, e, n) => e << n | t >>> 32 - n, Zm = (t, e, n) => e << n - 32 | t >>> 64 - n, Qm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Jm(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const t1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), e1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, n1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), r1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, s1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), i1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Mt = {
  fromBig: vp,
  split: Dm,
  toBig: Fm,
  shrSH: jm,
  shrSL: Rm,
  rotrSH: zm,
  rotrSL: Gm,
  rotrBH: Km,
  rotrBL: Vm,
  rotr32H: qm,
  rotr32L: Wm,
  rotlSH: Ym,
  rotlSL: Xm,
  rotlBH: Zm,
  rotlBL: Qm,
  add: Jm,
  add3L: t1,
  add3H: e1,
  add4L: n1,
  add4H: r1,
  add5H: i1,
  add5L: s1
}, [o1, a1] = Mt.split([
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
].map((t) => BigInt(t))), Yr = new Uint32Array(80), Xr = new Uint32Array(80);
let Pc = class extends tf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: w, Gh: p, Gl: x, Hh: S, Hl: B } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, w, p, x, S, B];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, w, p, x, S, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = w | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let v = 0; v < 16; v++, n += 4)
      Yr[v] = e.getUint32(n), Xr[v] = e.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const U = Yr[v - 15] | 0, M = Xr[v - 15] | 0, Q = Mt.rotrSH(U, M, 1) ^ Mt.rotrSH(U, M, 8) ^ Mt.shrSH(U, M, 7), tt = Mt.rotrSL(U, M, 1) ^ Mt.rotrSL(U, M, 8) ^ Mt.shrSL(U, M, 7), K = Yr[v - 2] | 0, q = Xr[v - 2] | 0, I = Mt.rotrSH(K, q, 19) ^ Mt.rotrBH(K, q, 61) ^ Mt.shrSH(K, q, 6), P = Mt.rotrSL(K, q, 19) ^ Mt.rotrBL(K, q, 61) ^ Mt.shrSL(K, q, 6), b = Mt.add4L(tt, P, Xr[v - 7], Xr[v - 16]), L = Mt.add4H(b, Q, I, Yr[v - 7], Yr[v - 16]);
      Yr[v] = L | 0, Xr[v] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: w, Fh: p, Fl: x, Gh: S, Gl: B, Hh: G, Hl: j } = this;
    for (let v = 0; v < 80; v++) {
      const U = Mt.rotrSH(l, w, 14) ^ Mt.rotrSH(l, w, 18) ^ Mt.rotrBH(l, w, 41), M = Mt.rotrSL(l, w, 14) ^ Mt.rotrSL(l, w, 18) ^ Mt.rotrBL(l, w, 41), Q = l & p ^ ~l & S, tt = w & x ^ ~w & B, K = Mt.add5L(j, M, tt, a1[v], Xr[v]), q = Mt.add5H(K, G, U, Q, o1[v], Yr[v]), I = K | 0, P = Mt.rotrSH(r, s, 28) ^ Mt.rotrBH(r, s, 34) ^ Mt.rotrBH(r, s, 39), b = Mt.rotrSL(r, s, 28) ^ Mt.rotrBL(r, s, 34) ^ Mt.rotrBL(r, s, 39), L = r & i ^ r & a ^ i & a, D = s & o ^ s & c ^ o & c;
      G = S | 0, j = B | 0, S = p | 0, B = x | 0, p = l | 0, x = w | 0, { h: l, l: w } = Mt.add(u | 0, d | 0, q | 0, I | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const C = Mt.add3L(I, b, D);
      r = Mt.add3H(C, q, P, L), s = C | 0;
    }
    ({ h: r, l: s } = Mt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Mt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Mt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Mt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: w } = Mt.add(this.Eh | 0, this.El | 0, l | 0, w | 0), { h: p, l: x } = Mt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: B } = Mt.add(this.Gh | 0, this.Gl | 0, S | 0, B | 0), { h: G, l: j } = Mt.add(this.Hh | 0, this.Hl | 0, G | 0, j | 0), this.set(r, s, i, o, a, c, u, d, l, w, p, x, S, B, G, j);
  }
  roundClean() {
    Yr.fill(0), Xr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, c1 = class extends Pc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, l1 = class extends Pc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, u1 = class extends Pc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const f1 = fi(() => new Pc());
fi(() => new c1());
fi(() => new l1());
fi(() => new u1());
function kp(t) {
  return Ki(t);
}
function d1(t) {
  return f1(t);
}
const h1 = 0;
Te.hmacSha256Sync = (t, ...e) => {
  const n = Mc.create(Ki, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function p1() {
  return wt(Te.randomPrivateKey());
}
function g1(t) {
  const e = Ki(Ki(t));
  return Cm.encode(Ar(t, e).slice(0, t.length + 4));
}
function y1(t, e) {
  return g1(Ar(new Uint8Array([t]), e.slice(0, 20)));
}
function $p(t, e = h1) {
  const n = typeof t == "string" ? Wt(t) : t, r = Om(kp(n));
  return y1(e, r);
}
function Ip(t) {
  const e = Qu(t);
  return wt(Qo(e.slice(0, 32), !0));
}
Te.hmacSha256Sync = (t, ...e) => {
  const n = Mc.create(Ki, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var sc;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(sc || (sc = {}));
async function w1(t, e, n) {
  return await (await xp()).encrypt("aes-256-cbc", e, t, n);
}
async function b1(t, e, n) {
  return await (await xp()).decrypt("aes-256-cbc", e, t, n);
}
function Lp(t, e) {
  return Mc(Ki, t, e);
}
function m1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function Cp(t) {
  const e = d1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function x1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function S1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: sc.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: sc.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !x1(t))
    return e;
  try {
    return Dt.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function E1(t, e, n, r) {
  const s = S1(t);
  if (!s.result)
    throw s;
  const i = Te.randomPrivateKey(), o = Qo(i, !0);
  let a = sf(i, t, !0);
  a = a.slice(1);
  const c = Cp(a), u = Te.randomBytes(16), d = await w1(u, c.encryptionKey, e), l = Ar(u, o, d), w = Lp(c.hmacKey, l);
  let p;
  if (!r || r === "hex")
    p = wt(d);
  else if (r === "base64")
    p = fm(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const x = {
    iv: wt(u),
    ephemeralPK: wt(o),
    cipherText: p,
    mac: wt(w),
    wasString: n
  };
  return r && r !== "hex" && (x.cipherTextEncoding = r), x;
}
async function Tp(t, e) {
  if (!e.ephemeralPK)
    throw new hd("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = sf(t, n, !0);
  r = r.slice(1);
  const s = Cp(r), i = Wt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Wt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = um(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = Ar(i, Wt(n), o), c = Lp(s.hmacKey, a), u = Wt(e.mac);
  if (!m1(u, c))
    throw new hd("Decryption failed: failure in MAC check");
  const d = await b1(i, s.encryptionKey, o);
  return e.wasString ? Zo(d) : d;
}
function A1(t, e) {
  const n = typeof e == "string" ? ui(e) : e, r = Ip(t), s = kp(n), i = Nc(s, t);
  return {
    signature: wt(i),
    publicKey: r
  };
}
async function v1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Ip(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? ui(t) : t, o = await E1(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = A1(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function k1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return Tp(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var tn = {}, Xi = {}, gn = {};
Object.defineProperty(gn, "__esModule", { value: !0 });
gn.decode = gn.encode = gn.unescape = gn.escape = gn.pad = void 0;
const Bp = Jo;
function cf(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
gn.pad = cf;
function Mp(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
gn.escape = Mp;
function Np(t) {
  return cf(t).replace(/-/g, "+").replace(/_/g, "/");
}
gn.unescape = Np;
function $1(t) {
  return Mp((0, Bp.fromByteArray)(new TextEncoder().encode(t)));
}
gn.encode = $1;
function I1(t) {
  return new TextDecoder().decode((0, Bp.toByteArray)(cf(Np(t))));
}
gn.decode = I1;
var _c = {}, Uc = {}, Pp = {}, _p = {}, Hc = {};
Object.defineProperty(Hc, "__esModule", { value: !0 });
Hc.crypto = void 0;
Hc.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = d, t.createView = l, t.rotr = w, t.rotl = p, t.byteSwap = x, t.byteSwap32 = S, t.bytesToHex = j, t.hexToBytes = M, t.asyncLoop = tt, t.utf8ToBytes = K, t.bytesToUtf8 = q, t.toBytes = I, t.kdfInputToBytes = P, t.concatBytes = b, t.checkOpts = L, t.createHasher = C, t.createOptHasher = rt, t.createXOFer = Y, t.randomBytes = kt;
  const e = Hc;
  function n(E) {
    return E instanceof Uint8Array || ArrayBuffer.isView(E) && E.constructor.name === "Uint8Array";
  }
  function r(E) {
    if (!Number.isSafeInteger(E) || E < 0)
      throw new Error("positive integer expected, got " + E);
  }
  function s(E, ...H) {
    if (!n(E))
      throw new Error("Uint8Array expected");
    if (H.length > 0 && !H.includes(E.length))
      throw new Error("Uint8Array expected of length " + H + ", got length=" + E.length);
  }
  function i(E) {
    if (typeof E != "function" || typeof E.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(E.outputLen), r(E.blockLen);
  }
  function o(E, H = !0) {
    if (E.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (H && E.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(E, H) {
    s(E);
    const at = H.outputLen;
    if (E.length < at)
      throw new Error("digestInto() expects output buffer of length at least " + at);
  }
  function c(E) {
    return new Uint8Array(E.buffer, E.byteOffset, E.byteLength);
  }
  function u(E) {
    return new Uint32Array(E.buffer, E.byteOffset, Math.floor(E.byteLength / 4));
  }
  function d(...E) {
    for (let H = 0; H < E.length; H++)
      E[H].fill(0);
  }
  function l(E) {
    return new DataView(E.buffer, E.byteOffset, E.byteLength);
  }
  function w(E, H) {
    return E << 32 - H | E >>> H;
  }
  function p(E, H) {
    return E << H | E >>> 32 - H >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function x(E) {
    return E << 24 & 4278190080 | E << 8 & 16711680 | E >>> 8 & 65280 | E >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (E) => E : (E) => x(E), t.byteSwapIfBE = t.swap8IfBE;
  function S(E) {
    for (let H = 0; H < E.length; H++)
      E[H] = x(E[H]);
    return E;
  }
  t.swap32IfBE = t.isLE ? (E) => E : S;
  const B = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", G = /* @__PURE__ */ Array.from({ length: 256 }, (E, H) => H.toString(16).padStart(2, "0"));
  function j(E) {
    if (s(E), B)
      return E.toHex();
    let H = "";
    for (let at = 0; at < E.length; at++)
      H += G[E[at]];
    return H;
  }
  const v = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function U(E) {
    if (E >= v._0 && E <= v._9)
      return E - v._0;
    if (E >= v.A && E <= v.F)
      return E - (v.A - 10);
    if (E >= v.a && E <= v.f)
      return E - (v.a - 10);
  }
  function M(E) {
    if (typeof E != "string")
      throw new Error("hex string expected, got " + typeof E);
    if (B)
      return Uint8Array.fromHex(E);
    const H = E.length, at = H / 2;
    if (H % 2)
      throw new Error("hex string expected, got unpadded hex of length " + H);
    const it = new Uint8Array(at);
    for (let ct = 0, $t = 0; ct < at; ct++, $t += 2) {
      const de = U(E.charCodeAt($t)), It = U(E.charCodeAt($t + 1));
      if (de === void 0 || It === void 0) {
        const Yt = E[$t] + E[$t + 1];
        throw new Error('hex string expected, got non-hex character "' + Yt + '" at index ' + $t);
      }
      it[ct] = de * 16 + It;
    }
    return it;
  }
  const Q = async () => {
  };
  t.nextTick = Q;
  async function tt(E, H, at) {
    let it = Date.now();
    for (let ct = 0; ct < E; ct++) {
      at(ct);
      const $t = Date.now() - it;
      $t >= 0 && $t < H || (await (0, t.nextTick)(), it += $t);
    }
  }
  function K(E) {
    if (typeof E != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(E));
  }
  function q(E) {
    return new TextDecoder().decode(E);
  }
  function I(E) {
    return typeof E == "string" && (E = K(E)), s(E), E;
  }
  function P(E) {
    return typeof E == "string" && (E = K(E)), s(E), E;
  }
  function b(...E) {
    let H = 0;
    for (let it = 0; it < E.length; it++) {
      const ct = E[it];
      s(ct), H += ct.length;
    }
    const at = new Uint8Array(H);
    for (let it = 0, ct = 0; it < E.length; it++) {
      const $t = E[it];
      at.set($t, ct), ct += $t.length;
    }
    return at;
  }
  function L(E, H) {
    if (H !== void 0 && {}.toString.call(H) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(E, H);
  }
  class D {
  }
  t.Hash = D;
  function C(E) {
    const H = (it) => E().update(I(it)).digest(), at = E();
    return H.outputLen = at.outputLen, H.blockLen = at.blockLen, H.create = () => E(), H;
  }
  function rt(E) {
    const H = (it, ct) => E(ct).update(I(it)).digest(), at = E({});
    return H.outputLen = at.outputLen, H.blockLen = at.blockLen, H.create = (it) => E(it), H;
  }
  function Y(E) {
    const H = (it, ct) => E(ct).update(I(it)).digest(), at = E({});
    return H.outputLen = at.outputLen, H.blockLen = at.blockLen, H.create = (it) => E(it), H;
  }
  t.wrapConstructor = C, t.wrapConstructorWithOpts = rt, t.wrapXOFConstructorWithOpts = Y;
  function kt(E = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(E));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(E));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(_p);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = _p;
  class n extends e.Hash {
    constructor(i, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(i);
      const a = (0, e.toBytes)(o);
      if (this.iHash = i.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, u = new Uint8Array(c);
      u.set(a.length > c ? i.create().update(a).digest() : a);
      for (let d = 0; d < u.length; d++)
        u[d] ^= 54;
      this.iHash.update(u), this.oHash = i.create();
      for (let d = 0; d < u.length; d++)
        u[d] ^= 106;
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
      const { oHash: o, iHash: a, finished: c, destroyed: u, blockLen: d, outputLen: l } = this;
      return i = i, i.finished = c, i.destroyed = u, i.blockLen = d, i.outputLen = l, i.oHash = o._cloneInto(i.oHash), i.iHash = a._cloneInto(i.iHash), i;
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
})(Pp);
const Li = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Up(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Wl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function di(t, ...e) {
  if (!Up(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function L1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Wl(t.outputLen), Wl(t.blockLen);
}
function Yl(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Hp(t, e) {
  di(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function C1(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function T1(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function ic(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Ka(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function er(t, e) {
  return t << 32 - e | t >>> e;
}
function B1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const lf = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function uf(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const Op = lf ? (t) => t : (t) => uf(t), M1 = Op;
function Dp(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = uf(t[e]);
  return t;
}
const N1 = lf ? (t) => t : Dp, Fp = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", P1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function jp(t) {
  if (di(t), Fp)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += P1[t[n]];
  return e;
}
const Br = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function $d(t) {
  if (t >= Br._0 && t <= Br._9)
    return t - Br._0;
  if (t >= Br.A && t <= Br.F)
    return t - (Br.A - 10);
  if (t >= Br.a && t <= Br.f)
    return t - (Br.a - 10);
}
function _1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Fp)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = $d(t.charCodeAt(i)), a = $d(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const Rp = async () => {
};
async function U1(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await Rp(), r += i);
  }
}
function ff(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function H1(t) {
  return new TextDecoder().decode(t);
}
function ta(t) {
  return typeof t == "string" && (t = ff(t)), di(t), t;
}
function O1(t) {
  return typeof t == "string" && (t = ff(t)), di(t), t;
}
function D1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    di(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function F1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let zp = class {
};
function Oc(t) {
  const e = (r) => t().update(ta(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Gp(t) {
  const e = (r, s) => t(s).update(ta(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Kp(t) {
  const e = (r, s) => t(s).update(ta(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const j1 = Oc, R1 = Gp, z1 = Kp;
function G1(t = 32) {
  if (Li && typeof Li.getRandomValues == "function")
    return Li.getRandomValues(new Uint8Array(t));
  if (Li && typeof Li.randomBytes == "function")
    return Uint8Array.from(Li.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const K1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: zp,
  abytes: di,
  aexists: Yl,
  ahash: L1,
  anumber: Wl,
  aoutput: Hp,
  asyncLoop: U1,
  byteSwap: uf,
  byteSwap32: Dp,
  byteSwapIfBE: M1,
  bytesToHex: jp,
  bytesToUtf8: H1,
  checkOpts: F1,
  clean: ic,
  concatBytes: D1,
  createHasher: Oc,
  createOptHasher: Gp,
  createView: Ka,
  createXOFer: Kp,
  hexToBytes: _1,
  isBytes: Up,
  isLE: lf,
  kdfInputToBytes: O1,
  nextTick: Rp,
  randomBytes: G1,
  rotl: B1,
  rotr: er,
  swap32IfBE: N1,
  swap8IfBE: Op,
  toBytes: ta,
  u32: T1,
  u8: C1,
  utf8ToBytes: ff,
  wrapConstructor: j1,
  wrapConstructorWithOpts: R1,
  wrapXOFConstructorWithOpts: z1
}, Symbol.toStringTag, { value: "Module" }));
function V1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function q1(t, e, n) {
  return t & e ^ ~t & n;
}
function W1(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class Y1 extends zp {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = Ka(this.buffer);
  }
  update(e) {
    Yl(this), e = ta(e), di(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Ka(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Yl(this), Hp(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, ic(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    V1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ka(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
const Zr = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Qr = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), X1 = /* @__PURE__ */ Uint32Array.from([
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
]), Jr = /* @__PURE__ */ new Uint32Array(64);
let df = class extends Y1 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Zr[0] | 0, this.B = Zr[1] | 0, this.C = Zr[2] | 0, this.D = Zr[3] | 0, this.E = Zr[4] | 0, this.F = Zr[5] | 0, this.G = Zr[6] | 0, this.H = Zr[7] | 0;
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
      const w = Jr[l - 15], p = Jr[l - 2], x = er(w, 7) ^ er(w, 18) ^ w >>> 3, S = er(p, 17) ^ er(p, 19) ^ p >>> 10;
      Jr[l] = S + Jr[l - 7] + x + Jr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const w = er(a, 6) ^ er(a, 11) ^ er(a, 25), p = d + w + q1(a, c, u) + X1[l] + Jr[l] | 0, S = (er(r, 2) ^ er(r, 13) ^ er(r, 22)) + W1(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    ic(Jr);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), ic(this.buffer);
  }
}, Vp = class extends df {
  constructor() {
    super(28), this.A = Qr[0] | 0, this.B = Qr[1] | 0, this.C = Qr[2] | 0, this.D = Qr[3] | 0, this.E = Qr[4] | 0, this.F = Qr[5] | 0, this.G = Qr[6] | 0, this.H = Qr[7] | 0;
  }
};
const Z1 = /* @__PURE__ */ Oc(() => new df()), Q1 = /* @__PURE__ */ Oc(() => new Vp()), J1 = df, qp = Z1, t2 = Vp, e2 = Q1, n2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: t2,
  SHA256: J1,
  sha224: e2,
  sha256: qp
}, Symbol.toStringTag, { value: "Module" })), Dc = /* @__PURE__ */ Tc(n2), r2 = /* @__PURE__ */ Tc(lm);
var Zi = {};
Object.defineProperty(Zi, "__esModule", { value: !0 });
Zi.joseToDer = Zi.derToJose = void 0;
const Wp = Jo, Yp = gn;
function dl(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const s2 = {
  ES256: dl(256),
  ES384: dl(384),
  ES512: dl(521)
};
function Xp(t) {
  const e = s2[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const oc = 128, Zp = 0, i2 = 32, o2 = 16, a2 = 2, Qp = o2 | i2 | Zp << 6, ac = a2 | Zp << 6;
function Jp(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Wp.toByteArray)((0, Yp.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function c2(t, e) {
  const n = Jp(t), r = Xp(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Qp)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (oc | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== ac)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== ac)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[o++];
  if (i - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${i - o}"`);
  if (s < d)
    throw new Error(`"s" specified length of "${d}", max of "${s}" is acceptable`);
  const l = o;
  if (o += d, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const w = r - c, p = r - d, x = new Uint8Array(w + c + p + d);
  for (o = 0; o < w; ++o)
    x[o] = 0;
  x.set(n.subarray(u + Math.max(-w, 0), u + c), o), o = r;
  for (const S = o; o < S + p; ++o)
    x[o] = 0;
  return x.set(n.subarray(l + Math.max(-p, 0), l + d), o), (0, Yp.escape)((0, Wp.fromByteArray)(x));
}
Zi.derToJose = c2;
function Id(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= oc && --r, r;
}
function l2(t, e) {
  t = Jp(t);
  const n = Xp(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Id(t, 0, n), i = Id(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < oc, d = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return d[l++] = Qp, u ? d[l++] = c : (d[l++] = oc | 1, d[l++] = c & 255), d[l++] = ac, d[l++] = o, s < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(s, n), l), l += n - s), d[l++] = ac, d[l++] = a, i < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + i), l), d;
}
Zi.joseToDer = l2;
var Fr = {};
Object.defineProperty(Fr, "__esModule", { value: !0 });
Fr.InvalidTokenError = Fr.MissingParametersError = void 0;
class u2 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Fr.MissingParametersError = u2;
class f2 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Fr.InvalidTokenError = f2;
const ea = /* @__PURE__ */ Tc(K1);
Object.defineProperty(Uc, "__esModule", { value: !0 });
Uc.SECP256K1Client = void 0;
const d2 = Pp, h2 = Dc, Va = r2, Ld = Zi, Cd = Fr, Td = ea;
Va.utils.hmacSha256Sync = (t, ...e) => {
  const n = d2.hmac.create(h2.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class tg {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Td.bytesToHex)(Va.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Cd.MissingParametersError("a signing input hash and private key are all required");
    const s = Va.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Td.bytesToHex)(s);
    if (r === "jose")
      return (0, Ld.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Ld.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Cd.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Va.verify(n, e, r, { strict: !1 });
  }
}
Uc.SECP256K1Client = tg;
tg.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Uc;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(_c);
var Xs = {};
const p2 = /* @__PURE__ */ Tc(ip);
var g2 = wn && wn.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
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
      d.done ? i(d.value) : s(d.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Xs, "__esModule", { value: !0 });
Xs.hashSha256Async = Xs.hashSha256 = void 0;
const y2 = Dc;
function eg(t) {
  return (0, y2.sha256)(t);
}
Xs.hashSha256 = eg;
function w2(t) {
  return g2(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = p2;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(eg(t));
    }
  });
}
Xs.hashSha256Async = w2;
var b2 = wn && wn.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
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
      d.done ? i(d.value) : s(d.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Xi, "__esModule", { value: !0 });
Xi.TokenSigner = Xi.createUnsecuredToken = void 0;
const Xl = gn, Bd = _c, m2 = Fr, Md = Xs;
function Zl(t, e) {
  const n = [], r = Xl.encode(JSON.stringify(e));
  n.push(r);
  const s = Xl.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function x2(t) {
  return Zl(t, { typ: "JWT", alg: "none" }) + ".";
}
Xi.createUnsecuredToken = x2;
class S2 {
  constructor(e, n) {
    if (!(e && n))
      throw new m2.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !Bd.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Bd.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = Zl(e, s), o = (0, Md.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return b2(this, void 0, void 0, function* () {
      const s = this.header(r), i = Zl(e, s), o = yield (0, Md.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [Xl.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Xi.TokenSigner = S2;
var Fc = {};
Object.defineProperty(Fc, "__esModule", { value: !0 });
Fc.TokenVerifier = void 0;
const E2 = gn, Nd = _c, A2 = Fr, ba = Xs;
class v2 {
  constructor(e, n) {
    if (!(e && n))
      throw new A2.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Nd.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Nd.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, ba.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, ba.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), E2.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, ba.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, ba.hashSha256)(r);
      return i(o);
    }
  }
}
Fc.TokenVerifier = v2;
var jc = {};
Object.defineProperty(jc, "__esModule", { value: !0 });
jc.decodeToken = void 0;
const ma = gn;
function k2(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(ma.decode(e[0])), r = JSON.parse(ma.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = ma.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(ma.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
jc.decodeToken = k2;
(function(t) {
  var e = wn && wn.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = wn && wn.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Xi, t), n(Fc, t), n(jc, t), n(Fr, t), n(_c, t);
})(tn);
function $2(t) {
  return `did:btc-addr:${t}`;
}
function I2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new dd("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new dd('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function ng(t) {
  if (t)
    return I2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const L2 = "1.4.0";
function C2() {
  return p1();
}
function T2(t, e, n, r = Y0.slice(), s, i = fb().getTime(), o = {}) {
  const a = (p) => {
    const x = Xu("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return x == null ? void 0 : x.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: hb(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: L2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = tn.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const d = $p(u);
  return c.iss = $2(d), new tn.TokenSigner("ES256k", t).sign(c);
}
async function Pd(t, e) {
  const n = Zo(Wt(e)), r = JSON.parse(n), s = await Tp(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function B2(t) {
  const e = tn.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new tn.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function M2(t) {
  const e = tn.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = ng(e.iss);
  if (n.length === 1) {
    if ($p(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function N2(t) {
  const e = tn.decodeToken(t).payload;
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
function P2(t) {
  const e = tn.decodeToken(t).payload;
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
function _2(t) {
  const e = [
    P2(t),
    N2(t),
    B2(t),
    M2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const _d = "1.0.0";
class Es {
  constructor(e) {
    this.version = _d, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== _d)
      throw new Rl(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Es(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class rg {
  constructor(e) {
    if (e) {
      const n = new Es(e);
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
class Ud extends rg {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Es({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new X0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Es({})), !0;
  }
}
class Hd extends rg {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = cb, !localStorage.getItem(this.key)) {
      const r = new Es({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new X0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Es.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Es({})), !0;
  }
}
var Do;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Do || (Do = {}));
var cc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(cc || (cc = {}));
Do.Mainnet;
var Hr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Hr || (Hr = {}));
var mr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(mr || (mr = {}));
Hr.Mainnet;
const sg = {
  chainId: Do.Mainnet,
  transactionVersion: Hr.Mainnet,
  peerNetworkId: cc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: mr.MainnetSingleSig,
    multiSig: mr.MainnetMultiSig
  },
  client: { baseUrl: Z0 }
}, Ql = {
  chainId: Do.Testnet,
  transactionVersion: Hr.Testnet,
  peerNetworkId: cc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: mr.TestnetSingleSig,
    multiSig: mr.TestnetMultiSig
  },
  client: { baseUrl: Q0 }
}, qa = {
  ...Ql,
  addressVersion: { ...Ql.addressVersion },
  magicBytes: "id",
  client: { baseUrl: J0 }
}, U2 = {
  ...qa,
  addressVersion: { ...qa.addressVersion },
  client: { ...qa.client }
};
function H2(t) {
  switch (t) {
    case "mainnet":
      return sg;
    case "testnet":
      return Ql;
    case "devnet":
      return qa;
    case "mocknet":
      return U2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function ig(t) {
  return typeof t == "string" ? H2(t) : t;
}
var Od;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Od || (Od = {}));
var Dd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Dd || (Dd = {}));
var nr;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(nr || (nr = {}));
const hl = ["onChainOnly", "offChainOnly", "any"];
hl[0] + "", nr.OnChainOnly, hl[1] + "", nr.OffChainOnly, hl[2] + "", nr.Any, nr.OnChainOnly + "", nr.OnChainOnly, nr.OffChainOnly + "", nr.OffChainOnly, nr.Any + "", nr.Any;
var Fd;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Fd || (Fd = {}));
var jd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(jd || (jd = {}));
var Rd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Rd || (Rd = {}));
var Ur;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Ur || (Ur = {}));
var zd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(zd || (zd = {}));
var Gd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Gd || (Gd = {}));
var Kd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Kd || (Kd = {}));
var Vd;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Vd || (Vd = {}));
var qd;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(qd || (qd = {}));
var Wd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Wd || (Wd = {}));
var Yd;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Yd || (Yd = {}));
var Xd;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Xd || (Xd = {}));
var Zd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Zd || (Zd = {}));
function Jl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function O2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function og(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function D2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Jl(t.outputLen), Jl(t.blockLen);
}
function F2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function j2(t, e) {
  og(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Us = {
  number: Jl,
  bool: O2,
  bytes: og,
  hash: D2,
  exists: F2,
  output: j2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const pl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), fr = (t, e) => t << 32 - e | t >>> e, R2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!R2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function z2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function hf(t) {
  if (typeof t == "string" && (t = z2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let ag = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function hi(t) {
  const e = (r) => t().update(hf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let cg = class extends ag {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Us.hash(e);
    const r = hf(n);
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
    return Us.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Us.exists(this), Us.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const lg = (t, e, n) => new cg(t, e).update(n).digest();
lg.create = (t, e) => new cg(t, e);
function G2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let pf = class extends ag {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = pl(this.buffer);
  }
  update(e) {
    Us.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = hf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = pl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Us.exists(this), Us.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    G2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = pl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
const K2 = (t, e, n) => t & e ^ ~t & n, V2 = (t, e, n) => t & e ^ t & n ^ e & n, q2 = new Uint32Array([
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
let ug = class extends pf {
  constructor() {
    super(64, 32, 8, !1), this.A = ts[0] | 0, this.B = ts[1] | 0, this.C = ts[2] | 0, this.D = ts[3] | 0, this.E = ts[4] | 0, this.F = ts[5] | 0, this.G = ts[6] | 0, this.H = ts[7] | 0;
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
      es[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const w = es[l - 15], p = es[l - 2], x = fr(w, 7) ^ fr(w, 18) ^ w >>> 3, S = fr(p, 17) ^ fr(p, 19) ^ p >>> 10;
      es[l] = S + es[l - 7] + x + es[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const w = fr(a, 6) ^ fr(a, 11) ^ fr(a, 25), p = d + w + K2(a, c, u) + q2[l] + es[l] | 0, S = (fr(r, 2) ^ fr(r, 13) ^ fr(r, 22)) + V2(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    es.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, W2 = class extends ug {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const fg = hi(() => new ug());
hi(() => new W2());
var pi = {}, gf = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = ea;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let p = o.length - 1; p >= 0; p--)
      if (u < 4) {
        const x = n.indexOf(o[p]) >> u;
        let S = 0;
        p !== 0 && (S = n.indexOf(o[p - 1]));
        const B = 1 + u, G = S % (1 << B) << 5 - B, j = t.c32[x + G];
        u = B, c.unshift(j);
      } else
        u = 0;
    let d = 0;
    for (let p = 0; p < c.length && c[p] === "0"; p++)
      d++;
    c = c.slice(d);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), w = l ? l[0].length : 0;
    for (let p = 0; p < w; p++)
      c.unshift(t.c32[0]);
    if (a) {
      const p = a - c.length;
      for (let x = 0; x < p; x++)
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
    let d = [], l = 0, w = 0;
    for (let S = o.length - 1; S >= 0; S--) {
      w === 4 && (d.unshift(n[l]), w = 0, l = 0);
      const G = (t.c32.indexOf(o[S]) << w) + l, j = n[G % 16];
      if (w += 1, l = G >> 4, l > 1 << w)
        throw new Error("Panic error in decoding.");
      d.unshift(j);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let p = 0;
    for (let S = 0; S < d.length && d[S] === "0"; S++)
      p++;
    d = d.slice(p - p % 2);
    let x = d.join("");
    for (let S = 0; S < u; S++)
      x = `00${x}`;
    if (a) {
      const S = a * 2 - x.length;
      for (let B = 0; B < S; B += 2)
        x = `00${x}`;
    }
    return x;
  }
  t.c32decode = i;
})(gf);
var Zs = {};
Object.defineProperty(Zs, "__esModule", { value: !0 });
Zs.c32checkDecode = Zs.c32checkEncode = void 0;
const Qd = Dc, Jd = ea, Po = gf;
function dg(t) {
  const e = (0, Qd.sha256)((0, Qd.sha256)((0, Jd.hexToBytes)(t)));
  return (0, Jd.bytesToHex)(e.slice(0, 4));
}
function Y2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = dg(`${n}${e}`), s = (0, Po.c32encode)(`${e}${r}`);
  return `${Po.c32[t]}${s}`;
}
Zs.c32checkEncode = Y2;
function X2(t) {
  t = (0, Po.c32normalize)(t);
  const e = (0, Po.c32decode)(t.slice(1)), n = t[0], r = Po.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), dg(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Zs.c32checkDecode = X2;
var hg = {}, Qi = {};
Object.defineProperty(Qi, "__esModule", { value: !0 });
Qi.decode = Qi.encode = void 0;
const lc = Dc, th = ea, pg = Sp, gg = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Z2(t, e = "00") {
  const n = typeof t == "string" ? (0, th.hexToBytes)(t) : t, r = typeof e == "string" ? (0, th.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, lc.sha256)((0, lc.sha256)(new Uint8Array([...r, ...n])));
  return pg(gg).encode([...r, ...n, ...s.slice(0, 4)]);
}
Qi.encode = Z2;
function Q2(t) {
  const e = pg(gg).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, lc.sha256)((0, lc.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Qi.decode = Q2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Zs, n = Qi, r = ea;
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
    const w = n.decode(d), p = (0, r.bytesToHex)(w.data), x = parseInt((0, r.bytesToHex)(w.prefix), 16);
    let S;
    return l < 0 ? (S = x, s[x] !== void 0 && (S = s[x])) : S = l, o(S, p);
  }
  t.b58ToC32 = c;
  function u(d, l = -1) {
    const w = a(d), p = w[0], x = w[1];
    let S;
    l < 0 ? (S = p, i[p] !== void 0 && (S = i[p])) : S = l;
    let B = S.toString(16);
    return B.length === 1 && (B = `0${B}`), n.encode(x, B);
  }
  t.c32ToB58 = u;
})(hg);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = gf;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Zs;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = hg;
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
})(pi);
function J2(t, e) {
  switch (e = ig(e ?? sg), t) {
    case Ur.P2PKH:
      switch (e.transactionVersion) {
        case Hr.Mainnet:
          return mr.MainnetSingleSig;
        case Hr.Testnet:
          return mr.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Ur.P2SH:
    case Ur.P2SHNonSequential:
    case Ur.P2WPKH:
    case Ur.P2WSH:
    case Ur.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Hr.Mainnet:
          return mr.MainnetMultiSig;
        case Hr.Testnet:
          return mr.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const tx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), yg = Uint8Array.from({ length: 16 }, (t, e) => e), ex = yg.map((t) => (9 * t + 5) % 16);
let yf = [yg], wf = [ex];
for (let t = 0; t < 4; t++)
  for (let e of [yf, wf])
    e.push(e[t].map((n) => tx[n]));
const wg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), nx = yf.map((t, e) => t.map((n) => wg[e][n])), rx = wf.map((t, e) => t.map((n) => wg[e][n])), sx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), ix = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), xa = (t, e) => t << e | t >>> 32 - e;
function eh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Sa = new Uint32Array(16);
let ox = class extends pf {
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
      Sa[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, w = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, S = sx[p], B = ix[p], G = yf[p], j = wf[p], v = nx[p], U = rx[p];
      for (let M = 0; M < 16; M++) {
        const Q = xa(r + eh(p, i, a, u) + Sa[G[M]] + S, v[M]) + l | 0;
        r = l, l = u, u = xa(a, 10) | 0, a = i, i = Q;
      }
      for (let M = 0; M < 16; M++) {
        const Q = xa(s + eh(x, o, c, d) + Sa[j[M]] + B, U[M]) + w | 0;
        s = w, w = d, d = xa(c, 10) | 0, c = o, o = Q;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + w | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Sa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const ax = hi(() => new ox()), Ea = BigInt(2 ** 32 - 1), tu = BigInt(32);
function bg(t, e = !1) {
  return e ? { h: Number(t & Ea), l: Number(t >> tu & Ea) } : { h: Number(t >> tu & Ea) | 0, l: Number(t & Ea) | 0 };
}
function cx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = bg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const lx = (t, e) => BigInt(t >>> 0) << tu | BigInt(e >>> 0), ux = (t, e, n) => t >>> n, fx = (t, e, n) => t << 32 - n | e >>> n, dx = (t, e, n) => t >>> n | e << 32 - n, hx = (t, e, n) => t << 32 - n | e >>> n, px = (t, e, n) => t << 64 - n | e >>> n - 32, gx = (t, e, n) => t >>> n - 32 | e << 64 - n, yx = (t, e) => e, wx = (t, e) => t, bx = (t, e, n) => t << n | e >>> 32 - n, mx = (t, e, n) => e << n | t >>> 32 - n, xx = (t, e, n) => e << n - 32 | t >>> 64 - n, Sx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Ex(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Ax = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), vx = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, kx = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), $x = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Ix = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Lx = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Nt = {
  fromBig: bg,
  split: cx,
  toBig: lx,
  shrSH: ux,
  shrSL: fx,
  rotrSH: dx,
  rotrSL: hx,
  rotrBH: px,
  rotrBL: gx,
  rotr32H: yx,
  rotr32L: wx,
  rotlSH: bx,
  rotlSL: mx,
  rotlBH: xx,
  rotlBL: Sx,
  add: Ex,
  add3L: Ax,
  add3H: vx,
  add4L: kx,
  add4H: $x,
  add5H: Lx,
  add5L: Ix
}, [Cx, Tx] = Nt.split([
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
let Rc = class extends pf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: w, Gh: p, Gl: x, Hh: S, Hl: B } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, w, p, x, S, B];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, w, p, x, S, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = w | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let v = 0; v < 16; v++, n += 4)
      ns[v] = e.getUint32(n), rs[v] = e.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const U = ns[v - 15] | 0, M = rs[v - 15] | 0, Q = Nt.rotrSH(U, M, 1) ^ Nt.rotrSH(U, M, 8) ^ Nt.shrSH(U, M, 7), tt = Nt.rotrSL(U, M, 1) ^ Nt.rotrSL(U, M, 8) ^ Nt.shrSL(U, M, 7), K = ns[v - 2] | 0, q = rs[v - 2] | 0, I = Nt.rotrSH(K, q, 19) ^ Nt.rotrBH(K, q, 61) ^ Nt.shrSH(K, q, 6), P = Nt.rotrSL(K, q, 19) ^ Nt.rotrBL(K, q, 61) ^ Nt.shrSL(K, q, 6), b = Nt.add4L(tt, P, rs[v - 7], rs[v - 16]), L = Nt.add4H(b, Q, I, ns[v - 7], ns[v - 16]);
      ns[v] = L | 0, rs[v] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: w, Fh: p, Fl: x, Gh: S, Gl: B, Hh: G, Hl: j } = this;
    for (let v = 0; v < 80; v++) {
      const U = Nt.rotrSH(l, w, 14) ^ Nt.rotrSH(l, w, 18) ^ Nt.rotrBH(l, w, 41), M = Nt.rotrSL(l, w, 14) ^ Nt.rotrSL(l, w, 18) ^ Nt.rotrBL(l, w, 41), Q = l & p ^ ~l & S, tt = w & x ^ ~w & B, K = Nt.add5L(j, M, tt, Tx[v], rs[v]), q = Nt.add5H(K, G, U, Q, Cx[v], ns[v]), I = K | 0, P = Nt.rotrSH(r, s, 28) ^ Nt.rotrBH(r, s, 34) ^ Nt.rotrBH(r, s, 39), b = Nt.rotrSL(r, s, 28) ^ Nt.rotrBL(r, s, 34) ^ Nt.rotrBL(r, s, 39), L = r & i ^ r & a ^ i & a, D = s & o ^ s & c ^ o & c;
      G = S | 0, j = B | 0, S = p | 0, B = x | 0, p = l | 0, x = w | 0, { h: l, l: w } = Nt.add(u | 0, d | 0, q | 0, I | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const C = Nt.add3L(I, b, D);
      r = Nt.add3H(C, q, P, L), s = C | 0;
    }
    ({ h: r, l: s } = Nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Nt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Nt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: w } = Nt.add(this.Eh | 0, this.El | 0, l | 0, w | 0), { h: p, l: x } = Nt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: B } = Nt.add(this.Gh | 0, this.Gl | 0, S | 0, B | 0), { h: G, l: j } = Nt.add(this.Hh | 0, this.Hl | 0, G | 0, j | 0), this.set(r, s, i, o, a, c, u, d, l, w, p, x, S, B, G, j);
  }
  roundClean() {
    ns.fill(0), rs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Bx = class extends Rc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Mx = class extends Rc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Nx = class extends Rc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
hi(() => new Rc());
hi(() => new Bx());
hi(() => new Mx());
hi(() => new Nx());
var uc = { exports: {} };
uc.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", w = "[object Map]", p = "[object Number]", x = "[object Object]", S = "[object Promise]", B = "[object RegExp]", G = "[object Set]", j = "[object String]", v = "[object Symbol]", U = "[object WeakMap]", M = "[object ArrayBuffer]", Q = "[object DataView]", tt = "[object Float32Array]", K = "[object Float64Array]", q = "[object Int8Array]", I = "[object Int16Array]", P = "[object Int32Array]", b = "[object Uint8Array]", L = "[object Uint8ClampedArray]", D = "[object Uint16Array]", C = "[object Uint32Array]", rt = /[\\^$.*+?()[\]{}|]/g, Y = /\w*$/, kt = /^\[object .+?Constructor\]$/, E = /^(?:0|[1-9]\d*)$/, H = {};
  H[i] = H[o] = H[M] = H[Q] = H[a] = H[c] = H[tt] = H[K] = H[q] = H[I] = H[P] = H[w] = H[p] = H[x] = H[B] = H[G] = H[j] = H[v] = H[b] = H[L] = H[D] = H[C] = !0, H[u] = H[d] = H[U] = !1;
  var at = typeof wn == "object" && wn && wn.Object === Object && wn, it = typeof self == "object" && self && self.Object === Object && self, ct = at || it || Function("return this")(), $t = e && !e.nodeType && e, de = $t && !0 && t && !t.nodeType && t, It = de && de.exports === $t;
  function Yt(y, T) {
    return y.set(T[0], T[1]), y;
  }
  function Lt(y, T) {
    return y.add(T), y;
  }
  function se(y, T) {
    for (var O = -1, lt = y ? y.length : 0; ++O < lt && T(y[O], O, y) !== !1; )
      ;
    return y;
  }
  function Rt(y, T) {
    for (var O = -1, lt = T.length, Oe = y.length; ++O < lt; )
      y[Oe + O] = T[O];
    return y;
  }
  function Xt(y, T, O, lt) {
    for (var Oe = -1, Xe = y ? y.length : 0; ++Oe < Xe; )
      O = T(O, y[Oe], Oe, y);
    return O;
  }
  function De(y, T) {
    for (var O = -1, lt = Array(y); ++O < y; )
      lt[O] = T(O);
    return lt;
  }
  function he(y, T) {
    return y == null ? void 0 : y[T];
  }
  function We(y) {
    var T = !1;
    if (y != null && typeof y.toString != "function")
      try {
        T = !!(y + "");
      } catch {
      }
    return T;
  }
  function en(y) {
    var T = -1, O = Array(y.size);
    return y.forEach(function(lt, Oe) {
      O[++T] = [Oe, lt];
    }), O;
  }
  function Se(y, T) {
    return function(O) {
      return y(T(O));
    };
  }
  function N(y) {
    var T = -1, O = Array(y.size);
    return y.forEach(function(lt) {
      O[++T] = lt;
    }), O;
  }
  var xt = Array.prototype, oe = Function.prototype, Ee = Object.prototype, ae = ct["__core-js_shared__"], $n = function() {
    var y = /[^.]+$/.exec(ae && ae.keys && ae.keys.IE_PROTO || "");
    return y ? "Symbol(src)_1." + y : "";
  }(), Rn = oe.toString, Ge = Ee.hasOwnProperty, ge = Ee.toString, $ = RegExp(
    "^" + Rn.call(Ge).replace(rt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), _ = It ? ct.Buffer : void 0, F = ct.Symbol, V = ct.Uint8Array, ht = Se(Object.getPrototypeOf, Object), ut = Object.create, ee = Ee.propertyIsEnumerable, Jt = xt.splice, ne = Object.getOwnPropertySymbols, ye = _ ? _.isBuffer : void 0, $e = Se(Object.keys, Object), _e = dt(ct, "DataView"), St = dt(ct, "Map"), yt = dt(ct, "Promise"), Zt = dt(ct, "Set"), Vt = dt(ct, "WeakMap"), we = dt(Object, "create"), ce = Bt(_e), In = Bt(St), nn = Bt(yt), zr = Bt(Zt), xi = Bt(Vt), Ye = F ? F.prototype : void 0, Gr = Ye ? Ye.valueOf : void 0;
  function tr(y) {
    var T = -1, O = y ? y.length : 0;
    for (this.clear(); ++T < O; ) {
      var lt = y[T];
      this.set(lt[0], lt[1]);
    }
  }
  function Ln() {
    this.__data__ = we ? we(null) : {};
  }
  function go(y) {
    return this.has(y) && delete this.__data__[y];
  }
  function Is(y) {
    var T = this.__data__;
    if (we) {
      var O = T[y];
      return O === r ? void 0 : O;
    }
    return Ge.call(T, y) ? T[y] : void 0;
  }
  function qt(y) {
    var T = this.__data__;
    return we ? T[y] !== void 0 : Ge.call(T, y);
  }
  function rn(y, T) {
    var O = this.__data__;
    return O[y] = we && T === void 0 ? r : T, this;
  }
  tr.prototype.clear = Ln, tr.prototype.delete = go, tr.prototype.get = Is, tr.prototype.has = qt, tr.prototype.set = rn;
  function mn(y) {
    var T = -1, O = y ? y.length : 0;
    for (this.clear(); ++T < O; ) {
      var lt = y[T];
      this.set(lt[0], lt[1]);
    }
  }
  function Ls() {
    this.__data__ = [];
  }
  function Si(y) {
    var T = this.__data__, O = A(T, y);
    if (O < 0)
      return !1;
    var lt = T.length - 1;
    return O == lt ? T.pop() : Jt.call(T, O, 1), !0;
  }
  function zn(y) {
    var T = this.__data__, O = A(T, y);
    return O < 0 ? void 0 : T[O][1];
  }
  function Lr(y) {
    return A(this.__data__, y) > -1;
  }
  function Gn(y, T) {
    var O = this.__data__, lt = A(O, y);
    return lt < 0 ? O.push([y, T]) : O[lt][1] = T, this;
  }
  mn.prototype.clear = Ls, mn.prototype.delete = Si, mn.prototype.get = zn, mn.prototype.has = Lr, mn.prototype.set = Gn;
  function Cn(y) {
    var T = -1, O = y ? y.length : 0;
    for (this.clear(); ++T < O; ) {
      var lt = y[T];
      this.set(lt[0], lt[1]);
    }
  }
  function Kr() {
    this.__data__ = {
      hash: new tr(),
      map: new (St || mn)(),
      string: new tr()
    };
  }
  function Ei(y) {
    return En(this, y).delete(y);
  }
  function Cs(y) {
    return En(this, y).get(y);
  }
  function yo(y) {
    return En(this, y).has(y);
  }
  function Ue(y, T) {
    return En(this, y).set(y, T), this;
  }
  Cn.prototype.clear = Kr, Cn.prototype.delete = Ei, Cn.prototype.get = Cs, Cn.prototype.has = yo, Cn.prototype.set = Ue;
  function lr(y) {
    this.__data__ = new mn(y);
  }
  function xn() {
    this.__data__ = new mn();
  }
  function Ai(y) {
    return this.__data__.delete(y);
  }
  function Ts(y) {
    return this.__data__.get(y);
  }
  function vi(y) {
    return this.__data__.has(y);
  }
  function Vr(y, T) {
    var O = this.__data__;
    if (O instanceof mn) {
      var lt = O.__data__;
      if (!St || lt.length < n - 1)
        return lt.push([y, T]), this;
      O = this.__data__ = new Cn(lt);
    }
    return O.set(y, T), this;
  }
  lr.prototype.clear = xn, lr.prototype.delete = Ai, lr.prototype.get = Ts, lr.prototype.has = vi, lr.prototype.set = Vr;
  function f(y, T) {
    var O = Ve(y) || He(y) ? De(y.length, String) : [], lt = O.length, Oe = !!lt;
    for (var Xe in y)
      Ge.call(y, Xe) && !(Oe && (Xe == "length" || z(Xe, lt))) && O.push(Xe);
    return O;
  }
  function m(y, T, O) {
    var lt = y[T];
    (!(Ge.call(y, T) && Ke(lt, O)) || O === void 0 && !(T in y)) && (y[T] = O);
  }
  function A(y, T) {
    for (var O = y.length; O--; )
      if (Ke(y[O][0], T))
        return O;
    return -1;
  }
  function h(y, T) {
    return y && Sn(T, $i(T), y);
  }
  function J(y, T, O, lt, Oe, Xe, Kn) {
    var Ze;
    if (lt && (Ze = Xe ? lt(y, Oe, Xe, Kn) : lt(y)), Ze !== void 0)
      return Ze;
    if (!Bs(y))
      return y;
    var mo = Ve(y);
    if (mo) {
      if (Ze = R(y), !T)
        return Bn(y, Ze);
    } else {
      var Tr = k(y), xo = Tr == d || Tr == l;
      if (wo(y))
        return un(y, T);
      if (Tr == x || Tr == i || xo && !Xe) {
        if (We(y))
          return Xe ? y : {};
        if (Ze = et(xo ? {} : y), !T)
          return dn(y, h(Ze, y));
      } else {
        if (!H[Tr])
          return Xe ? y : {};
        Ze = Et(y, Tr, J, T);
      }
    }
    Kn || (Kn = new lr());
    var W = Kn.get(y);
    if (W)
      return W;
    if (Kn.set(y, Ze), !mo)
      var ot = O ? ki(y) : $i(y);
    return se(ot || y, function(Ct, pe) {
      ot && (pe = Ct, Ct = y[pe]), m(Ze, pe, J(Ct, T, O, lt, pe, y, Kn));
    }), Ze;
  }
  function vt(y) {
    return Bs(y) ? ut(y) : {};
  }
  function bt(y, T, O) {
    var lt = T(y);
    return Ve(y) ? lt : Rt(lt, O(y));
  }
  function zt(y) {
    return ge.call(y);
  }
  function Ae(y) {
    if (!Bs(y) || gt(y))
      return !1;
    var T = bo(y) || We(y) ? $ : kt;
    return T.test(Bt(y));
  }
  function ln(y) {
    if (!mt(y))
      return $e(y);
    var T = [];
    for (var O in Object(y))
      Ge.call(y, O) && O != "constructor" && T.push(O);
    return T;
  }
  function un(y, T) {
    if (T)
      return y.slice();
    var O = new y.constructor(y.length);
    return y.copy(O), O;
  }
  function Ht(y) {
    var T = new y.constructor(y.byteLength);
    return new V(T).set(new V(y)), T;
  }
  function jt(y, T) {
    var O = T ? Ht(y.buffer) : y.buffer;
    return new y.constructor(O, y.byteOffset, y.byteLength);
  }
  function Qt(y, T, O) {
    var lt = T ? O(en(y), !0) : en(y);
    return Xt(lt, Yt, new y.constructor());
  }
  function Tn(y) {
    var T = new y.constructor(y.source, Y.exec(y));
    return T.lastIndex = y.lastIndex, T;
  }
  function Fe(y, T, O) {
    var lt = T ? O(N(y), !0) : N(y);
    return Xt(lt, Lt, new y.constructor());
  }
  function je(y) {
    return Gr ? Object(Gr.call(y)) : {};
  }
  function fn(y, T) {
    var O = T ? Ht(y.buffer) : y.buffer;
    return new y.constructor(O, y.byteOffset, y.length);
  }
  function Bn(y, T) {
    var O = -1, lt = y.length;
    for (T || (T = Array(lt)); ++O < lt; )
      T[O] = y[O];
    return T;
  }
  function Sn(y, T, O, lt) {
    O || (O = {});
    for (var Oe = -1, Xe = T.length; ++Oe < Xe; ) {
      var Kn = T[Oe], Ze = void 0;
      m(O, Kn, Ze === void 0 ? y[Kn] : Ze);
    }
    return O;
  }
  function dn(y, T) {
    return Sn(y, g(y), T);
  }
  function ki(y) {
    return bt(y, $i, g);
  }
  function En(y, T) {
    var O = y.__data__;
    return pt(T) ? O[typeof T == "string" ? "string" : "hash"] : O.map;
  }
  function dt(y, T) {
    var O = he(y, T);
    return Ae(O) ? O : void 0;
  }
  var g = ne ? Se(ne, Object) : aa, k = zt;
  (_e && k(new _e(new ArrayBuffer(1))) != Q || St && k(new St()) != w || yt && k(yt.resolve()) != S || Zt && k(new Zt()) != G || Vt && k(new Vt()) != U) && (k = function(y) {
    var T = ge.call(y), O = T == x ? y.constructor : void 0, lt = O ? Bt(O) : void 0;
    if (lt)
      switch (lt) {
        case ce:
          return Q;
        case In:
          return w;
        case nn:
          return S;
        case zr:
          return G;
        case xi:
          return U;
      }
    return T;
  });
  function R(y) {
    var T = y.length, O = y.constructor(T);
    return T && typeof y[0] == "string" && Ge.call(y, "index") && (O.index = y.index, O.input = y.input), O;
  }
  function et(y) {
    return typeof y.constructor == "function" && !mt(y) ? vt(ht(y)) : {};
  }
  function Et(y, T, O, lt) {
    var Oe = y.constructor;
    switch (T) {
      case M:
        return Ht(y);
      case a:
      case c:
        return new Oe(+y);
      case Q:
        return jt(y, lt);
      case tt:
      case K:
      case q:
      case I:
      case P:
      case b:
      case L:
      case D:
      case C:
        return fn(y, lt);
      case w:
        return Qt(y, lt, O);
      case p:
      case j:
        return new Oe(y);
      case B:
        return Tn(y);
      case G:
        return Fe(y, lt, O);
      case v:
        return je(y);
    }
  }
  function z(y, T) {
    return T = T ?? s, !!T && (typeof y == "number" || E.test(y)) && y > -1 && y % 1 == 0 && y < T;
  }
  function pt(y) {
    var T = typeof y;
    return T == "string" || T == "number" || T == "symbol" || T == "boolean" ? y !== "__proto__" : y === null;
  }
  function gt(y) {
    return !!$n && $n in y;
  }
  function mt(y) {
    var T = y && y.constructor, O = typeof T == "function" && T.prototype || Ee;
    return y === O;
  }
  function Bt(y) {
    if (y != null) {
      try {
        return Rn.call(y);
      } catch {
      }
      try {
        return y + "";
      } catch {
      }
    }
    return "";
  }
  function Be(y) {
    return J(y, !0, !0);
  }
  function Ke(y, T) {
    return y === T || y !== y && T !== T;
  }
  function He(y) {
    return ia(y) && Ge.call(y, "callee") && (!ee.call(y, "callee") || ge.call(y) == i);
  }
  var Ve = Array.isArray;
  function Cr(y) {
    return y != null && il(y.length) && !bo(y);
  }
  function ia(y) {
    return oa(y) && Cr(y);
  }
  var wo = ye || ca;
  function bo(y) {
    var T = Bs(y) ? ge.call(y) : "";
    return T == d || T == l;
  }
  function il(y) {
    return typeof y == "number" && y > -1 && y % 1 == 0 && y <= s;
  }
  function Bs(y) {
    var T = typeof y;
    return !!y && (T == "object" || T == "function");
  }
  function oa(y) {
    return !!y && typeof y == "object";
  }
  function $i(y) {
    return Cr(y) ? f(y) : ln(y);
  }
  function aa() {
    return [];
  }
  function ca() {
    return !1;
  }
  t.exports = Be;
})(uc, uc.exports);
var Px = uc.exports;
const mg = /* @__PURE__ */ K0(Px);
var eu;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(eu || (eu = {}));
function _x(t, e) {
  return { type: eu.Address, version: t, hash160: e };
}
function Ux(t) {
  return pi.c32address(t.version, t.hash160);
}
const Hx = (t) => ax(fg(t)), Ox = (t) => wt(Hx(t));
Te.hmacSha256Sync = (t, ...e) => {
  const n = lg.create(fg, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Dx(t, e = "mainnet") {
  e = ig(e), t = typeof t == "string" ? Wt(t) : t;
  const n = J2(Ur.P2PKH, e), r = _x(n, Ox(t));
  return Ux(r);
}
function Fx(t, e) {
  const n = tn.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = Dx(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new tn.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function jx(t, e = null) {
  let n;
  e ? n = Fx(t, e) : n = tn.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const nh = "_blockstackDidCheckEchoReply", Rx = "echoReply", zx = "authContinuation";
function Gx(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Kx() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[nh];
  if (typeof e == "boolean")
    return e;
  const n = Gx(t.location.search), r = n[Rx];
  if (r) {
    t[nh] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[zx];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class nu {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new tp();
    else
      throw new ub("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new Hd(e.sessionOptions) : this.store = new Hd() : e ? this.store = new Ud(e.sessionOptions) : this.store = new Ud();
  }
  makeAuthRequestToken(e, n, r, s, i, o = db().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Rl("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, T2(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = C2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = Xu("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Kx())
        return _i.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      _i.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = _b()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new ua("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = tn.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await _2(e))
      throw new ua("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (cl(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Pd(s, i.private_key);
          } catch {
            if (_i.warn("Failed decryption of appPrivateKey, will try to use as given"), !Te.isValidPrivateKey(i.private_key))
              throw new ua("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Pd(s, c);
          } catch {
            _i.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new ua("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = vb, d;
    cl(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), cl(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (d = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: ng(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: d
    }, w = i.profile_url;
    if (!l.profile && w) {
      const p = await n(w);
      if (!p.ok)
        l.profile = Object.assign({}, ab);
      else {
        const x = await p.text(), S = JSON.parse(x);
        l.profile = jx(S[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Rl("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), v1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), k1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
nu.prototype.makeAuthRequest = nu.prototype.makeAuthRequestToken;
const Vx = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], qx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = Vx(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!zc(r.id));
  return e.concat(n);
}, zc = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), xg = "STX_PROVIDER", Qs = () => typeof window > "u" ? null : window.localStorage.getItem(xg), Wx = (t) => {
  typeof window < "u" && window.localStorage.setItem(xg, t);
}, Yx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Xx(t, e) {
  const n = {};
  return Object.assign(n, Yx, e), await fetch(t, n);
}
function Zx(t) {
  let e = Xx, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Qx(...t) {
  const { fetchLib: e, middlewares: n } = Zx(t);
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
var Ji;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ji || (Ji = {}));
var Js;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Js || (Js = {}));
var rh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(rh || (rh = {}));
const Jx = "https://api.mainnet.hiro.so", tS = "https://api.testnet.hiro.so", eS = "http://localhost:3999", nS = ["mainnet", "testnet", "devnet", "mocknet"];
class ti {
  constructor(e) {
    this.version = Js.Mainnet, this.chainId = Ji.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Js.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Qx();
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
ti.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new ru();
    case "testnet":
      return new su();
    case "devnet":
      return new rS();
    case "mocknet":
      return new Sg();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${nS.join(", ")}`);
  }
};
ti.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : ti.fromName(t);
class ru extends ti {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Jx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Js.Mainnet, this.chainId = Ji.Mainnet;
  }
}
class su extends ti {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? tS,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Js.Testnet, this.chainId = Ji.Testnet;
  }
}
class Sg extends ti {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? eS,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Js.Testnet, this.chainId = Ji.Testnet;
  }
}
const rS = Sg;
var ei;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(ei || (ei = {}));
var fc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(fc || (fc = {}));
ei.Mainnet;
var ni;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ni || (ni = {}));
var ri;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ri || (ri = {}));
ni.Mainnet;
const sS = {
  chainId: ei.Mainnet,
  transactionVersion: ni.Mainnet,
  peerNetworkId: fc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ri.MainnetSingleSig,
    multiSig: ri.MainnetMultiSig
  },
  client: { baseUrl: Z0 }
}, iu = {
  chainId: ei.Testnet,
  transactionVersion: ni.Testnet,
  peerNetworkId: fc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ri.TestnetSingleSig,
    multiSig: ri.TestnetMultiSig
  },
  client: { baseUrl: Q0 }
}, Wa = {
  ...iu,
  addressVersion: { ...iu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: J0 }
}, iS = {
  ...Wa,
  addressVersion: { ...Wa.addressVersion },
  client: { ...Wa.client }
};
function oS(t) {
  switch (t) {
    case "mainnet":
      return sS;
    case "testnet":
      return iu;
    case "devnet":
      return Wa;
    case "mocknet":
      return iS;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function aS(t) {
  return typeof t == "string" ? oS(t) : t;
}
function cS(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const sh = /* @__PURE__ */ new Map();
function Eg(t, e) {
  const n = sh.get(t);
  if (n !== void 0)
    return n(e);
  const r = cS(t);
  return sh.set(t, r), Eg(t, e);
}
let fe = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Wt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Bb(this.readBytes(4), 0);
  }
  readUInt8() {
    return Cb(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Ib(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = wt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = wt(n);
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
    if (Eg(e, r))
      return r;
    throw n(r);
  }
};
const lS = 128, uS = 128, Ag = 16, Rs = 32, ou = 80, Gc = 65, fS = 32, dS = 64, dc = 34, hS = 1 + 16 * 1024 * 1024, pS = 165, gS = 16, yS = 16, wS = 20, bS = yS + 2 + wS, mS = bS + 4, xS = hS + (pS + gS * mS);
var re;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(re || (re = {}));
var au;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(au || (au = {}));
var Pn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Pn || (Pn = {}));
const gl = ["onChainOnly", "offChainOnly", "any"];
gl[0] + "", Pn.OnChainOnly, gl[1] + "", Pn.OffChainOnly, gl[2] + "", Pn.Any, Pn.OnChainOnly + "", Pn.OnChainOnly, Pn.OffChainOnly + "", Pn.OffChainOnly, Pn.Any + "", Pn.Any;
var hc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(hc || (hc = {}));
var be;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(be || (be = {}));
var Le;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Le || (Le = {}));
var le;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(le || (le = {}));
var ve;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ve || (ve = {}));
var _o;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(_o || (_o = {}));
var cu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(cu || (cu = {}));
var lu;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(lu || (lu = {}));
var yn;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(yn || (yn = {}));
var ih;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ih || (ih = {}));
var uu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(uu || (uu = {}));
var sr;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(sr || (sr = {}));
var oh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(oh || (oh = {}));
let Kc = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ui = class extends Kc {
  constructor(e) {
    super(e);
  }
}, pn = class extends Kc {
  constructor(e) {
    super(e);
  }
}, pc = class extends Kc {
  constructor(e) {
    super(e);
  }
}, Hs = class extends Kc {
  constructor(e) {
    super(e);
  }
};
function fu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function SS(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function vg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function ES(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  fu(t.outputLen), fu(t.blockLen);
}
function AS(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function vS(t, e) {
  vg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Os = {
  number: fu,
  bool: SS,
  bytes: vg,
  hash: ES,
  exists: AS,
  output: vS
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const yl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), dr = (t, e) => t << 32 - e | t >>> e, kS = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!kS)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function $S(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function bf(t) {
  if (typeof t == "string" && (t = $S(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let kg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function gi(t) {
  const e = (r) => t().update(bf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let $g = class extends kg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Os.hash(e);
    const r = bf(n);
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
    return Os.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Os.exists(this), Os.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Ig = (t, e, n) => new $g(t, e).update(n).digest();
Ig.create = (t, e) => new $g(t, e);
function IS(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let mf = class extends kg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = yl(this.buffer);
  }
  update(e) {
    Os.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = bf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = yl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Os.exists(this), Os.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    IS(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = yl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
const LS = (t, e, n) => t & e ^ ~t & n, CS = (t, e, n) => t & e ^ t & n ^ e & n, TS = new Uint32Array([
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
]), ss = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), is = new Uint32Array(64);
let Lg = class extends mf {
  constructor() {
    super(64, 32, 8, !1), this.A = ss[0] | 0, this.B = ss[1] | 0, this.C = ss[2] | 0, this.D = ss[3] | 0, this.E = ss[4] | 0, this.F = ss[5] | 0, this.G = ss[6] | 0, this.H = ss[7] | 0;
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
      is[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const w = is[l - 15], p = is[l - 2], x = dr(w, 7) ^ dr(w, 18) ^ w >>> 3, S = dr(p, 17) ^ dr(p, 19) ^ p >>> 10;
      is[l] = S + is[l - 7] + x + is[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const w = dr(a, 6) ^ dr(a, 11) ^ dr(a, 25), p = d + w + LS(a, c, u) + TS[l] + is[l] | 0, S = (dr(r, 2) ^ dr(r, 13) ^ dr(r, 22)) + CS(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    is.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, BS = class extends Lg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const xf = gi(() => new Lg());
gi(() => new BS());
const MS = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Cg = Uint8Array.from({ length: 16 }, (t, e) => e), NS = Cg.map((t) => (9 * t + 5) % 16);
let Sf = [Cg], Ef = [NS];
for (let t = 0; t < 4; t++)
  for (let e of [Sf, Ef])
    e.push(e[t].map((n) => MS[n]));
const Tg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), PS = Sf.map((t, e) => t.map((n) => Tg[e][n])), _S = Ef.map((t, e) => t.map((n) => Tg[e][n])), US = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), HS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Aa = (t, e) => t << e | t >>> 32 - e;
function ah(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const va = new Uint32Array(16);
let OS = class extends mf {
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
      va[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, w = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, S = US[p], B = HS[p], G = Sf[p], j = Ef[p], v = PS[p], U = _S[p];
      for (let M = 0; M < 16; M++) {
        const Q = Aa(r + ah(p, i, a, u) + va[G[M]] + S, v[M]) + l | 0;
        r = l, l = u, u = Aa(a, 10) | 0, a = i, i = Q;
      }
      for (let M = 0; M < 16; M++) {
        const Q = Aa(s + ah(x, o, c, d) + va[j[M]] + B, U[M]) + w | 0;
        s = w, w = d, d = Aa(c, 10) | 0, c = o, o = Q;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + w | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    va.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const DS = gi(() => new OS()), ka = BigInt(2 ** 32 - 1), du = BigInt(32);
function Bg(t, e = !1) {
  return e ? { h: Number(t & ka), l: Number(t >> du & ka) } : { h: Number(t >> du & ka) | 0, l: Number(t & ka) | 0 };
}
function FS(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Bg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const jS = (t, e) => BigInt(t >>> 0) << du | BigInt(e >>> 0), RS = (t, e, n) => t >>> n, zS = (t, e, n) => t << 32 - n | e >>> n, GS = (t, e, n) => t >>> n | e << 32 - n, KS = (t, e, n) => t << 32 - n | e >>> n, VS = (t, e, n) => t << 64 - n | e >>> n - 32, qS = (t, e, n) => t >>> n - 32 | e << 64 - n, WS = (t, e) => e, YS = (t, e) => t, XS = (t, e, n) => t << n | e >>> 32 - n, ZS = (t, e, n) => e << n | t >>> 32 - n, QS = (t, e, n) => e << n - 32 | t >>> 64 - n, JS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function tE(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const eE = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), nE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, rE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), sE = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, iE = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), oE = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Pt = {
  fromBig: Bg,
  split: FS,
  toBig: jS,
  shrSH: RS,
  shrSL: zS,
  rotrSH: GS,
  rotrSL: KS,
  rotrBH: VS,
  rotrBL: qS,
  rotr32H: WS,
  rotr32L: YS,
  rotlSH: XS,
  rotlSL: ZS,
  rotlBH: QS,
  rotlBL: JS,
  add: tE,
  add3L: eE,
  add3H: nE,
  add4L: rE,
  add4H: sE,
  add5H: oE,
  add5L: iE
}, [aE, cE] = Pt.split([
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
].map((t) => BigInt(t))), os = new Uint32Array(80), as = new Uint32Array(80);
let Vc = class extends mf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: w, Gh: p, Gl: x, Hh: S, Hl: B } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, w, p, x, S, B];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, w, p, x, S, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = w | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let v = 0; v < 16; v++, n += 4)
      os[v] = e.getUint32(n), as[v] = e.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const U = os[v - 15] | 0, M = as[v - 15] | 0, Q = Pt.rotrSH(U, M, 1) ^ Pt.rotrSH(U, M, 8) ^ Pt.shrSH(U, M, 7), tt = Pt.rotrSL(U, M, 1) ^ Pt.rotrSL(U, M, 8) ^ Pt.shrSL(U, M, 7), K = os[v - 2] | 0, q = as[v - 2] | 0, I = Pt.rotrSH(K, q, 19) ^ Pt.rotrBH(K, q, 61) ^ Pt.shrSH(K, q, 6), P = Pt.rotrSL(K, q, 19) ^ Pt.rotrBL(K, q, 61) ^ Pt.shrSL(K, q, 6), b = Pt.add4L(tt, P, as[v - 7], as[v - 16]), L = Pt.add4H(b, Q, I, os[v - 7], os[v - 16]);
      os[v] = L | 0, as[v] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: w, Fh: p, Fl: x, Gh: S, Gl: B, Hh: G, Hl: j } = this;
    for (let v = 0; v < 80; v++) {
      const U = Pt.rotrSH(l, w, 14) ^ Pt.rotrSH(l, w, 18) ^ Pt.rotrBH(l, w, 41), M = Pt.rotrSL(l, w, 14) ^ Pt.rotrSL(l, w, 18) ^ Pt.rotrBL(l, w, 41), Q = l & p ^ ~l & S, tt = w & x ^ ~w & B, K = Pt.add5L(j, M, tt, cE[v], as[v]), q = Pt.add5H(K, G, U, Q, aE[v], os[v]), I = K | 0, P = Pt.rotrSH(r, s, 28) ^ Pt.rotrBH(r, s, 34) ^ Pt.rotrBH(r, s, 39), b = Pt.rotrSL(r, s, 28) ^ Pt.rotrBL(r, s, 34) ^ Pt.rotrBL(r, s, 39), L = r & i ^ r & a ^ i & a, D = s & o ^ s & c ^ o & c;
      G = S | 0, j = B | 0, S = p | 0, B = x | 0, p = l | 0, x = w | 0, { h: l, l: w } = Pt.add(u | 0, d | 0, q | 0, I | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const C = Pt.add3L(I, b, D);
      r = Pt.add3H(C, q, P, L), s = C | 0;
    }
    ({ h: r, l: s } = Pt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Pt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Pt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Pt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: w } = Pt.add(this.Eh | 0, this.El | 0, l | 0, w | 0), { h: p, l: x } = Pt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: B } = Pt.add(this.Gh | 0, this.Gl | 0, S | 0, B | 0), { h: G, l: j } = Pt.add(this.Hh | 0, this.Hl | 0, G | 0, j | 0), this.set(r, s, i, o, a, c, u, d, l, w, p, x, S, B, G, j);
  }
  roundClean() {
    os.fill(0), as.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, lE = class extends Vc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, uE = class extends Vc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, fE = class extends Vc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
gi(() => new Vc());
gi(() => new lE());
const dE = gi(() => new uE());
gi(() => new fE());
var Gt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Gt || (Gt = {}));
var Re;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Re || (Re = {}));
function Af(t) {
  return Re[t];
}
const hE = () => ({ type: Gt.BoolTrue }), pE = () => ({ type: Gt.BoolFalse }), gE = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Gt.Buffer, value: wt(t) };
}, ch = BigInt("0xffffffffffffffffffffffffffffffff"), yE = BigInt(0), lh = BigInt("0x7fffffffffffffffffffffffffffffff"), uh = BigInt("-170141183460469231731687303715884105728"), wE = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = Gl(Wt(t))), kn(t, Uint8Array) && (t = Gl(t));
  const e = cn(t);
  if (e > lh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${lh}`);
  if (e < uh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${uh}`);
  return { type: Gt.Int, value: e };
}, bE = (t) => {
  const e = cn(t);
  if (e < yE)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > ch)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${ch}`);
  return { type: Gt.UInt, value: e };
};
function mE(t) {
  return { type: Gt.List, value: t };
}
function Mg() {
  return { type: Gt.OptionalNone };
}
function Ng(t) {
  return { type: Gt.OptionalSome, value: t };
}
var st;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(st || (st = {}));
function xE() {
  return {
    type: st.Address,
    version: ri.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function fh(t) {
  if (t && Rg(t, dc))
    throw new Error(`Memo exceeds maximum length of ${dc} bytes`);
  return { type: st.MemoString, content: t };
}
function vf(t, e) {
  return {
    type: st.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function hu(t) {
  if (Wt(t).byteLength != Gc)
    throw Error("Invalid signature");
  return {
    type: st.MessageSignature,
    data: t
  };
}
function SE(t, e, n) {
  return typeof t == "string" && (t = HE(t)), typeof n == "string" && (n = fh(n)), {
    type: st.Payload,
    payloadType: re.TokenTransfer,
    recipient: t,
    amount: cn(e),
    memo: n ?? fh("")
  };
}
function EE(t, e, n, r) {
  return typeof e == "string" && (e = ar(e)), typeof n == "string" && (n = ar(n)), {
    type: st.Payload,
    payloadType: re.ContractCall,
    contractAddress: typeof t == "string" ? $s(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function AE(t) {
  return ar(t, 4, 1e5);
}
function dh(t, e, n) {
  return typeof t == "string" && (t = ar(t)), typeof e == "string" && (e = AE(e)), typeof n == "number" ? {
    type: st.Payload,
    payloadType: re.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: st.Payload,
    payloadType: re.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function vE() {
  return { type: st.Payload, payloadType: re.PoisonMicroblock };
}
function hh(t, e) {
  if (t.byteLength != Rs)
    throw Error(`Coinbase buffer size must be ${Rs} bytes`);
  return e != null ? {
    type: st.Payload,
    payloadType: re.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: st.Payload,
    payloadType: re.Coinbase,
    coinbaseBytes: t
  };
}
function kE(t, e, n) {
  if (t.byteLength != Rs)
    throw Error(`Coinbase buffer size must be ${Rs} bytes`);
  if (n.byteLength != ou)
    throw Error(`VRF proof buffer size must be ${ou} bytes`);
  return {
    type: st.Payload,
    payloadType: re.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Gt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function $E(t, e, n, r, s, i, o) {
  return {
    type: st.Payload,
    payloadType: re.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function ar(t, e, n) {
  const r = e || 1, s = n || lS;
  if (Rg(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: st.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function IE(t, e, n) {
  return {
    type: st.Asset,
    address: $s(t),
    contractName: ar(e),
    assetName: ar(n)
  };
}
function $s(t) {
  const e = pi.c32addressDecode(t);
  return {
    type: st.Address,
    version: e[0],
    hash160: e[1]
  };
}
function LE(t, e) {
  const n = $s(t), r = ar(e);
  return {
    type: st.Principal,
    prefix: yn.Contract,
    address: n,
    contractName: r
  };
}
function CE(t) {
  const e = $s(t);
  return {
    type: st.Principal,
    prefix: yn.Standard,
    address: e
  };
}
function Hi(t, e) {
  return {
    pubKeyEncoding: t,
    type: st.TransactionAuthField,
    contents: e
  };
}
function Pr(t) {
  switch (t.type) {
    case st.Address:
      return na(t);
    case st.Principal:
      return Pg(t);
    case st.LengthPrefixedString:
      return eo(t);
    case st.MemoString:
      return BE(t);
    case st.Asset:
      return Ug(t);
    case st.PostCondition:
      return Og(t);
    case st.PublicKey:
      return yu(t);
    case st.LengthPrefixedList:
      return kf(t);
    case st.Payload:
      return Dg(t);
    case st.TransactionAuthField:
      return UE(t);
    case st.MessageSignature:
      return $f(t);
  }
}
function na(t) {
  const e = [];
  return e.push(Wt(Xo(t.version, 1))), e.push(Wt(t.hash160)), Ne(e);
}
function to(t) {
  const e = kn(t, fe) ? t : new fe(t), n = Bc(wt(e.readBytes(1))), r = wt(e.readBytes(20));
  return { type: st.Address, version: n, hash160: r };
}
function Pg(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === yn.Standard || t.prefix === yn.Contract) && e.push(na(t.address)), t.prefix === yn.Contract && e.push(eo(t.contractName)), Ne(e);
}
function TE(t) {
  const e = kn(t, fe) ? t : new fe(t), n = e.readUInt8Enum(yn, (i) => {
    throw new pn(`Unexpected Principal payload type: ${i}`);
  });
  if (n === yn.Origin)
    return { type: st.Principal, prefix: n };
  const r = to(e);
  if (n === yn.Standard)
    return { type: st.Principal, prefix: n, address: r };
  const s = Zn(e);
  return {
    type: st.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function eo(t) {
  const e = [], n = ui(t.content), r = n.byteLength;
  return e.push(Wt(Xo(r, t.lengthPrefixBytes))), e.push(n), Ne(e);
}
function Zn(t, e, n) {
  e = e || 1;
  const r = kn(t, fe) ? t : new fe(t), s = Bc(wt(r.readBytes(e))), i = Zo(r.readBytes(s));
  return ar(i, e, n ?? 128);
}
function BE(t) {
  const e = [], n = ui(t.content), r = iA(wt(n), dc * 2);
  return e.push(Wt(r)), Ne(e);
}
function _g(t) {
  const e = kn(t, fe) ? t : new fe(t);
  let n = Zo(e.readBytes(dc));
  return n = n.replace(/\u0000*$/, ""), { type: st.MemoString, content: n };
}
function Ug(t) {
  const e = [];
  return e.push(na(t.address)), e.push(eo(t.contractName)), e.push(eo(t.assetName)), Ne(e);
}
function pu(t) {
  const e = kn(t, fe) ? t : new fe(t);
  return {
    type: st.Asset,
    address: to(e),
    contractName: Zn(e),
    assetName: Zn(e)
  };
}
function kf(t) {
  const e = t.values, n = [];
  n.push(Wt(Xo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Pr(r));
  return Ne(n);
}
function Hg(t, e, n) {
  const r = kn(t, fe) ? t : new fe(t), s = Bc(wt(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case st.Address:
        i.push(to(r));
        break;
      case st.LengthPrefixedString:
        i.push(Zn(r));
        break;
      case st.MemoString:
        i.push(_g(r));
        break;
      case st.Asset:
        i.push(pu(r));
        break;
      case st.PostCondition:
        i.push(NE(r));
        break;
      case st.PublicKey:
        i.push(wu(r));
        break;
      case st.TransactionAuthField:
        i.push(_E(r));
        break;
    }
  return vf(i, n);
}
function ME(t) {
  return wt(Og(t));
}
function Og(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Pg(t.principal)), (t.conditionType === be.Fungible || t.conditionType === be.NonFungible) && e.push(Ug(t.asset)), t.conditionType === be.NonFungible && e.push(xr(t.assetName)), e.push(t.conditionCode), t.conditionType === be.STX || t.conditionType === be.Fungible || t.conditionType === be.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ui("The post-condition amount may not be larger than 8 bytes");
    e.push(vs(t.amount, 8));
  }
  return Ne(e);
}
function NE(t) {
  const e = kn(t, fe) ? t : new fe(t), n = e.readUInt8Enum(be, (a) => {
    throw new pn(`Could not read ${a} as PostConditionType`);
  }), r = TE(e);
  let s, i, o;
  switch (n) {
    case be.STX:
      return s = e.readUInt8Enum(_o, (c) => {
        throw new pn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${wt(e.readBytes(8))}`), {
        type: st.PostCondition,
        conditionType: be.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case be.Fungible:
      return i = pu(e), s = e.readUInt8Enum(_o, (c) => {
        throw new pn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${wt(e.readBytes(8))}`), {
        type: st.PostCondition,
        conditionType: be.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case be.NonFungible:
      i = pu(e);
      const a = wr(e);
      return s = e.readUInt8Enum(cu, (c) => {
        throw new pn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: st.PostCondition,
        conditionType: be.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case be.Staking:
      return s = e.readUInt8Enum(_o, (c) => {
        throw new pn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${wt(e.readBytes(8))}`), {
        type: st.PostCondition,
        conditionType: be.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case be.PoX: {
      const c = e.readUInt8Enum(lu, (u) => {
        throw new pn(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: st.PostCondition,
        conditionType: be.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function Dg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case re.TokenTransfer:
      e.push(xr(t.recipient)), e.push(vs(t.amount, 8)), e.push(Pr(t.memo));
      break;
    case re.ContractCall:
      e.push(Pr(t.contractAddress)), e.push(Pr(t.contractName)), e.push(Pr(t.functionName));
      const n = new Uint8Array(4);
      qs(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(xr(r));
      });
      break;
    case re.SmartContract:
      e.push(Pr(t.contractName)), e.push(Pr(t.codeBody));
      break;
    case re.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Pr(t.contractName)), e.push(Pr(t.codeBody));
      break;
    case re.PoisonMicroblock:
      break;
    case re.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case re.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(xr(t.recipient));
      break;
    case re.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(xr(t.recipient ? Ng(t.recipient) : Mg())), e.push(t.vrfProof);
      break;
    case re.TenureChange:
      e.push(Wt(t.tenureHash)), e.push(Wt(t.previousTenureHash)), e.push(Wt(t.burnViewHash)), e.push(Wt(t.previousTenureEnd)), e.push(qs(new Uint8Array(4), t.previousTenureBlocks)), e.push(Tb(new Uint8Array(1), t.cause)), e.push(Wt(t.publicKeyHash));
      break;
  }
  return Ne(e);
}
function PE(t) {
  const e = kn(t, fe) ? t : new fe(t);
  switch (e.readUInt8Enum(re, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case re.TokenTransfer:
      const r = wr(e), s = cn(e.readBytes(8)), i = _g(e);
      return SE(r, s, i);
    case re.ContractCall:
      const o = to(e), a = Zn(e), c = Zn(e), u = [], d = e.readUInt32BE();
      for (let U = 0; U < d; U++) {
        const M = wr(e);
        u.push(M);
      }
      return EE(o, a, c, u);
    case re.SmartContract:
      const l = Zn(e), w = Zn(e, 4, 1e5);
      return dh(l, w);
    case re.VersionedSmartContract: {
      const U = e.readUInt8Enum(au, (tt) => {
        throw new Error(`Cannot recognize ClarityVersion: ${tt}`);
      }), M = Zn(e), Q = Zn(e, 4, xS);
      return dh(M, Q, U);
    }
    case re.PoisonMicroblock:
      return vE();
    case re.Coinbase: {
      const U = e.readBytes(Rs);
      return hh(U);
    }
    case re.CoinbaseToAltRecipient: {
      const U = e.readBytes(Rs), M = wr(e);
      return hh(U, M);
    }
    case re.NakamotoCoinbase: {
      const U = e.readBytes(Rs), M = wr(e), Q = e.readBytes(ou);
      return kE(U, M, Q);
    }
    case re.TenureChange:
      const p = wt(e.readBytes(20)), x = wt(e.readBytes(20)), S = wt(e.readBytes(20)), B = wt(e.readBytes(32)), G = e.readUInt32BE(), j = e.readUInt8Enum(uu, (U) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${U}`);
      }), v = wt(e.readBytes(20));
      return $E(p, x, S, B, G, j, v);
  }
}
function gu(t) {
  const e = kn(t, fe) ? t : new fe(t);
  return hu(wt(e.readBytes(Gc)));
}
function _E(t) {
  const e = kn(t, fe) ? t : new fe(t), n = e.readUInt8Enum(sr, (r) => {
    throw new pn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case sr.PublicKeyCompressed:
      return Hi(ve.Compressed, wu(e));
    case sr.PublicKeyUncompressed:
      return Hi(ve.Uncompressed, lo(yA(wu(e).data)));
    case sr.SignatureCompressed:
      return Hi(ve.Compressed, gu(e));
    case sr.SignatureUncompressed:
      return Hi(ve.Uncompressed, gu(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function $f(t) {
  return Wt(t.data);
}
function UE(t) {
  const e = [];
  switch (t.contents.type) {
    case st.PublicKey:
      e.push(t.pubKeyEncoding === ve.Compressed ? sr.PublicKeyCompressed : sr.PublicKeyUncompressed), e.push(Wt(gA(t.contents.data)));
      break;
    case st.MessageSignature:
      e.push(t.pubKeyEncoding === ve.Compressed ? sr.SignatureCompressed : sr.SignatureUncompressed), e.push($f(t.contents));
      break;
  }
  return Ne(e);
}
function yu(t) {
  return t.data.slice();
}
function wu(t) {
  const e = kn(t, fe) ? t : new fe(t), n = e.readUInt8(), r = n === 4 ? dS : fS;
  return lo(Ne([n, e.readBytes(r)]));
}
function If(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === le.P2PKH || e === le.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === le.P2WPKH || e === le.P2WSH || e === le.P2WSHNonSequential) && !r.map((s) => s.data).every(uo))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case le.P2PKH:
      return $a(t, oA(r[0].data));
    case le.P2WPKH:
      return $a(t, aA(r[0].data));
    case le.P2SH:
    case le.P2SHNonSequential:
      return $a(t, cA(n, r.map(yu)));
    case le.P2WSH:
    case le.P2WSHNonSequential:
      return $a(t, lA(n, r.map(yu)));
  }
}
function $a(t, e) {
  return { type: st.Address, version: t, hash160: e };
}
function Lf(t) {
  return pi.c32address(t.version, t.hash160);
}
function ph(t) {
  const [e, n, r] = t.split(/\.|::/);
  return IE(e, n, r);
}
function ko(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return LE(e, n);
  } else
    return CE(t);
}
function HE(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return FE(e, n);
  } else
    return OE(t);
}
function OE(t) {
  const e = $s(t);
  return { type: Gt.PrincipalStandard, value: Lf(e) };
}
function DE(t) {
  return { type: Gt.PrincipalStandard, value: Lf(t) };
}
function FE(t, e) {
  const n = $s(t), r = ar(e);
  return Fg(n, r);
}
function Fg(t, e) {
  if (ui(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Gt.PrincipalContract,
    value: `${Lf(t)}.${e.content}`
  };
}
function jE(t) {
  return { type: Gt.ResponseErr, value: t };
}
function RE(t) {
  return { type: Gt.ResponseOk, value: t };
}
const zE = (t) => ({ type: Gt.StringASCII, value: t }), GE = (t) => ({ type: Gt.StringUTF8, value: t });
function KE(t) {
  for (const e in t)
    if (!uA(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Gt.Tuple, value: t };
}
function wr(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new fe(Wt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new fe(t) : e = t;
  switch (e.readUInt8Enum(Re, (r) => {
    throw new pn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Re.int:
      return wE(Gl(e.readBytes(16)));
    case Re.uint:
      return bE(e.readBytes(16));
    case Re.buffer:
      const r = e.readUInt32BE();
      return gE(e.readBytes(r));
    case Re.true:
      return hE();
    case Re.false:
      return pE();
    case Re.address:
      const s = to(e);
      return DE(s);
    case Re.contract:
      const i = to(e), o = Zn(e);
      return Fg(i, o);
    case Re.ok:
      return RE(wr(e));
    case Re.err:
      return jE(wr(e));
    case Re.none:
      return Mg();
    case Re.some:
      return Ng(wr(e));
    case Re.list:
      const a = e.readUInt32BE(), c = [];
      for (let S = 0; S < a; S++)
        c.push(wr(e));
      return mE(c);
    case Re.tuple:
      const u = e.readUInt32BE(), d = {};
      for (let S = 0; S < u; S++) {
        const B = Zn(e).content;
        if (B === void 0)
          throw new pn('"content" is undefined');
        d[B] = wr(e);
      }
      return KE(d);
    case Re.ascii:
      const l = e.readUInt32BE(), w = Eb(e.readBytes(l));
      return zE(w);
    case Re.utf8:
      const p = e.readUInt32BE(), x = Zo(e.readBytes(p));
      return GE(x);
    default:
      throw new pn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function kr(t, e) {
  return Ne([Af(t), e]);
}
function VE(t) {
  return new Uint8Array([Af(t.type)]);
}
function qE(t) {
  return t.type === Gt.OptionalNone ? new Uint8Array([Af(t.type)]) : kr(t.type, xr(t.value));
}
function WE(t) {
  const e = new Uint8Array(4);
  return qs(e, Math.ceil(t.value.length / 2), 0), kr(t.type, Ar(e, Wt(t.value)));
}
function YE(t) {
  const e = Zu(wb(BigInt(t.value), BigInt(uS)), Ag);
  return kr(t.type, e);
}
function XE(t) {
  const e = Zu(BigInt(t.value), Ag);
  return kr(t.type, e);
}
function ZE(t) {
  return kr(t.type, na($s(t.value)));
}
function QE(t) {
  const [e, n] = fA(t.value);
  return kr(t.type, Ar(na($s(e)), eo(ar(n))));
}
function JE(t) {
  return kr(t.type, xr(t.value));
}
function tA(t) {
  const e = [], n = new Uint8Array(4);
  qs(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = xr(r);
    e.push(s);
  }
  return kr(t.type, Ne(e));
}
function eA(t) {
  const e = [], n = new Uint8Array(4);
  qs(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = ar(s);
    e.push(eo(i));
    const o = xr(t.value[s]);
    e.push(o);
  }
  return kr(t.type, Ne(e));
}
function jg(t, e) {
  const n = [], r = e == "ascii" ? Sb(t.value) : ui(t.value), s = new Uint8Array(4);
  return qs(s, r.length, 0), n.push(s), n.push(r), kr(t.type, Ne(n));
}
function nA(t) {
  return jg(t, "ascii");
}
function rA(t) {
  return jg(t, "utf8");
}
function gh(t) {
  return wt(xr(t));
}
function xr(t) {
  switch (t.type) {
    case Gt.BoolTrue:
    case Gt.BoolFalse:
      return VE(t);
    case Gt.OptionalNone:
    case Gt.OptionalSome:
      return qE(t);
    case Gt.Buffer:
      return WE(t);
    case Gt.UInt:
      return XE(t);
    case Gt.Int:
      return YE(t);
    case Gt.PrincipalStandard:
      return ZE(t);
    case Gt.PrincipalContract:
      return QE(t);
    case Gt.ResponseOk:
    case Gt.ResponseErr:
      return JE(t);
    case Gt.List:
      return tA(t);
    case Gt.Tuple:
      return eA(t);
    case Gt.StringASCII:
      return nA(t);
    case Gt.StringUTF8:
      return rA(t);
    default:
      throw new Ui("Unable to serialize. Invalid Clarity Value.");
  }
}
const sA = (t) => t.length % 2 ? `0${t}` : t, iA = (t, e) => t.padEnd(e, "0"), Rg = (t, e) => t ? ui(t).length > e : !1;
function bu(t) {
  return mg(t);
}
const Fo = (t) => DS(xf(t)), Cf = (t) => wt(dE(t)), oA = (t) => wt(Fo(t)), aA = (t) => {
  const e = Fo(t), n = Ar(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Fo(n);
  return wt(r);
}, cA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Ne(n), s = Fo(r);
  return wt(s);
}, lA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ne(n), s = xf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Ne(i), a = Fo(o);
  return wt(a);
};
function uA(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function fA(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Te.hmacSha256Sync = (t, ...e) => {
  const n = Ig.create(xf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function lo(t) {
  return t = typeof t == "string" ? Wt(t) : t, {
    type: st.PublicKey,
    data: t
  };
}
function dA(t, e, n = ve.Compressed) {
  const r = $b(e), s = new Dn(gd(r.r), gd(r.s)), i = Dt.fromSignature(t, s, r.recoveryId), o = n === ve.Compressed;
  return i.toHex(o);
}
function hA(t) {
  return typeof t == "string" ? t : wt(t);
}
const Tf = hA;
function zg(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === kb;
}
function uo(t) {
  return !Tf(t).startsWith("04");
}
function pA(t) {
  t = Qu(t);
  const e = zg(t);
  return wt(Qo(t.slice(0, 32), e));
}
function gA(t) {
  return Dt.fromHex(Tf(t)).toHex(!0);
}
function yA(t) {
  return Dt.fromHex(Tf(t)).toHex(!1);
}
function wA(t, e) {
  t = Qu(t);
  const [n, r] = Nc(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Xo(r, 1) + Dn.fromHex(n).toCompactHex();
}
function Bf() {
  return {
    type: st.MessageSignature,
    data: wt(new Uint8Array(Gc))
  };
}
function Gg(t, e, n, r) {
  const s = If(0, t, 1, [lo(e)]).hash160, i = uo(e) ? ve.Compressed : ve.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: cn(n),
    fee: cn(r),
    keyEncoding: i,
    signature: Bf()
  };
}
function jo(t) {
  return "signature" in t;
}
function yh(t) {
  return t === le.P2SH || t === le.P2WSH;
}
function bA(t) {
  return t === le.P2SHNonSequential || t === le.P2WSHNonSequential;
}
function wh(t) {
  const e = bu(t);
  return e.nonce = 0, e.fee = 0, jo(e) ? e.signature = Bf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function mA(t) {
  const e = [
    t.hashMode,
    Wt(t.signer),
    vs(t.nonce, 8),
    vs(t.fee, 8),
    t.keyEncoding,
    $f(t.signature)
  ];
  return Ne(e);
}
function xA(t) {
  const e = [
    t.hashMode,
    Wt(t.signer),
    vs(t.nonce, 8),
    vs(t.fee, 8)
  ], n = vf(t.fields);
  e.push(kf(n));
  const r = new Uint8Array(2);
  return Lb(r, t.signaturesRequired, 0), e.push(r), Ne(e);
}
function SA(t, e) {
  const n = wt(e.readBytes(20)), r = BigInt(`0x${wt(e.readBytes(8))}`), s = BigInt(`0x${wt(e.readBytes(8))}`), i = e.readUInt8Enum(ve, (a) => {
    throw new pn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === le.P2WPKH && i != ve.Compressed)
    throw new pn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = gu(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function EA(t, e) {
  const n = wt(e.readBytes(20)), r = BigInt("0x" + wt(e.readBytes(8))), s = BigInt("0x" + wt(e.readBytes(8))), i = Hg(e, st.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case st.PublicKey:
        uo(u.contents.data) || (o = !0);
        break;
      case st.MessageSignature:
        if (u.pubKeyEncoding === ve.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Hs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === le.P2WSH || t === le.P2WSHNonSequential))
    throw new Hs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function wl(t) {
  return jo(t) ? mA(t) : xA(t);
}
function bl(t) {
  const e = t.readUInt8Enum(le, (n) => {
    throw new pn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === le.P2PKH || e === le.P2WPKH ? SA(e, t) : EA(e, t);
}
function Kg(t, e, n, r) {
  const i = t + wt(new Uint8Array([e])) + wt(vs(n, 8)) + wt(vs(r, 8));
  if (Wt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Cf(Wt(i));
}
function Vg(t, e, n) {
  const r = 33 + Gc, s = uo(e.data) ? ve.Compressed : ve.Uncompressed, i = t + sA(s.toString(16)) + n, o = Wt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Cf(o);
}
function AA(t, e, n, r, s) {
  const i = Kg(t, e, n, r), o = wA(s, i), a = lo(pA(s)), c = Vg(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function qg(t, e, n, r, s, i) {
  const o = Kg(t, e, n, r), a = lo(dA(o, i, s)), c = Vg(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function vA() {
  const t = Gg(le.P2PKH, "", 0, 0);
  return t.signer = xE().hash160, t.keyEncoding = ve.Compressed, t.signature = Bf(), t;
}
function bh(t, e, n) {
  return jo(t) ? kA(t, e, n) : $A(t, e, n);
}
function kA(t, e, n) {
  const { pubKey: r, nextSigHash: s } = qg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = If(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Hs(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function $A(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case st.PublicKey:
        uo(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case st.MessageSignature:
        c.pubKeyEncoding === ve.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = qg(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (yh(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new Hs("Too many signatures");
        break;
    }
  if (yh(t.hashMode) && o !== t.signaturesRequired || bA(t.hashMode) && o < t.signaturesRequired)
    throw new Hs("Incorrect number of signatures");
  if (i && (t.hashMode === le.P2WSH || t.hashMode === le.P2WSHNonSequential))
    throw new Hs("Uncompressed keys are not allowed in this hash mode");
  const a = If(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Hs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Wg(t) {
  return {
    authType: Le.Standard,
    spendingCondition: t
  };
}
function Yg(t, e) {
  return {
    authType: Le.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Gg(le.P2PKH, "0".repeat(66), 0, 0)
  };
}
function mh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Le.Standard:
        return Wg(wh(t.spendingCondition));
      case Le.Sponsored:
        return Yg(wh(t.spendingCondition), vA());
      default:
        throw new pc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function IA(t, e) {
  switch (t.authType) {
    case Le.Standard:
      return bh(t.spendingCondition, e, Le.Standard);
    case Le.Sponsored:
      return bh(t.spendingCondition, e, Le.Standard);
    default:
      throw new pc("Invalid origin auth type");
  }
}
function LA(t, e) {
  switch (t.authType) {
    case Le.Standard:
      const n = {
        ...t.spendingCondition,
        fee: cn(e)
      };
      return { ...t, spendingCondition: n };
    case Le.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: cn(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function CA(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: cn(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function TA(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: cn(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function BA(t, e) {
  const n = {
    ...e,
    nonce: cn(e.nonce),
    fee: cn(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function MA(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Le.Standard:
      e.push(wl(t.spendingCondition));
      break;
    case Le.Sponsored:
      e.push(wl(t.spendingCondition)), e.push(wl(t.sponsorSpendingCondition));
      break;
  }
  return Ne(e);
}
function NA(t) {
  const e = t.readUInt8Enum(Le, (r) => {
    throw new pn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Le.Standard:
      return n = bl(t), Wg(n);
    case Le.Sponsored:
      n = bl(t);
      const r = bl(t);
      return Yg(n, r);
  }
}
class PA {
  constructor({ auth: e, payload: n, postConditions: r = vf([]), postConditionMode: s = hc.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = aS(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: cn(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Pn.Any;
  }
  signBegin() {
    const e = bu(this);
    return e.auth = mh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = bu(this);
    return e.auth = mh(e.auth), e.txid();
  }
  verifyOrigin() {
    return IA(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Le.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Le.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Le.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : lo(e), r = this.auth.spendingCondition;
    if (r && !jo(r)) {
      const s = uo(n.data);
      r.fields.push(Hi(s ? ve.Compressed : ve.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = AA(n, r, e.fee, e.nonce, s);
    if (jo(e))
      e.signature = hu(i);
    else {
      const a = zg(s);
      e.fields.push(Hi(a ? ve.Compressed : ve.Uncompressed, hu(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return Cf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Le.Sponsored)
      throw new pc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = BA(this.auth, e);
  }
  setFee(e) {
    this.auth = LA(this.auth, e);
  }
  setNonce(e) {
    this.auth = CA(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Le.Sponsored)
      throw new pc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = TA(this.auth, e);
  }
  serialize() {
    return wt(this.serializeBytes());
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
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return qs(n, this.chainId, 0), e.push(n), e.push(MA(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(kf(this.postConditions)), e.push(Dg(this.payload)), Ne(e);
  }
}
function _A(t) {
  const e = kn(t, fe) ? t : new fe(t), n = e.readUInt8Enum(ni, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = NA(e), i = e.readUInt8Enum(Pn, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(hc, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = Hg(e, st.PostCondition), c = PE(e), u = new PA({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const xh = BigInt("18446744073709551615");
function ml(t) {
  const e = cn(t);
  if (e < 0n || e > xh)
    throw new RangeError(`Post-condition amount must be between 0 and ${xh} (u64 max), received: ${e}`);
  return e;
}
var mu;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(mu || (mu = {}));
var xu;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(xu || (xu = {}));
function UA(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: st.PostCondition,
        conditionType: be.STX,
        principal: t.address === "origin" ? { type: st.Principal, prefix: yn.Origin } : ko(t.address),
        conditionCode: Ia(t.condition),
        amount: ml(t.amount)
      };
    case "ft-postcondition":
      return {
        type: st.PostCondition,
        conditionType: be.Fungible,
        principal: t.address === "origin" ? { type: st.Principal, prefix: yn.Origin } : ko(t.address),
        conditionCode: Ia(t.condition),
        amount: ml(t.amount),
        asset: ph(t.asset)
      };
    case "nft-postcondition":
      return {
        type: st.PostCondition,
        conditionType: be.NonFungible,
        principal: t.address === "origin" ? { type: st.Principal, prefix: yn.Origin } : ko(t.address),
        conditionCode: Ia(t.condition),
        asset: ph(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: st.PostCondition,
        conditionType: be.Staking,
        principal: t.address === "origin" ? { type: st.Principal, prefix: yn.Origin } : ko(t.address),
        conditionCode: Ia(t.condition),
        amount: ml(t.amount)
      };
    case "pox-postcondition":
      return {
        type: st.PostCondition,
        conditionType: be.PoX,
        principal: t.address === "origin" ? { type: st.Principal, prefix: yn.Origin } : ko(t.address),
        conditionCode: HA(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Ia(t) {
  return mu[t];
}
function HA(t) {
  return xu[t];
}
function Xg(t) {
  const e = UA(t);
  return ME(e);
}
function OA(t, e, n) {
  return Nf(Zg(t), n);
}
function Zg(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Ro(r);
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
    return BigInt(`0x${jA(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Mf(t, e = 8) {
  return (typeof t == "bigint" ? t : Zg(t)).toString(16).padStart(e * 2, "0");
}
function Nf(t, e = 16) {
  const n = Mf(t, e);
  return Ro(n);
}
function DA(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const FA = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function jA(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += FA[n];
  return e;
}
function Ro(t) {
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
function Pf(t) {
  return new TextEncoder().encode(t);
}
function RA(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function zA(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Sh(t) {
  if (t.some(zA))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function _f(...t) {
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
function Rr(t) {
  return _f(...t.map((e) => typeof e == "number" ? Sh([e]) : e instanceof Array ? Sh(e) : e));
}
function qc(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Su;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Su || (Su = {}));
Su.Mainnet;
const GA = 128, KA = 128, Qg = 16;
var Eu;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Eu || (Eu = {}));
var Eh;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Eh || (Eh = {}));
var Ah;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Ah || (Ah = {}));
var rr;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(rr || (rr = {}));
const xl = ["onChainOnly", "offChainOnly", "any"];
xl[0] + "", rr.OnChainOnly, xl[1] + "", rr.OffChainOnly, xl[2] + "", rr.Any, rr.OnChainOnly + "", rr.OnChainOnly, rr.OffChainOnly + "", rr.OffChainOnly, rr.Any + "", rr.Any;
var Au;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Au || (Au = {}));
Au.Mainnet;
var vh;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(vh || (vh = {}));
var Ns;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ns || (Ns = {}));
var kh;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(kh || (kh = {}));
var $h;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})($h || ($h = {}));
var Ih;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ih || (Ih = {}));
var Lh;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Lh || (Lh = {}));
var Ch;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ch || (Ch = {}));
var Th;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Th || (Th = {}));
var vu;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(vu || (vu = {}));
var Bh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Bh || (Bh = {}));
var Mh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Mh || (Mh = {}));
function ku(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function VA(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Jg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function qA(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ku(t.outputLen), ku(t.blockLen);
}
function WA(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function YA(t, e) {
  Jg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Sl = {
  number: ku,
  bool: VA,
  bytes: Jg,
  hash: qA,
  exists: WA,
  output: YA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const El = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), hr = (t, e) => t << 32 - e | t >>> e, XA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!XA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ZA(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function ty(t) {
  if (typeof t == "string" && (t = ZA(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let QA = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function yi(t) {
  const e = (r) => t().update(ty(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function JA(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Uf = class extends QA {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = El(this.buffer);
  }
  update(e) {
    Sl.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = ty(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = El(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Sl.exists(this), Sl.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    JA(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = El(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
const t3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ey = Uint8Array.from({ length: 16 }, (t, e) => e), e3 = ey.map((t) => (9 * t + 5) % 16);
let Hf = [ey], Of = [e3];
for (let t = 0; t < 4; t++)
  for (let e of [Hf, Of])
    e.push(e[t].map((n) => t3[n]));
const ny = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), n3 = Hf.map((t, e) => t.map((n) => ny[e][n])), r3 = Of.map((t, e) => t.map((n) => ny[e][n])), s3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), i3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), La = (t, e) => t << e | t >>> 32 - e;
function Nh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ca = new Uint32Array(16);
let o3 = class extends Uf {
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
      Ca[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, w = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, S = s3[p], B = i3[p], G = Hf[p], j = Of[p], v = n3[p], U = r3[p];
      for (let M = 0; M < 16; M++) {
        const Q = La(r + Nh(p, i, a, u) + Ca[G[M]] + S, v[M]) + l | 0;
        r = l, l = u, u = La(a, 10) | 0, a = i, i = Q;
      }
      for (let M = 0; M < 16; M++) {
        const Q = La(s + Nh(x, o, c, d) + Ca[j[M]] + B, U[M]) + w | 0;
        s = w, w = d, d = La(c, 10) | 0, c = o, o = Q;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + w | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ca.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
yi(() => new o3());
const a3 = (t, e, n) => t & e ^ ~t & n, c3 = (t, e, n) => t & e ^ t & n ^ e & n, l3 = new Uint32Array([
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
let ry = class extends Uf {
  constructor() {
    super(64, 32, 8, !1), this.A = cs[0] | 0, this.B = cs[1] | 0, this.C = cs[2] | 0, this.D = cs[3] | 0, this.E = cs[4] | 0, this.F = cs[5] | 0, this.G = cs[6] | 0, this.H = cs[7] | 0;
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
      ls[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const w = ls[l - 15], p = ls[l - 2], x = hr(w, 7) ^ hr(w, 18) ^ w >>> 3, S = hr(p, 17) ^ hr(p, 19) ^ p >>> 10;
      ls[l] = S + ls[l - 7] + x + ls[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const w = hr(a, 6) ^ hr(a, 11) ^ hr(a, 25), p = d + w + a3(a, c, u) + l3[l] + ls[l] | 0, S = (hr(r, 2) ^ hr(r, 13) ^ hr(r, 22)) + c3(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    ls.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, u3 = class extends ry {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
yi(() => new ry());
yi(() => new u3());
const Ta = BigInt(2 ** 32 - 1), $u = BigInt(32);
function sy(t, e = !1) {
  return e ? { h: Number(t & Ta), l: Number(t >> $u & Ta) } : { h: Number(t >> $u & Ta) | 0, l: Number(t & Ta) | 0 };
}
function f3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = sy(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const d3 = (t, e) => BigInt(t >>> 0) << $u | BigInt(e >>> 0), h3 = (t, e, n) => t >>> n, p3 = (t, e, n) => t << 32 - n | e >>> n, g3 = (t, e, n) => t >>> n | e << 32 - n, y3 = (t, e, n) => t << 32 - n | e >>> n, w3 = (t, e, n) => t << 64 - n | e >>> n - 32, b3 = (t, e, n) => t >>> n - 32 | e << 64 - n, m3 = (t, e) => e, x3 = (t, e) => t, S3 = (t, e, n) => t << n | e >>> 32 - n, E3 = (t, e, n) => e << n | t >>> 32 - n, A3 = (t, e, n) => e << n - 32 | t >>> 64 - n, v3 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function k3(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const $3 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), I3 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, L3 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), C3 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, T3 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), B3 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, _t = {
  fromBig: sy,
  split: f3,
  toBig: d3,
  shrSH: h3,
  shrSL: p3,
  rotrSH: g3,
  rotrSL: y3,
  rotrBH: w3,
  rotrBL: b3,
  rotr32H: m3,
  rotr32L: x3,
  rotlSH: S3,
  rotlSL: E3,
  rotlBH: A3,
  rotlBL: v3,
  add: k3,
  add3L: $3,
  add3H: I3,
  add4L: L3,
  add4H: C3,
  add5H: B3,
  add5L: T3
}, [M3, N3] = _t.split([
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
].map((t) => BigInt(t))), us = new Uint32Array(80), fs = new Uint32Array(80);
let Wc = class extends Uf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: w, Gh: p, Gl: x, Hh: S, Hl: B } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, w, p, x, S, B];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, w, p, x, S, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = w | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let v = 0; v < 16; v++, n += 4)
      us[v] = e.getUint32(n), fs[v] = e.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const U = us[v - 15] | 0, M = fs[v - 15] | 0, Q = _t.rotrSH(U, M, 1) ^ _t.rotrSH(U, M, 8) ^ _t.shrSH(U, M, 7), tt = _t.rotrSL(U, M, 1) ^ _t.rotrSL(U, M, 8) ^ _t.shrSL(U, M, 7), K = us[v - 2] | 0, q = fs[v - 2] | 0, I = _t.rotrSH(K, q, 19) ^ _t.rotrBH(K, q, 61) ^ _t.shrSH(K, q, 6), P = _t.rotrSL(K, q, 19) ^ _t.rotrBL(K, q, 61) ^ _t.shrSL(K, q, 6), b = _t.add4L(tt, P, fs[v - 7], fs[v - 16]), L = _t.add4H(b, Q, I, us[v - 7], us[v - 16]);
      us[v] = L | 0, fs[v] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: w, Fh: p, Fl: x, Gh: S, Gl: B, Hh: G, Hl: j } = this;
    for (let v = 0; v < 80; v++) {
      const U = _t.rotrSH(l, w, 14) ^ _t.rotrSH(l, w, 18) ^ _t.rotrBH(l, w, 41), M = _t.rotrSL(l, w, 14) ^ _t.rotrSL(l, w, 18) ^ _t.rotrBL(l, w, 41), Q = l & p ^ ~l & S, tt = w & x ^ ~w & B, K = _t.add5L(j, M, tt, N3[v], fs[v]), q = _t.add5H(K, G, U, Q, M3[v], us[v]), I = K | 0, P = _t.rotrSH(r, s, 28) ^ _t.rotrBH(r, s, 34) ^ _t.rotrBH(r, s, 39), b = _t.rotrSL(r, s, 28) ^ _t.rotrBL(r, s, 34) ^ _t.rotrBL(r, s, 39), L = r & i ^ r & a ^ i & a, D = s & o ^ s & c ^ o & c;
      G = S | 0, j = B | 0, S = p | 0, B = x | 0, p = l | 0, x = w | 0, { h: l, l: w } = _t.add(u | 0, d | 0, q | 0, I | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const C = _t.add3L(I, b, D);
      r = _t.add3H(C, q, P, L), s = C | 0;
    }
    ({ h: r, l: s } = _t.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = _t.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = _t.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = _t.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: w } = _t.add(this.Eh | 0, this.El | 0, l | 0, w | 0), { h: p, l: x } = _t.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: B } = _t.add(this.Gh | 0, this.Gl | 0, S | 0, B | 0), { h: G, l: j } = _t.add(this.Hh | 0, this.Hl | 0, G | 0, j | 0), this.set(r, s, i, o, a, c, u, d, l, w, p, x, S, B, G, j);
  }
  roundClean() {
    us.fill(0), fs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, P3 = class extends Wc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, _3 = class extends Wc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, U3 = class extends Wc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
yi(() => new Wc());
yi(() => new P3());
yi(() => new _3());
yi(() => new U3());
function H3(t, e, n) {
  const s = GA;
  if (J3(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Eu.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var qe;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(qe || (qe = {}));
let O3 = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, iy = class extends O3 {
  constructor(e) {
    super(e);
  }
};
function Yc(t) {
  const e = [];
  return e.push(Ro(Mf(t.version, 1))), e.push(Ro(t.hash160)), Rr(e);
}
function D3(t) {
  const e = [];
  return e.push(t.prefix), e.push(Yc(t.address)), t.prefix === vu.Contract && e.push(zo(t.contractName)), Rr(e);
}
function zo(t) {
  const e = [], n = Pf(t.content), r = n.byteLength;
  return e.push(Ro(Mf(r, t.lengthPrefixBytes))), e.push(n), Rr(e);
}
function F3(t) {
  const e = [];
  return e.push(Yc(t.address)), e.push(zo(t.contractName)), e.push(zo(t.assetName)), Rr(e);
}
function oy(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(D3(t.principal)), (t.conditionType === Ns.Fungible || t.conditionType === Ns.NonFungible) && e.push(F3(t.assetInfo)), t.conditionType === Ns.NonFungible && e.push(si(t.assetName)), e.push(t.conditionCode), t.conditionType === Ns.STX || t.conditionType === Ns.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new iy("The post-condition amount may not be larger than 8 bytes");
    e.push(OA(t.amount, !1, 8));
  }
  return Rr(e);
}
function $r(t, e) {
  return Rr([t, e]);
}
function j3(t) {
  return new Uint8Array([t.type]);
}
function R3(t) {
  return t.type === qe.OptionalNone ? new Uint8Array([t.type]) : $r(t.type, si(t.value));
}
function z3(t) {
  const e = new Uint8Array(4);
  return qc(e, t.buffer.length, 0), $r(t.type, _f(e, t.buffer));
}
function G3(t) {
  const e = Nf(DA(t.value, BigInt(KA)), Qg);
  return $r(t.type, e);
}
function K3(t) {
  const e = Nf(t.value, Qg);
  return $r(t.type, e);
}
function V3(t) {
  return $r(t.type, Yc(t.address));
}
function q3(t) {
  return $r(t.type, _f(Yc(t.address), zo(t.contractName)));
}
function W3(t) {
  return $r(t.type, si(t.value));
}
function Y3(t) {
  const e = [], n = new Uint8Array(4);
  qc(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = si(r);
    e.push(s);
  }
  return $r(t.type, Rr(e));
}
function X3(t) {
  const e = [], n = new Uint8Array(4);
  qc(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = H3(s);
    e.push(zo(i));
    const o = si(t.data[s]);
    e.push(o);
  }
  return $r(t.type, Rr(e));
}
function ay(t, e) {
  const n = [], r = e == "ascii" ? RA(t.data) : Pf(t.data), s = new Uint8Array(4);
  return qc(s, r.length, 0), n.push(s), n.push(r), $r(t.type, Rr(n));
}
function Z3(t) {
  return ay(t, "ascii");
}
function Q3(t) {
  return ay(t, "utf8");
}
function si(t) {
  switch (t.type) {
    case qe.BoolTrue:
    case qe.BoolFalse:
      return j3(t);
    case qe.OptionalNone:
    case qe.OptionalSome:
      return R3(t);
    case qe.Buffer:
      return z3(t);
    case qe.UInt:
      return K3(t);
    case qe.Int:
      return G3(t);
    case qe.PrincipalStandard:
      return V3(t);
    case qe.PrincipalContract:
      return q3(t);
    case qe.ResponseOk:
    case qe.ResponseErr:
      return W3(t);
    case qe.List:
      return Y3(t);
    case qe.Tuple:
      return X3(t);
    case qe.StringASCII:
      return Z3(t);
    case qe.StringUTF8:
      return Q3(t);
    default:
      throw new iy("Unable to serialize. Invalid Clarity Value.");
  }
}
const J3 = (t, e) => t ? Pf(t).length > e : !1, t4 = "connect-ui";
let Ya, cy, _n = !1, Iu = !1;
const jr = (t, e = "") => () => {
}, e4 = (t, e) => () => {
}, n4 = "{visibility:hidden}.hydrated{visibility:inherit}", Ph = {}, r4 = "http://www.w3.org/2000/svg", s4 = "http://www.w3.org/1999/xhtml", i4 = (t) => t != null, Df = (t) => (t = typeof t, t === "object" || t === "function");
function ly(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Tt = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let d = 0; d < u.length; d++)
      r = u[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !Df(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Lu(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((d) => u[d]).join(" "));
  }
  const c = Lu(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Lu = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, o4 = {}, a4 = (t) => t && t.$tag$ === o4, c4 = (t, e) => t != null && !Df(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, l4 = (t) => fo(t).$hostElement$, u4 = (t, e, n) => {
  const r = an.ce(e, n);
  return t.dispatchEvent(r), r;
}, _h = /* @__PURE__ */ new WeakMap(), f4 = (t, e, n) => {
  let r = gc.get(t);
  B4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, gc.set(t, r);
}, d4 = (t, e, n, r) => {
  var s;
  let i = uy(e);
  const o = gc.get(i);
  if (t = t.nodeType === 11 ? t : Sr, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = _h.get(t), c;
      if (a || _h.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = Sr.createElement("style"), c.innerHTML = o;
          const u = (s = an.$nonce$) !== null && s !== void 0 ? s : ly(Sr);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, h4 = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = jr("attachStyles", e.$tagName$), i = d4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, uy = (t, e) => "sc-" + t.$tagName$, Uh = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = Oh(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = Hh(n), d = Hh(r);
      c.remove(...u.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : Oh(Xc, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && an.rel(t, e, n, !1), r && an.ael(t, e, r, !1);
    else {
      const c = Df(r);
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
}, p4 = /\s/, Hh = (t) => t ? t.split(p4) : [], fy = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || Ph, o = e.$attrs$ || Ph;
  for (r in i)
    r in o || Uh(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    Uh(s, r, i[r], o[r], n, e.$flags$);
}, Ff = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = Sr.createTextNode(s.$text$);
  else {
    if (_n || (_n = s.$tag$ === "svg"), o = s.$elm$ = Sr.createElementNS(_n ? r4 : s4, s.$tag$), _n && s.$tag$ === "foreignObject" && (_n = !1), fy(null, s, _n), i4(Ya) && o["s-si"] !== Ya && o.classList.add(o["s-si"] = Ya), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = Ff(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? _n = !1 : o.tagName === "foreignObject" && (_n = !0);
  }
  return o;
}, dy = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === cy && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = Ff(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, hy = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, g4 = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, d = r[0], l = r[u], w;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : d == null ? d = r[++i] : l == null ? l = r[--u] : Ba(a, d) ? (To(a, d), a = e[++s], d = r[++i]) : Ba(c, l) ? (To(c, l), c = e[--o], l = r[--u]) : Ba(a, l) ? (To(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : Ba(c, d) ? (To(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++i]) : (w = Ff(e && e[i], n, i), d = r[++i], w && a.$elm$.parentNode.insertBefore(w, a.$elm$));
  s > o ? dy(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && hy(e, s, o);
}, Ba = (t, e) => t.$tag$ === e.$tag$, To = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (_n = i === "svg" ? !0 : i === "foreignObject" ? !1 : _n, fy(t, e, _n), r !== null && s !== null ? g4(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), dy(n, null, e, s, 0, s.length - 1)) : r !== null && hy(r, 0, r.length - 1), _n && i === "svg" && (_n = !1)) : t.$text$ !== o && (n.data = o);
}, y4 = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Lu(null, null), s = a4(e) ? e : Tt(null, null, e);
  cy = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, Ya = n["s-sc"], To(r, s);
}, py = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, jf = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return py(t, t.$ancestorComponent$), N4(() => w4(t, e));
}, w4 = (t, e) => {
  const n = jr("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), S4(s, () => b4(t, r, e));
}, b4 = async (t, e, n) => {
  const r = t.$hostElement$, s = jr("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && h4(t);
  const o = jr("render", t.$cmpMeta$.$tagName$);
  m4(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => x4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, m4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, y4(t, e);
  } catch (r) {
    Go(r, t.$hostElement$);
  }
  return null;
}, x4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = jr("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, yy(n), r(), t.$onReadyResolve$(n), s || gy()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && zf(() => jf(t, !1)), t.$flags$ &= -517;
}, gy = (t) => {
  yy(Sr.documentElement), zf(() => u4(Xc, "appload", { detail: { namespace: t4 } }));
}, S4 = (t, e) => t && t.then ? t.then(e) : e(), yy = (t) => t.classList.add("hydrated"), E4 = (t, e) => fo(t).$instanceValues$.get(e), A4 = (t, e, n, r) => {
  const s = fo(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = c4(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && jf(s, !1));
}, wy = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return E4(this, i);
        },
        set(a) {
          A4(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        an.jmp(() => {
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
}, v4 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = T4(n), s.then) {
        const c = e4();
        s = await s, c();
      }
      s.isProxied || (wy(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = jr("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        Go(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = uy(n);
      if (!gc.has(c)) {
        const u = jr("registerStyles", n.$tagName$);
        f4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => jf(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, k4 = (t) => {
  if (!(an.$flags$ & 1)) {
    const e = fo(t), n = e.$cmpMeta$, r = jr("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            py(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), v4(t, e, n);
    }
    r();
  }
}, $4 = (t) => {
  an.$flags$ & 1 || fo(t);
}, I4 = (t, e = {}) => {
  var n;
  const r = jr(), s = [], i = e.exclude || [], o = Xc.customElements, a = Sr.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ Sr.createElement("style"), d = [];
  let l, w = !0;
  Object.assign(an, e), an.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Sr.baseURI).href, t.map((p) => {
    p[1].map((x) => {
      const S = {
        $flags$: x[0],
        $tagName$: x[1],
        $members$: x[2],
        $listeners$: x[3]
      };
      S.$members$ = x[2];
      const B = S.$tagName$, G = class extends HTMLElement {
        // StencilLazyHost
        constructor(j) {
          super(j), j = this, C4(j, S), S.$flags$ & 1 && j.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), w ? d.push(this) : an.jmp(() => k4(this));
        }
        disconnectedCallback() {
          an.jmp(() => $4(this));
        }
        componentOnReady() {
          return fo(this).$onReadyPromise$;
        }
      };
      S.$lazyBundleId$ = p[0], !i.includes(B) && !o.get(B) && (s.push(B), o.define(B, wy(
        G,
        S,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + n4, u.setAttribute("data-styles", "");
    const p = (n = an.$nonce$) !== null && n !== void 0 ? n : ly(Sr);
    p != null && u.setAttribute("nonce", p), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  w = !1, d.length ? d.map((p) => p.connectedCallback()) : an.jmp(() => l = setTimeout(gy, 30)), r();
}, Rf = /* @__PURE__ */ new WeakMap(), fo = (t) => Rf.get(t), L4 = (t, e) => Rf.set(e.$lazyInstance$ = t, e), C4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], Rf.set(t, n);
}, Oh = (t, e) => e in t, Go = (t, e) => (0, console.error)(t, e), Al = /* @__PURE__ */ new Map(), T4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Al.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (Al.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => m$).then(o, Go);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Al.set(s, o), o[r]), Go);
}, gc = /* @__PURE__ */ new Map(), Xc = typeof window < "u" ? window : {}, Sr = Xc.document || { head: {} }, an = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, by = (t) => Promise.resolve(t), B4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Dh = [], my = [], M4 = (t, e) => (n) => {
  t.push(n), Iu || (Iu = !0, an.$flags$ & 4 ? zf(Cu) : an.raf(Cu));
}, Fh = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Go(n);
    }
  t.length = 0;
}, Cu = () => {
  Fh(Dh), Fh(my), (Iu = Dh.length > 0) && an.raf(Cu);
}, zf = (t) => by().then(t), N4 = /* @__PURE__ */ M4(my), P4 = () => by(), _4 = (t, e) => typeof window > "u" ? Promise.resolve() : P4().then(() => I4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var U4 = Object.defineProperty, H4 = Object.defineProperties, O4 = Object.getOwnPropertyDescriptors, yc = Object.getOwnPropertySymbols, xy = Object.prototype.hasOwnProperty, Sy = Object.prototype.propertyIsEnumerable, jh = (t, e, n) => e in t ? U4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, jn = (t, e) => {
  for (var n in e || (e = {})) xy.call(e, n) && jh(t, n, e[n]);
  if (yc) for (var n of yc(e)) Sy.call(e, n) && jh(t, n, e[n]);
  return t;
}, cr = (t, e) => H4(t, O4(e)), Ey = (t, e) => {
  var n = {};
  for (var r in t) xy.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && yc) for (var r of yc(t)) e.indexOf(r) < 0 && Sy.call(t, r) && (n[r] = t[r]);
  return n;
};
function Ay() {
  return zc(Qs()) || window.StacksProvider || window.BlockstackProvider;
}
function Zc(t) {
  return t ? typeof t == "string" ? ti.fromName(t) : "version" in t ? t : "url" in t ? new ru({ url: t.url }) : t.transactionVersion === ni.Mainnet ? new ru({ url: t.client.baseUrl }) : new su({ url: t.client.baseUrl }) : new su();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var D4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(D4 || {}), F4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(F4 || {}), Gf = (t) => {
  let e = t;
  if (!e) {
    let n = new tp(["store_write"], document.location.href);
    e = new nu({ appConfig: n });
  }
  return e;
};
function vy(t) {
  try {
    return Gf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var ky = (t) => {
  let e = Gf(t).loadUserData().appPrivateKey, n = tn.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function j4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [ei.Mainnet]: "mainnet", [ei.Testnet]: "testnet" }, a = Zc(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function R4(t) {
  let e = Zc(t.network), n = Gf(t.userSession), r = cr(jn({}, t), { network: e, userSession: n });
  return jn({ stxAddress: j4(r) }, r);
}
async function z4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Xg) : n = n.map((r) => wt(oy(r)))), new tn.TokenSigner("ES256k", e).signAsync(cr(jn({}, t), { postConditions: n }));
}
function G4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(Xg) : e = e.map((n) => wt(oy(n)))), tn.createUnsecuredToken(cr(jn({}, t), { postConditions: e }));
}
var K4 = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Wt(a.replace(/^0x/, "")), u = _A(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, cr(jn({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, cr(jn({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, V4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = Ey(e, ["amount", "appDetails", "userSession"]);
  if (vy(s)) {
    let { privateKey: a, publicKey: c } = ky(s), u = cr(jn({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), z4(u, a);
  }
  let o = cr(jn({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), G4(o);
};
async function q4(t, e, n) {
  let r = await e(cr(jn(jn({}, R4(t)), t), { network: Zc(t.network) }));
  return K4({ token: r, options: t }, n);
}
function W4(t, e = Ay()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return q4(t, V4, e);
}
function $y(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? cr(jn({}, t), { message: gh(e), domain: gh(n) }) : cr(jn({}, t), { message: wt(si(e)), domain: wt(si(n)) });
}
async function Y4(t, e) {
  return new tn.TokenSigner("ES256k", e).signAsync($y(t));
}
async function X4(t) {
  let e = t, { userSession: n } = e, r = Ey(e, ["userSession"]);
  if (vy(n)) {
    let { privateKey: s, publicKey: i } = ky(n), o = cr(jn({}, r), { publicKey: i });
    return Y4(o, s);
  }
  return tn.createUnsecuredToken($y(t));
}
var Z4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(Z4 || {}), Iy = "asigna-stx", Rh = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === Iy && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(J4(t, e), "*");
}), Q4 = { authenticationRequest: async (t) => Rh(t, "authenticationRequest"), transactionRequest: async (t) => Rh(t, "transactionRequest") }, J4 = (t, e) => ({ source: Iy, [e]: t }), tv = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = Q4);
};
tv();
var ev = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function nv(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = Qs(), o = Ay();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    _4();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : ev, c = qx(a), u = document.createElement("connect-modal");
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
    let w = (p) => {
      p.key === "Escape" && (document.removeEventListener("keydown", w), u.remove());
    };
    document.addEventListener("keydown", w);
  };
}
var Ma = nv(W4);
function ks(t, e, n) {
  return Kf(bn(t, e), n);
}
function bn(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = xe(r);
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
      const r = iv(BigInt(`0x${Ft(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Ft(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function zh(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function ra(t, e = 8) {
  return (typeof t == "bigint" ? t : bn(t, !1)).toString(16).padStart(e * 2, "0");
}
function Qc(t) {
  return parseInt(t, 16);
}
function Kf(t, e = 16) {
  const n = ra(t, e);
  return xe(n);
}
function rv(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function sv(t, e) {
  return t & BigInt(1) << e;
}
function iv(t, e) {
  return sv(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const ov = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ft(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += ov[n];
  return e;
}
function xe(t) {
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
function ho(t) {
  return new TextEncoder().encode(t);
}
function Vf(t) {
  return new TextDecoder().decode(t);
}
function Ly(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function av(t) {
  return String.fromCharCode.apply(null, t);
}
function cv(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Gh(t) {
  if (t.some(cv))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Jc(...t) {
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
function Pe(t) {
  return Jc(...t.map((e) => typeof e == "number" ? Gh([e]) : e instanceof Array ? Gh(e) : e));
}
var Kh;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Kh || (Kh = {}));
var Vh;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Vh || (Vh = {}));
var qh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(qh || (qh = {}));
const Cy = 33, vl = 32;
function lv(t) {
  if (t.length < vl * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + vl * 2), r = t.slice(2 + vl * 2);
  return {
    recoveryId: Qc(e),
    r: n,
    s: r
  };
}
function uv(t) {
  const e = typeof t == "string" ? xe(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function fv(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function dv(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function hv(t, e) {
  return t[e];
}
function pv(t, e, n = 0) {
  return t[n] = e, t;
}
function gv(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function ii(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Tu;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Tu || (Tu = {}));
const yv = Tu.Mainnet, wv = 128, bv = 128, Ty = 16, zs = 32, Bu = 80, tl = 65, mv = 32, xv = 64, wc = 34;
var ft;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ft || (ft = {}));
var Ot;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ot || (Ot = {}));
var Mu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Mu || (Mu = {}));
var An;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(An || (An = {}));
const Xa = ["onChainOnly", "offChainOnly", "any"], Wh = {
  [Xa[0]]: An.OnChainOnly,
  [Xa[1]]: An.OffChainOnly,
  [Xa[2]]: An.Any,
  [An.OnChainOnly]: An.OnChainOnly,
  [An.OffChainOnly]: An.OffChainOnly,
  [An.Any]: An.Any
};
function Sv(t) {
  if (t in Wh)
    return Wh[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${Xa.join(", ")}`);
}
var bc;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(bc || (bc = {}));
bc.Mainnet;
var no;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(no || (no = {}));
var vn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(vn || (vn = {}));
var Ce;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ce || (Ce = {}));
var ue;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ue || (ue = {}));
var mc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(mc || (mc = {}));
var ke;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ke || (ke = {}));
var Ko;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ko || (Ko = {}));
var Nu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Nu || (Nu = {}));
var Vo;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Vo || (Vo = {}));
var Yh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Yh || (Yh = {}));
var Xh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Xh || (Xh = {}));
function Pu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Ev(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function By(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Av(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Pu(t.outputLen), Pu(t.blockLen);
}
function vv(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function kv(t, e) {
  By(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ds = {
  number: Pu,
  bool: Ev,
  bytes: By,
  hash: Av,
  exists: vv,
  output: kv
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const kl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), pr = (t, e) => t << 32 - e | t >>> e, $v = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!$v)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Iv(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function qf(t) {
  if (typeof t == "string" && (t = Iv(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class My {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function wi(t) {
  const e = (r) => t().update(qf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Lv(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class Wf extends My {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = kl(this.buffer);
  }
  update(e) {
    Ds.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = qf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = kl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ds.exists(this), Ds.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Lv(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = kl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, d = this.get();
    if (u > d.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
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
const Cv = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Ny = Uint8Array.from({ length: 16 }, (t, e) => e), Tv = Ny.map((t) => (9 * t + 5) % 16);
let Yf = [Ny], Xf = [Tv];
for (let t = 0; t < 4; t++)
  for (let e of [Yf, Xf])
    e.push(e[t].map((n) => Cv[n]));
const Py = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Bv = Yf.map((t, e) => t.map((n) => Py[e][n])), Mv = Xf.map((t, e) => t.map((n) => Py[e][n])), Nv = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Pv = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Na = (t, e) => t << e | t >>> 32 - e;
function Zh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Pa = new Uint32Array(16);
class _v extends Wf {
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
      Pa[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, w = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, S = Nv[p], B = Pv[p], G = Yf[p], j = Xf[p], v = Bv[p], U = Mv[p];
      for (let M = 0; M < 16; M++) {
        const Q = Na(r + Zh(p, i, a, u) + Pa[G[M]] + S, v[M]) + l | 0;
        r = l, l = u, u = Na(a, 10) | 0, a = i, i = Q;
      }
      for (let M = 0; M < 16; M++) {
        const Q = Na(s + Zh(x, o, c, d) + Pa[j[M]] + B, U[M]) + w | 0;
        s = w, w = d, d = Na(c, 10) | 0, c = o, o = Q;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + w | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Pa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const Uv = wi(() => new _v()), Hv = (t, e, n) => t & e ^ ~t & n, Ov = (t, e, n) => t & e ^ t & n ^ e & n, Dv = new Uint32Array([
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
]), ds = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), hs = new Uint32Array(64);
class _y extends Wf {
  constructor() {
    super(64, 32, 8, !1), this.A = ds[0] | 0, this.B = ds[1] | 0, this.C = ds[2] | 0, this.D = ds[3] | 0, this.E = ds[4] | 0, this.F = ds[5] | 0, this.G = ds[6] | 0, this.H = ds[7] | 0;
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
      hs[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const w = hs[l - 15], p = hs[l - 2], x = pr(w, 7) ^ pr(w, 18) ^ w >>> 3, S = pr(p, 17) ^ pr(p, 19) ^ p >>> 10;
      hs[l] = S + hs[l - 7] + x + hs[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const w = pr(a, 6) ^ pr(a, 11) ^ pr(a, 25), p = d + w + Hv(a, c, u) + Dv[l] + hs[l] | 0, S = (pr(r, 2) ^ pr(r, 13) ^ pr(r, 22)) + Ov(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    hs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Fv extends _y {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Zf = wi(() => new _y());
wi(() => new Fv());
const _a = BigInt(2 ** 32 - 1), _u = BigInt(32);
function Uy(t, e = !1) {
  return e ? { h: Number(t & _a), l: Number(t >> _u & _a) } : { h: Number(t >> _u & _a) | 0, l: Number(t & _a) | 0 };
}
function jv(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Uy(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Rv = (t, e) => BigInt(t >>> 0) << _u | BigInt(e >>> 0), zv = (t, e, n) => t >>> n, Gv = (t, e, n) => t << 32 - n | e >>> n, Kv = (t, e, n) => t >>> n | e << 32 - n, Vv = (t, e, n) => t << 32 - n | e >>> n, qv = (t, e, n) => t << 64 - n | e >>> n - 32, Wv = (t, e, n) => t >>> n - 32 | e << 64 - n, Yv = (t, e) => e, Xv = (t, e) => t, Zv = (t, e, n) => t << n | e >>> 32 - n, Qv = (t, e, n) => e << n | t >>> 32 - n, Jv = (t, e, n) => e << n - 32 | t >>> 64 - n, t8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function e8(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const n8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), r8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, s8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), i8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, o8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), a8 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Ut = {
  fromBig: Uy,
  split: jv,
  toBig: Rv,
  shrSH: zv,
  shrSL: Gv,
  rotrSH: Kv,
  rotrSL: Vv,
  rotrBH: qv,
  rotrBL: Wv,
  rotr32H: Yv,
  rotr32L: Xv,
  rotlSH: Zv,
  rotlSL: Qv,
  rotlBH: Jv,
  rotlBL: t8,
  add: e8,
  add3L: n8,
  add3H: r8,
  add4L: s8,
  add4H: i8,
  add5H: a8,
  add5L: o8
}, [c8, l8] = Ut.split([
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
].map((t) => BigInt(t))), ps = new Uint32Array(80), gs = new Uint32Array(80);
class el extends Wf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: w, Gh: p, Gl: x, Hh: S, Hl: B } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, w, p, x, S, B];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, w, p, x, S, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = w | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let v = 0; v < 16; v++, n += 4)
      ps[v] = e.getUint32(n), gs[v] = e.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const U = ps[v - 15] | 0, M = gs[v - 15] | 0, Q = Ut.rotrSH(U, M, 1) ^ Ut.rotrSH(U, M, 8) ^ Ut.shrSH(U, M, 7), tt = Ut.rotrSL(U, M, 1) ^ Ut.rotrSL(U, M, 8) ^ Ut.shrSL(U, M, 7), K = ps[v - 2] | 0, q = gs[v - 2] | 0, I = Ut.rotrSH(K, q, 19) ^ Ut.rotrBH(K, q, 61) ^ Ut.shrSH(K, q, 6), P = Ut.rotrSL(K, q, 19) ^ Ut.rotrBL(K, q, 61) ^ Ut.shrSL(K, q, 6), b = Ut.add4L(tt, P, gs[v - 7], gs[v - 16]), L = Ut.add4H(b, Q, I, ps[v - 7], ps[v - 16]);
      ps[v] = L | 0, gs[v] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: w, Fh: p, Fl: x, Gh: S, Gl: B, Hh: G, Hl: j } = this;
    for (let v = 0; v < 80; v++) {
      const U = Ut.rotrSH(l, w, 14) ^ Ut.rotrSH(l, w, 18) ^ Ut.rotrBH(l, w, 41), M = Ut.rotrSL(l, w, 14) ^ Ut.rotrSL(l, w, 18) ^ Ut.rotrBL(l, w, 41), Q = l & p ^ ~l & S, tt = w & x ^ ~w & B, K = Ut.add5L(j, M, tt, l8[v], gs[v]), q = Ut.add5H(K, G, U, Q, c8[v], ps[v]), I = K | 0, P = Ut.rotrSH(r, s, 28) ^ Ut.rotrBH(r, s, 34) ^ Ut.rotrBH(r, s, 39), b = Ut.rotrSL(r, s, 28) ^ Ut.rotrBL(r, s, 34) ^ Ut.rotrBL(r, s, 39), L = r & i ^ r & a ^ i & a, D = s & o ^ s & c ^ o & c;
      G = S | 0, j = B | 0, S = p | 0, B = x | 0, p = l | 0, x = w | 0, { h: l, l: w } = Ut.add(u | 0, d | 0, q | 0, I | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const C = Ut.add3L(I, b, D);
      r = Ut.add3H(C, q, P, L), s = C | 0;
    }
    ({ h: r, l: s } = Ut.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ut.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ut.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Ut.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: w } = Ut.add(this.Eh | 0, this.El | 0, l | 0, w | 0), { h: p, l: x } = Ut.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: B } = Ut.add(this.Gh | 0, this.Gl | 0, S | 0, B | 0), { h: G, l: j } = Ut.add(this.Hh | 0, this.Hl | 0, G | 0, j | 0), this.set(r, s, i, o, a, c, u, d, l, w, p, x, S, B, G, j);
  }
  roundClean() {
    ps.fill(0), gs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class u8 extends el {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class f8 extends el {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class d8 extends el {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
wi(() => new el());
wi(() => new u8());
const h8 = wi(() => new f8());
wi(() => new d8());
function Hy(t) {
  if (xe(t).byteLength != tl)
    throw Error("Invalid signature");
  return {
    type: ft.MessageSignature,
    data: t
  };
}
function Bo(t, e) {
  return { type: ft.Address, version: t, hash160: e };
}
function Oi(t) {
  return pi.c32address(t.version, t.hash160);
}
function oi(t, e, n) {
  const r = e || 1, s = n || wv;
  if (tw(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ft.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Qf(t) {
  const e = pi.c32addressDecode(t);
  return {
    type: ft.Address,
    version: e[0],
    hash160: e[1]
  };
}
var X;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(X || (X = {}));
function p8(t) {
  if (t.type === X.PrincipalStandard)
    return Oi(t.address);
  if (t.type === X.PrincipalContract)
    return `${Oi(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function Oy(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return w8(e, n);
  } else
    return g8(t);
}
function g8(t) {
  const e = Qf(t);
  return { type: X.PrincipalStandard, address: e };
}
function y8(t) {
  return { type: X.PrincipalStandard, address: t };
}
function w8(t, e) {
  const n = Qf(t), r = oi(e);
  return Dy(n, r);
}
function Dy(t, e) {
  if (ho(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: X.PrincipalContract, address: t, contractName: e };
}
function $l(t, e = !1) {
  switch (t.type) {
    case X.BoolTrue:
      return !0;
    case X.BoolFalse:
      return !1;
    case X.Int:
    case X.UInt:
      return e ? t.value.toString() : t.value;
    case X.Buffer:
      return `0x${Ft(t.buffer)}`;
    case X.OptionalNone:
      return null;
    case X.OptionalSome:
      return br(t.value);
    case X.ResponseErr:
      return br(t.value);
    case X.ResponseOk:
      return br(t.value);
    case X.PrincipalStandard:
    case X.PrincipalContract:
      return p8(t);
    case X.List:
      return t.list.map((r) => br(r));
    case X.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = br(t.data[r]);
      }), n;
    case X.StringASCII:
      return t.data;
    case X.StringUTF8:
      return t.data;
  }
}
function br(t) {
  switch (t.type) {
    case X.ResponseErr:
      return { type: bs(t), value: $l(t, !0), success: !1 };
    case X.ResponseOk:
      return { type: bs(t), value: $l(t, !0), success: !0 };
    default:
      return { type: bs(t), value: $l(t, !0) };
  }
}
function bs(t) {
  switch (t.type) {
    case X.BoolTrue:
    case X.BoolFalse:
      return "bool";
    case X.Int:
      return "int";
    case X.UInt:
      return "uint";
    case X.Buffer:
      return `(buff ${t.buffer.length})`;
    case X.OptionalNone:
      return "(optional none)";
    case X.OptionalSome:
      return `(optional ${bs(t.value)})`;
    case X.ResponseErr:
      return `(response UnknownType ${bs(t.value)})`;
    case X.ResponseOk:
      return `(response ${bs(t.value)} UnknownType)`;
    case X.PrincipalStandard:
    case X.PrincipalContract:
      return "principal";
    case X.List:
      return `(list ${t.list.length} ${t.list.length ? bs(t.list[0]) : "UnknownType"})`;
    case X.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${bs(t.data[e])})`).join(" ")})`;
    case X.StringASCII:
      return `(string-ascii ${Ly(t.data).length})`;
    case X.StringUTF8:
      return `(string-utf8 ${ho(t.data).length})`;
  }
}
const Fy = () => ({ type: X.BoolTrue }), jy = () => ({ type: X.BoolFalse }), b8 = (t) => t ? Fy() : jy(), Qh = BigInt("0xffffffffffffffffffffffffffffffff"), m8 = BigInt(0), Jh = BigInt("0x7fffffffffffffffffffffffffffffff"), t0 = BigInt("-170141183460469231731687303715884105728"), x8 = (t) => {
  const e = bn(t, !0);
  if (e > Jh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Jh}`);
  if (e < t0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${t0}`);
  return { type: X.Int, value: e };
}, Er = (t) => {
  const e = bn(t, !1);
  if (e < m8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Qh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Qh}`);
  return { type: X.UInt, value: e };
}, Ry = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: X.Buffer, buffer: t };
};
function zy() {
  return { type: X.OptionalNone };
}
function Gy(t) {
  return { type: X.OptionalSome, value: t };
}
function S8(t) {
  return { type: X.ResponseErr, value: t };
}
function E8(t) {
  return { type: X.ResponseOk, value: t };
}
function A8(t) {
  return { type: X.List, list: t };
}
function ai(t) {
  for (const e in t)
    if (!dk(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: X.Tuple, data: t };
}
const Je = (t) => ({ type: X.StringASCII, data: t }), v8 = (t) => ({ type: X.StringUTF8, data: t });
class Ky extends My {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ds.hash(e);
    const r = qf(n);
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
    return Ds.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ds.exists(this), Ds.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Vy = (t, e, n) => new Ky(t, e).update(n).digest();
Vy.create = (t, e) => new Ky(t, e);
Te.hmacSha256Sync = (t, ...e) => {
  const n = Vy.create(Zf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function ro(t) {
  return {
    type: ft.PublicKey,
    data: xe(t)
  };
}
function k8(t, e, n = ke.Compressed) {
  const r = lv(e.data), s = new Dn(zh(r.r), zh(r.s)), i = Dt.fromSignature(t, s, r.recoveryId), o = n === ke.Compressed;
  return i.toHex(o);
}
function $8(t) {
  return { type: ft.PublicKey, data: t };
}
function po(t) {
  return !Ft(t.data).startsWith("04");
}
function xc(t) {
  return t.data.slice();
}
function I8(t) {
  const e = T8(t), n = Qo(e.data.slice(0, 32), e.compressed);
  return ro(Ft(n));
}
function L8(t) {
  const e = typeof t == "string" ? t : Ft(t), n = Dt.fromHex(e).toHex(!0);
  return ro(n);
}
function C8(t) {
  const e = typeof t == "string" ? t : Ft(t), n = Dt.fromHex(e).toHex(!1);
  return ro(n);
}
function Uu(t) {
  const e = t.readUInt8(), n = e === 4 ? xv : mv;
  return $8(Pe([e, t.readBytes(n)]));
}
function T8(t) {
  const e = uv(t), n = e.length == Cy;
  return { data: e, compressed: n };
}
function B8(t, e) {
  const [n, r] = Nc(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = ra(r, 1) + Dn.fromHex(n).toCompactHex();
  return Hy(i);
}
function M8(t) {
  return I8(t.data);
}
function N8(t, e, n) {
  return typeof t == "string" && (t = Oy(t)), typeof n == "string" && (n = r0(n)), {
    type: ft.Payload,
    payloadType: Ot.TokenTransfer,
    recipient: t,
    amount: bn(e, !1),
    memo: n ?? r0("")
  };
}
function P8(t, e, n, r) {
  return typeof t == "string" && (t = Qf(t)), typeof e == "string" && (e = oi(e)), typeof n == "string" && (n = oi(n)), {
    type: ft.Payload,
    payloadType: Ot.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function e0(t, e, n) {
  return typeof t == "string" && (t = oi(t)), typeof e == "string" && (e = z8(e)), typeof n == "number" ? {
    type: ft.Payload,
    payloadType: Ot.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: ft.Payload,
    payloadType: Ot.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function _8() {
  return { type: ft.Payload, payloadType: Ot.PoisonMicroblock };
}
function n0(t, e) {
  if (t.byteLength != zs)
    throw Error(`Coinbase buffer size must be ${zs} bytes`);
  return e != null ? {
    type: ft.Payload,
    payloadType: Ot.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: ft.Payload,
    payloadType: Ot.Coinbase,
    coinbaseBytes: t
  };
}
function U8(t, e, n) {
  if (t.byteLength != zs)
    throw Error(`Coinbase buffer size must be ${zs} bytes`);
  if (n.byteLength != Bu)
    throw Error(`VRF proof buffer size must be ${Bu} bytes`);
  return {
    type: ft.Payload,
    payloadType: Ot.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === X.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Hu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Hu || (Hu = {}));
function H8(t, e, n, r, s, i, o) {
  return {
    type: ft.Payload,
    payloadType: Ot.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function qy(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Ot.TokenTransfer:
      e.push(Me(t.recipient)), e.push(ks(t.amount, !1, 8)), e.push(_r(t.memo));
      break;
    case Ot.ContractCall:
      e.push(_r(t.contractAddress)), e.push(_r(t.contractName)), e.push(_r(t.functionName));
      const n = new Uint8Array(4);
      ii(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Me(r));
      });
      break;
    case Ot.SmartContract:
      e.push(_r(t.contractName)), e.push(_r(t.codeBody));
      break;
    case Ot.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(_r(t.contractName)), e.push(_r(t.codeBody));
      break;
    case Ot.PoisonMicroblock:
      break;
    case Ot.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Ot.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Me(t.recipient));
      break;
    case Ot.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Me(t.recipient ? Gy(t.recipient) : zy())), e.push(t.vrfProof);
      break;
    case Ot.TenureChange:
      e.push(xe(t.tenureHash)), e.push(xe(t.previousTenureHash)), e.push(xe(t.burnViewHash)), e.push(xe(t.previousTenureEnd)), e.push(ii(new Uint8Array(4), t.previousTenureBlocks)), e.push(pv(new Uint8Array(1), t.cause)), e.push(xe(t.publicKeyHash));
      break;
  }
  return Pe(e);
}
function O8(t) {
  switch (t.readUInt8Enum(Ot, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Ot.TokenTransfer:
      const n = Jn(t), r = bn(t.readBytes(8), !1), s = Yy(t);
      return N8(n, r, s);
    case Ot.ContractCall:
      const i = so(t), o = Qn(t), a = Qn(t), c = [], u = t.readUInt32BE();
      for (let v = 0; v < u; v++) {
        const U = Jn(t);
        c.push(U);
      }
      return P8(i, o, a, c);
    case Ot.SmartContract:
      const d = Qn(t), l = Qn(t, 4, 1e5);
      return e0(d, l);
    case Ot.VersionedSmartContract: {
      const v = t.readUInt8Enum(Mu, (Q) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Q}`);
      }), U = Qn(t), M = Qn(t, 4, 1e5);
      return e0(U, M, v);
    }
    case Ot.PoisonMicroblock:
      return _8();
    case Ot.Coinbase: {
      const v = t.readBytes(zs);
      return n0(v);
    }
    case Ot.CoinbaseToAltRecipient: {
      const v = t.readBytes(zs), U = Jn(t);
      return n0(v, U);
    }
    case Ot.NakamotoCoinbase: {
      const v = t.readBytes(zs), U = Jn(t), M = t.readBytes(Bu);
      return U8(v, U, M);
    }
    case Ot.TenureChange:
      const w = Ft(t.readBytes(20)), p = Ft(t.readBytes(20)), x = Ft(t.readBytes(20)), S = Ft(t.readBytes(32)), B = t.readUInt32BE(), G = t.readUInt8Enum(Hu, (v) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${v}`);
      }), j = Ft(t.readBytes(20));
      return H8(w, p, x, S, B, G, j);
  }
}
class nl extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Ps extends nl {
  constructor(e) {
    super(e);
  }
}
class On extends nl {
  constructor(e) {
    super(e);
  }
}
class Sc extends nl {
  constructor(e) {
    super(e);
  }
}
class Fs extends nl {
  constructor(e) {
    super(e);
  }
}
var ir;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ir || (ir = {}));
function Ou(t) {
  return Hy(Ft(t.readBytes(tl)));
}
function Di(t, e) {
  return {
    pubKeyEncoding: t,
    type: ft.TransactionAuthField,
    contents: e
  };
}
function D8(t) {
  const e = t.readUInt8Enum(ir, (n) => {
    throw new On(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case ir.PublicKeyCompressed:
      return Di(ke.Compressed, Uu(t));
    case ir.PublicKeyUncompressed:
      return Di(ke.Uncompressed, C8(Uu(t).data));
    case ir.SignatureCompressed:
      return Di(ke.Compressed, Ou(t));
    case ir.SignatureUncompressed:
      return Di(ke.Uncompressed, Ou(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function Jf(t) {
  return xe(t.data);
}
function F8(t) {
  const e = [];
  switch (t.contents.type) {
    case ft.PublicKey:
      e.push(t.pubKeyEncoding === ke.Compressed ? ir.PublicKeyCompressed : ir.PublicKeyUncompressed), e.push(xc(L8(t.contents.data)));
      break;
    case ft.MessageSignature:
      e.push(t.pubKeyEncoding === ke.Compressed ? ir.SignatureCompressed : ir.SignatureUncompressed), e.push(Jf(t.contents));
      break;
  }
  return Pe(e);
}
function _r(t) {
  switch (t.type) {
    case ft.Address:
      return sa(t);
    case ft.Principal:
      return Wy(t);
    case ft.LengthPrefixedString:
      return io(t);
    case ft.MemoString:
      return G8(t);
    case ft.AssetInfo:
      return Xy(t);
    case ft.PostCondition:
      return K8(t);
    case ft.PublicKey:
      return xc(t);
    case ft.LengthPrefixedList:
      return nd(t);
    case ft.Payload:
      return qy(t);
    case ft.TransactionAuthField:
      return F8(t);
    case ft.MessageSignature:
      return Jf(t);
  }
}
function j8() {
  return {
    type: ft.Address,
    version: mc.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function td(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ue.SerializeP2PKH || e === ue.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ue.SerializeP2WPKH || e === ue.SerializeP2WSH || e === ue.SerializeP2WSHNonSequential) && !r.every(po))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ue.SerializeP2PKH:
      return Bo(t, ck(r[0].data));
    case ue.SerializeP2WPKH:
      return Bo(t, lk(r[0].data));
    case ue.SerializeP2SH:
    case ue.SerializeP2SHNonSequential:
      return Bo(t, uk(n, r.map(xc)));
    case ue.SerializeP2WSH:
    case ue.SerializeP2WSHNonSequential:
      return Bo(t, fk(n, r.map(xc)));
  }
}
function sa(t) {
  const e = [];
  return e.push(xe(ra(t.version, 1))), e.push(xe(t.hash160)), Pe(e);
}
function so(t) {
  const e = Qc(Ft(t.readBytes(1))), n = Ft(t.readBytes(20));
  return { type: ft.Address, version: e, hash160: n };
}
function Wy(t) {
  const e = [];
  return e.push(t.prefix), e.push(sa(t.address)), t.prefix === Vo.Contract && e.push(io(t.contractName)), Pe(e);
}
function R8(t) {
  const e = t.readUInt8Enum(Vo, (s) => {
    throw new On(`Unexpected Principal payload type: ${s}`);
  }), n = so(t);
  if (e === Vo.Standard)
    return { type: ft.Principal, prefix: e, address: n };
  const r = Qn(t);
  return {
    type: ft.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function io(t) {
  const e = [], n = ho(t.content), r = n.byteLength;
  return e.push(xe(ra(r, t.lengthPrefixBytes))), e.push(n), Pe(e);
}
function Qn(t, e, n) {
  e = e || 1;
  const r = Qc(Ft(t.readBytes(e))), s = Vf(t.readBytes(r));
  return oi(s, e, n ?? 128);
}
function z8(t) {
  return oi(t, 4, 1e5);
}
function r0(t) {
  if (t && tw(t, wc))
    throw new Error(`Memo exceeds maximum length of ${wc} bytes`);
  return { type: ft.MemoString, content: t };
}
function G8(t) {
  const e = [], n = ho(t.content), r = ak(Ft(n), wc * 2);
  return e.push(xe(r)), Pe(e);
}
function Yy(t) {
  let e = Vf(t.readBytes(wc));
  return e = e.replace(/\u0000*$/, ""), { type: ft.MemoString, content: e };
}
function Xy(t) {
  const e = [];
  return e.push(sa(t.address)), e.push(io(t.contractName)), e.push(io(t.assetName)), Pe(e);
}
function Du(t) {
  return {
    type: ft.AssetInfo,
    address: so(t),
    contractName: Qn(t),
    assetName: Qn(t)
  };
}
function ed(t, e) {
  return {
    type: ft.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function nd(t) {
  const e = t.values, n = [];
  n.push(xe(ra(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(_r(r));
  return Pe(n);
}
function Zy(t, e, n) {
  const r = Qc(Ft(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case ft.Address:
        s.push(so(t));
        break;
      case ft.LengthPrefixedString:
        s.push(Qn(t));
        break;
      case ft.MemoString:
        s.push(Yy(t));
        break;
      case ft.AssetInfo:
        s.push(Du(t));
        break;
      case ft.PostCondition:
        s.push(V8(t));
        break;
      case ft.PublicKey:
        s.push(Uu(t));
        break;
      case ft.TransactionAuthField:
        s.push(D8(t));
        break;
    }
  return ed(s, n);
}
function K8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Wy(t.principal)), (t.conditionType === vn.Fungible || t.conditionType === vn.NonFungible) && e.push(Xy(t.assetInfo)), t.conditionType === vn.NonFungible && e.push(Me(t.assetName)), e.push(t.conditionCode), t.conditionType === vn.STX || t.conditionType === vn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ps("The post-condition amount may not be larger than 8 bytes");
    e.push(ks(t.amount, !1, 8));
  }
  return Pe(e);
}
function V8(t) {
  const e = t.readUInt8Enum(vn, (o) => {
    throw new On(`Could not read ${o} as PostConditionType`);
  }), n = R8(t);
  let r, s, i;
  switch (e) {
    case vn.STX:
      return r = t.readUInt8Enum(Ko, (a) => {
        throw new On(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ft(t.readBytes(8))}`), {
        type: ft.PostCondition,
        conditionType: vn.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case vn.Fungible:
      return s = Du(t), r = t.readUInt8Enum(Ko, (a) => {
        throw new On(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ft(t.readBytes(8))}`), {
        type: ft.PostCondition,
        conditionType: vn.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case vn.NonFungible:
      s = Du(t);
      const o = Jn(t);
      return r = t.readUInt8Enum(Nu, (a) => {
        throw new On(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: ft.PostCondition,
        conditionType: vn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Ir(t, e) {
  return Pe([t, e]);
}
function q8(t) {
  return new Uint8Array([t.type]);
}
function W8(t) {
  return t.type === X.OptionalNone ? new Uint8Array([t.type]) : Ir(t.type, Me(t.value));
}
function Y8(t) {
  const e = new Uint8Array(4);
  return ii(e, t.buffer.length, 0), Ir(t.type, Jc(e, t.buffer));
}
function X8(t) {
  const e = Kf(rv(t.value, BigInt(bv)), Ty);
  return Ir(t.type, e);
}
function Z8(t) {
  const e = Kf(t.value, Ty);
  return Ir(t.type, e);
}
function Q8(t) {
  return Ir(t.type, sa(t.address));
}
function J8(t) {
  return Ir(t.type, Jc(sa(t.address), io(t.contractName)));
}
function tk(t) {
  return Ir(t.type, Me(t.value));
}
function ek(t) {
  const e = [], n = new Uint8Array(4);
  ii(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Me(r);
    e.push(s);
  }
  return Ir(t.type, Pe(e));
}
function nk(t) {
  const e = [], n = new Uint8Array(4);
  ii(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = oi(s);
    e.push(io(i));
    const o = Me(t.data[s]);
    e.push(o);
  }
  return Ir(t.type, Pe(e));
}
function Qy(t, e) {
  const n = [], r = e == "ascii" ? Ly(t.data) : ho(t.data), s = new Uint8Array(4);
  return ii(s, r.length, 0), n.push(s), n.push(r), Ir(t.type, Pe(n));
}
function rk(t) {
  return Qy(t, "ascii");
}
function sk(t) {
  return Qy(t, "utf8");
}
function Me(t) {
  switch (t.type) {
    case X.BoolTrue:
    case X.BoolFalse:
      return q8(t);
    case X.OptionalNone:
    case X.OptionalSome:
      return W8(t);
    case X.Buffer:
      return Y8(t);
    case X.UInt:
      return Z8(t);
    case X.Int:
      return X8(t);
    case X.PrincipalStandard:
      return Q8(t);
    case X.PrincipalContract:
      return J8(t);
    case X.ResponseOk:
    case X.ResponseErr:
      return tk(t);
    case X.List:
      return ek(t);
    case X.Tuple:
      return nk(t);
    case X.StringASCII:
      return rk(t);
    case X.StringUTF8:
      return sk(t);
    default:
      throw new Ps("Unable to serialize. Invalid Clarity Value.");
  }
}
function ik(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const s0 = /* @__PURE__ */ new Map();
function Jy(t, e) {
  const n = s0.get(t);
  if (n !== void 0)
    return n(e);
  const r = ik(t);
  return s0.set(t, r), Jy(t, e);
}
class Uo {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return gv(this.readBytes(4), 0);
  }
  readUInt8() {
    return hv(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return fv(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = Ft(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Ft(n);
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
    if (Jy(e, r))
      return r;
    throw n(r);
  }
}
function Jn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Uo(xe(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Uo(t) : e = t;
  switch (e.readUInt8Enum(X, (r) => {
    throw new On(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case X.Int:
      return x8(e.readBytes(16));
    case X.UInt:
      return Er(e.readBytes(16));
    case X.Buffer:
      const r = e.readUInt32BE();
      return Ry(e.readBytes(r));
    case X.BoolTrue:
      return Fy();
    case X.BoolFalse:
      return jy();
    case X.PrincipalStandard:
      const s = so(e);
      return y8(s);
    case X.PrincipalContract:
      const i = so(e), o = Qn(e);
      return Dy(i, o);
    case X.ResponseOk:
      return E8(Jn(e));
    case X.ResponseErr:
      return S8(Jn(e));
    case X.OptionalNone:
      return zy();
    case X.OptionalSome:
      return Gy(Jn(e));
    case X.List:
      const a = e.readUInt32BE(), c = [];
      for (let S = 0; S < a; S++)
        c.push(Jn(e));
      return A8(c);
    case X.Tuple:
      const u = e.readUInt32BE(), d = {};
      for (let S = 0; S < u; S++) {
        const B = Qn(e).content;
        if (B === void 0)
          throw new On('"content" is undefined');
        d[B] = Jn(e);
      }
      return ai(d);
    case X.StringASCII:
      const l = e.readUInt32BE(), w = av(e.readBytes(l));
      return Je(w);
    case X.StringUTF8:
      const p = e.readUInt32BE(), x = Vf(e.readBytes(p));
      return v8(x);
    default:
      throw new On("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const ok = (t) => t.length % 2 == 0 ? t : `0${t}`, ak = (t, e) => t.padEnd(e, "0"), tw = (t, e) => t ? ho(t).length > e : !1;
function Fu(t) {
  return mg(t);
}
const qo = (t) => Uv(Zf(t)), rd = (t) => Ft(h8(t)), ck = (t) => Ft(qo(t)), lk = (t) => {
  const e = qo(t), n = Jc(new Uint8Array([0]), new Uint8Array([e.length]), e), r = qo(n);
  return Ft(r);
}, uk = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Pe(n), s = qo(r);
  return Ft(s);
}, fk = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Pe(n), s = Zf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Pe(i), a = qo(o);
  return Ft(a);
};
function dk(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function ew(t) {
  const e = Me(t);
  return `0x${Ft(e)}`;
}
function hk(t) {
  return Jn(t);
}
const Ri = (t) => {
  try {
    return pi.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function sd() {
  return {
    type: ft.MessageSignature,
    data: Ft(new Uint8Array(tl))
  };
}
function nw(t, e, n, r) {
  const s = td(0, t, 1, [ro(e)]).hash160, i = po(ro(e)) ? ke.Compressed : ke.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: bn(n, !1),
    fee: bn(r, !1),
    keyEncoding: i,
    signature: sd()
  };
}
function Wo(t) {
  return "signature" in t;
}
function i0(t) {
  return t === ue.SerializeP2SH || t === ue.SerializeP2WSH;
}
function pk(t) {
  return t === ue.SerializeP2SHNonSequential || t === ue.SerializeP2WSHNonSequential;
}
function o0(t) {
  const e = Fu(t);
  return e.nonce = 0, e.fee = 0, Wo(e) ? e.signature = sd() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function gk(t) {
  const e = [
    t.hashMode,
    xe(t.signer),
    ks(t.nonce, !1, 8),
    ks(t.fee, !1, 8),
    t.keyEncoding,
    Jf(t.signature)
  ];
  return Pe(e);
}
function yk(t) {
  const e = [
    t.hashMode,
    xe(t.signer),
    ks(t.nonce, !1, 8),
    ks(t.fee, !1, 8)
  ], n = ed(t.fields);
  e.push(nd(n));
  const r = new Uint8Array(2);
  return dv(r, t.signaturesRequired, 0), e.push(r), Pe(e);
}
function wk(t, e) {
  const n = Ft(e.readBytes(20)), r = BigInt(`0x${Ft(e.readBytes(8))}`), s = BigInt(`0x${Ft(e.readBytes(8))}`), i = e.readUInt8Enum(ke, (a) => {
    throw new On(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ue.SerializeP2WPKH && i != ke.Compressed)
    throw new On("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Ou(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function bk(t, e) {
  const n = Ft(e.readBytes(20)), r = BigInt("0x" + Ft(e.readBytes(8))), s = BigInt("0x" + Ft(e.readBytes(8))), i = Zy(e, ft.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case ft.PublicKey:
        po(u.contents) || (o = !0);
        break;
      case ft.MessageSignature:
        if (u.pubKeyEncoding === ke.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Fs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ue.SerializeP2WSH || t === ue.SerializeP2WSHNonSequential))
    throw new Fs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Il(t) {
  return Wo(t) ? gk(t) : yk(t);
}
function Ll(t) {
  const e = t.readUInt8Enum(ue, (n) => {
    throw new On(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ue.SerializeP2PKH || e === ue.SerializeP2WPKH ? wk(e, t) : bk(e, t);
}
function rw(t, e, n, r) {
  const i = t + Ft(new Uint8Array([e])) + Ft(ks(n, !1, 8)) + Ft(ks(r, !1, 8));
  if (xe(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return rd(xe(i));
}
function sw(t, e, n) {
  const r = 33 + tl, s = po(e) ? ke.Compressed : ke.Uncompressed, i = t + ok(s.toString(16)) + n.data, o = xe(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return rd(o);
}
function mk(t, e, n, r, s) {
  const i = rw(t, e, n, r), o = B8(s, i), a = M8(s), c = sw(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function iw(t, e, n, r, s, i) {
  const o = rw(t, e, n, r), a = ro(k8(o, i, s)), c = sw(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function xk() {
  const t = nw(ue.SerializeP2PKH, "", 0, 0);
  return t.signer = j8().hash160, t.keyEncoding = ke.Compressed, t.signature = sd(), t;
}
function a0(t, e, n) {
  return Wo(t) ? Sk(t, e, n) : Ek(t, e, n);
}
function Sk(t, e, n) {
  const { pubKey: r, nextSigHash: s } = iw(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = td(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Fs(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function Ek(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case ft.PublicKey:
        po(c.contents) || (i = !0), r.push(c.contents);
        break;
      case ft.MessageSignature:
        c.pubKeyEncoding === ke.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = iw(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (i0(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new Fs("Too many signatures");
        break;
    }
  if (i0(t.hashMode) && o !== t.signaturesRequired || pk(t.hashMode) && o < t.signaturesRequired)
    throw new Fs("Incorrect number of signatures");
  if (i && (t.hashMode === ue.SerializeP2WSH || t.hashMode === ue.SerializeP2WSHNonSequential))
    throw new Fs("Uncompressed keys are not allowed in this hash mode");
  const a = td(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Fs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function ow(t) {
  return {
    authType: Ce.Standard,
    spendingCondition: t
  };
}
function aw(t, e) {
  return {
    authType: Ce.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || nw(ue.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function c0(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Ce.Standard:
        return ow(o0(t.spendingCondition));
      case Ce.Sponsored:
        return aw(o0(t.spendingCondition), xk());
      default:
        throw new Sc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Ak(t, e) {
  switch (t.authType) {
    case Ce.Standard:
      return a0(t.spendingCondition, e, Ce.Standard);
    case Ce.Sponsored:
      return a0(t.spendingCondition, e, Ce.Standard);
    default:
      throw new Sc("Invalid origin auth type");
  }
}
function vk(t, e) {
  switch (t.authType) {
    case Ce.Standard:
      const n = {
        ...t.spendingCondition,
        fee: bn(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Ce.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: bn(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function kk(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: bn(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function $k(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: bn(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Ik(t, e) {
  const n = {
    ...e,
    nonce: bn(e.nonce, !1),
    fee: bn(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Lk(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Ce.Standard:
      e.push(Il(t.spendingCondition));
      break;
    case Ce.Sponsored:
      e.push(Il(t.spendingCondition)), e.push(Il(t.sponsorSpendingCondition));
      break;
  }
  return Pe(e);
}
function Ck(t) {
  const e = t.readUInt8Enum(Ce, (r) => {
    throw new On(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Ce.Standard:
      return n = Ll(t), ow(n);
    case Ce.Sponsored:
      n = Ll(t);
      const r = Ll(t);
      return aw(n, r);
  }
}
class Tk {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: bn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? yv, this.postConditionMode = i ?? no.Deny, this.postConditions = s ?? ed([]), o)
      this.anchorMode = Sv(o);
    else
      switch (r.payloadType) {
        case Ot.Coinbase:
        case Ot.CoinbaseToAltRecipient:
        case Ot.NakamotoCoinbase:
        case Ot.PoisonMicroblock:
        case Ot.TenureChange:
          this.anchorMode = An.OnChainOnly;
          break;
        case Ot.ContractCall:
        case Ot.SmartContract:
        case Ot.VersionedSmartContract:
        case Ot.TokenTransfer:
          this.anchorMode = An.Any;
          break;
      }
  }
  signBegin() {
    const e = Fu(this);
    return e.auth = c0(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Fu(this);
    return e.auth = c0(e.auth), e.txid();
  }
  verifyOrigin() {
    return Ak(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Ce.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Ce.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Ce.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !Wo(n)) {
      const r = po(e);
      n.fields.push(Di(r ? ke.Compressed : ke.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = mk(n, r, e.fee, e.nonce, s);
    return Wo(e) ? e.signature = i : e.fields.push(Di(s.data.byteLength === Cy ? ke.Compressed : ke.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return rd(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Ce.Sponsored)
      throw new Sc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Ik(this.auth, e);
  }
  setFee(e) {
    this.auth = vk(this.auth, e);
  }
  setNonce(e) {
    this.auth = kk(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Ce.Sponsored)
      throw new Sc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = $k(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Ps('"version" is undefined');
    if (this.chainId === void 0)
      throw new Ps('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ps('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Ps('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Ps('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return ii(n, this.chainId, 0), e.push(n), e.push(Lk(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(nd(this.postConditions)), e.push(qy(this.payload)), Pe(e);
  }
}
function Ec(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Uo(xe(t.slice(2))) : e = new Uo(xe(t)) : t instanceof Uint8Array ? e = new Uo(t) : e = t;
  const n = e.readUInt8Enum(bc, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = Ck(e), i = e.readUInt8Enum(An, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(no, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = Zy(e, ft.PostCondition), c = O8(e);
  return new Tk(n, s, c, a, o, i, r);
}
const Bk = b8, Ho = Er, Mk = Ry;
const Nk = /* @__PURE__ */ new Set([4001, -31001]), Pk = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], _k = ["result", "data", "payload", "response", "params"], l0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], rl = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), bi = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Dr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, Uk = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), cw = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => Uk(i, r)) === s
  );
}, lw = (t) => t ? cw(bi()).some(
  (e) => {
    var n;
    return e.id === t && (rl(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, uw = () => {
  if (typeof window > "u")
    return;
  const t = bi(), e = cw(t).filter(
    (n) => {
      var r;
      return rl(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Dr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of Pk) {
    const r = Dr(t, n) ?? (t === window ? void 0 : Dr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, Hk = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = bi(), n = Dr(e, t) ?? (e === window ? void 0 : Dr(window, t)) ?? zc(t);
  if (n)
    return n;
  if (rl(t) || lw(t))
    return uw();
}, Ua = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, Ok = ["blockstack-session", "blockstack"], Dk = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of Ok) {
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
Dk();
const fw = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Un = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, Fk = (t) => {
  const e = Un(t);
  if (!e)
    return null;
  const n = fw(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, jk = (t) => {
  const e = Un(t);
  if (!e)
    return null;
  const n = fw(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, ju = (t, e = "mainnet") => {
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
      return ju(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return ju(r, e);
  }
  return e;
}, Gs = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, Yo = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return Ri(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = Yo(s, e + 1);
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
    const i = Yo(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && Ri(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Ri(n.testnet) ? n.testnet.trim() : null;
}, u0 = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, dw = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && Nk.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, ci = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Un(n == null ? void 0 : n.message) ?? Un(e.message) ?? Un(e.error) ?? Un(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, oo = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw ci(e);
    if (e.status === "error")
      throw ci(e.result ?? e);
  }
  return t;
}, f0 = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return oo(r);
  } catch (r) {
    throw ci(r);
  }
}, hw = () => uw(), id = () => {
  if (typeof window > "u")
    return;
  const t = bi();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Dr(t, e) ?? (t === window ? void 0 : Dr(window, e));
    if (n)
      return n;
  }
}, d0 = () => {
  if (typeof window > "u")
    return;
  const t = id();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = bi();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Dr(e, n) ?? (e === window ? void 0 : Dr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Za = (t) => {
  var r, s;
  const e = Qs();
  if (rl(e) || lw(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = bi() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === hw();
}, Cl = (t) => {
  const e = jk(t);
  if (!e)
    return null;
  try {
    const n = Ec(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Ac = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = Cl(t), r = Fk(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Un(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Ac(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of l0)
    if (Cl(s[a])) {
      i = Un(s[a]);
      break;
    }
  const o = Un(s.txId) || Un(s.txid) || Un(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? Un(s.txRaw) ?? void 0
    };
  for (const a of l0) {
    const c = Cl(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Un(s[a]) ?? void 0
      };
  }
  for (const a of _k) {
    const c = s[a], u = Ac(c, e + 1);
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
}, Tl = (t) => {
  const e = Ac(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, Rk = (t) => {
  const e = Ac(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, zk = (t) => ({
  ...t,
  fee: Gs(t.fee),
  nonce: Gs(t.nonce),
  sponsored: t.sponsored === !0
}), h0 = (t) => ({
  recipient: t.recipient,
  amount: Gs(t.amount) ?? "0",
  memo: t.memo,
  network: ju(t.network),
  address: t.stxAddress,
  fee: Gs(t.fee),
  nonce: Gs(t.nonce),
  sponsored: t.sponsored ?? !1
}), pw = "WALLET_ADDRESS_MISMATCH", Gk = 45e3;
let Oo = null;
const Ru = (t) => {
  t && (Oo = { address: t, at: Date.now() });
}, Kk = () => {
  Oo = null;
}, Vk = () => Oo && Date.now() - Oo.at <= Gk ? Oo.address : null, qk = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, Wk = async (t) => {
  Kk();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = oo(await t.request("wallet_connect")), n = Yo(e);
  return Ru(n), n;
}, Yk = async (t, e, n, r) => {
  try {
    return oo(await t.request(e, n));
  } catch (s) {
    const i = ci(s);
    if (!qk(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await Wk(t);
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
        { code: o ? pw : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return oo(await t.request(e, n));
    } catch (a) {
      throw ci(a);
    }
  }
};
let p0 = 3e4;
const Xk = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${p0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, p0);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, Zk = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: pw }
      );
    return c;
  }, s = Vk();
  if (s)
    return Ua(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  Ua(n, "account-read");
  try {
    const c = oo(
      await Xk(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = Yo(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (dw(c))
      throw ci(c);
    Ua(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return Ru(i), r(i, "wallet_getAccount");
  let o;
  Ua(n, "account-reconnect");
  try {
    o = oo(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), ci(c);
  }
  const a = Yo(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Ru(a), r(a, "wallet_connect");
}, Qk = async (t, e) => {
  if (!Za(t)) {
    const i = await f0(
      t,
      "stx_transferStx",
      h0(e)
    );
    return Tl(i);
  }
  const n = id();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await f0(
      n,
      "stx_transferStx",
      h0(e)
    );
    return Tl(i);
  }
  const r = hw();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await Zk(r, e.stxAddress);
  const s = await Yk(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: Gs(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: Gs(e.fee) } : {}
    },
    e.stxAddress
  );
  return Tl(s);
}, Jk = () => Qs(), gw = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Qs(), e = t ? Hk(t) : void 0;
  if (e)
    return e;
  const n = bi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, g0 = (t, e) => {
  const n = gw(), r = zk({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, Rk(s));
    }
  });
  if (!n || typeof n.request != "function")
    return Ma(r, e);
  if (Za(n) && !id()) {
    const s = d0();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Qs(),
        route: "legacy-transaction-request"
      }), Ma(r, s);
  }
  return void Qk(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (u0(s) && Za(n)) {
      const a = d0();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Qs(),
          route: "legacy-transaction-request"
        }), Ma(r, a);
        return;
      }
    }
    if (u0(s) && !Za(n)) {
      Ma(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), dw(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, t5 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), y0 = (t) => ew(t).replace(/^0x/, ""), w0 = "This wallet cannot sign messages. Try Xverse or Leather.", b0 = (t) => typeof (t == null ? void 0 : t.request) == "function", m0 = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", e5 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, n5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function r5(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: y0(e.message),
    domain: y0(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function s5(t, e) {
  const n = await X4({
    domain: e.domain,
    message: e.message,
    network: Zc(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? t5()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function x0(t) {
  var s, i;
  const e = Jk() || "", n = /xverse/i.test(e);
  let r = gw();
  if (n && !m0(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (m0(r))
    try {
      return await s5(r, t);
    } catch (o) {
      if (n || !b0(r) || !n5(o)) throw o;
    }
  if (!n && b0(r))
    try {
      return await r5(r, t);
    } catch (o) {
      throw e5(o) ? new Error(w0) : o;
    }
  throw new Error(w0);
}
const S0 = 1000000n, js = 1000000n, vc = 50n, ze = 3000n, mi = 300n, $o = 3000n, i5 = 50000n, Bl = 200n, sl = 15000n, Hn = (t) => t + vc;
function gr(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / S0}.${(n % S0).toString().padStart(6, "0")}`;
}
function E0(t, e = mi) {
  return t <= ze ? 0 : Number((t - ze) / Hn(e));
}
function Ml(t, e = 0n) {
  const n = js - t - e;
  return n > 0n ? n : 0n;
}
function o5(t, e = mi) {
  return t > js ? "over" : t < ze + Hn(e) ? "empty" : t < i5 ? "low" : "ok";
}
const a5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", c5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", l5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function u5(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || l5.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== a5 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const yw = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Nl = 3, f5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [zu, ww] = yw.split("."), Yn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function Gu(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function d5(t) {
  return Yn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function As(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function bw(t, e = []) {
  const n = await As(`/v2/contracts/call-read/${zu}/${ww}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: zu, arguments: e.map((r) => "0x" + Yn(Me(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return br(Jn(n.result));
}
async function h5() {
  const t = await As(`/v2/contracts/source/${zu}/${ww}?proof=0`);
  if (typeof t.source != "string" || await d5(t.source) !== c5) throw Error("Deployed source does not match the tested helper.");
  if (u5(await bw("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function mw(t) {
  return t.startsWith("SP") && Ri(t) && !t.includes(".");
}
async function p5(t) {
  var r;
  if (!mw(t)) throw Error("Invalid mainnet wallet address.");
  const e = await As(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await As(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function g5(t) {
  const e = await As(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function y5(t, e) {
  var s, i;
  const n = await bw("get-owner", [Ho(t), Ho(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !mw(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function w5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Gu(t), signal: AbortSignal.timeout(15e3) });
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
async function b5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function m5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Ec(Gu(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || Oi(Bo(mc.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || Oi(r.contractAddress) + "." + r.contractName.content !== yw || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Yn(Me(r.functionArgs[0])) !== Yn(Me(Ho(t.core))) || Yn(Me(r.functionArgs[1])) !== Yn(Me(Ho(t.song))) || Yn(Me(r.functionArgs[2])) !== Yn(Me(Mk(Gu(t.id)))) || t.amount !== "50" || e.postConditionMode !== no.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== Ko.Equal || i.principal.prefix !== 2 || Oi(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || Oi(r.contractAddress) + "." + r.contractName.content !== f5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Yn(Me(r.functionArgs[0])) !== Yn(Me(Ho(t.song))) || typeof t.liked != "boolean" || Yn(Me(r.functionArgs[1])) !== Yn(Me(Bk(t.liked))) || t.amount !== "0" || e.postConditionMode !== no.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || br(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const x5 = "xtrata.xyz/radio/listening-wallet", S5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Or = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && Ri(t), E5 = (t) => ({
  domain: ai({ name: Je(x5), version: Je("1"), "chain-id": Er(1) }),
  message: ai({
    purpose: Je(S5),
    main: Je(t.main),
    listening: Je(t.listening),
    issued: Er(t.issued)
  })
}), xw = 100000n, A5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function v5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Or(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= xw).sort(A5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const Ha = 50;
function kc(t) {
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
async function k5(t, e, n = 4) {
  if (!Or(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${Ha}&offset=${o}`, s = kc(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - Ha);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= Ha ? s : kc(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = v5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - Ha);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const Mr = 50, $5 = 6, I5 = 20, A0 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function v0(t, e) {
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
async function L5(t, e, n) {
  if (!Or(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = kc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Mr}&offset=0`));
    if (!s || s.total > $5 * Mr) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = Mr; o < s.total; o += Mr) {
      const a = kc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Mr}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${Mr}&offset=${u}`, a = v0(await e(o(0)), t);
      if (!a || a.total > I5 * Mr) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) i.set(u.txId, u);
      for (let u = Mr; u < a.total; u += Mr) {
        const d = v0(await e(o(u)), t);
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
function C5(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(A0).map((l, w) => {
    const p = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: p, kind: "gift", to: r.payer, at: w } : Or(l.sender) && p >= xw ? { sender: l.sender, left: p, kind: "deposit", to: l.sender, at: w } : { sender: l.sender, left: p, kind: "dust", to: null, at: w };
  }), i = s.reduce((l, w) => l + w.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && Or(l.recipient) && l.amount > 0n).sort(A0), a = o.reduce((l, w) => l + w.amount, 0n), c = i - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (l, w) => {
    let p = w;
    for (const x of l) {
      if (p <= 0n) break;
      const S = x.left < p ? x.left : p;
      x.left -= S, p -= S;
    }
    return p;
  };
  for (const l of o) {
    const w = u(s.filter((p) => p.to === l.recipient), l.amount);
    w > 0n && u(s, w);
  }
  if (u(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((l, w) => l + w.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const d = /* @__PURE__ */ new Map();
  for (const l of s) {
    if (l.left <= 0n) continue;
    const w = `${l.kind}:${l.to ?? ""}`, p = d.get(w);
    p ? (p.amount += l.left, p.newest = Math.max(p.newest, l.at)) : d.set(w, { to: l.to, kind: l.kind, amount: l.left, newest: l.at });
  }
  return {
    ok: !0,
    parts: [...d.values()].sort((l, w) => l.newest - w.newest),
    hasTopUp: s.some((l) => l.kind === "deposit")
  };
}
function T5(t, e) {
  const n = t.filter((u) => u.kind === "deposit").sort((u, d) => u.newest - d.newest), r = t.find((u) => u.kind === "gift"), s = t.filter((u) => u.kind === "dust"), i = ((r == null ? void 0 : r.amount) ?? 0n) + s.reduce((u, d) => u + d.amount, 0n), o = [], a = [], c = i > e;
  return n.forEach((u, d) => {
    if (u.amount <= e) {
      a.push(u);
      return;
    }
    const l = d === n.length - 1 && !c;
    o.push({ to: u.to, kind: "deposit", mode: l ? "all" : "amount", send: u.amount - e });
  }), c ? o.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: i - e }) : (r && a.push(r), a.push(...s)), { steps: o, tooSmall: a };
}
function k0(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const Qa = [100, 250, 500], B5 = (t, e) => BigInt(t) * Hn(e), Io = ["prepared", "signed", "unknown", "pending"], M5 = 30 * 6e4, $c = 6e4, Ci = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, N5 = 3e3, Ic = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", Pl = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function P5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = null, d = !1, l = !1, w = !1, p = null, x = !1, S = "", B = "", G = 0, j, v = null, U, M = [], Q, tt = -1 / 0;
  const K = /* @__PURE__ */ new Set();
  let q = null, I = !1, P = 0, b = null, L = null, D = !1, C = null, rt = !1, Y = null, kt = !1, E = !1, H = !1, at = !1, it = !1, ct = 0, $t = null, de = Promise.resolve();
  const It = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? mi.toString()), Yt = (g) => !!i && !(i.features ?? []).includes(g), Lt = (g, k) => `xtrata.ppp.v1.${g}:${k}`, se = "xtrata.ppp.v1.as-main", Rt = () => {
    if (t.main()) return;
    const g = t.store.get(se);
    return g && Or(g) ? g : void 0;
  }, Xt = () => t.main() ?? Rt(), De = (g = i == null ? void 0 : i.address) => {
    if (!g) return [];
    try {
      const k = JSON.parse(t.store.get(Lt("entries", g)) || "[]");
      return Array.isArray(k) ? k : [];
    } catch {
      return [];
    }
  }, he = (g) => {
    const k = [g, ...De(g.address).filter((R) => !(R.txid === g.txid && R.kind === g.kind))].slice(0, 200);
    t.store.set(Lt("entries", g.address), JSON.stringify(k));
  }, We = (g = i == null ? void 0 : i.address) => !!g && t.store.get(Lt("on", g)) !== "0", en = (g) => {
    i != null && i.address && t.store.set(Lt("on", i.address), g ? "1" : "0");
  }, Se = () => De().filter((g) => Io.includes(g.status)), N = () => $() ? [...Se(), ...De(ge()).filter((g) => Io.includes(g.status))] : Se(), xt = () => oe(i == null ? void 0 : i.address), oe = (g) => {
    if (!g) return null;
    try {
      return JSON.parse(t.store.get(Lt("deposit", g)) || "null");
    } catch {
      return null;
    }
  }, Ee = (g, k = i == null ? void 0 : i.address) => {
    k && t.store.set(Lt("deposit", k), JSON.stringify(g));
  };
  let ae = null;
  const $n = (g = $c) => {
    const k = t.now();
    ae = { since: ae && k < ae.until ? ae.since : k, until: Math.max((ae == null ? void 0 : ae.until) ?? 0, k + g) };
  }, Rn = () => !!ae && t.now() < ae.until && (o === void 0 || o < ze + Hn(It())), Ge = () => !!xt() || Rn(), ge = () => Yt("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), $ = () => !!(i != null && i.address) && ge() !== i.address, _ = () => $() ? c && c.for === ge() ? c.value : void 0 : o, F = (g) => g !== void 0 && g < ze + Bl, V = () => Se().filter((g) => t.now() - g.created > M5 && K.has(g.txid)), ht = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!Xt() || r === Xt() && !e.allowed), ut = () => ht() && !(i != null && i.linked), ee = () => {
    const g = Xt();
    return !ut() && !!g && !!(i != null && i.linked) && i.linked !== g;
  }, Jt = (g) => Lt("return-to", g), ne = (g = i == null ? void 0 : i.address) => {
    if (!g) return;
    const k = t.store.get(Jt(g));
    return k && Or(k) && k !== g ? k : void 0;
  }, ye = (g = i == null ? void 0 : i.address) => q && q.for === g ? q.res : null;
  function $e() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const g = ne();
    if (g) return { to: g, kind: "chosen" };
    const k = ye();
    if (k != null && k.ok && k.funder) return { to: k.funder, kind: "funder" };
  }
  const _e = (g) => Lt("gift", g);
  function St() {
    const g = i == null ? void 0 : i.address;
    if (!g) return null;
    if ((C == null ? void 0 : C.for) === g) return C.info;
    try {
      const k = JSON.parse(t.store.get(_e(g)) || "null");
      return k && typeof k.returnTo == "string" && typeof k.treasury == "string" ? k : null;
    } catch {
      return null;
    }
  }
  async function yt() {
    var Et;
    const g = i == null ? void 0 : i.address;
    if (!g || !t.giftInfo || !((Et = e == null ? void 0 : e.gifts) != null && Et.enabled) || rt) return;
    const k = (C == null ? void 0 : C.for) === g ? C : null, R = k ? k.ok ? k.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (k && t.now() - k.at < R) return;
    rt = !0;
    const et = St();
    try {
      const z = await t.giftInfo(g);
      C = { for: g, info: z, ok: !0, at: t.now() }, t.store.set(_e(g), JSON.stringify(z));
    } catch {
      C = { for: g, info: et, ok: !1, at: t.now() };
    } finally {
      rt = !1;
    }
  }
  const Zt = () => De().reduce((g, k) => Io.includes(k.status) ? g + BigInt(k.amount || "0") + BigInt(k.fee || "0") : g, 0n);
  function Vt() {
    if (o === void 0) return 0;
    const g = o - Zt() - BigInt(jt.length) * Hn(It());
    return g > 0n ? E0(g, It()) : 0;
  }
  const we = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", ce = "EMPTY — ADD STX TO PLAY";
  function In() {
    if (!(e != null && e.here)) return null;
    const g = (k, R) => ({ reason: k, text: R });
    switch (Ln()) {
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
        return Ge() ? g("arriving", "YOUR PLAYS ARE ARRIVING") : g("out", $() ? we : ce);
      case "ready":
        return !We() || !(i != null && i.session) || i.session.playsLeft < 1 || i.session.expires <= t.now() ? g("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : H ? Vt() < 1 ? g("out", $() ? we : ce) : null : g("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const nn = () => {
    var g;
    return !!(i != null && i.address) && $() && !!((g = St()) != null && g.player);
  };
  function zr() {
    return nn() ? { locked: !0, known: !0 } : null;
  }
  const xi = 3 * 6e4, Ye = () => !!St() && !!t.history && !(i != null && i.linked);
  async function Gr() {
    const g = i.address, k = St(), { balance: R, nonce: et } = await t.chain.account(g), Et = await t.history(g, !0);
    if (!Et.ok) return null;
    const z = C5({ self: g, balance: R, inbound: Et.inbound, outgoing: Et.outgoing, gift: { sender: k.treasury, payer: k.returnTo } });
    if (!z.ok) return null;
    const pt = T5(z.parts, $o);
    return { balance: R, nonce: et, parts: z.parts, steps: pt.steps, tooSmall: pt.tooSmall.length };
  }
  const tr = () => kt ? { state: "unavailable" } : !Y || t.now() - Y.at > xi || o !== void 0 && o !== Y.balance ? { state: "none" } : Y.plan;
  function Ln() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const g = Xt();
    if (!ut()) {
      if (!g) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : ee() ? "wrong-wallet" : i.state === "known" ? "locked" : !ut() && i.linked !== g ? "link" : o === void 0 ? "loading" : o > js ? "over" : o < ze + Hn(It()) ? "fund" : "ready" : "loading";
  }
  const go = () => {
    var g, k, R, et, Et;
    return {
      step: Ln(),
      busy: u,
      message: S,
      error: B,
      notice: Is(),
      gate: e,
      main: Xt(),
      mainConnected: !!t.main(),
      standIn: Rt(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : o5(o, It()),
      playsLeft: o === void 0 ? 0 : E0(o, It()),
      allowance: o === void 0 ? js : Ml(o, BigInt(((g = xt()) == null ? void 0 : g.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: We(),
      entries: De(),
      depositTxid: ((k = xt()) == null ? void 0 : k.txid) ?? j,
      depositPending: Ge(),
      arrival: Ge() ? { since: ((R = xt()) == null ? void 0 : R.at) ?? (ae == null ? void 0 : ae.since) ?? t.now(), graceMs: $c } : null,
      walletOutdated: Yt("like"),
      linkedListening: Q && Q === Xt() ? M.map((z) => z.listening) : [],
      serverLinked: !!v && U === `${Xt()}:${i == null ? void 0 : i.address}`,
      stuck: V().length,
      armed: at,
      queued: jt.length,
      solo: ut(),
      returnTo: (et = $e()) == null ? void 0 : et.to,
      returnToKind: (Et = $e()) == null ? void 0 : Et.kind,
      funderState: (() => {
        const z = ye();
        return z ? z.ok ? z.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const z = ye();
        return !!z && z.ok && z.distinct > 1;
      })(),
      walletCannotSolo: ut() && Yt("standalone"),
      walletCannotMulti: Yt("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((z) => z !== Xt() && z !== (i == null ? void 0 : i.linked)),
      creditedTo: ut() && (i != null && i.address) && (b == null ? void 0 : b.for) === i.address && b.main ? b.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(Lt("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (L == null ? void 0 : L.for) === i.address && L.unused,
      gift: (() => {
        const z = St();
        return z ? { player: z.player, from: z.from, source: z.source, amount: z.amount } : null;
      })(),
      giftPlays: St() ? Vt() : 0,
      playCost: Hn(It()),
      giftStop: In(),
      albumLock: zr(),
      returnPlan: tr(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: Yt("slots"),
      likeFunds: (() => {
        var gt;
        const z = ge();
        if (!z || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const pt = _();
        return { address: z, balance: pt, low: F(pt), album: $(), pending: !!oe(z), txid: (gt = oe(z)) == null ? void 0 : gt.txid, main: Xt() };
      })()
    };
  }, Is = () => G ? G < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", qt = (g, k = "") => {
    S = g, B = k, t.changed();
  };
  async function rn(g, k) {
    if (!u) {
      u = g, B = "", t.changed();
      try {
        await k();
      } catch (R) {
        const et = R instanceof Error ? R.message : String(R);
        B = /Cancelled in the listening wallet/.test(et) ? "" : et, B || (S = "Not now. Nothing was signed.", it = !0);
      } finally {
        u = null, await xn(!0);
      }
    }
  }
  const mn = () => !!(e != null && e.enabled) && e.here && (ut() || !!Xt() && e.allowed), Ls = () => mn() && !ee(), Si = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", zn = () => {
    if (ee()) throw new Error(Si());
  };
  async function Lr() {
    if (!mn()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const Gn = (g) => {
    const k = Xt();
    return g.request("listening.status", k ? { main: k } : void 0);
  };
  async function Cn(g = !1) {
    i != null && i.address && (!g && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now(), await Kr(g)));
  }
  async function Kr(g = !1) {
    const k = ge();
    if (!(!$() || !k || (i == null ? void 0 : i.state) !== "unlocked") && !(!g && (c == null ? void 0 : c.for) === k && t.now() - c.at < 3e4))
      try {
        c = { for: k, value: await t.chain.balance(k), at: t.now() };
      } catch {
      }
  }
  async function Ei(g) {
    if ((Q !== g || t.now() - tt >= 6e4) && (M = await t.links(g), Q = g, tt = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === g) return;
    const k = `${g}:${i.address}`;
    U === k && v || (v = M.find((R) => R.listening === i.address) ?? null, U = k);
  }
  async function Cs() {
    const g = i == null ? void 0 : i.address;
    if (!ut() || !g || i != null && i.linked || !t.funder || I || !o || o <= 0n) return;
    const k = ye(g);
    if (k != null && k.ok && k.funder) return;
    const R = k != null && k.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, P - 1), 30 * 6e4);
    if (!(q && q.for === g && t.now() - q.at < R)) {
      I = !0;
      try {
        q = { for: g, res: await t.funder(g), at: t.now() };
      } catch {
        q = { for: g, res: { ok: !1 }, at: t.now() };
      } finally {
        I = !1;
      }
      P = q.res.ok ? 0 : P + 1;
    }
  }
  async function yo() {
    const g = i == null ? void 0 : i.address;
    if (!(!ut() || !g || i != null && i.linked || !t.mainOf || D) && !(b && b.for === g && (b.ok || t.now() - b.at < 6e4))) {
      D = !0;
      try {
        b = { for: g, main: await t.mainOf(g), ok: !0, at: t.now() };
      } catch {
        b = { for: g, main: null, ok: !1, at: t.now() };
      } finally {
        D = !1;
      }
    }
  }
  async function Ue() {
    const g = i == null ? void 0 : i.address;
    if (!(!g || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (L == null ? void 0 : L.for) === g) && t.store.get(Lt("created", g)) !== "1")
      try {
        L = { for: g, unused: await t.chain.confirmedNonce(g) === 0n };
      } catch {
      }
  }
  async function lr() {
    var Et;
    const g = i == null ? void 0 : i.address;
    if (!g) return !1;
    let k, R = !1;
    const et = /* @__PURE__ */ new Map();
    for (const z of N())
      try {
        const pt = await t.chain.transaction(z.txid);
        if (!pt) {
          if (K.add(z.txid), t.now() - z.created > 15 * 6e4 && !et.has(z.address) && et.set(z.address, await t.chain.confirmedNonce(z.address)), k = et.get(z.address), k !== void 0 && k > BigInt(z.nonce)) {
            he({ ...z, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((z.status === "unknown" || z.status === "signed") && z.raw)
            try {
              await t.chain.broadcast(z.raw, z.txid), he({ ...z, status: "pending" });
            } catch (mt) {
              Ci(mt) && he({ ...z, status: "failed", note: mt.message, raw: void 0 });
            }
          continue;
        }
        K.delete(z.txid);
        const gt = String(pt.tx_status);
        if (gt === "success" && pt.canonical !== !1 && pt.is_unanchored === !1) {
          if (he({ ...z, status: "confirmed", confirmedAt: t.now(), actualFee: String(pt.fee_rate ?? z.fee), raw: void 0 }), R = !0, z.kind === "like" && (x = !0, z.status !== "confirmed" && typeof z.liked == "boolean"))
            try {
              (Et = t.likeConfirmed) == null || Et.call(t, z.song, z.liked);
            } catch {
            }
        } else gt.startsWith("abort_") || gt.startsWith("dropped_") ? he({ ...z, status: "failed", note: gt, raw: void 0 }) : z.status !== "pending" && he({ ...z, status: "pending" });
      } catch {
      }
    for (const z of $() ? [g, ge()] : [g]) {
      const pt = oe(z);
      if (pt)
        try {
          const gt = await t.chain.transaction(pt.txid), mt = String((gt == null ? void 0 : gt.tx_status) ?? "");
          (mt === "success" && gt.is_unanchored === !1 || mt.startsWith("abort_") || mt.startsWith("dropped_") || !gt && t.now() - pt.at > 2 * 36e5) && (Ee(null, z), mt === "success" && $n(2e4), a = -1 / 0, c = null, /on its way/i.test(S) && (S = ""));
        } catch {
        }
    }
    return R;
  }
  async function xn(g = !1) {
    var k;
    try {
      const R = Xt();
      if ((g || !e || r !== R || t.now() - n > 3e5) && (e = await t.config(R), n = t.now(), r = R), !e.enabled || !e.here || !ut() && (!R || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), at && Vr(), t.changed();
        return;
      }
      await Lr(), i = await Gn(s), ee() && i.state === "unlocked" && (fn(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await Gn(s)), R && e.allowed && await Ei(R), await Cn(g), await Cs(), await yo(), await Ue(), await yt(), await lr() && await Cn(!0), await Kr(), await ln(), G = 0;
    } catch {
      G++;
    }
    if (Ln() === "locked" ? vi() : at && Vr(), x) {
      x = !1;
      try {
        (k = t.likesChanged) == null || k.call(t);
      } catch {
      }
    }
    t.changed(), jt.length && !Fe && Sn();
  }
  async function Ai(g) {
    const k = i == null ? void 0 : i.root;
    if (!k || i != null && i.slot || !(i != null && i.address) || Yt("slots")) return;
    const R = Number(t.store.get(Lt("slot", k)));
    if (!(!Number.isSafeInteger(R) || R < 1))
      try {
        const { balance: et } = await t.chain.account(i.address);
        if (et >= ze + Hn(It())) return;
        await g.request("listening.openSlot", { slot: R }), i = await Gn(g), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function Ts(g, k) {
    var z;
    zn();
    const R = !(i != null && i.address) || We(i.address), et = i != null && i.linked ? (z = t.nameOf) == null ? void 0 : z.call(t, i.linked) : void 0;
    await g.request("listening.unlock", { mode: "unlock", terms: R ? f() : void 0, anyPasskey: k, ...Xt() ? { main: Xt() } : {}, ...et ? { label: et } : {} }), i = await Gn(g), R && (We(i.address) ? await m() : await g.request("listening.stop")), await Ai(g), qt(R ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const Et = p;
    p = null, Et && t.now() - Et.at < 12e4 && setTimeout(() => void xn(!0).then(() => En(Et)), 0);
  }
  function vi() {
    at || u || it || ct >= 3 || !s || !(i != null && i.address) || (at = !0, de = (async () => {
      try {
        await Ts(s, !1), ct = 0;
      } catch (g) {
        const k = g instanceof Error ? g.message : String(g);
        /Cancelled in the listening wallet/.test(k) ? $t || (it = !0, qt("Not now. Nothing was signed.")) : /did not answer/.test(k) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (ct++, B = k);
      } finally {
        at = !1;
        const g = $t;
        $t = null, g ? await g() : await xn(!0);
      }
    })());
  }
  async function Vr(g) {
    at && ($t = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await de), g && await g(), t.changed();
  }
  const f = () => ({
    fee: It().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: js.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function m() {
    if (!(i != null && i.address)) return !1;
    if (H || (H = await t.tabLock(i.address)), !H)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function A(g, k) {
    const R = i.address, { balance: et, nonce: Et } = k ?? await t.chain.account(R);
    o = et;
    const z = await s.request("listening.prepareReturn", {
      mode: g.mode,
      balance: et.toString(),
      nonce: Et.toString(),
      fee: $o.toString(),
      ...g.amount !== void 0 ? { amount: g.amount.toString() } : {},
      ...g.linked ? {} : { destination: g.to }
    });
    if (z.recipient !== g.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const pt = g.mode === "amount" ? g.amount : g.mode === "all" ? et - $o : et - js - $o, gt = Ec(z.raw);
    if (br(gt.payload.recipient).value !== g.to || String(gt.payload.amount) !== z.amount || pt !== void 0 && z.amount !== pt.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const mt = {
      id: Pl(),
      address: R,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: z.recipient,
      amount: z.amount,
      fee: z.fee,
      nonce: Et.toString(),
      created: t.now(),
      status: "signed",
      raw: z.raw,
      txid: z.txid
    };
    t.validate(mt), he(mt);
    try {
      await t.chain.broadcast(z.raw, z.txid), he({ ...mt, status: "pending" });
    } catch (Bt) {
      throw he({ ...mt, status: "unknown", note: Bt.message }), Bt;
    }
    return z;
  }
  const h = sl, J = $o;
  async function vt(g, k, R) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || !i.address) throw new Error("Unlock the listening wallet first.");
    if (Yt("slots") || Yt("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const et = i.slot ?? 0;
    if (g === k || ![g, k].includes(et) || ![g, k].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const Et = i.root ?? i.address, z = g === 0 ? Et : i.address, pt = k === 0 ? Et : i.address, { balance: gt, nonce: mt } = await t.chain.account(z);
    if (gt < R + J + ze) throw new Error(g === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const Bt = await s.request("listening.signMove", { from: g, to: k, amount: R.toString(), fee: J.toString(), nonce: mt.toString(), balance: gt.toString() }), Be = Ec(Bt.raw);
    if (Bt.from !== z || Bt.to !== pt || Bt.amount !== R.toString() || br(Be.payload.recipient).value !== pt || String(Be.payload.amount) !== R.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const Ke = {
      id: Pl(),
      address: z,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: pt,
      amount: Bt.amount,
      fee: Bt.fee,
      nonce: mt.toString(),
      created: t.now(),
      status: "signed",
      raw: Bt.raw,
      txid: Bt.txid
    };
    t.validate(Ke), he(Ke);
    try {
      await t.chain.broadcast(Bt.raw, Bt.txid), he({ ...Ke, status: "pending" });
    } catch (He) {
      throw he({ ...Ke, status: "unknown", note: He.message }), He;
    }
    return Ee({ txid: Bt.txid, amount: Bt.amount, at: t.now() }, pt), pt === Et && Et !== i.address ? c = null : a = -1 / 0, Bt;
  }
  let bt = !1;
  const zt = /* @__PURE__ */ new Map(), Ae = (g) => Lt("float", g);
  async function ln() {
    if (bt || (i == null ? void 0 : i.state) !== "unlocked" || !$() || Yt("move") || Yt("rootLike") || !i.address) return;
    const g = i.address;
    if (t.store.get(Ae(g)) === "1") return;
    const k = St();
    if (!(k != null && k.player) || k.state !== "arrived") return;
    const R = _();
    if (R === void 0 || o === void 0) return;
    if (!F(R)) {
      t.store.set(Ae(g), "1");
      return;
    }
    if (oe(ge()) || je() || N().length || o < h * 4n + ze + J) return;
    const et = zt.get(g);
    if (!(et && (et.n >= 3 || t.now() - et.at < 5 * 6e4))) {
      bt = !0, zt.set(g, { n: ((et == null ? void 0 : et.n) ?? 0) + 1, at: t.now() });
      try {
        await vt(i.slot ?? 0, 0, h), t.store.set(Ae(g), "1");
      } catch (Et) {
        console.warn("[radio] likes float not sent yet", Et);
      } finally {
        bt = !1;
      }
    }
  }
  async function un(g) {
    if (Se().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Yt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const k = await Gr().catch(() => null);
    if (!k)
      throw Y = null, kt = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    kt = !1, o = k.balance;
    const R = { balance: k.balance, nonce: k.nonce };
    if (g === "excess") {
      const gt = k0(k.parts) ?? ne();
      if (!gt) throw new Error("Choose where to send the excess first.");
      await A({ mode: "excess", to: gt, linked: !1 }, R), Y = null, qt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const et = k.steps;
    if (!et.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!Y && Y.balance === k.balance && t.now() - Y.at <= xi && Y.steps.length === et.length && Y.steps.every((gt, mt) => gt.to === et[mt].to && gt.mode === et[mt].mode && gt.send === et[mt].send))) {
      Y = {
        at: t.now(),
        balance: k.balance,
        steps: et,
        parts: k.parts,
        plan: { state: "ready", steps: et.map((gt) => ({ to: gt.to, kind: gt.kind, send: gt.send.toString() })), kept: k.tooSmall, excess: k0(k.parts) }
      }, qt(et.length > 1 ? `This goes back in ${et.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const z = et[0], pt = z.to ?? ne();
    if (!pt) throw new Error("Choose where to send the rest first.");
    if (z.mode === "amount" && Yt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await A({ mode: z.mode, to: pt, linked: !1, ...z.mode === "amount" ? { amount: z.send } : {} }, R), Y = null, et.length === 1 ? (en(!1), qt("Returned ✓ Paying is off.")) : qt(`Returned ✓ ${et.length - 1} more ${et.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const Ht = {
    forceRefresh: () => xn(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (g) => {
      if (!t.main() && !(g !== null && !Or(g))) {
        if (g === Rt()) return xn(!0);
        t.store.set(se, g ?? ""), B = "", S = "", o = void 0, a = -1 / 0, c = null, await xn(!0);
      }
    },
    create: () => rn("Waiting for your passkey…", async () => {
      const g = await Lr();
      await g.request("listening.unlock", { mode: "create", terms: f(), ...t.main() ? { main: t.main() } : {} }), i = await Gn(g), i.address && t.store.set(Lt("created", i.address), "1"), en(!0), qt(ut() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await m();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (g) => {
      g ? $n() : ae = null, t.changed();
    },
    giftSent: (g, k) => {
      !(i != null && i.address) || xt() || (Ee({ txid: g, amount: k.toString(), at: t.now() }), a = -1 / 0, C = null, qt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (g) => {
      if (zn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Yt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await Lr()).request("listening.bindSlot", { slot: g, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (g, k, R, et) => {
      Ee({ txid: R, amount: et.toString(), at: t.now() }, k), C = null, await Ht.openAlbum(g), qt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (g) => rn("Opening…", async () => {
      if (zn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Yt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (d || l || w) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === g) return;
      fn(), await s.request("listening.openSlot", { slot: g }), i = await Gn(s), o = void 0, a = -1 / 0, Y = null, kt = !1;
      const k = i.root;
      k && g > 0 && t.store.set(Lt("slot", k), String(g)), qt(g === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (g = !1) => {
      const k = () => rn("Waiting for your passkey…", async () => Ts(await Lr(), g));
      return at ? g ? Yt("cancel") ? (qt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Vr(async () => {
        (Ln() === "locked" || Ln() === "intro") && await k();
      }) : de : k();
    },
    link: () => rn("Sign in your wallet…", async () => {
      zn();
      const g = t.main();
      if (!g || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const k = (await t.links(g)).find((R) => R.listening === i.address);
      if (k)
        await s.request("listening.link", { main: g, issued: k.issued, mainSignature: k.mainSignature });
      else {
        const R = { main: g, listening: i.address, issued: t.now() }, et = await t.signWithMain(g, E5(R)), Et = await s.request("listening.link", { main: g, issued: R.issued, mainSignature: et });
        await t.saveLink({ ...R, mainSignature: et, listeningSignature: Et.listeningSignature }), tt = -1 / 0;
      }
      qt("Linked ✓");
    }),
    deposit: () => rn("Approve the deposit in your wallet…", async () => {
      zn();
      const g = t.main();
      if (!g || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (xt()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (Rn()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await Cn(!0);
      const k = Ml(o ?? 0n);
      if (k <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      j = await t.deposit(g, i.address, k), j && Ee({ txid: j, amount: k.toString(), at: t.now() }), qt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => rn("Approve the top-up in your wallet…", async () => {
      zn();
      const g = t.main(), k = ge();
      if (!g || !k) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (oe(k)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const R = await t.chain.balance(k);
      $() ? c = { for: k, value: R, at: t.now() } : (o = R, a = t.now());
      const et = Ml(R);
      if (et <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const Et = await t.deposit(g, k, et);
      Et && Ee({ txid: Et, amount: et.toString(), at: t.now() }, k), qt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (g) => rn("Adding plays…", async () => {
      if (zn(), !$()) throw new Error("Open the album you want to add plays to first.");
      if (!Qa.includes(g)) throw new Error("Choose one of the amounts offered.");
      const k = B5(g, It());
      if (d || l || w) throw new Error("Still sending a payment. Try again in a moment.");
      if (N().length || xt()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await vt(0, i.slot ?? 0, k), qt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => rn("Confirm in the listening wallet…", async () => {
      if (!Ls()) throw new Error("Connect your wallet first.");
      await m(), await s.request("listening.approveSession", f()), en(!0), qt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => rn("Clearing…", async () => {
      for (const g of V())
        await t.chain.transaction(g.txid) || he({ ...g, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      qt("Cleared ✓");
    }),
    switchOff: () => rn("Switching off…", async () => {
      fn(), await (s == null ? void 0 : s.request("listening.stop")), en(!1), qt("Music support is off. Playback is paused.");
    }),
    lock: () => rn("Locking…", async () => {
      fn(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, qt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (g) => {
      const k = String(g ?? "").trim();
      if (!(i != null && i.address)) return qt("", "Unlock the listening wallet first.");
      if (!Or(k)) return qt("", "Enter a standard mainnet address (it starts with SP).");
      if (k === i.address) return qt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(Jt(i.address), k), qt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(Jt(i.address), ""), t.changed();
    },
    returnFunds: (g) => rn("Check the return in the listening wallet…", async () => {
      if (!Ls()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (Ye()) return un(g);
      const k = $e();
      if (!k) throw new Error(ut() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (k.kind !== "linked" && Yt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Se().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await A({ mode: g, to: k.to, linked: k.kind === "linked" }), g === "all" && en(!1), qt(g === "all" ? k.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, jt = [], Qt = 10, Tn = 30 * 6e4;
  let Fe = !1;
  const je = () => d || !!u || l || w, fn = () => {
    jt.length && (jt.length = 0, t.changed());
  };
  async function Bn(g) {
    if (!jt.some((k) => k.id === g.id) && !De().some((k) => k.id === g.id) && (jt.push({ ...g, at: t.now() }), jt.length > Qt && jt.shift()), je() || Se().length) {
      const k = jt.length;
      S = `Queued ${k === 1 ? "this song" : k + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Sn();
  }
  async function Sn() {
    if (!Fe) {
      Fe = !0;
      try {
        for (; jt.length; ) {
          for (; jt.length && t.now() - jt[0].at > Tn; ) jt.shift();
          if (!jt.length || je() || await dn(jt[0]) === "wait") return;
          jt.shift();
        }
      } finally {
        Fe = !1, t.changed();
      }
    }
  }
  async function dn(g) {
    var k;
    d = !0;
    try {
      await xn();
      const R = Ln();
      if (R === "loading") return "wait";
      if (R !== "ready" || !We() || !(i != null && i.session) || i.session.playsLeft < 1 || !H) return "done";
      if (Se().length) return "wait";
      E || (await t.chain.verify(), E = !0);
      const et = i.address, { balance: Et, nonce: z } = await t.chain.account(et);
      o = Et, a = t.now();
      const pt = await t.chain.owner(Nl, g.song);
      if (pt === et || pt === Xt()) return "done";
      const gt = await s.request("listening.signPlay", {
        core: Nl,
        song: g.song,
        receipt: g.id,
        fee: It().toString(),
        nonce: z.toString(),
        balance: Et.toString()
      }), mt = {
        id: g.id,
        address: et,
        kind: "play",
        core: Nl,
        song: g.song,
        recipient: pt,
        amount: "50",
        fee: It().toString(),
        nonce: z.toString(),
        created: t.now(),
        status: "signed",
        raw: gt.raw,
        txid: gt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...g.title ? { title: String(g.title).slice(0, 120) } : {},
        ...g.artist ? { artist: String(g.artist).slice(0, 120) } : {}
      };
      t.validate(mt), he(mt);
      const Bt = g.title ? `“${g.title}”${g.artist ? ` by ${g.artist}` : ""}` : `song #${g.song}`;
      try {
        await t.chain.broadcast(gt.raw, gt.txid), he({ ...mt, status: "pending" }), S = `♪ Paid ${Bt}`, B = "";
      } catch (Be) {
        he({ ...mt, status: Ci(Be) ? "failed" : "unknown", note: Be.message, ...Ci(Be) ? { raw: void 0 } : {} }), B = Be.message;
      }
      return i = await Gn(s), "done";
    } catch (R) {
      const et = R instanceof Error ? R.message : "payment unavailable";
      return (k = St()) != null && k.player ? (S = "Payment is taking a moment: " + et, "wait") : (S = "This song played free: " + et, "done");
    } finally {
      d = !1, t.changed();
    }
  }
  function ki(g) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Ln()) || Yt("like") ? !1 : (En(g), !0);
  }
  async function En(g) {
    const k = g.title ? `“${g.title}”` : `song #${g.song}`, R = (Ve) => {
      var Cr;
      B = Ve, S = "";
      try {
        (Cr = t.likeFailed) == null || Cr.call(t, g.song);
      } catch {
      }
      t.changed();
    }, et = $(), Et = Ln(), z = Xt(), pt = et && (Et === "fund" || Et === "over") ? "ready" : Et, gt = ut() ? ge() : z;
    if (pt === "locked") {
      p = { ...g, at: t.now() }, qt(`Unlock to like ${k}. It sends straight after.`);
      return;
    }
    if (pt === "wrong-wallet") return R(Si());
    if (pt === "link") return R("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (ut() && Yt("standalone")) return R("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (pt === "fund") return R("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (pt === "over") return R("Return the excess first: the listening wallet holds more than 1 STX.");
    if (et) {
      await Kr(!0);
      const Ve = _();
      if (F(Ve))
        return t.changed(), R(Ic);
    }
    if (pt !== "ready" || !gt) return R("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return R("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!H) return R("Pay-per-play is running in another tab. Like from that tab.");
    const mt = De(ge()).find((Ve) => Ve.kind === "like" && Ve.song === g.song);
    if (mt && Io.includes(mt.status))
      return R(`Your last like for ${k} is still on its way. It can change again once it confirms.`);
    if (l) return R("One like at a time: your last one is still being sent.");
    if ((mt == null ? void 0 : mt.status) === "confirmed" && t.now() - (mt.confirmedAt ?? 0) < N5)
      return R(`Your like for ${k} has only just confirmed. Try again in a moment.`);
    let Bt;
    w = !0;
    try {
      Bt = t.likeState ? (await t.likeState(gt, g.song)).by : g.likedBy ?? [];
    } catch {
      Bt = g.likedBy;
    } finally {
      w = !1;
    }
    if (!Bt) return R(`Could not check ${k} right now. Try the heart again.`);
    const Be = ge(), He = ((mt == null ? void 0 : mt.status) === "confirmed" && typeof mt.liked == "boolean" && t.now() - (mt.confirmedAt ?? mt.created) < 5 * 6e4 ? mt.liked : void 0) ?? Bt.includes(Be);
    if (!He && Bt.some((Ve) => Ve !== Be)) return R(ut() ? `${k} was liked from another wallet of yours. Unlike it there.` : `${k} was liked from your main wallet${Bt.includes(z) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await dt({ song: g.song, liked: !He, title: g.title, artist: g.artist });
  }
  async function dt(g) {
    var et, Et, z;
    if (l) {
      qt("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const k = g.title ? `“${g.title}”${g.artist ? ` by ${g.artist}` : ""}` : `song #${g.song}`, R = t.wait ?? ((pt) => new Promise((gt) => setTimeout(gt, pt)));
    try {
      qt(`${g.liked ? "Liking" : "Unliking"} ${k}…`);
      const pt = t.now() + 12e4;
      for (; d || ($() ? De(ge()).some((He) => Io.includes(He.status)) : Se().length); ) {
        if (t.now() > pt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await R(5e3), await xn(!0);
      }
      if (!$() && Ln() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const gt = ge(), { balance: mt, nonce: Bt } = await t.chain.account(gt);
      if ($() ? c = { for: gt, value: mt, at: t.now() } : (o = mt, a = t.now()), F(mt)) throw new Error(Ic);
      const Be = await s.request("listening.signLike", {
        song: g.song,
        liked: g.liked,
        fee: Bl.toString(),
        nonce: Bt.toString(),
        balance: mt.toString()
      }), Ke = {
        id: Pl(),
        address: gt,
        kind: "like",
        core: 0,
        song: g.song,
        liked: g.liked,
        recipient: "",
        amount: "0",
        fee: Bl.toString(),
        nonce: Bt.toString(),
        created: t.now(),
        status: "signed",
        raw: Be.raw,
        txid: Be.txid,
        ...g.title ? { title: String(g.title).slice(0, 120) } : {},
        ...g.artist ? { artist: String(g.artist).slice(0, 120) } : {}
      };
      t.validate(Ke), he(Ke);
      try {
        await t.chain.broadcast(Be.raw, Be.txid), he({ ...Ke, status: "pending" }), S = `${g.liked ? "♥ Liked" : "Unliked"} ${k}`, B = "";
        try {
          (et = t.likeSent) == null || et.call(t, g.song, g.liked);
        } catch {
        }
      } catch (He) {
        if (he({ ...Ke, status: Ci(He) ? "failed" : "unknown", note: He.message, ...Ci(He) ? { raw: void 0 } : {} }), B = He.message, Ci(He)) try {
          (Et = t.likeFailed) == null || Et.call(t, g.song);
        } catch {
        }
      }
      i = await Gn(s);
    } catch (pt) {
      B = "Like not sent: " + (pt instanceof Error ? pt.message : "the listening wallet is unavailable");
      try {
        (z = t.likeFailed) == null || z.call(t, g.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), Sn();
    }
  }
  return { snapshot: go, refresh: xn, onListened: Bn, heart: ki, toggleLike: En, ...Ht };
}
const Sw = ["Connect", "Passkey", "Link & fund", "Listen"], Ew = ["Passkey", "Add 1 STX", "Listen"], Ku = (t) => t ? Ew : Sw;
function _5(t) {
  if (t.solo) return U5(t);
  const e = Sw.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function U5(t) {
  const e = Ew.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function H5(t, e) {
  return !e || e.at >= Ku(!!t.solo).length || t.heard || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const O5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function D5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !O5(r.id)));
}
const F5 = {}, j5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, R5 = (t) => {
  const e = F5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, z5 = (t) => `/hiro/${t}`, G5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, K5 = (t) => {
  const e = R5(t);
  if (e)
    return [G5(e)];
  const n = j5[t];
  return typeof window < "u" ? [`${window.location.origin}${z5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, V5 = {}, $0 = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, q5 = "xtrata.log.enabled", W5 = "xtrata.log.level", Y5 = "xtrata.log.tags", X5 = "xtrata.log.dedupe", Oa = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, Z5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, Q5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, J5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, t6 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, e6 = () => {
  const t = V5 ?? {}, e = Oa(q5) ?? t.VITE_LOG_ENABLED, n = Oa(W5) ?? t.VITE_LOG_LEVEL, r = Oa(Y5) ?? t.VITE_LOG_TAGS, s = Oa(X5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: Z5(e),
    level: Q5(n) ?? "warn",
    tags: t6(r),
    dedupe: J5(s)
  };
}, n6 = (t, e, n) => !t.enabled || $0[n] < $0[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), r6 = (t, e, n, r) => {
  const s = e6();
  if (!n6(s, e, t) || i6(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, s6 = /* @__PURE__ */ new Set();
let I0 = null;
const i6 = (t, e, n, r, s) => (I0 !== t && (s6.clear(), I0 = t), !1), o6 = (t, e, n) => r6("debug", t, e, n), a6 = {}, c6 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, l6 = (t) => {
  const e = a6, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : c6[t];
}, u6 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, f6 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return u6.test(n) ? n : null;
}, d6 = (t) => t.replace(/\/+$/, ""), h6 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), L0 = (t) => {
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
}, Ti = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, p6 = (t) => {
  var c, u;
  let e;
  try {
    e = br(hk(t));
  } catch {
    return null;
  }
  const n = Ti(e);
  if (!n || n.success === !1)
    return null;
  const r = Ti(n.value), s = Ti(r == null ? void 0 : r.value), i = Ti(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = L0((c = Ti(i.name)) == null ? void 0 : c.value), a = L0((u = Ti(i.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : f6(`${o}.${a}`);
}, g6 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${d6(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [ew(Oy(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : p6(i.result);
}, y6 = async (t) => {
  const e = t.address.trim();
  if (!Ri(e))
    return null;
  const n = l6(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of K5(t.network))
    try {
      return await g6({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return o6("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: h6(r)
  }), null;
};
function w6(t, e, n = {}) {
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
const C0 = Object.freeze({
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
}), T0 = Object.freeze({ 139: "melophonic" });
function b6(t, e = "") {
  const n = String(t);
  return Object.hasOwn(C0, n) ? C0[n] : Object.hasOwn(T0, n) ? T0[n] : e;
}
const B0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function m6(t, e = "") {
  return Object.hasOwn(B0, String(t)) ? B0[String(t)] : e;
}
const Aw = 10000n, od = 1000000n, Lc = 3000n, x6 = (t, e) => `${t}#gift=${e}`, S6 = 100, Da = (t, e = mi) => t <= ze ? 0 : Number((t - ze) / Hn(e)), M0 = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), vw = "xtrata.xyz/radio/gifts", _l = S6, E6 = "Create a prefunded Xtrata radio gift batch", A6 = (t) => ({
  domain: ai({ name: Je(vw), version: Je("1"), "chain-id": Er(1) }),
  message: ai({
    purpose: Je(E6),
    creator: Je(t.creator),
    count: Er(t.count),
    amount: Er(BigInt(t.amount)),
    label: Je(t.label),
    issued: Er(t.issued),
    ...t.player ? { player: Je(t.player) } : {}
  })
}), v6 = (t, e, n = mi) => ze + BigInt(t) * Hn(n) + (e ? sl : 0n), k6 = (t, e = mi) => Number((od - ze - (t ? sl : 0n)) / Hn(e)), $6 = (t, e) => BigInt(t) * (e + Lc);
function I6(t, e, n, r = mi) {
  const s = n ? sl : 0n, i = e > ze + s ? e - ze - s : 0n, o = Number(i / Hn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * vc,
    fees: BigInt(o) * r,
    reserve: ze,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: Lc,
    perCopy: e + Lc,
    total: $6(t, e)
  };
}
const L6 = (t) => t >= Aw && t <= od, N0 = 40, C6 = "Create an Xtrata radio gift player", T6 = /^[^\u0000-\u001f\u007f<>]+$/u;
function P0(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && T6.test(t) : !n;
}
function B6(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!P0(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!P0(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > N0) throw new Error(`A player holds 1 to ${N0} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const M6 = (t) => jp(qp(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), N6 = (t) => ({
  domain: ai({ name: Je(vw), version: Je("1"), "chain-id": Er(1) }),
  message: ai({
    purpose: Je(C6),
    admin: Je(t.admin),
    player: Je(t.hash),
    issued: Er(t.issued)
  })
}), Ks = (t) => t.tracks.filter((e) => !e.hidden), P6 = (t) => t.tracks.find((e) => e.hidden) ?? null, _6 = [300, 500, 1e3], _0 = 1800, Ul = /* @__PURE__ */ new Map();
async function U6(t) {
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
function H6(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = Ul.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      Ul.set(t, { ...a, until: Date.now() + _0 });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Ul.delete(t), s();
      }, _0 + 50);
    }
  }, i;
}
const Fi = (t, e, n, r, s) => H6(t, e, async () => await U6(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), Ms = "xtrata.radio.gift.incoming.v1", U0 = (t) => "xtrata.radio.gift.mine.v1:" + t, H0 = (t) => "xtrata.radio.gift.batches.v1:" + t, At = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Nr = (t, e, n = "") => {
  const r = At("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, Fa = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, Wn = (t) => gr(t).replace(/\.?0+$/, "");
function O6(t) {
  let e = null;
  const n = ($) => [5e3, 1e4, 2e4, 3e4][$] ?? 6e4, r = (() => {
    try {
      const $ = new URL(location.href), _ = new URLSearchParams($.hash.slice(1)).get("gift") ?? $.searchParams.get("gift");
      return _ !== null && ($.searchParams.delete("gift"), history.replaceState(null, "", $.pathname + ($.search || ""))), M0(_) ? _ : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const $ = JSON.parse(t.store.get(Ms) || "null");
      return M0($ == null ? void 0 : $.code) ? $.code : null;
    } catch {
      return null;
    }
  })(), i = r ?? s;
  if (i) {
    e = { code: i }, t.store.set(Ms, JSON.stringify({ code: i, at: t.now() }));
    let $ = 0;
    const _ = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (F) => {
      const V = await F.json().catch(() => ({}));
      if (F.status === 404) {
        t.store.set(Ms, null), e = { ...e, error: (V == null ? void 0 : V.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!F.ok) throw new Error("busy");
      const ht = V;
      e = { ...e, view: ht, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(ht.status) && t.store.set(Ms, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void _(), n($++)));
    });
    _();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    const $ = e == null ? void 0 : e.view;
    return !($ != null && $.player) || !o() ? null : { player: $.player, from: u($), plays: Da(BigInt($.amount)) };
  }, c = () => {
    e = null, t.store.set(Ms, null), t.changed();
  }, u = ($) => $.from ? t.who($.from) : $.label ? `Xtrata Radio · ${$.label}` : "Xtrata Radio";
  let d = {};
  const l = ($) => {
    if (d.box) return d.box;
    const _ = At("div", "", "ppp-gift-check");
    d.box = _;
    const F = () => {
      const V = window.turnstile;
      !V || d.rendered || (d.rendered = !0, V.render(_, { sitekey: $, callback: (ht) => {
        d.token = ht, t.changed();
      }, "expired-callback": () => {
        d.token = void 0;
      } }));
    };
    if (window.turnstile) F();
    else {
      const V = document.createElement("script");
      V.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", V.async = !0, V.onload = F, document.head.append(V);
    }
    return _;
  }, w = ($) => {
    queueMicrotask(() => void $());
  };
  let p;
  async function x($) {
    var V, ht, ut, ee, Jt, ne, ye, $e, _e;
    if (!e || e.claiming || !$.listening) return;
    const _ = !!((V = e.view) != null && V.player);
    if (_ && !$.root) return;
    e.claiming = !0, e.error = void 0, (ht = t.claiming) == null || ht.call(t, !0), t.changed();
    const F = async (St) => {
      const yt = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: d.token, ...St })
      });
      return { res: yt, r: await yt.json().catch(() => ({})) };
    };
    try {
      let St = 0, yt = $.listening, Zt;
      if (_) {
        const ce = Number((ut = await t.json("/radio/gift/slots?root=" + encodeURIComponent($.root))) == null ? void 0 : ut.next);
        if (!Number.isSafeInteger(ce) || ce < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        St = ce;
        for (let In = 0; ; In++) {
          const nn = await t.album.bind(St);
          if (yt = nn.address, Zt = await F({ wallet: yt, binding: nn }), Zt.res.status === 409 && /just taken/.test(((ee = Zt.r) == null ? void 0 : ee.error) || "") && In < 5) {
            St += 1;
            continue;
          }
          break;
        }
      } else Zt = await F({ wallet: yt });
      const { res: Vt, r: we } = Zt;
      if (Vt.status === 503 && /sending another gift/.test((we == null ? void 0 : we.error) || "")) {
        e.waiting = !0, (Jt = t.claiming) == null || Jt.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!Vt.ok) {
        const ce = String((we == null ? void 0 : we.error) || "");
        if (Vt.status === 404 || Vt.status === 410 || Vt.status === 409 && /already had a gift|brand-new|already have this album/.test(ce))
          throw t.store.set(Ms, null), new Error(ce || "This gift cannot be opened.");
        if (Vt.status === 429 || Vt.status === 403 || Vt.status === 400 && !/wallet number/i.test(ce)) throw new Error(ce || `Could not open the gift (${Vt.status}).`);
        const nn = /topping up/.test(ce) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(ce) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(ce) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(nn), { retry: !0, slow: /topping up|not paid for yet/.test(ce) });
      }
      e.done = !0, t.store.set(Ms, null), _ ? await t.album.arrived(St, yt, we.txid, BigInt(we.amount)) : t.giftSent(we.txid, BigInt(we.amount));
    } catch (St) {
      const yt = St, Zt = yt.name === "TypeError" || yt.name === "AbortError" || yt.name === "TimeoutError" || /wallet number/i.test(yt.message);
      if (yt.retry || Zt) {
        const Vt = e.tries ?? 0;
        e.tries = Vt + 1, e.retry = { text: yt.retry ? yt.message : "Still sending your gift… the network is slow, trying again." }, (ne = t.claiming) == null || ne.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, yt.slow ? 6e4 : n(Vt));
      } else
        e.error = yt.message, (ye = t.claiming) == null || ye.call(t, !1);
      d.token = void 0;
      try {
        (_e = ($e = window.turnstile) == null ? void 0 : $e.reset) == null || _e.call($e, d.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let S = null;
  function B($) {
    if (!$.listening || !$.depositPending || $.step !== "fund")
      return S = null, [];
    if (!S || S.wallet !== $.listening || t.now() - S.at > 3e4) {
      const F = $.listening;
      S = { ...(S == null ? void 0 : S.wallet) === F ? S : {}, wallet: F, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(F)).then((V) => {
        var ht, ut;
        (S == null ? void 0 : S.wallet) === F && (S.state = (ht = V == null ? void 0 : V.gift) == null ? void 0 : ht.state, S.problem = ((ut = V == null ? void 0 : V.gift) == null ? void 0 : ut.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(S.state === "sending" && S.problem)) return [];
    const _ = At("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return _.title = `Network reply: ${S.problem}`, [_];
  }
  function G($, _, F = !1) {
    var ne, ye;
    const V = _.player, ht = BigInt(_.amount), ut = F ? [] : [At("p", `🎁 ${u(_)} sent you “${V.title}”${V.subtitle ? ` by ${V.subtitle}` : ""}: ${Ks(V).length} ${Ks(V).length === 1 ? "song" : "songs"} and ${Da(ht).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!$.root && ["fund", "ready", "over", "link"].includes($.step))) {
      if (F) return ut;
      if (ut.push(At("p", $.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : $.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), $.step === "intro") {
        const $e = document.createElement("details");
        $e.className = "ppp-how";
        const _e = document.createElement("summary");
        _e.textContent = "How does this work?", $e.append(_e, At("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), ut.push($e);
      }
      return ut;
    }
    if ($.walletCannotAlbums)
      return ut.push(At("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), ut;
    const Jt = (ye = (ne = $.gate) == null ? void 0 : ne.gifts) == null ? void 0 : ye.turnstileSiteKey;
    return Jt && !d.token ? ut.push(At("p", "One quick check and it is yours:", "ppp-mute"), l(Jt)) : !e.claiming && !e.error && !e.waiting && !e.retry && w(() => x($)), ut.push(...j($, "Sending your album…")), ut;
  }
  function j($, _) {
    const F = [];
    return e.claiming || e.waiting ? F.push(At("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : _, "ppp-cyan")) : e.retry && F.push(At("p", e.retry.text, "ppp-warn"), Nr("Try now", () => {
      clearTimeout(p), e.retry = void 0, x($);
    }, "quiet")), e.error && F.push(At("p", e.error, "ppp-bad"), Nr("Try again", () => {
      e.error = void 0, x($);
    })), F;
  }
  const v = ($) => {
    var _;
    return !!e && !e.done && !e.error && o() && !!$.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !$.linked && !$.creditedTo && ($.createdHere || $.brandNew || !!((_ = e.view) != null && _.player)) && ($.balance ?? 0n) === 0n && !$.entries.length);
  };
  function U($, _ = {}) {
    var _e, St;
    const F = B($);
    if (!e || ["off", "elsewhere"].includes($.step)) return F;
    const V = e.view;
    if (e.error && !V) return [At("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!V) return [At("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return F;
    if (V.status === "claimed" || V.status === "claiming") return [At("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(V.status)) return [At("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (V.status === "pending-deposit") return [At("p", `🎁 ${u(V)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (V.player) return [...G($, V, !!_.bare), ...F];
    if (!!$.listening && (!($.createdHere || $.brandNew) || !!$.linked || !!$.creditedTo || ($.balance ?? 0n) > 0n || $.entries.length > 0))
      return [At("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), Nr("Forget this gift link here", c, "quiet")];
    const ut = BigInt(V.amount), ee = Da(ut).toLocaleString(), ne = [At(
      "p",
      `🎁 ${u(V)} sent you ${Wn(ut)} STX of on-chain music: about ${ee} paid plays.`,
      "ppp-gift"
    )], ye = !!$.listening && ($.createdHere || $.brandNew) && !$.linked && !$.creditedTo && $.step === "fund" && ($.balance ?? 1n) === 0n && !$.depositPending && !$.entries.length, $e = (St = (_e = $.gate) == null ? void 0 : _e.gifts) == null ? void 0 : St.turnstileSiteKey;
    return ye ? ($e && !d.token ? ne.push(At("p", "One quick check and it is yours:", "ppp-mute"), l($e)) : !e.claiming && !e.error && !e.waiting && !e.retry && w(() => x($)), ne.push(...j($, "Sending your gift…"))) : $.step === "intro" ? ne.push(At("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : $.listening && $.linked ? ne.push(At("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), Nr("Forget this gift link here", c, "quiet")) : $.listening && ($.balance ?? 0n) > 0n && ne.push(At("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), Nr("Forget this gift link here", c, "quiet")), ne;
  }
  async function M($, _, F) {
    var V;
    try {
      const ht = await t.json("/radio/gift/for?wallet=" + encodeURIComponent($));
      if ((V = ht == null ? void 0 : ht.gift) != null && V.returnTo) return { ok: !0, funder: ht.gift.returnTo, txId: ht.gift.txid ?? void 0, amount: ht.gift.amount, distinct: 1 };
    } catch {
      if (F) return { ok: !1 };
    }
    return _();
  }
  const Q = At("div", "", "ppp-gift-fold");
  let tt = 250000n, K = "", q = "";
  const I = ($) => {
    try {
      const _ = JSON.parse(t.store.get(U0($)) || "[]");
      return Array.isArray(_) ? _ : [];
    } catch {
      return [];
    }
  }, P = ($, _) => t.store.set(U0($), JSON.stringify(_.slice(0, 50)));
  async function b($) {
    const _ = I($);
    for (const F of _)
      if (!(F.view && ["claimed", "refunded", "expired"].includes(F.view.status)))
        try {
          F.view = !F.view || F.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: F.id, ...F.txid ? { txid: F.txid } : {} }) }) : await t.json("/radio/gift?id=" + F.id), F.error = void 0;
        } catch (V) {
          F.error = V.message;
        }
    P($, _), t.changed();
  }
  async function L($) {
    if (K) return;
    K = "Starting your gift…", q = "", t.changed();
    let _ = null;
    try {
      _ = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: $, amount: tt.toString() }) });
      const F = I($);
      F.unshift({ id: _.id, code: _.code, amount: tt.toString(), at: t.now() }), P($, F), K = "Approve the gift in your wallet…", t.changed();
      const V = await t.pay($, _.depositTo, BigInt(_.deposit), _.memo), ht = I($), ut = ht.find((ee) => ee.id === _.id);
      ut && (ut.txid = V, ut.view = { status: "pending-deposit", amount: tt.toString(), source: "friend", from: $, label: "", expires: 0 }), P($, ht), q = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", b($);
    } catch (F) {
      q = F.message || "Not sent.";
    } finally {
      K = "", t.changed();
    }
  }
  const D = ($) => "xtrata.radio.gift.players.v1:" + $, C = ($) => {
    try {
      const _ = JSON.parse(t.store.get(D($)) || "[]");
      return Array.isArray(_) ? _.filter((F) => F && /^[0-9a-f]{16}$/.test(F.id)) : [];
    } catch {
      return [];
    }
  };
  async function rt($, _) {
    var F;
    if (!K) {
      K = "Checking the player…", q = "", t.changed();
      try {
        const V = _.tracks.split(/[\s,]+/).filter(Boolean).map((ye) => Number(ye.replace(/^#/, ""))), ht = B6({ title: _.title.trim(), subtitle: _.subtitle.trim(), tracks: V, cover: (F = _.cover) != null && F.trim() ? Number(_.cover.trim().replace(/^#/, "")) : null });
        K = "Sign in your wallet…", t.changed();
        const ut = { admin: $, hash: M6(ht), issued: t.now() }, ee = await t.sign($, N6(ut));
        K = "Making the player…", t.changed();
        const Jt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: ht, request: ut, signature: ee }) }), ne = C($).filter((ye) => ye.id !== Jt.id);
        ne.unshift({ id: Jt.id, title: Jt.title, tracks: Jt.tracks }), t.store.set(D($), JSON.stringify(ne.slice(0, 30))), q = `${Jt.existing ? "That player already exists" : "Player made"} ✓ “${Jt.title}” · ${Jt.tracks} songs. Pick it below for a batch.`;
      } catch (V) {
        q = V.message || "Not made.";
      } finally {
        K = "", t.changed();
      }
    }
  }
  const Y = ($, _) => x6($ || location.origin + "/radio.html", _), kt = ($) => {
    try {
      const _ = JSON.parse(t.store.get(H0($)) || "[]");
      return Array.isArray(_) ? _.filter((F) => F && /^[0-9a-f]{16}$/.test(F.id) && Array.isArray(F.codes)) : [];
    } catch {
      return [];
    }
  }, E = ($, _) => t.store.set(H0($), JSON.stringify(_.slice(0, 20))), H = ($) => !!$.view && $.view.status === "live" && $.view.copies.waiting + $.view.copies.claiming + $.view.copies.refunding === 0, at = ($, _) => t.json($, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(_) });
  let it = 0;
  async function ct($) {
    const _ = kt($);
    for (const F of _)
      if (!H(F))
        try {
          F.view = !F.view || F.view.status === "pending-deposit" ? await at("/radio/gift/batch/confirm", { id: F.id, ...F.txid ? { txid: F.txid } : {} }) : await t.json("/radio/gift/batch?id=" + F.id), F.error = void 0;
        } catch (V) {
          F.error = V.message;
        }
    try {
      const F = await t.json("/radio/gift/batches?creator=" + encodeURIComponent($));
      for (const V of (F == null ? void 0 : F.batches) ?? []) {
        const ht = _.find((ut) => ut.id === V.id);
        if (ht) {
          ht.error || (ht.view = V);
          continue;
        }
        _.push({ id: V.id, codes: [], count: V.count, amount: V.amount, label: V.label, player: V.player, depositTo: "", deposit: V.deposit, memo: V.memo, at: 0, view: V });
      }
    } catch {
    }
    E($, _), t.changed();
  }
  async function $t($, _) {
    const F = kt($).find((V) => V.id === _);
    if (!(!F || !F.depositTo || K)) {
      K = "Approve the payment in your wallet…", q = "", t.changed();
      try {
        const V = await t.pay($, F.depositTo, BigInt(F.deposit), F.memo), ht = kt($), ut = ht.find((ee) => ee.id === _);
        ut && (ut.txid = V), E($, ht), q = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", K = "", ct($);
      } catch (V) {
        q = `${/cancel/i.test(V.message) ? "Payment cancelled." : V.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        K = "", t.changed();
      }
    }
  }
  async function de($, _, F, V) {
    if (K) return;
    if (!_.ok) {
      q = _.reason, t.changed();
      return;
    }
    K = "Sign in your wallet…", q = "", t.changed();
    let ht = null;
    try {
      const ut = { creator: $, count: _.count, amount: _.amount.toString(), label: F, issued: t.now(), ...V ? { player: V } : {} }, ee = await t.sign($, A6(ut));
      K = "Making your links…", t.changed(), ht = await at("/radio/gift/batch", { request: ut, signature: ee });
      const Jt = kt($);
      Jt.unshift({ id: ht.id, codes: ht.codes, count: _.count, amount: ht.amount, label: F, player: V ?? null, depositTo: ht.depositTo, deposit: ht.deposit, memo: ht.memo, at: t.now() }), E($, Jt);
    } catch (ut) {
      q = ut.message || "Not made.", K = "", t.changed();
      return;
    }
    K = "", t.changed(), await $t($, ht.id);
  }
  function It() {
    const $ = !!xt.value, _ = oe.value === "max" ? k6($) : Number(oe.value), F = v6(_, $), V = Number(Ee.value);
    return !Number.isInteger(V) || V < 1 || V > _l ? { ok: !1, reason: `Make 1 to ${_l} copies at a time.`, album: $, plays: _, amount: F, count: V } : L6(F) ? { ok: !0, reason: "", album: $, plays: _, amount: F, count: V, bill: I6(V, F, $) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: $, plays: _, amount: F, count: V };
  }
  const Yt = () => {
    const $ = It();
    if (!$.ok) return $.reason;
    const _ = $.bill;
    return `Each copy: ${$.plays.toLocaleString()} paid plays (${Wn(_.holders)} to song holders, ${Wn(_.fees)} network fees)${$.album ? `, ${Wn(_.float)} for the album’s likes` : ""}, ${Wn(_.reserve)} kept so a listener can return what is left, + ${Wn(_.sendFee)} to send it = ${Wn(_.perCopy)} STX. ${$.count} copies = ${Wn(_.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Lt = ($, _) => _.codes.map((F) => Y($, F)), se = At("input");
  se.type = "range", se.min = String(Aw), se.max = String(od), se.step = "10000", se.value = String(tt), se.setAttribute("aria-label", "Gift amount");
  const Rt = At("p", "", "ppp-gift-amount"), Xt = Nr("", () => {
    const $ = t.main();
    $ && L($);
  }, "primary"), De = () => {
    Rt.textContent = he(), Xt.textContent = `Gift ${Wn(tt)} STX`;
  };
  se.oninput = () => {
    tt = BigInt(se.value), De();
  };
  const he = () => `${Wn(tt)} STX · about ${Da(tt).toLocaleString()} paid plays · you pay ${Wn(tt + Lc)} STX with the network fee`;
  De();
  const We = At("input");
  We.maxLength = 60, We.placeholder = "Title, e.g. Proof of Sound", We.setAttribute("aria-label", "Player title");
  const en = At("input");
  en.maxLength = 80, en.placeholder = "Artist (optional)", en.setAttribute("aria-label", "Player subtitle");
  const Se = At("textarea");
  Se.rows = 3, Se.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Se.setAttribute("aria-label", "Songs");
  const N = At("input");
  N.inputMode = "numeric", N.placeholder = "Cover inscription number (optional), shown when the album loads", N.setAttribute("aria-label", "Cover inscription");
  const xt = At("select");
  xt.setAttribute("aria-label", "Batch album");
  const oe = At("select");
  oe.setAttribute("aria-label", "Plays per copy");
  for (const $ of _6) oe.append(Fa(`${$.toLocaleString()} plays`, String($)));
  oe.append(Fa("Max (1 STX)", "max"));
  const Ee = At("input");
  Ee.type = "number", Ee.min = "1", Ee.max = String(_l), Ee.value = "10", Ee.setAttribute("aria-label", "Copies");
  const ae = At("input");
  ae.maxLength = 40, ae.placeholder = "Label, e.g. Opera launch", ae.setAttribute("aria-label", "Batch label");
  const $n = At("p", "", "ppp-mute"), Rn = () => {
    $n.textContent = Yt();
  };
  for (const $ of [xt, oe, Ee])
    $.oninput = Rn, $.onchange = Rn;
  Rn();
  function Ge($) {
    var ht, ut;
    const _ = (ht = $.gate) == null ? void 0 : ht.gifts;
    if (!(_ != null && _.enabled) || !_.admin || ["off", "elsewhere", "unsupported"].includes($.step)) return null;
    const F = t.main(), V = [At("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!F)
      V.push(At("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (_.admin) {
      const ee = At("div", "", "ppp-gift-admin"), Jt = (St, yt) => {
        const Zt = At("label", St);
        return Zt.append(yt), Zt;
      }, ne = C(F);
      ee.append(
        At("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        We,
        en,
        Se,
        N,
        Nr("Sign and make player", () => void rt(F, { title: We.value, subtitle: en.value, tracks: Se.value, cover: N.value }))
      );
      const ye = Nr("Sign, pay and make links", () => {
        de(F, It(), ae.value.trim(), xt.value || void 0);
      });
      ye.disabled = !!K;
      const $e = xt.value;
      xt.replaceChildren(Fa("No album (starter copies)", ""), ...ne.map((St) => Fa(`${St.title} · ${St.tracks} songs`, St.id))), ne.some((St) => St.id === $e) && (xt.value = $e), Rn(), ee.append(
        At("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        Jt("Album ", xt),
        Jt("Plays each ", oe),
        Jt("Copies ", Ee),
        ae,
        $n,
        ye
      ), t.now() - it > 3e4 && (it = t.now(), ct(F));
      const _e = kt(F);
      if (_e.length) {
        const St = At("ul", "", "ppp-gift-list");
        for (const yt of _e.slice(0, 10)) {
          const Zt = yt.view, Vt = Zt == null ? void 0 : Zt.copies, we = yt.error ? yt.error : !Zt || Zt.status === "pending-deposit" ? yt.txid ? "payment confirming…" : "waiting for your payment" : `${Vt.claimed} of ${Zt.count} claimed${Vt.refunding + Vt.refunded ? ` · ${Vt.refunded} refunded${Vt.refunding ? `, ${Vt.refunding} on their way` : ""}` : ""}`, ce = At("li");
          if (ce.append(At("span", `${yt.label || "Batch"} · ${yt.count} × ${Wn(BigInt(yt.amount))} STX`, "t"), At("span", we, "ppp-mute")), !yt.txid && yt.depositTo && (!Zt || Zt.status === "pending-deposit") && ce.append(Nr("Pay now", () => void $t(F, yt.id), "tiny")), yt.codes.length && (Zt == null ? void 0 : Zt.status) === "live") {
            const In = Lt(((ut = $.gate) == null ? void 0 : ut.radioUrl) ?? null, yt);
            ce.append(
              Fi("batch-copy:" + yt.id, "Copy all links", () => In.join(`
`), "tiny", t.changed),
              Fi("batch-csv:" + yt.id, "Copy as CSV", () => ["copy,link", ...In.map((nn, zr) => `${zr + 1},${nn}`)].join(`
`), "tiny", t.changed)
            );
          } else yt.codes.length || ce.append(At("span", "links were made on another device", "ppp-mute"));
          St.append(ce);
        }
        ee.append(St);
      }
      V.push(ee);
    }
    return K && V.push(At("p", K, "ppp-cyan")), q && V.push(At("p", q, /✓/.test(q) ? "ppp-ok" : "ppp-warn")), Q.replaceChildren(...V), Q;
  }
  return { banner: U, funder: M, renderFold: Ge, liveGift: o, incomingAlbum: a, setAside: c, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: v };
}
const D6 = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function F6(t) {
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
const j6 = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function R6(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((i) => (!e.pinnedOnly || e.pins.has(i.slot)) && (() => {
    const o = j6(i);
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
function z6(t, e = 100) {
  const n = Object.entries(t).sort((r, s) => s[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const Vu = /* @__PURE__ */ new Set(), kw = (t) => (Vu.add(t), () => {
  Vu.delete(t);
}), qu = () => {
  for (const t of [...Vu])
    try {
      t();
    } catch {
    }
}, O0 = "xtrata:al-thumb:v1:", $w = "-", Lo = 96, G6 = 24 * 1024 * 1024, hn = /* @__PURE__ */ new Map(), D0 = /* @__PURE__ */ new Set(), Wu = [];
let Hl = !1, Ol;
const Cc = (t, e) => {
  try {
    if (e === void 0) return window.localStorage.getItem(O0 + t);
    window.localStorage.setItem(O0 + t, e);
  } catch {
  }
  return null;
};
function ad(t) {
  return new Promise((e) => {
    var n;
    try {
      const r = document.createElement("canvas"), s = (n = r.getContext) == null ? void 0 : n.call(r, "2d");
      if (!s) return e(t);
      const i = new Image(), o = setTimeout(() => e(t), 8e3);
      i.onload = () => {
        clearTimeout(o);
        try {
          const a = Math.min(i.naturalWidth, i.naturalHeight);
          if (!a) return e(t);
          r.width = r.height = Lo, s.fillStyle = "#143a40", s.fillRect(0, 0, Lo, Lo), s.drawImage(i, (i.naturalWidth - a) / 2, (i.naturalHeight - a) / 2, a, a, 0, 0, Lo, Lo), e(r.toDataURL("image/jpeg", 0.82));
        } catch {
          e(t);
        }
      }, i.onerror = () => {
        clearTimeout(o), e(t);
      }, i.src = t;
    } catch {
      e(t);
    }
  });
}
async function K6(t) {
  var c, u, d, l, w;
  const e = await fetch("/inscription/" + t, { signal: AbortSignal.timeout(6e4) }), n = (e.headers.get("content-type") || "").toLowerCase();
  if (!e.ok)
    return await ((c = e.body) == null ? void 0 : c.cancel()), null;
  if (n.startsWith("image/"))
    return await ((u = e.body) == null ? void 0 : u.cancel()), "/inscription/" + t;
  if (!n.includes("text/html"))
    return await ((d = e.body) == null ? void 0 : d.cancel()), "";
  let r = "", s = 0;
  const i = (p) => {
    let x = 0;
    for (; ; ) {
      const S = r.slice(x).search(/<img\b/i);
      if (S < 0)
        return r = p ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const B = x + S, G = r.indexOf(">", B);
      if (G < 0)
        return r = r.slice(B), null;
      const j = r.slice(B, G + 1), v = j.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (v) return v[1].replace(/&amp;/g, "&");
      const U = j.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (U) return "/inscription/" + U[1];
      x = G + 1;
    }
  }, o = (w = (l = e.body) == null ? void 0 : l.getReader) == null ? void 0 : w.call(l);
  if (!o)
    return r = await e.text(), i(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: p, value: x } = await o.read();
    if (p) break;
    s += x.byteLength, r += a.decode(x, { stream: !0 });
    const S = i(!1);
    if (S)
      return await o.cancel(), S;
    if (s > G6)
      return await o.cancel(), null;
  }
  return r += a.decode(), i(!0) ?? "";
}
async function V6() {
  if (!Hl) {
    Hl = !0;
    try {
      for (; Wu.length; ) {
        const t = Wu.shift();
        if (!hn.has(t))
          try {
            const e = await K6(t);
            if (e === null) continue;
            if (!e) {
              hn.set(t, ""), Cc(t, $w), qu();
              continue;
            }
            const n = await ad(e);
            hn.set(t, n), n.startsWith("data:image/jpeg") && Cc(t, n), qu();
          } catch {
          }
      }
    } finally {
      Hl = !1;
    }
  }
}
function Iw(t, e) {
  if (e && !hn.get(t) ? (hn.set(t, e), ad(e).then((r) => {
    r !== e && (hn.set(t, r), r.startsWith("data:image/jpeg") && Cc(t, r), qu());
  })) : e === "" && !hn.has(t) && hn.set(t, ""), hn.has(t)) return hn.get(t);
  const n = Cc(t);
  if (n != null) {
    const r = n === $w ? "" : n;
    return hn.set(t, r), r;
  }
  return D0.has(t) || (D0.add(t), Wu.push(t), Ol || (Ol = setTimeout(() => {
    Ol = void 0, V6();
  }, 1200))), "";
}
const Bi = 12, q6 = 5e3, on = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Mi = (t, e, n = "") => {
  const r = on("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function W6(t) {
  let e, n = [], r = 0, s = !1, i = !1, o = -1 / 0, a = "", c = "recent", u = !1, d = Bi;
  const l = on("div", "", "ppp-shelf-box");
  kw(() => t.changed());
  const w = (b) => "xtrata.radio.shelf.pins.v1:" + b, p = (b) => "xtrata.radio.shelf.recent.v1:" + b, x = (b, L) => {
    try {
      return JSON.parse(t.store.get(b) || "null") ?? L;
    } catch {
      return L;
    }
  }, S = (b) => new Set(x(w(b), []).filter((L) => Number.isSafeInteger(L))), B = (b) => {
    const L = x(p(b), {}), D = {};
    for (const [C, rt] of Object.entries(L)) Number.isSafeInteger(Number(C)) && typeof rt == "number" && (D[Number(C)] = rt);
    return D;
  };
  async function G(b) {
    if (!s) {
      s = !0, i = !1;
      try {
        const L = [];
        let D = 0, C = 0;
        for (let rt = 0; rt < q6 / 100 + 1; rt++) {
          const Y = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(b)}&after=${D}&limit=100`);
          if (L.push(...F6(Y == null ? void 0 : Y.shelf)), C = Number(Y == null ? void 0 : Y.total) || L.length, !(Y != null && Y.next) || !Number.isSafeInteger(Y.next)) break;
          D = Y.next;
        }
        b === e && (n = L, r = C, o = t.now());
      } catch {
        i = !0;
      } finally {
        s = !1, t.changed();
      }
    }
  }
  const j = () => {
    o = -1 / 0;
  }, v = on("input");
  v.type = "search", v.placeholder = "Search title, artist or #", v.setAttribute("aria-label", "Search your albums"), v.oninput = () => {
    a = v.value, d = Bi, t.changed();
  };
  const U = on("select");
  U.setAttribute("aria-label", "Sort albums");
  for (const b of D6) {
    const L = document.createElement("option");
    L.value = b.value, L.textContent = b.label, U.append(L);
  }
  U.onchange = () => {
    c = U.value, d = Bi, t.changed();
  };
  const M = Mi("", () => {
    u = !u, d = Bi, t.changed();
  }, "tiny"), Q = on("div", "", "ppp-shelf-tools");
  Q.append(v, U, M);
  const tt = on("div"), K = on("div");
  function q(b) {
    const L = b.step === "off" || b.step === "elsewhere" ? void 0 : b.root;
    if (L !== e && (e = L, n = [], r = 0, o = -1 / 0, d = Bi), !L || b.walletCannotAlbums) return null;
    if (!s && t.now() - o > 5 * 6e4 && G(L), !n.length)
      return i ? (K.replaceChildren(on("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Mi("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(K), l) : null;
    const D = S(L), C = B(L), rt = R6(n, { query: a, sort: c, pinnedOnly: u, pins: D, recents: C });
    v.value !== a && (v.value = a), U.value = c, M.textContent = u ? "★ Pinned only" : "☆ Pinned only", M.setAttribute("aria-pressed", String(u));
    const Y = [];
    if (b.slot > 0 && Y.push(Mi("← My player", () => t.open(0), "quiet")), !rt.length) Y.push(on("p", "No album matches that.", "ppp-mute"));
    else {
      const kt = on("ul", "", "ppp-shelf-list");
      for (const E of rt.slice(0, d)) {
        const H = on("li", "", E.slot === b.slot ? "now" : ""), at = D.has(E.slot), it = Mi(at ? "★" : "☆", () => {
          const Xt = new Set(D);
          at ? Xt.delete(E.slot) : Xt.add(E.slot), t.store.set(w(L), JSON.stringify([...Xt])), t.changed();
        }, "tiny");
        it.setAttribute("aria-label", at ? `Unpin ${E.player.title}` : `Pin ${E.player.title}`);
        const ct = [E.player.subtitle, `${Ks(E.player).length} ${Ks(E.player).length === 1 ? "song" : "songs"}`, E.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), $t = E.slot === b.slot, de = Mi($t ? "Playing" : "Select", () => {
          t.store.set(p(L), JSON.stringify(z6({ ...C, [E.slot]: t.now() }))), t.open(E.slot);
        }, $t ? "tiny ppp-pick" : "tiny primary ppp-pick");
        de.disabled = $t;
        const It = Ks(E.player)[0], Yt = E.player.cover ?? (It == null ? void 0 : It.id), Lt = Yt ? Iw(String(Yt)) : "", se = on("span", "", "ppp-shelf-art");
        if (Lt) {
          const Xt = document.createElement("img");
          Xt.src = Lt, Xt.alt = "", Xt.decoding = "async", se.append(Xt);
        } else se.textContent = "💿";
        const Rt = on("span", "", "ppp-shelf-txt");
        Rt.append(on("span", E.player.title, "t"), on("span", ct, "ppp-mute")), H.append(it, se, Rt, de), kt.append(H);
      }
      Y.push(kt), rt.length > d && Y.push(Mi(`Show more (${rt.length - d} left)`, () => {
        d += Bi, t.changed();
      }, "quiet"));
    }
    return i && Y.push(on("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), tt.replaceChildren(...Y), l.firstChild !== Q && l.replaceChildren(Q, tt), l;
  }
  return { render: q, invalidate: j, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const b = B(e), L = [...n].filter((D) => D.player).sort((D, C) => (b[C.slot] ?? 0) - (b[D.slot] ?? 0) || C.slot - D.slot)[0];
    return L ? { slot: L.slot, title: L.player.title } : null;
  } };
}
const Y6 = 20, Qe = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, Ie = {
  grid: Qe('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: Qe('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: Qe('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: Qe('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: Qe('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: Qe('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: Qe('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: Qe('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: Qe('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: Qe('<path d="M6 9l6 6 6-6"/>', 18),
  right: Qe('<path d="M9 6l6 6-6 6"/>', 16),
  close: Qe('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: Qe('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: Qe('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: Qe('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: Qe('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: Qe('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function Z(t, e = {}, ...n) {
  const r = document.createElement(t);
  for (const [s, i] of Object.entries(e))
    i == null || i === !1 || (s === "class" ? r.className = String(i) : s === "html" ? r.innerHTML = String(i) : s.startsWith("on") && typeof i == "function" ? r[s.toLowerCase()] = i : s === "disabled" ? r.disabled = !!i : r.setAttribute(s, i === !0 ? "" : String(i)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const sn = (t, ...e) => Z("button", { type: "button", ...t }, ...e), ja = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, Co = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, X6 = { music: "My music", device: "This device", gifts: "Albums (admin)" }, Z6 = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function F0(t, e, n = {}) {
  const r = !!n.list;
  let s = null, i = "", o = !1;
  const a = document.documentElement, c = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set();
  function d(b) {
    var D, C, rt;
    if (!b || !Number.isSafeInteger(b)) return "";
    const L = (rt = (C = (D = e.radio()) == null ? void 0 : D.getState) == null ? void 0 : C.call(D)) == null ? void 0 : rt.albumCover;
    return L != null && L.url && Number(L.tokenId) === b ? L.url : c.has(b) ? c.get(b) : (u.has(b) || (u.add(b), fetch("/inscription/" + b, { signal: AbortSignal.timeout(2e4) }).then(async (Y) => {
      var E, H, at, it;
      const kt = (Y.headers.get("content-type") || "").toLowerCase();
      if (!Y.ok)
        throw await ((E = Y.body) == null ? void 0 : E.cancel()), new Error("no cover");
      return kt.startsWith("image/") ? (await ((H = Y.body) == null ? void 0 : H.cancel()), "/inscription/" + b) : kt.includes("text/html") ? (((at = (await Y.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : at[1]) ?? "").replace(/&amp;/g, "&") : (await ((it = Y.body) == null ? void 0 : it.cancel()), "");
    }).then((Y) => {
      c.set(b, Y), P();
    }).catch(() => {
      u.delete(b);
    })), "");
  }
  kw(() => P());
  function l(b) {
    var D;
    i = b, b ? a.dataset.sheet = b : delete a.dataset.sheet;
    const L = document.querySelector(".side");
    if (b && b !== "more") {
      for (const Y of Z6[b]) {
        const kt = L == null ? void 0 : L.querySelector(Y);
        kt && (kt.open = !0);
      }
      const C = document.getElementById("sheetTitle");
      C && (C.textContent = X6[b]);
      const rt = document.getElementById("sheetExtra");
      rt && rt.replaceChildren(...b === "music" ? [p()] : []), (D = L == null ? void 0 : L.scrollTo) == null || D.call(L, { top: 0 });
    }
    P();
  }
  const w = r ? null : document.getElementById("sheetClose");
  w && (w.onclick = () => l("")), r || document.addEventListener("keydown", (b) => {
    b.key === "Escape" && i && a.dataset.view === "album" && l("");
  });
  const p = () => sn(
    { class: "al-row", onClick: () => {
      l(""), e.openPlayer();
    } },
    Z("span", { class: "al-row-i", html: Ie.radio }),
    Z("span", { class: "al-row-t" }, Z("b", {}, "Xtrata Radio"), Z("small", {}, "Every song on-chain · FM, liked, all")),
    Z("span", { class: "al-row-go", html: Ie.right })
  );
  let x = null, S = !1;
  const B = () => {
    var L;
    const b = e.radio();
    S || !(b != null && b.subscribe) || (S = !0, b.subscribe((D) => {
      x = D, (s == null ? void 0 : s.mode) === "open" && P();
    }), x = ((L = b.getState) == null ? void 0 : L.call(b)) ?? null);
  };
  r || setInterval(() => {
    var C, rt;
    if ((s == null ? void 0 : s.mode) !== "open" || !(x != null && x.playing)) return;
    const b = (rt = (C = e.radio()) == null ? void 0 : C.getPosition) == null ? void 0 : rt.call(C), L = t.querySelector(".al-bar > i"), D = t.querySelectorAll(".al-times span");
    !b || !L || (L.style.width = b.duration ? `${Math.min(100, b.current / b.duration * 100)}%` : "0%", D.length === 2 && (D[0].textContent = ja(b.current || 0), D[1].textContent = b.duration ? ja(b.duration) : "–:––"));
  }, 500);
  let G = "", j = null;
  function v(b, L, D = {}) {
    const C = D.song || d(b.cover), Y = [C ? Z("img", { src: C, alt: D.song ? "Song artwork" : `${b.title} cover` }) : Z("div", { class: "al-cover-fallback" }, Z("b", {}, b.title), b.subtitle ? Z("span", {}, b.subtitle) : null), D.paused ? Z("span", { class: "al-paused" }, Z("i", { html: Ie.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], kt = "al-cover" + (L ? "" : " al-cover--small") + (D.paused ? " is-paused" : "");
    return D.flip ? (Y.push(Z("span", { class: "al-flip", "aria-hidden": "true", html: Ie.flip })), sn({ class: kt + " is-flippable", "aria-label": D.flipped ? "Show this song’s artwork" : `Show the ${b.title} cover`, onClick: D.flip }, ...Y)) : Z("div", { class: kt }, ...Y);
  }
  function U(b) {
    return b.plays === null || b.plays === void 0 ? Z("span", { class: "al-chip al-chip--quiet" }, b.playsComing ? "Plays on their way…" : "…") : b.plays === 0 ? Z("span", { class: "al-chip al-chip--out" }, b.playsComing ? "Plays on their way…" : "No plays left") : Z("span", { class: "al-chip" + (b.plays <= Y6 ? " al-chip--low" : "") }, `${Co(b.plays, "play", "plays")} left`);
  }
  function M(b) {
    const L = b.player, D = L.tracks.filter((rt) => !rt.hidden), C = [];
    return b.mode === "arrive" && b.from && C.push(Z("p", { class: "al-from" }, Z("span", { html: Ie.gift }), Z("span", {}, Z("b", {}, b.from), " sent you an album"))), C.push(v(L, !0)), C.push(Z(
      "div",
      { class: "al-intro" },
      Z("h1", {}, L.title),
      L.subtitle ? Z("p", { class: "al-artist" }, L.subtitle) : null,
      D.length ? Z("p", { class: "al-songline" }, D.map((rt) => rt.title || `#${rt.id}`).join(" · ")) : null,
      Z("span", { class: "al-chip" }, [Co(D.length, "song", "songs"), b.offered ? Co(b.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), b.status.length && C.push(Z("div", { class: "al-status", role: "status" }, ...b.status)), C.push(Z("div", { class: "al-grow" })), b.asking ? C.push(Z("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : b.primary && C.push(sn({ class: "al-primary", onClick: b.primary.run, disabled: b.busy }, Z("span", { html: Ie.playSmall }), b.primary.label)), b.hint && !b.asking && C.push(Z("p", { class: "al-hint" }, b.hint)), b.secondary && !b.asking && C.push(sn({ class: "al-link", onClick: b.secondary.run, disabled: b.busy }, b.secondary.label)), C;
  }
  function Q(b, L) {
    const { songs: D, current: C, started: rt, own: Y, out: kt, waiting: E } = L, H = b.player, at = e.radio(), it = [];
    it.push(Z("div", { class: "al-listhead" }, Z("span", {}, Z("b", {}, H.title), ` · ${Co(D.length, "song", "songs")}`), U(b)));
    const ct = d(H.cover), $t = "album:" + H.cover;
    ct && !hn.has($t) && (hn.set($t, ct), ad(ct).then((It) => {
      It !== ct && (hn.set($t, It), P());
    }));
    const de = ct ? hn.get($t) || ct : "";
    return it.push(Z("ol", { class: "al-tracks" }, ...D.map((It, Yt) => {
      const Lt = String(It.id) === C, se = Iw(String(It.id), Lt && rt ? Y : void 0);
      return Z("li", {}, sn(
        { class: "al-track" + (Lt ? " is-on" : ""), "aria-label": `Play ${It.title || "#" + It.id}`, "aria-current": Lt ? "true" : void 0, disabled: kt || E, onClick: () => {
          var Rt;
          return (Rt = at == null ? void 0 : at.playToken) == null ? void 0 : Rt.call(at, It.id);
        } },
        Z(
          "span",
          { class: "al-th" + (se ? "" : " is-blank") },
          se ? Z("img", { src: se, alt: "", decoding: "async" }) : de ? Z("img", { src: de, alt: "", decoding: "async" }) : null,
          se ? null : Z("span", { class: "al-n" }, String(Yt + 1)),
          Lt ? Z("span", { class: "al-eq", html: Ie.eq }) : null
        ),
        Z("span", { class: "al-tt" }, It.title || `#${It.id}`)
      ));
    }))), it;
  }
  function tt(b) {
    var se;
    const L = b.player, D = L.tracks.filter((Rt) => !Rt.hidden), C = e.radio(), rt = x == null ? void 0 : x.nowPlaying, Y = rt && L.tracks.some((Rt) => String(Rt.id) === String(rt.tokenId)) ? String(rt.tokenId) : null, kt = Y ? L.tracks.find((Rt) => String(Rt.id) === Y) : null, E = b.plays === 0 && !b.playsComing, H = !!b.playsComing && !b.plays, at = !!(x != null && x.playing) && !!Y, it = x == null ? void 0 : x.heart, ct = Y ? (se = C == null ? void 0 : C.getPosition) == null ? void 0 : se.call(C) : null;
    Y && (at || ((ct == null ? void 0 : ct.current) ?? 0) > 0.5) && (G = L.id);
    const $t = !!Y && G === L.id;
    j && j !== Y && (j = null);
    const de = $t ? String((rt == null ? void 0 : rt.cover) || "") : "", It = !!de && j === Y, Lt = [v(L, !E, { song: It ? "" : de, paused: $t && !at, flip: de ? () => {
      j = j === Y ? null : Y, P();
    } : void 0, flipped: It })];
    if (Lt.push(Z(
      "div",
      { class: "al-now" },
      Z(
        "div",
        { class: "al-now-t" },
        Z("div", { class: "al-song" }, kt ? kt.title || (rt == null ? void 0 : rt.title) || `#${kt.id}` : L.title),
        Z("div", { class: "al-artist" }, kt ? kt.artist || (rt == null ? void 0 : rt.artist) || L.subtitle : L.subtitle || "Press play")
      ),
      Y ? sn({ class: "al-icon" + (it != null && it.liked ? " is-on" : ""), "aria-label": it != null && it.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(it != null && it.liked)), disabled: !!(it != null && it.pending) || !!(it != null && it.locked) || H, onClick: () => {
        var Rt;
        return (Rt = C == null ? void 0 : C.toggleLike) == null ? void 0 : Rt.call(C);
      }, html: it != null && it.liked ? Ie.heartOn : Ie.heart }) : null
    )), E)
      Lt.push(Z(
        "div",
        { class: "al-out" },
        Z("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        Z("p", { class: "al-out-t" }, "You've played this album out"),
        Z("p", { class: "al-out-s" }, "Add plays to keep listening."),
        K(b, !0)
      ));
    else {
      const Rt = ct != null && ct.duration ? Math.min(100, ct.current / ct.duration * 100) : 0;
      Lt.push(Z(
        "div",
        { class: "al-prog" },
        Z("div", { class: "al-bar" }, Z("i", { style: `width: ${Rt}%` })),
        Z("div", { class: "al-times" }, Z("span", {}, ja((ct == null ? void 0 : ct.current) || 0)), Z("span", {}, ct != null && ct.duration ? ja(ct.duration) : "–:––"))
      ));
    }
    return Lt.push(Z(
      "div",
      { class: "al-ctl" + (E || H ? " is-off" : "") },
      sn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: E || H, onClick: () => {
        var Rt;
        return (Rt = C == null ? void 0 : C.prev) == null ? void 0 : Rt.call(C);
      }, html: Ie.prev }),
      sn({ class: "al-play", "aria-label": at ? "Pause" : "Play", disabled: E || H, onClick: () => {
        var Rt;
        return (Rt = C == null ? void 0 : C.playPause) == null ? void 0 : Rt.call(C);
      }, html: at ? Ie.pause : Ie.play }),
      sn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: E || H, onClick: () => {
        var Rt;
        return (Rt = C == null ? void 0 : C.next) == null ? void 0 : Rt.call(C);
      }, html: Ie.next })
    )), b.status.length && Lt.push(Z("div", { class: "al-status", role: "status" }, ...b.status)), Lt.push(...Q(b, { songs: D, current: Y, started: $t, own: de, out: E, waiting: H })), Lt.push(Z("div", { class: "al-grow" })), Lt.push(sn(
      { class: "al-more", "aria-expanded": String(i === "more"), onClick: () => l(i === "more" ? "" : "more") },
      Z("span", {}, "More ", Z("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      Z("span", { html: Ie.down })
    )), Lt;
  }
  function K(b, L) {
    const D = Z("div", { class: "al-topups" + (L ? " al-topups--primary" : "") }), C = L ? [b.topUps[1] ?? b.topUps[0]] : [...b.topUps];
    for (const rt of C) {
      const Y = b.myPlays !== void 0 && b.myPlays >= rt && !b.playsComing && !b.busy;
      D.append(sn({ class: "al-topup", disabled: !Y, onClick: () => e.topUp(rt) }, L ? `Add ${rt.toLocaleString()} plays` : `+${rt.toLocaleString()}`));
    }
    return L && D.append(sn({ class: "al-link", onClick: () => l("more") }, "Other amounts")), D;
  }
  function q(b) {
    const L = b.myPlays !== void 0 && b.myPlays >= (b.topUps[0] ?? 0), D = Z(
      "div",
      { class: "al-card" },
      Z("div", { class: "al-card-h" }, Z("b", {}, `Add plays to ${b.player.title}`), Z("span", { class: "al-mono" }, b.plays === null || b.plays === void 0 ? "" : `${b.plays.toLocaleString()} left`)),
      K(b, !1),
      Z("p", { class: "al-mute al-small" }, b.playsComing ? "Plays are on their way. Add more once they arrive." : b.myPlays === void 0 ? "Checking My player…" : L ? `Moved from My player · ${Co(b.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !L && !b.playsComing && b.myPlays !== void 0 ? sn({ class: "al-link", onClick: () => {
        l(""), e.openPlayer();
      } }, "Open My player") : null
    ), C = (Y, kt, E, H) => sn(
      { class: "al-row", onClick: H },
      Z("span", { class: "al-row-i", html: Y }),
      Z("span", { class: "al-row-t" }, Z("b", {}, kt), Z("small", {}, E)),
      Z("span", { class: "al-row-go", html: Ie.right })
    ), rt = Z(
      "div",
      { class: "al-how" + (o ? " is-open" : "") },
      C(Ie.info, "How plays work", "Every play counts for the song’s owner", () => {
        o = !o, P();
      }),
      o ? Z("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return Z(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      Z("div", { class: "al-sheet-h" }, Z("b", {}, "More"), sn({ class: "al-icon", "aria-label": "Close", onClick: () => l(""), html: Ie.close })),
      b.mode === "open" ? D : null,
      Z(
        "div",
        { class: "al-rows" },
        C(Ie.grid, "My music", "Your albums and the radio", () => l("music")),
        C(Ie.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          l(""), e.openPlayer();
        }),
        b.canMake ? C(Ie.gift, "Albums (admin)", "Make an album and fund copies", () => l("gifts")) : null,
        C(Ie.device, "This device", "Backup, history, Stacks wallet, returns", () => l("device")),
        rt
      )
    );
  }
  function I(b) {
    var E, H;
    const L = b.player, D = x == null ? void 0 : x.nowPlaying, C = D && L.tracks.some((at) => String(at.id) === String(D.tokenId)) ? String(D.tokenId) : null, rt = !!(x != null && x.playing) && !!C, Y = C ? (H = (E = e.radio()) == null ? void 0 : E.getPosition) == null ? void 0 : H.call(E) : null;
    C && (rt || ((Y == null ? void 0 : Y.current) ?? 0) > 0.5) && (G = L.id);
    const kt = !!C && G === L.id;
    return Q(b, {
      songs: L.tracks.filter((at) => !at.hidden),
      current: C,
      started: kt,
      own: kt ? String((D == null ? void 0 : D.cover) || "") : "",
      out: b.plays === 0 && !b.playsComing,
      waiting: !!b.playsComing && !b.plays
    });
  }
  function P() {
    const b = s;
    if (r) {
      if (!b || b.mode !== "open") {
        t.hidden = !0, t.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      B(), t.hidden = !1, a.dataset.albumlist = "1", t.replaceChildren(...I(b));
      return;
    }
    if (!b) {
      t.hidden = !0, t.replaceChildren();
      return;
    }
    B(), t.hidden = !1;
    const L = Z(
      "header",
      { class: "al-top" },
      Z("a", { class: "al-brand", href: "/radio" }, "Xtrata ", Z("b", {}, "Music")),
      b.mode === "open" ? sn({ class: "al-icon", "aria-label": "My music", onClick: () => l("music"), html: Ie.grid }) : null
    ), D = Z("div", { class: "al-body al-body--" + b.mode }, ...b.mode === "open" ? tt(b) : M(b));
    t.replaceChildren(L, D, ...i === "more" ? [Z("div", { class: "al-scrim", onClick: () => l("") }), q(b)] : []);
  }
  return {
    render(b) {
      if (r) {
        s = b, P();
        return;
      }
      const L = !!s;
      s = b, !b && (L || i) && (i = "", delete a.dataset.sheet), b ? a.dataset.view = "album" : delete a.dataset.view, b != null && b.asking ? a.dataset.asking = "1" : delete a.dataset.asking, P();
    },
    sheet: () => i,
    setSheet: l
  };
}
const Q6 = [
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
function J6(t) {
  for (const [e, n] of Q6) if (n.test(t)) return e;
  return null;
}
const Lw = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), Cw = (t) => /Android/.test(t);
function t$(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : Lw(e) ? "x-safari-" + n.href : Cw(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const e$ = (t) => Lw(t) ? "Safari" : Cw(t) ? "Chrome" : "your browser", Ni = "Xtrata Music Wallet", n$ = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function j0(t, e = (n) => n) {
  var i, o, a;
  if (t.mainConnected ?? !!t.main) return [];
  if (t.step === "off" || t.step === "elsewhere") return [];
  if (t.gate && (t.gate.enabled === !1 || t.gate.here === !1)) return [];
  if (t.step === "unsupported")
    return ((i = t.gate) == null ? void 0 : i.passkeyOnly) || t.linked || ((o = t.others) == null ? void 0 : o.length) ? [{ action: null, label: Ni, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([t.standIn, t.linked, ...t.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const u = t.standIn === c && n$.has(t.step);
    r.push({
      action: "linked",
      main: c,
      label: `${Ni} · ${e(c)}`,
      detail: u ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${e(c)}.`
    });
  }
  if ((a = t.gate) != null && a.passkeyOnly && t.solo)
    switch (t.step) {
      case "intro":
        r.push({ action: "create", label: Ni, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "locked":
        r.push({ action: "unlock", label: Ni, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: Ni, detail: "Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: Ni, detail: "Open on this device." });
    }
  return r;
}
const Dl = "xtrata.radio.novice", Tw = "xtrata.radio.novice.previewed.v1", R0 = 6 * 6e4;
function r$(t, e) {
  let n = null;
  try {
    const r = new URLSearchParams(t).get("novice");
    if (r === "1" || r === "preview")
      e.set(Dl, r), n = r;
    else {
      if (r === "0")
        return e.set(Dl, null), { on: !1, preview: !1 };
      n = e.get(Dl);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const s$ = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, z0 = (t) => s$.test(t ?? ""), i$ = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, o$ = {
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
}, a$ = (t, e) => o$[t] ?? e;
function c$(t, e) {
  switch (t) {
    case "fund":
      return e.arriving ? [] : [
        e.played ? "Out of plays." : "No plays yet.",
        "Plays come with music someone shares with you. Paying by card is on its way; other ways to add plays are under “This device”."
      ];
    case "over":
      return ["Your player is holding more than it should, so plays are paused. Open “This device” below to send the extra back."];
    default:
      return [];
  }
}
const l$ = "Make your player once, with Face ID or your fingerprint, and the music starts.", u$ = "Checking your player…", Yu = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function Bw(t) {
  try {
    const e = JSON.parse(t.get(Tw) || "[]");
    return Array.isArray(e) ? e.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function f$(t, e) {
  const n = Bw(t).filter((r) => r !== e);
  n.push(e), t.set(Tw, JSON.stringify(n.slice(-50)));
}
function Fl(t, e) {
  switch (e.kind) {
    case "offer":
      return t.album === e.album && t.phase !== "idle" ? t : { ...Yu(), album: e.album, phase: e.already ? "done" : "open" };
    case "withdraw":
      return t.phase === "idle" ? t : Yu();
    case "now":
      return t.phase === "open" && e.playing && e.track ? { ...t, phase: "playing", track: e.track, since: e.at } : t.phase === "playing" && e.track && e.track !== t.track ? { ...t, phase: "done" } : t.phase === "playing" && e.at - t.since > R0 ? { ...t, phase: "done" } : t;
    case "listened":
      return t.phase !== "playing" ? t : t.heard >= 1 ? { ...t, phase: "done" } : { ...t, heard: t.heard + 1 };
    case "tick":
      return t.phase === "playing" && e.at - t.since > R0 ? { ...t, phase: "done" } : t;
  }
}
const Ra = (t) => t.phase === "open" || t.phase === "playing", Nn = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, za = (t, e, n, r = !1) => {
  const s = Nn("button", t, e);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, Pi = {
  new: {
    title: "Music that pays the artist",
    body: "Every play counts for whoever owns the song. Make your player once and you’re in.",
    primary: "Make my player",
    hint: "One tap with Face ID or your fingerprint. No app, no account, no password.",
    returning: "I’ve listened here before",
    full: "Look around first"
  },
  back: { title: "Welcome back", body: "Unlock your player and carry on listening.", primary: "Unlock my player", hint: "One tap with Face ID or your fingerprint.", returning: "Use a different passkey", full: "Look around first" },
  empty: {
    title: "Your player is ready",
    body: "It has no plays yet. Plays come with music someone shares with you: open their link on this device and the album lands here.",
    note: "Paying by card is on its way.",
    primary: "Look around the radio"
  },
  checking: "One moment…",
  asking: "Continue in the box below."
};
function d$(t) {
  const e = document.documentElement;
  let n = !1;
  return {
    showing: () => n,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(r, s = !1) {
      if (!r) {
        n && !s && (t.hidden = !0, t.replaceChildren(), delete e.dataset.view, delete e.dataset.asking), n = !1, delete e.dataset.welcome;
        return;
      }
      n = !0, e.dataset.view = "album", e.dataset.welcome = r.mode, r.asking ? e.dataset.asking = "1" : delete e.dataset.asking;
      const i = Nn("header", "al-top"), o = Nn("a", "al-brand");
      o.href = "/radio", o.append("Xtrata ", Nn("b", "", "Music")), i.append(o);
      const a = Nn("div", "al-body al-body--welcome"), c = Nn("div", "al-welcome");
      if (r.mode === "checking")
        c.append(Nn("p", "al-welcome-wait", Pi.checking));
      else {
        const u = Pi[r.mode];
        if (c.append(Nn("h1", "", u.title), Nn("p", "", u.body)), r.mode === "empty" && c.append(Nn("p", "al-welcome-note", Pi.empty.note)), r.status.length) {
          const d = Nn("div", "al-status");
          d.setAttribute("role", "status"), d.append(...r.status), c.append(d);
        }
        if (r.asking) c.append(Nn("p", "al-hint al-hint--ask", Pi.asking));
        else if (r.mode === "new" || r.mode === "back") {
          const d = Pi[r.mode];
          r.canStart && c.append(za("al-primary", d.primary, r.mode === "new" ? r.start : r.unlock, r.busy), Nn("p", "al-hint", d.hint)), r.canStart && c.append(za("al-link", d.returning, r.returning, r.busy)), c.append(za("al-link", d.full, r.full));
        } else c.append(za("al-primary", Pi.empty.primary, r.full));
      }
      a.append(c), t.hidden = !1, t.replaceChildren(i, a);
    }
  };
}
const G0 = document.getElementById("ppp");
G0 && h$(G0);
function h$(t) {
  var Vr;
  const e = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = ib(), s = (f) => t.querySelector(f), i = s(".ppp-frame");
  let o = null;
  const a = async (f, m) => {
    const A = await fetch(f, { cache: "no-store", ...m, signal: AbortSignal.timeout(15e3) }), h = await A.json().catch(() => ({}));
    if (!A.ok) throw new Error((h == null ? void 0 : h.error) || `Request failed (${A.status}).`);
    return h;
  }, c = P5({
    now: Date.now,
    main: () => {
      const f = r.load();
      return f.isConnected && f.network === "mainnet" ? f.address : void 0;
    },
    config: (f) => a("/radio/listening-wallet/config?main=" + encodeURIComponent(f || "")),
    links: async (f) => (await a("/radio/listening-wallet/link?main=" + encodeURIComponent(f))).links ?? [],
    mainOf: async (f) => {
      var A;
      const m = (await a("/radio/listening-wallet/link?listening=" + encodeURIComponent(f))).links;
      return ((A = m == null ? void 0 : m.find((h) => h.listening === f)) == null ? void 0 : A.main) ?? null;
    },
    saveLink: async (f) => {
      await a("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(f) });
    },
    bridge: async (f) => {
      o = document.createElement("iframe"), o.title = "Xtrata listening wallet", o.setAttribute("allow", `publickey-credentials-get ${f}; publickey-credentials-create ${f}`), o.referrerPolicy = "no-referrer";
      const m = new Promise((vt, bt) => {
        o.addEventListener("load", () => vt(), { once: !0 }), setTimeout(() => bt(new Error("The listening wallet did not load.")), 15e3);
      });
      o.src = f + "/", i.replaceChildren(o), await m;
      const A = new Xw({ walletOrigin: f, frame: o, timeoutMs: 30 * 6e4 }), h = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), J = (vt, bt) => h.has(vt) ? A.request(vt, bt) : Promise.race([
        A.request(vt, bt),
        new Promise((zt, Ae) => setTimeout(() => Ae(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await J("listening.status"), { request: J };
    },
    chain: {
      verify: h5,
      balance: g5,
      account: p5,
      owner: y5,
      broadcast: w5,
      transaction: b5,
      confirmedNonce: async (f) => {
        const m = await As(`/v2/accounts/${f}?proof=0`);
        if (!Number.isSafeInteger(m == null ? void 0 : m.nonce) || m.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(m.nonce);
      }
    },
    signWithMain: (f, m) => x0({ ...m, network: "mainnet", stxAddress: f }),
    deposit: (f, m, A) => new Promise((h, J) => g0({
      recipient: m,
      amount: A.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: f,
      network: new jl(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (vt) => h(vt.txId || ""),
      onCancel: () => J(new Error("Deposit cancelled. Nothing was sent.")),
      onError: J
    })),
    validate: m5,
    tabLock: (f) => new Promise((m) => {
      const A = navigator.locks;
      if (!(A != null && A.request)) {
        m(!0);
        return;
      }
      A.request("xtrata-ppp:" + f, { ifAvailable: !0 }, async (h) => {
        m(!!h), h && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (f) => {
        try {
          return localStorage.getItem(f);
        } catch {
          return null;
        }
      },
      set: (f, m) => {
        try {
          localStorage.setItem(f, m);
        } catch {
        }
      }
    },
    changed: () => Ue(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (f) => {
      var m, A;
      return u.funder(f, () => k5(f, As), !!((A = (m = c.snapshot().gate) == null ? void 0 : m.gifts) != null && A.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (f) => {
      const m = await a("/radio/gift/for?wallet=" + encodeURIComponent(f)), A = m == null ? void 0 : m.gift;
      if (!A) return null;
      if (typeof A.returnTo != "string" || typeof A.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: A.returnTo, from: typeof A.from == "string" ? A.from : null, source: String(A.source ?? ""), amount: String(A.amount ?? "0"), treasury: A.treasury, state: A.state === "sending" ? "sending" : "arrived", player: A.player ?? null };
    },
    history: (f, m) => L5(f, (A) => As(A), m),
    likesChanged: () => {
      var f, m;
      (m = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || m.call(f);
    },
    likeState: async (f, m) => {
      const A = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: f, ids: String(m) })), h = Array.isArray(A == null ? void 0 : A.rows) ? A.rows.find((J) => (J == null ? void 0 : J.id) === m) : null;
      if (!h || typeof h.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: h.liked, by: Array.isArray(h.by) ? h.by.filter((J) => typeof J == "string") : h.liked ? [f] : [] };
    },
    likeSent: (f, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: f, liked: m } })),
    nameOf: (f) => Ge(f) ?? void 0,
    likeConfirmed: (f, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: f, liked: m } })),
    likeFailed: (f) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: f } }))
  }), u = O6({
    json: a,
    main: () => {
      const f = r.load();
      return f.isConnected && f.network === "mainnet" ? f.address : void 0;
    },
    pay: (f, m, A, h) => new Promise((J, vt) => g0({
      recipient: m,
      amount: A.toString(),
      memo: h,
      stxAddress: f,
      network: new jl(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (bt) => J(bt.txId || ""),
      onCancel: () => vt(new Error("Gift cancelled. Nothing was sent.")),
      onError: vt
    })),
    sign: (f, m) => x0({ ...m, network: "mainnet", stxAddress: f }),
    giftSent: (f, m) => c.giftSent(f, m),
    claiming: (f) => c.giftClaiming(f),
    album: { bind: (f) => c.bindAlbum(f), arrived: async (f, m, A, h) => {
      d.invalidate(), await c.albumArriving(f, m, A, h);
    } },
    who: (f) => _(f),
    changed: () => Ue(c.snapshot()),
    store: {
      get: (f) => {
        try {
          return localStorage.getItem(f);
        } catch {
          return null;
        }
      },
      set: (f, m) => {
        try {
          m === null ? localStorage.removeItem(f) : localStorage.setItem(f, m);
        } catch {
        }
      }
    },
    now: Date.now
  }), d = W6({
    json: a,
    open: (f) => {
      c.openAlbum(f);
    },
    store: {
      get: (f) => {
        try {
          return localStorage.getItem(f);
        } catch {
          return null;
        }
      },
      set: (f, m) => {
        try {
          m === null ? localStorage.removeItem(f) : localStorage.setItem(f, m);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => Ue(c.snapshot())
  }), l = {
    get: (f) => {
      try {
        return localStorage.getItem(f);
      } catch {
        return null;
      }
    },
    set: (f, m) => {
      try {
        m === null ? localStorage.removeItem(f) : localStorage.setItem(f, m);
      } catch {
      }
    }
  }, w = r$(location.search, l);
  w.on && (document.documentElement.dataset.novice = w.preview ? "preview" : "1");
  const p = (f) => w.on && f.solo, x = w.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), S = x ? document.getElementById("album") : null, B = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (f) => void c.topUpAlbum(f),
    openPlayer: () => void c.openAlbum(0)
  }, G = S ? F0(S, B) : null, j = w.on && S ? d$(S) : null, v = Date.now();
  let U = !1, M = null, Q = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const tt = () => {
    Q = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    Ue(c.snapshot());
  }, K = (f, m) => !j || m || Q ? null : (!f.gate || f.step === "loading" || (U = !0), U ? p(f) ? f.step === "intro" || f.step === "unsupported" ? "new" : f.step === "locked" ? "back" : f.step === "fund" && f.slot === 0 && !f.gift && !f.depositPending && !f.entries.some((h) => h.kind === "play") ? "empty" : f.step === "loading" && M !== "checking" ? M : null : null : Date.now() - v < 1e4 ? "checking" : null);
  function q(f, m, A = []) {
    if (!j) return;
    const h = K(f, m);
    if (M = h, delete document.documentElement.dataset.noviceBoot, !h) {
      j.render(null, m);
      return;
    }
    const J = [...A];
    f.step === "unsupported" ? J.push(N("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : f.error && J.push(N("p", f.error, "ppp-warn")), j.render({
      mode: h,
      status: J,
      asking: !!f.busy || f.armed,
      busy: !!f.busy,
      canStart: (f.step === "intro" || f.step === "locked") && !ge,
      start: () => void c.create(),
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      full: tt
    });
  }
  j && setTimeout(() => {
    U || Ue(c.snapshot());
  }, 10100);
  const I = document.getElementById("albumList"), P = I ? F0(I, B, { list: !0 }) : null, b = "xtrata.radio.album.last.v1", L = () => {
    try {
      const f = JSON.parse(localStorage.getItem(b) || "null");
      return f && typeof f.root == "string" && Number.isSafeInteger(f.slot) && f.slot > 0 && f.player && Array.isArray(f.player.tracks) ? f : null;
    } catch {
      return null;
    }
  };
  let D = "";
  const C = (f) => {
    const m = JSON.stringify(f);
    if (m !== D) {
      D = m;
      try {
        localStorage.setItem(b, m);
      } catch {
      }
    }
  };
  let rt = null;
  window.XtrataRadioLikeHandler = (f) => {
    var A;
    if (!f || !Number.isSafeInteger(f.song) || f.song < 0) return !1;
    (A = c.snapshot().likeFunds) != null && A.album && (Lt = !0), ee();
    const m = Jt(f.song, { title: f.title, artist: f.artist });
    return c.heart({ song: f.song, title: m.title || void 0, artist: m.artist || void 0, likedBy: Array.isArray(f.likedBy) ? f.likedBy : void 0 });
  };
  let Y;
  window.XtrataRadioListeningIdentity = () => {
    const f = c.snapshot();
    return f.solo && f.step !== "off" && f.step !== "elsewhere" ? f.listening : void 0;
  };
  const kt = (f) => {
    var A, h;
    const m = window.XtrataRadioListeningIdentity();
    m !== Y && (Y = m, (h = (A = window.XtrataRadio) == null ? void 0 : A.refreshLikes) == null || h.call(A));
  };
  let E = Yu(), H = null;
  const at = (f) => {
    const m = w.preview && !ge && f.step === "intro" ? u.incomingAlbum() : null;
    return m ? (E = Fl(E, { kind: "offer", album: m.player.id, already: Bw(l).includes(m.player.id) }), Ra(E) ? m.player : null) : (E = Fl(E, { kind: "withdraw" }), null);
  }, it = (f) => {
    const m = E.phase;
    E = Fl(E, f), E.phase !== m && (E.album && (E.phase === "playing" || E.phase === "done") && f$(l, E.album), Ue(c.snapshot()));
  };
  setInterval(() => {
    E.phase === "playing" && it({ kind: "tick", at: Date.now() });
  }, 5e3);
  let ct = "", $t, de = !1, It = !1;
  const Yt = (f, m) => {
    var Ht, jt, Qt, Tn, Fe, je, fn, Bn;
    const A = window.XtrataRadio;
    if (!(A != null && A.setGiftPlayer) || !(A != null && A.setGiftStop)) return;
    const h = m.depositPending && f.step === "fund" && ((Ht = f.giftStop) == null ? void 0 : Ht.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : f.giftStop, J = H, vt = h ? p(f) ? a$(h.reason, h.text) : h.text : null, bt = J ? null : vt ?? (e && (!((jt = f.gate) != null && jt.here) || f.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    bt && bt !== $t && (A.setGiftStop(bt), $t = bt);
    const zt = f.step === "off" || f.step === "elsewhere" ? null : ((Qt = f.gift) == null ? void 0 : Qt.player) ?? J ?? null, Ae = zt ? zt.id + ":" + zt.cover + ":" + zt.tracks.map((Sn) => Sn.id).join(",") : "";
    Ae !== ct && (A.setGiftPlayer(zt ? { id: zt.id, title: zt.title, subtitle: zt.subtitle, tracks: Ks(zt).map((Sn) => Sn.id), hidden: ((Tn = P6(zt)) == null ? void 0 : Tn.id) ?? null, cover: zt.cover } : null), ct = Ae), bt !== $t && (A.setGiftStop(bt), $t = bt);
    const ln = (h == null ? void 0 : h.reason) === "arriving";
    ln !== It && ((Fe = A.setGiftWait) == null || Fe.call(A, ln), It = ln);
    const un = !!zt && (!!J || !!((je = f.albumLock) != null && je.locked));
    un !== de && ((fn = A.setGiftLock) == null || fn.call(A, un), de = un), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(f.step) && ((Bn = A.forgetWallets) == null || Bn.call(A));
  };
  let Lt = !1;
  const se = /* @__PURE__ */ new Map(), Rt = (f) => {
    if (!(f.step === "fund" && !f.depositPending && !!f.gift && !!f.listening && f.balance === 0n && !f.entries.some((h) => h.kind === "play") && (f.brandNew || f.createdHere))) return null;
    let A = se.get(f.listening);
    return A === void 0 && (A = Date.now(), se.set(f.listening, A)), Date.now() - A < $c ? A : null;
  }, Xt = (f) => f.step === "fund" && !f.depositPending && !!f.gift && f.balance === 0n && !f.entries.some((m) => m.kind === "play") && !!f.listening && se.has(f.listening), De = (f) => f ? f.slice(0, 6) + "…" + f.slice(-4) : "", he = (f) => {
    const m = c.snapshot().playCost || 350n;
    return f > ze ? Number((f - ze) / m) : 0;
  }, We = (f) => (Number(f) / 1e6).toFixed(f < 1000n ? 6 : 4), en = (f) => {
    const m = Math.round((Date.now() - f) / 6e4);
    return m < 1 ? "now" : m < 60 ? `${m}m` : m < 1440 ? `${Math.round(m / 60)}h` : `${Math.round(m / 1440)}d`;
  }, Se = (f) => `https://explorer.hiro.so/txid/${f}?chain=mainnet`, N = (f, m = "", A = "") => {
    const h = document.createElement(f);
    return m && (h.textContent = m), A && (h.className = A), h;
  }, xt = (f, m, A = "") => {
    const h = N("button", f, A);
    return h.type = "button", h.onclick = m, h;
  }, oe = (f, m) => {
    const A = N("a", f);
    return A.href = m, A.target = "_blank", A.rel = "noopener", A;
  };
  let Ee = null, ae = location.hash === "#give";
  ae && history.replaceState(null, "", location.pathname + location.search);
  let $n = !1;
  const Rn = w6((f) => y6({ address: f, network: "mainnet" }), () => Ue(c.snapshot())), Ge = (f) => Rn.get(f), ge = J6(navigator.userAgent), $ = (f, m) => {
    const A = navigator.userAgent, h = e$(A), J = `${location.origin}${location.pathname}${m ? `#gift=${m}` : ""}`, vt = [N("p", `You are in ${f}'s built-in browser, where passkeys often do not work. Open this page in ${h} to make your ${w.on ? "player" : "listening wallet"}${m ? w.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], bt = N("div", "", "ppp-open-row"), zt = t$(J, A);
    if (zt) {
      const Ae = N("a", `Open in ${h}`, "primary ppp-open-in");
      Ae.href = zt, Ae.dataset.homeAction = "radio:open-in-browser", bt.append(Ae);
    }
    return bt.append(Fi("copy-page-link", "Copy link", () => J, zt ? "" : "primary", () => Ue(c.snapshot()))), vt.push(bt, N("p", `If that does not open ${h}, use ${f}'s menu (••• or ⋮) and choose "Open in ${h === "your browser" ? "browser" : h}", or paste the copied link there.`, "ppp-mute")), vt;
  }, _ = (f) => Ge(f) ?? De(f), F = (f) => f.slice(0, 2).map(_).join(" and ") + (f.length > 2 ? ` and ${f.length - 2} more` : ""), V = /* @__PURE__ */ new Map();
  let ht = !1;
  const ut = (f) => !f || /^(?:Inscription )?#\d+$/.test(f.trim()), ee = () => {
    ht || (ht = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((f) => f.ok ? f.json() : null).then((f) => {
      for (const m of Array.isArray(f == null ? void 0 : f.tracks) ? f.tracks : []) {
        const A = Number(m == null ? void 0 : m.id);
        Number.isSafeInteger(A) && V.set(A, { title: typeof m.title == "string" ? m.title : void 0, artist: typeof m.artist == "string" ? m.artist : void 0 });
      }
      Ue(c.snapshot());
    }).catch(() => {
      ht = !1;
    }));
  }, Jt = (f, m) => {
    const A = V.get(f), h = m6(f, [A == null ? void 0 : A.title, m == null ? void 0 : m.title].find((vt) => !ut(vt)) || ""), J = b6(f, (A == null ? void 0 : A.artist) || (m == null ? void 0 : m.artist) || "");
    return { title: h, artist: J };
  }, ne = (f) => {
    const { title: m, artist: A } = Jt(f.song, f);
    return m ? `“${m}”${A ? ` — ${A}` : ""}` : `Song #${f.song}${A ? ` — ${A}` : ""}`;
  }, ye = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, $e = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function _e(f) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(f.step) ? ["", ""] : f.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : f.step === "over" ? ["TOO MUCH", "bad"] : f.step === "locked" ? ["LOCKED", "mute"] : f.step === "intro" || f.step === "link" ? ["", ""] : f.step === "fund" ? f.depositPending ? ["ON ITS WAY", "warn"] : f.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : f.payingOn && f.session && f.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function St(f, m, A = "", h) {
    const J = N("dt", f), vt = N("dd", m, A);
    return h && vt.append(" ", h), [J, vt];
  }
  const yt = document.getElementById("ppp-top"), Zt = () => {
    (i.hidden || i.classList.contains("ppp-frame--rest") ? t : i).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Vt = () => {
    var m;
    const f = window.XtrataRadioConnectStacks;
    f ? f() : (m = document.getElementById("radio-wallet-connect")) == null || m.click();
  }, we = () => {
    var m, A;
    const f = c.snapshot();
    if (f.step === "connect" || f.step === "wrong-wallet") {
      Vt();
      return;
    }
    if (f.step === "elsewhere" && ((m = f.gate) != null && m.radioUrl)) {
      location.href = f.gate.radioUrl;
      return;
    }
    f.step === "locked" && !f.armed && !f.busy && c.unlock(), f.step === "ready" && ((A = f.giftStop) == null ? void 0 : A.reason) === "off" && !f.busy && c.switchOn(), Zt();
  };
  yt && (yt.onclick = we);
  const ce = (f, m, A, h = "") => f.standIn && !f.mainConnected ? xt(`Connect ${_(f.standIn)} to add STX`, Vt, h) : xt(m, A, h), In = (f) => {
    c.useLinked(f).then(() => Zt());
  };
  let nn = null;
  const zr = () => {
    const f = j0(c.snapshot(), _);
    return f.length ? nn || (nn = new Promise((m) => {
      var un;
      const A = N("dialog", "", "ppp-connect");
      A.setAttribute("aria-labelledby", "ppp-connect-title");
      let h = null;
      const J = (Ht) => {
        h = Ht, A.close();
      };
      A.addEventListener("close", () => {
        A.remove(), nn = null, m(h);
      }), A.addEventListener("click", (Ht) => {
        Ht.target === A && J(null);
      });
      const vt = (Ht, jt, Qt, Tn, Fe = !1) => {
        const je = N("button", "", "ppp-connect__opt " + Qt);
        return je.type = "button", je.disabled = Fe, je.onclick = Tn, je.append(N("b", Ht), N("span", jt)), je;
      }, bt = N("h2", "Connect", "ppp-connect__title");
      bt.id = "ppp-connect-title";
      const zt = f.map((Ht) => vt(Ht.label, Ht.detail, "is-music", () => {
        if (J("music"), Ht.action === "linked" && Ht.main) {
          In(Ht.main);
          return;
        }
        const jt = j0(c.snapshot(), _).find((Qt) => Qt.action !== "linked");
        (jt == null ? void 0 : jt.action) === "create" ? c.create() : (jt == null ? void 0 : jt.action) === "unlock" && c.unlock(), Zt();
      }, !!Ht.disabled)), Ae = vt("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => J("stacks")), ln = xt("Cancel", () => J(null), "quiet ppp-connect__cancel");
      A.append(bt, ...zt, Ae, ln), document.body.appendChild(A), A.showModal(), (un = zt.find((Ht) => !Ht.disabled)) == null || un.focus();
    }), nn) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = zr;
  function xi(f) {
    if (!yt) return;
    const m = (h, J, vt) => {
      yt.hidden = !1, yt.className = "ppp-top" + (J ? " is-" + J : ""), yt.replaceChildren(N("span", "", "dot"), document.createTextNode(h)), yt.title = vt;
    }, A = f.session ? Math.min(f.session.playsLeft, f.playsLeft) : 0;
    switch (f.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        yt.hidden = !0;
        return;
      case "elsewhere":
        return m("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        yt.hidden = !0;
        return;
      case "intro":
        return m("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return m(`Connect ${_(f.linked)}`, "warn", `This device's listening wallet belongs to ${_(f.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return m("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return m("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return f.depositPending ? m("Plays on their way", "quiet", "Plays start by themselves when they land") : m(f.entries.some((h) => h.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return m("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return m("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return f.payingOn && A > 0 && !f.giftStop ? m(`${A.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : m("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const Ye = document.getElementById("pppNudge"), Gr = document.getElementById("onair");
  (Vr = Ye == null ? void 0 : Ye.querySelector("button")) == null || Vr.addEventListener("click", () => we());
  const tr = {
    connect: "Connect your wallet to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, Ln = {
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
  function go(f) {
    if (f.step === "loading") return;
    const m = f.session ? Math.min(f.session.playsLeft, f.playsLeft) : 0, A = f.step === "ready" && f.payingOn && m > 0 && !f.giftStop, h = f.step === "fund" && f.depositPending, J = f.step === "elsewhere" && !e, vt = A || h || J ? "" : tr[f.step] ?? "", bt = A ? "on" : J ? "free" : vt ? "off" : "";
    bt ? document.documentElement.dataset.ppp = bt : delete document.documentElement.dataset.ppp, Gr && (Gr.hidden = !bt || bt === "free", Gr.querySelector(".onair-sub").textContent = A ? `${m.toLocaleString()} plays left` : "Plays off"), Ye && (Ye.hidden = bt !== "off" && bt !== "free", Ye.classList.toggle("is-free", bt === "free"), bt === "free" ? (Ye.querySelector(".nudge-t").textContent = "You’re on the free player", Ye.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", Ye.querySelector("button").textContent = "Get a player") : bt === "off" && (Ye.querySelector(".nudge-t").textContent = vt, Ye.querySelector(".nudge-s").textContent = p(f) ? f.step === "intro" ? l$ : "" : "This radio requires a funded listening wallet with music support on.", Ye.querySelector("button").textContent = Ln[f.step] ?? "Start"));
  }
  let Is = "";
  function qt(f) {
    const m = N("div", "", "ppp-pick");
    f.funderMultiple && f.returnToKind === "funder" && m.append(N("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), f.returnToKind === "funder" && m.append(N("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const A = N("input");
    A.type = "text", A.placeholder = "SP… address to send returns to", A.autocomplete = "off", A.spellcheck = !1, A.setAttribute("aria-label", "Address to return funds to"), A.value = Is, A.oninput = () => {
      Is = A.value;
    };
    const h = xt(f.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(A.value), Is = "";
    }, "tiny");
    return m.append(A, " ", h), f.returnToKind === "chosen" && m.append(" ", xt("Back to the funder", () => c.clearReturnAddress(), "tiny")), m;
  }
  const rn = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function mn() {
    const f = N("p", rn + " ", "ppp-mute");
    return f.append(oe("Xverse", "https://www.xverse.app/download"), " · ", oe("Leather", "https://leather.io/install-extension")), f;
  }
  let Ls = "";
  const Si = (f) => {
    const m = document.documentElement, A = f.solo && !f.main ? f.listening ? De(f.listening) : "new" : "", h = D5() ? "1" : "", J = f.standIn && !f.mainConnected ? _(f.standIn) : "";
    `${A}|${h}|${J}` !== Ls && (Ls = `${A}|${h}|${J}`, A ? m.dataset.pppSolo = A : delete m.dataset.pppSolo, J ? m.dataset.pppAs = J : delete m.dataset.pppAs, h ? m.dataset.pppWalletInstalled = h : delete m.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const f of [1500, 4e3, 9e3]) setTimeout(() => Ue(c.snapshot()), f);
  function zn(f, m = "") {
    const A = N("div", "", "ppp-topup"), h = Lr(f);
    A.append(N("span", "Add plays from My player: ", "ppp-mute"));
    for (const J of Qa) {
      const vt = xt(`+${J.toLocaleString()}`, () => void c.topUpAlbum(J), m);
      vt.disabled = h === void 0 || h < J || f.depositPending || !!f.busy, A.append(vt);
    }
    return h !== void 0 && h < Qa[0] && A.append(N("p", "My player needs plays first (switch to My player above).", "ppp-mute")), A;
  }
  const Lr = (f) => {
    var h;
    const m = (h = f.likeFunds) == null ? void 0 : h.balance;
    if (m === void 0 || !f.playCost) return;
    const A = m - ze - 6000n;
    return A > 0n ? Number(A / f.playCost) : 0;
  };
  function Gn(f) {
    const m = f.likeFunds;
    if (!m || !m.album || !m.low && !m.pending) return [];
    if (m.low || (Lt = !1), m.low && !Lt) return [];
    const A = N("div", "", "ppp-pick ppp-lowbox");
    if (!m.low) {
      if (!m.txid) return [];
      const J = N("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return m.txid && J.append(oe("View", Se(m.txid))), A.append(J), [A];
    }
    A.append(N("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), A.append(N("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), A.append(N("p", m.address, "ppp-addr-full"));
    const h = N("div", "", "ppp-open-row");
    if (h.append(Fi("copy-likes-address", "Copy address", () => m.address, "primary", () => Ue(c.snapshot()))), m.main && !f.solo) {
      const J = js - (m.balance ?? 0n);
      J > 0n && h.append(ce(f, `Pay ${gr(J)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return A.append(h), A.append(N("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [A];
  }
  const Cn = (f) => {
    const m = N("div", "", "ppp-wait");
    m.dataset.since = String(f.since), m.dataset.grace = String(f.graceMs), m.setAttribute("role", "progressbar"), m.setAttribute("aria-label", "Your plays are arriving");
    const A = N("p", "", "ppp-wait-t"), h = N("div", "", "ppp-wait-track");
    return h.append(N("div", "", "ppp-wait-fill")), m.append(A, h), Kr(m), m;
  };
  function Kr(f) {
    const m = Number(f.dataset.since), A = Number(f.dataset.grace) || 6e4, h = Math.max(0, Date.now() - m), J = f.querySelector(".ppp-wait-fill"), vt = f.querySelector(".ppp-wait-t");
    if (h < A) {
      const bt = Math.ceil((A - h) / 1e3);
      J.style.width = Math.max(4, Math.min(95, h / A * 100)).toFixed(0) + "%", vt.textContent = `Your plays are arriving… usually about a minute · ${bt}s`, f.classList.remove("is-long"), f.setAttribute("aria-valuenow", String(Math.round(h / A * 100)));
    } else
      J.style.width = "", vt.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", f.classList.add("is-long"), f.removeAttribute("aria-valuenow");
  }
  let Ei = 0;
  setInterval(() => {
    const f = document.querySelectorAll(".ppp-wait");
    if (!f.length) {
      Ei = 0;
      return;
    }
    f.forEach(Kr), ++Ei % 10 === 0 && Ue(c.snapshot());
  }, 1e3);
  let Cs = null;
  function yo(f) {
    if (f.step === "loading" && Cs !== null) return;
    const A = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(f.step) || !!f.busy || f.armed || !!u.pendingCode() && !["ready", "fund", "over"].includes(f.step);
    A !== Cs && (Cs = A, A ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function Ue(f) {
    var oa, $i, aa, ca, y, T, O, lt, Oe, Xe, Kn, Ze, mo, Tr, xo;
    if (rt && ["ready", "fund", "over"].includes(f.step) && !f.busy) {
      const W = rt;
      rt = null, f.root === W.root && f.slot !== W.slot && c.openAlbum(W.slot);
    }
    const m = u.inProgress(f), A = Rt(f), h = m && f.step === "fund" ? { ...f, depositPending: !0 } : A !== null ? { ...f, depositPending: !0, arrival: { since: A, graceMs: $c } } : f, J = h.error === Ic;
    if (kt(), H = at(f), Yt(f, h), yo(h), Si(h), !m && u.inProgress(f)) return;
    if (xi(h), go(h), e && n && (n.hidden = !["off", "elsewhere", "loading"].includes(h.step), n.textContent = h.step === "loading" || !h.gate ? w.on ? u$ : "Checking your listening wallet…" : w.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), t.hidden = h.step === "off", t.hidden) {
      q(h, !1);
      return;
    }
    const [vt, bt] = _e(h), zt = s(".ppp-state");
    zt.textContent = vt, zt.className = "ppp-state" + (bt ? " ppp-state--" + bt : ""), zt.hidden = !vt;
    const Ae = !!h.busy || h.armed, ln = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(h.step) && (Ae || !["intro", "loading"].includes(h.step));
    i.hidden = !ln, i.classList.toggle("ppp-frame--rest", !Ae && !$n);
    const un = s(".ppp-frame-label");
    un.hidden = !0;
    const Ht = _5(h) ?? Ee;
    Ee = Ht;
    const jt = "xtrata.radio.ppp.heard.v1", Qt = (() => {
      try {
        return localStorage.getItem(jt) === "1";
      } catch {
        return !1;
      }
    })();
    if (!Qt && h.entries.some((W) => W.kind === "play"))
      try {
        localStorage.setItem(jt, "1");
      } catch {
      }
    const Tn = Qt || h.slot > 0 && ((((oa = h.likeFunds) == null ? void 0 : oa.balance) ?? 0n) > 0n || d.count() > 1), Fe = p(h), je = !Fe && H5({ ...h, heard: Tn }, Ht);
    s(".ppp-badge").hidden = !je;
    const fn = s(".ppp-steps"), Bn = s(".ppp-stage");
    fn.hidden = Bn.hidden = !je, Ht && je && (fn.replaceChildren(...Ku(h.solo).map((W, ot) => {
      const Ct = N("li", "", ot < Ht.at ? "done" : ot === Ht.at ? Ht.blocked ? "now blocked" : "now" : "");
      return Ct.append(N("span", ot < Ht.at ? "✓" : String(ot + 1), "n"), W), ot === Ht.at && Ct.setAttribute("aria-current", "step"), Ct;
    })), Bn.textContent = Ht.caption, Bn.className = "ppp-stage " + (Ht.at >= Ku(h.solo).length ? "ppp-ok" : Ht.blocked ? "ppp-bad" : "ppp-cyan"));
    const Sn = s(".ppp-facts"), dn = [];
    h.main && (($i = h.gate) != null && $i.here) && !h.solo && dn.push(...St("Your wallet", _(h.main), "ppp-addr-short"));
    const ki = () => {
      if (!h.listening) return;
      const W = Fi("copy-listening", "Copy", () => h.listening || "", "tiny", () => Ue(c.snapshot()));
      dn.push(...St(h.slot > 0 ? "Album wallet" : h.linked ? "My player (technical)" : "My player wallet", De(h.listening), "ppp-addr-short", W));
    };
    if (h.linked || ki(), h.listening && h.step !== "intro")
      if (h.linked)
        dn.push(...St("Credited to", `${_(h.linked)} · plays, likes and returns`, h.linked === h.main || h.solo ? "ppp-ok" : "ppp-warn")), ki();
      else if (h.solo) {
        h.creditedTo && dn.push(...St("Credited to", `${_(h.creditedTo)} · plays and likes`, "ppp-ok"));
        const W = h.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : h.returnTo ? `${_(h.returnTo)} · ${h.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : h.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        dn.push(...St("Returns go to", h.gift ? W : h.returnTo && !Ge(h.returnTo) ? W.replace(De(h.returnTo), h.returnTo) : W, h.returnTo && !h.gift ? "ppp-addr-full" : "ppp-mute"));
      } else dn.push(...St("Linked to", "not linked yet", "ppp-warn"));
    if (h.linkedListening.length && ((aa = h.gate) != null && aa.here)) {
      const W = h.linkedListening.map((ot) => De(ot) + (ot === h.listening ? " (this one)" : "")).join(", ");
      dn.push(...St(h.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", W, "ppp-addr-short"));
    }
    if (h.balance !== void 0 && ["fund", "ready", "over"].includes(h.step)) {
      const W = h.step === "fund" && h.depositPending ? "ppp-mute" : h.balanceState === "ok" ? "ppp-ok" : h.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      dn.push(...St("Balance", `${gr(h.balance)} STX · about ${h.playsLeft.toLocaleString()} plays`, W));
    }
    const En = h.entries.find((W) => W.kind === "play");
    En && ee(), En && dn.push(...St("Last paid song", `${ne(En)} → ${_(En.recipient)}`, ye[En.status] || "")), Sn.replaceChildren(...dn), Sn.hidden = !dn.length;
    const dt = [], g = [], k = [], R = [], et = Hn(BigInt(((ca = h.gate) == null ? void 0 : ca.limits.playFee) ?? "300")), Et = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${gr(vc)} STX to the song holder, plus a ${gr(et - vc)} STX network fee.`, z = !!h.busy;
    switch (h.step) {
      case "elsewhere": {
        if (dt.push(N("p", "Pay artists as you listen.")), (y = h.gate) != null && y.radioUrl) {
          const ot = N("p");
          ot.append(oe("Open the pay-per-play radio →", h.gate.radioUrl)), dt.push(ot);
        }
        g.push(N("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (h.linked) {
          const ot = [h.linked, ...h.others];
          dt.push(N("p", ot.length > 1 ? `This device has listening wallets for ${F(ot)}.` : `This device has a listening wallet for ${_(h.linked)}.`)), g.push(N("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), ot.slice(0, 3).forEach((Ct, pe) => k.push(xt(`Open ${_(Ct)}`, () => In(Ct), pe === 0 ? "primary" : "")));
        } else
          dt.push(N("p", "Connect your wallet to pay artists as you listen.")), g.push(N("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        dt.push(N("p", `This device's listening wallet belongs to ${_(h.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), g.push(N("p", `You are connected as ${_(h.main)}. Switch to the linked wallet to continue listening.`)), g.push(N("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), k.push(xt("Switch wallet", Vt, "primary"));
        break;
      case "not-invited":
        dt.push(N("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        dt.push(N("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        dt.push(N("p", "Every play counts for the song’s owner, on-chain.")), g.push(N("p", Et)), g.push(N("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), g.push(N("p", h.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !h.solo && h.main && h.others.length ? (dt.push(N("p", `This device already has a listening wallet for ${F(h.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), g.push(N("p", `Otherwise, set up a new listening wallet for ${_(h.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !h.solo && h.main && g.push(N("p", `This is the listening wallet for ${_(h.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), h.solo && g.push(N("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const W = u.liveGift();
        k.push(xt(W ? "Claim my gift · no wallet needed" : h.solo ? "Start listening · no wallet needed" : h.others.length && h.main ? `Set up for ${_(h.main)}` : "Start listening", () => void c.create(), "primary")), !W && !h.solo && h.main && h.others.length && k.push(xt("Switch wallet", Vt)), !W && h.solo && k.push(xt("I have a Stacks wallet", Vt)), k.push(xt("I already have a listening wallet", () => void c.unlock(!0))), W && k.push(xt("Not now", () => u.setAside(), "quiet"));
        break;
      case "locked":
        h.armed || (dt.push(N("p", "Locked.", "ppp-mute")), k.push(xt("Unlock", () => void c.unlock(), "primary"))), h.standIn ? R.push(xt("Use a different listening wallet", () => void zr().then((ot) => {
          ot === "stacks" && Vt();
        }), "quiet")) : R.push(xt("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        dt.push(N("p", `Link to ${_(h.main)} · free`)), g.push(N("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), g.push(N("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), k.push(xt(h.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        dt.push(N("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (h.depositPending ? h.arrival && dt.push(Cn(h.arrival)) : Xt(h) ? dt.push(N("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (T = h.gift) != null && T.player ? dt.push(N("p", "Out of plays · add more to keep listening", "ppp-bad")) : h.entries.length ? dt.push(N("p", "No plays left · add plays to keep counting", "ppp-bad")) : dt.push(N("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / et)).toLocaleString()} plays`)), h.entries.length && g.push(N("p", "Playback is paused until your top-up confirms.")), h.payingOn && !h.entries.length && g.push(N("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), m ? g.push(N("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : h.depositPending ? g.push(N("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : h.solo ? (g.push(N("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), g.push(N("p", h.listening || "", "ppp-addr-full")), h.listening && !h.depositPending && k.push(Fi("copy-address", "Copy my address", () => h.listening || "", "primary", () => Ue(c.snapshot())))) : g.push(N("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), h.depositPending && h.depositTxid) {
          const ot = N("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          ot.append(oe("View", Se(h.depositTxid))), dt.push(ot);
        } else h.allowance > 0n && !h.solo && !h.depositPending && k.push(ce(h, `Deposit ${gr(h.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        dt.push(N("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), h.solo && !h.returnTo && (dt.push(N("p", h.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), dt.push(qt(h))), (!h.solo || h.returnTo) && k.push(xt("Return excess", () => void c.returnFunds("excess"), "primary"), xt("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (h.payingOn && h.session && h.session.playsLeft > 0 && ((O = h.giftStop) == null ? void 0 : O.reason) !== "off") {
          const ot = Math.min(h.session.playsLeft, h.playsLeft);
          dt.push(N("p", `${ot.toLocaleString()} plays left`, "ppp-ok")), g.push(N("p", Et + " The heart likes or unlikes from this wallet for 0.0002 STX.")), k.push(xt("Switch off", () => void c.switchOff()));
        } else
          dt.push(N("p", "Switch on music support to listen.", "ppp-mute")), k.push(xt("Switch plays on", () => void c.switchOn(), "primary"));
        h.queued && dt.push(N("p", h.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${h.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), h.balanceState === "low" && dt.push(N("p", "Running low on plays", "ppp-warn")), h.depositPending ? dt.push(N("p", "Plays on their way…", "ppp-warn")) : h.allowance > 0n && h.balanceState !== "ok" && !h.solo && k.push(ce(h, `Top up ${gr(h.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (h.solo && h.walletCannotSolo && g.push(N("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), h.solo && ["fund", "ready"].includes(h.step) && ((h.balance ?? 0n) > 0n && h.slot === 0 && g.push(qt(h)), g.push(mn()), h.slot === 0 && h.step === "ready" && h.entries.some((W) => W.kind === "play" && W.status === "confirmed"))) {
      const W = N("p", "New to Stacks? ", "ppp-mute");
      W.append(oe("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), dt.push(W);
    }
    if (h.walletOutdated && g.push(N("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), h.stuck && (dt.push(N("p", h.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${h.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), k.push(xt("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(h.step) && (h.returnTo || h.gift) && (h.balance ?? 0n) > 0n && R.push(xt(h.linked ? "Return all to my wallet" : h.gift ? "Return what is left…" : `Return all to ${_(h.returnTo)}`, () => void c.returnFunds("all"), "quiet")), h.slot > 0 && ((lt = h.gift) != null && lt.player) && ["ready", "fund"].includes(h.step) && h.giftPlays > 20 && R.push(zn(h, "quiet")), ["ready", "fund", "link", "over"].includes(h.step) && R.push(xt("Lock", () => void c.lock(), "quiet")), ln && !Ae && R.push(xt($n ? "Hide listening wallet box" : "Show listening wallet box", () => {
      $n = !$n, Ue(c.snapshot());
    }, "quiet")), [...k, ...R].forEach((W) => W.disabled = z), z && (k.length = 0), !Fe && h.balance !== void 0 && ["fund", "ready", "over"].includes(h.step) && !(h.step === "fund" && h.depositPending && h.balance === 0n) && !((Oe = h.gift) != null && Oe.player)) {
      const W = h.balanceState === "ok" ? "ppp-ok" : h.balanceState === "low" ? "ppp-warn" : "ppp-bad", ot = dt.at(0);
      h.step === "ready" && ot ? ot.append(N("span", ` · ${We(h.balance)} STX`, W)) : dt.push(N("p", `Balance ${We(h.balance)} STX`, W));
    }
    if (Fe) {
      for (const Ct of [...k, ...R]) {
        const pe = i$[Ct.textContent ?? ""];
        pe && (Ct.textContent = pe);
      }
      for (let Ct = dt.length - 1; Ct >= 0; Ct--) z0(dt[Ct].textContent) && g.unshift(...dt.splice(Ct, 1));
      for (let Ct = k.length - 1; Ct >= 0; Ct--) z0(k[Ct].textContent) && R.unshift(...k.splice(Ct, 1));
      const W = h.entries.some((Ct) => Ct.kind === "play"), ot = c$(h.step, { played: W, arriving: h.depositPending });
      ot.length && dt.length && ot.shift(), dt.push(...ot.map((Ct) => N("p", Ct, "ppp-mute")));
    }
    if ((Xe = h.gift) != null && Xe.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(h.step)) {
      const W = N("p", "", "ppp-gift");
      W.append(`💿 Album · ${h.gift.player.title}`), h.gift.player.subtitle && W.append(" · ", h.gift.player.subtitle);
      const ot = ["ready", "fund", "over"].includes(h.step) && h.balance !== void 0 ? h.giftPlays === 0 && h.depositPending ? N("span", " · plays on their way", "ppp-warn") : N("span", h.giftPlays === 0 ? " · no plays left" : ` · ${h.giftPlays.toLocaleString()} ${h.giftPlays === 1 ? "play" : "plays"} left`, h.giftPlays === 0 ? "ppp-bad" : h.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      ot && W.append(ot);
      const Ct = (Kn = dt.at(0)) == null ? void 0 : Kn.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (h.step === "ready" && Ct && /STX/.test(Ct.textContent ?? "") && Ct.remove(), dt.unshift(W), h.giftPlays <= 20 && ["ready", "fund"].includes(h.step) && !h.depositPending)
        if (h.slot > 0)
          dt.splice(1, 0, N("p", h.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), zn(h, "primary"));
        else {
          const pe = N("p", h.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          pe.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), pe.append(oe("Xverse", "https://www.xverse.app/download"), " and ", oe("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), dt.splice(1, 0, pe);
        }
    }
    if (h.gift && !h.linked && ["fund", "ready", "over"].includes(h.step) && h.returnPlan.state === "ready") {
      const W = h.returnPlan, ot = N("div", "", "ppp-pick");
      ot.append(N("p", W.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Ct = N("ul", "", "ppp-gift-list");
      W.steps.forEach((pe, ol) => {
        const So = pe.kind === "gift" ? "the unused gift" : pe.kind === "deposit" ? "what was added to it" : "the rest", Vn = N("li");
        Vn.append(N("span", `${ol + 1}. ${gr(BigInt(pe.send))} STX · ${So}`, "t"), N("span", pe.to ? ` → ${_(pe.to)}` : " → choose an address below", pe.to ? "ppp-mute" : "ppp-warn")), Ct.append(Vn);
      }), ot.append(Ct), W.kept && ot.append(N("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), W.steps.some((pe) => !pe.to) && ot.append(qt(h)), ot.append(xt(W.steps.length > 1 ? `Confirm part 1 of ${W.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), dt.push(ot);
    }
    const pt = lr(h), gt = x ? pt : null, mt = u.banner(f, { bare: !!gt }), Bt = ge && (u.pendingCode() || ["intro", "locked", "unsupported"].includes(h.step)) ? $(ge, u.pendingCode()) : [];
    gt || (dt.unshift(...mt), dt.push(...Gn(h)), dt.unshift(...Bt)), h.solo && h.creditedTo && h.listening && !["intro", "off", "elsewhere", "loading"].includes(h.step) && dt.unshift(N("p", `This is ${_(h.creditedTo)}'s listening wallet. Plays and likes count for ${_(h.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...dt);
    const Be = document.querySelector(".ppp-switch");
    if (Be) {
      const W = d.latest(), ot = h.slot > 0, Ct = ["fund", "ready", "over"].includes(h.step) && (ot || !!W);
      if (Be.hidden = !Ct, Ct) {
        const pe = (Vn, cd, Nw, Pw) => {
          const la = xt("", Pw, "ppp-tab");
          return la.setAttribute("aria-pressed", String(Nw)), la.append(N("span", Vn, "tt"), N("span", cd === void 0 ? "…" : `${he(cd).toLocaleString()} plays`, "ts")), la.disabled = !!h.busy, la;
        }, ol = ot ? ((mo = (Ze = h.gift) == null ? void 0 : Ze.player) == null ? void 0 : mo.title) ?? "Album" : W.title, So = xt("View all albums" + (d.count() > 1 ? ` (${d.count()})` : ""), () => {
          const Vn = document.querySelector(".ppp-shelf");
          Vn && (Vn.hidden = !1, Vn.open = !Vn.open, So.setAttribute("aria-expanded", String(Vn.open)), Vn.open && requestAnimationFrame(() => Vn.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        So.setAttribute("aria-expanded", String(!!((Tr = document.querySelector(".ppp-shelf")) != null && Tr.open))), Be.replaceChildren(
          pe("🎧 My player", ot ? (xo = h.likeFunds) == null ? void 0 : xo.balance : h.balance, !ot, () => {
            ot && c.openAlbum(0);
          }),
          pe("💿 " + ol, ot ? h.balance : void 0, ot, () => {
            !ot && W && c.openAlbum(W.slot);
          }),
          So
        );
      }
    }
    const Ke = d.render(h), He = document.querySelector(".ppp-shelf");
    if (He) {
      He.hidden = !Ke;
      const W = He.querySelector("summary");
      W && (W.textContent = d.count() > 0 ? `♪ My albums (${d.count()})` : "♪ My albums");
      const ot = He.querySelector(".ppp-shelf-body");
      Ke && ot && !ot.contains(Ke) && ot.replaceChildren(Ke);
    }
    const Ve = u.renderFold(f);
    if (s(".ppp-gifts").hidden = !Ve, Ve && !s(".ppp-gift-body").contains(Ve) && s(".ppp-gift-body").replaceChildren(Ve), Ve && ae) {
      ae = !1;
      const W = s(".ppp-gifts");
      W.open = !0, requestAnimationFrame(() => W.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    s(".ppp-body").replaceChildren(...g), s(".ppp-actions").replaceChildren(...k), s(".ppp-actions2").replaceChildren(...R);
    const Cr = h.busy || h.message || "", ia = s(".ppp-msg"), wo = Cr && dt.some((W) => (W.textContent ?? "").startsWith(Cr.replace(/[.✓\s]+$/, ""))) ? "" : Cr, bo = !wo && !h.error ? h.notice : J && !wo ? h.error : "";
    ia.textContent = wo || bo, ia.classList.toggle("is-warn", !!bo), s(".ppp-err").textContent = J ? "" : h.error;
    const il = h.entries.filter((W) => W.kind === "play");
    s(".ppp-recent").hidden = !h.entries.length, s(".ppp-recent-list").replaceChildren(...il.slice(0, 5).map((W) => {
      const ot = N("li"), Ct = W.status === "confirmed" ? "ok" : W.status === "failed" ? "bad" : "warn";
      return ot.append(N("span", "", "d " + Ct), N("span", ne(W), "t"), N("span", en(W.created), "ppp-mute")), W.txid && ot.append(oe("tx", Se(W.txid))), ot;
    })), s(".ppp-wallets").hidden = !(Sn.childElementCount || R.length), s(".ppp-more").hidden = !g.length;
    const Bs = s(".ppp-history");
    Bs.hidden = !h.entries.length, h.entries.length && ee(), Bs.replaceChildren(N("summary", `All activity (${h.entries.length})`), ...h.entries.slice(0, 20).map((W) => {
      const ot = N("div", "", "ppp-row"), Ct = W.kind === "play" ? [N("span", ne(W), "ppp-song"), N("span", ` · ${gr(BigInt(W.amount))} STX to ${_(W.recipient)}`, "ppp-mute")] : W.kind === "like" ? [N("span", `${W.liked ? "♥ Liked" : "Unliked"} ${ne(W)}`, "ppp-song"), N("span", ` · for ${h.linked ? _(h.linked) : "this listening wallet"}`, "ppp-mute")] : [N("span", `Returned ${gr(BigInt(W.amount))} STX`, "ppp-song"), N("span", ` to ${_(W.recipient)}`, "ppp-mute")];
      return ot.append(
        N("span", $e[W.status] || W.status, "ppp-status " + (ye[W.status] || "")),
        ...Ct,
        N("span", ` · ${new Date(W.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), W.txid && ot.append(oe("tx ↗", Se(W.txid))), ot;
    })), G == null || G.render(gt ? xn(h, gt, [...Bt, ...mt]) : null), q(h, !!gt, Bt), P == null || P.render((pt == null ? void 0 : pt.mode) === "open" ? xn(h, pt, []) : null);
  }
  function lr(f) {
    var h;
    if (["off", "elsewhere", "not-invited"].includes(f.step)) return null;
    if (f.slot > 0 && ((h = f.gift) != null && h.player) && ["fund", "ready", "over", "link", "loading"].includes(f.step))
      return f.root && C({ root: f.root, slot: f.slot, player: f.gift.player }), { mode: "open", player: f.gift.player };
    const m = u.incomingAlbum();
    if (m) return { mode: "arrive", player: m.player, from: m.from, offered: m.plays };
    const A = L();
    return A && (f.step === "locked" || rt && f.step === "loading") ? { mode: "locked", player: A.player } : null;
  }
  function xn(f, m, A) {
    var Ae, ln, un, Ht, jt;
    const h = !!f.busy || f.armed, J = [...A];
    f.depositPending && f.arrival && J.push(Cn(f.arrival)), f.error ? J.push(N("p", f.error, f.error === Ic ? "ppp-warn" : "ppp-bad")) : f.message && !h ? J.push(N("p", f.message, "ppp-cyan")) : f.notice && J.push(N("p", f.notice, "ppp-warn")), m.mode === "open" && Lt && ((Ae = f.likeFunds) != null && Ae.album) && f.likeFunds.low && !f.likeFunds.pending && J.push(N("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let vt = "Kept on this device with Face ID or your passkey. No app or account needed.", bt = null, zt = null;
    if (m.mode === "locked")
      bt = { label: "Continue listening", run: () => {
        rt = L(), c.unlock();
      } }, zt = { label: "Use a different passkey", run: () => {
        rt = null, c.unlock(!0);
      } };
    else if (m.mode === "arrive")
      if (f.step === "intro" && Ra(E) && E.album === m.player.id) {
        const Qt = window.XtrataRadio, Tn = Ks(m.player)[0], Fe = E.phase === "playing";
        bt = { label: Fe && !!((un = (ln = Qt == null ? void 0 : Qt.getState) == null ? void 0 : ln.call(Qt)) != null && un.playing) ? "Pause" : Fe ? "Carry on" : "Play the first song", run: () => {
          var fn, Bn;
          Fe ? (fn = Qt == null ? void 0 : Qt.playPause) == null || fn.call(Qt) : Tn && ((Bn = Qt == null ? void 0 : Qt.playToken) == null || Bn.call(Qt, Tn.id));
        } }, zt = { label: "Make my player and hear it all", run: () => void c.create() }, vt = "The first song is free. Nothing to set up yet.";
      } else if (f.step === "intro") {
        const Qt = E.phase === "done" && E.album === m.player.id;
        Qt && !J.length && J.push(N("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), bt = { label: Qt ? "Keep listening" : "Open album", run: () => void c.create() }, zt = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else f.step === "locked" ? (bt = { label: "Open album", run: () => void c.unlock() }, zt = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : f.step === "unsupported" ? J.push(N("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : J.length || J.push(N("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: m.mode,
      player: m.player,
      from: m.from,
      offered: m.offered,
      plays: m.mode === "open" ? f.balance === void 0 ? null : f.giftPlays : void 0,
      playsComing: f.depositPending,
      status: J,
      primary: bt,
      secondary: zt,
      hint: bt ? vt : void 0,
      asking: h,
      busy: !!f.busy,
      myPlays: Lr(f),
      topUps: Qa,
      canMake: !!((jt = (Ht = f.gate) == null ? void 0 : Ht.gifts) != null && jt.admin)
    };
  }
  const Ai = /* @__PURE__ */ new Map();
  let Ts = !1;
  const vi = () => {
    const f = window.XtrataRadio;
    return f != null && f.subscribe ? (f.subscribe((m) => {
      const A = m == null ? void 0 : m.nowPlaying;
      if (A && Number.isSafeInteger(Number(A.tokenId)) && Ai.set(Number(A.tokenId), { title: A.title || void 0, artist: A.artist || void 0 }), Ra(E)) {
        const h = !!(m != null && m.playing);
        it({ kind: "now", track: A && A.tokenId != null ? String(A.tokenId) : null, playing: h, at: Date.now() }), h !== Ts && (Ts = h, Ue(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!vi()) {
    const f = setInterval(() => {
      vi() && clearInterval(f);
    }, 500);
    setTimeout(() => clearInterval(f), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (f) => {
    const m = f.detail;
    if (Ra(E) && it({ kind: "listened", at: Date.now() }), m && Number.isSafeInteger(m.song) && typeof m.id == "string" && /^[0-9a-f]{32}$/.test(m.id)) {
      ee();
      const A = Jt(m.song, Ai.get(m.song));
      c.onListened({ song: m.song, id: m.id, title: A.title || void 0, artist: A.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (e || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const p$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", g$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, y$ = () => g$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, w$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, b$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Mw = class {
  constructor(t) {
    L4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && Wx(t), this.callback(zc(t));
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
    var r, s, i, o, a, c, u, d, l, w;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (d = (u = t.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(t)) !== null && d !== void 0 ? d : t.webUrl : (w = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && w !== void 0 ? w : this.getMobileUrl(t);
  }
  render() {
    const t = y$(), e = w$(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return Tt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Tt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Tt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Tt("div", { class: "flex flex-col space-y-[10px]" }, Tt("div", { class: "flex items-center" }, Tt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Tt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Tt("span", { class: "sr-only" }, "Close popup"), Tt("img", { src: p$ }))), r ? Tt("p", null, "Select the wallet you want to connect to.") : Tt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && Tt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Tt("div", { class: "mt-6" }, Tt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Tt("ul", { class: "space-y-3" }, this.installedProviders.map((i) => Tt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Tt("div", { class: "aspect-square basis-9 overflow-hidden" }, Tt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Tt("div", { class: "flex-1" }, Tt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Tt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), Tt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && Tt("div", { class: "mt-6" }, r ? Tt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Tt("div", { class: "mb-5 flex justify-between" }, Tt("p", { class: "text-sm font-medium" }, "Recommended wallets"), Tt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Tt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Tt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Tt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Tt("p", null, "What is a wallet? ", Tt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Tt("ul", { class: "space-y-3" }, n.map((i) => Tt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Tt("div", { class: "aspect-square basis-9 overflow-hidden" }, Tt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Tt("div", { class: "flex-1" }, Tt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Tt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && Tt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return l4(this);
  }
};
Mw.style = b$;
const m$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Mw
}, Symbol.toStringTag, { value: "Module" }));
