var ww = Object.defineProperty;
var bw = (t, e, n) => e in t ? ww(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var ho = (t, e, n) => bw(t, typeof e != "symbol" ? e + "" : e, n);
var un = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function B0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function wc(t) {
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
      typeof un < "u" && un || {}, r = {
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
      function i(I) {
        return I && DataView.prototype.isPrototypeOf(I);
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
        ], o = ArrayBuffer.isView || function(I) {
          return I && s.indexOf(Object.prototype.toString.call(I)) > -1;
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
      function f(I) {
        this.map = {}, I instanceof f ? I.forEach(function(P, b) {
          this.append(b, P);
        }, this) : Array.isArray(I) ? I.forEach(function(P) {
          if (P.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + P.length);
          this.append(P[0], P[1]);
        }, this) : I && Object.getOwnPropertyNames(I).forEach(function(P) {
          this.append(P, I[P]);
        }, this);
      }
      f.prototype.append = function(I, P) {
        I = a(I), P = c(P);
        var b = this.map[I];
        this.map[I] = b ? b + ", " + P : P;
      }, f.prototype.delete = function(I) {
        delete this.map[a(I)];
      }, f.prototype.get = function(I) {
        return I = a(I), this.has(I) ? this.map[I] : null;
      }, f.prototype.has = function(I) {
        return this.map.hasOwnProperty(a(I));
      }, f.prototype.set = function(I, P) {
        this.map[a(I)] = c(P);
      }, f.prototype.forEach = function(I, P) {
        for (var b in this.map)
          this.map.hasOwnProperty(b) && I.call(P, this.map[b], b, this);
      }, f.prototype.keys = function() {
        var I = [];
        return this.forEach(function(P, b) {
          I.push(b);
        }), u(I);
      }, f.prototype.values = function() {
        var I = [];
        return this.forEach(function(P) {
          I.push(P);
        }), u(I);
      }, f.prototype.entries = function() {
        var I = [];
        return this.forEach(function(P, b) {
          I.push([b, P]);
        }), u(I);
      }, r.iterable && (f.prototype[Symbol.iterator] = f.prototype.entries);
      function l(I) {
        if (!I._noBody) {
          if (I.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          I.bodyUsed = !0;
        }
      }
      function y(I) {
        return new Promise(function(P, b) {
          I.onload = function() {
            P(I.result);
          }, I.onerror = function() {
            b(I.error);
          };
        });
      }
      function p(I) {
        var P = new FileReader(), b = y(P);
        return P.readAsArrayBuffer(I), b;
      }
      function x(I) {
        var P = new FileReader(), b = y(P), T = /charset=([A-Za-z0-9_-]+)/.exec(I.type), D = T ? T[1] : "utf-8";
        return P.readAsText(I, D), b;
      }
      function S(I) {
        for (var P = new Uint8Array(I), b = new Array(P.length), T = 0; T < P.length; T++)
          b[T] = String.fromCharCode(P[T]);
        return b.join("");
      }
      function B(I) {
        if (I.slice)
          return I.slice(0);
        var P = new Uint8Array(I.byteLength);
        return P.set(new Uint8Array(I)), P.buffer;
      }
      function z() {
        return this.bodyUsed = !1, this._initBody = function(I) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = I, I ? typeof I == "string" ? this._bodyText = I : r.blob && Blob.prototype.isPrototypeOf(I) ? this._bodyBlob = I : r.formData && FormData.prototype.isPrototypeOf(I) ? this._bodyFormData = I : r.searchParams && URLSearchParams.prototype.isPrototypeOf(I) ? this._bodyText = I.toString() : r.arrayBuffer && r.blob && i(I) ? (this._bodyArrayBuffer = B(I.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(I) || o(I)) ? this._bodyArrayBuffer = B(I) : this._bodyText = I = Object.prototype.toString.call(I) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof I == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(I) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
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
          return this.text().then(N);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var R = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function A(I) {
        var P = I.toUpperCase();
        return R.indexOf(P) > -1 ? P : I;
      }
      function _(I, P) {
        if (!(this instanceof _))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        P = P || {};
        var b = P.body;
        if (I instanceof _) {
          if (I.bodyUsed)
            throw new TypeError("Already read");
          this.url = I.url, this.credentials = I.credentials, P.headers || (this.headers = new f(I.headers)), this.method = I.method, this.mode = I.mode, this.signal = I.signal, !b && I._bodyInit != null && (b = I._bodyInit, I.bodyUsed = !0);
        } else
          this.url = String(I);
        if (this.credentials = P.credentials || this.credentials || "same-origin", (P.headers || !this.headers) && (this.headers = new f(P.headers)), this.method = A(P.method || this.method || "GET"), this.mode = P.mode || this.mode || null, this.signal = P.signal || this.signal || function() {
          if ("AbortController" in n) {
            var C = new AbortController();
            return C.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && b)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(b), (this.method === "GET" || this.method === "HEAD") && (P.cache === "no-store" || P.cache === "no-cache")) {
          var T = /([?&])_=[^&]*/;
          if (T.test(this.url))
            this.url = this.url.replace(T, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var D = /\?/;
            this.url += (D.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      _.prototype.clone = function() {
        return new _(this, { body: this._bodyInit });
      };
      function N(I) {
        var P = new FormData();
        return I.trim().split("&").forEach(function(b) {
          if (b) {
            var T = b.split("="), D = T.shift().replace(/\+/g, " "), C = T.join("=").replace(/\+/g, " ");
            P.append(decodeURIComponent(D), decodeURIComponent(C));
          }
        }), P;
      }
      function Q(I) {
        var P = new f(), b = I.replace(/\r?\n[\t ]+/g, " ");
        return b.split("\r").map(function(T) {
          return T.indexOf(`
`) === 0 ? T.substr(1, T.length) : T;
        }).forEach(function(T) {
          var D = T.split(":"), C = D.shift().trim();
          if (C) {
            var ot = D.join(":").trim();
            try {
              P.append(C, ot);
            } catch (X) {
              console.warn("Response " + X.message);
            }
          }
        }), P;
      }
      z.call(_.prototype);
      function tt(I, P) {
        if (!(this instanceof tt))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (P || (P = {}), this.type = "default", this.status = P.status === void 0 ? 200 : P.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = P.statusText === void 0 ? "" : "" + P.statusText, this.headers = new f(P.headers), this.url = P.url || "", this._initBody(I);
      }
      z.call(tt.prototype), tt.prototype.clone = function() {
        return new tt(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new f(this.headers),
          url: this.url
        });
      }, tt.error = function() {
        var I = new tt(null, { status: 200, statusText: "" });
        return I.ok = !1, I.status = 0, I.type = "error", I;
      };
      var G = [301, 302, 303, 307, 308];
      tt.redirect = function(I, P) {
        if (G.indexOf(P) === -1)
          throw new RangeError("Invalid status code");
        return new tt(null, { status: P, headers: { location: I } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(P, b) {
          this.message = P, this.name = b;
          var T = Error(P);
          this.stack = T.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function V(I, P) {
        return new Promise(function(b, T) {
          var D = new _(I, P);
          if (D.signal && D.signal.aborted)
            return T(new e.DOMException("Aborted", "AbortError"));
          var C = new XMLHttpRequest();
          function ot() {
            C.abort();
          }
          C.onload = function() {
            var k = {
              statusText: C.statusText,
              headers: Q(C.getAllResponseHeaders() || "")
            };
            D.url.indexOf("file://") === 0 && (C.status < 200 || C.status > 599) ? k.status = 200 : k.status = C.status, k.url = "responseURL" in C ? C.responseURL : k.headers.get("X-Request-URL");
            var m = "response" in C ? C.response : C.responseText;
            setTimeout(function() {
              b(new tt(m, k));
            }, 0);
          }, C.onerror = function() {
            setTimeout(function() {
              T(new TypeError("Network request failed"));
            }, 0);
          }, C.ontimeout = function() {
            setTimeout(function() {
              T(new TypeError("Network request timed out"));
            }, 0);
          }, C.onabort = function() {
            setTimeout(function() {
              T(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function X(k) {
            try {
              return k === "" && n.location.href ? n.location.href : k;
            } catch {
              return k;
            }
          }
          if (C.open(D.method, X(D.url), !0), D.credentials === "include" ? C.withCredentials = !0 : D.credentials === "omit" && (C.withCredentials = !1), "responseType" in C && (r.blob ? C.responseType = "blob" : r.arrayBuffer && (C.responseType = "arraybuffer")), P && typeof P.headers == "object" && !(P.headers instanceof f || n.Headers && P.headers instanceof n.Headers)) {
            var St = [];
            Object.getOwnPropertyNames(P.headers).forEach(function(k) {
              St.push(a(k)), C.setRequestHeader(k, c(P.headers[k]));
            }), D.headers.forEach(function(k, m) {
              St.indexOf(m) === -1 && C.setRequestHeader(m, k);
            });
          } else
            D.headers.forEach(function(k, m) {
              C.setRequestHeader(m, k);
            });
          D.signal && (D.signal.addEventListener("abort", ot), C.onreadystatechange = function() {
            C.readyState === 4 && D.signal.removeEventListener("abort", ot);
          }), C.send(typeof D._bodyInit > "u" ? null : D._bodyInit);
        });
      }
      return V.polyfill = !0, n.fetch || (n.fetch = V, n.Headers = f, n.Request = _, n.Response = tt), e.Headers = f, e.Request = _, e.Response = tt, e.fetch = V, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : un);
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
function Ew(...t) {
  const { fetchLib: e, middlewares: n } = Sw(t);
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
var Oi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Oi || (Oi = {}));
var js;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(js || (js = {}));
var Zf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Zf || (Zf = {}));
const Aw = "https://api.mainnet.hiro.so", vw = "https://api.testnet.hiro.so", kw = "http://localhost:3999", $w = ["mainnet", "testnet", "devnet", "mocknet"];
let Di = class {
  constructor(e) {
    this.version = js.Mainnet, this.chainId = Oi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === js.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, i) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${i}?proof=0`, this.getMapEntryUrl = (n, r, i) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${i}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Ew();
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
Di.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Il();
    case "testnet":
      return new Iw();
    case "devnet":
      return new Lw();
    case "mocknet":
      return new M0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${$w.join(", ")}`);
  }
};
Di.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Di.fromName(t);
let Il = class extends Di {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Aw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = js.Mainnet, this.chainId = Oi.Mainnet;
  }
}, Iw = class extends Di {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? vw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = js.Testnet, this.chainId = Oi.Testnet;
  }
}, M0 = class extends Di {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? kw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = js.Testnet, this.chainId = Oi.Testnet;
  }
};
const Lw = M0, N0 = "xtrata.wallet.bridge.v1", Cw = (t) => typeof t == "object" && t !== null && t.protocol === N0, Tw = (t) => Cw(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", Bw = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class po extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Qf = 12e4;
class Mw {
  constructor(e) {
    ho(this, "pending", /* @__PURE__ */ new Map());
    ho(this, "listenTarget");
    ho(this, "closed", !1);
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
    ho(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !Tw(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new po("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new po("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new po("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const i = Bw(), s = { protocol: N0, kind: "request", id: i, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(i), a(
          new po(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Qf}ms.`
          )
        );
      }, this.options.timeoutMs ?? Qf);
      this.pending.set(i, { resolve: o, reject: a, timer: c }), r.postMessage(s, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new po("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const Nw = ["SP", "SM"], Pw = ["ST", "SN"], _w = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return Nw.includes(n) ? "mainnet" : Pw.includes(n) ? "testnet" : null;
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
}, Hw = () => typeof window > "u" || !window.localStorage ? Uw() : window.localStorage, Xc = "xtrata.v15.1.wallet.session", Jf = "mainnet", Fa = { isConnected: !1 }, Ow = (t) => t.address ? _w(t.address) ?? t.network : t.network, P0 = (t) => !t.isConnected || !t.address ? { ...Fa } : Ow(t) !== Jf ? { ...Fa } : {
  isConnected: !0,
  address: t.address,
  network: Jf,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Dw = (t) => {
  if (!t)
    return { ...Fa };
  try {
    const e = JSON.parse(t);
    return P0(e);
  } catch {
    return { ...Fa };
  }
}, Fw = (t) => {
  const e = P0(t);
  return JSON.stringify(e);
}, jw = (t) => {
  const e = Hw();
  return {
    load: () => Dw(e.getItem(Xc)),
    save: (n) => {
      e.setItem(Xc, Fw(n));
    },
    clear: () => {
      e.removeItem(Xc);
    }
  };
}, zw = "https://browser.blockstack.org/auth", Rw = {
  "@type": "Person",
  "@context": "http://schema.org"
}, _0 = ["store_write"], Gw = "blockstack-session", Kw = {
  logLevel: "debug"
}, ii = {
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
Object.freeze(ii);
class no extends Error {
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
class Vw extends no {
  constructor(e, n = "") {
    super({ code: ii.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class td extends no {
  constructor(e = "") {
    super({ code: ii.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class Jo extends no {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: ii.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class ed extends no {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: ii.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Ll extends no {
  constructor(e) {
    super({ code: ii.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class U0 extends no {
  constructor(e) {
    super({ code: ii.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const nd = ["debug", "info", "warn", "error", "none"], Cl = {};
for (let t = 0; t < nd.length; t++) {
  const e = nd[t];
  Cl[e] = t;
}
class Ci {
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
    return Cl[Kw.logLevel] <= Cl[e];
  }
}
function qw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Ww() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Yc(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((i) => parseInt(i, 10)), r = e.split(".").map((i) => parseInt(i, 10));
  for (let i = 0; i < e.length; i++)
    if (i >= t.length && r.push(0), n[i] < r[i])
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
function _u(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let i;
  try {
    if (i = Yw(), i) {
      const s = i[t];
      if (s)
        return s;
    }
  } catch (s) {
    Ci.error(`Error getting object '${t}' from global scope '${i}': ${s}`);
  }
  if (e) {
    const s = Zw(i, t.toString(), n);
    throw Ci.error(s), new Error(s);
  }
  if (r)
    return {};
}
function Ss(t, e) {
  return Uu(sn(t), e);
}
function sn(t) {
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
  if (En(t, Uint8Array))
    return BigInt(`0x${ht(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Qw(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function rd(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function zo(t, e = 8) {
  return (typeof t == "bigint" ? t : sn(t)).toString(16).padStart(e * 2, "0");
}
function bc(t) {
  return parseInt(t, 16);
}
function Uu(t, e = 16) {
  const n = zo(t, e);
  return Rt(n);
}
function Jw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function tb(t, e) {
  return t & BigInt(1) << e;
}
function Tl(t) {
  return eb(BigInt(`0x${ht(t)}`), BigInt(t.byteLength * 8));
}
function eb(t, e) {
  return tb(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const nb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ht(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += nb[n];
  return e;
}
function Rt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Qw(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, i = t.slice(r, r + 2), s = Number.parseInt(i, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    e[n] = s;
  }
  return e;
}
function oi(t) {
  return new TextEncoder().encode(t);
}
function Ro(t) {
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
function sd(t) {
  if (t.some(ib))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function br(...t) {
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
function Ce(t) {
  return br(...t.map((e) => typeof e == "number" ? sd([e]) : e instanceof Array ? sd(e) : e));
}
function En(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const H0 = "https://api.mainnet.hiro.so", O0 = "https://api.testnet.hiro.so", D0 = "http://localhost:3999", ob = "https://hub.blockstack.org", ab = 33, Zc = 32;
function cb(t) {
  if (t.length < Zc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Zc * 2), r = t.slice(2 + Zc * 2);
  return {
    recoveryId: bc(e),
    r: n,
    s: r
  };
}
function Hu(t) {
  const e = typeof t == "string" ? Rt(t) : t;
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
function zs(t, e, n = 0) {
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
class F0 {
  constructor(e = _0.slice(), n = ((a) => (a = _u("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", i = "/manifest.json", s = void 0, o = zw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = i, this.coreNode = s, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Bl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function bb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function j0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function mb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Bl(t.outputLen), Bl(t.blockLen);
}
function xb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Sb(t, e) {
  j0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Bs = {
  number: Bl,
  bool: bb,
  bytes: j0,
  hash: mb,
  exists: xb,
  output: Sb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Qc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), ir = (t, e) => t << 32 - e | t >>> e, Eb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Eb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ab(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ou(t) {
  if (typeof t == "string" && (t = Ab(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let z0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ai(t) {
  const e = (r) => t().update(Ou(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let R0 = class extends z0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Bs.hash(e);
    const r = Ou(n);
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
    return Bs.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Bs.exists(this), Bs.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const mc = (t, e, n) => new R0(t, e).update(n).digest();
mc.create = (t, e) => new R0(t, e);
function vb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Du = class extends z0 {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Qc(this.buffer);
  }
  update(e) {
    Bs.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Ou(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Qc(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Bs.exists(this), Bs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    vb(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Qc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], s);
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
const kb = (t, e, n) => t & e ^ ~t & n, $b = (t, e, n) => t & e ^ t & n ^ e & n, Ib = new Uint32Array([
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
]), Kr = new Uint32Array(64);
let G0 = class extends Du {
  constructor() {
    super(64, 32, 8, !1), this.A = Gr[0] | 0, this.B = Gr[1] | 0, this.C = Gr[2] | 0, this.D = Gr[3] | 0, this.E = Gr[4] | 0, this.F = Gr[5] | 0, this.G = Gr[6] | 0, this.H = Gr[7] | 0;
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
      Kr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Kr[l - 15], p = Kr[l - 2], x = ir(y, 7) ^ ir(y, 18) ^ y >>> 3, S = ir(p, 17) ^ ir(p, 19) ^ p >>> 10;
      Kr[l] = S + Kr[l - 7] + x + Kr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const y = ir(a, 6) ^ ir(a, 11) ^ ir(a, 25), p = f + y + kb(a, c, u) + Ib[l] + Kr[l] | 0, S = (ir(r, 2) ^ ir(r, 13) ^ ir(r, 22)) + $b(r, i, s) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, i, s, o, a, c, u, f);
  }
  roundClean() {
    Kr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Lb = class extends G0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Fi = ai(() => new G0());
ai(() => new Lb());
const Cb = {}, K0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Cb
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Ft = BigInt(0), ye = BigInt(1), ys = BigInt(2), vo = BigInt(3), id = BigInt(8), Jt = Object.freeze({
  a: Ft,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: ye,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), od = (t, e) => (t + e / ys) / e, ta = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = Jt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -ye * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), i = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), s = n, o = BigInt("0x100000000000000000000000000000000"), a = od(s * t, e), c = od(-r * t, e);
    let u = nt(t - a * n - c * i, e), f = nt(-a * r - c * s, e);
    const l = u > o, y = f > o;
    if (l && (u = e - u), y && (f = e - f), u > o || f > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: y, k2: f };
  }
}, tr = 32, Rs = 32, V0 = 32, ja = tr + 1, za = 2 * tr + 1;
function ad(t) {
  const { a: e, b: n } = Jt, r = nt(t * t), i = nt(r * t);
  return nt(i + e * t + n);
}
const ea = Jt.a === Ft;
class Fu extends Error {
  constructor(e) {
    super(e);
  }
}
function cd(t) {
  if (!(t instanceof Vt))
    throw new TypeError("JacobianPoint expected");
}
class Vt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Pt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Pt.ZERO) ? Vt.ZERO : new Vt(e.x, e.y, ye);
  }
  static toAffineBatch(e) {
    const n = Pb(e.map((r) => r.z));
    return e.map((r, i) => r.toAffine(n[i]));
  }
  static normalizeZ(e) {
    return Vt.toAffineBatch(e).map(Vt.fromAffine);
  }
  equals(e) {
    cd(e);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = e, c = nt(i * i), u = nt(a * a), f = nt(n * u), l = nt(s * c), y = nt(nt(r * a) * u), p = nt(nt(o * i) * c);
    return f === l && y === p;
  }
  negate() {
    return new Vt(this.x, nt(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, i = nt(e * e), s = nt(n * n), o = nt(s * s), a = e + s, c = nt(ys * (nt(a * a) - i - o)), u = nt(vo * i), f = nt(u * u), l = nt(f - ys * c), y = nt(u * (c - l) - id * o), p = nt(ys * n * r);
    return new Vt(l, y, p);
  }
  add(e) {
    cd(e);
    const { x: n, y: r, z: i } = this, { x: s, y: o, z: a } = e;
    if (s === Ft || o === Ft)
      return this;
    if (n === Ft || r === Ft)
      return e;
    const c = nt(i * i), u = nt(a * a), f = nt(n * u), l = nt(s * c), y = nt(nt(r * a) * u), p = nt(nt(o * i) * c), x = nt(l - f), S = nt(p - y);
    if (x === Ft)
      return S === Ft ? this.double() : Vt.ZERO;
    const B = nt(x * x), z = nt(x * B), R = nt(f * B), A = nt(S * S - z - ys * R), _ = nt(S * (R - A) - y * z), N = nt(i * a * x);
    return new Vt(A, _, N);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Vt.ZERO;
    if (typeof e == "bigint" && e === Ft)
      return n;
    let r = fd(e);
    if (r === ye)
      return this;
    if (!ea) {
      let l = n, y = this;
      for (; r > Ft; )
        r & ye && (l = l.add(y)), y = y.double(), r >>= ye;
      return l;
    }
    let { k1neg: i, k1: s, k2neg: o, k2: a } = ta.splitScalar(r), c = n, u = n, f = this;
    for (; s > Ft || a > Ft; )
      s & ye && (c = c.add(f)), a & ye && (u = u.add(f)), f = f.double(), s >>= ye, a >>= ye;
    return i && (c = c.negate()), o && (u = u.negate()), u = new Vt(nt(u.x * ta.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = ea ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(Vt.BASE) && (n = Pt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let i = n && Ml.get(n);
    i || (i = this.precomputeWindow(r), n && r !== 1 && (i = Vt.normalizeZ(i), Ml.set(n, i)));
    let s = Vt.ZERO, o = Vt.BASE;
    const a = 1 + (ea ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), f = 2 ** r, l = BigInt(r);
    for (let y = 0; y < a; y++) {
      const p = y * c;
      let x = Number(e & u);
      e >>= l, x > c && (x -= f, e += ye);
      const S = p, B = p + Math.abs(x) - 1, z = y % 2 !== 0, R = x < 0;
      x === 0 ? o = o.add(na(z, i[S])) : s = s.add(na(R, i[B]));
    }
    return { p: s, f: o };
  }
  multiply(e, n) {
    let r = fd(e), i, s;
    if (ea) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = ta.splitScalar(r);
      let { p: f, f: l } = this.wNAF(a, n), { p: y, f: p } = this.wNAF(u, n);
      f = na(o, f), y = na(c, y), y = new Vt(nt(y.x * ta.beta), y.y, y.z), i = f.add(y), s = l.add(p);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      i = o, s = a;
    }
    return Vt.normalizeZ([i, s])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: i } = this, s = this.equals(Vt.ZERO);
    e == null && (e = s ? id : ro(i));
    const o = e, a = nt(o * o), c = nt(a * o), u = nt(n * a), f = nt(r * c), l = nt(i * o);
    if (s)
      return Pt.ZERO;
    if (l !== ye)
      throw new Error("invZ was invalid");
    return new Pt(u, f);
  }
}
Vt.BASE = new Vt(Jt.Gx, Jt.Gy, ye);
Vt.ZERO = new Vt(Ft, ye, Ft);
function na(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Ml = /* @__PURE__ */ new WeakMap();
class Pt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Ml.delete(this);
  }
  hasEvenY() {
    return this.y % ys === Ft;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Pn(n ? e : e.subarray(1));
    if (!Ba(r))
      throw new Error("Point is not on curve");
    const i = ad(r);
    let s = Nb(i);
    const o = (s & ye) === ye;
    n ? o && (s = nt(-s)) : (e[0] & 1) === 1 !== o && (s = nt(-s));
    const a = new Pt(r, s);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Pn(e.subarray(1, tr + 1)), r = Pn(e.subarray(tr + 1, tr * 2 + 1)), i = new Pt(n, r);
    return i.assertValidity(), i;
  }
  static fromHex(e) {
    const n = mr(e), r = n.length, i = n[0];
    if (r === tr)
      return this.fromCompressedHex(n);
    if (r === ja && (i === 2 || i === 3))
      return this.fromCompressedHex(n);
    if (r === za && i === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${ja} compressed bytes or ${za} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Pt.BASE.multiply(Gs(e));
  }
  static fromSignature(e, n, r) {
    const { r: i, s } = X0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = ju(mr(e)), { n: a } = Jt, c = r === 2 || r === 3 ? i + a : i, u = ro(c, a), f = nt(-o * u, a), l = nt(s * u, a), y = r & 1 ? "03" : "02", p = Pt.fromHex(y + ws(c)), x = Pt.BASE.multiplyAndAddUnsafe(p, f, l);
    if (!x)
      throw new Error("Cannot recover signature: point at infinify");
    return x.assertValidity(), x;
  }
  toRawBytes(e = !1) {
    return bs(this.toHex(e));
  }
  toHex(e = !1) {
    const n = ws(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${ws(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Ba(n) || !Ba(r))
      throw new Error(e);
    const i = nt(r * r), s = ad(n);
    if (nt(i - s) !== Ft)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Pt(this.x, nt(-this.y));
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
    const i = Vt.fromAffine(this), s = n === Ft || n === ye || this !== Pt.BASE ? i.multiplyUnsafe(n) : i.multiply(n), o = Vt.fromAffine(e).multiplyUnsafe(r), a = s.add(o);
    return a.equals(Vt.ZERO) ? void 0 : a.toAffine();
  }
}
Pt.BASE = new Pt(Jt.Gx, Jt.Gy);
Pt.ZERO = new Pt(Ft, Ft);
function ld(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function ud(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${ji(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Pn(n), left: t.subarray(e + 2) };
}
function Tb(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${ji(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = ud(t.subarray(2)), { data: r, left: i } = ud(n);
  if (i.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${ji(i)}`);
  return { r: e, s: r };
}
class Nn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const i = n ? ji(e) : e;
    if (i.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Nn(Ra(i.slice(0, 64)), Ra(i.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s: i } = Tb(n ? e : bs(e));
    return new Nn(r, i);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Ri(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Ri(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = Jt.n >> ye;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Nn(this.r, nt(-this.s, Jt.n)) : this;
  }
  toDERRawBytes() {
    return bs(this.toDERHex());
  }
  toDERHex() {
    const e = ld(go(this.s)), n = ld(go(this.r)), r = e.length / 2, i = n.length / 2, s = go(r), o = go(i);
    return `30${go(i + r + 4)}02${o}${n}02${s}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return bs(this.toCompactHex());
  }
  toCompactHex() {
    return ws(this.r) + ws(this.s);
  }
}
function ps(...t) {
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
const Bb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ji(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Bb[t[n]];
  return e;
}
const Mb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function ws(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Ft <= t && t < Mb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function zi(t) {
  const e = bs(ws(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function go(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Ra(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function bs(t) {
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
function Pn(t) {
  return Ra(ji(t));
}
function mr(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : bs(t);
}
function fd(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Ri(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function nt(t, e = Jt.P) {
  const n = t % e;
  return n >= Ft ? n : e + n;
}
function Dn(t, e) {
  const { P: n } = Jt;
  let r = t;
  for (; e-- > Ft; )
    r *= r, r %= n;
  return r;
}
function Nb(t) {
  const { P: e } = Jt, n = BigInt(6), r = BigInt(11), i = BigInt(22), s = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, f = Dn(u, vo) * u % e, l = Dn(f, vo) * u % e, y = Dn(l, ys) * c % e, p = Dn(y, r) * y % e, x = Dn(p, i) * p % e, S = Dn(x, o) * x % e, B = Dn(S, a) * S % e, z = Dn(B, o) * x % e, R = Dn(z, vo) * u % e, A = Dn(R, s) * p % e, _ = Dn(A, n) * c % e, N = Dn(_, ys);
  if (N * N % e !== t)
    throw new Error("Cannot find square root");
  return N;
}
function ro(t, e = Jt.P) {
  if (t === Ft || e <= Ft)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = nt(t, e), r = e, i = Ft, s = ye;
  for (; n !== Ft; ) {
    const a = r / n, c = r % n, u = i - s * a;
    r = n, n = c, i = s, s = u;
  }
  if (r !== ye)
    throw new Error("invert: does not exist");
  return nt(i, e);
}
function Pb(t, e = Jt.P) {
  const n = new Array(t.length), r = t.reduce((s, o, a) => o === Ft ? s : (n[a] = s, nt(s * o, e)), ye), i = ro(r, e);
  return t.reduceRight((s, o, a) => o === Ft ? s : (n[a] = nt(s * n[a], e), nt(s * o, e)), i), n;
}
function _b(t) {
  const e = t.length * 8 - Rs * 8, n = Pn(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function ju(t, e = !1) {
  const n = _b(t);
  if (e)
    return n;
  const { n: r } = Jt;
  return n >= r ? n - r : n;
}
let _i, ko;
class q0 {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return $e.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return ko(this.k, ...e);
  }
  checkSync() {
    if (typeof ko != "function")
      throw new Fu("hmacSha256Sync needs to be set");
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
    return ps(...n);
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
    return ps(...n);
  }
}
function Ri(t) {
  return Ft < t && t < Jt.n;
}
function Ba(t) {
  return Ft < t && t < Jt.P;
}
function W0(t, e, n, r = !0) {
  const { n: i } = Jt, s = ju(t, !0);
  if (!Ri(s))
    return;
  const o = ro(s, i), a = Pt.BASE.multiply(s), c = nt(a.x, i);
  if (c === Ft)
    return;
  const u = nt(o * nt(e + n * c, i), i);
  if (u === Ft)
    return;
  let f = new Nn(c, u), l = (a.x === f.r ? 0 : 2) | Number(a.y & ye);
  return r && f.hasHighS() && (f = f.normalizeS(), l ^= 1), { sig: f, recovery: l };
}
function Gs(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Rs)
      throw new Error("Expected 32 bytes of private key");
    e = Ra(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Rs)
      throw new Error("Expected 32 bytes of private key");
    e = Pn(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Ri(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function zu(t) {
  return t instanceof Pt ? (t.assertValidity(), t) : Pt.fromHex(t);
}
function X0(t) {
  if (t instanceof Nn)
    return t.assertValidity(), t;
  try {
    return Nn.fromDER(t);
  } catch {
    return Nn.fromCompact(t);
  }
}
function Go(t, e = !1) {
  return Pt.fromPrivateKey(t).toRawBytes(e);
}
function Ub(t, e, n, r = !1) {
  return Pt.fromSignature(t, e, n).toRawBytes(r);
}
function dd(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === ja || r === za : n ? r === ja * 2 || r === za * 2 : t instanceof Pt;
}
function Ru(t, e, n = !1) {
  if (dd(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!dd(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = zu(e);
  return r.assertValidity(), r.multiply(Gs(t)).toRawBytes(n);
}
function Y0(t) {
  const e = t.length > tr ? t.slice(0, tr) : t;
  return Pn(e);
}
function Hb(t) {
  const e = Y0(t), n = nt(e, Jt.n);
  return Z0(n < Ft ? e : n);
}
function Z0(t) {
  return zi(t);
}
function Q0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = mr(t), i = Gs(e), s = [Z0(i), Hb(r)];
  if (n != null) {
    n === !0 && (n = $e.randomBytes(tr));
    const c = mr(n);
    if (c.length !== tr)
      throw new Error(`sign: Expected ${tr} bytes of extra data`);
    s.push(c);
  }
  const o = ps(...s), a = Y0(r);
  return { seed: o, m: a, d: i };
}
function J0(t, e) {
  const { sig: n, recovery: r } = t, { der: i, recovered: s } = Object.assign({ canonical: !0, der: !0 }, e), o = i ? n.toDERRawBytes() : n.toCompactRawBytes();
  return s ? [o, r] : o;
}
async function Ob(t, e, n = {}) {
  const { seed: r, m: i, d: s } = Q0(t, e, n.extraEntropy), o = new q0(V0, Rs);
  await o.reseed(r);
  let a;
  for (; !(a = W0(await o.generate(), i, s, n.canonical)); )
    await o.reseed();
  return J0(a, n);
}
function xc(t, e, n = {}) {
  const { seed: r, m: i, d: s } = Q0(t, e, n.extraEntropy), o = new q0(V0, Rs);
  o.reseedSync(r);
  let a;
  for (; !(a = W0(o.generateSync(), i, s, n.canonical)); )
    o.reseedSync();
  return J0(a, n);
}
const Db = { strict: !0 };
function Fb(t, e, n, r = Db) {
  let i;
  try {
    i = X0(t), e = mr(e);
  } catch {
    return !1;
  }
  const { r: s, s: o } = i;
  if (r.strict && i.hasHighS())
    return !1;
  const a = ju(e);
  let c;
  try {
    c = zu(n);
  } catch {
    return !1;
  }
  const { n: u } = Jt, f = ro(o, u), l = nt(a * f, u), y = nt(s * f, u), p = Pt.BASE.multiplyAndAddUnsafe(c, l, y);
  return p ? nt(p.x, u) === s : !1;
}
function Ga(t) {
  return nt(Pn(t), Jt.n);
}
class Gi {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = mr(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Pn(n.subarray(0, 32)), i = Pn(n.subarray(32, 64));
    return new Gi(r, i);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Ba(e) || !Ri(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return ws(this.r) + ws(this.s);
  }
  toRawBytes() {
    return bs(this.toHex());
  }
}
function jb(t) {
  return Pt.fromPrivateKey(t).toRawX();
}
class tp {
  constructor(e, n, r = $e.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = mr(e);
    const { x: i, scalar: s } = this.getScalar(Gs(n));
    if (this.px = i, this.d = s, this.rand = mr(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Pt.fromPrivateKey(e), r = n.hasEvenY() ? e : Jt.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return zi(e ^ Pn(n));
  }
  finalizeNonce(e) {
    const n = nt(Pn(e), Jt.n);
    if (n === Ft)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: i, scalar: s } = this.getScalar(n);
    return { R: r, rx: i, k: s };
  }
  finalizeSig(e, n, r, i) {
    return new Gi(e.x, nt(n + r * i, Jt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: i } = this, s = $e.taggedHash, o = this.initNonce(n, await s(hs.aux, i)), { R: a, rx: c, k: u } = this.finalizeNonce(await s(hs.nonce, o, r, e)), f = Ga(await s(hs.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return await rp(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: i } = this, s = $e.taggedHashSync, o = this.initNonce(n, s(hs.aux, i)), { R: a, rx: c, k: u } = this.finalizeNonce(s(hs.nonce, o, r, e)), f = Ga(s(hs.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return sp(l, e, r) || this.error(), l;
  }
}
async function zb(t, e, n) {
  return new tp(t, e, n).calc();
}
function Rb(t, e, n) {
  return new tp(t, e, n).calcSync();
}
function ep(t, e, n) {
  const r = t instanceof Gi, i = r ? t : Gi.fromHex(t);
  return r && i.assertValidity(), {
    ...i,
    m: mr(e),
    P: zu(n)
  };
}
function np(t, e, n, r) {
  const i = Pt.BASE.multiplyAndAddUnsafe(e, Gs(n), nt(-r, Jt.n));
  return !(!i || !i.hasEvenY() || i.x !== t);
}
async function rp(t, e, n) {
  try {
    const { r, s: i, m: s, P: o } = ep(t, e, n), a = Ga(await $e.taggedHash(hs.challenge, zi(r), o.toRawX(), s));
    return np(r, o, i, a);
  } catch {
    return !1;
  }
}
function sp(t, e, n) {
  try {
    const { r, s: i, m: s, P: o } = ep(t, e, n), a = Ga($e.taggedHashSync(hs.challenge, zi(r), o.toRawX(), s));
    return np(r, o, i, a);
  } catch (r) {
    if (r instanceof Fu)
      throw r;
    return !1;
  }
}
const Gb = {
  Signature: Gi,
  getPublicKey: jb,
  sign: zb,
  verify: rp,
  signSync: Rb,
  verifySync: sp
};
Pt.BASE._setWindowSize(8);
const In = {
  node: K0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, hs = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, ra = {}, $e = {
  bytesToHex: ji,
  hexToBytes: bs,
  concatBytes: ps,
  mod: nt,
  invert: ro,
  isValidPrivateKey(t) {
    try {
      return Gs(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: zi,
  _normalizePrivateKey: Gs,
  hashToPrivateKey: (t) => {
    t = mr(t);
    const e = Rs + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = nt(Pn(t), Jt.n - ye) + ye;
    return zi(n);
  },
  randomBytes: (t = 32) => {
    if (In.web)
      return In.web.getRandomValues(new Uint8Array(t));
    if (In.node) {
      const { randomBytes: e } = In.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => $e.hashToPrivateKey($e.randomBytes(Rs + 8)),
  precompute(t = 8, e = Pt.BASE) {
    const n = e === Pt.BASE ? e : new Pt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(vo), n;
  },
  sha256: async (...t) => {
    if (In.web) {
      const e = await In.web.subtle.digest("SHA-256", ps(...t));
      return new Uint8Array(e);
    } else if (In.node) {
      const { createHash: e } = In.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (In.web) {
      const n = await In.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = ps(...e), i = await In.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(i);
    } else if (In.node) {
      const { createHmac: n } = In.node, r = n("sha256", t);
      return e.forEach((i) => r.update(i)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = ra[t];
    if (n === void 0) {
      const r = await $e.sha256(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      n = ps(r, r), ra[t] = n;
    }
    return $e.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof _i != "function")
      throw new Fu("sha256Sync is undefined, you need to set it");
    let n = ra[t];
    if (n === void 0) {
      const r = _i(Uint8Array.from(t, (i) => i.charCodeAt(0)));
      n = ps(r, r), ra[t] = n;
    }
    return _i(n, ...e);
  },
  _JacobianPoint: Vt
};
Object.defineProperties($e, {
  sha256Sync: {
    configurable: !1,
    get() {
      return _i;
    },
    set(t) {
      _i || (_i = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return ko;
    },
    set(t) {
      ko || (ko = t);
    }
  }
});
const Kb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Jt,
  Point: Pt,
  Signature: Nn,
  getPublicKey: Go,
  getSharedSecret: Ru,
  recoverPublicKey: Ub,
  schnorr: Gb,
  sign: Ob,
  signSync: xc,
  utils: $e,
  verify: Fb
}, Symbol.toStringTag, { value: "Module" }));
var Ko = {};
Ko.byteLength = Yb;
var Vb = Ko.toByteArray = Qb, qb = Ko.fromByteArray = em, fr = [], zn = [], Wb = typeof Uint8Array < "u" ? Uint8Array : Array, Jc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Ai = 0, Xb = Jc.length; Ai < Xb; ++Ai)
  fr[Ai] = Jc[Ai], zn[Jc.charCodeAt(Ai)] = Ai;
zn[45] = 62;
zn[95] = 63;
function ip(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Yb(t) {
  var e = ip(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Zb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Qb(t) {
  var e, n = ip(t), r = n[0], i = n[1], s = new Wb(Zb(t, r, i)), o = 0, a = i > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = zn[t.charCodeAt(c)] << 18 | zn[t.charCodeAt(c + 1)] << 12 | zn[t.charCodeAt(c + 2)] << 6 | zn[t.charCodeAt(c + 3)], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
  return i === 2 && (e = zn[t.charCodeAt(c)] << 2 | zn[t.charCodeAt(c + 1)] >> 4, s[o++] = e & 255), i === 1 && (e = zn[t.charCodeAt(c)] << 10 | zn[t.charCodeAt(c + 1)] << 4 | zn[t.charCodeAt(c + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
}
function Jb(t) {
  return fr[t >> 18 & 63] + fr[t >> 12 & 63] + fr[t >> 6 & 63] + fr[t & 63];
}
function tm(t, e, n) {
  for (var r, i = [], s = e; s < n; s += 3)
    r = (t[s] << 16 & 16711680) + (t[s + 1] << 8 & 65280) + (t[s + 2] & 255), i.push(Jb(r));
  return i.join("");
}
function em(t) {
  for (var e, n = t.length, r = n % 3, i = [], s = 16383, o = 0, a = n - r; o < a; o += s)
    i.push(tm(t, o, o + s > a ? a : o + s));
  return r === 1 ? (e = t[n - 1], i.push(
    fr[e >> 2] + fr[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], i.push(
    fr[e >> 10] + fr[e >> 4 & 63] + fr[e << 2 & 63] + "="
  )), i.join("");
}
function nm() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const rm = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function sm() {
  if (nm())
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
    throw new Error(rm);
  }
}
class im {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, i) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createCipher(e, n, r), o = new Uint8Array(br(s.update(i), s.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, i) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const s = this.createDecipher(e, n, r), o = new Uint8Array(br(s.update(i), s.final()));
    return Promise.resolve(o);
  }
}
class om {
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
async function op() {
  const t = await sm();
  return t.name === "subtleCrypto" ? new om(t.lib) : new im(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function am(t) {
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
  function f(p) {
    if (p instanceof Uint8Array || (ArrayBuffer.isView(p) ? p = new Uint8Array(p.buffer, p.byteOffset, p.byteLength) : Array.isArray(p) && (p = Uint8Array.from(p))), !(p instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (p.length === 0)
      return "";
    for (var x = 0, S = 0, B = 0, z = p.length; B !== z && p[B] === 0; )
      B++, x++;
    for (var R = (z - B) * u + 1 >>> 0, A = new Uint8Array(R); B !== z; ) {
      for (var _ = p[B], N = 0, Q = R - 1; (_ !== 0 || N < S) && Q !== -1; Q--, N++)
        _ += 256 * A[Q] >>> 0, A[Q] = _ % o >>> 0, _ = _ / o >>> 0;
      if (_ !== 0)
        throw new Error("Non-zero carry");
      S = N, B++;
    }
    for (var tt = R - S; tt !== R && A[tt] === 0; )
      tt++;
    for (var G = a.repeat(x); tt < R; ++tt)
      G += t.charAt(A[tt]);
    return G;
  }
  function l(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var x = 0, S = 0, B = 0; p[x] === a; )
      S++, x++;
    for (var z = (p.length - x) * c + 1 >>> 0, R = new Uint8Array(z); p[x]; ) {
      var A = p.charCodeAt(x);
      if (A > 255)
        return;
      var _ = e[A];
      if (_ === 255)
        return;
      for (var N = 0, Q = z - 1; (_ !== 0 || N < B) && Q !== -1; Q--, N++)
        _ += o * R[Q] >>> 0, R[Q] = _ % 256 >>> 0, _ = _ / 256 >>> 0;
      if (_ !== 0)
        throw new Error("Non-zero carry");
      B = N, x++;
    }
    for (var tt = z - B; tt !== z && R[tt] === 0; )
      tt++;
    for (var G = new Uint8Array(S + (z - tt)), V = S; tt !== z; )
      G[V++] = R[tt++];
    return G;
  }
  function y(p) {
    var x = l(p);
    if (x)
      return x;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: f,
    decodeUnsafe: l,
    decode: y
  };
}
var ap = am;
const cm = ap, lm = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var um = cm(lm);
const fm = /* @__PURE__ */ B0(um), dm = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), cp = Uint8Array.from({ length: 16 }, (t, e) => e), hm = cp.map((t) => (9 * t + 5) % 16);
let Gu = [cp], Ku = [hm];
for (let t = 0; t < 4; t++)
  for (let e of [Gu, Ku])
    e.push(e[t].map((n) => dm[n]));
const lp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), pm = Gu.map((t, e) => t.map((n) => lp[e][n])), gm = Ku.map((t, e) => t.map((n) => lp[e][n])), ym = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), wm = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), sa = (t, e) => t << e | t >>> 32 - e;
function hd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ia = new Uint32Array(16);
let bm = class extends Du {
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
      ia[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, S = ym[p], B = wm[p], z = Gu[p], R = Ku[p], A = pm[p], _ = gm[p];
      for (let N = 0; N < 16; N++) {
        const Q = sa(r + hd(p, s, a, u) + ia[z[N]] + S, A[N]) + l | 0;
        r = l, l = u, u = sa(a, 10) | 0, a = s, s = Q;
      }
      for (let N = 0; N < 16; N++) {
        const Q = sa(i + hd(x, o, c, f) + ia[R[N]] + B, _[N]) + y | 0;
        i = y, y = f, f = sa(c, 10) | 0, c = o, o = Q;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    ia.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const mm = ai(() => new bm());
function xm(t) {
  return mm(t);
}
const oa = BigInt(2 ** 32 - 1), Nl = BigInt(32);
function up(t, e = !1) {
  return e ? { h: Number(t & oa), l: Number(t >> Nl & oa) } : { h: Number(t >> Nl & oa) | 0, l: Number(t & oa) | 0 };
}
function Sm(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = up(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const Em = (t, e) => BigInt(t >>> 0) << Nl | BigInt(e >>> 0), Am = (t, e, n) => t >>> n, vm = (t, e, n) => t << 32 - n | e >>> n, km = (t, e, n) => t >>> n | e << 32 - n, $m = (t, e, n) => t << 32 - n | e >>> n, Im = (t, e, n) => t << 64 - n | e >>> n - 32, Lm = (t, e, n) => t >>> n - 32 | e << 64 - n, Cm = (t, e) => e, Tm = (t, e) => t, Bm = (t, e, n) => t << n | e >>> 32 - n, Mm = (t, e, n) => e << n | t >>> 32 - n, Nm = (t, e, n) => e << n - 32 | t >>> 64 - n, Pm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function _m(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const Um = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Hm = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Om = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Dm = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, Fm = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), jm = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, It = {
  fromBig: up,
  split: Sm,
  toBig: Em,
  shrSH: Am,
  shrSL: vm,
  rotrSH: km,
  rotrSL: $m,
  rotrBH: Im,
  rotrBL: Lm,
  rotr32H: Cm,
  rotr32L: Tm,
  rotlSH: Bm,
  rotlSL: Mm,
  rotlBH: Nm,
  rotlBL: Pm,
  add: _m,
  add3L: Um,
  add3H: Hm,
  add4L: Om,
  add4H: Dm,
  add5H: jm,
  add5L: Fm
}, [zm, Rm] = It.split([
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
].map((t) => BigInt(t))), Vr = new Uint32Array(80), qr = new Uint32Array(80);
let Sc = class extends Du {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: y, Gh: p, Gl: x, Hh: S, Hl: B } = this;
    return [e, n, r, i, s, o, a, c, u, f, l, y, p, x, S, B];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, f, l, y, p, x, S, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Vr[A] = e.getUint32(n), qr[A] = e.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const _ = Vr[A - 15] | 0, N = qr[A - 15] | 0, Q = It.rotrSH(_, N, 1) ^ It.rotrSH(_, N, 8) ^ It.shrSH(_, N, 7), tt = It.rotrSL(_, N, 1) ^ It.rotrSL(_, N, 8) ^ It.shrSL(_, N, 7), G = Vr[A - 2] | 0, V = qr[A - 2] | 0, I = It.rotrSH(G, V, 19) ^ It.rotrBH(G, V, 61) ^ It.shrSH(G, V, 6), P = It.rotrSL(G, V, 19) ^ It.rotrBL(G, V, 61) ^ It.shrSL(G, V, 6), b = It.add4L(tt, P, qr[A - 7], qr[A - 16]), T = It.add4H(b, Q, I, Vr[A - 7], Vr[A - 16]);
      Vr[A] = T | 0, qr[A] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: y, Fh: p, Fl: x, Gh: S, Gl: B, Hh: z, Hl: R } = this;
    for (let A = 0; A < 80; A++) {
      const _ = It.rotrSH(l, y, 14) ^ It.rotrSH(l, y, 18) ^ It.rotrBH(l, y, 41), N = It.rotrSL(l, y, 14) ^ It.rotrSL(l, y, 18) ^ It.rotrBL(l, y, 41), Q = l & p ^ ~l & S, tt = y & x ^ ~y & B, G = It.add5L(R, N, tt, Rm[A], qr[A]), V = It.add5H(G, z, _, Q, zm[A], Vr[A]), I = G | 0, P = It.rotrSH(r, i, 28) ^ It.rotrBH(r, i, 34) ^ It.rotrBH(r, i, 39), b = It.rotrSL(r, i, 28) ^ It.rotrBL(r, i, 34) ^ It.rotrBL(r, i, 39), T = r & s ^ r & a ^ s & a, D = i & o ^ i & c ^ o & c;
      z = S | 0, R = B | 0, S = p | 0, B = x | 0, p = l | 0, x = y | 0, { h: l, l: y } = It.add(u | 0, f | 0, V | 0, I | 0), u = a | 0, f = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const C = It.add3L(I, b, D);
      r = It.add3H(C, V, P, T), i = C | 0;
    }
    ({ h: r, l: i } = It.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = It.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = It.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = It.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: y } = It.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: x } = It.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: B } = It.add(this.Gh | 0, this.Gl | 0, S | 0, B | 0), { h: z, l: R } = It.add(this.Hh | 0, this.Hl | 0, z | 0, R | 0), this.set(r, i, s, o, a, c, u, f, l, y, p, x, S, B, z, R);
  }
  roundClean() {
    Vr.fill(0), qr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Gm = class extends Sc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Km = class extends Sc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Vm = class extends Sc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const qm = ai(() => new Sc());
ai(() => new Gm());
ai(() => new Km());
ai(() => new Vm());
function fp(t) {
  return Fi(t);
}
function Wm(t) {
  return qm(t);
}
const Xm = 0;
$e.hmacSha256Sync = (t, ...e) => {
  const n = mc.create(Fi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Ym() {
  return ht($e.randomPrivateKey());
}
function Zm(t) {
  const e = Fi(Fi(t));
  return fm.encode(br(t, e).slice(0, t.length + 4));
}
function Qm(t, e) {
  return Zm(br(new Uint8Array([t]), e.slice(0, 20)));
}
function dp(t, e = Xm) {
  const n = typeof t == "string" ? Rt(t) : t, r = xm(fp(n));
  return Qm(e, r);
}
function hp(t) {
  const e = Hu(t);
  return ht(Go(e.slice(0, 32), !0));
}
$e.hmacSha256Sync = (t, ...e) => {
  const n = mc.create(Fi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Ka;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Ka || (Ka = {}));
async function Jm(t, e, n) {
  return await (await op()).encrypt("aes-256-cbc", e, t, n);
}
async function t1(t, e, n) {
  return await (await op()).decrypt("aes-256-cbc", e, t, n);
}
function pp(t, e) {
  return mc(Fi, t, e);
}
function e1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function gp(t) {
  const e = Wm(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function n1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function r1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Ka.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Ka.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !n1(t))
    return e;
  try {
    return Pt.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function s1(t, e, n, r) {
  const i = r1(t);
  if (!i.result)
    throw i;
  const s = $e.randomPrivateKey(), o = Go(s, !0);
  let a = Ru(s, t, !0);
  a = a.slice(1);
  const c = gp(a), u = $e.randomBytes(16), f = await Jm(u, c.encryptionKey, e), l = br(u, o, f), y = pp(c.hmacKey, l);
  let p;
  if (!r || r === "hex")
    p = ht(f);
  else if (r === "base64")
    p = qb(f);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const x = {
    iv: ht(u),
    ephemeralPK: ht(o),
    cipherText: p,
    mac: ht(y),
    wasString: n
  };
  return r && r !== "hex" && (x.cipherTextEncoding = r), x;
}
async function yp(t, e) {
  if (!e.ephemeralPK)
    throw new ed("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Ru(t, n, !0);
  r = r.slice(1);
  const i = gp(r), s = Rt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Rt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Vb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = br(s, Rt(n), o), c = pp(i.hmacKey, a), u = Rt(e.mac);
  if (!e1(u, c))
    throw new ed("Decryption failed: failure in MAC check");
  const f = await t1(s, i.encryptionKey, o);
  return e.wasString ? Ro(f) : f;
}
function i1(t, e) {
  const n = typeof e == "string" ? oi(e) : e, r = hp(t), i = fp(n), s = xc(i, t);
  return {
    signature: ht(s),
    publicKey: r
  };
}
async function o1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = hp(n.privateKey);
  }
  const i = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", s = typeof t == "string" ? oi(t) : t, o = await s1(n.publicKey, s, i, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = i1(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function a1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return yp(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Ye = {}, Ki = {}, cn = {};
Object.defineProperty(cn, "__esModule", { value: !0 });
cn.decode = cn.encode = cn.unescape = cn.escape = cn.pad = void 0;
const wp = Ko;
function Vu(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
cn.pad = Vu;
function bp(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
cn.escape = bp;
function mp(t) {
  return Vu(t).replace(/-/g, "+").replace(/_/g, "/");
}
cn.unescape = mp;
function c1(t) {
  return bp((0, wp.fromByteArray)(new TextEncoder().encode(t)));
}
cn.encode = c1;
function l1(t) {
  return new TextDecoder().decode((0, wp.toByteArray)(Vu(mp(t))));
}
cn.decode = l1;
var Ec = {}, Ac = {}, xp = {}, Sp = {}, vc = {};
Object.defineProperty(vc, "__esModule", { value: !0 });
vc.crypto = void 0;
vc.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = i, t.ahash = s, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = f, t.createView = l, t.rotr = y, t.rotl = p, t.byteSwap = x, t.byteSwap32 = S, t.bytesToHex = R, t.hexToBytes = N, t.asyncLoop = tt, t.utf8ToBytes = G, t.bytesToUtf8 = V, t.toBytes = I, t.kdfInputToBytes = P, t.concatBytes = b, t.checkOpts = T, t.createHasher = C, t.createOptHasher = ot, t.createXOFer = X, t.randomBytes = St;
  const e = vc;
  function n(k) {
    return k instanceof Uint8Array || ArrayBuffer.isView(k) && k.constructor.name === "Uint8Array";
  }
  function r(k) {
    if (!Number.isSafeInteger(k) || k < 0)
      throw new Error("positive integer expected, got " + k);
  }
  function i(k, ...m) {
    if (!n(k))
      throw new Error("Uint8Array expected");
    if (m.length > 0 && !m.includes(k.length))
      throw new Error("Uint8Array expected of length " + m + ", got length=" + k.length);
  }
  function s(k) {
    if (typeof k != "function" || typeof k.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(k.outputLen), r(k.blockLen);
  }
  function o(k, m = !0) {
    if (k.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (m && k.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(k, m) {
    i(k);
    const q = m.outputLen;
    if (k.length < q)
      throw new Error("digestInto() expects output buffer of length at least " + q);
  }
  function c(k) {
    return new Uint8Array(k.buffer, k.byteOffset, k.byteLength);
  }
  function u(k) {
    return new Uint32Array(k.buffer, k.byteOffset, Math.floor(k.byteLength / 4));
  }
  function f(...k) {
    for (let m = 0; m < k.length; m++)
      k[m].fill(0);
  }
  function l(k) {
    return new DataView(k.buffer, k.byteOffset, k.byteLength);
  }
  function y(k, m) {
    return k << 32 - m | k >>> m;
  }
  function p(k, m) {
    return k << m | k >>> 32 - m >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function x(k) {
    return k << 24 & 4278190080 | k << 8 & 16711680 | k >>> 8 & 65280 | k >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (k) => k : (k) => x(k), t.byteSwapIfBE = t.swap8IfBE;
  function S(k) {
    for (let m = 0; m < k.length; m++)
      k[m] = x(k[m]);
    return k;
  }
  t.swap32IfBE = t.isLE ? (k) => k : S;
  const B = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", z = /* @__PURE__ */ Array.from({ length: 256 }, (k, m) => m.toString(16).padStart(2, "0"));
  function R(k) {
    if (i(k), B)
      return k.toHex();
    let m = "";
    for (let q = 0; q < k.length; q++)
      m += z[k[q]];
    return m;
  }
  const A = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function _(k) {
    if (k >= A._0 && k <= A._9)
      return k - A._0;
    if (k >= A.A && k <= A.F)
      return k - (A.A - 10);
    if (k >= A.a && k <= A.f)
      return k - (A.a - 10);
  }
  function N(k) {
    if (typeof k != "string")
      throw new Error("hex string expected, got " + typeof k);
    if (B)
      return Uint8Array.fromHex(k);
    const m = k.length, q = m / 2;
    if (m % 2)
      throw new Error("hex string expected, got unpadded hex of length " + m);
    const rt = new Uint8Array(q);
    for (let at = 0, vt = 0; at < q; at++, vt += 2) {
      const te = _(k.charCodeAt(vt)), $t = _(k.charCodeAt(vt + 1));
      if (te === void 0 || $t === void 0) {
        const Ht = k[vt] + k[vt + 1];
        throw new Error('hex string expected, got non-hex character "' + Ht + '" at index ' + vt);
      }
      rt[at] = te * 16 + $t;
    }
    return rt;
  }
  const Q = async () => {
  };
  t.nextTick = Q;
  async function tt(k, m, q) {
    let rt = Date.now();
    for (let at = 0; at < k; at++) {
      q(at);
      const vt = Date.now() - rt;
      vt >= 0 && vt < m || (await (0, t.nextTick)(), rt += vt);
    }
  }
  function G(k) {
    if (typeof k != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(k));
  }
  function V(k) {
    return new TextDecoder().decode(k);
  }
  function I(k) {
    return typeof k == "string" && (k = G(k)), i(k), k;
  }
  function P(k) {
    return typeof k == "string" && (k = G(k)), i(k), k;
  }
  function b(...k) {
    let m = 0;
    for (let rt = 0; rt < k.length; rt++) {
      const at = k[rt];
      i(at), m += at.length;
    }
    const q = new Uint8Array(m);
    for (let rt = 0, at = 0; rt < k.length; rt++) {
      const vt = k[rt];
      q.set(vt, at), at += vt.length;
    }
    return q;
  }
  function T(k, m) {
    if (m !== void 0 && {}.toString.call(m) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(k, m);
  }
  class D {
  }
  t.Hash = D;
  function C(k) {
    const m = (rt) => k().update(I(rt)).digest(), q = k();
    return m.outputLen = q.outputLen, m.blockLen = q.blockLen, m.create = () => k(), m;
  }
  function ot(k) {
    const m = (rt, at) => k(at).update(I(rt)).digest(), q = k({});
    return m.outputLen = q.outputLen, m.blockLen = q.blockLen, m.create = (rt) => k(rt), m;
  }
  function X(k) {
    const m = (rt, at) => k(at).update(I(rt)).digest(), q = k({});
    return m.outputLen = q.outputLen, m.blockLen = q.blockLen, m.create = (rt) => k(rt), m;
  }
  t.wrapConstructor = C, t.wrapConstructorWithOpts = ot, t.wrapXOFConstructorWithOpts = X;
  function St(k = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(k));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(k));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Sp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = Sp;
  class n extends e.Hash {
    constructor(s, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(s);
      const a = (0, e.toBytes)(o);
      if (this.iHash = s.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, u = new Uint8Array(c);
      u.set(a.length > c ? s.create().update(a).digest() : a);
      for (let f = 0; f < u.length; f++)
        u[f] ^= 54;
      this.iHash.update(u), this.oHash = s.create();
      for (let f = 0; f < u.length; f++)
        u[f] ^= 106;
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
      const { oHash: o, iHash: a, finished: c, destroyed: u, blockLen: f, outputLen: l } = this;
      return s = s, s.finished = c, s.destroyed = u, s.blockLen = f, s.outputLen = l, s.oHash = o._cloneInto(s.oHash), s.iHash = a._cloneInto(s.iHash), s;
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
})(xp);
const vi = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Ep(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Pl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function ci(t, ...e) {
  if (!Ep(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function u1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Pl(t.outputLen), Pl(t.blockLen);
}
function _l(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ap(t, e) {
  ci(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function f1(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function d1(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Va(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Ma(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Xn(t, e) {
  return t << 32 - e | t >>> e;
}
function h1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const qu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Wu(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const vp = qu ? (t) => t : (t) => Wu(t), p1 = vp;
function kp(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Wu(t[e]);
  return t;
}
const g1 = qu ? (t) => t : kp, $p = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", y1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ip(t) {
  if (ci(t), $p)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += y1[t[n]];
  return e;
}
const Cr = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function pd(t) {
  if (t >= Cr._0 && t <= Cr._9)
    return t - Cr._0;
  if (t >= Cr.A && t <= Cr.F)
    return t - (Cr.A - 10);
  if (t >= Cr.a && t <= Cr.f)
    return t - (Cr.a - 10);
}
function w1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if ($p)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let i = 0, s = 0; i < n; i++, s += 2) {
    const o = pd(t.charCodeAt(s)), a = pd(t.charCodeAt(s + 1));
    if (o === void 0 || a === void 0) {
      const c = t[s] + t[s + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + s);
    }
    r[i] = o * 16 + a;
  }
  return r;
}
const Lp = async () => {
};
async function b1(t, e, n) {
  let r = Date.now();
  for (let i = 0; i < t; i++) {
    n(i);
    const s = Date.now() - r;
    s >= 0 && s < e || (await Lp(), r += s);
  }
}
function Xu(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function m1(t) {
  return new TextDecoder().decode(t);
}
function Vo(t) {
  return typeof t == "string" && (t = Xu(t)), ci(t), t;
}
function x1(t) {
  return typeof t == "string" && (t = Xu(t)), ci(t), t;
}
function S1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const i = t[r];
    ci(i), e += i.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, i = 0; r < t.length; r++) {
    const s = t[r];
    n.set(s, i), i += s.length;
  }
  return n;
}
function E1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let Cp = class {
};
function kc(t) {
  const e = (r) => t().update(Vo(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Tp(t) {
  const e = (r, i) => t(i).update(Vo(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Bp(t) {
  const e = (r, i) => t(i).update(Vo(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const A1 = kc, v1 = Tp, k1 = Bp;
function $1(t = 32) {
  if (vi && typeof vi.getRandomValues == "function")
    return vi.getRandomValues(new Uint8Array(t));
  if (vi && typeof vi.randomBytes == "function")
    return Uint8Array.from(vi.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const I1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Cp,
  abytes: ci,
  aexists: _l,
  ahash: u1,
  anumber: Pl,
  aoutput: Ap,
  asyncLoop: b1,
  byteSwap: Wu,
  byteSwap32: kp,
  byteSwapIfBE: p1,
  bytesToHex: Ip,
  bytesToUtf8: m1,
  checkOpts: E1,
  clean: Va,
  concatBytes: S1,
  createHasher: kc,
  createOptHasher: Tp,
  createView: Ma,
  createXOFer: Bp,
  hexToBytes: w1,
  isBytes: Ep,
  isLE: qu,
  kdfInputToBytes: x1,
  nextTick: Lp,
  randomBytes: $1,
  rotl: h1,
  rotr: Xn,
  swap32IfBE: g1,
  swap8IfBE: vp,
  toBytes: Vo,
  u32: d1,
  u8: f1,
  utf8ToBytes: Xu,
  wrapConstructor: A1,
  wrapConstructorWithOpts: v1,
  wrapXOFConstructorWithOpts: k1
}, Symbol.toStringTag, { value: "Module" }));
function L1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function C1(t, e, n) {
  return t & e ^ ~t & n;
}
function T1(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class B1 extends Cp {
  constructor(e, n, r, i) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.buffer = new Uint8Array(e), this.view = Ma(this.buffer);
  }
  update(e) {
    _l(this), e = Vo(e), ci(e);
    const { view: n, buffer: r, blockLen: i } = this, s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = Ma(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    _l(this), Ap(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, Va(this.buffer.subarray(o)), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    L1(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Ma(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], s);
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
const Wr = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Xr = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), M1 = /* @__PURE__ */ Uint32Array.from([
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
]), Yr = /* @__PURE__ */ new Uint32Array(64);
let Yu = class extends B1 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Wr[0] | 0, this.B = Wr[1] | 0, this.C = Wr[2] | 0, this.D = Wr[3] | 0, this.E = Wr[4] | 0, this.F = Wr[5] | 0, this.G = Wr[6] | 0, this.H = Wr[7] | 0;
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
      Yr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Yr[l - 15], p = Yr[l - 2], x = Xn(y, 7) ^ Xn(y, 18) ^ y >>> 3, S = Xn(p, 17) ^ Xn(p, 19) ^ p >>> 10;
      Yr[l] = S + Yr[l - 7] + x + Yr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const y = Xn(a, 6) ^ Xn(a, 11) ^ Xn(a, 25), p = f + y + C1(a, c, u) + M1[l] + Yr[l] | 0, S = (Xn(r, 2) ^ Xn(r, 13) ^ Xn(r, 22)) + T1(r, i, s) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, i, s, o, a, c, u, f);
  }
  roundClean() {
    Va(Yr);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Va(this.buffer);
  }
}, Mp = class extends Yu {
  constructor() {
    super(28), this.A = Xr[0] | 0, this.B = Xr[1] | 0, this.C = Xr[2] | 0, this.D = Xr[3] | 0, this.E = Xr[4] | 0, this.F = Xr[5] | 0, this.G = Xr[6] | 0, this.H = Xr[7] | 0;
  }
};
const N1 = /* @__PURE__ */ kc(() => new Yu()), P1 = /* @__PURE__ */ kc(() => new Mp()), _1 = Yu, Np = N1, U1 = Mp, H1 = P1, O1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: U1,
  SHA256: _1,
  sha224: H1,
  sha256: Np
}, Symbol.toStringTag, { value: "Module" })), $c = /* @__PURE__ */ wc(O1), D1 = /* @__PURE__ */ wc(Kb);
var Vi = {};
Object.defineProperty(Vi, "__esModule", { value: !0 });
Vi.joseToDer = Vi.derToJose = void 0;
const Pp = Ko, _p = cn;
function tl(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const F1 = {
  ES256: tl(256),
  ES384: tl(384),
  ES512: tl(521)
};
function Up(t) {
  const e = F1[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const qa = 128, Hp = 0, j1 = 32, z1 = 16, R1 = 2, Op = z1 | j1 | Hp << 6, Wa = R1 | Hp << 6;
function Dp(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Pp.toByteArray)((0, _p.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function G1(t, e) {
  const n = Dp(t), r = Up(e), i = r + 1, s = n.length;
  let o = 0;
  if (n[o++] !== Op)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (qa | 1) && (a = n[o++]), s - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${s - o}" remaining`);
  if (n[o++] !== Wa)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (s - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${s - o - 2}" available`);
  if (i < c)
    throw new Error(`"r" specified length of "${c}", max of "${i}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== Wa)
    throw new Error('Could not find expected "int" for "s"');
  const f = n[o++];
  if (s - o !== f)
    throw new Error(`"s" specified length of "${f}", expected "${s - o}"`);
  if (i < f)
    throw new Error(`"s" specified length of "${f}", max of "${i}" is acceptable`);
  const l = o;
  if (o += f, o !== s)
    throw new Error(`Expected to consume entire array, but "${s - o}" bytes remain`);
  const y = r - c, p = r - f, x = new Uint8Array(y + c + p + f);
  for (o = 0; o < y; ++o)
    x[o] = 0;
  x.set(n.subarray(u + Math.max(-y, 0), u + c), o), o = r;
  for (const S = o; o < S + p; ++o)
    x[o] = 0;
  return x.set(n.subarray(l + Math.max(-p, 0), l + f), o), (0, _p.escape)((0, Pp.fromByteArray)(x));
}
Vi.derToJose = G1;
function gd(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= qa && --r, r;
}
function K1(t, e) {
  t = Dp(t);
  const n = Up(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const i = gd(t, 0, n), s = gd(t, n, t.length), o = n - i, a = n - s, c = 2 + o + 1 + 1 + a, u = c < qa, f = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return f[l++] = Op, u ? f[l++] = c : (f[l++] = qa | 1, f[l++] = c & 255), f[l++] = Wa, f[l++] = o, i < 0 ? (f[l++] = 0, f.set(t.subarray(0, n), l), l += n) : (f.set(t.subarray(i, n), l), l += n - i), f[l++] = Wa, f[l++] = a, s < 0 ? (f[l++] = 0, f.set(t.subarray(n), l)) : f.set(t.subarray(n + s), l), f;
}
Vi.joseToDer = K1;
var Hr = {};
Object.defineProperty(Hr, "__esModule", { value: !0 });
Hr.InvalidTokenError = Hr.MissingParametersError = void 0;
class V1 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Hr.MissingParametersError = V1;
class q1 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Hr.InvalidTokenError = q1;
const qo = /* @__PURE__ */ wc(I1);
Object.defineProperty(Ac, "__esModule", { value: !0 });
Ac.SECP256K1Client = void 0;
const W1 = xp, X1 = $c, Na = D1, yd = Vi, wd = Hr, bd = qo;
Na.utils.hmacSha256Sync = (t, ...e) => {
  const n = W1.hmac.create(X1.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Fp {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, bd.bytesToHex)(Na.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new wd.MissingParametersError("a signing input hash and private key are all required");
    const i = Na.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, bd.bytesToHex)(i);
    if (r === "jose")
      return (0, yd.derToJose)(i, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, yd.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new wd.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Na.verify(n, e, r, { strict: !1 });
  }
}
Ac.SECP256K1Client = Fp;
Fp.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Ac;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Ec);
var Ks = {};
const Y1 = /* @__PURE__ */ wc(K0);
var Z1 = un && un.__awaiter || function(t, e, n, r) {
  function i(s) {
    return s instanceof n ? s : new n(function(o) {
      o(s);
    });
  }
  return new (n || (n = Promise))(function(s, o) {
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
      f.done ? s(f.value) : i(f.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Ks, "__esModule", { value: !0 });
Ks.hashSha256Async = Ks.hashSha256 = void 0;
const Q1 = $c;
function jp(t) {
  return (0, Q1.sha256)(t);
}
Ks.hashSha256 = jp;
function J1(t) {
  return Z1(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Y1;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(jp(t));
    }
  });
}
Ks.hashSha256Async = J1;
var t2 = un && un.__awaiter || function(t, e, n, r) {
  function i(s) {
    return s instanceof n ? s : new n(function(o) {
      o(s);
    });
  }
  return new (n || (n = Promise))(function(s, o) {
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
      f.done ? s(f.value) : i(f.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Ki, "__esModule", { value: !0 });
Ki.TokenSigner = Ki.createUnsecuredToken = void 0;
const Ul = cn, md = Ec, e2 = Hr, xd = Ks;
function Hl(t, e) {
  const n = [], r = Ul.encode(JSON.stringify(e));
  n.push(r);
  const i = Ul.encode(JSON.stringify(t));
  return n.push(i), n.join(".");
}
function n2(t) {
  return Hl(t, { typ: "JWT", alg: "none" }) + ".";
}
Ki.createUnsecuredToken = n2;
class r2 {
  constructor(e, n) {
    if (!(e && n))
      throw new e2.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !md.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = md.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const i = this.header(r), s = Hl(e, i), o = (0, xd.hashSha256)(s);
    return this.createWithSignedHash(e, n, i, s, o);
  }
  signAsync(e, n = !1, r = {}) {
    return t2(this, void 0, void 0, function* () {
      const i = this.header(r), s = Hl(e, i), o = yield (0, xd.hashSha256Async)(s);
      return this.createWithSignedHash(e, n, i, s, o);
    });
  }
  createWithSignedHash(e, n, r, i, s) {
    const o = this.cryptoClient.signHash(s, this.rawPrivateKey);
    return n ? {
      header: [Ul.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [i, o].join(".");
  }
}
Ki.TokenSigner = r2;
var Ic = {};
Object.defineProperty(Ic, "__esModule", { value: !0 });
Ic.TokenVerifier = void 0;
const s2 = cn, Sd = Ec, i2 = Hr, aa = Ks;
class o2 {
  constructor(e, n) {
    if (!(e && n))
      throw new i2.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Sd.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Sd.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, aa.hashSha256Async)(i).then((o) => s(o));
    {
      const o = (0, aa.hashSha256)(i);
      return s(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), s2.encode(e.payload)].join(".");
    let i = !0;
    const s = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (i = !1);
    }), i);
    if (n)
      return (0, aa.hashSha256Async)(r).then((o) => s(o));
    {
      const o = (0, aa.hashSha256)(r);
      return s(o);
    }
  }
}
Ic.TokenVerifier = o2;
var Lc = {};
Object.defineProperty(Lc, "__esModule", { value: !0 });
Lc.decodeToken = void 0;
const ca = cn;
function a2(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(ca.decode(e[0])), r = JSON.parse(ca.decode(e[1])), i = e[2];
    return {
      header: n,
      payload: r,
      signature: i
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = ca.decode(e));
    const n = [];
    return t.header.map((r) => {
      const i = JSON.parse(ca.decode(r));
      n.push(i);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Lc.decodeToken = a2;
(function(t) {
  var e = un && un.__createBinding || (Object.create ? function(r, i, s, o) {
    o === void 0 && (o = s);
    var a = Object.getOwnPropertyDescriptor(i, s);
    (!a || ("get" in a ? !i.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return i[s];
    } }), Object.defineProperty(r, o, a);
  } : function(r, i, s, o) {
    o === void 0 && (o = s), r[o] = i[s];
  }), n = un && un.__exportStar || function(r, i) {
    for (var s in r) s !== "default" && !Object.prototype.hasOwnProperty.call(i, s) && e(i, r, s);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Ki, t), n(Ic, t), n(Lc, t), n(Hr, t), n(Ec, t);
})(Ye);
function c2(t) {
  return `did:btc-addr:${t}`;
}
function l2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new td("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new td('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function zp(t) {
  if (t)
    return l2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const u2 = "1.4.0";
function f2() {
  return Ym();
}
function d2(t, e, n, r = _0.slice(), i, s = qw().getTime(), o = {}) {
  const a = (p) => {
    const x = _u("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return x == null ? void 0 : x.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), i || (i = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Xw(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(s / 1e3),
    iss: null,
    public_keys: [],
    domain_name: i,
    manifest_uri: n,
    redirect_uri: e,
    version: u2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = Ye.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const f = dp(u);
  return c.iss = c2(f), new Ye.TokenSigner("ES256k", t).sign(c);
}
async function Ed(t, e) {
  const n = Ro(Rt(e)), r = JSON.parse(n), i = await yp(t, r);
  if (typeof i != "string")
    throw new Error("Unable to correctly decrypt private key");
  return i;
}
function h2(t) {
  const e = Ye.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Ye.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function p2(t) {
  const e = Ye.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = zp(e.iss);
  if (n.length === 1) {
    if (dp(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function g2(t) {
  const e = Ye.decodeToken(t).payload;
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
function y2(t) {
  const e = Ye.decodeToken(t).payload;
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
function w2(t) {
  const e = [
    y2(t),
    g2(t),
    h2(t),
    p2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Ad = "1.0.0";
class ms {
  constructor(e) {
    this.version = Ad, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Ad)
      throw new Ll(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new ms(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Rp {
  constructor(e) {
    if (e) {
      const n = new ms(e);
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
class vd extends Rp {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new ms({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new U0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new ms({})), !0;
  }
}
class kd extends Rp {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Gw, !localStorage.getItem(this.key)) {
      const r = new ms({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new U0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return ms.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new ms({})), !0;
  }
}
var Bo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Bo || (Bo = {}));
var Xa;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Xa || (Xa = {}));
Bo.Mainnet;
var _r;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(_r || (_r = {}));
var pr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(pr || (pr = {}));
_r.Mainnet;
const Gp = {
  chainId: Bo.Mainnet,
  transactionVersion: _r.Mainnet,
  peerNetworkId: Xa.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: pr.MainnetSingleSig,
    multiSig: pr.MainnetMultiSig
  },
  client: { baseUrl: H0 }
}, Ol = {
  chainId: Bo.Testnet,
  transactionVersion: _r.Testnet,
  peerNetworkId: Xa.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: pr.TestnetSingleSig,
    multiSig: pr.TestnetMultiSig
  },
  client: { baseUrl: O0 }
}, Pa = {
  ...Ol,
  addressVersion: { ...Ol.addressVersion },
  magicBytes: "id",
  client: { baseUrl: D0 }
}, b2 = {
  ...Pa,
  addressVersion: { ...Pa.addressVersion },
  client: { ...Pa.client }
};
function m2(t) {
  switch (t) {
    case "mainnet":
      return Gp;
    case "testnet":
      return Ol;
    case "devnet":
      return Pa;
    case "mocknet":
      return b2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Kp(t) {
  return typeof t == "string" ? m2(t) : t;
}
var $d;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})($d || ($d = {}));
var Id;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Id || (Id = {}));
var Yn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Yn || (Yn = {}));
const el = ["onChainOnly", "offChainOnly", "any"];
el[0] + "", Yn.OnChainOnly, el[1] + "", Yn.OffChainOnly, el[2] + "", Yn.Any, Yn.OnChainOnly + "", Yn.OnChainOnly, Yn.OffChainOnly + "", Yn.OffChainOnly, Yn.Any + "", Yn.Any;
var Ld;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Ld || (Ld = {}));
var Cd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Cd || (Cd = {}));
var Td;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Td || (Td = {}));
var Pr;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Pr || (Pr = {}));
var Bd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Bd || (Bd = {}));
var Md;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Md || (Md = {}));
var Nd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Nd || (Nd = {}));
var Pd;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Pd || (Pd = {}));
var _d;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(_d || (_d = {}));
var Ud;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ud || (Ud = {}));
var Hd;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Hd || (Hd = {}));
var Od;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Od || (Od = {}));
var Dd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Dd || (Dd = {}));
function Dl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function x2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Vp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function S2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Dl(t.outputLen), Dl(t.blockLen);
}
function E2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function A2(t, e) {
  Vp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ms = {
  number: Dl,
  bool: x2,
  bytes: Vp,
  hash: S2,
  exists: E2,
  output: A2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const nl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), or = (t, e) => t << 32 - e | t >>> e, v2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!v2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function k2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Zu(t) {
  if (typeof t == "string" && (t = k2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let qp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function li(t) {
  const e = (r) => t().update(Zu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Wp = class extends qp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ms.hash(e);
    const r = Zu(n);
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
    return Ms.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ms.exists(this), Ms.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Xp = (t, e, n) => new Wp(t, e).update(n).digest();
Xp.create = (t, e) => new Wp(t, e);
function $2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Qu = class extends qp {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = nl(this.buffer);
  }
  update(e) {
    Ms.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Zu(e);
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
    Ms.exists(this), Ms.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    $2(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = nl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], s);
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
const I2 = (t, e, n) => t & e ^ ~t & n, L2 = (t, e, n) => t & e ^ t & n ^ e & n, C2 = new Uint32Array([
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
]), Zr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Qr = new Uint32Array(64);
let Yp = class extends Qu {
  constructor() {
    super(64, 32, 8, !1), this.A = Zr[0] | 0, this.B = Zr[1] | 0, this.C = Zr[2] | 0, this.D = Zr[3] | 0, this.E = Zr[4] | 0, this.F = Zr[5] | 0, this.G = Zr[6] | 0, this.H = Zr[7] | 0;
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
      Qr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Qr[l - 15], p = Qr[l - 2], x = or(y, 7) ^ or(y, 18) ^ y >>> 3, S = or(p, 17) ^ or(p, 19) ^ p >>> 10;
      Qr[l] = S + Qr[l - 7] + x + Qr[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const y = or(a, 6) ^ or(a, 11) ^ or(a, 25), p = f + y + I2(a, c, u) + C2[l] + Qr[l] | 0, S = (or(r, 2) ^ or(r, 13) ^ or(r, 22)) + L2(r, i, s) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, i, s, o, a, c, u, f);
  }
  roundClean() {
    Qr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, T2 = class extends Yp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Zp = li(() => new Yp());
li(() => new T2());
var ui = {}, Ju = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = qo;
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
        const B = 1 + u, z = S % (1 << B) << 5 - B, R = t.c32[x + z];
        u = B, c.unshift(R);
      } else
        u = 0;
    let f = 0;
    for (let p = 0; p < c.length && c[p] === "0"; p++)
      f++;
    c = c.slice(f);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), y = l ? l[0].length : 0;
    for (let p = 0; p < y; p++)
      c.unshift(t.c32[0]);
    if (a) {
      const p = a - c.length;
      for (let x = 0; x < p; x++)
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
    let f = [], l = 0, y = 0;
    for (let S = o.length - 1; S >= 0; S--) {
      y === 4 && (f.unshift(n[l]), y = 0, l = 0);
      const z = (t.c32.indexOf(o[S]) << y) + l, R = n[z % 16];
      if (y += 1, l = z >> 4, l > 1 << y)
        throw new Error("Panic error in decoding.");
      f.unshift(R);
    }
    f.unshift(n[l]), f.length % 2 === 1 && f.unshift("0");
    let p = 0;
    for (let S = 0; S < f.length && f[S] === "0"; S++)
      p++;
    f = f.slice(p - p % 2);
    let x = f.join("");
    for (let S = 0; S < u; S++)
      x = `00${x}`;
    if (a) {
      const S = a * 2 - x.length;
      for (let B = 0; B < S; B += 2)
        x = `00${x}`;
    }
    return x;
  }
  t.c32decode = s;
})(Ju);
var Vs = {};
Object.defineProperty(Vs, "__esModule", { value: !0 });
Vs.c32checkDecode = Vs.c32checkEncode = void 0;
const Fd = $c, jd = qo, $o = Ju;
function Qp(t) {
  const e = (0, Fd.sha256)((0, Fd.sha256)((0, jd.hexToBytes)(t)));
  return (0, jd.bytesToHex)(e.slice(0, 4));
}
function B2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Qp(`${n}${e}`), i = (0, $o.c32encode)(`${e}${r}`);
  return `${$o.c32[t]}${i}`;
}
Vs.c32checkEncode = B2;
function M2(t) {
  t = (0, $o.c32normalize)(t);
  const e = (0, $o.c32decode)(t.slice(1)), n = t[0], r = $o.c32.indexOf(n), i = e.slice(-8);
  let s = r.toString(16);
  if (s.length === 1 && (s = `0${s}`), Qp(`${s}${e.substring(0, e.length - 8)}`) !== i)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Vs.c32checkDecode = M2;
var Jp = {}, qi = {};
Object.defineProperty(qi, "__esModule", { value: !0 });
qi.decode = qi.encode = void 0;
const Ya = $c, zd = qo, tg = ap, eg = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function N2(t, e = "00") {
  const n = typeof t == "string" ? (0, zd.hexToBytes)(t) : t, r = typeof e == "string" ? (0, zd.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const i = (0, Ya.sha256)((0, Ya.sha256)(new Uint8Array([...r, ...n])));
  return tg(eg).encode([...r, ...n, ...i.slice(0, 4)]);
}
qi.encode = N2;
function P2(t) {
  const e = tg(eg).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), i = (0, Ya.sha256)((0, Ya.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((s, o) => {
    if (s !== i[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
qi.decode = P2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Vs, n = qi, r = qo;
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
    const y = n.decode(f), p = (0, r.bytesToHex)(y.data), x = parseInt((0, r.bytesToHex)(y.prefix), 16);
    let S;
    return l < 0 ? (S = x, i[x] !== void 0 && (S = i[x])) : S = l, o(S, p);
  }
  t.b58ToC32 = c;
  function u(f, l = -1) {
    const y = a(f), p = y[0], x = y[1];
    let S;
    l < 0 ? (S = p, s[p] !== void 0 && (S = s[p])) : S = l;
    let B = S.toString(16);
    return B.length === 1 && (B = `0${B}`), n.encode(x, B);
  }
  t.c32ToB58 = u;
})(Jp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Ju;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Vs;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Jp;
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
})(ui);
function _2(t, e) {
  switch (e = Kp(e ?? Gp), t) {
    case Pr.P2PKH:
      switch (e.transactionVersion) {
        case _r.Mainnet:
          return pr.MainnetSingleSig;
        case _r.Testnet:
          return pr.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Pr.P2SH:
    case Pr.P2SHNonSequential:
    case Pr.P2WPKH:
    case Pr.P2WSH:
    case Pr.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case _r.Mainnet:
          return pr.MainnetMultiSig;
        case _r.Testnet:
          return pr.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const U2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ng = Uint8Array.from({ length: 16 }, (t, e) => e), H2 = ng.map((t) => (9 * t + 5) % 16);
let tf = [ng], ef = [H2];
for (let t = 0; t < 4; t++)
  for (let e of [tf, ef])
    e.push(e[t].map((n) => U2[n]));
const rg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), O2 = tf.map((t, e) => t.map((n) => rg[e][n])), D2 = ef.map((t, e) => t.map((n) => rg[e][n])), F2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), j2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), la = (t, e) => t << e | t >>> 32 - e;
function Rd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ua = new Uint32Array(16);
let z2 = class extends Qu {
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
      ua[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, S = F2[p], B = j2[p], z = tf[p], R = ef[p], A = O2[p], _ = D2[p];
      for (let N = 0; N < 16; N++) {
        const Q = la(r + Rd(p, s, a, u) + ua[z[N]] + S, A[N]) + l | 0;
        r = l, l = u, u = la(a, 10) | 0, a = s, s = Q;
      }
      for (let N = 0; N < 16; N++) {
        const Q = la(i + Rd(x, o, c, f) + ua[R[N]] + B, _[N]) + y | 0;
        i = y, y = f, f = la(c, 10) | 0, c = o, o = Q;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    ua.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const R2 = li(() => new z2()), fa = BigInt(2 ** 32 - 1), Fl = BigInt(32);
function sg(t, e = !1) {
  return e ? { h: Number(t & fa), l: Number(t >> Fl & fa) } : { h: Number(t >> Fl & fa) | 0, l: Number(t & fa) | 0 };
}
function G2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = sg(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const K2 = (t, e) => BigInt(t >>> 0) << Fl | BigInt(e >>> 0), V2 = (t, e, n) => t >>> n, q2 = (t, e, n) => t << 32 - n | e >>> n, W2 = (t, e, n) => t >>> n | e << 32 - n, X2 = (t, e, n) => t << 32 - n | e >>> n, Y2 = (t, e, n) => t << 64 - n | e >>> n - 32, Z2 = (t, e, n) => t >>> n - 32 | e << 64 - n, Q2 = (t, e) => e, J2 = (t, e) => t, tx = (t, e, n) => t << n | e >>> 32 - n, ex = (t, e, n) => e << n | t >>> 32 - n, nx = (t, e, n) => e << n - 32 | t >>> 64 - n, rx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function sx(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const ix = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), ox = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, ax = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), cx = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, lx = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), ux = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Lt = {
  fromBig: sg,
  split: G2,
  toBig: K2,
  shrSH: V2,
  shrSL: q2,
  rotrSH: W2,
  rotrSL: X2,
  rotrBH: Y2,
  rotrBL: Z2,
  rotr32H: Q2,
  rotr32L: J2,
  rotlSH: tx,
  rotlSL: ex,
  rotlBH: nx,
  rotlBL: rx,
  add: sx,
  add3L: ix,
  add3H: ox,
  add4L: ax,
  add4H: cx,
  add5H: ux,
  add5L: lx
}, [fx, dx] = Lt.split([
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
].map((t) => BigInt(t))), Jr = new Uint32Array(80), ts = new Uint32Array(80);
let Cc = class extends Qu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: y, Gh: p, Gl: x, Hh: S, Hl: B } = this;
    return [e, n, r, i, s, o, a, c, u, f, l, y, p, x, S, B];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, f, l, y, p, x, S, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Jr[A] = e.getUint32(n), ts[A] = e.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const _ = Jr[A - 15] | 0, N = ts[A - 15] | 0, Q = Lt.rotrSH(_, N, 1) ^ Lt.rotrSH(_, N, 8) ^ Lt.shrSH(_, N, 7), tt = Lt.rotrSL(_, N, 1) ^ Lt.rotrSL(_, N, 8) ^ Lt.shrSL(_, N, 7), G = Jr[A - 2] | 0, V = ts[A - 2] | 0, I = Lt.rotrSH(G, V, 19) ^ Lt.rotrBH(G, V, 61) ^ Lt.shrSH(G, V, 6), P = Lt.rotrSL(G, V, 19) ^ Lt.rotrBL(G, V, 61) ^ Lt.shrSL(G, V, 6), b = Lt.add4L(tt, P, ts[A - 7], ts[A - 16]), T = Lt.add4H(b, Q, I, Jr[A - 7], Jr[A - 16]);
      Jr[A] = T | 0, ts[A] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: y, Fh: p, Fl: x, Gh: S, Gl: B, Hh: z, Hl: R } = this;
    for (let A = 0; A < 80; A++) {
      const _ = Lt.rotrSH(l, y, 14) ^ Lt.rotrSH(l, y, 18) ^ Lt.rotrBH(l, y, 41), N = Lt.rotrSL(l, y, 14) ^ Lt.rotrSL(l, y, 18) ^ Lt.rotrBL(l, y, 41), Q = l & p ^ ~l & S, tt = y & x ^ ~y & B, G = Lt.add5L(R, N, tt, dx[A], ts[A]), V = Lt.add5H(G, z, _, Q, fx[A], Jr[A]), I = G | 0, P = Lt.rotrSH(r, i, 28) ^ Lt.rotrBH(r, i, 34) ^ Lt.rotrBH(r, i, 39), b = Lt.rotrSL(r, i, 28) ^ Lt.rotrBL(r, i, 34) ^ Lt.rotrBL(r, i, 39), T = r & s ^ r & a ^ s & a, D = i & o ^ i & c ^ o & c;
      z = S | 0, R = B | 0, S = p | 0, B = x | 0, p = l | 0, x = y | 0, { h: l, l: y } = Lt.add(u | 0, f | 0, V | 0, I | 0), u = a | 0, f = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const C = Lt.add3L(I, b, D);
      r = Lt.add3H(C, V, P, T), i = C | 0;
    }
    ({ h: r, l: i } = Lt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Lt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Lt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Lt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: y } = Lt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: x } = Lt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: B } = Lt.add(this.Gh | 0, this.Gl | 0, S | 0, B | 0), { h: z, l: R } = Lt.add(this.Hh | 0, this.Hl | 0, z | 0, R | 0), this.set(r, i, s, o, a, c, u, f, l, y, p, x, S, B, z, R);
  }
  roundClean() {
    Jr.fill(0), ts.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, hx = class extends Cc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, px = class extends Cc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, gx = class extends Cc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
li(() => new Cc());
li(() => new hx());
li(() => new px());
li(() => new gx());
var Za = { exports: {} };
Za.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", i = 9007199254740991, s = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", f = "[object Function]", l = "[object GeneratorFunction]", y = "[object Map]", p = "[object Number]", x = "[object Object]", S = "[object Promise]", B = "[object RegExp]", z = "[object Set]", R = "[object String]", A = "[object Symbol]", _ = "[object WeakMap]", N = "[object ArrayBuffer]", Q = "[object DataView]", tt = "[object Float32Array]", G = "[object Float64Array]", V = "[object Int8Array]", I = "[object Int16Array]", P = "[object Int32Array]", b = "[object Uint8Array]", T = "[object Uint8ClampedArray]", D = "[object Uint16Array]", C = "[object Uint32Array]", ot = /[\\^$.*+?()[\]{}|]/g, X = /\w*$/, St = /^\[object .+?Constructor\]$/, k = /^(?:0|[1-9]\d*)$/, m = {};
  m[s] = m[o] = m[N] = m[Q] = m[a] = m[c] = m[tt] = m[G] = m[V] = m[I] = m[P] = m[y] = m[p] = m[x] = m[B] = m[z] = m[R] = m[A] = m[b] = m[T] = m[D] = m[C] = !0, m[u] = m[f] = m[_] = !1;
  var q = typeof un == "object" && un && un.Object === Object && un, rt = typeof self == "object" && self && self.Object === Object && self, at = q || rt || Function("return this")(), vt = e && !e.nodeType && e, te = vt && !0 && t && !t.nodeType && t, $t = te && te.exports === vt;
  function Ht(g, M) {
    return g.set(M[0], M[1]), g;
  }
  function Mt(g, M) {
    return g.add(M), g;
  }
  function jt(g, M) {
    for (var O = -1, ct = g ? g.length : 0; ++O < ct && M(g[O], O, g) !== !1; )
      ;
    return g;
  }
  function et(g, M) {
    for (var O = -1, ct = M.length, qe = g.length; ++O < ct; )
      g[qe + O] = M[O];
    return g;
  }
  function Se(g, M, O, ct) {
    for (var qe = -1, bn = g ? g.length : 0; ++qe < bn; )
      O = M(O, g[qe], qe, g);
    return O;
  }
  function An(g, M) {
    for (var O = -1, ct = Array(g); ++O < g; )
      ct[O] = M(O);
    return ct;
  }
  function Ze(g, M) {
    return g == null ? void 0 : g[M];
  }
  function dn(g) {
    var M = !1;
    if (g != null && typeof g.toString != "function")
      try {
        M = !!(g + "");
      } catch {
      }
    return M;
  }
  function Ie(g) {
    var M = -1, O = Array(g.size);
    return g.forEach(function(ct, qe) {
      O[++M] = [qe, ct];
    }), O;
  }
  function Be(g, M) {
    return function(O) {
      return g(M(O));
    };
  }
  function Me(g) {
    var M = -1, O = Array(g.size);
    return g.forEach(function(ct) {
      O[++M] = ct;
    }), O;
  }
  var ee = Array.prototype, hn = Function.prototype, je = Object.prototype, be = at["__core-js_shared__"], Xt = function() {
    var g = /[^.]+$/.exec(be && be.keys && be.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), oe = hn.toString, Ue = je.hasOwnProperty, vn = je.toString, $ = RegExp(
    "^" + oe.call(Ue).replace(ot, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), F = $t ? at.Buffer : void 0, U = at.Symbol, H = at.Uint8Array, ut = Be(Object.getPrototypeOf, Object), xt = Object.create, ne = je.propertyIsEnumerable, Yt = ee.splice, Zt = Object.getOwnPropertySymbols, qt = F ? F.isBuffer : void 0, Ne = Be(Object.keys, Object), He = K(at, "DataView"), Ot = K(at, "Map"), Et = K(at, "Promise"), Gt = K(at, "Set"), Qt = K(at, "WeakMap"), Ee = K(Object, "create"), ce = pe(He), pn = pe(Ot), kn = pe(Et), Ar = pe(Gt), lo = pe(Qt), le = U ? U.prototype : void 0, yi = le ? le.valueOf : void 0;
  function Un(g) {
    var M = -1, O = g ? g.length : 0;
    for (this.clear(); ++M < O; ) {
      var ct = g[M];
      this.set(ct[0], ct[1]);
    }
  }
  function Kt() {
    this.__data__ = Ee ? Ee(null) : {};
  }
  function Ge(g) {
    return this.has(g) && delete this.__data__[g];
  }
  function vs(g) {
    var M = this.__data__;
    if (Ee) {
      var O = M[g];
      return O === r ? void 0 : O;
    }
    return Ue.call(M, g) ? M[g] : void 0;
  }
  function d(g) {
    var M = this.__data__;
    return Ee ? M[g] !== void 0 : Ue.call(M, g);
  }
  function E(g, M) {
    var O = this.__data__;
    return O[g] = Ee && M === void 0 ? r : M, this;
  }
  Un.prototype.clear = Kt, Un.prototype.delete = Ge, Un.prototype.get = vs, Un.prototype.has = d, Un.prototype.set = E;
  function v(g) {
    var M = -1, O = g ? g.length : 0;
    for (this.clear(); ++M < O; ) {
      var ct = g[M];
      this.set(ct[0], ct[1]);
    }
  }
  function h() {
    this.__data__ = [];
  }
  function st(g) {
    var M = this.__data__, O = yt(M, g);
    if (O < 0)
      return !1;
    var ct = M.length - 1;
    return O == ct ? M.pop() : Yt.call(M, O, 1), !0;
  }
  function pt(g) {
    var M = this.__data__, O = yt(M, g);
    return O < 0 ? void 0 : M[O][1];
  }
  function At(g) {
    return yt(this.__data__, g) > -1;
  }
  function de(g, M) {
    var O = this.__data__, ct = yt(O, g);
    return ct < 0 ? O.push([g, M]) : O[ct][1] = M, this;
  }
  v.prototype.clear = h, v.prototype.delete = st, v.prototype.get = pt, v.prototype.has = At, v.prototype.set = de;
  function re(g) {
    var M = -1, O = g ? g.length : 0;
    for (this.clear(); ++M < O; ) {
      var ct = g[M];
      this.set(ct[0], ct[1]);
    }
  }
  function gn() {
    this.__data__ = {
      hash: new Un(),
      map: new (Ot || v)(),
      string: new Un()
    };
  }
  function he(g) {
    return L(this, g).delete(g);
  }
  function Pe(g) {
    return L(this, g).get(g);
  }
  function Ke(g) {
    return L(this, g).has(g);
  }
  function Vn(g, M) {
    return L(this, g).set(g, M), this;
  }
  re.prototype.clear = gn, re.prototype.delete = he, re.prototype.get = Pe, re.prototype.has = Ke, re.prototype.set = Vn;
  function Qe(g) {
    this.__data__ = new v(g);
  }
  function Je() {
    this.__data__ = new v();
  }
  function Hn(g) {
    return this.__data__.delete(g);
  }
  function vr(g) {
    return this.__data__.get(g);
  }
  function kr(g) {
    return this.__data__.has(g);
  }
  function Ve(g, M) {
    var O = this.__data__;
    if (O instanceof v) {
      var ct = O.__data__;
      if (!Ot || ct.length < n - 1)
        return ct.push([g, M]), this;
      O = this.__data__ = new re(ct);
    }
    return O.set(g, M), this;
  }
  Qe.prototype.clear = Je, Qe.prototype.delete = Hn, Qe.prototype.get = vr, Qe.prototype.has = kr, Qe.prototype.set = Ve;
  function ks(g, M) {
    var O = xi(g) || Zo(g) ? An(g.length, String) : [], ct = O.length, qe = !!ct;
    for (var bn in g)
      Ue.call(g, bn) && !(qe && (bn == "length" || bt(bn, ct))) && O.push(bn);
    return O;
  }
  function On(g, M, O) {
    var ct = g[M];
    (!(Ue.call(g, M) && Rr(ct, O)) || O === void 0 && !(M in g)) && (g[M] = O);
  }
  function yt(g, M) {
    for (var O = g.length; O--; )
      if (Rr(g[O][0], M))
        return O;
    return -1;
  }
  function Dt(g, M) {
    return g && rr(M, Si(M), g);
  }
  function ue(g, M, O, ct, qe, bn, Lr) {
    var mn;
    if (ct && (mn = bn ? ct(g, qe, bn, Lr) : ct(g)), mn !== void 0)
      return mn;
    if (!sr(g))
      return g;
    var qf = xi(g);
    if (qf) {
      if (mn = j(g), !M)
        return bi(g, mn);
    } else {
      var Ei = ft(g), Wf = Ei == f || Ei == l;
      if (Oe(g))
        return Fr(g, M);
      if (Ei == x || Ei == s || Wf && !bn) {
        if (dn(g))
          return bn ? g : {};
        if (mn = gt(Wf ? {} : g), !M)
          return mi(g, Dt(mn, g));
      } else {
        if (!m[Ei])
          return bn ? g : {};
        mn = wt(g, Ei, ue, M);
      }
    }
    Lr || (Lr = new Qe());
    var Xf = Lr.get(g);
    if (Xf)
      return Xf;
    if (Lr.set(g, mn), !qf)
      var Yf = O ? w(g) : Si(g);
    return jt(Yf || g, function(Wc, Qo) {
      Yf && (Qo = Wc, Wc = g[Qo]), On(mn, Qo, ue(Wc, M, O, ct, Qo, g, Lr));
    }), mn;
  }
  function yn(g) {
    return sr(g) ? xt(g) : {};
  }
  function wi(g, M, O) {
    var ct = M(g);
    return xi(g) ? ct : et(ct, O(g));
  }
  function uo(g) {
    return vn.call(g);
  }
  function $s(g) {
    if (!sr(g) || _e(g))
      return !1;
    var M = ze(g) || dn(g) ? $ : St;
    return M.test(pe(g));
  }
  function fe(g) {
    if (!tn(g))
      return Ne(g);
    var M = [];
    for (var O in Object(g))
      Ue.call(g, O) && O != "constructor" && M.push(O);
    return M;
  }
  function Fr(g, M) {
    if (M)
      return g.slice();
    var O = new g.constructor(g.length);
    return g.copy(O), O;
  }
  function jr(g) {
    var M = new g.constructor(g.byteLength);
    return new H(M).set(new H(g)), M;
  }
  function $r(g, M) {
    var O = M ? jr(g.buffer) : g.buffer;
    return new g.constructor(O, g.byteOffset, g.byteLength);
  }
  function Ir(g, M, O) {
    var ct = M ? O(Ie(g), !0) : Ie(g);
    return Se(ct, Ht, new g.constructor());
  }
  function qn(g) {
    var M = new g.constructor(g.source, X.exec(g));
    return M.lastIndex = g.lastIndex, M;
  }
  function zr(g, M, O) {
    var ct = M ? O(Me(g), !0) : Me(g);
    return Se(ct, Mt, new g.constructor());
  }
  function Wn(g) {
    return yi ? Object(yi.call(g)) : {};
  }
  function Is(g, M) {
    var O = M ? jr(g.buffer) : g.buffer;
    return new g.constructor(O, g.byteOffset, g.length);
  }
  function bi(g, M) {
    var O = -1, ct = g.length;
    for (M || (M = Array(ct)); ++O < ct; )
      M[O] = g[O];
    return M;
  }
  function rr(g, M, O, ct) {
    O || (O = {});
    for (var qe = -1, bn = M.length; ++qe < bn; ) {
      var Lr = M[qe], mn = void 0;
      On(O, Lr, mn === void 0 ? g[Lr] : mn);
    }
    return O;
  }
  function mi(g, M) {
    return rr(g, J(g), M);
  }
  function w(g) {
    return wi(g, Si, J);
  }
  function L(g, M) {
    var O = g.__data__;
    return zt(M) ? O[typeof M == "string" ? "string" : "hash"] : O.map;
  }
  function K(g, M) {
    var O = Ze(g, M);
    return $s(O) ? O : void 0;
  }
  var J = Zt ? Be(Zt, Object) : Vc, ft = uo;
  (He && ft(new He(new ArrayBuffer(1))) != Q || Ot && ft(new Ot()) != y || Et && ft(Et.resolve()) != S || Gt && ft(new Gt()) != z || Qt && ft(new Qt()) != _) && (ft = function(g) {
    var M = vn.call(g), O = M == x ? g.constructor : void 0, ct = O ? pe(O) : void 0;
    if (ct)
      switch (ct) {
        case ce:
          return Q;
        case pn:
          return y;
        case kn:
          return S;
        case Ar:
          return z;
        case lo:
          return _;
      }
    return M;
  });
  function j(g) {
    var M = g.length, O = g.constructor(M);
    return M && typeof g[0] == "string" && Ue.call(g, "index") && (O.index = g.index, O.input = g.input), O;
  }
  function gt(g) {
    return typeof g.constructor == "function" && !tn(g) ? yn(ut(g)) : {};
  }
  function wt(g, M, O, ct) {
    var qe = g.constructor;
    switch (M) {
      case N:
        return jr(g);
      case a:
      case c:
        return new qe(+g);
      case Q:
        return $r(g, ct);
      case tt:
      case G:
      case V:
      case I:
      case P:
      case b:
      case T:
      case D:
      case C:
        return Is(g, ct);
      case y:
        return Ir(g, ct, O);
      case p:
      case R:
        return new qe(g);
      case B:
        return qn(g);
      case z:
        return zr(g, ct, O);
      case A:
        return Wn(g);
    }
  }
  function bt(g, M) {
    return M = M ?? i, !!M && (typeof g == "number" || k.test(g)) && g > -1 && g % 1 == 0 && g < M;
  }
  function zt(g) {
    var M = typeof g;
    return M == "string" || M == "number" || M == "symbol" || M == "boolean" ? g !== "__proto__" : g === null;
  }
  function _e(g) {
    return !!Xt && Xt in g;
  }
  function tn(g) {
    var M = g && g.constructor, O = typeof M == "function" && M.prototype || je;
    return g === O;
  }
  function pe(g) {
    if (g != null) {
      try {
        return oe.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function $n(g) {
    return ue(g, !0, !0);
  }
  function Rr(g, M) {
    return g === M || g !== g && M !== M;
  }
  function Zo(g) {
    return dt(g) && Ue.call(g, "callee") && (!ne.call(g, "callee") || vn.call(g) == s);
  }
  var xi = Array.isArray;
  function W(g) {
    return g != null && fo(g.length) && !ze(g);
  }
  function dt(g) {
    return wn(g) && W(g);
  }
  var Oe = qt || qc;
  function ze(g) {
    var M = sr(g) ? vn.call(g) : "";
    return M == f || M == l;
  }
  function fo(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= i;
  }
  function sr(g) {
    var M = typeof g;
    return !!g && (M == "object" || M == "function");
  }
  function wn(g) {
    return !!g && typeof g == "object";
  }
  function Si(g) {
    return W(g) ? ks(g) : fe(g);
  }
  function Vc() {
    return [];
  }
  function qc() {
    return !1;
  }
  t.exports = $n;
})(Za, Za.exports);
var yx = Za.exports;
const ig = /* @__PURE__ */ B0(yx);
var jl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(jl || (jl = {}));
function wx(t, e) {
  return { type: jl.Address, version: t, hash160: e };
}
function bx(t) {
  return ui.c32address(t.version, t.hash160);
}
const mx = (t) => R2(Zp(t)), xx = (t) => ht(mx(t));
$e.hmacSha256Sync = (t, ...e) => {
  const n = Xp.create(Zp, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Sx(t, e = "mainnet") {
  e = Kp(e), t = typeof t == "string" ? Rt(t) : t;
  const n = _2(Pr.P2PKH, e), r = wx(n, xx(t));
  return bx(r);
}
function Ex(t, e) {
  const n = Ye.decodeToken(t), r = n.payload;
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
  const i = r.issuer.publicKey, s = Sx(i);
  if (e !== i) {
    if (e !== s) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new Ye.TokenVerifier(n.header.alg, i);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function Ax(t, e = null) {
  let n;
  e ? n = Ex(t, e) : n = Ye.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const i = n.payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    i.hasOwnProperty("claim") && (r = i.claim);
  }
  return r;
}
const Gd = "_blockstackDidCheckEchoReply", vx = "echoReply", kx = "authContinuation";
function $x(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [i, s] = r.split("=");
    return n[i] = s ? decodeURIComponent(s.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Ix() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Gd];
  if (typeof e == "boolean")
    return e;
  const n = $x(t.location.search), r = n[vx];
  if (r) {
    t[Gd] = !0;
    const i = `echo-reply-${r}`;
    return t.localStorage.setItem(i, "success"), t.setTimeout(() => {
      const s = n[kx];
      t.location.href = s;
    }, 10), !0;
  }
  return !1;
}
class zl {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new F0();
    else
      throw new Vw("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new kd(e.sessionOptions) : this.store = new kd() : e ? this.store = new vd(e.sessionOptions) : this.store = new vd();
  }
  makeAuthRequestToken(e, n, r, i, s, o = Ww().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Ll("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), i = i || c.scopes, s = s || c.appDomain, d2(e, n, r, i, s, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = f2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = _u("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Ix())
        return Ci.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Ci.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = wb()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new Jo("Existing user session found.");
    const i = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const s = Ye.decodeToken(e).payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await w2(e))
      throw new Jo("Invalid authentication response.");
    let a = s.private_key, c = s.core_token;
    if (Yc(s.version, "1.1.0"))
      if (i !== void 0 && i != null) {
        if (s.private_key !== void 0 && s.private_key !== null)
          try {
            a = await Ed(i, s.private_key);
          } catch {
            if (Ci.warn("Failed decryption of appPrivateKey, will try to use as given"), !$e.isValidPrivateKey(s.private_key))
              throw new Jo("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Ed(i, c);
          } catch {
            Ci.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new Jo("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = ob, f;
    Yc(s.version, "1.2.0") && s.hubUrl !== null && s.hubUrl !== void 0 && (u = s.hubUrl), Yc(s.version, "1.3.0") && s.associationToken !== null && s.associationToken !== void 0 && (f = s.associationToken);
    const l = {
      profile: s.profile,
      email: s.email,
      decentralizedID: s.iss,
      identityAddress: zp(s.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: s.appPrivateKeyFromWalletSalt,
      coreNode: s.blockstackAPIUrl,
      gaiaAssociationToken: f
    }, y = s.profile_url;
    if (!l.profile && y) {
      const p = await n(y);
      if (!p.ok)
        l.profile = Object.assign({}, Rw);
      else {
        const x = await p.text(), S = JSON.parse(x);
        l.profile = Ax(S[0].token);
      }
    } else
      l.profile = s.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Ll("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), o1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), a1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
zl.prototype.makeAuthRequest = zl.prototype.makeAuthRequestToken;
const Lx = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Cx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = Lx(), n = t.filter((r) => e.find((s) => s.id === r.id) ? !1 : !!Tc(r.id));
  return e.concat(n);
}, Tc = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), og = "STX_PROVIDER", qs = () => typeof window > "u" ? null : window.localStorage.getItem(og), Tx = (t) => {
  typeof window < "u" && window.localStorage.setItem(og, t);
}, Bx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Mx(t, e) {
  const n = {};
  return Object.assign(n, Bx, e), await fetch(t, n);
}
function Nx(t) {
  let e = Mx, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Px(...t) {
  const { fetchLib: e, middlewares: n } = Nx(t);
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
var Wi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Wi || (Wi = {}));
var Ws;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ws || (Ws = {}));
var Kd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Kd || (Kd = {}));
const _x = "https://api.mainnet.hiro.so", Ux = "https://api.testnet.hiro.so", Hx = "http://localhost:3999", Ox = ["mainnet", "testnet", "devnet", "mocknet"];
class Xs {
  constructor(e) {
    this.version = Ws.Mainnet, this.chainId = Wi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ws.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, i) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(i)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let i = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (i = `${i}?limit=${r.limit}&offset=${r.offset}`), i;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, i) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${i}?proof=0`, this.getMapEntryUrl = (n, r, i) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${i}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Px();
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
Xs.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Rl();
    case "testnet":
      return new Gl();
    case "devnet":
      return new Dx();
    case "mocknet":
      return new ag();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Ox.join(", ")}`);
  }
};
Xs.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Xs.fromName(t);
class Rl extends Xs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? _x,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ws.Mainnet, this.chainId = Wi.Mainnet;
  }
}
class Gl extends Xs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ux,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ws.Testnet, this.chainId = Wi.Testnet;
  }
}
class ag extends Xs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Hx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ws.Testnet, this.chainId = Wi.Testnet;
  }
}
const Dx = ag;
var Ys;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Ys || (Ys = {}));
var Qa;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Qa || (Qa = {}));
Ys.Mainnet;
var Zs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Zs || (Zs = {}));
var Qs;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Qs || (Qs = {}));
Zs.Mainnet;
const Fx = {
  chainId: Ys.Mainnet,
  transactionVersion: Zs.Mainnet,
  peerNetworkId: Qa.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Qs.MainnetSingleSig,
    multiSig: Qs.MainnetMultiSig
  },
  client: { baseUrl: H0 }
}, Kl = {
  chainId: Ys.Testnet,
  transactionVersion: Zs.Testnet,
  peerNetworkId: Qa.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Qs.TestnetSingleSig,
    multiSig: Qs.TestnetMultiSig
  },
  client: { baseUrl: O0 }
}, _a = {
  ...Kl,
  addressVersion: { ...Kl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: D0 }
}, jx = {
  ..._a,
  addressVersion: { ..._a.addressVersion },
  client: { ..._a.client }
};
function zx(t) {
  switch (t) {
    case "mainnet":
      return Fx;
    case "testnet":
      return Kl;
    case "devnet":
      return _a;
    case "mocknet":
      return jx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Rx(t) {
  return typeof t == "string" ? zx(t) : t;
}
function Gx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Vd = /* @__PURE__ */ new Map();
function cg(t, e) {
  const n = Vd.get(t);
  if (n !== void 0)
    return n(e);
  const r = Gx(t);
  return Vd.set(t, r), cg(t, e);
}
let ae = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Rt(e) : e;
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
    const n = this.readBytes(e).slice().reverse(), r = ht(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = ht(n);
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
    if (cg(e, r))
      return r;
    throw n(r);
  }
};
const Kx = 128, Vx = 128, lg = 16, Os = 32, Vl = 80, Bc = 65, qx = 32, Wx = 64, Ja = 34, Xx = 1 + 16 * 1024 * 1024, Yx = 165, Zx = 16, Qx = 16, Jx = 20, tS = Qx + 2 + Jx, eS = tS + 4, nS = Xx + (Yx + Zx * eS);
var Wt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Wt || (Wt = {}));
var ql;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(ql || (ql = {}));
var Ln;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Ln || (Ln = {}));
const rl = ["onChainOnly", "offChainOnly", "any"];
rl[0] + "", Ln.OnChainOnly, rl[1] + "", Ln.OffChainOnly, rl[2] + "", Ln.Any, Ln.OnChainOnly + "", Ln.OnChainOnly, Ln.OffChainOnly + "", Ln.OffChainOnly, Ln.Any + "", Ln.Any;
var tc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(tc || (tc = {}));
var ge;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ge || (ge = {}));
var ve;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ve || (ve = {}));
var se;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(se || (se = {}));
var me;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(me || (me = {}));
var Io;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Io || (Io = {}));
var Wl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Wl || (Wl = {}));
var Xl;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Xl || (Xl = {}));
var ln;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ln || (ln = {}));
var qd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(qd || (qd = {}));
var Yl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Yl || (Yl = {}));
var Qn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Qn || (Qn = {}));
var Wd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Wd || (Wd = {}));
let Mc = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ti = class extends Mc {
  constructor(e) {
    super(e);
  }
}, an = class extends Mc {
  constructor(e) {
    super(e);
  }
}, ec = class extends Mc {
  constructor(e) {
    super(e);
  }
}, Ns = class extends Mc {
  constructor(e) {
    super(e);
  }
};
function Zl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function rS(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function ug(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function sS(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Zl(t.outputLen), Zl(t.blockLen);
}
function iS(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function oS(t, e) {
  ug(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ps = {
  number: Zl,
  bool: rS,
  bytes: ug,
  hash: sS,
  exists: iS,
  output: oS
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const sl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), ar = (t, e) => t << 32 - e | t >>> e, aS = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!aS)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function cS(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function nf(t) {
  if (typeof t == "string" && (t = cS(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let fg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function fi(t) {
  const e = (r) => t().update(nf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let dg = class extends fg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ps.hash(e);
    const r = nf(n);
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
    return Ps.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ps.exists(this), Ps.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const hg = (t, e, n) => new dg(t, e).update(n).digest();
hg.create = (t, e) => new dg(t, e);
function lS(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let rf = class extends fg {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = sl(this.buffer);
  }
  update(e) {
    Ps.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = nf(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = sl(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ps.exists(this), Ps.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    lS(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = sl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], s);
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
const uS = (t, e, n) => t & e ^ ~t & n, fS = (t, e, n) => t & e ^ t & n ^ e & n, dS = new Uint32Array([
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
]), es = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ns = new Uint32Array(64);
let pg = class extends rf {
  constructor() {
    super(64, 32, 8, !1), this.A = es[0] | 0, this.B = es[1] | 0, this.C = es[2] | 0, this.D = es[3] | 0, this.E = es[4] | 0, this.F = es[5] | 0, this.G = es[6] | 0, this.H = es[7] | 0;
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
      ns[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = ns[l - 15], p = ns[l - 2], x = ar(y, 7) ^ ar(y, 18) ^ y >>> 3, S = ar(p, 17) ^ ar(p, 19) ^ p >>> 10;
      ns[l] = S + ns[l - 7] + x + ns[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const y = ar(a, 6) ^ ar(a, 11) ^ ar(a, 25), p = f + y + uS(a, c, u) + dS[l] + ns[l] | 0, S = (ar(r, 2) ^ ar(r, 13) ^ ar(r, 22)) + fS(r, i, s) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, i, s, o, a, c, u, f);
  }
  roundClean() {
    ns.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, hS = class extends pg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const sf = fi(() => new pg());
fi(() => new hS());
const pS = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), gg = Uint8Array.from({ length: 16 }, (t, e) => e), gS = gg.map((t) => (9 * t + 5) % 16);
let of = [gg], af = [gS];
for (let t = 0; t < 4; t++)
  for (let e of [of, af])
    e.push(e[t].map((n) => pS[n]));
const yg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), yS = of.map((t, e) => t.map((n) => yg[e][n])), wS = af.map((t, e) => t.map((n) => yg[e][n])), bS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), mS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), da = (t, e) => t << e | t >>> 32 - e;
function Xd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ha = new Uint32Array(16);
let xS = class extends rf {
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
      ha[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, S = bS[p], B = mS[p], z = of[p], R = af[p], A = yS[p], _ = wS[p];
      for (let N = 0; N < 16; N++) {
        const Q = da(r + Xd(p, s, a, u) + ha[z[N]] + S, A[N]) + l | 0;
        r = l, l = u, u = da(a, 10) | 0, a = s, s = Q;
      }
      for (let N = 0; N < 16; N++) {
        const Q = da(i + Xd(x, o, c, f) + ha[R[N]] + B, _[N]) + y | 0;
        i = y, y = f, f = da(c, 10) | 0, c = o, o = Q;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    ha.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const SS = fi(() => new xS()), pa = BigInt(2 ** 32 - 1), Ql = BigInt(32);
function wg(t, e = !1) {
  return e ? { h: Number(t & pa), l: Number(t >> Ql & pa) } : { h: Number(t >> Ql & pa) | 0, l: Number(t & pa) | 0 };
}
function ES(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = wg(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const AS = (t, e) => BigInt(t >>> 0) << Ql | BigInt(e >>> 0), vS = (t, e, n) => t >>> n, kS = (t, e, n) => t << 32 - n | e >>> n, $S = (t, e, n) => t >>> n | e << 32 - n, IS = (t, e, n) => t << 32 - n | e >>> n, LS = (t, e, n) => t << 64 - n | e >>> n - 32, CS = (t, e, n) => t >>> n - 32 | e << 64 - n, TS = (t, e) => e, BS = (t, e) => t, MS = (t, e, n) => t << n | e >>> 32 - n, NS = (t, e, n) => e << n | t >>> 32 - n, PS = (t, e, n) => e << n - 32 | t >>> 64 - n, _S = (t, e, n) => t << n - 32 | e >>> 64 - n;
function US(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const HS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), OS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, DS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), FS = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, jS = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), zS = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Ct = {
  fromBig: wg,
  split: ES,
  toBig: AS,
  shrSH: vS,
  shrSL: kS,
  rotrSH: $S,
  rotrSL: IS,
  rotrBH: LS,
  rotrBL: CS,
  rotr32H: TS,
  rotr32L: BS,
  rotlSH: MS,
  rotlSL: NS,
  rotlBH: PS,
  rotlBL: _S,
  add: US,
  add3L: HS,
  add3H: OS,
  add4L: DS,
  add4H: FS,
  add5H: zS,
  add5L: jS
}, [RS, GS] = Ct.split([
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
].map((t) => BigInt(t))), rs = new Uint32Array(80), ss = new Uint32Array(80);
let Nc = class extends rf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: y, Gh: p, Gl: x, Hh: S, Hl: B } = this;
    return [e, n, r, i, s, o, a, c, u, f, l, y, p, x, S, B];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, f, l, y, p, x, S, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let A = 0; A < 16; A++, n += 4)
      rs[A] = e.getUint32(n), ss[A] = e.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const _ = rs[A - 15] | 0, N = ss[A - 15] | 0, Q = Ct.rotrSH(_, N, 1) ^ Ct.rotrSH(_, N, 8) ^ Ct.shrSH(_, N, 7), tt = Ct.rotrSL(_, N, 1) ^ Ct.rotrSL(_, N, 8) ^ Ct.shrSL(_, N, 7), G = rs[A - 2] | 0, V = ss[A - 2] | 0, I = Ct.rotrSH(G, V, 19) ^ Ct.rotrBH(G, V, 61) ^ Ct.shrSH(G, V, 6), P = Ct.rotrSL(G, V, 19) ^ Ct.rotrBL(G, V, 61) ^ Ct.shrSL(G, V, 6), b = Ct.add4L(tt, P, ss[A - 7], ss[A - 16]), T = Ct.add4H(b, Q, I, rs[A - 7], rs[A - 16]);
      rs[A] = T | 0, ss[A] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: y, Fh: p, Fl: x, Gh: S, Gl: B, Hh: z, Hl: R } = this;
    for (let A = 0; A < 80; A++) {
      const _ = Ct.rotrSH(l, y, 14) ^ Ct.rotrSH(l, y, 18) ^ Ct.rotrBH(l, y, 41), N = Ct.rotrSL(l, y, 14) ^ Ct.rotrSL(l, y, 18) ^ Ct.rotrBL(l, y, 41), Q = l & p ^ ~l & S, tt = y & x ^ ~y & B, G = Ct.add5L(R, N, tt, GS[A], ss[A]), V = Ct.add5H(G, z, _, Q, RS[A], rs[A]), I = G | 0, P = Ct.rotrSH(r, i, 28) ^ Ct.rotrBH(r, i, 34) ^ Ct.rotrBH(r, i, 39), b = Ct.rotrSL(r, i, 28) ^ Ct.rotrBL(r, i, 34) ^ Ct.rotrBL(r, i, 39), T = r & s ^ r & a ^ s & a, D = i & o ^ i & c ^ o & c;
      z = S | 0, R = B | 0, S = p | 0, B = x | 0, p = l | 0, x = y | 0, { h: l, l: y } = Ct.add(u | 0, f | 0, V | 0, I | 0), u = a | 0, f = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const C = Ct.add3L(I, b, D);
      r = Ct.add3H(C, V, P, T), i = C | 0;
    }
    ({ h: r, l: i } = Ct.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Ct.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Ct.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Ct.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: y } = Ct.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: x } = Ct.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: B } = Ct.add(this.Gh | 0, this.Gl | 0, S | 0, B | 0), { h: z, l: R } = Ct.add(this.Hh | 0, this.Hl | 0, z | 0, R | 0), this.set(r, i, s, o, a, c, u, f, l, y, p, x, S, B, z, R);
  }
  roundClean() {
    rs.fill(0), ss.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, KS = class extends Nc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, VS = class extends Nc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, qS = class extends Nc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
fi(() => new Nc());
fi(() => new KS());
const WS = fi(() => new VS());
fi(() => new qS());
var Ut;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Ut || (Ut = {}));
var De;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(De || (De = {}));
function cf(t) {
  return De[t];
}
const XS = () => ({ type: Ut.BoolTrue }), YS = () => ({ type: Ut.BoolFalse }), ZS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Ut.Buffer, value: ht(t) };
}, Yd = BigInt("0xffffffffffffffffffffffffffffffff"), QS = BigInt(0), Zd = BigInt("0x7fffffffffffffffffffffffffffffff"), Qd = BigInt("-170141183460469231731687303715884105728"), JS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = Tl(Rt(t))), En(t, Uint8Array) && (t = Tl(t));
  const e = sn(t);
  if (e > Zd)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Zd}`);
  if (e < Qd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Qd}`);
  return { type: Ut.Int, value: e };
}, t3 = (t) => {
  const e = sn(t);
  if (e < QS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Yd)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Yd}`);
  return { type: Ut.UInt, value: e };
};
function e3(t) {
  return { type: Ut.List, value: t };
}
function bg() {
  return { type: Ut.OptionalNone };
}
function mg(t) {
  return { type: Ut.OptionalSome, value: t };
}
var it;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(it || (it = {}));
function n3() {
  return {
    type: it.Address,
    version: Qs.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Jd(t) {
  if (t && Lg(t, Ja))
    throw new Error(`Memo exceeds maximum length of ${Ja} bytes`);
  return { type: it.MemoString, content: t };
}
function lf(t, e) {
  return {
    type: it.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Jl(t) {
  if (Rt(t).byteLength != Bc)
    throw Error("Invalid signature");
  return {
    type: it.MessageSignature,
    data: t
  };
}
function r3(t, e, n) {
  return typeof t == "string" && (t = m3(t)), typeof n == "string" && (n = Jd(n)), {
    type: it.Payload,
    payloadType: Wt.TokenTransfer,
    recipient: t,
    amount: sn(e),
    memo: n ?? Jd("")
  };
}
function s3(t, e, n, r) {
  return typeof e == "string" && (e = er(e)), typeof n == "string" && (n = er(n)), {
    type: it.Payload,
    payloadType: Wt.ContractCall,
    contractAddress: typeof t == "string" ? As(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function i3(t) {
  return er(t, 4, 1e5);
}
function th(t, e, n) {
  return typeof t == "string" && (t = er(t)), typeof e == "string" && (e = i3(e)), typeof n == "number" ? {
    type: it.Payload,
    payloadType: Wt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: it.Payload,
    payloadType: Wt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function o3() {
  return { type: it.Payload, payloadType: Wt.PoisonMicroblock };
}
function eh(t, e) {
  if (t.byteLength != Os)
    throw Error(`Coinbase buffer size must be ${Os} bytes`);
  return e != null ? {
    type: it.Payload,
    payloadType: Wt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: it.Payload,
    payloadType: Wt.Coinbase,
    coinbaseBytes: t
  };
}
function a3(t, e, n) {
  if (t.byteLength != Os)
    throw Error(`Coinbase buffer size must be ${Os} bytes`);
  if (n.byteLength != Vl)
    throw Error(`VRF proof buffer size must be ${Vl} bytes`);
  return {
    type: it.Payload,
    payloadType: Wt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Ut.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function c3(t, e, n, r, i, s, o) {
  return {
    type: it.Payload,
    payloadType: Wt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: i,
    cause: s,
    publicKeyHash: o
  };
}
function er(t, e, n) {
  const r = e || 1, i = n || Kx;
  if (Lg(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: it.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function l3(t, e, n) {
  return {
    type: it.Asset,
    address: As(t),
    contractName: er(e),
    assetName: er(n)
  };
}
function As(t) {
  const e = ui.c32addressDecode(t);
  return {
    type: it.Address,
    version: e[0],
    hash160: e[1]
  };
}
function u3(t, e) {
  const n = As(t), r = er(e);
  return {
    type: it.Principal,
    prefix: ln.Contract,
    address: n,
    contractName: r
  };
}
function f3(t) {
  const e = As(t);
  return {
    type: it.Principal,
    prefix: ln.Standard,
    address: e
  };
}
function Bi(t, e) {
  return {
    pubKeyEncoding: t,
    type: it.TransactionAuthField,
    contents: e
  };
}
function Mr(t) {
  switch (t.type) {
    case it.Address:
      return Wo(t);
    case it.Principal:
      return xg(t);
    case it.LengthPrefixedString:
      return Yi(t);
    case it.MemoString:
      return h3(t);
    case it.Asset:
      return Eg(t);
    case it.PostCondition:
      return vg(t);
    case it.PublicKey:
      return nu(t);
    case it.LengthPrefixedList:
      return uf(t);
    case it.Payload:
      return kg(t);
    case it.TransactionAuthField:
      return b3(t);
    case it.MessageSignature:
      return ff(t);
  }
}
function Wo(t) {
  const e = [];
  return e.push(Rt(zo(t.version, 1))), e.push(Rt(t.hash160)), Ce(e);
}
function Xi(t) {
  const e = En(t, ae) ? t : new ae(t), n = bc(ht(e.readBytes(1))), r = ht(e.readBytes(20));
  return { type: it.Address, version: n, hash160: r };
}
function xg(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === ln.Standard || t.prefix === ln.Contract) && e.push(Wo(t.address)), t.prefix === ln.Contract && e.push(Yi(t.contractName)), Ce(e);
}
function d3(t) {
  const e = En(t, ae) ? t : new ae(t), n = e.readUInt8Enum(ln, (s) => {
    throw new an(`Unexpected Principal payload type: ${s}`);
  });
  if (n === ln.Origin)
    return { type: it.Principal, prefix: n };
  const r = Xi(e);
  if (n === ln.Standard)
    return { type: it.Principal, prefix: n, address: r };
  const i = Rn(e);
  return {
    type: it.Principal,
    prefix: n,
    address: r,
    contractName: i
  };
}
function Yi(t) {
  const e = [], n = oi(t.content), r = n.byteLength;
  return e.push(Rt(zo(r, t.lengthPrefixBytes))), e.push(n), Ce(e);
}
function Rn(t, e, n) {
  e = e || 1;
  const r = En(t, ae) ? t : new ae(t), i = bc(ht(r.readBytes(e))), s = Ro(r.readBytes(i));
  return er(s, e, n ?? 128);
}
function h3(t) {
  const e = [], n = oi(t.content), r = j3(ht(n), Ja * 2);
  return e.push(Rt(r)), Ce(e);
}
function Sg(t) {
  const e = En(t, ae) ? t : new ae(t);
  let n = Ro(e.readBytes(Ja));
  return n = n.replace(/\u0000*$/, ""), { type: it.MemoString, content: n };
}
function Eg(t) {
  const e = [];
  return e.push(Wo(t.address)), e.push(Yi(t.contractName)), e.push(Yi(t.assetName)), Ce(e);
}
function tu(t) {
  const e = En(t, ae) ? t : new ae(t);
  return {
    type: it.Asset,
    address: Xi(e),
    contractName: Rn(e),
    assetName: Rn(e)
  };
}
function uf(t) {
  const e = t.values, n = [];
  n.push(Rt(zo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Mr(r));
  return Ce(n);
}
function Ag(t, e, n) {
  const r = En(t, ae) ? t : new ae(t), i = bc(ht(r.readBytes(4))), s = [];
  for (let o = 0; o < i; o++)
    switch (e) {
      case it.Address:
        s.push(Xi(r));
        break;
      case it.LengthPrefixedString:
        s.push(Rn(r));
        break;
      case it.MemoString:
        s.push(Sg(r));
        break;
      case it.Asset:
        s.push(tu(r));
        break;
      case it.PostCondition:
        s.push(g3(r));
        break;
      case it.PublicKey:
        s.push(ru(r));
        break;
      case it.TransactionAuthField:
        s.push(w3(r));
        break;
    }
  return lf(s, n);
}
function p3(t) {
  return ht(vg(t));
}
function vg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(xg(t.principal)), (t.conditionType === ge.Fungible || t.conditionType === ge.NonFungible) && e.push(Eg(t.asset)), t.conditionType === ge.NonFungible && e.push(gr(t.assetName)), e.push(t.conditionCode), t.conditionType === ge.STX || t.conditionType === ge.Fungible || t.conditionType === ge.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ti("The post-condition amount may not be larger than 8 bytes");
    e.push(Ss(t.amount, 8));
  }
  return Ce(e);
}
function g3(t) {
  const e = En(t, ae) ? t : new ae(t), n = e.readUInt8Enum(ge, (a) => {
    throw new an(`Could not read ${a} as PostConditionType`);
  }), r = d3(e);
  let i, s, o;
  switch (n) {
    case ge.STX:
      return i = e.readUInt8Enum(Io, (c) => {
        throw new an(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${ht(e.readBytes(8))}`), {
        type: it.PostCondition,
        conditionType: ge.STX,
        principal: r,
        conditionCode: i,
        amount: o
      };
    case ge.Fungible:
      return s = tu(e), i = e.readUInt8Enum(Io, (c) => {
        throw new an(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${ht(e.readBytes(8))}`), {
        type: it.PostCondition,
        conditionType: ge.Fungible,
        principal: r,
        conditionCode: i,
        amount: o,
        asset: s
      };
    case ge.NonFungible:
      s = tu(e);
      const a = dr(e);
      return i = e.readUInt8Enum(Wl, (c) => {
        throw new an(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: it.PostCondition,
        conditionType: ge.NonFungible,
        principal: r,
        conditionCode: i,
        asset: s,
        assetName: a
      };
    case ge.Staking:
      return i = e.readUInt8Enum(Io, (c) => {
        throw new an(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${ht(e.readBytes(8))}`), {
        type: it.PostCondition,
        conditionType: ge.Staking,
        principal: r,
        conditionCode: i,
        amount: o
      };
    case ge.PoX: {
      const c = e.readUInt8Enum(Xl, (u) => {
        throw new an(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: it.PostCondition,
        conditionType: ge.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function kg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Wt.TokenTransfer:
      e.push(gr(t.recipient)), e.push(Ss(t.amount, 8)), e.push(Mr(t.memo));
      break;
    case Wt.ContractCall:
      e.push(Mr(t.contractAddress)), e.push(Mr(t.contractName)), e.push(Mr(t.functionName));
      const n = new Uint8Array(4);
      zs(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(gr(r));
      });
      break;
    case Wt.SmartContract:
      e.push(Mr(t.contractName)), e.push(Mr(t.codeBody));
      break;
    case Wt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Mr(t.contractName)), e.push(Mr(t.codeBody));
      break;
    case Wt.PoisonMicroblock:
      break;
    case Wt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Wt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(gr(t.recipient));
      break;
    case Wt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(gr(t.recipient ? mg(t.recipient) : bg())), e.push(t.vrfProof);
      break;
    case Wt.TenureChange:
      e.push(Rt(t.tenureHash)), e.push(Rt(t.previousTenureHash)), e.push(Rt(t.burnViewHash)), e.push(Rt(t.previousTenureEnd)), e.push(zs(new Uint8Array(4), t.previousTenureBlocks)), e.push(db(new Uint8Array(1), t.cause)), e.push(Rt(t.publicKeyHash));
      break;
  }
  return Ce(e);
}
function y3(t) {
  const e = En(t, ae) ? t : new ae(t);
  switch (e.readUInt8Enum(Wt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Wt.TokenTransfer:
      const r = dr(e), i = sn(e.readBytes(8)), s = Sg(e);
      return r3(r, i, s);
    case Wt.ContractCall:
      const o = Xi(e), a = Rn(e), c = Rn(e), u = [], f = e.readUInt32BE();
      for (let _ = 0; _ < f; _++) {
        const N = dr(e);
        u.push(N);
      }
      return s3(o, a, c, u);
    case Wt.SmartContract:
      const l = Rn(e), y = Rn(e, 4, 1e5);
      return th(l, y);
    case Wt.VersionedSmartContract: {
      const _ = e.readUInt8Enum(ql, (tt) => {
        throw new Error(`Cannot recognize ClarityVersion: ${tt}`);
      }), N = Rn(e), Q = Rn(e, 4, nS);
      return th(N, Q, _);
    }
    case Wt.PoisonMicroblock:
      return o3();
    case Wt.Coinbase: {
      const _ = e.readBytes(Os);
      return eh(_);
    }
    case Wt.CoinbaseToAltRecipient: {
      const _ = e.readBytes(Os), N = dr(e);
      return eh(_, N);
    }
    case Wt.NakamotoCoinbase: {
      const _ = e.readBytes(Os), N = dr(e), Q = e.readBytes(Vl);
      return a3(_, N, Q);
    }
    case Wt.TenureChange:
      const p = ht(e.readBytes(20)), x = ht(e.readBytes(20)), S = ht(e.readBytes(20)), B = ht(e.readBytes(32)), z = e.readUInt32BE(), R = e.readUInt8Enum(Yl, (_) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${_}`);
      }), A = ht(e.readBytes(20));
      return c3(p, x, S, B, z, R, A);
  }
}
function eu(t) {
  const e = En(t, ae) ? t : new ae(t);
  return Jl(ht(e.readBytes(Bc)));
}
function w3(t) {
  const e = En(t, ae) ? t : new ae(t), n = e.readUInt8Enum(Qn, (r) => {
    throw new an(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Qn.PublicKeyCompressed:
      return Bi(me.Compressed, ru(e));
    case Qn.PublicKeyUncompressed:
      return Bi(me.Uncompressed, so(Q3(ru(e).data)));
    case Qn.SignatureCompressed:
      return Bi(me.Compressed, eu(e));
    case Qn.SignatureUncompressed:
      return Bi(me.Uncompressed, eu(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function ff(t) {
  return Rt(t.data);
}
function b3(t) {
  const e = [];
  switch (t.contents.type) {
    case it.PublicKey:
      e.push(t.pubKeyEncoding === me.Compressed ? Qn.PublicKeyCompressed : Qn.PublicKeyUncompressed), e.push(Rt(Z3(t.contents.data)));
      break;
    case it.MessageSignature:
      e.push(t.pubKeyEncoding === me.Compressed ? Qn.SignatureCompressed : Qn.SignatureUncompressed), e.push(ff(t.contents));
      break;
  }
  return Ce(e);
}
function nu(t) {
  return t.data.slice();
}
function ru(t) {
  const e = En(t, ae) ? t : new ae(t), n = e.readUInt8(), r = n === 4 ? Wx : qx;
  return so(Ce([n, e.readBytes(r)]));
}
function df(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === se.P2PKH || e === se.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === se.P2WPKH || e === se.P2WSH || e === se.P2WSHNonSequential) && !r.map((i) => i.data).every(io))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case se.P2PKH:
      return ga(t, z3(r[0].data));
    case se.P2WPKH:
      return ga(t, R3(r[0].data));
    case se.P2SH:
    case se.P2SHNonSequential:
      return ga(t, G3(n, r.map(nu)));
    case se.P2WSH:
    case se.P2WSHNonSequential:
      return ga(t, K3(n, r.map(nu)));
  }
}
function ga(t, e) {
  return { type: it.Address, version: t, hash160: e };
}
function hf(t) {
  return ui.c32address(t.version, t.hash160);
}
function nh(t) {
  const [e, n, r] = t.split(/\.|::/);
  return l3(e, n, r);
}
function yo(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return u3(e, n);
  } else
    return f3(t);
}
function m3(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return E3(e, n);
  } else
    return x3(t);
}
function x3(t) {
  const e = As(t);
  return { type: Ut.PrincipalStandard, value: hf(e) };
}
function S3(t) {
  return { type: Ut.PrincipalStandard, value: hf(t) };
}
function E3(t, e) {
  const n = As(t), r = er(e);
  return $g(n, r);
}
function $g(t, e) {
  if (oi(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Ut.PrincipalContract,
    value: `${hf(t)}.${e.content}`
  };
}
function A3(t) {
  return { type: Ut.ResponseErr, value: t };
}
function v3(t) {
  return { type: Ut.ResponseOk, value: t };
}
const k3 = (t) => ({ type: Ut.StringASCII, value: t }), $3 = (t) => ({ type: Ut.StringUTF8, value: t });
function I3(t) {
  for (const e in t)
    if (!V3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Ut.Tuple, value: t };
}
function dr(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ae(Rt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ae(t) : e = t;
  switch (e.readUInt8Enum(De, (r) => {
    throw new an(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case De.int:
      return JS(Tl(e.readBytes(16)));
    case De.uint:
      return t3(e.readBytes(16));
    case De.buffer:
      const r = e.readUInt32BE();
      return ZS(e.readBytes(r));
    case De.true:
      return XS();
    case De.false:
      return YS();
    case De.address:
      const i = Xi(e);
      return S3(i);
    case De.contract:
      const s = Xi(e), o = Rn(e);
      return $g(s, o);
    case De.ok:
      return v3(dr(e));
    case De.err:
      return A3(dr(e));
    case De.none:
      return bg();
    case De.some:
      return mg(dr(e));
    case De.list:
      const a = e.readUInt32BE(), c = [];
      for (let S = 0; S < a; S++)
        c.push(dr(e));
      return e3(c);
    case De.tuple:
      const u = e.readUInt32BE(), f = {};
      for (let S = 0; S < u; S++) {
        const B = Rn(e).content;
        if (B === void 0)
          throw new an('"content" is undefined');
        f[B] = dr(e);
      }
      return I3(f);
    case De.ascii:
      const l = e.readUInt32BE(), y = sb(e.readBytes(l));
      return k3(y);
    case De.utf8:
      const p = e.readUInt32BE(), x = Ro(e.readBytes(p));
      return $3(x);
    default:
      throw new an("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function xr(t, e) {
  return Ce([cf(t), e]);
}
function L3(t) {
  return new Uint8Array([cf(t.type)]);
}
function C3(t) {
  return t.type === Ut.OptionalNone ? new Uint8Array([cf(t.type)]) : xr(t.type, gr(t.value));
}
function T3(t) {
  const e = new Uint8Array(4);
  return zs(e, Math.ceil(t.value.length / 2), 0), xr(t.type, br(e, Rt(t.value)));
}
function B3(t) {
  const e = Uu(Jw(BigInt(t.value), BigInt(Vx)), lg);
  return xr(t.type, e);
}
function M3(t) {
  const e = Uu(BigInt(t.value), lg);
  return xr(t.type, e);
}
function N3(t) {
  return xr(t.type, Wo(As(t.value)));
}
function P3(t) {
  const [e, n] = q3(t.value);
  return xr(t.type, br(Wo(As(e)), Yi(er(n))));
}
function _3(t) {
  return xr(t.type, gr(t.value));
}
function U3(t) {
  const e = [], n = new Uint8Array(4);
  zs(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const i = gr(r);
    e.push(i);
  }
  return xr(t.type, Ce(e));
}
function H3(t) {
  const e = [], n = new Uint8Array(4);
  zs(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = er(i);
    e.push(Yi(s));
    const o = gr(t.value[i]);
    e.push(o);
  }
  return xr(t.type, Ce(e));
}
function Ig(t, e) {
  const n = [], r = e == "ascii" ? rb(t.value) : oi(t.value), i = new Uint8Array(4);
  return zs(i, r.length, 0), n.push(i), n.push(r), xr(t.type, Ce(n));
}
function O3(t) {
  return Ig(t, "ascii");
}
function D3(t) {
  return Ig(t, "utf8");
}
function rh(t) {
  return ht(gr(t));
}
function gr(t) {
  switch (t.type) {
    case Ut.BoolTrue:
    case Ut.BoolFalse:
      return L3(t);
    case Ut.OptionalNone:
    case Ut.OptionalSome:
      return C3(t);
    case Ut.Buffer:
      return T3(t);
    case Ut.UInt:
      return M3(t);
    case Ut.Int:
      return B3(t);
    case Ut.PrincipalStandard:
      return N3(t);
    case Ut.PrincipalContract:
      return P3(t);
    case Ut.ResponseOk:
    case Ut.ResponseErr:
      return _3(t);
    case Ut.List:
      return U3(t);
    case Ut.Tuple:
      return H3(t);
    case Ut.StringASCII:
      return O3(t);
    case Ut.StringUTF8:
      return D3(t);
    default:
      throw new Ti("Unable to serialize. Invalid Clarity Value.");
  }
}
const F3 = (t) => t.length % 2 ? `0${t}` : t, j3 = (t, e) => t.padEnd(e, "0"), Lg = (t, e) => t ? oi(t).length > e : !1;
function su(t) {
  return ig(t);
}
const Mo = (t) => SS(sf(t)), pf = (t) => ht(WS(t)), z3 = (t) => ht(Mo(t)), R3 = (t) => {
  const e = Mo(t), n = br(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Mo(n);
  return ht(r);
}, G3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + e.length), n.push(174);
  const r = Ce(n), i = Mo(r);
  return ht(i);
}, K3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ce(n), i = sf(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = Ce(s), a = Mo(o);
  return ht(a);
};
function V3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function q3(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
$e.hmacSha256Sync = (t, ...e) => {
  const n = hg.create(sf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function so(t) {
  return t = typeof t == "string" ? Rt(t) : t, {
    type: it.PublicKey,
    data: t
  };
}
function W3(t, e, n = me.Compressed) {
  const r = cb(e), i = new Nn(rd(r.r), rd(r.s)), s = Pt.fromSignature(t, i, r.recoveryId), o = n === me.Compressed;
  return s.toHex(o);
}
function X3(t) {
  return typeof t == "string" ? t : ht(t);
}
const gf = X3;
function Cg(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === ab;
}
function io(t) {
  return !gf(t).startsWith("04");
}
function Y3(t) {
  t = Hu(t);
  const e = Cg(t);
  return ht(Go(t.slice(0, 32), e));
}
function Z3(t) {
  return Pt.fromHex(gf(t)).toHex(!0);
}
function Q3(t) {
  return Pt.fromHex(gf(t)).toHex(!1);
}
function J3(t, e) {
  t = Hu(t);
  const [n, r] = xc(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return zo(r, 1) + Nn.fromHex(n).toCompactHex();
}
function yf() {
  return {
    type: it.MessageSignature,
    data: ht(new Uint8Array(Bc))
  };
}
function Tg(t, e, n, r) {
  const i = df(0, t, 1, [so(e)]).hash160, s = io(e) ? me.Compressed : me.Uncompressed;
  return {
    hashMode: t,
    signer: i,
    nonce: sn(n),
    fee: sn(r),
    keyEncoding: s,
    signature: yf()
  };
}
function No(t) {
  return "signature" in t;
}
function sh(t) {
  return t === se.P2SH || t === se.P2WSH;
}
function tE(t) {
  return t === se.P2SHNonSequential || t === se.P2WSHNonSequential;
}
function ih(t) {
  const e = su(t);
  return e.nonce = 0, e.fee = 0, No(e) ? e.signature = yf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function eE(t) {
  const e = [
    t.hashMode,
    Rt(t.signer),
    Ss(t.nonce, 8),
    Ss(t.fee, 8),
    t.keyEncoding,
    ff(t.signature)
  ];
  return Ce(e);
}
function nE(t) {
  const e = [
    t.hashMode,
    Rt(t.signer),
    Ss(t.nonce, 8),
    Ss(t.fee, 8)
  ], n = lf(t.fields);
  e.push(uf(n));
  const r = new Uint8Array(2);
  return ub(r, t.signaturesRequired, 0), e.push(r), Ce(e);
}
function rE(t, e) {
  const n = ht(e.readBytes(20)), r = BigInt(`0x${ht(e.readBytes(8))}`), i = BigInt(`0x${ht(e.readBytes(8))}`), s = e.readUInt8Enum(me, (a) => {
    throw new an(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === se.P2WPKH && s != me.Compressed)
    throw new an("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = eu(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    keyEncoding: s,
    signature: o
  };
}
function sE(t, e) {
  const n = ht(e.readBytes(20)), r = BigInt("0x" + ht(e.readBytes(8))), i = BigInt("0x" + ht(e.readBytes(8))), s = Ag(e, it.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case it.PublicKey:
        io(u.contents.data) || (o = !0);
        break;
      case it.MessageSignature:
        if (u.pubKeyEncoding === me.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Ns("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === se.P2WSH || t === se.P2WSHNonSequential))
    throw new Ns("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: c
  };
}
function il(t) {
  return No(t) ? eE(t) : nE(t);
}
function ol(t) {
  const e = t.readUInt8Enum(se, (n) => {
    throw new an(`Could not parse ${n} as AddressHashMode`);
  });
  return e === se.P2PKH || e === se.P2WPKH ? rE(e, t) : sE(e, t);
}
function Bg(t, e, n, r) {
  const s = t + ht(new Uint8Array([e])) + ht(Ss(n, 8)) + ht(Ss(r, 8));
  if (Rt(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return pf(Rt(s));
}
function Mg(t, e, n) {
  const r = 33 + Bc, i = io(e.data) ? me.Compressed : me.Uncompressed, s = t + F3(i.toString(16)) + n, o = Rt(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return pf(o);
}
function iE(t, e, n, r, i) {
  const s = Bg(t, e, n, r), o = J3(i, s), a = so(Y3(i)), c = Mg(s, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Ng(t, e, n, r, i, s) {
  const o = Bg(t, e, n, r), a = so(W3(o, s, i)), c = Mg(o, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function oE() {
  const t = Tg(se.P2PKH, "", 0, 0);
  return t.signer = n3().hash160, t.keyEncoding = me.Compressed, t.signature = yf(), t;
}
function oh(t, e, n) {
  return No(t) ? aE(t, e, n) : cE(t, e, n);
}
function aE(t, e, n) {
  const { pubKey: r, nextSigHash: i } = Ng(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), s = df(0, t.hashMode, 1, [r]).hash160;
  if (s !== t.signer)
    throw new Ns(`Signer hash does not equal hash of public key(s): ${s} != ${t.signer}`);
  return i;
}
function cE(t, e, n) {
  const r = [];
  let i = e, s = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case it.PublicKey:
        io(c.contents.data) || (s = !0), r.push(c.contents);
        break;
      case it.MessageSignature:
        c.pubKeyEncoding === me.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: f } = Ng(i, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (sh(t.hashMode) && (i = f), r.push(u), o += 1, o === 65536)
          throw new Ns("Too many signatures");
        break;
    }
  if (sh(t.hashMode) && o !== t.signaturesRequired || tE(t.hashMode) && o < t.signaturesRequired)
    throw new Ns("Incorrect number of signatures");
  if (s && (t.hashMode === se.P2WSH || t.hashMode === se.P2WSHNonSequential))
    throw new Ns("Uncompressed keys are not allowed in this hash mode");
  const a = df(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Ns(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return i;
}
function Pg(t) {
  return {
    authType: ve.Standard,
    spendingCondition: t
  };
}
function _g(t, e) {
  return {
    authType: ve.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Tg(se.P2PKH, "0".repeat(66), 0, 0)
  };
}
function ah(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case ve.Standard:
        return Pg(ih(t.spendingCondition));
      case ve.Sponsored:
        return _g(ih(t.spendingCondition), oE());
      default:
        throw new ec("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function lE(t, e) {
  switch (t.authType) {
    case ve.Standard:
      return oh(t.spendingCondition, e, ve.Standard);
    case ve.Sponsored:
      return oh(t.spendingCondition, e, ve.Standard);
    default:
      throw new ec("Invalid origin auth type");
  }
}
function uE(t, e) {
  switch (t.authType) {
    case ve.Standard:
      const n = {
        ...t.spendingCondition,
        fee: sn(e)
      };
      return { ...t, spendingCondition: n };
    case ve.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: sn(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function fE(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: sn(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function dE(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: sn(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function hE(t, e) {
  const n = {
    ...e,
    nonce: sn(e.nonce),
    fee: sn(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function pE(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case ve.Standard:
      e.push(il(t.spendingCondition));
      break;
    case ve.Sponsored:
      e.push(il(t.spendingCondition)), e.push(il(t.sponsorSpendingCondition));
      break;
  }
  return Ce(e);
}
function gE(t) {
  const e = t.readUInt8Enum(ve, (r) => {
    throw new an(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case ve.Standard:
      return n = ol(t), Pg(n);
    case ve.Sponsored:
      n = ol(t);
      const r = ol(t);
      return _g(n, r);
  }
}
class yE {
  constructor({ auth: e, payload: n, postConditions: r = lf([]), postConditionMode: i = tc.Deny, transactionVersion: s, chainId: o, network: a = "mainnet" }) {
    a = Rx(a), this.transactionVersion = s ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: sn(n.amount)
    } : this.payload = n, this.postConditionMode = i, this.postConditions = r, this.anchorMode = Ln.Any;
  }
  signBegin() {
    const e = su(this);
    return e.auth = ah(e.auth), e.txid();
  }
  verifyBegin() {
    const e = su(this);
    return e.auth = ah(e.auth), e.txid();
  }
  verifyOrigin() {
    return lE(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, ve.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === ve.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, ve.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : so(e), r = this.auth.spendingCondition;
    if (r && !No(r)) {
      const i = io(n.data);
      r.fields.push(Bi(i ? me.Compressed : me.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, i) {
    const { nextSig: s, nextSigHash: o } = iE(n, r, e.fee, e.nonce, i);
    if (No(e))
      e.signature = Jl(s);
    else {
      const a = Cg(i);
      e.fields.push(Bi(a ? me.Compressed : me.Uncompressed, Jl(s)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return pf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != ve.Sponsored)
      throw new ec("Cannot sponsor sign a non-sponsored transaction");
    this.auth = hE(this.auth, e);
  }
  setFee(e) {
    this.auth = uE(this.auth, e);
  }
  setNonce(e) {
    this.auth = fE(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != ve.Sponsored)
      throw new ec("Cannot sponsor sign a non-sponsored transaction");
    this.auth = dE(this.auth, e);
  }
  serialize() {
    return ht(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Ti('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Ti('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ti('"auth" is undefined');
    if (this.payload === void 0)
      throw new Ti('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return zs(n, this.chainId, 0), e.push(n), e.push(pE(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(uf(this.postConditions)), e.push(kg(this.payload)), Ce(e);
  }
}
function wE(t) {
  const e = En(t, ae) ? t : new ae(t), n = e.readUInt8Enum(Zs, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), i = gE(e), s = e.readUInt8Enum(Ln, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(tc, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = Ag(e, it.PostCondition), c = y3(e), u = new yE({
    transactionVersion: n,
    chainId: r,
    auth: i,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = s, u;
}
const ch = BigInt("18446744073709551615");
function al(t) {
  const e = sn(t);
  if (e < 0n || e > ch)
    throw new RangeError(`Post-condition amount must be between 0 and ${ch} (u64 max), received: ${e}`);
  return e;
}
var iu;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(iu || (iu = {}));
var ou;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(ou || (ou = {}));
function bE(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: it.PostCondition,
        conditionType: ge.STX,
        principal: t.address === "origin" ? { type: it.Principal, prefix: ln.Origin } : yo(t.address),
        conditionCode: ya(t.condition),
        amount: al(t.amount)
      };
    case "ft-postcondition":
      return {
        type: it.PostCondition,
        conditionType: ge.Fungible,
        principal: t.address === "origin" ? { type: it.Principal, prefix: ln.Origin } : yo(t.address),
        conditionCode: ya(t.condition),
        amount: al(t.amount),
        asset: nh(t.asset)
      };
    case "nft-postcondition":
      return {
        type: it.PostCondition,
        conditionType: ge.NonFungible,
        principal: t.address === "origin" ? { type: it.Principal, prefix: ln.Origin } : yo(t.address),
        conditionCode: ya(t.condition),
        asset: nh(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: it.PostCondition,
        conditionType: ge.Staking,
        principal: t.address === "origin" ? { type: it.Principal, prefix: ln.Origin } : yo(t.address),
        conditionCode: ya(t.condition),
        amount: al(t.amount)
      };
    case "pox-postcondition":
      return {
        type: it.PostCondition,
        conditionType: ge.PoX,
        principal: t.address === "origin" ? { type: it.Principal, prefix: ln.Origin } : yo(t.address),
        conditionCode: mE(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function ya(t) {
  return iu[t];
}
function mE(t) {
  return ou[t];
}
function Ug(t) {
  const e = bE(t);
  return p3(e);
}
function xE(t, e, n) {
  return bf(Hg(t), n);
}
function Hg(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Po(r);
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
    return BigInt(`0x${AE(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function wf(t, e = 8) {
  return (typeof t == "bigint" ? t : Hg(t)).toString(16).padStart(e * 2, "0");
}
function bf(t, e = 16) {
  const n = wf(t, e);
  return Po(n);
}
function SE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const EE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function AE(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += EE[n];
  return e;
}
function Po(t) {
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
function mf(t) {
  return new TextEncoder().encode(t);
}
function vE(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function kE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function lh(t) {
  if (t.some(kE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function xf(...t) {
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
function Dr(t) {
  return xf(...t.map((e) => typeof e == "number" ? lh([e]) : e instanceof Array ? lh(e) : e));
}
function Pc(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var au;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(au || (au = {}));
au.Mainnet;
const $E = 128, IE = 128, Og = 16;
var cu;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(cu || (cu = {}));
var uh;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(uh || (uh = {}));
var fh;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(fh || (fh = {}));
var Zn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Zn || (Zn = {}));
const cl = ["onChainOnly", "offChainOnly", "any"];
cl[0] + "", Zn.OnChainOnly, cl[1] + "", Zn.OffChainOnly, cl[2] + "", Zn.Any, Zn.OnChainOnly + "", Zn.OnChainOnly, Zn.OffChainOnly + "", Zn.OffChainOnly, Zn.Any + "", Zn.Any;
var lu;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(lu || (lu = {}));
lu.Mainnet;
var dh;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(dh || (dh = {}));
var Cs;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Cs || (Cs = {}));
var hh;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(hh || (hh = {}));
var ph;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ph || (ph = {}));
var gh;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(gh || (gh = {}));
var yh;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(yh || (yh = {}));
var wh;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(wh || (wh = {}));
var bh;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(bh || (bh = {}));
var uu;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(uu || (uu = {}));
var mh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(mh || (mh = {}));
var xh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(xh || (xh = {}));
function fu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function LE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Dg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function CE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  fu(t.outputLen), fu(t.blockLen);
}
function TE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function BE(t, e) {
  Dg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ll = {
  number: fu,
  bool: LE,
  bytes: Dg,
  hash: CE,
  exists: TE,
  output: BE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ul = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), cr = (t, e) => t << 32 - e | t >>> e, ME = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ME)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function NE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Fg(t) {
  if (typeof t == "string" && (t = NE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let PE = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function di(t) {
  const e = (r) => t().update(Fg(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function _E(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Sf = class extends PE {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ul(this.buffer);
  }
  update(e) {
    ll.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Fg(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = ul(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ll.exists(this), ll.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    _E(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = ul(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], s);
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
const UE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), jg = Uint8Array.from({ length: 16 }, (t, e) => e), HE = jg.map((t) => (9 * t + 5) % 16);
let Ef = [jg], Af = [HE];
for (let t = 0; t < 4; t++)
  for (let e of [Ef, Af])
    e.push(e[t].map((n) => UE[n]));
const zg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), OE = Ef.map((t, e) => t.map((n) => zg[e][n])), DE = Af.map((t, e) => t.map((n) => zg[e][n])), FE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), jE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), wa = (t, e) => t << e | t >>> 32 - e;
function Sh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ba = new Uint32Array(16);
let zE = class extends Sf {
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
      ba[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, S = FE[p], B = jE[p], z = Ef[p], R = Af[p], A = OE[p], _ = DE[p];
      for (let N = 0; N < 16; N++) {
        const Q = wa(r + Sh(p, s, a, u) + ba[z[N]] + S, A[N]) + l | 0;
        r = l, l = u, u = wa(a, 10) | 0, a = s, s = Q;
      }
      for (let N = 0; N < 16; N++) {
        const Q = wa(i + Sh(x, o, c, f) + ba[R[N]] + B, _[N]) + y | 0;
        i = y, y = f, f = wa(c, 10) | 0, c = o, o = Q;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    ba.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
di(() => new zE());
const RE = (t, e, n) => t & e ^ ~t & n, GE = (t, e, n) => t & e ^ t & n ^ e & n, KE = new Uint32Array([
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
]), is = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), os = new Uint32Array(64);
let Rg = class extends Sf {
  constructor() {
    super(64, 32, 8, !1), this.A = is[0] | 0, this.B = is[1] | 0, this.C = is[2] | 0, this.D = is[3] | 0, this.E = is[4] | 0, this.F = is[5] | 0, this.G = is[6] | 0, this.H = is[7] | 0;
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
      os[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = os[l - 15], p = os[l - 2], x = cr(y, 7) ^ cr(y, 18) ^ y >>> 3, S = cr(p, 17) ^ cr(p, 19) ^ p >>> 10;
      os[l] = S + os[l - 7] + x + os[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const y = cr(a, 6) ^ cr(a, 11) ^ cr(a, 25), p = f + y + RE(a, c, u) + KE[l] + os[l] | 0, S = (cr(r, 2) ^ cr(r, 13) ^ cr(r, 22)) + GE(r, i, s) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, i, s, o, a, c, u, f);
  }
  roundClean() {
    os.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, VE = class extends Rg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
di(() => new Rg());
di(() => new VE());
const ma = BigInt(2 ** 32 - 1), du = BigInt(32);
function Gg(t, e = !1) {
  return e ? { h: Number(t & ma), l: Number(t >> du & ma) } : { h: Number(t >> du & ma) | 0, l: Number(t & ma) | 0 };
}
function qE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Gg(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const WE = (t, e) => BigInt(t >>> 0) << du | BigInt(e >>> 0), XE = (t, e, n) => t >>> n, YE = (t, e, n) => t << 32 - n | e >>> n, ZE = (t, e, n) => t >>> n | e << 32 - n, QE = (t, e, n) => t << 32 - n | e >>> n, JE = (t, e, n) => t << 64 - n | e >>> n - 32, tA = (t, e, n) => t >>> n - 32 | e << 64 - n, eA = (t, e) => e, nA = (t, e) => t, rA = (t, e, n) => t << n | e >>> 32 - n, sA = (t, e, n) => e << n | t >>> 32 - n, iA = (t, e, n) => e << n - 32 | t >>> 64 - n, oA = (t, e, n) => t << n - 32 | e >>> 64 - n;
function aA(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const cA = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), lA = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, uA = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), fA = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, dA = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), hA = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Tt = {
  fromBig: Gg,
  split: qE,
  toBig: WE,
  shrSH: XE,
  shrSL: YE,
  rotrSH: ZE,
  rotrSL: QE,
  rotrBH: JE,
  rotrBL: tA,
  rotr32H: eA,
  rotr32L: nA,
  rotlSH: rA,
  rotlSL: sA,
  rotlBH: iA,
  rotlBL: oA,
  add: aA,
  add3L: cA,
  add3H: lA,
  add4L: uA,
  add4H: fA,
  add5H: hA,
  add5L: dA
}, [pA, gA] = Tt.split([
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
].map((t) => BigInt(t))), as = new Uint32Array(80), cs = new Uint32Array(80);
let _c = class extends Sf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: y, Gh: p, Gl: x, Hh: S, Hl: B } = this;
    return [e, n, r, i, s, o, a, c, u, f, l, y, p, x, S, B];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, f, l, y, p, x, S, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let A = 0; A < 16; A++, n += 4)
      as[A] = e.getUint32(n), cs[A] = e.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const _ = as[A - 15] | 0, N = cs[A - 15] | 0, Q = Tt.rotrSH(_, N, 1) ^ Tt.rotrSH(_, N, 8) ^ Tt.shrSH(_, N, 7), tt = Tt.rotrSL(_, N, 1) ^ Tt.rotrSL(_, N, 8) ^ Tt.shrSL(_, N, 7), G = as[A - 2] | 0, V = cs[A - 2] | 0, I = Tt.rotrSH(G, V, 19) ^ Tt.rotrBH(G, V, 61) ^ Tt.shrSH(G, V, 6), P = Tt.rotrSL(G, V, 19) ^ Tt.rotrBL(G, V, 61) ^ Tt.shrSL(G, V, 6), b = Tt.add4L(tt, P, cs[A - 7], cs[A - 16]), T = Tt.add4H(b, Q, I, as[A - 7], as[A - 16]);
      as[A] = T | 0, cs[A] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: y, Fh: p, Fl: x, Gh: S, Gl: B, Hh: z, Hl: R } = this;
    for (let A = 0; A < 80; A++) {
      const _ = Tt.rotrSH(l, y, 14) ^ Tt.rotrSH(l, y, 18) ^ Tt.rotrBH(l, y, 41), N = Tt.rotrSL(l, y, 14) ^ Tt.rotrSL(l, y, 18) ^ Tt.rotrBL(l, y, 41), Q = l & p ^ ~l & S, tt = y & x ^ ~y & B, G = Tt.add5L(R, N, tt, gA[A], cs[A]), V = Tt.add5H(G, z, _, Q, pA[A], as[A]), I = G | 0, P = Tt.rotrSH(r, i, 28) ^ Tt.rotrBH(r, i, 34) ^ Tt.rotrBH(r, i, 39), b = Tt.rotrSL(r, i, 28) ^ Tt.rotrBL(r, i, 34) ^ Tt.rotrBL(r, i, 39), T = r & s ^ r & a ^ s & a, D = i & o ^ i & c ^ o & c;
      z = S | 0, R = B | 0, S = p | 0, B = x | 0, p = l | 0, x = y | 0, { h: l, l: y } = Tt.add(u | 0, f | 0, V | 0, I | 0), u = a | 0, f = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const C = Tt.add3L(I, b, D);
      r = Tt.add3H(C, V, P, T), i = C | 0;
    }
    ({ h: r, l: i } = Tt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Tt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Tt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: y } = Tt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: x } = Tt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: B } = Tt.add(this.Gh | 0, this.Gl | 0, S | 0, B | 0), { h: z, l: R } = Tt.add(this.Hh | 0, this.Hl | 0, z | 0, R | 0), this.set(r, i, s, o, a, c, u, f, l, y, p, x, S, B, z, R);
  }
  roundClean() {
    as.fill(0), cs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, yA = class extends _c {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, wA = class extends _c {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, bA = class extends _c {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
di(() => new _c());
di(() => new yA());
di(() => new wA());
di(() => new bA());
function mA(t, e, n) {
  const i = $E;
  if (_A(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: cu.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: i
  };
}
var Re;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Re || (Re = {}));
let xA = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Kg = class extends xA {
  constructor(e) {
    super(e);
  }
};
function Uc(t) {
  const e = [];
  return e.push(Po(wf(t.version, 1))), e.push(Po(t.hash160)), Dr(e);
}
function SA(t) {
  const e = [];
  return e.push(t.prefix), e.push(Uc(t.address)), t.prefix === uu.Contract && e.push(_o(t.contractName)), Dr(e);
}
function _o(t) {
  const e = [], n = mf(t.content), r = n.byteLength;
  return e.push(Po(wf(r, t.lengthPrefixBytes))), e.push(n), Dr(e);
}
function EA(t) {
  const e = [];
  return e.push(Uc(t.address)), e.push(_o(t.contractName)), e.push(_o(t.assetName)), Dr(e);
}
function Vg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(SA(t.principal)), (t.conditionType === Cs.Fungible || t.conditionType === Cs.NonFungible) && e.push(EA(t.assetInfo)), t.conditionType === Cs.NonFungible && e.push(Js(t.assetName)), e.push(t.conditionCode), t.conditionType === Cs.STX || t.conditionType === Cs.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Kg("The post-condition amount may not be larger than 8 bytes");
    e.push(xE(t.amount, !1, 8));
  }
  return Dr(e);
}
function Sr(t, e) {
  return Dr([t, e]);
}
function AA(t) {
  return new Uint8Array([t.type]);
}
function vA(t) {
  return t.type === Re.OptionalNone ? new Uint8Array([t.type]) : Sr(t.type, Js(t.value));
}
function kA(t) {
  const e = new Uint8Array(4);
  return Pc(e, t.buffer.length, 0), Sr(t.type, xf(e, t.buffer));
}
function $A(t) {
  const e = bf(SE(t.value, BigInt(IE)), Og);
  return Sr(t.type, e);
}
function IA(t) {
  const e = bf(t.value, Og);
  return Sr(t.type, e);
}
function LA(t) {
  return Sr(t.type, Uc(t.address));
}
function CA(t) {
  return Sr(t.type, xf(Uc(t.address), _o(t.contractName)));
}
function TA(t) {
  return Sr(t.type, Js(t.value));
}
function BA(t) {
  const e = [], n = new Uint8Array(4);
  Pc(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const i = Js(r);
    e.push(i);
  }
  return Sr(t.type, Dr(e));
}
function MA(t) {
  const e = [], n = new Uint8Array(4);
  Pc(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = mA(i);
    e.push(_o(s));
    const o = Js(t.data[i]);
    e.push(o);
  }
  return Sr(t.type, Dr(e));
}
function qg(t, e) {
  const n = [], r = e == "ascii" ? vE(t.data) : mf(t.data), i = new Uint8Array(4);
  return Pc(i, r.length, 0), n.push(i), n.push(r), Sr(t.type, Dr(n));
}
function NA(t) {
  return qg(t, "ascii");
}
function PA(t) {
  return qg(t, "utf8");
}
function Js(t) {
  switch (t.type) {
    case Re.BoolTrue:
    case Re.BoolFalse:
      return AA(t);
    case Re.OptionalNone:
    case Re.OptionalSome:
      return vA(t);
    case Re.Buffer:
      return kA(t);
    case Re.UInt:
      return IA(t);
    case Re.Int:
      return $A(t);
    case Re.PrincipalStandard:
      return LA(t);
    case Re.PrincipalContract:
      return CA(t);
    case Re.ResponseOk:
    case Re.ResponseErr:
      return TA(t);
    case Re.List:
      return BA(t);
    case Re.Tuple:
      return MA(t);
    case Re.StringASCII:
      return NA(t);
    case Re.StringUTF8:
      return PA(t);
    default:
      throw new Kg("Unable to serialize. Invalid Clarity Value.");
  }
}
const _A = (t, e) => t ? mf(t).length > e : !1, UA = "connect-ui";
let Ua, Wg, Cn = !1, hu = !1;
const Or = (t, e = "") => () => {
}, HA = (t, e) => () => {
}, OA = "{visibility:hidden}.hydrated{visibility:inherit}", Eh = {}, DA = "http://www.w3.org/2000/svg", FA = "http://www.w3.org/1999/xhtml", jA = (t) => t != null, vf = (t) => (t = typeof t, t === "object" || t === "function");
function Xg(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const kt = (t, e, ...n) => {
  let r = null, i = !1, s = !1;
  const o = [], a = (u) => {
    for (let f = 0; f < u.length; f++)
      r = u[f], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((i = typeof t != "function" && !vf(r)) && (r = String(r)), i && s ? o[o.length - 1].$text$ += r : o.push(i ? pu(null, r) : r), s = i);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((f) => u[f]).join(" "));
  }
  const c = pu(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, pu = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, zA = {}, RA = (t) => t && t.$tag$ === zA, GA = (t, e) => t != null && !vf(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, KA = (t) => oo(t).$hostElement$, VA = (t, e, n) => {
  const r = rn.ce(e, n);
  return t.dispatchEvent(r), r;
}, Ah = /* @__PURE__ */ new WeakMap(), qA = (t, e, n) => {
  let r = nc.get(t);
  h4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, nc.set(t, r);
}, WA = (t, e, n, r) => {
  var i;
  let s = Yg(e);
  const o = nc.get(s);
  if (t = t.nodeType === 11 ? t : yr, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Ah.get(t), c;
      if (a || Ah.set(t, a = /* @__PURE__ */ new Set()), !a.has(s)) {
        {
          c = yr.createElement("style"), c.innerHTML = o;
          const u = (i = rn.$nonce$) !== null && i !== void 0 ? i : Xg(yr);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(s);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return s;
}, XA = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, i = Or("attachStyles", e.$tagName$), s = WA(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = s, n.classList.add(s + "-h")), i();
}, Yg = (t, e) => "sc-" + t.$tagName$, vh = (t, e, n, r, i, s) => {
  if (n !== r) {
    let o = $h(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = kh(n), f = kh(r);
      c.remove(...u.filter((l) => l && !f.includes(l))), c.add(...f.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : $h(Hc, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && rn.rel(t, e, n, !1), r && rn.ael(t, e, r, !1);
    else {
      const c = vf(r);
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
}, YA = /\s/, kh = (t) => t ? t.split(YA) : [], Zg = (t, e, n, r) => {
  const i = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, s = t && t.$attrs$ || Eh, o = e.$attrs$ || Eh;
  for (r in s)
    r in o || vh(i, r, s[r], void 0, n, e.$flags$);
  for (r in o)
    vh(i, r, s[r], o[r], n, e.$flags$);
}, kf = (t, e, n, r) => {
  const i = e.$children$[n];
  let s = 0, o, a;
  if (i.$text$ !== null)
    o = i.$elm$ = yr.createTextNode(i.$text$);
  else {
    if (Cn || (Cn = i.$tag$ === "svg"), o = i.$elm$ = yr.createElementNS(Cn ? DA : FA, i.$tag$), Cn && i.$tag$ === "foreignObject" && (Cn = !1), Zg(null, i, Cn), jA(Ua) && o["s-si"] !== Ua && o.classList.add(o["s-si"] = Ua), i.$children$)
      for (s = 0; s < i.$children$.length; ++s)
        a = kf(t, i, s), a && o.appendChild(a);
    i.$tag$ === "svg" ? Cn = !1 : o.tagName === "foreignObject" && (Cn = !0);
  }
  return o;
}, Qg = (t, e, n, r, i, s) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Wg && (o = o.shadowRoot); i <= s; ++i)
    r[i] && (a = kf(null, n, i), a && (r[i].$elm$ = a, o.insertBefore(a, e)));
}, Jg = (t, e, n, r, i) => {
  for (; e <= n; ++e)
    (r = t[e]) && (i = r.$elm$, i.remove());
}, ZA = (t, e, n, r) => {
  let i = 0, s = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, f = r[0], l = r[u], y;
  for (; i <= o && s <= u; )
    a == null ? a = e[++i] : c == null ? c = e[--o] : f == null ? f = r[++s] : l == null ? l = r[--u] : xa(a, f) ? (Eo(a, f), a = e[++i], f = r[++s]) : xa(c, l) ? (Eo(c, l), c = e[--o], l = r[--u]) : xa(a, l) ? (Eo(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++i], l = r[--u]) : xa(c, f) ? (Eo(c, f), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], f = r[++s]) : (y = kf(e && e[s], n, s), f = r[++s], y && a.$elm$.parentNode.insertBefore(y, a.$elm$));
  i > o ? Qg(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, s, u) : s > u && Jg(e, i, o);
}, xa = (t, e) => t.$tag$ === e.$tag$, Eo = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, i = e.$children$, s = e.$tag$, o = e.$text$;
  o === null ? (Cn = s === "svg" ? !0 : s === "foreignObject" ? !1 : Cn, Zg(t, e, Cn), r !== null && i !== null ? ZA(n, r, e, i) : i !== null ? (t.$text$ !== null && (n.textContent = ""), Qg(n, null, e, i, 0, i.length - 1)) : r !== null && Jg(r, 0, r.length - 1), Cn && s === "svg" && (Cn = !1)) : t.$text$ !== o && (n.data = o);
}, QA = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || pu(null, null), i = RA(e) ? e : kt(null, null, e);
  Wg = n.tagName, i.$tag$ = null, i.$flags$ |= 4, t.$vnode$ = i, i.$elm$ = r.$elm$ = n.shadowRoot || n, Ua = n["s-sc"], Eo(r, i);
}, ty = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, $f = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return ty(t, t.$ancestorComponent$), g4(() => JA(t, e));
}, JA = (t, e) => {
  const n = Or("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let i;
  return n(), r4(i, () => t4(t, r, e));
}, t4 = async (t, e, n) => {
  const r = t.$hostElement$, i = Or("update", t.$cmpMeta$.$tagName$), s = r["s-rc"];
  n && XA(t);
  const o = Or("render", t.$cmpMeta$.$tagName$);
  e4(t, e), s && (s.map((a) => a()), r["s-rc"] = void 0), o(), i();
  {
    const a = r["s-p"], c = () => n4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, e4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, QA(t, e);
  } catch (r) {
    Uo(r, t.$hostElement$);
  }
  return null;
}, n4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Or("postUpdate", e), i = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, ny(n), r(), t.$onReadyResolve$(n), i || ey()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Lf(() => $f(t, !1)), t.$flags$ &= -517;
}, ey = (t) => {
  ny(yr.documentElement), Lf(() => VA(Hc, "appload", { detail: { namespace: UA } }));
}, r4 = (t, e) => t && t.then ? t.then(e) : e(), ny = (t) => t.classList.add("hydrated"), s4 = (t, e) => oo(t).$instanceValues$.get(e), i4 = (t, e, n, r) => {
  const i = oo(t), s = i.$instanceValues$.get(e), o = i.$flags$, a = i.$lazyInstance$;
  n = GA(n, r.$members$[e][0]);
  const c = Number.isNaN(s) && Number.isNaN(n), u = n !== s && !c;
  (!(o & 8) || s === void 0) && u && (i.$instanceValues$.set(e, n), a && (o & 18) === 2 && $f(i, !1));
}, ry = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), i = t.prototype;
    if (r.map(([s, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(i, s, {
        get() {
          return s4(this, s);
        },
        set(a) {
          i4(this, s, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const s = /* @__PURE__ */ new Map();
      i.attributeChangedCallback = function(o, a, c) {
        rn.jmp(() => {
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
}, o4 = async (t, e, n, r, i) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, i = d4(n), i.then) {
        const c = HA();
        i = await i, c();
      }
      i.isProxied || (ry(
        i,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), i.isProxied = !0);
      const a = Or("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new i(e);
      } catch (c) {
        Uo(c);
      }
      e.$flags$ &= -9, a();
    }
    if (i.style) {
      let a = i.style;
      const c = Yg(n);
      if (!nc.has(c)) {
        const u = Or("registerStyles", n.$tagName$);
        qA(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const s = e.$ancestorComponent$, o = () => $f(e, !0);
  s && s["s-rc"] ? s["s-rc"].push(o) : o();
}, a4 = (t) => {
  if (!(rn.$flags$ & 1)) {
    const e = oo(t), n = e.$cmpMeta$, r = Or("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let i = t;
        for (; i = i.parentNode || i.host; )
          if (i["s-p"]) {
            ty(e, e.$ancestorComponent$ = i);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([i, [s]]) => {
        if (s & 31 && t.hasOwnProperty(i)) {
          const o = t[i];
          delete t[i], t[i] = o;
        }
      }), o4(t, e, n);
    }
    r();
  }
}, c4 = (t) => {
  rn.$flags$ & 1 || oo(t);
}, l4 = (t, e = {}) => {
  var n;
  const r = Or(), i = [], s = e.exclude || [], o = Hc.customElements, a = yr.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ yr.createElement("style"), f = [];
  let l, y = !0;
  Object.assign(rn, e), rn.$resourcesUrl$ = new URL(e.resourcesUrl || "./", yr.baseURI).href, t.map((p) => {
    p[1].map((x) => {
      const S = {
        $flags$: x[0],
        $tagName$: x[1],
        $members$: x[2],
        $listeners$: x[3]
      };
      S.$members$ = x[2];
      const B = S.$tagName$, z = class extends HTMLElement {
        // StencilLazyHost
        constructor(R) {
          super(R), R = this, f4(R, S), S.$flags$ & 1 && R.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), y ? f.push(this) : rn.jmp(() => a4(this));
        }
        disconnectedCallback() {
          rn.jmp(() => c4(this));
        }
        componentOnReady() {
          return oo(this).$onReadyPromise$;
        }
      };
      S.$lazyBundleId$ = p[0], !s.includes(B) && !o.get(B) && (i.push(B), o.define(B, ry(
        z,
        S,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = i + OA, u.setAttribute("data-styles", "");
    const p = (n = rn.$nonce$) !== null && n !== void 0 ? n : Xg(yr);
    p != null && u.setAttribute("nonce", p), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  y = !1, f.length ? f.map((p) => p.connectedCallback()) : rn.jmp(() => l = setTimeout(ey, 30)), r();
}, If = /* @__PURE__ */ new WeakMap(), oo = (t) => If.get(t), u4 = (t, e) => If.set(e.$lazyInstance$ = t, e), f4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], If.set(t, n);
}, $h = (t, e) => e in t, Uo = (t, e) => (0, console.error)(t, e), fl = /* @__PURE__ */ new Map(), d4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), i = t.$lazyBundleId$, s = fl.get(i);
  if (s)
    return s[r];
  {
    const o = (a) => (fl.set(i, a), a[r]);
    switch (i) {
      case "connect-modal":
        return Promise.resolve().then(() => Gk).then(o, Uo);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${i}.entry.js`
  ).then((o) => (fl.set(i, o), o[r]), Uo);
}, nc = /* @__PURE__ */ new Map(), Hc = typeof window < "u" ? window : {}, yr = Hc.document || { head: {} }, rn = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, sy = (t) => Promise.resolve(t), h4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Ih = [], iy = [], p4 = (t, e) => (n) => {
  t.push(n), hu || (hu = !0, rn.$flags$ & 4 ? Lf(gu) : rn.raf(gu));
}, Lh = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Uo(n);
    }
  t.length = 0;
}, gu = () => {
  Lh(Ih), Lh(iy), (hu = Ih.length > 0) && rn.raf(gu);
}, Lf = (t) => sy().then(t), g4 = /* @__PURE__ */ p4(iy), y4 = () => sy(), w4 = (t, e) => typeof window > "u" ? Promise.resolve() : y4().then(() => l4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var b4 = Object.defineProperty, m4 = Object.defineProperties, x4 = Object.getOwnPropertyDescriptors, rc = Object.getOwnPropertySymbols, oy = Object.prototype.hasOwnProperty, ay = Object.prototype.propertyIsEnumerable, Ch = (t, e, n) => e in t ? b4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, _n = (t, e) => {
  for (var n in e || (e = {})) oy.call(e, n) && Ch(t, n, e[n]);
  if (rc) for (var n of rc(e)) ay.call(e, n) && Ch(t, n, e[n]);
  return t;
}, nr = (t, e) => m4(t, x4(e)), cy = (t, e) => {
  var n = {};
  for (var r in t) oy.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && rc) for (var r of rc(t)) e.indexOf(r) < 0 && ay.call(t, r) && (n[r] = t[r]);
  return n;
};
function ly() {
  return Tc(qs()) || window.StacksProvider || window.BlockstackProvider;
}
function Oc(t) {
  return t ? typeof t == "string" ? Xs.fromName(t) : "version" in t ? t : "url" in t ? new Rl({ url: t.url }) : t.transactionVersion === Zs.Mainnet ? new Rl({ url: t.client.baseUrl }) : new Gl({ url: t.client.baseUrl }) : new Gl();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var S4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(S4 || {}), E4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(E4 || {}), Cf = (t) => {
  let e = t;
  if (!e) {
    let n = new F0(["store_write"], document.location.href);
    e = new zl({ appConfig: n });
  }
  return e;
};
function uy(t) {
  try {
    return Cf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var fy = (t) => {
  let e = Cf(t).loadUserData().appPrivateKey, n = Ye.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function A4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: i } = t;
  if (n) return n;
  if (!r || !i) return;
  let s = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [Ys.Mainnet]: "mainnet", [Ys.Testnet]: "testnet" }, a = Oc(i);
  return s == null ? void 0 : s[o[a.chainId]];
}
function v4(t) {
  let e = Oc(t.network), n = Cf(t.userSession), r = nr(_n({}, t), { network: e, userSession: n });
  return _n({ stxAddress: A4(r) }, r);
}
async function k4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Ug) : n = n.map((r) => ht(Vg(r)))), new Ye.TokenSigner("ES256k", e).signAsync(nr(_n({}, t), { postConditions: n }));
}
function $4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(Ug) : e = e.map((n) => ht(Vg(n)))), Ye.createUnsecuredToken(nr(_n({}, t), { postConditions: e }));
}
var I4 = async ({ token: t, options: e }, n) => {
  var r, i, s;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Rt(a.replace(/^0x/, "")), u = wE(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, nr(_n({}, o), { stacksTransaction: u }));
      return;
    }
    (i = e.onFinish) == null || i.call(e, nr(_n({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (s = e.onCancel) == null || s.call(e);
  }
}, L4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: i } = e, s = cy(e, ["amount", "appDetails", "userSession"]);
  if (uy(i)) {
    let { privateKey: a, publicKey: c } = fy(i), u = nr(_n({}, s), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), k4(u, a);
  }
  let o = nr(_n({}, s), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), $4(o);
};
async function C4(t, e, n) {
  let r = await e(nr(_n(_n({}, v4(t)), t), { network: Oc(t.network) }));
  return I4({ token: r, options: t }, n);
}
function T4(t, e = ly()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return C4(t, L4, e);
}
function dy(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? nr(_n({}, t), { message: rh(e), domain: rh(n) }) : nr(_n({}, t), { message: ht(Js(e)), domain: ht(Js(n)) });
}
async function B4(t, e) {
  return new Ye.TokenSigner("ES256k", e).signAsync(dy(t));
}
async function M4(t) {
  let e = t, { userSession: n } = e, r = cy(e, ["userSession"]);
  if (uy(n)) {
    let { privateKey: i, publicKey: s } = fy(n), o = nr(_n({}, r), { publicKey: s });
    return B4(o, i);
  }
  return Ye.createUnsecuredToken(dy(t));
}
var N4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(N4 || {}), hy = "asigna-stx", Th = (t, e) => new Promise((n) => {
  function r(i) {
    i.data.source === hy && i.data[e] && (n(i.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(_4(t, e), "*");
}), P4 = { authenticationRequest: async (t) => Th(t, "authenticationRequest"), transactionRequest: async (t) => Th(t, "transactionRequest") }, _4 = (t, e) => ({ source: hy, [e]: t }), U4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = P4);
};
U4();
var H4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function O4(t, e = !0) {
  return function(n, r) {
    var i;
    if (r) return t(n, r);
    let s = qs(), o = ly();
    if (s && o) return t(n, o);
    if (typeof window > "u") return;
    w4();
    let a = (i = n == null ? void 0 : n.defaultProviders) != null ? i : H4, c = Cx(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = e;
    let f = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      u.remove(), document.body.style.overflow = f;
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
var Sa = O4(T4);
function Es(t, e, n) {
  return Tf(fn(t, e), n);
}
function fn(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = we(r);
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
      const r = j4(BigInt(`0x${_t(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${_t(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Bh(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Xo(t, e = 8) {
  return (typeof t == "bigint" ? t : fn(t, !1)).toString(16).padStart(e * 2, "0");
}
function Dc(t) {
  return parseInt(t, 16);
}
function Tf(t, e = 16) {
  const n = Xo(t, e);
  return we(n);
}
function D4(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function F4(t, e) {
  return t & BigInt(1) << e;
}
function j4(t, e) {
  return F4(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const z4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function _t(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += z4[n];
  return e;
}
function we(t) {
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
function ao(t) {
  return new TextEncoder().encode(t);
}
function Bf(t) {
  return new TextDecoder().decode(t);
}
function py(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function R4(t) {
  return String.fromCharCode.apply(null, t);
}
function G4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Mh(t) {
  if (t.some(G4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Fc(...t) {
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
function Te(t) {
  return Fc(...t.map((e) => typeof e == "number" ? Mh([e]) : e instanceof Array ? Mh(e) : e));
}
var Nh;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Nh || (Nh = {}));
var Ph;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ph || (Ph = {}));
var _h;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(_h || (_h = {}));
const gy = 33, dl = 32;
function K4(t) {
  if (t.length < dl * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + dl * 2), r = t.slice(2 + dl * 2);
  return {
    recoveryId: Dc(e),
    r: n,
    s: r
  };
}
function V4(t) {
  const e = typeof t == "string" ? we(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function q4(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function W4(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function X4(t, e) {
  return t[e];
}
function Y4(t, e, n = 0) {
  return t[n] = e, t;
}
function Z4(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function ti(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var yu;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(yu || (yu = {}));
const Q4 = yu.Mainnet, J4 = 128, tv = 128, yy = 16, Ds = 32, wu = 80, jc = 65, ev = 32, nv = 64, sc = 34;
var lt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(lt || (lt = {}));
var Nt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Nt || (Nt = {}));
var bu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(bu || (bu = {}));
var xn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(xn || (xn = {}));
const Ha = ["onChainOnly", "offChainOnly", "any"], Uh = {
  [Ha[0]]: xn.OnChainOnly,
  [Ha[1]]: xn.OffChainOnly,
  [Ha[2]]: xn.Any,
  [xn.OnChainOnly]: xn.OnChainOnly,
  [xn.OffChainOnly]: xn.OffChainOnly,
  [xn.Any]: xn.Any
};
function rv(t) {
  if (t in Uh)
    return Uh[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${Ha.join(", ")}`);
}
var ic;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ic || (ic = {}));
ic.Mainnet;
var Zi;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Zi || (Zi = {}));
var Sn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Sn || (Sn = {}));
var ke;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(ke || (ke = {}));
var ie;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ie || (ie = {}));
var oc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(oc || (oc = {}));
var xe;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(xe || (xe = {}));
var Ho;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ho || (Ho = {}));
var mu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(mu || (mu = {}));
var Oo;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Oo || (Oo = {}));
var Hh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Hh || (Hh = {}));
var Oh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Oh || (Oh = {}));
function xu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function sv(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function wy(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function iv(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  xu(t.outputLen), xu(t.blockLen);
}
function ov(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function av(t, e) {
  wy(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const _s = {
  number: xu,
  bool: sv,
  bytes: wy,
  hash: iv,
  exists: ov,
  output: av
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const hl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), lr = (t, e) => t << 32 - e | t >>> e, cv = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!cv)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function lv(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Mf(t) {
  if (typeof t == "string" && (t = lv(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class by {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function hi(t) {
  const e = (r) => t().update(Mf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function uv(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const i = BigInt(32), s = BigInt(4294967295), o = Number(n >> i & s), a = Number(n & s), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class Nf extends by {
  constructor(e, n, r, i) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = i, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = hl(this.buffer);
  }
  update(e) {
    _s.exists(this);
    const { view: n, buffer: r, blockLen: i } = this;
    e = Mf(e);
    const s = e.length;
    for (let o = 0; o < s; ) {
      const a = Math.min(i - this.pos, s - o);
      if (a === i) {
        const c = hl(e);
        for (; i <= s - o; o += i)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === i && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    _s.exists(this), _s.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: i, isLE: s } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > i - o && (this.process(r, 0), o = 0);
    for (let l = o; l < i; l++)
      n[l] = 0;
    uv(r, i - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = hl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], s);
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
const fv = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), my = Uint8Array.from({ length: 16 }, (t, e) => e), dv = my.map((t) => (9 * t + 5) % 16);
let Pf = [my], _f = [dv];
for (let t = 0; t < 4; t++)
  for (let e of [Pf, _f])
    e.push(e[t].map((n) => fv[n]));
const xy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), hv = Pf.map((t, e) => t.map((n) => xy[e][n])), pv = _f.map((t, e) => t.map((n) => xy[e][n])), gv = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), yv = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ea = (t, e) => t << e | t >>> 32 - e;
function Dh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Aa = new Uint32Array(16);
class wv extends Nf {
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
      Aa[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, i = r, s = this.h1 | 0, o = s, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const x = 4 - p, S = gv[p], B = yv[p], z = Pf[p], R = _f[p], A = hv[p], _ = pv[p];
      for (let N = 0; N < 16; N++) {
        const Q = Ea(r + Dh(p, s, a, u) + Aa[z[N]] + S, A[N]) + l | 0;
        r = l, l = u, u = Ea(a, 10) | 0, a = s, s = Q;
      }
      for (let N = 0; N < 16; N++) {
        const Q = Ea(i + Dh(x, o, c, f) + Aa[R[N]] + B, _[N]) + y | 0;
        i = y, y = f, f = Ea(c, 10) | 0, c = o, o = Q;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + y | 0, this.h3 + l + i | 0, this.h4 + r + o | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Aa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const bv = hi(() => new wv()), mv = (t, e, n) => t & e ^ ~t & n, xv = (t, e, n) => t & e ^ t & n ^ e & n, Sv = new Uint32Array([
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
]), ls = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), us = new Uint32Array(64);
class Sy extends Nf {
  constructor() {
    super(64, 32, 8, !1), this.A = ls[0] | 0, this.B = ls[1] | 0, this.C = ls[2] | 0, this.D = ls[3] | 0, this.E = ls[4] | 0, this.F = ls[5] | 0, this.G = ls[6] | 0, this.H = ls[7] | 0;
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
      us[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = us[l - 15], p = us[l - 2], x = lr(y, 7) ^ lr(y, 18) ^ y >>> 3, S = lr(p, 17) ^ lr(p, 19) ^ p >>> 10;
      us[l] = S + us[l - 7] + x + us[l - 16] | 0;
    }
    let { A: r, B: i, C: s, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const y = lr(a, 6) ^ lr(a, 11) ^ lr(a, 25), p = f + y + mv(a, c, u) + Sv[l] + us[l] | 0, S = (lr(r, 2) ^ lr(r, 13) ^ lr(r, 22)) + xv(r, i, s) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = s, s = i, i = r, r = p + S | 0;
    }
    r = r + this.A | 0, i = i + this.B | 0, s = s + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, i, s, o, a, c, u, f);
  }
  roundClean() {
    us.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Ev extends Sy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Uf = hi(() => new Sy());
hi(() => new Ev());
const va = BigInt(2 ** 32 - 1), Su = BigInt(32);
function Ey(t, e = !1) {
  return e ? { h: Number(t & va), l: Number(t >> Su & va) } : { h: Number(t >> Su & va) | 0, l: Number(t & va) | 0 };
}
function Av(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const { h: s, l: o } = Ey(t[i], e);
    [n[i], r[i]] = [s, o];
  }
  return [n, r];
}
const vv = (t, e) => BigInt(t >>> 0) << Su | BigInt(e >>> 0), kv = (t, e, n) => t >>> n, $v = (t, e, n) => t << 32 - n | e >>> n, Iv = (t, e, n) => t >>> n | e << 32 - n, Lv = (t, e, n) => t << 32 - n | e >>> n, Cv = (t, e, n) => t << 64 - n | e >>> n - 32, Tv = (t, e, n) => t >>> n - 32 | e << 64 - n, Bv = (t, e) => e, Mv = (t, e) => t, Nv = (t, e, n) => t << n | e >>> 32 - n, Pv = (t, e, n) => e << n | t >>> 32 - n, _v = (t, e, n) => e << n - 32 | t >>> 64 - n, Uv = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Hv(t, e, n, r) {
  const i = (e >>> 0) + (r >>> 0);
  return { h: t + n + (i / 2 ** 32 | 0) | 0, l: i | 0 };
}
const Ov = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Dv = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Fv = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), jv = (t, e, n, r, i) => e + n + r + i + (t / 2 ** 32 | 0) | 0, zv = (t, e, n, r, i) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (i >>> 0), Rv = (t, e, n, r, i, s) => e + n + r + i + s + (t / 2 ** 32 | 0) | 0, Bt = {
  fromBig: Ey,
  split: Av,
  toBig: vv,
  shrSH: kv,
  shrSL: $v,
  rotrSH: Iv,
  rotrSL: Lv,
  rotrBH: Cv,
  rotrBL: Tv,
  rotr32H: Bv,
  rotr32L: Mv,
  rotlSH: Nv,
  rotlSL: Pv,
  rotlBH: _v,
  rotlBL: Uv,
  add: Hv,
  add3L: Ov,
  add3H: Dv,
  add4L: Fv,
  add4H: jv,
  add5H: Rv,
  add5L: zv
}, [Gv, Kv] = Bt.split([
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
].map((t) => BigInt(t))), fs = new Uint32Array(80), ds = new Uint32Array(80);
class zc extends Nf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: i, Ch: s, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: y, Gh: p, Gl: x, Hh: S, Hl: B } = this;
    return [e, n, r, i, s, o, a, c, u, f, l, y, p, x, S, B];
  }
  // prettier-ignore
  set(e, n, r, i, s, o, a, c, u, f, l, y, p, x, S, B) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = i | 0, this.Ch = s | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = B | 0;
  }
  process(e, n) {
    for (let A = 0; A < 16; A++, n += 4)
      fs[A] = e.getUint32(n), ds[A] = e.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const _ = fs[A - 15] | 0, N = ds[A - 15] | 0, Q = Bt.rotrSH(_, N, 1) ^ Bt.rotrSH(_, N, 8) ^ Bt.shrSH(_, N, 7), tt = Bt.rotrSL(_, N, 1) ^ Bt.rotrSL(_, N, 8) ^ Bt.shrSL(_, N, 7), G = fs[A - 2] | 0, V = ds[A - 2] | 0, I = Bt.rotrSH(G, V, 19) ^ Bt.rotrBH(G, V, 61) ^ Bt.shrSH(G, V, 6), P = Bt.rotrSL(G, V, 19) ^ Bt.rotrBL(G, V, 61) ^ Bt.shrSL(G, V, 6), b = Bt.add4L(tt, P, ds[A - 7], ds[A - 16]), T = Bt.add4H(b, Q, I, fs[A - 7], fs[A - 16]);
      fs[A] = T | 0, ds[A] = b | 0;
    }
    let { Ah: r, Al: i, Bh: s, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: y, Fh: p, Fl: x, Gh: S, Gl: B, Hh: z, Hl: R } = this;
    for (let A = 0; A < 80; A++) {
      const _ = Bt.rotrSH(l, y, 14) ^ Bt.rotrSH(l, y, 18) ^ Bt.rotrBH(l, y, 41), N = Bt.rotrSL(l, y, 14) ^ Bt.rotrSL(l, y, 18) ^ Bt.rotrBL(l, y, 41), Q = l & p ^ ~l & S, tt = y & x ^ ~y & B, G = Bt.add5L(R, N, tt, Kv[A], ds[A]), V = Bt.add5H(G, z, _, Q, Gv[A], fs[A]), I = G | 0, P = Bt.rotrSH(r, i, 28) ^ Bt.rotrBH(r, i, 34) ^ Bt.rotrBH(r, i, 39), b = Bt.rotrSL(r, i, 28) ^ Bt.rotrBL(r, i, 34) ^ Bt.rotrBL(r, i, 39), T = r & s ^ r & a ^ s & a, D = i & o ^ i & c ^ o & c;
      z = S | 0, R = B | 0, S = p | 0, B = x | 0, p = l | 0, x = y | 0, { h: l, l: y } = Bt.add(u | 0, f | 0, V | 0, I | 0), u = a | 0, f = c | 0, a = s | 0, c = o | 0, s = r | 0, o = i | 0;
      const C = Bt.add3L(I, b, D);
      r = Bt.add3H(C, V, P, T), i = C | 0;
    }
    ({ h: r, l: i } = Bt.add(this.Ah | 0, this.Al | 0, r | 0, i | 0)), { h: s, l: o } = Bt.add(this.Bh | 0, this.Bl | 0, s | 0, o | 0), { h: a, l: c } = Bt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Bt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: y } = Bt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: x } = Bt.add(this.Fh | 0, this.Fl | 0, p | 0, x | 0), { h: S, l: B } = Bt.add(this.Gh | 0, this.Gl | 0, S | 0, B | 0), { h: z, l: R } = Bt.add(this.Hh | 0, this.Hl | 0, z | 0, R | 0), this.set(r, i, s, o, a, c, u, f, l, y, p, x, S, B, z, R);
  }
  roundClean() {
    fs.fill(0), ds.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class Vv extends zc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class qv extends zc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class Wv extends zc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
hi(() => new zc());
hi(() => new Vv());
const Xv = hi(() => new qv());
hi(() => new Wv());
function Ay(t) {
  if (we(t).byteLength != jc)
    throw Error("Invalid signature");
  return {
    type: lt.MessageSignature,
    data: t
  };
}
function Ao(t, e) {
  return { type: lt.Address, version: t, hash160: e };
}
function Mi(t) {
  return ui.c32address(t.version, t.hash160);
}
function ei(t, e, n) {
  const r = e || 1, i = n || J4;
  if (Fy(t, i))
    throw new Error(`String length exceeds maximum bytes ${i}`);
  return {
    type: lt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: i
  };
}
function Hf(t) {
  const e = ui.c32addressDecode(t);
  return {
    type: lt.Address,
    version: e[0],
    hash160: e[1]
  };
}
var Y;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Y || (Y = {}));
function Yv(t) {
  if (t.type === Y.PrincipalStandard)
    return Mi(t.address);
  if (t.type === Y.PrincipalContract)
    return `${Mi(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function vy(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Jv(e, n);
  } else
    return Zv(t);
}
function Zv(t) {
  const e = Hf(t);
  return { type: Y.PrincipalStandard, address: e };
}
function Qv(t) {
  return { type: Y.PrincipalStandard, address: t };
}
function Jv(t, e) {
  const n = Hf(t), r = ei(e);
  return ky(n, r);
}
function ky(t, e) {
  if (ao(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: Y.PrincipalContract, address: t, contractName: e };
}
function pl(t, e = !1) {
  switch (t.type) {
    case Y.BoolTrue:
      return !0;
    case Y.BoolFalse:
      return !1;
    case Y.Int:
    case Y.UInt:
      return e ? t.value.toString() : t.value;
    case Y.Buffer:
      return `0x${_t(t.buffer)}`;
    case Y.OptionalNone:
      return null;
    case Y.OptionalSome:
      return hr(t.value);
    case Y.ResponseErr:
      return hr(t.value);
    case Y.ResponseOk:
      return hr(t.value);
    case Y.PrincipalStandard:
    case Y.PrincipalContract:
      return Yv(t);
    case Y.List:
      return t.list.map((r) => hr(r));
    case Y.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = hr(t.data[r]);
      }), n;
    case Y.StringASCII:
      return t.data;
    case Y.StringUTF8:
      return t.data;
  }
}
function hr(t) {
  switch (t.type) {
    case Y.ResponseErr:
      return { type: gs(t), value: pl(t, !0), success: !1 };
    case Y.ResponseOk:
      return { type: gs(t), value: pl(t, !0), success: !0 };
    default:
      return { type: gs(t), value: pl(t, !0) };
  }
}
function gs(t) {
  switch (t.type) {
    case Y.BoolTrue:
    case Y.BoolFalse:
      return "bool";
    case Y.Int:
      return "int";
    case Y.UInt:
      return "uint";
    case Y.Buffer:
      return `(buff ${t.buffer.length})`;
    case Y.OptionalNone:
      return "(optional none)";
    case Y.OptionalSome:
      return `(optional ${gs(t.value)})`;
    case Y.ResponseErr:
      return `(response UnknownType ${gs(t.value)})`;
    case Y.ResponseOk:
      return `(response ${gs(t.value)} UnknownType)`;
    case Y.PrincipalStandard:
    case Y.PrincipalContract:
      return "principal";
    case Y.List:
      return `(list ${t.list.length} ${t.list.length ? gs(t.list[0]) : "UnknownType"})`;
    case Y.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${gs(t.data[e])})`).join(" ")})`;
    case Y.StringASCII:
      return `(string-ascii ${py(t.data).length})`;
    case Y.StringUTF8:
      return `(string-utf8 ${ao(t.data).length})`;
  }
}
const $y = () => ({ type: Y.BoolTrue }), Iy = () => ({ type: Y.BoolFalse }), t8 = (t) => t ? $y() : Iy(), Fh = BigInt("0xffffffffffffffffffffffffffffffff"), e8 = BigInt(0), jh = BigInt("0x7fffffffffffffffffffffffffffffff"), zh = BigInt("-170141183460469231731687303715884105728"), n8 = (t) => {
  const e = fn(t, !0);
  if (e > jh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${jh}`);
  if (e < zh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${zh}`);
  return { type: Y.Int, value: e };
}, wr = (t) => {
  const e = fn(t, !1);
  if (e < e8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Fh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Fh}`);
  return { type: Y.UInt, value: e };
}, Ly = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Y.Buffer, buffer: t };
};
function Cy() {
  return { type: Y.OptionalNone };
}
function Ty(t) {
  return { type: Y.OptionalSome, value: t };
}
function r8(t) {
  return { type: Y.ResponseErr, value: t };
}
function s8(t) {
  return { type: Y.ResponseOk, value: t };
}
function i8(t) {
  return { type: Y.List, list: t };
}
function ni(t) {
  for (const e in t)
    if (!W8(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Y.Tuple, data: t };
}
const Xe = (t) => ({ type: Y.StringASCII, data: t }), o8 = (t) => ({ type: Y.StringUTF8, data: t });
class By extends by {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, _s.hash(e);
    const r = Mf(n);
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
    const { oHash: n, iHash: r, finished: i, destroyed: s, blockLen: o, outputLen: a } = this;
    return e = e, e.finished = i, e.destroyed = s, e.blockLen = o, e.outputLen = a, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const My = (t, e, n) => new By(t, e).update(n).digest();
My.create = (t, e) => new By(t, e);
$e.hmacSha256Sync = (t, ...e) => {
  const n = My.create(Uf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Qi(t) {
  return {
    type: lt.PublicKey,
    data: we(t)
  };
}
function a8(t, e, n = xe.Compressed) {
  const r = K4(e.data), i = new Nn(Bh(r.r), Bh(r.s)), s = Pt.fromSignature(t, i, r.recoveryId), o = n === xe.Compressed;
  return s.toHex(o);
}
function c8(t) {
  return { type: lt.PublicKey, data: t };
}
function co(t) {
  return !_t(t.data).startsWith("04");
}
function ac(t) {
  return t.data.slice();
}
function l8(t) {
  const e = d8(t), n = Go(e.data.slice(0, 32), e.compressed);
  return Qi(_t(n));
}
function u8(t) {
  const e = typeof t == "string" ? t : _t(t), n = Pt.fromHex(e).toHex(!0);
  return Qi(n);
}
function f8(t) {
  const e = typeof t == "string" ? t : _t(t), n = Pt.fromHex(e).toHex(!1);
  return Qi(n);
}
function Eu(t) {
  const e = t.readUInt8(), n = e === 4 ? nv : ev;
  return c8(Te([e, t.readBytes(n)]));
}
function d8(t) {
  const e = V4(t), n = e.length == gy;
  return { data: e, compressed: n };
}
function h8(t, e) {
  const [n, r] = xc(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const s = Xo(r, 1) + Nn.fromHex(n).toCompactHex();
  return Ay(s);
}
function p8(t) {
  return l8(t.data);
}
function g8(t, e, n) {
  return typeof t == "string" && (t = vy(t)), typeof n == "string" && (n = Kh(n)), {
    type: lt.Payload,
    payloadType: Nt.TokenTransfer,
    recipient: t,
    amount: fn(e, !1),
    memo: n ?? Kh("")
  };
}
function y8(t, e, n, r) {
  return typeof t == "string" && (t = Hf(t)), typeof e == "string" && (e = ei(e)), typeof n == "string" && (n = ei(n)), {
    type: lt.Payload,
    payloadType: Nt.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Rh(t, e, n) {
  return typeof t == "string" && (t = ei(t)), typeof e == "string" && (e = k8(e)), typeof n == "number" ? {
    type: lt.Payload,
    payloadType: Nt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: lt.Payload,
    payloadType: Nt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function w8() {
  return { type: lt.Payload, payloadType: Nt.PoisonMicroblock };
}
function Gh(t, e) {
  if (t.byteLength != Ds)
    throw Error(`Coinbase buffer size must be ${Ds} bytes`);
  return e != null ? {
    type: lt.Payload,
    payloadType: Nt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: lt.Payload,
    payloadType: Nt.Coinbase,
    coinbaseBytes: t
  };
}
function b8(t, e, n) {
  if (t.byteLength != Ds)
    throw Error(`Coinbase buffer size must be ${Ds} bytes`);
  if (n.byteLength != wu)
    throw Error(`VRF proof buffer size must be ${wu} bytes`);
  return {
    type: lt.Payload,
    payloadType: Nt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Y.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Au;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Au || (Au = {}));
function m8(t, e, n, r, i, s, o) {
  return {
    type: lt.Payload,
    payloadType: Nt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: i,
    cause: s,
    publicKeyHash: o
  };
}
function Ny(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Nt.TokenTransfer:
      e.push(Le(t.recipient)), e.push(Es(t.amount, !1, 8)), e.push(Nr(t.memo));
      break;
    case Nt.ContractCall:
      e.push(Nr(t.contractAddress)), e.push(Nr(t.contractName)), e.push(Nr(t.functionName));
      const n = new Uint8Array(4);
      ti(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Le(r));
      });
      break;
    case Nt.SmartContract:
      e.push(Nr(t.contractName)), e.push(Nr(t.codeBody));
      break;
    case Nt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Nr(t.contractName)), e.push(Nr(t.codeBody));
      break;
    case Nt.PoisonMicroblock:
      break;
    case Nt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Nt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Le(t.recipient));
      break;
    case Nt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Le(t.recipient ? Ty(t.recipient) : Cy())), e.push(t.vrfProof);
      break;
    case Nt.TenureChange:
      e.push(we(t.tenureHash)), e.push(we(t.previousTenureHash)), e.push(we(t.burnViewHash)), e.push(we(t.previousTenureEnd)), e.push(ti(new Uint8Array(4), t.previousTenureBlocks)), e.push(Y4(new Uint8Array(1), t.cause)), e.push(we(t.publicKeyHash));
      break;
  }
  return Te(e);
}
function x8(t) {
  switch (t.readUInt8Enum(Nt, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Nt.TokenTransfer:
      const n = Kn(t), r = fn(t.readBytes(8), !1), i = _y(t);
      return g8(n, r, i);
    case Nt.ContractCall:
      const s = Ji(t), o = Gn(t), a = Gn(t), c = [], u = t.readUInt32BE();
      for (let A = 0; A < u; A++) {
        const _ = Kn(t);
        c.push(_);
      }
      return y8(s, o, a, c);
    case Nt.SmartContract:
      const f = Gn(t), l = Gn(t, 4, 1e5);
      return Rh(f, l);
    case Nt.VersionedSmartContract: {
      const A = t.readUInt8Enum(bu, (Q) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Q}`);
      }), _ = Gn(t), N = Gn(t, 4, 1e5);
      return Rh(_, N, A);
    }
    case Nt.PoisonMicroblock:
      return w8();
    case Nt.Coinbase: {
      const A = t.readBytes(Ds);
      return Gh(A);
    }
    case Nt.CoinbaseToAltRecipient: {
      const A = t.readBytes(Ds), _ = Kn(t);
      return Gh(A, _);
    }
    case Nt.NakamotoCoinbase: {
      const A = t.readBytes(Ds), _ = Kn(t), N = t.readBytes(wu);
      return b8(A, _, N);
    }
    case Nt.TenureChange:
      const y = _t(t.readBytes(20)), p = _t(t.readBytes(20)), x = _t(t.readBytes(20)), S = _t(t.readBytes(32)), B = t.readUInt32BE(), z = t.readUInt8Enum(Au, (A) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${A}`);
      }), R = _t(t.readBytes(20));
      return m8(y, p, x, S, B, z, R);
  }
}
class Rc extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Ts extends Rc {
  constructor(e) {
    super(e);
  }
}
class Mn extends Rc {
  constructor(e) {
    super(e);
  }
}
class cc extends Rc {
  constructor(e) {
    super(e);
  }
}
class Us extends Rc {
  constructor(e) {
    super(e);
  }
}
var Jn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Jn || (Jn = {}));
function vu(t) {
  return Ay(_t(t.readBytes(jc)));
}
function Ni(t, e) {
  return {
    pubKeyEncoding: t,
    type: lt.TransactionAuthField,
    contents: e
  };
}
function S8(t) {
  const e = t.readUInt8Enum(Jn, (n) => {
    throw new Mn(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case Jn.PublicKeyCompressed:
      return Ni(xe.Compressed, Eu(t));
    case Jn.PublicKeyUncompressed:
      return Ni(xe.Uncompressed, f8(Eu(t).data));
    case Jn.SignatureCompressed:
      return Ni(xe.Compressed, vu(t));
    case Jn.SignatureUncompressed:
      return Ni(xe.Uncompressed, vu(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function Of(t) {
  return we(t.data);
}
function E8(t) {
  const e = [];
  switch (t.contents.type) {
    case lt.PublicKey:
      e.push(t.pubKeyEncoding === xe.Compressed ? Jn.PublicKeyCompressed : Jn.PublicKeyUncompressed), e.push(ac(u8(t.contents.data)));
      break;
    case lt.MessageSignature:
      e.push(t.pubKeyEncoding === xe.Compressed ? Jn.SignatureCompressed : Jn.SignatureUncompressed), e.push(Of(t.contents));
      break;
  }
  return Te(e);
}
function Nr(t) {
  switch (t.type) {
    case lt.Address:
      return Yo(t);
    case lt.Principal:
      return Py(t);
    case lt.LengthPrefixedString:
      return to(t);
    case lt.MemoString:
      return $8(t);
    case lt.AssetInfo:
      return Uy(t);
    case lt.PostCondition:
      return I8(t);
    case lt.PublicKey:
      return ac(t);
    case lt.LengthPrefixedList:
      return jf(t);
    case lt.Payload:
      return Ny(t);
    case lt.TransactionAuthField:
      return E8(t);
    case lt.MessageSignature:
      return Of(t);
  }
}
function A8() {
  return {
    type: lt.Address,
    version: oc.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Df(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ie.SerializeP2PKH || e === ie.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ie.SerializeP2WPKH || e === ie.SerializeP2WSH || e === ie.SerializeP2WSHNonSequential) && !r.every(co))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ie.SerializeP2PKH:
      return Ao(t, G8(r[0].data));
    case ie.SerializeP2WPKH:
      return Ao(t, K8(r[0].data));
    case ie.SerializeP2SH:
    case ie.SerializeP2SHNonSequential:
      return Ao(t, V8(n, r.map(ac)));
    case ie.SerializeP2WSH:
    case ie.SerializeP2WSHNonSequential:
      return Ao(t, q8(n, r.map(ac)));
  }
}
function Yo(t) {
  const e = [];
  return e.push(we(Xo(t.version, 1))), e.push(we(t.hash160)), Te(e);
}
function Ji(t) {
  const e = Dc(_t(t.readBytes(1))), n = _t(t.readBytes(20));
  return { type: lt.Address, version: e, hash160: n };
}
function Py(t) {
  const e = [];
  return e.push(t.prefix), e.push(Yo(t.address)), t.prefix === Oo.Contract && e.push(to(t.contractName)), Te(e);
}
function v8(t) {
  const e = t.readUInt8Enum(Oo, (i) => {
    throw new Mn(`Unexpected Principal payload type: ${i}`);
  }), n = Ji(t);
  if (e === Oo.Standard)
    return { type: lt.Principal, prefix: e, address: n };
  const r = Gn(t);
  return {
    type: lt.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function to(t) {
  const e = [], n = ao(t.content), r = n.byteLength;
  return e.push(we(Xo(r, t.lengthPrefixBytes))), e.push(n), Te(e);
}
function Gn(t, e, n) {
  e = e || 1;
  const r = Dc(_t(t.readBytes(e))), i = Bf(t.readBytes(r));
  return ei(i, e, n ?? 128);
}
function k8(t) {
  return ei(t, 4, 1e5);
}
function Kh(t) {
  if (t && Fy(t, sc))
    throw new Error(`Memo exceeds maximum length of ${sc} bytes`);
  return { type: lt.MemoString, content: t };
}
function $8(t) {
  const e = [], n = ao(t.content), r = R8(_t(n), sc * 2);
  return e.push(we(r)), Te(e);
}
function _y(t) {
  let e = Bf(t.readBytes(sc));
  return e = e.replace(/\u0000*$/, ""), { type: lt.MemoString, content: e };
}
function Uy(t) {
  const e = [];
  return e.push(Yo(t.address)), e.push(to(t.contractName)), e.push(to(t.assetName)), Te(e);
}
function ku(t) {
  return {
    type: lt.AssetInfo,
    address: Ji(t),
    contractName: Gn(t),
    assetName: Gn(t)
  };
}
function Ff(t, e) {
  return {
    type: lt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function jf(t) {
  const e = t.values, n = [];
  n.push(we(Xo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Nr(r));
  return Te(n);
}
function Hy(t, e, n) {
  const r = Dc(_t(t.readBytes(4))), i = [];
  for (let s = 0; s < r; s++)
    switch (e) {
      case lt.Address:
        i.push(Ji(t));
        break;
      case lt.LengthPrefixedString:
        i.push(Gn(t));
        break;
      case lt.MemoString:
        i.push(_y(t));
        break;
      case lt.AssetInfo:
        i.push(ku(t));
        break;
      case lt.PostCondition:
        i.push(L8(t));
        break;
      case lt.PublicKey:
        i.push(Eu(t));
        break;
      case lt.TransactionAuthField:
        i.push(S8(t));
        break;
    }
  return Ff(i, n);
}
function I8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Py(t.principal)), (t.conditionType === Sn.Fungible || t.conditionType === Sn.NonFungible) && e.push(Uy(t.assetInfo)), t.conditionType === Sn.NonFungible && e.push(Le(t.assetName)), e.push(t.conditionCode), t.conditionType === Sn.STX || t.conditionType === Sn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ts("The post-condition amount may not be larger than 8 bytes");
    e.push(Es(t.amount, !1, 8));
  }
  return Te(e);
}
function L8(t) {
  const e = t.readUInt8Enum(Sn, (o) => {
    throw new Mn(`Could not read ${o} as PostConditionType`);
  }), n = v8(t);
  let r, i, s;
  switch (e) {
    case Sn.STX:
      return r = t.readUInt8Enum(Ho, (a) => {
        throw new Mn(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${_t(t.readBytes(8))}`), {
        type: lt.PostCondition,
        conditionType: Sn.STX,
        principal: n,
        conditionCode: r,
        amount: s
      };
    case Sn.Fungible:
      return i = ku(t), r = t.readUInt8Enum(Ho, (a) => {
        throw new Mn(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${_t(t.readBytes(8))}`), {
        type: lt.PostCondition,
        conditionType: Sn.Fungible,
        principal: n,
        conditionCode: r,
        amount: s,
        assetInfo: i
      };
    case Sn.NonFungible:
      i = ku(t);
      const o = Kn(t);
      return r = t.readUInt8Enum(mu, (a) => {
        throw new Mn(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: lt.PostCondition,
        conditionType: Sn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: i,
        assetName: o
      };
  }
}
function Er(t, e) {
  return Te([t, e]);
}
function C8(t) {
  return new Uint8Array([t.type]);
}
function T8(t) {
  return t.type === Y.OptionalNone ? new Uint8Array([t.type]) : Er(t.type, Le(t.value));
}
function B8(t) {
  const e = new Uint8Array(4);
  return ti(e, t.buffer.length, 0), Er(t.type, Fc(e, t.buffer));
}
function M8(t) {
  const e = Tf(D4(t.value, BigInt(tv)), yy);
  return Er(t.type, e);
}
function N8(t) {
  const e = Tf(t.value, yy);
  return Er(t.type, e);
}
function P8(t) {
  return Er(t.type, Yo(t.address));
}
function _8(t) {
  return Er(t.type, Fc(Yo(t.address), to(t.contractName)));
}
function U8(t) {
  return Er(t.type, Le(t.value));
}
function H8(t) {
  const e = [], n = new Uint8Array(4);
  ti(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const i = Le(r);
    e.push(i);
  }
  return Er(t.type, Te(e));
}
function O8(t) {
  const e = [], n = new Uint8Array(4);
  ti(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((i, s) => i.localeCompare(s));
  for (const i of r) {
    const s = ei(i);
    e.push(to(s));
    const o = Le(t.data[i]);
    e.push(o);
  }
  return Er(t.type, Te(e));
}
function Oy(t, e) {
  const n = [], r = e == "ascii" ? py(t.data) : ao(t.data), i = new Uint8Array(4);
  return ti(i, r.length, 0), n.push(i), n.push(r), Er(t.type, Te(n));
}
function D8(t) {
  return Oy(t, "ascii");
}
function F8(t) {
  return Oy(t, "utf8");
}
function Le(t) {
  switch (t.type) {
    case Y.BoolTrue:
    case Y.BoolFalse:
      return C8(t);
    case Y.OptionalNone:
    case Y.OptionalSome:
      return T8(t);
    case Y.Buffer:
      return B8(t);
    case Y.UInt:
      return N8(t);
    case Y.Int:
      return M8(t);
    case Y.PrincipalStandard:
      return P8(t);
    case Y.PrincipalContract:
      return _8(t);
    case Y.ResponseOk:
    case Y.ResponseErr:
      return U8(t);
    case Y.List:
      return H8(t);
    case Y.Tuple:
      return O8(t);
    case Y.StringASCII:
      return D8(t);
    case Y.StringUTF8:
      return F8(t);
    default:
      throw new Ts("Unable to serialize. Invalid Clarity Value.");
  }
}
function j8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Vh = /* @__PURE__ */ new Map();
function Dy(t, e) {
  const n = Vh.get(t);
  if (n !== void 0)
    return n(e);
  const r = j8(t);
  return Vh.set(t, r), Dy(t, e);
}
class Lo {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Z4(this.readBytes(4), 0);
  }
  readUInt8() {
    return X4(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return q4(this.readBytes(2), 0);
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
    if (Dy(e, r))
      return r;
    throw n(r);
  }
}
function Kn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Lo(we(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Lo(t) : e = t;
  switch (e.readUInt8Enum(Y, (r) => {
    throw new Mn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Y.Int:
      return n8(e.readBytes(16));
    case Y.UInt:
      return wr(e.readBytes(16));
    case Y.Buffer:
      const r = e.readUInt32BE();
      return Ly(e.readBytes(r));
    case Y.BoolTrue:
      return $y();
    case Y.BoolFalse:
      return Iy();
    case Y.PrincipalStandard:
      const i = Ji(e);
      return Qv(i);
    case Y.PrincipalContract:
      const s = Ji(e), o = Gn(e);
      return ky(s, o);
    case Y.ResponseOk:
      return s8(Kn(e));
    case Y.ResponseErr:
      return r8(Kn(e));
    case Y.OptionalNone:
      return Cy();
    case Y.OptionalSome:
      return Ty(Kn(e));
    case Y.List:
      const a = e.readUInt32BE(), c = [];
      for (let S = 0; S < a; S++)
        c.push(Kn(e));
      return i8(c);
    case Y.Tuple:
      const u = e.readUInt32BE(), f = {};
      for (let S = 0; S < u; S++) {
        const B = Gn(e).content;
        if (B === void 0)
          throw new Mn('"content" is undefined');
        f[B] = Kn(e);
      }
      return ni(f);
    case Y.StringASCII:
      const l = e.readUInt32BE(), y = R4(e.readBytes(l));
      return Xe(y);
    case Y.StringUTF8:
      const p = e.readUInt32BE(), x = Bf(e.readBytes(p));
      return o8(x);
    default:
      throw new Mn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const z8 = (t) => t.length % 2 == 0 ? t : `0${t}`, R8 = (t, e) => t.padEnd(e, "0"), Fy = (t, e) => t ? ao(t).length > e : !1;
function $u(t) {
  return ig(t);
}
const Do = (t) => bv(Uf(t)), zf = (t) => _t(Xv(t)), G8 = (t) => _t(Do(t)), K8 = (t) => {
  const e = Do(t), n = Fc(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Do(n);
  return _t(r);
}, V8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + e.length), n.push(174);
  const r = Te(n), i = Do(r);
  return _t(i);
}, q8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Te(n), i = Uf(r), s = [];
  s.push(0), s.push(i.length), s.push(i);
  const o = Te(s), a = Do(o);
  return _t(a);
};
function W8(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function jy(t) {
  const e = Le(t);
  return `0x${_t(e)}`;
}
function X8(t) {
  return Kn(t);
}
const Ui = (t) => {
  try {
    return ui.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Rf() {
  return {
    type: lt.MessageSignature,
    data: _t(new Uint8Array(jc))
  };
}
function zy(t, e, n, r) {
  const i = Df(0, t, 1, [Qi(e)]).hash160, s = co(Qi(e)) ? xe.Compressed : xe.Uncompressed;
  return {
    hashMode: t,
    signer: i,
    nonce: fn(n, !1),
    fee: fn(r, !1),
    keyEncoding: s,
    signature: Rf()
  };
}
function Fo(t) {
  return "signature" in t;
}
function qh(t) {
  return t === ie.SerializeP2SH || t === ie.SerializeP2WSH;
}
function Y8(t) {
  return t === ie.SerializeP2SHNonSequential || t === ie.SerializeP2WSHNonSequential;
}
function Wh(t) {
  const e = $u(t);
  return e.nonce = 0, e.fee = 0, Fo(e) ? e.signature = Rf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function Z8(t) {
  const e = [
    t.hashMode,
    we(t.signer),
    Es(t.nonce, !1, 8),
    Es(t.fee, !1, 8),
    t.keyEncoding,
    Of(t.signature)
  ];
  return Te(e);
}
function Q8(t) {
  const e = [
    t.hashMode,
    we(t.signer),
    Es(t.nonce, !1, 8),
    Es(t.fee, !1, 8)
  ], n = Ff(t.fields);
  e.push(jf(n));
  const r = new Uint8Array(2);
  return W4(r, t.signaturesRequired, 0), e.push(r), Te(e);
}
function J8(t, e) {
  const n = _t(e.readBytes(20)), r = BigInt(`0x${_t(e.readBytes(8))}`), i = BigInt(`0x${_t(e.readBytes(8))}`), s = e.readUInt8Enum(xe, (a) => {
    throw new Mn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ie.SerializeP2WPKH && s != xe.Compressed)
    throw new Mn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = vu(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    keyEncoding: s,
    signature: o
  };
}
function t5(t, e) {
  const n = _t(e.readBytes(20)), r = BigInt("0x" + _t(e.readBytes(8))), i = BigInt("0x" + _t(e.readBytes(8))), s = Hy(e, lt.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of s)
    switch (u.contents.type) {
      case lt.PublicKey:
        co(u.contents) || (o = !0);
        break;
      case lt.MessageSignature:
        if (u.pubKeyEncoding === xe.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Us("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ie.SerializeP2WSH || t === ie.SerializeP2WSHNonSequential))
    throw new Us("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: i,
    fields: s,
    signaturesRequired: c
  };
}
function gl(t) {
  return Fo(t) ? Z8(t) : Q8(t);
}
function yl(t) {
  const e = t.readUInt8Enum(ie, (n) => {
    throw new Mn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ie.SerializeP2PKH || e === ie.SerializeP2WPKH ? J8(e, t) : t5(e, t);
}
function Ry(t, e, n, r) {
  const s = t + _t(new Uint8Array([e])) + _t(Es(n, !1, 8)) + _t(Es(r, !1, 8));
  if (we(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return zf(we(s));
}
function Gy(t, e, n) {
  const r = 33 + jc, i = co(e) ? xe.Compressed : xe.Uncompressed, s = t + z8(i.toString(16)) + n.data, o = we(s);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return zf(o);
}
function e5(t, e, n, r, i) {
  const s = Ry(t, e, n, r), o = h8(i, s), a = p8(i), c = Gy(s, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Ky(t, e, n, r, i, s) {
  const o = Ry(t, e, n, r), a = Qi(a8(o, s, i)), c = Gy(o, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function n5() {
  const t = zy(ie.SerializeP2PKH, "", 0, 0);
  return t.signer = A8().hash160, t.keyEncoding = xe.Compressed, t.signature = Rf(), t;
}
function Xh(t, e, n) {
  return Fo(t) ? r5(t, e, n) : s5(t, e, n);
}
function r5(t, e, n) {
  const { pubKey: r, nextSigHash: i } = Ky(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), s = Df(0, t.hashMode, 1, [r]).hash160;
  if (s !== t.signer)
    throw new Us(`Signer hash does not equal hash of public key(s): ${s} != ${t.signer}`);
  return i;
}
function s5(t, e, n) {
  const r = [];
  let i = e, s = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case lt.PublicKey:
        co(c.contents) || (s = !0), r.push(c.contents);
        break;
      case lt.MessageSignature:
        c.pubKeyEncoding === xe.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: f } = Ky(i, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (qh(t.hashMode) && (i = f), r.push(u), o += 1, o === 65536)
          throw new Us("Too many signatures");
        break;
    }
  if (qh(t.hashMode) && o !== t.signaturesRequired || Y8(t.hashMode) && o < t.signaturesRequired)
    throw new Us("Incorrect number of signatures");
  if (s && (t.hashMode === ie.SerializeP2WSH || t.hashMode === ie.SerializeP2WSHNonSequential))
    throw new Us("Uncompressed keys are not allowed in this hash mode");
  const a = Df(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Us(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return i;
}
function Vy(t) {
  return {
    authType: ke.Standard,
    spendingCondition: t
  };
}
function qy(t, e) {
  return {
    authType: ke.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || zy(ie.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Yh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case ke.Standard:
        return Vy(Wh(t.spendingCondition));
      case ke.Sponsored:
        return qy(Wh(t.spendingCondition), n5());
      default:
        throw new cc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function i5(t, e) {
  switch (t.authType) {
    case ke.Standard:
      return Xh(t.spendingCondition, e, ke.Standard);
    case ke.Sponsored:
      return Xh(t.spendingCondition, e, ke.Standard);
    default:
      throw new cc("Invalid origin auth type");
  }
}
function o5(t, e) {
  switch (t.authType) {
    case ke.Standard:
      const n = {
        ...t.spendingCondition,
        fee: fn(e, !1)
      };
      return { ...t, spendingCondition: n };
    case ke.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: fn(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function a5(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: fn(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function c5(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: fn(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function l5(t, e) {
  const n = {
    ...e,
    nonce: fn(e.nonce, !1),
    fee: fn(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function u5(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case ke.Standard:
      e.push(gl(t.spendingCondition));
      break;
    case ke.Sponsored:
      e.push(gl(t.spendingCondition)), e.push(gl(t.sponsorSpendingCondition));
      break;
  }
  return Te(e);
}
function f5(t) {
  const e = t.readUInt8Enum(ke, (r) => {
    throw new Mn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case ke.Standard:
      return n = yl(t), Vy(n);
    case ke.Sponsored:
      n = yl(t);
      const r = yl(t);
      return qy(n, r);
  }
}
class d5 {
  constructor(e, n, r, i, s, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: fn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? Q4, this.postConditionMode = s ?? Zi.Deny, this.postConditions = i ?? Ff([]), o)
      this.anchorMode = rv(o);
    else
      switch (r.payloadType) {
        case Nt.Coinbase:
        case Nt.CoinbaseToAltRecipient:
        case Nt.NakamotoCoinbase:
        case Nt.PoisonMicroblock:
        case Nt.TenureChange:
          this.anchorMode = xn.OnChainOnly;
          break;
        case Nt.ContractCall:
        case Nt.SmartContract:
        case Nt.VersionedSmartContract:
        case Nt.TokenTransfer:
          this.anchorMode = xn.Any;
          break;
      }
  }
  signBegin() {
    const e = $u(this);
    return e.auth = Yh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = $u(this);
    return e.auth = Yh(e.auth), e.txid();
  }
  verifyOrigin() {
    return i5(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, ke.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === ke.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, ke.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !Fo(n)) {
      const r = co(e);
      n.fields.push(Ni(r ? xe.Compressed : xe.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, i) {
    const { nextSig: s, nextSigHash: o } = e5(n, r, e.fee, e.nonce, i);
    return Fo(e) ? e.signature = s : e.fields.push(Ni(i.data.byteLength === gy ? xe.Compressed : xe.Uncompressed, s)), o;
  }
  txid() {
    const e = this.serialize();
    return zf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != ke.Sponsored)
      throw new cc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = l5(this.auth, e);
  }
  setFee(e) {
    this.auth = o5(this.auth, e);
  }
  setNonce(e) {
    this.auth = a5(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != ke.Sponsored)
      throw new cc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = c5(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Ts('"version" is undefined');
    if (this.chainId === void 0)
      throw new Ts('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ts('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Ts('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Ts('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return ti(n, this.chainId, 0), e.push(n), e.push(u5(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(jf(this.postConditions)), e.push(Ny(this.payload)), Te(e);
  }
}
function lc(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Lo(we(t.slice(2))) : e = new Lo(we(t)) : t instanceof Uint8Array ? e = new Lo(t) : e = t;
  const n = e.readUInt8Enum(ic, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), i = f5(e), s = e.readUInt8Enum(xn, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(Zi, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = Hy(e, lt.PostCondition), c = x8(e);
  return new d5(n, i, c, a, o, s, r);
}
const h5 = t8, Co = wr, p5 = Ly;
const g5 = /* @__PURE__ */ new Set([4001, -31001]), y5 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], w5 = ["result", "data", "payload", "response", "params"], Zh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Gc = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), pi = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Ur = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, b5 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Wy = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, i) => !!(r != null && r.id) && n.findIndex((s) => b5(s, r)) === i
  );
}, Xy = (t) => t ? Wy(pi()).some(
  (e) => {
    var n;
    return e.id === t && (Gc(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Yy = () => {
  if (typeof window > "u")
    return;
  const t = pi(), e = Wy(t).filter(
    (n) => {
      var r;
      return Gc(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Ur(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of y5) {
    const r = Ur(t, n) ?? (t === window ? void 0 : Ur(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, m5 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = pi(), n = Ur(e, t) ?? (e === window ? void 0 : Ur(window, t)) ?? Tc(t);
  if (n)
    return n;
  if (Gc(t) || Xy(t))
    return Yy();
}, ka = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, x5 = ["blockstack-session", "blockstack"], S5 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of x5) {
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
S5();
const Zy = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Tn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, E5 = (t) => {
  const e = Tn(t);
  if (!e)
    return null;
  const n = Zy(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, A5 = (t) => {
  const e = Tn(t);
  if (!e)
    return null;
  const n = Zy(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Iu = (t, e = "mainnet") => {
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
      return Iu(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Iu(r, e);
  }
  return e;
}, Fs = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, jo = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const i = t.trim();
    return Ui(i) ? i : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const i of t) {
      const s = jo(i, e + 1);
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
    const s = jo(n[i], e + 1);
    if (s)
      return s;
  }
  return typeof n.mainnet == "string" && Ui(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Ui(n.testnet) ? n.testnet.trim() : null;
}, Qh = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Qy = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && g5.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, ri = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Tn(n == null ? void 0 : n.message) ?? Tn(e.message) ?? Tn(e.error) ?? Tn(t) ?? "Wallet provider request failed.", i = new Error(r);
  return i.code = (n == null ? void 0 : n.code) ?? e.code, i.data = (n == null ? void 0 : n.data) ?? e.data, i;
}, eo = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw ri(e);
    if (e.status === "error")
      throw ri(e.result ?? e);
  }
  return t;
}, Jh = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return eo(r);
  } catch (r) {
    throw ri(r);
  }
}, Jy = () => Yy(), Gf = () => {
  if (typeof window > "u")
    return;
  const t = pi();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Ur(t, e) ?? (t === window ? void 0 : Ur(window, e));
    if (n)
      return n;
  }
}, t0 = () => {
  if (typeof window > "u")
    return;
  const t = Gf();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = pi();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Ur(e, n) ?? (e === window ? void 0 : Ur(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Oa = (t) => {
  var r, i;
  const e = qs();
  if (Gc(e) || Xy(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = pi() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((i = n.xverseProviders) == null ? void 0 : i.StacksProvider) || t === Jy();
}, wl = (t) => {
  const e = A5(t);
  if (!e)
    return null;
  try {
    const n = lc(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, uc = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = wl(t), r = E5(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Tn(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = uc(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const i = t;
  let s = null;
  for (const a of Zh)
    if (wl(i[a])) {
      s = Tn(i[a]);
      break;
    }
  const o = Tn(i.txId) || Tn(i.txid) || Tn(i.transactionId);
  if (o)
    return {
      ...i,
      txId: o,
      txid: o,
      txRaw: s ?? Tn(i.txRaw) ?? void 0
    };
  for (const a of Zh) {
    const c = wl(i[a]);
    if (c)
      return {
        ...i,
        txId: c,
        txid: c,
        txRaw: Tn(i[a]) ?? void 0
      };
  }
  for (const a of w5) {
    const c = i[a], u = uc(c, e + 1);
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
}, bl = (t) => {
  const e = uc(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, v5 = (t) => {
  const e = uc(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, k5 = (t) => ({
  ...t,
  fee: Fs(t.fee),
  nonce: Fs(t.nonce),
  sponsored: t.sponsored === !0
}), e0 = (t) => ({
  recipient: t.recipient,
  amount: Fs(t.amount) ?? "0",
  memo: t.memo,
  network: Iu(t.network),
  address: t.stxAddress,
  fee: Fs(t.fee),
  nonce: Fs(t.nonce),
  sponsored: t.sponsored ?? !1
}), tw = "WALLET_ADDRESS_MISMATCH", $5 = 45e3;
let To = null;
const Lu = (t) => {
  t && (To = { address: t, at: Date.now() });
}, I5 = () => {
  To = null;
}, L5 = () => To && Date.now() - To.at <= $5 ? To.address : null, C5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, T5 = async (t) => {
  I5();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = eo(await t.request("wallet_connect")), n = jo(e);
  return Lu(n), n;
}, B5 = async (t, e, n, r) => {
  try {
    return eo(await t.request(e, n));
  } catch (i) {
    const s = ri(i);
    if (!C5(s))
      throw s;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: s.message
    });
    let o = null;
    try {
      o = await T5(t);
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
        { code: o ? tw : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return eo(await t.request(e, n));
    } catch (a) {
      throw ri(a);
    }
  }
};
let n0 = 3e4;
const M5 = (t, e) => {
  let n;
  const r = new Promise((i, s) => {
    n = setTimeout(() => {
      s(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${n0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, n0);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, N5 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: tw }
      );
    return c;
  }, i = L5();
  if (i)
    return ka(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: i }), r(i, "cached-session");
  let s = null;
  ka(n, "account-read");
  try {
    const c = eo(
      await M5(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    s = jo(c), console.info("[wallet:xverse-preflight]", {
      stage: s ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: s
    });
  } catch (c) {
    if (Qy(c))
      throw ri(c);
    ka(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (s)
    return Lu(s), r(s, "wallet_getAccount");
  let o;
  ka(n, "account-reconnect");
  try {
    o = eo(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), ri(c);
  }
  const a = jo(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Lu(a), r(a, "wallet_connect");
}, P5 = async (t, e) => {
  if (!Oa(t)) {
    const s = await Jh(
      t,
      "stx_transferStx",
      e0(e)
    );
    return bl(s);
  }
  const n = Gf();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const s = await Jh(
      n,
      "stx_transferStx",
      e0(e)
    );
    return bl(s);
  }
  const r = Jy();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await N5(r, e.stxAddress);
  const i = await B5(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: Fs(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: Fs(e.fee) } : {}
    },
    e.stxAddress
  );
  return bl(i);
}, _5 = () => qs(), ew = () => {
  var r, i;
  if (typeof window > "u")
    return;
  const t = qs(), e = t ? m5(t) : void 0;
  if (e)
    return e;
  const n = pi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((i = n.xverseProviders) == null ? void 0 : i.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, r0 = (t, e) => {
  const n = ew(), r = k5({
    ...t,
    onFinish: (i) => {
      var s;
      (s = t.onFinish) == null || s.call(t, v5(i));
    }
  });
  if (!n || typeof n.request != "function")
    return Sa(r, e);
  if (Oa(n) && !Gf()) {
    const i = t0();
    if (i)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: qs(),
        route: "legacy-transaction-request"
      }), Sa(r, i);
  }
  return void P5(n, t).then((i) => {
    var s;
    (s = t.onFinish) == null || s.call(t, i);
  }).catch((i) => {
    var s, o;
    if (Qh(i) && Oa(n)) {
      const a = t0();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: qs(),
          route: "legacy-transaction-request"
        }), Sa(r, a);
        return;
      }
    }
    if (Qh(i) && !Oa(n)) {
      Sa(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", i), Qy(i)) {
      (s = t.onCancel) == null || s.call(t);
      return;
    }
    if (t.onError) {
      t.onError(i);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, U5 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), s0 = (t) => jy(t).replace(/^0x/, ""), i0 = "This wallet cannot sign messages. Try Xverse or Leather.", o0 = (t) => typeof (t == null ? void 0 : t.request) == "function", a0 = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", H5 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, O5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function D5(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: s0(e.message),
    domain: s0(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function F5(t, e) {
  const n = await M4({
    domain: e.domain,
    message: e.message,
    network: Oc(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? U5()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function c0(t) {
  var i, s;
  const e = _5() || "", n = /xverse/i.test(e);
  let r = ew();
  if (n && !a0(r)) {
    const o = window;
    r = ((i = o.XverseProviders) == null ? void 0 : i.StacksProvider) ?? ((s = o.xverseProviders) == null ? void 0 : s.StacksProvider);
  }
  if (a0(r))
    try {
      return await F5(r, t);
    } catch (o) {
      if (n || !o0(r) || !O5(o)) throw o;
    }
  if (!n && o0(r))
    try {
      return await D5(r, t);
    } catch (o) {
      throw H5(o) ? new Error(i0) : o;
    }
  throw new Error(i0);
}
const l0 = 1000000n, Hs = 1000000n, fc = 50n, Fe = 3000n, gi = 300n, wo = 3000n, j5 = 50000n, ml = 200n, Kc = 15000n, Bn = (t) => t + fc;
function ur(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / l0}.${(n % l0).toString().padStart(6, "0")}`;
}
function u0(t, e = gi) {
  return t <= Fe ? 0 : Number((t - Fe) / Bn(e));
}
function xl(t, e = 0n) {
  const n = Hs - t - e;
  return n > 0n ? n : 0n;
}
function z5(t, e = gi) {
  return t > Hs ? "over" : t < Fe + Bn(e) ? "empty" : t < j5 ? "low" : "ok";
}
const R5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", G5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", K5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function V5(t) {
  var n, r, i, s;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((i = e["holder-payment"]) == null ? void 0 : i.value) !== "50" || ((s = e["receipt-bytes"]) == null ? void 0 : s.value) !== "16" || K5.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== R5 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const nw = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Sl = 3, q5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [Cu, rw] = nw.split("."), jn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function Tu(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function W5(t) {
  return jn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function xs(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function sw(t, e = []) {
  const n = await xs(`/v2/contracts/call-read/${Cu}/${rw}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Cu, arguments: e.map((r) => "0x" + jn(Le(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return hr(Kn(n.result));
}
async function X5() {
  const t = await xs(`/v2/contracts/source/${Cu}/${rw}?proof=0`);
  if (typeof t.source != "string" || await W5(t.source) !== G5) throw Error("Deployed source does not match the tested helper.");
  if (V5(await sw("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function iw(t) {
  return t.startsWith("SP") && Ui(t) && !t.includes(".");
}
async function Y5(t) {
  var r;
  if (!iw(t)) throw Error("Invalid mainnet wallet address.");
  const e = await xs(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await xs(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function Z5(t) {
  const e = await xs(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function Q5(t, e) {
  var i, s;
  const n = await sw("get-owner", [Co(t), Co(e)]), r = (n == null ? void 0 : n.success) === !0 ? (s = (i = n.value) == null ? void 0 : i.value) == null ? void 0 : s.value : null;
  if (typeof r != "string" || !iw(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function J5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Tu(t), signal: AbortSignal.timeout(15e3) });
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
async function t6(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function e6(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = lc(Tu(t.raw)), n = e.auth, r = e.payload, i = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || i.hashMode !== 0 || Mi(Ao(oc.MainnetSingleSig, i.signer)) !== t.address || i.fee !== BigInt(t.fee) || i.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const s = e.postConditions.values[0];
    if (r.payloadType !== 2 || Mi(r.contractAddress) + "." + r.contractName.content !== nw || r.functionName.content !== "play" || r.functionArgs.length !== 3 || jn(Le(r.functionArgs[0])) !== jn(Le(Co(t.core))) || jn(Le(r.functionArgs[1])) !== jn(Le(Co(t.song))) || jn(Le(r.functionArgs[2])) !== jn(Le(p5(Tu(t.id)))) || t.amount !== "50" || e.postConditionMode !== Zi.Deny || e.postConditions.values.length !== 1 || s.conditionType !== 0 || s.amount !== 50n || s.conditionCode !== Ho.Equal || s.principal.prefix !== 2 || Mi(s.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || Mi(r.contractAddress) + "." + r.contractName.content !== q5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || jn(Le(r.functionArgs[0])) !== jn(Le(Co(t.song))) || typeof t.liked != "boolean" || jn(Le(r.functionArgs[1])) !== jn(Le(h5(t.liked))) || t.amount !== "0" || e.postConditionMode !== Zi.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || hr(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const n6 = "xtrata.xyz/radio/listening-wallet", r6 = "Link a temporary listening wallet for pay-per-play; no spending permission", si = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && Ui(t), s6 = (t) => ({
  domain: ni({ name: Xe(n6), version: Xe("1"), "chain-id": wr(1) }),
  message: ni({
    purpose: Xe(r6),
    main: Xe(t.main),
    listening: Xe(t.listening),
    issued: wr(t.issued)
  })
}), ow = 100000n, i6 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function o6(t, e) {
  const n = t.filter((i) => !i || typeof i.sender != "string" || i.sender === e || !si(i.sender) || !/^\d+$/.test(i.amount) ? !1 : BigInt(i.amount) >= ow).sort(i6);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((i) => i.sender)).size };
}
const $a = 50;
function dc(t) {
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
async function a6(t, e, n = 4) {
  if (!si(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${$a}&offset=${o}`, i = dc(await e(r(0)));
    if (!i || i.total > 0 && !i.transfers.length) return { ok: !1 };
    if (i.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let s = Math.max(0, i.total - $a);
    for (let o = 0; o < n; o++) {
      const a = s === 0 && i.total <= $a ? i : dc(await e(r(s)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = o6(a.transfers, t);
      if (c.ok && c.funder) return s > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (s === 0) return c;
      s = Math.max(0, s - $a);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const Tr = 50, c6 = 6, l6 = 20, f0 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function d0(t, e) {
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
async function u6(t, e, n) {
  if (!si(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), i = dc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Tr}&offset=0`));
    if (!i || i.total > c6 * Tr) return { ok: !1 };
    for (const o of i.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = Tr; o < i.total; o += Tr) {
      const a = dc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Tr}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== i.total) return { ok: !1 };
    const s = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${Tr}&offset=${u}`, a = d0(await e(o(0)), t);
      if (!a || a.total > l6 * Tr) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) s.set(u.txId, u);
      for (let u = Tr; u < a.total; u += Tr) {
        const f = d0(await e(o(u)), t);
        if (!f || !f.rows.length) return { ok: !1 };
        for (const l of f.rows) c.add(l);
        for (const l of f.sent) s.set(l.txId, l);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...s.values()] };
  } catch {
    return { ok: !1 };
  }
}
function f6(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const i = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(f0).map((l, y) => {
    const p = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: p, kind: "gift", to: r.payer, at: y } : si(l.sender) && p >= ow ? { sender: l.sender, left: p, kind: "deposit", to: l.sender, at: y } : { sender: l.sender, left: p, kind: "dust", to: null, at: y };
  }), s = i.reduce((l, y) => l + y.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && si(l.recipient) && l.amount > 0n).sort(f0), a = o.reduce((l, y) => l + y.amount, 0n), c = s - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (l, y) => {
    let p = y;
    for (const x of l) {
      if (p <= 0n) break;
      const S = x.left < p ? x.left : p;
      x.left -= S, p -= S;
    }
    return p;
  };
  for (const l of o) {
    const y = u(i.filter((p) => p.to === l.recipient), l.amount);
    y > 0n && u(i, y);
  }
  if (u(i, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (i.reduce((l, y) => l + y.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const f = /* @__PURE__ */ new Map();
  for (const l of i) {
    if (l.left <= 0n) continue;
    const y = `${l.kind}:${l.to ?? ""}`, p = f.get(y);
    p ? (p.amount += l.left, p.newest = Math.max(p.newest, l.at)) : f.set(y, { to: l.to, kind: l.kind, amount: l.left, newest: l.at });
  }
  return {
    ok: !0,
    parts: [...f.values()].sort((l, y) => l.newest - y.newest),
    hasTopUp: i.some((l) => l.kind === "deposit")
  };
}
function d6(t, e) {
  const n = t.filter((u) => u.kind === "deposit").sort((u, f) => u.newest - f.newest), r = t.find((u) => u.kind === "gift"), i = t.filter((u) => u.kind === "dust"), s = ((r == null ? void 0 : r.amount) ?? 0n) + i.reduce((u, f) => u + f.amount, 0n), o = [], a = [], c = s > e;
  return n.forEach((u, f) => {
    if (u.amount <= e) {
      a.push(u);
      return;
    }
    const l = f === n.length - 1 && !c;
    o.push({ to: u.to, kind: "deposit", mode: l ? "all" : "amount", send: u.amount - e });
  }), c ? o.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: s - e }) : (r && a.push(r), a.push(...i)), { steps: o, tooSmall: a };
}
function h0(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const Da = [100, 250, 500], h6 = (t, e) => BigInt(t) * Bn(e), bo = ["prepared", "signed", "unknown", "pending"], p6 = 30 * 6e4, hc = 6e4, ki = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, g6 = 3e3, pc = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", El = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function y6(t) {
  let e = null, n = -1 / 0, r, i = null, s = null, o, a = -1 / 0, c = null, u = null, f = !1, l = !1, y = !1, p = null, x = !1, S = "", B = "", z = 0, R, A = null, _, N = [], Q, tt = -1 / 0;
  const G = /* @__PURE__ */ new Set();
  let V = null, I = !1, P = 0, b = null, T = null, D = !1, C = null, ot = !1, X = null, St = !1, k = !1, m = !1, q = !1, rt = !1, at = 0, vt = null, te = Promise.resolve();
  const $t = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? gi.toString()), Ht = (w) => !!s && !(s.features ?? []).includes(w), Mt = (w, L) => `xtrata.ppp.v1.${w}:${L}`, jt = (w = s == null ? void 0 : s.address) => {
    if (!w) return [];
    try {
      const L = JSON.parse(t.store.get(Mt("entries", w)) || "[]");
      return Array.isArray(L) ? L : [];
    } catch {
      return [];
    }
  }, et = (w) => {
    const L = [w, ...jt(w.address).filter((K) => !(K.txid === w.txid && K.kind === w.kind))].slice(0, 200);
    t.store.set(Mt("entries", w.address), JSON.stringify(L));
  }, Se = (w = s == null ? void 0 : s.address) => !!w && t.store.get(Mt("on", w)) !== "0", An = (w) => {
    s != null && s.address && t.store.set(Mt("on", s.address), w ? "1" : "0");
  }, Ze = () => jt().filter((w) => bo.includes(w.status)), dn = () => oe() ? [...Ze(), ...jt(Xt()).filter((w) => bo.includes(w.status))] : Ze(), Ie = () => Be(s == null ? void 0 : s.address), Be = (w) => {
    if (!w) return null;
    try {
      return JSON.parse(t.store.get(Mt("deposit", w)) || "null");
    } catch {
      return null;
    }
  }, Me = (w, L = s == null ? void 0 : s.address) => {
    L && t.store.set(Mt("deposit", L), JSON.stringify(w));
  };
  let ee = null;
  const hn = (w = hc) => {
    const L = t.now();
    ee = { since: ee && L < ee.until ? ee.since : L, until: Math.max((ee == null ? void 0 : ee.until) ?? 0, L + w) };
  }, je = () => !!ee && t.now() < ee.until && (o === void 0 || o < Fe + Bn($t())), be = () => !!Ie() || je(), Xt = () => Ht("rootLike") ? s == null ? void 0 : s.address : (s == null ? void 0 : s.root) ?? (s == null ? void 0 : s.address), oe = () => !!(s != null && s.address) && Xt() !== s.address, Ue = () => oe() ? c && c.for === Xt() ? c.value : void 0 : o, vn = (w) => w !== void 0 && w < Fe + ml, $ = () => Ze().filter((w) => t.now() - w.created > p6 && G.has(w.txid)), F = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), U = () => F() && !(s != null && s.linked), H = () => {
    const w = t.main();
    return !U() && !!w && !!(s != null && s.linked) && s.linked !== w;
  }, ut = (w) => Mt("return-to", w), xt = (w = s == null ? void 0 : s.address) => {
    if (!w) return;
    const L = t.store.get(ut(w));
    return L && si(L) && L !== w ? L : void 0;
  }, ne = (w = s == null ? void 0 : s.address) => V && V.for === w ? V.res : null;
  function Yt() {
    if (!(s != null && s.address)) return;
    if (s.linked) return { to: s.linked, kind: "linked" };
    const w = xt();
    if (w) return { to: w, kind: "chosen" };
    const L = ne();
    if (L != null && L.ok && L.funder) return { to: L.funder, kind: "funder" };
  }
  const Zt = (w) => Mt("gift", w);
  function qt() {
    const w = s == null ? void 0 : s.address;
    if (!w) return null;
    if ((C == null ? void 0 : C.for) === w) return C.info;
    try {
      const L = JSON.parse(t.store.get(Zt(w)) || "null");
      return L && typeof L.returnTo == "string" && typeof L.treasury == "string" ? L : null;
    } catch {
      return null;
    }
  }
  async function Ne() {
    var ft;
    const w = s == null ? void 0 : s.address;
    if (!w || !t.giftInfo || !((ft = e == null ? void 0 : e.gifts) != null && ft.enabled) || ot) return;
    const L = (C == null ? void 0 : C.for) === w ? C : null, K = L ? L.ok ? L.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (L && t.now() - L.at < K) return;
    ot = !0;
    const J = qt();
    try {
      const j = await t.giftInfo(w);
      C = { for: w, info: j, ok: !0, at: t.now() }, t.store.set(Zt(w), JSON.stringify(j));
    } catch {
      C = { for: w, info: J, ok: !1, at: t.now() };
    } finally {
      ot = !1;
    }
  }
  const He = () => jt().reduce((w, L) => bo.includes(L.status) ? w + BigInt(L.amount || "0") + BigInt(L.fee || "0") : w, 0n);
  function Ot() {
    if (o === void 0) return 0;
    const w = o - He() - BigInt(fe.length) * Bn($t());
    return w > 0n ? u0(w, $t()) : 0;
  }
  const Et = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", Gt = "EMPTY — ADD STX TO PLAY";
  function Qt() {
    var K;
    const w = (s == null ? void 0 : s.state) === "known" || (s == null ? void 0 : s.state) === "unlocked";
    if (!((K = qt()) != null && K.player) && !w) return null;
    const L = (J, ft) => ({ reason: J, text: ft });
    switch (le()) {
      case "connect":
      case "wrong-wallet":
        return L("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "locked":
        return L("locked", "UNLOCK TO LISTEN");
      case "link":
        return L("link", "FINISH SETUP TO LISTEN");
      case "over":
        return L("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return be() ? L("arriving", "YOUR PLAYS ARE ARRIVING") : L("out", oe() ? Et : Gt);
      case "ready":
        return !Se() || !(s != null && s.session) || s.session.playsLeft < 1 ? L("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : m ? Ot() < 1 ? L("out", oe() ? Et : Gt) : null : L("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const Ee = () => {
    var w;
    return !!(s != null && s.address) && oe() && !!((w = qt()) != null && w.player);
  };
  function ce() {
    return Ee() ? { locked: !0, known: !0 } : null;
  }
  const pn = 3 * 6e4, kn = () => !!qt() && !!t.history && !(s != null && s.linked);
  async function Ar() {
    const w = s.address, L = qt(), { balance: K, nonce: J } = await t.chain.account(w), ft = await t.history(w, !0);
    if (!ft.ok) return null;
    const j = f6({ self: w, balance: K, inbound: ft.inbound, outgoing: ft.outgoing, gift: { sender: L.treasury, payer: L.returnTo } });
    if (!j.ok) return null;
    const gt = d6(j.parts, wo);
    return { balance: K, nonce: J, parts: j.parts, steps: gt.steps, tooSmall: gt.tooSmall.length };
  }
  const lo = () => St ? { state: "unavailable" } : !X || t.now() - X.at > pn || o !== void 0 && o !== X.balance ? { state: "none" } : X.plan;
  function le() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const w = t.main();
    if (!U()) {
      if (!w) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return s ? s.state === "unsupported" ? "unsupported" : s.state === "none" ? "intro" : H() ? "wrong-wallet" : s.state === "known" ? "locked" : !U() && s.linked !== w ? "link" : o === void 0 ? "loading" : o > Hs ? "over" : o < Fe + Bn($t()) ? "fund" : "ready" : "loading";
  }
  const yi = () => {
    var w, L, K, J, ft;
    return {
      step: le(),
      busy: u,
      message: S,
      error: B,
      notice: Un(),
      gate: e,
      main: t.main(),
      listening: s == null ? void 0 : s.address,
      linked: s == null ? void 0 : s.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : z5(o, $t()),
      playsLeft: o === void 0 ? 0 : u0(o, $t()),
      allowance: o === void 0 ? Hs : xl(o, BigInt(((w = Ie()) == null ? void 0 : w.amount) ?? "0")),
      session: (s == null ? void 0 : s.session) ?? null,
      payingOn: Se(),
      entries: jt(),
      depositTxid: ((L = Ie()) == null ? void 0 : L.txid) ?? R,
      depositPending: be(),
      arrival: be() ? { since: ((K = Ie()) == null ? void 0 : K.at) ?? (ee == null ? void 0 : ee.since) ?? t.now(), graceMs: hc } : null,
      walletOutdated: Ht("like"),
      linkedListening: Q && Q === t.main() ? N.map((j) => j.listening) : [],
      serverLinked: !!A && _ === `${t.main()}:${s == null ? void 0 : s.address}`,
      stuck: $().length,
      armed: q,
      queued: fe.length,
      solo: U(),
      returnTo: (J = Yt()) == null ? void 0 : J.to,
      returnToKind: (ft = Yt()) == null ? void 0 : ft.kind,
      funderState: (() => {
        const j = ne();
        return j ? j.ok ? j.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const j = ne();
        return !!j && j.ok && j.distinct > 1;
      })(),
      walletCannotSolo: U() && Ht("standalone"),
      walletCannotMulti: Ht("multi"),
      others: ((s == null ? void 0 : s.others) ?? []).filter((j) => j !== t.main() && j !== (s == null ? void 0 : s.linked)),
      creditedTo: U() && (s != null && s.address) && (b == null ? void 0 : b.for) === s.address && b.main ? b.main : void 0,
      createdHere: !!(s != null && s.address) && t.store.get(Mt("created", s.address)) === "1",
      brandNew: !!(s != null && s.address) && o === 0n && (T == null ? void 0 : T.for) === s.address && T.unused,
      gift: (() => {
        const j = qt();
        return j ? { player: j.player, from: j.from, source: j.source, amount: j.amount } : null;
      })(),
      giftPlays: qt() ? Ot() : 0,
      playCost: Bn($t()),
      giftStop: Qt(),
      albumLock: ce(),
      returnPlan: lo(),
      slot: (s == null ? void 0 : s.state) === "unlocked" ? s.slot ?? 0 : 0,
      root: (s == null ? void 0 : s.state) === "unlocked" ? s.root ?? s.address : void 0,
      walletCannotAlbums: Ht("slots"),
      likeFunds: (() => {
        var wt;
        const j = Xt();
        if (!j || (s == null ? void 0 : s.state) !== "unlocked") return null;
        const gt = Ue();
        return { address: j, balance: gt, low: vn(gt), album: oe(), pending: !!Be(j), txid: (wt = Be(j)) == null ? void 0 : wt.txid, main: t.main() };
      })()
    };
  }, Un = () => z ? z < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", Kt = (w, L = "") => {
    S = w, B = L, t.changed();
  };
  async function Ge(w, L) {
    if (!u) {
      u = w, B = "", t.changed();
      try {
        await L();
      } catch (K) {
        const J = K instanceof Error ? K.message : String(K);
        B = /Cancelled in the listening wallet/.test(J) ? "" : J, B || (S = "Not now. Nothing was signed.", rt = !0);
      } finally {
        u = null, await Ke(!0);
      }
    }
  }
  const vs = () => !!(e != null && e.enabled) && e.here && (U() || !!t.main() && e.allowed), d = () => vs() && !H(), E = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", v = () => {
    if (H()) throw new Error(E());
  };
  async function h() {
    if (!vs()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return i ?? (i = await t.bridge(e.walletOrigin)), i;
  }
  const st = (w) => {
    const L = t.main();
    return w.request("listening.status", L ? { main: L } : void 0);
  };
  async function pt(w = !1) {
    s != null && s.address && (!w && t.now() - a < 3e4 || (o = await t.chain.balance(s.address), a = t.now(), await At(w)));
  }
  async function At(w = !1) {
    const L = Xt();
    if (!(!oe() || !L || (s == null ? void 0 : s.state) !== "unlocked") && !(!w && (c == null ? void 0 : c.for) === L && t.now() - c.at < 3e4))
      try {
        c = { for: L, value: await t.chain.balance(L), at: t.now() };
      } catch {
      }
  }
  async function de(w) {
    if ((Q !== w || t.now() - tt >= 6e4) && (N = await t.links(w), Q = w, tt = t.now()), (s == null ? void 0 : s.state) !== "unlocked" || s.linked === w) return;
    const L = `${w}:${s.address}`;
    _ === L && A || (A = N.find((K) => K.listening === s.address) ?? null, _ = L);
  }
  async function re() {
    const w = s == null ? void 0 : s.address;
    if (!U() || !w || s != null && s.linked || !t.funder || I || !o || o <= 0n) return;
    const L = ne(w);
    if (L != null && L.ok && L.funder) return;
    const K = L != null && L.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, P - 1), 30 * 6e4);
    if (!(V && V.for === w && t.now() - V.at < K)) {
      I = !0;
      try {
        V = { for: w, res: await t.funder(w), at: t.now() };
      } catch {
        V = { for: w, res: { ok: !1 }, at: t.now() };
      } finally {
        I = !1;
      }
      P = V.res.ok ? 0 : P + 1;
    }
  }
  async function gn() {
    const w = s == null ? void 0 : s.address;
    if (!(!U() || !w || s != null && s.linked || !t.mainOf || D) && !(b && b.for === w && (b.ok || t.now() - b.at < 6e4))) {
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
  async function he() {
    const w = s == null ? void 0 : s.address;
    if (!(!w || (s == null ? void 0 : s.state) !== "unlocked" || o !== 0n || (T == null ? void 0 : T.for) === w) && t.store.get(Mt("created", w)) !== "1")
      try {
        T = { for: w, unused: await t.chain.confirmedNonce(w) === 0n };
      } catch {
      }
  }
  async function Pe() {
    var ft;
    const w = s == null ? void 0 : s.address;
    if (!w) return !1;
    let L, K = !1;
    const J = /* @__PURE__ */ new Map();
    for (const j of dn())
      try {
        const gt = await t.chain.transaction(j.txid);
        if (!gt) {
          if (G.add(j.txid), t.now() - j.created > 15 * 6e4 && !J.has(j.address) && J.set(j.address, await t.chain.confirmedNonce(j.address)), L = J.get(j.address), L !== void 0 && L > BigInt(j.nonce)) {
            et({ ...j, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((j.status === "unknown" || j.status === "signed") && j.raw)
            try {
              await t.chain.broadcast(j.raw, j.txid), et({ ...j, status: "pending" });
            } catch (bt) {
              ki(bt) && et({ ...j, status: "failed", note: bt.message, raw: void 0 });
            }
          continue;
        }
        G.delete(j.txid);
        const wt = String(gt.tx_status);
        if (wt === "success" && gt.canonical !== !1 && gt.is_unanchored === !1) {
          if (et({ ...j, status: "confirmed", confirmedAt: t.now(), actualFee: String(gt.fee_rate ?? j.fee), raw: void 0 }), K = !0, j.kind === "like" && (x = !0, j.status !== "confirmed" && typeof j.liked == "boolean"))
            try {
              (ft = t.likeConfirmed) == null || ft.call(t, j.song, j.liked);
            } catch {
            }
        } else wt.startsWith("abort_") || wt.startsWith("dropped_") ? et({ ...j, status: "failed", note: wt, raw: void 0 }) : j.status !== "pending" && et({ ...j, status: "pending" });
      } catch {
      }
    for (const j of oe() ? [w, Xt()] : [w]) {
      const gt = Be(j);
      if (gt)
        try {
          const wt = await t.chain.transaction(gt.txid), bt = String((wt == null ? void 0 : wt.tx_status) ?? "");
          (bt === "success" && wt.is_unanchored === !1 || bt.startsWith("abort_") || bt.startsWith("dropped_") || !wt && t.now() - gt.at > 2 * 36e5) && (Me(null, j), bt === "success" && hn(2e4), a = -1 / 0, c = null, /on its way/i.test(S) && (S = ""));
        } catch {
        }
    }
    return K;
  }
  async function Ke(w = !1) {
    var L;
    try {
      const K = t.main();
      if ((w || !e || r !== K || t.now() - n > 3e5) && (e = await t.config(K), n = t.now(), r = K), !e.enabled || !e.here || !U() && (!K || !e.allowed)) {
        i && (s != null && s.session) && await i.request("listening.stop").catch(() => {
        }), q && Hn(), t.changed();
        return;
      }
      await h(), s = await st(i), H() && s.state === "unlocked" && (qn(), await i.request("listening.lock").catch(() => {
      }), o = void 0, s = await st(i)), K && e.allowed && await de(K), await pt(w), await re(), await gn(), await he(), await Ne(), await Pe() && await pt(!0), await At(), await wi(), z = 0;
    } catch {
      z++;
    }
    if (le() === "locked" ? Je() : q && Hn(), x) {
      x = !1;
      try {
        (L = t.likesChanged) == null || L.call(t);
      } catch {
      }
    }
    t.changed(), fe.length && !$r && Wn();
  }
  async function Vn(w) {
    const L = s == null ? void 0 : s.root;
    if (!L || s != null && s.slot || !(s != null && s.address) || Ht("slots")) return;
    const K = Number(t.store.get(Mt("slot", L)));
    if (!(!Number.isSafeInteger(K) || K < 1))
      try {
        const { balance: J } = await t.chain.account(s.address);
        if (J >= Fe + Bn($t())) return;
        await w.request("listening.openSlot", { slot: K }), s = await st(w), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function Qe(w, L) {
    var j;
    v();
    const K = !(s != null && s.address) || Se(s.address), J = s != null && s.linked ? (j = t.nameOf) == null ? void 0 : j.call(t, s.linked) : void 0;
    await w.request("listening.unlock", { mode: "unlock", terms: K ? vr() : void 0, anyPasskey: L, ...t.main() ? { main: t.main() } : {}, ...J ? { label: J } : {} }), s = await st(w), K && (Se(s.address) ? await kr() : await w.request("listening.stop")), await Vn(w), Kt(K ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const ft = p;
    p = null, ft && t.now() - ft.at < 12e4 && setTimeout(() => void Ke(!0).then(() => rr(ft)), 0);
  }
  function Je() {
    q || u || rt || at >= 3 || !i || !(s != null && s.address) || (q = !0, te = (async () => {
      try {
        await Qe(i, !1), at = 0;
      } catch (w) {
        const L = w instanceof Error ? w.message : String(w);
        /Cancelled in the listening wallet/.test(L) ? vt || (rt = !0, Kt("Not now. Nothing was signed.")) : /did not answer/.test(L) ? await (i == null ? void 0 : i.request("listening.cancel").catch(() => {
        })) : (at++, B = L);
      } finally {
        q = !1;
        const w = vt;
        vt = null, w ? await w() : await Ke(!0);
      }
    })());
  }
  async function Hn(w) {
    q && (vt = async () => {
    }, await (i == null ? void 0 : i.request("listening.cancel").catch(() => {
    })), await te), w && await w(), t.changed();
  }
  const vr = () => ({
    fee: $t().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Hs.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function kr() {
    if (!(s != null && s.address)) return !1;
    if (m || (m = await t.tabLock(s.address)), !m)
      throw await (i == null ? void 0 : i.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function Ve(w, L) {
    const K = s.address, { balance: J, nonce: ft } = L ?? await t.chain.account(K);
    o = J;
    const j = await i.request("listening.prepareReturn", {
      mode: w.mode,
      balance: J.toString(),
      nonce: ft.toString(),
      fee: wo.toString(),
      ...w.amount !== void 0 ? { amount: w.amount.toString() } : {},
      ...w.linked ? {} : { destination: w.to }
    });
    if (j.recipient !== w.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const gt = w.mode === "amount" ? w.amount : w.mode === "all" ? J - wo : J - Hs - wo, wt = lc(j.raw);
    if (hr(wt.payload.recipient).value !== w.to || String(wt.payload.amount) !== j.amount || gt !== void 0 && j.amount !== gt.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const bt = {
      id: El(),
      address: K,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: j.recipient,
      amount: j.amount,
      fee: j.fee,
      nonce: ft.toString(),
      created: t.now(),
      status: "signed",
      raw: j.raw,
      txid: j.txid
    };
    t.validate(bt), et(bt);
    try {
      await t.chain.broadcast(j.raw, j.txid), et({ ...bt, status: "pending" });
    } catch (zt) {
      throw et({ ...bt, status: "unknown", note: zt.message }), zt;
    }
    return j;
  }
  const ks = Kc, On = wo;
  async function yt(w, L, K) {
    if ((s == null ? void 0 : s.state) !== "unlocked" || !s.address) throw new Error("Unlock the listening wallet first.");
    if (Ht("slots") || Ht("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const J = s.slot ?? 0;
    if (w === L || ![w, L].includes(J) || ![w, L].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const ft = s.root ?? s.address, j = w === 0 ? ft : s.address, gt = L === 0 ? ft : s.address, { balance: wt, nonce: bt } = await t.chain.account(j);
    if (wt < K + On + Fe) throw new Error(w === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const zt = await i.request("listening.signMove", { from: w, to: L, amount: K.toString(), fee: On.toString(), nonce: bt.toString(), balance: wt.toString() }), _e = lc(zt.raw);
    if (zt.from !== j || zt.to !== gt || zt.amount !== K.toString() || hr(_e.payload.recipient).value !== gt || String(_e.payload.amount) !== K.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const tn = {
      id: El(),
      address: j,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: gt,
      amount: zt.amount,
      fee: zt.fee,
      nonce: bt.toString(),
      created: t.now(),
      status: "signed",
      raw: zt.raw,
      txid: zt.txid
    };
    t.validate(tn), et(tn);
    try {
      await t.chain.broadcast(zt.raw, zt.txid), et({ ...tn, status: "pending" });
    } catch (pe) {
      throw et({ ...tn, status: "unknown", note: pe.message }), pe;
    }
    return Me({ txid: zt.txid, amount: zt.amount, at: t.now() }, gt), gt === ft && ft !== s.address ? c = null : a = -1 / 0, zt;
  }
  let Dt = !1;
  const ue = /* @__PURE__ */ new Map(), yn = (w) => Mt("float", w);
  async function wi() {
    if (Dt || (s == null ? void 0 : s.state) !== "unlocked" || !oe() || Ht("move") || Ht("rootLike") || !s.address) return;
    const w = s.address;
    if (t.store.get(yn(w)) === "1") return;
    const L = qt();
    if (!(L != null && L.player) || L.state !== "arrived") return;
    const K = Ue();
    if (K === void 0 || o === void 0) return;
    if (!vn(K)) {
      t.store.set(yn(w), "1");
      return;
    }
    if (Be(Xt()) || Ir() || dn().length || o < ks * 4n + Fe + On) return;
    const J = ue.get(w);
    if (!(J && (J.n >= 3 || t.now() - J.at < 5 * 6e4))) {
      Dt = !0, ue.set(w, { n: ((J == null ? void 0 : J.n) ?? 0) + 1, at: t.now() });
      try {
        await yt(s.slot ?? 0, 0, ks), t.store.set(yn(w), "1");
      } catch (ft) {
        console.warn("[radio] likes float not sent yet", ft);
      } finally {
        Dt = !1;
      }
    }
  }
  async function uo(w) {
    if (Ze().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Ht("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const L = await Ar().catch(() => null);
    if (!L)
      throw X = null, St = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    St = !1, o = L.balance;
    const K = { balance: L.balance, nonce: L.nonce };
    if (w === "excess") {
      const wt = h0(L.parts) ?? xt();
      if (!wt) throw new Error("Choose where to send the excess first.");
      await Ve({ mode: "excess", to: wt, linked: !1 }, K), X = null, Kt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const J = L.steps;
    if (!J.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!X && X.balance === L.balance && t.now() - X.at <= pn && X.steps.length === J.length && X.steps.every((wt, bt) => wt.to === J[bt].to && wt.mode === J[bt].mode && wt.send === J[bt].send))) {
      X = {
        at: t.now(),
        balance: L.balance,
        steps: J,
        parts: L.parts,
        plan: { state: "ready", steps: J.map((wt) => ({ to: wt.to, kind: wt.kind, send: wt.send.toString() })), kept: L.tooSmall, excess: h0(L.parts) }
      }, Kt(J.length > 1 ? `This goes back in ${J.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const j = J[0], gt = j.to ?? xt();
    if (!gt) throw new Error("Choose where to send the rest first.");
    if (j.mode === "amount" && Ht("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await Ve({ mode: j.mode, to: gt, linked: !1, ...j.mode === "amount" ? { amount: j.send } : {} }, K), X = null, J.length === 1 ? (An(!1), Kt("Returned ✓ Paying is off.")) : Kt(`Returned ✓ ${J.length - 1} more ${J.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const $s = {
    forceRefresh: () => Ke(!0),
    create: () => Ge("Waiting for your passkey…", async () => {
      const w = await h();
      await w.request("listening.unlock", { mode: "create", terms: vr(), ...t.main() ? { main: t.main() } : {} }), s = await st(w), s.address && t.store.set(Mt("created", s.address), "1"), An(!0), Kt(U() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await kr();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (w) => {
      w ? hn() : ee = null, t.changed();
    },
    giftSent: (w, L) => {
      !(s != null && s.address) || Ie() || (Me({ txid: w, amount: L.toString(), at: t.now() }), a = -1 / 0, C = null, Kt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (w) => {
      if (v(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Ht("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await h()).request("listening.bindSlot", { slot: w, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (w, L, K, J) => {
      Me({ txid: K, amount: J.toString(), at: t.now() }, L), C = null, await $s.openAlbum(w), Kt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (w) => Ge("Opening…", async () => {
      if (v(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Ht("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (f || l || y) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((s.slot ?? 0) === w) return;
      qn(), await i.request("listening.openSlot", { slot: w }), s = await st(i), o = void 0, a = -1 / 0, X = null, St = !1;
      const L = s.root;
      L && w > 0 && t.store.set(Mt("slot", L), String(w)), Kt(w === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (w = !1) => {
      const L = () => Ge("Waiting for your passkey…", async () => Qe(await h(), w));
      return q ? w ? Ht("cancel") ? (Kt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Hn(async () => {
        (le() === "locked" || le() === "intro") && await L();
      }) : te : L();
    },
    link: () => Ge("Sign in your wallet…", async () => {
      v();
      const w = t.main();
      if (!w || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      const L = (await t.links(w)).find((K) => K.listening === s.address);
      if (L)
        await i.request("listening.link", { main: w, issued: L.issued, mainSignature: L.mainSignature });
      else {
        const K = { main: w, listening: s.address, issued: t.now() }, J = await t.signWithMain(w, s6(K)), ft = await i.request("listening.link", { main: w, issued: K.issued, mainSignature: J });
        await t.saveLink({ ...K, mainSignature: J, listeningSignature: ft.listeningSignature }), tt = -1 / 0;
      }
      Kt("Linked ✓");
    }),
    deposit: () => Ge("Approve the deposit in your wallet…", async () => {
      v();
      const w = t.main();
      if (!w || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      if (Ie()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (je()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await pt(!0);
      const L = xl(o ?? 0n);
      if (L <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      R = await t.deposit(w, s.address, L), R && Me({ txid: R, amount: L.toString(), at: t.now() }), Kt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Ge("Approve the top-up in your wallet…", async () => {
      v();
      const w = t.main(), L = Xt();
      if (!w || !L) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (Be(L)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const K = await t.chain.balance(L);
      oe() ? c = { for: L, value: K, at: t.now() } : (o = K, a = t.now());
      const J = xl(K);
      if (J <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const ft = await t.deposit(w, L, J);
      ft && Me({ txid: ft, amount: J.toString(), at: t.now() }, L), Kt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (w) => Ge("Adding plays…", async () => {
      if (v(), !oe()) throw new Error("Open the album you want to add plays to first.");
      if (!Da.includes(w)) throw new Error("Choose one of the amounts offered.");
      const L = h6(w, $t());
      if (f || l || y) throw new Error("Still sending a payment. Try again in a moment.");
      if (dn().length || Ie()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await yt(0, s.slot ?? 0, L), Kt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Ge("Confirm in the listening wallet…", async () => {
      if (!d()) throw new Error("Connect your wallet first.");
      await kr(), await i.request("listening.approveSession", vr()), An(!0), Kt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Ge("Clearing…", async () => {
      for (const w of $())
        await t.chain.transaction(w.txid) || et({ ...w, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Kt("Cleared ✓");
    }),
    switchOff: () => Ge("Switching off…", async () => {
      qn(), await (i == null ? void 0 : i.request("listening.stop")), An(!1), Kt("Paying is off. Music stays free.");
    }),
    lock: () => Ge("Locking…", async () => {
      qn(), await (i == null ? void 0 : i.request("listening.lock")), o = void 0, Kt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (w) => {
      const L = String(w ?? "").trim();
      if (!(s != null && s.address)) return Kt("", "Unlock the listening wallet first.");
      if (!si(L)) return Kt("", "Enter a standard mainnet address (it starts with SP).");
      if (L === s.address) return Kt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(ut(s.address), L), Kt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      s != null && s.address && t.store.set(ut(s.address), ""), t.changed();
    },
    returnFunds: (w) => Ge("Check the return in the listening wallet…", async () => {
      if (!d()) throw new Error("Connect your wallet first.");
      if (!(s != null && s.address)) throw new Error("Unlock the listening wallet first.");
      if (kn()) return uo(w);
      const L = Yt();
      if (!L) throw new Error(U() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (L.kind !== "linked" && Ht("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Ze().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await Ve({ mode: w, to: L.to, linked: L.kind === "linked" }), w === "all" && An(!1), Kt(w === "all" ? L.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, fe = [], Fr = 10, jr = 30 * 6e4;
  let $r = !1;
  const Ir = () => f || !!u || l || y, qn = () => {
    fe.length && (fe.length = 0, t.changed());
  };
  async function zr(w) {
    if (!fe.some((L) => L.id === w.id) && !jt().some((L) => L.id === w.id) && (fe.push({ ...w, at: t.now() }), fe.length > Fr && fe.shift()), Ir() || Ze().length) {
      const L = fe.length;
      S = `Queued ${L === 1 ? "this song" : L + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Wn();
  }
  async function Wn() {
    if (!$r) {
      $r = !0;
      try {
        for (; fe.length; ) {
          for (; fe.length && t.now() - fe[0].at > jr; ) fe.shift();
          if (!fe.length || Ir() || await Is(fe[0]) === "wait") return;
          fe.shift();
        }
      } finally {
        $r = !1, t.changed();
      }
    }
  }
  async function Is(w) {
    var L;
    f = !0;
    try {
      await Ke();
      const K = le();
      if (K === "loading") return "wait";
      if (K !== "ready" || !Se() || !(s != null && s.session) || s.session.playsLeft < 1 || !m) return "done";
      if (Ze().length) return "wait";
      k || (await t.chain.verify(), k = !0);
      const J = s.address, { balance: ft, nonce: j } = await t.chain.account(J);
      o = ft, a = t.now();
      const gt = await t.chain.owner(Sl, w.song);
      if (gt === J || gt === t.main()) return "done";
      const wt = await i.request("listening.signPlay", {
        core: Sl,
        song: w.song,
        receipt: w.id,
        fee: $t().toString(),
        nonce: j.toString(),
        balance: ft.toString()
      }), bt = {
        id: w.id,
        address: J,
        kind: "play",
        core: Sl,
        song: w.song,
        recipient: gt,
        amount: "50",
        fee: $t().toString(),
        nonce: j.toString(),
        created: t.now(),
        status: "signed",
        raw: wt.raw,
        txid: wt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(bt), et(bt);
      const zt = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`;
      try {
        await t.chain.broadcast(wt.raw, wt.txid), et({ ...bt, status: "pending" }), S = `♪ Paid ${zt}`, B = "";
      } catch (_e) {
        et({ ...bt, status: ki(_e) ? "failed" : "unknown", note: _e.message, ...ki(_e) ? { raw: void 0 } : {} }), B = _e.message;
      }
      return s = await st(i), "done";
    } catch (K) {
      const J = K instanceof Error ? K.message : "payment unavailable";
      return (L = qt()) != null && L.player ? (S = "Payment is taking a moment: " + J, "wait") : (S = "This song played free: " + J, "done");
    } finally {
      f = !1, t.changed();
    }
  }
  function bi(w) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(le()) || Ht("like") ? !1 : (rr(w), !0);
  }
  async function rr(w) {
    const L = w.title ? `“${w.title}”` : `song #${w.song}`, K = ($n) => {
      var Rr;
      B = $n, S = "";
      try {
        (Rr = t.likeFailed) == null || Rr.call(t, w.song);
      } catch {
      }
      t.changed();
    }, J = oe(), ft = le(), j = t.main(), gt = J && (ft === "fund" || ft === "over") ? "ready" : ft, wt = U() ? Xt() : j;
    if (gt === "locked") {
      p = { ...w, at: t.now() }, Kt(`Unlock to like ${L}. It sends straight after.`);
      return;
    }
    if (gt === "wrong-wallet") return K(E());
    if (gt === "link") return K("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (U() && Ht("standalone")) return K("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (gt === "fund") return K("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (gt === "over") return K("Return the excess first: the listening wallet holds more than 1 STX.");
    if (J) {
      await At(!0);
      const $n = Ue();
      if (vn($n))
        return t.changed(), K(pc);
    }
    if (gt !== "ready" || !wt) return K("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(s != null && s.session)) return K("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!m) return K("Pay-per-play is running in another tab. Like from that tab.");
    const bt = jt(Xt()).find(($n) => $n.kind === "like" && $n.song === w.song);
    if (bt && bo.includes(bt.status))
      return K(`Your last like for ${L} is still on its way. It can change again once it confirms.`);
    if (l) return K("One like at a time: your last one is still being sent.");
    if ((bt == null ? void 0 : bt.status) === "confirmed" && t.now() - (bt.confirmedAt ?? 0) < g6)
      return K(`Your like for ${L} has only just confirmed. Try again in a moment.`);
    let zt;
    y = !0;
    try {
      zt = t.likeState ? (await t.likeState(wt, w.song)).by : w.likedBy ?? [];
    } catch {
      zt = w.likedBy;
    } finally {
      y = !1;
    }
    if (!zt) return K(`Could not check ${L} right now. Try the heart again.`);
    const _e = Xt(), pe = ((bt == null ? void 0 : bt.status) === "confirmed" && typeof bt.liked == "boolean" && t.now() - (bt.confirmedAt ?? bt.created) < 5 * 6e4 ? bt.liked : void 0) ?? zt.includes(_e);
    if (!pe && zt.some(($n) => $n !== _e)) return K(U() ? `${L} was liked from another wallet of yours. Unlike it there.` : `${L} was liked from your main wallet${zt.includes(j) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await mi({ song: w.song, liked: !pe, title: w.title, artist: w.artist });
  }
  async function mi(w) {
    var J, ft, j;
    if (l) {
      Kt("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const L = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`, K = t.wait ?? ((gt) => new Promise((wt) => setTimeout(wt, gt)));
    try {
      Kt(`${w.liked ? "Liking" : "Unliking"} ${L}…`);
      const gt = t.now() + 12e4;
      for (; f || (oe() ? jt(Xt()).some((pe) => bo.includes(pe.status)) : Ze().length); ) {
        if (t.now() > gt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await K(5e3), await Ke(!0);
      }
      if (!oe() && le() !== "ready" || (s == null ? void 0 : s.state) !== "unlocked" || !s.session) throw new Error("Paying stopped before the like was sent.");
      const wt = Xt(), { balance: bt, nonce: zt } = await t.chain.account(wt);
      if (oe() ? c = { for: wt, value: bt, at: t.now() } : (o = bt, a = t.now()), vn(bt)) throw new Error(pc);
      const _e = await i.request("listening.signLike", {
        song: w.song,
        liked: w.liked,
        fee: ml.toString(),
        nonce: zt.toString(),
        balance: bt.toString()
      }), tn = {
        id: El(),
        address: wt,
        kind: "like",
        core: 0,
        song: w.song,
        liked: w.liked,
        recipient: "",
        amount: "0",
        fee: ml.toString(),
        nonce: zt.toString(),
        created: t.now(),
        status: "signed",
        raw: _e.raw,
        txid: _e.txid,
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(tn), et(tn);
      try {
        await t.chain.broadcast(_e.raw, _e.txid), et({ ...tn, status: "pending" }), S = `${w.liked ? "♥ Liked" : "Unliked"} ${L}`, B = "";
        try {
          (J = t.likeSent) == null || J.call(t, w.song, w.liked);
        } catch {
        }
      } catch (pe) {
        if (et({ ...tn, status: ki(pe) ? "failed" : "unknown", note: pe.message, ...ki(pe) ? { raw: void 0 } : {} }), B = pe.message, ki(pe)) try {
          (ft = t.likeFailed) == null || ft.call(t, w.song);
        } catch {
        }
      }
      s = await st(i);
    } catch (gt) {
      B = "Like not sent: " + (gt instanceof Error ? gt.message : "the listening wallet is unavailable");
      try {
        (j = t.likeFailed) == null || j.call(t, w.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), Wn();
    }
  }
  return { snapshot: yi, refresh: Ke, onListened: zr, heart: bi, toggleLike: rr, ...$s };
}
const aw = ["Connect", "Passkey", "Link & fund", "Listen"], cw = ["Passkey", "Add 1 STX", "Listen"], Bu = (t) => t ? cw : aw;
function w6(t) {
  if (t.solo) return b6(t);
  const e = aw.length, n = (r, i, s = !1) => ({ at: r, blocked: s, caption: r >= e ? i : `Step ${r + 1} of ${e} · ${i}` });
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
function b6(t) {
  const e = cw.length, n = (r, i, s = !1) => ({ at: r, blocked: s, caption: r >= e ? i : `Step ${r + 1} of ${e} · ${i}` });
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
function m6(t, e) {
  return !e || e.at >= Bu(!!t.solo).length || t.heard || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const x6 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function S6(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !x6(r.id)));
}
const E6 = {}, A6 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, v6 = (t) => {
  const e = E6;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, k6 = (t) => `/hiro/${t}`, $6 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, I6 = (t) => {
  const e = v6(t);
  if (e)
    return [$6(e)];
  const n = A6[t];
  return typeof window < "u" ? [`${window.location.origin}${k6(t)}`, ...n.filter((i) => !i.includes("hiro.so"))] : n;
}, L6 = {}, p0 = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, C6 = "xtrata.log.enabled", T6 = "xtrata.log.level", B6 = "xtrata.log.tags", M6 = "xtrata.log.dedupe", Ia = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, N6 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, P6 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, _6 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, U6 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, H6 = () => {
  const t = L6 ?? {}, e = Ia(C6) ?? t.VITE_LOG_ENABLED, n = Ia(T6) ?? t.VITE_LOG_LEVEL, r = Ia(B6) ?? t.VITE_LOG_TAGS, i = Ia(M6) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: N6(e),
    level: P6(n) ?? "warn",
    tags: U6(r),
    dedupe: _6(i)
  };
}, O6 = (t, e, n) => !t.enabled || p0[n] < p0[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), D6 = (t, e, n, r) => {
  const i = H6();
  if (!O6(i, e, t) || j6(i.dedupe))
    return;
  const s = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(s, r) : o(s);
}, F6 = /* @__PURE__ */ new Set();
let g0 = null;
const j6 = (t, e, n, r, i) => (g0 !== t && (F6.clear(), g0 = t), !1), z6 = (t, e, n) => D6("debug", t, e, n), R6 = {}, G6 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, K6 = (t) => {
  const e = R6, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : G6[t];
}, V6 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, q6 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return V6.test(n) ? n : null;
}, W6 = (t) => t.replace(/\/+$/, ""), X6 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), y0 = (t) => {
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
}, $i = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, Y6 = (t) => {
  var c, u;
  let e;
  try {
    e = hr(X8(t));
  } catch {
    return null;
  }
  const n = $i(e);
  if (!n || n.success === !1)
    return null;
  const r = $i(n.value), i = $i(r == null ? void 0 : r.value), s = $i(i == null ? void 0 : i.value);
  if (!s)
    return null;
  const o = y0((c = $i(s.name)) == null ? void 0 : c.value), a = y0((u = $i(s.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : q6(`${o}.${a}`);
}, Z6 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${W6(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, i = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [jy(vy(t.address))]
    }),
    signal: t.signal
  });
  if (!i.ok)
    throw new Error(`BNS primary lookup failed (${i.status})`);
  const s = await i.json();
  return !(s != null && s.okay) || typeof s.result != "string" ? null : Y6(s.result);
}, Q6 = async (t) => {
  const e = t.address.trim();
  if (!Ui(e))
    return null;
  const n = K6(t.network);
  if (!n)
    return null;
  let r = null;
  for (const i of I6(t.network))
    try {
      return await Z6({
        baseUrl: i,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (s) {
      r = s;
    }
  return z6("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: X6(r)
  }), null;
};
function J6(t, e, n = {}) {
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
const w0 = Object.freeze({
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
}), b0 = Object.freeze({ 139: "melophonic" });
function tk(t, e = "") {
  const n = String(t);
  return Object.hasOwn(w0, n) ? w0[n] : Object.hasOwn(b0, n) ? b0[n] : e;
}
const m0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function ek(t, e = "") {
  return Object.hasOwn(m0, String(t)) ? m0[String(t)] : e;
}
const lw = 10000n, Kf = 1000000n, gc = 3000n, nk = (t, e) => `${t}#gift=${e}`, rk = 100, La = (t, e = gi) => t <= Fe ? 0 : Number((t - Fe) / Bn(e)), x0 = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), uw = "xtrata.xyz/radio/gifts", Al = rk, sk = "Create a prefunded Xtrata radio gift batch", ik = (t) => ({
  domain: ni({ name: Xe(uw), version: Xe("1"), "chain-id": wr(1) }),
  message: ni({
    purpose: Xe(sk),
    creator: Xe(t.creator),
    count: wr(t.count),
    amount: wr(BigInt(t.amount)),
    label: Xe(t.label),
    issued: wr(t.issued),
    ...t.player ? { player: Xe(t.player) } : {}
  })
}), ok = (t, e, n = gi) => Fe + BigInt(t) * Bn(n) + (e ? Kc : 0n), ak = (t, e = gi) => Number((Kf - Fe - (t ? Kc : 0n)) / Bn(e)), ck = (t, e) => BigInt(t) * (e + gc);
function lk(t, e, n, r = gi) {
  const i = n ? Kc : 0n, s = e > Fe + i ? e - Fe - i : 0n, o = Number(s / Bn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * fc,
    fees: BigInt(o) * r,
    reserve: Fe,
    float: i,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: gc,
    perCopy: e + gc,
    total: ck(t, e)
  };
}
const uk = (t) => t >= lw && t <= Kf, S0 = 40, fk = "Create an Xtrata radio gift player", dk = /^[^\u0000-\u001f\u007f<>]+$/u;
function E0(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && dk.test(t) : !n;
}
function hk(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!E0(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!E0(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > S0) throw new Error(`A player holds 1 to ${S0} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const pk = (t) => Ip(Np(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), gk = (t) => ({
  domain: ni({ name: Xe(uw), version: Xe("1"), "chain-id": wr(1) }),
  message: ni({
    purpose: Xe(fk),
    admin: Xe(t.admin),
    player: Xe(t.hash),
    issued: wr(t.issued)
  })
}), Hi = (t) => t.tracks.filter((e) => !e.hidden), yk = (t) => t.tracks.find((e) => e.hidden) ?? null, wk = [300, 500, 1e3], A0 = 1800, vl = /* @__PURE__ */ new Map();
async function bk(t) {
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
function mk(t, e, n, r, i) {
  const s = document.createElement("button");
  return s.type = "button", s.className = r, s.dataset.feedback = t, (() => {
    const a = vl.get(t), c = !!a && a.until > Date.now();
    s.textContent = c ? a.label : e, s.classList.toggle("is-done", c && a.ok), s.classList.toggle("is-failed", c && !a.ok);
  })(), s.onclick = async () => {
    const a = await n();
    if (a) {
      vl.set(t, { ...a, until: Date.now() + A0 });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        vl.delete(t), i();
      }, A0 + 50);
    }
  }, s;
}
const Pi = (t, e, n, r, i) => mk(t, e, async () => await bk(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, i), Ls = "xtrata.radio.gift.incoming.v1", v0 = (t) => "xtrata.radio.gift.mine.v1:" + t, k0 = (t) => "xtrata.radio.gift.batches.v1:" + t, mt = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Br = (t, e, n = "") => {
  const r = mt("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, Ca = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, Fn = (t) => ur(t).replace(/\.?0+$/, "");
function xk(t) {
  let e = null;
  const n = ($) => [5e3, 1e4, 2e4, 3e4][$] ?? 6e4, r = (() => {
    try {
      const $ = new URL(location.href), F = new URLSearchParams($.hash.slice(1)).get("gift") ?? $.searchParams.get("gift");
      return F !== null && ($.searchParams.delete("gift"), history.replaceState(null, "", $.pathname + ($.search || ""))), x0(F) ? F : null;
    } catch {
      return null;
    }
  })(), i = (() => {
    try {
      const $ = JSON.parse(t.store.get(Ls) || "null");
      return x0($ == null ? void 0 : $.code) ? $.code : null;
    } catch {
      return null;
    }
  })(), s = r ?? i;
  if (s) {
    e = { code: s }, t.store.set(Ls, JSON.stringify({ code: s, at: t.now() }));
    let $ = 0;
    const F = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (U) => {
      const H = await U.json().catch(() => ({}));
      if (U.status === 404) {
        t.store.set(Ls, null), e = { ...e, error: (H == null ? void 0 : H.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!U.ok) throw new Error("busy");
      const ut = H;
      e = { ...e, view: ut, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(ut.status) && t.store.set(Ls, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void F(), n($++)));
    });
    F();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    const $ = e == null ? void 0 : e.view;
    return !($ != null && $.player) || !o() ? null : { player: $.player, from: u($), plays: La(BigInt($.amount)) };
  }, c = () => {
    e = null, t.store.set(Ls, null), t.changed();
  }, u = ($) => $.from ? t.who($.from) : $.label ? `Xtrata Radio · ${$.label}` : "Xtrata Radio";
  let f = {};
  const l = ($) => {
    if (f.box) return f.box;
    const F = mt("div", "", "ppp-gift-check");
    f.box = F;
    const U = () => {
      const H = window.turnstile;
      !H || f.rendered || (f.rendered = !0, H.render(F, { sitekey: $, callback: (ut) => {
        f.token = ut, t.changed();
      }, "expired-callback": () => {
        f.token = void 0;
      } }));
    };
    if (window.turnstile) U();
    else {
      const H = document.createElement("script");
      H.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", H.async = !0, H.onload = U, document.head.append(H);
    }
    return F;
  }, y = ($) => {
    queueMicrotask(() => void $());
  };
  let p;
  async function x($) {
    var H, ut, xt, ne, Yt, Zt, qt, Ne, He;
    if (!e || e.claiming || !$.listening) return;
    const F = !!((H = e.view) != null && H.player);
    if (F && !$.root) return;
    e.claiming = !0, e.error = void 0, (ut = t.claiming) == null || ut.call(t, !0), t.changed();
    const U = async (Ot) => {
      const Et = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: f.token, ...Ot })
      });
      return { res: Et, r: await Et.json().catch(() => ({})) };
    };
    try {
      let Ot = 0, Et = $.listening, Gt;
      if (F) {
        const ce = Number((xt = await t.json("/radio/gift/slots?root=" + encodeURIComponent($.root))) == null ? void 0 : xt.next);
        if (!Number.isSafeInteger(ce) || ce < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Ot = ce;
        for (let pn = 0; ; pn++) {
          const kn = await t.album.bind(Ot);
          if (Et = kn.address, Gt = await U({ wallet: Et, binding: kn }), Gt.res.status === 409 && /just taken/.test(((ne = Gt.r) == null ? void 0 : ne.error) || "") && pn < 5) {
            Ot += 1;
            continue;
          }
          break;
        }
      } else Gt = await U({ wallet: Et });
      const { res: Qt, r: Ee } = Gt;
      if (Qt.status === 503 && /sending another gift/.test((Ee == null ? void 0 : Ee.error) || "")) {
        e.waiting = !0, (Yt = t.claiming) == null || Yt.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!Qt.ok) {
        const ce = String((Ee == null ? void 0 : Ee.error) || "");
        if (Qt.status === 404 || Qt.status === 410 || Qt.status === 409 && /already had a gift|brand-new|already have this album/.test(ce))
          throw t.store.set(Ls, null), new Error(ce || "This gift cannot be opened.");
        if (Qt.status === 429 || Qt.status === 403 || Qt.status === 400 && !/wallet number/i.test(ce)) throw new Error(ce || `Could not open the gift (${Qt.status}).`);
        const kn = /topping up/.test(ce) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(ce) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(ce) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(kn), { retry: !0, slow: /topping up|not paid for yet/.test(ce) });
      }
      e.done = !0, t.store.set(Ls, null), F ? await t.album.arrived(Ot, Et, Ee.txid, BigInt(Ee.amount)) : t.giftSent(Ee.txid, BigInt(Ee.amount));
    } catch (Ot) {
      const Et = Ot, Gt = Et.name === "TypeError" || Et.name === "AbortError" || Et.name === "TimeoutError" || /wallet number/i.test(Et.message);
      if (Et.retry || Gt) {
        const Qt = e.tries ?? 0;
        e.tries = Qt + 1, e.retry = { text: Et.retry ? Et.message : "Still sending your gift… the network is slow, trying again." }, (Zt = t.claiming) == null || Zt.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, Et.slow ? 6e4 : n(Qt));
      } else
        e.error = Et.message, (qt = t.claiming) == null || qt.call(t, !1);
      f.token = void 0;
      try {
        (He = (Ne = window.turnstile) == null ? void 0 : Ne.reset) == null || He.call(Ne, f.box);
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
      const U = $.listening;
      S = { ...(S == null ? void 0 : S.wallet) === U ? S : {}, wallet: U, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(U)).then((H) => {
        var ut, xt;
        (S == null ? void 0 : S.wallet) === U && (S.state = (ut = H == null ? void 0 : H.gift) == null ? void 0 : ut.state, S.problem = ((xt = H == null ? void 0 : H.gift) == null ? void 0 : xt.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(S.state === "sending" && S.problem)) return [];
    const F = mt("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return F.title = `Network reply: ${S.problem}`, [F];
  }
  function z($, F, U = !1) {
    var Zt, qt;
    const H = F.player, ut = BigInt(F.amount), xt = U ? [] : [mt("p", `🎁 ${u(F)} sent you “${H.title}”${H.subtitle ? ` by ${H.subtitle}` : ""}: ${Hi(H).length} ${Hi(H).length === 1 ? "song" : "songs"} and ${La(ut).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!$.root && ["fund", "ready", "over", "link"].includes($.step))) {
      if (U) return xt;
      if (xt.push(mt("p", $.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : $.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), $.step === "intro") {
        const Ne = document.createElement("details");
        Ne.className = "ppp-how";
        const He = document.createElement("summary");
        He.textContent = "How does this work?", Ne.append(He, mt("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), xt.push(Ne);
      }
      return xt;
    }
    if ($.walletCannotAlbums)
      return xt.push(mt("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), xt;
    const Yt = (qt = (Zt = $.gate) == null ? void 0 : Zt.gifts) == null ? void 0 : qt.turnstileSiteKey;
    return Yt && !f.token ? xt.push(mt("p", "One quick check and it is yours:", "ppp-mute"), l(Yt)) : !e.claiming && !e.error && !e.waiting && !e.retry && y(() => x($)), xt.push(...R($, "Sending your album…")), xt;
  }
  function R($, F) {
    const U = [];
    return e.claiming || e.waiting ? U.push(mt("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : F, "ppp-cyan")) : e.retry && U.push(mt("p", e.retry.text, "ppp-warn"), Br("Try now", () => {
      clearTimeout(p), e.retry = void 0, x($);
    }, "quiet")), e.error && U.push(mt("p", e.error, "ppp-bad"), Br("Try again", () => {
      e.error = void 0, x($);
    })), U;
  }
  const A = ($) => {
    var F;
    return !!e && !e.done && !e.error && o() && !!$.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !$.linked && !$.creditedTo && ($.createdHere || $.brandNew || !!((F = e.view) != null && F.player)) && ($.balance ?? 0n) === 0n && !$.entries.length);
  };
  function _($, F = {}) {
    var He, Ot;
    const U = B($);
    if (!e || ["off", "elsewhere"].includes($.step)) return U;
    const H = e.view;
    if (e.error && !H) return [mt("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!H) return [mt("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return U;
    if (H.status === "claimed" || H.status === "claiming") return [mt("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(H.status)) return [mt("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (H.status === "pending-deposit") return [mt("p", `🎁 ${u(H)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (H.player) return [...z($, H, !!F.bare), ...U];
    if (!!$.listening && (!($.createdHere || $.brandNew) || !!$.linked || !!$.creditedTo || ($.balance ?? 0n) > 0n || $.entries.length > 0))
      return [mt("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), Br("Forget this gift link here", c, "quiet")];
    const xt = BigInt(H.amount), ne = La(xt).toLocaleString(), Zt = [mt(
      "p",
      `🎁 ${u(H)} sent you ${Fn(xt)} STX of on-chain music: about ${ne} paid plays.`,
      "ppp-gift"
    )], qt = !!$.listening && ($.createdHere || $.brandNew) && !$.linked && !$.creditedTo && $.step === "fund" && ($.balance ?? 1n) === 0n && !$.depositPending && !$.entries.length, Ne = (Ot = (He = $.gate) == null ? void 0 : He.gifts) == null ? void 0 : Ot.turnstileSiteKey;
    return qt ? (Ne && !f.token ? Zt.push(mt("p", "One quick check and it is yours:", "ppp-mute"), l(Ne)) : !e.claiming && !e.error && !e.waiting && !e.retry && y(() => x($)), Zt.push(...R($, "Sending your gift…"))) : $.step === "intro" ? Zt.push(mt("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : $.listening && $.linked ? Zt.push(mt("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), Br("Forget this gift link here", c, "quiet")) : $.listening && ($.balance ?? 0n) > 0n && Zt.push(mt("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), Br("Forget this gift link here", c, "quiet")), Zt;
  }
  async function N($, F, U) {
    var H;
    try {
      const ut = await t.json("/radio/gift/for?wallet=" + encodeURIComponent($));
      if ((H = ut == null ? void 0 : ut.gift) != null && H.returnTo) return { ok: !0, funder: ut.gift.returnTo, txId: ut.gift.txid ?? void 0, amount: ut.gift.amount, distinct: 1 };
    } catch {
      if (U) return { ok: !1 };
    }
    return F();
  }
  const Q = mt("div", "", "ppp-gift-fold");
  let tt = 250000n, G = "", V = "";
  const I = ($) => {
    try {
      const F = JSON.parse(t.store.get(v0($)) || "[]");
      return Array.isArray(F) ? F : [];
    } catch {
      return [];
    }
  }, P = ($, F) => t.store.set(v0($), JSON.stringify(F.slice(0, 50)));
  async function b($) {
    const F = I($);
    for (const U of F)
      if (!(U.view && ["claimed", "refunded", "expired"].includes(U.view.status)))
        try {
          U.view = !U.view || U.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: U.id, ...U.txid ? { txid: U.txid } : {} }) }) : await t.json("/radio/gift?id=" + U.id), U.error = void 0;
        } catch (H) {
          U.error = H.message;
        }
    P($, F), t.changed();
  }
  async function T($) {
    if (G) return;
    G = "Starting your gift…", V = "", t.changed();
    let F = null;
    try {
      F = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: $, amount: tt.toString() }) });
      const U = I($);
      U.unshift({ id: F.id, code: F.code, amount: tt.toString(), at: t.now() }), P($, U), G = "Approve the gift in your wallet…", t.changed();
      const H = await t.pay($, F.depositTo, BigInt(F.deposit), F.memo), ut = I($), xt = ut.find((ne) => ne.id === F.id);
      xt && (xt.txid = H, xt.view = { status: "pending-deposit", amount: tt.toString(), source: "friend", from: $, label: "", expires: 0 }), P($, ut), V = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", b($);
    } catch (U) {
      V = U.message || "Not sent.";
    } finally {
      G = "", t.changed();
    }
  }
  const D = ($) => "xtrata.radio.gift.players.v1:" + $, C = ($) => {
    try {
      const F = JSON.parse(t.store.get(D($)) || "[]");
      return Array.isArray(F) ? F.filter((U) => U && /^[0-9a-f]{16}$/.test(U.id)) : [];
    } catch {
      return [];
    }
  };
  async function ot($, F) {
    var U;
    if (!G) {
      G = "Checking the player…", V = "", t.changed();
      try {
        const H = F.tracks.split(/[\s,]+/).filter(Boolean).map((qt) => Number(qt.replace(/^#/, ""))), ut = hk({ title: F.title.trim(), subtitle: F.subtitle.trim(), tracks: H, cover: (U = F.cover) != null && U.trim() ? Number(F.cover.trim().replace(/^#/, "")) : null });
        G = "Sign in your wallet…", t.changed();
        const xt = { admin: $, hash: pk(ut), issued: t.now() }, ne = await t.sign($, gk(xt));
        G = "Making the player…", t.changed();
        const Yt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: ut, request: xt, signature: ne }) }), Zt = C($).filter((qt) => qt.id !== Yt.id);
        Zt.unshift({ id: Yt.id, title: Yt.title, tracks: Yt.tracks }), t.store.set(D($), JSON.stringify(Zt.slice(0, 30))), V = `${Yt.existing ? "That player already exists" : "Player made"} ✓ “${Yt.title}” · ${Yt.tracks} songs. Pick it below for a batch.`;
      } catch (H) {
        V = H.message || "Not made.";
      } finally {
        G = "", t.changed();
      }
    }
  }
  const X = ($, F) => nk($ || location.origin + "/radio.html", F), St = ($) => {
    try {
      const F = JSON.parse(t.store.get(k0($)) || "[]");
      return Array.isArray(F) ? F.filter((U) => U && /^[0-9a-f]{16}$/.test(U.id) && Array.isArray(U.codes)) : [];
    } catch {
      return [];
    }
  }, k = ($, F) => t.store.set(k0($), JSON.stringify(F.slice(0, 20))), m = ($) => !!$.view && $.view.status === "live" && $.view.copies.waiting + $.view.copies.claiming + $.view.copies.refunding === 0, q = ($, F) => t.json($, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(F) });
  let rt = 0;
  async function at($) {
    const F = St($);
    for (const U of F)
      if (!m(U))
        try {
          U.view = !U.view || U.view.status === "pending-deposit" ? await q("/radio/gift/batch/confirm", { id: U.id, ...U.txid ? { txid: U.txid } : {} }) : await t.json("/radio/gift/batch?id=" + U.id), U.error = void 0;
        } catch (H) {
          U.error = H.message;
        }
    try {
      const U = await t.json("/radio/gift/batches?creator=" + encodeURIComponent($));
      for (const H of (U == null ? void 0 : U.batches) ?? []) {
        const ut = F.find((xt) => xt.id === H.id);
        if (ut) {
          ut.error || (ut.view = H);
          continue;
        }
        F.push({ id: H.id, codes: [], count: H.count, amount: H.amount, label: H.label, player: H.player, depositTo: "", deposit: H.deposit, memo: H.memo, at: 0, view: H });
      }
    } catch {
    }
    k($, F), t.changed();
  }
  async function vt($, F) {
    const U = St($).find((H) => H.id === F);
    if (!(!U || !U.depositTo || G)) {
      G = "Approve the payment in your wallet…", V = "", t.changed();
      try {
        const H = await t.pay($, U.depositTo, BigInt(U.deposit), U.memo), ut = St($), xt = ut.find((ne) => ne.id === F);
        xt && (xt.txid = H), k($, ut), V = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", G = "", at($);
      } catch (H) {
        V = `${/cancel/i.test(H.message) ? "Payment cancelled." : H.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        G = "", t.changed();
      }
    }
  }
  async function te($, F, U, H) {
    if (G) return;
    if (!F.ok) {
      V = F.reason, t.changed();
      return;
    }
    G = "Sign in your wallet…", V = "", t.changed();
    let ut = null;
    try {
      const xt = { creator: $, count: F.count, amount: F.amount.toString(), label: U, issued: t.now(), ...H ? { player: H } : {} }, ne = await t.sign($, ik(xt));
      G = "Making your links…", t.changed(), ut = await q("/radio/gift/batch", { request: xt, signature: ne });
      const Yt = St($);
      Yt.unshift({ id: ut.id, codes: ut.codes, count: F.count, amount: ut.amount, label: U, player: H ?? null, depositTo: ut.depositTo, deposit: ut.deposit, memo: ut.memo, at: t.now() }), k($, Yt);
    } catch (xt) {
      V = xt.message || "Not made.", G = "", t.changed();
      return;
    }
    G = "", t.changed(), await vt($, ut.id);
  }
  function $t() {
    const $ = !!ee.value, F = hn.value === "max" ? ak($) : Number(hn.value), U = ok(F, $), H = Number(je.value);
    return !Number.isInteger(H) || H < 1 || H > Al ? { ok: !1, reason: `Make 1 to ${Al} copies at a time.`, album: $, plays: F, amount: U, count: H } : uk(U) ? { ok: !0, reason: "", album: $, plays: F, amount: U, count: H, bill: lk(H, U, $) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: $, plays: F, amount: U, count: H };
  }
  const Ht = () => {
    const $ = $t();
    if (!$.ok) return $.reason;
    const F = $.bill;
    return `Each copy: ${$.plays.toLocaleString()} paid plays (${Fn(F.holders)} to song holders, ${Fn(F.fees)} network fees)${$.album ? `, ${Fn(F.float)} for the album’s likes` : ""}, ${Fn(F.reserve)} kept so a listener can return what is left, + ${Fn(F.sendFee)} to send it = ${Fn(F.perCopy)} STX. ${$.count} copies = ${Fn(F.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Mt = ($, F) => F.codes.map((U) => X($, U)), jt = mt("input");
  jt.type = "range", jt.min = String(lw), jt.max = String(Kf), jt.step = "10000", jt.value = String(tt), jt.setAttribute("aria-label", "Gift amount");
  const et = mt("p", "", "ppp-gift-amount"), Se = Br("", () => {
    const $ = t.main();
    $ && T($);
  }, "primary"), An = () => {
    et.textContent = Ze(), Se.textContent = `Gift ${Fn(tt)} STX`;
  };
  jt.oninput = () => {
    tt = BigInt(jt.value), An();
  };
  const Ze = () => `${Fn(tt)} STX · about ${La(tt).toLocaleString()} paid plays · you pay ${Fn(tt + gc)} STX with the network fee`;
  An();
  const dn = mt("input");
  dn.maxLength = 60, dn.placeholder = "Title, e.g. Proof of Sound", dn.setAttribute("aria-label", "Player title");
  const Ie = mt("input");
  Ie.maxLength = 80, Ie.placeholder = "Artist (optional)", Ie.setAttribute("aria-label", "Player subtitle");
  const Be = mt("textarea");
  Be.rows = 3, Be.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Be.setAttribute("aria-label", "Songs");
  const Me = mt("input");
  Me.inputMode = "numeric", Me.placeholder = "Cover inscription number (optional), shown when the album loads", Me.setAttribute("aria-label", "Cover inscription");
  const ee = mt("select");
  ee.setAttribute("aria-label", "Batch album");
  const hn = mt("select");
  hn.setAttribute("aria-label", "Plays per copy");
  for (const $ of wk) hn.append(Ca(`${$.toLocaleString()} plays`, String($)));
  hn.append(Ca("Max (1 STX)", "max"));
  const je = mt("input");
  je.type = "number", je.min = "1", je.max = String(Al), je.value = "10", je.setAttribute("aria-label", "Copies");
  const be = mt("input");
  be.maxLength = 40, be.placeholder = "Label, e.g. Opera launch", be.setAttribute("aria-label", "Batch label");
  const Xt = mt("p", "", "ppp-mute"), oe = () => {
    Xt.textContent = Ht();
  };
  for (const $ of [ee, hn, je])
    $.oninput = oe, $.onchange = oe;
  oe();
  function Ue($) {
    var ut, xt;
    const F = (ut = $.gate) == null ? void 0 : ut.gifts;
    if (!(F != null && F.enabled) || !F.admin || ["off", "elsewhere", "unsupported"].includes($.step)) return null;
    const U = t.main(), H = [mt("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!U)
      H.push(mt("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (F.admin) {
      const ne = mt("div", "", "ppp-gift-admin"), Yt = (Ot, Et) => {
        const Gt = mt("label", Ot);
        return Gt.append(Et), Gt;
      }, Zt = C(U);
      ne.append(
        mt("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        dn,
        Ie,
        Be,
        Me,
        Br("Sign and make player", () => void ot(U, { title: dn.value, subtitle: Ie.value, tracks: Be.value, cover: Me.value }))
      );
      const qt = Br("Sign, pay and make links", () => {
        te(U, $t(), be.value.trim(), ee.value || void 0);
      });
      qt.disabled = !!G;
      const Ne = ee.value;
      ee.replaceChildren(Ca("No album (starter copies)", ""), ...Zt.map((Ot) => Ca(`${Ot.title} · ${Ot.tracks} songs`, Ot.id))), Zt.some((Ot) => Ot.id === Ne) && (ee.value = Ne), oe(), ne.append(
        mt("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        Yt("Album ", ee),
        Yt("Plays each ", hn),
        Yt("Copies ", je),
        be,
        Xt,
        qt
      ), t.now() - rt > 3e4 && (rt = t.now(), at(U));
      const He = St(U);
      if (He.length) {
        const Ot = mt("ul", "", "ppp-gift-list");
        for (const Et of He.slice(0, 10)) {
          const Gt = Et.view, Qt = Gt == null ? void 0 : Gt.copies, Ee = Et.error ? Et.error : !Gt || Gt.status === "pending-deposit" ? Et.txid ? "payment confirming…" : "waiting for your payment" : `${Qt.claimed} of ${Gt.count} claimed${Qt.refunding + Qt.refunded ? ` · ${Qt.refunded} refunded${Qt.refunding ? `, ${Qt.refunding} on their way` : ""}` : ""}`, ce = mt("li");
          if (ce.append(mt("span", `${Et.label || "Batch"} · ${Et.count} × ${Fn(BigInt(Et.amount))} STX`, "t"), mt("span", Ee, "ppp-mute")), !Et.txid && Et.depositTo && (!Gt || Gt.status === "pending-deposit") && ce.append(Br("Pay now", () => void vt(U, Et.id), "tiny")), Et.codes.length && (Gt == null ? void 0 : Gt.status) === "live") {
            const pn = Mt(((xt = $.gate) == null ? void 0 : xt.radioUrl) ?? null, Et);
            ce.append(
              Pi("batch-copy:" + Et.id, "Copy all links", () => pn.join(`
`), "tiny", t.changed),
              Pi("batch-csv:" + Et.id, "Copy as CSV", () => ["copy,link", ...pn.map((kn, Ar) => `${Ar + 1},${kn}`)].join(`
`), "tiny", t.changed)
            );
          } else Et.codes.length || ce.append(mt("span", "links were made on another device", "ppp-mute"));
          Ot.append(ce);
        }
        ne.append(Ot);
      }
      H.push(ne);
    }
    return G && H.push(mt("p", G, "ppp-cyan")), V && H.push(mt("p", V, /✓/.test(V) ? "ppp-ok" : "ppp-warn")), Q.replaceChildren(...H), Q;
  }
  return { banner: _, funder: N, renderFold: Ue, liveGift: o, incomingAlbum: a, setAside: c, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: A };
}
const Sk = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function Ek(t) {
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
const Ak = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((i) => !i.hidden).flatMap((i) => [i.title, i.artist])].filter(Boolean).join(" ").toLowerCase();
};
function vk(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((s) => (!e.pinnedOnly || e.pins.has(s.slot)) && (() => {
    const o = Ak(s);
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
function kk(t, e = 100) {
  const n = Object.entries(t).sort((r, i) => i[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, i]) => [Number(r), i]));
}
const Mu = /* @__PURE__ */ new Set(), fw = (t) => (Mu.add(t), () => {
  Mu.delete(t);
}), Nu = () => {
  for (const t of [...Mu])
    try {
      t();
    } catch {
    }
}, $0 = "xtrata:al-thumb:v1:", dw = "-", mo = 96, $k = 24 * 1024 * 1024, on = /* @__PURE__ */ new Map(), I0 = /* @__PURE__ */ new Set(), Pu = [];
let kl = !1, $l;
const yc = (t, e) => {
  try {
    if (e === void 0) return window.localStorage.getItem($0 + t);
    window.localStorage.setItem($0 + t, e);
  } catch {
  }
  return null;
};
function Vf(t) {
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
          r.width = r.height = mo, i.fillStyle = "#143a40", i.fillRect(0, 0, mo, mo), i.drawImage(s, (s.naturalWidth - a) / 2, (s.naturalHeight - a) / 2, a, a, 0, 0, mo, mo), e(r.toDataURL("image/jpeg", 0.82));
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
async function Ik(t) {
  var c, u, f, l, y;
  const e = await fetch("/inscription/" + t, { signal: AbortSignal.timeout(6e4) }), n = (e.headers.get("content-type") || "").toLowerCase();
  if (!e.ok)
    return await ((c = e.body) == null ? void 0 : c.cancel()), null;
  if (n.startsWith("image/"))
    return await ((u = e.body) == null ? void 0 : u.cancel()), "/inscription/" + t;
  if (!n.includes("text/html"))
    return await ((f = e.body) == null ? void 0 : f.cancel()), "";
  let r = "", i = 0;
  const s = (p) => {
    let x = 0;
    for (; ; ) {
      const S = r.slice(x).search(/<img\b/i);
      if (S < 0)
        return r = p ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const B = x + S, z = r.indexOf(">", B);
      if (z < 0)
        return r = r.slice(B), null;
      const R = r.slice(B, z + 1), A = R.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (A) return A[1].replace(/&amp;/g, "&");
      const _ = R.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (_) return "/inscription/" + _[1];
      x = z + 1;
    }
  }, o = (y = (l = e.body) == null ? void 0 : l.getReader) == null ? void 0 : y.call(l);
  if (!o)
    return r = await e.text(), s(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: p, value: x } = await o.read();
    if (p) break;
    i += x.byteLength, r += a.decode(x, { stream: !0 });
    const S = s(!1);
    if (S)
      return await o.cancel(), S;
    if (i > $k)
      return await o.cancel(), null;
  }
  return r += a.decode(), s(!0) ?? "";
}
async function Lk() {
  if (!kl) {
    kl = !0;
    try {
      for (; Pu.length; ) {
        const t = Pu.shift();
        if (!on.has(t))
          try {
            const e = await Ik(t);
            if (e === null) continue;
            if (!e) {
              on.set(t, ""), yc(t, dw), Nu();
              continue;
            }
            const n = await Vf(e);
            on.set(t, n), n.startsWith("data:image/jpeg") && yc(t, n), Nu();
          } catch {
          }
      }
    } finally {
      kl = !1;
    }
  }
}
function hw(t, e) {
  if (e && !on.get(t) ? (on.set(t, e), Vf(e).then((r) => {
    r !== e && (on.set(t, r), r.startsWith("data:image/jpeg") && yc(t, r), Nu());
  })) : e === "" && !on.has(t) && on.set(t, ""), on.has(t)) return on.get(t);
  const n = yc(t);
  if (n != null) {
    const r = n === dw ? "" : n;
    return on.set(t, r), r;
  }
  return I0.has(t) || (I0.add(t), Pu.push(t), $l || ($l = setTimeout(() => {
    $l = void 0, Lk();
  }, 1200))), "";
}
const Ii = 12, Ck = 5e3, nn = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Li = (t, e, n = "") => {
  const r = nn("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function Tk(t) {
  let e, n = [], r = 0, i = !1, s = !1, o = -1 / 0, a = "", c = "recent", u = !1, f = Ii;
  const l = nn("div", "", "ppp-shelf-box");
  fw(() => t.changed());
  const y = (b) => "xtrata.radio.shelf.pins.v1:" + b, p = (b) => "xtrata.radio.shelf.recent.v1:" + b, x = (b, T) => {
    try {
      return JSON.parse(t.store.get(b) || "null") ?? T;
    } catch {
      return T;
    }
  }, S = (b) => new Set(x(y(b), []).filter((T) => Number.isSafeInteger(T))), B = (b) => {
    const T = x(p(b), {}), D = {};
    for (const [C, ot] of Object.entries(T)) Number.isSafeInteger(Number(C)) && typeof ot == "number" && (D[Number(C)] = ot);
    return D;
  };
  async function z(b) {
    if (!i) {
      i = !0, s = !1;
      try {
        const T = [];
        let D = 0, C = 0;
        for (let ot = 0; ot < Ck / 100 + 1; ot++) {
          const X = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(b)}&after=${D}&limit=100`);
          if (T.push(...Ek(X == null ? void 0 : X.shelf)), C = Number(X == null ? void 0 : X.total) || T.length, !(X != null && X.next) || !Number.isSafeInteger(X.next)) break;
          D = X.next;
        }
        b === e && (n = T, r = C, o = t.now());
      } catch {
        s = !0;
      } finally {
        i = !1, t.changed();
      }
    }
  }
  const R = () => {
    o = -1 / 0;
  }, A = nn("input");
  A.type = "search", A.placeholder = "Search title, artist or #", A.setAttribute("aria-label", "Search your albums"), A.oninput = () => {
    a = A.value, f = Ii, t.changed();
  };
  const _ = nn("select");
  _.setAttribute("aria-label", "Sort albums");
  for (const b of Sk) {
    const T = document.createElement("option");
    T.value = b.value, T.textContent = b.label, _.append(T);
  }
  _.onchange = () => {
    c = _.value, f = Ii, t.changed();
  };
  const N = Li("", () => {
    u = !u, f = Ii, t.changed();
  }, "tiny"), Q = nn("div", "", "ppp-shelf-tools");
  Q.append(A, _, N);
  const tt = nn("div"), G = nn("div");
  function V(b) {
    const T = b.step === "off" || b.step === "elsewhere" ? void 0 : b.root;
    if (T !== e && (e = T, n = [], r = 0, o = -1 / 0, f = Ii), !T || b.walletCannotAlbums) return null;
    if (!i && t.now() - o > 5 * 6e4 && z(T), !n.length)
      return s ? (G.replaceChildren(nn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Li("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(G), l) : null;
    const D = S(T), C = B(T), ot = vk(n, { query: a, sort: c, pinnedOnly: u, pins: D, recents: C });
    A.value !== a && (A.value = a), _.value = c, N.textContent = u ? "★ Pinned only" : "☆ Pinned only", N.setAttribute("aria-pressed", String(u));
    const X = [];
    if (b.slot > 0 && X.push(Li("← My player", () => t.open(0), "quiet")), !ot.length) X.push(nn("p", "No album matches that.", "ppp-mute"));
    else {
      const St = nn("ul", "", "ppp-shelf-list");
      for (const k of ot.slice(0, f)) {
        const m = nn("li", "", k.slot === b.slot ? "now" : ""), q = D.has(k.slot), rt = Li(q ? "★" : "☆", () => {
          const Se = new Set(D);
          q ? Se.delete(k.slot) : Se.add(k.slot), t.store.set(y(T), JSON.stringify([...Se])), t.changed();
        }, "tiny");
        rt.setAttribute("aria-label", q ? `Unpin ${k.player.title}` : `Pin ${k.player.title}`);
        const at = [k.player.subtitle, `${Hi(k.player).length} ${Hi(k.player).length === 1 ? "song" : "songs"}`, k.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), vt = k.slot === b.slot, te = Li(vt ? "Playing" : "Select", () => {
          t.store.set(p(T), JSON.stringify(kk({ ...C, [k.slot]: t.now() }))), t.open(k.slot);
        }, vt ? "tiny ppp-pick" : "tiny primary ppp-pick");
        te.disabled = vt;
        const $t = Hi(k.player)[0], Ht = k.player.cover ?? ($t == null ? void 0 : $t.id), Mt = Ht ? hw(String(Ht)) : "", jt = nn("span", "", "ppp-shelf-art");
        if (Mt) {
          const Se = document.createElement("img");
          Se.src = Mt, Se.alt = "", Se.decoding = "async", jt.append(Se);
        } else jt.textContent = "💿";
        const et = nn("span", "", "ppp-shelf-txt");
        et.append(nn("span", k.player.title, "t"), nn("span", at, "ppp-mute")), m.append(rt, jt, et, te), St.append(m);
      }
      X.push(St), ot.length > f && X.push(Li(`Show more (${ot.length - f} left)`, () => {
        f += Ii, t.changed();
      }, "quiet"));
    }
    return s && X.push(nn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), tt.replaceChildren(...X), l.firstChild !== Q && l.replaceChildren(Q, tt), l;
  }
  return { render: V, invalidate: R, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const b = B(e), T = [...n].filter((D) => D.player).sort((D, C) => (b[C.slot] ?? 0) - (b[D.slot] ?? 0) || C.slot - D.slot)[0];
    return T ? { slot: T.slot, title: T.player.title } : null;
  } };
}
const Bk = 20, We = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, Ae = {
  grid: We('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: We('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: We('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: We('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: We('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: We('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: We('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: We('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: We('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: We('<path d="M6 9l6 6 6-6"/>', 18),
  right: We('<path d="M9 6l6 6-6 6"/>', 16),
  close: We('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: We('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: We('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: We('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: We('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: We('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function Z(t, e = {}, ...n) {
  const r = document.createElement(t);
  for (const [i, s] of Object.entries(e))
    s == null || s === !1 || (i === "class" ? r.className = String(s) : i === "html" ? r.innerHTML = String(s) : i.startsWith("on") && typeof s == "function" ? r[i.toLowerCase()] = s : i === "disabled" ? r.disabled = !!s : r.setAttribute(i, s === !0 ? "" : String(s)));
  for (const i of n) i != null && i !== !1 && r.append(i);
  return r;
}
const en = (t, ...e) => Z("button", { type: "button", ...t }, ...e), Ta = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, xo = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, Mk = { music: "My music", device: "This device", gifts: "Albums (admin)" }, Nk = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function L0(t, e, n = {}) {
  const r = !!n.list;
  let i = null, s = "", o = !1;
  const a = document.documentElement, c = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set();
  function f(b) {
    var D, C, ot;
    if (!b || !Number.isSafeInteger(b)) return "";
    const T = (ot = (C = (D = e.radio()) == null ? void 0 : D.getState) == null ? void 0 : C.call(D)) == null ? void 0 : ot.albumCover;
    return T != null && T.url && Number(T.tokenId) === b ? T.url : c.has(b) ? c.get(b) : (u.has(b) || (u.add(b), fetch("/inscription/" + b, { signal: AbortSignal.timeout(2e4) }).then(async (X) => {
      var k, m, q, rt;
      const St = (X.headers.get("content-type") || "").toLowerCase();
      if (!X.ok)
        throw await ((k = X.body) == null ? void 0 : k.cancel()), new Error("no cover");
      return St.startsWith("image/") ? (await ((m = X.body) == null ? void 0 : m.cancel()), "/inscription/" + b) : St.includes("text/html") ? (((q = (await X.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : q[1]) ?? "").replace(/&amp;/g, "&") : (await ((rt = X.body) == null ? void 0 : rt.cancel()), "");
    }).then((X) => {
      c.set(b, X), P();
    }).catch(() => {
      u.delete(b);
    })), "");
  }
  fw(() => P());
  function l(b) {
    var D;
    s = b, b ? a.dataset.sheet = b : delete a.dataset.sheet;
    const T = document.querySelector(".side");
    if (b && b !== "more") {
      for (const X of Nk[b]) {
        const St = T == null ? void 0 : T.querySelector(X);
        St && (St.open = !0);
      }
      const C = document.getElementById("sheetTitle");
      C && (C.textContent = Mk[b]);
      const ot = document.getElementById("sheetExtra");
      ot && ot.replaceChildren(...b === "music" ? [p()] : []), (D = T == null ? void 0 : T.scrollTo) == null || D.call(T, { top: 0 });
    }
    P();
  }
  const y = r ? null : document.getElementById("sheetClose");
  y && (y.onclick = () => l("")), r || document.addEventListener("keydown", (b) => {
    b.key === "Escape" && s && a.dataset.view === "album" && l("");
  });
  const p = () => en(
    { class: "al-row", onClick: () => {
      l(""), e.openPlayer();
    } },
    Z("span", { class: "al-row-i", html: Ae.radio }),
    Z("span", { class: "al-row-t" }, Z("b", {}, "Xtrata Radio"), Z("small", {}, "Every song on-chain · FM, liked, all")),
    Z("span", { class: "al-row-go", html: Ae.right })
  );
  let x = null, S = !1;
  const B = () => {
    var T;
    const b = e.radio();
    S || !(b != null && b.subscribe) || (S = !0, b.subscribe((D) => {
      x = D, (i == null ? void 0 : i.mode) === "open" && P();
    }), x = ((T = b.getState) == null ? void 0 : T.call(b)) ?? null);
  };
  r || setInterval(() => {
    var C, ot;
    if ((i == null ? void 0 : i.mode) !== "open" || !(x != null && x.playing)) return;
    const b = (ot = (C = e.radio()) == null ? void 0 : C.getPosition) == null ? void 0 : ot.call(C), T = t.querySelector(".al-bar > i"), D = t.querySelectorAll(".al-times span");
    !b || !T || (T.style.width = b.duration ? `${Math.min(100, b.current / b.duration * 100)}%` : "0%", D.length === 2 && (D[0].textContent = Ta(b.current || 0), D[1].textContent = b.duration ? Ta(b.duration) : "–:––"));
  }, 500);
  let z = "", R = null;
  function A(b, T, D = {}) {
    const C = D.song || f(b.cover), X = [C ? Z("img", { src: C, alt: D.song ? "Song artwork" : `${b.title} cover` }) : Z("div", { class: "al-cover-fallback" }, Z("b", {}, b.title), b.subtitle ? Z("span", {}, b.subtitle) : null), D.paused ? Z("span", { class: "al-paused" }, Z("i", { html: Ae.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], St = "al-cover" + (T ? "" : " al-cover--small") + (D.paused ? " is-paused" : "");
    return D.flip ? (X.push(Z("span", { class: "al-flip", "aria-hidden": "true", html: Ae.flip })), en({ class: St + " is-flippable", "aria-label": D.flipped ? "Show this song’s artwork" : `Show the ${b.title} cover`, onClick: D.flip }, ...X)) : Z("div", { class: St }, ...X);
  }
  function _(b) {
    return b.plays === null || b.plays === void 0 ? Z("span", { class: "al-chip al-chip--quiet" }, b.playsComing ? "Plays on their way…" : "…") : b.plays === 0 ? Z("span", { class: "al-chip al-chip--out" }, b.playsComing ? "Plays on their way…" : "No plays left") : Z("span", { class: "al-chip" + (b.plays <= Bk ? " al-chip--low" : "") }, `${xo(b.plays, "play", "plays")} left`);
  }
  function N(b) {
    const T = b.player, D = T.tracks.filter((ot) => !ot.hidden), C = [];
    return b.mode === "arrive" && b.from && C.push(Z("p", { class: "al-from" }, Z("span", { html: Ae.gift }), Z("span", {}, Z("b", {}, b.from), " sent you an album"))), C.push(A(T, !0)), C.push(Z(
      "div",
      { class: "al-intro" },
      Z("h1", {}, T.title),
      T.subtitle ? Z("p", { class: "al-artist" }, T.subtitle) : null,
      D.length ? Z("p", { class: "al-songline" }, D.map((ot) => ot.title || `#${ot.id}`).join(" · ")) : null,
      Z("span", { class: "al-chip" }, [xo(D.length, "song", "songs"), b.offered ? xo(b.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), b.status.length && C.push(Z("div", { class: "al-status", role: "status" }, ...b.status)), C.push(Z("div", { class: "al-grow" })), b.asking ? C.push(Z("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : b.primary && C.push(en({ class: "al-primary", onClick: b.primary.run, disabled: b.busy }, Z("span", { html: Ae.playSmall }), b.primary.label)), b.hint && !b.asking && C.push(Z("p", { class: "al-hint" }, b.hint)), b.secondary && !b.asking && C.push(en({ class: "al-link", onClick: b.secondary.run, disabled: b.busy }, b.secondary.label)), C;
  }
  function Q(b, T) {
    const { songs: D, current: C, started: ot, own: X, out: St, waiting: k } = T, m = b.player, q = e.radio(), rt = [];
    rt.push(Z("div", { class: "al-listhead" }, Z("span", {}, Z("b", {}, m.title), ` · ${xo(D.length, "song", "songs")}`), _(b)));
    const at = f(m.cover), vt = "album:" + m.cover;
    at && !on.has(vt) && (on.set(vt, at), Vf(at).then(($t) => {
      $t !== at && (on.set(vt, $t), P());
    }));
    const te = at ? on.get(vt) || at : "";
    return rt.push(Z("ol", { class: "al-tracks" }, ...D.map(($t, Ht) => {
      const Mt = String($t.id) === C, jt = hw(String($t.id), Mt && ot ? X : void 0);
      return Z("li", {}, en(
        { class: "al-track" + (Mt ? " is-on" : ""), "aria-label": `Play ${$t.title || "#" + $t.id}`, "aria-current": Mt ? "true" : void 0, disabled: St || k, onClick: () => {
          var et;
          return (et = q == null ? void 0 : q.playToken) == null ? void 0 : et.call(q, $t.id);
        } },
        Z(
          "span",
          { class: "al-th" + (jt ? "" : " is-blank") },
          jt ? Z("img", { src: jt, alt: "", decoding: "async" }) : te ? Z("img", { src: te, alt: "", decoding: "async" }) : null,
          jt ? null : Z("span", { class: "al-n" }, String(Ht + 1)),
          Mt ? Z("span", { class: "al-eq", html: Ae.eq }) : null
        ),
        Z("span", { class: "al-tt" }, $t.title || `#${$t.id}`)
      ));
    }))), rt;
  }
  function tt(b) {
    var jt;
    const T = b.player, D = T.tracks.filter((et) => !et.hidden), C = e.radio(), ot = x == null ? void 0 : x.nowPlaying, X = ot && T.tracks.some((et) => String(et.id) === String(ot.tokenId)) ? String(ot.tokenId) : null, St = X ? T.tracks.find((et) => String(et.id) === X) : null, k = b.plays === 0 && !b.playsComing, m = !!b.playsComing && !b.plays, q = !!(x != null && x.playing) && !!X, rt = x == null ? void 0 : x.heart, at = X ? (jt = C == null ? void 0 : C.getPosition) == null ? void 0 : jt.call(C) : null;
    X && (q || ((at == null ? void 0 : at.current) ?? 0) > 0.5) && (z = T.id);
    const vt = !!X && z === T.id;
    R && R !== X && (R = null);
    const te = vt ? String((ot == null ? void 0 : ot.cover) || "") : "", $t = !!te && R === X, Mt = [A(T, !k, { song: $t ? "" : te, paused: vt && !q, flip: te ? () => {
      R = R === X ? null : X, P();
    } : void 0, flipped: $t })];
    if (Mt.push(Z(
      "div",
      { class: "al-now" },
      Z(
        "div",
        { class: "al-now-t" },
        Z("div", { class: "al-song" }, St ? St.title || (ot == null ? void 0 : ot.title) || `#${St.id}` : T.title),
        Z("div", { class: "al-artist" }, St ? St.artist || (ot == null ? void 0 : ot.artist) || T.subtitle : T.subtitle || "Press play")
      ),
      X ? en({ class: "al-icon" + (rt != null && rt.liked ? " is-on" : ""), "aria-label": rt != null && rt.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(rt != null && rt.liked)), disabled: !!(rt != null && rt.pending) || !!(rt != null && rt.locked) || m, onClick: () => {
        var et;
        return (et = C == null ? void 0 : C.toggleLike) == null ? void 0 : et.call(C);
      }, html: rt != null && rt.liked ? Ae.heartOn : Ae.heart }) : null
    )), k)
      Mt.push(Z(
        "div",
        { class: "al-out" },
        Z("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        Z("p", { class: "al-out-t" }, "You've played this album out"),
        Z("p", { class: "al-out-s" }, "Add plays to keep listening."),
        G(b, !0)
      ));
    else {
      const et = at != null && at.duration ? Math.min(100, at.current / at.duration * 100) : 0;
      Mt.push(Z(
        "div",
        { class: "al-prog" },
        Z("div", { class: "al-bar" }, Z("i", { style: `width: ${et}%` })),
        Z("div", { class: "al-times" }, Z("span", {}, Ta((at == null ? void 0 : at.current) || 0)), Z("span", {}, at != null && at.duration ? Ta(at.duration) : "–:––"))
      ));
    }
    return Mt.push(Z(
      "div",
      { class: "al-ctl" + (k || m ? " is-off" : "") },
      en({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: k || m, onClick: () => {
        var et;
        return (et = C == null ? void 0 : C.prev) == null ? void 0 : et.call(C);
      }, html: Ae.prev }),
      en({ class: "al-play", "aria-label": q ? "Pause" : "Play", disabled: k || m, onClick: () => {
        var et;
        return (et = C == null ? void 0 : C.playPause) == null ? void 0 : et.call(C);
      }, html: q ? Ae.pause : Ae.play }),
      en({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: k || m, onClick: () => {
        var et;
        return (et = C == null ? void 0 : C.next) == null ? void 0 : et.call(C);
      }, html: Ae.next })
    )), b.status.length && Mt.push(Z("div", { class: "al-status", role: "status" }, ...b.status)), Mt.push(...Q(b, { songs: D, current: X, started: vt, own: te, out: k, waiting: m })), Mt.push(Z("div", { class: "al-grow" })), Mt.push(en(
      { class: "al-more", "aria-expanded": String(s === "more"), onClick: () => l(s === "more" ? "" : "more") },
      Z("span", {}, "More ", Z("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      Z("span", { html: Ae.down })
    )), Mt;
  }
  function G(b, T) {
    const D = Z("div", { class: "al-topups" + (T ? " al-topups--primary" : "") }), C = T ? [b.topUps[1] ?? b.topUps[0]] : [...b.topUps];
    for (const ot of C) {
      const X = b.myPlays !== void 0 && b.myPlays >= ot && !b.playsComing && !b.busy;
      D.append(en({ class: "al-topup", disabled: !X, onClick: () => e.topUp(ot) }, T ? `Add ${ot.toLocaleString()} plays` : `+${ot.toLocaleString()}`));
    }
    return T && D.append(en({ class: "al-link", onClick: () => l("more") }, "Other amounts")), D;
  }
  function V(b) {
    const T = b.myPlays !== void 0 && b.myPlays >= (b.topUps[0] ?? 0), D = Z(
      "div",
      { class: "al-card" },
      Z("div", { class: "al-card-h" }, Z("b", {}, `Add plays to ${b.player.title}`), Z("span", { class: "al-mono" }, b.plays === null || b.plays === void 0 ? "" : `${b.plays.toLocaleString()} left`)),
      G(b, !1),
      Z("p", { class: "al-mute al-small" }, b.playsComing ? "Plays are on their way. Add more once they arrive." : b.myPlays === void 0 ? "Checking My player…" : T ? `Moved from My player · ${xo(b.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !T && !b.playsComing && b.myPlays !== void 0 ? en({ class: "al-link", onClick: () => {
        l(""), e.openPlayer();
      } }, "Open My player") : null
    ), C = (X, St, k, m) => en(
      { class: "al-row", onClick: m },
      Z("span", { class: "al-row-i", html: X }),
      Z("span", { class: "al-row-t" }, Z("b", {}, St), Z("small", {}, k)),
      Z("span", { class: "al-row-go", html: Ae.right })
    ), ot = Z(
      "div",
      { class: "al-how" + (o ? " is-open" : "") },
      C(Ae.info, "How plays work", "Every play counts for the song’s owner", () => {
        o = !o, P();
      }),
      o ? Z("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return Z(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      Z("div", { class: "al-sheet-h" }, Z("b", {}, "More"), en({ class: "al-icon", "aria-label": "Close", onClick: () => l(""), html: Ae.close })),
      b.mode === "open" ? D : null,
      Z(
        "div",
        { class: "al-rows" },
        C(Ae.grid, "My music", "Your albums and the radio", () => l("music")),
        C(Ae.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          l(""), e.openPlayer();
        }),
        b.canMake ? C(Ae.gift, "Albums (admin)", "Make an album and fund copies", () => l("gifts")) : null,
        C(Ae.device, "This device", "Backup, history, Stacks wallet, returns", () => l("device")),
        ot
      )
    );
  }
  function I(b) {
    var k, m;
    const T = b.player, D = x == null ? void 0 : x.nowPlaying, C = D && T.tracks.some((q) => String(q.id) === String(D.tokenId)) ? String(D.tokenId) : null, ot = !!(x != null && x.playing) && !!C, X = C ? (m = (k = e.radio()) == null ? void 0 : k.getPosition) == null ? void 0 : m.call(k) : null;
    C && (ot || ((X == null ? void 0 : X.current) ?? 0) > 0.5) && (z = T.id);
    const St = !!C && z === T.id;
    return Q(b, {
      songs: T.tracks.filter((q) => !q.hidden),
      current: C,
      started: St,
      own: St ? String((D == null ? void 0 : D.cover) || "") : "",
      out: b.plays === 0 && !b.playsComing,
      waiting: !!b.playsComing && !b.plays
    });
  }
  function P() {
    const b = i;
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
    const T = Z(
      "header",
      { class: "al-top" },
      Z("a", { class: "al-brand", href: "/radio" }, "Xtrata ", Z("b", {}, "Music")),
      b.mode === "open" ? en({ class: "al-icon", "aria-label": "My music", onClick: () => l("music"), html: Ae.grid }) : null
    ), D = Z("div", { class: "al-body al-body--" + b.mode }, ...b.mode === "open" ? tt(b) : N(b));
    t.replaceChildren(T, D, ...s === "more" ? [Z("div", { class: "al-scrim", onClick: () => l("") }), V(b)] : []);
  }
  return {
    render(b) {
      if (r) {
        i = b, P();
        return;
      }
      const T = !!i;
      i = b, !b && (T || s) && (s = "", delete a.dataset.sheet), b ? a.dataset.view = "album" : delete a.dataset.view, b != null && b.asking ? a.dataset.asking = "1" : delete a.dataset.asking, P();
    },
    sheet: () => s,
    setSheet: l
  };
}
const Pk = [
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
function _k(t) {
  for (const [e, n] of Pk) if (n.test(t)) return e;
  return null;
}
const pw = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), gw = (t) => /Android/.test(t);
function Uk(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : pw(e) ? "x-safari-" + n.href : gw(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const Hk = (t) => pw(t) ? "Safari" : gw(t) ? "Chrome" : "your browser", So = "Xtrata Music Wallet";
function C0(t) {
  var e;
  if (!((e = t.gate) != null && e.passkeyOnly) || t.main || t.step === "off" || t.step === "elsewhere" || t.step === "not-invited" || !t.solo) return null;
  switch (t.step) {
    case "unsupported":
      return { action: null, label: So, detail: "This browser can't make one. Open the page in Safari or Chrome.", disabled: !0 };
    case "intro":
      return { action: "create", label: So, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." };
    case "locked":
      return { action: "unlock", label: So, detail: "Open the one on this device with Face ID or your fingerprint." };
    case "loading":
      return { action: "show", label: So, detail: "Face ID or your fingerprint. No app or seed phrase." };
    default:
      return { action: "show", label: So, detail: "Open on this device." };
  }
}
const T0 = document.getElementById("ppp");
T0 && Ok(T0);
function Ok(t) {
  var vs;
  const e = jw(), n = (d) => t.querySelector(d), r = n(".ppp-frame");
  let i = null;
  const s = async (d, E) => {
    const v = await fetch(d, { cache: "no-store", ...E, signal: AbortSignal.timeout(15e3) }), h = await v.json().catch(() => ({}));
    if (!v.ok) throw new Error((h == null ? void 0 : h.error) || `Request failed (${v.status}).`);
    return h;
  }, o = y6({
    now: Date.now,
    main: () => {
      const d = e.load();
      return d.isConnected && d.network === "mainnet" ? d.address : void 0;
    },
    config: (d) => s("/radio/listening-wallet/config?main=" + encodeURIComponent(d || "")),
    links: async (d) => (await s("/radio/listening-wallet/link?main=" + encodeURIComponent(d))).links ?? [],
    mainOf: async (d) => {
      var v;
      const E = (await s("/radio/listening-wallet/link?listening=" + encodeURIComponent(d))).links;
      return ((v = E == null ? void 0 : E.find((h) => h.listening === d)) == null ? void 0 : v.main) ?? null;
    },
    saveLink: async (d) => {
      await s("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(d) });
    },
    bridge: async (d) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${d}; publickey-credentials-create ${d}`), i.referrerPolicy = "no-referrer";
      const E = new Promise((pt, At) => {
        i.addEventListener("load", () => pt(), { once: !0 }), setTimeout(() => At(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      i.src = d + "/", r.replaceChildren(i), await E;
      const v = new Mw({ walletOrigin: d, frame: i, timeoutMs: 30 * 6e4 }), h = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), st = (pt, At) => h.has(pt) ? v.request(pt, At) : Promise.race([
        v.request(pt, At),
        new Promise((de, re) => setTimeout(() => re(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await st("listening.status"), { request: st };
    },
    chain: {
      verify: X5,
      balance: Z5,
      account: Y5,
      owner: Q5,
      broadcast: J5,
      transaction: t6,
      confirmedNonce: async (d) => {
        const E = await xs(`/v2/accounts/${d}?proof=0`);
        if (!Number.isSafeInteger(E == null ? void 0 : E.nonce) || E.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(E.nonce);
      }
    },
    signWithMain: (d, E) => c0({ ...E, network: "mainnet", stxAddress: d }),
    deposit: (d, E, v) => new Promise((h, st) => r0({
      recipient: E,
      amount: v.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: d,
      network: new Il(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (pt) => h(pt.txId || ""),
      onCancel: () => st(new Error("Deposit cancelled. Nothing was sent.")),
      onError: st
    })),
    validate: e6,
    tabLock: (d) => new Promise((E) => {
      const v = navigator.locks;
      if (!(v != null && v.request)) {
        E(!0);
        return;
      }
      v.request("xtrata-ppp:" + d, { ifAvailable: !0 }, async (h) => {
        E(!!h), h && await new Promise(() => {
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
      set: (d, E) => {
        try {
          localStorage.setItem(d, E);
        } catch {
        }
      }
    },
    changed: () => le(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (d) => {
      var E, v;
      return a.funder(d, () => a6(d, xs), !!((v = (E = o.snapshot().gate) == null ? void 0 : E.gifts) != null && v.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (d) => {
      const E = await s("/radio/gift/for?wallet=" + encodeURIComponent(d)), v = E == null ? void 0 : E.gift;
      if (!v) return null;
      if (typeof v.returnTo != "string" || typeof v.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: v.returnTo, from: typeof v.from == "string" ? v.from : null, source: String(v.source ?? ""), amount: String(v.amount ?? "0"), treasury: v.treasury, state: v.state === "sending" ? "sending" : "arrived", player: v.player ?? null };
    },
    history: (d, E) => u6(d, (v) => xs(v), E),
    likesChanged: () => {
      var d, E;
      (E = (d = window.XtrataRadio) == null ? void 0 : d.refreshLikes) == null || E.call(d);
    },
    likeState: async (d, E) => {
      const v = await s("/radio/chain-likes?" + new URLSearchParams({ wallet: d, ids: String(E) })), h = Array.isArray(v == null ? void 0 : v.rows) ? v.rows.find((st) => (st == null ? void 0 : st.id) === E) : null;
      if (!h || typeof h.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: h.liked, by: Array.isArray(h.by) ? h.by.filter((st) => typeof st == "string") : h.liked ? [d] : [] };
    },
    likeSent: (d, E) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: d, liked: E } })),
    nameOf: (d) => Ht(d) ?? void 0,
    likeConfirmed: (d, E) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: d, liked: E } })),
    likeFailed: (d) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: d } }))
  }), a = xk({
    json: s,
    main: () => {
      const d = e.load();
      return d.isConnected && d.network === "mainnet" ? d.address : void 0;
    },
    pay: (d, E, v, h) => new Promise((st, pt) => r0({
      recipient: E,
      amount: v.toString(),
      memo: h,
      stxAddress: d,
      network: new Il(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (At) => st(At.txId || ""),
      onCancel: () => pt(new Error("Gift cancelled. Nothing was sent.")),
      onError: pt
    })),
    sign: (d, E) => c0({ ...E, network: "mainnet", stxAddress: d }),
    giftSent: (d, E) => o.giftSent(d, E),
    claiming: (d) => o.giftClaiming(d),
    album: { bind: (d) => o.bindAlbum(d), arrived: async (d, E, v, h) => {
      c.invalidate(), await o.albumArriving(d, E, v, h);
    } },
    who: (d) => et(d),
    changed: () => le(o.snapshot()),
    store: {
      get: (d) => {
        try {
          return localStorage.getItem(d);
        } catch {
          return null;
        }
      },
      set: (d, E) => {
        try {
          E === null ? localStorage.removeItem(d) : localStorage.setItem(d, E);
        } catch {
        }
      }
    },
    now: Date.now
  }), c = Tk({
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
      set: (d, E) => {
        try {
          E === null ? localStorage.removeItem(d) : localStorage.setItem(d, E);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => le(o.snapshot())
  }), u = (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), f = u ? document.getElementById("album") : null, l = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (d) => void o.topUpAlbum(d),
    openPlayer: () => void o.openAlbum(0)
  }, y = f ? L0(f, l) : null, p = document.getElementById("albumList"), x = p ? L0(p, l, { list: !0 }) : null, S = "xtrata.radio.album.last.v1", B = () => {
    try {
      const d = JSON.parse(localStorage.getItem(S) || "null");
      return d && typeof d.root == "string" && Number.isSafeInteger(d.slot) && d.slot > 0 && d.player && Array.isArray(d.player.tracks) ? d : null;
    } catch {
      return null;
    }
  };
  let z = "";
  const R = (d) => {
    const E = JSON.stringify(d);
    if (E !== z) {
      z = E;
      try {
        localStorage.setItem(S, E);
      } catch {
      }
    }
  };
  let A = null;
  window.XtrataRadioLikeHandler = (d) => {
    var v;
    if (!d || !Number.isSafeInteger(d.song) || d.song < 0) return !1;
    (v = o.snapshot().likeFunds) != null && v.album && (P = !0), Ie();
    const E = Be(d.song, { title: d.title, artist: d.artist });
    return o.heart({ song: d.song, title: E.title || void 0, artist: E.artist || void 0, likedBy: Array.isArray(d.likedBy) ? d.likedBy : void 0 });
  };
  let _;
  window.XtrataRadioListeningIdentity = () => {
    const d = o.snapshot();
    return d.solo && d.step !== "off" && d.step !== "elsewhere" ? d.listening : void 0;
  };
  const N = (d) => {
    var v, h;
    const E = window.XtrataRadioListeningIdentity();
    E !== _ && (_ = E, (h = (v = window.XtrataRadio) == null ? void 0 : v.refreshLikes) == null || h.call(v));
  };
  let Q = "", tt = null, G = !1, V = !1;
  const I = (d, E) => {
    var gn, he, Pe, Ke, Vn, Qe, Je;
    const v = window.XtrataRadio;
    if (!(v != null && v.setGiftPlayer) || !(v != null && v.setGiftStop)) return;
    const h = d.step === "off" || d.step === "elsewhere" ? null : ((gn = d.gift) == null ? void 0 : gn.player) ?? null, st = h ? h.id + ":" + h.cover + ":" + h.tracks.map((Hn) => Hn.id).join(",") : "";
    st !== Q && (v.setGiftPlayer(h ? { id: h.id, title: h.title, subtitle: h.subtitle, tracks: Hi(h).map((Hn) => Hn.id), hidden: ((he = yk(h)) == null ? void 0 : he.id) ?? null, cover: h.cover } : null), Q = st);
    const pt = E.depositPending && d.step === "fund" && ((Pe = d.giftStop) == null ? void 0 : Pe.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : d.giftStop, At = (pt == null ? void 0 : pt.text) ?? null;
    At !== tt && (v.setGiftStop(At), tt = At);
    const de = (pt == null ? void 0 : pt.reason) === "arriving";
    de !== V && ((Ke = v.setGiftWait) == null || Ke.call(v, de), V = de);
    const re = !!h && !!((Vn = d.albumLock) != null && Vn.locked);
    re !== G && ((Qe = v.setGiftLock) == null || Qe.call(v, re), G = re), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(d.step) && ((Je = v.forgetWallets) == null || Je.call(v));
  };
  let P = !1;
  const b = /* @__PURE__ */ new Map(), T = (d) => {
    if (!(d.step === "fund" && !d.depositPending && !!d.gift && !!d.listening && d.balance === 0n && !d.entries.some((h) => h.kind === "play") && (d.brandNew || d.createdHere))) return null;
    let v = b.get(d.listening);
    return v === void 0 && (v = Date.now(), b.set(d.listening, v)), Date.now() - v < hc ? v : null;
  }, D = (d) => d.step === "fund" && !d.depositPending && !!d.gift && d.balance === 0n && !d.entries.some((E) => E.kind === "play") && !!d.listening && b.has(d.listening), C = (d) => d ? d.slice(0, 6) + "…" + d.slice(-4) : "", ot = (d) => {
    const E = o.snapshot().playCost || 350n;
    return d > Fe ? Number((d - Fe) / E) : 0;
  }, X = (d) => (Number(d) / 1e6).toFixed(d < 1000n ? 6 : 4), St = (d) => {
    const E = Math.round((Date.now() - d) / 6e4);
    return E < 1 ? "now" : E < 60 ? `${E}m` : E < 1440 ? `${Math.round(E / 60)}h` : `${Math.round(E / 1440)}d`;
  }, k = (d) => `https://explorer.hiro.so/txid/${d}?chain=mainnet`, m = (d, E = "", v = "") => {
    const h = document.createElement(d);
    return E && (h.textContent = E), v && (h.className = v), h;
  }, q = (d, E, v = "") => {
    const h = m("button", d, v);
    return h.type = "button", h.onclick = E, h;
  }, rt = (d, E) => {
    const v = m("a", d);
    return v.href = E, v.target = "_blank", v.rel = "noopener", v;
  };
  let at = null, vt = location.hash === "#give";
  vt && history.replaceState(null, "", location.pathname + location.search);
  let te = !1;
  const $t = J6((d) => Q6({ address: d, network: "mainnet" }), () => le(o.snapshot())), Ht = (d) => $t.get(d), Mt = _k(navigator.userAgent), jt = (d, E) => {
    const v = navigator.userAgent, h = Hk(v), st = `${location.origin}${location.pathname}${E ? `#gift=${E}` : ""}`, pt = [m("p", `You are in ${d}'s built-in browser, where passkeys often do not work. Open this page in ${h} to make your listening wallet${E ? " and claim your gift" : ""}.`, "ppp-warn")], At = m("div", "", "ppp-open-row"), de = Uk(st, v);
    if (de) {
      const re = m("a", `Open in ${h}`, "primary ppp-open-in");
      re.href = de, re.dataset.homeAction = "radio:open-in-browser", At.append(re);
    }
    return At.append(Pi("copy-page-link", "Copy link", () => st, de ? "" : "primary", () => le(o.snapshot()))), pt.push(At, m("p", `If that does not open ${h}, use ${d}'s menu (••• or ⋮) and choose "Open in ${h === "your browser" ? "browser" : h}", or paste the copied link there.`, "ppp-mute")), pt;
  }, et = (d) => Ht(d) ?? C(d), Se = (d) => d.slice(0, 2).map(et).join(" and ") + (d.length > 2 ? ` and ${d.length - 2} more` : ""), An = /* @__PURE__ */ new Map();
  let Ze = !1;
  const dn = (d) => !d || /^(?:Inscription )?#\d+$/.test(d.trim()), Ie = () => {
    Ze || (Ze = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((d) => d.ok ? d.json() : null).then((d) => {
      for (const E of Array.isArray(d == null ? void 0 : d.tracks) ? d.tracks : []) {
        const v = Number(E == null ? void 0 : E.id);
        Number.isSafeInteger(v) && An.set(v, { title: typeof E.title == "string" ? E.title : void 0, artist: typeof E.artist == "string" ? E.artist : void 0 });
      }
      le(o.snapshot());
    }).catch(() => {
      Ze = !1;
    }));
  }, Be = (d, E) => {
    const v = An.get(d), h = ek(d, [v == null ? void 0 : v.title, E == null ? void 0 : E.title].find((pt) => !dn(pt)) || ""), st = tk(d, (v == null ? void 0 : v.artist) || (E == null ? void 0 : E.artist) || "");
    return { title: h, artist: st };
  }, Me = (d) => {
    const { title: E, artist: v } = Be(d.song, d);
    return E ? `“${E}”${v ? ` — ${v}` : ""}` : `Song #${d.song}${v ? ` — ${v}` : ""}`;
  }, ee = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, hn = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function je(d) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(d.step) ? ["", ""] : d.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : d.step === "over" ? ["TOO MUCH", "bad"] : d.step === "locked" ? ["LOCKED", "mute"] : d.step === "intro" || d.step === "link" ? ["", ""] : d.step === "fund" ? d.depositPending ? ["ON ITS WAY", "warn"] : d.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : d.payingOn && d.session && d.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function be(d, E, v = "", h) {
    const st = m("dt", d), pt = m("dd", E, v);
    return h && pt.append(" ", h), [st, pt];
  }
  const Xt = document.getElementById("ppp-top"), oe = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Ue = () => {
    var E;
    const d = window.XtrataRadioConnectStacks;
    d ? d() : (E = document.getElementById("radio-wallet-connect")) == null || E.click();
  }, vn = () => {
    var E;
    const d = o.snapshot();
    if (d.step === "connect" || d.step === "wrong-wallet") {
      Ue();
      return;
    }
    if (d.step === "elsewhere" && ((E = d.gate) != null && E.radioUrl)) {
      location.href = d.gate.radioUrl;
      return;
    }
    d.step === "locked" && !d.armed && !d.busy && o.unlock(), d.step === "ready" && !d.payingOn && !d.busy && o.switchOn(), oe();
  };
  Xt && (Xt.onclick = vn);
  let $ = null;
  const F = () => {
    const d = C0(o.snapshot());
    return d ? $ || ($ = new Promise((E) => {
      const v = m("dialog", "", "ppp-connect");
      v.setAttribute("aria-labelledby", "ppp-connect-title");
      let h = null;
      const st = (he) => {
        h = he, v.close();
      };
      v.addEventListener("close", () => {
        v.remove(), $ = null, E(h);
      }), v.addEventListener("click", (he) => {
        he.target === v && st(null);
      });
      const pt = (he, Pe, Ke, Vn, Qe = !1) => {
        const Je = m("button", "", "ppp-connect__opt " + Ke);
        return Je.type = "button", Je.disabled = Qe, Je.onclick = Vn, Je.append(m("b", he), m("span", Pe)), Je;
      }, At = m("h2", "Connect", "ppp-connect__title");
      At.id = "ppp-connect-title";
      const de = pt(d.label, d.detail, "is-music", () => {
        st("music");
        const he = C0(o.snapshot());
        (he == null ? void 0 : he.action) === "create" ? o.create() : (he == null ? void 0 : he.action) === "unlock" && o.unlock(), oe();
      }, !!d.disabled), re = pt("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => st("stacks")), gn = q("Cancel", () => st(null), "quiet ppp-connect__cancel");
      v.append(At, de, re, gn), document.body.appendChild(v), v.showModal(), d.disabled || de.focus();
    }), $) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = F;
  function U(d) {
    if (!Xt) return;
    const E = (h, st, pt) => {
      Xt.hidden = !1, Xt.className = "ppp-top" + (st ? " is-" + st : ""), Xt.replaceChildren(m("span", "", "dot"), document.createTextNode(h)), Xt.title = pt;
    }, v = d.session ? Math.min(d.session.playsLeft, d.playsLeft) : 0;
    switch (d.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Xt.hidden = !0;
        return;
      case "elsewhere":
        return E("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        Xt.hidden = !0;
        return;
      case "intro":
        return E("Start listening", "", "Make your player with your face or fingerprint: no app or account needed");
      case "wrong-wallet":
        return E(`Connect ${et(d.linked)}`, "warn", `This device's listening wallet belongs to ${et(d.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return E("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return E("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return d.depositPending ? E("Plays on their way", "quiet", "Plays start by themselves when they land") : E(d.entries.some((h) => h.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return E("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return E("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return d.payingOn && v > 0 ? E(`${v.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : E("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const H = document.getElementById("pppNudge"), ut = document.getElementById("onair");
  (vs = H == null ? void 0 : H.querySelector("button")) == null || vs.addEventListener("click", () => vn());
  const xt = {
    connect: "Plays are not counted",
    intro: "Plays are not counted",
    locked: "Locked · plays are not counted",
    "wrong-wallet": "Wrong wallet connected · plays are not counted",
    link: "Plays are not counted yet",
    fund: "No plays yet",
    over: "Paused · plays are not counted",
    ready: "Plays are off"
  }, ne = {
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
  function Yt(d) {
    if (d.step === "loading") return;
    const E = d.session ? Math.min(d.session.playsLeft, d.playsLeft) : 0, v = d.step === "ready" && d.payingOn && E > 0, h = d.step === "fund" && d.depositPending, st = d.step === "elsewhere", pt = v || h || st ? "" : xt[d.step] ?? "", At = v ? "on" : st ? "free" : pt ? "off" : "";
    At ? document.documentElement.dataset.ppp = At : delete document.documentElement.dataset.ppp, ut && (ut.hidden = !At || At === "free", ut.querySelector(".onair-sub").textContent = v ? `${E.toLocaleString()} plays left` : "Plays off"), H && (H.hidden = At !== "off" && At !== "free", H.classList.toggle("is-free", At === "free"), At === "free" ? (H.querySelector(".nudge-t").textContent = "You’re on the free player", H.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", H.querySelector("button").textContent = "Get a player") : At === "off" && (H.querySelector(".nudge-t").textContent = pt, H.querySelector(".nudge-s").textContent = "Every play you count goes to the song’s owner, on-chain.", H.querySelector("button").textContent = ne[d.step] ?? "Start"));
  }
  let Zt = "";
  function qt(d) {
    const E = m("div", "", "ppp-pick");
    d.funderMultiple && d.returnToKind === "funder" && E.append(m("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), d.returnToKind === "funder" && E.append(m("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const v = m("input");
    v.type = "text", v.placeholder = "SP… address to send returns to", v.autocomplete = "off", v.spellcheck = !1, v.setAttribute("aria-label", "Address to return funds to"), v.value = Zt, v.oninput = () => {
      Zt = v.value;
    };
    const h = q(d.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(v.value), Zt = "";
    }, "tiny");
    return E.append(v, " ", h), d.returnToKind === "chosen" && E.append(" ", q("Back to the funder", () => o.clearReturnAddress(), "tiny")), E;
  }
  const Ne = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function He() {
    const d = m("p", Ne + " ", "ppp-mute");
    return d.append(rt("Xverse", "https://www.xverse.app/download"), " · ", rt("Leather", "https://leather.io/install-extension")), d;
  }
  let Ot = "";
  const Et = (d) => {
    const E = document.documentElement, v = d.solo && !d.main ? d.listening ? C(d.listening) : "new" : "", h = S6() ? "1" : "";
    `${v}|${h}` !== Ot && (Ot = `${v}|${h}`, v ? E.dataset.pppSolo = v : delete E.dataset.pppSolo, h ? E.dataset.pppWalletInstalled = h : delete E.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const d of [1500, 4e3, 9e3]) setTimeout(() => le(o.snapshot()), d);
  function Gt(d, E = "") {
    const v = m("div", "", "ppp-topup"), h = Qt(d);
    v.append(m("span", "Add plays from My player: ", "ppp-mute"));
    for (const st of Da) {
      const pt = q(`+${st.toLocaleString()}`, () => void o.topUpAlbum(st), E);
      pt.disabled = h === void 0 || h < st || d.depositPending || !!d.busy, v.append(pt);
    }
    return h !== void 0 && h < Da[0] && v.append(m("p", "My player needs plays first (switch to My player above).", "ppp-mute")), v;
  }
  const Qt = (d) => {
    var h;
    const E = (h = d.likeFunds) == null ? void 0 : h.balance;
    if (E === void 0 || !d.playCost) return;
    const v = E - Fe - 6000n;
    return v > 0n ? Number(v / d.playCost) : 0;
  };
  function Ee(d) {
    const E = d.likeFunds;
    if (!E || !E.album || !E.low && !E.pending) return [];
    if (E.low || (P = !1), E.low && !P) return [];
    const v = m("div", "", "ppp-pick ppp-lowbox");
    if (!E.low) {
      if (!E.txid) return [];
      const st = m("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return E.txid && st.append(rt("View", k(E.txid))), v.append(st), [v];
    }
    v.append(m("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), v.append(m("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), v.append(m("p", E.address, "ppp-addr-full"));
    const h = m("div", "", "ppp-open-row");
    if (h.append(Pi("copy-likes-address", "Copy address", () => E.address, "primary", () => le(o.snapshot()))), E.main && !d.solo) {
      const st = Hs - (E.balance ?? 0n);
      st > 0n && h.append(q(`Pay ${ur(st)} STX from my wallet`, () => void o.topUpLikes(), "primary"));
    }
    return v.append(h), v.append(m("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [v];
  }
  const ce = (d) => {
    const E = m("div", "", "ppp-wait");
    E.dataset.since = String(d.since), E.dataset.grace = String(d.graceMs), E.setAttribute("role", "progressbar"), E.setAttribute("aria-label", "Your plays are arriving");
    const v = m("p", "", "ppp-wait-t"), h = m("div", "", "ppp-wait-track");
    return h.append(m("div", "", "ppp-wait-fill")), E.append(v, h), pn(E), E;
  };
  function pn(d) {
    const E = Number(d.dataset.since), v = Number(d.dataset.grace) || 6e4, h = Math.max(0, Date.now() - E), st = d.querySelector(".ppp-wait-fill"), pt = d.querySelector(".ppp-wait-t");
    if (h < v) {
      const At = Math.ceil((v - h) / 1e3);
      st.style.width = Math.max(4, Math.min(95, h / v * 100)).toFixed(0) + "%", pt.textContent = `Your plays are arriving… usually about a minute · ${At}s`, d.classList.remove("is-long"), d.setAttribute("aria-valuenow", String(Math.round(h / v * 100)));
    } else
      st.style.width = "", pt.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", d.classList.add("is-long"), d.removeAttribute("aria-valuenow");
  }
  let kn = 0;
  setInterval(() => {
    const d = document.querySelectorAll(".ppp-wait");
    if (!d.length) {
      kn = 0;
      return;
    }
    d.forEach(pn), ++kn % 10 === 0 && le(o.snapshot());
  }, 1e3);
  let Ar = null;
  function lo(d) {
    if (d.step === "loading" && Ar !== null) return;
    const v = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(d.step) || !!d.busy || d.armed || !!a.pendingCode() && !["ready", "fund", "over"].includes(d.step);
    v !== Ar && (Ar = v, v ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function le(d) {
    var K, J, ft, j, gt, wt, bt, zt, _e, tn, pe, $n, Rr, Zo, xi;
    if (A && ["ready", "fund", "over"].includes(d.step) && !d.busy) {
      const W = A;
      A = null, d.root === W.root && d.slot !== W.slot && o.openAlbum(W.slot);
    }
    const E = a.inProgress(d), v = T(d), h = E && d.step === "fund" ? { ...d, depositPending: !0 } : v !== null ? { ...d, depositPending: !0, arrival: { since: v, graceMs: hc } } : d, st = h.error === pc;
    if (N(), I(d, h), lo(h), Et(h), !E && a.inProgress(d) || (U(h), Yt(h), t.hidden = h.step === "off", t.hidden)) return;
    const [pt, At] = je(h), de = n(".ppp-state");
    de.textContent = pt, de.className = "ppp-state" + (At ? " ppp-state--" + At : ""), de.hidden = !pt;
    const re = !!h.busy || h.armed, gn = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(h.step) && (re || !["intro", "loading"].includes(h.step));
    r.hidden = !gn, r.classList.toggle("ppp-frame--rest", !re && !te);
    const he = n(".ppp-frame-label");
    he.hidden = !0;
    const Pe = w6(h) ?? at;
    at = Pe;
    const Ke = "xtrata.radio.ppp.heard.v1", Vn = (() => {
      try {
        return localStorage.getItem(Ke) === "1";
      } catch {
        return !1;
      }
    })();
    if (!Vn && h.entries.some((W) => W.kind === "play"))
      try {
        localStorage.setItem(Ke, "1");
      } catch {
      }
    const Qe = Vn || h.slot > 0 && ((((K = h.likeFunds) == null ? void 0 : K.balance) ?? 0n) > 0n || c.count() > 1), Je = m6({ ...h, heard: Qe }, Pe);
    n(".ppp-badge").hidden = !Je;
    const Hn = n(".ppp-steps"), vr = n(".ppp-stage");
    Hn.hidden = vr.hidden = !Je, Pe && Je && (Hn.replaceChildren(...Bu(h.solo).map((W, dt) => {
      const Oe = m("li", "", dt < Pe.at ? "done" : dt === Pe.at ? Pe.blocked ? "now blocked" : "now" : "");
      return Oe.append(m("span", dt < Pe.at ? "✓" : String(dt + 1), "n"), W), dt === Pe.at && Oe.setAttribute("aria-current", "step"), Oe;
    })), vr.textContent = Pe.caption, vr.className = "ppp-stage " + (Pe.at >= Bu(h.solo).length ? "ppp-ok" : Pe.blocked ? "ppp-bad" : "ppp-cyan"));
    const kr = n(".ppp-facts"), Ve = [];
    h.main && ((J = h.gate) != null && J.here) && !h.solo && Ve.push(...be("Your wallet", et(h.main), "ppp-addr-short"));
    const ks = () => {
      if (!h.listening) return;
      const W = Pi("copy-listening", "Copy", () => h.listening || "", "tiny", () => le(o.snapshot()));
      Ve.push(...be(h.slot > 0 ? "Album wallet" : h.linked ? "My player (technical)" : "My player wallet", C(h.listening), "ppp-addr-short", W));
    };
    if (h.linked || ks(), h.listening && h.step !== "intro")
      if (h.linked)
        Ve.push(...be("Credited to", `${et(h.linked)} · plays, likes and returns`, h.linked === h.main || h.solo ? "ppp-ok" : "ppp-warn")), ks();
      else if (h.solo) {
        h.creditedTo && Ve.push(...be("Credited to", `${et(h.creditedTo)} · plays and likes`, "ppp-ok"));
        const W = h.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : h.returnTo ? `${et(h.returnTo)} · ${h.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : h.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Ve.push(...be("Returns go to", h.gift ? W : h.returnTo && !Ht(h.returnTo) ? W.replace(C(h.returnTo), h.returnTo) : W, h.returnTo && !h.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Ve.push(...be("Linked to", "not linked yet", "ppp-warn"));
    if (h.linkedListening.length && ((ft = h.gate) != null && ft.here)) {
      const W = h.linkedListening.map((dt) => C(dt) + (dt === h.listening ? " (this one)" : "")).join(", ");
      Ve.push(...be(h.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", W, "ppp-addr-short"));
    }
    if (h.balance !== void 0 && ["fund", "ready", "over"].includes(h.step)) {
      const W = h.step === "fund" && h.depositPending ? "ppp-mute" : h.balanceState === "ok" ? "ppp-ok" : h.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Ve.push(...be("Balance", `${ur(h.balance)} STX · about ${h.playsLeft.toLocaleString()} plays`, W));
    }
    const On = h.entries.find((W) => W.kind === "play");
    On && Ie(), On && Ve.push(...be("Last paid song", `${Me(On)} → ${et(On.recipient)}`, ee[On.status] || "")), kr.replaceChildren(...Ve), kr.hidden = !Ve.length;
    const yt = [], Dt = [], ue = [], yn = [], wi = Bn(BigInt(((j = h.gate) == null ? void 0 : j.limits.playFee) ?? "300")), uo = `Each song you listen to for 30 seconds sends ${ur(fc)} STX to whoever holds it, plus a ${ur(wi - fc)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, $s = !!h.busy;
    switch (h.step) {
      case "elsewhere": {
        if (yt.push(m("p", "Pay artists as you listen.")), (gt = h.gate) != null && gt.radioUrl) {
          const dt = m("p");
          dt.append(rt("Open the pay-per-play radio →", h.gate.radioUrl)), yt.push(dt);
        }
        Dt.push(m("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (h.linked) {
          const dt = [h.linked, ...h.others];
          yt.push(m("p", dt.length > 1 ? `This device has listening wallets for ${Se(dt)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${et(h.linked)}. Connect that wallet to keep paying artists.`)), Dt.push(m("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          yt.push(m("p", "Connect your wallet to pay artists as you listen.")), Dt.push(m("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        yt.push(m("p", `This device's listening wallet belongs to ${et(h.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Dt.push(m("p", `You are connected as ${et(h.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), Dt.push(m("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), ue.push(q("Switch wallet", Ue, "primary"));
        break;
      case "not-invited":
        yt.push(m("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        yt.push(m("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        yt.push(m("p", "Every play counts for the song’s owner, on-chain.")), Dt.push(m("p", uo)), Dt.push(m("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), Dt.push(m("p", h.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !h.solo && h.main && h.others.length ? (yt.push(m("p", `This device already has a listening wallet for ${Se(h.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Dt.push(m("p", `Otherwise, set up a new listening wallet for ${et(h.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !h.solo && h.main && Dt.push(m("p", `This is the listening wallet for ${et(h.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), h.solo && Dt.push(m("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const W = a.liveGift();
        ue.push(q(W ? "Claim my gift · no wallet needed" : h.solo ? "Start listening · no wallet needed" : h.others.length && h.main ? `Set up for ${et(h.main)}` : "Start listening", () => void o.create(), "primary")), !W && !h.solo && h.main && h.others.length && ue.push(q("Switch wallet", Ue)), !W && h.solo && ue.push(q("I have a Stacks wallet", Ue)), ue.push(q("I already have a listening wallet", () => void o.unlock(!0))), W && ue.push(q("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        h.armed || (yt.push(m("p", "Locked.", "ppp-mute")), ue.push(q("Unlock", () => void o.unlock(), "primary"))), yn.push(q("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        yt.push(m("p", `Link to ${et(h.main)} · free`)), Dt.push(m("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Dt.push(m("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), ue.push(q(h.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        yt.push(m("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (h.depositPending ? h.arrival && yt.push(ce(h.arrival)) : D(h) ? yt.push(m("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (wt = h.gift) != null && wt.player ? yt.push(m("p", "Out of plays · add more to keep listening", "ppp-bad")) : h.entries.length ? yt.push(m("p", "No plays left · add plays to keep counting", "ppp-bad")) : yt.push(m("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / wi)).toLocaleString()} plays`)), (bt = h.gift) != null && bt.player ? Dt.push(m("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : h.entries.length && Dt.push(m("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), h.payingOn && !h.entries.length && Dt.push(m("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), E ? Dt.push(m("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : h.depositPending ? Dt.push(m("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : h.solo ? (Dt.push(m("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Dt.push(m("p", h.listening || "", "ppp-addr-full")), h.listening && !h.depositPending && ue.push(Pi("copy-address", "Copy my address", () => h.listening || "", "primary", () => le(o.snapshot())))) : Dt.push(m("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), h.depositPending && h.depositTxid) {
          const dt = m("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          dt.append(rt("View", k(h.depositTxid))), yt.push(dt);
        } else h.allowance > 0n && !h.solo && !h.depositPending && ue.push(q(`Deposit ${ur(h.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        yt.push(m("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), h.solo && !h.returnTo && (yt.push(m("p", h.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), yt.push(qt(h))), (!h.solo || h.returnTo) && ue.push(q("Return excess", () => void o.returnFunds("excess"), "primary"), q("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (h.payingOn && h.session && h.session.playsLeft > 0) {
          const dt = Math.min(h.session.playsLeft, h.playsLeft);
          yt.push(m("p", `${dt.toLocaleString()} plays left`, "ppp-ok")), Dt.push(m("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), ue.push(q("Switch off", () => void o.switchOff()));
        } else
          yt.push(m("p", "Plays are off. Music stays free.", "ppp-mute")), ue.push(q("Switch plays on", () => void o.switchOn(), "primary"));
        h.queued && yt.push(m("p", h.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${h.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), h.balanceState === "low" && yt.push(m("p", "Running low on plays", "ppp-warn")), h.depositPending ? yt.push(m("p", "Plays on their way…", "ppp-warn")) : h.allowance > 0n && h.balanceState !== "ok" && !h.solo && ue.push(q(`Top up ${ur(h.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (h.solo && h.walletCannotSolo && Dt.push(m("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), h.solo && ["fund", "ready"].includes(h.step) && ((h.balance ?? 0n) > 0n && h.slot === 0 && Dt.push(qt(h)), Dt.push(He()), h.slot === 0 && h.step === "ready" && h.entries.some((W) => W.kind === "play" && W.status === "confirmed"))) {
      const W = m("p", "New to Stacks? ", "ppp-mute");
      W.append(rt("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), yt.push(W);
    }
    if (h.walletOutdated && Dt.push(m("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), h.stuck && (yt.push(m("p", h.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${h.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), ue.push(q("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(h.step) && (h.returnTo || h.gift) && (h.balance ?? 0n) > 0n && yn.push(q(h.linked ? "Return all to my wallet" : h.gift ? "Return what is left…" : `Return all to ${et(h.returnTo)}`, () => void o.returnFunds("all"), "quiet")), h.slot > 0 && ((zt = h.gift) != null && zt.player) && ["ready", "fund"].includes(h.step) && h.giftPlays > 20 && yn.push(Gt(h, "quiet")), ["ready", "fund", "link", "over"].includes(h.step) && yn.push(q("Lock", () => void o.lock(), "quiet")), gn && !re && yn.push(q(te ? "Hide listening wallet box" : "Show listening wallet box", () => {
      te = !te, le(o.snapshot());
    }, "quiet")), [...ue, ...yn].forEach((W) => W.disabled = $s), $s && (ue.length = 0), h.balance !== void 0 && ["fund", "ready", "over"].includes(h.step) && !(h.step === "fund" && h.depositPending && h.balance === 0n) && !((_e = h.gift) != null && _e.player)) {
      const W = h.balanceState === "ok" ? "ppp-ok" : h.balanceState === "low" ? "ppp-warn" : "ppp-bad", dt = yt.at(0);
      h.step === "ready" && dt ? dt.append(m("span", ` · ${X(h.balance)} STX`, W)) : yt.push(m("p", `Balance ${X(h.balance)} STX`, W));
    }
    if ((tn = h.gift) != null && tn.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(h.step)) {
      const W = m("p", "", "ppp-gift");
      W.append(`💿 Album · ${h.gift.player.title}`), h.gift.player.subtitle && W.append(" · ", h.gift.player.subtitle);
      const dt = ["ready", "fund", "over"].includes(h.step) && h.balance !== void 0 ? h.giftPlays === 0 && h.depositPending ? m("span", " · plays on their way", "ppp-warn") : m("span", h.giftPlays === 0 ? " · no plays left" : ` · ${h.giftPlays.toLocaleString()} ${h.giftPlays === 1 ? "play" : "plays"} left`, h.giftPlays === 0 ? "ppp-bad" : h.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      dt && W.append(dt);
      const Oe = (pe = yt.at(0)) == null ? void 0 : pe.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (h.step === "ready" && Oe && /STX/.test(Oe.textContent ?? "") && Oe.remove(), yt.unshift(W), h.giftPlays <= 20 && ["ready", "fund"].includes(h.step) && !h.depositPending)
        if (h.slot > 0)
          yt.splice(1, 0, m("p", h.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), Gt(h, "primary"));
        else {
          const ze = m("p", h.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          ze.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), ze.append(rt("Xverse", "https://www.xverse.app/download"), " and ", rt("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), yt.splice(1, 0, ze);
        }
    }
    if (h.gift && !h.linked && ["fund", "ready", "over"].includes(h.step) && h.returnPlan.state === "ready") {
      const W = h.returnPlan, dt = m("div", "", "ppp-pick");
      dt.append(m("p", W.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Oe = m("ul", "", "ppp-gift-list");
      W.steps.forEach((ze, fo) => {
        const sr = ze.kind === "gift" ? "the unused gift" : ze.kind === "deposit" ? "what was added to it" : "the rest", wn = m("li");
        wn.append(m("span", `${fo + 1}. ${ur(BigInt(ze.send))} STX · ${sr}`, "t"), m("span", ze.to ? ` → ${et(ze.to)}` : " → choose an address below", ze.to ? "ppp-mute" : "ppp-warn")), Oe.append(wn);
      }), dt.append(Oe), W.kept && dt.append(m("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), W.steps.some((ze) => !ze.to) && dt.append(qt(h)), dt.append(q(W.steps.length > 1 ? `Confirm part 1 of ${W.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), yt.push(dt);
    }
    const fe = yi(h), Fr = u ? fe : null, jr = a.banner(d, { bare: !!Fr }), $r = Mt && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(h.step)) ? jt(Mt, a.pendingCode()) : [];
    Fr || (yt.unshift(...jr), yt.push(...Ee(h)), yt.unshift(...$r)), h.solo && h.creditedTo && h.listening && !["intro", "off", "elsewhere", "loading"].includes(h.step) && yt.unshift(m("p", `This is ${et(h.creditedTo)}'s listening wallet. Plays and likes count for ${et(h.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...yt);
    const Ir = document.querySelector(".ppp-switch");
    if (Ir) {
      const W = c.latest(), dt = h.slot > 0, Oe = ["fund", "ready", "over"].includes(h.step) && (dt || !!W);
      if (Ir.hidden = !Oe, Oe) {
        const ze = (wn, Si, Vc, qc) => {
          const g = q("", qc, "ppp-tab");
          return g.setAttribute("aria-pressed", String(Vc)), g.append(m("span", wn, "tt"), m("span", Si === void 0 ? "…" : `${ot(Si).toLocaleString()} plays`, "ts")), g.disabled = !!h.busy, g;
        }, fo = dt ? ((Rr = ($n = h.gift) == null ? void 0 : $n.player) == null ? void 0 : Rr.title) ?? "Album" : W.title, sr = q("View all albums" + (c.count() > 1 ? ` (${c.count()})` : ""), () => {
          const wn = document.querySelector(".ppp-shelf");
          wn && (wn.hidden = !1, wn.open = !wn.open, sr.setAttribute("aria-expanded", String(wn.open)), wn.open && requestAnimationFrame(() => wn.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        sr.setAttribute("aria-expanded", String(!!((Zo = document.querySelector(".ppp-shelf")) != null && Zo.open))), Ir.replaceChildren(
          ze("🎧 My player", dt ? (xi = h.likeFunds) == null ? void 0 : xi.balance : h.balance, !dt, () => {
            dt && o.openAlbum(0);
          }),
          ze("💿 " + fo, dt ? h.balance : void 0, dt, () => {
            !dt && W && o.openAlbum(W.slot);
          }),
          sr
        );
      }
    }
    const qn = c.render(h), zr = document.querySelector(".ppp-shelf");
    if (zr) {
      zr.hidden = !qn;
      const W = zr.querySelector("summary");
      W && (W.textContent = c.count() > 0 ? `♪ My albums (${c.count()})` : "♪ My albums");
      const dt = zr.querySelector(".ppp-shelf-body");
      qn && dt && !dt.contains(qn) && dt.replaceChildren(qn);
    }
    const Wn = a.renderFold(d);
    if (n(".ppp-gifts").hidden = !Wn, Wn && !n(".ppp-gift-body").contains(Wn) && n(".ppp-gift-body").replaceChildren(Wn), Wn && vt) {
      vt = !1;
      const W = n(".ppp-gifts");
      W.open = !0, requestAnimationFrame(() => W.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...Dt), n(".ppp-actions").replaceChildren(...ue), n(".ppp-actions2").replaceChildren(...yn);
    const Is = h.busy || h.message || "", bi = n(".ppp-msg"), rr = Is && yt.some((W) => (W.textContent ?? "").startsWith(Is.replace(/[.✓\s]+$/, ""))) ? "" : Is, mi = !rr && !h.error ? h.notice : st && !rr ? h.error : "";
    bi.textContent = rr || mi, bi.classList.toggle("is-warn", !!mi), n(".ppp-err").textContent = st ? "" : h.error;
    const w = h.entries.filter((W) => W.kind === "play");
    n(".ppp-recent").hidden = !h.entries.length, n(".ppp-recent-list").replaceChildren(...w.slice(0, 5).map((W) => {
      const dt = m("li"), Oe = W.status === "confirmed" ? "ok" : W.status === "failed" ? "bad" : "warn";
      return dt.append(m("span", "", "d " + Oe), m("span", Me(W), "t"), m("span", St(W.created), "ppp-mute")), W.txid && dt.append(rt("tx", k(W.txid))), dt;
    })), n(".ppp-wallets").hidden = !(kr.childElementCount || yn.length), n(".ppp-more").hidden = !Dt.length;
    const L = n(".ppp-history");
    L.hidden = !h.entries.length, h.entries.length && Ie(), L.replaceChildren(m("summary", `All activity (${h.entries.length})`), ...h.entries.slice(0, 20).map((W) => {
      const dt = m("div", "", "ppp-row"), Oe = W.kind === "play" ? [m("span", Me(W), "ppp-song"), m("span", ` · ${ur(BigInt(W.amount))} STX to ${et(W.recipient)}`, "ppp-mute")] : W.kind === "like" ? [m("span", `${W.liked ? "♥ Liked" : "Unliked"} ${Me(W)}`, "ppp-song"), m("span", ` · for ${h.linked ? et(h.linked) : "this listening wallet"}`, "ppp-mute")] : [m("span", `Returned ${ur(BigInt(W.amount))} STX`, "ppp-song"), m("span", ` to ${et(W.recipient)}`, "ppp-mute")];
      return dt.append(
        m("span", hn[W.status] || W.status, "ppp-status " + (ee[W.status] || "")),
        ...Oe,
        m("span", ` · ${new Date(W.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), W.txid && dt.append(rt("tx ↗", k(W.txid))), dt;
    })), y == null || y.render(Fr ? Un(h, Fr, [...$r, ...jr]) : null), x == null || x.render((fe == null ? void 0 : fe.mode) === "open" ? Un(h, fe, []) : null);
  }
  function yi(d) {
    var h;
    if (["off", "elsewhere", "not-invited"].includes(d.step)) return null;
    if (d.slot > 0 && ((h = d.gift) != null && h.player) && ["fund", "ready", "over", "link", "loading"].includes(d.step))
      return d.root && R({ root: d.root, slot: d.slot, player: d.gift.player }), { mode: "open", player: d.gift.player };
    const E = a.incomingAlbum();
    if (E) return { mode: "arrive", player: E.player, from: E.from, offered: E.plays };
    const v = B();
    return v && (d.step === "locked" || A && d.step === "loading") ? { mode: "locked", player: v.player } : null;
  }
  function Un(d, E, v) {
    var re, gn, he;
    const h = !!d.busy || d.armed, st = [...v];
    d.depositPending && d.arrival && st.push(ce(d.arrival)), d.error ? st.push(m("p", d.error, d.error === pc ? "ppp-warn" : "ppp-bad")) : d.message && !h ? st.push(m("p", d.message, "ppp-cyan")) : d.notice && st.push(m("p", d.notice, "ppp-warn")), E.mode === "open" && P && ((re = d.likeFunds) != null && re.album) && d.likeFunds.low && !d.likeFunds.pending && st.push(m("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    const pt = "Kept on this device with Face ID or your passkey. No app or account needed.";
    let At = null, de = null;
    return E.mode === "locked" ? (At = { label: "Continue listening", run: () => {
      A = B(), o.unlock();
    } }, de = { label: "Use a different passkey", run: () => {
      A = null, o.unlock(!0);
    } }) : E.mode === "arrive" && (d.step === "intro" ? (At = { label: "Open album", run: () => void o.create() }, de = { label: "I've used Xtrata Music here before", run: () => void o.unlock(!0) }) : d.step === "locked" ? (At = { label: "Open album", run: () => void o.unlock() }, de = { label: "Use a different passkey", run: () => void o.unlock(!0) }) : d.step === "unsupported" ? st.push(m("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : st.length || st.push(m("p", "Opening your album…", "ppp-cyan"))), {
      mode: E.mode,
      player: E.player,
      from: E.from,
      offered: E.offered,
      plays: E.mode === "open" ? d.balance === void 0 ? null : d.giftPlays : void 0,
      playsComing: d.depositPending,
      status: st,
      primary: At,
      secondary: de,
      hint: At ? pt : void 0,
      asking: h,
      busy: !!d.busy,
      myPlays: Qt(d),
      topUps: Da,
      canMake: !!((he = (gn = d.gate) == null ? void 0 : gn.gifts) != null && he.admin)
    };
  }
  const Kt = /* @__PURE__ */ new Map(), Ge = () => {
    const d = window.XtrataRadio;
    return d != null && d.subscribe ? (d.subscribe((E) => {
      const v = E == null ? void 0 : E.nowPlaying;
      v && Number.isSafeInteger(Number(v.tokenId)) && Kt.set(Number(v.tokenId), { title: v.title || void 0, artist: v.artist || void 0 });
    }), !0) : !1;
  };
  if (!Ge()) {
    const d = setInterval(() => {
      Ge() && clearInterval(d);
    }, 500);
    setTimeout(() => clearInterval(d), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (d) => {
    const E = d.detail;
    if (E && Number.isSafeInteger(E.song) && typeof E.id == "string" && /^[0-9a-f]{32}$/.test(E.id)) {
      Ie();
      const v = Be(E.song, Kt.get(E.song));
      o.onListened({ song: E.song, id: E.id, title: v.title || void 0, artist: v.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const Dk = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", Fk = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", i = e.userAgent.includes("Edge"), s = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return s ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && i === !1 && o === !1;
}, jk = () => Fk() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, zk = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, Rk = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', yw = class {
  constructor(t) {
    u4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && Tx(t), this.callback(Tc(t));
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
    var r, i, s, o, a, c, u, f, l, y;
    return n === "IOS" ? (i = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && i !== void 0 ? i : t.webUrl : e === "Chrome" ? (o = (s = t.chromeWebStoreUrl) !== null && s !== void 0 ? s : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (f = (u = t.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(t)) !== null && f !== void 0 ? f : t.webUrl : (y = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && y !== void 0 ? y : this.getMobileUrl(t);
  }
  render() {
    const t = jk(), e = zk(), n = this.defaultProviders.filter(
      (s) => this.installedProviders.findIndex((o) => o.id === s.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, i = n.length > 0;
    return kt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, kt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), kt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, kt("div", { class: "flex flex-col space-y-[10px]" }, kt("div", { class: "flex items-center" }, kt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), kt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, kt("span", { class: "sr-only" }, "Close popup"), kt("img", { src: Dk }))), r ? kt("p", null, "Select the wallet you want to connect to.") : kt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && kt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && kt("div", { class: "mt-6" }, kt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), kt("ul", { class: "space-y-3" }, this.installedProviders.map((s) => kt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, kt("div", { class: "aspect-square basis-9 overflow-hidden" }, kt("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), kt("div", { class: "flex-1" }, kt("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && kt("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), kt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(s.id) }, "Connect"))))), i && kt("div", { class: "mt-6" }, r ? kt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : kt("div", { class: "mb-5 flex justify-between" }, kt("p", { class: "text-sm font-medium" }, "Recommended wallets"), kt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, kt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, kt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), kt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), kt("p", null, "What is a wallet? ", kt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), kt("ul", { class: "space-y-3" }, n.map((s) => kt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, kt("div", { class: "aspect-square basis-9 overflow-hidden" }, kt("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), kt("div", { class: "flex-1" }, kt("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && kt("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), this.getInstallUrl(s, t, e) && kt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(s, t, e), rel: "noopener noreferrer", target: "_blank" }, s.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return KA(this);
  }
};
yw.style = Rk;
const Gk = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: yw
}, Symbol.toStringTag, { value: "Module" }));
